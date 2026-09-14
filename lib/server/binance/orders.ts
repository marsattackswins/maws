import "server-only";

import crypto from "node:crypto";

import { abs, isNegative, isZero, parseDec, toStr } from "./decimal";
import { audit } from "../audit/log";
import { requireEmergencyActionAllowed, requireSubmissionAllowed, SubmissionBlockedError } from "../gates/execution";
import type { EnvConfig } from "../env/config";
import {
  assertPersistenceProfile,
  persistenceProfileFromConfig,
  type PersistenceProfile,
} from "../profile/context";
import { log } from "../log/logger";
import {
  BinanceApiError,
  BinanceRestClient,
  classifyBinanceError,
  ERR_INVALID_API_KEY,
  ERR_REDUCE_ONLY_REJECT,
  ERR_UNKNOWN_CANCEL,
} from "./rest";
import { TransportTimeoutError } from "./transport";
import { CircuitBreakerOpenError } from "../resilience/circuit-breaker";
import type { SymbolConstraints } from "./filters";
import { validateAgainstConstraints } from "./filters";
import { checkRisk, type RiskSnapshot } from "./risk";
import { withRiskMutation } from "./mutation-queue";
import {
  createIntent as createIntentRecord,
  findByClientOrderId as findIntentByClientOrderId,
  intentsInUncertainStates as findUncertainIntents,
  updateIntent as updateIntentRecord,
  type OrderIntent,
} from "./intents";
import { liveState, rememberOrder } from "./state";
import type { BinanceOrder } from "./types";
import { trackOrderCanceled, trackOrderRejected, trackOrderSubmitted, trackOrderSubmissionDuration } from "../metrics/instrument";
import { normalMutationBlock } from "../profile/admission";

export interface SubmitOrderInput {
  symbol: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT" | "STOP_MARKET" | "TAKE_PROFIT_MARKET";
  qty?: string;
  price?: string;
  stopPrice?: string;
  reduceOnly?: boolean;
  closePosition?: boolean;
  clientOrderId?: string;
  kind?: "order" | "algo";
  /** Internal emergency-close path; it still sends a normal MARKET order. */
  emergencyClose?: boolean;
  /**
   * Set by the position-close paths for both the reduce-only attempt and the
   * testnet-flag fallback. The quantity is the exchange's live position size,
   * so the order only flattens and must skip the new-exposure risk gate.
   */
  isClose?: boolean;
}

export interface ReferencePrice {
  price: string;
  /** Wall-clock ms when this quote was observed. */
  at: number;
}

/** Fail closed: refuse submissions when the best available quote is older than this. */
export const STALE_REFERENCE_MS = 30_000;

/**
 * Binance testnet occasionally rejects fully valid reduce-only closes with
 * -2022 REDUCE_ONLY_REJECT even in one-way mode with no open orders. The same
 * order without the flag is accepted; production honors the flag correctly.
 *
 * -2022 also has a legitimate meaning — an existing open order conflicting
 * with the close — so the fallback only fires when `verifySafeToFallback`
 * confirms the testnet-defect signature: no open orders AND the position
 * still matches the quantity/side that was read for the close. Otherwise the
 * original rejection is returned unchanged. The retry is safety-equivalent:
 * -2022 on HTTP 400 is a definite rejection (nothing executed), and the plain
 * order is verified to only flatten right before it is sent.
 */
function submitCloseWithReduceOnlyFallback(
  place: (reduceOnly: boolean) => Promise<OrderResult>,
  verifySafeToFallback: () => Promise<boolean>,
): Promise<OrderResult> {
  return (async () => {
    const first = await place(true);
    if (!(first.ok === false && first.errorCode === ERR_REDUCE_ONLY_REJECT)) return first;
    audit("operator", "order.close.reduce_only_rejected", { code: ERR_REDUCE_ONLY_REJECT });
    let safeToFallback = false;
    try {
      safeToFallback = await verifySafeToFallback();
    } catch {
      // Cannot verify exchange state: fail closed, keep the original rejection.
    }
    if (!safeToFallback) return first;
    const second = await place(false);
    audit("operator", "order.close.reduce_only_fallback", { clientOrderId: second.clientOrderId, ok: second.ok });
    return second;
  })();
}

