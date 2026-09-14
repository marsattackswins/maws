"use client";

import { getChart } from "@/lib/chart-registry";
import { CHART_TIME_AXIS_H } from "@/lib/drawings";
import type { StudyPaneLayout } from "@/components/charts/ChartCanvas";
import { useAppStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** The outer chart-pane id (used to look up the LWC chart handle). */
  chartPaneId: string;
  /**
   * The indicator sub-pane layout as published by ChartCanvas.
   * `paneIndex` is the 1-based index into `chart.panes()` — index 0 is
   * always the main price pane.
   */
  layout: StudyPaneLayout;
  paneIndex: number;
};

const FALLBACK_AXIS_W = 54;
const TIME_AXIS_H = CHART_TIME_AXIS_H;
/** Height of the "A" button in pixels. */
const BTN_H = 20;
/** Width of the "A" button. */
const BTN_W = 36;

function getSubPaneRightAxisWidth(chartPaneId: string): number {
  const handle = getChart(chartPaneId);
  if (!handle) return FALLBACK_AXIS_W;
  try {
    return Math.max(handle.chart.priceScale("right").width(), FALLBACK_AXIS_W);
  } catch {
    return FALLBACK_AXIS_W;
  }
}

function applySubPaneAutoScale(chartPaneId: string, paneIndex: number): boolean {
  const handle = getChart(chartPaneId);
  if (!handle) return false;
  try {
    const pane = handle.chart.panes()[paneIndex];
    if (!pane) return false;
    pane.priceScale("right").setAutoScale(true);
    try {
      pane.priceScale("left").setAutoScale(true);
    } catch {
      /* left may be hidden */
    }
    return true;
  } catch {
    return false;
  }
}

function clearSubPaneAutoScale(chartPaneId: string, paneIndex: number) {
  const handle = getChart(chartPaneId);
  if (!handle) return;
  try {
    const pane = handle.chart.panes()[paneIndex];
    if (!pane) return;
    const scale = pane.priceScale("right");
    const range = scale.getVisibleRange();
    scale.setAutoScale(false);
    if (range && Number.isFinite(range.from) && Number.isFinite(range.to)) {
      scale.setVisibleRange(range);
    }
  } catch {
    /* scale may be hidden or chart disposed */
  }
}

/**
 * Renders a TradingView-style "A" auto-scale button that floats over the
 * right price-axis of a single indicator sub-pane.
 *
 * The button is invisible until the user hovers that specific pane region,
 * then fades in. Clicking it toggles auto-scale on/off for that LWC pane.
 */
export function IndicatorPaneAutoScale({ chartPaneId, layout, paneIndex }: Props) {
  const chartBg = useAppStore((s) => s.chartSettings.backgroundColor) || "#000000";
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(true);
  const [axisW, setAxisW] = useState(FALLBACK_AXIS_W);
  const rafRef = useRef(0);

  // Keep the price-axis width in sync with LWC layout changes.
  useEffect(() => {
    const sync = () => setAxisW(getSubPaneRightAxisWidth(chartPaneId));
    sync();

    // Find the chart-host element via the first pane's HTML element.
    const handle = getChart(chartPaneId);
    const paneEl = handle?.chart.panes()[0]?.getHTMLElement();
    const host = paneEl?.closest<HTMLElement>("[data-chart-host]");
    if (!host) return;

    const ro = new ResizeObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(sync);
    });
    ro.observe(host);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [chartPaneId]);

  // Poll for external scale changes (drag/scroll on the price axis) so we
  // can deactivate the button when the user has manually zoomed the sub-pane.
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const handle = getChart(chartPaneId);
      if (!handle) return;
      try {
        const pane = handle.chart.panes()[paneIndex];
        if (!pane) return;
        const opts = pane.priceScale("right").options();
        if (opts && !opts.autoScale) setActive(false);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearInterval(id);
  }, [active, chartPaneId, paneIndex]);

  // Clamp button vertically within the usable pane area (exclude time-axis).
  const usableHeight = layout.height - TIME_AXIS_H;
  const btnTop = Math.round(layout.top + usableHeight / 2 - BTN_H / 2);
  const clampedTop = Math.max(layout.top + 2, Math.min(btnTop, layout.top + usableHeight - BTN_H - 2));
  // Pin the button to the right edge of the axis column.
  const btnRight = 2;

  return (
    <>
      {/* Invisible hover-detection overlay covering the right axis of this sub-pane. */}
      <div
        aria-hidden
        className="pointer-events-auto absolute z-30"
        style={{
          top: layout.top,
          right: 0,
          width: axisW,
          height: usableHeight,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* The "A" button, pinned to the right edge of the axis column. */}
      <button
        type="button"
        title={active ? "Auto scale on — click to disable" : "Auto scale (fit visible range)"}
        aria-label="Auto scale indicator pane"
        aria-pressed={active}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (active) {
            clearSubPaneAutoScale(chartPaneId, paneIndex);
            setActive(false);
          } else {
            applySubPaneAutoScale(chartPaneId, paneIndex);
            setActive(true);
          }
        }}
        style={{
          position: "absolute",
          top: clampedTop,
          right: btnRight,
          width: BTN_W,
          height: BTN_H,
          zIndex: 41,
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
          transition: "opacity 120ms ease, color 100ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: chartBg,
          borderRadius: 3,
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 11,
          lineHeight: 1,
          fontWeight: active ? 700 : 500,
          color: active ? "#d1d4dc" : "#787b86",
          letterSpacing: "0.02em",
        }}
      >
        A
      </button>
    </>
  );
}
