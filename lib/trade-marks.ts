import type { ChartPosition } from "@/types";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function liquidationPrice(pos: Pick<ChartPosition, "side" | "entry" | "leverage">) {
  const lev = Math.max(1, pos.leverage);
  const buffer = 0.9 / lev;
  return pos.side === "long" ? pos.entry * (1 - buffer) : pos.entry * (1 + buffer);
}

export function defaultProtect(entry: number, side: "long" | "short") {
  if (side === "long") {
    return { tp: entry * 1.012, sl: entry * 0.994 };
  }
  return { tp: entry * 0.988, sl: entry * 1.006 };
}
