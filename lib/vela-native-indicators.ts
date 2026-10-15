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
  registerNativeIndicator,
  stableSeriesId,
} from "@/lib/charting";
import type {
  NativeIndicator,
  NativeIndicatorContext,
  NativeIndicatorDescriptor,
} from "@/lib/charting";
import type { DrawingBox, DrawingLabel, InputValue, SeriesSpec } from "@/lib/charting";
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

    const series: SeriesSpec[] = [
      {
        id: stableSeriesId({ instanceId: "pmo", kind: "line", title: "PMO", ordinal: 0 }),
        title: "PMO",
        paneId: "",
        kind: "line",
        points: toPoints(pmo),
        style: { color: pmoColor, width: 2, lineStyle: "solid" },
      },
      {
        id: stableSeriesId({ instanceId: "pmo", kind: "line", title: "Signal", ordinal: 1 }),
        title: "Signal",
        paneId: "",
        kind: "line",
        points: toPoints(signal),
        style: { color: sigColor, width: 1, lineStyle: "solid" },
      },
    ];
    this.ctx.emit({ series });
  }
}

const pmoDescriptor: NativeIndicatorDescriptor = {
  type: "pmo",
  title: "PMO (Price Momentum Oscillator)",
  shortTitle: "PMO",
  paneHint: "new",
  overlay: false,
  multiInstance: true,
  inputsSchema: () => [
    { key: "period1", title: "PMO Length 1", type: "int", defval: 35, min: 1, max: 5000, step: 1 },
    { key: "period2", title: "PMO Length 2", type: "int", defval: 20, min: 1, max: 5000, step: 1 },
    { key: "signalPeriod", title: "Signal Length", type: "int", defval: 10, min: 1, max: 500, step: 1 },
    { key: "source", title: "Source", type: "string", defval: "Close", options: PMO_SOURCE_OPTIONS },
    { key: "pmoColor", title: "PMO Color", type: "color", defval: "#2962ff" },
    { key: "signalColor", title: "Signal Color", type: "color", defval: "#ff9800" },
  ],
  defaultInputs: () => ({
    period1: 35, period2: 20, signalPeriod: 10,
    source: "Close", pmoColor: "#2962ff", signalColor: "#ff9800",
  }),
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
    borderColor: border,
    borderWidth: 1,
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

    const { result } = computeOrderBlocksLive(candles, cfg, this.cache);

    const bullFill = withAlpha(str(this.inputs, "bullColor", BULL_DEFAULT), num(this.inputs, "opacity", 20));
    const bearFill = withAlpha(str(this.inputs, "bearColor", BEAR_DEFAULT), num(this.inputs, "opacity", 20));
    const bullBorder = str(this.inputs, "bullColor", BULL_DEFAULT);
    const bearBorder = str(this.inputs, "bearColor", BEAR_DEFAULT);
    const lastTime = bars[bars.length - 1]!.time;

    const boxes: DrawingBox[] = [];
    result.displayed.forEach((ob, i) => {
      const isBull = ob.side === "bull";
      const fill = isBull ? bullFill : bearFill;
      const border = isBull ? bullBorder : bearBorder;
      const breakMs = ob.breakLoc != null ? ob.breakLoc * 1000 : null;
      // Original block (solid) up to the mitigation point, then the breaker
      // extending right — matching the previous MAWS rendering.
      boxes.push(drawBox(`${this.ctx!.id}:box#${i * 2}`, ob.loc * 1000, breakMs, ob.top, ob.btm, fill, border));
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

    this.ctx.emit({ boxes, labels });
  }
}

const orderBlocksDescriptor: NativeIndicatorDescriptor = {
  type: "order-blocks",
  title: "Order Blocks & Breaker Blocks",
  shortTitle: "Order Blocks",
  paneHint: "price",
  overlay: true,
  multiInstance: true,
  inputsSchema: () => [
    { key: "swingLookback", title: "Swing Lookback", type: "int", defval: 10, min: 3, max: 500, step: 1 },
    { key: "showLastBull", title: "Show Last Bullish OB", type: "int", defval: 3, min: 0, max: 50, step: 1 },
    { key: "showLastBear", title: "Show Last Bearish OB", type: "int", defval: 3, min: 0, max: 50, step: 1 },
    { key: "useBody", title: "Use Candle Body", type: "bool", defval: false },
    { key: "showLabels", title: "Show Historical Polarity Changes", type: "bool", defval: true },
    { key: "bullColor", title: "Bullish Color", type: "color", defval: BULL_DEFAULT },
    { key: "bearColor", title: "Bearish Color", type: "color", defval: BEAR_DEFAULT },
    { key: "bullBreakColor", title: "Bullish Breaker Color", type: "color", defval: BEAR_DEFAULT },
    { key: "bearBreakColor", title: "Bearish Breaker Color", type: "color", defval: BULL_DEFAULT },
    { key: "opacity", title: "Fill Opacity %", type: "int", defval: 20, min: 0, max: 100, step: 1 },
  ],
  defaultInputs: () => ({
    swingLookback: 10, showLastBull: 3, showLastBear: 3,
    useBody: false, showLabels: true,
    bullColor: BULL_DEFAULT, bearColor: BEAR_DEFAULT,
    bullBreakColor: BEAR_DEFAULT, bearBreakColor: BULL_DEFAULT,
    opacity: 20,
  }),
  create: () => new OrderBlocksIndicator(),
};

// Register once at import (registerNativeIndicator is idempotent per type).
registerNativeIndicator(pmoDescriptor);
registerNativeIndicator(orderBlocksDescriptor);
