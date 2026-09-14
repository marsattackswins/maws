import { audit } from "@/lib/server/audit/log";
import { getBroker } from "@/lib/server/broker/factory";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk, readJson } from "@/lib/server/http/guards";
import { runBrokerMutation } from "@/lib/server/response/broker-mutation";
import { withMutationLog } from "@/lib/server/log/request-log";
import { observeLiveMutationLatency, LIVE_MUTATION_OPERATIONS } from "@/lib/server/metrics/collector";
import { checkRateLimit, recordRequest, rateLimitedResponse } from "@/lib/server/rate-limit";
import { assertProfileRequest, ProfileCoordinatorError, profileErrorStatus } from "@/lib/server/profile/coordinator";

export const dynamic = "force-dynamic";

/** Explicit reduce-only market close; allowed while normal submissions are halted. */
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
      assertProfileRequest(req);
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
      throw error;
    }

    const body = await readJson<{ symbol?: unknown }>(req);
    if (!body || typeof body.symbol !== "string") {
      return jsonError(400, "bad_request", "symbol is required");
    }
    const { symbol } = body;
    logCtx.symbol = symbol;

    const rate = checkRateLimit(symbol, LIVE_MUTATION_OPERATIONS.CLOSE_POSITION);
    if (!rate.allowed) {
      return rateLimitedResponse(rate.retryAfterSec, rate.limit, rate.remaining, rate.resetAt);
    }
    const start = performance.now();
    let result;
    try {
      result = await runBrokerMutation(
        () => {
          assertProfileRequest(req);
          return getBroker().emergencyClosePosition(symbol);
        },
        { symbol },
      );
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
      throw error;
    }
    observeLiveMutationLatency(symbol, LIVE_MUTATION_OPERATIONS.CLOSE_POSITION, Math.round(performance.now() - start));
    recordRequest(symbol, LIVE_MUTATION_OPERATIONS.CLOSE_POSITION);
    if (result instanceof Response) return result;
    const response = result.status === "NO_POSITION"
      ? { ...result, ok: false, error: `No open position for ${symbol}` }
      : result;

    audit("operator", response.ok ? "position.ui.closed" : "position.ui.close_rejected", {
      symbol: body.symbol,
      error: response.error,
    }, ctx.ip);
    return jsonOk(response, { status: response.ok ? 200 : 422 });
  });
}
