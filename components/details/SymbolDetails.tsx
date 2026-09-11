"use client";

import { AssetLogo } from "@/components/brand/AssetLogo";
import { leanFromRsi, TechnicalsGauge } from "@/components/details/TechnicalsGauge";
import { seasonalSeries } from "@/lib/maws/details";
import { formatPrice, mawsFeed } from "@/lib/maws/feed";
import { formatTicker, getSymbol } from "@/lib/maws/universe";
import { fetchNews, formatNewsAge, type NewsItem } from "@/lib/news";
import { useActivePane, useAppStore } from "@/lib/store";
import { useQuote } from "@/lib/use-quotes";
import { Ellipsis, LayoutGrid, Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function periodReturn(closes: number[], bars: number): number | null {
  if (closes.length <= bars) return null;
  const now = closes[closes.length - 1];
  const then = closes[closes.length - 1 - bars];
  if (!then) return null;
  return ((now - then) / then) * 100;
}

function Seasonals({
  symbol,
  daily,
}: {
  symbol: string;
  daily: ReturnType<typeof mawsFeed.getCandles>;
}) {
  const series = useMemo(() => seasonalSeries(symbol, daily), [symbol, daily]);
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const min = Math.min(...allY, 90);
  const max = Math.max(...allY, 110);
  const span = max - min || 1;
  const w = 280;
  const h = 78;
  const path = (pts: { x: number; y: number }[]) =>
    pts
      .map((p, i) => {
        const x = 8 + p.x * (w - 16);
        const y = h - 14 - ((p.y - min) / span) * (h - 22);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div className="px-3 py-2">
      <div className="mb-1 text-[13px] font-semibold text-[#d1d4dc]">Seasonals</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[78px] w-full">
        {series.map((s) => (
          <path key={s.year} d={path(s.points)} fill="none" stroke={s.color} strokeWidth={s === series[series.length - 1] ? 2.2 : 1.4} />
        ))}
        {series[series.length - 1]?.points.slice(-1).map((p) => {
          const x = 8 + p.x * (w - 16);
          const y = h - 14 - ((p.y - min) / span) * (h - 22);
          return (
            <circle
              key="now"
              cx={x}
              cy={y}
              r="3.2"
              fill={series[series.length - 1].color}
            />
          );
        })}
        <text x="8" y={h - 2} fill="#4c525e" fontSize="10">
          Jan
        </text>
        <text x={w / 2 - 8} y={h - 2} fill="#4c525e" fontSize="10">
          Jun
        </text>
        <text x={w - 28} y={h - 2} fill="#4c525e" fontSize="10">
          Nov
        </text>
      </svg>
      <div className="mt-1 flex items-center justify-between">
        <div className="flex gap-3 text-[11px]">
          {series.map((s) => (
            <span key={s.year} className="flex items-center gap-1 text-[#787b86]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
              {s.year}
            </span>
          ))}
        </div>
        <span className="rounded-full border border-[#222222] px-2 py-[2px] text-[11px] text-[#787b86]">
          More seasonals
        </span>
      </div>
    </div>
  );
}

export function SymbolDetails() {
  const pane = useActivePane();
  const quote = useQuote(pane.symbol);
  const info = getSymbol(pane.symbol);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setRightDock = useAppStore((s) => s.setRightDock);
  const latestNews = useAppStore((s) => s.chartSettings.latestNews);
  const [daily, setDaily] = useState(() =>
    mawsFeed.getCandles(pane.symbol, "1D").slice(),
  );
  const [headline, setHeadline] = useState<NewsItem | null>(null);

  // Pull daily history when the symbol changes; refresh only when 1D series updates.
  useEffect(() => {
    const pull = () => {
      const candles = mawsFeed.getCandles(pane.symbol, "1D");
      setDaily((prev) => {
        const last = candles.at(-1);
        const prevLast = prev.at(-1);
        if (
          prev.length === candles.length &&
          prevLast?.time === last?.time &&
          prevLast?.close === last?.close
        ) {
          return prev;
        }
        return candles.slice();
      });
    };
    pull();
    return mawsFeed.subscribe(pane.symbol, "1D", () => pull());
  }, [pane.symbol]);

  useEffect(() => {
    if (!latestNews) {
      setHeadline(null);
      return;
    }
    const ac = new AbortController();
    void fetchNews({ symbol: pane.symbol }, ac.signal).then((result) => {
      if (ac.signal.aborted) return;
      setHeadline(result.items[0] ?? null);
    });
    return () => {
      ac.abort();
    };
  }, [pane.symbol, latestNews]);

  const stats = useMemo(() => {
    const closes = daily.map((c) => c.close);
    return [
      ["1W", periodReturn(closes, 7)],
      ["1M", periodReturn(closes, 22)],
      ["3M", periodReturn(closes, 66)],
      ["6M", periodReturn(closes, 132)],
      ["YTD", periodReturn(closes, 180)],
      ["1Y", periodReturn(closes, 252)],
    ] as [string, number | null][];
  }, [daily]);

  const up = (quote?.changePct ?? 0) >= 0;

  return (
    <div className="min-h-0 flex-1 overflow-auto border-t border-[var(--maws-border)] bg-[var(--maws-panel)]">
      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex min-w-0 items-center gap-2">
          <AssetLogo symbol={pane.symbol} size={24} />
          <span className="truncate text-[15px] font-semibold text-[#d1d4dc]">{formatTicker(pane.symbol)}</span>
        </div>
        <div className="flex items-center gap-0.5 text-[#787b86]">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[#222222]"
            title="Watchlist"
            onClick={() => setRightDock("strategy")}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[#222222]"
            title="Change symbol"
            onClick={() => setSearchOpen(true)}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[#222222]"
            title="More"
          >
            <Ellipsis size={14} />
          </button>
        </div>
      </div>

      <div className="px-3 pt-0.5 text-[11px] leading-4 text-[#787b86]">
        {info.name} / TetherUS PERPETUAL CONTRACT
        <span className="ml-2">BINANCE</span>
        <span className="ml-2">Swap • Crypto</span>
      </div>

      <div className="px-3 pt-3">
        <div className="text-[28px] leading-none font-semibold tracking-tight text-[#d1d4dc]">
          {quote ? formatPrice(pane.symbol, quote.last) : "—"}
          <span className="ml-1 text-[13px] font-normal text-[#787b86]">{info.quote}</span>
        </div>
        <div className={`mt-1.5 text-[13px] ${up ? "text-[#089981]" : "text-[#f23645]"}`}>
          {quote
            ? `${up ? "+" : ""}${formatPrice(pane.symbol, quote.change)}  ${up ? "+" : ""}${quote.changePct.toFixed(2)}%`
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

      <div className="px-3 pb-3">
        <div className="mb-2 text-[13px] font-semibold text-[#d1d4dc]">Performance</div>
        <div className="grid grid-cols-3 gap-1.5">
          {stats.map(([label, value]) => {
            const pos = (value ?? 0) >= 0;
            return (
              <div
                key={label}
                className={`rounded-[6px] px-2 py-2 ${
                  value == null
                    ? "bg-[var(--maws-elevated)]"
                    : pos
                      ? "bg-[#0e3d38]"
                      : "bg-[#3d1a22]"
                }`}
              >
                <div
                  className={`text-[15px] font-semibold ${
                    value == null ? "text-[#4c525e]" : pos ? "text-[#089981]" : "text-[#f23645]"
                  }`}
                >
                  {value == null ? "—" : `${value.toFixed(2)}%`}
                </div>
                <div className="text-[11px] text-[#787b86]">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Seasonals symbol={pane.symbol} daily={daily} />
      <TechnicalsGauge lean={leanFromRsi(quote?.rsi ?? 70)} />
    </div>
  );
}
