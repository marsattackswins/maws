import { describe, expect, test, beforeEach } from "@jest/globals";

import {
  chunkUserTradeWindows,
  Reconciler,
  USER_TRADES_MAX_WINDOW_MS,
} from "@/lib/server/binance/recon";
import { liveState } from "@/lib/server/binance/state";
import { getDb } from "@/lib/server/db/connection";
import { FakeHttp, freshEnv, installFakes, jsonRes, makeCfg } from "./helpers";
import { BinanceRestClient } from "@/lib/server/binance/rest";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import type { HttpRequestOptions, HttpResponse } from "@/lib/server/binance/transport";
import { activePersistenceProfile } from "@/lib/server/profile/context";

const DAY = 24 * 60 * 60 * 1000;

describe("chunkUserTradeWindows", () => {
  test("a range over 7 days is split into sequential <=7d chunks", () => {
    const start = 0;
    const end = 20 * DAY;
    const windows = chunkUserTradeWindows(start, end);
    expect(windows.length).toBe(3);
    // Every request is <= 7 days.
    for (const w of windows) {
      expect(w.end - w.start).toBeLessThanOrEqual(USER_TRADES_MAX_WINDOW_MS);
      expect(w.end).toBeGreaterThan(w.start);
    }
    // Contiguous and inclusive-boundary-safe: next.start = prev.end + 1ms.
    expect(windows[0].start).toBe(start);
    expect(windows[0].end).toBe(7 * DAY - 1);
    // No gap, no overlap.
    for (let i = 1; i < windows.length; i++) {
      expect(windows[i].start).toBe(windows[i - 1].end + 1);
    }
    expect(windows.at(-1)!.end).toBe(end);
  });

  test("a window wider than the chunk cap is clamped from the left, not errored", () => {
    const end = 400 * DAY;
    const windows = chunkUserTradeWindows(0, end);
    expect(windows.length).toBe(26);
    expect(windows[0].start).toBe(end - 26 * USER_TRADES_MAX_WINDOW_MS);
    expect(windows.at(-1)!.end).toBe(end);
    for (const w of windows) expect(w.end - w.start).toBeLessThanOrEqual(USER_TRADES_MAX_WINDOW_MS);
  });

  test("degenerate ranges produce no requests", () => {
    expect(chunkUserTradeWindows(1000, 1000)).toEqual([]);
    expect(chunkUserTradeWindows(2000, 1000)).toEqual([]);
  });
});

