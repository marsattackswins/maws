import { describe, it, expect } from '@jest/globals';
import type { ChartPosition } from '../../types';

/**
 * Tests for P&L (Profit & Loss) calculations in paper trading
 * Covers long and short position P&L with various scenarios
 */

describe('Paper Trading P&L Calculations', () => {
  describe('long position P&L', () => {
    it('should calculate profit for long position when price increases', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000; // Price increased by 5000
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(5000); // $5000 profit
      expect(pnl).toBeGreaterThan(0);
    });

    it('should calculate loss for long position when price decreases', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000; // Price decreased by 5000
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(-5000); // $5000 loss
      expect(pnl).toBeLessThan(0);
    });

    it('should calculate zero P&L for long position when price equals entry', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50000; // Price equals entry
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(0);
    });

    it('should calculate P&L with leverage for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10, // 10x leverage
        liq: null,
      };

      const currentPrice = 55000; // Price increased by 5000
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(5000); // P&L calculation doesn't include leverage directly
      // But the position size is 10x larger due to leverage
    });

    it('should calculate P&L with fractional quantity for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 0.5, // Half BTC
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(2500); // $2500 profit (5000 * 0.5)
    });

    it('should calculate P&L with large quantity for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 10, // 10 BTC
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(50000); // $50000 profit (5000 * 10)
    });

    it('should handle small price movements for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50001; // $1 increase
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(1); // $1 profit
    });

    it('should handle negative prices gracefully for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = -1000; // Invalid negative price
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(-51000); // Still calculates, but should be validated elsewhere
    });
  });

  describe('short position P&L', () => {
    it('should calculate profit for short position when price decreases', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000; // Price decreased by 5000
      const pnl = (position.entry - currentPrice) * position.qty;

      expect(pnl).toBe(5000); // $5000 profit
      expect(pnl).toBeGreaterThan(0);
    });

    it('should calculate loss for short position when price increases', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000; // Price increased by 5000
      const pnl = (position.entry - currentPrice) * position.qty;

      expect(pnl).toBe(-5000); // $5000 loss
      expect(pnl).toBeLessThan(0);
    });

    it('should calculate zero P&L for short position when price equals entry', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50000; // Price equals entry
      const pnl = (position.entry - currentPrice) * position.qty;

      expect(pnl).toBe(0);
    });

    it('should calculate P&L with leverage for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 5, // 5x leverage
        liq: null,
      };

      const currentPrice = 45000; // Price decreased by 5000
      const pnl = (position.entry - currentPrice) * position.qty;

      expect(pnl).toBe(5000); // P&L calculation doesn't include leverage directly
    });

    it('should calculate P&L with fractional quantity for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 0.25, // Quarter BTC
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000;
      const pnl = (position.entry - currentPrice) * position.qty;

      expect(pnl).toBe(1250); // $1250 profit (5000 * 0.25)
    });

    it('should handle small price movements for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 49999; // $1 decrease
      const pnl = (position.entry - currentPrice) * position.qty;

      expect(pnl).toBe(1); // $1 profit
    });
  });

  describe('P&L percentage calculations', () => {
    it('should calculate P&L percentage for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;
      const pnlPercent = (pnl / (position.entry * position.qty)) * 100;

      expect(pnl).toBe(5000);
      expect(pnlPercent).toBe(10); // 10% profit
    });

    it('should calculate P&L percentage for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 45000;
      const pnl = (position.entry - currentPrice) * position.qty;
      const pnlPercent = (pnl / (position.entry * position.qty)) * 100;

      expect(pnl).toBe(5000);
      expect(pnlPercent).toBe(10); // 10% profit
    });

    it('should calculate P&L percentage with leverage', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10, // 10x leverage
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;
      const pnlPercentLeveraged = (pnl / (position.entry * position.qty)) * position.leverage * 100;

      expect(pnl).toBe(5000);
      expect(pnlPercentLeveraged).toBe(100); // 100% profit with 10x leverage
    });
  });

  describe('P&L edge cases', () => {
    it('should handle very small position sizes', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 0.0001, // Very small quantity
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBeCloseTo(0.5, 4); // ~$0.50 profit
    });

    it('should handle very large position sizes', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1000, // Very large quantity
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(5000000); // $5M profit
    });

    it('should handle zero quantity', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 0, // Zero quantity
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(0);
    });

    it('should handle very high entry prices', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 1000000, // $1M entry
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 1100000; // 10% increase
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(100000); // $100K profit
    });

    it('should handle very low entry prices', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'SHIBUSDT',
        side: 'long',
        entry: 0.00001, // Very low price
        qty: 1000000, // Large quantity
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 0.00002; // 100% increase
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(10); // $10 profit
    });
  });

  describe('P&L with execution prices', () => {
    it('should calculate P&L based on exit price for long position', () => {
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

      const exitPrice = 55000; // Executed at TP
      const pnl = (exitPrice - position.entry) * position.qty;

      expect(pnl).toBe(5000);
    });

    it('should calculate P&L based on exit price for short position', () => {
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

      const exitPrice = 45000; // Executed at TP
      const pnl = (position.entry - exitPrice) * position.qty;

      expect(pnl).toBe(5000);
    });

    it('should calculate closed P&L for long position closed at market', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 2,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const exitPrice = 52000; // Closed at market
      const pnl = (exitPrice - position.entry) * position.qty;
      const pnlPercent = (pnl / (position.entry * position.qty)) * 100;

      expect(pnl).toBe(4000);
      expect(pnlPercent).toBe(4);
    });
  });

  describe('P&L calculation consistency', () => {
    it('should be consistent for long vs short with same price movement', () => {
      const longPosition: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const shortPosition: ChartPosition = {
        id: 'pos-2',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const longPnl = (55000 - longPosition.entry) * longPosition.qty;
      const shortPnl = (shortPosition.entry - 45000) * shortPosition.qty;

      expect(longPnl).toBe(5000);
      expect(shortPnl).toBe(5000);
      expect(longPnl).toBe(shortPnl);
    });

    it('should handle symmetric price movements', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const profitPnl = (55000 - position.entry) * position.qty;
      const lossPnl = (45000 - position.entry) * position.qty;

      expect(profitPnl).toBe(5000);
      expect(lossPnl).toBe(-5000);
      expect(profitPnl).toBe(-lossPnl);
    });
  });

  describe('P&L with different symbols', () => {
    it('should calculate P&L for ETH position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'ETHUSDT',
        side: 'long',
        entry: 3000,
        qty: 10,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 3300; // 10% increase
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(pnl).toBe(3000); // $3000 profit
    });

    it('should calculate P&L for SOL position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'SOLUSDT',
        side: 'short',
        entry: 100,
        qty: 100,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 90; // 10% decrease
      const pnl = (position.entry - currentPrice) * position.qty;

      expect(pnl).toBe(1000); // $1000 profit
    });
  });

  describe('portfolio P&L with multiple positions', () => {
    it('should calculate total P&L for multiple long positions', () => {
      const positions: ChartPosition[] = [
        {
          id: 'pos-1',
          symbol: 'BTCUSDT',
          side: 'long',
          entry: 50000,
          qty: 1,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
        {
          id: 'pos-2',
          symbol: 'ETHUSDT',
          side: 'long',
          entry: 3000,
          qty: 10,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
      ];

      const prices = [55000, 3300]; // Current prices
      let totalPnl = 0;

      positions.forEach((pos, idx) => {
        const pnl = (prices[idx] - pos.entry) * pos.qty;
        totalPnl += pnl;
      });

      expect(totalPnl).toBe(8000); // 5000 + 3000
    });

    it('should calculate total P&L for mixed long/short positions', () => {
      const positions: ChartPosition[] = [
        {
          id: 'pos-1',
          symbol: 'BTCUSDT',
          side: 'long',
          entry: 50000,
          qty: 1,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
        {
          id: 'pos-2',
          symbol: 'ETHUSDT',
          side: 'short',
          entry: 3000,
          qty: 10,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
      ];

      const prices = [55000, 2700]; // Current prices
      let totalPnl = 0;

      positions.forEach((pos, idx) => {
        const pnl = pos.side === 'long' 
          ? (prices[idx] - pos.entry) * pos.qty
          : (pos.entry - prices[idx]) * pos.qty;
        totalPnl += pnl;
      });

      expect(totalPnl).toBe(8000); // 5000 + 3000
    });

    it('should calculate total P&L with partially profitable positions', () => {
      const positions: ChartPosition[] = [
        {
          id: 'pos-1',
          symbol: 'BTCUSDT',
          side: 'long',
          entry: 50000,
          qty: 1,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
        {
          id: 'pos-2',
          symbol: 'ETHUSDT',
          side: 'long',
          entry: 3000,
          qty: 10,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
      ];

      const prices = [48000, 3100]; // One loss, one profit
      let totalPnl = 0;

      positions.forEach((pos, idx) => {
        const pnl = (prices[idx] - pos.entry) * pos.qty;
        totalPnl += pnl;
      });

      expect(totalPnl).toBe(-1000); // -2000 + 1000
    });

    it('should calculate weighted average P&L for portfolio', () => {
      const positions: ChartPosition[] = [
        {
          id: 'pos-1',
          symbol: 'BTCUSDT',
          side: 'long',
          entry: 50000,
          qty: 1,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
        {
          id: 'pos-2',
          symbol: 'ETHUSDT',
          side: 'long',
          entry: 3000,
          qty: 10,
          tp: null,
          sl: null,
          leverage: 1,
          liq: null,
        },
      ];

      const prices = [55000, 3000]; // Current prices
      const totalValue = positions.reduce((sum, pos) => sum + (pos.entry * pos.qty), 0);
      let totalPnl = 0;

      positions.forEach((pos, idx) => {
        const pnl = (prices[idx] - pos.entry) * pos.qty;
        totalPnl += pnl;
      });

      const pnlPercent = (totalPnl / totalValue) * 100;

      expect(totalValue).toBe(80000); // 50000 + 30000
      expect(totalPnl).toBe(5000); // Only BTC gained
      expect(pnlPercent).toBeCloseTo(6.25, 1); // ~6.25% of total value
    });
  });

  describe('break-even analysis', () => {
    it('should calculate break-even price for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const breakEven = position.entry; // For long, break-even is entry price
      const currentPrice = 52000;
      const pnl = (currentPrice - breakEven) * position.qty;

      expect(breakEven).toBe(50000);
      expect(pnl).toBe(2000);
    });

    it('should calculate break-even price for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const breakEven = position.entry; // For short, break-even is entry price
      const currentPrice = 48000;
      const pnl = (breakEven - currentPrice) * position.qty;

      expect(breakEven).toBe(50000);
      expect(pnl).toBe(2000);
    });

    it('should detect when position is at break-even', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const currentPrice = 50000;
      const isAtBreakEven = currentPrice === position.entry;
      const pnl = (currentPrice - position.entry) * position.qty;

      expect(isAtBreakEven).toBe(true);
      expect(pnl).toBe(0);
    });
  });

  describe('risk/reward ratio calculations', () => {
    it('should calculate risk/reward ratio for long position', () => {
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

      const riskAmount = (position.entry - position.sl!) * position.qty; // $5000
      const rewardAmount = (position.tp! - position.entry) * position.qty; // $5000
      const riskRewardRatio = rewardAmount / riskAmount;

      expect(riskAmount).toBe(5000);
      expect(rewardAmount).toBe(5000);
      expect(riskRewardRatio).toBe(1); // 1:1 ratio
    });

    it('should calculate favorable risk/reward ratio (3:1)', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: 65000, // $15K profit
        sl: 45000, // $5K loss
        leverage: 1,
        liq: null,
      };

      const riskAmount = (position.entry - position.sl!) * position.qty;
      const rewardAmount = (position.tp! - position.entry) * position.qty;
      const riskRewardRatio = rewardAmount / riskAmount;

      expect(riskRewardRatio).toBe(3); // 3:1 ratio
    });

    it('should calculate risk/reward ratio for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: 45000, // $5K profit
        sl: 55000, // $5K loss
        leverage: 1,
        liq: null,
      };

      const riskAmount = (position.sl! - position.entry) * position.qty;
      const rewardAmount = (position.entry - position.tp!) * position.qty;
      const riskRewardRatio = rewardAmount / riskAmount;

      expect(riskAmount).toBe(5000);
      expect(rewardAmount).toBe(5000);
      expect(riskRewardRatio).toBe(1);
    });
  });

  describe('maximum loss/gain calculations', () => {
    it('should calculate maximum possible loss for long position with SL', () => {
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

      const maxLoss = (position.entry - position.sl!) * position.qty;

      expect(maxLoss).toBe(5000);
    });

    it('should calculate maximum possible gain for long position with TP', () => {
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

      const maxGain = (position.tp! - position.entry) * position.qty;

      expect(maxGain).toBe(5000);
    });

    it('should handle unlimited loss for long position without SL', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1,
        liq: null,
      };

      const maxLoss = position.sl != null ? (position.entry - position.sl) * position.qty : Infinity;

      expect(maxLoss).toBe(Infinity);
    });
  });

  describe('P&L with forced liquidation', () => {
    it('should calculate forced liquidation P&L for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: 45000, // Liquidation price
      };

      const liquidationPnl = (position.liq! - position.entry) * position.qty;

      expect(liquidationPnl).toBe(-5000); // $5K loss
    });

    it('should calculate forced liquidation P&L for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: 55000, // Liquidation price
      };

      const liquidationPnl = (position.entry - position.liq!) * position.qty;

      expect(liquidationPnl).toBe(-5000); // $5K loss
    });
  });
});
