import "server-only";

import crypto from "node:crypto";

import { getDb } from "../db/connection";
import { log } from "../log/logger";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

/**
 * DB-backed lease ensuring exactly one server process owns the user-data
 * stream (listen key, reconnects, reconciliation) at any time.
 */
export class StreamOwnerLease {
  readonly ownerId = crypto.randomBytes(8).toString("hex");
  private holder = false;

  constructor(
    private readonly leaseKey: string,
    private readonly ttlMs: number,
    private readonly persistenceProfile: PersistenceProfile = activePersistenceProfile(),
  ) {
    assertPersistenceProfile(persistenceProfile);
  }

  tryAcquire(now = Date.now()): boolean {
    assertPersistenceProfile(this.persistenceProfile);
    const db = getDb();
    const row = db.prepare(`SELECT owner, expires_at FROM stream_owner_lease WHERE profile_id = ? AND lease_key = ?`).get(this.persistenceProfile.id, this.leaseKey) as
      | { owner: string; expires_at: number }
      | undefined;
    if (row && row.expires_at > now && row.owner !== this.ownerId) {
      return false;
    }
    db.prepare(
      `INSERT INTO stream_owner_lease (profile_id, lease_key, owner, acquired_at, expires_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(profile_id, lease_key) DO UPDATE SET owner = excluded.owner, acquired_at = excluded.acquired_at, expires_at = excluded.expires_at`,
    ).run(this.persistenceProfile.id, this.leaseKey, this.ownerId, now, now + this.ttlMs);
    this.holder = true;
    log.info("stream lease acquired", { owner: this.ownerId });
    return true;
  }

  renew(now = Date.now()): boolean {
    assertPersistenceProfile(this.persistenceProfile);
    if (!this.holder) return false;
    const res = getDb()
      .prepare(`UPDATE stream_owner_lease SET expires_at = ? WHERE profile_id = ? AND lease_key = ? AND owner = ?`)
      .run(now + this.ttlMs, this.persistenceProfile.id, this.leaseKey, this.ownerId);
    if (res.changes === 0) {
      this.holder = false;
      log.warn("stream lease lost");
      return false;
    }
    return true;
  }

  release(): void {
    assertPersistenceProfile(this.persistenceProfile);
    if (!this.holder) return;
    getDb().prepare(`DELETE FROM stream_owner_lease WHERE profile_id = ? AND lease_key = ? AND owner = ?`).run(this.persistenceProfile.id, this.leaseKey, this.ownerId);
    this.holder = false;
    log.info("stream lease released", { owner: this.ownerId });
  }

  isOwner(): boolean {
    return this.holder;
  }
}
