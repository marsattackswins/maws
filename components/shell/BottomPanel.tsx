"use client";

import { PositionsPanel, TradingMetrics } from "@/components/trading/PositionsPanel";
import { liveApi } from "@/lib/live/api";
import { profileLabel, profilePhaseLabel } from "@/lib/live/bridge";
import { useLiveStore } from "@/lib/live/store";
import type { LiveProfilePhase } from "@/lib/live/types";
import type { BrokerId } from "@/lib/brokers";
import { useAppStore } from "@/lib/store";
import { timezoneIana } from "@/lib/timezone";
import { useEffect, useRef, useState } from "react";

export const PANEL_TABS = [
  { id: "positions", label: "Positions" },
  { id: "orders", label: "Orders" },
  { id: "orderHistory", label: "Order History" },
  { id: "balanceHistory", label: "Balance History" },
  { id: "journal", label: "Trading Journal" },
] as const;

export const PANEL_TOOLBAR_HEIGHT = 32;
export const PANEL_TAB_CLASS =
  "relative top-0 box-border flex h-[22px] min-h-[22px] appearance-none items-center justify-center rounded-full border-0 px-3 py-0 text-[12px] font-semibold leading-[22px] outline-none focus:outline-none focus-visible:ring-0 active:top-0 active:translate-y-0";

export function isPanelTabActive(tab: string, open: boolean, itemId: string): boolean {
  return tab === itemId && open;
}

const TAB_H = PANEL_TOOLBAR_HEIGHT;

function availablePanelHeight(section: HTMLElement | null): number {
  const parentHeight = section?.parentElement?.clientHeight || window.innerHeight;
  const next = section?.nextElementSibling;
  const replayHeight = next instanceof HTMLElement ? next.offsetHeight : 0;
  return Math.max(160, parentHeight - replayHeight);
}

function applicationHeight(section: HTMLElement | null): number {
  const shell = section?.closest<HTMLElement>("[data-app-shell]");
  return shell?.clientHeight || window.innerHeight;
}

export function panelHeightLimit(availableHeight: number, applicationHeight: number): number {
  return Math.max(0, Math.min(availableHeight, Math.round(applicationHeight / 2)));
}

function sectionHeightLimit(section: HTMLElement | null): number {
  return panelHeightLimit(availablePanelHeight(section), applicationHeight(section));
}

