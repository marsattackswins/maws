import { liveApi, LiveApiError, LiveAuthError, setCsrf } from "./api";
import { useLiveStore } from "./store";
import { useAppStore } from "../store";
import { connectMock } from "../trading/mock";
import type {
  FillDto,
  HealthDto,
  LiveProfileId,
  LiveProfilePhase,
  LiveStateDto,
  ProfileRuntimeStatusDto,
} from "./types";

let es: EventSource | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let started = false;
let attachmentEpoch = 0;

const PROFILE_LABELS: Record<LiveProfileId, string> = {
  paper: "Paper Trading",
  "binance-testnet": "Binance Testnet",
  "binance-production": "Binance Production",
};

const PROFILE_ERROR_TEXT: Record<string, string> = {
  invalid_profile: "That profile is not available.",
  production_confirmation_required: "Production confirmation is required.",
  profile_switch_in_progress: "Another profile switch is already in progress.",
  exposure_present: "Switching is blocked because open positions or orders exist.",
  exposure_unknown: "Switching is blocked because exposure could not be confirmed.",
  in_flight_mutation: "Switching is blocked while order work is still in flight.",
  reconciliation_drift: "Switching is blocked because reconciliation drift must be resolved.",
  target_start_failed: "The requested profile could not be started.",
  rollback_failed: "The profile could not be restored; trading is fail-closed.",
  configuration_unavailable: "That profile is not configured on the server.",
  stale_profile: "The profile changed while this action was running. Retry.",
};

export type LiveConnectOutcome = "connected" | "unauthenticated" | "error";
export type ProfileSwitchOutcome = "ready" | "paper" | "unauthenticated" | "error";

function profileIdForEnvironment(environment: string): LiveProfileId | null {
  if (environment === "local") return "paper";
  if (environment === "testnet") return "binance-testnet";
  if (environment === "production") return "binance-production";
  return null;
}

function fallbackStatus(meta: {
  env: string;
  managerStatus: string;
  health: HealthDto;
}): ProfileRuntimeStatusDto {
  const profileId = profileIdForEnvironment(meta.env);
  const ready = meta.managerStatus === "ready" && meta.health.streamHealthy;
  return {
    profileId,
    environment: profileId === "paper" ? "paper" : profileId === "binance-testnet" ? "testnet" : profileId === "binance-production" ? "production" : null,
    phase: ready ? "ready" : "degraded",
    ready,
    managerStatus: meta.managerStatus,
    streamHealthy: meta.health.streamHealthy,
    executionAllowed: meta.health.execution?.canSubmit ?? ready,
    generation: 0,
    reasonCode: ready ? null : "target_start_failed",
  };
}

function isReady(status: ProfileRuntimeStatusDto): boolean {
  return status.profileId !== null && status.phase === "ready" && status.ready === true;
}

function statusMatches(
  left: Pick<ProfileRuntimeStatusDto, "profileId" | "generation">,
  right: Pick<ProfileRuntimeStatusDto, "profileId" | "generation">,
): boolean {
  return left.profileId === right.profileId && left.generation === right.generation;
}

function safeErrorText(error: unknown, fallback = "The live profile operation could not be completed."): string {
  if (error instanceof LiveApiError) return PROFILE_ERROR_TEXT[error.code] ?? fallback;
  if (error instanceof LiveAuthError) return "Your operator session expired. Sign in again.";
  return fallback;
}

function requestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function applyProfileStatus(status: ProfileRuntimeStatusDto): void {
  useLiveStore.getState().setProfileRuntime(status);
}

function detachClient(clearRuntime = true): void {
  stopSse();
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  const live = useLiveStore.getState();
  live.setAttached(false);
  live.clearState();
  if (clearRuntime) live.clearProfileRuntime();
  useAppStore.getState().setConnectedBroker(null);
}

function isCurrentAttachment(status: ProfileRuntimeStatusDto, epoch: number): boolean {
  const live = useLiveStore.getState();
  return epoch === attachmentEpoch && live.ready && statusMatches(live, status);
}

