import { audit } from "@/lib/server/audit/log";
import { serverConfig } from "@/lib/server/env/config";
import { revokeAllSessions } from "@/lib/server/auth/session";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const ctx = authenticate(req, cfg);
  if (isAuthFailure(ctx)) return ctx.response;
  const revoked = revokeAllSessions();
  audit("operator", "sessions.revoke_all", { revoked }, ctx.ip);
  return jsonOk({ ok: true, revoked });
}
