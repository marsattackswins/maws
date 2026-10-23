/**
 * vela-native-indicators.ts
 *
 * MAWS-registered Vela native indicators — types that are NOT in Vela's classic
 * catalog but ride the exact same native pipeline (legend row, settings dialog
 * via the gear, hide/show, object tree, pane management, persistence hooks).
 *
 *  - `order-blocks`: the LuxAlgo "Order Blocks & Breaker Blocks" port, computed
 *    over the chart's own bars (`lib/order-blocks.ts` incremental engine) and
 *    emitted as Vela drawing boxes + labels. Replay is handled by Vela for
 *    free — replay restarts the indicator over the truncated bar array.
 *  - `pmo`: the Price Momentum Oscillator (double-smoothed ROC + signal EMA),
 *    emitted as two line series on its own pane.
 *
 * Registered once at import (idempotent); import this module before charts mount.
 */

import {
  legendSettingsInput,
  legendValuesInput,
  legendTitle,
  registerNativeIndicator,
  scaleLabelsInput,
  scaleLabelsOn,
  stableSeriesId,
} from "@/lib/charting";
import type {
  NativeIndicator,
  NativeIndicatorContext,
  NativeIndicatorDescriptor,
} from "@/lib/charting";
import type { DrawingBox, DrawingLabel, DrawingLine, InputSchema, InputValue, SeriesSpec } from "@/lib/charting";
import { computePmo } from "@/lib/indicators";
import type { Candle, MaSource } from "@/types";
import {
  computeOrderBlocksLive,
  type ObConfig,
  type ObHistoryCache,
} from "@/lib/order-blocks";

type Inputs = Record<string, InputValue>;

const num = (v: Inputs, k: string, d: number): number =>
  typeof v[k] === "number" && Number.isFinite(v[k]) ? (v[k] as number) : d;
const str = (v: Inputs, k: string, d: string): string =>
  typeof v[k] === "string" && (v[k] as string).length > 0 ? (v[k] as string) : d;
const bool = (v: Inputs, k: string, d: boolean): boolean =>
  typeof v[k] === "boolean" ? (v[k] as boolean) : d;

