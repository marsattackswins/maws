#!/usr/bin/env node
// Generates MAWS_OPERATOR_AUTH: "<hex salt>:<hex scrypt hash>".
// Usage: npm run gen-operator-auth -- "<password>"
import crypto from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run gen-operator-auth -- "<password>"');
  process.exit(1);
}
if (password.length > 512) {
  console.error("Password too long (max 512 chars).");
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
console.log(`${salt.toString("hex")}:${hash.toString("hex")}`);
