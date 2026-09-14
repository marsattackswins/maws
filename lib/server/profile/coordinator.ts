import "server-only";

import { BinanceLiveManager, clearLiveManagerForCoordinator, hasLiveManager, liveManager, replaceLiveManagerForCoordinator } from "../binance/manager";
import { acquireRiskMutationDrain } from "../binance/mutation-queue";
import { clearLiveState, liveState } from "../binance/state";
import { intentsInUncertainStates } from "../binance/intents";
import { healthSignals, resetHealthSignals } from "../health/state";
import { buildHealthStatus } from "../health/status";
import { BinanceAdapter } from "../broker/binance/adapter";
import { getBroker, replaceBrokerForCoordinator, clearBrokerForCoordinator } from "../broker/factory";
import {
  PROFILE_IDS,
  serverConfig,
  type EnvConfig,
  type ProfileId,
  type SafeProfileMetadata,
} from "../env/config";
import { executionDecision } from "../gates/execution";
import {
  allowNormalMutations,
  blockNormalMutations,
  normalMutationBlock,
  type ProfileMutationBlockReason,
} from "./admission";
import { persistenceProfileFromConfig } from "./context";


export type ProfilePhase = "idle" | "switching" | "ready" | "degraded" | "detached" | "failed";

export type ProfileRuntimeStatus = {
  profileId: ProfileId | null;
  environment: "paper" | "testnet" | "production" | null;
  phase: ProfilePhase;
  ready: boolean;
  managerStatus: string;
  managerError?: string | null;
  streamHealthy: boolean | null;
  executionAllowed: boolean;
  generation: number;
  reasonCode: string | null;
};

export type ProfileErrorCode =
  | "invalid_profile"
  | "production_confirmation_required"
  | "profile_switch_in_progress"
  | "exposure_present"
  | "exposure_unknown"
  | "in_flight_mutation"
  | "reconciliation_drift"
  | "target_start_failed"
  | "rollback_failed"
  | "configuration_unavailable"
  | "stale_profile";

export class ProfileCoordinatorError extends Error {
  constructor(readonly code: ProfileErrorCode, message = code) {
    super(message);
    this.name = "ProfileCoordinatorError";
  }
}

export type ProfileSwitchRequest = {
  profileId: unknown;
  confirmProduction?: unknown;
  requestId?: unknown;
}

export interface ProfileAssertion {
  profileId?: unknown;
  generation?: unknown;
}

function isProfileId(value: unknown): value is ProfileId {
  return typeof value === "string" && (PROFILE_IDS as readonly string[]).includes(value);
}

function environmentForProfile(profileId: ProfileId): EnvConfig["env"] {
  if (profileId === "paper") return "local";
  if (profileId === "binance-testnet") return "testnet";
  return "production";
}

function publicProfileId(config: EnvConfig): ProfileId | null {
  return config.env === "shadow" ? null : config.activeProfileId;
}

function safeEnvironment(config: EnvConfig): ProfileRuntimeStatus["environment"] {
  if (config.activeProfileId === null) return null;
  if (config.env === "testnet") return "testnet";
  if (config.env === "production") return "production";
  return null;
}

function profileConfig(base: EnvConfig, profileId: ProfileId): EnvConfig {
  const profile = base.profiles[profileId];
  if (profileId !== "paper" && !profile.configured) {
    throw new ProfileCoordinatorError("configuration_unavailable");
  }
  return {
    ...base,
    env: environmentForProfile(profileId),
    activeProfileId: profileId,
    binanceApiKey: profile.apiKey,
    binanceApiSecret: profile.apiSecret,
  };
}

function safeRequestId(value: unknown): boolean {
  return value === undefined || (typeof value === "string" && value.length >= 8 && value.length <= 128 && /^[A-Za-z0-9._:-]+$/.test(value));
}

const PROFILE_START_TIMEOUT_MS = 45_000;

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    operation.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function waitForReady(config: EnvConfig, manager: BinanceLiveManager): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (manager.status === "ready" && reasonForHealth(config, manager) !== null && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (manager.status !== "ready") throw new Error("manager startup failed");
  const reason = reasonForHealth(config, manager);
  if (reason !== null) throw new Error(`manager readiness check failed: ${reason}`);
}

