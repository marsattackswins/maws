import "server-only";

import type Database from "better-sqlite3";

type MigrationUp = string[] | ((db: Database.Database) => void);

interface Migration {
  version: number;
  name: string;
  up: MigrationUp;
}

/**
 * Schema history is tracked in `user_version`. Migrations are append-only;
 * never edit a shipped migration, append a new one instead.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: "M0001 sessions, audit, runtime flags, order intents",
    up: [
      `CREATE TABLE IF NOT EXISTS sessions (
         session_hash TEXT PRIMARY KEY,
         csrf_token TEXT NOT NULL,
         created_at INTEGER NOT NULL,
         expires_at INTEGER NOT NULL,
         last_seen_at INTEGER NOT NULL,
         revoked_at INTEGER,
         user_agent TEXT
       )`,
      `CREATE TABLE IF NOT EXISTS audit_log (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         ts INTEGER NOT NULL,
         actor TEXT NOT NULL,
         action TEXT NOT NULL,
         detail TEXT NOT NULL,
         ip TEXT
       )`,
      `CREATE TABLE IF NOT EXISTS runtime_config (
         key TEXT PRIMARY KEY,
         value TEXT NOT NULL,
         updated_at INTEGER NOT NULL
       )`,
      `CREATE TABLE IF NOT EXISTS order_intents (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         client_order_id TEXT UNIQUE NOT NULL,
         client_algo_id TEXT UNIQUE,
         kind TEXT NOT NULL,
         symbol TEXT NOT NULL,
         side TEXT NOT NULL,
         type TEXT NOT NULL,
         qty TEXT NOT NULL,
         price TEXT,
         stop_price TEXT,
         reduce_only INTEGER NOT NULL DEFAULT 0,
         status TEXT NOT NULL,
         exchange_order_id TEXT,
         last_state TEXT,
         created_at INTEGER NOT NULL,
         updated_at INTEGER NOT NULL
       )`,
      `CREATE INDEX IF NOT EXISTS idx_intents_status ON order_intents(status)`,
    ],
  },
  {
    version: 2,
    name: "M0002 exchange metadata cache",
    up: [
      `CREATE TABLE IF NOT EXISTS exchange_symbol_filters (
         symbol TEXT PRIMARY KEY,
         status TEXT NOT NULL,
         base_asset TEXT NOT NULL,
         quote_asset TEXT NOT NULL,
         filters TEXT NOT NULL,
         updated_at INTEGER NOT NULL
       )`,
      `CREATE TABLE IF NOT EXISTS exchange_leverage_brackets (
         symbol TEXT PRIMARY KEY,
         brackets TEXT NOT NULL,
         updated_at INTEGER NOT NULL
       )`,
      `CREATE TABLE IF NOT EXISTS exchange_clock (
         id INTEGER PRIMARY KEY CHECK (id = 1),
         offset_ms INTEGER NOT NULL,
         rtt_ms INTEGER NOT NULL,
         samples INTEGER NOT NULL,
         updated_at INTEGER NOT NULL
       )`,
    ],
  },
  {
    version: 3,
    name: "M0003 events, reconciliation, stream lease, fills",
    up: [
      `CREATE TABLE IF NOT EXISTS order_events (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         ts INTEGER NOT NULL,
         event_time INTEGER,
         source TEXT NOT NULL,
         event_type TEXT NOT NULL,
         exchange_order_id TEXT,
         client_order_id TEXT,
         symbol TEXT,
         payload TEXT NOT NULL,
         processed INTEGER NOT NULL DEFAULT 0
       )`,
      `CREATE INDEX IF NOT EXISTS idx_events_client ON order_events(client_order_id)`,
      `CREATE TABLE IF NOT EXISTS reconciliation_runs (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         started_at INTEGER NOT NULL,
         finished_at INTEGER,
         trigger TEXT NOT NULL,
         result TEXT,
         details TEXT
       )`,
      `CREATE TABLE IF NOT EXISTS stream_owner_lease (
         lease_key TEXT PRIMARY KEY,
         owner TEXT NOT NULL,
         acquired_at INTEGER NOT NULL,
         expires_at INTEGER NOT NULL
       )`,
      `CREATE TABLE IF NOT EXISTS fills_log (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         ts INTEGER NOT NULL,
         exchange_order_id TEXT,
         client_order_id TEXT,
         symbol TEXT NOT NULL,
         side TEXT NOT NULL,
         qty TEXT NOT NULL,
         price TEXT NOT NULL,
         fee TEXT,
         fee_asset TEXT,
         realized_pnl TEXT,
         source TEXT NOT NULL
       )`,
    ],
  },
  {
    version: 4,
    name: "M0004 shadow event logger",
    up: [
      `CREATE TABLE IF NOT EXISTS shadow_events (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         ts INTEGER NOT NULL,
         event_time INTEGER,
         event_type TEXT NOT NULL,
         symbol TEXT,
         side TEXT,
         qty TEXT,
         price TEXT,
         realized_pnl TEXT,
         client_order_id TEXT,
         exchange_order_id TEXT,
         payload TEXT NOT NULL
       )`,
      `CREATE INDEX IF NOT EXISTS idx_shadow_ts ON shadow_events(ts)`,
      `CREATE INDEX IF NOT EXISTS idx_shadow_symbol ON shadow_events(symbol)`,
    ],
  },
  {
    version: 5,
    name: "M0005 idempotent fill execution keys",
    up: [
      `ALTER TABLE fills_log ADD COLUMN trade_id TEXT`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_fills_trade_id ON fills_log(trade_id) WHERE trade_id IS NOT NULL`,
    ],
  },
  {
    version: 6,
    name: "M0006 profile-scoped persistence and legacy quarantine",
    up: migrateProfileScopedSchema,
  },
];

const PROFILE_CHECK =
  "CHECK (profile_id IN ('paper', 'binance-testnet', 'binance-production', 'shadow', 'legacy-unknown'))";

function rebuildTable(db: Database.Database, table: string, definition: string, copySql: string): void {
  const temporary = `${table}__profile_scoped`;
  db.exec(`CREATE TABLE ${temporary} (${definition})`);
  db.exec(`INSERT INTO ${temporary} ${copySql}`);
  db.exec(`DROP TABLE ${table}`);
  db.exec(`ALTER TABLE ${temporary} RENAME TO ${table}`);
}

function migrateProfileScopedSchema(db: Database.Database): void {
  rebuildTable(
    db,
    "runtime_config",
    `profile_id TEXT NOT NULL ${PROFILE_CHECK},
     key TEXT NOT NULL,
     value TEXT NOT NULL,
     updated_at INTEGER NOT NULL,
     PRIMARY KEY (profile_id, key)`,
    `SELECT 'legacy-unknown', key, value, updated_at FROM runtime_config`,
  );
  rebuildTable(
    db,
    "order_intents",
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     profile_id TEXT NOT NULL ${PROFILE_CHECK},
     client_order_id TEXT NOT NULL,
     client_algo_id TEXT,
     kind TEXT NOT NULL,
     symbol TEXT NOT NULL,
     side TEXT NOT NULL,
     type TEXT NOT NULL,
     qty TEXT NOT NULL,
     price TEXT,
     stop_price TEXT,
     reduce_only INTEGER NOT NULL DEFAULT 0,
     status TEXT NOT NULL,
     exchange_order_id TEXT,
     last_state TEXT,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     UNIQUE (profile_id, client_order_id),
     UNIQUE (profile_id, client_algo_id)`,
    `SELECT id, 'legacy-unknown', client_order_id, client_algo_id, kind, symbol, side, type, qty,
            price, stop_price, reduce_only, status, exchange_order_id, last_state, created_at, updated_at
       FROM order_intents`,
  );
  rebuildTable(
    db,
    "exchange_symbol_filters",
    `profile_id TEXT NOT NULL ${PROFILE_CHECK},
     symbol TEXT NOT NULL,
     status TEXT NOT NULL,
     base_asset TEXT NOT NULL,
     quote_asset TEXT NOT NULL,
     filters TEXT NOT NULL,
     updated_at INTEGER NOT NULL,
     PRIMARY KEY (profile_id, symbol)`,
    `SELECT 'legacy-unknown', symbol, status, base_asset, quote_asset, filters, updated_at
       FROM exchange_symbol_filters`,
  );
  rebuildTable(
    db,
    "exchange_leverage_brackets",
    `profile_id TEXT NOT NULL ${PROFILE_CHECK},
     symbol TEXT NOT NULL,
     brackets TEXT NOT NULL,
     updated_at INTEGER NOT NULL,
     PRIMARY KEY (profile_id, symbol)`,
    `SELECT 'legacy-unknown', symbol, brackets, updated_at FROM exchange_leverage_brackets`,
  );
  rebuildTable(
    db,
    "exchange_clock",
    `profile_id TEXT NOT NULL ${PROFILE_CHECK},
     id INTEGER NOT NULL DEFAULT 1 CHECK (id = 1),
     offset_ms INTEGER NOT NULL,
     rtt_ms INTEGER NOT NULL,
     samples INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     PRIMARY KEY (profile_id)`,
    `SELECT 'legacy-unknown', id, offset_ms, rtt_ms, samples, updated_at FROM exchange_clock`,
  );
  rebuildTable(
    db,
    "order_events",
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     profile_id TEXT NOT NULL ${PROFILE_CHECK},
     ts INTEGER NOT NULL,
     event_time INTEGER,
     source TEXT NOT NULL,
     event_type TEXT NOT NULL,
     exchange_order_id TEXT,
     client_order_id TEXT,
     symbol TEXT,
     payload TEXT NOT NULL,
     processed INTEGER NOT NULL DEFAULT 0`,
    `SELECT id, 'legacy-unknown', ts, event_time, source, event_type, exchange_order_id,
            client_order_id, symbol, payload, processed
       FROM order_events`,
  );
  rebuildTable(
    db,
    "reconciliation_runs",
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     profile_id TEXT NOT NULL ${PROFILE_CHECK},
     started_at INTEGER NOT NULL,
     finished_at INTEGER,
     trigger TEXT NOT NULL,
     result TEXT,
     details TEXT`,
    `SELECT id, 'legacy-unknown', started_at, finished_at, trigger, result, details
       FROM reconciliation_runs`,
  );
  rebuildTable(
    db,
    "stream_owner_lease",
    `profile_id TEXT NOT NULL ${PROFILE_CHECK},
     lease_key TEXT NOT NULL,
     owner TEXT NOT NULL,
     acquired_at INTEGER NOT NULL,
     expires_at INTEGER NOT NULL,
     PRIMARY KEY (profile_id, lease_key)`,
    `SELECT 'legacy-unknown', lease_key, owner, acquired_at, expires_at FROM stream_owner_lease`,
  );
  rebuildTable(
    db,
    "fills_log",
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     profile_id TEXT NOT NULL ${PROFILE_CHECK},
     ts INTEGER NOT NULL,
     trade_id TEXT,
     exchange_order_id TEXT,
     client_order_id TEXT,
     symbol TEXT NOT NULL,
     side TEXT NOT NULL,
     qty TEXT NOT NULL,
     price TEXT NOT NULL,
     fee TEXT,
     fee_asset TEXT,
     realized_pnl TEXT,
     source TEXT NOT NULL,
     UNIQUE (profile_id, trade_id)`,
    `SELECT id, 'legacy-unknown', ts, trade_id, exchange_order_id, client_order_id, symbol, side,
            qty, price, fee, fee_asset, realized_pnl, source
       FROM fills_log`,
  );
  rebuildTable(
    db,
    "shadow_events",
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     profile_id TEXT NOT NULL ${PROFILE_CHECK},
     ts INTEGER NOT NULL,
     event_time INTEGER,
     event_type TEXT NOT NULL,
     symbol TEXT,
     side TEXT,
     qty TEXT,
     price TEXT,
     realized_pnl TEXT,
     client_order_id TEXT,
     exchange_order_id TEXT,
     payload TEXT NOT NULL`,
    `SELECT id, 'legacy-unknown', ts, event_time, event_type, symbol, side, qty, price,
            realized_pnl, client_order_id, exchange_order_id, payload
       FROM shadow_events`,
  );

  db.exec(`ALTER TABLE audit_log ADD COLUMN profile_id TEXT ${PROFILE_CHECK}`);
  db.exec(`UPDATE audit_log SET profile_id = 'legacy-unknown' WHERE profile_id IS NULL`);

  db.exec(`CREATE INDEX idx_runtime_profile_key ON runtime_config(profile_id, key)`);
  db.exec(`CREATE INDEX idx_intents_status_profile ON order_intents(profile_id, status)`);
  db.exec(`CREATE INDEX idx_intents_client_order_profile ON order_intents(profile_id, client_order_id)`);
  db.exec(`CREATE INDEX idx_intents_exchange_order_profile ON order_intents(profile_id, exchange_order_id)`);
  db.exec(`CREATE INDEX idx_intents_status ON order_intents(status)`);
  db.exec(`CREATE INDEX idx_events_client ON order_events(client_order_id)`);
  db.exec(`CREATE INDEX idx_events_profile_client ON order_events(profile_id, client_order_id)`);
  db.exec(`CREATE INDEX idx_events_profile_exchange ON order_events(profile_id, exchange_order_id)`);
  db.exec(`CREATE INDEX idx_reconciliation_profile_time ON reconciliation_runs(profile_id, started_at)`);
  db.exec(`CREATE INDEX idx_lease_profile_owner ON stream_owner_lease(profile_id, owner)`);
  db.exec(`CREATE INDEX idx_fills_profile_time ON fills_log(profile_id, ts)`);
  db.exec(`CREATE INDEX idx_fills_profile_client ON fills_log(profile_id, client_order_id)`);
  db.exec(`CREATE INDEX idx_fills_profile_exchange ON fills_log(profile_id, exchange_order_id)`);
  db.exec(`CREATE INDEX idx_fills_trade_id ON fills_log(trade_id)`);
  db.exec(`CREATE INDEX idx_shadow_ts ON shadow_events(ts)`);
  db.exec(`CREATE INDEX idx_shadow_symbol ON shadow_events(symbol)`);
  db.exec(`CREATE INDEX idx_shadow_profile_time ON shadow_events(profile_id, ts)`);
  db.exec(`CREATE INDEX idx_shadow_profile_symbol ON shadow_events(profile_id, symbol)`);
  db.exec(`CREATE INDEX idx_audit_profile_time ON audit_log(profile_id, ts)`);
}

export function currentVersion(db: Database.Database): number {
  const row = db.pragma("user_version", { simple: true });
  return typeof row === "number" ? row : 0;
}

export function runMigrations(db: Database.Database): void {
  const version = currentVersion(db);
  for (const m of MIGRATIONS) {
    if (m.version <= version) continue;
    const tx = db.transaction(() => {
      if (typeof m.up === "function") m.up(db);
      else for (const stmt of m.up) db.exec(stmt);
      db.pragma(`user_version = ${m.version}`);
    });
    tx();
  }
}
