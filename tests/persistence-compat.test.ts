import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { MAWS_WORKSPACE_KEY } from "@/lib/maws/brand";
import { normalizeAppSettings } from "@/lib/app-theme";
import {
  DEFAULT_LAYOUT_SYNC,
  DEFAULT_PAPER_ACCOUNT,
  DEFAULT_SYMBOL_TRADING,
} from "@/types";

/**
 * Automated persistence-compatibility guard for the single workspace key
 * (maws.workspace.v6). Replaces "diff the persisted schema by eye":
 *
 *   1. partialize output must contain EXACTLY the approved 50-key set;
 *   2. runtime-only fields (feed values, menus, drawing session state) must
 *      never be persisted — hotSymbols included, from the moment it exists;
 *   3. partialize output must be JSON-serializable;
 *   4. hydrating the REAL root store from a representative legacy V6 fixture
 *      must restore the normalized state (renames, merges, migrations);
 *   5. the debounced write path must persist exactly the same 50-key set;
 *
 * The store is imported fresh via jest.isolateModules with a minimal
 * window/localStorage stub (jest env is "node"). zustand's persist hydration
 * is synchronous for synchronous storage, so state is fully normalized as soon
 * as the module import returns.
 */

type StoreModule = typeof import("@/lib/store");

const EXPECTED_PERSISTED_KEYS = [
  "activeIndicatorTemplateId",
  "activePaneId",
  "alerts",
  "appSettings",
  "autoScaleByPane",
  "balanceHistory",
  "bottomHeight",
  "bottomOpen",
  "bottomTab",
  "calendarNewsSplit",
  "chartSettings",
  "chartTemplates",
  "columnWidths",
  "connectedBroker",
  "detailsCollapsed",
  "drawingTool",
  "drawingsHidden",
  "indicatorSettings",
  "indicatorsHidden",
  "indicatorTemplates",
  "journal",
  "layoutCount",
  "layoutSync",
  "layoutTracks",
  "magnet",
  "mockBalance",
  "mockRealized",
  "newsCollapsed",
  "orderHistory",
  "orders",
  "orientation",
  "paneStretchFactors",
  "panes",
  "paperAccount",
  "performanceCollapsed",
  "positions",
  "range",
  "rightDock",
  "rightOpen",
  "rightWidth",
  "shortcuts",
  "stayInDrawingMode",
  "strategyCardsHeight",
  "symbolTrading",
  "technicalsCollapsed",
  "watchlist",
  "watchlistCollapsed",
  "watchlistGroupCollapsed",
  "watchlistGroups",
  "watchlistHeight",
].sort();
if (EXPECTED_PERSISTED_KEYS.length !== 50) {
  throw new Error("Approved persisted key set must contain exactly 50 keys");
}

/** Fields that must NEVER be persisted (runtime-only by design). */
const RUNTIME_ONLY_KEYS = [
  "hotSymbols", // market-data slice (phase g) — guarded from day one
  "searchOpen",
  "settingsOpen",
  "indicatorMenuOpen",
  "layoutMenuOpen",
  "contextMenu",
  "buySellMenu",
  "tradingSettingsSymbol",
  "accountSettingsOpen",
  "brokerDialogOpen",
  "indicatorSettingsId",
  "drawingSettingsTarget",
  "selectedDrawingId",
  "drawingHistory",
  "drawingHistoryIndex",
  "replay",
  "maximizedPaneId",
  "clipboardPrice",
  "vertCursorLocked",
  "lockedCursorTime",
];

interface WindowStub {
  localStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };
  setTimeout: (...args: Parameters<typeof setTimeout>) => ReturnType<typeof setTimeout>;
  clearTimeout: (...args: Parameters<typeof clearTimeout>) => void;
}

function installWindow(): Map<string, string> {
  const map = new Map<string, string>();
  const stub: WindowStub = {
    localStorage: {
      getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
      setItem: (key, value) => {
        map.set(key, String(value));
      },
      removeItem: (key) => {
        map.delete(key);
      },
    },
    // Indirections so jest fake timers (installed later) control the 400ms
    // debounce inside the store's storage wrapper.
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (...args) => clearTimeout(...args),
  };
  (globalThis as unknown as { window: WindowStub }).window = stub;
  return map;
}

function uninstallWindow(): void {
  delete (globalThis as unknown as { window?: WindowStub }).window;
}

