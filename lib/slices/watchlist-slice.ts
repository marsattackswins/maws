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
    addToWatchlist: (symbol) => {
      const groups = get().watchlistGroups;
      if (groups.some((g) => g.symbols.includes(symbol))) return;
      const next = groups.map((g, i) =>
        i === 0 ? { ...g, symbols: [...g.symbols, symbol] } : g,
      );
      set({
        watchlistGroups: next,
        watchlist: next.flatMap((g) => g.symbols),
      });
    },
    removeFromWatchlist: (symbol) => {
      const next = get().watchlistGroups.map((g) => ({
        ...g,
        symbols: g.symbols.filter((s) => s !== symbol),
      }));
      set({
        watchlistGroups: next,
        watchlist: next.flatMap((g) => g.symbols),
      });
    },
    moveWatchlistSymbol: (symbol, toGroupId, toIndex) => {
      const groups = get().watchlistGroups.map((g) => ({
        ...g,
        symbols: [...g.symbols],
      }));
      let fromGroupId: string | null = null;
      let fromIndex = -1;
      for (const g of groups) {
        const i = g.symbols.indexOf(symbol);
        if (i < 0) continue;
        fromGroupId = g.id;
        fromIndex = i;
        g.symbols.splice(i, 1);
        break;
      }
      if (fromGroupId == null || fromIndex < 0) return;

      const dest = groups.find((g) => g.id === toGroupId);
      if (!dest) return;

      let insertAt = Math.max(0, Math.min(toIndex, dest.symbols.length));
      if (fromGroupId === toGroupId && fromIndex < insertAt) insertAt -= 1;
      insertAt = Math.max(0, Math.min(insertAt, dest.symbols.length));
      dest.symbols.splice(insertAt, 0, symbol);

      set({
        watchlistGroups: groups,
        watchlist: groups.flatMap((g) => g.symbols),
      });
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
      // Persist order in the first group so flatMap stays in sync.
      const groups = get().watchlistGroups.map((g, i) =>
        i === 0 ? { ...g, symbols: list } : { ...g, symbols: [] },
      );
      set({ watchlist: list, watchlistGroups: groups });
    },
    setWatchlistOrder: (symbols) => {
      const list = [...symbols];
      const groups = get().watchlistGroups.map((g, i) =>
        i === 0 ? { ...g, symbols: list } : { ...g, symbols: [] },
      );
      set({ watchlist: list, watchlistGroups: groups });
    },
    setWatchlistHeight: (height) => set({ watchlistHeight: height }),
  };
}

const renameSymbol = (sym: string) => (sym === "MATICUSDT" ? "POLUSDT" : sym);
const dropFx = (sym: string) => {
  const s = renameSymbol(sym);
  return /^EURUSD$/i.test(s) ? null : s;
};

/** Legacy-symbol cleanup for persisted watchlist state (MATIC→POL, drop EURUSD). */
export function normalizeWatchlistRehydrate(state: Store): void {
  state.watchlist = (state.watchlist ?? [])
    .map(dropFx)
    .filter((s): s is string => Boolean(s));
  state.watchlistGroups = (state.watchlistGroups ?? []).map((g) => ({
    ...g,
    symbols: g.symbols.map(dropFx).filter((s): s is string => Boolean(s)),
  }));
}
