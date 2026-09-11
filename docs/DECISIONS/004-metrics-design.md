# ADR 004: In-Memory Metrics Collection

## Status

Accepted

## Context

MAWS needs observability for operational monitoring, performance tracking, and incident response. The system must collect metrics without adding significant overhead or external dependencies.

### Problem

Metrics collection must:
- Provide real-time visibility into system health
- Track order flow, fills, and performance
- Monitor circuit breaker states
- Calculate P&L
- Support alerting
- Work without external dependencies

### Constraints

- No external metrics backends (Prometheus, StatsD, etc.)
- Minimal performance overhead
- Simple to query via API
- Retain recent data only (no long-term storage)
- Support different metric types (counters, gauges, histograms)

## Decision

Implement a lightweight in-memory metrics collector with counters, gauges, histograms, and events.

### Metric Types

#### Counters
Monotonically increasing values:
```typescript
incrementCounter("order.submitted", 1);
```

**Use Cases**:
- Order submission count
- Fill count
- API request count
- Error count
- Circuit breaker openings

#### Gauges
Current values that can go up or down:
```typescript
setGauge("gauge.open_orders", 5);
```

**Use Cases**:
- Open orders count
- Open positions count
- Account balance
- Gross exposure
- WebSocket lag

#### Histograms
Distributions with percentiles:
```typescript
observeHistogram("api.latency_ms", 150);
```

**Use Cases**:
- API latency
- Order submission duration
- Fill slippage
- Reconciliation duration
- WebSocket lag

**Percentiles**: p50, p95, p99

#### Events
Timestamped log entries:
```typescript
recordEvent("order", "filled", { symbol: "BTCUSDT" });
```

**Use Cases**:
- Order events
- Fill events
- Position events
- System events
- Error events

### Implementation

```typescript
class MetricsCollector {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  private events: MetricEvent[] = [];

  increment(name: string, value = 1): void { /* ... */ }
  set(name: string, value: number): void { /* ... */ }
  observe(name: string, value: number): void { /* ... */ }
  recordEvent(type: string, label: string, details?: Record<string, unknown>): void { /* ... */ }

  snapshot(): MetricSnapshot { /* ... */ }
}
```

### Retention Limits

- **Histograms**: Last 1000 samples
- **Events**: Last 100 events
- **Counters/Gauges**: Retained indefinitely

**Rationale**: Keep memory usage bounded while retaining useful recent data.

### Metric Names

Standardized metric names for consistency:

```typescript
export const METRICS = {
  // Orders
  ORDER_SUBMITTED: "order.submitted",
  ORDER_FILLED: "order.filled",
  ORDER_CANCELED: "order.canceled",
  ORDER_REJECTED: "order.rejected",
  ORDER_SUBMISSION_DURATION_MS: "order.submission_duration_ms",

  // Fills
  FILL_RECEIVED: "fill.received",
  FILL_SLIPPAGE_BPS: "fill.slippage_bps",

  // API
  API_REQUEST: "api.request",
  API_ERROR: "api.error",
  API_LATENCY_MS: "api.latency_ms",

  // WebSocket
  WS_MESSAGE_RECEIVED: "ws.message_received",
  WS_RECONNECT: "ws.reconnect",
  WS_ERROR: "ws.error",
  WS_LAG_MS: "ws.lag_ms",

  // Reconciliation
  RECON_RUN: "recon.run",
  RECON_DRIFT_DETECTED: "recon.drift_detected",
  RECON_DURATION_MS: "recon.duration_ms",

  // Risk
  RISK_LIMIT_BREACH: "risk.limit_breach",
  FREEZE_TRIGGERED: "freeze.triggered",
  UNFREEZE_CLEARED: "unfreeze.cleared",

  // Broker infrastructure
  BROKER_CIRCUIT_OPEN: "broker.circuit_open",
  BROKER_TIMEOUT: "broker.timeout",

  // Gauges
  OPEN_ORDERS_COUNT: "gauge.open_orders",
  OPEN_POSITIONS_COUNT: "gauge.open_positions",
  GROSS_EXPOSURE_USD: "gauge.gross_exposure_usd",
  BALANCE_USD: "gauge.balance_usd",
  WS_LAST_EVENT_AGE_MS: "gauge.ws_last_event_age_ms",
} as const;
```

### P&L Calculation

Separate module for P&L calculation:

```typescript
// lib/server/metrics/pnl.ts
export function pnl24h(): {
  unrealizedPnl: number;
  realizedPnl: number;
} {
  // Calculate from in-memory state
  // No DB or network calls
}
```

**Rationale**: P&L is frequently accessed, calculate from maintained state.

### API Access

Metrics available via API:

```bash
GET /api/admin/metrics
```

**Response**:
```json
{
  "timestamp": 1234567890000,
  "uptime_seconds": 3600,
  "pnl_24h": {
    "unrealizedPnl": 50.00,
    "realizedPnl": -10.00
  },
  "counters": { ... },
  "gauges": { ... },
  "histograms": { ... },
  "recent_events": [ ... ]
}
```

## Consequences

### Positive

- **Simplicity**: No external dependencies
- **Performance**: In-memory, minimal overhead
- **Real-time**: Immediate access to current state
- **Flexibility**: Support for multiple metric types
- **API Access**: Easy to query via HTTP
- **Bounded**: Retention limits prevent memory growth

### Negative

- **No Persistence**: Metrics lost on restart
- **Limited History**: Only recent data available
- **No Aggregation**: No time-series aggregation
- **Single Process**: Metrics not shared across instances
- **No Export**: No Prometheus/StatsD export

### Risks

- **Memory Growth**: If retention limits not enforced
- **Data Loss**: Metrics lost on restart
- **Scalability**: Not suitable for distributed systems

## Alternatives Considered

### Alternative 1: Prometheus Client

**Pros**:
- Industry standard
- Built-in aggregation
- Time-series storage
- Grafana integration

**Cons**:
- External dependency
- Requires Prometheus server
- More complex setup
- Overkill for single-instance system

**Rejected**: Want self-contained system without external dependencies

### Alternative 2: StatsD Client

**Pros**:
- Simple protocol
- Widely supported
- Low overhead

**Cons**:
- External dependency
- Requires StatsD server
- No built-in storage
- Need to manage StatsD instance

**Rejected**: Want self-contained system without external dependencies

### Alternative 3: Database Storage

**Pros**:
- Persistent storage
- Historical data
- SQL queries

**Cons**:
- Higher overhead
- Database load
- More complex queries
- Slower access

**Rejected**: In-memory is faster and sufficient for operational needs

## Implementation Notes

### Singleton Pattern

Single instance for process-wide metrics:

```typescript
const metrics = new MetricsCollector();

export function getMetrics(): MetricsCollector {
  return metrics;
}
```

**Rationale**: Single source of truth for metrics.

### Test Support

Reset function for testing:

```typescript
export function resetMetrics(): void {
  metrics.reset();
}
```

### Future Enhancements

Potential future additions:
- Prometheus export format
- StatsD export
- Custom metric backends
- Long-term storage
- Time-series aggregation

## Configuration

No configuration required. Retention limits are hardcoded:
- Histogram samples: 1000
- Events: 100

## References

- [Metrics Collector](../../lib/server/metrics/collector.ts)
- [P&L Calculation](../../lib/server/metrics/pnl.ts)
- [Metrics API](../../app/api/admin/metrics/route.ts)
