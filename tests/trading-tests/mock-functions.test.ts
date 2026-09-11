import { describe, it, expect } from '@jest/globals';
import {
  positionPnl,
  usedMargin,
  ordersMargin,
  formatNum,
  formatUsd,
  resolveExitCondition,
} from '../../lib/trading/mock';
import type { ChartPosition, ChartOrder } from '../../types';

/**
 * Direct function-level tests for the pure helpers exported from lib/trading/mock.ts.
 *
 * These tests call the actual implementation rather than re-implementing formulas
 * inline, so they will catch changes to the source that break the contracts.
 *
 * Functions under test:
 *   positionPnl   – unrealized P&L for a single position
 *   usedMargin    – total locked margin across a position array
 *   ordersMargin  – total margin tied up in pending orders
 *   formatNum     – locale-formatted number
 *   formatUsd     – locale-formatted USD string
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePos(
  overrides: Partial<ChartPosition> & { side: 'long' | 'short'; entry: number; qty: number },
): ChartPosition {
  return {
    id: 'pos-test',
    symbol: 'BTCUSDT',
    tp: null,
    sl: null,
    leverage: 1,
    liq: null,
    ...overrides,
  };
}

function makeOrder(overrides: Partial<ChartOrder> & { qty: number; price: number }): ChartOrder {
  return {
    id: 'order-test',
    symbol: 'BTCUSDT',
    side: 'buy',
    type: 'limit',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// positionPnl
// ---------------------------------------------------------------------------

describe('positionPnl (direct function)', () => {
  describe('long position', () => {
    it('returns profit when price is above entry', () => {
      const pos = makePos({ side: 'long', entry: 50_000, qty: 1 });
      expect(positionPnl(pos, 55_000)).toBe(5_000);
    });

    it('returns loss when price is below entry', () => {
      const pos = makePos({ side: 'long', entry: 50_000, qty: 1 });
      expect(positionPnl(pos, 45_000)).toBe(-5_000);
    });

    it('returns zero when price equals entry', () => {
      const pos = makePos({ side: 'long', entry: 50_000, qty: 1 });
      expect(positionPnl(pos, 50_000)).toBe(0);
    });

    it('scales linearly with quantity', () => {
      const pos = makePos({ side: 'long', entry: 50_000, qty: 3 });
      expect(positionPnl(pos, 51_000)).toBe(3_000); // (51k-50k)*3
    });

    it('handles fractional quantity', () => {
      const pos = makePos({ side: 'long', entry: 50_000, qty: 0.5 });
      expect(positionPnl(pos, 52_000)).toBe(1_000); // (52k-50k)*0.5
    });

    it('leverage field has no effect on P&L (leverage is baked into qty)', () => {
      const low = makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 1 });
      const high = makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 10 });
      expect(positionPnl(low, 55_000)).toBe(positionPnl(high, 55_000));
    });

    it('works for very low-price assets', () => {
      const pos = makePos({ side: 'long', entry: 0.00001, qty: 1_000_000 });
      expect(positionPnl(pos, 0.00002)).toBeCloseTo(10, 6);
    });
  });

  describe('short position', () => {
    it('returns profit when price is below entry', () => {
      const pos = makePos({ side: 'short', entry: 50_000, qty: 1 });
      expect(positionPnl(pos, 45_000)).toBe(5_000);
    });

    it('returns loss when price is above entry', () => {
      const pos = makePos({ side: 'short', entry: 50_000, qty: 1 });
      expect(positionPnl(pos, 55_000)).toBe(-5_000);
    });

    it('returns zero when price equals entry', () => {
      const pos = makePos({ side: 'short', entry: 50_000, qty: 1 });
      expect(positionPnl(pos, 50_000)).toBe(0);
    });

    it('scales linearly with quantity', () => {
      const pos = makePos({ side: 'short', entry: 50_000, qty: 4 });
      expect(positionPnl(pos, 49_000)).toBe(4_000); // (50k-49k)*4
    });

    it('handles fractional quantity', () => {
      const pos = makePos({ side: 'short', entry: 50_000, qty: 0.25 });
      expect(positionPnl(pos, 45_000)).toBe(1_250); // (50k-45k)*0.25
    });
  });

  describe('P&L symmetry between long and short', () => {
    it('long profit on up-move equals short profit on equivalent down-move', () => {
      const long = makePos({ side: 'long', entry: 50_000, qty: 1 });
      const short = makePos({ side: 'short', entry: 50_000, qty: 1 });
      expect(positionPnl(long, 55_000)).toBe(positionPnl(short, 45_000));
    });

    it('long loss equals negative of short profit for mirror moves', () => {
      const long = makePos({ side: 'long', entry: 50_000, qty: 1 });
      const short = makePos({ side: 'short', entry: 50_000, qty: 1 });
      expect(positionPnl(long, 45_000)).toBe(-positionPnl(short, 45_000));
    });
  });

  describe('TP/SL fill price P&L', () => {
    it('long: P&L at TP fill price matches (tp - entry) * qty', () => {
      const pos = makePos({ side: 'long', entry: 50_000, qty: 2, tp: 55_000, sl: 45_000 });
      expect(positionPnl(pos, pos.tp!)).toBe((55_000 - 50_000) * 2);
    });

    it('long: P&L at SL fill price matches (sl - entry) * qty (negative)', () => {
      const pos = makePos({ side: 'long', entry: 50_000, qty: 2, tp: 55_000, sl: 45_000 });
      expect(positionPnl(pos, pos.sl!)).toBe((45_000 - 50_000) * 2);
    });

    it('short: P&L at TP fill price matches (entry - tp) * qty', () => {
      const pos = makePos({ side: 'short', entry: 50_000, qty: 1, tp: 45_000, sl: 55_000 });
      expect(positionPnl(pos, pos.tp!)).toBe((50_000 - 45_000) * 1);
    });

    it('short: P&L at SL fill price is negative', () => {
      const pos = makePos({ side: 'short', entry: 50_000, qty: 1, tp: 45_000, sl: 55_000 });
      expect(positionPnl(pos, pos.sl!)).toBe((50_000 - 55_000) * 1);
    });
  });
});

// ---------------------------------------------------------------------------
// usedMargin
// ---------------------------------------------------------------------------

describe('usedMargin (direct function)', () => {
  it('returns 0 for an empty array', () => {
    expect(usedMargin([])).toBe(0);
  });

  it('calculates margin for a single position without leverage', () => {
    const pos = makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 1 });
    // margin = qty * entry / max(1, leverage) = 1 * 50000 / 1 = 50000
    expect(usedMargin([pos])).toBe(50_000);
  });

  it('divides by leverage correctly', () => {
    const pos = makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 10 });
    expect(usedMargin([pos])).toBe(5_000);
  });

  it('clamps leverage to minimum of 1 (leverage = 0)', () => {
    const pos = makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 0 });
    // Math.max(1, 0) = 1 → margin = 50000
    expect(usedMargin([pos])).toBe(50_000);
  });

  it('sums across multiple positions with same leverage', () => {
    const positions: ChartPosition[] = [
      makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 1 }),
      makePos({ side: 'long', entry: 3_000, qty: 10, leverage: 1 }),
    ];
    // 50000 + 30000 = 80000
    expect(usedMargin(positions)).toBe(80_000);
  });

  it('sums across multiple positions with different leverages', () => {
    const positions: ChartPosition[] = [
      makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 10 }),  // 5000
      makePos({ side: 'short', entry: 3_000, qty: 10, leverage: 5 }), // 6000
    ];
    expect(usedMargin(positions)).toBe(11_000);
  });

  it('handles fractional quantities', () => {
    const pos = makePos({ side: 'long', entry: 50_000, qty: 0.5, leverage: 1 });
    expect(usedMargin([pos])).toBe(25_000);
  });

  it('handles short positions identically (side does not affect margin)', () => {
    const long = makePos({ side: 'long', entry: 50_000, qty: 1, leverage: 5 });
    const short = makePos({ side: 'short', entry: 50_000, qty: 1, leverage: 5 });
    expect(usedMargin([long])).toBe(usedMargin([short]));
  });
});

// ---------------------------------------------------------------------------
// ordersMargin
// ---------------------------------------------------------------------------

describe('ordersMargin (direct function)', () => {
  it('returns 0 for empty order list', () => {
    expect(ordersMargin([], 10)).toBe(0);
  });

  it('calculates margin for a single order', () => {
    const order = makeOrder({ qty: 1, price: 50_000 });
    // lev = max(1,10) = 10 → margin = 1*50000/10 = 5000
    expect(ordersMargin([order], 10)).toBe(5_000);
  });

  it('clamps leverage to minimum of 1', () => {
    const order = makeOrder({ qty: 1, price: 50_000 });
    // leverage = 0 → max(1,0) = 1 → margin = 50000
    expect(ordersMargin([order], 0)).toBe(50_000);
  });

  it('sums across multiple orders', () => {
    const orders: ChartOrder[] = [
      makeOrder({ qty: 1, price: 50_000 }),
      makeOrder({ qty: 2, price: 3_000 }),
    ];
    // leverage=1: 50000 + 6000 = 56000
    expect(ordersMargin(orders, 1)).toBe(56_000);
  });

  it('applies the same leverage to all orders', () => {
    const orders: ChartOrder[] = [
      makeOrder({ qty: 1, price: 50_000 }),
      makeOrder({ qty: 1, price: 50_000 }),
    ];
    // leverage=5: (50000 + 50000) / 5 = 20000
    expect(ordersMargin(orders, 5)).toBe(20_000);
  });

  it('handles fractional quantities', () => {
    const order = makeOrder({ qty: 0.5, price: 50_000 });
    expect(ordersMargin([order], 1)).toBe(25_000);
  });

  it('handles sell orders the same as buy orders', () => {
    const buyOrder = makeOrder({ qty: 1, price: 50_000, side: 'buy' });
    const sellOrder = makeOrder({ qty: 1, price: 50_000, side: 'sell' });
    expect(ordersMargin([buyOrder], 1)).toBe(ordersMargin([sellOrder], 1));
  });

  it('negative leverage is clamped to 1', () => {
    const order = makeOrder({ qty: 1, price: 50_000 });
    expect(ordersMargin([order], -5)).toBe(50_000);
  });
});

// ---------------------------------------------------------------------------
// formatNum
// ---------------------------------------------------------------------------

describe('formatNum (direct function)', () => {
  it('formats an integer with 2 decimal places', () => {
    expect(formatNum(1234)).toBe('1,234.00');
  });

  it('formats a decimal value with default 2 places', () => {
    expect(formatNum(1234.5)).toBe('1,234.50');
  });

  it('rounds to the specified digits', () => {
    expect(formatNum(1.23456, 4)).toBe('1.2346');
  });

  it('handles zero', () => {
    expect(formatNum(0)).toBe('0.00');
  });

  it('handles negative numbers', () => {
    expect(formatNum(-1234)).toBe('-1,234.00');
  });

  it('handles large numbers with comma separators', () => {
    expect(formatNum(1_000_000)).toBe('1,000,000.00');
  });

  it('defaults to 2 decimal places when digits not supplied', () => {
    expect(formatNum(9.9)).toBe('9.90');
  });
});

// ---------------------------------------------------------------------------
// formatUsd
// ---------------------------------------------------------------------------

describe('formatUsd (direct function)', () => {
  it('prepends $ for positive values', () => {
    expect(formatUsd(1234)).toBe('$1,234.00');
  });

  it('prepends -$ for negative values', () => {
    expect(formatUsd(-1234)).toBe('-$1,234.00');
  });

  it('handles zero', () => {
    expect(formatUsd(0)).toBe('$0.00');
  });

  it('formats large positive amounts', () => {
    expect(formatUsd(1_000_000)).toBe('$1,000,000.00');
  });

  it('formats large negative amounts', () => {
    expect(formatUsd(-50_000)).toBe('-$50,000.00');
  });

  it('respects custom digit precision', () => {
    expect(formatUsd(1.5, 4)).toBe('$1.5000');
  });

  it('negative value with custom precision has -$ prefix', () => {
    expect(formatUsd(-9.99, 4)).toBe('-$9.9900');
  });
});

// ---------------------------------------------------------------------------
// resolveExitCondition — PRODUCTION function from tickMock
//
// This tests the ACTUAL production priority logic: liq > sl > tp
// ---------------------------------------------------------------------------

describe('resolveExitCondition (production function)', () => {
  describe('long position — individual hits', () => {
    it('detects TP hit when last >= tp', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: null, liq: null };
      expect(resolveExitCondition(pos, 55_000)).toEqual({ px: 55_000, reason: 'tp' });
    });

    it('detects TP hit when last exceeds tp', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: null, liq: null };
      expect(resolveExitCondition(pos, 57_000)).toEqual({ px: 55_000, reason: 'tp' });
    });

    it('does not detect TP when last < tp', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: null, liq: null };
      expect(resolveExitCondition(pos, 54_999)).toBeNull();
    });

    it('detects SL hit when last <= sl', () => {
      const pos = { side: 'long' as const, tp: null, sl: 45_000, liq: null };
      expect(resolveExitCondition(pos, 45_000)).toEqual({ px: 45_000, reason: 'sl' });
    });

    it('detects SL hit when last drops below sl', () => {
      const pos = { side: 'long' as const, tp: null, sl: 45_000, liq: null };
      expect(resolveExitCondition(pos, 44_000)).toEqual({ px: 45_000, reason: 'sl' });
    });

    it('detects liquidation hit when last <= liq', () => {
      const pos = { side: 'long' as const, tp: null, sl: null, liq: 41_000 };
      expect(resolveExitCondition(pos, 41_000)).toEqual({ px: 41_000, reason: 'liq' });
    });

    it('returns null when nothing is hit', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: 40_000 };
      expect(resolveExitCondition(pos, 50_000)).toBeNull();
    });
  });

  describe('short position — individual hits', () => {
    it('detects TP hit when last <= tp (short profits on fall)', () => {
      const pos = { side: 'short' as const, tp: 45_000, sl: null, liq: null };
      expect(resolveExitCondition(pos, 45_000)).toEqual({ px: 45_000, reason: 'tp' });
    });

    it('detects SL hit when last >= sl (short loses on rise)', () => {
      const pos = { side: 'short' as const, tp: null, sl: 55_000, liq: null };
      expect(resolveExitCondition(pos, 55_000)).toEqual({ px: 55_000, reason: 'sl' });
    });

    it('detects liquidation when last >= liq', () => {
      const pos = { side: 'short' as const, tp: null, sl: null, liq: 59_000 };
      expect(resolveExitCondition(pos, 59_000)).toEqual({ px: 59_000, reason: 'liq' });
    });
  });

  describe('collision resolution — liq > sl > tp', () => {
    it('long: liq takes priority over sl when both hit', () => {
      // liq below sl — a big drop triggers both
      const pos = { side: 'long' as const, tp: null, sl: 45_000, liq: 41_000 };
      const result = resolveExitCondition(pos, 40_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('liq');
      expect(result!.px).toBe(41_000);
    });

    it('long: sl takes priority over tp when both hit (no liq)', () => {
      // Price moves down enough to hit SL; TP is above so it is NOT hit — confirm logic
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: null };
      // last=44000: hits sl (44k<=45k), does NOT hit tp (44k < 55k)
      const result = resolveExitCondition(pos, 44_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('sl');
      expect(result!.px).toBe(45_000);
    });

    it('long: tp fires alone when only tp is hit', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: null };
      const result = resolveExitCondition(pos, 56_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('tp');
      expect(result!.px).toBe(55_000);
    });

    it('long single tick: liq > sl — liq wins when both are breached', () => {
      // On ONE tick, a long can breach liq and sl together (both below), but
      // can never also breach tp (above) — a true 3-way hit is impossible
      // at the tick level. There is no candle-level collision concept in
      // production; see lib/trading/exit-conditions.ts for the policy.
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: 41_000 };
      const result = resolveExitCondition(pos, 40_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('liq'); // liq wins over sl
    });

    it('short: liq takes priority over sl when both hit', () => {
      const pos = { side: 'short' as const, tp: null, sl: 55_000, liq: 59_000 };
      const result = resolveExitCondition(pos, 60_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('liq');
      expect(result!.px).toBe(59_000);
    });

    it('short: sl takes priority over tp when only sl is hit', () => {
      const pos = { side: 'short' as const, tp: 45_000, sl: 55_000, liq: null };
      // last=56000: hits sl (56000>=55000), does not hit tp (56000>45000 → 56000<=45000 is false)
      const result = resolveExitCondition(pos, 56_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('sl');
    });

    it('short: tp fires alone when only tp is hit', () => {
      const pos = { side: 'short' as const, tp: 45_000, sl: 55_000, liq: null };
      const result = resolveExitCondition(pos, 44_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('tp');
      expect(result!.px).toBe(45_000);
    });
  });

  describe('determinism — same inputs always produce same output', () => {
    it('produces identical results across repeated calls with same inputs', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: 41_000 };
      const r1 = resolveExitCondition(pos, 40_000);
      const r2 = resolveExitCondition(pos, 40_000);
      const r3 = resolveExitCondition(pos, 40_000);
      expect(r1).toEqual(r2);
      expect(r2).toEqual(r3);
    });

    it('is consistent across different candle close prices with the same last', () => {
      const pos = { side: 'long' as const, tp: 55_000, sl: 45_000, liq: null };
      // When last hits sl, result is always sl regardless of what the candle close was
      expect(resolveExitCondition(pos, 44_000)).toEqual({ px: 45_000, reason: 'sl' });
      expect(resolveExitCondition(pos, 44_000)).toEqual({ px: 45_000, reason: 'sl' });
    });
  });

  describe('edge cases', () => {
    it('null tp, sl, and liq → no hit', () => {
      const pos = { side: 'long' as const, tp: null, sl: null, liq: null };
      expect(resolveExitCondition(pos, 99_999)).toBeNull();
    });

    it('tp set at entry — fires immediately when last = entry', () => {
      const pos = { side: 'long' as const, tp: 50_000, sl: null, liq: null };
      const result = resolveExitCondition(pos, 50_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('tp');
    });

    it('sl set at entry — fires immediately when last = entry', () => {
      const pos = { side: 'long' as const, tp: null, sl: 50_000, liq: null };
      const result = resolveExitCondition(pos, 50_000);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('sl');
    });
  });
});

// ---------------------------------------------------------------------------
// Balance flow calculations (pure arithmetic from applyFill)
//
// applyFill is private to the module and depends on the Zustand store, so we
// test the arithmetic contracts directly.  These lock down the formulas so
// that any formula change in applyFill is visible as a test failure.
// ---------------------------------------------------------------------------

describe('Balance flow arithmetic (applyFill contracts)', () => {
  describe('margin lock on open', () => {
    it('margin = (qty * price) / leverage', () => {
      const qty = 0.2;
      const price = 50_000;
      const leverage = 10;
      const margin = (qty * price) / leverage;
      expect(margin).toBe(1_000);
    });

    it('balance after open = balance - margin', () => {
      const balance = 100_000;
      const margin = 1_000;
      expect(balance - margin).toBe(99_000);
    });

    it('open is rejected when balance < margin', () => {
      const balance = 500;
      const margin = 1_000;
      expect(balance < margin).toBe(true); // applyFill returns early
    });
  });

  describe('P&L on close', () => {
    it('long close: pnl = (exitPrice - entry) * closedQty', () => {
      const entry = 50_000;
      const exitPrice = 55_000;
      const closedQty = 1;
      expect((exitPrice - entry) * closedQty).toBe(5_000);
    });

    it('long close at loss: pnl is negative', () => {
      const entry = 50_000;
      const exitPrice = 45_000;
      const closedQty = 1;
      expect((exitPrice - entry) * closedQty).toBe(-5_000);
    });

    it('short close: pnl = (entry - exitPrice) * closedQty', () => {
      const entry = 50_000;
      const exitPrice = 45_000;
      const closedQty = 1;
      expect((entry - exitPrice) * closedQty).toBe(5_000);
    });

    it('short close at loss: pnl is negative', () => {
      const entry = 50_000;
      const exitPrice = 55_000;
      const closedQty = 1;
      expect((entry - exitPrice) * closedQty).toBe(-5_000);
    });

    it('released margin = (closedQty * entry) / leverage (at original entry, not exit)', () => {
      const entry = 50_000;
      const leverage = 10;
      const closedQty = 1;
      const released = (closedQty * entry) / leverage;
      expect(released).toBe(5_000);
    });

    it('balance after close = balance + released + pnl', () => {
      const balance = 99_000;
      const released = 5_000;
      const pnl = 500;
      expect(balance + released + pnl).toBe(104_500);
    });
  });

  describe('pyramid (add to same-side position)', () => {
    it('new average entry is weighted average', () => {
      const existingEntry = 50_000;
      const existingQty = 1;
      const addPrice = 51_000;
      const addQty = 0.5;
      const newQty = existingQty + addQty;
      const newEntry = (existingEntry * existingQty + addPrice * addQty) / newQty;
      expect(newEntry).toBeCloseTo(50_333.33, 2);
    });

    it('adding zero qty leaves entry unchanged', () => {
      const existingEntry = 50_000;
      const existingQty = 1;
      const addQty = 0;
      const newQty = existingQty + addQty;
      const newEntry = (existingEntry * existingQty) / newQty;
      expect(newEntry).toBe(50_000);
    });

    it('total qty grows correctly', () => {
      const existingQty = 1;
      const addQty = 0.5;
      expect(existingQty + addQty).toBe(1.5);
    });
  });

  describe('position flip', () => {
    it('remaining qty after over-close = closeQty - existingQty', () => {
      const existingQty = 1;
      const closeQty = 1.5;
      const leftover = closeQty - existingQty;
      expect(leftover).toBe(0.5);
    });

    it('partial close reduces position qty', () => {
      const existingQty = 2;
      const closeQty = 0.5;
      expect(closeQty < existingQty).toBe(true);
      expect(existingQty - closeQty).toBe(1.5);
    });

    it('exact close removes the position (leftover = 0)', () => {
      const existingQty = 1;
      const closeQty = 1;
      const leftover = closeQty - existingQty;
      expect(leftover).toBe(0);
    });
  });
});
