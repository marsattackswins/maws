import { describe, it, expect } from '@jest/globals';
import type { Candle } from '../../types';
import {
  parseKlines,
  isNewerTickerEvent,
  miniTickerNumbers,
  type BinanceKlineRow,
  type MiniTickerPayload,
} from '../../lib/market/feed-normalize';

describe('Feed Normalize - Binance Data Parsing', () => {
  const baseTime = 1625097600000; // Milliseconds

  describe('parseKlines - REST response parsing', () => {
    it('should parse valid Binance kline rows', () => {
      const rows: BinanceKlineRow[] = [
        [baseTime, '100.00', '105.00', '98.00', '103.00', '1000.00', baseTime + 60000],
        [
          baseTime + 60000,
          '103.00',
          '108.00',
          '101.00',
          '106.00',
          '1500.00',
          baseTime + 120000,
        ],
      ];

      const candles = parseKlines(rows);

      expect(candles).toHaveLength(2);
      expect(candles[0].time).toBe(Math.floor(baseTime / 1000)); // Converted to seconds
      expect(candles[0].open).toBe(100);
      expect(candles[0].high).toBe(105);
      expect(candles[0].low).toBe(98);
      expect(candles[0].close).toBe(103);
      expect(candles[0].volume).toBe(1000);
    });

    it('should enforce strictly increasing timestamps', () => {
      const rows: BinanceKlineRow[] = [
        [baseTime, '100.00', '105.00', '98.00', '103.00', '1000.00', baseTime + 60000],
        [baseTime, '103.00', '108.00', '101.00', '106.00', '1500.00', baseTime + 60000], // Duplicate
        [
          baseTime + 60000,
          '106.00',
          '110.00',
          '104.00',
          '109.00',
          '2000.00',
          baseTime + 120000,
        ],
      ];

      const candles = parseKlines(rows);

      // Duplicate should be skipped
      expect(candles).toHaveLength(2);
      expect(candles[0].time).toBe(Math.floor(baseTime / 1000));
      expect(candles[1].time).toBe(Math.floor((baseTime + 60000) / 1000));
    });

    it('should drop rows with non-finite values', () => {
      const rows: BinanceKlineRow[] = [
        [baseTime, '100.00', '105.00', '98.00', '103.00', '1000.00', baseTime + 60000],
        [baseTime + 60000, 'NaN', '108.00', '101.00', '106.00', '1500.00', baseTime + 120000], // Bad open
        [
          baseTime + 120000,
          '106.00',
          '110.00',
          '104.00',
          '109.00',
          '2000.00',
          baseTime + 180000,
        ],
      ];

      const candles = parseKlines(rows);

      expect(candles).toHaveLength(2);
      expect(candles[0].time).toBe(Math.floor(baseTime / 1000));
      expect(candles[1].time).toBe(Math.floor((baseTime + 120000) / 1000));
    });

    it('should drop rows with zero or negative close', () => {
      const rows: BinanceKlineRow[] = [
        [baseTime, '100.00', '105.00', '98.00', '0', '1000.00', baseTime + 60000], // Zero close
        [
          baseTime + 60000,
          '103.00',
          '108.00',
          '101.00',
          '-5.00',
          '1500.00',
          baseTime + 120000,
        ], // Negative
        [
          baseTime + 120000,
          '106.00',
          '110.00',
          '104.00',
          '109.00',
          '2000.00',
          baseTime + 180000,
        ],
      ];

      const candles = parseKlines(rows);

      expect(candles).toHaveLength(1);
      expect(candles[0].close).toBe(109);
    });

    it('should handle empty array', () => {
      const candles = parseKlines([]);
      expect(candles).toHaveLength(0);
    });

    it('should handle out-of-order input by skipping backwards timestamps', () => {
      const rows: BinanceKlineRow[] = [
        [baseTime + 60000, '103.00', '108.00', '101.00', '106.00', '1500.00', baseTime + 120000],
        [baseTime, '100.00', '105.00', '98.00', '103.00', '1000.00', baseTime + 60000], // Earlier
        [
          baseTime + 120000,
          '106.00',
          '110.00',
          '104.00',
          '109.00',
          '2000.00',
          baseTime + 180000,
        ],
      ];

      const candles = parseKlines(rows);

      // Only ascending timestamps are kept
      expect(candles).toHaveLength(2);
      expect(candles[0].time).toBe(Math.floor((baseTime + 60000) / 1000));
      expect(candles[1].time).toBe(Math.floor((baseTime + 120000) / 1000));
    });

    it('should handle non-finite volume by defaulting to 0', () => {
      const rows: BinanceKlineRow[] = [
        [baseTime, '100.00', '105.00', '98.00', '103.00', 'NaN', baseTime + 60000],
      ];

      const candles = parseKlines(rows);

      expect(candles).toHaveLength(1);
      expect(candles[0].volume).toBe(0);
    });
  });

  describe('isNewerTickerEvent - Event-time ordering', () => {
    it('should accept frame with newer event time', () => {
      const latestAccepted = 1625097600000;
      const frameTime = 1625097601000;

      expect(isNewerTickerEvent(latestAccepted, frameTime)).toBe(true);
    });

    it('should accept frame with equal event time (last arrival wins)', () => {
      const latestAccepted = 1625097600000;
      const frameTime = 1625097600000;

      expect(isNewerTickerEvent(latestAccepted, frameTime)).toBe(true);
    });

    it('should reject frame with older event time', () => {
      const latestAccepted = 1625097600000;
      const frameTime = 1625097599000;

      expect(isNewerTickerEvent(latestAccepted, frameTime)).toBe(false);
    });

    it('should accept frame with missing event time (degrade gracefully)', () => {
      const latestAccepted = 1625097600000;
      const frameTime = undefined;

      expect(isNewerTickerEvent(latestAccepted, frameTime)).toBe(true);
    });

    it('should accept frame when no latest time exists', () => {
      const latestAccepted = undefined;
      const frameTime = 1625097600000;

      expect(isNewerTickerEvent(latestAccepted, frameTime)).toBe(true);
    });

    it('should accept frame with non-finite event time', () => {
      const latestAccepted = 1625097600000;
      const frameTime = NaN;

      expect(isNewerTickerEvent(latestAccepted, frameTime)).toBe(true);
    });
  });

  describe('miniTickerNumbers - Quote payload parsing', () => {
    it('should parse valid miniTicker payload', () => {
      const payload: MiniTickerPayload = {
        e: '24hrMiniTicker',
        E: 1625097600000,
        s: 'BTCUSDT',
        c: '50000.00',
        o: '49000.00',
        h: '51000.00',
        l: '48500.00',
        v: '1000.50',
        q: '49750000.00',
        st: 1,
      };

      const nums = miniTickerNumbers(payload);

      expect(nums).not.toBeNull();
      expect(nums!.last).toBe(50000);
      expect(nums!.open).toBe(49000);
      expect(nums!.high).toBe(51000);
      expect(nums!.low).toBe(48500);
      expect(nums!.volume).toBe(1000.5);
    });

    it('should reject payload with non-trading status', () => {
      const payload: MiniTickerPayload = {
        e: '24hrMiniTicker',
        s: 'BTCUSDT',
        c: '50000.00',
        o: '49000.00',
        h: '51000.00',
        l: '48500.00',
        v: '1000.50',
        st: 0, // Not trading
      };

      const nums = miniTickerNumbers(payload);
      expect(nums).toBeNull();
    });

    it('should accept payload with missing status field', () => {
      const payload: MiniTickerPayload = {
        e: '24hrMiniTicker',
        s: 'BTCUSDT',
        c: '50000.00',
        o: '49000.00',
        h: '51000.00',
        l: '48500.00',
        v: '1000.50',
        // st: missing
      };

      const nums = miniTickerNumbers(payload);
      expect(nums).not.toBeNull();
    });

    it('should accept payload with status = 1 (trading)', () => {
      const payload: MiniTickerPayload = {
        e: '24hrMiniTicker',
        s: 'BTCUSDT',
        c: '50000.00',
        o: '49000.00',
        h: '51000.00',
        l: '48500.00',
        v: '1000.50',
        st: 1,
      };

      const nums = miniTickerNumbers(payload);
      expect(nums).not.toBeNull();
    });

    it('should coerce numeric strings to numbers', () => {
      const payload: MiniTickerPayload = {
        s: 'BTCUSDT',
        c: '50000.123456',
        o: '49000.654321',
        h: '51000.111111',
        l: '48500.999999',
        v: '1000.123456',
      };

      const nums = miniTickerNumbers(payload);

      expect(nums).not.toBeNull();
      expect(nums!.last).toBeCloseTo(50000.123456);
      expect(nums!.open).toBeCloseTo(49000.654321);
    });

    it('should handle NaN values (caller validates)', () => {
      const payload: MiniTickerPayload = {
        s: 'BTCUSDT',
        c: 'invalid',
        o: '49000',
        h: '51000',
        l: '48500',
        v: '1000',
      };

      const nums = miniTickerNumbers(payload);

      // Function returns numbers, but NaN is passed through
      expect(nums).not.toBeNull();
      expect(Number.isNaN(nums!.last)).toBe(true);
    });
  });

  describe('Integration: parseKlines with reconciliation', () => {
    it('should produce candles compatible with reconciliation', () => {
      const rows: BinanceKlineRow[] = [
        [baseTime, '100.00', '105.00', '98.00', '103.00', '1000.00', baseTime + 60000],
        [
          baseTime + 60000,
          '103.00',
          '108.00',
          '101.00',
          '106.00',
          '1500.00',
          baseTime + 120000,
        ],
        [
          baseTime + 120000,
          '106.00',
          '110.00',
          '104.00',
          '109.00',
          '2000.00',
          baseTime + 180000,
        ],
      ];

      const candles = parseKlines(rows);

      // All candles should pass basic checks
      expect(candles.every((c) => Number.isFinite(c.time))).toBe(true);
      expect(candles.every((c) => Number.isFinite(c.open))).toBe(true);
      expect(candles.every((c) => c.close > 0)).toBe(true);

      // Should be sorted
      for (let i = 1; i < candles.length; i++) {
        expect(candles[i].time).toBeGreaterThan(candles[i - 1].time);
      }
    });
  });
});
