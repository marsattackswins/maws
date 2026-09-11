import { expect, test } from "@playwright/test";
import {
  FakeBinanceFeed,
  currentDayOpenSec,
  klineEvent,
  klineRows,
  miniTickerEvent,
} from "./fake-feed";

const KLINE_STREAM = "btcusdt@kline_1d";
const MINI_STREAM = "btcusdt@miniTicker";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

async function stubRest(page: import("@playwright/test").Page) {
  await page.route("**/api/binance/klines*", (route) => route.fulfill({ json: klineRows() }));
  await page.route("**/api/binance/symbols*", (route) => route.fulfill({ json: [] }));
  await page.route("**/api/binance/ticker*", (route) => route.fulfill({ json: [] }));
  await page.route("**/api/news/**", (route) => route.fulfill({ json: [] }));
  await page.route("**/api/calendar/**", (route) => route.fulfill({ json: [] }));
}

const FEED_STATE = {
  connecting: { label: "Connecting", color: "rgb(120, 123, 134)" },
  live: { label: "Live", color: "rgb(8, 153, 129)" },
  delayed: { label: "Data delayed", color: "rgb(242, 54, 69)" },
  reconnecting: { label: "Reconnecting", color: "rgb(255, 152, 0)" },
} as const;

async function expectFeedDot(
  page: import("@playwright/test").Page,
  state: keyof typeof FEED_STATE,
  timeout: number,
) {
  const dot = page.locator(
    `span[role="status"][aria-label="Market feed status: ${FEED_STATE[state].label}"]`,
  );
  await expect(dot).toBeVisible({ timeout });
  await expect(dot).toHaveCSS("background-color", FEED_STATE[state].color);
}

async function waitForKlineClient(feed: FakeBinanceFeed) {
  await expect.poll(() => feed.connections, { timeout: 20_000 }).toBeGreaterThan(0);
}

function broadcastPrice(feed: FakeBinanceFeed, price: number, eventTime?: number) {
  const t = eventTime ?? currentDayOpenSec();
  feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", t, price));
  feed.broadcast(miniTickerEvent(MINI_STREAM, "BTCUSDT", price, Date.now()));
}

async function setupPaperTrading(
  page: import("@playwright/test").Page,
  feed: FakeBinanceFeed,
  side: "buy" | "sell" = "buy",
) {
  await stubRest(page);
  await page.goto("/");
  await waitForKlineClient(feed);
  broadcastPrice(feed, 100);

  // Wait for feed to be live — the circuit breaker disables buttons otherwise.
  await expectFeedDot(page, "live", 15_000);

  const btn = page.getByRole("button", { name: side === "buy" ? /BUY/ : /SELL/ });
  await expect(btn).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(500);

  // First click opens broker dialog if no broker connected.
  await btn.click();
  await page.getByText("Paper Trading").click();

  // Second click submits the order.
  await btn.click();

  const row = page.locator("tbody tr").filter({ hasText: "BTCUSDT.P" });
  await expect(row).toBeVisible({ timeout: 15_000 });
  return { row };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test("SL exit closes at stop-loss level with negative PnL", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    const { row } = await setupPaperTrading(page, feed);
    await expect(row).toContainText("99.0"); // SL

    // Tick below SL (99) → should fill AT 99, not at tick price 98.
    broadcastPrice(feed, 98);

    await expect(row).toHaveCount(0, { timeout: 15_000 });
    // qty = 100*10/100 = 10; PnL = (99-100)*10 = -10
    await expect(page.getByText(/^Realized P&L:/)).toContainText("-10.00", { timeout: 15_000 });
    await expect(page.getByText(/^Account balance:/)).toContainText("99,990.00", {
      timeout: 15_000,
    });
  } finally {
    await feed.close();
  }
});

test("liquidation takes priority over SL and TP", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    const { row } = await setupPaperTrading(page, feed);

    // Tick at 85 breaches liq=91, SL=99 simultaneously.
    broadcastPrice(feed, 85);

    await expect(row).toHaveCount(0, { timeout: 15_000 });
    // Filled at liq=91, not SL=99. PnL ≈ (91-100)*10 = -90 (allow fp rounding).
    await expect(page.getByText(/^Realized P&L:/)).toContainText(/-89\.9[0-9]|-90\.00/, {
      timeout: 15_000,
    });
    await expect(page.getByText(/^Account balance:/)).toContainText(/99,910\.0[0-1]/, {
      timeout: 15_000,
    });
  } finally {
    await feed.close();
  }
});

test("gap through SL fills at SL level not tick price", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    const { row } = await setupPaperTrading(page, feed);

    // Large gap: tick at 95, well past SL=99. Must fill at 99.
    broadcastPrice(feed, 95);

    await expect(row).toHaveCount(0, { timeout: 15_000 });
    // If incorrectly filled at 95: PnL would be -50. Correct at 99: PnL = -10.
    await expect(page.getByText(/^Realized P&L:/)).toContainText("-10.00", { timeout: 15_000 });
    await expect(page.getByText(/^Account balance:/)).toContainText("99,990.00", {
      timeout: 15_000,
    });
  } finally {
    await feed.close();
  }
});

