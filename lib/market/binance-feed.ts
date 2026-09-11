import { computeAtr, computeRsi, lastDefined } from "@/lib/indicators";
import {
  BINANCE_FAPI_WS,
  BINANCE_FAPI_WS_FALLBACK,
  fromBinanceSymbol,
  toBinanceInterval,
  toBinanceSymbol,
} from "@/lib/market/binance-intervals";
import {
  isNewerTickerEvent,
  miniTickerNumbers,
  parseKlines,
  type BinanceKlineRow,
} from "@/lib/market/feed-normalize";
import {
  reconcileCandleSeries,
  mergeLiveCandle,
  type LiveMergeResult,
} from "@/lib/market/candle-reconcile";
import { candleDiagnostics } from "@/lib/market/candle-diagnostics";
import { visibilityTracker } from "@/lib/market/visibility";
import {
  assertSeriesInvariants,
  assertTailInvariant,
  areCandleAssertsEnabled,
} from "@/lib/market/candle-invariants";
import { getSymbol } from "@/lib/maws/universe";
import type { Candle, Quote, Timeframe } from "@/types";

export type FeedUpdateMeta = { tick?: boolean };

type Listener = (candles: Candle[], quote: Quote, meta?: FeedUpdateMeta) => void;

type KlineWsPayload = {
  e: "kline";
  s: string;
  k: {
    t: number;
    T: number;
    s: string;
    i: string;
    o: string;
    h: string;
    l: string;
    c: string;
    v: string;
    x: boolean;
  };
};

type MiniTicker = {
  e: "24hrMiniTicker";
  /** Provider event time (ms since epoch). */
  E?: number;
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
  st?: number;
};

/** Binance USDT-M `/fapi/v1/ticker/24hr` row (fields we use). */
type Ticker24hr = {
  symbol: string;
  lastPrice?: string;
  openPrice?: string;
  highPrice?: string;
  lowPrice?: string;
  volume?: string;
  priceChange?: string;
  priceChangePercent?: string;
  /** Legacy price-only shape (unused after 24hr switch). */
  price?: string;
};

const ALL_TFS: Timeframe[] = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "1D",
  "1W",
  "1M",
];

/**
 * Monotonic ms clock for kline freshness stamps. Wall-clock Date.now() steps
 * (NTP resyncs — the same events that show "clock degraded" on /status)
 * distort elapsed-time checks: a forward step spuriously trips the 5s
 * delayed / 15s recovery thresholds and forces a mid-bar REST resync + socket
 * recycle; a backward step suppresses them. performance.now() is immune.
 * Stamps are only ever compared against each other (now - stamp), never
 * against epoch time, so the different origin is safe.
 */
