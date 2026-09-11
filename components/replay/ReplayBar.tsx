"use client";

import { mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useEffect } from "react";

const SPEEDS = [0.5, 1, 2, 5, 10, 20];

export function ReplayBar() {
  const replay = useAppStore((s) => s.replay);
  const patchReplay = useAppStore((s) => s.patchReplay);
  const stopReplay = useAppStore((s) => s.stopReplay);
  const pane = useAppStore((s) => s.panes.find((p) => p.id === s.replay?.paneId) ?? s.panes[0]);

  useEffect(() => {
    if (!replay?.playing) return;
    const ms = Math.max(40, 420 / replay.speed);
    const id = window.setInterval(() => {
      const cur = useAppStore.getState().replay;
      if (!cur) return;
      if (cur.index >= cur.total - 1) {
        patchReplay({ playing: false, index: cur.total - 1 });
        return;
      }
      patchReplay({ index: cur.index + 1 });
    }, ms);
    return () => window.clearInterval(id);
  }, [replay?.playing, replay?.speed, patchReplay]);

  if (!replay) return null;

  const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
  const bar = candles[Math.min(replay.index, candles.length - 1)];
  const stamp = bar
    ? (() => {
        const d = new Date(bar.time * 1000);
        const datePart = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const timePart = d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `${datePart} - ${timePart}`;
      })()
    : "";

  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-t border-[#222] bg-black px-2 text-[12px] text-[#d1d4dc]">
      <button
        type="button"
        className="flex h-7 items-center gap-1 rounded-[4px] px-2 text-[#787b86] hover:bg-[#1a1a1a] hover:text-[#d1d4dc]"
        onClick={stopReplay}
      >
        <X size={13} />
        Exit
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[#1a1a1a]"
        onClick={() => patchReplay({ index: Math.max(1, replay.index - 1), playing: false })}
      >
        <SkipBack size={14} />
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#1a1a1a] hover:bg-[#222]"
        onClick={() => patchReplay({ playing: !replay.playing })}
      >
        {replay.playing ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[#1a1a1a]"
        onClick={() =>
          patchReplay({ index: Math.min(replay.total - 1, replay.index + 1), playing: false })
        }
      >
        <SkipForward size={14} />
      </button>
      <select
        value={replay.speed}
        onChange={(e) => patchReplay({ speed: Number(e.target.value) })}
        className="h-7 border border-[#222] bg-black px-1 text-[12px] text-[#d1d4dc]"
      >
        {SPEEDS.map((s) => (
          <option key={s} value={s}>
            {s}x
          </option>
        ))}
      </select>
      <input
        type="range"
        min={1}
        max={Math.max(2, replay.total - 1)}
        value={replay.index}
        onChange={(e) => patchReplay({ index: Number(e.target.value), playing: false })}
        className="mx-2 h-1 min-w-0 flex-1 accent-[#2962ff]"
      />
      <span className="shrink-0 text-[#787b86]">
        {stamp} · {replay.index + 1}/{replay.total}
      </span>
    </div>
  );
}
