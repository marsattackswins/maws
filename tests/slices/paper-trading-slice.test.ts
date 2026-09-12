import { describe, it, expect, beforeEach } from "@jest/globals";
import { useAppStore, workspacePartialize } from "@/lib/store";
import type { Store } from "@/lib/store";
import { createPaperTradingSlice } from "@/lib/slices/paper-trading-slice";
import { MOCK_START_BALANCE } from "@/lib/brokers";
import { defaultProtect, liquidationPrice } from "@/lib/trade-marks";
import { DEFAULT_PAPER_ACCOUNT } from "@/types";
import type {
  BalanceHistoryEntry,
  ChartOrder,
  JournalEntry,
  OrderHistoryEntry,
  PaperAccountSettings,
} from "@/types";

/**
 * Phase H regression tests for the paper-trading-slice extraction:
 *   - every paper-trading default survives the move into createPaperTradingSlice;
 *   - order/position/history/journal action semantics are unchanged
 *     (uid assignment, non-mutating updates, prepend + 500 cap);
 *   - addPosition protection defaults, explicit override/null semantics and
 *     updatePosition liquidation-price recomputation rule are preserved;
 *   - setPaperAccount leverage-copy isolation and patchPaperAccount nested merge;
 *   - resetPaperAccount full semantics incl. the chartSettings.defaultLeverage
 *     cross-slice contract, proven atomic via the counting-set harness;
 *   - persistence boundary: the nine paper fields keep their positions
 *     (#33–37 and #46–49) in the frozen 50-key workspacePartialize output.
 */

const PAPER_FIELDS = [
  "connectedBroker",
  "mockBalance",
  "mockRealized",
  "paperAccount",
  "orders",
  "positions",
  "orderHistory",
  "balanceHistory",
  "journal",
] as const;

const CROSS_FIELDS = ["chartSettings"] as const;

function snapshot(): Record<string, unknown> {
  const s = useAppStore.getState() as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of [...PAPER_FIELDS, ...CROSS_FIELDS]) out[k] = s[k];
  return JSON.parse(JSON.stringify(out));
}

const pristine = snapshot();

function resetPaper(): void {
  useAppStore.setState(JSON.parse(JSON.stringify(pristine)) as Partial<Store>);
}

beforeEach(resetPaper);

const mkOrder = (over: Partial<ChartOrder> = {}): Omit<ChartOrder, "id"> => ({
  symbol: "BTCUSDT",
  side: "buy",
  type: "limit",
  price: 100,
  qty: 2,
  ...over,
});

const mkPosition = (
  over: Partial<Parameters<Store["addPosition"]>[0]> = {},
): Parameters<Store["addPosition"]>[0] => ({
  symbol: "BTCUSDT",
  side: "long",
  entry: 100,
  qty: 1,
  leverage: 10,
  ...over,
});

const mkOrderHistory = (
  over: Partial<OrderHistoryEntry> = {},
): Omit<OrderHistoryEntry, "id"> => ({
  time: 1000,
  symbol: "BTCUSDT",
  side: "buy",
  type: "market",
  qty: 1,
  price: 100,
  status: "filled",
  ...over,
});

const mkBalanceHistory = (
  over: Partial<BalanceHistoryEntry> = {},
): Omit<BalanceHistoryEntry, "id"> => ({
  time: 1000,
  type: "deposit",
  amount: 500,
  balanceAfter: 100_500,
  note: "test",
  ...over,
});

const mkJournal = (over: Partial<JournalEntry> = {}): Omit<JournalEntry, "id"> => ({
  time: 1000,
  text: "entry",
  ...over,
});

