import { DEFAULT_SYMBOLS } from "@/lib/maws/universe";
import { layoutKey } from "@/lib/layouts";
import {
  createStudy,
  defaultStudies,
  ensurePaneStudies,
  studiesSignature,
  studiesTypeFlags,
  templateToStudies,
  cloneStudySettings,
  normalizeStudySettings,
} from "@/lib/studies";
import { isValidDrawing } from "@/lib/drawings";
import { cloneVisibility } from "@/lib/visibility";
import { uid } from "@/lib/trade-marks";
import { normalizeTimezone } from "@/lib/timezone";
import {
  DEFAULT_CHART_SETTINGS,
  DEFAULT_INDICATOR_SETTINGS,
  DEFAULT_LAYOUT_SYNC,
  normalizeBbSettings,
  normalizeEmaSettings,
  normalizeObSettings,
  normalizePmoSettings,
  normalizeStochSettings,
  normalizeVolumeSettings,
  normalizeVwapSettings,
} from "@/types";
import type {
  ChartPaneState,
  ChartSettings,
  ChartTemplate,
  IndicatorId,
  IndicatorInstance,
  IndicatorSettingsMap,
  IndicatorTemplate,
  LayoutCount,
  LayoutSync,
  PriceAlert,
  ReplayState,
  Timeframe,
  WorkspaceState,
} from "@/types";
import type { Store } from "@/lib/store";

export type ChartRange =
  | "1D"
  | "5D"
  | "1M"
  | "3M"
  | "6M"
  | "YTD"
  | "1Y"
  | "5Y"
  | "All";

export type ChartSliceState = WorkspaceState & {
  layoutSync: LayoutSync;
  range: ChartRange;
  indicatorSettingsId: string | null;
  indicatorSettings: IndicatorSettingsMap;
  chartSettings: ChartSettings;
  alerts: PriceAlert[];
  maximizedPaneId: string | null;
  /** Per-pane price auto-scale (A button). Persisted across refresh. */
  autoScaleByPane: Record<string, boolean>;
  /**
   * Relative heights of the main price pane + each study pane (LWC stretch factors).
   * Survives symbol/timeframe chart rebuilds.
   */
  paneStretchFactors: Record<
    string,
    { main: number; byStudyId: Record<string, number> }
  >;
  replay: ReplayState;
  clipboardPrice: number | null;
  vertCursorLocked: boolean;
  lockedCursorTime: number | null;
  chartTemplates: ChartTemplate[];
  indicatorTemplates: IndicatorTemplate[];
  /** Last applied / matching indicator template for the active pane setup. */
  activeIndicatorTemplateId: string | null;
};

export type ChartSliceActions = {
  setLayout: (count: LayoutCount) => void;
  toggleOrientation: () => void;
  setLayoutTracks: (key: string, tracks: { cols: number[]; rows: number[] }) => void;
  setActivePane: (id: string) => void;
  setSymbol: (symbol: string, paneId?: string) => void;
  setTimeframe: (timeframe: Timeframe, paneId?: string) => void;
  /** Always adds a new study instance of this type. */
  addIndicator: (type: IndicatorId, paneId?: string) => void;
  /** Removes one study by instance id. */
  removeIndicator: (instanceId: string, paneId?: string) => void;
  /** Clears every study on the pane. */
  clearIndicators: (paneId?: string) => void;
  setIndicatorHidden: (instanceId: string, hidden: boolean, paneId?: string) => void;
  updateStudySettings: (
    instanceId: string,
    settings: IndicatorSettingsMap[IndicatorId],
    paneId?: string,
  ) => void;
  setRange: (range: ChartRange) => void;
  setIndicatorSettingsOpen: (instanceId: string | null) => void;
  setIndicatorSettings: (value: IndicatorSettingsMap) => void;
  patchIndicatorSettings: <K extends IndicatorId>(
    id: K,
    patch: Partial<IndicatorSettingsMap[K]>,
  ) => void;
  patchChartSettings: (patch: Partial<ChartSettings>) => void;
  addAlert: (alert: Omit<PriceAlert, "id">) => void;
  updateAlert: (id: string, patch: Partial<PriceAlert>) => void;
  toggleAlert: (id: string) => void;
  removeAlert: (id: string) => void;
  setMaximizedPane: (id: string | null) => void;
  setPaneAutoScale: (paneId: string, on: boolean) => void;
  setPaneStretchFactors: (
    paneId: string,
    value: { main: number; byStudyId: Record<string, number> },
  ) => void;
  startReplay: (paneId: string, index: number, total: number) => void;
  stopReplay: () => void;
  patchReplay: (patch: Partial<NonNullable<ReplayState>>) => void;
  setClipboardPrice: (price: number | null) => void;
  setVertCursorLocked: (value: boolean) => void;
  setLockedCursorTime: (time: number | null) => void;
  saveChartTemplate: (name: string) => void;
  applyChartTemplate: (id: string) => void;
  saveIndicatorTemplate: (name: string) => void;
  applyIndicatorTemplate: (id: string) => void;
  toggleIndicatorTemplateFavorite: (id: string) => void;
  removeIndicatorTemplate: (id: string) => void;
  patchLayoutSync: (patch: Partial<LayoutSync>) => void;
};

