/**
 * vela-cell-wiring.ts — per-cell MAWS wiring for the VelaWorkspace host.
 *
 * One `wireCell(ws, cell)` per live cell performs on creation what ChartCanvas
 * did per pane: renderer config seeding + settings-dialog hosting, managed
 * study/native mirroring, crosshair + replay event forwarding, and viewport
 * mirroring (the workspace's own sync handles crosshair/viewport when on; this
 * wiring always keeps the MAWS store informed and the MAWS-only features fed).
 * Cell teardown is deferred to cell:destroyed (Vela destroys the chart).
 */
import type { VelaWorkspace } from "@/lib/charting/workspace";
import type { ChartPaneState } from "@/types";
import type { NativeRenderer } from "@/lib/charting";
import { useAppStore } from "@/lib/store";
import {
  syncVelaIndicators,
  removeManagedIndicators,
  isManagedHandle,
  studyIdForHandle,
  velaInputsToStudySettings,
} from "@/lib/vela-indicators";
import {
  applyThemeToCharts,
  mawsHostSections,
  mawsToVelaConfig,
  velaToMawsPatch,
} from "@/lib/vela-chart-settings";
import { applyVelaThemeEverywhere } from "@/lib/app-theme";
import { setLastCrosshair } from "@/lib/chart-registry";
import { wireTimelineMarks } from "@/lib/vela-marks-wiring";
import type { Vela } from "@/lib/charting";
import { fromVelaTicker } from "@/lib/vela-feed-adapter";
import { clearDrawingMapping, syncPaneDrawingsFromVela } from "@/lib/vela-drawings";

/** Theme-select callback used by the native renderer's optional `onThemeSelect` seam.
 * Pushes the resolved app theme into the zustand store (with advanced-colors
 * preserved) AND re-skins every live chart, so the Canvas → Theme row from the old
 * ChartCanvas still works when the workspace cell has mounted its SettingsDialog.
 */
function flashThemeToStore(name: string): void {
  const next = applyVelaThemeEverywhere(name as unknown as Parameters<typeof applyVelaThemeEverywhere>[0]);
  useAppStore.getState().setAppSettings({ ...next, advancedColors: useAppStore.getState().appSettings.advancedColors });
  applyThemeToCharts(name as unknown as Parameters<typeof applyThemeToCharts>[0]);
}

const TF_FROM_VELA: Record<string, ChartPaneState["timeframe"]> = {
  "1": "1m", "3": "3m", "5": "5m", "15": "15m", "30": "30m",
  "60": "1h", "120": "2h", "240": "4h",
  D: "1D", W: "1W", M: "1M",
  "1D": "1D", "1W": "1W", "1M": "1M",
  "1d": "1D", "1w": "1W", "1mo": "1M",
};

export function velaTfToMaws(tf: string): ChartPaneState["timeframe"] {
  return TF_FROM_VELA[tf] ?? TF_FROM_VELA[tf.toUpperCase()] ?? "1h";
}

/** Managed indicator events → writes → MAWS studies + natives mirror wiring. */
function wireIndicatorMirroring(chart: Vela, paneId: string): () => void {
  const persistNatives = () => {
    const natives = chart
      .indicators()
      .filter(
        (h) =>
          h.nativeType &&
          h.nativeType !== "volume" &&
          !isManagedHandle(chart, h.id),
      )
      .map((h) => ({
        type: h.nativeType!,
        inputs: { ...h.inputValues() } as Record<string, number | string | boolean>,
        hidden: !h.visible,
      }));
    useAppStore.getState().setPaneNatives(paneId, natives);
  };
  const onIndicatorRemoved = ({ id }: { id: string }) => {
    const studyId = studyIdForHandle(chart, id);
    if (studyId) useAppStore.getState().removeIndicator(studyId, paneId);
    persistNatives();
  };
  const onIndicatorInputs = ({ id }: { id: string }) => {
    const studyId = studyIdForHandle(chart, id);
    if (studyId) {
      const handle = chart.indicators().find((h) => h.id === id);
      const study = useAppStore
        .getState()
        .panes.find((p) => p.id === paneId)
        ?.studies.find((s) => s.id === studyId);
      if (handle && study) {
        const merged = {
          ...study.settings,
          ...velaInputsToStudySettings(
            study.type,
            handle.inputValues() as Record<string, unknown>,
          ),
        };
        if (JSON.stringify(merged) !== JSON.stringify(study.settings)) {
          useAppStore.getState().updateStudySettings(studyId, merged, paneId);
        }
      }
    }
    persistNatives();
  };
  const onIndicatorVisibility = ({ id, visible }: { id: string; visible: boolean }) => {
    const studyId = studyIdForHandle(chart, id);
    if (studyId && !useAppStore.getState().indicatorsHidden) {
      const study = useAppStore
        .getState()
        .panes.find((p) => p.id === paneId)
        ?.studies.find((s) => s.id === studyId);
      if (study && study.hidden === !visible) {
        useAppStore.getState().setIndicatorHidden(studyId, !visible, paneId);
      }
    }
    persistNatives();
  };
  const offs = [
    chart.on("indicator:added", persistNatives),
    chart.on("indicator:removed", onIndicatorRemoved),
    chart.on("indicator:inputs", onIndicatorInputs),
    chart.on("indicator:visibility", onIndicatorVisibility),
  ];
  return () => {
    for (const off of offs) off();
    removeManagedIndicators(chart);
  };
}

