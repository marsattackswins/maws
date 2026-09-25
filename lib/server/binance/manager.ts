import "server-only";

import { audit } from "../audit/log";
import { redactJson } from "../audit/redact";
import { alert } from "../alerts/dispatch";
import { serverConfig, type EnvConfig } from "../env/config";
import {
  assertPersistenceProfile,
  persistenceProfileFromConfig,
  type PersistenceProfile,
} from "../profile/context";
import { getRuntime, setRuntime, RUNTIME_KEYS } from "../runtime/flags";
import { healthSignals, setHealthSignal } from "../health/state";
import { log } from "../log/logger";
import { syncClock, type ClockState } from "./clock";
import { MetadataCache } from "./metadata";
import { StreamOwnerLease } from "./lease";
import { findByClientOrderId, intentsInUncertainStates, updateIntent } from "./intents";
import { OrderService, newServerClientOrderId, type ReferencePrice } from "./orders";
import { RateLimiter } from "./ratelimit";
import { BinanceRestClient, BinanceApiError } from "./rest";
import { TransportTimeoutError } from "./transport";
import { CircuitBreakerOpenError } from "../resilience/circuit-breaker";
import { realizedSinceUtcMidnight, type RiskSnapshot } from "./risk";
import { Reconciler, type ReconResult } from "./recon";
import { syncIncomeHistory, type IncomeSyncResult } from "./income";
import { markIncomeSyncFailed, markIncomeSyncSucceeded } from "./metrics-freshness";
import { withRiskMutationSync } from "./mutation-queue";
import { cancelAllAndFlatten, type EmergencyFlattenSummary } from "./emergency";
import { publishLive } from "./sse";
import {
  applyAccountEvent,
  applyAccountSnapshot,
  applyMarkPrice,
  applyOpenOrdersSnapshot,
  applyOrderEvent,
  fillExecutionKey,
  fillExists,
  persistFill,
  rememberFill,
  hydrateFillsFromLog,
  rememberHistoricalOrder,
  applyPositionSnapshot,
  applySymbolLeverage,
  balanceUsd,
  grossExposureUsd,
  liveState,
  openPositionCount,
} from "./state";
import { backfillHistoricalOrders, historySymbols, hydrateHistoricalOrders } from "./order-history";
import { StreamLeaseUnavailableError, UserDataStream } from "./stream";
import { MarkPriceStream } from "./mark-price-stream";
import type { AccountUpdateEvent, OrderTradeUpdateEvent, UserStreamEvent } from "./types";
import { getDb } from "../db/connection";
import { trackFillReceived, trackFreezeTriggered, trackOrderFilled, trackSystemStart, trackSystemStop, trackUnfreezeCleared, updateTradingGauges } from "../metrics/instrument";

export type ManagerStatus = "idle" | "starting" | "ready" | "error";

const PRICE_CACHE_MS = 10_000;

/** Mark-price poll cadence for open positions; bounded REST budget. */
const MARK_PRICE_REFRESH_MS_FALLBACK = 15_000;

/**
 * Clock resync cadence: half of the 5-minute staleness threshold used by
 * clockIsHealthy / buildHealthStatus, so the signal stays fresh with margin.
 */
const CLOCK_REFRESH_MS = 2.5 * 60 * 1000;

export class BinanceLiveManager {
  status: ManagerStatus = "idle";
  error: string | null = null;

  readonly cfg: EnvConfig;
  readonly persistenceProfile: PersistenceProfile;
  readonly limiter: RateLimiter;
  readonly rest: BinanceRestClient;
  readonly metadata: MetadataCache;
  readonly orders: OrderService;
  private lease: StreamOwnerLease;
  private stream: UserDataStream | null = null;
  private recon: Reconciler;
  private reconTimer: ReturnType<typeof setInterval> | null = null;
  private lifecycleGeneration = 0;
  /**
   * Periodic proactive clock resync. Without it the clock signal goes stale
   * after CLOCK_STALE_MS (5 min) in EVERY mode that never trips a -1021 skew
   * error — local mode in particular syncs exactly once at startup, so any
   * session longer than five minutes showed "clock degraded" on /status.
   */
  private clockTimer: ReturnType<typeof setInterval> | null = null;
  /**
   * Periodic mark-price refresh for open positions. Primary freshness now
   * comes from the public mark-price stream; this poll is the fallback for
   * stream outages, symbol-set changes, and missed events.
   */
  private markPriceTimer: ReturnType<typeof setTimeout> | null = null;
  private _markPriceStream: MarkPriceStream | null = null;
  /** Public mark-price stream (no credentials); drives per-second PnL updates. */
  get markPriceStream(): MarkPriceStream {
    if (!this._markPriceStream) {
      this._markPriceStream = new MarkPriceStream(this.cfg.env, () => this.publishMarkPriceIfChanged());
    }
    return this._markPriceStream;
  }
  private startPromise: Promise<void> | null = null;
  /** Generation the in-flight startPromise belongs to. */
  private startPromiseGeneration = 0;
  private priceCache = new Map<string, { price: string; ts: number }>();

