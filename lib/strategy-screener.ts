import {
  computeAdx,
  computeEma,
  computeStochastic,
  computeVwap,
} from "@/lib/indicators";
import type { Candle } from "@/types";

/** Higher timeframe used to derive the trade bias for 1m scalps. */
export const HTF_TIMEFRAME = "15m" as const;

/**
 * Bars needed for the slowest study (Stoch 60.10) plus headroom.
 * Cap analysis here so watchlist-wide screener work stays O(1) per symbol.
 */
export const STRATEGY_ANALYZE_BARS = 280;

export type SetupDirection = "long" | "short" | "none";

export type CondStatus = "pass" | "wait" | "block" | "info";

export type ConditionId =
  | "htfBias"
  | "vwap"
  | "stochFast"
  | "stochMid"
  | "stochSlow"
  | "adx";

export type StrategyCondition = {
  id: ConditionId;
  label: string;
  status: CondStatus;
  /** Human readable detail shown in the checklist. */
  detail: string;
  /** Raw indicator value used for sorting / filtering. */
  value: number | null;
  /** Secondary display value (e.g. the D line, the band price). */
  aux: number | null;
};

export type SetupState = "ready" | "waiting" | "blocked";

export type StrategyRow = {
  symbol: string;
  direction: SetupDirection;
  /** Live setup state (includes the forming bar). */
  state: SetupState;
  /** Number of conditions with status "pass" (live). */
  met: number;
  /** Total evaluated conditions (excludes the neutral-bias "none" no-op). */
  total: number;
  /**
   * HTF-independent bullish confluence (0–5): above VWAP, stochs oversold,
   * ADX ≥ 20. Used by the technicals gauge — HTF bias is visual-only.
   */
  bullishMet: number;
  /**
   * HTF-independent bearish confluence (0–5): below VWAP, stochs overbought,
   * ADX ≥ 20. Used by the technicals gauge — HTF bias is visual-only.
   */
  bearishMet: number;
  price: number | null;
  conditions: StrategyCondition[];
  /** Setup state evaluated on closed candles only (null while warming up). */
  confirmedState: SetupState | null;
  /** Conditions met on the last closed candle (null while warming up). */
  confirmedMet: number | null;
  /** Updated at (ms). */
  at: number;
};

/** Drop the forming bar; keep only confirmed closed candles. */
export function closedCandles(candles: Candle[]): Candle[] {
  if (candles.length === 0) return candles;
  // The last candle in the live feed is the bar currently forming.
  return candles.slice(0, -1);
}

function lastDefined(values: (number | null)[]): number | null {
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] != null) return values[i];
  }
  return null;
}

function emaTrend(candles: Candle[], fast: number, slow: number): SetupDirection {
  if (candles.length < slow + 1) return "none";
  const fastEma = computeEma(candles, fast);
  const slowEma = computeEma(candles, slow);
  const f = lastDefined(fastEma);
  const s = lastDefined(slowEma);
  if (f == null || s == null) return "none";
  const price = candles[candles.length - 1].close;
  if (f > s && price > f) return "long";
  if (f < s && price < f) return "short";
  return "none";
}

type StochPair = { d: number | null };

function stochSnapshot(
  candles: Candle[],
  length: number,
  kSmooth: number,
  dSmooth: number,
): StochPair {
  const { d } = computeStochastic(candles, length, kSmooth, dSmooth);
  return { d: lastDefined(d) };
}

/** Stoch condition from D-line zone only — no HTF direction. */
function stochDCondition(
  id: ConditionId,
  label: string,
  d: number | null,
): StrategyCondition {
  if (d == null) {
    return { id, label, status: "wait", detail: "Warming up", value: null, aux: null };
  }
  const zone = d >= 80 ? "overbought" : d <= 20 ? "oversold" : "neutral";
  const status: CondStatus = d <= 20 ? "pass" : d >= 80 ? "block" : "wait";
  return { id, label, status, detail: `${d.toFixed(1)} — ${zone}`, value: d, aux: null };
}

/**
 * Evaluate a single symbol against the 1m scalp strategy.
 *
 * Conditions:
 *  1. HTF bias — visual only (15m EMA20/50); never gates other checks.
 *  2. VWAP position — price vs session VWAP on 1m.
 *  3. Stoch 14.3 — fast oscillator D line zone.
 *  4. Stoch 40.4 — mid oscillator D line zone.
 *  5. Stoch 60.10 — slow oscillator D line zone.
 *  6. ADX(14) — trend strength (≤ 40 preferred for entries).
 */
type Evaluation = {
  direction: SetupDirection;
  conditions: StrategyCondition[];
  met: number;
  total: number;
  state: SetupState;
  price: number;
  bullishMet: number;
  bearishMet: number;
};

/**
 * Count how many of the 5 scored conditions fire for a given side.
 * Ignores HTF entirely — VWAP side, stoch zone, ADX strength only.
 */
function countSideConfluence(
  side: "long" | "short",
  price: number,
  vwapVal: number | null,
  stochDs: Array<number | null>,
  adxVal: number | null,
): number {
  let n = 0;
  if (vwapVal != null) {
    if (side === "long" && price > vwapVal) n += 1;
    if (side === "short" && price < vwapVal) n += 1;
  }
  for (const d of stochDs) {
    if (d == null) continue;
    if (side === "long" && d <= 20) n += 1;
    if (side === "short" && d >= 80) n += 1;
  }
  if (adxVal != null && adxVal <= 40) n += 1;
  return n;
}

