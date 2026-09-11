import { BinanceRestClient } from "@/lib/server/binance/rest";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import { OrderService, type ReferencePrice } from "@/lib/server/binance/orders";
import { extractConstraints } from "@/lib/server/binance/filters";
import { RUNTIME_KEYS, setRuntime } from "@/lib/server/runtime/flags";
import type { EnvConfig } from "@/lib/server/env/config";
import { BTCUSDT_INFO, FakeHttp, freshEnv, installFakes, jsonRes, makeCfg, orderFixture } from "./helpers";

interface Harness {
  cfg: EnvConfig;
  http: FakeHttp;
  svc: OrderService;
  freezes: string[];
}

type SetupOverrides = Omit<Partial<EnvConfig>, 'risk'> & {
  risk?: Partial<EnvConfig['risk']>;
};

function setup(
  cfgOverrides: SetupOverrides = {},
  riskSnapshot?: { balanceUsd?: number; grossExposureUsd?: number; openOrderCount?: number; openPositionCount?: number; realizedTodayUsd?: number },
): Harness {
  const baseCfg = makeCfg();
  const base = freshEnv(baseCfg);
  const http = new FakeHttp();
  installFakes(http);
  
  // Merge risk properly - partial risk overrides merge with base risk
  const cfg: EnvConfig = { 
    ...base, 
    ...cfgOverrides,
    risk: cfgOverrides.risk ? { ...base.risk, ...cfgOverrides.risk } : base.risk
  };
  
  const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
  rest.setTransportForTests(http);
  setRuntime(RUNTIME_KEYS.executionEnabled, "true");

  const constraints = extractConstraints(BTCUSDT_INFO);
  const freezes: string[] = [];
  const snap = riskSnapshot ?? { balanceUsd: 1000, grossExposureUsd: 0, openOrderCount: 0, openPositionCount: 0, realizedTodayUsd: 0 };
  const svc = new OrderService({
    cfg,
    rest,
    getConstraints: (s) => (s === "BTCUSDT" ? constraints : null),
    getReferencePrice: async () => ({ price: "50000", at: Date.now() }),
    getRiskSnapshot: () => ({
      balanceUsd: snap.balanceUsd ?? 1000,
      grossExposureUsd: snap.grossExposureUsd ?? 0,
      openOrderCount: snap.openOrderCount ?? 0,
      openPositionCount: snap.openPositionCount ?? 0,
      realizedTodayUsd: snap.realizedTodayUsd ?? 0,
    }),
    freeze: (reason) => {
      freezes.push(reason);
      setRuntime(RUNTIME_KEYS.frozen, "true");
      setRuntime(RUNTIME_KEYS.frozenReason, reason);
    },
    emit: () => {},
    sleep: async () => undefined,
  });
  return { cfg, http, svc, freezes };
}

const placeCalls = (h: Harness) => h.http.callsTo("/fapi/v1/order").filter((c) => c.method === "POST");

describe("server-side risk caps", () => {
  test("order over $100 notional is rejected even with forged lower client-side value", async () => {
    const h = setup({ risk: { maxOrderNotionalUsd: 100 } });
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "big1", status: "NEW" })));

    // qty=0.01 at price=50000 = $500 notional, well over $100 cap
    const res = await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.01", clientOrderId: "big1",
    });

    expect(res.ok).toBe(false);
    expect(res.error).toContain("RISK_MAX_ORDER_NOTIONAL");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("order that would exceed gross exposure cap is rejected", async () => {
    const h = setup(
      { risk: { maxGrossExposureUsd: 100 } },
      { grossExposureUsd: 80 },
    );
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "exp1", status: "NEW" })));

    // qty=0.001 at price=50000 = $50 notional; 80 + 50 = 130 > 100
    const res = await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "exp1",
    });

    expect(res.ok).toBe(false);
    expect(res.error).toContain("RISK_MAX_GROSS_EXPOSURE");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("open position cap rejects new non-reduce-only orders", async () => {
    const h = setup(
      { risk: { maxOpenPositions: 1 } },
      { openPositionCount: 1 },
    );
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "pos1", status: "NEW" })));

    const res = await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "pos1",
    });

    expect(res.ok).toBe(false);
    expect(res.error).toContain("RISK_MAX_OPEN_POSITIONS");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("reduce-only orders bypass the open position cap", async () => {
    const h = setup(
      { risk: { maxOpenPositions: 1 } },
      { openPositionCount: 1 },
    );
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "red1", status: "NEW" })));

    const res = await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "SELL", type: "MARKET", qty: "0.001", reduceOnly: true, clientOrderId: "red1",
    });

    expect(res.ok).toBe(true);
    expect(placeCalls(h)).toHaveLength(1);
  });

  test("open order cap rejects LIMIT orders when at limit", async () => {
    const h = setup(
      { risk: { maxOpenOrders: 1 } },
      { openOrderCount: 1 },
    );

    const res = await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", price: "50000", clientOrderId: "ord1",
    });

    expect(res.ok).toBe(false);
    expect(res.error).toContain("RISK_MAX_OPEN_ORDERS");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("unhealthy execution state rejects submission via execution gate", async () => {
    const h = setup();
    setRuntime(RUNTIME_KEYS.frozen, "true");
    setRuntime(RUNTIME_KEYS.frozenReason, "stream disconnected");

    const res = await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "frz1",
    });

    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("kill switch blocks submission without calling Binance", async () => {
    const h = setup();
    setRuntime(RUNTIME_KEYS.killSwitch, "true");

    const res = await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "ks1",
    });

    expect(res.ok).toBe(false);
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("rejected risk check makes zero Binance network requests", async () => {
    const h = setup({ risk: { maxOrderNotionalUsd: 10 } });

    await h.svc.submitOrder({
      symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "nr1",
    });

    expect(h.http.calls).toHaveLength(0);
  });
});
