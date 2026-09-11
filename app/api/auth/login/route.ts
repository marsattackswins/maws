import { audit } from "@/lib/server/audit/log";
import { checkOriginAndHost, clientIp, rateLimitLogin, type GuardRequest } from "@/lib/server/auth/guard";
import { verifyOperatorPassword } from "@/lib/server/auth/password";
import { createSession } from "@/lib/server/auth/session";
import { serverConfig } from "@/lib/server/env/config";
import { jsonError, jsonOk, secureCookieContext, sessionCookieAttributes } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  if (cfg.env === "local") return jsonError(403, "env_local", "Authentication is not used in local mode");

  const guardReq: GuardRequest = {
    method: req.method,
    url: req.url,
    headers: { get: (name: string) => req.headers.get(name) },
  };
  const origin = checkOriginAndHost(guardReq, cfg);
  if (!origin.ok) return jsonError(403, origin.reason ?? "forbidden", "Request origin/host rejected");

  const ip = clientIp(guardReq, cfg);
  if (!rateLimitLogin(ip)) {
    return jsonError(429, "rate_limited", "Too many attempts; try again later");
  }

  let body: { password?: unknown } | null = null;
  try {
    body = (await req.json()) as { password?: unknown };
  } catch {
    return jsonError(400, "bad_request", "Invalid JSON body");
  }
  const password = typeof body?.password === "string" ? body.password : "";
  if (!cfg.operatorAuth || !verifyOperatorPassword(password, cfg.operatorAuth)) {
    audit("anonymous", "login.failed", {}, ip);
    return jsonError(401, "bad_credentials", "Invalid operator password");
  }

  const ua = req.headers.get("user-agent");
  const { sessionId, csrfToken } = createSession(ua);
  audit("operator", "login.success", { secure: secureCookieContext(cfg) }, ip);
  return jsonOk(
    { csrf: csrfToken },
    { headers: { "set-cookie": sessionCookieAttributes(cfg, sessionId) } },
  );
}
