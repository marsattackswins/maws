/**
 * Diagnostic logging for candle synchronization debugging.
 * All logging is disabled by default and controlled by environment variable.
 *
 * To enable: set NEXT_PUBLIC_DEBUG_CANDLES=true in .env.local
 */

import type { Candle, Timeframe } from "@/types";
import type { LiveMergeResult } from "./candle-reconcile";
import { countDuplicateTimestamps, isSortedByTime } from "./candle-reconcile";

const ENABLED = typeof process !== "undefined" && process.env.NEXT_PUBLIC_DEBUG_CANDLES === "true";

export type CandleEventSource = "REST" | "WebSocket" | "Reconcile" | "Visibility" | "Lifecycle";

export type CandleEventType =
  | "inserted"
  | "updated"
  | "ignored"
  | "rejected"
  | "duplicate"
  | "replaced"
  | "info";

export interface CandleEvent {
  symbol: string;
  timeframe: Timeframe;
  source: CandleEventSource;
  eventType: CandleEventType;
  rawTimestamp: number;
  normalizedTimestamp: number;
  candleCount: number;
  duplicateCount: number;
  isSorted: boolean;
  mergeResult?: LiveMergeResult;
  validationError?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Low-noise console logger that groups related events.
 */
class CandleDiagnostics {
  private eventBuffer: CandleEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds

  logEvent(event: CandleEvent): void {
    if (!ENABLED) return;

    this.eventBuffer.push(event);

    if (this.flushTimer === null) {
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, this.FLUSH_INTERVAL);
    }
  }

  /**
   * Log a REST history fetch result.
   */
  logRestHistory(
    symbol: string,
    timeframe: Timeframe,
    fetchedCount: number,
    mergedCount: number,
    duplicates: number,
  ): void {
    if (!ENABLED) return;

    this.logEvent({
      symbol,
      timeframe,
      source: "REST",
      eventType: "inserted",
      rawTimestamp: Date.now(),
      normalizedTimestamp: Date.now(),
      candleCount: mergedCount,
      duplicateCount: duplicates,
      isSorted: true,
      metadata: {
        fetchedCount,
        mergedCount,
      },
    });
  }

  /**
   * Log a WebSocket kline update.
   */
  logWebSocketUpdate(
    symbol: string,
    timeframe: Timeframe,
    rawTimestamp: number,
    normalizedTimestamp: number,
    mergeResult: LiveMergeResult,
    finalCandleCount: number,
    candles: Candle[],
  ): void {
    if (!ENABLED) return;

    const eventType: CandleEventType =
      mergeResult === "tip"
        ? "updated"
        : mergeResult === "append"
          ? "inserted"
          : mergeResult === "invalid"
            ? "rejected"
            : mergeResult === "duplicate"
              ? "duplicate"
              : "replaced";

    this.logEvent({
      symbol,
      timeframe,
      source: "WebSocket",
      eventType,
      rawTimestamp,
      normalizedTimestamp,
      candleCount: finalCandleCount,
      duplicateCount: countDuplicateTimestamps(candles),
      isSorted: isSortedByTime(candles),
      mergeResult,
    });
  }

  /**
   * Log a reconciliation operation.
   */
  logReconciliation(
    symbol: string,
    timeframe: Timeframe,
    restCount: number,
    liveCount: number,
    resultCount: number,
    candles: Candle[],
  ): void {
    if (!ENABLED) return;

    this.logEvent({
      symbol,
      timeframe,
      source: "Reconcile",
      eventType: "inserted",
      rawTimestamp: Date.now(),
      normalizedTimestamp: Date.now(),
      candleCount: resultCount,
      duplicateCount: countDuplicateTimestamps(candles),
      isSorted: isSortedByTime(candles),
      metadata: {
        restCount,
        liveCount,
        resultCount,
      },
    });
  }

  /**
   * Log a validation error.
   */
  logValidationError(
    symbol: string,
    timeframe: Timeframe,
    source: CandleEventSource,
    error: string,
    rawTimestamp: number,
  ): void {
    if (!ENABLED) return;

    this.logEvent({
      symbol,
      timeframe,
      source,
      eventType: "rejected",
      rawTimestamp,
      normalizedTimestamp: rawTimestamp,
      candleCount: 0,
      duplicateCount: 0,
      isSorted: true,
      validationError: error,
    });
  }

  /**
   * Log a Page Visibility transition and the feed's response decision.
   * Emitted from lib/market/visibility.ts.
   */
  logVisibilityChange(state: "visible" | "hidden", transitions: number): void {
    if (!ENABLED) return;
    this.logEvent({
      symbol: "*",
      timeframe: "1m",
      source: "Visibility",
      eventType: "info",
      rawTimestamp: Date.now(),
      normalizedTimestamp: Date.now(),
      candleCount: 0,
      duplicateCount: 0,
      isSorted: true,
      metadata: { state, transitions },
    });
  }

