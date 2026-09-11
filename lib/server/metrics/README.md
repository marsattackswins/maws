# MAWS Metrics & Observability

## Overview

The observability system provides real-time visibility into MAWS live trading operations through:

- **Metrics Collection**: In-memory tracking of counters, gauges, and histograms
- **Health Monitoring**: Component-level health checks (WebSocket, API, clock, DB)
- **Admin Dashboard**: Web UI at `/admin` for visual monitoring
- **Metrics API**: JSON endpoint at `/api/admin/metrics` for programmatic access

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Trading Operations                       │
│  (orders, fills, reconciliation, WebSocket events)          │
└───────────────────────┬─────────────────────────────────────┘
                        │ calls instrumentation functions
                        ↓
┌─────────────────────────────────────────────────────────────┐
│               Metrics Collector (in-memory)                  │
│  • Counters: order.submitted, api.error, etc.               │
│  • Gauges: open_orders, gross_exposure, balance             │
│  • Histograms: order.submission_duration_ms, api.latency_ms │
│  • Events: timestamped log of recent actions                │
└───────────────────────┬─────────────────────────────────────┘
                        │ exposed via
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                        API Endpoints                         │
│  • GET /api/admin/health       → Health status              │
│  • GET /api/admin/metrics      → Raw metrics (JSON)         │
│  • GET /api/admin/performance  → Computed stats             │
└───────────────────────┬─────────────────────────────────────┘
                        │ consumed by
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard UI                        │
│              http://localhost:3000/admin                     │
│  • Health cards (WebSocket, API, Clock, DB)                 │
│  • Trading state (orders, positions, exposure, balance)     │
│  • Performance metrics (latency, error rates, throughput)   │
│  • Recent events log                                         │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Access the Dashboard

```bash
# Start MAWS
npm run dev

# Navigate to admin dashboard
# http://localhost:3000/admin
```

**Authentication**: Requires operator session (same as live trading)

### 2. Check Health via API

```bash
# Using operator session cookie (in browser after login)
curl http://localhost:3000/api/admin/health

# Using health token header (if MAWS_HEALTH_TOKEN configured)
# WARNING: The token is a secret. Never put it in URLs, logs, or source control.
curl -H "x-maws-health-token: your-secret-token" \
  http://localhost:3000/api/admin/health
```

### 3. Get Raw Metrics

```bash
curl http://localhost:3000/api/admin/metrics
```

Returns:
```json
{
  "timestamp": 1234567890000,
  "uptime_seconds": 3600,
  "counters": {
    "order.submitted": 15,
    "order.filled": 14,
    "api.request": 234,
    "api.error": 2
  },
  "gauges": {
    "gauge.open_orders": 2,
    "gauge.gross_exposure_usd": 487.5,
    "gauge.balance_usd": 9847.23
  },
  "histograms": {
    "order.submission_duration_ms": {
      "count": 15,
      "avg": 234.5,
      "p50": 198,
      "p95": 450,
      "p99": 580
    }
  },
  "recent_events": [...]
}
```

## Metrics Catalog

### Counters (Monotonically Increasing)

| Metric | Description |
|--------|-------------|
| `order.submitted` | Orders submitted to exchange |
| `order.filled` | Orders completely filled |
| `order.canceled` | Orders canceled |
| `order.rejected` | Orders rejected (validation, risk, API) |
| `fill.received` | Fill events received from stream |
| `api.request` | API requests to Binance |
| `api.error` | API errors (4xx, 5xx, timeouts) |
| `ws.message_received` | WebSocket messages received |
| `ws.reconnect` | WebSocket reconnection events |
| `ws.error` | WebSocket errors |
| `recon.run` | Reconciliation runs |
| `recon.drift_detected` | Reconciliation drift events |
| `risk.limit_breach` | Risk limit breach attempts |
| `freeze.triggered` | System freeze events |
| `unfreeze.cleared` | System unfreeze events |

### Gauges (Current Values)

| Metric | Description |
|--------|-------------|
| `gauge.open_orders` | Current number of open orders |
| `gauge.open_positions` | Current number of open positions |
| `gauge.gross_exposure_usd` | Total gross exposure (USD) |
| `gauge.balance_usd` | Account balance (USD) |
| `gauge.ws_last_event_age_ms` | Time since last WebSocket event |

### Histograms (Distributions)

| Metric | Description |
|--------|-------------|
| `order.submission_duration_ms` | Time from submit call to API response |
| `api.latency_ms` | Binance API request latency |
| `ws.lag_ms` | WebSocket message lag (server time to receipt) |
| `recon.duration_ms` | Reconciliation duration |
| `fill.slippage_bps` | Fill slippage in basis points |

## Health Check Components

### WebSocket
- **Healthy**: Last event < 30s ago
- **Degraded**: Last event 30-60s ago
- **Down**: Last event > 60s ago or no connection

### Binance API
- **Healthy**: Error rate < 5%
- **Degraded**: Error rate 5-20%
- **Down**: Error rate > 20%

### Clock Sync
- **Healthy**: Clock drift < 5s
- **Degraded**: Clock drift > 5s

### Database
- **Healthy**: Always (placeholder for future checks)

## Dashboard Features

### Health Cards
Color-coded status indicators for each component:
- 🟢 Green: Healthy
- 🟡 Yellow: Degraded
- 🔴 Red: Down

### Trading State
- Open orders count
- Open positions count
- Gross exposure (with limit proximity)
- Balance
- Freeze status
- Execution enabled/disabled

