"use client";

import { ToolbarBtn } from "@/components/ui/ToolbarBtn";
import { getChart, getWorkspace } from "@/lib/chart-registry";
import { CHART_STYLES } from "@/lib/chart-style";
import { AssetLogo } from "@/components/brand/AssetLogo";
import { MawsLogo } from "@/components/brand/MawsLogo";
import { VelaDrawingBar } from "@/components/drawings/VelaDrawingBar";
import { MAWS_FULL_NAME } from "@/lib/maws/brand";
import { formatPrice, mawsFeed } from "@/lib/maws/feed";
import { formatTicker } from "@/lib/maws/universe";
import { useActivePane, useAppStore } from "@/lib/store";
import { useLiveStore } from "@/lib/live/store";
import { TIMEFRAMES } from "@/lib/timeframes";
import { newClientOrderId, submitOrderFromUi } from "@/lib/trading/ui-orders";
import {
  formatMarginLabel,
  bumpTopbarMargin,
  quantizeQtyToStep,
  qtyStepFor,
  resolveOrderQty,
  resolveSymbolTrading,
  topbarSeedMargin,
} from "@/lib/trading/symbol-settings";
import { useQuote } from "@/lib/use-quotes";
import { groupedVelaCatalog, velaIndicatorCategory } from "@/lib/vela-indicator-catalog";
import type { NativeIndicatorInfo } from "@/lib/charting";
import type { Timeframe } from "@/types";
import { VelaTemplateMenu } from "@/components/shell/VelaTemplateMenu";
import { VelaLayoutButton } from "@/components/shell/VelaLayoutButton";
import {
  Camera,
  ChevronDown,
  Diamond,
  Keyboard,
  Maximize,
  Rewind,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BAR_TFS: Timeframe[] = ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W", "1M"];
const MORE_TFS: Timeframe[] = ["3m", "2h"];

/**
 * Feature flag mirror of AppShell's constant — the workspace's composite
 * screenshot covers the whole grid when the workspace engine hosts the grid.
 */
const USE_VELA_WORKSPACE = process.env.NEXT_PUBLIC_MAWS_VELA_WORKSPACE === "true";

function CandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 3v10M11 2v12" stroke="currentColor" strokeWidth="1.2" />
      <rect x="3.2" y="5" width="3.6" height="6" fill="currentColor" />
      <rect x="9.2" y="4" width="3.6" height="7" fill="currentColor" />
    </svg>
  );
}

function ChartStyleIcon({
  id,
  className = "",
}: {
  id: (typeof CHART_STYLES)[number]["id"];
  className?: string;
}) {
  const common = `shrink-0 ${className}`;
  switch (id) {
    case "solid":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={common} fill="none">
          <path d="M5 2.5v13M13 1.5v15" stroke="currentColor" strokeWidth="1.2" />
          <rect x="3.2" y="5" width="3.6" height="7" fill="currentColor" />
          <rect x="11.2" y="4" width="3.6" height="8" fill="currentColor" />
        </svg>
      );
    case "hollow":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={common} fill="none">
          <path d="M5 2.5v13M13 1.5v15" stroke="currentColor" strokeWidth="1.2" />
          <rect x="3.2" y="5" width="3.6" height="7" stroke="currentColor" strokeWidth="1.3" />
          <rect x="11.2" y="4" width="3.6" height="8" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "heikinashi":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={common} fill="none">
          <path d="M4.5 3v12M9 2v14M13.5 4v10" stroke="currentColor" strokeWidth="1.1" />
          <rect x="2.8" y="6" width="3.4" height="5.5" fill="currentColor" />
          <rect x="7.3" y="5" width="3.4" height="7" fill="currentColor" opacity="0.55" />
          <rect x="11.8" y="7" width="3.4" height="4.5" fill="currentColor" />
        </svg>
      );
    case "bars":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={common} fill="none">
          <path
            d="M4 3.5v11M2.5 7H4M4 12h1.5M9 2.5v13M7.5 6H9M9 11h1.5M14 3v12M12.5 8H14M14 11.5h1.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="square"
          />
        </svg>
      );
    case "line":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={common} fill="none">
          <path
            d="M2 12.5 6 7.5 9.5 10.5 16 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case "area":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={common} fill="none">
          <path
            d="M2 13.5 6 8 9.5 11 16 4.5V15H2v-1.5Z"
            fill="currentColor"
            opacity="0.28"
          />
          <path
            d="M2 13.5 6 8 9.5 11 16 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case "baseline":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" className={common} fill="none">
          <path d="M2 9.5h14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
          <path
            d="M2 12 5.5 7.5 9 10.5 16 5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M2 12 5.5 7.5 9 10.5 16 5V15H2v-3Z" fill="currentColor" opacity="0.22" />
        </svg>
      );
    default:
      return <CandleIcon />;
  }
}

function IndicatorsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 12h3V5H2v7zm4.5 0h3V3h-3v9zM11 12h3V6h-3v6z" fill="currentColor" />
    </svg>
  );
}

/** Stepped topbar sizing: min 10 USDT margin, 10 USDT steps; qty is derived
 *  from margin × leverage at the order price. */
function marginToQty(symbol: string, margin: number, price: number): number {
  if (!(price > 0)) return 0;
  const t = resolveSymbolTrading(symbol);
  const lev = Math.max(1, t.leverage);
  return quantizeQtyToStep((margin * lev) / price, qtyStepFor(symbol));
}

/** Isolated so quote ticks don't re-render the whole top bar. */
function BuySellStrip({
  symbol,
  onSell,
  onBuy,
  onContextMenu,
}: {
  symbol: string;
  onSell: (price: number, qty: number) => void;
  onBuy: (price: number, qty: number) => void;
  onContextMenu: (x: number, y: number) => void;
}) {
  const quote = useQuote(symbol);
  const connectedBroker = useAppStore((s) => s.connectedBroker);
  const livePhase = useLiveStore((s) => s.phase);
  const liveProfileId = useLiveStore((s) => s.profileId);
  const liveReady = useLiveStore((s) => s.ready);
  const timeframe = useAppStore((s) => {
    const pane = s.panes.find((p) => p.id === s.activePaneId);
    return pane?.timeframe ?? "1D";
  });
  const [feedLive, setFeedLive] = useState(
    () => mawsFeed.getKlineStatus(symbol, timeframe) === "live",
  );
  useEffect(() => {
    const id = setInterval(() => {
      setFeedLive(mawsFeed.getKlineStatus(symbol, timeframe) === "live");
    }, 1_000);
    return () => clearInterval(id);
  }, [symbol, timeframe]);

  const bid = quote ? quote.last * 0.9999 : 0;
  const ask = quote ? quote.last * 1.0001 : 0;
  // Topbar sizing is margin-based: min 10 USDT, ±10 steps. Seeded once per
  // symbol from the trading defaults; a hand-set margin is never stomped by
  // quote ticks. Qty is derived at click time from margin × leverage / price.
  const [margin, setMargin] = useState<number | null>(null);
  const [marginSymbol, setMarginSymbol] = useState(symbol);
  const [marginDraft, setMarginDraft] = useState<string | null>(null);
  if (symbol !== marginSymbol) {
    setMarginSymbol(symbol);
    setMargin(null);
    setMarginDraft(null);
  }
  const marginValue = margin ?? topbarSeedMargin(symbol);
  const bumpMargin = (dir: 1 | -1) =>
    setMargin(bumpTopbarMargin(symbol, marginValue, dir));
  const units = marginToQty(symbol, marginValue, bid || ask);
  const profileBlocked = livePhase === "switching" || livePhase === "degraded" || livePhase === "failed" || livePhase === "detached" || (connectedBroker === "binance" && liveProfileId !== null && (!liveReady || livePhase !== "ready"));
  const disabled = !quote || !feedLive || profileBlocked;
  const feedTitle = profileBlocked ? "Trading halted: profile switch in progress" : !feedLive ? "Trading halted: market data not live" : undefined;
  return (
    <div
      className="ml-1 flex shrink-0 items-center gap-1"
      onContextMenu={(e) => {
        if (!quote) return;
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e.clientX, e.clientY);
      }}
    >
      <button
        type="button"
        disabled={disabled}
        title={feedTitle}
        aria-label="Sell at bid"
        className="trade-block trade-block-sell flex h-[32px] shrink-0 items-center gap-1.5 px-2.5 text-[12px] tabular-nums disabled:opacity-40"
        onClick={() => {
          if (!quote) return;
          const qty = marginToQty(symbol, marginValue, bid);
          if (qty > 0) onSell(bid, qty);
        }}
      >
        <span className="size-1.5 shrink-0 rounded-full bg-[#f23645]" />
        <span className="shrink-0 text-[#f23645]">Sell</span>
        <span className="min-w-0 truncate text-(--app-text)">
          {quote ? formatPrice(symbol, bid) : "—"}
        </span>
      </button>
      <div
        className="trade-hover flex h-[32px] shrink-0 items-center gap-0 px-0 rounded-[10px]"
        title={`Margin × leverage → order size (min 10)`}
      >
        <button
          type="button"
          aria-label="Decrease margin"
          disabled={disabled || marginValue <= 10}
          className="flex h-6 w-[14px] items-center justify-center text-[12px] text-(--app-muted) hover:bg-(--app-hover) disabled:opacity-40"
          onClick={() => bumpMargin(-1)}
        >
          −
        </button>
        <input
          aria-label="Order margin"
          className="w-8 border-b border-(--app-border) bg-transparent pb-0.5 text-center text-[12px] font-medium tabular-nums text-(--app-text) outline-none focus:border-(--app-muted)"
          value={marginDraft ?? marginValue}
          onChange={(e) => {
            setMarginDraft(e.target.value);
            const next = Number(e.target.value);
            if (Number.isFinite(next) && next >= 10) {
              setMargin(Math.round(next / 10) * 10 || 10);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") {
              setMarginDraft(null);
              (e.target as HTMLInputElement).blur();
            }
          }}
          onBlur={() => setMarginDraft(null)}
        />
        <button
          type="button"
          aria-label="Increase margin"
          disabled={disabled}
          className="flex h-6 w-[14px] items-center justify-center text-[12px] text-(--app-muted) hover:bg-(--app-hover) disabled:opacity-40"
          onClick={() => bumpMargin(1)}
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={disabled}
        title={feedTitle}
        aria-label="Buy at ask"
        className="trade-block trade-block-buy flex h-[32px] shrink-0 items-center gap-1.5 px-2.5 text-[12px] tabular-nums disabled:opacity-40"
        onClick={() => {
          if (!quote) return;
          const qty = marginToQty(symbol, marginValue, ask);
          if (qty > 0) onBuy(ask, qty);
        }}
      >
        <span className="min-w-0 truncate text-(--app-text)">
          {quote ? formatPrice(symbol, ask) : "—"}
        </span>
        <span className="shrink-0 text-[#2ebd85]">Buy</span>
        <span className="size-1.5 shrink-0 rounded-full bg-[#2ebd85]" />
      </button>
    </div>
  );
}

