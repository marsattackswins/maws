import type { Vela, NativeRenderer, ExternalIndicatorEntry } from "@/lib/charting";
import type { WorkspaceReplay } from "@/lib/charting/workspace";

/**
 * Per-chart-pane Vela handle registry (Vela migration).
 *
 * `renderer` is the chart's own NativeRenderer instance — kept so overlay
 * owners (order blocks, session breaks, trade zones) can push layer payloads
 * via `renderer.setNativeData(id, data)`.
 */
export type ChartHandle = {
  vela: Vela;
  renderer: NativeRenderer;
  /** The DOM element the chart mounted on. */
  el: HTMLElement;
  /** Live host-owned display preferences captured by chart templates. */
  getTemplatePrefs?: () => ChartTemplatePrefs;
  /** Apply host-owned display preferences captured by chart templates. */
  applyTemplatePrefs?: (prefs: ChartTemplatePrefs) => void;
};

export type ChartTemplatePrefs = {
  watermark: boolean;
  replayWatermark: boolean;
  indicatorTitles: boolean;
  indicatorValues: boolean;
};

/**
 * Registry state, pinned to the page.
 *
 * `next dev` re-evaluates a module when it (or something it imports) changes. Rebuilt
 * module state meant a NEW empty map beside charts that were still mounted: every
 * `getChart()` consumer went blind while the grid kept running. One object per page
 * keeps the handles (and the workspace handle) reachable across evaluations; in
 * production the module is evaluated once, so this is a no-op.
 */
const registryHost = globalThis as typeof globalThis & {
  __mawsChartState?: {
    handles: Map<string, ChartHandle>;
    workspace: WorkspaceHandle | null;
    listeners: Set<() => void>;
    lastCrosshair: LastCrosshair | null;
  };
};
// `development` only: a production build evaluates modules once, and tests reset the
// module registry on purpose (a fresh registry per case).
const chartState =
  (process.env.NODE_ENV === "development" ? registryHost.__mawsChartState : undefined) ??
  (registryHost.__mawsChartState = {
    handles: new Map<string, ChartHandle>(),
    workspace: null,
    listeners: new Set<() => void>(),
    lastCrosshair: null,
  });

const handles = chartState.handles;

// Dev-only debugging aid: `__mawsCharts.get('<paneId>').vela` in the console.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __mawsCharts?: unknown }).__mawsCharts = handles;
  // `__mawsStore` — same dev-only aid, for the zustand store (settings echo tests,
  // etc.). Created lazily to avoid an import cycle at module-eval time.
  queueMicrotask(() => {
    void import("@/lib/store").then((m) => {
      (window as unknown as { __mawsStore?: unknown }).__mawsStore = m.useAppStore;
    });
  });
}

// ── workspace engine handle (VelaWorkspace migration) ──────────────────────
// When the workspace engine hosts the grid, shell surfaces (TopBar screenshot,
// AppShell shortcuts) reach the shared VelaWorkspace through this accessor.
type WorkspaceHandle = {
  /** Shared replay controller for all live workspace cells. */
  replay: WorkspaceReplay;
  /** Composite screenshot of the whole grid → PNG data URL (null when empty). */
  screenshot(): string | null;
  /** Download the composite screenshot (workspace's own filename). */
  downloadScreenshot(): void;
  /** Maximize one cell over the grid (null restores). */
  maximizeCell(id: string | null): void;
  /**
   * Open VELA's symbol search dialog for the ACTIVE cell — the same picker a bare
   * keystroke over the grid reaches (the shell's symbol button calls this instead of
   * drawing a picker of its own). An optional query seeds the field.
   */
  openSymbolSearch(query?: string): void;
  /**
   * Mount VELA's layout picker on a shell trigger (the workspace root is the panel's
   * token/positioning host, so the picker itself lives with the workspace). Returns
   * the disposer.
   */
  mountLayoutPicker(trigger: HTMLElement, onOpenChange?: (open: boolean) => void): () => void;
  /**
   * Add a SCRIPT indicator (Pine) to the ACTIVE cell through the shell — undo/redo,
   * the shell's bookkeeping and the cell's persistence all run; the raw
   * `chart.addIndicator` would bypass them. What the Pine editor's Run button calls.
   */
  addScript(entry: ExternalIndicatorEntry): void;
  /**
   * Mark third-party persistable state dirty (a shell `state:changed`, debounced) —
   * what a script edit needs after an in-place `updateCode`, which emits no shell
   * event of its own and would otherwise persist the previous source.
   */
  markStateDirty(): void;
};

export function setWorkspaceHandle(handle: WorkspaceHandle | null): void {
  chartState.workspace = handle;
  // Shell surfaces (TopBar's layout button) mount before the workspace host does —
  // the handle appearing/disappearing is what they actually bind against.
  for (const listener of chartState.listeners) listener();
}

export function getWorkspace(): WorkspaceHandle | null {
  return chartState.workspace;
}

/** Notified whenever the workspace handle is registered or cleared. */
export function subscribeWorkspace(listener: () => void): () => void {
  chartState.listeners.add(listener);
  return () => {
    chartState.listeners.delete(listener);
  };
}

export function registerChart(paneId: string, handle: ChartHandle) {
  handles.set(paneId, handle);
}

export function unregisterChart(paneId: string) {
  handles.delete(paneId);
}

export function getChart(paneId: string): ChartHandle | undefined {
  return handles.get(paneId);
}

/** The live Vela instance for a pane (or null). */
export function getVela(paneId: string): Vela | null {
  return handles.get(paneId)?.vela ?? null;
}

export function forEachChart(fn: (paneId: string, handle: ChartHandle) => void) {
  handles.forEach((handle, paneId) => fn(paneId, handle));
}

// ── multi-chart sync ─────────────────────────────────────────────────────────
// Crosshair + viewport links are the WORKSPACE's own (`ws.sync`, toggled from the
// layout picker). The old per-chart approximators lived here and mirrored every
// gesture regardless of the switch state — a range copied onto a chart with a
// different timeframe re-quantizes to its bars and could ping-pong the grid into
// an ever-smaller window. One owner, one implementation: the workspace link.

// ── last crosshair (drives context menu / shortcuts) ────────────────────────

export type LastCrosshair = {
  paneId: string;
  price: number;
  time: number | null;
};

export function setLastCrosshair(value: LastCrosshair | null) {
  chartState.lastCrosshair = value;
}

export function getLastCrosshair(): LastCrosshair | null {
  return chartState.lastCrosshair;
}
