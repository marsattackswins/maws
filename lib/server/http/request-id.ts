import "server-only";

import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Request ID correlation for the live API.
 *
 * Every live mutation request gets a correlation ID, either echoed from the
 * client's `x-request-id` header (capped and charset-checked so it is safe to
 * hand back in a response header and a log line) or freshly generated. The ID
 * is carried in an AsyncLocalStorage scope so `lib/server/log/logger.ts` can
 * stamp `request_id` onto every JSON log line emitted while the request is in
 * flight — without threading the ID through every function signature.
 */

export const REQUEST_ID_HEADER = "x-request-id";

/** Upper bound for an accepted incoming request ID. */
export const MAX_REQUEST_ID_LENGTH = 128;

/** IDs are opaque tokens: UUIDs, ULIDs, hex, W3C trace IDs all fit. */
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:@/-]+$/;

const requestScope = new AsyncLocalStorage<string>();

/** A fresh, unique request ID (UUID v4). */
export function generateRequestId(): string {
  return randomUUID();
}

/** Accept an incoming ID only if it is a safe, bounded token; else undefined. */
export function sanitizeRequestId(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  // Repeated headers arrive comma-joined via Headers.get; first is authoritative.
  const candidate = raw.split(",")[0]?.trim();
  if (!candidate) return undefined;
  if (candidate.length > MAX_REQUEST_ID_LENGTH) return undefined;
  if (!REQUEST_ID_PATTERN.test(candidate)) return undefined;
  return candidate;
}

/**
 * The request ID for this request: the client-supplied `x-request-id` when
 * valid, otherwise a newly generated one.
 */
export function extractRequestId(req: Request): string {
  return sanitizeRequestId(req.headers.get(REQUEST_ID_HEADER)) ?? generateRequestId();
}

/** Current request ID inside a `runWithRequestId` scope, if any. */
export function currentRequestId(): string | undefined {
  return requestScope.getStore();
}

/** Run `fn` with `requestId` bound as the current request ID (async-safe). */
export function runWithRequestId<T>(requestId: string, fn: () => Promise<T>): Promise<T> {
  return requestScope.run(requestId, fn);
}

/**
 * Attach the correlation header to a response. Every response crossing the
 * live mutation boundary is constructed in-process (guards/rate-limit), so
 * its headers are mutable; the fallthrough copy covers immutably-guarded
 * responses (e.g. from fetch()) for any future caller.
 */
export function attachRequestId(res: Response, requestId: string): Response {
  try {
    res.headers.set(REQUEST_ID_HEADER, requestId);
    return res;
  } catch {
    const out = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
    out.headers.set(REQUEST_ID_HEADER, requestId);
    return out;
  }
}
