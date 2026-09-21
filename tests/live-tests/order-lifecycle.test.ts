import { BinanceRestClient } from "@/lib/server/binance/rest";
import { RateLimiter } from "@/lib/server/binance/ratelimit";
import { OrderService, type ReferencePrice } from "@/lib/server/binance/orders";
import { extractConstraints } from "@/lib/server/binance/filters";
import { createIntent, findByClientOrderId, updateIntent } from "@/lib/server/binance/intents";
import { liveState } from "@/lib/server/binance/state";
import { RUNTIME_KEYS, setRuntime } from "@/lib/server/runtime/flags";
import type { EnvConfig } from "@/lib/server/env/config";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { BTCUSDT_INFO, FakeHttp, freshEnv, installFakes, jsonRes, makeCfg, orderFixture } from "./helpers";

const flush = async () => {
  for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
};

interface Harness {
  cfg: EnvConfig;
  http: FakeHttp;
  rest: BinanceRestClient;
  svc: OrderService;
  freezes: string[];
  emitted: Array<{ event: string; data: unknown }>;
}

function setup(
  cfgOverrides: Partial<EnvConfig> = {},
  depOverrides: { getReferencePrice?: (symbol: string) => Promise<ReferencePrice | null> } = {},
): Harness {
  // Fakes are only installable under a testnet server config (shadow and
  // production refuse the DI seam outright); the service under test can then
  // be pointed at any env via its own cfg object.
  const base = freshEnv(makeCfg());
  const http = new FakeHttp();
  installFakes(http);
  const cfg = { ...base, ...cfgOverrides };
  const profile = persistenceProfileFromConfig(cfg);
  const rest = new BinanceRestClient(cfg, new RateLimiter(cfg.rateInternalPerMin), async () => undefined);
  rest.setTransportForTests(http);
  setRuntime(RUNTIME_KEYS.executionEnabled, "true", Date.now(), profile);
  setRuntime(RUNTIME_KEYS.killSwitch, "false", Date.now(), profile);
  setRuntime(RUNTIME_KEYS.frozen, "false", Date.now(), profile);
  setRuntime(RUNTIME_KEYS.frozenReason, "", Date.now(), profile);

  const constraints = extractConstraints(BTCUSDT_INFO);
  const freezes: string[] = [];
  const emitted: Array<{ event: string; data: unknown }> = [];
  const svc = new OrderService({
    cfg,
    rest,
    getConstraints: (s) => (s === "BTCUSDT" ? constraints : null),
    getReferencePrice: depOverrides.getReferencePrice ?? (async () => ({ price: "50000", at: Date.now() })),
    getRiskSnapshot: () => ({ balanceUsd: 1000, grossExposureUsd: 0, openOrderCount: 0, openPositionCount: 0, realizedTodayUsd: 0 }),
    freeze: (reason) => {
      freezes.push(reason);
      setRuntime(RUNTIME_KEYS.frozen, "true", Date.now(), profile);
      setRuntime(RUNTIME_KEYS.frozenReason, reason, Date.now(), profile);
    },
    emit: (event, data) => emitted.push({ event, data }),
    sleep: async () => undefined,
  });
  return { cfg, http, rest, svc, freezes, emitted };
}

const placeCalls = (h: Harness) => h.http.callsTo("/fapi/v1/order").filter((c) => c.method === "POST");
const queryOf = (c: { url: string }) => new URLSearchParams(c.url.split("?")[1]);