function safeStartupFailure(error: unknown): string {
  const message = error instanceof Error ? error.message.trim() : "";
  if (!message || message.length > 240 || /api[-_]?secret|signature=|x-mbx-api-key/i.test(message)) {
    return "Binance profile startup checks failed";
  }
  return message;
}

function reasonForHealth(config: EnvConfig, manager: BinanceLiveManager | null): string | null {
  if (!manager || manager.status !== "ready") return "manager_not_ready";
  const health = buildHealthStatus(config);
  if (!health.streamHealthy) {
    const stream = health.signals.stream;
    if (!stream) return "stream_not_started";
    if (stream.leaseOwned !== true) return stream.phase === "standby" ? "stream_standby" : "stream_lease_not_owned";
    if (stream.circuitState === "open") return "stream_circuit_open";
    if (stream.phase === "snapshot") return "stream_snapshot_pending";
    if (stream.phase === "reconnecting") return "stream_reconnecting";
    if (stream.phase === "connecting") return "stream_connecting";
    return stream.connected ? "stream_stale" : "stream_disconnected";
  }
  if (config.env !== "local") {
    // Clock drift does not block signing: requests already carry
    // offset-corrected timestamps and a -1021 resyncs + retries. A large raw
    // drift only disqualifies production, where wall-clock truth matters.
    if (config.env === "production" && !health.clockHealthy) return "clock_unhealthy";
    if (!health.signals.snapshot || Date.now() - health.signals.snapshot.fetchedAt > config.snapshotMaxAgeMs) return "snapshot_stale";
    if (!health.positionModeHealthy) return "position_mode_invalid";
    if (!health.reconHealthy) return health.signals.recon.lastResult === "drift" ? "reconciliation_drift" : "reconciliation_failed";
  }
  if (health.execution.frozen) return "execution_frozen";
  return null;
}

export function profileErrorStatus(code: ProfileErrorCode): number {
  if (code === "invalid_profile" || code === "production_confirmation_required") return 400;
  if (code === "target_start_failed") return 502;
  if (code === "rollback_failed" || code === "configuration_unavailable") return 503;
  return 409;
}

export function profileAssertionFromRequest(req: Request): ProfileAssertion {
  const profileId = req.headers.get("x-maws-profile-id") ?? undefined;
  const generation = req.headers.get("x-maws-profile-generation") ?? undefined;
  return { profileId, generation };
}

export function assertProfileRequest(req: Request): void {
  profileCoordinator().assertRequest(profileAssertionFromRequest(req));
}

export function assertProfileMutationRequest(req: Request): void {
  profileCoordinator().assertNormalMutation(profileAssertionFromRequest(req));
}

export class ProfileCoordinator {
  private manager: BinanceLiveManager | null = null;
  private runtimeConfig: EnvConfig | null = null;
  private phase: ProfilePhase = "idle";
  private generation = 0;
  private startPromise: Promise<void> | null = null;
  private switchPromise: Promise<ProfileRuntimeStatus> | null = null;
  private failureReason: ProfileErrorCode | null = null;
  private failureMessage: string | null = null;

  getStatus(): ProfileRuntimeStatus {
    if (!this.manager && hasLiveManager()) {
      this.manager = liveManager();
      this.runtimeConfig = this.manager.cfg;
      if (this.phase === "idle" && this.manager.status === "ready") this.phase = "ready";
    }
    const config = this.runtimeConfig ?? (this.phase === "idle" ? serverConfig() : null);
    const manager = this.manager;
    const profileId = config ? publicProfileId(config) : null;
    const reasonCode = this.phase === "switching" ? "profile_switch_in_progress" : this.failureReason ?? (this.phase === "idle" ? null : config ? reasonForHealth(config, manager) : null);
    const ready = this.phase === "ready" && reasonCode === null;
    const decision = config ? executionDecision(config) : null;
    const stream = healthSignals().stream;
    return {
      profileId,
      environment: config ? safeEnvironment(config) : null,
      phase: this.phase,
      ready,
      managerStatus: manager?.status ?? "idle",
      managerError: manager?.error ?? this.failureMessage,
      streamHealthy: stream ? buildHealthStatus(config ?? serverConfig()).streamHealthy : null,
      executionAllowed: ready && decision?.canSubmit === true,
      generation: this.generation,
      reasonCode,
    };
  }

  getActiveConfig(): EnvConfig {
    return this.runtimeConfig ?? serverConfig();
  }