function isCurrentSubscription(status: ProfileRuntimeStatusDto, epoch: number): boolean {
  return useLiveStore.getState().attached && isCurrentAttachment(status, epoch);
}

async function refreshState(expected?: { status: ProfileRuntimeStatusDto; epoch: number }): Promise<boolean> {
  try {
    const state = await liveApi.state();
    if (expected && !isCurrentAttachment(expected.status, expected.epoch)) return false;
    useLiveStore.getState().applyState(state);
    return true;
  } catch (err) {
    if (err instanceof LiveAuthError) redirectToLogin();
    return false;
  }
}

/** Coalesces bursts of stream events into one refetch. */
function scheduleRefresh(expected: { status: ProfileRuntimeStatusDto; epoch: number }): void {
  if (refreshTimer) return;
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    if (isCurrentSubscription(expected.status, expected.epoch)) void refreshState(expected);
  }, 250);
}

export function redirectToLogin(): void {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    // Hard navigation on purpose: the session is dead, so a full page load
    // tears down the SSE bridge and all live client state before sign-in.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login";
  }
}

function onSseEvent(name: string, raw: string, expected: { status: ProfileRuntimeStatusDto; epoch: number }): void {
  if (!isCurrentSubscription(expected.status, expected.epoch)) return;
  const store = useLiveStore.getState();
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    switch (name) {
      case "state":
        store.applyState(data as unknown as LiveStateDto);
        break;
      case "health":
        store.setHealth(data as unknown as HealthDto);
        break;
      case "stream-status":
        store.setStream({
          connected: data.connected === true,
          leaseOwned: data.leaseOwned === true,
          phase: String(data.phase ?? ""),
          reconnects: Number(data.reconnects ?? 0),
        });
        break;
      case "order-update":
      case "account-update":
      case "snapshot":
      case "uncertainty-cleared":
        scheduleRefresh(expected);
        break;
      case "fills": {
        const fills = data as unknown as FillDto[];
        if (Array.isArray(fills) && fills.length > 0) {
          const total = fills.reduce((sum, fill) => sum + (fill.realizedPnl || 0), 0);
          store.notify("info", `Fill: ${fills[0].symbol} ${fills[0].side} ${fills[0].qty} @ ${fills[0].price}${total !== 0 ? ` (P&L ${total >= 0 ? "+" : ""}${total.toFixed(2)})` : ""}`);
        }
        scheduleRefresh(expected);
        break;
      }
      default:
        break;
    }
  } catch {
    // Malformed SSE payload: ignore; the next refresh heals state.
  }
}

function startSse(status: ProfileRuntimeStatusDto, epoch: number): void {
  if (es) return;
  es = new EventSource("/api/live/events");
  const names = ["state", "health", "stream-status", "order-update", "account-update", "snapshot", "fills", "uncertainty-cleared"];
  for (const name of names) {
    es.addEventListener(name, (event) => onSseEvent(name, (event as MessageEvent).data, { status, epoch }));
  }
  es.onerror = () => {
    // EventSource reconnects on its own; surface staleness via health polls.
  };
}

function stopSse(): void {
  attachmentEpoch += 1;
  es?.close();
  es = null;
}

async function attachConfirmedProfile(status: ProfileRuntimeStatusDto, verifyAfterState: boolean): Promise<boolean> {
  if (!isReady(status) || status.profileId === "paper") return false;
  applyProfileStatus(status);
  const epoch = attachmentEpoch;
  const loaded = await refreshState({ status, epoch });
  if (!loaded || epoch !== attachmentEpoch) return false;
  let confirmed = status;
  if (verifyAfterState) {
    confirmed = await liveApi.profile();
    if (!isReady(confirmed) || !statusMatches(confirmed, status) || epoch !== attachmentEpoch) return false;
    applyProfileStatus(confirmed);
  }
  useLiveStore.getState().setAttached(true);
  useAppStore.getState().setConnectedBroker("binance");
  startSse(confirmed, epoch);
  return true;
}

