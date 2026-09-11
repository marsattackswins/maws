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
  strongShort: "Strong short",
  short: "Short",
  neutral: "Neutral",
  long: "Long",
  strongLong: "Strong long",
};

/** Needle score 0 (strong short) → 100 (strong long). */
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

export function TechnicalsGauge({ lean }: { lean: GaugeLean }) {
  const gid = useId().replaceAll(":", "");
  const score = LEAN_SCORE[lean];
  const angle = 180 - (score / 100) * 180;
  const label = LEAN_LABEL[lean];

  const cx = 150;
  const cy = 150;
  const r = 95;
  const tip = polar(cx, cy, angle, r - 16);

  const around: { text: string; deg: number; extra: number }[] = [
    { text: "Short", deg: 138, extra: 26 },
    { text: "Neutral", deg: 90, extra: 28 },
    { text: "Long", deg: 42, extra: 26 },
  ];

  return (
    <div className="px-3 pb-3 pt-1">
      <div className="mb-0.5 text-[13px] font-semibold text-[#d1d4dc]">Technicals</div>
      <svg viewBox="0 0 300 220" width={220} height={161} className="mx-auto block shrink-0">
        <defs>
          <linearGradient id={`${gid}-arc`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f23645" />
            <stop offset="20%" stopColor="#e04080" />
            <stop offset="50%" stopColor="#9c27b0" />
            <stop offset="80%" stopColor="#5c6bc0" />
            <stop offset="100%" stopColor="#2962ff" />
          </linearGradient>
        </defs>
        <path
          d={arcPath(cx, cy, r, 180, 0)}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="7"
          strokeLinecap="butt"
        />
        <path
          d={arcPath(cx, cy, r, 174, 6)}
          fill="none"
          stroke={`url(#${gid}-arc)`}
          strokeWidth="5.5"
          strokeLinecap="butt"
        />
        {around.map((item) => {
          const p = polar(cx, cy, item.deg, r + item.extra);
          return (
            <text
              key={item.text}
              x={p.x}
              y={p.y}
              fill="#d1d4dc"
              fontSize="12"
              fontWeight="600"
              fontFamily="Trebuchet MS, sans-serif"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {item.text}
            </text>
          );
        })}
        <text
          x={cx - r}
          y={cy + 22}
          fill="#d1d4dc"
          fontSize="12"
          fontWeight="600"
          fontFamily="Trebuchet MS, sans-serif"
          textAnchor="middle"
        >
          Strong short
        </text>
        <text
          x={cx + r}
          y={cy + 22}
          fill="#d1d4dc"
          fontSize="12"
          fontWeight="600"
          fontFamily="Trebuchet MS, sans-serif"
          textAnchor="middle"
        >
          Strong long
        </text>
        <line
          x1={cx}
          y1={cy}
          x2={tip.x}
          y2={tip.y}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="3.25" fill="#ffffff" />
        <text
          x={cx}
          y={cy + 40}
          fill="#ffffff"
          fontSize="16"
          fontWeight="700"
          fontFamily="Trebuchet MS, sans-serif"
          textAnchor="middle"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
