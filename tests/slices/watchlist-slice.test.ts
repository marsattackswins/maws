import { describe, it, expect, afterEach } from "@jest/globals";
import { useAppStore } from "@/lib/store";
import type { Store } from "@/lib/store";
import {
  createWatchlistSlice,
  normalizeWatchlistRehydrate,
  type WatchlistSlice,
} from "@/lib/slices/watchlist-slice";
import {
  DEFAULT_WATCHLIST,
  DEFAULT_WATCHLIST_GROUPS,
} from "@/lib/maws/universe";

/**
 * Phase B regression tests for the watchlist-slice:
 *   - moveWatchlistSymbol keeps `watchlist` === groups flatMap;
 *   - reorderWatchlist enforces index bounds (out-of-range / negative /
 *     same-index are no-ops);
 *   - add/remove/setOrder keep the flatMap invariant;
 *   - normalizeWatchlistRehydrate renames MATIC→POL and drops EURUSD;
 *   - atomicity: every mutating action performs exactly ONE set() whose
 *     single patch carries both watchlist and watchlistGroups.
 */

function defaultGroups() {
  return DEFAULT_WATCHLIST_GROUPS.map((g) => ({
    ...g,
    symbols: [...g.symbols],
  }));
}

function resetWatchlist(): void {
  useAppStore.setState({
    watchlist: [...DEFAULT_WATCHLIST],
    watchlistGroups: defaultGroups(),
    watchlistHeight: 248,
    watchlistCollapsed: false,
    watchlistGroupCollapsed: false,
  });
}

const flatOf = (s: Store): string[] =>
  s.watchlistGroups.flatMap((g) => g.symbols);

