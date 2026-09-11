import "server-only";

import crypto from "node:crypto";

/**
 * Timing-safe comparison of secret tokens.
 * 
 * Compares two string tokens in constant time to prevent timing attacks.
 * Returns false if either token is missing, empty, or if they don't match.
 * 
 * @param presented - The token provided by the caller (e.g., from header)
 * @param expected - The expected token value from configuration
 * @returns true if tokens match exactly, false otherwise
 */
export function compareSecretTokens(
  presented: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (!presented || !expected) return false;
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
