import type { IChartApi, ISeriesApi, LogicalRange, SeriesType, Time } from "lightweight-charts";
import type { Candle } from "@/types";

export type ChartHandle = {
  chart: IChartApi;
  series: ISeriesApi<SeriesType>;
  /** Client-space hit test for plotted indicators (vwap/volume/rsi/atr). */
  hitTestIndicator?: (clientX: number, clientY: number) => string | null;
  /** Bars applied to `series` — as displayed, so Heikin Ashi rewrites OHLC (times are untouched). */
  candles?: Candle[];
};

const handles = new Map<string, ChartHandle>();

let syncing = false;
let scaleWidthRaf = 0;

export function registerChart(paneId: string, handle: ChartHandle) {
  handles.set(paneId, handle);
  schedulePriceScaleWidthSync(true);
}

export function unregisterChart(paneId: string) {
  handles.delete(paneId);
  schedulePriceScaleWidthSync(true);
}

export function getChart(paneId: string): ChartHandle | undefined {
  return handles.get(paneId);
}

export function forEachChart(fn: (paneId: string, handle: ChartHandle) => void) {
  handles.forEach((handle, paneId) => fn(paneId, handle));
}

export function isChartSyncing() {
  return syncing;
}

function withChartSync(fn: () => void) {
  if (syncing) return;
  syncing = true;
  try {
    fn();
  } finally {
    syncing = false;
  }
}

/** Keep right (and left) price scales the same width across multi-chart panes. */
export function syncPriceScaleWidths(forceRemeasure = false) {
  const charts = [...handles.values()];
  if (charts.length === 0) return;

  if (charts.length === 1) {
    try {
      charts[0].chart.priceScale("right").applyOptions({ minimumWidth: 0 });
    } catch {
      /* ignore */
    }
    try {
      charts[0].chart.priceScale("left").applyOptions({ minimumWidth: 0 });
    } catch {
      /* ignore */
    }
    return;
  }

  if (forceRemeasure) {
    for (const handle of charts) {
      try {
        handle.chart.priceScale("right").applyOptions({ minimumWidth: 0 });
      } catch {
        /* ignore */
      }
      try {
        handle.chart.priceScale("left").applyOptions({ minimumWidth: 0 });
      } catch {
        /* ignore */
      }
    }
  }

  let maxRight = 0;
  let maxLeft = 0;
  for (const handle of charts) {
    try {
      maxRight = Math.max(maxRight, handle.chart.priceScale("right").width());
    } catch {
      /* ignore */
    }
    try {
      maxLeft = Math.max(maxLeft, handle.chart.priceScale("left").width());
    } catch {
      /* ignore */
    }
  }

  maxRight = Math.ceil(maxRight);
  maxLeft = Math.ceil(maxLeft);

  for (const handle of charts) {
    try {
      handle.chart.priceScale("right").applyOptions({ minimumWidth: maxRight });
    } catch {
      /* ignore */
    }
    if (maxLeft > 0) {
      try {
        handle.chart.priceScale("left").applyOptions({ minimumWidth: maxLeft });
      } catch {
        /* ignore */
      }
    }
  }
}

export function schedulePriceScaleWidthSync(forceRemeasure = false) {
  if (typeof requestAnimationFrame === "undefined") {
    syncPriceScaleWidths(forceRemeasure);
    return;
  }
  if (scaleWidthRaf) cancelAnimationFrame(scaleWidthRaf);
  scaleWidthRaf = requestAnimationFrame(() => {
    scaleWidthRaf = 0;
    if (forceRemeasure) {
      requestAnimationFrame(() => syncPriceScaleWidths(true));
    } else {
      syncPriceScaleWidths(false);
    }
  });
}

export function syncCrosshairToOthers(sourcePaneId: string, time: Time, price: number) {
  withChartSync(() => {
    forEachChart((paneId, handle) => {
      if (paneId === sourcePaneId) return;
      try {
        handle.chart.setCrosshairPosition(price, time, handle.series);
      } catch {
        /* series may not have that time */
      }
    });
  });
}

export function clearSyncedCrosshair(sourcePaneId: string) {
  withChartSync(() => {
    forEachChart((paneId, handle) => {
      if (paneId === sourcePaneId) return;
      try {
        handle.chart.clearCrosshairPosition();
      } catch {
        /* ignore */
      }
    });
  });
}

export function syncLogicalRangeToOthers(sourcePaneId: string, range: LogicalRange) {
  withChartSync(() => {
    forEachChart((paneId, handle) => {
      if (paneId === sourcePaneId) return;
      try {
        handle.chart.timeScale().setVisibleLogicalRange(range);
      } catch {
        /* ignore */
      }
    });
  });
}

export function syncVisibleRangeToOthers(
  sourcePaneId: string,
  range: { from: Time; to: Time },
) {
  withChartSync(() => {
    forEachChart((paneId, handle) => {
      if (paneId === sourcePaneId) return;
      try {
        handle.chart.timeScale().setVisibleRange(range);
      } catch {
        /* ignore */
      }
    });
  });
}

export type LastCrosshair = {
  paneId: string;
  price: number;
  time: number | null;
};

let lastCrosshair: LastCrosshair | null = null;

export function setLastCrosshair(value: LastCrosshair | null) {
  lastCrosshair = value;
}

export function getLastCrosshair(): LastCrosshair | null {
  return lastCrosshair;
}
