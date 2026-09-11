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

async function stubRest(page: import("@playwright/test").Page) {
  await page.route("**/api/binance/klines*", (route) => route.fulfill({ json: klineRows() }));
  await page.route("**/api/binance/symbols*", (route) => route.fulfill({ json: [] }));
  await page.route("**/api/binance/ticker*", (route) => route.fulfill({ json: [] }));
  await page.route("**/api/news/**", (route) => route.fulfill({ json: [] }));
  await page.route("**/api/calendar/**", (route) => route.fulfill({ json: [] }));
}

// Feed-health states: semantic label exposed via aria-label, plus the legend
// dot color. Tests must assert the label (color alone is not sufficient).
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

test("chart starts Connecting and becomes Live after a valid feed frame", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    await stubRest(page);
    await page.goto("/");

    // No frames yet → the pane dot must be gray (connecting), not green.
    await expectFeedDot(page, "connecting", 30_000);

    await waitForKlineClient(feed);
    feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", currentDayOpenSec(), 100));

    await expectFeedDot(page, "live", 15_000);
  } finally {
    await feed.close();
  }
});

test("stale feed shows Data delayed and returns to Live after recovery", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    await stubRest(page);
    await page.goto("/");
    await waitForKlineClient(feed);
    feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", currentDayOpenSec(), 100));
    await expectFeedDot(page, "live", 15_000);

    const connectionsAfterLive = feed.connections;

    // Silence: no frames for >5s → the dot turns red (delayed).
    await expectFeedDot(page, "delayed", 20_000);

    // Recovery: the feed reconnects (new connection) and REST-resyncs; once a
    // fresh valid frame arrives on the new socket, the dot returns to green.
    await expect
      .poll(() => feed.connections, { timeout: 40_000 })
      .toBeGreaterThan(connectionsAfterLive);

    // Recovery started but no fresh frame yet (broadcast withheld) → Reconnecting.
    await expectFeedDot(page, "reconnecting", 15_000);

    feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", currentDayOpenSec(), 100));
    await expectFeedDot(page, "live", 20_000);
  } finally {
    await feed.close();
  }
});

test("paper order opens, TP closes it, and position/P&L/balance update", async ({ page }) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    await stubRest(page);
    await page.goto("/");
    await waitForKlineClient(feed);
    // Seed market price 100 on both channels.
    feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", currentDayOpenSec(), 100));
    feed.broadcast(miniTickerEvent(MINI_STREAM, "BTCUSDT", 100, 1));

    const buy = page.getByRole("button", { name: /BUY/ });
    await expect(buy).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(500); // let the quote reach the button

    // First submit with no broker → broker dialog; connect the paper broker.
    await buy.click();
    await page.getByText("Paper Trading").click();

    // Now the real submit action: market buy fills at 100 with 2% TP / 1% SL.
    await buy.click();
    const row = page.locator("tbody tr").filter({ hasText: "BTCUSDT.P" });
    await expect(row).toBeVisible({ timeout: 15_000 });
    await expect(row).toContainText("100.0"); // avg fill
    await expect(row).toContainText("102.0"); // TP
    await expect(row).toContainText("99.0"); // SL

    // Price through TP → position closes at 102; values update visibly.
    feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", currentDayOpenSec(), 103));
    feed.broadcast(miniTickerEvent(MINI_STREAM, "BTCUSDT", 103, 2));

    await expect(row).toHaveCount(0, { timeout: 15_000 });
    // qty = margin 100 * leverage 10 / 100 = 10 → realized (102-100)*10 = 20.
    await expect(page.getByText(/^Realized P&L:/)).toContainText("20.00", { timeout: 15_000 });
    await expect(page.getByText(/^Account balance:/)).toContainText("100,020.00", {
      timeout: 15_000,
    });
  } finally {
    await feed.close();
  }
});

