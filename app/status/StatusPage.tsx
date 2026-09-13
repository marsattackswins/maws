"use client";

import { useEffect, useState } from "react";
import TradingHealthSection, { type TradingHealthSnapshot } from "./TradingHealthSection";

type StatusLevel = "healthy" | "degraded" | "unhealthy" | "unavailable";

interface ApiHealth {
  healthy: boolean;
  env: string;
  managerStatus?: string;
  submissionsFrozen?: boolean;
}

interface BrokerHealth {
  status: "ok" | "degraded";
  broker: string;
  latency_ms: number;
}

interface StatusState {
  api: ApiHealth | null;
  broker: BrokerHealth | null;
  lastCheck: Date | null;
  loading: boolean;
  error: string | null;
  tradingHealth: TradingHealthSnapshot | null;
  tradingHealthLoading: boolean;
  tradingHealthError: string | null;
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusState>({
    api: null,
    broker: null,
    lastCheck: null,
    loading: true,
    error: null,
    tradingHealth: null,
    tradingHealthLoading: true,
    tradingHealthError: null,
  });

  const fetchStatus = async () => {
    setStatus((prev) => ({ ...prev, tradingHealthLoading: true }));
    try {
      const [apiRes, brokerRes, tradingHealthRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/health/broker"),
        fetch("/api/status/trading-health"),
      ]);

      if (!apiRes.ok) {
        if (apiRes.status === 401 || apiRes.status === 403) {
          throw new Error("Not authenticated");
        }
        throw new Error(`API health check failed: ${apiRes.status}`);
      }

      const apiData: ApiHealth = await apiRes.json();

      let brokerData: BrokerHealth | null = null;
      if (brokerRes.ok || brokerRes.status === 503) {
        brokerData = await brokerRes.json();
      }

      let tradingHealth: TradingHealthSnapshot | null = null;
      let tradingHealthError: string | null = null;
      if (tradingHealthRes.ok) {
        tradingHealth = (await tradingHealthRes.json()) as TradingHealthSnapshot;
      } else {
        tradingHealthError = `Trading health check failed: ${tradingHealthRes.status}`;
      }

      setStatus({
        api: apiData,
        broker: brokerData,
        lastCheck: new Date(),
        loading: false,
        error: null,
        tradingHealth,
        tradingHealthLoading: false,
        tradingHealthError,
      });
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        tradingHealthLoading: false,
        tradingHealthError: prev.tradingHealth
          ? err instanceof Error
            ? err.message
            : "Failed to refresh trading health"
          : prev.tradingHealthError,
        error: err instanceof Error ? err.message : "Failed to fetch status",
      }));
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0e11]">
        <div className="text-[#787b86]">Loading...</div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0e11]">
        <div className="text-center">
          <div className="mb-2 text-lg text-[#f23645]">Error</div>
          <div className="text-sm text-[#787b86]">{status.error}</div>
        </div>
      </div>
    );
  }

  const connectionLevel = getConnectionLevel(status.api, status.broker);
  const connectionLabel = getConnectionLabel(connectionLevel);

  return (
    <div className="min-h-screen bg-[#0b0e11] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">System Status</h1>
          <p className="mt-2 text-sm text-[#787b86]">
            A quick view of application and Binance connectivity.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-lg bg-[#1e2329] p-6" aria-labelledby="connectivity-heading">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 id="connectivity-heading" className="text-xl font-semibold text-white">
                  Connectivity
                </h2>
                <p className="mt-1 text-sm text-[#787b86]">
                  This is the connection that powers public market data and charts.
                </p>
              </div>
              <StatusIndicator level={connectionLevel} label={connectionLabel} />
            </div>

            <div className="mt-6 grid gap-4 border-t border-[#2a2e39] pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatusDetail
                label="Application API"
                value={status.api?.healthy ? "Healthy" : "Unhealthy"}
                level={status.api?.healthy ? "healthy" : "unhealthy"}
              />
              <StatusDetail
                label="Binance public API"
                value={getBrokerLabel(status.broker)}
                level={getBrokerLevel(status.broker)}
              />
              <StatusDetail label="Environment" value={status.api?.env ?? "Unavailable"} />
              <StatusDetail
                label="API latency"
                value={status.broker ? `${status.broker.latency_ms}ms` : "Unavailable"}
              />
            </div>

            <div className="mt-5 border-t border-[#2a2e39] pt-4 text-sm text-[#787b86]">
              Each chart shows its own live/reconnecting feed status. The server trading stream
              below is separate and is not required for chart-only mode.
            </div>
          </section>

          <TradingHealthSection
            health={status.tradingHealth}
            managerStatus={status.api?.managerStatus ?? null}
            submissionsFrozen={status.api?.submissionsFrozen ?? null}
            loading={status.tradingHealthLoading}
            error={status.tradingHealthError}
          />

          {status.lastCheck && (
            <div className="text-center text-sm text-[#787b86]">
              Last checked: {status.lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getConnectionLevel(api: ApiHealth | null, broker: BrokerHealth | null): StatusLevel {
  if (!api) return "unavailable";
  if (!api.healthy) return "unhealthy";
  if (!broker) return "unavailable";
  return broker.status === "ok" ? "healthy" : "degraded";
}

function getConnectionLabel(level: StatusLevel): string {
  switch (level) {
    case "healthy":
      return "Healthy";
    case "degraded":
      return "Degraded";
    case "unhealthy":
      return "Unhealthy";
    default:
      return "Unavailable";
  }
}

function getBrokerLevel(broker: BrokerHealth | null): StatusLevel {
  if (!broker) return "unavailable";
  return broker.status === "ok" ? "healthy" : "degraded";
}

function getBrokerLabel(broker: BrokerHealth | null): string {
  if (!broker) return "Unavailable";
  return broker.status === "ok" ? "Connected" : "Degraded";
}

function StatusIndicator({ level, label }: { level: StatusLevel; label: string }) {
  const color = getStatusColor(level);
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <span className={`h-3 w-3 rounded-full ${getStatusDot(level)}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function StatusDetail({
  label,
  value,
  level,
}: {
  label: string;
  value: string;
  level?: StatusLevel;
}) {
  return (
    <div>
      <div className="text-xs text-[#787b86]">{label}</div>
      <div className={`mt-1 ${level ? getStatusColor(level) : "text-white"}`}>{value}</div>
    </div>
  );
}

function getStatusColor(level: StatusLevel): string {
  switch (level) {
    case "healthy":
      return "text-[#089981]";
    case "degraded":
      return "text-[#f7931a]";
    case "unhealthy":
      return "text-[#f23645]";
    default:
      return "text-[#787b86]";
  }
}

function getStatusDot(level: StatusLevel): string {
  switch (level) {
    case "healthy":
      return "bg-[#089981]";
    case "degraded":
      return "bg-[#f7931a]";
    case "unhealthy":
      return "bg-[#f23645]";
    default:
      return "bg-[#787b86]";
  }
}
