import type { Candle, Quote, Timeframe } from "@/types";

export type FeedUpdateMeta = { tick?: boolean };

export type FeedListener = (
  candles: Candle[],
  quote: Quote,
  meta?: FeedUpdateMeta,
) => void;

/** Shared market-data provider contract (Binance Futures). */
export type MarketDataProvider = {
  setHotSymbols(symbols: Iterable<string>): void;
  getHotSymbols(): string[];
  getCandles(symbol: string, tf: Timeframe): Candle[];
  getQuote(symbol: string): Quote;
  getQuotes(): Quote[];
  subscribe(symbol: string, tf: Timeframe, listener: FeedListener): () => void;
  subscribeQuotes(listener: (quotes: Map<string, Quote>) => void): () => void;
  /**
   * Immediate (non-debounced) quote channel for the paper-trading engine.
   * Fires synchronously on every accepted quote mutation, before the ~150ms
   * UI batching used by subscribeQuotes consumers.
   */
  subscribeTradeQuotes(listener: (quotes: Map<string, Quote>) => void): () => void;
  /** Kline freshness state for a charted series (see BinanceFuturesFeed). */
  getKlineStatus(symbol: string, tf: Timeframe): "idle" | "connecting" | "live" | "delayed";
  isKlineDelayed(symbol: string, tf: Timeframe): boolean;
  isKlineRecovering(symbol: string, tf: Timeframe): boolean;
  start(): void;
  stop(): void;
  refreshQuotes(): void;
};

export type MarketProviderId = "binance";
