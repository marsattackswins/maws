import type { Timeframe } from "@/types";

export const TIMEFRAMES: { id: Timeframe; label: string; seconds: number }[] = [
  { id: "1m", label: "1m", seconds: 60 },
  { id: "3m", label: "3m", seconds: 180 },
  { id: "5m", label: "5m", seconds: 300 },
  { id: "15m", label: "15m", seconds: 900 },
  { id: "30m", label: "30m", seconds: 1800 },
  { id: "1h", label: "1h", seconds: 3600 },
  { id: "2h", label: "2h", seconds: 7200 },
  { id: "4h", label: "4h", seconds: 14400 },
  { id: "1D", label: "D", seconds: 86400 },
  { id: "1W", label: "W", seconds: 604800 },
  { id: "1M", label: "M", seconds: 2592000 },
];

export function timeframeSeconds(tf: Timeframe): number {
  return TIMEFRAMES.find((t) => t.id === tf)?.seconds ?? 60;
}

export function timeframeLabel(tf: Timeframe): string {
  return TIMEFRAMES.find((t) => t.id === tf)?.label ?? tf;
}

export function alignTime(unix: number, seconds: number): number {
  return Math.floor(unix / seconds) * seconds;
}
