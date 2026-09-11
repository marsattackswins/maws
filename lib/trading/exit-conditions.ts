import type { ChartPosition } from "@/types";

/** Position slice required for exit evaluation. */
export type ExitCheckPosition = Pick<ChartPosition, "side" | "tp" | "sl" | "liq">;

export type ExitCondition = { px: number; reason: "tp" | "sl" | "liq" };

/**
 * Tick-level exit evaluation used by the paper-trading engine (`tickMock`).
 *
 * Production semantics — read before asserting anything about this function:
 * - The engine evaluates exits ONLY against the latest tick price (`last`).
 *   There is NO OHLC candle simulation in production and NO same-candle
 *   resolution: the engine cannot know whether TP or SL was touched first
 *   inside a candle — it only sees the ticks the market feed delivers.
 * - If a single tick breaches several levels at once, priority is
 *   liquidation > stop loss > take profit, and the fill price is the
 *   level price, not the tick price.
 *
 * @returns null if no condition is met, otherwise { px, reason }
 */
export function resolveExitCondition(
  pos: ExitCheckPosition,
  last: number,
): ExitCondition | null {
  const hitTp = pos.tp != null && (pos.side === "long" ? last >= pos.tp : last <= pos.tp);
  const hitSl = pos.sl != null && (pos.side === "long" ? last <= pos.sl : last >= pos.sl);
  const hitLiq = pos.liq != null && (pos.side === "long" ? last <= pos.liq : last >= pos.liq);

  if (!hitTp && !hitSl && !hitLiq) return null;

  // Priority: liquidation > stop loss > take profit
  const px = hitLiq ? pos.liq! : hitSl ? pos.sl! : pos.tp!;
  const reason: "tp" | "sl" | "liq" = hitLiq ? "liq" : hitSl ? "sl" : "tp";

  return { px, reason };
}
