/**
 * vela-feed-adapter.ts
 *
 * Vela's native BinanceProvider drives the charts: it fetches its own
 * paginated history (REST) and streams its own kline WebSocket — no Next.js
 * API routes and no MAWS feed cache in the chart data path. Trading state
 * (positions, orders, TP/SL, PnL) still flows through MAWS; this file only
 * maps symbols between the two conventions.
 */
import { BinanceProvider } from "@/lib/charting/data/providers/binance";
import { toBinanceSymbol } from "@/lib/market/binance-intervals";

/** Singleton shared across all Vela chart instances. */
export const mawsVelaProvider = new BinanceProvider();

/**
 * MAWS symbol → Vela ticker.
 *
 * MAWS trades exclusively on Binance USDT-M futures but stores symbols bare
 * ("BTCUSDT"); Vela's provider uses `.P` to select the futures endpoint
 * (bare = spot). Apply MAWS's futures alias map (MATICUSDT→POLUSDT,
 * PEPEUSDT→1000PEPEUSDT) first so Vela queries the listed contract.
 */
export function toVelaTicker(symbol: string): string {
  const s = String(symbol ?? "").toUpperCase().replace(/\.P$/i, "");
  return `${toBinanceSymbol(s)}.P`;
}

/**
 * Vela ticker → MAWS symbol: strip the futures suffix and reverse the alias
 * map, matching what the rest of MAWS keeps in its store.
 */
export function fromVelaTicker(ticker: string): string {
  const t = String(ticker ?? "").trim().toUpperCase().replace(/\.P$/i, "");
  for (const [app, bin] of Object.entries(ALIASES)) {
    if (bin === t) return app;
  }
  return t;
}

const ALIASES: Record<string, string> = {
  MATICUSDT: "POLUSDT",
  PEPEUSDT: "1000PEPEUSDT",
};
