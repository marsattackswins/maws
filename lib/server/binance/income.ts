import "server-only";

import { getDb } from "../db/connection";
import { assertPersistenceProfile, activePersistenceProfile, type PersistenceProfile } from "../profile/context";
import { log } from "../log/logger";
import type { BinanceRestClient } from "./rest";

/**
 * Exchange income ledger (settlement of record for account metrics).
 *
 * Binance's /fapi/v1/income reports every realized money movement with a
 * stable `tranId`. Unlike the capped in-memory fill ring (last 500) and the
 * latest-50-fill DTO window, the ledger covers the full account lifetime and
 * includes commission and funding rows that fills never carry.
 *
 * Raw exchange rows are persisted exactly as reported; aggregation applies
 * the sign conventions:
 *   - REALIZED_PNL: positive = profit (as reported by Binance)
 *   - COMMISSION:   reported as a negative outflow; stored as reported,
 *                   exposed to the UI as a positive "cost" magnitude
 *   - FUNDING_FEE:  signed as reported (positive = received, negative = paid)
 *   - net = realizedPnl + commission + fundingFee (summing raw amounts)
 */

export const INCOME_TYPES = ["REALIZED_PNL", "COMMISSION", "FUNDING_FEE"] as const;
export type IncomeType = (typeof INCOME_TYPES)[number];

/** Binance income row (subset the ledger relies on). */
export interface IncomeRow {
  tranId: number;
  incomeType: string;
  symbol: string | null;
  amount: string;
  asset: string;
  time: number;
}

export interface IncomeTotals {
  /** Lifetime realized trading PnL from REALIZED_PNL rows. */
  realizedPnl: number;
  /** Lifetime commission cost as a positive magnitude (USD). */
  commission: number;
  /** Lifetime funding fees, signed as reported (paid = negative). */
  fundingFee: number;
  /** realizedPnl - |commission| + fundingFee: the net realized result. */
  netRealized: number;
}

/** Deterministic ledger key for an income row. */
function incomeKey(row: IncomeRow): string {
  return `t${row.tranId}:${row.incomeType}:${row.symbol ?? ""}:${row.time}:${row.amount}`;
}

/**
 * Parses an income amount; non-finite values are ignored upstream. Empty or
 * whitespace-only strings are rejected (Number("") is 0, which would
 * silently record a bogus amount).
 */
