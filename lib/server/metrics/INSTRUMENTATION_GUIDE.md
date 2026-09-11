# Metrics Instrumentation Guide

This document shows where to add metrics collection calls in the existing codebase.

## Quick Reference

Import instrumentation functions:
```typescript
import {
  trackOrderSubmitted,
  trackOrderFilled,
  trackOrderCanceled,
  trackOrderRejected,
  trackOrderSubmissionDuration,
  trackApiRequest,
  trackApiError,
  trackApiLatency,
  trackWsMessage,
  trackWsReconnect,
  trackReconRun,
  trackFreezeTriggered,
  trackUnfreezeCleared,
  updateTradingGauges,
} from "@/lib/server/metrics/instrument";
```

---

## 1. Order Service (`lib/server/binance/orders.ts`)

### In `submitOrder()` method:

**Track submission start**:
```typescript
async submitOrder(input: SubmitOrderInput): Promise<OrderResult> {
  const startTime = Date.now();
  const clientOrderId = input.clientOrderId ?? newServerClientOrderId(...);
  
  // ... existing validation code ...
  
  // After successful REST API call:
  trackOrderSubmitted(clientOrderId, input.symbol, input.side, input.type);
  trackOrderSubmissionDuration(Date.now() - startTime);
  
  return { ok: true, clientOrderId, ... };
}
```

**Track rejections**:
```typescript
// When validation fails:
if (validation.length > 0) {
  trackOrderRejected(clientOrderId, input.symbol, validation.join("; "));
  return { ok: false, ... };
}

// When risk check fails:
if (riskErrors.length > 0) {
  trackOrderRejected(clientOrderId, input.symbol, riskErrors.join("; "));
  return { ok: false, ... };
}
```

### In `cancelOrder()` method:

```typescript
async cancelOrder(input: CancelOrderInput): Promise<OrderResult> {
  // ... after successful cancellation ...
  trackOrderCanceled(clientOrderId, symbol);
  return { ok: true, ... };
}
```

---

## 2. REST Client (`lib/server/binance/rest.ts`)

### In `request()` method:

```typescript
private async request<T>(opts: RequestOpts): Promise<T> {
  const startTime = Date.now();
  trackApiRequest(opts.endpoint); // Track all requests
  
  try {
    const response = await this.http.request(...);
    
    trackApiLatency(opts.endpoint, Date.now() - startTime);
    return response;
  } catch (error) {
    trackApiError(opts.endpoint, error.code, error.message);
    trackApiLatency(opts.endpoint, Date.now() - startTime); // Track failed requests too
    throw error;
  }
}
```

---

## 3. State Management (`lib/server/binance/state.ts`)

### In `applyOrderEvent()`:

```typescript
export function applyOrderEvent(ev: OrderTradeUpdateEvent): LiveFill[] {
  const fills: LiveFill[] = [];
  
  // ... existing logic ...
  
  // After processing fills:
  if (o.l && !isZero(num(o.l))) {
    const fill = { ... };
    fills.push(fill);
    
    // Track fill
    trackFillReceived(o.c, o.s, o.S, o.l, o.L);
  }
  
  // If order status is FILLED:
  if (order.status === "FILLED") {
    trackOrderFilled(order.clientOrderId, order.symbol, order.executedQty, order.avgPrice);
  }
  
  return fills;
}
```

### In `applyAccountSnapshot()` and `applyPositionSnapshot()`:

```typescript
export function applyAccountSnapshot(account: AccountResponse, now = Date.now()): void {
  state.account = { ... };
  
  // Update gauges after snapshot
  updateTradingGauges();
}

export function applyPositionSnapshot(rows: PositionRiskRow[], now = Date.now()): void {
  state.positions.clear();
  // ... populate positions ...
  
  // Update gauges
  updateTradingGauges();
}
```

---

## 4. WebSocket Stream (`lib/server/binance/stream.ts`)

### In message handler:

