import type { Candle } from "@/types";

/**
 * Port of the PineScript v5 indicator "Order Blocks & Breaker Blocks [LuxAlgo]".
 *
 * The Pine script is incremental (`var` state carried bar to bar), so this module exposes a
 * per-bar primitive (`stepObBar`) plus two drivers: a full recompute for tests and an
 * incremental one that caches the closed-bar history and replays only the forming bar,
 * mirroring Pine's own realtime rollback-and-rerun-last-bar behaviour.
 */

export type ObSide = "bull" | "bear";

export type OrderBlock = {
  side: ObSide;
  top: number;
  btm: number;
  /** Unix seconds of the candle the block starts at (Pine `loc`, xloc.bar_time). */
  loc: number;
  breaker: boolean;
  /** Unix seconds where mitigation flipped it into a breaker (Pine `break_loc`). */
  breakLoc: number | null;
};

export type PolarityLabel = {
  side: ObSide;
  /** Bar index of the swing the label anchors to (Pine label.new(top.x, top.y)). */
  barIndex: number;
  price: number;
};

export type ObResult = {
  /** All live bullish blocks, index 0 = newest (Pine array order after unshift). */
  bull: OrderBlock[];
  /** All live bearish blocks, index 0 = newest. */
  bear: OrderBlock[];
  /** Historical polarity-change markers, oldest first, capped at 500. */
  labels: PolarityLabel[];
  /** The subset the Pine script actually draws (showLastBull / showLastBear). */
  displayed: OrderBlock[];
};

type Swing = { y: number | null; x: number; crossed: boolean };

export type ObState = {
  os: number;
  top: Swing;
  btm: Swing;
  bull: OrderBlock[];
  bear: OrderBlock[];
  prevBullConf: number;
  prevBearConf: number;
  labels: PolarityLabel[];
};

export type ObConfig = {
  swingLookback: number;
  showLastBull: number;
  showLastBear: number;
  useBody: boolean;
  showLabels: boolean;
};

export type ObHistoryCache = { key: string; state: ObState } | null;

const MAX_LABELS = 500;

export function createObState(): ObState {
  return {
    os: 0,
    top: { y: null, x: -1, crossed: false },
    btm: { y: null, x: -1, crossed: false },
    bull: [],
    bear: [],
    prevBullConf: 0,
    prevBearConf: 0,
    labels: [],
  };
}

/** Deep enough that replaying the forming bar cannot mutate the cached history. */
export function cloneObState(s: ObState): ObState {
  return {
    os: s.os,
    top: { ...s.top },
    btm: { ...s.btm },
    bull: s.bull.map((b) => ({ ...b })),
    bear: s.bear.map((b) => ({ ...b })),
    prevBullConf: s.prevBullConf,
    prevBearConf: s.prevBearConf,
    labels: s.labels.slice(),
  };
}

function effHigh(c: Candle, useBody: boolean): number {
  return useBody ? Math.max(c.close, c.open) : c.high;
}

function effLow(c: Candle, useBody: boolean): number {
  return useBody ? Math.min(c.close, c.open) : c.low;
}

function pushLabel(state: ObState, side: ObSide, swing: Swing) {
  if (swing.y === null) return;
  state.labels.push({ side, barIndex: swing.x, price: swing.y });
  if (state.labels.length > MAX_LABELS) {
    state.labels.splice(0, state.labels.length - MAX_LABELS);
  }
}

