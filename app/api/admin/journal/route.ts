import { getDb } from "@/lib/server/db/connection";
import { serverConfig } from "@/lib/server/env/config";
import { activeProfileConfig } from "@/lib/server/profile/coordinator";
import { persistenceProfileFromConfig } from "@/lib/server/profile/context";
import { aggregateLiveJournal, type LiveJournalFillRow } from "@/lib/server/trading/journal-live";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";
import { compareSecretTokens } from "@/lib/server/auth/token";

export const dynamic = "force-dynamic";

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
    const url = new URL(req.url);
    const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? "200") || 200));
    const symbol = url.searchParams.get("symbol")?.trim() || null;
    const from = parseTimestamp(url.searchParams.get("from"));
    const to = parseTimestamp(url.searchParams.get("to"));
    const conditions = ["1 = 1"];
    const params: Array<string | number> = [profile.id];
    if (symbol) {
      conditions.push("f.symbol = ?");
      params.push(symbol);
    }
    if (from != null) {
      conditions.push("f.ts >= ?");
      params.push(from);
    }
    if (to != null) {
      conditions.push("f.ts <= ?");
      params.push(to);
    }
    params.push(limit);

    const fills = getDb()
      .prepare(
        `SELECT f.id, f.ts, f.symbol, f.side, f.qty, f.price, f.realized_pnl,
                f.client_order_id, f.exchange_order_id, f.source
         FROM fills_log f
         WHERE f.profile_id = ? AND ${conditions.join(" AND ")}
         ORDER BY f.id DESC
         LIMIT ?`,
      )
      .all(...params) as LiveJournalFillRow[];
    const result = aggregateLiveJournal({ fills });

    return jsonOk({
      timestamp: Date.now(),
      env: runtimeCfg.env,
      source: "live",
      ...result,
    });
  } catch (error) {
    console.error("Journal error:", error);
    return jsonError(500, "journal", error instanceof Error ? error.message : "Failed to collect live journal");
  }
}

function parseTimestamp(value: string | null): number | null {
  if (!value) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
