import "server-only";

import crypto from "node:crypto";

/** Serializes params preserving insertion order (Binance signs the exact query string). */
export function buildQueryString(params: Record<string, string | number>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
}

export function hmacSha256Hex(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/** Builds the signed query string. The secret is used here and nowhere else. */
export function signedQuery(
  params: Record<string, string | number>,
  secret: string,
  timestamp: number,
  recvWindowMs: number,
): string {
  const full = { ...params, timestamp, recvWindow: recvWindowMs };
  const q = buildQueryString(full);
  return `${q}&signature=${hmacSha256Hex(q, secret)}`;
}
