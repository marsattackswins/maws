import { accountDto, accountMetricsDto, fillsDto, ordersDto, positionsDto } from "@/lib/server/binance/dto";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure, jsonError, jsonOk } from "@/lib/server/http/guards";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  let cfg;
  try {
    cfg = serverConfig();
  } catch {
    return jsonError(503, "config", "Server configuration invalid");
  }
  const ctx = authenticate(req, cfg, { allowLocal: true });
  if (isAuthFailure(ctx)) return ctx.response;
  return jsonOk({
    account: accountDto(),
    accountMetrics: accountMetricsDto(),
    positions: positionsDto(),
    orders: ordersDto(),
    fills: fillsDto(50),
  });
}
