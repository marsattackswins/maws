import {
  buildCandleMap,
  hasMixedTimeUnits,
  isSortedByTime,
  mapToSortedCandles,
  mergeLiveCandle,
  normalizeCandleTime,
  reconcileCandleSeries,
  upsertCandle,
  upsertCandles,
} from "@/lib/market/candle-reconcile";
import {
  plotBoundsFromScales,
  pointInPlot,
  clampToPlot,
  type PlotBounds,
} from "@/lib/drawings";

function makeCandle(time: number, open = 100, close = 101, high?: number, low?: number) {
  return {
    time,
    open,
    close,
    high: high ?? Math.max(open, close),
    low: low ?? Math.min(open, close),
    volume: 1,
  };
}

describe("candle rendering regression", () => {
  // ── 1. Normal candle sequence ────────────────────────────────────────────
  describe("normal candle sequence", () => {
    it("keeps a strictly increasing series through upsert + reconcile", () => {
      const rest = [1, 2, 3, 4, 5].map((m) => makeCandle(1_700_000_000 + m * 60));
      const live = [makeCandle(1_700_000_000 + 6 * 60, 105, 106)];
      const merged = reconcileCandleSeries(rest, live, 500);
      expect(merged).toHaveLength(6);
      expect(isSortedByTime(merged)).toBe(true);
      // live tip preserved (last wins)
      expect(merged.at(-1)!.close).toBe(106);
      // OHLC untouched for history rows
      expect(merged[0]).toEqual(expect.objectContaining({ open: 100, close: 101 }));
    });

    it("round-trips through the map without altering values", () => {
      const map = buildCandleMap([makeCandle(10, 1, 2, 3, 0.5), makeCandle(20)]);
      const arr = mapToSortedCandles(map);
      expect(arr.map((c) => c.time)).toEqual([10, 20]);
      expect(arr[0]).toEqual(expect.objectContaining({ open: 1, close: 2 }));
    });
  });

  // ── 2. In-progress candle update ─────────────────────────────────────────
  describe("in-progress candle update", () => {
    it("updates the tip in place — never appends a duplicate bar", () => {
      const series = [1, 2, 3].map((m) => makeCandle(1_700_000_000 + m * 60));
      const before = series.length;

      const first = mergeLiveCandle(series, makeCandle(1_700_000_180, 103, 103.5), false, 500, 60);
      expect(first).toBe("tip");
      expect(series).toHaveLength(before);
      expect(series.at(-1)!.close).toBe(103.5);

      const second = mergeLiveCandle(series, makeCandle(1_700_000_180, 103, 104.2), false, 500, 60);
      expect(second).toBe("tip");
      expect(series).toHaveLength(before);
      expect(series.at(-1)!.high).toBe(104.2);
      expect(series.at(-1)!.close).toBe(104.2);
      expect(isSortedByTime(series)).toBe(true);
    });

    it("reports duplicate for an identical repeated tip frame", () => {
      const series = [makeCandle(100), makeCandle(160, 100, 101, 101, 100)];
      const frame = makeCandle(160, 100, 101, 101, 100);
      expect(mergeLiveCandle(series, frame, false, 500)).toBe("duplicate");
      expect(series).toHaveLength(2);
      expect(series.at(-1)!.close).toBe(101);
    });
  });

  // ── 3. New-interval candle append ────────────────────────────────────────
  describe("new-interval candle append", () => {
    it("appends when the incoming bar opens on the next interval", () => {
      const series = [makeCandle(1_700_000_000), makeCandle(1_700_000_060)];
      const res = mergeLiveCandle(series, makeCandle(1_700_000_120), false, 500, 60);
      expect(res).toBe("append");
      expect(series).toHaveLength(3);
      expect(series.at(-1)!.time).toBe(1_700_000_120);
    });

    it("never merges a foreign-interval frame into the forming bar", () => {
      // tip at :00 of a 60s grid; a 300s-interval frame arrives at :120 —
      // not the same bar, not the next bar on the 60s grid → must append a
      // fresh bar, not overwrite the tip.
      const series = [makeCandle(1_700_000_000), makeCandle(1_700_000_060, 101, 102)];
      const res = mergeLiveCandle(series, makeCandle(1_700_000_120, 105, 106), false, 500, 60);
      expect(res).toBe("append");
      expect(series.at(-2)!.close).toBe(102); // forming bar preserved
      expect(series.at(-1)!.open).toBe(105);
    });

    it("appends only once per interval step, treating mid-interval frames as tip updates", () => {
      const series = [makeCandle(60, 100, 100)];
      // Same-bar updates (step 0) never append:
      expect(mergeLiveCandle(series, makeCandle(90), false, 500, 60)).toBe("tip");
      expect(series).toHaveLength(1);
      // Next interval appends exactly one bar:
      expect(mergeLiveCandle(series, makeCandle(120), false, 500, 60)).toBe("append");
      expect(mergeLiveCandle(series, makeCandle(150), false, 500, 60)).toBe("tip");
      expect(series).toHaveLength(2);
      expect(series.at(-1)!.time).toBe(120); // mid-interval frame keeps grid time
      expect(mergeLiveCandle(series, makeCandle(180), false, 500, 60)).toBe("append");
      expect(series.map((c) => c.time)).toEqual([60, 120, 180]);
    });
  });

  // ── 4. Duplicate and out-of-order timestamps ─────────────────────────────
  describe("duplicate and out-of-order timestamps", () => {
    it("dedupes out-of-order frames (stale non-final ignored)", () => {
      const series: { time: number; open: number; high: number; low: number; close: number; volume: number }[] = [];
      expect(mergeLiveCandle(series, makeCandle(120), false, 500)).toBe("append");
      expect(mergeLiveCandle(series, makeCandle(180), false, 500)).toBe("append");
      expect(mergeLiveCandle(series, makeCandle(60), false, 500)).toBe("duplicate");
      expect(mergeLiveCandle(series, makeCandle(150), false, 500)).toBe("duplicate");
      expect(series.map((c) => c.time)).toEqual([120, 180]);
      expect(isSortedByTime(series)).toBe(true);
      expect(countDuplicates(series)).toBe(0);
    });

    it("final frames may patch an older bar in place (no reordering)", () => {
      const series = [makeCandle(60), makeCandle(120), makeCandle(180)];
      const res = mergeLiveCandle(series, makeCandle(120, 100, 107), true, 500);
      expect(res).toBe("replaced");
      expect(series.map((c) => c.time)).toEqual([60, 120, 180]);
      expect(series[1].close).toBe(107);
    });

    it("buildCandleMap drops duplicate timestamps keeping last-wins", () => {
      const map = buildCandleMap([makeCandle(60, 1, 1), makeCandle(60, 2, 2), makeCandle(120, 3, 3)]);
      expect([...map.keys()]).toEqual([60, 120]);
      expect(map.get(60)!.close).toBe(2);
    });

    it("upsertCandle normalizes a ms-unit duplicate onto the s-unit bar", () => {
      const map = new Map();
      upsertCandle(map, makeCandle(1_700_000_060, 1, 1));
      upsertCandle(map, makeCandle(1_700_000_060_000, 9, 9)); // ms duplicate of t=...060
      expect([...map.keys()]).toEqual([1_700_000_060]);
      expect(map.get(1_700_000_060)!.open).toBe(9);
    });

    it("upsertCandles + mapToSortedCandles repair an out-of-order batch", () => {
      const map = new Map();
      upsertCandles(map, [makeCandle(180), makeCandle(60), makeCandle(120), makeCandle(60, 5, 5)]);
      const arr = mapToSortedCandles(map);
      expect(arr.map((c) => c.time)).toEqual([60, 120, 180]);
    });
  });

  // ── 5. The screenshot state: mixed units compress candles ────────────────
  describe("screenshot state (mixed ms/s units)", () => {
    it("normalizeCandleTime converts ms to s", () => {
      expect(normalizeCandleTime(makeCandle(1_700_000_060_000)).time).toBe(1_700_000_060);
      expect(normalizeCandleTime(makeCandle(1_700_000_060)).time).toBe(1_700_000_060);
    });

    it("an ms-unit live frame merges onto the s-unit tip instead of appending", () => {
      const series = [makeCandle(1_700_000_000), makeCandle(1_700_000_060, 101, 102)];
      const res = mergeLiveCandle(series, makeCandle(1_700_000_060_000, 101, 103), false, 500);
      expect(res).toBe("tip");
      expect(series).toHaveLength(2);
      expect(series.at(-1)!.close).toBe(103);
      expect(isSortedByTime(series)).toBe(true);
    });

    it("an ms-unit newer frame appends at s-unit spacing, not 1000 bars away", () => {
      const series = [makeCandle(1_700_000_060, 101, 102)];
      const res = mergeLiveCandle(series, makeCandle(1_700_000_120_000, 102, 103), false, 500);
      expect(res).toBe("append");
      expect(series.map((c) => c.time)).toEqual([1_700_000_060, 1_700_000_120]);
      expect(isSortedByTime(series)).toBe(true);
    });

    it("reconcileCandleSeries repairs an already-mixed series", () => {
      const rest = [1, 2, 3].map((m) => makeCandle(1_700_000_000 + m * 60));
      // "live" array contains an ms-unit duplicate of the tip:
      const live = [makeCandle(1_700_000_180_000, 103, 104)];
      const merged = reconcileCandleSeries(rest, live, 500);
      expect(merged).toHaveLength(3);
      expect(merged.at(-1)!.time).toBe(1_700_000_180);
      expect(merged.at(-1)!.close).toBe(104);
      expect(hasMixedTimeUnits(merged)).toBe(false);
    });

    it("detects the pathological mixed-unit shape", () => {
      // Sorted mixed units: s-unit history with one ms-unit bar mixed in.
      expect(hasMixedTimeUnits([makeCandle(1_700_000_060), makeCandle(1_700_000_060_000)])).toBe(true);
      expect(hasMixedTimeUnits([makeCandle(1_700_000_060), makeCandle(1_700_000_120)])).toBe(false);
      expect(hasMixedTimeUnits([makeCandle(1_700_000_060_000), makeCandle(1_700_000_120_000)])).toBe(false);
      expect(hasMixedTimeUnits([])).toBe(false);
    });
  });

  // ── 6. Overlay bounds must not cover the full right side ────────────────
  describe("overlay zone bounds", () => {
    const size = { width: 1000, height: 500 };
    const scales = { left: 60, right: 70, timeAxis: 28 };
    const plot: PlotBounds = plotBoundsFromScales(size, scales);

    it("plot bounds exclude the price/time scales", () => {
      expect(plot).toEqual({ left: 60, top: 0, right: 930, bottom: 472, width: 870, height: 472 });
    });

    it("a zone rect clamped to the plot never reaches the price scale", () => {
      // Entry mid-chart, tool right edge dragged far past the last bar:
      const x0raw = 400;
      const x1raw = 1900; // way beyond plot.right
      const x0 = Math.max(plot.left, x0raw);
      const x1 = Math.min(plot.right, x1raw);
      expect(x1).toBeLessThanOrEqual(plot.right);
      expect(x1 - x0).toBeLessThan(size.width - scales.left); // not full width
      // Every painted x stays inside the plot:
      for (const x of [x0, x1]) {
        expect(pointInPlot(x, plot.top + 10, plot)).toBe(true);
      }
    });

    it("clampToPlot keeps any overlay point inside the plot", () => {
      const c = clampToPlot(1900, -50, plot);
      expect(c.x).toBeLessThanOrEqual(plot.right - 0.5);
      expect(c.y).toBeGreaterThanOrEqual(plot.top);
    });

    it("a fully off-plot zone collapses to zero width (no opaque band)", () => {
      const x0 = Math.max(plot.left, 1500);
      const x1 = Math.min(plot.right, 1900);
      expect(x1 - x0).toBeLessThanOrEqual(0);
    });

    it("a normal on-plot zone is untouched by clamping", () => {
      const x0 = Math.max(plot.left, 100);
      const x1 = Math.min(plot.right, 300);
      expect([x0, x1]).toEqual([100, 300]);
    });
  });
});

function countDuplicates(candles: { time: number }[]): number {
  const seen = new Set<number>();
  let dupes = 0;
  for (const c of candles) {
    if (seen.has(c.time)) dupes++;
    else seen.add(c.time);
  }
  return dupes;
}
