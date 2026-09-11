# Integration Test Setup Guide

## Quick Start

### 1. Get Testnet Credentials

1. Visit https://testnet.binancefuture.com
2. Sign up (free account, separate from main Binance)
3. Navigate to **API Management**
4. Click **Create API Key**
5. Enable **Futures Trading** permission
6. Copy your **API Key** and **Secret Key**

### 2. Fund Your Testnet Account

1. Login to testnet.binancefuture.com
2. Click **Get Testnet Funds** in the top right
3. Request 10,000 USDT (resets every 24h if needed)
4. Verify balance appears in your Futures wallet

### 3. Configure Environment

```bash
# Copy the example file
cp .env.integration.example .env.integration

# Edit with your credentials
nano .env.integration
```

Add your testnet credentials:
```env
MAWS_BINANCE_API_KEY=your-actual-testnet-api-key
MAWS_BINANCE_API_SECRET=your-actual-testnet-secret
```

### 4. Run Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific test file
npm run test:integration -- order-lifecycle.integration.test.ts

# Run with verbose output for debugging
npm run test:integration:verbose
```

## Troubleshooting

### "Integration tests require Binance testnet credentials"

**Problem**: Missing or invalid credentials in `.env.integration`

**Solution**:
1. Verify `.env.integration` exists in project root
2. Check that API key and secret are filled in
3. Ensure no extra spaces or quotes around values
4. Test credentials manually:
   ```bash
   curl -X GET "https://testnet.binancefuture.com/fapi/v2/account" \
     -H "X-MBX-APIKEY: your-key-here"
   ```

### "Timeout waiting for order to reach FILLED"

**Problem**: Testnet may have low liquidity or be experiencing delays

**Solutions**:
- Wait and retry (testnet can be slow)
- Check testnet status at https://testnet.binancefuture.com
- Increase timeout with `MAWS_TEST_TIMEOUT_MULTIPLIER=2.0` in `.env.integration`

### "429 Rate Limit Exceeded"

**Problem**: Too many requests to testnet API

**Solutions**:
- Wait 60 seconds between test runs
- Check if you have other processes hitting testnet
- Testnet has lower rate limits than production

### "Insufficient margin" errors

**Problem**: Testnet account has insufficient USDT balance

**Solution**:
1. Login to testnet.binancefuture.com
2. Request more testnet funds (available every 24h)
3. Verify balance in Futures wallet, not Spot

### Tests pass locally but fail in CI

**Possible causes**:
1. **Missing secrets**: Add `TESTNET_API_KEY` and `TESTNET_API_SECRET` to GitHub repo secrets
2. **Network restrictions**: Testnet may block certain IP ranges
3. **Concurrent runs**: Multiple CI jobs using same API keys hit rate limits

## CI/CD Setup

### GitHub Actions

1. Go to your repo's **Settings → Secrets and variables → Actions**
2. Add secrets:
   - `TESTNET_API_KEY`: Your testnet API key
   - `TESTNET_API_SECRET`: Your testnet secret key
3. (Optional) Add `SLACK_WEBHOOK` for failure notifications

The workflow at `.github/workflows/integration-tests.yml` will:
- ✅ Run on PRs touching server code
- ✅ Run nightly at 2 AM UTC
- ✅ Allow manual trigger with verbose option

## Best Practices

### Before Committing

```bash
# Always run integration tests locally before pushing
npm run test:integration

# Verify no leaked credentials
npm run secret-scan
```

### Cleanup Between Runs

Tests clean up automatically, but to manually reset testnet state:

1. Cancel all orders:
   ```bash
   curl -X DELETE "https://testnet.binancefuture.com/fapi/v1/allOpenOrders?symbol=BTCUSDT" \
     -H "X-MBX-APIKEY: your-key"
   ```

2. Close all positions via the web UI or REST API

### Rate Limit Management

- Tests run sequentially (`--runInBand`) to avoid concurrent API calls
- Each test has ~15-30s timeout
- Total suite runs in 2-3 minutes
- Don't run tests in parallel — testnet rate limits are strict

## Test Data

Tests use deterministic order IDs: `int-{runId}-{sequence}`

This allows:
- ✅ Tracking orders across test runs
- ✅ Avoiding collisions between concurrent developers
- ✅ Debugging specific orders in testnet UI

## Security Notes

- ⚠️ **Never commit `.env.integration`** — it's in `.gitignore`
- ✅ Use testnet credentials ONLY (never production keys)
- ✅ Testnet API keys have limited permissions (can't withdraw)
- ✅ Tests never touch production endpoints

## Getting Help

If tests consistently fail:

1. **Check testnet status**: https://testnet.binancefuture.com
2. **Enable verbose logs**: `npm run test:integration:verbose`
3. **Verify credentials work**: Use Postman or curl to test API
4. **Check rate limits**: Wait 60s and retry
5. **Review test output**: Look for specific error messages

For issues with the test framework itself, check:
- `tests/integration/helpers.ts` — Core test utilities
- `tests/integration/README.md` — Test architecture docs
