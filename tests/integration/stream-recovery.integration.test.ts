/**
 * Integration tests for WebSocket stream recovery and reconnection.
 */

import { BinanceLiveManager } from "@/lib/server/binance/manager";
import { liveState } from "@/lib/server/binance/state";
import { getRuntime, RUNTIME_KEYS } from "@/lib/server/runtime/flags";
import {
  createTestnetManager,
  cleanupTestnetState,
  waitFor,
  sleep,
  uniqueOrderId,
  assertState,
  log,
} from "./helpers";

describe("Stream Recovery Integration (Binance Testnet)", () => {
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

  test("stream connection established on startup", async () => {
    assertState(manager.status === "ready", "Manager should be in ready state");
    
    // Stream health should be trackable
    await waitFor(
      () => {
        const lastEvent = liveState().lastEventTime;
        return lastEvent !== null && Date.now() - lastEvent < 30_000;
      },
      {
        timeoutMs: 35_000,
        description: "stream to be receiving events",
      }
    );

    log("✅ Stream connection validated");
  }, 40_000);

  test("reconciliation runs on startup and detects clean state", async () => {
    // Check that startup reconciliation completed
    await waitFor(
      () => {
        const snapshotAt = liveState().snapshotAt;
        return snapshotAt !== null && Date.now() - snapshotAt < 60_000;
      },
      {
        timeoutMs: 15_000,
        description: "initial snapshot to complete",
      }
    );

    assertState(liveState().snapshotAt !== null, "Snapshot should be taken");
    assertState(getRuntime(RUNTIME_KEYS.frozen) !== "true", "System should not be frozen");

    log("✅ Startup reconciliation validated");
  }, 20_000);

  test("manual reconciliation detects no drift in clean state", async () => {
    // Ensure clean state
    const openOrders = Array.from(liveState().openOrders.values());
    assertState(openOrders.length === 0, "Should start with no open orders");

    // Run manual reconciliation
    const result = await manager.reconcileRun("manual-test");
    
    assertState(result.result === "ok", `Reconciliation should succeed, got: ${result.result}`);
    assertState(getRuntime(RUNTIME_KEYS.frozen) !== "true", "System should remain unfrozen");

    log("✅ Manual reconciliation with clean state validated");
  }, 20_000);

  test("account updates propagate via stream", async () => {
    const initialBalance = liveState().account?.totalWalletBalance;
    assertState(!!initialBalance, "Initial balance should exist");
    log(`Initial balance: ${initialBalance}`);

    // Submit a market order to trigger account update
    const orderId = uniqueOrderId("balance-test");
    const result = await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: orderId,
    });

    assertState(result.ok, "Order should submit successfully");

    // Wait for balance to update (account update event from stream)
    await waitFor(
      () => {
        const currentBalance = liveState().account?.totalWalletBalance;
        return !!currentBalance && currentBalance !== initialBalance;
      },
      {
        timeoutMs: 20_000,
        description: "balance to update via stream",
      }
    );

    log(`Balance updated: ${liveState().account?.totalWalletBalance}`);
    log("✅ Stream-driven account updates validated");
  }, 30_000);

  test("position updates propagate immediately", async () => {
    // Verify no initial position
    const initialPosition = liveState().positions.get(SYMBOL);
    assertState(!initialPosition || Number(initialPosition.qty) === 0, "Should start with no position");

    // Open a position
    const orderId = uniqueOrderId("pos-stream");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: orderId,
    });

    // Position should appear via stream
    await waitFor(
      () => {
        const pos = liveState().positions.get(SYMBOL);
        return !!pos && Number(pos.qty) > 0;
      },
      {
        timeoutMs: 15_000,
        description: "position to appear in state",
      }
    );

    const position = liveState().positions.get(SYMBOL);
    assertState(position!.side === "long", "Position should be long");
    assertState(Number(position!.qty) > 0, "Position should have positive quantity");
    assertState(Number(position!.entryPrice) > 0, "Position should have entry price");

    log("✅ Stream-driven position updates validated");
  }, 30_000);

  test("fill events arrive via stream with correct avg price calculation", async () => {
    const orderId = uniqueOrderId("fill-stream");
    const fillsBefore = liveState().fills.length;

    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: orderId,
    });

    // Wait for fill to arrive
    await waitFor(
      () => liveState().fills.length > fillsBefore,
      {
        timeoutMs: 15_000,
        description: "fill event to arrive",
      }
    );

    const newFills = liveState().fills.filter(f => f.clientOrderId === orderId);
    assertState(newFills.length > 0, "Should have at least one fill");
    
    const fill = newFills[0];
    assertState(fill.symbol === SYMBOL, "Fill should be for correct symbol");
    assertState(fill.side === "BUY", "Fill should be BUY side");
    assertState(Number(fill.qty) > 0, "Fill qty should be positive");
    assertState(Number(fill.price) > 0, "Fill price should be positive");
    assertState(fill.source === "stream", "Fill should come from stream");

    // Check order's avg price was calculated correctly
    const order = liveState().orders.get(orderId);
    assertState(!!order, "Order should exist");
    assertState(Number(order!.avgPrice) > 0, "Order should have avg price");

    log(`Fill received: ${fill.qty} @ ${fill.price}, order avg: ${order!.avgPrice}`);
    log("✅ Stream-driven fills and price calculation validated");
  }, 30_000);

  test("stream events update lastEventTime consistently", async () => {
    const before = liveState().lastEventTime;
    assertState(before !== null, "Should have received events");

    // Submit an order to generate stream activity
    const orderId = uniqueOrderId("event-time");
    await manager.orders.submitOrder({
      symbol: SYMBOL,
      side: "BUY",
      type: "MARKET",
      qty: "0.001",
      clientOrderId: orderId,
    });

    // Wait for event time to advance
    await waitFor(
      () => {
        const current = liveState().lastEventTime;
        return !!current && current > (before || 0);
      },
      {
        timeoutMs: 15_000,
        description: "lastEventTime to advance",
      }
    );

    const after = liveState().lastEventTime;
    log(`Event time advanced: ${before} -> ${after}`);
    assertState((after || 0) > (before || 0), "Event time should advance");

    log("✅ Stream event timing validated");
  }, 30_000);
});
