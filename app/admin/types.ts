export type StatusTone = "healthy" | "warning" | "danger" | "muted";

export type TradingHealthLevel = "healthy" | "degraded" | "unhealthy" | "unavailable";

export type StreamStatus = "open" | "closed" | "reconnecting" | "unavailable";

export type CircuitState = "closed" | "half-open" | "open";

export interface TradingHealthSnapshot {
  timestamp: number;
  env: string;
  overall: TradingHealthLevel;
  feed: {
    serverTradingStream: {
      label: string;
      status: StreamStatus;
      level: TradingHealthLevel;
      connected: boolean | null;
      phase: string | null;
      lastMessageAt: number | null;
      reconnects: number | null;
      snapshotAt: number | null;
    };
    marketFeed: {
      available: false;
      level: "unavailable";
      message: string;
    };
  };
  execution: {
    failedOrders: {
      count: number;
      recent: Array<{
        clientOrderId: string;
        symbol: string;
        side: string;
        type: string;
        status: string;
        updatedAt: number;
        reason: string | null;
      }>;
    };
    metrics: {
      rejectedOrders: number;
      websocketReconnects: number;
      websocketErrors: number;
      reconciliationDrifts: number;
    };
    rateLimits: {
      current: {
        internalUsed: number;
        internalPerMin: number;
        usedWeight1m: number | null;
        orderCount1m: number | null;
        pressure: number;
        lastObservedAt: number;
      } | null;
      historicalHits: {
        available: false;
        message: string;
      };
    };
    reconciliation: {
      runs: number;
      mismatches: number;
      recent: Array<{
        startedAt: number;
        finishedAt: number | null;
        trigger: string;
        result: "drift" | "error";
        diffs: string[];
      }>;
    };
  };
  strategy: {
    available: false;
    level: "unavailable";
    message: string;
  };
  circuits: {
    healthy: boolean;
    openCircuits: string[];
    breakers: Array<{
      name: string;
      state: CircuitState;
      level: TradingHealthLevel;
      failureCount: number;
      lastFailureTime: number | null;
      openedAt: number | null;
      totalRejections: number;
    }>;
  };
}

export interface HealthSnapshot {
  env: string;
  healthy: boolean;
  version?: string;
  startedAt?: number;
  uptimeSeconds?: number;
  managerStatus: string;
  managerError: string | null;
  managerReady: boolean;
  streamHealthy: boolean;
  reconHealthy: boolean;
  positionModeHealthy: boolean;
  positionMode: { mode: string; checkedAt: number | null; error: string | null };
  circuitBreakersHealthy: boolean;
  openCircuits: string[];
  execution: {
    profileExecutionEnabled: boolean;
    runtimeEnabled: boolean;
    canSubmit: boolean;
    reasons: string[];
  };
  submissionsFrozen: boolean;
  frozenReasons: string[];
}

export interface BrokerHealth {
  status: "ok" | "degraded";
  broker: string;
  latency_ms: number;
}

export interface FeedProbe {
  level: "healthy" | "unhealthy" | "unavailable";
  latencyMs: number | null;
}

export interface LatencySample {
  latencyMs: number;
  checkedAt: number;
}

export interface PerformanceMetrics {
  timestamp: number;
  uptime_seconds: number;
  orders: {
    submitted: number;
    filled: number;
    canceled: number;
    rejected: number;
    fill_rate_pct: string;
    submission_latency_ms: LatencyStats | null;
  };
  fills: {
    count: number;
    slippage_bps: { avg: number; p95: number } | null;
  };
  api: {
    requests: number;
    errors: number;
    error_rate_pct: string;
    latency_ms: LatencyStats | null;
  };
  websocket: {
    messages: number;
    reconnects: number;
    errors: number;
    lag_ms: { avg: string; p95: number } | null;
    last_event_age_ms: number | null;
  };
  reconciliation: {
    runs: number;
    drift_detected: number;
    drift_rate_pct: string;
    duration_ms: { avg: string; p95: number } | null;
  };
  risk: {
    freeze_events: number;
    limit_breaches: number;
  };
}

export interface LatencyStats {
  avg: string;
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

export interface MetricsSnapshot {
  timestamp: number;
  recent_events: MetricEvent[];
}

export interface TerminalLogLine {
  seq: number;
  ts: number;
  stream: "stdout" | "stderr";
  text: string;
}

export interface TerminalLogsSnapshot {
  timestamp: number;
  /** Total completed lines since server start, including dropped ones. */
  total: number;
  /** Lines evicted from the ring buffer before this snapshot. */
  dropped: number;
  lines: TerminalLogLine[];
}
