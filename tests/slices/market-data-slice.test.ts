import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { useAppStore, workspacePartialize } from "@/lib/store";
import type { Store } from "@/lib/store";
import { collectHotSymbols, createMarketDataSlice } from "@/lib/slices/market-data-slice";
import { mawsFeed } from "@/lib/maws/feed";
import type { ChartOrder, ChartPaneState, ChartPosition } from "@/types";

/**
 * Phase G regression tests for the market-data-slice extraction:
 *   - hotSymbols starts [] on the real root store (runtime-only field);
 *   - syncHotSymbols rebuilds the deduplicated union of watchlist + visible
 *     panes (layoutCount cutoff) + orders + positions, stripping ".P" and
 *     uppercasing, and pushes the SAME array to the store and mawsFeed;
 *   - hotSymbols never appears in workspacePartialize output;
 *   - atomicity: counting-set harness proves syncHotSymbols performs exactly
 *     ONE set() whose patch carries only hotSymbols.
 */

const SEEDED_FIELDS = [
  "watchlist",
  "layoutCount",
  "panes",
  "orders",
  "positions",
  "hotSymbols",
] as const;

function snapshot(): Record<string, unknown> {
  const s = useAppStore.getState() as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of SEEDED_FIELDS) out[k] = s[k];
  return JSON.parse(JSON.stringify(out));
}

const pristine = snapshot();

function resetMarketData(): void {
  useAppStore.setState(JSON.parse(JSON.stringify(pristine)) as Partial<Store>);
}

beforeEach(resetMarketData);

const mkPane = (id: string, symbol: string): ChartPaneState => ({
  id,
  symbol,
  timeframe: "1h",
  studies: [],
  drawings: [],
});

const mkOrder = (symbol: string): ChartOrder =>
  ({ symbol }) as unknown as ChartOrder;
const mkPosition = (symbol: string): ChartPosition =>
  ({ symbol }) as unknown as ChartPosition;

describe("market-data-slice defaults (real root store)", () => {
  it("starts with an empty runtime-only hotSymbols set", () => {
    expect(useAppStore.getState().hotSymbols).toEqual([]);
  });

  it("exposes syncHotSymbols as an action on the composed store", () => {
    expect(typeof useAppStore.getState().syncHotSymbols).toBe("function");
  });
});

