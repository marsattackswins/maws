"use client";

import { getChart } from "@/lib/chart-registry";
import { formatPrice } from "@/lib/maws/feed";
import { useAppStore } from "@/lib/store";
import { newClientOrderId, submitOrderFromUi } from "@/lib/trading/ui-orders";
import { resolveOrderQty, formatMarginLabel } from "@/lib/trading/symbol-settings";
import { TV } from "@/lib/theme";
import {
  AlarmClock,
  ChevronRight,
  ClipboardPaste,
  Copy,
  Lock,
  RotateCcw,
  Settings,
  Table2,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

function Item({
  label,
  shortcut,
  icon,
  onClick,
  trailing,
}: {
  label: string;
  shortcut?: string;
  icon?: ReactNode;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <button type="button" className="ctx-item" onClick={onClick}>
      <span className="ctx-ico">{icon ?? null}</span>
      <span className="ctx-body">
        <span className="ctx-label">{label}</span>
        {shortcut ? <span className="ctx-shortcut">{shortcut}</span> : null}
      </span>
      {trailing ? <span className="ctx-trail">{trailing}</span> : null}
    </button>
  );
}

function SellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5.5 7 10l4-4.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BuyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 8.5 7 4l4 4.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ChartContextMenu() {
  const menu = useAppStore((s) => s.contextMenu);
  const setContextMenu = useAppStore((s) => s.setContextMenu);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const setRightDock = useAppStore((s) => s.setRightDock);
  const addAlert = useAppStore((s) => s.addAlert);
  const setClipboardPrice = useAppStore((s) => s.setClipboardPrice);
  const clipboardPrice = useAppStore((s) => s.clipboardPrice);
  const addDrawing = useAppStore((s) => s.addDrawing);
  const clearDrawings = useAppStore((s) => s.clearDrawings);
  const clearIndicators = useAppStore((s) => s.clearIndicators);
  const setRange = useAppStore((s) => s.setRange);
  const vertCursorLocked = useAppStore((s) => s.vertCursorLocked);
  const setVertCursorLocked = useAppStore((s) => s.setVertCursorLocked);
  const setLockedCursorTime = useAppStore((s) => s.setLockedCursorTime);
  const templates = useAppStore((s) => s.chartTemplates);
  const applyChartTemplate = useAppStore((s) => s.applyChartTemplate);
  const saveChartTemplate = useAppStore((s) => s.saveChartTemplate);
  const [tplOpen, setTplOpen] = useState(false);
  const pane = useAppStore((s) =>
    menu ? s.panes.find((p) => p.id === menu.paneId) : undefined,
  );

  useEffect(() => {
    if (!menu) return;
    const close = () => setContextMenu(null);
    const timer = window.setTimeout(() => {
      window.addEventListener("mousedown", close);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousedown", close);
    };
  }, [menu, setContextMenu]);

  useEffect(() => {
    setTplOpen(false);
  }, [menu]);

  if (!menu || !pane) return null;

  const close = () => setContextMenu(null);
  const price = menu.price;
  const priceLabel = formatPrice(pane.symbol, price);
  const drawings = pane.drawings.length;
  const indicators = pane.studies.length;

  const resetChart = () => {
    getChart(pane.id)?.chart.timeScale().fitContent();
    getChart(pane.id)?.chart.priceScale("right").setAutoScale(true);
    setRange("All");
  };

  const pastePrice = async () => {
    let value = clipboardPrice;
    try {
      const text = await navigator.clipboard.readText();
      const n = Number(text.replace(/,/g, ""));
      if (Number.isFinite(n) && n > 0) value = n;
    } catch {
      /* stored */
    }
    if (value == null) return;
    const t = menu.time ?? Math.floor(Date.now() / 1000);
    addDrawing(pane.id, {
      id: Math.random().toString(36).slice(2, 10),
      tool: "hray",
      points: [{ time: t, price: value }],
      color: TV.blue,
    });
  };

  const addOrderAlert = (side: "above" | "below") => {
    addAlert({ symbol: pane.symbol, price, side, enabled: true });
    setRightDock("alerts");
  };

  const marginLabel = formatMarginLabel(pane.symbol);
  const place = (side: "buy" | "sell", type: "limit" | "stop") => {
    submitOrderFromUi({
      symbol: pane.symbol,
      side,
      type,
      price,
      qty: resolveOrderQty(pane.symbol, price),
      clientOrderId: newClientOrderId(),
    });
  };

  const style: CSSProperties = {
    left: Math.min(menu.x, window.innerWidth - 316),
    top: Math.min(menu.y, window.innerHeight - 520),
  };

  return (
    <div
      className="ctx-menu"
      style={style}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Item
        icon={<RotateCcw size={15} />}
        label="Reset chart view"
        shortcut="Alt + R"
        onClick={() => {
          resetChart();
          close();
        }}
      />
      <div className="ctx-sep" />
      <Item
        icon={<ClipboardPaste size={15} />}
        label="Paste"
        shortcut="Ctrl + V"
        onClick={() => {
          void pastePrice();
          close();
        }}
      />
      <Item
        icon={<Copy size={15} />}
        label={`Copy price ${priceLabel}`}
        onClick={() => {
          setClipboardPrice(price);
          void navigator.clipboard.writeText(String(price));
          close();
        }}
      />
      <Item
        icon={<AlarmClock size={15} />}
        label={`Add alert on ${pane.symbol} at ${priceLabel}…`}
        shortcut="Alt + A"
        onClick={() => {
          addOrderAlert("above");
          close();
        }}
      />
      <Item
        icon={<SellIcon />}
        label={`Sell ${marginLabel} ${pane.symbol} @ ${priceLabel} stop`}
        shortcut="Alt + Shift + S"
        onClick={() => {
          place("sell", "stop");
          close();
        }}
      />
      <Item
        icon={<BuyIcon />}
        label={`Buy ${marginLabel} ${pane.symbol} @ ${priceLabel} limit`}
        onClick={() => {
          place("buy", "limit");
          close();
        }}
      />
      <Item
        icon={<AlarmClock size={15} />}
        label={`Add order on ${pane.symbol} at ${priceLabel}…`}
        shortcut="Shift + T"
        onClick={() => {
          place("buy", "limit");
          close();
        }}
      />
      <div className="ctx-sep" />
      <Item
        icon={<Lock size={15} />}
        label="Lock vertical cursor line by time"
        onClick={() => {
          const next = !vertCursorLocked;
          setVertCursorLocked(next);
          setLockedCursorTime(next ? menu.time : null);
          close();
        }}
      />
      <div className="ctx-sep" />
      <div className="ctx-split">
        <button
          type="button"
          className="ctx-item ctx-item-half"
          onClick={() => {
            setRightDock("strategy");
            close();
          }}
        >
          <span className="ctx-ico">
            <Table2 size={15} />
          </span>
          <span className="ctx-body">
            <span className="ctx-label">Table view</span>
          </span>
        </button>
        <button
          type="button"
          className="ctx-item ctx-item-half"
          onClick={() => {
            setRightDock("objects");
            close();
          }}
        >
          <span className="ctx-body">
            <span className="ctx-label">Object tree</span>
          </span>
        </button>
      </div>
      <div className="relative">
        <Item
          label="Chart template"
          trailing={<ChevronRight size={14} />}
          onClick={() => setTplOpen(!tplOpen)}
        />
        {tplOpen && (
          <div className="ctx-sub">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                className="ctx-item"
                onClick={() => {
                  applyChartTemplate(t.id);
                  close();
                }}
              >
                <span className="ctx-body">
                  <span className="ctx-label">{t.name}</span>
                </span>
              </button>
            ))}
            <button
              type="button"
              className="ctx-item"
              onClick={() => {
                const name = window.prompt("Template name", "My template");
                if (name) saveChartTemplate(name);
                close();
              }}
            >
              <span className="ctx-body">
                <span className="ctx-label">Save current…</span>
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="ctx-sep" />
      <Item
        label={`Remove ${drawings} drawings`}
        onClick={() => {
          clearDrawings(pane.id);
          close();
        }}
      />
      <Item
        label={`Remove ${indicators} indicators`}
        onClick={() => {
          clearIndicators(pane.id);
          close();
        }}
      />
      <div className="ctx-sep" />
      <Item
        icon={<Settings size={15} />}
        label="Settings…"
        onClick={() => {
          setSettingsOpen(true);
          close();
        }}
      />
    </div>
  );
}
