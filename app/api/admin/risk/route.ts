import { NextRequest, NextResponse } from "next/server";
import { accountDto, ordersDto, positionsDto } from "@/lib/server/binance/dto";
import { realizedSinceUtcMidnight } from "@/lib/server/binance/risk";
import { aggregateRiskCockpit } from "@/lib/server/risk/cockpit";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/risk
 * Returns a read-only risk and exposure snapshot from server-owned live state.
 * Local mode intentionally returns configured limits without trading state.
 */
export async function GET(req: NextRequest) {
  const cfg = serverConfig();

  if (cfg.env !== "local") {
    const ctx = authenticate(req, cfg);
    const headerToken = req.headers.get("x-maws-health-token");
    const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);
    if (isAuthFailure(ctx) && !tokenValid) return ctx.response;
  }

  try {
    const sourceAvailable = cfg.env !== "local";
    const snapshot = aggregateRiskCockpit({
      env: cfg.env,
      risk: cfg.risk,
      account: sourceAvailable ? accountDto() : null,
      positions: sourceAvailable ? positionsDto() : [],
      orders: sourceAvailable ? ordersDto() : [],
      realizedTodayUsd: sourceAvailable ? realizedSinceUtcMidnight() : 0,
      sourceAvailable,
    });

    return NextResponse.json(snapshot, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("Risk cockpit error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to collect risk snapshot",
        timestamp: Date.now(),
      },
      { status: 500 },
    );
  }
}
