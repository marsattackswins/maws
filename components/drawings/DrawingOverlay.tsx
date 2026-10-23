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
import type { SerializedDrawing } from "@/lib/charting";
import type { ChartPaneState, Drawing } from "@/types";
import {
  DRAWING_TOOL_TO_VELA as TOOL_MAP,
  drawingToolFromVela,
  drawingMapping,
  mawsLineStyle,
  storeDrawingFromDoc,
  storeIdsFor,
  toStorePoints,
  toVelaAnchors as toAnchors,
  toVelaStyle,
} from "@/lib/vela-drawings";
// Registers the longposition/shortposition aliases TOOL_MAP arms below.
import "@/lib/vela-drawing-aliases";

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

  /** MAWS drawing id → Vela drawing id. Shared with the settle step in
   *  `lib/vela-drawings.ts` so both directions agree on what mirrors what. */
  const idsRef = useRef<Map<string, string>>(drawingMapping(pane.id));
  /** Vela drawing ids being written by THIS component (suppress echo). */
  const syncingRef = useRef<Set<string>>(new Set());
  /** True while the store→Vela write batch below runs: a create emits
   *  `drawing:created` SYNCHRONOUSLY, before the new id can be marked in
   *  `syncingRef`, and mirroring it back filed a second store drawing under
   *  Vela's id — the leftover that resurrected a deleted drawing. */
  const applyingRef = useRef(false);
  // Re-point the mapping when the pane changes. Declared FIRST so the effects
  // below (same commit, declaration order) already see the new pane's map.
  useEffect(() => {
    idsRef.current = drawingMapping(pane.id);
  }, [pane.id]);
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
      // Remove drawings whose slice entry disappeared. Vela's own removal event is
      // what usually does this; this is the store-first path (clear, object tree).
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

      applyingRef.current = true;
      try {
        for (const d of paneDrawings) {
          const type = TOOL_MAP[d.tool];
          if (!type || d.points.length === 0) continue;
          const existingId = ids.get(d.id);
          // A drawing this pane already holds under the STORE id (a document
          // restored before this instance mounted) is adopted, never duplicated:
          // an adopted-but-unmapped twin kept painting after a delete and came
          // back from the cell document on the next refresh.
          const adopted = existingId == null && byId.has(d.id) ? d.id : null;
          if (adopted != null) ids.set(d.id, adopted);
          const mapped = existingId ?? adopted ?? undefined;
          const existing = mapped != null ? byId.get(mapped) : undefined;

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
      } finally {
        applyingRef.current = false;
        syncingRef.current.clear();
      }
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
          const mapped = drawingToolFromVela(type);
          if (st().drawingTool !== mapped) st().setDrawingTool(mapped);
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
        // Our own write batch: the store already carries this drawing, and the
        // create event fires before its new Vela id could be marked above.
        if (applyingRef.current || syncingRef.current.has(id)) return;
        // A drawing placed with Vela's own toolbar → mirror into the MAWS slice.
        const doc = docById(id);
        if (!doc) return;
        const mirrored = storeDrawingFromDoc(doc);
        if (!mirrored) return;
        ids.set(id, id);
        const stored = useAppStore.getState().panes.find((p) => p.id === pane.id)?.drawings;
        if (stored?.some((d) => d.id === id)) {
          updateDrawing(pane.id, id, { ...mirrored, id });
        } else {
          addDrawing(pane.id, { ...mirrored, id, hidden: replayingRef.current });
        }
        if (replayingRef.current || hiddenRef.current) {
          try {
            vela.drawings.show(id, false);
          } catch {
            /* ignore */
          }
        }
      };

      const onEdited = ({ id }: { id: string }) => {
        if (applyingRef.current || syncingRef.current.has(id)) return;
        const doc = docById(id);
        if (!doc) return;
        const drawingId = findStoreId(ids, id);
        if (!drawingId) return;
        updateDrawing(pane.id, drawingId, {
          points: toStorePoints(doc),
          color: doc.style.lineColor,
          lineWidth: (doc.style.lineWidth ?? 1) as Drawing["lineWidth"],
          lineStyle: mawsLineStyle(doc.style.lineStyle),
        });
      };

      const onRemoved = ({ id }: { id: string }) => {
        // EVERY store entry that mirrored this drawing goes — a leftover entry
        // re-created the drawing (and the delete looked undone) on the next mount.
        const drawingIds = storeIdsFor(pane.id, id);
        for (const drawingId of drawingIds) ids.delete(drawingId);
        if (syncingRef.current.has(id) || applyingRef.current) return;
        for (const drawingId of drawingIds) removeDrawing(pane.id, drawingId);
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
