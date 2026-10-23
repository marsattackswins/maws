/**
 * Direct tests for lib/vela-break-times.ts — the session-break geometry shared by
 * the overlay (compute) and the native renderer layer (paint).
 *
 * The clipping rule is the regression guard for the chart artefact seen after a
 * session break: a payload computed from a deeper/differently-synced feed keeps
 * day boundaries the chart never loaded, and Vela extrapolates time→x, so those
 * painted as dashed vertical lines floating in the empty right-hand space.
 */
import { clipBreaksToBars, sessionBreakTimes, utcDayKey } from "../vela-break-times";
import type { Candle } from "@/types";

const HOUR = 3_600;
const DAY = 86_400;

/** Start the fixture at a UTC midnight so day boundaries are easy to assert. */
const MIDNIGHT = Date.UTC(2026, 9, 14) / 1000;

function candles(timesSec: number[]): Candle[] {
  return timesSec.map((time) => ({ time, open: 1, high: 2, low: 0.5, close: 1.5, volume: 10 }));
}

/** `count` hourly bars from `startSec`, one per hour (no gaps). */
function hourly(startSec: number, count: number): Candle[] {
  return candles(Array.from({ length: count }, (_, i) => startSec + i * HOUR));
}

describe("utcDayKey", () => {
  it("buckets by UTC calendar day", () => {
    expect(utcDayKey(MIDNIGHT)).toBe(utcDayKey(MIDNIGHT + 23 * HOUR));
    expect(utcDayKey(MIDNIGHT + 24 * HOUR)).toBe(utcDayKey(MIDNIGHT) + 1);
  });
});

describe("sessionBreakTimes", () => {
  it("marks the first bar of each UTC day", () => {
    // Bars cross midnight once, so the first next-day bar is the separator.
    const bars = hourly(MIDNIGHT + 22 * HOUR, 5);
    expect(sessionBreakTimes(bars, "30m")).toEqual([MIDNIGHT + DAY]);
  });

  it("skips a multi-day gap without inventing intermediate breaks", () => {
    const bars = candles([MIDNIGHT + 10 * HOUR, MIDNIGHT + 3 * DAY + 10 * HOUR]);
    expect(sessionBreakTimes(bars, "30m")).toEqual([MIDNIGHT + 3 * DAY + 10 * HOUR]);
  });

  it("shows breaks at 30m but not on higher intraday or daily timeframes", () => {
    const bars = hourly(MIDNIGHT + 22 * HOUR, 5);
    expect(sessionBreakTimes(bars, "30m")).toEqual([MIDNIGHT + DAY]);
    expect(sessionBreakTimes(bars, "1h")).toEqual([]);
    expect(sessionBreakTimes(bars, "2h")).toEqual([]);
    expect(sessionBreakTimes(bars, "4h")).toEqual([]);
  });

  it("returns nothing for the daily timeframe and above", () => {
    expect(sessionBreakTimes(hourly(MIDNIGHT, 100), "1D")).toEqual([]);
    expect(sessionBreakTimes(hourly(MIDNIGHT, 100), "1W")).toEqual([]);
  });

  it("needs at least two bars", () => {
    expect(sessionBreakTimes(candles([MIDNIGHT]), "1h")).toEqual([]);
    expect(sessionBreakTimes([], "1h")).toEqual([]);
  });
});

describe("clipBreaksToBars", () => {
  const bars = [
    { time: (MIDNIGHT + 8 * HOUR) * 1000 },
    { time: (MIDNIGHT + 9 * HOUR) * 1000 },
    { time: (MIDNIGHT + 10 * HOUR) * 1000 },
  ];

  it("drops breaks past the newest loaded bar", () => {
    // The reported artefact: day boundaries the chart has no bars for.
    const times = [
      (MIDNIGHT + 9 * HOUR) * 1000,
      (MIDNIGHT + 20 * HOUR) * 1000,
      (MIDNIGHT + 3 * DAY) * 1000,
    ];
    expect(clipBreaksToBars(times, bars)).toEqual([(MIDNIGHT + 9 * HOUR) * 1000]);
  });

  it("drops breaks at or before the oldest loaded bar", () => {
    const times = [
      (MIDNIGHT + 2 * HOUR) * 1000,
      (MIDNIGHT + 8 * HOUR) * 1000,
      (MIDNIGHT + 9 * HOUR) * 1000,
    ];
    expect(clipBreaksToBars(times, bars)).toEqual([(MIDNIGHT + 9 * HOUR) * 1000]);
  });

  it("keeps a break landing exactly on the newest bar", () => {
    expect(clipBreaksToBars([(MIDNIGHT + 10 * HOUR) * 1000], bars)).toEqual([
      (MIDNIGHT + 10 * HOUR) * 1000,
    ]);
  });

  it("paints nothing on an empty, single-bar or degenerate series", () => {
    const times = [(MIDNIGHT + 9 * HOUR) * 1000];
    expect(clipBreaksToBars(times, [])).toEqual([]);
    expect(clipBreaksToBars(times, [{ time: (MIDNIGHT + 9 * HOUR) * 1000 }])).toEqual([]);
    expect(
      clipBreaksToBars(times, [{ time: 5_000 }, { time: 5_000 }]),
    ).toEqual([]);
  });
});
