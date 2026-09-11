"use client";

import { AssetLogo } from "@/components/brand/AssetLogo";
import {
  leanFromScreener,
  TechnicalsGauge,
} from "@/components/details/TechnicalsGauge";
import { formatPrice } from "@/lib/maws/feed";
import { formatTicker, getSymbol } from "@/lib/maws/universe";
import { fetchNews, formatNewsAge, type NewsItem } from "@/lib/news";
import { useAppStore } from "@/lib/store";
import type { StrategyRow } from "@/lib/strategy-screener";
import { useQuote } from "@/lib/use-quotes";
import { useEffect, useState } from "react";

/** Active-symbol name, price, market state, news, and technicals for the strategy dock. */
export function StrategySymbolPanel({
  symbol,
  row,
}: {
  symbol: string;
  /** Live screener row for this symbol; drives the technicals gauge. */
  row?: StrategyRow | null;
}) {
  const quote = useQuote(symbol);
  const info = getSymbol(symbol);
  const latestNews = useAppStore((s) => s.chartSettings.latestNews);
  const setRightDock = useAppStore((s) => s.setRightDock);
  const up = (quote?.changePct ?? 0) >= 0;
  const lean = leanFromScreener(row?.bullishMet ?? 0, row?.bearishMet ?? 0);
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
    <div className="min-h-0 flex-1 overflow-auto border-t border-[#1a1a1a] bg-black">
      <div className="flex items-center gap-2 px-3 pt-2">
        <AssetLogo symbol={symbol} size={24} />
        <span className="truncate text-[15px] font-semibold text-[#d1d4dc]">
          {formatTicker(symbol)}
        </span>
      </div>

      <div className="px-3 pt-0.5 text-[11px] leading-4 text-[#787b86]">
        {info.name} / TetherUS PERPETUAL CONTRACT
        <span className="ml-2">BINANCE</span>
        <span className="ml-2">Swap • Crypto</span>
      </div>

      <div className="px-3 pt-3">
        <div className="text-[28px] leading-none font-semibold tracking-tight text-[#d1d4dc]">
          {quote ? formatPrice(symbol, quote.last) : "—"}
          <span className="ml-1 text-[13px] font-normal text-[#787b86]">{info.quote}</span>
        </div>
        <div className={`mt-1.5 text-[13px] ${up ? "text-[#089981]" : "text-[#f23645]"}`}>
          {quote
            ? `${up ? "+" : ""}${formatPrice(symbol, quote.change)}  ${up ? "+" : ""}${quote.changePct.toFixed(2)}%`
            : "—"}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#089981]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#089981]" />
          Market open
        </div>
      </div>

      {latestNews ? (
        <div className="px-3 py-3">
          <div className="rounded-[8px] bg-[#2a2148] px-3 py-2.5">
            <div className="text-[11px] text-[#b39ddb]">
              News
              {headline ? ` • ${formatNewsAge(headline.at)}` : ""}
            </div>
            <div className="mt-1 text-[13px] leading-[18px] text-[#e8e0f8]">
              {headline?.headline ?? "No Finnhub headlines yet — open News for the full feed."}
            </div>
            <button
              type="button"
              className="mt-2 text-[12px] text-[#ce93d8]"
              onClick={() => setRightDock("calendar")}
            >
              More news ›
            </button>
          </div>
        </div>
      ) : null}

      <TechnicalsGauge lean={lean} />
    </div>
  );
}
