import { describe, expect, test } from "@jest/globals";
import { aggregateLiveJournal, normalizeLiveFill } from "@/lib/server/trading/journal-live";
import { calculateJournalAnalytics, type JournalTrade } from "@/lib/trading/journal";
import { normalizePaperTrades } from "@/lib/selectors/journal";
import { GET } from "@/app/api/admin/journal/route";
import { freshEnv, makeCfg } from "../live-tests/helpers";
import { getDb } from "@/lib/server/db/connection";
import { resetServerConfigForTests } from "@/lib/server/env/config";
import { NextRequest } from "next/server";

function closedTrade(pnlUsd: number, id: string): JournalTrade {
  return {
    id,
    timestamp: 1,
    symbol: "BTCUSDT",
    side: "long",
    size: 1,
    entryPrice: 100,
    exitPrice: 100 + pnlUsd,
    pnlUsd,
    pnlPct: pnlUsd,
    source: "live",
    strategy: null,
    timeframe: null,
    tags: null,
    notes: null,
    durationMs: null,
    status: "closed",
    metadataAvailability: { strategy: false, timeframe: false, indicators: false, excursion: false },
  };
}

describe("journal normalization and analytics", () => {
  test("normalizes non-zero realized live fills as conservative closed records", () => {
    const trade = normalizeLiveFill({
      id: 7,
      ts: 1000,
      symbol: "BTCUSDT",
      side: "SELL",
      qty: "0.5",
      price: "101",
      realized_pnl: "0.50",
      client_order_id: "close-1",
      exchange_order_id: "22",
      source: "stream",
    });

    expect(trade).toMatchObject({
      id: "live-fill-7",
      source: "live",
      side: "long",
      size: 0.5,
      exitPrice: 101,
      pnlUsd: 0.5,
      status: "closed",
      entryPrice: null,
      pnlPct: null,
    });
    expect(trade.metadataAvailability.strategy).toBe(false);
  });

  test("keeps incomplete and zero-P&L live fills visible as execution records", () => {
    const result = aggregateLiveJournal({
      fills: [
        {
          id: 1, ts: 1, symbol: "BTCUSDT", side: "BUY", qty: "1", price: "100",
          realized_pnl: "0", client_order_id: null, exchange_order_id: null, source: "stream",
        },
        {
          id: 2, ts: 2, symbol: "ETHUSDT", side: "SELL", qty: "2", price: "50",
          realized_pnl: null, client_order_id: null, exchange_order_id: null, source: "stream",
        },
      ],
    });

    expect(result.trades).toHaveLength(2);
    expect(result.trades.every((trade) => trade.status === "execution")).toBe(true);
    expect(result.analytics.numberOfTrades).toBe(0);
  });

  test("extracts paper realized P&L and correlates structured close-note fields", () => {
    const trades = normalizePaperTrades({
      orderHistory: [
        {
          id: "entry-1", time: 100, closingTime: 100, symbol: "BTCUSDT", side: "buy", type: "market",
          qty: 2, price: 100, fillPrice: 100, status: "filled",
        },
        {
          id: "exit-1", time: 200, closingTime: 200, symbol: "BTCUSDT", side: "sell", type: "market",
          qty: 2, price: 105, fillPrice: 105, status: "filled",
        },
      ],
      balanceHistory: [{
        id: "pnl-1",
        time: 200,
        type: "realized_pnl",
        amount: 10,
        balanceAfter: 1010,
        symbol: "BTCUSDT",
        note: "Close long position for symbol BTCUSDT at price 105 for 2 units. Position AVG Price was 100",
      }],
      journal: [],
      positions: [],
    });

    const realized = trades.find((trade) => trade.id === "paper-realized-pnl-1");
    expect(realized).toMatchObject({
      source: "paper",
      symbol: "BTCUSDT",
      side: "long",
      size: 2,
      entryPrice: 100,
      exitPrice: 105,
      pnlUsd: 10,
      pnlPct: 5,
      status: "closed",
      durationMs: 100,
    });
    expect(trades.filter((trade) => trade.status === "execution")).toHaveLength(2);
  });

  test("retains ambiguous paper realized records with partial metadata", () => {
    const [trade] = normalizePaperTrades({
      orderHistory: [],
      balanceHistory: [{ id: "pnl-unknown", time: 100, type: "realized_pnl", amount: -5, balanceAfter: 95, note: "manual adjustment" }],
      journal: [],
      positions: [],
    });

    expect(trade).toMatchObject({
      source: "paper",
      symbol: "UNKNOWN",
      status: "closed",
      pnlUsd: -5,
      entryPrice: null,
      exitPrice: null,
      size: 0,
    });
  });

  test("calculates win rate, averages, profit factor, and total P&L", () => {
    const analytics = calculateJournalAnalytics([
      closedTrade(20, "win"),
      closedTrade(-10, "loss"),
      closedTrade(0, "flat"),
      { ...closedTrade(5, "execution"), status: "execution" },
    ]);

    expect(analytics).toMatchObject({
      numberOfTrades: 3,
      winningTrades: 1,
      losingTrades: 1,
      breakevenTrades: 1,
      winRatePct: 33.33333333333333,
      averageWinUsd: 20,
      averageLossUsd: -10,
      profitFactor: 2,
      totalPnlUsd: 10,
    });
  });
});

describe("GET /api/admin/journal", () => {
  test("returns an empty stable local-mode contract without authentication", async () => {
    resetServerConfigForTests();
    freshEnv(makeCfg({ env: "local" }));
    const response = await GET(new NextRequest("http://localhost:3000/api/admin/journal"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body).toEqual(expect.objectContaining({ env: "local", source: "live", trades: [], analytics: expect.any(Object) }));
  });

  test("requires authentication in non-local modes", async () => {
    resetServerConfigForTests();
    freshEnv(makeCfg({ env: "testnet" }));
    const response = await GET(new NextRequest("http://localhost:3000/api/admin/journal"));
    expect(response.status).toBe(401);
  });

  test("accepts health token, filters by symbol, and returns normalized live trades", async () => {
    resetServerConfigForTests();
    freshEnv(makeCfg({ env: "testnet", healthToken: "journal-token" }));
    getDb().prepare(
      `INSERT INTO fills_log (profile_id, ts, symbol, side, qty, price, realized_pnl, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run("binance-testnet", 100, "BTCUSDT", "SELL", "1", "110", "10", "stream");
    getDb().prepare(
      `INSERT INTO fills_log (profile_id, ts, symbol, side, qty, price, realized_pnl, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run("binance-testnet", 100, "ETHUSDT", "BUY", "1", "50", "0", "stream");
    getDb().prepare(
      `INSERT INTO fills_log (profile_id, ts, symbol, side, qty, price, realized_pnl, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run("binance-production", 100, "BTCUSDT", "SELL", "1", "110", "99", "stream");

    const response = await GET(new NextRequest("http://localhost:3000/api/admin/journal?symbol=BTCUSDT", {
      headers: { "x-maws-health-token": "journal-token" },
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toBe("live");
    expect(body.trades).toHaveLength(1);
    expect(body.trades[0]).toMatchObject({ symbol: "BTCUSDT", source: "live", status: "closed", pnlUsd: 10 });
  });
});
