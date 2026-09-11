import { describe, it, expect } from "@jest/globals";
import type { Store } from "@/lib/store";
import { normalizePaperTradingRehydrate } from "@/lib/slices/paper-trading-slice";
import { MOCK_START_BALANCE } from "@/lib/brokers";
import { DEFAULT_PAPER_ACCOUNT } from "@/types";

/**
 * Phase H pure-function tests for normalizePaperTradingRehydrate — the legacy
 * paper-trading hydration moved verbatim out of the root onRehydrateStorage:
 *   - leverage merge keeps saved values, merges defaults, deletes legacy forex;
 *   - paperAccount merges over defaults (incl. fully missing account);
 *   - orders/positions/orderHistory/balanceHistory guard to [];
 *   - journal legacy-shape migration (text-style, closedAt-style, fallback);
 *   - connectedBroker/mockBalance/mockRealized guards keep existing values.
 * No bottomTab coverage here — bottomTab normalization is ui-slice exclusive.
 */

type LegacyState = Record<string, unknown>;

function hydrate(state: LegacyState): LegacyState {
  normalizePaperTradingRehydrate(state as unknown as Store);
  return state;
}

describe("leverage merge and forex deletion", () => {
  it("keeps saved leverage values, merges defaults, and deletes legacy forex", () => {
    const s = hydrate({
      paperAccount: { leverage: { crypto: 5, forex: 20 } },
    });
    const acc = s.paperAccount as typeof DEFAULT_PAPER_ACCOUNT;
    expect(acc.leverage.crypto).toBe(5);
    expect(acc.leverage.stocks).toBe(DEFAULT_PAPER_ACCOUNT.leverage.stocks);
    expect(acc.leverage.futures).toBe(DEFAULT_PAPER_ACCOUNT.leverage.futures);
    expect(acc.leverage.others).toBe(DEFAULT_PAPER_ACCOUNT.leverage.others);
    expect(acc.leverage).not.toHaveProperty("forex");
    expect(acc.marginControl).toBe(DEFAULT_PAPER_ACCOUNT.marginControl);
  });
});

describe("paperAccount merge", () => {
  it("fills a fully missing paperAccount from defaults", () => {
    const s = hydrate({});
    expect(s.paperAccount).toEqual(DEFAULT_PAPER_ACCOUNT);
  });

  it("keeps saved account fields while merging missing ones", () => {
    const s = hydrate({
      paperAccount: { marginControl: true, leverage: { crypto: 9 } },
    });
    const acc = s.paperAccount as typeof DEFAULT_PAPER_ACCOUNT;
    expect(acc.marginControl).toBe(true);
    expect(acc.commissionPerContract).toBe(DEFAULT_PAPER_ACCOUNT.commissionPerContract);
    expect(acc.leverage.crypto).toBe(9);
  });
});

describe("history-array guards", () => {
  it("defaults orders/positions/orderHistory/balanceHistory to []", () => {
    const s = hydrate({});
    expect(s.orders).toEqual([]);
    expect(s.positions).toEqual([]);
    expect(s.orderHistory).toEqual([]);
    expect(s.balanceHistory).toEqual([]);
  });

  it("keeps existing history arrays untouched", () => {
    const orders = [{ id: "o1", symbol: "BTCUSDT" }];
    const positions = [{ id: "p1", symbol: "ETHUSDT" }];
    const s = hydrate({ orders, positions, orderHistory: orders, balanceHistory: orders });
    expect(s.orders).toBe(orders);
    expect(s.positions).toBe(positions);
    expect(s.orderHistory).toBe(orders);
    expect(s.balanceHistory).toBe(orders);
  });
});

describe("journal legacy migration", () => {
  it("keeps current text-style entries exactly", () => {
    const entry = { id: "j1", time: 123, text: "kept" };
    const s = hydrate({ journal: [entry] });
    expect(s.journal).toEqual([{ id: "j1", time: 123, text: "kept" }]);
  });

  it("migrates closedAt-style entries into text form", () => {
    const s = hydrate({
      journal: [
        { id: "j2", symbol: "BTCUSDT", side: "sell", qty: 3, entry: 100, exit: 200, closedAt: 456 },
      ],
    });
    expect(s.journal).toEqual([
      { id: "j2", time: 456, text: "Close sell for symbol BTCUSDT at price 200 for 3 units" },
    ]);
  });

  it("uses fallback words for closedAt entries missing side/exit/qty", () => {
    const s = hydrate({ journal: [{ id: "j3", symbol: "ETHUSDT", closedAt: 789 }] });
    expect(s.journal).toEqual([
      { id: "j3", time: 789, text: "Close position for symbol ETHUSDT at price — for — units" },
    ]);
  });

  it("falls back for unrecognized shapes and defaults an empty journal", () => {
    const s = hydrate({ journal: [{ id: "j4" }] });
    const entries = s.journal as Array<{ id: string; time: number; text: string }>;
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe("j4");
    expect(entries[0].text).toBe("Journal entry");
    expect(typeof entries[0].time).toBe("number");

    const empty = hydrate({});
    expect(empty.journal).toEqual([]);
  });
});

describe("broker and balance guards", () => {
  it("defaults connectedBroker/mockBalance/mockRealized when missing", () => {
    const s = hydrate({});
    expect(s.connectedBroker).toBeNull();
    expect(s.mockBalance).toBe(MOCK_START_BALANCE);
    expect(s.mockRealized).toBe(0);
  });

  it("clears unverified live broker while keeping paper balances", () => {
    const s = hydrate({ connectedBroker: "binance", mockBalance: 12345, mockRealized: 67 });
    expect(s.connectedBroker).toBeNull();
    expect(s.mockBalance).toBe(12345);
    expect(s.mockRealized).toBe(67);
  });
});
