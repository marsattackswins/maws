import type { Vela, NativeRenderer } from "@/lib/charting";

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
};

const handles = new Map<string, ChartHandle>();

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
  /** Composite screenshot of the whole grid → PNG data URL (null when empty). */
  screenshot(): string | null;
  /** Download the composite screenshot (workspace's own filename). */
  downloadScreenshot(): void;
  /** Maximize one cell over the grid (null restores). */
  maximizeCell(id: string | null): void;
  /**
   * Mount VELA's layout picker on a shell trigger (the workspace root is the panel's
   * token/positioning host, so the picker itself lives with the workspace). Returns
   * the disposer.
   */
  mountLayoutPicker(trigger: HTMLElement, onOpenChange?: (open: boolean) => void): () => void;
};

let workspaceHandle: WorkspaceHandle | null = null;
const workspaceListeners = new Set<() => void>();

export function setWorkspaceHandle(handle: WorkspaceHandle | null): void {
  workspaceHandle = handle;
  // Shell surfaces (TopBar's layout button) mount before the workspace host does —
  // the handle appearing/disappearing is what they actually bind against.
  for (const listener of workspaceListeners) listener();
}

export function getWorkspace(): WorkspaceHandle | null {
  return workspaceHandle;
}

/** Notified whenever the workspace handle is registered or cleared. */
export function subscribeWorkspace(listener: () => void): () => void {
  workspaceListeners.add(listener);
  return () => {
    workspaceListeners.delete(listener);
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

let lastCrosshair: LastCrosshair | null = null;

export function setLastCrosshair(value: LastCrosshair | null) {
  lastCrosshair = value;
}

export function getLastCrosshair(): LastCrosshair | null {
  return lastCrosshair;
}