async function waitForReady(initial: ProfileRuntimeStatusDto, target: LiveProfileId): Promise<ProfileRuntimeStatusDto> {
  if (isReady(initial) && initial.profileId === target) return initial;
  let status = initial;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (status.profileId === target && (status.phase === "failed" || status.phase === "detached")) return status;
    await new Promise((resolve) => setTimeout(resolve, 250));
    status = await liveApi.profile();
    if (isReady(status) && status.profileId === target) return status;
  }
  return status;
}

/** Restores only a server-confirmed live profile after page hydration. */
export async function restoreServerProfile(): Promise<void> {
  try {
    const session = await liveApi.session();
    if (!session.authenticated) {
      detachClient();
      return;
    }
    if (session.env === "local") {
      // Local mode is chart-only. Do not probe protected live APIs or restore
      // an exchange attachment from a browser claim. A persisted Paper
      // attachment remains a browser-local choice.
      const paperAttached = useAppStore.getState().connectedBroker === "mock";
      detachClient();
      if (paperAttached) connectMock();
      return;
    }
    setCsrf(session.csrf ?? null);
    let status: ProfileRuntimeStatusDto;
    try {
      status = await liveApi.profile();
    } catch (error) {
      if (error instanceof LiveApiError && error.code === "env_local") return;
      throw error;
    }
    applyProfileStatus(status);
    if (!isReady(status)) {
      if (status.profileId && status.phase === "degraded") {
        detachClient(false);
        applyProfileStatus(status);
        useAppStore.getState().setConnectedBroker("binance");
      } else {
        // A persisted paper attachment is not authoritative. A non-ready or
        // empty server status leaves the workspace in chart-only mode while
        // preserving the paper books themselves.
        detachClient(false);
        applyProfileStatus(status);
      }
      return;
    }
    if (status.profileId === "paper") {
      detachClient(false);
      connectMock();
      applyProfileStatus(status);
      return;
    }
    stopSse();
    if (!(await attachConfirmedProfile(status, true))) {
      detachClient(false);
      applyProfileStatus(status);
    }
  } catch (error) {
    if (error instanceof LiveAuthError) {
      detachClient();
      redirectToLogin();
      return;
    }
    if (error instanceof LiveApiError && error.code === "env_local") return;
    if (useAppStore.getState().connectedBroker === "binance") detachClient();
    useLiveStore.getState().notify("error", safeErrorText(error, "Live profile status is unavailable."));
  }
}

/** Establishes the legacy live attachment after the server manager is connected. */
export async function connectLiveBroker(): Promise<LiveConnectOutcome> {
  const store = useLiveStore.getState();
  try {
    const session = await liveApi.session();
    if (!session.authenticated) {
      detachClient();
      redirectToLogin();
      return "unauthenticated";
    }
    setCsrf(session.csrf ?? null);
    store.setEnv(session.env, session.envLabel ?? null);
    await liveApi.connect();
    const meta = await liveApi.meta();
    store.setManager(meta.managerStatus, meta.managerError);
    const status = fallbackStatus(meta);
    applyProfileStatus(status);
    store.setHealth(meta.health);
    if (!isReady(status) || !(await attachConfirmedProfile(status, false))) {
      detachClient(false);
      store.setManager("error", "Live profile is not ready");
      store.notify("error", "Live profile is not ready.");
      return "error";
    }
    return "connected";
  } catch (error) {
    detachClient();
    if (error instanceof LiveAuthError) {
      redirectToLogin();
      return "unauthenticated";
    }
    store.setManager("error", safeErrorText(error, "Live broker unavailable."));
    store.notify("error", safeErrorText(error, "Live broker unavailable."));
    return "error";
  }
}