export interface OrderResult {
  ok: boolean;
  clientOrderId: string;
  status?: string;
  exchangeOrderId?: number | null;
  error?: string;
  /** Binance rejection code when the exchange refused the order (e.g. -2022). */
  errorCode?: number;
  duplicate?: boolean;
}

export interface OrderServiceDeps {
  cfg: EnvConfig;
  persistenceProfile?: PersistenceProfile;
  rest: BinanceRestClient;
  getConstraints(symbol: string): SymbolConstraints | null;
  getReferencePrice(symbol: string): Promise<ReferencePrice | null>;
  /** Optional uncached mark-price fetch for protective-order validation. */
  getMarkPrice?(symbol: string): Promise<ReferencePrice | null>;
  getRiskSnapshot(): RiskSnapshot;
  freeze(reason: string): void;
  unfreeze?: () => void;
  emit(event: string, data: unknown): void;
  sleep?: (ms: number) => Promise<void>;
}

/** Binance newClientOrderId charset/length. */
export function newServerClientOrderId(prefix: string): string {
  const body = crypto.randomBytes(12).toString("hex");
  return `${prefix}${body}`.slice(0, 36);
}

export class OrderService {
  private readonly persistenceProfile: PersistenceProfile;

  constructor(private readonly deps: OrderServiceDeps) {
    this.persistenceProfile = deps.persistenceProfile ?? persistenceProfileFromConfig(deps.cfg);
    assertPersistenceProfile(this.persistenceProfile);
  }

  private sleep(ms: number): Promise<void> {
    return (this.deps.sleep ?? defaultSleep)(ms);
  }

  private findIntent(clientOrderId: string) {
    return findIntentByClientOrderId(clientOrderId, this.persistenceProfile);
  }

  private updateIntent(
    clientOrderId: string,
    patch: Partial<Pick<OrderIntent, "status" | "exchangeOrderId" | "lastState">>,
  ): void {
    updateIntentRecord(clientOrderId, patch, Date.now(), this.persistenceProfile);
  }

  private uncertainIntents() {
    return findUncertainIntents(this.persistenceProfile);
  }

  async submitOrder(input: SubmitOrderInput): Promise<OrderResult> {
    return withRiskMutation(() => this.submitOrderSerialized(input));
  }

