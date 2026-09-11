import { describe, it, expect } from '@jest/globals';
import {
  parseKlines,
  mergeLiveKline,
  miniTickerNumbers,
  isNewerTickerEvent,
  type BinanceKlineRow,
} from '../../lib/market/feed-normalize';
import type { Candle } from '../../types';

/**
 * Headless tests for the extracted Binance payload normalizers
 * (lib/market/feed-normalize.ts). These are the exact functions the
 * production feed uses — no chart/UI/socket behavior involved.
 */

function row(
  timeMs: number,
  open: string | number,
  high: string | number,
  low: string | number,
  close: string | number,
  volume: string | number = '10',
): BinanceKlineRow {
  return [timeMs, String(open), String(high), String(low), String(close), String(volume), 0];
}

const T0 = 1_625_097_600; // 2021-06-30 00:00:00 UTC (seconds)

describe('parseKlines (REST payload normalization)', () => {
  it('converts ms timestamps to seconds and numeric strings to numbers', () => {
    const out = parseKlines([row(T0 * 1000, '100', '105', '99', '103', '500')]);
    expect(out).toEqual([{ time: T0, open: 100, high: 105, low: 99, close: 103, volume: 500 }]);
  });

  it('drops rows with non-finite prices', () => {
    const out = parseKlines([
      row(T0 * 1000, 'abc', '105', '99', '103'),
      row((T0 + 60) * 1000, '100', 'xyz', '99', '103'),
      row((T0 + 120) * 1000, '100', '105', 'NaN', '103'),
    ]);
    expect(out).toHaveLength(0);
  });

  it('coerces empty-string fields to 0 (finite) — only non-finite values are dropped', () => {
    const out = parseKlines([row(T0 * 1000, '100', '', '99', '103')]);
    expect(out).toHaveLength(1);
    expect(out[0].high).toBe(0);
  });

  it('drops rows with close <= 0', () => {
    const out = parseKlines([
      row(T0 * 1000, '100', '105', '99', '0'),
      row((T0 + 60) * 1000, '100', '105', '99', '-1'),
    ]);
    expect(out).toHaveLength(0);
  });

  it('normalizes non-finite volume to 0 but keeps the candle', () => {
    const out = parseKlines([row(T0 * 1000, '100', '105', '99', '103', 'garbage')]);
    expect(out).toHaveLength(1);
    expect(out[0].volume).toBe(0);
  });

  it('drops duplicate timestamps', () => {
    const out = parseKlines([
      row(T0 * 1000, '100', '105', '99', '103'),
      row(T0 * 1000, '103', '106', '102', '104'),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].close).toBe(103); // first occurrence wins
  });

  it('drops out-of-order rows (strictly increasing time enforced)', () => {
    const out = parseKlines([
      row((T0 + 120) * 1000, '100', '105', '99', '103'),
      row((T0 + 60) * 1000, '100', '105', '99', '102'), // older → skipped
      row((T0 + 180) * 1000, '103', '107', '101', '106'),
    ]);
    expect(out.map((c) => c.time)).toEqual([T0 + 120, T0 + 180]);
  });
});

function candle(time: number, close: number): Candle {
  return { time, open: close - 1, high: close + 1, low: close - 2, close, volume: 1 };
}

