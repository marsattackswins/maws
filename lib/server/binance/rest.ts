import "server-only";

import { HOST_MAP, type EnvConfig } from "../env/config";
import { log } from "../log/logger";
import { getTimestamp } from "./clock";
import { RateLimiter } from "./ratelimit";
import { signedQuery, buildQueryString } from "./sign";
import { brokerClients, type HttpTransport, TransportTimeoutError } from "./transport";
import { getBinanceRestBreaker } from "../resilience/breakers";
import { CircuitBreakerOpenError } from "../resilience/circuit-breaker";
import type {
  AccountResponse,
  BinanceOrder,
  ExchangeInfo,
  LeverageBracketRow,
  ListenKeyResponse,
  PositionRiskRow,
  PositionModeResponse,
  ServerTime,
  TickerPrice,
} from "./types";

// Re-export TransportTimeoutError so it's available to consumers
export { TransportTimeoutError } from "./transport";

export class BinanceApiError extends Error {
  constructor(
    public readonly code: number,
    public readonly exchangeMsg: string,
    public readonly httpStatus: number,
    public readonly path: string,
  ) {
    super(`Binance ${path}: [${code}] ${exchangeMsg}`);
    this.name = "BinanceApiError";
  }
}

export const ERR_TIMESTAMP = -1021;
export const ERR_UNKNOWN_ORDER = -2013;
export const ERR_UNKNOWN_CANCEL = -2011;
export const ERR_INVALID_API_KEY = -2015;
export const ERR_LISTEN_KEY = -1125;
export const ERR_REDUCE_ONLY_REJECT = -2022;

export type BinanceErrorCertainty = "definite_rejection" | "unknown_outcome" | "not_an_api_error";

/** HTTP 5xx responses to mutations do not prove that Binance rejected them. */
export function classifyBinanceError(err: unknown): BinanceErrorCertainty {
  if (!(err instanceof BinanceApiError)) return "not_an_api_error";
  return err.httpStatus >= 500 ? "unknown_outcome" : "definite_rejection";
}

export interface PlaceOrderParams {
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  quantity?: string;
  price?: string;
  stopPrice?: string;
  closePosition?: boolean;
  reduceOnly?: boolean;
  timeInForce?: string;
  clientOrderId?: string;
}

export class BinanceRestClient {
  private http: HttpTransport;
  private timeoutMs = 10_000;

  constructor(
    private readonly cfg: EnvConfig,
    private readonly limiter: RateLimiter,
    /** Invoked after a -1021 to resync before retrying once. */
    private readonly resyncClock: () => Promise<void>,
  ) {
    this.http = brokerClients().http;
  }

  setTransportForTests(http: HttpTransport): void {
    this.http = http;
  }

  setTimeoutMs(ms: number): void {
    this.timeoutMs = ms;
  }

  private host(): string {
    const h = HOST_MAP[this.cfg.env];
    if (!h.rest) throw new Error(`No Binance REST host for MAWS_ENV=${this.cfg.env}`);
    return h.rest;
  }

  private async raw(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    query: string,
    headers: Record<string, string>,
    bypassBreaker = false,
  ): Promise<unknown> {
    const operation = async () => {
      await this.limiter.acquire();
      const url = `${this.host()}${path}${query ? `?${query}` : ""}`;
      let res;
      try {
        res = await this.http.request({ method, url, headers, timeoutMs: this.timeoutMs });
      } catch (err) {
        if (err instanceof TransportTimeoutError) throw err;
        throw err;
      }
      this.limiter.observe(res.headers);
      let parsed: unknown;
      try {
        parsed = res.body.length > 0 ? JSON.parse(res.body) : {};
      } catch {
        throw new BinanceApiError(-1000, `Unparseable response from ${path}`, res.status, path);
      }
      if (res.status >= 400 || (parsed && typeof parsed === "object" && "code" in (parsed as object) && "msg" in (parsed as object) && res.status !== 200)) {
        const p = parsed as { code?: number; msg?: string };
        throw new BinanceApiError(p.code ?? -1000, p.msg ?? `HTTP ${res.status}`, res.status, path);
      }
      return parsed;
    };
    if (bypassBreaker) return operation();
    return getBinanceRestBreaker().execute(operation);
  }

