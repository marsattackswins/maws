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
/**
 * Plain text tab. The active underline is a 2px pseudo-element a few px above
 * the button's bottom edge (a bottom border would sit flush with the panel
 * edge and disappear against it), spanning exactly the label width.
 */
export const PANEL_TAB_CLASS =
  "relative box-border flex h-[32px] min-h-[32px] appearance-none items-center justify-center bg-transparent px-3 py-0 text-[12px] font-medium leading-none outline-none after:absolute after:inset-x-3 after:bottom-[4px] after:h-[2px] after:rounded-full after:content-[\"\"] after:bg-transparent focus:outline-none focus-visible:ring-0";

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

/** Compact panel stamp: "Sep 14 · 3:44 PM" (no year, per the toolbar design). */
export function formatPanelDateTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezoneIana(timezone),
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(",", " ·");
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

type StatusTone = "blue" | "green" | "yellow" | "red";

const STATUS_COLOR: Record<StatusTone, string> = {
  blue: "#2962ff",
  green: "#089981",
  yellow: "#f0b90b",
  red: "#f23645",
};

function StatusDot({ tone, pulse = false }: { tone: StatusTone; pulse?: boolean }) {
  return (
    <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
      {pulse ? (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50" style={{ backgroundColor: STATUS_COLOR[tone] }} />
      ) : null}
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[tone] }} />
    </span>
  );
}

function StatusItem({ marker, text, tone, pulse = false, title }: { marker: string; text: string; tone: StatusTone; pulse?: boolean; title: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] leading-none" title={title} data-status={marker}>
      <StatusDot tone={tone} pulse={pulse} />
      <span className="font-medium" style={{ color: STATUS_COLOR[tone] }}>
        {text}
      </span>
    </span>
  );
}

function LiveStatusIndicator() {
  const envLabel = useLiveStore((s) => s.envLabel);
  const liveProfileId = useLiveStore((s) => s.profileId);
  const livePhase = useLiveStore((s) => s.phase);
  const liveReady = useLiveStore((s) => s.ready);
  const health = useLiveStore((s) => s.health);
  const stream = useLiveStore((s) => s.stream);
  const [busy, setBusy] = useState(false);

  const decision = health?.execution;
  const canSubmit = decision?.canSubmit === true;
  const frozen = decision?.frozen === true;
  const killSwitch = decision?.killSwitch === true;
  const streamOn = stream?.connected === true;
  const connectionReady = liveReady && livePhase === "ready";

  const env = envLabel ?? "Binance";
  const envTone: StatusTone = /prod/i.test(env) ? "green" : /test/i.test(env) ? "blue" : "yellow";

  const connection: { text: string; tone: StatusTone; pulse: boolean } = livePhase === "switching"
    ? { text: "Switching", tone: "yellow", pulse: true }
    : connectionReady
      ? { text: "Connected", tone: "green", pulse: false }
      : livePhase === "failed" || livePhase === "detached"
        ? { text: "Unavailable", tone: "red", pulse: false }
        : { text: "Checking", tone: "yellow", pulse: true };

  const orders: { text: string; tone: StatusTone; pulse: boolean } = canSubmit
    ? { text: "Orders open", tone: "green", pulse: false }
    : frozen
      ? { text: "Orders frozen", tone: "red", pulse: false }
      : killSwitch
        ? { text: "Orders stopped", tone: "red", pulse: false }
        : decision == null
          ? { text: "Orders checking", tone: "yellow", pulse: true }
          : { text: "Orders blocked", tone: "yellow", pulse: false };

  const streamStatus: { text: string; tone: StatusTone; pulse: boolean } = stream == null
    ? { text: "Stream checking", tone: "yellow", pulse: true }
    : streamOn
      ? { text: "Stream live", tone: "green", pulse: true }
      : { text: "Stream down", tone: "red", pulse: false };

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

  const separator = <span className="h-3 w-px shrink-0 bg-[var(--maws-border)]" />;

  return (
    <div className="ml-2 flex min-w-0 shrink-0 items-center gap-2" role="status" aria-label="Live trading status">
      <StatusItem
        marker="env"
        text={env}
        tone={envTone}
        title={liveProfileId ? profileLabel(liveProfileId) : "Trading environment"}
      />
      {separator}
      <StatusItem marker="connection" text={connection.text} tone={connection.tone} pulse={connection.pulse} title={profilePhaseLabel(livePhase)} />
      {separator}
      <StatusItem
        marker="orders"
        text={orders.text}
        tone={orders.tone}
        pulse={orders.pulse}
        title={frozen && decision?.frozenReason ? decision.frozenReason : "Whether new order submissions are currently allowed"}
      />
      {separator}
      <StatusItem marker="stream" text={streamStatus.text} tone={streamStatus.tone} pulse={streamStatus.pulse} title="Private account stream status" />
      {separator}
      <button
        type="button"
        disabled={busy}
        aria-pressed={killSwitch}
        onClick={() => {
          void toggleKillSwitch();
        }}
        className={`inline-flex h-[20px] shrink-0 items-center rounded-full border px-2 text-[10px] font-semibold uppercase tracking-wide transition-colors disabled:cursor-wait disabled:opacity-60 ${
          killSwitch
            ? "border-[#f23645] bg-[#f23645] text-white hover:bg-[#d92f3d]"
            : "border-[#f23645]/50 bg-transparent text-[#f23645] hover:bg-[#f23645]/10"
        }`}
        title={killSwitch ? "Click to resume new order submissions" : "Click to engage the emergency kill switch and block new order submissions"}
      >
        {busy ? "···" : killSwitch ? "Kill switch ON" : "Kill switch"}
      </button>
    </div>
  );
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
        {connected === "binance" ? <LiveStatusIndicator /> : null}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {PANEL_TABS.map((item) => {
            const on = isPanelTabActive(tab, open, item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleBottomTab(item.id)}
                className={`${PANEL_TAB_CLASS} ${on ? "after:bg-white" : ""}`}
                style={on ? { color: "#ffffff" } : { color: "var(--maws-text)" }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <TradingMetrics />
        <PanelDateTime />
      </div>
    </section>
  );
}
