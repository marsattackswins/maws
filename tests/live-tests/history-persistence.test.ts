import { hydrateFillsFromLog, persistFill, rememberFill, resetLiveStateForTests, liveState, applyPositionSnapshot } from "@/lib/server/binance/state";
import { positionsDto, fillsDto, accountMetricsDto } from "@/lib/server/binance/dto";
import {
  backfillHistoricalOrders,
  historySymbols,
  hydrateHistoricalOrders,
  loadHistoricalOrders,
  normalizeHistoricalOrder,
  persistHistoricalOrder,
} from "@/lib/server/binance/order-history";
import { Reconciler } from "@/lib/server/binance/recon";
import { BinanceRestClient } from "@/lib/server/binance/rest";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import { BinanceLiveManager, resetLiveManagerForTests } from "@/lib/server/binance/manager";
import { getDb } from "@/lib/server/db/connection";
import { FakeHttp, FakeWs, freshEnv, installFakes, jsonRes, makeCfg, accountFixture, tempDbPath, BTCUSDT_INFO, orderEvent } from "./helpers";
import { sseBus } from "@/lib/server/binance/sse";

afterAll(() => {
  // A failing assertion must never leave the manager's timers running: jest
  // would otherwise wait on open handles instead of reporting the failure.
  resetLiveManagerForTests();
});

function makeRest() {
  const cfg = freshEnv(makeCfg());
  const http = new FakeHttp();
  installFakes(http);
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  http.route("/fapi/v1/allOrders", () => jsonRes([]));
  const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
  rest.setTransportForTests(http);
  return { cfg, http, rest };
}

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

describe("startup fill hydration", () => {
  test("loads persisted fills newest-first, deduplicated by trade id", () => {
    freshEnv(makeCfg());
    const ts = Date.now();
    persistFill({ tradeId: "A", ts: ts + 1000, exchangeOrderId: 1, clientOrderId: "c1", symbol: "BTCUSDT", side: "SELL", qty: "0.001", price: "50000", realizedPnl: "-12.5", source: "stream" });
    persistFill({ tradeId: "B", ts: ts + 2000, exchangeOrderId: 2, clientOrderId: "c2", symbol: "BTCUSDT", side: "SELL", qty: "0.001", price: "51000", realizedPnl: "-10", source: "stream" });
    // Duplicate trade id (different row) must not appear twice.
    persistFill({ tradeId: "A", ts: ts + 3000, exchangeOrderId: 1, clientOrderId: "c1", symbol: "BTCUSDT", side: "SELL", qty: "0.001", price: "52000", realizedPnl: "0", source: "rest" });

    const hydrated = hydrateFillsFromLog();
    expect(hydrated).toBe(2);

    const dtos = fillsDto(50);
    expect(dtos).toHaveLength(2);
    expect(dtos[0].ts).toBe(ts + 2000); // newest first
    expect(dtos[0].realizedPnl).toBe(-10);
    expect(new Set(liveState().fills.map((f) => f.tradeId))).toEqual(new Set(["A", "B"]));

    // Re-hydration is a no-op (rememberFill dedupes by trade id).
    expect(hydrateFillsFromLog()).toBe(0);
    expect(liveState().fills).toHaveLength(2);
  });

  test("state after restart exposes hydrated fills to /api/live/state and SSE", async () => {
    const ts = Date.now();
    persistFill({ tradeId: "PRE", ts: ts - TWO_DAYS_MS, exchangeOrderId: 9, clientOrderId: "c9", symbol: "BTCUSDT", side: "SELL", qty: "0.002", price: "49000", realizedPnl: "5", source: "rest" });
    hydrateFillsFromLog();
    const seen: Array<{ event: string; data: Record<string, unknown> }> = [];
    const unsub = sseBus.subscribe((event, data) => seen.push({ event, data: data as Record<string, unknown> }));
    sseBus.publish("state", { fills: fillsDto(50) });
    unsub();
    const stateEvent = seen.find((e) => e.event === "state");
    expect((stateEvent!.data.fills as Array<{ ts: number }>)[0].ts).toBe(ts - TWO_DAYS_MS);
  });
});

