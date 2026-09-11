/**
 * Page Visibility lifecycle regression tests for the candle feed.
 *
 * Chrome-only intermittent chart corruption root cause: the 1s kline-health
 * watchdog evaluated staleness across Chrome's background-tab timer
 * throttling — a parked tab produced multi-second timer gaps that looked
 * exactly like a dead stream, triggering mid-bar REST resyncs + socket
 * recycles that raced incoming WebSocket frames. These tests pin the new
 * contract:
 *
 *   1. hidden tab + delayed timers → no reconnect, no destructive resync
 *   2. visible transition          → ONE debounced, generation-gated,
 *      non-destructive reconcile; no duplicate subscription/socket
 *   3. stale responses from an old generation are ignored (reconcile gate)
 *   4. StrictMode-like mount→cleanup→remount leaves ONE active subscription
 *      and one kline socket (generation churn aside)
 *   5. a delayed scheduled watchdog callback does not falsely mark the
 *      stream dead (event-loop gap is attributed, not read as staleness)
 *   6. a real socket close still reconnects (hidden or visible)
 *
 * Node seams mirror feed-reliability.test.ts: window → globalThis,
 * WebSocket → FakeWebSocket. `document` is stubbed before feed.start() so
 * the visibility tracker's real listener wiring runs end-to-end.
 */

import { describe, it, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals";
import { binanceFuturesFeed as feed, resetFeedLifecycleForTests } from "../../lib/market/binance-feed";
import { visibilityTracker } from "../../lib/market/visibility";
import type { Timeframe } from "../../types";

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  url: string;
  onopen: ((ev?: unknown) => void) | null = null;
  onmessage: ((ev: { data: string }) => void) | null = null;
  onclose: ((ev?: unknown) => void) | null = null;
  onerror: ((ev?: unknown) => void) | null = null;
  closed = false;
  closeCalls = 0;

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  close() {
    this.closed = true;
    this.closeCalls += 1;
  }

  open() {
    this.onopen?.();
  }

  message(data: unknown) {
    this.onmessage?.({ data: typeof data === "string" ? data : JSON.stringify(data) });
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
    e: "kline",
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

let historyRequests = 0;
let historyResponder: ((sym: string, interval: string) => unknown[]) | null = null;

/**
 * Default history: one valid bar just before the first WS tip, so the
 * initial REST fetch SUCCEEDS (historyReady set, no backoff retries) and
 * candle counts stay predictable. Tests override per-case when needed.
 */
function defaultHistoryRows(_sym: string, _interval: string) {
  // Binance REST row shape: [openTime, o, h, l, c, volume, ...]. Enough valid
  // bars to pass the feed's completeness window (>= 10) so the initial fetch
  // SUCCEEDS and later getCandles() calls do not trigger refetches that
  // would pollute history-request counts.
  const rows: unknown[][] = [];
  for (let i = 12; i >= 1; i -= 1) {
    rows.push([(T0 - 60 * i) * 1000, "99", "104", "98", "100", "9"]);
  }
  return rows;
}

/** Stub document with a given visibilityState (listener wiring intact). */
function stubDocument(state: "visible" | "hidden") {
  const doc = globalThis as { document?: unknown };
  doc.document = {
    visibilityState: state,
    addEventListener: (_t: string, fn: () => void) => {
      (doc.document as { __onVis?: () => void }).__onVis = fn;
    },
    removeEventListener: () => {},
  };
}

/**
 * Fresh document stub + tracker re-install. The tracker binds its
 * visibilitychange listener to the document object present at install() time,
 * so every new stub needs reset()+install() BEFORE feed.start() re-subscribes
 * the feed's onChange (reset clears tracker listeners; start re-adds them).
 */
function freshDocument(state: "visible" | "hidden") {
  stubDocument(state);
  visibilityTracker.reset();
  visibilityTracker.install();
}

/** Fire a real visibilitychange through the tracker's own listener. */
function setVisibility(state: "visible" | "hidden") {
  const doc = (globalThis as { document?: { visibilityState: string; __onVis?: () => void } }).document;
  if (!doc) throw new Error("document not stubbed");
  doc.visibilityState = state;
  doc.__onVis?.();
}

beforeAll(() => {
  (globalThis as { window?: unknown }).window = globalThis;
  (globalThis as { WebSocket?: unknown }).WebSocket = FakeWebSocket;
  (globalThis as { fetch?: unknown }).fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/api/binance/klines")) {
      historyRequests += 1;
      const u = new URL(url, "https://localhost");
      const responder = historyResponder ?? defaultHistoryRows;
      const rows = responder(u.searchParams.get("symbol") ?? "", u.searchParams.get("interval") ?? "");
      return { ok: true, json: async () => rows } as Response;
    }
    return { ok: false } as Response;
  }) as typeof fetch;
  stubDocument("visible");
  visibilityTracker.reset();
  visibilityTracker.install();
  jest.useFakeTimers();
  // Anchor the fake wall clock to the test data epoch so bar-age math
  // (visible-return reconcile staleness, retry backoff) is consistent, and
  // make performance.now() track fake time — the feed stamps freshness with
  // monotonic time, which under fake timers would otherwise never advance.
  jest.setSystemTime(T0 * 1000);
  jest.spyOn(performance, "now").mockImplementation(() => Date.now() - T0 * 1000);
});