export function formatPanelDateTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneIana(timezone),
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function PanelDateTime() {
  const timezone = useAppStore((s) => s.chartSettings.timezone);
  const [value, setValue] = useState("");

  useEffect(() => {
    const update = () => {
      setValue(formatPanelDateTime(new Date(), timezone));
    };
    update();
    const id = window.setInterval(update, 1_000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <time
      className="ml-2 shrink-0 whitespace-nowrap border-l border-[var(--maws-border)] pl-2 text-[11px] text-[#787b86]"
      dateTime={value || undefined}
      aria-label="Current date and time"
    >
      {value || "—"}
    </time>
  );
}

type LiveAttachmentSnapshot = {
  attached: boolean;
  phase: LiveProfilePhase;
  ready: boolean;
};

/**
 * The panel follows confirmed attachment, not a requested or selected profile.
 * During a live switch, `attached` remains true only for the prior confirmed
 * attachment, so that panel stays visible until the replacement is ready.
 */
export function hasConfirmedBroker(
  connected: BrokerId | null,
  live: LiveAttachmentSnapshot,
): boolean {
  if (connected === "mock") return true;
  if (connected !== "binance" || !live.attached) return false;
  return (live.phase === "ready" && live.ready) || live.phase === "switching";
}

function LiveStatusIndicator() {
  const envLabel = useLiveStore((s) => s.envLabel);
  const health = useLiveStore((s) => s.health);
  const stream = useLiveStore((s) => s.stream);
  const [busy, setBusy] = useState(false);

  const decision = health?.execution;
  const canSubmit = decision?.canSubmit === true;
  const frozen = decision?.frozen === true;
  const killSwitch = decision?.killSwitch === true;
  const streamOn = stream?.connected === true;
  const statusTone = canSubmit ? "text-[#089981]" : frozen ? "text-[#f23645]" : "text-[#ff9800]";
  const statusLabel = canSubmit
    ? "Ready"
    : frozen
      ? "Frozen"
      : killSwitch
        ? "Kill switch on"
        : "Blocked";

  const toggleKillSwitch = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await liveApi.setGates({ killSwitch: !killSwitch });
      const meta = await liveApi.meta();
      useLiveStore.getState().setHealth(meta.health);
    } catch {
      useLiveStore.getState().notify("error", "Failed to update kill switch");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ml-1 flex min-w-0 shrink-0 items-center gap-2 text-[11px]" role="status">
      <span className="font-semibold text-[#2962ff]">{envLabel ?? "Binance"}</span>
      <span className={`font-semibold ${statusTone}`}>{statusLabel}</span>
      <span className="text-[var(--maws-muted)]">
        Stream: <span className={streamOn ? "text-[#089981]" : "text-[#f23645]"}>{streamOn ? "live" : "down"}</span>
      </span>
      {frozen && decision?.frozenReason ? (
        <span className="max-w-[180px] truncate text-[#f23645]" title={decision.frozenReason}>
          {decision.frozenReason}
        </span>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          void toggleKillSwitch();
        }}
        className={`rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${
          killSwitch ? "bg-[#089981] text-black" : "bg-[#f23645] text-white"
        } ${busy ? "opacity-60" : ""}`}
        title="Toggle the emergency kill switch (blocks all submissions)"
      >
        {killSwitch ? "Resume trading" : "Kill switch"}
      </button>
    </div>
  );
}

function LiveProfileStatus() {
  const connectedBroker = useAppStore((s) => s.connectedBroker);
  const liveProfileId = useLiveStore((s) => s.profileId);
  const livePhase = useLiveStore((s) => s.phase);
  const liveReady = useLiveStore((s) => s.ready);

  if (connectedBroker !== "binance") return null;
  if (liveProfileId) {
    return (
      <span
        className={`ml-1 flex h-[28px] items-center gap-1.5 rounded-full border px-3 text-[11px] ${liveReady && livePhase === "ready" ? "border-[#089981]/40 text-[#089981]" : "border-[#f0b90b]/40 text-[#f0b90b]"}`}
        title={`${profileLabel(liveProfileId)} · ${profilePhaseLabel(livePhase)}`}
      >
        <span className="max-w-[120px] truncate">{profileLabel(liveProfileId)}</span>
        <span>· {profilePhaseLabel(livePhase)}</span>
      </span>
    );
  }
  if (livePhase === "failed" || livePhase === "detached") {
    return (
      <span className="ml-1 flex h-[28px] items-center gap-1.5 rounded-full border border-[#f0b90b]/40 px-3 text-[11px] text-[#f0b90b]" role="status">
        <span>Live profile unavailable</span>
        <span>· {profilePhaseLabel(livePhase)}</span>
      </span>
    );
  }
  return null;
}

export function BottomPanel() {
  const sectionRef = useRef<HTMLElement>(null);
  const connected = useAppStore((s) => s.connectedBroker);
  const liveAttached = useLiveStore((s) => s.attached);
  const livePhase = useLiveStore((s) => s.phase);
  const liveReady = useLiveStore((s) => s.ready);
  const open = useAppStore((s) => s.bottomOpen);
  const height = useAppStore((s) => s.bottomHeight);
  const setBottomHeight = useAppStore((s) => s.setBottomHeight);
  const tab = useAppStore((s) => s.bottomTab);
  const toggleBottomTab = useAppStore((s) => s.toggleBottomTab);
  const fallbackHeightLimit =
    typeof window === "undefined" ? 160 : Math.round(window.innerHeight / 2);
  const [heightLimit, setHeightLimit] = useState(fallbackHeightLimit);
  const hasAttachment = hasConfirmedBroker(connected, {
    attached: liveAttached,
    phase: livePhase,
    ready: liveReady,
  });

  useEffect(() => {
    if (!hasAttachment) return;
    const section = sectionRef.current;
    if (!section) return;
    const shell = section.closest<HTMLElement>("[data-app-shell]");
    const update = () => setHeightLimit(sectionHeightLimit(section));
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(shell ?? section.parentElement ?? section);
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [hasAttachment]);

  if (!hasAttachment) return null;

  const renderedHeight = open ? Math.min(height, heightLimit) : TAB_H;

  return (
    <section
      ref={sectionRef}
      className="relative z-[60] flex shrink-0 flex-col border-t"
      style={{
        height: renderedHeight,
        background: "var(--maws-panel)",
        borderColor: "var(--maws-border)",
      }}
    >
      {open ? (
        <>
          <div
            className="absolute -top-1 left-0 z-10 h-2 w-full cursor-row-resize"
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const startH = height;
              const section = e.currentTarget.closest<HTMLElement>("section");
              const move = (ev: MouseEvent) => {
                const maxH = sectionHeightLimit(section);
                setBottomHeight(Math.min(maxH, Math.max(160, startH - (ev.clientY - startY))));
              };
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
          />
          <div className="min-h-0 flex-1 pb-[32px]">
            <PositionsPanel />
          </div>
        </>
      ) : null}

      <div
        className="absolute bottom-0 left-0 right-0 box-border flex h-[32px] min-h-[32px] items-center gap-1 border-t px-2"
        style={{ borderColor: open ? "var(--maws-border)" : "transparent" }}
      >
        <div className="flex min-w-0 shrink-0 items-center gap-1">
          {PANEL_TABS.map((item) => {
            const on = isPanelTabActive(tab, open, item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleBottomTab(item.id)}
                className={PANEL_TAB_CLASS}
                style={
                  on
                    ? { background: "#d1d4dc", color: "#131722" }
                    : {
                        background: "var(--maws-elevated)",
                        color: "var(--maws-text)",
                      }
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {connected === "binance" ? (
          <>
            <LiveProfileStatus />
            <LiveStatusIndicator />
          </>
        ) : null}
        <TradingMetrics />
        <PanelDateTime />
      </div>
    </section>
  );
}
