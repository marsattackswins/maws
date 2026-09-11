import type {
  BbIndicatorSettings,
  BbMaType,
  Candle,
  DrawingLineStyle,
  EmaIndicatorSettings,
  IndicatorId,
  IndicatorLineStyleSettings,
  MaSmoothingType,
  MaSource,
  Timeframe,
  VwapIndicatorSettings,
} from "@/types";
import { LineStyle } from "lightweight-charts";

export const INDICATOR_ORDER: IndicatorId[] = [
  "volume",
  "vwap",
  "ema",
  "bb",
  "rsi",
  "stoch",
  "atr",
  "adx",
  "pmo",
  "ob",
];

/** Drawn on the main price pane. */
export const OVERLAY_INDICATORS: IndicatorId[] = ["volume", "vwap", "ema", "bb", "ob"];

/** Drawn in their own chart panes below price. */
export const PANE_INDICATORS: IndicatorId[] = ["rsi", "stoch", "atr", "adx", "pmo"];

export type StudyPaneId = "rsi" | "stoch" | "atr" | "adx" | "pmo";

export function indicatorTitle(id: IndicatorId, symbol: string): string {
  const base = symbol.replace(/USDT$|USD$|USDC$/, "");
  if (id === "volume") return `Vol · ${base}`;
  if (id === "vwap") return "VWAP";
  if (id === "ema") return "EMA";
  if (id === "bb") return "Bollinger Bands";
  if (id === "rsi") return "RSI";
  if (id === "stoch") return "Stochastic";
  if (id === "atr") return "ATR";
  if (id === "adx") return "ADX";
  if (id === "ob") return "Order Blocks";
  return "PMO";
}

