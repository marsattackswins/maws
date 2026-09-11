import "server-only";

import { getDb } from "../db/connection";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

export type IntentStatus =
  | "CREATED"
  | "SUBMITTING"
  | "SUBMITTED"
  | "CANCEL_REQUESTED"
  | "CANCEL_UNKNOWN"
  | "TIMEOUT_UNKNOWN"
  | "UNCERTAIN"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELED"
  | "REJECTED"
  | "EXPIRED"
  | "RESOLVED";

export interface OrderIntent {
  id: number;
  clientOrderId: string;
  clientAlgoId: string | null;
  kind: "order" | "algo";
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  qty: string;
  price: string | null;
  stopPrice: string | null;
  reduceOnly: boolean;
  status: IntentStatus;
  exchangeOrderId: number | null;
  lastState: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface NewIntent {
  clientOrderId: string;
  clientAlgoId?: string;
  kind: "order" | "algo";
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  qty: string;
  price?: string | null;
  stopPrice?: string | null;
  reduceOnly?: boolean;
}

const ACTIVE_STATUSES: IntentStatus[] = [
  "CREATED",
  "SUBMITTING",
  "SUBMITTED",
  "CANCEL_REQUESTED",
  "CANCEL_UNKNOWN",
  "TIMEOUT_UNKNOWN",
  "UNCERTAIN",
  "PARTIALLY_FILLED",
];

function rowToIntent(r: Record<string, unknown>): OrderIntent {
  return {
    id: r.id as number,
    clientOrderId: r.client_order_id as string,
    clientAlgoId: (r.client_algo_id as string | null) ?? null,
    kind: r.kind as "order" | "algo",
    symbol: r.symbol as string,
    side: r.side as "BUY" | "SELL",
    type: r.type as string,
    qty: r.qty as string,
    price: (r.price as string | null) ?? null,
    stopPrice: (r.stop_price as string | null) ?? null,
    reduceOnly: (r.reduce_only as number) === 1,
    status: r.status as IntentStatus,
    exchangeOrderId: (r.exchange_order_id as number | null) ?? null,
    lastState: (r.last_state as string | null) ?? null,
    createdAt: r.created_at as number,
    updatedAt: r.updated_at as number,
  };
}

/**
 * Persists the intent BEFORE any exchange submission. The UNIQUE
 * client_order_id constraint is the duplicate-prevention backstop: a second
 * insert for the same id returns the existing intent instead of creating one.
 */
export function createIntent(
  input: NewIntent,
  now = Date.now(),
  profile: PersistenceProfile = activePersistenceProfile(),
): { intent: OrderIntent; duplicate: boolean } {
  assertPersistenceProfile(profile);
  const db = getDb();
  const existing = findByClientOrderId(input.clientOrderId, profile);
  if (existing) return { intent: existing, duplicate: true };
  try {
    const res = db
      .prepare(
        `INSERT INTO order_intents
           (profile_id, client_order_id, client_algo_id, kind, symbol, side, type, qty, price, stop_price, reduce_only, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CREATED', ?, ?)`,
      )
      .run(
        profile.id,
        input.clientOrderId,
        input.clientAlgoId ?? null,
        input.kind,
        input.symbol,
        input.side,
        input.type,
        input.qty,
        input.price ?? null,
        input.stopPrice ?? null,
        input.reduceOnly ? 1 : 0,
        now,
        now,
      );
    const intent = db.prepare(`SELECT * FROM order_intents WHERE id = ? AND profile_id = ?`).get(res.lastInsertRowid, profile.id) as Record<string, unknown>;
    return { intent: rowToIntent(intent), duplicate: false };
  } catch (err) {
    if (String(err).includes("UNIQUE")) {
      const dup = findByClientOrderId(input.clientOrderId, profile);
      if (dup) return { intent: dup, duplicate: true };
    }
    throw err;
  }
}

export function updateIntent(
  clientOrderId: string,
  patch: Partial<Pick<OrderIntent, "status" | "exchangeOrderId" | "lastState">>,
  now = Date.now(),
  profile: PersistenceProfile = activePersistenceProfile(),
): void {
  assertPersistenceProfile(profile);
  const db = getDb();
  const sets: string[] = ["updated_at = ?"];
  const args: unknown[] = [now];
  if (patch.status !== undefined) {
    sets.push("status = ?");
    args.push(patch.status);
  }
  if (patch.exchangeOrderId !== undefined) {
    sets.push("exchange_order_id = ?");
    args.push(patch.exchangeOrderId);
  }
  if (patch.lastState !== undefined) {
    sets.push("last_state = ?");
    args.push(patch.lastState);
  }
  args.push(clientOrderId, profile.id);
  db.prepare(`UPDATE order_intents SET ${sets.join(", ")} WHERE client_order_id = ? AND profile_id = ?`).run(...args);
}

export function findByClientOrderId(
  clientOrderId: string,
  profile: PersistenceProfile = activePersistenceProfile(),
): OrderIntent | null {
  assertPersistenceProfile(profile);
  const row = getDb().prepare(`SELECT * FROM order_intents WHERE client_order_id = ? AND profile_id = ?`).get(clientOrderId, profile.id) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToIntent(row) : null;
}

export function findByExchangeOrderId(
  exchangeOrderId: number,
  profile: PersistenceProfile = activePersistenceProfile(),
): OrderIntent | null {
  assertPersistenceProfile(profile);
  const row = getDb().prepare(`SELECT * FROM order_intents WHERE exchange_order_id = ? AND profile_id = ?`).get(String(exchangeOrderId), profile.id) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToIntent(row) : null;
}

export function findActiveIntents(profile: PersistenceProfile = activePersistenceProfile()): OrderIntent[] {
  assertPersistenceProfile(profile);
  const placeholders = ACTIVE_STATUSES.map(() => "?").join(", ");
  const rows = getDb()
    .prepare(`SELECT * FROM order_intents WHERE profile_id = ? AND status IN (${placeholders}) ORDER BY id`)
    .all(profile.id, ...ACTIVE_STATUSES) as Record<string, unknown>[];
  return rows.map(rowToIntent);
}

export function recentIntents(limit = 50, profile: PersistenceProfile = activePersistenceProfile()): OrderIntent[] {
  assertPersistenceProfile(profile);
  const rows = getDb().prepare(`SELECT * FROM order_intents WHERE profile_id = ? ORDER BY id DESC LIMIT ?`).all(profile.id, limit) as Record<string, unknown>[];
  return rows.map(rowToIntent);
}

export function intentsInUncertainStates(profile: PersistenceProfile = activePersistenceProfile()): OrderIntent[] {
  assertPersistenceProfile(profile);
  const states: IntentStatus[] = ["CREATED", "CANCEL_REQUESTED", "CANCEL_UNKNOWN", "TIMEOUT_UNKNOWN", "UNCERTAIN", "SUBMITTING"];
  const placeholders = states.map(() => "?").join(", ");
  const rows = getDb()
    .prepare(`SELECT * FROM order_intents WHERE profile_id = ? AND status IN (${placeholders}) ORDER BY id`)
    .all(profile.id, ...states) as Record<string, unknown>[];
  return rows.map(rowToIntent);
}