describe("syncHotSymbols rebuild proof (real root store)", () => {
  let spy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    spy = jest.spyOn(mawsFeed, "setHotSymbols").mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it("rebuilds the deduplicated union honoring the layoutCount cutoff", () => {
    useAppStore.setState({
      watchlist: ["BTCUSDT", "ethusdt.p", "LINKUSDT"],
      layoutCount: 2,
      panes: [mkPane("pane-0", "SOLUSDT"), mkPane("pane-1", "solusdt.p"), mkPane("pane-2", "XRPUSDT")],
      orders: [mkOrder("ORDUSDT")],
      positions: [mkPosition("POSUSDT")],
    } as Partial<Store>);

    useAppStore.getState().syncHotSymbols();

    const expected = ["BTCUSDT", "ETHUSDT", "LINKUSDT", "SOLUSDT", "ORDUSDT", "POSUSDT"];
    expect(useAppStore.getState().hotSymbols).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("includes order-only symbols not present on the watchlist or panes", () => {
    useAppStore.setState({
      watchlist: ["BTCUSDT"],
      layoutCount: 1,
      panes: [mkPane("pane-0", "BTCUSDT")],
      orders: [mkOrder("ORDUSDT")],
      positions: [],
    } as Partial<Store>);

    useAppStore.getState().syncHotSymbols();

    expect(useAppStore.getState().hotSymbols).toEqual(["BTCUSDT", "ORDUSDT"]);
    expect(spy).toHaveBeenCalledWith(["BTCUSDT", "ORDUSDT"]);
  });

  it("includes position-only symbols not present on the watchlist or panes", () => {
    useAppStore.setState({
      watchlist: ["BTCUSDT"],
      layoutCount: 1,
      panes: [mkPane("pane-0", "BTCUSDT")],
      orders: [],
      positions: [mkPosition("POSUSDT")],
    } as Partial<Store>);

    useAppStore.getState().syncHotSymbols();

    expect(useAppStore.getState().hotSymbols).toEqual(["BTCUSDT", "POSUSDT"]);
    expect(spy).toHaveBeenCalledWith(["BTCUSDT", "POSUSDT"]);
  });

  it("excludes panes beyond layoutCount", () => {
    useAppStore.setState({
      watchlist: [],
      layoutCount: 1,
      panes: [mkPane("pane-0", "BTCUSDT"), mkPane("pane-1", "ETHUSDT")],
      orders: [],
      positions: [],
    } as Partial<Store>);

    useAppStore.getState().syncHotSymbols();

    expect(useAppStore.getState().hotSymbols).toEqual(["BTCUSDT"]);
  });

  it("re-syncs to an empty set when every source is empty", () => {
    useAppStore.setState({
      watchlist: [],
      layoutCount: 1,
      panes: [mkPane("pane-0", "BTCUSDT")],
      orders: [],
      positions: [],
    } as Partial<Store>);
    useAppStore.getState().syncHotSymbols();
    expect(useAppStore.getState().hotSymbols).toEqual(["BTCUSDT"]);

    useAppStore.setState({ panes: [] } as Partial<Store>);
    useAppStore.getState().syncHotSymbols();

    expect(useAppStore.getState().hotSymbols).toEqual([]);
    expect(spy).toHaveBeenLastCalledWith([]);
  });
});

describe("hotSymbols persistence boundary", () => {
  it("is absent from workspacePartialize even after a sync", () => {
    const spy = jest.spyOn(mawsFeed, "setHotSymbols").mockImplementation(() => {});
    try {
      useAppStore.setState({
        watchlist: ["BTCUSDT"],
        layoutCount: 1,
        panes: [mkPane("pane-0", "BTCUSDT")],
        orders: [],
        positions: [],
      } as Partial<Store>);
      useAppStore.getState().syncHotSymbols();
      expect(useAppStore.getState().hotSymbols).toEqual(["BTCUSDT"]);

      const persisted = workspacePartialize(useAppStore.getState());
      expect(persisted).not.toHaveProperty("hotSymbols");
      expect(Object.keys(persisted)).toHaveLength(49);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("collectHotSymbols pure helper", () => {
  it("strips .P suffixes case-insensitively, uppercases, and dedupes", () => {
    const hot = collectHotSymbols({
      watchlist: ["btcusdt", "ETHUSDT.P", "ethusdt.p"],
      layoutCount: 2,
      panes: [{ symbol: "Solusdt.p" }, { symbol: "BTCUSDT" }],
      orders: [{ symbol: "ordusdt" }],
      positions: [{ symbol: "ORDUSDT" }],
    });
    expect(hot).toEqual(["BTCUSDT", "ETHUSDT", "SOLUSDT", "ORDUSDT"]);
  });

  it("honors layoutCount and skips empty symbols", () => {
    const hot = collectHotSymbols({
      watchlist: ["", "BTCUSDT"],
      layoutCount: 1,
      panes: [{ symbol: "ETHUSDT" }, { symbol: "XRPUSDT" }],
      orders: [],
      positions: [],
    });
    expect(hot).toEqual(["BTCUSDT", "ETHUSDT"]);
  });
});

describe("syncHotSymbols atomicity (counting-set harness)", () => {
  it("performs exactly ONE set() whose patch carries only hotSymbols", () => {
    const spy = jest.spyOn(mawsFeed, "setHotSymbols").mockImplementation(() => {});
    try {
      const state = {
        watchlist: ["BTCUSDT"],
        layoutCount: 1,
        panes: [mkPane("pane-0", "SOLUSDT")],
        orders: [mkOrder("ORDUSDT")],
        positions: [],
      } as unknown as Store;
      const calls: Array<Partial<Store>> = [];
      const set = (
        partial: Partial<Store> | ((s: Store) => Partial<Store>),
      ): void => {
        const patch = typeof partial === "function" ? partial(state) : partial;
        calls.push(patch);
        Object.assign(state, patch);
      };
      const slice = createMarketDataSlice(set, () => state);

      slice.syncHotSymbols();

      expect(calls).toHaveLength(1);
      expect(Object.keys(calls[0] ?? {})).toEqual(["hotSymbols"]);
      const expected = ["BTCUSDT", "SOLUSDT", "ORDUSDT"];
      expect(state.hotSymbols).toEqual(expected);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(expected);
    } finally {
      spy.mockRestore();
    }
  });
});
