import { describe, it, expect } from '@jest/globals';
import type { ChartPosition, ChartOrder } from '../../types';

/**
 * Tests for margin and leverage calculations in paper trading
 * Covers margin requirements, leverage effects, and position-related calculations
 */

describe('Margin and Leverage Calculations', () => {
  describe('margin calculation for positions', () => {
    it('should calculate margin for long position without leverage', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 1, // No leverage
        liq: null,
      };

      const margin = (position.qty * position.entry) / position.leverage;
      expect(margin).toBe(50000); // Full position value
    });

    it('should calculate margin for long position with leverage', () => {
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

      const margin = (position.qty * position.entry) / position.leverage;
      expect(margin).toBe(5000); // 1/10th of position value
    });

    it('should calculate margin for short position', () => {
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

      const margin = (position.qty * position.entry) / position.leverage;
      expect(margin).toBe(10000); // Position value / 5
    });

    it('should calculate margin for fractional quantity', () => {
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

      const margin = (position.qty * position.entry) / position.leverage;
      expect(margin).toBe(25000); // Half of full position
    });

    it('should calculate margin for large quantity', () => {
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

      const margin = (position.qty * position.entry) / position.leverage;
      expect(margin).toBe(500000); // 10x full position
    });
  });

  describe('margin calculation for orders', () => {
    it('should calculate margin for buy order', () => {
      const order: ChartOrder = {
        id: 'order-1',
        symbol: 'BTCUSDT',
        side: 'buy',
        type: 'limit',
        price: 50000,
        qty: 1,
      };

      const leverage = 5;
      const margin = (order.qty * order.price) / leverage;
      expect(margin).toBe(10000); // Position value / 5
    });

    it('should calculate margin for sell order', () => {
      const order: ChartOrder = {
        id: 'order-1',
        symbol: 'BTCUSDT',
        side: 'sell',
        type: 'limit',
        price: 50000,
        qty: 1,
      };

      const leverage = 3;
      const margin = (order.qty * order.price) / leverage;
      expect(margin).toBeCloseTo(16666.67, 2);
    });

    it('should calculate margin for market order', () => {
      const order: ChartOrder = {
        id: 'order-1',
        symbol: 'BTCUSDT',
        side: 'buy',
        type: 'market',
        price: 50000, // Estimated price
        qty: 0.5,
      };

      const leverage = 2;
      const margin = (order.qty * order.price) / leverage;
      expect(margin).toBe(12500);
    });
  });

  describe('total margin calculation for multiple positions', () => {
    it('should sum margin for multiple positions', () => {
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

      const totalMargin = positions.reduce((sum, p) => sum + (p.qty * p.entry) / Math.max(1, p.leverage), 0);
      expect(totalMargin).toBe(80000); // 50000 + 30000
    });

    it('should sum margin with different leverages', () => {
      const positions: ChartPosition[] = [
        {
          id: 'pos-1',
          symbol: 'BTCUSDT',
          side: 'long',
          entry: 50000,
          qty: 1,
          tp: null,
          sl: null,
          leverage: 10, // 10x leverage
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
          leverage: 5, // 5x leverage
          liq: null,
        },
      ];

      const totalMargin = positions.reduce((sum, p) => sum + (p.qty * p.entry) / Math.max(1, p.leverage), 0);
      expect(totalMargin).toBe(11000); // 5000 + 6000
    });

    it('should handle empty position array', () => {
      const positions: ChartPosition[] = [];
      const totalMargin = positions.reduce((sum, p) => sum + (p.qty * p.entry) / Math.max(1, p.leverage), 0);
      expect(totalMargin).toBe(0);
    });

    it('should handle single position', () => {
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
      ];

      const totalMargin = positions.reduce((sum, p) => sum + (p.qty * p.entry) / Math.max(1, p.leverage), 0);
      expect(totalMargin).toBe(50000);
    });
  });

  describe('leverage validation and limits', () => {
    it('should ensure minimum leverage of 1', () => {
      const invalidLeverage = 0;
      const effectiveLeverage = Math.max(1, invalidLeverage);
      expect(effectiveLeverage).toBe(1);
    });

    it('should ensure minimum leverage for negative values', () => {
      const invalidLeverage = -5;
      const effectiveLeverage = Math.max(1, invalidLeverage);
      expect(effectiveLeverage).toBe(1);
    });

    it('should allow high leverage values', () => {
      const highLeverage = 100;
      const effectiveLeverage = Math.max(1, highLeverage);
      expect(effectiveLeverage).toBe(100);
    });

    it('should handle fractional leverage', () => {
      const fractionalLeverage = 2.5;
      const effectiveLeverage = Math.max(1, fractionalLeverage);
      expect(effectiveLeverage).toBe(2.5);
    });

    it('should validate leverage is finite', () => {
      const validLeverage = 10;
      const isValid = Number.isFinite(validLeverage) && validLeverage >= 1;
      expect(isValid).toBe(true);

      const invalidLeverage = Infinity;
      const isInvalid = Number.isFinite(invalidLeverage) && invalidLeverage >= 1;
      expect(isInvalid).toBe(false);
    });
  });

  describe('margin usage and available balance', () => {
    it('should calculate available balance after margin', () => {
      const balance = 100000;
      const margin = 30000;
      const availableBalance = balance - margin;
      expect(availableBalance).toBe(70000);
    });

    it('should calculate margin usage percentage', () => {
      const balance = 100000;
      const margin = 30000;
      const marginUsage = (margin / balance) * 100;
      expect(marginUsage).toBe(30); // 30% margin usage
    });

    it('should detect insufficient balance', () => {
      const balance = 10000;
      const requiredMargin = 15000;
      const hasSufficientBalance = balance >= requiredMargin;
      expect(hasSufficientBalance).toBe(false);
    });

    it('should detect sufficient balance', () => {
      const balance = 10000;
      const requiredMargin = 5000;
      const hasSufficientBalance = balance >= requiredMargin;
      expect(hasSufficientBalance).toBe(true);
    });

    it('should handle zero balance', () => {
      const balance = 0;
      const requiredMargin = 1000;
      const hasSufficientBalance = balance >= requiredMargin;
      expect(hasSufficientBalance).toBe(false);
    });

    it('should handle zero margin requirement', () => {
      const balance = 10000;
      const requiredMargin = 0;
      const hasSufficientBalance = balance >= requiredMargin;
      expect(hasSufficientBalance).toBe(true);
    });
  });

  describe('position margin updates', () => {
    it('should calculate margin change when adding to position', () => {
      const existingPosition: ChartPosition = {
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

      const additionalQty = 0.5;
      const additionalPrice = 51000;
      const additionalMargin = (additionalQty * additionalPrice) / existingPosition.leverage;

      expect(additionalMargin).toBe(25500);
    });

    it('should calculate margin release when closing position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: null,
      };

      const closeQty = 0.5;
      const releasedMargin = (closeQty * position.entry) / position.leverage;

      expect(releasedMargin).toBe(2500); // 0.5 * 50000 / 10
    });

    it('should calculate new average entry when adding to position', () => {
      const existingEntry = 50000;
      const existingQty = 1;
      const newEntry = 51000;
      const newQty = 0.5;

      const newAvgEntry = (existingEntry * existingQty + newEntry * newQty) / (existingQty + newQty);
      expect(newAvgEntry).toBeCloseTo(50333.33, 2); // Weighted average
    });

    it('should recalculate liquidation price after position update', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: null,
      };

      // Simplified liquidation calculation for long position
      const newEntry = position.entry + 1000;
      const newLeverage = position.leverage;
      const liquidationPrice = newEntry * (1 - 1 / newLeverage);

      expect(liquidationPrice).toBe(45900); // 51000 * (1 - 0.1)
    });
  });

  describe('leverage effects on P&L', () => {
    it('should calculate leveraged P&L for winning trade', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: null,
      };

      const currentPrice = 55000;
      const pnl = (currentPrice - position.entry) * position.qty;
      const margin = (position.qty * position.entry) / position.leverage;
      const pnlPercent = (pnl / margin) * 100;

      expect(pnl).toBe(5000); // $5000 profit
      expect(margin).toBe(5000); // $5000 margin
      expect(pnlPercent).toBe(100); // 100% return on margin
    });

    it('should calculate leveraged P&L for losing trade', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: null,
      };

      const currentPrice = 45000;
      const pnl = (currentPrice - position.entry) * position.qty;
      const margin = (position.qty * position.entry) / position.leverage;
      const pnlPercent = (pnl / margin) * 100;

      expect(pnl).toBe(-5000); // $5000 loss
      expect(margin).toBe(5000);
      expect(pnlPercent).toBe(-100); // -100% return on margin
    });

    it('should compare leveraged vs unleveraged returns', () => {
      const entry = 50000;
      const exit = 55000;
      const qty = 1;
      const pnl = (exit - entry) * qty;

      // Unleveraged
      const unleveragedMargin = qty * entry;
      const unleveragedReturn = (pnl / unleveragedMargin) * 100;

      // 10x leveraged
      const leveragedMargin = (qty * entry) / 10;
      const leveragedReturn = (pnl / leveragedMargin) * 100;

      expect(unleveragedReturn).toBe(10); // 10% return
      expect(leveragedReturn).toBe(100); // 100% return
    });
  });

  describe('margin efficiency and optimization', () => {
    it('should calculate optimal leverage for target return', () => {
      const targetReturn = 50; // 50% target return
      const priceChange = 5000; // $5000 price movement
      const positionValue = 50000; // Position value
      const priceChangePercent = (priceChange / positionValue) * 100; // 10%

      const requiredLeverage = targetReturn / priceChangePercent;
      expect(requiredLeverage).toBe(5); // 5x leverage for 50% return
    });

    it('should calculate maximum position size for given margin', () => {
      const availableMargin = 10000;
      const leverage = 10;
      const price = 50000;

      const maxQty = (availableMargin * leverage) / price;
      expect(maxQty).toBe(2); // 2 BTC maximum
    });

    it('should calculate required margin for target position size', () => {
      const targetQty = 1;
      const price = 50000;
      const leverage = 5;

      const requiredMargin = (targetQty * price) / leverage;
      expect(requiredMargin).toBe(10000); // $10,000 required
    });
  });

  describe('risk management with leverage', () => {
    it('should calculate position value at different leverage levels', () => {
      const baseMargin = 10000;
      const leverages = [1, 2, 5, 10, 20, 50, 100];

      const positionValues = leverages.map(lev => baseMargin * lev);
      expect(positionValues).toEqual([10000, 20000, 50000, 100000, 200000, 500000, 1000000]);
    });

    it('should calculate liquidation distance by leverage', () => {
      const entry = 50000;
      const leverages = [2, 5, 10, 20, 50, 100];

      const liquidationDistances = leverages.map(lev => {
        const liqPrice = entry * (1 - 1 / lev);
        return entry - liqPrice;
      });

      // Higher leverage = closer liquidation
      expect(liquidationDistances[0]).toBe(25000); // 2x: 50% drop to liquidate
      expect(liquidationDistances[2]).toBe(5000);  // 10x: 10% drop to liquidate
      expect(liquidationDistances[5]).toBe(500);   // 100x: 1% drop to liquidate
    });

    it('should calculate max loss before liquidation', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: 45000, // Calculated liquidation
      };

      const maxLoss = (position.entry - position.liq!) * position.qty;
      const margin = (position.qty * position.entry) / position.leverage;

      expect(maxLoss).toBe(5000); // $5000 max loss
      expect(margin).toBe(5000); // Equals margin (total loss)
    });
  });

  describe('margin calculation edge cases', () => {
    it('should handle very high leverage with small margin', () => {
      const margin = 100;
      const leverage = 100;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(0.2); // 0.2 BTC with $100 margin at 100x leverage
    });

    it('should handle very low leverage with large margin', () => {
      const margin = 100000;
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(2); // 2 BTC with $100K margin at 1x leverage
    });

    it('should handle zero quantity in margin calculation', () => {
      const qty = 0;
      const entry = 50000;
      const leverage = 10;

      const margin = (qty * entry) / leverage;
      expect(margin).toBe(0);
    });

    it('should handle zero entry price', () => {
      const qty = 1;
      const entry = 0;
      const leverage = 10;

      const margin = (qty * entry) / leverage;
      expect(margin).toBe(0);
    });

    it('should handle very small prices', () => {
      const qty = 1000000;
      const entry = 0.00001;
      const leverage = 1;

      const margin = (qty * entry) / leverage;
      expect(margin).toBe(10); // $10 for 1M tokens at $0.00001 each
    });

    it('should handle very large prices', () => {
      const qty = 0.01;
      const entry = 1000000;
      const leverage = 1;

      const margin = (qty * entry) / leverage;
      expect(margin).toBe(10000); // $10K for 0.01 tokens at $1M each
    });
  });

  describe('margin calculations consistency', () => {
    it('should produce consistent results across calculations', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 5,
        liq: null,
      };

      const margin1 = (position.qty * position.entry) / position.leverage;
      const margin2 = (position.qty * position.entry) / position.leverage;
      const margin3 = (position.qty * position.entry) / position.leverage;

      expect(margin1).toBe(margin2);
      expect(margin2).toBe(margin3);
      expect(margin1).toBe(10000);
    });

    it('should maintain margin equality for same position value with different leverage', () => {
      const positionValue = 50000; // 1 BTC at $50K

      const margin1x = positionValue / 1;
      const margin5x = positionValue / 5;
      const margin10x = positionValue / 10;

      expect(margin1x).toBe(50000);
      expect(margin5x).toBe(10000);
      expect(margin10x).toBe(5000);

      // Verify that 5x = 2 * 10x (consistency check)
      expect(margin5x).toBe(2 * margin10x);
    });
  });

  describe('liquidation price calculations', () => {
    it('should calculate liquidation price for long position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: null,
      };

      // For long: Liq = Entry - (Margin / Qty) = Entry - (Entry / Leverage)
      const liquidationPrice = position.entry - (position.entry / position.leverage);
      
      expect(liquidationPrice).toBe(45000); // 50000 - (50000/10)
    });

    it('should calculate liquidation price for short position', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'short',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 10,
        liq: null,
      };

      // For short: Liq = Entry + (Margin / Qty) = Entry + (Entry / Leverage)
      const liquidationPrice = position.entry + (position.entry / position.leverage);
      
      expect(liquidationPrice).toBe(55000); // 50000 + (50000/10)
    });

    it('should show higher leverage has lower liquidation distance', () => {
      const entry = 50000;

      const liq5x = entry - (entry / 5);   // 40000 (10000 away)
      const liq10x = entry - (entry / 10); // 45000 (5000 away)
      const liq20x = entry - (entry / 20); // 47500 (2500 away)

      const distance5x = entry - liq5x;
      const distance10x = entry - liq10x;
      const distance20x = entry - liq20x;

      expect(distance5x).toBe(10000);
      expect(distance10x).toBe(5000);
      expect(distance20x).toBe(2500);

      expect(distance5x).toBeGreaterThan(distance10x);
      expect(distance10x).toBeGreaterThan(distance20x);
    });

    it('should calculate distance to liquidation in percentage', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 5,
        liq: 40000,
      };

      const distancePercent = ((position.entry - position.liq!) / position.entry) * 100;

      expect(distancePercent).toBe(20); // 20% from entry to liq
    });
  });

  describe('margin level and ratios', () => {
    it('should calculate margin level (inverse of utilization)', () => {
      const margin = 10000; // $10K margin
      const unrealizedLoss = -5000; // -$5K loss
      const totalMargin = margin + unrealizedLoss; // $5K remains

      const marginLevel = (totalMargin / margin) * 100;

      expect(marginLevel).toBe(50); // 50% margin level
    });

    it('should identify liquidation risk based on margin level', () => {
      const marginLevels = [
        { level: 100, risk: 'safe' },
        { level: 50, risk: 'warning' },
        { level: 20, risk: 'critical' },
      ];

      marginLevels.forEach(({ level, risk }) => {
        let actualRisk = 'safe';
        if (level <= 30) actualRisk = 'critical';
        else if (level <= 50) actualRisk = 'warning';

        expect(actualRisk).toBe(risk);
      });
    });
  });

  describe('margin requirement changes with price', () => {
    it('should recalculate margin requirement as position P&L changes', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 5,
        liq: null,
      };

      const initialMargin = (position.qty * position.entry) / position.leverage; // $10K

      // Position is now in profit
      const profitPrice = 55000;
      const unrealizedPnl = (profitPrice - position.entry) * position.qty; // +$5K
      const totalMargin = initialMargin + unrealizedPnl; // $15K

      expect(initialMargin).toBe(10000);
      expect(totalMargin).toBe(15000);
      expect(totalMargin).toBeGreaterThan(initialMargin);
    });

    it('should reduce total margin as position loses money', () => {
      const position: ChartPosition = {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'long',
        entry: 50000,
        qty: 1,
        tp: null,
        sl: null,
        leverage: 5,
        liq: null,
      };

      const initialMargin = (position.qty * position.entry) / position.leverage; // $10K

      // Position is now in loss
      const lossPrice = 45000;
      const unrealizedPnl = (lossPrice - position.entry) * position.qty; // -$5K
      const totalMargin = initialMargin + unrealizedPnl; // $5K

      expect(totalMargin).toBe(5000);
      expect(totalMargin).toBeLessThan(initialMargin);
    });
  });

  describe('cross and isolated margin', () => {
    it('should calculate available margin in cross mode', () => {
      const totalBalance = 10000;
      const usedMargin = 4000;
      const unrealizedPnl = 500; // Profit

      const availableMargin = totalBalance - usedMargin + unrealizedPnl;

      expect(availableMargin).toBe(6500); // Can use remaining balance + profit
    });

    it('should calculate available margin in isolated mode', () => {
      const isolatedMargin = 5000;
      const unrealizedPnl = -1000; // Loss

      const availableMargin = isolatedMargin + unrealizedPnl;

      expect(availableMargin).toBe(4000); // Only this position's margin
    });

    it('should show cross margin is more efficient', () => {
      const balance = 10000;
      const position1Margin = 3000;
      const position2Margin = 2000;

      const crossAvailable = balance - position1Margin - position2Margin; // $5K shared pool
      // Isolated: position 1 can only draw on its own margin, not the shared pool.
      const isolatedAvailable = position1Margin;

      expect(crossAvailable).toBe(5000); // Shared pool
      expect(isolatedAvailable).toBeLessThan(crossAvailable);
    });
  });

  describe('leverage effects on ROI', () => {
    it('should show leverage amplifies gains', () => {
      const capital = 1000;
      const priceChange = 0.1; // 10% price move

      const noLeverageRoi = capital * priceChange; // $100
      const fivexLeverageRoi = (capital * 5) * priceChange; // $500

      expect(noLeverageRoi).toBe(100);
      expect(fivexLeverageRoi).toBe(500);
      expect(fivexLeverageRoi).toBe(5 * noLeverageRoi);
    });

    it('should show leverage amplifies losses equally', () => {
      const capital = 1000;
      const priceChange = -0.1; // 10% price drop

      const noLeverageLoss = capital * priceChange; // -$100
      const fivexLeverageLoss = (capital * 5) * priceChange; // -$500

      expect(noLeverageLoss).toBe(-100);
      expect(fivexLeverageLoss).toBe(-500);
    });

    it('should calculate ROI on capital with leverage', () => {
      const capital = 1000;
      const leveragedCapital = capital * 5; // 5x leverage
      const gain = leveragedCapital * 0.1; // 10% gain = $500

      const roiPercent = (gain / capital) * 100; // Profit / Original Capital

      expect(roiPercent).toBe(50); // 50% ROI on $1K capital
    });
  });

  describe('maximum leverage based on balance', () => {
    it('should enforce leverage limits based on account size', () => {
      const accountSizes = [
        { balance: 100, maxLeverage: 1, reason: 'micro accounts' },
        { balance: 1000, maxLeverage: 5, reason: 'small accounts' },
        { balance: 10000, maxLeverage: 10, reason: 'normal accounts' },
        { balance: 100000, maxLeverage: 20, reason: 'large accounts' },
      ];

      accountSizes.forEach(({ balance, maxLeverage }) => {
        let allowedLeverage = 1;
        if (balance >= 100000) allowedLeverage = 20;
        else if (balance >= 10000) allowedLeverage = 10;
        else if (balance >= 1000) allowedLeverage = 5;

        expect(allowedLeverage).toBe(maxLeverage);
      });
    });

    it('should reduce allowed leverage if account shrinks', () => {
      let balance = 50000; // Start with 20x allowed
      let allowedLeverage = 20;

      // Account shrinks to $5000
      balance = 5000;
      allowedLeverage = balance >= 10000 ? 10 : 5;

      expect(allowedLeverage).toBe(5);
    });
  });

  describe('margin with multiple positions', () => {
    it('should sum margin requirements across positions', () => {
      const positions: ChartPosition[] = [
        {
          id: 'pos-1',
          symbol: 'BTCUSDT',
          side: 'long',
          entry: 50000,
          qty: 1,
          tp: null,
          sl: null,
          leverage: 5,
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
          leverage: 5,
          liq: null,
        },
      ];

      let totalMargin = 0;
      positions.forEach((pos) => {
        const posMargin = (pos.qty * pos.entry) / pos.leverage;
        totalMargin += posMargin;
      });

      expect(totalMargin).toBe(16000); // $10K + $6K
    });

    it('should calculate net margin with mixed P&L', () => {
      const positions = [
        { margin: 10000, pnl: 1000 },  // +10%
        { margin: 5000, pnl: -500 },   // -10%
      ];

      const totalMargin = positions.reduce((sum, p) => sum + p.margin, 0);
      const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
      const netMargin = totalMargin + totalPnl;

      expect(netMargin).toBe(15500); // $15K + $500
    });
  });
});
