/** Normalize app ticker (strip .P, slashes). */
export function normalizeAppSymbol(symbol: string): string {
  return String(symbol ?? "")
    .toUpperCase()
    .replace(/\.P$/i, "")
    .replace(/\//g, "");
}
