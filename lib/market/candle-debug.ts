"use client";

import { useEffect, useState } from "react";

import { binanceFuturesFeed } from "@/lib/market/binance-feed";
import { visibilityTracker } from "@/lib/market/visibility";

/**
 * Dev diagnostics for the candle pipeline, gated by
 * NEXT_PUBLIC_DEBUG_CANDLES=true. Renders a 1Hz status line covering the
 * Page Visibility state the feed watches, socket readiness, active
 * generations, listener counts, and the reasons counters for resyncs /
 * recoveries / reconnects. Production (flag unset) is a strict no-op: no
 * interval, no subscription, no DOM.
 */
export function useCandleDebug(symbol: string, timeframe: string): string | null {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEBUG_CANDLES !== "true") return;
    const fmt = () => {
      const d = binanceFuturesFeed.getFeedDiagnostics() as {
        started: boolean;
        visibility: { visibility: string; transitions: number; hiddenTotalMs: number; deferredWatchdogTicks: number; reconcilesTriggered: number };
        klineGeneration: number;
        klineSocketState: number;
        quoteSocketState: number;
        klineStreamCount: number;
        chartListenerCount: number;
        quoteListenerCount: number;
        visibleWatchdogFails: number;
        recoveryCount: number;
        passiveResyncCount: number;
        reconnectCount: number;
      };
      const socketStates = ["connecting", "open", "closing", "closed"];
      return [
        `vis=${d.visibility.visibility} x${d.visibility.transitions}`,
        `hidden=${Math.round(d.visibility.hiddenTotalMs / 1000)}s`,
        `defer=${d.visibility.deferredWatchdogTicks}`,
        `sock=${socketStates[d.klineSocketState] ?? d.klineSocketState}`,
        `gen=${d.klineGeneration}`,
        `streams=${d.klineStreamCount}`,
        `listeners=${d.chartListenerCount}/${d.quoteListenerCount}`,
        `fails=${d.visibleWatchdogFails}`,
        `recov=${d.recoveryCount}`,
        `resync=${d.passiveResyncCount}`,
        `reconn=${d.reconnectCount}`,
        `reconciles=${d.visibility.reconcilesTriggered}`,
        `${symbol} ${timeframe}`,
      ].join(" ");
    };
    setLine(fmt());
    const id = window.setInterval(() => setLine(fmt()), 1000);
    return () => window.clearInterval(id);
  }, [symbol, timeframe]);

  return line;
}
