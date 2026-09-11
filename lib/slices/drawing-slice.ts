import { isPersistTool } from "@/lib/drawings";
import type { Drawing, DrawingTool } from "@/types";
import type { Store } from "@/lib/store";

export type DrawingSliceState = {
  drawingTool: DrawingTool;
  stayInDrawingMode: boolean;
  magnet: boolean;
  drawingsHidden: boolean;
  drawingHistory: { paneId: string; drawings: Drawing[] }[];
  drawingHistoryIndex: number;
  drawingSettingsTarget: { paneId: string; drawingId: string } | null;
  selectedDrawingId: string | null;
};

export type DrawingSliceActions = {
  addDrawing: (paneId: string, drawing: Drawing) => void;
  updateDrawing: (paneId: string, drawingId: string, patch: Partial<Drawing>) => void;
  saveDrawingHistory: (paneId: string) => void;
  removeDrawing: (paneId: string, drawingId: string) => void;
  clearDrawings: (paneId: string) => void;
  undoDrawing: () => void;
  redoDrawing: () => void;
  setSelectedDrawing: (id: string | null) => void;
  setDrawingTool: (tool: DrawingTool) => void;
  setStayInDrawingMode: (value: boolean) => void;
  setMagnet: (value: boolean) => void;
  setDrawingsHidden: (value: boolean) => void;
  setDrawingSettingsTarget: (target: { paneId: string; drawingId: string } | null) => void;
  toggleDrawingHidden: (paneId: string, drawingId: string) => void;
};

export type DrawingSlice = DrawingSliceState & DrawingSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

export function createDrawingSlice(set: RootSet, get: RootGet): DrawingSlice {
  return {
    drawingTool: "cursor",
    stayInDrawingMode: false,
    magnet: true,
    drawingsHidden: false,
    drawingHistory: [],
    drawingHistoryIndex: -1,
    drawingSettingsTarget: null,
    selectedDrawingId: null,

    addDrawing: (paneId, drawing) => {
      const state = get();
      const pane = state.panes.find(p => p.id === paneId);
      if (!pane) return;
      
      // Save current state to history before making change
      const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
      newHistory.push({ paneId, drawings: pane.drawings });
      
      set({
        panes: state.panes.map((p) =>
          p.id === paneId ? { ...p, drawings: [...p.drawings, drawing] } : p,
        ),
        selectedDrawingId: drawing.id,
        drawingHistory: newHistory,
        drawingHistoryIndex: newHistory.length - 1,
      });
    },
    updateDrawing: (paneId, drawingId, patch) => {
      // Don't save history for updates - they happen continuously during drag
      // History will be saved when drag ends (handled separately)
      set({
        panes: get().panes.map((p) =>
          p.id === paneId
            ? {
                ...p,
                drawings: p.drawings.map((d) =>
                  d.id === drawingId ? { ...d, ...patch } : d,
                ),
              }
            : p,
        ),
      });
    },
    saveDrawingHistory: (paneId) => {
      const state = get();
      const pane = state.panes.find(p => p.id === paneId);
      if (!pane) return;
      
      // Only save if different from last history entry
      const lastEntry = state.drawingHistory[state.drawingHistoryIndex];
      if (lastEntry && lastEntry.paneId === paneId) {
        const lastDrawingsJson = JSON.stringify(lastEntry.drawings);
        const currentDrawingsJson = JSON.stringify(pane.drawings);
        if (lastDrawingsJson === currentDrawingsJson) return;
      }
      
      // Save current state to history
      const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
      newHistory.push({ paneId, drawings: pane.drawings });
      
      set({
        drawingHistory: newHistory,
        drawingHistoryIndex: newHistory.length - 1,
      });
    },
    removeDrawing: (paneId, drawingId) => {
      const state = get();
      const pane = state.panes.find(p => p.id === paneId);
      if (!pane) return;
      
      // Save current state to history before making change
      const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
      newHistory.push({ paneId, drawings: pane.drawings });
      
      set({
        panes: state.panes.map((p) =>
          p.id === paneId
            ? { ...p, drawings: p.drawings.filter((d) => d.id !== drawingId) }
            : p,
        ),
        selectedDrawingId:
          state.selectedDrawingId === drawingId ? null : state.selectedDrawingId,
        drawingHistory: newHistory,
        drawingHistoryIndex: newHistory.length - 1,
      });
    },
    clearDrawings: (paneId) => {
      const state = get();
      const pane = state.panes.find(p => p.id === paneId);
      if (!pane) return;
      
      // Save current state to history before making change
      const newHistory = state.drawingHistory.slice(0, state.drawingHistoryIndex + 1);
      newHistory.push({ paneId, drawings: pane.drawings });
      
      set({
        panes: state.panes.map((p) =>
          p.id === paneId ? { ...p, drawings: [] } : p,
        ),
        selectedDrawingId: null,
        drawingHistory: newHistory,
        drawingHistoryIndex: newHistory.length - 1,
      });
    },
    undoDrawing: () => {
      const state = get();
      if (state.drawingHistoryIndex < 0) return;
      
      const historyEntry = state.drawingHistory[state.drawingHistoryIndex];
      if (!historyEntry) return;
      
      set({
        panes: state.panes.map((p) =>
          p.id === historyEntry.paneId
            ? { ...p, drawings: historyEntry.drawings }
            : p,
        ),
        drawingHistoryIndex: state.drawingHistoryIndex - 1,
        selectedDrawingId: null,
      });
    },
    redoDrawing: () => {
      const state = get();
      if (state.drawingHistoryIndex >= state.drawingHistory.length - 1) return;
      
      const nextIndex = state.drawingHistoryIndex + 1;
      const historyEntry = state.drawingHistory[nextIndex];
      if (!historyEntry) return;
      
      const pane = state.panes.find(p => p.id === historyEntry.paneId);
      if (!pane) return;
      
      // Get the state that was created after this history entry
      const nextHistoryEntry = state.drawingHistory[nextIndex + 1];
      if (!nextHistoryEntry) return;
      
      set({
        panes: state.panes.map((p) =>
          p.id === nextHistoryEntry.paneId
            ? { ...p, drawings: nextHistoryEntry.drawings }
            : p,
        ),
        drawingHistoryIndex: nextIndex,
        selectedDrawingId: null,
      });
    },
    setSelectedDrawing: (id) => set({ selectedDrawingId: id }),
    setDrawingTool: (tool) => set({ drawingTool: tool }),
    setStayInDrawingMode: (value) => set({ stayInDrawingMode: value }),
    setMagnet: (value) => set({ magnet: value }),
    setDrawingsHidden: (value) => set({ drawingsHidden: value }),
    setDrawingSettingsTarget: (target) =>
      set({
        drawingSettingsTarget: target,
        indicatorSettingsId: null,
        settingsOpen: false,
        contextMenu: null,
        selectedDrawingId: target?.drawingId ?? get().selectedDrawingId,
      }),
    toggleDrawingHidden: (paneId, drawingId) =>
      set({
        panes: get().panes.map((p) =>
          p.id === paneId
            ? {
                ...p,
                drawings: p.drawings.map((d) =>
                  d.id === drawingId ? { ...d, hidden: !d.hidden } : d,
                ),
              }
            : p,
        ),
      }),
  };
}

/** Drawing-owned rehydration normalizations for persisted workspace state. */
export function normalizeDrawingRehydrate(state: Store): void {
  if (
    state.drawingTool !== "cursor" &&
    state.drawingTool !== "zoom" &&
    !isPersistTool(state.drawingTool)
  ) {
    state.drawingTool = "cursor";
  }
  state.drawingSettingsTarget = null;
}
