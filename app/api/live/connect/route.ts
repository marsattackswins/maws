import { audit } from "@/lib/server/audit/log";
import { getBroker } from "@/lib/server/broker/factory";
import { serverConfig } from "@/lib/server/env/config";
import { setRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import { buildHealthStatus } from "@/lib/server/health/status";
import { activeProfileConfig } from "@/lib/server/profile/coordinator";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
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

  const runtimeCfg = activeProfileConfig();
  const runtimeProfile = persistenceProfileFromConfig(runtimeCfg);
  // Never leave an earlier attachment marker behind while reconnecting.
  setRuntime(RUNTIME_KEYS.connectedBroker, "", Date.now(), runtimeProfile);
  const broker = getBroker();
  try {
    await broker.connect();
  } catch (err) {
    setRuntime(RUNTIME_KEYS.connectedBroker, "", Date.now(), runtimeProfile);
    audit("operator", "live.connect.failed", { error: String(err) }, ctx.ip);
    return jsonError(502, "broker_start_failed", "Could not reach the exchange; see server health");
  }

  // UserDataStream opens asynchronously. Give the socket a bounded window to
  // complete snapshot recovery, then attach only to confirmed server health.
  const deadline = Date.now() + 5_000;
  let health = buildHealthStatus(runtimeCfg);
  while (broker.getStatus() === "ready" && !health.streamHealthy && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    health = buildHealthStatus(runtimeCfg);
  }
  if (broker.getStatus() !== "ready" || !health.streamHealthy) {
    setRuntime(RUNTIME_KEYS.connectedBroker, "", Date.now(), runtimeProfile);
    const reason = health.signals.brokerError ?? (!health.streamHealthy ? "private stream is not healthy" : "manager not ready");
    audit("operator", "live.connect.failed", { reason, managerStatus: broker.getStatus() }, ctx.ip);
    return jsonError(503, "broker_not_ready", `Live broker not attached: ${reason}`);
  }

  setRuntime(RUNTIME_KEYS.connectedBroker, "binance", Date.now(), runtimeProfile);
  audit("operator", "live.connect", { env: runtimeCfg.env, profileId: runtimeCfg.activeProfileId }, ctx.ip);
  return jsonOk({ ok: true, env: runtimeCfg.env, status: broker.getStatus(), health });
}
