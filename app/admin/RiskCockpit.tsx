"use client";

import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

export type RiskStatus = "green" | "yellow" | "red" | "unavailable";

export interface RiskCockpitSnapshot {
  timestamp: number;
  env: "local" | "testnet" | "shadow" | "production";
  sourceAvailable: boolean;
  sourceMessage: string | null;
  account: {
    balanceUsd: number | null;
    equityUsd: number | null;
    usedMarginUsd: number | null;
    freeMarginUsd: number | null;
    unrealizedPnlUsd: number;
  };
  exposure: {
    grossNotionalUsd: number;
    effectiveLeverage: number | null;
    bySymbol: Array<{ symbol: string; notionalUsd: number; percentage: number }>;
  };
  limits: {
    maxOrderNotional: LimitStatus & { currentLabel: string };
    grossExposure: LimitStatus;
    positionCount: LimitStatus;
    dailyLoss: DailyLossStatus;
  };
  pnl: {
    realizedTodayUsd: number;
    unrealizedUsd: number;
    totalTodayUsd: number;
    dailyLossLimitUsd: number | null;
    distanceToDailyLossLimitUsd: number | null;
    distanceToDailyLossLimitPct: number | null;
  };
  positions: RiskPosition[];
}

interface LimitStatus {
  limit: number;
  current: number;
  utilization: number;
  status: RiskStatus;
}

interface DailyLossStatus {
  limitPct: number;
  limitUsd: number;
  currentRealizedUsd: number;
  currentLossPct: number;
  distanceUsd: number;
  distancePct: number;
  utilization: number;
  status: RiskStatus;
}

interface RiskPosition {
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  currentPrice: number;
  notional: number;
  leverage: number;
  liquidationPrice: number | null;
  liquidationDistancePct: number | null;
  liquidationStatus: RiskStatus;
  unrealizedPnl: number;
}

interface RiskCockpitProps {
  risk: RiskCockpitSnapshot | null;
  loading: boolean;
  error: string | null;
}

export default function RiskCockpit({ risk, loading, error }: RiskCockpitProps) {
  if (loading && !risk) {
    return <RiskMessage>Loading risk and exposure data...</RiskMessage>;
  }

  if (error && !risk) {
    return <RiskMessage tone="red">Failed to load risk data: {error}</RiskMessage>;
  }

  if (!risk) {
    return <RiskMessage>No risk data available</RiskMessage>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Risk &amp; Exposure</h2>
          <p className="mt-1 text-xs text-[#787b86]">
            Source: {risk.sourceAvailable ? `${risk.env} server state` : risk.sourceMessage}
          </p>
        </div>
        {error && <span className="text-xs text-[#f7931a]">Refresh failed: {error}</span>}
      </div>

      {!risk.sourceAvailable && (
        <div className="flex items-start gap-3 rounded-lg border border-[#3b3425] bg-[#211d16] p-4 text-sm text-[#f7931a]">
          <Info size={18} className="mt-0.5 shrink-0" />
          <span>{risk.sourceMessage ?? "No server-side trading state available"}</span>
        </div>
      )}

      <RiskSummaryCards risk={risk} />
      <RiskLimitsTable risk={risk} />
      <SymbolExposureTable risk={risk} />
      <PositionRiskTable risk={risk} />
    </div>
  );
}

export function RiskSummaryCards({ risk }: { risk: RiskCockpitSnapshot }) {
  const cards = [
    ["Gross Exposure", money(risk.exposure.grossNotionalUsd)],
    ["Equity", nullableMoney(risk.account.equityUsd)],
    ["Used Margin", nullableMoney(risk.account.usedMarginUsd)],
    ["Free Margin", nullableMoney(risk.account.freeMarginUsd)],
    ["Effective Leverage", multiple(risk.exposure.effectiveLeverage)],
    ["Realized P&L Today", pnl(risk.pnl.realizedTodayUsd)],
    ["Unrealized P&L", pnl(risk.pnl.unrealizedUsd)],
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
          <div className="text-xs text-[#787b86]">{label}</div>
          <div className="mt-2 whitespace-nowrap text-lg font-semibold font-mono">{value}</div>
        </div>
      ))}
    </div>
  );
}

