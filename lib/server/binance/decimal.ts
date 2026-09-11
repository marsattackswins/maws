import "server-only";

/**
 * Decimal-safe arithmetic over scaled BigInts. Exchange filters (tickSize,
 * stepSize, minNotional) and order quantities/prices must never go through
 * float rounding.
 */
export interface Dec {
  units: bigint;
  scale: number;
}

const PLAIN_DECIMAL = /^-?(0|[1-9]\d*)(\.\d+)?$/;

export function parseDec(raw: string): Dec {
  const s = raw.trim();
  if (!PLAIN_DECIMAL.test(s)) throw new Error(`Invalid decimal value: ${raw}`);
  const negative = s.startsWith("-");
  const body = negative ? s.slice(1) : s;
  const [intPart, fracPart = ""] = body.split(".");
  const units = BigInt(intPart + fracPart) * (negative ? -1n : 1n);
  return { units, scale: fracPart.length };
}

export function decFromNumber(n: number): Dec {
  return parseDec(String(n));
}

function align(a: Dec, b: Dec): [bigint, bigint, number] {
  if (a.scale === b.scale) return [a.units, b.units, a.scale];
  if (a.scale > b.scale) return [a.units, b.units * 10n ** BigInt(a.scale - b.scale), a.scale];
  return [a.units * 10n ** BigInt(b.scale - a.scale), b.units, b.scale];
}

export function cmp(a: Dec, b: Dec): -1 | 0 | 1 {
  const [x, y] = align(a, b);
  return x < y ? -1 : x > y ? 1 : 0;
}

export const eq = (a: Dec, b: Dec): boolean => cmp(a, b) === 0;
export const lt = (a: Dec, b: Dec): boolean => cmp(a, b) < 0;
export const lte = (a: Dec, b: Dec): boolean => cmp(a, b) <= 0;
export const gt = (a: Dec, b: Dec): boolean => cmp(a, b) > 0;
export const gte = (a: Dec, b: Dec): boolean => cmp(a, b) >= 0;
export const isZero = (a: Dec): boolean => a.units === 0n;
export const isNegative = (a: Dec): boolean => a.units < 0n;

export function add(a: Dec, b: Dec): Dec {
  const [x, y, scale] = align(a, b);
  return { units: x + y, scale };
}

export function sub(a: Dec, b: Dec): Dec {
  const [x, y, scale] = align(a, b);
  return { units: x - y, scale };
}

export function mul(a: Dec, b: Dec): Dec {
  return { units: a.units * b.units, scale: a.scale + b.scale };
}

export function abs(a: Dec): Dec {
  return { units: a.units < 0n ? -a.units : a.units, scale: a.scale };
}

/** a / b at a fixed result scale (default 8). Throws on division by zero. */
export function div(a: Dec, b: Dec, scale = 8): Dec {
  if (b.units === 0n) throw new Error("Division by zero");
  const numerator = a.units * 10n ** BigInt(scale + b.scale);
  const denominator = b.units * 10n ** BigInt(a.scale);
  return { units: numerator / denominator, scale };
}

export function neg(a: Dec): Dec {
  return { units: -a.units, scale: a.scale };
}

/** value % step === 0 with both values aligned to the step's scale. */
export function matchesStep(value: Dec, step: Dec): boolean {
  if (isZero(step)) throw new Error("step must be non-zero");
  const [v, s] = align(value, step);
  return v % s === 0n;
}

/** Rounds value down (toward zero) to the nearest multiple of step. */
export function roundDownToStep(value: Dec, step: Dec): Dec {
  if (isZero(step)) throw new Error("step must be non-zero");
  const [v, s, scale] = align(value, step);
  const rem = v % s;
  return { units: v - rem, scale };
}

/** |value| >= minNotional, computed exactly. */
export function notionalAtLeast(price: Dec, qty: Dec, minNotional: Dec): boolean {
  return gte(abs(mul(price, qty)), minNotional);
}

/** Percentage difference |a - b| / b * 100, as a float — display/risk collar only. */
export function pctDiff(a: Dec, b: Dec): number {
  if (isZero(b)) return 0;
  const num = sub(a, b);
  return (Number(num.units) / 10 ** num.scale / (Number(b.units) / 10 ** b.scale)) * 100;
}

/** Canonical string: no trailing zeros, no leading '+'. */
export function toStr(d: Dec): string {
  const negative = d.units < 0n;
  let digits = (negative ? -d.units : d.units).toString();
  if (d.scale === 0) return `${negative ? "-" : ""}${digits}`;
  digits = digits.padStart(d.scale + 1, "0");
  const intPart = digits.slice(0, digits.length - d.scale);
  let fracPart = digits.slice(digits.length - d.scale);
  fracPart = fracPart.replace(/0+$/, "");
  return `${negative ? "-" : ""}${intPart}${fracPart ? "." + fracPart : ""}`;
}

/** Fixed-scale string, e.g. for submissions aligned to a filter step. */
export function toFixedStr(d: Dec, scale: number): string {
  const negative = d.units < 0n;
  let digits = (negative ? -d.units : d.units).toString();
  const curScale = d.scale;
  if (curScale < scale) {
    digits = digits + "0".repeat(scale - curScale);
  } else if (curScale > scale) {
    digits = digits.slice(0, digits.length - (curScale - scale)) || "0";
  }
  if (scale === 0) return `${negative ? "-" : ""}${digits || "0"}`;
  digits = digits.padStart(scale + 1, "0");
  return `${negative ? "-" : ""}${digits.slice(0, digits.length - scale)}.${digits.slice(digits.length - scale)}`;
}
