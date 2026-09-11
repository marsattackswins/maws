"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle, Clock, Database, TrendingUp, Wifi, XCircle } from "lucide-react";
import RiskCockpit, { type RiskCockpitSnapshot } from "./RiskCockpit";

interface HealthStatus {
  overall: "healthy" | "degraded" | "down";
  components: {
    webSocket: ComponentHealth;
    api: ComponentHealth;
    clock: ComponentHealth;
    database: ComponentHealth;
  };
  trading: {
    openOrders: number;
    openPositions: number;
    grossExposureUsd: number;
    balanceUsd: number;
    frozen: boolean;
    executionEnabled: boolean;
  };
  uptime: {
    seconds: number;
    formatted: string;
  };
  lastUpdated: number;
}

interface ComponentHealth {
  status: "healthy" | "degraded" | "down";
  message: string;
  lastCheck: number;
}

interface PerformanceMetrics {
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
  uptime_seconds: number;
}

interface LatencyStats {
  avg: string;
  p50: number;
  p95: number;
  p99: number;
}

interface MetricEvent {
  ts: number;
  type: string;
  label: string;
  details?: Record<string, unknown>;
}

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [events, setEvents] = useState<MetricEvent[]>([]);
  const [risk, setRisk] = useState<RiskCockpitSnapshot | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"status" | "risk">("status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [healthRes, perfRes, metricsRes] = await Promise.all([
        fetch("/api/admin/health"),
        fetch("/api/admin/performance"),
        fetch("/api/admin/metrics"),
      ]);

      if (!healthRes.ok) {
        if (healthRes.status === 401) {
          throw new Error("Not authenticated. Please login first.");
        }
        throw new Error(`Health check failed: ${healthRes.statusText}`);
      }

      if (!perfRes.ok) {
        throw new Error(`Performance check failed: ${perfRes.statusText}`);
      }

      if (!metricsRes.ok) {
        throw new Error(`Metrics fetch failed: ${metricsRes.statusText}`);
      }

      const healthData = await healthRes.json();
      const perfData = await perfRes.json();
      const metricsData = await metricsRes.json();

      setHealth(healthData);
      setPerformance(perfData);
      setEvents(metricsData.recent_events || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab !== "risk") return;

    let cancelled = false;
    const fetchRisk = async () => {
      setRiskLoading(true);
      try {
        const response = await fetch("/api/admin/risk");
        if (!response.ok) throw new Error(`Risk check failed: ${response.statusText}`);
        const data = (await response.json()) as RiskCockpitSnapshot;
        if (!cancelled) {
          setRisk(data);
          setRiskError(null);
        }
      } catch (err) {
        if (!cancelled) setRiskError(err instanceof Error ? err.message : "Failed to load risk data");
      } finally {
        if (!cancelled) setRiskLoading(false);
      }
    };

    fetchRisk();
    const interval = setInterval(fetchRisk, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0e11]">
        <div className="text-center">
          <div className="text-[#787b86] mb-2">Loading metrics...</div>
          <div className="text-xs text-[#787b86]">If this persists, check that MAWS is running</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0e11]">
        <div className="max-w-md text-center">
          <div className="text-[#f23645] mb-4 text-lg">Failed to Load Metrics</div>
          <div className="text-[#787b86] text-sm mb-4">{error}</div>
          <div className="text-xs text-[#787b86]">
            <p className="mb-2">Common issues:</p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>MAWS is running in local mode (no live trading)</li>
              <li>Not logged in as operator</li>
              <li>Server is not running</li>
            </ul>
            <p className="mt-4">
              Try: <a href="/login" className="text-[#2962ff] underline">Login</a> or check console logs
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!health || !performance) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0e11]">
        <div className="text-[#787b86]">No data available</div>
      </div>
    );
  }

  const statusColor = {
    healthy: "#089981",
    degraded: "#f7931a",
    down: "#f23645",
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "healthy") return <CheckCircle size={16} color="#089981" />;
    if (status === "degraded") return <AlertCircle size={16} color="#f7931a" />;
    return <XCircle size={16} color="#f23645" />;
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] p-6 text-[#d1d4dc]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">MAWS Live Status</h1>
          <div className="flex items-center gap-4 text-sm text-[#787b86]">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: statusColor[health.overall] }}
            />
            <span className="uppercase">{health.overall}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Uptime: {health.uptime.formatted}</span>
          </div>
          <div className="text-[#787b86]">
            Updated: {new Date(health.lastUpdated).toLocaleTimeString()}
          </div>
          </div>
        </div>
        <Link
          href="/admin/journal"
          className="rounded border border-[#2a2e39] px-3 py-2 text-sm text-[#d1d4dc] transition-colors hover:border-[#2962ff] hover:text-white"
        >
          Trade Journal
        </Link>
      </div>

      <div className="mb-6 flex gap-1 border-b border-[#2a2e39]">
        <button
          type="button"
          onClick={() => setActiveTab("status")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "status"
              ? "border-[#2962ff] text-[#d1d4dc]"
              : "border-transparent text-[#787b86] hover:text-[#d1d4dc]"
          }`}
        >
          Status &amp; Metrics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("risk")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "risk"
              ? "border-[#2962ff] text-[#d1d4dc]"
              : "border-transparent text-[#787b86] hover:text-[#d1d4dc]"
          }`}
        >
          Risk &amp; Exposure
        </button>
      </div>

      {activeTab === "risk" ? (
        <RiskCockpit risk={risk} loading={riskLoading} error={riskError} />
      ) : (
        <>
          {/* Health Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HealthCard
          icon={<Wifi size={20} />}
          title="WebSocket"
          status={health.components.webSocket.status}
          message={health.components.webSocket.message}
        />
        <HealthCard
          icon={<Activity size={20} />}
          title="Binance API"
          status={health.components.api.status}
          message={health.components.api.message}
        />
        <HealthCard
          icon={<Clock size={20} />}
          title="Clock Sync"
          status={health.components.clock.status}
          message={health.components.clock.message}
        />
        <HealthCard
          icon={<Database size={20} />}
          title="Database"
          status={health.components.database.status}
          message={health.components.database.message}
        />
      </div>

      {/* Trading State */}
      <div className="mb-6 rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
          <TrendingUp size={20} />
          Trading State
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Open Orders" value={health.trading.openOrders} />
          <Stat label="Open Positions" value={health.trading.openPositions} />
          <Stat
            label="Gross Exposure"
            value={`$${health.trading.grossExposureUsd.toFixed(0)}`}
          />
          <Stat
            label="Balance"
            value={`$${health.trading.balanceUsd.toFixed(0)}`}
          />
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <StatusIcon
              status={health.trading.frozen ? "down" : "healthy"}
            />
            <span>
              {health.trading.frozen ? "FROZEN" : "Active"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon
              status={health.trading.executionEnabled ? "healthy" : "degraded"}
            />
            <span>
              Execution {health.trading.executionEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Orders */}
        <MetricCard title="Orders">
          <div className="space-y-2">
            <MetricRow
              label="Submitted"
              value={performance.orders.submitted}
            />
            <MetricRow label="Filled" value={performance.orders.filled} />
            <MetricRow
              label="Canceled"
              value={performance.orders.canceled}
            />
            <MetricRow
              label="Rejected"
              value={performance.orders.rejected}
            />
            <MetricRow
              label="Fill Rate"
              value={`${performance.orders.fill_rate_pct}%`}
            />
            {performance.orders.submission_latency_ms && (
              <MetricRow
                label="Latency (p95)"
                value={`${performance.orders.submission_latency_ms.p95}ms`}
              />
            )}
          </div>
        </MetricCard>

        {/* API */}
        <MetricCard title="API Performance">
          <div className="space-y-2">
            <MetricRow label="Requests" value={performance.api.requests} />
            <MetricRow label="Errors" value={performance.api.errors} />
            <MetricRow
              label="Error Rate"
              value={`${performance.api.error_rate_pct}%`}
            />
            {performance.api.latency_ms && (
              <>
                <MetricRow
                  label="Latency (avg)"
                  value={`${performance.api.latency_ms.avg}ms`}
                />
                <MetricRow
                  label="Latency (p95)"
                  value={`${performance.api.latency_ms.p95}ms`}
                />
              </>
            )}
          </div>
        </MetricCard>

        {/* WebSocket */}
        <MetricCard title="WebSocket">
          <div className="space-y-2">
            <MetricRow
              label="Messages"
              value={performance.websocket.messages}
            />
            <MetricRow
              label="Reconnects"
              value={performance.websocket.reconnects}
            />
            <MetricRow label="Errors" value={performance.websocket.errors} />
            {performance.websocket.lag_ms && (
              <MetricRow
                label="Lag (p95)"
                value={`${performance.websocket.lag_ms.p95}ms`}
              />
            )}
            {performance.websocket.last_event_age_ms !== null && (
              <MetricRow
                label="Last Event"
                value={`${Math.floor(performance.websocket.last_event_age_ms / 1000)}s ago`}
              />
            )}
          </div>
        </MetricCard>

        {/* Reconciliation */}
        <MetricCard title="Reconciliation">
          <div className="space-y-2">
            <MetricRow label="Runs" value={performance.reconciliation.runs} />
            <MetricRow
              label="Drift Detected"
              value={performance.reconciliation.drift_detected}
            />
            <MetricRow
              label="Drift Rate"
              value={`${performance.reconciliation.drift_rate_pct}%`}
            />
            {performance.reconciliation.duration_ms && (
              <MetricRow
                label="Duration (avg)"
                value={`${performance.reconciliation.duration_ms.avg}ms`}
              />
            )}
            <MetricRow
              label="Freeze Events"
              value={performance.risk.freeze_events}
            />
          </div>
        </MetricCard>
      </div>

      {/* Recent Events */}
      <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
        <h2 className="mb-4 text-lg font-medium">Recent Events</h2>
        <div className="space-y-1 text-sm">
          {events.length === 0 ? (
            <div className="text-[#787b86]">No events yet</div>
          ) : (
            events.slice().reverse().slice(0, 15).map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-[#2a2e39] py-2 last:border-0"
              >
                <span className="text-[#787b86]">
                  {new Date(event.ts).toLocaleTimeString()}
                </span>
                <span className="rounded bg-[#2a2e39] px-2 py-0.5 text-xs uppercase">
                  {event.type}
                </span>
                <span className="flex-1">{event.label}</span>
              </div>
            ))
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}

function HealthCard({
  icon,
  title,
  status,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  message: string;
}) {
  const statusColors = {
    healthy: "#089981",
    degraded: "#f7931a",
    down: "#f23645",
  };

  return (
    <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
        />
      </div>
      <div className="text-sm text-[#787b86]">{message}</div>
    </div>
  );
}

function MetricCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
      <h3 className="mb-3 font-medium">{title}</h3>
      {children}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#787b86]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-sm text-[#787b86]">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