  getActiveManager(): BinanceLiveManager | null {
    if (!this.manager && hasLiveManager()) {
      this.manager = liveManager();
      this.runtimeConfig = this.manager.cfg;
    }
    return this.manager;
  }

  getProfileMetadata(): SafeProfileMetadata[] {
    return PROFILE_IDS.map((profileId) => {
      const profile = serverConfig().profiles[profileId];
      return {
        profileId: profile.profileId,
        label: profile.label,
        environment: profile.environment,
        configured: profile.configured,
        requiresProductionConfirmation: profileId === "binance-production",
        executionEnabled: profile.executionEnabled,
      };
    });
  }

  async ensureStarted(): Promise<void> {
    if (this.switchPromise) return;
    const base = serverConfig();
    if (base.env === "local" && base.activeProfileId === null && !this.manager && !this.runtimeConfig) return;
    if (this.manager?.status === "ready" && this.phase === "ready") return;
    if (this.startPromise) return this.startPromise;
    const startup = this.startInitial();
    const tracked = startup.finally(() => {
      if (this.startPromise === tracked) this.startPromise = null;
    });
    this.startPromise = tracked;
    return tracked;
  }

  private async startInitial(): Promise<void> {
    const base = serverConfig();
    this.phase = "switching";
    this.failureReason = null;
    this.failureMessage = null;
    blockNormalMutations("profile_switch_in_progress");
    this.generation += 1;
    const broker = getBroker();
    this.manager = liveManager();
    this.runtimeConfig = this.manager.cfg;
    try {
      await broker.connect();
      await waitForReady(this.runtimeConfig, this.manager);
      this.phase = "ready";
      this.failureMessage = null;
      allowNormalMutations();
    } catch {
      this.failureMessage = this.manager?.error ?? "Binance profile startup failed";
      this.phase = "failed";
      this.failureReason = "target_start_failed";
      blockNormalMutations("profile_runtime_unavailable");
      throw new ProfileCoordinatorError("target_start_failed");
    }
    if (!this.runtimeConfig) this.runtimeConfig = base;
  }

  async switchProfile(request: ProfileSwitchRequest): Promise<ProfileRuntimeStatus> {
    if (this.switchPromise) throw new ProfileCoordinatorError("profile_switch_in_progress");
    if (!isProfileId(request.profileId)) throw new ProfileCoordinatorError("invalid_profile");
    if (request.profileId === "binance-production" && request.confirmProduction !== true) {
      throw new ProfileCoordinatorError("production_confirmation_required");
    }
    if (!safeRequestId(request.requestId)) throw new ProfileCoordinatorError("invalid_profile");
    const target = request.profileId;
    const pending = target === "paper" ? this.detachProfile() : this.performSwitch(target);
    const tracked = pending.finally(() => {
      if (this.switchPromise === tracked) this.switchPromise = null;
    });
    this.switchPromise = tracked;
    return tracked;
  }

  private async detachProfile(): Promise<ProfileRuntimeStatus> {
    const base = serverConfig();
    const previousManager = this.manager;
    const previousConfig = this.runtimeConfig ?? base;
    this.phase = "switching";
    this.failureReason = null;
    this.generation += 1;
    blockNormalMutations("profile_switch_in_progress");

    try {
      await this.checkExposure(previousManager, previousConfig);
      if (previousManager) await previousManager.stopAndWait();
    } catch (error) {
      this.phase = previousManager?.status === "ready" ? "ready" : "failed";
      this.failureReason = error instanceof ProfileCoordinatorError ? error.code : "target_start_failed";
      allowNormalMutations();
      throw error instanceof ProfileCoordinatorError
        ? error
        : new ProfileCoordinatorError("target_start_failed");
    }

    this.manager = null;
    this.runtimeConfig = {
      ...base,
      env: "local",
      activeProfileId: null,
      binanceApiKey: null,
      binanceApiSecret: null,
    };
    clearBrokerForCoordinator();
    clearLiveManagerForCoordinator();
    clearLiveState();
    resetHealthSignals();
    this.phase = "idle";
    this.failureReason = null;
    this.failureMessage = null;
    allowNormalMutations();
    return this.getStatus();
  }