export function parseIncomeAmount(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Normalizes a raw /fapi/v1/income entry. Returns null for entries without a
 * parsable amount (ignored rather than partially recorded).
 */
export function normalizeIncomeRow(
  raw: { tranId: number; type: string; symbol?: string | null; income: string; asset: string; time: number },
): IncomeRow | null {
  if (typeof raw.time !== "number" || !Number.isFinite(raw.time)) return null;
  if (parseIncomeAmount(raw.income) == null) return null;
  return {
    tranId: raw.tranId,
    incomeType: raw.type,
    symbol: raw.symbol || null,
    amount: raw.income,
    asset: raw.asset,
    time: raw.time,
  };
}

/** True when this row was already persisted (insert-or-ignore changes nothing). */
export function incomeExists(key: string, profile: PersistenceProfile = activePersistenceProfile()): boolean {
  assertPersistenceProfile(profile);
  return Boolean(
    getDb().prepare(`SELECT 1 FROM account_income WHERE profile_id = ? AND income_id = ? LIMIT 1`).get(profile.id, key),
  );
}

/** Inserts one income row idempotently. Returns true when newly persisted. */
export function persistIncomeRow(row: IncomeRow, source: "rest" | "stream", profile: PersistenceProfile = activePersistenceProfile()): boolean {
  assertPersistenceProfile(profile);
  const result = getDb()
    .prepare(
      `INSERT OR IGNORE INTO account_income (profile_id, income_id, ts, income_type, symbol, amount, asset, info, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
    )
    .run(profile.id, incomeKey(row), row.time, row.incomeType, row.symbol, row.amount, row.asset, source);
  return result.changes > 0;
}

/** Lifetime aggregates from the durable ledger, restricted to tracked types. */
export function incomeTotals(profile: PersistenceProfile = activePersistenceProfile()): IncomeTotals {
  assertPersistenceProfile(profile);
  const rows = getDb()
    .prepare(`SELECT income_type, amount FROM account_income WHERE profile_id = ?`)
    .all(profile.id) as Array<{ income_type: string; amount: string }>;
  let realizedPnl = 0;
  let commission = 0;
  let fundingFee = 0;
  for (const row of rows) {
    const amount = parseIncomeAmount(row.amount) ?? 0;
    switch (row.income_type) {
      case "REALIZED_PNL":
        realizedPnl += amount;
        break;
      case "COMMISSION":
        commission += Math.abs(amount);
        break;
      case "FUNDING_FEE":
        fundingFee += amount;
        break;
      default:
        break;
    }
  }
  return {
    realizedPnl,
    commission,
    fundingFee,
    netRealized: realizedPnl - commission + fundingFee,
  };
}

const PAGE_LIMIT = 1000;
/** One full history sync is bounded; later passes continue where this left off. */
const MAX_PAGES_PER_PASS = 5;

/**
 * Result of an incremental income sync.
 * `fullySynced` is false when the pass hit its page budget before reaching
 * the present; the next pass resumes from the stored high-water mark.
 */
export interface IncomeSyncResult {
  inserted: number;
  pages: number;
  fullySynced: boolean;
  /** Newest income time persisted (ledger high-water mark). */
  watermark: number | null;
}

/**
 * True when the durable ledger already contains a REALIZED_PNL row whose
 * amount equals `pnl` (exactly the value Binance's closing trades reported).
 * Bounded: at most 200 scanned rows per call, called only from the short
 * closing-fill retry path — never in a hot loop.
 */
export function incomeLedgerIncludes(pnl: number, profile: PersistenceProfile = activePersistenceProfile()): boolean {
  assertPersistenceProfile(profile);
  const rows = getDb()
    .prepare(
      `SELECT amount FROM account_income
       WHERE profile_id = ? AND income_type = 'REALIZED_PNL'
       ORDER BY ts DESC LIMIT 200`,
    )
    .all(profile.id) as Array<{ amount: string }>;
  return rows.some((row) => {
    const amount = parseIncomeAmount(row.amount);
    return amount != null && Math.abs(amount - pnl) < 5e-9;
  });
}

/** Ledger high-water mark: newest income row time already persisted. */
export function incomeWatermark(profile: PersistenceProfile = activePersistenceProfile()): number {
  assertPersistenceProfile(profile);
  const row = getDb()
    .prepare(`SELECT MAX(ts) AS max_ts FROM account_income WHERE profile_id = ?`)
    .get(profile.id) as { max_ts: number | null };
  return row.max_ts ?? 0;
}

/**
 * Incremental sync of tracked income types into the durable ledger.
 *
 * Pagination walks forward from the stored watermark. Binance caps pages at
 * 1000 rows / 7-day windows; when a page fills we re-query from the last row
 * so overlapping boundaries cannot lose records. Duplicate tranIds are
 * absorbed by the (profile_id, income_id) primary key.
 */
export async function syncIncomeHistory(
  rest: BinanceRestClient,
  profile: PersistenceProfile = activePersistenceProfile(),
): Promise<IncomeSyncResult> {
  assertPersistenceProfile(profile);
  const db = getDb();
  const startTime = incomeWatermark(profile);
  let inserted = 0;
  let pages = 0;
  let cursor = startTime;
  let fullySynced = true;
  let watermark: number | null = startTime > 0 ? startTime : null;

  const insert = db.prepare(
    `INSERT OR IGNORE INTO account_income (profile_id, income_id, ts, income_type, symbol, amount, asset, info, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 'rest')`,
  );

  for (;;) {
    if (pages >= MAX_PAGES_PER_PASS) {
      fullySynced = false;
      break;
    }
    const raw = await rest.getIncome({
      incomeType: undefined,
      startTime: cursor > 0 ? cursor : undefined,
      limit: PAGE_LIMIT,
    });
    pages += 1;
    if (!Array.isArray(raw) || raw.length === 0) break;

    const tx = db.transaction(() => {
      for (const entry of raw) {
        const row = normalizeIncomeRow(entry);
        if (!row) continue;
        if (!INCOME_TYPES.includes(row.incomeType as IncomeType)) continue;
        if (insert.run(profile.id, incomeKey(row), row.time, row.incomeType, row.symbol, row.amount, row.asset).changes > 0) {
          inserted += 1;
          if (watermark == null || row.time > watermark) watermark = row.time;
        }
      }
    });
    tx();

    if (raw.length < PAGE_LIMIT) break;
    // Full page: advance past the newest timestamp seen. Rows sharing that
    // timestamp are re-fetched and deduplicated by the primary key.
    const times = raw.map((e) => (typeof e.time === "number" && Number.isFinite(e.time) ? e.time : 0)).filter((t) => t > 0);
    if (times.length === 0) break;
    const next = Math.max(...times);
    if (next <= cursor) break; // defensive: no forward progress
    cursor = next;
  }

  if (inserted > 0) log.info("income history synced", { inserted, pages, fullySynced, profile: profile.id });
  return { inserted, pages, fullySynced, watermark };
}
