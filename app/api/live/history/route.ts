import { recentIntents } from "@/lib/server/binance/intents";
import { getDb } from "@/lib/server/db/connection";
import { serverConfig } from "@/lib/server/env/config";
import { activeProfileConfig } from "@/lib/server/profile/coordinator";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

/** Server-side durable records: intents, fills, reconciliation runs. */
export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const ctx = authenticate(req, cfg);
  if (isAuthFailure(ctx)) return ctx.response;

  const profile = persistenceProfileFromConfig(activeProfileConfig());
  const url = new URL(req.url);
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit") ?? "50") || 50));

  const fills = getDb()
    .prepare(`SELECT ts, symbol, side, qty, price, realized_pnl, client_order_id, source FROM fills_log WHERE profile_id = ? ORDER BY id DESC LIMIT ?`)
    .all(profile.id, limit);
  const recons = getDb()
    .prepare(`SELECT started_at, finished_at, trigger, result, details FROM reconciliation_runs WHERE profile_id = ? ORDER BY id DESC LIMIT ?`)
    .all(profile.id, Math.min(20, limit));
  const auditTrail = getDb()
    .prepare(`SELECT ts, actor, action, detail, ip FROM audit_log WHERE profile_id = ? ORDER BY id DESC LIMIT ?`)
    .all(profile.id, limit);
  const shadow = getDb()
    .prepare(
      `SELECT id, ts, event_time, event_type, symbol, side, qty, price, realized_pnl, client_order_id, exchange_order_id
       FROM shadow_events WHERE profile_id = ? ORDER BY id DESC LIMIT ?`,
    )
    .all(profile.id, limit);

  return jsonOk({ intents: recentIntents(limit, profile), fills, recons, audit: auditTrail, shadow });
}
