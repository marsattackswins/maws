import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MAWS_WORKSPACE_KEY } from "@/lib/maws/brand";
import { createUiSlice, normalizeUiRehydrate } from "@/lib/slices/ui-slice";
import type { UiSlice } from "@/lib/slices/ui-slice";
import { createWatchlistSlice, normalizeWatchlistRehydrate } from "@/lib/slices/watchlist-slice";
import type { WatchlistSlice } from "@/lib/slices/watchlist-slice";
import {
  createSymbolSettingsSlice,
  normalizeSymbolSettingsRehydrate,
} from "@/lib/slices/symbol-settings-slice";
import type { SymbolSettingsSlice } from "@/lib/slices/symbol-settings-slice";
import { createNewsSlice, normalizeNewsRehydrate } from "@/lib/slices/news-slice";
import type { NewsSlice } from "@/lib/slices/news-slice";
import { createChartSlice, normalizeChartRehydrate } from "@/lib/slices/chart-slice";
import type { ChartSlice } from "@/lib/slices/chart-slice";
import { createDrawingSlice, normalizeDrawingRehydrate } from "@/lib/slices/drawing-slice";
import type { DrawingSlice } from "@/lib/slices/drawing-slice";
import { createMarketDataSlice } from "@/lib/slices/market-data-slice";
import type { MarketDataSlice } from "@/lib/slices/market-data-slice";
import { createPaperTradingSlice, normalizePaperTradingRehydrate } from "@/lib/slices/paper-trading-slice";
import type { PaperTradingSlice } from "@/lib/slices/paper-trading-slice";
import { templateToStudies } from "@/lib/studies";
import type { ChartPaneState, IndicatorInstance, IndicatorTemplate } from "@/types";

/** True when pane studies no longer match the saved template snapshot. */
export function isIndicatorTemplateDirty(
  tpl: IndicatorTemplate,
  studies: IndicatorInstance[],
): boolean {
  const saved = templateToStudies(tpl);
  if (saved.length !== studies.length) return true;
  for (let i = 0; i < studies.length; i++) {
    const a = studies[i];
    const b = saved[i];
    if (!a || !b) return true;
    if (a.type !== b.type || Boolean(a.hidden) !== Boolean(b.hidden)) return true;
    if (JSON.stringify(a.settings) !== JSON.stringify(b.settings)) return true;
  }
  return false;
}

export type Store = UiSlice &
  WatchlistSlice &
  SymbolSettingsSlice &
  NewsSlice &
  ChartSlice &
  DrawingSlice &
  MarketDataSlice &
  PaperTradingSlice;

/** Exact persisted field set for maws.workspace.v6 — 51 keys, shape frozen by tests/persistence-compat.test.ts. */
export const workspacePartialize = (state: Store) => ({
  layoutCount: state.layoutCount,
  orientation: state.orientation,
  layoutTracks: state.layoutTracks,
  layoutSync: state.layoutSync,
  activePaneId: state.activePaneId,
  panes: state.panes,
  panesVelaState: Object.fromEntries(
    (state.panes ?? [])
      .filter((p) => p.velaState != null)
      .map((p) => [p.id, p.velaState]),
  ),
  watchlist: state.watchlist,
  watchlistGroups: state.watchlistGroups,
  drawingTool: state.drawingTool,
  stayInDrawingMode: state.stayInDrawingMode,
  magnet: state.magnet,
  drawingsHidden: state.drawingsHidden,
  indicatorsHidden: state.indicatorsHidden,
  shortcuts: state.shortcuts,
  rightOpen: state.rightOpen,
  bottomOpen: state.bottomOpen,
  bottomTab: state.bottomTab,
  rightDock: state.rightDock,
  rightDockOrder: state.rightDockOrder,
  rightWidth: state.rightWidth,
  calendarNewsSplit: state.calendarNewsSplit,
  bottomHeight: state.bottomHeight,
  range: state.range,
  watchlistCollapsed: state.watchlistCollapsed,
  watchlistGroupCollapsed: state.watchlistGroupCollapsed,
  detailsCollapsed: state.detailsCollapsed,
  newsCollapsed: state.newsCollapsed,
  performanceCollapsed: state.performanceCollapsed,
  technicalsCollapsed: state.technicalsCollapsed,
  chartSettings: state.chartSettings,
  appSettings: state.appSettings,
  indicatorSettings: state.indicatorSettings,
  alerts: state.alerts,
  orders: state.orders,
  positions: state.positions,
  orderHistory: state.orderHistory,
  balanceHistory: state.balanceHistory,
  journal: state.journal,
  watchlistHeight: state.watchlistHeight,
  strategyCardsHeight: state.strategyCardsHeight,
  autoScaleByPane: state.autoScaleByPane,
  paneStretchFactors: state.paneStretchFactors,
  columnWidths: state.columnWidths,
  chartTemplates: state.chartTemplates,
  indicatorTemplates: state.indicatorTemplates,
  activeIndicatorTemplateId: state.activeIndicatorTemplateId,
  // Live attachment is confirmed by the server and must never survive a
  // reload as an unverified browser claim.
  connectedBroker: state.connectedBroker === "mock" ? "mock" : null,
  mockBalance: state.mockBalance,
  mockRealized: state.mockRealized,
  paperAccount: state.paperAccount,
  symbolTrading: state.symbolTrading,
});

