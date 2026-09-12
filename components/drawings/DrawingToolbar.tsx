"use client";

import { ToolbarBtn } from "@/components/ui/ToolbarBtn";
import { useAppStore } from "@/lib/store";
import type { DrawingTool } from "@/types";
import { Activity, Lock, Magnet, Pencil, Type, ZoomIn } from "lucide-react";
import type { ReactNode } from "react";

function Ico({ children }: { children: ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {children}
    </svg>
  );
}

const TOOL_GROUPS: { id: DrawingTool; label: string; icon: ReactNode }[][] = [
  [
    { 
      id: "cursor", 
      label: "Cursor", 
      icon: (
        <Ico>
          <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </Ico>
      )
    },
    { id: "zoom", label: "Zoom", icon: <ZoomIn size={15} /> },
  ],
  [
    {
      id: "trend",
      label: "Trend line",
      icon: (
        <Ico>
          <path d="M2 13 14 3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="2" cy="13" r="1.2" fill="currentColor" />
          <circle cx="14" cy="3" r="1.2" fill="currentColor" />
        </Ico>
      ),
    },
    {
      id: "hray",
      label: "Horizontal ray",
      icon: (
        <Ico>
          <path d="M3 8h12" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="3" cy="8" r="1.3" fill="currentColor" />
        </Ico>
      ),
    },
    {
      id: "fib",
      label: "Fib retracement",
      icon: (
        <Ico>
          {/* top line — longest */}
          <line x1="2" y1="3.5" x2="12" y2="3.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12.8" cy="3.5" r="1.3" fill="currentColor" />
          {/* middle line — medium */}
          <line x1="2" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="10.8" cy="8" r="1.3" fill="currentColor" />
          {/* bottom line — shorter */}
          <line x1="2" y1="12.5" x2="7.5" y2="12.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8.3" cy="12.5" r="1.3" fill="currentColor" />
        </Ico>
      ),
    },
    {
      id: "path",
      label: "Path",
      icon: (
        <Ico>
          <path d="M2 12 5 6 9 10 14 3" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="2" cy="12" r="1.1" fill="currentColor" />
          <circle cx="14" cy="3" r="1.1" fill="currentColor" />
        </Ico>
      ),
    },
    {
      id: "dcurve",
      label: "Double curve",
      icon: (
        <Ico>
          <path d="M2 12 C 5 2, 11 14, 14 4" stroke="currentColor" strokeWidth="1.4" />
        </Ico>
      ),
    },
  ],
  [
    {
      id: "long",
      label: "Long position",
      icon: (
        <Ico>
          <circle cx="2.5" cy="3" r="1.35" stroke="currentColor" strokeWidth="1.15" />
          <path d="M4.2 3h10.3" stroke="currentColor" strokeWidth="1.15" />
          <path d="M1.5 8h13" stroke="currentColor" strokeWidth="1.85" />
          <circle cx="2.5" cy="13" r="1.35" stroke="currentColor" strokeWidth="1.15" />
          <path d="M4.2 13h10.3" stroke="currentColor" strokeWidth="1.15" />
          <text
            x="8.5"
            y="6.35"
            fill="currentColor"
            fontSize="5.5"
            fontFamily="Trebuchet MS, sans-serif"
            fontWeight="600"
            textAnchor="middle"
          >
            L
          </text>
        </Ico>
      ),
    },
    {
      id: "short",
      label: "Short position",
      icon: (
        <Ico>
          <circle cx="2.5" cy="3" r="1.35" stroke="currentColor" strokeWidth="1.15" />
          <path d="M4.2 3h10.3" stroke="currentColor" strokeWidth="1.15" />
          <path d="M1.5 8h13" stroke="currentColor" strokeWidth="1.85" />
          <circle cx="2.5" cy="13" r="1.35" stroke="currentColor" strokeWidth="1.15" />
          <path d="M4.2 13h10.3" stroke="currentColor" strokeWidth="1.15" />
          <text
            x="8.5"
            y="11.85"
            fill="currentColor"
            fontSize="5.5"
            fontFamily="Trebuchet MS, sans-serif"
            fontWeight="600"
            textAnchor="middle"
          >
            S
          </text>
        </Ico>
      ),
    },
  ],
  [
    {
      id: "rect",
      label: "Rectangle",
      icon: (
        <Ico>
          <rect x="3" y="4" width="10" height="8" stroke="currentColor" strokeWidth="1.4" />
        </Ico>
      ),
    },
    {
      id: "circle",
      label: "Circle",
      icon: (
        <Ico>
          <circle cx="8" cy="8" r="5.2" stroke="currentColor" strokeWidth="1.4" />
        </Ico>
      ),
    },
    {
      id: "arrowUp",
      label: "Arrow mark up",
      icon: (
        <Ico>
          <path d="M8 2 4 9h8L8 2Z" fill="currentColor" />
          <path d="M8 9v5" stroke="currentColor" strokeWidth="1.4" />
        </Ico>
      ),
    },
    {
      id: "arrowDown",
      label: "Arrow mark down",
      icon: (
        <Ico>
          <path d="M8 14 4 7h8L8 14Z" fill="currentColor" />
          <path d="M8 7V2" stroke="currentColor" strokeWidth="1.4" />
        </Ico>
      ),
    },
    { id: "text", label: "Text", icon: <Type size={15} /> },
  ],
];