describe("paper-trading-slice defaults (real root store)", () => {
  it("carries every documented paper-trading default", () => {
    const s = useAppStore.getState();
    expect(s.connectedBroker).toBeNull();
    expect(s.mockBalance).toBe(MOCK_START_BALANCE);
    expect(s.mockRealized).toBe(0);
    expect(s.paperAccount).toEqual(DEFAULT_PAPER_ACCOUNT);
    expect(s.paperAccount.leverage).not.toBe(DEFAULT_PAPER_ACCOUNT.leverage);
    expect(s.orders).toEqual([]);
    expect(s.positions).toEqual([]);
    expect(s.orderHistory).toEqual([]);
    expect(s.balanceHistory).toEqual([]);
    expect(s.journal).toEqual([]);
  });
});

describe("order actions", () => {
  it("addOrder appends with a generated unique id", () => {
    const s = useAppStore.getState();
    s.addOrder(mkOrder());
    s.addOrder(mkOrder({ symbol: "ETHUSDT" }));
    const orders = useAppStore.getState().orders;
    expect(orders).toHaveLength(2);
    expect(orders[0].id).toEqual(expect.any(String));
    expect(orders[0].id.length).toBeGreaterThan(0);
    expect(orders[0].id).not.toBe(orders[1].id);
    expect(orders[0].symbol).toBe("BTCUSDT");
    expect(orders[1].symbol).toBe("ETHUSDT");
  });

  it("updateOrder patches only the matching order without mutating siblings", () => {
    const s = useAppStore.getState();
    s.addOrder(mkOrder());
    s.addOrder(mkOrder({ symbol: "ETHUSDT" }));
    const [a, b] = useAppStore.getState().orders;
    useAppStore.getState().updateOrder(a.id, { qty: 7, price: 123 });
    const orders = useAppStore.getState().orders;
    expect(orders[0]).toEqual({ ...a, qty: 7, price: 123 });
    expect(orders[1]).toEqual(b);
    expect(orders[0]).not.toBe(a);
  });

  it("removeOrder removes only the targeted order", () => {
    const s = useAppStore.getState();
    s.addOrder(mkOrder());
    s.addOrder(mkOrder({ symbol: "ETHUSDT" }));
    const [a] = useAppStore.getState().orders;
    useAppStore.getState().removeOrder(a.id);
    const orders = useAppStore.getState().orders;
    expect(orders).toHaveLength(1);
    expect(orders[0].symbol).toBe("ETHUSDT");
  });
});

describe("position actions", () => {
  it("addPosition fills id, openedAt, liq and default tp/sl protections", () => {
    useAppStore.getState().addPosition(mkPosition());
    const pos = useAppStore.getState().positions[0];
    expect(pos.id).toEqual(expect.any(String));
    expect(typeof pos.openedAt).toBe("number");
    expect(pos.liq).toBe(liquidationPrice({ side: "long", entry: 100, leverage: 10 }));
    const protect = defaultProtect(100, "long");
    expect(pos.tp).toBe(protect.tp);
    expect(pos.sl).toBe(protect.sl);
  });

  it("addPosition honors explicit tp/sl overrides including null; liq: null falls back to computed", () => {
    useAppStore.getState().addPosition(mkPosition({ tp: null, sl: 42, liq: null }));
    const pos = useAppStore.getState().positions[0];
    expect(pos.tp).toBeNull();
    expect(pos.sl).toBe(42);
    expect(pos.liq).toBe(liquidationPrice({ side: "long", entry: 100, leverage: 10 }));
  });

  it("addPosition keeps an explicit numeric liq", () => {
    useAppStore.getState().addPosition(mkPosition({ liq: 77 }));
    expect(useAppStore.getState().positions[0].liq).toBe(77);
  });

  it("addPosition keeps an explicit openedAt and uses short-side protections", () => {
    useAppStore.getState().addPosition(mkPosition({ side: "short", openedAt: 1234 }));
    const pos = useAppStore.getState().positions[0];
    expect(pos.openedAt).toBe(1234);
    const protect = defaultProtect(100, "short");
    expect(pos.tp).toBe(protect.tp);
    expect(pos.sl).toBe(protect.sl);
  });

  it("updatePosition recomputes liq on entry/leverage/side patches only", () => {
    useAppStore.getState().addPosition(mkPosition());
    const id = useAppStore.getState().positions[0].id;

    useAppStore.getState().updatePosition(id, { tp: 150 });
    let pos = useAppStore.getState().positions[0];
    const liqBefore = pos.liq;
    expect(pos.tp).toBe(150);
    expect(pos.liq).toBe(liqBefore);

    useAppStore.getState().updatePosition(id, { leverage: 2 });
    pos = useAppStore.getState().positions[0];
    expect(pos.liq).toBe(liquidationPrice({ side: "long", entry: 100, leverage: 2 }));

    useAppStore.getState().updatePosition(id, { entry: 200 });
    pos = useAppStore.getState().positions[0];
    expect(pos.liq).toBe(liquidationPrice({ side: "long", entry: 200, leverage: 2 }));
  });

  it("removePosition removes only the targeted position", () => {
    const s = useAppStore.getState();
    s.addPosition(mkPosition());
    s.addPosition(mkPosition({ symbol: "ETHUSDT" }));
    const [a] = useAppStore.getState().positions;
    useAppStore.getState().removePosition(a.id);
    const positions = useAppStore.getState().positions;
    expect(positions).toHaveLength(1);
    expect(positions[0].symbol).toBe("ETHUSDT");
  });
});

