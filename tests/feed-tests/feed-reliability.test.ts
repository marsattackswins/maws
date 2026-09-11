import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import {
  BINANCE_FAPI_WS,
  BINANCE_FAPI_WS_FALLBACK,
} from '../../lib/market/binance-intervals';
import { binanceFuturesFeed as feed } from '../../lib/market/binance-feed';
import type { Timeframe } from '../../types';

/**
 * Reliability tests around the EXISTING production feed path
 * (BinanceFuturesFeed, unchanged). Node seams only:
 *   - window     → globalThis (feed uses window.setTimeout/clearTimeout)
 *   - WebSocket  → FakeWebSocket (captures connections; tests drive events)
 *   - fetch      → { ok: false } (REST history/tickers stay empty)
 *
 * Covered scenarios:
 *   - duplicate kline event            → idempotent tip merge
 *   - stale / out-of-order kline frame → skipped (non-final) / patched (final)
 *   - malformed / missing price payload→ ignored (series & quotes untouched)
 *   - reconnect replay                 → replayed frames never duplicate bars;
 *                                        messages on the dead socket are dropped
 *   - disconnect handling              → exponential backoff reconnect, host
 *                                        failover, silent-open watchdog,
 *                                        backoff reset on data
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

let emissions: Array<{ len: number; lastClose: number }> = [];

function subscribeKline(symbol: string, tf: Timeframe = '1m') {
  emissions = [];
  const unsub = feed.subscribe(symbol, tf, (candles) => {
    emissions.push({
      len: candles.length,
      lastClose: candles.length > 0 ? candles[candles.length - 1].close : NaN,
    });
  });
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

describe('live kline path (chart candles) — existing behavior under fault injection', () => {
  it('duplicate kline events are idempotent (tip merge, no duplicate bars)', () => {
    const { unsub, ws } = subscribeKline('DUPUSDT');

    ws.message(klineFrame('DUPUSDT', '1m', T0, 100, 105, 99, 103, 10));
    expect(feed.getCandles('DUPUSDT', '1m')).toHaveLength(1);

    // Exact replay of the same frame (and a revised same-bar frame) — still 1 bar.
    ws.message(klineFrame('DUPUSDT', '1m', T0, 100, 105, 99, 103, 10));
    ws.message(klineFrame('DUPUSDT', '1m', T0, 100, 106, 99, 104, 12));
    const candles = feed.getCandles('DUPUSDT', '1m');
    expect(candles).toHaveLength(1);
    expect(candles[0].close).toBe(104); // tip holds the latest revision
    expect(emissions.length).toBeGreaterThan(0);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('stale non-final frames are skipped; final stale frames patch history', () => {
    const { unsub, ws } = subscribeKline('STALEUSDT');

    ws.message(klineFrame('STALEUSDT', '1m', T0, 100, 105, 99, 103, 10));
    ws.message(klineFrame('STALEUSDT', '1m', T0 + 60, 103, 107, 102, 106, 11));

    // Out-of-order replay of an OLD non-final frame → ignored.
    ws.message(klineFrame('STALEUSDT', '1m', T0, 90, 91, 89, 90, 5));
    let candles = feed.getCandles('STALEUSDT', '1m');
    expect(candles).toHaveLength(2);
    expect(candles[0].close).toBe(103); // untouched

    // FINAL frame for the old bar (k.x=true) → patched into history.
    ws.message(klineFrame('STALEUSDT', '1m', T0, 100, 108, 98, 105, 20, true));
    candles = feed.getCandles('STALEUSDT', '1m');
    expect(candles).toHaveLength(2);
    expect(candles[0].close).toBe(105);
    expect(candles[0].high).toBe(108);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('malformed and missing-price payloads leave the series untouched', () => {
    const { unsub, ws } = subscribeKline('BADUSDT');

    ws.message(klineFrame('BADUSDT', '1m', T0, 100, 105, 99, 103, 10));
    const before = JSON.stringify(feed.getCandles('BADUSDT', '1m'));

    ws.message('this is not json'); // JSON.parse throws → caught
    ws.message({ hello: 'world' }); // not a kline event
    ws.message({ ...klineFrame('BADUSDT', '1m', T0 + 60, 100, 105, 99, 103, 10), k: undefined });
    // Garbage close (NaN) and non-positive close are rejected by applyKline.
    const bad = klineFrame('BADUSDT', '1m', T0 + 60, 100, 105, 99, 103, 10);
    ws.message({ ...bad, k: { ...bad.k, c: 'abc' } });
    ws.message({ ...bad, k: { ...bad.k, c: '0' } });
    ws.message({ ...bad, k: { ...bad.k, c: '-5' } });

    expect(JSON.stringify(feed.getCandles('BADUSDT', '1m'))).toBe(before);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('reconnect replay never duplicates bars; dead sockets are ignored', () => {
    const { unsub, ws } = subscribeKline('RECONUSDT');

    ws.message(klineFrame('RECONUSDT', '1m', T0, 100, 105, 99, 103, 10));
    ws.message(klineFrame('RECONUSDT', '1m', T0 + 60, 103, 107, 102, 106, 11));
    expect(feed.getCandles('RECONUSDT', '1m')).toHaveLength(2);

    // Disconnect → 300ms backoff → fresh socket (reconnect).
    ws.drop();
    jest.advanceTimersByTime(300);
    const ws2 = FakeWebSocket.last();
    expect(ws2).not.toBe(ws);
    ws2.open();

    // Messages arriving on the DEAD socket are dropped by the generation guard.
    ws.message(klineFrame('RECONUSDT', '1m', T0 + 120, 106, 109, 105, 108, 9));
    expect(feed.getCandles('RECONUSDT', '1m')).toHaveLength(2);

    // Reconnect replay: Binance re-sends the forming bar → still 2 bars (tip merge).
    ws2.message(klineFrame('RECONUSDT', '1m', T0 + 60, 103, 107, 102, 106, 11));
    expect(feed.getCandles('RECONUSDT', '1m')).toHaveLength(2);

    // Genuinely new data on the new socket applies.
    ws2.message(klineFrame('RECONUSDT', '1m', T0 + 120, 106, 109, 105, 108, 9));
    expect(feed.getCandles('RECONUSDT', '1m')).toHaveLength(3);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('combined-stream envelopes ({stream, data}) are accepted', () => {
    const { unsub, ws } = subscribeKline('ENVUSDT');
    ws.message({
      stream: 'envusdt@kline_1m',
      data: klineFrame('ENVUSDT', '1m', T0, 100, 105, 99, 103, 10),
    });
    expect(feed.getCandles('ENVUSDT', '1m')).toHaveLength(1);

    unsub();
    jest.advanceTimersByTime(16);
  });
});

describe('disconnect handling — existing reconnect machinery', () => {
  it('backs off exponentially, fails over hosts, and resets on data', () => {
    const { unsub, ws } = subscribeKline('BACKOFFUSDT');
    expect(ws.url.startsWith(BINANCE_FAPI_WS)).toBe(true);

    // 1st failure → 300ms backoff.
    ws.drop();
    const countAfterFirst = FakeWebSocket.instances.length;
    jest.advanceTimersByTime(299);
    expect(FakeWebSocket.instances.length).toBe(countAfterFirst); // not yet
    jest.advanceTimersByTime(1);
    const ws2 = FakeWebSocket.last();
    expect(ws2).not.toBe(ws);

    // 2nd failure → 600ms backoff and host failover (attempt >= 2).
    ws2.drop();
    jest.advanceTimersByTime(600);
    const ws3 = FakeWebSocket.last();
    expect(ws3).not.toBe(ws2);
    expect(ws3.url.startsWith(BINANCE_FAPI_WS_FALLBACK)).toBe(true);

    // Data on the new socket resets the backoff counter.
    ws3.open();
    ws3.message(klineFrame('BACKOFFUSDT', '1m', T0, 100, 105, 99, 103, 10));
    ws3.drop();
    const countBefore = FakeWebSocket.instances.length;
    jest.advanceTimersByTime(300); // would be 1200+ without the reset
    expect(FakeWebSocket.instances.length).toBe(countBefore + 1);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('a silent connection (open but no frames) fails over after 2.5s', () => {
    const { unsub, ws } = subscribeKline('SILENTUSDT');
    const countAfter = FakeWebSocket.instances.length;
    const startedOnFallback = ws.url.startsWith(BINANCE_FAPI_WS_FALLBACK);

    jest.advanceTimersByTime(2500); // watchdog fires: still no frame
    const ws2 = FakeWebSocket.last();
    expect(FakeWebSocket.instances.length).toBe(countAfter + 1);
    expect(ws2).not.toBe(ws);
    // Watchdog flips the host tier regardless of which one the socket used.
    const otherHost = startedOnFallback ? BINANCE_FAPI_WS : BINANCE_FAPI_WS_FALLBACK;
    expect(ws2.url.startsWith(otherHost)).toBe(true);

    unsub();
    jest.advanceTimersByTime(16);
  });
});

describe('miniTicker path (quotes incl. paper-trade trigger input)', () => {
  it('applies valid frames, ignores malformed/duplicate frames, survives replay', () => {
    feed.setHotSymbols(['ETHUSDT']); // → connects the quote socket synchronously
    const qws = FakeWebSocket.last();
    expect(qws.url).toContain('ethusdt@miniTicker');
    qws.open();

    const tick = {
      e: '24hrMiniTicker',
      s: 'ETHUSDT',
      c: '3000',
      o: '2900',
      h: '3050',
      l: '2850',
      v: '100',
      q: '1',
    };
    qws.message(tick);
    expect(feed.getQuote('ETHUSDT').last).toBe(3000);

    // Malformed payloads must not corrupt the quote.
    qws.message({ ...tick, c: 'garbage' });
    qws.message({ ...tick, c: undefined });
    qws.message({ ...tick, c: '-1' });
    qws.message({ ...tick, st: 2 }); // contract not trading
    qws.message('not json at all');
    expect(feed.getQuote('ETHUSDT').last).toBe(3000);

    // Duplicate frame → identical state.
    qws.message(tick);
    expect(feed.getQuote('ETHUSDT').last).toBe(3000);

    // Disconnect → 400ms backoff → reconnect; replaying the last frame is safe.
    qws.drop();
    jest.advanceTimersByTime(400);
    const qws2 = FakeWebSocket.last();
    expect(qws2).not.toBe(qws);
    qws2.open();
    qws2.message(tick);
    expect(feed.getQuote('ETHUSDT').last).toBe(3000);
    // And fresh data still moves the quote.
    qws2.message({ ...tick, c: '3010' });
    expect(feed.getQuote('ETHUSDT').last).toBe(3010);

    feed.setHotSymbols([]); // releases the quote socket
  });

  it('batches quote emissions (~150ms debounce) for UI listeners', () => {
    feed.setHotSymbols(['SOLUSDT']);
    const qws = FakeWebSocket.last();
    qws.open();

    let emissions = 0;
    const unsub = feed.subscribeQuotes(() => {
      emissions += 1;
    });
    const baseline = emissions; // subscribeQuotes emits once synchronously

    const tick = {
      e: '24hrMiniTicker',
      s: 'SOLUSDT',
      c: '150',
      o: '148',
      h: '151',
      l: '147',
      v: '10',
      q: '1',
    };
    qws.message(tick);
    qws.message({ ...tick, c: '150.5' });
    qws.message({ ...tick, c: '151' });
    expect(emissions).toBe(baseline); // nothing until the debounce fires

    jest.advanceTimersByTime(150);
    expect(emissions).toBe(baseline + 1); // one batched emission
    expect(feed.getQuote('SOLUSDT').last).toBe(151);

    unsub();
    feed.setHotSymbols([]);
  });

  it('miniTicker event-time ordering: older events ignored, equal accepted', () => {
    feed.setHotSymbols(['ORDUSDT']);
    const qws = FakeWebSocket.last();
    qws.open();
    const base = {
      e: '24hrMiniTicker',
      s: 'ORDUSDT',
      o: '10',
      h: '12',
      l: '9',
      v: '1',
      q: '1',
    };

    qws.message({ ...base, E: 1000, c: '100' });
    expect(feed.getQuote('ORDUSDT').last).toBe(100);

    // Strictly older redelivery (e.g. reconnect replay of a stale event).
    qws.message({ ...base, E: 900, c: '999' });
    expect(feed.getQuote('ORDUSDT').last).toBe(100); // ignored

    // Equal event time → accepted (documented: last arrival wins).
    qws.message({ ...base, E: 1000, c: '101' });
    expect(feed.getQuote('ORDUSDT').last).toBe(101);

    // Newer → accepted.
    qws.message({ ...base, E: 1100, c: '102' });
    expect(feed.getQuote('ORDUSDT').last).toBe(102);

    // Missing event time → tolerated (arrival-order fallback).
    qws.message({ ...base, c: '103' });
    expect(feed.getQuote('ORDUSDT').last).toBe(103);

    // An older event after a missing-E frame is still dropped once a newer
    // stamped event re-establishes the watermark.
    qws.message({ ...base, E: 1200, c: '104' });
    qws.message({ ...base, E: 1150, c: '999' });
    expect(feed.getQuote('ORDUSDT').last).toBe(104);

    feed.setHotSymbols([]);
  });

  it('accepted quotes reach the trade channel synchronously before the UI debounce', () => {
    feed.setHotSymbols(['IMMUSDT']);
    const qws = FakeWebSocket.last();
    qws.open();

    let tradeEmissions = 0;
    let uiEmissions = 0;
    const unsubTrade = feed.subscribeTradeQuotes(() => {
      tradeEmissions += 1;
    });
    const unsubUi = feed.subscribeQuotes(() => {
      uiEmissions += 1;
    });
    const tradeBase = tradeEmissions; // both channels emit once on subscribe
    const uiBase = uiEmissions;

    const tick = {
      e: '24hrMiniTicker',
      s: 'IMMUSDT',
      o: '49',
      h: '51',
      l: '48',
      v: '1',
      q: '1',
    };
    qws.message({ ...tick, E: 1, c: '50' });
    expect(tradeEmissions).toBe(tradeBase + 1); // synchronous, pre-debounce
    expect(uiEmissions).toBe(uiBase); // UI still debounced

    qws.message({ ...tick, E: 2, c: '51' });
    expect(tradeEmissions).toBe(tradeBase + 2); // every accepted mutation
    expect(uiEmissions).toBe(uiBase);

    jest.advanceTimersByTime(150);
    expect(uiEmissions).toBe(uiBase + 1); // UI catches up, batched

    unsubTrade();
    unsubUi();
    feed.setHotSymbols([]);
  });
});

describe('kline freshness: connecting → live → delayed → coordinated recovery', () => {
  it('a new subscription is CONNECTING — not live — until the first valid frame', () => {
    const { unsub, ws } = subscribeKline('CONUSDT');

    // Subscribing alone never makes the chart appear live.
    expect(feed.getKlineStatus('CONUSDT', '1m')).toBe('connecting');
    expect(feed.getKlineStatus('CONUSDT', '1m')).not.toBe('live');

    // First valid live frame flips it to live.
    ws.message(klineFrame('CONUSDT', '1m', T0, 100, 105, 99, 103, 10));
    expect(feed.getKlineStatus('CONUSDT', '1m')).toBe('live');

    unsub();
    expect(feed.getKlineStatus('CONUSDT', '1m')).toBe('idle');
    jest.advanceTimersByTime(16);
  });

  it('missing initial frame becomes DELAYED at the 5-second threshold', () => {
    const { unsub } = subscribeKline('DELUSDT');

    // Just under the threshold: still connecting. (The subscribe helper
    // already advanced the clock 16ms, so 4_983 + 16 = 4_999 elapsed.)
    jest.advanceTimersByTime(4_983);
    expect(feed.getKlineStatus('DELUSDT', '1m')).toBe('connecting');

    // At the threshold: delayed warning.
    jest.advanceTimersByTime(1);
    expect(feed.getKlineStatus('DELUSDT', '1m')).toBe('delayed');
    expect(feed.isKlineDelayed('DELUSDT', '1m')).toBe(true);

    // The first valid frame (on whichever socket is current) clears delayed.
    const ws = FakeWebSocket.last();
    ws.message(klineFrame('DELUSDT', '1m', T0, 100, 105, 99, 103, 10));
    expect(feed.getKlineStatus('DELUSDT', '1m')).toBe('live');
    expect(feed.isKlineDelayed('DELUSDT', '1m')).toBe(false);

    unsub();
    jest.advanceTimersByTime(16);
  });

  it('15-second recovery: REST resync + ONE backoff-controlled reconnect; no duplicates while in flight', async () => {
    const fetchCalls: string[] = [];
    const prevFetch = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch?: unknown }).fetch = async (url: unknown) => {
      fetchCalls.push(String(url));
      return { ok: false } as Response;
    };

    try {
      const { unsub } = subscribeKline('RECOVUSDT');
      const klinesCalls = () => fetchCalls.filter((u) => u.includes('/api/binance/klines')).length;

      // Just under the recovery threshold: delayed, but no recovery action
      // beyond the subscribe-time history backfill.
      await jest.advanceTimersByTimeAsync(14_000);
      const callsAt14s = klinesCalls();
      const socketsAt14s = FakeWebSocket.instances.length;
      expect(feed.getKlineStatus('RECOVUSDT', '1m')).toBe('delayed');
      expect(feed.isKlineRecovering('RECOVUSDT', '1m')).toBe(false);

      // Past 15s the checker starts ONE coordinated recovery (REST resync +
      // socket handed to backoff). 3.5s covers the checker phase (<=1s) plus
      // the 300ms first-backoff reconnect regardless of tick alignment.
      await jest.advanceTimersByTimeAsync(3_500);
      expect(feed.isKlineRecovering('RECOVUSDT', '1m')).toBe(true);
      expect(klinesCalls()).toBeGreaterThan(callsAt14s);
      // Exactly ONE new socket: the backoff-controlled reconnect.
      expect(FakeWebSocket.instances.length).toBe(socketsAt14s + 1);
      const newWs = FakeWebSocket.last();

      // While the recovery is in flight, further checker ticks must NOT force
      // additional reconnects or recoveries.
      await jest.advanceTimersByTimeAsync(4_000);
      expect(FakeWebSocket.instances.length).toBe(socketsAt14s + 1);
      expect(feed.isKlineRecovering('RECOVUSDT', '1m')).toBe(true);
      expect(feed.getKlineStatus('RECOVUSDT', '1m')).toBe('delayed');

      // A fresh valid frame clears delayed AND recovery state.
      newWs.open();
      newWs.message(klineFrame('RECOVUSDT', '1m', T0, 100, 105, 99, 103, 10));
      expect(feed.getKlineStatus('RECOVUSDT', '1m')).toBe('live');
      expect(feed.isKlineRecovering('RECOVUSDT', '1m')).toBe(false);

      unsub();
      jest.advanceTimersByTime(16);
    } finally {
      (globalThis as { fetch?: unknown }).fetch = prevFetch;
    }
  });

  it('a frameless completed reconnect releases recovery for the next backoff-controlled retry', async () => {
    const prevFetch = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch?: unknown }).fetch = async () => ({ ok: false }) as Response;

    try {
      const { unsub } = subscribeKline('RELUSDT');

      // Recovery #1 triggers past 15s (16.5s covers the checker phase).
      await jest.advanceTimersByTimeAsync(16_500);
      expect(feed.isKlineRecovering('RELUSDT', '1m')).toBe(true);

      // Its backoff reconnect completes — still no frames. (+1.5s covers the
      // 300ms backoff regardless of checker tick alignment.)
      await jest.advanceTimersByTimeAsync(1_500);
      const socketsAfterR1 = FakeWebSocket.instances.length;

      // After the release window (15s frameless post-recovery with a
      // completed reconnect), the flag is released and the NEXT checker pass
      // starts recovery #2 — exactly one additional backoff cycle, not one
      // per checker tick.
      await jest.advanceTimersByTimeAsync(18_000);
      expect(feed.isKlineRecovering('RELUSDT', '1m')).toBe(true);
      expect(FakeWebSocket.instances.length).toBe(socketsAfterR1 + 1);

      unsub();
      jest.advanceTimersByTime(16);
    } finally {
      (globalThis as { fetch?: unknown }).fetch = prevFetch;
    }
  });
});
