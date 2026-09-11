"use client";

import { AssetLogo } from "@/components/brand/AssetLogo";
import { formatPrice } from "@/lib/maws/feed";
import { mawsFeed } from "@/lib/maws/feed";
import { formatTicker } from "@/lib/maws/universe";
import { StrategySymbolPanel } from "@/components/maws/StrategySymbolPanel";
import {
  analyzeSymbol,
  HTF_TIMEFRAME,
  type ConditionId,
  type CondStatus,
  type StrategyRow,
} from "@/lib/strategy-screener";
import { useAppStore } from "@/lib/store";
import type { Candle, Quote } from "@/types";
import { memo, useEffect, useMemo, useRef, useState } from "react";

const STATUS_DOT: Record<CondStatus, string> = {
  pass: "#089981",
  wait: "#787b86",
  block: "#f23645",
  info: "#4c525e",
};

/** Expand-control color from key-stoch alignment + ADX cap. */
function signalDotColor(row: StrategyRow): string {
  const fast = row.conditions.find((c) => c.id === "stochFast")?.value;
  const mid = row.conditions.find((c) => c.id === "stochMid")?.value;
  const slow = row.conditions.find((c) => c.id === "stochSlow")?.value;
  const adx = row.conditions.find((c) => c.id === "adx")?.value;

  const nums = [fast, mid, slow];
  const allNum = nums.every((v): v is number => typeof v === "number");
  const adxOk = typeof adx === "number" && adx <= 40;

  if (allNum && adxOk) {
    if (nums.every((d) => d <= 20)) return "#089981"; // long — all stochs oversold
    if (nums.every((d) => d >= 80)) return "#f23645"; // short — all stochs overbought
  }

  // Wait: both key stochs aligned on the same side
  if (typeof fast === "number" && typeof mid === "number") {
    if ((fast <= 20 && mid <= 20) || (fast >= 80 && mid >= 80)) return "#f0b90b";
  }

  return "#787b86";
}

function signalDotTitle(row: StrategyRow): string {
  const fast = row.conditions.find((c) => c.id === "stochFast")?.value;
  const mid = row.conditions.find((c) => c.id === "stochMid")?.value;
  const slow = row.conditions.find((c) => c.id === "stochSlow")?.value;
  const adx = row.conditions.find((c) => c.id === "adx")?.value;

  const nums = [fast, mid, slow];
  const allNum = nums.every((v): v is number => typeof v === "number");
  const adxOk = typeof adx === "number" && adx <= 40;

  if (allNum && adxOk) {
    if (nums.every((d) => d <= 20)) return "Long — all stochs aligned, ADX ≤ 40";
    if (nums.every((d) => d >= 80)) return "Short — all stochs aligned, ADX ≤ 40";
  }
  if (typeof fast === "number" && typeof mid === "number") {
    if ((fast <= 20 && mid <= 20) || (fast >= 80 && mid >= 80)) {
      return "Stoch 14.3 + 40.4 aligned — waiting";
    }
  }
  return "Waiting for Stoch 14.3 + 40.4";
}
const COND_LABEL: Record<ConditionId, string> = {
  htfBias: "HTF bias",
  vwap: "VWAP",
  stochFast: "Stoch 14.3",
  stochMid: "Stoch 40.4",
  stochSlow: "Stoch 60.10",
  adx: "ADX 14",
};
const COND_ORDER: ConditionId[] = [
  "htfBias",
  "stochFast",
  "vwap",
  "stochMid",
  "adx",
  "stochSlow",
];