describe("historical fill backfill", () => {
  test("regression: covers a position opened more than 24 hours before startup", async () => {
    const { http, rest } = makeRest();
    const openedAt = Date.now() - TWO_DAYS_MS;
    applyPositionSnapshot([
      { symbol: "BTCUSDT", positionAmt: "0.001", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "5", positionSide: "BOTH" },
    ] as never);
    http.route("/fapi/v1/userTrades", () =>
      jsonRes([{ id: 777001, orderId: 777, price: "50000", qty: "0.001", realizedPnl: "-12.5", commission: "0.1", commissionAsset: "USDT", time: openedAt + 1000, side: "SELL" }]),
    );
    const recon = new Reconciler({ rest, snapshot: async () => undefined, freeze: () => undefined, unfreeze: () => undefined });

    const result = await recon.run("startup");
    expect(result.result).toBe("ok");

    // The query window must reach past 24h to cover the two-day-old position.
    const url = new URL(http.callsTo("/fapi/v1/userTrades")[0].url);
    const startTime = Number(url.searchParams.get("startTime"));
    expect(startTime).toBeLessThanOrEqual(openedAt);

    const row = getDb().prepare(`SELECT trade_id, realized_pnl, source FROM fills_log WHERE trade_id = '777001'`).get() as { trade_id: string; realized_pnl: string; source: string };
    expect(row).toEqual({ trade_id: "777001", realized_pnl: "-12.5", source: "rest" });
    expect(liveState().fills.map((f) => f.tradeId)).toContain("777001");
  });
});

describe("historical order history", () => {
  const rawOpen = { orderId: 501, clientOrderId: "hist-open", symbol: "BTCUSDT", side: "BUY", type: "MARKET", status: "FILLED", price: "0", stopPrice: "0", origQty: "0.001", executedQty: "0.001", avgPrice: "50000", reduceOnly: false, closePosition: false, time: 1_700_000_000_000, updateTime: 1_700_000_000_100 };
  const rawClose = { ...rawOpen, orderId: 502, clientOrderId: "hist-close", side: "SELL", type: "MARKET", status: "FILLED", avgPrice: "51000", time: 1_700_000_100_000, updateTime: 1_700_000_100_100 };

  test("normalize rejects rows without identity", () => {
    expect(normalizeHistoricalOrder(rawOpen)).not.toBeNull();
    expect(normalizeHistoricalOrder({ ...rawOpen, orderId: "x" })).toBeNull();
    expect(normalizeHistoricalOrder({ ...rawOpen, clientOrderId: "" })).toBeNull();
  });

  test("symbols come from persisted fills plus current positions", () => {
    const cfg = freshEnv(makeCfg());
    const { persistenceProfileFromConfig } = require("@/lib/server/profile/context") as typeof import("@/lib/server/profile/context");
    const profile = persistenceProfileFromConfig(cfg);
    persistFill({ tradeId: "S1", ts: Date.now(), exchangeOrderId: 1, clientOrderId: "c", symbol: "BTCUSDT", side: "BUY", qty: "1", price: "1", realizedPnl: "0", source: "stream" });
    expect(historySymbols(profile, ["ETHUSDT"]).sort()).toEqual(["BTCUSDT", "ETHUSDT"]);
  });

  test("backfill persists terminal orders idempotently and hydration restores them", async () => {
    const { http, rest } = makeRest();
    http.route("/fapi/v1/allOrders", () => jsonRes([rawOpen, rawClose, { ...rawOpen, orderId: 503, status: "NEW", clientOrderId: "hist-live" }]));

    const inserted = await backfillHistoricalOrders(rest, ["BTCUSDT"]);
    expect(inserted).toBe(2); // terminal only; working orders are excluded
    expect(await backfillHistoricalOrders(rest, ["BTCUSDT"])).toBe(0); // idempotent

    const rows = loadHistoricalOrders();
    expect(rows.map((r) => r.exchangeOrderId).sort()).toEqual([501, 502]);

    expect(hydrateHistoricalOrders()).toBe(2);
    // Terminal history lands in orders only — never openOrders, never execution.
    expect(liveState().orders.get("hist-open")).toMatchObject({ symbol: "BTCUSDT", side: "BUY", avgPrice: "50000" });
    expect(liveState().orders.get("hist-close")).toMatchObject({ symbol: "BTCUSDT", side: "SELL", avgPrice: "51000" });
    expect(liveState().openOrders.size).toBe(0);
  });
});

