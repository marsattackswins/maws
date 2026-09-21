export type Timeframe =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "1D"
  | "1W"
  | "1M";

export type LayoutCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type DrawingTool =
  | "cursor"
  | "zoom"
  | "trend"
  | "hray"
  | "fib"
  | "path"
  | "dcurve"
  | "long"
  | "short"
  | "rect"
  | "circle"
  | "arrowUp"
  | "arrowDown"
  | "text";

export type IndicatorId =
  | "volume"
  | "vwap"
  | "ema"
  | "bb"
  | "rsi"
  | "stoch"
  | "atr"
  | "adx"
  | "pmo"
  | "ob";

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Quote = {
  symbol: string;
  last: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePct: number;
  rsi: number | null;
  atr: number | null;
};

export type SymbolInfo = {
  symbol: string;
  base: string;
  quote: string;
  name: string;
  precision: number;
  /** Binance contract type when known. */
  contractType?: "PERPETUAL" | "TRADIFI_PERPETUAL";
  /** Binance underlying class when known (COIN, EQUITY, COMMODITY, …). */
  underlyingType?: string;
  /** LOT_SIZE stepSize from exchangeInfo — quantity must be a multiple of it. */
  stepSize?: string;
  /** LOT_SIZE minQty from exchangeInfo — quantity must not fall below it. */
  minQty?: string;
};

export type WatchlistGroup = {
  id: string;
  name: string;
  collapsed: boolean;
  symbols: string[];
};

export type ChartPoint = {
  time: number;
  price: number;
};

/** TradingView-style visibility ranges by resolution family. */
export type VisibilityBand = {
  enabled: boolean;
  min: number;
  max: number;
};

export type ObjectVisibility = {
  ticks: boolean;
  seconds: VisibilityBand;
  minutes: VisibilityBand;
  hours: VisibilityBand;
  days: VisibilityBand;
  weeks: VisibilityBand;
  months: VisibilityBand;
  ranges: boolean;
};

export const DEFAULT_OBJECT_VISIBILITY: ObjectVisibility = {
  ticks: true,
  seconds: { enabled: true, min: 1, max: 59 },
  minutes: { enabled: true, min: 1, max: 59 },
  hours: { enabled: true, min: 1, max: 24 },
  days: { enabled: true, min: 1, max: 366 },
  weeks: { enabled: true, min: 1, max: 52 },
  months: { enabled: true, min: 1, max: 12 },
  ranges: true,
};

export type DrawingLineStyle = "solid" | "dashed" | "dotted";
export type DrawingExtend = "none" | "left" | "right" | "both";
export type DrawingTextVAlign = "top" | "middle" | "bottom";
export type DrawingTextHAlign = "left" | "center" | "right";
export type FibLevelsFormat = "percents" | "values";

export type FibLevel = {
  level: number;
  color: string;
  visible: boolean;
};

export type PositionRiskUnit = "percent" | "money";
export type PositionAccountSizeMode = "default" | "custom";
export type PositionQtyPrecision = "default" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;

/** Which labels appear in long/short position info pills. */
export type PositionStatKey =
  | "tpOffset"
  | "tpPercent"
  | "tpTicks"
  | "tpPnl"
  | "slOffset"
  | "slPercent"
  | "slTicks"
  | "slPnl"
  | "qty"
  | "risk"
  | "rr";

export type Drawing = {
  id: string;
  tool: Exclude<DrawingTool, "cursor" | "zoom">;
  points: ChartPoint[];
  text?: string;
  color: string;
  hidden?: boolean;
  /** Study pane instance ID this drawing is attached to (undefined = main chart). */
  studyInstanceId?: string;
  lineWidth?: 1 | 2 | 3 | 4;
  lineStyle?: DrawingLineStyle;
  extend?: DrawingExtend;
  textColor?: string;
  textSize?: number;
  textBold?: boolean;
  textItalic?: boolean;
  textAlignV?: DrawingTextVAlign;
  textAlignH?: DrawingTextHAlign;
  showMiddlePoint?: boolean;
  showPriceLabels?: boolean;
  /** Rectangle / circle: fill color (supports rgba). */
  fillColor?: string;
  /** Rectangle / circle: show background fill. Rect default true; circle default false. */
  fillVisible?: boolean;
  /** Rectangle: middle horizontal line color. */
  middleLineColor?: string;
  /** Rectangle: middle horizontal line style. */
  middleLineStyle?: DrawingLineStyle;
  /** Fib: show trend line between anchors. */
  fibTrendVisible?: boolean;
  fibTrendColor?: string;
  fibTrendStyle?: DrawingLineStyle;
  /** Fib: level definitions (value + color + visibility). */
  fibLevels?: FibLevel[];
  fibUseOneColor?: boolean;
  fibOneColor?: string;
  fibBackground?: boolean;
  /** 0–100. */
  fibBackgroundOpacity?: number;
  fibReverse?: boolean;
  fibShowPrices?: boolean;
  fibShowLevels?: boolean;
  fibLevelsFormat?: FibLevelsFormat;
  fibLabelH?: DrawingTextHAlign;
  fibLabelV?: DrawingTextVAlign;
  fibShowText?: boolean;
  fibLogScale?: boolean;
  visibility?: ObjectVisibility;
  /** Long/short: unix time of the candle that first hit take-profit (freezes the live price line). */
  positionTargetHitTime?: number;
  /** Long/short style: stop-zone fill (supports rgba). */
  stopColor?: string;
  /** Long/short style: target-zone fill (supports rgba). */
  targetColor?: string;
  /** Long/short: shrink info pills. Default true. */
  compactStats?: boolean;
  /** Long/short: show info pills even when the drawing is not selected. Default false. */
  alwaysShowStats?: boolean;
  /** Long/short: which stats appear in the info pills. */
  positionStats?: PositionStatKey[];
  /** Long/short inputs — when unset, fall back to account / symbol trading defaults. */
  positionAccountSizeMode?: PositionAccountSizeMode;
  positionAccountSize?: number;
  positionLotSize?: number;
  positionRisk?: number;
  positionRiskUnit?: PositionRiskUnit;
  positionLeverage?: number;
  positionQtyPrecision?: PositionQtyPrecision;
};

