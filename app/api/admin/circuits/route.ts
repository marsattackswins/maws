import { circuitRegistry } from "@/lib/server/resilience/circuit-registry";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/circuits
 * Returns circuit breaker statistics for monitoring.
 */
export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }

  // In local mode, circuit breakers may not be initialized
  if (cfg.env === "local") {
    return jsonOk({
      env: "local",
      circuits: {},
      openCircuits: [],
      hasOpenCircuits: false,
    });
  }

  const ctx = authenticate(req, cfg);
  if (isAuthFailure(ctx)) return ctx.response;

  const stats = circuitRegistry.getAllStats();
  const openCircuits = circuitRegistry.getOpenCircuits();

  return jsonOk({
    env: cfg.env,
    circuits: stats,
    openCircuits,
    hasOpenCircuits: openCircuits.length > 0,
  });
}
