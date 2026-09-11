import { NextRequest, NextResponse } from "next/server";
import { buildAdminHealthStatus } from "@/lib/server/health/status";
import { metricsSnapshot } from "@/lib/server/metrics/collector";
import { serverConfig } from "@/lib/server/env/config";

import { authenticate, isAuthFailure } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

/**
 * GET /api/admin/health
 * Returns health status of all components.
 * In local mode: No authentication required.
 * In other modes: Requires operator authentication OR health token (via x-maws-health-token header).
 */
export async function GET(req: NextRequest) {
  const cfg = serverConfig();

  // Local mode is intentionally unauthenticated, but it still reports the
  // real manager, stream, database, and metrics state below.
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
    const health = buildAdminHealthStatus(cfg);
    return NextResponse.json({ ...health, metrics: metricsSnapshot() });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        overall: "down",
        error: error instanceof Error ? error.message : "Health check failed",
        lastUpdated: Date.now(),
      },
      { status: 500 }
    );
  }
}
