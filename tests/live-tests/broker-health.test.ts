/**
 * GET /api/health/broker — lightweight broker connectivity probe.
 * Verifies the response shape and degraded/ok transitions using in-memory
 * fakes; no real network traffic ever happens.
 */

import { describe, test, expect, beforeEach } from "@jest/globals";
import { GET } from "@/app/api/health/broker/route";
import { createSession, sessionCookieName } from "@/lib/server/auth/session";
import { secureCookieContext } from "@/lib/server/http/guards";
import { freshEnv, makeCfg, FakeHttp, installFakes, jsonRes } from "./helpers";

function makeRequest(cookieHeader?: string): Request {
  const headers: Record<string, string> = {};
  if (cookieHeader) headers["cookie"] = cookieHeader;
  return new Request("http://localhost:3000/api/health/broker", { headers });
}

describe("GET /api/health/broker", () => {
  beforeEach(() => {
    freshEnv(makeCfg({ allowedOrigin: null }));
  });

  test("returns ok with broker and latency when the exchange is reachable", async () => {
    const cfg = freshEnv(makeCfg()); // testnet
    const http = new FakeHttp();
    http.route("/fapi/v1/ping", () => jsonRes({}, 200));
    installFakes(http);

    // Authorize via a valid operator session.
    const { sessionId } = createSession("test-ua");
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const res = await GET(makeRequest(`${cookieName}=${sessionId}`));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      status: "ok",
      broker: "binance",
      latency_ms: expect.any(Number),
    });
  });

  test("returns 503 degraded when the broker times out", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    http.scriptTimeout("/fapi/v1/ping");
    installFakes(http);

    const { sessionId } = createSession("test-ua");
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const res = await GET(makeRequest(`${cookieName}=${sessionId}`));

    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body).toEqual({
      status: "degraded",
      broker: "binance",
      latency_ms: expect.any(Number),
    });
  });

  test("returns 503 degraded when the transport throws (unreachable)", async () => {
    const cfg = freshEnv(makeCfg());
    const http = new FakeHttp();
    // FakeHttp treats a route that returns an Error as a thrown transport error.
    http.route("/fapi/v1/ping", () => {
      throw new Error("ECONNREFUSED");
    });
    installFakes(http);

    const { sessionId } = createSession("test-ua");
    const cookieName = sessionCookieName(secureCookieContext(cfg));
    const res = await GET(makeRequest(`${cookieName}=${sessionId}`));

    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body).toEqual({
      status: "degraded",
      broker: "binance",
      latency_ms: expect.any(Number),
    });
  });

  test("local env allows anonymous access (health endpoints accessible for development)", async () => {
    const cfg = freshEnv(makeCfg({ env: "local", allowedOrigin: null }));
    const http = new FakeHttp();
    http.route("/fapi/v1/ping", () => jsonRes({}));
    installFakes(http);

    // No session cookie - anonymous access
    const res = await GET(makeRequest());

    // Should succeed (200 or 503, but not 403/401)
    expect([200, 503]).toContain(res.status);
  });

  test("missing auth denies access", async () => {
    freshEnv(makeCfg({ allowedOrigin: null }));
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  test("health token authorizes without a session", async () => {
    const cfg = freshEnv(makeCfg({ healthToken: "secret-health-token" }));
    const http = new FakeHttp();
    http.route("/fapi/v1/ping", () => jsonRes({}, 200));
    installFakes(http);

    const headers = new Headers({ "x-maws-health-token": "secret-health-token" });
    const req = new Request("http://localhost:3000/api/health/broker", { headers });
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe("ok");
  });
});
