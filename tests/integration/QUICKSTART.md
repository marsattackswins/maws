# Integration Tests — Quick Start (2 Minutes)

## Step 1: Get Testnet Credentials (1 min)

1. Go to https://testnet.binancefuture.com
2. Sign up (free, no verification needed)
3. **API Management** → **Create API Key**
4. Enable **Futures Trading** ✅
5. Copy your API Key and Secret

## Step 2: Configure (30 sec)

```bash
# Copy template
cp .env.integration.example .env.integration

# Edit with your credentials (use your favorite editor)
nano .env.integration
```

Paste your credentials:
```env
MAWS_BINANCE_API_KEY=abc123...
MAWS_BINANCE_API_SECRET=xyz789...
```

## Step 3: Fund Account (30 sec)

1. Login to testnet.binancefuture.com
2. Click **"Get Testnet Funds"** (top right)
3. Request 10,000 USDT

## Step 4: Validate Setup

```bash
npm run test:integration:setup
```

You should see:
```
✅ .env.integration file exists
✅ MAWS_BINANCE_API_KEY is set
✅ MAWS_BINANCE_API_SECRET is set
✅ API key format looks valid
✅ Testnet API is reachable
✅ API credentials are valid
🎉 All checks passed!
```

## Step 5: Run Tests

```bash
npm run test:integration
```

First run takes 2-3 minutes. You'll see:
```
 PASS  tests/integration/order-lifecycle.integration.test.ts (32.1s)
 PASS  tests/integration/position-sync.integration.test.ts (28.7s)
 PASS  tests/integration/stream-recovery.integration.test.ts (25.4s)

Test Suites: 3 passed, 3 total
Tests:       21 passed, 21 total
Time:        86.2s
```

## Troubleshooting

### "Integration tests require Binance testnet credentials"
→ Check `.env.integration` exists and has valid credentials

### "429 Rate Limit Exceeded"
→ Wait 60 seconds and retry

### "Insufficient margin"
→ Fund your testnet account (step 3)

### Tests pass locally but fail in CI
→ Add secrets to GitHub: `TESTNET_API_KEY` and `TESTNET_API_SECRET`

## Daily Usage

```bash
# Before pushing code
npm run test:integration

# Debugging a specific test
npm run test:integration -- order-lifecycle

# Verbose output for debugging
npm run test:integration:verbose
```

## What Gets Tested

- ✅ Market and limit orders
- ✅ Order fills and cancellations
- ✅ Long and short positions
- ✅ Position P&L tracking
- ✅ WebSocket stream connection
- ✅ State reconciliation
- ✅ Fill event propagation

## Next Steps

- Read `SETUP.md` for detailed troubleshooting
- Read `README.md` for test architecture
- Read [`../../docs/DEVELOPER.md`](../../docs/DEVELOPER.md) for the overall testing strategy

---

**Got issues?** Run `npm run test:integration:setup` to diagnose
