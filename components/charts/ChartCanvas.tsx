"use client";

import {
  clearSyncedCrosshair,
  getChart,
  isChartSyncing,
  registerChart,
  schedulePriceScaleWidthSync,
  setLastCrosshair,
  syncCrosshairToOthers,
  syncLogicalRangeToOthers,
  syncVisibleRangeToOthers,
  unregisterChart,
  type ChartHandle,
} from "@/lib/chart-registry";
import { isLineStyle, styleCandles } from "@/lib/chart-style";
import {
  wheelZoomFactor,
  zoomTimeScaleRightAnchored,
} from "@/lib/chart-zoom";
import { CHART_TIME_AXIS_H } from "@/lib/drawings";
import {
  applyColorOpacity,
  computeAdx,
  computeAtr,
  computeBbPlot,
  computeEmaPlot,
  computePmo,
  computeRsi,
  computeStochastic,
  computeVwapPlot,
  computeVolumeMa,
  computeVolumeMaLast,
  lineAppearance,
  OVERLAY_INDICATORS,
  PANE_INDICATORS,
  toLineData,
  type StudyPaneId,
} from "@/lib/indicators";
import { mawsFeed } from "@/lib/maws/feed";
import { useCandleDebug } from "@/lib/market/candle-debug";
import { formatTicker, getSymbol, symbolColor } from "@/lib/maws/universe";
import { assetLogoLetter, assetLogoSrc } from "@/lib/maws/asset-logo";
import { MAIN_PRICE_PANE_ID } from "@/lib/slices/chart-slice";
import { useAppStore } from "@/lib/store";
import { studiesOfType } from "@/lib/studies";
import { chartOptions, TV } from "@/lib/theme";
import { timeframeSeconds } from "@/lib/timeframes";
import { isVisibleOnTimeframe } from "@/lib/visibility";
import { formatChartTickMark, formatChartTime } from "@/lib/timezone";
import {
  VolumeColumnsSeries,
  type VolumeColumnData,
} from "@/lib/volume-columns-series";
import type {
  Candle,
  ChartHover,
  ChartPaneState,
  ChartSettings,
  IndicatorId,
  IndicatorInstance,
  IndicatorSettingsMap,
  VolumeIndicatorSettings,
  VolumePlotStyle,
} from "@/types";
import {
  AreaSeries,
  BarSeries,
  BaselineSeries,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  createTextWatermark,
  LineSeries,
  LineStyle,
  PriceScaleMode,
  TickMarkType,
  type ISeriesApi,
  type MouseEventParams,
  type SeriesType,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  pane: ChartPaneState;
  active: boolean;
  /** Hide the main price legend while an indicator pane is focused. */
  showMainLegend?: boolean;
  onSymbolClick?: () => void;
  onCrosshair?: (hover: ChartHover) => void;
  onStudyLayouts?: (layouts: StudyPaneLayout[]) => void;
};

export type StudyPaneLayout = {
  instanceId: string;
  type: StudyPaneId;
  top: number;
  height: number;
};

type LineSeriesApi = ISeriesApi<"Line">;
type BaselineSeriesApi = ISeriesApi<"Baseline">;
type VolumePlotSeriesApi =
  | ISeriesApi<"Custom">
  | ISeriesApi<"Line">
  | ISeriesApi<"Candlestick">;

type EmaSeriesGroup = {
  line: LineSeriesApi;
  upper: LineSeriesApi | null;
  lower: LineSeriesApi | null;
};

type BbSeriesGroup = {
  basis: LineSeriesApi;
  upper: LineSeriesApi;
  lower: LineSeriesApi;
};

type StochSeriesGroup = {
  k: LineSeriesApi;
  d: LineSeriesApi;
  bg: BaselineSeriesApi;
  upper: LineSeriesApi;
  middle: LineSeriesApi;
  lower: LineSeriesApi;
};

type PmoSeriesGroup = {
  pmo: LineSeriesApi;
  signal: LineSeriesApi;
  zero: LineSeriesApi | null;
};

type VolumeSeriesGroup = {
  plot: VolumePlotSeriesApi;
  plotStyle: VolumePlotStyle;
  ma: LineSeriesApi | null;
};

type IndicatorSeriesMaps = {
  volume: Map<string, VolumeSeriesGroup>;
  vwap: Map<string, LineSeriesApi>;
  ema: Map<string, EmaSeriesGroup>;
  bb: Map<string, BbSeriesGroup>;
  rsi: Map<string, LineSeriesApi>;
  stoch: Map<string, StochSeriesGroup>;
  atr: Map<string, LineSeriesApi>;
  adx: Map<string, LineSeriesApi>;
  pmo: Map<string, PmoSeriesGroup>;
};

function createIndicatorSeriesMaps(): IndicatorSeriesMaps {
  return {
    volume: new Map(),
    vwap: new Map(),
    ema: new Map(),
    bb: new Map(),
    rsi: new Map(),
    stoch: new Map(),
    atr: new Map(),
    adx: new Map(),
    pmo: new Map(),
  };
}

function baseStudyIsVisible(study: IndicatorInstance, timeframe: ChartPaneState["timeframe"]) {
  return !study.hidden && isVisibleOnTimeframe(study.settings.visibility, timeframe);
}

function isPaneStudyId(type: IndicatorId): type is StudyPaneId {
  return PANE_INDICATORS.includes(type);
}

function toCandle(c: Candle) {
  return {
    time: c.time as UTCTimestamp,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  };
}

/** Sorted candle lookup — O(log n) instead of a linear scan on every crosshair move. */
function candleAtTime(candles: Candle[], time: number): Candle | undefined {
  const last = candles.at(-1);
  if (last && last.time === time) return last;
  let lo = 0;
  let hi = candles.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const t = candles[mid].time;
    if (t === time) return candles[mid];
    if (t < time) lo = mid + 1;
    else hi = mid - 1;
  }
  return undefined;
}

function volColor(
  c: Candle,
  prev: Candle | undefined,
  up: string,
  down: string,
  basedOnPrevClose: boolean,
) {
  if (basedOnPrevClose && prev) {
    return c.close >= prev.close ? up : down;
  }
  return c.close >= c.open ? up : down;
}

function volumePlotStyle(vol: VolumeIndicatorSettings): VolumePlotStyle {
  return vol.plotStyle === "line" || vol.plotStyle === "candle" ? vol.plotStyle : "histogram";
}

function createVolumePlotSeries(
  chart: ReturnType<typeof createChart>,
  vol: VolumeIndicatorSettings,
  visible: boolean,
) {
  const style = volumePlotStyle(vol);
  const on = visible && vol.volumeVisible;
  if (style === "line") {
    return {
      plot: chart.addSeries(LineSeries, {
        color: vol.upColor,
        lineWidth: 2,
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
        priceLineVisible: false,
        lastValueVisible: Boolean(vol.showScaleValues),
        crosshairMarkerVisible: false,
        visible: on,
      }),
      plotStyle: style,
    } as const;
  }
  if (style === "candle") {
    return {
      plot: chart.addSeries(CandlestickSeries, {
        upColor: vol.upColor,
        downColor: vol.downColor,
        borderVisible: true,
        borderUpColor: vol.upColor,
        borderDownColor: vol.downColor,
        wickVisible: true,
        wickUpColor: vol.upColor,
        wickDownColor: vol.downColor,
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
        priceLineVisible: false,
        lastValueVisible: Boolean(vol.showScaleValues),
        visible: on,
      }),
      plotStyle: style,
    } as const;
  }
  return {
    plot: chart.addCustomSeries(new VolumeColumnsSeries(), {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
      priceLineVisible: false,
      lastValueVisible: Boolean(vol.showScaleValues),
      visible: on,
    }),
    plotStyle: "histogram" as const,
  };
}

function volumePlotData(candles: Candle[], vol: VolumeIndicatorSettings) {
  const style = volumePlotStyle(vol);
  if (style === "line") {
    return candles.map((c) => ({
      time: c.time as UTCTimestamp,
      value: c.volume,
    }));
  }
  if (style === "candle") {
    return candles.map((c, i) => {
      const prev = candles[i - 1];
      const open = prev?.volume ?? c.volume;
      const close = c.volume;
      return {
        time: c.time as UTCTimestamp,
        open,
        high: Math.max(open, close),
        low: Math.min(open, close),
        close,
      };
    });
  }
  return candles.map((c, i) => ({
    time: c.time as UTCTimestamp,
    value: c.volume,
    color: volColor(
      c,
      candles[i - 1],
      vol.upColor,
      vol.downColor,
      vol.colorBasedOnPreviousClose,
    ),
  }));
}

function setVolumePlotData(group: VolumeSeriesGroup, candles: Candle[], vol: VolumeIndicatorSettings) {
  const data = volumePlotData(candles, vol);
  if (group.plotStyle === "line") {
    (group.plot as ISeriesApi<"Line">).setData(data as { time: UTCTimestamp; value: number }[]);
  } else if (group.plotStyle === "candle") {
    (group.plot as ISeriesApi<"Candlestick">).setData(
      data as {
        time: UTCTimestamp;
        open: number;
        high: number;
        low: number;
        close: number;
      }[],
    );
  } else {
    (group.plot as ISeriesApi<"Custom">).setData(data as VolumeColumnData[]);
  }
}

function updateVolumePlotTip(
  group: VolumeSeriesGroup,
  candles: Candle[],
  vol: VolumeIndicatorSettings,
) {
  if (candles.length === 0) return;
  const rawLast = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  if (group.plotStyle === "line") {
    (group.plot as ISeriesApi<"Line">).update({
      time: rawLast.time as UTCTimestamp,
      value: rawLast.volume,
    });
  } else if (group.plotStyle === "candle") {
    const open = prev?.volume ?? rawLast.volume;
    const close = rawLast.volume;
    (group.plot as ISeriesApi<"Candlestick">).update({
      time: rawLast.time as UTCTimestamp,
      open,
      high: Math.max(open, close),
      low: Math.min(open, close),
      close,
    });
  } else {
    (group.plot as ISeriesApi<"Custom">).update({
      time: rawLast.time as UTCTimestamp,
      value: rawLast.volume,
      color: volColor(
        rawLast,
        prev,
        vol.upColor,
        vol.downColor,
        vol.colorBasedOnPreviousClose,
      ),
    } as VolumeColumnData);
  }
}

/** Swap histogram/line/candle constructors when plotStyle changes (same chart). */
function ensureVolumePlotStyle(
  chart: ReturnType<typeof createChart>,
  maps: IndicatorSeriesMaps,
  studyId: string,
  vol: VolumeIndicatorSettings,
  visible: boolean,
): VolumeSeriesGroup | null {
  const group = maps.volume.get(studyId);
  if (!group) return null;
  const nextStyle = volumePlotStyle(vol);
  if (group.plotStyle === nextStyle) return group;
  try {
    chart.removeSeries(group.plot);
  } catch {
    /* ignore */
  }
  const created = createVolumePlotSeries(chart, vol, visible);
  const next: VolumeSeriesGroup = {
    plot: created.plot,
    plotStyle: created.plotStyle,
    ma: group.ma,
  };
  maps.volume.set(studyId, next);
  try {
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
      borderVisible: false,
      visible: false,
    });
  } catch {
    /* ignore */
  }
  return next;
}

function nearPriceBand(
  series: { priceToCoordinate: (price: number) => number | null },
  y: number,
  high: number,
  low: number,
  tol = 8,
) {
  const yH = series.priceToCoordinate(high);
  const yL = series.priceToCoordinate(low);
  if (yH == null || yL == null) return false;
  const top = Math.min(yH, yL) - tol;
  const bot = Math.max(yH, yL) + tol;
  return y >= top && y <= bot;
}

function seriesValueFromParam(
  series: ISeriesApi<SeriesType> | null | undefined,
  param: MouseEventParams,
): number | null {
  if (!series) return null;
  const data = param.seriesData.get(series);
  if (!data) return null;
  if ("value" in data && data.value != null) return data.value;
  if ("close" in data && data.close != null) return data.close;
  return null;
}

function nearSeriesPoint(
  series: ISeriesApi<SeriesType> | null | undefined,
  param: MouseEventParams,
  tol = 7,
) {
  if (!series || !param.point) return false;
  const value = seriesValueFromParam(series, param);
  if (value == null) return false;
  const y = series.priceToCoordinate(value);
  if (y == null) return false;
  return Math.abs(y - param.point.y) <= tol;
}

function nearSeriesValue(
  series: ISeriesApi<SeriesType> | null | undefined,
  y: number,
  value: number | null | undefined,
  tol = 10,
) {
  if (!series || value == null || !Number.isFinite(value)) return false;
  const cy = series.priceToCoordinate(value);
  if (cy == null) return false;
  return Math.abs(cy - y) <= tol;
}

/** Hit-test a volume histogram column as a filled bar, not just the tip. */
function nearHistogramValue(
  series: { priceToCoordinate: (price: number) => number | null } | null | undefined,
  y: number,
  value: number | null | undefined,
  tol = 6,
) {
  if (!series || value == null || !Number.isFinite(value)) return false;
  const yTop = series.priceToCoordinate(value);
  const yBase = series.priceToCoordinate(0);
  if (yTop == null) return false;
  if (yBase == null) return Math.abs(yTop - y) <= tol;
  const top = Math.min(yTop, yBase) - tol;
  const bot = Math.max(yTop, yBase) + tol;
  return y >= top && y <= bot;
}

function nearHistogramBar(
  series: { priceToCoordinate: (price: number) => number | null } | null | undefined,
  param: MouseEventParams,
  tol = 6,
) {
  if (!series || !param.point) return false;
  return nearHistogramValue(series, param.point.y, seriesValueFromParam(series as ISeriesApi<SeriesType>, param), tol);
}

function priceFormatFor(symbol: string, settings: ChartSettings) {
  const precision = resolvePrecision(symbol, settings);
  const minMove = Number((10 ** -precision).toFixed(precision));
  return {
    type: "price" as const,
    precision,
    minMove: minMove > 0 ? minMove : 0.01,
  };
}

/**
 * Overlay series on the main scale must share a minMove fine enough for the
 * symbol (e.g. FX 5dp). Hardcoding precision=2 / minMove=0.01 hides all price
 * ticks on tight ranges where the visible range is smaller than one tick.
 */
function overlayPriceFormat(
  symbol: string,
  chartSettings: ChartSettings,
  studyPrecision: number | "default",
) {
  const precision =
    studyPrecision === "default"
      ? resolvePrecision(symbol, chartSettings)
      : studyPrecision;
  const minMove = Number((10 ** -precision).toFixed(precision));
  return {
    type: "price" as const,
    precision,
    minMove: minMove > 0 ? minMove : 0.01,
  };
}

/** Series constructor kind — only this should force a chart rebuild for style changes. */
function mainSeriesKind(style: ChartSettings["candleStyle"]): string {
  if (style === "bars") return "bars";
  if (style === "line") return "line";
  if (style === "area") return "area";
  if (style === "baseline") return "baseline";
  return "candlestick";
}

type PreservedPaneView = { from: number; to: number; barSpacing: number };
const preservedPaneViews = new Map<string, PreservedPaneView>();

function stashPaneView(paneId: string, chart: { timeScale: () => { getVisibleLogicalRange: () => { from: number; to: number } | null; options: () => { barSpacing?: number } } }) {
  try {
    const range = chart.timeScale().getVisibleLogicalRange();
    if (!range || !Number.isFinite(range.from) || !Number.isFinite(range.to)) return;
    const barSpacing = chart.timeScale().options().barSpacing ?? 7;
    preservedPaneViews.set(paneId, {
      from: range.from,
      to: range.to,
      barSpacing,
    });
  } catch {
    /* ignore */
  }
}

function takePaneView(paneId: string): PreservedPaneView | null {
  const view = preservedPaneViews.get(paneId) ?? null;
  if (view) preservedPaneViews.delete(paneId);
  return view;
}