describe("order submission (testnet lifecycle via fake exchange)", () => {
  test("MARKET order: intent persisted before submission, accepted by exchange", async () => {
    const h = setup();
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "mk1", type: "MARKET", status: "NEW" })));

    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "mk1" });
    expect(res).toMatchObject({ ok: true, clientOrderId: "mk1", status: "NEW" });

    const call = placeCalls(h)[0];
    const q = queryOf(call);
    expect(q.get("symbol")).toBe("BTCUSDT");
    expect(q.get("side")).toBe("BUY");
    expect(q.get("type")).toBe("MARKET");
    expect(q.get("quantity")).toBe("0.001");
    expect(q.get("newClientOrderId")).toBe("mk1");
    expect(q.get("timeInForce")).toBeNull();
    expect(q.get("signature")).toMatch(/^[0-9a-f]{64}$/);

    const intent = findByClientOrderId("mk1");
    expect(intent?.status).toBe("SUBMITTED");
    expect(Number(intent?.exchangeOrderId)).toBe(res.exchangeOrderId);
    expect(h.emitted.some((e) => e.event === "order-update")).toBe(true);
  });

  test("LIMIT order sends price and timeInForce=GTC", async () => {
    const h = setup({ risk: { maxOrderNotionalUsd: 100, maxGrossExposureUsd: 1000, maxOpenOrders: 10, maxOpenPositions: 3, dailyLossPct: 5, priceCollarPct: 2 } });
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "lm1", type: "LIMIT", status: "NEW" })));
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "SELL", type: "LIMIT", qty: "0.001", price: "50000.5", clientOrderId: "lm1" });
    expect(res.ok).toBe(true);
    const q = queryOf(placeCalls(h)[0]);
    expect(q.get("type")).toBe("LIMIT");
    expect(q.get("price")).toBe("50000.5");
    expect(q.get("timeInForce")).toBe("GTC");
  });

  test("filter violations are rejected before any exchange call and leave no intent", async () => {
    const h = setup();
    const badTick = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", price: "50000.15", clientOrderId: "vt1" });
    expect(badTick.ok).toBe(false);
    expect(badTick.error).toContain("tickSize");

    const missingQty = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", clientOrderId: "vt2" });
    expect(missingQty.ok).toBe(false);
    expect(missingQty.error).toContain("qty is required");

    const unknownSymbol = await h.svc.submitOrder({ symbol: "NOPEUSDT", side: "BUY", type: "MARKET", qty: "1", clientOrderId: "vt3" });
    expect(unknownSymbol.ok).toBe(false);
    expect(unknownSymbol.error).toContain("No exchange filter data");

    expect(placeCalls(h)).toHaveLength(0);
    expect(findByClientOrderId("vt1")).toBeNull();
  });

  test("risk caps reject oversized orders before any exchange call", async () => {
    const h = setup();
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.003", clientOrderId: "rk1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("RISK_MAX_ORDER_NOTIONAL");
    expect(placeCalls(h)).toHaveLength(0);
    expect(findByClientOrderId("rk1")).toBeNull();
  });

  test("unrounded margin-derived qty is floored to stepSize before validation and submission", async () => {
    // UI sizing produces arbitrary floats like 0.012331811 (100 USDT × 10x /
    // 81100). The LOT_SIZE step for the harness symbol is 0.001, so the
    // pre-flight validator must never see the off-grid value.
    const h = setup({
      risk: { maxOrderNotionalUsd: 1000, maxGrossExposureUsd: 5000, maxOpenOrders: 10, maxOpenPositions: 3, dailyLossPct: 5, priceCollarPct: 2 },
    });
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "qt1", type: "MARKET", status: "NEW" })));

    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.012331811", clientOrderId: "qt1" });
    expect(res.ok).toBe(true);

    const q = queryOf(placeCalls(h)[0]);
    expect(q.get("quantity")).toBe("0.012");
    // The persisted intent records the aligned quantity, not the raw input.
    expect(findByClientOrderId("qt1")?.qty).toBe("0.012");
  });

  test("qty that floors below minQty is rejected cleanly without exchange traffic", async () => {
    const h = setup();
    // 0.0005 floors to zero steps of 0.001 → validation reports minQty.
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.0005", clientOrderId: "qt2" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("minQty");
    expect(res.error).toContain("qty");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("UI-selected leverage is synced to the exchange before the order", async () => {
    const h = setup();
    h.http.route("/fapi/v1/leverage", () => jsonRes({ leverage: 20, maxNotionalValue: "1000000" }));
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "lv1", type: "MARKET", status: "NEW" })));

    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", leverage: 20, clientOrderId: "lv1" });
    expect(res.ok).toBe(true);

    const levCalls = h.http.callsTo("/fapi/v1/leverage").filter((c) => c.method === "POST");
    expect(levCalls).toHaveLength(1);
    const levQ = new URLSearchParams(levCalls[0].url.split("?")[1]);
    expect(levQ.get("symbol")).toBe("BTCUSDT");
    expect(levQ.get("leverage")).toBe("20");
    // The order still goes out after the successful sync.
    expect(placeCalls(h)).toHaveLength(1);
  });

  test("no leverage call when leverage is absent; explicit 1x is still synced", async () => {
    const h = setup();
    h.http.route("/fapi/v1/leverage", () => jsonRes({ leverage: 1, maxNotionalValue: "1000000" }));
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "lv2", type: "MARKET", status: "NEW" })));

    await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "lv2" });
    await h.svc.submitOrder({ symbol: "BTCUSDT", side: "SELL", type: "MARKET", qty: "0.001", leverage: 1, clientOrderId: "lv3" });
    const levCalls = h.http.callsTo("/fapi/v1/leverage").filter((c) => c.method === "POST");
    expect(levCalls).toHaveLength(1);
    const levQ = new URLSearchParams(levCalls[0].url.split("?")[1]);
    expect(levQ.get("leverage")).toBe("1");
  });

  test("out-of-bracket leverage (-4028) rejects the order without sending it", async () => {
    const h = setup();
    h.http.scriptApiError("/fapi/v1/leverage", -4028, "Leverage 100 is not valid for BTCUSDT", 400);

    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", leverage: 100, clientOrderId: "lv4" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("not available");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("invalid leverage values are ignored (no sync, no rejection)", async () => {
    const h = setup();
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "lv5", type: "MARKET", status: "NEW" })));

    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", leverage: 0, clientOrderId: "lv5" });
    expect(res.ok).toBe(true);
    expect(h.http.callsTo("/fapi/v1/leverage")).toHaveLength(0);
  });

  test("stale or missing market data rejects orders fail-closed", async () => {
    const stale = setup({}, { getReferencePrice: async () => ({ price: "50000", at: Date.now() - 31_000 }) });
    const staleRes = await stale.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "st1" });
    expect(staleRes.ok).toBe(false);
    expect(staleRes.error).toContain("stale");
    expect(placeCalls(stale)).toHaveLength(0);
    expect(findByClientOrderId("st1")).toBeNull();

    const missing = setup({}, { getReferencePrice: async () => null });
    const missingRes = await missing.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "st2" });
    expect(missingRes.ok).toBe(false);
    expect(missingRes.error).toContain("No reference price");
    expect(placeCalls(missing)).toHaveLength(0);
    expect(findByClientOrderId("st2")).toBeNull();
  });

  test("limit price outside the collar is rejected", async () => {
    const h = setup();
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", price: "60000", clientOrderId: "cl1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("collar");
  });

  test("duplicate clientOrderId is refused and never double-submitted", async () => {
    const h = setup();
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "dup1", status: "NEW" })));
    const first = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "dup1" });
    expect(first.ok).toBe(true);
    const second = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "dup1" });
    expect(second).toMatchObject({ ok: false, duplicate: true });
    expect(second.error).toContain("Duplicate");
    expect(placeCalls(h)).toHaveLength(1);
  });

  test("exchange rejection (-2010) marks the intent REJECTED", async () => {
    const h = setup();
    h.http.scriptApiError("/fapi/v1/order", -2010, "New order rejected", 400);
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "rj1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("New order rejected");
    expect(findByClientOrderId("rj1")?.status).toBe("REJECTED");
    expect(h.freezes).toHaveLength(0);
  });

  test("invalid API key (-2015) freezes submissions fail-closed", async () => {
    const h = setup();
    h.http.scriptApiError("/fapi/v1/order", -2015, "Invalid API-key", 401);
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "ky1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("frozen");
    expect(h.freezes.length).toBe(1);
    expect(findByClientOrderId("ky1")?.status).toBe("REJECTED");
    // Subsequent submissions stay blocked while frozen.
    const next = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "ky2" });
    expect(next.ok).toBe(false);
  });

  test("submission timeout: TIMEOUT_UNKNOWN + freeze, then resolved to FILLED via exchange truth", async () => {
    const h = setup();
    h.http.scriptTimeout("/fapi/v1/order");
    h.http.route("/fapi/v1/order", () =>
      jsonRes(orderFixture({ clientOrderId: "to1", status: "FILLED", executedQty: "0.001", avgPrice: "50000" })),
    );
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "to1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("timed out");
    expect(findByClientOrderId("to1")?.status).toBe("TIMEOUT_UNKNOWN");
    expect(h.freezes.length).toBe(1);
    await flush();
    expect(findByClientOrderId("to1")?.status).toBe("FILLED");
    // The placeOrder call happened exactly once: no blind retry.
    expect(placeCalls(h)).toHaveLength(1);
  });

  test("HTTP 5xx submission is uncertain, frozen, and resolved by later exchange truth", async () => {
    const h = setup();
    h.http.scriptApiError("/fapi/v1/order", -1000, "Internal error", 503);
    h.http.scriptApiError("/fapi/v1/order", -1000, "Status query unavailable", 503);
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "u5xx" });
    expect(res.ok).toBe(false);
    await flush();
    expect(findByClientOrderId("u5xx")?.status).toBe("UNCERTAIN");
    expect(h.freezes).toHaveLength(1);

    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "u5xx", status: "FILLED", executedQty: "0.001", avgPrice: "50000" })));
    await h.svc.resolveUnknownOutcome("u5xx");
    expect(findByClientOrderId("u5xx")?.status).toBe("FILLED");
  });

  test("submission timeout resolving to not-found ends REJECTED", async () => {
    const h = setup();
    h.http.scriptTimeout("/fapi/v1/order");
    h.http.scriptApiError("/fapi/v1/order", -2013, "Order does not exist", 400);
    h.http.scriptApiError("/fapi/v1/order", -2013, "Order does not exist", 400);
    h.http.scriptApiError("/fapi/v1/order", -2013, "Order does not exist", 400);
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "to2" });
    expect(res.ok).toBe(false);
    await flush();
    expect(findByClientOrderId("to2")?.status).toBe("REJECTED");
    expect(placeCalls(h)).toHaveLength(1);
  });
});