afterAll(() => {
  feed.stop();
  jest.useRealTimers();
});

afterEach(() => {
  resetFeedLifecycleForTests();
  historyResponder = null;
  historyRequests = 0;
  jest.clearAllTimers();
});

/** Fresh feed lifecycle: restart singleton, subscribe one series, open socket. */
function startAndSubscribe(symbol: string, tf: Timeframe = "1m") {
  FakeWebSocket.reset();
  resetFeedLifecycleForTests();
  freshDocument("visible");
  feed.stop();
  feed.start();
  jest.advanceTimersByTime(1); // quote stream sync debounce
  const unsub = feed.subscribe(symbol, tf, () => {});
  jest.advanceTimersByTime(16); // kline stream sync debounce
  const ws = FakeWebSocket.last();
  ws.open();
  return { unsub, ws };
}

describe("hidden tab with delayed timers (Chrome background throttling)", () => {
  it("does not reconnect, resync, or drop candles while hidden", async () => {
    const { unsub, ws } = startAndSubscribe("HIDUSDT");
    await jest.advanceTimersByTimeAsync(0); // flush ensureHistory microtasks
    ws.message(klineFrame("HIDUSDT", "1m", T0, 100, 105, 99, 103, 10));
    expect(feed.getCandles("HIDUSDT", "1m")).toHaveLength(13); // 12 REST + 1 live
    const socketsBefore = FakeWebSocket.instances.length;
    const historyBefore = historyRequests;

    setVisibility("hidden");

    // Chrome parks the tab: watchdog fires late / far apart (35s gap ≫ 30s).
    await jest.advanceTimersByTimeAsync(35_000);
    // No socket recycle/close, no new socket, no REST resync.
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);
    expect(ws.closed).toBe(false);
    expect(ws.closeCalls).toBe(0);
    expect(historyRequests).toBe(historyBefore);
    expect(feed.getCandles("HIDUSDT", "1m")).toHaveLength(13);

    // Even far beyond the recovery threshold, hidden stays hands-off.
    await jest.advanceTimersByTimeAsync(60_000);
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);
    expect(historyRequests).toBe(historyBefore);

    // Live WS frames still flow while hidden (Chrome throttles timers, not
    // sockets) and must keep applying: no destructive path interferes.
    ws.message(klineFrame("HIDUSDT", "1m", T0 + 60, 103, 107, 102, 106, 11));
    expect(feed.getCandles("HIDUSDT", "1m")).toHaveLength(14);

    // Back to visible: no deferred damage surfaces either (no socket churn,
    // no forced resync — the tip is only ~1 bar old, well under the
    // reconcile staleness threshold).
    setVisibility("visible");
    await jest.advanceTimersByTimeAsync(2_000);
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);

    unsub();
    await jest.advanceTimersByTimeAsync(16);
  });

  it("on visible, performs one debounced non-destructive reconcile without new sockets", async () => {
    const { unsub, ws } = startAndSubscribe("VISUSDT");
    await jest.advanceTimersByTimeAsync(0);
    ws.message(klineFrame("VISUSDT", "1m", T0, 100, 105, 99, 103, 10));
    const socketsBefore = FakeWebSocket.instances.length;
    const streamKeyBefore = ws.url;
    const historyBefore = historyRequests;

    setVisibility("hidden");
    await jest.advanceTimersByTimeAsync(65_000); // parked tab
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);
    // Realistic hidden tab: WebSocket frames keep flowing (Chrome throttles
    // timers, not sockets), so the tip stays fresh across the whole park.
    ws.message(klineFrame("VISUSDT", "1m", T0 + 60, 103, 107, 102, 106, 11));
    expect(feed.getCandles("VISUSDT", "1m")).toHaveLength(14);

    setVisibility("visible");
    const reconcilesBefore = visibilityTracker.getReconcilesTriggered();
    // Inside the debounce window: nothing has happened yet.
    await jest.advanceTimersByTimeAsync(200);
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);
    // After the debounce: still exactly one socket, same URL, candles intact,
    // and exactly ONE reconcile ran (fresh tip → no resync needed).
    await jest.advanceTimersByTimeAsync(400);
    expect(visibilityTracker.getReconcilesTriggered()).toBe(reconcilesBefore + 1);
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);
    expect(FakeWebSocket.last().url).toBe(streamKeyBefore);
    expect(feed.getCandles("VISUSDT", "1m")).toHaveLength(14);
    // No duplicate subscription → still exactly one kline stream connection.
    expect(FakeWebSocket.instances.filter((w) => w.url.includes("kline")).length).toBe(socketsBefore);

    // Feed stays live afterwards; no forced recycle on the next watchdog
    // pass. The reconcile performed exactly ONE merge-only REST resync —
    // necessary here because the tip predates the 65s park (bars closed
    // while hidden) — and the socket was never touched.
    await jest.advanceTimersByTimeAsync(2_000);
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);
    expect(historyRequests).toBe(historyBefore + 1); // one merge-only resync
    expect(feed.getKlineStatus("VISUSDT", "1m")).toBe("live");

    unsub();
    await jest.advanceTimersByTimeAsync(16);
  });
});