export type ChartSettings = {
  candleStyle:
    | "hollow"
    | "solid"
    | "bars"
    | "line"
    | "area"
    | "baseline"
    | "heikinashi";
  colorBasedOnPrevClose: boolean;
  bodyVisible: boolean;
  borderVisible: boolean;
  wickVisible: boolean;
  bodyUpColor: string;
  bodyDownColor: string;
  borderUpColor: string;
  borderDownColor: string;
  wickUpColor: string;
  wickDownColor: string;
  pricePrecision: "default" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
  timezone: string;
  showLogo: boolean;
  showTitle: boolean;
  titleMode: "symbol" | "description";
  showMarketStatus: boolean;
  showChartValues: boolean;
  showBarChange: boolean;
  showVolume: boolean;
  showLastDayChange: boolean;
  showIndicatorLegend: boolean;
  showIndicatorInputs: boolean;
  showIndicatorValues: boolean;
  showIndicatorBackground: boolean;
  indicatorBackgroundOpacity: number;
  currencyUnit: "always" | "hover" | "never";
  scaleModes: "always" | "hover" | "never";
  lockPriceRatio: boolean;
  invertScale: boolean;
  priceScaleMode: "normal" | "logarithmic" | "percentage" | "indexed100";
  scalesPlacement: "right" | "left" | "both";
  noOverlappingLabels: boolean;
  showPlusButton: boolean;
  countdownToBarClose: boolean;
  lastPriceDisplay: "value" | "line" | "value_line" | "hidden";
  prevDayClose: "value" | "line" | "hidden";
  highLowDisplay: "value" | "line" | "hidden";
  bidAskDisplay: "value" | "line" | "hidden";
  dayOfWeekOnLabels: boolean;
  dateFormat: "MMM dd, yyyy" | "yyyy-MM-dd" | "dd/MM/yyyy" | "MM/dd/yyyy";
  timeHoursFormat: "12" | "24";
  backgroundColor: string;
  grid: boolean;
  vertGrid: boolean;
  horzGridColor: string;
  vertGridColor: string;
  paneSeparatorColor: string;
  crosshairColor: string;
  crosshairStyle: "solid" | "dashed" | "dotted";
  watermark: boolean;
  watermarkColor: string;
  scaleTextColor: string;
  scaleFontSize: number;
  scaleLineColor: string;
  navigationButtons: "always" | "hover" | "never";
  paneButtons: "always" | "hover" | "never";
  marginTop: number;
  marginBottom: number;
  marginRightBars: number;
  logScale: boolean;
  showBuySell: boolean;
  oneClickTrading: boolean;
  executionSound: boolean;
  executionSoundVolume: number;
  executionSoundName: "alarm" | "beep" | "chime";
  showOnlyRejectionNotifications: boolean;
  showLegend: boolean;
  showAlertLines: boolean;
  showOrderLines: boolean;
  showPositionLines: boolean;
  showTpSlLines: boolean;
  showLiqLines: boolean;
  reversePositionButton: boolean;
  projectMarketOrders: boolean;
  showPnlValue: boolean;
  pnlPositionsFormat: "pct" | "currency";
  pnlBracketsFormat: "pct" | "currency";
  executionMarks: boolean;
  executionLabels: boolean;
  extendedPriceLines: boolean;
  orderAlignment: "left" | "right";
  includeTradesInSnapshots: boolean;
  alertLineColor: string;
  buyLineColor: string;
  sellLineColor: string;
  tpLineColor: string;
  slLineColor: string;
  liqLineColor: string;
  defaultQty: number;
  defaultLeverage: number;
  showIdeas: boolean;
  ideasFilter: "all" | "following" | "mine";
  sessionBreaks: boolean;
  sessionBreakColor: string;
  sessionBreakLineStyle: DrawingLineStyle;
  sessionBreakLineWidth: 1 | 2 | 3 | 4;
  economicEvents: boolean;
  onlyFutureEvents: boolean;
  eventsBreaks: boolean;
  eventsBreakColor: string;
  latestNews: boolean;
  newsNotification: boolean;
};

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  candleStyle: "solid",
  colorBasedOnPrevClose: false,
  bodyVisible: true,
  borderVisible: true,
  wickVisible: true,
  bodyUpColor: "#b2b5be",
  bodyDownColor: "#787b86",
  borderUpColor: "#b2b5be",
  borderDownColor: "#787b86",
  wickUpColor: "#b2b5be",
  wickDownColor: "#787b86",
  pricePrecision: "default",
  timezone: "Africa/Casablanca",
  showLogo: true,
  showTitle: false,
  titleMode: "symbol",
  showMarketStatus: true,
  showChartValues: true,
  showBarChange: true,
  showVolume: true,
  showLastDayChange: false,
  showIndicatorLegend: true,
  showIndicatorInputs: false,
  showIndicatorValues: false,
  showIndicatorBackground: true,
  indicatorBackgroundOpacity: 100,
  currencyUnit: "never",
  scaleModes: "always",
  lockPriceRatio: false,
  invertScale: false,
  priceScaleMode: "normal",
  scalesPlacement: "right",
  noOverlappingLabels: true,
  showPlusButton: true,
  countdownToBarClose: false,
  lastPriceDisplay: "value_line",
  prevDayClose: "hidden",
  highLowDisplay: "hidden",
  bidAskDisplay: "hidden",
  dayOfWeekOnLabels: false,
  dateFormat: "MMM dd, yyyy",
  timeHoursFormat: "12",
  backgroundColor: "#000000",
  grid: true,
  vertGrid: false,
  horzGridColor: "#141414",
  vertGridColor: "#141414",
  paneSeparatorColor: "#222222",
  crosshairColor: "#758696",
  crosshairStyle: "dashed",
  watermark: true,
  watermarkColor: "rgba(209, 212, 220, 0.07)",
  scaleTextColor: "#d1d4dc",
  scaleFontSize: 12,
  scaleLineColor: "#222222",
  navigationButtons: "hover",
  paneButtons: "never",
  marginTop: 6,
  marginBottom: 16,
  marginRightBars: 6,
  logScale: false,
  showBuySell: true,
  oneClickTrading: false,
  executionSound: false,
  executionSoundVolume: 70,
  executionSoundName: "alarm",
  showOnlyRejectionNotifications: false,
  showLegend: true,
  showAlertLines: true,
  showOrderLines: true,
  showPositionLines: true,
  showTpSlLines: true,
  showLiqLines: true,
  reversePositionButton: true,
  projectMarketOrders: true,
  showPnlValue: true,
  pnlPositionsFormat: "pct",
  pnlBracketsFormat: "pct",
  executionMarks: true,
  executionLabels: false,
  extendedPriceLines: true,
  orderAlignment: "right",
  includeTradesInSnapshots: true,
  alertLineColor: "#ff9800",
  buyLineColor: "#089981",
  sellLineColor: "#f23645",
  tpLineColor: "#26a69a",
  slLineColor: "#ef5350",
  liqLineColor: "#ff6d00",
  defaultQty: 0.01,
  defaultLeverage: 10,
  showIdeas: false,
  ideasFilter: "all",
  sessionBreaks: true,
  sessionBreakColor: "#787b86",
  sessionBreakLineStyle: "dashed",
  sessionBreakLineWidth: 1,
  economicEvents: true,
  onlyFutureEvents: true,
  eventsBreaks: false,
  eventsBreakColor: "#f23645",
  latestNews: true,
  newsNotification: true,
};