export async function switchLiveProfile(target: LiveProfileId, confirmProduction = false): Promise<ProfileSwitchOutcome> {
  const previous = useLiveStore.getState();
  try {
    if (target === "paper") {
      // Paper is a browser-local attachment and does not require Binance
      // operator authentication or exchange credentials.
      detachClient();
      connectMock();
      return "paper";
    }

    const session = await liveApi.session();
    if (!session.authenticated) {
      detachClient();
      redirectToLogin();
      return "unauthenticated";
    }
    setCsrf(session.csrf ?? null);
    if (session.env === "local") {
      useLiveStore.getState().notify("error", "Binance profiles are unavailable in local mode.");
      return "error";
    }

    stopSse();
    useLiveStore.getState().beginProfileSwitch();
    const response = await liveApi.switchProfile({ profileId: target, confirmProduction, requestId: requestId() });
    const status = await waitForReady(response, target);
    if (!isReady(status) || status.profileId !== target) {
      applyProfileStatus(status);
      throw new LiveApiError(status.reasonCode ?? "target_start_failed", PROFILE_ERROR_TEXT[status.reasonCode ?? ""] ?? "The requested profile is not ready.", 409);
    }

    if (!(await attachConfirmedProfile(status, true))) {
      throw new LiveApiError("target_start_failed", "The requested profile could not be attached.", 502);
    }
    useLiveStore.getState().notify("success", `${PROFILE_LABELS[target]} is ready.`);
    return "ready";
  } catch (error) {
    let observed: ProfileRuntimeStatusDto | null = null;
    try {
      observed = await liveApi.profile();
    } catch {
      // The original stable error category is more useful than a second failure.
    }
    if (observed) {
      applyProfileStatus(observed);
      if (isReady(observed) && observed.profileId !== "paper") {
        stopSse();
        if (await attachConfirmedProfile(observed, false)) {
          useLiveStore.getState().notify("error", `${safeErrorText(error)} Previous profile restored.`);
          return "error";
        }
      } else if (isReady(observed) && observed.profileId === "paper") {
        detachClient(false);
        connectMock();
        applyProfileStatus(observed);
        useLiveStore.getState().notify("error", `${safeErrorText(error)} Paper Trading remains active.`);
        return "error";
      }
      detachClient(false);
      applyProfileStatus(observed);
    } else {
      // Do not claim the previous profile is restored without a fresh server status.
      detachClient(false);
      applyProfileStatus({
        profileId: null,
        environment: null,
        phase: "failed",
        ready: false,
        managerStatus: "idle",
        streamHealthy: null,
        executionAllowed: false,
        generation: previous.generation,
        reasonCode: error instanceof LiveApiError ? error.code : "target_start_failed",
      });
    }
    useLiveStore.getState().notify("error", safeErrorText(error));
    return "error";
  }
}

/** Detaches the browser from live state; server monitoring remains independent. */
export async function disconnectLiveBroker(): Promise<void> {
  detachClient();
  await liveApi.disconnect().catch(() => undefined);
}

/** Restores a persisted paper attachment only through the existing paper store. */
export async function restoreLiveSessionIfAttached(attachedBroker: string | null): Promise<void> {
  if (started || attachedBroker !== "binance") return;
  started = true;
  try {
    await restoreServerProfile();
  } finally {
    started = false;
  }
}

export function stopLiveBridgeForTests(): void {
  stopSse();
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function profileLabel(profileId: LiveProfileId | null): string {
  return profileId ? PROFILE_LABELS[profileId] : "No active profile";
}

export function profilePhaseLabel(phase: LiveProfilePhase): string {
  if (phase === "switching") return "Switching profile…";
  if (phase === "degraded") return "Degraded";
  if (phase === "detached") return "Detached / fail-closed";
  if (phase === "failed") return "Unavailable";
  if (phase === "ready") return "Ready";
  return "Chart only";
}

export function profileErrorMessage(code: string | null): string {
  return code ? PROFILE_ERROR_TEXT[code] ?? "The live profile operation could not be completed." : "The live profile operation could not be completed.";
}