describe("cancel flows and races", () => {
  async function submitWorking(h: Harness, id: string): Promise<void> {
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: id, status: "NEW", type: "LIMIT", price: "50000" })));
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", price: "50000", clientOrderId: id });
    expect(res.ok).toBe(true);
  }

  test("plain cancel succeeds", async () => {
    const h = setup();
    await submitWorking(h, "cx1");
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "cx1", status: "CANCELED" })));
    const res = await h.svc.cancelOrder("cx1", "BTCUSDT");
    expect(res.ok).toBe(true);
    expect(findByClientOrderId("cx1")?.status).toBe("CANCELED");
  });

  test("cancel/fill race: -2011 resolves to FILLED via order query", async () => {
    const h = setup();
    await submitWorking(h, "cx2");
    h.http.scriptApiError("/fapi/v1/order", -2011, "Unknown order sent", 400);
    h.http.route("/fapi/v1/order", () =>
      jsonRes(orderFixture({ clientOrderId: "cx2", status: "FILLED", executedQty: "0.001", avgPrice: "50000" })),
    );
    const res = await h.svc.cancelOrder("cx2", "BTCUSDT");
    expect(res.ok).toBe(true);
    expect(res.status).toBe("FILLED");
    expect(findByClientOrderId("cx2")?.status).toBe("FILLED");
    expect(h.freezes).toHaveLength(0);
  });

  test("cancel/fill race: -2011 with no exchange record resolves cleanly", async () => {
    const h = setup();
    await submitWorking(h, "cx3");
    h.http.scriptApiError("/fapi/v1/order", -2011, "Unknown order sent", 400);
    h.http.scriptApiError("/fapi/v1/order", -2013, "Order does not exist", 400);
    const res = await h.svc.cancelOrder("cx3", "BTCUSDT");
    expect(res.ok).toBe(true);
    expect(res.status).toBe("RESOLVED");
    expect(findByClientOrderId("cx3")?.status).toBe("RESOLVED");
  });

  test("HTTP 5xx cancel is uncertain, frozen, and verified against exchange truth", async () => {
    const h = setup();
    await submitWorking(h, "cx5xx");
    h.http.scriptApiError("/fapi/v1/order", -1000, "Internal error", 503);
    h.http.scriptApiError("/fapi/v1/order", -1000, "Status query unavailable", 503);
    const res = await h.svc.cancelOrder("cx5xx", "BTCUSDT");
    expect(res.ok).toBe(false);
    await flush();
    expect(findByClientOrderId("cx5xx")?.status).toBe("CANCEL_UNKNOWN");
    expect(h.freezes).toHaveLength(1);

    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "cx5xx", status: "CANCELED" })));
    await h.svc.resolveUnknownOutcome("cx5xx");
    expect(findByClientOrderId("cx5xx")?.status).toBe("CANCELED");
  });

  test("cancel timeout freezes and resolves against exchange truth", async () => {
    const h = setup();
    await submitWorking(h, "cx4");
    h.http.scriptTimeout("/fapi/v1/order");
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "cx4", status: "CANCELED" })));
    const res = await h.svc.cancelOrder("cx4", "BTCUSDT");
    expect(res.ok).toBe(false);
    expect(findByClientOrderId("cx4")?.status).toBe("CANCEL_UNKNOWN");
    expect(h.freezes.length).toBe(1);
    await flush();
    expect(findByClientOrderId("cx4")?.status).toBe("CANCELED");
  });

  test("cancelling an already-terminal intent is a no-op", async () => {
    const h = setup();
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "cx5", status: "FILLED", executedQty: "0.001", avgPrice: "50000" })));
    await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", price: "50000", clientOrderId: "cx5" });
    expect(findByClientOrderId("cx5")?.status).toBe("FILLED");
    const callsBefore = h.http.calls.length;
    const res = await h.svc.cancelOrder("cx5", "BTCUSDT");
    expect(res.ok).toBe(true);
    expect(res.error).toBe("already terminal");
    expect(h.http.calls.length).toBe(callsBefore);
  });

  test("cancel without intent fails without exchange traffic", async () => {
    const h = setup();
    const res = await h.svc.cancelOrder("ghost", "BTCUSDT");
    expect(res.ok).toBe(false);
    expect(h.http.calls).toHaveLength(0);
  });
});

