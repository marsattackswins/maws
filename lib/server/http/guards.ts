import "server-only";

import { audit } from "../audit/log";
import { checkCsrf, checkOriginAndHost, clientIp, type GuardRequest } from "../auth/guard";
import { getSession, readSessionCookie, sessionCookieName, SESSION_TTL_MS, type SessionRecord } from "../auth/session";
import type { EnvConfig } from "../env/config";

export interface HandlerContext {
  cfg: EnvConfig;
  session: SessionRecord;
  sessionId: string;
  ip: string;
}

export function jsonOk(data: unknown, init?: { status?: number; headers?: Record<string, string> }): Response {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

export function jsonError(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export function secureCookieContext(cfg: EnvConfig): boolean {
  return cfg.allowedOrigin?.startsWith("https://") ?? false;
}

export function sessionCookieAttributes(cfg: EnvConfig, sessionId: string): string {
  const name = sessionCookieName(secureCookieContext(cfg));
  const parts = [`${name}=${sessionId}`, "Path=/", "HttpOnly", "SameSite=Strict", `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`];
  if (secureCookieContext(cfg)) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookieAttributes(cfg: EnvConfig): string {
  const name = sessionCookieName(secureCookieContext(cfg));
  return `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

type AuthFailure = { response: Response };

/**
 * Full guard chain for every /api/live route: env gate, Origin/Host binding,
 * valid session, and per-session CSRF token on mutating requests.
 */
export function authenticate(
  req: Request,
  cfg: EnvConfig,
  options: { allowLocal?: boolean } = {},
): HandlerContext | AuthFailure {
  const guardReq: GuardRequest = {
    method: req.method,
    url: req.url,
    headers: { get: (name: string) => req.headers.get(name) },
  };

  if (cfg.env === "local" && options.allowLocal !== true) {
    return { response: jsonError(403, "env_local", "Live trading is unavailable when MAWS_ENV=local") };
  }

  const originCheck = checkOriginAndHost(guardReq, cfg);
  if (!originCheck.ok) {
    return { response: jsonError(403, originCheck.reason ?? "forbidden", "Request origin/host rejected") };
  }

  const sessionId = readSessionCookie(req.headers.get("cookie"), secureCookieContext(cfg));
  const session = getSession(sessionId);
  if (!session || !sessionId) {
    return { response: jsonError(401, "unauthenticated", "Sign in required") };
  }

  if (!checkCsrf(guardReq, session.csrfToken)) {
    audit("operator", "csrf.rejected", { path: new URL(req.url).pathname }, clientIp(guardReq, cfg));
    return { response: jsonError(403, "csrf", "CSRF token missing or invalid") };
  }

  return { cfg, session, sessionId, ip: clientIp(guardReq, cfg) };
}

export function isAuthFailure(x: HandlerContext | AuthFailure): x is AuthFailure {
  return (x as AuthFailure).response != null;
}

export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
