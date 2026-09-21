import { beforeEach, describe, expect, test } from "@jest/globals";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";import { BottomPanel,
  formatPanelDateTime,
  hasConfirmedBroker,
  isPanelTabActive,
  PANEL_TAB_CLASS,
  PANEL_TABS,
  PANEL_TOOLBAR_HEIGHT,
  panelHeightLimit,
} from "@/components/shell/BottomPanel";
import { computePosRows, PositionsPanel, TradingMetrics } from "@/components/trading/PositionsPanel";
import { useLiveStore } from "@/lib/live/store";
import { disconnectBroker } from "@/lib/trading/mock";
import { useAppStore } from "@/lib/store";

const emptyLive = {
  attached: false,
  profileId: null,
  environment: null,
  phase: "idle" as const,
  ready: false,
  executionAllowed: false,
  generation: 0,
  reasonCode: null,
  managerStatus: "idle",
  managerError: null,
  account: null,
  positions: [],
  orders: [],
  fills: [],
  health: null,
  stream: null,
  notices: [],
};

function panelMarkup(): string {
  return renderToStaticMarkup(createElement(BottomPanel));
}

function panelVisible(): boolean {
  return hasConfirmedBroker(useAppStore.getState().connectedBroker, useLiveStore.getState());
}

describe("bottom trading panel attachment visibility", () => {
  beforeEach(() => {
    useAppStore.setState({
      connectedBroker: null,
      brokerDialogOpen: false,
      bottomOpen: false,
      bottomTab: "positions",
    });
    useLiveStore.setState(emptyLive);
  });

  test("chart-only mode renders no panel, tabs, clock/date, or timezone selector", () => {
    const markup = panelMarkup();

    expect(markup).toBe("");
    expect(markup).not.toContain("Positions");
    expect(markup).not.toContain("Orders");
    expect(markup).not.toContain("Timezone");
    expect(markup).not.toMatch(/\d{1,2}:\d{2}/);
  });

  test("opening the Trade menu alone does not render the panel", () => {
    useAppStore.setState({ brokerDialogOpen: true });

    expect(panelMarkup()).toBe("");
  });

  test("Paper Trading renders the panel after Paper is attached", () => {
    useAppStore.setState({ connectedBroker: "mock" });

    expect(panelVisible()).toBe(true);
  });

  test("Testnet renders only after server-confirmed readiness", () => {
    useAppStore.setState({ connectedBroker: "binance" });
    useLiveStore.setState({
      profileId: "binance-testnet",
      environment: "testnet",
      phase: "switching",
      attached: false,
      ready: false,
    });
    expect(panelVisible()).toBe(false);

    useLiveStore.setState({ attached: true, phase: "ready", ready: true });
    expect(panelVisible()).toBe(true);
  });

  test("Production renders only after server-confirmed readiness", () => {
    useAppStore.setState({ connectedBroker: "binance" });
    useLiveStore.setState({
      profileId: "binance-production",
      environment: "production",
      phase: "ready",
      attached: true,
      ready: true,
    });

    expect(panelVisible()).toBe(true);
  });

  test("pending authentication does not render a new panel", () => {
    useLiveStore.setState({
      profileId: "binance-testnet",
      environment: "testnet",
      phase: "idle",
      ready: false,
      attached: false,
    });

    expect(panelVisible()).toBe(false);
  });

  test("pending switching does not replace the confirmed broker prematurely", () => {
    useAppStore.setState({ connectedBroker: "binance" });
    useLiveStore.setState({
      profileId: "binance-testnet",
      environment: "testnet",
      phase: "switching",
      ready: false,
      attached: true,
    });

    expect(panelVisible()).toBe(true);
    expect(hasConfirmedBroker("binance", useLiveStore.getState())).toBe(true);
  });

  test("failed switching leaves chart-only mode without a prior confirmed broker", () => {
    useLiveStore.setState({ phase: "failed", ready: false, attached: false });

    expect(panelVisible()).toBe(false);
  });

  test("disconnect removes the panel without cancelling or flattening paper books", () => {
    const orders = [{ id: "paper-order" } as never];
    const positions = [{ id: "paper-position" } as never];
    useAppStore.setState({ connectedBroker: "mock", orders, positions });
    expect(panelVisible()).toBe(true);

    disconnectBroker();

    expect(panelVisible()).toBe(false);
    expect(useAppStore.getState().orders).toEqual(orders);
    expect(useAppStore.getState().positions).toEqual(positions);
  });

  test("failed switching preserves the previous confirmed panel", () => {
    useAppStore.setState({ connectedBroker: "binance" });
    useLiveStore.setState({
      profileId: "binance-testnet",
      environment: "testnet",
      phase: "ready",
      ready: true,
      attached: true,
    });

    expect(panelVisible()).toBe(true);
  });

  test.each(["degraded", "failed", "detached"] as const)(
    "%s live state does not render a panel without a confirmed attachment",
    (phase) => {
      useAppStore.setState({ connectedBroker: "binance" });
      useLiveStore.setState({ phase, ready: false, attached: false });

      expect(panelVisible()).toBe(false);
    },
  );

  test("keeps all five tabs in a fixed toolbar slot with visible active state", () => {
    expect(PANEL_TABS.map((item) => item.label)).toEqual([
      "Positions",
      "Orders",
      "Order History",
      "Balance History",
      "Trading Journal",
    ]);
    expect(PANEL_TOOLBAR_HEIGHT).toBe(32);
    expect(PANEL_TAB_CLASS).toContain("h-[32px]");
    expect(PANEL_TAB_CLASS).toContain("after:h-[2px]");
    expect(PANEL_TAB_CLASS).toContain("after:content-");
    expect(PANEL_TAB_CLASS).toContain("bg-transparent");
    expect(PANEL_TAB_CLASS).toContain("px-3");
    expect(PANEL_TAB_CLASS).toContain("font-medium");
    expect(isPanelTabActive("orders", true, "orders")).toBe(true);
    expect(isPanelTabActive("orders", false, "orders")).toBe(false);
    expect(isPanelTabActive("orders", true, "positions")).toBe(false);
  });

  test("date/time follows the chart timezone in compact 12-hour format without seconds or year", () => {
    const instant = new Date("2024-01-02T13:05:09.000Z");

    expect(formatPanelDateTime(instant, "UTC")).toBe("Jan 2 · 1:05 PM");
    expect(formatPanelDateTime(instant, "America/New_York")).toBe("Jan 2 · 8:05 AM");
    expect(formatPanelDateTime(instant, "UTC")).not.toMatch(/:\d{2}:\d{2}/);
    expect(formatPanelDateTime(instant, "UTC")).not.toMatch(/2024/);
  });

  test("metrics strip shows the six compact segmented metrics", () => {
    useAppStore.setState({ connectedBroker: "mock" });
    const markup = renderToStaticMarkup(createElement(TradingMetrics));

    for (const label of ["Balance", "Equity", "Realized", "Unrealized", "Available", "Buffer"]) {
      expect(markup).toContain(label);
    }
    // The two margin metrics are gone from the strip.
    expect(markup).not.toContain("Account margin");
    expect(markup).not.toContain("Orders margin");
    // Segmented pill: uppercase labels over values with divider borders.
    expect(markup).toContain("uppercase");
    expect(markup).toContain("border-l");
  });

  test("P&L metrics carry explicit signs and buffer is an integer percentage", () => {
    useAppStore.setState({ connectedBroker: "mock", mockRealized: 0 });
    const markup = renderToStaticMarkup(createElement(TradingMetrics));

    // Zero P&L renders with an explicit plus sign and neutral-positive tone.
    expect(markup).toContain(">+0.00<");
    expect(markup).toContain("100%");
    expect(markup).not.toContain(">0.00<");
  });

  test("expanded and dragged panel heights are capped by half the application height", () => {
    expect(panelHeightLimit(900, 1000)).toBe(500);
    expect(panelHeightLimit(900, 700)).toBe(350);
    expect(panelHeightLimit(300, 1000)).toBe(300);
    expect(panelHeightLimit(900, 200)).toBe(100);
  });

  test("live position PnL uses mark price, not last-trade price", () => {
    const livePositions = [
      {
        id: "pos-btc",
        symbol: "BTCUSDT",
        side: "long" as const,
        entry: 50_000,
        qty: 2,
        leverage: 10,
        mark: 60_000,
        unrealized: 15_000, // static server poll snapshot
        openedAt: Date.now(),
      },
    ];

    // Case 1: Mark price is available from the live stream (60,000)
    // lastOf returns a different last-trade price (62,000), but mark price should be prioritized
    const rowsLive = computePosRows(livePositions, true, (sym) => (sym === "BTCUSDT" ? 62_000 : 0));
    expect(rowsLive).toHaveLength(1);
    const rowLive = rowsLive[0];
    // Should use mark price (60,000), not last-trade price (62,000)
    expect(rowLive.last).toBe(60_000);
    // Notional = qty * mark = 2 * 60,000 = 120,000
    expect(rowLive.notional).toBe(120_000);
    // Margin = notional / leverage = 120,000 / 10 = 12,000
    const mgnLive = rowLive.notional / rowLive.leverage;
    expect(mgnLive).toBe(12_000);
    // PnL = (mark - entry) * qty = (60,000 - 50,000) * 2 = 20,000
    expect(rowLive.pnl).toBe(20_000);

    // Case 2: Mark price is not available, falls back to server-calculated unrealized PnL
    // to avoid incorrectly zeroing PnL by using entry as market price
    const rowsNoMark = computePosRows(
      [{ ...livePositions[0], mark: undefined }],
      true,
      () => 0,
    );
    expect(rowsNoMark).toHaveLength(1);
    const rowNoMark = rowsNoMark[0];
    expect(rowNoMark.last).toBe(50_000);
    expect(rowNoMark.notional).toBe(100_000);
    // Should use server-calculated unrealized PnL (15,000), not calculate from entry (which would be 0)
    expect(rowNoMark.pnl).toBe(15_000);

    // Case 3: Paper mode (live=false) still uses last-trade price for backwards compatibility
    const rowsPaper = computePosRows(livePositions, false, (sym) => (sym === "BTCUSDT" ? 62_000 : 0));
    expect(rowsPaper).toHaveLength(1);
    const rowPaper = rowsPaper[0];
    expect(rowPaper.last).toBe(62_000);
    expect(rowPaper.notional).toBe(124_000);
    expect(rowPaper.pnl).toBe(24_000);
  });
});
