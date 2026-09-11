"use client";

import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

export type TradingHealthLevel = "healthy" | "degraded" | "unhealthy" | "unavailable";

type StreamStatus = "open" | "closed" | "reconnecting" | "unavailable";
type CircuitState = "closed" | "half-open" | "open";

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

interface TradingHealthSectionProps {
  health: TradingHealthSnapshot | null;
  managerStatus: string | null;
  submissionsFrozen: boolean | null;
  loading: boolean;
  error: string | null;
}

export default function TradingHealthSection({
  health,
  managerStatus,
  submissionsFrozen,
  loading,
  error,
}: TradingHealthSectionProps) {
  return (
    <section className="mt-8" aria-labelledby="trading-infrastructure-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="trading-infrastructure-heading" className="text-xl font-semibold text-white">
            Trading Infrastructure
          </h2>
          <p className="mt-1 text-sm text-[#787b86]">Read-only trading system health and recovery state</p>
        </div>
        {health && <span className="text-xs text-[#787b86]">Updated {formatTime(health.timestamp)}</span>}
      </div>

      {loading && !health ? (
        <PanelMessage>Loading trading infrastructure health...</PanelMessage>
      ) : error && !health ? (
        <PanelMessage tone="red">Unable to load trading health: {error}</PanelMessage>
      ) : health ? (
        <div className="space-y-4">
          {error && <PanelMessage tone="yellow">Trading health refresh failed: {error}</PanelMessage>}
          <TradingSummaryCard health={health} managerStatus={managerStatus} submissionsFrozen={submissionsFrozen} />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <FeedHealthSection health={health} />
            <ExecutionHealthSection health={health} />
          </div>
          <StrategyHealthSection health={health} />
          <CircuitBreakersSection health={health} />
        </div>
      ) : (
        <PanelMessage>No trading health data available</PanelMessage>
      )}
    </section>
  );
}

export function TradingSummaryCard({
  health,
  managerStatus,
  submissionsFrozen,
}: {
  health: TradingHealthSnapshot;
  managerStatus: string | null;
  submissionsFrozen: boolean | null;
}) {
  return (
    <Panel title="Trading Infrastructure Summary">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryValue label="Overall" value={<StatusBadge level={health.overall} />} />
        <SummaryValue label="Environment" value={health.env} />
        <SummaryValue label="Manager" value={managerStatus ?? "N/A"} />
        <SummaryValue
          label="Submissions"
          value={
            submissionsFrozen == null ? "N/A" : submissionsFrozen ? "Frozen" : "Enabled"
          }
          valueClass={submissionsFrozen ? "text-[#f23645]" : "text-[#089981]"}
        />
      </div>
    </Panel>
  );
}

export function FeedHealthSection({ health }: { health: TradingHealthSnapshot }) {
  const stream = health.feed.serverTradingStream;
  return (
    <Panel title="Feed Health">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#787b86]">{stream.label}</span>
          <StatusBadge level={stream.level} label={stream.status} />
        </div>
        <DetailRow label="Phase" value={stream.phase ?? "N/A"} />
        <DetailRow label="Last message" value={formatTime(stream.lastMessageAt)} />
        <DetailRow label="Reconnects" value={stream.reconnects == null ? "N/A" : String(stream.reconnects)} />
        <DetailRow label="Snapshot/recovery" value={formatTime(stream.snapshotAt)} />
        <div className="flex items-start gap-2 border-t border-[#2a2e39] pt-3 text-xs text-[#787b86]">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Per-symbol/timeframe market feed health is browser-local / not available server-side.</span>
        </div>
      </div>
    </Panel>
  );
}

export function ExecutionHealthSection({ health }: { health: TradingHealthSnapshot }) {
  const rateLimits = health.execution.rateLimits.current;
  return (
    <Panel title="Execution Health">
      <div className="space-y-3 text-sm">
        <DetailRow label="Failed orders" value={String(health.execution.failedOrders.count)} />
        <DetailRow label="Rejected order metric" value={String(health.execution.metrics.rejectedOrders)} />
        <DetailRow label="Reconciliation" value={`${health.execution.reconciliation.mismatches} mismatches / ${health.execution.reconciliation.runs} runs`} />
        <div className="border-t border-[#2a2e39] pt-3">
          <div className="mb-2 font-medium">Rate limiter observations</div>
          {rateLimits ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <DetailRow label="Pressure" value={percent(rateLimits.pressure)} />
              <DetailRow label="Internal window" value={`${rateLimits.internalUsed}/${rateLimits.internalPerMin}`} />
              <DetailRow label="Weight (1m)" value={rateLimits.usedWeight1m == null ? "N/A" : String(rateLimits.usedWeight1m)} />
              <DetailRow label="Orders (1m)" value={rateLimits.orderCount1m == null ? "N/A" : String(rateLimits.orderCount1m)} />
            </div>
          ) : (
            <div className="text-xs text-[#787b86]">Current observations unavailable</div>
          )}
          <div className="mt-2 text-xs text-[#787b86]">{health.execution.rateLimits.historicalHits.message}.</div>
        </div>
        <RecentFailures health={health} />
        <RecentMismatches health={health} />
      </div>
    </Panel>
  );
}

