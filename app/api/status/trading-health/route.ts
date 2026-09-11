import { serverConfig } from "@/lib/server/env/config";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { recentIntents } from "@/lib/server/binance/intents";
import { healthSignals } from "@/lib/server/health/state";
import { buildHealthStatus } from "@/lib/server/health/status";
import { aggregateTradingHealth, type TradingHealthOrderFailure, type TradingHealthReconciliationMismatch } from "@/lib/server/health/trading";
import { getDb } from "@/lib/server/db/connection";
import { getMetrics, METRICS } from "@/lib/server/metrics/collector";
import { activeProfileConfig, activeProfileManager } from "@/lib/server/profile/coordinator";
import { initializeCircuitBreakers } from "@/lib/server/resilience/breakers";
import { circuitRegistry } from "@/lib/server/resilience/circuit-registry";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

export const dynamic = "force-dynamic";

const RECENT_LIMIT = 10;

export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }

  if (cfg.env !== "local") {
    const session = authenticate(req, cfg);
    const tokenValid = compareSecretTokens(req.headers.get("x-maws-health-token"), cfg.healthToken);
    if (isAuthFailure(session) && !tokenValid) return session.response;
  }

  try {
    const runtimeCfg = activeProfileConfig();
    const profile = persistenceProfileFromConfig(runtimeCfg);
    const signals = healthSignals();
    const health = buildHealthStatus(runtimeCfg);
    const metrics = getMetrics();
    const db = getDb();

    const failedOrderCount = db
      .prepare(`SELECT COUNT(*) AS count FROM order_intents WHERE profile_id = ? AND status = 'REJECTED'`)
      .get(profile.id) as { count: number };
    const failedOrders = recentIntents(RECENT_LIMIT, profile)
      .filter((intent) => intent.status === "REJECTED")
      .map((intent): TradingHealthOrderFailure => ({
        clientOrderId: intent.clientOrderId,
        symbol: intent.symbol,
        side: intent.side,
        type: intent.type,
        status: intent.status,
        updatedAt: intent.updatedAt,
        reason: extractReason(intent.lastState),
      }));

    const reconciliationCount = db
      .prepare(`SELECT COUNT(*) AS count FROM reconciliation_runs WHERE profile_id = ?`)
      .get(profile.id) as { count: number };
    const reconciliationMismatchCount = db
      .prepare(`SELECT COUNT(*) AS count FROM reconciliation_runs WHERE profile_id = ? AND result IN ('drift', 'error')`)
      .get(profile.id) as { count: number };
    const reconciliationRows = db
      .prepare(
        `SELECT started_at, finished_at, trigger, result, details
         FROM reconciliation_runs
         WHERE profile_id = ? AND result IN ('drift', 'error')
         ORDER BY id DESC LIMIT ?`,
      )
      .all(profile.id, RECENT_LIMIT) as Array<{
        started_at: number;
        finished_at: number | null;
        trigger: string;
        result: "drift" | "error";
        details: string | null;
      }>;
    const reconciliation: { runs: number; mismatches: number; recent: TradingHealthReconciliationMismatch[] } = {
      runs: reconciliationCount.count,
      mismatches: reconciliationMismatchCount.count,
      recent: reconciliationRows.map((row) => ({
        startedAt: row.started_at,
        finishedAt: row.finished_at,
        trigger: row.trigger,
        result: row.result,
        diffs: extractDiffs(row.details),
      })),
    };

    const manager = activeProfileManager();
    const rateLimiter = manager ? manager.limiter.state() : null;
    if (runtimeCfg.env !== "local") initializeCircuitBreakers();
    const circuits = runtimeCfg.env === "local" ? {} : circuitRegistry.getAllStats();
    const openCircuits = runtimeCfg.env === "local" ? [] : circuitRegistry.getOpenCircuits();

    const body = aggregateTradingHealth({
      env: runtimeCfg.env,
      stream: signals.stream,
      streamHealthy: health.streamHealthy,
      snapshotAt: signals.snapshot?.fetchedAt ?? null,
      failedOrders: { count: failedOrderCount.count, recent: failedOrders },
      metrics: {
        rejectedOrders: metrics.getCounter(METRICS.ORDER_REJECTED),
        websocketReconnects: metrics.getCounter(METRICS.WS_RECONNECT),
        websocketErrors: metrics.getCounter(METRICS.WS_ERROR),
        reconciliationDrifts: metrics.getCounter(METRICS.RECON_DRIFT_DETECTED),
      },
      reconciliation,
      rateLimiter,
      circuits,
      openCircuits,
    });

    return jsonOk(body, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("Trading health error:", error);
    return jsonError(500, "trading_health", error instanceof Error ? error.message : "Failed to collect trading health");
  }
}


function extractReason(lastState: string | null): string | null {
  if (!lastState) return null;
  try {
    const parsed = JSON.parse(lastState) as { error?: unknown };
    return typeof parsed.error === "string" ? parsed.error : lastState;
  } catch {
    return lastState;
  }
}

function extractDiffs(details: string | null): string[] {
  if (!details) return [];
  try {
    const parsed = JSON.parse(details) as { diffs?: unknown };
    return Array.isArray(parsed.diffs) ? parsed.diffs.filter((diff): diff is string => typeof diff === "string") : [];
  } catch {
    return [];
  }
}
