"use client";

import { getChart } from "@/lib/chart-registry";
import { attachChartLinkedPaint } from "@/lib/chart-linked-paint";
import {
  CHART_TIME_AXIS_H,
  plotBoundsFromScales,
  unixTimeToCoordinate,
} from "@/lib/drawings";
import { applyColorOpacity } from "@/lib/indicators";
import { mawsFeed } from "@/lib/maws/feed";
import {
  computeOrderBlocksLive,
  type ObConfig,
  type ObHistoryCache,
} from "@/lib/order-blocks";
import { useAppStore } from "@/lib/store";
import { isVisibleOnTimeframe } from "@/lib/visibility";
import type {
  ChartPaneState,
  IndicatorLineStyleSettings,
  ObIndicatorSettings,
} from "@/types";
import { useEffect, useMemo, useRef } from "react";

/** One box: `css.opacity` drives the fill alpha. No border — OBs render as pure background. */
function rectNode(
  x: number,
  y: number,
  w: number,
  h: number,
  css: IndicatorLineStyleSettings,
): string {
  const fill = applyColorOpacity(css.color, css.opacity ?? 20);
  return (
    `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${Math.max(0, w).toFixed(2)}" ` +
    `height="${Math.max(0, h).toFixed(2)}" fill="${fill}" ` +
    `shape-rendering="crispEdges" pointer-events="none" />`
  );
}

/**
 * Order Blocks & Breaker Blocks overlay.
 *
 * Box-shaped study, so it bypasses the ChartCanvas series machinery entirely and paints straight
 * to an SVG layer (like SessionBreaks). Each visible `ob` study runs the incremental engine over
 * the pane's candles; the per-study history cache makes live ticks O(blocks) instead of a full
 * recompute.
 */
