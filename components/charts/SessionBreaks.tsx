"use client";

/**
 * SessionBreaks.tsx — Vela implementation.
 *
 * The existing day-break computation is kept; vertical separators are painted
 * through the `maws-session-breaks` native renderer layer. Replay cutoff:
 * breaks at/beyond the replay cursor are hidden.
 */

import { useEffect, useMemo, useRef } from "react";
import { getChart } from "@/lib/chart-registry";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { timeframeSeconds } from "@/lib/timeframes";
import type { SessionBreaksData } from "@/lib/vela-layers";
import "@/lib/vela-layers";
import type { Candle, ChartPaneState, DrawingLineStyle, Timeframe } from "@/types";

const LAYER = "maws-session-breaks";

/** UTC day bucket — same key VWAP session anchor uses (`floor(unix / 86400)`). */
function utcDayKey(unixSec: number): number {
  return Math.floor(unixSec / 86400);
}

/** First bar of each UTC calendar day (sub-daily only). Aligns with session VWAP resets. */
function sessionBreakTimes(candles: Candle[], timeframe: Timeframe): number[] {
  if (timeframeSeconds(timeframe) >= 86_400 || candles.length < 2) return [];
  const out: number[] = [];
  let prev = utcDayKey(candles[0].time);
  for (let i = 1; i < candles.length; i++) {
    const key = utcDayKey(candles[i].time);
    if (key !== prev) {
      out.push(candles[i].time);
      prev = key;
    }
  }
  return out;
}

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
    };
  }, [pane.id, pane.symbol, pane.timeframe, enabled, color, lineStyle, lineWidth, replayCutoffSec]);

  // Vela owns rendering — no DOM output.
  return null;
}
