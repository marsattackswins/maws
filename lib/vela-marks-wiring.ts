/**
 * vela-marks-wiring.ts — per-cell wiring for the `chart.marks` timeline lane.
 *
 * One call per live cell: define the lane's groups (labels + defaults for the chart
 * settings' Events tab), subscribe the cell to the shared event source for its
 * symbol, and re-push the mark set whenever the source refreshes, the symbol changes,
 * a related setting flips, or the replay cursor moves (marks after the cursor are the
 * future — a replay must not spoil it).
 *
 * Marks are DATA: `set()` replaces the whole lane, so this wiring owns every mark the
 * cell shows. Trade marks (fills/alerts) would join the same builder here.
 */
import type { Vela } from "@/lib/charting";
import { useAppStore } from "@/lib/store";
import { buildEventMarks, defineVelaMarkGroups, type MarkActions } from "@/lib/vela-marks";
import { cellEventSource, type CellEventSnapshot } from "@/lib/vela-event-source";

export type TimelineMarksOptions = {
  /** The store row this cell mirrors (symbol + settings lookups). */
  paneId: string;
  /** The cell's symbol when the store has no row for it yet. */
  symbol?: () => string | undefined;
  /** The replay cursor — marks after it stay hidden. Null while not replaying. */
  cutoff?: () => number | null;
};

export type TimelineMarksHandle = {
  /** Re-push the lane now (replay steps and any other outside change). */
  refresh: () => void;
  dispose: () => void;
};

/** Popup buttons open MAWS's own panels — both news and calendar live in one dock. */
const MARK_ACTIONS: MarkActions = {
  openCalendar: () => useAppStore.getState().setRightDock("calendar"),
  openNews: () => useAppStore.getState().setRightDock("calendar"),
  openUrl: (url) => {
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      /* popup blocked */
    }
  },
};

export function wireTimelineMarks(chart: Vela, opts: TimelineMarksOptions): TimelineMarksHandle {
  const marks = chart.marks;
  defineVelaMarkGroups(marks);

  let snapshot: CellEventSnapshot = { events: [], news: [] };
  let unsubscribeSource: (() => void) | null = null;
  let boundSymbol = "";

  const symbolOf = (): string =>
    useAppStore.getState().panes.find((p) => p.id === opts.paneId)?.symbol ??
    opts.symbol?.() ??
    "";

  const push = (): void => {
    const settings = useAppStore.getState().chartSettings;
    marks.set(
      buildEventMarks({
        events: settings.economicEvents ? snapshot.events : [],
        news: settings.latestNews ? snapshot.news : [],
        cutoff: opts.cutoff?.() ?? null,
        actions: MARK_ACTIONS,
      }),
    );
  };

  const bind = (symbol: string): void => {
    if (symbol === boundSymbol) return;
    boundSymbol = symbol;
    snapshot = { events: [], news: [] };
    unsubscribeSource?.();
    unsubscribeSource = null;
    push();
    if (!symbol) return;
    unsubscribeSource = cellEventSource.subscribe(symbol, (next) => {
      snapshot = next;
      push();
    });
  };

  bind(symbolOf());

  const offStore = useAppStore.subscribe((state, prev) => {
    const now = state.panes.find((p) => p.id === opts.paneId)?.symbol;
    const before = prev.panes.find((p) => p.id === opts.paneId)?.symbol;
    if (now !== undefined && now !== before) bind(now);
    if (state.chartSettings !== prev.chartSettings) push();
  });

  return {
    refresh: push,
    dispose: () => {
      offStore();
      unsubscribeSource?.();
      unsubscribeSource = null;
      try {
        marks.clear();
      } catch {
        /* chart already torn down */
      }
    },
  };
}