/** TradingView-style per-digit flash: highlight from first changed character to end. */
function DigitFlashPrice({ symbol, value }: { symbol: string; value: number }) {
  const formatted = formatPrice(symbol, value);
  const prevFormatted = useRef<string | null>(null);
  const prevValue = useRef<number | null>(null);
  const flashRef = useRef<{ text: string; from: number; color: string } | null>(null);

  const prevStr = prevFormatted.current;
  const prevNum = prevValue.current;
  if (prevStr != null && prevNum != null && formatted !== prevStr && value !== prevNum) {
    let from = 0;
    const len = Math.min(formatted.length, prevStr.length);
    while (from < len && formatted[from] === prevStr[from]) from += 1;
    flashRef.current =
      from < formatted.length
        ? {
            text: formatted,
            from,
            color: value > prevNum ? "#089981" : "#f23645",
          }
        : null;
  }

  useEffect(() => {
    prevFormatted.current = formatted;
    prevValue.current = value;
  }, [formatted, value]);

  const flash = flashRef.current?.text === formatted ? flashRef.current : null;

  if (!flash) {
    return (
      <span className="text-[11px] font-semibold tabular-nums text-[#d1d4dc]">{formatted}</span>
    );
  }

  return (
    <span className="text-[11px] font-semibold tabular-nums">
      <span className="text-[#d1d4dc]">{formatted.slice(0, flash.from)}</span>
      <span style={{ color: flash.color }}>{formatted.slice(flash.from)}</span>
    </span>
  );
}

