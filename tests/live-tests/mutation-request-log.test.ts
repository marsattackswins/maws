/** Structured request logging for live mutation endpoints.
 *
 * Verifies logLiveMutation/withMutationLog emit exactly one JSON line per
 * request with the expected shape across ok / 503 / unauth paths, and that
 * every live mutation route wraps its POST in withMutationLog, populating
 * ctx.symbol / ctx.clientOrderId after body validation.
 *
 * Broker-backed "ok" cases run against the in-memory FakeHttp exchange: the
 * adapter's manager is started through the standard fake routes so metadata,
 * reference price and risk snapshot are all satisfiable without a network.
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { logLiveMutation, withMutationLog } from "@/lib/server/log/request-log";
import { createIntent } from "@/lib/server/binance/intents";
import { createSession, sessionCookieName } from "@/lib/server/auth/session";
import { secureCookieContext } from "@/lib/server/http/guards";
import { resetServerConfigForTests } from "@/lib/server/env/config";
import { getBroker, resetBrokerForTests } from "@/lib/server/broker/factory";
import { RUNTIME_KEYS, setRuntime } from "@/lib/server/runtime/flags";
import { POST as POST_orders } from "@/app/api/live/orders/route";
import { POST as POST_cancel } from "@/app/api/live/orders/cancel/route";
import { POST as POST_close } from "@/app/api/live/positions/close/route";
import { POST as POST_protect } from "@/app/api/live/protect/route";
import { REQUEST_ID_HEADER } from "@/lib/server/http/request-id";
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

// ---------------------------------------------------------------------------
// stdout capture: the request logger emits its JSON lines via process.stdout.
// ---------------------------------------------------------------------------

let captured: string[] = [];
const stdoutWrite = process.stdout.write.bind(process.stdout);

function mutationLines(): string[] {
  return captured.filter((l) => l.includes("live.mutation.request"));
}

function lastMutationLog(): { level: string; fields: Record<string, unknown> } {
  const line = mutationLines().at(-1);
  if (!line) throw new Error("no live.mutation.request line was captured");
  return JSON.parse(line) as { level: string; fields: Record<string, unknown> };
}

function lastMutationLogWithId(): { level: string; request_id?: string; fields: Record<string, unknown> } {
  const line = mutationLines().at(-1);
  if (!line) throw new Error("no live.mutation.request line was captured");
  return JSON.parse(line) as { level: string; request_id?: string; fields: Record<string, unknown> };
}

beforeEach(() => {
  captured = [];
  (process.stdout as unknown as { write: (...a: unknown[]) => unknown }).write = (chunk: unknown) => {
    captured.push(String(chunk));
    return true;
  };
});

afterEach(() => {
  (process.stdout as unknown as { write: (...a: unknown[]) => unknown }).write =
    stdoutWrite as unknown as (...a: unknown[]) => unknown;
  resetBrokerForTests();
  delete process.env.MAWS_ENV;
});

// ---------------------------------------------------------------------------
// shared auth / exchange helpers
// ---------------------------------------------------------------------------

function newSession(): { sessionId: string; csrfToken: string } {
  return createSession("log-test");
}

function liveRequest(opts: {
  path: string;
  sessionId?: string;
  csrfToken?: string;
  body?: unknown;
}): Request {
  const headers = new Headers({
    "content-type": "application/json",
    origin: "http://localhost:3000",
    host: "localhost:3000",
  });
  if (opts.sessionId) {
    // allowedOrigin is null in these cfgs, so the plain (non __Host-) cookie applies.
    headers.set("cookie", `${sessionCookieName(secureCookieContext(makeCfg()))}=${opts.sessionId}`);
    if (opts.csrfToken) headers.set("x-maws-csrf", opts.csrfToken);
  }
  return new Request(`http://localhost:3000${opts.path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(opts.body ?? {}),
  });
}

/** Standard fake-exchange routes used by the manager startup sequence. */
function standardFakes(http: FakeHttp, opts: { withPosition?: boolean } = {}): void {
  http.route("/fapi/v1/time", () => jsonRes({ serverTime: Date.now() }));
  http.route("/fapi/v1/exchangeInfo", () => jsonRes({ symbols: [BTCUSDT_INFO] }));
  http.route("/fapi/v1/ticker/price", () => jsonRes({ symbol: "BTCUSDT", price: "50000" }));
  http.route("/fapi/v2/account", () => jsonRes(accountFixture()));
  http.route("/fapi/v2/positionRisk", () =>
    jsonRes(
      opts.withPosition
        ? [
            {
              symbol: "BTCUSDT",
              positionAmt: "0.002",
              entryPrice: "50000",
              markPrice: "50000",
              unRealizedProfit: "0",
              leverage: "10",
              liquidationPrice: "0",
              notional: "100",
            },
          ]
        : [],
    ),
  );
  http.route("/fapi/v1/openOrders", () => jsonRes([]));
  http.route("/fapi/v1/allOpenOrders", () => jsonRes([]));
  http.route("/fapi/v1/listenKey", () => jsonRes({ listenKey: "LK-LOGTEST" }));
  http.route("/fapi/v1/leverageBracket", () => jsonRes([]));
  http.route("/fapi/v1/userTrades", () => jsonRes([]));
}

