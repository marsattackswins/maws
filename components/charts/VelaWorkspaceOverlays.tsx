"use client";

/**
 * VelaWorkspaceOverlays.tsx — MAWS's per-cell React overlays on workspace cells.
 *
 * VelaWorkspace owns the grid DOM (one `.vela-cell` host per cell); the MAWS
 * overlays that render ABOVE a chart (TradeMarks, SessionBreaks, DrawingOverlay,
 * ReplaySeekOverlay) portal into each live cell's host, keyed
 * by the pane of the same id. Components are reused unchanged — they take the
 * same `pane` prop they got from ChartPane.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { VelaWorkspace } from "@/lib/charting/workspace";
import { useAppStore } from "@/lib/store";
import { getLastCrosshair } from "@/lib/chart-registry";
import type { ChartPaneState } from "@/types";
import { TradeMarks } from "@/components/charts/TradeMarks";
import { SessionBreaks } from "@/components/charts/SessionBreaks";
import { EventBreaks } from "@/components/charts/EventBreaks";
import { DrawingOverlay } from "@/components/drawings/DrawingOverlay";
import { ReplaySeekOverlay } from "@/components/replay/ReplaySeekOverlay";
import { CrosshairPlus } from "@/components/charts/CrosshairPlus";
import { Maximize2, Minimize2 } from "lucide-react";

/**
 * One React portal mounted on a live cell's host element. `children` unmount
 * cleanly with the cell (portal into a removed node drops with it).
 */
function CellPortal({
  ws,
  cellId,
  children,
}: {
  ws: VelaWorkspace;
  cellId: string;
  children: React.ReactNode;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const find = () => ws.cell(cellId)?.host ?? null;
    setHost(find());
    if (host) return;
    // The cell may not be built yet — retry on the next frame (cell construction
    // is synchronous inside the workspace, so this resolves on the first frame).
    let raf = 0;
    const tick = () => {
      const h = find();
      if (h) setHost(h);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ws, cellId, host]);

  if (!host) return null;
  return createPortal(children, host);
}

/** All overlays for one cell, rendered inside its host via a portal. */
function CellOverlays({ ws, pane }: { ws: VelaWorkspace; pane: ChartPaneState }) {
  const activePaneId = useAppStore((s) => s.activePaneId);
  const layoutCount = useAppStore((s) => s.layoutCount);
  const maximizedPaneId = useAppStore((s) => s.maximizedPaneId);
  const setMaximizedPane = useAppStore((s) => s.setMaximizedPane);
  const setActivePane = useAppStore((s) => s.setActivePane);
  const setContextMenu = useAppStore((s) => s.setContextMenu);
  const showPlusButton = useAppStore((s) => s.chartSettings.showPlusButton);
  const replaySeeking = useAppStore((s) => s.replaySeeking);
  const active = pane.id === activePaneId;
  const seekActive = replaySeeking && active;
  const maximized = maximizedPaneId === pane.id;
  const showMaximize = layoutCount > 1 || Boolean(maximizedPaneId);
  // ReplaySeekOverlay measures the chart host through this wrapper (the same
  // geometry as the cell's chart area — the wrapper spans the cell).
  const seekHostRef = useRef<HTMLDivElement | null>(null);

  return (
    <CellPortal ws={ws} cellId={pane.id}>
      <div
        data-maws-overlays
        // Inert to the pointer except where a child opts in — the chart below
        // keeps its own gestures; pointer events are scoped per overlay below.
        className="pointer-events-none absolute inset-0 z-20"
        onPointerDown={(e) => {
          // Activation lives on the portal wrapper (capture hit the workspace
          // above us); mirror ChartPane's behavior.
          setActivePane(pane.id);
          e.stopPropagation();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActivePane(pane.id);
          const cross = getLastCrosshair();
          const price = cross && cross.paneId === pane.id ? cross.price : 0;
          const time = cross && cross.paneId === pane.id ? cross.time : null;
          setContextMenu({ x: e.clientX, y: e.clientY, paneId: pane.id, price, time });
        }}
      >
        <div className="pointer-events-auto contents">
          {/* Replay-seek host: inert unless a replay seek is actually running on this
              pane — when live it must never sit between the pointer and the chart,
              or the chart loses crosshair/pan/zoom entirely. */}
          <div
            ref={seekHostRef}
            className={`absolute inset-0 ${seekActive ? "pointer-events-auto" : "pointer-events-none"}`}
          />
          <DrawingOverlay pane={pane} />
          {seekActive && <ReplaySeekOverlay pane={pane} hostRef={seekHostRef} />}
          <SessionBreaks pane={pane} />
          <EventBreaks pane={pane} />
          <TradeMarks pane={pane} />
          {showPlusButton && <CrosshairPlus pane={pane} />}
          {showMaximize && (
            <div
              data-maximize-zone
              className="absolute top-0 right-[62px] z-40 flex h-8 w-10 items-center justify-center"
            >
              <button
                type="button"
                title={maximized ? "Restore layout (Esc)" : "Maximize chart"}
                className="flex h-6 w-6 items-center justify-center rounded-[3px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePane(pane.id);
                  setMaximizedPane(maximized ? null : pane.id);
                }}
              >
                {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </CellPortal>
  );
}

/**
 * Renders every VISIBLE pane's overlays into its cell (hidden panes have no
 * live cell). Subscribes only to the pane list slice.
 */
export function VelaWorkspaceOverlays({ ws }: { ws: VelaWorkspace }) {
  const panes = useAppStore((s) => s.panes);
  const layoutCount = useAppStore((s) => s.layoutCount);
  // CELLS beyond layoutCount stay dormant — no portal, no overlays, no effects.
  const visible = useMemo(() => panes.slice(0, layoutCount), [panes, layoutCount]);
  return (
    <>
      {visible.map((pane) => (
        <CellOverlays key={pane.id} ws={ws} pane={pane} />
      ))}
    </>
  );
}
