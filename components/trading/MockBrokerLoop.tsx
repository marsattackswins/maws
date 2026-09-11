"use client";

import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { tickMock } from "@/lib/trading/mock";
import { useEffect } from "react";

export function MockBrokerLoop() {
  const connected = useAppStore((s) => s.connectedBroker);

  useEffect(() => {
    if (connected !== "mock") return;
    // Immediate channel: every accepted quote is evaluated by the engine
    // BEFORE the ~150ms UI quote batching, so a TP/SL breach that reverses
    // inside the batch window is still caught. Engine-level replay
    // protection (tickMock guards + store idempotency) absorbs duplicates.
    return mawsFeed.subscribeTradeQuotes((map) => {
      tickMock(map.values());
    });
  }, [connected]);

  return null;
}
