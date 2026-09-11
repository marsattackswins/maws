import "server-only";

import { CircuitBreakerOpenError } from "../resilience/circuit-breaker";
import { BrokerTimeoutError } from "../broker/errors";
import { jsonError } from "../http/guards";
import { log } from "../log/logger";
import { trackBrokerCircuitOpen, trackBrokerTimeout } from "../metrics/instrument";

/**
 * Wrapper for broker mutation operations that maps infrastructure failures
 * to 503 Service Unavailable responses.
 *
 * Maps:
 * - CircuitBreakerOpenError → 503 "circuit_open"
 * - BrokerTimeoutError → 503 "timeout"
 *
 * All other errors (including business logic errors like { ok: false })
 * are re-thrown to let the route handler return appropriate 422 responses.
 *
 * Every mapped infra failure logs a structured event and bumps a metric
 * counter (broker.circuit_open / broker.timeout) so trips are visible in
 * logs and dashboards without changing the client-visible response.
 *
 * @param fn The async broker operation to execute
 * @param context Optional routing context (e.g. symbol) attached to logs/metrics
 * @returns The operation result, or a 503 Response for infrastructure failures
 */
export async function runBrokerMutation<T>(
  fn: () => Promise<T>,
  context: { symbol?: string; clientOrderId?: string } = {},
): Promise<T | Response> {
  try {
    return await fn();
  } catch (err) {
    // Circuit breaker is open - service temporarily unavailable
    if (err instanceof CircuitBreakerOpenError) {
      log.error("broker.circuit_open", {
        event: "broker.circuit_open",
        code: "circuit_open",
        circuit: err.circuitName,
        symbol: context.symbol,
        timestamp: Date.now(),
      });
      trackBrokerCircuitOpen(err.circuitName, context.symbol);
      return jsonError(
        503,
        "circuit_open",
        "Service temporarily unavailable. The system is protecting itself from cascading failures. Please try again in a few moments."
      );
    }

    // Timeout errors - operation took too long
    if (err instanceof BrokerTimeoutError) {
      log.error("broker.timeout", {
        event: "broker.timeout",
        code: "timeout",
        broker: err.broker,
        message: err.message,
        symbol: context.symbol,
        timestamp: Date.now(),
      });
      trackBrokerTimeout(err.broker, err.message, context.symbol);
      return jsonError(
        503,
        "timeout",
        "Request timed out. The broker did not respond in time. Please verify your connection and try again."
      );
    }

    // All other errors (validation, business logic, etc.) bubble up
    // for the route to handle as 422 or appropriate status
    throw err;
  }
}