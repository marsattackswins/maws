import { NextRequest, NextResponse } from "next/server";
import { getMetrics, METRICS } from "@/lib/server/metrics/collector";
import { liveState } from "@/lib/server/binance/state";
import { serverConfig } from "@/lib/server/env/config";
import { authenticate, isAuthFailure } from "@/lib/server/http/guards";

/**
 * GET /api/admin/performance
 * Returns trading performance metrics.
 * In local mode: No authentication required.
 * In other modes: Requires operator authentication.
 */
export async function GET(req: NextRequest) {
  const cfg = serverConfig();

  // Local mode is unauthenticated, but performance values remain sourced from
  // the real in-memory collector.
  if (cfg.env !== "local") {
    // Non-local mode: check authentication
  const ctx = authenticate(req, cfg);
    if (isAuthFailure(ctx)) return ctx.response;
  }

  try {
    const metrics = getMetrics();
    const snapshot = metrics.snapshot();
    const state = liveState();

    // Calculate performance stats
    const ordersSubmitted = metrics.getCounter(METRICS.ORDER_SUBMITTED);
    const ordersFilled = metrics.getCounter(METRICS.ORDER_FILLED);
    const ordersCanceled = metrics.getCounter(METRICS.ORDER_CANCELED);
    const ordersRejected = metrics.getCounter(METRICS.ORDER_REJECTED);

    const fillRate = ordersSubmitted > 0
      ? (ordersFilled / ordersSubmitted * 100).toFixed(1)
      : "0.0";

    // API performance
    const apiRequests = metrics.getCounter(METRICS.API_REQUEST);
    const apiErrors = metrics.getCounter(METRICS.API_ERROR);
    const apiLatency = snapshot.histograms[METRICS.API_LATENCY_MS];

    // WebSocket stats
    const wsMessages = metrics.getCounter(METRICS.WS_MESSAGE_RECEIVED);
    const wsReconnects = metrics.getCounter(METRICS.WS_RECONNECT);
    const wsErrors = metrics.getCounter(METRICS.WS_ERROR);
    const wsLag = snapshot.histograms[METRICS.WS_LAG_MS];

    // Order submission latency
    const orderLatency = snapshot.histograms[METRICS.ORDER_SUBMISSION_DURATION_MS];

    // Reconciliation
    const reconRuns = metrics.getCounter(METRICS.RECON_RUN);
    const reconDrift = metrics.getCounter(METRICS.RECON_DRIFT_DETECTED);
    const reconLatency = snapshot.histograms[METRICS.RECON_DURATION_MS];

    const response = {
      timestamp: Date.now(),
      uptime_seconds: metrics.getUptimeSeconds(),

      orders: {
        submitted: ordersSubmitted,
        filled: ordersFilled,
        canceled: ordersCanceled,
        rejected: ordersRejected,
        fill_rate_pct: fillRate,
        submission_latency_ms: orderLatency ? {
          avg: orderLatency.count > 0 ? (orderLatency.sum / orderLatency.count).toFixed(0) : 0,
          p50: orderLatency.p50,
          p95: orderLatency.p95,
          p99: orderLatency.p99,
        } : null,
      },

      fills: {
        count: metrics.getCounter(METRICS.FILL_RECEIVED),
        slippage_bps: snapshot.histograms[METRICS.FILL_SLIPPAGE_BPS] ? {
          avg: snapshot.histograms[METRICS.FILL_SLIPPAGE_BPS].sum / snapshot.histograms[METRICS.FILL_SLIPPAGE_BPS].count,
          p95: snapshot.histograms[METRICS.FILL_SLIPPAGE_BPS].p95,
        } : null,
      },

      api: {
        requests: apiRequests,
        errors: apiErrors,
        error_rate_pct: apiRequests > 0 ? ((apiErrors / apiRequests) * 100).toFixed(2) : "0.00",
        latency_ms: apiLatency ? {
          avg: apiLatency.count > 0 ? (apiLatency.sum / apiLatency.count).toFixed(0) : 0,
          p50: apiLatency.p50,
          p95: apiLatency.p95,
          p99: apiLatency.p99,
        } : null,
      },

      websocket: {
        messages: wsMessages,
        reconnects: wsReconnects,
        errors: wsErrors,
        lag_ms: wsLag ? {
          avg: wsLag.count > 0 ? (wsLag.sum / wsLag.count).toFixed(0) : 0,
          p95: wsLag.p95,
        } : null,
        last_event_age_ms: state.lastEventTime ? Date.now() - state.lastEventTime : null,
      },

      reconciliation: {
        runs: reconRuns,
        drift_detected: reconDrift,
        drift_rate_pct: reconRuns > 0 ? ((reconDrift / reconRuns) * 100).toFixed(1) : "0.0",
        duration_ms: reconLatency ? {
          avg: reconLatency.count > 0 ? (reconLatency.sum / reconLatency.count).toFixed(0) : 0,
          p95: reconLatency.p95,
        } : null,
      },

      risk: {
        freeze_events: metrics.getCounter(METRICS.FREEZE_TRIGGERED),
        limit_breaches: metrics.getCounter(METRICS.RISK_LIMIT_BREACH),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Performance metrics error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to collect performance metrics",
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
