import { describe, it, expect } from '@jest/globals';
import { resolveExitCondition } from '../../lib/trading/mock';

/**
 * Production export SMOKE tests (not integration tests).
 *
 * These verify that:
 *   1. resolveExitCondition (used by tickMock) is exported and callable
 *   2. The tick-level priority logic (liq > sl > tp) is correctly implemented
 *      in production code
 *   3. The function contract matches what tickMock expects
 *
 * resolveExitCondition evaluates ONE tick price only — there is no OHLC
 * candle simulation or same-candle resolution in production.
 *
 * Store-level behavior (order → fill → position → margin → close → realized
 * P&L, plus replay/idempotency guarantees) is covered by the real headless
 * tests: paper-trading-lifecycle.test.ts and store-idempotency.test.ts.
 */

describe('Paper Trading Production Export Smoke Tests', () => {
  describe('resolveExitCondition is production-ready', () => {
    it('is exported and callable', () => {
      expect(typeof resolveExitCondition).toBe('function');
    });

    it('implements liq > sl > tp priority correctly', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: 43_000 };

      // When only TP is hit
      expect(resolveExitCondition(pos, 55_000)).toEqual({ px: 55_000, reason: 'tp' });

      // When only SL is hit
      expect(resolveExitCondition(pos, 45_000)).toEqual({ px: 45_000, reason: 'sl' });

      // When only liq is hit
      expect(resolveExitCondition(pos, 43_000)).toEqual({ px: 43_000, reason: 'liq' });

      // When both SL and liq are hit → liq wins
      expect(resolveExitCondition(pos, 42_000)).toEqual({ px: 43_000, reason: 'liq' });

      // When nothing is hit
      expect(resolveExitCondition(pos, 50_000)).toBeNull();
    });

    it('handles long positions correctly', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: null };

      // TP: last >= tp
      expect(resolveExitCondition(pos, 55_001)).toEqual({ px: 55_000, reason: 'tp' });
      expect(resolveExitCondition(pos, 54_999)).toBeNull();

      // SL: last <= sl
      expect(resolveExitCondition(pos, 44_999)).toEqual({ px: 45_000, reason: 'sl' });
      expect(resolveExitCondition(pos, 45_001)).toBeNull();
    });

    it('handles short positions correctly', () => {
      const pos = { side: 'short' as const, tp: 45_000, sl: 55_000, liq: null };

      // TP: last <= tp (short profits on fall)
      expect(resolveExitCondition(pos, 44_999)).toEqual({ px: 45_000, reason: 'tp' });
      expect(resolveExitCondition(pos, 45_001)).toBeNull();

      // SL: last >= sl (short loses on rise)
      expect(resolveExitCondition(pos, 55_001)).toEqual({ px: 55_000, reason: 'sl' });
      expect(resolveExitCondition(pos, 54_999)).toBeNull();
    });

    it('returns null when no exit condition is met', () => {
      const pos = { side: 'long' as const, tp: null, sl: null, liq: null };
      expect(resolveExitCondition(pos, 99_999)).toBeNull();
    });

    it('is deterministic across repeated calls', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: 43_000 };
      const r1 = resolveExitCondition(pos, 42_000);
      const r2 = resolveExitCondition(pos, 42_000);
      const r3 = resolveExitCondition(pos, 42_000);
      expect(r1).toEqual(r2);
      expect(r2).toEqual(r3);
    });
  });

  describe('Production function contract compatibility', () => {
    it('return type matches tickMock expectations', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: null, liq: null };
      const result = resolveExitCondition(pos, 55_000);

      // tickMock expects { px: number; reason: "tp" | "sl" | "liq" } | null
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('px');
      expect(result).toHaveProperty('reason');
      expect(typeof result!.px).toBe('number');
      expect(['tp', 'sl', 'liq']).toContain(result!.reason);
    });

    it('null values are handled correctly', () => {
      // Only tp set
      expect(resolveExitCondition({ side: 'long', tp: 55_000, sl: null, liq: null }, 55_000))
        .toEqual({ px: 55_000, reason: 'tp' });

      // Only sl set
      expect(resolveExitCondition({ side: 'long', tp: null, sl: 45_000, liq: null }, 45_000))
        .toEqual({ px: 45_000, reason: 'sl' });

      // Only liq set
      expect(resolveExitCondition({ side: 'long', tp: null, sl: null, liq: 43_000 }, 43_000))
        .toEqual({ px: 43_000, reason: 'liq' });

      // All null
      expect(resolveExitCondition({ side: 'long', tp: null, sl: null, liq: null }, 50_000))
        .toBeNull();
    });
  });
});
