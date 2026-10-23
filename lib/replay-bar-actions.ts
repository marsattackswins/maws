export type ReplayBarSeek = (from: number) => Promise<void>;

export function replaySliderMax(
  bounds: { first: number; last: number } | null,
  timeframeMs: number,
): number {
  if (!bounds || !Number.isFinite(timeframeMs) || timeframeMs <= 0) return 1;
  return Math.max(1, Math.ceil((bounds.last - bounds.first) / timeframeMs) - 1);
}

export function replaySliderPosition(
  cursorTime: number | null,
  bounds: { first: number; last: number } | null,
  timeframeMs: number,
): number {
  if (cursorTime == null || !bounds || !Number.isFinite(timeframeMs) || timeframeMs <= 0) return 0;
  const max = replaySliderMax(bounds, timeframeMs);
  return Math.min(max, Math.max(0, Math.round((cursorTime - bounds.first) / timeframeMs)));
}

export function replaySliderTime(
  position: number,
  bounds: { first: number; last: number } | null,
  timeframeMs: number,
): number | null {
  if (!bounds || !Number.isFinite(timeframeMs) || timeframeMs <= 0) return null;
  const max = replaySliderMax(bounds, timeframeMs);
  const clampedPosition = Math.min(max, Math.max(0, Math.round(position)));
  return bounds.first + clampedPosition * timeframeMs;
}

/** Update app replay state before asking the chart workspace to seek. */
export function seekReplayFromBar(
  seek: ReplayBarSeek,
  from: number,
  updateReplayState: () => void,
): Promise<void> {
  updateReplayState();
  return seek(from);
}
