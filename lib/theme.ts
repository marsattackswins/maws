import { ColorType, CrosshairMode, LineStyle, type ChartOptions, type DeepPartial } from "lightweight-charts";

export const TV = {
  bg: "#000000",
  panel: "#111111",
  border: "#222222",
  hover: "#1a1a1a",
  active: "#2a2a2a",
  text: "#d1d4dc",
  muted: "#787b86",
  faint: "#4c525e",
  blue: "#2962ff",
  blueText: "#90caf9",
  green: "#089981",
  red: "#f23645",
  candle: "#b2b5be",
  grid: "#141414",
  crosshair: "#758696",
  vwap: "#2962ff",
  rsi: "#ab47bc",
  atr: "#ffa726",
} as const;

export const chartOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  layout: {
    background: { type: ColorType.Solid, color: TV.bg },
    textColor: TV.text,
    fontSize: 10,
    fontFamily: "Trebuchet MS, Roboto, Ubuntu, sans-serif",
    attributionLogo: false,
    panes: {
      separatorColor: TV.border,
      separatorHoverColor: "#3a3a3a",
      enableResize: true,
    },
  },
  grid: {
    vertLines: { visible: false },
    horzLines: { color: TV.grid },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: {
      color: TV.crosshair,
      width: 1,
      style: LineStyle.Dashed,
      visible: true,
      labelVisible: true,
      labelBackgroundColor: TV.active,
    },
    horzLine: {
      color: TV.crosshair,
      width: 1,
      style: LineStyle.Dashed,
      visible: true,
      labelVisible: true,
      labelBackgroundColor: TV.active,
    },
  },
  rightPriceScale: {
    borderColor: TV.border,
    scaleMargins: { top: 0.06, bottom: 0.16 },
  },
  timeScale: {
    borderColor: TV.border,
    timeVisible: true,
    secondsVisible: false,
    rightOffset: 6,
    barSpacing: 7,
    shiftVisibleRangeOnNewBar: true,
  },
  handleScroll: { vertTouchDrag: false },
  // Wheel zoom is handled in ChartCanvas (right-edge anchored, TradingView-style).
  handleScale: { mouseWheel: false, pinch: true },
};
