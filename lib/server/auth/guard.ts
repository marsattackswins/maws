import "server-only";

import crypto from "node:crypto";

import type { EnvConfig } from "../env/config";

export interface GuardRequest {
  method: string;
  url: string;
  headers: { get(name: string): string | null };
}

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isMutating(req: GuardRequest): boolean {
  return MUTATING.has(req.method.toUpperCase());
}

/**
 * Client IP. X-Forwarded-For is honored only when MAWS_TRUST_PROXY=true,
 * which requires the reverse proxy to strip inbound forwarding headers so a
 * client cannot spoof its address.
 */
export function clientIp(req: GuardRequest, cfg: EnvConfig): string {
  if (cfg.trustProxy) {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first) return first;
    }
  }
  return "direct";
}

/** Local dev conveniences when no MAWS_ALLOWED_ORIGIN is configured. */
const LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

/**
 * Origin/Host binding for every mutating route. Requests without an Origin,
 * with a mismatched Origin, or a Host that disagrees with the expected origin
 * are rejected outright.
 */
export function checkOriginAndHost(req: GuardRequest, cfg: EnvConfig): { ok: boolean; reason?: string } {
  if (!isMutating(req)) return { ok: true };
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  const expected = cfg.allowedOrigin;
  if (expected) {
    if (!origin || origin !== expected) return { ok: false, reason: "origin_mismatch" };
    try {
      const hostOfExpected = new URL(expected).host;
      if (!host || host !== hostOfExpected) return { ok: false, reason: "host_mismatch" };
    } catch {
      return { ok: false, reason: "bad_allowed_origin" };
    }
    return { ok: true };
  }
  // No configured origin: only local dev loopback origins are acceptable.
  if (!origin || !LOCAL_ORIGINS.includes(origin)) return { ok: false, reason: "origin_mismatch" };
  if (host) {
    const hostOfOrigin = new URL(origin).host;
    if (host !== hostOfOrigin) return { ok: false, reason: "host_mismatch" };
  }
  return { ok: true };
}

/** Per-session CSRF token compared in constant time. */
export function checkCsrf(req: GuardRequest, expectedCsrf: string): boolean {
  if (!isMutating(req)) return true;
  const presented = req.headers.get("x-maws-csrf");
  if (!presented) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(expectedCsrf);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** In-memory rolling-window limiter for the login route. */
const loginAttempts = new Map<string, { count: number; windowStart: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 5;

export function rateLimitLogin(ip: string, now = Date.now()): boolean {
  const rec = loginAttempts.get(ip);
  if (!rec || now - rec.windowStart > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (rec.count >= LOGIN_MAX) return false;
  rec.count += 1;
  return true;
}

export function clearLogin(ip: string): void {
  loginAttempts.delete(ip);
}

export function resetRateLimitForTests(): void {
  loginAttempts.clear();
}
