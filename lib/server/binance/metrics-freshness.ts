import "server-only";

/**
 * Income-sync staleness tracking, kept separate from ledger state itself.
 *
 * The durable ledger (account_income) is never reset by a failed sync — it
 * is the settlement of record. But when the sync that would refresh it
 * fails, the UI must be able to distinguish "current" from "retained but
 * possibly outdated". This module tracks exactly that flag, process-wide.
 */

let syncFailedSinceLastSuccess = false;

/** Called when an income sync attempt completes with an error. */
export function markIncomeSyncFailed(): void {
  syncFailedSinceLastSuccess = true;
}

/** Called when an income sync attempt succeeds (even with zero new rows). */
export function markIncomeSyncSucceeded(): void {
  syncFailedSinceLastSuccess = false;
}

/** True while the last sync attempt failed (previous totals are retained but stale). */
export function incomeSyncIsStale(): boolean {
  return syncFailedSinceLastSuccess;
}

/** Test seam. */
export function resetIncomeSyncFreshnessForTests(): void {
  syncFailedSinceLastSuccess = false;
}
