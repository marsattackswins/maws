import type { Candle, ChartSettings } from "@/types";

export const CHART_STYLES: { id: ChartSettings["candleStyle"]; label: string }[] = [
  { id: "hollow", label: "Hollow candles" },
  { id: "solid", label: "Solid candles" },
  { id: "heikinashi", label: "Heikin Ashi" },
  { id: "bars", label: "OHLC bars" },
  { id: "line", label: "Line" },
  { id: "area", label: "Area" },
  { id: "baseline", label: "Baseline" },
];

export function heikinAshi(candles: Candle[]): Candle[] {
  const out: Candle[] = [];
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const prev = out[i - 1];
    const close = (c.open + c.high + c.low + c.close) / 4;
    const open = prev ? (prev.open + prev.close) / 2 : (c.open + c.close) / 2;
    out.push({
      time: c.time,
      open,
      close,
      high: Math.max(c.high, open, close),
      low: Math.min(c.low, open, close),
      volume: c.volume,
    });
  }
  return out;
}

export function styleCandles(candles: Candle[], style: ChartSettings["candleStyle"]): Candle[] {
  return style === "heikinashi" ? heikinAshi(candles) : candles;
}

export function isLineStyle(style: ChartSettings["candleStyle"]) {
  return style === "line" || style === "area" || style === "baseline";
}
