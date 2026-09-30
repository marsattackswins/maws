"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { StatusDot, Chevron, toneText, formatTime } from "./console-ui";
import type { RiskCockpitSnapshot } from "./RiskCockpit";
import type {
  BrokerHealth,
  FeedProbe,
  HealthSnapshot,
  LatencySample,
  MetricsSnapshot,
  PerformanceMetrics,
  StatusTone,
  TerminalLogsSnapshot,
  TradingHealthSnapshot,
} from "./types";

export type PanelErrors = {
  health: string | null;
  trading: string | null;
  risk: string | null;
  performance: string | null;
  metrics: string | null;
  broker: string | null;
  logs: string | null;
};

interface ConsoleProps {
  health: HealthSnapshot | null;
  tradingHealth: TradingHealthSnapshot | null;
  risk: RiskCockpitSnapshot | null;
  performance: PerformanceMetrics | null;
  metrics: MetricsSnapshot | null;
  broker: BrokerHealth | null;
  terminalLogs: TerminalLogsSnapshot | null;
  feedProbes: { candlesticks: FeedProbe; quotes: FeedProbe } | null;
  latencyHistory: LatencySample[];
  errors: PanelErrors;
  loading: boolean;
  RiskPanel: ComponentType<RiskPanelProps>;
}

interface RiskPanelProps {
  risk: RiskCockpitSnapshot | null;
  loading: boolean;
  error: string | null;
}

type BlockId =
  | "environment" | "system" | "submissions" | "risk" | "binance" | "feeds"
  | "manager" | "stream" | "reconciliation" | "breakers" | "performance" | "events"
  | "logs";

type Block = {
  id: BlockId;
  label: string;
  value: string;
  detail: string;
  tone: StatusTone;
};

