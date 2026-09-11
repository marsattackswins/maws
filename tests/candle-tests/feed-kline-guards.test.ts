import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { binanceFuturesFeed as feed } from '../../lib/market/binance-feed';
import { isDiagnosticsEnabled } from '../../lib/market/candle-diagnostics';
import {
  countDuplicateTimestamps,
  isSortedByTime,
  countInvalidCandles,
} from '../../lib/market/candle-reconcile';
import type { Candle, Timeframe } from '../../types';

/**
 * Feed-level candle-pipeline guards (BinanceFuturesFeed routing + normalization):
 *   - kline frames for a symbol that is not subscribed are rejected (invariant 7)
 *   - kline frames for a known interval map to the right app timeframe, and
 *     unknown intervals are rejected (invariants 7/8)
 *   - WS open-time arrives in ms and is normalized to seconds exactly once
 *     (invariants 1/11)
 *   - a full REST-then-WS sequence keeps the series sorted, duplicate-free and
 *     OHLCV-valid after every step (invariants 2/3/12)
 *   - unsubscribe is idempotent and re-subscribing does not duplicate bars
 *     (invariants 8/9/10)
 *   - candle diagnostics are low-noise by default (disabled unless the env
 *     flag is set)
 */

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  url: string;
  onopen: ((ev?: unknown) => void) | null = null;
  onmessage: ((ev: { data: string }) => void) | null = null;
  onclose: ((ev?: unknown) => void) | null = null;
  onerror: ((ev?: unknown) => void) | null = null;
  closed = false;

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  close() {
    this.closed = true;
  }

  open() {
    this.onopen?.();
  }

  message(data: unknown) {
    this.onmessage?.({ data: typeof data === 'string' ? data : JSON.stringify(data) });
  }

  drop() {
    this.onclose?.();
  }

  static last(): FakeWebSocket {
    return FakeWebSocket.instances[FakeWebSocket.instances.length - 1];
  }

  static reset() {
    FakeWebSocket.instances = [];
  }
}

function klineFrame(
  binanceSym: string,
  interval: string,
  timeSec: number,
  o: number,
  h: number,
  l: number,
  c: number,
  v: number,
  x = false,
) {
  return {
    e: 'kline',
    s: binanceSym,
    k: {
      t: timeSec * 1000, // Binance sends open time in MILLISECONDS
      T: timeSec * 1000 + 59_999,
      s: binanceSym,
      i: interval,
      o: String(o),
      h: String(h),
      l: String(l),
      c: String(c),
      v: String(v),
      x,
    },
  };
}

const T0 = 1_625_097_600;

function snapshot(symbol: string, tf: Timeframe): Candle[] {
  return feed.getCandles(symbol, tf).map((c) => ({ ...c }));
}

/** Structural invariant sweep applied to a series after every mutation. */
function expectInvariants(candles: Candle[], tf: Timeframe = '1m') {
  expect(isSortedByTime(candles)).toBe(true);
  expect(countDuplicateTimestamps(candles)).toBe(0);
  expect(countInvalidCandles(candles)).toBe(0);
  // Timestamps align to the timeframe grid (seconds, not ms).
  const gridSec: Record<Timeframe, number> = {
    '1m': 60, '3m': 180, '5m': 300, '15m': 900, '30m': 1800,
    '1h': 3600, '2h': 7200, '4h': 14400, '1D': 86_400, '1W': 604_800, '1M': 2_592_000,
  };
  for (const c of candles) {
    expect(c.time % gridSec[tf]).toBe(0);
  }
}

function subscribeKline(symbol: string, tf: Timeframe = '1m') {
  const unsub = feed.subscribe(symbol, tf, () => {});
  jest.advanceTimersByTime(16); // kline stream sync debounce
  const ws = FakeWebSocket.last();
  ws.open();
  return { unsub, ws };
}

beforeAll(() => {
  (globalThis as { window?: unknown }).window = globalThis;
  (globalThis as { WebSocket?: unknown }).WebSocket = FakeWebSocket;
  (globalThis as { fetch?: unknown }).fetch = async () => ({ ok: false }) as Response;
  jest.useFakeTimers();
  FakeWebSocket.reset();
  feed.start();
});

afterAll(() => {
  feed.stop();
  jest.useRealTimers();
});

