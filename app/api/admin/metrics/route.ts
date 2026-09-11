import { NextRequest, NextResponse } from "next/server";
import { metricsSnapshot } from "@/lib/server/metrics/collector";
import { pnl24h } from "@/lib/server/metrics/pnl";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/metrics
 * Returns current metrics snapshot (JSON format).
 * In local mode: No authentication required.
 * In other modes: Requires operator authentication OR health token (via x-maws-health-token header).
 */
export async function GET(req: NextRequest) {
  const cfg = serverConfig();

  // Local mode is unauthenticated, but metrics remain real (including zero
  // values when no live event has occurred).
  if (cfg.env !== "local") {
    // Non-local mode: check authentication
  const ctx = authenticate(req, cfg);
  const headerToken = req.headers.get("x-maws-health-token");
  const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);

    if (isAuthFailure(ctx) && !tokenValid) {
      return ctx.response;
    }
  }

  try {
    const snapshot = metricsSnapshot();

    // Unrealized P&L across open positions (live + paper). Computed from
    // already-maintained in-memory state; no DB or network calls.
    const pnl = pnl24h();

    // Format for JSON response
    const response = {
      timestamp: Date.now(),
      uptime_seconds: Math.floor((Date.now() - snapshot.startTime) / 1000),
      pnl_24h: pnl,
      counters: snapshot.counters,
      gauges: snapshot.gauges,
      histograms: Object.entries(snapshot.histograms).reduce((acc, [key, hist]) => {
        acc[key] = {
          count: hist.count,
          sum: hist.sum,
          min: hist.min,
          max: hist.max,
          avg: hist.count > 0 ? hist.sum / hist.count : 0,
          p50: hist.p50,
          p95: hist.p95,
          p99: hist.p99,
        };
        return acc;
      }, {} as Record<string, unknown>),
      recent_events: snapshot.events.slice(-20),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Metrics error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to collect metrics",
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
