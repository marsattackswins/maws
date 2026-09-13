import "server-only";

import type { MawsEnv } from "../env/config";
import type { CircuitBreakerStats, CircuitState } from "../resilience/circuit-breaker";
import type { StreamSignal } from "./state";

export type TradingHealthLevel = "healthy" | "degraded" | "unhealthy" | "unavailable";

export interface TradingHealthOrderFailure {
  clientOrderId: string;
  symbol: string;
  side: string;
  type: string;
  status: string;
  updatedAt: number;
  reason: string | null;
}

export interface TradingHealthReconciliationMismatch {
  startedAt: number;
  finishedAt: number | null;
  trigger: string;
  result: "drift" | "error";
  diffs: string[];
}

export interface TradingHealthRateLimiterState {
  internalUsed: number;
  internalPerMin: number;
  usedWeight1m: number | null;
  orderCount1m: number | null;
  pressure: number;
  lastObservedAt: number;
}

export interface TradingHealthCircuit {
  name: string;
  state: CircuitState;
  level: TradingHealthLevel;
  failureCount: number;
  lastFailureTime: number | null;
  openedAt: number | null;
  totalRejections: number;
}

export interface TradingHealthSnapshot {
  timestamp: number;
  env: MawsEnv;
  overall: TradingHealthLevel;
  feed: {
    serverTradingStream: {
      label: "Server trading stream";
      status: "open" | "closed" | "reconnecting" | "unavailable";
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
      message: "browser-local / not available server-side";
    };
  };
  execution: {
    failedOrders: {
      count: number;
      recent: TradingHealthOrderFailure[];
    };
    metrics: {
      rejectedOrders: number;
      websocketReconnects: number;
      websocketErrors: number;
      reconciliationDrifts: number;
    };
    rateLimits: {
      current: TradingHealthRateLimiterState | null;
      historicalHits: {
        available: false;
        message: "Historical rate-limit hit counts are not tracked yet";
      };
    };
    reconciliation: {
      runs: number;
      mismatches: number;
      recent: TradingHealthReconciliationMismatch[];
    };
  };
  strategy: {
    available: false;
    level: "unavailable";
    message: "browser-local / not available server-side";
  };
  circuits: {
    healthy: boolean;
    openCircuits: string[];
    breakers: TradingHealthCircuit[];
  };
}

export type TradingStreamInput = StreamSignal & { phase?: string };

export interface TradingHealthInput {
  timestamp?: number;
  env: MawsEnv;
  stream: TradingStreamInput | null;
  streamHealthy: boolean;
  snapshotAt: number | null;
  failedOrders: {
    count: number;
    recent: TradingHealthOrderFailure[];
  };
  metrics: {
    rejectedOrders: number;
    websocketReconnects: number;
    websocketErrors: number;
    reconciliationDrifts: number;
  };
  reconciliation: {
    runs: number;
    mismatches: number;
    recent: TradingHealthReconciliationMismatch[];
  };
  rateLimiter: TradingHealthRateLimiterState | null;
  circuits: Record<string, CircuitBreakerStats>;
  openCircuits: string[];
}

export function circuitHealthLevel(state: CircuitState): TradingHealthLevel {
  if (state === "closed") return "healthy";
  if (state === "half-open") return "degraded";
  return "unhealthy";
}

export function mapStreamStatus(
  stream: TradingStreamInput | null,
): TradingHealthSnapshot["feed"]["serverTradingStream"]["status"] {
  if (!stream) return "unavailable";
  if (stream.connected) return "open";
  if (stream.phase === "reconnecting" || stream.phase === "snapshot") return "reconnecting";
  return "closed";
}

export function aggregateTradingHealth(input: TradingHealthInput): TradingHealthSnapshot {
  const timestamp = input.timestamp ?? Date.now();
  const streamStatus = mapStreamStatus(input.stream);
  const streamLevel = !input.stream
    ? "unavailable"
    : input.streamHealthy && streamStatus === "open"
      ? "healthy"
      : streamStatus === "reconnecting"
        ? "degraded"
        : "unhealthy";
  const breakers = Object.entries(input.circuits).map(([name, stats]) => ({
    name,
    state: stats.state,
    level: circuitHealthLevel(stats.state),
    failureCount: stats.failureCount,
    lastFailureTime: stats.lastFailureTime,
    openedAt: stats.openedAt,
    totalRejections: stats.totalRejections,
  }));
  const hasUnhealthyCircuit = breakers.some((breaker) => breaker.level === "unhealthy");
  const hasDegradedCircuit = breakers.some((breaker) => breaker.level === "degraded");
  const chartOnlyLocal = input.env === "local" && input.stream === null;
  const level = chartOnlyLocal
    ? "unavailable"
    : hasUnhealthyCircuit || input.reconciliation.mismatches > 0 || streamLevel === "unhealthy" || streamLevel === "unavailable"
    ? "unhealthy"
    : hasDegradedCircuit || input.failedOrders.count > 0 || streamLevel === "degraded" || (input.rateLimiter?.pressure ?? 0) > 0.7
      ? "degraded"
      : "healthy";

  return {
    timestamp,
    env: input.env,
    overall: level,
    feed: {
      serverTradingStream: {
        label: "Server trading stream",
        status: streamStatus,
        level: streamLevel,
        connected: input.stream?.connected ?? null,
        phase: input.stream?.phase ?? (streamStatus === "open" ? "live" : streamStatus === "unavailable" ? null : streamStatus),
        lastMessageAt: input.stream?.lastEventAt ?? null,
        reconnects: input.stream?.reconnects ?? null,
        snapshotAt: input.snapshotAt,
      },
      marketFeed: {
        available: false,
        level: "unavailable",
        message: "browser-local / not available server-side",
      },
    },
    execution: {
      failedOrders: input.failedOrders,
      metrics: input.metrics,
      rateLimits: {
        current: input.rateLimiter,
        historicalHits: {
          available: false,
          message: "Historical rate-limit hit counts are not tracked yet",
        },
      },
      reconciliation: input.reconciliation,
    },
    strategy: {
      available: false,
      level: "unavailable",
      message: "browser-local / not available server-side",
    },
    circuits: {
      healthy: input.openCircuits.length === 0,
      openCircuits: input.openCircuits,
      breakers,
    },
  };
}
