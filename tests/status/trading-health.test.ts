import { describe, expect, test, beforeEach } from "@jest/globals";
import { aggregateTradingHealth, circuitHealthLevel, mapStreamStatus, type TradingStreamInput } from "@/lib/server/health/trading";
import { GET } from "@/app/api/status/trading-health/route";
import { freshEnv, makeCfg } from "../live-tests/helpers";
import { resetServerConfigForTests } from "@/lib/server/env/config";
import { createIntent, updateIntent } from "@/lib/server/binance/intents";
import { getDb } from "@/lib/server/db/connection";
import { setHealthSignal } from "@/lib/server/health/state";
import { NextRequest } from "next/server";

const stream: TradingStreamInput = {
  connected: true,
  startedAt: 100,
  lastEventAt: 900,
  reconnects: 2,
  listenKeyRenewedAt: null,
};

const baseInput = {
  env: "testnet" as const,
  stream,
  streamHealthy: true,
  snapshotAt: 850,
  failedOrders: { count: 0, recent: [] },
  metrics: { rejectedOrders: 0, websocketReconnects: 2, websocketErrors: 0, reconciliationDrifts: 0 },
  reconciliation: { runs: 3, mismatches: 0, recent: [] },
  rateLimiter: {
    internalUsed: 2,
    internalPerMin: 60,
    usedWeight1m: 500,
    orderCount1m: 20,
    pressure: 0.3,
    lastObservedAt: 900,
  },
  circuits: {
    "binance-rest": {
      state: "closed" as const,
      failureCount: 0,
      successCount: 2,
      lastFailureTime: null,
      lastSuccessTime: 900,
      openedAt: null,
      halfOpenAt: null,
      totalCalls: 10,
      totalFailures: 0,
      totalSuccesses: 10,
      totalRejections: 0,
    },
  },
  openCircuits: [],
};

describe("trading-health aggregation", () => {
  test("maps server stream state, reconnects, and timestamps", () => {
    const snapshot = aggregateTradingHealth({ ...baseInput, timestamp: 1_000 });

    expect(snapshot.feed.serverTradingStream).toMatchObject({
      label: "Server trading stream",
      status: "open",
      level: "healthy",
      connected: true,
      lastMessageAt: 900,
      reconnects: 2,
      snapshotAt: 850,
    });
    expect(snapshot.feed.marketFeed).toEqual({
      available: false,
      level: "unavailable",
      message: "browser-local / not available server-side",
    });
  });

  test("maps closed and reconnecting stream states", () => {
    expect(mapStreamStatus(null)).toBe("unavailable");
    expect(mapStreamStatus({ ...stream, connected: false })).toBe("closed");
    expect(mapStreamStatus({ ...stream, connected: false, lastEventAt: null, phase: "reconnecting" })).toBe("reconnecting");
  });

  test("maps circuit closed, half-open, and open states", () => {
    expect(circuitHealthLevel("closed")).toBe("healthy");
    expect(circuitHealthLevel("half-open")).toBe("degraded");
    expect(circuitHealthLevel("open")).toBe("unhealthy");

    const snapshot = aggregateTradingHealth({
      ...baseInput,
      circuits: {
        rest: baseInput.circuits["binance-rest"],
        stream: { ...baseInput.circuits["binance-rest"], state: "half-open" },
        recon: { ...baseInput.circuits["binance-rest"], state: "open", openedAt: 999, totalRejections: 4 },
      },
      openCircuits: ["recon"],
    });

    expect(snapshot.circuits.healthy).toBe(false);
    expect(snapshot.circuits.openCircuits).toEqual(["recon"]);
    expect(snapshot.circuits.breakers.map((breaker) => breaker.level)).toEqual(["healthy", "degraded", "unhealthy"]);
    expect(snapshot.overall).toBe("unhealthy");
  });

  test("preserves rate limiter observations and marks historical hits unavailable", () => {
    const snapshot = aggregateTradingHealth(baseInput);

    expect(snapshot.execution.rateLimits.current).toEqual(baseInput.rateLimiter);
    expect(snapshot.execution.rateLimits.historicalHits).toEqual({
      available: false,
      message: "Historical rate-limit hit counts are not tracked yet",
    });
  });

  test("includes failed orders and reconciliation mismatches", () => {
    const snapshot = aggregateTradingHealth({
      ...baseInput,
      failedOrders: {
        count: 2,
        recent: [{
          clientOrderId: "co-1",
          symbol: "BTCUSDT",
          side: "BUY",
          type: "LIMIT",
          status: "REJECTED",
          updatedAt: 500,
          reason: "insufficient margin",
        }],
      },
      reconciliation: {
        runs: 4,
        mismatches: 1,
        recent: [{ startedAt: 600, finishedAt: 700, trigger: "interval", result: "drift", diffs: ["missing order"] }],
      },
    });

    expect(snapshot.execution.failedOrders.count).toBe(2);
    expect(snapshot.execution.failedOrders.recent[0]?.reason).toBe("insufficient margin");
    expect(snapshot.execution.reconciliation.mismatches).toBe(1);
    expect(snapshot.execution.reconciliation.recent[0]?.diffs).toEqual(["missing order"]);
    expect(snapshot.overall).toBe("unhealthy");
  });

  test("marks strategy health unavailable server-side", () => {
    const snapshot = aggregateTradingHealth(baseInput);
    expect(snapshot.strategy).toEqual({
      available: false,
      level: "unavailable",
      message: "browser-local / not available server-side",
    });
  });
});

