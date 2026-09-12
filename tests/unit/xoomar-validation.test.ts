import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { GET } from "@/app/api/calendar/xoomar/route";
import type { NextRequest } from "next/server";
import { parseCalendarDate } from "@/lib/server/validation/calendar";

/**
 * Focused validation tests for Xoomar calendar route and helper.
 * Scope: query parameter validation and Gregorian logic.
 * Does not test: auth, caching, rate limits, UI.
 */

// Mock server config to bypass auth in tests
jest.mock("@/lib/server/env/config", () => ({
  serverConfig: jest.fn(() => ({ env: "local" })),
}));

// Mock fetch to prevent real upstream calls
const mockFetch = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.fetch = mockFetch as any;

function makeRequest(params: Record<string, string | string[]>): NextRequest {
  const url = new URL("http://localhost:3000/api/calendar/xoomar");
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(key, v));
    } else {
      url.searchParams.set(key, value);
    }
  }
  return {
    nextUrl: url,
    headers: new Headers(),
  } as unknown as NextRequest;
}

describe("Xoomar Calendar Validation", () => {
  describe("Group 1 - Pure helper tests (parseCalendarDate)", () => {
    test("H1: Valid leap day (2024 is leap) is accepted", () => {
      const day = parseCalendarDate("2024-02-29");
      expect(day).not.toBeNull();
    });

    test("H2: Non-leap year Feb 29 is rejected", () => {
      expect(parseCalendarDate("2023-02-29")).toBeNull();
    });

    test("H3: Impossible date (April 31) is rejected", () => {
      expect(parseCalendarDate("2024-04-31")).toBeNull();
    });

    test("H4: Impossible month 00 is rejected", () => {
      expect(parseCalendarDate("2024-00-01")).toBeNull();
    });

    test("H5: Impossible day 00 is rejected", () => {
      expect(parseCalendarDate("2024-01-00")).toBeNull();
    });

    test("H6: Format failure (no dashes) is rejected", () => {
      expect(parseCalendarDate("20250615")).toBeNull();
    });

    test("H7: Format failure (non-zero-padded month) is rejected", () => {
      expect(parseCalendarDate("2025-6-15")).toBeNull();
    });

    test("H8: Format failure (letters) is rejected", () => {
      expect(parseCalendarDate("abc")).toBeNull();
    });

    test("H9: Day-number conversion is stable", () => {
      const day = parseCalendarDate("2025-06-15");
      expect(day).toBe(20254);
    });
  });

  describe("Group 2 - Route-level validation tests", () => {
    // Fixed UTC Reference Date: 2025-06-15 (Day 20254)
    // Allowed Window: [2025-06-13, 2026-07-17] (days 20252 to 20621)
    const FIXED_NOW_MS = Date.UTC(2025, 5, 15);
    
    let dateNowSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
      mockFetch.mockClear();
      // @ts-expect-error - Mock fetch response
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      });

      dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW_MS);
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    describe("2a - Required parameters", () => {
      test("R1: Missing 'from'", async () => {
        const res = await GET(makeRequest({ to: "2025-06-21" }));
        expect(res.status).toBe(400);
      });

      test("R2: Missing 'to'", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15" }));
        expect(res.status).toBe(400);
      });

      test("R3: Explicitly empty 'from'", async () => {
        const res = await GET(makeRequest({ from: "", to: "2025-06-21" }));
        expect(res.status).toBe(400);
      });

      test("R4: Explicitly empty 'to'", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15", to: "" }));
        expect(res.status).toBe(400);
      });
    });

    describe("2b - Format rejection", () => {
      test("R5: Format failure (no dashes) rejected", async () => {
        const res = await GET(makeRequest({ from: "20250615", to: "2025-06-21" }));
        expect(res.status).toBe(400);
      });

      test("R6: Format failure (non-zero-padded month) rejected", async () => {
        const res = await GET(makeRequest({ from: "2025-6-15", to: "2025-06-21" }));
        expect(res.status).toBe(400);
      });

      test("R7: Format failure (letters) rejected", async () => {
        const res = await GET(makeRequest({ from: "abc", to: "2025-06-21" }));
        expect(res.status).toBe(400);
      });
    });

    describe("2c - Valid current client pattern", () => {
      test("R8: 7-day forward window, UTC user", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15", to: "2025-06-21" }));
        expect(res.status).toBe(200);
      });
    });

    describe("2d - Ordering and range", () => {
      test("R9: from > to rejected", async () => {
        const res = await GET(makeRequest({ from: "2025-06-21", to: "2025-06-15" }));
        expect(res.status).toBe(400);
      });

      test("R10: Equal dates (1-day inclusive range)", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15", to: "2025-06-15" }));
        expect(res.status).toBe(200);
      });

      test("R11: 90-day inclusive boundary", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15", to: "2025-09-12" }));
        expect(res.status).toBe(200);
      });

      test("R12: 91-day range rejected", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15", to: "2025-09-13" }));
        expect(res.status).toBe(400);
      });
    });

    describe("2e - UTC bounds", () => {
      test("R13: from = today - 2 (minimum, inclusive)", async () => {
        const res = await GET(makeRequest({ from: "2025-06-13", to: "2025-06-15" }));
        expect(res.status).toBe(200);
      });

      test("R14: from = today - 3 (below minimum)", async () => {
        const res = await GET(makeRequest({ from: "2025-06-12", to: "2025-06-15" }));
        expect(res.status).toBe(400);
      });

      test("R15: to = today + 367 (maximum, inclusive)", async () => {
        const res = await GET(makeRequest({ from: "2026-06-15", to: "2026-06-17" }));
        expect(res.status).toBe(200);
      });

      test("R16: to = today + 368 (above maximum)", async () => {
        const res = await GET(makeRequest({ from: "2026-06-15", to: "2026-06-18" }));
        expect(res.status).toBe(400);
      });
    });

    describe("2f - Timezone-spread representative examples", () => {
      test("R17: UTC+14: local today = 2025-06-16 (= UTC today+1); full 7-day window accepted", async () => {
        const res = await GET(makeRequest({ from: "2025-06-16", to: "2025-06-22" }));
        expect(res.status).toBe(200);
      });

      test("R18: UTC-12: local today = 2025-06-14 (= UTC today-1); full 7-day window accepted", async () => {
        const res = await GET(makeRequest({ from: "2025-06-14", to: "2025-06-20" }));
        expect(res.status).toBe(200);
      });
    });

    describe("2g - Forwarding and security", () => {
      test("R19: Duplicate from: first value wins for validation", async () => {
        const res = await GET(makeRequest({ from: ["2025-06-15", "2025-06-01"], to: "2025-06-21" }));
        expect(res.status).toBe(200);
        
        const upstreamUrl = mockFetch.mock.calls[0][0] as string;
        expect(upstreamUrl).toBe("https://xoomar.com/api/markets/calendar");
      });

      test("R20: Unknown params not forwarded", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15", to: "2025-06-21", malicious: "true" }));
        expect(res.status).toBe(200);
        
        const upstreamUrl = mockFetch.mock.calls[0][0] as string;
        expect(upstreamUrl).not.toContain("malicious");
      });

      test("R21: No upstream fetch for any invalid input", async () => {
        const res = await GET(makeRequest({ from: "invalid", to: "2025-06-21" }));
        expect(res.status).toBe(400);
        expect(mockFetch).not.toHaveBeenCalled();
      });

      test("R22: Valid date strings are used for local filtering", async () => {
        const res = await GET(makeRequest({ from: "2025-06-15", to: "2025-06-21" }));
        expect(res.status).toBe(200);
        
        const upstreamUrl = mockFetch.mock.calls[0][0] as string;
        expect(upstreamUrl).toBe("https://xoomar.com/api/markets/calendar");
      });
    });
  });
});
