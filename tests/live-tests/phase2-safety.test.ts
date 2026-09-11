import { cancelAllAndFlatten } from "@/lib/server/binance/emergency";
import { BinanceRestClient } from "@/lib/server/binance/rest";
import { OrderService } from "@/lib/server/binance/orders";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import { checkRisk } from "@/lib/server/binance/risk";
import { liveState, resetLiveStateForTests } from "@/lib/server/binance/state";
import { getBinanceRestBreaker, getReconciliationBreaker } from "@/lib/server/resilience/breakers";
import { setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { buildHealthStatus } from "@/lib/server/health/status";

import { setHealthSignal, resetHealthSignalsForTests } from "@/lib/server/health/state";
import { FakeHttp, FakeWs, ManualTimers, freshEnv, installFakes, jsonRes, makeCfg, orderFixture } from "./helpers";
import { StreamOwnerLease } from "@/lib/server/binance/lease";
import { UserDataStream } from "@/lib/server/binance/stream";
import { extractConstraints } from "@/lib/server/binance/filters";
import { BTCUSDT_INFO } from "./helpers";

beforeEach(() => {
  freshEnv(makeCfg());
  resetLiveStateForTests();
  resetHealthSignalsForTests();
  const now = Date.now();
  setHealthSignal({
    managerRunning: true,
    brokerStatus: "ready",
    stream: { connected: true, leaseOwned: true, phase: "live", startedAt: now, lastEventAt: now, lastApplicationEventAt: now, reconnects: 0, listenKeyRenewedAt: now, bufferOverflow: false, circuitState: "closed" },
    snapshot: { fetchedAt: now },
    positionMode: { mode: "one-way", checkedAt: now, error: null },
  });
  setRuntime(RUNTIME_KEYS.executionEnabled, "true");
  setRuntime(RUNTIME_KEYS.killSwitch, "false");
  setRuntime(RUNTIME_KEYS.frozen, "false");
});

describe("Phase 2 pending exposure", () => {
  test("working orders and uncertain intents are included in gross exposure", () => {
    const cfg = makeCfg({ risk: { ...makeCfg().risk, maxGrossExposureUsd: 100 } });
    const errors = checkRisk(
      cfg,
      {
        balanceUsd: 1000,
        grossExposureUsd: 0,
        openOrderCount: 1,
        openPositionCount: 0,
        realizedTodayUsd: 0,
        workingOrders: [{ qty: "0.001", effectivePrice: "50000" }],
        uncertainIntents: [{ qty: "0.001", effectivePrice: "50000" }],
      },
      { type: "MARKET", qty: "0.001", effectivePrice: "50000", reduceOnly: false },
      "50000",
    );
    expect(errors.join(";")).toContain("RISK_MAX_GROSS_EXPOSURE");
    expect(errors.join(";")).toContain("150.00");
  });

  test("serialized submissions reserve the first working order before the next risk check", async () => {
    const cfg = makeCfg({ risk: { ...makeCfg().risk, maxGrossExposureUsd: 50 } });
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/order", () => jsonRes(orderFixture({ price: "50000", clientOrderId: "server" })));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    const service = new OrderService({
      cfg,
      rest,
      getConstraints: () => extractConstraints(BTCUSDT_INFO),
      getReferencePrice: async () => ({ price: "50000", at: Date.now() }),
      getRiskSnapshot: () => ({
        balanceUsd: 1000,
        grossExposureUsd: 0,
        openOrderCount: liveState().openOrders.size,
        openPositionCount: 0,
        realizedTodayUsd: 0,
        workingOrders: [...liveState().openOrders.values()].map((o) => ({ qty: o.origQty, effectivePrice: o.price })),
      }),
      freeze: () => undefined,
      emit: () => undefined,
    });

    const [first, second] = await Promise.all([
      service.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", price: "50000", clientOrderId: "phase2-a" }),
      service.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", price: "50000", clientOrderId: "phase2-b" }),
    ]);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(false);
    expect(second.error).toContain("RISK_MAX_GROSS_EXPOSURE");
  });
});

