import { describe, it, expect } from '@jest/globals';
import { resolveExitCondition } from '../../lib/trading/mock';
import type { ExitCheckPosition } from '../../lib/trading/exit-conditions';
import type { Quote } from '../../types';

/**
 * Deterministic tick-level exit priority tests for the PRODUCTION function
 * `resolveExitCondition(pos, last)`.
 *
 * DOCUMENTED PRODUCTION POLICY (read before changing either):
 *   1. The paper-trading engine is TICK-DRIVEN. `resolveExitCondition`
 *      evaluates exactly one tick price (`last`). There is NO OHLC candle
 *      simulation in production and NO same-candle TP/SL resolution: the
 *      engine cannot know which level price touched first inside a candle —
 *      only the ticks the market feed delivers.
 *   2. When one tick breaches several levels simultaneously, priority is
 *      liquidation > stop loss > take profit, and the fill price is the
 *      LEVEL price, not the tick price.
 *   3. Over a tick sequence, the FIRST tick that breaches any level closes
 *      the position; later ticks never act on it. The outcome therefore
 *      depends on the delivered tick order — that is feed behavior, not
 *      engine nondeterminism. For a fixed (position, tick sequence) input
 *      the result is fully deterministic, which is what this file asserts.
 */

function longPos(overrides: Partial<ExitCheckPosition> = {}): ExitCheckPosition {
  return { side: 'long', tp: 110, sl: 90, liq: 82, ...overrides };
}

function shortPos(overrides: Partial<ExitCheckPosition> = {}): ExitCheckPosition {
  return { side: 'short', tp: 90, sl: 110, liq: 118, ...overrides };
}

function tick(symbol: string, last: number): Quote {
  return {
    symbol,
    last,
    open: 100,
    high: Math.max(100, last),
    low: Math.min(100, last),
    volume: 0,
    change: last - 100,
    changePct: ((last - 100) / 100) * 100,
    rsi: null,
    atr: null,
  };
}

/** Mirrors tickMock's exit decision for one position over a tick sequence. */
function firstExitOverSequence(pos: ExitCheckPosition, ticks: Quote[]) {
  for (const q of ticks) {
    const exit = resolveExitCondition(pos, q.last);
    if (exit) return { ...exit, atTick: q.last };
  }
  return null;
}