```typescript
private onMessage(raw: string | Buffer): void {
  const msg = JSON.parse(raw.toString());
  
  trackWsMessage(msg.e || "unknown"); // Track message type
  
  // Calculate lag if timestamp available
  if (msg.E) {
    const lag = Date.now() - msg.E;
    trackWsLag(lag);
  }
  
  // ... existing message processing ...
}
```

### In reconnection logic:

```typescript
private reconnect(): void {
  trackWsReconnect("connection lost");
  // ... existing reconnection logic ...
}
```

---

## 5. Reconciler (`lib/server/binance/recon.ts`)

### In `run()` method:

```typescript
async run(trigger: string): Promise<ReconciliationResult> {
  const startTime = Date.now();
  
  try {
    // ... existing reconciliation logic ...
    
    const result = driftDetected ? "drift" : "ok";
    const durationMs = Date.now() - startTime;
    
    trackReconRun(trigger, result, durationMs);
    
    // Update gauges after reconciliation
    updateTradingGauges();
    
    return { result, ... };
  } catch (error) {
    trackReconRun(trigger, "error", Date.now() - startTime);
    throw error;
  }
}
```

---

## 6. Freeze/Unfreeze (`lib/server/binance/manager.ts`)

### In `freeze()` method:

```typescript
freeze(reason: string): void {
  setRuntime(RUNTIME_KEYS.frozen, "true");
  trackFreezeTriggered(reason);
  // ... existing freeze logic ...
}
```

### In `unfreezeIfClear()` method:

```typescript
unfreezeIfClear(): void {
  if (/* conditions clear */) {
    setRuntime(RUNTIME_KEYS.frozen, "false");
    trackUnfreezeCleared();
  }
}
```

---

## 7. Manager Startup (`lib/server/binance/manager.ts`)

### In `start()` method:

```typescript
private async start(): Promise<void> {
  trackSystemStart(this.cfg.env);
  
  // ... existing startup logic ...
  
  // After successful startup:
  updateTradingGauges(); // Initialize gauges
}
```

### In `stop()` method:

```typescript
stop(): void {
  trackSystemStop();
  // ... existing stop logic ...
}
```

---

## 8. Periodic Gauge Updates

Add a periodic update in `BinanceLiveManager`:

```typescript
constructor(cfg?: EnvConfig) {
  // ... existing initialization ...
  
  // Update gauges every 5 seconds
  setInterval(() => {
    updateTradingGauges();
  }, 5000);
}
```

---

## Testing Instrumentation

After adding instrumentation, verify metrics are being collected:

### 1. Check API endpoint:
```bash
curl http://localhost:3000/api/admin/metrics
```

### 2. Check dashboard:
```
http://localhost:3000/admin
```

### 3. Submit a test order and verify:
- `order.submitted` counter increments
- `order.submission_duration_ms` histogram has data
- Recent events show the order
- Trading gauges update

---

## Priority Order for Instrumentation

If implementing incrementally, add in this order:

1. **High Priority** (core functionality):
   - Order submission (orders.ts)
   - Fill tracking (state.ts)
   - API requests (rest.ts)
   - WebSocket messages (stream.ts)

2. **Medium Priority** (operations):
   - Reconciliation (recon.ts)
   - Freeze/unfreeze (manager.ts)
   - Gauge updates (periodic)

3. **Low Priority** (nice to have):
   - Order cancellations
   - Slippage tracking
   - Position events

---

## Metrics Best Practices

1. **Keep instrumentation lightweight**: Metrics should add <1ms overhead
2. **Don't block on metrics**: Never `await` metrics calls
3. **Be consistent**: Use the same event types for similar actions
4. **Add context**: Include relevant details in event metadata
5. **Update gauges sparingly**: Every 5-10s is sufficient

---

## Troubleshooting

### Metrics not appearing?
- Check that functions are imported correctly
- Verify the manager is started (metrics are in-memory)
- Check browser console for API errors

### Dashboard shows zeros?
- Wait for at least one event (order submission, etc.)
- Refresh the page (it polls every 5s)
- Check `/api/admin/metrics` directly

### Performance concerns?
- Metrics are in-memory (no DB writes)
- Histograms keep max 1000 samples
- Events keep max 100 entries
- All operations are O(1) or O(log n)
