"use client";

import { AssetLogo } from "@/components/brand/AssetLogo";
import { ColResize } from "@/components/ui/ResizableColumns";
import { formatPrice } from "@/lib/maws/feed";
import { mawsFeed } from "@/lib/maws/feed";
import { formatTicker } from "@/lib/maws/universe";
import { StrategySymbolPanel } from "@/components/maws/StrategySymbolPanel";
import { useAppStore } from "@/lib/store";
import type { Quote } from "@/types";
import { memo, useEffect, useRef, useState } from "react";

const MIN_LAST_WIDTH = 45;
const MIN_CHANGE_WIDTH = 40;
const DEFAULT_COLUMN_WIDTHS = [80, 56]; // [lastWidth, changeWidth]

// ─── digit-flash price ─────────────────────────────────────────────────────

function DigitFlashPrice({ symbol, value }: { symbol: string; value: number }) {
  const formatted = formatPrice(symbol, value);
  const prevFormatted = useRef<string | null>(null);
  const prevValue    = useRef<number | null>(null);
  const flashRef     = useRef<{ text: string; from: number; color: string } | null>(null);

  const prevStr = prevFormatted.current;
  const prevNum = prevValue.current;
  if (prevStr != null && prevNum != null && formatted !== prevStr && value !== prevNum) {
    let from = 0;
    const len = Math.min(formatted.length, prevStr.length);
    while (from < len && formatted[from] === prevStr[from]) from++;
    flashRef.current =
      from < formatted.length
        ? { text: formatted, from, color: value > prevNum ? "#089981" : "#f23645" }
        : null;
  }
  useEffect(() => {
    prevFormatted.current = formatted;
    prevValue.current     = value;
  }, [formatted, value]);

  const flash = flashRef.current?.text === formatted ? flashRef.current : null;
  if (!flash) {
    return (
      <span className="tabular-nums text-[12px] font-semibold" style={{ color: "var(--app-text)" }}>
        {formatted}
      </span>
    );
  }
  return (
    <span className="tabular-nums text-[12px] font-semibold">
      <span style={{ color: "var(--app-text)" }}>{formatted.slice(0, flash.from)}</span>
      <span style={{ color: flash.color }}>{formatted.slice(flash.from)}</span>
    </span>
  );
}

// ─── single shared quote subscription ─────────────────────────────────────

function useScreenerQuotes(): Map<string, Quote> {
  const [map, setMap] = useState(() => new Map(mawsFeed.getQuotes().map((q) => [q.symbol, q])));
  useEffect(() => {
    return mawsFeed.subscribeQuotes((next) => {
      setMap((prev) => {
        let changed = prev.size !== next.size;
        const out = new Map<string, Quote>();
        for (const [sym, q] of next) {
          const old = prev.get(sym);
          if (old && old.last === q.last && old.changePct === q.changePct && old.volume === q.volume) {
            out.set(sym, old);
          } else { out.set(sym, q); changed = true; }
        }
        if (!changed) {
          for (const sym of prev.keys()) { if (!next.has(sym)) { changed = true; break; } }
        }
        return changed ? out : prev;
      });
    });
  }, []);
  return map;
}

// ─── icons ────────────────────────────────────────────────────────────────