function evaluateSetup(ltfFull: Candle[], htfFull: Candle[]): Evaluation | null {
  if (ltfFull.length < 60) return null;

  // Session VWAP — cap lookback so watchlist-wide screener stays cheap.
  const vwapWindow =
    ltfFull.length > 600 ? ltfFull.slice(-600) : ltfFull;
  const vwap = computeVwap(vwapWindow, "hlc3", "session");
  const vwapVal = lastDefined(vwap);

  // Stoch / ADX / HTF EMAs only need a recent window.
  const ltf =
    ltfFull.length > STRATEGY_ANALYZE_BARS
      ? ltfFull.slice(-STRATEGY_ANALYZE_BARS)
      : ltfFull;
  const htf =
    htfFull.length > STRATEGY_ANALYZE_BARS
      ? htfFull.slice(-STRATEGY_ANALYZE_BARS)
      : htfFull;

  const price = ltfFull[ltfFull.length - 1].close;
  const direction = emaTrend(htf, 20, 50);

  // --- Indicators on 1m candles (live: includes the forming bar) ---
  const stochFast = stochSnapshot(ltf, 14, 1, 3);
  const stochMid = stochSnapshot(ltf, 40, 1, 4);
  const stochSlow = stochSnapshot(ltf, 60, 1, 10);

  const adx = computeAdx(ltf, 14);
  const adxVal = lastDefined(adx);

  const conditions: StrategyCondition[] = [];

  const add = (c: StrategyCondition) => {
    conditions.push(c);
  };

  // 1. HTF bias — visual only; never gates VWAP / stoch / ADX / setup state.
  add({
    id: "htfBias",
    label: "HTF bias (15m EMA20/50)",
    status: "info",
    detail:
      direction === "long"
        ? "Bullish 15m Bias"
        : direction === "short"
          ? "Bearish 15m Bias"
          : "Neutral 15m Bias",
    value: direction === "long" ? 1 : direction === "short" ? -1 : 0,
    aux: null,
  });

  // 2. VWAP position — location only (no HTF gate)
  if (vwapVal == null) {
    add({
      id: "vwap",
      label: "VWAP position",
      status: "wait",
      detail: "VWAP not yet defined",
      value: null,
      aux: null,
    });
  } else {
    const above = price > vwapVal;
    add({
      id: "vwap",
      label: "VWAP position",
      status: "pass",
      detail: above ? "Price above VWAP" : "Price below VWAP",
      value: price - vwapVal,
      aux: vwapVal,
    });
  }

  // 3–5. Stochs — zone only (no HTF gate)
  add(stochDCondition("stochFast", "Stoch 14.3 (fast)", stochFast.d));
  add(stochDCondition("stochMid", "Stoch 40.4 (mid)", stochMid.d));
  add(stochDCondition("stochSlow", "Stoch 60.10 (slow)", stochSlow.d));

  // 6. ADX(14) — ≤ 40 preferred; no HTF gate
  if (adxVal == null) {
    add({
      id: "adx",
      label: "ADX 14",
      status: "wait",
      detail: "—",
      value: null,
      aux: null,
    });
  } else {
    add({
      id: "adx",
      label: "ADX 14",
      status: adxVal <= 40 ? "pass" : "wait",
      detail: adxVal.toFixed(1),
      value: adxVal,
      aux: null,
    });
  }

  // Setup state from scored conditions only (HTF is "info" and excluded).
  // Stoch "block" = overbought zone for display — still counts as an extreme.
  const total = conditions.filter((c) => c.status !== "info").length;
  const met = conditions.filter((c) => {
    if (c.status === "info") return false;
    if (c.id === "stochFast" || c.id === "stochMid" || c.id === "stochSlow") {
      return c.status === "pass" || c.status === "block";
    }
    return c.status === "pass";
  }).length;
  const state: SetupState = met === total ? "ready" : "waiting";

  const stochDs = [stochFast.d, stochMid.d, stochSlow.d];
  const bullishMet = countSideConfluence("long", price, vwapVal, stochDs, adxVal);
  const bearishMet = countSideConfluence("short", price, vwapVal, stochDs, adxVal);

  return { direction, conditions, met, total, state, price, bullishMet, bearishMet };
}

/**
 * Evaluate a single symbol. Display values + live setup state use the full
 * candle series (including the forming bar) so the card ticks in real time
 * with the chart. `confirmedState`/`confirmedMet` are computed on closed
 * candles only, so the "confirmed" tag reflects a setup that closed-bar sealed.
 *
 * Pass `confirmed: false` on high-frequency tip updates to skip the second
 * evaluateSetup pass (reuse prior confirmed* from the caller).
 */
export function analyzeSymbol(
  symbol: string,
  candles1mRaw: Candle[],
  candlesHtfRaw: Candle[],
  now = Date.now(),
  opts?: { confirmed?: boolean },
): StrategyRow | null {
  const live = evaluateSetup(candles1mRaw, candlesHtfRaw);
  if (!live) return null;
  const wantConfirmed = opts?.confirmed !== false;
  const closed = wantConfirmed
    ? evaluateSetup(closedCandles(candles1mRaw), closedCandles(candlesHtfRaw))
    : null;
  return {
    symbol,
    direction: live.direction,
    state: live.state,
    met: live.met,
    total: live.total,
    bullishMet: live.bullishMet,
    bearishMet: live.bearishMet,
    price: live.price,
    conditions: live.conditions,
    confirmedState: closed?.state ?? null,
    confirmedMet: closed?.met ?? null,
    at: now,
  };
}
