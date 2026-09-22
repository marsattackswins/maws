"use client";

import { getChart } from "@/lib/chart-registry";
import { attachChartLinkedPaint } from "@/lib/chart-linked-paint";
import { wheelZoomFactor, zoomTimeScaleRightAnchored } from "@/lib/chart-zoom";
import {
  clampToPlot,
  coordinateToUnixTime,
  cubicControls,
  DEFAULT_POSITION_LINE_COLOR,
  DEFAULT_POSITION_STOP_COLOR,
  DEFAULT_POSITION_TARGET_COLOR,
  DEFAULT_RECT_BORDER_COLOR,
  DEFAULT_RECT_FILL_COLOR,
  DEFAULT_RECT_MIDDLE_LINE_COLOR,
  DEFAULT_CIRCLE_BORDER_COLOR,
  DEFAULT_CIRCLE_FILL_COLOR,
  DEFAULT_FIB_ONE_COLOR,
  DEFAULT_FIB_TREND_COLOR,
  cloneFibLevels,
  fibLevelPrice,
  resolveFibLevels,
  ALL_POSITION_STATS,
  dist,
  distToSeg,
  DRAW_LABEL,
  escapeXml,
  isPersistTool,
  neededPoints,
  plotBoundsFromScales,
  pointInPlot,
  positionAnchors,
  positionHandles,
  positionPointsFromDrag,
  resolvePositionPnlTip,
  POSITION_HANDLE_CURSOR,
  RECT_HANDLE_CURSOR,
  rectHandles,
  resizePosition,
  resizeRect,
  sampleCubic,
  snapPoint,
  unixTimeToCoordinate,
  type PlotBounds,
} from "@/lib/drawings";
import { formatPrice, mawsFeed } from "@/lib/maws/feed";
import { applyColorOpacity } from "@/lib/indicators";
import { useAppStore } from "@/lib/store";
import { TV } from "@/lib/theme";
import { timeframeSeconds } from "@/lib/timeframes";
import { cloneVisibility, isVisibleOnTimeframe } from "@/lib/visibility";
import type {
  ChartPaneState,
  ChartPoint,
  Drawing,
  DrawingExtend,
  DrawingLineStyle,
  DrawingTool,
} from "@/types";
import { useEffect, useRef, useState, memo } from "react";

type XY = { x: number; y: number };

function strokeDashAttr(style?: DrawingLineStyle) {
  if (style === "dashed") return ' stroke-dasharray="6 4"';
  if (style === "dotted") return ' stroke-dasharray="2 3"';
  return "";
}

function extendSegment(a: XY, b: XY, extend: DrawingExtend | undefined): [XY, XY] {
  if (!extend || extend === "none") return [a, b];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const scale = 8000 / len;
  let x1 = a.x;
  let y1 = a.y;
  let x2 = b.x;
  let y2 = b.y;
  if (extend === "left" || extend === "both") {
    x1 = a.x - dx * scale;
    y1 = a.y - dy * scale;
  }
  if (extend === "right" || extend === "both") {
    x2 = b.x + dx * scale;
    y2 = b.y + dy * scale;
  }
  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];
}

