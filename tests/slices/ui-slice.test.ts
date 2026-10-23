import { describe, it, expect } from "@jest/globals";
import { useAppStore } from "@/lib/store";
import type { Store } from "@/lib/store";
import {
  RIGHT_DOCK_IDS,
  createUiSlice,
  moveDockId,
  normalizeDockOrder,
  normalizeUiRehydrate,
  sameDockOrder,
  shiftDockId,
  type BottomTab,
  type UiSlice,
} from "@/lib/slices/ui-slice";
import type { DockId } from "@/types";

/**
 * Phase A regression tests for the ui-slice:
 *   - closeMenus clears all six menu/search flags;
 *   - setContextMenu(null) preserves buySellMenu, non-null clears it;
 *   - toggleBottomTab opens/closes the bottom panel atomically;
 *   - normalizeUiRehydrate validates bottomTab and ONLY there (invalid value
 *     falls back to "positions", every valid tab is preserved);
 *   - atomicity: setBottomTab / setBottomTabCollapsed / toggleBottomTab
 *     perform exactly ONE set() whose single patch carries every cross-field update.
 */

const VALID_TABS: BottomTab[] = [
  "positions",
  "orders",
  "orderHistory",
  "balanceHistory",
  "journal",
];

function resetUi(): void {
  const s = useAppStore.getState();
  s.closeMenus();
  s.setBottomTab("positions");
  s.setBottomOpen(false);
  s.setRightDock("strategy");
}

describe("ui-slice (real root store)", () => {
  it("closeMenus clears all six flags", () => {
    resetUi();
    const s = useAppStore.getState();
    const cleared = (): void => {
      const after = useAppStore.getState();
      expect(after.searchOpen).toBe(false);
      expect(after.indicatorMenuOpen).toBe(false);
      expect(after.layoutMenuOpen).toBe(false);
      expect(after.contextMenu).toBeNull();
      expect(after.buySellMenu).toBeNull();
      expect(after.accountSettingsOpen).toBe(false);
    };

    // The search/indicator/layout popovers are mutually exclusive, as are
    // contextMenu/buySellMenu — so exercise each flag across three rounds.
    s.setSearchOpen(true);
    s.setAccountSettingsOpen(true);
    s.setBuySellMenu({ x: 10, y: 20, symbol: "BTCUSDT" });
    expect(useAppStore.getState().searchOpen).toBe(true);
    expect(useAppStore.getState().accountSettingsOpen).toBe(true);
    expect(useAppStore.getState().buySellMenu).toEqual({
      x: 10,
      y: 20,
      symbol: "BTCUSDT",
    });
    s.closeMenus();
    cleared();

    s.setIndicatorMenuOpen(true);
    s.setContextMenu({ x: 5, y: 6, paneId: "pane-0", price: 100, time: null });
    expect(useAppStore.getState().indicatorMenuOpen).toBe(true);
    expect(useAppStore.getState().contextMenu).not.toBeNull();
    s.closeMenus();
    cleared();

    s.setLayoutMenuOpen(true);
    expect(useAppStore.getState().layoutMenuOpen).toBe(true);
    s.closeMenus();
    cleared();
    resetUi();
  });

  it("setContextMenu(non-null) clears buySellMenu; setContextMenu(null) preserves it", () => {
    resetUi();
    const s = useAppStore.getState();

    s.setBuySellMenu({ x: 1, y: 2, symbol: "ETHUSDT" });
    expect(useAppStore.getState().buySellMenu).toEqual({
      x: 1,
      y: 2,
      symbol: "ETHUSDT",
    });

    s.setContextMenu({ x: 5, y: 6, paneId: "pane-0", price: 100, time: null });
    let now = useAppStore.getState();
    expect(now.contextMenu).toEqual({
      x: 5,
      y: 6,
      paneId: "pane-0",
      price: 100,
      time: null,
    });
    expect(now.buySellMenu).toBeNull();

    // Re-open the buy/sell menu, then close the context menu with null —
    // the buy/sell menu must survive.
    s.setBuySellMenu({ x: 3, y: 4, symbol: "BTCUSDT" });
    s.setContextMenu(null);
    now = useAppStore.getState();
    expect(now.contextMenu).toBeNull();
    expect(now.buySellMenu).toEqual({ x: 3, y: 4, symbol: "BTCUSDT" });
    resetUi();
  });

  it("toggleBottomTab opens on switch and closes on same-tab toggle", () => {
    resetUi();
    const s = useAppStore.getState();

    expect(useAppStore.getState().bottomOpen).toBe(false);

    s.setBottomTab("orders");
    expect(useAppStore.getState().bottomOpen).toBe(true);
    expect(useAppStore.getState().bottomTab).toBe("orders");

    // Same tab while open → closes (tab stays selected).
    s.toggleBottomTab("orders");
    expect(useAppStore.getState().bottomOpen).toBe(false);
    expect(useAppStore.getState().bottomTab).toBe("orders");

    // Different tab while closed → opens with the new tab.
    s.toggleBottomTab("journal");
    expect(useAppStore.getState().bottomOpen).toBe(true);
    expect(useAppStore.getState().bottomTab).toBe("journal");

    // Same tab while open again → closes.
    s.toggleBottomTab("journal");
    expect(useAppStore.getState().bottomOpen).toBe(false);
    resetUi();
  });

  describe("right rail order (drag to rearrange)", () => {
    it("defaults to the canonical order", () => {
      expect(useAppStore.getState().rightDockOrder).toEqual(RIGHT_DOCK_IDS);
    });

    it("stores a rearranged order and drops unknown / duplicate ids", () => {
      const s = useAppStore.getState();
      s.setRightDockOrder([
        "alerts",
        "alerts",
        "bogus" as never,
        "scripts",
        "strategy",
        "objects",
      ]);
      // Unknown + duplicate entries are dropped; every known id survives, with the
      // ones the caller omitted appended in canonical order.
      expect(useAppStore.getState().rightDockOrder).toEqual([
        "alerts",
        "scripts",
        "strategy",
        "objects",
        "calendar",
      ]);
      s.setRightDockOrder(RIGHT_DOCK_IDS);
    });

    it("normalizeDockOrder never loses a button", () => {
      expect(normalizeDockOrder(undefined)).toEqual(RIGHT_DOCK_IDS);
      expect(normalizeDockOrder([])).toEqual(RIGHT_DOCK_IDS);
      expect(normalizeDockOrder(["scripts", "scripts"])).toEqual([
        "scripts",
        "strategy",
        "calendar",
        "objects",
        "alerts",
      ]);
    });

    it("rehydration repairs a corrupt persisted order", () => {
      const st = { rightDockOrder: ["nope", "alerts"] } as unknown as Store;
      normalizeUiRehydrate(st);
      expect(st.rightDockOrder).toEqual([
        "alerts",
        "strategy",
        "calendar",
        "objects",
        "scripts",
      ]);
    });
  });

  describe("normalizeUiRehydrate bottomTab validation (exclusive owner)", () => {
    const fakeState = (patch: Record<string, unknown>): Store =>
      ({ ...patch }) as unknown as Store;

    it("invalid bottomTab falls back to positions", () => {
      for (const bad of ["trades", "", null, 42, undefined]) {
        const st = fakeState({ bottomTab: bad });
        normalizeUiRehydrate(st);
        expect(st.bottomTab).toBe("positions");
      }
    });

    it("every valid bottomTab is preserved", () => {
      for (const tab of VALID_TABS) {
        const st = fakeState({ bottomTab: tab });
        normalizeUiRehydrate(st);
        expect(st.bottomTab).toBe(tab);
      }
    });
  });
});

