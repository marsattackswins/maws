/**
 * vela-drawings.ts — the ONE bridge between MAWS's `panes[].drawings` slice and
 * Vela's per-cell drawings document.
 *
 * Why this file exists (the resurrecting-drawing bug):
 *  - A drawing used to live in TWO persisted places: the zustand slice AND the
 *    Vela cell document (`panes[].velaState.drawings`). Both were restored on
 *    load, so every drawing came back twice: the document's copy, which the
 *    reconciler never mapped, plus the copy it re-created from the store.
 *  - Deleting removed the MAPPED copy only. The unmapped one kept painting and
 *    the store's leftover copy re-created the drawing, so a refresh brought it
 *    back — sometimes twice.
 *  - `drawings.add()` on a store-originated drawing emits `drawing:created`
 *    synchronously, and the mirror filed that as a SECOND store drawing under
 *    Vela's own id. That echo is what made a delete leave a survivor behind.
 *
 * The rules that keep it honest:
 *  1. The zustand slice owns drawings (see `withoutDrawingsDoc`, applied by the
 *     workspace host on persist AND rehydrate). Vela's document is working state.
 *  2. Vela's live set is the truth for which drawings EXIST (`syncPaneDrawingsFromVela`),
 *     so an undo that silently drops a drawing still leaves the store correct.
 *  3. Store ids are preserved wherever a live drawing can be paired with its
 *     entry (by mapping, then by geometry) — churning ids would tear down and
 *     re-create drawings on every reconcile.
 */

import { getChart } from "@/lib/chart-registry";
import { useAppStore } from "@/lib/store";
import type { ChartPoint, Drawing, DrawingLineStyle, DrawingTool } from "@/types";
import type { DrawingStyle, DrawingTypeKey, SerializedDrawing } from "@/lib/charting";

/** MAWS drawing tool → Vela drawing type (`null` = Vela has no counterpart). */
export const DRAWING_TOOL_TO_VELA: Record<string, DrawingTypeKey | null> = {
  cursor: null,
  zoom: null,
  trend: "trendline",
  hray: "hray",
  channel: "parallelchannel",
  fib: "fibretracement",
  path: "polyline",
  dcurve: "curve",
  position: "position",
  long: "longposition",
  short: "shortposition",
  rect: "box",
  circle: "ellipse",
  arrowUp: "arrowmarkup",
  arrowDown: "arrowmarkdown",
  text: "text",
};

/** Vela drawing type → MAWS tool (for drawings born in the chart itself). */
export const VELA_DRAWING_TOOL: Partial<Record<DrawingTypeKey, DrawingTool>> = {
  trendline: "trend",
  hray: "hray",
  parallelchannel: "channel",
  fibretracement: "fib",
  polyline: "path",
  curve: "dcurve",
  longposition: "long",
  shortposition: "short",
  // Legacy drawings persisted before the long/short aliases existed.
  position: "long",
  box: "rect",
  ellipse: "circle",
  arrowmarkup: "arrowUp",
  arrowmarkdown: "arrowDown",
  text: "text",
};

/** Vela's generic position tool needs its own armed state instead of becoming the long alias. */
export function drawingToolFromVela(type: DrawingTypeKey | null): DrawingTool {
  if (type == null) return "cursor";
  if (type === "position") return "position";
  return VELA_DRAWING_TOOL[type] ?? "cursor";
}

export function toVelaStyle(d: Drawing): DrawingStyle {
  const lineStyle: DrawingStyle["lineStyle"] =
    d.lineStyle === "dashed" ? "dashed" : d.lineStyle === "dotted" ? "dotted" : "solid";
  return {
    lineColor: d.color,
    lineWidth: d.lineWidth ?? 1,
    lineStyle,
    // Rect/circle fill migration (MAWS fillVisible defaults true for rect).
    ...(d.fillColor && (d.fillVisible ?? d.tool === "rect")
      ? { fillColor: d.fillColor }
      : {}),
  };
}

export function mawsLineStyle(style: DrawingStyle["lineStyle"]): DrawingLineStyle {
  if (style === "dashed") return "dashed";
  if (style === "dotted") return "dotted";
  return "solid";
}