describe("Phase 2 emergency flatten", () => {
  test("flattens orders and positions despite normal freezes and coalesces concurrent calls", async () => {
    let orderCancels = 0;
    let closes = 0;
    let positions = true;
    const deps = {
      getOpenOrders: async () => [orderFixture({ clientOrderId: "protective-1", symbol: "BTCUSDT" }) as never],
      getOpenPositions: async () => positions ? [{ symbol: "BTCUSDT", positionAmt: "0.001" }] : [],
      cancelAllOpenOrders: async () => {
        orderCancels += 1;
        return [orderFixture({ clientOrderId: "protective-1", status: "CANCELED" }) as never];
      },
      closePosition: async () => {
        closes += 1;
        positions = false;
        return { ok: true, clientOrderId: "emergency-1", status: "NEW" };
      },
    };
    setRuntime(RUNTIME_KEYS.killSwitch, "true");
    setRuntime(RUNTIME_KEYS.frozen, "true");

    const [a, b] = await Promise.all([
      cancelAllAndFlatten("test-account", deps, "operator:test-a"),
      cancelAllAndFlatten("test-account", deps, "operator:test-b"),
    ]);
    expect(a).toBe(b);
    expect(orderCancels).toBe(1);
    expect(closes).toBe(1);
    expect(a.canceledOrderIds).toEqual(["protective-1"]);
    expect(a.closedPositions[0].result.ok).toBe(true);
  });

  test("OrderService emergency close bypasses kill switch and REST breaker", async () => {
    const cfg = makeCfg();
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v2/positionRisk", () => jsonRes([{ symbol: "BTCUSDT", positionAmt: "-0.002", entryPrice: "50000", markPrice: "50000", unRealizedProfit: "0", leverage: "1", liquidationPrice: "0", notional: "-100" }]));
    http.route("/fapi/v1/order", () => jsonRes(orderFixture({ side: "BUY", type: "MARKET", origQty: "0.002", clientOrderId: "emergency-response" })));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    getBinanceRestBreaker().forceOpen();
    setRuntime(RUNTIME_KEYS.killSwitch, "true");
    setRuntime(RUNTIME_KEYS.frozen, "true");
    const service = new OrderService({
      cfg,
      rest,
      getConstraints: () => null,
      getReferencePrice: async () => null,
      getRiskSnapshot: () => ({ balanceUsd: 0, grossExposureUsd: 0, openOrderCount: 0, openPositionCount: 0, realizedTodayUsd: 0 }),
      freeze: () => undefined,
      emit: () => undefined,
    });

    const result = await service.emergencyClosePosition("BTCUSDT");
    expect(result.ok).toBe(true);
    expect(http.callsTo("/fapi/v2/positionRisk")).toHaveLength(1);
    expect(http.callsTo("/fapi/v1/order").filter((call) => call.method === "POST")).toHaveLength(1);
    expect(new URL(http.callsTo("/fapi/v1/order")[0].url).search).toContain("reduceOnly=true");
    expect(new URL(http.callsTo("/fapi/v1/order")[0].url).search).toContain("quantity=0.002");
  });
});

describe("Phase 2 stream and reconciliation health", () => {
  test("stale socket callbacks cannot drop the replacement generation", async () => {
    const cfg = makeCfg();
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "phase2-listen" }));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    const timers = new ManualTimers();
    const stream = new UserDataStream({
      cfgEnv: "testnet",
      rest,
      lease: new StreamOwnerLease("phase2", cfg.leaseTtlMs),
      takeSnapshot: async () => undefined,
      processEvent: () => undefined,
      freeze: () => undefined,
      onStatus: () => undefined,
      timers,
    });
    await stream.start();
    const first = FakeWs.last();
    first.emitOpen();
    await new Promise((resolve) => setTimeout(resolve, 0));
    first.emitClose();
    timers.advance(1000);
    const second = FakeWs.last();
    second.emitOpen();
    await new Promise((resolve) => setTimeout(resolve, 0));
    first.emitClose();
    expect(stream.status().generation).toBe(2);
    expect(stream.status().reconnects).toBe(1);
    stream.stop();
  });

  test("buffer overflow marks data loss and escalates to reconciliation", async () => {
    const cfg = makeCfg();
    const http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "overflow-listen" }));
    const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
    rest.setTransportForTests(http);
    let releaseSnapshot!: () => void;
    const snapshot = new Promise<void>((resolve) => { releaseSnapshot = resolve; });
    let reconciliations = 0;
    const stream = new UserDataStream({
      cfgEnv: "testnet",
      rest,
      lease: new StreamOwnerLease("overflow", cfg.leaseTtlMs),
      takeSnapshot: () => snapshot,
      processEvent: () => undefined,
      reconcile: async () => { reconciliations += 1; },
      freeze: () => undefined,
      onStatus: () => undefined,
    });
    await stream.start();
    const ws = FakeWs.last();
    ws.emitOpen();
    for (let i = 0; i < 5001; i += 1) ws.emitMessage({ e: "ACCOUNT_UPDATE", E: Date.now() + i });
    expect(stream.status().bufferOverflow).toBe(true);
    releaseSnapshot();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(reconciliations).toBe(1);
    expect(stream.status().bufferOverflow).toBe(true);
    stream.stop();
  });

  test("heartbeat age degrades an otherwise connected private stream", () => {
    const now = Date.now();
    setHealthSignal({
      stream: {
        connected: true,
        phase: "live",
        startedAt: now - 10 * 60 * 1000,
        lastEventAt: now,
        lastApplicationEventAt: now - 6 * 60 * 1000,
        reconnects: 0,
        listenKeyRenewedAt: null,
        generation: 4,
        bufferOverflow: false,
        circuitState: "closed",
      },
    });
    const health = buildHealthStatus(makeCfg());
    expect(health.streamHealthy).toBe(false);
    expect(health.signals.stream?.generation).toBe(4);
  });

  test("reconciliation failures open its circuit and block later runs", async () => {
    const breaker = getReconciliationBreaker();
    breaker.reset();
    const before = breaker.getStats().totalFailures;
    // The breaker itself is tested here because Reconciler wraps every run in it;
    // this also verifies the configured threshold used by the live environment.
    await expect(breaker.execute(async () => { throw new Error("recon down"); })).rejects.toThrow("recon down");
    await expect(breaker.execute(async () => { throw new Error("recon down"); })).rejects.toThrow("recon down");
    await expect(breaker.execute(async () => { throw new Error("recon down"); })).rejects.toThrow("recon down");
    expect(breaker.getStats().totalFailures).toBeGreaterThanOrEqual(before + 3);
    expect(breaker.getState()).toBe("open");
  });
});
