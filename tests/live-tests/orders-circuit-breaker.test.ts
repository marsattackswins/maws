/**
 * Route tests: POST /api/live/orders authentication and validation behavior,
 * plus the end-to-end REST circuit-breaker-open contract: when the Binance
 * REST breaker is open, the route must answer 503 { error: { code:
 * "circuit_open" } } with exactly one broker.circuit_open log line + metric,
 * never a business-shaped 422 or a generic 500. These tests run the REAL
 * route → factory → BinanceAdapter → OrderService → BinanceRestClient stack
 * against an in-memory FakeHttp exchange; only the breaker state is forced.
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { POST as ordersPost } from "@/app/api/live/orders/route";
import { createSession, sessionCookieName } from "@/lib/server/auth/session";
import { secureCookieContext } from "@/lib/server/http/guards";
import { getBinanceRestBreaker, initializeCircuitBreakers } from "@/lib/server/resilience/breakers";
import { setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { CircuitBreakerOpenError } from "@/lib/server/resilience/circuit-breaker";
import { getBroker, resetBrokerForTests } from "@/lib/server/broker/factory";
import { getMetrics, METRICS } from "@/lib/server/metrics/collector";
import type { EnvConfig } from "@/lib/server/env/config";
import {
  BTCUSDT_INFO,
  FakeHttp,
  FakeWs,
  accountFixture,
  freshEnv,
  installFakes,
  jsonRes,
  makeCfg,
  orderFixture,
} from "./helpers";

/** Let pending stream callbacks (snapshot/lease/health signals) settle. */
const flush = async (): Promise<void> => {
  for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
};

