import "server-only";

import crypto from "node:crypto";

import { getDb } from "../db/connection";

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export interface SessionRecord {
  csrfToken: string;
  createdAt: number;
  expiresAt: number;
  lastSeenAt: number;
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Opaque random session id; only its SHA-256 hash is persisted so a database
 * leak does not yield usable session tokens.
 */
export function createSession(userAgent: string | null, now = Date.now()): { sessionId: string; csrfToken: string } {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const csrfToken = crypto.randomBytes(24).toString("hex");
  getDb()
    .prepare(
      `INSERT INTO sessions (session_hash, csrf_token, created_at, expires_at, last_seen_at, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(hashToken(sessionId), csrfToken, now, now + SESSION_TTL_MS, now, userAgent ?? null);
  return { sessionId, csrfToken };
}

/** Returns the session if valid; extends the sliding expiry. */
export function getSession(sessionId: string | undefined | null, now = Date.now()): SessionRecord | null {
  if (!sessionId || !/^[0-9a-f]{64}$/.test(sessionId)) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT csrf_token, created_at, expires_at, last_seen_at, revoked_at
       FROM sessions WHERE session_hash = ?`,
    )
    .get(hashToken(sessionId)) as
    | { csrf_token: string; created_at: number; expires_at: number; last_seen_at: number; revoked_at: number | null }
    | undefined;
  if (!row || row.revoked_at != null) return null;
  if (now >= row.expires_at) return null;
  const expiresAt = now + SESSION_TTL_MS;
  db.prepare(`UPDATE sessions SET last_seen_at = ?, expires_at = ? WHERE session_hash = ?`).run(
    now,
    expiresAt,
    hashToken(sessionId),
  );
  return { csrfToken: row.csrf_token, createdAt: row.created_at, expiresAt, lastSeenAt: now };
}

export function revokeSession(sessionId: string | undefined | null, now = Date.now()): boolean {
  if (!sessionId || !/^[0-9a-f]{64}$/.test(sessionId)) return false;
  const res = getDb()
    .prepare(`UPDATE sessions SET revoked_at = ? WHERE session_hash = ? AND revoked_at IS NULL`)
    .run(now, hashToken(sessionId));
  return res.changes > 0;
}

export function revokeAllSessions(now = Date.now()): number {
  const res = getDb().prepare(`UPDATE sessions SET revoked_at = ? WHERE revoked_at IS NULL`).run(now);
  return res.changes;
}

export function countActiveSessions(now = Date.now()): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS n FROM sessions WHERE revoked_at IS NULL AND expires_at > ?`)
    .get(now) as { n: number };
  return row.n;
}

export const SESSION_COOKIE_SECURE = "__Host-maws.session";
export const SESSION_COOKIE_PLAIN = "maws.session";

export function sessionCookieName(secure: boolean): string {
  return secure ? SESSION_COOKIE_SECURE : SESSION_COOKIE_PLAIN;
}

export function readSessionCookie(cookieHeader: string | null, secure: boolean): string | null {
  if (!cookieHeader) return null;
  const name = sessionCookieName(secure);
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) return part.slice(idx + 1).trim();
  }
  return null;
}
