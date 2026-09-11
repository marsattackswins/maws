import "server-only";

/**
 * Circuit Breaker implementation for fault tolerance and failure isolation.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Too many failures, requests immediately rejected
 * - HALF_OPEN: Testing if service recovered, limited requests allowed
 *
 * Pattern:
 * 1. Start CLOSED
 * 2. Track failures, open after threshold
 * 3. After timeout, transition to HALF_OPEN
 * 4. Success in HALF_OPEN → CLOSED, failure → OPEN
 */

import "server-only";

import { log } from "../log/logger";
import { audit } from "../audit/log";

export type CircuitState = "closed" | "open" | "half-open";

export interface CircuitBreakerConfig {
  /** Circuit breaker name (for logging/monitoring) */
  name: string;
  /** Number of failures before opening circuit */
  failureThreshold: number;
  /** Time window for counting failures (ms) */
  failureWindowMs: number;
  /** How long to wait before attempting recovery (ms) */
  recoveryTimeoutMs: number;
  /** Number of successful calls needed to close from half-open */
  successThreshold: number;
  /** Optional: function to determine if error should count as failure */
  isFailure?: (error: unknown) => boolean;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
  openedAt: number | null;
  halfOpenAt: number | null;
  totalCalls: number;
  totalFailures: number;
  totalSuccesses: number;
  totalRejections: number;
}

interface FailureRecord {
  timestamp: number;
}

/**
 * Circuit breaker for protecting against cascading failures.
 *
 * Usage:
 * ```typescript
 * const breaker = new CircuitBreaker({
 *   name: "binance-rest",
 *   failureThreshold: 5,
 *   failureWindowMs: 60_000,
 *   recoveryTimeoutMs: 30_000,
 *   successThreshold: 2
 * });
 *
 * try {
 *   const result = await breaker.execute(() => rest.placeOrder(...));
 * } catch (err) {
 *   if (err instanceof CircuitBreakerOpenError) {
 *     // Circuit is open, service unavailable
 *   }
 * }
 * ```
 */
export class CircuitBreaker {
  private state: CircuitState = "closed";
  private failures: FailureRecord[] = [];
  private consecutiveSuccesses = 0;
  private openedAt: number | null = null;
  private halfOpenAt: number | null = null;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;

  // Statistics
  private totalCalls = 0;
  private totalFailures = 0;
  private totalSuccesses = 0;
  private totalRejections = 0;

  constructor(private readonly config: CircuitBreakerConfig) {
    const { isFailure: _, ...cleanConfig } = config;
    log.info("circuit breaker initialized", { name: config.name, config: cleanConfig });
  }

  /**
   * Execute a function with circuit breaker protection.
   *
   * @throws CircuitBreakerOpenError if circuit is open
   * @throws Original error if function fails and circuit allows it
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    // Check if we should attempt recovery
    if (this.state === "open") {
      this.checkForRecoveryAttempt();
    }

    // Reject if circuit is open
    if (this.state === "open") {
      this.totalRejections++;
      throw new CircuitBreakerOpenError(
        `Circuit breaker '${this.config.name}' is OPEN`,
        this.config.name,
        this.openedAt ?? Date.now()
      );
    }

    // Execute function
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  /**
   * Check current state without executing anything.
   */
  getState(): CircuitState {
    if (this.state === "open") {
      this.checkForRecoveryAttempt();
    }
    return this.state;
  }

  /**
   * Get detailed statistics.
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failures.length,
      successCount: this.consecutiveSuccesses,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      openedAt: this.openedAt,
      halfOpenAt: this.halfOpenAt,
      totalCalls: this.totalCalls,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses,
      totalRejections: this.totalRejections,
    };
  }

  /**
   * Manually reset circuit to closed state (for testing or manual recovery).
   */
  reset(): void {
    this.state = "closed";
    this.failures = [];
    this.consecutiveSuccesses = 0;
    this.openedAt = null;
    this.halfOpenAt = null;
    log.info("circuit breaker manually reset", { name: this.config.name });
    audit("system", "circuit_breaker.reset", { circuit: this.config.name });
  }

