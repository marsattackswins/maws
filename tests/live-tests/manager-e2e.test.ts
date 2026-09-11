import { BinanceLiveManager, resetLiveManagerForTests } from "@/lib/server/binance/manager";
import { findByClientOrderId } from "@/lib/server/binance/intents";
import { liveState } from "@/lib/server/binance/state";
import { getRuntime, RUNTIME_KEYS, setRuntime } from "@/lib/server/runtime/flags";
import { getDb } from "@/lib/server/db/connection";
import { sseBus } from "@/lib/server/binance/sse";
import { FakeHttp, FakeWs, freshEnv, installFakes, jsonRes, makeCfg, accountFixture, BTCUSDT_INFO, orderEvent, orderFixture } from "./helpers";
import { healthSignals } from "@/lib/server/health/state";
import { getMetrics, METRICS } from "@/lib/server/metrics/collector";

/**
 * End-to-end broker lifecycle against an in-memory testnet: startup, clock
 * sync, metadata, snapshot, private stream, order submission, stream-driven
 * fills, reconciliation. No real network is ever touched.
 */

let manager: BinanceLiveManager;
let http: FakeHttp;
let events: Array<{ event: string; data: unknown }>;
let unsub: (() => void) | null = null;

const flush = async () => {
  for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
};

async function startManager(overrides: Record<string, () => unknown> = {}) {
  const cfg = freshEnv(makeCfg());
  http = new FakeHttp();
  installFakes(http);

  http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
  http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
  http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
  http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
  http.route("/fapi/v2/positionRisk", () => jsonRes([]));
  http.route("/fapi/v1/openOrders", () => jsonRes([]));
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-E2E" }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  for (const [pathPart, respond] of Object.entries(overrides)) {
    http.route(pathPart, () => jsonRes(respond()));
  }

  setRuntime(RUNTIME_KEYS.executionEnabled, "true");
  manager = new BinanceLiveManager(cfg);
  resetLiveManagerForTests(manager);
  events = [];
  unsub = sseBus.subscribe((event, data) => events.push({ event, data }));
  await manager.ensureStarted();
}

afterEach(() => {
  unsub?.();
  unsub = null;
  manager?.stop();
  resetLiveManagerForTests();
});

