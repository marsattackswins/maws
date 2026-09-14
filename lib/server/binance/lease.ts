import "server-only";

import crypto from "node:crypto";

import { getDb } from "../db/connection";
import { log } from "../log/logger";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

/** Owner strings carry the holder PID (`<random>:<pid>`) for staleness checks. */
function ownerPid(owner: string): number | null {
  const idx = owner.lastIndexOf(":");
  const pid = idx >= 0 ? Number(owner.slice(idx + 1)) : NaN;
  return Number.isInteger(pid) && pid > 0 ? pid : null;
}

/** True when a process with this PID exists (EPERM means it exists but is not ours to signal). */
function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === "EPERM";
  }
}

/**
 * DB-backed lease ensuring exactly one server process owns the user-data
 * stream (listen key, reconnects, reconciliation) at any time.
 */
export class StreamOwnerLease {
  readonly ownerId = `${crypto.randomBytes(8).toString("hex")}:${process.pid}`;
  private holder = false;
  private readonly exitHandler = (): void => {
    this.release();
  };

  constructor(
    private readonly leaseKey: string,
    private readonly ttlMs: number,
    private readonly persistenceProfile: PersistenceProfile = activePersistenceProfile(),
  ) {
    assertPersistenceProfile(persistenceProfile);
  }

  /**
   * Take over a stale lease: if the recorded holder's process no longer exists,
   * its lease is dead weight regardless of TTL (crashed process, Windows
   * Ctrl+C/terminal close that skipped signal handlers). A LIVE holder — a
   * second server someone actually started — still blocks, keeping the
   * one-instance guarantee intact.
   */
  private clearStaleHolder(now = Date.now()): void {
    const current = getDb()
      .prepare(`SELECT owner, expires_at FROM stream_owner_lease WHERE profile_id = ? AND lease_key = ?`)
      .get(this.persistenceProfile.id, this.leaseKey) as { owner: string; expires_at: number } | undefined;
    if (!current || current.owner === this.ownerId) return;
    if (current.expires_at <= now) return; // already expired; normal takeover applies
    const pid = ownerPid(current.owner);
    if (pid === null || pid === process.pid || pidAlive(pid)) return;
    log.warn("stale stream lease holder is gone; taking over immediately", { stalePid: pid });
    getDb()
      .prepare(`DELETE FROM stream_owner_lease WHERE profile_id = ? AND lease_key = ?`)
      .run(this.persistenceProfile.id, this.leaseKey);
  }

  tryAcquire(now = Date.now()): boolean {
    assertPersistenceProfile(this.persistenceProfile);
    this.clearStaleHolder(now);
    const result = getDb()
      .prepare(
        `INSERT INTO stream_owner_lease (profile_id, lease_key, owner, acquired_at, expires_at) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(profile_id, lease_key) DO UPDATE SET owner = excluded.owner, acquired_at = excluded.acquired_at, expires_at = excluded.expires_at
         WHERE stream_owner_lease.expires_at <= excluded.acquired_at OR stream_owner_lease.owner = excluded.owner`,
      )
      .run(this.persistenceProfile.id, this.leaseKey, this.ownerId, now, now + this.ttlMs);
    if (result.changes === 0) return false;
    this.holder = true;
    process.once("exit", this.exitHandler);
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
    process.removeListener("exit", this.exitHandler);
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
