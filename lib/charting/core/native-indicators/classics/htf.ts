import type { OHLCV } from '../../model/ohlcv';

/**
 * Higher-timeframe support for the classic studies.
 *
 * A classic's `compute` only receives the chart's own bars, so an `input.timeframe`
 * setting is honoured by resampling those bars into the requested interval, running the
 * study over the resampled series and projecting the result back onto the chart's bars.
 * Everything here is pure, and one compute pass costs a single pass over the history.
 */

const MINUTE = 60_000;
const DAY = 86_400_000;

/** Candle intervals the settings dialog offers, in ms. `M` is calendar-based (see `bucketStart`). */
export const TIMEFRAME_MS: Readonly<Record<string, number>> = {
    '1': MINUTE,
    '3': 3 * MINUTE,
    '5': 5 * MINUTE,
    '15': 15 * MINUTE,
    '30': 30 * MINUTE,
    '45': 45 * MINUTE,
    '60': 60 * MINUTE,
    '120': 120 * MINUTE,
    '180': 180 * MINUTE,
    '240': 240 * MINUTE,
    D: DAY,
    W: 7 * DAY,
};

/** The interval a resolution names, in ms; 0 for the chart's own (`''`) or an unknown one. */
export function timeframeMs(resolution: string): number {
    return TIMEFRAME_MS[resolution.trim()] ?? 0;
}

/** Whether a resolution asks for a different timeframe than the chart's own (`''`). */
export function isHigherTimeframe(resolution: string): boolean {
    return resolution.trim() === 'M' || timeframeMs(resolution) > 0;
}

/**
 * The open time of the bucket a timestamp falls in: minutes/hours/days snap to the epoch
 * grid, `W` to the Monday that starts the week and `M` to the 1st of the calendar month.
 */
export function bucketStart(time: number, resolution: string): number {
    if (resolution === 'M') {
        const d = new Date(time);
        return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
    }
    if (resolution === 'W') {
        const d = new Date(time);
        const midnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        return midnight - ((d.getUTCDay() + 6) % 7) * DAY; // 1970-01-01 was a Thursday; shift to Monday
    }
    const step = timeframeMs(resolution);
    return step > 0 ? Math.floor(time / step) * step : time;
}

/** When the bucket holding `time` closes — the open time of the next bucket. */
export function bucketEnd(time: number, resolution: string): number {
    const start = bucketStart(time, resolution);
    if (resolution === 'M') {
        const d = new Date(start);
        return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
    }
    if (resolution === 'W') return start + 7 * DAY;
    return start + timeframeMs(resolution);
}

/** Fold chart bars into the requested interval, keeping the newest (possibly forming) bucket. */
function aggregate(bars: readonly OHLCV[], resolution: string): OHLCV[] {
    const out: OHLCV[] = [];
    const last = (): OHLCV => out[out.length - 1]!;
    for (const bar of bars) {
        const start = bucketStart(bar.time, resolution);
        if (out.length === 0 || last().time !== start) {
            out.push({ time: start, open: bar.open, high: bar.high, low: bar.low, close: bar.close, volume: bar.volume ?? 0 });
            continue;
        }
        const bucket = last();
        bucket.high = Math.max(bucket.high, bar.high);
        bucket.low = Math.min(bucket.low, bar.low);
        bucket.close = bar.close;
        bucket.volume = (bucket.volume ?? 0) + (bar.volume ?? 0);
    }
    return out;
}

/** A study's view of a higher timeframe: the resampled bars plus the map back to the chart. */
export interface HigherTimeframe {
    /** Resampled bars, oldest first; the last one may still be forming. */
    bars: OHLCV[];
    /** Spread a higher-timeframe series over the chart's bars (NaN before its first bar). */
    project(values: readonly number[]): number[];
}

/**
 * Resample the chart bars to `resolution` for a study that calculates on it — or null when
 * the resolution is the chart's own (`''`), in which case the caller keeps its bars.
 *
 * With `waitForCloses` a higher-timeframe bar counts only once it has closed, so the study
 * holds its previous value through the live bar instead of tracking the forming one. Null
 * bars (no history yet) project to NaN.
 */
export function higherTimeframe(bars: readonly OHLCV[], resolution: string, waitForCloses: boolean): HigherTimeframe | null {
    if (bars.length === 0 || !isHigherTimeframe(resolution)) return null;
    const htfBars = aggregate(bars, resolution);
    // The chart bar each higher-timeframe bar becomes current on: its open, or its close
    // while waiting for closes.
    const activatedAt = htfBars.map((bar) => (waitForCloses ? bucketEnd(bar.time, resolution) : bar.time));
    const indexAt = new Array<number>(bars.length);
    let index = -1;
    for (let i = 0; i < bars.length; i++) {
        while (index + 1 < htfBars.length && activatedAt[index + 1]! <= bars[i]!.time) index += 1;
        indexAt[i] = index;
    }
    return {
        bars: htfBars,
        project: (values) => indexAt.map((i) => (i < 0 ? NaN : (values[i] ?? NaN))),
    };
}