  private async submitOrderSerialized(input: SubmitOrderInput): Promise<OrderResult> {
    const { cfg } = this.deps;
    const clientOrderId = input.clientOrderId ?? newServerClientOrderId(input.kind === "algo" ? "alg" : "ord");
    const blocked = normalMutationBlock();
    if (blocked && !input.emergencyClose) return { ok: false, clientOrderId, error: blocked };

    try {
      if (input.emergencyClose) requireEmergencyActionAllowed(cfg);
      else requireSubmissionAllowed(cfg);
    } catch (err) {
      if (err instanceof SubmissionBlockedError) {
        trackOrderRejected(clientOrderId, input.symbol, err.message);
        audit("operator", "order.blocked", { symbol: input.symbol, reasons: err.reasons, clientOrderId });
        return { ok: false, clientOrderId, error: err.message };
      }
      throw err;
    }

    const constraints = this.deps.getConstraints(input.symbol);
    if (!input.emergencyClose && !constraints) {
      return { ok: false, clientOrderId, error: `No exchange filter data for ${input.symbol}; metadata not ready` };
    }

    const validation = validateOrderInput(input, constraints);
    if (validation) {
      const msg = validation.errors.join("; ");
      if (validation.recordRejection) {
        trackOrderRejected(clientOrderId, input.symbol, msg);
        audit("operator", "order.rejected.validation", { symbol: input.symbol, clientOrderId, errors: validation.errors });
      }
      return { ok: false, clientOrderId, error: msg };
    }

    const reference = input.emergencyClose ? null : await this.deps.getReferencePrice(input.symbol);
    if (!input.emergencyClose && !reference) {
      audit("operator", "order.rejected.no_reference", { symbol: input.symbol, clientOrderId });
      return { ok: false, clientOrderId, error: "No reference price available to evaluate the order" };
    }
    const referenceAgeMs = reference ? Date.now() - reference.at : 0;
    if (!input.emergencyClose && referenceAgeMs > STALE_REFERENCE_MS) {
      audit("operator", "order.rejected.stale_data", { symbol: input.symbol, clientOrderId, ageMs: referenceAgeMs });
      return { ok: false, clientOrderId, error: "Market data is stale; order rejected until quotes refresh" };
    }
    const effectivePrice = input.price ?? input.stopPrice ?? reference?.price ?? "0";
    if (!input.closePosition && !input.emergencyClose && !input.reduceOnly && !input.isClose) {
      const riskErrors = checkRisk(
        cfg,
        this.deps.getRiskSnapshot(),
        { type: input.type, qty: input.qty ?? "0", effectivePrice, reduceOnly: !!input.reduceOnly },
        reference!.price,
      );
      if (riskErrors.length > 0) {
        audit("operator", "order.rejected.risk", { symbol: input.symbol, clientOrderId, errors: riskErrors });
        return { ok: false, clientOrderId, error: riskErrors.join("; ") };
      }
    }

    const { intent, duplicate } = createIntentRecord({
      clientOrderId,
      clientAlgoId: input.kind === "algo" ? clientOrderId : undefined,
      kind: input.kind ?? "order",
      symbol: input.symbol,
      side: input.side,
      type: input.type,
      qty: input.closePosition ? "" : input.qty ?? "",
      price: input.price ?? null,
      stopPrice: input.stopPrice ?? null,
      reduceOnly: !!input.reduceOnly,
    }, Date.now(), this.persistenceProfile);
    if (duplicate) {
      return {
        ok: false,
        clientOrderId,
        duplicate: true,
        error: `Duplicate clientOrderId ${clientOrderId} (intent already ${intent.status})`,
      };
    }

    this.updateIntent(clientOrderId, { status: "SUBMITTING", lastState: JSON.stringify({ effectivePrice }) });
    audit("operator", "order.submitting", { symbol: input.symbol, type: input.type, side: input.side, clientOrderId });
    const submissionStartedAt = Date.now();

    try {
      const params = buildOrderParams(input, clientOrderId);
      const order = input.emergencyClose
        ? await this.deps.rest.placeOrderEmergency(params)
        : await this.deps.rest.placeOrder(params);
      this.syncIntentFromOrder(clientOrderId, order);
      trackOrderSubmissionDuration(Date.now() - submissionStartedAt);
      trackOrderSubmitted(clientOrderId, input.symbol, input.side, input.type);

      audit("operator", "order.submitted", { symbol: input.symbol, clientOrderId, exchangeOrderId: order.orderId, status: order.status });
      this.deps.emit("order-update", { clientOrderId, status: order.status });
      return { ok: true, clientOrderId, status: order.status, exchangeOrderId: order.orderId };
    } catch (err) {
      trackOrderSubmissionDuration(Date.now() - submissionStartedAt);
      return this.handleSubmissionFailure(clientOrderId, input.symbol, err);
    }
  }

