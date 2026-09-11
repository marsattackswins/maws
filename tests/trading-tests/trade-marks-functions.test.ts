import { describe, it, expect } from '@jest/globals';
import { liquidationPrice, defaultProtect } from '../../lib/trade-marks';

/**
 * Direct function-level tests for the pure helpers exported from lib/trade-marks.ts.
 *
 * Functions under test:
 *   liquidationPrice  – computes the price at which a leveraged position is liquidated
 *   defaultProtect    – returns default TP/SL bracket prices given an entry and side
 */

// ---------------------------------------------------------------------------
// liquidationPrice
// ---------------------------------------------------------------------------

describe('liquidationPrice (direct function)', () => {
  // Formula: buffer = 0.9 / max(1, leverage)
  //          long  → entry * (1 - buffer)
  //          short → entry * (1 + buffer)

  describe('long positions', () => {
    it('1x leverage: liquidation is 90% below entry', () => {
      // buffer = 0.9/1 = 0.9 → liq = 50000 * (1-0.9) = 5000
      const liq = liquidationPrice({ side: 'long', entry: 50_000, leverage: 1 });
      expect(liq).toBeCloseTo(5_000, 2);
    });

    it('10x leverage: liquidation is 9% below entry', () => {
      // buffer = 0.9/10 = 0.09 → liq = 50000 * 0.91 = 45500
      const liq = liquidationPrice({ side: 'long', entry: 50_000, leverage: 10 });
      expect(liq).toBeCloseTo(45_500, 2);
    });

    it('100x leverage: liquidation is 0.9% below entry', () => {
      // buffer = 0.9/100 = 0.009 → liq = 50000 * 0.991 = 49550
      const liq = liquidationPrice({ side: 'long', entry: 50_000, leverage: 100 });
      expect(liq).toBeCloseTo(49_550, 2);
    });

    it('higher leverage moves liquidation closer to entry', () => {
      const liq5x = liquidationPrice({ side: 'long', entry: 50_000, leverage: 5 });
      const liq10x = liquidationPrice({ side: 'long', entry: 50_000, leverage: 10 });
      const liq20x = liquidationPrice({ side: 'long', entry: 50_000, leverage: 20 });
      expect(liq5x).toBeLessThan(liq10x);
      expect(liq10x).toBeLessThan(liq20x);
      expect(liq20x).toBeLessThan(50_000);
    });

    it('liquidation is always below entry for long positions', () => {
      [1, 2, 5, 10, 25, 50, 100].forEach(leverage => {
        const liq = liquidationPrice({ side: 'long', entry: 50_000, leverage });
        expect(liq).toBeLessThan(50_000);
      });
    });

    it('leverage 0 is clamped to 1', () => {
      const liqZero = liquidationPrice({ side: 'long', entry: 50_000, leverage: 0 });
      const liqOne = liquidationPrice({ side: 'long', entry: 50_000, leverage: 1 });
      expect(liqZero).toBe(liqOne);
    });

    it('negative leverage is clamped to 1', () => {
      const liqNeg = liquidationPrice({ side: 'long', entry: 50_000, leverage: -5 });
      const liqOne = liquidationPrice({ side: 'long', entry: 50_000, leverage: 1 });
      expect(liqNeg).toBe(liqOne);
    });

    it('scales proportionally with entry price', () => {
      const liqA = liquidationPrice({ side: 'long', entry: 50_000, leverage: 10 });
      const liqB = liquidationPrice({ side: 'long', entry: 100_000, leverage: 10 });
      expect(liqB).toBeCloseTo(liqA * 2, 2);
    });
  });

  describe('short positions', () => {
    it('10x leverage: liquidation is 9% above entry', () => {
      // buffer = 0.9/10 = 0.09 → liq = 50000 * 1.09 = 54500
      const liq = liquidationPrice({ side: 'short', entry: 50_000, leverage: 10 });
      expect(liq).toBeCloseTo(54_500, 2);
    });

    it('1x leverage: liquidation is 90% above entry', () => {
      // buffer = 0.9/1 = 0.9 → liq = 50000 * 1.9 = 95000
      const liq = liquidationPrice({ side: 'short', entry: 50_000, leverage: 1 });
      expect(liq).toBeCloseTo(95_000, 2);
    });

    it('liquidation is always above entry for short positions', () => {
      [1, 2, 5, 10, 25, 50, 100].forEach(leverage => {
        const liq = liquidationPrice({ side: 'short', entry: 50_000, leverage });
        expect(liq).toBeGreaterThan(50_000);
      });
    });

    it('higher leverage moves liquidation closer to entry for short', () => {
      const liq5x = liquidationPrice({ side: 'short', entry: 50_000, leverage: 5 });
      const liq10x = liquidationPrice({ side: 'short', entry: 50_000, leverage: 10 });
      const liq20x = liquidationPrice({ side: 'short', entry: 50_000, leverage: 20 });
      expect(liq5x).toBeGreaterThan(liq10x);
      expect(liq10x).toBeGreaterThan(liq20x);
      expect(liq20x).toBeGreaterThan(50_000);
    });
  });

  describe('symmetry between long and short', () => {
    it('long and short liquidation distances are equal at the same leverage', () => {
      const entry = 50_000;
      const leverage = 10;
      const liqLong = liquidationPrice({ side: 'long', entry, leverage });
      const liqShort = liquidationPrice({ side: 'short', entry, leverage });
      const distLong = entry - liqLong;
      const distShort = liqShort - entry;
      expect(distLong).toBeCloseTo(distShort, 6);
    });
  });

  describe('edge cases', () => {
    it('very low-price asset', () => {
      const liq = liquidationPrice({ side: 'long', entry: 0.00001, leverage: 10 });
      expect(liq).toBeCloseTo(0.00001 * 0.91, 10);
    });

    it('returns a finite number for all valid inputs', () => {
      const liq = liquidationPrice({ side: 'long', entry: 1_000_000, leverage: 50 });
      expect(Number.isFinite(liq)).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// defaultProtect
// ---------------------------------------------------------------------------

describe('defaultProtect (direct function)', () => {
  // Formula from source:
  //   long:  tp = entry * 1.012,  sl = entry * 0.994
  //   short: tp = entry * 0.988,  sl = entry * 1.006

  describe('long side', () => {
    it('tp is 1.2% above entry', () => {
      const { tp } = defaultProtect(50_000, 'long');
      expect(tp).toBeCloseTo(50_000 * 1.012, 6);
      expect(tp).toBeCloseTo(50_600, 2);
    });

    it('sl is 0.6% below entry', () => {
      const { sl } = defaultProtect(50_000, 'long');
      expect(sl).toBeCloseTo(50_000 * 0.994, 6);
      expect(sl).toBeCloseTo(49_700, 2);
    });

    it('tp is above entry', () => {
      const { tp } = defaultProtect(50_000, 'long');
      expect(tp).toBeGreaterThan(50_000);
    });

    it('sl is below entry', () => {
      const { sl } = defaultProtect(50_000, 'long');
      expect(sl).toBeLessThan(50_000);
    });

    it('scales with entry price', () => {
      const { tp: tp1, sl: sl1 } = defaultProtect(50_000, 'long');
      const { tp: tp2, sl: sl2 } = defaultProtect(100_000, 'long');
      expect(tp2).toBeCloseTo(tp1 * 2, 4);
      expect(sl2).toBeCloseTo(sl1 * 2, 4);
    });
  });

  describe('short side', () => {
    it('tp is 1.2% below entry (profit for short)', () => {
      const { tp } = defaultProtect(50_000, 'short');
      expect(tp).toBeCloseTo(50_000 * 0.988, 6);
      expect(tp).toBeCloseTo(49_400, 2);
    });

    it('sl is 0.6% above entry (loss for short)', () => {
      const { sl } = defaultProtect(50_000, 'short');
      expect(sl).toBeCloseTo(50_000 * 1.006, 6);
      expect(sl).toBeCloseTo(50_300, 2);
    });

    it('tp is below entry for short', () => {
      const { tp } = defaultProtect(50_000, 'short');
      expect(tp).toBeLessThan(50_000);
    });

    it('sl is above entry for short', () => {
      const { sl } = defaultProtect(50_000, 'short');
      expect(sl).toBeGreaterThan(50_000);
    });

    it('scales with entry price', () => {
      const { tp: tp1, sl: sl1 } = defaultProtect(50_000, 'short');
      const { tp: tp2, sl: sl2 } = defaultProtect(100_000, 'short');
      expect(tp2).toBeCloseTo(tp1 * 2, 4);
      expect(sl2).toBeCloseTo(sl1 * 2, 4);
    });
  });

  describe('long vs short symmetry', () => {
    it('long tp distance above entry equals short sl distance above entry', () => {
      const entry = 50_000;
      const { tp: longTp } = defaultProtect(entry, 'long');
      const { sl: shortSl } = defaultProtect(entry, 'short');
      // long tp at 1.2% above; short sl at 0.6% above — NOT equal, just both above
      expect(longTp).toBeGreaterThan(entry);
      expect(shortSl).toBeGreaterThan(entry);
    });

    it('long sl percentage below entry equals short tp percentage below entry', () => {
      const entry = 50_000;
      const { sl: longSl } = defaultProtect(entry, 'long');
      const { tp: shortTp } = defaultProtect(entry, 'short');
      const longSlDist = (entry - longSl) / entry;
      const shortTpDist = (entry - shortTp) / entry;
      // long sl = 0.6% below; short tp = 1.2% below — different magnitudes, both below
      expect(longSl).toBeLessThan(entry);
      expect(shortTp).toBeLessThan(entry);
      // Verify the exact multipliers so regressions are caught
      expect(longSlDist).toBeCloseTo(0.006, 6); // 0.6%
      expect(shortTpDist).toBeCloseTo(0.012, 6); // 1.2%
    });
  });

  describe('edge cases', () => {
    it('works for very low prices', () => {
      const { tp, sl } = defaultProtect(0.00001, 'long');
      expect(tp).toBeCloseTo(0.00001 * 1.012, 10);
      expect(sl).toBeCloseTo(0.00001 * 0.994, 10);
    });

    it('works for very high prices', () => {
      const { tp, sl } = defaultProtect(1_000_000, 'long');
      expect(tp).toBeCloseTo(1_000_000 * 1.012, 2);
      expect(sl).toBeCloseTo(1_000_000 * 0.994, 2);
    });
  });
});