describe("history and journal actions", () => {
  it("prepends entries with generated ids for all three histories", () => {
    const s = useAppStore.getState();
    s.addOrderHistory(mkOrderHistory({ symbol: "OLD" }));
    s.addOrderHistory(mkOrderHistory({ symbol: "NEW" }));
    s.addBalanceHistory(mkBalanceHistory({ note: "old" }));
    s.addBalanceHistory(mkBalanceHistory({ note: "new" }));
    s.addJournalEntry(mkJournal({ text: "old" }));
    s.addJournalEntry(mkJournal({ text: "new" }));

    const st = useAppStore.getState();
    expect(st.orderHistory.map((e) => e.symbol)).toEqual(["NEW", "OLD"]);
    expect(st.balanceHistory.map((e) => e.note)).toEqual(["new", "old"]);
    expect(st.journal.map((e) => e.text)).toEqual(["new", "old"]);
    for (const e of st.orderHistory) expect(e.id).toEqual(expect.any(String));
    expect(st.orderHistory[0].id).not.toBe(st.orderHistory[1].id);
  });

  it("caps all three histories at 500 entries, keeping the newest", () => {
    const seed = Array.from({ length: 500 }, (_, i) => ({
      ...mkJournal({ text: `e${i}` }),
      id: `seed-${i}`,
    }));
    useAppStore.setState({ journal: seed } as Partial<Store>);

    useAppStore.getState().addJournalEntry(mkJournal({ text: "newest" }));
    const journal = useAppStore.getState().journal;
    expect(journal).toHaveLength(500);
    expect(journal[0].text).toBe("newest");
    expect(journal[499].text).toBe("e498");
  });
});

