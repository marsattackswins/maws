import "server-only";

import {
  abs,
  gt,
  lt,
  lte,
  matchesStep,
  mul,
  parseDec,
  toStr,
  type Dec,
} from "./decimal";
import type { ExchangeSymbolInfo } from "./types";

export interface SymbolConstraints {
  symbol: string;
  status: string;
  tickSize: Dec;
  minPrice: Dec;
  maxPrice: Dec;
  stepSize: Dec;
  minQty: Dec;
  maxQty: Dec;
  minNotional: Dec | null;
  maxNumOrders: number | null;
}

export function extractConstraints(info: ExchangeSymbolInfo): SymbolConstraints {
  const c: SymbolConstraints = {
    symbol: info.symbol,
    status: info.status,
    tickSize: parseDec("0.00000001"),
    minPrice: parseDec("0"),
    maxPrice: parseDec("1000000"),
    stepSize: parseDec("0.00000001"),
    minQty: parseDec("0"),
    maxQty: parseDec("1000000000"),
    minNotional: null,
    maxNumOrders: null,
  };
  for (const f of info.filters) {
    switch (f.filterType) {
      case "PRICE_FILTER":
        if (f.tickSize) c.tickSize = parseDec(f.tickSize);
        if (f.minPrice) c.minPrice = parseDec(f.minPrice);
        if (f.maxPrice) c.maxPrice = parseDec(f.maxPrice);
        break;
      case "LOT_SIZE":
        if (f.stepSize) c.stepSize = parseDec(f.stepSize);
        if (f.minQty) c.minQty = parseDec(f.minQty);
        if (f.maxQty) c.maxQty = parseDec(f.maxQty);
        break;
      case "MIN_NOTIONAL":
        if (f.notional) c.minNotional = parseDec(f.notional);
        else if (f.minNotional) c.minNotional = parseDec(f.minNotional);
        break;
      case "MAX_NUM_ORDERS":
        if (f.maxNumOrders != null) c.maxNumOrders = f.maxNumOrders;
        break;
      default:
        break;
    }
  }
  return c;
}

export interface ValidatedOrder {
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  qty: string;
  price?: string;
  stopPrice?: string;
}

export interface ValidationInput {
  symbol: string;
  type: string;
  price?: string;
  stopPrice?: string;
  qty?: string;
}

/**
 * Validates a draft order against actual exchange filters using decimal math.
 * Returns a list of human-readable violations; empty list means compliant.
 */
export function validateAgainstConstraints(c: SymbolConstraints, input: ValidationInput): string[] {
  const errors: string[] = [];
  if (c.status !== "TRADING") {
    errors.push(`symbol ${c.symbol} is not TRADING (status: ${c.status})`);
    return errors;
  }
  const isStopType = input.type === "STOP_MARKET" || input.type === "TAKE_PROFIT_MARKET";
  const requiresPrice = input.type === "LIMIT";

  const refPrice = isStopType ? input.stopPrice : input.price;
  if (requiresPrice || isStopType) {
    if (!refPrice) {
      errors.push(`${input.type} requires ${isStopType ? "stopPrice" : "price"}`);
    } else {
      let p: Dec;
      try {
        p = parseDec(refPrice);
      } catch {
        errors.push("price is not a valid decimal");
        return errors;
      }
      if (!matchesStep(p, c.tickSize)) errors.push(`price ${refPrice} must be a multiple of tickSize ${toStr(c.tickSize)}`);
      if (lte(p, parseDec("0"))) errors.push("price must be positive");
      if (lt(p, c.minPrice)) errors.push(`price below minPrice ${toStr(c.minPrice)}`);
      if (gt(p, c.maxPrice)) errors.push(`price above maxPrice ${toStr(c.maxPrice)}`);
    }
  }

  if (!input.qty) {
    // Qty requiredness is enforced by the caller; nothing to validate here.
  } else {
    let q: Dec;
    try {
      q = parseDec(input.qty);
    } catch {
      errors.push("qty is not a valid decimal");
      return errors;
    }
    if (!matchesStep(q, c.stepSize)) errors.push(`qty ${input.qty} must be a multiple of stepSize ${toStr(c.stepSize)}`);
    if (lte(q, parseDec("0"))) errors.push("qty must be positive");
    if (lt(q, c.minQty)) errors.push(`qty below minQty ${toStr(c.minQty)}`);
    if (gt(q, c.maxQty)) errors.push(`qty above maxQty ${toStr(c.maxQty)}`);
  }
  return errors;
}

/** Notional computed exactly as price * qty. */
export function orderNotional(price: string, qty: string): Dec {
  return abs(mul(parseDec(price), parseDec(qty)));
}
