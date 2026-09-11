import { normalizeAppSymbol } from "@/lib/market/resolve-provider";
import { tickerBase } from "@/lib/maws/universe";

export function logoBase(symbol: string): string {
  let base = tickerBase(symbol).toUpperCase();
  if (base.startsWith("1000000")) base = base.slice(7);
  else if (base.startsWith("1000")) base = base.slice(4);
  return base;
}

/** Same-origin logo URL (Binance CDN via proxy). */
export function assetLogoSrc(symbol: string): string {
  const bare = normalizeAppSymbol(symbol);
  return `/api/logo?symbol=${encodeURIComponent(bare)}&v=8`;
}

export function assetLogoLetter(symbol: string): string {
  return logoBase(symbol).slice(0, 1) || "?";
}