### Performance Metrics
- Orders (submitted, filled, canceled, rejected, fill rate, latency)
- API (requests, errors, error rate, latency p50/p95/p99)
- WebSocket (messages, reconnects, errors, lag)
- Reconciliation (runs, drift events, duration)
- Risk (freeze events, limit breaches)

### Recent Events
Live log of last 15 events with timestamps and details.

## Configuration

### Health Token (Optional)

To enable API access without operator session:

```bash
# .env.local
MAWS_HEALTH_TOKEN=your-secret-token-here
```

**IMPORTANT**: The health token is a **secret credential**. 
- Never include it in URLs, browser history, bookmarks, or query parameters
- Never commit it to source control (use .env.local, not .env)
- Never log it or include it in error messages
- Always send it via the `x-maws-health-token` request header

Then access metrics:
```bash
# Correct: Token in header
curl -H "x-maws-health-token: your-secret-token-here" \
  http://localhost:3000/api/admin/metrics

# Never use: Token in URL (leaks in logs, history, etc.)
# curl "http://localhost:3000/api/admin/metrics?token=..." ❌
```

### Refresh Rate

Dashboard auto-refreshes every **5 seconds**.

To change:
```typescript
// app/admin/page.tsx
const interval = setInterval(fetchData, 5000); // Change to desired ms
```

## Instrumentation

Metrics are collected by calling instrumentation functions from the trading code.

See `INSTRUMENTATION_GUIDE.md` for detailed integration instructions.

### Example: Track Order Submission

```typescript
import { trackOrderSubmitted, trackOrderSubmissionDuration } from "@/lib/server/metrics/instrument";

async function submitOrder(input: OrderInput) {
  const startTime = Date.now();
  
  // ... submit to exchange ...
  
  trackOrderSubmitted(clientOrderId, symbol, side, type);
  trackOrderSubmissionDuration(Date.now() - startTime);
}
```

## Data Retention

Metrics are **in-memory** (not persisted):
- Histograms: Last 1000 samples
- Events: Last 100 events
- Counters/Gauges: Reset on restart

**Uptime**: Tracked from manager start time

## Performance

Metrics collection overhead:
- **Per metric call**: <0.1ms
- **Memory usage**: ~5-10 MB (depends on event volume)
- **No disk I/O**: Everything in-memory
- **No blocking**: All operations are synchronous and fast

## Alerts & Monitoring

### Built-in

The dashboard provides visual alerts:
- Component health indicators
- Freeze status
- Error rate warnings

### External Integration (Future)

Metrics can be exported to:
- **Prometheus**: Add `/api/admin/metrics/prometheus` endpoint
- **Grafana**: Import dashboards from Prometheus
- **Webhook**: Send critical events to Slack/Discord

## Troubleshooting

### Dashboard shows "Loading metrics..."
- Check operator authentication (login at `/login`)
- Verify manager is started (`MAWS_ENV` not `local`)
- Check browser console for API errors

### Metrics show zeros
- Generate activity (submit orders, check positions)
- Wait 5-10 seconds for refresh
- Check `/api/admin/metrics` directly

### "Unauthorized" error
- Login to MAWS first at `/login`
- Or set `MAWS_HEALTH_TOKEN` and send it via `x-maws-health-token` header

### Dashboard not updating
- Check browser console for errors
- Verify WebSocket/SSE connection
- Hard refresh (Ctrl+Shift+R)

## API Reference

### GET /api/admin/health

Returns health status of all components.

**Auth**: Operator session OR health token (via `x-maws-health-token` header)

**Response**:
```json
{
  "overall": "healthy" | "degraded" | "down",
  "components": {
    "webSocket": { "status": "healthy", "message": "..." },
    "api": { "status": "healthy", "message": "..." },
    "clock": { "status": "healthy", "message": "..." },
    "database": { "status": "healthy", "message": "..." }
  },
  "trading": {
    "openOrders": 2,
    "openPositions": 1,
    "grossExposureUsd": 487.5,
    "balanceUsd": 9847.23,
    "frozen": false,
    "executionEnabled": true
  },
  "uptime": {
    "seconds": 3600,
    "formatted": "1h 0m"
  }
}
```

### GET /api/admin/metrics

Returns raw metrics snapshot.

**Auth**: Operator session OR health token (via `x-maws-health-token` header)

**Response**: See "Get Raw Metrics" example above

### GET /api/admin/performance

Returns computed performance statistics.

**Auth**: Operator session

**Response**:
```json
{
  "orders": {
    "submitted": 15,
    "filled": 14,
    "fill_rate_pct": "93.3",
    "submission_latency_ms": { "avg": "234", "p95": 450 }
  },
  "api": {
    "requests": 234,
    "errors": 2,
    "error_rate_pct": "0.85",
    "latency_ms": { "avg": "145", "p95": 287 }
  }
}
```

## Files

```
lib/server/metrics/
├── collector.ts              # Core metrics collection
├── health.ts                 # Health status computation
├── instrument.ts             # Instrumentation helper functions
├── INSTRUMENTATION_GUIDE.md  # How to add metrics to code
└── README.md                 # This file

app/api/admin/
├── health/route.ts           # Health check endpoint
├── metrics/route.ts          # Metrics snapshot endpoint
└── performance/route.ts      # Performance stats endpoint

app/admin/
└── page.tsx                  # Dashboard UI
```

## Next Steps

1. **Instrument existing code**: Follow `INSTRUMENTATION_GUIDE.md`
2. **Test the dashboard**: Submit orders and watch metrics update
3. **Configure alerts** (optional): Add webhook notifications
4. **Export to Prometheus** (optional): For long-term storage

---

**Questions?** Check `INSTRUMENTATION_GUIDE.md` for integration details.
