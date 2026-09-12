"use client";

import { ChartPane } from "@/components/charts/ChartPane";
import { frToTemplate, layoutKey, layoutTemplate } from "@/lib/layouts";
import { useAppStore } from "@/lib/store";
import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";

const MIN_FR = 0.15;

function sum(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0);
}

export function ChartGrid() {
  const layoutCount = useAppStore((s) => s.layoutCount);
  const orientation = useAppStore((s) => s.orientation);
  const panes = useAppStore((s) => s.panes);
  const maximizedPaneId = useAppStore((s) => s.maximizedPaneId);
  const layoutTracks = useAppStore((s) => s.layoutTracks);
  const setLayoutTracks = useAppStore((s) => s.setLayoutTracks);
  const clearFocusedPane = useAppStore((s) => s.clearFocusedPane);
  const template = layoutTemplate(layoutCount, orientation);
  const key = layoutKey(layoutCount, orientation);
  const stored = layoutTracks[key];
  const cols =
    stored?.cols?.length === template.colFr.length ? stored.cols : template.colFr;
  const rows =
    stored?.rows?.length === template.rowFr.length ? stored.rows : template.rowFr;
  const visible = panes.slice(0, layoutCount);
  const maximized = visible.find((p) => p.id === maximizedPaneId);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!useAppStore.getState().focusedPane) return;
      event.preventDefault();
      clearFocusedPane();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearFocusedPane]);

  const startResize = (
    event: ReactMouseEvent,
    axis: "col" | "row",
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const el = gridRef.current;
    if (!el) return;
    const startPos = axis === "col" ? event.clientX : event.clientY;
    const startTracks = axis === "col" ? [...cols] : [...rows];
    const pair = startTracks[index] + startTracks[index + 1];
    const total = sum(startTracks);
    const size = axis === "col" ? el.clientWidth : el.clientHeight;
    if (size <= 0 || pair <= 0 || total <= 0) return;

    const prev = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = axis === "col" ? "col-resize" : "row-resize";

    const move = (ev: MouseEvent) => {
      const deltaPx = (axis === "col" ? ev.clientX : ev.clientY) - startPos;
      const deltaFr = (deltaPx / size) * total;
      let left = startTracks[index] + deltaFr;
      left = Math.max(MIN_FR, Math.min(pair - MIN_FR, left));
      const next = [...startTracks];
      next[index] = left;
      next[index + 1] = pair - left;
      setLayoutTracks(key, {
        cols: axis === "col" ? next : cols,
        rows: axis === "row" ? next : rows,
      });
    };
    const up = () => {
      document.body.style.userSelect = prev;
      document.body.style.cursor = prevCursor;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (maximized) {
    return (
      <div className="h-full min-h-0 w-full bg-[#000000]">
        <ChartPane pane={maximized} />
      </div>
    );
  }

  const colTotal = sum(cols);
  const rowTotal = sum(rows);

  return (
    <div
      ref={gridRef}
      className="relative h-full min-h-0 w-full bg-[#222222]"
      style={{
        display: "grid",
        gridTemplateColumns: frToTemplate(cols),
        gridTemplateRows: frToTemplate(rows),
        gap: 1,
      }}
    >
      {visible.map((pane, i) => (
        <div
          key={pane.id}
          className="min-h-0 min-w-0"
          style={{ gridArea: template.areas[i] }}
        >
          <ChartPane pane={pane} />
        </div>
      ))}

      {cols.length > 1 &&
        cols.slice(0, -1).map((_, i) => {
          const leftPct = (sum(cols.slice(0, i + 1)) / colTotal) * 100;
          return (
            <div
              key={`v-${i}`}
              role="separator"
              aria-orientation="vertical"
              title="Drag to resize"
              className="absolute top-0 bottom-0 z-30 w-2 -translate-x-1/2 cursor-col-resize hover:bg-[#2962ff]/35"
              style={{ left: `${leftPct}%` }}
              onMouseDown={(e) => startResize(e, "col", i)}
            />
          );
        })}

      {rows.length > 1 &&
        rows.slice(0, -1).map((_, i) => {
          const topPct = (sum(rows.slice(0, i + 1)) / rowTotal) * 100;
          return (
            <div
              key={`h-${i}`}
              role="separator"
              aria-orientation="horizontal"
              title="Drag to resize"
              className="absolute right-0 left-0 z-30 h-2 -translate-y-1/2 cursor-row-resize hover:bg-[#2962ff]/35"
              style={{ top: `${topPct}%` }}
              onMouseDown={(e) => startResize(e, "row", i)}
            />
          );
        })}
    </div>
  );
}
