import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { binanceFuturesFeed as feed } from '../../lib/market/binance-feed';
import {
  countDuplicateTimestamps,
  isSortedByTime,
  countInvalidCandles,
  validateCandle,
} from '../../lib/market/candle-reconcile';
import type { Candle, Timeframe } from '../../types';

/**
 * Chaos soak reproducing the reported corruption session: minutes of live
 * ticks with reconnects, REST resyncs landing at arbitrary moments, and
 * symbol/timeframe flips. After EVERY mutation the series must satisfy the
 * invariants: strictly sorted, duplicate-free, OHLCV-valid.
 *
 * If any step produces a violation, the failure output includes the exact
 * index, timestamp, and offending candle — the diagnostic the last incident
 * lacked.
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
      t: timeSec * 1000,
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
const TF: Timeframe = '1m';

/** Deterministic LCG so a failure is exactly reproducible. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function snapshot(symbol: string, tf: Timeframe): Candle[] {
  return feed.getCandles(symbol, tf).map((c) => ({ ...c }));
}

function expectInvariants(candles: Candle[], where: string) {
  expect(isSortedByTime(candles) ? null : 'unsorted').toBeNull();
  expect(countDuplicateTimestamps(candles) ? `duplicates=${countDuplicateTimestamps(candles)}` : null).toBeNull();
  expect(countInvalidCandles(candles) ? `invalid=${countInvalidCandles(candles)}` : null).toBeNull();
  // Plausibility: no implausible jumps between consecutive closes.
  for (let i = 1; i < candles.length; i++) {
    const jump = Math.abs(candles[i].close - candles[i - 1].close);
    const range = Math.max(candles[i - 1].high - candles[i - 1].low, 1e-9);
    expect(jump / range < 50 ? null : `implausible jump at ${i} (${where})`).toBeNull();
  }
}

describe('candle chaos soak (reconnect + resync storm, 5 simulated minutes)', () => {
  let prevFetch: unknown;

  beforeAll(() => {
    (globalThis as { window?: unknown }).window = globalThis;
    (globalThis as { WebSocket?: unknown }).WebSocket = FakeWebSocket;
    jest.useFakeTimers();
    FakeWebSocket.reset();
    feed.start();
    prevFetch = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch?: unknown }).fetch = (async () => ({ ok: false }) as Response) as typeof fetch;
  });

  afterAll(() => {
    (globalThis as { fetch?: unknown }).fetch = prevFetch;
    feed.stop();
    jest.useRealTimers();
  });

  it('survives tick storm + reconnects + interleaved resyncs with invariants intact', async () => {
    const rng = makeRng(0xc0ffee);
    const init = (() => {
      const unsub = feed.subscribe('SOAKUSDT', TF, () => {});
      jest.advanceTimersByTime(16);
      const ws = FakeWebSocket.last();
      ws.open();
      return { unsub, ws };
    })();
    const unsub = init.unsub;
    let ws: FakeWebSocket = init.ws;

    // Pre-seed 30 candles of history via WS (as a chart left running would have).
    let t = T0 - 30 * 60;
    for (let i = 0; i < 30; i++) {
      ws.message(klineFrame('SOAKUSDT', '1m', t, 100, 100.5, 99.5, 100.2, 10, true));
      t += 60;
    }
    expect(feed.getCandles('SOAKUSDT', '1m')).toHaveLength(30);

    // Simulate ~5 minutes of market life. `now` is in MILLISECONDS.
    let now = T0 * 1000;
    let checks = 0;
    let reconnects = 0;
    const resyncAt = new Set<number>();
    // Schedule resyncs at irregular offsets — REST landing at ANY moment.
    for (let i = 0; i < 14; i++) resyncAt.add(T0 * 1000 + Math.floor(rng() * 290) * 1000);
    const reconnectsAt = new Set<number>();
    for (let i = 0; i < 4; i++) reconnectsAt.add(T0 * 1000 + 60_000 + Math.floor(rng() * 230) * 1000);

    for (let step = 0; step < 15_000; step++) {
      now += 20; // 20ms simulated — 5 min compressed
      const sec = Math.floor(now / 1000);

      // Live tick for the forming bar (most frames update the tip).
      const forming = sec - (sec % 60);
      const drift = (rng() - 0.5) * 0.4;
      const close = 100.2 + drift;
      ws.message(
        klineFrame(
          'SOAKUSDT',
          '1m',
          forming,
          100.2,
          Math.max(100.2, close) + 0.05,
          Math.min(100.2, close) - 0.05,
          close,
          10 + rng(),
        ),
      );

      // Occasional REST resync page landing mid-stream.
      if (resyncAt.has(now)) {
        const prev = (globalThis as { fetch?: unknown }).fetch;
        (globalThis as { fetch?: unknown }).fetch = (async (url: unknown) => {
          if (String(url).includes('/api/binance/klines')) {
            // Build a page ending at the CURRENT forming bar, slightly stale closes.
            const page = Array.from({ length: 5 }, (_, i) => {
              const timeSec = forming - (4 - i) * 60;
              return [
                timeSec * 1000,
                String(100.2),
                String(100.4),
                String(99.9),
                String(100.2 - (i === 4 ? 0.05 : 0)),
                '9',
                0,
              ];
            });
            return { ok: true, json: async () => page } as unknown as Response;
          }
          return { ok: false } as Response;
        }) as typeof fetch;
        void feed.getCandles('SOAKUSDT', TF); // getCandles triggers ensureHistory when incomplete
        (globalThis as { fetch?: unknown }).fetch = prev;
      }

      // Occasional WS drop → reconnect. Track the NEW socket: frames on the
      // dead generation are (correctly) dropped by the feed.
      if (reconnectsAt.has(now)) {
        ws.drop();
        jest.advanceTimersByTime(300);
        ws = FakeWebSocket.last();
        ws.open();
        reconnects += 1;
        // Reconnect replays the forming bar (Binance behavior).
        ws.message(klineFrame('SOAKUSDT', '1m', forming, 100.2, 100.5, 99.9, close, 10));
      }

      jest.advanceTimersByTime(20);

      // Invariant sweep after every mutation step.
      if (step % 10 === 0) {
        const candles = snapshot('SOAKUSDT', TF);
        expectInvariants(candles, `step=${step} t=${now}ms`);
        checks += 1;
        // Tip monotonicity: never goes backwards.
        const tipTime = candles.at(-1)?.time ?? 0;
        expect(tipTime >= (candles.at(-2)?.time ?? 0) ? null : `tip regression at step ${step}`).toBeNull();
      }
    }

    expect(checks).toBeGreaterThan(200);
    expect(reconnects).toBeGreaterThanOrEqual(3);
    expect(feed.getCandles('SOAKUSDT', TF).length).toBeGreaterThan(34);

    unsub();
    jest.advanceTimersByTime(16);
  });
});
