/**
 * rankSymbolPool — the head of Vela's symbol search dialog.
 *
 * The picker lists the provider's futures index and, with a ranking registered, opens on
 * the head of THAT list (its built-in spot-majors pin stands down). A wrong order shows
 * the user `1000BONKUSDT.P` first; a wrong filter hides a market they hold. Both are
 * silent, which is why the pure ordering is pinned here.
 */
import { rankSymbolPool } from "@/lib/vela-symbol-search";
import type { SymbolDescriptor } from "@/lib/charting";

const d = (ticker: string): SymbolDescriptor => ({ ticker, type: "futures" });

const POOL: SymbolDescriptor[] = [
  d("1000BONKUSDT.P"),
  d("BTCUSDT.P"),
  d("ETHUSDT.P"),
  d("POLUSDT.P"),
  d("1000PEPEUSDT.P"),
  d("SOLUSDT.P"),
];

const tickers = (list: readonly SymbolDescriptor[]): string[] => list.map((s) => s.ticker);

describe("rankSymbolPool", () => {
  it("leads with the watchlist in the user's order, then the majors, then the pool", () => {
    expect(tickers(rankSymbolPool(POOL, ["SOLUSDT", "BTCUSDT"], ["ETHUSDT"]))).toEqual([
      "SOLUSDT.P",
      "BTCUSDT.P",
      "ETHUSDT.P",
      "1000BONKUSDT.P",
      "POLUSDT.P",
      "1000PEPEUSDT.P",
    ]);
  });

  it("maps MAWS aliases onto the listed contract", () => {
    expect(tickers(rankSymbolPool(POOL, ["PEPEUSDT", "MATICUSDT"])).slice(0, 2)).toEqual([
      "1000PEPEUSDT.P",
      "POLUSDT.P",
    ]);
  });

  it("skips watchlist entries and majors the pool cannot serve, and never duplicates a row", () => {
    const out = rankSymbolPool(POOL, ["MATICUSDT", "BTCUSDT", "BTCUSDT"], ["BTCUSDT"]);
    expect(tickers(out)).toEqual([
      "POLUSDT.P",
      "BTCUSDT.P",
      "1000BONKUSDT.P",
      "ETHUSDT.P",
      "1000PEPEUSDT.P",
      "SOLUSDT.P",
    ]);
    expect(new Set(tickers(out)).size).toBe(POOL.length);
  });

  it("keeps the whole pool when nothing is pinned", () => {
    expect(rankSymbolPool(POOL, [], [])).toEqual(POOL);
  });

  it("returns an empty head against an index that has not settled", () => {
    expect(rankSymbolPool([], ["BTCUSDT"], ["ETHUSDT"])).toEqual([]);
  });
});
