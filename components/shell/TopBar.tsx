"use client";

import { ToolbarBtn } from "@/components/ui/ToolbarBtn";
import { getChart } from "@/lib/chart-registry";
import { CHART_STYLES } from "@/lib/chart-style";
import { LAYOUT_COUNTS } from "@/lib/layouts";
import { MawsLogo } from "@/components/brand/MawsLogo";
import { DrawingToolbar } from "@/components/drawings/DrawingToolbar";
import { MAWS_FULL_NAME } from "@/lib/maws/brand";
import { formatPrice, mawsFeed } from "@/lib/maws/feed";
import { formatTicker } from "@/lib/maws/universe";
import { isIndicatorTemplateDirty, useActivePane, useAppStore } from "@/lib/store";
import { useLiveStore } from "@/lib/live/store";
import { TIMEFRAMES } from "@/lib/timeframes";
import { newClientOrderId, submitOrderFromUi } from "@/lib/trading/ui-orders";
import {
  formatMarginLabel,
  resolveOrderQty,
  resolveSymbolTrading,
} from "@/lib/trading/symbol-settings";
import { useQuote } from "@/lib/use-quotes";
import type { IndicatorId, IndicatorTemplate, LayoutSync, Timeframe } from "@/types";
import {
  Camera,
  ChevronDown,
  CloudUpload,
  Diamond,
  FolderOpen,
  Info,
  LayoutGrid,
  Maximize,
  Redo2,
  Rewind,
  Settings,
  Star,
  Trash2,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BAR_TFS: Timeframe[] = ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W", "1M"];
const MORE_TFS: Timeframe[] = ["3m", "2h"];

const INDICATOR_LABELS: Record<IndicatorId, string> = {
  volume: "Volume",
  vwap: "VWAP",
  ema: "EMA",
  bb: "Bollinger Bands",
  rsi: "RSI",
  stoch: "Stochastic",
  atr: "ATR",
  adx: "ADX",
  pmo: "PMO",
  ob: "Order Blocks",
};

function templateSubtitle(tpl: IndicatorTemplate) {
  if (tpl.studies?.length) {
    const labels = tpl.studies.map((s) => INDICATOR_LABELS[s.type]);
    return labels.length ? labels.join(", ") : "No indicators";
  }
  const on = (
    ["volume", "vwap", "ema", "bb", "rsi", "stoch", "atr", "adx", "pmo", "ob"] as IndicatorId[]
  )
    .filter((id) => Boolean(tpl.indicators?.[id]))
    .map((id) => INDICATOR_LABELS[id]);
  return on.length ? on.join(", ") : "No indicators";
}

function TemplateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12M6.5 6.5v7.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

const SYNC_ROWS: {
  key: keyof LayoutSync;
  label: string;
  tip: string;
}[] = [
  { key: "symbol", label: "Symbol", tip: "Keep the same symbol on every chart in the layout" },
  { key: "interval", label: "Interval", tip: "Keep the same timeframe on every chart in the layout" },
  { key: "crosshair", label: "Crosshair", tip: "Move the crosshair together across charts" },
  { key: "time", label: "Time", tip: "Keep charts scrolled to the same place on the time axis" },
  { key: "dateRange", label: "Date range", tip: "Keep the same visible date range on every chart" },
];

function SyncSwitch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative h-[18px] w-[32px] shrink-0 rounded-full transition-colors ${
        on ? "bg-[#d1d4dc]" : "bg-[#363a45]"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[14px] w-[14px] rounded-full transition-[left] ${
          on ? "left-[16px] bg-[#131722]" : "left-[2px] bg-[#787b86]"
        }`}
      />
    </button>
  );
}

function LayoutGlyph({ n }: { n: number }) {
  const cols = n <= 2 ? n : n <= 4 ? 2 : n <= 6 ? 3 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  return (
    <div
      className="grid h-6 w-6 gap-px bg-[#222] p-px"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="bg-[#787b86]" />
      ))}
    </div>
  );
}

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

/** Isolated so quote ticks don't re-render the whole top bar. */
function BuySellStrip({
  symbol,
  marginLabel,
  onSell,
  onBuy,
  onContextMenu,
}: {
  symbol: string;
  marginLabel: string;
  onSell: (price: number) => void;
  onBuy: (price: number) => void;
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
  const profileBlocked = livePhase === "switching" || livePhase === "degraded" || livePhase === "failed" || livePhase === "detached" || (connectedBroker === "binance" && liveProfileId !== null && (!liveReady || livePhase !== "ready"));
  const disabled = !quote || !feedLive || profileBlocked;
  const feedTitle = profileBlocked ? "Trading halted: profile switch in progress" : !feedLive ? "Trading halted: market data not live" : undefined;
  return (
    <div
      className="ml-1 flex w-[292px] shrink-0 items-center justify-end gap-1.5"
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
        className="flex h-[28px] w-[118px] shrink-0 items-center justify-center gap-1 rounded-full border border-[#f23645] px-2 text-[12px] font-semibold tabular-nums text-[#d1d4dc] hover:bg-[#1a1a1a] disabled:opacity-40"
        onClick={() => quote && onSell(bid)}
      >
        <span className="min-w-0 truncate">
          {quote ? formatPrice(symbol, bid) : "—"}
        </span>
        <span className="shrink-0">SELL</span>
      </button>
      <span className="w-9 shrink-0 text-center text-[11px] tabular-nums text-[#787b86]">
        {marginLabel}
      </span>
      <button
        type="button"
        disabled={disabled}
        title={feedTitle}
        className="flex h-[28px] w-[118px] shrink-0 items-center justify-center gap-1 rounded-full border border-[#2962ff] px-2 text-[12px] font-semibold tabular-nums text-[#d1d4dc] hover:bg-[#1a1a1a] disabled:opacity-40"
        onClick={() => quote && onBuy(ask)}
      >
        <span className="min-w-0 truncate">
          {quote ? formatPrice(symbol, ask) : "—"}
        </span>
        <span className="shrink-0">BUY</span>
      </button>
    </div>
  );
}

export function TopBar() {
  const pane = useActivePane();
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setTimeframe = useAppStore((s) => s.setTimeframe);
  const setLayout = useAppStore((s) => s.setLayout);
  const layoutCount = useAppStore((s) => s.layoutCount);
  const layoutMenuOpen = useAppStore((s) => s.layoutMenuOpen);
  const setLayoutMenuOpen = useAppStore((s) => s.setLayoutMenuOpen);
  const layoutSync = useAppStore((s) => s.layoutSync);
  const patchLayoutSync = useAppStore((s) => s.patchLayoutSync);
  const indicatorMenuOpen = useAppStore((s) => s.indicatorMenuOpen);
  const setIndicatorMenuOpen = useAppStore((s) => s.setIndicatorMenuOpen);
  const addIndicator = useAppStore((s) => s.addIndicator);
  const toggleOrientation = useAppStore((s) => s.toggleOrientation);
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
  const symbolTrading = useAppStore((s) => s.symbolTrading[pane.symbol]);
  const mockBalance = useAppStore((s) => s.mockBalance);
  void symbolTrading;
  void mockBalance;
  const marginLabel = formatMarginLabel(pane.symbol);
  const watchlist = useAppStore((s) => s.watchlist);
  const addToWatchlist = useAppStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist);
  const alerts = useAppStore((s) => s.alerts);
  const patchChartSettings = useAppStore((s) => s.patchChartSettings);
  const candleStyle = useAppStore((s) => s.chartSettings.candleStyle);
  const replay = useAppStore((s) => s.replay);
  const startReplay = useAppStore((s) => s.startReplay);
  const stopReplay = useAppStore((s) => s.stopReplay);
  const settingsOpen = useAppStore((s) => s.settingsOpen);
  const searchOpen = useAppStore((s) => s.searchOpen);
  const indicatorSettingsId = useAppStore((s) => s.indicatorSettingsId);
  const drawingSettingsTarget = useAppStore((s) => s.drawingSettingsTarget);
  const brokerDialogOpen = useAppStore((s) => s.brokerDialogOpen);
  const tfRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tplRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [tfMore, setTfMore] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [tplMenuOpen, setTplMenuOpen] = useState(false);
  const [tplBrowseAll, setTplBrowseAll] = useState(false);
  const indicatorTemplates = useAppStore((s) => s.indicatorTemplates);
  const activeIndicatorTemplateId = useAppStore((s) => s.activeIndicatorTemplateId);
  const activeTemplate =
    indicatorTemplates.find((t) => t.id === activeIndicatorTemplateId) ?? null;
  const activeTemplateName = activeTemplate?.name ?? "Null";
  const templateDirty = activeTemplate
    ? isIndicatorTemplateDirty(activeTemplate, pane.studies)
    : false;
  const saveIndicatorTemplate = useAppStore((s) => s.saveIndicatorTemplate);
  const applyIndicatorTemplate = useAppStore((s) => s.applyIndicatorTemplate);
  const toggleIndicatorTemplateFavorite = useAppStore(
    (s) => s.toggleIndicatorTemplateFavorite,
  );
  const removeIndicatorTemplate = useAppStore((s) => s.removeIndicatorTemplate);
  const starred = watchlist.includes(pane.symbol);
  const tfLabel = TIMEFRAMES.find((t) => t.id === pane.timeframe)?.label ?? pane.timeframe;

  const closeAllMenus = () => {
    setTfMore(false);
    setStyleOpen(false);
    setTplMenuOpen(false);
    setTplBrowseAll(false);
    setIndicatorMenuOpen(false);
    setLayoutMenuOpen(false);
    closeMenus();
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

  const toggleTplMenu = () => {
    const next = !tplMenuOpen;
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    if (next) setTplMenuOpen(true);
  };

  const toggleLayoutMenu = () => {
    const next = !layoutMenuOpen;
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    if (next) setLayoutMenuOpen(true);
  };

  const toggleSearch = () => {
    const next = !searchOpen;
    closeAllMenus();
    if (settingsOpen) setSettingsOpen(false);
    if (next) setSearchOpen(true);
  };

  const toggleSettings = () => {
    const next = !settingsOpen;
    closeAllMenus();
    setSettingsOpen(next);
  };

  const placeMarket = (side: "buy" | "sell", price: number) => {
    const trading = resolveSymbolTrading(pane.symbol);
    const qty = resolveOrderQty(pane.symbol, price);
    if (!(qty > 0)) return;
    // One id per user submit action; reused if this action is retried.
    const clientOrderId = newClientOrderId();
    if (trading.confirmOrders) {
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
      setTplMenuOpen(false);
      setTplBrowseAll(false);
      setIndicatorMenuOpen(false);
      setLayoutMenuOpen(false);
    }
  }, [
    settingsOpen,
    indicatorSettingsId,
    drawingSettingsTarget,
    brokerDialogOpen,
    setIndicatorMenuOpen,
    setLayoutMenuOpen,
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
      if (tplMenuOpen && !tplRef.current?.contains(t)) {
        setTplMenuOpen(false);
        setTplBrowseAll(false);
      }
      if (layoutMenuOpen && !layoutRef.current?.contains(t)) {
        setLayoutMenuOpen(false);
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
    tplMenuOpen,
    layoutMenuOpen,
    searchOpen,
    setIndicatorMenuOpen,
    setLayoutMenuOpen,
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
        className="relative z-[2] flex h-[28px] w-[120px] shrink-0 items-center justify-between gap-1.5 rounded-full bg-[var(--app-elevated)] px-3 hover:bg-[var(--app-border)]"
      >
        <span className="truncate text-[13px] font-semibold">{formatTicker(pane.symbol)}</span>
        <ChevronDown size={12} className="text-[#787b86]" />
      </button>

      <button
        type="button"
        title={starred ? "Remove from watchlist" : "Add to watchlist"}
        className="relative z-[2] ml-1 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[#787b86] hover:bg-[#1a1a1a] hover:text-[#d1d4dc]"
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
                on ? "bg-[#1a1a1a] text-[#d1d4dc]" : "text-[#b2b5be] hover:text-[#d1d4dc]"
              }`}
            >
              {tf.label}
            </button>
          );
        })}
        <div className="relative" ref={tfRef}>
          <button
            type="button"
            className="flex h-[26px] w-[20px] items-center justify-center text-[#787b86] hover:text-[#d1d4dc]"
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
          <span className="ml-1 text-[11px] text-[#787b86]">{tfLabel}</span>
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
                    <ChartStyleIcon id={s.id} className="text-[#b2b5be]" />
                    <span className="flex-1 text-left">{s.label}</span>
                    {on ? <span className="text-[12px] text-[#d1d4dc]">✓</span> : null}
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
            className="gap-1 px-2 text-[13px] text-[#d1d4dc]"
          >
            <IndicatorsIcon />
            Indicators
            <ChevronDown size={11} className="text-[#787b86]" />
          </ToolbarBtn>
          {indicatorMenuOpen && (
            <div className="menu" data-dropdown-open>
              {(
                [
                  ["volume", "Volume"],
                  ["vwap", "VWAP"],
                  ["ema", "EMA"],
                  ["bb", "Bollinger Bands"],
                  ["rsi", "RSI"],
                  ["stoch", "Stochastic"],
                  ["atr", "ATR"],
                  ["adx", "ADX"],
                  ["pmo", "PMO (Price Momentum Oscillator)"],
                  ["ob", "Order Blocks"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className="menu-row w-full text-left"
                  onClick={() => {
                    addIndicator(id);
                    setIndicatorMenuOpen(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="top-sep" />

        <ToolbarBtn
          label="Replay"
          className="gap-1 px-2 text-[13px]"
          active={Boolean(replay)}
          onClick={() => {
            closeAllMenus();
            if (replay) {
              stopReplay();
              return;
            }
            const candles = mawsFeed.getCandles(pane.symbol, pane.timeframe);
            const total = candles.length;
            const currentIndex = Math.max(1, total - 1);
            startReplay(pane.id, currentIndex, total);
          }}
        >
          <Rewind size={14} />
          Replay
        </ToolbarBtn>

        <span className="top-sep" />

        <ToolbarBtn label="Undo" onClick={closeAllMenus}>
          <Undo2 size={15} />
        </ToolbarBtn>
        <ToolbarBtn label="Redo" onClick={closeAllMenus}>
          <Redo2 size={15} />
        </ToolbarBtn>
      </div>

      <div className="relative z-[2] mx-0.5 min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <DrawingToolbar />
      </div>

      <div className="relative z-[2] flex shrink-0 items-center gap-0.5">
        <div className="relative z-[3]" ref={tplRef}>
          <div
            className={`toolbar-btn gap-0 px-1 text-[12px] ${
              tplMenuOpen ? "is-active" : ""
            } ${templateDirty ? "text-[#2962ff]" : "text-[#d1d4dc]"}`}
          >
            <button
              type="button"
              title={
                templateDirty && activeTemplate
                  ? `Save changes to “${activeTemplate.name}”`
                  : "Indicator templates"
              }
              aria-label={
                templateDirty && activeTemplate
                  ? `Save changes to “${activeTemplate.name}”`
                  : "Indicator templates"
              }
              className="flex h-full items-center gap-1 rounded-[4px] px-1"
              onClick={() => {
                if (templateDirty && activeTemplate) {
                  saveIndicatorTemplate(activeTemplate.name);
                  setTplMenuOpen(false);
                  return;
                }
                toggleTplMenu();
              }}
            >
              <span className={templateDirty ? "text-[#2962ff]" : undefined}>
                <TemplateIcon />
              </span>
              <span className="max-w-[140px] truncate">{activeTemplateName}</span>
            </button>
            <button
              type="button"
              title="Indicator templates"
              aria-label="Open indicator templates menu"
              aria-expanded={tplMenuOpen}
              className="flex h-full items-center rounded-[4px] px-1"
              onClick={toggleTplMenu}
            >
              <ChevronDown
                size={11}
                className={templateDirty ? "text-[#2962ff]" : "text-[#787b86]"}
              />
            </button>
          </div>
          {tplMenuOpen && (
            <div className="menu right-0 left-auto w-[320px]" data-dropdown-open>
              <button
                type="button"
                className="menu-row w-full"
                onClick={() => {
                  const name = window.prompt(
                    "Name this indicator template",
                    activeTemplate?.name ?? "My template",
                  );
                  if (!name?.trim()) return;
                  saveIndicatorTemplate(name.trim());
                  setTplMenuOpen(false);
                  setTplBrowseAll(false);
                }}
              >
                <CloudUpload size={15} className="text-[#b2b5be]" />
                Save indicator template...
              </button>
              {indicatorTemplates.length > 0 ? (
                <>
                  <div className="my-1 border-t border-[#2a2e39]" />
                  <div className="px-3 pb-1 pt-1 text-[10px] font-semibold tracking-[0.06em] text-[#787b86]">
                    {tplBrowseAll ? "ALL TEMPLATES" : "RECENTLY USED"}
                  </div>
                  {(tplBrowseAll
                    ? [...indicatorTemplates].sort((a, b) =>
                        a.name.localeCompare(b.name),
                      )
                    : [...indicatorTemplates]
                        .sort((a, b) => (b.lastUsedAt ?? 0) - (a.lastUsedAt ?? 0))
                        .slice(0, 8)
                  ).map((tpl) => (
                    <div
                      key={tpl.id}
                      className="group flex w-full items-center gap-2 px-3 py-2 hover:bg-[#1a1a1a]"
                    >
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          applyIndicatorTemplate(tpl.id);
                          setTplMenuOpen(false);
                          setTplBrowseAll(false);
                        }}
                      >
                        <div className="truncate text-[13px] font-semibold text-[#d1d4dc]">
                          {tpl.name}
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-[11px] leading-[14px] text-[#787b86]">
                          {templateSubtitle(tpl)}
                        </div>
                      </button>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          title={tpl.favorite ? "Unfavorite" : "Favorite"}
                          className={`flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[#2a2e39] ${
                            tpl.favorite ? "text-[#d1d4dc]" : "text-[#787b86]"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleIndicatorTemplateFavorite(tpl.id);
                          }}
                        >
                          <Star
                            size={14}
                            fill={tpl.favorite ? "currentColor" : "none"}
                            strokeWidth={1.6}
                          />
                        </button>
                        <button
                          type="button"
                          title="Delete template"
                          className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[#787b86] hover:bg-[#2a2e39] hover:text-[#f23645]"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeIndicatorTemplate(tpl.id);
                          }}
                        >
                          <Trash2 size={14} strokeWidth={1.6} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="my-1 border-t border-[#2a2e39]" />
                  <button
                    type="button"
                    className="menu-row w-full"
                    onClick={() => setTplBrowseAll(true)}
                  >
                    <FolderOpen size={15} className="text-[#b2b5be]" />
                    Open template...
                  </button>
                </>
              ) : (
                <div className="border-t border-[#2a2e39] px-3 py-3 text-[12px] leading-[16px] text-[#787b86]">
                  No saved templates yet. Set up your indicators, then save and name
                  this layout to reuse it later.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative mr-1" ref={layoutRef}>
          <ToolbarBtn
            label="Layouts"
            active={layoutMenuOpen}
            onClick={toggleLayoutMenu}
          >
            <LayoutGrid size={15} />
          </ToolbarBtn>
          {layoutMenuOpen && (
            <div className="menu right-0 left-auto w-[260px]" data-dropdown-open>
              <div className="grid grid-cols-4 gap-2 p-2">
                {LAYOUT_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    title={
                      layoutCount === n
                        ? "Reset pane sizes to default"
                        : `Switch to ${n} chart${n === 1 ? "" : "s"}`
                    }
                    onClick={() => setLayout(n)}
                    className={`flex flex-col items-center gap-1 rounded p-1 hover:bg-[#1a1a1a] ${
                      layoutCount === n ? "ring-1 ring-[#d1d4dc]" : ""
                    }`}
                  >
                    <LayoutGlyph n={n} />
                    <span className="text-[10px] text-[#787b86]">{n}</span>
                  </button>
                ))}
              </div>
              {(layoutCount === 2 || layoutCount === 6) && (
                <button type="button" className="menu-row w-full" onClick={toggleOrientation}>
                  Flip orientation
                </button>
              )}
              <div className="border-t border-[#2a2e39] px-3 pb-2 pt-2.5">
                <div className="mb-1.5 text-[10px] font-semibold tracking-[0.06em] text-[#787b86]">
                  SYNC IN LAYOUT
                </div>
                {SYNC_ROWS.map((row) => (
                  <div
                    key={row.key}
                    className="flex h-[32px] items-center justify-between gap-2 text-[13px] text-[#d1d4dc]"
                  >
                    <span className="flex items-center gap-1.5">
                      {row.label}
                      <span title={row.tip} className="text-[#787b86]">
                        <Info size={12} strokeWidth={2} />
                      </span>
                    </span>
                    <SyncSwitch
                      on={layoutSync[row.key]}
                      onClick={() => patchLayoutSync({ [row.key]: !layoutSync[row.key] })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <ToolbarBtn
          label="Settings"
          className="rounded-full"
          active={settingsOpen}
          data-settings-trigger
          onClick={toggleSettings}
        >
          <Settings size={15} />
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
            const handle = getChart(pane.id);
            if (!handle) return;
            const canvas = handle.chart.takeScreenshot(true, true);
            const a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = `${pane.symbol}-${pane.timeframe}.png`;
            a.click();
          }}
        >
          <Camera size={15} />
        </ToolbarBtn>
        {showBuySell ? (
          <BuySellStrip
            symbol={pane.symbol}
            marginLabel={marginLabel}
            onSell={(price) => placeMarket("sell", price)}
            onBuy={(price) => placeMarket("buy", price)}
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