describe("watchlist-slice (real root store)", () => {
  afterEach(resetWatchlist);

  it("moveWatchlistSymbol keeps the single watchlist ordered", () => {
    resetWatchlist();
    const s = useAppStore.getState();

    s.moveWatchlistSymbol("XAUUSDT.P", "watchlist", 4);
    let now = useAppStore.getState();
    expect(now.watchlist).toEqual(flatOf(now));
    expect(now.watchlistGroups[0].symbols).toEqual([
      "BTCUSDT.P",
      "MUUSDT.P",
      "SOLUSDT.P",
      "XAUUSDT.P",
      "SKHYNIXUSDT.P",
      "BNBUSDT.P",
    ]);

    // Unknown symbols and groups are no-ops.
    const before = now.watchlist;
    s.moveWatchlistSymbol("NOPEUSDT", "watchlist", 0);
    s.moveWatchlistSymbol("BTCUSDT.P", "no-such-group", 0);
    now = useAppStore.getState();
    expect(now.watchlist).toEqual(before);
    expect(now.watchlist).toEqual(flatOf(now));
  });

  it("reorderWatchlist enforces bounds and moves the symbol in range", () => {
    resetWatchlist();
    const s = useAppStore.getState();
    const before = [...useAppStore.getState().watchlist];

    // Out-of-range, negative, and same-index moves are no-ops.
    for (const [from, to] of [
      [0, before.length],
      [before.length, 0],
      [-1, 0],
      [0, -1],
      [2, 2],
    ]) {
      s.reorderWatchlist(from, to);
      expect(useAppStore.getState().watchlist).toEqual(before);
    }

    // In-range move reorders the flat list and persists into the first group.
    s.reorderWatchlist(0, 2);
    const now = useAppStore.getState();
    expect(now.watchlist).toEqual([
      "XAUUSDT.P",
      "MUUSDT.P",
      "BTCUSDT.P",
      "SOLUSDT.P",
      "SKHYNIXUSDT.P",
      "BNBUSDT.P",
    ]);
    expect(now.watchlist).toEqual(flatOf(now));
    expect(now.watchlistGroups[0].symbols).toEqual(now.watchlist);
  });

  it("addToWatchlist / removeFromWatchlist keep the flatMap invariant", () => {
    resetWatchlist();
    const s = useAppStore.getState();

    s.addToWatchlist("AVAXUSDT");
    let now = useAppStore.getState();
    // Appends into the first group, i.e. right after its existing symbols.
    expect(now.watchlist[6]).toBe("AVAXUSDT");
    expect(now.watchlist).toEqual(flatOf(now));

    // Duplicate add is a no-op.
    s.addToWatchlist("AVAXUSDT");
    now = useAppStore.getState();
    expect(now.watchlist.filter((x) => x === "AVAXUSDT")).toHaveLength(1);

    s.removeFromWatchlist("AVAXUSDT");
    now = useAppStore.getState();
    expect(now.watchlist).toEqual([...DEFAULT_WATCHLIST]);
    expect(now.watchlist).toEqual(flatOf(now));
  });

  it("setWatchlistOrder replaces the order and keeps groups in sync", () => {
    resetWatchlist();
    const next = [...DEFAULT_WATCHLIST].reverse();
    useAppStore.getState().setWatchlistOrder(next);
    const now = useAppStore.getState();
    expect(now.watchlist).toEqual(next);
    expect(now.watchlist).toEqual(flatOf(now));
    expect(now.watchlistGroups[0].symbols).toEqual(next);
  });

  it("toggles and height setters update their own fields only", () => {
    resetWatchlist();
    const s = useAppStore.getState();

    s.toggleWatchlistCollapsed();
    expect(useAppStore.getState().watchlistCollapsed).toBe(true);
    s.toggleWatchlistCollapsed();
    expect(useAppStore.getState().watchlistCollapsed).toBe(false);

    s.toggleWatchlistGroup("watchlist");
    expect(
      useAppStore.getState().watchlistGroups.find((g) => g.id === "watchlist")
        ?.collapsed,
    ).toBe(true);

    s.setWatchlistHeight(320);
    expect(useAppStore.getState().watchlistHeight).toBe(320);
  });

  it("renames the single watchlist and ignores blank names", () => {
    resetWatchlist();
    const s = useAppStore.getState();
    s.renameWatchlist("  Crypto  ");
    expect(useAppStore.getState().watchlistGroups[0].name).toBe("Crypto");
    s.renameWatchlist("   ");
    expect(useAppStore.getState().watchlistGroups[0].name).toBe("Crypto");
  });

  it("creates and switches watchlists without mixing their symbols", () => {
    resetWatchlist();
    const s = useAppStore.getState();
    s.addToWatchlist("AVAXUSDT");
    s.createWatchlist("  Favorites  ");

    const now = useAppStore.getState();
    expect(now.watchlist).toEqual([]);
    expect(now.watchlistGroups[0]).toMatchObject({
      id: "watchlist-2",
      name: "Favorites",
      symbols: [],
    });

    now.addToWatchlist("ETHUSDT");
    now.activateWatchlist("watchlist");
    expect(useAppStore.getState().watchlist).toEqual([...DEFAULT_WATCHLIST, "AVAXUSDT"]);

    useAppStore.getState().activateWatchlist("watchlist-2");
    expect(useAppStore.getState().watchlist).toEqual(["ETHUSDT"]);
  });

  it("deletes the active watchlist and selects the next one", () => {
    resetWatchlist();
    const s = useAppStore.getState();
    s.createWatchlist("Favorites");
    const activeId = useAppStore.getState().watchlistGroups[0].id;
    useAppStore.getState().addToWatchlist("ETHUSDT");
    useAppStore.getState().deleteWatchlist(activeId);

    const now = useAppStore.getState();
    expect(now.watchlistGroups).toHaveLength(1);
    expect(now.watchlistGroups[0].id).toBe("watchlist");
    expect(now.watchlist).toEqual(DEFAULT_WATCHLIST);
  });

  describe("normalizeWatchlistRehydrate", () => {
    const fakeState = (patch: Record<string, unknown>): Store =>
      ({ ...patch }) as unknown as Store;

    it("renames MATICUSDT→POLUSDT and drops EURUSD", () => {
      const st = fakeState({
        watchlist: ["MATICUSDT", "EURUSD", "BTCUSDT"],
        watchlistGroups: [
          { id: "a", name: "A", collapsed: false, symbols: ["EURUSD", "MATICUSDT"] },
          { id: "b", name: "B", collapsed: false, symbols: ["eurusd", "ETHUSDT"] },
        ],
      });
      normalizeWatchlistRehydrate(st);
      expect(st.watchlist).toEqual(["POLUSDT", "BTCUSDT"]);
      expect(st.watchlistGroups).toHaveLength(1);
      expect(st.watchlistGroups[0].id).toBe("watchlist");
      expect(st.watchlistGroups[0].symbols).toEqual(st.watchlist);
    });

    it("rewrites Vela's ticker spelling to the bare MAWS symbol and drops duplicates", () => {
      // A picker row commits `BINANCE:ETHUSDT.P`; the list must hold `ETHUSDT` or the
      // sidebar shows an unknown asset while the pane stars a different string.
      const st = fakeState({
        watchlist: ["BINANCE:ETHUSDT.P", "BTCUSDT.P", "btcusdt", "MATICUSDT.P"],
        watchlistGroups: [
          { id: "a", name: "A", collapsed: false, symbols: ["binance:ethusdt.p", "ETHUSDT"] },
        ],
      });
      normalizeWatchlistRehydrate(st);
      expect(st.watchlist).toEqual(["ETHUSDT", "BTCUSDT", "POLUSDT"]);
      expect(st.watchlistGroups).toHaveLength(1);
      expect(st.watchlistGroups[0].symbols).toEqual(st.watchlist);
    });

    it("guards missing watchlist fields", () => {
      const st = fakeState({});
      normalizeWatchlistRehydrate(st);
      expect(st.watchlist).toEqual([]);
      expect(st.watchlistGroups).toEqual([
        { id: "watchlist", name: "Watchlist", collapsed: false, symbols: [] },
      ]);
    });

    it("does not restore symbols from stale groups when the saved list is empty", () => {
      const st = fakeState({
        watchlist: [],
        watchlistGroups: [
          { id: "legacy-group", name: "Legacy group", collapsed: false, symbols: ["BTCUSDT"] },
        ],
      });
      normalizeWatchlistRehydrate(st);
      expect(st.watchlist).toEqual([]);
      expect(st.watchlistGroups).toEqual([
        { id: "watchlist", name: "Watchlist", collapsed: false, symbols: [] },
      ]);
    });

    it("preserves the renamed title of the current watchlist", () => {
      const st = fakeState({
        watchlist: ["BTCUSDT"],
        watchlistGroups: [
          { id: "watchlist", name: "Crypto", collapsed: false, symbols: ["BTCUSDT"] },
        ],
      });
      normalizeWatchlistRehydrate(st);
      expect(st.watchlistGroups[0].name).toBe("Crypto");
    });

    it("preserves multiple named watchlists but discards old category groups", () => {
      const st = fakeState({
        watchlist: ["ETHUSDT"],
        watchlistGroups: [
          { id: "watchlist", name: "Crypto", collapsed: false, symbols: ["ETHUSDT"] },
          { id: "watchlist-2", name: "Favorites", collapsed: false, symbols: ["BTCUSDT"] },
          { id: "bench", name: "BENCH", collapsed: false, symbols: ["SOLUSDT"] },
        ],
      });
      normalizeWatchlistRehydrate(st);
      expect(st.watchlist).toEqual(["ETHUSDT"]);
      expect(st.watchlistGroups.map((group) => group.name)).toEqual(["Crypto", "Favorites"]);
      expect(st.watchlistGroups[1].symbols).toEqual(["BTCUSDT"]);
    });
  });
});