describe("right-rail live reorder helpers", () => {
  const base: DockId[] = ["strategy", "calendar", "objects", "scripts", "alerts"];

  it("moves an icon into the gap above (before) and below (after) a target", () => {
    // Drag "alerts" up onto "strategy"'s top half.
    expect(moveDockId(base, "alerts", "strategy", false)).toEqual([
      "alerts",
      "strategy",
      "calendar",
      "objects",
      "scripts",
    ]);
    // Drag "strategy" down onto "scripts"' bottom half.
    expect(moveDockId(base, "strategy", "scripts", true)).toEqual([
      "calendar",
      "objects",
      "scripts",
      "strategy",
      "alerts",
    ]);
  });

  it("index math survives both directions without dropping or duplicating an icon", () => {
    for (const dragId of base) {
      for (const targetId of base) {
        for (const after of [false, true]) {
          const next = moveDockId(base, dragId, targetId, after);
          expect([...next].sort()).toEqual([...base].sort());
        }
      }
    }
  });

  it("is a no-op for a self-target or an unknown target", () => {
    const next = moveDockId(base, "objects", "objects", true);
    expect(next).toEqual(base);
    expect(next).not.toBe(base); // new array, never mutates the input
    expect(moveDockId(base, "objects", "nope" as DockId, false)).toEqual(base);
  });

  it("shiftDockId moves one slot and clamps at the ends", () => {
    expect(shiftDockId(base, "calendar", -1)).toEqual([
      "calendar",
      "strategy",
      "objects",
      "scripts",
      "alerts",
    ]);
    expect(shiftDockId(base, "strategy", -1)).toEqual(base);
    expect(shiftDockId(base, "alerts", 1)).toEqual(base);
    expect(shiftDockId(base, "missing" as DockId, 1)).toEqual(base);
  });

  it("sameDockOrder distinguishes equal arrangements from a real change", () => {
    expect(sameDockOrder(base, [...base])).toBe(true);
    expect(sameDockOrder(base, normalizeDockOrder(base))).toBe(true);
    expect(sameDockOrder(base, ["calendar", "strategy", "objects", "scripts", "alerts"])).toBe(
      false,
    );
    expect(sameDockOrder(base, base.slice(0, 4))).toBe(false);
  });
});

describe("ui-slice atomicity (counting set harness)", () => {
  interface Harness {
    calls: Array<Partial<Store>>;
    state: Store;
    slice: UiSlice;
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
    return { calls, state, slice: createUiSlice(set, get) };
  }

  it("setBottomTab performs exactly one set() carrying bottomTab + bottomOpen", () => {
    const h = makeHarness({ bottomOpen: false, bottomTab: "positions" });
    h.slice.setBottomTab("orders");
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({ bottomTab: "orders", bottomOpen: true });
  });

  it("setBottomTabCollapsed selects a tab without opening the panel", () => {
    const h = makeHarness({ bottomOpen: true, bottomTab: "orders" });
    h.slice.setBottomTabCollapsed("positions");
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({ bottomTab: "positions", bottomOpen: false });
  });

  it("toggleBottomTab (close path) performs exactly one set()", () => {
    const h = makeHarness({ bottomOpen: true, bottomTab: "orders" });
    h.slice.toggleBottomTab("orders");
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({ bottomOpen: false });
    expect(h.state.bottomTab).toBe("orders");
  });

  it("toggleBottomTab (switch path) performs exactly one set()", () => {
    const h = makeHarness({ bottomOpen: true, bottomTab: "orders" });
    h.slice.toggleBottomTab("journal");
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({ bottomTab: "journal", bottomOpen: true });
  });
});