export function StrategyHealthSection({ health }: { health: TradingHealthSnapshot }) {
  return (
    <Panel title="Strategy Health">
      <div className="flex items-start gap-2 text-sm text-[#787b86]">
        <Info size={16} className="mt-0.5 shrink-0" />
        <div>
          <div className="mb-1 flex items-center gap-2 text-[#d1d4dc]">
            <StatusBadge level={health.strategy.level} />
            <span>Strategy telemetry unavailable</span>
          </div>
          <div>{health.strategy.message}. Active strategies and signal timestamps remain browser-local.</div>
        </div>
      </div>
    </Panel>
  );
}

export function CircuitBreakersSection({ health }: { health: TradingHealthSnapshot }) {
  return (
    <Panel title="Circuit Breakers">
      {health.circuits.breakers.length === 0 ? (
        <div className="text-sm text-[#787b86]">No circuit breakers registered in this environment.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[#2a2e39] text-xs uppercase text-[#787b86]">
              <tr>
                <th className="px-3 py-2 font-medium">Breaker</th>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 font-medium">Last failure</th>
                <th className="px-3 py-2 font-medium">Opened</th>
                <th className="px-3 py-2 font-medium">Rejections</th>
                <th className="px-3 py-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {health.circuits.breakers.map((breaker) => (
                <tr key={breaker.name} className="border-b border-[#2a2e39] last:border-0">
                  <td className="px-3 py-3 font-medium">{breaker.name}</td>
                  <td className="px-3 py-3"><StatusBadge level={breaker.level} label={breaker.state} /></td>
                  <td className="px-3 py-3 font-mono text-xs">{formatTime(breaker.lastFailureTime)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{formatTime(breaker.openedAt)}</td>
                  <td className="px-3 py-3 font-mono">{breaker.totalRejections}</td>
                  <td className="px-3 py-3 text-[#787b86]">N/A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function RecentFailures({ health }: { health: TradingHealthSnapshot }) {
  const failures = health.execution.failedOrders.recent;
  return (
    <div className="border-t border-[#2a2e39] pt-3">
      <div className="mb-2 font-medium">Recent failed orders</div>
      {failures.length === 0 ? <div className="text-xs text-[#787b86]">No recent failed orders.</div> : (
        <div className="space-y-2 text-xs">
          {failures.map((failure) => (
            <div key={`${failure.clientOrderId}-${failure.updatedAt}`} className="rounded border border-[#2a2e39] p-2">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">{failure.symbol} {failure.side}</span>
                <span className="text-[#787b86]">{formatTime(failure.updatedAt)}</span>
              </div>
              <div className="mt-1 text-[#787b86]">{failure.reason ?? "Reason unavailable"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentMismatches({ health }: { health: TradingHealthSnapshot }) {
  const mismatches = health.execution.reconciliation.recent;
  return (
    <div className="border-t border-[#2a2e39] pt-3">
      <div className="mb-2 font-medium">Recent reconciliation mismatches</div>
      {mismatches.length === 0 ? <div className="text-xs text-[#787b86]">No recent mismatches.</div> : (
        <div className="space-y-2 text-xs">
          {mismatches.map((mismatch) => (
            <div key={`${mismatch.startedAt}-${mismatch.trigger}`} className="rounded border border-[#2a2e39] p-2">
              <div className="flex flex-wrap justify-between gap-2">
                <span className={mismatch.result === "error" ? "text-[#f23645]" : "text-[#f7931a]"}>
                  {mismatch.result} · {mismatch.trigger}
                </span>
                <span className="text-[#787b86]">{formatTime(mismatch.startedAt)}</span>
              </div>
              {mismatch.diffs.length > 0 && <div className="mt-1 text-[#787b86]">{mismatch.diffs.join("; ")}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-[#1e2329] p-6">
      <h3 className="mb-4 font-medium text-white">{title}</h3>
      {children}
    </div>
  );
}

function SummaryValue({ label, value, valueClass = "text-white" }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div>
      <div className="text-xs text-[#787b86]">{label}</div>
      <div className={`mt-1 ${valueClass}`}>{value}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[#787b86]">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}

function StatusBadge({ level, label }: { level: TradingHealthLevel; label?: string }) {
  const styles: Record<TradingHealthLevel, string> = {
    healthy: "border-[#164d43] bg-[#102d29] text-[#089981]",
    degraded: "border-[#5a4320] bg-[#302514] text-[#f7931a]",
    unhealthy: "border-[#5b2028] bg-[#32171b] text-[#f23645]",
    unavailable: "border-[#2a2e39] bg-[#1b1e26] text-[#787b86]",
  };
  const Icon = level === "healthy" ? CheckCircle : level === "degraded" ? AlertCircle : level === "unhealthy" ? XCircle : Info;
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs capitalize ${styles[level]}`}>
      <Icon size={13} />
      {label ?? level}
    </span>
  );
}

function PanelMessage({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "yellow" | "red" }) {
  const color = tone === "red" ? "text-[#f23645]" : tone === "yellow" ? "text-[#f7931a]" : "text-[#787b86]";
  return <div className={`rounded-lg bg-[#1e2329] p-6 text-sm ${color}`}>{children}</div>;
}

function formatTime(timestamp: number | null): string {
  return timestamp == null ? "N/A" : new Date(timestamp).toLocaleString();
}

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
