import { serverConfig } from "@/lib/server/env/config";
import { pingBroker } from "@/lib/server/binance/broker-ping";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

export const dynamic = "force-dynamic";

/**
 * GET /api/health/broker
 * Verifies broker connectivity with a lightweight, side-effect-free ping
 * (GET /fapi/v1/ping — no credentials, no orders, no state changes).
 *
 * Authorized via the shared MAWS_HEALTH_TOKEN header (so alerting can run
 * outside the browser) or a valid operator session — same pattern as
 * /api/health.
 *
 * 200 { status: "ok",       broker, latency_ms }
 * 503 { status: "degraded", broker, latency_ms }
 * 401/403 on missing/invalid auth
 */
export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }

  // Local mode: allow anonymous access (development convenience)
  if (cfg.env !== "local") {
    const token = req.headers.get("x-maws-health-token");
    let authorized = false;
    if (cfg.healthToken && token) {
      authorized = compareSecretTokens(token, cfg.healthToken);
    }
    if (!authorized) {
      // Fall back to a valid operator session.
      const sessionCheck = authenticate(req, cfg);
      if (isAuthFailure(sessionCheck)) return sessionCheck.response;
    }
  }

  const result = await pingBroker(cfg);
  const body = {
    status: result.ok ? ("ok" as const) : ("degraded" as const),
    broker: result.broker,
    latency_ms: result.latencyMs,
  };

  if (result.ok) {
    return jsonOk(body);
  }
  return new Response(JSON.stringify(body), {
    status: 503,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
