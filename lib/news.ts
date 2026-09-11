import { getSymbol, tickerBase } from "@/lib/maws/universe";

export type NewsItem = {
  id: string;
  at: number;
  headline: string;
  summary?: string;
  source: string;
  url: string;
  image?: string;
  related?: string;
  category?: string;
};

export type NewsFetchResult = {
  items: NewsItem[];
  error?: string;
};

export type FinnhubNewsCategory = "general" | "crypto" | "merger";

/** How to pull Finnhub news for an app symbol (Binance perp). */
export type NewsTarget =
  | { kind: "company"; finnhubSymbol: string; label: string }
  | {
      kind: "market";
      category: FinnhubNewsCategory;
      filter?: string;
      keywords?: string[];
      label: string;
    };

type FinnhubNewsRow = {
  category?: string;
  datetime?: number;
  headline?: string;
  id?: number;
  image?: string;
  related?: string;
  source?: string;
  summary?: string;
  url?: string;
};

/** Explicit Binance TradFi base → Finnhub equity ticker. */
const EQUITY_FINNHUB: Record<string, string> = {
  MU: "MU",
  TSLA: "TSLA",
  NVDA: "NVDA",
  AAPL: "AAPL",
  AMZN: "AMZN",
  META: "META",
  GOOGL: "GOOGL",
  GOOG: "GOOG",
  MSFT: "MSFT",
  COIN: "COIN",
  MSTR: "MSTR",
  AMD: "AMD",
  INTC: "INTC",
  NFLX: "NFLX",
  BABA: "BABA",
  // SK hynix (KRX)
  SKHYNIX: "000660.KS",
  // Common HK / CN listings on Binance TradFi (best-effort)
  Tencent: "0700.HK",
  TENCENT: "0700.HK",
};

/** Commodity / metal bases → keyword search on general market news. */
const COMMODITY_KEYWORDS: Record<string, string[]> = {
  XAU: ["gold", "xau", "bullion", "yellow metal"],
  XAG: ["silver", "xag"],
  XPT: ["platinum"],
  XPD: ["palladium"],
  WTI: ["wti", "crude oil", "crude", "oil price"],
  BZ: ["brent", "crude oil", "oil price"],
  BRENT: ["brent", "crude oil"],
  CL: ["crude oil", "wti", "oil price"],
  NG: ["natural gas", "natgas"],
  COPPER: ["copper"],
};

const CRYPTO_ALIASES: Record<string, string[]> = {
  btc: ["btc", "bitcoin"],
  eth: ["eth", "ethereum", "ether"],
  sol: ["sol", "solana"],
  xrp: ["xrp", "ripple"],
  bnb: ["bnb", "binance coin"],
  doge: ["doge", "dogecoin"],
  link: ["link", "chainlink"],
};

function bareSymbol(symbol: string): string {
  return symbol.replace(/\.P$/i, "").toUpperCase();
}

/**
 * Resolve MAWS chart symbol → Finnhub news strategy.
 * MUUSDT.P → company MU; SKHYNIXUSDT.P → 000660.KS; XAUUSDT.P → gold keywords.
 */
export function resolveNewsTarget(symbol: string): NewsTarget {
  const bare = bareSymbol(symbol);
  const info = getSymbol(bare);
  const base = (info.base || tickerBase(bare) || bare.replace(/USDT$/i, "")).toUpperCase();
  const underlying = (info.underlyingType ?? "").toUpperCase();
  const name = info.name || base;

  // Commodities (gold, silver, oil, …)
  if (underlying === "COMMODITY" || COMMODITY_KEYWORDS[base]) {
    const keywords = COMMODITY_KEYWORDS[base] ?? [name.toLowerCase(), base.toLowerCase()];
    return {
      kind: "market",
      category: "general",
      keywords,
      label: name || base,
    };
  }

  // Equities / stock perps (Micron, SK hynix, Tesla, …)
  if (
    underlying.includes("EQUITY") ||
    underlying === "PREMARKET" ||
    EQUITY_FINNHUB[base]
  ) {
    const finnhubSymbol = EQUITY_FINNHUB[base] ?? base;
    return {
      kind: "company",
      finnhubSymbol,
      label: name && name !== base ? `${name} (${finnhubSymbol})` : finnhubSymbol,
    };
  }

  // Default: crypto perp
  return {
    kind: "market",
    category: "crypto",
    filter: base,
    keywords: CRYPTO_ALIASES[base.toLowerCase()] ?? [base.toLowerCase()],
    label: name || base,
  };
}

/** @deprecated use resolveNewsTarget */
export function newsQueryForSymbol(symbol: string): {
  category: "general" | "crypto";
  filter?: string;
} {
  const t = resolveNewsTarget(symbol);
  if (t.kind === "company") return { category: "general", filter: t.finnhubSymbol };
  return {
    category: t.category === "crypto" ? "crypto" : "general",
    filter: t.filter,
  };
}