  /**
   * Log a feed-lifecycle decision: watchdog deferral while hidden, the
   * debounced visible-return reconcile, recovery releases, and socket
   * recycles. `details` carries decision-specific fields.
   */
  logLifecycleDecision(event: string, details: Record<string, unknown>): void {
    if (!ENABLED) return;
    this.logEvent({
      symbol: "*",
      timeframe: "1m",
      source: "Lifecycle",
      eventType: "info",
      rawTimestamp: Date.now(),
      normalizedTimestamp: Date.now(),
      candleCount: 0,
      duplicateCount: 0,
      isSorted: true,
      metadata: { event, ...details },
    });
  }

  /**
   * Immediately flush and log all buffered events.
   */
  flush(): void {
    if (!ENABLED || this.eventBuffer.length === 0) {
      this.eventBuffer = [];
      if (this.flushTimer) {
        clearTimeout(this.flushTimer);
        this.flushTimer = null;
      }
      return;
    }

    // Group events by symbol:timeframe
    const grouped = new Map<string, CandleEvent[]>();
    for (const event of this.eventBuffer) {
      const key = `${event.symbol}:${event.timeframe}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(event);
    }

    // Log each group
    for (const [key, events] of grouped.entries()) {
      const [symbol, timeframe] = key.split(":");
      const summary = this.summarizeEvents(events);

      console.group(
        `%c[Candle Diagnostics] ${symbol} ${timeframe}`,
        "color: #00bcd4; font-weight: bold;",
      );

      console.log(
        `%cSummary: ${summary.total} events (${summary.inserted} inserted, ${summary.updated} updated, ${summary.rejected} rejected, ${summary.duplicates} duplicates)`,
        "color: #888;",
      );

      // Log any anomalies
      const anomalies: string[] = [];
      if (summary.unsorted > 0) {
        anomalies.push(`⚠️ ${summary.unsorted} unsorted series detected`);
      }
      if (summary.duplicateTimestamps > 0) {
        anomalies.push(`⚠️ ${summary.duplicateTimestamps} duplicate timestamps`);
      }
      if (summary.validationErrors > 0) {
        anomalies.push(`⚠️ ${summary.validationErrors} validation errors`);
      }

      if (anomalies.length > 0) {
        console.warn(anomalies.join("\n"));
      }

      // Show recent events (last 10)
      const recent = events.slice(-10);
      console.table(
        recent.map((e) => ({
          Time: new Date(e.rawTimestamp).toLocaleTimeString(),
          Source: e.source,
          Event: e.eventType,
          "Merge Result": e.mergeResult ?? "-",
          "Candle Count": e.candleCount,
          "Dupe Count": e.duplicateCount,
          Sorted: e.isSorted ? "✓" : "✗",
          Error: e.validationError ?? "-",
        })),
      );

      console.groupEnd();
    }

    // Clear buffer
    this.eventBuffer = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private summarizeEvents(events: CandleEvent[]): {
    total: number;
    inserted: number;
    updated: number;
    rejected: number;
    duplicates: number;
    unsorted: number;
    duplicateTimestamps: number;
    validationErrors: number;
  } {
    return {
      total: events.length,
      inserted: events.filter((e) => e.eventType === "inserted").length,
      updated: events.filter((e) => e.eventType === "updated").length,
      rejected: events.filter((e) => e.eventType === "rejected").length,
      duplicates: events.filter((e) => e.eventType === "duplicate").length,
      unsorted: events.filter((e) => !e.isSorted).length,
      duplicateTimestamps: events.reduce((sum, e) => sum + e.duplicateCount, 0),
      validationErrors: events.filter((e) => e.validationError != null).length,
    };
  }

  /**
   * Force immediate flush (useful for debugging or before page unload).
   */
  forceFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

export const candleDiagnostics = new CandleDiagnostics();

/**
 * Helper to check if diagnostics are enabled.
 */
export function isDiagnosticsEnabled(): boolean {
  return ENABLED;
}

/**
 * Log candle series state for manual inspection.
 */
export function inspectCandleSeries(
  symbol: string,
  timeframe: Timeframe,
  candles: Candle[],
  label = "Candle Series",
): void {
  if (!ENABLED) return;

  console.group(
    `%c[Candle Inspect] ${label} - ${symbol} ${timeframe}`,
    "color: #ff9800; font-weight: bold;",
  );

  console.log(`Count: ${candles.length}`);
  console.log(`Sorted: ${isSortedByTime(candles) ? "✓" : "✗"}`);
  console.log(`Duplicates: ${countDuplicateTimestamps(candles)}`);

  if (candles.length > 0) {
    const first = candles[0];
    const last = candles[candles.length - 1];
    console.log(
      `Time range: ${new Date(first.time * 1000).toISOString()} to ${new Date(last.time * 1000).toISOString()}`,
    );

    // Show last 5 candles
    console.table(
      candles.slice(-5).map((c) => ({
        Time: new Date(c.time * 1000).toLocaleTimeString(),
        Open: c.open.toFixed(2),
        High: c.high.toFixed(2),
        Low: c.low.toFixed(2),
        Close: c.close.toFixed(2),
        Volume: c.volume.toFixed(0),
      })),
    );
  }

  console.groupEnd();
}