  constructor(cfg?: EnvConfig) {
    this.cfg = cfg ?? serverConfig();
    this.persistenceProfile = persistenceProfileFromConfig(this.cfg);
    // Note: local mode is now allowed but will only use public endpoints (no credentials)
    this.limiter = new RateLimiter(this.cfg.rateInternalPerMin);
    this.rest = new BinanceRestClient(this.cfg, this.limiter, async () => {
      const generation = this.lifecycleGeneration;
      await syncClock(
        async () => (await this.rest.getTime()).serverTime,
        3,
        () => this.isGenerationCurrent(generation),
        this.persistenceProfile,
      );
    });
    this.metadata = new MetadataCache(this.rest, this.persistenceProfile);
    this.lease = new StreamOwnerLease("uds", this.cfg.leaseTtlMs, this.persistenceProfile);
    this.orders = new OrderService({
      cfg: this.cfg,
      persistenceProfile: this.persistenceProfile,
      rest: this.rest,
      getConstraints: (symbol) => this.metadata.getConstraints(symbol),
      getReferencePrice: (symbol) => this.getReferencePrice(symbol),
      getMarkPrice: async (symbol) => {
        const ticker = await this.rest.getTickerPrice(symbol);
        return { price: ticker.price, at: Date.now() };
      },
      getRiskSnapshot: () => this.getRiskSnapshot(),
      freeze: (reason) => this.freeze(reason),
      unfreeze: () => this.unfreezeIfClear(),
      emit: (event, data) => publishLive(event, data),
    });
    this.recon = this.createReconciler(0);
  }

  private isGenerationCurrent(generation: number): boolean {
    return this.lifecycleGeneration === generation && this.status !== "idle";
  }

  private assertGeneration(generation: number): void {
    if (!this.isGenerationCurrent(generation)) throw new Error("manager startup cancelled");
  }

  private createReconciler(generation: number): Reconciler {
    return new Reconciler({
      persistenceProfile: this.persistenceProfile,
      rest: this.rest,
      snapshot: () => this.snapshot(generation),
      freeze: (reason) => {
        if (this.isGenerationCurrent(generation)) this.freeze(reason);
      },
      unfreeze: () => {
        if (this.isGenerationCurrent(generation)) this.unfreezeIfClear();
      },
      isCurrent: () => this.isGenerationCurrent(generation),
    });
  }