  private async handleSubmissionFailure(clientOrderId: string, symbol: string, err: unknown): Promise<OrderResult> {
    if (classifyBinanceError(err) === "unknown_outcome") {
      this.updateIntent(clientOrderId, {
        status: "UNCERTAIN",
        lastState: uncertainState(clientOrderId, { code: (err as BinanceApiError).code, msg: (err as BinanceApiError).exchangeMsg, httpStatus: (err as BinanceApiError).httpStatus }, this.persistenceProfile),
      });
      this.deps.freeze("order submission returned HTTP 5xx; outcome must be verified");
      audit("operator", "order.unknown_outcome", { symbol, clientOrderId, httpStatus: (err as BinanceApiError).httpStatus });
      void this.resolveUnknownOutcome(clientOrderId);
      return { ok: false, clientOrderId, error: "Order submission returned an uncertain exchange response; outcome is being resolved" };
    }
    if (err instanceof BinanceApiError) {
      if (err.code === ERR_INVALID_API_KEY) {
        // Fail closed: a rejected key usually means wrong environment scope.
        this.deps.freeze("Binance rejected the API key (-2015); check environment/key scope");
        this.updateIntent(clientOrderId, { status: "REJECTED", lastState: JSON.stringify({ code: err.code }) });
        audit("operator", "order.rejected.key", { symbol, clientOrderId, code: err.code });
        return { ok: false, clientOrderId, error: "Exchange rejected the API key; submissions frozen" };
      }
      this.updateIntent(clientOrderId, { status: "REJECTED", lastState: JSON.stringify({ code: err.code, msg: err.exchangeMsg }) });
      trackOrderRejected(clientOrderId, symbol, err.exchangeMsg);
      audit("operator", "order.rejected.exchange", { symbol, clientOrderId, code: err.code, msg: err.exchangeMsg });
      this.deps.emit("order-update", { clientOrderId, status: "REJECTED", error: err.exchangeMsg });
      return { ok: false, clientOrderId, error: `Exchange rejected the order: ${err.exchangeMsg}`, errorCode: err.code };
    }
    if (err instanceof TransportTimeoutError) {
      // Unknown outcome: never retry blindly. Persist uncertainty, freeze, resolve.
      this.updateIntent(clientOrderId, { status: "TIMEOUT_UNKNOWN", lastState: uncertainState(clientOrderId, {}, this.persistenceProfile) });
      this.deps.freeze("submission timeout: order outcome unknown until resolved");
      audit("operator", "order.timeout_unknown", { symbol, clientOrderId });
      void this.resolveUnknownOutcome(clientOrderId);
      return { ok: false, clientOrderId, error: "Submission timed out; outcome is being resolved against the exchange" };
    }
    // Infrastructure failure, not a business rejection: rethrow untouched so
    // runBrokerMutation can answer 503 circuit_open. Never recorded as REJECTED.
    if (err instanceof CircuitBreakerOpenError) throw err;
    this.updateIntent(clientOrderId, { status: "REJECTED", lastState: JSON.stringify({ error: String(err) }) });
    trackOrderRejected(clientOrderId, symbol, String(err));
    audit("operator", "order.rejected.transport", { symbol, clientOrderId, error: String(err) });
    return { ok: false, clientOrderId, error: `Order submission failed: ${String(err)}` };
  }

  /** Resolves TIMEOUT_UNKNOWN/CANCEL_UNKNOWN intents by querying exchange truth. */
  async resolveUnknownOutcome(clientOrderId: string, attempts = 3): Promise<void> {
    const intent = this.findIntent(clientOrderId);
    if (!intent) return;
    for (let i = 0; i < attempts; i++) {
      try {
        const order = await this.deps.rest.getOrder(intent.symbol, undefined, clientOrderId);
        if (order) {
          this.syncIntentFromOrder(clientOrderId, order);
          audit("operator", "order.resolved", { clientOrderId, status: order.status, attempt: i + 1 });
          this.deps.emit("order-update", { clientOrderId, status: order.status, resolved: true });
          this.maybeUnfreeze();
          return;
        }
        // -2013: exchange never recorded it (or it aged out).
        if (i === attempts - 1) {
          this.updateIntent(clientOrderId, { status: "REJECTED", lastState: JSON.stringify({ resolved: "not_found_on_exchange" }) });
          audit("operator", "order.resolved.not_found", { clientOrderId });
          this.deps.emit("order-update", { clientOrderId, status: "REJECTED", resolved: true });
          this.maybeUnfreeze();
          return;
        }
        await this.sleep(400 * (i + 1));
      } catch (err) {
        if (err instanceof BinanceApiError) {
          // A failed verification is itself uncertain. Never convert the
          // original mutation into a rejection without exchange truth.
          log.warn("resolveUnknownOutcome exchange query failed; leaving frozen", {
            clientOrderId,
            code: err.code,
            httpStatus: err.httpStatus,
            error: err.exchangeMsg,
          });
          return;
        }
        log.warn("resolveUnknownOutcome query failed; leaving to reconciliation", {
          clientOrderId,
          error: String(err),
        });
        return; // frozen; reconciliation will settle it.
      }
    }
  }