/** Crosshair events → the MAWS hover store (last price/time for menus + shortcuts).
 *  Crosshair and viewport SYNC are the workspace's own links (`ws.sync`, driven from
 *  the store's `layoutSync` by the host bridge) — a per-cell mirror here would move
 *  every chart regardless of the switches, which is exactly what it used to do. */
function wireCrosshairAndViewport(chart: Vela, paneId: string): () => void {
  const offCrosshair = chart.renderer.onCrosshairMove((e) => {
    if (e.price != null) {
      setLastCrosshair({ paneId, price: e.price, time: e.time ?? null });
    }
  });
  return () => {
    offCrosshair();
  };
}

/** Chart settings dialog: seed config + MAWS host sections + echo edits to the store.
 * Every seam on the native renderer is OPTIONAL — a workspace cell provides the
 * native RendererControl proxy, which forwards to the real renderer; a surface the
 * renderer doesn't expose is a no-op, not an error.
 */
function wireChartSettings(renderer: NativeRenderer): () => void {
  try {
    renderer.applyConfig(mawsToVelaConfig(useAppStore.getState().chartSettings));
    renderer.setSettingsSections(mawsHostSections());
    renderer.setSettingsVisibility({
      hidden: ["canvas.theme", "canvas.background.color", "canvas.background.text-color"],
    });
  } catch {
    /* renderer without the settings seam — chart still renders */
  }

  let offTheme: (() => void) | undefined;
  try {
    offTheme = renderer.onThemeSelect?.(flashThemeToStore);
  } catch {
    /* no seam */
  }

  let offConfig: (() => void) | undefined;
  try {
    offConfig = renderer.onConfigChanged?.(() => {
      try {
        const patch = velaToMawsPatch(renderer.getConfig(), useAppStore.getState().chartSettings);
        if (Object.keys(patch).length > 0) {
          useAppStore.getState().patchChartSettings(patch);
        }
      } catch {
        /* ignore */
      }
    });
  } catch {
    /* no seam */
  }

  return () => {
    offTheme?.();
    offConfig?.();
  };
}