export function RiskLimitsTable({ risk }: { risk: RiskCockpitSnapshot }) {
  const rows = [
    {
      label: "Max Order Notional",
      value: risk.limits.maxOrderNotional,
      currentLabel: risk.limits.maxOrderNotional.currentLabel,
    },
    { label: "Gross Exposure", value: risk.limits.grossExposure },
    { label: "Position Count", value: risk.limits.positionCount },
    {
      label: "Daily Loss",
      value: {
        limit: risk.limits.dailyLoss.limitUsd,
        current: Math.max(0, -risk.limits.dailyLoss.currentRealizedUsd),
        utilization: risk.limits.dailyLoss.utilization,
        status: risk.limits.dailyLoss.status,
      },
    },
  ];

  return (
    <Panel title="Risk Limit Utilization">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-[#2a2e39] text-xs uppercase text-[#787b86]">
            <tr>
              <th className="px-3 py-2 font-medium">Limit</th>
              <th className="px-3 py-2 font-medium">Current</th>
              <th className="px-3 py-2 font-medium">Configured</th>
              <th className="px-3 py-2 font-medium">Utilization</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = risk.sourceAvailable ? row.value.status : "unavailable";
              return (
                <tr key={row.label} className="border-b border-[#2a2e39] last:border-0">
                  <td className="px-3 py-3">{row.label}</td>
                  <td className="px-3 py-3 font-mono">
                    {risk.sourceAvailable
                      ? row.label === "Position Count" ? number(row.value.current) : money(row.value.current)
                      : "N/A"}
                  </td>
                  <td className="px-3 py-3 font-mono">
                    {row.label === "Position Count" ? number(row.value.limit) : money(row.value.limit)}
                    {row.label === "Daily Loss" && (
                      <span className="ml-1 text-xs text-[#787b86]">({risk.limits.dailyLoss.limitPct}%)</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono">
                    {risk.sourceAvailable ? percent(row.value.utilization * 100) : "N/A"}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={status} />
                    {row.currentLabel && <div className="mt-1 text-xs text-[#787b86]">{row.currentLabel}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function SymbolExposureTable({ risk }: { risk: RiskCockpitSnapshot }) {
  const sides = new Map<string, Set<string>>();
  for (const position of risk.positions) {
    const current = sides.get(position.symbol) ?? new Set<string>();
    current.add(position.side);
    sides.set(position.symbol, current);
  }

  return (
    <Panel title="Symbol Exposure">
      {risk.exposure.bySymbol.length === 0 ? (
        <EmptyState text="No open symbol exposure" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-[#2a2e39] text-xs uppercase text-[#787b86]">
              <tr>
                <th className="px-3 py-2 font-medium">Symbol</th>
                <th className="px-3 py-2 font-medium">Side</th>
                <th className="px-3 py-2 font-medium">Notional</th>
                <th className="px-3 py-2 font-medium">% of Gross</th>
              </tr>
            </thead>
            <tbody>
              {risk.exposure.bySymbol.map((row) => (
                <tr key={row.symbol} className="border-b border-[#2a2e39] last:border-0">
                  <td className="px-3 py-3 font-medium">{row.symbol}</td>
                  <td className="px-3 py-3">{[...(sides.get(row.symbol) ?? [])].join(" / ") || "—"}</td>
                  <td className="px-3 py-3 font-mono">{money(row.notionalUsd)}</td>
                  <td className="px-3 py-3 font-mono">{percent(row.percentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

export function PositionRiskTable({ risk }: { risk: RiskCockpitSnapshot }) {
  return (
    <Panel title="Position-Level Risk">
      {risk.positions.length === 0 ? (
        <EmptyState text="No open positions" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="border-b border-[#2a2e39] text-xs uppercase text-[#787b86]">
              <tr>
                {[
                  "Symbol", "Side", "Size", "Entry", "Mark", "Notional", "Leverage",
                  "Liquidation", "Distance", "Unrealized P&L", "Liq Status",
                ].map((heading) => <th key={heading} className="px-3 py-2 font-medium">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {risk.positions.map((position) => (
                <tr key={`${position.symbol}-${position.side}`} className="border-b border-[#2a2e39] last:border-0">
                  <td className="px-3 py-3 font-medium">{position.symbol}</td>
                  <td className={`px-3 py-3 uppercase ${position.side === "long" ? "text-[#089981]" : "text-[#f23645]"}`}>{position.side}</td>
                  <td className="px-3 py-3 font-mono">{number(position.size)}</td>
                  <td className="px-3 py-3 font-mono">{price(position.entryPrice)}</td>
                  <td className="px-3 py-3 font-mono">{price(position.currentPrice)}</td>
                  <td className="px-3 py-3 font-mono">{money(position.notional)}</td>
                  <td className="px-3 py-3 font-mono">{multiple(position.leverage)}</td>
                  <td className="px-3 py-3 font-mono">{nullablePrice(position.liquidationPrice)}</td>
                  <td className="px-3 py-3 font-mono">{nullablePercent(position.liquidationDistancePct)}</td>
                  <td className={`px-3 py-3 font-mono ${pnlClass(position.unrealizedPnl)}`}>{pnl(position.unrealizedPnl)}</td>
                  <td className="px-3 py-3"><StatusBadge status={position.liquidationStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
      <h3 className="mb-3 font-medium">{title}</h3>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: RiskStatus }) {
  const styles: Record<RiskStatus, string> = {
    green: "border-[#164d43] bg-[#102d29] text-[#089981]",
    yellow: "border-[#5a4320] bg-[#302514] text-[#f7931a]",
    red: "border-[#5b2028] bg-[#32171b] text-[#f23645]",
    unavailable: "border-[#2a2e39] bg-[#1b1e26] text-[#787b86]",
  };
  const Icon = status === "green" ? CheckCircle : status === "yellow" ? AlertCircle : status === "red" ? XCircle : Info;
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs capitalize ${styles[status]}`}>
      <Icon size={13} />
      {status}
    </span>
  );
}

function RiskMessage({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "red" }) {
  return (
    <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-6 text-sm">
      <span className={tone === "red" ? "text-[#f23645]" : "text-[#787b86]"}>{children}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="py-6 text-sm text-[#787b86]">{text}</div>;
}

function money(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function nullableMoney(value: number | null): string {
  return value == null ? "N/A" : money(value);
}

function pnl(value: number): string {
  return `${value >= 0 ? "+" : ""}${money(value)}`;
}

function pnlClass(value: number): string {
  return value > 0 ? "text-[#089981]" : value < 0 ? "text-[#f23645]" : "text-[#d1d4dc]";
}

function number(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function price(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
}

function nullablePrice(value: number | null): string {
  return value == null ? "N/A" : price(value);
}

function percent(value: number): string {
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

function nullablePercent(value: number | null): string {
  return value == null ? "N/A" : percent(value);
}

function multiple(value: number | null): string {
  return value == null ? "N/A" : `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}x`;
}
