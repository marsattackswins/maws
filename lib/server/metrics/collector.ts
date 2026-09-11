import "server-only";

/**
 * Lightweight metrics collector for MAWS live trading observability.
 * Tracks counters, gauges, and histograms in-memory for real-time monitoring.
 */

export interface MetricSnapshot {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, HistogramData>;
  events: MetricEvent[];
  startTime: number;
}

export interface HistogramData {
  count: number;
  sum: number;
  min: number;
  max: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface MetricEvent {
  ts: number;
  type: string;
  label: string;
  details?: Record<string, unknown>;
}

const MAX_EVENTS = 100;
const MAX_HISTOGRAM_SAMPLES = 1000;

class MetricsCollector {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  private events: MetricEvent[] = [];
  private startTime = Date.now();

  // Counters (monotonically increasing)
  increment(name: string, value = 1): void {
    this.counters.set(name, (this.counters.get(name) || 0) + value);
  }

  // Gauges (current value)
  set(name: string, value: number): void {
    this.gauges.set(name, value);
  }

  // Histograms (distributions)
  observe(name: string, value: number): void {
    const samples = this.histograms.get(name) || [];
    samples.push(value);

    // Keep only recent samples
    if (samples.length > MAX_HISTOGRAM_SAMPLES) {
      samples.shift();
    }

    this.histograms.set(name, samples);
  }

  // Events (timestamped log entries)
  recordEvent(type: string, label: string, details?: Record<string, unknown>): void {
    this.events.push({
      ts: Date.now(),
      type,
      label,
      details,
    });

    // Keep only recent events
    if (this.events.length > MAX_EVENTS) {
      this.events.shift();
    }
  }

  // Get snapshot of all metrics
  snapshot(): MetricSnapshot {
    const counters: Record<string, number> = {};
    for (const [key, value] of this.counters) {
      counters[key] = value;
    }

    const gauges: Record<string, number> = {};
    for (const [key, value] of this.gauges) {
      gauges[key] = value;
    }

    const histograms: Record<string, HistogramData> = {};
    for (const [key, samples] of this.histograms) {
      histograms[key] = this.computeHistogram(samples);
    }

    return {
      counters,
      gauges,
      histograms,
      events: [...this.events],
      startTime: this.startTime,
    };
  }

  // Reset counters (for testing or periodic resets)
  resetCounters(): void {
    this.counters.clear();
  }

  // Reset everything
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.events = [];
    this.startTime = Date.now();
  }

  private computeHistogram(samples: number[]): HistogramData {
    if (samples.length === 0) {
      return { count: 0, sum: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0 };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const min = sorted[0];
    const max = sorted[count - 1];

    const p50 = sorted[Math.floor(count * 0.5)];
    const p95 = sorted[Math.floor(count * 0.95)];
    const p99 = sorted[Math.floor(count * 0.99)];

    return { count, sum, min, max, p50, p95, p99 };
  }

  // Get uptime in seconds
  getUptimeSeconds(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  // Get recent events (last N)
  getRecentEvents(limit = 20): MetricEvent[] {
    return this.events.slice(-limit);
  }

  // Get counter value
  getCounter(name: string): number {
    return this.counters.get(name) || 0;
  }

  // Get gauge value
  getGauge(name: string): number {
    return this.gauges.get(name) || 0;
  }
}

// Singleton instance
const metrics = new MetricsCollector();

export function getMetrics(): MetricsCollector {
  return metrics;
}

// Convenience exports
export function incrementCounter(name: string, value = 1): void {
  metrics.increment(name, value);
}

export function setGauge(name: string, value: number): void {
  metrics.set(name, value);
}

export function observeHistogram(name: string, value: number): void {
  metrics.observe(name, value);
}

/**
 * Record a live mutation latency sample.
 * Metric key is live_mutations_latency_ms{symbol,operation} where
 * operation is one of the LIVE_MUTATION_OPERATIONS values.
 */
export function observeLiveMutationLatency(symbol: string, operation: string, latencyMs: number): void {
  const name = `live_mutations_latency_ms{symbol=\"${symbol}\",operation=\"${operation}\"}`;
  metrics.observe(name, latencyMs);
}

export function recordEvent(type: string, label: string, details?: Record<string, unknown>): void {
  metrics.recordEvent(type, label, details);
}

export function metricsSnapshot(): MetricSnapshot {
  return metrics.snapshot();
}

// Metric names (constants for consistency)
export const METRICS = {
  // Orders
  ORDER_SUBMITTED: "order.submitted",
  ORDER_FILLED: "order.filled",
  ORDER_CANCELED: "order.canceled",
  ORDER_REJECTED: "order.rejected",
  ORDER_SUBMISSION_DURATION_MS: "order.submission_duration_ms",
  LIVE_MUTATIONS_LATENCY_MS: "live_mutations_latency_ms",

  // Fills
  FILL_RECEIVED: "fill.received",
  FILL_SLIPPAGE_BPS: "fill.slippage_bps",

  // API
  API_REQUEST: "api.request",
  API_ERROR: "api.error",
  API_LATENCY_MS: "api.latency_ms",

  // WebSocket
  WS_MESSAGE_RECEIVED: "ws.message_received",
  WS_RECONNECT: "ws.reconnect",
  WS_ERROR: "ws.error",
  WS_LAG_MS: "ws.lag_ms",

  // Reconciliation
  RECON_RUN: "recon.run",
  RECON_DRIFT_DETECTED: "recon.drift_detected",
  RECON_DURATION_MS: "recon.duration_ms",

  // Risk
  RISK_LIMIT_BREACH: "risk.limit_breach",
  FREEZE_TRIGGERED: "freeze.triggered",
  UNFREEZE_CLEARED: "unfreeze.cleared",

  // Broker infrastructure
  BROKER_CIRCUIT_OPEN: "broker.circuit_open",
  BROKER_TIMEOUT: "broker.timeout",

  // Gauges (current values)
  OPEN_ORDERS_COUNT: "gauge.open_orders",
  OPEN_POSITIONS_COUNT: "gauge.open_positions",
  GROSS_EXPOSURE_USD: "gauge.gross_exposure_usd",
  BALANCE_USD: "gauge.balance_usd",
  WS_LAST_EVENT_AGE_MS: "gauge.ws_last_event_age_ms",

} as const;

// Live mutation operations (used as histogram labels)
export const LIVE_MUTATION_OPERATIONS = {
  SUBMIT_ORDER: "submit_order",
  CANCEL_ORDER: "cancel_order",
  CLOSE_POSITION: "close_position",
  PROTECT_POSITION: "protect_position",
} as const;

// Event types
export const EVENT_TYPES = {
  ORDER: "order",
  FILL: "fill",
  POSITION: "position",
  RECON: "reconciliation",
  STREAM: "stream",
  FREEZE: "freeze",
  ERROR: "error",
  SYSTEM: "system",
} as const;
