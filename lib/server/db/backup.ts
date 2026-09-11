import "server-only";

import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { getDb } from "./connection";

const MAGIC = Buffer.from("MAWSBAK1");

export interface BackupResult {
  file: string;
  bytes: number;
  verified: boolean;
}

/** AES-256-GCM envelope: magic | iv(12) | tag(16) | ciphertext. */
export function encryptBackup(plain: Buffer, key: Buffer): Buffer {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([MAGIC, iv, tag, ciphertext]);
}

export function decryptBackup(envelope: Buffer, key: Buffer): Buffer {
  if (!envelope.subarray(0, 8).equals(MAGIC)) throw new Error("Bad backup magic");
  const iv = envelope.subarray(8, 20);
  const tag = envelope.subarray(20, 36);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(envelope.subarray(36)), decipher.final()]);
}

/**
 * Consistent online backup via SQLite's backup API, encrypted at rest and
 * verified by decrypting and running integrity_check on a throwaway copy.
 */
export async function createEncryptedBackup(dir?: string): Promise<BackupResult> {
  const db = getDb();
  const cfgKey = process.env.MAWS_BACKUP_KEY;
  if (!cfgKey || !/^[0-9a-fA-F]{64}$/.test(cfgKey)) {
    throw new Error("MAWS_BACKUP_KEY (64 hex chars) is required for backups");
  }
  const key = Buffer.from(cfgKey, "hex");

  const backupDir = dir ?? path.join(path.dirname(path.resolve(db.name)), "backups");
  fs.mkdirSync(backupDir, { recursive: true, mode: 0o700 });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const plainPath = path.join(backupDir, `maws-${stamp}.db`);
  const encPath = `${plainPath}.enc`;

  await db.backup(plainPath);
  try {
    const plain = fs.readFileSync(plainPath);
    fs.writeFileSync(encPath, encryptBackup(plain, key), { mode: 0o600 });
  } finally {
    fs.rmSync(plainPath, { force: true });
  }
  try {
    fs.chmodSync(encPath, 0o600);
  } catch {
    // Best effort on filesystems without POSIX modes.
  }

  verifyBackup(encPath, key);
  pruneOldBackups(backupDir, 7);

  return { file: encPath, bytes: fs.statSync(encPath).size, verified: true };
}

/** Decrypts to a temp file and runs integrity_check. Throws on corruption. */
export function verifyBackup(encPath: string, key: Buffer): boolean {
  const envelope = fs.readFileSync(encPath);
  const plain = decryptBackup(envelope, key);
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "maws-verify-")), "check.db");
  try {
    fs.writeFileSync(tmp, plain, { mode: 0o600 });
    const probe = new Database(tmp, { readonly: true });
    try {
      const row = probe.pragma("integrity_check", { simple: true });
      if (row !== "ok") throw new Error(`integrity_check failed: ${String(row)}`);
    } finally {
      probe.close();
    }
  } finally {
    fs.rmSync(tmp, { force: true });
  }
  return true;
}

function pruneOldBackups(dir: string, keep: number): void {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".db.enc"))
    .sort()
    .reverse();
  for (const f of files.slice(keep)) fs.rmSync(path.join(dir, f), { force: true });
}
