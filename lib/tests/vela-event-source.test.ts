/**
 * Direct function-level tests for lib/vela-event-source.ts — the sharing contract
 * behind the timeline-marks lane: one calendar request for the whole app, one news
 * request per symbol, snapshots replayed to late subscribers, and refresh timers
 * that stop when the last subscriber leaves.
 */
import type { CalendarEvent } from "../calendar";
import type { NewsItem } from "../news";
import { createCellEventSource } from "../vela-event-source";

const NOW = Date.UTC(2026, 9, 14, 12, 0);

const event = (id: string): CalendarEvent => ({
  id,
  at: NOW,
  title: "CPI m/m",
  country: "US",
  impact: "high",
  category: "macro",
});

const item = (id: string): NewsItem => ({
  id,
  at: NOW,
  headline: "Headline",
  source: "CoinDesk",
  url: "https://example.com",
});

/** Flush the pending microtasks a load awaits. */
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

function makeSource(overrides: { refreshMs?: number } = {}) {
  const calendar = jest.fn(async () => ({ events: [event("c1")] }));
  const news = jest.fn(async (symbol: string) => ({ items: [item(`n-${symbol}`)] }));
  const source = createCellEventSource({ calendar, news, refreshMs: overrides.refreshMs ?? 300_000 });
  return { source, calendar, news };
}

describe("cellEventSource.subscribe", () => {
  it("delivers the loaded snapshot and replays it to a later subscriber", async () => {
    const { source } = makeSource();
    const first: string[] = [];
    const off = source.subscribe("BTCUSDT.P", (snap) => first.push(...snap.news.map((n) => n.id)));
    await flush();
    expect(first).toEqual(["n-BTCUSDT.P"]);
    expect(source.snapshot("BTCUSDT.P")?.events.map((e) => e.id)).toEqual(["c1"]);

    const late: string[] = [];
    source.subscribe("BTCUSDT.P", (snap) => late.push(...snap.news.map((n) => n.id)));
    expect(late).toEqual(["n-BTCUSDT.P"]); // synchronously from the cache — no second fetch
    off();
  });

  it("shares one calendar request across symbols and keys news per symbol", async () => {
    const { source, calendar, news } = makeSource();
    source.subscribe("BTCUSDT.P", () => undefined);
    source.subscribe("ETHUSDT.P", () => undefined);
    await flush();
    await flush();

    expect(calendar).toHaveBeenCalledTimes(1);
    expect(news.mock.calls.map((c) => c[0]).sort()).toEqual(["BTCUSDT.P", "ETHUSDT.P"]);
    expect(source.liveSymbols().sort()).toEqual(["BTCUSDT.P", "ETHUSDT.P"]);
  });

  it("keeps the previous snapshot when a refresh fails", async () => {
    const { source, calendar } = makeSource();
    const seen: number[] = [];
    source.subscribe("BTCUSDT.P", (snap) => seen.push(snap.events.length));
    await flush();
    expect(seen).toEqual([1]);

    calendar.mockRejectedValueOnce(new Error("offline"));
    source.refresh("BTCUSDT.P");
    await flush();
    expect(calendar).toHaveBeenCalledTimes(2);
    expect(source.snapshot("BTCUSDT.P")?.events.map((e) => e.id)).toEqual(["c1"]); // not erased
  });

  it("stops its refresh timer when the last subscriber leaves", async () => {
    jest.useFakeTimers();
    try {
      const { source, news } = makeSource({ refreshMs: 60_000 });
      const off = source.subscribe("BTCUSDT.P", () => undefined);
      await jest.advanceTimersByTimeAsync(0);
      expect(news).toHaveBeenCalledTimes(1);

      await jest.advanceTimersByTimeAsync(60_000);
      expect(news).toHaveBeenCalledTimes(2); // the cadence refreshes while subscribed

      off();
      expect(source.liveSymbols()).toEqual([]);
      await jest.advanceTimersByTimeAsync(180_000);
      expect(news).toHaveBeenCalledTimes(2); // nothing left to refresh
    } finally {
      jest.useRealTimers();
    }
  });

  it("serves the cached snapshot to a resubscribing cell without refetching", async () => {
    const { source, calendar, news } = makeSource();
    const off = source.subscribe("BTCUSDT.P", () => undefined);
    await flush();
    off();

    source.subscribe("BTCUSDT.P", () => undefined);
    await flush();
    expect(calendar).toHaveBeenCalledTimes(1);
    expect(news).toHaveBeenCalledTimes(1);
  });

  it("never throws when a subscriber does", async () => {
    const { source } = makeSource();
    const after: string[] = [];
    source.subscribe("BTCUSDT.P", () => {
      throw new Error("boom");
    });
    source.subscribe("BTCUSDT.P", (snap) => after.push(...snap.events.map((e) => e.id)));
    await flush();
    expect(after).toEqual(["c1"]);
  });
});
