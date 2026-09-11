import type { ITimeScaleApi, Time } from "lightweight-charts";

const MIN_VISIBLE_BARS = 8;
/** Toolbar +/- buttons — mild step, still noticeable per click. */
const ZOOM_IN = 0.92;
const ZOOM_OUT = 1.087;
/** ~8% span change per typical mouse-wheel notch (±100 deltaY). */
const WHEEL_STEP_PER_NOTCH = 0.08;

/**
 * TradingView-style zoom: keep the right edge fixed (latest bars stay put)
 * and grow/shrink the visible range from the left.
 * factor < 1 → zoom in (less history); factor > 1 → zoom out (more history).
 */
export function zoomTimeScaleRightAnchored(
  timeScale: ITimeScaleApi<Time>,
  factor: number,
): void {
  const range = timeScale.getVisibleLogicalRange();
  if (!range) return;
  const right = range.to;
  const span = Math.max(MIN_VISIBLE_BARS, (range.to - range.from) * factor);
  timeScale.setVisibleLogicalRange({ from: right - span, to: right });
}

export function zoomInRightAnchored(timeScale: ITimeScaleApi<Time>): void {
  zoomTimeScaleRightAnchored(timeScale, ZOOM_IN);
}

export function zoomOutRightAnchored(timeScale: ITimeScaleApi<Time>): void {
  zoomTimeScaleRightAnchored(timeScale, ZOOM_OUT);
}

/**
 * Map a wheel delta to a zoom factor (out if deltaY > 0).
 * Scales with |deltaY| so trackpads get fine steps and mouse notches stay gentle
 * (~8% per notch instead of large whole-range jumps).
 */
export function wheelZoomFactor(deltaY: number): number {
  const notches = Math.max(0.12, Math.min(1.25, Math.abs(deltaY) / 100));
  const step = WHEEL_STEP_PER_NOTCH * notches;
  return deltaY > 0 ? 1 + step : 1 / (1 + step);
}
