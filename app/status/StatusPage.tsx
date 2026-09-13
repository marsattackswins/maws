"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import TradingHealthSection, { type TradingHealthSnapshot } from "./TradingHealthSection";

type StatusLevel = "healthy" | "degraded" | "unhealthy" | "unavailable";

type FeedProbe = {
  level: StatusLevel;
  latencyMs: number | null;
};

type LatencySample = {
  latencyMs: number;
  checkedAt: number;
};

const LATENCY_HISTORY_KEY = "maws.status.latency-history";

interface ApiHealth {
  healthy: boolean;
  env: string;
  uptimeSeconds?: number;
  version?: string;
  startedAt?: number;
  managerStatus?: string;
  submissionsFrozen?: boolean;
  execution?: {
    profileExecutionEnabled: boolean;
    runtimeEnabled: boolean;
    canSubmit: boolean;
    reasons: string[];
  };
}

interface BrokerHealth {
  status: "ok" | "degraded";
  broker: string;
  latency_ms: number;
}

interface StatusState {
  api: ApiHealth | null;
  broker: BrokerHealth | null;
  appUptimeSeconds: number | null;
  latencyHistory: LatencySample[];
  marketFeeds: {
    candlesticks: FeedProbe;
    quotes: FeedProbe;
  };
  loading: boolean;
  error: string | null;
  tradingHealth: TradingHealthSnapshot | null;
  tradingHealthLoading: boolean;
  tradingHealthError: string | null;
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusState>(() => ({
    api: null,
    broker: null,
    appUptimeSeconds: null,
    latencyHistory: readLatencyHistory(),
    marketFeeds: {
      candlesticks: { level: "unavailable", latencyMs: null },
      quotes: { level: "unavailable", latencyMs: null },
    },
    loading: true,
    error: null,
    tradingHealth: null,
    tradingHealthLoading: true,
    tradingHealthError: null,
  }));

  const fetchStatus = async () => {
    setStatus((prev) => ({ ...prev, tradingHealthLoading: true }));
    try {
      const [apiRes, brokerRes, tradingHealthRes, candlesticks, quotes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/health/broker"),
        fetch("/api/status/trading-health"),
        probeFeed("/api/binance/klines?symbol=BTCUSDT&interval=1m&limit=1"),
        probeFeed("/api/binance/ticker?symbol=BTCUSDT"),
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

      setStatus((prev) => ({
        api: apiData,
        broker: brokerData,
        appUptimeSeconds: apiData.uptimeSeconds ?? null,
        latencyHistory: brokerData
          ? [...prev.latencyHistory, { latencyMs: brokerData.latency_ms, checkedAt: Date.now() }].slice(-20)
          : prev.latencyHistory,
        marketFeeds: { candlesticks, quotes },
        loading: false,
        error: null,
        tradingHealth,
        tradingHealthLoading: false,
        tradingHealthError,
      }));
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

  useEffect(() => {
    try {
      window.localStorage.setItem(LATENCY_HISTORY_KEY, JSON.stringify(status.latencyHistory));
    } catch {
      // Local storage may be unavailable in private or restricted browser contexts.
    }
  }, [status.latencyHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        appUptimeSeconds: prev.appUptimeSeconds == null ? null : prev.appUptimeSeconds + 1,
      }));
    }, 1000);
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
  const chartOnlyLocal = status.api?.env === "local" && status.api.managerStatus === "idle";

