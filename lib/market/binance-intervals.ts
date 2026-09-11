import type { Timeframe } from "@/types";

/** App timeframe → Binance USDT-M perpetual kline interval. */
export function toBinanceInterval(tf: Timeframe): string {
  const map: Record<Timeframe, string> = {
    "1m": "1m",
    "3m": "3m",
    "5m": "5m",
    "15m": "15m",
    "30m": "30m",
    "1h": "1h",
    "2h": "2h",
    "4h": "4h",
    "1D": "1d",
    "1W": "1w",
    "1M": "1M",
  };
  return map[tf] ?? "15m";
}

/**
 * Map app symbols → Binance USDT-M perpetual symbols.
 * Some alts only list as 1000× contracts on futures.
 */
const BINANCE_SYMBOL_ALIASES: Record<string, string> = {
  MATICUSDT: "POLUSDT",
  PEPEUSDT: "1000PEPEUSDT",
};

export function toBinanceSymbol(symbol: string): string {
  return BINANCE_SYMBOL_ALIASES[symbol] ?? symbol;
}

/** Reverse of toBinanceSymbol for inbound WS/REST payloads. */
export function fromBinanceSymbol(binanceSymbol: string): string {
  const upper = binanceSymbol.toUpperCase();
  for (const [app, bin] of Object.entries(BINANCE_SYMBOL_ALIASES)) {
    if (bin === upper) return app;
  }
  return upper;
}

/** USDT-M perpetual REST */
export const BINANCE_FAPI_REST = "https://fapi.binance.com";

/**
 * USDT-M futures market-data WebSocket host.
 * Kline streams must use the `/market` tier (see connect paths in the feed).
 * Legacy `/ws` on fstream.binance.com often opens then delivers no kline frames.
 * NEXT_PUBLIC_BINANCE_FAPI_WS may override this (UI smoke suite local feed).
 */
export const BINANCE_FAPI_WS =
  process.env.NEXT_PUBLIC_BINANCE_FAPI_WS ?? "wss://fstream.binance.com";

/** Fallback host when primary market WS fails on some networks. */
export const BINANCE_FAPI_WS_FALLBACK =
  process.env.NEXT_PUBLIC_BINANCE_FAPI_WS_FALLBACK ?? "wss://fstream.binancefuture.com";

/** @deprecated aliases */
export const BINANCE_SPOT_REST = BINANCE_FAPI_REST;
export const BINANCE_SPOT_WS = BINANCE_FAPI_WS;
