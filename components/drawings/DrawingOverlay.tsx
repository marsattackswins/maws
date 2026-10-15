"use client";

/**
 * DrawingOverlay.tsx — Vela implementation.
 *
 * All drawing rendering/interaction is Vela's native renderer (`chart.drawings`).
 * This component only bridges state:
 *  - MAWS drawing slice → Vela drawings (add / update anchors+style / remove)
 *  - Vela drawing events → MAWS slice (create / edit / delete)
 *  - tool arming, magnet, stay-mode and visibility from the existing toolbar
 *
 * While a replay is active for the pane every drawing is hidden (replay must
 * not reveal future drawings), and restored on replay end.
 */

import { useEffect, useRef } from "react";
import { getChart } from "@/lib/chart-registry";
import { useAppStore } from "@/lib/store";
import type { DrawingStyle, DrawingTypeKey, SerializedDrawing } from "@/lib/charting";
import type { ChartPaneState, Drawing, DrawingLineStyle, DrawingTool } from "@/types";
// Registers the longposition/shortposition aliases TOOL_MAP arms below.
import "@/lib/vela-drawing-aliases";

// MAWS tool → Vela drawing type
const TOOL_MAP: Record<string, DrawingTypeKey | null> = {
  cursor: null,
  zoom: null,
  trend: "trendline",
  hray: "hray",
  channel: "parallelchannel",
  fib: "fibretracement",
  path: "polyline",
  dcurve: "curve",
  long: "longposition",
  short: "shortposition",
  rect: "box",
  circle: "ellipse",
  arrowUp: "arrowmarkup",
  arrowDown: "arrowmarkdown",
  text: "text",
};

