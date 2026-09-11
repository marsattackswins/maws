import { describe, it, expect, afterEach } from "@jest/globals";
import { useAppStore } from "@/lib/store";
import type { Store } from "@/lib/store";
import {
  createSymbolSettingsSlice,
  normalizeSymbolSettingsRehydrate,
  type SymbolSettingsSlice,
} from "@/lib/slices/symbol-settings-slice";
import { DEFAULT_SYMBOL_TRADING } from "@/types";

/**
 * Phase C regression tests for the symbol-settings-slice:
 *   - default symbolTrading is an empty map;
 *   - patchSymbolTrading falls back to chartSettings.defaultLeverage
 *     (read-only cross-slice get) when the symbol has no saved leverage,
 *     preserves an existing leverage, and lets the patch win;
 *   - setSymbolTrading normalizes the value through DEFAULT_SYMBOL_TRADING;
 *   - normalizeSymbolSettingsRehydrate guards missing maps, drops EURUSD,
 *     and migrates MATICUSDT→POLUSDT (only when POLUSDT is absent);
 *   - atomicity: both actions perform exactly ONE set() whose single patch
 *     carries only symbolTrading, and never mutate chartSettings.
 */

function resetSymbolTrading(): void {
  useAppStore.setState({ symbolTrading: {} });
}

describe("symbol-settings-slice (real root store)", () => {
  afterEach(() => {
    resetSymbolTrading();
  });

  it("starts with an empty symbolTrading map", () => {
    resetSymbolTrading();
    expect(useAppStore.getState().symbolTrading).toEqual({});
  });

  it("patchSymbolTrading falls back to chartSettings.defaultLeverage (read-only)", () => {
    resetSymbolTrading();
    const defaultLeverage = useAppStore.getState().chartSettings.defaultLeverage;
    expect(defaultLeverage).toBe(10);

    useAppStore.getState().patchSymbolTrading("BTCUSDT", { slPercent: 3 });
    const now = useAppStore.getState();
    expect(now.symbolTrading.BTCUSDT).toEqual({
      ...DEFAULT_SYMBOL_TRADING,
      leverage: defaultLeverage,
      slPercent: 3,
    });
    // The cross-slice read must not mutate chartSettings.
    expect(now.chartSettings.defaultLeverage).toBe(defaultLeverage);
  });

  it("patchSymbolTrading keeps an existing leverage over the chart default", () => {
    resetSymbolTrading();
    const s = useAppStore.getState();
    s.setSymbolTrading("ETHUSDT", { ...DEFAULT_SYMBOL_TRADING, leverage: 3 });
    s.patchSymbolTrading("ETHUSDT", { tpPercent: 5 });
    const now = useAppStore.getState();
    expect(now.symbolTrading.ETHUSDT.leverage).toBe(3);
    expect(now.symbolTrading.ETHUSDT.tpPercent).toBe(5);
    // Untouched symbols survive alongside the patched one.
    s.patchSymbolTrading("SOLUSDT", {});
    expect(Object.keys(useAppStore.getState().symbolTrading).sort()).toEqual([
      "ETHUSDT",
      "SOLUSDT",
    ]);
  });

  it("setSymbolTrading normalizes through DEFAULT_SYMBOL_TRADING", () => {
    resetSymbolTrading();
    useAppStore
      .getState()
      .setSymbolTrading("XRPUSDT", { ...DEFAULT_SYMBOL_TRADING, margin: 250 });
    expect(useAppStore.getState().symbolTrading.XRPUSDT).toEqual({
      ...DEFAULT_SYMBOL_TRADING,
      margin: 250,
    });
  });

  describe("normalizeSymbolSettingsRehydrate", () => {
    const fakeState = (patch: Record<string, unknown>): Store =>
      ({ ...patch }) as unknown as Store;

    it("guards a missing symbolTrading map", () => {
      const st = fakeState({});
      normalizeSymbolSettingsRehydrate(st);
      expect(st.symbolTrading).toEqual({});
    });

    it("drops EURUSD keys case-insensitively", () => {
      const st = fakeState({
        symbolTrading: {
          EURUSD: { ...DEFAULT_SYMBOL_TRADING },
          eurusd: { ...DEFAULT_SYMBOL_TRADING },
          BTCUSDT: { ...DEFAULT_SYMBOL_TRADING },
        },
      });
      normalizeSymbolSettingsRehydrate(st);
      expect(Object.keys(st.symbolTrading)).toEqual(["BTCUSDT"]);
    });

    it("migrates MATICUSDT to POLUSDT when POLUSDT is absent", () => {
      const settings = { ...DEFAULT_SYMBOL_TRADING, leverage: 4 };
      const st = fakeState({ symbolTrading: { MATICUSDT: settings } });
      normalizeSymbolSettingsRehydrate(st);
      expect(st.symbolTrading).toEqual({ POLUSDT: settings });
    });

    it("keeps both entries when POLUSDT already exists", () => {
      const matic = { ...DEFAULT_SYMBOL_TRADING, leverage: 4 };
      const pol = { ...DEFAULT_SYMBOL_TRADING, leverage: 8 };
      const st = fakeState({
        symbolTrading: { MATICUSDT: matic, POLUSDT: pol },
      });
      normalizeSymbolSettingsRehydrate(st);
      expect(st.symbolTrading).toEqual({ MATICUSDT: matic, POLUSDT: pol });
    });
  });
});

describe("symbol-settings-slice atomicity (counting set harness)", () => {
  interface Harness {
    calls: Array<Partial<Store>>;
    state: Store;
    slice: SymbolSettingsSlice;
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
    return { calls, state, slice: createSymbolSettingsSlice(set, get) };
  }

  it("patchSymbolTrading performs exactly one set() with only symbolTrading", () => {
    const h = makeHarness({
      symbolTrading: {},
      chartSettings: { defaultLeverage: 7 },
    });
    h.slice.patchSymbolTrading("BTCUSDT", { confirmOrders: true });
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0])).toEqual(["symbolTrading"]);
    expect(h.state.symbolTrading.BTCUSDT).toEqual({
      ...DEFAULT_SYMBOL_TRADING,
      leverage: 7,
      confirmOrders: true,
    });
    // chartSettings was only read, never written.
    expect(h.state.chartSettings).toEqual({ defaultLeverage: 7 });
  });

  it("setSymbolTrading performs exactly one set() with only symbolTrading", () => {
    const h = makeHarness({
      symbolTrading: { BTCUSDT: DEFAULT_SYMBOL_TRADING },
      chartSettings: { defaultLeverage: 7 },
    });
    h.slice.setSymbolTrading("ETHUSDT", {
      ...DEFAULT_SYMBOL_TRADING,
      leverage: 2,
    });
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0])).toEqual(["symbolTrading"]);
    expect(h.state.symbolTrading.ETHUSDT.leverage).toBe(2);
    // The pre-existing symbol entry survives the merge.
    expect(h.state.symbolTrading.BTCUSDT).toEqual(DEFAULT_SYMBOL_TRADING);
  });
});
