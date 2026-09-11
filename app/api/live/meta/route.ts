import { HOST_MAP, serverConfig } from "@/lib/server/env/config";
import { activeProfileConfig, profileRuntimeStatus } from "@/lib/server/profile/coordinator";
import { executionDecision } from "@/lib/server/gates/execution";
import { buildHealthStatus } from "@/lib/server/health/status";

import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";

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
  const status = profileRuntimeStatus();
  const health = buildHealthStatus(runtimeCfg);
  return jsonOk({
    env: runtimeCfg.env,
    envLabel: HOST_MAP[runtimeCfg.env].label,
    connectedBroker: status.ready && health.brokerConnected ? "binance" : "",
    managerStatus: status.managerStatus,
    managerError: health.signals.brokerError,
    execution: executionDecision(runtimeCfg),
    health,
  });
}