/** Horizontal drawing tools for the top bar. */
export function DrawingToolbar() {
  const tool = useAppStore((s) => s.drawingTool);
  const setDrawingTool = useAppStore((s) => s.setDrawingTool);
  const magnet = useAppStore((s) => s.magnet);
  const setMagnet = useAppStore((s) => s.setMagnet);
  const stay = useAppStore((s) => s.stayInDrawingMode);
  const setStay = useAppStore((s) => s.setStayInDrawingMode);
  const drawingsHidden = useAppStore((s) => s.drawingsHidden);
  const setDrawingsHidden = useAppStore((s) => s.setDrawingsHidden);
  const indicatorsHidden = useAppStore((s) => s.indicatorsHidden);
  const setIndicatorsHidden = useAppStore((s) => s.setIndicatorsHidden);
  const activePaneId = useAppStore((s) => s.activePaneId);
  const clearDrawings = useAppStore((s) => s.clearDrawings);

  return (
    <div className="flex items-center overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex shrink-0 items-center gap-0.5">
        {TOOL_GROUPS.map((group, i) => (
          <div key={i} className="flex items-center gap-0.5">
            {i > 0 && <span className="top-sep" />}
            {group.map((t) => (
              <ToolbarBtn
                key={t.id}
                label={t.label}
                active={tool === t.id}
                onClick={() => setDrawingTool(t.id)}
              >
                {t.icon}
              </ToolbarBtn>
            ))}
          </div>
        ))}
        <span className="top-sep" />
        <ToolbarBtn label="Magnet" active={magnet} onClick={() => setMagnet(!magnet)}>
          <Magnet size={15} />
        </ToolbarBtn>
        <ToolbarBtn label="Stay in drawing mode" active={stay} onClick={() => setStay(!stay)}>
          <Lock size={15} />
        </ToolbarBtn>
        <ToolbarBtn
          label={drawingsHidden ? "Show drawings" : "Hide drawings"}
          active={drawingsHidden}
          onClick={() => setDrawingsHidden(!drawingsHidden)}
        >
          <Pencil size={15} />
        </ToolbarBtn>
        <ToolbarBtn
          label={indicatorsHidden ? "Show indicators" : "Hide indicators"}
          active={indicatorsHidden}
          onClick={() => setIndicatorsHidden(!indicatorsHidden)}
        >
          <Activity size={15} />
        </ToolbarBtn>
        <ToolbarBtn label="Clear pane drawings" onClick={() => clearDrawings(activePaneId)}>
          <span className="text-[10px] font-semibold">CLR</span>
        </ToolbarBtn>
      </div>
    </div>
  );
}
