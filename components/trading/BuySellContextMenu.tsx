"use client";

import { useAppStore } from "@/lib/store";
import { EyeOff, Settings } from "lucide-react";
import { useEffect, type CSSProperties } from "react";

export function BuySellContextMenu() {
  const menu = useAppStore((s) => s.buySellMenu);
  const setBuySellMenu = useAppStore((s) => s.setBuySellMenu);
  const patchChartSettings = useAppStore((s) => s.patchChartSettings);
  const setTradingSettingsSymbol = useAppStore((s) => s.setTradingSettingsSymbol);

  useEffect(() => {
    if (!menu) return;
    const close = () => setBuySellMenu(null);
    const timer = window.setTimeout(() => {
      window.addEventListener("mousedown", close);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousedown", close);
    };
  }, [menu, setBuySellMenu]);

  if (!menu) return null;

  const style: CSSProperties = {
    left: Math.min(menu.x, window.innerWidth - 200),
    top: Math.min(menu.y, window.innerHeight - 100),
  };

  return (
    <div
      className="ctx-menu"
      style={{ ...style, width: 188 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="ctx-item"
        onClick={() => {
          patchChartSettings({ showBuySell: false });
          setBuySellMenu(null);
        }}
      >
        <span className="ctx-ico">
          <EyeOff size={15} />
        </span>
        <span className="ctx-body">
          <span className="ctx-label">Hide Buttons</span>
        </span>
      </button>
      <button
        type="button"
        className="ctx-item"
        onClick={() => setTradingSettingsSymbol(menu.symbol)}
      >
        <span className="ctx-ico">
          <Settings size={15} />
        </span>
        <span className="ctx-body">
          <span className="ctx-label">Trading Settings</span>
        </span>
      </button>
    </div>
  );
}
