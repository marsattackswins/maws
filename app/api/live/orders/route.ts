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

interface SubmitBody {
  symbol?: unknown;
  side?: unknown;
  type?: unknown;
  qty?: unknown;
  price?: unknown;
  stopPrice?: unknown;
  reduceOnly?: unknown;
  clientOrderId?: unknown;
}

const VALID_SIDE = new Set(["BUY", "SELL"]);
const VALID_TYPE = new Set(["MARKET", "LIMIT", "STOP_MARKET"]);

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

    const body = await readJson<SubmitBody>(req);
    if (!body) return jsonError(400, "bad_request", "Invalid JSON body");
    const { symbol, side, type, qty, price, stopPrice, reduceOnly, clientOrderId } = body;
    if (typeof symbol !== "string" || symbol.length === 0 || !VALID_SIDE.has(String(side)) || !VALID_TYPE.has(String(type))) {
      return jsonError(400, "bad_request", "symbol, side (BUY|SELL) and type (MARKET|LIMIT|STOP_MARKET) are required");
    }
    if (typeof clientOrderId !== "string" || clientOrderId.length < 8 || clientOrderId.length > 36) {
      return jsonError(400, "bad_request", "clientOrderId (8-36 chars) is required for every submission");
    }
    logCtx.symbol = symbol;
    logCtx.clientOrderId = clientOrderId;
    const qtyStr = typeof qty === "string" ? qty : typeof qty === "number" ? String(qty) : "";

    const rate = checkRateLimit(symbol, LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER);
    if (!rate.allowed) {
      return rateLimitedResponse(rate.retryAfterSec, rate.limit, rate.remaining, rate.resetAt);
    }
    const start = performance.now();
    let result;
    try {
      result = await runBrokerMutation(
        () => {
          assertProfileMutationRequest(req);
          return getBroker().submitOrder({
          symbol,
          side: String(side) === "BUY" ? "buy" : "sell",
          type: String(type) === "MARKET" ? "market" : String(type) === "LIMIT" ? "limit" : "stopMarket",
          qty: qtyStr || undefined,
          price: typeof price === "string" ? price : undefined,
          stopPrice: typeof stopPrice === "string" ? stopPrice : undefined,
          reduceOnly: reduceOnly === true,
          clientOrderId,
        });
        },
        { symbol, clientOrderId },
      );
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) return jsonError(profileErrorStatus(error.code), error.code, "Profile runtime changed; retry the request");
      throw error;
    }
    const latencyMs = Math.round(performance.now() - start);
    observeLiveMutationLatency(symbol, LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER, latencyMs);
    recordRequest(symbol, LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER);
    if (result instanceof Response) return result;

    audit("operator", result.ok ? "order.ui.accepted" : "order.ui.rejected", { symbol, clientOrderId, error: result.error }, ctx.ip);
    if (!result.ok) {
      return jsonOk({ ...result }, { status: result.duplicate ? 409 : 422 });
    }
    return jsonOk(result);
  });
}