test("rapid timeframe switches never hit 'Object is disposed' and chart stays live", async ({
  page,
}) => {
  const feed = new FakeBinanceFeed(8787);
  const pageErrors: string[] = [];
  try {
    await stubRest(page);

    // Slow every rAF to emulate a loaded dev machine: the chart setup's
    // deferred two-frame publish then spans ~300ms, which is the exact window
    // where a fast TF click used to land chart.remove() under the pending
    // rAF callback ("Object is disposed").
    //
    // Diagnostics-only rAF trap: replaces rAF with a 120ms-delayed timeout
    // (slowing frames) while PRESERVING cancellation semantics — a cancelled
    // rAF really drops its callback — and logs the schedule-time stack of any
    // callback that throws, naming the code path that requested the frame.
    await page.addInitScript(() => {
      const origCancel = window.cancelAnimationFrame.bind(window);
      const pending = new Map<number, ReturnType<typeof setTimeout>>();
      let seq = 1;
      window.requestAnimationFrame = (cb) => {
        const stack = new Error().stack ?? "?";
        const id = seq++;
        const t = setTimeout(() => {
          pending.delete(id);
          try {
            cb(performance.now());
          } catch (e) {
            console.error(
              "[raf-fail] scheduled via:\n" + stack + "\n--- thrown ---\n" + String((e as Error)?.stack ?? e),
            );
          }
        }, 120);
        pending.set(id, t);
        return id;
      };
      window.cancelAnimationFrame = (rafId) => {
        const t = pending.get(rafId);
        if (t !== undefined) {
          clearTimeout(t);
          pending.delete(rafId);
        } else {
          origCancel(rafId);
        }
      };
    });

    page.on("pageerror", (err) => pageErrors.push(err.stack ?? String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error" && /disposed/i.test(msg.text())) pageErrors.push(msg.text());
    });

    await page.goto("/");
    await waitForKlineClient(feed);
    feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", currentDayOpenSec(), 100));
    await expectFeedDot(page, "live", 20_000);

    // Rapid-fire TF switching — no settling between clicks.
    for (const tf of ["15m", "5m", "15m", "5m", "1m"]) {
      await page.getByRole("button", { name: tf, exact: true }).click();
    }

    // Then let everything settle and go QUIESCENT before one final switch:
    // with no pending frames, chart removal schedules its draw directly into
    // the disposed bindings — the exact real-browser crash condition.
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: "1m", exact: true }).click();

    // The pane now subscribes btcusdt@kline_1m; it goes connecting until a
    // fresh frame arrives on the new stream, which proves the recreated chart
    // is alive and processing (a disposed instance could not update).
    await expectFeedDot(page, "connecting", 20_000);
    const minuteOpen = Math.floor(Date.now() / 60_000) * 60;
    feed.broadcast(klineEvent("btcusdt@kline_1m", "BTCUSDT", "1m", minuteOpen, 105));
    await expectFeedDot(page, "live", 20_000);

    expect(pageErrors).toEqual([]);
  } finally {
    await feed.close();
  }
});

test("position tool entry/TP/SL and extent dragging update drawing and labels", async ({
  page,
}) => {
  const feed = new FakeBinanceFeed(8787);
  try {
    await stubRest(page);
    await page.goto("/");
    await waitForKlineClient(feed);
    feed.broadcast(klineEvent(KLINE_STREAM, "BTCUSDT", "1d", currentDayOpenSec(), 100));
    await expectFeedDot(page, "live", 15_000);

    const host = page.locator("[data-chart-host]").first();
    await expect(host).toBeVisible({ timeout: 30_000 });
    const box = await host.boundingBox();
    if (!box) throw new Error("chart host not measurable");

    // Magnet snaps dragged points to candle OHLC; with flat seeded candles that
    // would pin every drag to 100. Turn it off for free dragging.
    await page.locator('button[title="Magnet"]').click();

    await page.locator('button[title="Long position"]').click();
    const ex = box.x + 350;
    const ey = box.y + 450;
    await page.mouse.move(ex, ey);
    await page.mouse.down();
    await page.mouse.move(ex + 160, ey - 90, { steps: 8 });
    await page.mouse.up();

    const entryLabel = page.locator("svg text", { hasText: "Entry " });
    const tpLabel = page.locator("svg text", { hasText: "TP " });
    const slLabel = page.locator("svg text", { hasText: "SL " });
    await expect(entryLabel).toBeVisible({ timeout: 10_000 });
    await expect(tpLabel).toBeVisible();
    await expect(slLabel).toBeVisible();
    const entryBefore = await entryLabel.textContent();

    // Select the drawing (click the entry line), then drag the entry handle.
    // Keep >450ms between clicks: a faster second press is treated as a
    // double-click and opens the drawing settings dialog instead of dragging.
    await page.mouse.click(ex + 80, ey);
    await page.waitForTimeout(600);
    const entryHandle = page.locator('svg rect[cursor="move"]');
    await expect(entryHandle).toBeVisible({ timeout: 10_000 });
    const hb = await entryHandle.boundingBox();
    if (!hb) throw new Error("entry handle not measurable");
    await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
    await page.mouse.down();
    await page.mouse.move(hb.x + 4, hb.y + 70, { steps: 8 });
    await page.mouse.up();

    await expect
      .poll(async () => await entryLabel.textContent(), { timeout: 10_000 })
      .not.toBe(entryBefore);

    // Extent drag: right handle widens the tool; label x moves right.
    await page.waitForTimeout(600);
    await page.mouse.click(ex + 80, ey + 66); // re-select after entry move
    await page.waitForTimeout(600);
    const extentHandle = page.locator('svg rect[cursor="ew-resize"]');
    await expect(extentHandle).toBeVisible({ timeout: 10_000 });
    const tpBoxBefore = await tpLabel.boundingBox();
    const eb = await extentHandle.boundingBox();
    if (!eb || !tpBoxBefore) throw new Error("extent handle/label not measurable");
    await page.mouse.move(eb.x + eb.width / 2, eb.y + eb.height / 2);
    await page.mouse.down();
    await page.mouse.move(eb.x + 90, eb.y + eb.height / 2, { steps: 8 });
    await page.mouse.up();

    await expect
      .poll(async () => (await tpLabel.boundingBox())?.x ?? -1, { timeout: 10_000 })
      .toBeGreaterThan(tpBoxBefore.x + 20);
  } finally {
    await feed.close();
  }
});
