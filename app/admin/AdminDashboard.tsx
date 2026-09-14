"use client";

import Link from "next/link";
import { AlertTriangle, Database, RefreshCw, Server, ShieldCheck, Wifi, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import RiskCockpit, { type RiskCockpitSnapshot } from "./RiskCockpit";
import type { TradingHealthSnapshot } from "../status/TradingHealthSection";

type DashboardTab = "overview" | "risk";
type StatusTone = "healthy" | "warning" | "danger" | "muted";
type PanelKey = "health" | "trading" | "risk" | "performance" | "metrics";

type HealthSnapshot = {
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
};

type PerformanceMetrics = {
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
};

type LatencyStats = {
  avg: string;
  p50: number;
  p95: number;
  p99: number;
};

type MetricEvent = {
  ts: number;
  type: string;
  label: string;
  details?: Record<string, unknown>;
};

type MetricsSnapshot = {
  timestamp: number;
  recent_events: MetricEvent[];
};

type PanelErrors = Record<PanelKey, string | null>;

const EMPTY_ERRORS: PanelErrors = {
  health: null,
  trading: null,
  risk: null,
  performance: null,
  metrics: null,
};

const ACTION_BUTTON_CLASS = "rounded border border-[#2a2e39] px-3 py-2 text-sm text-[#d1d4dc] transition-colors hover:border-[#2962ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [health, setHealth] = useState<HealthSnapshot | null>(null);
  const [tradingHealth, setTradingHealth] = useState<TradingHealthSnapshot | null>(null);
  const [risk, setRisk] = useState<RiskCockpitSnapshot | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
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
    ]);

    if (controller.signal.aborted) return;

    const [healthResult, tradingResult, riskResult, performanceResult, metricsResult] = results;
    if (healthResult.status === "fulfilled") setHealth(healthResult.value);
    if (tradingResult.status === "fulfilled") setTradingHealth(tradingResult.value);
    if (riskResult.status === "fulfilled") setRisk(riskResult.value);
    if (performanceResult.status === "fulfilled") setPerformance(performanceResult.value);
    if (metricsResult.status === "fulfilled") setMetrics(metricsResult.value);

    setErrors({
      health: resultError(healthResult, "Application health is unavailable"),
      trading: resultError(tradingResult, "Server trading health is unavailable"),
      risk: resultError(riskResult, "Risk snapshot is unavailable"),
      performance: resultError(performanceResult, "Performance metrics are unavailable"),
      metrics: resultError(metricsResult, "Recent events are unavailable"),
    });
    setLastRefresh(Date.now());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
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
                The operator view for server health, order readiness, risk, and execution activity.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/status" className={ACTION_BUTTON_CLASS}>
                System Status
              </Link>
              <Link href="/admin/journal" className={ACTION_BUTTON_CLASS}>
                Trade Journal
              </Link>
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

            <div className="mb-6 flex gap-1 border-b border-[#2a2e39]">
              <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                Overview
              </TabButton>
              <TabButton active={activeTab === "risk"} onClick={() => setActiveTab("risk")}>
                Risk &amp; Exposure
              </TabButton>
            </div>

            {activeTab === "risk" ? (
              <RiskCockpit risk={risk} loading={loading && !risk} error={errors.risk} />
            ) : (
              <>
                <DecisionOverview health={health} risk={risk} />

                <ServerTradingCompact
                  health={health}
                  tradingHealth={tradingHealth}
                  loading={loading && !tradingHealth}
                  error={errors.trading}
                />

                <details className="mt-8 rounded-lg border border-[#2a2e39] bg-[#131722] p-5">
                  <summary className="cursor-pointer list-none font-medium text-white">
                    <span className="flex items-center justify-between gap-3">
                      <span>Advanced diagnostics</span>
                      <span className="text-xs font-normal text-[#787b86]">Performance metrics and recent server events</span>
                    </span>
                  </summary>
                  <div className="mt-5">
                    <PerformanceSection performance={performance} loading={loading && !performance} error={errors.performance} />
                    <RecentEvents metrics={metrics} loading={loading && !metrics} error={errors.metrics} />
                  </div>
                </details>
              </>
            )}
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

