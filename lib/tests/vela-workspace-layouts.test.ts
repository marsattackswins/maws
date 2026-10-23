/**
 * vela-workspace-layouts.test.ts — MAWS→Vela layout bridge tests (pure, no DOM).
 */
import {
  areasForTemplate,
  buildMawsWorkspaceLayout,
  mawsLayoutTargetForGrid,
  mawsLayoutTargetForId,
  mawsWorkspaceLayoutId,
  mawsWorkspaceLayouts,
} from "../vela-workspace-layouts";
import { layoutTemplate, MAX_LAYOUT_PANES } from "@/lib/layouts";
// Deep import (not the workspace barrel): the layouts registry is pure, while the
// barrel pulls the full workspace shell the jest suite stubs out.
import { layoutDefinition, registerBuiltinLayouts, registerLayout } from "@/lib/charting/workspace/layouts";
import type { LayoutDefinition } from "@/lib/charting/workspace";

describe("mawsWorkspaceLayoutId", () => {
  it('maps every count to its "-h" id; only 2 gets a "-v" variant', () => {
    expect(mawsWorkspaceLayoutId(1, "h")).toBe("1-h");
    expect(mawsWorkspaceLayoutId(4, "h")).toBe("4-h");
    expect(mawsWorkspaceLayoutId(2, "v")).toBe("2-v");
    // Counts without an orientation branch pin to -h (geometry is identical).
    expect(mawsWorkspaceLayoutId(3, "v")).toBe("3-h");
  });
});

describe("areasForTemplate", () => {
  it("uniform grids stay area-less (auto-flow row-major)", () => {
    const { rows, cellAreas } = areasForTemplate(layoutTemplate(4, "h"));
    expect(rows).toBeUndefined();
    expect(cellAreas).toBeUndefined();
  });

  it("featured-left templates (3) expand to named areas matching ChartGrid geometry", () => {
    const { rows, cellAreas } = areasForTemplate(layoutTemplate(3, "h"));
    // ChartGrid's 3-template: featured cell "1 / 1 / 3 / 2" = c1 spans both rows.
    expect(rows).toEqual(["c1 c2", "c1 c3"]);
    expect(cellAreas).toEqual(["c1", "c2", "c3"]);
  });

  it("featured-left 11 (3 rows of 12 tracks) expands each block without overlaps", () => {
    const { rows } = areasForTemplate(layoutTemplate(11, "h"));
    // Block layout: featured 4-wide cells on row 1, then 3-wide blocks below —
    // every track is covered, none is shared.
    expect(rows).toEqual([
      "c1 c1 c1 c1 c2 c2 c2 c2 c3 c3 c3 c3",
      "c4 c4 c4 c5 c5 c5 c6 c6 c6 c7 c7 c7",
      "c8 c8 c8 c9 c9 c9 c10 c10 c10 c11 c11 c11",
    ]);
  });
});

describe("buildMawsWorkspaceLayout", () => {
  it("registers nothing above the pane cap", () => {
    const ids = mawsWorkspaceLayouts().map((d) => d.id);
    expect(ids).toEqual(["1-h", "2-h", "2-v", "3-h", "4-h"]);
    for (const def of mawsWorkspaceLayouts()) {
      expect(def.cells.length).toBeLessThanOrEqual(MAX_LAYOUT_PANES);
    }
  });

  it("produces a valid LayoutDefinition per template (cells match the template)", () => {
    const asymmetric = ["3-h"];
    for (const def of mawsWorkspaceLayouts()) {
      const d = def as LayoutDefinition;
      const count = Number(d.id.split("-")[0]) as Parameters<typeof layoutTemplate>[0];
      const t = layoutTemplate(count, d.id.endsWith("-v") ? "v" : "h");
      expect(d.cells).toHaveLength(t.areas.length);
      expect(d.cells.map((c) => c.id)).toEqual(
        Array.from({ length: t.areas.length }, (_, i) => `c${i + 1}`),
      );
      expect(d.cols).toEqual(t.colFr);
      expect(d.rows).toEqual(t.rowFr);
      // Asymmetric layouts must carry named areas; uniform ones must not.
      expect(Boolean(d.areas)).toBe(asymmetric.includes(d.id));
    }
  });

  it("2-v mirrors ChartGrid's stacked template", () => {
    const def = buildMawsWorkspaceLayout(2, "v");
    expect(def.rows).toEqual([1, 1]);
    expect(def.cols).toEqual([1]);
    expect(def.areas).toBeUndefined();
  });
});

