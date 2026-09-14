/** Client-side mirror of the server DTOs. Never imports server-only code. */

export type LiveProfileId = "paper" | "binance-testnet" | "binance-production";
export type LiveProfileEnvironment = "paper" | "testnet" | "production";
export type LiveProfilePhase = "idle" | "switching" | "ready" | "degraded" | "detached" | "failed";

export interface ProfileRuntimeStatusDto {
  profileId: LiveProfileId | null;
  environment: LiveProfileEnvironment | null;
  phase: LiveProfilePhase;
  ready: boolean;
  managerStatus: string;
  managerError?: string | null;
  streamHealthy: boolean | null;
  executionAllowed: boolean;
  generation: number;
  reasonCode: string | null;
}

export interface ProfileMetadataDto {
  profileId: LiveProfileId;
  label: string;
  environment: LiveProfileEnvironment;
  configured: boolean;
  requiresProductionConfirmation: boolean;
  executionEnabled: boolean;
}

export interface SessionInfo {
  authenticated: boolean;
  csrf?: string;
  env: string;
  envLabel?: string;
  connectedBroker?: string;
  sessionExpiresAt?: number;
}

export interface AccountDto {
  balance: number;
  available: number;
  equity: number;
  margin: number;
  unrealized: number;
  fetchedAt: number | null;
}

export interface PositionDto {
  id: string;
  symbol: string;
  side: "long" | "short";
  entry: number;
  qty: number;
  tp: number | null;
  sl: number | null;
  leverage: number;
  liq: number | null;
  mark: number;
  unrealized: number;
  openedAt: number;
}

export interface OrderDto {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "limit" | "stop";
  price: number;
  qty: number;
  reduceOnly: boolean;
  closePosition: boolean;
  time: number;
}

export interface FillDto {
  ts: number;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  realizedPnl: number;
}

export interface LiveStateDto {
  account: AccountDto;
  positions: PositionDto[];
  orders: OrderDto[];
  fills: FillDto[];
}

export interface ExecutionDecisionDto {
  env: string;
  envAllowsSubmissions: boolean;
  profileExecutionEnabled: boolean;
  runtimeEnabled: boolean;
  killSwitch: boolean;
  frozen: boolean;
  frozenReason: string;
  managerReady?: boolean;
  streamLeaseOwned?: boolean;
  streamHealthy?: boolean;
  snapshotFresh?: boolean;
  positionModeVerified?: boolean;
  canSubmit: boolean;
  reasons: string[];
}

export interface HealthDto {
  env: string;
  brokerConnected: boolean;
  execution: ExecutionDecisionDto;
  clockHealthy: boolean;
  managerReady?: boolean;
  streamHealthy: boolean;
  reconHealthy: boolean;
  positionModeHealthy?: boolean;
  positionMode?: { mode: string; checkedAt: number | null; error: string | null };
  circuitBreakersHealthy?: boolean;
  openCircuits?: string[];
  circuitBreakerStates?: Record<string, string>;
  submissionsFrozen: boolean;
  frozenReasons: string[];
  healthy: boolean;
  signals: {
    brokerStatus: string;
    brokerError: string | null;
    stream: { connected: boolean; leaseOwned?: boolean; reconnects: number; lastEventAt: number | null } | null;
    clock: { offsetMs: number; updatedAt: number } | null;
    recon: { lastRunAt: number | null; lastResult: string | null } | null;
    positionMode?: { mode: string; checkedAt: number | null; error: string | null };
  };
}

export interface MetaDto {
  env: string;
  envLabel: string;
  connectedBroker: string;
  managerStatus: string;
  managerError: string | null;
  execution: ExecutionDecisionDto;
  health: HealthDto;
}

export interface OrderActionResult {
  ok: boolean;
  clientOrderId: string;
  status?: string;
  error?: string;
  duplicate?: boolean;
}
