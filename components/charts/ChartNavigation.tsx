"use client";

import { getChart } from "@/lib/chart-registry";
import { zoomInRightAnchored, zoomOutRightAnchored } from "@/lib/chart-zoom";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { chartOptions } from "@/lib/theme";
import type { ChartSettings } from "@/types";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw } from "lucide-react";
import { useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

type Mode = ChartSettings["navigationButtons"];

type Props = {
  paneId: string;
  mode: Mode;
  onViewReset?: () => void;
};

const PAN_FRAC = 0.28;
const DEFAULT_VISIBLE_BARS = 90;
const MIN_SPAN = 8;

function panLogical(paneId: string, direction: -1 | 1) {
  const ts = getChart(paneId)?.chart.timeScale();
  if (!ts) return;
  const range = ts.getVisibleLogicalRange();
  if (!range) return;
  const span = Math.max(MIN_SPAN, range.to - range.from);
  const delta = span * PAN_FRAC * direction;
  ts.setVisibleLogicalRange({ from: range.from + delta, to: range.to + delta });
}

function zoomIn(paneId: string) {
  const ts = getChart(paneId)?.chart.timeScale();
  if (ts) zoomInRightAnchored(ts);
}

function zoomOut(paneId: string) {
  const ts = getChart(paneId)?.chart.timeScale();
  if (ts) zoomOutRightAnchored(ts);
}

function resetChartView(paneId: string) {
  const handle = getChart(paneId);
  if (!handle) return;
  const pane = useAppStore.getState().panes.find((p) => p.id === paneId);
  if (!pane) return;
  const settings = useAppStore.getState().chartSettings;
  const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
  const n = candles.length;
  const right = settings.marginRightBars;
  const barSpacing = chartOptions.timeScale?.barSpacing ?? 7;
  const ts = handle.chart.timeScale();
  ts.applyOptions({ barSpacing, rightOffset: right });
  if (n > 0) {
    ts.setVisibleLogicalRange({
      from: Math.max(-right, n - DEFAULT_VISIBLE_BARS),
      to: n + right,
    });
  } else {
    ts.resetTimeScale();
  }
  handle.chart.priceScale("right").setAutoScale(true);
  try {
    handle.chart.priceScale("left").setAutoScale(true);
  } catch {
    /* left scale may be hidden */
  }
  useAppStore.getState().setPaneAutoScale(paneId, true);
}

function NavBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2a2e39] text-[#d1d4dc] shadow-[0_1px_3px_rgba(0,0,0,0.45)] hover:bg-[#363a45] hover:text-white"
      onMouseDown={(e: ReactMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export function ChartNavigation({ paneId, mode, onViewReset }: Props) {
  const setActivePane = useAppStore((s) => s.setActivePane);
  const [near, setNear] = useState(false);

  if (mode === "never") return null;

  const run = (fn: () => void) => {
    setActivePane(paneId);
    fn();
  };

  const bar = (
    <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
      <NavBtn label="Zoom out" onClick={() => run(() => zoomOut(paneId))}>
        <Minus size={14} strokeWidth={2.25} />
      </NavBtn>
      <NavBtn label="Zoom in" onClick={() => run(() => zoomIn(paneId))}>
        <Plus size={14} strokeWidth={2.25} />
      </NavBtn>
      <NavBtn label="Scroll left" onClick={() => run(() => panLogical(paneId, -1))}>
        <ChevronLeft size={15} strokeWidth={2.25} />
      </NavBtn>
      <NavBtn label="Scroll right" onClick={() => run(() => panLogical(paneId, 1))}>
        <ChevronRight size={15} strokeWidth={2.25} />
      </NavBtn>
      <NavBtn
        label="Reset chart view"
        onClick={() =>
          run(() => {
            resetChartView(paneId);
            onViewReset?.();
          })
        }
      >
        <RotateCcw size={13} strokeWidth={2.25} />
      </NavBtn>
    </div>
  );

  if (mode === "always") {
    return (
      <div className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2">{bar}</div>
    );
  }

  return (
    <div
      className="absolute bottom-7 left-1/2 z-40 flex h-14 w-[280px] -translate-x-1/2 items-end justify-center pb-1"
      onMouseEnter={() => setNear(true)}
      onMouseLeave={() => setNear(false)}
    >
      <div
        className={`transition-opacity duration-150 ${
          near ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {bar}
      </div>
    </div>
  );
}