function useStrategyRows(symbols: string[]): StrategyRow[] {
  const [rows, setRows] = useState<Map<string, StrategyRow>>(new Map());
  // Order-independent — reordering must not tear down work / clear cards.
  const symbolsKey = useMemo(() => [...symbols].sort().join("\u0000"), [symbols]);

  useEffect(() => {
    let cancelled = false;
    const m1 = new Map<string, Candle[]>();
    const mh = new Map<string, Candle[]>();
    const unsubs: Array<() => void> = [];
    const wanted = new Set(symbols);
    let analyzeTimer: number | null = null;
    let confirmedTimer: number | null = null;

    setRows((prev) => {
      const next = new Map<string, StrategyRow>();
      for (const s of symbols) {
        const row = prev.get(s);
        if (row) next.set(s, row);
      }
      return next;
    });

    const snap = () => {
      for (const symbol of symbols) {
        try {
          m1.set(symbol, mawsFeed.getCandles(symbol, "1m"));
        } catch {
          /* ignore */
        }
        try {
          mh.set(symbol, mawsFeed.getCandles(symbol, HTF_TIMEFRAME));
        } catch {
          /* ignore */
        }
      }
    };

    const analyze = (confirmed: boolean) => {
      if (cancelled) return;
      snap();
      setRows((prev) => {
        const next = new Map<string, StrategyRow>();
        let changed = false;
        for (const symbol of symbols) {
          if (!wanted.has(symbol)) continue;
          const row = analyzeSymbol(
            symbol,
            m1.get(symbol) ?? [],
            mh.get(symbol) ?? [],
            Date.now(),
            { confirmed },
          );
          if (!row) {
            if (prev.has(symbol)) changed = true;
            continue;
          }
          if (!confirmed) {
            const prevRow = prev.get(symbol);
            if (prevRow) {
              row.confirmedState = prevRow.confirmedState;
              row.confirmedMet = prevRow.confirmedMet;
            }
          }
          const prevRow = prev.get(symbol);
          if (
            !prevRow ||
            prevRow.state !== row.state ||
            prevRow.met !== row.met ||
            prevRow.direction !== row.direction ||
            prevRow.confirmedState !== row.confirmedState ||
            prevRow.bullishMet !== row.bullishMet ||
            prevRow.bearishMet !== row.bearishMet ||
            prevRow.price !== row.price ||
            prevRow.conditions.length !== row.conditions.length ||
            prevRow.conditions.some(
              (c, i) =>
                c.status !== row.conditions[i]?.status ||
                c.value !== row.conditions[i]?.value ||
                c.detail !== row.conditions[i]?.detail,
            )
          ) {
            changed = true;
          }
          next.set(symbol, row);
        }
        if (!changed && next.size === prev.size) {
          for (const s of prev.keys()) {
            if (!next.has(s)) {
              changed = true;
              break;
            }
          }
        }
        return changed ? next : prev;
      });
    };

    snap();
    // Live 1m tip only — keeps forming bar fresh without React work per tick.
    // HTF bias is slow: REST snapshot via getCandles, no second live socket per symbol.
    for (const symbol of symbols) {
      unsubs.push(
        mawsFeed.subscribe(symbol, "1m", (c) => {
          m1.set(symbol, c);
        }),
      );
    }

    analyze(true);
    // Strategy cards: ~2s is enough; prices still tick via quote subscription.
    analyzeTimer = window.setInterval(() => analyze(false), 2000);
    confirmedTimer = window.setInterval(() => analyze(true), 15_000);

    return () => {
      cancelled = true;
      for (const u of unsubs) u();
      if (analyzeTimer != null) window.clearInterval(analyzeTimer);
      if (confirmedTimer != null) window.clearInterval(confirmedTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsKey]);

  return useMemo(() => [...rows.values()], [rows]);
}

function bareSymbol(symbol: string) {
  return symbol.replace(/\.P$/i, "").toUpperCase();
}

/** One quote subscription for the whole screener (avoids N× useQuote listeners). */
function useScreenerQuotes(): Map<string, Quote> {
  const [map, setMap] = useState(() => new Map(mawsFeed.getQuotes().map((q) => [q.symbol, q])));
  useEffect(() => {
    return mawsFeed.subscribeQuotes((next) => {
      setMap((prev) => {
        let changed = prev.size !== next.size;
        const out = new Map<string, Quote>();
        for (const [sym, q] of next) {
          const old = prev.get(sym);
          if (
            old &&
            old.last === q.last &&
            old.changePct === q.changePct &&
            old.volume === q.volume
          ) {
            out.set(sym, old);
          } else {
            out.set(sym, q);
            changed = true;
          }
        }
        if (!changed) {
          for (const sym of prev.keys()) {
            if (!next.has(sym)) {
              changed = true;
              break;
            }
          }
        }
        return changed ? out : prev;
      });
    });
  }, []);
  return map;
}

const StrategyCard = memo(function StrategyCard({
  row,
  selected,
  expanded,
  onOpen,
  onToggleExpand,
  last,
  changePct,
  dragging,
  onPointerDragStart,
}: {
  row: StrategyRow;
  selected: boolean;
  expanded: boolean;
  onOpen: (symbol: string) => void;
  onToggleExpand: (symbol: string) => void;
  last: number | null;
  changePct: number | null;
  dragging: boolean;
  onPointerDragStart: (symbol: string, clientY: number, pointerId: number) => void;
}) {
  const price = last ?? row.price;
  const suppressClick = useRef(false);
  const startRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const dotColor = signalDotColor(row);
  // Strict sign coloring — never flash from tick direction.
  const chgColor =
    changePct == null || changePct === 0
      ? "#d1d4dc"
      : changePct > 0
        ? "#089981"
        : "#f23645";

  return (
    <div
      data-screener-card={row.symbol}
      className={`group relative select-none border-b border-[#2a2e39] transition-colors ${
        dragging
          ? "z-10 bg-[var(--maws-elevated)] ring-1 ring-inset ring-[#2962ff]"
          : selected
            ? "bg-[var(--maws-elevated)] ring-1 ring-inset ring-[var(--app-text)]/35"
            : "bg-[var(--maws-panel)] hover:bg-[var(--maws-elevated)]"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          const t = e.target as HTMLElement;
          if (t.closest("[data-expand-dot]")) return;
          startRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
        }}
        onPointerMove={(e) => {
          const start = startRef.current;
          if (!start || start.pointerId !== e.pointerId) return;
          if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
          startRef.current = null;
          suppressClick.current = true;
          onPointerDragStart(row.symbol, e.clientY, e.pointerId);
        }}
        onPointerUp={() => {
          startRef.current = null;
        }}
        onPointerCancel={() => {
          startRef.current = null;
        }}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          onOpen(row.symbol);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(row.symbol);
          }
        }}
        className={`flex w-full select-none items-center gap-2 px-3 py-2.5 text-left ${
          dragging ? "cursor-grabbing" : "cursor-default"
        }`}
      >
        <button
          type="button"
          data-expand-dot
          title={signalDotTitle(row)}
          aria-label={signalDotTitle(row)}
          aria-expanded={expanded}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleExpand(row.symbol);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex h-5 w-5 shrink-0 cursor-default items-center justify-center rounded-full hover:bg-white/5"
        >
          <span
            className="block h-2 w-2 rounded-full transition-colors duration-200"
            style={{ background: dotColor }}
          />
        </button>
        <AssetLogo symbol={row.symbol} size={18} className="shrink-0" />
<span className="min-w-0 flex-1 truncate text-[11px] leading-[18px] font-semibold text-[var(--app-text)]">
          {formatTicker(row.symbol)}
        </span>
        <span className="flex shrink-0 items-center gap-0.5 leading-[18px]">
          {price == null ? (
            <span className="text-[11px] font-semibold tabular-nums text-[var(--app-muted)]">—</span>
          ) : (
            <DigitFlashPrice symbol={row.symbol} value={price} />
          )}
          <span
            className="ml-1.5 text-right text-[11px] font-semibold tabular-nums"
            style={{ color: chgColor }}
          >
            {changePct == null
              ? "—"
              : `${changePct > 0 ? "+" : ""}${changePct.toFixed(2)}%`}
          </span>
        </span>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 pt-0.5 pb-2.5 pl-10">
            {COND_ORDER.map((id) => {
              const c = row.conditions.find((x) => x.id === id);
              if (!c) return null;
              const isStoch = id === "stochFast" || id === "stochMid" || id === "stochSlow";
              const color =
                c.id === "htfBias"
                  ? c.value === 1
                    ? "#089981"
                    : c.value === -1
                      ? "#f23645"
                      : "#787b86"
                  : c.id === "vwap"
                    ? "#089981"
                    : isStoch && typeof c.value === "number"
                      ? c.value <= 20
                        ? "#089981"
                        : c.value >= 80
                          ? "#f23645"
                          : "#787b86"
                      : STATUS_DOT[c.status];
              const primary =
                id === "adx"
                  ? c.value == null
                    ? "ADX —"
                    : `ADX ${Number(c.value).toFixed(1)}`
                  : isStoch
                    ? c.value == null
                      ? `${COND_LABEL[id]} —`
                      : `${COND_LABEL[id]} - ${Number(c.value).toFixed(1)}`
                    : c.detail;
              return (
                <div key={c.id} className="min-w-0 py-0.5">
                  <div className="flex min-w-0 items-center gap-1 truncate text-[11px] text-[var(--app-text)]">
                    <span
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="truncate">{primary}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export function StrategyScreener() {
  const watchlist = useAppStore((s) => s.watchlist);
  const setWatchlistOrder = useAppStore((s) => s.setWatchlistOrder);
  const setSymbol = useAppStore((s) => s.setSymbol);
  const active = useAppStore((s) => s.panes.find((p) => p.id === s.activePaneId)?.symbol);
  const cardsHeight = useAppStore((s) => s.strategyCardsHeight);
  const setCardsHeight = useAppStore((s) => s.setStrategyCardsHeight);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const quotes = useScreenerQuotes();
  const [dragSymbol, setDragSymbol] = useState<string | null>(null);
  const [previewOrder, setPreviewOrder] = useState<string[] | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const dragSymbolRef = useRef<string | null>(null);
  const previewRef = useRef<string[] | null>(null);

  const toggleExpand = (symbol: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const symbols = useMemo(() => watchlist, [watchlist]);
  const rows = useStrategyRows(symbols);

  const displayOrder = previewOrder ?? watchlist;

  // Follow watchlist / live preview order (not A–Z).
  const ordered = useMemo(() => {
    const bySym = new Map(rows.map((r) => [r.symbol, r]));
    const out: StrategyRow[] = [];
    const seen = new Set<string>();
    for (const s of displayOrder) {
      const r = bySym.get(s);
      if (!r || seen.has(s)) continue;
      out.push(r);
      seen.add(s);
    }
    for (const r of rows) {
      if (seen.has(r.symbol)) continue;
      out.push(r);
      seen.add(r.symbol);
    }
    return out;
  }, [rows, displayOrder]);

  const moveDragToClientY = (clientY: number) => {
    const sym = dragSymbolRef.current;
    const list = previewRef.current;
    const root = listRef.current;
    if (!sym || !list || !root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-screener-card]")];
    if (cards.length === 0) return;

    let target = list.length - 1;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        target = i;
        break;
      }
      target = i;
    }

    const from = list.indexOf(sym);
    if (from < 0 || from === target) return;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(target, 0, item);
    previewRef.current = next;
    setPreviewOrder(next);
  };

  const endDrag = (commit: boolean) => {
    const order = previewRef.current;
    if (commit && order) setWatchlistOrder(order);
    dragSymbolRef.current = null;
    previewRef.current = null;
    setDragSymbol(null);
    setPreviewOrder(null);
  };

  const onPointerDragStart = (symbol: string, clientY: number, pointerId: number) => {
    const origin = ordered.map((r) => r.symbol);
    dragSymbolRef.current = symbol;
    previewRef.current = origin;
    setDragSymbol(symbol);
    setPreviewOrder(origin);

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      moveDragToClientY(ev.clientY);
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      endDrag(true);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    moveDragToClientY(clientY);
  };

  return (
    <div ref={boxRef} className="flex h-full min-h-0 flex-col bg-[var(--maws-panel)]">
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          height: active ? cardsHeight : "100%",
          maxHeight: active ? "calc(100% - 120px)" : "100%",
        }}
      >
        <div className="h-full min-h-0 overflow-auto bg-[var(--maws-panel)] px-1">
          {ordered.length === 0 ? (
            <div className="px-2 py-3 text-[11px] text-[var(--app-muted)] opacity-70">
              No symbols match. Waiting on candle history…
            </div>
          ) : (
            <div ref={listRef} className="flex flex-col">
              {ordered.map((row) => {
                const q = quotes.get(bareSymbol(row.symbol));
                return (
                  <StrategyCard
                    key={row.symbol}
                    row={row}
                    selected={active === row.symbol}
                    expanded={expanded.has(row.symbol)}
                    dragging={dragSymbol === row.symbol}
                    onOpen={setSymbol}
                    onToggleExpand={toggleExpand}
                    onPointerDragStart={onPointerDragStart}
                    last={q?.last ?? null}
                    changePct={q?.changePct ?? null}
                  />
                );
              })}
            </div>
          )}
        </div>
        {active ? (
          <div
            className="absolute bottom-0 left-0 z-20 h-1.5 w-full cursor-row-resize bg-transparent hover:bg-[#2962ff]"
            title="Drag to resize"
            onMouseDown={(e) => {
              e.preventDefault();
              const box = boxRef.current?.getBoundingClientRect();
              const move = (ev: MouseEvent) => {
                const top = box?.top ?? 0;
                const max = (box?.height ?? 600) - 120;
                setCardsHeight(Math.min(max, Math.max(96, ev.clientY - top)));
              };
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
          />
        ) : null}
      </div>
      {active ? (
        <StrategySymbolPanel
          symbol={active}
          row={ordered.find((r) => r.symbol === active) ?? null}
        />
      ) : null}
    </div>
  );
}
