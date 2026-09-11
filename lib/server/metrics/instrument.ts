import "server-only";

/**
 * Instrumentation hooks for metrics collection.
 * These functions should be called from existing code to track metrics.
 */

import {
  incrementCounter,
  setGauge,
  observeHistogram,
  recordEvent,
  METRICS,
  EVENT_TYPES,
} from "./collector";
import { liveState, grossExposureUsd, balanceUsd, openPositionCount } from "../binance/state";

// ============================================================================
// ORDER METRICS
// ============================================================================

export function trackOrderSubmitted(clientOrderId: string, symbol: string, side: string, type: string): void {
  incrementCounter(METRICS.ORDER_SUBMITTED);
  recordEvent(EVENT_TYPES.ORDER, `Order submitted: ${symbol} ${side} ${type}`, {
    clientOrderId,
    symbol,
    side,
    type,
  });
}

export function trackOrderFilled(clientOrderId: string, symbol: string, qty: string, avgPrice: string): void {
  incrementCounter(METRICS.ORDER_FILLED);
  recordEvent(EVENT_TYPES.FILL, `Order filled: ${symbol} ${qty} @ ${avgPrice}`, {
    clientOrderId,
    symbol,
    qty,
    avgPrice,
  });
}

export function trackOrderCanceled(clientOrderId: string, symbol: string): void {
  incrementCounter(METRICS.ORDER_CANCELED);
  recordEvent(EVENT_TYPES.ORDER, `Order canceled: ${symbol}`, { clientOrderId, symbol });
}

export function trackOrderRejected(clientOrderId: string, symbol: string, reason: string): void {
  incrementCounter(METRICS.ORDER_REJECTED);
  recordEvent(EVENT_TYPES.ORDER, `Order rejected: ${symbol} - ${reason}`, {
    clientOrderId,
    symbol,
    reason,
  });
}

export function trackOrderSubmissionDuration(durationMs: number): void {
  observeHistogram(METRICS.ORDER_SUBMISSION_DURATION_MS, durationMs);
}

// ============================================================================
// FILL METRICS
// ============================================================================

export function trackFillReceived(
  clientOrderId: string,
  symbol: string,
  side: string,
  qty: string,
  price: string
): void {
  incrementCounter(METRICS.FILL_RECEIVED);
  recordEvent(EVENT_TYPES.FILL, `Fill: ${symbol} ${side} ${qty} @ ${price}`, {
    clientOrderId,
    symbol,
    side,
    qty,
    price,
  });
}

export function trackFillSlippage(slippageBps: number): void {
  observeHistogram(METRICS.FILL_SLIPPAGE_BPS, slippageBps);
}

// ============================================================================
// API METRICS
// ============================================================================

export function trackApiRequest(): void {
  incrementCounter(METRICS.API_REQUEST);
}

export function trackApiError(endpoint: string, code: number | string, message: string): void {
  incrementCounter(METRICS.API_ERROR);
  recordEvent(EVENT_TYPES.ERROR, `API error: ${endpoint} - ${code}`, {
    endpoint,
    code,
    message,
  });
}

export function trackApiLatency(endpoint: string, latencyMs: number): void {
  observeHistogram(METRICS.API_LATENCY_MS, latencyMs);
}

// ============================================================================
// WEBSOCKET METRICS
// ============================================================================

export function trackWsMessage(): void {
  incrementCounter(METRICS.WS_MESSAGE_RECEIVED);
}

export function trackWsReconnect(reason: string): void {
  incrementCounter(METRICS.WS_RECONNECT);
  recordEvent(EVENT_TYPES.STREAM, `WebSocket reconnected: ${reason}`, { reason });
}

export function trackWsError(error: string): void {
  incrementCounter(METRICS.WS_ERROR);
  recordEvent(EVENT_TYPES.ERROR, `WebSocket error: ${error}`, { error });
}

export function trackWsLag(lagMs: number): void {
  observeHistogram(METRICS.WS_LAG_MS, lagMs);

  // Also update gauge for current lag
  setGauge(METRICS.WS_LAST_EVENT_AGE_MS, lagMs);
}