export type ChartSlice = ChartSliceState & ChartSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

/**
 * Keep the last applied/saved/matched template sticky when studies diverge,
 * so the toolbar can keep showing its name + a Save action.
 * Only fall back to signature matching when there is no preferred id.
 */
function resolveActiveTemplateId(
  templates: IndicatorTemplate[],
  studies: IndicatorInstance[],
  preferredId: string | null,
): string | null {
  if (preferredId && templates.some((t) => t.id === preferredId)) {
    return preferredId;
  }
  const sig = studiesSignature(studies);
  return (
    templates.find((t) => studiesSignature(templateToStudies(t)) === sig)?.id ?? null
  );
}

/**
 * Pin the template that matches studies *before* an edit, then keep it sticky
 * after the edit (even though it no longer matches).
 */
function pinTemplateThroughEdit(
  templates: IndicatorTemplate[],
  studiesBefore: IndicatorInstance[],
  preferredId: string | null,
): string | null {
  return resolveActiveTemplateId(templates, studiesBefore, preferredId);
}

function createPane(index: number): ChartPaneState {
  return {
    id: `pane-${index}`,
    symbol: DEFAULT_SYMBOLS[index % DEFAULT_SYMBOLS.length],
    timeframe: "1D",
    studies: defaultStudies(),
    drawings: [],
  };
}

const defaultPanes = Array.from({ length: 12 }, (_, i) => createPane(i));

