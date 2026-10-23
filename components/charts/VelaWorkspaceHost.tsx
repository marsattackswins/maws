"use client";

/**
 * VelaWorkspaceHost.tsx — MAWS shell on Vela's WORKSPACE engine (feature-flagged).
 *
 * Replaces ChartGrid with a single VelaWorkspace. Bridges in ONE direction each
 * way, so both state systems stay coherent:
 *
 *  MAWS → workspace (store subscription)
 *   - layoutCount/orientation → ws.setLayout(registered MAWS layout id)
 *   - layoutSync switches → ws.sync.set(kind, on|off)
 *   - pane symbol/timeframe edits from MAWS UI → cell market switch
 *   - activePaneId → ws.setActiveCell (clicks inside the grid echo back as
 *     cell:active and are skipped, so no loop)
 *
 *  workspace → MAWS (ws events)
 *   - cell:created/cell:destroyed → registerChart/unregisterChart — all 14
 *     getChart(pane.id) consumers keep working untouched
 *   - cell:active → setActivePane
 *
 * Mounted headless (no Vela topbar/bottombar): MAWS's own TopBar/BottomPanel keep
 * the shell chrome this phase.
 */

import { useEffect, useRef, useState } from "react";
import {
  VelaWorkspace,
  layoutDefinition,
  registerLayout,
  type VelaWorkspaceOptions,
} from "@/lib/charting/workspace";
import { mawsWorkspaceLayouts, mawsWorkspaceLayoutId } from "@/lib/vela-workspace-layouts";
import { mountVelaLayoutPicker } from "@/lib/vela-layout-picker";
import { PineEngine } from "@luxalgo/vela-pinets";
import { mawsVelaProvider, toVelaTicker } from "@/lib/vela-feed-adapter";
import { registerChart, unregisterChart, setWorkspaceHandle } from "@/lib/chart-registry";
import { useAppStore } from "@/lib/store";
import { velaThemeNameFromAppSettings } from "@/lib/app-theme";
import { wireCell } from "@/lib/vela-cell-wiring";
import { startChartSettingsEcho } from "@/lib/vela-chart-settings";
import { registerChartVisibilityActions } from "@/lib/vela-context-actions";
import { VelaWorkspaceOverlays } from "@/components/charts/VelaWorkspaceOverlays";
import type { ChartPaneState } from "@/types";
import "@/lib/vela-native-indicators";

let layoutsRegistered = false;

/** Idempotently register the MAWS layout definitions in Vela's registry. */
function ensureMawsLayouts(): void {
  if (layoutsRegistered) return;
  for (const def of mawsWorkspaceLayouts()) registerLayout(def);
  layoutsRegistered = true;
}

/** MAWS timeframe → Vela canonical timeframe string (ChartCanvas's mapping). */
function mapTfToVela(tf: ChartPaneState["timeframe"]): string {
  const map: Record<string, string> = {
    "1m": "1", "3m": "3", "5m": "5", "15m": "15", "30m": "30",
    "1h": "60", "2h": "120", "4h": "240",
    "1D": "D", "1W": "W", "1M": "M",
  };
  return map[tf] ?? "60";
}

