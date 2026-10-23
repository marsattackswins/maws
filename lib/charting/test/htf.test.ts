import { describe, expect, it } from 'vitest';
import { bucketEnd, bucketStart, higherTimeframe, timeframeMs } from '../core/native-indicators/classics/htf';
import type { OHLCV } from '../core/model/ohlcv';

const MIN = 60_000;

/** Six 1-minute bars from 00:00, closing up then down. */
function minutes(): OHLCV[] {
    return [
        { time: 0, open: 10, high: 12, low: 9, close: 11 },
        { time: 1 * MIN, open: 11, high: 13, low: 10, close: 12 },
        { time: 2 * MIN, open: 12, high: 14, low: 11, close: 13 },
        { time: 3 * MIN, open: 13, high: 15, low: 12, close: 14 },
        { time: 4 * MIN, open: 14, high: 16, low: 13, close: 15 },
        { time: 5 * MIN, open: 15, high: 17, low: 14, close: 16 },
    ];
}

describe('higherTimeframe', () => {
    it('returns null for the chart interval and unknown resolutions', () => {
        expect(higherTimeframe(minutes(), '', false)).toBeNull();
        expect(higherTimeframe(minutes(), '2', false)).toBeNull();
        expect(higherTimeframe([], '5', false)).toBeNull();
    });

    it('folds chart bars into the requested interval', () => {
        const htf = higherTimeframe(minutes(), '5', false)!;
        expect(htf.bars).toHaveLength(2);
        expect(htf.bars[0]).toMatchObject({ time: 0, open: 10, high: 16, low: 9, close: 15 });
        expect(htf.bars[1]).toMatchObject({ time: 5 * MIN, open: 15, high: 17, low: 14, close: 16 });
    });

    it('projects a higher-timeframe series over the chart bars, following the forming bar', () => {
        const htf = higherTimeframe(minutes(), '5', false)!;
        expect(htf.project([50, 60])).toEqual([50, 50, 50, 50, 50, 60]);
    });

    it('holds the previous value while waiting for the interval to close', () => {
        const htf = higherTimeframe(minutes(), '5', true)!;
        // The 00:00 bar becomes current only at 00:05; the 00:05 bar is still forming.
        expect(htf.project([50, 60])).toEqual([NaN, NaN, NaN, NaN, NaN, 50]);
    });

    it('snaps weekly buckets to Monday and monthly ones to the calendar month', () => {
        // 1970-01-01 was a Thursday; its Monday is 1969-12-29.
        expect(bucketStart(Date.UTC(1970, 0, 1), 'W')).toBe(Date.UTC(1969, 11, 29));
        expect(bucketEnd(Date.UTC(1970, 0, 1), 'W')).toBe(Date.UTC(1970, 0, 5));
        expect(bucketStart(Date.UTC(2026, 9, 20), 'M')).toBe(Date.UTC(2026, 9, 1));
        expect(bucketEnd(Date.UTC(2026, 9, 20), 'M')).toBe(Date.UTC(2026, 10, 1));
        expect(timeframeMs('240')).toBe(240 * MIN);
    });
});
