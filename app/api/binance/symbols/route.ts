import { BINANCE_FAPI_REST } from "@/lib/market/binance-intervals";
import { mapUpstreamError, upstreamErrorResponse } from "@/lib/server/validation/proxy-error";
import type { SymbolInfo } from "@/types";

export const dynamic = "force-dynamic";

type BinanceFilter = { filterType: string; tickSize?: string };
type BinanceSymbol = {
  symbol: string;
  status: string;
  contractType: string;
  quoteAsset: string;
  baseAsset: string;
  underlyingType?: string;
  pricePrecision?: number;
  filters?: BinanceFilter[];
};

function precisionFromTick(tick: string | undefined, fallback: number): number {
  if (!tick) return fallback;
  const normalized = tick.replace(/0+$/, "").replace(/\.$/, "");
  const dot = normalized.indexOf(".");
  if (dot < 0) return 0;
  return normalized.length - dot - 1;
}

/**
 * Slim list of tradable Binance USDT-M perpetuals (crypto + TradFi).
 * GET /api/binance/symbols
 */
export async function GET() {
  try {
    const res = await fetch(`${BINANCE_FAPI_REST}/fapi/v1/exchangeInfo`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return mapUpstreamError(res.status);
    }

    let data: { symbols?: BinanceSymbol[] };
    try {
      data = (await res.json()) as { symbols?: BinanceSymbol[] };
    } catch {
      return upstreamErrorResponse();
    }

    const rows: SymbolInfo[] = [];
    for (const s of data.symbols ?? []) {
      if (s.status !== "TRADING" || s.quoteAsset !== "USDT") continue;
      if (s.contractType !== "PERPETUAL" && s.contractType !== "TRADIFI_PERPETUAL") continue;
      const tick = s.filters?.find((f) => f.filterType === "PRICE_FILTER")?.tickSize;
      const precision = precisionFromTick(tick, s.pricePrecision ?? 4);
      rows.push({
        symbol: s.symbol,
        base: s.baseAsset,
        quote: s.quoteAsset,
        name: s.baseAsset,
        precision,
        contractType: s.contractType,
        underlyingType: s.underlyingType,
      });
    }

    return Response.json(rows, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return upstreamErrorResponse();
  }
}
