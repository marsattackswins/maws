"use client";

import { getChart } from "@/lib/chart-registry";
import { CHART_TIME_AXIS_H } from "@/lib/drawings";
import { useAppStore } from "@/lib/store";
import type { ChartSettings } from "@/types";
import {
  useEffect,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import { ChartScaleMenu } from "@/components/charts/ChartScaleMenu";

type Mode = ChartSettings["scaleModes"];

type Props = {
  paneId: string;
  mode: Mode;
  hostRef: RefObject<HTMLElement | null>;
  active: boolean;
  onActiveChange: (active: boolean) => void;
};

const TIME_AXIS_H = CHART_TIME_AXIS_H;
const FALLBACK_AXIS_W = 54;

type CornerBox = { left: number; top: number; width: number; height: number };

export function applyAutoFit(paneId: string) {
  const handle = getChart(paneId);
  if (!handle) return;
  // Price axis only — fit visible candles vertically; leave time zoom/scroll alone.
  handle.chart.priceScale("right").setAutoScale(true);
  try {
    handle.chart.priceScale("left").setAutoScale(true);
  } catch {
    /* left may be hidden */
  }
}

function rightAxisWidth(paneId: string) {
  const handle = getChart(paneId);
  if (!handle) return FALLBACK_AXIS_W;
  try {
    return Math.max(handle.chart.priceScale("right").width(), FALLBACK_AXIS_W);
  } catch {
    return FALLBACK_AXIS_W;
  }
}

/**
 * Measure the bottom-right corner of the **main price pane** (pane index 0)
 * so the "auto" label is anchored there — not at the very bottom of the full
 * chart, which sinks below all indicator sub-panes.
 */
function measureAutoCorner(host: HTMLElement, paneId: string): CornerBox {
  const hostRect = host.getBoundingClientRect();
  const axisW = rightAxisWidth(paneId);

  // Primary: use the live main-pane DOM element so we track every resize.
  const handle = getChart(paneId);
  const mainPaneEl = handle?.chart.panes()[0]?.getHTMLElement();
  if (mainPaneEl) {
    const pr = mainPaneEl.getBoundingClientRect();
    if (pr.width > 0 && pr.height > 0) {
      return {
        left: Math.round(pr.right - hostRect.left - axisW),
        top: Math.round(pr.bottom - hostRect.top - TIME_AXIS_H),
        width: axisW,
        height: TIME_AXIS_H,
      };
    }
  }

  // Fallback: geometry only.
  return {
    left: Math.round(hostRect.width - axisW),
    top: Math.round(hostRect.height - TIME_AXIS_H),
    width: axisW,
    height: TIME_AXIS_H,
  };
}


function isOnPriceOrTimeScale(
  host: HTMLElement,
  paneId: string,
  clientX: number,
  clientY: number,
): boolean {
  const handle = getChart(paneId);
  if (!handle) return false;
  const rect = host.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return false;

  const rightW = Math.max(handle.chart.priceScale("right").width(), 0);
  let leftW = 0;
  try {
    leftW = Math.max(handle.chart.priceScale("left").width(), 0);
  } catch {
    leftW = 0;
  }

  const onRightPrice = rightW > 0 && x >= rect.width - rightW - 1;
  const onLeftPrice = leftW > 0 && x <= leftW + 1;
  const onTime = y >= rect.height - TIME_AXIS_H;
  return onRightPrice || onLeftPrice || onTime;
}

function isInAutoCorner(
  host: HTMLElement,
  paneId: string,
  clientX: number,
  clientY: number,
): boolean {
  const handle = getChart(paneId);
  if (!handle) return false;
  const rightW = rightAxisWidth(paneId);
  // Use the main pane's bottom so the corner zone matches the repositioned button.
  const mainPaneEl = handle.chart.panes()[0]?.getHTMLElement();
  const bottom = mainPaneEl
    ? mainPaneEl.getBoundingClientRect().bottom
    : host.getBoundingClientRect().bottom;
  const right = (mainPaneEl ?? host).getBoundingClientRect().right;
  return clientX >= right - rightW && clientY >= bottom - TIME_AXIS_H;
}


export function clearAutoFit(paneId: string) {
  const handle = getChart(paneId);
  if (!handle) return;

  const freeze = (id: "right" | "left") => {
    try {
      const scale = handle.chart.priceScale(id);
      const range = scale.getVisibleRange();
      // Capture range first, then disable auto so the scale doesn't jump.
      scale.setAutoScale(false);
      if (range && Number.isFinite(range.from) && Number.isFinite(range.to)) {
        scale.setVisibleRange(range);
      }
    } catch {
      /* scale may be hidden */
    }
  };

  freeze("right");
  freeze("left");
}

export function ChartAutoScale({ paneId, mode, hostRef, active, onActiveChange }: Props) {
  const setActivePane = useAppStore((s) => s.setActivePane);
  const [corner, setCorner] = useState<CornerBox>({
    left: 0,
    top: 0,
    width: FALLBACK_AXIS_W,
    height: TIME_AXIS_H,
  });

  // Track the live scale-corner cell so the label fills and centers in it.
  useEffect(() => {
    if (mode === "never") return;
    const sync = () => {
      const host = hostRef.current;
      if (!host) return;
      const next = measureAutoCorner(host, paneId);
      setCorner((prev) =>
        prev.left === next.left &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next,
      );
    };
    sync();
    const host = hostRef.current;
    const ro = host ? new ResizeObserver(sync) : null;
    if (host && ro) ro.observe(host);
    window.addEventListener("resize", sync);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [hostRef, mode, paneId]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || mode === "never") return;

    const deactivate = () => {
      clearAutoFit(paneId);
      onActiveChange(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isInAutoCorner(host, paneId, e.clientX, e.clientY)) return;
      if (!isOnPriceOrTimeScale(host, paneId, e.clientX, e.clientY)) return;
      deactivate();
    };

    const onPointerUp = () => {
      const opts = getChart(paneId)?.chart.priceScale("right").options();
      if (opts && !opts.autoScale && active) onActiveChange(false);
    };

    const onWheel = (e: WheelEvent) => {
      if (isInAutoCorner(host, paneId, e.clientX, e.clientY)) return;
      if (!isOnPriceOrTimeScale(host, paneId, e.clientX, e.clientY)) return;
      deactivate();
    };

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("wheel", onWheel);
    };
  }, [active, hostRef, mode, onActiveChange, paneId]);

  // Keep the auto button / engine aligned with the persisted preference.
  useEffect(() => {
    if (mode === "never") return;
    const sync = () => {
      const handle = getChart(paneId);
      if (!handle) return;
      let chartAuto = true;
      try {
        chartAuto = handle.chart.priceScale("right").options().autoScale;
      } catch {
        return;
      }
      if (chartAuto === active) return;
      if (!chartAuto && active) {
        onActiveChange(false);
      } else if (chartAuto && !active) {
        try {
          const scale = handle.chart.priceScale("right");
          const range = scale.getVisibleRange();
          scale.setAutoScale(false);
          if (range && Number.isFinite(range.from) && Number.isFinite(range.to)) {
            scale.setVisibleRange(range);
          }
        } catch {
          /* ignore */
        }
      }
    };
    sync();
    const host = hostRef.current;
    const ro = host ? new ResizeObserver(sync) : null;
    if (host && ro) ro.observe(host);
    return () => {
      ro?.disconnect();
    };
  }, [active, hostRef, mode, onActiveChange, paneId]);

  const chartBg = useAppStore((s) => s.chartSettings.backgroundColor) || "#000000";

  if (mode === "never") return null;

  const visibility =
    mode === "always"
      ? "opacity-100"
      : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto";

  const GEAR_W = 20;

  const containerStyle: CSSProperties = {
    position: "absolute",
    left: corner.left,
    top: corner.top,
    width: corner.width,
    height: corner.height,
    backgroundColor: chartBg,
    zIndex: 40,
  };

  const autoStyle: CSSProperties = {
    width: corner.width - GEAR_W,
    height: "100%",
  };

  const gearStyle: CSSProperties = {
    width: GEAR_W,
    height: "100%",
    position: "relative",
  };

  return (
    <div
      style={containerStyle}
      className={`flex items-center justify-between transition-opacity duration-100 ${visibility}`}
      onMouseDown={(e: ReactMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Auto label */}
      <button
        type="button"
        title={active ? "Auto on — click to turn off" : "Auto (fit visible prices)"}
        aria-label="Auto scale"
        aria-pressed={active}
        style={autoStyle}
        className={`flex items-center justify-center border-0 bg-transparent p-0 text-center text-[11px] leading-none transition-colors duration-100 ${
          active
            ? "font-bold text-white"
            : "font-medium text-[#787b86] hover:text-[#d1d4dc]"
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActivePane(paneId);
          if (active) {
            clearAutoFit(paneId);
            onActiveChange(false);
            return;
          }
          applyAutoFit(paneId);
          onActiveChange(true);
        }}
      >
        auto
      </button>

      {/* Gear / settings menu — to the right of the auto label */}
      <ChartScaleMenu
        paneId={paneId}
        style={gearStyle}
        visibility="opacity-100"
        autoScaleOn={active}
        onAutoChangeAction={onActiveChange}
      />
    </div>
  );
}
