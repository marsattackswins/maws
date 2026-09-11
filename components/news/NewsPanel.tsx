"use client";

import { formatTicker } from "@/lib/maws/universe";
import { fetchNews, formatNewsAge, type NewsItem } from "@/lib/news";
import { useActivePane, useAppStore } from "@/lib/store";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

type NewsTab = "asset" | "all";

const TABS: { id: NewsTab; label: string }[] = [
  { id: "asset", label: "Asset specific news" },
  { id: "all", label: "All news" },
];

function NewsRow({ item, now }: { item: NewsItem; now: number }) {
  const open = Boolean(item.url);
  return (
    <button
      type="button"
      disabled={!open}
      onClick={() => {
        if (!item.url) return;
        window.open(item.url, "_blank", "noopener,noreferrer");
      }}
      className={`block w-full rounded-md border border-[var(--maws-border)] bg-[var(--maws-panel)] px-3 py-2.5 text-left transition-colors ${
        open
          ? "cursor-pointer hover:border-[#2a2a2a] hover:bg-[var(--maws-elevated)]"
          : "cursor-default opacity-80"
      }`}
    >
      <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wide text-[#787b86]">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate">
            {item.source}
            {item.category ? ` · ${item.category}` : ""}
          </span>
          {open ? (
            <ExternalLink size={10} className="shrink-0 text-[#5b9cf6]" aria-hidden />
          ) : null}
        </span>
        <span className="shrink-0 normal-case tracking-normal">{formatNewsAge(item.at, now)}</span>
      </div>
      <div className="mt-1 text-[13px] leading-[18px] font-medium text-[#d1d4dc]">
        {item.headline}
      </div>
      {item.summary ? (
        <div className="mt-1 line-clamp-2 text-[11px] leading-[15px] text-[#787b86]">
          {item.summary}
        </div>
      ) : null}
    </button>
  );
}

export function NewsPanel() {
  const pane = useActivePane();
  const latestNews = useAppStore((s) => s.chartSettings.latestNews);
  const [tab, setTab] = useState<NewsTab>("asset");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!latestNews) return;
    const ac = new AbortController();
    setLoading(true);
    const req =
      tab === "asset"
        ? fetchNews({ symbol: pane.symbol }, ac.signal)
        : fetchNews({ category: "all" }, ac.signal);
    void req.then((result) => {
      if (ac.signal.aborted) return;
      setItems(result.items);
      setError(result.error ?? null);
      setLoading(false);
    });
    return () => {
      ac.abort();
    };
  }, [tab, pane.symbol, latestNews, reloadToken]);

  if (!latestNews) {
    return (
      <div className="flex h-full items-center justify-center px-4 text-center text-[13px] text-[#787b86]">
        Latest news is hidden in Settings → Events
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#222222] px-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-[13px] font-semibold text-[#d1d4dc]">News</span>
          <span className="truncate text-[10px] uppercase tracking-wide text-[#4c525e]">
            Finnhub
            {tab === "asset" ? ` · ${formatTicker(pane.symbol)}` : ""}
          </span>
          <button
            type="button"
            title="Reload news"
            className="flex h-5 items-center gap-1 rounded px-1 text-[10px] text-[#4c525e] hover:bg-[#222222] hover:text-[#d1d4dc]"
            onClick={() => setReloadToken((n) => n + 1)}
          >
            <RefreshCw size={10} />
            Reload
          </button>
        </div>
      </div>

      <div className="flex shrink-0 gap-0.5 border-b border-[#222222] px-2 py-1.5">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`h-6 rounded px-2 text-[11px] ${
                active
                  ? "bg-[var(--maws-elevated)] text-[#d1d4dc]"
                  : "text-[#787b86] hover:bg-[var(--maws-elevated)] hover:text-[#d1d4dc]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="shrink-0 border-b border-[#222222] px-2 py-1.5 text-[10px] text-[#787b86]">
          {error}
          {error.includes("FINNHUB_API_KEY")
            ? " — add it to .env.local and restart the dev server."
            : null}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        {loading && items.length === 0 ? (
          <div className="px-2 py-8 text-center text-[12px] text-[#787b86]">
            Loading headlines…
          </div>
        ) : null}
        {!loading && items.length === 0 ? (
          <div className="px-2 py-8 text-center text-[12px] text-[#787b86]">
            No headlines for this feed right now
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <NewsRow key={item.id} item={item} now={now} />
          ))}
        </div>
      </div>
    </div>
  );
}
