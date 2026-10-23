/**
 * MAWS layout presets as Vela WORKSPACE layouts — the `registerLayout` bridge.
 *
 * MAWS's grid engine (lib/layouts.ts) renders 12 count-based templates, three of
 * them asymmetric ("featured" left cell spanning full height: 3, 5, 7, 11).
 * VelaWorkspace consumes its own registry (`registerLayout`), so this module
 * translates each template 1:1 — same track weights, same geometry — and
 * defines the id mapping the shell uses to switch layouts.
 *
 * Ids follow MAWS's historical track key (`${count}-${orientation}` like "4-h");
 * orientation-flippable counts (2 gets a "2-v" variant) mirror TopBar's
 * flip-orientation affordance. Other counts map to the `-h` id, which is
 * geometrically identical to their orientation-specific rendering.
 *
 * PANE CAP: only counts 1..MAX_LAYOUT_PANES are registered, so the picker can
 * never offer (or restore) a layout above the cap.
 */

import { layoutTemplate, MAX_LAYOUT_PANES } from "@/lib/layouts";
import type { LayoutCount } from "@/types";
import type { LayoutDefinition } from "@/lib/charting/workspace";

/** Layout ids are `${count}-${orientation}` — same shape as the store's track key. */
export function mawsWorkspaceLayoutId(count: LayoutCount, orientation: "h" | "v"): string {
  // Counts without an orientation branch render identically — pin them to "-h".
  return orientation === "v" && count === 2 ? `${count}-v` : `${count}-h`;
}

/**
 * The layout's named grid areas + per-cell area bindings.
 *
 * MAWS templates encode cells as CSS `grid-area` line specs ("1 / 1 / 3 / 2").
 * Vela's workspace `areas` uses NAMED areas, one name per column. This expands
 * each template entry to its occupied track rectangle and names it `c<N>` in
 * declaration order, then returns the row strings plus each cell's area name.
 */
export function areasForTemplate(
  template: ReturnType<typeof layoutTemplate>,
): { rows?: string[]; cellAreas?: string[] } {
  const rowCount = template.rowFr.length;
  const colCount = template.colFr.length;
  // A template is asymmetric only when an entry spans more than one track (its
  // grid-area line has the explicit end forms).
  const spans = template.areas.some((a) => a.split("/").length > 2);
  const grid: string[][] = Array.from({ length: rowCount }, () => Array(colCount).fill("."));
  const cellAreas = template.areas.map((area, i) => {
    const line = area.split("/").map((s) => parseInt(s.trim(), 10));
    const r0 = line[0] - 1;
    const c0 = line[1] - 1;
    const r1 = (line[2] ?? line[0]) - 1;
    const c1 = (line[3] ?? line[1]) - 1;
    const name = `c${i + 1}`;
    for (let r = r0; r <= Math.min(r1, rowCount - 1); r++) {
      for (let c = c0; c <= Math.min(c1, colCount - 1); c++) grid[r][c] = name;
    }
    return name;
  });
  return {
    rows: spans ? grid.map((row) => row.join(" ")) : undefined,
    cellAreas: spans ? cellAreas : undefined,
  };
}

/**
 * The full definition for one MAWS layout (pure — no registry side effects, so
 * tests can assert geometry directly).
 */
export function buildMawsWorkspaceLayout(count: LayoutCount, orientation: "h" | "v"): LayoutDefinition {
  const t = layoutTemplate(count, orientation);
  const { rows, cellAreas } = areasForTemplate(t);
  return {
    id: mawsWorkspaceLayoutId(count, orientation),
    label: `${count} chart${count === 1 ? "" : "s"}${rows ? " (featured left)" : orientation === "v" ? " (stacked)" : ""}`,
    cols: t.colFr,
    rows: t.rowFr,
    ...(rows ? { areas: rows } : {}),
    cells: Array.from({ length: count }, (_, i) => ({
      id: `c${i + 1}`,
      ...(cellAreas?.[i] ? { area: cellAreas[i] } : {}),
    })),
  };
}

/** Which (count, orientation) pairs to register: every count's "-h" up to the pane
 *  cap, plus 2v. Nothing above MAX_LAYOUT_PANES exists to pick. */
function allVariants(): Array<[LayoutCount, "h" | "v"]> {
  const out: Array<[LayoutCount, "h" | "v"]> = [];
  for (let i = 1; i <= MAX_LAYOUT_PANES; i++) {
    const count = i as LayoutCount;
    out.push([count, "h"]);
    if (count === 2) out.push([count, "v"]);
  }
  return out;
}

/**
 * Build the registered definitions (1-h, 2-h, 2-v, 3-h, 4-h) — pure, so callers can
 * test before mounting.
 */
export function mawsWorkspaceLayouts(): LayoutDefinition[] {
  return allVariants().map(([count, orientation]) => buildMawsWorkspaceLayout(count, orientation));
}

// ── Vela grid picker → MAWS layout target ───────────────────────────────────
//
// Vela's layout picker composes UNIFORM rows×cols grids on its 4×4 canvas; MAWS's
// store holds (layoutCount, orientation) over its templates. The two agree on cell
// COUNT but not always on geometry (e.g. MAWS renders 3 as its featured-left template),
// so canvas picks translate to the closest registered shape rather than raw grids —
// every pick stays representable in the store (no layout the pane list cannot follow).
// Anything above MAX_LAYOUT_PANES cells collapses to the cap instead of growing the
// workspace past it.

/** A store-representable layout: MAWS's count + orientation. */
export type MawsLayoutTarget = { count: LayoutCount; orientation: "h" | "v" };

/** Canvas rectangles with an EXACT MAWS template match (rows × cols), within the cap. */
const GRID_TARGETS: Record<string, MawsLayoutTarget> = {
  "1x1": { count: 1, orientation: "h" },
  "1x2": { count: 2, orientation: "h" },
  "2x1": { count: 2, orientation: "v" },
  "2x2": { count: 4, orientation: "h" },
};

/** Every registered count, densest first — the fallback ladder for unmapped picks. */
const FALLBACK_COUNTS: LayoutCount[] = Array.from(
  { length: MAX_LAYOUT_PANES },
  (_, i) => (MAX_LAYOUT_PANES - i) as LayoutCount,
);

/**
 * Map a Vela picker canvas rectangle (`rows × cols`, 1–4 each) onto a MAWS layout
 * target: exact when a template matches the geometry, else the densest registered
 * template that fits the chosen cell count — never more than MAX_LAYOUT_PANES.
 */
export function mawsLayoutTargetForGrid(rows: number, cols: number): MawsLayoutTarget {
  const r = Math.max(1, Math.min(4, Math.round(rows) || 1));
  const c = Math.max(1, Math.min(4, Math.round(cols) || 1));
  const exact = GRID_TARGETS[`${r}x${c}`];
  if (exact) return exact;
  const cells = r * c;
  const count = FALLBACK_COUNTS.find((n) => n <= cells) ?? 1;
  return { count, orientation: "h" };
}

/** A registered layout id (`'5-h'`, `'6-v'`) → its store target; null for foreign ids. */
export function mawsLayoutTargetForId(id: string): MawsLayoutTarget | null {
  const match = /^(\d{1,2})-(h|v)$/.exec(id);
  if (!match) return null;
  const count = Number(match[1]);
  if (count < 1 || count > MAX_LAYOUT_PANES) return null;
  return { count: count as LayoutCount, orientation: match[2] as "h" | "v" };
}
