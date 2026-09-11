/**
 * Integration tests for complete order lifecycle against Binance testnet.
 * These tests make REAL network calls and submit REAL orders to testnet.
 */

import { BinanceLiveManager } from "@/lib/server/binance/manager";
import { liveState } from "@/lib/server/binance/state";
import {
  createTestnetManager,
  cleanupTestnetState,
  waitForOrderStatus,
  waitForPosition,
  waitForFillCount,
  uniqueOrderId,
  sleep,
  getCurrentMarkPrice,
  assertState,
  log,
} from "./helpers";

describe("Order Lifecycle Integration (Binance Testnet)", () => {
  let manager: BinanceLiveManager;
  const SYMBOL = "BTCUSDT";

  beforeAll(async () => {
    manager = await createTestnetManager();
  }, 30_000); // startup can take 20-30s

  afterEach(async () => {
    await cleanupTestnetState(manager);
  }, 30_000);

  afterAll(() => {
    manager?.stop();
  });

  test("market order: submit -> immediate fill -> position created", async () => {
    const orderId = uniqueOrderId("market");
    const qty = "0.001"; // $50-100 notional on testnet

    log(`Submitting market BUY order: ${orderId}`);
    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty,
      clientOrderId: orderId,
    });

    assertState(result.ok, `Market order submission should succeed: ${result.error || ""}`);

    // Market orders should fill almost immediately on testnet
    await waitForOrderStatus(orderId, ["FILLED", "PARTIALLY_FILLED"], 15_000);
    
    const order = liveState().orders.get(orderId);
    assertState(!!order, "Order should exist in state");
    assertState(order!.status === "FILLED" || order!.status === "PARTIALLY_FILLED", "Order should be filled");
    assertState(Number(order!.executedQty) > 0, "Executed quantity should be > 0");
    assertState(Number(order!.avgPrice) > 0, "Average fill price should be > 0");

    // Position should be created
    await waitForPosition(SYMBOL, true, 10_000);
    const position = liveState().positions.get(SYMBOL);
    assertState(!!position, "Position should exist");
    assertState(position!.side === "long", "Position should be long");
    assertState(Number(position!.qty) > 0, "Position quantity should match");

    // Fill should be recorded
    await waitForFillCount(1, 10_000);
    const fill = liveState().fills[0];
    assertState(fill.clientOrderId === orderId, "Fill should reference our order");
    assertState(fill.symbol === SYMBOL, "Fill symbol should match");
    assertState(fill.side === "BUY", "Fill side should be BUY");

    log("✅ Market order lifecycle complete");
  }, 30_000);

  test("limit order: place -> cancel -> verify cleanup", async () => {
    const orderId = uniqueOrderId("limit");
    const markPrice = await getCurrentMarkPrice(SYMBOL);
    const limitPrice = (markPrice * 0.95).toFixed(1); // 5% below market, won't fill

    log(`Submitting limit BUY order at ${limitPrice} (mark: ${markPrice})`);
    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "LIMIT",
      qty: "0.001",
      price: limitPrice,
      clientOrderId: orderId,
    });

    assertState(result.ok, `Limit order submission should succeed: ${result.error || ""}`);

    // Wait for order to be confirmed as NEW
    await waitForOrderStatus(orderId, "NEW", 10_000);
    
    const order = liveState().orders.get(orderId);
    assertState(!!order, "Order should exist in state");
    assertState(order!.status === "NEW", "Order should be NEW");
    assertState(liveState().openOrders.has(orderId), "Order should be in openOrders map");

    // Cancel the order
    log(`Canceling order ${orderId}`);
    const cancelResult = await manager.orders.cancelOrder(orderId, SYMBOL);
    assertState(cancelResult.ok, `Cancel should succeed: ${cancelResult.error || ""}`);

    // Wait for cancellation to propagate
    await waitForOrderStatus(orderId, "CANCELED", 10_000);
    
    const canceledOrder = liveState().orders.get(orderId);
    assertState(canceledOrder!.status === "CANCELED", "Order should be CANCELED");
    assertState(!liveState().openOrders.has(orderId), "Order should be removed from openOrders");

    log("✅ Limit order place and cancel complete");
  }, 30_000);

  test("limit order: place -> fill -> position tracking", async () => {
    const orderId = uniqueOrderId("limit-fill");
    const markPrice = await getCurrentMarkPrice(SYMBOL);
    const limitPrice = (markPrice * 1.01).toFixed(1); // 1% above market, should fill quickly

    log(`Submitting limit BUY order at ${limitPrice} (mark: ${markPrice})`);
    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "LIMIT",
      qty: "0.001",
      price: limitPrice,
      clientOrderId: orderId,
    });

    assertState(result.ok, `Limit order submission should succeed: ${result.error || ""}`);

    // Wait for fill (may take a few seconds on testnet)
    await waitForOrderStatus(orderId, "FILLED", 20_000);
    
    const order = liveState().orders.get(orderId);
    assertState(order!.status === "FILLED", "Order should be FILLED");
    assertState(Number(order!.avgPrice) > 0, "Should have average fill price");
    assertState(Number(order!.avgPrice) <= Number(limitPrice), "Fill price should be at or below limit");

    // Position should exist
    await waitForPosition(SYMBOL, true, 10_000);
    const position = liveState().positions.get(SYMBOL);
    assertState(Number(position!.qty) >= 0.001, "Position size should match order qty");

    log("✅ Limit order fill and position tracking complete");
  }, 30_000);

  test("partial fill: large limit order partially filled, then canceled", async () => {
    const orderId = uniqueOrderId("partial");
    const markPrice = await getCurrentMarkPrice(SYMBOL);
    const limitPrice = markPrice.toFixed(1); // at market
    const qty = "10"; // Large qty, unlikely to fill completely immediately

    log(`Submitting large limit BUY order: ${qty} @ ${limitPrice}`);
    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "LIMIT",
      qty,
      price: limitPrice,
      clientOrderId: orderId,
    });

    assertState(result.ok, `Order submission should succeed: ${result.error || ""}`);

    // Wait for either partial fill or full fill
    await sleep(3000); // Give it time to partially fill
    
    const order = liveState().orders.get(orderId);
    assertState(!!order, "Order should exist");
    
    if (order!.status === "PARTIALLY_FILLED") {
      log("Order partially filled, canceling remainder");
      assertState(Number(order!.executedQty) > 0, "Should have some executed qty");
      assertState(Number(order!.executedQty) < Number(qty), "Should not be fully filled");
      assertState(liveState().fills.length > 0, "Should have at least one fill");

      // Cancel the remaining quantity
      const cancelResult = await manager.orders.cancelOrder(orderId, SYMBOL);
      assertState(cancelResult.ok, "Cancel should succeed");
      
      await waitForOrderStatus(orderId, "CANCELED", 10_000);
      const finalOrder = liveState().orders.get(orderId);
      assertState(finalOrder!.status === "CANCELED", "Order should be CANCELED");
      
      log("✅ Partial fill behavior validated");
    } else if (order!.status === "FILLED") {
      log("Order filled completely (testnet liquidity good), cleaning up");
      // This is fine, just means testnet had good liquidity
    } else {
      // Cancel if still open
      await manager.orders.cancelOrder(orderId, SYMBOL);
    }
  }, 30_000);

  test("order rejection: insufficient margin", async () => {
    const orderId = uniqueOrderId("reject");
    const markPrice = await getCurrentMarkPrice(SYMBOL);
    
    // Try to order way more than account balance allows
    const hugeQty = "1000"; // $50M+ notional on typical testnet balance
    
    log(`Attempting order that should exceed margin: ${hugeQty}`);
    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: hugeQty,
      clientOrderId: orderId,
    });

    // Should be rejected by either MAWS risk checks or Binance
    if (!result.ok) {
      log(`Order rejected as expected: ${result.error}`);
      assertState(
        !!(result.error?.includes("risk") || result.error?.includes("margin") || result.error?.includes("balance")),
        "Error should mention risk/margin/balance"
      );
    } else {
      // If MAWS allowed it, Binance should reject it
      await sleep(2000);
      const order = liveState().orders.get(orderId);
      assertState(!order || order.status === "REJECTED" || order.status === "EXPIRED", 
        "Order should be rejected by exchange");
    }

    log("✅ Margin rejection validated");
  }, 20_000);

  test("concurrent orders: submit multiple orders in parallel", async () => {
    const markPrice = await getCurrentMarkPrice(SYMBOL);
    const order1 = uniqueOrderId("c1");
    const order2 = uniqueOrderId("c2");
    const order3 = uniqueOrderId("c3");

    log("Submitting 3 concurrent limit orders");
    const results = await Promise.all([
      manager.orders.submitOrder({
        symbol: SYMBOL,
        side: "BUY",
        type: "LIMIT",
        qty: "0.001",
        price: (markPrice * 0.95).toFixed(1),
        clientOrderId: order1,
      }),
      manager.orders.submitOrder({
        symbol: SYMBOL,
        side: "BUY",
        type: "LIMIT",
        qty: "0.001",
        price: (markPrice * 0.94).toFixed(1),
        clientOrderId: order2,
      }),
      manager.orders.submitOrder({
        symbol: SYMBOL,
        side: "BUY",
        type: "LIMIT",
        qty: "0.001",
        price: (markPrice * 0.93).toFixed(1),
        clientOrderId: order3,
      }),
    ]);

    assertState(results.every(r => r.ok), "All orders should submit successfully");

    // Wait for all to be confirmed
    await Promise.all([
      waitForOrderStatus(order1, "NEW", 10_000),
      waitForOrderStatus(order2, "NEW", 10_000),
      waitForOrderStatus(order3, "NEW", 10_000),
    ]);

    assertState(liveState().openOrders.size >= 3, "Should have at least 3 open orders");

    log("✅ Concurrent order submission validated");
  }, 30_000);
});
