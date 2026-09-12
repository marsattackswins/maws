import { describe, it, expect, beforeEach } from "@jest/globals";
import { useAppStore, workspacePartialize } from "@/lib/store";
import type { Store } from "@/lib/store";
import {
  createDrawingSlice,
  normalizeDrawingRehydrate,
  type DrawingSlice,
} from "@/lib/slices/drawing-slice";
import type { Drawing } from "@/types";

/**
 * Phase F regression tests for the drawing-slice extraction:
 *   - every documented drawing default survives the move into createDrawingSlice;
 *   - addDrawing selects the new drawing and pushes the pre-change snapshot
 *     onto the history stack; undo/redo walk the history index correctly;
 *   - setDrawingSettingsTarget keeps its cross-slice effects (clears
 *     indicatorSettingsId / settingsOpen / contextMenu, syncs selection);
 *   - persistence boundary: drawingTool/stayInDrawingMode/magnet/drawingsHidden
 *     stay persisted, drawingHistory/drawingHistoryIndex/selectedDrawingId/
 *     drawingSettingsTarget stay runtime-only (50-key schema itself is pinned
 *     by tests/persistence-compat.test.ts);
 *   - normalizeDrawingRehydrate keeps the drawingTool reset and normalizes any
 *     hydrated drawingSettingsTarget back to null;
 *   - atomicity: counting-set harness proves addDrawing / removeDrawing /
 *     clearDrawings / undoDrawing / setDrawingSettingsTarget each perform
 *     exactly ONE set() with narrow patches.
 */

const DRAWING_FIELDS = [
  "drawingTool",
  "stayInDrawingMode",
  "magnet",
  "drawingsHidden",
  "drawingHistory",
  "drawingHistoryIndex",
  "drawingSettingsTarget",
  "selectedDrawingId",
] as const;

const CROSS_FIELDS = [
  "panes",
  "settingsOpen",
  "contextMenu",
  "indicatorSettingsId",
] as const;

function snapshot(): Record<string, unknown> {
  const s = useAppStore.getState() as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of [...DRAWING_FIELDS, ...CROSS_FIELDS]) out[k] = s[k];
  return JSON.parse(JSON.stringify(out));
}

const pristine = snapshot();

function resetDrawing(): void {
  useAppStore.setState(JSON.parse(JSON.stringify(pristine)) as Partial<Store>);
}

beforeEach(resetDrawing);

const mkDrawing = (id: string): Drawing => ({
  id,
  tool: "trend",
  points: [
    { time: 1000, price: 100 },
    { time: 2000, price: 110 },
  ],
  color: "#ff5252",
});

describe("drawing-slice defaults (real root store)", () => {
  it("carries every documented drawing default", () => {
    const s = useAppStore.getState();
    expect(s.drawingTool).toBe("cursor");
    expect(s.stayInDrawingMode).toBe(false);
    expect(s.magnet).toBe(true);
    expect(s.drawingsHidden).toBe(false);
    expect(s.drawingHistory).toEqual([]);
    expect(s.drawingHistoryIndex).toBe(-1);
    expect(s.drawingSettingsTarget).toBeNull();
    expect(s.selectedDrawingId).toBeNull();
  });
});

