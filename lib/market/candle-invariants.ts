import type { Candle } from "@/types";

/**
 * Development-only invariant asserts for the candle store.
 *
 * These run in dev builds (and under any explicit debug flag) to surface a
 * regression at the EXACT offending frame instead of as "corrupted candles"
 * in the rendered chart minutes later. In production they are no-ops.
 *
 * The asserts deliberately THROW: a silent console.warn is how the last
 * corruption shipped unnoticed. Dev builds should crash loudly on a violated
 * invariant; the error message carries everything needed to identify the
 * source (which operation, which symbol/timeframe, the offending candle).
 */

const DEV =
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/** Extra opt-in switch so diagnostics tooling can enable asserts in a prod build. */
const DEBUG_FLAG =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_DEBUG_CANDLES === "true";

export function areCandleAssertsEnabled(): boolean {
  return DEV || DEBUG_FLAG;
}

export type CandleInvariantContext = {
  /** Which store operation was running, e.g. "applyKline(merge tip)" or "mergeRestHistory". */
  op: string;
  /** Series identity, e.g. "BTCUSDT:15m". */
  label: string;
  /** The candle that triggered the violation, when one exists. */
  incoming?: Candle;
};

export class CandleInvariantError extends Error {
  constructor(message: string, readonly context: CandleInvariantContext) {
    super(`[candle-invariant] ${message} (op=${context.op}, series=${context.label})`);
    this.name = "CandleInvariantError";
  }
}

function fmt(c: Candle | undefined): string {
  if (!c) return "(none)";
  return `time=${c.time} o=${c.open} h=${c.high} l=${c.low} c=${c.close} v=${c.volume}`;
}

/**
 * Assert the series is strictly sorted by open time with no duplicate
 * timestamps and every candle passes OHLCV validation.
 *
 * O(n) per call — the store calls this after batch mutations (REST merge,
 * reconnect resync) and after any append. Tip updates replace one element
 * and cannot break sort order when the store only permits same-time or
 * newer-time tips, so the store uses the cheap tail check for those.
 */
export function assertSeriesInvariants(
  candles: Candle[],
  ctx: CandleInvariantContext,
): void {
  if (!areCandleAssertsEnabled()) return;

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];

    // Sort order + duplicate timestamps.
    if (i > 0 && c.time <= candles[i - 1].time) {
      throw new CandleInvariantError(
        `unsorted/duplicate at index ${i}: ${fmt(c)} follows ${fmt(candles[i - 1])}`,
        ctx,
      );
    }

    // OHLCV sanity (mirror of validateCandle, but throwing with the index).
    if (
      !Number.isFinite(c.time) ||
      !Number.isFinite(c.open) ||
      !Number.isFinite(c.high) ||
      !Number.isFinite(c.low) ||
      !Number.isFinite(c.close) ||
      !Number.isFinite(c.volume)
    ) {
      throw new CandleInvariantError(
        `non-finite OHLCV at index ${i}: ${fmt(c)}`,
        ctx,
      );
    }
    if (c.open <= 0 || c.close <= 0) {
      throw new CandleInvariantError(
        `non-positive price at index ${i}: ${fmt(c)}`,
        ctx,
      );
    }
    if (c.high < Math.max(c.open, c.close, c.low)) {
      throw new CandleInvariantError(
        `high < max(o,c,l) at index ${i}: ${fmt(c)}`,
        ctx,
      );
    }
    if (c.low > Math.min(c.open, c.close, c.high)) {
      throw new CandleInvariantError(
        `low > min(o,c,h) at index ${i}: ${fmt(c)}`,
        ctx,
      );
    }
    if (c.volume < 0) {
      throw new CandleInvariantError(
        `negative volume at index ${i}: ${fmt(c)}`,
        ctx,
      );
    }
  }
}

/**
 * Cheap tail check for the hot path (a single WS frame merge). Verifies the
 * tip still relates sanely to its predecessor: strictly newer or same-time
 * replacement. A violation here means the store is about to go unsorted.
 */
export function assertTailInvariant(
  candles: Candle[],
  ctx: CandleInvariantContext,
): void {
  if (!areCandleAssertsEnabled()) return;

  const n = candles.length;
  if (n < 2) return;
  const tip = candles[n - 1];
  const prev = candles[n - 2];
  if (tip.time < prev.time) {
    throw new CandleInvariantError(
      `tail out of order: tip ${fmt(tip)} is older than prev ${fmt(prev)}`,
      ctx,
    );
  }
  if (tip.time === prev.time) {
    throw new CandleInvariantError(
      `duplicate tail timestamp: ${fmt(tip)} duplicates ${fmt(prev)}`,
      ctx,
    );
  }
}
