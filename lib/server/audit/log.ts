import "server-only";

import { getDb } from "../db/connection";
import { redactJson } from "./redact";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

export function audit(
  actor: string,
  action: string,
  detail?: unknown,
  ip?: string | null,
  profile: PersistenceProfile = activePersistenceProfile(),
): void {
  assertPersistenceProfile(profile);
  getDb()
    .prepare(`INSERT INTO audit_log (ts, actor, action, detail, ip, profile_id) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(Date.now(), actor, action, redactJson(detail ?? {}), ip ?? null, profile.id);
}

export function recentAudit(
  limit = 50,
  profile: PersistenceProfile = activePersistenceProfile(),
): Array<{ ts: number; actor: string; action: string; detail: string; ip: string | null }> {
  assertPersistenceProfile(profile);
  return getDb()
    .prepare(`SELECT ts, actor, action, detail, ip FROM audit_log WHERE profile_id = ? ORDER BY id DESC LIMIT ?`)
    .all(profile.id, limit) as Array<{ ts: number; actor: string; action: string; detail: string; ip: string | null }>;
}