export default function OperationsConsole(props: ConsoleProps) {
  const [openBlock, setOpenBlock] = useState<BlockId | null>(null);

  const topBlocks = buildTopBlocks(props);
  const tradingBlocks = buildTradingBlocks(props);
  const panel = openBlock == null ? null : buildPanel(openBlock, props);

  const toggle = (id: BlockId) => setOpenBlock((prev) => (prev === id ? null : id));

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {topBlocks.map((block) => (
          <StatusBlock key={block.id} block={block} open={openBlock === block.id} onToggle={() => toggle(block.id)} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-white">Server trading</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tradingBlocks.map((block) => (
          <StatusBlock key={block.id} block={block} open={openBlock === block.id} onToggle={() => toggle(block.id)} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpenBlock("performance")} className={SECONDARY_BUTTON}>
          Performance
        </button>
        <button type="button" onClick={() => setOpenBlock("events")} className={SECONDARY_BUTTON}>
          Recent events
        </button>
        <button type="button" onClick={() => setOpenBlock("logs")} className={SECONDARY_BUTTON}>
          Terminal logs
        </button>
      </div>

      {panel && (
        <div className="mt-4 rounded-lg border border-[#2962ff]/40 bg-[#131722] p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#2a2e39] pb-3">
            <h3 className="font-medium text-white">{panel.title}</h3>
            <button
              type="button"
              onClick={() => setOpenBlock(null)}
              className="rounded border border-[#2a2e39] px-2 py-1 text-xs text-[#787b86] transition-colors hover:border-[#2962ff] hover:text-white"
            >
              Close
            </button>
          </div>
          {panel.content}
        </div>
      )}
    </div>
  );
}

const SECONDARY_BUTTON = "rounded border border-[#2a2e39] px-3 py-2 text-xs text-[#787b86] transition-colors hover:border-[#2962ff] hover:text-white";

function StatusBlock({ block, open, onToggle }: { block: Block; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={`rounded-lg border p-4 text-left transition-colors ${
        open ? "border-[#2962ff]/60 bg-[#131722]" : "border-[#2a2e39] bg-[#131722] hover:border-[#2962ff]/50"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide text-[#787b86]">
        <span className="flex items-center gap-2">
          <StatusDot tone={block.tone} />
          {block.label}
        </span>
        <Chevron open={open} />
      </div>
      <div className={`mt-3 truncate text-lg font-semibold ${toneText(block.tone)}`} title={block.value}>
        {block.value}
      </div>
      <div className="mt-1 truncate text-xs text-[#787b86]" title={block.detail}>
        {block.detail}
      </div>
    </button>
  );
}

function buildPanel(id: BlockId, props: ConsoleProps): { title: string; content: ReactNode } | null {
  switch (id) {
    case "environment":
      return { title: "Environment", content: <EnvironmentPanel health={props.health} /> };
    case "system":
      return { title: "System health", content: <SystemPanel health={props.health} tradingHealth={props.tradingHealth} /> };
    case "submissions":
      return { title: "Order submissions", content: <SubmissionsPanel health={props.health} /> };
    case "risk":
      return { title: "Risk & exposure", content: <props.RiskPanel risk={props.risk} loading={props.loading} error={props.errors.risk} /> };
    case "binance":
      return { title: "Binance API", content: <BinancePanel broker={props.broker} latencyHistory={props.latencyHistory} /> };
    case "feeds":
      return { title: "Market feeds", content: <FeedsPanel feedProbes={props.feedProbes} /> };
    case "manager":
      return { title: "Manager", content: <ManagerPanel health={props.health} /> };
    case "stream":
      return { title: "Private stream", content: <StreamPanel tradingHealth={props.tradingHealth} /> };
    case "reconciliation":
      return { title: "Reconciliation", content: <ReconciliationPanel tradingHealth={props.tradingHealth} performance={props.performance} /> };
    case "breakers":
      return { title: "Safety breakers", content: <BreakersPanel tradingHealth={props.tradingHealth} /> };
    case "performance":
      return { title: "Performance", content: <PerformancePanel performance={props.performance} /> };
    case "events":
      return { title: "Recent server events", content: <EventsPanel metrics={props.metrics} /> };
    case "logs":
      return { title: "Terminal logs", content: <TerminalLogsPanel logs={props.terminalLogs} error={props.errors.logs} /> };
    default:
      return null;
  }
}

function buildTopBlocks({ health, risk, broker, feedProbes }: ConsoleProps): Block[] {
  return [
    {
      id: "environment",
      label: "Environment",
      value: envLabel(health),
      detail: "Mode, version, and uptime",
      tone: "muted",
    },
    {
      id: "system",
      label: "System health",
      value: systemLabel(health),
      detail: health ? (health.healthy ? "Core services responding" : "Click to see what is failing") : "Waiting for data",
      tone: systemTone(health),
    },
    {
      id: "submissions",
      label: "Order submissions",
      value: submissionLabel(health),
      detail: submissionDetail(health),
      tone: submissionTone(health),
    },
    {
      id: "risk",
      label: "Risk state",
      value: riskLabel(risk),
      detail: riskDetail(risk),
      tone: riskTone(risk),
    },
    {
      id: "binance",
      label: "Binance API",
      value: brokerLabel(broker),
      detail: broker ? `${broker.latency_ms}ms latest latency` : "Waiting for first check",
      tone: brokerTone(broker),
    },
    {
      id: "feeds",
      label: "Market feeds",
      value: feedsLabel(feedProbes),
      detail: feedsDetail(feedProbes),
      tone: feedsTone(feedProbes),
    },
  ];
}

function buildTradingBlocks({ health, tradingHealth }: ConsoleProps): Block[] {
  const stream = tradingHealth?.feed.serverTradingStream;
  const recon = tradingHealth?.execution.reconciliation;
  const circuits = tradingHealth?.circuits;
  const chartOnly = health?.env === "local" && health.managerStatus === "idle";
  const waiting: StatusTone = "muted";

  return [
    {
      id: "manager",
      label: "Manager",
      value: managerLabel(health),
      detail: health?.managerError ?? "Profile coordinator",
      tone: health ? (health.managerReady ? "healthy" : chartOnly ? waiting : "warning") : waiting,
    },
    {
      id: "stream",
      label: "Private stream",
      value: stream ? streamLabel(stream.status) : chartOnly ? "Not required" : "Waiting",
      detail: stream?.lastMessageAt ? `Last message ${formatTime(stream.lastMessageAt)}` : "Account data feed",
      tone: stream ? (stream.level === "healthy" ? "healthy" : "warning") : waiting,
    },
    {
      id: "reconciliation",
      label: "Reconciliation",
      value: recon ? `${recon.mismatches} mismatch${recon.mismatches === 1 ? "" : "es"}` : chartOnly ? "Not required" : "Waiting",
      detail: recon ? `${recon.runs} lifetime runs` : "Account consistency",
      tone: recon ? (recon.mismatches === 0 ? "healthy" : "warning") : waiting,
    },
    {
      id: "breakers",
      label: "Safety breakers",
      value: circuits ? (circuits.healthy ? "All closed" : `${circuits.openCircuits.length} open`) : "Waiting",
      detail: circuits?.openCircuits.length ? circuits.openCircuits.join(", ") : "Execution safety controls",
      tone: circuits ? (circuits.healthy ? "healthy" : "warning") : waiting,
    },
  ];
}

// --- Surface values (one source of truth per visible value) ---

function envLabel(health: HealthSnapshot | null): string {
  if (health?.env === "local") return "Chart Only";
  if (health?.env === "testnet") return "Binance Testnet";
  if (health?.env === "production") return "Binance Production";
  return health?.env ?? "Waiting";
}

function systemLabel(health: HealthSnapshot | null): string {
  if (!health) return "Waiting";
  return health.healthy ? "Healthy" : "Needs attention";
}

function systemTone(health: HealthSnapshot | null): StatusTone {
  if (!health) return "muted";
  return health.healthy ? "healthy" : "warning";
}

function submissionLabel(health: HealthSnapshot | null): string {
  if (!health) return "Waiting";
  if (health.env === "local" && health.managerStatus === "idle") return "Chart-only";
  return health.execution.canSubmit ? "Ready" : "Blocked";
}

function submissionTone(health: HealthSnapshot | null): StatusTone {
  if (!health) return "muted";
  if (health.env === "local" && health.managerStatus === "idle") return "muted";
  return health.execution.canSubmit ? "healthy" : "warning";
}

function submissionDetail(health: HealthSnapshot | null): string {
  if (!health) return "Execution readiness";
  if (health.env === "local" && health.managerStatus === "idle") return "Orders intentionally blocked in Chart Only mode";
  const reason = health.execution.reasons[0] ?? "";
  const normalized = reason.toLowerCase();
  if (normalized.includes("runtime execution flag")) return "Runtime switch is off — reconnect the profile";
  if (normalized.includes("stream")) return "Private account stream is not ready";
  if (reason) return reason;
  return health.execution.canSubmit ? "All execution checks passed" : "Safety checks are blocking orders";
}

function riskLabel(risk: RiskCockpitSnapshot | null): string {
  if (!risk) return "Waiting";
  if (!risk.sourceAvailable) return "Unavailable";
  const statuses = riskLimitStatuses(risk);
  if (statuses.includes("red")) return "Critical";
  if (statuses.includes("yellow")) return "Review";
  return "Normal";
}

function riskTone(risk: RiskCockpitSnapshot | null): StatusTone {
  if (!risk || !risk.sourceAvailable) return "muted";
  const statuses = riskLimitStatuses(risk);
  if (statuses.includes("red")) return "danger";
  if (statuses.includes("yellow")) return "warning";
  return "healthy";
}

function riskLimitStatuses(risk: RiskCockpitSnapshot): string[] {
  return [
    risk.limits.maxOrderNotional.status,
    risk.limits.grossExposure.status,
    risk.limits.positionCount.status,
    risk.limits.dailyLoss.status,
  ];
}

function riskDetail(risk: RiskCockpitSnapshot | null): string {
  if (!risk) return "Risk limits and exposure";
  if (!risk.sourceAvailable) return risk.sourceMessage ?? "No server-side risk state";
  return "Limits, exposure, and positions";
}

function brokerLabel(broker: BrokerHealth | null): string {
  if (!broker) return "Waiting";
  return broker.status === "ok" ? "Connected" : "Degraded";
}

function brokerTone(broker: BrokerHealth | null): StatusTone {
  if (!broker) return "muted";
  return broker.status === "ok" ? "healthy" : "warning";
}

function feedsLabel(probes: { candlesticks: FeedProbe; quotes: FeedProbe } | null): string {
  if (!probes) return "Waiting";
  return probes.candlesticks.level === "healthy" && probes.quotes.level === "healthy" ? "Healthy" : "Check details";
}

function feedsTone(probes: { candlesticks: FeedProbe; quotes: FeedProbe } | null): StatusTone {
  if (!probes) return "muted";
  return probes.candlesticks.level === "healthy" && probes.quotes.level === "healthy" ? "healthy" : "warning";
}

function feedsDetail(probes: { candlesticks: FeedProbe; quotes: FeedProbe } | null): string {
  if (!probes) return "Candles and quotes probes";
  return `Candles ${probeShort(probes.candlesticks)} · Quotes ${probeShort(probes.quotes)}`;
}

function probeShort(probe: FeedProbe): string {
  if (probe.level === "healthy") return `${probe.latencyMs ?? "?"}ms`;
  return probe.level === "unhealthy" ? "failing" : "n/a";
}

function managerLabel(health: HealthSnapshot | null): string {
  if (!health) return "Waiting";
  if (health.managerStatus === "ready") return "Ready";
  if (health.managerStatus === "idle") return "Not running";
  if (health.managerStatus === "degraded") return "Degraded";
  return health.managerStatus;
}

function streamLabel(status: string): string {
  if (status === "open") return "Healthy";
  if (status === "reconnecting") return "Reconnecting";
  if (status === "closed") return "Offline";
  return "Unavailable";
}

// --- Detail panels: deep data lives only here, never on the surface ---

function PanelGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded border border-[#2a2e39] bg-[#171b21] p-4">
      <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#787b86]">{title}</h4>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-[#787b86]">{label}</span>
      <span className="text-right text-[#d1d4dc]">{value}</span>
    </div>
  );
}

function EnvironmentPanel({ health }: { health: HealthSnapshot | null }) {
  return (
    <PanelGrid>
      <Panel title="Session">
        <Row label="Environment" value={envLabel(health)} />
        <Row label="Version" value={health?.version ? `v${health.version}` : "N/A"} />
        <Row label="Started" value={health?.startedAt ? new Date(health.startedAt).toLocaleString() : "N/A"} />
        <Row label="Uptime" value={formatUptime(health?.uptimeSeconds ?? null)} />
      </Panel>
      <Panel title="What this means">
        <p className="text-sm text-[#787b86]">
          Chart Only never submits server-side orders. Binance Testnet trades against the test exchange. Binance Production places real orders — treat every warning on this page as actionable.
        </p>
      </Panel>
    </PanelGrid>
  );
}

function SystemPanel({ health, tradingHealth }: { health: HealthSnapshot | null; tradingHealth: TradingHealthSnapshot | null }) {
  const checks = [
    { label: "Application API", value: health ? (health.healthy ? "Healthy" : "Unhealthy") : "Waiting", ok: health?.healthy === true },
    { label: "Manager", value: managerLabel(health), ok: health?.managerReady === true },
    {
      label: "Position mode",
      value: health?.positionMode.error ?? health?.positionMode.mode ?? "N/A",
      ok: health != null && health.positionMode.error == null,
    },
    {
      label: "Circuit breakers",
      value: tradingHealth ? (tradingHealth.circuits.healthy ? "Closed" : `${tradingHealth.circuits.openCircuits.length} open`) : "N/A",
      ok: tradingHealth?.circuits.healthy === true,
    },
  ];
  return (
    <PanelGrid>
      <Panel title="Core checks">
        {checks.map((check) => (
          <Row key={check.label} label={check.label} value={<span className={check.ok ? "text-[#089981]" : "text-[#f7931a]"}>{check.value}</span>} />
        ))}
      </Panel>
      <Panel title="How to read this">
        <p className="text-sm text-[#787b86]">
          System health aggregates the manager, position-mode, and circuit-breaker checks from the health endpoint. A failing check points to the block that owns it: Manager, Reconciliation, or Safety breakers.
        </p>
      </Panel>
    </PanelGrid>
  );
}

function SubmissionsPanel({ health }: { health: HealthSnapshot | null }) {
  const reasons = health?.execution.reasons ?? [];
  const frozen = health?.submissionsFrozen ?? false;
  const frozenReasons = health?.frozenReasons ?? [];
  return (
    <PanelGrid>
      <Panel title="Gate">
        <Row label="Status" value={submissionLabel(health)} />
        <Row label="Profile execution" value={health?.execution.profileExecutionEnabled ? "Enabled" : "Disabled"} />
        <Row label="Runtime switch" value={health?.execution.runtimeEnabled ? "Enabled" : "Disabled"} />
        <Row label="Submissions frozen" value={frozen ? "Yes" : "No"} />
      </Panel>
      <Panel title="Blocking reasons">
        {reasons.length === 0 && !frozen ? (
          <p className="text-sm text-[#787b86]">No blocking reasons — orders can be submitted.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-[#f7931a]">
            {reasons.map((reason) => <li key={reason}>{reason}</li>)}
            {frozenReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        )}
      </Panel>
    </PanelGrid>
  );
}

function BinancePanel({ broker, latencyHistory }: { broker: BrokerHealth | null; latencyHistory: LatencySample[] }) {
  return (
    <PanelGrid>
      <Panel title="Connectivity">
        <Row label="Status" value={brokerLabel(broker)} />
        <Row label="Latest latency" value={broker ? `${broker.latency_ms}ms` : "N/A"} />
        <Row label="Checks recorded" value={latencyHistory.length} />
        <p className="text-xs text-[#787b86]">Public Binance API reachability — the connection that powers market data and charts.</p>
      </Panel>
      <Panel title="Latency (last 20 checks)">
        <LatencySparkline samples={latencyHistory} />
      </Panel>
    </PanelGrid>
  );
}

function LatencySparkline({ samples }: { samples: LatencySample[] }) {
  if (samples.length < 2) {
    return <div className="flex h-14 items-center justify-center rounded border border-dashed border-[#2a2e39] text-xs text-[#787b86]">Collecting latency history…</div>;
  }
  const values = samples.map((sample) => sample.latencyMs);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const width = 320;
  const height = 48;
  const points = values
    .map((value, index) => ({
      x: (index / (values.length - 1)) * width,
      y: height - ((value - min) / range) * (height - 8) - 4,
    }))
    .map(({ x, y }) => `${x},${y}`)
    .join(" ");
  const latest = samples.at(-1);
  return (
    <div>
      <svg
        className="h-14 w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Binance API latency history, latest ${latest?.latencyMs} milliseconds`}
      >
        <polyline points={points} fill="none" stroke="#089981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 text-right text-xs font-mono text-[#787b86]">
        {latest ? `${latest.latencyMs}ms · ${new Date(latest.checkedAt).toLocaleTimeString()}` : ""}
      </div>
    </div>
  );
}

function FeedsPanel({ feedProbes }: { feedProbes: { candlesticks: FeedProbe; quotes: FeedProbe } | null }) {
  const feeds = [
    { label: "Candlestick feed", probe: feedProbes?.candlesticks ?? null, description: "Kline data used to draw chart candles" },
    { label: "Quote feed", probe: feedProbes?.quotes ?? null, description: "Live price data for quotes and controls" },
  ];
  return (
    <PanelGrid>
      {feeds.map((feed) => (
        <Panel key={feed.label} title={feed.label}>
          <Row
            label="Status"
            value={
              <span className={feed.probe?.level === "healthy" ? "text-[#089981]" : "text-[#f7931a]"}>
                {feed.probe ? (feed.probe.level === "healthy" ? "Healthy" : feed.probe.level === "unhealthy" ? "Failing" : "Unavailable") : "Waiting"}
              </span>
            }
          />
          <Row label="Probe latency" value={feed.probe?.latencyMs != null ? `${feed.probe.latencyMs}ms` : "N/A"} />
          <p className="text-xs text-[#787b86]">{feed.description}. Each chart also shows its own live/reconnecting feed status.</p>
        </Panel>
      ))}
    </PanelGrid>
  );
}

function ManagerPanel({ health }: { health: HealthSnapshot | null }) {
  return (
    <PanelGrid>
      <Panel title="Manager">
        <Row label="Status" value={managerLabel(health)} />
        <Row label="Ready" value={health?.managerReady ? "Yes" : "No"} />
        <Row label="Error" value={health?.managerError ?? "None"} />
      </Panel>
      <Panel title="What it does">
        <p className="text-sm text-[#787b86]">
          The manager coordinates the Binance session: credentials, position mode, and the private stream. It must be ready before orders can be submitted.
        </p>
      </Panel>
    </PanelGrid>
  );
}

function StreamPanel({ tradingHealth }: { tradingHealth: TradingHealthSnapshot | null }) {
  const stream = tradingHealth?.feed.serverTradingStream;
  return (
    <PanelGrid>
      <Panel title="Private account stream">
        <Row label="Status" value={stream ? streamLabel(stream.status) : "N/A"} />
        <Row label="Phase" value={stream?.phase ?? "N/A"} />
        <Row label="Last message" value={formatTime(stream?.lastMessageAt ?? null)} />
        <Row label="Reconnects" value={stream?.reconnects == null ? "N/A" : String(stream.reconnects)} />
        <Row label="Snapshot received" value={formatTime(stream?.snapshotAt ?? null)} />
      </Panel>
      <Panel title="Notes">
        <p className="text-sm text-[#787b86]">
          The private stream carries order and account updates. It is separate from chart market data — chart feed health lives in the Market feeds block and on each chart.
        </p>
      </Panel>
    </PanelGrid>
  );
}

function ReconciliationPanel({ tradingHealth, performance }: { tradingHealth: TradingHealthSnapshot | null; performance: PerformanceMetrics | null }) {
  const recon = tradingHealth?.execution.reconciliation;
  const recent = recon?.recent ?? [];
  return (
    <PanelGrid>
      <Panel title="Account consistency">
        <Row label="Mismatches (current run)" value={recon ? String(recon.mismatches) : "N/A"} />
        <Row label="Total runs" value={recon ? String(recon.runs) : "N/A"} />
        <Row label="Drift detected (lifetime)" value={performance ? String(performance.reconciliation.drift_detected) : "N/A"} />
        <Row label="Drift rate" value={performance ? `${performance.reconciliation.drift_rate_pct}%` : "N/A"} />
        <p className="text-xs text-[#787b86]">Mismatch counts and the list cover the current server run only. Errors from a previous run stay in the trade journal and lifetime metrics below.</p>
      </Panel>
      <Panel title="Recent mismatches (current run)">
        {recent.length === 0 ? (
          <p className="text-xs text-[#787b86]">No recent mismatches.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {recent.map((mismatch) => (
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
      </Panel>
    </PanelGrid>
  );
}

function BreakersPanel({ tradingHealth }: { tradingHealth: TradingHealthSnapshot | null }) {
  const breakers = tradingHealth?.circuits.breakers ?? [];
  return (
    <Panel title="Circuit breakers">
      {breakers.length === 0 ? (
        <p className="text-sm text-[#787b86]">No circuit breakers registered in this environment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#2a2e39] text-xs uppercase text-[#787b86]">
              <tr>
                <th className="px-3 py-2 font-medium">Breaker</th>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 font-medium">Last failure</th>
                <th className="px-3 py-2 font-medium">Opened</th>
                <th className="px-3 py-2 font-medium">Rejections</th>
              </tr>
            </thead>
            <tbody>
              {breakers.map((breaker) => (
                <tr key={breaker.name} className="border-b border-[#2a2e39] last:border-0">
                  <td className="px-3 py-2 font-medium">{breaker.name}</td>
                  <td className="px-3 py-2 capitalize">{breaker.state}</td>
                  <td className="px-3 py-2 font-mono text-xs">{formatTime(breaker.lastFailureTime)}</td>
                  <td className="px-3 py-2 font-mono text-xs">{formatTime(breaker.openedAt)}</td>
                  <td className="px-3 py-2 font-mono">{breaker.totalRejections}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function PerformancePanel({ performance }: { performance: PerformanceMetrics | null }) {
  if (!performance) return <p className="text-sm text-[#787b86]">Performance metrics are unavailable.</p>;
  const groups: Array<{ title: string; rows: Array<[string, string | number]> }> = [
    {
      title: "Order flow",
      rows: [
        ["Submitted", performance.orders.submitted],
        ["Filled", performance.orders.filled],
        ["Canceled", performance.orders.canceled],
        ["Rejected", performance.orders.rejected],
        ["Fill rate", `${performance.orders.fill_rate_pct}%`],
        ["Submission p95", latencyValue(performance.orders.submission_latency_ms?.p95)],
      ],
    },
    {
      title: "Application API",
      rows: [
        ["Requests", performance.api.requests],
        ["Errors", performance.api.errors],
        ["Error rate", `${performance.api.error_rate_pct}%`],
        ["Latency avg", latencyValue(performance.api.latency_ms?.avg)],
        ["Latency p95", latencyValue(performance.api.latency_ms?.p95)],
      ],
    },
    {
      title: "Private stream",
      rows: [
        ["Messages", performance.websocket.messages],
        ["Reconnects", performance.websocket.reconnects],
        ["Errors", performance.websocket.errors],
        ["Lag p95", latencyValue(performance.websocket.lag_ms?.p95)],
        ["Last event", ageValue(performance.websocket.last_event_age_ms)],
      ],
    },
    {
      title: "Reconciliation and safety",
      rows: [
        ["Runs", performance.reconciliation.runs],
        ["Drift detected", performance.reconciliation.drift_detected],
        ["Drift rate", `${performance.reconciliation.drift_rate_pct}%`],
        ["Average duration", latencyValue(performance.reconciliation.duration_ms?.avg)],
        ["Freeze events", performance.risk.freeze_events],
        ["Limit breaches", performance.risk.limit_breaches],
      ],
    },
  ];
  return (
    <PanelGrid>
      {groups.map((group) => (
        <Panel key={group.title} title={group.title}>
          {group.rows.map(([label, value]) => (
            <Row key={label} label={label} value={String(value)} />
          ))}
        </Panel>
      ))}
    </PanelGrid>
  );
}

function EventsPanel({ metrics }: { metrics: MetricsSnapshot | null }) {
  const events = metrics?.recent_events ?? [];
  return (
    <div className="overflow-hidden rounded border border-[#2a2e39]">
      {events.length ? (
        events.slice().reverse().slice(0, 12).map((event, index) => (
          <div key={`${event.ts}-${event.type}-${index}`} className="flex flex-wrap items-center gap-3 border-b border-[#2a2e39] px-4 py-2.5 text-sm last:border-0">
            <span className="w-20 shrink-0 font-mono text-xs text-[#787b86]">{formatTime(event.ts)}</span>
            <span className="rounded border border-[#2a2e39] bg-[#1e2329] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#9aa1ad]">{event.type}</span>
            <span className="min-w-0 flex-1 text-[#d1d4dc]">{event.label}</span>
          </div>
        ))
      ) : (
        <div className="px-4 py-6 text-sm text-[#787b86]">No server events recorded yet.</div>
      )}
    </div>
  );
}

function TerminalLogsPanel({ logs, error }: { logs: TerminalLogsSnapshot | null; error: string | null }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Follow the newest output while the panel is open, like a real terminal.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs?.timestamp, logs?.total]);

  if (error && !logs) {
    return <p className="text-sm text-[#f7931a]">Terminal logs are unavailable: {error}</p>;
  }
  if (!logs) {
    return <p className="text-sm text-[#787b86]">Waiting for terminal output…</p>;
  }
  return (
    <div>
      <div className="mb-2 text-xs text-[#787b86]">
        Captured server terminal output — the same lines the `npm start` process prints.
        Showing the last {logs.lines.length} of {logs.total} lines since start{logs.dropped > 0 ? `, ${logs.dropped} older evicted` : ""}.
      </div>
      <div ref={scrollRef} className="max-h-96 overflow-y-auto rounded border border-[#2a2e39] bg-black/60 p-3">
        {logs.lines.length === 0 ? (
          <div className="text-xs text-[#787b86]">No terminal output captured yet.</div>
        ) : (
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5">
            {logs.lines.map((line) => (
              <div
                key={line.seq}
                className={line.stream === "stderr" ? "text-[#f23645]" : "text-[#9aa1ad]"}
              >
                <span className="mr-2 text-[#586174]">{String(line.seq).padStart(4, "0")}</span>
                {line.text}
              </div>
            ))}
          </pre>
        )}
      </div>
      <p className="mt-2 text-xs text-[#787b86]">
        stderr lines are red. Output is captured per server process and resets on restart.
      </p>
    </div>
  );
}

// --- Small formatters ---

function formatUptime(seconds: number | null): string {
  if (seconds == null) return "N/A";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function latencyValue(value: number | string | null | undefined): string {
  return value == null ? "N/A" : `${value}ms`;
}

function ageValue(milliseconds: number | null): string {
  if (milliseconds == null) return "N/A";
  if (milliseconds < 1000) return "Just now";
  return `${Math.floor(milliseconds / 1000)}s ago`;
}
