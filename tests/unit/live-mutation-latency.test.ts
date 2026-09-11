/**
 * Unit test verifying the live_mutations_latency_ms histogram is present
 * in the metrics snapshot and its values are numeric.
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { getMetrics, observeLiveMutationLatency, metricsSnapshot } from "@/lib/server/metrics/collector";
import { LIVE_MUTATION_OPERATIONS } from "@/lib/server/metrics/collector";

describe("live_mutations_latency_ms histogram", () => {
  beforeEach(() => {
    getMetrics().reset();
  });

  afterEach(() => {
    getMetrics().reset();
  });

  test("histogram key is present in snapshot after recording a latency sample", () => {
    observeLiveMutationLatency("BTCUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER, 42);

    const snap = metricsSnapshot();
    const key = "live_mutations_latency_ms{symbol=\"BTCUSDT\",operation=\"submit_order\"}";

    expect(snap.histograms).toHaveProperty(key);
    expect(typeof snap.histograms[key]).toBe("object");
    expect(snap.histograms[key]).toHaveProperty("count");
    expect(snap.histograms[key]).toHaveProperty("sum");
    expect(snap.histograms[key]).toHaveProperty("min");
    expect(snap.histograms[key]).toHaveProperty("max");
    expect(snap.histograms[key]).toHaveProperty("p50");
    expect(snap.histograms[key]).toHaveProperty("p95");
    expect(snap.histograms[key]).toHaveProperty("p99");
  });

  test("histogram values are numeric after recording samples", () => {
    const key = "live_mutations_latency_ms{symbol=\"ETHUSDT\",operation=\"cancel_order\"}";

    observeLiveMutationLatency("ETHUSDT", LIVE_MUTATION_OPERATIONS.CANCEL_ORDER, 10);
    observeLiveMutationLatency("ETHUSDT", LIVE_MUTATION_OPERATIONS.CANCEL_ORDER, 20);
    observeLiveMutationLatency("ETHUSDT", LIVE_MUTATION_OPERATIONS.CANCEL_ORDER, 30);

    const snap = metricsSnapshot();
    const hist = snap.histograms[key];

    expect(hist).toBeDefined();
    expect(typeof hist.count).toBe("number");
    expect(typeof hist.sum).toBe("number");
    expect(typeof hist.min).toBe("number");
    expect(typeof hist.max).toBe("number");
    expect(typeof hist.p50).toBe("number");
    expect(typeof hist.p95).toBe("number");
    expect(typeof hist.p99).toBe("number");

    expect(hist.count).toBe(3);
    expect(hist.min).toBe(10);
    expect(hist.max).toBe(30);
    expect(hist.sum).toBe(60);
  });

  test("multiple symbols and operations produce distinct histogram keys", () => {
    observeLiveMutationLatency("BTCUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER, 5);
    observeLiveMutationLatency("BTCUSDT", LIVE_MUTATION_OPERATIONS.CANCEL_ORDER, 8);
    observeLiveMutationLatency("ETHUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER, 12);

    const snap = metricsSnapshot();

    expect(snap.histograms).toHaveProperty(
      "live_mutations_latency_ms{symbol=\"BTCUSDT\",operation=\"submit_order\"}"
    );
    expect(snap.histograms).toHaveProperty(
      "live_mutations_latency_ms{symbol=\"BTCUSDT\",operation=\"cancel_order\"}"
    );
    expect(snap.histograms).toHaveProperty(
      "live_mutations_latency_ms{symbol=\"ETHUSDT\",operation=\"submit_order\"}"
    );  });
})