/**\n * Wire ONE cell. Returns the cell-scoped disposer (runs on cell:destroyed).\n * Market events (symbol/timeframe edits inside Vela) mirror into the store via\n * the workspace's `onCellMarketChanged`-independent `chart.on('market:changed')`.\n */
export function wireCell(ws: VelaWorkspace, cellId: string): () => void {
  const cell = ws.cell(cellId);
  if (!cell) throw new Error(`wireCell: no live cell "${cellId}"`);
  const chart = cell.chart;
  const renderer = chart.renderer as unknown as NativeRenderer;
  const offs: Array<() => void> = [];

  // Studies + natives mount & mirror (studies read at creation + on change).
  void syncVelaIndicators(chart, studiesOf(cellId));
  offs.push(
    useAppStore.subscribe((state, prev) => {
      const now = state.panes.find((p) => p.id === cellId);
      const before = prev.panes.find((p) => p.id === cellId);
      if (now && before && now.studies !== before.studies) {
        void syncVelaIndicators(chart, now.studies);
      }
    }),
  );
  offs.push(wireIndicatorMirroring(chart, cellId));

  // "Hide indicators" toggle (chart right-click menu) → every handle's visibility.
  offs.push(
    useAppStore.subscribe((state, prev) => {
      if (state.indicatorsHidden !== prev.indicatorsHidden) {
        for (const handle of chart.indicators()) {
          try {
            handle.setVisible(!state.indicatorsHidden);
          } catch {
            /* already torn down */
          }
        }
      }
    }),
  );

  // Crosshair store + viewport mirroring.
  offs.push(wireCrosshairAndViewport(chart, cellId));

  // Drawing settle: the unified undo timeline (Ctrl+Z / Ctrl+Y, and the drawing
  // bar's arrows) restores a snapshot INSIDE the controller, which emits no
  // drawing events — the store would keep an undone drawing and re-create it on
  // the next mount. Every timeline change re-settles the slice onto Vela's live
  // set (`syncPaneDrawingsFromVela` is a no-op when nothing moved).
  offs.push(
    cell.history.onChange(() => {
      try {
        syncPaneDrawingsFromVela(cellId);
      } catch {
        /* cell mid-teardown */
      }
    }),
  );

  // Timeline marks: economic releases + headlines on the lane above the time axis.
  // The replay cursor is a cutoff — a mark dated after it belongs to the future the
  // replay has not reached, so it must not paint.
  const timelineMarks = wireTimelineMarks(chart, {
    paneId: cellId,
    symbol: () => cell.symbol,
    cutoff: () => {
      const state = ws.replay.state;
      return state.active && state.cursorTime != null ? state.cursorTime : null;
    },
  });
  offs.push(
    timelineMarks.dispose,
    ws.replay.on("replay:start", timelineMarks.refresh),
    ws.replay.on("replay:step", timelineMarks.refresh),
    ws.replay.on("replay:pause", timelineMarks.refresh),
    ws.replay.on("replay:end", timelineMarks.refresh),
  );

  // Chart settings host sections + store echo.
  offs.push(wireChartSettings(renderer));

  // Replay events → store (the workspace replay drives all cells; the store
  // mirrors the ACTIVE cell's cursor so overlays + the bar UI follow).
  offs.push(
    ws.replay.on("replay:start", (p) => syncReplayCursor(cellId, p.cursorTime, p.remaining)),
    ws.replay.on("replay:step", (p) => syncReplayCursor(cellId, p.cursorTime, p.remaining)),
    ws.replay.on("replay:play", () => patchReplayState({ playing: true })),
    ws.replay.on("replay:pause", () => patchReplayState({ playing: false })),
    ws.replay.on("replay:end", () => stopReplayFor(cellId)),
  );

  // Market switch INSIDE Vela (sync link, workspace symbol picker) → store.
  // One write per change; the store's own echo path ignores equal values.
  offs.push(
    chart.on("market:changed", ({ symbol, timeframe }) => {
      const st = useAppStore.getState();
      const pane = st.panes.find((p) => p.id === cellId);
      if (!pane) return;
      const mawsSymbol = fromVelaTicker(symbol);
      const mawsTf = velaTfToMaws(timeframe);
      if (pane.symbol !== mawsSymbol || pane.timeframe !== mawsTf) {
        if (pane.symbol !== mawsSymbol) st.setSymbol(mawsSymbol, cellId);
        if (pane.timeframe !== mawsTf) st.setTimeframe(mawsTf, cellId);
      }
    }),
  );

  return () => {
    for (const off of offs) off();
    clearDrawingMapping(cellId);
  };
}

function studiesOf(paneId: string): ChartPaneState["studies"] {
  return useAppStore.getState().panes.find((p) => p.id === paneId)?.studies ?? [];
}

const relayEchoRef = { current: false };

/** Never write the same replay slice twice — the same guard ChartCanvas used. */
function syncReplayCursor(paneId: string, cursorTime: number, remaining: number): void {
  const st = useAppStore.getState();
  if (st.replay?.paneId !== paneId) return;
  const r = st.replay;
  if (r.cursorTime !== cursorTime || r.remaining !== remaining) {
    relayEchoRef.current = true;
    st.patchReplay({ cursorTime, remaining, index: remaining, total: remaining + 1 });
  }
}

function patchReplayState(patch: { playing: boolean }): void {
  const st = useAppStore.getState();
  if (!st.replay) return;
  if (st.replay.playing !== patch.playing) {
    relayEchoRef.current = true;
    st.patchReplay(patch);
  }
}

function stopReplayFor(paneId: string): void {
  const st = useAppStore.getState();
  if (st.replay?.paneId === paneId) st.stopReplay();
}
