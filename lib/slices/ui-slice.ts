import {
  applyAppTheme,
  DEFAULT_APP_SETTINGS,
  normalizeAppSettings,
  type AppSettings,
} from "@/lib/app-theme";
import {
  DEFAULT_SHORTCUTS,
  mergeShortcuts,
  type ShortcutChord,
  type ShortcutId,
  type ShortcutMap,
} from "@/lib/shortcuts";
import type { BuySellMenuState, ContextMenuState, DockId } from "@/types";
import type { Store } from "@/lib/store";

export type BottomTab =
  | "positions"
  | "orders"
  | "orderHistory"
  | "balanceHistory"
  | "journal";

export type UiSliceState = {
  shortcuts: ShortcutMap;
  rightOpen: boolean;
  bottomOpen: boolean;
  bottomTab: BottomTab;
  rightDock: DockId;
  rightWidth: number;
  bottomHeight: number;
  searchOpen: boolean;
  indicatorMenuOpen: boolean;
  layoutMenuOpen: boolean;
  settingsOpen: boolean;
  brokerDialogOpen: boolean;
  accountSettingsOpen: boolean;
  buySellMenu: BuySellMenuState;
  tradingSettingsSymbol: string | null;
  contextMenu: ContextMenuState;
  appSettings: AppSettings;
  columnWidths: Record<string, number[]>;
  strategyCardsHeight: number;
};

export type UiSliceActions = {
  setShortcut: (id: ShortcutId, chord: ShortcutChord | null) => void;
  resetShortcuts: () => void;
  setRightOpen: (value: boolean) => void;
  setBottomOpen: (value: boolean) => void;
  setBottomTab: (tab: BottomTab) => void;
  toggleBottomTab: (tab: BottomTab) => void;
  setRightDock: (dock: DockId) => void;
  setRightWidth: (width: number) => void;
  setBottomHeight: (height: number) => void;
  setSearchOpen: (value: boolean) => void;
  setIndicatorMenuOpen: (value: boolean) => void;
  setLayoutMenuOpen: (value: boolean) => void;
  setSettingsOpen: (value: boolean) => void;
  setBrokerDialogOpen: (value: boolean) => void;
  setAccountSettingsOpen: (value: boolean) => void;
  setBuySellMenu: (menu: BuySellMenuState) => void;
  setTradingSettingsSymbol: (symbol: string | null) => void;
  setContextMenu: (menu: ContextMenuState) => void;
  closeMenus: () => void;
  setColumnWidths: (tableId: string, widths: number[]) => void;
  patchAppSettings: (patch: Partial<AppSettings>) => void;
  setAppSettings: (value: AppSettings) => void;
  setStrategyCardsHeight: (height: number) => void;
};

export type UiSlice = UiSliceState & UiSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

