import { audit } from "@/lib/server/audit/log";
import { getBroker } from "@/lib/server/broker/factory";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk, readJson } from "@/lib/server/http/guards";
import { runBrokerMutation } from "@/lib/server/response/broker-mutation";
import { withMutationLog } from "@/lib/server/log/request-log";
import { observeLiveMutationLatency, LIVE_MUTATION_OPERATIONS } from "@/lib/server/metrics/collector";
import { checkRateLimit, recordRequest, rateLimitedResponse } from "@/lib/server/rate-limit";
import { assertProfileMutationRequest, ProfileCoordinatorError, profileErrorStatus } from "@/lib/server/profile/coordinator";

export const dynamic = "force-dynamic";

/**
 * Native protective orders (TP/SL). Creates genuine exchange conditional
 * orders (TAKE_PROFIT_MARKET / STOP_MARKET with closePosition=true);
 * protective orders are never simulated in the browser.
 */
export async function POST(req: Request): Promise<Response> {
  return withMutationLog(req, async (logCtx) => {
    let cfg;
    try {
      cfg = serverConfig();
    } catch {
      return jsonError(503, "config", "Server configuration invalid");
    }
    const ctx = authenticate(req, cfg, { allowLocal: true });
    if (isAuthFailure(ctx)) return ctx.response;
    try {
      assertProfileMutationRequest(req);
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
      throw error;
    }

    const body = await readJson<{ symbol?: unknown; tpPrice?: unknown; slPrice?: unknown }>(req);
    if (!body || typeof body.symbol !== "string") {
      return jsonError(400, "bad_request", "symbol is required");
    }
    const { symbol } = body;
    logCtx.symbol = symbol;
    const tpPrice = typeof body.tpPrice === "string" ? body.tpPrice : undefined;
    const slPrice = typeof body.slPrice === "string" ? body.slPrice : undefined;
    if (!tpPrice && !slPrice) {
      return jsonError(400, "bad_request", "tpPrice and/or slPrice required");
    }

    const rate = checkRateLimit(symbol, LIVE_MUTATION_OPERATIONS.PROTECT_POSITION);
    if (!rate.allowed) {
      return rateLimitedResponse(rate.retryAfterSec, rate.limit, rate.remaining, rate.resetAt);
    }
    const start = performance.now();
    let result;
    try {
      result = await runBrokerMutation(
        () => {
          assertProfileMutationRequest(req);
          return getBroker().protectPosition({ symbol, tpPrice, slPrice });
        },
        { symbol },
      );
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
      throw error;
    }
    observeLiveMutationLatency(symbol, LIVE_MUTATION_OPERATIONS.PROTECT_POSITION, Math.round(performance.now() - start));
    recordRequest(symbol, LIVE_MUTATION_OPERATIONS.PROTECT_POSITION);
    if (result instanceof Response) return result;

    audit("operator", "position.ui.protect", { symbol: body.symbol, tpPrice, slPrice }, ctx.ip);
    const failed = (result.tp && !result.tp.ok) || (result.sl && !result.sl.ok);
    return jsonOk(result, { status: failed ? 422 : 200 });
  });
}