export function OrderBlocks({ pane }: { pane: ChartPaneState }) {
  const svgRef = useRef<SVGSVGElement>(null);
  /** Per-study incremental cache — survives across paints, invalidated by config/new-bar keys. */
  const cacheRef = useRef<Map<string, ObHistoryCache>>(new Map());

  const paneStudies = useAppStore(
    (s) => s.panes.find((p) => p.id === pane.id)?.studies,
  );
  const hasOb = useMemo(
    () => (paneStudies ?? []).some((s) => s.type === "ob"),
    [paneStudies],
  );
  /** Cheap change-detector so the effect repaints when an OB study is edited/toggled/added. */
  const sig = useMemo(
    () =>
      (paneStudies ?? [])
        .filter((s) => s.type === "ob")
        .map((s) => `${s.id}:${s.hidden ? 1 : 0}:${JSON.stringify(s.settings)}`)
        .join("|"),
    [paneStudies],
  );

  useEffect(() => {
    // Settings changed (or studies added/removed): drop caches and recompute from scratch.
    cacheRef.current.clear();

    const paint = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const handle = getChart(pane.id);
      if (!handle) {
        svg.innerHTML = "";
        return;
      }
      const studies = (
        useAppStore.getState().panes.find((p) => p.id === pane.id)?.studies ?? []
      ).filter((s) => s.type === "ob");
      if (studies.length === 0) {
        svg.innerHTML = "";
        return;
      }
      const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
      if (candles.length === 0) {
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
      const ts = handle.chart.timeScale();
      const series = handle.series;
      const tf = pane.timeframe;
      const nodes: string[] = [];
      const seen = new Set<string>();

      for (const study of studies) {
        seen.add(study.id);
        if (study.hidden) continue;
        const s = study.settings as ObIndicatorSettings;
        if (!isVisibleOnTimeframe(s.visibility, tf)) continue;

        const cfg: ObConfig = {
          swingLookback: s.swingLookback,
          showLastBull: s.showLastBull,
          showLastBear: s.showLastBear,
          useBody: s.useBody,
          showLabels: s.showLabels,
        };
        const { result, cache } = computeOrderBlocksLive(
          candles,
          cfg,
          cacheRef.current.get(study.id) ?? null,
        );
        cacheRef.current.set(study.id, cache);

        for (const ob of result.displayed) {
          const isBull = ob.side === "bull";
          const baseCss = isBull ? s.bull : s.bear;
          const breakCss = isBull ? s.bullBreak : s.bearBreak;

          const yTop = series.priceToCoordinate(ob.top);
          const yBtm = series.priceToCoordinate(ob.btm);
          if (yTop == null || yBtm == null) continue;
          let top = Math.min(yTop, yBtm);
          let bot = Math.max(yTop, yBtm);
          if (bot < plot.top || top > plot.bottom) continue;
          top = Math.max(plot.top, top);
          bot = Math.min(plot.bottom, bot);
          const height = Math.max(1, bot - top);

          const xLoc = unixTimeToCoordinate(ts as never, ob.loc, candles, tf);
          if (xLoc == null || xLoc > plot.right) continue;
          const xStart = Math.max(plot.left, xLoc);

          if (!ob.breaker) {
            nodes.push(
              rectNode(xStart, top, plot.right - xStart, height, baseCss),
            );
          } else {
            // Two phases: the original block (solid) up to the mitigation point, then the
            // breaker (dashed, own colour) extending right — matching the Pine rendering.
            const xBreakRaw =
              ob.breakLoc != null
                ? unixTimeToCoordinate(ts as never, ob.breakLoc, candles, tf)
                : null;
            const xBreak =
              xBreakRaw != null
                ? Math.min(plot.right, Math.max(xStart, xBreakRaw))
                : plot.right;
            if (xBreak > xStart) {
              nodes.push(rectNode(xStart, top, xBreak - xStart, height, baseCss));
            }
            if (plot.right > xBreak) {
              nodes.push(
                rectNode(xBreak, top, plot.right - xBreak, height, breakCss),
              );
            }
          }
        }

        if (s.showLabels) {
          for (const lab of result.labels) {
            if (lab.barIndex < 0 || lab.barIndex >= candles.length) continue;
            const x = unixTimeToCoordinate(
              ts as never,
              candles[lab.barIndex].time,
              candles,
              tf,
            );
            if (x == null || x < plot.left - 20 || x > plot.right + 20) continue;
            const y = series.priceToCoordinate(lab.price);
            if (y == null || y < plot.top - 20 || y > plot.bottom + 20) continue;
            // Pine maps a bull break-confirm to '▼' at the swing HIGH in bearCss
            // (label_down → hangs below), and a bear break-confirm to '▲' at the swing
            // LOW in bullCss (label_up → sits above). The marker is deliberately the
            // opposite colour/side of the swing it annotates.
            const bull = lab.side === "bull";
            const glyph = bull ? "\u25BC" : "\u25B2";
            const color = applyColorOpacity((bull ? s.bear : s.bull).color, 100);
            const ty = bull ? y + 13 : y - 5;
            nodes.push(
              `<text x="${x.toFixed(2)}" y="${ty.toFixed(2)}" fill="${color}" ` +
                `font-size="11" text-anchor="middle" pointer-events="none">${glyph}</text>`,
            );
          }
        }
      }

      // Forget caches for studies that disappeared since the last paint.
      for (const id of cacheRef.current.keys()) {
        if (!seen.has(id)) cacheRef.current.delete(id);
      }

      svg.innerHTML = nodes.join("");
    };

    // Repaint on every feed update (new bars AND forming-bar ticks); coalesce bursts to one rAF.
    let rafPending = 0;
    const schedulePaint = () => {
      if (rafPending) return;
      rafPending = requestAnimationFrame(() => {
        rafPending = 0;
        paint();
      });
    };
    const unsub = mawsFeed.subscribe(pane.symbol, pane.timeframe, () => schedulePaint());
    const detach = attachChartLinkedPaint({
      paneId: pane.id,
      getChart,
      paint,
      observeEl: svgRef.current,
    });
    paint();
    return () => {
      if (rafPending) cancelAnimationFrame(rafPending);
      unsub();
      detach();
    };
  }, [pane.id, pane.symbol, pane.timeframe, sig]);

  if (!hasOb) return null;

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-[11] h-full w-full"
      aria-hidden
    />
  );
}
