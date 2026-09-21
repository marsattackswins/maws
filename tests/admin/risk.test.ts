import { describe, expect, test, beforeEach } from "@jest/globals";
import { NextRequest } from "next/server";
import { aggregateRiskCockpit, liquidationDistancePct, liquidationStatus, utilizationStatus } from "@/lib/server/risk/cockpit";
import { resetServerConfigForTests } from "@/lib/server/env/config";
import { GET } from "@/app/api/admin/risk/route";
import { freshEnv, makeCfg } from "../live-tests/helpers";

const risk = {
  maxOrderNotionalUsd: 100,
  maxGrossExposureUsd: 1_000,
  maxOpenOrders: 10,
  maxOpenPositions: 3,
  dailyLossPct: 10,
  priceCollarPct: 5,
};

function position(overrides: Partial<Parameters<typeof aggregateRiskCockpit>[0]["positions"][number]> = {}) {
  return {
    id: "BTCUSDT",
    symbol: "BTCUSDT",
    side: "long" as const,
    entry: 90,
    qty: 2,
    tp: null,
    sl: null,
    leverage: 5,
    liq: 80,
    mark: 100,
    unrealized: 20,
    openedAt: 1,
    notional: 200,
    ...overrides,
  };
}

describe("risk cockpit aggregation", () => {
  test("aggregates gross and per-symbol exposure, leverage, margin, and P&L", () => {
    const snapshot = aggregateRiskCockpit({
      env: "testnet",
      risk,
      account: { balance: 1_000, available: 700, equity: 1_050, margin: 350, unrealized: 20, fetchedAt: 1 },
      positions: [position(), position({ id: "ETHUSDT", symbol: "ETHUSDT", qty: 1, entry: 50, mark: 200, unrealized: -5 })],
      orders: [{ id: "o1", symbol: "BTCUSDT", side: "buy", type: "limit", price: 40, qty: 2, reduceOnly: false, closePosition: false, time: 1 }],
      realizedTodayUsd: 30,
      timestamp: 123,
    });

    expect(snapshot.timestamp).toBe(123);
    expect(snapshot.exposure.grossNotionalUsd).toBe(400);
    expect(snapshot.exposure.effectiveLeverage).toBeCloseTo(400 / 1050);
    expect(snapshot.account.usedMarginUsd).toBe(350);
    expect(snapshot.account.freeMarginUsd).toBe(700);
    expect(snapshot.exposure.bySymbol).toEqual([
      { symbol: "BTCUSDT", notionalUsd: 200, percentage: 50 },
      { symbol: "ETHUSDT", notionalUsd: 200, percentage: 50 },
    ]);
    expect(snapshot.limits.maxOrderNotional.current).toBe(80);
    expect(snapshot.limits.maxOrderNotional.currentLabel).toBe("Largest existing open order notional");
    expect(snapshot.pnl.totalTodayUsd).toBe(45);
  });

  test("applies green/yellow/red utilization thresholds", () => {
    expect(utilizationStatus(0.69)).toBe("green");
    expect(utilizationStatus(0.7)).toBe("yellow");
    expect(utilizationStatus(0.9)).toBe("yellow");
    expect(utilizationStatus(0.9001)).toBe("red");
    expect(utilizationStatus(Number.NaN)).toBe("unavailable");
  });

  test("calculates daily realized loss distance in USD and percentage points", () => {
    const snapshot = aggregateRiskCockpit({
      env: "testnet",
      risk,
      account: { balance: 1_000, available: 1_000, equity: 1_000, margin: 0, unrealized: 0, fetchedAt: 1 },
      positions: [],
      orders: [],
      realizedTodayUsd: -40,
    });

    expect(snapshot.limits.dailyLoss.limitUsd).toBe(100);
    expect(snapshot.limits.dailyLoss.currentLossPct).toBe(4);
    expect(snapshot.limits.dailyLoss.distanceUsd).toBe(60);
    expect(snapshot.limits.dailyLoss.distancePct).toBe(6);
    expect(snapshot.limits.dailyLoss.utilization).toBe(0.4);
    expect(snapshot.pnl.distanceToDailyLossLimitUsd).toBe(60);
    expect(snapshot.pnl.distanceToDailyLossLimitPct).toBe(6);
  });

  test("calculates long and short liquidation distance and directional status", () => {
    expect(liquidationDistancePct("long", 100, 80)).toBe(20);
    expect(liquidationDistancePct("short", 100, 120)).toBe(20);
    expect(liquidationDistancePct("long", 100, null)).toBeNull();
    expect(liquidationStatus(20)).toBe("green");
    expect(liquidationStatus(15)).toBe("yellow");
    expect(liquidationStatus(9.99)).toBe("red");
    expect(liquidationStatus(null)).toBe("unavailable");
  });

  test("preserves unavailable state for local mode while exposing configured limits", () => {
    const snapshot = aggregateRiskCockpit({
      env: "local",
      risk,
      account: null,
      positions: [],
      orders: [],
      realizedTodayUsd: 0,
      sourceAvailable: false,
    });

    expect(snapshot.sourceAvailable).toBe(false);
    expect(snapshot.sourceMessage).toBe("No server-side trading state available");
    expect(snapshot.limits.grossExposure.limit).toBe(1_000);
    expect(snapshot.limits.positionCount.limit).toBe(3);
    expect(snapshot.limits.dailyLoss.limitPct).toBe(10);
    expect(snapshot.positions).toHaveLength(0);
  });
});

describe("GET /api/admin/risk", () => {
  beforeEach(() => {
    resetServerConfigForTests();
  });

  test("returns local-mode unavailable state and limits without authentication", async () => {
    freshEnv(makeCfg({ env: "local" }));
    const response = await GET(new NextRequest("http://localhost:3000/api/admin/risk"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body.env).toBe("local");
    expect(body.sourceAvailable).toBe(false);
    expect(body.sourceMessage).toBe("No server-side trading state available");
    expect(body.limits.maxOrderNotional.limit).toBe(50);
  });

  test("requires authentication in non-local modes", async () => {
    freshEnv(makeCfg({ env: "testnet" }));
    const response = await GET(new NextRequest("http://localhost:3000/api/admin/risk"));
    expect(response.status).toBe(401);
  });

  test("accepts the configured health token header", async () => {
    freshEnv(makeCfg({ env: "testnet", healthToken: "risk-test-token" }));
    const request = new NextRequest("http://localhost:3000/api/admin/risk", {
      headers: { "x-maws-health-token": "risk-test-token" },
    });
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.env).toBe("testnet");
    expect(body.sourceAvailable).toBe(true);
  });
});
