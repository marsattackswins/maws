import { describe, it, expect } from '@jest/globals';
import type { Candle } from '../../types';

/**
 * Tests for handling duplicate and out-of-order candles
 * These scenarios are common in real-time WebSocket feeds
 */

describe('Duplicate and Out-of-Order Candle Handling', () => {
  const baseTime = 1625097600; // 2021-06-30 00:00:00 UTC

  describe('duplicate candle detection', () => {
    it('should detect candles with identical timestamps', () => {
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
          time: baseTime, // Duplicate timestamp
          open: 103.0,
          high: 108.0,
          low: 101.0,
          close: 106.0,
          volume: 1200.0,
        },
      ];

      const timestamps = candles.map(c => c.time);
      const uniqueTimestamps = new Set(timestamps);
      
      expect(timestamps).toHaveLength(2);
      expect(uniqueTimestamps.size).toBe(1);
    });

    it('should handle updating existing candle when duplicate arrives', () => {
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

      // Simulate updating a candle with same timestamp (common in live feeds)
      const updatedCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 106.0, // Updated high
        low: 98.0,
        close: 104.0, // Updated close
        volume: 1100.0, // Updated volume
      };

      const existingIndex = candles.findIndex(c => c.time === updatedCandle.time);
      if (existingIndex >= 0) {
        candles[existingIndex] = updatedCandle;
      }

      expect(candles).toHaveLength(1);
      expect(candles[0].high).toBe(106.0);
      expect(candles[0].close).toBe(104.0);
      expect(candles[0].volume).toBe(1100.0);
    });

    it('should ignore duplicate candles with same data', () => {
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

      const duplicateCandle: Candle = {
        time: baseTime,
        open: 100.0,
        high: 105.0,
        low: 98.0,
        close: 103.0,
        volume: 1000.0,
      };

      const isDuplicate = candles.some(c => 
        c.time === duplicateCandle.time &&
        c.open === duplicateCandle.open &&
        c.high === duplicateCandle.high &&
        c.low === duplicateCandle.low &&
        c.close === duplicateCandle.close &&
        c.volume === duplicateCandle.volume
      );

      expect(isDuplicate).toBe(true);
    });
  });

  describe('out-of-order candle handling', () => {
    it('should detect out-of-order candles', () => {
      const candles: Candle[] = [
        {
          time: baseTime + 120, // Later candle first
          open: 105.0,
          high: 110.0,
          low: 103.0,
          close: 108.0,
          volume: 1000.0,
        },
        {
          time: baseTime, // Earlier candle second
          open: 100.0,
          high: 105.0,
          low: 98.0,
          close: 103.0,
          volume: 1000.0,
        },
      ];

      const isOutOfOrder = candles[1].time < candles[0].time;
      expect(isOutOfOrder).toBe(true);
    });

    it('should sort out-of-order candles by timestamp', () => {
      const candles: Candle[] = [
        {
          time: baseTime + 120,
          open: 105.0,
          high: 110.0,
          low: 103.0,
          close: 108.0,
          volume: 1000.0,
        },
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
          close: 106.0,
          volume: 1000.0,
        },
      ];

      const sortedCandles = [...candles].sort((a, b) => a.time - b.time);
      
      expect(sortedCandles[0].time).toBe(baseTime);
      expect(sortedCandles[1].time).toBe(baseTime + 60);
      expect(sortedCandles[2].time).toBe(baseTime + 120);
    });

    it('should handle backfill of historical candles', () => {
      const existingCandles: Candle[] = [
        {
          time: baseTime + 240,
          open: 110.0,
          high: 115.0,
          low: 108.0,
          close: 113.0,
          volume: 1000.0,
        },
      ];

      const backfillCandles: Candle[] = [
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

      const mergedCandles = [...backfillCandles, ...existingCandles].sort((a, b) => a.time - b.time);
      
      expect(mergedCandles).toHaveLength(4);
      expect(mergedCandles[0].time).toBe(baseTime);
      expect(mergedCandles[3].time).toBe(baseTime + 240);
    });

    it('should handle late-arriving candle updates', () => {
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

      // Late update for middle candle
      const lateUpdate: Candle = {
        time: baseTime + 60,
        open: 103.0,
        high: 109.0, // Updated high
        low: 101.0,
        close: 107.0, // Updated close
        volume: 1100.0, // Updated volume
      };

      const updateIndex = candles.findIndex(c => c.time === lateUpdate.time);
      if (updateIndex >= 0) {
        candles[updateIndex] = lateUpdate;
      }

      expect(candles[1].high).toBe(109.0);
      expect(candles[1].close).toBe(107.0);
      expect(candles[1].volume).toBe(1100.0);
    });
  });

  describe('sequence validation', () => {
    it('should validate consecutive time sequence', () => {
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

      const isConsecutive = candles.every((candle, i) => {
        if (i === 0) return true;
        return candle.time === candles[i - 1].time + 60;
      });

      expect(isConsecutive).toBe(true);
    });

    it('should detect gaps in time sequence', () => {
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
          close: 106.0,
          volume: 1000.0,
        },
        {
          time: baseTime + 180, // Gap: missing 120
          open: 106.0,
          high: 111.0,
          low: 104.0,
          close: 109.0,
          volume: 1000.0,
        },
      ];

      const gaps: number[] = [];
      candles.forEach((candle, i) => {
        if (i > 0) {
          const gap = candle.time - candles[i - 1].time;
          if (gap > 60) gaps.push(gap);
        }
      });

      expect(gaps).toHaveLength(1);
      expect(gaps[0]).toBe(120);
    });

    it('should handle irregular time intervals', () => {
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
          time: baseTime + 30, // 30-second interval
          open: 103.0,
          high: 108.0,
          low: 101.0,
          close: 106.0,
          volume: 1000.0,
        },
        {
          time: baseTime + 90, // 60-second interval
          open: 106.0,
          high: 111.0,
          low: 104.0,
          close: 109.0,
          volume: 1000.0,
        },
      ];

      const intervals: number[] = [];
      candles.forEach((candle, i) => {
        if (i > 0) {
          intervals.push(candle.time - candles[i - 1].time);
        }
      });

      expect(intervals).toEqual([30, 60]);
    });
  });

  describe('merge strategies', () => {
    it('should merge candles by keeping most recent for duplicates', () => {
      const candles1: Candle[] = [
        {
          time: baseTime,
          open: 100.0,
          high: 105.0,
          low: 98.0,
          close: 103.0,
          volume: 1000.0,
        },
      ];

      const candles2: Candle[] = [
        {
          time: baseTime,
          open: 100.0,
          high: 106.0,
          low: 98.0,
          close: 104.0,
          volume: 1100.0,
        },
      ];

      const merged = new Map<number, Candle>();
      [...candles1, ...candles2].forEach(candle => {
        merged.set(candle.time, candle);
      });

      const result = Array.from(merged.values()).sort((a, b) => a.time - b.time);
      
      expect(result).toHaveLength(1);
      expect(result[0].high).toBe(106.0); // Most recent value
      expect(result[0].volume).toBe(1100.0);
    });

    it('should merge multiple candle sources with overlap', () => {
      const source1: Candle[] = [
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
          close: 106.0,
          volume: 1000.0,
        },
      ];

      const source2: Candle[] = [
        {
          time: baseTime + 60,
          open: 103.0,
          high: 109.0,
          low: 101.0,
          close: 107.0,
          volume: 1100.0,
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

      const merged = new Map<number, Candle>();
      [...source1, ...source2].forEach(candle => {
        merged.set(candle.time, candle);
      });

      const result = Array.from(merged.values()).sort((a, b) => a.time - b.time);
      
      expect(result).toHaveLength(3);
      expect(result[0].time).toBe(baseTime);
      expect(result[1].time).toBe(baseTime + 60);
      expect(result[2].time).toBe(baseTime + 120);
      expect(result[1].high).toBe(109.0); // Updated from source2
    });
  });

  describe('deduplication performance', () => {
    it('should handle large arrays with duplicates efficiently', () => {
      const candles: Candle[] = [];
      for (let i = 0; i < 1000; i++) {
        candles.push({
          time: baseTime + i * 60,
          open: 100 + i,
          high: 105 + i,
          low: 98 + i,
          close: 103 + i,
          volume: 1000,
        });
      }

      // Add some duplicates
      candles.push({ ...candles[500] });
      candles.push({ ...candles[200] });

      const uniqueCandles = new Map<number, Candle>();
      candles.forEach(candle => {
        uniqueCandles.set(candle.time, candle);
      });

      expect(uniqueCandles.size).toBe(1000); // Should deduplicate
    });
  });
});