describe('mergeLiveKline (live kline frame merge)', () => {
  it('appends newer frames and reports append', () => {
    const candles: Candle[] = [candle(T0, 100)];
    expect(mergeLiveKline(candles, candle(T0 + 60, 102), false, 1500)).toBe('append');
    expect(candles).toHaveLength(2);
  });

  it('appends to an empty series', () => {
    const candles: Candle[] = [];
    expect(mergeLiveKline(candles, candle(T0, 100), false, 1500)).toBe('append');
    expect(candles).toHaveLength(1);
  });

  it('duplicate frame replaces the tip and is idempotent', () => {
    const candles: Candle[] = [candle(T0, 100)];
    const frame = candle(T0, 101);
    expect(mergeLiveKline(candles, frame, false, 1500)).toBe('tip');
    const afterFirst = JSON.stringify(candles);
    // Replaying the exact same frame leaves the series byte-identical.
    expect(mergeLiveKline(candles, frame, false, 1500)).toBe('tip');
    expect(JSON.stringify(candles)).toBe(afterFirst);
    expect(candles).toHaveLength(1);
    expect(candles[0].close).toBe(101);
  });

  it('preserves array identity (in-place merge)', () => {
    const candles: Candle[] = [candle(T0, 100)];
    const ref = candles;
    mergeLiveKline(candles, candle(T0 + 60, 102), false, 1500);
    expect(candles).toBe(ref);
  });

  it('trims to the cap on append', () => {
    const candles: Candle[] = [candle(T0, 100), candle(T0 + 60, 101)];
    mergeLiveKline(candles, candle(T0 + 120, 102), false, 2);
    expect(candles).toHaveLength(2);
    expect(candles[0].time).toBe(T0 + 60); // oldest shifted
    expect(candles[1].time).toBe(T0 + 120);
  });

  it('skips stale non-final frames (out-of-order replay)', () => {
    const candles: Candle[] = [candle(T0, 100), candle(T0 + 60, 101)];
    const before = JSON.stringify(candles);
    expect(mergeLiveKline(candles, candle(T0, 99), false, 1500)).toBe('skipped');
    expect(JSON.stringify(candles)).toBe(before);
  });

  it('patches an older bar when the frame is final', () => {
    const candles: Candle[] = [candle(T0, 100), candle(T0 + 60, 101)];
    expect(mergeLiveKline(candles, candle(T0, 105), true, 1500)).toBe('patched');
    expect(candles[0].close).toBe(105);
    expect(candles).toHaveLength(2);
  });

  it('final frame with no matching bar changes nothing', () => {
    const candles: Candle[] = [candle(T0 + 60, 101), candle(T0 + 120, 102)];
    const before = JSON.stringify(candles);
    expect(mergeLiveKline(candles, candle(T0, 105), true, 1500)).toBe('patched');
    expect(JSON.stringify(candles)).toBe(before);
  });

  it('final frame into a time gap stops scanning at the first older bar', () => {
    // Series has a gap: T0 and T0+120 exist, T0+60 is missing.
    const candles: Candle[] = [candle(T0, 100), candle(T0 + 120, 102)];
    const before = JSON.stringify(candles);
    expect(mergeLiveKline(candles, candle(T0 + 60, 101), true, 1500)).toBe('patched');
    expect(JSON.stringify(candles)).toBe(before); // no bar invented for the gap
  });
});

describe('miniTickerNumbers (miniTicker coercion)', () => {
  it('coerces string fields to numbers', () => {
    expect(
      miniTickerNumbers({ s: 'BTCUSDT', c: '50000.5', o: '49000', h: '51000', l: '48000', v: '123.4' }),
    ).toEqual({ last: 50000.5, open: 49000, high: 51000, low: 48000, volume: 123.4 });
  });

  it('accepts frames without a contract-status field', () => {
    expect(miniTickerNumbers({ c: '10' })).not.toBeNull();
  });

  it('accepts trading status st=1', () => {
    expect(miniTickerNumbers({ c: '10', st: 1 })).not.toBeNull();
  });

  it('drops non-trading contract statuses', () => {
    expect(miniTickerNumbers({ c: '10', st: 2 })).toBeNull();
    expect(miniTickerNumbers({ c: '10', st: 0 })).toBeNull();
  });

  it('reports missing/garbage price as NaN for the caller to gate', () => {
    const missing = miniTickerNumbers({ s: 'BTCUSDT' });
    expect(missing).not.toBeNull();
    expect(Number.isNaN(missing!.last)).toBe(true);
    const garbage = miniTickerNumbers({ c: 'oops' });
    expect(Number.isNaN(garbage!.last)).toBe(true);
  });
});

describe('isNewerTickerEvent (event-time ordering gate)', () => {
  it('accepts the first frame (no watermark yet)', () => {
    expect(isNewerTickerEvent(undefined, 1000)).toBe(true);
  });

  it('accepts strictly newer event times', () => {
    expect(isNewerTickerEvent(1000, 1001)).toBe(true);
  });

  it('drops strictly older event times (stale redelivery)', () => {
    expect(isNewerTickerEvent(1000, 999)).toBe(false);
  });

  it('accepts EQUAL event times — documented policy: last arrival wins', () => {
    // Binance may re-emit or correct within the same event millisecond;
    // re-applying is idempotent downstream, so equal is accepted.
    expect(isNewerTickerEvent(1000, 1000)).toBe(true);
  });

  it('tolerates missing or non-finite frame event times (arrival order)', () => {
    expect(isNewerTickerEvent(1000, undefined)).toBe(true);
    expect(isNewerTickerEvent(1000, Number.NaN)).toBe(true);
  });

  it('tolerates a missing or non-finite watermark', () => {
    expect(isNewerTickerEvent(undefined, 500)).toBe(true);
    expect(isNewerTickerEvent(Number.NaN, 500)).toBe(true);
  });
});
