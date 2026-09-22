import type { Candle } from "@/types";

/**
 * Pure candle reconciliation utilities for merging REST history with live
 * WebSocket updates. All functions are deterministic and side-effect free.
 *
 * Invariants enforced:
 * 1. Candles are uniquely identified by their open timestamp (seconds)
 * 2. Timestamps are strictly increasing (no duplicates, no out-of-order)
 * 3. OHLCV values pass basic sanity checks
 * 4. Updates to existing candles replace the entire candle
 * 5. The result is always sorted by timestamp
 */

export type CandleValidationError =
  | "non-finite-time"
  | "non-finite-ohlcv"
  | "negative-price"
  | "invalid-high-low"
  | "negative-volume";

/**
 * Validate a single candle's OHLCV integrity.
 * Returns null if valid, or an error code if invalid.
 */
export function validateCandle(c: Candle): CandleValidationError | null {
  // Time must be finite
  if (!Number.isFinite(c.time)) {
    return "non-finite-time";
  }

  // All OHLC values must be finite
  if (
    !Number.isFinite(c.open) ||
    !Number.isFinite(c.high) ||
    !Number.isFinite(c.low) ||
    !Number.isFinite(c.close)
  ) {
    return "non-finite-ohlcv";
  }

  // Prices must be positive
  if (c.open <= 0 || c.close <= 0) {
    return "negative-price";
  }

  // High must be >= max(open, close, low)
  // Low must be <= min(open, close, high)
  if (c.high < Math.max(c.open, c.close, c.low)) {
    return "invalid-high-low";
  }
  if (c.low > Math.min(c.open, c.close, c.high)) {
    return "invalid-high-low";
  }

  // Volume must be non-negative and finite
  if (!Number.isFinite(c.volume) || c.volume < 0) {
    return "negative-volume";
  }

  return null;
}

/**
 * Build a Map<timestamp, Candle> from an array of candles.
 * Invalid candles are silently dropped.
 * Duplicate timestamps: last wins.
 */
export function buildCandleMap(candles: Candle[]): Map<number, Candle> {
  const map = new Map<number, Candle>();
  for (const c of candles) {
    if (validateCandle(c) !== null) continue;
    map.set(c.time, { ...c });
  }
  return map;
}

/**
 * Convert a Map<timestamp, Candle> back to a sorted array.
 * Result is always sorted by timestamp ascending.
 */
export function mapToSortedCandles(map: Map<number, Candle>): Candle[] {
  const arr = Array.from(map.values());
  arr.sort((a, b) => a.time - b.time);
  return arr;
}

/**
 * Normalize a candle timestamp to unix seconds — the unit Lightweight Charts
 * expects for UTCTimestamp data and the unit every series in this app stores.
 * Providers (and some replays) emit ms; a mixed-unit series renders as a
 * cluster of compressed bars at the far right of the chart plus a long dead
 * span, because ms values are ~1000× larger than s values.
 */
export function normalizeCandleTime(c: Candle): Candle {
  if (!Number.isFinite(c.time)) return c;
  return c.time > 1e12 ? { ...c, time: Math.floor(c.time / 1000) } : c;
}

/**
 * Merge one incoming candle into an existing Map.
 * - If the timestamp doesn't exist, insert it
 * - If the timestamp exists, replace the entire candle
 * Returns true if the map was modified, false if the candle was invalid.
 */
export function upsertCandle(map: Map<number, Candle>, incoming: Candle): boolean {
  const c = normalizeCandleTime(incoming);
  if (validateCandle(c) !== null) return false;
  map.set(c.time, { ...c });
  return true;
}

/**
 * Merge multiple incoming candles into an existing Map.
 * Returns the count of candles that were successfully upserted.
 */
export function upsertCandles(map: Map<number, Candle>, incoming: Candle[]): number {
  let count = 0;
  for (const c of incoming) {
    if (upsertCandle(map, c)) count++;
  }
  return count;
}

/**
 * Reconcile REST history with a live WebSocket tip.
 *
 * Strategy:
 * - Build a map from all candles (both REST and live)
 * - Timestamp-based deduplication (last wins)
 * - Sort by timestamp
 * - Cap to maxLength
 *
 * This ensures:
 * - No duplicate timestamps
 * - Live tip is preserved if it's the latest
 * - REST history backfill doesn't create gaps
 * - All candles pass validation
 */
export function reconcileCandleSeries(
  restHistory: Candle[],
  liveCandles: Candle[],
  maxLength: number,
): Candle[] {
  const map = new Map<number, Candle>();

  // Add REST history first
  upsertCandles(map, restHistory);

  // Add live candles (overwrites any conflicting timestamps from REST)
  upsertCandles(map, liveCandles);

  // Convert to sorted array
  let result = mapToSortedCandles(map);

  // Cap to maxLength, keeping the most recent candles
  if (result.length > maxLength) {
    result = result.slice(result.length - maxLength);
  }

  return result;
}

