import { mawsFeed } from "@/lib/maws/feed";
import type { Store } from "@/lib/store";

/** Build the hot-symbol set from workspace state. */
export function collectHotSymbols(state: {
  watchlist: string[];
  layoutCount: number;
  panes: Array<{ symbol: string }>;
  orders: Array<{ symbol: string }>;
  positions: Array<{ symbol: string }>;
}): string[] {
  const hot = new Set<string>();
  const add = (raw: string) => {
    const sym = raw.replace(/\.P$/i, "").toUpperCase();
    if (sym) hot.add(sym);
  };
  for (const s of state.watchlist) add(s);
  for (const p of state.panes.slice(0, state.layoutCount)) add(p.symbol);
  for (const o of state.orders) add(o.symbol);
  for (const p of state.positions) add(p.symbol);
  return [...hot];
}

export type MarketDataSliceState = {
  /** Runtime-only — never persisted (guarded by tests/persistence-compat.test.ts). */
  hotSymbols: string[];
};

export type MarketDataSliceActions = {
  syncHotSymbols: () => void;
};

export type MarketDataSlice = MarketDataSliceState & MarketDataSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

export function createMarketDataSlice(set: RootSet, get: RootGet): MarketDataSlice {
  return {
    hotSymbols: [],

    syncHotSymbols: () => {
      const hot = collectHotSymbols(get());
      set({ hotSymbols: hot });
      mawsFeed.setHotSymbols(hot);
    },
  };
}
