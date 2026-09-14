import "server-only";

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

import { serverConfig } from "../env/config";
import { runMigrations } from "./migrate";

let db: Database.Database | null = null;

function openDatabase(dbPath: string): Database.Database {
  fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true, mode: 0o700 });
  const d = new Database(dbPath);
  d.pragma("journal_mode = WAL");
  d.pragma("synchronous = NORMAL");
  d.pragma("busy_timeout = 5000");
  d.pragma("foreign_keys = ON");
  try {
    fs.chmodSync(path.resolve(dbPath), 0o600);
  } catch {
    // Best effort; some filesystems (Windows) manage ACLs differently.
  }
  return d;
}

/** Singleton connection; created lazily and migrated on first use. */
export function getDb(): Database.Database {
  if (!db) {
    db = openDatabase(serverConfig().dbPath);
    runMigrations(db);
  }
  return db;
}

/**
 * Close the connection at process exit so SQLite checkpointing happens
 * synchronously and no WAL is left for the next process to recover.
 */
export function closeDbForShutdown(): void {
  if (!db) return;
  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
    db.close();
  } catch {
    // Best effort: the WAL recovers automatically on next open anyway.
  }
  db = null;
}

/** Test seam: swap the backing file or close the connection. */
export function resetDbForTests(newPath?: string): void {
  if (db) {
    db.close();
    db = null;
  }
  if (newPath) {
    db = openDatabase(newPath);
    runMigrations(db);
  }
}