  private maybeUnfreeze(): void {
    if (this.uncertainIntents().length === 0) {
      this.deps.unfreeze?.();
      this.deps.emit("uncertainty-cleared", {});
    }
  }

  private syncIntentFromOrder(clientOrderId: string, order: BinanceOrder): void {
    rememberOrder(order);
    const status =
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
    this.updateIntent(clientOrderId, {
      status,
      exchangeOrderId: order.orderId,
      lastState: JSON.stringify({
        status: order.status,
        executedQty: order.executedQty,
        avgPrice: order.avgPrice ?? null,
        updateTime: order.updateTime,
      }),
    });
  }

  async cancelOrder(clientOrderId: string, symbol: string): Promise<OrderResult> {
    return withRiskMutation(() => this.cancelOrderSerialized(clientOrderId, symbol));
  }

  private async cancelOrderSerialized(clientOrderId: string, symbol: string): Promise<OrderResult> {
    const blocked = normalMutationBlock();
    if (blocked) return { ok: false, clientOrderId, error: blocked };
    const intent = this.findIntent(clientOrderId);
    if (!intent) {
      return { ok: false, clientOrderId, error: `No intent found for ${clientOrderId}` };
    }
    if (["FILLED", "CANCELED", "EXPIRED", "REJECTED"].includes(intent.status)) {
      return { ok: true, clientOrderId, status: intent.status, error: "already terminal" };
    }
    this.updateIntent(clientOrderId, { status: "CANCEL_REQUESTED" });
    audit("operator", "order.cancelling", { symbol, clientOrderId });
    try {
      const order = await this.deps.rest.cancelOrder(symbol, undefined, clientOrderId);
      this.syncIntentFromOrder(clientOrderId, order);
      trackOrderCanceled(clientOrderId, symbol);
      audit("operator", "order.cancelled", { symbol, clientOrderId, status: order.status });
      this.deps.emit("order-update", { clientOrderId, status: order.status });
      return { ok: true, clientOrderId, status: order.status, exchangeOrderId: order.orderId };
    } catch (err) {
      if (classifyBinanceError(err) === "unknown_outcome") {
        this.updateIntent(clientOrderId, {
          status: "CANCEL_UNKNOWN",
          lastState: JSON.stringify({ code: (err as BinanceApiError).code, msg: (err as BinanceApiError).exchangeMsg, httpStatus: (err as BinanceApiError).httpStatus }),
        });
        this.deps.freeze("cancel returned HTTP 5xx; outcome must be verified");
        audit("operator", "order.cancel.unknown_outcome", { symbol, clientOrderId, httpStatus: (err as BinanceApiError).httpStatus });
        void this.resolveUnknownOutcome(clientOrderId);
        return { ok: false, clientOrderId, error: "Cancel returned an uncertain exchange response; outcome is being resolved" };
      }
      if (err instanceof BinanceApiError && err.code === ERR_UNKNOWN_CANCEL) {
        // The order vanished before our cancel: determine what actually happened.
        try {
          const order = await this.deps.rest.getOrder(symbol, undefined, clientOrderId);
          if (order) {
            this.syncIntentFromOrder(clientOrderId, order);
            audit("operator", "order.cancel.race_resolved", { symbol, clientOrderId, status: order.status });
            this.deps.emit("order-update", { clientOrderId, status: order.status });
            return { ok: true, clientOrderId, status: order.status, exchangeOrderId: order.orderId };
          }
          this.updateIntent(clientOrderId, { status: "RESOLVED", lastState: JSON.stringify({ note: "unknown_cancel_not_found" }) });
          return { ok: true, clientOrderId, status: "RESOLVED" };
        } catch {
          this.updateIntent(clientOrderId, { status: "CANCEL_UNKNOWN" });
          this.deps.freeze("cancel outcome unknown; resolving via reconciliation");
          return { ok: false, clientOrderId, error: "Cancel outcome unknown; frozen until reconciliation" };
        }
      }
      if (err instanceof TransportTimeoutError) {
        this.updateIntent(clientOrderId, { status: "CANCEL_UNKNOWN" });
        this.deps.freeze("cancel request timed out; outcome unknown");
        audit("operator", "order.cancel.timeout_unknown", { symbol, clientOrderId });
        void this.resolveUnknownOutcome(clientOrderId);
        return { ok: false, clientOrderId, error: "Cancel timed out; outcome is being resolved" };
      }
      // Infrastructure failure, not a business rejection: rethrow untouched so
      // runBrokerMutation can answer 503 circuit_open. Intent stays live.
      if (err instanceof CircuitBreakerOpenError) throw err;
      const msg = err instanceof BinanceApiError ? err.exchangeMsg : String(err);
      this.updateIntent(clientOrderId, { status: "SUBMITTED", lastState: JSON.stringify({ cancelError: msg }) });
      return { ok: false, clientOrderId, error: `Cancel failed: ${msg}` };
    }
  }

