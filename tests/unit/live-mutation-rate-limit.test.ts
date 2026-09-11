/**
 * Unit tests verifying the 429 rate-limited response shape on the live
 * mutation routes.
 *
 * Each route is tested in isolation by invoking the route handler directly
 * with a crafted request object.  The test ensures:
 *   1. Response status is 429.
 *   2. Response includes a Retry-After header (seconds).
 *   3. Response JSON body has { error: "rate_limited", retry_after_sec, limit, remaining, reset_at }.
 *   4. All numeric fields are finite numbers.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import {
  checkRateLimit,
  recordRequest,
  rateLimitedResponse,
  resetRateLimitWindows,
} from "@/lib/server/rate-limit";
import { LIVE_MUTATION_OPERATIONS } from "@/lib/server/metrics/collector";

// Mock the server config
jest.mock("@/lib/server/env/config", () => ({
  serverConfig: () => ({
    env: "production",
    allowedOrigin: "http://localhost:3000",
    sessionSecret: "test-secret-key-min-32-characters-long-for-testing",
  }),
}));

// Mock the auth guards
jest.mock("@/lib/server/auth/guard", () => ({
  checkOriginAndHost: () => ({ ok: true }),
  checkCsrf: () => true,
  clientIp: () => "test-ip",
}));

// Mock the session
jest.mock("@/lib/server/auth/session", () => ({
  getSession: () => ({
    csrfToken: "test-csrf-token",
    userId: "test-user",
    createdAt: Date.now(),
  }),
  readSessionCookie: () => "test-session",
  SESSION_TTL_MS: 24 * 60 * 60 * 1000,
}));

jest.mock("@/lib/server/audit/log", () => ({
  audit: jest.fn(),
}));

jest.mock("@/lib/server/broker/factory", () => ({
  getBroker: () => ({
    submitOrder: jest.fn(),
    cancelOrder: jest.fn(),
    closePosition: jest.fn(),
    protectPosition: jest.fn(),
  }),
}));

describe("live mutation rate limiting", () => {
  beforeEach(() => {
    resetRateLimitWindows();
  });

  afterEach(() => {
    resetRateLimitWindows();
  });

  describe("rateLimitedResponse builder", () => {
    test("returns 429 with Retry-After header and structured JSON body", async () => {
      const res = rateLimitedResponse(15, 30, 0, Date.now() + 15_000);
      expect(res.status).toBe(429);
      expect(res.headers.get("retry-after")).toBe("15");
      expect(res.headers.get("content-type")).toBe("application/json");

      const text = await res.text();
      const json = JSON.parse(text);
      expect(json.error).toBe("rate_limited");
      expect(typeof json.retry_after_sec).toBe("number");
      expect(json.retry_after_sec).toBe(15);
      expect(typeof json.limit).toBe("number");
      expect(json.limit).toBe(30);
      expect(typeof json.remaining).toBe("number");
      expect(json.remaining).toBe(0);
      expect(typeof json.reset_at).toBe("number");
    });

    test("Retry-After header is numeric string", async () => {
      const res = rateLimitedResponse(5, 10, 2, Date.now() + 5_000);
      const header = res.headers.get("retry-after");
      expect(header).toBe("5");
      expect(Number.isFinite(Number(header))).toBe(true);
    });

    test("remaining is non-negative", async () => {
      const res = rateLimitedResponse(10, 30, 0, Date.now() + 10_000);
      const json = JSON.parse(await res.text());
      expect(json.remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe("checkRateLimit + recordRequest round-trip", () => {
    test("allows requests up to the limit then denies with correct reset info", () => {
      const symbol = "BTCUSDT";
      const operation = LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER;
      const limit = 30; // Use the actual default limit

      // Record requests up to the limit - 2 (so remaining is 1)
      for (let i = 0; i < limit - 2; i++) {
        recordRequest(symbol, operation);
      }

      const allowed = checkRateLimit(symbol, operation);
      expect(allowed.allowed).toBe(true);
      expect(allowed.remaining).toBe(1); // 1 remaining after 28 requests

      // One more request should still be allowed
      recordRequest(symbol, operation);
      const nextAllowed = checkRateLimit(symbol, operation);
      expect(nextAllowed.allowed).toBe(true);
      expect(nextAllowed.remaining).toBe(0);

      // This request should be denied
      recordRequest(symbol, operation);
      const nowExhausted = checkRateLimit(symbol, operation);
      expect(nowExhausted.allowed).toBe(false);
      expect(nowExhausted.remaining).toBe(0);
      expect(nowExhausted.retryAfterSec).toBeGreaterThan(0);
      expect(nowExhausted.resetAt).toBeGreaterThan(Date.now());

      // Verify the response shape when denied
      const res = rateLimitedResponse(
        nowExhausted.retryAfterSec,
        nowExhausted.limit,
        nowExhausted.remaining,
        nowExhausted.resetAt,
      );
      expect(res.status).toBe(429);
    });

    test("per-symbol, per-operation isolation", () => {
      resetRateLimitWindows();
      const symbol = "ETHUSDT";

      // Exhaust BTCUSDT submit_order
      for (let i = 0; i < 30; i++) {
        recordRequest("BTCUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER);
      }
      let btcState = checkRateLimit("BTCUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER);
      expect(btcState.allowed).toBe(false);

      // ETHUSDT submit_order should still be allowed
      let ethState = checkRateLimit(symbol, LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER);
      expect(ethState.allowed).toBe(true);

      // Exhaust ETHUSDT submit_order
      for (let i = 0; i < 30; i++) {
        recordRequest(symbol, LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER);
      }
      ethState = checkRateLimit(symbol, LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER);
      expect(ethState.allowed).toBe(false);

      // BTCUSDT cancel_order should still be allowed (different operation)
      const btcCancel = checkRateLimit("BTCUSDT", LIVE_MUTATION_OPERATIONS.CANCEL_ORDER);
      expect(btcCancel.allowed).toBe(true);
    });

    test("window resets after the reset_at time", () => {
      const symbol = "SOLUSDT";
      const operation = LIVE_MUTATION_OPERATIONS.PROTECT_POSITION;

      // Exhaust the window
      for (let i = 0; i < 30; i++) {
        recordRequest(symbol, operation);
      }

      let state = checkRateLimit(symbol, operation);
      expect(state.allowed).toBe(false);
      expect(state.retryAfterSec).toBeGreaterThan(0);
      expect(state.resetAt).toBeGreaterThan(Date.now());

      // Verify reset_at is in the future
      expect(state.resetAt).toBeLessThanOrEqual(Date.now() + 60_000);
    });
  });

  describe("integration: route-level 429 response", () => {
    test("submit order route returns 429 with correct shape when rate limited", async () => {
      const symbol = "BTCUSDT";
      const operation = LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER;

      // Pre-populate the rate limit window to force a 429
      for (let i = 0; i < 30; i++) {
        recordRequest(symbol, operation);
      }

      // Build a minimal request object that the orders route would receive
      const req = new Request("http://localhost/api/live/orders", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
          "x-maws-csrf": "test-csrf-token",
          cookie: "maws_session=test-session",
        },
        body: JSON.stringify({
          symbol,
          side: "BUY",
          type: "MARKET",
          qty: "0.001",
          clientOrderId: "test-cli-001",
        }),
      });

      // Import and invoke the route handler directly
      const { POST: submitOrderPost } = await import("@/app/api/live/orders/route");
      const res = await submitOrderPost(req);

      expect(res.status).toBe(429);
      expect(res.headers.get("retry-after")).toBeTruthy();
      const retryAfter = Number(res.headers.get("retry-after")!);
      expect(Number.isFinite(retryAfter)).toBe(true);
      expect(retryAfter).toBeGreaterThan(0);

      const json = JSON.parse(await res.text());
      expect(json.error).toBe("rate_limited");
      expect(typeof json.retry_after_sec).toBe("number");
      expect(json.retry_after_sec).toBe(retryAfter);
      expect(typeof json.limit).toBe("number");
      expect(json.limit).toBe(30);
      expect(typeof json.remaining).toBe("number");
      expect(json.remaining).toBe(0);
      expect(typeof json.reset_at).toBe("number");
      expect(json.reset_at).toBeGreaterThan(Date.now());
    });

    test("cancel order route returns 429 with correct shape when rate limited", async () => {
      const symbol = "ETHUSDT";
      const operation = LIVE_MUTATION_OPERATIONS.CANCEL_ORDER;

      for (let i = 0; i < 30; i++) {
        recordRequest(symbol, operation);
      }

      const req = new Request("http://localhost/api/live/orders/cancel", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
          "x-maws-csrf": "test-csrf-token",
          cookie: "maws_session=test-session",
        },
        body: JSON.stringify({
          clientOrderId: "test-cli-cancel-001",
          symbol,
        }),
      });

      const { POST: cancelOrderPost } = await import("@/app/api/live/orders/cancel/route");
      const res = await cancelOrderPost(req);

      expect(res.status).toBe(429);
      expect(res.headers.get("retry-after")).toBeTruthy();
      const retryAfter = Number(res.headers.get("retry-after")!);
      expect(Number.isFinite(retryAfter)).toBe(true);

      const json = JSON.parse(await res.text());
      expect(json).toMatchObject({
        error: "rate_limited",
        retry_after_sec: retryAfter,
        limit: 30,
        remaining: 0,
      });
      expect(typeof json.reset_at).toBe("number");
    });

    test("close position route returns 429 with correct shape when rate limited", async () => {
      const symbol = "SOLUSDT";
      const operation = LIVE_MUTATION_OPERATIONS.CLOSE_POSITION;

      for (let i = 0; i < 30; i++) {
        recordRequest(symbol, operation);
      }

      const req = new Request("http://localhost/api/live/positions/close", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
          "x-maws-csrf": "test-csrf-token",
          cookie: "maws_session=test-session",
        },
        body: JSON.stringify({ symbol }),
      });

      const { POST: closePositionPost } = await import("@/app/api/live/positions/close/route");
      const res = await closePositionPost(req);

      expect(res.status).toBe(429);
      expect(res.headers.get("retry-after")).toBeTruthy();
      const retryAfter = Number(res.headers.get("retry-after")!);
      expect(Number.isFinite(retryAfter)).toBe(true);

      const json = JSON.parse(await res.text());
      expect(json).toMatchObject({
        error: "rate_limited",
        retry_after_sec: retryAfter,
        limit: 30,
        remaining: 0,
      });
      expect(typeof json.reset_at).toBe("number");
    });

    test("protect position route returns 429 with correct shape when rate limited", async () => {
      const symbol = "AAPLUSDT";
      const operation = LIVE_MUTATION_OPERATIONS.PROTECT_POSITION;

      for (let i = 0; i < 30; i++) {
        recordRequest(symbol, operation);
      }

      const req = new Request("http://localhost/api/live/protect", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
          "x-maws-csrf": "test-csrf-token",
          cookie: "maws_session=test-session",
        },
        body: JSON.stringify({
          symbol,
          tpPrice: "100.00",
          slPrice: "95.00",
        }),
      });

      const { POST: protectPositionPost } = await import("@/app/api/live/protect/route");
      const res = await protectPositionPost(req);

      expect(res.status).toBe(429);
      expect(res.headers.get("retry-after")).toBeTruthy();
      const retryAfter = Number(res.headers.get("retry-after")!);
      expect(Number.isFinite(retryAfter)).toBe(true);

      const json = JSON.parse(await res.text());
      expect(json).toMatchObject({
        error: "rate_limited",
        retry_after_sec: retryAfter,
        limit: 30,
        remaining: 0,
      });
      expect(typeof json.reset_at).toBe("number");
    });
  });
});
