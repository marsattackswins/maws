# MAWS API Reference

Complete API endpoint documentation for MAWS (Market Analysis & Workflow System).

## Authentication

Protected API endpoints require authentication via:
- **Session Cookie**: `maws_session` HTTP-only cookie set by login
- **Health Token**: `x-maws-health-token` header for health/admin endpoints

Local Chart Only can read safe profile metadata without a session. Selecting a Binance profile and all live profile/state/mutation routes still require an authenticated operator session; mutating requests also require CSRF and origin checks.

## Response Format

All endpoints return JSON with the following structure:

```typescript
// Success response
{
  "ok": true,
  // ... response data
}

// Error response
{
  "ok": false,
  "error": "error_code",
  "message": "Human-readable error message"
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `bad_request` | 400 | Invalid request body or parameters |
| `bad_credentials` | 401 | Invalid operator password |
| `forbidden` | 403 | Origin/host rejected or insufficient permissions |
| `rate_limited` | 429 | Too many requests |
| `config` | 503 | Server configuration invalid |
| `broker_start_failed` | 502 | Could not reach exchange |
| `circuit_open` | 503 | Circuit breaker is open |

---

## Authentication API

### POST /api/auth/login

Authenticate with operator credentials and create a session.

**Authentication**: None (public endpoint with rate limiting)

**Request Body**:
```json
{
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "csrf": "string"
}
```

**Headers**: Sets `maws_session` cookie

**Error Responses**:
- `403` - Operator authentication is not configured for local Binance profile access
- `401` - Invalid operator password
- `429` - Too many login attempts

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}'
```

---

### GET /api/auth/session

Get current session information.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "authenticated": true,
  "sessionId": "string"
}
```

**Error Responses**:
- `401` - Invalid or expired session

---

### POST /api/auth/logout

Terminate current session.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "ok": true
}
```

**Headers**: Clears `maws_session` cookie

---

### POST /api/auth/revoke-all

Revoke all operator sessions (emergency logout).

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "ok": true
}
```

---

## Profile API

### GET /api/live/profiles

Return safe metadata for the available trading profiles. Credentials, endpoints, and other secrets are never returned.

**Authentication**: Not required in local Chart Only; required in other environments

**Response** (200 OK):
```json
{
  "profiles": [
    {
      "profileId": "paper",
      "label": "Paper",
      "environment": "paper",
      "configured": true,
      "requiresProductionConfirmation": false,
      "executionEnabled": false
    }
  ]
}
```

---

### GET /api/live/profile

Return the server-confirmed active profile and readiness state.

**Authentication**: Required (session cookie)

The response identifies Chart Only with `profileId: null`. It does not expose credentials.

---

### POST /api/live/profile/switch

Switch the server-managed profile, or detach to Chart Only/Paper Trading.

**Authentication**: Required (session cookie, CSRF token, and valid origin)

**Request Body**:
```json
{
  "profileId": "binance-testnet",
  "confirmProduction": false,
  "requestId": "operator-switch-123"
}
```

Supported profile IDs are `paper`, `binance-testnet`, and `binance-production`. Production additionally requires `confirmProduction: true`. Switching is fail-closed: open exposure, uncertain mutations, reconciliation drift, or failed readiness checks block or stop the transition.

---

## Live Trading API

### POST /api/live/connect

Connect to the broker and start live trading streams.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "ok": true,
  "env": "testnet",
  "status": "ready"
}
```

**Error Responses**:
- `502` - Could not reach exchange

**Example**:
```bash
curl -X POST http://localhost:3000/api/live/connect \
  -H "Cookie: maws_session=..."
```

---

### POST /api/live/disconnect