  return (
    <div className="h-screen overflow-y-auto bg-[#0b0e11] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">System Status</h1>
            <p className="mt-2 text-sm text-[#787b86]">
              A quick view of application and Binance connectivity.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded border border-[#2a2e39] px-3 py-2 text-sm text-[#d1d4dc] transition-colors hover:border-[#2962ff] hover:text-white"
          >
            <ArrowLeft size={15} />
            Admin dashboard
          </Link>
        </div>

        <div className="space-y-8">
          <UptimeCard
            seconds={status.appUptimeSeconds}
            version={status.api?.version}
            startedAt={status.api?.startedAt}
          />

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

            <div className="mt-6 grid gap-4 border-t border-[#2a2e39] pt-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatusDetail
                label="Application API"
                value={status.api?.healthy ? "Online" : "Offline"}
                level={status.api?.healthy ? "healthy" : "unhealthy"}
              />
              <StatusDetail
                label="Binance public API"
                value={getBrokerLabel(status.broker)}
                level={getBrokerLevel(status.broker)}
              />
              <StatusDetail label="Environment" value={status.api?.env ?? "Unavailable"} />

            </div>

            <LatencyHistory samples={status.latencyHistory} />

            <div className="mt-5 grid gap-4 border-t border-[#2a2e39] pt-5 md:grid-cols-2">
              <FeedStatusCard
                label="Candlestick feed"
                description="Kline data used to draw chart candles."
                probe={status.marketFeeds.candlesticks}
              />
              <FeedStatusCard
                label="Quote feed"
                description="Live price data used by chart quotes and controls."
                probe={status.marketFeeds.quotes}
              />
            </div>

            <div className="mt-5 border-t border-[#2a2e39] pt-4 text-sm text-[#787b86]">
              {chartOnlyLocal
                ? "Each chart shows its own live/reconnecting feed status. Chart-only mode does not require server-side trading."
                : "Each chart shows its own live/reconnecting feed status. The server trading stream is separate from chart market data."}
            </div>
          </section>

          {!chartOnlyLocal && (
            <TradingHealthSection
              health={status.tradingHealth}
              managerStatus={status.api?.managerStatus ?? null}
              submissionsFrozen={status.api?.submissionsFrozen ?? null}
              execution={status.api?.execution ?? null}
              loading={status.tradingHealthLoading}
              error={status.tradingHealthError}
            />
          )}

        </div>
      </div>
    </div>
  );
}

function UptimeCard({
  seconds,
  version,
  startedAt,
}: {
  seconds: number | null;
  version?: string;
  startedAt?: number;
}) {
  return (
    <section className="rounded-lg bg-[#1e2329] p-6" aria-labelledby="uptime-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="uptime-heading" className="text-xl font-semibold text-white">
            Application Uptime
          </h2>
          <p className="mt-1 text-sm text-[#787b86]">
            Time since the application server started.
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div
            className="font-mono text-2xl font-semibold text-[#089981]"
            aria-live="polite"
            aria-label={seconds == null ? "Application uptime unavailable" : `Application uptime ${formatUptime(seconds)}`}
          >
            {seconds == null ? "Unavailable" : formatUptime(seconds)}
          </div>
          <div className="mt-2 text-xs text-[#787b86]">
            Release {version ? `v${version}` : "Unavailable"}
          </div>
          <div className="mt-1 text-xs text-[#787b86]">
            {formatStartTime(startedAt)}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeedStatusCard({
  label,
  description,
  probe,
}: {
  label: string;
  description: string;
  probe: FeedProbe;
}) {
  return (
    <div className="rounded-md border border-[#2a2e39] bg-[#171b21] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium text-white">{label}</div>
        <StatusIndicator level={probe.level} label={getFeedLabel(probe.level)} />
      </div>
      <div className="mt-2 text-xs text-[#787b86]">{description}</div>
      <div className="mt-3 text-xs text-[#787b86]">
        Probe latency: {probe.latencyMs == null ? "Unavailable" : `${probe.latencyMs}ms`}
      </div>
    </div>
  );
}

function LatencyHistory({ samples }: { samples: LatencySample[] }) {
  const latest = samples.at(-1);
  const points = samples.length >= 2 ? buildSparklinePoints(samples) : null;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoveredSample = hoveredIndex == null ? null : samples[hoveredIndex];
  const hoveredPoint = hoveredIndex == null || points == null ? null : points[hoveredIndex];

  return (
    <div className="mt-5 border-t border-[#2a2e39] pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="font-medium text-white">Binance API latency</div>
          <div className="mt-1 text-xs text-[#787b86]">Last 20 public API checks.</div>
        </div>
        <div className="font-mono text-sm text-white">
          {latest == null ? "Collecting..." : `${latest.latencyMs}ms`}
        </div>
      </div>
      {points ? (
        <div className="relative mt-4 h-20">
          {hoveredSample && hoveredPoint && (
            <div
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded bg-[#0b0e11] px-2 py-1 text-xs text-white shadow-lg ring-1 ring-[#2a2e39]"
              style={{ left: `${(hoveredPoint.x / 320) * 100}%` }}
            >
              {hoveredSample.latencyMs}ms · {formatCheckTime(hoveredSample.checkedAt)}
            </div>
          )}
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full"
            viewBox="0 0 320 56"
            role="img"
            aria-label={`Binance API latency history, latest ${latest?.latencyMs} milliseconds`}
            preserveAspectRatio="none"
          >
            <polyline
              points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="#089981"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14">
            {points.map((point, index) => {
              const sample = samples[index];
              const hovered = hoveredIndex === index;
              return (
                <button
                  key={`${sample.checkedAt}-${index}`}
                  type="button"
                  className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0b0e11] bg-[#089981] p-0 transition-transform ${hovered ? "h-2.5 w-2.5" : "h-2 w-2"}`}
                  style={{ left: `${(point.x / 320) * 100}%`, top: `${(point.y / 56) * 100}%` }}
                  aria-label={`${sample.latencyMs} milliseconds at ${formatCheckTime(sample.checkedAt)}`}
                  title={`${sample.latencyMs}ms · ${formatCheckTime(sample.checkedAt)}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex h-14 items-center justify-center rounded border border-dashed border-[#2a2e39] text-xs text-[#787b86]">
          Collecting latency history...
        </div>
      )}
    </div>
  );
}

function buildSparklinePoints(samples: LatencySample[]): Array<{ x: number; y: number }> {
  const values = samples.map((sample) => sample.latencyMs);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const width = 320;
  const height = 48;
  return values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: height - ((value - min) / range) * (height - 8) - 4,
  }));
}

function formatCheckTime(value: number): string {
  return new Date(value).toLocaleTimeString();
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

function formatStartTime(value?: number): string {
  if (value == null) return "Start time unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Start time unavailable" : `Started ${date.toLocaleString()}`;
}

function getFeedLabel(level: StatusLevel): string {
  switch (level) {
    case "healthy":
      return "Healthy";
    case "degraded":
      return "Degraded";
    case "unhealthy":
      return "Unavailable";
    default:
      return "Unavailable";
  }
}

async function probeFeed(url: string): Promise<FeedProbe> {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { cache: "no-store" });
    return {
      level: response.ok ? "healthy" : "unhealthy",
      latencyMs: Date.now() - startedAt,
    };
  } catch {
    return { level: "unavailable", latencyMs: null };
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
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