  private clearTimers(): void {
    if (this.reconTimer) {
      clearInterval(this.reconTimer);
      this.reconTimer = null;
    }
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
      this.clockTimer = null;
    }
    if (this.markPriceTimer) {
      clearTimeout(this.markPriceTimer);
      this.markPriceTimer = null;
    }
    this.markPriceStream.stop();
  }

  private cleanupRuntime(): void {
    this.clearTimers();
    this.stream?.stop();
    this.stream = null;
  }

  private async cleanupRuntimeAndWait(): Promise<void> {
    this.clearTimers();
    const stream = this.stream;
    this.stream = null;
    if (stream) await stream.stopAndWait();
  }

  private syncClockForGeneration(generation: number): Promise<ClockState> {
    return syncClock(
      async () => (await this.rest.getTime()).serverTime,
      3,
      () => this.isGenerationCurrent(generation),
      this.persistenceProfile,
    );
  }

  /**
   * Idempotent startup with one shared in-flight promise per generation.
   * A call racing an in-flight start must NOT return that older promise:
   * it would complete with timers bound to a superseded generation, which
   * then no-ops forever (silent recon/PnL stall). Racing calls chain after
   * the older start settles (it self-cancels via its generation assert)
   * and then start fresh; the no-race path still begins synchronously.
   */
  ensureStarted(): Promise<void> {
    if (this.status === "ready") return Promise.resolve();
    if (this.startPromise && this.startPromiseGeneration === this.lifecycleGeneration) {
      return this.startPromise;
    }
    const generation = ++this.lifecycleGeneration;
    let tracked: Promise<void>;
    if (this.startPromise) {
      const prior = this.startPromise;
      tracked = prior
        .catch(() => undefined)
        .then(() => this.start(generation))
        .finally(() => {
          if (this.startPromise === tracked) this.startPromise = null;
        });
    } else {
      const startup = this.start(generation);
      tracked = startup.finally(() => {
        if (this.startPromise === tracked) this.startPromise = null;
      });
    }
    this.startPromise = tracked;
    this.startPromiseGeneration = generation;
    return tracked;
  }

  private async start(generation: number): Promise<void> {
    if (this.status === "ready") return;
    this.status = "starting";
    // A superseded in-flight start may have armed timers for a dead
    // generation; drop them before arming this generation's set.
    this.clearTimers();
    this.error = null;
    this.recon = this.createReconciler(generation);
    setHealthSignal({ managerRunning: true, brokerStatus: "starting", brokerError: null });
    let startupStream: UserDataStream | null = null;
    try {
      await this.syncClockForGeneration(generation);
      this.assertGeneration(generation);
      await this.metadata.ensureLoaded(true);
      this.assertGeneration(generation);

      // Local mode: public endpoints only (no credentials required)
      if (this.cfg.env === "local") {
        try {
          await this.rest.getTickerPrice("BTCUSDT");
          this.assertGeneration(generation);
          const now = Date.now();
          setHealthSignal({
            brokerStatus: "ready",
            brokerError: null,
            stream: {
              connected: true,
              phase: "live",
              startedAt: now,
              lastEventAt: now,
              lastApplicationEventAt: now,
              reconnects: 0,
              listenKeyRenewedAt: null,
              generation: 0,
              bufferOverflow: false,
              circuitState: "closed",
            },
          });
        } catch (err) {
          this.assertGeneration(generation);
          log.warn("market data check failed in local mode", { error: String(err) });
          setHealthSignal({
            brokerStatus: "ready",
            brokerError: null,
            stream: {
              connected: false,
              phase: "closed",
              startedAt: null,
              lastEventAt: null,
              lastApplicationEventAt: null,
              reconnects: 0,
              listenKeyRenewedAt: null,
              generation: 0,
              bufferOverflow: false,
              circuitState: "closed",
            },
          });
        }

        this.assertGeneration(generation);
        this.status = "ready";
        this.startClockRefresh(generation);
        updateTradingGauges();
        trackSystemStart(this.cfg.env);
        audit("system", "live.manager.started", { env: this.cfg.env, mode: "public-data-only" }, undefined, this.persistenceProfile);
        log.info("live manager ready (public data only)", { env: this.cfg.env });
        return;
      }

      // Non-local modes: full authenticated monitoring. Position mode is an
      // account invariant: keep monitoring if the check fails, but leave the
      // mode unverified so the execution gate remains closed.
      try {
        const mode = await this.rest.getPositionMode();
        this.assertGeneration(generation);
        const hedge = mode.dualSidePosition === true;
        setHealthSignal({
          positionMode: {
            mode: hedge ? "hedge" : "one-way",
            checkedAt: Date.now(),
            error: hedge ? "Hedge position mode is enabled; expected one-way mode" : null,
          },
        });
        if (hedge) {
          log.error("unexpected Binance position mode; live submissions disabled", { expected: "one-way", actual: "hedge" });
        }
      } catch (err) {
        this.assertGeneration(generation);
        setHealthSignal({ positionMode: { mode: "unknown", checkedAt: Date.now(), error: String(err) } });
        log.error("could not verify Binance position mode; live submissions disabled", { error: String(err) });
      }

      this.metadata.refreshLeverageBrackets().catch((err) => {
        if (this.isGenerationCurrent(generation)) log.warn("leverage brackets unavailable", { error: String(err) });
      });
      await this.snapshot(generation);
      this.assertGeneration(generation);
      startupStream = new UserDataStream({
        cfgEnv: this.cfg.env as "testnet" | "shadow" | "production",
        rest: this.rest,
        lease: this.lease,
        takeSnapshot: () => this.snapshot(generation),
        processEvent: (ev) => this.processEvent(ev, generation),
        reconcile: () => this.reconcileRun("stream-buffer-overflow", generation),
        freeze: (reason) => {
          if (this.isGenerationCurrent(generation)) this.freeze(reason);
        },
        leaseWaitTimeoutMs: Math.max(5_000, this.cfg.leaseTtlMs + 5_000),
        onStatus: (s) => {
          if (!this.isGenerationCurrent(generation)) return;
          const stream = this.stream?.status();
          setHealthSignal({ stream: {
            connected: s.connected,
            leaseOwned: s.leaseOwned === true,
            phase: s.phase,
            startedAt: s.startedAt ?? stream?.startedAt ?? null,
            lastEventAt: s.lastEventAt ?? stream?.lastEventAt ?? null,
            lastApplicationEventAt: s.lastApplicationEventAt ?? stream?.lastApplicationEventAt ?? null,
            reconnects: s.reconnects,
            listenKeyRenewedAt: null,
            generation: s.generation ?? stream?.generation ?? 0,
            bufferOverflow: s.bufferOverflow ?? stream?.bufferOverflow ?? false,
            circuitState: s.circuitState ?? stream?.circuitState ?? "unknown",
          } });
          publishLive("stream-status", { connected: s.connected, phase: s.phase, reconnects: s.reconnects, generation: s.generation, bufferOverflow: s.bufferOverflow });
          if (!s.connected) alert("stream_down", { reconnects: s.reconnects });
        },
      });
      this.stream = startupStream;
      await startupStream.start();
      this.assertGeneration(generation);
      await this.recon.run("startup");
      this.assertGeneration(generation);
      // History hydration runs after reconciliation (whose backfill just
      // persisted fresh rows) and before the first state publish, so a
      // restart immediately exposes persisted fills and orders to
      // /api/live/state and the SSE initial snapshot. Failures are
      // non-fatal: the next recon pass persists the same rows again.
      try {
        hydrateFillsFromLog(this.persistenceProfile);
        const symbols = historySymbols(this.persistenceProfile, liveState().positions.keys());
        await backfillHistoricalOrders(this.rest, symbols, this.persistenceProfile);
        this.assertGeneration(generation);
        hydrateHistoricalOrders(this.persistenceProfile);
      } catch (err) {
        log.warn("history hydration failed", { error: String(err) });
      }
      this.reconTimer = setInterval(() => {
        if (!this.isGenerationCurrent(generation)) return;
        void this.recon.run("interval").catch((err) => {
          if (this.isGenerationCurrent(generation)) log.error("reconciliation crash", { error: String(err) });
        });
      }, this.cfg.reconIntervalMs);
      // Income ledger backfill: startup + per-recon cadence keeps lifetime
      // realized PnL, commissions, and funding fees current without touching
      // the reconciliation safety path itself. Awaited so its account-update
      // publish settles before start() returns (bounded: ≤5 pages).
      await this.syncIncome("startup", generation);
      this.assertGeneration(generation);
      publishLive("account-update", { at: Date.now() });
      // Primary: public mark-price stream for every open position.
      this.markPriceStream.syncSymbols([...liveState().positions.keys()]);
      setHealthSignal({ markPrice: this.markPriceSignal() });
      // Fallback: periodic REST poll (slower cadence than before — the
      // stream is primary now; the poll only heals gaps).
      this.markPriceTimer = setTimeout(
        () => this.markPriceLoop(),
        this.cfg.markPriceIntervalMs ?? MARK_PRICE_REFRESH_MS_FALLBACK,
      );
      this.status = "ready";
      this.startClockRefresh(generation);
      updateTradingGauges();
      trackSystemStart(this.cfg.env);
      setHealthSignal({ brokerStatus: "ready", brokerError: null });
      audit("system", "live.manager.started", { env: this.cfg.env }, undefined, this.persistenceProfile);
      log.info("live manager ready", { env: this.cfg.env });
    } catch (err) {
      if (this.isGenerationCurrent(generation)) {
        await this.cleanupRuntimeAndWait();
      } else {
        await startupStream?.stopAndWait();
      }
      if (!this.isGenerationCurrent(generation)) {
        return;
      }
      this.status = "error";
      this.error = err instanceof BinanceApiError
        ? err.exchangeMsg
        : err instanceof TransportTimeoutError
          ? "Binance request timed out"
          : err instanceof StreamLeaseUnavailableError
            ? err.message
            : err instanceof CircuitBreakerOpenError
              ? `Circuit ${err.circuitName} is open; wait for it to reset and retry`
              : err instanceof Error && err.message
                ? err.message
                : "Binance connection failed";
      setHealthSignal({ managerRunning: false, brokerStatus: "error", brokerError: this.error });
      audit("system", "live.manager.error", { error: this.error }, undefined, this.persistenceProfile);
      alert("manager_error", { error: this.error });
      log.error("live manager failed to start", { error: this.error, raw: String(err) });
      throw err;
    }
  }

  /**
   * Periodic clock resync, shared by all modes.
   *
   * Runs at half the staleness threshold so the signal can never go stale
   * between runs. Failures are swallowed (the stale signal itself is the
   * operator-visible symptom; -1021 skew errors still trigger on-demand
   * resyncs in the REST layer). In local mode a successful resync also
   * re-probes market data so the stream signal stays honest.
   */
  private startClockRefresh(generation: number): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
    this.clockTimer = setInterval(() => {
      if (!this.isGenerationCurrent(generation)) return;
      void (async () => {
        try {
          await this.syncClockForGeneration(generation);
          if (!this.isGenerationCurrent(generation)) return;
          if (this.cfg.env === "local") {
            try {
              await this.rest.getTickerPrice("BTCUSDT");
              if (!this.isGenerationCurrent(generation)) return;
              const now = Date.now();
              setHealthSignal({
                stream: {
                  connected: true,
                  phase: "live",
                  startedAt: now,
                  lastEventAt: now,
                  lastApplicationEventAt: now,
                  reconnects: 0,
                  listenKeyRenewedAt: null,
                  generation: 0,
                  bufferOverflow: false,
                  circuitState: "closed",
                },
              });
            } catch {
              // Leave the previous stream signal in place; a degraded probe
              // is transient and the next interval will retry.
            }
          }
        } catch (err) {
          if (this.isGenerationCurrent(generation)) {
            log.warn("periodic clock resync failed", { error: String(err) });
          }
        }
      })();
    }, CLOCK_REFRESH_MS);
  }

  stop(): void {
    void this.stopAndWait().catch(() => undefined);
  }

  /** Awaitable shutdown used by the profile coordinator. */
  async stopAndWait(): Promise<void> {
    const wasActive = this.status !== "idle" || this.startPromise !== null || this.stream !== null || this.reconTimer !== null || this.clockTimer !== null;
    if (!wasActive) return;

    this.lifecycleGeneration += 1;
    this.startPromise = null;
    this.clearTimers();
    const stream = this.stream;
    this.stream = null;
    trackSystemStop();
    this.status = "idle";
    this.error = null;
    const previousStream = healthSignals().stream;
    setHealthSignal({
      managerRunning: false,
      brokerStatus: "idle",
      brokerError: null,
      stream: previousStream
        ? { ...previousStream, connected: false, leaseOwned: false, phase: "closed" }
        : null,
    });
    if (stream) await stream.stopAndWait();
  }

  /**
   * Refreshes mark price / unrealized PnL for every open position via a
   * public premium-index REST call and republishes state. Best-effort:
   * failures are logged and left to the next tick or a reconciliation.
   */
  private async refreshPositionMarkPrices(generation: number): Promise<void> {
    const positions = [...liveState().positions.values()].filter((p) => Number(p.qty) !== 0);
    if (positions.length === 0) return;
    let changed = false;
    for (const pos of positions) {
      try {
        const t = await this.rest.getMarkPrice(pos.symbol);
        if (!this.isGenerationCurrent(generation)) return;
        applyMarkPrice(pos.symbol, t.markPrice, t.time ?? Date.now());
        changed = true;
      } catch (err) {
        if (err instanceof CircuitBreakerOpenError) throw err;
        if (err instanceof BinanceApiError) throw err;
        // Transport-level hiccup: skip this symbol, retry next tick.
        log.debug("mark-price fetch failed", { symbol: pos.symbol, error: String(err) });
      }
    }
    if (changed) {
      updateTradingGauges();
      publishLive("account-update", { at: Date.now() });
    }
    // Keep the stream subscription aligned with the current position set.
    this.markPriceStream.syncSymbols([...liveState().positions.keys()]);
    setHealthSignal({ markPrice: this.markPriceSignal() });
    publishLive("mark-price", this.markPriceSignal());
  }

  /**
   * Mark-price poller loop. Self-scheduling (setTimeout chain) instead of a
   * captured-generation setInterval: each tick re-reads the live generation,
   * so the loop survives internal generation churn while stopping cleanly
   * when the manager goes idle and on every shutdown.
   */
  private markPriceLoop(): void {
    if (this.status === "idle") return;
    const generation = this.lifecycleGeneration;
    void this.refreshPositionMarkPrices(generation)
      .catch((err) => {
        if (this.isGenerationCurrent(generation)) log.debug("mark-price refresh failed", { error: String(err) });
      })
      .finally(() => {
        if (this.status === "idle" || !this.isGenerationCurrent(generation)) return;
        this.publishMarkPriceIfChanged();
        this.markPriceTimer = setTimeout(
          () => this.markPriceLoop(),
          this.cfg.markPriceIntervalMs ?? MARK_PRICE_REFRESH_MS_FALLBACK,
        );
      });
  }

  /** Exchange truth into memory; the authoritative snapshot path. */
  async snapshot(generation = this.lifecycleGeneration): Promise<void> {
    const [account, positions, openOrders] = await Promise.all([
      this.rest.getAccount(),
      this.rest.getPositionRisk(),
      this.rest.getOpenOrders(),
    ]);
    if (!this.isGenerationCurrent(generation)) return;
    applyAccountSnapshot(account);
    applyPositionSnapshot(positions);
    applyOpenOrdersSnapshot(openOrders);
    updateTradingGauges();
    setHealthSignal({ snapshot: { fetchedAt: Date.now() } });
    publishLive("snapshot", { at: Date.now() });
  }

  private processEvent(ev: UserStreamEvent, generation = this.lifecycleGeneration): void | Promise<void> {
    if (!this.isGenerationCurrent(generation)) return;
    return withRiskMutationSync(() => {
      if (!this.isGenerationCurrent(generation)) return;
      return this.processEventUnlocked(ev);
    });
  }

  private processEventUnlocked(ev: UserStreamEvent): void {
    assertPersistenceProfile(this.persistenceProfile);
    const db = getDb();
    const eventRow = db
      .prepare(
        `INSERT INTO order_events (profile_id, ts, event_time, source, event_type, exchange_order_id, client_order_id, symbol, payload, processed)
         VALUES (?, ?, ?, 'stream', ?, ?, ?, ?, ?, 0)`,
      )
      .run(
        this.persistenceProfile.id,
        Date.now(),
        typeof ev.E === "number" ? ev.E : null,
        ev.e,
        ev.e === "ORDER_TRADE_UPDATE" ? (ev as OrderTradeUpdateEvent).o.i : null,
        ev.e === "ORDER_TRADE_UPDATE" ? (ev as OrderTradeUpdateEvent).o.c : null,
        ev.e === "ORDER_TRADE_UPDATE" ? (ev as OrderTradeUpdateEvent).o.s : null,
        redactJson(ev),
      );
    const eventId = eventRow.lastInsertRowid;

    try {
      if (this.cfg.env === "shadow") {
        const now = Date.now();
        const evtTime = typeof ev.E === "number" ? ev.E : null;
        const payload = redactJson(ev);
        if (ev.e === "ORDER_TRADE_UPDATE") {
          const o = (ev as OrderTradeUpdateEvent).o;
          const hasFill = Number(o.l) > 0;
          db.prepare(
            `INSERT INTO shadow_events (profile_id, ts, event_time, event_type, symbol, side, qty, price, realized_pnl, client_order_id, exchange_order_id, payload)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).run(
            this.persistenceProfile.id,
            now, evtTime, ev.e, o.s,
            hasFill ? o.S : null,
            hasFill ? o.l : null,
            hasFill ? o.L : null,
            hasFill ? o.rp : null,
            o.c, String(o.i), payload,
          );
        } else {
          db.prepare(
            `INSERT INTO shadow_events (profile_id, ts, event_time, event_type, symbol, side, qty, price, realized_pnl, client_order_id, exchange_order_id, payload)
             VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?)`,
          ).run(this.persistenceProfile.id, now, evtTime, ev.e, payload);
        }
      }

      if (ev.e === "ORDER_TRADE_UPDATE") {
        const orderEv = ev as OrderTradeUpdateEvent;
        const o = orderEv.o;
        const skipTradeIds = new Set<string>();
        if (o.l && Number(o.l) > 0) {
          const tradeId = fillExecutionKey({ symbol: o.s, tradeId: o.t, exchangeOrderId: o.i, ts: o.T, qty: o.l, price: o.L });
          if (fillExists(tradeId, this.persistenceProfile)) skipTradeIds.add(tradeId);
        }
        const fills = applyOrderEvent(orderEv, skipTradeIds);
        const persistedFills: typeof fills = [];
        db.transaction(() => {
          for (const fill of fills) {
            if (persistFill(fill, this.persistenceProfile)) persistedFills.push(fill);
          }
          this.syncIntentFromEvent(orderEv);
          db.prepare(`UPDATE order_events SET processed = 1 WHERE id = ? AND profile_id = ?`).run(eventId, this.persistenceProfile.id);
        })();
        const closedWithPnl =
          o.X === "FILLED" &&
          persistedFills.some((f) => f.realizedPnl !== "" && Number(f.realizedPnl) !== 0);
        for (const fill of persistedFills) {
          rememberFill(fill);
          trackFillReceived(fill.clientOrderId, fill.symbol, fill.side, fill.qty, fill.price);
          alert("fill", { symbol: fill.symbol, side: fill.side, qty: fill.qty, price: fill.price, realizedPnl: fill.realizedPnl });
        }
        // Realized PnL freshness: a persisted closing fill moves account
        // metrics only when the income ledger catches up. Nudge the sync
        // without blocking the fill transaction or the event loop; the
        // periodic sync remains the fallback and the sync itself is
        // idempotent (dedup by tranId), so a nudge racing a recon pass is
        // harmless.
        if (closedWithPnl) {
          void this.syncIncome("closing-fill").catch(() => undefined);
        }
        if (o.X === "FILLED") {
          trackOrderFilled(o.c, o.s, o.z, o.L);
        }
        updateTradingGauges();
        publishLive("order-update", {
          clientOrderId: orderEv.o.c,
          status: orderEv.o.X,
          symbol: orderEv.o.s,
          fills: persistedFills,
        });
        if (persistedFills.length > 0) publishLive("fills", persistedFills);
      } else {
        if (ev.e === "ACCOUNT_UPDATE") {
          applyAccountEvent(ev as AccountUpdateEvent);
          updateTradingGauges();
          publishLive("account-update", { at: Date.now() });
        } else if (ev.e === "ACCOUNT_CONFIG_UPDATE") {
          // Fires after POST /fapi/v1/leverage: record the exchange-side
          // per-symbol leverage so fill events can seed correct position rows
          // until the next authoritative position-risk snapshot.
          const ac = (ev as { ac?: { s?: string; l?: number } }).ac;
          if (ac?.s && typeof ac.l === "number") {
            applySymbolLeverage(ac.s, String(ac.l));
            publishLive("account-update", { at: Date.now() });
          }
        }
        db.prepare(`UPDATE order_events SET processed = 1 WHERE id = ? AND profile_id = ?`).run(eventId, this.persistenceProfile.id);
      }

      setHealthSignal({
        stream: {
          connected: true,
          leaseOwned: this.stream?.status().leaseOwned === true,
          phase: "live",
          startedAt: null,
          lastEventAt: Date.now(),
          lastApplicationEventAt: this.stream?.status().lastApplicationEventAt ?? null,
          reconnects: this.stream?.status().reconnects ?? 0,
          listenKeyRenewedAt: null,
          generation: this.stream?.status().generation ?? 0,
          bufferOverflow: this.stream?.status().bufferOverflow ?? false,
          circuitState: this.stream?.status().circuitState ?? "unknown",
        },
      });
    } catch (err) {
      this.freeze("user-data event processing failed; event remains unprocessed");
      log.error("user-data event processing failed", { error: String(err), eventId });
      throw err;
    }
  }

  private syncIntentFromEvent(ev: OrderTradeUpdateEvent): void {
    const status = ev.o.X;
    const mapped =
      status === "FILLED"
        ? "FILLED"
        : status === "CANCELED"
          ? "CANCELED"
          : status === "EXPIRED"
            ? "EXPIRED"
            : status === "REJECTED"
              ? "REJECTED"
              : status === "PARTIALLY_FILLED"
                ? "PARTIALLY_FILLED"
                : "SUBMITTED";
    const intent = findByClientOrderId(ev.o.c, this.persistenceProfile);
    if (!intent) return;
    updateIntent(ev.o.c, {
      status: mapped,
      exchangeOrderId: ev.o.i,
      lastState: JSON.stringify({ status, executedQty: ev.o.z, avgPrice: ev.o.L, source: "stream" }),
    }, Date.now(), this.persistenceProfile);
    if (mapped === "FILLED" || mapped === "CANCELED" || mapped === "EXPIRED" || mapped === "REJECTED") {
      this.unfreezeIfClear();
    }
  }

  /** Mark submissions frozen until the named condition clears. */
  freeze(reason: string): void {
    if (getRuntime(RUNTIME_KEYS.frozen, "", this.persistenceProfile) === "true" && getRuntime(RUNTIME_KEYS.frozenReason, "", this.persistenceProfile) === reason) return;
    trackFreezeTriggered(reason);
    setRuntime(RUNTIME_KEYS.frozen, "true", Date.now(), this.persistenceProfile);
    setRuntime(RUNTIME_KEYS.frozenReason, reason, Date.now(), this.persistenceProfile);
    audit("system", "live.freeze", { reason }, undefined, this.persistenceProfile);
    alert("freeze", { reason });
    publishLive("health", { frozen: true, reason });
    log.warn("submissions frozen", { reason });
  }

  /** Lifts the freeze only when nothing uncertain remains. */
  unfreezeIfClear(): void {
    if (getRuntime(RUNTIME_KEYS.frozen, "", this.persistenceProfile) !== "true") return;
    if (intentsInUncertainStates(this.persistenceProfile).length > 0) return;
    setRuntime(RUNTIME_KEYS.frozen, "false", Date.now(), this.persistenceProfile);
    setRuntime(RUNTIME_KEYS.frozenReason, "", Date.now(), this.persistenceProfile);
    trackUnfreezeCleared();
    audit("system", "live.unfreeze", {}, undefined, this.persistenceProfile);
    alert("unfreeze", {});
    publishLive("health", { frozen: false });
    log.info("submissions unfrozen");
  }

  /** Mark/last price for collars and market-order notional, tagged with observation time. */
  async getReferencePrice(symbol: string): Promise<ReferencePrice | null> {
    const pos = liveState().positions.get(symbol);
    if (pos && pos.markPrice && Number(pos.markPrice) > 0) return { price: pos.markPrice, at: pos.updatedAt };
    const cached = this.priceCache.get(symbol);
    if (cached && Date.now() - cached.ts < PRICE_CACHE_MS) return { price: cached.price, at: cached.ts };
    try {
      const t = await this.rest.getTickerPrice(symbol);
      const now = Date.now();
      this.priceCache.set(symbol, { price: t.price, ts: now });
      return { price: t.price, at: now };
    } catch (err) {
      // Circuit-open is infrastructure, not missing data: let it propagate so
      // mutations surface 503 circuit_open instead of a business-shaped reject.
      if (err instanceof CircuitBreakerOpenError) throw err;
      return cached ? { price: cached.price, at: cached.ts } : null;
    }
  }

  getRiskSnapshot(): RiskSnapshot {
    const state = liveState();
    const workingOrders = [...state.openOrders.values()]
      .map((order) => ({
        qty: order.origQty,
        effectivePrice:
          order.price !== "0"
            ? order.price
            : order.stopPrice !== "0"
              ? order.stopPrice
              : state.positions.get(order.symbol)?.markPrice ?? "0",
      }))
      .filter((item) => item.effectivePrice !== "0");
    const uncertainIntents = intentsInUncertainStates(this.persistenceProfile)
      .map((intent) => ({
        qty: intent.qty,
        effectivePrice:
          intent.price ??
          intent.stopPrice ??
          (() => {
            try {
              return (JSON.parse(intent.lastState ?? "{}") as { effectivePrice?: string }).effectivePrice ?? state.positions.get(intent.symbol)?.markPrice ?? "0";
            } catch {
              return state.positions.get(intent.symbol)?.markPrice ?? "0";
            }
          })(),
      }))
      .filter((item) => item.effectivePrice !== "0");
    return {
      balanceUsd: balanceUsd(),
      grossExposureUsd: grossExposureUsd(),
      openOrderCount: state.openOrders.size,
      openPositionCount: openPositionCount(),
      realizedTodayUsd: realizedSinceUtcMidnight(Date.now(), this.persistenceProfile),
      workingOrders,
      uncertainIntents,
    };
  }

  async emergencyFlatten(triggeredBy: string): Promise<EmergencyFlattenSummary> {
    return cancelAllAndFlatten(
      this.cfg.env,
      {
        getOpenOrders: () => this.rest.getOpenOrdersEmergency(),
        getOpenPositions: async () => (await this.rest.getPositionRiskEmergency()).filter((row) => Number(row.positionAmt) !== 0).map((row) => ({ symbol: row.symbol, positionAmt: row.positionAmt })),
        cancelAllOpenOrders: (symbol) => this.rest.cancelAllOpenOrdersEmergency(symbol),
        closePosition: (symbol, positionAmt) => this.orders.emergencyClosePosition(symbol, positionAmt),
      },
      triggeredBy,
      this.persistenceProfile,
    );
  }

  /** Manual/triggered reconciliation pass. */
  reconcileRun(trigger: string, generation = this.lifecycleGeneration): Promise<ReconResult> {
    if (!this.isGenerationCurrent(generation)) {
      const now = Date.now();
      return Promise.resolve({ result: "error", diffs: [], startedAt: now, finishedAt: now });
    }
    return this.recon.run(trigger).then(async (result) => {
      // Piggy-back the income ledger on the recon cadence (60s default) but
      // never alter the recon result or its freeze behavior.
      await this.syncIncome(trigger, generation);
      return result;
    });
  }

  private lastMarkPriceSignal: string | null = null;

  private markPriceSignal() {
    const s = this.markPriceStream.status();
    return { connected: s.connected, stale: s.stale, symbols: s.symbols.length, lastEventAt: s.lastEventAt, reconnects: s.reconnects } as const;
  }

  /** Publishes the freshness signal when the stream state changed. */
  private publishMarkPriceIfChanged(): void {
    const next = JSON.stringify(this.markPriceSignal());
    if (next === this.lastMarkPriceSignal) return;
    this.lastMarkPriceSignal = next;
    setHealthSignal({ markPrice: this.markPriceSignal() });
    publishLive("mark-price", this.markPriceSignal());
  }

  /**
   * Income-ledger sync (REALIZED_PNL / COMMISSION / FUNDING_FEE).
   * Best-effort: a failure never blocks trading, and raw exchange error text
   * is never surfaced — it stays in server logs only.
   */
  async syncIncome(trigger: string, generation = this.lifecycleGeneration): Promise<IncomeSyncResult | null> {
    if (!this.isGenerationCurrent(generation)) return null;
    try {
      const result = await syncIncomeHistory(this.rest, this.persistenceProfile);
      // Success (even with zero new rows) clears the stale flag: retained
      // historical totals are current again.
      markIncomeSyncSucceeded();
      return result;
    } catch (err) {
      // A failed sync must never erase the durable ledger; it only marks the
      // retained totals stale so the UI does not imply freshness it lacks.
      markIncomeSyncFailed();
      log.warn("income history sync failed", { trigger, error: String(err) });
      return null;
    }
  }

  newClientOrderId(prefix: string): string {
    return newServerClientOrderId(prefix);
  }
}

let instance: BinanceLiveManager | null = null;

export function liveManager(cfg?: EnvConfig): BinanceLiveManager {
  if (!instance) instance = new BinanceLiveManager(cfg);
  return instance;
}

export function hasLiveManager(): boolean {
  return instance != null;
}

/** Installs the coordinator-owned manager after the prior manager is stopped. */
export function replaceLiveManagerForCoordinator(next: BinanceLiveManager): void {
  // The coordinator calls this only after fencing and stopping the previous
  // runtime. Keeping replacement here prevents any other module from creating
  // a second authoritative slot.
  instance = next;
}

export function clearLiveManagerForCoordinator(): void {
  instance = null;
}

/** Test seam. */
export function resetLiveManagerForTests(next?: BinanceLiveManager): void {
  instance?.stop();
  instance = next ?? null;
}