describe("drawing-slice actions (real root store)", () => {
  it("addDrawing selects the drawing and pushes the pre-change history snapshot", () => {
    const s = useAppStore.getState();
    s.addDrawing("pane-0", mkDrawing("d1"));
    let now = useAppStore.getState();
    expect(now.panes[0]?.drawings.map((d) => d.id)).toEqual(["d1"]);
    expect(now.selectedDrawingId).toBe("d1");
    expect(now.drawingHistory).toHaveLength(1);
    expect(now.drawingHistory[0]).toEqual({ paneId: "pane-0", drawings: [] });
    expect(now.drawingHistoryIndex).toBe(0);

    s.addDrawing("pane-0", mkDrawing("d2"));
    now = useAppStore.getState();
    expect(now.panes[0]?.drawings.map((d) => d.id)).toEqual(["d1", "d2"]);
    expect(now.selectedDrawingId).toBe("d2");
    expect(now.drawingHistory).toHaveLength(2);
    expect(now.drawingHistory[1]?.drawings.map((d) => d.id)).toEqual(["d1"]);
    expect(now.drawingHistoryIndex).toBe(1);
  });

  it("addDrawing on an unknown pane is a no-op", () => {
    const s = useAppStore.getState();
    s.addDrawing("nope", mkDrawing("dx"));
    const now = useAppStore.getState();
    expect(now.drawingHistory).toEqual([]);
    expect(now.drawingHistoryIndex).toBe(-1);
    expect(now.selectedDrawingId).toBeNull();
  });

  it("undo/redo walk the history index", () => {
    const s = useAppStore.getState();
    s.addDrawing("pane-0", mkDrawing("d1"));
    s.addDrawing("pane-0", mkDrawing("d2"));

    // Undo to one drawing, then to none.
    s.undoDrawing();
    let now = useAppStore.getState();
    expect(now.panes[0]?.drawings.map((d) => d.id)).toEqual(["d1"]);
    expect(now.drawingHistoryIndex).toBe(0);
    expect(now.selectedDrawingId).toBeNull();

    s.undoDrawing();
    now = useAppStore.getState();
    expect(now.panes[0]?.drawings).toEqual([]);
    expect(now.drawingHistoryIndex).toBe(-1);

    // Undo below zero is a no-op.
    s.undoDrawing();
    expect(useAppStore.getState().drawingHistoryIndex).toBe(-1);
    expect(useAppStore.getState().panes[0]?.drawings).toEqual([]);

    // Redo restores the state recorded after the first snapshot.
    s.redoDrawing();
    now = useAppStore.getState();
    expect(now.panes[0]?.drawings.map((d) => d.id)).toEqual(["d1"]);
    expect(now.drawingHistoryIndex).toBe(0);

    // Redo at the newest snapshot is a no-op.
    s.redoDrawing();
    now = useAppStore.getState();
    expect(now.drawingHistoryIndex).toBe(0);
    expect(now.panes[0]?.drawings.map((d) => d.id)).toEqual(["d1"]);
  });

  it("removeDrawing drops the drawing, pushes history, clears matching selection", () => {
    const s = useAppStore.getState();
    s.addDrawing("pane-0", mkDrawing("d1"));
    s.addDrawing("pane-0", mkDrawing("d2"));
    expect(useAppStore.getState().selectedDrawingId).toBe("d2");
    s.removeDrawing("pane-0", "d2");
    let now = useAppStore.getState();
    expect(now.panes[0]?.drawings.map((d) => d.id)).toEqual(["d1"]);
    expect(now.selectedDrawingId).toBeNull();
    expect(now.drawingHistory).toHaveLength(3);
    expect(now.drawingHistoryIndex).toBe(2);

    // Removing a non-selected drawing keeps the current selection.
    s.setSelectedDrawing("d1");
    s.addDrawing("pane-0", mkDrawing("d3"));
    s.setSelectedDrawing("d1");
    s.removeDrawing("pane-0", "d3");
    now = useAppStore.getState();
    expect(now.selectedDrawingId).toBe("d1");
  });

  it("clearDrawings empties the pane, pushes history, clears selection", () => {
    const s = useAppStore.getState();
    s.addDrawing("pane-0", mkDrawing("d1"));
    s.clearDrawings("pane-0");
    const now = useAppStore.getState();
    expect(now.panes[0]?.drawings).toEqual([]);
    expect(now.selectedDrawingId).toBeNull();
    expect(now.drawingHistory).toHaveLength(2);
    expect(now.drawingHistory[1]?.drawings.map((d) => d.id)).toEqual(["d1"]);
  });

  it("updateDrawing patches without touching the history stack", () => {
    const s = useAppStore.getState();
    s.addDrawing("pane-0", mkDrawing("d1"));
    const historyBefore = useAppStore.getState().drawingHistory;
    s.updateDrawing("pane-0", "d1", { color: "#00ff00" });
    const now = useAppStore.getState();
    expect(now.panes[0]?.drawings[0]?.color).toBe("#00ff00");
    expect(now.drawingHistory).toEqual(historyBefore);
    expect(now.drawingHistoryIndex).toBe(0);
  });

  it("saveDrawingHistory pushes only when the pane changed", () => {
    const s = useAppStore.getState();
    s.addDrawing("pane-0", mkDrawing("d1"));
    expect(useAppStore.getState().drawingHistoryIndex).toBe(0);
    // Pane drawings ([d1]) differ from the last snapshot ([]) → push.
    s.saveDrawingHistory("pane-0");
    expect(useAppStore.getState().drawingHistoryIndex).toBe(1);
    // Identical to the last snapshot → skipped.
    s.saveDrawingHistory("pane-0");
    expect(useAppStore.getState().drawingHistoryIndex).toBe(1);
  });

  it("toggleDrawingHidden flips a single drawing's hidden flag", () => {
    const s = useAppStore.getState();
    s.addDrawing("pane-0", mkDrawing("d1"));
    s.toggleDrawingHidden("pane-0", "d1");
    expect(useAppStore.getState().panes[0]?.drawings[0]?.hidden).toBe(true);
    s.toggleDrawingHidden("pane-0", "d1");
    expect(useAppStore.getState().panes[0]?.drawings[0]?.hidden).toBe(false);
  });

  it("simple setters stay direct", () => {
    const s = useAppStore.getState();
    s.setDrawingTool("trend");
    expect(useAppStore.getState().drawingTool).toBe("trend");
    s.setStayInDrawingMode(true);
    expect(useAppStore.getState().stayInDrawingMode).toBe(true);
    s.setMagnet(false);
    expect(useAppStore.getState().magnet).toBe(false);
    s.setDrawingsHidden(true);
    expect(useAppStore.getState().drawingsHidden).toBe(true);
    s.setSelectedDrawing("abc");
    expect(useAppStore.getState().selectedDrawingId).toBe("abc");
    s.setSelectedDrawing(null);
    expect(useAppStore.getState().selectedDrawingId).toBeNull();
  });

  it("setDrawingSettingsTarget keeps its cross-slice clears and selection sync", () => {
    const s = useAppStore.getState();
    s.setIndicatorSettingsOpen("study-1");
    s.setSettingsOpen(true);
    s.setContextMenu({ x: 1, y: 2, paneId: "pane-0", price: 5, time: null });
    expect(useAppStore.getState().indicatorSettingsId).toBe("study-1");
    expect(useAppStore.getState().settingsOpen).toBe(true);
    expect(useAppStore.getState().contextMenu).not.toBeNull();

    s.setDrawingSettingsTarget({ paneId: "pane-0", drawingId: "d9" });
    let now = useAppStore.getState();
    expect(now.drawingSettingsTarget).toEqual({ paneId: "pane-0", drawingId: "d9" });
    expect(now.indicatorSettingsId).toBeNull();
    expect(now.settingsOpen).toBe(false);
    expect(now.contextMenu).toBeNull();
    expect(now.selectedDrawingId).toBe("d9");

    // Null target clears the editor but preserves the current selection.
    s.setDrawingSettingsTarget(null);
    now = useAppStore.getState();
    expect(now.drawingSettingsTarget).toBeNull();
    expect(now.selectedDrawingId).toBe("d9");
  });

  it("chart-slice setIndicatorSettingsOpen still clears drawingSettingsTarget", () => {
    const s = useAppStore.getState();
    s.setDrawingSettingsTarget({ paneId: "pane-0", drawingId: "d1" });
    expect(useAppStore.getState().drawingSettingsTarget).not.toBeNull();
    s.setIndicatorSettingsOpen("study-2");
    expect(useAppStore.getState().drawingSettingsTarget).toBeNull();
    expect(useAppStore.getState().indicatorSettingsId).toBe("study-2");
  });
});