describe("position age", () => {
  test("regression: a position opened before startup keeps its real openedAt", () => {
    freshEnv(makeCfg());
    const openedAt = Date.now() - TWO_DAYS_MS;
    persistFill({ tradeId: "AGE1", ts: openedAt, exchangeOrderId: 11, clientOrderId: "age", symbol: "BTCUSDT", side: "BUY", qty: "0.001", price: "50000", realizedPnl: "0", source: "rest" });
    hydrateFillsFromLog();
    applyPositionSnapshot([
      { symbol: "BTCUSDT", positionAmt: "0.001", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "5", positionSide: "BOTH" },
    ] as never);

    const dto = positionsDto()[0];
    expect(dto.openedAt).toBe(openedAt); // not process startup / first observation
  });

  test("without pre-startup evidence the snapshot time is the fallback", () => {
    resetLiveStateForTests();
    const now = Date.now();
    applyPositionSnapshot([
      { symbol: "ETHUSDT", positionAmt: "1", entryPrice: "3000", markPrice: "3000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "5", positionSide: "BOTH" },
    ] as never);
    expect(positionsDto()[0].openedAt).toBeGreaterThanOrEqual(now);
  });
});

describe("realized PnL freshness after a closing fill", () => {
  test("income sync runs without blocking the fill; metrics update immediately", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
    http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
    http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
    http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
    http.route("/fapi/v2/positionRisk", () => jsonRes([]));
    http.route("/fapi/v1/openOrders", () => jsonRes([]));
    http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-PNL" }));
    http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
    http.route("/fapi/v1/userTrades", () => jsonRes([]));
    http.route("/fapi/v1/allOrders", () => jsonRes([]));
    // The exchange has not yet reported any income when the process starts:
    // the closing fill's REALIZED_PNL row only appears after the fill, so the
    // startup sync sees an empty ledger and the post-fill nudge is the path
    // that must land the PnL. Fixed time: a per-call Date.now() would change
    // the ledger key (tranId + time) and break idempotency.
    const incomeTime = Date.now();
    let incomeVisible = false;
    http.route("/fapi/v1/income", () => jsonRes(incomeVisible ? [{ tranId: 990001, type: "REALIZED_PNL", symbol: "BTCUSDT", income: "-12.5", asset: "USDT", time: incomeTime }] : []));

    const manager = new BinanceLiveManager(cfg);
    resetLiveManagerForTests(manager);
    await manager.ensureStarted();
    expect(accountMetricsDto().realizedPnl).toBe(0);

    const ws = FakeWs.last();
    ws.emitOpen();
    await new Promise((r) => setTimeout(r, 0));
    ws.emitMessage(orderEvent({ clientOrderId: "close-fill-1", orderId: 880001, tradeId: 880011, status: "FILLED", side: "SELL", lastFilledQty: "0.001", cumQty: "0.001", lastFilledPrice: "50000", realizedPnl: "-12.5", E: Date.now(), T: Date.now() }));
    // The exchange writes the REALIZED_PNL row as the fill settles, so it is
    // visible by the time the post-fill nudge fires (the nudge runs on a later
    // microtask, after this synchronous flag flip).
    incomeVisible = true;
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));

    // The fill transaction itself is complete and unblocked.
    const fillRow = getDb().prepare(`SELECT realized_pnl FROM fills_log WHERE trade_id = '880011'`).get() as { realized_pnl: string } | undefined;
    expect(fillRow?.realized_pnl).toBe("-12.5");
    // Idempotent income sync has already landed the realized PnL.
    for (let i = 0; i < 50 && accountMetricsDto().realizedPnl === 0; i++) await new Promise((r) => setTimeout(r, 10));
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(-12.5);

    manager.stop();
    resetLiveManagerForTests();
  });
});