export type ContextMenuState = {
  x: number;
  y: number;
  paneId: string;
  price: number;
  time: number | null;
} | null;

export type ReplayState = {
  paneId: string;
  index: number;
  total: number;
  playing: boolean;
  speed: number;
} | null;

export type ChartTemplate = {
  id: string;
  name: string;
  settings: ChartSettings;
};

export type DockId =
  | "strategy"
  | "alerts"
  | "calendar" // News & Calendar (combined)
  | "objects";

export type PriceAlert = {
  id: string;
  symbol: string;
  price: number;
  side: "above" | "below";
  enabled: boolean;
};

export type ChartOrder = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "limit" | "stop" | "market";
  price: number;
  qty: number;
  /** Optional idempotency key guarding against replayed submissions. */
  clientOrderId?: string;
};

export type ChartPosition = {
  id: string;
  symbol: string;
  side: "long" | "short";
  entry: number;
  qty: number;
  tp: number | null;
  sl: number | null;
  leverage: number;
  liq: number | null;
  /** Unix ms when the position was first opened. */
  openedAt?: number;
};

export type OrderHistoryEntry = {
  id: string;
  time: number;
  closingTime?: number;
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit" | "stop";
  qty: number;
  price: number;
  limitPrice?: number | null;
  stopPrice?: number | null;
  fillPrice?: number;
  status: "filled" | "cancelled" | "rejected";
  leverage?: number;
  margin?: number;
  /** Optional idempotency key from the originating submission. */
  clientOrderId?: string;
};

export type BalanceHistoryEntry = {
  id: string;
  time: number;
  type: "margin_lock" | "margin_release" | "realized_pnl" | "deposit" | "withdrawal";
  amount: number;
  balanceAfter: number;
  note: string;
  symbol?: string;
};

/** Event-log style trading journal (Time + Text). */
export type JournalEntry = {
  id: string;
  time: number;
  text: string;
};

export type PaneIndicators = Record<IndicatorId, boolean>;

export type IndicatorLineWidth = 1 | 2 | 3 | 4;

/** Shared line appearance for multi-line studies. */
export type IndicatorLineStyleSettings = {
  color: string;
  /** 0–100 */
  opacity: number;
  lineWidth: IndicatorLineWidth;
  lineStyle: DrawingLineStyle;
};

