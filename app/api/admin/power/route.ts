import { NextRequest } from "next/server";
import {
  beginGracefulStop,
  callerForRequest,
  readDesiredState,
  writeDesiredState,
} from "@/lib/server/app-power";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { checkOriginAndHost } from "@/lib/server/auth/guard";
import { audit } from "@/lib/server/audit/log";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/power
 * Reports that the app is running (it always is when this responds) and the
 * desired state recorded for the supervisor. Local mode: no auth. Other
 * modes: operator session or supervisor token.
 */
export async function GET(req: NextRequest) {
  const cfg = serverConfig();
  const caller = callerForRequest(req);
  if (caller !== "supervisor" && cfg.env !== "local") {
    const ctx = authenticate(req, cfg);
    if (isAuthFailure(ctx)) return ctx.response;
  }
  return jsonOk({
    running: true,
    desired: readDesiredState().desired,
    timestamp: Date.now(),
  });
}

/**
 * POST /api/admin/power — stop the application.
 *
 * Operator call (session/CSRF, or anonymous in local mode with origin
 * binding): requires {"confirm":"STOP"}, writes desired=off for the
 * supervisor, audit-logs, then gracefully shuts down exactly like Ctrl+C
 * (stream-lease release + DB checkpoint).
 *
 * Supervisor call (x-maws-supervisor-token): only performs the graceful
 * teardown. It must NOT flip desired state or write operator audit rows —
 * the supervisor owns the desired-state file, and a Ctrl+C on the supervisor
 * is a normal restart, not a "stay stopped" request.
 */
export async function POST(req: NextRequest) {
  const cfg = serverConfig();
  const caller = callerForRequest(req);

  let body: { confirm?: unknown } | null = null;
  try {
    body = (await req.json()) as { confirm?: unknown };
  } catch {
    body = null;
  }
  const confirmed = body?.confirm === "STOP";

  if (caller === "supervisor") {
    if (!confirmed) {
      return jsonError(400, "confirm", "Missing confirmation");
    }
  } else {
    // Anonymous local operator calls still get origin/host binding so a
    // random website cannot CSRF the app into stopping.
    if (cfg.env !== "local") {
      const ctx = authenticate(req, cfg);
      if (isAuthFailure(ctx)) return ctx.response;
    } else {
      const origin = checkOriginAndHost(req, cfg);
      if (!origin.ok) return jsonError(403, origin.reason ?? "forbidden", "Request origin/host rejected");
    }
    if (!confirmed) {
      return jsonError(400, "confirm", 'Body must be {"confirm":"STOP"}');
    }
    writeDesiredState("off");
    audit("operator", "app.stop", { caller }, null);
  }

  // Let the response flush before teardown begins.
  setTimeout(() => beginGracefulStop(caller), 50).unref?.();

  return jsonOk({ ok: true, desired: readDesiredState().desired, message: "Stopping the application" });
}
