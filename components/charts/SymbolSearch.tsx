"use client";

import { AssetLogo } from "@/components/brand/AssetLogo";
import { formatPrice } from "@/lib/maws/feed";
import { formatTicker, getSymbol } from "@/lib/maws/universe";
import { useAppStore } from "@/lib/store";
import { useQuotes } from "@/lib/use-quotes";
import { useUniverse } from "@/lib/use-universe";
import { Diamond, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "crypto" | "tradefi";

const CATEGORY_TABS: { id: Category; label: string }[] = [
  { id: "crypto",  label: "USD-M Futures" },
  { id: "tradefi", label: "TradFi" },
];

export function SymbolSearch() {
  const open = useAppStore((s) => s.searchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setSymbol = useAppStore((s) => s.setSymbol);
  const addToWatchlist = useAppStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);
  const universe = useUniverse();
  const quotes = useQuotes(open);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category>("crypto");

  const rows = useMemo(() => {
    const query = q.trim().toUpperCase().replace(/\.P$/, "");
    const bySym = new Map(quotes.map((x) => [x.symbol, x]));
    const out: Array<{ info: (typeof universe)[number]; quote: (typeof quotes)[number] | undefined }> = [];
    for (const s of universe) {
      if (category === "crypto" && s.contractType === "TRADIFI_PERPETUAL") continue;
      if (category === "tradefi" && s.contractType !== "TRADIFI_PERPETUAL") continue;

      if (query) {
        if (
          !(
            s.symbol.includes(query) ||
            s.base.includes(query) ||
            s.name.toUpperCase().includes(query) ||
            formatTicker(s.symbol).includes(query)
          )
        ) {
          continue;
        }
      }
      out.push({ info: s, quote: bySym.get(s.symbol) });
      if (!query && out.length >= 80) break;
      if (query && out.length >= 120) break;
    }
    return out;
  }, [q, quotes, universe, category]);

  if (!open) return null;

  return (
    <div
      data-symbol-search
      data-dropdown-open
      className="absolute left-2 top-[40px] z-50 w-[294px] overflow-hidden rounded-sm border border-[#222222] bg-[#111111] shadow-none"
    >
      {/* Search input */}
      <div className="flex items-center gap-2 border-b border-[#222222] px-3">
        <Search size={14} className="shrink-0 text-[#787b86]" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSearchOpen(false);
            if (e.key === "Enter" && rows[0]) setSymbol(rows[0].info.symbol);
          }}
          placeholder="Search symbol"
          className="h-9 w-full bg-transparent text-[13px] text-[#d1d4dc] outline-none placeholder:text-[#4c525e]"
        />
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-[#222222]">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${
              category === tab.id
                ? "border-b-2 border-[#2962ff] text-[#d1d4dc]"
                : "text-[#787b86] hover:text-[#d1d4dc]"
            }`}
            style={category === tab.id ? { marginBottom: -1 } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="max-h-[360px] overflow-auto">
        {rows.length === 0 ? (
          <div className="px-3 py-6 text-center text-[12px] text-[#787b86]">
            No symbols found
          </div>
        ) : (
          rows.map(({ info, quote }) => {
            const up = (quote?.changePct ?? 0) >= 0;
            const starred = watchlist.includes(info.symbol);
            return (
              <div
                key={info.symbol}
                className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-[#222222]"
                onClick={() => setSymbol(info.symbol)}
              >
                <button
                  type="button"
                  title={starred ? "Remove from watchlist" : "Add to watchlist"}
                  className="shrink-0 text-[#787b86] hover:text-[#d1d4dc]"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (starred) removeFromWatchlist(info.symbol);
                    else addToWatchlist(info.symbol);
                  }}
                >
                  <Diamond
                    size={12}
                    color="#ffffff"
                    fill={starred ? "#ffffff" : "none"}
                    strokeWidth={1.6}
                  />
                </button>
                <AssetLogo symbol={info.symbol} size={22} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-[#d1d4dc]">
                    {formatTicker(info.symbol)}
                  </div>
                  <div className="truncate text-[11px] text-[#787b86]">
                    {getSymbol(info.symbol).name}
                  </div>
                </div>
                {quote && quote.last > 0 && (
                  <div className="shrink-0 text-right">
                    <div className="text-[12px] text-[#d1d4dc]">
                      {formatPrice(info.symbol, quote.last)}
                    </div>
                    <div className={`text-[11px] ${up ? "text-[#089981]" : "text-[#f23645]"}`}>
                      {up ? "+" : ""}
                      {quote.changePct.toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
