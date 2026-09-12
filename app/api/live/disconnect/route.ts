import { audit } from "@/lib/server/audit/log";
import { serverConfig } from "@/lib/server/env/config";
import { activeProfileConfig } from "@/lib/server/profile/coordinator";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

/**
 * Detaches the UI from the live broker. The server keeps monitoring the
 * account (stream + reconciliation stay on) because the exchange state is
 * authoritative regardless of which UI is attached.
 */
export async function POST(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const ctx = authenticate(req, cfg, { allowLocal: true });
  if (isAuthFailure(ctx)) return ctx.response;
  const runtimeProfile = persistenceProfileFromConfig(activeProfileConfig());
  setRuntime(RUNTIME_KEYS.connectedBroker, "", Date.now(), runtimeProfile);
  audit("operator", "live.detach", {}, ctx.ip);
  return jsonOk({ ok: true });
}
