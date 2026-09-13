/**
 * Route tests: end-to-end REST circuit-breaker-open contract for the other
 * live mutation routes — POST /api/live/orders/cancel, POST
 * /api/live/positions/close, and POST /api/live/protect. When the Binance
 * REST breaker is open, each route must answer 503 { error: { code:
 * "circuit_open" } } with exactly one broker.circuit_open log line + metric,
 * zero outbound exchange mutation calls, and never a business-shaped 422 or a
 * generic 500. These tests run the REAL route → factory → BinanceAdapter →
 * OrderService → BinanceRestClient stack against an in-memory FakeHttp
 * exchange; only the breaker state is forced.
 *
 * Companion to orders-circuit-breaker.test.ts (the POST /api/live/orders
 * proof); see that file for the original regression narrative.
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { POST as cancelPost } from "@/app/api/live/orders/cancel/route";
import { POST as closePost } from "@/app/api/live/positions/close/route";
import { POST as protectPost } from "@/app/api/live/protect/route";
import { createSession, getSession, sessionCookieName } from "@/lib/server/auth/session";
import { secureCookieContext } from "@/lib/server/http/guards";
import { getBinanceRestBreaker, initializeCircuitBreakers } from "@/lib/server/resilience/breakers";
import { setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { CircuitBreakerOpenError } from "@/lib/server/resilience/circuit-breaker";
import { getBroker, resetBrokerForTests } from "@/lib/server/broker/factory";
import { getMetrics, METRICS } from "@/lib/server/metrics/collector";
import { createIntent } from "@/lib/server/binance/intents";
import { applyPositionSnapshot } from "@/lib/server/binance/state";
import type { EnvConfig } from "@/lib/server/env/config";
import {
  BTCUSDT_INFO,
  FakeHttp,
  freshEnv,
  installFakes,
  jsonRes,
  makeCfg,
  orderFixture,
} from "./helpers";

// ---------------------------------------------------------------------------
// Harness: real stack + FakeHttp, breaker forced open, stdout captured.
// ---------------------------------------------------------------------------

let http: FakeHttp;
let cfg: EnvConfig;
let captured: string[];
const stdoutWrite = process.stdout.write.bind(process.stdout);

const circuitOpenLogLines = (): string[] => captured.filter((l) => l.includes("broker.circuit_open"));

const flush = async (): Promise<void> => {
  for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
};

/**
 * Fresh env + fake exchange + fully started real broker (clock, metadata,
 * snapshot). `positionRows` seeds the account snapshot: default is one open
 * BTCUSDT long; pass [] for an empty position book.
 */
async function bootRealBroker(positionRows: unknown[] = [POSITION_RISK_ROW]): Promise<void> {
  cfg = freshEnv(makeCfg({ env: "testnet", allowedOrigin: "https://localhost:3000" }));
  setRuntime(RUNTIME_KEYS.executionEnabled, "true");
  http = new FakeHttp();
  installFakes(http);
  http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
  http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
  http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
  http.route("/fapi/v2/account", () => jsonRes({ totalWalletBalance: "1000", totalUnrealizedProfit: "0", totalMarginBalance: "1000", availableBalance: "1000", maxWithdrawAmount: "1000", assets: [{ asset: "USDT", walletBalance: "1000", unrealizedProfit: "0", availableBalance: "1000", marginBalance: "1000" }] }));
  http.route("/fapi/v2/positionRisk", () => jsonRes(positionRows));
  http.route("/fapi/v1/openOrders", () => jsonRes([]));
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-BRK" }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
  await getBroker().connect();
}

const POSITION_RISK_ROW = {
  symbol: "BTCUSDT",
  positionAmt: "0.002",
  entryPrice: "50000",
  markPrice: "50000",
  unRealizedProfit: "0",
  liquidationPrice: "0",
  leverage: "1",
  positionSide: "BOTH",
  notional: "100",
};

