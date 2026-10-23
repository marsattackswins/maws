/**
 * Vela's LAYOUT PICKER, mounted on a MAWS shell trigger.
 *
 * The panel itself is Vela's (`lib/charting/widget/layout-picker`), but MAWS trims its
 * canvas to a 2×2 ZONE grid: exactly four squares — 1 chart, 2 side by side, 2 stacked,
 * 4 charts — and no preset rows. Nothing above four panes is offered.
 *
 *  - layout picks route through the STORE (`applyLayout`) so `layoutCount`/`orientation`
 *    stay the single source of truth and the workspace bridge applies one `setLayout`.
 *    Canvas rectangles map onto the closest registered MAWS template.
 *  - the SYNC switches read/write the store's `layoutSync` (persisted), with MAWS's
 *    `time` + `dateRange` exposed as one Vela `viewport` link — they move together.
 *
 * The picker's `host` is the LIVE workspace root: it owns the theme tokens the panel
 * styles against and is the positioning box the layer portals into.
 */

import { LayoutPicker } from "@/lib/charting";
import { MAX_LAYOUT_PANES } from "@/lib/layouts";
import { layoutShape, type VelaWorkspace } from "@/lib/charting/workspace";
import {
  mawsLayoutTargetForGrid,
  mawsLayoutTargetForId,
  type MawsLayoutTarget,
} from "@/lib/vela-workspace-layouts";
import type { LayoutSync } from "@/types";

export type VelaLayoutPickerOptions = {
  /** The live workspace — presets/shape read its layout; foreign presets switch it. */
  ws: VelaWorkspace;
  /** Shell element that toggles the panel. */
  trigger: HTMLElement;
  /** Apply a store-representable layout target (one atomic store update). */
  applyLayout: (target: MawsLayoutTarget) => void;
  getLayoutSync: () => LayoutSync;
  patchLayoutSync: (patch: Partial<LayoutSync>) => void;
  onOpenChange?: (open: boolean) => void;
};

/** The picker's SYNC rows in MAWS's vocabulary. */
export function velaLayoutSyncRows(
  layoutSync: LayoutSync,
): Array<{ id: string; label: string; checked: boolean }> {
  return [
    { id: "symbol", label: "Symbol", checked: layoutSync.symbol },
    { id: "interval", label: "Interval", checked: layoutSync.interval },
    { id: "crosshair", label: "Crosshair", checked: layoutSync.crosshair },
    // MAWS's two time-axis links are one Vela `viewport` link.
    { id: "viewport", label: "Time range", checked: layoutSync.time || layoutSync.dateRange },
  ];
}

/** The store patch for one SYNC row toggle (`{}` for unknown ids). */
export function velaLayoutSyncToggle(layoutSync: LayoutSync, id: string): Partial<LayoutSync> {
  if (id === "viewport") {
    const on = !(layoutSync.time || layoutSync.dateRange);
    return { time: on, dateRange: on };
  }
  if (id === "symbol" || id === "interval" || id === "crosshair") {
    return { [id]: !layoutSync[id] };
  }
  return {};
}

/** Square canvas whose area is the pane budget: 4 panes → 2×2 zones. */
const ZONE_GRID = Math.ceil(Math.sqrt(MAX_LAYOUT_PANES));

/** Mount the picker on `trigger`; returns the disposer that tears it down. */
export function mountVelaLayoutPicker(opts: VelaLayoutPickerOptions): () => void {
  const { ws, trigger } = opts;
  const picker = new LayoutPicker({
    trigger,
    host: ws.root,
    shape: () => layoutShape(ws.layout),
    // Four zones only: a 2×2 canvas and no preset rows, so there is no fifth
    // (or ninth, sixteenth) option to pick.
    gridSize: ZONE_GRID,
    maxCells: MAX_LAYOUT_PANES,
    presets: () => [],
    onSelectGrid: (rows, cols) => opts.applyLayout(mawsLayoutTargetForGrid(rows, cols)),
    onSelectPreset: (id) => {
      const target = mawsLayoutTargetForId(id);
      // Foreign registered layouts (plugin presets) bypass the store vocabulary.
      if (target) opts.applyLayout(target);
      else ws.setLayout(id);
    },
    syncs: () => velaLayoutSyncRows(opts.getLayoutSync()),
    onToggleSync: (id) => opts.patchLayoutSync(velaLayoutSyncToggle(opts.getLayoutSync(), id)),
    onOpenChange: opts.onOpenChange,
  });
  return () => picker.destroy();
}
