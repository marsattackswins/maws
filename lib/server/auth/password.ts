import "server-only";

import crypto from "node:crypto";

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const KEYLEN = 64;
const MAX_PASSWORD_LEN = 512;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEYLEN, SCRYPT_PARAMS);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/** Constant-time scrypt verification against `salt:hash` from MAWS_OPERATOR_AUTH. */
export function verifyOperatorPassword(password: string, stored: string): boolean {
  if (typeof password !== "string" || password.length === 0 || password.length > MAX_PASSWORD_LEN) {
    return false;
  }
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const salt = Buffer.from(parts[0], "hex");
  const expected = Buffer.from(parts[1], "hex");
  if (salt.length === 0 || expected.length === 0) return false;
  let candidate: Buffer;
  try {
    candidate = crypto.scryptSync(password, salt, expected.length, SCRYPT_PARAMS);
  } catch {
    return false;
  }
  return crypto.timingSafeEqual(candidate, expected);
}
