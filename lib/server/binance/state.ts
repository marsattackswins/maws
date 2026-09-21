import "server-only";

import { getDb } from "../db/connection";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";
import { add, div, isNegative, isZero, mul, parseDec, toStr, type Dec } from "./decimal";
import type { AccountResponse, AccountUpdateEvent, BinanceOrder, OrderTradeUpdateEvent, PositionRiskRow } from "./types";

export interface LiveAccount {
  totalWalletBalance: string;
  availableBalance: string;
  unrealizedProfit: string;
  marginBalance: string;
  /** True while marginBalance still holds the exchange-reported value.
   *  ACCOUNT_UPDATE events recompute it locally, downgrading the source. */
  marginFromExchange: boolean;
  fetchedAt: number;
}

export interface LivePosition {
  symbol: string;
  side: "long" | "short";
  qty: string;
  entryPrice: string;
  markPrice: string;
  unrealizedProfit: string;
  leverage: string;
  liquidationPrice: string;
  notional: string;
  updatedAt: number;
}

export interface LiveOrder {
  clientOrderId: string;
  exchangeOrderId: number | null;
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  status: string;
  price: string;
  stopPrice: string;
  origQty: string;
  executedQty: string;
  avgPrice: string;
  reduceOnly: boolean;
  closePosition: boolean;
  time: number;
  updateTime: number;
}

export interface LiveFill {
  /** Binance trade id, or a deterministic fallback for legacy fixtures. */
  tradeId: string;
  ts: number;
  exchangeOrderId: number | null;
  clientOrderId: string;
  symbol: string;
  side: "BUY" | "SELL";
  qty: string;
  price: string;
  realizedPnl: string;
  source: "stream" | "rest";
}

export interface LiveState {
  account: LiveAccount | null;
  positions: Map<string, LivePosition>;
  openOrders: Map<string, LiveOrder>;
  orders: Map<string, LiveOrder>;
  fills: LiveFill[];
  lastEventTime: number | null;
  snapshotAt: number | null;
  /** Last leverage seen per symbol via ACCOUNT_CONFIG_UPDATE (fill events
   *  carry no leverage, so this seeds correct rows between snapshots). */
  symbolLeverage: Map<string, string>;
}

const WORKING_STATUSES = new Set(["NEW", "PARTIALLY_FILLED"]);

function createEmpty(): LiveState {
  return {
    account: null,
    positions: new Map(),
    openOrders: new Map(),
    orders: new Map(),
    fills: [],
    lastEventTime: null,
    snapshotAt: null,
    symbolLeverage: new Map(),
  };
}

let state = createEmpty();

export function liveState(): LiveState {
  return state;
}

export function clearLiveState(): void {
  state = createEmpty();
}

export function resetLiveStateForTests(): void {
  clearLiveState();
}

export function grossExposureUsd(): number {
  let total = 0;
  for (const p of state.positions.values()) {
    const qty = Number(p.qty);
    const mark = Number(p.markPrice) || Number(p.entryPrice);
    total += Math.abs(qty * mark);
  }
  return total;
}

export function balanceUsd(): number {
  return state.account ? Number(state.account.totalWalletBalance) : 0;
}

export function openPositionCount(): number {
  let count = 0;
  for (const p of state.positions.values()) {
    if (Number(p.qty) !== 0) count++;
  }
  return count;
}

function num(s: string): Dec {
  return parseDec(s || "0");
}

export function applyAccountSnapshot(account: AccountResponse, now = Date.now()): void {
  state.account = {
    totalWalletBalance: account.totalWalletBalance,
    availableBalance: account.availableBalance,
    unrealizedProfit: account.totalUnrealizedProfit,
    marginBalance: account.totalMarginBalance,
    marginFromExchange: true,
    fetchedAt: now,
  };
}

export function applyPositionSnapshot(rows: PositionRiskRow[], now = Date.now()): void {
  state.positions.clear();
  for (const r of rows) {
    const amt = num(r.positionAmt);
    if (isZero(amt)) continue;
    const absQty = isNegative(amt) ? toStr({ units: -amt.units, scale: amt.scale }) : toStr(amt);
    state.positions.set(r.symbol, {
      symbol: r.symbol,
      side: isNegative(amt) ? "short" : "long",
      qty: absQty,
      entryPrice: r.entryPrice,
      markPrice: r.markPrice,
      unrealizedProfit: r.unRealizedProfit,
      leverage: r.leverage,
      liquidationPrice: r.liquidationPrice,
      notional: r.notional ?? "",
      updatedAt: now,
    });
  }
}

/**
 * Refreshes a position's mark price and recomputes unrealized PnL from the
 * new mark. Keeps leverage/liquidation/notional from the last authoritative
 * snapshot so a lightweight poll never erases richer exchange fields.
 */
