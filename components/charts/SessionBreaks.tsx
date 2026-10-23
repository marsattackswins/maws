"use client";

/**
 * SessionBreaks.tsx — Vela implementation.
 *
 * The existing day-break computation is kept; vertical separators are painted
 * through the `maws-session-breaks` native renderer layer. Replay cutoff:
 * breaks at/beyond the replay cursor are hidden.
 */

import { useEffect, useRef } from "react";
import { getChart } from "@/lib/chart-registry";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { sessionBreakTimes } from "@/lib/vela-break-times";
import type { SessionBreaksData } from "@/lib/vela-layers";
import "@/lib/vela-layers";
import type { ChartPaneState, DrawingLineStyle } from "@/types";

const LAYER = "maws-session-breaks";

function dashFor(style: DrawingLineStyle): number[] {
  if (style === "dashed") return [6, 4];
  if (style === "dotted") return [2, 3];
  return [];
}

export function SessionBreaks({ pane }: { pane: ChartPaneState }) {
  const enabled = useAppStore((s) => s.chartSettings.sessionBreaks);
  const color = useAppStore((s) => s.chartSettings.sessionBreakColor);
  const lineStyle = useAppStore((s) => s.chartSettings.sessionBreakLineStyle);
  const lineWidth = useAppStore((s) => s.chartSettings.sessionBreakLineWidth);
  const replay = useAppStore((s) => s.replay);
  /** Cached break unix times — rebuilt only when series tip/length changes. */
  const breaksRef = useRef<number[]>([]);
  const breaksKeyRef = useRef("");

  const replaying = replay?.paneId === pane.id;
  /** Vela's replay cursor (epoch-ms → sec) — Vela owns the replay clock. */
  const replayCutoffSec = replaying && replay?.cursorTime != null
    ? Math.floor(replay.cursorTime / 1000)
    : null;

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer = 0;
    let raf = 0;

    const compute = (): SessionBreaksData => {
      if (!enabled) return { times: [], color, width: lineWidth, dash: dashFor(lineStyle) };
      const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
      if (candles.length < 2) return { times: [], color, width: lineWidth, dash: dashFor(lineStyle) };
      const tip = candles.at(-1);
      const key = `${pane.symbol}|${pane.timeframe}|${candles.length}|${tip?.time ?? 0}`;
      if (key !== breaksKeyRef.current) {
        breaksKeyRef.current = key;
        breaksRef.current = sessionBreakTimes(candles, pane.timeframe);
      }
      const cutoff = replayCutoffSec;
      return {
        times: breaksRef.current
          .filter((t) => cutoff == null || t <= cutoff)
          .map((t) => t * 1000),
        color,
        width: lineWidth,
        dash: dashFor(lineStyle),
      };
    };

    const push = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      const payload = compute();
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(push, 250);
        return;
      }
      tries = 0;
      try {
        handle.renderer.setNativeData(LAYER, payload);
      } catch {
        /* ignore */
      }
    };

    /** Blank the layer — a separator from a series this pane no longer shows must not
     *  survive the switch (the layer paints only what the chart's own bars allow, but
     *  the payload itself is ours to drop). */
    const clear = () => {
      try {
        getChart(pane.id)?.renderer.setNativeData(LAYER, {
          times: [],
          color,
          width: lineWidth,
          dash: dashFor(lineStyle),
        } satisfies SessionBreaksData);
      } catch {
        /* chart mid-teardown */
      }
    };

    if (!enabled) {
      push();
      return () => {
        cancelled = true;
        if (timer) window.clearTimeout(timer);
      };
    }

    // New-bar / history only — tip ticks must not rebuild day keys.
    const unsub = mawsFeed.subscribe(pane.symbol, pane.timeframe, (_c, _q, meta) => {
      if (meta?.tick) return;
      breaksKeyRef.current = "";
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        push();
      });
    });
    push();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (timer) window.clearTimeout(timer);
      unsub();
      // Symbol/timeframe/settings change (or unmount): wipe the old payload NOW, so
      // the gap until the next push shows no stale separators — the flicker that used
      // to pop up on every TF switch.
      clear();
      breaksKeyRef.current = "";
    };
  }, [pane.id, pane.symbol, pane.timeframe, enabled, color, lineStyle, lineWidth, replayCutoffSec]);

  // Vela owns rendering — no DOM output.
  return null;
}
