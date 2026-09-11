import "server-only";

import { getDb } from "../db/connection";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

export const RUNTIME_KEYS = {
  executionEnabled: "execution_enabled",
  killSwitch: "kill_switch",
  frozen: "frozen",
  frozenReason: "frozen_reason",
  connectedBroker: "connected_broker",
} as const;

export function getRuntime(
  key: string,
  fallback = "",
  profile: PersistenceProfile = activePersistenceProfile(),
): string {
  assertPersistenceProfile(profile);
  const row = getDb().prepare(`SELECT value FROM runtime_config WHERE profile_id = ? AND key = ?`).get(profile.id, key) as
    | { value: string }
    | undefined;
  return row?.value ?? fallback;
}

export function setRuntime(
  key: string,
  value: string,
  now = Date.now(),
  profile: PersistenceProfile = activePersistenceProfile(),
): void {
  assertPersistenceProfile(profile);
  getDb()
    .prepare(
      `INSERT INTO runtime_config (profile_id, key, value, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(profile_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .run(profile.id, key, value, now);
}

export function allRuntime(profile: PersistenceProfile = activePersistenceProfile()): Record<string, string> {
  assertPersistenceProfile(profile);
  const rows = getDb().prepare(`SELECT key, value FROM runtime_config WHERE profile_id = ?`).all(profile.id) as Array<{ key: string; value: string }>;
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