describe("drawing-slice persistence boundary", () => {
  it("persists the four drawing keys and keeps history/selection runtime-only", () => {
    const s = useAppStore.getState();
    s.setDrawingTool("trend");
    s.setStayInDrawingMode(true);
    s.setMagnet(false);
    s.setDrawingsHidden(true);
    s.addDrawing("pane-0", mkDrawing("d1"));
    s.setDrawingSettingsTarget({ paneId: "pane-0", drawingId: "d1" });

    const part = workspacePartialize(useAppStore.getState()) as Record<
      string,
      unknown
    >;
    expect(part.drawingTool).toBe("trend");
    expect(part.stayInDrawingMode).toBe(true);
    expect(part.magnet).toBe(false);
    expect(part.drawingsHidden).toBe(true);
    for (const key of [
      "drawingHistory",
      "drawingHistoryIndex",
      "selectedDrawingId",
      "drawingSettingsTarget",
    ]) {
      expect(Object.prototype.hasOwnProperty.call(part, key)).toBe(false);
    }
  });
});

describe("normalizeDrawingRehydrate (legacy compat)", () => {
  const fakeState = (patch: Record<string, unknown>): Store =>
    ({ ...patch }) as unknown as Store;

  it("keeps cursor / zoom / persistable tools untouched", () => {
    for (const tool of ["cursor", "zoom", "trend", "fib", "rect"]) {
      const st = fakeState({ drawingTool: tool, drawingSettingsTarget: null });
      normalizeDrawingRehydrate(st);
      expect(st.drawingTool).toBe(tool);
    }
  });

  it("falls back to cursor for non-persistable tools", () => {
    const st = fakeState({ drawingTool: "bogus", drawingSettingsTarget: null });
    normalizeDrawingRehydrate(st);
    expect(st.drawingTool).toBe("cursor");
  });

  it("normalizes any hydrated drawingSettingsTarget back to null", () => {
    const st = fakeState({
      drawingTool: "cursor",
      drawingSettingsTarget: { paneId: "pane-0", drawingId: "d1" },
    });
    normalizeDrawingRehydrate(st);
    expect(st.drawingSettingsTarget).toBeNull();
  });
});