export type VolumePlotStyle = "histogram" | "line" | "candle";

export type VolumeIndicatorSettings = {
  maLength: number;
  colorBasedOnPreviousClose: boolean;
  volumeVisible: boolean;
  /** How volume is drawn on the chart. */
  plotStyle: VolumePlotStyle;
  upColor: string;
  downColor: string;
  maVisible: boolean;
  maColor: string;
  maOpacity: number;
  maLineWidth: IndicatorLineWidth;
  maLineStyle: DrawingLineStyle;
  precision: "default" | number;
  showScaleValues: boolean;
  showStatusValues: boolean;
  showStatusInputs: boolean;
  visibility: ObjectVisibility;
};

export type MaSource = "close" | "open" | "high" | "low" | "hl2" | "hlc3" | "ohlc4";
export type MaSmoothingType = "none" | "sma" | "ema" | "smma" | "wma";
export type VwapAnchorPeriod = "session" | "week" | "month";

export type VwapIndicatorSettings = {
  hideOn1DOrAbove: boolean;
  anchorPeriod: VwapAnchorPeriod;
  source: MaSource;
  offset: number;
  visible: boolean;
  color: string;
  opacity: number;
  lineWidth: IndicatorLineWidth;
  lineStyle: DrawingLineStyle;
  precision: "default" | number;
  showScaleValues: boolean;
  showStatusValues: boolean;
  showStatusInputs: boolean;
  timeframe: "chart";
  waitForTimeframeCloses: boolean;
  visibility: ObjectVisibility;
};

export type EmaIndicatorSettings = {
  period: number;
  source: MaSource;
  offset: number;
  smoothingType: MaSmoothingType;
  smoothingLength: number;
  bbStdDev: number;
  /** Show the EMA plot */
  visible: boolean;
  color: string;
  opacity: number;
  lineWidth: IndicatorLineWidth;
  lineStyle: DrawingLineStyle;
  precision: "default" | number;
  showScaleValues: boolean;
  showStatusValues: boolean;
  showStatusInputs: boolean;
  /** Reserved — only "chart" is supported today */
  timeframe: "chart";
  waitForTimeframeCloses: boolean;
  visibility: ObjectVisibility;
};

export type BbMaType = "sma" | "ema" | "smma" | "wma";

export type BbIndicatorSettings = {
  period: number;
  maType: BbMaType;
  source: MaSource;
  mult: number;
  offset: number;
  basis: IndicatorLineStyleSettings;
  upper: IndicatorLineStyleSettings;
  lower: IndicatorLineStyleSettings;
  basisVisible: boolean;
  upperVisible: boolean;
  lowerVisible: boolean;
  backgroundVisible: boolean;
  backgroundColor: string;
  /** 0–100 */
  backgroundOpacity: number;
  precision: "default" | number;
  showScaleValues: boolean;
  showStatusValues: boolean;
  showStatusInputs: boolean;
  timeframe: "chart";
  waitForTimeframeCloses: boolean;
  visibility: ObjectVisibility;
};

export type RsiIndicatorSettings = {
  period: number;
  color: string;
  opacity: number;
  lineWidth: IndicatorLineWidth;
  lineStyle: DrawingLineStyle;
  upperLevel: number;
  lowerLevel: number;
  visibility: ObjectVisibility;
};

export type StochBandSettings = IndicatorLineStyleSettings & {
  visible: boolean;
  level: number;
};

export type StochIndicatorSettings = {
  length: number;
  kSmoothing: number;
  dSmoothing: number;
  k: IndicatorLineStyleSettings;
  d: IndicatorLineStyleSettings;
  kVisible: boolean;
  dVisible: boolean;
  upper: StochBandSettings;
  middle: StochBandSettings;
  lower: StochBandSettings;
  backgroundVisible: boolean;
  backgroundColor: string;
  /** 0–100 */
  backgroundOpacity: number;
  /** Decimal places on scale; "default" = 2 */
  precision: "default" | number;
  /** Labels on price scale */
  showScaleValues: boolean;
  /** Values in status line / legend */
  showStatusValues: boolean;
  /** Inputs in status line / legend */
  showStatusInputs: boolean;
  visibility: ObjectVisibility;
};

export type AtrIndicatorSettings = {
  period: number;
  color: string;
  opacity: number;
  lineWidth: IndicatorLineWidth;
  lineStyle: DrawingLineStyle;
  visibility: ObjectVisibility;
};

export type AdxIndicatorSettings = {
  period: number;
  color: string;
  opacity: number;
  lineWidth: IndicatorLineWidth;
  lineStyle: DrawingLineStyle;
  /** Show last value on the price scale */
  showScaleValues: boolean;
  visibility: ObjectVisibility;
};

export type PmoIndicatorSettings = {
  period1: number;
  period2: number;
  signalPeriod: number;
  source: MaSource;
  pmo: IndicatorLineStyleSettings;
  signal: IndicatorLineStyleSettings;
  pmoVisible: boolean;
  signalVisible: boolean;
  zeroLine: IndicatorLineStyleSettings & { level: number; visible: boolean };
  precision: "default" | number;
  showScaleValues: boolean;
  showStatusValues: boolean;
  showStatusInputs: boolean;
  visibility: ObjectVisibility;
};