Detach UI from live broker (server continues monitoring).

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "ok": true
}
```

---

### GET /api/live/state

Get current trading state snapshot.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "account": {
    "totalWalletBalance": "1000.00",
    "availableBalance": "500.00",
    "unrealizedProfit": "50.00",
    "marginBalance": "1050.00"
  },
  "positions": [
    {
      "symbol": "BTCUSDT",
      "side": "long",
      "qty": "0.001",
      "entryPrice": "50000.00",
      "markPrice": "51000.00",
      "unrealizedProfit": "1.00",
      "leverage": "10",
      "liquidationPrice": "45000.00",
      "notional": "51.00"
    }
  ],
  "orders": [
    {
      "clientOrderId": "abc123",
      "exchangeOrderId": 123456789,
      "symbol": "BTCUSDT",
      "side": "buy",
      "type": "limit",
      "status": "new",
      "price": "50000.00",
      "origQty": "0.001",
      "executedQty": "0.000",
      "reduceOnly": false,
      "time": 1234567890000
    }
  ],
  "fills": [
    {
      "ts": 1234567890000,
      "exchangeOrderId": 123456789,
      "clientOrderId": "abc123",
      "symbol": "BTCUSDT",
      "side": "buy",
      "qty": "0.001",
      "price": "50000.00",
      "realizedPnl": "0.00"
    }
  ]
}
```

---

### GET /api/live/events

Server-sent events stream for real-time updates.

**Authentication**: Required (session cookie)

**Response**: `text/event-stream` with events:

**Event Types**:
- `hello` - Initial connection
- `state` - Full state snapshot
- `health` - Health status update
- `order-update` - Order state change
- `account-update` - Account state change
- `fills` - New fills
- `ping` - Keepalive (every 25s)

**Example Event**:
```
event: order-update
data: {"clientOrderId":"abc123","status":"filled"}
```

**Example Usage**:
```javascript
const eventSource = new EventSource('/api/live/events');
eventSource.addEventListener('order-update', (e) => {
  const data = JSON.parse(e.data);
  console.log('Order updated:', data);
});
```

---

### POST /api/live/orders

Submit a new order to the exchange.

**Authentication**: Required (session cookie)

**Request Body**:
```json
{
  "symbol": "BTCUSDT",
  "side": "BUY",
  "type": "LIMIT",
  "qty": "0.001",
  "price": "50000.00",
  "stopPrice": "49000.00",
  "reduceOnly": false,
  "clientOrderId": "my-order-12345678"
}
```

**Parameters**:
- `symbol` (required): Trading pair symbol
- `side` (required): `BUY` or `SELL`
- `type` (required): `MARKET`, `LIMIT`, or `STOP_MARKET`
- `qty` (optional): Order quantity
- `price` (optional): Limit price (required for LIMIT)
- `stopPrice` (optional): Stop price (required for STOP_MARKET)
- `reduceOnly` (optional): Reduce-only flag
- `clientOrderId` (required): Client order ID (8-36 chars)

**Response** (200 OK):
```json
{
  "ok": true,
  "clientOrderId": "my-order-12345678",
  "exchangeOrderId": 123456789,
  "status": "new"
}
```

**Request Correlation**:
- Send an optional `x-request-id` header (opaque token, ≤128 chars, `A-Za-z0-9._:@/-`)
  with any live mutation request; it is echoed back on the response (all statuses,
  including errors and 503) and stamped as `request_id` on every server log line
  emitted while the request is in flight.
- Omitted or invalid headers cause the server to mint a fresh UUID, returned in
  `x-request-id` so the minted ID can be quoted in support requests.

**Error Responses**:
- `400` - Invalid parameters
- `422` - Risk limit breach or validation error
- `409` - Duplicate client order ID
- `503` - Circuit breaker open

**Example**:
```bash
curl -X POST http://localhost:3000/api/live/orders \
  -H "Content-Type: application/json" \
  -H "Cookie: maws_session=..." \
  -d '{
    "symbol":"BTCUSDT",
    "side":"BUY",
    "type":"LIMIT",
    "qty":"0.001",
    "price":"50000.00",
    "clientOrderId":"my-order-123"
  }'
```

---

### POST /api/live/orders/cancel

Cancel an existing order.

**Authentication**: Required (session cookie)

**Request Body**:
```json
{
  "symbol": "BTCUSDT",
  "clientOrderId": "my-order-12345678"
}
```

**Response** (200 OK):
```json
{
  "ok": true,
  "clientOrderId": "my-order-12345678",
  "status": "canceled"
}
```

---

### POST /api/live/positions/close

Close position for a symbol (reduce-only market order).

**Authentication**: Required (session cookie)

**Request Body**:
```json
{
  "symbol": "BTCUSDT"
}
```

**Response** (200 OK):
```json
{
  "ok": true,
  "clientOrderId": "close-12345678",
  "exchangeOrderId": 123456789,
  "status": "new"
}
```

**Error Responses**:
- `400` - Invalid symbol
- `422` - No position exists or risk limit breach