describe("backfillMissedFills windowing", () => {
  /** Wires a Reconciler whose userTrades responses come from `respond`. */
  function setup(respond: (opts: HttpRequestOptions) => HttpResponse) {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/userTrades", () => respond(http.callsTo("/fapi/v1/userTrades").at(-1)!));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    const freezes: string[] = [];
    const recon = new Reconciler({
      rest,
      snapshot: async () => undefined,
      freeze: (r) => freezes.push(r),
      unfreeze: () => undefined,
    });
    return { http, recon, freezes };
  }

  const seedIntentAt = (clientOrderId: string, createdAt: number) => {
    getDb()
      .prepare(
        `INSERT INTO order_intents (profile_id, client_order_id, kind, symbol, side, type, qty, status, created_at, updated_at)
         VALUES (?, ?, 'order', 'BTCUSDT', 'BUY', 'LIMIT', '0.001', 'FILLED', ?, ?)`,
      )
      .run(activePersistenceProfile().id, clientOrderId, createdAt, Date.now());
  };

  /** Captures the startTime/endTime of every userTrades request. */
  function captureWindows(http: FakeHttp): Array<{ start: number; end: number }> {
    const requested: Array<{ start: number; end: number }> = [];
    const origRequest = http.request.bind(http);
    http.request = async (opts) => {
      const url = new URL(opts.url);
      if (url.pathname.includes("/userTrades")) {
        requested.push({
          start: Number(url.searchParams.get("startTime")),
          end: Number(url.searchParams.get("endTime")),
        });
      }
      return origRequest(opts);
    };
    return requested;
  }

  const trade = (id: number, time: number) => ({
    id, orderId: 777, price: "50000", qty: "0.001", realizedPnl: "1",
    commission: "0", commissionAsset: "USDT", time, side: "BUY",
  });

  beforeEach(() => {
    liveState().orders.clear();
  });

  test("startup range over 7 days is chunked; every request is <=7d; no -4165 possible", async () => {
    const now = Date.now();
    const { http, recon } = setup(() => jsonRes([]));
    // Seed AFTER setup: freshEnv() inside setup() resets the DB.
    seedIntentAt("legacy-intent", now - 20 * DAY); // unbounded anchor → 20d span
    const requested = captureWindows(http);

    const result = await recon.run("startup");
    expect(result.result).toBe("ok");
    expect(requested.length).toBe(3); // 20d → 3 chunks
    for (const w of requested) {
      expect(w.end - w.start).toBeLessThanOrEqual(USER_TRADES_MAX_WINDOW_MS); // -4165 impossible
    }
    for (let i = 1; i < requested.length; i++) {
      expect(requested[i].start).toBe(requested[i - 1].end + 1);
    }
    expect(requested.at(-1)!.end).toBeGreaterThan(now - 1000);
  });

  test("a normal <=7-day request remains a single unchanged call", async () => {
    const now = Date.now();
    const { http, recon } = setup(() => jsonRes([]));
    seedIntentAt("recent-intent", now - 2 * DAY);
    const requested = captureWindows(http);

    const result = await recon.run("test");
    expect(result.result).toBe("ok");
    expect(requested).toHaveLength(1);
    expect(requested[0].end - requested[0].start).toBeLessThanOrEqual(USER_TRADES_MAX_WINDOW_MS);
    // The single request still spans the full 2-day anchor (unchanged behavior).
    expect(requested[0].end - requested[0].start).toBeGreaterThan(1 * DAY);
  });

  test("trades from multiple chunks are merged, deduplicated by trade ID, and chronological", async () => {
    const now = Date.now();
    const { recon } = setup((opts) => {
      const start = Number(new URL(opts.url).searchParams.get("startTime"));
      return start < now - 7 * DAY
        ? jsonRes([trade(101, start + 1000), trade(102, start + 2000)])
        : jsonRes([trade(102, now - 1000), trade(103, now - 500)]);
    });
    seedIntentAt("chunk-intent", now - 10 * DAY);

    const result = await recon.run("test");
    expect(result.result).toBe("ok");
    const profileId = (recon as unknown as { persistenceProfile: { id: number } }).persistenceProfile.id;
    const rows = getDb()
      .prepare(`SELECT trade_id FROM fills_log WHERE profile_id = ? AND symbol = 'BTCUSDT' ORDER BY ts ASC, trade_id ASC`)
      .all(profileId) as Array<{ trade_id: string }>;
    const ids = rows.map((r) => r.trade_id);
    expect(ids.filter((id) => id === "102")).toHaveLength(1); // deduped
    expect(ids).toEqual(["101", "102", "103"]); // merged + chronological
  });

  test("empty chunks are handled without error and pagination stays per-window", async () => {
    const now = Date.now();
    seedIntentAt("empty-chunk-intent", now - 10 * DAY);
    // First (older) window empty; second window returns exactly one page.
    const { recon } = setup((opts) => {
      const start = Number(new URL(opts.url).searchParams.get("startTime"));
      return start < now - 7 * DAY
        ? jsonRes([])
        : jsonRes([trade(900, now - 100)]);
    });
    seedIntentAt("empty-chunk-intent", now - 10 * DAY);

    const result = await recon.run("test");
    expect(result.result).toBe("ok");
    const count = getDb().prepare(`SELECT COUNT(*) AS c FROM fills_log WHERE trade_id = '900'`).get() as { c: number };
    expect(count.c).toBe(1);
  });
});