/**
 * Merge a live WebSocket candle update into an existing series IN PLACE.
 * This is the optimized hot path for live updates.
 *
 * Returns a result code:
 * - "tip": updated the last candle (same timestamp)
 * - "append": appended a new candle (newer timestamp)
 * - "replaced": replaced an older candle (only if isFinal is true)
 * - "invalid": candle failed validation
 * - "duplicate": exact same candle already exists
 *
 * The series array is modified in place (preserved identity for React).
 * Cap enforcement: if appending causes length > cap, removes oldest.
 */
export type LiveMergeResult = "tip" | "append" | "replaced" | "invalid" | "duplicate";

export function mergeLiveCandle(
  series: Candle[],
  rawIncoming: Candle,
  isFinal: boolean,
  cap: number,
  intervalSec?: number,
): LiveMergeResult {
  // Normalize ms → s first: a ms-unit tip colliding with a s-unit series is
  // the exact corruption that compresses candles into the right edge.
  const incoming = normalizeCandleTime(rawIncoming);

  // Validate first
  if (validateCandle(incoming) !== null) {
    return "invalid";
  }

  const last = series[series.length - 1];

  // Case 0: Interval-aware merge (when the caller knows the bar spacing).
  // A frame opening at/after the next interval boundary always appends a new
  // bar; a frame inside the current bar's window updates the tip in place
  // (keeping the on-grid open time); anything at or before the tip falls
  // through to the exact-match / final-patch logic below so a late FINAL
  // frame for the just-closed bar can still patch history.
  if (intervalSec != null && intervalSec > 0 && last) {
    const diff = incoming.time - last.time;
    if (diff >= intervalSec) {
      series.push({ ...incoming });
      if (series.length > cap) {
        series.shift();
      }
      return "append";
    }
    if (diff > 0) {
      // Mid-interval frame for the forming bar — same bar, keep grid time.
      series[series.length - 1] = { ...incoming, time: last.time };
      return "tip";
    }
  }

  // Case 1: Update to the current forming candle (most common)
  if (last && last.time === incoming.time) {
    // Check if it's actually different to avoid unnecessary mutations
    if (
      last.open === incoming.open &&
      last.high === incoming.high &&
      last.low === incoming.low &&
      last.close === incoming.close &&
      last.volume === incoming.volume
    ) {
      return "duplicate";
    }
    series[series.length - 1] = { ...incoming };
    return "tip";
  }

  // Case 2: New candle (newer timestamp)
  if (!last || last.time < incoming.time) {
    series.push({ ...incoming });
    if (series.length > cap) {
      series.shift();
    }
    return "append";
  }

  // Case 3: Update to an older candle (only if isFinal)
  if (isFinal) {
    // Find and replace the matching timestamp
    for (let i = series.length - 2; i >= 0; i--) {
      if (series[i].time === incoming.time) {
        series[i] = { ...incoming };
        return "replaced";
      }
      // Stop searching if we've gone past the target timestamp
      if (series[i].time < incoming.time) {
        break;
      }
    }
  }

  // Case 4: Stale non-final update for an older timestamp - ignore
  return "duplicate";
}

/**
 * Get duplicate timestamp count in a candle array.
 * Used for diagnostics and invariant checking.
 */
export function countDuplicateTimestamps(candles: Candle[]): number {
  const seen = new Set<number>();
  let duplicates = 0;
  for (const c of candles) {
    if (seen.has(c.time)) {
      duplicates++;
    } else {
      seen.add(c.time);
    }
  }
  return duplicates;
}

/**
 * Detect a mixed-unit series: a run of s-unit bars followed by ms-unit bars
 * (or the reverse). This is the exact shape produced when one code path
 * stores seconds and another stores milliseconds — on the chart it shows as
 * all candles compressed against one edge. Mixed units can never be a valid
 * strictly-increasing series at real bar spacing, so any overlap in the
 * sorted timestamp distribution is suspicious.
 */
export function hasMixedTimeUnits(candles: Candle[]): boolean {
  if (candles.length < 2) return false;
  const ms = candles.filter((c) => c.time > 1e12).length;
  return ms > 0 && ms < candles.length;
}

/**
 * Check if candles are sorted by timestamp (strictly increasing).
 */
export function isSortedByTime(candles: Candle[]): boolean {
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].time <= candles[i - 1].time) {
      return false;
    }
  }
  return true;
}

/**
 * Get the count of invalid candles in an array.
 */
export function countInvalidCandles(candles: Candle[]): number {
  let count = 0;
  for (const c of candles) {
    if (validateCandle(c) !== null) count++;
  }
  return count;
}
