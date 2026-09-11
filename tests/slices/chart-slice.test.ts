import { describe, it, expect, beforeEach } from "@jest/globals";
import { useAppStore, workspacePartialize } from "@/lib/store";
import type { Store } from "@/lib/store";
import {
  createChartSlice,
  normalizeChartRehydrate,
  type ChartSlice,
} from "@/lib/slices/chart-slice";
import { DEFAULT_SYMBOLS } from "@/lib/maws/universe";
import {
  DEFAULT_CHART_SETTINGS,
  DEFAULT_INDICATOR_SETTINGS,
  DEFAULT_LAYOUT_SYNC,
  DEFAULT_PAPER_ACCOUNT,
} from "@/types";
import type { ChartPaneState } from "@/types";

/**
 * Phase E regression tests for the chart-slice extraction:
 *   - every documented chart default survives the move into createChartSlice;
 *   - each moved action keeps its intended state update (verified against the
 *     real composed root store);
 *   - reset/default restoration: patchChartSettings merges over defaults and
 *     applyChartTemplate restores a saved settings snapshot;
 *   - normalizeChartRehydrate keeps every legacy compatibility rule
 *     (chartSettings merge, timezone + scaleFontSize normalization, layout
 *     guards, MATIC→POL / EURUSD renames, indicator-settings normalization,
 *     seeded-template filtering, drawing normalization, template rematch);
 *   - persistence compat: workspacePartialize still reads every persisted
 *     chart field from the composed store (49-key schema itself is pinned by
 *     tests/persistence-compat.test.ts);
 *   - cross-slice defaultLeverage contract: patchSymbolTrading's fallback
 *     still reads chartSettings.defaultLeverage (read-only) and
 *     resetPaperAccount (root-owned, untouched) still writes it;
 *   - atomicity: counting-set harness proves setSymbol / setIndicatorSettingsOpen
 *     / applyChartTemplate perform exactly ONE set() with narrow patches.
 */

const CHART_FIELDS = [
  "layoutCount",
  "orientation",
  "layoutTracks",
  "layoutSync",
  "activePaneId",
  "panes",
  "range",
  "indicatorSettingsId",
  "indicatorSettings",
  "chartSettings",
  "alerts",
  "maximizedPaneId",
  "autoScaleByPane",
  "paneStretchFactors",
  "replay",
  "clipboardPrice",
  "vertCursorLocked",
  "lockedCursorTime",
  "chartTemplates",
  "indicatorTemplates",
  "activeIndicatorTemplateId",
] as const;

const CROSS_FIELDS = [
  "searchOpen",
  "settingsOpen",
  "drawingSettingsTarget",
  "contextMenu",
] as const;

function snapshot(): Record<string, unknown> {
  const s = useAppStore.getState() as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of [...CHART_FIELDS, ...CROSS_FIELDS]) out[k] = s[k];
  return JSON.parse(JSON.stringify(out));
}

const pristine = snapshot();

function resetChart(): void {
  useAppStore.setState(JSON.parse(JSON.stringify(pristine)) as Partial<Store>);
}

beforeEach(resetChart);

describe("chart-slice defaults (real root store)", () => {
  it("carries every documented chart default", () => {
    const s = useAppStore.getState();
    expect(s.layoutCount).toBe(1);
    expect(s.orientation).toBe("h");
    expect(s.layoutTracks).toEqual({});
    expect(s.layoutSync).toEqual(DEFAULT_LAYOUT_SYNC);
    expect(s.activePaneId).toBe("pane-0");
    expect(s.panes).toHaveLength(12);
    s.panes.forEach((p, i) => {
      expect(p.id).toBe(`pane-${i}`);
      expect(p.symbol).toBe(DEFAULT_SYMBOLS[i % DEFAULT_SYMBOLS.length]);
      expect(p.timeframe).toBe("1D");
      expect(p.studies.map((st) => st.type)).toEqual(["volume", "vwap"]);
      expect(p.drawings).toEqual([]);
    });
    expect(s.range).toBe("All");
    expect(s.indicatorSettingsId).toBeNull();
    expect(s.indicatorSettings).toEqual(DEFAULT_INDICATOR_SETTINGS);
    expect(s.chartSettings).toEqual(DEFAULT_CHART_SETTINGS);
    expect(s.chartSettings.defaultLeverage).toBe(10);
    expect(s.alerts).toEqual([]);
    expect(s.maximizedPaneId).toBeNull();
    expect(s.autoScaleByPane).toEqual({});
    expect(s.paneStretchFactors).toEqual({});
    expect(s.replay).toBeNull();
    expect(s.clipboardPrice).toBeNull();
    expect(s.vertCursorLocked).toBe(false);
    expect(s.lockedCursorTime).toBeNull();
    expect(s.chartTemplates.map((t) => t.id)).toEqual(["hollow", "solid", "line"]);
    expect(s.chartTemplates[0]?.settings.candleStyle).toBe("hollow");
    expect(s.chartTemplates[2]?.settings.grid).toBe(false);
    expect(s.indicatorTemplates).toEqual([]);
    expect(s.activeIndicatorTemplateId).toBeNull();
  });
});

