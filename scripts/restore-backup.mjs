#!/usr/bin/env node

/**
 * Restore an encrypted MAWS backup to the live database.
 *
 * Usage:
 *   node scripts/restore-backup.mjs <backup.db.enc> [--dry-run]
 *
 * Requires MAWS_BACKUP_KEY (64 hex chars) in the environment.
 * The --dry-run flag decrypts and verifies without overwriting anything.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const MAGIC = Buffer.from("MAWSBAK1");
const DEFAULT_DB_PATH = ".maws/maws.db";

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function decryptBackup(envelope, key) {
  if (!envelope.subarray(0, 8).equals(MAGIC)) {
    throw new Error("Bad backup magic — file is not a valid MAWS backup");
  }
  const iv = envelope.subarray(8, 20);
  const tag = envelope.subarray(20, 36);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(envelope.subarray(36)), decipher.final()]);
}

// --- Parse args ---
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const encFile = args.find((a) => !a.startsWith("--"));

if (!encFile) fail("Usage: node scripts/restore-backup.mjs <backup.db.enc> [--dry-run]");
if (!fs.existsSync(encFile)) fail(`File not found: ${encFile}`);

// --- Validate key ---
const rawKey = process.env.MAWS_BACKUP_KEY;
if (!rawKey || !/^[0-9a-fA-F]{64}$/.test(rawKey)) {
  fail("MAWS_BACKUP_KEY must be set to exactly 64 hex characters (32 bytes)");
}
const key = Buffer.from(rawKey, "hex");

// --- Decrypt ---
console.log(`Decrypting ${encFile}...`);
let plain;
try {
  const envelope = fs.readFileSync(encFile);
  plain = decryptBackup(envelope, key);
} catch (err) {
  fail(`Decryption failed: ${err.message}`);
}

// --- Integrity check ---
const tmpDir = fs.mkdtempSync(path.join(process.env.TEMP || process.env.TMPDIR || "/tmp", "maws-restore-"));
const tmpDb = path.join(tmpDir, "check.db");
fs.writeFileSync(tmpDb, plain, { mode: 0o600 });

let integrityOk = false;
try {
  const probe = new Database(tmpDb, { readonly: true });
  try {
    const result = probe.pragma("integrity_check", { simple: true });
    integrityOk = result === "ok";
    if (!integrityOk) fail(`Integrity check failed: ${result}`);
  } finally {
    probe.close();
  }
} catch (err) {
  fail(`Integrity check error: ${err.message}`);
} finally {
  fs.rmSync(tmpDb, { force: true });
  fs.rmdirSync(tmpDir, { force: true });
}

// --- Extract metadata from filename ---
const basename = path.basename(encFile);
const tsMatch = basename.match(/maws-(\d{4}-\d{2}-\d{2}T[\d-]+)/);
const backupTs = tsMatch ? tsMatch[1].replace(/-/g, (m, i) => (i > 9 ? ":" : m)) : "unknown";
const sizeKb = (plain.length / 1024).toFixed(1);

console.log(`  Backup timestamp: ${backupTs}`);
console.log(`  Decrypted size:   ${sizeKb} KB`);
console.log(`  Integrity check:  OK`);

if (dryRun) {
  console.log("\nDry run complete — no files were modified.");
  process.exit(0);
}

// --- Restore ---
const dbPath = process.env.MAWS_DB_PATH?.trim() || DEFAULT_DB_PATH;
console.log(`\nRestoring to ${dbPath}...`);

if (fs.existsSync(dbPath)) {
  const walPath = `${dbPath}-wal`;
  const shmPath = `${dbPath}-shm`;
  if (fs.existsSync(walPath)) fs.rmSync(walPath, { force: true });
  if (fs.existsSync(shmPath)) fs.rmSync(shmPath, { force: true });
}

fs.writeFileSync(dbPath, plain, { mode: 0o600 });
console.log("Restore complete. Start the server to run migrations and reconciliation.");