  private async signedRequest<T>(
    method: "GET" | "POST" | "DELETE",
    path: string,
    params: Record<string, string | number> = {},
    retriedAfterResync = false,
    bypassBreaker = false,
  ): Promise<T> {
    if (!this.cfg.binanceApiKey || !this.cfg.binanceApiSecret) {
      throw new Error("Binance credentials are not configured");
    }
    const query = signedQuery(params, this.cfg.binanceApiSecret, getTimestamp(), this.cfg.recvWindowMs);
    try {
      return (await this.raw(method, path, query, { "X-MBX-APIKEY": this.cfg.binanceApiKey }, bypassBreaker)) as T;
    } catch (err) {
      if (err instanceof BinanceApiError && err.code === ERR_TIMESTAMP && !retriedAfterResync) {
        log.warn("timestamp rejected (-1021); resyncing clock and retrying once", { path });
        await this.resyncClock();
        return this.signedRequest<T>(method, path, params, true, bypassBreaker);
      }
      throw err;
    }
  }

  private async keyOnly<T>(method: "POST" | "PUT" | "DELETE", path: string, params: Record<string, string | number> = {}): Promise<T> {
    if (!this.cfg.binanceApiKey) throw new Error("Binance credentials are not configured");
    const query = buildQueryString(params);
    return (await this.raw(method, path, query, { "X-MBX-APIKEY": this.cfg.binanceApiKey })) as T;
  }

  // ---------------- public ----------------

  getTime(): Promise<ServerTime> {
    return this.raw("GET", "/fapi/v1/time", "", {}) as Promise<ServerTime>;
  }

  getExchangeInfo(): Promise<ExchangeInfo> {
    return this.raw("GET", "/fapi/v1/exchangeInfo", "", {}) as Promise<ExchangeInfo>;
  }

  getTickerPrice(symbol: string): Promise<TickerPrice> {
    return this.raw("GET", "/fapi/v1/ticker/price", buildQueryString({ symbol }), {}) as Promise<TickerPrice>;
  }

  // ---------------- signed read ----------------

  getAccount(): Promise<AccountResponse> {
    return this.signedRequest<AccountResponse>("GET", "/fapi/v2/account");
  }

  getPositionRisk(symbol?: string): Promise<PositionRiskRow[]> {
    return this.signedRequest<PositionRiskRow[]>("GET", "/fapi/v2/positionRisk", symbol ? { symbol } : {});
  }

  /** Emergency path: deliberately bypasses the normal REST breaker. */
  getPositionRiskEmergency(symbol?: string): Promise<PositionRiskRow[]> {
    return this.signedRequest<PositionRiskRow[]>("GET", "/fapi/v2/positionRisk", symbol ? { symbol } : {}, false, true);
  }

  /** Emergency path: deliberately bypasses the normal REST breaker. */
  getOpenOrdersEmergency(symbol?: string): Promise<BinanceOrder[]> {
    return this.signedRequest<BinanceOrder[]>("GET", "/fapi/v1/openOrders", symbol ? { symbol } : {}, false, true);
  }

  getOpenOrders(symbol?: string): Promise<BinanceOrder[]> {
    return this.signedRequest<BinanceOrder[]>("GET", "/fapi/v1/openOrders", symbol ? { symbol } : {});
  }

  /** Returns null when the exchange reports the order does not exist (-2013). */
  async getOrder(symbol: string, orderId?: number, origClientOrderId?: string): Promise<BinanceOrder | null> {
    try {
      return await this.signedRequest<BinanceOrder>("GET", "/fapi/v1/order", {
        symbol,
        ...(orderId != null ? { orderId } : {}),
        ...(origClientOrderId ? { origClientOrderId } : {}),
      });
    } catch (err) {
      if (err instanceof BinanceApiError && err.code === ERR_UNKNOWN_ORDER) return null;
      throw err;
    }
  }

