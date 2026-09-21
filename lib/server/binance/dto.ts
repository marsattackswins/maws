import "server-only";

import { incomeTotals, incomeWatermark, type IncomeTotals } from "./income";
import { liveState } from "./state";

/** DTOs shaped for the existing MAWS UI entities (ChartPosition/ChartOrder style). */

export interface PositionDto {
  id: string;
  symbol: string;
  side: "long" | "short";
  entry: number;
  qty: number;
  tp: number | null;
  sl: number | null;
  leverage: number;
  liq: number | null;
  mark: number;
  unrealized: number;
  openedAt: number;
  /** Exchange-reported position value; mirrors Binance's positionNotional. */
  notional: number;
  /** Margin type from Binance positionRisk: "cross" or "isolated". */
  marginType?: string;
  /** Isolated margin amount from Binance positionRisk. */
  isolatedMargin?: number;
  /** Isolated wallet balance from Binance positionRisk. */
  isolatedWallet?: number;
}

export interface OrderDto {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "limit" | "stop";
  price: number;
  qty: number;
  reduceOnly: boolean;
  closePosition: boolean;
  time: number;
}

export interface AccountDto {
  balance: number;
  available: number;
  equity: number;
  margin: number;
  unrealized: number;
  fetchedAt: number | null;
}

export interface AccountMetricsDto {
  /** Lifetime realized trading PnL from the durable exchange income ledger. */
  realizedPnl: number;
  /** Lifetime commission cost as a positive magnitude. */
  commission: number;
  /** Lifetime funding fees, signed as reported (paid = negative). */
  fundingFee: number;
  /** realizedPnl − commission + fundingFee. */
  netRealized: number;
  /** Null when the income ledger has not synced yet. */
  fetchedAt: number | null;
}

export interface EquitySourceDto {
  /** Which equity derivation produced the displayed value. */
  equitySource: "exchange" | "fallback";
}

export interface FillDto {
  ts: number;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  realizedPnl: number;
}

export function positionsDto(): PositionDto[] {
  const state = liveState();
  const out: PositionDto[] = [];
  for (const p of state.positions.values()) {
    let tp: number | null = null;
    let sl: number | null = null;
    for (const o of state.openOrders.values()) {
      if (o.symbol !== p.symbol || !o.closePosition) continue;
      const sp = Number(o.stopPrice);
      if (!Number.isFinite(sp) || sp <= 0) continue;
      if (o.type === "TAKE_PROFIT_MARKET") tp = sp;
      if (o.type === "STOP_MARKET") sl = sp;
    }
    out.push({
      id: p.symbol,
      symbol: p.symbol,
      side: p.side,
      entry: Number(p.entryPrice),
      qty: Number(p.qty),
      tp,
      sl,
      leverage: Number(p.leverage) || 1,
      liq: Number(p.liquidationPrice) > 0 ? Number(p.liquidationPrice) : null,
      mark: Number(p.markPrice),
      unrealized: Number(p.unrealizedProfit),
      openedAt: p.updatedAt,
      notional: Number(p.notional),
      marginType: p.marginType,
      isolatedMargin: p.isolatedMargin != null ? Number(p.isolatedMargin) : undefined,
      isolatedWallet: p.isolatedWallet != null ? Number(p.isolatedWallet) : undefined,
    });
  }
  return out;
}

export function ordersDto(): OrderDto[] {
  const out: OrderDto[] = [];
  for (const o of liveState().openOrders.values()) {
    const isLimit = o.type === "LIMIT";
    const isStop = o.type === "STOP_MARKET" || o.type === "TAKE_PROFIT_MARKET" || o.type === "STOP" || o.type === "TAKE_PROFIT";
    if (!isLimit && !isStop) continue;
    out.push({
      id: o.clientOrderId,
      symbol: o.symbol,
      side: o.side === "BUY" ? "buy" : "sell",
      type: isLimit ? "limit" : "stop",
      price: isLimit ? Number(o.price) : Number(o.stopPrice),
      qty: Number(o.origQty),
      reduceOnly: o.reduceOnly,
      closePosition: o.closePosition,
      time: o.time,
    });
  }
  return out.sort((a, b) => b.time - a.time);
}

export function accountDto(): AccountDto & EquitySourceDto {
  const a = liveState().account;
  if (!a) {
    return { balance: 0, available: 0, equity: 0, margin: 0, unrealized: 0, fetchedAt: null, equitySource: "fallback" };
  }
  const balance = Number(a.totalWalletBalance);
  const unrealized = Number(a.unrealizedProfit);
  // Exchange-reported marginBalance is the authoritative equity: it is the
  // exchange's own wallet + unrealized sum (including funding/commission
  // effects). The wallet-plus-unrealized recomputation is only an
  // explicitly-defined fallback, used when no exchange value is known or
  // after ACCOUNT_UPDATE recomputed the sum locally (tracked provenance).
  const exchangeEquity = Number(a.marginBalance);
  const hasExchangeEquity = a.marginFromExchange === true && Number.isFinite(exchangeEquity) && a.marginBalance !== "";
  const equity = hasExchangeEquity ? exchangeEquity : balance + unrealized;
  const margin = Math.max(0, equity - Number(a.availableBalance));
  return {
    balance,
    available: Number(a.availableBalance),
    equity,
    margin,
    unrealized,
    fetchedAt: a.fetchedAt,
    equitySource: hasExchangeEquity ? "exchange" : "fallback",
  };
}

/**
 * Authoritative account metrics from the durable exchange income ledger.
 * Fills remain the trade-history record; this is the metrics source of truth.
 */
export function accountMetricsDto(): AccountMetricsDto & IncomeTotals {
  try {
    return {
      ...incomeTotals(),
      fetchedAt: incomeWatermark() > 0 ? incomeWatermark() : null,
    };
  } catch {
    // Ledger unavailable (e.g. pre-migration DB): expose zeros rather than
    // failing the whole state response.
    return { realizedPnl: 0, commission: 0, fundingFee: 0, netRealized: 0, fetchedAt: null };
  }
}

export function fillsDto(limit = 100): FillDto[] {
  const fills = liveState().fills.slice(-limit).reverse();
  return fills.map((f) => ({
    ts: f.ts,
    symbol: f.symbol,
    side: f.side === "BUY" ? "buy" : "sell",
    qty: Number(f.qty),
    price: Number(f.price),
    realizedPnl: Number(f.realizedPnl),
  }));
}
