"use client";

import { ColResize, useColumnWidths } from "@/components/ui/ResizableColumns";
import { formatPrice } from "@/lib/maws/feed";
import { formatTicker } from "@/lib/maws/universe";
import { useActivePane, useAppStore } from "@/lib/store";
import { useQuote } from "@/lib/use-quotes";
import { BellPlus, Trash2 } from "lucide-react";
import { useState } from "react";

export function AlertsPanel() {
  const pane = useActivePane();
  const quote = useQuote(pane.symbol);
  const alerts = useAppStore((s) => s.alerts);
  const addAlert = useAppStore((s) => s.addAlert);
  const toggleAlert = useAppStore((s) => s.toggleAlert);
  const removeAlert = useAppStore((s) => s.removeAlert);
  const [price, setPrice] = useState("");
  const [side, setSide] = useState<"above" | "below">("above");
  const { template, onResize } = useColumnWidths("alerts", [28, 100, 90, 72, 28]);

  const fired = (target: number, s: "above" | "below") => {
    if (!quote) return false;
    return s === "above" ? quote.last >= target : quote.last <= target;
  };

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ color: "var(--maws-text)" }}>
      <div
        className="flex h-8 items-center border-b px-2 text-[13px] font-semibold"
        style={{ borderColor: "var(--maws-border)" }}
      >
        Alerts
      </div>
      <div className="border-b px-2 py-2" style={{ borderColor: "var(--maws-border)" }}>
        <div className="mb-1 text-[11px]" style={{ color: "var(--maws-muted)" }}>
          {formatTicker(pane.symbol)} last {quote ? formatPrice(pane.symbol, quote.last) : "—"}
        </div>
        <div className="flex gap-1">
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as "above" | "below")}
            className="h-7 border px-1 text-[12px]"
            style={{
              borderColor: "var(--maws-border)",
              background: "var(--maws-bg)",
              color: "var(--maws-text)",
            }}
          >
            <option value="above">Crossing up</option>
            <option value="below">Crossing down</option>
          </select>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="h-7 w-full border px-2 text-[12px] outline-none"
            style={{
              borderColor: "var(--maws-border)",
              background: "var(--maws-bg)",
              color: "var(--maws-text)",
            }}
          />
          <button
            type="button"
            className="flex h-7 items-center gap-1 bg-[#2962ff] px-2 text-[11px] text-white"
            onClick={() => {
              const value = Number(price) || quote?.last;
              if (!value) return;
              addAlert({ symbol: pane.symbol, price: value, side, enabled: true });
              setPrice("");
            }}
          >
            <BellPlus size={12} />
            Add
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div
          className="sticky top-0 z-10 grid border-b px-2 py-1 text-[10px] uppercase"
          style={{
            gridTemplateColumns: template,
            minWidth: "max-content",
            borderColor: "var(--maws-border)",
            background: "var(--maws-panel)",
            color: "var(--maws-muted)",
          }}
        >
          <span className="relative pr-1">
            On
            <ColResize onMouseDown={onResize(0, 22)} />
          </span>
          <span className="relative truncate pr-1">
            Symbol
            <ColResize onMouseDown={onResize(1, 56)} />
          </span>
          <span className="relative truncate pr-1">
            Condition
            <ColResize onMouseDown={onResize(2, 56)} />
          </span>
          <span className="relative truncate pr-1">
            Status
            <ColResize onMouseDown={onResize(3, 44)} />
          </span>
          <span className="relative truncate">
            {" "}
            <ColResize onMouseDown={onResize(4, 22)} />
          </span>
        </div>
        {alerts.length === 0 && (
          <div className="px-3 py-6 text-center text-[12px] text-[#787b86]">
            No alerts. Add a price level for the active symbol.
          </div>
        )}
        {alerts.map((alert) => {
          const hit = alert.enabled && fired(alert.price, alert.side);
          return (
            <div
              key={alert.id}
              className="grid items-center border-b border-[#222222] px-2 py-2"
              style={{ gridTemplateColumns: template, minWidth: "max-content" }}
            >
              <input
                type="checkbox"
                checked={alert.enabled}
                onChange={() => toggleAlert(alert.id)}
              />
              <span className="truncate pr-1 text-[12px] text-[#d1d4dc]">{formatTicker(alert.symbol)}</span>
              <span className="truncate pr-1 text-[12px] text-[#d1d4dc]">
                {alert.side === "above" ? "≥" : "≤"} {formatPrice(alert.symbol, alert.price)}
              </span>
              <span className={`truncate pr-1 text-[11px] ${hit ? "text-[#089981]" : "text-[#787b86]"}`}>
                {hit ? "Triggered" : "Waiting"}
              </span>
              <button
                type="button"
                className="text-[#787b86] hover:text-[#f23645]"
                onClick={() => removeAlert(alert.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
