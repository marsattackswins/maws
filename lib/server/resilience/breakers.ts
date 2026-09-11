/**
 * Pre-configured circuit breakers for MAWS subsystems.
 */

import "server-only";

import { circuitRegistry } from "./circuit-registry";
import { BinanceApiError, TransportTimeoutError } from "../binance/rest";
import { serverConfig } from "../env/config";

/**
 * Initialize all circuit breakers for the system.
 * Call this once during application startup.
 */
export function initializeCircuitBreakers(): void {
  const cfg = serverConfig();

  // Binance REST API breaker
  circuitRegistry.getOrCreate({
    name: "binance-rest",
    failureThreshold: cfg.circuitBreaker.restFailureThreshold,
    failureWindowMs: cfg.circuitBreaker.restFailureWindowMs,
    recoveryTimeoutMs: cfg.circuitBreaker.restRecoveryTimeoutMs,
    successThreshold: cfg.circuitBreaker.restSuccessThreshold,
    isFailure: (error) => {
      // Only count actual failures, not validation errors or user errors
      if (error instanceof BinanceApiError) {
        // -1021 (timestamp) is recoverable, don't count as failure
        if (error.code === -1021) return false;
        // 4xx errors are user errors, don't trip breaker
        if (error.httpStatus >= 400 && error.httpStatus < 500) return false;
        // 5xx errors and other issues count as failures
        return true;
      }
      if (error instanceof TransportTimeoutError) return true;
      return true; // Unknown errors count as failures
    },
  });

  // WebSocket stream breaker
  circuitRegistry.getOrCreate({
    name: "binance-stream",
    failureThreshold: cfg.circuitBreaker.streamFailureThreshold,
    failureWindowMs: cfg.circuitBreaker.streamFailureWindowMs,
    recoveryTimeoutMs: cfg.circuitBreaker.streamRecoveryTimeoutMs,
    successThreshold: cfg.circuitBreaker.streamSuccessThreshold,
  });

  // Reconciliation breaker
  circuitRegistry.getOrCreate({
    name: "reconciliation",
    failureThreshold: cfg.circuitBreaker.reconFailureThreshold,
    failureWindowMs: cfg.circuitBreaker.reconFailureWindowMs,
    recoveryTimeoutMs: cfg.circuitBreaker.reconRecoveryTimeoutMs,
    successThreshold: cfg.circuitBreaker.reconSuccessThreshold,
  });
}

/**
 * Test seam: drop all breakers and re-create them from the current config.
 * Mirrors the other `reset*ForTests` singletons (db, clock, live state).
 */
export function resetCircuitBreakersForTests(): void {
  circuitRegistry.clear();
  initializeCircuitBreakers();
}

/**
 * Get the Binance REST API circuit breaker.
 */
export function getBinanceRestBreaker() {
  const breaker = circuitRegistry.get("binance-rest");
  if (!breaker) {
    throw new Error("Circuit breakers not initialized. Call initializeCircuitBreakers() first.");
  }
  return breaker;
}

/**
 * Get the WebSocket stream circuit breaker.
 */
export function getBinanceStreamBreaker() {
  const breaker = circuitRegistry.get("binance-stream");
  if (!breaker) {
    throw new Error("Circuit breakers not initialized. Call initializeCircuitBreakers() first.");
  }
  return breaker;
}

/**
 * Get the reconciliation circuit breaker.
 */
export function getReconciliationBreaker() {
  const breaker = circuitRegistry.get("reconciliation");
  if (!breaker) {
    throw new Error("Circuit breakers not initialized. Call initializeCircuitBreakers() first.");
  }
  return breaker;
}

/**
 * Check if any critical breaker is open.
 */
export function hasCriticalCircuitOpen(): boolean {
  return circuitRegistry.hasOpenCircuits();
}

/**
 * Get names of open circuits.
 */
export function getOpenCircuits(): string[] {
  return circuitRegistry.getOpenCircuits();
}
