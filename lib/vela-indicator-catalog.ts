/**
 * vela-indicator-catalog.ts
 *
 * MAWS's mirror of Vela's full native-indicator catalog
 * (vela/src/core/native-indicators/classics + the volume/vpvr built-ins).
 *
 * The add-indicator menu lists every type here and mounts instances straight
 * through Vela's own pipeline (`chart.addNativeIndicator(type)`) — Vela owns
 * the legend row, settings dialog, hide/show and removal for these; they are
 * NOT MAWS store studies (PMO, Order Blocks and Volume stay MAWS-managed).
 *
 * Titles here are the pre-fetch fallback; the authoritative ones (plus
 * supported/present flags) come from `chart.availableNativeIndicators()`.
 */

export type VelaIndicatorCategory =
  | "Moving Averages"
  | "Bands & Channels"
  | "Oscillators"
  | "Trend"
  | "Volatility"
  | "Volume"
  | "Overlays & Levels";

export type VelaCatalogEntry = {
  type: string;
  title: string;
  category: VelaIndicatorCategory;
};

export const VELA_INDICATOR_CATEGORIES: VelaIndicatorCategory[] = [
  "Moving Averages",
  "Bands & Channels",
  "Oscillators",
  "Trend",
  "Volatility",
  "Volume",
  "Overlays & Levels",
];

export const VELA_INDICATOR_CATALOG: VelaCatalogEntry[] = [
  // Moving Averages (vela classics/averages.ts)
  { type: "sma", title: "Simple Moving Average", category: "Moving Averages" },
  { type: "ema", title: "Exponential Moving Average", category: "Moving Averages" },
  { type: "moving-average", title: "Moving Average", category: "Moving Averages" },
  { type: "rma", title: "Smoothed Moving Average", category: "Moving Averages" },
  { type: "zlema", title: "Zero-Lag Exponential Moving Average", category: "Moving Averages" },
  { type: "vidya", title: "Variable Index Dynamic Average", category: "Moving Averages" },
  { type: "ma-envelope", title: "Moving Average Envelope", category: "Moving Averages" },
  { type: "linear-regression", title: "Linear Regression Curve", category: "Moving Averages" },

  // Bands & Channels (vela classics/bands.ts)
  { type: "bollinger-bands", title: "Bollinger Bands", category: "Bands & Channels" },
  { type: "percent-b", title: "Bollinger Bands %B", category: "Bands & Channels" },
  { type: "bandwidth", title: "Bollinger Bands Width", category: "Bands & Channels" },
  { type: "keltner-channels", title: "Keltner Channels", category: "Bands & Channels" },
  { type: "donchian-channels", title: "Donchian Channels", category: "Bands & Channels" },
  { type: "chandelier-exit", title: "Chandelier Exit", category: "Bands & Channels" },
  { type: "chande-kroll-stop", title: "Chande Kroll Stop", category: "Bands & Channels" },
  { type: "supertrend", title: "SuperTrend", category: "Bands & Channels" },
  { type: "williams-alligator", title: "Williams Alligator", category: "Bands & Channels" },
  { type: "gator-oscillator", title: "Gator Oscillator", category: "Bands & Channels" },

  // Oscillators (vela classics/oscillators.ts)
  { type: "rsi", title: "Relative Strength Index", category: "Oscillators" },
  { type: "stochastic", title: "Stochastic", category: "Oscillators" },
  { type: "stochastic-rsi", title: "Stochastic RSI", category: "Oscillators" },
  { type: "macd", title: "MACD", category: "Oscillators" },
  { type: "ppo", title: "Percentage Price Oscillator", category: "Oscillators" },
  { type: "awesome-oscillator", title: "Awesome Oscillator", category: "Oscillators" },
  { type: "commodity-channel-index", title: "Commodity Channel Index", category: "Oscillators" },
  { type: "williams-percent-r", title: "Williams %R", category: "Oscillators" },
  { type: "chande-momentum-oscillator", title: "Chande Momentum Oscillator", category: "Oscillators" },
  { type: "connors-rsi", title: "Connors RSI", category: "Oscillators" },
  { type: "fisher-transform", title: "Fisher Transform", category: "Oscillators" },
  { type: "trix", title: "TRIX", category: "Oscillators" },
  { type: "true-strength-index", title: "True Strength Index", category: "Oscillators" },
  { type: "smi-ergodic", title: "SMI Ergodic Oscillator", category: "Oscillators" },
  { type: "schaff-trend-cycle", title: "Schaff Trend Cycle", category: "Oscillators" },
  { type: "know-sure-thing", title: "Know Sure Thing", category: "Oscillators" },
  { type: "coppock-curve", title: "Coppock Curve", category: "Oscillators" },
  { type: "detrended-price-oscillator", title: "Detrended Price Oscillator", category: "Oscillators" },
  { type: "rate-of-change", title: "Rate of Change", category: "Oscillators" },
  { type: "ultimate-oscillator", title: "Ultimate Oscillator", category: "Oscillators" },
  { type: "relative-vigor-index", title: "Relative Vigor Index", category: "Oscillators" },
  { type: "relative-volatility-index", title: "Relative Volatility Index", category: "Oscillators" },
  { type: "balance-of-power", title: "Balance of Power", category: "Oscillators" },
  { type: "elder-ray", title: "Elder Ray", category: "Oscillators" },
  { type: "ttm-squeeze", title: "TTM Squeeze", category: "Oscillators" },
  { type: "pmo", title: "PMO (Price Momentum Oscillator)", category: "Oscillators" },

  // Trend (vela classics/trend.ts)
  { type: "aroon", title: "Aroon", category: "Trend" },
  { type: "average-directional-index", title: "Average Directional Index", category: "Trend" },
  { type: "vortex-indicator", title: "Vortex Indicator", category: "Trend" },

  // Volatility (vela classics/volatility.ts)
  { type: "average-true-range", title: "Average True Range", category: "Volatility" },
  { type: "historical-volatility", title: "Historical Volatility", category: "Volatility" },
  { type: "chaikin-volatility", title: "Chaikin Volatility", category: "Volatility" },
  { type: "mass-index", title: "Mass Index", category: "Volatility" },
  { type: "standard-deviation", title: "Standard Deviation", category: "Volatility" },
  { type: "ulcer-index", title: "Ulcer Index", category: "Volatility" },
  { type: "choppiness-index", title: "Choppiness Index", category: "Volatility" },

  // Volume (vela classics/volume.ts + the vpvr built-in)
  { type: "on-balance-volume", title: "On Balance Volume", category: "Volume" },
  { type: "accumulation-distribution", title: "Accumulation / Distribution", category: "Volume" },
  { type: "chaikin-money-flow", title: "Chaikin Money Flow", category: "Volume" },
  { type: "chaikin-oscillator", title: "Chaikin Oscillator", category: "Volume" },
  { type: "ease-of-movement", title: "Ease of Movement", category: "Volume" },
  { type: "force-index", title: "Force Index", category: "Volume" },
  { type: "klinger-oscillator", title: "Klinger Oscillator", category: "Volume" },
  { type: "money-flow-index", title: "Money Flow Index", category: "Volume" },
  { type: "negative-volume-index", title: "Negative Volume Index", category: "Volume" },
  { type: "positive-volume-index", title: "Positive Volume Index", category: "Volume" },
  { type: "price-volume-trend", title: "Price Volume Trend", category: "Volume" },
  { type: "volume-oscillator", title: "Volume Oscillator", category: "Volume" },
  { type: "pvo", title: "Percentage Volume Oscillator", category: "Volume" },
  { type: "volume-flow-indicator", title: "Volume Flow Indicator", category: "Volume" },
  { type: "intraday-intensity", title: "Intraday Intensity", category: "Volume" },
  { type: "vpvr", title: "Volume Profile Visible Range", category: "Volume" },

  // Overlays & Levels (vela classics/overlays.ts)
  { type: "parabolic-sar", title: "Parabolic SAR", category: "Overlays & Levels" },
  { type: "vwap", title: "Volume Weighted Average Price", category: "Overlays & Levels" },
  { type: "pivot-points", title: "Pivot Points Standard", category: "Overlays & Levels" },
  { type: "52-week-high-low", title: "52 Week High/Low", category: "Overlays & Levels" },
  { type: "zigzag", title: "ZigZag", category: "Overlays & Levels" },
  { type: "williams-fractal", title: "Williams Fractal", category: "Overlays & Levels" },
  // Registered by MAWS (lib/vela-native-indicators.ts), not Vela's classic catalog.
  { type: "order-blocks", title: "Order Blocks & Breaker Blocks", category: "Overlays & Levels" },
];