/** Vela bars → MAWS Candle (seconds-epoch time, the order-blocks engine's unit). */
function toCandles(
  bars: readonly { time: number; open: number; high: number; low: number; close: number; volume?: number }[],
): Candle[] {
  return bars.map((b) => ({
    time: Math.floor(b.time / 1000),
    open: b.open,
    high: b.high,
    low: b.low,
    close: b.close,
    volume: b.volume ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// PMO
// ---------------------------------------------------------------------------

const PMO_SOURCE_OPTIONS = ["Close", "Open", "High", "Low", "HL2", "HLC3", "OHLC4", "HLCC4"];

function velaSourceToMaSource(s: string): MaSource {
  const map: Record<string, MaSource> = {
    Close: "close", Open: "open", High: "high", Low: "low",
    HL2: "hl2", HLC3: "hlc3", OHLC4: "ohlc4", HLCC4: "hlc3",
  };
  return map[s] ?? "close";
}

class PmoIndicator implements NativeIndicator {
  private ctx: NativeIndicatorContext | null = null;
  private inputs: Inputs = {};

  start(ctx: NativeIndicatorContext, inputs: Inputs): void {
    this.ctx = ctx;
    this.inputs = inputs;
    this.recompute();
  }
  onBars(): void {
    this.recompute();
  }
  onViewport(): void {}
  setInputs(inputs: Inputs): void {
    this.inputs = inputs;
    if (!this.ctx) return; // pre-start edits land at start()
    this.recompute();
  }
  suspend(): void {}
  resume(): void {
    this.recompute();
  }
  stop(): void {}

  private recompute(): void {
    if (!this.ctx) return;
    const bars = this.ctx.bars();
    const p1 = num(this.inputs, "period1", 35);
    const p2 = num(this.inputs, "period2", 20);
    const sigLen = num(this.inputs, "signalPeriod", 10);
    const source = velaSourceToMaSource(str(this.inputs, "source", "Close"));
    const pmoColor = str(this.inputs, "pmoColor", "#2962ff");
    const sigColor = str(this.inputs, "signalColor", "#ff9800");

    const { pmo, signal } = computePmo(toCandles(bars), p1, p2, sigLen, source);
    const toPoints = (values: (number | null)[]) =>
      bars.map((b, i) => ({ time: b.time, value: values[i] ?? null }));
    // "Labels on price scale" — OFF by default, so the study's values stay off the
    // price axis until the user asks for them in the indicator's settings. The legend
    // chip names the instance after its settings (`PMO 35 20 10 Close`); the renderer
    // keeps the live numbers off the chip while that name is on.
    const display = { priceScale: scaleLabelsOn(this.inputs) };

    const series: SeriesSpec[] = [
      {
        id: stableSeriesId({ instanceId: "pmo", kind: "line", title: "PMO", ordinal: 0 }),
        title: "PMO",
        paneId: "",
        kind: "line",
        points: toPoints(pmo),
        style: { color: pmoColor, width: 2, lineStyle: "solid" },
        display,
      },
      {
        id: stableSeriesId({ instanceId: "pmo", kind: "line", title: "Signal", ordinal: 1 }),
        title: "Signal",
        paneId: "",
        kind: "line",
        points: toPoints(signal),
        style: { color: sigColor, width: 1, lineStyle: "solid" },
        display,
      },
    ];
    this.ctx.emit({ series });
  }
}

// The lengths and the source are what the instance IS — they ride in its legend name
// (`PMO 35 20 10 Close`). The two colors are look only.
const PMO_INPUTS: InputSchema[] = [
  { key: "period1", title: "PMO Length 1", type: "int", defval: 35, min: 1, max: 5000, step: 1, legend: true },
  { key: "period2", title: "PMO Length 2", type: "int", defval: 20, min: 1, max: 5000, step: 1, legend: true },
  { key: "signalPeriod", title: "Signal Length", type: "int", defval: 10, min: 1, max: 500, step: 1, legend: true },
  { key: "source", title: "Source", type: "string", defval: "Close", options: PMO_SOURCE_OPTIONS, legend: true },
  { key: "pmoColor", title: "PMO Color", type: "color", defval: "#2962ff" },
  { key: "signalColor", title: "Signal Color", type: "color", defval: "#ff9800" },
  legendSettingsInput(),
  legendValuesInput(),
  scaleLabelsInput(),
];

const pmoDescriptor: NativeIndicatorDescriptor = {
  type: "pmo",
  title: "PMO (Price Momentum Oscillator)",
  shortTitle: "PMO",
  paneHint: "new",
  overlay: false,
  multiInstance: true,
  inputsSchema: () => [...PMO_INPUTS],
  defaultInputs: () => Object.fromEntries(PMO_INPUTS.map((i) => [i.key, i.defval])),
  titleFor: (inputs) => legendTitle("PMO", PMO_INPUTS, inputs),
  create: () => new PmoIndicator(),
};

// ---------------------------------------------------------------------------
// Order Blocks
// ---------------------------------------------------------------------------

const BULL_DEFAULT = "#089981";
const BEAR_DEFAULT = "#f23645";

/** Apply 0–100 opacity onto a hex color. */
function withAlpha(hex: string, opacityPct: number): string {
  const a = Math.min(1, Math.max(0, opacityPct / 100));
  const c = hex.trim();
  const m = c.match(/^#([0-9a-f]{6})$/i);
  if (!m) return c;
  const r = parseInt(m[1]!.slice(0, 2), 16);
  const g = parseInt(m[1]!.slice(2, 4), 16);
  const b = parseInt(m[1]!.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function drawBox(
  id: string,
  left: number,
  right: number | null,
  top: number,
  bottom: number,
  fill: string,
  border: string,
  showBorder: boolean,
): DrawingBox {
  return {
    id,
    paneId: "", // stamped by the orchestrator
    xloc: "bar_time",
    left,
    top,
    right: right ?? left,
    bottom,
    extend: right == null ? "right" : "none",
    bgColor: fill,
    borderColor: showBorder ? border : "transparent",
    borderWidth: showBorder ? 1 : 0,
    borderStyle: "solid",
    textSize: "tiny",
    hAlign: "center",
    vAlign: "center",
    wrap: false,
    fontFamily: "default",
    bold: false,
    italic: false,
  };
}

class OrderBlocksIndicator implements NativeIndicator {
  private ctx: NativeIndicatorContext | null = null;
  private inputs: Inputs = {};
  private cache: ObHistoryCache = null;
  private cfgSig = "";

  start(ctx: NativeIndicatorContext, inputs: Inputs): void {
    this.ctx = ctx;
    this.inputs = inputs;
    this.recompute();
  }
  onBars(): void {
    this.recompute();
  }
  onViewport(): void {}
  setInputs(inputs: Inputs): void {
    this.inputs = inputs;
    if (!this.ctx) return;
    this.recompute();
  }
  suspend(): void {}
  resume(): void {
    this.recompute();
  }
  stop(): void {
    this.cache = null;
  }

  private config(): ObConfig {
    return {
      swingLookback: Math.max(3, Math.trunc(num(this.inputs, "swingLookback", 10))),
      showLastBull: Math.max(0, Math.trunc(num(this.inputs, "showLastBull", 3))),
      showLastBear: Math.max(0, Math.trunc(num(this.inputs, "showLastBear", 3))),
      useBody: bool(this.inputs, "useBody", false),
      showLabels: bool(this.inputs, "showLabels", true),
      requireVolumePivot: bool(this.inputs, "requireVolumePivot", false),
      volumePivotLength: Math.max(1, Math.trunc(num(this.inputs, "volumePivotLength", 5))),
      mitigationMethod: str(this.inputs, "mitigationMethod", "Wick") === "Close" ? "Close" : "Wick",
    };
  }

  private recompute(): void {
    if (!this.ctx) return;
    const bars = this.ctx.bars();
    if (bars.length === 0) {
      this.ctx.emit({ boxes: [], labels: [] });
      return;
    }
    const candles = toCandles(bars);
    const cfg = this.config();

    // Config change → full recompute (the incremental cache keys on the config,
    // and ctx.bars() is a live accessor, so onBars() calls keep it warm).
    const sig = JSON.stringify(cfg);
    if (sig !== this.cfgSig) {
      this.cfgSig = sig;
      this.cache = null;
    }

    const computed = computeOrderBlocksLive(candles, cfg, this.cache);
    this.cache = computed.cache;
    const { result } = computed;

    const bullColor = cfg.requireVolumePivot
      ? str(this.inputs, "detectorBullColor", "#169400")
      : str(this.inputs, "bullColor", BULL_DEFAULT);
    const bearColor = cfg.requireVolumePivot
      ? str(this.inputs, "detectorBearColor", "#ff1100")
      : str(this.inputs, "bearColor", BEAR_DEFAULT);
    const bullFill = withAlpha(bullColor, num(this.inputs, "opacity", 20));
    const bearFill = withAlpha(bearColor, num(this.inputs, "opacity", 20));
    const bullBorder = cfg.requireVolumePivot ? withAlpha(bullColor, 30) : bullColor;
    const bearBorder = cfg.requireVolumePivot ? withAlpha(bearColor, 30) : bearColor;
    const showBorder = bool(this.inputs, "showBorder", true);

    const boxes: DrawingBox[] = [];
    const lines: DrawingLine[] = [];
    result.displayed.forEach((ob, i) => {
      const isBull = ob.side === "bull";
      const fill = isBull ? bullFill : bearFill;
      const border = isBull ? bullBorder : bearBorder;
      if (cfg.requireVolumePivot) {
        const left = ob.loc * 1000;
        boxes.push(drawBox(`${this.ctx!.id}:box#${i}`, left, null, ob.top, ob.btm, fill, border, showBorder));
        lines.push({
          id: `${this.ctx!.id}:average#${i}`,
          paneId: "",
          xloc: "bar_time",
          x1: left,
          y1: (ob.top + ob.btm) / 2,
          x2: left + 1,
          y2: (ob.top + ob.btm) / 2,
          extend: "right",
          color: withAlpha(str(this.inputs, "averageColor", "#9598a1"), 63),
          invisible: false,
          width: Math.max(1, Math.trunc(num(this.inputs, "averageWidth", 1))),
          style: str(this.inputs, "averageStyle", "Solid") === "Dotted"
            ? "dotted"
            : str(this.inputs, "averageStyle", "Solid") === "Dashed"
              ? "dashed"
              : "solid",
          arrowLeft: false,
          arrowRight: false,
        });
        return;
      }
      const breakMs = ob.breakLoc != null ? ob.breakLoc * 1000 : null;
      // Original block (solid) up to the mitigation point, then the breaker
      // extending right — matching the previous MAWS rendering.
      boxes.push(drawBox(`${this.ctx!.id}:box#${i * 2}`, ob.loc * 1000, breakMs, ob.top, ob.btm, fill, border, showBorder));
      boxes.push(
        drawBox(
          `${this.ctx!.id}:box#${i * 2 + 1}`,
          breakMs ?? ob.loc * 1000,
          null,
          ob.top,
          ob.btm,
          // The breaker phase takes the opposite side's hue (the Pine rendering).
          withAlpha(isBull ? bearBorder : bullBorder, num(this.inputs, "opacity", 20)),
          isBull ? bearBorder : bullBorder,
          showBorder,
        ),
      );
    });

    const labels: DrawingLabel[] = [];
    if (cfg.showLabels) {
      for (const lab of result.labels) {
        if (lab.barIndex < 0 || lab.barIndex >= candles.length) continue;
        const t = candles[lab.barIndex].time * 1000;
        const bull = lab.side === "bull";
        labels.push({
          id: `${this.ctx!.id}:label#${labels.length}`,
          paneId: "",
          xloc: "bar_time",
          x: t,
          y: lab.price,
          yloc: "price",
          text: bull ? "\u25BC" : "\u25B2",
          style: "none",
          textColor: bull ? str(this.inputs, "bearColor", BEAR_DEFAULT) : str(this.inputs, "bullColor", BULL_DEFAULT),
          size: "tiny",
          textAlign: "center",
          fontFamily: "default",
          noFill: true,
        });
      }
    }

    this.ctx.emit({ boxes, lines, labels: cfg.requireVolumePivot ? [] : labels });
  }
}

// The lookback and the block counts are the instance's settings (`Order Blocks 10 3 3`);
// booleans, colors and the fill opacity are look only and stay out of the name.
const ORDER_BLOCKS_INPUTS: InputSchema[] = [
  { key: "swingLookback", title: "Swing Lookback", type: "int", defval: 10, min: 3, max: 500, step: 1, legend: true, when: { key: "requireVolumePivot", equals: false } },
  { key: "showLastBull", title: "Show Last Bullish OB", type: "int", defval: 3, min: 0, max: 50, step: 1, legend: true },
  { key: "showLastBear", title: "Show Last Bearish OB", type: "int", defval: 3, min: 0, max: 50, step: 1, legend: true },
  { key: "requireVolumePivot", title: "Use Volume Pivot Detector Logic", type: "bool", defval: false },
  { key: "volumePivotLength", title: "Volume Pivot Length", type: "int", defval: 5, min: 1, max: 500, step: 1, legend: true, when: { key: "requireVolumePivot", equals: true } },
  { key: "mitigationMethod", title: "Mitigation Method", type: "string", defval: "Wick", options: ["Wick", "Close"], when: { key: "requireVolumePivot", equals: true } },
  { key: "detectorBullColor", title: "Bullish Color", type: "color", defval: "#169400", when: { key: "requireVolumePivot", equals: true } },
  { key: "detectorBearColor", title: "Bearish Color", type: "color", defval: "#ff1100", when: { key: "requireVolumePivot", equals: true } },
  { key: "averageColor", title: "Average Line Color", type: "color", defval: "#9598a1", when: { key: "requireVolumePivot", equals: true } },
  { key: "averageStyle", title: "Average Line Style", type: "string", defval: "Solid", options: ["Solid", "Dashed", "Dotted"], when: { key: "requireVolumePivot", equals: true } },
  { key: "averageWidth", title: "Average Line Width", type: "int", defval: 1, min: 1, max: 5, step: 1, when: { key: "requireVolumePivot", equals: true } },
  { key: "useBody", title: "Use Candle Body", type: "bool", defval: false, when: { key: "requireVolumePivot", equals: false } },
  { key: "showLabels", title: "Show Historical Polarity Changes", type: "bool", defval: true, when: { key: "requireVolumePivot", equals: false } },
  { key: "bullColor", title: "Bullish Color", type: "color", defval: BULL_DEFAULT, when: { key: "requireVolumePivot", equals: false } },
  { key: "bearColor", title: "Bearish Color", type: "color", defval: BEAR_DEFAULT, when: { key: "requireVolumePivot", equals: false } },
  { key: "bullBreakColor", title: "Bullish Breaker Color", type: "color", defval: BEAR_DEFAULT, when: { key: "requireVolumePivot", equals: false } },
  { key: "bearBreakColor", title: "Bearish Breaker Color", type: "color", defval: BULL_DEFAULT, when: { key: "requireVolumePivot", equals: false } },
  { key: "opacity", title: "Fill Opacity %", type: "int", defval: 20, min: 0, max: 100, step: 1 },
  { key: "showBorder", title: "Show Border", type: "bool", defval: true },
  legendSettingsInput(),
  legendValuesInput(),
];

const orderBlocksDescriptor: NativeIndicatorDescriptor = {
  type: "order-blocks",
  title: "Order Blocks & Breaker Blocks",
  shortTitle: "Order Blocks",
  paneHint: "price",
  overlay: true,
  multiInstance: true,
  inputsSchema: () => [...ORDER_BLOCKS_INPUTS],
  defaultInputs: () => Object.fromEntries(ORDER_BLOCKS_INPUTS.map((i) => [i.key, i.defval])),
  titleFor: (inputs) => legendTitle("Order Blocks", ORDER_BLOCKS_INPUTS, inputs),
  create: () => new OrderBlocksIndicator(),
};

// Register once at import (registerNativeIndicator is idempotent per type).
registerNativeIndicator(pmoDescriptor);
registerNativeIndicator(orderBlocksDescriptor);
