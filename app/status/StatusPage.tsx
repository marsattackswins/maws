"use client";

import { useEffect, useState } from "react";
import TradingHealthSection, { type TradingHealthSnapshot } from "./TradingHealthSection";

interface ApiHealth {
  healthy: boolean;
  env: string;
  brokerConnected: boolean;
  clockHealthy: boolean;
  streamHealthy: boolean;
  reconHealthy: boolean;
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
      if (brokerRes.ok) {
        brokerData = await brokerRes.json();
      } else if (brokerRes.status === 503) {
        brokerData = await brokerRes.json(); // 503 still returns body with status
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
        tradingHealthError: prev.tradingHealth ? (err instanceof Error ? err.message : "Failed to refresh trading health") : prev.tradingHealthError,
        error: err instanceof Error ? err.message : "Failed to fetch status",
      }));
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (status.loading) {
    return (
      <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center">
        <div className="text-[#787b86]">Loading...</div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#f23645] text-lg mb-2">Error</div>
          <div className="text-[#787b86] text-sm">{status.error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e11] p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-white mb-8">System Status</h1>

        <div className="space-y-4">
          {/* API Status */}
          <div className="bg-[#1e2329] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    status.api?.healthy ? "bg-[#089981]" : "bg-[#f23645]"
                  }`}
                />
                <span className="text-white font-medium">API</span>
              </div>
              <span
                className={`text-sm ${
                  status.api?.healthy ? "text-[#089981]" : "text-[#f23645]"
                }`}
              >
                {status.api?.healthy ? "Healthy" : "Unhealthy"}
              </span>
            </div>
            {status.api && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="text-[#787b86]">Environment</div>
                <div className="text-white">{status.api.env}</div>
                <div className="text-[#787b86]">Clock</div>
                <div className={status.api.clockHealthy ? "text-[#089981]" : "text-[#f23645]"}>
                  {status.api.clockHealthy ? "OK" : "Degraded"}
                </div>
                <div className="text-[#787b86]">Stream</div>
                <div className={status.api.streamHealthy ? "text-[#089981]" : "text-[#f23645]"}>
                  {status.api.streamHealthy ? "OK" : "Degraded"}
                </div>
              </div>
            )}
          </div>

          {/* Broker Status */}
          <div className="bg-[#1e2329] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    status.broker?.status === "ok"
                      ? "bg-[#089981]"
                      : status.broker?.status === "degraded"
                      ? "bg-[#f7931a]"
                      : "bg-[#f23645]"
                  }`}
                />
                <span className="text-white font-medium">Broker</span>
              </div>
              <span
                className={`text-sm ${
                  status.broker?.status === "ok"
                    ? "text-[#089981]"
                    : status.broker?.status === "degraded"
                    ? "text-[#f7931a]"
                    : "text-[#f23645]"
                }`}
              >
                {status.broker?.status === "ok"
                  ? "Connected"
                  : status.broker?.status === "degraded"
                  ? "Degraded"
                  : "Disconnected"}
              </span>
            </div>
            {status.broker && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="text-[#787b86]">Broker</div>
                <div className="text-white capitalize">{status.broker.broker}</div>
                <div className="text-[#787b86]">Latency</div>
                <div className="text-white">{status.broker.latency_ms}ms</div>
              </div>
            )}
          </div>

          <TradingHealthSection
            health={status.tradingHealth}
            managerStatus={status.api?.managerStatus ?? null}
            submissionsFrozen={status.api?.submissionsFrozen ?? null}
            loading={status.tradingHealthLoading}
            error={status.tradingHealthError}
          />

          {/* Last Check */}
          {status.lastCheck && (
            <div className="text-center text-[#787b86] text-sm mt-6">
              Last checked: {status.lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