describe('feed-level kline guards (invariants 7/8: routing)', () => {
  it('rejects frames for a symbol that is not subscribed', () => {
    const { unsub, ws } = subscribeKline('GUARDUSDT');

    // BTCUSDT is not subscribed here — its frame must not touch GUARDUSDT
    // or create a series for BTCUSDT.
    ws.message(klineFrame('BTCUSDT', '1m', T0, 50000, 50010, 49990, 50005, 1));
    expect(feed.getCandles('GUARDUSDT', '1m')).toHaveLength(0);
    expect(feed.getCandles('BTCUSDT', '1m')).toHaveLength(0);

    // A frame for the subscribed symbol still lands.
    ws.message(klineFrame('GUARDUSDT', '1m', T0, 100, 105, 99, 103, 10));
    expect(feed.getCandles('GUARDUSDT', '1m')).toHaveLength(1);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('maps the interval to the right timeframe and rejects unknown intervals', () => {
    const { unsub, ws } = subscribeKline('IVUSDT', '5m');

    ws.message(klineFrame('IVUSDT', '5m', T0, 100, 105, 99, 103, 10));
    expect(feed.getCandles('IVUSDT', '5m')).toHaveLength(1);

    // A 1m frame is a DIFFERENT timeframe: must not touch the 5m series.
    ws.message(klineFrame('IVUSDT', '1m', T0 + 60, 100, 105, 99, 103, 10));
    expect(feed.getCandles('IVUSDT', '5m')).toHaveLength(1);
    expect(feed.getCandles('IVUSDT', '1m')).toHaveLength(0); // not subscribed

    // Unknown/garbage interval → no timeframe match → dropped.
    ws.message(klineFrame('IVUSDT', '7m', T0 + 300, 100, 105, 99, 103, 10));
    ws.message(klineFrame('IVUSDT', '', T0 + 300, 100, 105, 99, 103, 10));
    expect(feed.getCandles('IVUSDT', '5m')).toHaveLength(1);

    // Case-sensitivity: '5M' is not the 5m interval.
    ws.message(klineFrame('IVUSDT', '5M', T0 + 300, 100, 105, 99, 103, 10));
    expect(feed.getCandles('IVUSDT', '5m')).toHaveLength(1);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('never accepts a wrong-interval frame into any series (no listeners → no-op)', () => {
    const { unsub } = subscribeKline('MULTIUSDT', '1m');
    feed.subscribe('MULTIUSDT', '5m', () => {});
    jest.advanceTimersByTime(16);
    // Adding a stream rebuilds the combined socket — use the live one.
    const ws = FakeWebSocket.last();

    // 1m frame must go only to the 1m series.
    ws.message(klineFrame('MULTIUSDT', '1m', T0, 100, 105, 99, 103, 10));
    expect(feed.getCandles('MULTIUSDT', '1m')).toHaveLength(1);
    expect(feed.getCandles('MULTIUSDT', '5m')).toHaveLength(0);

    // 5m frame must go only to the 5m series.
    ws.message(klineFrame('MULTIUSDT', '5m', T0, 100, 105, 99, 103, 10));
    expect(feed.getCandles('MULTIUSDT', '5m')).toHaveLength(1);
    expect(feed.getCandles('MULTIUSDT', '1m')).toHaveLength(1); // unchanged

    unsub();
    jest.advanceTimersByTime(16);
    unsub();
    jest.advanceTimersByTime(16);
  });
});

describe('feed-level normalization (invariants 1/11)', () => {
  it('normalizes WS open-time ms → seconds exactly once', () => {
    const { unsub, ws } = subscribeKline('MSUSDT');

    ws.message(klineFrame('MSUSDT', '1m', T0, 100, 105, 99, 103, 10));
    const candles = feed.getCandles('MSUSDT', '1m');
    expect(candles).toHaveLength(1);
    // t arrived as T0*1000 ms; internal canonical value is T0 seconds.
    expect(candles[0].time).toBe(T0);
    expect(candles[0].time).toBeLessThan(10_000_000_000); // seconds, not ms

    // A second frame with the same ms open time merges as the SAME candle.
    ws.message(klineFrame('MSUSDT', '1m', T0, 100, 106, 99, 104, 12));
    expect(feed.getCandles('MSUSDT', '1m')).toHaveLength(1);
    expect(feed.getCandles('MSUSDT', '1m')[0].close).toBe(104);

    unsub();
    jest.advanceTimersByTime(16);
  });
});

describe('feed-level full sequence (invariants 2/3/12 after every step)', () => {
  it('keeps the series sorted, duplicate-free and valid through REST + WS flow', async () => {
    const { unsub, ws } = subscribeKline('SEQUSDT');

    // REST history arrives via the same fetch seam the feed uses.
    const restRows = Array.from({ length: 5 }, (_, i) => [
      (T0 - (5 - i) * 60) * 1000,
      String(100 + i),
      String(105 + i),
      String(99 + i),
      String(103 + i),
      '10',
      0,
    ]);
    const prevFetch = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch?: unknown }).fetch = (async (url: unknown) => {
      if (String(url).includes('/api/binance/klines')) {
        return { ok: true, json: async () => restRows } as unknown as Response;
      }
      return { ok: false } as Response;
    }) as typeof fetch;
    void feed.getCandles('SEQUSDT', '1m'); // triggers ensureHistory
    await jest.advanceTimersByTimeAsync(0); // let the history task settle

    let candles = snapshot('SEQUSDT', '1m');
    expect(candles).toHaveLength(5);
    expectInvariants(candles);

    // Live WS updates on top of REST history.
    ws.message(klineFrame('SEQUSDT', '1m', T0, 100, 108, 98, 107, 25)); // tip update
    candles = snapshot('SEQUSDT', '1m');
    expect(candles).toHaveLength(6);
    expect(candles[5].close).toBe(107);
    expectInvariants(candles);

    ws.message(klineFrame('SEQUSDT', '1m', T0 + 60, 107, 110, 106, 109, 8)); // new bar
    candles = snapshot('SEQUSDT', '1m');
    expect(candles).toHaveLength(7);
    expect(candles[6].time).toBe(T0 + 60);
    expectInvariants(candles);

    // Duplicate + stale frames leave the series untouched.
    ws.message(klineFrame('SEQUSDT', '1m', T0 + 60, 107, 110, 106, 109, 8)); // exact replay
    ws.message(klineFrame('SEQUSDT', '1m', T0 - 60, 90, 91, 89, 90, 1)); // stale non-final
    candles = snapshot('SEQUSDT', '1m');
    expect(candles).toHaveLength(7);
    expect(candles[6].close).toBe(109);
    expectInvariants(candles);

    (globalThis as { fetch?: unknown }).fetch = prevFetch;
    unsub();
    jest.advanceTimersByTime(16);
  });
});

describe('subscription lifecycle (invariants 8/9/10)', () => {
  it('double-unsubscribe is safe; cache drops with the last listener; resubscribe rebuilds cleanly', () => {
    const { unsub, ws } = subscribeKline('LIFEUSDT');

    ws.message(klineFrame('LIFEUSDT', '1m', T0, 100, 105, 99, 103, 10));
    ws.message(klineFrame('LIFEUSDT', '1m', T0 + 60, 103, 107, 102, 106, 11));
    expect(feed.getCandles('LIFEUSDT', '1m')).toHaveLength(2);

    unsub();
    jest.advanceTimersByTime(16);
    expect(() => {
      unsub(); // second call must not throw or resurrect state
    }).not.toThrow();
    // Last listener gone on a non-hot symbol → cold cache is dropped
    // (documented forgetSymbol behavior: no stale series survives).
    // Frames on the now-dead socket are ignored (generation guard).
    ws.message(klineFrame('LIFEUSDT', '1m', T0 + 120, 106, 109, 105, 108, 9));
    expect(feed.getCandles('LIFEUSDT', '1m')).toHaveLength(0);

    // Re-subscribe: fresh series, no duplicates carried over; WS replay
    // of the forming bar starts a clean series (REST backfill stubbed off).
    let pushes = 0;
    const unsub2 = feed.subscribe('LIFEUSDT', '1m', () => {
      pushes += 1;
    });
    jest.advanceTimersByTime(16);
    const ws2 = FakeWebSocket.last();
    ws2.open();
    ws2.message(klineFrame('LIFEUSDT', '1m', T0 + 60, 103, 107, 102, 106, 11));
    ws2.message(klineFrame('LIFEUSDT', '1m', T0 + 60, 103, 107, 102, 106, 11)); // replay dupe
    ws2.message(klineFrame('LIFEUSDT', '1m', T0 + 120, 106, 109, 105, 108, 9));
    const candles = feed.getCandles('LIFEUSDT', '1m');
    expect(candles).toHaveLength(2);
    expect(isSortedByTime(candles)).toBe(true);
    expect(countDuplicateTimestamps(candles)).toBe(0);
    expect(pushes).toBeGreaterThan(0);

    unsub2();
    jest.advanceTimersByTime(16);
  });
});

describe('diagnostics stay low-noise (default off)', () => {
  it('candle diagnostics are disabled unless explicitly enabled', () => {
    expect(isDiagnosticsEnabled()).toBe(false);
  });
});