  getUserTrades(
    symbol: string,
    limitOrOptions: number | { limit?: number; startTime?: number; endTime?: number; fromId?: number } = 100,
  ): Promise<Array<{ id: number; orderId: number; price: string; qty: string; realizedPnl: string; commission: string; commissionAsset: string; time: number; side: string }>> {
    const options = typeof limitOrOptions === "number" ? { limit: limitOrOptions } : limitOrOptions;
    return this.signedRequest("GET", "/fapi/v1/userTrades", {
      symbol,
      limit: options.limit ?? 100,
      ...(options.startTime != null ? { startTime: options.startTime } : {}),
      ...(options.endTime != null ? { endTime: options.endTime } : {}),
      ...(options.fromId != null ? { fromId: options.fromId } : {}),
    });
  }

  getLeverageBrackets(symbol?: string): Promise<LeverageBracketRow[]> {
    return this.signedRequest<LeverageBracketRow[]>("GET", "/fapi/v1/leverageBracket", symbol ? { symbol } : {});
  }

  /** Returns the account position mode; false is Binance one-way mode. */
  getPositionMode(): Promise<PositionModeResponse> {
    return this.signedRequest<PositionModeResponse>("GET", "/fapi/v1/positionSide/dual");
  }

  // ---------------- trade ----------------

  placeOrder(params: PlaceOrderParams): Promise<BinanceOrder> {
    return this.placeOrderInternal(params, false);
  }

  /** Emergency path: deliberate bypass of normal submission breaker. */
  placeOrderEmergency(params: PlaceOrderParams): Promise<BinanceOrder> {
    return this.placeOrderInternal(params, true);
  }

  private placeOrderInternal(params: PlaceOrderParams, bypassBreaker: boolean): Promise<BinanceOrder> {
    const p: Record<string, string | number> = { symbol: params.symbol, side: params.side, type: params.type };
    if (params.quantity != null) p.quantity = params.quantity;
    if (params.price != null) p.price = params.price;
    if (params.stopPrice != null) p.stopPrice = params.stopPrice;
    if (params.closePosition) p.closePosition = "true";
    if (params.reduceOnly) p.reduceOnly = "true";
    if (params.timeInForce) p.timeInForce = params.timeInForce;
    if (params.clientOrderId) p.newClientOrderId = params.clientOrderId;
    return this.signedRequest<BinanceOrder>("POST", "/fapi/v1/order", p, false, bypassBreaker);
  }

  cancelOrder(symbol: string, orderId?: number, origClientOrderId?: string): Promise<BinanceOrder> {
    return this.signedRequest<BinanceOrder>("DELETE", "/fapi/v1/order", {
      symbol,
      ...(orderId != null ? { orderId } : {}),
      ...(origClientOrderId ? { origClientOrderId } : {}),
    });
  }

  /** Emergency bulk cancellation, intentionally outside the normal breaker. */
  cancelAllOpenOrdersEmergency(symbol: string): Promise<BinanceOrder[]> {
    return this.signedRequest<BinanceOrder[]>("DELETE", "/fapi/v1/allOpenOrders", { symbol }, false, true);
  }

  // ---------------- user data stream ----------------

  createListenKey(): Promise<ListenKeyResponse> {
    return this.keyOnly<ListenKeyResponse>("POST", "/fapi/v1/listenKey");
  }

  keepaliveListenKey(listenKey: string): Promise<unknown> {
    return this.keyOnly("PUT", "/fapi/v1/listenKey", { listenKey });
  }

  closeListenKey(listenKey: string): Promise<unknown> {
    return this.keyOnly("DELETE", "/fapi/v1/listenKey", { listenKey });
  }
}
