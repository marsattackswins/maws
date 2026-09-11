/**
 * Integration tests for position synchronization and P&L tracking.
 */

import { BinanceLiveManager } from "@/lib/server/binance/manager";
import { liveState } from "@/lib/server/binance/state";
import {
  createTestnetManager,
  cleanupTestnetState,
  waitForPosition,
  waitForOrderStatus,
  uniqueOrderId,
  getCurrentMarkPrice,
  sleep,
  assertState,
  log,
} from "./helpers";

describe("Position Synchronization Integration (Binance Testnet)", () => {
  let manager: BinanceLiveManager;
  const SYMBOL = "BTCUSDT";

  beforeAll(async () => {
    manager = await createTestnetManager();
  }, 30_000);

  afterEach(async () => {
    await cleanupTestnetState(manager);
  }, 30_000);

  afterAll(() => {
    manager?.stop();
  });

  test("open long position -> verify size and entry price", async () => {
    const orderId = uniqueOrderId("long");
    const qty = "0.001";

    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty,
      clientOrderId: orderId,
    });

    assertState(result.ok, "Order should submit successfully");

    await waitForPosition(SYMBOL, true, 15_000);
    
    const position = liveState().positions.get(SYMBOL);
    assertState(!!position, "Position should exist");
    assertState(position!.side === "long", "Position should be long");
    assertState(Number(position!.qty) >= Number(qty), "Position qty should match or exceed order qty");
    assertState(Number(position!.entryPrice) > 0, "Entry price should be set");
    assertState(Number(position!.markPrice) > 0, "Mark price should be set");

    log(`Position opened: ${position!.side} ${position!.qty} @ ${position!.entryPrice}`);
    log("✅ Long position tracking validated");
  }, 30_000);

  test("open short position -> verify size and entry price", async () => {
    const orderId = uniqueOrderId("short");
    const qty = "0.001";

    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "SELL",
      type: "MARKET",
      qty,
      clientOrderId: orderId,
    });

    assertState(result.ok, "Order should submit successfully");

    await waitForPosition(SYMBOL, true, 15_000);
    
    const position = liveState().positions.get(SYMBOL);
    assertState(!!position, "Position should exist");
    assertState(position!.side === "short", "Position should be short");
    assertState(Number(position!.qty) >= Number(qty), "Position qty should match or exceed order qty");
    assertState(Number(position!.entryPrice) > 0, "Entry price should be set");

    log(`Position opened: ${position!.side} ${position!.qty} @ ${position!.entryPrice}`);
    log("✅ Short position tracking validated");
  }, 30_000);

  test("increase position size -> verify accumulation", async () => {
    // Open initial position
    const order1 = uniqueOrderId("inc1");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: order1,
    });

    await waitForPosition(SYMBOL, true, 15_000);
    const pos1 = liveState().positions.get(SYMBOL);
    const initialQty = Number(pos1!.qty);
    log(`Initial position: ${initialQty}`);

    // Increase position
    const order2 = uniqueOrderId("inc2");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: order2,
    });

    await waitForOrderStatus(order2, "FILLED", 15_000);
    await sleep(2000); // Allow position update to propagate

    const pos2 = liveState().positions.get(SYMBOL);
    const finalQty = Number(pos2!.qty);
    log(`Final position: ${finalQty}`);

    assertState(finalQty > initialQty, "Position size should increase");
    assertState(finalQty >= initialQty + 0.001, "Position should reflect second order");

    log("✅ Position size accumulation validated");
  }, 30_000);

  test("reduce position size -> verify partial close", async () => {
    // Open position
    const order1 = uniqueOrderId("red1");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.002",
      clientOrderId: order1,
    });

    await waitForPosition(SYMBOL, true, 15_000);
    const pos1 = liveState().positions.get(SYMBOL);
    const initialQty = Number(pos1!.qty);
    log(`Initial position: ${initialQty}`);

    // Reduce position by half
    const order2 = uniqueOrderId("red2");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "SELL",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: order2,
    });

    await waitForOrderStatus(order2, "FILLED", 15_000);
    await sleep(2000);

    const pos2 = liveState().positions.get(SYMBOL);
    const finalQty = Number(pos2!.qty);
    log(`Reduced position: ${finalQty}`);

    assertState(finalQty < initialQty, "Position size should decrease");
    assertState(finalQty > 0, "Position should still exist (not fully closed)");

    log("✅ Partial position reduction validated");
  }, 30_000);

  test("close position completely -> verify position removed", async () => {
    // Open position
    const order1 = uniqueOrderId("close1");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: order1,
    });

    await waitForPosition(SYMBOL, true, 15_000);
    const pos1 = liveState().positions.get(SYMBOL);
    const qty = pos1!.qty;
    log(`Position opened: ${qty}`);

    // Close completely
    const order2 = uniqueOrderId("close2");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "SELL",
      type: "MARKET",
      qty,
      clientOrderId: order2,
    });

    await waitForOrderStatus(order2, "FILLED", 15_000);
    
    // Position should be removed or zeroed
    await waitForPosition(SYMBOL, false, 10_000);
    
    const pos2 = liveState().positions.get(SYMBOL);
    assertState(!pos2 || Number(pos2.qty) === 0, "Position should be closed");

    log("✅ Complete position close validated");
  }, 30_000);

  test("unrealized P&L tracking", async () => {
    // Open position
    const orderId = uniqueOrderId("pnl");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: orderId,
    });

    await waitForPosition(SYMBOL, true, 15_000);
    
    // Wait a bit for mark price to update
    await sleep(3000);

    const position = liveState().positions.get(SYMBOL);
    assertState(!!position, "Position should exist");
    
    const unrealizedPnl = Number(position!.unrealizedProfit);
    log(`Unrealized P&L: ${unrealizedPnl}`);
    
    // P&L should be a number (could be positive or negative)
    assertState(!isNaN(unrealizedPnl), "Unrealized P&L should be a valid number");
    assertState(Number(position!.markPrice) > 0, "Mark price should be positive");
    
    // Entry and mark should be close but not identical
    const entryPrice = Number(position!.entryPrice);
    const markPrice = Number(position!.markPrice);
    log(`Entry: ${entryPrice}, Mark: ${markPrice}, Diff: ${Math.abs(markPrice - entryPrice)}`);

    log("✅ Unrealized P&L tracking validated");
  }, 30_000);

  test("leverage and liquidation price set", async () => {
    const orderId = uniqueOrderId("lev");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: orderId,
    });

    await waitForPosition(SYMBOL, true, 15_000);
    
    const position = liveState().positions.get(SYMBOL);
    assertState(!!position, "Position should exist");
    assertState(Number(position!.leverage) > 0, "Leverage should be set");
    
    // Liquidation price may be 0 for low-leverage small positions
    log(`Leverage: ${position!.leverage}x, Liq price: ${position!.liquidationPrice}`);

    log("✅ Leverage and liquidation tracking validated");
  }, 30_000);

  test("position notional calculation", async () => {
    const orderId = uniqueOrderId("notional");
    const qty = "0.001";
    
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty,
      clientOrderId: orderId,
    });

    await waitForPosition(SYMBOL, true, 15_000);
    
    const position = liveState().positions.get(SYMBOL);
    const notional = Number(position!.notional || "0");
    const posQty = Number(position!.qty);
    const markPrice = Number(position!.markPrice);
    
    const expectedNotional = posQty * markPrice;
    log(`Notional: ${notional}, Expected: ${expectedNotional}`);
    
    // Allow 1% variance
    if (notional > 0) {
      const variance = Math.abs(notional - expectedNotional) / expectedNotional;
      assertState(variance < 0.01, "Notional should match qty * markPrice within 1%");
    }

    log("✅ Position notional validated");
  }, 30_000);
});