function IconChevronDown({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronRight({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M3.5 2 6.5 5 3.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── title bar ─────────────────────────────────────────────────────────────

function TitleBar() {
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setRightOpen  = useAppStore((s) => s.setRightOpen);

  return (
    <div
      className="flex h-[42px] shrink-0 items-center border-b px-3"
      style={{ borderColor: "var(--app-border)" }}
    >
      <span className="flex-1 text-[13px] font-semibold" style={{ color: "var(--app-text)" }}>
        Watchlist
      </span>

      {/* + opens the symbol search so the user can find and add a symbol */}
      <button type="button" title="Add symbol" onClick={() => setSearchOpen(true)} className="wl-icon-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* ✕ closes the sidebar panel */}
      <button type="button" title="Close" onClick={() => setRightOpen(false)} className="wl-icon-btn">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// ─── column header ─────────────────────────────────────────────────────────

function ColumnHeader({
  lastWidth,
  changeWidth,
  onResizeDivider1,
  onResizeDivider2,
  onResetWidths,
}: {
  lastWidth: number;
  changeWidth: number;
  onResizeDivider1: (e: React.MouseEvent<HTMLSpanElement>) => void;
  onResizeDivider2: (e: React.MouseEvent<HTMLSpanElement>) => void;
  onResetWidths: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) {
  return (
    <div
      className="flex h-[28px] shrink-0 items-center border-b px-3 text-[10px] font-medium uppercase tracking-[0.05em]"
      style={{ color: "var(--app-muted)", borderColor: "var(--app-border)" }}
    >
      <div className="relative flex min-w-0 flex-1 items-center h-full">
        <span className="truncate">Symbol</span>
        <ColResize onMouseDown={onResizeDivider1} onDoubleClick={onResetWidths} />
      </div>
      <div
        className="relative flex shrink-0 items-center justify-center h-full"
        style={{ width: lastWidth }}
      >
        <span className="truncate">Last</span>
        <ColResize onMouseDown={onResizeDivider2} onDoubleClick={onResetWidths} />
      </div>
      <div
        className="flex shrink-0 items-center justify-center h-full"
        style={{ width: changeWidth }}
      >
        <span className="truncate">Day %</span>
      </div>
    </div>
  );
}

// ─── group header ──────────────────────────────────────────────────────────

function GroupHeader({
  name,
  count,
  collapsed,
  onToggle,
}: {
  name: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="wl-group-header flex h-[28px] w-full items-center gap-1.5 px-3"
    >
      <span style={{ color: "var(--app-muted)" }}>
        {collapsed ? <IconChevronRight size={10} /> : <IconChevronDown size={10} />}
      </span>
      <span
        className="flex-1 truncate text-left text-[11px] font-semibold uppercase tracking-[0.05em]"
        style={{ color: "var(--app-muted)" }}
      >
        {name}
      </span>
      <span
        className="text-[11px] tabular-nums"
        style={{ color: "var(--app-muted)" }}
      >
        {count}
      </span>
    </button>
  );
}

// ─── symbol row ────────────────────────────────────────────────────────────

const WatchlistRow = memo(function WatchlistRow({
  symbol,
  selected,
  dragging,
  last,
  changePct,
  lastWidth,
  changeWidth,
  onOpen,
  onPointerDragStart,
}: {
  symbol: string;
  selected: boolean;
  dragging: boolean;
  last: number | null;
  changePct: number | null;
  lastWidth: number;
  changeWidth: number;
  onOpen: (symbol: string) => void;
  onPointerDragStart: (symbol: string, clientY: number, pointerId: number) => void;
}) {
  const suppressClick = useRef(false);
  const startRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const chgColor =
    changePct == null || changePct === 0
      ? "var(--app-muted)"
      : changePct > 0 ? "#089981" : "#f23645";

  return (
    <div
      data-screener-card={symbol}
      style={{ borderColor: "var(--app-border)" }}
      className={[
        "wl-row border-b",
        dragging ? "wl-row is-dragging" : selected ? "wl-row is-selected" : "",
      ].join(" ")}
    >
      {/* main clickable row — 36px tall to match Vela */}
      <div
        role="button"
        tabIndex={0}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          startRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
        }}
        onPointerMove={(e) => {
          const s = startRef.current;
          if (!s || s.pointerId !== e.pointerId) return;
          if (Math.hypot(e.clientX - s.x, e.clientY - s.y) < 8) return;
          startRef.current = null;
          suppressClick.current = true;
          onPointerDragStart(symbol, e.clientY, e.pointerId);
        }}
        onPointerUp={() => { startRef.current = null; }}
        onPointerCancel={() => { startRef.current = null; }}
        onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return; }
          onOpen(symbol);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(symbol); }
        }}
        className={`flex h-[36px] w-full items-center gap-0 select-none px-3 ${dragging ? "cursor-grabbing" : "cursor-default"}`}
      >
        {/* logo */}
        <AssetLogo symbol={symbol} size={20} className="mr-2.5 shrink-0" />

        {/* ticker — single line */}
        <span
          className="min-w-0 flex-1 truncate text-[12px] font-bold"
          style={{ color: "var(--app-text)" }}
        >
          {formatTicker(symbol)}
        </span>

        {/* last price */}
        <div className="shrink-0 text-right pr-1.5" style={{ width: lastWidth }}>
          {last == null ? (
            <span className="text-[12px] tabular-nums" style={{ color: "var(--app-muted)" }}>—</span>
          ) : (
            <DigitFlashPrice symbol={symbol} value={last!} />
          )}
        </div>

        {/* day % */}
        <div className="shrink-0 text-right" style={{ width: changeWidth }}>
          <span className="text-[12px] font-semibold tabular-nums" style={{ color: chgColor }}>
            {changePct == null
              ? "—"
              : `${changePct > 0 ? "+" : ""}${changePct.toFixed(2)}%`}
          </span>
        </div>
      </div>
    </div>
  );
});

// ─── loading row (quote not ready yet) ─────────────────────────────────

function PendingRow({
  symbol,
  selected,
  quote,
  lastWidth,
  changeWidth,
  onOpen,
}: {
  symbol: string;
  selected: boolean;
  quote: Quote | undefined;
  lastWidth: number;
  changeWidth: number;
  onOpen: (sym: string) => void;
}) {
  const chgColor =
    !quote || quote.changePct === 0
      ? "var(--app-muted)"
      : quote.changePct > 0 ? "#089981" : "#f23645";

  return (
    <div
      data-screener-card={symbol}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(symbol)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(symbol); } }}
      style={{ borderColor: "var(--app-border)" }}
      className={[
        "flex h-[36px] w-full cursor-default items-center select-none border-b px-3",
        selected ? "wl-row is-selected" : "wl-row",
      ].join(" ")}
    >
      {/* placeholder for logo alignment (was the signal dot) */}
      <span className="mr-2 w-5 shrink-0" />

      <AssetLogo symbol={symbol} size={20} className="mr-2.5 shrink-0" />

      {/* ticker — single line */}
      <span
        className="min-w-0 flex-1 truncate text-[12px] font-bold"
        style={{ color: "var(--app-text)" }}
      >
        {formatTicker(symbol)}
      </span>

      <div className="shrink-0 text-right pr-1.5" style={{ width: lastWidth }}>
        {quote ? (
          <DigitFlashPrice symbol={symbol} value={quote.last} />
        ) : (
          <span className="text-[12px] tabular-nums" style={{ color: "var(--app-muted)" }}>—</span>
        )}
      </div>
      <div className="shrink-0 text-right" style={{ width: changeWidth }}>
        <span className="text-[12px] font-semibold tabular-nums" style={{ color: chgColor }}>
          {quote ? `${quote.changePct > 0 ? "+" : ""}${quote.changePct.toFixed(2)}%` : "—"}
        </span>
      </div>
    </div>
  );
}