describe("watchlist-slice atomicity (counting set harness)", () => {
  interface Harness {
    calls: Array<Partial<Store>>;
    state: Store;
    slice: WatchlistSlice;
  }

  function makeHarness(initial: Record<string, unknown>): Harness {
    const calls: Array<Partial<Store>> = [];
    const state = { ...initial } as unknown as Store;
    const set = (
      partial: Partial<Store> | ((s: Store) => Partial<Store>),
    ): void => {
      const patch = typeof partial === "function" ? partial(state) : partial;
      calls.push(patch);
      Object.assign(state as unknown as Record<string, unknown>, patch);
    };
    const get = (): Store => state;
    return { calls, state, slice: createWatchlistSlice(set, get) };
  }

  it("addToWatchlist performs exactly one set() with watchlist + watchlistGroups", () => {
    const h = makeHarness({ watchlist: [], watchlistGroups: defaultGroups() });
    h.slice.addToWatchlist("AVAXUSDT");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0]).sort()).toEqual([
      "watchlist",
      "watchlistGroups",
    ]);
    expect(h.state.watchlist).toEqual(flatOf(h.state));
  });

  it("renameWatchlist performs exactly one set() with watchlistGroups", () => {
    const h = makeHarness({ watchlistGroups: defaultGroups() });
    h.slice.renameWatchlist("  Crypto  ");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0])).toEqual(["watchlistGroups"]);
    expect(h.state.watchlistGroups[0].name).toBe("Crypto");
  });

  it("createWatchlist activates a separate empty list", () => {
    const h = makeHarness({
      watchlist: ["BTCUSDT"],
      watchlistGroups: defaultGroups(),
    });
    h.slice.createWatchlist("Favorites");
    expect(h.calls).toHaveLength(1);
    expect(h.state.watchlist).toEqual([]);
    expect(h.state.watchlistGroups[0]).toMatchObject({
      id: "watchlist-2",
      name: "Favorites",
      symbols: [],
    });
    expect(h.state.watchlistGroups[1].symbols).toEqual(DEFAULT_WATCHLIST);
  });

  it("removeFromWatchlist performs exactly one set() with watchlist + watchlistGroups", () => {
    const h = makeHarness({
      watchlist: [...DEFAULT_WATCHLIST],
      watchlistGroups: defaultGroups(),
    });
    h.slice.removeFromWatchlist("BTCUSDT.P");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0]).sort()).toEqual([
      "watchlist",
      "watchlistGroups",
    ]);
    expect(h.state.watchlist).toEqual(flatOf(h.state));
    expect(h.state.watchlist).not.toContain("BTCUSDT.P");
  });

  it("moveWatchlistSymbol performs exactly one set() with watchlist + watchlistGroups", () => {
    const h = makeHarness({
      watchlist: [...DEFAULT_WATCHLIST],
      watchlistGroups: defaultGroups(),
    });
    h.slice.moveWatchlistSymbol("BTCUSDT.P", "watchlist", 0);
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0]).sort()).toEqual([
      "watchlist",
      "watchlistGroups",
    ]);
    expect(h.state.watchlist).toEqual(flatOf(h.state));
  });

  it("reorderWatchlist performs exactly one set() with watchlist + watchlistGroups", () => {
    const h = makeHarness({
      watchlist: [...DEFAULT_WATCHLIST],
      watchlistGroups: defaultGroups(),
    });
    h.slice.reorderWatchlist(0, 1);
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0]).sort()).toEqual([
      "watchlist",
      "watchlistGroups",
    ]);
    expect(h.state.watchlist).toEqual(flatOf(h.state));
  });

  it("setWatchlistOrder performs exactly one set() with watchlist + watchlistGroups", () => {
    const h = makeHarness({
      watchlist: [...DEFAULT_WATCHLIST],
      watchlistGroups: defaultGroups(),
    });
    h.slice.setWatchlistOrder(["BTCUSDT", "ETHUSDT"]);
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0]).sort()).toEqual([
      "watchlist",
      "watchlistGroups",
    ]);
    expect(h.state.watchlist).toEqual(["BTCUSDT", "ETHUSDT"]);
  });

  it("no-op paths never call set()", () => {
    const h = makeHarness({
      watchlist: [...DEFAULT_WATCHLIST],
      watchlistGroups: defaultGroups(),
    });
    h.slice.addToWatchlist("BTCUSDT.P"); // already present
    h.slice.moveWatchlistSymbol("NOPEUSDT", "watchlist", 0);
    h.slice.moveWatchlistSymbol("BTCUSDT.P", "no-such-group", 0);
    h.slice.reorderWatchlist(0, 0);
    h.slice.reorderWatchlist(-1, 2);
    h.slice.reorderWatchlist(0, 999);
    expect(h.calls).toHaveLength(0);
  });
});
