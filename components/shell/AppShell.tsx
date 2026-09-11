"use client";

import { ChartContextMenu } from "@/components/charts/ChartContextMenu";
import { ChartGrid } from "@/components/charts/ChartGrid";
import { SymbolSearch } from "@/components/charts/SymbolSearch";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { IndicatorSettingsModal } from "@/components/settings/IndicatorSettingsModal";
import { DrawingSettingsModal } from "@/components/settings/DrawingSettingsModal";
import { BrokerDialog } from "@/components/trading/BrokerDialog";
import { AccountSettingsModal } from "@/components/trading/AccountSettingsModal";
import { BuySellContextMenu } from "@/components/trading/BuySellContextMenu";
import { TradingSettingsModal } from "@/components/trading/TradingSettingsModal";
import { MockBrokerLoop } from "@/components/trading/MockBrokerLoop";
import { ReplayBar } from "@/components/replay/ReplayBar";
import { BottomPanel } from "@/components/shell/BottomPanel";
import { RightDock } from "@/components/shell/RightDock";
import { RightSidebar } from "@/components/shell/RightSidebar";
import { TopBar } from "@/components/shell/TopBar";
import { getChart, getLastCrosshair } from "@/lib/chart-registry";
import { restoreServerProfile } from "@/lib/live/bridge";
import { useLiveStore } from "@/lib/live/store";
import { mawsFeed } from "@/lib/maws/feed";
import { loadUniverseFromBinance } from "@/lib/maws/universe";
import { eventMatchesShortcut, type ShortcutId } from "@/lib/shortcuts";
import { useActivePane, useAppStore } from "@/lib/store";
import { timeframeSeconds } from "@/lib/timeframes";
import { newClientOrderId, submitOrderFromUi } from "@/lib/trading/ui-orders";
import { resolveOrderQty } from "@/lib/trading/symbol-settings";
import { useSyncHotSymbols } from "@/lib/use-quotes";
import { applyAppTheme } from "@/lib/app-theme";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChartRange = "1D" | "5D" | "1M" | "3M" | "6M" | "YTD" | "1Y" | "5Y" | "All";

function rangeSeconds(range: ChartRange): number | null {
  const day = 86400;
  if (range === "All") return null;
  if (range === "1D") return day;
  if (range === "5D") return 5 * day;
  if (range === "1M") return 30 * day;
  if (range === "3M") return 90 * day;
  if (range === "6M") return 180 * day;
  if (range === "1Y") return 365 * day;
  if (range === "5Y") return 5 * 365 * day;
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 1) / 1000;
  return Math.floor(Date.now() / 1000) - start;
}

function ChartRangeSync() {
  const pane = useActivePane();
  const range = useAppStore((s) => s.range) as ChartRange;
  const previousPaneId = useRef(pane.id);

  useEffect(() => {
    if (previousPaneId.current !== pane.id) {
      previousPaneId.current = pane.id;
      return;
    }
    const handle = getChart(pane.id);
    if (!handle) return;
    const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
    const seconds = rangeSeconds(range);
    if (seconds == null) {
      handle.chart.timeScale().fitContent();
      return;
    }
    const bars = Math.max(20, Math.round(seconds / timeframeSeconds(pane.timeframe)));
    const to = candles.length + 4;
    const from = Math.max(0, candles.length - bars);
    handle.chart.timeScale().setVisibleLogicalRange({ from, to });
  }, [range, pane.id, pane.symbol, pane.timeframe]);

  return null;
}

