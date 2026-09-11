import { getFinnhubApiKey, FINNHUB_REST } from "@/lib/market/finnhub-server";
import {
  filterNewsByKeywords,
  filterNewsByToken,
  mapFinnhubRows,
  resolveNewsTarget,
  ymdUTC,
  type FinnhubNewsCategory,
  type NewsItem,
} from "@/lib/news";
import { resolveOperatorSession } from "@/lib/server/auth/session-guard";
import { serverConfig } from "@/lib/server/env/config";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Validate symbol parameter for Finnhub news requests.
 * Accepts alphanumeric + dot (for exchange tickers like 000660.KS) + .P suffix (stripped by resolveNewsTarget).
 * Empty/whitespace symbols are valid (market news mode).
 */
function isValidSymbol(symbol: string): boolean {
  if (symbol.length === 0) return true; // Empty is valid (market news)
  if (symbol.length > 32) return false; // Evidence-based max length
  return /^[A-Z0-9.P]+$/i.test(symbol); // Alphanumeric + dot + P (case-insensitive for .P)
}

async function fetchMarketCategory(
  key: string,
  category: FinnhubNewsCategory,
): Promise<{ items: NewsItem[]; error?: string }> {
  const url = new URL(`${FINNHUB_REST}/news`);
  url.searchParams.set("category", category);
  url.searchParams.set("token", key);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  const body = await res.text();
  if (!res.ok) {
    return { items: [], error: `Finnhub ${category} ${res.status}` };
  }
  let rows: unknown;
  try {
    rows = JSON.parse(body);
  } catch {
    return { items: [], error: `Invalid Finnhub ${category} response` };
  }
  if (!Array.isArray(rows)) {
    return { items: [], error: `Unexpected Finnhub ${category} payload` };
  }
  return { items: mapFinnhubRows(rows) };
}

/** Stock / equity company news (MU, TSLA, 000660.KS, …). */
async function fetchCompanyNews(
  key: string,
  finnhubSymbol: string,
): Promise<{ items: NewsItem[]; error?: string }> {
  const to = new Date();
  // Finnhub from/to are calendar dates; pull ~2 days then mapFinnhubRows keeps ≤24h.
  const from = new Date(to.getTime() - 2 * 86_400_000);
  const url = new URL(`${FINNHUB_REST}/company-news`);
  url.searchParams.set("symbol", finnhubSymbol);
  url.searchParams.set("from", ymdUTC(from));
  url.searchParams.set("to", ymdUTC(to));
  url.searchParams.set("token", key);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  const body = await res.text();
  if (!res.ok) {
    return { items: [], error: `Finnhub company-news ${res.status}` };
  }
  let rows: unknown;
  try {
    rows = JSON.parse(body);
  } catch {
    return { items: [], error: "Invalid Finnhub company-news response" };
  }
  if (!Array.isArray(rows)) {
    return { items: [], error: "Unexpected Finnhub company-news payload" };
  }
  return { items: mapFinnhubRows(rows) };
}

function mergeItems(batches: NewsItem[][]): NewsItem[] {
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const batch of batches) {
    for (const item of batch) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
    }
  }
  out.sort((a, b) => b.at - a.at);
  return out;
}

/**
 * Proxy Finnhub market / company news.
 * GET /api/news/finnhub?category=all|general|crypto|merger
 * GET /api/news/finnhub?symbol=MUUSDT   → Micron company news
 * GET /api/news/finnhub?symbol=XAUUSDT  → gold headlines from general
 */
export async function GET(req: NextRequest) {
  // Load server config (fail closed on error)
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return Response.json(
      { error: "Service unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Require operator session outside local mode
  if (cfg.env !== "local") {
    const session = resolveOperatorSession(req.headers.get("cookie"), cfg);
    if (!session) {
      return Response.json(
        { error: { code: "unauthenticated", message: "Sign in required" } },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  const { key, configured } = getFinnhubApiKey();
  if (!configured || !key) {
    return Response.json(
      { items: [] as NewsItem[], error: "FINNHUB_API_KEY is not configured", code: "NO_KEY" },
      { status: 503 },
    );
  }

  const symbol = req.nextUrl.searchParams.get("symbol")?.trim() || "";
  const categoryParam = req.nextUrl.searchParams.get("category")?.trim().toLowerCase();

  // Validate symbol before resolveNewsTarget() or any Finnhub fetch
  if (!isValidSymbol(symbol)) {
    return Response.json({ error: "Invalid symbol" }, { status: 400 });
  }

  try {
    // Asset-scoped news for the active chart / detail cards.
    if (symbol && (!categoryParam || categoryParam === "asset")) {
      const target = resolveNewsTarget(symbol);

      if (target.kind === "company") {
        const { items, error } = await fetchCompanyNews(key, target.finnhubSymbol);
        return Response.json(
          {
            items: items.slice(0, 40),
            label: target.label,
            mode: "company",
            ...(error ? { error } : {}),
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
              "X-MAWS-News": "finnhub-company",
            },
          },
        );
      }

      // Commodities / market keywords: search general (+ crypto when relevant).
      const cats: FinnhubNewsCategory[] =
        target.category === "crypto"
          ? ["crypto"]
          : target.keywords?.some((k) => /gold|silver|xau|xag|oil|crude/.test(k))
            ? ["general"]
            : [target.category === "merger" ? "general" : target.category];

      const batches = await Promise.all(cats.map((c) => fetchMarketCategory(key, c)));
      let items = mergeItems(batches.map((b) => b.items));
      if (target.keywords?.length) {
        const narrowed = filterNewsByKeywords(items, target.keywords);
        if (narrowed.length > 0) items = narrowed;
      } else if (target.filter) {
        const narrowed = filterNewsByToken(items, target.filter);
        if (narrowed.length > 0) items = narrowed;
      }
      const error = batches.map((b) => b.error).filter(Boolean).join("; ") || undefined;
      return Response.json(
        {
          items: items.slice(0, 40),
          label: target.label,
          mode: "market",
          ...(error && items.length === 0 ? { error } : {}),
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
            "X-MAWS-News": "finnhub",
          },
        },
      );
    }

    const category =
      categoryParam === "general" ||
      categoryParam === "crypto" ||
      categoryParam === "merger" ||
      categoryParam === "all"
        ? categoryParam
        : "all";

    if (category === "all") {
      const batches = await Promise.all([
        fetchMarketCategory(key, "general"),
        fetchMarketCategory(key, "crypto"),
      ]);
      const items = mergeItems(batches.map((b) => b.items)).slice(0, 80);
      const error = batches.map((b) => b.error).filter(Boolean).join("; ") || undefined;
      return Response.json(
        { items, ...(error && items.length === 0 ? { error } : {}) },
        {
          headers: {
            "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
            "X-MAWS-News": "finnhub",
          },
        },
      );
    }

    const { items, error } = await fetchMarketCategory(key, category);
    return Response.json(
      { items: items.slice(0, 60), ...(error ? { error } : {}) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
          "X-MAWS-News": "finnhub",
        },
      },
    );
  } catch (err) {
    return Response.json(
      {
        items: [] as NewsItem[],
        error: err instanceof Error ? err.message : "Finnhub fetch failed",
      },
      { status: 502 },
    );
  }
}
