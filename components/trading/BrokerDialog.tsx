"use client";

import { useLiveStore } from "@/lib/live/store";
import { liveApi, LiveApiError, LiveAuthError, setCsrf } from "@/lib/live/api";
import { profileErrorMessage, profileLabel, profilePhaseLabel, switchLiveProfile } from "@/lib/live/bridge";
import type { LiveProfileId, ProfileMetadataDto } from "@/lib/live/types";
import { useAppStore } from "@/lib/store";
import { Check, ChevronRight, CircleAlert, LoaderCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

const FALLBACK_PROFILES: ProfileMetadataDto[] = [
  {
    profileId: "paper",
    label: "Paper Trading",
    environment: "paper",
    configured: true,
    requiresProductionConfirmation: false,
    executionEnabled: false,
  },
  {
    profileId: "binance-testnet",
    label: "Binance Testnet",
    environment: "testnet",
    configured: false,
    requiresProductionConfirmation: false,
    executionEnabled: false,
  },
  {
    profileId: "binance-production",
    label: "Binance Production",
    environment: "production",
    configured: false,
    requiresProductionConfirmation: true,
    executionEnabled: false,
  },
];

const PROFILE_COPY: Record<LiveProfileId, { description: string; caution: string }> = {
  paper: {
    description: "Simulated orders and positions kept in this browser.",
    caution: "Paper state never mixes with Binance state.",
  },
  "binance-testnet": {
    description: "Server-managed Binance Futures Testnet account.",
    caution: "Uses server-side testnet configuration.",
  },
  "binance-production": {
    description: "Server-managed Binance Production account.",
    caution: "Real orders and positions may be affected.",
  },
};

function ProfileMark({ profileId }: { profileId: LiveProfileId }) {
  if (profileId === "paper") {
    return <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#363a45] bg-[#1b1b1b] text-[18px]">P</span>;
  }
  return (
    <span className="flex h-11 w-11 items-center justify-center">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#f0b90b" aria-hidden="true">
        <path d="M7.0679 12L5.03779 14.0301L3.00256 12L5.03268 9.96989L7.0679 12ZM12.0026 7.06534L15.485 10.5477L17.5151 8.51761L12.0026 3L6.48495 8.51761L8.51506 10.5477L12.0026 7.06534ZM18.9673 9.96989L16.9372 12L18.9673 14.0301L20.9975 12L18.9673 9.96989ZM12.0026 16.9347L8.52018 13.4523L6.49006 15.4824L12.0026 21L17.5151 15.4824L15.485 13.4523L12.0026 16.9347ZM12.0026 14.0301L14.0327 12L12.0026 9.96989L9.96734 12L12.0026 14.0301Z" />
      </svg>
    </span>
  );
}

function safeLoadError(error: unknown): string {
  if (error instanceof LiveAuthError) return "Authenticate when you choose a Binance profile.";
  if (error instanceof LiveApiError && error.code === "env_local") {
    return "Binance profiles are unavailable in local mode. Paper Trading remains available.";
  }
  if (error instanceof LiveApiError) return "Server profile status is unavailable.";
  return "Server profile status is unavailable.";
}

function safeAuthError(error: unknown): string {
  if (error instanceof LiveAuthError) return "Invalid operator password.";
  if (error instanceof LiveApiError && error.code === "env_local") {
    return "Set MAWS_OPERATOR_AUTH to connect a Binance profile from Chart Only.";
  }
  return "Operator authentication is unavailable. Try again.";
}

export function BrokerDialog() {
  const open = useAppStore((s) => s.brokerDialogOpen);
  const setOpen = useAppStore((s) => s.setBrokerDialogOpen);
  const connectedBroker = useAppStore((s) => s.connectedBroker);
  const liveProfile = useLiveStore((s) => s.profileId);
  const livePhase = useLiveStore((s) => s.phase);
  const liveReady = useLiveStore((s) => s.ready);
  const liveReason = useLiveStore((s) => s.reasonCode);
  const liveManagerError = useLiveStore((s) => s.managerError);
  const [profiles, setProfiles] = useState<ProfileMetadataDto[]>(FALLBACK_PROFILES);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [switchingTarget, setSwitchingTarget] = useState<LiveProfileId | null>(null);
  const [productionConfirmation, setProductionConfirmation] = useState(false);
  const [productionChecked, setProductionChecked] = useState(false);
  const [authenticationRequired, setAuthenticationRequired] = useState(false);
  const [localUnavailable, setLocalUnavailable] = useState(false);
  const [authTarget, setAuthTarget] = useState<Exclude<LiveProfileId, "paper"> | null>(null);
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const activeProfile = connectedBroker === "mock" ? "paper" : connectedBroker === "binance" ? liveProfile : null;
  const switching = switchingTarget !== null || livePhase === "switching";
  const currentLabel = activeProfile ? profileLabel(activeProfile) : "Chart only";
  const currentStatus = livePhase === "switching" ? "Switching profile…" : liveReady ? profilePhaseLabel(livePhase) : livePhase !== "idle" ? profilePhaseLabel(livePhase) : "No active broker";

  const orderedProfiles = useMemo(
    () => ["paper", "binance-testnet", "binance-production"].map((id) => profiles.find((profile) => profile.profileId === id) ?? FALLBACK_PROFILES.find((profile) => profile.profileId === id)!),
    [profiles],
  );

  useEffect(() => {
    if (!open) {
      setProductionConfirmation(false);
      setProductionChecked(false);
      setSwitchingTarget(null);
      setAuthTarget(null);
      setAuthPassword("");
      setAuthError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setAuthenticationRequired(false);
    setLocalUnavailable(false);
    void liveApi.profiles()
      .then((response) => {
        if (!cancelled) {
          setProfiles(response.profiles);
          setAuthenticationRequired(false);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setProfiles(FALLBACK_PROFILES);
          setAuthenticationRequired(error instanceof LiveAuthError);
          setLocalUnavailable(error instanceof LiveApiError && error.code === "env_local");
          setLoadError(safeLoadError(error));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      if (authTarget) {
        setAuthTarget(null);
        setAuthPassword("");
        setAuthError(null);
      } else if (productionConfirmation) {
        setProductionConfirmation(false);
        setProductionChecked(false);
      } else {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [authTarget, open, productionConfirmation, setOpen]);

  useEffect(() => {
    if (open) return;
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[data-trade-trigger]")?.focus();
    });
  }, [open]);

  const closeDialog = () => {
    setOpen(false);
    closeRef.current?.blur();
  };

  const startSwitch = async (profileId: LiveProfileId, confirmProduction = false) => {
    if (switching) return;
    setSwitchingTarget(profileId);
    setLoadError(null);
    try {
      const result = await switchLiveProfile(profileId, confirmProduction);
      if (result === "ready" || result === "paper") {
        closeDialog();
      } else if (result === "error") {
        const current = useLiveStore.getState();
        setLoadError(current.managerError ?? profileErrorMessage(current.reasonCode));
      }
    } catch (error: unknown) {
      setLoadError(error instanceof LiveApiError ? profileErrorMessage(error.code) : safeLoadError(error));
    } finally {
      setSwitchingTarget(null);
    }
  };

  const requestBinanceProfile = async (profileId: Exclude<LiveProfileId, "paper">) => {
    if (switching) return;
    try {
      const session = await liveApi.session();
      if (session.authenticated) {
        setCsrf(session.csrf ?? null);
        if (profileId === "binance-production") {
          setProductionChecked(false);
          setProductionConfirmation(true);
        } else {
          void startSwitch(profileId);
        }
        return;
      }
    } catch (error: unknown) {
      setLoadError(safeAuthError(error));
      return;
    }
    setAuthTarget(profileId);
    setAuthPassword("");
    setAuthError(null);
  };

  const authenticateForProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authTarget || authBusy || authPassword.length === 0) return;
    const target = authTarget;
    setAuthBusy(true);
    setAuthError(null);
    try {
      const session = await liveApi.login(authPassword);
      setCsrf(session.csrf);
      setLoadError(null);
      setAuthenticationRequired(false);
      const response = await liveApi.profiles();
      setProfiles(response.profiles);
      const profile = response.profiles.find((item) => item.profileId === target);
      if (!profile?.configured) {
        setAuthError("That Binance profile is not configured on the server.");
        return;
      }
      setAuthTarget(null);
      setAuthPassword("");
      if (target === "binance-production") {
        setProductionChecked(false);
        setProductionConfirmation(true);
      } else {
        void startSwitch(target);
      }
    } catch (error: unknown) {
      setAuthError(safeAuthError(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const selectProfile = (profile: ProfileMetadataDto) => {
    const unavailable = profile.profileId !== "paper" && !profile.configured && !authenticationRequired;
    if (switching || unavailable || (localUnavailable && profile.profileId !== "paper")) return;
    if (profile.profileId === "paper") {
      void startSwitch(profile.profileId);
      return;
    }
    void requestBinanceProfile(profile.profileId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70" onMouseDown={closeDialog}>
      <div className="w-[720px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[8px] border border-[#2a2e39] bg-[#131313] shadow-[0_16px_60px_rgba(0,0,0,0.6)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between px-5 pt-4 pb-3">
          <div>
            <div className="text-[18px] font-semibold text-white">Choose trading profile</div>
            <div className="mt-1 text-[12px] text-[#787b86]">Current: {currentLabel} · {currentStatus}</div>
          </div>
          <button ref={closeRef} type="button" aria-label="Close profile chooser" className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[#787b86] hover:bg-[#1a1a1a] hover:text-[#d1d4dc]" onClick={closeDialog}>
            <X size={16} />
          </button>
        </div>

        {switching ? (
          <div className="mx-5 mb-3 flex items-center gap-2 rounded-[6px] border border-[#2962ff]/40 bg-[#101827] px-3 py-2 text-[12px] text-[#d1d4dc]" role="status">
            <LoaderCircle size={14} className="animate-spin text-[#2962ff]" />
            Switching profile… Existing profile remains confirmed until the server reports readiness.
          </div>
        ) : null}
        {livePhase === "degraded" || livePhase === "failed" || livePhase === "detached" ? (
          <div className="mx-5 mb-3 flex items-start gap-2 rounded-[6px] border border-[#f23645]/40 bg-[#1a0b0d] px-3 py-2 text-[12px] text-[#f23645]" role="alert">
            <CircleAlert size={14} className="mt-0.5 shrink-0" />
            <span>{profileErrorMessage(liveReason)}{liveManagerError ? ` ${liveManagerError}.` : ""} {profilePhaseLabel(livePhase)}. Normal trading remains disabled until a ready profile is confirmed.</span>
          </div>
        ) : null}
        {loadError ? <div className="mx-5 mb-3 text-[12px] text-[#f0b90b]">{loadError}</div> : null}

        <div className="grid grid-cols-3 gap-3 px-5 pb-5">
          {loading ? <div className="col-span-3 flex items-center justify-center py-14 text-[12px] text-[#787b86]"><LoaderCircle size={16} className="mr-2 animate-spin" />Loading server profiles…</div> : null}
          {!loading && orderedProfiles.map((profile) => {
            const selected = activeProfile === profile.profileId && livePhase !== "switching";
            const unavailable = profile.profileId !== "paper" && !profile.configured && !authenticationRequired;
            const copy = PROFILE_COPY[profile.profileId];
            return (
              <button
                key={profile.profileId}
                type="button"
                disabled={switching || unavailable}
                aria-pressed={selected}
                onClick={() => selectProfile(profile)}
                className={`relative flex min-h-[190px] flex-col items-start rounded-[6px] border px-4 py-4 text-left transition-colors focus:outline-none focus:ring-1 focus:ring-[#2962ff] ${selected ? "border-[#089981] bg-[#071512]" : "border-[#2a2e39] bg-[#111111] hover:border-[#2962ff]"} disabled:cursor-not-allowed disabled:opacity-55`}
              >
                {selected ? <span className="absolute right-3 top-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#089981]"><Check size={12} />Active</span> : null}
                <ProfileMark profileId={profile.profileId} />
                <span className="mt-3 text-[14px] font-semibold text-[#d1d4dc]">{profile.label}</span>
                <span className="mt-1 text-[12px] leading-4 text-[#787b86]">{copy.description}</span>
                <span className="mt-auto flex items-center gap-1 pt-4 text-[11px] text-[#787b86]">
                  {unavailable
                    ? localUnavailable && profile.profileId !== "paper"
                      ? "Unavailable in local mode"
                      : "Not configured"
                    : authenticationRequired && profile.profileId !== "paper" && !selected
                      ? "Authentication required"
                      : selected
                        ? profile.profileId === "paper"
                          ? "Available · Active"
                          : livePhase === "degraded"
                            ? "Configured · Active · Degraded"
                            : "Configured · Active"
                        : profile.profileId === "paper"
                          ? "Available · Not active"
                          : "Configured · Not active"}
                  {!unavailable && !selected ? <ChevronRight size={13} /> : null}
                </span>
              </button>
            );
          })}
        </div>
        <div className="border-t border-[#2a2e39] px-5 py-3 text-[11px] text-[#787b86]">
          Server credentials and endpoints stay on the server. The browser receives only safe profile status.
        </div>
      </div>

      {authTarget ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onMouseDown={() => { setAuthTarget(null); setAuthPassword(""); setAuthError(null); }}>
          <form role="dialog" aria-modal="true" aria-labelledby="profile-auth-title" onSubmit={authenticateForProfile} className="w-[430px] max-w-[calc(100vw-32px)] rounded-[8px] border border-[#2a2e39] bg-[#171717] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.7)]" onMouseDown={(event) => event.stopPropagation()}>
            <div id="profile-auth-title" className="text-[16px] font-semibold text-white">Authenticate for {profileLabel(authTarget)}</div>
            <p className="mt-3 text-[13px] leading-5 text-[#d1d4dc]">Enter the server operator password to connect this profile.</p>
            <label className="mt-4 block text-[12px] text-[#787b86]" htmlFor="profile-operator-password">Operator password</label>
            <input
              id="profile-operator-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={authPassword}
              onChange={(event) => setAuthPassword(event.target.value)}
              className="mt-1 h-9 w-full rounded-[6px] border border-[#2a2e39] bg-[#111111] px-3 text-[13px] text-[#d1d4dc] outline-none focus:border-[#2962ff]"
            />
            {authError ? <div role="alert" className="mt-3 text-[12px] text-[#f23645]">{authError}</div> : null}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="rounded-[4px] px-3 py-2 text-[12px] text-[#787b86] hover:bg-[#222] hover:text-[#d1d4dc]" onClick={() => { setAuthTarget(null); setAuthPassword(""); setAuthError(null); }}>Cancel</button>
              <button type="submit" disabled={authBusy || authPassword.length === 0} className="rounded-[4px] bg-[#2962ff] px-3 py-2 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{authBusy ? "Authenticating…" : "Authenticate"}</button>
            </div>
          </form>
        </div>
      ) : null}

      {productionConfirmation ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onMouseDown={() => { setProductionConfirmation(false); setProductionChecked(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="production-confirm-title" className="w-[430px] max-w-[calc(100vw-32px)] rounded-[8px] border border-[#f0b90b]/50 bg-[#17130a] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.7)]" onMouseDown={(event) => event.stopPropagation()}>
            <div id="production-confirm-title" className="text-[16px] font-semibold text-[#f0b90b]">You are connecting to Binance Production.</div>
            <p className="mt-3 text-[13px] leading-5 text-[#d1d4dc]">This uses the server’s production credentials.</p>
            <p className="text-[13px] leading-5 text-[#d1d4dc]">Existing orders and positions will not be cancelled or closed.</p>
            <p className="text-[13px] leading-5 text-[#d1d4dc]">Switching may be blocked if exposure exists.</p>
            <label className="mt-4 flex cursor-pointer items-start gap-2 text-[12px] text-[#d1d4dc]">
              <input type="checkbox" checked={productionChecked} onChange={(event) => setProductionChecked(event.target.checked)} className="mt-0.5 accent-[#f0b90b]" />
              <span>I understand and want to continue.</span>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="rounded-[4px] px-3 py-2 text-[12px] text-[#787b86] hover:bg-[#241f13] hover:text-[#d1d4dc]" onClick={() => { setProductionConfirmation(false); setProductionChecked(false); }}>Cancel</button>
              <button type="button" disabled={!productionChecked || switching} className="rounded-[4px] bg-[#f0b90b] px-3 py-2 text-[12px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40" onClick={() => { setProductionConfirmation(false); void startSwitch("binance-production", true); }}>Connect Production</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