  /**
   * Manually open circuit (for testing or manual intervention).
   */
  forceOpen(): void {
    this.transitionToOpen();
    log.warn("circuit breaker manually forced open", { name: this.config.name });
    audit("operator", "circuit_breaker.forced_open", { circuit: this.config.name });
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private onSuccess(): void {
    this.totalSuccesses++;
    this.lastSuccessTime = Date.now();

    if (this.state === "half-open") {
      this.consecutiveSuccesses++;
      log.debug("circuit breaker success in half-open", {
        name: this.config.name,
        consecutiveSuccesses: this.consecutiveSuccesses,
        threshold: this.config.successThreshold,
      });

      if (this.consecutiveSuccesses >= this.config.successThreshold) {
        this.transitionToClosed();
      }
    } else if (this.state === "closed") {
      // Success in closed state: clean up old failures outside window
      this.cleanupOldFailures();
    }
  }

  private onFailure(error: unknown): void {
    this.totalFailures++;
    this.lastFailureTime = Date.now();

    // Check if this error should count as a failure
    if (this.config.isFailure && !this.config.isFailure(error)) {
      log.debug("circuit breaker ignoring error (not counted as failure)", {
        name: this.config.name,
        error: String(error),
      });
      return;
    }

    if (this.state === "half-open") {
      // Any failure in half-open immediately reopens circuit
      log.warn("circuit breaker failure in half-open, reopening", {
        name: this.config.name,
        error: String(error),
      });
      this.transitionToOpen();
    } else if (this.state === "closed") {
      // Add failure to sliding window
      this.failures.push({ timestamp: Date.now() });
      this.cleanupOldFailures();

      log.debug("circuit breaker recorded failure", {
        name: this.config.name,
        failureCount: this.failures.length,
        threshold: this.config.failureThreshold,
        error: String(error),
      });

      // Check if we've hit threshold
      if (this.failures.length >= this.config.failureThreshold) {
        this.transitionToOpen();
      }
    }
  }

  private transitionToOpen(): void {
    this.state = "open";
    this.openedAt = Date.now();
    this.consecutiveSuccesses = 0;

    log.error("circuit breaker opened", {
      name: this.config.name,
      failureCount: this.failures.length,
      threshold: this.config.failureThreshold,
    });

    audit("system", "circuit_breaker.opened", {
      circuit: this.config.name,
      failureCount: this.failures.length,
      threshold: this.config.failureThreshold,
    });
  }

  private transitionToHalfOpen(): void {
    this.state = "half-open";
    this.halfOpenAt = Date.now();
    this.consecutiveSuccesses = 0;

    log.info("circuit breaker entering half-open (testing recovery)", {
      name: this.config.name,
      successThreshold: this.config.successThreshold,
    });

    audit("system", "circuit_breaker.half_open", {
      circuit: this.config.name,
      successThreshold: this.config.successThreshold,
    });
  }

  private transitionToClosed(): void {
    this.state = "closed";
    this.failures = [];
    this.consecutiveSuccesses = 0;
    this.openedAt = null;
    this.halfOpenAt = null;

    log.info("circuit breaker closed (recovery successful)", {
      name: this.config.name,
    });

    audit("system", "circuit_breaker.closed", {
      circuit: this.config.name,
    });
  }

  private checkForRecoveryAttempt(): void {
    if (this.state !== "open" || !this.openedAt) return;

    const now = Date.now();
    const timeSinceOpen = now - this.openedAt;

    if (timeSinceOpen >= this.config.recoveryTimeoutMs) {
      this.transitionToHalfOpen();
    }
  }

  private cleanupOldFailures(): void {
    const now = Date.now();
    const cutoff = now - this.config.failureWindowMs;
    this.failures = this.failures.filter((f) => f.timestamp > cutoff);
  }
}

/**
 * Error thrown when circuit breaker is open.
 */
export class CircuitBreakerOpenError extends Error {
  constructor(
    message: string,
    public readonly circuitName: string,
    public readonly openedAt: number,
  ) {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

/**
 * Helper to check if an error is a circuit breaker open error.
 */
export function isCircuitBreakerOpen(err: unknown): err is CircuitBreakerOpenError {
  return err instanceof CircuitBreakerOpenError;
}