---

### POST /api/live/protect

Set take-profit and/or stop-loss orders for a position.

**Authentication**: Required (session cookie)

**Request Body**:
```json
{
  "symbol": "BTCUSDT",
  "tpPrice": "55000.00",
  "slPrice": "48000.00"
}
```

**Parameters**:
- `symbol` (required): Trading pair symbol
- `tpPrice` (optional): Take-profit price
- `slPrice` (optional): Stop-loss price

**Response** (200 OK):
```json
{
  "ok": true,
  "tp": {
    "ok": true,
    "clientOrderId": "tp-12345678",
    "exchangeOrderId": 123456789
  },
  "sl": {
    "ok": true,
    "clientOrderId": "sl-12345678",
    "exchangeOrderId": 123456790
  }
}
```

**Error Responses**:
- `400` - Invalid symbol or no TP/SL price provided
- `422` - No position exists or risk limit breach

---

### POST /api/live/reconcile

Trigger manual reconciliation with exchange state.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "ok": true,
  "driftDetected": false,
  "positionsReconciled": 0,
  "ordersReconciled": 0,
  "fillsReconciled": 0
}
```

---

### POST /api/live/gates

Set runtime execution gate (required for production trading).

**Authentication**: Required (session cookie)

**Request Body**:
```json
{
  "executionEnabled": true
}
```

**Response** (200 OK):
```json
{
  "ok": true,
  "executionEnabled": true
}
```

---

### GET /api/live/stream-status

Get WebSocket stream connection status.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "connected": true,
  "phase": "connected",
  "reconnects": 0,
  "lastEventTime": 1234567890000
}
```

---

### GET /api/live/meta

Get broker metadata and capabilities.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "brokerType": "binance",
  "env": "testnet",
  "connected": true,
  "supportsProtect": true,
  "supportsReduceOnly": true
}
```

---

### GET /api/live/history

Get historical order/fill data.

**Authentication**: Required (session cookie)

**Query Parameters**:
- `limit` (optional): Number of records (default: 50, max: 500)

**Response** (200 OK):
```json
{
  "orders": [...],
  "fills": [...]
}
```

---

## Admin API

### GET /api/admin/metrics

Get current metrics snapshot.

**Authentication**: Required (session cookie OR health token header)

**Response** (200 OK):
```json
{
  "timestamp": 1234567890000,
  "uptime_seconds": 3600,
  "pnl_24h": {
    "unrealizedPnl": 50.00,
    "realizedPnl": -10.00
  },
  "counters": {
    "order.submitted": 100,
    "order.filled": 95,
    "order.canceled": 5
  },
  "gauges": {
    "gauge.open_orders": 3,
    "gauge.open_positions": 1,
    "gauge.gross_exposure_usd": 1000.00,
    "gauge.balance_usd": 5000.00
  },
  "histograms": {
    "api.latency_ms": {
      "count": 1000,
      "sum": 50000,
      "min": 10,
      "max": 500,
      "avg": 50,
      "p50": 45,
      "p95": 100,
      "p99": 200
    }
  },
  "recent_events": [
    {
      "ts": 1234567890000,
      "type": "order",
      "label": "filled",
      "details": {"symbol": "BTCUSDT"}
    }
  ]
}
```

**Example with health token**:
```bash
curl -H "x-maws-health-token: your-token" \
  http://localhost:3000/api/admin/metrics
```

---

### GET /api/admin/circuits

Get circuit breaker status for all circuits.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "env": "testnet",
  "circuits": {
    "binance-rest": {
      "state": "closed",
      "failureCount": 0,
      "successCount": 0,
      "lastFailureTime": null,
      "lastSuccessTime": 1234567890000,
      "openedAt": null,
      "halfOpenAt": null,
      "totalCalls": 100,
      "totalFailures": 2,
      "totalSuccesses": 98,
      "totalRejections": 0
    },
    "binance-stream": {
      "state": "closed",
      "failureCount": 0,
      "successCount": 0,
      "lastFailureTime": null,
      "lastSuccessTime": 1234567890000,
      "openedAt": null,
      "halfOpenAt": null,
      "totalCalls": 1000,
      "totalFailures": 1,
      "totalSuccesses": 999,
      "totalRejections": 0
    },
    "reconciliation": {
      "state": "closed",
      "failureCount": 0,
      "successCount": 0,
      "lastFailureTime": null,
      "lastSuccessTime": 1234567890000,
      "openedAt": null,
      "halfOpenAt": null,
      "totalCalls": 50,
      "totalFailures": 0,
      "totalSuccesses": 50,
      "totalRejections": 0
    }
  },
  "openCircuits": [],
  "hasOpenCircuits": false
}
```