describe("chart-slice actions (real root store)", () => {
  it("setLayout switches count; re-selecting resets saved tracks", () => {
    const s = useAppStore.getState();
    s.setLayout(4);
    expect(useAppStore.getState().layoutCount).toBe(4);
    s.setLayoutTracks("4-h", { cols: [1, 1], rows: [1, 1] });
    expect(useAppStore.getState().layoutTracks["4-h"]).toEqual({
      cols: [1, 1],
      rows: [1, 1],
    });
    // Re-selecting the active layout drops the resized tracks for that key.
    s.setLayout(4);
    expect(useAppStore.getState().layoutTracks["4-h"]).toBeUndefined();
    expect(useAppStore.getState().layoutCount).toBe(4);
  });

  it("toggleOrientation flips h <-> v", () => {
    const s = useAppStore.getState();
    s.toggleOrientation();
    expect(useAppStore.getState().orientation).toBe("v");
    s.toggleOrientation();
    expect(useAppStore.getState().orientation).toBe("h");
  });

  it("setSymbol updates the pane, forces autoscale, clears searchOpen", () => {
    const s = useAppStore.getState();
    s.setSearchOpen(true);
    expect(useAppStore.getState().searchOpen).toBe(true);
    s.setSymbol("SOLUSDT");
    const now = useAppStore.getState();
    expect(now.panes[0]?.symbol).toBe("SOLUSDT");
    expect(now.panes[1]?.symbol).toBe(DEFAULT_SYMBOLS[1]);
    expect(now.autoScaleByPane["pane-0"]).toBe(true);
    expect(now.searchOpen).toBe(false);
  });

  it("setSymbol syncs all visible panes when layoutSync.symbol is on", () => {
    const s = useAppStore.getState();
    s.setLayout(2);
    s.patchLayoutSync({ symbol: true });
    s.setSymbol("ETHUSDT");
    const now = useAppStore.getState();
    expect(now.panes[0]?.symbol).toBe("ETHUSDT");
    expect(now.panes[1]?.symbol).toBe("ETHUSDT");
    expect(now.panes[2]?.symbol).toBe(DEFAULT_SYMBOLS[2]);
    expect(now.autoScaleByPane["pane-0"]).toBe(true);
    expect(now.autoScaleByPane["pane-1"]).toBe(true);
  });

  it("setTimeframe updates the pane and forces autoscale", () => {
    const s = useAppStore.getState();
    s.setTimeframe("4h", "pane-1");
    const now = useAppStore.getState();
    expect(now.panes[1]?.timeframe).toBe("4h");
    expect(now.panes[0]?.timeframe).toBe("1D");
    expect(now.autoScaleByPane["pane-1"]).toBe(true);
  });

  it("setTimeframe syncs visible panes when layoutSync.interval is on", () => {
    const s = useAppStore.getState();
    s.setLayout(2);
    s.patchLayoutSync({ interval: true });
    s.setTimeframe("15m");
    const now = useAppStore.getState();
    expect(now.panes[0]?.timeframe).toBe("15m");
    expect(now.panes[1]?.timeframe).toBe("15m");
    expect(now.panes[2]?.timeframe).toBe("1D");
  });

  it("addIndicator always appends an instance; removeIndicator removes one", () => {
    const s = useAppStore.getState();
    s.addIndicator("ema");
    let pane = useAppStore.getState().panes[0] as ChartPaneState;
    expect(pane.studies.map((st) => st.type)).toEqual(["volume", "vwap", "ema"]);
    s.addIndicator("ema");
    pane = useAppStore.getState().panes[0] as ChartPaneState;
    expect(pane.studies.filter((st) => st.type === "ema")).toHaveLength(2);
    const emaId = pane.studies[2]?.id as string;
    s.removeIndicator(emaId);
    pane = useAppStore.getState().panes[0] as ChartPaneState;
    expect(pane.studies.filter((st) => st.type === "ema")).toHaveLength(1);
  });

  it("removeIndicator closes the settings editor when it targets the open study", () => {
    const s = useAppStore.getState();
    const studyId = useAppStore.getState().panes[0]?.studies[0]?.id as string;
    s.setIndicatorSettingsOpen(studyId);
    expect(useAppStore.getState().indicatorSettingsId).toBe(studyId);
    s.removeIndicator(studyId);
    expect(useAppStore.getState().indicatorSettingsId).toBeNull();
  });

  it("clearIndicators empties the pane and closes the settings editor", () => {
    const s = useAppStore.getState();
    const studyId = useAppStore.getState().panes[0]?.studies[0]?.id as string;
    s.setIndicatorSettingsOpen(studyId);
    s.clearIndicators();
    const now = useAppStore.getState();
    expect(now.panes[0]?.studies).toEqual([]);
    expect(now.indicatorSettingsId).toBeNull();
  });

  it("setIndicatorHidden toggles a single study instance", () => {
    const s = useAppStore.getState();
    const studyId = useAppStore.getState().panes[0]?.studies[0]?.id as string;
    s.setIndicatorHidden(studyId, true);
    expect(useAppStore.getState().panes[0]?.studies[0]?.hidden).toBe(true);
    s.setIndicatorHidden(studyId, false);
    expect(useAppStore.getState().panes[0]?.studies[0]?.hidden).toBe(false);
  });

  it("updateStudySettings patches the instance, even on a non-active pane", () => {
    const s = useAppStore.getState();
    // Cross-pane: instance lives on pane-1 while pane-0 is active.
    const target = useAppStore.getState().panes[1]?.studies[0];
    const id = target?.id as string;
    const next = { ...DEFAULT_INDICATOR_SETTINGS.volume, maLength: 99 };
    s.updateStudySettings(id, next);
    const pane1 = useAppStore.getState().panes[1] as ChartPaneState;
    expect(pane1.studies[0]?.settings).toEqual(next);
    // Active pane untouched.
    const pane0 = useAppStore.getState().panes[0] as ChartPaneState;
    expect(pane0.studies[0]?.id).not.toBe(id);
  });

  it("setRange stores the selected range", () => {
    useAppStore.getState().setRange("1M");
    expect(useAppStore.getState().range).toBe("1M");
  });

  it("setIndicatorSettingsOpen clears settingsOpen, drawingSettingsTarget, contextMenu", () => {
    const s = useAppStore.getState();
    // Order matters: setDrawingSettingsTarget and setSettingsOpen both clear
    // contextMenu, so open the context menu last.
    s.setDrawingSettingsTarget({ paneId: "pane-0", drawingId: "d1" });
    s.setSettingsOpen(true);
    s.setContextMenu({ x: 1, y: 2, paneId: "pane-0", price: 5, time: null });
    expect(useAppStore.getState().settingsOpen).toBe(true);
    expect(useAppStore.getState().drawingSettingsTarget).not.toBeNull();
    expect(useAppStore.getState().contextMenu).not.toBeNull();
    s.setIndicatorSettingsOpen("study-x");
    const now = useAppStore.getState();
    expect(now.indicatorSettingsId).toBe("study-x");
    expect(now.settingsOpen).toBe(false);
    expect(now.drawingSettingsTarget).toBeNull();
    expect(now.contextMenu).toBeNull();
  });

  it("patchIndicatorSettings merges over defaults and keeps visibility", () => {
    const s = useAppStore.getState();
    s.patchIndicatorSettings("rsi", { period: 21 });
    const rsi = useAppStore.getState().indicatorSettings.rsi;
    expect(rsi.period).toBe(21);
    expect(rsi.visibility).toEqual(DEFAULT_INDICATOR_SETTINGS.rsi.visibility);
    s.patchIndicatorSettings("volume", { maLength: 42 });
    const vol = useAppStore.getState().indicatorSettings.volume;
    expect(vol.maLength).toBe(42);
    expect(vol.plotStyle).toBe(DEFAULT_INDICATOR_SETTINGS.volume.plotStyle);
    s.patchIndicatorSettings("vwap", { offset: 2 });
    expect(useAppStore.getState().indicatorSettings.vwap.offset).toBe(2);
    s.patchIndicatorSettings("ema", { period: 55 });
    expect(useAppStore.getState().indicatorSettings.ema.period).toBe(55);
    s.patchIndicatorSettings("bb", { period: 25 });
    expect(useAppStore.getState().indicatorSettings.bb.period).toBe(25);
    s.patchIndicatorSettings("stoch", { length: 17 });
    expect(useAppStore.getState().indicatorSettings.stoch.length).toBe(17);
  });

  it("setIndicatorSettings normalizes the full map", () => {
    const s = useAppStore.getState();
    s.setIndicatorSettings({
      ...DEFAULT_INDICATOR_SETTINGS,
      rsi: { ...DEFAULT_INDICATOR_SETTINGS.rsi, period: 33 },
    });
    const now = useAppStore.getState();
    expect(now.indicatorSettings.rsi.period).toBe(33);
    expect(now.indicatorSettings.volume).toEqual(DEFAULT_INDICATOR_SETTINGS.volume);
  });

  it("patchChartSettings merges over defaults without dropping siblings", () => {
    const s = useAppStore.getState();
    s.patchChartSettings({ showLogo: false, timezone: "UTC" });
    const now = useAppStore.getState();
    expect(now.chartSettings.showLogo).toBe(false);
    expect(now.chartSettings.timezone).toBe("UTC");
    expect(now.chartSettings.candleStyle).toBe(DEFAULT_CHART_SETTINGS.candleStyle);
    expect(now.chartSettings.defaultLeverage).toBe(
      DEFAULT_CHART_SETTINGS.defaultLeverage,
    );
  });

  it("alerts: add / update / toggle / remove", () => {
    const s = useAppStore.getState();
    s.addAlert({ symbol: "BTCUSDT", price: 100, side: "above", enabled: true });
    let alerts = useAppStore.getState().alerts;
    expect(alerts).toHaveLength(1);
    const id = alerts[0]?.id as string;
    expect(id).toBeTruthy();
    s.updateAlert(id, { price: 150 });
    alerts = useAppStore.getState().alerts;
    expect(alerts[0]?.price).toBe(150);
    s.toggleAlert(id);
    expect(useAppStore.getState().alerts[0]?.enabled).toBe(false);
    s.removeAlert(id);
    expect(useAppStore.getState().alerts).toEqual([]);
  });

  it("maximize / autoscale / stretch setters", () => {
    const s = useAppStore.getState();
    s.setMaximizedPane("pane-3");
    expect(useAppStore.getState().maximizedPaneId).toBe("pane-3");
    s.setMaximizedPane(null);
    expect(useAppStore.getState().maximizedPaneId).toBeNull();
    s.setPaneAutoScale("pane-0", false);
    expect(useAppStore.getState().autoScaleByPane["pane-0"]).toBe(false);
    s.setPaneStretchFactors("pane-0", { main: 2, byStudyId: { s1: 1 } });
    expect(useAppStore.getState().paneStretchFactors["pane-0"]).toEqual({
      main: 2,
      byStudyId: { s1: 1 },
    });
  });

  it("replay: start clamps the index, patch merges, stop clears", () => {
    const s = useAppStore.getState();
    s.startReplay("pane-0", 0, 100);
    expect(useAppStore.getState().replay).toEqual({
      paneId: "pane-0",
      index: 1,
      total: 100,
      playing: false,
      speed: 1,
    });
    s.startReplay("pane-0", 500, 100);
    expect(useAppStore.getState().replay?.index).toBe(99);
    s.patchReplay({ playing: true, index: 50 });
    expect(useAppStore.getState().replay).toEqual({
      paneId: "pane-0",
      index: 50,
      total: 100,
      playing: true,
      speed: 1,
    });
    s.stopReplay();
    expect(useAppStore.getState().replay).toBeNull();
  });

  it("clipboard price and vertical cursor lock", () => {
    const s = useAppStore.getState();
    s.setClipboardPrice(123.45);
    expect(useAppStore.getState().clipboardPrice).toBe(123.45);
    s.setLockedCursorTime(1700000000000);
    s.setVertCursorLocked(true);
    expect(useAppStore.getState().vertCursorLocked).toBe(true);
    expect(useAppStore.getState().lockedCursorTime).toBe(1700000000000);
    s.setVertCursorLocked(false);
    expect(useAppStore.getState().vertCursorLocked).toBe(false);
    expect(useAppStore.getState().lockedCursorTime).toBeNull();
  });

  it("saveChartTemplate snapshots the current chart settings", () => {
    const s = useAppStore.getState();
    s.patchChartSettings({ grid: false, candleStyle: "hollow" });
    s.saveChartTemplate("My tpl");
    const tpls = useAppStore.getState().chartTemplates;
    expect(tpls).toHaveLength(4);
    const saved = tpls[3];
    expect(saved?.name).toBe("My tpl");
    expect(saved?.id).toBeTruthy();
    expect(saved?.settings.grid).toBe(false);
    expect(saved?.settings.candleStyle).toBe("hollow");
  });

  it("applyChartTemplate restores the saved settings over defaults", () => {
    const s = useAppStore.getState();
    s.patchChartSettings({ grid: false, scaleFontSize: 16, candleStyle: "line" });
    s.applyChartTemplate("hollow");
    expect(useAppStore.getState().chartSettings).toEqual({
      ...DEFAULT_CHART_SETTINGS,
      candleStyle: "hollow",
    });
    // Unknown template id is a no-op.
    s.applyChartTemplate("does-not-exist");
    expect(useAppStore.getState().chartSettings.candleStyle).toBe("hollow");
  });

  it("indicator templates: save (new + upsert), apply, favorite, remove", () => {
    const s = useAppStore.getState();
    // Blank names are rejected.
    s.saveIndicatorTemplate("   ");
    expect(useAppStore.getState().indicatorTemplates).toEqual([]);

    s.saveIndicatorTemplate("My Setup");
    let tpls = useAppStore.getState().indicatorTemplates;
    expect(tpls).toHaveLength(1);
    const id = tpls[0]?.id as string;
    expect(useAppStore.getState().activeIndicatorTemplateId).toBe(id);
    expect(tpls[0]?.name).toBe("My Setup");
    expect(tpls[0]?.studies?.map((st) => st.type)).toEqual(["volume", "vwap"]);
    expect(tpls[0]?.indicators?.volume).toBe(true);
    expect(tpls[0]?.indicators?.vwap).toBe(true);

    // Apply restores the snapshot onto the (cleared) active pane.
    s.clearIndicators();
    expect(useAppStore.getState().panes[0]?.studies).toEqual([]);
    s.applyIndicatorTemplate(id);
    let now = useAppStore.getState();
    expect(now.panes[0]?.studies.map((st) => st.type)).toEqual(["volume", "vwap"]);
    expect(now.activeIndicatorTemplateId).toBe(id);
    const lastUsedAfterApply =
      useAppStore.getState().indicatorTemplates[0]?.lastUsedAt as number;

    // Case-insensitive upsert keeps a single entry and refreshes the snapshot.
    s.saveIndicatorTemplate("my setup");
    tpls = useAppStore.getState().indicatorTemplates;
    expect(tpls).toHaveLength(1);
    expect(tpls[0]?.id).toBe(id);
    expect(tpls[0]?.name).toBe("my setup");
    expect(tpls[0]?.studies?.map((st) => st.type)).toEqual(["volume", "vwap"]);
    expect(tpls[0]?.lastUsedAt).toBeGreaterThanOrEqual(lastUsedAfterApply);

    // Unknown id is a no-op.
    const studiesBefore = now.panes[0]?.studies;
    s.applyIndicatorTemplate("nope");
    expect(useAppStore.getState().panes[0]?.studies).toEqual(studiesBefore);

    s.toggleIndicatorTemplateFavorite(id);
    expect(useAppStore.getState().indicatorTemplates[0]?.favorite).toBe(true);
    s.toggleIndicatorTemplateFavorite(id);
    expect(useAppStore.getState().indicatorTemplates[0]?.favorite).toBe(false);

    s.removeIndicatorTemplate(id);
    now = useAppStore.getState();
    expect(now.indicatorTemplates).toEqual([]);
    expect(now.activeIndicatorTemplateId).toBeNull();
  });

  it("setActivePane re-matches the active template from that pane's studies", () => {
    const s = useAppStore.getState();
    s.saveIndicatorTemplate("Defaults");
    const tplId = useAppStore.getState().indicatorTemplates[0]?.id as string;
    // pane-1 has the same default studies signature → rematch succeeds.
    s.setActivePane("pane-1");
    expect(useAppStore.getState().activePaneId).toBe("pane-1");
    expect(useAppStore.getState().activeIndicatorTemplateId).toBe(tplId);
    // A pane whose studies no longer match falls back to null.
    s.setActivePane("pane-2");
    s.addIndicator("ema", "pane-2");
    s.setActivePane("pane-0");
    s.setActivePane("pane-2");
    expect(useAppStore.getState().activeIndicatorTemplateId).toBeNull();
  });

  it("patchLayoutSync(true) propagates the active pane to visible panes", () => {
    const s = useAppStore.getState();
    s.setLayout(2);
    s.setSymbol("ETHUSDT", "pane-0");
    s.setTimeframe("4h", "pane-0");
    expect(useAppStore.getState().panes[1]?.symbol).toBe(DEFAULT_SYMBOLS[1]);
    s.patchLayoutSync({ symbol: true, interval: true });
    const now = useAppStore.getState();
    expect(now.layoutSync.symbol).toBe(true);
    expect(now.layoutSync.interval).toBe(true);
    expect(now.panes[1]?.symbol).toBe("ETHUSDT");
    expect(now.panes[1]?.timeframe).toBe("4h");
    // Non-visible panes stay untouched.
    expect(now.panes[2]?.symbol).toBe(DEFAULT_SYMBOLS[2]);
  });

  it("patchSymbolTrading fallback reads chartSettings.defaultLeverage (read-only)", () => {
    const s = useAppStore.getState();
    s.patchChartSettings({ defaultLeverage: 25 });
    s.patchSymbolTrading("NEWUSDT", {});
    const now = useAppStore.getState();
    expect(now.symbolTrading["NEWUSDT"]?.leverage).toBe(25);
    // The fallback is read-only: chartSettings must not be mutated.
    expect(now.chartSettings.defaultLeverage).toBe(25);
  });

  it("resetPaperAccount (root-owned) still writes chartSettings.defaultLeverage", () => {
    const s = useAppStore.getState();
    s.patchChartSettings({ defaultLeverage: 99, grid: false });
    s.resetPaperAccount();
    const now = useAppStore.getState();
    expect(now.chartSettings.defaultLeverage).toBe(
      DEFAULT_PAPER_ACCOUNT.leverage.crypto,
    );
    // Only defaultLeverage is touched — the rest of chartSettings survives.
    expect(now.chartSettings.grid).toBe(false);
  });
});