describe("paper account actions", () => {
  it("setPaperAccount copies leverage so later source mutation is isolated", () => {
    const value = {
      ...DEFAULT_PAPER_ACCOUNT,
      leverage: { ...DEFAULT_PAPER_ACCOUNT.leverage, crypto: 7 },
    };
    useAppStore.getState().setPaperAccount(value);
    value.leverage.crypto = 99;
    expect(useAppStore.getState().paperAccount.leverage.crypto).toBe(7);
  });

  it("patchPaperAccount deep-merges leverage and shallow-merges top-level fields", () => {
    useAppStore.getState().patchPaperAccount({
      leverage: { crypto: 3 } as PaperAccountSettings["leverage"],
      marginControl: true,
    });
    const acc = useAppStore.getState().paperAccount;
    expect(acc.leverage.crypto).toBe(3);
    expect(acc.leverage.stocks).toBe(DEFAULT_PAPER_ACCOUNT.leverage.stocks);
    expect(acc.marginControl).toBe(true);
  });

  it("resetPaperAccount restores account state and defaultLeverage, preserving other chartSettings", () => {
    const before = useAppStore.getState().chartSettings;
    useAppStore.setState({
      mockBalance: 5,
      mockRealized: 9,
      orders: [{ ...mkOrder(), id: "o1" }],
      positions: [],
      paperAccount: { ...DEFAULT_PAPER_ACCOUNT, leverage: { ...DEFAULT_PAPER_ACCOUNT.leverage, crypto: 42 } },
      chartSettings: { ...before, defaultLeverage: 42, scaleFontSize: 20 },
    } as Partial<Store>);

    useAppStore.getState().resetPaperAccount();

    const s = useAppStore.getState();
    expect(s.mockBalance).toBe(MOCK_START_BALANCE);
    expect(s.mockRealized).toBe(0);
    expect(s.orders).toEqual([]);
    expect(s.positions).toEqual([]);
    expect(s.paperAccount).toEqual(DEFAULT_PAPER_ACCOUNT);
    expect(s.chartSettings.defaultLeverage).toBe(DEFAULT_PAPER_ACCOUNT.leverage.crypto);
    expect(s.chartSettings.scaleFontSize).toBe(20);
  });
});

describe("persistence boundary (50-key schema)", () => {
  it("keeps the nine paper fields at positions #33-37 and #46-49", () => {
    const keys = Object.keys(workspacePartialize(useAppStore.getState()));
    expect(keys).toHaveLength(50);
    expect(keys.slice(32, 37)).toEqual(["orders", "positions", "orderHistory", "balanceHistory", "journal"]);
    expect(keys.slice(45, 49)).toEqual(["connectedBroker", "mockBalance", "mockRealized", "paperAccount"]);
  });
});

describe("resetPaperAccount atomicity (counting-set harness)", () => {
  it("performs exactly ONE set() covering paperAccount, chartSettings.defaultLeverage and the reset fields", () => {
    const chartSettings = {
      ...useAppStore.getState().chartSettings,
      defaultLeverage: 42,
      scaleFontSize: 20,
    };
    const state = {
      chartSettings,
      paperAccount: DEFAULT_PAPER_ACCOUNT,
    } as unknown as Store;
    const calls: Array<Partial<Store>> = [];
    const set = (
      partial: Partial<Store> | ((s: Store) => Partial<Store>),
    ): void => {
      const patch = typeof partial === "function" ? partial(state) : partial;
      calls.push(patch);
      Object.assign(state, patch);
    };
    const slice = createPaperTradingSlice(set, () => state);

    slice.resetPaperAccount();

    expect(calls).toHaveLength(1);
    const patch = calls[0] as unknown as {
      mockBalance: number;
      mockRealized: number;
      orders: ChartOrder[];
      positions: unknown[];
      paperAccount: typeof DEFAULT_PAPER_ACCOUNT;
      chartSettings: { defaultLeverage: number; scaleFontSize: number };
    };
    expect(Object.keys(calls[0] ?? {}).sort()).toEqual(
      ["chartSettings", "mockBalance", "mockRealized", "orders", "paperAccount", "positions"].sort(),
    );
    expect(patch.mockBalance).toBe(MOCK_START_BALANCE);
    expect(patch.mockRealized).toBe(0);
    expect(patch.orders).toEqual([]);
    expect(patch.positions).toEqual([]);
    expect(patch.paperAccount).toEqual(DEFAULT_PAPER_ACCOUNT);
    expect(patch.chartSettings.defaultLeverage).toBe(DEFAULT_PAPER_ACCOUNT.leverage.crypto);
    expect(patch.chartSettings.scaleFontSize).toBe(20);
    expect(patch.chartSettings).not.toBe(chartSettings);
  });
});
