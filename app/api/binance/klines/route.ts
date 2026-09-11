import type { NextRequest } from "next/server";
import { BINANCE_FAPI_REST } from "@/lib/market/binance-intervals";
import { mapUpstreamError, upstreamErrorResponse } from "@/lib/server/validation/proxy-error";
import { klinesAggregator } from "@/lib/server/log/market-logger";

export const dynamic = "force-dynamic";

/**
 * Case-sensitive Binance interval allowlist.
 * 1M is monthly (distinct from 1m minute).
 */
const VALID_INTERVALS = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "1d", "1w", "1M"];

/**
 * Future timestamp tolerance: 1 day in milliseconds for clock skew.
 */
const FUTURE_TOLERANCE_MS = 86400000;

/**
 * Parse a strictly numeric positive integer parameter.
 * Returns null if the value is missing, empty, non-numeric, float, negative, zero, or out of bounds.
 */
function parseStrictPositiveInt(
  value: string | null,
  min: number,
  max: number,
): number | null {
  if (value === null) return null;
  if (value === "" || !/^\d+$/.test(value)) return null;
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isSafeInteger(num)) return null;
  if (num < min || num > max) return null;
  return num;
}

/**
 * Parse a strictly numeric timestamp (non-negative safe integer in milliseconds).
 * Returns null if the value is missing, empty, non-numeric, float, negative, unsafe, or beyond future tolerance.
 */
function parseStrictTimestamp(value: string | null): number | null {
  if (value === null) return null;
  if (value === "" || !/^\d+$/.test(value)) return null;
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isSafeInteger(num) || num < 0) return null;
  if (num > Date.now() + FUTURE_TOLERANCE_MS) return null;
  return num;
}

/**
 * Proxy Binance USDT-M perpetual klines (avoids browser CORS).
 * GET /api/binance/klines?symbol=BTCUSDT&interval=15m&limit=1500
 */
export async function GET(req: NextRequest) {
  const start = Date.now();
  const sp = req.nextUrl.searchParams;

  // 1. Symbol: existing validation
  const symbol = (sp.get("symbol") ?? "").toUpperCase();
  if (!/^[A-Z0-9]{4,32}$/.test(symbol)) {
    klinesAggregator.record(symbol || "invalid", Date.now() - start, false);
    return Response.json({ error: "Invalid symbol" }, { status: 400 });
  }

  // 2. Interval: case-sensitive allowlist (1M is monthly, 1m is minute)
  const interval = sp.get("interval") ?? "15m";
  if (!VALID_INTERVALS.includes(interval)) {
    klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, false);
    return Response.json({ error: "Invalid interval" }, { status: 400 });
  }

  // 3. Limit: strict positive integer, 1-1500, default 1500 if omitted
  const limitParam = sp.get("limit");
  let limit: number;
  if (limitParam === null) {
    limit = 1500;
  } else {
    const parsed = parseStrictPositiveInt(limitParam, 1, 1500);
    if (parsed === null) {
      klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, false);
      return Response.json({ error: "Invalid limit" }, { status: 400 });
    }
    limit = parsed;
  }

  // 4. startTime: strict timestamp if supplied
  const startTimeParam = sp.get("startTime");
  let startTime: number | undefined;
  if (startTimeParam !== null) {
    const parsed = parseStrictTimestamp(startTimeParam);
    if (parsed === null) {
      klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, false);
      return Response.json({ error: "Invalid startTime" }, { status: 400 });
    }
    startTime = parsed;
  }

  // 5. endTime: strict timestamp if supplied
  const endTimeParam = sp.get("endTime");
  let endTime: number | undefined;
  if (endTimeParam !== null) {
    const parsed = parseStrictTimestamp(endTimeParam);
    if (parsed === null) {
      klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, false);
      return Response.json({ error: "Invalid endTime" }, { status: 400 });
    }
    endTime = parsed;
  }

  // 6. Ordering: if both timestamps supplied, require startTime < endTime
  if (startTime !== undefined && endTime !== undefined && startTime >= endTime) {
    klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, false);
    return Response.json({ error: "Invalid time range" }, { status: 400 });
  }

  // 7. Build upstream URL with explicit validated parameters only
  const url = new URL(`${BINANCE_FAPI_REST}/fapi/v1/klines`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));
  if (startTime !== undefined) url.searchParams.set("startTime", String(startTime));
  if (endTime !== undefined) url.searchParams.set("endTime", String(endTime));

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, false, `${res.status} ${res.statusText || "Upstream Error"}`);
      return mapUpstreamError(res.status);
    }
    const body = await res.text();
    klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, true);
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    klinesAggregator.record(`${symbol}:${interval}`, Date.now() - start, false, "Network error or fetch failed");
    return upstreamErrorResponse();
  }
}
