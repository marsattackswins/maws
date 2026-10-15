"use client";

/**
 * TradeMarks.tsx — Vela implementation.
 *
 * Position entry / TP / SL / liquidation / alert / order lines are Vela user
 * drawings (`hline`) owned by this component. Vela emits the new price on drag
 * (`drawing:edited`); the existing MAWS dispatch layer validates and executes
 * (live → /api/live/protect via dispatchProtect, paper → the paper engine), and
 * Vela is updated only from the confirmed broker state that flows back through
 * the store. Risk/reward zones paint through the `maws-trade-zones` renderer
 * layer. Vela never sees broker credentials or executes orders directly.
 */

import { useEffect, useMemo, useRef } from "react";
import { getChart } from "@/lib/chart-registry";
import { mawsFeed } from "@/lib/maws/feed";
import { formatPrice } from "@/lib/maws/feed";
import { useBrokerBook } from "@/lib/selectors/broker";
import { useAppStore } from "@/lib/store";
import { dispatchProtect, dispatchCancelOrder } from "@/lib/trading/dispatch";
import { findProtectiveOrderId } from "@/lib/trade-marks";
import type { TradeZonesData } from "@/lib/vela-layers";
import type { DrawingStyle } from "@/lib/charting";
import type { ChartPaneState } from "@/types";

type Mark = {
  key: string;
  price: number;
  label: string;
  color: string;
  lineStyle: DrawingStyle["lineStyle"];
  onMove: (price: number) => void;
  onRemove: () => void;
};

function dashToStyle(dash: string): DrawingStyle["lineStyle"] {
  if (dash === "2 3" || dash === "1 4") return "dotted";
  if (dash === "4 3" || dash === "6 4" || dash === "8 4") return "dashed";
  return "solid";
}

const TRADE_LAYER = "maws-trade-zones";

