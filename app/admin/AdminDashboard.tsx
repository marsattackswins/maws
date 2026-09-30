"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import RiskCockpit, { type RiskCockpitSnapshot } from "./RiskCockpit";
import OperationsConsole, { type PanelErrors } from "./OperationsConsole";
import AppPowerControl from "./AppPowerControl";
import type {
  BrokerHealth,
  FeedProbe,
  HealthSnapshot,
  LatencySample,
  MetricsSnapshot,
  PerformanceMetrics,
  TerminalLogsSnapshot,
  TradingHealthSnapshot,
} from "./types";

const EMPTY_ERRORS: PanelErrors = {
  health: null,
  trading: null,
  risk: null,
  performance: null,
  metrics: null,
  broker: null,
  logs: null,
};

const LATENCY_HISTORY_KEY = "maws.status.latency-history";
const ACTION_BUTTON_CLASS = "rounded border border-[#2a2e39] px-3 py-2 text-sm text-[#d1d4dc] transition-colors hover:border-[#2962ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthSnapshot | null>(null);
  const [tradingHealth, setTradingHealth] = useState<TradingHealthSnapshot | null>(null);
  const [risk, setRisk] = useState<RiskCockpitSnapshot | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLogsSnapshot | null>(null);
  const [broker, setBroker] = useState<BrokerHealth | null>(null);
  const [feedProbes, setFeedProbes] = useState<{ candlesticks: FeedProbe; quotes: FeedProbe } | null>(null);
  const [latencyHistory, setLatencyHistory] = useState<LatencySample[]>([]);
  const [errors, setErrors] = useState<PanelErrors>(EMPTY_ERRORS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setRefreshing(true);

    const results = await Promise.allSettled([
      fetchJson<HealthSnapshot>("/api/health", controller.signal),
      fetchJson<TradingHealthSnapshot>("/api/status/trading-health", controller.signal),
      fetchJson<RiskCockpitSnapshot>("/api/admin/risk", controller.signal),
      fetchJson<PerformanceMetrics>("/api/admin/performance", controller.signal),
      fetchJson<MetricsSnapshot>("/api/admin/metrics", controller.signal),
      fetchJson<BrokerHealth>("/api/health/broker", controller.signal),
      fetchJson<TerminalLogsSnapshot>("/api/admin/logs?limit=300", controller.signal),
    ]);

    if (controller.signal.aborted) return;

    const [healthResult, tradingResult, riskResult, performanceResult, metricsResult, brokerResult, logsResult] = results;
    if (healthResult.status === "fulfilled") setHealth(healthResult.value);
    if (tradingResult.status === "fulfilled") setTradingHealth(tradingResult.value);
    if (riskResult.status === "fulfilled") setRisk(riskResult.value);
    if (performanceResult.status === "fulfilled") setPerformance(performanceResult.value);
    if (metricsResult.status === "fulfilled") setMetrics(metricsResult.value);
    if (logsResult.status === "fulfilled") setTerminalLogs(logsResult.value);

    let brokerData: BrokerHealth | null = brokerResult.status === "fulfilled" ? brokerResult.value : null;
    // The broker endpoint answers 503 while degraded — still a valid observation.
    if (brokerResult.status === "rejected" && isHttpError(brokerResult.reason, 503)) {
      try {
        brokerData = await fetchJson<BrokerHealth>("/api/health/broker", controller.signal);
      } catch {
        brokerData = null;
      }
    }
    setBroker(brokerData);
    if (brokerData) {
      setLatencyHistory((prev) =>
        persistLatencyHistory([...prev, { latencyMs: brokerData!.latency_ms, checkedAt: Date.now() }].slice(-20)),
      );
    }
    setFeedProbes({
      candlesticks: await probeFeed("/api/binance/klines?symbol=BTCUSDT&interval=1m&limit=1", controller.signal),
      quotes: await probeFeed("/api/binance/ticker?symbol=BTCUSDT", controller.signal),
    });

    setErrors({
      health: resultError(healthResult, "Application health is unavailable"),
      trading: resultError(tradingResult, "Server trading health is unavailable"),
      risk: resultError(riskResult, "Risk snapshot is unavailable"),
      performance: resultError(performanceResult, "Performance metrics are unavailable"),
      metrics: resultError(metricsResult, "Recent events are unavailable"),
      broker: brokerData ? null : resultError(brokerResult, "Binance API is unreachable"),
      logs: resultError(logsResult, "Terminal logs are unavailable"),
    });
    setLastRefresh(Date.now());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setLatencyHistory(readLatencyHistory());
    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 10000);
    return () => {
      window.clearInterval(interval);
      requestRef.current?.abort();
    };
  }, [refresh]);

  const hasData = health || tradingHealth || risk || performance || metrics;

  return (
    <main className="h-screen overflow-y-auto bg-[#0b0e11] p-4 text-[#d1d4dc] sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-lg border border-[#2a2e39] bg-[#131722] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-white">Operations Console</h1>
                <EnvironmentChip env={health?.env ?? null} />
              </div>
              <p className="mt-2 max-w-2xl text-sm text-[#787b86]">
                Server health, Binance connectivity, risk, and execution activity in one view. Click any block for details.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/journal" className={ACTION_BUTTON_CLASS}>
                Trade Journal
              </Link>
              <AppPowerControl />
              <button
                type="button"
                onClick={() => void refresh()}
                className={`${ACTION_BUTTON_CLASS} inline-flex items-center gap-2`}
                disabled={refreshing}
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#2a2e39] pt-4 text-xs text-[#787b86]">
            <span>{lastRefresh ? `Last refreshed ${formatTime(lastRefresh)}` : "Collecting operational data…"}</span>
            <span>Auto-refreshes every 10 seconds</span>
          </div>
        </header>

        {hasData ? (
          <>
            <RefreshNotice errors={errors} />
            <OperationsConsole
              health={health}
              tradingHealth={tradingHealth}
              risk={risk}
              performance={performance}
              metrics={metrics}
              broker={broker}
              terminalLogs={terminalLogs}
              feedProbes={feedProbes}
              latencyHistory={latencyHistory}
              errors={errors}
              loading={loading}
              RiskPanel={RiskCockpit}
            />
          </>
        ) : loading ? (
          <LoadingState />
        ) : (
          <FailureState onRetry={() => void refresh()} />
        )}
      </div>
    </main>
  );
}