describe("chart-slice persistence compat", () => {
  it("workspacePartialize still reads every persisted chart field", () => {
    const s = useAppStore.getState();
    s.patchChartSettings({ grid: false });
    s.setPaneAutoScale("pane-0", false);
    s.setPaneStretchFactors("pane-1", { main: 3, byStudyId: {} });
    const part = workspacePartialize(useAppStore.getState());
    expect(part.layoutCount).toBe(1);
    expect(part.orientation).toBe("h");
    expect(part.layoutTracks).toEqual({});
    expect(part.layoutSync).toEqual(DEFAULT_LAYOUT_SYNC);
    expect(part.activePaneId).toBe("pane-0");
    expect(part.panes).toHaveLength(12);
    expect(part.chartSettings).toEqual({
      ...DEFAULT_CHART_SETTINGS,
      grid: false,
    });
    expect(part.indicatorSettings).toEqual(DEFAULT_INDICATOR_SETTINGS);
    expect(part.autoScaleByPane).toEqual({ "pane-0": false });
    expect(part.paneStretchFactors).toEqual({ "pane-1": { main: 3, byStudyId: {} } });
    expect(part.chartTemplates.map((t: { id: string }) => t.id)).toEqual([
      "hollow",
      "solid",
      "line",
    ]);
    expect(part.indicatorTemplates).toEqual([]);
    expect(part.activeIndicatorTemplateId).toBeNull();
    // The persisted shape must stay JSON-serializable.
    expect(() => JSON.stringify(part)).not.toThrow();
  });
});