export function TradeMarks({ pane }: { pane: ChartPaneState }) {
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
  const replay = useAppStore((s) => s.replay);
  const live = useAppStore((s) => s.connectedBroker) === "binance";
  const busy = useRef(false);

  const replaying = replay?.paneId === pane.id;

  const marks = useMemo<Mark[]>(() => {
    const list: Mark[] = [];
    if (settings.showAlertLines) {
      for (const a of alerts) {
        if (a.symbol !== pane.symbol || !a.enabled) continue;
        list.push({
          key: `alert-${a.id}`,
          price: a.price,
          label: `Alert ${a.side === "above" ? "≥" : "≤"} ${formatPrice(a.symbol, a.price)}`,
          color: settings.alertLineColor,
          lineStyle: "dashed",
          onMove: (price) => updateAlert(a.id, { price }),
          onRemove: () => removeAlert(a.id),
        });
      }
    }
    if (settings.showOrderLines) {
      for (const o of orders) {
        if (o.symbol !== pane.symbol) continue;
        const buy = o.side === "buy";
        list.push({
          key: `order-${o.id}`,
          price: o.price,
          label: `${buy ? "Buy" : "Sell"} ${o.type === "stop" ? "Stop" : o.type === "market" ? "Market" : "Limit"} ${o.qty}`,
          color: buy ? settings.buyLineColor : settings.sellLineColor,
          lineStyle: o.type === "stop" ? "dotted" : "dashed",
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
          lineStyle: "solid",
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
          lineStyle: "dashed",
          onMove: (price) => {
            if (live) {
              if (busy.current) return;
              busy.current = true;
              void dispatchProtect(p.symbol, price, p.sl).finally(() => {
                busy.current = false;
              });
            } else {
              updatePosition(p.id, { tp: price });
            }
          },
          onRemove: () => {
            if (live) {
              const orderId = findProtectiveOrderId(
                orders.map((o) => ({ id: o.id, symbol: o.symbol, closePosition: (o as { closePosition?: boolean }).closePosition === true, price: o.price })),
                p.symbol,
                "tp",
                p.tp,
                p.sl,
              );
              if (orderId) void dispatchCancelOrder(orderId);
            } else {
              updatePosition(p.id, { tp: null });
            }
          },
        });
      }
      if (settings.showTpSlLines && p.sl != null) {
        list.push({
          key: `sl-${p.id}`,
          price: p.sl,
          label: `SL ${formatPrice(p.symbol, p.sl)}`,
          color: settings.slLineColor,
          lineStyle: "dashed",
          onMove: (price) => {
            if (live) {
              if (busy.current) return;
              busy.current = true;
              void dispatchProtect(p.symbol, p.tp, price).finally(() => {
                busy.current = false;
              });
            } else {
              updatePosition(p.id, { sl: price });
            }
          },
          onRemove: () => {
            if (live) {
              const orderId = findProtectiveOrderId(
                orders.map((o) => ({ id: o.id, symbol: o.symbol, closePosition: (o as { closePosition?: boolean }).closePosition === true, price: o.price })),
                p.symbol,
                "sl",
                p.tp,
                p.sl,
              );
              if (orderId) void dispatchCancelOrder(orderId);
            } else {
              updatePosition(p.id, { sl: null });
            }
          },
        });
      }
      if (settings.showLiqLines && p.liq != null) {
        list.push({
          key: `liq-${p.id}`,
          price: p.liq,
          label: `Liq ${p.leverage}x ${formatPrice(p.symbol, p.liq)}`,
          color: settings.liqLineColor,
          lineStyle: "dotted",
          onMove: (price) => updatePosition(p.id, { liq: price }),
          onRemove: () => updatePosition(p.id, { liq: null }),
        });
      }
    }
    return list;
  }, [
    alerts, orders, positions, pane.symbol, settings, live,
    updateAlert, removeAlert, updateOrder, removeOrder, updatePosition, removePosition,
  ]);

  const marksRef = useRef(marks);
  marksRef.current = marks;
  const replayingRef = useRef(replaying);
  replayingRef.current = replaying;
  /** markKey → Vela drawing id */
  const idsRef = useRef<Map<string, string>>(new Map());
  /** Drawing ids being rewritten by THIS component (suppress drag echo). */
  const syncingRef = useRef<Set<string>>(new Set());

  // Sync store state → Vela drawings (add / update / remove / show-hide).
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer = 0;

    const apply = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(apply, 250);
        return;
      }
      tries = 0;
      const { vela } = handle;
      const live = vela.drawings.all();
      const byId = new Map(live.map((d) => [d.id, d]));
      const ids = idsRef.current;

      // Drop mappings whose drawing disappeared (chart remount).
      for (const [key, id] of [...ids]) {
        if (!byId.has(id)) ids.delete(key);
      }
      // Remove drawings whose mark is gone.
      const keys = new Set(marksRef.current.map((m) => m.key));
      for (const [key, id] of [...ids]) {
        if (keys.has(key)) continue;
        ids.delete(key);
        try {
          vela.drawings.remove(id);
        } catch {
          /* already gone */
        }
      }
      // Add / update.
      const now = Date.now();
      for (const m of marksRef.current) {
        const existingId = ids.get(m.key);
        const existing = existingId ? byId.get(existingId) : undefined;
        if (existing) {
          const anchor = existing.anchors[0];
          if (anchor && Math.abs(anchor.price - m.price) > 1e-12) {
            syncingRef.current.add(existing.id);
            try {
              vela.drawings.update(existing.id, {
                anchors: [{ time: anchor.time, price: m.price }],
              });
            } catch {
              /* ignore */
            }
          }
          if (existing.style.lineColor !== m.color) {
            syncingRef.current.add(existing.id);
            try {
              vela.drawings.update(existing.id, {
                style: { ...existing.style, lineColor: m.color, lineStyle: m.lineStyle },
              });
            } catch {
              /* ignore */
            }
          }
          // Replay hides every trade visual; replay end restores them.
          if (existing.visible === replayingRef.current) {
            syncingRef.current.add(existing.id);
            try {
              vela.drawings.show(existing.id, !replayingRef.current);
            } catch {
              /* ignore */
            }
          }
          continue;
        }
        try {
          const created = vela.drawings.add("hline", {
            paneId: "price",
            anchors: [{ time: now, price: m.price }],
            style: { lineColor: m.color, lineWidth: 1, lineStyle: m.lineStyle },
            text: { value: m.label, size: "tiny", hAlign: "right", vAlign: "center" },
          });
          if (created) {
            ids.set(m.key, created.id);
            if (replayingRef.current) vela.drawings.show(created.id, false);
          }
        } catch {
          /* renderer not ready yet — retried on next marks change */
        }
      }
    };

    apply();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [pane.id, marks, replaying]);

  // Vela → store: drag events on our lines.
  useEffect(() => {
    let tries = 0;
    let timer = 0;
    let cancelled = false;
    let offs: Array<() => void> = [];

    const attach = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(attach, 250);
        return;
      }
      const { vela } = handle;

      const onEdited = () => {
        if (replayingRef.current) return;
        const ids = idsRef.current;
        const all = vela.drawings.all();
        for (const [key, id] of ids) {
          if (syncingRef.current.has(id)) continue;
          const doc = all.find((d) => d.id === id);
          if (!doc) continue;
          const price = doc.anchors[0]?.price;
          if (price == null) continue;
          const mark = marksRef.current.find((m) => m.key === key);
          if (!mark) continue;
          if (Math.abs(mark.price - price) < 1e-12) continue;
          // Vela emitted the new price → MAWS validates/executes; the confirmed
          // broker state flows back through the store and re-syncs Vela.
          mark.onMove(price);
        }
        syncingRef.current.clear();
      };

      const onRemoved = (payload: { id: string }) => {
        const id = payload.id;
        const ids = idsRef.current;
        for (const [key, vid] of [...ids]) {
          if (vid !== id) continue;
          ids.delete(key);
          if (replayingRef.current) return;
          marksRef.current.find((m) => m.key === key)?.onRemove();
        }
      };

      offs = [vela.on("drawing:edited", onEdited), vela.on("drawing:removed", onRemoved)];
    };

    attach();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      for (const off of offs) off();
    };
  }, [pane.id]);

  // Risk/reward zones → renderer layer payload (hidden during replay).
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer = 0;
    const push = () => {
      if (cancelled) return;
      const handle = getChart(pane.id);
      if (!handle) {
        if (tries++ < 120) timer = window.setTimeout(push, 250);
        return;
      }
      const bands = !settings.showTpSlLines || replaying
        ? []
        : positions
            .filter((p) => p.symbol === pane.symbol)
            .flatMap((p) => {
              const out: TradeZonesData["bands"] = [];
              if (p.tp != null) out.push({ entry: p.entry, other: p.tp, color: settings.tpLineColor });
              if (p.sl != null) out.push({ entry: p.entry, other: p.sl, color: settings.slLineColor });
              return out;
            });
      try {
        handle.renderer.setNativeData(TRADE_LAYER, { bands } satisfies TradeZonesData);
      } catch {
        /* ignore */
      }
    };
    push();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [pane.id, positions, pane.symbol, settings.showTpSlLines, settings.tpLineColor, settings.slLineColor, replaying, mawsFeed]);

  // Vela owns rendering — no DOM output.
  return null;
}