/** Authenticated POST to one of the three mutation routes. */
async function postMutation(
  path: string,
  body: Record<string, unknown>,
  sessionId: string,
): Promise<Response> {
  const headers = new Headers({
    "content-type": "application/json",
    "origin": "https://localhost:3000",
    "host": "localhost:3000",
    "cookie": `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`,
    "x-maws-csrf": getSession(sessionId)?.csrfToken as string,
  });
  const handler = path.endsWith("/orders/cancel") ? cancelPost : path.endsWith("/positions/close") ? closePost : protectPost;
  return handler(
    new Request(`https://localhost:3000${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
  );
}

const expectCircuitOpenContract = async (res: Response): Promise<void> => {
  // 503 — never a business 422, never a generic 500.
  expect(res.status).toBe(503);

  // Exact existing circuit_open contract body.
  const body = (await res.json()) as { error: { code: string; message: string } };
  expect(body.error.code).toBe("circuit_open");
  expect(body.error.message).toContain("temporarily unavailable");

  // Structured broker.circuit_open log emitted exactly once. (symbol is
  // included once routes pass context to runBrokerMutation; not asserted
  // here so this contract holds independent of that wiring.)
  expect(circuitOpenLogLines()).toHaveLength(1);
  const parsed = JSON.parse(circuitOpenLogLines()[0]) as { level: string; msg: string; fields: Record<string, unknown> };
  expect(parsed.level).toBe("error");
  expect(parsed.fields).toMatchObject({
    event: "broker.circuit_open",
    code: "circuit_open",
    circuit: "binance-rest",
  });

  // Metric emitted exactly once (counter + event).
  expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(1);
  const ev = getMetrics().getRecentEvents(10).find((e) => e.details?.event === "broker.circuit_open");
  expect(ev).toBeDefined();
  expect(ev?.details).toMatchObject({ circuit: "binance-rest" });
};

beforeEach(() => {
  captured = [];
  (process.stdout as unknown as { write: (...a: unknown[]) => unknown }).write = (chunk: unknown) => {
    captured.push(String(chunk));
    return true;
  };
  getMetrics().reset();
  // Guarantee a closed breaker regardless of the previous test's state.
  initializeCircuitBreakers();
  getBinanceRestBreaker().reset();
});

afterEach(() => {
  (process.stdout as unknown as { write: (...a: unknown[]) => unknown }).write =
    stdoutWrite as unknown as (...a: unknown[]) => unknown;
  resetBrokerForTests();
  getBinanceRestBreaker().reset();
  getMetrics().reset();
});

// ---------------------------------------------------------------------------
// POST /api/live/orders/cancel
// ---------------------------------------------------------------------------

describe("POST /api/live/orders/cancel with REST breaker open", () => {
  test("breaker trips before cancel: route answers 503 circuit_open, not 422/500", async () => {
    await bootRealBroker();

    // Seed a live intent so cancelOrder passes its business pre-checks and
    // reaches the exchange call — where the breaker-open error surfaces.
    createIntent({
      clientOrderId: "cid-cancel-brk",
      kind: "order",
      symbol: "BTCUSDT",
      side: "BUY",
      type: "LIMIT",
      qty: "0.001",
      price: "50000",
    });

    getBinanceRestBreaker().forceOpen();

    const { sessionId } = createSession("brk-cancel");
    const res = await postMutation(
      "/api/live/orders/cancel",
      { clientOrderId: "cid-cancel-brk", symbol: "BTCUSDT" },
      sessionId,
    );
    await expectCircuitOpenContract(res);

    // No cancel POST ever left for the exchange.
    expect(http.callsTo("/fapi/v1/order")).toHaveLength(0);
  });

  test("transport timeout keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();
    createIntent({
      clientOrderId: "cid-cancel-timeout",
      kind: "order",
      symbol: "BTCUSDT",
      side: "BUY",
      type: "LIMIT",
      qty: "0.001",
      price: "50000",
    });

    // Timeout keeps ok:false / 422 (uncertain outcome persisted, freeze
    // raised) — unchanged by the circuit-open fix.
    http.scriptTimeout("/fapi/v1/order");
    const { sessionId } = createSession("brk-cancel-timeout");
    const res = await postMutation(
      "/api/live/orders/cancel",
      { clientOrderId: "cid-cancel-timeout", symbol: "BTCUSDT" },
      sessionId,
    );
    await flush();
    expect(res.status).toBe(422);
    const body = (await res.json()) as { ok: boolean; error?: string };
    expect(body.ok).toBe(false);
    expect(body.error).toContain("timed out");
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });

  test("exchange rejection keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();
    createIntent({
      clientOrderId: "cid-cancel-rejected",
      kind: "order",
      symbol: "BTCUSDT",
      side: "BUY",
      type: "LIMIT",
      qty: "0.001",
      price: "50000",
    });

    http.scriptApiError("/fapi/v1/order", -2010, "Cancel rejected", 400);
    const { sessionId } = createSession("brk-cancel-reject");
    const res = await postMutation(
      "/api/live/orders/cancel",
      { clientOrderId: "cid-cancel-rejected", symbol: "BTCUSDT" },
      sessionId,
    );
    expect(res.status).toBe(422);
    const body = (await res.json()) as { ok: boolean; error?: string };
    expect(body.ok).toBe(false);
    expect(body.error).toContain("Cancel rejected");
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// POST /api/live/positions/close
// ---------------------------------------------------------------------------

describe("POST /api/live/positions/close with REST breaker open", () => {
  test("breaker trips at submit: route answers 503 circuit_open, not 422/500", async () => {
    await bootRealBroker();
    getBinanceRestBreaker().forceOpen();

    const { sessionId } = createSession("brk-close");
    const res = await postMutation("/api/live/positions/close", { symbol: "BTCUSDT" }, sessionId);
    await expectCircuitOpenContract(res);

    // No reduce-only order POST ever left for the exchange.
    expect(http.callsTo("/fapi/v1/order")).toHaveLength(0);
  });

  test("no open position keeps the existing business 422 (not 503/500)", async () => {
    // Connect against an empty position book: the business pre-check must
    // still answer its ok:false 422 — circuit-open handling changes nothing.
    await bootRealBroker([]);

    const { sessionId } = createSession("brk-close-nopos");
    const res = await postMutation("/api/live/positions/close", { symbol: "BTCUSDT" }, sessionId);
    expect(res.status).toBe(422);
    const body = (await res.json()) as { ok: boolean; error?: string };
    expect(body.ok).toBe(false);
    expect(body.error).toContain("No open position");
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });

  test("transport timeout keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();
    http.scriptTimeout("/fapi/v1/order");
    const { sessionId } = createSession("brk-close-timeout");
    const res = await postMutation("/api/live/positions/close", { symbol: "BTCUSDT" }, sessionId);
    await flush();
    expect(res.status).toBe(422);
    const body = (await res.json()) as { ok: boolean; error?: string };
    expect(body.ok).toBe(false);
    expect(body.error).toContain("timed out");
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });

  test("exchange rejection keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();
    http.scriptApiError("/fapi/v1/order", -2010, "ReduceOnly rejected", 400);
    const { sessionId } = createSession("brk-close-reject");
    const res = await postMutation("/api/live/positions/close", { symbol: "BTCUSDT" }, sessionId);
    expect(res.status).toBe(422);
    const body = (await res.json()) as { ok: boolean; error?: string };
    expect(body.ok).toBe(false);
    expect(body.error).toContain("ReduceOnly rejected");
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// POST /api/live/protect
// ---------------------------------------------------------------------------

describe("POST /api/live/protect with REST breaker open", () => {
  test("breaker trips at submit: route answers 503 circuit_open, not 422/500", async () => {
    await bootRealBroker();
    getBinanceRestBreaker().forceOpen();

    const { sessionId } = createSession("brk-protect");
    const res = await postMutation(
      "/api/live/protect",
      { symbol: "BTCUSDT", tpPrice: "51000", slPrice: "49000" },
      sessionId,
    );
    await expectCircuitOpenContract(res);

    // No TP/SL conditional order POSTs ever left for the exchange.
    expect(http.callsTo("/fapi/v1/order")).toHaveLength(0);
  });

  test("no open position fails closed with a validation response (not 503/500)", async () => {
    await bootRealBroker([]);

    const { sessionId } = createSession("brk-protect-nopos");
    const res = await postMutation(
      "/api/live/protect",
      { symbol: "BTCUSDT", tpPrice: "51000", slPrice: "49000" },
      sessionId,
    );
    expect(res.status).toBe(422);
    const body = (await res.json()) as { tp?: { ok?: boolean; error?: string }; sl?: { ok?: boolean; error?: string } };
    expect(body.tp).toMatchObject({ ok: false, error: "No open position for BTCUSDT" });
    expect(body.sl).toMatchObject({ ok: false, error: "No open position for BTCUSDT" });
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });

  test("transport timeout keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();
    http.scriptTimeout("/fapi/v1/order");
    const { sessionId } = createSession("brk-protect-timeout");
    const res = await postMutation(
      "/api/live/protect",
      { symbol: "BTCUSDT", tpPrice: "51000" },
      sessionId,
    );
    await flush();
    expect(res.status).toBe(422);
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });

  test("exchange rejection keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();
    http.scriptApiError("/fapi/v1/order", -2021, "Order would immediately trigger", 400);
    const { sessionId } = createSession("brk-protect-reject");
    const res = await postMutation(
      "/api/live/protect",
      { symbol: "BTCUSDT", tpPrice: "51000" },
      sessionId,
    );
    expect(res.status).toBe(422);
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });

  test("adapter preserves CircuitBreakerOpenError identity for closePosition/protectPosition", async () => {
    await bootRealBroker();
    getBinanceRestBreaker().forceOpen();

    await expect(
      getBroker().closePosition("BTCUSDT"),
    ).rejects.toThrow(CircuitBreakerOpenError);
    await expect(
      getBroker().protectPosition({ symbol: "BTCUSDT", tpPrice: "51000" }),
    ).rejects.toThrow(CircuitBreakerOpenError);
  });
});