describe("normalizeChartRehydrate (legacy compat)", () => {
  const fakeState = (patch: Record<string, unknown>): Store =>
    ({ ...patch }) as unknown as Store;

  it("merges partial chartSettings over defaults and normalizes timezone", () => {
    const st = fakeState({
      chartSettings: { grid: false, timezone: "junk", scaleFontSize: 14 },
    });
    normalizeChartRehydrate(st);
    expect(st.chartSettings.grid).toBe(false);
    expect(st.chartSettings.candleStyle).toBe(DEFAULT_CHART_SETTINGS.candleStyle);
    expect(st.chartSettings.timezone).toBe("Africa/Casablanca");
    // The prior 14px scale label default is migrated to the current 12px.
    expect(st.chartSettings.scaleFontSize).toBe(12);
  });

  it("keeps valid timezones and non-14 scale font sizes", () => {
    const st = fakeState({
      chartSettings: { timezone: "UTC+8", scaleFontSize: 16 },
    });
    normalizeChartRehydrate(st);
    expect(st.chartSettings.timezone).toBe("Asia/Hong_Kong");
    expect(st.chartSettings.scaleFontSize).toBe(16);
  });

  it("guards layoutSync / layoutTracks / autoScaleByPane / paneStretchFactors", () => {
    const st = fakeState({ layoutSync: { symbol: true }, panes: [] });
    normalizeChartRehydrate(st);
    expect(st.layoutSync).toEqual({ ...DEFAULT_LAYOUT_SYNC, symbol: true });
    expect(st.layoutTracks).toEqual({});
    expect(st.autoScaleByPane).toEqual({});
    expect(st.paneStretchFactors).toEqual({});
  });

  it("renames legacy pane symbols (MATIC→POL, EURUSD→BTCUSDT)", () => {
    const st = fakeState({
      panes: [
        { id: "pane-0", symbol: "MATICUSDT", timeframe: "1D", studies: [], drawings: [] },
        { id: "pane-1", symbol: "eurusd", timeframe: "1D", studies: [], drawings: [] },
        { id: "pane-2", symbol: "ETHUSDT", timeframe: "1D", studies: [], drawings: [] },
      ],
    });
    normalizeChartRehydrate(st);
    expect(st.panes.map((p) => p.symbol)).toEqual(["POLUSDT", "BTCUSDT", "ETHUSDT"]);
  });

  it("normalizes indicatorSettings and clears indicatorSettingsId", () => {
    const st = fakeState({
      panes: [],
      indicatorSettingsId: "study-1",
      indicatorSettings: { rsi: { period: 21 } },
    });
    normalizeChartRehydrate(st);
    expect(st.indicatorSettingsId).toBeNull();
    expect(st.indicatorSettings.rsi.period).toBe(21);
    expect(st.indicatorSettings.rsi.visibility).toEqual(
      DEFAULT_INDICATOR_SETTINGS.rsi.visibility,
    );
    expect(st.indicatorSettings.volume).toEqual(DEFAULT_INDICATOR_SETTINGS.volume);
  });

  it("filters seeded indicator templates but keeps user templates", () => {
    const st = fakeState({
      panes: [],
      indicatorTemplates: [
        { id: "vol-based", name: "Vol", studies: [], lastUsedAt: 1 },
        { id: "momentum", name: "Mom", studies: [], lastUsedAt: 2 },
        { id: "swing", name: "Swing", studies: [], lastUsedAt: 3 },
        { id: "mine", name: "Mine", studies: [], lastUsedAt: 4 },
      ],
    });
    normalizeChartRehydrate(st);
    expect(st.indicatorTemplates.map((t) => t.id)).toEqual(["mine"]);
  });

  it("normalizes pane drawings: drops invalid ones, fills defaults", () => {
    const st = fakeState({
      panes: [
        {
          id: "pane-0",
          symbol: "BTCUSDT",
          timeframe: "1D",
          studies: [],
          drawings: [
            { id: "d1", tool: "trend", points: [{ time: 1, price: 2 }] },
            { id: "d2", tool: "not-a-tool", points: [{ time: 1, price: 2 }] },
            { id: "d3", tool: "trend", points: [] },
          ],
        },
      ],
    });
    normalizeChartRehydrate(st);
    const drawings = st.panes[0]?.drawings ?? [];
    expect(drawings).toHaveLength(1);
    expect(drawings[0]?.id).toBe("d1");
    expect(drawings[0]?.lineWidth).toBe(2);
    expect(drawings[0]?.lineStyle).toBe("solid");
    expect(drawings[0]?.extend).toBe("none");
  });

  it("re-normalizes template studies and resolves the active template", () => {
    const studies = [
      { id: "s1", type: "volume" as const, hidden: false, settings: { maLength: 20 } },
    ];
    const st = fakeState({
      activePaneId: "pane-0",
      panes: [
        { id: "pane-0", symbol: "BTCUSDT", timeframe: "1D", studies, drawings: [] },
      ],
      indicatorTemplates: [
        {
          id: "t1",
          name: "Vol only",
          studies: [{ type: "volume", settings: { maLength: 20 }, hidden: false }],
          lastUsedAt: 1,
        },
        { id: "t2", name: "Other", studies: [], lastUsedAt: 2 },
      ],
    });
    normalizeChartRehydrate(st);
    // Template studies are rebuilt through templateToStudies (normalized).
    expect(st.indicatorTemplates[0]?.studies?.[0]?.type).toBe("volume");
    expect(st.indicatorTemplates[0]?.studies?.[0]?.settings).toEqual({
      ...DEFAULT_INDICATOR_SETTINGS.volume,
      maLength: 20,
    });
    // Signature match against pane studies pins the active template.
    expect(st.activeIndicatorTemplateId).toBe("t1");
  });
});