function freshStore(): StoreModule {
  let mod: StoreModule | undefined;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- CommonJS require is required for a fresh module registry per test.
    mod = require("@/lib/store") as StoreModule;
  });
  if (!mod) throw new Error("isolateModules did not load @/lib/store");
  return mod;
}

function seedFixture(map: Map<string, string>, state: unknown): void {
  map.set(MAWS_WORKSPACE_KEY, JSON.stringify({ state, version: 0 }));
}

const LEGACY_FIXTURE: Record<string, unknown> = {
  layoutCount: 2,
  orientation: "h",
  layoutTracks: {},
  layoutSync: {},
  activePaneId: "pane-0",
  panes: [
    { id: "pane-0", symbol: "MATICUSDT", timeframe: "1D", studies: [], drawings: [] },
    { id: "pane-1", symbol: "EURUSD", timeframe: "1D", studies: [], drawings: [] },
  ],
  watchlist: ["MATICUSDT", "EURUSD", "BTCUSDT"],
  watchlistGroups: [
    { id: "g-main", name: "Main", collapsed: false, symbols: ["MATICUSDT", "EURUSD"] },
  ],
  drawingTool: "bogus-tool",
  rightDock: "news",
  bottomTab: "trades",
  calendarNewsSplit: null,
  chartSettings: { scaleFontSize: 14, timezone: "BadZone" },
  appSettings: { backgroundColor: "#ff0000" },
  symbolTrading: {
    MATICUSDT: { ...DEFAULT_SYMBOL_TRADING, leverage: 7 },
    EURUSD: { ...DEFAULT_SYMBOL_TRADING },
  },
  paperAccount: { leverage: { crypto: 5, forex: 20 } },
  indicatorTemplates: [
    { id: "vol-based", name: "Seeded", studies: [] },
    { id: "custom-1", name: "Mine", studies: [] },
  ],
  journal: [
    {
      id: "j-close",
      symbol: "BTCUSDT",
      side: "long",
      qty: 2,
      entry: 100,
      exit: 110,
      closedAt: 1700000000000,
    },
    { id: "j-note", text: "Manual note", time: 1700000000001 },
  ],
};

