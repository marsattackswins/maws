"use client";

import { getChart } from "@/lib/chart-registry";
import { attachChartLinkedPaint } from "@/lib/chart-linked-paint";
import { CHART_TIME_AXIS_H, plotBoundsFromScales } from "@/lib/drawings";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { timeframeSeconds } from "@/lib/timeframes";
import type { Candle, ChartPaneState, DrawingLineStyle, Timeframe } from "@/types";
import { useEffect, useRef } from "react";

/** UTC day bucket — same key VWAP session anchor uses (`floor(unix / 86400)`). */
function utcDayKey(unixSec: number): number {
  return Math.floor(unixSec / 86400);
}

/** First bar of each UTC calendar day (sub-daily only). Aligns with session VWAP resets. */
function sessionBreakTimes(candles: Candle[], timeframe: Timeframe): number[] {
  if (timeframeSeconds(timeframe) >= 86_400 || candles.length < 2) return [];
  const out: number[] = [];
  let prev = utcDayKey(candles[0].time);
  for (let i = 1; i < candles.length; i++) {
    const key = utcDayKey(candles[i].time);
    if (key !== prev) {
      out.push(candles[i].time);
      prev = key;
    }
  }
  return out;
}

function dashFor(style: DrawingLineStyle): string {
  if (style === "dashed") return "6 4";
  if (style === "dotted") return "2 3";
  return "";
}

export function SessionBreaks({ pane }: { pane: ChartPaneState }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const enabled = useAppStore((s) => s.chartSettings.sessionBreaks);
  const color = useAppStore((s) => s.chartSettings.sessionBreakColor);
  const lineStyle = useAppStore((s) => s.chartSettings.sessionBreakLineStyle);
  const lineWidth = useAppStore((s) => s.chartSettings.sessionBreakLineWidth);
  /** Cached break unix times — rebuilt only when series tip/length changes. */
  const breaksRef = useRef<number[]>([]);
  const breaksKeyRef = useRef("");

  const paint = () => {
    const svg = svgRef.current;
    if (!svg) return;
    if (!enabled) {
      svg.innerHTML = "";
      return;
    }

    const handle = getChart(pane.id);
    if (!handle) {
      svg.innerHTML = "";
      return;
    }

    // Always read candles directly from the feed for the current symbol + timeframe.
    // Using handle.candles risks reading the previous TF's styled candles mid-swap.
    const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    if (candles.length < 2) {
      svg.innerHTML = "";
      return;
    }
    const tip = candles.at(-1);
    const key = `${pane.symbol}|${pane.timeframe}|${candles.length}|${tip?.time ?? 0}`;
    if (key !== breaksKeyRef.current) {
      breaksKeyRef.current = key;
      breaksRef.current = sessionBreakTimes(candles, pane.timeframe);
    }
    const breaks = breaksRef.current;
    if (breaks.length === 0) {
      svg.innerHTML = "";
      return;
    }

    const w = svg.clientWidth || 1;
    const h = svg.clientHeight || 1;
    let left = 0;
    let right = 0;
    try {
      left = handle.chart.priceScale("left").width();
    } catch {
      /* ignore */
    }
    try {
      right = handle.chart.priceScale("right").width();
    } catch {
      /* ignore */
    }
    const plot = plotBoundsFromScales(
      { width: w, height: h },
      { left, right, timeAxis: CHART_TIME_AXIS_H },
    );

    const dash = dashFor(lineStyle);
    const dashAttr = dash ? `stroke-dasharray="${dash}"` : "";
    const nodes: string[] = [];
    const ts = handle.chart.timeScale();
    const visible = ts.getVisibleRange();
    const from =
      visible && typeof visible.from === "number" ? (visible.from as number) - 86_400 : null;
    const to =
      visible && typeof visible.to === "number" ? (visible.to as number) + 86_400 : null;

    for (const t of breaks) {
      if (from != null && to != null && (t < from || t > to)) continue;
      // Break times are exact bar times; only draw where the chart has that bar.
      // No index extrapolation — mid-swap it would place lines at bogus positions.
      const x = ts.timeToCoordinate(t as never);
      if (x == null || x < plot.left - 2 || x > plot.right + 2) continue;
      nodes.push(
        `<line pointer-events="none" x1="${x}" y1="${plot.top}" x2="${x}" y2="${plot.bottom}" stroke="${color}" stroke-width="${lineWidth}" ${dashAttr} />`,
      );
    }
    svg.innerHTML = nodes.join("");
  };

  useEffect(() => {
    if (!enabled) {
      if (svgRef.current) svgRef.current.innerHTML = "";
      return;
    }

    // On every effect run (TF / symbol change), wipe stale lines immediately
    // and force a fresh recalculation on the next paint.
    if (svgRef.current) svgRef.current.innerHTML = "";
    breaksKeyRef.current = "";

    let feedRaf = 0;

    // New-bar / history only — tip ticks must not rebuild day keys.
    // Defer via rAF so the chart has applied its new data before we read it.
    const unsub = mawsFeed.subscribe(pane.symbol, pane.timeframe, (_c, _q, meta) => {
      if (meta?.tick) return;
      breaksKeyRef.current = "";
      if (feedRaf) cancelAnimationFrame(feedRaf);
      feedRaf = requestAnimationFrame(() => {
        feedRaf = 0;
        paint();
      });
    });

    const detach = attachChartLinkedPaint({
      paneId: pane.id,
      getChart,
      paint,
      observeEl: svgRef.current,
    });

    // Schedule an initial paint after one frame so the chart is settled.
    const initRaf = requestAnimationFrame(() => paint());

    return () => {
      cancelAnimationFrame(initRaf);
      if (feedRaf) cancelAnimationFrame(feedRaf);
      unsub();
      detach();
      if (svgRef.current) svgRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pane.id, pane.symbol, pane.timeframe, enabled, color, lineStyle, lineWidth]);

  if (!enabled) return null;

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-[12] h-full w-full"
      aria-hidden
    />
  );
}