describe("drawing-slice atomicity (counting set harness)", () => {
  interface Harness {
    calls: Array<Partial<Store>>;
    state: Store;
    slice: DrawingSlice;
  }

  const onePane = () => [
    { id: "pane-0", symbol: "BTCUSDT", timeframe: "1D", studies: [], drawings: [] },
  ];

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
    return { calls, state, slice: createDrawingSlice(set, get) };
  }

  it("addDrawing performs exactly one set(): panes + selection + history", () => {
    const h = makeHarness({
      panes: onePane(),
      drawingHistory: [],
      drawingHistoryIndex: -1,
      selectedDrawingId: null,
    });
    h.slice.addDrawing("pane-0", mkDrawing("d1"));
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(
      ["drawingHistory", "drawingHistoryIndex", "panes", "selectedDrawingId"].sort(),
    );
    expect(h.state.selectedDrawingId).toBe("d1");
    expect(h.state.panes[0]?.drawings).toHaveLength(1);
  });

  it("removeDrawing performs exactly one set() with all four keys", () => {
    const h = makeHarness({
      panes: [{ ...onePane()[0], drawings: [mkDrawing("d1")] }],
      drawingHistory: [],
      drawingHistoryIndex: -1,
      selectedDrawingId: "d1",
    });
    h.slice.removeDrawing("pane-0", "d1");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(
      ["drawingHistory", "drawingHistoryIndex", "panes", "selectedDrawingId"].sort(),
    );
    expect(h.state.selectedDrawingId).toBeNull();
  });

  it("clearDrawings performs exactly one set() with all four keys", () => {
    const h = makeHarness({
      panes: [{ ...onePane()[0], drawings: [mkDrawing("d1")] }],
      drawingHistory: [],
      drawingHistoryIndex: -1,
      selectedDrawingId: "d1",
    });
    h.slice.clearDrawings("pane-0");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(
      ["drawingHistory", "drawingHistoryIndex", "panes", "selectedDrawingId"].sort(),
    );
    expect(h.state.panes[0]?.drawings).toEqual([]);
  });

  it("undoDrawing performs exactly one set(): panes + index + selection (history untouched)", () => {
    const history = [{ paneId: "pane-0", drawings: [] }];
    const h = makeHarness({
      panes: [{ ...onePane()[0], drawings: [mkDrawing("d1")] }],
      drawingHistory: history,
      drawingHistoryIndex: 0,
      selectedDrawingId: "d1",
    });
    h.slice.undoDrawing();
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(
      ["drawingHistoryIndex", "panes", "selectedDrawingId"].sort(),
    );
    // The history array itself is never rewritten by undo.
    expect(h.state.drawingHistory).toEqual(history);
    expect(h.state.drawingHistoryIndex).toBe(-1);
    expect(h.state.panes[0]?.drawings).toEqual([]);
  });

  it("setDrawingSettingsTarget performs exactly one set() with all five keys", () => {
    const h = makeHarness({ selectedDrawingId: "sel-1" });
    h.slice.setDrawingSettingsTarget({ paneId: "pane-0", drawingId: "d9" });
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({
      drawingSettingsTarget: { paneId: "pane-0", drawingId: "d9" },
      indicatorSettingsId: null,
      settingsOpen: false,
      contextMenu: null,
      selectedDrawingId: "d9",
    });
  });

  it("setDrawingSettingsTarget(null) preserves the existing selection in one set()", () => {
    const h = makeHarness({ selectedDrawingId: "sel-1" });
    h.slice.setDrawingSettingsTarget(null);
    expect(h.calls).toHaveLength(1);
    expect(h.state.drawingSettingsTarget).toBeNull();
    expect(h.state.selectedDrawingId).toBe("sel-1");
  });
});
