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

/** Measure the LWC bottom-right scale corner cell so the label fills it. */
function measureAutoCorner(host: HTMLElement, paneId: string): CornerBox {
  const hostRect = host.getBoundingClientRect();
  const tables = host.querySelectorAll("table");
  // Prefer the outermost chart table (first match in the host).
  const table = tables[0];
  if (table) {
    const lastRow = table.rows[table.rows.length - 1];
    const lastCell = lastRow?.cells[lastRow.cells.length - 1];
    if (lastCell) {
      const r = lastCell.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return {
          left: Math.round(r.left - hostRect.left),
          top: Math.round(r.top - hostRect.top),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      }
    }
  }

  const width = rightAxisWidth(paneId);
  return {
    left: Math.round(hostRect.width - width),
    top: Math.round(hostRect.height - TIME_AXIS_H),
    width,
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
  const rect = host.getBoundingClientRect();
  const rightW = rightAxisWidth(paneId);
  return clientX >= rect.right - rightW && clientY >= rect.bottom - TIME_AXIS_H;
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

  if (mode === "never") return null;

  const visibility =
    mode === "always"
      ? "opacity-100"
      : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto";


  // The gear button sits in the RIGHT portion of the corner cell.
  // Width split: auto label fills the left, gear takes ~20px on the right.
  const GEAR_W = 20;
  const autoStyle: CSSProperties = {
    left: corner.left,
    top: corner.top,
    width: corner.width - GEAR_W,
    height: corner.height,
  };
  const gearStyle: CSSProperties = {
    left: corner.left + corner.width - GEAR_W,
    top: corner.top,
    width: GEAR_W,
    height: corner.height,
    position: "absolute",
  };

  return (
    <>
      {/* Auto label */}
      <button
        type="button"
        title={active ? "Auto on — click to turn off" : "Auto (fit visible prices)"}
        aria-label="Auto scale"
        aria-pressed={active}
        style={autoStyle}
        className={`absolute z-40 flex items-center justify-center border-0 bg-transparent p-0 text-center text-[11px] leading-none transition-colors duration-100 ${visibility} ${
          active
            ? "font-bold text-white"
            : "font-medium text-[#787b86] hover:text-[#d1d4dc]"
        }`}
        onMouseDown={(e: ReactMouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }}
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
        visibility={visibility}
        autoScaleOn={active}
        onAutoChangeAction={onActiveChange}
      />
    </>
  );
}