---

### GET /api/admin/health

Get detailed health status (admin view).

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "env": "testnet",
  "healthy": true,
  "brokerConnected": true,
  "managerStatus": "ready",
  "managerError": null,
  "clock": 1234567890000,
  "clockHealthy": true,
  "stream": "connected",
  "streamHealthy": true,
  "recon": "ok",
  "reconHealthy": true,
  "execution": {
    "staticEnabled": true,
    "runtimeEnabled": true,
    "canSubmit": true
  },
  "submissionsFrozen": false,
  "frozenReasons": []
}
```

---

### GET /api/admin/performance

Get performance metrics and diagnostics.

**Authentication**: Required (session cookie)

**Response** (200 OK):
```json
{
  "uptime": 3600,
  "memory": {
    "used": 100000000,
    "total": 500000000
  },
  "connections": {
    "active": 1,
    "total": 10
  }
}
```

---

## Health API

### GET /api/health

Get operational health status for monitoring.

**Authentication**: Required (session cookie OR health token header)

**Response** (200 OK):
```json
{
  "env": "testnet",
  "healthy": true,
  "brokerConnected": true,
  "managerStatus": "ready",
  "managerError": null,
  "clock": 1234567890000,
  "clockHealthy": true,
  "stream": "connected",
  "streamHealthy": true,
  "recon": "ok",
  "reconHealthy": true,
  "execution": {
    "profileExecutionEnabled": true,
    "runtimeEnabled": true,
    "canSubmit": true
  },
  "submissionsFrozen": false,
  "frozenReasons": []
}
```

**Example with health token**:
```bash
curl -H "x-maws-health-token: your-token" \
  http://localhost:3000/api/health