  /** Emergency-only close using exchange truth and bypassing normal submission gates. */
  async emergencyClosePosition(symbol: string, positionAmt?: string): Promise<OrderResult> {
    return withRiskMutation(async () => {
      const rows = positionAmt
        ? [{ symbol, positionAmt }]
        : await this.deps.rest.getPositionRiskEmergency(symbol);
      const row = rows.find((candidate) => candidate.symbol === symbol && !isZero(parseDec(candidate.positionAmt)));
      if (!row) return { ok: true, clientOrderId: "", status: "NO_POSITION" };
      try {
        // Existing protective/reduce-only orders can reserve the position size and
        // cause Binance to reject this close with -2022. Cancel them before the
        // reduce-only market order so closing also cannot leave stale exits behind.
        await this.deps.rest.cancelAllOpenOrdersEmergency(symbol);
      } catch (err) {
        if (err instanceof CircuitBreakerOpenError) throw err;
        const message = err instanceof BinanceApiError ? err.exchangeMsg : String(err);
        return { ok: false, clientOrderId: "", error: `Unable to cancel existing orders for ${symbol}: ${message}` };
      }

      const amount = parseDec(row.positionAmt);
      const short = isNegative(amount);
      const qty = short ? toStr({ units: -amount.units, scale: amount.scale }) : toStr(amount);
      return submitCloseWithReduceOnlyFallback(
        (reduceOnly) =>
          this.submitOrderSerialized({
            symbol,
            side: short ? "BUY" : "SELL",
            type: "MARKET",
            qty,
            reduceOnly,
            emergencyClose: true,
            isClose: true,
            clientOrderId: newServerClientOrderId("em"),
          }),
        async () => {
          const [orders, rows] = await Promise.all([
            this.deps.rest.getOpenOrdersEmergency(symbol),
            this.deps.rest.getPositionRiskEmergency(symbol),
          ]);
          const row = rows.find((candidate) => candidate.symbol === symbol);
          return (
            orders.length === 0 &&
            row != null &&
            !isZero(parseDec(row.positionAmt)) &&
            isNegative(parseDec(row.positionAmt)) === short &&
            toStr(abs(parseDec(row.positionAmt))) === qty
          );
        },
      );
    });
  }

