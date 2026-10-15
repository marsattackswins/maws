/**
 * vela-context-actions.ts — MAWS store actions contributed into Vela's own chart
 * context menu (the menu a right-click on the canvas actually opens; MAWS's React
 * menu only opens over its own overlays).
 *
 * The two visibility toggles live here rather than in the drawing toolbar, whose
 * MAWS extras are down to undo/redo:
 *   - `drawingsHidden` — mirrored onto every managed drawing by DrawingOverlay;
 *   - `indicatorsHidden` — mirrored onto every indicator handle by vela-cell-wiring.
 * Both are store-persisted, so a hide survives a restart.
 *
 * The widget reads the action registry at menu-open time, so re-registering on
 * store change is what keeps each entry's "Hide …" / "Show …" text truthful.
 */
import { registerWidgetAction, unregisterWidgetAction } from "@/lib/charting";
import { useAppStore } from "@/lib/store";

/** Stable ids under the `context:body` target — re-registering replaces an id. */
const HIDE_DRAWINGS = "maws:hide-drawings";
const HIDE_INDICATORS = "maws:hide-indicators";

/** Register both entries. Returns the disposer (unsubscribes + unregisters). */
export function registerChartVisibilityActions(): () => void {
  const apply = (): void => {
    const s = useAppStore.getState();
    registerWidgetAction({
      id: HIDE_DRAWINGS,
      target: "context:body",
      order: 0,
      label: s.drawingsHidden ? "Show drawings" : "Hide drawings",
      run: () => {
        const st = useAppStore.getState();
        st.setDrawingsHidden(!st.drawingsHidden);
      },
    });
    registerWidgetAction({
      id: HIDE_INDICATORS,
      target: "context:body",
      order: 1,
      label: s.indicatorsHidden ? "Show indicators" : "Hide indicators",
      run: () => {
        const st = useAppStore.getState();
        st.setIndicatorsHidden(!st.indicatorsHidden);
      },
    });
  };

  let prev = useAppStore.getState();
  apply();
  const unsub = useAppStore.subscribe((state) => {
    if (
      state.drawingsHidden === prev.drawingsHidden &&
      state.indicatorsHidden === prev.indicatorsHidden
    ) {
      return;
    }
    prev = state;
    apply();
  });

  return () => {
    unsub();
    unregisterWidgetAction(HIDE_DRAWINGS);
    unregisterWidgetAction(HIDE_INDICATORS);
  };
}
