/**
 * vela-symbol-search.ts — MAWS's side of VELA's symbol search dialog.
 *
 * The shell no longer draws its own picker: the top bar's symbol button opens the
 * workspace's `SymbolPicker` — the very dialog a bare keystroke over the grid reaches —
 * whose rows come from the data providers' symbol index. Two app-level contributions
 * make that dialog MAWS's own:
 *
 *  - RANKING (the dialog's opening screen): Vela's built-in head pins SPOT majors
 *    (`BTCUSDT`), which the futures-only index no longer contains, so without a ranking
 *    the list would open on whatever Binance's exchangeInfo lists first
 *    (`1000BONKUSDT.P`…). Watchlist symbols lead, in the user's own order, then the
 *    majors, then the provider's order.
 *  - FAVORITE: the row's star IS the watchlist — starring in the dialog and removing in
 *    the sidebar are one edit, not two lists that drift.
 *
 * The picker caches a ranking against its pool, so the head is fixed when the index
 * lands: a star toggled later changes membership, not the row order.
 */
import {
  registerSymbolFavorite,
  registerSymbolRanking,
  type SymbolDescriptor,
} from "@/lib/charting";
import { useAppStore } from "@/lib/store";
import { fromVelaTicker, toVelaTicker } from "@/lib/vela-feed-adapter";

/** Pinned after the watchlist — the futures contracts a session usually starts from. */
const MAJORS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "BNBUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "LINKUSDT",
  "AVAXUSDT",
  "SUIUSDT",
] as const;

const keyOf = (ticker: string): string => ticker.trim().toUpperCase();

/**
 * Watchlist order first, then `majors`, then the pool's own order.
 *
 * Symbols the pool does not list (an index that hasn't settled, a delisted contract) are
 * SKIPPED, never invented: a row that cannot load is worse than no row. Aliases ride
 * `toVelaTicker`, so a watchlist entry `PEPEUSDT` matches the listed `1000PEPEUSDT.P`.
 * Pure — unit-tested.
 */
export function rankSymbolPool(
  pool: readonly SymbolDescriptor[],
  watchlist: readonly string[],
  majors: readonly string[] = MAJORS,
): SymbolDescriptor[] {
  const byTicker = new Map(pool.map((d) => [keyOf(d.ticker), d]));
  const head: SymbolDescriptor[] = [];
  const taken = new Set<string>();
  for (const symbol of [...watchlist, ...majors]) {
    const d = byTicker.get(keyOf(toVelaTicker(symbol)));
    if (!d || taken.has(keyOf(d.ticker))) continue;
    taken.add(keyOf(d.ticker));
    head.push(d);
  }
  return [...head, ...pool.filter((d) => !taken.has(keyOf(d.ticker)))];
}

/** Wire the dialog to the store (ranking reads it per pool change, the star per row).
 *  Returns the disposer — registration is last-wins, so a remount replaces cleanly. */
export function registerMawsSymbolSearch(): () => void {
  const offRanking = registerSymbolRanking((pool) =>
    rankSymbolPool(pool, useAppStore.getState().watchlist),
  );
  const offFavorite = registerSymbolFavorite({
    isFavorite: (ticker) => useAppStore.getState().watchlist.includes(fromVelaTicker(ticker)),
    toggleFavorite: (ticker) => {
      const symbol = fromVelaTicker(ticker);
      const state = useAppStore.getState();
      if (state.watchlist.includes(symbol)) state.removeFromWatchlist(symbol);
      else state.addToWatchlist(symbol);
    },
  });
  return () => {
    offRanking();
    offFavorite();
  };
}
