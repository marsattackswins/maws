import { describe, it, expect } from '@jest/globals';
import type { Candle } from '../../types';

/**
 * Tests for handling incomplete or partial candle data
 * Common scenarios in real-time feeds where data arrives incrementally
 */

describe('Incomplete Candle Handling', () => {
  const baseTime = 1625097600; // 2021-06-30 00:00:00 UTC

  describe('missing fields', () => {
    it('should handle candle with missing volume', () => {
      const incompleteCandle: Partial<Candle> = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        // volume missing
      };

      const normalizedCandle: Candle = {
        time: incompleteCandle.time!,
        open: incompleteCandle.open!,
        high: incompleteCandle.high!,
        low: incompleteCandle.low!,
        close: incompleteCandle.close!,
        volume: incompleteCandle.volume ?? 0, // Default to 0
      };

      expect(normalizedCandle.volume).toBe(0);
      expect(normalizedCandle.close).toBe(103.0);
    });

    it('should handle candle with missing high', () => {
      const incompleteCandle: Partial<Candle> = {
        time: baseTime,
        open: 100.0,
        // high missing
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      // Strategy: use max of available prices
      const availablePrices = [incompleteCandle.open, incompleteCandle.low, incompleteCandle.close].filter((x): x is number => Number.isFinite(x));
      const normalizedHigh = availablePrices.length > 0 ? Math.max(...availablePrices) : incompleteCandle.close!;

      const normalizedCandle: Candle = {
        time: incompleteCandle.time!,
        open: incompleteCandle.open!,
        high: normalizedHigh,
        low: incompleteCandle.low!,
        close: incompleteCandle.close!,
        volume: incompleteCandle.volume!,
      };

      expect(normalizedCandle.high).toBe(103.0); // Max of 100, 98, 103
    });

    it('should handle candle with missing low', () => {
      const incompleteCandle: Partial<Candle> = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        // low missing
        close: 103.0,
        volume: 1000.0,
      };

      // Strategy: use min of available prices
      const availablePrices = [incompleteCandle.open, incompleteCandle.high, incompleteCandle.close].filter((x): x is number => Number.isFinite(x));
      const normalizedLow = availablePrices.length > 0 ? Math.min(...availablePrices) : incompleteCandle.close!;

      const normalizedCandle: Candle = {
        time: incompleteCandle.time!,
        open: incompleteCandle.open!,
        high: incompleteCandle.high!,
        low: normalizedLow,
        close: incompleteCandle.close!,
        volume: incompleteCandle.volume!,
      };

      expect(normalizedCandle.low).toBe(100.0); // Min of 100, 105, 103
    });

    it('should handle candle with missing open', () => {
      const incompleteCandle: Partial<Candle> = {
        time: baseTime,
        // open missing
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      // Strategy: use close as fallback for open
      const normalizedCandle: Candle = {
        time: incompleteCandle.time!,
        open: incompleteCandle.open ?? incompleteCandle.close!,
        high: incompleteCandle.high!,
        low: incompleteCandle.low!,
        close: incompleteCandle.close!,
        volume: incompleteCandle.volume!,
      };

      expect(normalizedCandle.open).toBe(103.0);
    });

    it('should handle candle with missing close', () => {
      const incompleteCandle: Partial<Candle> = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        // close missing
        volume: 1000.0,
      };

      // Strategy: use open as fallback for close
      const normalizedCandle: Candle = {
        time: incompleteCandle.time!,
        open: incompleteCandle.open!,
        high: incompleteCandle.high!,
        low: incompleteCandle.low!,
        close: incompleteCandle.close ?? incompleteCandle.open!,
        volume: incompleteCandle.volume!,
      };

      expect(normalizedCandle.close).toBe(100.0);
    });

    it('should reject candle with missing timestamp', () => {
      const incompleteCandle: Partial<Candle> = {
        // time missing
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const isValid = incompleteCandle.time !== undefined && Number.isFinite(incompleteCandle.time);
      expect(isValid).toBe(false);
    });
  });

  describe('null and undefined values', () => {
    it('should handle null values in price fields', () => {
      // Untyped on purpose: raw provider payloads can carry nulls before validation.
      const candleWithNulls = {
        time: baseTime,
        open: null,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const hasNulls = Object.values(candleWithNulls).some(v => v === null);
      expect(hasNulls).toBe(true);
    });

    it('should handle undefined values in price fields', () => {
      const candleWithUndefined: Partial<Candle> = {
        time: baseTime,
        open: undefined,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const hasUndefined = Object.values(candleWithUndefined).some(v => v === undefined);
      expect(hasUndefined).toBe(true);
    });

    it('should normalize null volume to zero', () => {
      // Untyped on purpose: raw provider payloads can carry nulls before validation.
      const rawCandle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: null,
      };

      const normalizedVolume = rawCandle.volume ?? 0;
      expect(normalizedVolume).toBe(0);
    });
  });

  describe('incremental candle building', () => {
    it('should build candle incrementally from updates', () => {
      // Initial incomplete candle
      let candle: Partial<Candle> = {
        time: baseTime,
        open: 100.0,
      };

      // Update 1: add high
      candle = { ...candle, high: 102.0 };

      // Update 2: add low
      candle = { ...candle, low: 99.0 };

      // Update 3: add close
      candle = { ...candle, close: 101.0 };

      // Update 4: add volume
      candle = { ...candle, volume: 500.0 };

      const completeCandle: Candle = {
        time: candle.time!,
        open: candle.open!,
        high: candle.high!,
        low: candle.low!,
        close: candle.close!,
        volume: candle.volume!,
      };

      expect(completeCandle.open).toBe(100.0);
      expect(completeCandle.high).toBe(102.0);
      expect(completeCandle.low).toBe(99.0);
      expect(completeCandle.close).toBe(101.0);
      expect(completeCandle.volume).toBe(500.0);
    });

    it('should handle live candle updates during formation', () => {
      const liveCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 100.0,
        low: 100.0,
        close: 100.0,
        volume: 0,
      };

      // Simulate live updates
      const updates = [
        { price: 101.0, volume: 100 },
        { price: 102.5, volume: 200 },
        { price: 101.5, volume: 150 },
        { price: 103.0, volume: 300 },
      ];

      updates.forEach(update => {
        liveCandle.high = Math.max(liveCandle.high, update.price);
        liveCandle.low = Math.min(liveCandle.low, update.price);
        liveCandle.close = update.price;
        liveCandle.volume += update.volume;
      });

      expect(liveCandle.high).toBe(103.0);
      expect(liveCandle.low).toBe(100.0);
      expect(liveCandle.close).toBe(103.0);
      expect(liveCandle.volume).toBe(750);
    });
  });

  describe('data quality validation', () => {
    it('should detect candles with inconsistent OHLC', () => {
      const inconsistentCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 95.0, // High < Open - invalid
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const isConsistent = inconsistentCandle.high >= inconsistentCandle.open;
      expect(isConsistent).toBe(false);
    });

    it('should detect candles with low > high', () => {
      const invalidCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 98.0,
        low: 105.0, // Low > High - invalid
        close: 103.0,
        volume: 1000.0,
      };

      const isValid = invalidCandle.low <= invalidCandle.high;
      expect(isValid).toBe(false);
    });

    it('should detect negative prices', () => {
      const negativePriceCandle: Candle = {
        time: baseTime,
        open: -10.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const hasNegativePrice = negativePriceCandle.open < 0 || 
                               negativePriceCandle.high < 0 || 
                               negativePriceCandle.low < 0 || 
                               negativePriceCandle.close < 0;
      
      expect(hasNegativePrice).toBe(true);
    });

    it('should detect negative volume', () => {
      const negativeVolumeCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: -100.0,
      };

      const hasNegativeVolume = negativeVolumeCandle.volume < 0;
      expect(hasNegativeVolume).toBe(true);
    });
  });

  describe('recovery strategies', () => {
    it('should recover from incomplete candle by using adjacent candles', () => {
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
          high: 0, // Missing high
          low: 101.0,
          close: 106.0,
          volume: 1000.0,
        },
        {
          time: baseTime + 120,
          open: 106.0,
          high: 111.0,
          low: 104.0,
          close: 109.0,
          volume: 1000.0,
        },
      ];

      // Recovery: estimate missing high from adjacent candles
      const incompleteIndex = 1;
      if (candles[incompleteIndex].high === 0) {
        const prevHigh = candles[incompleteIndex - 1].high;
        const nextHigh = candles[incompleteIndex + 1].high;
        candles[incompleteIndex].high = (prevHigh + nextHigh) / 2;
      }

      expect(candles[1].high).toBe(108.0); // Average of 105 and 111
    });

    it('should handle candle with only timestamp available', () => {
      const minimalCandle: Partial<Candle> = {
        time: baseTime,
      };

      // Strategy: mark as invalid for display but keep for sequence
      const isValid = minimalCandle.open !== undefined && 
                      minimalCandle.high !== undefined && 
                      minimalCandle.low !== undefined && 
                      minimalCandle.close !== undefined;

      expect(isValid).toBe(false);
    });

    it('should interpolate missing data when possible', () => {
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
          high: 105.0,
          low: 101.0,
          close: 104.0,
          volume: 0, // Missing volume
        },
        {
          time: baseTime + 120,
          open: 104.0,
          high: 109.0,
          low: 103.0,
          close: 108.0,
          volume: 1000.0,
        },
      ];

      // Interpolate missing volume
      const missingIndex = 1;
      if (candles[missingIndex].volume === 0) {
        const prevVolume = candles[missingIndex - 1].volume;
        const nextVolume = candles[missingIndex + 1].volume;
        candles[missingIndex].volume = (prevVolume + nextVolume) / 2;
      }

      expect(candles[1].volume).toBe(1000.0); // Average of 1000 and 1000
    });
  });

  describe('edge cases', () => {
    it('should handle candle with all zero prices', () => {
      const zeroCandle: Candle = {
        time: baseTime,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 1000.0,
      };

      const isValid = zeroCandle.close > 0;
      expect(isValid).toBe(false);
    });

    it('should handle candle with extremely small values', () => {
      const tinyCandle: Candle = {
        time: baseTime,
        open: 0.0000001,
        high: 0.0000002,
        low: 0.00000005,
        close: 0.00000015,
        volume: 0.000001,
      };

      const isValid = tinyCandle.close > 0 && 
                      Number.isFinite(tinyCandle.open) && 
                      Number.isFinite(tinyCandle.high);
      
      expect(isValid).toBe(true);
    });

    it('should handle candle with extremely large values', () => {
      const hugeCandle: Candle = {
        time: baseTime,
        open: 1e15,
        high: 1.5e15,
        low: 0.9e15,
        close: 1.2e15,
        volume: 1e20,
      };

      const isValid = hugeCandle.close > 0 && 
                      Number.isFinite(hugeCandle.open) && 
                      Number.isFinite(hugeCandle.volume);
      
      expect(isValid).toBe(true);
    });
  });
});
