import Database from "better-sqlite3";
import { describe, expect, test } from "@jest/globals";

import { MIGRATIONS, currentVersion, runMigrations } from "@/lib/server/db/migrate";

const PROFILES = ["paper", "binance-testnet", "binance-production", "shadow", "legacy-unknown"] as const;
const PROFILE_TABLES = [
  "runtime_config",
  "order_intents",
  "exchange_symbol_filters",
  "exchange_leverage_brackets",
  "exchange_clock",
  "order_events",
  "reconciliation_runs",
  "stream_owner_lease",
  "fills_log",
  "shadow_events",
] as const;

function migrateLegacyDatabase(): Database.Database {
  const db = new Database(":memory:");
  for (const migration of MIGRATIONS.filter((entry) => entry.version <= 5)) {
    if (typeof migration.up === "function") throw new Error("legacy migrations must be SQL-only");
    for (const statement of migration.up) db.exec(statement);
    db.pragma(`user_version = ${migration.version}`);
  }
  return db;
}

function rowCount(db: Database.Database, table: string): number {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number };
  return row.count;
}

function columnNames(db: Database.Database, table: string): string[] {
  return (db.pragma(`table_info(${table})`) as Array<{ name: string }>).map((column) => column.name);
}

function indexNames(db: Database.Database, table: string): string[] {
  return (db.pragma(`index_list(${table})`) as Array<{ name: string }>).map((index) => index.name);
}