```

---

### GET /api/health/broker

Get broker-specific health status.

**Authentication**: Required (session cookie OR health token header)

**Response** (200 OK):
```json
{
  "connected": true,
  "status": "ready",
  "lastPing": 1234567890000,
  "latency": 50
}
```

---

## Market Data API

### GET /api/binance/symbols

Get available trading symbols from Binance.

**Authentication**: None (public endpoint)

**Response** (200 OK):
```json
{
  "symbols": [
    {
      "symbol": "BTCUSDT",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "status": "trading"
    }
  ]
}
```

---

### GET /api/binance/ticker

Get current ticker price for a symbol.

**Authentication**: None (public endpoint)

**Query Parameters**:
- `symbol` (required): Trading pair symbol

**Response** (200 OK):
```json
{
  "symbol": "BTCUSDT",
  "price": "50000.00",
  "time": 1234567890000
}
```

**Example**:
```bash
curl "http://localhost:3000/api/binance/ticker?symbol=BTCUSDT"
```

---

### GET /api/binance/klines

Get historical kline (candlestick) data.

**Authentication**: None (public endpoint)

**Query Parameters**:
- `symbol` (required): Trading pair symbol
- `interval` (required): Kline interval (1m, 5m, 15m, 1h, 4h, 1d)
- `limit` (optional): Number of klines (default: 500, max: 1000)

**Response** (200 OK):
```json
{
  "symbol": "BTCUSDT",
  "interval": "1h",
  "klines": [
    {
      "time": 1234567890000,
      "open": "50000.00",
      "high": "51000.00",
      "low": "49500.00",
      "close": "50500.00",
      "volume": "100.00"
    }
  ]
}
```

**Example**:
```bash
curl "http://localhost:3000/api/binance/klines?symbol=BTCUSDT&interval=1h&limit=100"
```

---

## Calendar API

### GET /api/calendar/xoomar

Get economic calendar events.

**Authentication**: None (public endpoint)

**Query Parameters**:
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)

**Response** (200 OK):
```json
{
  "events": [
    {
      "date": "2024-01-15",
      "time": "14:30",
      "currency": "USD",
      "event": "CPI",
      "impact": "high",
      "actual": "3.2%",
      "forecast": "3.0%",
      "previous": "3.1%"
    }
  ]
}
```

---

## News API

### GET /api/news/finnhub

Get market news from Finnhub.

**Authentication**: None (public endpoint, requires FINNHUB_API_KEY)

**Query Parameters**:
- `category` (optional): News category (default: general)
- `limit` (optional): Number of articles (default: 10)

**Response** (200 OK):
```json
{
  "articles": [
    {
      "id": "123",
      "headline": "Bitcoin reaches new highs",
      "summary": "Bitcoin has reached...",
      "url": "https://...",
      "source": "Reuters",
      "datetime": 1234567890000
    }
  ]
}
```

---

## Logo API

### GET /api/logo

Get asset logo URL.

**Authentication**: None (public endpoint)

**Query Parameters**:
- `symbol` (required): Asset symbol

**Response** (200 OK):
```json
{
  "url": "https://...",
  "symbol": "BTC"
}
```

---

## Rate Limits

### Authentication Endpoints
- **Login**: 5 attempts per 5 minutes per IP

### Live Trading Endpoints
- **Order submission**: 60 requests per minute per session
- **Other live endpoints**: 120 requests per minute per session

### Admin Endpoints
- **Metrics**: 60 requests per minute per session
- **Health**: 120 requests per minute per session

### Market Data Endpoints
- **Public endpoints**: 300 requests per minute per IP

---

## WebSocket Events

The SSE endpoint (`/api/live/events`) emits the following events:

### order-update
Emitted when order state changes.

```json
{
  "clientOrderId": "abc123",
  "exchangeOrderId": 123456789,
  "symbol": "BTCUSDT",
  "side": "buy",
  "type": "limit",
  "status": "filled",
  "price": "50000.00",
  "executedQty": "0.001",
  "avgPrice": "50000.00",
  "fills": [...]
}
```

### account-update
Emitted when account state changes.

```json
{
  "at": 1234567890000,
  "balance": {
    "totalWalletBalance": "1000.00",
    "availableBalance": "500.00"
  }
}
```

### fills
Emitted when new fills are received.

```json
{
  "fills": [
    {
      "ts": 1234567890000,
      "exchangeOrderId": 123456789,
      "clientOrderId": "abc123",
      "symbol": "BTCUSDT",
      "side": "buy",
      "qty": "0.001",
      "price": "50000.00",
      "realizedPnl": "0.00"
    }
  ]
}
```

### health
Emitted when health status changes.

```json
{
  "healthy": true,
  "brokerConnected": true,
  "streamHealthy": true,
  "submissionsFrozen": false
}
```

### stream-status
Emitted when WebSocket stream status changes.

```json
{
  "connected": true,
  "phase": "connected",
  "reconnects": 0
}
```

### ping
Keepalive heartbeat (every 25 seconds).

```json
{
  "at": 1234567890000
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'your-password' })
});
const { csrf } = await loginRes.json();

// Submit order
const orderRes = await fetch('/api/live/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'LIMIT',
    qty: '0.001',
    price: '50000.00',
    clientOrderId: `order-${Date.now()}`
  })
});
const order = await orderRes.json();

// Listen to events
const eventSource = new EventSource('/api/live/events');
eventSource.addEventListener('order-update', (e) => {
  const data = JSON.parse(e.data);
  console.log('Order updated:', data);
});
```

### Python

```python
import requests

# Login
session = requests.Session()
login_res = session.post('http://localhost:3000/api/auth/login', json={
    'password': 'your-password'
})
csrf = login_res.json()['csrf']

# Submit order
order_res = session.post('http://localhost:3000/api/live/orders', json={
    'symbol': 'BTCUSDT',
    'side': 'BUY',
    'type': 'LIMIT',
    'qty': '0.001',
    'price': '50000.00',
    'clientOrderId': f'order-{int(time.time())}'
})
order = order_res.json()

# Get state
state_res = session.get('http://localhost:3000/api/live/state')
state = state_res.json()
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"password":"your-password"}'

# Submit order
curl -X POST http://localhost:3000/api/live/orders \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "symbol":"BTCUSDT",
    "side":"BUY",
    "type":"LIMIT",
    "qty":"0.001",
    "price":"50000.00",
    "clientOrderId":"order-123"
  }'

# Get state
curl -b cookies.txt http://localhost:3000/api/live/state
```
