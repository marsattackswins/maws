"use client";

/**
 * MarketSessions.tsx — the watchlist's Sessions card: a 24-hour strip of the three cash
 * sessions, for every instrument, with the live one named above it.
 *
 * Adapted from the market-sessions widget of the Vela playground
 * (github.com/infinitegithub/vela `playground/watchlist-panel.ts`), which mirrors the
 * card the official Vela client renders under its watchlist. Vela is © LuxAlgo,
 * Apache-2.0 — the same attribution the vendored `lib/charting` carries.
 *
 * The card is a world clock, the same for every instrument: three cash sessions and
 * which of them is running right now. BTCUSDT.P and XAUUSDT.P both show Tokyo, London
 * and New York — a 24/7 asset is still "in" a session, and gold keeps trading through
 * Asia even though its home market is London. There is no "always open" row, because
 * the card answers "which session in time are we in?".
 *
 * The widget's animated world map is gone: the strip is the whole card.
 */

import {
  MARKET_SESSIONS,
  clockLabel,
  hourLabel,
  isSessionOpen,
  sessionDayRuns,
  sessionState,
  type SessionDef,
  type SessionState,
} from "@/lib/market-sessions";
import { useEffect, useRef, useState } from "react";

/** Roomier than the widget's own pitch: three rows with air between them read better
 * than a tight block, and nothing else on the card competes for the space. */
const TIMELINE_ROW_TOP = 8;
const TIMELINE_ROW_PITCH = 23;
/** Session pill height — taller than the rail it rides, so live windows read raised. */
const TIMELINE_ROW_HEIGHT = 8;
/** The rail every session rides: a quiet 4px hairline instead of a second full bar. */
const TIMELINE_TRACK_HEIGHT = 4;
/** Hour-label gutter under the rows. The chip on the axis sits on its baseline, so this
 * is what sets how far the time strip sits below the last session bar: rows end at
 * ROW_TOP + 2*PITCH + ROW_HEIGHT = 62, and the axis starts ~22px lower. */
const TIMELINE_AXIS_GUTTER = 40;
/** Row-label gutter — a colour pip plus the longest venue name ("New York"). */
const TIMELINE_LABEL_WIDTH = 66;

/** One timeline row per venue, plus the hour-label gutter under them. */
function timelineHeight(rows: number): number {
  return (
    TIMELINE_ROW_TOP + (rows - 1) * TIMELINE_ROW_PITCH + TIMELINE_ROW_HEIGHT + TIMELINE_AXIS_GUTTER
  );
}

/** The card's rows: the same three cash sessions for every instrument. */
const VENUES: readonly SessionDef[] = MARKET_SESSIONS;

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

type Ink = {
  light: boolean;
  /** Session rail behind the pills. */
  track: string;
  /** Row label of a session that is trading right now. */
  label: string;
  /** Row labels / axis ticks for the quiet rows. */
  hour: string;
  now: string;
  /** Chip behind the live clock on the axis. */
  chip: string;
};

const DARK_INK: Ink = {
  light: false,
  track: "rgba(255,255,255,0.055)",
  label: "#e6e8ef",
  hour: "#6d6d76",
  now: "#ffffff",
  chip: "rgba(255,255,255,0.07)",
};

const LIGHT_INK: Ink = {
  light: true,
  track: "rgba(17,19,24,0.07)",
  label: "#23262f",
  hour: "#8b8f9a",
  now: "#111318",
  chip: "rgba(17,19,24,0.055)",
};