// ─── main component ────────────────────────────────────────────────────────

function bareSymbol(symbol: string) {
  return symbol.replace(/\.P$/i, "").toUpperCase();
}

export function StrategyScreener() {
  const watchlist          = useAppStore((s) => s.watchlist);
  const watchlistGroups    = useAppStore((s) => s.watchlistGroups);
  const toggleWatchlistGroup = useAppStore((s) => s.toggleWatchlistGroup);
  const setWatchlistOrder  = useAppStore((s) => s.setWatchlistOrder);
  const setSymbol          = useAppStore((s) => s.setSymbol);
  const active             = useAppStore((s) => s.panes.find((p) => p.id === s.activePaneId)?.symbol);
  // Rows carry the watchlist symbol ("XAUUSDT.P") while the active pane may hold the
  // canonical universe symbol ("XAUUSDT") — compare on the bare symbol so the
  // selected-row marker survives either form.
  const activeKey = active ? bareSymbol(active) : undefined;
  const cardsHeight        = useAppStore((s) => s.strategyCardsHeight);
  const setCardsHeight     = useAppStore((s) => s.setStrategyCardsHeight);
  const storedWidths       = useAppStore((s) => s.columnWidths["watchlist"]);
  const setColumnWidths    = useAppStore((s) => s.setColumnWidths);

  const widths =
    storedWidths && storedWidths.length === 2
      ? storedWidths
      : DEFAULT_COLUMN_WIDTHS;
  const lastWidth = widths[0];
  const changeWidth = widths[1];

  const onResizeDivider1 = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const current = useAppStore.getState().columnWidths["watchlist"] ?? DEFAULT_COLUMN_WIDTHS;
    const startLast = current[0] ?? DEFAULT_COLUMN_WIDTHS[0];
    const curChange = current[1] ?? DEFAULT_COLUMN_WIDTHS[1];
    const prevSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const nextLast = Math.max(MIN_LAST_WIDTH, Math.min(220, Math.round(startLast - dx)));
      setColumnWidths("watchlist", [nextLast, curChange]);
    };

    const onUp = () => {
      document.body.style.userSelect = prevSelect;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResizeDivider2 = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const current = useAppStore.getState().columnWidths["watchlist"] ?? DEFAULT_COLUMN_WIDTHS;
    const startLast = current[0] ?? DEFAULT_COLUMN_WIDTHS[0];
    const startChange = current[1] ?? DEFAULT_COLUMN_WIDTHS[1];
    const prevSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      let nextLast = startLast + dx;
      let nextChange = startChange - dx;

      if (nextLast < MIN_LAST_WIDTH) {
        nextLast = MIN_LAST_WIDTH;
        nextChange = startLast + startChange - MIN_LAST_WIDTH;
      }
      if (nextChange < MIN_CHANGE_WIDTH) {
        nextChange = MIN_CHANGE_WIDTH;
        nextLast = startLast + startChange - MIN_CHANGE_WIDTH;
      }

      setColumnWidths("watchlist", [Math.round(nextLast), Math.round(nextChange)]);
    };

    const onUp = () => {
      document.body.style.userSelect = prevSelect;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResetWidths = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setColumnWidths("watchlist", DEFAULT_COLUMN_WIDTHS);
  };

  const boxRef  = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const quotes  = useScreenerQuotes();

  const [dragSymbol,   setDragSymbol]   = useState<string | null>(null);
  const [previewOrder, setPreviewOrder] = useState<string[] | null>(null);

  const dragSymbolRef = useRef<string | null>(null);
  const previewRef    = useRef<string[] | null>(null);

  const displayOrder = previewOrder ?? watchlist;

  // ─── drag-to-reorder ────────────────────────────────────────────────────

  const moveDragToClientY = (clientY: number) => {
    const sym  = dragSymbolRef.current;
    const list = previewRef.current;
    const root = listRef.current;
    if (!sym || !list || !root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-screener-card]")];
    if (!cards.length) return;

    let target = list.length - 1;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (clientY < r.top + r.height / 2) { target = i; break; }
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
    if (commit && previewRef.current) setWatchlistOrder(previewRef.current);
    dragSymbolRef.current = null;
    previewRef.current    = null;
    setDragSymbol(null);
    setPreviewOrder(null);
  };

  const onPointerDragStart = (symbol: string, clientY: number, pointerId: number) => {
    const origin = [...displayOrder];
    dragSymbolRef.current = symbol;
    previewRef.current    = origin;
    setDragSymbol(symbol);
    setPreviewOrder(origin);

    const onMove = (ev: PointerEvent) => { if (ev.pointerId === pointerId) moveDragToClientY(ev.clientY); };
    const onUp   = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
      window.removeEventListener("pointercancel", onUp);
      endDrag(true);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    window.addEventListener("pointercancel", onUp);
    moveDragToClientY(clientY);
  };

  // ─── render ─────────────────────────────────────────────────────────────

  return (
    <div
      ref={boxRef}
      className="flex h-full min-h-0 flex-col"
      style={{ background: "var(--app-panel)" }}
    >
      {/* ── title bar ── */}
      <TitleBar />

      {/* ── scrollable symbol list ── */}
      <div
        className="relative min-h-0 shrink-0 overflow-hidden"
        style={{
          height:    active ? cardsHeight : "100%",
          maxHeight: active ? "calc(100% - 120px)" : "100%",
        }}
      >
        <div className="flex h-full flex-col overflow-auto">
          <ColumnHeader
            lastWidth={lastWidth}
            changeWidth={changeWidth}
            onResizeDivider1={onResizeDivider1}
            onResizeDivider2={onResizeDivider2}
            onResetWidths={onResetWidths}
          />

          {watchlist.length === 0 ? (
            <div className="px-4 py-6 text-[12px]" style={{ color: "var(--app-muted)" }}>
              No symbols in watchlist.
            </div>
          ) : (
            <div ref={listRef}>
              {watchlistGroups.map((group) => {
                if (group.symbols.length === 0) return null;

                // Respect drag preview ordering within each group
                const groupSymbols = (previewOrder
                  ? previewOrder.filter((s) => group.symbols.includes(s))
                  : group.symbols);

                return (
                  <div key={group.id}>
                    <GroupHeader
                      name={group.name}
                      count={group.symbols.length}
                      collapsed={group.collapsed}
                      onToggle={() => toggleWatchlistGroup(group.id)}
                    />

                    {!group.collapsed && groupSymbols.map((sym) => {
                      const q = quotes.get(bareSymbol(sym));
                      const quoteReady = q != null;

                      if (!quoteReady) {
                        return (
                          <PendingRow
                            key={sym}
                            symbol={sym}
                            selected={activeKey === bareSymbol(sym)}
                            quote={q}
                            lastWidth={lastWidth}
                            changeWidth={changeWidth}
                            onOpen={setSymbol}
                          />
                        );
                      }

                      return (
                        <WatchlistRow
                          key={sym}
                          symbol={sym}
                          selected={activeKey === bareSymbol(sym)}
                          dragging={dragSymbol === sym}
                          last={q.last}
                          changePct={q.changePct}
                          lastWidth={lastWidth}
                          changeWidth={changeWidth}
                          onOpen={setSymbol}
                          onPointerDragStart={onPointerDragStart}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* resize handle between list and symbol panel */}
        {active && (
          <div
            className="absolute bottom-0 left-0 z-20 h-1.5 w-full cursor-row-resize bg-transparent hover:bg-[#2962ff]"
            title="Drag to resize"
            onDoubleClick={() => setCardsHeight(320)}
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const listEl = e.currentTarget.parentElement;
              const startH = listEl ? listEl.getBoundingClientRect().height : cardsHeight;
              const box = boxRef.current?.getBoundingClientRect();
              const titleBarH =
                boxRef.current?.firstElementChild instanceof HTMLElement
                  ? boxRef.current.firstElementChild.offsetHeight
                  : 42;
              const max = Math.max(96, (box?.height ?? 600) - titleBarH - 120);
              const prevSelect = document.body.style.userSelect;
              const prevCursor = document.body.style.cursor;
              document.body.style.userSelect = "none";
              document.body.style.cursor = "row-resize";

              const move = (ev: MouseEvent) => {
                const dy = ev.clientY - startY;
                setCardsHeight(Math.min(max, Math.max(96, Math.round(startH + dy))));
              };
              const up = () => {
                document.body.style.userSelect = prevSelect;
                document.body.style.cursor = prevCursor;
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup",   up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup",   up);
            }}
          />
        )}
      </div>

      {/* ── active-symbol detail panel ── */}
      {active && <StrategySymbolPanel symbol={active} />}
    </div>
  );
}
