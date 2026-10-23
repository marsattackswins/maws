/**
 * vela-break-times.ts — session-break geometry shared by the overlay and the
 * native renderer layer.
 *
 * `SessionBreaks` owns the computation (MAWS keeps computing, Vela only paints)
 * and pushes day-boundary times through the `maws-session-breaks` layer. The
 * layer paints from the chart's OWN bars, so it can drop any break the chart has
 * no bars for — a payload computed from a deeper (or differently synchronised)
 * feed otherwise keeps times the chart never loaded, and Vela's time→x
 * extrapolation paints them as floating dashes in the empty right-hand space.
 */
import { timeframeSeconds } from "@/lib/timeframes";
import type { Candle, Timeframe } from "@/types";

/** Just the bar field the clipping needs — `Candle` and Vela's `OHLCV` both fit. */
export type BreakBar = { time: number };

/** UTC day bucket — same key VWAP session anchor uses (`floor(unix / 86400)`). */
export function utcDayKey(unixSec: number): number {
  return Math.floor(unixSec / 86400);
}

/** First bar of each UTC calendar day (sub-daily only). Aligns with session VWAP resets. */
export function sessionBreakTimes(candles: Candle[], timeframe: Timeframe): number[] {
  if (timeframeSeconds(timeframe) > 1_800 || candles.length < 2) return [];
  const out: number[] = [];
  let prev = utcDayKey(candles[0]!.time);
  for (let i = 1; i < candles.length; i++) {
    const key = utcDayKey(candles[i]!.time);
    if (key !== prev) {
      out.push(candles[i]!.time);
      prev = key;
    }
  }
  return out;
}

/**
 * Keep only the breaks that sit BETWEEN two loaded bars (epoch ms in and out).
 *
 * A separator past the chart's newest bar belongs to bars this chart does not
 * hold, and one before its oldest has nothing above it: both would land in the
 * empty right-hand whitespace (or off the left edge). Dropping them keeps a
 * separator meaning what it says — the boundary between two real sessions.
 */
export function clipBreaksToBars(
  timesMs: readonly number[],
  bars: readonly BreakBar[],
): number[] {
  if (bars.length < 2) return [];
  const first = bars[0]!.time;
  const last = bars[bars.length - 1]!.time;
  if (!(last > first)) return [];
  return timesMs.filter((t) => Number.isFinite(t) && t > first && t <= last);
}
