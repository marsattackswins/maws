import "server-only";

import { resolveOperatorSession } from "./session-guard";
import { serverConfig } from "../env/config";

/**
 * Server-side page authentication guard.
 *
 * Returns true if the request should render protected page content:
 * - Local mode: always authorized (development convenience)
 * - Non-local: requires valid, unexpired, non-revoked operator session
 *
 * Returns false if the page should redirect to /login.
 *
 * Throws if server configuration cannot be loaded (fail closed).
 */
export function isOperatorPageAuthorized(cookieHeader: string | null): boolean {
  const cfg = serverConfig(); // Throws on config error (fail closed)

  // Local mode: unrestricted access for development
  if (cfg.env === "local") {
    return true;
  }

  // Non-local: require valid operator session
  return resolveOperatorSession(cookieHeader, cfg) !== null;
}

/** @deprecated Use isOperatorPageAuthorized, which protects every operator page. */
export function isAdminPageAuthorized(cookieHeader: string | null): boolean {
  return isOperatorPageAuthorized(cookieHeader);
}