describe("POST /api/live/orders with circuit breaker", () => {
  beforeEach(() => {
    freshEnv(makeCfg({ env: "testnet", allowedOrigin: "https://localhost:3000" }));
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    initializeCircuitBreakers();
  });

  afterEach(() => {
    // Reset breaker state after each test
    const breaker = getBinanceRestBreaker();
    breaker.reset();
  });

  const makeOrderRequest = (body: unknown, sessionId?: string) => {
    const cfg = makeCfg({ env: "testnet", allowedOrigin: "https://localhost:3000" });
    const url = "https://localhost:3000/api/live/orders";
    const headers = new Headers({
      "content-type": "application/json",
      "origin": "https://localhost:3000",
      "host": "localhost:3000",
    });

    if (sessionId) {
      const cookieName = sessionCookieName(secureCookieContext(cfg));
      headers.set("cookie", `${cookieName}=${sessionId}`);
      // Add CSRF token for mutating requests
      const session = require("@/lib/server/auth/session").getSession(sessionId);
      if (session) {
        headers.set("x-maws-csrf", session.csrfToken);
      }
    }

    return new Request(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  };

  test("returns 401 when breaker is open but no session provided", async () => {
    // Force circuit breaker open
    const breaker = getBinanceRestBreaker();
    breaker.forceOpen();

    // No session provided
    const req = makeOrderRequest({
      symbol: "BTCUSDT",
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: "test-order-87654321",
    });

    const response = await ordersPost(req);

    // Auth check happens before breaker, so expect 401
    expect(response.status).toBe(401);

    const body = await response.json() as { error: { code: string; message: string } };
    expect(body.error.code).toBe("unauthenticated");
  });

  test("returns 400 for invalid payload even when breaker is open", async () => {
    const { sessionId } = createSession("test-agent");

    // Force circuit breaker open
    const breaker = getBinanceRestBreaker();
    breaker.forceOpen();

    // Invalid payload (missing required fields)
    const req = makeOrderRequest({
      symbol: "BTCUSDT",
      // Missing side, type, clientOrderId
    }, sessionId);

    const response = await ordersPost(req);

    // Validation happens before breaker execution, so expect 400
    expect(response.status).toBe(400);

    const body = await response.json() as { error: { code: string; message: string } };
    expect(body.error.code).toBe("bad_request");
  });
});

// ---------------------------------------------------------------------------
// End-to-end circuit-breaker-open contract through the REAL adapter stack.
//
// Regression: the breaker-open error used to be swallowed twice below the
// route — once by manager.getReferencePrice (→ null → "No reference price")
// and once by OrderService.handleSubmissionFailure (→ ok:false) — so live
// submissions answered a business-shaped 422 instead of the 503 circuit_open
// contract, and even after those swallows the adapter wrapped the error as a
// plain BrokerError that runBrokerMutation would have answered with a 500.
// ---------------------------------------------------------------------------

describe("POST /api/live/orders end-to-end with REST breaker open", () => {
  let http: FakeHttp;
  let cfg: EnvConfig;
  let captured: string[];
  const stdoutWrite = process.stdout.write.bind(process.stdout);

  const circuitOpenLogLines = (): string[] =>
    captured.filter((l) => l.includes("broker.circuit_open"));

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

  /** Fresh env + fake exchange + fully started real broker (clock, metadata, snapshot). */
  async function bootRealBroker(): Promise<void> {
    cfg = freshEnv(makeCfg({ env: "testnet", allowedOrigin: "https://localhost:3000" }));
    setRuntime(RUNTIME_KEYS.executionEnabled, "true");
    http = new FakeHttp();
    installFakes(http);
    http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
    http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
    http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
    http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
    http.route("/fapi/v2/positionRisk", () => jsonRes([]));
    http.route("/fapi/v1/openOrders", () => jsonRes([]));
    http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-BRK" }));
    http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
    await getBroker().connect();
    FakeWs.last()?.emitOpen();
    await flush();
  }

  async function submitOrder(clientOrderId: string): Promise<Response> {
    const { sessionId } = createSession("brk-e2e");
    const headers = new Headers({
      "content-type": "application/json",
      "origin": "https://localhost:3000",
      "host": "localhost:3000",
      "cookie": `${sessionCookieName(secureCookieContext(cfg))}=${sessionId}`,
      "x-maws-csrf": require("@/lib/server/auth/session").getSession(sessionId).csrfToken,
    });
    return ordersPost(
      new Request("https://localhost:3000/api/live/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({
          symbol: "BTCUSDT",
          side: "BUY",
          type: "MARKET",
          qty: "0.001",
          clientOrderId,
        }),
      }),
    );
  }

  const flush = async (): Promise<void> => {
    for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
  };

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

  test("breaker trips before submit: route answers 503 circuit_open, not 422/500", async () => {
    await bootRealBroker();

    // Breaker opens after metadata/snapshot: the reference-price probe is the
    // first REST call the submission path makes against the open breaker.
    getBinanceRestBreaker().forceOpen();

    const res = await submitOrder("cid-brk-cold");
    await expectCircuitOpenContract(res);

    // No order POST ever left for the exchange.
    expect(http.callsTo("/fapi/v1/order")).toHaveLength(0);
  });

  test("breaker trips at submit time (warm price cache): still 503 circuit_open", async () => {
    await bootRealBroker();

    // First order succeeds and warms the manager's reference-price cache,
    // so the breaker-open condition is hit at placeOrder time instead.
    http.route("/fapi/v1/order", () => jsonRes(orderFixture({ clientOrderId: "cid-brk-ok", type: "MARKET", status: "NEW" })));
    const first = await submitOrder("cid-brk-ok");
    expect(first.status).toBe(200);
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);

    getBinanceRestBreaker().forceOpen();

    const second = await submitOrder("cid-brk-tripped");
    await expectCircuitOpenContract(second);
  });

  test("adapter preserves CircuitBreakerOpenError identity for runBrokerMutation", async () => {
    await bootRealBroker();
    getBinanceRestBreaker().forceOpen();

    await expect(
      getBroker().submitOrder({
        symbol: "BTCUSDT",
        side: "buy",
        type: "market",
        qty: "0.001",
        clientOrderId: "cid-brk-identity",
      }),
    ).rejects.toThrow(CircuitBreakerOpenError);
  });

  test("transport timeout keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();

    // Transport timeout keeps the existing ok:false / 422 semantics
    // (uncertain outcome persisted, freeze raised) — unchanged by the fix.
    http.scriptTimeout("/fapi/v1/order");
    const timeoutRes = await submitOrder("cid-brk-timeout");
    expect(timeoutRes.status).toBe(422);
    const timeoutBody = (await timeoutRes.json()) as { ok: boolean; error?: string };
    expect(timeoutBody.ok).toBe(false);
    expect(timeoutBody.error).toContain("timed out");
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });

  test("exchange rejection keeps the existing 422 semantics (not 503)", async () => {
    await bootRealBroker();

    http.scriptApiError("/fapi/v1/order", -2010, "New order rejected", 400);
    const rejectRes = await submitOrder("cid-brk-rejected");
    expect(rejectRes.status).toBe(422);
    const rejectBody = (await rejectRes.json()) as { ok: boolean; error?: string };
    expect(rejectBody.ok).toBe(false);
    expect(rejectBody.error).toContain("New order rejected");
    expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
  });
});
