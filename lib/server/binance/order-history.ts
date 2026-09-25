import "server-only";

import { getDb } from "../db/connection";
import { log } from "../log/logger";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";
import type { BinanceRestClient } from "./rest";
import { rememberHistoricalOrder } from "./state";
import { isTerminalStatus } from "./types";
import type { BinanceOrder } from "./types";

/**
 * Durable history of exchange orders (from /fapi/v1/allOrders).
 *
 * This is a read-only record: imported rows must never drive execution, so
 * they live outside order_intents (whose lifecycle/freeze semantics describe
 * orders this server itself submitted) and outside the open-order state.
 */

export interface PersistedOrderRow {
  exchangeOrderId: number;
  clientOrderId: string;
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

/** One page of allOrders; Binance caps at 1000. */
const PAGE_LIMIT = 1000;
/** Bounded backfill: at most this many pages per symbol per pass. */
const MAX_PAGES_PER_PASS = 2;

/**
 * Parses an allOrders row into a PersistedOrderRow; returns null for rows
 * without the identity fields persistence relies on.
 */
export function normalizeHistoricalOrder(raw: Record<string, unknown>): PersistedOrderRow | null {
  const orderId = raw.orderId;
  const clientOrderId = raw.clientOrderId;
  if (typeof orderId !== "number" || !Number.isFinite(orderId)) return null;
  if (typeof clientOrderId !== "string" || clientOrderId === "") return null;
  return {
    exchangeOrderId: orderId,
    clientOrderId,
    symbol: typeof raw.symbol === "string" ? raw.symbol : "",
    side: raw.side === "SELL" ? "SELL" : "BUY",
    type: typeof raw.type === "string" ? raw.type : "",
    status: typeof raw.status === "string" ? raw.status : "",
    price: typeof raw.price === "string" ? raw.price : "0",
    stopPrice: typeof raw.stopPrice === "string" ? raw.stopPrice : "0",
    origQty: typeof raw.origQty === "string" ? raw.origQty : "0",
    executedQty: typeof raw.executedQty === "string" ? raw.executedQty : "0",
    avgPrice: typeof raw.avgPrice === "string" ? raw.avgPrice : "0",
    reduceOnly: raw.reduceOnly === true,
    closePosition: raw.closePosition === true,
    time: typeof raw.time === "number" && Number.isFinite(raw.time) ? raw.time : 0,
    updateTime: typeof raw.updateTime === "number" && Number.isFinite(raw.updateTime) ? raw.updateTime : 0,
  };
}

/** True when this exchange order was already persisted (insert-or-ignore no-ops). */
export function historicalOrderExists(exchangeOrderId: number, profile: PersistenceProfile = activePersistenceProfile()): boolean {
  assertPersistenceProfile(profile);
  return Boolean(
    getDb().prepare(`SELECT 1 FROM orders_log WHERE profile_id = ? AND exchange_order_id = ? LIMIT 1`).get(profile.id, String(exchangeOrderId)),
  );
}

/** Inserts one historical order idempotently. Returns true when newly persisted. */
export function persistHistoricalOrder(order: PersistedOrderRow, profile: PersistenceProfile = activePersistenceProfile()): boolean {
  assertPersistenceProfile(profile);
  const result = getDb()
    .prepare(
      `INSERT OR IGNORE INTO orders_log
       (profile_id, exchange_order_id, client_order_id, symbol, side, type, status, price, stop_price, orig_qty, executed_qty, avg_price, reduce_only, close_position, time, update_time, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      profile.id,
      String(order.exchangeOrderId),
      order.clientOrderId,
      order.symbol,
      order.side,
      order.type,
      order.status,
      order.price,
      order.stopPrice,
      order.origQty,
      order.executedQty,
      order.avgPrice,
      order.reduceOnly ? 1 : 0,
      order.closePosition ? 1 : 0,
      order.time,
      order.updateTime,
      "rest",
    );
  return result.changes > 0;
}

/** Symbols relevant to history: persisted fills plus current open positions. */
export function historySymbols(profile: PersistenceProfile, openSymbols: Iterable<string>): string[] {
  assertPersistenceProfile(profile);
  const symbols = new Set<string>();
  const fillRows = getDb().prepare(`SELECT DISTINCT symbol FROM fills_log WHERE profile_id = ?`).all(profile.id) as Array<{ symbol: string }>;
  for (const row of fillRows) symbols.add(row.symbol);
  for (const symbol of openSymbols) symbols.add(symbol);
  return [...symbols];
}

/**
 * Backfills terminal orders for the given symbols from /fapi/v1/allOrders.
 * Symbol-scoped and page-bounded; duplicate exchange order IDs are absorbed
 * by the (profile_id, exchange_order_id) unique index. Returns the number of
 * newly persisted orders.
 */
export async function backfillHistoricalOrders(
  rest: BinanceRestClient,
  symbols: Iterable<string>,
  profile: PersistenceProfile = activePersistenceProfile(),
  now = Date.now(),
): Promise<number> {
  assertPersistenceProfile(profile);
  const db = getDb();
  let inserted = 0;
  for (const symbol of symbols) {
    let page = 0;
    let lastOrderId: number | undefined;
    for (;;) {
      if (page >= MAX_PAGES_PER_PASS) break;
      const raw = await rest.getAllOrders(symbol, {
        endTime: now,
        limit: PAGE_LIMIT,
        ...(lastOrderId != null ? { orderId: lastOrderId } : {}),
      });
      if (!Array.isArray(raw) || raw.length === 0) break;
      const tx = db.transaction(() => {
        for (const entry of raw) {
          const order = normalizeHistoricalOrder(entry as unknown as Record<string, unknown>);
          if (!order || !isTerminalStatus(order.status)) continue;
          if (persistHistoricalOrder(order, profile)) inserted += 1;
        }
      });
      tx();
      if (raw.length < PAGE_LIMIT) break;
      // Full page: walk to the oldest order via orderId pagination (the API
      // returns orders with IDs >= the given one, so advance past the batch).
      const ids = raw.map((o) => o.orderId).filter((id) => Number.isFinite(id));
      if (ids.length === 0) break;
      const minId = Math.min(...ids);
      if (lastOrderId != null && minId <= lastOrderId) break; // defensive: no forward progress
      lastOrderId = minId;
      page += 1;
    }
  }
  return inserted;
}

/** Loads recent persisted historical orders, newest first. */
export function loadHistoricalOrders(profile: PersistenceProfile = activePersistenceProfile(), limit = 200): PersistedOrderRow[] {
  assertPersistenceProfile(profile);
  const rows = getDb()
    .prepare(
      `SELECT exchange_order_id, client_order_id, symbol, side, type, status, price, stop_price, orig_qty, executed_qty, avg_price, reduce_only, close_position, time, update_time
       FROM orders_log WHERE profile_id = ? ORDER BY time DESC, exchange_order_id DESC LIMIT ?`,
    )
    .all(profile.id, limit) as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    exchangeOrderId: Number(row.exchange_order_id),
    clientOrderId: row.client_order_id as string,
    symbol: row.symbol as string,
    side: row.side === "SELL" ? "SELL" : "BUY",
    type: row.type as string,
    status: row.status as string,
    price: (row.price as string) ?? "0",
    stopPrice: (row.stop_price as string) ?? "0",
    origQty: (row.orig_qty as string) ?? "0",
    executedQty: (row.executed_qty as string) ?? "0",
    avgPrice: (row.avg_price as string) ?? "0",
    reduceOnly: row.reduce_only === 1,
    closePosition: row.close_position === 1,
    time: row.time as number,
    updateTime: row.update_time as number,
  }));
}

/**
 * Startup import of persisted historical orders into the live order book.
 * Only terminal orders are remembered, and only in `state.orders` — never
 * `state.openOrders` — so imported history can never look like a live
 * execution command. Returns the number of orders hydrated.
 */
export function hydrateHistoricalOrders(profile: PersistenceProfile = activePersistenceProfile(), limit = 200): number {
  assertPersistenceProfile(profile);
  const orders = loadHistoricalOrders(profile, limit);
  let hydrated = 0;
  for (const order of orders) {
    if (!isTerminalStatus(order.status)) continue;
    if (rememberHistoricalOrder(order)) hydrated += 1;
  }
  if (hydrated > 0) log.info("historical orders hydrated", { count: hydrated, profile: profile.id });
  return hydrated;
}
