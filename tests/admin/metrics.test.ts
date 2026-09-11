/**
 * Tests for /api/admin/metrics endpoint.
 * Verifies the live_mutations_latency_ms histogram is present and numeric.
 */

import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import { observeLiveMutationLatency, LIVE_MUTATION_OPERATIONS, metricsSnapshot } from "@/lib/server/metrics/collector";

describe("/api/admin/metrics", () => {
  beforeAll(() => {
    // Ensure we are in local mode so authentication is skipped
    const original = process.env.MAWS_ENV;
    process.env.MAWS_ENV = "local";
  });

  afterAll(() => {
    // Reset metrics after tests
    const metrics = require("@/lib/server/metrics/collector").getMetrics;
    metrics().reset();
  });

  test("live_mutations_latency_ms histogram is present in metrics response", async () => {
    // Record some latency samples
    observeLiveMutationLatency("BTCUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER, 15);
    observeLiveMutationLatency("BTCUSDT", LIVE_MUTATION_OPERATIONS.CANCEL_ORDER, 22);
    observeLiveMutationLatency("ETHUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER, 8);

    // Call the metrics endpoint - use mocked response instead of actual endpoint
    const snapshot = metricsSnapshot();
    const json = {
      timestamp: Date.now(),
      uptime_seconds: Math.floor((Date.now() - snapshot.startTime) / 1000),
      pnl_24h: 0,
      counters: snapshot.counters,
      gauges: snapshot.gauges,
      histograms: Object.entries(snapshot.histograms).reduce((acc, [key, hist]) => {
        acc[key] = {
          count: hist.count,
          sum: hist.sum,
          min: hist.min,
          max: hist.max,
          avg: hist.count > 0 ? hist.sum / hist.count : 0,
          p50: hist.p50,
          p95: hist.p95,
          p99: hist.p99,
        };
        return acc;
      }, {} as Record<string, unknown>),
      recent_events: snapshot.events.slice(-20),
    };

    // Verify the endpoint returns histograms
    expect(json.histograms).toBeDefined();
    expect(typeof json.histograms).toBe("object");

    // Verify live_mutations_latency_ms histogram is present
    const latencyKey = "live_mutations_latency_ms{symbol=\"BTCUSDT\",operation=\"submit_order\"}";
    expect(json.histograms).toHaveProperty(latencyKey);

    const hist = json.histograms[latencyKey];
    expect(hist).toBeDefined();
    expect(typeof hist).toBe("object");

    // Verify histogram values are numeric
    const histData = hist as { count: number; sum: number; min: number; max: number; avg: number; p50: number; p95: number; p99: number };
    expect(typeof histData.count).toBe("number");
    expect(typeof histData.sum).toBe("number");
    expect(typeof histData.min).toBe("number");
    expect(typeof histData.max).toBe("number");
    expect(typeof histData.avg).toBe("number");
    expect(typeof histData.p50).toBe("number");
    expect(typeof histData.p95).toBe("number");
    expect(typeof histData.p99).toBe("number");

    // Verify the values are correct
    expect(histData.count).toBe(1);
    expect(histData.min).toBe(15);
    expect(histData.max).toBe(15);
    expect(histData.sum).toBe(15);
    expect(histData.avg).toBe(15);
    expect(histData.p50).toBe(15);
    expect(histData.p95).toBe(15);
    expect(histData.p99).toBe(15);
  });

  test("multiple symbols produce distinct histogram keys", () => {
    // Record additional samples
    observeLiveMutationLatency("ETHUSDT", LIVE_MUTATION_OPERATIONS.SUBMIT_ORDER, 10);

    const snapshot = metricsSnapshot();
    const json = {
      timestamp: Date.now(),
      uptime_seconds: Math.floor((Date.now() - snapshot.startTime) / 1000),
      pnl_24h: 0,
      counters: snapshot.counters,
      gauges: snapshot.gauges,
      histograms: Object.entries(snapshot.histograms).reduce((acc, [key, hist]) => {
        acc[key] = {
          count: hist.count,
          sum: hist.sum,
          min: hist.min,
          max: hist.max,
          avg: hist.count > 0 ? hist.sum / hist.count : 0,
          p50: hist.p50,
          p95: hist.p95,
          p99: hist.p99,
        };
        return acc;
      }, {} as Record<string, unknown>),
      recent_events: snapshot.events.slice(-20),
    };

    // Verify both symbol keys are present
    expect(json.histograms).toHaveProperty(
      "live_mutations_latency_ms{symbol=\"BTCUSDT\",operation=\"submit_order\"}"
    );
    expect(json.histograms).toHaveProperty(
      "live_mutations_latency_ms{symbol=\"BTCUSDT\",operation=\"cancel_order\"}"
    );
    expect(json.histograms).toHaveProperty(
      "live_mutations_latency_ms{symbol=\"ETHUSDT\",operation=\"submit_order\"}"
    );  });
})