/** Screen bounds for a rectangle, optionally extended left/right across the plot. */
function rectScreenBox(
  pts: XY[],
  extend: DrawingExtend | undefined,
  plot: PlotBounds,
) {
  let x1 = Math.min(pts[0].x, pts[1].x);
  let x2 = Math.max(pts[0].x, pts[1].x);
  const y1 = Math.min(pts[0].y, pts[1].y);
  const y2 = Math.max(pts[0].y, pts[1].y);
  if (extend === "left" || extend === "both") x1 = plot.left;
  if (extend === "right" || extend === "both") x2 = plot.right;
  return { x: x1, y: y1, w: Math.max(0, x2 - x1), h: Math.max(0, y2 - y1), x2, y2 };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function arrowPath(p: XY, up: boolean) {
  const dir = up ? -1 : 1;
  const tip = { x: p.x, y: p.y };
  const base = { x: p.x, y: p.y + dir * 18 };
  return `M ${tip.x} ${tip.y} L ${base.x - 7} ${base.y} L ${base.x + 7} ${base.y} Z`;
}

function applyHostDrawCursor(host: HTMLElement, cursor: string) {
  if (cursor) host.setAttribute("data-draw-cursor", cursor);
  else host.removeAttribute("data-draw-cursor");
  host.querySelectorAll<HTMLElement>("canvas").forEach((node) => {
    node.style.cursor = cursor;
  });
  host.querySelectorAll<HTMLElement>(".chart-plot").forEach((node) => {
    node.style.cursor = cursor || "";
  });
}

export const DrawingOverlay = memo(function DrawingOverlay({ 
  pane, 
  studyLayouts = [] 
}: { 
  pane: ChartPaneState;
  studyLayouts?: Array<{ instanceId: string; type: string; top: number; height: number }>;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const axisTagSvgRef = useRef<SVGSVGElement>(null);
  const draft = useRef<ChartPoint[]>([]);
  const draftStudyInstanceId = useRef<string | undefined>(undefined);
  const hover = useRef<ChartPoint | null>(null);
  const drag = useRef<{
    id: string;
    index: number | "body";
    start: ChartPoint;
    origin: ChartPoint[];
  } | null>(null);
  const duplicateDraft = useRef<{
    drawing: Drawing;
    originalPoints: ChartPoint[];
    startPoint: ChartPoint;
    currentPoint: ChartPoint;
    studyInstanceId: string | undefined;
  } | null>(null);
  const zoomBox = useRef<{ a: XY; b: XY } | null>(null);
  const tool = useAppStore((s) => s.drawingTool);
  const hidden = useAppStore((s) => s.drawingsHidden);
  const magnet = useAppStore((s) => s.magnet);
  const stay = useAppStore((s) => s.stayInDrawingMode);
  const addDrawing = useAppStore((s) => s.addDrawing);
  const updateDrawing = useAppStore((s) => s.updateDrawing);
  const removeDrawing = useAppStore((s) => s.removeDrawing);
  const undoDrawing = useAppStore((s) => s.undoDrawing);
  const redoDrawing = useAppStore((s) => s.redoDrawing);
  const setDrawingTool = useAppStore((s) => s.setDrawingTool);
  const setContextMenu = useAppStore((s) => s.setContextMenu);
  const setActivePane = useAppStore((s) => s.setActivePane);
  const selectedId = useAppStore((s) => s.selectedDrawingId);
  const setSelectedDrawing = useAppStore((s) => s.setSelectedDrawing);
  const setDrawingSettingsTarget = useAppStore((s) => s.setDrawingSettingsTarget);
  const setIndicatorSettingsOpen = useAppStore((s) => s.setIndicatorSettingsOpen);
  const [textEdit, setTextEdit] = useState<{ point: ChartPoint; value: string } | null>(null);
  const [selectedDrawingIds, setSelectedDrawingIds] = useState<Set<string>>(new Set());
  const ignoreClick = useRef(false);
  const lastHitClick = useRef<{ id: string; at: number } | null>(null);
  const lastIndicatorClick = useRef<{ id: string; at: number } | null>(null);
  const hoveredDrawingId = useRef<string | null>(null);
  const selectionBox = useRef<{ a: XY; b: XY } | null>(null);
  const latest = useRef({ pane, tool, hidden, selectedId, magnet, stay, studyLayouts, selectedDrawingIds });
  latest.current = { pane, tool, hidden, selectedId, magnet, stay, studyLayouts, selectedDrawingIds };

  const getPlotBounds = (w?: number, h?: number): PlotBounds => {
    const svg = svgRef.current;
    const width = w ?? svg?.clientWidth ?? 1;
    const height = h ?? svg?.clientHeight ?? 1;
    const handle = getChart(pane.id);
    let left = 0;
    let right = 0;
    if (handle) {
      right = Math.max(handle.chart.priceScale("right").width(), 0);
      try {
        left = Math.max(handle.chart.priceScale("left").width(), 0);
      } catch {
        left = 0;
      }
    }
    return plotBoundsFromScales({ width, height }, { left, right });
  };

  const getStudyInstanceIdAtY = (clientY: number): string | undefined => {
    const svg = svgRef.current;
    if (!svg || studyLayouts.length === 0) return undefined;
    const rect = svg.getBoundingClientRect();
    const y = clientY - rect.top;
    
    for (const layout of studyLayouts) {
      if (y >= layout.top && y <= layout.top + layout.height) {
        // Return a constant ID for all study panes so they share drawings
        return '__study_panes__';
      }
    }
    return undefined;
  };

  const toPoint = (clientX: number, clientY: number, opts?: { clamp?: boolean }): ChartPoint | null => {
    const handle = getChart(pane.id);
    const svg = svgRef.current;
    if (!handle || !svg) return null;
    const rect = svg.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;
    const plot = getPlotBounds(rect.width, rect.height);
    
    // Check if point is within the overall canvas bounds (including study panes)
    const fullPlot = { ...plot, top: 0, height: rect.height, bottom: rect.height };
    if (!opts?.clamp && !pointInPlot(x, y, fullPlot)) return null;
    
    if (opts?.clamp) {
      const c = clampToPlot(x, y, fullPlot);
      x = c.x;
      y = c.y;
    }
    const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    const t = coordinateToUnixTime(
      handle.chart.timeScale() as never,
      x,
      candles,
      pane.timeframe,
    );
    const price = handle.series.coordinateToPrice(y);
    if (t == null || price == null) return null;
    return snapPoint(pane.symbol, pane.timeframe, { time: t, price }, magnet);
  };

  const toXY = (clientX: number, clientY: number): XY | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const xy = (p: ChartPoint): XY | null => {
    const handle = getChart(pane.id);
    if (!handle) return null;
    const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    const x = unixTimeToCoordinate(
      handle.chart.timeScale() as never,
      p.time,
      candles,
      pane.timeframe,
    );
    const y = handle.series.priceToCoordinate(p.price);
    if (x == null || y == null) return null;
    return { x, y };
  };

  const commit = (toolId: DrawingTool, points: ChartPoint[], text?: string) => {
    if (!isPersistTool(toolId)) return;
    const next =
      toolId === "long" || toolId === "short"
        ? positionPointsFromDrag(
            points[0],
            points[1] ?? points[0],
            toolId,
            timeframeSeconds(pane.timeframe),
          )
        : points;
    addDrawing(pane.id, {
      id: uid(),
      tool: toolId,
      points: next,
      text,
      studyInstanceId: draftStudyInstanceId.current,
      color:
        toolId === "long" || toolId === "short"
          ? DEFAULT_POSITION_LINE_COLOR
          : toolId === "rect"
            ? DEFAULT_RECT_BORDER_COLOR
            : toolId === "circle"
              ? DEFAULT_CIRCLE_BORDER_COLOR
              : TV.blue,
      lineWidth: toolId === "trend" || toolId === "hray" ? 1 : 2,
      lineStyle: "solid",
      extend: "none",
      visibility: cloneVisibility(),
      ...(toolId === "long" || toolId === "short"
        ? {
            stopColor: DEFAULT_POSITION_STOP_COLOR,
            targetColor: DEFAULT_POSITION_TARGET_COLOR,
            textColor: "#ffffff",
            textSize: 11,
            compactStats: true,
            alwaysShowStats: false,
            positionStats: [...ALL_POSITION_STATS],
          }
        : {}),
      ...(toolId === "rect"
        ? {
            fillColor: DEFAULT_RECT_FILL_COLOR,
            fillVisible: true,
            middleLineColor: DEFAULT_RECT_MIDDLE_LINE_COLOR,
            middleLineStyle: "dashed" as const,
            showMiddlePoint: false,
            textColor: "#ffffff",
            textSize: 14,
            textAlignV: "top" as const,
            textAlignH: "left" as const,
          }
        : {}),
      ...(toolId === "circle"
        ? {
            fillColor: DEFAULT_CIRCLE_FILL_COLOR,
            fillVisible: false,
            textColor: "#ffffff",
            textSize: 14,
          }
        : {}),
      ...(toolId === "fib"
        ? {
            lineWidth: 1 as const,
            lineStyle: "solid" as const,
            extend: "none" as const,
            fibTrendVisible: true,
            fibTrendColor: DEFAULT_FIB_TREND_COLOR,
            fibTrendStyle: "dashed" as const,
            fibLevels: cloneFibLevels(),
            fibUseOneColor: false,
            fibOneColor: DEFAULT_FIB_ONE_COLOR,
            fibBackground: false,
            fibBackgroundOpacity: 20,
            fibReverse: true,
            fibShowPrices: false,
            fibShowLevels: true,
            fibLevelsFormat: "percents" as const,
            fibLabelH: "right" as const,
            fibLabelV: "middle" as const,
            fibShowText: false,
            fibLogScale: false,
            textSize: 14,
            textColor: "#ffffff",
          }
        : {}),
    });
    draft.current = [];
    draftStudyInstanceId.current = undefined;
    hover.current = null;
    if (!stay) setDrawingTool("cursor");
  };

  const paint = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const w = svg.clientWidth || 1;
    const h = svg.clientHeight || 1;
    const plot = getPlotBounds(w, h);
    const clipId = `maws-plot-clip-${pane.id}`;
    const tf = latest.current.pane.timeframe;
    const items = hidden
      ? []
      : latest.current.pane.drawings.filter(
          (d) => !d.hidden && isVisibleOnTimeframe(d.visibility, tf),
        );
    const previewPts = [...draft.current];
    const currentTool = latest.current.tool;
    const currentSelected = latest.current.selectedId;
    const currentHovered = hoveredDrawingId.current;
    const draggingId = drag.current?.id ?? null;

    if (currentTool !== "cursor") {
      svg.style.pointerEvents = "auto";
      svg.style.cursor = currentTool === "zoom" ? "zoom-in" : "crosshair";
      // Don't clip the entire SVG - we handle clipping per group
      svg.style.clipPath = "none";
    } else {
      svg.style.pointerEvents = "none";
      svg.style.cursor = "";
      svg.style.clipPath = "none";
    }

    const lockTime = useAppStore.getState().lockedCursorTime;
    const lockOn = useAppStore.getState().vertCursorLocked;
    if (hover.current && previewPts.length > 0 && currentTool !== "zoom") previewPts.push(hover.current);

    // Empty chart: avoid rewriting the same minimal SVG every pan frame.
    const hasContent =
      items.length > 0 ||
      previewPts.length > 0 ||
      Boolean(zoomBox.current) ||
      (lockOn && lockTime != null);
    if (!hasContent) {
      if (axisTagSvgRef.current) axisTagSvgRef.current.innerHTML = "";
      if (svg.dataset.mawsEmpty === "1") return;
      svg.dataset.mawsEmpty = "1";
      svg.innerHTML = `<defs><clipPath id="${clipId}"><rect x="${plot.left}" y="${plot.top}" width="${plot.width}" height="${plot.height}"/></clipPath></defs><g clip-path="url(#${clipId})"></g>`;
      return;
    }
    svg.dataset.mawsEmpty = "0";

    const handle = getChart(pane.id);
    const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    // Shadow outer xy — reuse one candle snapshot for the whole paint frame.
    const xy = (p: ChartPoint): XY | null => {
      if (!handle) return null;
      const x = unixTimeToCoordinate(
        handle.chart.timeScale() as never,
        p.time,
        candles,
        pane.timeframe,
      );
      const y = handle.series.priceToCoordinate(p.price);
      if (x == null || y == null) return null;
      return { x, y };
    };

    const selectPe =
      currentTool === "cursor"
        ? `pointer-events="stroke" cursor="pointer"`
        : `pointer-events="none"`;
    const fillPe =
      currentTool === "cursor"
        ? `pointer-events="fill" cursor="pointer"`
        : `pointer-events="none"`;
    
    const currentStudyLayouts = latest.current.studyLayouts;
    
    // Calculate main chart height (excludes study panes)
    let mainChartBottom = plot.bottom;
    if (currentStudyLayouts.length > 0) {
      // Find the topmost study pane
      const minStudyTop = Math.min(...currentStudyLayouts.map(l => l.top));
      mainChartBottom = minStudyTop;
    }
    const mainChartHeight = mainChartBottom - plot.top;
    
    // Create clip paths for main chart and combined study panes area
    const clipPaths: string[] = [
      `<defs>`,
      // Main chart clip - from top to first study pane (or bottom if no studies)
      `<clipPath id="${clipId}"><rect x="${plot.left}" y="${plot.top}" width="${plot.width}" height="${mainChartHeight}"/></clipPath>`,
    ];
    
    // Add single clip path for all study panes combined
    if (currentStudyLayouts.length > 0) {
      const studyClipId = `maws-study-clip-${pane.id}-__study_panes__`;
      const minStudyTop = Math.min(...currentStudyLayouts.map(l => l.top));
      const maxStudyBottom = Math.max(...currentStudyLayouts.map(l => l.top + l.height));
      const combinedStudyHeight = maxStudyBottom - minStudyTop;
      clipPaths.push(
        `<clipPath id="${studyClipId}"><rect x="${plot.left}" y="${minStudyTop}" width="${plot.width}" height="${combinedStudyHeight}"/></clipPath>`
      );
    }
    
    clipPaths.push(`</defs>`);
    
    const nodes: string[] = clipPaths;
    // Price tags drawn in the right price-scale column must bypass the plot clip-path.
    const axisTags: string[] = [];
    
    // Group drawings by their study instance ID
    const mainChartDrawings = items.filter(d => !d.studyInstanceId);
    const studyDrawingsByInstance = new Map<string, typeof items>();
    items.forEach(d => {
      if (d.studyInstanceId) {
        const list = studyDrawingsByInstance.get(d.studyInstanceId) || [];
        list.push(d);
        studyDrawingsByInstance.set(d.studyInstanceId, list);
      }
    });
    
    const hitLine = (x1: number, y1: number, x2: number, y2: number) => {
      if (currentTool !== "cursor") return;
      nodes.push(
        `<line pointer-events="stroke" cursor="pointer" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-opacity="0" stroke-width="14"/>`,
      );
    };

    const push = (
      d: Partial<Drawing> & { tool: string; points: ChartPoint[] },
    ) => {
      const color = d.color ?? TV.blue;
      const pts = d.points.map(xy).filter(Boolean) as XY[];
      const selected = d.id != null && d.id === currentSelected;
      const multiSelected = d.id != null && selectedDrawingIds.has(d.id);
      const interactive =
        selected || multiSelected || (d.id != null && (d.id === currentHovered || d.id === draggingId));
      const baseW = d.lineWidth ?? 1.5;
      const sw = selected || multiSelected ? Math.max(baseW + 0.75, 2.25) : baseW;
      const strokeColor = color;
      const dash = strokeDashAttr(d.lineStyle);

      if (d.tool === "trend" && pts.length >= 2) {
        const [e0, e1] = extendSegment(pts[0], pts[1], d.extend);
        hitLine(pts[0].x, pts[0].y, pts[1].x, pts[1].y);
        nodes.push(
          `<line ${selectPe} x1="${e0.x}" y1="${e0.y}" x2="${e1.x}" y2="${e1.y}" stroke="${strokeColor}" stroke-width="${sw}"${dash}/>`,
        );
        if (d.showMiddlePoint) {
          const mx = (pts[0].x + pts[1].x) / 2;
          const my = (pts[0].y + pts[1].y) / 2;
          nodes.push(
            `<circle cx="${mx}" cy="${my}" r="3.5" fill="#000" stroke="${color}" stroke-width="1.5"/>`,
          );
        }
        if (d.showPriceLabels) {
          for (const [pt, xyPt] of [
            [d.points[0], pts[0]],
            [d.points[1], pts[1]],
          ] as const) {
            nodes.push(
              `<text pointer-events="none" x="${xyPt.x + 6}" y="${xyPt.y - 6}" fill="${color}" font-size="10" font-family="Trebuchet MS">${escapeXml(formatPrice(pane.symbol, pt.price))}</text>`,
            );
          }
        }
        if (d.text) {
          const mx = (pts[0].x + pts[1].x) / 2;
          const my = (pts[0].y + pts[1].y) / 2;
          const fw = d.textBold ? "bold" : "normal";
          const fs = d.textItalic ? "italic" : "normal";
          const fill = d.textColor ?? "#d1d4dc";
          nodes.push(
            `<text pointer-events="none" x="${mx}" y="${my - 8}" fill="${fill}" font-size="${d.textSize ?? 14}" font-weight="${fw}" font-style="${fs}" font-family="Trebuchet MS" text-anchor="middle">${escapeXml(d.text)}</text>`,
          );
        }
      } else if (d.tool === "trend" && pts.length === 1) {
        nodes.push(
          `<circle cx="${pts[0].x}" cy="${pts[0].y}" r="3.5" fill="#000" stroke="${color}" stroke-width="1.5"/>`,
        );
      } else if (d.tool === "hray" && (pts[0] || d.points[0])) {
        const p = pts[0] ?? xy(d.points[0]);
        if (!p) return;
        hitLine(p.x, p.y, plot.right, p.y);
        // Text geometry first: the ray stops short of the text so the line
        // never runs underneath the writing.
        const textNodes: string[] = [];
        let lineEnd = plot.right;
        if (d.text?.trim()) {
          const fontSize = d.textSize ?? 14;
          const lines = d.text.split("\n");
          const lineH = fontSize * 1.25;
          const blockH = lines.length * lineH;
          const tx = plot.right - 6;
          const ty = p.y - blockH / 2 + fontSize;
          const fw = d.textBold ? "bold" : "normal";
          const fs = d.textItalic ? "italic" : "normal";
          const fillText = d.textColor ?? "#ffffff";
          const widest = lines.reduce((m, l) => Math.max(m, l.length), 0);
          lineEnd = Math.max(p.x, tx - widest * fontSize * 0.62 - 6);
          for (let i = 0; i < lines.length; i++) {
            textNodes.push(
              `<text pointer-events="none" x="${tx}" y="${ty + i * lineH}" fill="${fillText}" font-size="${fontSize}" font-weight="${fw}" font-style="${fs}" font-family="Trebuchet MS" text-anchor="end">${escapeXml(lines[i])}</text>`,
            );
          }
        }
        if (lineEnd > p.x) {
          nodes.push(
            `<line ${selectPe} x1="${p.x}" y1="${p.y}" x2="${lineEnd}" y2="${p.y}" stroke="${strokeColor}" stroke-width="${sw}"${dash}/>`,
          );
        }
        // Inline price label along the ray, matching the trend tool's "Price labels".
        if (d.showPriceLabels) {
          nodes.push(
            `<text pointer-events="none" x="${p.x + 6}" y="${p.y - 6}" fill="${color}" font-size="10" font-family="Trebuchet MS">${escapeXml(formatPrice(pane.symbol, d.points[0].price))}</text>`,
          );
        }
        // Filled price tag on the right scale marks the ray's price, like TradingView.
        // Opaque and painted above the chart canvas, so axis prices hide behind it.
        const scaleFont = useAppStore.getState().chartSettings.scaleFontSize || 12;
        const tagH = scaleFont + 7;
        const tagY = Math.max(0, Math.min(h - tagH, p.y - tagH / 2));
        // LWC right-scale price labels are left-aligned at plot.right + tick + a small gap;
        // start the tag text at the same x so it sits in the same column.
        const tickLen = 5;
        const labelX = plot.right + tickLen + 2;
        axisTags.push(
          `<rect pointer-events="none" x="${plot.right}" y="${tagY}" width="${Math.max(0, w - plot.right)}" height="${tagH}" fill="${applyColorOpacity(strokeColor, 100)}"/>`,
          `<text pointer-events="none" x="${labelX}" y="${tagY + tagH / 2}" fill="#ffffff" font-size="${scaleFont}" font-family="Trebuchet MS" text-anchor="start" dominant-baseline="central">${escapeXml(formatPrice(pane.symbol, d.points[0].price))}</text>`,
        );
        // Custom text sits at the ray's right end, vertically centred on the line.
        for (const tn of textNodes) nodes.push(tn);
      } else if (d.tool === "path" && pts.length >= 2) {
        for (let i = 1; i < pts.length; i++) hitLine(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
        nodes.push(
          `<polyline ${selectPe} fill="none" stroke="${strokeColor}" stroke-width="${sw}"${dash} points="${pts.map((p) => `${p.x},${p.y}`).join(" ")}"/>`,
        );
      } else if (d.tool === "dcurve" && pts.length >= 3) {
        const { c1, c2 } = cubicControls(pts[0], pts[1], pts[2]);
        const samples = sampleCubic(pts[0], c1, c2, pts[2]);
        for (let i = 1; i < samples.length; i++) hitLine(samples[i - 1].x, samples[i - 1].y, samples[i].x, samples[i].y);
        nodes.push(
          `<path ${selectPe} d="M ${pts[0].x} ${pts[0].y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${pts[2].x} ${pts[2].y}" fill="none" stroke="${strokeColor}" stroke-width="${sw}"${dash}/>`,
        );
      } else if (d.tool === "dcurve" && pts.length === 2) {
        nodes.push(
          `<line x1="${pts[0].x}" y1="${pts[0].y}" x2="${pts[1].x}" y2="${pts[1].y}" stroke="${color}" stroke-width="1" stroke-dasharray="4 3"/>`,
        );
      } else if (d.tool === "rect" && pts.length >= 2) {
        const box = rectScreenBox(pts, d.extend, plot);
        const { x, y, w: rw, h: rh, x2, y2 } = box;
        hitLine(x, y, x2, y);
        hitLine(x, y2, x2, y2);
        hitLine(x, y, x, y2);
        hitLine(x2, y, x2, y2);
        const fill =
          d.fillVisible === false ? "none" : (d.fillColor ?? DEFAULT_RECT_FILL_COLOR);
        nodes.push(
          `<rect ${fillPe} x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${fill}" stroke="${strokeColor}" stroke-width="${sw}"${dash}/>`,
        );
        if (d.showMiddlePoint) {
          const midY = (y + y2) / 2;
          const midColor = d.middleLineColor ?? DEFAULT_RECT_MIDDLE_LINE_COLOR;
          const midDash = strokeDashAttr(d.middleLineStyle ?? "dashed");
          nodes.push(
            `<line pointer-events="none" x1="${x}" y1="${midY}" x2="${x2}" y2="${midY}" stroke="${midColor}" stroke-width="1.25"${midDash}/>`,
          );
        }
        if (d.text?.trim()) {
          const pad = 6;
          const fontSize = d.textSize ?? 14;
          const lines = d.text.split("\n");
          const lineH = fontSize * 1.25;
          const blockH = lines.length * lineH;
          const alignH = d.textAlignH ?? "left";
          const alignV = d.textAlignV ?? "top";
          let tx = x + pad;
          let anchor = "start";
          if (alignH === "center") {
            tx = x + rw / 2;
            anchor = "middle";
          } else if (alignH === "right") {
            tx = x2 - pad;
            anchor = "end";
          }
          let ty: number;
          if (alignV === "bottom") ty = y2 - pad - blockH + fontSize;
          else if (alignV === "middle") ty = y + rh / 2 - blockH / 2 + fontSize;
          else ty = y + pad + fontSize;
          const fw = d.textBold ? "bold" : "normal";
          const fs = d.textItalic ? "italic" : "normal";
          const fillText = d.textColor ?? "#ffffff";
          for (let i = 0; i < lines.length; i++) {
            nodes.push(
              `<text pointer-events="none" x="${tx}" y="${ty + i * lineH}" fill="${fillText}" font-size="${fontSize}" font-weight="${fw}" font-style="${fs}" font-family="Trebuchet MS" text-anchor="${anchor}">${escapeXml(lines[i])}</text>`,
            );
          }
        }
        if (interactive && d.points.length >= 2) {
          const handles = rectHandles(d.points);
          if (handles) {
            for (let i = 0; i < handles.length; i++) {
              const h = xy(handles[i]);
              if (!h) continue;
              nodes.push(
                `<circle pointer-events="all" cursor="${RECT_HANDLE_CURSOR[i]}" cx="${h.x}" cy="${h.y}" r="4.5" fill="#000" stroke="#2962ff" stroke-width="1.5"/>`,
              );
            }
          }
        }
      } else if (d.tool === "circle" && pts.length >= 2) {
        const r = dist(pts[0], pts[1]);
        const fill =
          d.fillVisible === true
            ? (d.fillColor ?? DEFAULT_CIRCLE_FILL_COLOR)
            : "none";
        if (currentTool === "cursor") {
          nodes.push(
            `<circle pointer-events="stroke" cursor="pointer" cx="${pts[0].x}" cy="${pts[0].y}" r="${r}" fill="none" stroke="#fff" stroke-opacity="0" stroke-width="14"/>`,
          );
          if (d.fillVisible) {
            nodes.push(
              `<circle ${fillPe} cx="${pts[0].x}" cy="${pts[0].y}" r="${r}" fill="#fff" fill-opacity="0" stroke="none"/>`,
            );
          }
        }
        nodes.push(
          `<circle ${selectPe} cx="${pts[0].x}" cy="${pts[0].y}" r="${r}" fill="${fill}" stroke="${strokeColor}" stroke-width="${sw}"${dash}/>`,
        );
        if (d.text?.trim()) {
          const fontSize = d.textSize ?? 14;
          const lines = d.text.split("\n");
          const lineH = fontSize * 1.25;
          const blockH = lines.length * lineH;
          const ty = pts[0].y - blockH / 2 + fontSize;
          const fw = d.textBold ? "bold" : "normal";
          const fs = d.textItalic ? "italic" : "normal";
          const fillText = d.textColor ?? "#ffffff";
          for (let i = 0; i < lines.length; i++) {
            nodes.push(
              `<text pointer-events="none" x="${pts[0].x}" y="${ty + i * lineH}" fill="${fillText}" font-size="${fontSize}" font-weight="${fw}" font-style="${fs}" font-family="Trebuchet MS" text-anchor="middle">${escapeXml(lines[i])}</text>`,
            );
          }
        }
      } else if (d.tool === "fib" && d.points.length >= 2) {
        const a = d.points[0];
        const b = d.points[1];
        const pa = xy(a);
        const pb = xy(b);
        const xa = pa?.x ?? 0;
        const xb = pb?.x ?? plot.right;
        const boxLeft = Math.min(xa, xb);
        const boxRight = Math.max(xa, xb);
        const ext = d.extend ?? "none";
        let xL = boxLeft;
        let xR = boxRight;
        if (ext === "left" || ext === "both") xL = plot.left;
        if (ext === "right" || ext === "both") xR = plot.right;
        if (ext === "none" && xR - xL < 40) xR = xL + 80;
        const levels = resolveFibLevels(d).filter((l) => l.visible);
        const sorted = [...levels].sort((u, v) => u.level - v.level);
        const levelW = d.lineWidth ?? 1;
        const levelDash = strokeDashAttr(d.lineStyle);
        const fontSize = d.textSize ?? 14;
        const labelH = d.fibLabelH ?? "right";
        const labelV = d.fibLabelV ?? "middle";
        const showLevels = d.fibShowLevels ?? true;
        const showPrices = Boolean(d.fibShowPrices);
        const fmt = d.fibLevelsFormat ?? "percents";
        const bgOn = Boolean(d.fibBackground);
        const bgOpacity = (d.fibBackgroundOpacity ?? 20) / 100;
        const reverse = d.fibReverse !== undefined ? Boolean(d.fibReverse) : true;
        const logScale = Boolean(d.fibLogScale);

        if ((d.fibTrendVisible ?? true) && pa && pb) {
          const trendDash = strokeDashAttr(d.fibTrendStyle ?? "dashed");
          const trendColor = d.fibTrendColor ?? DEFAULT_FIB_TREND_COLOR;
          hitLine(pa.x, pa.y, pb.x, pb.y);
          nodes.push(
            `<line ${selectPe} x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" stroke="${trendColor}" stroke-width="${Math.max(1, levelW)}"${trendDash}/>`,
          );
        }

        // Golden ratio fill (61.8% to 65.0%)
        const f618 = resolveFibLevels(d).find((l) => Math.abs(l.level - 0.618) < 1e-4);
        if (f618 && f618.visible) {
          const price618 = fibLevelPrice(a.price, b.price, 0.618, reverse, logScale);
          const price65 = fibLevelPrice(a.price, b.price, 0.65, reverse, logScale);
          const y618 = xy({ time: a.time, price: price618 })?.y;
          const y65 = xy({ time: a.time, price: price65 })?.y;
          if (y618 != null && y65 != null) {
            const top = Math.min(y618, y65);
            nodes.push(
              `<rect pointer-events="none" x="${xL}" y="${top}" width="${Math.max(0, xR - xL)}" height="${Math.abs(y65 - y618)}" fill="${f618.color}" fill-opacity="${bgOpacity}"/>`,
            );
          }
        }

        for (let i = 0; i < sorted.length; i++) {
          const f = sorted[i];
          const price = fibLevelPrice(a.price, b.price, f.level, reverse, logScale);
          const y = xy({ time: a.time, price })?.y;
          if (y == null) continue;
          const next = sorted[i + 1];
          if (bgOn && next) {
            const nPrice = fibLevelPrice(a.price, b.price, next.level, reverse, logScale);
            const ny = xy({ time: a.time, price: nPrice })?.y;
            if (ny != null) {
              const top = Math.min(y, ny);
              nodes.push(
                `<rect pointer-events="none" x="${xL}" y="${top}" width="${Math.max(0, xR - xL)}" height="${Math.abs(ny - y)}" fill="${f.color}" fill-opacity="${bgOpacity}"/>`,
              );
            }
          }
          hitLine(xL, y, xR, y);
          nodes.push(
            `<line ${selectPe} x1="${xL}" x2="${xR}" y1="${y}" y2="${y}" stroke="${f.color}" stroke-width="${levelW}"${levelDash}/>`,
          );

          if (showLevels || showPrices) {
            const parts: string[] = [];
            if (showLevels) {
              parts.push(
                fmt === "percents"
                  ? `${(f.level * 100).toFixed(f.level % 1 === 0 ? 0 : 1)}%`
                  : f.level.toFixed(3),
              );
            }
            if (showPrices) parts.push(formatPrice(pane.symbol, price));
            const label = parts.join("  ");
            let tx = xR - 4;
            let anchor = "end";
            if (labelH === "right") {
              if (xR === plot.right) {
                tx = xR - 6;
                anchor = "end";
              } else {
                tx = xR + 6;
                anchor = "start";
              }
            } else if (labelH === "left") {
              if (xL === plot.left) {
                tx = xL + 6;
                anchor = "start";
              } else {
                tx = xL - 6;
                anchor = "end";
              }
            } else if (labelH === "center") {
              tx = (xL + xR) / 2;
              anchor = "middle";
            }
            let ty = y + 4;
            if (labelV === "top") ty = y - 4;
            else if (labelV === "middle") ty = y + fontSize * 0.35;
            const baseline =
              labelV === "top"
                ? "text-after-edge"
                : labelV === "bottom"
                  ? "text-before-edge"
                  : "alphabetic";
            nodes.push(
              `<text pointer-events="none" x="${tx}" y="${ty}" fill="${f.color}" font-size="${fontSize}" font-family="Trebuchet MS" text-anchor="${anchor}" dominant-baseline="${baseline}">${escapeXml(label)}</text>`,
            );
          }
        }

        if (d.fibShowText && d.text?.trim() && pa && pb) {
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          const alignH = d.textAlignH ?? "center";
          const alignV = d.textAlignV ?? "middle";
          let tx = mx;
          let anchor = "middle";
          if (alignH === "left") {
            tx = Math.min(pa.x, pb.x) + 4;
            anchor = "start";
          } else if (alignH === "right") {
            tx = Math.max(pa.x, pb.x) - 4;
            anchor = "end";
          }
          let ty = my;
          if (alignV === "top") ty = Math.min(pa.y, pb.y) + fontSize;
          else if (alignV === "bottom") ty = Math.max(pa.y, pb.y) - 4;
          nodes.push(
            `<text pointer-events="none" x="${tx}" y="${ty}" fill="${d.textColor ?? "#ffffff"}" font-size="${fontSize}" font-family="Trebuchet MS" text-anchor="${anchor}">${escapeXml(d.text)}</text>`,
          );
        }
      } else if ((d.tool === "long" || d.tool === "short") && d.points.length >= 2) {
        const anchors = positionAnchors(d.points);
        if (!anchors) return;
        const pE = xy(anchors.entry);
        const pT = xy(anchors.target);
        const pS = xy(anchors.stop);
        if (!pE || !pT || !pS) return;
        const x0raw = Math.min(pE.x, pT.x);
        const x1raw = Math.max(pE.x, pT.x);
        // Clamp the zone width to the plot area. A tool anchored at the live
        // tip (or dragged past the last bar) can resolve its right edge far
        // beyond the series; unclamped, the TP/SL fills paint one wide shaded
        // rectangle over every candle to the right of the entry.
        const x0 = Math.max(plot.left, x0raw);
        const x1 = Math.min(plot.right, x1raw);
        const bw = Math.max(0, x1 - x0);
        const yE = pE.y;
        const yT = pT.y;
        const yS = pS.y;
        const tpH = Math.abs(yT - yE);
        const slH = Math.abs(yS - yE);
        const lineColor = multiSelected && !selected ? "#39eb93" : (d.color || DEFAULT_POSITION_LINE_COLOR);
        const stopFill = d.stopColor || DEFAULT_POSITION_STOP_COLOR;
        const targetFill = d.targetColor || DEFAULT_POSITION_TARGET_COLOR;
        const lineW = d.lineWidth ?? 1;
        if (bw > 0) {
          hitLine(x0, Math.min(yE, yT), x1, Math.min(yE, yT));
          hitLine(x0, Math.max(yE, yT), x1, Math.max(yE, yT));
          hitLine(x0, Math.min(yE, yS), x1, Math.min(yE, yS));
          hitLine(x0, Math.max(yE, yS), x1, Math.max(yE, yS));
          hitLine(x0, yE, x1, yE);
          nodes.push(
            `<rect ${fillPe} x="${x0}" y="${Math.min(yE, yT)}" width="${bw}" height="${tpH}" fill="${targetFill}" stroke="none"/>
             <rect ${fillPe} x="${x0}" y="${Math.min(yE, yS)}" width="${bw}" height="${slH}" fill="${stopFill}" stroke="none"/>
             <line pointer-events="none" x1="${x0}" x2="${x1}" y1="${yE}" y2="${yE}" stroke="#808080" stroke-width="1"/>`,
          );
        }
        // Dashed P&L:
        // Open → tip on the current candle @ LastPrice (tracks price, not the box's right edge).
        // Closed → tip on the exit candle inside the box @ TP or SL price.
        // Only show if the position is started from an actual candle body or wick
        {
          const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
          
          // Check if the entry point is actually on a candle (not just within time range)
          const entryTime = anchors.entry.time;
          const entryPrice = anchors.entry.price;
          
          // Find if there's a candle at the entry time
          const candleAtEntry = candles.find(
            (c) => Math.abs(c.time - entryTime) < 1 ||
              Math.abs(c.time - entryTime / 1000) < 1,
          );
          
          // Check if the entry price is within the candle's range (body or wick)
          const isOnCandle = candleAtEntry && 
            entryPrice >= candleAtEntry.low && 
            entryPrice <= candleAtEntry.high;
          
          if (isOnCandle) {
            const quoteLast = mawsFeed.getQuote(pane.symbol).last;
            const livePrice =
              Number.isFinite(quoteLast) && quoteLast > 0 ? quoteLast : null;
            const tip =
              d.tool === "long" || d.tool === "short"
                ? resolvePositionPnlTip(
                    d.tool,
                    anchors.entry.time,
                    anchors.target.time,
                    anchors.target.price,
                    anchors.stop.price,
                    candles,
                    livePrice,
                  )
                : null;

            let tipX: number | null = null;
            let tipY: number | null = null;
            if (tip) {
              const at = xy({ time: tip.time, price: tip.price });
              if (at) {
                tipX = Math.min(Math.max(at.x, x0), x1);
                tipY = at.y;
              } else if (tip.exit == null) {
                tipY = getChart(pane.id)?.series.priceToCoordinate(tip.price) ?? null;
                const atLast = candles.length
                  ? xy({ time: candles[candles.length - 1].time, price: tip.price })
                  : null;
                tipX = atLast ? Math.min(Math.max(atLast.x, x0), x1) : null;
              }
            }

            if (tip != null && tipX != null && tipY != null && Number.isFinite(tipY)) {
              nodes.push(
                `<line pointer-events="none" x1="${pE.x}" y1="${pE.y}" x2="${tipX}" y2="${tipY}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="7 5"/>`,
              );
              if (tip.exit === "tp") {
                nodes.push(
                  `<circle pointer-events="none" cx="${tipX}" cy="${tipY}" r="4" fill="#089981" stroke="#0b0e11" stroke-width="1"/>`,
                );
              } else if (tip.exit === "sl") {
                nodes.push(
                  `<circle pointer-events="none" cx="${tipX}" cy="${tipY}" r="4" fill="#f23645" stroke="#0b0e11" stroke-width="1"/>`,
                );
              }
            }
          }
        }
        if (interactive) {
          const handles = positionHandles(d.points);
          if (handles) {
            handles.forEach((hp, hi) => {
              const h = xy(hp);
              if (!h) return;
              const cursor = POSITION_HANDLE_CURSOR[hi] ?? "ns-resize";
              nodes.push(
                `<rect pointer-events="all" cursor="${cursor}" x="${h.x - 4}" y="${h.y - 4}" width="8" height="8" rx="1.5" fill="#8bb8ff" stroke="#131722" stroke-width="1.25"/>`,
              );
            });
          }
        }
      } else if (d.tool === "arrowUp" && pts[0]) {
        nodes.push(`<path ${fillPe} d="${arrowPath(pts[0], true)}" fill="#089981" stroke="#089981"/>`);
      } else if (d.tool === "arrowDown" && pts[0]) {
        nodes.push(`<path ${fillPe} d="${arrowPath(pts[0], false)}" fill="#f23645" stroke="#f23645"/>`);
      } else if (d.tool === "text" && pts[0]) {
        const fw = d.textBold ? "bold" : "normal";
        const fs = d.textItalic ? "italic" : "normal";
        const fill = d.textColor ?? "#d1d4dc";
        nodes.push(
          `<text ${fillPe} x="${pts[0].x}" y="${pts[0].y}" fill="${fill}" font-size="${d.textSize ?? 13}" font-weight="${fw}" font-style="${fs}" font-family="Trebuchet MS">${escapeXml(d.text ?? "")}</text>`,
        );
      }

      if (interactive && d.tool !== "long" && d.tool !== "short" && d.tool !== "rect") {
        for (const p of pts) {
          nodes.push(
            `<circle pointer-events="all" cursor="grab" cx="${p.x}" cy="${p.y}" r="5" fill="#000" stroke="#2962ff" stroke-width="1.5"/>`,
          );
        }
      }
    };

    // Render main chart drawings (those without studyInstanceId)
    nodes.push(`<g clip-path="url(#${clipId})">`);
    for (const d of mainChartDrawings) push(d);
    
    // Render duplicate drawing if in duplicate mode
    if (duplicateDraft.current && !duplicateDraft.current.studyInstanceId) {
      push(duplicateDraft.current.drawing);
    }
    
    // Render draft drawing in appropriate pane
    if (previewPts.length && currentTool !== "cursor" && currentTool !== "zoom") {
      const draftPoints =
        (currentTool === "long" || currentTool === "short") && previewPts.length >= 2
          ? positionPointsFromDrag(
              previewPts[0],
              previewPts[1],
              currentTool,
              timeframeSeconds(tf),
            )
          : previewPts;
      
      // Only render draft here if it's for main chart
      if (!draftStudyInstanceId.current) {
        push({ tool: currentTool, points: draftPoints, id: "draft", studyInstanceId: draftStudyInstanceId.current });
      }
    }
    
    nodes.push(`</g>`);
    
    // Render study pane drawings (all in one combined clip area)
    if (studyDrawingsByInstance.size > 0) {
      const studyClipId = `maws-study-clip-${pane.id}-__study_panes__`;
      nodes.push(`<g clip-path="url(#${studyClipId})">`);
      
      // Render all study drawings together
      studyDrawingsByInstance.forEach((drawingList) => {
        for (const d of drawingList) push(d);
      });
      
      // Render duplicate drawing if in duplicate mode for study panes
      if (duplicateDraft.current && duplicateDraft.current.studyInstanceId === '__study_panes__') {
        push(duplicateDraft.current.drawing);
      }
      
      // Render draft if it belongs to study panes
      if (previewPts.length && currentTool !== "cursor" && currentTool !== "zoom" && draftStudyInstanceId.current === '__study_panes__') {
        const draftPoints =
          (currentTool === "long" || currentTool === "short") && previewPts.length >= 2
            ? positionPointsFromDrag(
                previewPts[0],
                previewPts[1],
                currentTool,
                timeframeSeconds(tf),
              )
            : previewPts;
        push({ tool: currentTool, points: draftPoints, id: "draft", studyInstanceId: draftStudyInstanceId.current });
      }
      
      nodes.push(`</g>`);
    }
    
    // If draft is for study panes but no study drawings exist yet, render it separately
    if (previewPts.length && currentTool !== "cursor" && currentTool !== "zoom" && draftStudyInstanceId.current === '__study_panes__' && studyDrawingsByInstance.size === 0) {
      const studyClipId = `maws-study-clip-${pane.id}-__study_panes__`;
      nodes.push(`<g clip-path="url(#${studyClipId})">`);
      const draftPoints =
        (currentTool === "long" || currentTool === "short") && previewPts.length >= 2
          ? positionPointsFromDrag(
              previewPts[0],
              previewPts[1],
              currentTool,
              timeframeSeconds(tf),
            )
          : previewPts;
      push({ tool: currentTool, points: draftPoints, id: "draft", studyInstanceId: draftStudyInstanceId.current });
      nodes.push(`</g>`);
    }
    
    // Render UI elements without clipping (zoom box, locked cursor line)
    nodes.push(`<g>`);
    if (zoomBox.current) {
      const { a, b } = zoomBox.current;
      const x = Math.min(a.x, b.x);
      const y = Math.min(a.y, b.y);
      nodes.push(
        `<rect x="${x}" y="${y}" width="${Math.abs(b.x - a.x)}" height="${Math.abs(b.y - a.y)}" fill="rgba(41,98,255,0.12)" stroke="#2962ff" stroke-dasharray="4 3"/>`,
      );
    }
    if (selectionBox.current) {
      const { a, b } = selectionBox.current;
      const x = Math.min(a.x, b.x);
      const y = Math.min(a.y, b.y);
      nodes.push(
        `<rect x="${x}" y="${y}" width="${Math.abs(b.x - a.x)}" height="${Math.abs(b.y - a.y)}" fill="rgba(90,159,212,0.1)" stroke="#5a9fd4" stroke-dasharray="4 3" stroke-width="1.5"/>`,
      );
    }
    if (lockOn && lockTime != null) {
      const handle = getChart(pane.id);
      const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
      const x = handle
        ? unixTimeToCoordinate(handle.chart.timeScale() as never, lockTime, candles, pane.timeframe)
        : null;
      if (x != null) {
        nodes.push(
          `<line pointer-events="none" x1="${x}" y1="${plot.top}" x2="${x}" y2="${plot.bottom}" stroke="#758696" stroke-width="1" stroke-dasharray="4 3"/>`,
        );
      }
    }
    nodes.push(`</g>`);
    svg.innerHTML = nodes.join("");
    if (axisTagSvgRef.current) axisTagSvgRef.current.innerHTML = axisTags.join("");
  };

  const paintRef = useRef(paint);
  paintRef.current = paint;

  useEffect(() => {
    return attachChartLinkedPaint({
      paneId: pane.id,
      getChart,
      paint: () => paintRef.current(),
      observeEl: svgRef.current,
    });
  }, [pane.id, pane.symbol, pane.timeframe, hidden, tool, selectedId]);

  useEffect(() => {
    paintRef.current();
  }, [pane.drawings, hidden, tool, selectedId]);

  // Repaint long/short tip lines on every bar/quote tick.
  const positionDrawingCount = pane.drawings.filter(
    (d) => !d.hidden && (d.tool === "long" || d.tool === "short"),
  ).length;
  useEffect(() => {
    if (hidden || positionDrawingCount === 0) return;

    let raf = 0;
    const syncHitsAndPaint = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        paintRef.current();
      });
    };

    syncHitsAndPaint();
    const unsubBars = mawsFeed.subscribe(pane.symbol, pane.timeframe, syncHitsAndPaint);
    const unsubQuotes = mawsFeed.subscribeQuotes(() => syncHitsAndPaint());
    return () => {
      unsubBars();
      unsubQuotes();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pane.id, pane.symbol, pane.timeframe, hidden, positionDrawingCount]);

  useEffect(() => {
    draft.current = [];
    draftStudyInstanceId.current = undefined;
    hover.current = null;
    drag.current = null;
    zoomBox.current = null;
    ignoreClick.current = false;
    hoveredDrawingId.current = null;
    setTextEdit(null);
  }, [tool]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undoDrawing();
        return;
      }
      
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z") || (e.ctrlKey && e.shiftKey && e.key === "Z")) {
        e.preventDefault();
        redoDrawing();
        return;
      }
      
      if (e.key === "Enter" && tool === "path" && draft.current.length >= 2) {
        commit("path", draft.current);
        paint();
      }
      if (e.key === "Escape") {
        if (draft.current.length || zoomBox.current) {
          draft.current = [];
          draftStudyInstanceId.current = undefined;
          hover.current = null;
          zoomBox.current = null;
          setTextEdit(null);
          paint();
          return;
        }
        if (tool !== "cursor") setDrawingTool("cursor");
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        // Delete multi-selected drawings first
        if (latest.current.selectedDrawingIds.size > 0) {
          for (const id of latest.current.selectedDrawingIds) {
            const ownsDrawing = latest.current.pane.drawings.some((d) => d.id === id);
            if (ownsDrawing) {
              removeDrawing(pane.id, id);
            }
          }
          setSelectedDrawingIds(new Set());
          setSelectedDrawing(null);
          hoveredDrawingId.current = null;
          paint();
          return;
        }
        // Fall back to single selection delete
        const targetId = selectedId || hoveredDrawingId.current;
        if (targetId) {
          const ownsDrawing = latest.current.pane.drawings.some((d) => d.id === targetId);
          if (ownsDrawing) {
            removeDrawing(pane.id, targetId);
            setSelectedDrawing(null);
            hoveredDrawingId.current = null;
            paint();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // commit and paint are stable imperative helpers for this listener.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, selectedId, pane.id, removeDrawing, undoDrawing, redoDrawing, setDrawingTool, setSelectedDrawingIds, setSelectedDrawing]);

  const hitTest = (p: XY): { id: string; index: number | "body" } | null => {
    const plot = getPlotBounds();
    if (!pointInPlot(p.x, p.y, plot)) return null;
    const drawings = pane.drawings.filter(
      (d) => !d.hidden && isVisibleOnTimeframe(d.visibility, pane.timeframe),
    );
    const EDGE = 10;
    const HANDLE = 12;

    const hitHandles = (d: Drawing): { id: string; index: number | "body" } | null => {
      if (d.hidden) return null;
      if (d.tool === "long" || d.tool === "short") {
        if (
          latest.current.selectedId !== d.id &&
          hoveredDrawingId.current !== d.id &&
          drag.current?.id !== d.id
        ) {
          return null;
        }
        const handles = positionHandles(d.points);
        if (!handles) return null;
        for (let i = 0; i < handles.length; i++) {
          const h = xy(handles[i]);
          if (h && dist(p, h) <= HANDLE) return { id: d.id, index: i };
        }
        return null;
      }
      if (d.tool === "rect" && d.points.length >= 2) {
        const handles = rectHandles(d.points);
        if (!handles) return null;
        for (let i = 0; i < handles.length; i++) {
          const h = xy(handles[i]);
          if (h && dist(p, h) <= HANDLE) return { id: d.id, index: i };
        }
        return null;
      }
      const pts = d.points.map(xy).filter(Boolean) as XY[];
      for (let n = 0; n < pts.length; n++) {
        if (dist(p, pts[n]) <= HANDLE) return { id: d.id, index: n };
      }
      return null;
    };

    const hitEdge = (d: Drawing): { id: string; index: number | "body" } | null => {
      if (d.hidden) return null;
      if (d.tool === "long" || d.tool === "short") {
        const anchors = positionAnchors(d.points);
        const pE = anchors ? xy(anchors.entry) : null;
        const pT = anchors ? xy(anchors.target) : null;
        const pS = anchors ? xy(anchors.stop) : null;
        if (!pE || !pT || !pS) return null;
        const x0 = Math.min(pE.x, pT.x);
        const x1 = Math.max(pE.x, pT.x);
        const edges: [XY, XY][] = [
          [
            { x: x0, y: Math.min(pE.y, pT.y) },
            { x: x1, y: Math.min(pE.y, pT.y) },
          ],
          [
            { x: x0, y: Math.max(pE.y, pT.y) },
            { x: x1, y: Math.max(pE.y, pT.y) },
          ],
          [
            { x: x0, y: Math.min(pE.y, pS.y) },
            { x: x1, y: Math.min(pE.y, pS.y) },
          ],
          [
            { x: x0, y: Math.max(pE.y, pS.y) },
            { x: x1, y: Math.max(pE.y, pS.y) },
          ],
          [
            { x: x0, y: Math.min(pE.y, pT.y, pS.y) },
            { x: x0, y: Math.max(pE.y, pT.y, pS.y) },
          ],
          [
            { x: x1, y: Math.min(pE.y, pT.y, pS.y) },
            { x: x1, y: Math.max(pE.y, pT.y, pS.y) },
          ],
          [
            { x: x0, y: pE.y },
            { x: x1, y: pE.y },
          ],
        ];
        for (const [a, b] of edges) {
          if (distToSeg(p, a, b) < EDGE) return { id: d.id, index: "body" };
        }
        return null;
      }
      const pts = d.points.map(xy).filter(Boolean) as XY[];
      if (d.tool === "trend" && pts.length >= 2 && distToSeg(p, pts[0], pts[1]) < EDGE)
        return { id: d.id, index: "body" };
      if (d.tool === "hray" && pts[0] && Math.abs(p.y - pts[0].y) < EDGE && p.x >= pts[0].x - 8)
        return { id: d.id, index: "body" };
      if (d.tool === "path" && pts.length >= 2) {
        for (let n = 1; n < pts.length; n++) {
          if (distToSeg(p, pts[n - 1], pts[n]) < EDGE) return { id: d.id, index: "body" };
        }
      }
      if (d.tool === "dcurve" && pts.length >= 3) {
        const { c1, c2 } = cubicControls(pts[0], pts[1], pts[2]);
        const samples = sampleCubic(pts[0], c1, c2, pts[2]);
        for (let n = 1; n < samples.length; n++) {
          if (distToSeg(p, samples[n - 1], samples[n]) < EDGE) return { id: d.id, index: "body" };
        }
      }
      if (d.tool === "rect" && pts.length >= 2) {
        const box = rectScreenBox(pts, d.extend, plot);
        const onEdge =
          ((Math.abs(p.x - box.x) < EDGE || Math.abs(p.x - box.x2) < EDGE) &&
            p.y >= box.y - 2 &&
            p.y <= box.y2 + 2) ||
          ((Math.abs(p.y - box.y) < EDGE || Math.abs(p.y - box.y2) < EDGE) &&
            p.x >= box.x - 2 &&
            p.x <= box.x2 + 2);
        if (onEdge) return { id: d.id, index: "body" };
      }
      if (d.tool === "circle" && pts.length >= 2) {
        const r = dist(pts[0], pts[1]);
        if (Math.abs(dist(p, pts[0]) - r) < EDGE) return { id: d.id, index: "body" };
      }
      if ((d.tool === "arrowUp" || d.tool === "arrowDown" || d.tool === "text") && pts[0] && dist(p, pts[0]) < 18)
        return { id: d.id, index: 0 };
      if (d.tool === "fib" && d.points.length >= 2 && pts.length >= 2) {
        const boxLeft = Math.min(pts[0].x, pts[1].x);
        const boxRight = Math.max(pts[0].x, pts[1].x);
        const ext = d.extend ?? "none";
        let xL = boxLeft;
        let xR = boxRight;
        if (ext === "left" || ext === "both") xL = plot.left;
        if (ext === "right" || ext === "both") xR = plot.right;
        if (ext === "none" && xR - xL < 40) xR = xL + 80;
        if ((d.fibTrendVisible ?? true) && distToSeg(p, pts[0], pts[1]) < EDGE) {
          return { id: d.id, index: "body" };
        }
        const levels = resolveFibLevels(d).filter((l) => l.visible);
        for (const f of levels) {
          const price = fibLevelPrice(
            d.points[0].price,
            d.points[1].price,
            f.level,
            Boolean(d.fibReverse),
            Boolean(d.fibLogScale),
          );
          const y = xy({ time: d.points[0].time, price })?.y;
          if (
            y != null &&
            Math.abs(p.y - y) < EDGE &&
            p.x >= xL - EDGE &&
            p.x <= xR + EDGE
          ) {
            return { id: d.id, index: "body" };
          }
        }
      }
      return null;
    };

    const hitFill = (d: Drawing): { id: string; index: number | "body" } | null => {
      if (d.hidden) return null;
      if (d.tool === "long" || d.tool === "short") {
        const anchors = positionAnchors(d.points);
        const pE = anchors ? xy(anchors.entry) : null;
        const pT = anchors ? xy(anchors.target) : null;
        const pS = anchors ? xy(anchors.stop) : null;
        if (!pE || !pT || !pS) return null;
        const x0 = Math.min(pE.x, pT.x);
        const x1 = Math.max(pE.x, pT.x);
        const y0 = Math.min(pE.y, pT.y, pS.y);
        const y1 = Math.max(pE.y, pT.y, pS.y);
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) return { id: d.id, index: "body" };
        return null;
      }
      const pts = d.points.map(xy).filter(Boolean) as XY[];
      if (d.tool === "rect" && pts.length >= 2) {
        const box = rectScreenBox(pts, d.extend, plot);
        if (p.x >= box.x && p.x <= box.x2 && p.y >= box.y && p.y <= box.y2)
          return { id: d.id, index: "body" };
      }
      if (d.tool === "circle" && pts.length >= 2) {
        if (d.fillVisible !== true) return null;
        const r = dist(pts[0], pts[1]);
        if (dist(p, pts[0]) < r) return { id: d.id, index: "body" };
      }
      return null;
    };

    // Top-most first: handles → edges/lines → fills (so lines win over areas under them)
    for (let i = drawings.length - 1; i >= 0; i--) {
      const hit = hitHandles(drawings[i]);
      if (hit) return hit;
    }
    for (let i = drawings.length - 1; i >= 0; i--) {
      const hit = hitEdge(drawings[i]);
      if (hit) return hit;
    }
    for (let i = drawings.length - 1; i >= 0; i--) {
      const hit = hitFill(drawings[i]);
      if (hit) return hit;
    }
    return null;
  };

  const moveDrawing = (
    drawing: Drawing,
    cur: NonNullable<typeof drag.current>,
    np: ChartPoint,
  ) => {
    if (cur.index === "body") {
      const dt = np.time - cur.start.time;
      const dp = np.price - cur.start.price;
      updateDrawing(pane.id, drawing.id, {
        points: cur.origin.map((pt) => ({
          time: pt.time + dt,
          price: pt.price + dp,
        })),
        ...(drawing.positionTargetHitTime != null
          ? { positionTargetHitTime: drawing.positionTargetHitTime + dt }
          : {}),
      });
      return;
    }
    if ((drawing.tool === "long" || drawing.tool === "short") && typeof cur.index === "number") {
      const anchors = positionAnchors(cur.origin);
      let clampedNp = np;
      if (anchors) {
        if (cur.index === 1 && np.time > anchors.target.time) {
          clampedNp = { ...np, time: anchors.target.time };
        } else if (cur.index === 2 && np.time < anchors.entry.time) {
          clampedNp = { ...np, time: anchors.entry.time };
        }
      }
      updateDrawing(pane.id, drawing.id, {
        points: resizePosition(cur.origin, cur.index, clampedNp),
        positionTargetHitTime: undefined,
      });
      return;
    }
    if (drawing.tool === "rect" && typeof cur.index === "number") {
      updateDrawing(pane.id, drawing.id, {
        points: resizeRect(cur.origin, cur.index, np),
      });
      return;
    }
    updateDrawing(pane.id, drawing.id, {
      points: cur.origin.map((pt, i) => (i === cur.index ? np : pt)),
    });
  };

  const hitTestRef = useRef(hitTest);
  hitTestRef.current = hitTest;
  const moveDrawingRef = useRef(moveDrawing);
  moveDrawingRef.current = moveDrawing;
  const toPointRef = useRef(toPoint);
  toPointRef.current = toPoint;
  const toXYRef = useRef(toXY);
  toXYRef.current = toXY;

  // Get all drawings within a selection box
  const getDrawingsInBox = (box: { a: XY; b: XY }, drawings: Drawing[]): string[] => {
    const x1 = Math.min(box.a.x, box.b.x);
    const x2 = Math.max(box.a.x, box.b.x);
    const y1 = Math.min(box.a.y, box.b.y);
    const y2 = Math.max(box.a.y, box.b.y);

    const xy = (p: ChartPoint): XY | null => {
      if (!getChart(pane.id)) return null;
      const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
      const handle = getChart(pane.id);
      if (!handle) return null;
      const x = unixTimeToCoordinate(
        handle.chart.timeScale() as never,
        p.time,
        candles,
        pane.timeframe,
      );
      const y = handle.series.priceToCoordinate(p.price);
      if (x == null || y == null) return null;
      return { x, y };
    };

    const result: string[] = [];
    for (const d of drawings) {
      if (d.hidden) continue;
      // Check if any point is within the box
      for (const pt of d.points) {
        const xyPt = xy(pt);
        if (xyPt && xyPt.x >= x1 && xyPt.x <= x2 && xyPt.y >= y1 && xyPt.y <= y2) {
          result.push(d.id);
          break;
        }
      }
    }
    return result;
  };

  // Cursor tool: SVG uses pointer-events:none so the chart gets clicks. Capture on the
  // parent and hit-test drawings ourselves (also detects double-click — native dblclick
  // breaks because paint() rebuilds SVG nodes every frame).
  useEffect(() => {
    const svg = svgRef.current;
    const host = svg?.parentElement;
    if (!host) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (useAppStore.getState().drawingSettingsTarget) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, input, textarea, [data-ind-legend]")) return;

      const screen = toXYRef.current(e.clientX, e.clientY);
      if (!screen) return;

      // Handle Shift+click for box selection
      if (e.shiftKey && latest.current.tool === "cursor") {
        e.preventDefault();
        e.stopPropagation();
        setActivePane(pane.id);
        selectionBox.current = { a: screen, b: screen };
        
        const dragOriginScreen = { x: screen.x, y: screen.y };
        let dragArmed = false;
        
        const move = (ev: PointerEvent) => {
          const s = toXYRef.current(ev.clientX, ev.clientY);
          if (!s || !selectionBox.current) return;
          
          if (!dragArmed) {
            if (Math.hypot(s.x - dragOriginScreen.x, s.y - dragOriginScreen.y) < 5) {
              return;
            }
            dragArmed = true;
          }
          
          selectionBox.current = { a: dragOriginScreen, b: s };
          paintRef.current();
        };
        
        const up = () => {
          if (dragArmed && selectionBox.current) {
            const ids = getDrawingsInBox(selectionBox.current, latest.current.pane.drawings);
            if (ids.length > 0) {
              setSelectedDrawingIds(new Set(ids));
            }
          }
          selectionBox.current = null;
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", up);
          paintRef.current();
        };
        
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        paintRef.current();
        return;
      }

      const hit = hitTestRef.current(screen);

      // When a drawing tool is active and the click hits an existing drawing,
      // select it and switch to cursor so Delete/resize/drag all work.
      if (hit && latest.current.tool !== "cursor") {
        e.preventDefault();
        e.stopPropagation();
        setDrawingTool("cursor");
        setSelectedDrawing(hit.id);
        lastHitClick.current = { id: hit.id, at: performance.now() };
        return;
      }

      if (latest.current.tool !== "cursor") return;
      if (!hit) {
        lastHitClick.current = null;
        // Empty click: drop selection and abort any stuck drag/placement follow.
        drag.current = null;
        duplicateDraft.current = null;
        draft.current = [];
        draftStudyInstanceId.current = undefined;
        hover.current = null;
        setSelectedDrawing(null);
        setSelectedDrawingIds(new Set());
        paintRef.current();

        // Double-click indicator plots (same capture path as drawings)
        const indId =
          getChart(pane.id)?.hitTestIndicator?.(e.clientX, e.clientY) ?? null;
        if (indId) {
          const now = performance.now();
          const prev = lastIndicatorClick.current;
          if (prev && prev.id === indId && now - prev.at < 500) {
            lastIndicatorClick.current = null;
            e.preventDefault();
            e.stopPropagation();
            setIndicatorSettingsOpen(indId);
            return;
          }
          lastIndicatorClick.current = { id: indId, at: now };
          return;
        }
        lastIndicatorClick.current = null;
        return;
      }

      lastIndicatorClick.current = null;
      e.preventDefault();
      e.stopPropagation();
      setActivePane(pane.id);

      const now = performance.now();
      const prev = lastHitClick.current;
      if (prev && prev.id === hit.id && now - prev.at < 450) {
        lastHitClick.current = null;
        drag.current = null;
        setDrawingTool("cursor");
        setSelectedDrawing(hit.id);
        setDrawingSettingsTarget({ paneId: pane.id, drawingId: hit.id });
        return;
      }
      lastHitClick.current = { id: hit.id, at: now };

      const p = toPointRef.current(e.clientX, e.clientY);
      const drawing = latest.current.pane.drawings.find((d) => d.id === hit.id);
      if (!drawing || !p) return;

      // Handle Ctrl+click to duplicate drawing
      if (e.ctrlKey && drawing) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedDrawing(drawing.id);
        duplicateDraft.current = {
          drawing: { ...drawing, id: `dup-${Math.random().toString(36).slice(2, 8)}` },
          originalPoints: drawing.points.map((pt) => ({ ...pt })),
          startPoint: p,
          currentPoint: p,
          studyInstanceId: drawing.studyInstanceId,
        };
        
        // Set up duplicate dragging
        const dragOriginScreen = { x: screen.x, y: screen.y };
        let dragArmed = false;
        const prevCursor = document.body.style.cursor;
        applyHostDrawCursor(host, "copy");
        
        const move = (ev: PointerEvent) => {
          const np = toPointRef.current(ev.clientX, ev.clientY, { clamp: true });
          if (!np || !duplicateDraft.current) return;
          
          if (!dragArmed) {
            const s = toXYRef.current(ev.clientX, ev.clientY);
            if (!s || Math.hypot(s.x - dragOriginScreen.x, s.y - dragOriginScreen.y) < 5) {
              return;
            }
            dragArmed = true;
          }
          
          // Update the duplicate position by moving all points from the original baseline
          const dt = np.time - duplicateDraft.current.startPoint.time;
          const dp = np.price - duplicateDraft.current.startPoint.price;
          duplicateDraft.current.currentPoint = np;
          duplicateDraft.current.drawing.points = duplicateDraft.current.originalPoints.map((pt) => ({
            time: pt.time + dt,
            price: pt.price + dp,
          }));
          paintRef.current();
        };
        
        const up = () => {
          document.body.style.cursor = prevCursor;
          applyHostDrawCursor(host, "");
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", up);
          
          // Commit the duplicate if drag actually happened
          if (dragArmed && duplicateDraft.current) {
            const dup = {
              ...duplicateDraft.current.drawing,
              studyInstanceId: duplicateDraft.current.studyInstanceId,
            };
            addDrawing(pane.id, dup);
          }
          
          duplicateDraft.current = null;
          paintRef.current();
        };
        
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        paintRef.current();
        return;
      }

      setSelectedDrawing(hit.id);
      
      // Save history snapshot before starting drag
      useAppStore.getState().saveDrawingHistory(pane.id);
      
      drag.current = {
        id: hit.id,
        index: hit.index,
        start: p,
        origin: drawing.points.map((pt) => ({ ...pt })),
      };
      const dragOriginScreen = { x: screen.x, y: screen.y };
      let dragArmed = false;
      const prevCursor = document.body.style.cursor;
      const resizeCursor =
        (drawing.tool === "long" || drawing.tool === "short") && typeof hit.index === "number"
          ? (POSITION_HANDLE_CURSOR[hit.index] ?? "ns-resize")
          : drawing.tool === "rect" && typeof hit.index === "number"
            ? (RECT_HANDLE_CURSOR[hit.index] ?? "grab")
            : "grabbing";
      applyHostDrawCursor(host, resizeCursor);
      const move = (ev: PointerEvent) => {
        const np = toPointRef.current(ev.clientX, ev.clientY, { clamp: true });
        const cur = drag.current;
        if (!np || !cur || cur.id === "new") return;
        if (!dragArmed) {
          const s = toXYRef.current(ev.clientX, ev.clientY);
          if (!s || Math.hypot(s.x - dragOriginScreen.x, s.y - dragOriginScreen.y) < 5) {
            return;
          }
          dragArmed = true;
        }
        const d0 = latest.current.pane.drawings.find((d) => d.id === cur.id);
        if (!d0) return;
        moveDrawingRef.current(d0, cur, np);
      };
      const up = () => {
        const wasArmed = dragArmed;
        drag.current = null;
        document.body.style.cursor = prevCursor;
        applyHostDrawCursor(host, "");
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        
        // Save history snapshot after drag ends (only if drag actually happened)
        if (wasArmed) {
          useAppStore.getState().saveDrawingHistory(latest.current.pane.id);
        }
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    };

    host.addEventListener("pointerdown", onPointerDown, true);

    const setHoveredDrawing = (id: string | null) => {
      if (hoveredDrawingId.current === id) return;
      hoveredDrawingId.current = id;
      paintRef.current();
    };

    const onPointerMoveHover = (e: PointerEvent) => {
      if (latest.current.tool !== "cursor") {
        applyHostDrawCursor(host, "");
        setHoveredDrawing(null);
        return;
      }
      if (drag.current) return;
      if (duplicateDraft.current) return;
      if (useAppStore.getState().drawingSettingsTarget) {
        applyHostDrawCursor(host, "");
        setHoveredDrawing(null);
        return;
      }
      const screen = toXYRef.current(e.clientX, e.clientY);
      if (!screen) {
        applyHostDrawCursor(host, "");
        setHoveredDrawing(null);
        return;
      }
      let hit = hitTestRef.current(screen);
      const hoverId = hit?.id ?? null;
      setHoveredDrawing(hoverId);
      // Re-hit after hover so position anchors activate in the same frame
      if (hoverId) hit = hitTestRef.current(screen) ?? hit;
      const d = hit ? latest.current.pane.drawings.find((x) => x.id === hit!.id) : null;
      let next = "";
      if (d && hit) {
        if (typeof hit.index === "number") {
          if (d.tool === "long" || d.tool === "short") {
            next = POSITION_HANDLE_CURSOR[hit.index] ?? "ns-resize";
          } else if (d.tool === "rect") {
            next = RECT_HANDLE_CURSOR[hit.index] ?? "ns-resize";
          } else {
            next = "pointer";
          }
        } else {
          next = "pointer";
        }
      }
      applyHostDrawCursor(host, next);
      requestAnimationFrame(() => applyHostDrawCursor(host, next));
    };

    const onPointerLeave = () => {
      if (drag.current) return;
      if (duplicateDraft.current) return;
      applyHostDrawCursor(host, "");
      setHoveredDrawing(null);
    };

    host.addEventListener("pointermove", onPointerMoveHover, true);
    host.addEventListener("pointerleave", onPointerLeave);
    return () => {
      host.removeEventListener("pointerdown", onPointerDown, true);
      host.removeEventListener("pointermove", onPointerMoveHover, true);
      host.removeEventListener("pointerleave", onPointerLeave);
      hoveredDrawingId.current = null;
      applyHostDrawCursor(host, "");
    };
  }, [
    pane.id,
    setActivePane,
    setDrawingTool,
    setSelectedDrawing,
    setDrawingSettingsTarget,
    setIndicatorSettingsOpen,
  ]);

  const capturing = tool !== "cursor";

  // Handle wheel zoom even when drawing tools are active
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    const onWheel = (e: WheelEvent) => {
      // Allow zooming with mouse wheel even when drawing tools are active
      if (e.ctrlKey || e.metaKey) return; // allow browser zoom
      
      const handle = getChart(pane.id);
      if (!handle) return;
      
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      // Check if on price or time axis
      let leftW = 0;
      const rightW = Math.max(handle.chart.priceScale("right").width(), 0);
      try {
        leftW = Math.max(handle.chart.priceScale("left").width(), 0);
      } catch {
        leftW = 0;
      }
      const CHART_TIME_AXIS_H = 24; // Same constant as in ChartCanvas
      const onPrice = x <= leftW + 1 || x >= rect.width - rightW - 1;
      const onTime = y >= rect.height - CHART_TIME_AXIS_H;
      
      // Leave price/time axes alone
      if (onPrice || onTime) return;

      e.preventDefault();
      e.stopPropagation();
      
      // Perform the zoom
      zoomTimeScaleRightAnchored(handle.chart.timeScale(), wheelZoomFactor(e.deltaY));
    };
    
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      svg.removeEventListener("wheel", onWheel);
    };
  }, [pane.id]);

  const finishIfReady = (next: ChartPoint[]) => {
    if (tool === "path") {
      draft.current = next;
      return;
    }
    const need = neededPoints(tool);
    if (next.length >= need && need > 0) {
      if (tool === "text") {
        setTextEdit({ point: next[0], value: pane.symbol });
        draft.current = [];
        hover.current = null;
        return;
      }
      commit(tool, next.slice(0, need));
    } else {
      draft.current = next;
    }
  };

  return (
    <>
      <svg
        ref={svgRef}
        className={`absolute inset-0 h-full w-full ${capturing ? "z-20" : "z-[5]"} ${capturing ? "chart-plot" : ""}`}
        style={{
          pointerEvents: "none",
        }}
        onMouseEnter={(e) => {
          if (capturing && tool !== "zoom") {
            (e.currentTarget as SVGSVGElement).style.cursor = "crosshair";
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (tool === "path" && draft.current.length >= 2) {
            commit("path", draft.current);
            return;
          }
          setActivePane(pane.id);
          const hit = toPoint(e.clientX, e.clientY);
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            paneId: pane.id,
            price: hit?.price ?? 0,
            time: hit?.time ?? null,
          });
        }}
        onDoubleClick={(e) => {
          if (tool === "path" && draft.current.length > 0) {
            e.preventDefault();
            const last = toPoint(e.clientX, e.clientY);
            const pts = last ? [...draft.current, last] : draft.current;
            if (pts.length >= 2) commit("path", pts);
          }
        }}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          setActivePane(pane.id);
          const screen = toXY(e.clientX, e.clientY);
          const p = toPoint(e.clientX, e.clientY);
          if (!screen) return;

          if (tool === "cursor") {
            // Handled by parent capture listener (SVG has pointer-events:none)
            return;
          }

          if (tool === "zoom") {
            zoomBox.current = { a: screen, b: screen };
            return;
          }

          if (!p) return;

          const existingHit = hitTest(screen);
          if (existingHit) {
            e.preventDefault();
            setDrawingTool("cursor");
            setSelectedDrawing(existingHit.id);
            return;
          }

          e.preventDefault();
          setSelectedDrawing(null);

          const need = neededPoints(tool);

          // Single-point tools: place immediately on press
          if (need === 1) {
            if (tool === "text") {
              setTextEdit({ point: p, value: pane.symbol });
              draft.current = [];
              hover.current = null;
            } else if (isPersistTool(tool)) {
              commit(tool, [p]);
            }
            ignoreClick.current = true;
            return;
          }

          // Continue multi-point placement (2nd / 3rd click)
          if (draft.current.length > 0 && !drag.current) {
            const next = [...draft.current, p];
            if (tool === "path") {
              draft.current = next;
              ignoreClick.current = true;
              paint();
              return;
            }
            const a = xy(draft.current[draft.current.length - 1]);
            const b = xy(p);
            if (a && b && dist(a, b) < 6) {
              ignoreClick.current = true;
              return;
            }
            finishIfReady(next);
            ignoreClick.current = true;
            paint();
            return;
          }

          // Start a new drawing on the first press
          if (draft.current.length === 0) {
            draft.current = [p];
            draftStudyInstanceId.current = getStudyInstanceIdAtY(e.clientY);
            hover.current = p;
            if (tool === "path") {
              ignoreClick.current = true;
              paint();
              return;
            }
            // Click-drag place: track on window so mouseup outside the SVG still
            // finishes (otherwise drag stays live and the shape follows forever).
            drag.current = { id: "new", index: 1, start: p, origin: [p] };
            ignoreClick.current = true;
            paint();
            const origin = p;
            const move = (ev: PointerEvent) => {
              if (drag.current?.id !== "new") return;
              const np = toPoint(ev.clientX, ev.clientY, { clamp: true });
              if (!np) return;
              hover.current = np;
              draft.current = [origin, np];
              paint();
            };
            const up = (ev: PointerEvent) => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
              window.removeEventListener("pointercancel", up);
              if (drag.current?.id !== "new") return;
              const end = toPoint(ev.clientX, ev.clientY, { clamp: true });
              drag.current = null;
              ignoreClick.current = true;
              const startXy = xy(origin) ?? { x: 0, y: 0 };
              const endXy = end ? xy(end) : null;
              if (end && endXy && dist(startXy, endXy) > 6) {
                finishIfReady([origin, end]);
              } else if (tool === "long" || tool === "short") {
                const barSec = timeframeSeconds(pane.timeframe);
                const mag = Math.abs(origin.price) * 0.014;
                const rt = origin.time + barSec * 15;
                const pts: ChartPoint[] = tool === "long"
                  ? [origin, { time: rt, price: origin.price + mag }, { time: rt, price: origin.price - mag }]
                  : [origin, { time: rt, price: origin.price - mag }, { time: rt, price: origin.price + mag }];
                commit(tool, pts);
                ignoreClick.current = true;
              } else {
                // Click without drag: keep anchor, rubber-band until next click
                draft.current = [origin];
                hover.current = end;
              }
              paint();
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
            window.addEventListener("pointercancel", up);
          }
        }}
        onMouseMove={(e) => {
          const screen = toXY(e.clientX, e.clientY);
          // "new" placement is driven by window listeners above — don't double-handle.
          const follow =
            (Boolean(drag.current) && drag.current?.id !== "new") ||
            draft.current.length > 0 ||
            Boolean(zoomBox.current);
          const p = toPoint(e.clientX, e.clientY, follow ? { clamp: true } : undefined);
          if (drag.current?.id !== "new") {
            hover.current = p;
          }
          if (zoomBox.current && screen) {
            const plot = getPlotBounds();
            const c = clampToPlot(screen.x, screen.y, plot);
            zoomBox.current = { ...zoomBox.current, b: c };
          }
          if (drag.current && drag.current.id !== "new" && p) {
            const drawing = pane.drawings.find((d) => d.id === drag.current?.id);
            if (drawing && drag.current) {
              moveDrawing(drawing, drag.current, p);
            }
          }
          // Draft/hover live in refs — must paint here (no perpetual RAF loop).
          if (follow) paint();
        }}
        onMouseUp={() => {
          if (tool === "zoom" && zoomBox.current) {
            const handle = getChart(pane.id);
            const { a, b } = zoomBox.current;
            zoomBox.current = null;
            ignoreClick.current = true;
            if (handle && Math.abs(a.x - b.x) > 12) {
              const t1 = handle.chart.timeScale().coordinateToTime(Math.min(a.x, b.x));
              const t2 = handle.chart.timeScale().coordinateToTime(Math.max(a.x, b.x));
              const pr1 = handle.series.coordinateToPrice(Math.min(a.y, b.y));
              const pr2 = handle.series.coordinateToPrice(Math.max(a.y, b.y));
              const from = typeof t1 === "number" ? t1 : null;
              const to = typeof t2 === "number" ? t2 : null;
              if (from != null && to != null && from !== to) {
                handle.chart.timeScale().setVisibleRange({ from: from as never, to: to as never });
              }
              if (pr1 != null && pr2 != null && pr1 !== pr2) {
                handle.chart.priceScale("right").setAutoScale(false);
                handle.chart.priceScale("right").setVisibleRange({
                  from: Math.min(pr1, pr2),
                  to: Math.max(pr1, pr2),
                });
              }
            }
            if (!stay) setDrawingTool("cursor");
            paint();
            return;
          }

          // "new" placement finishes via window pointerup — ignore SVG mouseup for it.
          if (drag.current?.id === "new") {
            return;
          }

          if (drag.current) {
            drag.current = null;
            ignoreClick.current = true;
            paint();
          }
        }}
        onClick={() => {
          // Drawing is driven by pointer down/up; swallow leftover click events
          if (ignoreClick.current) {
            ignoreClick.current = false;
          }
        }}
      />
      <svg
        ref={axisTagSvgRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      />
      {textEdit && xy(textEdit.point) && (
        <input
          autoFocus
          value={textEdit.value}
          className="absolute z-30 h-7 border border-[#2962ff] bg-black px-2 text-[12px] text-[#d1d4dc] outline-none"
          style={{ left: xy(textEdit.point)!.x, top: xy(textEdit.point)!.y - 22 }}
          onChange={(e) => setTextEdit({ ...textEdit, value: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit("text", [textEdit.point], textEdit.value || pane.symbol);
              setTextEdit(null);
            }
            if (e.key === "Escape") setTextEdit(null);
          }}
          onBlur={() => {
            if (textEdit.value.trim()) commit("text", [textEdit.point], textEdit.value);
            setTextEdit(null);
          }}
        />
      )}
      {tool === "path" && draft.current.length > 0 && (
        <div className="pointer-events-none absolute bottom-2 left-2 z-30 text-[11px] text-[#787b86]">
          Path: click to add · double-click or Enter to finish · Esc to cancel
        </div>
      )}
      {tool !== "cursor" && tool !== "path" && tool !== "zoom" && (
        <div className="pointer-events-none absolute bottom-2 left-2 z-30 text-[11px] text-[#787b86]">
          {DRAW_LABEL[tool as keyof typeof DRAW_LABEL] ?? tool}
          {neededPoints(tool) === Infinity
            ? ""
            : ` · ${draft.current.length}/${neededPoints(tool)} clicks`}
        </div>
      )}
    </>
  );
});