function seedLegacyRows(db: Database.Database): Record<string, number> {
  db.prepare(`INSERT INTO runtime_config (key, value, updated_at) VALUES (?, ?, ?)`).run("frozen", "false", 1);
  db.prepare(
    `INSERT INTO order_intents
       (client_order_id, client_algo_id, kind, symbol, side, type, qty, price, stop_price, reduce_only, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run("legacy-client", null, "order", "BTCUSDT", "BUY", "LIMIT", "1", "100", null, 0, "REJECTED", 1, 1);
  db.prepare(
    `INSERT INTO exchange_symbol_filters (symbol, status, base_asset, quote_asset, filters, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run("BTCUSDT", "TRADING", "BTC", "USDT", "[]", 1);
  db.prepare(`INSERT INTO exchange_leverage_brackets (symbol, brackets, updated_at) VALUES (?, ?, ?)`).run("BTCUSDT", "[]", 1);
  db.prepare(`INSERT INTO exchange_clock (id, offset_ms, rtt_ms, samples, updated_at) VALUES (?, ?, ?, ?, ?)`).run(1, 10, 2, 3, 1);
  db.prepare(
    `INSERT INTO order_events
       (ts, event_time, source, event_type, exchange_order_id, client_order_id, symbol, payload, processed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(1, 1, "stream", "ORDER_TRADE_UPDATE", "1", "legacy-client", "BTCUSDT", "{}", 1);
  db.prepare(
    `INSERT INTO reconciliation_runs (started_at, finished_at, trigger, result, details)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(1, 2, "startup", "ok", "{}");
  db.prepare(`INSERT INTO stream_owner_lease (lease_key, owner, acquired_at, expires_at) VALUES (?, ?, ?, ?)`).run("uds", "old", 1, 2);
  db.prepare(
    `INSERT INTO fills_log
       (ts, trade_id, exchange_order_id, client_order_id, symbol, side, qty, price, realized_pnl, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(1, "legacy-trade", "1", "legacy-client", "BTCUSDT", "BUY", "1", "100", "0", "stream");
  db.prepare(
    `INSERT INTO shadow_events
       (ts, event_time, event_type, symbol, side, qty, price, realized_pnl, client_order_id, exchange_order_id, payload)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(1, 1, "ORDER_TRADE_UPDATE", "BTCUSDT", "BUY", "1", "100", "0", "legacy-client", "1", "{}");
  db.prepare(`INSERT INTO audit_log (ts, actor, action, detail, ip) VALUES (?, ?, ?, ?, ?)`).run(1, "operator", "legacy", "{}", null);

  return Object.fromEntries([...PROFILE_TABLES, "audit_log"].map((table) => [table, rowCount(db, table)]));
}

describe("profile-scoped database migration", () => {
  test("fresh schema includes profile columns and the migration is idempotent", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    expect(currentVersion(db)).toBe(6);
    for (const table of PROFILE_TABLES) expect(columnNames(db, table)).toContain("profile_id");
    expect(columnNames(db, "audit_log")).toContain("profile_id");
    expect(indexNames(db, "runtime_config")).toContain("idx_runtime_profile_key");
    expect(indexNames(db, "order_intents")).toEqual(expect.arrayContaining([
      "idx_intents_status_profile",
      "idx_intents_client_order_profile",
      "idx_intents_exchange_order_profile",
    ]));
    expect(indexNames(db, "order_events")).toEqual(expect.arrayContaining(["idx_events_profile_client", "idx_events_profile_exchange"]));
    expect(indexNames(db, "reconciliation_runs")).toContain("idx_reconciliation_profile_time");
    expect(indexNames(db, "stream_owner_lease")).toContain("idx_lease_profile_owner");
    expect(indexNames(db, "fills_log")).toEqual(expect.arrayContaining([
      "idx_fills_profile_time",
      "idx_fills_profile_client",
      "idx_fills_profile_exchange",
    ]));
    expect(indexNames(db, "audit_log")).toContain("idx_audit_profile_time");

    const countsBefore = Object.fromEntries([...PROFILE_TABLES, "audit_log"].map((table) => [table, rowCount(db, table)]));
    runMigrations(db);
    expect(currentVersion(db)).toBe(6);
    expect(Object.fromEntries([...PROFILE_TABLES, "audit_log"].map((table) => [table, rowCount(db, table)]))).toEqual(countsBefore);
    db.close();
  });

  test("SQLite accepts only the five server profile IDs", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    const insert = db.prepare(`INSERT INTO runtime_config (profile_id, key, value, updated_at) VALUES (?, ?, ?, ?)`);
    for (const profile of PROFILES) insert.run(profile, `key-${profile}`, "value", 1);
    expect(() => insert.run("not-a-profile", "invalid", "value", 1)).toThrow(/CHECK constraint failed/);
    db.close();
  });

  test("legacy rows are preserved, quarantined, and excluded from active profile queries", () => {
    const db = migrateLegacyDatabase();
    const countsBefore = seedLegacyRows(db);
    runMigrations(db);

    for (const table of PROFILE_TABLES) {
      expect(db.prepare(`SELECT DISTINCT profile_id FROM ${table}`).all()).toEqual([{ profile_id: "legacy-unknown" }]);
      expect(rowCount(db, table)).toBe(countsBefore[table]);
    }
    expect(db.prepare(`SELECT DISTINCT profile_id FROM audit_log`).all()).toEqual([{ profile_id: "legacy-unknown" }]);
    expect(rowCount(db, "audit_log")).toBe(countsBefore.audit_log);
    expect(db.prepare(`SELECT COUNT(*) AS count FROM fills_log WHERE profile_id = 'binance-testnet'`).get()).toEqual({ count: 0 });
    expect(db.prepare(`SELECT COUNT(*) AS count FROM order_intents WHERE profile_id = 'binance-production'`).get()).toEqual({ count: 0 });
    db.close();
  });

  test("same identifiers are isolated by profile while duplicates within one profile fail", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    const insertIntent = db.prepare(
      `INSERT INTO order_intents
       (profile_id, client_order_id, client_algo_id, kind, symbol, side, type, qty, status, created_at, updated_at)
       VALUES (?, ?, ?, 'order', 'BTCUSDT', 'BUY', 'MARKET', '1', 'CREATED', 1, 1)`,
    );
    insertIntent.run("binance-testnet", "same-client", "same-algo");
    insertIntent.run("binance-production", "same-client", "same-algo");
    expect(() => insertIntent.run("binance-testnet", "same-client", "other-algo")).toThrow(/UNIQUE constraint failed/);
    expect(() => insertIntent.run("binance-testnet", "other-client", "same-algo")).toThrow(/UNIQUE constraint failed/);

    const insertFill = db.prepare(
      `INSERT INTO fills_log (profile_id, ts, trade_id, symbol, side, qty, price, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    insertFill.run("binance-testnet", 1, "same-trade", "BTCUSDT", "BUY", "1", "100", "stream");
    insertFill.run("binance-production", 1, "same-trade", "BTCUSDT", "BUY", "1", "100", "stream");
    expect(() => insertFill.run("binance-testnet", 1, "same-trade", "ETHUSDT", "BUY", "1", "100", "stream")).toThrow(/UNIQUE constraint failed/);

    const insertFilter = db.prepare(
      `INSERT INTO exchange_symbol_filters (profile_id, symbol, status, base_asset, quote_asset, filters, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    insertFilter.run("binance-testnet", "BTCUSDT", "TRADING", "BTC", "USDT", "[]", 1);
    insertFilter.run("binance-production", "BTCUSDT", "TRADING", "BTC", "USDT", "[]", 1);
    expect(() => insertFilter.run("binance-testnet", "BTCUSDT", "TRADING", "BTC", "USDT", "[]", 2)).toThrow(/UNIQUE constraint failed/);
    db.close();
  });

  test("metadata, clocks, leases, runtime flags, reconciliation, fills, and P&L are profile-specific", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    db.prepare(`INSERT INTO exchange_clock (profile_id, offset_ms, rtt_ms, samples, updated_at) VALUES (?, ?, ?, ?, ?)`).run("binance-testnet", 10, 1, 3, 1);
    db.prepare(`INSERT INTO exchange_clock (profile_id, offset_ms, rtt_ms, samples, updated_at) VALUES (?, ?, ?, ?, ?)`).run("binance-production", 20, 1, 3, 1);
    expect(db.prepare(`SELECT offset_ms FROM exchange_clock WHERE profile_id = ?`).get("binance-testnet")).toEqual({ offset_ms: 10 });

    db.prepare(`INSERT INTO stream_owner_lease (profile_id, lease_key, owner, acquired_at, expires_at) VALUES (?, ?, ?, ?, ?)`).run("binance-testnet", "uds", "testnet-owner", 1, 2);
    db.prepare(`INSERT INTO stream_owner_lease (profile_id, lease_key, owner, acquired_at, expires_at) VALUES (?, ?, ?, ?, ?)`).run("binance-production", "uds", "production-owner", 1, 2);
    expect(db.prepare(`SELECT owner FROM stream_owner_lease WHERE profile_id = ?`).get("binance-production")).toEqual({ owner: "production-owner" });

    db.prepare(`INSERT INTO runtime_config (profile_id, key, value, updated_at) VALUES (?, ?, ?, ?)`).run("binance-testnet", "frozen", "true", 1);
    db.prepare(`INSERT INTO runtime_config (profile_id, key, value, updated_at) VALUES (?, ?, ?, ?)`).run("binance-production", "frozen", "false", 1);
    expect(db.prepare(`SELECT value FROM runtime_config WHERE profile_id = ? AND key = ?`).get("binance-testnet", "frozen")).toEqual({ value: "true" });

    db.prepare(`INSERT INTO reconciliation_runs (profile_id, started_at, trigger) VALUES (?, ?, ?)`).run("binance-testnet", 1, "testnet");
    db.prepare(`INSERT INTO reconciliation_runs (profile_id, started_at, trigger) VALUES (?, ?, ?)`).run("binance-production", 1, "production");
    expect(db.prepare(`SELECT COUNT(*) AS count FROM reconciliation_runs WHERE profile_id = ?`).get("binance-testnet")).toEqual({ count: 1 });

    const insertFill = db.prepare(`INSERT INTO fills_log (profile_id, ts, trade_id, symbol, side, qty, price, realized_pnl, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    insertFill.run("binance-testnet", 1, "pnl-testnet", "BTCUSDT", "SELL", "1", "100", "10", "stream");
    insertFill.run("binance-production", 1, "pnl-production", "BTCUSDT", "SELL", "1", "100", "-4", "stream");
    expect(db.prepare(`SELECT SUM(CAST(realized_pnl AS REAL)) AS total FROM fills_log WHERE profile_id = ?`).get("binance-testnet")).toEqual({ total: 10 });
    db.close();
  });

  test("paper and legacy persistence never enter an active Binance profile", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    const insert = db.prepare(
      `INSERT INTO fills_log (profile_id, ts, trade_id, symbol, side, qty, price, realized_pnl, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    insert.run("paper", 1, "paper-trade", "BTCUSDT", "BUY", "1", "100", "5", "paper");
    insert.run("legacy-unknown", 2, "legacy-trade", "BTCUSDT", "SELL", "1", "100", "-5", "legacy");
    insert.run("binance-testnet", 3, "live-trade", "BTCUSDT", "SELL", "1", "100", "2", "stream");

    const liveRows = db
      .prepare(`SELECT trade_id FROM fills_log WHERE profile_id = ? AND profile_id != 'legacy-unknown'`)
      .all("binance-testnet") as Array<{ trade_id: string }>;
    expect(liveRows).toEqual([{ trade_id: "live-trade" }]);
    expect(db.prepare(`SELECT SUM(CAST(realized_pnl AS REAL)) AS total FROM fills_log WHERE profile_id = ?`).get("binance-testnet")).toEqual({ total: 2 });
    db.close();
  });

  test("migration does not add credential columns or write secret values", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    for (const table of [...PROFILE_TABLES, "audit_log"]) {
      const columns = columnNames(db, table).map((column) => column.toLowerCase());
      expect(columns.some((column) => column.includes("secret") || column.includes("api_key"))).toBe(false);
    }
    expect(JSON.stringify(db.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table'`).all())).not.toContain("SECRET_SENTINEL");
    db.close();
  });
});