describe('deterministic tick-level exit priority (production resolveExitCondition)', () => {
  describe('single-tick priority: liq > sl > tp', () => {
    it('long: one tick breaching all three levels closes at liquidation', () => {
      expect(resolveExitCondition(longPos(), 80)).toEqual({ px: 82, reason: 'liq' });
    });

    it('long: one tick breaching sl and tp closes at stop loss', () => {
      // liq far away, tick breaches both sl=90 and tp=110 is impossible for a
      // long (tp is above, sl below) — so use a tick below sl only, then a
      // scenario where sl and liq overlap: liq wins.
      expect(resolveExitCondition(longPos({ tp: null }), 89)).toEqual({ px: 90, reason: 'sl' });
      expect(resolveExitCondition(longPos({ tp: 110 }), 81)).toEqual({ px: 82, reason: 'liq' });
    });

    it('long: tp alone triggers at the tp level, not the tick price', () => {
      expect(resolveExitCondition(longPos({ sl: null, liq: null }), 112)).toEqual({ px: 110, reason: 'tp' });
      expect(resolveExitCondition(longPos({ sl: null, liq: null }), 110)).toEqual({ px: 110, reason: 'tp' });
    });

    it('short: mirrored priority and comparisons', () => {
      // Short loses on a rise: sl=110, liq=118, tp=90.
      expect(resolveExitCondition(shortPos(), 120)).toEqual({ px: 118, reason: 'liq' });
      expect(resolveExitCondition(shortPos({ liq: null }), 111)).toEqual({ px: 110, reason: 'sl' });
      expect(resolveExitCondition(shortPos({ sl: null, liq: null }), 89)).toEqual({ px: 90, reason: 'tp' });
      expect(resolveExitCondition(shortPos(), 100)).toBeNull();
    });

    it('no levels set: never exits', () => {
      expect(resolveExitCondition({ side: 'long', tp: null, sl: null, liq: null }, 1)).toBeNull();
      expect(resolveExitCondition({ side: 'short', tp: null, sl: null, liq: null }, 1_000_000)).toBeNull();
    });
  });

  describe('determinism: identical input always yields identical output', () => {
    it('repeated calls with the same (pos, last) never vary', () => {
      const pos = longPos();
      const results = new Set<string>();
      for (let i = 0; i < 50; i++) {
        results.add(JSON.stringify(resolveExitCondition(pos, 81)));
        results.add(JSON.stringify(resolveExitCondition(pos, 95)));
        results.add(JSON.stringify(resolveExitCondition(pos, 111)));
      }
      expect(results.size).toBe(3);
    });

    it('the function is pure: mutating unrelated local state has no effect', () => {
      const pos = longPos();
      const before = resolveExitCondition(pos, 111);
      for (let i = 0; i < 10; i++) Math.random();
      expect(resolveExitCondition(pos, 111)).toEqual(before);
    });
  });

  describe('tick sequences: first breaching tick wins (documented policy)', () => {
    it('long: downward sequence exits at SL even though a later tick would reach TP', () => {
      const exit = firstExitOverSequence(longPos(), [tick('S', 104), tick('S', 96), tick('S', 89), tick('S', 112)]);
      expect(exit).toEqual({ px: 90, reason: 'sl', atTick: 89 });
    });

    it('long: upward sequence exits at TP', () => {
      const exit = firstExitOverSequence(longPos(), [tick('S', 104), tick('S', 108), tick('S', 111)]);
      expect(exit).toEqual({ px: 110, reason: 'tp', atTick: 111 });
    });

    it('long: deep crash exits at liquidation even when SL was also breached', () => {
      const exit = firstExitOverSequence(longPos(), [tick('S', 95), tick('S', 80)]);
      expect(exit).toEqual({ px: 82, reason: 'liq', atTick: 80 });
    });

    it('sequence order changes the outcome — that is feed order, not nondeterminism', () => {
      const pos = longPos();
      // Feed delivers the drop first → SL.
      const dropFirst = firstExitOverSequence(pos, [tick('S', 89), tick('S', 112)]);
      expect(dropFirst).toMatchObject({ reason: 'sl', px: 90 });
      // Feed delivers the rally first → TP. Both are deterministic given the
      // delivered order; the engine never reorders or simulates inside a candle.
      const rallyFirst = firstExitOverSequence(pos, [tick('S', 112), tick('S', 89)]);
      expect(rallyFirst).toMatchObject({ reason: 'tp', px: 110 });
    });

    it('a sequence that never breaches produces no exit', () => {
      const exit = firstExitOverSequence(longPos(), [tick('S', 95), tick('S', 105), tick('S', 100)]);
      expect(exit).toBeNull();
    });
  });

  describe('boundary ticks (exact level prices)', () => {
    it('long: exact level prices trigger (>= tp, <= sl, <= liq)', () => {
      expect(resolveExitCondition(longPos({ sl: null, liq: null }), 110)).toEqual({ px: 110, reason: 'tp' });
      expect(resolveExitCondition(longPos({ tp: null, liq: null }), 90)).toEqual({ px: 90, reason: 'sl' });
      expect(resolveExitCondition(longPos({ tp: null, sl: null }), 82)).toEqual({ px: 82, reason: 'liq' });
    });

    it('short: exact level prices trigger (<= tp, >= sl, >= liq)', () => {
      expect(resolveExitCondition(shortPos({ sl: null, liq: null }), 90)).toEqual({ px: 90, reason: 'tp' });
      expect(resolveExitCondition(shortPos({ tp: null, liq: null }), 110)).toEqual({ px: 110, reason: 'sl' });
      expect(resolveExitCondition(shortPos({ tp: null, sl: null }), 118)).toEqual({ px: 118, reason: 'liq' });
    });

    it('one epsilon inside the range does not trigger', () => {
      expect(resolveExitCondition(longPos({ sl: null, liq: null }), 109.999999)).toBeNull();
      expect(resolveExitCondition(longPos({ tp: null, liq: null }), 90.000001)).toBeNull();
      expect(resolveExitCondition(shortPos({ sl: null, liq: null }), 90.000001)).toBeNull();
      expect(resolveExitCondition(shortPos({ tp: null, liq: null }), 109.999999)).toBeNull();
    });
  });
});