/** Drop headlines older than this (default 24h). */
export const NEWS_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Publishers we never show (matched case-insensitively against Finnhub `source`). */
const BLOCKED_NEWS_SOURCES = new Set(["cointelegraph"]);

function isBlockedNewsSource(source?: string): boolean {
  const s = source?.trim().toLowerCase();
  return Boolean(s && BLOCKED_NEWS_SOURCES.has(s));
}

/** Finnhub summaries sometimes include raw HTML tags — strip to plain text. */
function stripHtml(input: string): string {
  return input
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterNewsByMaxAge(
  items: NewsItem[],
  maxAgeMs = NEWS_MAX_AGE_MS,
  now = Date.now(),
): NewsItem[] {
  const cutoff = now - maxAgeMs;
  return items.filter((item) => item.at >= cutoff);
}

export function mapFinnhubRows(
  rows: FinnhubNewsRow[],
  opts?: { maxAgeMs?: number; now?: number },
): NewsItem[] {
  const maxAgeMs = opts?.maxAgeMs ?? NEWS_MAX_AGE_MS;
  const now = opts?.now ?? Date.now();
  const cutoff = now - maxAgeMs;
  const out: NewsItem[] = [];
  for (const row of rows) {
    if (!row?.headline || !row.datetime) continue;
    if (isBlockedNewsSource(row.source)) continue;
    const at = row.datetime * 1000;
    if (!Number.isFinite(at) || at < cutoff) continue;
    const summary = row.summary ? stripHtml(row.summary) : "";
    out.push({
      id: `fh-${row.id ?? `${row.datetime}-${row.headline.slice(0, 24)}`}`,
      at,
      headline: stripHtml(row.headline),
      summary: summary || undefined,
      source: row.source?.trim() || "Finnhub",
      url: row.url?.trim() || "",
      image: row.image?.trim() || undefined,
      related: row.related?.trim() || undefined,
      category: row.category?.trim() || undefined,
    });
  }
  out.sort((a, b) => b.at - a.at);
  return out;
}

export function filterNewsByKeywords(items: NewsItem[], keywords?: string[]): NewsItem[] {
  if (!keywords?.length) return items;
  const needles = keywords.map((k) => k.toLowerCase());
  return items.filter((item) => {
    const hay = `${item.headline} ${item.summary ?? ""} ${item.related ?? ""}`.toLowerCase();
    return needles.some((n) => hay.includes(n));
  });
}

export function filterNewsByToken(items: NewsItem[], token?: string): NewsItem[] {
  if (!token) return items;
  const t = token.toLowerCase();
  const needles = CRYPTO_ALIASES[t] ?? [t];
  return filterNewsByKeywords(items, needles);
}

const NEWS_CACHE_TTL = 2 * 60 * 1000;
const newsCache = new Map<string, { items: NewsItem[]; error?: string; ts: number }>();
const inflightNews = new Map<string, Promise<NewsFetchResult>>();

export async function fetchNews(
  opts?: {
    symbol?: string;
    category?: "general" | "crypto" | "merger" | "all";
  },
  signal?: AbortSignal,
): Promise<NewsFetchResult> {
  const params = new URLSearchParams();
  if (opts?.symbol) params.set("symbol", opts.symbol);
  if (opts?.category) params.set("category", opts.category);
  const qs = params.toString();
  const key = qs || "__all__";

  const cached = newsCache.get(key);
  if (cached && Date.now() - cached.ts < NEWS_CACHE_TTL) {
    return { items: cached.items, error: cached.error };
  }

  const existing = inflightNews.get(key);
  if (existing) return existing;

  const promise = (async (): Promise<NewsFetchResult> => {
    try {
      const res = await fetch(`/api/news/finnhub${qs ? `?${qs}` : ""}`, {
        cache: "default",
        signal,
      });
      const raw = (await res.json()) as
        | { items?: NewsItem[]; error?: string; label?: string }
        | NewsItem[];
      if (!res.ok) {
        const err =
          !Array.isArray(raw) && raw.error
            ? raw.error
            : `News unavailable (${res.status})`;
        const result = { items: [] as NewsItem[], error: err };
        newsCache.set(key, { ...result, ts: Date.now() });
        return result;
      }
      const items = Array.isArray(raw) ? raw : (raw.items ?? []);
      const error = Array.isArray(raw) ? undefined : raw.error;
      const result = { items, error };
      newsCache.set(key, { ...result, ts: Date.now() });
      return result;
    } catch (e) {
      if ((e as Error).name === "AbortError") return { items: [] };
      return { items: [], error: "Network error" };
    } finally {
      inflightNews.delete(key);
    }
  })();

  inflightNews.set(key, promise);
  return promise;
}

export function formatNewsAge(at: number, now = Date.now()): string {
  const mins = Math.max(0, Math.round((now - at) / 60_000));
  if (mins < 1) return "just now";
  if (mins === 1) return "1 minute ago";
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.round(mins / 60);
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}

export function ymdUTC(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
