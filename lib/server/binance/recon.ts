import "server-only";

import { getDb } from "../db/connection";
import { redactJson } from "../audit/redact";
import { setHealthSignal } from "../health/state";
import { log } from "../log/logger";
import { findActiveIntents, findByExchangeOrderId, updateIntent } from "./intents";
import type { BinanceRestClient } from "./rest";
import { fillExists, liveState, persistFill, rememberFill, type LiveFill } from "./state";
import { isTerminalStatus } from "./types";
import { getReconciliationBreaker } from "../resilience/breakers";
import { withRiskMutation } from "./mutation-queue";
import { trackReconRun, updateTradingGauges } from "../metrics/instrument";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

export interface ReconResult {
  result: "ok" | "drift" | "error";
  diffs: string[];
  startedAt: number;
  finishedAt: number;
}

export interface ReconDeps {
  persistenceProfile?: PersistenceProfile;
  rest: BinanceRestClient;
  /** Pulls account/positions/openOrders truth from the exchange into state. */
  snapshot(): Promise<void>;
  freeze(reason: string): void;
  /** Lifts a recon/uncertainty freeze only if the caller confirms it is safe. */
  unfreeze(): void;
  /** Rejects callbacks from a manager generation that is no longer current. */
  isCurrent?: () => boolean;
}

const UNCERTAIN = new Set(["CANCEL_REQUESTED", "CANCEL_UNKNOWN", "TIMEOUT_UNKNOWN", "UNCERTAIN", "SUBMITTING", "CREATED"]);

/**
 * Settlement of record: exchange REST truth vs. persisted intents and local
 * state. Any mismatch freezes submissions until resolved.
 */
export class Reconciler {
  private readonly persistenceProfile: PersistenceProfile;

  constructor(private readonly deps: ReconDeps) {
    this.persistenceProfile = deps.persistenceProfile ?? activePersistenceProfile();
    assertPersistenceProfile(this.persistenceProfile);
  }

  private isCurrent(): boolean {
    return this.deps.isCurrent?.() ?? true;
  }

  private cancelled(): ReconResult {
    const now = Date.now();
    return { result: "error", diffs: [], startedAt: now, finishedAt: now };
  }

  async run(trigger: string): Promise<ReconResult> {
    return withRiskMutation(() => this.runSerialized(trigger));
  }

  private async runSerialized(trigger: string): Promise<ReconResult> {
    const breaker = getReconciliationBreaker();
    const startedAt = Date.now();
    if (!this.isCurrent()) return this.cancelled();
    try {
      const result = await breaker.execute(() => this.runUnprotected(trigger));
      if (!this.isCurrent()) return result;
      // The legacy reconciliation body returns an error result so it can
      // persist diagnostics. Convert that result into a breaker failure too.
      if (result.result === "error") {
        try {
          await breaker.execute(async () => {
            throw new Error(result.diffs.join("; ") || "reconciliation failed");
          });
        } catch {
          // The original result is the operator-facing response.
        }
      }
      trackReconRun(trigger, result.result, Date.now() - startedAt);
      updateTradingGauges();
      return result;
    } catch (err) {
      if (!this.isCurrent()) return this.cancelled();
      const finishedAt = Date.now();
      const result: ReconResult = { result: "error", diffs: [String(err)], startedAt: finishedAt, finishedAt };
      this.deps.freeze("reconciliation circuit is open or failed to start");
      assertPersistenceProfile(this.persistenceProfile);
      getDb()
        .prepare(`INSERT INTO reconciliation_runs (profile_id, started_at, finished_at, trigger, result, details) VALUES (?, ?, ?, ?, ?, ?)`)
        .run(this.persistenceProfile.id, finishedAt, finishedAt, trigger, result.result, redactJson({ diffs: result.diffs }));
      setLastRecon({ lastRunAt: finishedAt, lastResult: result.result, driftCount: 0 });
      trackReconRun(trigger, result.result, Date.now() - startedAt);
      updateTradingGauges();
      log.error("reconciliation circuit blocked run", { trigger, error: String(err) });
      return result;
    }
  }