function monotonicMs(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function emptyQuote(symbol: string): Quote {
  return {
    symbol,
    last: 0,
    open: 0,
    high: 0,
    low: 0,
    volume: 0,
    change: 0,
    changePct: 0,
    rsi: null,
    atr: null,
  };
}

function appSymbolFromBinance(binanceSym: string): string | null {
  const app = fromBinanceSymbol(binanceSym);
  // Accept any USDT contract even before universe finishes loading.
  if (/^[A-Z0-9]+USDT$/i.test(app)) return app.toUpperCase();
  return null;
}

function cloneCandles(candles: Candle[]): Candle[] {
  return candles.map((c) => ({ ...c }));
}

function historyLimit(tf: Timeframe): number {
  // Intraday: one Binance page (1500). Daily+ keep a lighter history window.
  if (tf === "1D" || tf === "1W" || tf === "1M") return 500;
  return 1500;
}

const BINANCE_KLINE_PAGE = 1500;

/**
 * Kline freshness policy. Frames arrive on every trade of the forming bar, so
 * a subscribed series without a valid live frame is:
 *   - "delayed" after KLINE_DELAYED_MS (warning status, exposed to the UI),
 *   - recovered after KLINE_RECOVERY_MS (REST resync + one coordinated
 *     socket recycle handed to the existing exponential-backoff reconnect).
 */
const KLINE_DELAYED_MS = 5_000;
const KLINE_RECOVERY_MS = 15_000;
/**
 * A recovery stays in flight (blocking further forced recoveries for that
 * series) until a fresh valid frame arrives, or until a reconnect has
 * completed and this long has passed without a frame — then it is released
 * for the next backoff-controlled retry.
 */
const KLINE_RECOVERY_RELEASE_MS = 15_000;
/** Health checker period — well under both thresholds. */
const KLINE_HEALTH_CHECK_MS = 1_000;
/** Debounce for the one-shot visible-return reconciliation (no stampede). */
const VISIBLE_RECONCILE_DEBOUNCE_MS = 500;
/**
 * Consecutive visible-tab stale watchdog passes before a forced socket
 * recycle. A single stale pass only starts a passive (merge-only) REST
 * resync; the socket — and the chart state it feeds — stays untouched until
 * staleness is confirmed across multiple passes.
 */
const WATCHDOG_VISIBLE_FAILS_TO_RECOVER = 2;
/**
 * Visible-return reconciliation threshold: a series whose newest bar is this
 * much older than wall-clock time is genuinely stale (bars closed while the
 * tab was hidden) and gets one merge-only REST resync. Unlike the watchdog
 * stamps (which exclude deferred/unknown time), bar age is wall-clock truth.
 */
const VISIBLE_RECONCILE_STALE_FACTOR = 1.5;

/** Approximate bar interval length in seconds (reconcile staleness only). */
function tfSeconds(tf: Timeframe): number {
  switch (tf) {
    case "1m": return 60;
    case "3m": return 180;
    case "5m": return 300;
    case "15m": return 900;
    case "30m": return 1_800;
    case "1h": return 3_600;
    case "2h": return 7_200;
    case "4h": return 14_400;
    case "1D": return 86_400;
    case "1W": return 604_800;
    case "1M": return 2_592_000;
  }
}

/** Per-subscription kline freshness state. */
type KlineSeriesHealth = {
  /** Time of the last valid live frame, or the subscribe time if none yet. */
  stamp: number;
  /** True once the FIRST valid live frame has arrived (series is/was live). */
  live: boolean;
  /** True while one recovery attempt is in flight for this series. */
  recovering: boolean;
  /** When the current recovery started (meaningful while recovering). */
  recoverySince: number;
  /** klineWsGeneration snapshot when the recovery started. */
  recoveryGeneration: number;
};

/**
 * Binance USDT-M Last Price candles for MAWS.
 * REST once for history; live = direct kline socket only.
 * Quotes only for "hot" symbols (watchlist + open panes + orders/positions).
 */
class BinanceFuturesFeed {
  private series = new Map<string, Candle[]>();
  private listeners = new Map<string, Set<Listener>>();
  private quotes = new Map<string, Quote>();
  private quoteListeners = new Set<(quotes: Map<string, Quote>) => void>();
  /**
   * Immediate (non-debounced) quote listeners for the paper-trading engine.
   * Fired synchronously on every ACCEPTED quote mutation, before the ~150ms
   * UI batching of quoteListeners. UI/chart/watchlist consumers keep using
   * subscribeQuotes and its batching.
   */
  private tradeQuoteListeners = new Set<(quotes: Map<string, Quote>) => void>();
  private loaders = new Map<string, Promise<void>>();
  /** Per-series next-allowed history retry after a failed fetch (backoff). */
  private historyRetryNotBefore = new Map<string, number>();
  /** Consecutive history failures per series (drives retry backoff). */
  private historyRetryAttempt = new Map<string, number>();
  private liveKeys = new Set<string>();
  private historyReady = new Set<string>();
  /** Symbols that should keep live quotes (and cached series while hot). */
  private hotSymbols = new Set<string>();
  private quoteStreamKey = "";
  /** Freshness state per subscribed symbol:tf series. */
  private klineHealth = new Map<string, KlineSeriesHealth>();
  /** Latest accepted miniTicker provider event time (E) per symbol. */
  private lastTickerEventAt = new Map<string, number>();

  /** Combined kline socket (all subscribed symbol/tf streams on one connection). */
  private klineRefs = new Map<string, number>();
  private klineWs: WebSocket | null = null;
  private klineWsGeneration = 0;
  private klineStreamKey = "";
  private klineReconnectAttempt = 0;
  private klineHostIndex = 0;
  private klineSyncTimer: number | null = null;
  private quoteWs: WebSocket | null = null;
  private quoteWsGeneration = 0;
  private quoteReconnectAttempt = 0;
  private started = false;
  private tickerPoll: ReturnType<typeof setInterval> | null = null;
  private klineHealthWatch: ReturnType<typeof setInterval> | null = null;
  private quoteEmitTimer: number | null = null;

  /** Page-visibility awareness (Chrome background-tab timer throttling). */
  private lastWatchdogTickAt = 0;
  private visibleWatchdogFails = 0;
  private visibilityUnsub: (() => void) | null = null;
  private pendingVisibleReconcileTimer: number | null = null;
  /** Dev diagnostics counters (NEXT_PUBLIC_DEBUG_CANDLES). */
  private recoveryCount = 0;
  private passiveResyncCount = 0;
  private reconnectCount = 0;

  private key(symbol: string, tf: Timeframe) {
    return `${symbol}:${tf}`;
  }

  private klineStream(symbol: string, tf: Timeframe) {
    return `${toBinanceSymbol(symbol).toLowerCase()}@kline_${toBinanceInterval(tf)}`;
  }

  private hasLiveChart(symbol: string) {
    return ALL_TFS.some((tf) => this.liveKeys.has(this.key(symbol, tf)));
  }

  private hasChartListeners(symbol: string) {
    return ALL_TFS.some((tf) => (this.listeners.get(this.key(symbol, tf))?.size ?? 0) > 0);
  }

  /**
   * Restrict quote polling / miniTicker streams to these symbols.
   * Cold symbols (not hot, no open chart) drop candle + quote cache.
   */
  setHotSymbols(symbols: Iterable<string>) {
    const next = new Set<string>();
    for (const raw of symbols) {
      const sym = String(raw ?? "")
        .toUpperCase()
        .replace(/\.P$/i, "");
      if (sym) next.add(sym);
    }

    const prev = this.hotSymbols;
    this.hotSymbols = next;

    for (const sym of prev) {
      if (!next.has(sym) && !this.hasChartListeners(sym)) {
        this.forgetSymbol(sym);
      }
    }

    if (this.started) {
      this.syncQuoteStreams();
      void this.refreshHotTickers();
      // Daily history only for newly hot symbols (avoid REST stampede on every pane click).
      for (const sym of next) {
        if (!prev.has(sym)) void this.ensureHistory(sym, "1D");
      }
    }
  }

  getHotSymbols(): string[] {
    return [...this.hotSymbols];
  }

  private forgetSymbol(symbol: string) {
    for (const tf of ALL_TFS) {
      const key = this.key(symbol, tf);
      this.series.delete(key);
      this.historyReady.delete(key);
      this.liveKeys.delete(key);
      this.loaders.delete(key);
      this.listeners.delete(key);
      this.klineHealth.delete(key);
      this.historyRetryNotBefore.delete(key);
      this.historyRetryAttempt.delete(key);
    }
    this.quotes.delete(symbol);
    this.lastTickerEventAt.delete(symbol);
  }

  getCandles(symbol: string, tf: Timeframe): Candle[] {
    const key = this.key(symbol, tf);
    let candles = this.series.get(key);
    if (!candles) {
      candles = [];
      this.series.set(key, candles);
    }
    // Pull history for hot / chart-subscribed symbols (incl. 1D for performance).
    const target = historyLimit(tf);
    const incomplete =
      !this.historyReady.has(key) ||
      candles.length < Math.min(target, target > BINANCE_KLINE_PAGE ? target - 50 : 10);
    if (
      (this.hotSymbols.has(symbol) || this.hasChartListeners(symbol)) &&
      incomplete
    ) {
      void this.ensureHistory(symbol, tf);
    }
    return candles;
  }

  getQuote(symbol: string): Quote {
    const existing = this.quotes.get(symbol);
    if (existing) return existing;
    const q = emptyQuote(symbol);
    if (this.hotSymbols.has(symbol) || this.hasChartListeners(symbol)) {
      this.quotes.set(symbol, q);
    }
    return q;
  }

  getQuotes(): Quote[] {
    return [...this.hotSymbols].map(
      (s) => this.quotes.get(s) ?? emptyQuote(s),
    );
  }

  subscribe(symbol: string, tf: Timeframe, listener: Listener): () => void {
    const key = this.key(symbol, tf);
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key)!.add(listener);
    // Freshness tracking starts at subscribe. The series reports 'connecting'
    // — never 'live' — until the first valid live kline frame arrives.
    if (!this.klineHealth.has(key)) {
      this.klineHealth.set(key, {
        stamp: monotonicMs(),
        live: false,
        recovering: false,
        recoverySince: 0,
        recoveryGeneration: 0,
      });
    }

    const stream = this.klineStream(symbol, tf);
    this.acquireKlineSocket(stream);

    const cached = this.series.get(key);

    void this.ensureHistory(symbol, tf, false).then(() => {
      if (!this.listeners.get(key)?.has(listener)) return;
      const candles = this.series.get(key) ?? [];
      if (candles.length === 0) return;
      listener(cloneCandles(candles), this.getQuote(symbol), { tick: false });
    });

    if (cached && cached.length > 0) {
      listener(cloneCandles(cached), this.getQuote(symbol), { tick: false });
    }

    // Chart open → quote stream can drop this symbol (kline owns last).
    this.syncQuoteStreams();

    return () => {
      this.listeners.get(key)?.delete(listener);
      if ((this.listeners.get(key)?.size ?? 0) === 0) {
        this.listeners.delete(key);
        this.liveKeys.delete(key);
        this.klineHealth.delete(key);
      }
      this.releaseKlineSocket(stream);
      this.syncQuoteStreams();
      if (!this.hotSymbols.has(symbol) && !this.hasChartListeners(symbol)) {
        this.forgetSymbol(symbol);
        this.emitQuotesNow();
      }
    };
  }

  subscribeQuotes(listener: (quotes: Map<string, Quote>) => void): () => void {
    this.quoteListeners.add(listener);
    listener(this.quotes);
    return () => {
      this.quoteListeners.delete(listener);
    };
  }

  /**
   * Immediate quote channel for the paper-trading engine. Unlike
   * subscribeQuotes (batched ~150ms for UI/render performance), these
   * listeners run synchronously on every ACCEPTED quote mutation, so a TP/SL
   * breach that reverses inside the UI batch window is still evaluated.
   */
  subscribeTradeQuotes(listener: (quotes: Map<string, Quote>) => void): () => void {
    this.tradeQuoteListeners.add(listener);
    listener(this.quotes);
    return () => {
      this.tradeQuoteListeners.delete(listener);
    };
  }

  /** Synchronous engine evaluation of the current quote state. */
  private emitTradeQuotes() {
    if (this.tradeQuoteListeners.size === 0) return;
    this.tradeQuoteListeners.forEach((fn) => fn(this.quotes));
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.lastWatchdogTickAt = monotonicMs();
    this.visibleWatchdogFails = 0;
    visibilityTracker.install();
    this.visibilityUnsub = visibilityTracker.onChange((state) => this.onVisibilityChange(state));
    if (this.pendingVisibleReconcileTimer != null) {
      window.clearTimeout(this.pendingVisibleReconcileTimer);
      this.pendingVisibleReconcileTimer = null;
    }
    void this.refreshHotTickers();
    this.syncQuoteStreams();
    for (const sym of this.hotSymbols) {
      void this.ensureHistory(sym, "1D");
    }
    this.tickerPoll = setInterval(() => {
      if (this.started) void this.refreshHotTickers();
    }, 15_000);
    this.klineHealthWatch = setInterval(() => {
      if (this.started) this.checkKlineHealth();
    }, KLINE_HEALTH_CHECK_MS);
    this.syncKlineStreams();
  }

  /**
   * Page Visibility transitions. Hidden: defer the stale-watchdog entirely —
   * no mark-stale, no socket recycle, no REST resync, no candle clears just
   * because Chrome delayed the timers. Visible: schedule ONE debounced,
   * generation-gated, non-destructive reconcile. Never opens a second socket.
   */
  private onVisibilityChange(state: "visible" | "hidden") {
    if (!this.started) return;
    if (state === "hidden") {
      if (this.pendingVisibleReconcileTimer != null) {
        window.clearTimeout(this.pendingVisibleReconcileTimer);
        this.pendingVisibleReconcileTimer = null;
      }
      candleDiagnostics.logLifecycleDecision("visibility_hidden_watchdog_deferred", {
        socketsKept: true,
        klineStreams: this.klineRefs.size,
      });
      return;
    }
    // Visible again. Snapshot the socket generation now: if a symbol/stream
    // swap happens during the debounce window, the scheduled reconcile is
    // stale and must not act on a series the chart no longer shows.
    const generationAtVisibility = this.klineWsGeneration;
    if (this.pendingVisibleReconcileTimer != null) return;
    this.pendingVisibleReconcileTimer = window.setTimeout(() => {
      this.pendingVisibleReconcileTimer = null;
      if (generationAtVisibility !== this.klineWsGeneration) {
        candleDiagnostics.logLifecycleDecision("visible_reconcile_skipped_stale_generation", {
          scheduledGeneration: generationAtVisibility,
          currentGeneration: this.klineWsGeneration,
        });
        return;
      }
      this.reconcileAfterVisible();
    }, VISIBLE_RECONCILE_DEBOUNCE_MS);
    candleDiagnostics.logLifecycleDecision("visibility_visible_reconcile_scheduled", {
      generation: generationAtVisibility,
    });
  }

  /**
   * One non-destructive reconciliation after returning to visible: merge-only
   * REST resync for series whose newest bar is genuinely old (bars closed
   * while hidden). Candles are never cleared; the socket is never recycled;
   * no new subscription is created.
   */
  private reconcileAfterVisible() {
    if (!this.started || visibilityTracker.isHidden()) return;
    const now = monotonicMs();
    this.lastWatchdogTickAt = now;
    this.visibleWatchdogFails = 0;
    visibilityTracker.noteReconcile();

    const nowSec = Date.now() / 1000;
    let resynced = 0;
    for (const key of this.listeners.keys()) {
      if ((this.listeners.get(key)?.size ?? 0) === 0) continue;
      const h = this.klineHealth.get(key);
      if (!h?.live) continue; // connecting series: history fetch already in flight
      const sep = key.indexOf(":");
      if (sep <= 0) continue;
      const symbol = key.slice(0, sep);
      const tf = key.slice(sep + 1) as Timeframe;
      const tip = this.series.get(key)?.at(-1);
      const tfSec = tfSeconds(tf);
      const stale = tip != null && tfSec != null && nowSec - tip.time >= VISIBLE_RECONCILE_STALE_FACTOR * tfSec;
      candleDiagnostics.logLifecycleDecision("visible_reconcile_series", {
        key,
        stale,
        tipAgeSec: tip ? Math.round(nowSec - tip.time) : null,
        generation: this.klineWsGeneration,
      });
      if (stale) {
        resynced += 1;
        this.passiveResyncCount += 1;
        void this.ensureHistory(symbol, tf, true);
      }
    }
    candleDiagnostics.logLifecycleDecision("visibility_visible_reconcile", {
      resynced,
      generation: this.klineWsGeneration,
      socketState: this.klineWs ? String(this.klineWs.readyState) : "none",
    });
  }

  /** Dev diagnostics (NEXT_PUBLIC_DEBUG_CANDLES=true consumers). */
  getFeedDiagnostics() {
    return {
      started: this.started,
      visibility: visibilityTracker.getDiagnostics(),
      klineGeneration: this.klineWsGeneration,
      quoteGeneration: this.quoteWsGeneration,
      klineSocketState: this.klineWs ? this.klineWs.readyState : -1,
      quoteSocketState: this.quoteWs ? this.quoteWs.readyState : -1,
      klineStreamCount: this.klineRefs.size,
      chartListenerKeys: this.listeners.size,
      chartListenerCount: [...this.listeners.values()].reduce((n, s) => n + s.size, 0),
      quoteListenerCount: this.quoteListeners.size + this.tradeQuoteListeners.size,
      visibleWatchdogFails: this.visibleWatchdogFails,
      reconnectAttempt: this.klineReconnectAttempt,
      recoveryCount: this.recoveryCount,
      passiveResyncCount: this.passiveResyncCount,
      reconnectCount: this.reconnectCount,
    };
  }

  /** Re-pull REST tickers for the current hot set. */
  refreshQuotes() {
    if (!this.started) return;
    void this.refreshHotTickers();
  }

  /**
   * Freshness status for a charted series:
   *   - "idle":       not subscribed
   *   - "connecting": subscribed, still waiting for the FIRST valid live frame
   *   - "live":       a valid live frame arrived within KLINE_DELAYED_MS
   *   - "delayed":    no valid live frame for >= KLINE_DELAYED_MS
   * Subscribing alone never makes a series "live". Delayed/recovery state
   * clears ONLY when a fresh valid frame arrives (applyKline).
   */
  getKlineStatus(symbol: string, tf: Timeframe): "idle" | "connecting" | "live" | "delayed" {
    const key = this.key(symbol, tf);
    if ((this.listeners.get(key)?.size ?? 0) === 0) return "idle";
    const h = this.klineHealth.get(key);
    if (!h) return "connecting";
    if (monotonicMs() - h.stamp >= KLINE_DELAYED_MS) return "delayed";
    return h.live ? "live" : "connecting";
  }

  isKlineDelayed(symbol: string, tf: Timeframe): boolean {
    return this.getKlineStatus(symbol, tf) === "delayed";
  }

  /** True while a stale-recovery attempt is in flight for this series. */
  isKlineRecovering(symbol: string, tf: Timeframe): boolean {
    const key = this.key(symbol, tf);
    if ((this.listeners.get(key)?.size ?? 0) === 0) return false;
    return this.klineHealth.get(key)?.recovering === true;
  }

  /**
   * Health checker (every KLINE_HEALTH_CHECK_MS). Browser scheduling-aware:
   *
   *  - Event-loop gaps (hidden-tab timer throttling, long tasks) are treated
   *    as deferred/unknown time and attributed to freshness stamps — never as
   *    confirmed stream failure.
   *  - While the tab is hidden the checker only releases finished recoveries;
   *    it never marks a series stale, REST-resyncs, or recycles the socket.
   *  - On a visible tab, the FIRST stale pass starts a passive merge-only
   *    REST resync (socket untouched); a forced recovery (resync + ONE socket
   *    recycle handed to the exponential-backoff reconnect) requires
   *    WATCHDOG_VISIBLE_FAILS_TO_RECOVER consecutive visible stale passes.
   *    Chart state is preserved throughout — merges are append/upsert only.
   */
  private checkKlineHealth() {
    const now = monotonicMs();

    // Event-loop gap / hidden-tab scheduling: time the watchdog cannot see.
    const deferredGap = visibilityTracker.reportTickGap(this.lastWatchdogTickAt, now);
    if (deferredGap > 0) {
      this.shiftAllHealthStamps(deferredGap);
    }
    this.lastWatchdogTickAt = now;

    // Hidden: defer staleness evaluation entirely (Chrome background-tab
    // throttling would otherwise read as dead stream + forced recovery).
    if (visibilityTracker.isHidden()) {
      this.releaseFinishedRecoveries(now);
      candleDiagnostics.logLifecycleDecision("watchdog_deferred_hidden", {
        generation: this.klineWsGeneration,
      });
      return;
    }

    let passiveResync = false;
    let forcedRecovery = false;
    for (const key of this.listeners.keys()) {
      if ((this.listeners.get(key)?.size ?? 0) === 0) continue;
      const h = this.klineHealth.get(key);
      if (!h) continue;
      if (now - h.stamp < KLINE_RECOVERY_MS) continue;

      if (h.recovering) {
        this.maybeReleaseRecovery(h, now);
        continue;
      }

      // Visible + stale. Escalate: passive merge-only resync first; forced
      // recovery only after consecutive visible stale passes.
      this.visibleWatchdogFails += 1;
      const sep = key.indexOf(":");
      if (this.visibleWatchdogFails < WATCHDOG_VISIBLE_FAILS_TO_RECOVER) {
        passiveResync = true;
        this.passiveResyncCount += 1;
        if (sep > 0) {
          void this.ensureHistory(key.slice(0, sep), key.slice(sep + 1) as Timeframe, true);
        }
        continue;
      }

      h.recovering = true;
      h.recoverySince = now;
      h.recoveryGeneration = this.klineWsGeneration;
      if (sep > 0) {
        void this.ensureHistory(key.slice(0, sep), key.slice(sep + 1) as Timeframe, true);
      }
      forcedRecovery = true;
    }
    candleDiagnostics.logLifecycleDecision("watchdog_pass", {
      passiveResync,
      forcedRecovery,
      fails: this.visibleWatchdogFails,
      generation: this.klineWsGeneration,
    });
    // At most ONE socket recycle per checker pass, no matter how many series
    // turned stale together.
    if (forcedRecovery) this.recycleKlineSocketForRecovery();
  }

  /**
   * Attribute a scheduling hole to every series' freshness stamp so parked-
   * tab / blocked-loop time is never read as stream staleness. Also extends
   * in-flight recovery ages so a recovery is not released by time it could
   * not have observed.
   */
  private shiftAllHealthStamps(byMs: number) {
    for (const h of this.klineHealth.values()) {
      h.stamp += byMs;
      h.recoverySince += byMs;
    }
  }

  private releaseFinishedRecoveries(now: number) {
    for (const h of this.klineHealth.values()) {
      if (h.recovering) this.maybeReleaseRecovery(h, now);
    }
  }

  private maybeReleaseRecovery(h: KlineSeriesHealth, now: number) {
    const reconnected = this.klineWsGeneration !== h.recoveryGeneration;
    if (reconnected && now - h.recoverySince >= KLINE_RECOVERY_RELEASE_MS) {
      h.recovering = false; // released for the next backoff-controlled retry
    }
  }

  /**
   * Recycle the combined kline socket for a stale recovery while preserving
   * the existing exponential backoff: handlers are detached and the socket's
   * own onclose logic is driven exactly once, so the reconnect delay, attempt
   * counter and host failover behave exactly like an ordinary drop. When no
   * socket is live, the backoff chain already owns the retry — nothing to do.
   */
  private recycleKlineSocketForRecovery() {
    const ws = this.klineWs;
    if (!ws) return;
    const onclose = ws.onclose;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onclose = null;
    ws.onerror = null;
    this.klineWs = null;
    this.recoveryCount += 1;
    candleDiagnostics.logLifecycleDecision("recovery_socket_recycle", {
      generation: this.klineWsGeneration,
    });
    try {
      ws.close();
    } catch {
      /* ignore */
    }
    if (typeof onclose === "function") (onclose as () => void)();
  }

  stop() {
    this.started = false;
    this.quoteWsGeneration += 1;
    this.quoteStreamKey = "";
    if (this.visibilityUnsub) {
      this.visibilityUnsub();
      this.visibilityUnsub = null;
    }
    if (this.pendingVisibleReconcileTimer != null) {
      window.clearTimeout(this.pendingVisibleReconcileTimer);
      this.pendingVisibleReconcileTimer = null;
    }
    if (this.tickerPoll) {
      clearInterval(this.tickerPoll);
      this.tickerPoll = null;
    }
    if (this.klineHealthWatch) {
      clearInterval(this.klineHealthWatch);
      this.klineHealthWatch = null;
    }
    if (this.quoteEmitTimer != null) {
      window.clearTimeout(this.quoteEmitTimer);
      this.quoteEmitTimer = null;
    }
    if (this.klineSyncTimer != null) {
      window.clearTimeout(this.klineSyncTimer);
      this.klineSyncTimer = null;
    }
    this.closeQuoteWs();
    this.klineWsGeneration += 1;
    this.klineStreamKey = "";
    this.closeKlineWs();
  }

  private closeSocket(ws: WebSocket | null) {
    if (!ws) return;
    ws.onclose = null;
    ws.onerror = null;
    ws.onmessage = null;
    ws.onopen = null;
    try {
      ws.close();
    } catch {
      /* ignore */
    }
  }

  private closeQuoteWs() {
    const old = this.quoteWs;
    this.quoteWs = null;
    this.closeSocket(old);
  }

  private setLastPrice(symbol: string, last: number, partial?: Partial<Quote>) {
    if (!Number.isFinite(last) || last <= 0) return false;
    if (!this.hotSymbols.has(symbol) && !this.hasChartListeners(symbol)) return false;
    const prev = this.quotes.get(symbol) ?? emptyQuote(symbol);
    const open =
      partial?.open && partial.open > 0
        ? partial.open
        : prev.open > 0
          ? prev.open
          : 0;
    const priceChanged = !(prev.last > 0 && Math.abs(prev.last - last) / last < 1e-12);
    const openChanged = open > 0 && Math.abs((prev.open || 0) - open) > 1e-12;
    if (!priceChanged && !openChanged && !partial?.high && !partial?.low && partial?.volume == null) {
      return false;
    }
    const change = open > 0 ? last - open : 0;
    this.quotes.set(symbol, {
      ...prev,
      ...partial,
      symbol,
      last,
      open,
      high:
        partial?.high && partial.high > 0
          ? Math.max(prev.high || last, partial.high, last)
          : Math.max(prev.high || last, last),
      low:
        partial?.low && partial.low > 0
          ? Math.min(prev.low || last, partial.low, last)
          : prev.low > 0
            ? Math.min(prev.low, last)
            : last,
      change,
      changePct: open > 0 ? (change / open) * 100 : 0,
    });
    this.emitTradeQuotes();
    return true;
  }

  /** Apply Binance 24h stats. When `updateLast` is false, keep chart-owned last price. */
  private apply24hTicker(
    symbol: string,
    ticker: Ticker24hr,
    opts?: { updateLast?: boolean },
  ): boolean {
    const updateLast = opts?.updateLast !== false;
    const lastPx = Number(ticker.lastPrice ?? ticker.price);
    const openPx = Number(ticker.openPrice);
    const highPx = Number(ticker.highPrice);
    const lowPx = Number(ticker.lowPrice);
    const vol = Number(ticker.volume);
    const prev = this.quotes.get(symbol) ?? emptyQuote(symbol);
    const last =
      updateLast && Number.isFinite(lastPx) && lastPx > 0
        ? lastPx
        : prev.last > 0
          ? prev.last
          : Number.isFinite(lastPx) && lastPx > 0
            ? lastPx
            : 0;
    if (last <= 0) return false;
    const open = Number.isFinite(openPx) && openPx > 0 ? openPx : prev.open;
    return this.setLastPrice(symbol, last, {
      open: open > 0 ? open : undefined,
      high: Number.isFinite(highPx) && highPx > 0 ? highPx : undefined,
      low: Number.isFinite(lowPx) && lowPx > 0 ? lowPx : undefined,
      volume: Number.isFinite(vol) && vol > 0 ? vol : undefined,
    });
  }

  private async refreshHotTickers() {
    const symbols = [...this.hotSymbols];
    if (symbols.length === 0) return;

    let any = false;
    const fetchOne = async (symbol: string) => {
      try {
        const binanceSym = toBinanceSymbol(symbol);
        const res = await fetch(
          `/api/binance/ticker?symbol=${encodeURIComponent(binanceSym)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const row = (await res.json()) as Ticker24hr | Ticker24hr[];
        const ticker = Array.isArray(row) ? row[0] : row;
        if (!ticker) return;
        // Live chart owns last price; still refresh 24h open for Binance-matching %.
        if (
          this.apply24hTicker(symbol, ticker, {
            updateLast: !this.hasLiveChart(symbol),
          })
        ) {
          any = true;
        }
      } catch {
        /* ignore */
      }
    };

    // Bound concurrency for larger watchlists.
    const queue = [...symbols];
    const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
      while (queue.length) {
        const sym = queue.shift();
        if (sym) await fetchOne(sym);
      }
    });
    await Promise.all(workers);
    if (any) this.emitQuotesNow();
  }

  /**
   * REST history under live tip — merges REST historical data with socket-owned tip.
   * Uses timestamp-based reconciliation to prevent duplicates and maintain consistency.
   */
  private mergeRestHistory(key: string, rest: Candle[]): Candle[] {
    const live = this.series.get(key);
    // If no live data or not actively live, just use REST
    if (!live || live.length === 0 || !this.liveKeys.has(key) || rest.length === 0) {
      return rest;
    }

    // Use canonical timestamp-based reconciliation
    // This handles all edge cases: newer REST, matching timestamps, live tip ahead, etc.
    const target = historyLimit(key.split(":")[1] as Timeframe);
    const result = reconcileCandleSeries(rest, live, target);

    // Dev-only: crash at the offending merge instead of rendering corruption.
    assertSeriesInvariants(result, { op: "mergeRestHistory", label: key });

    // Diagnostics
    const [symbol, tf] = key.split(":");
    candleDiagnostics.logReconciliation(
      symbol,
      tf as Timeframe,
      rest.length,
      live.length,
      result.length,
      result,
    );

    return result;
  }

  /**
   * Fetch up to `totalLimit` klines. Binance caps each call at 1500, so we walk
   * `endTime` backward. `onPage` fires after each page (newest first) so the chart
   * can paint quickly, then deepen history in the background.
   */
  private async fetchKlinePages(
    binanceSym: string,
    interval: string,
    totalLimit: number,
    onPage?: (candles: Candle[]) => void,
  ): Promise<Candle[]> {
    let endTimeMs: number | undefined;
    let merged: Candle[] = [];
    let guard = 0;
    const maxPages = Math.max(1, Math.ceil(totalLimit / BINANCE_KLINE_PAGE) + 1);

    while (merged.length < totalLimit && guard < maxPages) {
      guard += 1;
      const limit = Math.min(BINANCE_KLINE_PAGE, totalLimit - merged.length);
      const qs = new URLSearchParams({
        symbol: binanceSym,
        interval,
        limit: String(limit),
      });
      if (endTimeMs != null) qs.set("endTime", String(endTimeMs));

      const res = await fetch(`/api/binance/klines?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) break;
      const rows = (await res.json()) as BinanceKlineRow[];
      if (!Array.isArray(rows) || rows.length === 0) break;
      const parsed = parseKlines(rows);
      if (parsed.length === 0) break;

      if (merged.length === 0) {
        merged = parsed;
      } else {
        const older = parsed.filter((c) => c.time < merged[0].time);
        if (older.length === 0) break;
        merged = [...older, ...merged];
      }

      onPage?.(merged);

      if (parsed.length < limit) break;
      endTimeMs = parsed[0].time * 1000 - 1;
    }

    if (merged.length > totalLimit) {
      merged = merged.slice(merged.length - totalLimit);
    }
    return merged;
  }

  private async ensureHistory(symbol: string, tf: Timeframe, force = false) {
    const key = this.key(symbol, tf);
    const target = historyLimit(tf);

    if (!force) {
      const existing = this.loaders.get(key);
      if (existing) return existing;
      const cached = this.series.get(key);
      // Skip only with a full (or near-full) window — not after the first 1500 page.
      if (
        cached &&
        cached.length >= Math.min(target, target > BINANCE_KLINE_PAGE ? target - 50 : 10)
      ) {
        this.historyReady.add(key);
        return;
      }
      // Failed-fetch backoff: never re-enter the fetch while cooling down.
      // Without this, a failed history fetch re-fires on every getCandles()
      // call (renders, crosshair moves, overlays) — a hot REST retry loop.
      const notBefore = this.historyRetryNotBefore.get(key);
      if (notBefore != null && Date.now() < notBefore) return;
    } else {
      this.loaders.delete(key);
      this.historyReady.delete(key);
    }

    const task = Promise.resolve().then(async () => {
      try {
        const binanceSym = toBinanceSymbol(symbol);
        const interval = toBinanceInterval(tf);
        let paintedFirst = false;

        const apply = (parsed: Candle[]) => {
          if (!this.hotSymbols.has(symbol) && !this.hasChartListeners(symbol)) return false;
          let candles = this.mergeRestHistory(key, parsed);
          if (candles.length > target) candles = candles.slice(candles.length - target);
          assertSeriesInvariants(candles, { op: "ensureHistory.apply", label: key });
          this.series.set(key, candles);
          this.refreshQuoteFromCandles(symbol, candles);
          this.emitSeries(symbol, tf, false);
          this.emitQuotesNow();
          return true;
        };

        const final = await this.fetchKlinePages(binanceSym, interval, target, (partial) => {
          // First page only — paint fast; skip mid-backfill redraws (those felt laggy).
          if (paintedFirst) return;
          if (!apply(partial)) return;
          paintedFirst = true;
        });

        if (final.length === 0) {
          // Fetch produced nothing (network failure, 429/503, upstream error).
          // Arm exponential backoff so getCandles() does not hot-retry.
          const attempt = (this.historyRetryAttempt.get(key) ?? 0) + 1;
          this.historyRetryAttempt.set(key, attempt);
          this.historyRetryNotBefore.set(
            key,
            Date.now() + Math.min(30_000, 500 * 2 ** Math.min(6, attempt)),
          );
          return;
        }
        if (!apply(final)) return;
        this.historyRetryAttempt.delete(key);
        this.historyRetryNotBefore.delete(key);
        this.historyReady.add(key);
      } catch {
        // Thrown fetch (network exception): same backoff path.
        const attempt = (this.historyRetryAttempt.get(key) ?? 0) + 1;
        this.historyRetryAttempt.set(key, attempt);
        this.historyRetryNotBefore.set(
          key,
          Date.now() + Math.min(30_000, 500 * 2 ** Math.min(6, attempt)),
        );
      } finally {
        if (this.loaders.get(key) === task) this.loaders.delete(key);
      }
    });

    this.loaders.set(key, task);
    return task;
  }

  private refreshQuoteFromCandles(symbol: string, candles: Candle[], tipOnly = false) {
    if (candles.length === 0) return;
    const last = candles[candles.length - 1];
    const prev = this.quotes.get(symbol) ?? emptyQuote(symbol);
    // Tip ticks: update price only. RSI/ATR are O(n) and not needed every ms.
    const rsi = tipOnly ? prev.rsi : lastDefined(computeRsi(candles));
    const atr = tipOnly ? prev.atr : lastDefined(computeAtr(candles));
    const lastPx = last.close;
    // 24h open comes from miniTicker / ticker/24hr — never use the chart bar open
    // (that made % look like the current candle move instead of Binance 24h Chg).
    const open = prev.open > 0 ? prev.open : 0;
    const change = open > 0 ? lastPx - open : 0;
    this.quotes.set(symbol, {
      ...prev,
      symbol,
      last: lastPx,
      open,
      high: Math.max(prev.high || lastPx, last.high),
      low: prev.low > 0 ? Math.min(prev.low, last.low) : last.low,
      volume: last.volume,
      change,
      changePct: open > 0 ? (change / open) * 100 : prev.changePct,
      rsi,
      atr,
    });
    this.emitTradeQuotes();
    void getSymbol(symbol);
  }

  private applyMiniTicker(t: MiniTicker) {
    const appSymbol = appSymbolFromBinance(t.s);
    if (!appSymbol) return;
    if (!this.hotSymbols.has(appSymbol)) return;

    // Provider event-time ordering: drop strictly-older redeliveries. Equal
    // timestamps are accepted (last arrival wins) — see isNewerTickerEvent.
    if (!isNewerTickerEvent(this.lastTickerEventAt.get(appSymbol), t.E)) return;

    const nums = miniTickerNumbers(t);
    if (!nums) return;
    const last = nums.last;
    const open = nums.open;
    const high = nums.high;
    const low = nums.low;
    const vol = nums.volume;

    // Live chart owns last; still take Binance 24h open so change% matches Futures UI.
    if (this.hasLiveChart(appSymbol)) {
      const prev = this.quotes.get(appSymbol) ?? emptyQuote(appSymbol);
      if (!(Number.isFinite(open) && open > 0) || prev.last <= 0) return;
      const change = prev.last - open;
      const nextHigh =
        Number.isFinite(high) && high > 0
          ? Math.max(prev.high || prev.last, high, prev.last)
          : Math.max(prev.high || prev.last, prev.last);
      const nextLow =
        Number.isFinite(low) && low > 0
          ? Math.min(prev.low || prev.last, low, prev.last)
          : prev.low > 0
            ? Math.min(prev.low, prev.last)
            : prev.last;
      const next: Quote = {
        ...prev,
        open,
        high: nextHigh,
        low: nextLow,
        volume: Number.isFinite(vol) && vol > 0 ? vol : prev.volume,
        change,
        changePct: (change / open) * 100,
      };
      const same =
        Math.abs(prev.open - open) < 1e-12 &&
        Math.abs(prev.changePct - next.changePct) < 1e-6 &&
        prev.high === next.high &&
        prev.low === next.low;
      if (same) return;
      this.quotes.set(appSymbol, next);
      this.advanceTickerWatermark(appSymbol, t.E);
      this.emitTradeQuotes();
      this.emitQuotesSoon();
      return;
    }

    if (!Number.isFinite(last) || last <= 0) return;
    if (
      !this.setLastPrice(appSymbol, last, {
        open: Number.isFinite(open) && open > 0 ? open : undefined,
        high: Number.isFinite(high) && high > 0 ? high : undefined,
        low: Number.isFinite(low) && low > 0 ? low : undefined,
        volume: Number.isFinite(vol) && vol > 0 ? vol : undefined,
      })
    ) {
      return;
    }
    // Applied — advance the ordering watermark (setLastPrice already fired
    // the immediate trade channel).
    this.advanceTickerWatermark(appSymbol, t.E);
    this.emitQuotesSoon();
  }

  /** Record the provider event time of an ACCEPTED miniTicker frame. */
  private advanceTickerWatermark(symbol: string, eventTime: number | undefined) {
    if (eventTime == null || !Number.isFinite(eventTime)) return;
    this.lastTickerEventAt.set(symbol, eventTime);
  }

  /** Upsert one Binance kline bar — exact o/h/l/c/v, never rewrite. */
  private applyKline(msg: KlineWsPayload) {
    // Validation 1: Symbol must be recognized
    const appSymbol = appSymbolFromBinance(msg.s);
    if (!appSymbol) return;

    // Validation 2: Interval must match a known timeframe
    const interval = msg.k.i;
    const tfs = ALL_TFS.filter((tf) => toBinanceInterval(tf) === interval);
    if (tfs.length === 0) return;

    const candle: Candle = {
      time: Math.floor(msg.k.t / 1000),
      open: Number(msg.k.o),
      high: Number(msg.k.h),
      low: Number(msg.k.l),
      close: Number(msg.k.c),
      volume: Number(msg.k.v),
    };

    // Validation 3: OHLCV must be valid
    if (
      !Number.isFinite(candle.time) ||
      !Number.isFinite(candle.open) ||
      !Number.isFinite(candle.high) ||
      !Number.isFinite(candle.low) ||
      !Number.isFinite(candle.close) ||
      !Number.isFinite(candle.volume) ||
      candle.open <= 0 ||
      candle.close <= 0 ||
      candle.high < Math.max(candle.open, candle.close, candle.low) ||
      candle.low > Math.min(candle.open, candle.close, candle.high) ||
      candle.volume < 0
    ) {
      return;
    }

    // Validation 4: Only process for subscribed symbol/timeframe pairs
    for (const tf of tfs) {
      const key = this.key(appSymbol, tf);
      if ((this.listeners.get(key)?.size ?? 0) === 0) continue;
      this.liveKeys.add(key);
      // Valid live frame: establishes 'live', refreshes the stamp, and is the
      // ONLY thing that clears delayed/recovery state.
      const health = this.klineHealth.get(key);
      if (health) {
        health.stamp = monotonicMs();
        health.live = true;
        health.recovering = false;
      }

      let candles = this.series.get(key);
      if (!candles) {
        candles = [];
        this.series.set(key, candles);
      }

      const merged = mergeLiveCandle(candles, candle, msg.k.x, historyLimit(tf));
      if (merged === "invalid" || merged === "duplicate") {
        // Diagnostics for rejected/duplicate candles
        if (merged === "invalid") {
          candleDiagnostics.logValidationError(
            appSymbol,
            tf,
            "WebSocket",
            "invalid OHLCV",
            msg.k.t,
          );
        }
        continue;
      }

      // Dev-only tail check: catches an unsorted/duplicate series at the exact
      // frame that produced it (hot path — O(1)).
      assertTailInvariant(candles, {
        op: `applyKline(${merged})`,
        label: key,
        incoming: candle,
      });

      // Diagnostics for successful updates
      candleDiagnostics.logWebSocketUpdate(
        appSymbol,
        tf,
        msg.k.t,
        candle.time,
        merged,
        candles.length,
        candles,
      );

      const tipOnly = merged === "tip";

      this.refreshQuoteFromCandles(appSymbol, candles, tipOnly);
      this.emitSeries(appSymbol, tf, tipOnly);
    }
    this.emitQuotesSoon();
  }

  private emitSeries(symbol: string, tf: Timeframe, tick: boolean) {
    const key = this.key(symbol, tf);
    const candles = this.series.get(key);
    if (!candles || candles.length === 0) return;
    const quote = this.getQuote(symbol);
    const listeners = this.listeners.get(key);
    if (!listeners || listeners.size === 0) return;
    // Tip ticks share the live series (listeners must not mutate). Full
    // history / new-bar events still clone so consumers can keep a snapshot.
    const snapshot = tick ? candles : cloneCandles(candles);
    // Isolate listeners: one throwing consumer (e.g. an overlay painting
    // mid-swap) must not starve later listeners — including the chart's own
    // onFeed — leaving the chart rendering stale data while the store moves on.
    for (const fn of [...listeners]) {
      try {
        fn(snapshot, quote, { tick });
      } catch (err) {
        if (areCandleAssertsEnabled()) {
          // Dev builds surface this loudly; prod keeps the feed alive.
          console.error(`[feed] listener for ${key} threw`, err);
        }
      }
    }
  }

  private emitQuotesNow() {
    if (this.quoteEmitTimer != null) {
      window.clearTimeout(this.quoteEmitTimer);
      this.quoteEmitTimer = null;
    }
    this.quoteListeners.forEach((fn) => fn(this.quotes));
  }

  private emitQuotesSoon() {
    if (this.quoteEmitTimer != null) return;
    this.quoteEmitTimer = window.setTimeout(() => {
      this.quoteEmitTimer = null;
      this.quoteListeners.forEach((fn) => fn(this.quotes));
    }, 150);
  }

  private acquireKlineSocket(stream: string) {
    this.klineRefs.set(stream, (this.klineRefs.get(stream) ?? 0) + 1);
    this.scheduleKlineStreamSync();
  }

  private releaseKlineSocket(stream: string) {
    const next = (this.klineRefs.get(stream) ?? 0) - 1;
    if (next <= 0) this.klineRefs.delete(stream);
    else this.klineRefs.set(stream, next);
    this.scheduleKlineStreamSync();
  }

  private scheduleKlineStreamSync() {
    if (this.klineSyncTimer != null) return;
    this.klineSyncTimer = window.setTimeout(() => {
      this.klineSyncTimer = null;
      this.syncKlineStreams();
    }, 16);
  }

  private closeKlineWs() {
    const old = this.klineWs;
    this.klineWs = null;
    this.closeSocket(old);
  }

  private klineWsUrl(streams: string[], hostIndex: number) {
    // Binance routes klines on the /market tier. Plain /ws often stays silent.
    const host = hostIndex === 0 ? BINANCE_FAPI_WS : BINANCE_FAPI_WS_FALLBACK;
    if (streams.length <= 1) {
      return `${host}/market/ws/${streams[0] ?? ""}`;
    }
    return `${host}/market/stream?streams=${streams.join("/")}`;
  }

  private syncKlineStreams() {
    if (!this.started) {
      this.closeKlineWs();
      return;
    }
    const streams = [...this.klineRefs.keys()].sort();
    const key = streams.join("/");
    if (key === this.klineStreamKey) {
      if (streams.length === 0) this.closeKlineWs();
      return;
    }
    this.klineStreamKey = key;
    this.klineReconnectAttempt = 0;
    this.connectKlineCombined();
  }

  private connectKlineCombined() {
    if (!this.started) return;
    const generation = ++this.klineWsGeneration;
    this.closeKlineWs();

    const streams = this.klineStreamKey ? this.klineStreamKey.split("/").filter(Boolean) : [];
    if (streams.length === 0) return;

    const url = this.klineWsUrl(streams, this.klineHostIndex);
    const ws = new WebSocket(url);
    this.klineWs = ws;
    let gotFrame = false;

    // Silent-open watchdog: a socket that never delivers a frame while the
    // tab is VISIBLE is failed over to the other host. While hidden the check
    // only re-arms — timer throttling starves frame delivery, so silence
    // proves nothing and failover churn in a parked tab is pure waste. The
    // staleness watchdog owns recovery once the tab is visible again.
    const armSilentOpenCheck = () => {
      window.setTimeout(() => {
        if (generation !== this.klineWsGeneration || this.klineRefs.size === 0 || gotFrame) return;
        if (visibilityTracker.isHidden()) {
          armSilentOpenCheck();
          return;
        }
        this.klineHostIndex = this.klineHostIndex === 0 ? 1 : 0;
        this.connectKlineCombined();
      }, 2500);
    };
    ws.onopen = () => {
      if (generation !== this.klineWsGeneration) return;
      armSilentOpenCheck();
    };

    ws.onmessage = (ev) => {
      if (generation !== this.klineWsGeneration) return;
      gotFrame = true;
      this.klineReconnectAttempt = 0;
      try {
        const raw = JSON.parse(String(ev.data)) as KlineWsPayload | { data?: KlineWsPayload };
        const msg =
          raw && typeof raw === "object" && "data" in raw && raw.data ? raw.data : (raw as KlineWsPayload);
        if (msg && msg.e === "kline") this.applyKline(msg);
      } catch {
        /* ignore */
      }
    };

    ws.onclose = () => {
      if (!this.started || generation !== this.klineWsGeneration || this.klineRefs.size === 0) return;
      // A real socket close ALWAYS reconnects (exponential backoff) — the
      // hidden-tab deferral only gates the staleness watchdog, never genuine
      // transport-level failure.
      this.reconnectCount += 1;
      const delay = Math.min(8_000, 300 * 2 ** this.klineReconnectAttempt);
      this.klineReconnectAttempt += 1;
      if (this.klineReconnectAttempt >= 2) {
        this.klineHostIndex = this.klineHostIndex === 0 ? 1 : 0;
      }
      window.setTimeout(() => {
        if (this.started && generation === this.klineWsGeneration && this.klineRefs.size > 0) {
          this.connectKlineCombined();
        }
      }, delay);
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    };
  }

  /** Subscribe miniTickers for the full hot set (24h open even when a chart owns last). */
  private syncQuoteStreams() {
    if (!this.started) return;
    const streams = [...this.hotSymbols]
      .map((s) => `${toBinanceSymbol(s).toLowerCase()}@miniTicker`)
      .sort();
    const key = streams.join("/");
    if (key === this.quoteStreamKey) {
      if (streams.length === 0) {
        this.closeQuoteWs();
      }
      return;
    }
    this.quoteStreamKey = key;
    this.quoteReconnectAttempt = 0;
    this.connectQuoteWs();
  }

  private connectQuoteWs() {
    if (!this.started) return;
    const generation = ++this.quoteWsGeneration;
    this.closeQuoteWs();

    const streams = this.quoteStreamKey ? this.quoteStreamKey.split("/").filter(Boolean) : [];
    if (streams.length === 0) return;

    const hosts = [BINANCE_FAPI_WS, BINANCE_FAPI_WS_FALLBACK];
    const host = hosts[this.quoteReconnectAttempt % hosts.length] ?? BINANCE_FAPI_WS;
    // Combined stream for the hot set only (not !miniTicker@arr for the whole market).
    const url =
      streams.length === 1
        ? `${host}/market/ws/${streams[0]}`
        : `${host}/market/stream?streams=${streams.join("/")}`;
    const ws = new WebSocket(url);
    this.quoteWs = ws;
    let gotFrame = false;

    ws.onopen = () => {
      if (generation !== this.quoteWsGeneration) return;
      window.setTimeout(() => {
        if (generation !== this.quoteWsGeneration || gotFrame) return;
        this.quoteReconnectAttempt += 1;
        this.connectQuoteWs();
      }, 2500);
    };

    ws.onmessage = (ev) => {
      if (generation !== this.quoteWsGeneration) return;
      gotFrame = true;
      this.quoteReconnectAttempt = 0;
      try {
        const raw = JSON.parse(String(ev.data)) as
          | MiniTicker
          | MiniTicker[]
          | { data?: MiniTicker | MiniTicker[]; stream?: string };
        if (Array.isArray(raw)) {
          for (const t of raw) this.applyMiniTicker(t);
        } else if (raw && typeof raw === "object" && "data" in raw && raw.data) {
          const data = raw.data;
          if (Array.isArray(data)) for (const t of data) this.applyMiniTicker(t);
          else this.applyMiniTicker(data);
        } else if (raw && typeof raw === "object" && (raw as MiniTicker).e === "24hrMiniTicker") {
          this.applyMiniTicker(raw as MiniTicker);
        }
        this.emitQuotesSoon();
      } catch {
        /* ignore */
      }
    };

    ws.onclose = () => {
      if (!this.started || generation !== this.quoteWsGeneration) return;
      if (!this.quoteStreamKey) return;
      const delay = Math.min(8_000, 400 * 2 ** Math.min(6, this.quoteReconnectAttempt));
      this.quoteReconnectAttempt += 1;
      window.setTimeout(() => {
        if (this.started && generation === this.quoteWsGeneration && this.quoteStreamKey) {
          this.connectQuoteWs();
        }
      }, delay);
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    };
  }
}

/**
 * Test seam: reset per-test lifecycle state without disturbing caches set up
 * by earlier phases of a suite. Exposed for the feed-lifecycle regression
 * tests; production code never calls this.
 */
export function resetFeedLifecycleForTests() {
  const feed = binanceFuturesFeed as unknown as {
    started: boolean;
    visibleWatchdogFails: number;
    lastWatchdogTickAt: number;
  };
  feed.started = false;
  feed.visibleWatchdogFails = 0;
  feed.lastWatchdogTickAt = 0;
}

export const binanceFuturesFeed = new BinanceFuturesFeed();
export const binanceSpotFeed = binanceFuturesFeed;
