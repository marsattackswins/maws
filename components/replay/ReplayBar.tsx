"use client";

/**
 * ReplayBar.tsx — Vela-driven replay controls (UI only).
 *
 * Vela owns the replay clock (`workspace.replay` across the chart grid);
 * this bar issues commands straight to it — step, play/pause, seek, speed,
 * exit — and mirrors position via the store fields Vela's `replay:*` events
 * keep updated (cursorTime + remaining). No feed-derived index math here.
 */

import { getChart, getWorkspace } from "@/lib/chart-registry";
import {
  replaySliderMax,
  replaySliderPosition,
  replaySliderTime,
  seekReplayFromBar,
} from "@/lib/replay-bar-actions";
import { useAppStore } from "@/lib/store";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";

const SPEEDS = [0.5, 1, 2, 5, 10, 20];

function replayIntervalMs(speed: number): number {
  return Math.max(40, 420 / Math.max(0.5, speed));
}

export function ReplayBar() {
  const replay = useAppStore((s) => s.replay);
  const patchReplay = useAppStore((s) => s.patchReplay);
  const stopReplay = useAppStore((s) => s.stopReplay);

  const paneId = replay?.paneId;
  const tfMs = useAppStore((s) => {
    const p = s.panes.find((x) => x.id === paneId);
    if (!p) return 0;
    const map: Record<string, number> = {
      "1m": 60_000, "3m": 180_000, "5m": 300_000, "15m": 900_000, "30m": 1_800_000,
      "1h": 3_600_000, "2h": 7_200_000, "4h": 14_400_000, "1D": 86_400_000,
      "1W": 604_800_000, "1M": 2_592_000_000,
    };
    return map[p.timeframe] ?? 3_600_000;
  });

  if (!replay) return null;

  const vela = () => {
    const handle = paneId ? getChart(paneId) : undefined;
    return handle?.vela.replay ?? null;
  };
  const bounds = vela()?.bounds ?? null;
  const sliderMax = replaySliderMax(bounds, tfMs);

  const stamp = replay.cursorTime
    ? (() => {
        const d = new Date(replay.cursorTime);
        return (
          d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
          " - " +
          d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
        );
      })()
    : "";

  const seek = (cursorTime: number) => {
    const controller = getWorkspace()?.replay;
    if (!controller || !paneId) {
      console.error("[maws] Could not seek replay because the chart workspace is unavailable.");
      return;
    }
    void seekReplayFromBar(
      (from) => controller.start({ from, cell: paneId }),
      cursorTime,
      () => patchReplay({ cursorTime, playing: false }),
    ).catch((error: unknown) => {
      console.error("[maws] Could not seek chart replay.", error);
      const state = controller.state;
      if (state.active && state.cursorTime != null) {
        patchReplay({
          cursorTime: state.cursorTime,
          remaining: state.remaining,
          playing: state.playing,
        });
      } else {
        stopReplay();
      }
    });
  };

  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-t border-[var(--maws-border)] bg-[var(--maws-panel)] px-2 text-[12px] text-[var(--maws-text)]">
      <button
        type="button"
        className="flex h-7 items-center gap-1 rounded-[4px] px-2 text-[var(--maws-muted)] hover:bg-[var(--maws-elevated)] hover:text-[var(--maws-text)]"
        onClick={() => {
          const controller = getWorkspace()?.replay;
          if (!controller) {
            console.error("[maws] Could not exit replay because the chart workspace is unavailable.");
            return;
          }
          controller.stop();
          stopReplay();
        }}
      >
        <X size={13} />
        Exit
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[var(--maws-elevated)]"
        title="Step back one bar"
        onClick={() => {
          if (replay.cursorTime != null) seek(replay.cursorTime - tfMs);
        }}
      >
        <SkipBack size={14} />
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--maws-elevated)] hover:bg-[var(--maws-hover)]"
        onClick={() => {
          const controller = getWorkspace()?.replay;
          if (!controller) {
            console.error("[maws] Could not control replay because the chart workspace is unavailable.");
            return;
          }
          if (replay.playing) controller.pause();
          else controller.play(replayIntervalMs(replay.speed));
        }}
      >
        {replay.playing ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[var(--maws-elevated)]"
        title="Step forward one bar"
        onClick={() => {
          const controller = getWorkspace()?.replay;
          if (!controller) {
            console.error("[maws] Could not step replay because the chart workspace is unavailable.");
            return;
          }
          controller.step();
        }}
      >
        <SkipForward size={14} />
      </button>
      <select
        value={replay.speed}
        onChange={(e) => {
          const speed = Number(e.target.value);
          patchReplay({ speed });
          if (replay.playing) {
            const controller = getWorkspace()?.replay;
            if (!controller) {
              console.error("[maws] Could not change replay speed because the chart workspace is unavailable.");
              return;
            }
            controller.play(replayIntervalMs(speed));
          }
        }}
        className="h-7 border border-[var(--maws-border)] bg-[var(--maws-bg)] px-1 text-[12px] text-[var(--maws-text)]"
      >
        {SPEEDS.map((s) => (
          <option key={s} value={s}>
            {s}x
          </option>
        ))}
      </select>
      <input
        type="range"
        min={0}
        max={sliderMax}
        value={replaySliderPosition(replay.cursorTime, bounds, tfMs)}
        onChange={(e) => {
          const cursorTime = replaySliderTime(Number(e.target.value), bounds, tfMs);
          if (cursorTime != null) seek(cursorTime);
        }}
        className="mx-2 h-1 min-w-0 flex-1 accent-[#2962ff]"
      />
      <span className="shrink-0 text-[var(--maws-muted)]">
        {stamp} · {replay.remaining ?? 0} left
      </span>
    </div>
  );
}
