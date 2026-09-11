import "server-only";

/**
 * Circuit breaker registry for managing multiple breakers.
 * Provides centralized access and monitoring.
 */

import "server-only";

import { CircuitBreaker, type CircuitBreakerConfig, type CircuitBreakerStats } from "./circuit-breaker";

class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  /**
   * Register a new circuit breaker.
   */
  register(config: CircuitBreakerConfig): CircuitBreaker {
    if (this.breakers.has(config.name)) {
      throw new Error(`Circuit breaker '${config.name}' already registered`);
    }

    const breaker = new CircuitBreaker(config);
    this.breakers.set(config.name, breaker);
    return breaker;
  }

  /**
   * Get an existing circuit breaker by name.
   */
  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  /**
   * Get or create a circuit breaker.
   */
  getOrCreate(config: CircuitBreakerConfig): CircuitBreaker {
    const existing = this.breakers.get(config.name);
    if (existing) return existing;
    return this.register(config);
  }

  /**
   * Get all registered circuit breakers.
   */
  getAll(): Map<string, CircuitBreaker> {
    return new Map(this.breakers);
  }

  /**
   * Get statistics for all breakers.
   */
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    for (const [name, breaker] of this.breakers) {
      stats[name] = breaker.getStats();
    }
    return stats;
  }

  /**
   * Check if any breaker is open.
   */
  hasOpenCircuits(): boolean {
    for (const breaker of this.breakers.values()) {
      if (breaker.getState() === "open") {
        return true;
      }
    }
    return false;
  }

  /**
   * Get names of all open circuits.
   */
  getOpenCircuits(): string[] {
    const open: string[] = [];
    for (const [name, breaker] of this.breakers) {
      if (breaker.getState() === "open") {
        open.push(name);
      }
    }
    return open;
  }

  /**
   * Reset all breakers (for testing).
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  /**
   * Clear all breakers (for testing).
   */
  clear(): void {
    this.breakers.clear();
  }
}

// Singleton instance
const registry = new CircuitBreakerRegistry();

export { registry as circuitRegistry };