function addMainSeries(
  chart: ReturnType<typeof createChart>,
  settings: ChartSettings,
  symbol: string,
) {
  const priceFormat = priceFormatFor(symbol, settings);
  const style = settings.candleStyle;
  if (style === "bars") {
    const showLast =
      settings.lastPriceDisplay === "value" || settings.lastPriceDisplay === "value_line";
    const showLine =
      settings.lastPriceDisplay === "line" || settings.lastPriceDisplay === "value_line";
    return chart.addSeries(BarSeries, {
      upColor: settings.bodyUpColor,
      downColor: settings.bodyDownColor,
      lastValueVisible: showLast,
      priceLineVisible: showLine,
      priceLineColor: settings.bodyUpColor,
      priceLineWidth: 1,
      priceLineStyle: LineStyle.Dashed,
      priceFormat,
    });
  }
  if (style === "line") {
    return chart.addSeries(LineSeries, {
      color: settings.bodyUpColor,
      lineWidth: 2,
      lastValueVisible: settings.lastPriceDisplay === "value" || settings.lastPriceDisplay === "value_line",
      priceLineVisible: settings.lastPriceDisplay === "line" || settings.lastPriceDisplay === "value_line",
      priceLineColor: settings.bodyUpColor,
      priceLineWidth: 1,
      priceLineStyle: LineStyle.Dashed,
      priceFormat,
    });
  }
  if (style === "area") {
    return chart.addSeries(AreaSeries, {
      lineColor: "#2962ff",
      topColor: "rgba(41,98,255,0.35)",
      bottomColor: "rgba(41,98,255,0.02)",
      lineWidth: 2,
      lastValueVisible: settings.lastPriceDisplay === "value" || settings.lastPriceDisplay === "value_line",
      priceLineVisible: settings.lastPriceDisplay === "line" || settings.lastPriceDisplay === "value_line",
      priceLineColor: "#2962ff",
      priceLineWidth: 1,
      priceLineStyle: LineStyle.Dashed,
      priceFormat,
    });
  }
  if (style === "baseline") {
    return chart.addSeries(BaselineSeries, {
      topLineColor: "#089981",
      topFillColor1: "rgba(8,153,129,0.28)",
      topFillColor2: "rgba(8,153,129,0.04)",
      bottomLineColor: "#f23645",
      bottomFillColor1: "rgba(242,54,69,0.28)",
      bottomFillColor2: "rgba(242,54,69,0.04)",
      lastValueVisible: settings.lastPriceDisplay === "value" || settings.lastPriceDisplay === "value_line",
      priceLineVisible: settings.lastPriceDisplay === "line" || settings.lastPriceDisplay === "value_line",
      priceLineColor: "#089981",
      priceLineWidth: 1,
      priceLineStyle: LineStyle.Dashed,
      priceFormat,
    });
  }
  const hollow = style === "hollow";
  const showLast =
    settings.lastPriceDisplay === "value" || settings.lastPriceDisplay === "value_line";
  const showLine =
    settings.lastPriceDisplay === "line" || settings.lastPriceDisplay === "value_line";
  return chart.addSeries(CandlestickSeries, {
    upColor: hollow || !settings.bodyVisible ? "rgba(0,0,0,0)" : settings.bodyUpColor,
    downColor: !settings.bodyVisible ? "rgba(0,0,0,0)" : settings.bodyDownColor,
    borderVisible: settings.borderVisible,
    borderUpColor: settings.borderUpColor,
    borderDownColor: settings.borderDownColor,
    wickVisible: settings.wickVisible,
    wickUpColor: settings.wickUpColor,
    wickDownColor: settings.wickDownColor,
    lastValueVisible: showLast,
    priceLineVisible: showLine,
    priceLineColor: settings.borderUpColor,
    priceLineWidth: 1,
    priceLineStyle: LineStyle.Dashed,
    priceFormat,
  });
}

function candleIsUp(c: Candle, prev: Candle | undefined, settings: ChartSettings) {
  if (settings.colorBasedOnPrevClose) {
    return prev ? c.close >= prev.close : c.close >= c.open;
  }
  return c.close >= c.open;
}

function candleColors(
  c: Candle,
  prev: Candle | undefined,
  settings: ChartSettings,
): { color?: string; borderColor?: string; wickColor?: string } {
  const up = candleIsUp(c, prev, settings);
  return {
    color: settings.bodyVisible
      ? up
        ? settings.candleStyle === "hollow"
          ? "rgba(0,0,0,0)"
          : settings.bodyUpColor
        : settings.bodyDownColor
      : "rgba(0,0,0,0)",
    borderColor: settings.borderVisible
      ? up
        ? settings.borderUpColor
        : settings.borderDownColor
      : "rgba(0,0,0,0)",
    wickColor: settings.wickVisible
      ? up
        ? settings.wickUpColor
        : settings.wickDownColor
      : "rgba(0,0,0,0)",
  };
}

/** Visible tone for the live price line / last-value label (never transparent). */
function formingCandleTone(candles: Candle[], settings: ChartSettings): string {
  const last = candles[candles.length - 1];
  if (!last) return settings.borderUpColor || "#b2b5be";
  const prev = candles[candles.length - 2];
  const up = candleIsUp(last, prev, settings);
  if (settings.candleStyle === "hollow" || !settings.bodyVisible) {
    return up ? settings.borderUpColor : settings.borderDownColor;
  }
  return up ? settings.bodyUpColor : settings.bodyDownColor;
}

