import "server-only";

import {
  calculateJournalAnalytics,

  parseFiniteNumber,
  type JournalAnalytics,
  type JournalTrade,
  UNAVAILABLE_METADATA,
} from "@/lib/trading/journal";

export interface LiveJournalFillRow {
  id: number;
  ts: number;
  symbol: string;
  side: "BUY" | "SELL" | string;
  qty: string;
  price: string;
  realized_pnl: string | null;
  client_order_id: string | null;
  exchange_order_id: string | null;
  source: string;
}

export interface LiveJournalQuery {
  fills: readonly LiveJournalFillRow[];
}

export interface LiveJournalResult {
  trades: JournalTrade[];
  analytics: JournalAnalytics;
}

/**
 * Converts durable live fills into conservative journal records. A non-zero
 * realized P&L is evidence of a closing fill, but entry linkage is not assumed;
 * all other fills remain visible as execution records.
 */
export function aggregateLiveJournal(input: LiveJournalQuery): LiveJournalResult {
  const trades = input.fills.map(normalizeLiveFill);
  return { trades, analytics: calculateJournalAnalytics(trades) };
}

export function normalizeLiveFill(fill: LiveJournalFillRow): JournalTrade {
  const size = parseFiniteNumber(fill.qty) ?? 0;
  const price = parseFiniteNumber(fill.price);
  const pnl = fill.realized_pnl == null ? null : parseFiniteNumber(fill.realized_pnl);
  const isClosed = pnl != null && Math.abs(pnl) > 0;
  const executionSide = fill.side.toUpperCase() === "SELL" ? "short" : "long";
  const side = isClosed
    ? fill.side.toUpperCase() === "SELL" ? "long" : "short"
    : executionSide;

  return {
    id: `live-fill-${fill.id}`,
    timestamp: fill.ts,
    symbol: fill.symbol,
    side,
    size,
    entryPrice: null,
    exitPrice: isClosed ? price : null,
    pnlUsd: isClosed ? pnl : null,
    pnlPct: null,
    source: "live",
    strategy: null,
    timeframe: null,
    tags: null,
    notes: isClosed ? "Entry linkage unavailable; normalized from realized live fill." : null,
    durationMs: null,
    status: isClosed ? "closed" : "execution",
    metadataAvailability: { ...UNAVAILABLE_METADATA },
  };
}
