import { useAppStore } from "@/lib/store";
import { getSymbol } from "@/lib/maws/universe";
import {
  DEFAULT_SYMBOL_TRADING,
  type SymbolTradingSettings,
} from "@/types";

type LegacySymbolTrading = {
  margin?: number;
  leverage?: number;
  sizingMode?: string;
  marginPercent?: number;
  riskPercent?: number;
  qty?: number;
  defaultOrderType?: SymbolTradingSettings["defaultOrderType"];
  attachBrackets?: boolean;
  tpPercent?: number;
  slPercent?: number;
  confirmOrders?: boolean;
};

function normalizeSaved(saved: LegacySymbolTrading | undefined): Partial<SymbolTradingSettings> {
  if (!saved) return {};
  const sizingMode: SymbolTradingSettings["sizingMode"] =
    saved.sizingMode === "riskPercent" || saved.sizingMode === "percent"
      ? "percent"
      : "fixed";
  const rest = { ...saved };
  delete rest.riskPercent;
  delete rest.qty;
  delete rest.sizingMode;
  return {
    ...rest,
    sizingMode,
    margin: saved.margin ?? DEFAULT_SYMBOL_TRADING.margin,
    marginPercent: saved.marginPercent ?? saved.riskPercent ?? DEFAULT_SYMBOL_TRADING.marginPercent,
  };
}

/** Effective trading defaults for a symbol (per-asset override → chart defaults). */
export function resolveSymbolTrading(symbol: string): SymbolTradingSettings {
  const s = useAppStore.getState();
  const saved = normalizeSaved(s.symbolTrading[symbol] as LegacySymbolTrading | undefined);
  return {
    ...DEFAULT_SYMBOL_TRADING,
    ...saved,
    leverage: saved.leverage ?? s.chartSettings.defaultLeverage,
    margin: saved.margin ?? DEFAULT_SYMBOL_TRADING.margin,
    marginPercent: saved.marginPercent ?? DEFAULT_SYMBOL_TRADING.marginPercent,
    sizingMode: saved.sizingMode ?? DEFAULT_SYMBOL_TRADING.sizingMode,
  };
}

/** Margin (account currency) implied by current sizing mode. */
export function resolveMarginAmount(symbol: string): number {
  const t = resolveSymbolTrading(symbol);
  if (t.sizingMode === "percent") {
    const balance = useAppStore.getState().mockBalance;
    return Math.max(0, balance * (t.marginPercent / 100));
  }
  return Math.max(0, t.margin);
}

/** Decimal places implied by a step size (handles exponential notation). */
function stepDecimals(step: number): number {
  const s = String(step);
  if (s.includes("e") || s.includes("E")) {
    const exp = Number(s.split(/e/i)[1]);
    return exp < 0 ? -exp : 0;
  }
  const dot = s.indexOf(".");
  return dot < 0 ? 0 : s.length - dot - 1;
}

/**
 * Floor a quantity onto an exchange LOT_SIZE step grid (e.g. 0.012331811 →
 * 0.0123 for stepSize 0.0001) so margin/leverage-derived sizes are always
 * valid order quantities. A missing/invalid step returns the qty unchanged;
 * a qty smaller than one step floors to 0 so it is rejected cleanly instead
 * of being submitted. Scaling is derived from the step's decimal places and
 * a relative epsilon absorbs float dust, so on-grid values (400 / 0.0001,
 * 0.29 / 0.01) never floor down a step.
 */
export function quantizeQtyToStep(qty: number, stepSize?: string | number): number {
  if (!Number.isFinite(qty) || qty <= 0) return 0;
  const stepStr = typeof stepSize === "string" ? stepSize : String(stepSize ?? "");
  const step = Number(stepStr);
  if (!Number.isFinite(step) || !(step > 0)) return qty;
  const d = stepDecimals(step);
  const scale = 10 ** d;
  const stepUnits = Math.round(step * scale); // exact integer step in 1e-d units
  const raw = (qty * scale) / stepUnits;
  const steps = Math.floor(raw + Math.abs(raw) * 1e-12);
  if (steps <= 0) return 0;
  return Number((steps * step).toFixed(d));
}

