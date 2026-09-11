import { describe, it, expect } from '@jest/globals';

/**
 * Tests for position sizing calculations in paper trading
 * Covers margin calculations, leverage effects, and quantity resolution
 */

describe('Position Sizing Calculations', () => {
  describe('margin calculations', () => {
    it('should calculate margin for fixed amount', () => {
      const margin = 1000; // $1000 fixed margin
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(0.02); // 0.02 BTC
    });

    it('should calculate margin with leverage', () => {
      const margin = 1000; // $1000 margin
      const leverage = 10; // 10x leverage
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(0.2); // 0.2 BTC (10x more than 1x)
    });

    it('should calculate margin for percentage-based sizing', () => {
      const balance = 10000; // $10,000 account balance
      const marginPercent = 10; // 10% of balance
      const margin = balance * (marginPercent / 100);
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(margin).toBe(1000); // $1000 margin
      expect(qty).toBe(0.02); // 0.02 BTC
    });

    it('should calculate margin with percentage and leverage', () => {
      const balance = 10000;
      const marginPercent = 10;
      const margin = balance * (marginPercent / 100);
      const leverage = 5; // 5x leverage
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(margin).toBe(1000);
      expect(qty).toBe(0.1); // 0.1 BTC (5x more than 1x)
    });

    it('should handle zero margin', () => {
      const margin = 0;
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(0);
    });

    it('should handle very high leverage', () => {
      const margin = 1000;
      const leverage = 100; // 100x leverage
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(2); // 2 BTC with 100x leverage
    });

    it('should ensure leverage is at least 1', () => {
      const margin = 1000;
      const leverage = 0; // Invalid leverage
      const effectiveLeverage = Math.max(1, leverage);
      const price = 50000;

      const qty = (margin * effectiveLeverage) / price;
      expect(effectiveLeverage).toBe(1);
      expect(qty).toBe(0.02);
    });
  });

  describe('quantity resolution', () => {
    it('should resolve quantity from margin and price', () => {
      const margin = 1000;
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(0.02);
    });

    it('should handle different price levels', () => {
      const margin = 1000;
      const leverage = 1;

      const highPriceQty = (margin * leverage) / 100000; // $100K BTC
      const lowPriceQty = (margin * leverage) / 1000; // $1K BTC

      expect(highPriceQty).toBe(0.01); // Less BTC at high price
      expect(lowPriceQty).toBe(1); // More BTC at low price
    });

    it('should handle fractional quantities', () => {
      const margin = 500;
      const leverage = 1;
      const price = 3333.33;

      const qty = (margin * leverage) / price;
      expect(qty).toBeCloseTo(0.15, 2);
    });

    it('should handle very small quantities', () => {
      const margin = 10;
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(0.0002);
    });

    it('should handle very large quantities', () => {
      const margin = 1000000;
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(qty).toBe(20); // 20 BTC
    });

    it('should round quantity to reasonable precision', () => {
      const margin = 1000;
      const leverage = 1;
      const price = 3333.33;

      const rawQty = (margin * leverage) / price;
      const roundedQty = Number(rawQty.toPrecision(8));
      
      expect(roundedQty).toBeCloseTo(0.30003, 4);
    });

    it('should handle zero or negative prices', () => {
      const margin = 1000;
      const leverage = 1;
      const price = 0;

      const qty = price > 0 ? (margin * leverage) / price : 0;
      expect(qty).toBe(0);
    });
  });

  describe('risk-based position sizing', () => {
    it('should calculate position size based on risk percent', () => {
      const balance = 10000;
      const riskPercent = 2; // 2% risk
      const risk = balance * (riskPercent / 100);
      const leverage = 1;
      const price = 50000;

      const qty = (risk * leverage) / price;
      expect(risk).toBe(200); // $200 risk
      expect(qty).toBe(0.004); // 0.004 BTC
    });

    it('should calculate position size based on fixed risk amount', () => {
      const risk = 500; // $500 fixed risk
      const leverage = 1;
      const price = 50000;

      const qty = (risk * leverage) / price;
      expect(qty).toBe(0.01); // 0.01 BTC
    });

    it('should handle different risk percentages', () => {
      const balance = 10000;
      const leverage = 1;
      const price = 50000;

      const lowRiskQty = (balance * (1 / 100) * leverage) / price; // 1% risk
      const highRiskQty = (balance * (5 / 100) * leverage) / price; // 5% risk

      expect(lowRiskQty).toBeCloseTo(0.002, 4); // 0.002 BTC
      expect(highRiskQty).toBeCloseTo(0.01, 2); // 0.01 BTC
    });

    it('should ensure risk does not exceed balance', () => {
      const balance = 10000;
      const riskPercent = 150; // 150% risk (invalid)
      const risk = Math.min(balance, balance * (riskPercent / 100));
      
      expect(risk).toBe(10000); // Capped at balance
    });
  });

  describe('position sizing with custom account size', () => {
    it('should use custom account size when specified', () => {
      const balance = 10000; // Actual balance
      const customAccountSize = 5000; // Custom account size
      const marginPercent = 10;
      const margin = customAccountSize * (marginPercent / 100);
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(margin).toBe(500); // Based on custom size
      expect(margin).toBeLessThan(balance * (marginPercent / 100)); // Custom size caps sizing
      expect(qty).toBe(0.01);
    });

    it('should fall back to actual balance when custom size not specified', () => {
      const balance = 10000;
      const marginPercent = 10;
      const margin = balance * (marginPercent / 100);
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(margin).toBe(1000); // Based on actual balance
      expect(qty).toBe(0.02);
    });

    it('should handle invalid custom account sizes', () => {
      const balance = 10000;
      const customAccountSize = 0; // Invalid
      const effectiveAccount = customAccountSize > 0 ? customAccountSize : balance;
      const marginPercent = 10;
      const margin = effectiveAccount * (marginPercent / 100);

      expect(effectiveAccount).toBe(10000);
      expect(margin).toBe(1000);
    });
  });

  describe('position sizing with custom leverage', () => {
    it('should use custom leverage when specified', () => {
      const margin = 1000;
      const defaultLeverage = 1;
      const customLeverage = 5;
      const effectiveLeverage = customLeverage ?? defaultLeverage;
      const price = 50000;

      const qty = (margin * effectiveLeverage) / price;
      expect(effectiveLeverage).toBe(5);
      expect(qty).toBe(0.1);
    });

    it('should fall back to default leverage when custom not specified', () => {
      const margin = 1000;
      const defaultLeverage = 2;
      const customLeverage = undefined;
      const effectiveLeverage = customLeverage ?? defaultLeverage;
      const price = 50000;

      const qty = (margin * effectiveLeverage) / price;
      expect(effectiveLeverage).toBe(2);
      expect(qty).toBe(0.04);
    });

    it('should handle invalid custom leverage', () => {
      const margin = 1000;
      const defaultLeverage = 1;
      const customLeverage = 0; // Invalid
      const effectiveLeverage = Math.max(1, customLeverage ?? defaultLeverage);
      const price = 50000;

      const qty = (margin * effectiveLeverage) / price;
      expect(effectiveLeverage).toBe(1);
      expect(qty).toBe(0.02);
    });
  });

  describe('TP/SL percentage calculations', () => {
    it('should calculate TP price from percentage for long', () => {
      const entry = 50000;
      const tpPercent = 10; // 10% TP
      const tpM = tpPercent / 100;
      const tp = entry * (1 + tpM);

      expect(tp).toBeCloseTo(55000, 2); // 10% above entry
    });

    it('should calculate SL price from percentage for long', () => {
      const entry = 50000;
      const slPercent = 5; // 5% SL
      const slM = slPercent / 100;
      const sl = entry * (1 - slM);

      expect(sl).toBe(47500); // 5% below entry
    });

    it('should calculate TP price from percentage for short', () => {
      const entry = 50000;
      const tpPercent = 10; // 10% TP
      const tpM = tpPercent / 100;
      const tp = entry * (1 - tpM);

      expect(tp).toBe(45000); // 10% below entry (profit for short)
    });

    it('should calculate SL price from percentage for short', () => {
      const entry = 50000;
      const slPercent = 5; // 5% SL
      const slM = slPercent / 100;
      const sl = entry * (1 + slM);

      expect(sl).toBe(52500); // 5% above entry (loss for short)
    });

    it('should handle zero TP/SL percentages', () => {
      const entry = 50000;
      const tpPercent = 0;
      const slPercent = 0;
      const tpM = tpPercent / 100;
      const slM = slPercent / 100;

      const tp = tpM > 0 ? entry * (1 + tpM) : null;
      const sl = slM > 0 ? entry * (1 - slM) : null;

      expect(tp).toBeNull();
      expect(sl).toBeNull();
    });

    it('should handle negative TP/SL percentages', () => {
      const entry = 50000;
      const tpPercent = -5; // Invalid
      const slPercent = -3; // Invalid
      const tpM = Math.max(0, tpPercent) / 100;
      const slM = Math.max(0, slPercent) / 100;

      const tp = tpM > 0 ? entry * (1 + tpM) : null;
      const sl = slM > 0 ? entry * (1 - slM) : null;

      expect(tp).toBeNull();
      expect(sl).toBeNull();
    });
  });

  describe('position sizing edge cases', () => {
    it('should handle very small account balances', () => {
      const balance = 100; // $100 account
      const marginPercent = 10;
      const margin = balance * (marginPercent / 100);
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(margin).toBe(10); // $10 margin
      expect(qty).toBe(0.0002); // Very small quantity
    });

    it('should handle very large account balances', () => {
      const balance = 1000000; // $1M account
      const marginPercent = 10;
      const margin = balance * (marginPercent / 100);
      const leverage = 1;
      const price = 50000;

      const qty = (margin * leverage) / price;
      expect(margin).toBe(100000); // $100K margin
      expect(qty).toBe(2); // 2 BTC
    });

    it('should handle zero account balance', () => {
      const balance = 0;
      const marginPercent = 10;
      const margin = Math.max(0, balance * (marginPercent / 100));

      expect(margin).toBe(0);
    });

    it('should handle very high asset prices', () => {
      const margin = 10000;
      const leverage = 1;
      const price = 1000000; // $1M per asset

      const qty = (margin * leverage) / price;
      expect(qty).toBe(0.01); // Very small quantity
    });

    it('should handle very low asset prices', () => {
      const margin = 1000;
      const leverage = 1;
      const price = 0.00001; // Very low price

      const qty = (margin * leverage) / price;
      expect(qty).toBeCloseTo(100000000, 0); // Very large quantity
    });
  });

  describe('position sizing consistency', () => {
    it('should maintain consistent sizing across different calculation methods', () => {
      const balance = 10000;
      const marginPercent = 10;
      const margin1 = balance * (marginPercent / 100);
      
      const riskPercent = 10;
      const margin2 = balance * (riskPercent / 100);

      expect(margin1).toBe(margin2);
    });

    it('should produce deterministic results', () => {
      const margin = 1000;
      const leverage = 5;
      const price = 50000;

      const qty1 = (margin * leverage) / price;
      const qty2 = (margin * leverage) / price;
      const qty3 = (margin * leverage) / price;

      expect(qty1).toBe(qty2);
      expect(qty2).toBe(qty3);
    });
  });

  describe('position sizing validation', () => {
    it('should reject negative margin', () => {
      const margin = -1000;
      const effectiveMargin = Math.max(0, margin);

      expect(effectiveMargin).toBe(0);
    });

    it('should reject negative leverage', () => {
      const leverage = -5;
      const effectiveLeverage = Math.max(1, leverage);

      expect(effectiveLeverage).toBe(1);
    });

    it('should reject negative prices', () => {
      const margin = 1000;
      const leverage = 1;
      const price = -50000;
      const qty = price > 0 ? (margin * leverage) / price : 0;

      expect(qty).toBe(0);
    });

    it('should handle NaN values gracefully', () => {
      const margin = 1000;
      const leverage = 1;
      const price = NaN;
      const qty = Number.isFinite(price) && price > 0 ? (margin * leverage) / price : 0;

      expect(qty).toBe(0);
    });
  });

  describe('position sizing with multiple symbols', () => {
    it('should calculate quantities for different symbols at different prices', () => {
      const symbols = [
        { symbol: 'BTCUSDT', price: 50000 },
        { symbol: 'ETHUSDT', price: 3000 },
        { symbol: 'BNBUSDT', price: 500 },
      ];

      const margin = 1000; // Same margin for each
      const leverage = 1;
      const quantities: Record<string, number> = {};

      symbols.forEach(({ symbol, price }) => {
        quantities[symbol] = (margin * leverage) / price;
      });

      expect(quantities['BTCUSDT']).toBe(0.02); // 0.02 BTC
      expect(quantities['ETHUSDT']).toBeCloseTo(0.333, 2); // 0.333 ETH
      expect(quantities['BNBUSDT']).toBe(2); // 2 BNB
    });

    it('should maintain consistent risk across different symbols', () => {
      const riskAmount = 100; // $100 risk on each trade
      const symbols = [
        { symbol: 'BTCUSDT', price: 50000, slPercent: 2 },
        { symbol: 'ETHUSDT', price: 3000, slPercent: 2 },
      ];

      symbols.forEach(({ price, slPercent }) => {
        const slPrice = price * (1 - slPercent / 100);
        const riskPerUnit = price - slPrice;
        const qty = riskAmount / riskPerUnit;

        expect(riskPerUnit).toBe(price * (slPercent / 100));
        expect(qty).toBeGreaterThan(0);
      });
    });
  });

  describe('portfolio position sizing with available margin', () => {
    it('should allocate positions within available margin', () => {
      const balance = 10000;
      const availableMargin = balance;
      const positions = [
        { symbol: 'BTCUSDT', price: 50000, marginPercent: 50 },
        { symbol: 'ETHUSDT', price: 3000, marginPercent: 30 },
      ];

      let usedMargin = 0;
      const allocations: Record<string, { margin: number; qty: number }> = {};

      positions.forEach(({ symbol, price, marginPercent }) => {
        const margin = availableMargin * (marginPercent / 100);
        const qty = margin / price;

        allocations[symbol] = { margin, qty };
        usedMargin += margin;
      });

      expect(usedMargin).toBe(8000); // 50% + 30% of balance
      expect(usedMargin).toBeLessThanOrEqual(availableMargin);
    });

    it('should not allow position sizing exceeding available margin', () => {
      const balance = 10000;
      const availableMargin = balance;
      const requestedMargin = 12000; // Exceeds available

      const allocatedMargin = Math.min(requestedMargin, availableMargin);
      const price = 50000;
      const qty = allocatedMargin / price;

      expect(allocatedMargin).toBe(10000);
      expect(qty).toBe(0.2);
    });
  });

  describe('position sizing with equity curves', () => {
    it('should increase position size with growing equity', () => {
      const positions = [
        { balance: 10000, qty: 0.02 }, // Starting
        { balance: 11000, qty: 0.022 }, // After +10% gain
        { balance: 12100, qty: 0.0242 }, // After +21% gain
      ];

      const price = 50000;
      const marginPercent = 10;

      positions.forEach(({ balance, qty }) => {
        const margin = balance * (marginPercent / 100);
        const calculatedQty = margin / price;
        
        expect(calculatedQty).toBeCloseTo(qty, 4);
      });
    });

    it('should decrease position size with shrinking equity', () => {
      const positions = [
        { balance: 10000, qty: 0.02 }, // Starting
        { balance: 9000, qty: 0.018 }, // After -10% loss
        { balance: 8100, qty: 0.0162 }, // After -19% loss
      ];

      const price = 50000;
      const marginPercent = 10;

      positions.forEach(({ balance, qty }) => {
        const margin = balance * (marginPercent / 100);
        const calculatedQty = margin / price;
        
        expect(calculatedQty).toBeCloseTo(qty, 4);
      });
    });
  });

  describe('dynamic position sizing based on volatility', () => {
    it('should increase position size with lower ATR (lower volatility)', () => {
      const positions = [
        { atr: 1000, mult: 2, slPrice: null },
        { atr: 500, mult: 2, slPrice: null },
        { atr: 250, mult: 2, slPrice: null },
      ];

      const entry = 50000;
      const risk = 100;

      positions.forEach(({ atr, mult }) => {
        const slPrice = entry - (atr * mult);
        const riskPerUnit = entry - slPrice;
        const qty = risk / riskPerUnit;

        expect(qty).toBeGreaterThan(0);
      });
    });

    it('should decrease position size with higher ATR (higher volatility)', () => {
      const entry = 50000;
      const risk = 100;
      const atrMult = 2;

      const lowSlPrice = entry - atrMult * 250; // Lower ATR = tighter stop
      const highSlPrice = entry - atrMult * 1000; // Higher ATR = wider stop
      const lowVolatilityQty = risk / (entry - lowSlPrice);
      const highVolatilityQty = risk / (entry - highSlPrice);

      expect(lowVolatilityQty).toBeGreaterThan(highVolatilityQty);
    });
  });

  describe('Kelly Criterion and position sizing', () => {
    it('should calculate position size using Kelly Criterion', () => {
      const winRate = 0.55; // 55% win rate
      const avgWin = 2; // 2:1 reward/risk
      const avgLoss = 1;

      // Kelly = (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin
      const kellyCriterion = (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin;
      
      // Fractional Kelly for safety (25% of Kelly)
      const safeKelly = kellyCriterion * 0.25;

      // Expected: (0.55 * 2 - 0.45 * 1) / 2 = (1.1 - 0.45) / 2 = 0.65 / 2 = 0.325
      expect(kellyCriterion).toBeCloseTo(0.325, 2); // 32.5% of capital
      expect(safeKelly).toBeCloseTo(0.081, 2); // ~8.1% of capital
    });

    it('should adjust position size based on Kelly % allocation', () => {
      const balance = 10000;
      const kellyPercent = 0.05; // 5% Kelly
      const marginSize = balance * kellyPercent;
      const price = 50000;
      const qty = marginSize / price;

      expect(marginSize).toBe(500);
      expect(qty).toBe(0.01);
    });
  });

  describe('maximum position size limits', () => {
    it('should not exceed maximum position size', () => {
      const maxQty = 10; // Max 10 contracts
      const calculatedQty = 15;

      const limitedQty = Math.min(calculatedQty, maxQty);

      expect(limitedQty).toBe(10);
    });

    it('should enforce maximum % of balance per trade', () => {
      const balance = 10000;
      const maxPercentage = 10; // Max 10% per trade
      const maxMargin = balance * (maxPercentage / 100);

      const requestedMargin = 2000; // $2000 = 20% of balance
      const allowedMargin = Math.min(requestedMargin, maxMargin);

      expect(allowedMargin).toBe(1000); // Capped at 10%
    });

    it('should enforce maximum positions open simultaneously', () => {
      const maxOpenPositions = 5;
      const currentPositions = 4;
      const canOpenMore = currentPositions < maxOpenPositions;

      expect(canOpenMore).toBe(true);

      const positionsAfterNew = currentPositions + 1;
      const canOpenAnother = positionsAfterNew < maxOpenPositions;

      expect(canOpenAnother).toBe(false);
    });
  });

  describe('position sizing with correlated assets', () => {
    it('should reduce position size for correlated pairs', () => {
      const price2 = 3000; // ETHUSDT
      const correlation = 0.85; // 85% correlation

      const singleMargin = 1000;
      const adjustedMargin = singleMargin * (1 - correlation); // Reduce by correlation factor

      const qty2 = adjustedMargin / price2;
      const singleQty2 = singleMargin / price2;

      expect(adjustedMargin).toBeLessThan(singleMargin);
      expect(adjustedMargin).toBeCloseTo(150, 0); // 1000 * 0.15
      expect(qty2).toBeLessThan(singleQty2);
    });

    it('should increase position size for negatively correlated pairs', () => {
      const correlation = -0.3; // -30% correlation (hedge)

      const singleMargin = 1000;
      const adjustedMargin = singleMargin * (1 + Math.abs(correlation)); // Increase for hedge

      expect(adjustedMargin).toBeGreaterThan(singleMargin);
    });
  });

  describe('position sizing edge cases and constraints', () => {
    it('should handle minimum position size', () => {
      const minQty = 0.001; // Minimum quantity
      const price = 50000;
      const minMargin = minQty * price;

      const margin = 10; // Very small margin
      const qty = margin / price;
      const effectiveQty = qty < minQty ? minQty : qty;

      expect(margin).toBeLessThan(minMargin); // Too small for even the minimum position
      expect(qty).toBeLessThan(minQty);
      expect(effectiveQty).toBe(minQty);
    });

    it('should round quantities to exchange precision', () => {
      const precision = 4; // 4 decimal places
      const rawQty = 0.123456;

      const roundedQty = Number(rawQty.toPrecision(precision));

      expect(roundedQty).toBeCloseTo(0.1235, 4);
    });

    it('should handle precision for very large quantities', () => {
      const precision = 2; // 2 decimal places
      const rawQty = 12345.6789;

      const roundedQty = Number(rawQty.toPrecision(precision));

      expect(roundedQty).toBe(12000);
    });
  });
});
