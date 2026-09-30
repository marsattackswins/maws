import { NextRequest, NextResponse } from "next/server";
import {
  installTerminalCapture,
  terminalLogsSnapshot,
} from "@/lib/server/log/terminal-capture";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/logs
 * Returns the most recent server terminal output (stdout/stderr) captured
 * in memory by the running process. Shown on /admin under "Terminal logs".
 * In local mode: No authentication required.
 * In other modes: Requires operator authentication OR health token
 * (via x-maws-health-token header).
 */
export async function GET(req: NextRequest) {
  // Defensive: instrumentation installs capture at startup, but if this
  // server was started by a path that skipped it, the first request turns
  // capture on so later lines still appear. Idempotent per process.
  installTerminalCapture();

  const cfg = serverConfig();

  if (cfg.env !== "local") {
    const ctx = authenticate(req, cfg);
    const headerToken = req.headers.get("x-maws-health-token");
    const tokenValid = compareSecretTokens(headerToken, cfg.healthToken);

    if (isAuthFailure(ctx) && !tokenValid) {
      return ctx.response;
    }
  }

  const parsed = Number.parseInt(req.nextUrl.searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(parsed) ? parsed : 200;

  return NextResponse.json(terminalLogsSnapshot(limit), {
    headers: { "cache-control": "no-store" },
  });
}