/** Effective qty step for a symbol: LOT_SIZE stepSize, else its price-tick precision. */
function qtyStepFor(symbol: string): string {
  const info = getSymbol(symbol);
  if (info.stepSize) return info.stepSize;
  // 10 ** -4 evaluates to 0.00009999999999999999, so rebuild the step from a
  // clean decimal string ("0.0001") to keep the scale math exact.
  return (10 ** -info.precision).toFixed(Math.max(0, info.precision));
}

/** Convert margin settings → order quantity at a given price. */
export function resolveOrderQty(symbol: string, price: number): number {
  if (!(price > 0)) return 0;
  const t = resolveSymbolTrading(symbol);
  const margin = resolveMarginAmount(symbol);
  const lev = Math.max(1, t.leverage);
  const qty = Number(((margin * lev) / price).toPrecision(8));
  return Math.max(0, quantizeQtyToStep(qty, qtyStepFor(symbol)));
}

/**
 * Qty for a long/short drawing: per-drawing inputs when set, else symbol trading defaults.
 */
export function resolvePositionOrderQty(
  symbol: string,
  price: number,
  drawing: {
    positionAccountSizeMode?: "default" | "custom";
    positionAccountSize?: number;
    positionLotSize?: number;
    positionRisk?: number;
    positionRiskUnit?: "percent" | "money";
    positionLeverage?: number;
  },
): number {
  if (!(price > 0)) return 0;
  const t = resolveSymbolTrading(symbol);
  const hasOverride =
    drawing.positionLotSize != null ||
    drawing.positionRisk != null ||
    drawing.positionLeverage != null ||
    drawing.positionAccountSizeMode != null ||
    drawing.positionAccountSize != null ||
    drawing.positionRiskUnit != null;
  if (!hasOverride) return resolveOrderQty(symbol, price);

  const balance = useAppStore.getState().mockBalance;
  const account =
    drawing.positionAccountSizeMode === "custom" &&
    drawing.positionAccountSize != null &&
    drawing.positionAccountSize > 0
      ? drawing.positionAccountSize
      : balance;
  const riskUnit = drawing.positionRiskUnit ?? (t.sizingMode === "percent" ? "percent" : "money");
  const lot = drawing.positionLotSize ?? t.margin;
  const risk =
    drawing.positionRisk ??
    (riskUnit === "percent" ? t.marginPercent : t.margin);
  const margin =
    riskUnit === "percent" ? Math.max(0, account * (risk / 100)) : Math.max(0, risk || lot);
  const lev = Math.max(1, drawing.positionLeverage ?? t.leverage);
  const qty = Number(((margin * lev) / price).toPrecision(8));
  return Math.max(0, quantizeQtyToStep(qty, qtyStepFor(symbol)));
}

/** Label shown between Buy/Sell buttons. */
export function formatMarginLabel(symbol: string): string {
  const t = resolveSymbolTrading(symbol);
  if (t.sizingMode === "percent") {
    const n = t.marginPercent;
    return `${Number.isInteger(n) ? n : Number(n.toFixed(2))}%`;
  }
  const n = t.margin;
  return Number.isInteger(n) ? String(n) : Number(n.toFixed(2)).toString();
}

export function protectFromSettings(
  entry: number,
  side: "long" | "short",
  settings: SymbolTradingSettings,
): { tp: number | null; sl: number | null } {
  if (!settings.attachBrackets) return { tp: null, sl: null };
  const tpM = Math.max(0, settings.tpPercent) / 100;
  const slM = Math.max(0, settings.slPercent) / 100;
  if (side === "long") {
    return {
      tp: tpM > 0 ? entry * (1 + tpM) : null,
      sl: slM > 0 ? entry * (1 - slM) : null,
    };
  }
  return {
    tp: tpM > 0 ? entry * (1 - tpM) : null,
    sl: slM > 0 ? entry * (1 + slM) : null,
  };
}