// ============================================================================
// RECONCILIATION METRICS
// ============================================================================

export function trackReconRun(trigger: string, result: "ok" | "drift" | "error", durationMs: number): void {
  incrementCounter(METRICS.RECON_RUN);

  if (result === "drift") {
    incrementCounter(METRICS.RECON_DRIFT_DETECTED);
  }

  observeHistogram(METRICS.RECON_DURATION_MS, durationMs);

  recordEvent(EVENT_TYPES.RECON, `Reconciliation ${result}: ${trigger} (${durationMs}ms)`, {
    trigger,
    result,
    durationMs,
  });
}

// ============================================================================
// BROKER INFRASTRUCTURE METRICS
// ============================================================================

export function trackBrokerCircuitOpen(circuitName: string, symbol?: string): void {
  incrementCounter(METRICS.BROKER_CIRCUIT_OPEN);
  recordEvent(EVENT_TYPES.ERROR, `Broker circuit open: ${circuitName}${symbol ? ` (${symbol})` : ""}`, {
    event: "broker.circuit_open",
    circuit: circuitName,
    symbol,
  });
}

export function trackBrokerTimeout(broker: string, operation: string, symbol?: string): void {
  incrementCounter(METRICS.BROKER_TIMEOUT);
  recordEvent(EVENT_TYPES.ERROR, `Broker timeout: ${broker} ${operation}${symbol ? ` (${symbol})` : ""}`, {
    event: "broker.timeout",
    broker,
    operation,
    symbol,
  });
}

// ============================================================================
// RISK & FREEZE METRICS
// ============================================================================

export function trackRiskLimitBreach(limitType: string, value: number, max: number): void {
  incrementCounter(METRICS.RISK_LIMIT_BREACH);
  recordEvent(EVENT_TYPES.ERROR, `Risk limit breach: ${limitType} ${value}/${max}`, {
    limitType,
    value,
    max,
  });
}

export function trackFreezeTriggered(reason: string): void {
  incrementCounter(METRICS.FREEZE_TRIGGERED);
  recordEvent(EVENT_TYPES.FREEZE, `System frozen: ${reason}`, { reason });
}

export function trackUnfreezeCleared(): void {
  incrementCounter(METRICS.UNFREEZE_CLEARED);
  recordEvent(EVENT_TYPES.FREEZE, "System unfrozen", {});
}

// ============================================================================
// POSITION METRICS
// ============================================================================

export function trackPositionOpened(symbol: string, side: string, qty: string, entryPrice: string): void {
  recordEvent(EVENT_TYPES.POSITION, `Position opened: ${symbol} ${side} ${qty} @ ${entryPrice}`, {
    symbol,
    side,
    qty,
    entryPrice,
  });
}

export function trackPositionClosed(symbol: string, realizedPnl: string): void {
  recordEvent(EVENT_TYPES.POSITION, `Position closed: ${symbol} (P&L: ${realizedPnl})`, {
    symbol,
    realizedPnl,
  });
}

// ============================================================================
// SYSTEM METRICS (GAUGES)
// ============================================================================

/**
 * Update all trading state gauges.
 * Call this periodically (e.g., after reconciliation, fills, etc.)
 */
export function updateTradingGauges(): void {
  const state = liveState();

  setGauge(METRICS.OPEN_ORDERS_COUNT, state.openOrders.size);
  setGauge(METRICS.OPEN_POSITIONS_COUNT, openPositionCount());
  setGauge(METRICS.GROSS_EXPOSURE_USD, grossExposureUsd());
  setGauge(METRICS.BALANCE_USD, balanceUsd());

  // WebSocket lag
  if (state.lastEventTime) {
    const lag = Date.now() - state.lastEventTime;
    setGauge(METRICS.WS_LAST_EVENT_AGE_MS, lag);
  }
}

// ============================================================================
// STARTUP METRIC
// ============================================================================

export function trackSystemStart(env: string): void {
  recordEvent(EVENT_TYPES.SYSTEM, `System started in ${env} mode`, { env });
}

export function trackSystemStop(): void {
  recordEvent(EVENT_TYPES.SYSTEM, "System stopped", {});
}
