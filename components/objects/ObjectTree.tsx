"use client";

import { DRAW_LABEL } from "@/lib/drawings";
import { indicatorTitle } from "@/lib/indicators";
import { formatTicker } from "@/lib/maws/universe";
import { useAppStore } from "@/lib/store";
import { ChevronDown, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

export function ObjectTree() {
  const panes = useAppStore((s) => s.panes);
  const layoutCount = useAppStore((s) => s.layoutCount);
  const activePaneId = useAppStore((s) => s.activePaneId);
  const setActivePane = useAppStore((s) => s.setActivePane);
  const removeIndicator = useAppStore((s) => s.removeIndicator);
  const setIndicatorHidden = useAppStore((s) => s.setIndicatorHidden);
  const toggleDrawingHidden = useAppStore((s) => s.toggleDrawingHidden);
  const removeDrawing = useAppStore((s) => s.removeDrawing);
  const clearDrawings = useAppStore((s) => s.clearDrawings);
  const drawingsHidden = useAppStore((s) => s.drawingsHidden);
  const setDrawingsHidden = useAppStore((s) => s.setDrawingsHidden);
  const selectedDrawingId = useAppStore((s) => s.selectedDrawingId);
  const setSelectedDrawing = useAppStore((s) => s.setSelectedDrawing);
  const setDrawingSettingsTarget = useAppStore((s) => s.setDrawingSettingsTarget);
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const visible = panes.slice(0, layoutCount);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-8 items-center justify-between border-b border-[#222222] px-2">
        <span className="text-[13px] font-semibold text-[#d1d4dc]">Object tree</span>
        <button
          type="button"
          className="text-[11px] text-[#787b86] hover:text-[#d1d4dc]"
          onClick={() => setDrawingsHidden(!drawingsHidden)}
        >
          {drawingsHidden ? "Show all" : "Hide all"}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto py-1">
        {visible.map((pane) => {
          const collapsed = closed[pane.id];
          const active = pane.id === activePaneId;
          const studies = pane.studies;
          return (
            <div key={pane.id} className="px-1">
              <button
                type="button"
                className={`flex w-full items-center gap-1 rounded-[3px] px-1 py-1 text-left ${
                  active ? "bg-[var(--maws-elevated)]" : "hover:bg-[var(--maws-elevated)]"
                }`}
                onClick={() => {
                  setActivePane(pane.id);
                  setClosed({ ...closed, [pane.id]: !collapsed });
                }}
              >
                <ChevronDown
                  size={12}
                  className={`text-[#787b86] ${collapsed ? "-rotate-90" : ""}`}
                />
                <span className="text-[12px] font-semibold text-[#d1d4dc]">
                  {formatTicker(pane.symbol)}
                </span>
                <span className="text-[11px] text-[#4c525e]">{pane.timeframe}</span>
              </button>
              {!collapsed && (
                <div className="ml-3 border-l border-[#222222] pb-2">
                  {studies.map((study) => {
                    const hidden = Boolean(study.hidden);
                    return (
                    <div
                      key={study.id}
                      className="flex items-center gap-1 px-2 py-0.5 text-[12px] text-[#d1d4dc]"
                    >
                      <span className={`flex-1 ${hidden ? "text-[#4c525e]" : ""}`}>
                        {indicatorTitle(study.type, pane.symbol)}
                      </span>
                      <button
                        type="button"
                        title={hidden ? "Show" : "Hide"}
                        onClick={() => setIndicatorHidden(study.id, !hidden, pane.id)}
                        className="text-[#787b86] hover:text-[#d1d4dc]"
                      >
                        {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => removeIndicator(study.id, pane.id)}
                        className="text-[#787b86] hover:text-[#f23645]"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    );
                  })}
                  {pane.drawings.length === 0 && studies.length === 0 && (
                    <div className="px-2 py-1 text-[11px] text-[#4c525e]">Empty</div>
                  )}
                  {pane.drawings.map((d) => (
                    <div
                      key={d.id}
                      className={`flex cursor-pointer items-center gap-1 px-2 py-0.5 text-[12px] ${
                        selectedDrawingId === d.id ? "bg-[var(--maws-elevated)] text-[#d1d4dc]" : "text-[#d1d4dc]"
                      }`}
                      onClick={() => {
                        setActivePane(pane.id);
                        setSelectedDrawing(d.id);
                      }}
                      onDoubleClick={() => {
                        setActivePane(pane.id);
                        setSelectedDrawing(d.id);
                        setDrawingSettingsTarget({ paneId: pane.id, drawingId: d.id });
                      }}
                    >
                      <span className="flex-1 truncate">
                        {d.text ?? DRAW_LABEL[d.tool] ?? d.tool}
                      </span>
                      <button
                        type="button"
                        title={d.hidden ? "Show" : "Hide"}
                        onClick={() => toggleDrawingHidden(pane.id, d.id)}
                        className="text-[#787b86] hover:text-[#d1d4dc]"
                      >
                        {d.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => removeDrawing(pane.id, d.id)}
                        className="text-[#787b86] hover:text-[#f23645]"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {pane.drawings.length > 0 && (
                    <button
                      type="button"
                      className="px-2 pt-1 text-[11px] text-[#787b86] hover:text-[#f23645]"
                      onClick={() => clearDrawings(pane.id)}
                    >
                      Remove drawings
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
