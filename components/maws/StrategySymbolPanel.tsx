"use client";

import { AssetLogo } from "@/components/brand/AssetLogo";
import { TechnicalsGauge } from "@/components/details/TechnicalsGauge";
import { MarketSessions } from "@/components/maws/MarketSessions";
import { formatPrice } from "@/lib/maws/feed";
import { formatTicker, getSymbol } from "@/lib/maws/universe";
import { fetchNews, formatNewsAge, type NewsItem } from "@/lib/news";
import { useAppStore } from "@/lib/store";
import { useQuote } from "@/lib/use-quotes";
import { useEffect, useState } from "react";

/** Active-symbol name, price, market state, and news for the watchlist dock. */
export function StrategySymbolPanel({
  symbol,
}: {
  symbol: string;
}) {
  const quote = useQuote(symbol);
  const info = getSymbol(symbol);
  const latestNews = useAppStore((s) => s.chartSettings.latestNews);
  const setRightDock = useAppStore((s) => s.setRightDock);
  const up = (quote?.changePct ?? 0) >= 0;
  const [headline, setHeadline] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (!latestNews) {
      setHeadline(null);
      return;
    }
    let cancelled = false;
    void fetchNews({ symbol }).then((result) => {
      if (cancelled) return;
      setHeadline(result.items[0] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [symbol, latestNews]);

  return (
    <div className="min-h-0 flex-1 overflow-auto border-t border-(--app-border) bg-(--app-panel)">
      <div className="flex items-center gap-2 px-3 pt-2">
        <AssetLogo symbol={symbol} size={24} />
        <span className="truncate text-[15px] font-semibold text-(--app-text)">
          {formatTicker(symbol)}
        </span>
      </div>

      <div className="px-3 pt-0.5 text-[11px] leading-4 text-(--app-muted)">
        {info.name} / TetherUS PERPETUAL CONTRACT
        <span className="ml-2">BINANCE</span>
        <span className="ml-2">Swap • Crypto</span>
      </div>

      <div className="px-3 pt-3">
        <div className="text-[28px] leading-none font-semibold tracking-tight text-(--app-text)">
          {quote ? formatPrice(symbol, quote.last) : "—"}
          <span className="ml-1 text-[13px] font-normal text-(--app-muted)">{info.quote}</span>
        </div>
        <div className={`mt-1.5 text-[13px] ${up ? "text-[#089981]" : "text-[#f23645]"}`}>
          {quote
            ? `${up ? "+" : ""}${formatPrice(symbol, quote.change)}  ${up ? "+" : ""}${quote.changePct.toFixed(2)}%`
            : "—"}
        </div>
      </div>

      {/* Trade-session clock — the same card Vela's own client shows under its
          watchlist, above the symbol's own dial. */}
      <MarketSessions />

      {latestNews ? (
        <div className="px-3 py-3">
          <div className="rounded-[8px] bg-(--app-elevated) px-3 py-2.5">
            <div className="text-[11px] text-(--app-muted)">
              News
              {headline ? ` • ${formatNewsAge(headline.at)}` : ""}
            </div>
            <div className="mt-1 text-[13px] leading-[18px] text-(--app-text)">
              {headline?.headline ?? "No Finnhub headlines yet — open News for the full feed."}
            </div>
            <button
              type="button"
              className="mt-2 text-[12px] text-(--app-muted) hover:text-(--app-text)"
              onClick={() => setRightDock("calendar")}
            >
              More news ›
            </button>
          </div>
        </div>
      ) : null}

      {/* Standalone decorative gauge (nothing computed yet — lean TBD later). */}
      <TechnicalsGauge lean="neutral" size={225} stroke={6} />
    </div>
  );
}