export function createUiSlice(set: RootSet, get: RootGet): UiSlice {
  return {
    shortcuts: { ...DEFAULT_SHORTCUTS },
    rightOpen: true,
    bottomOpen: false,
    bottomTab: "positions",
    rightDock: "strategy",
    rightWidth: 360,
    bottomHeight: 220,
    searchOpen: false,
    indicatorMenuOpen: false,
    layoutMenuOpen: false,
    settingsOpen: false,
    brokerDialogOpen: false,
    accountSettingsOpen: false,
    buySellMenu: null,
    tradingSettingsSymbol: null,
    contextMenu: null,
    appSettings: { ...DEFAULT_APP_SETTINGS },
    columnWidths: {},
    strategyCardsHeight: 320,

    setShortcut: (id, chord) =>
      set({ shortcuts: { ...get().shortcuts, [id]: chord } }),
    resetShortcuts: () => set({ shortcuts: { ...DEFAULT_SHORTCUTS } }),
    setRightOpen: (value) => set({ rightOpen: value }),
    setBottomOpen: (value) => set({ bottomOpen: value }),
    setBottomTab: (tab) => set({ bottomTab: tab, bottomOpen: true }),
    toggleBottomTab: (tab) => {
      const s = get();
      if (s.bottomOpen && s.bottomTab === tab) set({ bottomOpen: false });
      else set({ bottomTab: tab, bottomOpen: true });
    },
    setRightDock: (dock) =>
      set({
        rightDock: dock,
        rightOpen: true,
      }),
    setRightWidth: (width) => set({ rightWidth: width }),
    setBottomHeight: (height) => set({ bottomHeight: height }),
    setSearchOpen: (value) =>
      set({
        searchOpen: value,
        indicatorMenuOpen: false,
        layoutMenuOpen: false,
        ...(value ? { settingsOpen: false } : {}),
      }),
    setIndicatorMenuOpen: (value) =>
      set({
        indicatorMenuOpen: value,
        searchOpen: false,
        layoutMenuOpen: false,
        ...(value ? { settingsOpen: false } : {}),
      }),
    setLayoutMenuOpen: (value) =>
      set({
        layoutMenuOpen: value,
        searchOpen: false,
        indicatorMenuOpen: false,
        ...(value ? { settingsOpen: false } : {}),
      }),
    setSettingsOpen: (value) =>
      set({
        settingsOpen: value,
        contextMenu: null,
        ...(value
          ? {
              searchOpen: false,
              indicatorMenuOpen: false,
              layoutMenuOpen: false,
            }
          : {}),
      }),
    setBrokerDialogOpen: (value) =>
      set({ brokerDialogOpen: value, contextMenu: null }),
    setAccountSettingsOpen: (value) =>
      set({ accountSettingsOpen: value, contextMenu: null }),
    setBuySellMenu: (menu) =>
      set({ buySellMenu: menu, contextMenu: menu ? null : get().contextMenu }),
    setTradingSettingsSymbol: (symbol) =>
      set({ tradingSettingsSymbol: symbol, buySellMenu: null, contextMenu: null }),
    setContextMenu: (menu) =>
      set({ contextMenu: menu, buySellMenu: menu ? null : get().buySellMenu }),
    closeMenus: () =>
      set({
        searchOpen: false,
        indicatorMenuOpen: false,
        layoutMenuOpen: false,
        contextMenu: null,
        buySellMenu: null,
        accountSettingsOpen: false,
      }),
    setColumnWidths: (tableId, widths) =>
      set({
        columnWidths: { ...get().columnWidths, [tableId]: widths },
      }),
    patchAppSettings: (patch) => {
      const next = normalizeAppSettings({ ...get().appSettings, ...patch });
      applyAppTheme(next);
      set({ appSettings: next });
    },
    setAppSettings: (value) => {
      const next = normalizeAppSettings(value);
      applyAppTheme(next);
      set({ appSettings: next });
    },
    setStrategyCardsHeight: (height) => set({ strategyCardsHeight: height }),
  };
}

/**
 * Normalize persisted ui fields right after hydration (mutates in place).
 * bottomTab validation lives here and ONLY here.
 */
export function normalizeUiRehydrate(state: Store): void {
  state.appSettings = normalizeAppSettings(state.appSettings);
  applyAppTheme(state.appSettings);
  state.shortcuts = mergeShortcuts(state.shortcuts);
  if (
    (state.rightDock as string) === "watchlist" ||
    (state.rightDock as string) === "screener"
  ) {
    state.rightDock = "strategy";
  }
  if ((state.rightDock as string) === "news") {
    state.rightDock = "calendar";
  }
  state.buySellMenu = null;
  state.tradingSettingsSymbol = null;
  state.accountSettingsOpen = false;
  state.brokerDialogOpen = false;
  if (
    state.bottomTab !== "positions" &&
    state.bottomTab !== "orders" &&
    state.bottomTab !== "orderHistory" &&
    state.bottomTab !== "balanceHistory" &&
    state.bottomTab !== "journal"
  ) {
    state.bottomTab = "positions";
  }
}
