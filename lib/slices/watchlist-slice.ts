import { DEFAULT_WATCHLIST, DEFAULT_WATCHLIST_GROUPS } from "@/lib/maws/universe";
import type { WatchlistGroup } from "@/types";
import type { Store } from "@/lib/store";

export type WatchlistSliceState = {
  watchlist: string[];
  watchlistGroups: WatchlistGroup[];
  watchlistHeight: number;
  watchlistCollapsed: boolean;
  watchlistGroupCollapsed: boolean;
};

export type WatchlistSliceActions = {
  toggleWatchlistCollapsed: () => void;
  toggleWatchlistGroup: (id: string) => void;
  renameWatchlist: (name: string) => void;
  createWatchlist: (name: string) => void;
  activateWatchlist: (id: string) => void;
  deleteWatchlist: (id: string) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  /** Move a symbol within/across groups. `toIndex` is the insertion index in the destination group. */
  moveWatchlistSymbol: (symbol: string, toGroupId: string, toIndex: number) => void;
  /** Reorder the flat watchlist (strategy screener drag order). */
  reorderWatchlist: (fromIndex: number, toIndex: number) => void;
  /** Replace watchlist order (live drag commit). */
  setWatchlistOrder: (symbols: string[]) => void;
  setWatchlistHeight: (height: number) => void;
};

export type WatchlistSlice = WatchlistSliceState & WatchlistSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

export function createWatchlistSlice(set: RootSet, get: RootGet): WatchlistSlice {
  return {
    watchlist: DEFAULT_WATCHLIST,
    watchlistGroups: DEFAULT_WATCHLIST_GROUPS.map((g) => ({
      ...g,
      symbols: [...g.symbols],
    })),
    watchlistHeight: 248,
    watchlistCollapsed: false,
    watchlistGroupCollapsed: false,

    toggleWatchlistCollapsed: () =>
      set({ watchlistCollapsed: !get().watchlistCollapsed }),
    toggleWatchlistGroup: (id) =>
      set({
        watchlistGroups: get().watchlistGroups.map((g) =>
          g.id === id ? { ...g, collapsed: !g.collapsed } : g,
        ),
      }),
    renameWatchlist: (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const groups = get().watchlistGroups;
      if (groups.length === 0 || groups[0].name === trimmed) return;
      set({
        watchlistGroups: groups.map((group, index) =>
          index === 0 ? { ...group, name: trimmed } : group,
        ),
      });
    },
    createWatchlist: (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const groups = get().watchlistGroups;
      let suffix = groups.length + 1;
      let id = `watchlist-${suffix}`;
      while (groups.some((group) => group.id === id)) {
        suffix += 1;
        id = `watchlist-${suffix}`;
      }
      const next = [{ id, name: trimmed, collapsed: false, symbols: [] }, ...groups];
      set({ watchlist: [], watchlistGroups: next });
    },
    activateWatchlist: (id) => {
      const groups = get().watchlistGroups;
      const index = groups.findIndex((group) => group.id === id);
      if (index <= 0) return;
      const next = [groups[index], ...groups.slice(0, index), ...groups.slice(index + 1)];
      set({ watchlist: [...next[0].symbols], watchlistGroups: next });
    },
    deleteWatchlist: (id) => {
      const groups = get().watchlistGroups;
      if (groups.length === 1 && groups[0].id === id) {
        set({
          watchlist: [],
          watchlistGroups: [{ ...groups[0], symbols: [] }],
        });
        return;
      }
      if (groups.length <= 1) return;
      const next = groups.filter((group) => group.id !== id);
      if (next.length === groups.length) return;
      const active = groups[0]?.id === id;
      set({
        watchlist: active ? [...next[0].symbols] : get().watchlist,
        watchlistGroups: next,
      });
    },
    addToWatchlist: (symbol) => {
      const groups = get().watchlistGroups;
      const active = groups[0];
      if (!active || active.symbols.includes(symbol)) return;
      const symbols = [...active.symbols, symbol];
      const next = [{ ...active, symbols }, ...groups.slice(1)];
      set({
        watchlistGroups: next,
        watchlist: symbols,
      });
    },
    removeFromWatchlist: (symbol) => {
      const groups = get().watchlistGroups;
      const active = groups[0];
      if (!active || !active.symbols.includes(symbol)) return;
      const symbols = active.symbols.filter((s) => s !== symbol);
      const next = [{ ...active, symbols }, ...groups.slice(1)];
      set({
        watchlistGroups: next,
        watchlist: symbols,
      });
    },
    moveWatchlistSymbol: (symbol, toGroupId, toIndex) => {
      const groups = get().watchlistGroups.map((g) => ({
        ...g,
        symbols: [...g.symbols],
      }));
      const active = groups[0];
      if (!active || active.id !== toGroupId) return;
      const fromIndex = active.symbols.indexOf(symbol);
      if (fromIndex < 0) return;
      const [moved] = active.symbols.splice(fromIndex, 1);
      let insertAt = Math.max(0, Math.min(toIndex, active.symbols.length + 1));
      if (fromIndex < insertAt) insertAt -= 1;
      insertAt = Math.max(0, Math.min(insertAt, active.symbols.length));
      active.symbols.splice(insertAt, 0, moved);
      set({ watchlistGroups: groups, watchlist: [...active.symbols] });
    },
    reorderWatchlist: (fromIndex, toIndex) => {
      const list = [...get().watchlist];
      if (
        fromIndex < 0 ||
        fromIndex >= list.length ||
        toIndex < 0 ||
        toIndex >= list.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const [sym] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, sym);
      const groups = get().watchlistGroups;
      const next = groups.map((group, i) => i === 0 ? { ...group, symbols: list } : group);
      set({ watchlist: list, watchlistGroups: next });
    },
    setWatchlistOrder: (symbols) => {
      const list = [...symbols];
      const groups = get().watchlistGroups;
      const next = groups.map((group, i) => i === 0 ? { ...group, symbols: list } : group);
      set({ watchlist: list, watchlistGroups: next });
    },
    setWatchlistHeight: (height) => set({ watchlistHeight: height }),
  };
}