function LiveNotices() {
  const notices = useLiveStore((s) => s.notices);
  const dismissNotice = useLiveStore((s) => s.dismissNotice);

  useEffect(() => {
    if (notices.length === 0) return;
    const timers = notices.map((n) => window.setTimeout(() => dismissNotice(n.id), 8000));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [notices, dismissNotice]);

  if (notices.length === 0) return null;

  return (
    <div className="fixed right-3 bottom-8 z-[90] flex w-[340px] flex-col gap-2">
      {notices.map((n) => (
        <div
          key={n.id}
          role="status"
          className={`flex items-start gap-2 rounded-[6px] border px-3 py-2 text-[12px] shadow-[0_8px_28px_rgba(0,0,0,0.5)] ${
            n.tone === "error"
              ? "border-[#f23645] bg-[#1a0b0d] text-[#f23645]"
              : n.tone === "success"
                ? "border-[#089981] bg-[#071512] text-[#089981]"
                : "border-[#2a2e39] bg-[#1b1b1b] text-[#d1d4dc]"
          }`}
        >
          <span className="min-w-0 flex-1 break-words">{n.text}</span>
          <button
            type="button"
            aria-label="Dismiss"
            className="shrink-0 text-[#787b86] hover:text-[#d1d4dc]"
            onClick={() => dismissNotice(n.id)}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function AppShell() {
  const [ready, setReady] = useState(false);
  const appSettings = useAppStore((s) => s.appSettings);
  const setDrawingTool = useAppStore((s) => s.setDrawingTool);
  const closeMenus = useAppStore((s) => s.closeMenus);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const setIndicatorSettingsOpen = useAppStore((s) => s.setIndicatorSettingsOpen);
  const setDrawingSettingsTarget = useAppStore((s) => s.setDrawingSettingsTarget);
  const setBrokerDialogOpen = useAppStore((s) => s.setBrokerDialogOpen);
  const setAccountSettingsOpen = useAppStore((s) => s.setAccountSettingsOpen);
  const setMaximizedPane = useAppStore((s) => s.setMaximizedPane);

  useSyncHotSymbols(ready);

  useEffect(() => {
    applyAppTheme(appSettings);
  }, [appSettings]);

  useEffect(() => {
    if (!ready) return;
    void restoreServerProfile();
  }, [ready]);

  useEffect(() => {
    mawsFeed.start();
    void loadUniverseFromBinance().then(() => mawsFeed.refreshQuotes());
    const hydrate = () => {
      applyAppTheme(useAppStore.getState().appSettings);
      setReady(true);
    };
    if (useAppStore.persist.hasHydrated()) hydrate();
    const unsub = useAppStore.persist.onFinishHydration(hydrate);
    return () => {
      unsub();
      mawsFeed.stop();
    };
  }, []);

  useEffect(() => {
    const run = (id: ShortcutId) => {
      const s = useAppStore.getState();
      const pane = s.panes.find((p) => p.id === s.activePaneId);
      const cross = getLastCrosshair();
      const price = cross?.price ?? s.contextMenu?.price ?? s.clipboardPrice;

      switch (id) {
        case "openSearch":
          setSearchOpen(true);
          break;
        case "fitChart": {
          if (!pane) return;
          getChart(pane.id)?.chart.timeScale().fitContent();
          getChart(pane.id)?.chart.priceScale("right").setAutoScale(true);
          s.setRange("All");
          break;
        }
        case "addAlert": {
          if (!pane || price == null) return;
          s.addAlert({ symbol: pane.symbol, price, side: "above", enabled: true });
          s.setRightDock("alerts");
          break;
        }
        case "buyLimit":
        case "buyLimitAtCross": {
          if (!pane || price == null) return;
          submitOrderFromUi({
            symbol: pane.symbol,
            side: "buy",
            type: "limit",
            price,
            qty: resolveOrderQty(pane.symbol, price),
            clientOrderId: newClientOrderId(),
          });
          break;
        }
        case "sellStopAtCross": {
          if (!pane || price == null) return;
          submitOrderFromUi({
            symbol: pane.symbol,
            side: "sell",
            type: "stop",
            price,
            qty: resolveOrderQty(pane.symbol, price),
            clientOrderId: newClientOrderId(),
          });
          break;
        }
        case "drawHorizontalRay": {
          if (!pane || price == null) return;
          const handle = getChart(pane.id);
          const from = handle?.chart.timeScale().getVisibleRange()?.from;
          const time =
            typeof from === "number" ? from : (cross?.time ?? Math.floor(Date.now() / 1000));
          s.addDrawing(pane.id, {
            id: Math.random().toString(36).slice(2, 10),
            tool: "hray",
            points: [{ time, price }],
            color: "#758696",
          });
          break;
        }
        case "pastePriceRay": {
          if (s.clipboardPrice == null || !pane) return;
          s.addDrawing(pane.id, {
            id: Math.random().toString(36).slice(2, 10),
            tool: "hray",
            points: [{ time: Math.floor(Date.now() / 1000), price: s.clipboardPrice }],
            color: "#2962ff",
          });
          break;
        }
        case "openChartSettings":
          setSettingsOpen(true);
          break;
        case "cursorTool":
          setDrawingTool("cursor");
          break;
        case "toggleMagnet":
          s.setMagnet(!s.magnet);
          break;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        Boolean((e.target as HTMLElement | null)?.isContentEditable);
      const s = useAppStore.getState();

      if (e.key === "Escape") {
        if (s.settingsOpen) {
          setSettingsOpen(false);
          return;
        }
        if (s.indicatorSettingsId) {
          setIndicatorSettingsOpen(null);
          return;
        }
        if (s.drawingSettingsTarget) {
          setDrawingSettingsTarget(null);
          return;
        }
        if (s.brokerDialogOpen) {
          setBrokerDialogOpen(false);
          return;
        }
        if (s.accountSettingsOpen) {
          setAccountSettingsOpen(false);
          return;
        }
        if (s.searchOpen || s.contextMenu || s.indicatorMenuOpen || s.layoutMenuOpen) {
          closeMenus();
          return;
        }
        if (s.maximizedPaneId) {
          setMaximizedPane(null);
          return;
        }
        if (s.replay) {
          s.stopReplay();
          return;
        }
      }

      if (typing || s.settingsOpen) return;

      const ids = Object.keys(s.shortcuts) as ShortcutId[];
      for (const id of ids) {
        if (!eventMatchesShortcut(e, s.shortcuts[id])) continue;
        e.preventDefault();
        run(id);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    closeMenus,
    setDrawingTool,
    setSearchOpen,
    setSettingsOpen,
    setIndicatorSettingsOpen,
    setBrokerDialogOpen,
    setAccountSettingsOpen,
    setMaximizedPane,
    setDrawingSettingsTarget,
  ]);

  if (!ready) {
    return <div className="h-screen w-screen bg-[var(--app-bg)]" />;
  }

  return (
    <div
      data-app-shell
      className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--app-bg)] text-[var(--app-text)]"
    >
      <TopBar />
      <SymbolSearch />
      <div className="flex min-h-0 flex-1">
        <div className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <ChartGrid />
          </div>
          <ChartRangeSync />
          <BottomPanel />
          <ReplayBar />
        </div>
        <RightSidebar />
        <RightDock />
      </div>

      <SettingsModal />
      <IndicatorSettingsModal />
      <DrawingSettingsModal />
      <BrokerDialog />
      <AccountSettingsModal />
      <TradingSettingsModal />
      <MockBrokerLoop />
      <ChartContextMenu />
      <BuySellContextMenu />
      <LiveNotices />
    </div>
  );
}