describe("account-history lifecycle across restart", () => {
  const OPENED_AT = Date.now() - 2 * 24 * 60 * 60 * 1000; // two days ago
  const INCOME_TIME = OPENED_AT + 60_000;
  const dbPath = tempDbPath();
  let http: FakeHttp;
  let manager: BinanceLiveManager;
  let incomeVisible = false;
  let incomeSyncFails = false;

  function seedExchangeHistory(): void {
    // Two-day-old lifecycle: opening fill + opening order, then the close.
    http.route("/fapi/v1/userTrades", () =>
      jsonRes([
        { id: 7001, orderId: 6001, price: "50000", qty: "0.001", realizedPnl: "0", commission: "0.05", commissionAsset: "USDT", time: OPENED_AT, side: "BUY" },
        { id: 7002, orderId: 6002, price: "51000", qty: "0.001", realizedPnl: "-12.5", commission: "0.05", commissionAsset: "USDT", time: OPENED_AT + 60_000, side: "SELL" },
      ]),
    );
    http.route("/fapi/v1/allOrders", () =>
      jsonRes([
        { orderId: 6001, clientOrderId: "life-open", symbol: "BTCUSDT", side: "BUY", type: "MARKET", status: "FILLED", price: "0", stopPrice: "0", origQty: "0.001", executedQty: "0.001", avgPrice: "50000", reduceOnly: false, closePosition: false, time: OPENED_AT, updateTime: OPENED_AT + 500 },
        { orderId: 6002, clientOrderId: "life-close", symbol: "BTCUSDT", side: "SELL", type: "MARKET", status: "FILLED", price: "0", stopPrice: "0", origQty: "0.001", executedQty: "0.001", avgPrice: "51000", reduceOnly: false, closePosition: false, time: OPENED_AT + 60_000, updateTime: OPENED_AT + 60_500 },
      ]),
    );
    http.route("/fapi/v1/income", () => {
      if (incomeSyncFails) return jsonRes({ code: -1000, msg: "fake exchange unavailable" }, 500);
      return jsonRes(incomeVisible ? [{ tranId: 810001, type: "REALIZED_PNL", symbol: "BTCUSDT", income: "-12.5", asset: "USDT", time: INCOME_TIME }] : []);
    });
  }

  function baseRoutes(): void {
    http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
    http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
    http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
    http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
    http.route("/fapi/v2/positionRisk", () => jsonRes([]));
    http.route("/fapi/v1/openOrders", () => jsonRes([]));
    http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-LIFE" }));
    http.route("/fapi/v1/positionSide/dual", () => jsonRes({ dualSidePosition: false }));
    http.route("/fapi/v1/userTrades", () => jsonRes([]));
    http.route("/fapi/v1/allOrders", () => jsonRes([]));
    http.route("/fapi/v1/income", () => jsonRes([]));
  }

  async function startManager(cfg: ReturnType<typeof makeCfg>): Promise<void> {
    manager = new BinanceLiveManager(cfg);
    resetLiveManagerForTests(manager);
    await manager.ensureStarted();
  }

  test("opening order, fill, openedAt, and PnL survive close + restart + empty snapshots", async () => {
    // --- First boot: seed history from two days ago. ---
    const cfg = freshEnv(makeCfg({ dbPath }));
    http = new FakeHttp();
    installFakes(http);
    baseRoutes();
    seedExchangeHistory();
    // Startup sees the still-open position on the exchange.
    http.route("/fapi/v2/positionRisk", () => jsonRes([{ symbol: "BTCUSDT", positionAmt: "0.001", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", liquidationPrice: "0", leverage: "5", positionSide: "BOTH" }]));
    await startManager(cfg);

    const positions = () => positionsDto();
    expect(positions()).toHaveLength(1);
    // Real openedAt from two-day-old history, not process startup.
    expect(positions()[0].openedAt).toBeLessThanOrEqual(OPENED_AT + 1000);
    // Opening order (6001) and closing order (6002) both imported.
    expect(liveState().orders.get("life-open")).toBeTruthy();
    expect(liveState().orders.get("life-close")).toBeTruthy();
    // Historical fills hydrated into UI state, newest first.
    const fillIds = liveState().fills.map((f) => f.tradeId);
    expect(fillIds).toContain("7001");
    expect(fillIds).toContain("7002");

    // --- Close the position with nonzero realized PnL (stream event). ---
    // FakeWs keeps firing on('message') even when closed, so drive the
    // UserDataStream directly: a live close/open cycle re-arms buffering,
    // then recover() completes and the socket is live.
    const stream = (manager as unknown as { stream: { onDrop: (g: number) => void; connectWs: () => void; generation: number } }).stream;
    stream.onDrop(stream.generation);
    await new Promise((r) => setTimeout(r, 20));
    stream.connectWs();
    await new Promise((r) => setTimeout(r, 20));
    incomeVisible = true;
    FakeWs.last().emitMessage(orderEvent({ clientOrderId: "life-close2", orderId: 6003, tradeId: 7003, status: "FILLED", side: "SELL", lastFilledQty: "0.001", cumQty: "0.001", lastFilledPrice: "50000", realizedPnl: "-12.5", E: Date.now(), T: Date.now() }));
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    for (let i = 0; i < 50 && accountMetricsDto().realizedPnl === 0; i++) await new Promise((r) => setTimeout(r, 10));
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(-12.5);
    expect(accountMetricsDto().stale).toBe(false);

    // --- Exchange snapshot goes empty (position closed) — history must survive. ---
    http.route("/fapi/v2/positionRisk", () => jsonRes([]));
    http.route("/fapi/v2/account", () => jsonRes(accountFixture({ totalWalletBalance: "987.5", totalMarginBalance: "987.5", availableBalance: "987.5" })));
    await manager.reconcileRun("test-empty-snapshot");
    expect(liveState().positions.size).toBe(0);
    // Durable history untouched by the empty snapshot.
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(-12.5);
    expect(liveState().fills.map((f) => f.tradeId)).toEqual(expect.arrayContaining(["7001", "7002", "7003"]));
    expect(liveState().orders.get("life-open")).toBeTruthy();
    expect(liveState().orders.get("life-close")).toBeTruthy();

    // --- Income sync fails: previous total retained and marked stale. ---
    incomeSyncFails = true;
    await manager.reconcileRun("test-sync-failure");
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(-12.5);
    expect(accountMetricsDto().stale).toBe(true);
    incomeSyncFails = false;

    // --- Stop and restart over the SAME database. ---
    await manager.stopAndWait();
    resetLiveManagerForTests();
    const cfg2 = freshEnv(makeCfg({ dbPath }));
    expect(cfg2.dbPath).toBe(cfg.dbPath);
    http = new FakeHttp();
    installFakes(http);
    baseRoutes();
    seedExchangeHistory();
    http.route("/fapi/v2/positionRisk", () => jsonRes([])); // exchange has no positions now
    await startManager(cfg2);

    // Restart must NOT show a fresh account.
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(-12.5);
    const reopenedFills = liveState().fills.map((f) => f.tradeId);
    expect(reopenedFills).toEqual(expect.arrayContaining(["7001", "7002", "7003"]));
    expect(liveState().orders.get("life-open")).toBeTruthy();
    expect(liveState().orders.get("life-close")).toBeTruthy();
    expect(liveState().openOrders.size).toBe(0); // history is never execution

    // --- Repeat startup/reconciliation: no duplicates. ---
    await manager.reconcileRun("test-idempotency");
    await manager.stopAndWait();
    resetLiveManagerForTests();
    const cfg3 = freshEnv(makeCfg({ dbPath }));
    http = new FakeHttp();
    installFakes(http);
    baseRoutes();
    seedExchangeHistory();
    http.route("/fapi/v2/positionRisk", () => jsonRes([]));
    await startManager(cfg3);
    await manager.reconcileRun("test-idempotency-2");

    const count = (sql: string) => (getDb().prepare(sql).get() as { n: number }).n;
    expect(count(`SELECT COUNT(*) AS n FROM fills_log WHERE trade_id IN ('7001','7002','7003')`)).toBe(3);
    expect(count(`SELECT COUNT(*) AS n FROM orders_log WHERE exchange_order_id IN ('6001','6002')`)).toBe(2);
    expect(count(`SELECT COUNT(*) AS n FROM account_income`)).toBe(1); // single REALIZED_PNL row, no duplicates
    expect(accountMetricsDto().realizedPnl).toBeCloseTo(-12.5);
    expect(accountMetricsDto().stale).toBe(false);

    await manager.stopAndWait();
    resetLiveManagerForTests();
  }, 30_000);
});