/** MAWS anchors → Vela anchors (Vela times are milliseconds). */
export function toVelaAnchors(d: Drawing): Array<{ time: number; price: number }> {
  return d.points.map((p) => ({ time: p.time * 1000, price: p.price }));
}

/** Vela anchors → MAWS points (MAWS times are whole seconds). */
export function toStorePoints(doc: SerializedDrawing): ChartPoint[] {
  return doc.anchors.map((a) => ({ time: Math.round(a.time / 1000), price: a.price }));
}

/** The MAWS drawing a Vela document entry stands for, or null without a counterpart. */
export function storeDrawingFromDoc(doc: SerializedDrawing): Drawing | null {
  const tool = VELA_DRAWING_TOOL[doc.type] as Drawing["tool"] | undefined;
  if (!tool || doc.anchors.length === 0) return null;
  return {
    id: doc.id,
    tool,
    points: toStorePoints(doc),
    color: doc.style.lineColor,
    lineWidth: (doc.style.lineWidth ?? 1) as Drawing["lineWidth"],
    lineStyle: mawsLineStyle(doc.style.lineStyle),
    ...(doc.text?.value ? { text: doc.text.value } : {}),
  };
}

/** Rewrite a store entry's geometry/style from the document entry it mirrors.
 *  Returns the SAME object when nothing moved — callers use identity to detect a
 *  no-op reconcile. MAWS-only fields (hidden, fill) are never touched, and a text
 *  the document does not carry is left as the store had it. */
export function applyDocToStoreDrawing(d: Drawing, doc: SerializedDrawing): Drawing {
  const points = toStorePoints(doc);
  const color = doc.style.lineColor;
  const lineWidth = (doc.style.lineWidth ?? 1) as Drawing["lineWidth"];
  const lineStyle = mawsLineStyle(doc.style.lineStyle);
  const text = doc.text?.value;
  const textMoved = text != null && (d.text ?? "") !== text;
  if (
    samePoints(d.points, points) &&
    d.color === color &&
    (d.lineWidth ?? 1) === lineWidth &&
    (d.lineStyle ?? "solid") === lineStyle &&
    !textMoved
  ) {
    return d;
  }
  return {
    ...d,
    points,
    color,
    lineWidth,
    lineStyle,
    ...(textMoved ? { text } : {}),
  };
}

function samePoints(a: readonly ChartPoint[], b: readonly ChartPoint[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    if (x.time !== y.time || !samePrice(x.price, y.price)) return false;
  }
  return true;
}

/** Prices arrive by float arithmetic on both sides — compare with a tolerance
 *  that stays far below a tick on real instruments. */
function samePrice(a: number, b: number): boolean {
  return Math.abs(a - b) <= Math.max(1e-6, Math.abs(a) * 1e-9);
}

/** Does the store entry describe the same drawing as this Vela document entry?
 *  A document without text says nothing about the store entry's text. */
export function drawingMatchesDoc(d: Drawing, doc: SerializedDrawing): boolean {
  const type = DRAWING_TOOL_TO_VELA[d.tool];
  if (!type || type !== doc.type) return false;
  if (d.points.length === 0 || d.points.length !== doc.anchors.length) return false;
  if (d.color !== doc.style.lineColor) return false;
  if ((d.lineWidth ?? 1) !== (doc.style.lineWidth ?? 1)) return false;
  if ((d.lineStyle ?? "solid") !== mawsLineStyle(doc.style.lineStyle)) return false;
  if (doc.text?.value != null && (d.text ?? "") !== doc.text.value) return false;
  return samePoints(d.points, toStorePoints(doc));
}

/** Two store entries that describe the very same drawing (the id differs).
 *
 * Width / line style / text are deliberately NOT compared: the duplicate this
 * heals was written from Vela's document, which had already applied its own
 * last-used style, so the pair can disagree on exactly those fields while being
 * one drawing at one place. Anchors and color identify it. */
export function drawingMatchesStore(a: Drawing, b: Drawing): boolean {
  return a.tool === b.tool && a.color === b.color && samePoints(a.points, b.points);
}

