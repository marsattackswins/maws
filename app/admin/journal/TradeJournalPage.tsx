"use client";

import Link from "next/link";
import { ArrowLeft, Download, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { selectPaperTrades } from "@/lib/selectors/journal";
import {
  calculateJournalAnalytics,
  type JournalAnalytics,
  type JournalSource,
  type JournalTrade,
} from "@/lib/trading/journal";

type SourceFilter = "all" | JournalSource;
type SideFilter = "all" | JournalTrade["side"];
type OutcomeFilter = "all" | "win" | "loss" | "breakeven";

interface LiveJournalResponse {
  trades: JournalTrade[];
}

export default function TradeJournalPage() {
  const orderHistory = useAppStore((state) => state.orderHistory);
  const balanceHistory = useAppStore((state) => state.balanceHistory);
  const journal = useAppStore((state) => state.journal);
  const positions = useAppStore((state) => state.positions);

  const [liveTrades, setLiveTrades] = useState<JournalTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [source, setSource] = useState<SourceFilter>("all");
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<SideFilter>("all");
  const [outcome, setOutcome] = useState<OutcomeFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [selectedTrade, setSelectedTrade] = useState<JournalTrade | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const paperTrades = useMemo(
    () => selectPaperTrades({ orderHistory, balanceHistory, journal, positions }),
    [orderHistory, balanceHistory, journal, positions],
  );

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: "500" });
    const trimmedSymbol = symbol.trim();
    if (trimmedSymbol) params.set("symbol", trimmedSymbol);
    const fromTimestamp = dateStart(from);
    const toTimestamp = dateEnd(to);
    if (fromTimestamp != null) params.set("from", String(fromTimestamp));
    if (toTimestamp != null) params.set("to", String(toTimestamp));

    setLoading(true);
    fetch(`/api/admin/journal?${params.toString()}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          let detail = response.statusText;
          try {
            const body = (await response.json()) as { error?: { message?: string } };
            detail = body.error?.message ?? detail;
          } catch {
            // Keep the HTTP status text when the response is not JSON.
          }
          throw new Error(`Live journal request failed: ${detail}`);
        }
        return response.json() as Promise<LiveJournalResponse>;
      })
      .then((data) => {
        setLiveTrades(Array.isArray(data.trades) ? data.trades : []);
        setFetchError(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (error instanceof Error && error.name === "AbortError") return;
        setLiveTrades([]);
        setFetchError(error instanceof Error ? error.message : "Failed to load live journal data");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [symbol, from, to, refreshNonce]);

  const allTrades = useMemo(() => [...paperTrades, ...liveTrades], [paperTrades, liveTrades]);
  const filteredTrades = useMemo(
    () =>
      allTrades
        .filter((trade) => source === "all" || trade.source === source)
        .filter((trade) => !symbol.trim() || trade.symbol.toLowerCase().includes(symbol.trim().toLowerCase()))
        .filter((trade) => side === "all" || trade.side === side)
        .filter((trade) => matchesOutcome(trade, outcome))
        .filter((trade) => from === "" || trade.timestamp >= (dateStart(from) ?? Number.NEGATIVE_INFINITY))
        .filter((trade) => to === "" || trade.timestamp <= (dateEnd(to) ?? Number.POSITIVE_INFINITY))
        .sort((a, b) => b.timestamp - a.timestamp),
    [allTrades, source, symbol, side, outcome, from, to],
  );
  const analytics = useMemo(() => calculateJournalAnalytics(filteredTrades), [filteredTrades]);

  useEffect(() => {
    if (!selectedTrade) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTrade(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTrade]);

  useEffect(() => {
    if (!exportError) return;
    const timeout = window.setTimeout(() => setExportError(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [exportError]);

  const handleExport = () => {
    try {
      const csv = tradesToCsv(filteredTrades);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `maws-journal-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      setExportError(error instanceof Error ? error.message : "CSV generation failed");
    }
  };

  return (
    <main className="h-screen overflow-y-auto bg-[#0b0e11] p-4 text-[#d1d4dc] sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Trade Journal</h1>
            <p className="mt-2 text-sm text-[#787b86]">
              Unified read-only view of browser-local Paper and server-side Live records.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded border border-[#2a2e39] px-3 py-2 text-sm text-[#d1d4dc] transition-colors hover:border-[#2962ff] hover:text-white"
          >
            <ArrowLeft size={15} />
            Admin dashboard
          </Link>
        </header>

        {fetchError && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#5c2830] bg-[#241316] px-4 py-3 text-sm">
            <div>
              <div className="font-medium text-[#f23645]">Live journal unavailable</div>
              <div className="mt-1 text-[#d1a0a5]">{fetchError} Paper records remain available locally.</div>
            </div>
            <button
              type="button"
              onClick={() => setRefreshNonce((value) => value + 1)}
              className="inline-flex items-center gap-2 rounded border border-[#6c3038] px-3 py-1.5 text-[#f0c0c4] hover:border-[#f23645]"
            >
              <RefreshCw size={14} />
              Retry live request
            </button>
          </div>
        )}

        <FilterToolbar
          source={source}
          symbol={symbol}
          side={side}
          outcome={outcome}
          from={from}
          to={to}
          onSourceChange={setSource}
          onSymbolChange={setSymbol}
          onSideChange={setSide}
          onOutcomeChange={setOutcome}
          onFromChange={setFrom}
          onToChange={setTo}
          onExport={handleExport}
          exportDisabled={filteredTrades.length === 0}
        />

        {loading ? (
          <StatePanel title="Loading trade journal" detail="Fetching live records and preparing paper records..." />
        ) : allTrades.length === 0 ? (
          <StatePanel title="No journal records" detail="There are no Paper or Live records matching the current data set." />
        ) : filteredTrades.length === 0 ? (
          <StatePanel title="No matching trades" detail="Try clearing one or more filters." />
        ) : (
          <>
            <AnalyticsCards analytics={analytics} />
            <TradeTable trades={filteredTrades} onTradeClick={setSelectedTrade} />
          </>
        )}
      </div>
      {exportError && (
        <div role="alert" className="fixed bottom-4 right-4 z-50 rounded border border-[#6c3038] bg-[#241316] px-4 py-3 text-sm text-[#f0c0c4] shadow-lg">
          CSV export failed: {exportError}
        </div>
      )}
      {selectedTrade && <TradeDetailsModal trade={selectedTrade} onClose={() => setSelectedTrade(null)} />}
    </main>
  );
}