/** Returns true when the position's displayed values changed. */
export function applyMarkPrice(symbol: string, markPrice: string, now = Date.now()): boolean {
  const pos = state.positions.get(symbol);
  if (!pos || !Number.isFinite(Number(markPrice)) || Number(markPrice) <= 0) return false;
  const notional = Number(pos.qty) * Number(markPrice);
  const pnl = (Number(markPrice) - Number(pos.entryPrice)) * Number(pos.qty) * (pos.side === "short" ? -1 : 1);
  // Repair the 1x placeholder left by fill events before the first
  // authoritative position-risk snapshot arrives.
  const leverage = state.symbolLeverage.get(symbol) ?? pos.leverage;
  state.positions.set(symbol, {
    ...pos,
    markPrice: String(markPrice),
    unrealizedProfit: String(Number.isFinite(pnl) ? Number(pnl.toFixed(8)) : 0),
    notional: Number.isFinite(notional) ? String(Number(notional.toFixed(8))) : pos.notional,
    leverage,
    updatedAt: now,
  });
  return true;
}

/**
 * Records the exchange-side per-symbol leverage announced by
 * ACCOUNT_CONFIG_UPDATE (fired after POST /fapi/v1/leverage). Positions
 * created by later ACCOUNT_UPDATE fills have no leverage field, so this map
 * is the only timely source of the real value between position snapshots.
 * Returns true when an open position's displayed leverage was patched.
 */
export function applySymbolLeverage(symbol: string, leverage: string): boolean {
  const lev = Number(leverage);
  if (!Number.isFinite(lev) || lev < 1) return false;
  const normalized = String(Math.floor(lev));
  state.symbolLeverage.set(symbol, normalized);
  const pos = state.positions.get(symbol);
  if (pos && pos.leverage !== normalized) {
    state.positions.set(symbol, { ...pos, leverage: normalized });
    return true;
  }
  return false;
}

export function applyOpenOrdersSnapshot(rows: BinanceOrder[], now = Date.now()): void {
  state.openOrders.clear();
  for (const o of rows) {
    const live = normalizeBinanceOrder(o);
    if (WORKING_STATUSES.has(live.status)) state.openOrders.set(live.clientOrderId, live);
    state.orders.set(live.clientOrderId, live);
  }
  state.snapshotAt = now;
}

export function rememberOrder(o: BinanceOrder): void {
  const live = normalizeBinanceOrder(o);
  state.orders.set(live.clientOrderId, live);
  if (WORKING_STATUSES.has(live.status)) state.openOrders.set(live.clientOrderId, live);
  else state.openOrders.delete(live.clientOrderId);
}

export function normalizeBinanceOrder(o: BinanceOrder): LiveOrder {
  return {
    clientOrderId: o.clientOrderId,
    exchangeOrderId: o.orderId,
    symbol: o.symbol,
    side: o.side,
    type: o.type,
    status: o.status,
    price: o.price,
    stopPrice: o.stopPrice ?? "0",
    origQty: o.origQty,
    executedQty: o.executedQty,
    avgPrice: o.avgPrice ?? "0",
    reduceOnly: !!o.reduceOnly,
    closePosition: !!o.closePosition,
    time: o.time,
    updateTime: o.updateTime,
  };
}

/**
 * Applies an ORDER_TRADE_UPDATE event. Returns fills extracted from the
 * event (last filled qty > 0) so callers can persist/emit them.
 */
export function fillExecutionKey(input: { symbol: string; tradeId?: number; exchangeOrderId: number | null; ts: number; qty: string; price: string }): string {
  return input.tradeId != null
    ? String(input.tradeId)
    : `${input.symbol}:${input.exchangeOrderId ?? "unknown"}:${input.ts}:${input.qty}:${input.price}`;
}

export function fillExists(tradeId: string, profile: PersistenceProfile = activePersistenceProfile()): boolean {
  assertPersistenceProfile(profile);
  return Boolean(getDb().prepare(`SELECT 1 FROM fills_log WHERE profile_id = ? AND trade_id = ? LIMIT 1`).get(profile.id, tradeId));
}