/**
 * Collapse store entries that describe ONE drawing into the first of them.
 *
 * Healing pass for workspaces written by the echo bug: every store-originated
 * drawing was filed a second time under Vela's id, so the slice held two entries
 * per drawing and a delete could only ever clear one of them.
 */
export function collapseDrawingDuplicates(drawings: readonly Drawing[]): Drawing[] | null {
  const kept: Drawing[] = [];
  for (const d of drawings) {
    if (kept.some((k) => drawingMatchesStore(k, d))) continue;
    kept.push(d);
  }
  return kept.length === drawings.length ? null : kept;
}

/**
 * Strip the drawings document from a persisted Vela cell state.
 *
 * The zustand slice owns drawings; a second copy inside the cell document is
 * restored on every mount and — being unmapped — survives a delete, which is
 * what made deleted drawings come back after a refresh.
 */
export function withoutDrawingsDoc<T extends Record<string, unknown>>(
  velaState: T | undefined,
): T | undefined {
  if (!velaState || !("drawings" in velaState)) return velaState;
  const rest: Record<string, unknown> = { ...velaState };
  delete rest.drawings;
  return rest as T;
}

// ── Live mapping: MAWS drawing id → Vela drawing id, one map per live pane ────

const mappings = new Map<string, Map<string, string>>();

/** The mapping for a pane (created on first use; lives as long as the cell). */
export function drawingMapping(paneId: string): Map<string, string> {
  let map = mappings.get(paneId);
  if (!map) {
    map = new Map();
    mappings.set(paneId, map);
  }
  return map;
}

/** Drop a pane's mapping (cell destroyed / overlay unmounted). */
export function clearDrawingMapping(paneId: string): void {
  mappings.delete(paneId);
}

/** Every store id whose live Vela counterpart is `velaId`. */
export function storeIdsFor(paneId: string, velaId: string): string[] {
  const ids = drawingMapping(paneId);
  const found: string[] = [];
  for (const [storeId, mapped] of ids) {
    if (mapped === velaId) found.push(storeId);
  }
  return found;
}

/**
 * Settle the store onto Vela's LIVE drawings — the truth for what exists.
 *
 * Needed because a drawing can leave Vela without any event (the unified undo
 * timeline restores a snapshot inside the controller), so event mirrors alone
 * cannot keep the store honest: an undone drawing stayed in the slice and came
 * back on the next mount.
 *
 * Store ids are preserved for entries that pair with a live drawing (mapping
 * first, geometry second). Entries with no mapping and no live twin are LEFT
 * ALONE: they are creations the reconciler has not written yet, not deletions.
 */
export function syncPaneDrawingsFromVela(paneId: string): void {
  const handle = getChart(paneId);
  if (!handle) return;
  const live = handle.vela.drawings.all() as unknown as SerializedDrawing[];
  const st = useAppStore.getState();
  const pane = st.panes.find((p) => p.id === paneId);
  if (!pane) return;
  const ids = drawingMapping(paneId);
  const taken = new Set<number>();
  const next: Drawing[] = [];

  for (const doc of live) {
    const viaMapping = storeIdsFor(paneId, doc.id).find((storeId) =>
      pane.drawings.some((d, i) => !taken.has(i) && d.id === storeId),
    );
    let idx = viaMapping
      ? pane.drawings.findIndex((d, i) => !taken.has(i) && d.id === viaMapping)
      : -1;
    if (idx < 0) idx = pane.drawings.findIndex((d, i) => !taken.has(i) && drawingMatchesDoc(d, doc));
    if (idx >= 0) {
      taken.add(idx);
      const d = pane.drawings[idx]!;
      next.push(applyDocToStoreDrawing(d, doc));
      ids.set(d.id, doc.id);
      continue;
    }
    const created = storeDrawingFromDoc(doc);
    if (created) {
      next.push(created);
      ids.set(created.id, doc.id);
    }
  }

  // Keep entries Vela has never seen (a creation still in flight).
  pane.drawings.forEach((d, i) => {
    if (!taken.has(i) && !ids.has(d.id)) next.push(d);
  });

  // Nothing moved: leave the slice (and every subscriber) untouched.
  if (next.length === pane.drawings.length && next.every((d, i) => d === pane.drawings[i])) return;
  st.setPaneDrawings(paneId, next);
}