describe("visible transition generation gating", () => {
  it("ignores a scheduled reconcile whose generation went stale", async () => {
    const { unsub, ws } = startAndSubscribe("GENUSDT");
    await jest.advanceTimersByTimeAsync(0);
    ws.message(klineFrame("GENUSDT", "1m", T0, 100, 105, 99, 103, 10));

    setVisibility("hidden");
    await jest.advanceTimersByTimeAsync(65_000);
    setVisibility("visible");
    await jest.advanceTimersByTimeAsync(100);

    // Symbol swap during the debounce window bumps the kline generation.
    const genBefore = (feed as unknown as { klineWsGeneration: number }).klineWsGeneration;
    const unsub2 = feed.subscribe("OTHERUSDT", "1m", () => {});
    await jest.advanceTimersByTimeAsync(16);
    const genAfter = (feed as unknown as { klineWsGeneration: number }).klineWsGeneration;
    expect(genAfter).toBeGreaterThan(genBefore);

    // Debounce fires — the scheduled generation no longer matches → skipped.
    const historyAtGate = historyRequests;
    const socketsAtGate = FakeWebSocket.instances.length;
    await jest.advanceTimersByTimeAsync(500);
    expect(historyRequests).toBe(historyAtGate); // gated reconcile did nothing

    // Post-gate stream churn (stream-set change socket) may exist, but the
    // stale-generation reconcile itself must not have fired a resync.
    expect(FakeWebSocket.instances.length).toBeLessThanOrEqual(socketsAtGate + 1);

    unsub2();
    await jest.advanceTimersByTimeAsync(16);
    unsub();
    await jest.advanceTimersByTimeAsync(16);
  });
});

describe("StrictMode-like mount → cleanup → remount", () => {
  it("leaves exactly one active subscription and one live kline socket", async () => {
    FakeWebSocket.reset();
    resetFeedLifecycleForTests();
    freshDocument("visible");
    feed.stop();
    feed.start();
    await jest.advanceTimersByTimeAsync(1);

    let live = 0;
    // mount #1 (its initial REST paint fires the listener before unsub, so
    // `live` is read as a post-cleanup baseline below)
    let unsub = feed.subscribe("STRICTUSDT", "1m", () => {
      live += 1;
    });
    await jest.advanceTimersByTimeAsync(16);
    // cleanup #1 (StrictMode)
    unsub();
    const liveBaseline = live; // initial paints already counted
    await jest.advanceTimersByTimeAsync(16);
    // mount #2 (StrictMode remount)
    let got = false;
    unsub = feed.subscribe("STRICTUSDT", "1m", () => {
      got = true;
    });
    await jest.advanceTimersByTimeAsync(16);

    // Exactly one socket belongs to the current generation: it still has a
    // close handler. Superseded sockets are handler-stripped on recycle.
    const withHandlers = FakeWebSocket.instances.filter((w) => w.onclose !== null);
    expect(withHandlers).toHaveLength(1);

    const ws = withHandlers[0];
    ws.open();
    ws.message(klineFrame("STRICTUSDT", "1m", T0, 100, 105, 99, 103, 10));
    expect(got).toBe(true);
    expect(live).toBe(liveBaseline); // first mount's listener is gone
    expect(feed.getCandles("STRICTUSDT", "1m")).toHaveLength(13); // 12 REST + 1 live

    unsub();
    await jest.advanceTimersByTimeAsync(16);
  });
});

