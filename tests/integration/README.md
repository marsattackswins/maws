# Integration Tests Against Binance Testnet

This directory contains **real end-to-end integration tests** that submit orders to Binance's testnet and validate the complete order lifecycle, position synchronization, and stream recovery.

## ⚠️ Important: Real Network Tests

Unlike the unit tests in `tests/live-tests/`, these tests make **actual HTTP requests and WebSocket connections** to Binance testnet. They require valid testnet API credentials and may take 30-60 seconds to complete.

## Prerequisites

### 1. Get Binance Testnet Credentials

1. Visit [https://testnet.binancefuture.com](https://testnet.binancefuture.com)
2. Create an account (separate from your main Binance account)
3. Navigate to API Management
4. Generate a new API key pair
5. **Important**: Enable futures trading permissions
6. Copy your API key and secret

### 2. Configure Environment

Create a `.env.integration` file in the project root:

```bash
# Binance USD-M Futures Testnet credentials
MAWS_BINANCE_TESTNET_API_KEY=your-testnet-api-key-here
MAWS_BINANCE_TESTNET_API_SECRET=your-testnet-secret-here

# Optional: Telegram/Discord webhook for test notifications
# MAWS_ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...
```

**Never commit this file.** It's already in `.gitignore`.

### 3. Fund Your Testnet Account

Testnet accounts need USDT balance:
1. Login to testnet.binancefuture.com
2. Use the built-in "Get Testnet Funds" feature
3. Verify you have at least 1000 USDT available

## Running the Tests

### Run all integration tests
```bash
npm run test:integration
```

### Run a specific test file
```bash
npm run test:integration -- tests/integration/order-lifecycle.integration.test.ts
```

### Run with verbose output
```bash
npm run test:integration -- --verbose
```

## Test Coverage

These tests validate:

### 1. Order Lifecycle (`order-lifecycle.integration.test.ts`)
- ✅ Market order submission and immediate fill
- ✅ Limit order placement, modification, and cancellation
- ✅ Stop-loss order triggering
- ✅ Partial fills and fill price calculation
- ✅ Order rejection scenarios (insufficient margin, invalid price)

### 2. Position Synchronization (`position-sync.integration.test.ts`)
- ✅ Long and short position opening
- ✅ Position size accuracy after fills
- ✅ Unrealized P&L tracking
- ✅ Position closure via market order
- ✅ Position reduction scenarios

### 3. WebSocket Stream Recovery (`stream-recovery.integration.test.ts`)
- ✅ Initial stream connection and snapshot
- ✅ Stream disconnection detection
- ✅ Automatic reconnection with backoff
- ✅ State reconciliation after reconnect
- ✅ No duplicate fills from reconnection

### 4. Risk Management Integration (`risk-limits.integration.test.ts`)
- ✅ Max order notional enforcement
- ✅ Max gross exposure blocking
- ✅ Max open orders limit
- ✅ Max open positions limit
- ✅ Price collar rejection

### 5. Reconciliation Under Load (`reconciliation.integration.test.ts`)
- ✅ State drift detection (orders on exchange not in DB)
- ✅ Phantom order cleanup
- ✅ Fill history backfill
- ✅ Reconciliation during active trading

## Test Execution Time

- **Order lifecycle**: ~15-20 seconds
- **Position sync**: ~10-15 seconds  
- **Stream recovery**: ~25-30 seconds
- **Risk limits**: ~5-10 seconds
- **Reconciliation**: ~20-30 seconds

**Total suite time**: ~75-105 seconds

## CI/CD Integration

These tests should run:
- ✅ Before merging production-related PRs
- ✅ Nightly on main branch
- ❌ Not on every commit (too slow for quick feedback)

### GitHub Actions Example

```yaml
name: Integration Tests

on:
  pull_request:
    paths:
      - 'lib/server/**'
      - 'tests/integration/**'
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily

jobs:
  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - name: Run Integration Tests
        env:
          MAWS_BINANCE_TESTNET_API_KEY: ${{ secrets.TESTNET_API_KEY }}
          MAWS_BINANCE_TESTNET_API_SECRET: ${{ secrets.TESTNET_API_SECRET }}

        run: npm run test:integration
```

## Debugging Failed Tests

### 1. Check Testnet API Status
```bash
curl https://testnet.binancefuture.com/fapi/v1/ping
```

### 2. Verify Credentials
```bash
# Should return account info
curl -X GET "https://testnet.binancefuture.com/fapi/v2/account" \
  -H "X-MBX-APIKEY: your-key-here"
```

### 3. Check Rate Limits
Testnet has lower rate limits than production. If tests fail with 429 errors:
- Wait 60 seconds and retry
- Reduce test parallelism
- Check your testnet account for IP restrictions

### 4. Inspect Test Logs
Tests log all API interactions when `MAWS_TEST_VERBOSE=true`:
```bash
MAWS_TEST_VERBOSE=true npm run test:integration
```

## Test Isolation

Each test:
- Creates a unique `clientOrderId` prefix to avoid conflicts
- Cancels all open orders in `beforeEach`
- Closes all positions in `afterEach`
- Uses deterministic symbols (BTCUSDT only for now)

## Known Limitations

1. **Testnet != Production**: API behavior can differ slightly
2. **Fill delays**: Market orders may take 1-3 seconds to fill on testnet
3. **Price gaps**: Testnet prices may have larger spreads
4. **No load testing**: These tests don't validate high-frequency scenarios
5. **Single-threaded**: Tests run sequentially to avoid state conflicts

## Adding New Tests

When adding integration tests:

1. **Always cleanup**: Use `afterEach` to cancel orders and close positions
2. **Use waits strategically**: WebSocket events take time; add `await waitForStream()` helpers
3. **Assert state at multiple layers**: Check DB, in-memory state, and SSE events
4. **Test both success and failure**: Invalid orders should fail gracefully
5. **Document expected behavior**: Complex flows need inline comments

## Cost Considerations

These tests are **free** (testnet), but they:
- Consume API weight (rate limits)
- Generate exchange load (be respectful)
- Take real time (developer waiting)

Use them wisely: validate critical paths, not every edge case.
