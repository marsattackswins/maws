import type { Store } from "@/lib/store";

export type NewsSliceState = {
  /** Calendar (top) share of the News & Calendar dock (0–1). */
  calendarNewsSplit: number;
  detailsCollapsed: boolean;
  newsCollapsed: boolean;
  performanceCollapsed: boolean;
  technicalsCollapsed: boolean;
};

export type NewsSliceActions = {
  setCalendarNewsSplit: (ratio: number) => void;
  toggleDetailsCollapsed: () => void;
  toggleNewsCollapsed: () => void;
  togglePerformanceCollapsed: () => void;
  toggleTechnicalsCollapsed: () => void;
};

export type NewsSlice = NewsSliceState & NewsSliceActions;

type RootSet = (
  partial: Partial<Store> | ((state: Store) => Partial<Store>),
) => void;
type RootGet = () => Store;

export function createNewsSlice(set: RootSet, get: RootGet): NewsSlice {
  return {
    calendarNewsSplit: 0.52,
    detailsCollapsed: false,
    newsCollapsed: false,
    performanceCollapsed: false,
    technicalsCollapsed: false,

    setCalendarNewsSplit: (ratio) =>
      set({
        calendarNewsSplit: Math.min(0.78, Math.max(0.22, ratio)),
      }),
    toggleDetailsCollapsed: () =>
      set({ detailsCollapsed: !get().detailsCollapsed }),
    toggleNewsCollapsed: () => set({ newsCollapsed: !get().newsCollapsed }),
    togglePerformanceCollapsed: () =>
      set({ performanceCollapsed: !get().performanceCollapsed }),
    toggleTechnicalsCollapsed: () =>
      set({ technicalsCollapsed: !get().technicalsCollapsed }),
  };
}

/** Guard persisted calendarNewsSplit against non-finite legacy values. */
export function normalizeNewsRehydrate(state: Store): void {
  if (
    typeof state.calendarNewsSplit !== "number" ||
    !Number.isFinite(state.calendarNewsSplit)
  ) {
    state.calendarNewsSplit = 0.52;
  }
}
