import "server-only";

/**
 * Two-layer limiter:
 *  1. Internal rolling budget (MAWS_RATE_INTERNAL_PER_MIN requests/min) that
 *     keeps the operator's manual flow far below exchange limits.
 *  2. Observation of X-MBX-USED-WEIGHT / order-count response headers with a
 *     backoff once the exchange-reported utilization gets high.
 */
export class RateLimiter {
  private window: number[] = [];
  private usedWeight1m: number | null = null;
  private orderCount1m: number | null = null;
  private orderCountLimit1m = 1200;
  private weightLimit1m = 2400;
  private lastObservedAt = 0;

  constructor(private readonly internalPerMin: number) {}

  private prune(now: number): void {
    const cutoff = now - 60_000;
    while (this.window.length > 0 && this.window[0] < cutoff) this.window.shift();
  }

  async acquire(now = Date.now()): Promise<void> {
    for (;;) {
      this.prune(now);
      if (this.window.length < this.internalPerMin) break;
      const waitMs = Math.max(20, this.window[0] + 60_000 - now);
      await sleep(Math.min(waitMs, 60_000));
      now = Date.now();
    }
    // Backpressure when the exchange reports we are near its limits.
    const pressure = this.pressure();
    if (pressure > 0.85) await sleep(250);
    else if (pressure > 0.7) await sleep(75);
    this.window.push(Date.now());
  }

  observe(headers: Record<string, string>): void {
    const weight = headers["x-mbx-used-weight-1m"];
    if (weight != null) {
      const n = Number(weight);
      if (Number.isFinite(n)) this.usedWeight1m = n;
    }
    const orderCount = headers["x-mbx-order-count-1m"];
    if (orderCount != null) {
      const n = Number(orderCount);
      if (Number.isFinite(n)) this.orderCount1m = n;
    }
    const limitInfo = headers["x-mbx-limit-info"];
    if (limitInfo) {
      for (const part of limitInfo.split(";")) {
        const [k, v] = part.split(":").map((s) => s.trim());
        if (k === "orderCountLimit1m" && Number.isFinite(Number(v))) this.orderCountLimit1m = Number(v);
        if (k === "weightLimit1m" && Number.isFinite(Number(v))) this.weightLimit1m = Number(v);
      }
    }
    this.lastObservedAt = Date.now();
  }

  pressure(): number {
    const w = this.usedWeight1m != null ? this.usedWeight1m / this.weightLimit1m : 0;
    const o = this.orderCount1m != null ? this.orderCount1m / this.orderCountLimit1m : 0;
    return Math.max(w, o);
  }

  state(): {
    internalUsed: number;
    internalPerMin: number;
    usedWeight1m: number | null;
    orderCount1m: number | null;
    pressure: number;
    lastObservedAt: number;
  } {
    this.prune(Date.now());
    return {
      internalUsed: this.window.length,
      internalPerMin: this.internalPerMin,
      usedWeight1m: this.usedWeight1m,
      orderCount1m: this.orderCount1m,
      pressure: this.pressure(),
      lastObservedAt: this.lastObservedAt,
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
