import "server-only";

import { getSession, readSessionCookie, type SessionRecord } from "./session";
import { secureCookieContext } from "../http/guards";
import type { EnvConfig } from "../env/config";

/**
 * Resolve the current operator session from request cookie.
 * 
 * Returns SessionRecord if a valid, unexpired, non-revoked session exists.
 * Returns null if no session, malformed, expired, revoked, or wrong cookie name.
 * 
 * Does not know about routes, environments, local-mode bypass, or response formatting.
 * Callers decide whether to allow anonymous access or require authentication.
 */
export function resolveOperatorSession(
  cookieHeader: string | null,
  cfg: EnvConfig,
): SessionRecord | null {
  const sessionId = readSessionCookie(cookieHeader, secureCookieContext(cfg));
  return getSession(sessionId);
}
