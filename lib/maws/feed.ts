import { getSymbol } from "@/lib/maws/universe";

/** Binance Futures market data (crypto / commodities / TradFi perps). */
export { compositeMarketFeed as mawsFeed } from "@/lib/market/composite-feed";
export type { FeedUpdateMeta, MarketDataProvider } from "@/lib/market/feed-types";
export { binanceFuturesFeed } from "@/lib/market/binance-feed";
export { normalizeAppSymbol } from "@/lib/market/resolve-provider";

/** `toLocaleString` builds a fresh formatter per call (locale parse + ICU setup) —
 *  ~1% of idle CPU before this cache, and it runs for every quote tick, watchlist
 *  row and axis label. One formatter per precision, memoized for the process. */
const priceFormatters = new Map<number, Intl.NumberFormat>();

function priceFormatter(precision: number): Intl.NumberFormat {
  let f = priceFormatters.get(precision);
  if (!f) {
    f = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
    priceFormatters.set(precision, f);
  }
  return f;
}

export function formatPrice(symbol: string, value: number): string {
  const { precision } = getSymbol(symbol);
  return priceFormatter(precision).format(value);
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}
