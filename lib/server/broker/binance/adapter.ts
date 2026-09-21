import "server-only";

/**
 * Binance adapter implementing the broker interface.
 * Wraps BinanceLiveManager and normalizes types.
 */

import "server-only";

import type {
  IBroker,
  BrokerStatus,
  BrokerState,
  OrderParams,
  OrderResult,
  Order,
  Position,
  Account,
  Fill,
  ProtectPositionParams,
  ProtectPositionResult,
  SymbolInfo,
  SymbolConstraints,
  Price,
  BrokerEvent,
  RiskSnapshot,
  ReferencePrice,
} from "../interface";
import {
  BrokerError,
  BrokerOrderError,
  BrokerAuthError,
  BrokerTimeoutError,
  BrokerConfigError,
} from "../errors";
import { liveManager, type BinanceLiveManager, type ManagerStatus } from "../../binance/manager";
import { liveState, type LiveState, type LiveOrder, type LivePosition, type LiveAccount, type LiveFill } from "../../binance/state";
import { BinanceApiError, ERR_INVALID_API_KEY, TransportTimeoutError } from "../../binance/rest";
import type { EnvConfig } from "../../env/config";
import { serverConfig } from "../../env/config";
import { CircuitBreakerOpenError } from "../../resilience/circuit-breaker";

/**
 * Binance adapter: wraps BinanceLiveManager, normalizes types to broker interface.
 */
export class BinanceAdapter implements IBroker {
  private manager: BinanceLiveManager;
  private eventHandlers = new Map<BrokerEvent, Set<(data: unknown) => void>>();