/** Fresh env + fakes + a fully started broker (clock, metadata, snapshot). */
async function bootBroker(http: FakeHttp, opts: { withPosition?: boolean } = {}): Promise<EnvConfig> {
  const cfg = freshEnv(makeCfg());
  setRuntime(RUNTIME_KEYS.executionEnabled, "true");
  installFakes(http);
  standardFakes(http, opts);
  await getBroker().connect();
  // Open every socket the manager created (user-data stream, public
  // mark-price stream); the harness must not depend on stream ordering.
  for (const ws of FakeWs.instances) ws.emitOpen();
  await flush();
  return cfg;
}

// ---------------------------------------------------------------------------
// helper-level tests: logLiveMutation / withMutationLog
// ---------------------------------------------------------------------------

describe("logLiveMutation / withMutationLog", () => {
  test("logLiveMutation emits a single structured JSON line", () => {
    logLiveMutation("POST", "/api/live/orders", { symbol: "BTCUSDT", clientOrderId: "cid-123" }, 12, "ok");
    expect(mutationLines()).toHaveLength(1);
    const { level, fields } = lastMutationLog();
    expect(fields).toEqual({
      event: "live.mutation.request",
      method: "POST",
      path: "/api/live/orders",
      symbol: "BTCUSDT",
      clientOrderId: "cid-123",
      duration_ms: 12,
      outcome: "ok",
    });
    expect(level).toBe("info");
  });

  test("logLiveMutation includes extra fields and honours level", () => {
    logLiveMutation("POST", "/api/live/orders/cancel", { symbol: "ETHUSDT" }, 5, "503", "warn", { status: 503 });
    const { level, fields } = lastMutationLog();
    expect(fields.status).toBe(503);
    expect(fields.outcome).toBe("503");
    expect(fields.clientOrderId).toBeUndefined();
    expect(level).toBe("warn");
  });

  test("withMutationLog logs ok outcome for a 200 response", async () => {
    const req = new Request("http://localhost:3000/api/live/orders", { method: "POST" });
    const res = await withMutationLog(req, async (ctx) => {
      ctx.symbol = "BTCUSDT";
      ctx.clientOrderId = "cid-ok";
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
    });
    expect(res.status).toBe(200);
    const { level, fields } = lastMutationLog();
    expect(fields.outcome).toBe("ok");
    expect(fields.symbol).toBe("BTCUSDT");
    expect(fields.clientOrderId).toBe("cid-ok");
    expect(fields.method).toBe("POST");
    expect(fields.path).toBe("/api/live/orders");
    expect(level).toBe("info");
  });

  test("withMutationLog logs 503 outcome for a 503 response", async () => {
    const req = new Request("http://localhost:3000/api/live/positions/close", { method: "POST" });
    const res = await withMutationLog(req, async (ctx) => {
      ctx.symbol = "ETHUSDT";
      return new Response(JSON.stringify({ error: { code: "config" } }), { status: 503 });
    });
    expect(res.status).toBe(503);
    const { level, fields } = lastMutationLog();
    expect(fields.outcome).toBe("503");
    expect(fields.symbol).toBe("ETHUSDT");
    expect(fields.clientOrderId).toBeUndefined();
    expect(level).toBe("warn");
  });

  test("withMutationLog logs error outcome and rethrows on handler exception", async () => {
    const req = new Request("http://localhost:3000/api/live/protect", { method: "POST" });
    await expect(
      withMutationLog(req, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    const { level, fields } = lastMutationLog();
    expect(fields.outcome).toBe("error");
    expect(fields.message).toBe("boom");
    expect(fields.symbol).toBeUndefined();
    expect(level).toBe("error");
  });
});

// ---------------------------------------------------------------------------
// route-level tests
// ---------------------------------------------------------------------------

describe("POST /api/live/orders logs structured request lines", () => {
  test("logs ok with symbol and clientOrderId after a successful submit", async () => {
    const http = new FakeHttp();
    http.route("/fapi/v1/order", () =>
      jsonRes(orderFixture({ clientOrderId: "cid-orders-ok", type: "LIMIT", status: "NEW", price: "50000", origQty: "0.001" })),
    );
    await bootBroker(http);
    const { sessionId, csrfToken } = newSession();
    const res = await POST_orders(
      liveRequest({
        path: "/api/live/orders",
        sessionId,
        csrfToken,
        body: {
          symbol: "BTCUSDT",
          side: "BUY",
          type: "LIMIT",
          qty: "0.001",
          price: "50000",
          clientOrderId: "cid-orders-ok",
        },
      }),
    );
    expect(res.status).toBe(200);
    const { fields } = lastMutationLog();
    expect(fields.outcome).toBe("ok");
    expect(fields.path).toBe("/api/live/orders");
    expect(fields.method).toBe("POST");
    expect(fields.symbol).toBe("BTCUSDT");
    expect(fields.clientOrderId).toBe("cid-orders-ok");
  });

  test("returns 401 and logs error outcome without symbol when unauthenticated", async () => {
    freshEnv(makeCfg());
    const res = await POST_orders(
      liveRequest({
        path: "/api/live/orders",
        body: {
          symbol: "BTCUSDT",
          side: "BUY",
          type: "LIMIT",
          qty: "0.001",
          clientOrderId: "cid-unauth",
        },
      }),
    );
    expect(res.status).toBe(401);
    const { fields } = lastMutationLog();
    expect(fields.outcome).toBe("error");
    expect(fields.symbol).toBeUndefined();
    expect(fields.clientOrderId).toBeUndefined();
    expect(fields.path).toBe("/api/live/orders");
  });

  test("returns 503 and logs 503 outcome when server config is invalid", async () => {
    freshEnv(makeCfg());
    process.env.MAWS_ENV = "bogus";
    resetServerConfigForTests(); // force a fresh, failing load on next serverConfig()
    const res = await POST_orders(liveRequest({ path: "/api/live/orders", body: { symbol: "BTCUSDT" } }));
    expect(res.status).toBe(503);
    const { fields } = lastMutationLog();
    expect(fields.outcome).toBe("503");
    expect(fields.path).toBe("/api/live/orders");
  });
});

describe("POST /api/live/orders/cancel logs structured request lines", () => {
  test("logs ok with symbol and clientOrderId after a successful cancel", async () => {
    const http = new FakeHttp();
    freshEnv(makeCfg());
    http.route("/fapi/v1/order", () =>
      jsonRes(orderFixture({ clientOrderId: "cid-cancel-ok", status: "CANCELED", type: "LIMIT", price: "50000" })),
    );
    installFakes(http);
    // Cancel only proceeds when the exchange knows the order, i.e. an intent exists.
    createIntent({
      clientOrderId: "cid-cancel-ok",
      kind: "order",
      symbol: "ETHUSDT",
      side: "BUY",
      type: "LIMIT",
      qty: "0.001",
      price: "50000",
    });
    const { sessionId, csrfToken } = newSession();
    const res = await POST_cancel(
      liveRequest({
        path: "/api/live/orders/cancel",
        sessionId,
        csrfToken,
        body: { symbol: "ETHUSDT", clientOrderId: "cid-cancel-ok" },
      }),
    );
    expect(res.status).toBe(200);
    const { fields } = lastMutationLog();
    expect(fields.outcome).toBe("ok");
    expect(fields.path).toBe("/api/live/orders/cancel");
    expect(fields.symbol).toBe("ETHUSDT");
    expect(fields.clientOrderId).toBe("cid-cancel-ok");
  });
});

describe("POST /api/live/positions/close logs structured request lines", () => {
  test("logs ok with symbol after closing an open position", async () => {
    const http = new FakeHttp();
    http.route("/fapi/v1/order", () =>
      jsonRes(orderFixture({ type: "MARKET", status: "NEW", price: "0", origQty: "0.002" })),
    );
    await bootBroker(http, { withPosition: true });
    const { sessionId, csrfToken } = newSession();
    const res = await POST_close(
      liveRequest({ path: "/api/live/positions/close", sessionId, csrfToken, body: { symbol: "BTCUSDT" } }),
    );
    expect(res.status).toBe(200);
    const { fields } = lastMutationLog();
    expect(fields.outcome).toBe("ok");
    expect(fields.path).toBe("/api/live/positions/close");
    expect(fields.symbol).toBe("BTCUSDT");
    expect(fields.clientOrderId).toBeUndefined();
  });
});

describe("POST /api/live/protect logs structured request lines", () => {
  test("logs ok with symbol after placing a take-profit", async () => {
    const http = new FakeHttp();
    http.route("/fapi/v1/order", () => jsonRes(orderFixture({ type: "TAKE_PROFIT_MARKET", status: "NEW" })));
    await bootBroker(http, { withPosition: true });
    const { sessionId, csrfToken } = newSession();
    const res = await POST_protect(
      liveRequest({
        path: "/api/live/protect",
        sessionId,
        csrfToken,
        body: { symbol: "BTCUSDT", tpPrice: "51000" },
      }),
    );
    expect(res.status).toBe(200);
    const { fields } = lastMutationLog();
    expect(fields.outcome).toBe("ok");
    expect(fields.path).toBe("/api/live/protect");
    expect(fields.symbol).toBe("BTCUSDT");
    expect(fields.clientOrderId).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// request ID correlation (task #13)
// ---------------------------------------------------------------------------

describe("request ID correlation on live mutations", () => {
  test("every live mutation route echoes x-request-id and stamps request_id on its log line", async () => {
    const cases: Array<{
      post: (req: Request) => Promise<Response>;
      path: string;
      body: Record<string, unknown>;
    }> = [
      {
        post: POST_orders,
        path: "/api/live/orders",
        body: { symbol: "BTCUSDT", side: "BUY", type: "LIMIT", qty: "0.001", clientOrderId: "cid-rid-1" },
      },
      {
        post: POST_cancel,
        path: "/api/live/orders/cancel",
        body: { symbol: "BTCUSDT", clientOrderId: "cid-rid-2" },
      },
      { post: POST_close, path: "/api/live/positions/close", body: { symbol: "BTCUSDT" } },
      { post: POST_protect, path: "/api/live/protect", body: { symbol: "BTCUSDT", tpPrice: "51000" } },
    ];

    freshEnv(makeCfg());
    for (const c of cases) {
      const req = liveRequest({ path: c.path, body: c.body });
      req.headers.set(REQUEST_ID_HEADER, `rid-${c.path}`);
      const res = await c.post(req);
      // Unauthenticated 401 path: still a full withMutationLog round-trip.
      expect(res.status).toBe(401);
      expect(res.headers.get(REQUEST_ID_HEADER)).toBe(`rid-${c.path}`);
      const { request_id } = lastMutationLogWithId();
      expect(request_id).toBe(`rid-${c.path}`);
    }
  });

  test("mints and returns a fresh x-request-id when the client sends none", async () => {
    freshEnv(makeCfg());
    const res = await POST_orders(
      liveRequest({ path: "/api/live/orders", body: { symbol: "BTCUSDT" } }),
    );
    expect(res.status).toBe(401);
    const minted = res.headers.get(REQUEST_ID_HEADER);
    expect(minted).toMatch(/^[0-9a-f-]{36}$/);
    expect(lastMutationLogWithId().request_id).toBe(minted);
  });

  test("invalid client IDs are rejected in favor of a minted UUID", async () => {
    freshEnv(makeCfg());
    // Values the HTTP layer will transport but the sanitizer must reject:
    // internal whitespace and over-length tokens.
    for (const bad of ["bad id with spaces", `x${"y".repeat(128)}`]) {
      const req = liveRequest({ path: "/api/live/orders", body: { symbol: "BTCUSDT" } });
      req.headers.set(REQUEST_ID_HEADER, bad);
      const res = await POST_orders(req);
      expect(res.status).toBe(401);
      const echoed = res.headers.get(REQUEST_ID_HEADER);
      expect(echoed).toMatch(/^[0-9a-f-]{36}$/);
      expect(echoed).not.toBe(bad);
      expect(lastMutationLogWithId().request_id).toBe(echoed);
    }
  });

  test("successful submit carries the same ID on response and log line", async () => {
    const http = new FakeHttp();
    http.route("/fapi/v1/order", () =>
      jsonRes(orderFixture({ clientOrderId: "cid-rid-ok", type: "LIMIT", status: "NEW", price: "50000" })),
    );
    await bootBroker(http);
    const { sessionId, csrfToken } = newSession();
    const req = liveRequest({
      path: "/api/live/orders",
      sessionId,
      csrfToken,
      body: {
        symbol: "BTCUSDT",
        side: "BUY",
        type: "LIMIT",
        qty: "0.001",
        price: "50000",
        clientOrderId: "cid-rid-ok",
      },
    });
    req.headers.set(REQUEST_ID_HEADER, "rid-submit-ok");
    const res = await POST_orders(req);
    expect(res.status).toBe(200);
    expect(res.headers.get(REQUEST_ID_HEADER)).toBe("rid-submit-ok");
    const { request_id, fields } = lastMutationLogWithId();
    expect(request_id).toBe("rid-submit-ok");
    expect(fields.outcome).toBe("ok");
    expect(fields.symbol).toBe("BTCUSDT");
  });
});
