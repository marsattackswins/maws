"use client";

import { getChart } from "@/lib/chart-registry";
import {
  computeAdx,
  computeAtr,
  computeEmaPlot,
  computePmo,
  computeRsi,
  computeStochastic,
  computeVwapPlot,
  indicatorTitle,
  PANE_INDICATORS,
} from "@/lib/indicators";
import { formatPrice, mawsFeed } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { newClientOrderId, submitOrderFromUi } from "@/lib/trading/ui-orders";
import { resolveOrderQty } from "@/lib/trading/symbol-settings";
import type {
  AdxIndicatorSettings,
  AtrIndicatorSettings,
  ChartHover,
  ChartPaneState,
  EmaIndicatorSettings,
  IndicatorInstance,
  PmoIndicatorSettings,
  RsiIndicatorSettings,
  StochIndicatorSettings,
  VwapIndicatorSettings,
} from "@/types";
import { AlarmClock, ChevronsDown, ChevronsUp, Minus, Plus } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TIME_AXIS_PAD = 28;

function studyValue(
  pane: ChartPaneState,
  time: number | null,
): { names: string; value: string } | null {
  const enabled =
    pane.studies.filter((s) => !s.hidden && PANE_INDICATORS.includes(s.type))[0] ??
    pane.studies.find((s) => !s.hidden) ??
    null;
  if (!enabled) return null;
  return formatStudyRaw(pane, enabled, time);
}

function formatStudyRaw(
  pane: ChartPaneState,
  study: IndicatorInstance,
  time: number | null,
): { names: string; value: string } | null {
  const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
  if (candles.length === 0) return null;
  let idx = candles.length - 1;
  if (time != null) {
    for (let i = candles.length - 1; i >= 0; i--) {
      if (candles[i].time <= time) {
        idx = i;
        break;
      }
    }
  }
  const slice = candles.slice(0, idx + 1);
  const names = indicatorTitle(study.type, pane.symbol);

  if (study.type === "rsi") {
    const s = study.settings as RsiIndicatorSettings;
    const vals = computeRsi(slice, s.period);
    const v = vals[vals.length - 1];
    return v == null ? null : { names, value: v.toFixed(2) };
  }
  if (study.type === "stoch") {
    const s = study.settings as StochIndicatorSettings;
    const { k, d } = computeStochastic(slice, s.length, s.kSmoothing, s.dSmoothing);
    const kv = k[k.length - 1];
    const dv = d[d.length - 1];
    if (kv == null || dv == null) return null;
    return { names, value: `${kv.toFixed(1)} / ${dv.toFixed(1)}` };
  }
  if (study.type === "atr") {
    const s = study.settings as AtrIndicatorSettings;
    const vals = computeAtr(slice, s.period);
    const v = vals[vals.length - 1];
    return v == null ? null : { names, value: formatPrice(pane.symbol, v) };
  }
  if (study.type === "adx") {
    const s = study.settings as AdxIndicatorSettings;
    const vals = computeAdx(slice, s.period);
    const v = vals[vals.length - 1];
    return v == null ? null : { names, value: v.toFixed(2) };
  }
  if (study.type === "pmo") {
    const s = study.settings as PmoIndicatorSettings;
    const { pmo, signal } = computePmo(slice, s.period1, s.period2, s.signalPeriod, s.source);
    const pmoV = pmo[pmo.length - 1];
    const sigV = signal[signal.length - 1];
    if (pmoV == null || sigV == null) return null;
    return { names, value: `${pmoV.toFixed(2)} / ${sigV.toFixed(2)}` };
  }
  if (study.type === "ema") {
    const s = study.settings as EmaIndicatorSettings;
    const plot = computeEmaPlot(slice, s);
    const v = plot.line[plot.line.length - 1];
    return v == null ? null : { names, value: formatPrice(pane.symbol, v) };
  }
  if (study.type === "vwap") {
    const s = study.settings as VwapIndicatorSettings;
    const vals = computeVwapPlot(slice, s, pane.timeframe);
    const v = vals[vals.length - 1];
    return v == null ? null : { names, value: formatPrice(pane.symbol, v) };
  }
  return null;
}

function OrderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 11.5h8M2 8h5M2 4.5h11" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 3.5v6M8.5 6.5 11 3.5 13.5 6.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Owns its own hover tracking so ChartPane (and heavy siblings) do not
 * re-render on every mouse move.
 */
export function CrosshairPlus({ pane, suppress }: { pane: ChartPaneState; suppress?: boolean }) {
  const setBuySellMenu = useAppStore((s) => s.setBuySellMenu);
  const setTradingSettingsSymbol = useAppStore((s) => s.setTradingSettingsSymbol);
  const addAlert = useAppStore((s) => s.addAlert);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<ChartHover>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);
  const openRef = useRef(false);
  const overPlusRef = useRef(false);
  openRef.current = open;

  useEffect(() => {
    const lastTimeRef = { current: null as number | null };
    const rectCache = { current: null as DOMRect | null, at: 0 };
    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    const clearHover = () => {
      if (openRef.current || overPlusRef.current) return;
      setHover(null);
      try {
        getChart(pane.id)?.chart.clearCrosshairPosition();
      } catch {
        /* ignore */
      }
    };

    const updateFromClient = (clientX: number, clientY: number) => {
      if (openRef.current) return;
      const handle = getChart(pane.id);
      if (!handle) return;
      const el = handle.chart.chartElement();
      const now = performance.now();
      let rect = rectCache.current;
      if (!rect || now - rectCache.at > 200) {
        rect = el.getBoundingClientRect();
        rectCache.current = rect;
        rectCache.at = now;
      }

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom - TIME_AXIS_PAD
      ) {
        clearHover();
        return;
      }

      const y = clientY - rect.top;
      const x = clientX - rect.left;
      const price = handle.series.coordinateToPrice(y);
      if (price == null || !Number.isFinite(Number(price))) {
        clearHover();
        return;
      }

      const axisWidth = Math.max(handle.chart.priceScale("right").width(), 54);
      const inPriceAxis = x >= rect.width - axisWidth;
      const plotX = Math.min(x, Math.max(0, rect.width - axisWidth - 1));
      const timeRaw = handle.chart.timeScale().coordinateToTime(plotX);
      if (typeof timeRaw === "number") lastTimeRef.current = timeRaw;

      // Only programmatically set the crosshair when we have a real bar time, or when the
      // pointer is over the price scale (so +/- controls can keep a price line). Never pin
      // the vertical line to the last candle while the mouse is in right-side whitespace.
      if (typeof timeRaw === "number") {
        try {
          handle.chart.setCrosshairPosition(Number(price), timeRaw as never, handle.series);
        } catch {
          /* ignore */
        }
      } else if (inPriceAxis && lastTimeRef.current != null) {
        try {
          handle.chart.setCrosshairPosition(
            Number(price),
            lastTimeRef.current as never,
            handle.series,
          );
        } catch {
          /* ignore */
        }
      }

      const time =
        typeof timeRaw === "number"
          ? timeRaw
          : inPriceAxis
            ? lastTimeRef.current
            : null;

      const next = { price: Number(price), time, y, axisWidth };
      setHover((prev) => {
        if (
          prev &&
          Math.abs(prev.y - next.y) < 0.25 &&
          prev.price === next.price &&
          prev.time === next.time &&
          prev.axisWidth === next.axisWidth
        ) {
          return prev;
        }
        return next;
      });
    };

    const onMove = (e: MouseEvent) => {
      // User is panning/zooming the chart — don't fight LWC with extra crosshair work.
      if (e.buttons) {
        if (!openRef.current) setHover(null);
        return;
      }
      // Hide plus button when cursor enters the maximize button zone.
      // Use bounding-rect hit test because the plus portal sits on top and
      // blocks elementFromPoint from seeing the zone underneath.
      const zones = document.querySelectorAll("[data-maximize-zone]");
      for (const z of zones) {
        const r = z.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          clearHover();
          return;
        }
      }
      // Suppress crosshair while pointer is inside any open dropdown / settings panel.
      const menuZones = document.querySelectorAll("[data-dropdown-open]");
      for (const z of menuZones) {
        const r = z.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          clearHover();
          return;
        }
      }
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateFromClient(pendingX, pendingY);
      });
    };

    const invalidateRect = () => {
      rectCache.current = null;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", invalidateRect);
    window.addEventListener("scroll", invalidateRect, true);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", invalidateRect);
      window.removeEventListener("scroll", invalidateRect, true);
      if (raf) cancelAnimationFrame(raf);
      try {
        getChart(pane.id)?.chart.clearCrosshairPosition();
      } catch {
        /* ignore */
      }
    };
  }, [pane.id]);

  useLayoutEffect(() => {
    if (!hover) {
      setAnchor(null);
      return;
    }
    const host = getChart(pane.id)?.chart.chartElement();
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const axis = hover.axisWidth || 56;
    setAnchor({
      left: rect.right - axis - 28,
      top: rect.top + hover.y - 12,
    });
  }, [hover, pane.id]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-crosshair-plus]")) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!hover || !anchor || suppress) return null;

  const study = open ? studyValue(pane, hover.time) : null;
  const price = formatPrice(pane.symbol, hover.price);
  const side: "above" | "below" = "above";

  return createPortal(
    <>
      <button
        type="button"
        data-crosshair-plus
        className="fixed z-[35] flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#2a2e39] bg-[#1b1b1b] text-[#d1d4dc] shadow-[0_2px_8px_rgba(0,0,0,0.45)] hover:bg-[#252525]"
        style={{ left: anchor.left, top: anchor.top }}
        onMouseEnter={() => {
          overPlusRef.current = true;
        }}
        onMouseLeave={() => {
          overPlusRef.current = false;
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <Plus size={14} />
      </button>
      {open && (
        <div
          ref={wrapRef}
          data-crosshair-plus
          className="fixed z-[80] w-[220px] rounded-[8px] border border-[#2a2e39] bg-[#1b1b1b] py-1 shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
          style={{ left: Math.max(8, anchor.left - 200), top: anchor.top + 28 }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseEnter={() => {
            overPlusRef.current = true;
          }}
          onMouseLeave={() => {
            overPlusRef.current = false;
          }}
        >
          {study && (
            <div className="border-b border-[#2a2e39] px-3 py-2 text-[11px] text-[#787b86]">
              <div className="truncate text-[#d1d4dc]">{study.names}</div>
              <div>{study.value}</div>
            </div>
          )}
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              const qty = resolveOrderQty(pane.symbol, hover.price);
              if (qty > 0) {
                submitOrderFromUi({
                  symbol: pane.symbol,
                  side: "buy",
                  type: "market",
                  qty,
                  price: hover.price,
                  clientOrderId: newClientOrderId(),
                });
              }
              setOpen(false);
            }}
          >
            <ChevronsUp size={14} className="text-[#089981]" />
            <span className="plus-row-label">Buy {price}</span>
          </button>
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              const qty = resolveOrderQty(pane.symbol, hover.price);
              if (qty > 0) {
                submitOrderFromUi({
                  symbol: pane.symbol,
                  side: "sell",
                  type: "market",
                  qty,
                  price: hover.price,
                  clientOrderId: newClientOrderId(),
                });
              }
              setOpen(false);
            }}
          >
            <ChevronsDown size={14} className="text-[#f23645]" />
            <span className="plus-row-label">Sell {price}</span>
          </button>
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              setBuySellMenu({ x: anchor.left, y: anchor.top, symbol: pane.symbol });
              setOpen(false);
            }}
          >
            <OrderIcon />
            <span className="plus-row-label">Trade…</span>
          </button>
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              addAlert({ symbol: pane.symbol, price: hover.price, side, enabled: true });
              setOpen(false);
            }}
          >
            <AlarmClock size={14} />
            <span className="plus-row-label">Add alert at {price}</span>
          </button>
          <button
            type="button"
            className="plus-row"
            onClick={() => {
              setTradingSettingsSymbol(pane.symbol);
              setOpen(false);
            }}
          >
            <Minus size={14} />
            <span className="plus-row-label">Trading settings…</span>
          </button>
        </div>
      )}
    </>,
    document.body,
  );
}