  private async performSwitch(target: ProfileId): Promise<ProfileRuntimeStatus> {
    const base = serverConfig();
    const targetConfig = profileConfig(base, target);
    const previousManager = this.manager;
    const previousConfig = this.runtimeConfig ?? (previousManager?.cfg ?? base);
    const previousProfile = publicProfileId(previousConfig);
    if (previousProfile === target && this.phase === "ready") return this.getStatus();

    this.phase = "switching";
    this.failureReason = null;
    this.failureMessage = null;
    this.generation += 1;
    blockNormalMutations("profile_switch_in_progress");

    try {
      await this.checkExposure(previousManager, previousConfig);
    } catch (error) {
      this.phase = previousManager?.status === "ready" ? "ready" : "failed";
      this.failureReason = error instanceof ProfileCoordinatorError ? error.code : "exposure_unknown";
      allowNormalMutations();
      throw error;
    }

    if (previousManager) {
      try {
        await previousManager.stopAndWait();
      } catch {
        this.manager = null;
        this.runtimeConfig = null;
        clearBrokerForCoordinator();
        clearLiveManagerForCoordinator();
        clearLiveState();
        resetHealthSignals();
        this.phase = "failed";
        this.failureReason = "target_start_failed";
        blockNormalMutations("profile_runtime_unavailable");
        throw new ProfileCoordinatorError("target_start_failed");
      }
    }

    clearLiveState();
    resetHealthSignals();
    let targetManager: BinanceLiveManager | null = null;
    try {
      targetManager = new BinanceLiveManager(targetConfig);
      replaceLiveManagerForCoordinator(targetManager);
      replaceBrokerForCoordinator(new BinanceAdapter(targetConfig, targetManager));
      this.manager = targetManager;
      this.runtimeConfig = targetConfig;
      await withTimeout(
        (async () => {
          await targetManager.ensureStarted();
          await waitForReady(targetConfig, targetManager);
        })(),
        PROFILE_START_TIMEOUT_MS,
        "Binance profile startup timed out while waiting for readiness",
      );
      this.phase = "ready";
      this.failureReason = null;
      this.failureMessage = null;
      allowNormalMutations();
      return this.getStatus();
    } catch (error) {
      const readinessReason = targetManager ? reasonForHealth(targetConfig, targetManager) : null;
      const targetError = targetManager?.error;
      this.failureMessage = targetError
        ?? (readinessReason ? `Binance profile startup check failed: ${readinessReason.replaceAll("_", " ")}` : safeStartupFailure(error));
      const targetCleaned = targetManager ? await this.cleanFailedTarget(targetManager) : true;
      const rollback = targetCleaned && previousManager ? await this.rollback(previousManager, previousConfig) : null;
      if (rollback) throw new ProfileCoordinatorError("target_start_failed");
      this.manager = null;
      this.runtimeConfig = null;
      clearBrokerForCoordinator();
      clearLiveManagerForCoordinator();
      clearLiveState();
      resetHealthSignals();
      if (!previousManager) {
        this.phase = "failed";
        this.failureReason = "target_start_failed";
      } else {
        this.phase = "detached";
        this.failureReason = targetCleaned ? "rollback_failed" : "target_start_failed";
      }
      blockNormalMutations("profile_runtime_unavailable");
      throw new ProfileCoordinatorError(this.failureReason);
    }
  }

  private async cleanFailedTarget(manager: BinanceLiveManager): Promise<boolean> {
    try {
      await manager.stopAndWait();
      return true;
    } catch {
      // The target is still fenced and remains non-active; rollback is unsafe.
      return false;
    }
  }

  private async rollback(previousManager: BinanceLiveManager | null, previousConfig: EnvConfig): Promise<ProfileRuntimeStatus | null> {
    if (!previousManager) return null;
    try {
      clearLiveState();
      resetHealthSignals();
      replaceLiveManagerForCoordinator(previousManager);
      replaceBrokerForCoordinator(new BinanceAdapter(previousConfig, previousManager));
      this.manager = previousManager;
      this.runtimeConfig = previousConfig;
      await withTimeout(
        (async () => {
          await previousManager.ensureStarted();
          await waitForReady(previousConfig, previousManager);
        })(),
        PROFILE_START_TIMEOUT_MS,
        "Previous profile restore timed out while waiting for readiness",
      );
      this.phase = "ready";
      this.failureReason = null;
      this.failureMessage = null;
      allowNormalMutations();
      return this.getStatus();
    } catch {
      await previousManager.stopAndWait().catch(() => undefined);
      return null;
    }
  }