/** Inserts a fill only once. The unique index is the final race-safe backstop. */
export function persistFill(fill: LiveFill, profile: PersistenceProfile = activePersistenceProfile()): boolean {
  assertPersistenceProfile(profile);
  const result = getDb()
    .prepare(
      `INSERT OR IGNORE INTO fills_log
       (profile_id, ts, trade_id, exchange_order_id, client_order_id, symbol, side, qty, price, realized_pnl, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(profile.id, fill.ts, fill.tradeId, fill.exchangeOrderId, fill.clientOrderId || null, fill.symbol, fill.side, fill.qty, fill.price, fill.realizedPnl, fill.source);
  return result.changes > 0;
}

export function rememberFill(fill: LiveFill): void {
  if (state.fills.some((existing) => existing.tradeId === fill.tradeId)) return;
  state.fills.push(fill);
  if (state.fills.length > 500) state.fills.splice(0, state.fills.length - 500);
}

export function applyOrderEvent(ev: OrderTradeUpdateEvent, skipTradeIds: ReadonlySet<string> = new Set()): LiveFill[] {
  const o = ev.o;
  const prev = state.orders.get(o.c);
  const order = buildOrderFromEvent(o, prev);
  state.orders.set(o.c, order);
  if (WORKING_STATUSES.has(o.X)) state.openOrders.set(o.c, order);
  else state.openOrders.delete(o.c);
  state.lastEventTime = Math.max(state.lastEventTime ?? 0, ev.E);

  return extractFill(o, skipTradeIds);
}

function buildOrderFromEvent(o: OrderTradeUpdateEvent["o"], prev?: LiveOrder): LiveOrder {
  const cumQty = num(o.z);
  let avgPrice = prev?.avgPrice && prev.avgPrice !== "0" ? prev.avgPrice : "0";
  // A replay or retry can reach this method after the order state was already
  // advanced. Do not apply the same last execution to the weighted average.
  if (prev?.executedQty !== o.z && !isZero(cumQty) && o.l && o.L && !isZero(num(o.l))) {
    const prevQty = prev ? num(prev.executedQty) : num("0");
    const prevAvg = avgPrice !== "0" ? num(avgPrice) : num("0");
    avgPrice = toStr(div(add(mul(prevAvg, prevQty), mul(num(o.L), num(o.l))), cumQty));
  }
  return {
    clientOrderId: o.c,
    exchangeOrderId: o.i,
    symbol: o.s,
    side: o.S,
    type: o.o,
    status: o.X,
    price: o.p,
    stopPrice: o.sp ?? "0",
    origQty: o.q,
    executedQty: o.z,
    avgPrice,
    reduceOnly: prev?.reduceOnly ?? false,
    closePosition: prev?.closePosition ?? false,
    time: prev?.time ?? o.T,
    updateTime: o.T,
  };
}

function extractFill(o: OrderTradeUpdateEvent["o"], skipTradeIds: ReadonlySet<string>): LiveFill[] {
  if (!o.l || isZero(num(o.l))) return [];
  const fill: LiveFill = {
    tradeId: fillExecutionKey({ symbol: o.s, tradeId: o.t, exchangeOrderId: o.i, ts: o.T, qty: o.l, price: o.L }),
    ts: o.T,
    exchangeOrderId: o.i,
    clientOrderId: o.c,
    symbol: o.s,
    side: o.S,
    qty: o.l,
    price: o.L,
    realizedPnl: o.rp,
    source: "stream",
  };
  return skipTradeIds.has(fill.tradeId) ? [] : [fill];
}

export function applyAccountEvent(ev: AccountUpdateEvent): void {
  const usdt = ev.a.B.find((b) => b.a === "USDT");
  if (usdt && state.account) {
    state.account = {
      ...state.account,
      totalWalletBalance: usdt.wb,
      availableBalance: usdt.cw,
      fetchedAt: ev.E,
    };
  } else if (usdt) {
    // No snapshot has arrived yet. ACCOUNT_UPDATE carries no exchange
    // marginBalance, so it is left empty: the DTO layer falls back to
    // wallet + unrealized until the next authoritative REST snapshot.
    state.account = {
      totalWalletBalance: usdt.wb,
      availableBalance: usdt.cw,
      unrealizedProfit: "0",
      marginBalance: "",
      marginFromExchange: false,
      fetchedAt: ev.E,
    };
  }
  for (const p of ev.a.P) {
    const amt = num(p.pa);
    if (isZero(amt)) {
      state.positions.delete(p.s);
      continue;
    }
    const prev = state.positions.get(p.s);
    const absQty = isNegative(amt) ? toStr({ units: -amt.units, scale: amt.scale }) : toStr(amt);
    // ACCOUNT_UPDATE carries no leverage field, so seed from the last
    // ACCOUNT_CONFIG_UPDATE instead of guessing 1x.
    const leverage = state.symbolLeverage.get(p.s) ?? prev?.leverage ?? "1";
    state.positions.set(p.s, {
      symbol: p.s,
      side: isNegative(amt) ? "short" : "long",
      qty: absQty,
      entryPrice: p.ep,
      markPrice: prev?.markPrice ?? p.ep,
      unrealizedProfit: p.up,
      leverage,
      liquidationPrice: prev?.liquidationPrice ?? "0",
      notional: prev?.notional ?? "",
      updatedAt: ev.E,
    });
  }
  // ACCOUNT_UPDATE does not carry aggregate margin fields. Rebuild the
  // available account values from its wallet/cross-wallet fields and the
  // currently known position P&L so the dashboard never retains old values.
  if (state.account) {
    let unrealized = 0;
    for (const position of state.positions.values()) unrealized += Number(position.unrealizedProfit) || 0;
    const wallet = Number(state.account.totalWalletBalance);
    state.account = {
      ...state.account,
      unrealizedProfit: String(unrealized),
      // The recomputed value is a local estimate, not the exchange's figure:
      // downgrade the provenance so the DTO reports the fallback source.
      marginBalance: Number.isFinite(wallet) ? String(wallet + unrealized) : state.account.marginBalance,
      marginFromExchange: false,
      fetchedAt: ev.E,
    };
  }
  state.lastEventTime = Math.max(state.lastEventTime ?? 0, ev.E);
}
