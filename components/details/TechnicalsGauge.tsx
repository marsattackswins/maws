"use client";

import { useId } from "react";

function polar(cx: number, cy: number, deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * radius, y: cy - Math.sin(rad) * radius };
}

function arcPath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, startDeg, radius);
  const e = polar(cx, cy, endDeg, radius);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

export type GaugeLean =
  | "strongShort"
  | "short"
  | "neutral"
  | "long"
  | "strongLong";

const LEAN_LABEL: Record<GaugeLean, string> = {
  strongShort: "Strong sell",
  short: "Sell",
  neutral: "Neutral",
  long: "Buy",
  strongLong: "Strong buy",
};

/** Needle score 0 (strong sell) → 100 (strong buy). */
const LEAN_SCORE: Record<GaugeLean, number> = {
  strongShort: 10,
  short: 30,
  neutral: 50,
  long: 70,
  strongLong: 90,
};

/**
 * Gauge lean from HTF-independent bullish/bearish confluence (0–5 each).
 * HTF bias is visual-only and never feeds this.
 * 0–2 → Neutral; 3–4 → Long/Short; 5 → Strong long/short.
 * If both sides qualify, the stronger side wins; ties stay Neutral.
 */
export function leanFromScreener(bullishMet: number, bearishMet: number): GaugeLean {
  const longLean: GaugeLean | null =
    bullishMet >= 5 ? "strongLong" : bullishMet >= 3 ? "long" : null;
  const shortLean: GaugeLean | null =
    bearishMet >= 5 ? "strongShort" : bearishMet >= 3 ? "short" : null;

  if (longLean && shortLean) {
    if (bullishMet > bearishMet) return longLean;
    if (bearishMet > bullishMet) return shortLean;
    return "neutral";
  }
  return longLean ?? shortLean ?? "neutral";
}

/** Legacy RSI fallback for the details dock (not strategy-pegged). */
export function leanFromRsi(rsi: number): GaugeLean {
  const clamped = Math.max(0, Math.min(100, rsi));
  if (clamped >= 80) return "strongLong";
  if (clamped >= 60) return "long";
  if (clamped >= 40) return "neutral";
  if (clamped >= 20) return "short";
  return "strongShort";
}

/**
 * Technicals dial — five rounded segments (deep red → soft red → silver →
 * soft blue → deep blue) around a 200° sweep with clear gaps, a slim tapered
 * gradient needle and ONE bold label under the dial (the current lean).
 */
/** Dial sweep: SWEEP_HI (left end) down to SWEEP_LO (right end), symmetric
 *  about 90° (straight up) so Neutral sits dead-center. */
const SWEEP_HI = 190;
const SWEEP_LO = -10;
const SWEEP = SWEEP_HI - SWEEP_LO; // 200°
/** Segment colors: red (sell) → grey (neutral) → blue (buy). */
const COLORS = ["#f0334b", "#eb5f6d", "#c2c6cc", "#57a0f8", "#2962ff"];

export function TechnicalsGauge({
  lean,
  size = 265,
  stroke = 8,
}: {
  lean: GaugeLean;
  /** Rendered arc width (px) — pass a smaller number for a smaller dial. */
  size?: number;
  /** Segment stroke width — pass a smaller number for a thinner dial. */
  stroke?: number;
}) {
  const gid = useId().replaceAll(":", "");
  const score = LEAN_SCORE[lean];
  // Needle: 0 (left end) → 100 (right end) across the sweep.
  const angle = SWEEP_HI - (score / 100) * SWEEP;
  const label = LEAN_LABEL[lean];

  const cx = 150;
  const cy = 115;
  const r = 86;
  const STROKE = stroke;
  const GAP = 8;
  // Segment pitch centers the 5 segments on the sweep: segment i's center is
  // at SWEEP_HI − STEP·(i + 0.5); center 2 (the grey one) lands exactly on 90°.
  const STEP = SWEEP / 5;
  const segments = COLORS.map((color, i) => {
    const center = SWEEP_HI - STEP * (i + 0.5);
    const half = (STEP - GAP) / 2;
    return { color, from: center + half, to: center - half };
  });

  // Slim tapered needle: sharp tip inside the arc, short symmetric base at
  // the hub, tiny tail behind it.
  const tip = polar(cx, cy, angle, r - 18);
  const bl = polar(cx, cy, angle + 90, 3.25);
  const tail = polar(cx, cy, angle, -7);
  const br = polar(cx, cy, angle - 90, 3.25);
  const needle = [
    `M ${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`,
    `L ${bl.x.toFixed(2)} ${bl.y.toFixed(2)}`,
    `L ${tail.x.toFixed(2)} ${tail.y.toFixed(2)}`,
    `L ${br.x.toFixed(2)} ${br.y.toFixed(2)}`,
    "Z",
  ].join(" ");

  return (
    <div className="px-3 pb-3 pt-1">
      <div className="mb-0.5 text-[13px] font-semibold text-(--app-text)">Technicals</div>
      <svg viewBox="0 0 300 190" width="100%" style={{ maxWidth: size }} className="mx-auto block shrink-0">
        <defs>
          <linearGradient id={`${gid}-needle`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f7f8fa" />
            <stop offset="100%" stopColor="#d4d7dc" />
          </linearGradient>
        </defs>
        {segments.map((s) => (
          <path
            key={s.from}
            d={arcPath(cx, cy, r, s.from, s.to)}
            fill="none"
            stroke={s.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        ))}
        <path d={needle} fill={`url(#${gid}-needle)`} />
        <text
          x={cx}
          y={cy + 48}
          fill="#ffffff"
          fontSize="22"
          fontWeight="700"
          textAnchor="middle"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