export function TopBar() {
  const pane = useActivePane();
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setTimeframe = useAppStore((s) => s.setTimeframe);
  const indicatorMenuOpen = useAppStore((s) => s.indicatorMenuOpen);
  const setIndicatorMenuOpen = useAppStore((s) => s.setIndicatorMenuOpen);
  const closeMenus = useAppStore((s) => s.closeMenus);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const setBrokerDialogOpen = useAppStore((s) => s.setBrokerDialogOpen);
  const connectedBroker = useAppStore((s) => s.connectedBroker);
  const liveEnvironment = useLiveStore((s) => s.environment);
  const liveProfileId = useLiveStore((s) => s.profileId);
  const tradingMode = getTradingMode(connectedBroker, liveEnvironment, liveProfileId);
  const setBottomTab = useAppStore((s) => s.setBottomTab);
  const setBuySellMenu = useAppStore((s) => s.setBuySellMenu);
  const showBuySell = useAppStore((s) => s.chartSettings.showBuySell);

  const watchlist = useAppStore((s) => s.watchlist);
  const addToWatchlist = useAppStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);
  const alerts = useAppStore((s) => s.alerts);
  const patchChartSettings = useAppStore((s) => s.patchChartSettings);
  const candleStyle = useAppStore((s) => s.chartSettings.candleStyle);
  const replay = useAppStore((s) => s.replay);
  const replaySeeking = useAppStore((s) => s.replaySeeking);
  const stopReplay = useAppStore((s) => s.stopReplay);
  const setReplaySeeking = useAppStore((s) => s.setReplaySeeking);
  const settingsOpen = useAppStore((s) => s.settingsOpen);
  const searchOpen = useAppStore((s) => s.searchOpen);
  const indicatorSettingsId = useAppStore((s) => s.indicatorSettingsId);
  const drawingSettingsTarget = useAppStore((s) => s.drawingSettingsTarget);
  const brokerDialogOpen = useAppStore((s) => s.brokerDialogOpen);
  const tfRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [tfMore, setTfMore] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  /** Live state of Vela's native-indicator catalog on this pane's chart (supported/present flags). */
  const [velaCatalog, setVelaCatalog] = useState<NativeIndicatorInfo[] | null>(null);
  const starred = watchlist.includes(pane.symbol);
  const tfLabel = TIMEFRAMES.find((t) => t.id === pane.timeframe)?.label ?? pane.timeframe;

  const closeAllMenus = () => {
    setTfMore(false);
    setStyleOpen(false);
    setIndicatorMenuOpen(false);
    closeMenus();
  };

  /** Fetch Vela's native catalog (supported/present flags) for the active pane's chart. */
  const refreshVelaCatalog = () => {
    const chart = getChart(pane.id)?.vela;
    if (!chart?.availableNativeIndicators) {
      setVelaCatalog(null);
      return;
    }
    void chart
      .availableNativeIndicators()
      .then((list) => setVelaCatalog(list))
      .catch(() => setVelaCatalog(null));
  };

  useEffect(() => {
    if (!indicatorMenuOpen) return;
    refreshVelaCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicatorMenuOpen, pane.id]);

  /** Add a Vela-native indicator straight onto the active pane's chart (Vela owns legend/settings). */
  const addVelaNative = (type: string) => {
    getChart(pane.id)?.vela.addNativeIndicator(type);
    setIndicatorMenuOpen(false);
    refreshVelaCatalog();
  };

  const toggleTfMore = () => {
    const next = !tfMore;
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    if (next) setTfMore(true);
  };

  const toggleStyleOpen = () => {
    const next = !styleOpen;
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    if (next) setStyleOpen(true);
  };

  const toggleIndicatorMenu = () => {
    const next = !indicatorMenuOpen;
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    if (next) setIndicatorMenuOpen(true);
  };

  const toggleSearch = () => {
    const next = !searchOpen;
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    if (next) setSearchOpen(true);
  };

  const toggleSettings = () => {
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    // Open Vela's native settings dialog — the ONE settings panel: built-in
    // tabs plus the full MAWS section set (Status line, Scales & labels,
    // Chart chrome, Theme, Trading, Alerts, Events) contributed as host
    // sections on every chart mount.
    (getChart(pane.id)?.renderer as unknown as { openSettings?: (s?: string) => void }).openSettings?.();
  };

  const placeMarket = (side: "buy" | "sell", price: number, qtyOverride?: number) => {
    const trading = resolveSymbolTrading(pane.symbol);
    const qty = qtyOverride ?? resolveOrderQty(pane.symbol, price);
    if (!(qty > 0)) return;
    // One id per user submit action; reused if this action is retried.
    const clientOrderId = newClientOrderId();
    if (trading.confirmOrders && !useAppStore.getState().chartSettings.oneClickTrading) {
      const ok = window.confirm(
        `${side === "buy" ? "Buy" : "Sell"} ${pane.symbol} · margin ${formatMarginLabel(pane.symbol)} @ market?`,
      );
      if (!ok) return;
    }
    submitOrderFromUi({
      symbol: pane.symbol,
      side,
      type: trading.defaultOrderType === "limit" ? "limit" : "market",
      price,
      qty,
      clientOrderId,
    });
  };

  useEffect(() => {
    if (settingsOpen || indicatorSettingsId || drawingSettingsTarget || brokerDialogOpen) {
      setTfMore(false);
      setStyleOpen(false);
      setIndicatorMenuOpen(false);
    }
  }, [
    settingsOpen,
    indicatorSettingsId,
    drawingSettingsTarget,
    brokerDialogOpen,
    setIndicatorMenuOpen,
  ]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      if (tfMore && !tfRef.current?.contains(t)) {
        setTfMore(false);
      }
      if (styleOpen && !styleRef.current?.contains(t)) {
        setStyleOpen(false);
      }
      if (indicatorMenuOpen && !indicatorRef.current?.contains(t)) {
        setIndicatorMenuOpen(false);
      }
      if (searchOpen && !t.closest("[data-symbol-search-trigger], [data-symbol-search]")) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [
    tfMore,
    styleOpen,
    indicatorMenuOpen,
    searchOpen,
    setIndicatorMenuOpen,
    setSearchOpen,
  ]);

  return (
    <header className="relative z-40 flex h-[40px] shrink-0 items-center gap-0.5 overflow-visible bg-[var(--app-bg)] px-2 text-[var(--app-text)]">
      <div
        className="relative z-[2] mr-1 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[var(--app-elevated)]"
        title={MAWS_FULL_NAME}
        aria-label={MAWS_FULL_NAME}
      >
        <MawsLogo size={14} title={MAWS_FULL_NAME} />
        {alerts.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#f23645] px-0.5 text-[9px] font-bold text-white">
            {alerts.length}
          </span>
        )}
      </div>

      <button
        type="button"
        data-symbol-search-trigger
        onClick={toggleSearch}
        className="relative z-[2] flex h-[28px] w-[140px] shrink-0 items-center justify-between gap-1.5 rounded-full bg-[var(--app-elevated)] px-3 hover:bg-[var(--app-border)]"
      >
        {/* Asset icon left of the ticker — mirrors the status line/search rows. */}
        <AssetLogo symbol={pane.symbol} size={16} />
        <span className="min-w-0 flex-1 truncate text-left text-[13px] font-semibold">{formatTicker(pane.symbol)}</span>
        <ChevronDown size={12} className="shrink-0 text-(--app-muted)" />
      </button>

      <button
        type="button"
        title={starred ? "Remove from watchlist" : "Add to watchlist"}
        className="relative z-[2] ml-1 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)"
        onClick={() => {
          closeAllMenus();
          if (starred) removeFromWatchlist(pane.symbol);
          else addToWatchlist(pane.symbol);
        }}
      >
        <Diamond
          size={14}
          color="#ffffff"
          fill={starred ? "#ffffff" : "none"}
          strokeWidth={1.6}
        />
      </button>

      <span className="relative z-[2] top-sep" />

      <div className="relative z-[2] flex shrink-0 items-center">
        {BAR_TFS.map((id) => {
          const tf = TIMEFRAMES.find((t) => t.id === id)!;
          const on = pane.timeframe === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                closeAllMenus();
                setTimeframe(id);
              }}
              className={`h-[26px] rounded-[6px] px-[7px] text-[13px] ${
                on ? "bg-(--app-hover) text-(--app-text)" : "text-(--app-muted) hover:text-(--app-text)"
              }`}
            >
              {tf.label}
            </button>
          );
        })}
        <div className="relative" ref={tfRef}>
          <button
            type="button"
            className="flex h-[26px] w-[20px] items-center justify-center text-(--app-muted) hover:text-(--app-text)"
            onClick={toggleTfMore}
          >
            <ChevronDown size={12} />
          </button>
          {tfMore && (
            <div className="menu" data-dropdown-open>
              {MORE_TFS.map((id) => {
                const tf = TIMEFRAMES.find((t) => t.id === id)!;
                return (
                  <button
                    key={id}
                    type="button"
                    className="menu-row w-full"
                    onClick={() => {
                      setTimeframe(id);
                      setTfMore(false);
                    }}
                  >
                    {tf.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {!BAR_TFS.includes(pane.timeframe) && (
          <span className="ml-1 text-[11px] text-(--app-muted)">{tfLabel}</span>
        )}

        <span className="top-sep" />

        <div className="relative" ref={styleRef}>
          <ToolbarBtn
            label="Chart type"
            active={styleOpen}
            onClick={toggleStyleOpen}
          >
            <ChartStyleIcon id={candleStyle} />
          </ToolbarBtn>
          {styleOpen && (
            <div className="menu min-w-[200px]" data-dropdown-open>
              {CHART_STYLES.map((s) => {
                const on = candleStyle === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className="menu-row w-full"
                    onClick={() => {
                      if (s.id === "solid" || s.id === "heikinashi") {
                        patchChartSettings({
                          candleStyle: s.id,
                          bodyVisible: true,
                          borderVisible: false,
                          wickVisible: true,
                          bodyUpColor: "#089981",
                          bodyDownColor: "#f23645",
                          borderUpColor: "#089981",
                          borderDownColor: "#f23645",
                          wickUpColor: "#089981",
                          wickDownColor: "#f23645",
                        });
                      } else if (s.id === "hollow") {
                        patchChartSettings({
                          candleStyle: s.id,
                          bodyVisible: true,
                          borderVisible: true,
                          wickVisible: true,
                          bodyUpColor: "#b2b5be",
                          bodyDownColor: "#787b86",
                          borderUpColor: "#b2b5be",
                          borderDownColor: "#787b86",
                          wickUpColor: "#b2b5be",
                          wickDownColor: "#787b86",
                        });
                      } else {
                        patchChartSettings({ candleStyle: s.id });
                      }
                      setStyleOpen(false);
                    }}
                  >
                    <ChartStyleIcon id={s.id} className="text-(--app-muted)" />
                    <span className="flex-1 text-left">{s.label}</span>
                    {on ? <span className="text-[12px] text-(--app-text)">✓</span> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <span className="top-sep" />

        <div className="relative" ref={indicatorRef}>
          <ToolbarBtn
            label="Indicators"
            active={indicatorMenuOpen}
            onClick={toggleIndicatorMenu}
            className="gap-1 px-2 text-[13px] text-(--app-text)"
          >
            <IndicatorsIcon />
            Indicators
            <ChevronDown size={11} className="text-(--app-muted)" />
          </ToolbarBtn>
          {indicatorMenuOpen && (
            <div className="menu max-h-[70vh] overflow-y-auto" data-dropdown-open>
              {/* The full Vela native catalog (incl. MAWS-registered order-blocks and
                  pmo) — every entry mounts through chart.addNativeIndicator; Vela
                  owns the legend row, settings dialog, hide/show and removal. */}
              {groupedVelaCatalog().map(({ category, entries }) => {
                const live = new Map(velaCatalog?.map((n) => [n.type, n]) ?? []);
                return (
                  <div key={category}>
                    <div className="menu-section-title">Vela · {category}</div>
                    {entries.map((entry) => {
                      const info = live.get(entry.type);
                      const supported = info ? info.supported : true;
                      const present = info?.present ?? false;
                      return (
                        <button
                          key={entry.type}
                          type="button"
                          disabled={!supported}
                          className={`menu-row w-full text-left ${supported ? "" : "opacity-40"}`}
                          title={
                            !supported
                              ? "Not available for this symbol"
                              : velaIndicatorCategory(entry.type)
                          }
                          onClick={() => addVelaNative(entry.type)}
                        >
                          <span className="flex-1 truncate">
                            {info?.title ?? entry.title}
                          </span>
                          {info?.beta ? (
                            <span className="text-[10px] uppercase text-(--app-muted)">beta</span>
                          ) : null}
                          {present ? <span className="text-[12px] text-(--app-text)">✓</span> : null}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <span className="top-sep" />

        <ToolbarBtn
          label="Replay"
          className="gap-1 px-2 text-[13px]"
          active={Boolean(replay) || replaySeeking}
          onClick={() => {
            closeAllMenus();
            if (replay) {
              // Stop active replay — also stop Vela so live data resumes.
              const workspaceReplay = getWorkspace()?.replay;
              if (workspaceReplay?.state.active) workspaceReplay.stop();
              else {
                const chart = getChart(pane.id)?.vela;
                if (chart?.replay.state.active) chart.replay.stop();
              }
              stopReplay();
              return;
            }
            if (replaySeeking) {
              setReplaySeeking(false);
              return;
            }
            // Enter seek mode: the ReplaySeekOverlay takes over from here.
            setReplaySeeking(true);
          }}
        >
          <Rewind size={14} />
          Replay
        </ToolbarBtn>

        <span className="top-sep" />
      </div>

      {/* Vela's native drawing bar (horizontal, top-docked) — one shared bar for the
          active pane, Vela-owned state; the MAWS extras (undo/redo/hide/Clear) ride
          in its row and are all drag-reorderable with the tools. */}
      <div className="relative z-[2] mx-0.5 flex min-w-0 flex-1 items-center">
        <VelaDrawingBar />
      </div>

      <div className="relative z-[2] flex shrink-0 items-center gap-0.5">
        <VelaTemplateMenu />

        <div className="mr-1 flex items-center">
          <VelaLayoutButton />
        </div>
        <ToolbarBtn
          label="Settings"
          className="rounded-full"
          onClick={toggleSettings}
        >
          <Settings size={15} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Keyboard shortcuts"
          className="rounded-full"
          active={settingsOpen}
          data-settings-trigger
          onClick={() => { closeAllMenus(); setSettingsOpen(!settingsOpen); }}
        >
          <Keyboard size={15} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Fullscreen"
          className="rounded-full"
          onClick={() => {
            closeAllMenus();
            if (document.fullscreenElement) void document.exitFullscreen();
            else void document.documentElement.requestFullscreen();
          }}
        >
          <Maximize size={15} />
        </ToolbarBtn>
        <ToolbarBtn
          label="Screenshot"
          className="rounded-full"
          onClick={() => {
            closeAllMenus();
            if (USE_VELA_WORKSPACE) {
              // Workspace engine: the composite screenshot covers every cell.
              getWorkspace()?.downloadScreenshot();
              return;
            }
            const handle = getChart(pane.id);
            if (!handle) return;
            // Vela public seam: renderer.screenshot() returns a PNG data URL.
            const dataUrl = handle.vela.renderer.screenshot();
            if (!dataUrl) return;
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `${pane.symbol}-${pane.timeframe}.png`;
            a.click();
          }}
        >
          <Camera size={15} />
        </ToolbarBtn>
        {showBuySell ? (
          <BuySellStrip
            symbol={pane.symbol}
            onSell={(price, qty) => placeMarket("sell", price, qty)}
            onBuy={(price, qty) => placeMarket("buy", price, qty)}
            onContextMenu={(x, y) => {
              closeAllMenus();
              setBuySellMenu({ x, y, symbol: pane.symbol });
            }}
          />
        ) : null}
        <button
          type="button"
          data-trade-trigger
          className={`ml-1 flex h-[28px] items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold ${tradingMode.buttonClass}`}
          title={`Trade · Current mode: ${tradingMode.label}`}
          aria-label={`Trade · Current mode: ${tradingMode.label}`}
          onClick={() => {
            closeAllMenus();
            if (settingsOpen) setSettingsOpen(false);
            if (connectedBroker === "mock" || connectedBroker === "binance") {
              setBottomTab("positions");
              useAppStore.getState().setBottomOpen(true);
            } else {
              setBrokerDialogOpen(true);
            }
          }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
          Trade
        </button>
      </div>
    </header>
  );
}

function getTradingMode(
  connectedBroker: string | null,
  environment: string | null,
  profileId: string | null,
): { label: string; buttonClass: string } {
  const label = connectedBroker === "mock"
    ? "Paper"
    : environment === "testnet" || profileId === "binance-testnet"
      ? "Testnet"
      : environment === "production" || profileId === "binance-production"
        ? "Production"
        : "Chart Only";
  const buttonClass = label === "Production"
    ? "bg-[#f0b90b] text-black hover:bg-[#dca900]"
    : label === "Testnet"
      ? "bg-[#2962ff] text-white hover:bg-[#2457dc]"
      : label === "Paper"
        ? "bg-white text-[#111318] hover:bg-[#e5e7eb]"
        : "bg-[#1b1e26] text-[#b0b3bc] hover:bg-[#252a33]";

  return { label, buttonClass };
}
