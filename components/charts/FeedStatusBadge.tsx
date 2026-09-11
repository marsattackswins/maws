"use client";

import { mawsFeed } from "@/lib/maws/feed";
import type { Timeframe } from "@/types";
import { useEffect, useState } from "react";

const APPEARANCE = {
  connecting: { text: "Connecting", color: "#787b86" },
  live: { text: "Live", color: "#089981" },
  delayed: { text: "Data delayed", color: "#f23645" },
  reconnecting: { text: "Reconnecting", color: "#ff9800" },
} as const;

type Props = {
  symbol: string;
  timeframe: Timeframe;
  className?: string;
};

/**
 * Small per-pane market-feed health badge. Polls the feed's kline freshness
 * state once per second (the health checker period) and shows:
 * Connecting · Live · Data delayed · Reconnecting (recovery in progress).
 * Read-only: it never touches the chart stream or quote pipeline.
 */
export function FeedStatusBadge({ symbol, timeframe, className }: Props) {
  const [state, setState] = useState(() => ({
    status: mawsFeed.getKlineStatus(symbol, timeframe),
    recovering: mawsFeed.isKlineRecovering(symbol, timeframe),
  }));

  useEffect(() => {
    const id = setInterval(() => {
      const next = {
        status: mawsFeed.getKlineStatus(symbol, timeframe),
        recovering: mawsFeed.isKlineRecovering(symbol, timeframe),
      };
      setState((prev) =>
        prev.status === next.status && prev.recovering === next.recovering
          ? prev
          : next,
      );
    }, 1_000);
    return () => clearInterval(id);
  }, [symbol, timeframe]);

  // If idle, don't show anything
  if (state.status === "idle") return null;
  
  const { text, color } = state.recovering
    ? APPEARANCE.reconnecting
    : APPEARANCE[state.status];

  return (
    <span
      className={`flex items-center gap-1.5 rounded-[3px] px-2 py-1 text-[11px] leading-none whitespace-nowrap ${className ?? ""}`}
      style={{ 
        color,
        background: "rgba(19, 23, 34, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      title={`Market feed: ${text}`}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {text}
    </span>
  );
}