function formatCountdown(totalSec: number) {
  const sec = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function contrastInk(bg: string) {
  const hex = bg.trim();
  if (hex.startsWith("#") && (hex.length === 7 || hex.length === 4)) {
    const full =
      hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;
    const r = parseInt(full.slice(1, 3), 16);
    const g = parseInt(full.slice(3, 5), 16);
    const b = parseInt(full.slice(5, 7), 16);
    const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luma > 0.55 ? "#000000" : "#ffffff";
  }
  return "#000000";
}

function resolvePrecision(symbol: string, settings: ChartSettings) {
  if (settings.pricePrecision === "default") return getSymbol(symbol).precision;
  return Number(settings.pricePrecision);
}

/** Map the stored priceScaleMode string → LWC PriceScaleMode enum value. */
function resolvePriceScaleMode(settings: ChartSettings): PriceScaleMode {
  // Legacy: logScale boolean still works; priceScaleMode takes precedence when set.
  if (settings.priceScaleMode === "logarithmic" || settings.logScale) return PriceScaleMode.Logarithmic;
  if (settings.priceScaleMode === "percentage") return PriceScaleMode.Percentage;
  if (settings.priceScaleMode === "indexed100") return PriceScaleMode.IndexedTo100;
  return PriceScaleMode.Normal;
}

/** Price-axis / last-price labels — same comma grouping as watchlist `formatPrice`. */
function formatScalePrice(value: number, precision: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

/** Match LWC last-value chip height: fontSize + 2×(2.5/12×fontSize). */
function lastValueLabelHeight(fontSize: number) {
  const pad = (2.5 / 12) * fontSize;
  return fontSize + pad * 2;
}

const LWC_TICK_LEN = 5;
const LWC_BORDER_SIZE = 1;
const LWC_SCALE_FONT = "Trebuchet MS, Roboto, Ubuntu, sans-serif";

let textMeasureCtx: CanvasRenderingContext2D | null | undefined;

/** Match LWC PriceAxisViewRenderer totalWidth for the last-value chip. */
function lastValueLabelWidth(text: string, fontSize: number): number {
  if (textMeasureCtx === undefined) {
    const canvas = document.createElement("canvas");
    textMeasureCtx = canvas.getContext("2d");
  }
  const pad = (fontSize / 12) * LWC_TICK_LEN;
  let textW = text.length * fontSize * 0.55;
  if (textMeasureCtx) {
    textMeasureCtx.font = `${fontSize}px ${LWC_SCALE_FONT}`;
    textW = textMeasureCtx.measureText(text).width;
  }
  return Math.ceil(LWC_BORDER_SIZE + pad + pad + textW + LWC_TICK_LEN);
}

function formatVol(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

export const ChartCanvas = memo(function ChartCanvas({
  pane,
  active,
  showMainLegend = true,
  onSymbolClick,
  onCrosshair,
  onStudyLayouts,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const [legendTooltip, setLegendTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const settings = useAppStore((s) => s.chartSettings);
  const indicatorsHidden = useAppStore((s) => s.indicatorsHidden);
  const focusedPane = useAppStore((s) => s.focusedPane);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  // Dev-only candle-pipeline diagnostics (NEXT_PUBLIC_DEBUG_CANDLES=true).
  // Gated inside the hook; emits a 1Hz overlay from feed lifecycle state,
  // never on chart paints.
  const debug = useCandleDebug(pane.symbol, pane.timeframe);
  const seriesKind = mainSeriesKind(settings.candleStyle);
  const replay = useAppStore((s) => s.replay);
  // Subscribe directly so settings tweaks always re-render this chart.
  const liveStudies = useAppStore(
    (s) => s.panes.find((p) => p.id === pane.id)?.studies ?? pane.studies,
  );
  const studyIsVisible = (study: IndicatorInstance, timeframe: ChartPaneState["timeframe"]) =>
    !indicatorsHidden && baseStudyIsVisible(study, timeframe);
  const applyRef = useRef<(candles: Candle[], fit: boolean) => void>(() => {});
  const onCrosshairRef = useRef(onCrosshair);
  onCrosshairRef.current = onCrosshair;
  const onStudyLayoutsRef = useRef(onStudyLayouts);
  onStudyLayoutsRef.current = onStudyLayouts;
  const indicatorSeries = useRef<IndicatorSeriesMaps>(createIndicatorSeriesMaps());
  const lastToneRef = useRef("#b2b5be");
  const lastPriceRef = useRef<number | null>(null);
  /** Tracks whether paintCountdown has suppressed the native LWC last-value label. */
  const nativeLabelHiddenRef = useRef(false);
  const studiesRef = useRef(liveStudies);
  studiesRef.current = liveStudies;
  // Rebuild only when studies are added/removed/retyped (not for settings tweaks).
  // Volume plotStyle (histogram/line/candle) swaps series in place via ensureVolumePlotStyle.
  const studiesStructureKey = useMemo(
    () => liveStudies.map((s) => `${s.id}:${s.type}`).join("|"),
    [liveStudies],
  );
  const volumePlotStylesKey = useMemo(
    () =>
      liveStudies
        .filter((s) => s.type === "volume")
        .map((s) => `${s.id}:${volumePlotStyle(s.settings as VolumeIndicatorSettings)}`)
        .join("|"),
    [liveStudies],
  );
  const studiesSettingsKey = useMemo(
    () =>
      JSON.stringify(
        liveStudies.map((s) => ({ id: s.id, hidden: s.hidden, settings: s.settings })),
      ) + `:${indicatorsHidden ? "hidden" : "visible"}`,
    [liveStudies, indicatorsHidden],
  );
  const symbolRef = useRef(pane.symbol);
  const timeframeRef = useRef(pane.timeframe);
  symbolRef.current = pane.symbol;
  timeframeRef.current = pane.timeframe;
  /** Swap feed + data without tearing down the Lightweight Charts instance. */
  const swapSymbolRef = useRef<((symbol: string) => void) | null>(null);

  useEffect(() => {
    const legend = legendRef.current;
    if (!legend) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const infoEl = target.closest("[data-legend-status], [data-legend-ohlc], [data-legend-symbol]");
      if (infoEl && legend.contains(infoEl)) {
        e.preventDefault();
        e.stopPropagation();
        const rect = infoEl.getBoundingClientRect();
        const feedStatus = mawsFeed.getKlineStatus(pane.symbol, pane.timeframe);
        const isRecovering = mawsFeed.isKlineRecovering(pane.symbol, pane.timeframe);
        const label = isRecovering
          ? "Reconnecting"
          : feedStatus === "live"
            ? "Live"
            : feedStatus === "delayed"
              ? "Data delayed"
              : feedStatus === "connecting"
                ? "Connecting"
                : "Idle";
        setLegendTooltip({ x: rect.left + rect.width / 2, y: rect.top, text: `Feed: ${label}` });
      }
    };

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".legend")) {
        setLegendTooltip(null);
      }
    };

    legend.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("click", onDocClick);
    return () => {
      legend.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("click", onDocClick);
    };
  }, [pane.symbol, pane.timeframe]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let disposed = false;
    // Snapshot at create time — live tweaks go through applyOptions (no flash).
    const settings = settingsRef.current;
    const precision = resolvePrecision(pane.symbol, settings);
    const leftVisible = settings.scalesPlacement === "left" || settings.scalesPlacement === "both";
    const rightVisible = settings.scalesPlacement === "right" || settings.scalesPlacement === "both";
    const crossStyle =
      settings.crosshairStyle === "solid"
        ? LineStyle.Solid
        : settings.crosshairStyle === "dotted"
          ? LineStyle.Dotted
          : LineStyle.Dashed;
    const topMargin = Math.min(0.4, Math.max(0, settings.marginTop / 100));
    const bottomMargin = Math.min(0.4, Math.max(0, settings.marginBottom / 100));
    const chart = createChart(el, {
      ...chartOptions,
      layout: {
        ...chartOptions.layout,
        // Transparent so drawing tools behind the canvas remain visible;
        // candle bodies still paint opaque on top.
        background: { type: ColorType.Solid, color: "rgba(0,0,0,0)" },
        textColor: settings.scaleTextColor,
        fontSize: settings.scaleFontSize,
        panes: {
          separatorColor: settings.paneSeparatorColor,
          separatorHoverColor: "#3a3a3a",
          enableResize: true,
        },
      },
      grid: {
        vertLines: { visible: settings.vertGrid, color: settings.vertGridColor },
        horzLines: { visible: settings.grid, color: settings.horzGridColor },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: settings.crosshairColor,
          width: 1,
          style: crossStyle,
          labelBackgroundColor: TV.active,
        },
        horzLine: {
          color: settings.crosshairColor,
          width: 1,
          style: crossStyle,
          labelBackgroundColor: TV.active,
        },
      },
      leftPriceScale: {
        visible: leftVisible,
        borderColor: settings.scaleLineColor,
        invertScale: settings.invertScale,
      },
      rightPriceScale: {
        visible: rightVisible,
        borderColor: settings.scaleLineColor,
        scaleMargins: { top: topMargin, bottom: bottomMargin },
        invertScale: settings.invertScale,
      },
      localization: {
        priceFormatter: (p: number) => formatScalePrice(p, precision),
        timeFormatter: (time: Time) => {
          const unix =
            typeof time === "number"
              ? time
              : typeof time === "string"
                ? Math.floor(Date.parse(time) / 1000)
                : Math.floor(Date.UTC(time.year, time.month - 1, time.day) / 1000);
          return formatChartTime(unix, settings.timezone, settings.timeHoursFormat);
        },
      },
      timeScale: {
        ...chartOptions.timeScale,
        borderColor: settings.scaleLineColor,
        rightOffset: settings.marginRightBars,
        // Keep the live tip pinned when a new candle opens (TradingView-style).
        shiftVisibleRangeOnNewBar: true,
        tickMarkFormatter: (time: Time, tickMarkType: TickMarkType) => {
          const unix =
            typeof time === "number"
              ? time
              : typeof time === "string"
                ? Math.floor(Date.parse(time) / 1000)
                : Math.floor(Date.UTC(time.year, time.month - 1, time.day) / 1000);
          return formatChartTickMark(
            unix,
            settings.timezone,
            settings.timeHoursFormat,
            tickMarkType,
          );
        },
      },
    });

    const main = addMainSeries(chart, settings, pane.symbol);
    const lineLike = isLineStyle(settings.candleStyle);
    // Always start with auto-scale so live Binance prices aren't clipped by a
    // frozen range left over from mock data or a prior symbol.
    chart.priceScale("right").applyOptions({
      mode: resolvePriceScaleMode(settings),
      autoScale: !settings.lockPriceRatio,
      invertScale: settings.invertScale,
    });
    if (leftVisible) {
      chart.priceScale("left").applyOptions({
        mode: resolvePriceScaleMode(settings),
        autoScale: !settings.lockPriceRatio,
        invertScale: settings.invertScale,
      });
    }

    const seriesMaps = createIndicatorSeriesMaps();
    const studiesAtCreate = studiesRef.current;
    const paneStudies = studiesAtCreate.filter(
      (study): study is IndicatorInstance & { type: StudyPaneId } => isPaneStudyId(study.type),
    );

    for (const study of studiesAtCreate) {
      const visible = studyIsVisible(study, pane.timeframe);
      if (OVERLAY_INDICATORS.includes(study.type)) {
        if (study.type === "volume") {
          const vol = study.settings as IndicatorSettingsMap["volume"];
          const { plot, plotStyle } = createVolumePlotSeries(chart, vol, visible);
          let ma: LineSeriesApi | null = null;
          if (vol.maVisible || vol.maLength > 0) {
            const look = lineAppearance({
              color: vol.maColor,
              opacity: vol.maOpacity,
              lineWidth: vol.maLineWidth,
              lineStyle: vol.maLineStyle,
            });
            ma = chart.addSeries(LineSeries, {
              color: look.color,
              lineWidth: look.lineWidth,
              lineStyle: look.lineStyle,
              priceScaleId: "volume",
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: false,
              visible: visible && vol.maVisible,
              priceFormat: { type: "volume" },
            });
          }
          seriesMaps.volume.set(study.id, { plot, plotStyle, ma });
          chart.priceScale("volume").applyOptions({
            scaleMargins: { top: 0.82, bottom: 0 },
            borderVisible: false,
            visible: false,
          });
        } else if (study.type === "vwap") {
          const vwap = study.settings as IndicatorSettingsMap["vwap"];
          const vwapFormat = overlayPriceFormat(pane.symbol, settings, vwap.precision);
          const look = lineAppearance(vwap);
          const vwapOn = visible && vwap.visible !== false;
          const vwapSeries = chart.addSeries(LineSeries, {
            color: look.color,
            lineWidth: look.lineWidth,
            lineStyle: look.lineStyle,
            priceLineVisible: false,
            lastValueVisible: Boolean(vwap.showScaleValues),
            crosshairMarkerVisible: false,
            visible: vwapOn,
            priceFormat: vwapFormat,
          });
          seriesMaps.vwap.set(study.id, vwapSeries);
        } else if (study.type === "ema") {
          const ema = study.settings as IndicatorSettingsMap["ema"];
          const emaFormat = overlayPriceFormat(pane.symbol, settings, ema.precision);
          const look = lineAppearance(ema);
          const emaOn = visible && ema.visible !== false;
          const line = chart.addSeries(LineSeries, {
            color: look.color,
            lineWidth: look.lineWidth,
            lineStyle: look.lineStyle,
            priceLineVisible: false,
            lastValueVisible: Boolean(ema.showScaleValues),
            crosshairMarkerVisible: false,
            visible: emaOn,
            priceFormat: emaFormat,
          });
          let upper: LineSeriesApi | null = null;
          let lower: LineSeriesApi | null = null;
          if (ema.smoothingType !== "none" && ema.bbStdDev > 0) {
            upper = chart.addSeries(LineSeries, {
              color: applyColorOpacity(ema.color, 45),
              lineWidth: 1,
              lineStyle: LineStyle.Dashed,
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: false,
              visible: emaOn,
              priceFormat: emaFormat,
            });
            lower = chart.addSeries(LineSeries, {
              color: applyColorOpacity(ema.color, 45),
              lineWidth: 1,
              lineStyle: LineStyle.Dashed,
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: false,
              visible: emaOn,
              priceFormat: emaFormat,
            });
          }
          seriesMaps.ema.set(study.id, { line, upper, lower });
        } else if (study.type === "bb") {
          const bb = study.settings as IndicatorSettingsMap["bb"];
          const bbFormat = overlayPriceFormat(pane.symbol, settings, bb.precision);
          const scaleOn = Boolean(bb.showScaleValues);
          const basisLook = lineAppearance(bb.basis);
          const upperLook = lineAppearance(bb.upper);
          const lowerLook = lineAppearance(bb.lower);
          const basis = chart.addSeries(LineSeries, {
            color: basisLook.color,
            lineWidth: basisLook.lineWidth,
            lineStyle: basisLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: scaleOn && bb.basisVisible,
            crosshairMarkerVisible: false,
            visible: visible && bb.basisVisible,
            priceFormat: bbFormat,
            // Keep BB from fighting candle autoscale / covering price action.
            autoscaleInfoProvider: () => null,
          });
          const upper = chart.addSeries(LineSeries, {
            color: upperLook.color,
            lineWidth: upperLook.lineWidth,
            lineStyle: upperLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: scaleOn && bb.upperVisible,
            crosshairMarkerVisible: false,
            visible: visible && bb.upperVisible,
            priceFormat: bbFormat,
            autoscaleInfoProvider: () => null,
          });
          const lower = chart.addSeries(LineSeries, {
            color: lowerLook.color,
            lineWidth: lowerLook.lineWidth,
            lineStyle: lowerLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: scaleOn && bb.lowerVisible,
            crosshairMarkerVisible: false,
            visible: visible && bb.lowerVisible,
            priceFormat: bbFormat,
            autoscaleInfoProvider: () => null,
          });
          seriesMaps.bb.set(study.id, { basis, upper, lower });
        }
        continue;
      }

      const paneIndex = paneStudies.findIndex((s) => s.id === study.id) + 1;
      if (paneIndex <= 0) continue;

      if (study.type === "rsi") {
        const rsi = study.settings as IndicatorSettingsMap["rsi"];
        const rsiLook = lineAppearance(rsi);
        const rsiSeries = chart.addSeries(
          LineSeries,
          {
            color: rsiLook.color,
            lineWidth: rsiLook.lineWidth,
            lineStyle: rsiLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: true,
            visible,
          },
          paneIndex,
        );
        rsiSeries.createPriceLine({
          price: rsi.upperLevel,
          color: TV.faint,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: false,
        });
        rsiSeries.createPriceLine({
          price: rsi.lowerLevel,
          color: TV.faint,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: false,
        });
        seriesMaps.rsi.set(study.id, rsiSeries);
      } else if (study.type === "stoch") {
        const stoch = study.settings as IndicatorSettingsMap["stoch"];
        const stochPrecision = stoch.precision === "default" ? 2 : stoch.precision;
        const stochFormat = {
          type: "price" as const,
          precision: stochPrecision,
          minMove: Number((10 ** -stochPrecision).toFixed(stochPrecision)),
        };
        const lo = Math.min(stoch.upper.level, stoch.lower.level);
        const stochOn = visible;
        const bg = chart.addSeries(
          BaselineSeries,
          {
            baseValue: { type: "price", price: lo },
            topLineColor: "rgba(0,0,0,0)",
            topFillColor1: applyColorOpacity(stoch.backgroundColor, stoch.backgroundOpacity),
            topFillColor2: applyColorOpacity(stoch.backgroundColor, stoch.backgroundOpacity),
            bottomLineColor: "rgba(0,0,0,0)",
            bottomFillColor1: "rgba(0,0,0,0)",
            bottomFillColor2: "rgba(0,0,0,0)",
            lineWidth: 1,
            lastValueVisible: false,
            priceLineVisible: false,
            crosshairMarkerVisible: false,
            visible: stochOn && stoch.backgroundVisible,
            priceFormat: stochFormat,
          },
          paneIndex,
        );
        const kLook = lineAppearance(stoch.k);
        const dLook = lineAppearance(stoch.d);
        const k = chart.addSeries(
          LineSeries,
          {
            color: kLook.color,
            lineWidth: kLook.lineWidth,
            lineStyle: kLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: Boolean(stoch.showScaleValues),
            visible: stochOn && stoch.kVisible !== false,
            priceFormat: stochFormat,
          },
          paneIndex,
        );
        const d = chart.addSeries(
          LineSeries,
          {
            color: dLook.color,
            lineWidth: dLook.lineWidth,
            lineStyle: dLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: Boolean(stoch.showScaleValues),
            visible: stochOn && stoch.dVisible !== false,
            priceFormat: stochFormat,
          },
          paneIndex,
        );
        const addBandSeries = (band: typeof stoch.upper) => {
          const look = lineAppearance(band);
          return chart.addSeries(
            LineSeries,
            {
              color: look.color,
              lineWidth: look.lineWidth,
              lineStyle: look.lineStyle,
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: false,
              visible: stochOn && band.visible,
              priceFormat: stochFormat,
            },
            paneIndex,
          );
        };
        seriesMaps.stoch.set(study.id, {
          k,
          d,
          bg,
          upper: addBandSeries(stoch.upper),
          middle: addBandSeries(stoch.middle),
          lower: addBandSeries(stoch.lower),
        });
      } else if (study.type === "atr") {
        const atr = study.settings as IndicatorSettingsMap["atr"];
        const atrLook = lineAppearance(atr);
        const atrSeries = chart.addSeries(
          LineSeries,
          {
            color: atrLook.color,
            lineWidth: atrLook.lineWidth,
            lineStyle: atrLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: true,
            visible,
          },
          paneIndex,
        );
        seriesMaps.atr.set(study.id, atrSeries);
      } else if (study.type === "adx") {
        const adx = study.settings as IndicatorSettingsMap["adx"];
        const adxLook = lineAppearance(adx);
        const adxSeries = chart.addSeries(
          LineSeries,
          {
            color: adxLook.color,
            lineWidth: adxLook.lineWidth,
            lineStyle: adxLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: adx.showScaleValues !== false,
            visible,
          },
          paneIndex,
        );
        seriesMaps.adx.set(study.id, adxSeries);
      } else if (study.type === "pmo") {
        const pmo = study.settings as IndicatorSettingsMap["pmo"];
        const pmoPrecision = pmo.precision === "default" ? 2 : pmo.precision;
        const pmoFormat = {
          type: "price" as const,
          precision: pmoPrecision,
          minMove: Number((10 ** -pmoPrecision).toFixed(pmoPrecision)),
        };
        const pmoOn = visible;
        const pmoLook = lineAppearance(pmo.pmo);
        const signalLook = lineAppearance(pmo.signal);

        const pmoSeries = chart.addSeries(
          LineSeries,
          {
            color: pmoLook.color,
            lineWidth: pmoLook.lineWidth,
            lineStyle: pmoLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: Boolean(pmo.showScaleValues),
            visible: pmoOn && pmo.pmoVisible,
            priceFormat: pmoFormat,
          },
          paneIndex,
        );

        const signalSeries = chart.addSeries(
          LineSeries,
          {
            color: signalLook.color,
            lineWidth: signalLook.lineWidth,
            lineStyle: signalLook.lineStyle,
            priceLineVisible: false,
            lastValueVisible: Boolean(pmo.showScaleValues),
            visible: pmoOn && pmo.signalVisible,
            priceFormat: pmoFormat,
          },
          paneIndex,
        );

        let zeroSeries: LineSeriesApi | null = null;
        if (pmo.zeroLine.visible) {
          const zeroLook = lineAppearance(pmo.zeroLine);
          zeroSeries = chart.addSeries(
            LineSeries,
            {
              color: zeroLook.color,
              lineWidth: zeroLook.lineWidth,
              lineStyle: zeroLook.lineStyle,
              priceLineVisible: false,
              lastValueVisible: false,
              crosshairMarkerVisible: false,
              visible: pmoOn,
              priceFormat: pmoFormat,
            },
            paneIndex,
          );
        }

        seriesMaps.pmo.set(study.id, { pmo: pmoSeries, signal: signalSeries, zero: zeroSeries });
      }
    }

    // Candles always paint above overlay studies on the main pane.
    try {
      main.setSeriesOrder(10_000);
    } catch {
      /* ignore */
    }

    const panes = chart.panes();
    const savedStretch = useAppStore.getState().paneStretchFactors[pane.id];
    panes[0]?.setStretchFactor(
      savedStretch?.main ?? (paneStudies.length > 0 ? 3 : 1),
    );
    for (let i = 0; i < paneStudies.length; i++) {
      const study = paneStudies[i];
      const factor = savedStretch?.byStudyId[study.id] ?? 0.7;
      panes[i + 1]?.setStretchFactor(factor);
    }

    const persistStretchFactors = () => {
      const chartPanes = chart.panes();
      if (!chartPanes.length) return;
      const byStudyId: Record<string, number> = {};
      for (let i = 0; i < paneStudies.length; i++) {
        const study = paneStudies[i];
        const api = chartPanes[i + 1];
        if (!api) continue;
        try {
          byStudyId[study.id] = api.getStretchFactor();
        } catch {
          byStudyId[study.id] = 0.7;
        }
      }
      let main = paneStudies.length > 0 ? 3 : 1;
      try {
        main = chartPanes[0]?.getStretchFactor() ?? main;
      } catch {
        /* ignore */
      }
      useAppStore.getState().setPaneStretchFactors(pane.id, { main, byStudyId });
    };

    const publishStudyLayouts = () => {
      const wrap = wrapRef.current;
      if (!wrap) {
        onStudyLayoutsRef.current?.([]);
        return;
      }
      const wrapTop = wrap.getBoundingClientRect().top;
      const chartPanes = chart.panes();
      const layouts: StudyPaneLayout[] = [];
      let idx = 1;
      const pushStudy = (study: IndicatorInstance & { type: StudyPaneId }) => {
        if (!chartPanes[idx]) return;
        const host = chartPanes[idx].getHTMLElement();
        if (host) {
          const r = host.getBoundingClientRect();
          layouts.push({
            instanceId: study.id,
            type: study.type,
            top: r.top - wrapTop,
            height: r.height,
          });
        } else {
          const prev = layouts.at(-1);
          const top = prev
            ? prev.top + prev.height + 1
            : (chartPanes[0]?.getHeight() ?? 0) + 1;
          layouts.push({
            instanceId: study.id,
            type: study.type,
            top,
            height: chartPanes[idx].getHeight(),
          });
        }
        idx += 1;
      };
      for (const study of paneStudies) pushStudy(study);
      onStudyLayoutsRef.current?.(layouts);
    };

    let layoutRaf = 0;
    const scheduleStudyLayouts = () => {
      if (layoutRaf) return;
      layoutRaf = requestAnimationFrame(() => {
        layoutRaf = 0;
        publishStudyLayouts();
      });
    };

    const observePaneHosts = () => {
      for (const p of chart.panes()) {
        const host = p.getHTMLElement();
        if (host) paneRo.observe(host);
      }
    };

    /** Deferred rAFs touching the chart — cancelled in cleanup (dispose race). */
    const deferRafs: number[] = [];

    // Two-frame defer so LWC finishes first layout before we publish.
    // The INNER callback calls chart.panes(), which throws "Object is
    // disposed" if it lands after chart.remove() (rapid timeframe switches).
    // The outer id is cancelled in cleanup; the inner one is guarded by
    // `disposed` because its id isn't knowable until it fires.
    deferRafs.push(
      requestAnimationFrame(() => {
        deferRafs.push(
          requestAnimationFrame(() => {
            if (disposed) return; // chart removed mid-defer (TF switch)
            publishStudyLayouts();
            observePaneHosts();
          }),
        );
      }),
    );

    const ro = new ResizeObserver(() => {
      scheduleStudyLayouts();
      // Non-force: never collapse scales to 0 (that causes a visible stutter).
      schedulePriceScaleWidthSync(false);
    });
    const paneRo = new ResizeObserver(() => scheduleStudyLayouts());
    ro.observe(el);
    observePaneHosts();

    // Pane separator drag does not resize the chart host — ResizeObserver on
    // pane hosts covers that. Do NOT republish layouts on every chart pan
    // pointermove (that caused React + legend O(n) work at ~pan-framerate).
    let pointerDown = false;
    const onPanePointerDown = () => {
      pointerDown = true;
    };
    const onPanePointerUp = () => {
      if (!pointerDown) return;
      pointerDown = false;
      // One layout pass after interaction (separator / resize edge cases).
      scheduleStudyLayouts();
      // Focus dimensions are temporary and must never replace the saved layout.
      if (useAppStore.getState().focusedPane?.chartPaneId === pane.id) return;
      persistStretchFactors();
    };
    el.addEventListener("pointerdown", onPanePointerDown);
    window.addEventListener("pointerup", onPanePointerUp);
    window.addEventListener("pointercancel", onPanePointerUp);

    const nearestBarIdx = (candles: Candle[], t: number) => {
      if (!candles.length) return -1;
      let best = 0;
      let bestD = Math.abs(candles[0].time - t);
      for (let i = 1; i < candles.length; i++) {
        const d = Math.abs(candles[i].time - t);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      const barSec = timeframeSeconds(pane.timeframe);
      if (bestD > Math.max(barSec, 1) * 1.1) return -1;
      return best;
    };

    const hitTestIndicator = (clientX: number, clientY: number): string | null => {
      const wrap = wrapRef.current;
      if (!wrap) return null;
      const rect = wrap.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

      const rightW = Math.max(chart.priceScale("right").width(), 0);
      if (x > rect.width - rightW - 4) return null;

      const time = chart.timeScale().coordinateToTime(x as never);
      if (time == null) return null;
      const t = typeof time === "number" ? time : Number(time);
      if (!Number.isFinite(t)) return null;

      const candles = mawsFeed.getCandles(symbolRef.current, timeframeRef.current);
      const barIdx = nearestBarIdx(candles, t);
      if (barIdx < 0) return null;

      const chartPanes = chart.panes();
      let paneIdx = 0;
      let paneTop = 0;
      let acc = 0;
      for (let i = 0; i < chartPanes.length; i++) {
        const h = chartPanes[i].getHeight();
        if (y < acc + h) {
          paneIdx = i;
          paneTop = acc;
          break;
        }
        acc += h;
        paneIdx = i;
        paneTop = acc - h;
      }

      const nearLine = (
        series: ISeriesApi<SeriesType> | null,
        value: number | null | undefined,
        tol = 16,
      ) => {
        if (!series || value == null || !Number.isFinite(value)) return false;
        const cy = series.priceToCoordinate(value);
        if (cy == null) return false;
        return Math.abs(cy - y) <= tol || Math.abs(cy - (y - paneTop)) <= tol;
      };

      if (paneIdx === 0) {
        for (const study of studiesOfType(pane.studies, "ema")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const settings = study.settings as IndicatorSettingsMap["ema"];
          if (settings.visible === false) continue;
          const series = seriesMaps.ema.get(study.id);
          if (!series) continue;
          const plot = computeEmaPlot(candles, settings);
          if (nearLine(series.line, plot.line[barIdx], 14)) return study.id;
          if (nearLine(series.upper, plot.upper?.[barIdx], 14)) return study.id;
          if (nearLine(series.lower, plot.lower?.[barIdx], 14)) return study.id;
        }
        for (const study of studiesOfType(pane.studies, "bb")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const settings = study.settings as IndicatorSettingsMap["bb"];
          const series = seriesMaps.bb.get(study.id);
          if (!series) continue;
          const bands = computeBbPlot(candles, settings);
          if (settings.basisVisible && nearLine(series.basis, bands.basis[barIdx], 14)) {
            return study.id;
          }
          if (settings.upperVisible && nearLine(series.upper, bands.upper[barIdx], 14)) {
            return study.id;
          }
          if (settings.lowerVisible && nearLine(series.lower, bands.lower[barIdx], 14)) {
            return study.id;
          }
        }
        for (const study of studiesOfType(pane.studies, "vwap")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const settings = study.settings as IndicatorSettingsMap["vwap"];
          if (settings.visible === false) continue;
          const series = seriesMaps.vwap.get(study.id);
          if (!series) continue;
          const v = computeVwapPlot(candles, settings, pane.timeframe)[barIdx];
          if (nearLine(series, v, 16)) return study.id;
        }
        for (const study of studiesOfType(pane.studies, "volume")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const settings = study.settings as IndicatorSettingsMap["volume"];
          const series = seriesMaps.volume.get(study.id);
          if (!series) continue;
          if (settings.volumeVisible) {
            const v = candles[barIdx].volume;
            const yTop = series.plot.priceToCoordinate(v);
            const yBase = series.plot.priceToCoordinate(0);
            if (yTop != null) {
              if (series.plotStyle === "histogram" && yBase != null) {
                const top = Math.min(yTop, yBase) - 6;
                const bot = Math.max(yTop, yBase) + 6;
                if (y >= top && y <= bot) return study.id;
              } else if (Math.abs(yTop - y) <= 16) {
                return study.id;
              }
            }
          }
          if (settings.maVisible && series.ma) {
            const maVals = computeVolumeMa(candles, settings.maLength);
            if (nearLine(series.ma, maVals[barIdx], 14)) return study.id;
          }
        }
        return null;
      }

      const study = paneStudies[paneIdx - 1];
      if (!study || !studyIsVisible(study, pane.timeframe)) return null;
      if (study.type === "rsi") {
        const series = seriesMaps.rsi.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["rsi"];
          const v = computeRsi(candles, settings.period)[barIdx];
          if (nearLine(series, v, 14)) return study.id;
        }
      } else if (study.type === "stoch") {
        const series = seriesMaps.stoch.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["stoch"];
          const { k, d } = computeStochastic(
            candles,
            settings.length,
            settings.kSmoothing,
            settings.dSmoothing,
          );
          if (settings.kVisible !== false && nearLine(series.k, k[barIdx], 12)) {
            return study.id;
          }
          if (settings.dVisible !== false && nearLine(series.d, d[barIdx], 12)) {
            return study.id;
          }
        }
      } else if (study.type === "atr") {
        const series = seriesMaps.atr.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["atr"];
          const v = computeAtr(candles, settings.period)[barIdx];
          if (nearLine(series, v, 14)) return study.id;
        }
      } else if (study.type === "adx") {
        const series = seriesMaps.adx.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["adx"];
          const v = computeAdx(candles, settings.period)[barIdx];
          if (nearLine(series, v, 14)) return study.id;
        }
      } else if (study.type === "pmo") {
        const group = seriesMaps.pmo.get(study.id);
        if (group) {
          const settings = study.settings as IndicatorSettingsMap["pmo"];
          const { pmo, signal } = computePmo(
            candles,
            settings.period1,
            settings.period2,
            settings.signalPeriod,
            settings.source,
          );
          const pmoV = pmo[barIdx];
          const sigV = signal[barIdx];
          if (nearLine(group.pmo, pmoV, 14)) return study.id;
          if (nearLine(group.signal, sigV, 14)) return study.id;
        }
      }
      return null;
    };

    const chartHandle: ChartHandle = { chart, series: main, hitTestIndicator };
    registerChart(pane.id, chartHandle);
    indicatorSeries.current = seriesMaps;

    const setMainData = (candles: Candle[]) => {
      chartHandle.candles = candles;
      const settings = settingsRef.current;
      if (lineLike) {
        (main as ISeriesApi<"Line">).setData(
          candles.map((c) => ({ time: c.time as UTCTimestamp, value: c.close })),
        );
      } else if (settings.candleStyle === "bars") {
        (main as ISeriesApi<"Bar">).setData(candles.map(toCandle));
      } else {
        (main as ISeriesApi<"Candlestick">).setData(
          candles.map((c, i) => ({
            ...toCandle(c),
            ...candleColors(c, candles[i - 1], settings),
          })),
        );
      }
    };

    const paintCountdown = () => {
      const el = countdownRef.current;
      if (!el || disposed) return;
      const settings = settingsRef.current;
      const showValue =
        settings.lastPriceDisplay === "value" || settings.lastPriceDisplay === "value_line";

      if (!settings.countdownToBarClose) {
        el.style.display = "none";
        // Restore native label if we previously hid it.
        if (nativeLabelHiddenRef.current) {
          nativeLabelHiddenRef.current = false;
          main.applyOptions({ lastValueVisible: showValue });
        }
        return;
      }
      const candles = mawsFeed.getCandles(symbolRef.current, timeframeRef.current);
      const last = candles.at(-1);
      const price = lastPriceRef.current ?? last?.close;
      if (!last || price == null) {
        el.style.display = "none";
        return;
      }
      const y = main.priceToCoordinate(price);
      if (y == null) {
        el.style.display = "none";
        return;
      }

      // Hide only if the price coordinate is scrolled completely out of the vertical viewport.
      const clientH = wrapRef.current?.clientHeight ?? 0;
      if (clientH > 0 && (y < -40 || y > clientH + 40)) {
        el.style.display = "none";
        return;
      }

      // Suppress native LWC price label — we render it ourselves in the combined pill.
      if (showValue && !nativeLabelHiddenRef.current) {
        nativeLabelHiddenRef.current = true;
        main.applyOptions({ lastValueVisible: false });
      }

      const onLeft = settings.scalesPlacement === "left";
      const seconds = timeframeSeconds(timeframeRef.current);
      const closeAt = last.time + seconds;
      const remaining = closeAt - Math.floor(Date.now() / 1000);
      const tone = lastToneRef.current;
      const cdText = formatCountdown(remaining);
      const fontSize = settings.scaleFontSize;
      const priceText = showValue
        ? formatScalePrice(price, resolvePrecision(symbolRef.current, settings))
        : "";
      const cdFontSize = 12;
      // Chip width accommodates whichever row is wider.
      const priceChipW = showValue ? lastValueLabelWidth(priceText, fontSize) : 0;
      const cdChipW = lastValueLabelWidth(cdText, cdFontSize);
      const chipW = Math.max(priceChipW, cdChipW);

      // Align the price row directly on the price line y (not the center of the double pill).
      // The countdown row extends neatly downwards from the price chip.
      const priceRowH = showValue ? lastValueLabelHeight(fontSize) : 0;
      const cdRowH = Math.round(cdFontSize * 1.25);
      const top = showValue ? y - priceRowH / 2 : y - cdRowH / 2;

      // Position pill flush on the left edge of the price scale (not pinned to the right outer edge).
      const rawScaleW = chart.priceScale(onLeft ? "left" : "right").width();
      const scaleW = rawScaleW > 0 ? rawScaleW : 65;
      const wrapW = wrapRef.current?.clientWidth ?? 0;
      const pillLeft = onLeft ? 0 : Math.max(0, wrapW - scaleW);

      // Skip style thrash when nothing visible changed (huge win while panning).
      if (
        el.style.display === "flex" &&
        countdownCache.y === y &&
        countdownCache.top === top &&
        countdownCache.chipW === chipW &&
        countdownCache.cdText === cdText &&
        countdownCache.priceText === priceText &&
        countdownCache.tone === tone &&
        countdownCache.pillLeft === pillLeft &&
        countdownCache.showValue === showValue
      ) {
        return;
      }
      countdownCache = { y, top, chipW, cdText, priceText, tone, pillLeft, showValue };

      el.style.display = "flex";
      el.style.left = `${pillLeft}px`;
      el.style.right = "auto";
      el.style.width = `${chipW}px`;
      el.style.background = tone;
      el.style.color = contrastInk(tone);
      el.style.top = `${top}px`;

      // Update child spans.
      const priceEl = el.firstElementChild as HTMLElement | null;
      const cdEl = el.lastElementChild as HTMLElement | null;
      if (priceEl && cdEl) {
        if (showValue) {
          priceEl.style.display = "block";
          priceEl.style.height = `${priceRowH}px`;
          priceEl.style.lineHeight = `${priceRowH}px`;
          priceEl.style.fontSize = `${fontSize}px`;
          priceEl.style.fontWeight = "600";
          if (priceEl.textContent !== priceText) priceEl.textContent = priceText;
        } else {
          priceEl.style.display = "none";
        }
        cdEl.style.height = `${cdRowH}px`;
        cdEl.style.lineHeight = `${cdRowH}px`;
        cdEl.style.fontSize = `${cdFontSize}px`;
        cdEl.style.fontWeight = "bold";
        cdEl.style.opacity = "0.7";
        cdEl.style.borderTop = "none";
        if (cdEl.textContent !== cdText) cdEl.textContent = cdText;
      }
    };

    let countdownCache = {
      y: NaN,
      top: NaN,
      chipW: -1,
      cdText: "",
      priceText: "",
      tone: "",
      pillLeft: -1,
      showValue: false,
    };

    const DEFAULT_VISIBLE_BARS = 120;
    const MIN_BARS_TO_FRAME = 40;
    let viewFramed = false;
    let lastBarTime = -1;
    let lastBarCount = 0;

    /** TradingView-style: finalize prior bar, then tip — one stream, one painter. */
    const paintLive = (candles: Candle[]) => {
      if (disposed || candles.length === 0) return;
      const settings = settingsRef.current;
      const styled = styleCandles(candles, settings.candleStyle);
      const last = styled.at(-1)!;
      const prev = styled.at(-2);
      const prevPrev = styled.at(-3);

      const pushBar = (c: Candle, p: Candle | undefined) => {
        if (lineLike) {
          (main as ISeriesApi<"Line">).update({
            time: c.time as UTCTimestamp,
            value: c.close,
          });
          return;
        }
        if (settings.candleStyle === "bars") {
          (main as ISeriesApi<"Bar">).update(toCandle(c));
          return;
        }
        (main as ISeriesApi<"Candlestick">).update({
          ...toCandle(c),
          ...candleColors(c, p, settings),
        });
      };

      if (last.time !== lastBarTime) {
        if (prev) pushBar(prev, prevPrev);
        pushBar(last, prev);
        lastBarTime = last.time;
        lastBarCount = candles.length;
      } else {
        pushBar(last, prev);
        lastBarCount = candles.length;
      }

      const rawLast = candles.at(-1)!;
      const tone = formingCandleTone(styled, settings);
      lastToneRef.current = tone;
      lastPriceRef.current = last.close;
      main.applyOptions({ priceLineColor: tone });
      for (const study of studiesOfType(studiesRef.current, "volume")) {
        const volume = study.settings as IndicatorSettingsMap["volume"];
        const beforeStyle = seriesMaps.volume.get(study.id)?.plotStyle;
        const series = ensureVolumePlotStyle(
          chart,
          seriesMaps,
          study.id,
          volume,
          studyIsVisible(study, pane.timeframe),
        );
        if (!series) continue;
        // After a constructor swap, tip-update is invalid — reload the series.
        if (beforeStyle !== series.plotStyle) {
          setVolumePlotData(series, candles, volume);
        } else {
          updateVolumePlotTip(series, candles, volume);
        }
        if (series.ma) {
          const lastMa = computeVolumeMaLast(candles, volume.maLength);
          if (lastMa != null) {
            series.ma.update({ time: rawLast.time as UTCTimestamp, value: lastMa });
          }
        }
      }
      writeLegend(rawLast, candles);
      try {
        paintCountdown();
      } catch {
        /* ignore */
      }
    };

    /** TV-like default: fixed bar width + last N bars (never fitContent on sparse data). */
    const frameRecentBars = (count: number) => {
      const right = settings.marginRightBars;
      const barSpacing = chartOptions.timeScale?.barSpacing ?? 7;
      const ts = chart.timeScale();
      ts.applyOptions({ barSpacing, rightOffset: right });
      if (count <= 0) return;
      ts.setVisibleLogicalRange({
        from: Math.max(-0.5, count - DEFAULT_VISIBLE_BARS),
        to: count - 1 + Math.max(2, right * 0.35),
      });
      viewFramed = true;
    };

    const applyFull = (candles: Candle[], fit: boolean) => {
      if (disposed || candles.length === 0) return;
      const settings = settingsRef.current;
      const styled = styleCandles(candles, settings.candleStyle);
      setMainData(styled);
      lastBarTime = styled.at(-1)?.time ?? lastBarTime;
      lastBarCount = candles.length;
      const showLast =
        (settings.lastPriceDisplay === "value" || settings.lastPriceDisplay === "value_line") &&
        !nativeLabelHiddenRef.current;
      const showLine =
        settings.lastPriceDisplay === "line" || settings.lastPriceDisplay === "value_line";
      const tone = formingCandleTone(styled, settings);
      lastToneRef.current = tone;
      lastPriceRef.current = styled.at(-1)?.close ?? null;
      main.applyOptions({
        lastValueVisible: showLast,
        priceLineVisible: showLine,
        priceLineColor: tone,
        priceLineWidth: 1,
        priceLineStyle: LineStyle.Dashed,
      });
      for (const study of studiesOfType(studiesRef.current, "volume")) {
        const volume = study.settings as IndicatorSettingsMap["volume"];
        const series = ensureVolumePlotStyle(
          chart,
          seriesMaps,
          study.id,
          volume,
          studyIsVisible(study, pane.timeframe),
        );
        if (!series) continue;
        setVolumePlotData(series, candles, volume);
        if (series.ma) {
          series.ma.setData(toLineData(candles, computeVolumeMa(candles, volume.maLength)));
        }
      }
      for (const study of studiesOfType(studiesRef.current, "vwap")) {
        const series = seriesMaps.vwap.get(study.id);
        if (!series) continue;
        const vwap = study.settings as IndicatorSettingsMap["vwap"];
        series.setData(toLineData(candles, computeVwapPlot(candles, vwap, timeframeRef.current)));
      }
      for (const study of studiesOfType(studiesRef.current, "ema")) {
        const series = seriesMaps.ema.get(study.id);
        if (!series) continue;
        const ema = study.settings as IndicatorSettingsMap["ema"];
        const plot = computeEmaPlot(candles, ema);
        series.line.setData(toLineData(candles, plot.line));
        if (plot.upper) series.upper?.setData(toLineData(candles, plot.upper));
        if (plot.lower) series.lower?.setData(toLineData(candles, plot.lower));
      }
      for (const study of studiesOfType(studiesRef.current, "bb")) {
        const series = seriesMaps.bb.get(study.id);
        if (!series) continue;
        const bb = study.settings as IndicatorSettingsMap["bb"];
        const bands = computeBbPlot(candles, bb);
        series.basis.setData(toLineData(candles, bands.basis));
        series.upper.setData(toLineData(candles, bands.upper));
        series.lower.setData(toLineData(candles, bands.lower));
      }
      for (const study of studiesOfType(studiesRef.current, "rsi")) {
        const series = seriesMaps.rsi.get(study.id);
        if (!series) continue;
        const rsi = study.settings as IndicatorSettingsMap["rsi"];
        series.setData(toLineData(candles, computeRsi(candles, rsi.period)));
      }
      for (const study of studiesOfType(studiesRef.current, "stoch")) {
        const series = seriesMaps.stoch.get(study.id);
        if (!series) continue;
        const stoch = study.settings as IndicatorSettingsMap["stoch"];
        const { k, d } = computeStochastic(
          candles,
          stoch.length,
          stoch.kSmoothing,
          stoch.dSmoothing,
        );
        const hi = Math.max(stoch.upper.level, stoch.lower.level);
        const levelData = (level: number) =>
          candles.map((c) => ({
            time: c.time as UTCTimestamp,
            value: level,
          }));
        series.bg.setData(
          candles.map((c) => ({
            time: c.time as UTCTimestamp,
            value: hi,
          })),
        );
        series.k.setData(toLineData(candles, k));
        series.d.setData(toLineData(candles, d));
        series.upper.setData(levelData(stoch.upper.level));
        series.middle.setData(levelData(stoch.middle.level));
        series.lower.setData(levelData(stoch.lower.level));
      }
      for (const study of studiesOfType(studiesRef.current, "atr")) {
        const series = seriesMaps.atr.get(study.id);
        if (!series) continue;
        const atr = study.settings as IndicatorSettingsMap["atr"];
        series.setData(toLineData(candles, computeAtr(candles, atr.period)));
      }
      for (const study of studiesOfType(studiesRef.current, "adx")) {
        const series = seriesMaps.adx.get(study.id);
        if (!series) continue;
        const adx = study.settings as IndicatorSettingsMap["adx"];
        series.setData(toLineData(candles, computeAdx(candles, adx.period)));
      }
      for (const study of studiesOfType(studiesRef.current, "pmo")) {
        const group = seriesMaps.pmo.get(study.id);
        if (!group) continue;
        const pmo = study.settings as IndicatorSettingsMap["pmo"];
        const { pmo: pmoLine, signal: signalLine } = computePmo(
          candles,
          pmo.period1,
          pmo.period2,
          pmo.signalPeriod,
          pmo.source,
        );
        group.pmo.setData(toLineData(candles, pmoLine));
        group.signal.setData(toLineData(candles, signalLine));
        if (group.zero) {
          group.zero.setData(
            candles.map((c) => ({
              time: c.time as UTCTimestamp,
              value: pmo.zeroLine.level,
            })),
          );
        }
      }
      if (fit) {
        try {
          if (!settings.lockPriceRatio) {
            chart.priceScale("right").setAutoScale(true);
            try {
              chart.priceScale("left").setAutoScale(true);
            } catch {
              /* left may be hidden */
            }
            useAppStore.getState().setPaneAutoScale(pane.id, true);
          }
          // Only frame once we have real history. fitContent() on a few WS
          // bars locks huge barSpacing and causes the "giant candles" view.
          if (styled.length >= MIN_BARS_TO_FRAME) {
            frameRecentBars(styled.length);
          } else {
            chart.timeScale().applyOptions({
              barSpacing: chartOptions.timeScale?.barSpacing ?? 7,
              rightOffset: settings.marginRightBars,
            });
          }
        } catch {
          /* panes may not be ready yet */
        }
      } else if (!viewFramed && styled.length >= MIN_BARS_TO_FRAME) {
        try {
          frameRecentBars(styled.length);
        } catch {
          /* ignore */
        }
      }
      updateScaleLines(styled);
      try {
        paintCountdown();
      } catch {
        /* ignore teardown races */
      }
      publishStudyLayouts();
      schedulePriceScaleWidthSync();
    };

    applyRef.current = applyFull;

    type PriceLine = ReturnType<(typeof main)["createPriceLine"]>;
    let prevDayLine: PriceLine | null = null;
    let highLine: PriceLine | null = null;
    let lowLine: PriceLine | null = null;

    function updateScaleLines(candles: Candle[]) {
      const settings = settingsRef.current;
      if (prevDayLine) {
        main.removePriceLine(prevDayLine);
        prevDayLine = null;
      }
      if (highLine) {
        main.removePriceLine(highLine);
        highLine = null;
      }
      if (lowLine) {
        main.removePriceLine(lowLine);
        lowLine = null;
      }
      if (!candles.length || lineLike) return;
      if (settings.prevDayClose !== "hidden" && candles.length > 1) {
        const dayAgo = candles[Math.max(0, candles.length - 97)] ?? candles[0];
        prevDayLine = main.createPriceLine({
          price: dayAgo.close,
          color: "#787b86",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: settings.prevDayClose === "value",
          title: settings.prevDayClose === "value" ? "PDC" : "",
        });
      }
      if (settings.highLowDisplay !== "hidden") {
        let hi = candles[0].high;
        let lo = candles[0].low;
        for (const c of candles) {
          if (c.high > hi) hi = c.high;
          if (c.low < lo) lo = c.low;
        }
        highLine = main.createPriceLine({
          price: hi,
          color: "#089981",
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          axisLabelVisible: settings.highLowDisplay === "value",
          title: settings.highLowDisplay === "value" ? "H" : "",
        });
        lowLine = main.createPriceLine({
          price: lo,
          color: "#f23645",
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          axisLabelVisible: settings.highLowDisplay === "value",
          title: settings.highLowDisplay === "value" ? "L" : "",
        });
      }
    }

    const writeLegend = (c: Candle | undefined, all: Candle[]) => {
      if (!legendRef.current || !c) return;
      const settings = settingsRef.current;
      const symbol = symbolRef.current;
      const timeframe = timeframeRef.current;
      const precision = resolvePrecision(symbol, settings);
      const info = getSymbol(symbol);
      const chg = c.close - c.open;
      const pct = c.open === 0 ? 0 : (chg / c.open) * 100;
      const up = chg >= 0;
      const color = up ? "#089981" : "#f23645";
      const sign = up ? "+" : "";
      const title =
        settings.titleMode === "description" ? info.name : formatTicker(symbol);
      const dayRef = all[Math.max(0, all.length - 97)] ?? all[0];
      const dayChg = dayRef ? c.close - dayRef.close : 0;
      const dayPct = dayRef && dayRef.close !== 0 ? (dayChg / dayRef.close) * 100 : 0;
      const dayUp = dayChg >= 0;
      const dayColor = dayUp ? "#089981" : "#f23645";

      // Get feed status for the colored dot
      const feedStatus = mawsFeed.getKlineStatus(symbol, timeframe);
      const isRecovering = mawsFeed.isKlineRecovering(symbol, timeframe);
      const statusColor = isRecovering
        ? "#ff9800"
        : feedStatus === "live"
          ? "#089981"
          : feedStatus === "connecting"
            ? "#787b86"
            : feedStatus === "delayed"
              ? "#f23645"
              : "#787b86";
      const statusLabel = isRecovering
        ? "Reconnecting"
        : feedStatus === "live"
          ? "Live"
          : feedStatus === "delayed"
            ? "Data delayed"
            : "Connecting";

      const parts: string[] = [];
      if (settings.showLogo) {
        const src = assetLogoSrc(symbol);
        const letter = assetLogoLetter(symbol);
        const bg = symbolColor(symbol);
        // Keep onerror free of nested quotes — broken attribute JS caused SyntaxError.
        parts.push(
          `<img class="legend-logo-img" src="${src}" alt="" data-letter="${letter}" data-bg="${bg}" onerror="this.onerror=null;var s=document.createElement('span');s.className='legend-logo';s.textContent=this.getAttribute('data-letter')||'?';s.style.background=this.getAttribute('data-bg')||'#2962ff';this.replaceWith(s);"/>`,
        );
      }
      if (settings.showTitle) {
        parts.push(`<span data-legend-symbol class="legend-sym" style="cursor:pointer;">${title}</span>`);
      }
      // Status dot sits after the symbol name (when shown) and before OHLC. Kept
      // outside showTitle: the title is hidden by default, the health dot is not.
      // title/aria-label carry the state text so color is never the only signal.
      if (settings.showMarketStatus && feedStatus !== "idle") {
        parts.push(
          `<span data-legend-status role="status" aria-label="Market feed status: ${statusLabel}" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${statusColor};margin:0 8px;flex-shrink:0;cursor:pointer;vertical-align:middle;position:relative;" title="Market feed status: ${statusLabel}"></span>`
        );
      }
      if (settings.showChartValues) {
        parts.push(
          `<span data-legend-ohlc>O<span style="color:${color}">${c.open.toFixed(precision)}</span></span>`,
          `<span data-legend-ohlc>H<span style="color:${color}">${c.high.toFixed(precision)}</span></span>`,
          `<span data-legend-ohlc>L<span style="color:${color}">${c.low.toFixed(precision)}</span></span>`,
          `<span data-legend-ohlc>C<span style="color:${color}">${c.close.toFixed(precision)}</span></span>`,
        );
      }
      if (settings.showBarChange) {
        parts.push(`<span style="color:${color}">${sign}${pct.toFixed(2)}%</span>`);
      }
      if (settings.showVolume) {
        parts.push(`<span>Vol <span style="color:${color}">${formatVol(c.volume)}</span></span>`);
      }
      if (settings.showLastDayChange) {
        parts.push(
          `<span style="color:${dayColor}">${dayUp ? "+" : ""}${dayPct.toFixed(2)}%</span>`,
        );
      }
      legendRef.current.innerHTML = parts.join("");
    };

    const initial = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    let primed = false;
    lastBarTime = initial.at(-1)?.time ?? -1;
    lastBarCount = initial.length;
    const preserved = takePaneView(pane.id);
    const replayNow = useAppStore.getState().replay;
    if (replayNow?.paneId === pane.id) {
      applyFull(initial.slice(0, Math.max(2, replayNow.index + 1)), !preserved);
      primed = true;
    } else if (initial.length >= MIN_BARS_TO_FRAME) {
      applyFull(initial, !preserved);
      primed = true;
    } else if (initial.length > 0) {
      applyFull(initial, false);
      primed = true;
    }
    if (preserved && primed) {
      try {
        chart.timeScale().applyOptions({ barSpacing: preserved.barSpacing });
        chart.timeScale().setVisibleLogicalRange({
          from: preserved.from,
          to: preserved.to,
        });
        viewFramed = true;
      } catch {
        /* ignore */
      }
    }
    writeLegend(initial.at(-1), initial);

    // Live tip: series.update. New bar / history: setData so prior OHLC never stays stale.
    const onFeed = (candles: Candle[], _quote: unknown, meta?: { tick?: boolean }) => {
      if (disposed) return;
      if (useAppStore.getState().replay?.paneId === pane.id) return;
      if (candles.length === 0) return;

      const tip = candles[candles.length - 1];
      const sameTip = tip.time === lastBarTime && candles.length === lastBarCount;
      const tipTick = Boolean(meta?.tick) && sameTip && primed && viewFramed;
      const newBar =
        primed &&
        viewFramed &&
        tip.time !== lastBarTime &&
        (candles.length === lastBarCount + 1 || candles.length === lastBarCount);

      if (tipTick) {
        try {
          paintLive(candles);
          return;
        } catch {
          /* fall through */
        }
      }

      if (newBar) {
        // Full redraw seals the closed bar + studies. Viewport shift is handled
        // atomically by shiftVisibleRangeOnNewBar (no custom RAF slide).
        applyFull(candles, false);
        writeLegend(candles.at(-1), candles);
        return;
      }

      // History backfill prepends older bars. Preserve the visible time window so
      // zoom/scroll into the new left-side history keeps working.
      const added = candles.length - lastBarCount;
      const historyDeepen =
        primed &&
        viewFramed &&
        (tip.time === lastBarTime ? added > 0 : added > 1);
      if (historyDeepen) {
        let timeRange: { from: Time; to: Time } | null = null;
        let logical: { from: number; to: number } | null = null;
        try {
          timeRange = chart.timeScale().getVisibleRange();
          logical = chart.timeScale().getVisibleLogicalRange();
        } catch {
          timeRange = null;
          logical = null;
        }
        applyFull(candles, false);
        try {
          if (timeRange?.from != null && timeRange?.to != null) {
            chart.timeScale().setVisibleRange(timeRange);
          } else if (logical && added > 0) {
            chart.timeScale().setVisibleLogicalRange({
              from: logical.from + added,
              to: logical.to + added,
            });
          }
        } catch {
          /* ignore */
        }
        writeLegend(candles.at(-1), candles);
        return;
      }

      const needsFrame = !viewFramed && candles.length >= MIN_BARS_TO_FRAME;
      applyFull(candles, !primed || needsFrame);
      primed = true;
      writeLegend(candles.at(-1), candles);
    };

    let feedUnsub = mawsFeed.subscribe(pane.symbol, pane.timeframe, onFeed);
    let feedSymbol = pane.symbol;

    const applySymbolFormats = (symbol: string) => {
      const s = settingsRef.current;
      const fmt = priceFormatFor(symbol, s);
      const precision = resolvePrecision(symbol, s);
      try {
        main.applyOptions({ priceFormat: fmt });
        chart.applyOptions({
          localization: {
            priceFormatter: (p: number) => formatScalePrice(p, precision),
          },
        });
      } catch {
        /* ignore */
      }
      for (const study of studiesOfType(studiesRef.current, "vwap")) {
        const series = seriesMaps.vwap.get(study.id);
        const vwap = study.settings as IndicatorSettingsMap["vwap"];
        try {
          series?.applyOptions({
            priceFormat: overlayPriceFormat(symbol, s, vwap.precision),
          });
        } catch {
          /* ignore */
        }
      }
      for (const study of studiesOfType(studiesRef.current, "ema")) {
        const series = seriesMaps.ema.get(study.id);
        const ema = study.settings as IndicatorSettingsMap["ema"];
        const emaFormat = overlayPriceFormat(symbol, s, ema.precision);
        try {
          series?.line.applyOptions({ priceFormat: emaFormat });
          series?.upper?.applyOptions({ priceFormat: emaFormat });
          series?.lower?.applyOptions({ priceFormat: emaFormat });
        } catch {
          /* ignore */
        }
      }
      for (const study of studiesOfType(studiesRef.current, "bb")) {
        const series = seriesMaps.bb.get(study.id);
        const bb = study.settings as IndicatorSettingsMap["bb"];
        const bbFormat = overlayPriceFormat(symbol, s, bb.precision);
        try {
          series?.basis.applyOptions({ priceFormat: bbFormat });
          series?.upper.applyOptions({ priceFormat: bbFormat });
          series?.lower.applyOptions({ priceFormat: bbFormat });
        } catch {
          /* ignore */
        }
      }
    };

    swapSymbolRef.current = (symbol: string) => {
      if (disposed || symbol === feedSymbol) return;
      feedSymbol = symbol;
      symbolRef.current = symbol;
      feedUnsub();
      feedUnsub = mawsFeed.subscribe(symbol, timeframeRef.current, onFeed);
      applySymbolFormats(symbol);
      const candles = mawsFeed.getCandles(symbol, timeframeRef.current);
      primed = false;
      viewFramed = false;
      lastBarTime = -1;
      lastBarCount = 0;
      if (candles.length >= MIN_BARS_TO_FRAME) {
        applyFull(candles, true);
        primed = true;
      } else if (candles.length > 0) {
        applyFull(candles, false);
        primed = true;
      }
      writeLegend(candles.at(-1), candles);
    };

    let lastHover: MouseEventParams | null = null;

    chart.subscribeCrosshairMove((param) => {
      if (isChartSyncing()) return;
      lastHover = param;

      // Pan / scale drag: skip legend DOM writes, series hit-tests, and sync fan-out.
      if (pointerDown) return;

      const candles = mawsFeed.getCandles(symbolRef.current, timeframeRef.current);
      if (!param.time) {
        writeLegend(candles.at(-1), candles);
      } else {
        const raw = candleAtTime(candles, Number(param.time));
        if (raw) writeLegend(raw, candles);
      }

      const drawingTool = useAppStore.getState().drawingTool;
      if (drawingTool === "cursor") {
        if (!param.point) {
          // Over scales / outside plot — let LWC use resize cursors
          el.classList.remove("chart-plot", "is-over-series");
          el.style.cursor = "";
        } else {
          el.classList.add("chart-plot");
          const paneIdx = param.paneIndex ?? 0;
          let overSeries = false;
          if (paneIdx === 0) {
            const t = param.time == null ? null : Number(param.time);
            const bar = t == null ? undefined : candleAtTime(candles, t);
            overSeries =
              (Boolean(bar) &&
                nearPriceBand(main, param.point.y, bar!.high, bar!.low)) ||
              nearSeriesPoint(main as ISeriesApi<SeriesType>, param) ||
              [...seriesMaps.volume.values()].some(
                (series) =>
                  (series.plotStyle === "histogram"
                    ? nearHistogramBar(series.plot, param)
                    : nearSeriesPoint(series.plot, param)) ||
                  nearSeriesPoint(series.ma, param),
              ) ||
              [...seriesMaps.vwap.values()].some((series) => nearSeriesPoint(series, param)) ||
              [...seriesMaps.ema.values()].some(
                (series) =>
                  nearSeriesPoint(series.line, param) ||
                  nearSeriesPoint(series.upper, param) ||
                  nearSeriesPoint(series.lower, param),
              ) ||
              [...seriesMaps.bb.values()].some(
                (series) =>
                  nearSeriesPoint(series.basis, param) ||
                  nearSeriesPoint(series.upper, param) ||
                  nearSeriesPoint(series.lower, param),
              );
          } else {
            const study = paneStudies[paneIdx - 1];
            if (study?.type === "rsi") {
              overSeries = nearSeriesPoint(seriesMaps.rsi.get(study.id), param);
            } else if (study?.type === "stoch") {
              const series = seriesMaps.stoch.get(study.id);
              if (series) {
                overSeries =
                  nearSeriesPoint(series.k, param) || nearSeriesPoint(series.d, param);
              }
            } else if (study?.type === "atr") {
              overSeries = nearSeriesPoint(seriesMaps.atr.get(study.id), param);
            } else if (study?.type === "adx") {
              overSeries = nearSeriesPoint(seriesMaps.adx.get(study.id), param);
            } else if (study?.type === "pmo") {
              const group = seriesMaps.pmo.get(study.id);
              if (group) {
                overSeries =
                  nearSeriesPoint(group.pmo, param) || nearSeriesPoint(group.signal, param);
              }
            }
          }
          el.classList.toggle("is-over-series", overSeries);
          const drawCursor = el.closest("[data-chart-host]")?.getAttribute("data-draw-cursor");
          el.style.cursor = drawCursor || (overSeries ? "pointer" : "crosshair");
        }
      } else if (drawingTool === "zoom") {
        el.classList.remove("is-over-series");
        el.classList.add("chart-plot");
        el.style.cursor = "zoom-in";
      } else {
        // Drawing tools: overlay owns the cursor
        el.classList.remove("chart-plot", "is-over-series");
        el.style.cursor = "";
      }

      const sync = useAppStore.getState().layoutSync;
      if (!param.point || param.time == null) {
        if (sync.crosshair) clearSyncedCrosshair(pane.id);
        return;
      }
      if (param.paneIndex != null && param.paneIndex !== 0) {
        // Still allow cursor feedback in study panes; skip plus-button hover
        return;
      }

      const price = main.coordinateToPrice(param.point.y);
      if (price == null) return;
      const time = Number(param.time);
      const cb = onCrosshairRef.current;
      cb?.({
        price,
        time,
        y: param.point.y,
        axisWidth: Math.max(chart.priceScale("right").width(), 54),
      });
      setLastCrosshair({ paneId: pane.id, price, time });
      if (sync.crosshair) syncCrosshairToOthers(pane.id, param.time, price);
    });

    /** Last crosshair sample — dblclick payloads often lack seriesData. */
    const resolveIndicatorHit = (param: MouseEventParams): string | null => {
      const point = param.point ?? lastHover?.point;
      if (!point) return null;
      const paneIdx = param.paneIndex ?? lastHover?.paneIndex ?? 0;
      const timeRaw = param.time ?? lastHover?.time;
      const time = timeRaw == null ? null : Number(timeRaw);
      const merged: MouseEventParams = {
        ...param,
        point,
        paneIndex: paneIdx,
        time: timeRaw,
        seriesData:
          param.seriesData && param.seriesData.size > 0
            ? param.seriesData
            : (lastHover?.seriesData ?? param.seriesData),
      };

      const candles =
        time != null ? mawsFeed.getCandles(symbolRef.current, timeframeRef.current) : [];
      const barIdx = time != null ? candles.findIndex((c) => c.time === time) : -1;

      if (paneIdx === 0) {
        for (const study of studiesOfType(pane.studies, "ema")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const settings = study.settings as IndicatorSettingsMap["ema"];
          if (settings.visible === false) continue;
          const series = seriesMaps.ema.get(study.id);
          if (!series) continue;
          const plot =
            barIdx >= 0 ? computeEmaPlot(candles, settings) : { line: [], upper: null, lower: null };
          let v = seriesValueFromParam(series.line, merged);
          if (v == null && barIdx >= 0) v = plot.line[barIdx];
          if (nearSeriesValue(series.line, point.y, v, 12)) return study.id;
          if (series.upper && plot.upper) {
            let uv = seriesValueFromParam(series.upper, merged);
            if (uv == null && barIdx >= 0) uv = plot.upper[barIdx];
            if (nearSeriesValue(series.upper, point.y, uv, 12)) return study.id;
          }
          if (series.lower && plot.lower) {
            let lv = seriesValueFromParam(series.lower, merged);
            if (lv == null && barIdx >= 0) lv = plot.lower[barIdx];
            if (nearSeriesValue(series.lower, point.y, lv, 12)) return study.id;
          }
        }
        for (const study of studiesOfType(pane.studies, "bb")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const series = seriesMaps.bb.get(study.id);
          if (!series) continue;
          const settings = study.settings as IndicatorSettingsMap["bb"];
          const check = (
            line: LineSeriesApi,
            values: (number | null)[],
            on: boolean,
          ) => {
            if (!on) return false;
            let v = seriesValueFromParam(line, merged);
            if (v == null && barIdx >= 0) v = values[barIdx];
            return nearSeriesValue(line, point.y, v, 12);
          };
          const bands =
            barIdx >= 0
              ? computeBbPlot(candles, settings)
              : { basis: [], upper: [], lower: [] };
          if (check(series.basis, bands.basis, settings.basisVisible)) return study.id;
          if (check(series.upper, bands.upper, settings.upperVisible)) return study.id;
          if (check(series.lower, bands.lower, settings.lowerVisible)) return study.id;
        }
        for (const study of studiesOfType(pane.studies, "vwap")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const settings = study.settings as IndicatorSettingsMap["vwap"];
          if (settings.visible === false) continue;
          const series = seriesMaps.vwap.get(study.id);
          if (!series) continue;
          let v = seriesValueFromParam(series, merged);
          if (v == null && barIdx >= 0) {
            v = computeVwapPlot(candles, settings, pane.timeframe)[barIdx];
          }
          if (nearSeriesValue(series, point.y, v, 14)) return study.id;
        }
        for (const study of studiesOfType(pane.studies, "volume")) {
          if (!studyIsVisible(study, pane.timeframe)) continue;
          const settings = study.settings as IndicatorSettingsMap["volume"];
          const series = seriesMaps.volume.get(study.id);
          if (!series) continue;
          if (settings.volumeVisible) {
            let v = seriesValueFromParam(series.plot, merged);
            if (v == null && barIdx >= 0) v = candles[barIdx]?.volume ?? null;
            if (series.plotStyle === "histogram") {
              if (nearHistogramValue(series.plot, point.y, v, 8)) {
                return study.id;
              }
            } else if (nearSeriesValue(series.plot, point.y, v, 12)) {
              return study.id;
            }
          }
          if (settings.maVisible && series.ma) {
            let mv = seriesValueFromParam(series.ma, merged);
            if (mv == null && barIdx >= 0) {
              mv = computeVolumeMa(candles, settings.maLength)[barIdx];
            }
            if (nearSeriesValue(series.ma, point.y, mv, 12)) return study.id;
          }
        }
        return null;
      }

      const study = paneStudies[paneIdx - 1];
      if (!study || !studyIsVisible(study, pane.timeframe)) return null;
      if (study.type === "rsi") {
        const series = seriesMaps.rsi.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["rsi"];
          let v = seriesValueFromParam(series, merged);
          if (v == null && barIdx >= 0) {
            const vals = computeRsi(candles, settings.period);
            v = vals[barIdx];
          }
          if (nearSeriesValue(series, point.y, v, 12)) return study.id;
        }
      } else if (study.type === "stoch") {
        const series = seriesMaps.stoch.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["stoch"];
          const { k, d } =
            barIdx >= 0
              ? computeStochastic(
                  candles,
                  settings.length,
                  settings.kSmoothing,
                  settings.dSmoothing,
                )
              : { k: [], d: [] };
          if (settings.kVisible !== false) {
            let v = seriesValueFromParam(series.k, merged);
            if (v == null && barIdx >= 0) v = k[barIdx];
            if (nearSeriesValue(series.k, point.y, v, 12)) return study.id;
          }
          if (settings.dVisible !== false) {
            let v = seriesValueFromParam(series.d, merged);
            if (v == null && barIdx >= 0) v = d[barIdx];
            if (nearSeriesValue(series.d, point.y, v, 12)) return study.id;
          }
        }
      } else if (study.type === "atr") {
        const series = seriesMaps.atr.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["atr"];
          let v = seriesValueFromParam(series, merged);
          if (v == null && barIdx >= 0) {
            const vals = computeAtr(candles, settings.period);
            v = vals[barIdx];
          }
          if (nearSeriesValue(series, point.y, v, 12)) return study.id;
        }
      } else if (study.type === "adx") {
        const series = seriesMaps.adx.get(study.id);
        if (series) {
          const settings = study.settings as IndicatorSettingsMap["adx"];
          let v = seriesValueFromParam(series, merged);
          if (v == null && barIdx >= 0) {
            const vals = computeAdx(candles, settings.period);
            v = vals[barIdx];
          }
          if (nearSeriesValue(series, point.y, v, 12)) return study.id;
        }
      } else if (study.type === "pmo") {
        const group = seriesMaps.pmo.get(study.id);
        if (group) {
          const settings = study.settings as IndicatorSettingsMap["pmo"];
          if (settings.pmoVisible) {
            let v = seriesValueFromParam(group.pmo, merged);
            if (v == null && barIdx >= 0) {
              const { pmo } = computePmo(
                candles,
                settings.period1,
                settings.period2,
                settings.signalPeriod,
                settings.source,
              );
              v = pmo[barIdx];
            }
            if (nearSeriesValue(group.pmo, point.y, v, 12)) return study.id;
          }
          if (settings.signalVisible) {
            let v = seriesValueFromParam(group.signal, merged);
            if (v == null && barIdx >= 0) {
              const { signal } = computePmo(
                candles,
                settings.period1,
                settings.period2,
                settings.signalPeriod,
                settings.source,
              );
              v = signal[barIdx];
            }
            if (nearSeriesValue(group.signal, point.y, v, 12)) return study.id;
          }
        }
      }
      return null;
    };

    const lastDblClickHandledAt = { current: 0 };
    const markDblClickHandled = () => {
      lastDblClickHandledAt.current = performance.now();
    };
    const resolvePaneTarget = (param: MouseEventParams): string | null => {
      if (!(param.point ?? lastHover?.point)) return null;
      const paneIdx = param.paneIndex ?? lastHover?.paneIndex ?? 0;
      return paneIdx === 0 ? MAIN_PRICE_PANE_ID : paneStudies[paneIdx - 1]?.id ?? null;
    };
    const togglePaneFocus = (param: MouseEventParams): boolean => {
      const target = resolvePaneTarget(param);
      if (!target) return false;
      useAppStore.getState().toggleFocusedPane(pane.id, target);
      return true;
    };

    const onDblClick = (param: MouseEventParams) => {
      if (useAppStore.getState().drawingTool !== "cursor") return;
      if (useAppStore.getState().drawingSettingsTarget) return;
      const id = resolveIndicatorHit(param);
      if (id) {
        useAppStore.getState().setIndicatorSettingsOpen(id);
        markDblClickHandled();
      } else if (togglePaneFocus(param)) {
        markDblClickHandled();
      }
    };
    chart.subscribeDblClick(onDblClick);

    const onNativeDblClick = (e: MouseEvent) => {
      if (useAppStore.getState().drawingTool !== "cursor") return;
      if (useAppStore.getState().drawingSettingsTarget) return;
      // Lightweight Charts does not consistently include pane/series data in its
      // dblclick payload, so use the last crosshair sample as a native fallback.
      if (performance.now() - lastDblClickHandledAt.current < 250) return;
      if (!lastHover?.point) return;
      const payload = lastHover;
      const id = resolveIndicatorHit(payload);
      if (id) {
        e.preventDefault();
        useAppStore.getState().setIndicatorSettingsOpen(id);
        markDblClickHandled();
      } else if (togglePaneFocus(payload)) {
        e.preventDefault();
        markDblClickHandled();
      }
    };
    el.addEventListener("dblclick", onNativeDblClick);

    const onCanvasMouseLeave = () => {
      el.classList.remove("chart-plot", "is-over-series");
      el.style.cursor = "";
    };
    el.addEventListener("mouseleave", onCanvasMouseLeave);

    // Countdown: no perpetual 60fps loop. Reposition on range changes + while the
    // user is dragging (price-scale drag has no LWC events). Text updates via 1s timer.
    let countdownRaf = 0;
    const scheduleCountdown = () => {
      if (countdownRaf || disposed) return;
      countdownRaf = requestAnimationFrame(() => {
        countdownRaf = 0;
        paintCountdown();
      });
    };
    const loopCountdownWhileDrag = () => {
      if (disposed) return;
      paintCountdown();
      if (pointerDown) countdownRaf = requestAnimationFrame(loopCountdownWhileDrag);
      else countdownRaf = 0;
    };
    const onCountdownPointerDown = () => {
      if (countdownRaf) return;
      countdownRaf = requestAnimationFrame(loopCountdownWhileDrag);
    };
    el.addEventListener("pointerdown", onCountdownPointerDown);

    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      scheduleCountdown();
      if (!range || isChartSyncing()) return;
      const sync = useAppStore.getState().layoutSync;
      if (sync.dateRange) {
        const visible = chart.timeScale().getVisibleRange();
        if (visible) syncVisibleRangeToOthers(pane.id, visible);
      } else if (sync.time) {
        syncLogicalRangeToOthers(pane.id, range);
      }
    });

    // 1-second interval only for updating the countdown text itself.
    const countdownTimer = window.setInterval(paintCountdown, 1000);
    paintCountdown();

    // Rewrite the legend when kline health changes; otherwise a delayed /
    // recovering transition stays invisible until the next candle frame.
    let lastKlineStatus = mawsFeed.getKlineStatus(symbolRef.current, timeframeRef.current);
    let lastKlineRecovering = mawsFeed.isKlineRecovering(symbolRef.current, timeframeRef.current);
    const statusTimer = window.setInterval(() => {
      const status = mawsFeed.getKlineStatus(symbolRef.current, timeframeRef.current);
      const recovering = mawsFeed.isKlineRecovering(symbolRef.current, timeframeRef.current);
      if (status === lastKlineStatus && recovering === lastKlineRecovering) return;
      lastKlineStatus = status;
      lastKlineRecovering = recovering;
      const candles = mawsFeed.getCandles(symbolRef.current, timeframeRef.current);
      writeLegend(candles.at(-1), candles);
    }, 1000);

    // TradingView-style wheel zoom: keep the right edge fixed, reveal/hide history on the left.
    const onWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return; // allow browser zoom
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      let leftW = 0;
      const rightW = Math.max(chart.priceScale("right").width(), 0);
      try {
        leftW = Math.max(chart.priceScale("left").width(), 0);
      } catch {
        leftW = 0;
      }
      const onPrice = x <= leftW + 1 || x >= rect.width - rightW - 1;
      const onTime = y >= rect.height - CHART_TIME_AXIS_H;
      // Leave price/time axes alone (axis drag / default behavior).
      if (onPrice || onTime) return;

      e.preventDefault();
      zoomTimeScaleRightAnchored(chart.timeScale(), wheelZoomFactor(e.deltaY));
    };
    el.addEventListener("wheel", onWheelZoom, { passive: false });

    return () => {
      disposed = true;
      nativeLabelHiddenRef.current = false;
      swapSymbolRef.current = null;
      cancelAnimationFrame(countdownRaf);
      for (const id of deferRafs) cancelAnimationFrame(id);
      window.clearInterval(countdownTimer);
      window.clearInterval(statusTimer);
      feedUnsub();
      chart.unsubscribeDblClick(onDblClick);
      el.removeEventListener("dblclick", onNativeDblClick);
      el.removeEventListener("mouseleave", onCanvasMouseLeave);
      el.removeEventListener("wheel", onWheelZoom);
      el.removeEventListener("pointerdown", onPanePointerDown);
      el.removeEventListener("pointerdown", onCountdownPointerDown);
      window.removeEventListener("pointerup", onPanePointerUp);
      window.removeEventListener("pointercancel", onPanePointerUp);
      if (layoutRaf) cancelAnimationFrame(layoutRaf);
      ro.disconnect();
      paneRo.disconnect();
      stashPaneView(pane.id, chart);
      indicatorSeries.current = createIndicatorSeriesMaps();
      onStudyLayoutsRef.current?.([]);
      unregisterChart(pane.id);
      // Hardening for LWC v5.2.1 teardown: _internal_destroy() cancels only a
      // PRE-EXISTING _private__drawRafId, then model destroy re-invalidates
      // (fullUpdate → invalidateHandler), scheduling a FRESH draw rAF that
      // nothing cancels. If the chart is quiescent at removal that draw fires
      // after the canvas bindings are disposed → "Object is disposed". Two-part
      // hardening: (1) takeScreenshot() flushes any pending invalidation
      // synchronously while the chart is alive (old rAF becomes a no-op);
      // (2) while chart.remove() runs synchronously, stub
      // window.requestAnimationFrame so teardown-scheduled draw rAFs are
      // swallowed — the chart is gone, there is nothing valid left to draw.
      try {
        chart.takeScreenshot();
      } catch {
        /* never let teardown hardening mask a destroy error */
      }
      const realRaf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (() => 0) as typeof window.requestAnimationFrame;
      try {
        chart.remove();
      } finally {
        window.requestAnimationFrame = realRaf;
      }
    };
    // Symbol and study settings are read through refs so this chart instance
    // can update in place without losing its zoom or scroll position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pane.id, pane.timeframe, studiesStructureKey, seriesKind]);

  // Focus mode: stretch factors allocate canvas space correctly, but LWC enforces a ~2px
  // minimum per pane even at factor 0 — visible as slivers. We also hide the <tr> rows
  // for non-focused panes directly in the DOM so they truly collapse to zero.
  useEffect(() => {
    const handle = getChart(pane.id);
    if (!handle) return;

    const target = focusedPane?.chartPaneId === pane.id ? focusedPane.paneId : null;
    const paneStudies = liveStudies.filter(
      (study): study is IndicatorInstance & { type: StudyPaneId } => isPaneStudyId(study.type),
    );
    const validTarget =
      target === MAIN_PRICE_PANE_ID || paneStudies.some((study) => study.id === target)
        ? target
        : null;
    const savedStretch = useAppStore.getState().paneStretchFactors[pane.id];
    const chartPanes = handle.chart.panes();

    // Step 1: Set stretch factors so LWC allocates the right canvas size.
    chartPanes[0]?.setStretchFactor(
      validTarget == null
        ? savedStretch?.main ?? (paneStudies.length > 0 ? 3 : 1)
        : validTarget === MAIN_PRICE_PANE_ID
          ? 1
          : 0,
    );
    for (let i = 0; i < paneStudies.length; i++) {
      const study = paneStudies[i];
      chartPanes[i + 1]?.setStretchFactor(
        validTarget == null
          ? savedStretch?.byStudyId[study.id] ?? 0.7
          : validTarget === study.id
            ? 1
            : 0,
      );
    }

    // Step 2: Determine which LWC pane index is focused.
    const focusedLwcPaneIdx =
      validTarget === null
        ? null
        : validTarget === MAIN_PRICE_PANE_ID
          ? 0
          : paneStudies.findIndex((s) => s.id === validTarget) + 1;

    // Step 3: Toggle <tr> visibility so collapsed panes take zero space.
    // LWC's chart table structure: [pane0, sep0, pane1, sep1, ..., paneN, timeAxis]
    const chartEl = handle.chart.chartElement();
    const table = chartEl.querySelector('table');
    if (!table) return;

    const allRows = Array.from(table.querySelectorAll('tr')) as HTMLElement[];
    // The very last <tr> in the LWC table is always the time axis — keep it visible.
    const timeAxisRow = allRows.at(-1) ?? null;
    // PaneApi.getHTMLElement() returns the pane's <tr>.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const focusedPaneRow: HTMLElement | null =
      focusedLwcPaneIdx !== null
        ? (((chartPanes[focusedLwcPaneIdx] as unknown) as { getHTMLElement?(): HTMLElement | null })
            .getHTMLElement?.() ?? null)
        : null;

    for (const row of allRows) {
      if (validTarget === null || row === focusedPaneRow || row === timeAxisRow) {
        row.style.removeProperty('display');
      } else {
        row.style.display = 'none';
      }
    }

    return () => {
      for (const row of allRows) {
        row.style.removeProperty('display');
      }
    };
  }, [focusedPane, liveStudies, pane.id, studiesStructureKey]);

  // Watermark is a pane primitive: create/detach it here so the Watermark setting and its
  // colour apply live without recreating the chart. Shares the chart-setup effect's identity
  // deps so it re-attaches to a freshly created chart.
  useEffect(() => {
    if (!settings.watermark) return;
    const handle = getChart(pane.id);
    const firstPane = handle?.chart.panes()[0];
    if (!firstPane) return;
    const wm = createTextWatermark(firstPane, {
      horzAlign: "center",
      vertAlign: "center",
      lines: [
        {
          text: pane.symbol,
          color: settings.watermarkColor || "rgba(209, 212, 220, 0.07)",
          fontSize: 42,
          fontFamily: "Trebuchet MS, sans-serif",
        },
      ],
    });
    return () => {
      // The chart-setup cleanup may have removed the chart first; detaching a
      // primitive from a destroyed chart must not throw during teardown.
      try {
        wm.detach();
      } catch {
        /* chart already gone */
      }
    };
  }, [
    pane.id,
    pane.symbol,
    pane.timeframe,
    studiesStructureKey,
    seriesKind,
    settings.watermark,
    settings.watermarkColor,
  ]);

  // Symbol change: swap series data + feed — do not recreate the chart.
  useEffect(() => {
    swapSymbolRef.current?.(pane.symbol);
  }, [pane.symbol, pane.id]);

  // Live-apply chart settings without tearing down the chart (avoids flash / view reset).
  // Always preserve time zoom/scroll (and price zoom when auto is off).
  const prevLiveSettingsRef = useRef(settings);
  useEffect(() => {
    const handle = getChart(pane.id);
    if (!handle) return;
    const prev = prevLiveSettingsRef.current;
    prevLiveSettingsRef.current = settings;
    const s = settings;
    const leftVisible = s.scalesPlacement === "left" || s.scalesPlacement === "both";
    const rightVisible = s.scalesPlacement === "right" || s.scalesPlacement === "both";
    const crossStyle =
      s.crosshairStyle === "solid"
        ? LineStyle.Solid
        : s.crosshairStyle === "dotted"
          ? LineStyle.Dotted
          : LineStyle.Dashed;
    const topMargin = Math.min(0.4, Math.max(0, s.marginTop / 100));
    const bottomMargin = Math.min(0.4, Math.max(0, s.marginBottom / 100));
    const precision = resolvePrecision(pane.symbol, s);
    const paneAuto = useAppStore.getState().autoScaleByPane[pane.id] ?? true;

    const ts = handle.chart.timeScale();
    let logicalRange: { from: number; to: number } | null = null;
    let barSpacing = 7;
    let rightPriceRange: { from: number; to: number } | null = null;
    let leftPriceRange: { from: number; to: number } | null = null;
    try {
      const range = ts.getVisibleLogicalRange();
      if (range && Number.isFinite(range.from) && Number.isFinite(range.to)) {
        logicalRange = { from: range.from, to: range.to };
      }
      barSpacing = ts.options().barSpacing ?? 7;
    } catch {
      /* ignore */
    }
    if (!paneAuto) {
      try {
        const r = handle.chart.priceScale("right").getVisibleRange();
        if (r && Number.isFinite(r.from) && Number.isFinite(r.to)) {
          rightPriceRange = { from: r.from, to: r.to };
        }
      } catch {
        /* ignore */
      }
      try {
        const r = handle.chart.priceScale("left").getVisibleRange();
        if (r && Number.isFinite(r.from) && Number.isFinite(r.to)) {
          leftPriceRange = { from: r.from, to: r.to };
        }
      } catch {
        /* ignore */
      }
    }

    try {
      const timeScalePatch: {
        borderColor: string;
        rightOffset?: number;
        tickMarkFormatter?: (time: Time, tickMarkType: TickMarkType) => string;
      } = {
        borderColor: s.scaleLineColor,
      };
      // Re-applying rightOffset shifts the scroll — only when the user changed it.
      if (prev.marginRightBars !== s.marginRightBars) {
        timeScalePatch.rightOffset = s.marginRightBars;
      }
      if (
        prev.timezone !== s.timezone ||
        prev.timeHoursFormat !== s.timeHoursFormat ||
        prev.dayOfWeekOnLabels !== s.dayOfWeekOnLabels ||
        prev.dateFormat !== s.dateFormat
      ) {
        timeScalePatch.tickMarkFormatter = (time: Time, tickMarkType: TickMarkType) => {
          const unix =
            typeof time === "number"
              ? time
              : typeof time === "string"
                ? Math.floor(Date.parse(time) / 1000)
                : Math.floor(Date.UTC(time.year, time.month - 1, time.day) / 1000);
          return formatChartTickMark(
            unix,
            s.timezone,
            s.timeHoursFormat,
            tickMarkType,
          );
        };
      }

      handle.chart.applyOptions({
        layout: {
          textColor: s.scaleTextColor,
          fontSize: s.scaleFontSize,
          panes: {
            separatorColor: s.paneSeparatorColor,
            separatorHoverColor: "#3a3a3a",
            enableResize: true,
          },
        },
        grid: {
          vertLines: { visible: s.vertGrid, color: s.vertGridColor },
          horzLines: { visible: s.grid, color: s.horzGridColor },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: s.crosshairColor,
            width: 1,
            style: crossStyle,
            labelBackgroundColor: TV.active,
          },
          horzLine: {
            color: s.crosshairColor,
            width: 1,
            style: crossStyle,
            labelBackgroundColor: TV.active,
          },
        },
        leftPriceScale: {
          visible: leftVisible,
          borderColor: s.scaleLineColor,
          invertScale: s.invertScale,
        },
        rightPriceScale: {
          visible: rightVisible,
          borderColor: s.scaleLineColor,
          scaleMargins: { top: topMargin, bottom: bottomMargin },
          invertScale: s.invertScale,
        },
        localization: {
          priceFormatter: (p: number) => formatScalePrice(p, precision),
          timeFormatter: (time: Time) => {
            const unix =
              typeof time === "number"
                ? time
                : typeof time === "string"
                  ? Math.floor(Date.parse(time) / 1000)
                  : Math.floor(Date.UTC(time.year, time.month - 1, time.day) / 1000);
            return formatChartTime(unix, s.timezone, s.timeHoursFormat);
          },
        },
        timeScale: timeScalePatch,
      });

      // Never force autoScale on cosmetic tweaks — that resets price zoom.
      // Only touch mode/auto when scale mode / lock actually change.
      if (
        prev.logScale !== s.logScale ||
        prev.priceScaleMode !== s.priceScaleMode ||
        prev.lockPriceRatio !== s.lockPriceRatio ||
        prev.invertScale !== s.invertScale
      ) {
        const autoScale = s.lockPriceRatio ? false : paneAuto;
        handle.chart.priceScale("right").applyOptions({
          mode: resolvePriceScaleMode(s),
          autoScale,
          invertScale: s.invertScale,
        });
        try {
          handle.chart.priceScale("left").applyOptions({
            mode: resolvePriceScaleMode(s),
            autoScale,
            invertScale: s.invertScale,
            visible: leftVisible,
            borderColor: s.scaleLineColor,
          });
        } catch {
          /* left may be hidden */
        }
      } else {
        try {
          handle.chart.priceScale("left").applyOptions({
            visible: leftVisible,
            borderColor: s.scaleLineColor,
            invertScale: s.invertScale,
          });
        } catch {
          /* left may be hidden */
        }
      }

      // Candle colors / last-price line without rebuilding the series.
      const showLast =
        (s.lastPriceDisplay === "value" || s.lastPriceDisplay === "value_line") &&
        // When the countdown pill is active it renders its own price label,
        // so the native LWC chip must stay hidden.
        !nativeLabelHiddenRef.current;
      const showLine =
        s.lastPriceDisplay === "line" || s.lastPriceDisplay === "value_line";
      if (s.candleStyle === "bars") {
        handle.series.applyOptions({
          upColor: s.bodyUpColor,
          downColor: s.bodyDownColor,
          lastValueVisible: showLast,
          priceLineVisible: showLine,
          priceLineColor: s.bodyUpColor,
          priceFormat: priceFormatFor(pane.symbol, s),
        } as never);
      } else if (s.candleStyle === "line") {
        handle.series.applyOptions({
          color: s.bodyUpColor,
          lastValueVisible: showLast,
          priceLineVisible: showLine,
          priceLineColor: s.bodyUpColor,
          priceFormat: priceFormatFor(pane.symbol, s),
        } as never);
      } else if (mainSeriesKind(s.candleStyle) === "candlestick") {
        const hollow = s.candleStyle === "hollow";
        handle.series.applyOptions({
          upColor: hollow || !s.bodyVisible ? "rgba(0,0,0,0)" : s.bodyUpColor,
          downColor: !s.bodyVisible ? "rgba(0,0,0,0)" : s.bodyDownColor,
          borderVisible: s.borderVisible,
          borderUpColor: s.borderUpColor,
          borderDownColor: s.borderDownColor,
          wickVisible: s.wickVisible,
          wickUpColor: s.wickUpColor,
          wickDownColor: s.wickDownColor,
          lastValueVisible: showLast,
          priceLineVisible: showLine,
          priceLineColor: s.borderUpColor,
          priceFormat: priceFormatFor(pane.symbol, s),
        } as never);
      }

      // Restore time view after option apply (placement / margins can reflow).
      if (logicalRange) {
        try {
          ts.applyOptions({ barSpacing });
          ts.setVisibleLogicalRange(logicalRange);
        } catch {
          /* ignore */
        }
      }
      if (!paneAuto && !s.lockPriceRatio) {
        if (rightPriceRange) {
          try {
            const scale = handle.chart.priceScale("right");
            scale.setAutoScale(false);
            scale.setVisibleRange(rightPriceRange);
          } catch {
            /* ignore */
          }
        }
        if (leftPriceRange) {
          try {
            const scale = handle.chart.priceScale("left");
            scale.setAutoScale(false);
            scale.setVisibleRange(leftPriceRange);
          } catch {
            /* ignore */
          }
        }
      }

      // Full data refresh only when bar coloring / scale lines actually change.
      const needsDataRefresh =
        prev.colorBasedOnPrevClose !== s.colorBasedOnPrevClose ||
        prev.bodyVisible !== s.bodyVisible ||
        prev.borderVisible !== s.borderVisible ||
        prev.wickVisible !== s.wickVisible ||
        prev.bodyUpColor !== s.bodyUpColor ||
        prev.bodyDownColor !== s.bodyDownColor ||
        prev.borderUpColor !== s.borderUpColor ||
        prev.borderDownColor !== s.borderDownColor ||
        prev.wickUpColor !== s.wickUpColor ||
        prev.wickDownColor !== s.wickDownColor ||
        prev.prevDayClose !== s.prevDayClose ||
        prev.highLowDisplay !== s.highLowDisplay ||
        prev.countdownToBarClose !== s.countdownToBarClose ||
        prev.pricePrecision !== s.pricePrecision;

      if (needsDataRefresh) {
        const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
        if (candles.length > 0) applyRef.current(candles, false);
        // applyFull must not steal the view — re-assert after it.
        if (logicalRange) {
          try {
            ts.applyOptions({ barSpacing });
            ts.setVisibleLogicalRange(logicalRange);
          } catch {
            /* ignore */
          }
        }
        if (!paneAuto && !s.lockPriceRatio && rightPriceRange) {
          try {
            const scale = handle.chart.priceScale("right");
            scale.setAutoScale(false);
            scale.setVisibleRange(rightPriceRange);
          } catch {
            /* ignore */
          }
        }
      }
    } catch {
      /* chart may be mid-teardown */
    }
    // Chart settings are applied in place; pane identity is intentionally stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, pane.id, pane.timeframe]);

  // Live-apply indicator settings (colors, periods, visibility) without rebuilding the chart.
  useEffect(() => {
    const series = indicatorSeries.current;
    for (const study of liveStudies) {
      const visible = studyIsVisible(study, pane.timeframe);
      if (study.type === "volume") {
        const vol = study.settings as IndicatorSettingsMap["volume"];
        const handle = getChart(pane.id);
        if (!handle) continue;
        const group = ensureVolumePlotStyle(
          handle.chart,
          series,
          study.id,
          vol,
          visible,
        );
        if (!group) continue;
        const nextStyle = volumePlotStyle(vol);
        if (nextStyle === "line") {
          group.plot.applyOptions({
            visible: visible && vol.volumeVisible,
            lastValueVisible: Boolean(vol.showScaleValues) && vol.volumeVisible,
            color: vol.upColor,
            lineWidth: 2,
          } as never);
        } else if (nextStyle === "candle") {
          group.plot.applyOptions({
            visible: visible && vol.volumeVisible,
            lastValueVisible: Boolean(vol.showScaleValues) && vol.volumeVisible,
            upColor: vol.upColor,
            downColor: vol.downColor,
            borderUpColor: vol.upColor,
            borderDownColor: vol.downColor,
            wickUpColor: vol.upColor,
            wickDownColor: vol.downColor,
          } as never);
        } else {
          group.plot.applyOptions({
            visible: visible && vol.volumeVisible,
            lastValueVisible: Boolean(vol.showScaleValues) && vol.volumeVisible,
          });
        }
        if (group.ma) {
          const look = lineAppearance({
            color: vol.maColor,
            opacity: vol.maOpacity,
            lineWidth: vol.maLineWidth,
            lineStyle: vol.maLineStyle,
          });
          group.ma.applyOptions({
            visible: visible && vol.maVisible,
            color: look.color,
            lineWidth: look.lineWidth,
            lineStyle: look.lineStyle,
          });
        }
      } else if (study.type === "vwap") {
        const vwap = study.settings as IndicatorSettingsMap["vwap"];
        const look = lineAppearance(vwap);
        series.vwap.get(study.id)?.applyOptions({
          visible: visible && vwap.visible !== false,
          lastValueVisible: Boolean(vwap.showScaleValues),
          color: look.color,
          lineWidth: look.lineWidth,
          lineStyle: look.lineStyle,
          priceFormat: overlayPriceFormat(pane.symbol, settings, vwap.precision),
        });
      } else if (study.type === "ema") {
        const ema = study.settings as IndicatorSettingsMap["ema"];
        const emaOn = visible && ema.visible !== false;
        const look = lineAppearance(ema);
        const group = series.ema.get(study.id);
        const emaFormat = overlayPriceFormat(pane.symbol, settings, ema.precision);
        group?.line.applyOptions({
          visible: emaOn,
          lastValueVisible: Boolean(ema.showScaleValues),
          color: look.color,
          lineWidth: look.lineWidth,
          lineStyle: look.lineStyle,
          priceFormat: emaFormat,
        });
        group?.upper?.applyOptions({ visible: emaOn, priceFormat: emaFormat });
        group?.lower?.applyOptions({ visible: emaOn, priceFormat: emaFormat });
      } else if (study.type === "bb") {
        const bb = study.settings as IndicatorSettingsMap["bb"];
        const group = series.bb.get(study.id);
        const scale = Boolean(bb.showScaleValues);
        const bbFormat = overlayPriceFormat(pane.symbol, settings, bb.precision);
        const applyLine = (
          line: LineSeriesApi | undefined,
          style: typeof bb.basis,
          on: boolean,
        ) => {
          if (!line) return;
          const look = lineAppearance(style);
          line.applyOptions({
            visible: visible && on,
            lastValueVisible: scale && on,
            color: look.color,
            lineWidth: look.lineWidth,
            lineStyle: look.lineStyle,
            priceFormat: bbFormat,
          });
        };
        applyLine(group?.basis, bb.basis, bb.basisVisible);
        applyLine(group?.upper, bb.upper, bb.upperVisible);
        applyLine(group?.lower, bb.lower, bb.lowerVisible);
      } else if (study.type === "rsi") {
        const rsi = study.settings as IndicatorSettingsMap["rsi"];
        const look = lineAppearance(rsi);
        series.rsi.get(study.id)?.applyOptions({
          visible,
          color: look.color,
          lineWidth: look.lineWidth,
          lineStyle: look.lineStyle,
        });
      } else if (study.type === "stoch") {
        const stoch = study.settings as IndicatorSettingsMap["stoch"];
        const group = series.stoch.get(study.id);
        if (!group) continue;
        const scale = Boolean(stoch.showScaleValues);
        const lo = Math.min(stoch.upper.level, stoch.lower.level);
        group.bg.applyOptions({
          visible: visible && stoch.backgroundVisible,
          baseValue: { type: "price", price: lo },
          topFillColor1: applyColorOpacity(stoch.backgroundColor, stoch.backgroundOpacity),
          topFillColor2: applyColorOpacity(stoch.backgroundColor, stoch.backgroundOpacity),
        });
        const kLook = lineAppearance(stoch.k);
        const dLook = lineAppearance(stoch.d);
        group.k.applyOptions({
          visible: visible && stoch.kVisible !== false,
          lastValueVisible: scale,
          color: kLook.color,
          lineWidth: kLook.lineWidth,
          lineStyle: kLook.lineStyle,
        });
        group.d.applyOptions({
          visible: visible && stoch.dVisible !== false,
          lastValueVisible: scale,
          color: dLook.color,
          lineWidth: dLook.lineWidth,
          lineStyle: dLook.lineStyle,
        });
        const applyBand = (
          line: LineSeriesApi,
          band: typeof stoch.upper,
        ) => {
          const look = lineAppearance(band);
          line.applyOptions({
            visible: visible && band.visible,
            color: look.color,
            lineWidth: look.lineWidth,
            lineStyle: look.lineStyle,
          });
        };
        applyBand(group.upper, stoch.upper);
        applyBand(group.middle, stoch.middle);
        applyBand(group.lower, stoch.lower);
      } else if (study.type === "atr") {
        const atr = study.settings as IndicatorSettingsMap["atr"];
        const look = lineAppearance(atr);
        series.atr.get(study.id)?.applyOptions({
          visible,
          color: look.color,
          lineWidth: look.lineWidth,
          lineStyle: look.lineStyle,
        });
      } else if (study.type === "adx") {
        const adx = study.settings as IndicatorSettingsMap["adx"];
        const look = lineAppearance(adx);
        series.adx.get(study.id)?.applyOptions({
          visible,
          lastValueVisible: adx.showScaleValues !== false,
          color: look.color,
          lineWidth: look.lineWidth,
          lineStyle: look.lineStyle,
        });
      } else if (study.type === "pmo") {
        const pmo = study.settings as IndicatorSettingsMap["pmo"];
        const group = series.pmo.get(study.id);
        if (group) {
          const pmoLook = lineAppearance(pmo.pmo);
          const signalLook = lineAppearance(pmo.signal);
          group.pmo.applyOptions({
            visible: visible && pmo.pmoVisible,
            lastValueVisible: Boolean(pmo.showScaleValues),
            color: pmoLook.color,
            lineWidth: pmoLook.lineWidth,
            lineStyle: pmoLook.lineStyle,
          });
          group.signal.applyOptions({
            visible: visible && pmo.signalVisible,
            lastValueVisible: Boolean(pmo.showScaleValues),
            color: signalLook.color,
            lineWidth: signalLook.lineWidth,
            lineStyle: signalLook.lineStyle,
          });
          if (group.zero) {
            const zeroLook = lineAppearance(pmo.zeroLine);
            group.zero.applyOptions({
              visible: visible && pmo.zeroLine.visible,
              color: zeroLook.color,
              lineWidth: zeroLook.lineWidth,
              lineStyle: zeroLook.lineStyle,
            });
          }
        }
      }
    }
    // Recompute series data (periods, sources, etc.) with the latest settings.
    const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    if (candles.length > 0) applyRef.current(candles, false);
    // Study details are represented by stable signature keys; refs supply the
    // current pane and settings to the imperative chart update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studiesSettingsKey, volumePlotStylesKey, pane.timeframe]);

  const prevReplayRef = useRef(replay);
  useEffect(() => {
    const wasActive = prevReplayRef.current && prevReplayRef.current.paneId === pane.id;
    prevReplayRef.current = replay;
    if (wasActive && !replay) {
      const all = mawsFeed.getCandles(pane.symbol, pane.timeframe);
      if (all.length > 0) applyRef.current(all, false);
      return;
    }
    if (!replay || replay.paneId !== pane.id) return;
    const all = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    applyRef.current(all.slice(0, Math.max(2, replay.index + 1)), false);
  }, [replay, pane.id, pane.symbol, pane.timeframe]);

  return (
    <div className="relative z-10 h-full min-h-0 w-full">
      {debug ? <div data-testid="candle-debug" className="pointer-events-none absolute left-2 bottom-2 z-40 rounded bg-black/70 px-2 py-1 font-mono text-[10px] leading-4 text-emerald-300">{debug}</div> : null}
      <div
        ref={legendRef}
        className={`legend pointer-events-auto absolute left-2 top-1 z-30 flex flex-wrap items-center gap-x-2 text-[11px] text-[#d1d4dc] ${
          showMainLegend &&
          (settings.showLogo ||
            settings.showTitle ||
            settings.showMarketStatus ||
            settings.showChartValues ||
            settings.showBarChange ||
            settings.showVolume ||
            settings.showLastDayChange)
            ? ""
            : "hidden"
        }`}
      />
      <div
        ref={wrapRef}
        className="h-full w-full"
        data-active={active ? "true" : "false"}
      />
      <div
        ref={countdownRef}
        className="pointer-events-none absolute z-20 rounded-[2px] text-center tabular-nums"
        style={{ display: "none", flexDirection: "column", overflow: "hidden" }}
        aria-hidden
      >
        <span className="block truncate px-1 font-semibold" />
        <span className="block truncate px-1 font-bold" />
      </div>
      {legendTooltip &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] rounded border border-[#363a45] bg-[#2a2e39] px-3 py-1.5 text-[12px] font-medium text-[#e0e3eb] shadow-lg"
            style={{
              left: legendTooltip.x,
              top: (legendRef.current?.getBoundingClientRect().bottom ?? legendTooltip.y) + 6,
              transform: "translateX(-50%)",
            }}
          >
            {legendTooltip.text}
          </div>,
          document.body,
        )}
    </div>
  );
});