function createAppStore() {
  return create<Store>()(persist(
    (set, get) => ({
      ...createUiSlice(set, get),
      ...createWatchlistSlice(set, get),
      ...createSymbolSettingsSlice(set, get),
      ...createNewsSlice(set, get),
      ...createChartSlice(set, get),
      ...createDrawingSlice(set, get),
      ...createMarketDataSlice(set, get),
      ...createPaperTradingSlice(set, get),
    }),
    {
      name: MAWS_WORKSPACE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        const pending = new Map<string, string>();
        let timer: number | undefined;
        return {
          getItem: (name) => window.localStorage.getItem(name),
          setItem: (name, value) => {
            pending.set(name, value);
            if (timer != null) return;
            timer = window.setTimeout(() => {
              timer = undefined;
              for (const [k, v] of pending) {
                try {
                  window.localStorage.setItem(k, v);
                } catch {
                  /* quota */
                }
              }
              pending.clear();
            }, 400);
          },
          removeItem: (name) => {
            pending.delete(name);
            window.localStorage.removeItem(name);
          },
        };
      }),
      partialize: workspacePartialize,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        normalizeDrawingRehydrate(state);
        normalizeChartRehydrate(state);
        normalizeUiRehydrate(state);
        normalizeSymbolSettingsRehydrate(state);
        normalizeWatchlistRehydrate(state);
        normalizeNewsRehydrate(state);
        normalizePaperTradingRehydrate(state);
      },
    },
  ));
}

type AppStore = ReturnType<typeof createAppStore>;

/**
 * One store per PAGE, not per module evaluation.
 *
 * `next dev` re-evaluates a module when it (or something it imports) changes. A fresh
 * `create()` then handed the new module copy an EMPTY store, while already-mounted
 * consumers kept the instance they captured — the Vela workspace host, which
 * subscribes once in a `[]` effect and pushes pane symbol/timeframe edits into the
 * cells, went on watching the OLD store. The shell (watchlist selection, timeframe
 * buttons) moved; the candles did not. Reusing the instance across evaluations keeps
 * one source of truth; in production the module is evaluated once, so this is a no-op.
 */
const storeHost = globalThis as typeof globalThis & { __mawsAppStore?: AppStore };
// `development` only: a production build evaluates modules once, and tests rely on
// `jest.isolateModules` handing them a FRESH store per case.
const shareAcrossEvaluations = process.env.NODE_ENV === "development";
const previousStore = shareAcrossEvaluations ? storeHost.__mawsAppStore : undefined;

export const useAppStore: AppStore =
  previousStore ?? createAppStore();
if (shareAcrossEvaluations) {
  if (previousStore) {
    const refreshedWatchlistActions = createWatchlistSlice(
      (partial) => useAppStore.setState(partial),
      () => useAppStore.getState(),
    );
    useAppStore.setState({
      toggleWatchlistCollapsed: refreshedWatchlistActions.toggleWatchlistCollapsed,
      toggleWatchlistGroup: refreshedWatchlistActions.toggleWatchlistGroup,
      renameWatchlist: refreshedWatchlistActions.renameWatchlist,
      createWatchlist: refreshedWatchlistActions.createWatchlist,
      activateWatchlist: refreshedWatchlistActions.activateWatchlist,
      deleteWatchlist: refreshedWatchlistActions.deleteWatchlist,
      addToWatchlist: refreshedWatchlistActions.addToWatchlist,
      removeFromWatchlist: refreshedWatchlistActions.removeFromWatchlist,
      moveWatchlistSymbol: refreshedWatchlistActions.moveWatchlistSymbol,
      reorderWatchlist: refreshedWatchlistActions.reorderWatchlist,
      setWatchlistOrder: refreshedWatchlistActions.setWatchlistOrder,
      setWatchlistHeight: refreshedWatchlistActions.setWatchlistHeight,
    });
  }
  storeHost.__mawsAppStore = useAppStore;
}

export function useActivePane(): ChartPaneState {
  return useAppStore((s) => {
    return s.panes.find((p) => p.id === s.activePaneId) ?? s.panes[0];
  });
}