/** Advance the state machine by one bar. Mutates `state`. */
export function stepObBar(state: ObState, candles: Candle[], n: number, cfg: ObConfig): void {
  const len = cfg.swingLookback;
  const c = candles[n];

  // swings(len): ta.highest/lowest span [n-len+1 .. n], inclusive of the current bar, so
  // candles[n-len] sits outside the window — a one-sided (right-confirmed) pivot test.
  let upper = -Infinity;
  let lower = Infinity;
  for (let i = Math.max(0, n - len + 1); i <= n; i++) {
    if (candles[i].high > upper) upper = candles[i].high;
    if (candles[i].low < lower) lower = candles[i].low;
  }

  // Before bar `len`, high[n-len]/low[n-len] are na in Pine and comparisons are falsy, so os holds.
  if (n - len >= 0) {
    const prevOs = state.os;
    const pivotHigh = candles[n - len].high;
    const pivotLow = candles[n - len].low;
    if (pivotHigh > upper) state.os = 0;
    else if (pivotLow < lower) state.os = 1;
    // Swings only record on a state *transition*, so recorded swings strictly alternate and
    // each yields at most one order block (a fresh swing resets `crossed`).
    if (state.os === 0 && prevOs !== 0) {
      state.top = { y: pivotHigh, x: n - len, crossed: false };
    }
    if (state.os === 1 && prevOs !== 1) {
      state.btm = { y: pivotLow, x: n - len, crossed: false };
    }
  }

  // --- Bullish OB ---
  const top = state.top;
  let bullConf = 0;
  if (top.y !== null && c.close > top.y && !top.crossed) {
    top.crossed = true;
    // Pine initialises these swapped (minima = max[1], maxima = min[1]); since effLow <= effHigh
    // the first loop iteration self-corrects, so the swap is harmless.
    let minima = effHigh(candles[n - 1], cfg.useBody);
    let maxima = effLow(candles[n - 1], cfg.useBody);
    let loc = candles[n - 1].time;
    // i ascends, so this walks bars n-1 (newest) back to top.x+1 (oldest), excluding both the
    // breakout bar n and the swing bar top.x.
    for (let i = 1; i <= n - top.x - 1; i++) {
      const bar = n - i;
      const lo = effLow(candles[bar], cfg.useBody);
      minima = Math.min(lo, minima);
      // Tested *after* the min assignment, so a tie satisfies it and the oldest tied bar wins.
      if (minima === lo) {
        maxima = effHigh(candles[bar], cfg.useBody);
        loc = candles[bar].time;
      }
    }
    state.bull.unshift({ side: "bull", top: maxima, btm: minima, loc, breaker: false, breakLoc: null });
  }

  if (state.bull.length > 0) {
    for (let i = state.bull.length - 1; i >= 0; i--) {
      const el = state.bull[i];
      if (!el.breaker) {
        // Mitigation deliberately ignores useBody: it always uses the candle body.
        if (Math.min(c.close, c.open) < el.btm) {
          el.breaker = true;
          el.breakLoc = c.time;
        }
      } else if (c.close > el.top) {
        state.bull.splice(i, 1);
      } else if (i < cfg.showLastBull && top.y !== null && top.y < el.top && top.y > el.btm) {
        bullConf = 1;
      }
    }
  }
  // Labels fire on the rising edge of the per-bar confirmation flag only.
  if (bullConf > state.prevBullConf && cfg.showLabels) pushLabel(state, "bull", top);
  state.prevBullConf = bullConf;

  // --- Bearish OB ---
  const btm = state.btm;
  let bearConf = 0;
  if (btm.y !== null && c.close < btm.y && !btm.crossed) {
    btm.crossed = true;
    let minima = effLow(candles[n - 1], cfg.useBody);
    let maxima = effHigh(candles[n - 1], cfg.useBody);
    let loc = candles[n - 1].time;
    for (let i = 1; i <= n - btm.x - 1; i++) {
      const bar = n - i;
      const hi = effHigh(candles[bar], cfg.useBody);
      maxima = Math.max(hi, maxima);
      if (maxima === hi) {
        minima = effLow(candles[bar], cfg.useBody);
        loc = candles[bar].time;
      }
    }
    state.bear.unshift({ side: "bear", top: maxima, btm: minima, loc, breaker: false, breakLoc: null });
  }

  if (state.bear.length > 0) {
    for (let i = state.bear.length - 1; i >= 0; i--) {
      const el = state.bear[i];
      if (!el.breaker) {
        if (Math.max(c.close, c.open) > el.top) {
          el.breaker = true;
          el.breakLoc = c.time;
        }
      } else if (c.close < el.btm) {
        state.bear.splice(i, 1);
      } else if (i < cfg.showLastBear && btm.y !== null && btm.y > el.btm && btm.y < el.top) {
        bearConf = 1;
      }
    }
  }
  if (bearConf > state.prevBearConf && cfg.showLabels) pushLabel(state, "bear", btm);
  state.prevBearConf = bearConf;
}

/** The subset Pine draws. Clamps to size-1: the original inclusive bound `min(show-1, size)`
 *  reaches index `size` when size < show and throws out-of-bounds in Pine. */
export function selectDisplayed(state: ObState, cfg: ObConfig): OrderBlock[] {
  const out: OrderBlock[] = [];
  if (cfg.showLastBull > 0) {
    const last = Math.min(cfg.showLastBull - 1, state.bull.length - 1);
    for (let i = 0; i <= last; i++) out.push(state.bull[i]);
  }
  if (cfg.showLastBear > 0) {
    const last = Math.min(cfg.showLastBear - 1, state.bear.length - 1);
    for (let i = 0; i <= last; i++) out.push(state.bear[i]);
  }
  return out;
}

/** Full recompute over every bar. Used by tests and as the fallback when the cache misses. */
export function computeOrderBlocks(candles: Candle[], cfg: ObConfig): ObResult {
  const state = createObState();
  for (let n = 0; n < candles.length; n++) stepObBar(state, candles, n, cfg);
  return {
    bull: state.bull,
    bear: state.bear,
    labels: state.labels,
    displayed: selectDisplayed(state, cfg),
  };
}

/**
 * Incremental driver for live charts. Caches the state after all closed bars and replays only
 * the forming bar on top of a clone, so per-tick cost is O(blocks) instead of O(bars * blocks).
 * The cache is invalidated when a new bar arrives or the config changes.
 */
export function computeOrderBlocksLive(
  candles: Candle[],
  cfg: ObConfig,
  cache: ObHistoryCache,
): { result: ObResult; cache: ObHistoryCache } {
  const n = candles.length;
  const cfgSig = `${cfg.swingLookback}|${cfg.useBody ? 1 : 0}|${cfg.showLastBull}|${cfg.showLastBear}|${cfg.showLabels ? 1 : 0}`;
  const histEnd = Math.max(0, n - 1);
  const anchor = histEnd > 0 ? candles[histEnd - 1].time : -1;
  const key = `${n}|${anchor}|${cfgSig}`;

  let state: ObState;
  if (cache && cache.key === key) {
    state = cloneObState(cache.state);
  } else {
    state = createObState();
    for (let i = 0; i < histEnd; i++) stepObBar(state, candles, i, cfg);
    cache = { key, state: cloneObState(state) };
  }
  if (n > 0) stepObBar(state, candles, n - 1, cfg);

  return {
    result: {
      bull: state.bull,
      bear: state.bear,
      labels: state.labels,
      displayed: selectDisplayed(state, cfg),
    },
    cache,
  };
}
