import { audit } from "@/lib/server/audit/log";
import { serverConfig } from "@/lib/server/env/config";
import { activeProfileConfig } from "@/lib/server/profile/coordinator";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { executionDecision } from "@/lib/server/gates/execution";
import { getRuntime, setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { authenticate, isAuthFailure, jsonError, jsonOk, readJson } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const ctx = authenticate(req, cfg);
  if (isAuthFailure(ctx)) return ctx.response;
  const runtimeCfg = activeProfileConfig();
  const profile = persistenceProfileFromConfig(runtimeCfg);
  return jsonOk({
    decision: executionDecision(runtimeCfg),
    killSwitch: getRuntime(RUNTIME_KEYS.killSwitch, "", profile) === "true",
    runtimeEnabled: getRuntime(RUNTIME_KEYS.executionEnabled, "", profile) === "true",
  });
}

/**
 * Toggles the runtime execution flag and the emergency kill switch.
 * The kill switch blocks new submissions immediately; engaged state survives
 * restarts because it lives in the DB.
 */
export async function POST(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const ctx = authenticate(req, cfg);
  if (isAuthFailure(ctx)) return ctx.response;

  const runtimeCfg = activeProfileConfig();
  const profile = persistenceProfileFromConfig(runtimeCfg);
  const body = await readJson<{ executionEnabled?: unknown; killSwitch?: unknown }>(req);
  if (!body) return jsonError(400, "bad_request", "Invalid JSON body");

  if (typeof body.killSwitch === "boolean") {
    setRuntime(RUNTIME_KEYS.killSwitch, body.killSwitch ? "true" : "false", Date.now(), profile);
    audit("operator", body.killSwitch ? "killswitch.engaged" : "killswitch.disengaged", {}, ctx.ip);
  }
  if (typeof body.executionEnabled === "boolean") {
    if (runtimeCfg.env === "production" && body.executionEnabled && !runtimeCfg.executionEnabledStatic) {
      return jsonError(409, "static_gate", "MAWS_EXECUTION_ENABLED must be true before the runtime flag can open production submissions");
    }
    if (runtimeCfg.env === "shadow" || runtimeCfg.env === "local") {
      return jsonError(409, "env", "Runtime execution flag cannot open submissions in this environment");
    }
    setRuntime(RUNTIME_KEYS.executionEnabled, body.executionEnabled ? "true" : "false", Date.now(), profile);
    audit("operator", "execution.runtime_flag", { enabled: body.executionEnabled }, ctx.ip);
  }
  return jsonOk({ decision: executionDecision(runtimeCfg) });
}