function FilterToolbar({
  source,
  symbol,
  side,
  outcome,
  from,
  to,
  onSourceChange,
  onSymbolChange,
  onSideChange,
  onOutcomeChange,
  onFromChange,
  onToChange,
  onExport,
  exportDisabled,
}: {
  source: SourceFilter;
  symbol: string;
  side: SideFilter;
  outcome: OutcomeFilter;
  from: string;
  to: string;
  onSourceChange: (value: SourceFilter) => void;
  onSymbolChange: (value: string) => void;
  onSideChange: (value: SideFilter) => void;
  onOutcomeChange: (value: OutcomeFilter) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onExport: () => void;
  exportDisabled: boolean;
}) {
  return (
    <section className="mb-6 rounded-lg border border-[#2a2e39] bg-[#131722] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[#d1d4dc]">Journal filters</h2>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[#787b86] sm:inline">Applied to Paper and Live records</span>
          <button
            type="button"
            onClick={onExport}
            disabled={exportDisabled}
            className="inline-flex items-center gap-2 rounded border border-[#2a2e39] px-3 py-1.5 text-xs font-medium text-[#d1d4dc] transition-colors hover:border-[#2962ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SelectField label="Source" value={source} onChange={(value) => onSourceChange(value as SourceFilter)} options={[
          ["all", "All"], ["paper", "Paper"], ["live", "Live"],
        ]} />
        <label className="text-sm">
          <span className="mb-1 block text-[#787b86]">Symbol</span>
          <input
            value={symbol}
            onChange={(event) => onSymbolChange(event.target.value.toUpperCase())}
            placeholder="BTCUSDT"
            className="h-9 w-full rounded border border-[#2a2e39] bg-[#0b0e11] px-2 text-[#d1d4dc] outline-none placeholder:text-[#4f5360] focus:border-[#2962ff]"
          />
        </label>
        <SelectField label="Side" value={side} onChange={(value) => onSideChange(value as SideFilter)} options={[
          ["all", "All"], ["long", "Long"], ["short", "Short"],
        ]} />
        <SelectField label="Outcome" value={outcome} onChange={(value) => onOutcomeChange(value as OutcomeFilter)} options={[
          ["all", "All"], ["win", "Win"], ["loss", "Loss"], ["breakeven", "Breakeven"],
        ]} />
        <DateField label="From" value={from} onChange={onFromChange} />
        <DateField label="To" value={to} onChange={onToChange} />
      </div>
    </section>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-[#787b86]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded border border-[#2a2e39] bg-[#0b0e11] px-2 text-[#d1d4dc] outline-none focus:border-[#2962ff]"
      >
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-[#787b86]">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded border border-[#2a2e39] bg-[#0b0e11] px-2 text-[#d1d4dc] outline-none focus:border-[#2962ff]"
      />
    </label>
  );
}

function AnalyticsCards({ analytics }: { analytics: JournalAnalytics }) {
  const cards: [string, string, string?][] = [
    ["Total P&L", formatUsd(analytics.totalPnlUsd), pnlToneClass(analytics.totalPnlUsd)],
    ["Closed trades", String(analytics.numberOfTrades)],
    ["Win rate", formatPercent(analytics.winRatePct)],
    ["Average win", formatUsdOrUnavailable(analytics.averageWinUsd), pnlToneClass(analytics.averageWinUsd)],
    ["Average loss", formatUsdOrUnavailable(analytics.averageLossUsd), pnlToneClass(analytics.averageLossUsd)],
    ["Profit factor", formatFactor(analytics.profitFactor)],
  ];
  return (
    <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Journal analytics">
      {cards.map(([label, value, tone]) => (
        <div key={label} className="rounded-lg border border-[#2a2e39] bg-[#131722] p-4 shadow-sm shadow-black/10">
          <div className="text-xs font-medium uppercase tracking-wide text-[#787b86]">{label}</div>
          <div className={`mt-2 text-xl font-semibold tabular-nums ${tone === "positive" ? "text-[#089981]" : tone === "negative" ? "text-[#f23645]" : "text-[#d1d4dc]"}`}>
            {value}
          </div>
        </div>
      ))}
    </section>
  );
}

function TradeTable({ trades, onTradeClick }: { trades: JournalTrade[]; onTradeClick: (trade: JournalTrade) => void }) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#2a2e39] bg-[#131722]">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[1250px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-[#2a2e39] bg-[#131722] text-xs uppercase text-[#787b86]">
            <tr>
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium">Timestamp</th>
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium">Symbol</th>
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium">Side</th>
              <th className="whitespace-nowrap px-3 py-3 text-right font-medium">Size</th>
              <th className="whitespace-nowrap px-3 py-3 text-right font-medium">Entry</th>
              <th className="whitespace-nowrap px-3 py-3 text-right font-medium">Exit</th>
              <th className="whitespace-nowrap px-3 py-3 text-right font-medium">P&amp;L (USDT)</th>
              <th className="whitespace-nowrap px-3 py-3 text-right font-medium">P&amp;L %</th>
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium">Source</th>
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium">Status</th>
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium">Strategy</th>
              <th className="whitespace-nowrap px-3 py-3 text-left font-medium">Notes / tags</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const pnlTone = pnlToneClass(trade.pnlUsd);
              return (
                <tr
                  key={`${trade.source}-${trade.id}`}
                  onClick={() => onTradeClick(trade)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onTradeClick(trade);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer border-b border-[#20242e] odd:bg-[#151923] last:border-0 hover:bg-[#1d2431] focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[#2962ff]"
                >
                  <td className="whitespace-nowrap px-3 py-3 text-left text-[#aeb3c0]">{formatTimestamp(trade.timestamp)}</td>
                  <td className="px-3 py-3 text-left font-medium">{trade.symbol || "N/A"}</td>
                  <td className="px-3 py-3 text-left capitalize">{trade.side}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{formatNumber(trade.size)}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{formatNullableNumber(trade.entryPrice)}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{formatNullableNumber(trade.exitPrice)}</td>
                  <td className={`px-3 py-3 text-right font-mono tabular-nums ${pnlTone}`}>{formatNullableUsd(trade.pnlUsd)}</td>
                  <td className={`px-3 py-3 text-right font-mono tabular-nums ${pnlTone}`}>{formatNullablePercent(trade.pnlPct)}</td>
                  <td className="px-3 py-3 text-left"><SourceBadge source={trade.source} /></td>
                  <td className="px-3 py-3 text-left capitalize text-[#aeb3c0]">{trade.status}</td>
                  <td className="px-3 py-3 text-left">{trade.strategy ?? "N/A"}</td>
                  <td className="max-w-[260px] px-3 py-3 text-left text-[#aeb3c0]" title={trade.notes ?? undefined}>{formatNotes(trade)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TradeDetailsModal({ trade, onClose }: { trade: JournalTrade; onClose: () => void }) {
  const details: [string, string][] = [
    ["Timestamp", formatTimestamp(trade.timestamp)],
    ["Symbol", trade.symbol || "N/A"],
    ["Side", trade.side],
    ["Size", formatNumber(trade.size)],
    ["Entry price", formatNullableNumber(trade.entryPrice)],
    ["Exit price", formatNullableNumber(trade.exitPrice)],
    ["P&L (USD)", formatNullableUsd(trade.pnlUsd)],
    ["P&L (%)", formatNullablePercent(trade.pnlPct)],
    ["Source", trade.source === "paper" ? "Paper" : "Live"],
    ["Strategy", trade.metadataAvailability.strategy ? trade.strategy ?? "N/A" : "N/A"],
    ["Timeframe", trade.metadataAvailability.timeframe ? trade.timeframe ?? "N/A" : "N/A"],
    ["Tags", trade.tags?.length ? trade.tags.join(", ") : "N/A"],
    ["Notes", trade.notes ?? "N/A"],
    ["Status", trade.status],
    ["Duration (ms)", trade.durationMs == null ? "N/A" : formatDuration(trade.durationMs)],
    ["Indicators", trade.metadataAvailability.indicators ? "Available" : "N/A"],
    ["Excursion", trade.metadataAvailability.excursion ? "Available" : "N/A"],
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="trade-details-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#2a2e39] bg-[#131722] p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="trade-details-title" className="text-lg font-semibold">Trade details</h2>
            <p className="mt-1 text-xs text-[#787b86]">Read-only journal record</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close trade details" className="rounded p-1 text-[#787b86] hover:bg-[#20242e] hover:text-white">
            <X size={18} />
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className={label === "Notes" ? "sm:col-span-2" : undefined}>
              <dt className="text-xs uppercase tracking-wide text-[#787b86]">{label}</dt>
              <dd className="mt-1 break-words text-sm text-[#d1d4dc]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function SourceBadge({ source }: { source: JournalSource }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${source === "paper" ? "border-[#76501c] bg-[#3a2b16] text-[#f3b562]" : "border-[#24577a] bg-[#152d40] text-[#72c7f5]"}`}>
      {source === "paper" ? "Paper" : "Live"}
    </span>
  );
}

function StatePanel({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-lg border border-[#2a2e39] bg-[#131722] px-4 py-12 text-center"><div className="text-lg font-medium">{title}</div><div className="mt-2 text-sm text-[#787b86]">{detail}</div></div>;
}

function matchesOutcome(trade: JournalTrade, outcome: OutcomeFilter) {
  if (outcome === "all") return true;
  if (trade.status !== "closed" || trade.pnlUsd == null) return false;
  if (outcome === "win") return trade.pnlUsd > 0;
  if (outcome === "loss") return trade.pnlUsd < 0;
  return trade.pnlUsd === 0;
}

function dateStart(value: string) {
  if (!value) return null;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function dateEnd(value: string) {
  if (!value) return null;
  const timestamp = Date.parse(`${value}T23:59:59.999Z`);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function pnlToneClass(value: number | null) {
  if (value == null || value === 0) return "text-[#aeb3c0]";
  return value > 0 ? "text-[#089981]" : "text-[#f23645]";
}

function formatTimestamp(timestamp: number) { return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : "N/A"; }
function formatNumber(value: number) { return Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "N/A"; }
function formatNullableNumber(value: number | null) { return value == null ? "N/A" : formatNumber(value); }
function formatUsd(value: number) { return `${value < 0 ? "-" : ""}$${Math.abs(value).toFixed(2)}`; }
function formatNullableUsd(value: number | null) { return value == null ? "N/A" : formatUsd(value); }
function formatUsdOrUnavailable(value: number | null) { return value == null ? "N/A" : formatUsd(value); }
function formatPercent(value: number | null) { return value == null ? "N/A" : `${value.toFixed(2)}%`; }
function formatNullablePercent(value: number | null) { return formatPercent(value); }
function formatFactor(value: number | null) { return value == null || !Number.isFinite(value) ? value === Infinity ? "∞" : "N/A" : value.toFixed(2); }
function formatNotes(trade: JournalTrade) {
  const tags = trade.tags?.length ? trade.tags.join(", ") : null;
  return trade.notes ?? tags ?? "N/A";
}

const CSV_COLUMNS = [
  "timestamp", "symbol", "side", "size", "entryPrice", "exitPrice", "pnlUsd", "pnlPct",
  "source", "strategy", "timeframe", "tags", "notes", "status",
] as const;

function tradesToCsv(trades: JournalTrade[]) {
  const rows = trades.map((trade) => [
    Number.isFinite(trade.timestamp) ? new Date(trade.timestamp).toISOString() : "",
    trade.symbol,
    trade.side,
    trade.size,
    trade.entryPrice,
    trade.exitPrice,
    trade.pnlUsd,
    trade.pnlPct,
    trade.source,
    trade.strategy,
    trade.timeframe,
    trade.tags?.join(", "),
    trade.notes,
    trade.status,
  ]);
  return [CSV_COLUMNS, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

function csvCell(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  return /[",\r\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}

function formatDuration(durationMs: number) {
  if (!Number.isFinite(durationMs) || durationMs < 0) return "N/A";
  if (durationMs < 1000) return `${durationMs} ms`;
  return `${(durationMs / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} s`;
}