function DecisionOverview({ health, risk }: { health: HealthSnapshot | null; risk: RiskCockpitSnapshot | null }) {
  const overall = getOverallStatus(health);
  const submission = getSubmissionStatus(health);
  const riskState = getRiskStatus(risk);
  const cards = [
    { label: "Environment", value: formatEnvironment(health?.env ?? null), detail: "Current operating mode", tone: "muted" as StatusTone },
    { label: "System health", value: overall.label, detail: health?.healthy ? "Core services are responding" : "Review the server health details", tone: overall.tone },
    { label: "Order submissions", value: submission.label, detail: submissionDetail(health), tone: submission.tone },
    { label: "Risk state", value: riskState.label, detail: riskState.detail, tone: riskState.tone },
  ];

  return (
    <section aria-labelledby="decision-overview-heading">
      <div className="mb-3">
        <h2 id="decision-overview-heading" className="text-lg font-semibold text-white">Decision overview</h2>
        <p className="mt-1 text-sm text-[#787b86]">The four things to check before investigating technical details.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <DecisionCard key={card.label} {...card} />)}
      </div>
    </section>
  );
}

function DecisionCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: StatusTone }) {
  return (
    <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide text-[#787b86]">
        <span>{label}</span>
        <StatusDot tone={tone} />
      </div>
      <div className={`mt-4 text-lg font-semibold ${toneText(tone)}`}>{value}</div>
      <div className="mt-1 truncate text-xs text-[#787b86]" title={detail}>{detail}</div>
    </div>
  );
}

function ServerTradingCompact({
  health,
  tradingHealth,
  loading,
  error,
}: {
  health: HealthSnapshot | null;
  tradingHealth: TradingHealthSnapshot | null;
  loading: boolean;
  error: string | null;
}) {
  const stream = tradingHealth?.feed.serverTradingStream;
  const reconciliation = tradingHealth?.execution.reconciliation;
  const circuits = tradingHealth?.circuits;
  const submission = getSubmissionStatus(health);
  const chartOnly = health?.env === "local" && health.managerStatus === "idle";
  const statuses = [
    {
      icon: <Server size={16} />,
      label: "Manager",
      value: formatManagerStatus(health?.managerStatus ?? null),
      detail: health?.managerError ?? "Profile coordinator",
      tone: health?.managerReady ? "healthy" as StatusTone : chartOnly ? "muted" as StatusTone : "warning" as StatusTone,
    },
    {
      icon: <Wifi size={16} />,
      label: "Private stream",
      value: stream ? formatStreamStatus(stream.status) : chartOnly ? "Not required" : "Unavailable",
      detail: stream?.lastMessageAt ? `Last message ${formatTime(stream.lastMessageAt)}` : "Account data feed",
      tone: stream?.level === "healthy" ? "healthy" as StatusTone : chartOnly ? "muted" as StatusTone : "warning" as StatusTone,
    },
    {
      icon: <Database size={16} />,
      label: "Reconciliation",
      value: reconciliation ? `${reconciliation.mismatches} mismatch${reconciliation.mismatches === 1 ? "" : "es"}` : chartOnly ? "Not required" : "Unavailable",
      detail: reconciliation ? `${reconciliation.runs} total runs` : "Account consistency",
      tone: reconciliation?.mismatches === 0 ? "healthy" as StatusTone : chartOnly ? "muted" as StatusTone : "warning" as StatusTone,
    },
    {
      icon: <ShieldCheck size={16} />,
      label: "Safety breakers",
      value: circuits ? (circuits.healthy ? "All closed" : `${circuits.openCircuits.length} need attention`) : "Unavailable",
      detail: circuits?.openCircuits.length ? circuits.openCircuits.join(", ") : "Execution safety controls",
      tone: circuits?.healthy ? "healthy" as StatusTone : "warning" as StatusTone,
    },
  ];

  return (
    <section className="mt-8" aria-labelledby="server-trading-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="server-trading-heading" className="text-lg font-semibold text-white">Server Trading</h2>
          <p className="mt-1 text-sm text-[#787b86]">A compact readiness view for the server-side trading infrastructure.</p>
        </div>
      </div>
      {loading && !health && !tradingHealth ? <PanelMessage>Loading server trading state…</PanelMessage> : error && !health && !tradingHealth ? <PanelMessage tone="yellow">{error}</PanelMessage> : (
        <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4 sm:p-5">
          <div className="mb-4 border-b border-[#2a2e39] pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-[#787b86]">Order submissions</div>
                <div className={`mt-1 text-xl font-semibold ${toneText(submission.tone)}`}>{submission.label}</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <StatusDot tone={submission.tone} />
                <span className={toneText(submission.tone)}>{submissionDetail(health)}</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statuses.map((status) => <CompactStatus key={status.label} {...status} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function CompactStatus({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: StatusTone }) {
  return (
    <div className="rounded border border-[#2a2e39] bg-[#171b21] p-3">
      <div className="flex items-center gap-2 text-xs text-[#787b86]">{icon}<span>{label}</span></div>
      <div className={`mt-3 font-medium ${toneText(tone)}`}>{value}</div>
      <div className="mt-1 truncate text-xs text-[#787b86]" title={detail}>{detail}</div>
    </div>
  );
}

function PerformanceSection({ performance, loading, error }: { performance: PerformanceMetrics | null; loading: boolean; error: string | null }) {
  return (
    <section className="mt-8" aria-labelledby="performance-heading">
      <div className="mb-3">
        <h2 id="performance-heading" className="text-lg font-semibold text-white">Performance and activity</h2>
        <p className="mt-1 text-sm text-[#787b86]">Server-side counters and latency summaries. These are cumulative since the process started.</p>
      </div>
      {loading && !performance ? <PanelMessage>Loading performance metrics…</PanelMessage> : error && !performance ? <PanelMessage tone="yellow">{error}</PanelMessage> : performance ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <MetricPanel title="Order flow">
            <MetricRow label="Submitted" value={performance.orders.submitted} />
            <MetricRow label="Filled" value={performance.orders.filled} />
            <MetricRow label="Canceled" value={performance.orders.canceled} />
            <MetricRow label="Rejected" value={performance.orders.rejected} tone={performance.orders.rejected > 0 ? "warning" : "muted"} />
            <MetricRow label="Fill rate" value={`${performance.orders.fill_rate_pct}%`} />
            <MetricRow label="Submission p95" value={latency(performance.orders.submission_latency_ms?.p95)} />
          </MetricPanel>
          <MetricPanel title="Application API">
            <MetricRow label="Requests" value={performance.api.requests} />
            <MetricRow label="Errors" value={performance.api.errors} tone={performance.api.errors > 0 ? "warning" : "muted"} />
            <MetricRow label="Error rate" value={`${performance.api.error_rate_pct}%`} />
            <MetricRow label="Latency average" value={latency(performance.api.latency_ms?.avg)} />
            <MetricRow label="Latency p95" value={latency(performance.api.latency_ms?.p95)} />
          </MetricPanel>
          <MetricPanel title="Private stream">
            <MetricRow label="Messages" value={performance.websocket.messages} />
            <MetricRow label="Reconnects" value={performance.websocket.reconnects} tone={performance.websocket.reconnects > 0 ? "warning" : "muted"} />
            <MetricRow label="Errors" value={performance.websocket.errors} tone={performance.websocket.errors > 0 ? "warning" : "muted"} />
            <MetricRow label="Lag p95" value={latency(performance.websocket.lag_ms?.p95)} />
            <MetricRow label="Last event" value={age(performance.websocket.last_event_age_ms)} />
          </MetricPanel>
          <MetricPanel title="Reconciliation and safety">
            <MetricRow label="Runs" value={performance.reconciliation.runs} />
            <MetricRow label="Drift detected" value={performance.reconciliation.drift_detected} tone={performance.reconciliation.drift_detected > 0 ? "warning" : "muted"} />
            <MetricRow label="Drift rate" value={`${performance.reconciliation.drift_rate_pct}%`} />
            <MetricRow label="Average duration" value={latency(performance.reconciliation.duration_ms?.avg)} />
            <MetricRow label="Freeze events" value={performance.risk.freeze_events} tone={performance.risk.freeze_events > 0 ? "warning" : "muted"} />
            <MetricRow label="Limit breaches" value={performance.risk.limit_breaches} tone={performance.risk.limit_breaches > 0 ? "warning" : "muted"} />
          </MetricPanel>
        </div>
      ) : <PanelMessage>No performance data available.</PanelMessage>}
    </section>
  );
}

function RecentEvents({ metrics, loading, error }: { metrics: MetricsSnapshot | null; loading: boolean; error: string | null }) {
  return (
    <section className="mt-8" aria-labelledby="events-heading">
      <div className="mb-3">
        <h2 id="events-heading" className="text-lg font-semibold text-white">Recent server events</h2>
        <p className="mt-1 text-sm text-[#787b86]">A compact operational trail. Use the Trade Journal for order-level history.</p>
      </div>
      {loading && !metrics ? <PanelMessage>Loading recent events…</PanelMessage> : error && !metrics ? <PanelMessage tone="yellow">{error}</PanelMessage> : (
        <div className="overflow-hidden rounded-lg border border-[#2a2e39] bg-[#131722]">
          {metrics?.recent_events.length ? metrics.recent_events.slice().reverse().slice(0, 12).map((event, index) => (
            <div key={`${event.ts}-${event.type}-${index}`} className="flex flex-wrap items-center gap-3 border-b border-[#2a2e39] px-4 py-3 text-sm last:border-0">
              <span className="w-20 shrink-0 font-mono text-xs text-[#787b86]">{formatTime(event.ts)}</span>
              <span className="rounded border border-[#2a2e39] bg-[#1e2329] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#9aa1ad]">{event.type}</span>
              <span className="min-w-0 flex-1 text-[#d1d4dc]">{event.label}</span>
            </div>
          )) : <div className="px-4 py-6 text-sm text-[#787b86]">No server events recorded yet.</div>}
        </div>
      )}
    </section>
  );
}

function MetricPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-5">
      <h3 className="mb-4 font-medium text-white">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function MetricRow({ label, value, tone = "muted" }: { label: string; value: string | number; tone?: StatusTone }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-[#787b86]">{label}</span>
      <span className={`font-mono ${toneText(tone)}`}>{value}</span>
    </div>
  );
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

function StatusDot({ tone }: { tone: StatusTone }) {
  return <span className={`h-2 w-2 shrink-0 rounded-full ${toneDot(tone)}`} aria-hidden="true" />;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${active ? "border-[#2962ff] text-[#d1d4dc]" : "border-transparent text-[#787b86] hover:text-[#d1d4dc]"}`}>
      {children}
    </button>
  );
}

function RefreshNotice({ errors }: { errors: PanelErrors }) {
  const failed = Object.entries(errors).filter(([, message]) => message);
  if (failed.length === 0) return null;
  const labels: Record<string, string> = {
    health: "application health",
    trading: "server trading",
    risk: "risk",
    performance: "performance",
    metrics: "recent events",
  };
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded border border-[#5a4320] bg-[#211d16] px-3 py-2 text-xs text-[#f7931a]">
      <AlertTriangle size={14} />
      <span>Some panels are showing their last successful snapshot or are unavailable: {failed.map(([key]) => labels[key] ?? key).join(", ")}.</span>
    </div>
  );
}

function PanelMessage({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "yellow" }) {
  return <div className={`rounded-lg border border-[#2a2e39] bg-[#131722] p-5 text-sm ${tone === "yellow" ? "text-[#f7931a]" : "text-[#787b86]"}`}>{children}</div>;
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

function getOverallStatus(health: HealthSnapshot | null): { label: string; tone: StatusTone } {
  if (!health) return { label: "Unavailable", tone: "muted" };
  if (health.healthy) return { label: "Healthy", tone: "healthy" };
  return { label: "Needs attention", tone: "warning" };
}

function getSubmissionStatus(health: HealthSnapshot | null): { label: string; tone: StatusTone } {
  if (!health) return { label: "Unavailable", tone: "muted" };
  if (health.env === "local" && health.managerStatus === "idle") return { label: "Chart-only", tone: "muted" };
  return health.execution.canSubmit ? { label: "Ready", tone: "healthy" } : { label: "Blocked", tone: "warning" };
}

function submissionDetail(health: HealthSnapshot | null): string {
  if (!health) return "Readiness unavailable";
  if (health.env === "local" && health.managerStatus === "idle") return "Orders intentionally blocked in Chart Only mode";
  const reason = health.execution.reasons[0] ?? "";
  const normalizedReason = reason.toLowerCase();
  if (normalizedReason.includes("runtime execution flag")) return "Runtime switch is off — reconnect the profile";

  if (normalizedReason.includes("stream")) return "Private account stream is not ready";
  return reason || (health.execution.canSubmit ? "All execution checks passed" : "Safety checks are blocking orders");
}

function getRiskStatus(risk: RiskCockpitSnapshot | null): { label: string; tone: StatusTone; detail: string } {
  if (!risk) return { label: "Unavailable", tone: "muted", detail: "Risk data is still loading" };
  if (!risk.sourceAvailable) return { label: "Unavailable", tone: "muted", detail: risk.sourceMessage ?? "No server-side risk state" };
  const statuses = [
    risk.limits.maxOrderNotional.status,
    risk.limits.grossExposure.status,
    risk.limits.positionCount.status,
    risk.limits.dailyLoss.status,
  ];
  if (statuses.includes("red")) return { label: "Critical", tone: "danger", detail: "A risk limit needs immediate attention" };
  if (statuses.includes("yellow")) return { label: "Review", tone: "warning", detail: "Risk utilization is elevated" };
  return { label: "Normal", tone: "healthy", detail: "Configured risk limits are within range" };
}

function formatEnvironment(env: string | null): string {
  if (env === "local") return "Chart Only";
  if (env === "testnet") return "Binance Testnet";
  if (env === "production") return "Binance Production";
  return env ?? "Environment unavailable";
}

function formatManagerStatus(status: string | null): string {
  if (status === "ready") return "Ready";
  if (status === "idle") return "Not running";
  if (status === "degraded") return "Degraded";
  return status ?? "Unavailable";
}

function formatStreamStatus(status: string): string {
  if (status === "open") return "Healthy";
  if (status === "reconnecting") return "Reconnecting";
  if (status === "closed") return "Offline";
  return "Unavailable";
}


function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

function age(milliseconds: number | null): string {
  if (milliseconds == null) return "N/A";
  if (milliseconds < 1000) return "Just now";
  return `${Math.floor(milliseconds / 1000)}s ago`;
}

function latency(value: number | string | undefined): string {
  return value == null ? "N/A" : `${value}ms`;
}


function resultError<T>(result: PromiseSettledResult<T>, fallback: string): string | null {
  if (result.status === "fulfilled") return null;
  if (result.reason instanceof Error && result.reason.name === "AbortError") return null;
  return result.reason instanceof Error ? result.reason.message : fallback;
}

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json() as Promise<T>;
}

function toneText(tone: StatusTone): string {
  if (tone === "healthy") return "text-[#089981]";
  if (tone === "warning") return "text-[#f7931a]";
  if (tone === "danger") return "text-[#f23645]";
  return "text-[#d1d4dc]";
}

function toneDot(tone: StatusTone): string {
  if (tone === "healthy") return "bg-[#089981]";
  if (tone === "warning") return "bg-[#f7931a]";
  if (tone === "danger") return "bg-[#f23645]";
  return "bg-[#787b86]";
}
