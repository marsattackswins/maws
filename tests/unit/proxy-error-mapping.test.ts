import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { GET as klinesGET } from "@/app/api/binance/klines/route";
import { GET as tickerGET } from "@/app/api/binance/ticker/route";
import { GET as symbolsGET } from "@/app/api/binance/symbols/route";
import { GET as xoomarGET } from "@/app/api/calendar/xoomar/route";
import type { NextRequest } from "next/server";

/**
 * Focused tests for safe upstream error mapping.
 * Ensures provider error bodies and network error messages are never exposed to clients.
 */

// Mock server config to bypass auth
jest.mock("@/lib/server/env/config", () => ({
  serverConfig: jest.fn(() => ({ env: "local" })),
}));

// Mock fetch to control upstream responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockFetch: ReturnType<typeof jest.fn>;
beforeAll(() => {
  mockFetch = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).fetch = mockFetch;
});

function makeRequest(url: string): NextRequest {
  return {
    nextUrl: new URL(url),
    headers: new Headers(),
  } as unknown as NextRequest;
}

describe("Proxy Error Mapping", () => {
  const FIXED_NOW_MS = Date.UTC(2025, 5, 15);
  let dateNowSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    mockFetch.mockReset();
    dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW_MS);
  });

  afterEach(() => {
    jest.clearAllMocks();
    dateNowSpy.mockRestore();
  });

  describe("binance/klines", () => {
    const baseUrl = "http://localhost:3000/api/binance/klines?symbol=BTCUSDT&interval=15m";

    test("upstream 429 returns generic 429 body, no provider details", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => JSON.stringify({
          code: -1015,
          msg: "Too many requests; current limit is 1200 per minute",
          requestId: "secret-request-id-12345",
        }),
      });

      const res = await klinesGET(makeRequest(baseUrl));
      expect(res.status).toBe(429);

      const body = await res.json();
      expect(body).toEqual({ error: "Rate limit exceeded" });
      expect(JSON.stringify(body)).not.toContain("secret-request-id");
      expect(JSON.stringify(body)).not.toContain("-1015");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("upstream 400 returns generic 502 body", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({
          code: -1100,
          msg: "Illegal characters found in parameter 'symbol'",
          requestId: "secret-internal-id",
        }),
      });

      const res = await klinesGET(makeRequest(baseUrl));
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(JSON.stringify(body)).not.toContain("secret-internal-id");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("upstream 500 returns generic 502 body", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({
          code: -1000,
          msg: "An unknown error occured while processing the request",
        }),
      });

      const res = await klinesGET(makeRequest(baseUrl));
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("network error returns generic 502 body without err.message", async () => {
      mockFetch.mockRejectedValue(new Error("ECONNREFUSED 127.0.0.1:443 - Internal DNS failure"));

      const res = await klinesGET(makeRequest(baseUrl));
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(JSON.stringify(body)).not.toContain("ECONNREFUSED");
      expect(JSON.stringify(body)).not.toContain("127.0.0.1");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("successful response remains unchanged", async () => {
      const klinesData = [
        [1609459200000, "28923.63", "28935.50", "28910.00", "28923.00", "123.45"],
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(klinesData),
      });

      const res = await klinesGET(makeRequest(baseUrl));
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual(klinesData);
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });
  });

  describe("binance/ticker", () => {
    const baseUrl = "http://localhost:3000/api/binance/ticker?symbol=BTCUSDT";

    test("upstream 429 returns generic 429 body, no provider details", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => JSON.stringify({
          code: -1015,
          msg: "Too many requests",
          retryAfter: 60,
        }),
      });

      const res = await tickerGET(makeRequest(baseUrl));
      expect(res.status).toBe(429);

      const body = await res.json();
      expect(body).toEqual({ error: "Rate limit exceeded" });
      expect(JSON.stringify(body)).not.toContain("retryAfter");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("upstream 500 returns generic 502 body", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ code: -1000, msg: "Internal error" }),
      });

      const res = await tickerGET(makeRequest(baseUrl));
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("network error returns generic 502 body without err.message", async () => {
      mockFetch.mockRejectedValue(new Error("getaddrinfo ENOTFOUND fapi.binance.com"));

      const res = await tickerGET(makeRequest(baseUrl));
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(JSON.stringify(body)).not.toContain("ENOTFOUND");
      expect(JSON.stringify(body)).not.toContain("binance.com");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("successful response remains unchanged", async () => {
      const tickerData = {
        symbol: "BTCUSDT",
        priceChange: "50.00",
        priceChangePercent: "0.17",
        lastPrice: "28923.00",
      };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(tickerData),
      });

      const res = await tickerGET(makeRequest(baseUrl));
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual(tickerData);
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });
  });

  describe("binance/symbols", () => {
    test("upstream 429 returns generic 429 body, no provider details", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => JSON.stringify({
          code: -1015,
          msg: "Too many requests",
          "x-mbx-used-weight": "1200",
        }),
      });

      const res = await symbolsGET();
      expect(res.status).toBe(429);

      const body = await res.json();
      expect(body).toEqual({ error: "Rate limit exceeded" });
      expect(JSON.stringify(body)).not.toContain("x-mbx-used-weight");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("upstream 500 returns generic 502 body", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ code: -1000, msg: "Server error" }),
      });

      const res = await symbolsGET();
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("malformed JSON returns generic 502 body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Unexpected token < in JSON at position 0");
        },
      });

      const res = await symbolsGET();
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(JSON.stringify(body)).not.toContain("Unexpected token");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("network error returns generic 502 body without err.message", async () => {
      mockFetch.mockRejectedValue(new Error("socket hang up"));

      const res = await symbolsGET();
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(JSON.stringify(body)).not.toContain("socket");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("successful response remains unchanged", async () => {
      const exchangeInfo = {
        symbols: [
          {
            symbol: "BTCUSDT",
            status: "TRADING",
            contractType: "PERPETUAL",
            quoteAsset: "USDT",
            baseAsset: "BTC",
            pricePrecision: 2,
            filters: [{ filterType: "PRICE_FILTER", tickSize: "0.01" }],
          },
        ],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => exchangeInfo,
      });

      const res = await symbolsGET();
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body[0].symbol).toBe("BTCUSDT");
      expect(res.headers.get("Cache-Control")).toContain("s-maxage=300");
    });
  });

  describe("calendar/xoomar", () => {
    const baseUrl = "http://localhost:3000/api/calendar/xoomar?from=2025-06-15&to=2025-06-21";

    test("upstream 429 returns generic 429 body, no provider details", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => JSON.stringify({
          error: "Rate limit exceeded for Xoomar API key sk_live_abc123",
          retryAfter: 3600,
        }),
      });

      const res = await xoomarGET(makeRequest(baseUrl));
      expect(res.status).toBe(429);

      const body = await res.json();
      expect(body).toEqual({ error: "Rate limit exceeded" });
      expect(JSON.stringify(body)).not.toContain("sk_live");
      expect(JSON.stringify(body)).not.toContain("Xoomar");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("upstream 500 returns generic 502 body", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ error: "Internal server error at xoomar.com" }),
      });

      const res = await xoomarGET(makeRequest(baseUrl));
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(JSON.stringify(body)).not.toContain("xoomar.com");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("network error returns generic 502 body without err.message", async () => {
      mockFetch.mockRejectedValue(new Error("connect ETIMEDOUT 104.26.12.228:443"));

      const res = await xoomarGET(makeRequest(baseUrl));
      expect(res.status).toBe(502);

      const body = await res.json();
      expect(body).toEqual({ error: "Upstream service unavailable" });
      expect(JSON.stringify(body)).not.toContain("ETIMEDOUT");
      expect(JSON.stringify(body)).not.toContain("104.26");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    test("successful response remains unchanged", async () => {
      const calendarData = [
        {
          date: "2025-06-15",
          event: "FOMC Meeting",
          impact: "high",
        },
      ];
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(calendarData),
      });

      const res = await xoomarGET(makeRequest(baseUrl));
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual(calendarData);
      expect(res.headers.get("Cache-Control")).toContain("s-maxage=1800");
      expect(res.headers.get("X-MAWS-Calendar")).toBe("xoomar");
    });
  });
});