  private async runUnprotected(trigger: string): Promise<ReconResult> {
    const startedAt = Date.now();
    const diffs: string[] = [];
    let result: ReconResult["result"] = "ok";
    try {
      if (!this.isCurrent()) return this.cancelled();
      await this.deps.snapshot();
      if (!this.isCurrent()) return this.cancelled();
      await this.backfillMissedFills(diffs);
      if (!this.isCurrent()) return this.cancelled();

      const openOrders = liveState().openOrders;
      const intentSync = await this.reconcileActiveIntents(openOrders, diffs);
      if (!this.isCurrent()) return this.cancelled();
      result = intentSync.result;

      for (const o of openOrders.values()) {
        if (!intentSync.seenClientIds.has(o.clientOrderId)) {
          result = "drift";
          diffs.push(`open order ${o.clientOrderId} (${o.symbol} ${o.type}) exists on exchange without an intent`);
        }
      }

      if (!this.isCurrent()) return this.cancelled();
      if (result === "drift") {
        this.deps.freeze(`reconciliation drift: ${diffs.join("; ").slice(0, 300)}`);
      } else {
        this.deps.unfreeze();
      }
    } catch (err) {
      if (!this.isCurrent()) return this.cancelled();
      result = "error";
      diffs.push(String(err));
      this.deps.freeze("reconciliation failed to complete");
      log.error("reconciliation error", { trigger, error: String(err) });
    }
    if (!this.isCurrent()) return this.cancelled();
    const finishedAt = Date.now();
    assertPersistenceProfile(this.persistenceProfile);
    getDb()
      .prepare(
        `INSERT INTO reconciliation_runs (profile_id, started_at, finished_at, trigger, result, details) VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(this.persistenceProfile.id, startedAt, finishedAt, trigger, result, redactJson({ diffs }));
    setLastRecon({ lastRunAt: finishedAt, lastResult: result, driftCount: result === "drift" ? 1 : 0 });
    return { result, diffs, startedAt, finishedAt };
  }

  private async reconcileActiveIntents(
    openOrders: ReadonlyMap<string, unknown>,
    diffs: string[],
  ): Promise<{ result: ReconResult["result"]; seenClientIds: Set<string> }> {
    let result: ReconResult["result"] = "ok";
    const seenClientIds = new Set<string>();

    for (const intent of findActiveIntents(this.persistenceProfile)) {
      if (!this.isCurrent()) return { result: "error", seenClientIds };
      seenClientIds.add(intent.clientOrderId);
      const order = await this.deps.rest.getOrder(intent.symbol, undefined, intent.clientOrderId);
      if (!this.isCurrent()) return { result: "error", seenClientIds };
      if (!order) {
        if (UNCERTAIN.has(intent.status)) {
          updateIntent(intent.clientOrderId, {
            status: "REJECTED",
            lastState: JSON.stringify({ resolvedBy: "reconciliation", note: "not_found_on_exchange" }),
          }, Date.now(), this.persistenceProfile);
          diffs.push(`intent ${intent.clientOrderId} not found on exchange; marked REJECTED`);
        } else {
          result = "drift";
          diffs.push(`intent ${intent.clientOrderId} believed ${intent.status} but exchange has no record`);
        }
        continue;
      }
      const mapped =
        order.status === "FILLED"
          ? "FILLED"
          : order.status === "CANCELED"
            ? "CANCELED"
            : order.status === "EXPIRED"
              ? "EXPIRED"
              : order.status === "REJECTED"
                ? "REJECTED"
                : order.status === "PARTIALLY_FILLED"
                  ? "PARTIALLY_FILLED"
                  : "SUBMITTED";
      if (mapped !== intent.status) {
        updateIntent(intent.clientOrderId, {
          status: mapped as never,
          exchangeOrderId: order.orderId,
          lastState: JSON.stringify({ status: order.status, executedQty: order.executedQty, source: "reconciliation" }),
        }, Date.now(), this.persistenceProfile);
        diffs.push(`intent ${intent.clientOrderId} synced ${intent.status} -> ${mapped}`);
      }
      if (!isTerminalStatus(order.status) && !openOrders.has(intent.clientOrderId)) {
        result = "drift";
        diffs.push(`exchange order ${intent.clientOrderId} is ${order.status} but missing from snapshot`);
      }
    }

    return { result, seenClientIds };
  }

  /**
   * REST user-trade history is the recovery path for fills missed while the
   * user stream was disconnected. The fills table's execution key makes this
   * safe to run on every reconciliation pass.
   */
  private async backfillMissedFills(diffs: string[]): Promise<void> {
    const now = Date.now();
    const startBySymbol = new Map<string, number>();
    const intentRows = getDb()
      .prepare(`SELECT symbol, MIN(created_at) AS start_time FROM order_intents WHERE profile_id = ? GROUP BY symbol`)
      .all(this.persistenceProfile.id) as Array<{ symbol: string; start_time: number | null }>;
    for (const row of intentRows) {
      startBySymbol.set(row.symbol, row.start_time ?? now - 24 * 60 * 60 * 1000);
    }
    for (const symbol of liveState().positions.keys()) {
      if (!startBySymbol.has(symbol)) startBySymbol.set(symbol, now - 24 * 60 * 60 * 1000);
    }
    for (const order of liveState().orders.values()) {
      if (!startBySymbol.has(order.symbol)) startBySymbol.set(order.symbol, now - 24 * 60 * 60 * 1000);
    }

    for (const [symbol, startTime] of startBySymbol) {
      if (!this.isCurrent()) return;
      let fromId: number | undefined;
      for (;;) {
        const trades = await this.deps.rest.getUserTrades(symbol, { startTime, endTime: now, limit: 1000, fromId });
        if (!this.isCurrent()) return;
        for (const trade of trades) {
          const liveOrder = [...liveState().orders.values()].find((order) => order.exchangeOrderId === trade.orderId);
          const intent = findByExchangeOrderId(trade.orderId, this.persistenceProfile);
          const fill: LiveFill = {
            tradeId: String(trade.id),
            ts: trade.time,
            exchangeOrderId: trade.orderId,
            clientOrderId: liveOrder?.clientOrderId ?? intent?.clientOrderId ?? "",
            symbol,
            side: trade.side === "SELL" ? "SELL" : "BUY",
            qty: trade.qty,
            price: trade.price,
            realizedPnl: trade.realizedPnl,
            source: "rest",
          };
          if (fillExists(fill.tradeId, this.persistenceProfile)) continue;
          if (!persistFill(fill, this.persistenceProfile)) continue;
          rememberFill(fill);
          diffs.push(`backfilled fill ${fill.tradeId} for ${symbol}`);
        }
        if (!this.isCurrent() || trades.length < 1000) break;
        const maxTradeId = Math.max(...trades.map((trade) => trade.id));
        if (!Number.isFinite(maxTradeId) || fromId === maxTradeId + 1) break;
        fromId = maxTradeId + 1;
      }
    }
  }
}

function setLastRecon(patch: { lastRunAt: number; lastResult: "ok" | "drift" | "error"; driftCount: number }): void {
  setHealthSignal({ recon: { lastRunAt: patch.lastRunAt, lastResult: patch.lastResult, driftCount: patch.driftCount } });
}
