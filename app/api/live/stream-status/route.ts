import { serverConfig } from "@/lib/server/env/config";
import { activeProfileConfig } from "@/lib/server/profile/coordinator";
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
  const ctx = authenticate(req, cfg, { allowLocal: true });
  if (isAuthFailure(ctx)) return ctx.response;
  const health = buildHealthStatus(activeProfileConfig());
  return jsonOk({
    stream: health.signals.stream,
    clock: health.signals.clock,
    recon: health.signals.recon,
    streamHealthy: health.streamHealthy,
    clockHealthy: health.clockHealthy,
    reconHealthy: health.reconHealthy,
  });
}
