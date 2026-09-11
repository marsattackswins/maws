import "server-only";

import { getDb } from "../db/connection";
import { log } from "../log/logger";
import { extractConstraints, type SymbolConstraints } from "./filters";
import type { BinanceRestClient } from "./rest";
import type { ExchangeSymbolInfo } from "./types";
import {
  activePersistenceProfile,
  assertPersistenceProfile,
  type PersistenceProfile,
} from "../profile/context";

const REFRESH_MS = 60 * 60 * 1000;

/** Caches exchangeInfo filters + leverage brackets (DB-backed, hourly refresh). */
export class MetadataCache {
  private constraints = new Map<string, SymbolConstraints>();
  private loadedAt = 0;

  constructor(
    private readonly rest: BinanceRestClient,
    private readonly persistenceProfile: PersistenceProfile = activePersistenceProfile(),
  ) {
    assertPersistenceProfile(persistenceProfile);
  }

  async ensureLoaded(force = false): Promise<void> {
    assertPersistenceProfile(this.persistenceProfile);
    const now = Date.now();
    if (!force && this.constraints.size > 0 && now - this.loadedAt < REFRESH_MS) return;

    const db = getDb();
    const rows = db.prepare(`SELECT symbol, status, base_asset, quote_asset, filters, updated_at FROM exchange_symbol_filters WHERE profile_id = ?`).all(this.persistenceProfile.id) as Array<{
      symbol: string;
      status: string;
      base_asset: string;
      quote_asset: string;
      filters: string;
      updated_at: number;
    }>;
    const fresh = rows.filter((r) => now - r.updated_at < REFRESH_MS);
    if (!force && fresh.length > 0 && fresh.length === rows.length && rows.length > 0) {
      this.loadFromRows(fresh);
      return;
    }

    const info = await this.rest.getExchangeInfo();
    const insert = db.prepare(
      `INSERT INTO exchange_symbol_filters (profile_id, symbol, status, base_asset, quote_asset, filters, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(profile_id, symbol) DO UPDATE SET status = excluded.status, base_asset = excluded.base_asset,
         quote_asset = excluded.quote_asset, filters = excluded.filters, updated_at = excluded.updated_at`,
    );
    const tx = db.transaction((symbols: ExchangeSymbolInfo[]) => {
      for (const s of symbols) {
        insert.run(this.persistenceProfile.id, s.symbol, s.status, s.baseAsset, s.quoteAsset, JSON.stringify(s.filters), now);
      }
    });
    tx(info.symbols);
    log.info("exchange metadata refreshed", { symbols: info.symbols.length });
    this.ensureLoadedFromDb();
  }

  private loadFromRows(rows: Array<{ symbol: string; status: string; base_asset: string; quote_asset: string; filters: string }>): void {
    this.constraints.clear();
    for (const r of rows) {
      try {
        const filters = JSON.parse(r.filters) as ExchangeSymbolInfo["filters"];
        this.constraints.set(
          r.symbol,
          extractConstraints({ symbol: r.symbol, status: r.status, baseAsset: r.base_asset, quoteAsset: r.quote_asset, filters }),
        );
      } catch {
        // Skip malformed rows; the next forced refresh will heal them.
      }
    }
    this.loadedAt = Date.now();
  }

  ensureLoadedFromDb(): void {
    assertPersistenceProfile(this.persistenceProfile);
    const rows = getDb().prepare(`SELECT symbol, status, base_asset, quote_asset, filters FROM exchange_symbol_filters WHERE profile_id = ?`).all(this.persistenceProfile.id) as Array<{
      symbol: string;
      status: string;
      base_asset: string;
      quote_asset: string;
      filters: string;
    }>;
    this.loadFromRows(rows);
  }

  getConstraints(symbol: string): SymbolConstraints | null {
    return this.constraints.get(symbol) ?? null;
  }

  symbolCount(): number {
    return this.constraints.size;
  }

  async refreshLeverageBrackets(): Promise<void> {
    assertPersistenceProfile(this.persistenceProfile);
    const rows = await this.rest.getLeverageBrackets();
    const db = getDb();
    const insert = db.prepare(
      `INSERT INTO exchange_leverage_brackets (profile_id, symbol, brackets, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(profile_id, symbol) DO UPDATE SET brackets = excluded.brackets, updated_at = excluded.updated_at`,
    );
    const tx = db.transaction(() => {
      for (const r of rows) insert.run(this.persistenceProfile.id, r.symbol, JSON.stringify(r.brackets), Date.now());
    });
    tx();
  }

  maxInitialLeverage(symbol: string): number | null {
    assertPersistenceProfile(this.persistenceProfile);
    const row = getDb().prepare(`SELECT brackets FROM exchange_leverage_brackets WHERE profile_id = ? AND symbol = ?`).get(this.persistenceProfile.id, symbol) as
      | { brackets: string }
      | undefined;
    if (!row) return null;
    try {
      const brackets = JSON.parse(row.brackets) as Array<{ initialLeverage: number }>;
      return brackets.length > 0 ? Math.max(...brackets.map((b) => b.initialLeverage)) : null;
    } catch {
      return null;
    }
  }
}
