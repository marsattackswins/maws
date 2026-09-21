import "server-only";

/** Raw Binance USD-M Futures payload types (subset MAWS relies on). */

export interface ExchangeFilter {
  filterType: string;
  tickSize?: string;
  minPrice?: string;
  maxPrice?: string;
  stepSize?: string;
  minQty?: string;
  maxQty?: string;
  notional?: string;
  minNotional?: string;
  limit?: number;
  maxNumOrders?: number;
  maxNumAlgoOrders?: number;
}

export interface ExchangeSymbolInfo {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  filters: ExchangeFilter[];
}

export interface ExchangeInfo {
  symbols: ExchangeSymbolInfo[];
}

export interface ServerTime {
  serverTime: number;
}

export interface PositionModeResponse {
  dualSidePosition: boolean;
}

export interface TickerPrice {
  symbol: string;
  price: string;
}

/** Premium-index row: mark price + time (used for live PnL refreshes). */
export interface MarkPriceResponse {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  time: number;
}

export interface AccountAsset {
  asset: string;
  walletBalance: string;
  unrealizedProfit: string;
  availableBalance: string;
  marginBalance: string;
}

export interface AccountResponse {
  totalWalletBalance: string;
  totalUnrealizedProfit: string;
  totalMarginBalance: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  assets: AccountAsset[];
}

export interface PositionRiskRow {
  symbol: string;
  positionAmt: string;
  entryPrice: string;
  markPrice: string;
  unRealizedProfit: string;
  liquidationPrice: string;
  leverage: string;
  positionSide: string;
  notional?: string;
  marginType?: string;
  isolatedMargin?: string;
  isolatedWallet?: string;
}

export interface BinanceOrder {
  orderId: number;
  clientOrderId: string;
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  status: string;
  price: string;
  stopPrice?: string;
  origQty: string;
  executedQty: string;
  cumQuote?: string;
  avgPrice?: string;
  reduceOnly?: boolean;
  closePosition?: boolean;
  updateTime: number;
  time: number;
}

export interface ListenKeyResponse {
  listenKey: string;
}

export interface LeverageBracketRow {
  symbol: string;
  brackets: Array<{
    bracket: number;
    initialLeverage: number;
    notionalCap: string;
    notionalFloor: string;
    maintMarginRatio: string;
  }>;
}

/** ORDER_TRADE_UPDATE event (redaction-safe subset). */
export interface OrderTradeUpdateEvent {
  e: "ORDER_TRADE_UPDATE";
  E: number;
  T: number;
  o: {
    s: string;
    c: string;
    S: "BUY" | "SELL";
    o: string;
    f: string;
    q: string;
    p: string;
    sp?: string;
    i: number;
    /** Binance execution/trade id. Older test fixtures may omit it. */
    t?: number;
    X: string;
    l: string;
    z: string;
    L: string;
    rp: string;
    T: number;
  };
}

/** ACCOUNT_UPDATE event (redaction-safe subset). */
export interface AccountUpdateEvent {
  e: "ACCOUNT_UPDATE";
  E: number;
  T: number;
  a: {
    B: Array<{ a: string; wb: string; cw: string; bc: string }>;
    P: Array<{
      s: string;
      pa: string;
      ep: string;
      cr: string;
      up: string;
      mt: string;
      iw: string;
      ps: string;
    }>;
  };
}

export type UserStreamEvent = OrderTradeUpdateEvent | AccountUpdateEvent | { e: string; E?: number };

export const TERMINAL_ORDER_STATUSES = new Set([
  "FILLED",
  "CANCELED",
  "EXPIRED",
  "REJECTED",
]);

export function isTerminalStatus(status: string): boolean {
  return TERMINAL_ORDER_STATUSES.has(status);
}
