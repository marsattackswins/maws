/**
 * Page Visibility lifecycle for the market-data feed.
 *
 * Chrome aggressively throttles timers in background tabs (setInterval may
 * fire as rarely as once per minute, and long idle stretches batch timer
 * wakeups). The candle feed's 1s kline-health watchdog previously evaluated
 * stale thresholds across those delayed wakeups, so a hidden tab looked like
 * a dead stream: mid-bar REST resyncs + socket recycles raced incoming WS
 * frames and intermittently corrupted the chart (Firefox behaves differently,
 * which is why only Chrome corrupted). Refresh repainted cleanly because the
 * chart rebuilt from clean REST history.
 *
 * Contract enforced here:
 *   - hidden:  the watchdog is DEFERRED (never force a recovery because
 *              timers were delayed); sockets stay connected; candles stay.
 *   - visible: ONE debounced, generation-gated, non-destructive reconcile —
 *              candles are never cleared; a re-check may then resync only if
 *              the data is genuinely stale.
 *   - No additional WebSocket subscription is ever created for a visibility
 *     transition; stream keys are unchanged.
 */

import { candleDiagnostics } from "./candle-diagnostics";

export type VisibilityState = "visible" | "hidden";

type VisibilityListener = (state: VisibilityState) => void;

/** Monotonic ms — immune to wall-clock steps and safe across tab sleeps. */
function monotonicMs(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

/**
 * Event-loop gap considered a hidden-tab/interruption interval rather than
 * evidence of stream failure. Chrome parks background tabs for 60s+ between
 * timer batches; any scheduling hole this large is treated as unknown time,
 * never as confirmed data loss.
 */
export const EVENT_LOOP_GAP_MS = 30_000;

class VisibilityTracker {
  private state: VisibilityState = "visible";
  private lastTransitionAt = monotonicMs();
  private transitions = 0;
  private listeners = new Set<VisibilityListener>();
  private installed = false;
  private onVis: (() => void) | null = null;

  /** Install the document listener once (idempotent; test-safe via reset). */
  install(): void {
    if (this.installed) return;
    if (typeof document === "undefined" || typeof document.addEventListener !== "function") return;
    this.installed = true;
    this.state = document.visibilityState === "hidden" ? "hidden" : "visible";
    this.onVis = () => {
      const next = document.visibilityState === "hidden" ? "hidden" : "visible";
      if (next === this.state) return;
      this.state = next;
      this.lastTransitionAt = monotonicMs();
      this.transitions += 1;
      candleDiagnostics.logVisibilityChange(next, this.transitions);
      for (const fn of [...this.listeners]) {
        try {
          fn(next);
        } catch {
          /* listener isolation: one bad consumer must not break the rest */
        }
      }
    };
    document.addEventListener("visibilitychange", this.onVis);
  }

  uninstall(): void {
    if (this.installed && this.onVis) {
      document.removeEventListener("visibilitychange", this.onVis);
    }
    this.installed = false;
    this.onVis = null;
  }

  /** Test hook: full state reset (document listener included). */
  reset(): void {
    this.uninstall();
    this.state = "visible";
    this.lastTransitionAt = monotonicMs();
    this.transitions = 0;
    this.listeners.clear();
    this.hiddenTotalMs = 0;
    this.hiddenSegmentStart = null;
    this.deferredWatchdogTicks = 0;
    this.reconcilesTriggered = 0;
  }

  getState(): VisibilityState {
    return this.state;
  }

  isHidden(): boolean {
    return this.state === "hidden";
  }

  getLastTransitionAt(): number {
    return this.lastTransitionAt;
  }

  getTransitionCount(): number {
    return this.transitions;
  }

  onChange(fn: VisibilityListener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /**
   * Report a scheduling hole between consecutive watchdog ticks. Returns the
   * deferred ("unknown") interval when the gap indicates the tab was parked
   * (or the event loop was blocked) — time the watchdog must NOT attribute to
   * stream staleness.
   */
  reportTickGap(previousTickAt: number, now: number): number {
    const gap = now - previousTickAt;
    if (gap > EVENT_LOOP_GAP_MS) {
      this.deferredWatchdogTicks += 1;
      return gap;
    }
    return 0;
  }

  // -- hidden-time accounting (diagnostics) ---------------------------------

  private hiddenTotalMs = 0;
  private hiddenSegmentStart: number | null = null;
  private deferredWatchdogTicks = 0;
  private reconcilesTriggered = 0;

  noteHiddenInterval(startMs: number, endMs: number): void {
    if (endMs > startMs) this.hiddenTotalMs += endMs - startMs;
  }

  noteDeferredWatchdogTick(): void {
    this.deferredWatchdogTicks += 1;
  }

  noteReconcile(): void {
    this.reconcilesTriggered += 1;
  }

  getHiddenTotalMs(): number {
    return this.hiddenTotalMs;
  }

  getDeferredWatchdogTicks(): number {
    return this.deferredWatchdogTicks;
  }

  getReconcilesTriggered(): number {
    return this.reconcilesTriggered;
  }

  getDiagnostics(): {
    visibility: VisibilityState;
    transitions: number;
    lastTransitionAt: number;
    hiddenTotalMs: number;
    deferredWatchdogTicks: number;
    reconcilesTriggered: number;
  } {
    return {
      visibility: this.state,
      transitions: this.transitions,
      lastTransitionAt: this.lastTransitionAt,
      hiddenTotalMs: this.hiddenTotalMs,
      deferredWatchdogTicks: this.deferredWatchdogTicks,
      reconcilesTriggered: this.reconcilesTriggered,
    };
  }
}

export const visibilityTracker = new VisibilityTracker();
