import "server-only";

import { log } from "./logger";

export interface BatchItem {
  key: string;
  durationMs: number;
  ok: boolean;
  reason?: string;
}

class QueryAggregator {
  private items: BatchItem[] = [];
  private timer: NodeJS.Timeout | null = null;
  private batchStartTime = 0;

  constructor(
    private readonly category: "ticker" | "klines" | "health",
    private readonly debounceMs = 250,
    private readonly maxWaitMs = 600,
  ) {}

  public record(key: string, durationMs: number, ok: boolean, reason?: string): void {
    // In test environment, skip aggregation logging to prevent asynchronous test leaks
    if (process.env.NODE_ENV === "test") return;

    if (this.items.length === 0) {
      this.batchStartTime = Date.now();
    }
    this.items.push({ key, durationMs, ok, reason });

    if (this.timer) {
      clearTimeout(this.timer);
    }

    const elapsed = Date.now() - this.batchStartTime;
    if (elapsed >= this.maxWaitMs) {
      this.flush();
    } else {
      this.timer = setTimeout(() => this.flush(), this.debounceMs);
      this.timer.unref?.();
    }
  }

  public flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.items.length === 0) return;

    const total = this.items.length;
    const passed = this.items.filter((i) => i.ok).length;
    const failed = total - passed;
    const failedItems = this.items.filter((i) => !i.ok);
    const failedKeys = failedItems.map((i) => i.key);
    const failedDetails = failedItems.map((i) => ({
      key: i.key,
      reason: i.reason || "Request failed or timed out",
    }));
    const totalDuration = Date.now() - this.batchStartTime;
    this.items = [];

    const level = failed > 0 ? "warn" : "info";

    if (this.category === "ticker") {
      log[level]("ticker batch completed", {
        count: total,
        passed,
        failed,
        durationMs: totalDuration,
        failedKeys: failedKeys.length > 0 ? failedKeys : undefined,
        failedDetails: failedDetails.length > 0 ? failedDetails : undefined,
      });
    } else if (this.category === "klines") {
      log[level]("klines batch completed", {
        count: total,
        passed,
        failed,
        durationMs: totalDuration,
        failedKeys: failedKeys.length > 0 ? failedKeys : undefined,
        failedDetails: failedDetails.length > 0 ? failedDetails : undefined,
      });
    } else if (this.category === "health") {
      log[level]("health batch completed", {
        count: total,
        passed,
        failed,
        durationMs: totalDuration,
        failedKeys: failedKeys.length > 0 ? failedKeys : undefined,
        failedDetails: failedDetails.length > 0 ? failedDetails : undefined,
      });
    }
  }
}

export const tickerAggregator = new QueryAggregator("ticker", 250, 600);
export const klinesAggregator = new QueryAggregator("klines", 250, 600);
export const healthAggregator = new QueryAggregator("health", 250, 600);

/**
 * Log individual non-batched HTTP access (e.g. /admin, /api/binance/symbols).
 */
export function logHttpAccess(method: string, path: string, status: number, durationMs: number): void {
  if (process.env.NODE_ENV === "test") return;
  const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
  log[level](`${method} ${path}`, {
    event: "http.access",
    method,
    path,
    status,
    durationMs,
  });
}
