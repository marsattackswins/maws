import {
  applyAppTheme,
  DEFAULT_APP_SETTINGS,
  migrateLegacyAppSettings,
  migrateMutedPanelColor,
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

/** The right-rail entries, in their default order (drag to rearrange). */
export const RIGHT_DOCK_IDS: DockId[] = [
  "strategy",
  "calendar",
  "objects",
  "scripts",
  "alerts",
];

/**
 * Sanitize a persisted/contributed dock order: unknown ids are dropped, duplicates
 * collapse, and any entry missing from the list is appended in its canonical place.
 * A rail must never lose a button because a document was written by another build.
 */
export function normalizeDockOrder(raw: unknown): DockId[] {
  const candidates = Array.isArray(raw) ? raw : [];
  const seen = new Set<DockId>();
  const order: DockId[] = [];
  for (const value of candidates) {
    const id = RIGHT_DOCK_IDS.find((known) => known === value);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    order.push(id);
  }
  for (const id of RIGHT_DOCK_IDS) {
    if (!seen.has(id)) order.push(id);
  }
  return order;
}

/**
 * Live drag-reorder step for the rail — the array twin of the drawing toolbar's
 * `insertBefore(dragged, target)` / `insertBefore(dragged, target.nextSibling)`:
 * drop `dragId` immediately before or after `targetId`. Unknown ids return the
 * input untouched, so a stale/idless target can never scramble the rail.
 */
export function moveDockId(
  ids: readonly DockId[],
  dragId: DockId,
  targetId: DockId,
  after: boolean,
): DockId[] {
  if (dragId === targetId) return [...ids];
  const next = ids.filter((id) => id !== dragId);
  const at = next.indexOf(targetId);
  if (at < 0) return [...ids];
  next.splice(after ? at + 1 : at, 0, dragId);
  return next;
}

/** One-slot move for the keyboard path (Alt+Up/Down); out-of-range is a no-op. */
export function shiftDockId(ids: readonly DockId[], id: DockId, delta: number): DockId[] {
  const next = [...ids];
  const from = next.indexOf(id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= next.length) return next;
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return next;
  next.splice(to, 0, moved);
  return next;
}

/** Do two rail orders describe the same arrangement? */
export function sameDockOrder(a: readonly DockId[], b: readonly DockId[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

export type UiSliceState = {
  shortcuts: ShortcutMap;
  rightOpen: boolean;
  bottomOpen: boolean;
  bottomTab: BottomTab;
  rightDock: DockId;
  /** Drag-rearranged order of the right rail (persisted). */
  rightDockOrder: DockId[];
  rightWidth: number;
  bottomHeight: number;
  searchOpen: boolean;
  indicatorMenuOpen: boolean;
  layoutMenuOpen: boolean;
  settingsOpen: boolean;
  brokerDialogOpen: boolean;
  accountSettingsOpen: boolean;
  buySellMenu: BuySellMenuState;
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
  setBottomTabCollapsed: (tab: BottomTab) => void;
  toggleBottomTab: (tab: BottomTab) => void;
  setRightDock: (dock: DockId) => void;
  setRightDockOrder: (order: DockId[]) => void;
  setRightWidth: (width: number) => void;
  setBottomHeight: (height: number) => void;
  setSearchOpen: (value: boolean) => void;
  setIndicatorMenuOpen: (value: boolean) => void;
  setLayoutMenuOpen: (value: boolean) => void;
  setSettingsOpen: (value: boolean) => void;
  setBrokerDialogOpen: (value: boolean) => void;
  setAccountSettingsOpen: (value: boolean) => void;
  setBuySellMenu: (menu: BuySellMenuState) => void;
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
    rightDockOrder: [...RIGHT_DOCK_IDS],
    rightWidth: 360,
    bottomHeight: 220,
    searchOpen: false,
    indicatorMenuOpen: false,
    layoutMenuOpen: false,
    settingsOpen: false,
    brokerDialogOpen: false,
    accountSettingsOpen: false,
    buySellMenu: null,
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
    setBottomTabCollapsed: (tab) => set({ bottomTab: tab, bottomOpen: false }),
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
    setRightDockOrder: (order) => set({ rightDockOrder: normalizeDockOrder(order) }),
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
  state.appSettings = migrateMutedPanelColor(
    migrateLegacyAppSettings(normalizeAppSettings(state.appSettings)),
  );
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
  state.rightDockOrder = normalizeDockOrder(state.rightDockOrder);
  state.buySellMenu = null;
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
