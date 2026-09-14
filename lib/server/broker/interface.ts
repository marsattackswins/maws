import "server-only";

import type { EmergencyFlattenSummary } from "../binance/emergency";

/**
 * Broker-agnostic interface for trading operations.
 * All brokers (Binance, Bybit, OKX, etc.) implement this interface.
 *
 * Design principles:
 * - Normalized types: "buy"/"sell" not "BUY"/"SELL", "market" not "MARKET"
 * - Event-driven updates: subscribe to state changes rather than polling
 * - Async initialization: connect() establishes streams and loads metadata
 * - Stateless operations: broker doesn't manage application state
 */

// ============================================================================
// Core Broker Interface
// ============================================================================

export interface IBroker {
  // Lifecycle
  connect(): Promise<void>;
  disconnect(): void;
  getStatus(): BrokerStatus;

  // Orders
  submitOrder(params: OrderParams): Promise<OrderResult>;
  cancelOrder(clientOrderId: string, symbol: string): Promise<OrderResult>;
  getOrder(symbol: string, clientOrderId: string): Promise<Order | null>;
  /** Explicit reduce-only close; allowed when normal submissions are halted. */
  closePosition(symbol: string): Promise<OrderResult>;
  emergencyClosePosition(symbol: string): Promise<OrderResult>;
  emergencyFlatten(triggeredBy: string): Promise<EmergencyFlattenSummary>;
  protectPosition(params: ProtectPositionParams): Promise<ProtectPositionResult>;

  // Positions & Account
  getPositions(): Promise<Position[]>;
  getAccount(): Promise<Account>;

  // Market Data
  getSymbolInfo(symbol: string): Promise<SymbolInfo | null>;
  getPrice(symbol: string): Promise<Price | null>;

  // Reconciliation
  snapshot(): Promise<void>;
  reconcile(trigger: string): Promise<void>;

  // State Access (read-only snapshot)
  getCurrentState(): BrokerState;

  // Events (push model)
  on(event: BrokerEvent, handler: (data: unknown) => void): void;
  off(event: BrokerEvent, handler: (data: unknown) => void): void;

  // Utilities
  newClientOrderId(prefix: string): string;
}

// ============================================================================
// Status & State
// ============================================================================

export type BrokerStatus = "idle" | "starting" | "ready" | "error";

export interface BrokerState {
  account: Account | null;
  positions: Map<string, Position>;
  openOrders: Map<string, Order>;
  orders: Map<string, Order>;
  fills: Fill[];
  lastEventTime: number | null;
  snapshotAt: number | null;
}

// ============================================================================
// Order Types
// ============================================================================

export interface OrderParams {
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit" | "stopMarket" | "takeProfitMarket";
  qty?: string;
  price?: string;
  stopPrice?: string;
  reduceOnly?: boolean;
  closePosition?: boolean;
  timeInForce?: string;
  clientOrderId?: string;
  kind?: "order" | "algo";
}

export interface OrderResult {
  ok: boolean;
  clientOrderId: string;
  status?: string;
  exchangeOrderId?: number | null;
  error?: string;
  duplicate?: boolean;
}

export interface Order {
  clientOrderId: string;
  exchangeOrderId: number | null;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  status: string;
  price: string;
  stopPrice: string;
  origQty: string;
  executedQty: string;
  avgPrice: string;
  reduceOnly: boolean;
  closePosition: boolean;
  time: number;
  updateTime: number;
}

export interface ProtectPositionParams {
  symbol: string;
  tpPrice?: string;
  slPrice?: string;
}

export interface ProtectPositionResult {
  tp?: OrderResult;
  sl?: OrderResult;
}

// ============================================================================
// Position & Account Types
// ============================================================================

export interface Position {
  symbol: string;
  side: "long" | "short";
  qty: string;
  entryPrice: string;
  markPrice: string;
  unrealizedProfit: string;
  leverage: string;
  liquidationPrice: string;
  notional: string;
  updatedAt: number;
}

export interface Account {
  totalWalletBalance: string;
  availableBalance: string;
  unrealizedProfit: string;
  marginBalance: string;
  fetchedAt: number;
}

export interface Fill {
  ts: number;
  exchangeOrderId: number | null;
  clientOrderId: string;
  symbol: string;
  side: "buy" | "sell";
  qty: string;
  price: string;
  realizedPnl: string;
  source: "stream" | "rest";
}

// ============================================================================
// Market Data Types
// ============================================================================

export interface Price {
  price: string;
  at: number;
}

export interface SymbolInfo {
  symbol: string;
  constraints: SymbolConstraints;
}

export interface SymbolConstraints {
  minPrice: string;
  maxPrice: string;
  tickSize: string;
  minQty: string;
  maxQty: string;
  stepSize: string;
  minNotional: string;
}

// ============================================================================
// Event Types
// ============================================================================

export type BrokerEvent =
  | "order-update"
  | "account-update"
  | "snapshot"
  | "fills"
  | "stream-status"
  | "health";

export interface OrderUpdateEvent {
  clientOrderId: string;
  status: string;
  symbol: string;
  fills?: Fill[];
  resolved?: boolean;
  error?: string;
}

export interface AccountUpdateEvent {
  at: number;
}

export interface SnapshotEvent {
  at: number;
}

export interface StreamStatusEvent {
  connected: boolean;
  phase: string;
  reconnects: number;
}

export interface HealthEvent {
  frozen?: boolean;
  reason?: string;
}

// ============================================================================
// Risk Snapshot (for validation)
// ============================================================================

export interface RiskSnapshot {
  balanceUsd: number;
  grossExposureUsd: number;
  openOrderCount: number;
  openPositionCount: number;
  realizedTodayUsd: number;
}

// ============================================================================
// Reference Price (for validation)
// ============================================================================

export interface ReferencePrice {
  price: string;
  at: number;
}