export function createChartSlice(set: RootSet, get: RootGet): ChartSlice {
  return {
    layoutCount: 1,
    orientation: "h",
    layoutTracks: {},
    layoutSync: { ...DEFAULT_LAYOUT_SYNC },
    activePaneId: "pane-0",
    panes: defaultPanes,
    range: "All",
    indicatorSettingsId: null,
    indicatorSettings: { ...DEFAULT_INDICATOR_SETTINGS },
    chartSettings: DEFAULT_CHART_SETTINGS,
    alerts: [],
    maximizedPaneId: null,
    autoScaleByPane: {},
    paneStretchFactors: {},
    replay: null,
    clipboardPrice: null,
    vertCursorLocked: false,
    lockedCursorTime: null,
    chartTemplates: [
      {
        id: "hollow",
        name: "Hollow candles",
        settings: { ...DEFAULT_CHART_SETTINGS, candleStyle: "hollow" },
      },
      {
        id: "solid",
        name: "Solid candles",
        settings: { ...DEFAULT_CHART_SETTINGS, candleStyle: "solid" },
      },
      {
        id: "line",
        name: "Line",
        settings: { ...DEFAULT_CHART_SETTINGS, candleStyle: "line", grid: false },
      },
    ],
    indicatorTemplates: [],
    activeIndicatorTemplateId: null,

    setLayout: (count) => {
      const state = get();
      if (state.layoutCount === count) {
        // Re-selecting the active layout resets resized pane tracks to defaults.
        const key = layoutKey(count, state.orientation);
        if (!(key in state.layoutTracks)) return;
        const next = { ...state.layoutTracks };
        delete next[key];
        set({ layoutTracks: next });
        return;
      }
      set({ layoutCount: count });
    },
    toggleOrientation: () =>
      set({ orientation: get().orientation === "h" ? "v" : "h" }),
    setLayoutTracks: (key, tracks) =>
      set({
        layoutTracks: { ...get().layoutTracks, [key]: tracks },
      }),
    setActivePane: (id) => {
      const pane = get().panes.find((p) => p.id === id);
      set({
        activePaneId: id,
        // Rematch from this pane's studies only — don't carry a sticky template
        // from another chart (e.g. MAWS on an empty multi-layout pane).
        activeIndicatorTemplateId: pane
          ? resolveActiveTemplateId(get().indicatorTemplates, pane.studies, null)
          : null,
      });
    },
    setSymbol: (symbol, paneId) => {
      const state = get();
      const id = paneId ?? state.activePaneId;
      const syncAll = state.layoutSync.symbol;
      const visible = new Set(
        state.panes.slice(0, state.layoutCount).map((p) => p.id),
      );
      const touched = state.panes
        .filter((p) => (syncAll && visible.has(p.id)) || p.id === id)
        .map((p) => p.id);
      const autoScaleByPane = { ...state.autoScaleByPane };
      for (const pid of touched) autoScaleByPane[pid] = true;
      set({
        panes: state.panes.map((p) =>
          (syncAll && visible.has(p.id)) || p.id === id ? { ...p, symbol } : p,
        ),
        autoScaleByPane,
        searchOpen: false,
      });
    },
    setTimeframe: (timeframe, paneId) => {
      const state = get();
      const id = paneId ?? state.activePaneId;
      const syncAll = state.layoutSync.interval;
      const visible = new Set(
        state.panes.slice(0, state.layoutCount).map((p) => p.id),
      );
      const touched = state.panes
        .filter((p) => (syncAll && visible.has(p.id)) || p.id === id)
        .map((p) => p.id);
      const autoScaleByPane = { ...state.autoScaleByPane };
      for (const pid of touched) autoScaleByPane[pid] = true;
      set({
        panes: state.panes.map((p) =>
          (syncAll && visible.has(p.id)) || p.id === id ? { ...p, timeframe } : p,
        ),
        autoScaleByPane,
      });
    },
    addIndicator: (type, paneId) => {
      const id = paneId ?? get().activePaneId;
      const defaults = get().indicatorSettings;
      const study = createStudy(type, defaults[type]);
      const before = get().panes.find((p) => p.id === id);
      const pinned = before
        ? pinTemplateThroughEdit(
            get().indicatorTemplates,
            before.studies,
            get().activeIndicatorTemplateId,
          )
        : get().activeIndicatorTemplateId;
      const panes = get().panes.map((p) =>
        p.id === id ? { ...p, studies: [...p.studies, study] } : p,
      );
      set({
        panes,
        activeIndicatorTemplateId: pinned,
      });
    },
    removeIndicator: (instanceId, paneId) => {
      const id = paneId ?? get().activePaneId;
      const before = get().panes.find((p) => p.id === id);
      const pinned = before
        ? pinTemplateThroughEdit(
            get().indicatorTemplates,
            before.studies,
            get().activeIndicatorTemplateId,
          )
        : get().activeIndicatorTemplateId;
      const panes = get().panes.map((p) =>
        p.id === id
          ? { ...p, studies: p.studies.filter((s) => s.id !== instanceId) }
          : p,
      );
      const openId = get().indicatorSettingsId;
      set({
        panes,
        indicatorSettingsId: openId === instanceId ? null : openId,
        activeIndicatorTemplateId: pinned,
      });
    },
    clearIndicators: (paneId) => {
      const id = paneId ?? get().activePaneId;
      const before = get().panes.find((p) => p.id === id);
      const pinned = before
        ? pinTemplateThroughEdit(
            get().indicatorTemplates,
            before.studies,
            get().activeIndicatorTemplateId,
          )
        : get().activeIndicatorTemplateId;
      const panes = get().panes.map((p) => (p.id === id ? { ...p, studies: [] } : p));
      set({
        panes,
        indicatorSettingsId: null,
        activeIndicatorTemplateId: pinned,
      });
    },
    setIndicatorHidden: (instanceId, hidden, paneId) => {
      const id = paneId ?? get().activePaneId;
      const before = get().panes.find((p) => p.id === id);
      const pinned = before
        ? pinTemplateThroughEdit(
            get().indicatorTemplates,
            before.studies,
            get().activeIndicatorTemplateId,
          )
        : get().activeIndicatorTemplateId;
      set({
        activeIndicatorTemplateId: pinned,
        panes: get().panes.map((p) =>
          p.id === id
            ? {
                ...p,
                studies: p.studies.map((s) =>
                  s.id === instanceId ? { ...s, hidden } : s,
                ),
              }
            : p,
        ),
      });
    },
    updateStudySettings: (instanceId, settings, paneId) => {
      const panes = get().panes;
      let id = paneId ?? get().activePaneId;
      const onPane = panes.find((p) => p.id === id);
      if (!onPane?.studies.some((s) => s.id === instanceId)) {
        id =
          panes.find((p) => p.studies.some((s) => s.id === instanceId))?.id ?? id;
      }
      const before = panes.find((p) => p.id === id);
      const pinned = before
        ? pinTemplateThroughEdit(
            get().indicatorTemplates,
            before.studies,
            get().activeIndicatorTemplateId,
          )
        : get().activeIndicatorTemplateId;
      set({
        activeIndicatorTemplateId: pinned,
        panes: panes.map((p) => {
          if (p.id !== id) return p;
          return {
            ...p,
            studies: p.studies.map((s) => {
              if (s.id !== instanceId) return s;
              return {
                ...s,
                settings: normalizeStudySettings(s.type, settings as never),
              };
            }),
          };
        }),
      });
    },
    setRange: (range) => set({ range }),
    setIndicatorSettingsOpen: (id) =>
      set({ indicatorSettingsId: id, settingsOpen: false, drawingSettingsTarget: null, contextMenu: null }),
    setIndicatorSettings: (value) =>
      set({
        indicatorSettings: {
          volume: normalizeVolumeSettings(value.volume),
          vwap: normalizeVwapSettings(value.vwap),
          ema: normalizeEmaSettings({
            ...DEFAULT_INDICATOR_SETTINGS.ema,
            ...value.ema,
            visibility: cloneVisibility(
              value.ema?.visibility ?? DEFAULT_INDICATOR_SETTINGS.ema.visibility,
            ),
          }),
          bb: normalizeBbSettings(value.bb),
          rsi: {
            ...DEFAULT_INDICATOR_SETTINGS.rsi,
            ...value.rsi,
            visibility: cloneVisibility(value.rsi?.visibility),
          },
          stoch: normalizeStochSettings({
            ...DEFAULT_INDICATOR_SETTINGS.stoch,
            ...value.stoch,
            visibility: cloneVisibility(
              value.stoch?.visibility ?? DEFAULT_INDICATOR_SETTINGS.stoch.visibility,
            ),
          }),
          atr: {
            ...DEFAULT_INDICATOR_SETTINGS.atr,
            ...value.atr,
            visibility: cloneVisibility(value.atr?.visibility),
          },
          adx: {
            ...DEFAULT_INDICATOR_SETTINGS.adx,
            ...value.adx,
            visibility: cloneVisibility(value.adx?.visibility),
          },
          pmo: normalizePmoSettings(value.pmo),
          ob: normalizeObSettings(value.ob),
        },
      }),
    patchIndicatorSettings: (id, patch) => {
      const prev = get().indicatorSettings[id];
      const base = DEFAULT_INDICATOR_SETTINGS[id];
      const next = { ...base, ...prev, ...patch } as IndicatorSettingsMap[typeof id];
      if (id === "volume") {
        set({
          indicatorSettings: {
            ...get().indicatorSettings,
            volume: normalizeVolumeSettings(next as IndicatorSettingsMap["volume"]),
          },
        });
        return;
      }
      if (id === "vwap") {
        set({
          indicatorSettings: {
            ...get().indicatorSettings,
            vwap: normalizeVwapSettings(next as IndicatorSettingsMap["vwap"]),
          },
        });
        return;
      }
      if (id === "ema") {
        const ema = normalizeEmaSettings(next as IndicatorSettingsMap["ema"]);
        set({
          indicatorSettings: {
            ...get().indicatorSettings,
            ema,
          },
        });
        return;
      }
      if (id === "bb") {
        set({
          indicatorSettings: {
            ...get().indicatorSettings,
            bb: normalizeBbSettings(next as IndicatorSettingsMap["bb"]),
          },
        });
        return;
      }
      if (id === "stoch") {
        const stoch = normalizeStochSettings(next as IndicatorSettingsMap["stoch"]);
        set({
          indicatorSettings: {
            ...get().indicatorSettings,
            stoch,
          },
        });
        return;
      }
      if (id === "ob") {
        const ob = normalizeObSettings(next as IndicatorSettingsMap["ob"]);
        set({
          indicatorSettings: {
            ...get().indicatorSettings,
            ob,
          },
        });
        return;
      }
      set({
        indicatorSettings: {
          ...get().indicatorSettings,
          [id]: next,
        },
      });
    },
    patchChartSettings: (patch) =>
      set({ chartSettings: { ...DEFAULT_CHART_SETTINGS, ...get().chartSettings, ...patch } }),
    addAlert: (alert) =>
      set({
        alerts: [...get().alerts, { ...alert, id: uid() }],
      }),
    updateAlert: (id, patch) =>
      set({
        alerts: get().alerts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      }),
    toggleAlert: (id) =>
      set({
        alerts: get().alerts.map((a) =>
          a.id === id ? { ...a, enabled: !a.enabled } : a,
        ),
      }),
    removeAlert: (id) =>
      set({ alerts: get().alerts.filter((a) => a.id !== id) }),
    setMaximizedPane: (id) => set({ maximizedPaneId: id }),
    setPaneAutoScale: (paneId, on) =>
      set({
        autoScaleByPane: { ...get().autoScaleByPane, [paneId]: on },
      }),
    setPaneStretchFactors: (paneId, value) =>
      set({
        paneStretchFactors: { ...get().paneStretchFactors, [paneId]: value },
      }),
    startReplay: (paneId, index, total) =>
      set({
        replay: {
          paneId,
          index: Math.max(1, Math.min(index, total - 1)),
          total,
          playing: false,
          speed: 1,
        },
      }),
    stopReplay: () => set({ replay: null }),
    patchReplay: (patch) => {
      const cur = get().replay;
      if (!cur) return;
      set({ replay: { ...cur, ...patch } });
    },
    setClipboardPrice: (price) => set({ clipboardPrice: price }),
    setVertCursorLocked: (value) =>
      set({ vertCursorLocked: value, lockedCursorTime: value ? get().lockedCursorTime : null }),
    setLockedCursorTime: (time) => set({ lockedCursorTime: time }),
    saveChartTemplate: (name) =>
      set({
        chartTemplates: [
          ...get().chartTemplates,
          {
            id: Math.random().toString(36).slice(2, 8),
            name,
            settings: { ...get().chartSettings },
          },
        ],
      }),
    applyChartTemplate: (id) => {
      const tpl = get().chartTemplates.find((t) => t.id === id);
      if (tpl) set({ chartSettings: { ...DEFAULT_CHART_SETTINGS, ...tpl.settings } });
    },
    saveIndicatorTemplate: (name) => {
      const pane =
        get().panes.find((p) => p.id === get().activePaneId) ?? get().panes[0];
      if (!pane) return;
      const trimmed = name.trim();
      if (!trimmed) return;
      const now = Date.now();
      const snapshot = pane.studies.map((s) => ({
        type: s.type,
        settings: cloneStudySettings(s.type, s.settings as never),
        hidden: Boolean(s.hidden),
      }));
      const existing = get().indicatorTemplates.find(
        (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (existing) {
        set({
          activeIndicatorTemplateId: existing.id,
          indicatorTemplates: get().indicatorTemplates.map((t) =>
            t.id === existing.id
              ? {
                  ...t,
                  name: trimmed,
                  studies: snapshot,
                  indicators: studiesTypeFlags(pane.studies),
                  lastUsedAt: now,
                }
              : t,
          ),
        });
        return;
      }
      const id = Math.random().toString(36).slice(2, 8);
      set({
        activeIndicatorTemplateId: id,
        indicatorTemplates: [
          {
            id,
            name: trimmed,
            studies: snapshot,
            indicators: studiesTypeFlags(pane.studies),
            lastUsedAt: now,
          },
          ...get().indicatorTemplates,
        ],
      });
    },
    applyIndicatorTemplate: (id) => {
      const tpl = get().indicatorTemplates.find((t) => t.id === id);
      if (!tpl) return;
      const paneId = get().activePaneId;
      const defaults = get().indicatorSettings;
      set({
        activeIndicatorTemplateId: id,
        panes: get().panes.map((p) =>
          p.id === paneId
            ? {
                ...p,
                studies: templateToStudies(tpl, defaults),
              }
            : p,
        ),
        indicatorTemplates: get().indicatorTemplates.map((t) =>
          t.id === id ? { ...t, lastUsedAt: Date.now() } : t,
        ),
      });
    },
    toggleIndicatorTemplateFavorite: (id) =>
      set({
        indicatorTemplates: get().indicatorTemplates.map((t) =>
          t.id === id ? { ...t, favorite: !t.favorite } : t,
        ),
      }),
    removeIndicatorTemplate: (id) =>
      set({
        activeIndicatorTemplateId:
          get().activeIndicatorTemplateId === id ? null : get().activeIndicatorTemplateId,
        indicatorTemplates: get().indicatorTemplates.filter((t) => t.id !== id),
      }),
    patchLayoutSync: (patch) => {
      const state = get();
      const layoutSync = { ...state.layoutSync, ...patch };
      let panes = state.panes;
      if (patch.symbol === true || patch.interval === true) {
        const active = panes.find((p) => p.id === state.activePaneId) ?? panes[0];
        const visible = new Set(panes.slice(0, state.layoutCount).map((p) => p.id));
        if (active) {
          panes = panes.map((p) => {
            if (!visible.has(p.id)) return p;
            return {
              ...p,
              symbol: patch.symbol === true ? active.symbol : p.symbol,
              timeframe: patch.interval === true ? active.timeframe : p.timeframe,
            };
          });
        }
      }
      set({ layoutSync, panes });
    },
  };
}

/** Chart-owned rehydration normalizations for persisted workspace state. */
export function normalizeChartRehydrate(state: Store): void {
  state.chartSettings = {
    ...DEFAULT_CHART_SETTINGS,
    ...state.chartSettings,
    timezone: normalizeTimezone(state.chartSettings?.timezone),
  };
  // Prefer the current default scale label size over the prior 14px default.
  if (state.chartSettings.scaleFontSize === 14) {
    state.chartSettings.scaleFontSize = 12;
  }
  state.layoutSync = { ...DEFAULT_LAYOUT_SYNC, ...state.layoutSync };
  state.layoutTracks = state.layoutTracks ?? {};
  state.autoScaleByPane = state.autoScaleByPane ?? {};
  state.paneStretchFactors = state.paneStretchFactors ?? {};
  const rename = (sym: string) => (sym === "MATICUSDT" ? "POLUSDT" : sym);
  state.panes = (state.panes ?? [])
    .map((p) => ({ ...p, symbol: rename(p.symbol) }))
    .map((p) => (/^EURUSD$/i.test(p.symbol) ? { ...p, symbol: "BTCUSDT" } : p));
  state.indicatorSettings = {
    volume: normalizeVolumeSettings(state.indicatorSettings?.volume),
    vwap: normalizeVwapSettings(state.indicatorSettings?.vwap),
    ema: normalizeEmaSettings(state.indicatorSettings?.ema),
    bb: normalizeBbSettings(state.indicatorSettings?.bb),
    rsi: {
      ...DEFAULT_INDICATOR_SETTINGS.rsi,
      ...state.indicatorSettings?.rsi,
      visibility: cloneVisibility(state.indicatorSettings?.rsi?.visibility),
    },
    stoch: normalizeStochSettings(state.indicatorSettings?.stoch),
    atr: {
      ...DEFAULT_INDICATOR_SETTINGS.atr,
      ...state.indicatorSettings?.atr,
      visibility: cloneVisibility(state.indicatorSettings?.atr?.visibility),
    },
    adx: {
      ...DEFAULT_INDICATOR_SETTINGS.adx,
      ...state.indicatorSettings?.adx,
      visibility: cloneVisibility(state.indicatorSettings?.adx?.visibility),
    },
    pmo: normalizePmoSettings(state.indicatorSettings?.pmo),
    ob: normalizeObSettings(state.indicatorSettings?.ob),
  };
  state.indicatorSettingsId = null;
  const seededIds = new Set(["vol-based", "momentum", "swing"]);
  state.indicatorTemplates = (state.indicatorTemplates ?? []).filter(
    (t) => !seededIds.has(t.id),
  );
  state.panes = state.panes.map((p) => {
    const studies = ensurePaneStudies(p, state.indicatorSettings);
    return {
      ...p,
      studies,
      indicators: undefined,
      hiddenIndicators: undefined,
      drawings: p.drawings.filter(isValidDrawing).map((d) => ({
        ...d,
        visibility: cloneVisibility(d.visibility),
        lineWidth: d.lineWidth ?? 2,
        lineStyle: d.lineStyle ?? "solid",
        extend: d.extend ?? "none",
      })),
    };
  });
  state.indicatorTemplates = (state.indicatorTemplates ?? []).map((t) => ({
    ...t,
    studies: templateToStudies(t, state.indicatorSettings).map((s) => ({
      type: s.type,
      settings: s.settings,
      hidden: s.hidden,
    })),
  }));
  const pane =
    state.panes.find((p) => p.id === state.activePaneId) ?? state.panes[0];
  if (pane) {
    state.activeIndicatorTemplateId = resolveActiveTemplateId(
      state.indicatorTemplates,
      pane.studies,
      null,
    );
  }
}
