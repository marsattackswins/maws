import type { Candle } from "@/types";

/**
 * Pure payload normalizers for the Binance USDT-M feed (extracted from
 * BinanceFuturesFeed so they can be tested headless). Behavior is preserved
 * exactly — the feed class delegates to these without additional logic.
 */

export type BinanceKlineRow = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  ...unknown[],
];

/**
 * Parse REST `/fapi/v1/klines` rows into candles.
 * Drops rows with non-finite fields or close <= 0, and enforces strictly
 * increasing time (duplicates / out-of-order rows are skipped).
 * Time is converted ms → unix seconds.
 */
export function parseKlines(rows: BinanceKlineRow[]): Candle[] {
  const out: Candle[] = [];
  let prevTime = -1;
  for (const r of rows) {
    const time = Math.floor(Number(r[0]) / 1000);
    const open = Number(r[1]);
    const high = Number(r[2]);
    const low = Number(r[3]);
    const close = Number(r[4]);
    const volume = Number(r[5]);
    if (
      !Number.isFinite(time) ||
      !Number.isFinite(open) ||
      !Number.isFinite(high) ||
      !Number.isFinite(low) ||
      !Number.isFinite(close) ||
      close <= 0
    ) {
      continue;
    }
    if (time <= prevTime) continue;
    prevTime = time;
    out.push({ time, open, high, low, close, volume: Number.isFinite(volume) ? volume : 0 });
  }
  return out;
}

export type KlineMergeResult = "tip" | "append" | "patched" | "skipped";

/**
 * Merge one live kline WS frame into `candles` IN PLACE (array identity is
 * preserved for chart consumers) and report what happened:
 *   - "tip":     same open-time as the last bar → replaced (idempotent for
 *                duplicate/replayed frames)
 *   - "append":  newer bar → pushed (trimmed to `cap`)
 *   - "patched": older bar but the frame is the FINAL one (k.x === true) →
 *                patched into history when found
 *   - "skipped": stale, non-final frame → ignored (out-of-order / replay)
 *
 * @deprecated Use mergeLiveCandle from candle-reconcile.ts instead.
 * This function is kept for backward compatibility only.
 */
export function mergeLiveKline(
  candles: Candle[],
  frame: Candle,
  isFinal: boolean,
  cap: number,
): KlineMergeResult {
  const last = candles[candles.length - 1];
  if (last && last.time === frame.time) {
    candles[candles.length - 1] = { ...frame };
    return "tip";
  }
  if (!last || last.time < frame.time) {
    candles.push({ ...frame });
    if (candles.length > cap) candles.shift();
    return "append";
  }
  if (isFinal) {
    // Final closed frame for an older bar only.
    for (let i = candles.length - 2; i >= 0; i--) {
      if (candles[i].time === frame.time) {
        candles[i] = { ...frame };
        break;
      }
      if (candles[i].time < frame.time) break;
    }
    return "patched";
  }
  return "skipped";
}

/** Permissive inbound shape of a Binance futures miniTicker payload. */
export type MiniTickerPayload = {
  e?: string;
  /** Provider event time (ms since epoch). */
  E?: number;
  s?: string;
  c?: string;
  o?: string;
  h?: string;
  l?: string;
  v?: string;
  q?: string;
  /** Contract status: when present, only 1 (trading) is accepted. */
  st?: number;
};

/**
 * Event-time ordering gate for miniTicker frames.
 *
 * Documented equal-timestamp policy: a frame whose event time EQUALS the
 * latest accepted one is ACCEPTED (last arrival wins — Binance may re-emit or
 * correct within the same event millisecond, and re-applying is idempotent
 * downstream). Frames with a STRICTLY OLDER event time are dropped.
 * Frames with a missing/non-finite event time are always accepted so
 * non-conforming payloads degrade to arrival-order behavior instead of
 * silently starving the quote.
 */
export function isNewerTickerEvent(
  latestAcceptedEventTime: number | undefined,
  frameEventTime: number | undefined,
): boolean {
  if (frameEventTime == null || !Number.isFinite(frameEventTime)) return true;
  if (latestAcceptedEventTime == null || !Number.isFinite(latestAcceptedEventTime)) return true;
  return frameEventTime >= latestAcceptedEventTime;
}

export type MiniTickerNumbers = {
  last: number;
  open: number;
  high: number;
  low: number;
  volume: number;
};

/**
 * Numeric coercion for one miniTicker frame. Returns null when the frame must
 * be dropped (contract not in trading status). Callers keep the existing
 * validity gates (`Number.isFinite(last) && last > 0` after the live-chart
 * branch) — this function deliberately does not pre-filter them, matching the
 * original ordering of checks in BinanceFuturesFeed.applyMiniTicker.
 */
export function miniTickerNumbers(t: MiniTickerPayload): MiniTickerNumbers | null {
  if (t.st != null && t.st !== 1) return null;
  return {
    last: Number(t.c),
    open: Number(t.o),
    high: Number(t.h),
    low: Number(t.l),
    volume: Number(t.v),
  };
}
