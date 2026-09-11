import crypto from "node:crypto";

import { serverConfig } from "@/lib/server/env/config";
import { buildHealthStatus } from "@/lib/server/health/status";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { metricsSnapshot } from "@/lib/server/metrics/collector";

export const dynamic = "force-dynamic";

/**
 * Operational health for monitoring. Authorized via the operator session or a
 * shared MAWS_HEALTH_TOKEN header, so alerting can run outside the browser.
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
      const a = Buffer.from(token);
      const b = Buffer.from(cfg.healthToken);
      authorized = a.length === b.length && crypto.timingSafeEqual(a, b);
    }
    if (!authorized) {
      // Fall back to a valid operator session.
      const sessionCheck = authenticate(req, cfg);
      if (isAuthFailure(sessionCheck)) return sessionCheck.response;
    }
  }

  // Initialize circuit breakers if needed
  const { initializeCircuitBreakers } = await import("@/lib/server/resilience/breakers");
  initializeCircuitBreakers();

  // Ensure the coordinator is started (workaround for instrumentation not running in dev).
  // Skip in test environment to avoid hanging.
  let runtimeCfg = cfg;
  if (process.env.NODE_ENV !== "test") {
    const coordinator = await import("@/lib/server/profile/coordinator");
    await coordinator.profileCoordinator().ensureStarted().catch(() => undefined);
    runtimeCfg = coordinator.activeProfileConfig();
  }

  const health = buildHealthStatus(runtimeCfg);

  return jsonOk({
    env: health.env,
    healthy: health.healthy,
    brokerConnected: health.brokerConnected,
    managerStatus: health.signals.brokerStatus,
    managerError: health.signals.brokerError,
    managerReady: health.signals.managerRunning && health.signals.brokerStatus === "ready",
    clock: health.signals.clock,
    clockHealthy: health.clockHealthy,
    stream: health.signals.stream,
    streamHealthy: health.streamHealthy,
    recon: health.signals.recon,
    reconHealthy: health.reconHealthy,
    positionModeHealthy: health.positionModeHealthy,
    positionMode: health.signals.positionMode,
    circuitBreakersHealthy: health.circuitBreakersHealthy,
    openCircuits: health.openCircuits,
    circuitBreakerStates: health.circuitBreakerStates,
    execution: health.execution,
    submissionsFrozen: health.submissionsFrozen,
    frozenReasons: health.frozenReasons,
    metrics: metricsSnapshot(),
  });
}