  /** Reduce-only market close of the exchange's current position. */
  async closePosition(symbol: string): Promise<OrderResult> {
    // Emergency closes must not rely on a stale stream snapshot. If the
    // exchange cannot provide position truth, fail closed and send no order.
    let rows;
    try {
      rows = await this.deps.rest.getPositionRisk(symbol);
    } catch (err) {
      if (err instanceof CircuitBreakerOpenError) throw err;
      return { ok: false, clientOrderId: "", error: `Unable to verify position for ${symbol}: ${String(err)}` };
    }
    const row = rows.find((candidate) => candidate.symbol === symbol && !isZero(parseDec(candidate.positionAmt)));
    if (!row) return { ok: false, clientOrderId: "", error: `No open position for ${symbol}` };

    const amount = parseDec(row.positionAmt);
    const short = isNegative(amount);
    const qty = short ? toStr({ units: -amount.units, scale: amount.scale }) : toStr(amount);
    // A normal UI close is still a live order submission. Only the explicit
    // emergency-flatten path may bypass the execution gates.
    return submitCloseWithReduceOnlyFallback(
      (reduceOnly) =>
        this.submitOrder({
          symbol,
          side: short ? "BUY" : "SELL",
          type: "MARKET",
          qty,
          reduceOnly,
          isClose: true,
          clientOrderId: newServerClientOrderId("cls"),
        }),
      async () => {
        const [orders, rows] = await Promise.all([
          this.deps.rest.getOpenOrders(symbol),
          this.deps.rest.getPositionRisk(symbol),
        ]);
        const row = rows.find((candidate) => candidate.symbol === symbol);
        return (
          orders.length === 0 &&
          row != null &&
          !isZero(parseDec(row.positionAmt)) &&
          isNegative(parseDec(row.positionAmt)) === short &&
          toStr(abs(parseDec(row.positionAmt))) === qty
        );
      },
    );
  }

  /**
   * Native protective orders: TAKE_PROFIT_MARKET / STOP_MARKET with
   * closePosition=true. These are genuine exchange conditional orders —
   * never simulated in the browser. Replacing cancels the existing one first.
   */
  async protectPosition(input: { symbol: string; tpPrice?: string; slPrice?: string }): Promise<{ tp?: OrderResult; sl?: OrderResult }> {
    const failed = (error: string): OrderResult => ({ ok: false, clientOrderId: "", error });
    if (normalMutationBlock()) {
      const result = failed(normalMutationBlock()!);
      return {
        ...(input.tpPrice ? { tp: result } : {}),
        ...(input.slPrice ? { sl: result } : {}),
      };
    }
    const pos = liveState().positions.get(input.symbol);
    if (!pos) {
      const result = failed(`No open position for ${input.symbol}`);
      return {
        ...(input.tpPrice ? { tp: result } : {}),
        ...(input.slPrice ? { sl: result } : {}),
      };
    }
    try {
      requireSubmissionAllowed(this.deps.cfg);
    } catch (err) {
      if (err instanceof SubmissionBlockedError) {
        const result = failed(err.message);
        return {
          ...(input.tpPrice ? { tp: result } : {}),
          ...(input.slPrice ? { sl: result } : {}),
        };
      }
      throw err;
    }

    const reference = await (this.deps.getMarkPrice?.(input.symbol) ?? this.deps.getReferencePrice(input.symbol));
    if (!reference || !Number.isFinite(Number(reference.price)) || Number(reference.price) <= 0) {
      const result = failed(`No current mark price available for ${input.symbol}`);
      return {
        ...(input.tpPrice ? { tp: result } : {}),
        ...(input.slPrice ? { sl: result } : {}),
      };
    }
    if (Date.now() - reference.at > STALE_REFERENCE_MS) {
      const result = failed(`Current mark price for ${input.symbol} is stale`);
      return {
        ...(input.tpPrice ? { tp: result } : {}),
        ...(input.slPrice ? { sl: result } : {}),
      };
    }

    const mark = Number(reference.price);
    const tp = input.tpPrice == null ? null : Number(input.tpPrice);
    const sl = input.slPrice == null ? null : Number(input.slPrice);
    const directionErrors: { tp?: string; sl?: string } = {};
    if (tp != null && !Number.isFinite(tp)) directionErrors.tp = "TP price must be finite";
    if (sl != null && !Number.isFinite(sl)) directionErrors.sl = "SL price must be finite";
    if (pos.side === "long") {
      if (tp != null && Number.isFinite(tp) && tp < mark) directionErrors.tp = `Long TP must be at or above mark price ${reference.price}`;
      if (sl != null && Number.isFinite(sl) && sl > mark) directionErrors.sl = `Long SL must be at or below mark price ${reference.price}`;
    } else {
      if (tp != null && Number.isFinite(tp) && tp > mark) directionErrors.tp = `Short TP must be at or below mark price ${reference.price}`;
      if (sl != null && Number.isFinite(sl) && sl < mark) directionErrors.sl = `Short SL must be at or above mark price ${reference.price}`;
    }
    if (directionErrors.tp || directionErrors.sl) {
      return {
        ...(input.tpPrice ? { tp: directionErrors.tp ? failed(directionErrors.tp) : undefined } : {}),
        ...(input.slPrice ? { sl: directionErrors.sl ? failed(directionErrors.sl) : undefined } : {}),
      };
    }

    const closeSide = pos.side === "long" ? "SELL" : "BUY";
    const out: { tp?: OrderResult; sl?: OrderResult } = {};

    // Each replacement is fail-closed: a failed/uncertain cancellation leaves
    // the old protective order in place and prevents its replacement.
    const cancelExisting = async (type: string): Promise<string | null> => {
      for (const o of liveState().openOrders.values()) {
        if (o.symbol === input.symbol && o.type === type && o.closePosition) {
          const result = await this.cancelOrder(o.clientOrderId, input.symbol);
          if (!result.ok) return result.error ?? `Could not cancel existing ${type}`;
        }
      }
      return null;
    };

    if (input.tpPrice) {
      const cancelError = await cancelExisting("TAKE_PROFIT_MARKET");
      out.tp = cancelError
        ? failed(`Protective TP replacement blocked: ${cancelError}`)
        : await this.submitOrder({
            symbol: input.symbol,
            side: closeSide,
            type: "TAKE_PROFIT_MARKET",
            stopPrice: input.tpPrice,
            closePosition: true,
            kind: "algo",
            clientOrderId: newServerClientOrderId("tp"),
          });
    }
    if (input.slPrice) {
      const cancelError = await cancelExisting("STOP_MARKET");
      out.sl = cancelError
        ? failed(`Protective SL replacement blocked: ${cancelError}`)
        : await this.submitOrder({
            symbol: input.symbol,
            side: closeSide,
            type: "STOP_MARKET",
            stopPrice: input.slPrice,
            closePosition: true,
            kind: "algo",
            clientOrderId: newServerClientOrderId("sl"),
          });
    }
    return out;
  }
}