const BY_TYPE = new Map(VELA_INDICATOR_CATALOG.map((e) => [e.type, e]));

export function velaCatalogEntry(type: string): VelaCatalogEntry | undefined {
  return BY_TYPE.get(type);
}

export function velaIndicatorCategory(type: string): VelaIndicatorCategory | "Other" {
  return BY_TYPE.get(type)?.category ?? "Other";
}

/** Catalog entries grouped by category, alphabetically inside each group. */
export function groupedVelaCatalog(): Array<{ category: VelaIndicatorCategory | "Other"; entries: VelaCatalogEntry[] }> {
  const groups = new Map<VelaIndicatorCategory | "Other", VelaCatalogEntry[]>();
  for (const entry of VELA_INDICATOR_CATALOG) {
    const list = groups.get(entry.category) ?? [];
    list.push(entry);
    groups.set(entry.category, list);
  }
  const order = (c: VelaIndicatorCategory | "Other"): number => {
    const i = VELA_INDICATOR_CATEGORIES.indexOf(c as VelaIndicatorCategory);
    return i === -1 ? VELA_INDICATOR_CATEGORIES.length : i;
  };
  return [...groups.entries()]
    .sort((a, b) => order(a[0]) - order(b[0]))
    .map(([category, entries]) => ({
      category,
      entries: [...entries].sort((a, b) => a.title.localeCompare(b.title)),
    }));
}
