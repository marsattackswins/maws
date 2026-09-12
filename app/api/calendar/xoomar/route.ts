import { resolveOperatorSession } from "@/lib/server/auth/session-guard";
import { serverConfig } from "@/lib/server/env/config";
import type { NextRequest } from "next/server";

import { validateCalendarRange } from "@/lib/server/validation/calendar";
import { mapUpstreamError, upstreamErrorResponse } from "@/lib/server/validation/proxy-error";

export const dynamic = "force-dynamic";

const XOOMAR_CALENDAR = "https://xoomar.com/api/markets/calendar";

/**
 * Proxy free Xoomar US macro calendar (BLS / Fed / BEA).
 * GET /api/calendar/xoomar?from=YYYY-MM-DD&to=YYYY-MM-DD
 * No API key required.
 */
export async function GET(req: NextRequest) {
  // Load server config (fail closed on error)
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return Response.json(
      { error: "Service unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Require operator session outside local mode
  if (cfg.env !== "local") {
    const session = resolveOperatorSession(req.headers.get("cookie"), cfg);
    if (!session) {
      return Response.json(
        { error: { code: "unauthenticated", message: "Sign in required" } },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  const sp = req.nextUrl.searchParams;
  const from = sp.get("from");
  const to = sp.get("to");

  if (!validateCalendarRange(from, to, Date.now())) {
    return Response.json(
      { error: "Invalid date range" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Xoomar's calendar endpoint does not document from/to query parameters.
  // Fetch the current calendar snapshot and let MAWS apply the validated
  // requested window in lib/calendar.ts.
  const url = new URL(XOOMAR_CALENDAR);

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      // Cache a bit — schedule doesn't change every second.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return mapUpstreamError(res.status);
    }
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "X-MAWS-Calendar": "xoomar",
      },
    });
  } catch {
    return upstreamErrorResponse();
  }
}