// Vela drawing type → MAWS tool (for drawings created in-chart)
const REVERSE_TOOL: Partial<Record<DrawingTypeKey, DrawingTool>> = {
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

function toVelaStyle(d: Drawing): DrawingStyle {
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

function mawsLineStyle(style: DrawingStyle["lineStyle"]): DrawingLineStyle {
  if (style === "dashed") return "dashed";
  if (style === "dotted") return "dotted";
  return "solid";
}

function toAnchors(d: Drawing) {
  return d.points.map((p) => ({ time: p.time * 1000, price: p.price }));
}

export function DrawingOverlay({ pane }: { pane: ChartPaneState }) {
  const paneDrawings = useAppStore(
    (s) => s.panes.find((p) => p.id === pane.id)?.drawings ?? pane.drawings,
  );
  const drawingTool = useAppStore((s) => s.drawingTool);
  const magnet = useAppStore((s) => s.magnet);
  const stay = useAppStore((s) => s.stayInDrawingMode);
  const drawingsHidden = useAppStore((s) => s.drawingsHidden);
  const replay = useAppStore((s) => s.replay);
  const addDrawing = useAppStore((s) => s.addDrawing);
  const updateDrawing = useAppStore((s) => s.updateDrawing);
  const removeDrawing = useAppStore((s) => s.removeDrawing);

  const replaying = replay?.paneId === pane.id;

  /** MAWS drawing id → Vela drawing id */
  const idsRef = useRef<Map<string, string>>(new Map());
  /** Vela drawing ids being written by THIS component (suppress echo). */
  const syncingRef = useRef<Set<string>>(new Set());
  /** Live event handlers re-read current state through refs. */
  const drawingsRef = useRef(paneDrawings);
  drawingsRef.current = paneDrawings;
  const replayingRef = useRef(replaying);
  replayingRef.current = replaying;
  const hiddenRef = useRef(drawingsHidden);
  hiddenRef.current = drawingsHidden;

  // ── store → Vela ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer = 0;

    const apply = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(apply, 250);
        return;
      }
      tries = 0;
      const { vela } = handle;
      const ids = idsRef.current;
      const live = vela.drawings.all();
      const byId = new Map(live.map((d) => [d.id, d]));

      // Chart remounted → drop stale mappings (their drawings are gone).
      for (const [key, id] of [...ids]) {
        if (!byId.has(id)) ids.delete(key);
      }
      // Remove drawings whose slice entry disappeared.
      const wanted = new Set(paneDrawings.map((d) => d.id));
      for (const [key, id] of [...ids]) {
        if (wanted.has(key)) continue;
        ids.delete(key);
        try {
          vela.drawings.remove(id);
        } catch {
          /* already gone */
        }
      }

      for (const d of paneDrawings) {
        const type = TOOL_MAP[d.tool];
        if (!type || d.points.length === 0) continue;
        const existingId = ids.get(d.id);
        const existing = existingId ? byId.get(existingId) : undefined;

        if (existing) {
          syncingRef.current.add(existing.id);
          try {
            vela.drawings.update(existing.id, {
              anchors: toAnchors(d),
              style: toVelaStyle(d),
              ...(d.text != null
                ? { text: { value: d.text, size: "normal", hAlign: "left", vAlign: "top" } }
                : {}),
            });
            const shouldShow = !replayingRef.current && !hiddenRef.current;
            if (existing.visible !== shouldShow) vela.drawings.show(existing.id, shouldShow);
          } catch {
            /* ignore */
          }
          continue;
        }

        try {
          const created = vela.drawings.add(type, {
            paneId: "price",
            anchors: toAnchors(d),
            style: toVelaStyle(d),
            ...(d.text != null
              ? { text: { value: d.text, size: "normal", hAlign: "left", vAlign: "top" } }
              : {}),
          });
          if (created) {
            ids.set(d.id, created.id);
            if (replayingRef.current || hiddenRef.current) vela.drawings.show(created.id, false);
          }
        } catch {
          /* renderer not ready — retried on the next change */
        }
      }
      syncingRef.current.clear();
    };

    apply();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [pane.id, paneDrawings]);

  // ── visibility toggles (hide drawings / replay) ───────────────────────────
  useEffect(() => {
    const handle = getChart(pane.id);
    if (!handle) return;
    const visible = !drawingsHidden && !replaying;
    for (const id of idsRef.current.values()) {
      syncingRef.current.add(id);
      try {
        handle.vela.drawings.show(id, visible);
      } catch {
        /* ignore */
      }
    }
  }, [drawingsHidden, replaying, pane.id]);

  // ── tool / magnet / stay-mode arming ─────────────────────────────────────
  useEffect(() => {
    const handle = getChart(pane.id);
    if (!handle) return;
    const velaType = TOOL_MAP[drawingTool] ?? null;
    try {
      handle.vela.drawings.setTool(velaType);
    } catch {
      /* renderer not ready */
    }
  }, [drawingTool, pane.id]);

  useEffect(() => {
    const handle = getChart(pane.id);
    if (!handle) return;
    try {
      handle.vela.drawings.setSnapMode(magnet ? "strong" : "off");
    } catch {
      /* ignore */
    }
  }, [magnet, pane.id]);

  useEffect(() => {
    const handle = getChart(pane.id);
    if (!handle) return;
    try {
      handle.vela.drawings.setStayMode(stay);
    } catch {
      /* ignore */
    }
  }, [stay, pane.id]);

  // ── Vela → store: tool / magnet / stay echo ──────────────────────────────
  // Vela's native toolbar and renderer shortcuts also change tool/snap/stay;
  // mirror those into the store so the MAWS top toolbar stays in sync. The
  // store → Vela effects above are idempotent, so the echo cannot loop.
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer = 0;
    let offs: Array<() => void> = [];
    const attach = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(attach, 250);
        return;
      }
      const { vela } = handle;
      const st = () => useAppStore.getState();
      offs = [
        vela.on("drawing:tool", ({ type }) => {
          const mapped = type == null ? "cursor" : REVERSE_TOOL[type];
          if (mapped && st().drawingTool !== mapped) st().setDrawingTool(mapped);
          else if (type != null && !mapped && st().drawingTool !== "cursor") {
            st().setDrawingTool("cursor");
          }
        }),
        vela.on("drawing:snap", ({ mode }) => {
          const on = mode !== "off";
          if (st().magnet !== on) st().setMagnet(on);
        }),
        vela.on("drawing:stay", ({ on }) => {
          if (st().stayInDrawingMode !== on) st().setStayInDrawingMode(on);
        }),
      ];
    };
    attach();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      for (const off of offs) off();
    };
  }, [pane.id]);

  // ── Vela → store ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer = 0;
    let offs: Array<() => void> = [];

    const attach = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(attach, 250);
        return;
      }
      const { vela } = handle;
      const ids = idsRef.current;

      const docById = (id: string): SerializedDrawing | undefined =>
        vela.drawings.all().find((d) => d.id === id);

      const onCreated = ({ id }: { id: string }) => {
        if (syncingRef.current.has(id)) return;
        // A drawing placed with Vela's own toolbar → mirror into the MAWS slice.
        const doc = docById(id);
        if (!doc) return;
        const tool = REVERSE_TOOL[doc.type];
        if (!tool) return;
        ids.set(id, id);
        addDrawing(pane.id, {
          id,
          tool: tool as Drawing["tool"],
          points: doc.anchors.map((a) => ({ time: Math.round(a.time / 1000), price: a.price })),
          color: doc.style.lineColor,
          lineWidth: (doc.style.lineWidth ?? 1) as Drawing["lineWidth"],
          lineStyle: mawsLineStyle(doc.style.lineStyle),
          hidden: replayingRef.current,
        });
        if (replayingRef.current || hiddenRef.current) {
          try {
            vela.drawings.show(id, false);
          } catch {
            /* ignore */
          }
        }
      };

      const onEdited = ({ id }: { id: string }) => {
        if (syncingRef.current.has(id)) return;
        const doc = docById(id);
        if (!doc) return;
        const drawingId = findStoreId(ids, id);
        if (!drawingId) return;
        updateDrawing(pane.id, drawingId, {
          points: doc.anchors.map((a) => ({ time: Math.round(a.time / 1000), price: a.price })),
          color: doc.style.lineColor,
          lineWidth: (doc.style.lineWidth ?? 1) as Drawing["lineWidth"],
          lineStyle: mawsLineStyle(doc.style.lineStyle),
        });
      };

      const onRemoved = ({ id }: { id: string }) => {
        const drawingId = findStoreId(ids, id);
        if (!drawingId) return;
        ids.delete(drawingId);
        if (syncingRef.current.has(id)) return;
        removeDrawing(pane.id, drawingId);
      };

      offs = [
        vela.on("drawing:created", onCreated),
        vela.on("drawing:edited", onEdited),
        vela.on("drawing:removed", onRemoved),
      ];
    };

    attach();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      for (const off of offs) off();
    };
  }, [pane.id, addDrawing, updateDrawing, removeDrawing]);

  // Vela owns rendering — no DOM output.
  return null;
}

/** Reverse lookup: Vela drawing id → MAWS drawing id. */
function findStoreId(ids: Map<string, string>, velaId: string): string | null {
  for (const [storeId, id] of ids) {
    if (id === velaId) return storeId;
  }
  return null;
}
