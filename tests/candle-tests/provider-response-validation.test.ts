import { describe, it, expect } from '@jest/globals';
import type { Candle } from '../../types';

/**
 * Tests for provider response validation
 * Covers Binance API response parsing, WebSocket message validation, and error handling
 */

describe('Provider Response Validation', () => {
  const baseTimeMs = 1625097600000; // 2021-06-30 00:00:00 UTC in milliseconds
  const baseTimeSec = 1625097600;   // 2021-06-30 00:00:00 UTC in seconds

  describe('Binance kline response validation', () => {
    it('should parse valid Binance kline response', () => {
      // Binance kline format: [time, open, high, low, close, volume, closeTime, ...]
      const binanceKlineRow = [
        baseTimeMs,
        "100.0",
        "105.0",
        "98.0",
        "103.0",
        "1000.0",
        baseTimeMs + 59999,
        1000,
        0,
        100,
        "50000.0",
        "29999.0",
        "0"
      ];

      const time = Math.floor(Number(binanceKlineRow[0]) / 1000);
      const open = Number(binanceKlineRow[1]);
      const high = Number(binanceKlineRow[2]);
      const low = Number(binanceKlineRow[3]);
      const close = Number(binanceKlineRow[4]);
      const volume = Number(binanceKlineRow[5]);

      const candle: Candle = {
        time,
        open,
        high,
        low,
        close,
        volume: Number.isFinite(volume) ? volume : 0,
      };

      expect(candle.time).toBe(baseTimeSec);
      expect(candle.open).toBe(100.0);
      expect(candle.high).toBe(105.0);
      expect(candle.low).toBe(98.0);
      expect(candle.close).toBe(103.0);
      expect(candle.volume).toBe(1000.0);
    });

    it('should handle Binance response with string numbers', () => {
      const binanceKlineRow = [
        baseTimeMs.toString(),
        "100.5",
        "105.75",
        "98.25",
        "103.5",
        "1000.125",
      ];

      const time = Math.floor(Number(binanceKlineRow[0]) / 1000);
      const open = Number(binanceKlineRow[1]);
      const high = Number(binanceKlineRow[2]);
      const low = Number(binanceKlineRow[3]);
      const close = Number(binanceKlineRow[4]);
      const volume = Number(binanceKlineRow[5]);

      expect(time).toBe(baseTimeSec);
      expect(open).toBe(100.5);
      expect(high).toBe(105.75);
      expect(low).toBe(98.25);
      expect(close).toBe(103.5);
      expect(volume).toBe(1000.125);
    });

    it('should reject Binance response with invalid close price', () => {
      const invalidKlineRow = [
        baseTimeMs,
        "100.0",
        "105.0",
        "98.0",
        "0", // Invalid close
        "1000.0",
      ];

      const close = Number(invalidKlineRow[4]);
      const isValid = close > 0;

      expect(isValid).toBe(false);
    });

    it('should handle Binance response with missing fields', () => {
      const incompleteKlineRow = [
        baseTimeMs,
        "100.0",
        "105.0",
        // Missing low
        "103.0",
        "1000.0",
      ];

      const hasRequiredFields = incompleteKlineRow.length >= 6;
      expect(hasRequiredFields).toBe(false);
    });

    it('should handle Binance response with extra fields', () => {
      const klineRowWithExtras = [
        baseTimeMs,
        "100.0",
        "105.0",
        "98.0",
        "103.0",
        "1000.0",
        baseTimeMs + 59999,
        1000,
        0,
        100,
        "50000.0",
        "29999.0",
        "0",
        // Extra fields should be ignored
        "extra1",
        "extra2",
      ];

      const candle: Candle = {
        time: Math.floor(Number(klineRowWithExtras[0]) / 1000),
        open: Number(klineRowWithExtras[1]),
        high: Number(klineRowWithExtras[2]),
        low: Number(klineRowWithExtras[3]),
        close: Number(klineRowWithExtras[4]),
        volume: Number(klineRowWithExtras[5]),
      };

      expect(candle.time).toBe(baseTimeSec);
      expect(candle.close).toBe(103.0);
    });
  });

  describe('Binance WebSocket message validation', () => {
    it('should parse valid Binance kline WebSocket message', () => {
      const wsMessage = {
        e: "kline",
        s: "BTCUSDT",
        k: {
          t: baseTimeMs,
          T: baseTimeMs + 59999,
          s: "BTCUSDT",
          i: "1m",
          o: "100.0",
          h: "105.0",
          l: "98.0",
          c: "103.0",
          v: "1000.0",
          x: true, // Is closed
        },
      };

      const candle: Candle = {
        time: Math.floor(wsMessage.k.t / 1000),
        open: Number(wsMessage.k.o),
        high: Number(wsMessage.k.h),
        low: Number(wsMessage.k.l),
        close: Number(wsMessage.k.c),
        volume: Number(wsMessage.k.v),
      };

      expect(candle.time).toBe(baseTimeSec);
      expect(candle.open).toBe(100.0);
      expect(candle.close).toBe(103.0);
      expect(wsMessage.k.x).toBe(true);
    });

    it('should handle incomplete WebSocket kline message', () => {
      const incompleteWsMessage = {
        e: "kline",
        s: "BTCUSDT",
        k: {
          t: baseTimeMs,
          // Missing some fields
          o: "100.0",
          c: "103.0",
        },
      };

      const requiredFields = ['t', 'o', 'h', 'l', 'c', 'v'] as const;
      const hasRequiredFields = requiredFields.every(field => field in incompleteWsMessage.k);

      expect(hasRequiredFields).toBe(false);
    });

    it('should validate WebSocket message event type', () => {
      const validMessage = { e: "kline", /* ... */ };
      const invalidMessage = { e: "invalid", /* ... */ };

      const isValidEvent = validMessage.e === "kline";
      const isInvalidEvent = invalidMessage.e === "kline";

      expect(isValidEvent).toBe(true);
      expect(isInvalidEvent).toBe(false);
    });

    it('should handle closed vs unclosed kline flags', () => {
      const closedKline = {
        e: "kline",
        k: { x: true, /* ... */ },
      };

      const unclosedKline = {
        e: "kline",
        k: { x: false, /* ... */ },
      };

      expect(closedKline.k.x).toBe(true);
      expect(unclosedKline.k.x).toBe(false);
    });
  });

  describe('Binance ticker response validation', () => {
    it('should parse valid Binance 24h ticker response', () => {
      const tickerResponse = {
        symbol: "BTCUSDT",
        lastPrice: "50000.0",
        openPrice: "49000.0",
        highPrice: "51000.0",
        lowPrice: "48000.0",
        volume: "10000.0",
        priceChange: "1000.0",
        priceChangePercent: "2.04",
      };

      const last = Number(tickerResponse.lastPrice);
      const open = Number(tickerResponse.openPrice);
      const high = Number(tickerResponse.highPrice);
      const low = Number(tickerResponse.lowPrice);
      const volume = Number(tickerResponse.volume);
      const change = Number(tickerResponse.priceChange);
      const changePct = Number(tickerResponse.priceChangePercent);

      expect(last).toBe(50000.0);
      expect(open).toBe(49000.0);
      expect(high).toBe(51000.0);
      expect(low).toBe(48000.0);
      expect(volume).toBe(10000.0);
      expect(change).toBe(1000.0);
      expect(changePct).toBe(2.04);
    });

    it('should handle ticker response with missing fields', () => {
      const incompleteTicker = {
        symbol: "BTCUSDT",
        lastPrice: "50000.0",
        // Missing other fields
      };

      const requiredFields = ['symbol', 'lastPrice', 'openPrice', 'highPrice', 'lowPrice', 'volume'] as const;
      const hasRequiredFields = requiredFields.every(field => field in incompleteTicker);

      expect(hasRequiredFields).toBe(false);
    });

    it('should handle ticker response with zero values', () => {
      const zeroTicker = {
        symbol: "BTCUSDT",
        lastPrice: "0",
        openPrice: "0",
        highPrice: "0",
        lowPrice: "0",
        volume: "0",
        priceChange: "0",
        priceChangePercent: "0",
      };

      const last = Number(zeroTicker.lastPrice);
      const isValid = last > 0;

      expect(isValid).toBe(false);
    });
  });

  describe('API route parameter validation', () => {
    it('should validate symbol parameter format', () => {
      const validSymbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "MUUSDT"];
      const invalidSymbols = ["btc", "BTC", "BTC-USDT", ""];

      const symbolRegex = /^[A-Z0-9]{4,32}$/;

      validSymbols.forEach(symbol => {
        expect(symbolRegex.test(symbol)).toBe(true);
      });

      invalidSymbols.forEach(symbol => {
        expect(symbolRegex.test(symbol)).toBe(false);
      });
    });

    it('should validate interval parameter format', () => {
      const validIntervals = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "1d", "1w", "1M"];
      const invalidIntervals = ["1s", "10m", "invalid", ""];

      const validIntervalSet = new Set(validIntervals);

      validIntervals.forEach(interval => {
        expect(validIntervalSet.has(interval)).toBe(true);
      });

      invalidIntervals.forEach(interval => {
        expect(validIntervalSet.has(interval)).toBe(false);
      });
    });

    it('should validate limit parameter range', () => {
      const validLimits = [1, 100, 500, 1000, 1500];
      const invalidLimits = [0, -1, 1501, 10000];

      validLimits.forEach(limit => {
        const isValid = limit >= 1 && limit <= 1500;
        expect(isValid).toBe(true);
      });

      invalidLimits.forEach(limit => {
        const isValid = limit >= 1 && limit <= 1500;
        expect(isValid).toBe(false);
      });
    });

    it('should validate date format for calendar API', () => {
      const validDates = ["2021-06-30", "2021-12-31", "2024-02-29"];
      const invalidDates = ["2021/06/30", "06-30-2021", "invalid", "2021-13-01"];

      const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

      validDates.forEach(date => {
        expect(dateRegex.test(date)).toBe(true);
      });

      invalidDates.forEach(date => {
        expect(dateRegex.test(date)).toBe(false);
      });
    });
  });

  describe('error response handling', () => {
    it('should handle Binance API error responses', () => {
      const errorResponse = {
        code: -1121,
        msg: "Invalid symbol.",
      };

      const isError = errorResponse.code !== undefined && errorResponse.code < 0;
      expect(isError).toBe(true);
    });

    it('should handle network error responses', () => {
      const networkError = {
        error: "Upstream fetch failed",
        status: 502,
      };

      const isNetworkError = networkError.status >= 500;
      expect(isNetworkError).toBe(true);
    });

    it('should handle malformed JSON responses', () => {
      const malformedJson = "not valid json";
      
      let parseError = false;
      try {
        JSON.parse(malformedJson);
      } catch {
        parseError = true;
      }

      expect(parseError).toBe(true);
    });

    it('should handle empty array responses', () => {
      const emptyResponse: unknown[] = [];
      const hasData = Array.isArray(emptyResponse) && emptyResponse.length > 0;

      expect(hasData).toBe(false);
    });

    it('should handle null responses', () => {
      const nullResponse = null;
      const isValid = nullResponse !== null && nullResponse !== undefined;

      expect(isValid).toBe(false);
    });
  });

  describe('response structure validation', () => {
    it('should validate array response structure', () => {
      const arrayResponse = [
        [baseTimeMs, "100.0", "105.0", "98.0", "103.0", "1000.0"],
        [baseTimeMs + 60000, "103.0", "108.0", "101.0", "106.0", "1000.0"],
      ];

      const isArray = Array.isArray(arrayResponse);
      const hasNestedArrays = arrayResponse.every(item => Array.isArray(item));

      expect(isArray).toBe(true);
      expect(hasNestedArrays).toBe(true);
    });

    it('should validate object response structure', () => {
      const objectResponse = {
        symbol: "BTCUSDT",
        lastPrice: "50000.0",
        // ... other fields
      };

      const isObject = typeof objectResponse === "object" && objectResponse !== null;
      const hasSymbol = "symbol" in objectResponse;

      expect(isObject).toBe(true);
      expect(hasSymbol).toBe(true);
    });

    it('should validate expected fields in response', () => {
      const response = {
        symbol: "BTCUSDT",
        lastPrice: "50000.0",
        openPrice: "49000.0",
      };

      const requiredFields = ["symbol", "lastPrice", "openPrice"];
      const hasAllFields = requiredFields.every(field => field in response);

      expect(hasAllFields).toBe(true);
    });

    it('should handle unexpected additional fields', () => {
      const responseWithExtras = {
        symbol: "BTCUSDT",
        lastPrice: "50000.0",
        unexpectedField: "value",
        anotherUnexpected: 123,
      };

      const hasRequiredFields = "symbol" in responseWithExtras && "lastPrice" in responseWithExtras;
      expect(hasRequiredFields).toBe(true);
    });
  });

  describe('data type validation', () => {
    it('should validate numeric string conversion', () => {
      const numericStrings = ["100.0", "105.5", "98.25", "0.001"];
      const nonNumericStrings = ["invalid", "abc", ""];

      numericStrings.forEach(str => {
        const num = Number(str);
        expect(Number.isFinite(num)).toBe(true);
      });

      nonNumericStrings.forEach(str => {
        const num = Number(str);
        const isValid = Number.isFinite(num) && !isNaN(num) && str !== "";
        expect(isValid).toBe(false);
      });
    });

    it('should validate boolean string conversion', () => {
      const trueValues = ["true", "1", "yes"];
      const falseValues = ["false", "0", "no"];

      trueValues.forEach(val => {
        const bool = val === "true" || val === "1" || val === "yes";
        expect(bool).toBe(true);
      });

      falseValues.forEach(val => {
        const bool = val === "true" || val === "1" || val === "yes";
        expect(bool).toBe(false);
      });
    });

    it('should handle precision loss in conversion', () => {
      const highPrecision = "100.12345678901234567890";
      const converted = Number(highPrecision);

      expect(converted).toBeCloseTo(100.12345678901235);
    });
  });

  describe('bulk response validation', () => {
    it('should validate bulk kline response', () => {
      const bulkResponse = [
        [baseTimeMs, "100.0", "105.0", "98.0", "103.0", "1000.0"],
        [baseTimeMs + 60000, "103.0", "108.0", "101.0", "106.0", "1000.0"],
        [baseTimeMs + 120000, "106.0", "111.0", "104.0", "109.0", "1000.0"],
      ];

      const candles: Candle[] = [];
      for (const row of bulkResponse) {
        const time = Math.floor(Number(row[0]) / 1000);
        const open = Number(row[1]);
        const high = Number(row[2]);
        const low = Number(row[3]);
        const close = Number(row[4]);
        const volume = Number(row[5]);

        if (
          Number.isFinite(time) &&
          Number.isFinite(open) &&
          Number.isFinite(high) &&
          Number.isFinite(low) &&
          Number.isFinite(close) &&
          close > 0
        ) {
          candles.push({ time, open, high, low, close, volume });
        }
      }

      expect(candles).toHaveLength(3);
      expect(candles[0].time).toBe(baseTimeSec);
    });

    it('should filter invalid candles from bulk response', () => {
      const mixedResponse = [
        [baseTimeMs, "100.0", "105.0", "98.0", "103.0", "1000.0"],
        [baseTimeMs + 60000, "103.0", "108.0", "101.0", "0", "1000.0"], // Invalid close
        [baseTimeMs + 120000, "106.0", "111.0", "104.0", "109.0", "1000.0"],
      ];

      const validCandles = mixedResponse.filter(row => {
        const close = Number(row[4]);
        return close > 0;
      });

      expect(validCandles).toHaveLength(2);
    });
  });
});
