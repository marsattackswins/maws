export type JournalSource = "paper" | "live";
export type JournalTradeStatus = "closed" | "open" | "execution";

export interface JournalMetadataAvailability {
  strategy: boolean;
  timeframe: boolean;
  indicators: boolean;
  excursion: boolean;
}

export interface JournalTrade {
  id: string;
  timestamp: number;
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number | null;
  exitPrice: number | null;
  pnlUsd: number | null;
  pnlPct: number | null;
  source: JournalSource;
  strategy: string | null;
  timeframe: string | null;
  tags: string[] | null;
  notes: string | null;
  durationMs: number | null;
  status: JournalTradeStatus;
  metadataAvailability: JournalMetadataAvailability;
}

export interface JournalAnalytics {
  numberOfTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  winRatePct: number | null;
  averageWinUsd: number | null;
  averageLossUsd: number | null;
  profitFactor: number | null;
  totalPnlUsd: number;
}

export const UNAVAILABLE_METADATA: JournalMetadataAvailability = {
  strategy: false,
  timeframe: false,
  indicators: false,
  excursion: false,
};

export function calculateJournalAnalytics(trades: readonly JournalTrade[]): JournalAnalytics {
  const closed = trades.filter((trade) => trade.status === "closed" && trade.pnlUsd != null);
  const wins = closed.filter((trade) => (trade.pnlUsd ?? 0) > 0);
  const losses = closed.filter((trade) => (trade.pnlUsd ?? 0) < 0);
  const breakeven = closed.filter((trade) => (trade.pnlUsd ?? 0) === 0);
  const grossProfit = wins.reduce((sum, trade) => sum + (trade.pnlUsd ?? 0), 0);
  const grossLoss = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnlUsd ?? 0), 0));

  return {
    numberOfTrades: closed.length,
    winningTrades: wins.length,
    losingTrades: losses.length,
    breakevenTrades: breakeven.length,
    winRatePct: closed.length > 0 ? (wins.length / closed.length) * 100 : null,
    averageWinUsd: wins.length > 0 ? grossProfit / wins.length : null,
    averageLossUsd: losses.length > 0 ? -grossLoss / losses.length : null,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : null,
    totalPnlUsd: closed.reduce((sum, trade) => sum + (trade.pnlUsd ?? 0), 0),
  };
}

export function pnlPercent(pnlUsd: number | null, entryPrice: number | null, size: number): number | null {
  if (pnlUsd == null || entryPrice == null || entryPrice <= 0 || size <= 0) return null;
  return (pnlUsd / (entryPrice * size)) * 100;
}

export function parseFiniteNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