describe("position close and native protection", () => {
  test("closePosition submits reduce-only MARKET on the opposite side", async () => {
    const h = setup();
    liveState().positions.set("BTCUSDT", {
      symbol: "BTCUSDT",
      side: "long",
      qty: "0.002",
      entryPrice: "49000",
      markPrice: "50000",
      unrealizedProfit: "2",
      leverage: "1",
      liquidationPrice: "0",
      notional: "100",
      updatedAt: 1,
    });
    h.http.route("/fapi/v2/positionRisk", () => jsonRes([{ symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "49000", markPrice: "50000", unRealizedProfit: "2", liquidationPrice: "0", leverage: "1", positionSide: "BOTH" }]));
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "cls-x", type: "MARKET", status: "FILLED" })));
    const res = await h.svc.closePosition("BTCUSDT");

    expect(res.ok).toBe(true);
    const q = queryOf(placeCalls(h)[0]);
    expect(q.get("side")).toBe("SELL");
    expect(q.get("type")).toBe("MARKET");
    expect(q.get("reduceOnly")).toBe("true");
    expect(q.get("closePosition")).toBeNull();
    expect(q.get("quantity")).toBe("0.002");
    expect(q.get("newClientOrderId")?.startsWith("cls")).toBe(true);

    const noPos = await h.svc.closePosition("ETHUSDT");
    expect(noPos.ok).toBe(false);
  });

  test("closePosition retries without reduceOnly when testnet rejects -2022 with no open orders", async () => {
    const h = setup();
    h.http.route("/fapi/v2/positionRisk", () => jsonRes([{ symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "49000", markPrice: "50000", unRealizedProfit: "2", liquidationPrice: "0", leverage: "1", positionSide: "BOTH" }]));
    h.http.route("/fapi/v1/openOrders", () => jsonRes([]));
    // First POST carries reduceOnly and is rejected exactly like testnet does;
    // the immediate retry drops the flag and succeeds.
    h.http.script("/fapi/v1/order", () => jsonRes({ code: -2022, msg: "ReduceOnly Order is rejected." }, 400));
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "cls-fallback", type: "MARKET", status: "FILLED" })));

    const res = await h.svc.closePosition("BTCUSDT");

    expect(res.ok).toBe(true);
    const posts = placeCalls(h);
    expect(posts).toHaveLength(2);
    const first = queryOf(posts[0]);
    const second = queryOf(posts[1]);
    expect(first.get("reduceOnly")).toBe("true");
    expect(second.get("reduceOnly")).toBeNull();
    expect(second.get("quantity")).toBe("0.002");
  });

  test("closePosition keeps the -2022 rejection when open orders could conflict", async () => {
    const h = setup();
    h.http.route("/fapi/v2/positionRisk", () => jsonRes([{ symbol: "BTCUSDT", positionAmt: "0.002", entryPrice: "49000", markPrice: "50000", unRealizedProfit: "2", liquidationPrice: "0", leverage: "1", positionSide: "BOTH" }]));
    h.http.route("/fapi/v1/openOrders", () => jsonRes([orderFixture({ clientOrderId: "conflicting", status: "NEW" })]));
    h.http.route("/fapi/v1/order", () => jsonRes({ code: -2022, msg: "ReduceOnly Order is rejected." }, 400));

    const res = await h.svc.closePosition("BTCUSDT");

    expect(res.ok).toBe(false);
    expect(res.error).toContain("ReduceOnly Order is rejected");
    expect(placeCalls(h)).toHaveLength(1);
  });

  test("protectPosition uses genuine exchange conditional orders with closePosition=true", async () => {
    const h = setup();
    liveState().positions.set("BTCUSDT", {
      symbol: "BTCUSDT",
      side: "short",
      qty: "0.001",
      entryPrice: "50000",
      markPrice: "49000",
      unrealizedProfit: "1",
      leverage: "1",
      liquidationPrice: "0",
      notional: "50",
      updatedAt: 1,
    });
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ status: "NEW", closePosition: true })));
    const out = await h.svc.protectPosition({ symbol: "BTCUSDT", tpPrice: "45000.5", slPrice: "52000.5" });
    expect(out.tp?.ok).toBe(true);
    expect(out.sl?.ok).toBe(true);
    const posts = placeCalls(h).map((c) => queryOf(c));
    const tp = posts.find((q) => q.get("type") === "TAKE_PROFIT_MARKET");
    const sl = posts.find((q) => q.get("type") === "STOP_MARKET");
    expect(tp).toBeDefined();
    expect(sl).toBeDefined();
    expect(tp?.get("closePosition")).toBe("true");
    expect(sl?.get("closePosition")).toBe("true");
    expect(tp?.get("stopPrice")).toBe("45000.5");
    expect(sl?.get("stopPrice")).toBe("52000.5");
    expect(tp?.get("side")).toBe("BUY"); // short position closes via BUY
    // closePosition=true orders never carry a quantity.
    expect(tp?.get("quantity")).toBeNull();
  });

  test("long TP below mark is rejected before exchange traffic", async () => {
    const h = setup();
    liveState().positions.set("BTCUSDT", {
      symbol: "BTCUSDT", side: "long", qty: "0.001", entryPrice: "49000", markPrice: "50000",
      unrealizedProfit: "1", leverage: "1", liquidationPrice: "0", notional: "50", updatedAt: Date.now(),
    });
    const out = await h.svc.protectPosition({ symbol: "BTCUSDT", tpPrice: "49999" });
    expect(out.tp?.ok).toBe(false);
    expect(out.tp?.error).toContain("Long TP");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("short SL below mark is rejected before exchange traffic", async () => {
    const h = setup();
    liveState().positions.set("BTCUSDT", {
      symbol: "BTCUSDT", side: "short", qty: "0.001", entryPrice: "51000", markPrice: "50000",
      unrealizedProfit: "1", leverage: "1", liquidationPrice: "0", notional: "50", updatedAt: Date.now(),
    });
    const out = await h.svc.protectPosition({ symbol: "BTCUSDT", slPrice: "49999" });
    expect(out.sl?.ok).toBe(false);
    expect(out.sl?.error).toContain("Short SL");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("protective cancel failure leaves the old order and submits no replacement", async () => {
    const h = setup();
    liveState().positions.set("BTCUSDT", {
      symbol: "BTCUSDT", side: "long", qty: "0.001", entryPrice: "49000", markPrice: "50000",
      unrealizedProfit: "1", leverage: "1", liquidationPrice: "0", notional: "50", updatedAt: Date.now(),
    });
    liveState().openOrders.set("old-tp-fail", {
      clientOrderId: "old-tp-fail", exchangeOrderId: 78, symbol: "BTCUSDT", side: "SELL",
      type: "TAKE_PROFIT_MARKET", status: "NEW", price: "0", stopPrice: "51000", origQty: "0",
      executedQty: "0", avgPrice: "0", reduceOnly: false, closePosition: true, time: 1, updateTime: 1,
    });
    createIntent({ clientOrderId: "old-tp-fail", kind: "algo", symbol: "BTCUSDT", side: "SELL", type: "TAKE_PROFIT_MARKET", qty: "" });
    updateIntent("old-tp-fail", { status: "SUBMITTED" });
    h.http.scriptApiError("/fapi/v1/order", -1000, "cancel unavailable", 400);
    const out = await h.svc.protectPosition({ symbol: "BTCUSDT", tpPrice: "52000" });
    expect(out.tp?.ok).toBe(false);
    expect(out.tp?.error).toContain("replacement blocked");
    expect(placeCalls(h)).toHaveLength(0);
    expect(liveState().openOrders.has("old-tp-fail")).toBe(true);
  });

  test("protectPosition cancels the existing protection of the same type first", async () => {
    const h = setup();
    liveState().positions.set("BTCUSDT", {
      symbol: "BTCUSDT",
      side: "long",
      qty: "0.001",
      entryPrice: "49000",
      markPrice: "50000",
      unrealizedProfit: "1",
      leverage: "1",
      liquidationPrice: "0",
      notional: "50",
      updatedAt: 1,
    });
    liveState().openOrders.set("old-tp", {
      clientOrderId: "old-tp",
      exchangeOrderId: 77,
      symbol: "BTCUSDT",
      side: "SELL",
      type: "TAKE_PROFIT_MARKET",
      status: "NEW",
      price: "0",
      stopPrice: "51000",
      origQty: "0",
      executedQty: "0",
      avgPrice: "0",
      reduceOnly: false,
      closePosition: true,
      time: 1,
      updateTime: 1,
    });
    createIntent({ clientOrderId: "old-tp", kind: "algo", symbol: "BTCUSDT", side: "SELL", type: "TAKE_PROFIT_MARKET", qty: "" });
    updateIntent("old-tp", { status: "SUBMITTED" });
    h.http.route("/fapi/v1/order", () => jsonRes(orderFixture({ status: "NEW", closePosition: true })));
    await h.svc.protectPosition({ symbol: "BTCUSDT", tpPrice: "55000.5" });
    const deletes = h.http.callsTo("/fapi/v1/order").filter((c) => c.method === "DELETE");
    expect(deletes.length).toBe(1);
    expect(queryOf(deletes[0]).get("origClientOrderId")).toBe("old-tp");
  });
});

describe("execution gates inside OrderService", () => {
  test("kill switch blocks submission", async () => {
    const h = setup();
    setRuntime(RUNTIME_KEYS.killSwitch, "true");
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "ks1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("kill switch");
    expect(placeCalls(h)).toHaveLength(0);
  });

  test("frozen runtime blocks submission", async () => {
    const h = setup();
    setRuntime(RUNTIME_KEYS.frozen, "true");
    setRuntime(RUNTIME_KEYS.frozenReason, "drift");
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "fz1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("drift");
  });

  test("shadow env can never submit", async () => {
    const h = setup({ env: "shadow" });
    const res = await h.svc.submitOrder({ symbol: "BTCUSDT", side: "BUY", type: "MARKET", qty: "0.001", clientOrderId: "sh1" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("shadow mode is read-only");
  });

});
