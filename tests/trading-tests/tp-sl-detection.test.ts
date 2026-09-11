import { describe, it, expect } from '@jest/globals';
import { resolveExitCondition } from '../../lib/trading/mock';
import type { ChartPosition, Candle } from '../../types';

/**
 * Tests for Take Profit (TP) and Stop Loss (SL) hit detection.
 *
 * SCOPE — read before relying on any section:
 * - The tick-price sections encode the SAME rules as the production function
 *   `resolveExitCondition(pos, last)` (tick-level evaluation, fill at level).
 * - The candle-based / wick / candle-open sections below are SPEC-LEVEL
 *   detection rules implemented inline in the tests. They do NOT exercise
 *   production code: the production engine is tick-driven and contains no
 *   OHLC candle simulation and no same-candle TP/SL resolution.
 * - Production tick-level priority (liq > sl > tp) and determinism are
 *   covered against the real function in
 *   deterministic-tick-exit-priority.test.ts and production-exports.test.ts.
 */

describe('TP/SL Hit Detection', () => {
  describe('long position TP detection', () => {
    it('should detect TP hit when price reaches or exceeds TP level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000, // TP at 55000
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000; // Exactly at TP
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(true);
    });

    it('should detect TP hit when price exceeds TP level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 56000; // Above TP
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(true);
    });

    it('should not detect TP hit when price is below TP level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 54000; // Below TP
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(false);
    });

    it('should not detect TP hit when TP is null', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null, // No TP set
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(false);
    });

    it('should handle TP very close to current price', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 50001, // TP 1 dollar above
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50001;
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(true);
    });
  });

  describe('long position SL detection', () => {
    it('should detect SL hit when price reaches or goes below SL level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 45000, // SL at 45000
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000; // Exactly at SL
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(true);
    });

    it('should detect SL hit when price goes below SL level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 44000; // Below SL
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(true);
    });

    it('should not detect SL hit when price is above SL level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 46000; // Above SL
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(false);
    });

    it('should not detect SL hit when SL is null', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null, // No SL set
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(false);
    });
  });

  describe('short position TP detection', () => {
    it('should detect TP hit when price reaches or goes below TP level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: 45000, // TP at 45000 (profit when price drops)
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000; // Exactly at TP
      const hitTp = position.tp != null && currentPrice <= position.tp;

      expect(hitTp).toBe(true);
    });

    it('should detect TP hit when price goes below TP level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: 45000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 44000; // Below TP
      const hitTp = position.tp != null && currentPrice <= position.tp;

      expect(hitTp).toBe(true);
    });

    it('should not detect TP hit when price is above TP level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: 45000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 46000; // Above TP
      const hitTp = position.tp != null && currentPrice <= position.tp;

      expect(hitTp).toBe(false);
    });
  });

  describe('short position SL detection', () => {
    it('should detect SL hit when price reaches or exceeds SL level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 55000, // SL at 55000 (loss when price rises)
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000; // Exactly at SL
      const hitSl = position.sl != null && currentPrice >= position.sl;

      expect(hitSl).toBe(true);
    });

    it('should detect SL hit when price exceeds SL level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 55000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 56000; // Above SL
      const hitSl = position.sl != null && currentPrice >= position.sl;

      expect(hitSl).toBe(true);
    });

    it('should not detect SL hit when price is below SL level', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 55000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 54000; // Below SL
      const hitSl = position.sl != null && currentPrice >= position.sl;

      expect(hitSl).toBe(false);
    });
  });

  describe('TP and SL combination scenarios', () => {
    it('should detect TP hit before SL when both could be hit', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000; // At TP, far from SL
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitTp).toBe(true);
      expect(hitSl).toBe(false);
    });

    it('should detect SL hit before TP when both could be hit', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000; // At SL, far from TP
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitTp).toBe(false);
      expect(hitSl).toBe(true);
    });

    it('should handle neither TP nor SL hit in normal range', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50000; // At entry, between TP and SL
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitTp).toBe(false);
      expect(hitSl).toBe(false);
    });

    it('should handle position with only TP set', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: null, // No SL
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitTp).toBe(true);
      expect(hitSl).toBe(false);
    });

    it('should handle position with only SL set', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null, // No TP
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000;
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitTp).toBe(false);
      expect(hitSl).toBe(true);
    });
  });

  describe('TP/SL hit priority and execution', () => {
    it('a single tick cannot breach both TP and SL of a sane position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      // For a long, TP sits above and SL below: one price can hit at most one.
      expect(hitTp).toBe(true);
      expect(hitSl).toBe(false);
    });

    it('production priority when one tick breaches several levels is liq > sl > tp', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: 45000,
        leverage: 10,
        liq: 45500,
      };

      // One tick below both liq and sl: liquidation outranks stop loss.
      expect(resolveExitCondition(position, 45000)).toEqual({ px: 45500, reason: 'liq' });
    });

    it('should execute at TP price when TP is hit', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 56000; // Above TP
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const executionPrice = hitTp ? position.tp! : currentPrice;

      expect(executionPrice).toBe(55000); // Execute at TP, not current price
    });

    it('should execute at SL price when SL is hit', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 44000; // Below SL
      const hitSl = position.sl != null && currentPrice <= position.sl;
      const executionPrice = hitSl ? position.sl! : currentPrice;

      expect(executionPrice).toBe(45000); // Execute at SL, not current price
    });
  });

  describe('TP/SL with different price precisions', () => {
    it('should handle TP with decimal precision', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'ETHUSDT',
        side: 'long',
        entry: 3000.50,
        qty: 1,
        tp: 3300.75, // Precise TP
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 3300.75;
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(true);
    });

    it('should handle SL with decimal precision', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'ETHUSDT',
        side: 'long',
        entry: 3000.50,
        qty: 1,
        tp: null,
        sl: 2700.25, // Precise SL
        leverage: 1,
        liq: null,
      };

      const currentPrice = 2700.25;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(true);
    });

    it('should handle very small TP/SL values for low-priced assets', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'SHIBUSDT',
        side: 'long',
        entry: 0.00001,
        qty: 1000000,
        tp: 0.000015, // 50% increase
        sl: 0.000008, // 20% decrease
        leverage: 1,
        liq: null,
      };

      const currentPrice = 0.000015;
      const hitTp = position.tp != null && currentPrice >= position.tp;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitTp).toBe(true);
      expect(hitSl).toBe(false);
    });
  });

  describe('TP/SL edge cases', () => {
    it('should handle TP set at entry price', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 50000, // TP at entry (no profit)
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50000;
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(true); // Would trigger immediately
    });

    it('should handle SL set at entry price', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 50000, // SL at entry (no loss tolerance)
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50000;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(true); // Would trigger immediately
    });

    it('should handle TP below entry for long position (invalid but should not crash)', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 45000, // TP below entry (invalid for long)
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000;
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(true); // Logic still works, but TP is invalid
    });

    it('should handle SL above entry for long position (invalid but should not crash)', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 55000, // SL above entry (invalid for long)
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(true); // Logic still works, but SL is invalid
    });
  });

  describe('TP/SL with leverage considerations', () => {
    it('should detect TP hit regardless of leverage', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: null,
        leverage: 10, // High leverage
        liq: null,
      };

      const currentPrice = 55000;
      const hitTp = position.tp != null && currentPrice >= position.tp;

      expect(hitTp).toBe(true); // Leverage doesn't affect TP detection
    });

    it('should detect SL hit regardless of leverage', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 45000,
        leverage: 20, // Very high leverage
        liq: null,
      };

      const currentPrice = 45000;
      const hitSl = position.sl != null && currentPrice <= position.sl;

      expect(hitSl).toBe(true); // Leverage doesn't affect SL detection
    });
  });

  describe('candle-based TP/SL detection (spec-level rules, not production engine)', () => {
    const baseTime = 1625097600; // 2021-06-30 00:00:00 UTC

    it('should detect TP hit within candle high for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 52000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const candle: Candle = {
        time: baseTime,
        open: 50500,
        high: 53000, // Above TP
        low: 50000,  // At entry
        close: 52500,
        volume: 1000,
      };

      const hitTp = position.tp != null && candle.high >= position.tp;
      expect(hitTp).toBe(true);
      expect(candle.high).toBeGreaterThanOrEqual(position.tp!);
    });

    it('should detect SL hit within candle low for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 48000,
        leverage: 1,
        liq: null,
      };

      const candle: Candle = {
        time: baseTime,
        open: 49500,
        high: 50000,  // At entry
        low: 47000,   // Below SL
        close: 48500,
        volume: 1000,
      };

      const hitSl = position.sl != null && candle.low <= position.sl;
      expect(hitSl).toBe(true);
      expect(candle.low).toBeLessThanOrEqual(position.sl!);
    });

    it('should detect TP hit within candle low for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: 48000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const candle: Candle = {
        time: baseTime,
        open: 49500,
        high: 50000,  // At entry
        low: 47000,   // Below TP
        close: 48500,
        volume: 1000,
      };

      const hitTp = position.tp != null && candle.low <= position.tp;
      expect(hitTp).toBe(true);
    });

    it('should detect SL hit within candle high for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 52000,
        leverage: 1,
        liq: null,
      };

      const candle: Candle = {
        time: baseTime,
        open: 50500,
        high: 53000, // Above SL
        low: 50000,  // At entry
        close: 52500,
        volume: 1000,
      };

      const hitSl = position.sl != null && candle.high >= position.sl;
      expect(hitSl).toBe(true);
    });
  });

  describe('multiple TP/SL levels (trailing)', () => {
    it('should handle first TP level for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 52000, // First TP
        sl: 48000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 52000;
      const hitTp = position.tp != null && currentPrice >= position.tp;
      
      expect(hitTp).toBe(true);
    });

    it('should calculate partial close P&L at first TP', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 2,
        tp: 52000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const firstTpQty = 1; // Close 50% at first TP
      const closePrice = 52000;
      const partialPnl = (closePrice - position.entry) * firstTpQty;
      const remainingQty = position.qty - firstTpQty;

      expect(partialPnl).toBe(2000); // 1 * (52000 - 50000)
      expect(remainingQty).toBe(1);
    });
  });

  describe('TP/SL with different order types', () => {
    it('should apply SL immediately for market order', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000;
      const hitSl = position.sl != null && currentPrice <= position.sl;
      
      expect(hitSl).toBe(true);
    });

    it('should handle SL for market exit', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 48000,
        leverage: 1,
        liq: null,
      };

      const marketPrice = 47000;
      const hitSl = position.sl != null && marketPrice <= position.sl;
      const executionPrice = hitSl ? position.sl! : marketPrice;

      expect(executionPrice).toBe(48000); // SL takes precedence
    });
  });

  describe('TP/SL wick and shadow scenarios (spec-level rules, not production engine)', () => {
    const baseTime = 1625097600; // 2021-06-30 00:00:00 UTC

    it('should detect TP hit when price wicks above TP', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 52000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const candle: Candle = {
        time: baseTime,
        open: 51000,
        high: 53000, // Wick above TP
        low: 50500,
        close: 51500, // Closes below TP
        volume: 1000,
      };

      const hitTp = position.tp != null && candle.high >= position.tp;
      const hitClose = position.tp != null && candle.close >= position.tp;

      expect(hitTp).toBe(true); // Detected on wick
      expect(hitClose).toBe(false); // But close didn't reach TP
    });

    it('should detect SL hit when price wicks below SL', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 48000,
        leverage: 1,
        liq: null,
      };

      const candle: Candle = {
        time: baseTime,
        open: 49000,
        high: 50500,
        low: 47000, // Wick below SL
        close: 49500, // Closes above SL
        volume: 1000,
      };

      const hitSl = position.sl != null && candle.low <= position.sl;
      const hitClose = position.sl != null && candle.close <= position.sl;

      expect(hitSl).toBe(true); // Detected on wick
      expect(hitClose).toBe(false); // But close didn't reach SL
    });
  });

  describe('TP/SL execution fill price', () => {
    it('should fill at exact TP price for long when TP hit', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 56000; // Above TP
      const fillPrice = position.tp!; // Fill at TP, not current price

      expect(fillPrice).toBe(55000);
      expect(fillPrice).not.toBe(currentPrice);
    });

    it('should fill at exact SL price for long when SL hit', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: 45000,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 44000; // Below SL
      const fillPrice = position.sl!; // Fill at SL, not current price

      expect(fillPrice).toBe(45000);
      expect(fillPrice).not.toBe(currentPrice);
    });

    it('should calculate P&L using TP fill price', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 55000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 57000; // Well above TP
      const fillPrice = position.tp!;
      const pnl = (fillPrice - position.entry) * position.qty;

      expect(pnl).toBe(5000); // Fill at 55000, not 57000
      expect(pnl).not.toBe((currentPrice - position.entry) * position.qty);
    });
  });

  describe('TP/SL detection at candle open (spec-level rules, not production engine)', () => {
    const baseTime = 1625097600; // 2021-06-30 00:00:00 UTC

    it('should detect TP hit at candle open if open >= TP', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 52000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const candle: Candle = {
        time: baseTime,
        open: 52000, // Opens at TP
        high: 54000,
        low: 51500,
        close: 53000,
        volume: 1000,
      };

      const hitTp = position.tp != null && candle.open >= position.tp;
      expect(hitTp).toBe(true);
    });

    it('should treat TP/SL as instantaneous within candle', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 52000,
        sl: null,
        leverage: 1,
        liq: null,
      };

      // Candle where TP was touched during the period
      const candle: Candle = {
        time: baseTime,
        open: 50500,
        high: 55000, // TP touched
        low: 50000,
        close: 51000, // Closed below TP
        volume: 1000,
      };

      const hitTp = position.tp != null && candle.high >= position.tp;
      expect(hitTp).toBe(true); // TP detected regardless of close
    });
  });
});