describe("BinanceLiveManager end-to-end (fake testnet)", () => {
  test("startup: clock, metadata, snapshot, stream, recon all reach ready", async () => {
    await startManager();
    expect(manager.status).toBe("ready");
    expect(manager.metadata.symbolCount()).toBeGreaterThanOrEqual(1);
    expect(manager.metadata.getConstraints("BTCUSDT")).not.toBeNull();
    expect(liveState().account?.totalWalletBalance).toBe("1000");
    expect(http.callsTo("/fapi/v1/time").length).toBeGreaterThanOrEqual(3); // clock samples
    expect(FakeWs.last().url).toContain("LK-E2E");

    // startup reconciliation recorded
    const runs = getDb().prepare(`SELECT trigger, result FROM reconciliation_runs`).all() as Array<{ trigger: string; result: string }>;
    expect(runs.some((r) => r.trigger === "startup")).toBe(true);
  });

  test("local env can construct a manager (for public data access)", () => {
    freshEnv(makeCfg({ env: "local" }));
    // Should not throw - local mode now allows manager for public data
    expect(() => new BinanceLiveManager()).not.toThrow();
  });

  test("hedge mode is detected and leaves live submissions disabled", async () => {
    await startManager({ "/fapi/v1/positionSide/dual": () => ({ dualSidePosition: true }) });
    expect(healthSignals().positionMode).toMatchObject({ mode: "hedge" });
    const ws = FakeWs.last();
    ws.emitOpen();
    await flush();
    const result = await manager.orders.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "hedge-blocked" });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Hedge position mode");
  });

  test("full order lifecycle: submit -> stream NEW -> partial fills -> FILLED", async () => {
    await startManager();
    const ws = FakeWs.last();
    ws.emitOpen();
    await flush();

    http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "e2e-1", type: "LIMIT", status: "NEW", price: "50000", origQty: "0.001" })));
    const res = await manager.orders.submitOrder({
      symbol: "BTCUSDT",
      side: "BUY",
      type: "LIMIT",
      qty: "0.001",
      price: "50000",
      clientOrderId: "e2e-1",
    });
    expect(res.ok).toBe(true);
    expect(findByClientOrderId("e2e-1")?.status).toBe("SUBMITTED");

    ws.emitMessage(orderEvent({ clientOrderId: "e2e-1", orderId: 555, tradeId: 7001, status: "PARTIALLY_FILLED", lastFilledQty: "0.0005", cumQty: "0.0005", lastFilledPrice: "50000", price: "50000", E: Date.now() + 1000 }));
    await flush();
    expect(findByClientOrderId("e2e-1")?.status).toBe("PARTIALLY_FILLED");
    expect(liveState().fills).toHaveLength(1);

    ws.emitMessage(orderEvent({ clientOrderId: "e2e-1", orderId: 555, tradeId: 7002, status: "FILLED", lastFilledQty: "0.0005", cumQty: "0.001", lastFilledPrice: "50001", price: "50000", E: Date.now() + 2000 }));
    await flush();
    expect(findByClientOrderId("e2e-1")?.status).toBe("FILLED");
    expect(liveState().orders.get("e2e-1")?.avgPrice).toBe("50000.5");
    expect(liveState().fills).toHaveLength(2);
    expect(liveState().openOrders.has("e2e-1")).toBe(false);

    // Replaying the same execution is a no-op for fills and realized P&L.
    ws.emitMessage(orderEvent({ clientOrderId: "e2e-1", orderId: 555, tradeId: 7002, status: "FILLED", lastFilledQty: "0.0005", cumQty: "0.001", lastFilledPrice: "50001", price: "50000", E: Date.now() + 3000 }));
    await flush();
    expect(liveState().fills).toHaveLength(2);

    // durable records
    const fillsRows = getDb().prepare(`SELECT COUNT(*) AS n FROM fills_log`).get() as { n: number };
    expect(fillsRows.n).toBe(2);
    const eventRows = getDb().prepare(`SELECT COUNT(*) AS n FROM order_events WHERE source = 'stream'`).get() as { n: number };
    expect(eventRows.n).toBe(3);
    const processedRows = getDb().prepare(`SELECT COUNT(*) AS n FROM order_events WHERE source = 'stream' AND processed = 1`).get() as { n: number };
    expect(processedRows.n).toBe(3);

    // SSE fan-out reached subscribers
    expect(events.some((e) => e.event === "order-update")).toBe(true);
    expect(events.some((e) => e.event === "fills")).toBe(true);
    expect(getMetrics().getCounter(METRICS.WS_MESSAGE_RECEIVED)).toBeGreaterThanOrEqual(3);
    expect(getMetrics().getCounter(METRICS.FILL_RECEIVED)).toBeGreaterThanOrEqual(2);
    expect(getMetrics().getCounter(METRICS.ORDER_SUBMITTED)).toBeGreaterThanOrEqual(1);
  });

  test("a failed fill transaction leaves the stream event unprocessed for retry", async () => {
    await startManager();
    const processEvent = (manager as unknown as { processEvent: (event: unknown) => void }).processEvent.bind(manager);
    const event = orderEvent({ clientOrderId: "retry-fill", orderId: 777, tradeId: 8777, status: "FILLED", lastFilledQty: "0.001", cumQty: "0.001", lastFilledPrice: "50000" });
    getDb().exec(`CREATE TRIGGER fail_fill_insert BEFORE INSERT ON fills_log BEGIN SELECT RAISE(ABORT, 'forced fill failure'); END`);
    expect(() => processEvent(event)).toThrow("forced fill failure");
    const failed = getDb().prepare(`SELECT processed FROM order_events WHERE client_order_id = ? ORDER BY id DESC LIMIT 1`).get("retry-fill") as { processed: number };
    expect(failed.processed).toBe(0);

    getDb().exec(`DROP TRIGGER fail_fill_insert`);
    processEvent(event);
    const retried = getDb().prepare(`SELECT processed FROM order_events WHERE client_order_id = ? ORDER BY id DESC LIMIT 1`).get("retry-fill") as { processed: number };
    expect(retried.processed).toBe(1);
    const fillCount = getDb().prepare(`SELECT COUNT(*) AS n FROM fills_log WHERE trade_id = ?`).get("8777") as { n: number };
    expect(fillCount.n).toBe(1);
  });

  test("ACCOUNT_UPDATE events refresh balance state", async () => {
    await startManager();
    const ws = FakeWs.last();
    ws.emitOpen();
    await flush();
    ws.emitMessage({
      e: "ACCOUNT_UPDATE",
      E: Date.now() + 1000,
      T: Date.now() + 1000,
      a: {
        B: [{ a: "USDT", wb: "1500", cw: "1500", bc: "0" }],
        P: [{ s: "BTCUSDT", pa: "0.001", ep: "50000", cr: "0", up: "1", mt: "cross", iw: "0", ps: "BOTH" }],
      },
    });
    await flush();
    expect(liveState().account?.totalWalletBalance).toBe("1500");
    expect(liveState().positions.get("BTCUSDT")?.qty).toBe("0.001");
    expect(events.some((e) => e.event === "account-update")).toBe(true);
  });

  test("kill switch engaged mid-session blocks new submissions", async () => {
    await startManager();
    setRuntime(RUNTIME_KEYS.killSwitch, "true");
    const res = await manager.orders.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "ks-e2e" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("kill switch");
    expect(findByClientOrderId("ks-e2e")).toBeNull();
  });

  test("reconciliation drift freezes submissions; clean recon unfreezes", async () => {
    await startManager({
      "/fapi/v1/openOrders": () => [orderFixture({ clientOrderId: "ghost-order", status: "NEW", type: "LIMIT", price: "50000" })],
    });
    // startup recon already saw the ghost -> drift freeze expected
    expect(getRuntime(RUNTIME_KEYS.frozen)).toBe("true");
    const blocked = await manager.orders.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "dr1" });
    expect(blocked.ok).toBe(false);

    // Heal: ghost disappears from the exchange.
    http.route("/fapi/v1/openOrders", () => jsonRes([]));
    const result = await manager.reconcileRun("manual");
    expect(result.result).toBe("ok");
    expect(getRuntime(RUNTIME_KEYS.frozen)).toBe("false");
    http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "dr2", status: "NEW" })));
    const ok = await manager.orders.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "dr2" });
    expect(ok.ok).toBe(true);
  });

  test("reference price comes from mark price when a position exists", async () => {
    await startManager();
    const now = Date.now();
    liveState().positions.set("BTCUSDT", {
      symbol: "BTCUSDT", side: "long", qty: "0.001", entryPrice: "49000", markPrice: "50123.4",
      unrealizedProfit: "1", leverage: "1", liquidationPrice: "0", notional: "50", updatedAt: now,
    });
    const fromMark = await manager.getReferencePrice("BTCUSDT");
    expect(fromMark).toEqual({ price: "50123.4", at: now });
    liveState().positions.delete("BTCUSDT");
    const fromTicker = await manager.getReferencePrice("BTCUSDT");
    expect(fromTicker?.price).toBe("50000"); // ticker fallback
    expect(Date.now() - (fromTicker?.at ?? 0)).toBeLessThan(5_000);
  });

  test("client order ids are unique, prefixed and within the 36-char limit", async () => {
    await startManager();
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const id = manager.newClientOrderId("ord");
      expect(id.length).toBeLessThanOrEqual(36);
      expect(id.startsWith("ord")).toBe(true);
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  });
});