describe("persistence compatibility (maws.workspace.v6)", () => {
  beforeEach(() => {
    uninstallWindow();
  });

  afterEach(() => {
    jest.useRealTimers();
    uninstallWindow();
  });

  it("partialize outputs exactly the approved 50-key set", () => {
    installWindow();
    const { useAppStore, workspacePartialize } = freshStore();
    const out = workspacePartialize(useAppStore.getState());
    expect(Object.keys(out).sort()).toEqual(EXPECTED_PERSISTED_KEYS);
  });

  it("never persists runtime-only fields, even after mutating them", () => {
    installWindow();
    const { useAppStore, workspacePartialize } = freshStore();
    const s = useAppStore.getState();
    s.setSearchOpen(true);
    s.setSettingsOpen(true);
    s.setIndicatorMenuOpen(true);
    s.setLayoutMenuOpen(true);
    s.setBuySellMenu({ x: 1, y: 2, symbol: "BTCUSDT" });
    s.setTradingSettingsSymbol("BTCUSDT");
    s.setContextMenu({ x: 1, y: 2, paneId: "pane-0", price: 100, time: null });
    const out = workspacePartialize(useAppStore.getState()) as Record<string, unknown>;
    for (const key of RUNTIME_ONLY_KEYS) {
      expect(out).not.toHaveProperty(key);
    }
    expect(Object.keys(out).sort()).toEqual(EXPECTED_PERSISTED_KEYS);
  });

  it("partialize output survives a JSON round-trip", () => {
    installWindow();
    const { useAppStore, workspacePartialize } = freshStore();
    const out = workspacePartialize(useAppStore.getState());
    expect(JSON.parse(JSON.stringify(out))).toEqual(out);
  });

  it("hydrates a representative legacy V6 fixture into normalized state", () => {
    const map = installWindow();
    seedFixture(map, LEGACY_FIXTURE);
    const { useAppStore } = freshStore();
    const s = useAppStore.getState();

    // MATIC→POL rename, EURUSD dropped from watchlists; EURUSD pane → BTCUSDT.
    expect(s.watchlist).toEqual(["POLUSDT", "BTCUSDT"]);
    expect(s.watchlistGroups[0].symbols).toEqual(["POLUSDT"]);
    expect(s.panes).toHaveLength(2);
    expect(s.panes[0].symbol).toBe("POLUSDT");
    expect(s.panes[1].symbol).toBe("BTCUSDT");

    // Symbol trading settings: EURUSD deleted, MATIC migrated to POL.
    expect(Object.keys(s.symbolTrading)).toEqual(["POLUSDT"]);
    expect(s.symbolTrading.POLUSDT.leverage).toBe(7);

    // Legacy dock/tab renames and validation.
    expect(s.rightDock).toBe("calendar");
    expect(s.bottomTab).toBe("positions");
    expect(s.drawingTool).toBe("cursor");

    // Paper account leverage merge: legacy forex key deleted, crypto kept.
    expect(s.paperAccount.marginControl).toBe(DEFAULT_PAPER_ACCOUNT.marginControl);
    expect(s.paperAccount.leverage).toEqual({
      stocks: DEFAULT_PAPER_ACCOUNT.leverage.stocks,
      futures: DEFAULT_PAPER_ACCOUNT.leverage.futures,
      crypto: 5,
      others: DEFAULT_PAPER_ACCOUNT.leverage.others,
    });

    // Journal legacy migration to {id, time, text}.
    expect(s.journal).toEqual([
      {
        id: "j-close",
        time: 1700000000000,
        text: "Close long for symbol BTCUSDT at price 110 for 2 units",
      },
      { id: "j-note", time: 1700000000001, text: "Manual note" },
    ]);

    // Seeded indicator templates filtered; custom template kept.
    expect(s.indicatorTemplates).toHaveLength(1);
    expect(s.indicatorTemplates[0].id).toBe("custom-1");

    // Chart settings merge: 14px legacy default migrated, bad timezone reset.
    expect(s.chartSettings.scaleFontSize).toBe(12);
    expect(s.chartSettings.timezone).toBe("Africa/Casablanca");

    // Remaining guards.
    expect(s.layoutSync).toEqual(DEFAULT_LAYOUT_SYNC);
    expect(s.calendarNewsSplit).toBe(0.52);
    expect(s.appSettings).toEqual(
      normalizeAppSettings({ backgroundColor: "#ff0000" }),
    );
    expect(s.orders).toEqual([]);
    expect(s.positions).toEqual([]);
    expect(s.orderHistory).toEqual([]);
    expect(s.balanceHistory).toEqual([]);
    expect(s.buySellMenu).toBeNull();
    expect(s.tradingSettingsSymbol).toBeNull();
    expect(s.accountSettingsOpen).toBe(false);
    expect(s.brokerDialogOpen).toBe(false);
  });

  it("preserves valid bottomTab / rightDock values and finite split (second fixture)", () => {
    const map = installWindow();
    seedFixture(map, {
      rightDock: "watchlist",
      bottomTab: "journal",
      calendarNewsSplit: 0.7,
    });
    const { useAppStore } = freshStore();
    const s = useAppStore.getState();
    expect(s.rightDock).toBe("strategy");
    expect(s.bottomTab).toBe("journal");
    expect(s.calendarNewsSplit).toBe(0.7);
  });

  it("renames legacy screener dock to strategy (third fixture)", () => {
    const map = installWindow();
    seedFixture(map, { rightDock: "screener" });
    const { useAppStore } = freshStore();
    expect(useAppStore.getState().rightDock).toBe("strategy");
  });

  it("debounced write path persists exactly the 50-key set", () => {
    jest.useFakeTimers();
    const map = installWindow();
    const { useAppStore } = freshStore();

    useAppStore.getState().setBottomOpen(true);
    useAppStore.getState().setSearchOpen(true);
    jest.advanceTimersByTime(400);

    const raw = map.get(MAWS_WORKSPACE_KEY);
    expect(raw).toBeDefined();
    const parsed = JSON.parse(raw as string) as {
      version: number;
      state: Record<string, unknown>;
    };
    expect(parsed.version).toBe(0);
    expect(Object.keys(parsed.state).sort()).toEqual(EXPECTED_PERSISTED_KEYS);
    expect(parsed.state.bottomOpen).toBe(true);
    expect(parsed.state).not.toHaveProperty("searchOpen");
    expect(parsed.state).not.toHaveProperty("hotSymbols");
  });
});
