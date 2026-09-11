"use client";

import { getChart } from "@/lib/chart-registry";
import { attachChartLinkedPaint } from "@/lib/chart-linked-paint";
import { formatPrice } from "@/lib/maws/feed";
import { useBrokerBook } from "@/lib/selectors/broker";
import { useAppStore } from "@/lib/store";
import type { ChartPaneState } from "@/types";
import { useEffect, useMemo, useRef } from "react";

type Mark = {
  key: string;
  price: number;
  label: string;
  color: string;
  dash: string;
  onMove: (price: number) => void;
  onRemove: () => void;
};

export function TradeMarks({ pane }: { pane: ChartPaneState }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ key: string; move: (price: number) => void } | null>(null);
  const settings = useAppStore((s) => s.chartSettings);
  const alerts = useAppStore((s) => s.alerts);
  // Exactly one book (live for binance, paper otherwise) — never a mix.
  const { orders, positions } = useBrokerBook();
  const updateAlert = useAppStore((s) => s.updateAlert);
  const removeAlert = useAppStore((s) => s.removeAlert);
  const updateOrder = useAppStore((s) => s.updateOrder);
  const removeOrder = useAppStore((s) => s.removeOrder);
  const updatePosition = useAppStore((s) => s.updatePosition);
  const removePosition = useAppStore((s) => s.removePosition);

  const marks = useMemo(() => {
    const list: Mark[] = [];
    if (settings.showAlertLines) {
      for (const a of alerts) {
        if (a.symbol !== pane.symbol || !a.enabled) continue;
        list.push({
          key: `alert-${a.id}`,
          price: a.price,
          label: `Alert ${a.side === "above" ? "≥" : "≤"} ${formatPrice(a.symbol, a.price)}`,
          color: settings.alertLineColor,
          dash: "6 4",
          onMove: (price) => updateAlert(a.id, { price }),
          onRemove: () => removeAlert(a.id),
        });
      }
    }
    if (settings.showOrderLines) {
      for (const o of orders) {
        if (o.symbol !== pane.symbol) continue;
        const buy = o.side === "buy";
        const kind = o.type === "stop" ? "Stop" : o.type === "market" ? "Market" : "Limit";
        list.push({
          key: `order-${o.id}`,
          price: o.price,
          label: `${buy ? "Buy" : "Sell"} ${kind} ${o.qty}`,
          color: buy ? settings.buyLineColor : settings.sellLineColor,
          dash: o.type === "stop" ? "2 3" : "8 4",
          onMove: (price) => updateOrder(o.id, { price }),
          onRemove: () => removeOrder(o.id),
        });
      }
    }
    for (const p of positions) {
      if (p.symbol !== pane.symbol) continue;
      const long = p.side === "long";
      const color = long ? settings.buyLineColor : settings.sellLineColor;
      if (settings.showPositionLines) {
        list.push({
          key: `pos-${p.id}`,
          price: p.entry,
          label: `${long ? "Long" : "Short"} ${p.qty} @ ${formatPrice(p.symbol, p.entry)}`,
          color,
          dash: "",
          onMove: (price) => updatePosition(p.id, { entry: price }),
          onRemove: () => removePosition(p.id),
        });
      }
      if (settings.showTpSlLines && p.tp != null) {
        list.push({
          key: `tp-${p.id}`,
          price: p.tp,
          label: `TP ${formatPrice(p.symbol, p.tp)}`,
          color: settings.tpLineColor,
          dash: "4 3",
          onMove: (price) => updatePosition(p.id, { tp: price }),
          onRemove: () => updatePosition(p.id, { tp: null }),
        });
      }
      if (settings.showTpSlLines && p.sl != null) {
        list.push({
          key: `sl-${p.id}`,
          price: p.sl,
          label: `SL ${formatPrice(p.symbol, p.sl)}`,
          color: settings.slLineColor,
          dash: "4 3",
          onMove: (price) => updatePosition(p.id, { sl: price }),
          onRemove: () => updatePosition(p.id, { sl: null }),
        });
      }
      if (settings.showLiqLines && p.liq != null) {
        list.push({
          key: `liq-${p.id}`,
          price: p.liq,
          label: `Liq ${p.leverage}x ${formatPrice(p.symbol, p.liq)}`,
          color: settings.liqLineColor,
          dash: "1 4",
          onMove: (price) => updatePosition(p.id, { liq: price }),
          onRemove: () => updatePosition(p.id, { liq: null }),
        });
      }
    }
    return list;
  }, [
    alerts,
    orders,
    positions,
    pane.symbol,
    settings,
    updateAlert,
    removeAlert,
    updateOrder,
    removeOrder,
    updatePosition,
    removePosition,
  ]);

  const marksRef = useRef(marks);
  marksRef.current = marks;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const lastPaintKeyRef = useRef("");

  const paint = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const handle = getChart(pane.id);
    const w = svg.clientWidth || 1;
    const h = svg.clientHeight || 1;
    const s = settingsRef.current;
    const list = marksRef.current;

    // Horizontal pan does not move price lines — skip DOM rewrite when Ys unchanged.
    const ys: number[] = [];
    for (const m of list) {
      const y = handle?.series.priceToCoordinate(m.price);
      ys.push(y == null ? -1 : Math.round(y * 2) / 2);
    }
    const key = `${w}|${h}|${s.extendedPriceLines ? 1 : 0}|${s.orderAlignment}|${ys.join(",")}`;
    if (key === lastPaintKeyRef.current) return;
    lastPaintKeyRef.current = key;

    const nodes: string[] = [];
    for (let i = 0; i < list.length; i++) {
      const m = list[i];
      const y = ys[i];
      if (y < 0 || y < -8 || y > h + 8) continue;
      const dash = m.dash ? `stroke-dasharray="${m.dash}"` : "";
      const full = s.extendedPriceLines;
      const x1 = full ? 0 : Math.max(0, w * 0.35);
      nodes.push(
        `<line data-mark="${m.key}" pointer-events="stroke" x1="${x1}" y1="${y}" x2="${w}" y2="${y}" stroke="${m.color}" stroke-width="8" stroke-opacity="0"/>`,
        `<line pointer-events="none" x1="${x1}" y1="${y}" x2="${w}" y2="${y}" stroke="${m.color}" stroke-width="1.25" ${dash}/>`,
      );
      const tag = escapeXml(m.label);
      const tw = Math.min(220, 10 + tag.length * 6.2);
      const x = s.orderAlignment === "left" ? 8 : Math.max(8, w - tw - 58);
      nodes.push(
        `<g data-mark="${m.key}" pointer-events="all" cursor="ns-resize">
            <rect x="${x}" y="${y - 9}" width="${tw}" height="18" rx="2" fill="#000" stroke="${m.color}"/>
            <text x="${x + 6}" y="${y + 4}" fill="${m.color}" font-size="11" font-family="Trebuchet MS">${tag}</text>
          </g>`,
        `<g data-remove="${m.key}" pointer-events="all" cursor="pointer">
            <rect x="${x + tw - 16}" y="${y - 8}" width="14" height="16" fill="transparent"/>
            <text x="${x + tw - 13}" y="${y + 4}" fill="#787b86" font-size="11">×</text>
          </g>`,
      );
    }
    svg.innerHTML = nodes.join("");
  };

  useEffect(() => {
    lastPaintKeyRef.current = "";
    return attachChartLinkedPaint({
      paneId: pane.id,
      getChart,
      paint,
      observeEl: svgRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pane.id, marks, settings.extendedPriceLines, settings.orderAlignment]);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
      onMouseDown={(e) => {
        const target = e.target as SVGElement;
        const removeKey = target.closest("[data-remove]")?.getAttribute("data-remove");
        if (removeKey) {
          e.preventDefault();
          e.stopPropagation();
          marksRef.current.find((m) => m.key === removeKey)?.onRemove();
          return;
        }
        const key = target.closest("[data-mark]")?.getAttribute("data-mark");
        const mark = marksRef.current.find((m) => m.key === key);
        if (!mark) return;
        e.preventDefault();
        e.stopPropagation();
        drag.current = { key: mark.key, move: mark.onMove };
        const move = (ev: MouseEvent) => {
          const y = ev.clientY - (svgRef.current?.getBoundingClientRect().top ?? 0);
          const price = getChart(pane.id)?.series.coordinateToPrice(y);
          if (price == null) return;
          drag.current?.move(price);
          paint();
        };
        const up = () => {
          drag.current = null;
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
      }}
    />
  );
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