  constructor(cfg?: EnvConfig, manager?: BinanceLiveManager) {
    const config = cfg ?? serverConfig();
    // The coordinator may inject the one authoritative manager while replacing
    // a stopped profile. Normal callers still resolve the process singleton.
    try {
      this.manager = manager ?? liveManager(config);
    } catch (err) {
      throw new BrokerError("Failed to initialize Binance adapter", "binance", err);
    }
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  async connect(): Promise<void> {
    try {
      await this.manager.ensureStarted();
    } catch (err) {
      if (err instanceof BinanceApiError && err.code === ERR_INVALID_API_KEY) {
        throw new BrokerAuthError("binance", err.exchangeMsg, err);
      }
      throw new BrokerError("Failed to connect to Binance", "binance", err);
    }
  }

  disconnect(): void {
    this.manager.stop();
  }

  getStatus(): BrokerStatus {
    return this.normalizeBrokerStatus(this.manager.status);
  }

  // ============================================================================
  // Orders
  // ============================================================================

  async submitOrder(params: OrderParams): Promise<OrderResult> {
    try {
      const binanceParams = this.normalizeToBinanceOrderParams(params);
      const result = await this.manager.orders.submitOrder(binanceParams);
      return result; // Already in OrderResult format
    } catch (err) {
      // Preserve identity: runBrokerMutation maps CircuitBreakerOpenError to
      // 503 circuit_open; wrapping it as BrokerError would surface a 500.
      if (err instanceof CircuitBreakerOpenError) throw err;
      if (err instanceof BinanceApiError) {
        throw new BrokerOrderError("binance", err.code, err.exchangeMsg, err);
      }
      if (err instanceof TransportTimeoutError) {
        throw new BrokerTimeoutError("binance", "submitOrder", err);
      }
      throw new BrokerError("Order submission failed", "binance", err);
    }
  }

  async cancelOrder(clientOrderId: string, symbol: string): Promise<OrderResult> {
    try {
      const result = await this.manager.orders.cancelOrder(clientOrderId, symbol);
      return result;
    } catch (err) {
      // Preserve identity: runBrokerMutation maps CircuitBreakerOpenError to
      // 503 circuit_open; wrapping it as BrokerError would surface a 500.
      if (err instanceof CircuitBreakerOpenError) throw err;
      if (err instanceof BinanceApiError) {
        throw new BrokerOrderError("binance", err.code, err.exchangeMsg, err);
      }
      if (err instanceof TransportTimeoutError) {
        throw new BrokerTimeoutError("binance", "cancelOrder", err);
      }
      throw new BrokerError("Order cancellation failed", "binance", err);
    }
  }

  async getOrder(symbol: string, clientOrderId: string): Promise<Order | null> {
    try {
      const binanceOrder = await this.manager.rest.getOrder(symbol, undefined, clientOrderId);
      if (!binanceOrder) return null;
      return this.normalizeOrder(binanceOrder);
    } catch (err) {
      // Preserve identity: runBrokerMutation maps CircuitBreakerOpenError to
      // 503 circuit_open; wrapping it as BrokerError would surface a 500.
      if (err instanceof CircuitBreakerOpenError) throw err;
      if (err instanceof BinanceApiError) {
        throw new BrokerOrderError("binance", err.code, err.exchangeMsg, err);
      }
      throw new BrokerError("Failed to fetch order", "binance", err);
    }
  }

  async closePosition(symbol: string): Promise<OrderResult> {
    try {
      const result = await this.manager.orders.closePosition(symbol);
      return result;
    } catch (err) {
      // Preserve identity: runBrokerMutation maps CircuitBreakerOpenError to
      // 503 circuit_open; wrapping it as BrokerError would surface a 500.
      if (err instanceof CircuitBreakerOpenError) throw err;
      if (err instanceof BinanceApiError) {
        throw new BrokerOrderError("binance", err.code, err.exchangeMsg, err);
      }
      throw new BrokerError("Failed to close position", "binance", err);
    }
  }

  async emergencyClosePosition(symbol: string): Promise<OrderResult> {
    try {
      return await this.manager.orders.emergencyClosePosition(symbol);
    } catch (err) {
      if (err instanceof BinanceApiError) {
        throw new BrokerOrderError("binance", err.code, err.exchangeMsg, err);
      }
      throw new BrokerError("Failed to emergency-close position", "binance", err);
    }
  }

  async emergencyFlatten(triggeredBy: string) {
    return this.manager.emergencyFlatten(triggeredBy);
  }

  async protectPosition(params: ProtectPositionParams): Promise<ProtectPositionResult> {
    try {
      const result = await this.manager.orders.protectPosition(params);
      return result;
    } catch (err) {
      // Preserve identity: runBrokerMutation maps CircuitBreakerOpenError to
      // 503 circuit_open; wrapping it as BrokerError would surface a 500.
      if (err instanceof CircuitBreakerOpenError) throw err;
      if (err instanceof BinanceApiError) {
        throw new BrokerOrderError("binance", err.code, err.exchangeMsg, err);
      }
      throw new BrokerError("Failed to set protective orders", "binance", err);
    }
  }

  // ============================================================================
  // Positions & Account
  // ============================================================================

  async getPositions(): Promise<Position[]> {
    try {
      const rows = await this.manager.rest.getPositionRisk();
      return rows
        .filter((r) => Number(r.positionAmt) !== 0)
        .map((r) => this.normalizePosition(r));
    } catch (err) {
      throw new BrokerError("Failed to fetch positions", "binance", err);
    }
  }

  async getAccount(): Promise<Account> {
    try {
      const account = await this.manager.rest.getAccount();
      return this.normalizeAccount(account);
    } catch (err) {
      throw new BrokerError("Failed to fetch account", "binance", err);
    }
  }

  // ============================================================================
  // Market Data
  // ============================================================================

  async getSymbolInfo(symbol: string): Promise<SymbolInfo | null> {
    const constraints = this.manager.metadata.getConstraints(symbol);
    if (!constraints) return null;
    return {
      symbol,
      constraints: this.normalizeConstraints(constraints),
    };
  }

  async getPrice(symbol: string): Promise<Price | null> {
    const ref = await this.manager.getReferencePrice(symbol);
    if (!ref) return null;
    return {
      price: ref.price,
      at: ref.at,
    };
  }

  // ============================================================================
  // Reconciliation
  // ============================================================================

  async snapshot(): Promise<void> {
    await this.manager.snapshot();
  }

  async reconcile(trigger: string): Promise<void> {
    await this.manager.reconcileRun(trigger);
  }

  // ============================================================================
  // State Access
  // ============================================================================

  getCurrentState(): BrokerState {
    const state = liveState();
    return this.normalizeLiveState(state);
  }

  // ============================================================================
  // Events
  // ============================================================================

  on(event: BrokerEvent, handler: (data: unknown) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  off(event: BrokerEvent, handler: (data: unknown) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  newClientOrderId(prefix: string): string {
    return this.manager.newClientOrderId(prefix);
  }

  // ============================================================================
  // Type Normalization (Binance → Broker)
  // ============================================================================

  private normalizeBrokerStatus(status: ManagerStatus): BrokerStatus {
    return status; // They already align: "idle" | "starting" | "ready" | "error"
  }

  private normalizeToBinanceOrderParams(params: OrderParams): any {
    return {
      symbol: params.symbol,
      side: params.side.toUpperCase() as "BUY" | "SELL",
      type: this.normalizeToBinanceOrderType(params.type),
      qty: params.qty,
      price: params.price,
      stopPrice: params.stopPrice,
      reduceOnly: params.reduceOnly,
      closePosition: params.closePosition,
      timeInForce: params.timeInForce,
      clientOrderId: params.clientOrderId,
      kind: params.kind,
      leverage: params.leverage,
    };
  }

  private normalizeToBinanceOrderType(type: string): string {
    const map: Record<string, string> = {
      market: "MARKET",
      limit: "LIMIT",
      stopMarket: "STOP_MARKET",
      takeProfitMarket: "TAKE_PROFIT_MARKET",
    };
    return map[type] ?? type.toUpperCase();
  }

  private normalizeOrder(binanceOrder: any): Order {
    return {
      clientOrderId: binanceOrder.clientOrderId,
      exchangeOrderId: binanceOrder.orderId,
      symbol: binanceOrder.symbol,
      side: binanceOrder.side === "BUY" ? "buy" : "sell",
      type: binanceOrder.type.toLowerCase(),
      status: binanceOrder.status,
      price: binanceOrder.price,
      stopPrice: binanceOrder.stopPrice ?? "0",
      origQty: binanceOrder.origQty,
      executedQty: binanceOrder.executedQty,
      avgPrice: binanceOrder.avgPrice ?? "0",
      reduceOnly: !!binanceOrder.reduceOnly,
      closePosition: !!binanceOrder.closePosition,
      time: binanceOrder.time,
      updateTime: binanceOrder.updateTime,
    };
  }

  private normalizePosition(row: any): Position {
    const amt = Number(row.positionAmt);
    const absQty = Math.abs(amt).toString();
    return {
      symbol: row.symbol,
      side: amt < 0 ? "short" : "long",
      qty: absQty,
      entryPrice: row.entryPrice,
      markPrice: row.markPrice,
      unrealizedProfit: row.unRealizedProfit,
      leverage: row.leverage,
      liquidationPrice: row.liquidationPrice,
      notional: row.notional ?? "",
      updatedAt: Date.now(),
    };
  }

  private normalizeAccount(account: any): Account {
    return {
      totalWalletBalance: account.totalWalletBalance,
      availableBalance: account.availableBalance,
      unrealizedProfit: account.totalUnrealizedProfit,
      marginBalance: account.totalMarginBalance,
      fetchedAt: Date.now(),
    };
  }

  private normalizeConstraints(constraints: any): SymbolConstraints {
    return {
      minPrice: constraints.minPrice,
      maxPrice: constraints.maxPrice,
      tickSize: constraints.tickSize,
      minQty: constraints.minQty,
      maxQty: constraints.maxQty,
      stepSize: constraints.stepSize,
      minNotional: constraints.minNotional,
    };
  }

  private normalizeLiveState(state: LiveState): BrokerState {
    const positions = new Map<string, Position>();
    for (const [symbol, pos] of state.positions) {
      positions.set(symbol, this.normalizeLivePosition(pos));
    }

    const openOrders = new Map<string, Order>();
    for (const [id, order] of state.openOrders) {
      openOrders.set(id, this.normalizeLiveOrder(order));
    }

    const orders = new Map<string, Order>();
    for (const [id, order] of state.orders) {
      orders.set(id, this.normalizeLiveOrder(order));
    }

    return {
      account: state.account ? this.normalizeLiveAccount(state.account) : null,
      positions,
      openOrders,
      orders,
      fills: state.fills.map((f) => this.normalizeLiveFill(f)),
      lastEventTime: state.lastEventTime,
      snapshotAt: state.snapshotAt,
    };
  }

  private normalizeLivePosition(pos: LivePosition): Position {
    return {
      symbol: pos.symbol,
      side: pos.side,
      qty: pos.qty,
      entryPrice: pos.entryPrice,
      markPrice: pos.markPrice,
      unrealizedProfit: pos.unrealizedProfit,
      leverage: pos.leverage,
      liquidationPrice: pos.liquidationPrice,
      notional: pos.notional,
      updatedAt: pos.updatedAt,
    };
  }

  private normalizeLiveOrder(order: LiveOrder): Order {
    return {
      clientOrderId: order.clientOrderId,
      exchangeOrderId: order.exchangeOrderId,
      symbol: order.symbol,
      side: order.side === "BUY" ? "buy" : "sell",
      type: order.type.toLowerCase(),
      status: order.status,
      price: order.price,
      stopPrice: order.stopPrice,
      origQty: order.origQty,
      executedQty: order.executedQty,
      avgPrice: order.avgPrice,
      reduceOnly: order.reduceOnly,
      closePosition: order.closePosition,
      time: order.time,
      updateTime: order.updateTime,
    };
  }

  private normalizeLiveAccount(account: LiveAccount): Account {
    return {
      totalWalletBalance: account.totalWalletBalance,
      availableBalance: account.availableBalance,
      unrealizedProfit: account.unrealizedProfit,
      marginBalance: account.marginBalance,
      fetchedAt: account.fetchedAt,
    };
  }

  private normalizeLiveFill(fill: LiveFill): Fill {
    return {
      ts: fill.ts,
      exchangeOrderId: fill.exchangeOrderId,
      clientOrderId: fill.clientOrderId,
      symbol: fill.symbol,
      side: fill.side === "BUY" ? "buy" : "sell",
      qty: fill.qty,
      price: fill.price,
      realizedPnl: fill.realizedPnl,
      source: fill.source,
    };
  }
}
