"use client";

/**
 * Indicators, Favorites, My scripts — the TradingView-style indicator dialog that
 * replaces the old TopBar dropdown:
 *
 *  - Indicators: the full Vela native catalog, search-filtered, click to add
 *    (repeatable — clicking again adds a second instance, like TV).
 *  - Favorites: the user's starred indicators (star column + its own tab), the same
 *    localStorage seam the TradingView dialog's Favorites left column models.
 *  - My scripts: the user's saved Pine library (lib/vela-pine-scripts.ts), Run
 *    mounts one on the active chart through the workspace shell, an eye toggles a
 *    live one's visibility, the same pin stars it as a favorite.
 *
 * Clicking a live row closes and opens its settings dialog (TV behavior). Layout —
 * search on top, the tree column on the left, the table right — mirrors the
 * reference dialog in one column: rows carry their star, author and category
 * badge; the tree reduces to the three tabs of the request, so it is dropped.
 */

import { getChart, getWorkspace } from "@/lib/chart-registry";
import { groupedVelaCatalog, velaIndicatorCategory, VELA_INDICATOR_CATALOG } from "@/lib/vela-indicator-catalog";
import {
  chartIdForScript,
  loadPineScripts,
  savePineScripts,
  type PineScript,
} from "@/lib/vela-pine-scripts";
import { useAppStore } from "@/lib/store";
import { Code2, Eye, EyeOff, Search, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const TABS = ["Indicators", "Favorites", "My scripts"] as const;
type Tab = (typeof TABS)[number];

/** localStorage key of the pinned favorites (user content, not workspace state). */
const FAVORITES_KEY = "maws.indicator.favorites.v1";

/** The library of native indicators — the dialog's source of truth for the two star columns. */
type CatalogEntry = (typeof VELA_INDICATOR_CATALOG)[number];

type FavoriteKey = string; // native: `<type>`; pine: `pine:<id>`

function loadFavorites(): FavoriteKey[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is FavoriteKey => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveFavorites(keys: FavoriteKey[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(keys));
  } catch {
    /* private mode: favorites wrap to the session */
  }
}

export function IndicatorsDialog() {
  const open = useAppStore((s) => s.indicatorMenuOpen);
  const setOpen = useAppStore((s) => s.setIndicatorMenuOpen);
  const [tab, setTab] = useState<Tab>("Indicators");
  const [q, setQ] = useState("");
  /** The stored favorites; re-sorted rows read through a live set for O(1) membership. */
  const [favorites, setFavorites] = useState<FavoriteKey[]>([]);
  /** Live Pine scripts on the ACTIVE pane's chart (the My-scripts eye/remove operate here). */
  const [liveScripts, setLiveScripts] = useState<Array<{ id: string; title: string; visible: boolean }>>([]);
  const [scripts, setScripts] = useState<PineScript[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setFavorites(loadFavorites());
    setScripts(loadPineScripts());
    refreshLive();
  }, [open]);

  // Hooks run unconditionally — every hook stays above the `!open` early return
  // (Rules of Hooks: the dialog mount/unmount must not reorder the hook list).
  const catalogRows = useMemo(
    () => groupedVelaCatalog().flatMap((g) => g.entries).map((entry: CatalogEntry) => ({ entry, key: entry.type })),
    [],
  );

  if (!open) return null;

  const query = q.trim().toLowerCase();

  const refreshLive = () => {
    const pane = useAppStore.getState().activePaneId;
    const chart = getChart(pane)?.vela;
    if (!chart) {
      setLiveScripts([]);
      return;
    }
    try {
      setLiveScripts(
        chart
          .indicators()
          .filter((h) => h.id.startsWith("pine:"))
          .map((h) => ({ id: h.id, title: h.title, visible: h.visible })),
      );
    } catch {
      setLiveScripts([]);
    }
  };

  const toggleFavorite = (key: FavoriteKey) => {
    const next = favorites.includes(key) ? favorites.filter((k) => k !== key) : [...favorites, key];
    setFavorites(next);
    saveFavorites(next);
  };

  const deleteScript = (id: string) => {
    const nextScripts = scripts.filter((script) => script.id !== id);
    setScripts(nextScripts);
    savePineScripts(nextScripts);
    const nextFavorites = favorites.filter((key) => key !== `pine:${id}`);
    setFavorites(nextFavorites);
    saveFavorites(nextFavorites);
  };

  const fav = (key: FavoriteKey): boolean => favorites.includes(key);

  const addNative = (type: string) => {
    const pane = useAppStore.getState().activePaneId;
    getChart(pane)?.vela.addNativeIndicator(type);
  };

  /** Run a library script on the active cell through the workspace shell
   *  (undo/redo + Pine persistence ride along — same channel the editor's Run uses). */
  const runScript = (s: PineScript) => {
    const shell = getWorkspace();
    if (!shell) return;
    shell.addScript({ id: chartIdForScript(s.id), name: s.name, script: s.script, language: "pine" });
  };

  /** Toggle or remove one live script indicator — Vela owns both through its handle. */
  const withLive = (id: string, fn: (handle: { setVisible: (v: boolean) => void; visible: boolean; remove: () => void }) => void) => {
    const pane = useAppStore.getState().activePaneId;
    const chart = getChart(pane)?.vela;
    const handle = chart?.indicators().find((h) => h.id === id);
    if (handle) fn(handle);
  };

  type NativeRow = { key: string; kind: "native"; entry: CatalogEntry; script?: undefined };
  type PineRow = { key: string; kind: "pine"; entry?: undefined; script: PineScript };
  type Row = NativeRow | PineRow;

  const matches = (name: string): boolean => !query || name.toLowerCase().includes(query);

  const nativeRows: Row[] = catalogRows
    .filter(({ entry }) => matches(entry.title))
    .map(({ entry, key }) => ({ key, kind: "native" as const, entry }));
  const favoriteRows: Row[] = favorites
    .map((key): Row | null => {
      const native = VELA_INDICATOR_CATALOG.find((e) => e.type === key);
      if (native) return { key, kind: "native", entry: native };
      const scriptId = key.replace(/^pine:/, "");
      const script = scripts.find((s) => s.id === scriptId);
      if (script) return { key, kind: "pine", script };
      return null; // a favorite whose script was deleted — drop it from the view
    })
    .filter((row): row is Row => row !== null);
  const scriptRows = scripts.filter((s) => matches(s.name));

  const rowsList =
    tab === "Indicators"
      ? nativeRows
      : tab === "Favorites"
        ? favoriteRows
        : [];

  const close = () => setOpen(false);

  return (
    <div
      data-indicators-dialog
      className="fixed inset-0 z-[70] flex items-start justify-center bg-transparent"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="mt-[10vh] flex max-h-[76vh] w-[560px] flex-col overflow-hidden rounded-[8px] bg-[var(--app-elevated)] shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--app-border)] py-3 pl-5 pr-3">
          <span className="text-[15px] font-semibold text-[var(--app-text)]">Indicators, metrics and strategies</span>
          <button
            type="button"
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text)]"
            onClick={close}
          >
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--app-border)] px-4">
          <Search size={14} className="shrink-0 text-(--app-muted)" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            placeholder="Search"
            className="h-10 w-full bg-transparent text-[13px] text-[var(--app-text)] outline-none placeholder:text-[#4c525e]"
          />
          {q ? (
            <button type="button" onClick={() => setQ("")} className="text-[var(--app-muted)] hover:text-[var(--app-text)]" aria-label="Clear">
              <X size={13} />
            </button>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 gap-4 border-b border-[var(--app-border)] px-5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-9 border-b-2 text-[13px] ${
                tab === t
                  ? "border-[var(--app-text)] text-[var(--app-text)]"
                  : "border-transparent text-(--app-muted) hover:text-[var(--app-text)]"
              }`}
              style={tab === t ? { marginBottom: -1 } : undefined}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Rows */}
        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto pb-2">
          {tab === "My scripts" ? (
            <>
              {liveScripts.length > 0 ? (
                <div className="px-5 pt-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-(--app-muted)">On chart</div>
                  {liveScripts.map((l) => (
                    <div key={l.id} className="group flex items-center gap-2 rounded-[6px] px-2 py-1.5 hover:bg-[var(--app-hover)]">
                      <button
                        type="button"
                        title={fav(l.id) ? "Unpin from favorites" : "Pin to favorites"}
                        onClick={() => toggleFavorite(l.id)}
                        className={`shrink-0 ${fav(l.id) ? "text-[#f0b90b]" : "text-[#4c525e] hover:text-(--app-muted)"}`}
                      >
                        <Star size={13} fill={fav(l.id) ? "currentColor" : "none"} />
                      </button>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--app-text)]">{l.title}</span>
                      <button
                        type="button"
                        title={l.visible ? "Hide" : "Show"}
                        onClick={() =>
                          withLive(l.id, (h) => {
                            h.setVisible(!h.visible);
                            refreshLive();
                          })
                        }
                        className="shrink-0 text-[#4c525e] opacity-0 transition-opacity hover:text-(--app-text) group-hover:opacity-100"
                      >
                        {l.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button
                        type="button"
                        title="Remove from chart"
                        onClick={() =>
                          withLive(l.id, (h) => {
                            h.remove();
                            refreshLive();
                          })
                        }
                        className="shrink-0 text-[#4c525e] opacity-0 transition-opacity hover:text-(--app-text) group-hover:opacity-100"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="px-5 pt-3">
                {scriptRows.length ? (
                  scriptRows.map((s) => (
                    <div key={s.id} className="group flex items-center gap-2 rounded-[6px] px-2 py-1.5 hover:bg-[var(--app-hover)]">
                      <button
                        type="button"
                        title={fav(`pine:${s.id}`) ? "Unpin from favorites" : "Pin to favorites"}
                        onClick={() => toggleFavorite(`pine:${s.id}`)}
                        className={`shrink-0 ${fav(`pine:${s.id}`) ? "text-[#f0b90b]" : "text-[#4c525e] hover:text-(--app-muted)"}`}
                      >
                        <Star size={13} fill={fav(`pine:${s.id}`) ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        className="min-w-0 flex-1 truncate text-left text-[13px] text-[var(--app-text)] hover:underline"
                        onClick={() => {
                          runScript(s);
                          close();
                        }}
                        title="Run on the active chart"
                      >
                        {s.name}
                      </button>
                      <span className="shrink-0 text-[10px] uppercase text-(--app-muted)">pine</span>
                      <Code2 size={13} className="shrink-0 text-(--app-muted)" />
                      <button
                        type="button"
                        title="Delete script"
                        aria-label={`Delete ${s.name}`}
                        onClick={() => deleteScript(s.id)}
                        className="shrink-0 text-[#4c525e] opacity-0 transition-opacity hover:text-[#f23645] group-hover:opacity-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-[12px] text-(--app-muted)">
                    No scripts in the library. Write one in the Pine editor (right dock → Pine scripts).
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {rowsList.length > 0 ? (
                rowsList.map(({ key, kind, entry, script }) => {
                  const favKey = kind === "native" ? key : `pine:${script!.id}`;
                  return (
                    <div
                      key={favKey}
                      className="group flex cursor-pointer items-center gap-2 px-3 py-[7px] hover:bg-[var(--app-hover)]"
                      onClick={() => {
                        if (kind === "native") addNative(key);
                        else {
                          runScript(script!);
                          close();
                        }
                      }}
                    >
                      <button
                        type="button"
                        title={fav(favKey) ? "Remove from favorites" : "Add to favorites"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(favKey);
                        }}
                        className={`shrink-0 ${fav(favKey) ? "text-[#f0b90b]" : "text-[#4c525e] opacity-0 group-hover:opacity-100 hover:text-(--app-muted)"}`}
                      >
                        <Star size={13} fill={fav(favKey) ? "currentColor" : "none"} />
                      </button>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--app-text)]">
                        {kind === "native" ? entry!.title : script!.name}
                      </span>
                      {kind === "native" ? (
                        <span className="shrink-0 text-[11px] text-(--app-muted)">{velaIndicatorCategory(key)}</span>
                      ) : (
                        <span className="shrink-0 text-[11px] text-(--app-muted)">maws</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-6 text-center text-[12px] text-(--app-muted)">
                  {tab === "Favorites" ? "Nothing pinned yet — star an indicator or a script." : "No indicators match."}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
