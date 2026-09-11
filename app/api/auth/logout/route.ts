import { checkOriginAndHost, type GuardRequest } from "@/lib/server/auth/guard";
import { readSessionCookie, revokeSession } from "@/lib/server/auth/session";
import { serverConfig } from "@/lib/server/env/config";
import { audit } from "@/lib/server/audit/log";
import {
  clearSessionCookieAttributes,
  jsonError,
  jsonOk,
  secureCookieContext,
} from "@/lib/server/http/guards";

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

  const sessionId = readSessionCookie(req.headers.get("cookie"), secureCookieContext(cfg));
  const revoked = revokeSession(sessionId);
  audit("operator", "logout", { revoked }, null);
  return jsonOk({ ok: true }, { headers: { "set-cookie": clearSessionCookieAttributes(cfg) } });
}
