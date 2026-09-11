import "server-only";

import { audit } from "../audit/log";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";
import { findByClientOrderId, updateIntent } from "./intents";
import type { BinanceOrder } from "./types";
import type { OrderResult } from "./orders";

export interface EmergencyPosition {
  symbol: string;
  positionAmt: string;
}

export interface EmergencyFlattenDeps {
  getOpenOrders(): Promise<BinanceOrder[]>;
  getOpenPositions(): Promise<EmergencyPosition[]>;
  cancelAllOpenOrders(symbol: string): Promise<BinanceOrder[]>;
  closePosition(symbol: string, positionAmt: string): Promise<OrderResult>;
}

export interface EmergencyFlattenFailure {
  action: "snapshot_orders" | "cancel_orders" | "close_position";
  symbol?: string;
  error: string;
}

export interface EmergencyFlattenSummary {
  accountId: string;
  triggeredBy: string;
  startedAt: number;
  finishedAt: number;
  canceledOrderIds: string[];
  closedPositions: Array<{ symbol: string; result: OrderResult }>;
  failures: EmergencyFlattenFailure[];
}

const inFlight = new Map<string, Promise<EmergencyFlattenSummary>>();

/**
 * Emergency action only. It intentionally does not call normal order
 * submission/cancellation methods, so kill switches, uncertainty freezes, and
 * normal circuit breakers cannot prevent an attempt to reduce exposure.
 */
export function cancelAllAndFlatten(
  accountId: string,
  deps: EmergencyFlattenDeps,
  triggeredBy: string,
  profile: PersistenceProfile = activePersistenceProfile(),
): Promise<EmergencyFlattenSummary> {
  assertPersistenceProfile(profile);
  const existing = inFlight.get(accountId);
  if (existing) return existing;

  const run = executeFlatten(accountId, deps, triggeredBy, profile);
  inFlight.set(accountId, run);
  void run.finally(() => {
    if (inFlight.get(accountId) === run) inFlight.delete(accountId);
  });
  return run;
}

async function executeFlatten(
  accountId: string,
  deps: EmergencyFlattenDeps,
  triggeredBy: string,
  profile: PersistenceProfile,
): Promise<EmergencyFlattenSummary> {
  assertPersistenceProfile(profile);
  const startedAt = Date.now();
  const canceledOrderIds: string[] = [];
  const closedPositions: Array<{ symbol: string; result: OrderResult }> = [];
  const failures: EmergencyFlattenFailure[] = [];

  audit("operator", "emergency.flatten.started", { accountId, triggeredBy, startedAt });

  let openOrders: BinanceOrder[] = [];
  try {
    openOrders = await deps.getOpenOrders();
  } catch (err) {
    failures.push({ action: "snapshot_orders", error: String(err) });
    audit("operator", "emergency.flatten.failure", { accountId, triggeredBy, action: "snapshot_orders", error: String(err) });
  }

  await cancelOpenOrders(accountId, deps, triggeredBy, openOrders, canceledOrderIds, failures, profile);

  let positions: EmergencyPosition[] = [];
  try {
    positions = await deps.getOpenPositions();
  } catch (err) {
    failures.push({ action: "close_position", error: `Unable to snapshot positions: ${String(err)}` });
    audit("operator", "emergency.flatten.failure", { accountId, triggeredBy, action: "close_position", error: String(err) });
  }

  await closeOpenPositions(accountId, deps, triggeredBy, positions, closedPositions, failures, profile);

  const finishedAt = Date.now();
  const summary = { accountId, triggeredBy, startedAt, finishedAt, canceledOrderIds, closedPositions, failures };
  audit("operator", "emergency.flatten.completed", summary);
  return summary;
}

async function cancelOpenOrders(
  accountId: string,
  deps: EmergencyFlattenDeps,
  triggeredBy: string,
  openOrders: BinanceOrder[],
  canceledOrderIds: string[],
  failures: EmergencyFlattenFailure[],
  profile: PersistenceProfile,
): Promise<void> {
  assertPersistenceProfile(profile);
  const symbols = [...new Set(openOrders.map((order) => order.symbol))];
  for (const symbol of symbols) {
    try {
      const canceled = await deps.cancelAllOpenOrders(symbol);
      for (const order of canceled.length > 0 ? canceled : openOrders.filter((order) => order.symbol === symbol)) {
        canceledOrderIds.push(order.clientOrderId);
        const intent = findByClientOrderId(order.clientOrderId, profile);
        if (intent && !["FILLED", "REJECTED", "EXPIRED"].includes(intent.status)) {
          updateIntent(order.clientOrderId, { status: "CANCELED", exchangeOrderId: order.orderId, lastState: JSON.stringify({ source: "emergency_flatten" }) }, Date.now(), profile);
        }
      }
      audit("operator", "emergency.orders.cancelled", { accountId, triggeredBy, symbol, count: canceled.length });
    } catch (err) {
      failures.push({ action: "cancel_orders", symbol, error: String(err) });
      audit("operator", "emergency.flatten.failure", { accountId, triggeredBy, action: "cancel_orders", symbol, error: String(err) });
    }
  }
}

async function closeOpenPositions(
  accountId: string,
  deps: EmergencyFlattenDeps,
  triggeredBy: string,
  positions: EmergencyPosition[],
  closedPositions: Array<{ symbol: string; result: OrderResult }>,
  failures: EmergencyFlattenFailure[],
  profile: PersistenceProfile,
): Promise<void> {
  assertPersistenceProfile(profile);
  for (const position of positions) {
    try {
      const result = await deps.closePosition(position.symbol, position.positionAmt);
      closedPositions.push({ symbol: position.symbol, result });
      if (!result.ok && result.status !== "NO_POSITION") {
        failures.push({ action: "close_position", symbol: position.symbol, error: result.error ?? "close rejected" });
      }
      audit("operator", result.ok ? "emergency.position.close_submitted" : "emergency.flatten.failure", {
        accountId,
        triggeredBy,
        symbol: position.symbol,
        clientOrderId: result.clientOrderId,
        status: result.status,
        error: result.error,
      });
    } catch (err) {
      failures.push({ action: "close_position", symbol: position.symbol, error: String(err) });
      audit("operator", "emergency.flatten.failure", { accountId, triggeredBy, action: "close_position", symbol: position.symbol, error: String(err) });
    }
  }
}

export function resetEmergencyForTests(): void {
  inFlight.clear();
}
