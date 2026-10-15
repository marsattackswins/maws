/**
 * Theme tokens shared by the app chrome around the chart.
 *
 * (The chart-surface options that used to live here were Lightweight-Charts
 * config; the Vela chart takes its own theme through `new Vela(el, { theme })`
 * and `chart.setTheme`.)
 */

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
