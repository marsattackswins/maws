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

export async function POST(req: Request): Promise<Response> {
  return withMutationLog(req, async (logCtx) => {
    let cfg;
    try {
      cfg = serverConfig();
    } catch {
      return jsonError(503, "config", "Server configuration invalid");
    }
    const ctx = authenticate(req, cfg);
    if (isAuthFailure(ctx)) return ctx.response;
    try {
      assertProfileMutationRequest(req);
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
      throw error;
    }

    const body = await readJson<{ clientOrderId?: unknown; symbol?: unknown }>(req);
    if (!body || typeof body.clientOrderId !== "string" || typeof body.symbol !== "string") {
      return jsonError(400, "bad_request", "clientOrderId and symbol are required");
    }
    const { clientOrderId, symbol } = body;
    logCtx.symbol = symbol;
    logCtx.clientOrderId = clientOrderId;

    const rate = checkRateLimit(symbol, LIVE_MUTATION_OPERATIONS.CANCEL_ORDER);
    if (!rate.allowed) {
      return rateLimitedResponse(rate.retryAfterSec, rate.limit, rate.remaining, rate.resetAt);
    }
    const start = performance.now();
    let result;
    try {
      result = await runBrokerMutation(
        () => {
          assertProfileMutationRequest(req);
          return getBroker().cancelOrder(clientOrderId, symbol);
        },
        { symbol, clientOrderId },
      );
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
      throw error;
    }
    observeLiveMutationLatency(symbol, LIVE_MUTATION_OPERATIONS.CANCEL_ORDER, Math.round(performance.now() - start));
    recordRequest(symbol, LIVE_MUTATION_OPERATIONS.CANCEL_ORDER);
    if (result instanceof Response) return result;

    audit("operator", result.ok ? "order.ui.cancelled" : "order.ui.cancel_rejected", {
      symbol: body.symbol,
      clientOrderId: body.clientOrderId,
      error: result.error,
    }, ctx.ip);
    return jsonOk(result, { status: result.ok ? 200 : 422 });
  });
}