/** Apply 0–100 opacity onto a hex / rgb / rgba color. */
export function applyColorOpacity(color: string, opacityPct: number): string {
  const a = Math.min(1, Math.max(0, opacityPct / 100));
  const c = color.trim();
  if (c.startsWith("#")) {
    const hex =
      c.length === 4
        ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`
        : c.length >= 7
          ? c.slice(0, 7)
          : c;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if ([r, g, b].every((n) => Number.isFinite(n))) return `rgba(${r},${g},${b},${a})`;
  }
  const rgba = c.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
  );
  if (rgba) {
    return `rgba(${rgba[1]},${rgba[2]},${rgba[3]},${a})`;
  }
  return c;
}

export function toChartLineStyle(style: DrawingLineStyle | undefined): LineStyle {
  if (style === "dashed") return LineStyle.Dashed;
  if (style === "dotted") return LineStyle.Dotted;
  return LineStyle.Solid;
}

export function lineAppearance(
  s: IndicatorLineStyleSettings | { color: string; opacity?: number; lineWidth: 1 | 2 | 3 | 4; lineStyle?: DrawingLineStyle },
) {
  return {
    color: applyColorOpacity(s.color, s.opacity ?? 100),
    lineWidth: s.lineWidth,
    lineStyle: toChartLineStyle(s.lineStyle),
  };
}

export function candleSource(c: Candle, source: MaSource): number {
  if (source === "open") return c.open;
  if (source === "high") return c.high;
  if (source === "low") return c.low;
  if (source === "hl2") return (c.high + c.low) / 2;
  if (source === "hlc3") return (c.high + c.low + c.close) / 3;
  if (source === "ohlc4") return (c.open + c.high + c.low + c.close) / 4;
  return c.close;
}

export function computeEma(candles: Candle[], period: number, source: MaSource = "close"): (number | null)[] {
  const values = candles.map((c) => candleSource(c, source));
  return emaOfValues(values, period);
}

function emaOfValues(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (period < 1 || values.length < period) return out;
  const k = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  let ema = sum / period;
  out[period - 1] = ema;
  for (let i = period; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
    out[i] = ema;
  }
  return out;
}

function smaOfNullable(values: (number | null)[], period: number): (number | null)[] {
  return smaSeries(values, period);
}

function emaOfNullable(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (period < 1) return out;
  const k = 2 / (period + 1);
  let ema: number | null = null;
  let seed = 0;
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) continue;
    if (ema == null) {
      seed += v;
      count += 1;
      if (count === period) {
        ema = seed / period;
        out[i] = ema;
      }
      continue;
    }
    ema = v * k + ema * (1 - k);
    out[i] = ema;
  }
  return out;
}

function rmaOfNullable(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (period < 1) return out;
  let rma: number | null = null;
  let seed = 0;
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) continue;
    if (rma == null) {
      seed += v;
      count += 1;
      if (count === period) {
        rma = seed / period;
        out[i] = rma;
      }
      continue;
    }
    rma = (rma * (period - 1) + v) / period;
    out[i] = rma;
  }
  return out;
}

function wmaOfNullable(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (period < 1) return out;
  const denom = (period * (period + 1)) / 2;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) continue;
    let sum = 0;
    let ok = true;
    for (let j = 0; j < period; j++) {
      const v = values[i - period + 1 + j];
      if (v == null) {
        ok = false;
        break;
      }
      sum += v * (j + 1);
    }
    if (ok) out[i] = sum / denom;
  }
  return out;
}

function applySmoothing(
  values: (number | null)[],
  type: MaSmoothingType,
  length: number,
): (number | null)[] {
  if (type === "none" || length < 1) return values;
  if (type === "sma") return smaOfNullable(values, length);
  if (type === "ema") return emaOfNullable(values, length);
  if (type === "smma") return rmaOfNullable(values, length);
  return wmaOfNullable(values, length);
}

function applyOffset(values: (number | null)[], offset: number): (number | null)[] {
  if (!offset) return values;
  const out: (number | null)[] = Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    const src = i - offset;
    if (src >= 0 && src < values.length) out[i] = values[src];
  }
  return out;
}

function rollingStdev(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (period < 1) return out;
  for (let i = period - 1; i < values.length; i++) {
    let sum = 0;
    let ok = true;
    for (let j = i - period + 1; j <= i; j++) {
      const v = values[j];
      if (v == null) {
        ok = false;
        break;
      }
      sum += v;
    }
    if (!ok) continue;
    const mean = sum / period;
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = values[j]! - mean;
      variance += d * d;
    }
    out[i] = Math.sqrt(variance / period);
  }
  return out;
}

export type EmaPlot = {
  line: (number | null)[];
  upper: (number | null)[] | null;
  lower: (number | null)[] | null;
};

/** Full EMA plot with source, offset, optional smoothing + BB bands. */
export function computeEmaPlot(candles: Candle[], settings: EmaIndicatorSettings): EmaPlot {
  let line = computeEma(candles, settings.period, settings.source);
  line = applySmoothing(line, settings.smoothingType, settings.smoothingLength);
  line = applyOffset(line, settings.offset);

  let upper: (number | null)[] | null = null;
  let lower: (number | null)[] | null = null;
  if (settings.smoothingType !== "none" && settings.bbStdDev > 0) {
    const std = rollingStdev(line, settings.smoothingLength);
    upper = line.map((v, i) =>
      v == null || std[i] == null ? null : v + settings.bbStdDev * std[i]!,
    );
    lower = line.map((v, i) =>
      v == null || std[i] == null ? null : v - settings.bbStdDev * std[i]!,
    );
  }
  return { line, upper, lower };
}

export function computeBollinger(
  candles: Candle[],
  period = 20,
  mult = 2,
  source: MaSource = "close",
  maType: BbMaType = "sma",
): { basis: (number | null)[]; upper: (number | null)[]; lower: (number | null)[] } {
  const basis: (number | null)[] = Array(candles.length).fill(null);
  const upper: (number | null)[] = Array(candles.length).fill(null);
  const lower: (number | null)[] = Array(candles.length).fill(null);
  if (period < 1 || candles.length < period) return { basis, upper, lower };

  const src = candles.map((c) => candleSource(c, source));
  let mid: (number | null)[];
  if (maType === "ema") mid = emaOfValues(src, period);
  else if (maType === "smma") mid = rmaOfNullable(src.map((v) => v as number | null), period);
  else if (maType === "wma") mid = wmaOfNullable(src.map((v) => v as number | null), period);
  else mid = smaSeries(src.map((v) => v as number | null), period);

  const std = rollingStdev(
    src.map((v) => v as number | null),
    period,
  );

  for (let i = 0; i < candles.length; i++) {
    if (mid[i] == null || std[i] == null) continue;
    basis[i] = mid[i];
    upper[i] = mid[i]! + mult * std[i]!;
    lower[i] = mid[i]! - mult * std[i]!;
  }
  return { basis, upper, lower };
}

export type BbPlot = {
  basis: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
};

/** Full BB plot with source, MA type, stddev, and offset. */
export function computeBbPlot(candles: Candle[], settings: BbIndicatorSettings): BbPlot {
  const bands = computeBollinger(
    candles,
    settings.period,
    settings.mult,
    settings.source,
    settings.maType,
  );
  return {
    basis: applyOffset(bands.basis, settings.offset),
    upper: applyOffset(bands.upper, settings.offset),
    lower: applyOffset(bands.lower, settings.offset),
  };
}

export function computeRsi(candles: Candle[], period = 14): (number | null)[] {
  const out: (number | null)[] = Array(candles.length).fill(null);
  if (candles.length <= period) return out;

  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const delta = candles[i].close - candles[i - 1].close;
    if (delta >= 0) gain += delta;
    else loss -= delta;
  }

  let avgGain = gain / period;
  let avgLoss = loss / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < candles.length; i++) {
    const delta = candles[i].close - candles[i - 1].close;
    avgGain = (avgGain * (period - 1) + Math.max(delta, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-delta, 0)) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

function smaSeries(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  if (period < 1) return out;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) continue;
    let sum = 0;
    let ok = true;
    for (let j = i - period + 1; j <= i; j++) {
      const v = values[j];
      if (v == null) {
        ok = false;
        break;
      }
      sum += v;
    }
    if (ok) out[i] = sum / period;
  }
  return out;
}

/** Classic Stochastic %K / %D. */
export function computeStochastic(
  candles: Candle[],
  length = 14,
  kSmoothing = 3,
  dSmoothing = 3,
): { k: (number | null)[]; d: (number | null)[] } {
  const rawK: (number | null)[] = Array(candles.length).fill(null);
  for (let i = length - 1; i < candles.length; i++) {
    let hi = candles[i - length + 1].high;
    let lo = candles[i - length + 1].low;
    for (let j = i - length + 2; j <= i; j++) {
      if (candles[j].high > hi) hi = candles[j].high;
      if (candles[j].low < lo) lo = candles[j].low;
    }
    const range = hi - lo;
    rawK[i] = range === 0 ? 50 : ((candles[i].close - lo) / range) * 100;
  }
  const k = smaSeries(rawK, Math.max(1, kSmoothing));
  const d = smaSeries(k, Math.max(1, dSmoothing));
  return { k, d };
}

function trueRange(candle: Candle, prev: Candle): number {
  return Math.max(
    candle.high - candle.low,
    Math.abs(candle.high - prev.close),
    Math.abs(candle.low - prev.close),
  );
}

export function computeAtr(candles: Candle[], period = 14): (number | null)[] {
  const out: (number | null)[] = Array(candles.length).fill(null);
  if (candles.length <= period) return out;

  let atr = 0;
  for (let i = 1; i <= period; i++) {
    atr += trueRange(candles[i], candles[i - 1]);
  }
  atr /= period;
  out[period] = atr;

  for (let i = period + 1; i < candles.length; i++) {
    atr = (atr * (period - 1) + trueRange(candles[i], candles[i - 1])) / period;
    out[i] = atr;
  }
  return out;
}

/** Wilder ADX (no +DI/−DI plot). */
export function computeAdx(candles: Candle[], period = 14): (number | null)[] {
  const out: (number | null)[] = Array(candles.length).fill(null);
  if (candles.length <= period * 2) return out;

  const tr: number[] = Array(candles.length).fill(0);
  const plusDM: number[] = Array(candles.length).fill(0);
  const minusDM: number[] = Array(candles.length).fill(0);

  for (let i = 1; i < candles.length; i++) {
    const up = candles[i].high - candles[i - 1].high;
    const down = candles[i - 1].low - candles[i].low;
    plusDM[i] = up > down && up > 0 ? up : 0;
    minusDM[i] = down > up && down > 0 ? down : 0;
    tr[i] = trueRange(candles[i], candles[i - 1]);
  }

  let atr = 0;
  let plus = 0;
  let minus = 0;
  for (let i = 1; i <= period; i++) {
    atr += tr[i];
    plus += plusDM[i];
    minus += minusDM[i];
  }

  const dx: (number | null)[] = Array(candles.length).fill(null);
  const smooth = (prev: number, value: number) => prev - prev / period + value;

  for (let i = period; i < candles.length; i++) {
    if (i > period) {
      atr = smooth(atr, tr[i]);
      plus = smooth(plus, plusDM[i]);
      minus = smooth(minus, minusDM[i]);
    }
    const plusDI = atr === 0 ? 0 : (100 * plus) / atr;
    const minusDI = atr === 0 ? 0 : (100 * minus) / atr;
    const sum = plusDI + minusDI;
    dx[i] = sum === 0 ? 0 : (100 * Math.abs(plusDI - minusDI)) / sum;
  }

  // First ADX = SMA of first `period` DX values starting at index `period`.
  let adxSum = 0;
  let count = 0;
  const start = period;
  const firstAdxIdx = start + period - 1;
  for (let i = start; i <= firstAdxIdx && i < candles.length; i++) {
    if (dx[i] != null) {
      adxSum += dx[i]!;
      count += 1;
    }
  }
  if (count === 0 || firstAdxIdx >= candles.length) return out;
  let adx = adxSum / count;
  out[firstAdxIdx] = adx;
  for (let i = firstAdxIdx + 1; i < candles.length; i++) {
    adx = (adx * (period - 1) + (dx[i] ?? 0)) / period;
    out[i] = adx;
  }
  return out;
}

/** SMA of volume for Volume MA overlay. */
export function computeVolumeMa(candles: Candle[], period = 20): (number | null)[] {
  return smaSeries(
    candles.map((c) => c.volume),
    Math.max(1, period),
  );
}

/** Last SMA of volume — O(period), for live tip updates. */
export function computeVolumeMaLast(candles: Candle[], period = 20): number | null {
  const n = Math.max(1, period);
  if (candles.length < n) return null;
  let sum = 0;
  for (let i = candles.length - n; i < candles.length; i++) sum += candles[i].volume;
  return sum / n;
}

function vwapAnchorKey(time: number, anchor: VwapIndicatorSettings["anchorPeriod"]): number {
  const d = new Date(time * 1000);
  if (anchor === "month") return d.getUTCFullYear() * 100 + (d.getUTCMonth() + 1);
  if (anchor === "week") {
    // ISO-ish week bucket: year*100 + week-of-year from Thursday-based week
    const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((day.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return day.getUTCFullYear() * 100 + week;
  }
  return Math.floor(time / 86400);
}

export function computeVwap(
  candles: Candle[],
  source: MaSource = "hlc3",
  anchorPeriod: VwapIndicatorSettings["anchorPeriod"] = "session",
): (number | null)[] {
  let pv = 0;
  let vol = 0;
  let key = Number.NaN;
  return candles.map((c) => {
    const nextKey = vwapAnchorKey(c.time, anchorPeriod);
    if (nextKey !== key) {
      pv = 0;
      vol = 0;
      key = nextKey;
    }
    const typical = candleSource(c, source);
    // Forex / zero-volume bars: fall back to equal weight (TWAP) so the line still plots.
    const weight = c.volume > 0 ? c.volume : 1;
    pv += typical * weight;
    vol += weight;
    return vol === 0 ? null : pv / vol;
  });
}

/** Full VWAP plot with source, anchor, offset, and optional hide on daily+. */
export function computeVwapPlot(
  candles: Candle[],
  settings: VwapIndicatorSettings,
  chartTf?: Timeframe,
): (number | null)[] {
  if (
    settings.hideOn1DOrAbove &&
    chartTf &&
    (chartTf === "1D" || chartTf === "1W" || chartTf === "1M")
  ) {
    return Array(candles.length).fill(null);
  }
  const values = computeVwap(candles, settings.source, settings.anchorPeriod);
  return applyOffset(values, settings.offset);
}

export function lastDefined(values: (number | null)[]): number | null {
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] != null) return values[i];
  }
  return null;
}

export function toLineData(
  candles: Candle[],
  values: (number | null)[],
): { time: import("lightweight-charts").UTCTimestamp; value: number }[] {
  const out: { time: import("lightweight-charts").UTCTimestamp; value: number }[] = [];
  for (let i = 0; i < candles.length; i++) {
    const v = values[i];
    if (v == null) continue;
    out.push({ time: candles[i].time as import("lightweight-charts").UTCTimestamp, value: v });
  }
  return out;
}
/** 
 * Price Momentum Oscillator (PMO) by DecisionPoint.
 * Double-smoothed 1-period rate of change with a signal line.
 */
export function computePmo(
  candles: Candle[],
  period1 = 35,
  period2 = 20,
  signalPeriod = 10,
  source: MaSource = "close",
): { pmo: (number | null)[]; signal: (number | null)[] } {
  const out: (number | null)[] = Array(candles.length).fill(null);
  
  if (candles.length < 2) {
    return { pmo: out, signal: Array(candles.length).fill(null) };
  }

  const src = candles.map((c) => candleSource(c, source));
  const k1 = 2 / period1;
  const k2 = 2 / period2;

  // Calculate 1-period rate of change
  const roc: (number | null)[] = Array(candles.length).fill(null);
  for (let i = 1; i < candles.length; i++) {
    if (src[i - 1] === 0) {
      roc[i] = null;
    } else {
      roc[i] = ((src[i] / src[i - 1]) * 100) - 100;
    }
  }

  // First smoothing
  const smooth1: (number | null)[] = Array(candles.length).fill(null);
  let s1: number | null = null;
  for (let i = 1; i < candles.length; i++) {
    if (roc[i] == null) continue;
    if (s1 == null) {
      s1 = roc[i]!;
      smooth1[i] = s1;
    } else {
      s1 = s1 + k1 * (roc[i]! - s1);
      smooth1[i] = s1;
    }
  }

  // Second smoothing (PMO line) - multiply by 10 for scale
  let pmo: number | null = null;
  for (let i = 1; i < candles.length; i++) {
    if (smooth1[i] == null) continue;
    if (pmo == null) {
      pmo = 10 * smooth1[i]!;
      out[i] = pmo;
    } else {
      pmo = pmo + k2 * (10 * smooth1[i]! - pmo);
      out[i] = pmo;
    }
  }

  // Signal line (EMA of PMO)
  const signal = emaOfNullable(out, signalPeriod);

  return { pmo: out, signal };
}
