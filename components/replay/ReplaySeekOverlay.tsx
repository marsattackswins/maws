"use client";

/**
 * ReplaySeekOverlay.tsx
 *
 * Renders over a chart pane while replay is in "seek" mode (replaySeeking=true).
 * Shows:
 *   - A blue vertical line tracking the mouse X
 *   - A semi-transparent dark overlay covering everything to the RIGHT of the line
 *     (representing bars that will be hidden when replay starts)
 *   - A date label above the line showing the hovered bar time
 *   - A tooltip at the bottom: "Bar replay: click the bar to start from (Esc cancels)"
 *
 * On click  → converts X position to epoch-ms, calls startReplay, exits seek mode.
 * On Esc    → exits seek mode (handled by AppShell, but also caught here).
 * On unmount→ cleans up.
 */

import { getChart, getWorkspace } from "@/lib/chart-registry";
import { seekReplayFromBar } from "@/lib/replay-bar-actions";
import { useAppStore } from "@/lib/store";
import { timeframeSeconds } from "@/lib/timeframes";
import type { ChartPaneState } from "@/types";
import { useEffect, useRef, useState } from "react";

type Props = {
  pane: ChartPaneState;
  hostRef: React.RefObject<HTMLDivElement | null>;
};

/** Linearly interpolate a pixel X within a bounding rect to an epoch-ms time
 *  using the chart's current visible range. Returns null if data is unavailable. */
function xToTime(
  clientX: number,
  rect: DOMRect,
  visibleFrom: number,
  visibleTo: number,
): number {
  const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return Math.round(visibleFrom + fraction * (visibleTo - visibleFrom));
}

/** Format epoch-ms as a short date+time label (e.g. "Oct 8, 05:15"). */
function formatBarTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });
}

export function ReplaySeekOverlay({ pane, hostRef }: Props) {
  const replaySeeking = useAppStore((s) => s.replaySeeking);
  const setReplaySeeking = useAppStore((s) => s.setReplaySeeking);
  const startReplay = useAppStore((s) => s.startReplay);

  // mouseX as fraction [0,1] across the container width, or null before first move.
  const [lineX, setLineX] = useState<number | null>(null);
  // Hovered bar time label.
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Esc cancels from within the overlay too.
  useEffect(() => {
    if (!replaySeeking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReplaySeeking(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [replaySeeking, setReplaySeeking]);

  if (!replaySeeking) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setLineX(fraction);

    // Compute hovered time for the label.
    const chart = getChart(pane.id)?.vela;
    const range = chart?.getVisibleRange();
    if (range) {
      const t = xToTime(e.clientX, rect, range.from, range.to);
      setHoverTime(formatBarTime(t));
    }
  };

  const handleMouseLeave = () => {
    setLineX(null);
    setHoverTime(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const chart = getChart(pane.id)?.vela;
    const range = chart?.getVisibleRange();
    const bounds = chart?.replay.bounds;
    if (!range || !bounds) {
      // No data yet — cancel.
      setReplaySeeking(false);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    let clickTime = xToTime(e.clientX, rect, range.from, range.to);

    // Clamp to loaded history bounds.
    clickTime = Math.max(bounds.first, Math.min(bounds.last, clickTime));

    // Compute span for the store (bar count from first to clickTime).
    const tfSec = timeframeSeconds(pane.timeframe);
    const tfMs = tfSec * 1000;
    const span = tfMs > 0
      ? Math.max(2, Math.ceil((clickTime - bounds.first) / tfMs))
      : 2;

    const controller = getWorkspace()?.replay;
    if (!controller) {
      setReplaySeeking(false);
      console.error("[maws] Could not start chart replay because the chart workspace is unavailable.");
      return;
    }

    void seekReplayFromBar(
      async (from) => {
        await controller.start({ from, cell: pane.id });
        if (!controller.state.active) {
          throw new Error("Replay could not start at the requested time.");
        }
      },
      clickTime,
      () => startReplay(pane.id, 0, span, clickTime),
    ).catch((error: unknown) => {
      console.error("[maws] Could not start chart replay.", error);
      useAppStore.getState().stopReplay();
    });
    // startReplay sets replaySeeking=false before the workspace applies the cutoff.
  };

  // lineX is a 0-1 fraction; convert to percent for CSS.
  const linePct = lineX != null ? `${(lineX * 100).toFixed(2)}%` : "50%";
  const showLine = lineX != null;

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-30"
      style={{ cursor: "crosshair" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showLine && (
        <>
          {/* Right-side dim overlay */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: linePct,
              right: 0,
              background: "rgba(0,0,0,0.45)",
              pointerEvents: "none",
            }}
          />

          {/* Blue vertical line */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: linePct,
              width: "2px",
              transform: "translateX(-1px)",
              background: "#2962ff",
              pointerEvents: "none",
            }}
          />

          {/* Date label above the line */}
          {hoverTime && (
            <div
              className="absolute"
              style={{
                left: linePct,
                bottom: "28px",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                background: "#2962ff",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
              }}
            >
              {hoverTime}
            </div>
          )}
        </>
      )}

      {/* Bottom tooltip — always visible while in seek mode */}
      <div
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 rounded-t-[4px] px-3 py-1.5 text-[12px]"
        style={{
          background: "rgba(19,23,34,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderBottom: "none",
          color: "#d1d4dc",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        Bar replay: click the bar to start from&nbsp;&nbsp;
        <span style={{ color: "#787b86" }}>(Esc cancels)</span>
      </div>
    </div>
  );
}