function RefreshNotice({ errors }: { errors: PanelErrors }) {
  const failed = Object.entries(errors).filter(([, message]) => message);
  if (failed.length === 0) return null;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded border border-[#5a4320] bg-[#211d16] px-3 py-2 text-xs text-[#f7931a]">
      <AlertTriangle size={14} />
      <span>
        Some panels are showing their last successful snapshot or are unavailable: {formatFailedPanels(failed)}.
      </span>
    </div>
  );
}

function formatFailedPanels(failed: Array<[string, string | null]>): string {
  const labels: Record<string, string> = {
    health: "application health",
    trading: "server trading",
    risk: "risk",
    performance: "performance",
    metrics: "recent events",
    broker: "Binance API",
    logs: "terminal logs",
  };
  return failed.map(([key]) => labels[key] ?? key).join(", ");
}

function EnvironmentChip({ env }: { env: string | null }) {
  const label = formatEnvironment(env);
  const className = env === "production"
    ? "border-[#f0b90b]/50 bg-[#f0b90b]/10 text-[#f0b90b]"
    : env === "testnet"
      ? "border-[#2962ff]/50 bg-[#2962ff]/10 text-[#6f9bff]"
      : "border-[#586174] bg-[#252a33] text-[#b9c0cc]";
  return <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />{label}</span>;
}

function LoadingState() {
  return <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-8 text-center text-sm text-[#787b86]">Loading operational data…</div>;
}

function FailureState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-[#5b2028] bg-[#211518] p-8 text-center">
      <XCircle size={22} className="mx-auto text-[#f23645]" />
      <div className="mt-3 text-sm text-[#f23645]">The operations snapshot could not be loaded.</div>
      <button type="button" onClick={onRetry} className={`${ACTION_BUTTON_CLASS} mt-4`}>Try again</button>
    </div>
  );
}

function formatEnvironment(env: string | null): string {
  if (env === "local") return "Chart Only";
  if (env === "testnet") return "Binance Testnet";
  if (env === "production") return "Binance Production";
  return env ?? "Environment unavailable";
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

function isHttpError(reason: unknown, status: number): boolean {
  return reason instanceof Error && reason.message.endsWith(`returned ${status}`);
}

function readLatencyHistory(): LatencySample[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(LATENCY_HISTORY_KEY) ?? "null");
    if (!Array.isArray(stored)) return [];
    return stored
      .filter(
        (sample): sample is LatencySample =>
          sample != null &&
          typeof sample.latencyMs === "number" &&
          Number.isFinite(sample.latencyMs) &&
          typeof sample.checkedAt === "number" &&
          Number.isFinite(sample.checkedAt),
      )
      .slice(-20);
  } catch {
    return [];
  }
}

function persistLatencyHistory(samples: LatencySample[]): LatencySample[] {
  try {
    window.localStorage.setItem(LATENCY_HISTORY_KEY, JSON.stringify(samples));
  } catch {
    // Local storage may be unavailable in private or restricted browser contexts.
  }
  return samples;
}

async function probeFeed(url: string, signal: AbortSignal): Promise<FeedProbe> {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { signal, cache: "no-store" });
    return {
      level: response.ok ? "healthy" : "unhealthy",
      latencyMs: Date.now() - startedAt,
    };
  } catch {
    return { level: "unavailable", latencyMs: null };
  }
}

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json() as Promise<T>;
}

function resultError<T>(result: PromiseSettledResult<T>, fallback: string): string | null {
  if (result.status === "fulfilled") return null;
  if (result.reason instanceof Error && result.reason.name === "AbortError") return null;
  return result.reason instanceof Error ? result.reason.message : fallback;
}
