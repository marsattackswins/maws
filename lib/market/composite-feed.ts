import { binanceFuturesFeed } from "@/lib/market/binance-feed";
import type { FeedListener, MarketDataProvider } from "@/lib/market/feed-types";
import { normalizeAppSymbol } from "@/lib/market/resolve-provider";
import type { Candle, Quote, Timeframe } from "@/types";

/**
 * App market-data entry point — Binance USDT-M futures only
 * (crypto / commodities / TradFi perps).
 */
class CompositeMarketFeed implements MarketDataProvider {
  private hotSymbols = new Set<string>();

  setHotSymbols(symbols: Iterable<string>) {
    const next = new Set<string>();
    const binance: string[] = [];
    for (const raw of symbols) {
      const sym = normalizeAppSymbol(raw);
      if (!sym) continue;
      next.add(sym);
      binance.push(sym);
    }
    this.hotSymbols = next;
    binanceFuturesFeed.setHotSymbols(binance);
  }

  getHotSymbols(): string[] {
    return [...this.hotSymbols];
  }

  getCandles(symbol: string, tf: Timeframe): Candle[] {
    return binanceFuturesFeed.getCandles(normalizeAppSymbol(symbol), tf);
  }

  getQuote(symbol: string): Quote {
    return binanceFuturesFeed.getQuote(normalizeAppSymbol(symbol));
  }

  getQuotes(): Quote[] {
    return [...this.hotSymbols].map((s) => this.getQuote(s));
  }

  subscribe(symbol: string, tf: Timeframe, listener: FeedListener): () => void {
    return binanceFuturesFeed.subscribe(normalizeAppSymbol(symbol), tf, listener);
  }

  subscribeQuotes(listener: (quotes: Map<string, Quote>) => void): () => void {
    return binanceFuturesFeed.subscribeQuotes(listener);
  }

  subscribeTradeQuotes(listener: (quotes: Map<string, Quote>) => void): () => void {
    return binanceFuturesFeed.subscribeTradeQuotes(listener);
  }

  getKlineStatus(symbol: string, tf: Timeframe): "idle" | "connecting" | "live" | "delayed" {
    return binanceFuturesFeed.getKlineStatus(normalizeAppSymbol(symbol), tf);
  }

  isKlineDelayed(symbol: string, tf: Timeframe): boolean {
    return binanceFuturesFeed.isKlineDelayed(normalizeAppSymbol(symbol), tf);
  }

  isKlineRecovering(symbol: string, tf: Timeframe): boolean {
    return binanceFuturesFeed.isKlineRecovering(normalizeAppSymbol(symbol), tf);
  }

  start() {
    binanceFuturesFeed.start();
  }

  stop() {
    binanceFuturesFeed.stop();
  }

  refreshQuotes() {
    binanceFuturesFeed.refreshQuotes();
  }
}

export const compositeMarketFeed = new CompositeMarketFeed();
