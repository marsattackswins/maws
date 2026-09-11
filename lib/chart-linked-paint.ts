/**
 * Shared chart-overlay paint scheduler.
 *
 * Multiple overlays (drawings / marks / session breaks) attach per pane, but we
 * only keep ONE range subscription + ONE window listener set per pane so a drag
 * does not multiply work by N overlays.
 *
 * Paints coalesce to a single rAF. No perpetual 60fps burst — Lightweight Charts
 * already fires visible-range events while the user pans/zooms.
 */

type ChartLike = {
  chart: {
    timeScale: () => {
      subscribeVisibleLogicalRangeChange: (cb: () => void) => void;
      unsubscribeVisibleLogicalRangeChange: (cb: () => void) => void;
    };
  };
};

type PaneBus = {
  paints: Set<() => void>;
  getChart: (paneId: string) => ChartLike | undefined;
  unsubRange: (() => void) | null;
  onWheel: ((e: WheelEvent) => void) | null;
  onInteraction: ((e: MouseEvent | TouchEvent) => void) | null;
  ro: ResizeObserver | null;
  raf: number;
  observeEl: Element | null;
  attached: boolean;
  /** Chart instance the range subscription is bound to — detects swaps. */
  attachedHandle: ChartLike | null;
};

const buses = new Map<string, PaneBus>();

function ensureBus(
  paneId: string,
  getChart: (paneId: string) => ChartLike | undefined,
): PaneBus {
  let bus = buses.get(paneId);
  if (bus) return bus;
  bus = {
    paints: new Set(),
    getChart,
    unsubRange: null,
    onWheel: null,
    onInteraction: null,
    ro: null,
    raf: 0,
    observeEl: null,
    attached: false,
    attachedHandle: null,
  };
  buses.set(paneId, bus);
  return bus;
}

function flush(paneId: string) {
  const bus = buses.get(paneId);
  if (!bus) return;
  bus.raf = 0;
  for (const paint of bus.paints) {
    try {
      paint();
    } catch {
      /* overlay may be mid-unmount */
    }
  }
}

function schedule(paneId: string) {
  const bus = buses.get(paneId);
  if (!bus) return;
  // Chart swapped underneath us (TF/symbol change recreates the chart):
  // rebind range listeners to the live instance, otherwise the bus stays
  // subscribed to the disposed chart and overlays stop repainting.
  const handle = bus.getChart(paneId);
  if (bus.attached && handle && handle !== bus.attachedHandle) {
    detachListeners(paneId);
  }
  if (!bus.attached && handle) {
    attachListeners(paneId);
  }
  if (!bus || bus.raf) return;
  bus.raf = requestAnimationFrame(() => flush(paneId));
}

function attachListeners(paneId: string) {
  const bus = buses.get(paneId);
  if (!bus || bus.attached) return;
  const handle = bus.getChart(paneId);
  if (!handle) return;

  const onRange = () => schedule(paneId);
  const ts = handle.chart.timeScale();
  ts.subscribeVisibleLogicalRangeChange(onRange);
  bus.unsubRange = () => {
    // The chart can be removed (TF/symbol swap, unmount) before this detach
    // runs; calling into a disposed ITimeScaleApi throws "Object is disposed".
    try {
      ts.unsubscribeVisibleLogicalRangeChange(onRange);
    } catch {
      /* chart already disposed */
    }
  };
  bus.attachedHandle = handle;

  bus.onWheel = () => schedule(paneId);
  window.addEventListener("wheel", bus.onWheel, { passive: true, capture: true });

  bus.onInteraction = (e: MouseEvent | TouchEvent) => {
    // Buttons > 0 means a drag is likely happening (panning, axis dragging, etc.)
    if (e instanceof MouseEvent && e.buttons > 0) {
      schedule(paneId);
    } else if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
      schedule(paneId);
    }
  };
  window.addEventListener("mousemove", bus.onInteraction, { passive: true, capture: true });
  window.addEventListener("touchmove", bus.onInteraction, { passive: true, capture: true });
  window.addEventListener("mousedown", bus.onInteraction, { passive: true, capture: true });

  if (bus.observeEl) {
    bus.ro = new ResizeObserver(() => schedule(paneId));
    bus.ro.observe(bus.observeEl);
  }

  bus.attached = true;
  schedule(paneId);
}

function detachListeners(paneId: string) {
  const bus = buses.get(paneId);
  if (!bus) return;
  bus.unsubRange?.();
  bus.unsubRange = null;
  bus.attachedHandle = null;
  if (bus.onWheel) {
    window.removeEventListener("wheel", bus.onWheel, true);
    bus.onWheel = null;
  }
  if (bus.onInteraction) {
    window.removeEventListener("mousemove", bus.onInteraction, true);
    window.removeEventListener("touchmove", bus.onInteraction, true);
    window.removeEventListener("mousedown", bus.onInteraction, true);
    bus.onInteraction = null;
  }
  bus.ro?.disconnect();
  bus.ro = null;
  if (bus.raf) cancelAnimationFrame(bus.raf);
  bus.raf = 0;
  bus.attached = false;
}

export function attachChartLinkedPaint(opts: {
  paneId: string;
  getChart: (paneId: string) => ChartLike | undefined;
  paint: () => void;
  observeEl?: Element | null;
}): () => void {
  const { paneId, getChart, paint, observeEl } = opts;
  const bus = ensureBus(paneId, getChart);
  bus.getChart = getChart;
  if (observeEl && !bus.observeEl) bus.observeEl = observeEl;
  bus.paints.add(paint);

  // Chart may not be registered yet — retry a few frames.
  let tries = 0;
  let waitRaf = 0;
  const tryAttach = () => {
    waitRaf = 0;
    if (!buses.has(paneId) || !bus.paints.has(paint)) return;
    if (bus.attached) {
      schedule(paneId);
      return;
    }
    if (getChart(paneId)) {
      attachListeners(paneId);
      schedule(paneId);
      return;
    }
    if (tries++ < 90) waitRaf = requestAnimationFrame(tryAttach);
  };
  tryAttach();

  return () => {
    if (waitRaf) cancelAnimationFrame(waitRaf);
    bus.paints.delete(paint);
    if (bus.paints.size === 0) {
      detachListeners(paneId);
      buses.delete(paneId);
    }
  };
}
