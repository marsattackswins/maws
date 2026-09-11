import { describe, test, expect, jest } from "@jest/globals";
import { GET } from "@/app/api/news/finnhub/route";
import type { NextRequest } from "next/server";

/**
 * Focused validation tests for Finnhub news route symbol parameter.
 * 
 * Scope: symbol query parameter validation only.
 * Does not test: authentication, rate limits, caching, upstream error mapping, category semantics.
 */

// Mock server config to bypass auth in tests
jest.mock("@/lib/server/env/config", () => ({
  serverConfig: jest.fn(() => ({ env: "local" })),
}));

// Mock Finnhub API key
jest.mock("@/lib/market/finnhub-server", () => ({
  getFinnhubApiKey: jest.fn(() => ({ key: "test-key", configured: true })),
  FINNHUB_REST: "https://finnhub.io/api/v1",
}));

// Mock resolveNewsTarget to track calls
const mockResolveNewsTarget = jest.fn();
jest.mock("@/lib/news", () => {
  const actual = jest.requireActual<typeof import("@/lib/news")>("@/lib/news");
  return {
    ...actual,
    resolveNewsTarget: (symbol: string) => {
      mockResolveNewsTarget(symbol);
      return {
        kind: "market" as const,
        category: "crypto" as const,
        filter: "BTC",
        keywords: ["btc", "bitcoin"],
        label: "Bitcoin",
      };
    },
  };
});

// Mock fetch to prevent real upstream calls
const mockFetch = jest.fn();
// @ts-expect-error - Mock fetch response for testing
global.fetch = mockFetch;

function makeRequest(params: Record<string, string>): NextRequest {
  const url = new URL("http://localhost:3000/api/news/finnhub");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return {
    nextUrl: url,
    headers: new Headers(),
  } as NextRequest;
}

describe("finnhub news route symbol validation", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockResolveNewsTarget.mockClear();
    // @ts-expect-error - Mock fetch response for testing
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([]),
    });
  });

  describe("symbol validation - valid inputs", () => {
    test("valid crypto symbol accepted (BTCUSDT)", async () => {
      const req = makeRequest({ symbol: "BTCUSDT" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("BTCUSDT");
    });

    test("valid equity symbol accepted (MUUSDT)", async () => {
      const req = makeRequest({ symbol: "MUUSDT" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("MUUSDT");
    });

    test("valid commodity symbol accepted (XAUUSDT)", async () => {
      const req = makeRequest({ symbol: "XAUUSDT" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("XAUUSDT");
    });

    test("valid symbol with .P suffix accepted (BTCUSDT.P)", async () => {
      const req = makeRequest({ symbol: "BTCUSDT.P" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("BTCUSDT.P");
    });

    test("valid symbol with .p suffix accepted (lowercase)", async () => {
      const req = makeRequest({ symbol: "BTCUSDT.p" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("BTCUSDT.p");
    });

    test("valid exchange-qualified symbol accepted (000660.KS)", async () => {
      const req = makeRequest({ symbol: "000660.KS" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("000660.KS");
    });

    test("valid HK exchange symbol accepted (0700.HK)", async () => {
      const req = makeRequest({ symbol: "0700.HK" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("0700.HK");
    });

    test("symbol at max length accepted (32 chars)", async () => {
      const req = makeRequest({ symbol: "A".repeat(32) });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });

    test("mixed case symbol accepted (preserves case)", async () => {
      const req = makeRequest({ symbol: "BtcUSDT" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      // bareSymbol() will uppercase internally
      expect(mockResolveNewsTarget).toHaveBeenCalledWith("BtcUSDT");
    });
  });

  describe("symbol validation - empty/omitted is valid", () => {
    test("omitted symbol allowed (market news mode)", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      // Empty symbol triggers category-based news fetch (no resolveNewsTarget call)
    });

    test("empty string symbol allowed after trim", async () => {
      const req = makeRequest({ symbol: "" });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });

    test("whitespace-only symbol allowed after trim", async () => {
      const req = makeRequest({ symbol: "   " });
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });
  });

  describe("symbol validation - invalid inputs rejected", () => {
    test("over-length symbol rejected (33 chars)", async () => {
      const req = makeRequest({ symbol: "A".repeat(33) });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (<)", async () => {
      const req = makeRequest({ symbol: "BTC<USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (>)", async () => {
      const req = makeRequest({ symbol: "BTC>USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (&)", async () => {
      const req = makeRequest({ symbol: "BTC&USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (')", async () => {
      const req = makeRequest({ symbol: "BTC'USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (\")", async () => {
      const req = makeRequest({ symbol: 'BTC"USDT' });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (;)", async () => {
      const req = makeRequest({ symbol: "BTC;USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (-)", async () => {
      const req = makeRequest({ symbol: "BTC-USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (_)", async () => {
      const req = makeRequest({ symbol: "BTC_USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with special chars rejected (/)", async () => {
      const req = makeRequest({ symbol: "BTC/USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with space rejected", async () => {
      const req = makeRequest({ symbol: "BTC USDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with newline rejected", async () => {
      const req = makeRequest({ symbol: "BTC\nUSDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });

    test("symbol with tab rejected", async () => {
      const req = makeRequest({ symbol: "BTC\tUSDT" });
      const res = await GET(req);
      expect(res.status).toBe(400);
      expect(mockResolveNewsTarget).not.toHaveBeenCalled();
    });
  });

  describe("category behavior - unchanged", () => {
    test("valid categories work (general)", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.set("category", "general");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });

    test("valid categories work (crypto)", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.set("category", "crypto");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });

    test("valid categories work (merger)", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.set("category", "merger");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });

    test("valid categories work (all)", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.set("category", "all");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });

    test("invalid category defaults to 'all' (safe fallback, not rejected)", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.set("category", "invalid");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      // Should not return 400, safe default behavior
      expect(res.status).not.toBe(400);
    });

    test("omitted category works (defaults to 'all')", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });

    test("empty category works (defaults to 'all')", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.set("category", "");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
    });
  });

  describe("integration", () => {
    test("unknown query params ignored", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.set("symbol", "BTCUSDT");
      url.searchParams.set("unknownParam", "malicious");
      url.searchParams.set("extraField", "ignored");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      expect(res.status).not.toBe(400);
      // Unknown params should not affect behavior
    });

    test("valid request preserves successful response", async () => {
      const mockNewsData = [
        { headline: "Test", datetime: Date.now() / 1000, source: "Test", id: 1, url: "http://test.com" },
      ];
      // @ts-expect-error - Mock fetch response for testing
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockNewsData),
      });

      const req = makeRequest({ symbol: "BTCUSDT" });
      const res = await GET(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("items");
    });
  });

  describe("URLSearchParams duplicate behavior", () => {
    test("duplicate symbol params - first value used", async () => {
      const url = new URL("http://localhost:3000/api/news/finnhub");
      url.searchParams.append("symbol", "BTCUSDT");
      url.searchParams.append("symbol", "ETHUSDT");
      const req = { nextUrl: url, headers: new Headers() } as NextRequest;
      const res = await GET(req);
      
      // URLSearchParams.get() returns first value
      // Should be valid (BTCUSDT is valid)
      expect(res.status).not.toBe(400);
      
      // Verify resolveNewsTarget called with first value
      if (mockResolveNewsTarget.mock.calls.length > 0) {
        expect(mockResolveNewsTarget).toHaveBeenCalledWith("BTCUSDT");
      }
    });
  });
});
