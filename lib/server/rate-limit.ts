import "server-only";

/**
 * Per-symbol, per-operation rolling-window rate limiter for the live mutation
 * APIs.  Each (symbol, operation) key tracks a fixed-size window of request
 * timestamps; once the window is saturated the route returns a 429 with a
 * Retry-After header and a machine-readable JSON body.
 *
 * This is intentionally separate from the Binance exchange rate limiter
 * (lib/server/binance/ratelimit.ts) which governs outbound calls to the
 * exchange.  This limiter protects the operator-facing mutation APIs from
 * excessive calls regardless of exchange state.
 */

export interface RateLimitState {
  /** Number of requests in the current window. */
  count: number;
  /** When the current window expires (ms epoch). */
  resetAt: number;
  /** Max requests permitted in the window. */
  limit: number;
  /** Remaining requests before rate limiting kicks in. */
  remaining: number;
  /** Seconds until the window resets (>= 0). */
  retryAfterSec: number;
  /** Whether the request is allowed. */
  allowed: boolean;
}

export interface RateLimitOptions {
  /** Window size in milliseconds. */
  windowMs: number;
  /** Maximum requests within the window. */
  maxRequests: number;
}

const LIVE_MUTATION_RATE_LIMIT: RateLimitOptions = {
  windowMs: 60_000, // 1 minute
  maxRequests: 30, // 30 mutations per symbol per operation per minute
};

const windows = new Map<string, { timestamps: number[]; resetAt: number }>();

function key(symbol: string, operation: string): string {
  return `${symbol}:${operation}`;
}

function pruneIfNeeded(w: { timestamps: number[]; resetAt: number }, now: number, windowMs: number): void {
  if (now >= w.resetAt) {
    w.timestamps = [];
    w.resetAt = now + windowMs;
  }
  w.timestamps = w.timestamps.filter((t) => t > now - windowMs);
}

export function checkRateLimit(
  symbol: string,
  operation: string,
  opts: RateLimitOptions = LIVE_MUTATION_RATE_LIMIT,
  now = Date.now(),
): RateLimitState {
  const k = key(symbol, operation);
  let w = windows.get(k);
  if (!w) {
    w = { timestamps: [], resetAt: now + opts.windowMs };
    windows.set(k, w);
  }

  pruneIfNeeded(w, now, opts.windowMs);

  const count = w.timestamps.length;
  const resetAt = w.resetAt;
  const retryAfterMs = Math.max(0, resetAt - now);
  const retryAfterSec = Math.ceil(retryAfterMs / 1000);

  const allowed = count < opts.maxRequests;
  const remaining = Math.max(0, opts.maxRequests - count - (allowed ? 1 : 0));

  return {
    count,
    resetAt,
    limit: opts.maxRequests,
    remaining,
    retryAfterSec,
    allowed,
  };
}

export function recordRequest(symbol: string, operation: string, now = Date.now()): void {
  const k = key(symbol, operation);
  let w = windows.get(k);
  if (!w) {
    w = { timestamps: [], resetAt: now + LIVE_MUTATION_RATE_LIMIT.windowMs };
    windows.set(k, w);
  }
  pruneIfNeeded(w, now, LIVE_MUTATION_RATE_LIMIT.windowMs);
  w.timestamps.push(now);
}

/**
 * Build a 429 Rate Limited JSON response with Retry-After header.
 */
export function rateLimitedResponse(
  retryAfterSec: number,
  limit: number,
  remaining: number,
  resetAt: number,
): Response {
  return new Response(
    JSON.stringify({
      error: "rate_limited",
      retry_after_sec: retryAfterSec,
      limit,
      remaining,
      reset_at: resetAt,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
        "retry-after": String(retryAfterSec),
      },
    },
  );
}

/**
 * Reset all rate limit windows (for testing).
 */
export function resetRateLimitWindows(): void {
  windows.clear();
}