const renameSymbol = (sym: string) => (sym === "MATICUSDT" ? "POLUSDT" : sym);
/**
 * A watchlist entry is a MAWS symbol: BARE — no venue prefix, no Vela `.P` suffix.
 * Vela's tickers (`BINANCE:ETHUSDT.P`) can reach the list from an older build or a
 * chart-side star; kept as-is they render as an unknown asset in the sidebar and the
 * star on that market toggles a different string than the pane's, so the two never
 * agree. Stripping the spelling is lossless — every form names the same contract.
 */
const bareSymbol = (sym: string) =>
  sym.trim().toUpperCase().replace(/^[A-Z0-9]+:/, "").replace(/\.P$/i, "");
const dropFx = (sym: string) => {
  const s = renameSymbol(bareSymbol(sym));
  return /^EURUSD$/i.test(s) ? null : s;
};

/** Rehydrated list: legacy renames (MATIC→POL, EURUSD dropped), MAWS spelling, no dupes. */
function cleanSymbols(symbols: readonly string[] | undefined): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of symbols ?? []) {
    const s = dropFx(String(raw ?? ""));
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/** Normalize saved watchlists and migrate the old categorized watchlist shape. */
export function normalizeWatchlistRehydrate(state: Store): void {
  const persistedSymbols = Array.isArray(state.watchlist)
    ? state.watchlist
    : (state.watchlistGroups ?? []).flatMap((group) => group.symbols ?? []);
  const symbols = cleanSymbols(persistedSymbols);
  const defaultGroup = DEFAULT_WATCHLIST_GROUPS[0];
  const persistedGroups = (state.watchlistGroups ?? [])
    .filter((group) => group.id === "watchlist" || /^watchlist-\d+$/.test(group.id))
    .map((group) => ({ ...group, symbols: cleanSymbols(group.symbols) }));
  const activeGroup = persistedGroups.find((group) => group.id === "watchlist")
    ?? persistedGroups[0];
  const normalizedGroups = activeGroup
    ? [
        { ...activeGroup, symbols },
        ...persistedGroups.filter((group) => group.id !== activeGroup.id),
      ]
    : defaultGroup
      ? [{ ...defaultGroup, symbols }]
      : [];
  state.watchlist = symbols;
  state.watchlistGroups = normalizedGroups;
}
