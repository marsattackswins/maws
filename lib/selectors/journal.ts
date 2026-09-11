import type {
  BalanceHistoryEntry,
  ChartPosition,
  JournalEntry,
  OrderHistoryEntry,
} from "@/types";
import {
  pnlPercent,
  parseFiniteNumber,
  type JournalTrade,
  UNAVAILABLE_METADATA,
} from "@/lib/trading/journal";

export interface PaperJournalInput {
  orderHistory: readonly OrderHistoryEntry[];
  balanceHistory: readonly BalanceHistoryEntry[];
  journal: readonly JournalEntry[];
  positions: readonly ChartPosition[];
}

/**
 * Normalizes browser-local paper history without reading the Zustand singleton.
 * This keeps the transformation usable in selectors, tests, and future UI code.
 */
export function normalizePaperTrades(input: PaperJournalInput): JournalTrade[] {
  const trades: JournalTrade[] = [];

  for (const balance of input.balanceHistory) {
    if (balance.type !== "realized_pnl") continue;
    const parsed = parseCloseNote(balance.note);
    const closingOrder = findClosingOrder(input.orderHistory, balance, parsed);
    const size = parsed?.size ?? closingOrder?.qty ?? 0;
    const side = parsed?.side ?? oppositeOrderSide(closingOrder?.side) ?? "long";
    const entry = parsed?.entryPrice ?? findEntryPrice(input.orderHistory, balance, side);
    const exit = parsed?.exitPrice ?? closingOrder?.fillPrice ?? closingOrder?.price ?? null;
    const openingTime = findEntryTime(input.orderHistory, balance, side);
    const notes = balance.note || nearestJournalNote(input.journal, balance.time);

    trades.push({
      id: `paper-realized-${balance.id}`,
      timestamp: balance.time,
      symbol: parsed?.symbol ?? balance.symbol ?? closingOrder?.symbol ?? "UNKNOWN",
      side,
      size,
      entryPrice: entry,
      exitPrice: exit,
      pnlUsd: balance.amount,
      pnlPct: pnlPercent(balance.amount, entry, size),
      source: "paper",
      strategy: null,
      timeframe: null,
      tags: null,
      notes,
      durationMs: openingTime == null ? null : Math.max(0, balance.time - openingTime),
      status: "closed",
      metadataAvailability: { ...UNAVAILABLE_METADATA },
    });
  }

  for (const order of input.orderHistory) {
    if (order.status !== "filled") continue;
    trades.push({
      id: `paper-order-${order.id}`,
      timestamp: order.time,
      symbol: order.symbol,
      side: order.side === "buy" ? "long" : "short",
      size: order.qty,
      entryPrice: order.fillPrice ?? order.price,
      exitPrice: null,
      pnlUsd: null,
      pnlPct: null,
      source: "paper",
      strategy: null,
      timeframe: null,
      tags: null,
      notes: null,
      durationMs: null,
      status: "execution",
      metadataAvailability: { ...UNAVAILABLE_METADATA },
    });
  }

  for (const position of input.positions) {
    trades.push({
      id: `paper-position-${position.id}`,
      timestamp: position.openedAt ?? Date.now(),
      symbol: position.symbol,
      side: position.side,
      size: position.qty,
      entryPrice: position.entry,
      exitPrice: null,
      pnlUsd: null,
      pnlPct: null,
      source: "paper",
      strategy: null,
      timeframe: null,
      tags: null,
      notes: null,
      durationMs: null,
      status: "open",
      metadataAvailability: { ...UNAVAILABLE_METADATA },
    });
  }

  return trades.sort((a, b) => b.timestamp - a.timestamp);
}

export const selectPaperTrades = normalizePaperTrades;

interface ParsedCloseNote {
  side: "long" | "short";
  symbol: string;
  exitPrice: number;
  size: number;
  entryPrice: number;
}

function parseCloseNote(note: string): ParsedCloseNote | null {
  const match = note.match(
    /Close\s+(long|short)\s+position\s+for\s+symbol\s+(\S+)\s+at\s+price\s+([\d.+-]+)\s+for\s+([\d.+-]+)\s+units\.\s+Position\s+AVG\s+Price\s+was\s+([\d.+-]+)/i,
  );
  if (!match) return null;
  const exitPrice = parseFiniteNumber(match[3]);
  const size = parseFiniteNumber(match[4]);
  const entryPrice = parseFiniteNumber(match[5]);
  if (exitPrice == null || size == null || entryPrice == null) return null;
  return {
    side: match[1].toLowerCase() as "long" | "short",
    symbol: match[2],
    exitPrice,
    size,
    entryPrice,
  };
}

function findClosingOrder(
  orders: readonly OrderHistoryEntry[],
  balance: BalanceHistoryEntry,
  parsed: ParsedCloseNote | null,
): OrderHistoryEntry | null {
  return orders.find((order) =>
    order.status === "filled" &&
    order.time <= balance.time &&
    order.time >= balance.time - 1_000 &&
    (!parsed || (order.symbol === parsed.symbol && order.side === (parsed.side === "long" ? "sell" : "buy"))),
  ) ?? null;
}

function findEntryPrice(
  orders: readonly OrderHistoryEntry[],
  balance: BalanceHistoryEntry,
  side: "long" | "short",
): number | null {
  const entry = orders.find((order) =>
    order.status === "filled" &&
    order.symbol === balance.symbol &&
    order.side === (side === "long" ? "buy" : "sell") &&
    order.time <= balance.time,
  );
  return entry?.fillPrice ?? entry?.price ?? null;
}

function findEntryTime(
  orders: readonly OrderHistoryEntry[],
  balance: BalanceHistoryEntry,
  side: "long" | "short",
): number | null {
  const entry = orders.find((order) =>
    order.status === "filled" &&
    order.symbol === balance.symbol &&
    order.side === (side === "long" ? "buy" : "sell") &&
    order.time <= balance.time,
  );
  return entry?.time ?? null;
}

function oppositeOrderSide(side: OrderHistoryEntry["side"] | undefined): "long" | "short" | null {
  if (side === "sell") return "long";
  if (side === "buy") return "short";
  return null;
}

function nearestJournalNote(journal: readonly JournalEntry[], timestamp: number): string | null {
  const entry = journal.find((item) => Math.abs(item.time - timestamp) <= 1_000);
  return entry?.text ?? null;
}