/** Hex → `rgba()` with an explicit alpha (the canvas has no colour-alpha helper). */
function withAlpha(hex: string, a: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Lift a session colour toward white for the pill's top highlight. */
function lift(hex: string, amount: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const up = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${up((n >> 16) & 255)}, ${up((n >> 8) & 255)}, ${up(n & 255)})`;
}

/** `roundRect` with a squared fallback; the radius never exceeds half the shorter side. */
function pill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.max(0, Math.min(r, h / 2, w / 2));
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, Math.max(1, w), h, radius);
  else ctx.rect(x, y, Math.max(1, w), h);
}

/** Canvas letter-spacing is optional in the DOM lib; set it only where the engine has it. */
function tracking(ctx: CanvasRenderingContext2D, value: string): void {
  const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  if ("letterSpacing" in c) c.letterSpacing = value;
}

/** Size a canvas for the device pixel ratio and hand back a CSS-pixel context. */
function fitCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
): [CanvasRenderingContext2D, number, number] {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(80, Math.round(cssWidth));
  const h = Math.max(20, Math.round(cssHeight));
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx as CanvasRenderingContext2D, w, h];
}

/** The 24-hour strip: a quiet rail per session, filled windows as raised pills, and a
 *  hairline at "now" that fades into the axis. */
function drawTimeline(
  ctx: CanvasRenderingContext2D,
  w: number,
  at: number,
  ink: Ink,
  venues: readonly SessionDef[],
): void {
  const h = timelineHeight(venues.length);
  ctx.clearRect(0, 0, w, h);
  const x0 = TIMELINE_LABEL_WIDTH;
  const trackW = w - x0 - 2;
  const now = new Date(at);
  const minuteOfDay = now.getUTCHours() * 60 + now.getUTCMinutes();
  const rowsBottom =
    TIMELINE_ROW_TOP + (venues.length - 1) * TIMELINE_ROW_PITCH + TIMELINE_ROW_HEIGHT;

  venues.forEach((session, i) => {
    const y = TIMELINE_ROW_TOP + i * TIMELINE_ROW_PITCH;
    const centre = y + TIMELINE_ROW_HEIGHT / 2;

    // Rail: a hairline the pills ride on, not a second full-height bar.
    ctx.fillStyle = ink.track;
    pill(ctx, x0, centre - TIMELINE_TRACK_HEIGHT / 2, trackW, TIMELINE_TRACK_HEIGHT, 2);
    ctx.fill();

    const open = isSessionOpen(session, at);
    // Colour pip + micro-caps name tie the row to its pill; quiet rows recede.
    ctx.globalAlpha = open ? 1 : 0.5;
    ctx.fillStyle = session.color;
    ctx.beginPath();
    ctx.arc(3, centre, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = `${open ? "600" : "500"} 9px ${FONT}`;
    tracking(ctx, "0.08em");
    ctx.textAlign = "left";
    ctx.fillStyle = open ? ink.label : ink.hour;
    ctx.fillText(session.name.toUpperCase(), 11, centre + 3);

    for (const [a, b] of sessionDayRuns(session, at)) {
      const live = minuteOfDay >= a && minuteOfDay < b;
      const runX = x0 + (a / 1440) * trackW;
      const runW = ((b - a) / 1440) * trackW;
      // Vertical sheen: a lifted top edge reads as a rounded solid, not a flat block.
      const grad = ctx.createLinearGradient(0, y, 0, y + TIMELINE_ROW_HEIGHT);
      grad.addColorStop(0, lift(session.color, live ? 0.2 : 0.1));
      grad.addColorStop(1, session.color);
      ctx.fillStyle = grad;
      ctx.globalAlpha = live ? 1 : 0.45;
      if (live) {
        // A soft bloom under the running window — lit, never glued on.
        ctx.shadowColor = withAlpha(session.color, 0.5);
        ctx.shadowBlur = 7;
      }
      pill(ctx, runX, y, runW, TIMELINE_ROW_HEIGHT, TIMELINE_ROW_HEIGHT / 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.globalAlpha = 1;
    }
  });

  const x = x0 + (minuteOfDay / 1440) * trackW;
  const axisY = h - 7;
  const label = clockLabel(at);

  // Axis ticks in quiet micro-type; the live chip owns the stretch around "now".
  ctx.font = `500 9px ${FONT}`;
  tracking(ctx, "0.04em");
  ctx.fillStyle = ink.hour;
  const chipW = Math.ceil(ctx.measureText(label).width) + 14;
  const ticks: Array<{ hour: number; align: CanvasTextAlign }> = [
    { hour: 0, align: "left" },
    { hour: 6, align: "center" },
    { hour: 12, align: "center" },
    { hour: 18, align: "center" },
    { hour: 24, align: "right" },
  ];
  for (const tick of ticks) {
    const tickX = x0 + (tick.hour / 24) * trackW;
    if (Math.abs(tickX - x) < chipW / 2 + 8) continue;
    ctx.textAlign = tick.align;
    ctx.fillText(hourLabel(tick.hour), tickX, axisY);
  }

  // The live clock rides a soft chip — the one number worth reading off the axis.
  ctx.font = `600 9px ${FONT}`;
  tracking(ctx, "0.02em");
  const chipX = Math.min(w - chipW / 2 - 1, Math.max(x0 + chipW / 2 - 4, x));
  ctx.fillStyle = ink.chip;
  pill(ctx, chipX - chipW / 2, axisY - 10.5, chipW, 15, 7.5);
  ctx.fill();
  ctx.fillStyle = ink.now;
  ctx.textAlign = "center";
  ctx.fillText(label, chipX, axisY - 0.5);
  tracking(ctx, "0px");

  // Now marker: a hairline that fades downward, capped with a single dot.
  const marker = ctx.createLinearGradient(0, 0, 0, rowsBottom + 4);
  marker.addColorStop(0, withAlpha(ink.now, 0.45));
  marker.addColorStop(1, withAlpha(ink.now, 0.1));
  ctx.strokeStyle = marker;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, 1.5);
  ctx.lineTo(x, rowsBottom + 2);
  ctx.stroke();
  ctx.fillStyle = ink.now;
  ctx.beginPath();
  ctx.arc(x, 1.5, 2, 0, Math.PI * 2);
  ctx.fill();
}

function countdownText(minutes: number): string {
  if (minutes < 60) return `Opens in ${minutes}m`;
  return `Opens in ${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/** Ink follows the shell theme: the card's own background decides light or dark. */
function inkFor(element: HTMLElement): Ink {
  const styles = getComputedStyle(element);
  const hex = styles.getPropertyValue("--app-elevated").trim();
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex) ?? /^#([0-9a-fA-F]{3})$/.exec(hex);
  if (!m) return DARK_INK;
  const raw = m[1]!;
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? LIGHT_INK : DARK_INK;
}

const BADGE_STYLE: Record<SessionState["badge"], { color: string; background: string; border: string }> = {
  Open: { color: "#2fbd85", background: "transparent", border: "rgba(47,189,133,.45)" },
  Overlap: { color: "#0b2019", background: "#2fbd85", border: "#2fbd85" },
  Closed: { color: "var(--app-muted)", background: "var(--app-hover)", border: "var(--app-border)" },
};

export function MarketSessions() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<SessionState>(() => sessionState(Date.now()));

  useEffect(() => {
    const host = hostRef.current;
    const timelineCanvas = timelineRef.current;
    if (!host || !timelineCanvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    let timelineW = 0;
    let ink = inkFor(host);

    const paint = () => {
      if (ctx) drawTimeline(ctx, timelineW, Date.now(), ink, VENUES);
    };

    const resize = () => {
      const width = Math.max(120, Math.round(host.clientWidth - 24));
      [ctx, timelineW] = fitCanvas(timelineCanvas, width, timelineHeight(VENUES.length));
      paint();
    };

    resize();
    // The strip is static, so a once-a-second tick is all it needs: the text rows and
    // the "now" line both move on the minute.
    const textTimer = window.setInterval(() => {
      setState(sessionState(Date.now()));
      ink = inkFor(host);
      paint();
    }, 1000);

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
    observer?.observe(host);
    window.addEventListener("resize", resize);

    return () => {
      window.clearInterval(textTimer);
      window.removeEventListener("resize", resize);
      observer?.disconnect();
    };
  }, []);

  const badge = BADGE_STYLE[state.badge];
  // No countdown means nothing is waiting to open: every session of the clock is live.
  const nextLabel = state.next ? `Next · ${state.next.session.name}` : "All sessions open";

  return (
    <div className="px-3 pt-3">
      {/* Only the label and the live state: the strip names the sessions itself, so the
          old "London + New York" headline is gone. */}
      <div className="mb-0.5 flex items-center justify-between gap-2">
        <div className="text-[13px] font-semibold text-(--app-text)">Sessions</div>
        <span
          className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
          style={{ color: badge.color, background: badge.background, borderColor: badge.border }}
        >
          {state.badge}
        </span>
      </div>
      <div
        ref={hostRef}
        className="rounded-[8px] border border-(--app-border) bg-(--app-elevated) px-3 py-2.5"
      >
        <canvas ref={timelineRef} className="mt-2 block w-full" aria-hidden="true" />

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-(--app-border) pt-2.5 text-[11px]">
          <span className="flex min-w-0 items-center gap-1.5 text-(--app-text)">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a7be94]" />
            <span className="truncate">{nextLabel}</span>
          </span>
          <span className="shrink-0 tabular-nums text-(--app-muted)">
            {state.next ? countdownText(state.nextInMinutes) : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
