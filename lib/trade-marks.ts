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

/**
 * Finds the open protective order (closePosition bracket) for one TP/SL leg.
 * The live order DTO collapses both bracket types to type "stop", so the leg
 * is matched by its stop price equaling the position's TP (or SL) value —
 * both figures come from the same server snapshot.
 */
export function findProtectiveOrderId(
  orders: Array<{ id: string; symbol: string; closePosition: boolean; price: number }>,
  symbol: string,
  leg: "tp" | "sl",
  tp: number | null,
  sl: number | null,
): string | null {
  const target = leg === "tp" ? tp : sl;
  if (target == null || !Number.isFinite(target)) return null;
  const match = orders.find(
    (o) => o.symbol === symbol && o.closePosition && Number(o.price) === target,
  );
  return match?.id ?? null;
}
