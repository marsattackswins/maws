import "server-only";

export interface ClockSignal {
  offsetMs: number;
  rttMs: number;
  samples: number;
  updatedAt: number;
}

export interface StreamSignal {
  connected: boolean;
  /** True only while this process owns the DB-backed stream lease. */
  leaseOwned?: boolean;
  phase?: string;
  startedAt: number | null;
  lastEventAt: number | null;
  lastApplicationEventAt?: number | null;
  reconnects: number;
  listenKeyRenewedAt: number | null;
  generation?: number;
  bufferOverflow?: boolean;
  circuitState?: string;
}

export interface ReconSignal {
  lastRunAt: number | null;
  lastResult: "ok" | "drift" | "error" | null;
  driftCount: number;
}

export type PositionMode = "one-way" | "hedge" | "unknown";

export interface PositionModeSignal {
  mode: PositionMode;
  checkedAt: number | null;
  error: string | null;
}

export interface HealthSignals {
  managerRunning: boolean;
  brokerStatus: "idle" | "starting" | "ready" | "error";
  brokerError: string | null;
  clock: ClockSignal | null;
  stream: StreamSignal | null;
  snapshot: { fetchedAt: number } | null;
  recon: ReconSignal;
  positionMode: PositionModeSignal;
}

const signals: HealthSignals = {
  managerRunning: false,
  brokerStatus: "idle",
  brokerError: null,
  clock: null,
  stream: null,
  snapshot: null,
  recon: { lastRunAt: null, lastResult: null, driftCount: 0 },
  positionMode: { mode: "unknown", checkedAt: null, error: null },
};

export function healthSignals(): HealthSignals {
  return signals;
}

export function setHealthSignal(patch: Partial<HealthSignals>): void {
  Object.assign(signals, patch);
}

export function resetHealthSignals(): void {
  signals.managerRunning = false;
  signals.brokerStatus = "idle";
  signals.brokerError = null;
  signals.clock = null;
  signals.stream = null;
  signals.snapshot = null;
  signals.recon = { lastRunAt: null, lastResult: null, driftCount: 0 };
  signals.positionMode = { mode: "unknown", checkedAt: null, error: null };
}

export function resetHealthSignalsForTests(): void {
  resetHealthSignals();
}