export function VelaWorkspaceHost() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<VelaWorkspace | null>(null);
  const activeEchoRef = useRef(false);
  // The workspace instance in React state so the overlay portals re-render once
  // it exists (the ref alone doesn't trigger a render).
  const [wsState, setWsState] = useState<NonNullable<VelaWorkspace | null> | null>(null);

  // Mount the workspace once. The zustand snapshot seeds the cells; later store
  // changes flow through the subscription below.
  const ENABLED = process.env.NEXT_PUBLIC_MAWS_VELA_WORKSPACE === "true";

  useEffect(() => {
    const el = containerRef.current;
    if (!el || wsRef.current || !ENABLED) return;
    const s = useAppStore.getState();

    ensureMawsLayouts();

    const opts: VelaWorkspaceOptions = {
      // Headless inside MAWS — MAWS's own TopBar/BottomPanel own that chrome.
      topbar: { left: [], right: [] },
      bottombar: false,
      indicatorPicker: false,
      // MAWS owns drawing tool-picking via VelaDrawingBar; the workspace's shared
      // toolbar stays OFF but the drawings feature itself stays ON (per-cell
      // persistence keeps flowing through chart.drawings).
      drawings: { toolbar: false },
      drawingToolbar: false,
      theme: (velaThemeNameFromAppSettings(s.appSettings) ?? "dark") as never,
      providers: { binance: () => mawsVelaProvider },
      engines: { pine: () => new PineEngine() },
      layout: mawsWorkspaceLayoutId(s.layoutCount, s.orientation),
      // Cells ARE the store's panes — durable names keep chart-registry keys equal.
      cells: Object.fromEntries(
        s.panes.map((p) => [
          p.id,
          { symbol: toVelaTicker(p.symbol), timeframe: mapTfToVela(p.timeframe) },
        ]),
      ),
      sync: {
        symbol: s.layoutSync.symbol,
        timeframe: s.layoutSync.interval,
        crosshair: s.layoutSync.crosshair,
      },
      maxWebglCells: 8,
      persist: false,
    };

    const ws = new VelaWorkspace(el, opts);
    wsRef.current = ws;
    setWsState(ws);
    // Shell surfaces (TopBar screenshot, AppShell) reach the workspace here.
    setWorkspaceHandle({
      replay: ws.replay,
      screenshot: () => ws.screenshot(),
      downloadScreenshot: () => ws.downloadScreenshot(),
      maximizeCell: (id) => ws.maximizeCell(id),
      // Vela's own layout picker, mounted on the shell's Layouts button — picks route
      // through the store so the bridge below (store → ws.setLayout) stays the only
      // order-flow, and sync switches ride the persisted `layoutSync`.
      mountLayoutPicker: (trigger, onOpenChange) =>
        mountVelaLayoutPicker({
          ws,
          trigger,
          onOpenChange,
          applyLayout: ({ count, orientation }) =>
            useAppStore.getState().applyLayout(count, orientation),
          getLayoutSync: () => useAppStore.getState().layoutSync,
          patchLayoutSync: (patch) => useAppStore.getState().patchLayoutSync(patch),
        }),
    });

    // ── workspace → MAWS ────────────────────────────────────────────────────
    const offs: Array<() => void> = [];

    // LIVE settings echo: any store `patchChartSettings`/palette change applies
    // the mapped keys to every live renderer immediately (see
    // lib/vela-chart-settings.ts `startChartSettingsEcho`).
    offs.push(startChartSettingsEcho());

    // Right-click menu entries that speak the store (hide drawings / hide
    // indicators) — contributed into Vela's own chart context menu.
    offs.push(registerChartVisibilityActions());

    // Vela cell-state bridge: cell dehydrations → persisted store (per pane).
    // The workspace is headless (`persist:false`), so this is the only place
    // chart-side edits survive a restart. Debounce: the workspace's own
    // state:changed already coalesces bursts (see markStateDirty).
    offs.push(
      ws.on("state:changed", () => {
        const panes = useAppStore.getState().panes;
        for (const p of panes) {
          const cell = ws.cell(p.id);
          if (!cell) continue;
          try {
            useAppStore.getState().setPaneVelaState(p.id, cell.dehydrate() as Record<string, unknown>);
          } catch {
            /* cell mid-teardown — skip */
          }
        }
      }),
    );

    // Cells are built INSIDE the workspace constructor, so the initial
    // cell:created events fire before the subscriptions below attach —
    // backfill the registry for the live grid, then subscribe for later ones
    // (layout switches create/destroy cells at runtime).
    const registerCell = (id: string): void => {
      const cell = ws.cell(id);
      if (!cell) return;
      // Rehydrate this cell from the persisted Vela cell-state doc (renderer
      // config, drawings doc, bars, session, display prefs) before wiring.
      const saved = useAppStore.getState().panes.find((p) => p.id === id)?.velaState;
      if (saved) {
        try {
          cell.rehydrate(saved as never);
        } catch {
          /* malformed doc — fall back to seed */
        }
      }
      registerChart(id, {
        vela: cell.chart,
        renderer: cell.chart.renderer as never,
        el: cell.host,
      });
      // All per-cell MAWS wiring rides one disposer keyed by cell.
      cellWiring.set(id, wireCell(ws, id));
    };
    const cellWiring = new Map<string, () => void>();
    for (const cell of ws.cells()) registerCell(cell.id);

    offs.push(
      ws.on("cell:created", ({ id }) => registerCell(id)),
    );

    offs.push(
      ws.on("cell:destroyed", ({ id }) => {
        cellWiring.get(id)?.();
        cellWiring.delete(id);
        unregisterChart(id);
      }),
    );

    offs.push(
      ws.on("cell:active", ({ id }) => {
        if (activeEchoRef.current) return; // echo of our own setActiveCell
        if (id && id !== useAppStore.getState().activePaneId) {
          useAppStore.getState().setActivePane(id);
        }
      }),
    );

    // ── MAWS → workspace (subscribe to the store) ───────────────────────────
    const unsubStore = useAppStore.subscribe((state, prev) => {
      const ws2 = wsRef.current;
      if (!ws2) return;

      // Layout switch (count/orientation) → ws.setLayout on the registered id.
      if (state.layoutCount !== prev.layoutCount || state.orientation !== prev.orientation) {
        const defId = mawsWorkspaceLayoutId(state.layoutCount, state.orientation);
        if (layoutDefinition(defId)) ws2.setLayout(defId);
      }

      // Layout sync toggles → ws.sync.set (true = every cell follows).
      // MAWS kinds → Vela kinds: symbol→symbol, interval→timeframe,
      // crosshair→crosshair, time+dateRange→viewport (both gate the same
      // workspace link; the store stays the persisted source).
      if (state.layoutSync !== prev.layoutSync) {
        ws2.sync.set("symbol", state.layoutSync.symbol);
        ws2.sync.set("timeframe", state.layoutSync.interval);
        ws2.sync.set("crosshair", state.layoutSync.crosshair);
        ws2.sync.set(
          "viewport",
          state.layoutSync.time || state.layoutSync.dateRange,
        );
      }

      // Active pane switch → ws.setActiveCell (mark the echo before calling;
      // the workspace's cell:active emission is synchronous, so the flag
      // suppresses the bounce back into setActivePane).
      if (state.activePaneId !== prev.activePaneId && state.activePaneId) {
        activeEchoRef.current = true;
        ws2.setActiveCell(state.activePaneId);
        activeEchoRef.current = false;
      }

      // Maximization: MAWS's per-pane maximize button → the workspace's native
      // cell maximize (the store field stays the single source of truth).
      if (state.maximizedPaneId !== prev.maximizedPaneId) {
        ws2.maximizeCell(state.maximizedPaneId);
      }
      // Per-pane symbol/timeframe edits from MAWS UI → the cell's market.
      // (After the maximize block above; the loop below is unchanged.)
      for (const pane of state.panes) {
        const before = prev.panes.find((p) => p.id === pane.id);
        if (!before) continue;
        if (before.symbol !== pane.symbol) {
          ws2.cell(pane.id)?.chart.setMarket({ symbol: toVelaTicker(pane.symbol) });
        }
        if (before.timeframe !== pane.timeframe) {
          ws2.cell(pane.id)?.chart.setMarket({ timeframe: mapTfToVela(pane.timeframe) });
        }
      }
    });

    return () => {
      unsubStore();
      for (const off of offs) off();
      for (const cell of ws.cells()) unregisterChart(cell.id);
      wsRef.current = wsRef.current === ws ? null : wsRef.current;
      setWsState(null);
      setWorkspaceHandle(null);
      ws.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="vela-workspace-host h-full min-h-0 w-full">
      {wsState && <VelaWorkspaceOverlays ws={wsState} />}
    </div>
  );
}