describe("mawsLayoutTargetForGrid (Vela picker canvas → MAWS layout)", () => {
  it("maps exact canvas rectangles onto their MAWS templates", () => {
    expect(mawsLayoutTargetForGrid(1, 1)).toEqual({ count: 1, orientation: "h" });
    expect(mawsLayoutTargetForGrid(1, 2)).toEqual({ count: 2, orientation: "h" });
    expect(mawsLayoutTargetForGrid(2, 1)).toEqual({ count: 2, orientation: "v" });
    expect(mawsLayoutTargetForGrid(2, 2)).toEqual({ count: 4, orientation: "h" });
  });

  it("snaps unmapped rectangles to the densest count inside the cap", () => {
    expect(mawsLayoutTargetForGrid(1, 3)).toEqual({ count: 3, orientation: "h" });
    expect(mawsLayoutTargetForGrid(3, 1)).toEqual({ count: 3, orientation: "h" });
    expect(mawsLayoutTargetForGrid(1, 4)).toEqual({ count: 4, orientation: "h" });
  });

  it("never exceeds the pane cap, however large the rectangle", () => {
    expect(mawsLayoutTargetForGrid(2, 3)).toEqual({ count: 4, orientation: "h" });
    expect(mawsLayoutTargetForGrid(3, 2)).toEqual({ count: 4, orientation: "h" });
    expect(mawsLayoutTargetForGrid(2, 4)).toEqual({ count: 4, orientation: "h" });
    expect(mawsLayoutTargetForGrid(3, 3)).toEqual({ count: 4, orientation: "h" });
    expect(mawsLayoutTargetForGrid(3, 4)).toEqual({ count: 4, orientation: "h" });
    expect(mawsLayoutTargetForGrid(4, 4)).toEqual({ count: 4, orientation: "h" });
    for (let r = 1; r <= 4; r += 1) {
      for (let c = 1; c <= 4; c += 1) {
        expect(mawsLayoutTargetForGrid(r, c).count).toBeLessThanOrEqual(MAX_LAYOUT_PANES);
      }
    }
  });

  it("clamps out-of-canvas input to the 1–4 bounds", () => {
    // (0, 0) → 1×1; (9, 9) → 4×4 → the cap; 2.4 rounds to 2×2.
    expect(mawsLayoutTargetForGrid(0, 0)).toEqual({ count: 1, orientation: "h" });
    expect(mawsLayoutTargetForGrid(9, 9)).toEqual({ count: 4, orientation: "h" });
    expect(mawsLayoutTargetForGrid(2.4, 2.4)).toEqual({ count: 4, orientation: "h" });
  });

  it("every canvas rectangle lands on a registered MAWS layout", () => {
    registerBuiltinLayouts();
    for (const def of mawsWorkspaceLayouts()) registerLayout(def);
    for (let r = 1; r <= 4; r += 1) {
      for (let c = 1; c <= 4; c += 1) {
        const target = mawsLayoutTargetForGrid(r, c);
        const id = mawsWorkspaceLayoutId(target.count, target.orientation);
        expect(layoutDefinition(id)?.id).toBe(id);
      }
    }
  });
});

describe("mawsLayoutTargetForId (preset rows)", () => {
  it("parses registered MAWS ids", () => {
    expect(mawsLayoutTargetForId("1-h")).toEqual({ count: 1, orientation: "h" });
    expect(mawsLayoutTargetForId("2-v")).toEqual({ count: 2, orientation: "v" });
    expect(mawsLayoutTargetForId("4-h")).toEqual({ count: 4, orientation: "h" });
  });

  it("rejects Vela builtins, dynamic grid ids, and counts above the cap", () => {
    expect(mawsLayoutTargetForId("4")).toBeNull();
    expect(mawsLayoutTargetForId("2h")).toBeNull();
    expect(mawsLayoutTargetForId("g3x2")).toBeNull();
    expect(mawsLayoutTargetForId("5-h")).toBeNull();
    expect(mawsLayoutTargetForId("6-v")).toBeNull();
    expect(mawsLayoutTargetForId("12-h")).toBeNull();
    expect(mawsLayoutTargetForId("13-h")).toBeNull();
  });
});
