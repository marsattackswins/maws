"use client";

import { AlertsPanel } from "@/components/alerts/AlertsPanel";
import { NewsCalendarPanel } from "@/components/calendar/NewsCalendarPanel";
import { ObjectTree } from "@/components/objects/ObjectTree";
import { StrategyScreener } from "@/components/maws/StrategyScreener";
import { useAppStore } from "@/lib/store";
import type { DockId } from "@/types";

function resolveDock(dock: DockId | string): DockId {
  // Migrate removed docks to their replacements.
  if (dock === "watchlist" || dock === "screener") return "strategy";
  if (dock === "news") return "calendar";
  return dock as DockId;
}

export function RightSidebar() {
  const open = useAppStore((s) => s.rightOpen);
  const width = useAppStore((s) => s.rightWidth);
  const setRightWidth = useAppStore((s) => s.setRightWidth);
  const dock = useAppStore((s) => s.rightDock);
  const effectiveDock = resolveDock(dock);

  if (!open) return null;

  return (
    <aside
      className="relative flex shrink-0 flex-col border-l"
      style={{
        width,
        background: "var(--maws-panel)",
        borderColor: "var(--maws-border)",
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="absolute top-0 -left-1 z-10 h-full w-2 cursor-col-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startW = width;
            const move = (ev: MouseEvent) => {
              setRightWidth(Math.min(520, Math.max(200, startW - (ev.clientX - startX))));
            };
            const up = () => {
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
        />
        {effectiveDock === "strategy" && (
          <div className="min-h-0 flex-1">
            <StrategyScreener />
          </div>
        )}
        {effectiveDock === "alerts" && (
          <div className="min-h-0 flex-1">
            <AlertsPanel />
          </div>
        )}
        {effectiveDock === "calendar" && (
          <div className="min-h-0 flex-1">
            <NewsCalendarPanel />
          </div>
        )}
        {effectiveDock === "objects" && (
          <div className="min-h-0 flex-1">
            <ObjectTree />
          </div>
        )}
      </div>
    </aside>
  );
}