describe("chart-slice atomicity (counting set harness)", () => {
  interface Harness {
    calls: Array<Partial<Store>>;
    state: Store;
    slice: ChartSlice;
  }

  const twoPanes = (): ChartPaneState[] => [
    { id: "pane-0", symbol: "BTCUSDT", timeframe: "1D", studies: [], drawings: [] },
    { id: "pane-1", symbol: "ETHUSDT", timeframe: "1D", studies: [], drawings: [] },
  ];

  function makeHarness(initial: Record<string, unknown>): Harness {
    const calls: Array<Partial<Store>> = [];
    const state = { ...initial } as unknown as Store;
    const set = (
      partial: Partial<Store> | ((s: Store) => Partial<Store>),
    ): void => {
      const patch = typeof partial === "function" ? partial(state) : partial;
      calls.push(patch);
      Object.assign(state as unknown as Record<string, unknown>, patch);
    };
    const get = (): Store => state;
    return { calls, state, slice: createChartSlice(set, get) };
  }

  it("setSymbol performs exactly one set(): panes + autoScaleByPane + searchOpen", () => {
    const h = makeHarness({
      panes: twoPanes(),
      layoutCount: 1,
      layoutSync: { ...DEFAULT_LAYOUT_SYNC },
      autoScaleByPane: {},
      activePaneId: "pane-0",
      searchOpen: true,
    });
    h.slice.setSymbol("SOLUSDT");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(
      ["autoScaleByPane", "panes", "searchOpen"].sort(),
    );
    expect(h.calls[0]?.searchOpen).toBe(false);
    expect(h.state.autoScaleByPane["pane-0"]).toBe(true);
    expect(h.state.panes[0]?.symbol).toBe("SOLUSDT");
  });

  it("setTimeframe performs exactly one set(): panes + autoScaleByPane", () => {
    const h = makeHarness({
      panes: twoPanes(),
      layoutCount: 1,
      layoutSync: { ...DEFAULT_LAYOUT_SYNC },
      autoScaleByPane: {},
      activePaneId: "pane-0",
    });
    h.slice.setTimeframe("4h");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(
      ["autoScaleByPane", "panes"].sort(),
    );
  });

  it("setIndicatorSettingsOpen performs exactly one set() with all four keys", () => {
    const h = makeHarness({});
    h.slice.setIndicatorSettingsOpen("study-9");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(
      ["contextMenu", "drawingSettingsTarget", "indicatorSettingsId", "settingsOpen"].sort(),
    );
    expect(h.calls[0]).toEqual({
      indicatorSettingsId: "study-9",
      settingsOpen: false,
      drawingSettingsTarget: null,
      contextMenu: null,
    });
  });

  it("applyChartTemplate performs exactly one set() writing chartSettings", () => {
    const h = makeHarness({
      chartTemplates: [{ id: "x", name: "X", settings: { grid: false } }],
    });
    h.slice.applyChartTemplate("x");
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {})).toEqual(["chartSettings"]);
    expect(h.state.chartSettings).toEqual({
      ...DEFAULT_CHART_SETTINGS,
      grid: false,
    });
  });

  it("toggleOrientation performs exactly one set() writing orientation", () => {
    const h = makeHarness({ orientation: "h" });
    h.slice.toggleOrientation();
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({ orientation: "v" });
  });

  it("patchLayoutSync performs exactly one set(): layoutSync + panes", () => {
    const h = makeHarness({
      panes: twoPanes(),
      layoutCount: 2,
      layoutSync: { ...DEFAULT_LAYOUT_SYNC },
      activePaneId: "pane-0",
    });
    h.slice.patchLayoutSync({ symbol: true });
    expect(h.calls).toHaveLength(1);
    expect(Object.keys(h.calls[0] ?? {}).sort()).toEqual(["layoutSync", "panes"].sort());
    expect(h.state.panes[1]?.symbol).toBe("BTCUSDT");
  });

  it("patchReplay without an active replay performs zero set() calls", () => {
    const h = makeHarness({ replay: null });
    h.slice.patchReplay({ playing: false });
    expect(h.calls).toHaveLength(0);
  });

  it("setVertCursorLocked performs exactly one set() carrying both fields", () => {
    const h = makeHarness({ vertCursorLocked: true, lockedCursorTime: 5 });
    h.slice.setVertCursorLocked(false);
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]).toEqual({ vertCursorLocked: false, lockedCursorTime: null });
  });
});
