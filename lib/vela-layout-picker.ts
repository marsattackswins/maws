/**
 * Vela's LAYOUT PICKER, mounted on a MAWS shell trigger.
 *
 * The panel itself is Vela's (`lib/charting/widget/layout-picker`) — the 4×4 grid
 * canvas with hover preview, the registered presets the canvas cannot express, and the
 * SYNC switches. MAWS supplies the trigger and the live state:
 *
 *  - layout picks route through the STORE (`applyLayout`) so `layoutCount`/`orientation`
 *    stay the single source of truth and the workspace bridge applies one `setLayout`.
 *    Canvas rectangles map onto the closest registered MAWS template (see
 *    `mawsLayoutTargetForGrid`); catalog presets map by id.
 *  - the SYNC switches read/write the store's `layoutSync` (persisted), with MAWS's
 *    `time` + `dateRange` exposed as one Vela `viewport` link — they move together.
 *
 * The picker's `host` is the LIVE workspace root: it owns the theme tokens the panel
 * styles against and is the positioning box the layer portals into.
 */

import { LayoutPicker } from "@/lib/charting";
import { layouts, layoutShape, type VelaWorkspace } from "@/lib/charting/workspace";
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

/** Mount the picker on `trigger`; returns the disposer that tears it down. */
export function mountVelaLayoutPicker(opts: VelaLayoutPickerOptions): () => void {
  const { ws, trigger } = opts;
  const picker = new LayoutPicker({
    trigger,
    host: ws.root,
    shape: () => layoutShape(ws.layout),
    presets: () =>
      layouts()
        .filter((l) => layoutShape(l) === null)
        .map((l) => ({ id: l.id, label: l.label, checked: l.id === ws.layout.id })),
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