test("short position SL exit fills at SL level", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    // Short at 100: TP=98, SL=101, liq=109
    const { row } = await setupPaperTrading(page, feed, "sell");
    await expect(row).toContainText("101.0"); // SL for short

    // Tick above SL → fills at 101.
    broadcastPrice(feed, 105);

    await expect(row).toHaveCount(0, { timeout: 15_000 });
    // PnL = (100-101)*10 = -10
    await expect(page.getByText(/^Realized P&L:/)).toContainText("-10.00", { timeout: 15_000 });
    await expect(page.getByText(/^Account balance:/)).toContainText("99,990.00", {
      timeout: 15_000,
    });
  } finally {
    await feed.close();
  }
});

test("feed disconnect keeps position open with no automatic protection", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    const { row } = await setupPaperTrading(page, feed);
    await expectFeedDot(page, "live", 15_000);

    // Stop broadcasting — the WS connection stays alive but no frames arrive.
    // After >5s the feed shows "Data delayed"; after >15s it enters recovery.
    await expectFeedDot(page, "delayed", 20_000);

    // Position must still be open — no auto-close on feed staleness.
    await expect(row).toBeVisible();
    await expect(page.getByText(/^Available funds:/)).toContainText(/99,900\.0[0-1]/);

    // Wait for recovery phase (socket recycle + REST resync).
    await expectFeedDot(page, "reconnecting", 30_000);

    // Position STILL open through the entire outage window.
    await expect(row).toBeVisible();

    // The recovery recycled the socket; wait for the backoff reconnect to land.
    const connsBeforeRecovery = feed.connections;
    await expect
      .poll(() => feed.connections, { timeout: 40_000 })
      .toBeGreaterThan(connsBeforeRecovery);

    // Resume broadcasting — the new socket picks up fresh frames.
    broadcastPrice(feed, 100);
    await expectFeedDot(page, "live", 30_000);

    // Position survived the full disconnect/reconnect cycle.
    await expect(row).toBeVisible({ timeout: 15_000 });
  } finally {
    await feed.close();
  }
});

test("manual close updates PnL and removes position", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    const { row } = await setupPaperTrading(page, feed);

    // Move price to 101 (unrealized profit, below TP=102).
    broadcastPrice(feed, 101);
    await page.waitForTimeout(500);

    // Click the Close button in the position row.
    await row.locator("button", { hasText: "Close" }).click();

    await expect(row).toHaveCount(0, { timeout: 15_000 });
    // PnL = (101-100)*10 = 10
    await expect(page.getByText(/^Realized P&L:/)).toContainText("10.00", { timeout: 15_000 });
    await expect(page.getByText(/^Account balance:/)).toContainText("100,010.00", {
      timeout: 15_000,
    });
  } finally {
    await feed.close();
  }
});

test("insufficient margin silently drops order", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    await stubRest(page);

    // First load to create the persisted state.
    await page.goto("/");
    await page.waitForTimeout(1_000);

    // Read current state and patch mockBalance to 50.
    const patchedState = await page.evaluate(() => {
      const key = "maws.workspace.v6";
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      parsed.state.mockBalance = 50;
      return JSON.stringify(parsed);
    });

    // On next load, intercept localStorage.getItem to return patched state.
    if (patchedState) {
      await page.addInitScript((stateJson: string) => {
        const origGetItem = Storage.prototype.getItem;
        Storage.prototype.getItem = function (key: string) {
          if (key === "maws.workspace.v6") return stateJson;
          return origGetItem.call(this, key);
        };
      }, patchedState);
    }

    await page.reload();
    await waitForKlineClient(feed);
    // Wait for subscription to be established after reconnect, then seed price.
    await page.waitForTimeout(1_000);
    broadcastPrice(feed, 100);
    broadcastPrice(feed, 100);

    // Wait for feed to be live — circuit breaker disables buttons otherwise.
    await expectFeedDot(page, "live", 30_000);

    // Connect paper broker.
    const buy = page.getByRole("button", { name: /BUY/ });
    await expect(buy).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(500);
    await buy.click();
    await page.getByText("Paper Trading").click();

    // Attempt to buy — should silently drop (margin=100 > balance=50).
    await buy.click();
    await page.waitForTimeout(2_000);

    // No position opened.
    const row = page.locator("tbody tr").filter({ hasText: "BTCUSDT.P" });
    await expect(row).toHaveCount(0, { timeout: 3_000 });
  } finally {
    await feed.close();
  }
});

test("circuit breaker blocks orders when feed is delayed", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    const { row } = await setupPaperTrading(page, feed);
    await expectFeedDot(page, "live", 15_000);

    // Close the existing position so we can test opening a new one.
    await row.locator("button", { hasText: "Close" }).click();
    await expect(row).toHaveCount(0, { timeout: 15_000 });

    // Stop broadcasting — feed transitions to delayed after >5s.
    await expectFeedDot(page, "delayed", 20_000);

    // BUY button should be disabled when feed is not live.
    const buy = page.getByRole("button", { name: /BUY/ });
    await expect(buy).toBeDisabled({ timeout: 5_000 });

    // Even if somehow clicked (e.g. via keyboard), dispatch should block.
    await buy.click({ force: true });
    await page.waitForTimeout(2_000);

    // No position opened — circuit breaker blocked the order.
    const newRow = page.locator("tbody tr").filter({ hasText: "BTCUSDT.P" });
    await expect(newRow).toHaveCount(0, { timeout: 3_000 });
  } finally {
    await feed.close();
  }
});