describe("GET /api/status/trading-health", () => {
  beforeEach(() => {
    resetServerConfigForTests();
  });

  test("returns a stable local-mode contract without authentication", async () => {
    freshEnv(makeCfg({ env: "local" }));
    setHealthSignal({ stream: null, snapshot: null });
    const response = await GET(new NextRequest("http://localhost:3000/api/status/trading-health"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body).toEqual(expect.objectContaining({
      env: "local",
      feed: expect.objectContaining({
        marketFeed: {
          available: false,
          level: "unavailable",
          message: "browser-local / not available server-side",
        },
      }),
      strategy: {
        available: false,
        level: "unavailable",
        message: "browser-local / not available server-side",
      },
    }));
    expect(body.execution.rateLimits.historicalHits.available).toBe(false);
  });

  test("requires authentication in non-local modes", async () => {
    freshEnv(makeCfg({ env: "testnet" }));
    const response = await GET(new NextRequest("http://localhost:3000/api/status/trading-health"));
    expect(response.status).toBe(401);
  });

  test("accepts the configured health token and reads SQLite execution data", async () => {
    freshEnv(makeCfg({ env: "testnet", healthToken: "status-health-token" }));
    const created = createIntent({
      clientOrderId: "rejected-1",
      kind: "order",
      symbol: "BTCUSDT",
      side: "BUY",
      type: "LIMIT",
      qty: "1",
      price: "50000",
    }, 100);
    updateIntent(created.intent.clientOrderId, { status: "REJECTED", lastState: JSON.stringify({ error: "exchange rejected" }) }, 200);
    getDb().prepare(
      `INSERT INTO reconciliation_runs (profile_id, started_at, finished_at, trigger, result, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run("binance-testnet", 300, 400, "test", "drift", JSON.stringify({ diffs: ["order mismatch"] }));

    const response = await GET(new NextRequest("http://localhost:3000/api/status/trading-health", {
      headers: { "x-maws-health-token": "status-health-token" },
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.env).toBe("testnet");
    expect(body.execution.failedOrders.count).toBe(1);
    expect(body.execution.failedOrders.recent[0]).toMatchObject({
      clientOrderId: "rejected-1",
      symbol: "BTCUSDT",
      reason: "exchange rejected",
    });
    expect(body.execution.reconciliation.mismatches).toBe(1);
    expect(body.execution.reconciliation.recent[0].diffs).toEqual(["order mismatch"]);
  });
});
