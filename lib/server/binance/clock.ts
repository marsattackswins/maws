import "server-only";

import { getDb } from "../db/connection";
import { log } from "../log/logger";
import { setHealthSignal } from "../health/state";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

export interface ClockState {
  offsetMs: number;
  rttMs: number;
  samples: number;
  updatedAt: number;
}

export interface TimeFetcher {
  (): Promise<number>;
}

const STALE_MS = 5 * 60 * 1000;
const MAX_OFFSET_MS = 1000;

let state: ClockState | null = null;

export function clockState(): ClockState | null {
  return state;
}

/** Timestamp corrected for measured exchange/local skew. */
export function getTimestamp(now = Date.now()): number {
  return now + (state?.offsetMs ?? 0);
}

export function clockIsHealthy(now = Date.now()): boolean {
  return (
    state != null && now - state.updatedAt < STALE_MS && Math.abs(state.offsetMs) <= MAX_OFFSET_MS
  );
}

/** Median of N samples of (serverTime - midpoint(localSend, localRecv)). */
export async function syncClock(
  fetchTime: TimeFetcher,
  samples = 3,
  isCurrent?: () => boolean,
  profile: PersistenceProfile = activePersistenceProfile(),
): Promise<ClockState> {
  assertPersistenceProfile(profile);
  const offsets: number[] = [];
  let rttTotal = 0;
  for (let i = 0; i < samples; i++) {
    const t0 = Date.now();
    const serverTime = await fetchTime();
    if (isCurrent && !isCurrent()) throw new Error("clock sync cancelled");
    const t1 = Date.now();
    offsets.push(serverTime - (t0 + t1) / 2);
    rttTotal += t1 - t0;
  }
  if (isCurrent && !isCurrent()) throw new Error("clock sync cancelled");
  offsets.sort((a, b) => a - b);
  const offsetMs = Math.round(offsets[Math.floor(offsets.length / 2)]);
  state = {
    offsetMs,
    rttMs: Math.round(rttTotal / samples),
    samples,
    updatedAt: Date.now(),
  };
  setHealthSignal({ clock: state });
  try {
    assertPersistenceProfile(profile);
    getDb()
      .prepare(
        `INSERT INTO exchange_clock (profile_id, id, offset_ms, rtt_ms, samples, updated_at)
         VALUES (?, 1, ?, ?, ?, ?)
         ON CONFLICT(profile_id) DO UPDATE SET id = excluded.id, offset_ms = excluded.offset_ms,
           rtt_ms = excluded.rtt_ms, samples = excluded.samples, updated_at = excluded.updated_at`,
      )
      .run(profile.id, state.offsetMs, state.rttMs, state.samples, state.updatedAt);
  } catch (err) {
    log.warn("clock persistence failed", { error: String(err) });
  }
  log.info("clock synced", { offsetMs: state.offsetMs, rttMs: state.rttMs });
  return state;
}

export function clockNeedsSync(now = Date.now()): boolean {
  return !clockIsHealthy(now);
}

export function resetClockForTests(): void {
  state = null;
}
