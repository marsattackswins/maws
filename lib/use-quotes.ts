import { useEffect, useRef, useState } from "react";
import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import type { Quote } from "@/types";

function quoteUiEqual(a: Quote | undefined, b: Quote | undefined) {
  if (a === b) return true;
  if (!a || !b) return !a && !b;
  return (
    a.symbol === b.symbol &&
    a.last === b.last &&
    a.changePct === b.changePct &&
    a.change === b.change &&
    a.volume === b.volume
  );
}

function quoteBoardSig(quotes: Quote[]) {
  let s = "";
  for (const q of quotes) {
    s += q.symbol;
    s += ":";
    s += q.last;
    s += ":";
    s += q.changePct;
    s += "|";
  }
  return s;
}

/** Live quotes for the current hot set (watchlist + open panes + trades). */
export function useQuotes(enabled = true): Quote[] {
  const [quotes, setQuotes] = useState<Quote[]>(() => (enabled ? mawsFeed.getQuotes() : []));
  const sigRef = useRef("");

  useEffect(() => {
    if (!enabled) {
      setQuotes([]);
      sigRef.current = "";
      return;
    }
    const apply = (next: Quote[]) => {
      const sig = quoteBoardSig(next);
      if (sig === sigRef.current) return;
      sigRef.current = sig;
      setQuotes(next);
    };
    apply(mawsFeed.getQuotes());
    return mawsFeed.subscribeQuotes(() => {
      apply(mawsFeed.getQuotes());
    });
  }, [enabled]);

  return quotes;
}

export function useQuote(symbol: string): Quote | undefined {
  const bare = symbol.replace(/\.P$/i, "").toUpperCase();
  const [quote, setQuote] = useState<Quote | undefined>(() =>
    bare ? mawsFeed.getQuote(bare) : undefined,
  );

  useEffect(() => {
    if (!bare) {
      setQuote(undefined);
      return;
    }
    setQuote(mawsFeed.getQuote(bare));
    return mawsFeed.subscribeQuotes((map) => {
      const next = map.get(bare) ?? mawsFeed.getQuote(bare);
      setQuote((prev) => (quoteUiEqual(prev, next) ? prev : next));
    });
  }, [bare]);

  return quote;
}

/** Keep the feed's hot set in sync with watchlist / panes / trades. */
export function useSyncHotSymbols(enabled = true) {
  const watchlist = useAppStore((s) => s.watchlist);
  const layoutCount = useAppStore((s) => s.layoutCount);
  const paneKey = useAppStore((s) =>
    s.panes
      .slice(0, s.layoutCount)
      .map((p) => p.symbol)
      .join("\0"),
  );
  const tradeKey = useAppStore((s) =>
    [...s.orders.map((o) => o.symbol), ...s.positions.map((p) => p.symbol)]
      .sort()
      .join("\0"),
  );

  useEffect(() => {
    if (!enabled) return;
    useAppStore.getState().syncHotSymbols();
  }, [enabled, watchlist, layoutCount, paneKey, tradeKey]);
}
