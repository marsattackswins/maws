import { logoBase } from "@/lib/maws/asset-logo";
import { normalizeAppSymbol } from "@/lib/market/resolve-provider";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type CachedLogo = { body: ArrayBuffer; type: string; source: string };

const logoCache = new Map<string, CachedLogo>();
let futuresLogoPromise: Promise<Map<string, string>> | null = null;
let cryptoLogoPromise: Promise<Map<string, string>> | null = null;

/**
 * Official Futures / TradFi symbol logos from Binance
 * (public.bnbstatic.com/image/symbol/logo/…).
 */
async function loadFuturesSymbolLogos(): Promise<Map<string, string>> {
  if (futuresLogoPromise) return futuresLogoPromise;
  futuresLogoPromise = (async () => {
    const map = new Map<string, string>();
    try {
      const res = await fetch(
        "https://www.binance.com/bapi/futures/v1/public/future/common/get-symbol-logo",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            clienttype: "web",
          },
          body: "{}",
          next: { revalidate: 3600 },
        },
      );
      if (!res.ok) return map;
      const json = (await res.json()) as {
        data?: Array<{ symbol?: string; baseAsset?: string; logo?: string }>;
      };
      for (const row of json.data ?? []) {
        if (!row.logo) continue;
        if (row.baseAsset) map.set(row.baseAsset.toUpperCase(), row.logo);
        if (row.symbol) {
          const sym = row.symbol.toUpperCase();
          map.set(sym, row.logo);
          map.set(sym.replace(/USDT$/i, ""), row.logo);
        }
      }
    } catch {
      /* ignore */
    }
    return map;
  })();
  return futuresLogoPromise;
}

/** Crypto logos from Binance marketing + asset catalogs. */
async function loadCryptoLogos(): Promise<Map<string, string>> {
  if (cryptoLogoPromise) return cryptoLogoPromise;
  cryptoLogoPromise = (async () => {
    const map = new Map<string, string>();
    const remember = (code: string, logo: string) => {
      const key = code.toUpperCase();
      if (!key || !logo || map.has(key)) return;
      map.set(key, logo);
    };

    try {
      const res = await fetch(
        "https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list",
        {
          headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0", clienttype: "web" },
          next: { revalidate: 86400 },
        },
      );
      if (res.ok) {
        const json = (await res.json()) as {
          data?: Array<{ baseAsset?: string; logo?: string }>;
        };
        for (const row of json.data ?? []) {
          if (row.baseAsset && row.logo) remember(row.baseAsset, row.logo);
        }
      }
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch(
        "https://www.binance.com/bapi/asset/v2/public/asset/asset/get-all-asset",
        {
          headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0", clienttype: "web" },
          next: { revalidate: 86400 },
        },
      );
      if (res.ok) {
        const json = (await res.json()) as {
          data?: Array<{ assetCode?: string; logoUrl?: string; fullLogoUrl?: string }>;
        };
        for (const row of json.data ?? []) {
          const logo = row.fullLogoUrl || row.logoUrl;
          if (row.assetCode && logo) remember(row.assetCode, logo);
        }
      }
    } catch {
      /* ignore */
    }

    return map;
  })();
  return cryptoLogoPromise;
}

async function fetchImage(url: string): Promise<CachedLogo | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return null;
    const body = await res.arrayBuffer();
    if (body.byteLength < 32) return null;
    return { body, type, source: "fetch" };
  } catch {
    return null;
  }
}

/**
 * GET /api/logo?symbol=MUUSDT
 * 1) Futures TradFi catalog → public.bnbstatic.com/image/symbol/logo/…
 * 2) Crypto marketing/asset logos + static/assets/logos/{BASE}.png
 */
export async function GET(req: NextRequest) {
  const symbol = normalizeAppSymbol(req.nextUrl.searchParams.get("symbol") ?? "");
  if (!/^[A-Z0-9]{2,32}$/.test(symbol)) {
    return new Response("Invalid symbol", { status: 400 });
  }

  const cacheKey = `${symbol}:v8`;
  const cached = logoCache.get(cacheKey);
  if (cached) {
    return new Response(cached.body, {
      status: 200,
      headers: {
        "Content-Type": cached.type,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "X-MAWS-Logo-Source": cached.source,
      },
    });
  }

  const base = logoBase(symbol);
  const [futures, crypto] = await Promise.all([
    loadFuturesSymbolLogos(),
    loadCryptoLogos(),
  ]);

  // Prefer Futures TradFi/commodity catalog (gold bars for XAU, etc.).
  // Never fall back to crypto/static when a futures logo exists — those
  // are a different product icon (e.g. XAUT/PAXG) and look "wrong" in TradFi.
  const urls: { url: string; source: string }[] = [];
  const futuresLogo = futures.get(base) ?? futures.get(symbol);
  if (futuresLogo) {
    urls.push({ url: futuresLogo, source: "futures" });
  } else {
    const cryptoLogo = crypto.get(base);
    if (cryptoLogo) urls.push({ url: cryptoLogo, source: "crypto" });
    urls.push({
      url: `https://bin.bnbstatic.com/static/assets/logos/${base}.png`,
      source: "static",
    });
  }

  const seen = new Set<string>();
  for (const { url, source } of urls) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const img = await fetchImage(url);
    if (!img) continue;
    const entry = { ...img, source };
    logoCache.set(cacheKey, entry);
    return new Response(img.body, {
      status: 200,
      headers: {
        "Content-Type": img.type,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "X-MAWS-Logo-Source": source,
      },
    });
  }

  return new Response("Logo not found", { status: 404 });
}
