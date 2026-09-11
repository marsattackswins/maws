/**
 * Unit tests for runBrokerMutation helper.
 * Verifies infrastructure error mapping to 503 responses and that trips are
 * visible via metrics (counter + recorded event) without changing responses.
 */

import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { runBrokerMutation } from "@/lib/server/response/broker-mutation";
import { CircuitBreakerOpenError } from "@/lib/server/resilience/circuit-breaker";
import { BrokerTimeoutError } from "@/lib/server/broker/errors";
import { getMetrics, METRICS } from "@/lib/server/metrics/collector";

describe("runBrokerMutation", () => {
  beforeEach(() => {
    getMetrics().reset();
  });

  afterEach(() => {
    getMetrics().reset();
  });

  describe("CircuitBreakerOpenError handling", () => {
    test("returns 503 with circuit_open code", async () => {
      const fn = async () => {
        throw new CircuitBreakerOpenError("Circuit breaker is open", "test-breaker", Date.now());
      };

      const result = await runBrokerMutation(fn);

      expect(result).toBeInstanceOf(Response);
      if (result instanceof Response) {
        expect(result.status).toBe(503);

        const body = await result.json();
        expect(body).toEqual({
          error: {
            code: "circuit_open",
            message: expect.stringContaining("temporarily unavailable"),
          },
        });
      }
    });

    test("emits broker.circuit_open metric with circuit name and symbol", async () => {
      const fn = async () => {
        throw new CircuitBreakerOpenError("Circuit breaker is open", "binance-rest", Date.now());
      };

      const result = await runBrokerMutation(fn, { symbol: "BTCUSDT" });

      expect(result).toBeInstanceOf(Response);
      expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(1);

      const recent = getMetrics().getRecentEvents(5);
      const ev = recent.find((e) => e.details?.event === "broker.circuit_open");
      expect(ev).toBeDefined();
      expect(ev?.details).toMatchObject({
        circuit: "binance-rest",
        symbol: "BTCUSDT",
      });
    });
  });

  describe("BrokerTimeoutError handling", () => {
    test("returns 503 with timeout code", async () => {
      const fn = async () => {
        throw new BrokerTimeoutError("binance", "submitOrder");
      };

      const result = await runBrokerMutation(fn);

      expect(result).toBeInstanceOf(Response);
      if (result instanceof Response) {
        expect(result.status).toBe(503);

        const body = await result.json();
        expect(body).toEqual({
          error: {
            code: "timeout",
            message: expect.stringContaining("timed out"),
          },
        });
      }
    });

    test("emits broker.timeout metric with broker and symbol", async () => {
      const fn = async () => {
        throw new BrokerTimeoutError("binance", "submitOrder");
      };

      const result = await runBrokerMutation(fn, { symbol: "ETHUSDT" });

      expect(result).toBeInstanceOf(Response);
      expect(getMetrics().getCounter(METRICS.BROKER_TIMEOUT)).toBe(1);

      const recent = getMetrics().getRecentEvents(5);
      const ev = recent.find((e) => e.details?.event === "broker.timeout");
      expect(ev).toBeDefined();
      expect(ev?.details).toMatchObject({
        broker: "binance",
        symbol: "ETHUSDT",
      });
      expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
    });
  });

  describe("Other errors", () => {
    test("re-throws generic errors", async () => {
      const fn = async () => {
        throw new Error("Business logic error");
      };

      await expect(runBrokerMutation(fn)).rejects.toThrow("Business logic error");
    });

    test("re-throws validation errors", async () => {
      const fn = async () => {
        throw new Error("Invalid symbol");
      };

      await expect(runBrokerMutation(fn)).rejects.toThrow("Invalid symbol");
    });

    test("re-throws custom errors", async () => {
      class CustomError extends Error {
        constructor() {
          super("Custom error");
          this.name = "CustomError";
        }
      }

      const fn = async () => {
        throw new CustomError();
      };

      await expect(runBrokerMutation(fn)).rejects.toThrow(CustomError);
    });

    test("does not emit broker infra metrics for non-infra errors", async () => {
      const fn = async () => {
        throw new Error("Business logic error");
      };

      await expect(runBrokerMutation(fn)).rejects.toThrow("Business logic error");
      expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
      expect(getMetrics().getCounter(METRICS.BROKER_TIMEOUT)).toBe(0);
    });
  });

  describe("Success cases", () => {
    test("returns successful result unchanged", async () => {
      const fn = async () => ({ ok: true, orderId: "12345" });

      const result = await runBrokerMutation(fn);

      expect(result).toEqual({ ok: true, orderId: "12345" });
      expect(result).not.toBeInstanceOf(Response);
      expect(getMetrics().getCounter(METRICS.BROKER_CIRCUIT_OPEN)).toBe(0);
      expect(getMetrics().getCounter(METRICS.BROKER_TIMEOUT)).toBe(0);
    });

    test("returns business failure result unchanged", async () => {
      const fn = async () => ({ ok: false, error: "Insufficient balance" });

      const result = await runBrokerMutation(fn);

      expect(result).toEqual({ ok: false, error: "Insufficient balance" });
      expect(result).not.toBeInstanceOf(Response);
    });
  });

  // The structured log line carries event/code/timestamp; verify it is emitted
  // (spy on stdout writes so the test does not depend on log level config).
  describe("structured logging", () => {
    test("circuit_open logs a structured JSON line", async () => {
      const writeSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
      try {
        const fn = async () => {
          throw new CircuitBreakerOpenError("Circuit breaker is open", "binance-rest", Date.now());
        };
        await runBrokerMutation(fn, { symbol: "BTCUSDT" });

        const calls = writeSpy.mock.calls.map((c) => String(c[0]));
        const line = calls.find((l) => l.includes("broker.circuit_open"));
        expect(line).toBeDefined();
        const parsed = JSON.parse(line!);
        expect(parsed.level).toBe("error");
        expect(parsed.fields).toMatchObject({
          event: "broker.circuit_open",
          code: "circuit_open",
          circuit: "binance-rest",
          symbol: "BTCUSDT",
        });
        expect(parsed.fields.timestamp).toEqual(expect.any(Number));
      } finally {
        writeSpy.mockRestore();
      }
    });

    test("timeout logs a structured JSON line", async () => {
      const writeSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
      try {
        const fn = async () => {
          throw new BrokerTimeoutError("binance", "submitOrder");
        };
        await runBrokerMutation(fn, { symbol: "ETHUSDT" });

        const calls = writeSpy.mock.calls.map((c) => String(c[0]));
        const line = calls.find((l) => l.includes("broker.timeout"));
        expect(line).toBeDefined();
        const parsed = JSON.parse(line!);
        expect(parsed.level).toBe("error");
        expect(parsed.fields).toMatchObject({
          event: "broker.timeout",
          code: "timeout",
          broker: "binance",
          symbol: "ETHUSDT",
        });
      } finally {
        writeSpy.mockRestore();
      }
    });
  });
});