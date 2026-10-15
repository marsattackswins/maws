"use client";

/**
 * EventBreaks.tsx — vertical separators at economic-event times, painted
 * through the `maws-events-breaks` native renderer layer. Mirrors
 * SessionBreaks.tsx: the calendar keeps computing event times; Vela only
 * paints. Replay cutoff: breaks at/beyond the replay cursor are hidden.
 */

import { useEffect, useRef } from "react";
import { getChart } from "@/lib/chart-registry";
import { useAppStore } from "@/lib/store";
import type { EventBreaksData } from "@/lib/vela-layers";
import "@/lib/vela-layers";
import type { ChartPaneState, DrawingLineStyle } from "@/types";

const LAYER = "maws-events-breaks";

/** Refresh cadence for the event list (5 min — events move slowly). */
const REFRESH_MS = 5 * 60_000;

type CalEventLite = { at: number };

async function fetchUpcomingEvents(): Promise<CalEventLite[]> {
  try {
    const { fetchCalendarEvents } = await import("@/lib/calendar");
    const result = await fetchCalendarEvents();
    return result.events;
  } catch {
    return [];
  }
}

function dashFor(style: DrawingLineStyle): number[] {
  if (style === "dashed") return [6, 4];
  if (style === "dotted") return [2, 3];
  return [];
}

export function EventBreaks({ pane }: { pane: ChartPaneState }) {
  const enabled = useAppStore((s) => s.chartSettings.eventsBreaks);
  const color = useAppStore((s) => s.chartSettings.eventsBreakColor);
  const eventsVisible = useAppStore((s) => s.chartSettings.economicEvents);
  const replay = useAppStore((s) => s.replay);

  const replaying = replay?.paneId === pane.id;
  const replayCutoffSec = replaying && replay?.cursorTime != null
    ? Math.floor(replay.cursorTime / 1000)
    : null;

  useEffect(() => {
    if (!enabled || !eventsVisible) {
      // Clear any painted breaks when disabled.
      try {
        getChart(pane.id)?.renderer.setNativeData(LAYER, {
          times: [], color, width: 1, dash: [],
        } satisfies EventBreaksData);
      } catch { /* ignore */ }
      return;
    }

    let cancelled = false;
    const push = (times: number[]) => {
      if (cancelled) return;
      try {
        getChart(pane.id)?.renderer.setNativeData(LAYER, {
          times,
          color,
          width: 2,
          dash: dashFor("dotted"),
        } satisfies EventBreaksData);
      } catch { /* ignore */ }
    };

    const cutoff = replayCutoffSec;
    const load = async () => {
      const events = await fetchUpcomingEvents();
      if (cancelled) return;
      push(
        events
          .map((e) => e.at)
          .filter((ms) => cutoff == null || ms / 1000 <= cutoff),
      );
    };

    push([]); // clear immediately while loading
    void load();
    const id = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      push([]);
    };
  }, [pane.id, enabled, color, eventsVisible, replayCutoffSec]);

  // Vela owns rendering — no DOM output.
  return null;
}