export type ObIndicatorSettings = {
  /** Pine 'Swing Lookback' (minval 3). */
  swingLookback: number;
  /** Pine 'Show Last Bullish OB' (minval 0). */
  showLastBull: number;
  /** Pine 'Show Last Bearish OB' (minval 0). */
  showLastBear: number;
  /** Pine 'Use Candle Body'. */
  useBody: boolean;
  /** Pine 'Show Historical Polarity Changes'. */
  showLabels: boolean;
  /** Regular bullish blocks (Pine bullCss). `opacity` is the fill; borders are opaque. */
  bull: IndicatorLineStyleSettings;
  /** Breaker phase of bullish blocks (Pine bullBreakCss). */
  bullBreak: IndicatorLineStyleSettings;
  /** Regular bearish blocks (Pine bearCss). */
  bear: IndicatorLineStyleSettings;
  /** Breaker phase of bearish blocks (Pine bearBreakCss). */
  bearBreak: IndicatorLineStyleSettings;
  showStatusValues: boolean;
  showStatusInputs: boolean;
  visibility: ObjectVisibility;
};

export type IndicatorSettingsMap = {
  volume: VolumeIndicatorSettings;
  vwap: VwapIndicatorSettings;
  ema: EmaIndicatorSettings;
  bb: BbIndicatorSettings;
  rsi: RsiIndicatorSettings;
  stoch: StochIndicatorSettings;
  atr: AtrIndicatorSettings;
  adx: AdxIndicatorSettings;
  pmo: PmoIndicatorSettings;
  ob: ObIndicatorSettings;
};

/** One plotted study on a chart pane (multiple of the same type allowed). */
export type IndicatorInstance = {
  id: string;
  type: IndicatorId;
  hidden?: boolean;
  settings: IndicatorSettingsMap[IndicatorId];
};

const DEFAULT_LINE = (
  color: string,
  extras: Partial<IndicatorLineStyleSettings> = {},
): IndicatorLineStyleSettings => ({
  color,
  opacity: 100,
  lineWidth: 1,
  lineStyle: "solid",
  ...extras,
});

