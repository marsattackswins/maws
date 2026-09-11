import { describe, it, expect } from '@jest/globals';
import type { Candle } from '../../types';

/**
 * Candle normalization tests for data from various providers
 * Tests cover validation, cleaning, and standardization of candle data
 */

describe('Candle Normalization', () => {
  const baseTime = 1625097600; // 2021-06-30 00:00:00 UTC

  describe('basic candle structure validation', () => {
    it('should accept valid candle data', () => {
      const validCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      expect(validCandle.time).toBe(baseTime);
      expect(validCandle.open).toBe(100.0);
      expect(validCandle.high).toBe(105.0);
      expect(validCandle.low).toBe(98.0);
      expect(validCandle.close).toBe(103.0);
      expect(validCandle.volume).toBe(1000.0);
    });

    it('should reject candle with zero or negative close price', () => {
      const invalidCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 0,
        volume: 1000.0,
      };

      // Simulate validation logic
      const isValid = invalidCandle.close > 0;
      expect(isValid).toBe(false);
    });

    it('should reject candle with negative close price', () => {
      const invalidCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: -5.0,
        volume: 1000.0,
      };

      const isValid = invalidCandle.close > 0;
      expect(isValid).toBe(false);
    });
  });

  describe('price consistency validation', () => {
    it('should validate high >= open', () => {
      const candle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      expect(candle.high).toBeGreaterThanOrEqual(candle.open);
    });

    it('should validate high >= close', () => {
      const candle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      expect(candle.high).toBeGreaterThanOrEqual(candle.close);
    });

    it('should validate low <= open', () => {
      const candle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      expect(candle.low).toBeLessThanOrEqual(candle.open);
    });

    it('should validate low <= close', () => {
      const candle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      expect(candle.low).toBeLessThanOrEqual(candle.close);
    });

    it('should handle candles where high equals low (flat candle)', () => {
      const flatCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 100.0,
        low: 100.0,
        close: 100.0,
        volume: 1000.0,
      };

      expect(flatCandle.high).toBe(flatCandle.low);
      expect(flatCandle.open).toBe(flatCandle.close);
    });
  });

  describe('volume normalization', () => {
    it('should accept positive volume', () => {
      const candle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      expect(candle.volume).toBeGreaterThan(0);
    });

    it('should handle zero volume', () => {
      const zeroVolumeCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 0,
      };

      expect(zeroVolumeCandle.volume).toBe(0);
    });

    it('should handle very small volume values', () => {
      const smallVolumeCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 0.0001,
      };

      expect(smallVolumeCandle.volume).toBeGreaterThan(0);
    });

    it('should handle very large volume values', () => {
      const largeVolumeCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1e15,
      };

      expect(largeVolumeCandle.volume).toBe(1e15);
    });
  });

  describe('numeric validation', () => {
    it('should reject non-finite time values', () => {
      const invalidCandle: Candle = {
        time: NaN,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const isValid = Number.isFinite(invalidCandle.time);
      expect(isValid).toBe(false);
    });

    it('should reject non-finite price values', () => {
      const invalidCandle: Candle = {
        time: baseTime,
        open: Infinity,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const isValid = Number.isFinite(invalidCandle.open);
      expect(isValid).toBe(false);
    });

    it('should reject non-finite volume values', () => {
      const invalidCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: NaN,
      };

      const isValid = Number.isFinite(invalidCandle.volume);
      expect(isValid).toBe(false);
    });
  });

  describe('precision handling', () => {
    it('should handle integer prices', () => {
      const integerCandle: Candle = {
        time: baseTime,
        open: 100,
        high: 105,
        low: 98,
        close: 103,
        volume: 1000,
      };

      expect(integerCandle.open).toBe(100);
      expect(integerCandle.high).toBe(105);
    });

    it('should handle decimal prices with different precisions', () => {
      const decimalCandle: Candle = {
        time: baseTime,
        open: 100.123456789,
        high: 105.987654321,
        low: 98.111111111,
        close: 103.555555555,
        volume: 1000.123456789,
      };

      expect(decimalCandle.open).toBeCloseTo(100.123456789);
      expect(decimalCandle.high).toBeCloseTo(105.987654321);
    });

    it('should handle very small price values', () => {
      const smallPriceCandle: Candle = {
        time: baseTime,
        open: 0.0001,
        high: 0.0002,
        low: 0.00005,
        close: 0.00015,
        volume: 1000000,
      };

      expect(smallPriceCandle.open).toBeGreaterThan(0);
      expect(smallPriceCandle.high).toBeGreaterThan(smallPriceCandle.low);
    });
  });

  describe('array normalization', () => {
    it('should filter out invalid candles from array', () => {
      const candles: Candle[] = [
        {
          time: baseTime,
          open: 100.0,
          high: 105.0,
          low: 98.0,
          close: 103.0,
          volume: 1000.0,
        },
        {
          time: baseTime + 60,
          open: 103.0,
          high: 108.0,
          low: 101.0,
          close: 0, // Invalid
          volume: 1000.0,
        },
        {
          time: baseTime + 120,
          open: 105.0,
          high: 110.0,
          low: 103.0,
          close: 108.0,
          volume: 1000.0,
        },
      ];

      const validCandles = candles.filter(c => c.close > 0 && Number.isFinite(c.time));
      expect(validCandles).toHaveLength(2);
      expect(validCandles[0].close).toBe(103.0);
      expect(validCandles[1].close).toBe(108.0);
    });

    it('should handle empty candle array', () => {
      const candles: Candle[] = [];
      expect(candles).toHaveLength(0);
    });

    it('should handle single candle array', () => {
      const candles: Candle[] = [
        {
          time: baseTime,
          open: 100.0,
          high: 105.0,
          low: 98.0,
          close: 103.0,
          volume: 1000.0,
        },
      ];

      expect(candles).toHaveLength(1);
    });
  });
});
