import { describe, test, expect, jest } from "@jest/globals";
import { GET } from "@/app/api/binance/klines/route";
import type { NextRequest } from "next/server";

/**
 * Focused validation tests for Binance klines route parameter parsing and bounds.
 * 
 * Scope: query parameter validation only.
 * Does not test: authentication, rate limits, caching, upstream error mapping.
 */

// Mock fetch to prevent real upstream calls
const mockFetch = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.fetch = mockFetch as any;

function makeRequest(params: Record<string, string>): NextRequest {
  const url = new URL("http://localhost:3000/api/binance/klines");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return {
    nextUrl: url,
  } as NextRequest;
}

describe("binance klines route validation", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Default successful mock response
    // @ts-expect-error - Mock fetch response for testing
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "[]",
    });
  });

  describe("symbol validation", () => {
    test("valid symbol accepted", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test("missing symbol rejected", async () => {
      const req = makeRequest({ interval: "15m" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("invalid symbol rejected - too short", async () => {
      const req = makeRequest({ symbol: "BTC", interval: "15m" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("invalid symbol rejected - special chars", async () => {
      const req = makeRequest({ symbol: "BTC-USDT", interval: "15m" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("interval validation - case-sensitive", () => {
    const validIntervals = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "1d", "1w", "1M"];

    test.each(validIntervals)("valid interval accepted: %s", async (interval) => {
      const req = makeRequest({ symbol: "BTCUSDT", interval });
      const res = await GET(req);
      expect(res.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain(`interval=${interval}`);
    });

    test("1M (monthly) accepted and forwarded as 1M", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "1M" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain("interval=1M");
      expect(upstreamUrl).not.toContain("interval=1m");
    });

    test("1m (minute) accepted and forwarded as 1m", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "1m" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain("interval=1m");
      expect(upstreamUrl).not.toContain("interval=1M");
    });

    test("invalid casing rejected - 5M", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "5M" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("invalid casing rejected - 1D", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "1D" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("unsupported interval rejected - 999m", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "999m" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("unsupported interval rejected - 60m", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "60m" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("unsupported interval rejected - 2d", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "2d" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("limit validation", () => {
    test("omitted limit defaults to 1500", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain("limit=1500");
    });

    test("valid limit accepted - 1", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "1" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain("limit=1");
    });

    test("valid limit accepted - 500", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "500" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain("limit=500");
    });

    test("valid limit accepted - 1500", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "1500" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain("limit=1500");
    });

    test("zero rejected", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "0" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("negative rejected", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "-1" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("over 1500 rejected - 1501", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "1501" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("over 1500 rejected - 9999", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "9999" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("float rejected - 1.5", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "1.5" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("float rejected - 100.1", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "100.1" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("scientific notation rejected - 1e3", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "1e3" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("scientific notation rejected - 1.5e2", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "1.5e2" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("malformed rejected - '1abc'", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "1abc" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("malformed rejected - 'abc'", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "abc" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("empty string rejected", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("whitespace rejected", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "  " });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("timestamp validation", () => {
    const now = Date.now();
    const validPastTime = now - 86400000; // 1 day ago
    const validRecentTime = now - 3600000; // 1 hour ago

    test("omitted timestamps not forwarded upstream", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).not.toContain("startTime");
      expect(upstreamUrl).not.toContain("endTime");
    });

    test("endTime-only pagination accepted (common pattern)", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: String(validRecentTime),
      });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain(`endTime=${validRecentTime}`);
      expect(upstreamUrl).not.toContain("startTime");
    });

    test("valid startTime and endTime both accepted", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        startTime: String(validPastTime),
        endTime: String(validRecentTime),
      });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain(`startTime=${validPastTime}`);
      expect(upstreamUrl).toContain(`endTime=${validRecentTime}`);
    });

    test("near future accepted (within 1-day tolerance)", async () => {
      const nearFuture = now + 3600000; // 1 hour from now
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: String(nearFuture),
      });
      const res = await GET(req);
      expect(res.status).toBe(200);
    });

    test("far future rejected (beyond 1-day tolerance)", async () => {
      const farFuture = now + 172800000; // 2 days from now
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: String(farFuture),
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("float timestamp rejected", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: `${validRecentTime}.5`,
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("negative timestamp rejected", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        startTime: "-1000",
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("scientific notation timestamp rejected", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: "1e12",
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("malformed timestamp rejected - text", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: "notanumber",
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("empty string timestamp rejected", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: "",
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("whitespace timestamp rejected", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        startTime: "  ",
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("unsafe integer timestamp rejected", async () => {
      const unsafeInt = "9007199254740992"; // MAX_SAFE_INTEGER + 1
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: unsafeInt,
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("reversed timestamps rejected (startTime > endTime)", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        startTime: String(validRecentTime),
        endTime: String(validPastTime),
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("equal timestamps rejected (startTime === endTime)", async () => {
      const timestamp = String(validRecentTime);
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        startTime: timestamp,
        endTime: timestamp,
      });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("large valid range accepted (no calendar cap)", async () => {
      // 1 year range: should be accepted (Binance 1500-limit bounds response)
      const oneYearAgo = now - 31536000000;
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "1d",
        startTime: String(oneYearAgo),
        endTime: String(now),
      });
      const res = await GET(req);
      expect(res.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("upstream forwarding", () => {
    test("unknown query params not forwarded", async () => {
      const url = new URL("http://localhost:3000/api/binance/klines");
      url.searchParams.set("symbol", "BTCUSDT");
      url.searchParams.set("interval", "15m");
      url.searchParams.set("unknownParam", "malicious");
      url.searchParams.set("extraField", "ignored");

      const req = { nextUrl: url } as NextRequest;
      const res = await GET(req);

      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).not.toContain("unknownParam");
      expect(upstreamUrl).not.toContain("extraField");
      expect(upstreamUrl).toContain("symbol=BTCUSDT");
      expect(upstreamUrl).toContain("interval=15m");
    });

    test("valid request forwards only 5 allowed params", async () => {
      const now = Date.now();
      const req = makeRequest({
        symbol: "ETHUSDT",
        interval: "1h",
        limit: "100",
        startTime: String(now - 86400000),
        endTime: String(now),
      });
      const res = await GET(req);

      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;
      expect(upstreamUrl).toContain("symbol=ETHUSDT");
      expect(upstreamUrl).toContain("interval=1h");
      expect(upstreamUrl).toContain("limit=100");
      expect(upstreamUrl).toContain("startTime=");
      expect(upstreamUrl).toContain("endTime=");

      // Count params in upstream URL
      const urlObj = new URL(upstreamUrl);
      const paramKeys = Array.from(urlObj.searchParams.keys());
      expect(paramKeys).toHaveLength(5);
    });

    test("omitted optional params not forwarded", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m" });
      const res = await GET(req);

      expect(res.status).toBe(200);
      const upstreamUrl = mockFetch.mock.calls[0][0] as string;

      const urlObj = new URL(upstreamUrl);
      const paramKeys = Array.from(urlObj.searchParams.keys());
      expect(paramKeys).toHaveLength(3); // symbol, interval, limit only
      expect(urlObj.searchParams.has("startTime")).toBe(false);
      expect(urlObj.searchParams.has("endTime")).toBe(false);
    });
  });

  describe("invalid input handling", () => {
    test("invalid symbol causes no upstream fetch", async () => {
      const req = makeRequest({ symbol: "BAD!", interval: "15m" });
      const res = await GET(req);

      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("invalid interval causes no upstream fetch", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "999m" });
      const res = await GET(req);

      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("invalid limit causes no upstream fetch", async () => {
      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m", limit: "9999" });
      const res = await GET(req);

      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("invalid timestamp causes no upstream fetch", async () => {
      const req = makeRequest({
        symbol: "BTCUSDT",
        interval: "15m",
        endTime: "invalid",
      });
      const res = await GET(req);

      expect(res.status).toBe(400);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("successful response behavior", () => {
    test("valid request returns upstream response", async () => {
      const mockKlinesData = JSON.stringify([[1234567890000, "50000", "51000", "49000", "50500"]]);
      // @ts-expect-error - Mock fetch response for testing
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => mockKlinesData,
      });

      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m" });
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const body = await res.text();
      expect(body).toBe(mockKlinesData);
    });

    test("preserves upstream status codes", async () => {
      // @ts-expect-error - Mock fetch response for testing
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => JSON.stringify({ error: "Rate limit" }),
      });

      const req = makeRequest({ symbol: "BTCUSDT", interval: "15m" });
      const res = await GET(req);

      expect(res.status).toBe(429);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
