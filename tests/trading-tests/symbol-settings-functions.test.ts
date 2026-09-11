import { describe, it, expect } from '@jest/globals';
import { protectFromSettings } from '../../lib/trading/symbol-settings';
import type { SymbolTradingSettings } from '../../types';

/**
 * Direct function-level tests for the pure helpers exported from
 * lib/trading/symbol-settings.ts.
 *
 * Only protectFromSettings is tested here because it is the only exported
 * function that is pure (no Zustand store dependency).  The store-dependent
 * functions (resolveSymbolTrading, resolveMarginAmount, resolveOrderQty,
 * resolvePositionOrderQty, formatMarginLabel) require a mocked Zustand store
 * and are covered by their formula contracts in position-sizing.test.ts.
 *
 * Function under test:
 *   protectFromSettings – derives TP and SL prices from trading settings
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSettings(
  overrides: Partial<SymbolTradingSettings> = {},
): SymbolTradingSettings {
  return {
    margin: 100,
    leverage: 10,
    sizingMode: 'fixed',
    marginPercent: 1,
    defaultOrderType: 'market',
    attachBrackets: true,
    tpPercent: 2,
    slPercent: 1,
    confirmOrders: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// protectFromSettings
// ---------------------------------------------------------------------------

describe('protectFromSettings (direct function)', () => {
  describe('brackets disabled (attachBrackets = false)', () => {
    it('returns null tp and sl when attachBrackets is false', () => {
      const settings = makeSettings({ attachBrackets: false, tpPercent: 5, slPercent: 3 });
      const result = protectFromSettings(50_000, 'long', settings);
      expect(result).toEqual({ tp: null, sl: null });
    });

    it('returns null tp and sl for short when attachBrackets is false', () => {
      const settings = makeSettings({ attachBrackets: false, tpPercent: 5, slPercent: 3 });
      const result = protectFromSettings(50_000, 'short', settings);
      expect(result).toEqual({ tp: null, sl: null });
    });
  });

  describe('long position with brackets enabled', () => {
    it('tp = entry * (1 + tpPercent/100)', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { tp } = protectFromSettings(50_000, 'long', settings);
      expect(tp).toBeCloseTo(50_000 * 1.02, 6);
      expect(tp).toBeCloseTo(51_000, 2);
    });

    it('sl = entry * (1 - slPercent/100)', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { sl } = protectFromSettings(50_000, 'long', settings);
      expect(sl).toBeCloseTo(50_000 * 0.99, 6);
      expect(sl).toBeCloseTo(49_500, 2);
    });

    it('tp is above entry', () => {
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { tp } = protectFromSettings(50_000, 'long', settings);
      expect(tp).toBeGreaterThan(50_000);
    });

    it('sl is below entry', () => {
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { sl } = protectFromSettings(50_000, 'long', settings);
      expect(sl).toBeLessThan(50_000);
    });

    it('larger tpPercent moves tp further above entry', () => {
      const s5 = makeSettings({ tpPercent: 5, slPercent: 1 });
      const s10 = makeSettings({ tpPercent: 10, slPercent: 1 });
      const tp5 = protectFromSettings(50_000, 'long', s5).tp!;
      const tp10 = protectFromSettings(50_000, 'long', s10).tp!;
      expect(tp10).toBeGreaterThan(tp5);
    });

    it('larger slPercent moves sl further below entry', () => {
      const s2 = makeSettings({ tpPercent: 2, slPercent: 2 });
      const s5 = makeSettings({ tpPercent: 2, slPercent: 5 });
      const sl2 = protectFromSettings(50_000, 'long', s2).sl!;
      const sl5 = protectFromSettings(50_000, 'long', s5).sl!;
      expect(sl5).toBeLessThan(sl2);
    });

    it('tp is null when tpPercent is 0', () => {
      const settings = makeSettings({ tpPercent: 0, slPercent: 1 });
      const { tp } = protectFromSettings(50_000, 'long', settings);
      expect(tp).toBeNull();
    });

    it('sl is null when slPercent is 0', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 0 });
      const { sl } = protectFromSettings(50_000, 'long', settings);
      expect(sl).toBeNull();
    });

    it('both tp and sl are null when both percents are 0', () => {
      const settings = makeSettings({ tpPercent: 0, slPercent: 0 });
      const result = protectFromSettings(50_000, 'long', settings);
      expect(result).toEqual({ tp: null, sl: null });
    });

    it('negative tpPercent is clamped to 0 (tp = null)', () => {
      const settings = makeSettings({ tpPercent: -5, slPercent: 1 });
      const { tp } = protectFromSettings(50_000, 'long', settings);
      expect(tp).toBeNull();
    });

    it('negative slPercent is clamped to 0 (sl = null)', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: -3 });
      const { sl } = protectFromSettings(50_000, 'long', settings);
      expect(sl).toBeNull();
    });

    it('scales correctly with different entry prices', () => {
      const settings = makeSettings({ tpPercent: 10, slPercent: 5 });
      const { tp: tp1, sl: sl1 } = protectFromSettings(50_000, 'long', settings);
      const { tp: tp2, sl: sl2 } = protectFromSettings(100_000, 'long', settings);
      expect(tp2).toBeCloseTo(tp1! * 2, 4);
      expect(sl2).toBeCloseTo(sl1! * 2, 4);
    });
  });

  describe('short position with brackets enabled', () => {
    it('tp = entry * (1 - tpPercent/100)  (short profits on fall)', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { tp } = protectFromSettings(50_000, 'short', settings);
      expect(tp).toBeCloseTo(50_000 * 0.98, 6);
      expect(tp).toBeCloseTo(49_000, 2);
    });

    it('sl = entry * (1 + slPercent/100)  (short loses on rise)', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { sl } = protectFromSettings(50_000, 'short', settings);
      expect(sl).toBeCloseTo(50_000 * 1.01, 6);
      expect(sl).toBeCloseTo(50_500, 2);
    });

    it('tp is below entry for short', () => {
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { tp } = protectFromSettings(50_000, 'short', settings);
      expect(tp).toBeLessThan(50_000);
    });

    it('sl is above entry for short', () => {
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { sl } = protectFromSettings(50_000, 'short', settings);
      expect(sl).toBeGreaterThan(50_000);
    });

    it('tp is null when tpPercent is 0 (short)', () => {
      const settings = makeSettings({ tpPercent: 0, slPercent: 1 });
      const { tp } = protectFromSettings(50_000, 'short', settings);
      expect(tp).toBeNull();
    });

    it('sl is null when slPercent is 0 (short)', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 0 });
      const { sl } = protectFromSettings(50_000, 'short', settings);
      expect(sl).toBeNull();
    });

    it('larger tpPercent moves tp further below entry for short', () => {
      const s5 = makeSettings({ tpPercent: 5, slPercent: 1 });
      const s10 = makeSettings({ tpPercent: 10, slPercent: 1 });
      const tp5 = protectFromSettings(50_000, 'short', s5).tp!;
      const tp10 = protectFromSettings(50_000, 'short', s10).tp!;
      expect(tp10).toBeLessThan(tp5);
    });

    it('scales correctly with different entry prices', () => {
      const settings = makeSettings({ tpPercent: 10, slPercent: 5 });
      const { tp: tp1, sl: sl1 } = protectFromSettings(50_000, 'short', settings);
      const { tp: tp2, sl: sl2 } = protectFromSettings(100_000, 'short', settings);
      expect(tp2).toBeCloseTo(tp1! * 2, 4);
      expect(sl2).toBeCloseTo(sl1! * 2, 4);
    });
  });

  describe('long vs short bracket direction', () => {
    it('long tp > entry, short tp < entry for same settings', () => {
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { tp: longTp } = protectFromSettings(50_000, 'long', settings);
      const { tp: shortTp } = protectFromSettings(50_000, 'short', settings);
      expect(longTp).toBeGreaterThan(50_000);
      expect(shortTp).toBeLessThan(50_000);
    });

    it('long sl < entry, short sl > entry for same settings', () => {
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { sl: longSl } = protectFromSettings(50_000, 'long', settings);
      const { sl: shortSl } = protectFromSettings(50_000, 'short', settings);
      expect(longSl).toBeLessThan(50_000);
      expect(shortSl).toBeGreaterThan(50_000);
    });

    it('long tp distance equals short tp distance for same tpPercent', () => {
      const entry = 50_000;
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { tp: longTp } = protectFromSettings(entry, 'long', settings);
      const { tp: shortTp } = protectFromSettings(entry, 'short', settings);
      const longTpDist = longTp! - entry;
      const shortTpDist = entry - shortTp!;
      expect(longTpDist).toBeCloseTo(shortTpDist, 6);
    });

    it('long sl distance equals short sl distance for same slPercent', () => {
      const entry = 50_000;
      const settings = makeSettings({ tpPercent: 5, slPercent: 2 });
      const { sl: longSl } = protectFromSettings(entry, 'long', settings);
      const { sl: shortSl } = protectFromSettings(entry, 'short', settings);
      const longSlDist = entry - longSl!;
      const shortSlDist = shortSl! - entry;
      expect(longSlDist).toBeCloseTo(shortSlDist, 6);
    });
  });

  describe('DEFAULT_SYMBOL_TRADING values (tpPercent=2, slPercent=1)', () => {
    it('long: tp is 2% above entry', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { tp } = protectFromSettings(50_000, 'long', settings);
      expect(((tp! - 50_000) / 50_000) * 100).toBeCloseTo(2, 6);
    });

    it('long: sl is 1% below entry', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { sl } = protectFromSettings(50_000, 'long', settings);
      expect(((50_000 - sl!) / 50_000) * 100).toBeCloseTo(1, 6);
    });

    it('short: tp is 2% below entry', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { tp } = protectFromSettings(50_000, 'short', settings);
      expect(((50_000 - tp!) / 50_000) * 100).toBeCloseTo(2, 6);
    });

    it('short: sl is 1% above entry', () => {
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { sl } = protectFromSettings(50_000, 'short', settings);
      expect(((sl! - 50_000) / 50_000) * 100).toBeCloseTo(1, 6);
    });
  });

  describe('position sizing × bracket interaction', () => {
    it('P&L at long TP = entry * qty * tpPercent/100', () => {
      const entry = 50_000;
      const qty = 0.2;        // e.g. $1000 margin at 10x / $50k price
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { tp } = protectFromSettings(entry, 'long', settings);
      const pnl = (tp! - entry) * qty;
      expect(pnl).toBeCloseTo(entry * qty * (2 / 100), 6); // 200
    });

    it('loss at long SL = entry * qty * slPercent/100', () => {
      const entry = 50_000;
      const qty = 0.2;
      const settings = makeSettings({ tpPercent: 2, slPercent: 1 });
      const { sl } = protectFromSettings(entry, 'long', settings);
      const loss = (entry - sl!) * qty;
      expect(loss).toBeCloseTo(entry * qty * (1 / 100), 6); // 100
    });

    it('risk/reward ratio = tpPercent / slPercent', () => {
      const entry = 50_000;
      const settings = makeSettings({ tpPercent: 3, slPercent: 1 });
      const { tp, sl } = protectFromSettings(entry, 'long', settings);
      const reward = tp! - entry;
      const risk = entry - sl!;
      expect(reward / risk).toBeCloseTo(3, 6);
    });
  });
});