export const DEFAULT_INDICATOR_SETTINGS: IndicatorSettingsMap = {
  volume: {
    maLength: 20,
    colorBasedOnPreviousClose: true,
    volumeVisible: true,
    plotStyle: "histogram",
    upColor: "rgba(38, 166, 154, 0.5)",
    downColor: "rgba(239, 83, 80, 0.5)",
    maVisible: true,
    maColor: "#ffffff",
    maOpacity: 100,
    maLineWidth: 1,
    maLineStyle: "solid",
    precision: "default",
    showScaleValues: false,
    showStatusValues: true,
    showStatusInputs: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  vwap: {
    hideOn1DOrAbove: false,
    anchorPeriod: "session",
    source: "hlc3",
    offset: 0,
    visible: true,
    color: "#2962ff",
    opacity: 100,
    lineWidth: 1,
    lineStyle: "solid",
    precision: "default",
    showScaleValues: true,
    showStatusValues: true,
    showStatusInputs: true,
    timeframe: "chart",
    waitForTimeframeCloses: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  ema: {
    period: 9,
    source: "close",
    offset: 0,
    smoothingType: "none",
    smoothingLength: 14,
    bbStdDev: 2,
    visible: true,
    color: "#2962ff",
    opacity: 100,
    lineWidth: 1,
    lineStyle: "solid",
    precision: "default",
    showScaleValues: true,
    showStatusValues: true,
    showStatusInputs: true,
    timeframe: "chart",
    waitForTimeframeCloses: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  bb: {
    period: 20,
    maType: "sma",
    source: "close",
    mult: 2,
    offset: 0,
    basis: DEFAULT_LINE("#2962ff"),
    upper: DEFAULT_LINE("#f23645"),
    lower: DEFAULT_LINE("#089981"),
    basisVisible: true,
    upperVisible: true,
    lowerVisible: true,
    backgroundVisible: false,
    backgroundColor: "#2962ff",
    backgroundOpacity: 10,
    precision: "default",
    showScaleValues: true,
    showStatusValues: true,
    showStatusInputs: true,
    timeframe: "chart",
    waitForTimeframeCloses: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  rsi: {
    period: 14,
    color: "#ab47bc",
    opacity: 100,
    lineWidth: 1,
    lineStyle: "solid",
    upperLevel: 70,
    lowerLevel: 30,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  stoch: {
    length: 14,
    kSmoothing: 1,
    dSmoothing: 3,
    k: DEFAULT_LINE("#2962ff"),
    d: DEFAULT_LINE("#ff9800"),
    kVisible: true,
    dVisible: true,
    upper: { visible: true, level: 80, ...DEFAULT_LINE("#787b86", { lineStyle: "dashed" }) },
    middle: {
      visible: true,
      level: 50,
      ...DEFAULT_LINE("#4c525e", { opacity: 70, lineStyle: "dashed" }),
    },
    lower: { visible: true, level: 20, ...DEFAULT_LINE("#787b86", { lineStyle: "dashed" }) },
    backgroundVisible: true,
    backgroundColor: "#787b86",
    backgroundOpacity: 10,
    precision: "default",
    showScaleValues: true,
    showStatusValues: true,
    showStatusInputs: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  atr: {
    period: 14,
    color: "#ffa726",
    opacity: 100,
    lineWidth: 1,
    lineStyle: "solid",
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  adx: {
    period: 14,
    color: "#26a69a",
    opacity: 100,
    lineWidth: 1,
    lineStyle: "solid",
    showScaleValues: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  pmo: {
    period1: 35,
    period2: 20,
    signalPeriod: 10,
    source: "close",
    pmo: DEFAULT_LINE("#2962ff"),
    signal: DEFAULT_LINE("#ff9800"),
    pmoVisible: true,
    signalVisible: true,
    zeroLine: {
      ...DEFAULT_LINE("#787b86", { lineStyle: "dashed" }),
      level: 0,
      visible: true,
    },
    precision: "default",
    showScaleValues: true,
    showStatusValues: true,
    showStatusInputs: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
  ob: {
    swingLookback: 10,
    showLastBull: 3,
    showLastBear: 3,
    useBody: false,
    showLabels: false,
    bull: DEFAULT_LINE("#2157f3", { opacity: 20 }),
    bullBreak: DEFAULT_LINE("#ff1100", { opacity: 20, lineStyle: "dashed" }),
    bear: DEFAULT_LINE("#ff5d00", { opacity: 20 }),
    bearBreak: DEFAULT_LINE("#0cb51a", { opacity: 20, lineStyle: "dashed" }),
    showStatusValues: true,
    showStatusInputs: true,
    visibility: { ...DEFAULT_OBJECT_VISIBILITY },
  },
};

/** Normalize Volume settings (fills new TV-style fields). */
export function normalizeVolumeSettings(
  raw: Partial<VolumeIndicatorSettings> | null | undefined,
): VolumeIndicatorSettings {
  const base = DEFAULT_INDICATOR_SETTINGS.volume;
  return {
    ...base,
    ...raw,
    maLength: raw?.maLength ?? base.maLength,
    colorBasedOnPreviousClose: raw?.colorBasedOnPreviousClose ?? base.colorBasedOnPreviousClose,
    volumeVisible: raw?.volumeVisible ?? base.volumeVisible,
    plotStyle:
      raw?.plotStyle === "line" || raw?.plotStyle === "candle" || raw?.plotStyle === "histogram"
        ? raw.plotStyle
        : base.plotStyle,
    upColor: raw?.upColor ?? base.upColor,
    downColor: raw?.downColor ?? base.downColor,
    maVisible: raw?.maVisible ?? base.maVisible,
    maColor: raw?.maColor ?? base.maColor,
    maOpacity: raw?.maOpacity ?? base.maOpacity,
    maLineWidth: raw?.maLineWidth ?? base.maLineWidth,
    maLineStyle: raw?.maLineStyle ?? base.maLineStyle,
    precision: raw?.precision ?? base.precision,
    showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
    showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
    showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
    visibility: { ...base.visibility, ...raw?.visibility },
  };
}

/** Normalize VWAP settings (fills new TV-style fields; no bands). */
export function normalizeVwapSettings(
  raw: Partial<VwapIndicatorSettings> | null | undefined,
): VwapIndicatorSettings {
  const base = DEFAULT_INDICATOR_SETTINGS.vwap;
  return {
    ...base,
    ...raw,
    hideOn1DOrAbove: raw?.hideOn1DOrAbove ?? base.hideOn1DOrAbove,
    anchorPeriod: raw?.anchorPeriod ?? base.anchorPeriod,
    source: raw?.source ?? base.source,
    offset: raw?.offset ?? base.offset,
    visible: raw?.visible ?? base.visible,
    color: raw?.color ?? base.color,
    opacity: raw?.opacity ?? base.opacity,
    lineWidth: raw?.lineWidth ?? base.lineWidth,
    lineStyle: raw?.lineStyle ?? base.lineStyle,
    precision: raw?.precision ?? base.precision,
    showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
    showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
    showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
    timeframe: "chart",
    waitForTimeframeCloses: raw?.waitForTimeframeCloses ?? base.waitForTimeframeCloses,
    visibility: { ...base.visibility, ...raw?.visibility },
  };
}

/** Normalize EMA settings (migrates legacy multi-line / minimal shape). */
export function normalizeEmaSettings(
  raw: Partial<EmaIndicatorSettings> & {
    lines?: Array<{
      period?: number;
      color?: string;
      opacity?: number;
      lineWidth?: IndicatorLineWidth;
      lineStyle?: DrawingLineStyle;
    }>;
  } | null | undefined,
): EmaIndicatorSettings {
  const base = DEFAULT_INDICATOR_SETTINGS.ema;
  const legacy = raw?.lines?.[0];
  const rest = { ...(raw ?? {}) } as Partial<EmaIndicatorSettings>;
  delete (rest as Partial<EmaIndicatorSettings> & { lines?: unknown }).lines;
  return {
    ...base,
    ...rest,
    period: raw?.period ?? legacy?.period ?? base.period,
    source: raw?.source ?? base.source,
    offset: raw?.offset ?? base.offset,
    smoothingType: raw?.smoothingType ?? base.smoothingType,
    smoothingLength: raw?.smoothingLength ?? base.smoothingLength,
    bbStdDev: raw?.bbStdDev ?? base.bbStdDev,
    visible: raw?.visible ?? true,
    color: raw?.color ?? legacy?.color ?? base.color,
    opacity: raw?.opacity ?? legacy?.opacity ?? base.opacity,
    lineWidth: raw?.lineWidth ?? legacy?.lineWidth ?? base.lineWidth,
    lineStyle: raw?.lineStyle ?? legacy?.lineStyle ?? base.lineStyle,
    precision: raw?.precision ?? base.precision,
    showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
    showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
    showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
    timeframe: "chart",
    waitForTimeframeCloses: raw?.waitForTimeframeCloses ?? base.waitForTimeframeCloses,
    visibility: { ...base.visibility, ...raw?.visibility },
  };
}

/** Normalize Bollinger Bands settings (fills new TV-style fields). */
export function normalizeBbSettings(
  raw: Partial<BbIndicatorSettings> | null | undefined,
): BbIndicatorSettings {
  const base = DEFAULT_INDICATOR_SETTINGS.bb;
  return {
    ...base,
    ...raw,
    period: raw?.period ?? base.period,
    maType: raw?.maType ?? base.maType,
    source: raw?.source ?? base.source,
    mult: raw?.mult ?? base.mult,
    offset: raw?.offset ?? base.offset,
    basis: { ...base.basis, ...raw?.basis },
    upper: { ...base.upper, ...raw?.upper },
    lower: { ...base.lower, ...raw?.lower },
    basisVisible: raw?.basisVisible ?? base.basisVisible,
    upperVisible: raw?.upperVisible ?? base.upperVisible,
    lowerVisible: raw?.lowerVisible ?? base.lowerVisible,
    backgroundVisible: raw?.backgroundVisible ?? base.backgroundVisible,
    backgroundColor: raw?.backgroundColor ?? base.backgroundColor,
    backgroundOpacity: raw?.backgroundOpacity ?? base.backgroundOpacity,
    precision: raw?.precision ?? base.precision,
    showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
    showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
    showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
    timeframe: "chart",
    waitForTimeframeCloses: raw?.waitForTimeframeCloses ?? base.waitForTimeframeCloses,
    visibility: { ...base.visibility, ...raw?.visibility },
  };
}

/** Normalize Stochastic settings (also migrates legacy multi-oscillator / flat-band shape). */
export function normalizeStochSettings(
  raw: Partial<StochIndicatorSettings> & {
    oscillators?: Array<{
      length?: number;
      kSmoothing?: number;
      dSmoothing?: number;
      k?: IndicatorLineStyleSettings;
      d?: IndicatorLineStyleSettings;
    }>;
    upperLevel?: number;
    lowerLevel?: number;
  } | null | undefined,
): StochIndicatorSettings {
  const base = DEFAULT_INDICATOR_SETTINGS.stoch;
  const legacy = raw?.oscillators?.[0];
  const legacyUpper = raw?.upperLevel;
  const legacyLower = raw?.lowerLevel;
  const rest = { ...(raw ?? {}) } as Partial<StochIndicatorSettings>;
  delete (rest as Partial<StochIndicatorSettings> & { oscillators?: unknown }).oscillators;
  delete (rest as Partial<StochIndicatorSettings> & { upperLevel?: number }).upperLevel;
  delete (rest as Partial<StochIndicatorSettings> & { lowerLevel?: number }).lowerLevel;
  const mergeBand = (
    fallback: StochBandSettings,
    band: Partial<StochBandSettings> | undefined,
    legacyLevel?: number,
  ): StochBandSettings => ({
    ...fallback,
    ...band,
    level: band?.level ?? legacyLevel ?? fallback.level,
    visible: band?.visible ?? fallback.visible,
    color: band?.color ?? fallback.color,
    opacity: band?.opacity ?? fallback.opacity,
    lineWidth: band?.lineWidth ?? fallback.lineWidth,
    lineStyle: band?.lineStyle ?? fallback.lineStyle,
  });

  return {
    ...base,
    ...rest,
    length: raw?.length ?? legacy?.length ?? base.length,
    kSmoothing: raw?.kSmoothing ?? legacy?.kSmoothing ?? base.kSmoothing,
    dSmoothing: raw?.dSmoothing ?? legacy?.dSmoothing ?? base.dSmoothing,
    k: { ...base.k, ...legacy?.k, ...raw?.k },
    d: { ...base.d, ...legacy?.d, ...raw?.d },
    kVisible: raw?.kVisible ?? true,
    dVisible: raw?.dVisible ?? true,
    upper: mergeBand(base.upper, raw?.upper, legacyUpper),
    middle: mergeBand(base.middle, raw?.middle),
    lower: mergeBand(base.lower, raw?.lower, legacyLower),
    backgroundVisible: raw?.backgroundVisible ?? base.backgroundVisible,
    backgroundColor: raw?.backgroundColor ?? base.backgroundColor,
    backgroundOpacity: raw?.backgroundOpacity ?? base.backgroundOpacity,
    precision: raw?.precision ?? base.precision,
    showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
    showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
    showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
    visibility: { ...base.visibility, ...raw?.visibility },
  };
}

/** Normalize PMO settings (fills new TV-style fields). */
export function normalizePmoSettings(
  raw: Partial<PmoIndicatorSettings> | null | undefined,
): PmoIndicatorSettings {
  const base = DEFAULT_INDICATOR_SETTINGS.pmo;
  return {
    ...base,
    ...raw,
    period1: raw?.period1 ?? base.period1,
    period2: raw?.period2 ?? base.period2,
    signalPeriod: raw?.signalPeriod ?? base.signalPeriod,
    source: raw?.source ?? base.source,
    pmo: { ...base.pmo, ...raw?.pmo },
    signal: { ...base.signal, ...raw?.signal },
    pmoVisible: raw?.pmoVisible ?? base.pmoVisible,
    signalVisible: raw?.signalVisible ?? base.signalVisible,
    zeroLine: { ...base.zeroLine, ...raw?.zeroLine },
    precision: raw?.precision ?? base.precision,
    showScaleValues: raw?.showScaleValues ?? base.showScaleValues,
    showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
    showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
    visibility: { ...base.visibility, ...raw?.visibility },
  };
}

/** Normalize order-block settings (deep-merges the four line-style groups). */
export function normalizeObSettings(
  raw: Partial<ObIndicatorSettings> | null | undefined,
): ObIndicatorSettings {
  const base = DEFAULT_INDICATOR_SETTINGS.ob;
  return {
    ...base,
    ...raw,
    swingLookback: raw?.swingLookback ?? base.swingLookback,
    showLastBull: raw?.showLastBull ?? base.showLastBull,
    showLastBear: raw?.showLastBear ?? base.showLastBear,
    useBody: raw?.useBody ?? base.useBody,
    showLabels: raw?.showLabels ?? base.showLabels,
    bull: { ...base.bull, ...raw?.bull },
    bullBreak: { ...base.bullBreak, ...raw?.bullBreak },
    bear: { ...base.bear, ...raw?.bear },
    bearBreak: { ...base.bearBreak, ...raw?.bearBreak },
    showStatusValues: raw?.showStatusValues ?? base.showStatusValues,
    showStatusInputs: raw?.showStatusInputs ?? base.showStatusInputs,
    visibility: { ...base.visibility, ...raw?.visibility },
  };
}

export type IndicatorTemplate = {
  id: string;
  name: string;
  /** Preferred: snapshot of studies on the pane. */
  studies?: Array<Pick<IndicatorInstance, "type" | "settings" | "hidden">>;
  /** Legacy on/off flags (migrated on hydrate). */
  indicators?: PaneIndicators;
  favorite?: boolean;
  lastUsedAt?: number;
};

export type ChartHover = {
  price: number;
  time: number | null;
  y: number;
  axisWidth: number;
} | null;

export type ChartPaneState = {
  id: string;
  symbol: string;
  timeframe: Timeframe;
  studies: IndicatorInstance[];
  /** @deprecated migrated to studies[] on hydrate */
  indicators?: PaneIndicators;
  /** @deprecated migrated to studies[].hidden on hydrate */
  hiddenIndicators?: Partial<Record<IndicatorId, boolean>>;
  drawings: Drawing[];
};

export type WorkspaceState = {
  layoutCount: LayoutCount;
  orientation: "h" | "v";
  /** Per-layout grid track weights, keyed by `${layoutCount}-${orientation}`. */
  layoutTracks: Record<string, { cols: number[]; rows: number[] }>;
  activePaneId: string;
  panes: ChartPaneState[];
};

export type LayoutSync = {
  symbol: boolean;
  interval: boolean;
  crosshair: boolean;
  time: boolean;
  dateRange: boolean;
};

export const DEFAULT_LAYOUT_SYNC: LayoutSync = {
  symbol: false,
  interval: false,
  crosshair: true,
  time: false,
  dateRange: false,
};

export type PaperAccountSettings = {
  marginControl: boolean;
  leverage: {
    stocks: number;
    futures: number;
    crypto: number;
    others: number;
  };
  futuresCommissionOn: boolean;
  commissionPerContract: number;
  othersCommissionOn: boolean;
  othersCommission: number;
  othersCommissionType: "fixed" | "percent";
};

export const DEFAULT_PAPER_ACCOUNT: PaperAccountSettings = {
  marginControl: true,
  leverage: {
    stocks: 2,
    futures: 20,
    crypto: 25,
    others: 25,
  },
  futuresCommissionOn: false,
  commissionPerContract: 0.01,
  othersCommissionOn: false,
  othersCommission: 0.0001,
  othersCommissionType: "fixed",
};

/** Per-symbol order sizing / trade defaults (Buy/Sell button settings). */
export type SymbolTradingSettings = {
  /** Margin in account currency when sizingMode is "fixed". */
  margin: number;
  leverage: number;
  sizingMode: "fixed" | "percent";
  /** Margin as % of equity when sizingMode is "percent". */
  marginPercent: number;
  defaultOrderType: "market" | "limit";
  attachBrackets: boolean;
  tpPercent: number;
  slPercent: number;
  confirmOrders: boolean;
};

export const DEFAULT_SYMBOL_TRADING: SymbolTradingSettings = {
  margin: 100,
  leverage: 10,
  sizingMode: "fixed",
  marginPercent: 1,
  defaultOrderType: "market",
  attachBrackets: true,
  tpPercent: 2,
  slPercent: 1,
  confirmOrders: false,
};

export type BuySellMenuState = {
  x: number;
  y: number;
  symbol: string;
} | null;