interface OrderInputValidation {
  errors: string[];
  recordRejection: boolean;
}

function validateOrderInput(input: SubmitOrderInput, constraints: SymbolConstraints | null): OrderInputValidation | null {
  if (!input.emergencyClose) {
    const errors = validateAgainstConstraints(constraints!, {
      symbol: input.symbol,
      type: input.type,
      price: input.price,
      stopPrice: input.stopPrice,
      qty: input.closePosition ? undefined : input.qty,
    });
    if (!input.closePosition && !input.qty) errors.push("qty is required");
    return errors.length > 0 ? { errors, recordRejection: true } : null;
  }
  if (!input.qty || input.closePosition || (!input.reduceOnly && !input.isClose) || input.type !== "MARKET") {
    return { errors: ["Emergency close requires an explicit reduce-only MARKET quantity"], recordRejection: false };
  }
  return null;
}

function buildOrderParams(input: SubmitOrderInput, clientOrderId: string) {
  return {
    symbol: input.symbol,
    side: input.side,
    type: input.type,
    quantity: input.closePosition ? undefined : input.qty,
    price: input.price,
    stopPrice: input.stopPrice,
    closePosition: input.closePosition || undefined,
    reduceOnly: input.reduceOnly || undefined,
    timeInForce: input.type === "LIMIT" ? "GTC" : undefined,
    clientOrderId,
  };
}

function uncertainState(clientOrderId: string, patch: Record<string, unknown>, profile: PersistenceProfile): string {
  const intent = findIntentByClientOrderId(clientOrderId, profile);
  let prior: Record<string, unknown> = {};
  try {
    prior = JSON.parse(intent?.lastState ?? "{}") as Record<string, unknown>;
  } catch {
    // Preserve the uncertainty even if an older state payload was malformed.
  }
  return JSON.stringify({ ...prior, ...patch });
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
