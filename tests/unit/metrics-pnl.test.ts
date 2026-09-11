/**
 * pnl_24h metric (lib/server/metrics/pnl.ts).
 *
 * Verifies the admin metrics endpoint stays numeric and fast to compute:
 *   - live positions contribute mark-price unrealized P&L,
 *   - paper open positions contribute current unrealized P&L,
 *   - empty state sums to 0,
 *   - the value is a finite number.
 */

import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  pnl24h,
  paperPositionUnrealized,
  livePositionUnrealized,
} from "@/lib/server/metrics/pnl";
import { liveState, resetLiveStateForTests } from "@/lib/server/binance/state";
import type { ChartPosition } from "@/types";

const paperLong: ChartPosition = {
  id: "p1",
  symbol: "BTCUSDT",
  side: "long",
  entry: 60_000,
  qty: 1,
  tp: 70_000,
  sl: 50_000,
  leverage: 10,
  liq: 54_000,
  openedAt: Date.now() - 3_600_000,
};

const paperShort: ChartPosition = {
  id: "p2",
  symbol: "ETHUSDT",
  side: "short",
  entry: 3_000,
  qty: 2,
  tp: null,
  sl: 3_500,
  leverage: 5,
  liq: 3_800,
  openedAt: Date.now() - 7_200_000,
};

describe("pnl_24h metric", () => {
  beforeEach(() => {
    resetLiveStateForTests();
  });

  test("is numeric and zero when there are no positions", () => {
    const value = pnl24h({ positions: [], lastPriceOf: () => 0 });
    expect(typeof value).toBe("number");
    expect(Number.isFinite(value)).toBe(true);
    expect(value).toBe(0);
  });

  test("paper positions contribute unrealized P&L at current mark", () => {
    // long 1 BTC at 60k, mark 65k → +5,000
    // short 2 ETH at 3k, mark 2_900 → +200
    const lastOf = (s: string) => (s === "BTCUSDT" ? 65_000 : 2_900);
    const value = pnl24h({ positions: [paperLong, paperShort], lastPriceOf: lastOf });

    expect(value).toBe(5_000 + 200);
  });

  test("live positions contribute mark-price unrealized P&L", () => {
    const state = liveState();
    state.positions.set("BTCUSDT", {
      symbol: "BTCUSDT",
      side: "long",
      qty: "1",
      entryPrice: "60000",
      markPrice: "65000",
      unrealizedProfit: "5000",
      leverage: "10",
      liquidationPrice: "54000",
      notional: "65000",
      updatedAt: Date.now(),
    });

    const value = pnl24h();
    expect(value).toBe(5_000);
  });

  test("combines live and paper unrealized P&L", () => {
    const state = liveState();
    state.positions.set("SOLUSDT", {
      symbol: "SOLUSDT",
      side: "long",
      qty: "10",
      entryPrice: "100",
      markPrice: "105",
      unrealizedProfit: "50",
      leverage: "5",
      liquidationPrice: "80",
      notional: "1050",
      updatedAt: Date.now(),
    });

    const lastOf = (s: string) => (s === "BTCUSDT" ? 65_000 : 2_900);
    const value = pnl24h({ positions: [paperLong, paperShort], lastPriceOf: lastOf });

    expect(value).toBe(50 + 5_000 + 200);
  });

  test("helpers are numeric for clean inputs", () => {
    expect(paperPositionUnrealized(paperLong, 65_000)).toBe(5_000);
    expect(paperPositionUnrealized(paperShort, 2_900)).toBe(200);
    expect(livePositionUnrealized({ unrealizedProfit: "-123.45" })).toBe(-123.45);
    expect(livePositionUnrealized({ unrealizedProfit: "0" })).toBe(0);
  });
});