  private async checkExposure(manager: BinanceLiveManager | null, config: EnvConfig): Promise<void> {
    if (!manager || config.env === "local") return;
    try {
      await manager.snapshot();
      const persistenceProfile = persistenceProfileFromConfig(config);
      const hadInFlightMutation = intentsInUncertainStates(persistenceProfile).length > 0;
      const recon = await manager.reconcileRun("profile-switch-preflight");
      const release = await acquireRiskMutationDrain();
      release();
      const signals = healthSignals();
      if (!signals.snapshot || Date.now() - signals.snapshot.fetchedAt > config.snapshotMaxAgeMs) {
        throw new ProfileCoordinatorError("exposure_unknown");
      }
      if (recon.result === "error" || signals.recon.lastResult === "error") {
        throw new ProfileCoordinatorError("exposure_unknown");
      }
      const state = liveState();
      if (state.positions.size > 0 || state.openOrders.size > 0) throw new ProfileCoordinatorError("exposure_present");
      if (recon.result === "drift" || signals.recon.lastResult === "drift") {
        throw new ProfileCoordinatorError("reconciliation_drift");
      }
      const uncertain = intentsInUncertainStates(persistenceProfile);
      if (hadInFlightMutation || uncertain.length > 0) throw new ProfileCoordinatorError("in_flight_mutation");
      if (!state.account) throw new ProfileCoordinatorError("exposure_unknown");
    } catch (error) {
      if (error instanceof ProfileCoordinatorError) throw error;
      throw new ProfileCoordinatorError("exposure_unknown");
    }
  }

  assertRequest(assertion: ProfileAssertion): void {
    if (this.phase === "switching") throw new ProfileCoordinatorError("profile_switch_in_progress");
    const config = this.runtimeConfig ?? (this.phase === "idle" ? serverConfig() : null);
    const currentProfile = config ? publicProfileId(config) : null;
    if (assertion.profileId !== undefined && assertion.profileId !== currentProfile) throw new ProfileCoordinatorError("stale_profile");
    if (assertion.generation !== undefined) {
      const generation = typeof assertion.generation === "number" ? assertion.generation : Number(assertion.generation);
      if (!Number.isSafeInteger(generation) || generation !== this.generation) throw new ProfileCoordinatorError("stale_profile");
    }
  }

  assertNormalMutation(assertion: ProfileAssertion = {}): void {
    this.assertRequest(assertion);
    const blocked = normalMutationBlock();
    if (blocked === "profile_switch_in_progress") throw new ProfileCoordinatorError("profile_switch_in_progress");
    if (blocked === "profile_runtime_unavailable") throw new ProfileCoordinatorError("stale_profile");
  }

  /**
   * Best-effort teardown for process exit. Releases the user-data stream
   * lease (via manager stop) so a following server instance can attach
   * immediately instead of waiting out the lease TTL. Never throws.
   */
  async shutdownForExit(): Promise<void> {
    const manager = this.manager;
    this.manager = null;
    this.runtimeConfig = null;
    this.phase = "idle";
    this.failureReason = null;
    if (manager) {
      try {
        await manager.stopAndWait();
      } catch {
        // The lease row expires via TTL even if teardown fails mid-way.
      }
    }
    clearBrokerForCoordinator();
    clearLiveManagerForCoordinator();
    clearLiveState();
  }

  resetForTests(): void {
    this.switchPromise = null;
    this.startPromise = null;
    this.manager = null;
    this.runtimeConfig = null;
    this.phase = "idle";
    this.generation = 0;
    this.failureReason = null;
    allowNormalMutations();
    clearBrokerForCoordinator();
  }
}

let coordinator: ProfileCoordinator | null = null;

export function profileCoordinator(): ProfileCoordinator {
  if (!coordinator) coordinator = new ProfileCoordinator();
  return coordinator;
}

export function activeProfileConfig(): EnvConfig {
  return profileCoordinator().getActiveConfig();
}

export function activeProfileManager(): BinanceLiveManager | null {
  return profileCoordinator().getActiveManager();
}

export function profileRuntimeStatus(): ProfileRuntimeStatus {
  return profileCoordinator().getStatus();
}

export function profileMetadata(): SafeProfileMetadata[] {
  return profileCoordinator().getProfileMetadata();
}

export function resetProfileCoordinatorForTests(): void {
  coordinator?.resetForTests();
  coordinator = null;
}

export type { ProfileMutationBlockReason };
