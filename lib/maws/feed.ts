import { getSymbol } from "@/lib/maws/universe";

/** Binance Futures market data (crypto / commodities / TradFi perps). */
export { compositeMarketFeed as mawsFeed } from "@/lib/market/composite-feed";
export type { FeedUpdateMeta, MarketDataProvider } from "@/lib/market/feed-types";
export { binanceFuturesFeed } from "@/lib/market/binance-feed";
export { normalizeAppSymbol } from "@/lib/market/resolve-provider";

export function formatPrice(symbol: string, value: number): string {
  const { precision } = getSymbol(symbol);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}