describe("watchdog robustness to browser scheduling", () => {
  it("a delayed watchdog callback after a large gap does not mark the stream dead", async () => {
    const { unsub, ws } = startAndSubscribe("GAPUSDT");
    await jest.advanceTimersByTimeAsync(0);
    ws.message(klineFrame("GAPUSDT", "1m", T0, 100, 105, 99, 103, 10));
    const historyBefore = historyRequests;
    const socketsBefore = FakeWebSocket.instances.length;

    // Event-loop stall while VISIBLE (long task, device sleep): a 40s hole
    // opens before the NEXT watchdog tick fires. Under fake timers intervals
    // fire punctually, so the hole is injected through the same seam the
    // browser would produce it: the tick's previous-tick timestamp. The gap
    // is deferred time — stamps shift, no false staleness, no forced recycle.
    const feedPriv = feed as unknown as { lastWatchdogTickAt: number };
    const prevTick = feedPriv.lastWatchdogTickAt;
    feedPriv.lastWatchdogTickAt = prevTick - 40_000; // 40s since the last tick
    jest.setSystemTime(Date.now() + 40_000); // wall clock jumped too
    await jest.advanceTimersByTimeAsync(1_000); // the next real watchdog tick

    expect(historyRequests).toBe(historyBefore);
    expect(FakeWebSocket.instances.length).toBe(socketsBefore);
    expect(feed.isKlineRecovering("GAPUSDT", "1m")).toBe(false);
    expect(feed.getKlineStatus("GAPUSDT", "1m")).toBe("live");
    expect(feed.getCandles("GAPUSDT", "1m")).toHaveLength(13);

    // After the gap is attributed, genuine fresh frames keep flowing.
    ws.message(klineFrame("GAPUSDT", "1m", T0 + 60, 103, 107, 102, 106, 11));
    expect(feed.getCandles("GAPUSDT", "1m")).toHaveLength(14);

    unsub();
    await jest.advanceTimersByTimeAsync(16);
  });

  it("escalates gradually on a visibly dead stream and still recovers it", async () => {
    const { unsub, ws } = startAndSubscribe("DEADUSDT");
    await jest.advanceTimersByTimeAsync(0);
    ws.message(klineFrame("DEADUSDT", "1m", T0, 100, 105, 99, 103, 10));

    // Stream goes silent for real (no frames, tab visible).
    const before = historyRequests;
    await jest.advanceTimersByTimeAsync(16_000); // first stale tick → passive resync
    expect(historyRequests).toBeGreaterThan(before);
    expect(feed.isKlineRecovering("DEADUSDT", "1m")).toBe(false); // socket untouched

    const socketsBeforeRecycle = FakeWebSocket.instances.length;
    await jest.advanceTimersByTimeAsync(1_000); // second consecutive pass → forced recovery
    expect(feed.isKlineRecovering("DEADUSDT", "1m")).toBe(true);
    expect(FakeWebSocket.last().closeCalls).toBeGreaterThanOrEqual(1);
    // Recovery drives the existing reconnect chain exactly once per recycle.
    await jest.advanceTimersByTimeAsync(300);
    expect(FakeWebSocket.instances.length).toBe(socketsBeforeRecycle + 1);

    // Fresh data on the reconnected socket restores live state.
    FakeWebSocket.last().open();
    FakeWebSocket.last().message(klineFrame("DEADUSDT", "1m", T0 + 60, 103, 107, 102, 106, 11));
    expect(feed.getKlineStatus("DEADUSDT", "1m")).toBe("live");
    expect(feed.isKlineRecovering("DEADUSDT", "1m")).toBe(false);

    unsub();
    await jest.advanceTimersByTimeAsync(16);
  });
});

describe("real socket close still reconnects", () => {
  it("reconnects with backoff regardless of visibility state", async () => {
    const { unsub, ws } = startAndSubscribe("CLOSEUSDT");
    const socketsBefore = FakeWebSocket.instances.length;

    // Genuine transport failure while the tab is HIDDEN must still reconnect:
    // the deferral gates the staleness watchdog only, never real closes.
    setVisibility("hidden");
    ws.drop();
    await jest.advanceTimersByTimeAsync(300);
    const ws2 = FakeWebSocket.last();
    expect(FakeWebSocket.instances.length).toBe(socketsBefore + 1);
    expect(ws2).not.toBe(ws);
    ws2.open();
    ws2.message(klineFrame("CLOSEUSDT", "1m", T0, 100, 105, 99, 103, 10));
    expect(feed.getCandles("CLOSEUSDT", "1m")).toHaveLength(13); // 12 REST + 1 live

    // And visible-close reconnect still works as before.
    setVisibility("visible");
    ws2.drop();
    await jest.advanceTimersByTimeAsync(300);
    expect(FakeWebSocket.instances.length).toBe(socketsBefore + 2);

    unsub();
    await jest.advanceTimersByTimeAsync(16);
  });
});
