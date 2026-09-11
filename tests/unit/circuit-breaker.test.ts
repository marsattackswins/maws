/**
 * Unit tests for CircuitBreaker class.
 * Tests state transitions, failure tracking, and recovery behavior.
 */

import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { CircuitBreaker, CircuitBreakerOpenError } from "@/lib/server/resilience/circuit-breaker";

describe("CircuitBreaker", () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      name: "test-breaker",
      failureThreshold: 3,
      failureWindowMs: 10_000,
      recoveryTimeoutMs: 1_000,
      successThreshold: 2,
    });
  });

  describe("State Transitions", () => {
    test("starts in closed state", () => {
      expect(breaker.getState()).toBe("closed");
    });

    test("transitions to open after threshold failures", async () => {
      const failingFn = async () => {
        throw new Error("Test failure");
      };

      // Record failures
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(failingFn)).rejects.toThrow("Test failure");
      }

      // Circuit should be open
      expect(breaker.getState()).toBe("open");
    });

    test("rejects requests when open", async () => {
      // Force open
      breaker.forceOpen();

      const successFn = async () => "success";

      await expect(breaker.execute(successFn)).rejects.toThrow(CircuitBreakerOpenError);
    });

    test("transitions to half-open after recovery timeout", async () => {
      breaker.forceOpen();
      expect(breaker.getState()).toBe("open");

      // Wait for recovery timeout (1 second in test config)
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Check state (this triggers checkForRecoveryAttempt)
      const state = breaker.getState();
      expect(state).toBe("half-open");
    });

    test("transitions to closed after success threshold in half-open", async () => {
      breaker.forceOpen();
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should be half-open
      expect(breaker.getState()).toBe("half-open");

      const successFn = async () => "success";

      // Need 2 successes (successThreshold) to close
      await breaker.execute(successFn);
      expect(breaker.getState()).toBe("half-open");

      await breaker.execute(successFn);
      expect(breaker.getState()).toBe("closed");
    });

    test("reopens on failure in half-open", async () => {
      breaker.forceOpen();
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(breaker.getState()).toBe("half-open");

      const failingFn = async () => {
        throw new Error("Test failure");
      };

      await expect(breaker.execute(failingFn)).rejects.toThrow("Test failure");
      expect(breaker.getState()).toBe("open");
    });
  });

  describe("Failure Tracking", () => {
    test("tracks failures in sliding window", async () => {
      const failingFn = async () => {
        throw new Error("Test failure");
      };

      // Record 2 failures
      await expect(breaker.execute(failingFn)).rejects.toThrow();
      await expect(breaker.execute(failingFn)).rejects.toThrow();

      const stats = breaker.getStats();
      expect(stats.failureCount).toBe(2);
      expect(stats.state).toBe("closed"); // Not open yet
    });

    test("cleans up old failures outside window", async () => {
      const shortWindowBreaker = new CircuitBreaker({
        name: "short-window",
        failureThreshold: 5,
        failureWindowMs: 100, // 100ms window
        recoveryTimeoutMs: 1000,
        successThreshold: 2,
      });

      const failingFn = async () => {
        throw new Error("Test failure");
      };

      // Record 2 failures
      await expect(shortWindowBreaker.execute(failingFn)).rejects.toThrow();
      await expect(shortWindowBreaker.execute(failingFn)).rejects.toThrow();

      let stats = shortWindowBreaker.getStats();
      expect(stats.failureCount).toBe(2);

      // Wait for failures to age out
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Trigger a success to clean up old failures
      await shortWindowBreaker.execute(async () => "success");

      stats = shortWindowBreaker.getStats();
      expect(stats.failureCount).toBe(0); // Old failures cleaned up
    });

    test("ignores errors that don't count as failures", async () => {
      const selectiveBreaker = new CircuitBreaker({
        name: "selective",
        failureThreshold: 3,
        failureWindowMs: 10_000,
        recoveryTimeoutMs: 1000,
        successThreshold: 2,
        isFailure: (error) => {
          // Only count errors with "server" in message
          if (error instanceof Error) {
            return error.message.includes("server");
          }
          return true;
        },
      });

      // These should not count
      await expect(
        selectiveBreaker.execute(async () => {
          throw new Error("client error");
        })
      ).rejects.toThrow();
      await expect(
        selectiveBreaker.execute(async () => {
          throw new Error("validation error");
        })
      ).rejects.toThrow();

      let stats = selectiveBreaker.getStats();
      expect(stats.failureCount).toBe(0);
      expect(stats.state).toBe("closed");

      // These should count
      await expect(
        selectiveBreaker.execute(async () => {
          throw new Error("server error");
        })
      ).rejects.toThrow();

      stats = selectiveBreaker.getStats();
      expect(stats.failureCount).toBe(1);
    });
  });

  describe("Statistics", () => {
    test("tracks total calls", async () => {
      const successFn = async () => "success";
      const failingFn = async () => {
        throw new Error("fail");
      };

      await breaker.execute(successFn);
      await expect(breaker.execute(failingFn)).rejects.toThrow();
      await breaker.execute(successFn);

      const stats = breaker.getStats();
      expect(stats.totalCalls).toBe(3);
      expect(stats.totalSuccesses).toBe(2);
      expect(stats.totalFailures).toBe(1);
    });

    test("tracks rejections when open", async () => {
      breaker.forceOpen();

      const successFn = async () => "success";

      await expect(breaker.execute(successFn)).rejects.toThrow(CircuitBreakerOpenError);
      await expect(breaker.execute(successFn)).rejects.toThrow(CircuitBreakerOpenError);

      const stats = breaker.getStats();
      expect(stats.totalRejections).toBe(2);
    });

    test("records timestamps", async () => {
      const successFn = async () => "success";
      const failingFn = async () => {
        throw new Error("fail");
      };

      await breaker.execute(successFn);
      await expect(breaker.execute(failingFn)).rejects.toThrow();

      const stats = breaker.getStats();
      expect(stats.lastSuccessTime).toBeGreaterThan(0);
      expect(stats.lastFailureTime).toBeGreaterThan(0);
      expect(stats.lastFailureTime!).toBeGreaterThanOrEqual(stats.lastSuccessTime!);
    });
  });

  describe("Manual Control", () => {
    test("reset() clears state", async () => {
      const failingFn = async () => {
        throw new Error("fail");
      };

      // Trigger failures
      await expect(breaker.execute(failingFn)).rejects.toThrow();
      await expect(breaker.execute(failingFn)).rejects.toThrow();

      let stats = breaker.getStats();
      expect(stats.failureCount).toBe(2);

      // Reset
      breaker.reset();

      stats = breaker.getStats();
      expect(stats.state).toBe("closed");
      expect(stats.failureCount).toBe(0);
      expect(stats.successCount).toBe(0);
    });

    test("forceOpen() opens circuit", () => {
      expect(breaker.getState()).toBe("closed");

      breaker.forceOpen();

      expect(breaker.getState()).toBe("open");
    });
  });

  describe("Edge Cases", () => {
    test("handles synchronous errors", async () => {
      const syncErrorFn = async () => {
        throw new Error("sync error");
      };

      await expect(breaker.execute(syncErrorFn)).rejects.toThrow("sync error");

      const stats = breaker.getStats();
      expect(stats.totalFailures).toBe(1);
    });

    test("handles promise rejections", async () => {
      const rejectFn = () => Promise.reject(new Error("rejected"));

      await expect(breaker.execute(rejectFn)).rejects.toThrow("rejected");

      const stats = breaker.getStats();
      expect(stats.totalFailures).toBe(1);
    });

    test("returns successful results", async () => {
      const dataFn = async () => ({ data: "test" });

      const result = await breaker.execute(dataFn);

      expect(result).toEqual({ data: "test" });
    });

    test("executes function only once per call", async () => {
      let executionCount = 0;

      const fn = async () => {
        executionCount++;
        return "result";
      };

      await breaker.execute(fn);

      expect(executionCount).toBe(1);
    });
  });
});
