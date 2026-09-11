import type {
  Candle,
  ChartPoint,
  Drawing,
  DrawingTool,
  FibLevel,
  PositionStatKey,
  Timeframe,
} from "@/types";
import { mawsFeed } from "@/lib/maws/feed";
import { timeframeSeconds } from "@/lib/timeframes";

/** Approx. height of Lightweight Charts time axis (date scale). */
export const CHART_TIME_AXIS_H = 28;

export type PlotBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

/** Main series plot rect inside the chart host (excludes price + time scales). */
export function plotBoundsFromScales(
  size: { width: number; height: number },
  scales: { left: number; right: number; timeAxis?: number },
): PlotBounds {
  const left = Math.max(0, scales.left);
  const rightW = Math.max(0, scales.right);
  const timeH = scales.timeAxis ?? CHART_TIME_AXIS_H;
  const top = 0;
  const right = Math.max(left, size.width - rightW);
  const bottom = Math.max(top, size.height - timeH);
  return {
    left,
    top,
    right,
    bottom,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

export function pointInPlot(x: number, y: number, plot: PlotBounds): boolean {
  return x >= plot.left && x <= plot.right && y >= plot.top && y <= plot.bottom;
}

export function clampToPlot(x: number, y: number, plot: PlotBounds): { x: number; y: number } {
  return {
    x: Math.min(Math.max(x, plot.left), Math.max(plot.left, plot.right - 0.5)),
    y: Math.min(Math.max(y, plot.top), Math.max(plot.top, plot.bottom - 0.5)),
  };
}

export const DRAW_TOOLS = [
  "trend",
  "hray",
  "fib",
  "path",
  "dcurve",
  "long",
  "short",
  "rect",
  "circle",
  "arrowUp",
  "arrowDown",
  "text",
] as const;

export type PersistTool = (typeof DRAW_TOOLS)[number];

export const DRAW_LABEL: Record<PersistTool, string> = {
  trend: "Trend line",
  hray: "Horizontal ray",
  fib: "Fib retracement",
  path: "Path",
  dcurve: "Double curve",
  long: "Long position",
  short: "Short position",
  rect: "Rectangle",
  circle: "Circle",
  arrowUp: "Arrow mark up",
  arrowDown: "Arrow mark down",
  text: "Text",
};

/** Defaults matching current long/short paint (entry line + zone fills). */
export const DEFAULT_POSITION_LINE_COLOR = "#d1d4dc";
export const DEFAULT_POSITION_STOP_COLOR = "rgba(242,54,69,0.22)";
export const DEFAULT_POSITION_TARGET_COLOR = "rgba(8,153,129,0.22)";

/** Rectangle style defaults (TradingView-like). */
export const DEFAULT_RECT_BORDER_COLOR = "#2962ff";
export const DEFAULT_RECT_FILL_COLOR = "rgba(41,98,255,0.2)";
export const DEFAULT_RECT_MIDDLE_LINE_COLOR = "#9c27b0";

/** Circle style defaults. */
export const DEFAULT_CIRCLE_BORDER_COLOR = "#2962ff";
export const DEFAULT_CIRCLE_FILL_COLOR = "rgba(41,98,255,0.2)";

export const ALL_POSITION_STATS: PositionStatKey[] = [
  "tpOffset",
  "tpPercent",
  "tpTicks",
  "tpPnl",
  "slOffset",
  "slPercent",
  "slTicks",
  "slPnl",
  "qty",
  "risk",
  "rr",
];

export const POSITION_STAT_LABELS: Record<PositionStatKey, string> = {
  tpOffset: "TP price offset",
  tpPercent: "TP percent",
  tpTicks: "TP ticks",
  tpPnl: "TP P&L",
  slOffset: "SL price offset",
  slPercent: "SL percent",
  slTicks: "SL ticks",
  slPnl: "SL P&L",
  qty: "Quantity",
  risk: "Risk",
  rr: "Risk/reward",
};

export function isPositionTool(tool: string): tool is "long" | "short" {
  return tool === "long" || tool === "short";
}

export function positionTickSize(precision: number): number {
  return 10 ** -Math.max(0, precision);
}

export function positionPricesFromTicks(
  tool: "long" | "short",
  entry: number,
  tpTicks: number,
  slTicks: number,
  tick: number,
): { target: number; stop: number } {
  const t = Math.max(0, tick);
  if (tool === "long") {
    return { target: entry + tpTicks * t, stop: entry - slTicks * t };
  }
  return { target: entry - tpTicks * t, stop: entry + slTicks * t };
}

export function withPositionPrices(
  points: ChartPoint[],
  entry: number,
  target: number,
  stop: number,
): ChartPoint[] {
  const a = positionAnchors(points);
  if (!a) {
    return [
      { time: points[0]?.time ?? 0, price: entry },
      { time: points[1]?.time ?? points[0]?.time ?? 0, price: target },
      { time: points[2]?.time ?? points[1]?.time ?? points[0]?.time ?? 0, price: stop },
    ];
  }
  return [
    { time: a.entry.time, price: entry },
    { time: a.target.time, price: target },
    { time: a.stop.time, price: stop },
  ];
}

export const FIBS = [
  { level: 0, color: "#787b86" },
  { level: 0.236, color: "#f23645" },
  { level: 0.382, color: "#ff9800" },
  { level: 0.5, color: "#2962ff" },
  { level: 0.618, color: "#089981" },
  { level: 0.786, color: "#ab47bc" },
  { level: 1, color: "#d1d4dc" },
  { level: 1.272, color: "#26a69a" },
  { level: 1.618, color: "#2962ff" },
];

/** TradingView-like default fib level set (visibility matches typical TV defaults). */
export const DEFAULT_FIB_LEVELS: FibLevel[] = [
  { level: 0, color: "#d1d4dc", visible: true },
  { level: 0.236, color: "#4dd0e1", visible: true },
  { level: 0.382, color: "#4caf50", visible: true },
  { level: 0.5, color: "#ff9800", visible: true },
  { level: 0.618, color: "#ffeb3b", visible: true },
  { level: 0.786, color: "#f23645", visible: true },
  { level: 1, color: "#d1d4dc", visible: true },
  { level: 1.272, color: "#81d4fa", visible: false },
  { level: 1.414, color: "#81d4fa", visible: false },
  { level: 1.618, color: "#2979ff", visible: false },
  { level: 2, color: "#2979ff", visible: false },
  { level: 2.272, color: "#9c27b0", visible: false },
  { level: 2.414, color: "#9c27b0", visible: false },
  { level: 2.618, color: "#e91e63", visible: false },
  { level: 3, color: "#e91e63", visible: false },
  { level: 3.272, color: "#ff5722", visible: false },
  { level: 3.414, color: "#ff5722", visible: false },
  { level: 3.618, color: "#ff9800", visible: false },
  { level: 4, color: "#ffc107", visible: false },
  { level: 4.236, color: "#cddc39", visible: false },
  { level: 4.272, color: "#8bc34a", visible: false },
  { level: 4.414, color: "#009688", visible: false },
  { level: 4.618, color: "#00bcd4", visible: false },
  { level: 4.764, color: "#03a9f4", visible: false },
];

export const DEFAULT_FIB_TREND_COLOR = "#787b86";
export const DEFAULT_FIB_ONE_COLOR = "#2962ff";

export function cloneFibLevels(levels?: FibLevel[]): FibLevel[] {
  const src = levels && levels.length > 0 ? levels : DEFAULT_FIB_LEVELS;
  return src.map((l) => ({ ...l }));
}

export function resolveFibLevels(drawing: {
  fibLevels?: FibLevel[];
  fibUseOneColor?: boolean;
  fibOneColor?: string;
}): FibLevel[] {
  const levels = cloneFibLevels(drawing.fibLevels);
  if (!drawing.fibUseOneColor) return levels;
  const c = drawing.fibOneColor || DEFAULT_FIB_ONE_COLOR;
  return levels.map((l) => ({ ...l, color: c }));
}

/** Price at a fib level between anchors a→b. */
export function fibLevelPrice(
  a: number,
  b: number,
  level: number,
  reverse = false,
  logScale = false,
): number {
  const p0 = reverse ? b : a;
  const p1 = reverse ? a : b;
  if (logScale && p0 > 0 && p1 > 0) {
    const l0 = Math.log(p0);
    const l1 = Math.log(p1);
    return Math.exp(l0 + (l1 - l0) * level);
  }
  return p0 + (p1 - p0) * level;
}

export function isPersistTool(tool: DrawingTool): tool is PersistTool {
  return (DRAW_TOOLS as readonly string[]).includes(tool);
}

export function neededPoints(tool: DrawingTool): number {
  if (tool === "path") return Number.POSITIVE_INFINITY;
  if (tool === "arrowUp" || tool === "arrowDown" || tool === "text" || tool === "hray") return 1;
  if (tool === "dcurve") return 3;
  if (
    tool === "trend" ||
    tool === "rect" ||
    tool === "circle" ||
    tool === "fib" ||
    tool === "long" ||
    tool === "short"
  )
    return 2;
  return 0;
}

export function snapPoint(
  symbol: string,
  timeframe: Timeframe,
  point: ChartPoint,
  magnet: boolean,
): ChartPoint {
  if (!magnet) return point;
  const candles = mawsFeed.getCandles(symbol, timeframe);
  if (!candles.length) return point;
  const first = candles[0];
  const last = candles[candles.length - 1];
  // Past / future of the series — keep free time so tools can extend beyond candles
  if (point.time > last.time || point.time < first.time) return point;
  let best = candles[0];
  let bestDt = Math.abs(best.time - point.time);
  for (const c of candles) {
    const dt = Math.abs(c.time - point.time);
    if (dt < bestDt) {
      bestDt = dt;
      best = c;
    }
  }
  const levels = [best.open, best.high, best.low, best.close];
  let price = levels[0];
  let bestDp = Math.abs(price - point.price);
  for (const v of levels) {
    const dp = Math.abs(v - point.price);
    if (dp < bestDp) {
      bestDp = dp;
      price = v;
    }
  }
  return { time: best.time, price };
}

/** Map a screen X to unix time, including whitespace past the last / before the first bar. */
export function coordinateToUnixTime(
  timeScale: {
    coordinateToTime: (x: number) => unknown;
    coordinateToLogical: (x: number) => number | null;
  },
  x: number,
  candles: Candle[],
  timeframe: Timeframe,
): number | null {
  const raw = timeScale.coordinateToTime(x);
  if (raw != null) {
    const t = typeof raw === "number" ? raw : Number(raw);
    if (Number.isFinite(t)) return t;
  }
  if (!candles.length) return null;
  const logical = timeScale.coordinateToLogical(x);
  if (logical == null || !Number.isFinite(logical)) return null;
  const barSec = timeframeSeconds(timeframe);
  const lastIdx = candles.length - 1;
  return candles[lastIdx].time + (logical - lastIdx) * barSec;
}

/** Map unix time to screen X, including times beyond the loaded series. */
export function unixTimeToCoordinate(
  // Lightweight Charts brands Logical/Time; keep this structural and loose.
  timeScale: {
    timeToCoordinate: (time: never) => number | null;
    logicalToCoordinate: (logical: never) => number | null;
  },
  time: number,
  candles: Candle[],
  timeframe: Timeframe,
): number | null {
  const t = candles.length ? normalizeEntryTime(time, candles) : time;
  const direct = timeScale.timeToCoordinate(t as never);
  if (direct != null) return direct;
  if (!candles.length) return null;
  const barSec = timeframeSeconds(timeframe);
  if (barSec <= 0) return null;
  const lastIdx = candles.length - 1;
  const logical = lastIdx + (t - candles[lastIdx].time) / barSec;
  return timeScale.logicalToCoordinate(logical as never);
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function distToSeg(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = dx * dx + dy * dy;
  if (len === 0) return dist(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len;
  t = Math.max(0, Math.min(1, t));
  return dist(p, { x: a.x + t * dx, y: a.y + t * dy });
}

export function sampleCubic(
  a: { x: number; y: number },
  c1: { x: number; y: number },
  c2: { x: number; y: number },
  b: { x: number; y: number },
  steps = 24,
) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push({
      x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
      y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
    });
  }
  return pts;
}

export function cubicControls(
  a: { x: number; y: number },
  m: { x: number; y: number },
  b: { x: number; y: number },
) {
  return {
    c1: { x: a.x + (m.x - a.x) * 0.85, y: a.y + (m.y - a.y) * 0.85 },
    c2: { x: b.x + (m.x - b.x) * 0.85, y: b.y + (m.y - b.y) * 0.85 },
  };
}

export function isValidDrawing(d: Drawing): boolean {
  return isPersistTool(d.tool) && Array.isArray(d.points) && d.points.length > 0;
}

/** Entry, take-profit, and stop share one width: left = entry time, right = TP/SL time. */
export function positionAnchors(points: ChartPoint[]) {
  if (!points[0] || !points[1]) return null;
  const entry = points[0];
  const target = points[1];
  const right = target.time;
  const stopPrice = points[2]?.price ?? entry.price - (target.price - entry.price);
  return {
    entry: { time: entry.time, price: entry.price },
    target: { time: right, price: target.price },
    stop: { time: right, price: stopPrice },
  };
}

/**
 * Build long/short points from entry + drag cursor.
 * Long: TP above entry, SL below. Short: TP below, SL above.
 * Cursor distance from entry sets the initial equal risk/reward size; time sets width.
 */
export function positionPointsFromDrag(
  entry: ChartPoint,
  cursor: ChartPoint,
  tool: "long" | "short",
  barSeconds = 60,
): ChartPoint[] {
  const bar = Math.max(1, barSeconds);
  // Same unix second still maps to one candle — force at least one bar of width.
  const right =
    Math.abs(cursor.time - entry.time) >= bar * 0.5
      ? cursor.time
      : entry.time + bar;
  const mag = Math.abs(cursor.price - entry.price) || Math.abs(entry.price) * 0.002 || 1;
  if (tool === "long") {
    return [
      { time: entry.time, price: entry.price },
      { time: right, price: entry.price + mag },
      { time: right, price: entry.price - mag },
    ];
  }
  return [
    { time: entry.time, price: entry.price },
    { time: right, price: entry.price - mag },
    { time: right, price: entry.price + mag },
  ];
}

export function normalizePositionPoints(
  points: ChartPoint[],
  tool?: "long" | "short",
): ChartPoint[] {
  if (tool && points[0] && points[1]) {
    return positionPointsFromDrag(points[0], points[1], tool);
  }
  const a = positionAnchors(points);
  if (!a) return points;
  return [a.entry, a.target, a.stop];
}

/** True when `price` has reached take-profit for this position side. */
export function priceHitsPositionTarget(
  tool: "long" | "short",
  price: number,
  targetPrice: number,
): boolean {
  return tool === "long" ? price >= targetPrice : price <= targetPrice;
}

function normalizeEntryTime(entryTime: number, candles: Array<{ time: number }>): number {
  if (!candles.length) return entryTime;
  const sample = candles[0].time;
  if (entryTime > 1e12 && sample < 1e12) return Math.floor(entryTime / 1000);
  if (entryTime < 1e12 && sample > 1e12) return entryTime * 1000;
  return entryTime;
}

export type PositionPnlExit = "tp" | "sl";

export type PositionPnlTip = {
  /** Tip price (open mark, or TP/SL once closed). */
  price: number;
  exit: PositionPnlExit | null;
  /**
   * Candle time for tip X:
   * - Closed: first TP/SL fill candle inside the tool
   * - Open: last series candle (live), or the tool's right edge when that edge is already in the past
   */
  time: number;
};

/**
 * First TP or SL fill on bars after entry through the tool's right-edge time.
 * Same bar: SL wins (stop has priority). Uses current TP/SL prices (recompute after drag).
 */
export function findPositionExitInsideTool(
  tool: "long" | "short",
  entryTime: number,
  rightTime: number,
  targetPrice: number,
  stopPrice: number,
  candles: Array<{ time: number; high: number; low: number }>,
): { exit: PositionPnlExit; time: number } | null {
  if (!candles.length) return null;
  const entry = normalizeEntryTime(entryTime, candles);
  const right = normalizeEntryTime(rightTime, candles);
  const left = Math.min(entry, right);
  const rightBound = Math.max(entry, right);

  let start = -1;
  for (let i = 0; i < candles.length; i++) {
    if (candles[i].time <= left) start = i;
    else break;
  }
  const from = start < 0 ? 0 : start + 1;

  for (let j = from; j < candles.length; j++) {
    const c = candles[j];
    if (c.time > rightBound) break;
    if (!(c.high > 0) || !(c.low > 0)) continue;

    const hitSl = tool === "long" ? c.low <= stopPrice : c.high >= stopPrice;
    const hitTp = tool === "long" ? c.high >= targetPrice : c.low <= targetPrice;
    if (hitSl) return { exit: "sl", time: c.time };
    if (hitTp) return { exit: "tp", time: c.time };
  }
  return null;
}

/** Close of the candle at the tool's right edge; LastPrice if that edge is past the series. */
export function positionRightEdgeMarkPrice(
  rightTime: number,
  candles: Array<{ time: number; close: number }>,
  livePrice: number | null,
): number | null {
  if (!candles.length) {
    return livePrice != null && livePrice > 0 ? livePrice : null;
  }
  const right = normalizeEntryTime(rightTime, candles);
  const last = candles[candles.length - 1];

  if (right > last.time) {
    return livePrice != null && Number.isFinite(livePrice) && livePrice > 0
      ? livePrice
      : last.close;
  }

  let atEdge = candles[0];
  for (const c of candles) {
    if (c.time <= right) atEdge = c;
    else break;
  }
  return atEdge.close;
}

/**
 * Dashed P&L tip:
 * - Open: X = current (last) candle, Y = LastPrice — not the tool's right edge while the box
 *   still extends into the future. If the right edge is already in the past, tip sits on that edge.
 * - Closed (TP/SL hit inside the tool): X = that exit candle, Y = TP or SL price.
 * Recompute after TP/SL drag.
 */
export function resolvePositionPnlTip(
  tool: "long" | "short",
  entryTime: number,
  rightTime: number,
  targetPrice: number,
  stopPrice: number,
  candles: Array<{ time: number; high: number; low: number; close: number }>,
  livePrice: number | null,
): PositionPnlTip | null {
  const filled = findPositionExitInsideTool(
    tool,
    entryTime,
    rightTime,
    targetPrice,
    stopPrice,
    candles,
  );
  if (filled) {
    return {
      price: filled.exit === "tp" ? targetPrice : stopPrice,
      exit: filled.exit,
      time: filled.time,
    };
  }

  if (!candles.length) return null;
  const entry = normalizeEntryTime(entryTime, candles);
  const right = normalizeEntryTime(rightTime, candles);
  const last = candles[candles.length - 1];
  // Prefer the live candle; never draw past the tool's right edge once that edge is historical.
  const tipTime = Math.min(last.time, Math.max(entry, right));

  let mark: number | null;
  if (right > last.time) {
    mark =
      livePrice != null && Number.isFinite(livePrice) && livePrice > 0
        ? livePrice
        : last.close;
  } else {
    mark = positionRightEdgeMarkPrice(rightTime, candles, livePrice);
  }
  if (mark == null || !(mark > 0)) return null;
  return { price: mark, exit: null, time: tipTime };
}

/** @deprecated Prefer findPositionExitInsideTool — kept for any residual callers. */
export function findPositionTargetHitTime(
  tool: "long" | "short",
  entryTime: number,
  targetPrice: number,
  candles: Array<{ time: number; high: number; low: number }>,
): number | null {
  if (!candles.length) return null;
  const entry = normalizeEntryTime(entryTime, candles);
  let start = -1;
  for (let i = 0; i < candles.length; i++) {
    if (candles[i].time <= entry) start = i;
    else break;
  }
  const from = start < 0 ? 0 : start + 1;
  for (let j = from; j < candles.length; j++) {
    const c = candles[j];
    if (!(c.high > 0) || !(c.low > 0)) continue;
    if (tool === "long" ? c.high >= targetPrice : c.low <= targetPrice) return c.time;
  }
  return null;
}

/**
 * Position tool handles (TradingView: 4 squares):
 * 0 left-TP, 1 left-entry, 2 right-entry, 3 left-SL
 */
export function positionHandles(points: ChartPoint[]): ChartPoint[] | null {
  const a = positionAnchors(points);
  if (!a) return null;
  const left = a.entry.time;
  const right = a.target.time;
  return [
    { time: left, price: a.target.price },
    { time: left, price: a.entry.price },
    { time: right, price: a.entry.price },
    { time: left, price: a.stop.price },
  ];
}

export const POSITION_HANDLE_CURSOR = [
  "ns-resize",  // 0: left-TP (upper left) - vertical only
  "move",        // 1: left-entry (middle left) - both directions
  "ew-resize",   // 2: right-entry (right) - horizontal only
  "ns-resize",   // 3: left-SL (bottom left) - vertical only
] as const;

export function resizePosition(origin: ChartPoint[], index: number, np: ChartPoint): ChartPoint[] {
  const a = positionAnchors(origin);
  if (!a) return origin.map((pt, i) => (i === index ? np : pt));
  let left = a.entry.time;
  let right = a.target.time;
  let entry = a.entry.price;
  let target = a.target.price;
  let stop = a.stop.price;

  switch (index) {
    case 0: // left-TP (upper left) - only resize vertically (price), not horizontally (time)
      target = np.price;
      break;
    case 1: // left-entry (middle left) - resize both time and price
      left = np.time;
      entry = np.price;
      break;
    case 2: // right-entry (width) - only resize horizontally (time)
      right = np.time;
      break;
    case 3: // left-SL (bottom left) - only resize vertically (price), not horizontally (time)
      stop = np.price;
      break;
    default:
      return origin;
  }

  // Prevent edges from crossing
  if (left > right) left = right;
  if (right < left) right = left;

  return [
    { time: left, price: entry },
    { time: right, price: target },
    { time: right, price: stop },
  ];
}

/** Axis-aligned rect from two corner points (any order). */
export function rectBounds(points: ChartPoint[]) {
  const a = points[0];
  const b = points[1];
  if (!a || !b) return null;
  return {
    t0: Math.min(a.time, b.time),
    t1: Math.max(a.time, b.time),
    p0: Math.min(a.price, b.price),
    p1: Math.max(a.price, b.price),
  };
}

/** 8 handles: NW, N, NE, E, SE, S, SW, W (price-up = north on the chart). */
export function rectHandles(points: ChartPoint[]): ChartPoint[] | null {
  const b = rectBounds(points);
  if (!b) return null;
  const tm = (b.t0 + b.t1) / 2;
  const pm = (b.p0 + b.p1) / 2;
  return [
    { time: b.t0, price: b.p1 },
    { time: tm, price: b.p1 },
    { time: b.t1, price: b.p1 },
    { time: b.t1, price: pm },
    { time: b.t1, price: b.p0 },
    { time: tm, price: b.p0 },
    { time: b.t0, price: b.p0 },
    { time: b.t0, price: pm },
  ];
}

export const RECT_HANDLE_CURSOR = [
  "nwse-resize",
  "ns-resize",
  "nesw-resize",
  "ew-resize",
  "nwse-resize",
  "ns-resize",
  "nesw-resize",
  "ew-resize",
] as const;

export function resizeRect(origin: ChartPoint[], handle: number, np: ChartPoint): ChartPoint[] {
  const b = rectBounds(origin);
  if (!b) return origin;
  let { t0, t1, p0, p1 } = b;
  switch (handle) {
    case 0:
      t0 = np.time;
      p1 = np.price;
      break;
    case 1:
      p1 = np.price;
      break;
    case 2:
      t1 = np.time;
      p1 = np.price;
      break;
    case 3:
      t1 = np.time;
      break;
    case 4:
      t1 = np.time;
      p0 = np.price;
      break;
    case 5:
      p0 = np.price;
      break;
    case 6:
      t0 = np.time;
      p0 = np.price;
      break;
    case 7:
      t0 = np.time;
      break;
    default:
      return origin;
  }
  return [
    { time: Math.min(t0, t1), price: Math.min(p0, p1) },
    { time: Math.max(t0, t1), price: Math.max(p0, p1) },
  ];
}
