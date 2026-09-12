# MAWS

**Market Analysis & Workflow System**

MAWS is a browser-based workspace for studying markets and, when you choose, trading through Binance Futures. It combines charts, indicators, drawings, replay tools, market news, the Xoomar economic calendar, Paper Trading, and optional Binance Testnet or Production connections.

> **Safety first:** Start in Chart Only or Paper Trading. Use Testnet before Production. Binance API keys must not have withdrawal permission. MAWS is a tool, not financial advice.

## What MAWS does

MAWS keeps the charting experience in the browser, but keeps trading authority on the server:

```text
Your browser
  charts, indicators, drawings, calendar, news, and Trade controls
        |
        v
MAWS server
  login, profile switching, Binance connection, safety checks,
  order handling, account state, history, and local database
        |
        v
Paper Trading or Binance
  simulated orders, Binance Testnet, or Binance Production
```

The browser never receives Binance secrets. The server checks account state, connection health, fresh market/account data, reconciliation, execution settings, and risk limits before accepting a live order. If something is uncertain or unhealthy, MAWS blocks the action instead of guessing.

### The four choices you can use

| Choice | What it means |
|---|---|
| **Chart Only** | Study the market without an attached trading account. This is how MAWS starts. |
| **Paper Trading** | Simulated orders and positions. No Binance account is contacted. |
| **Binance Testnet** | Practice with Binance's separate test account. It is not real-money trading, but Testnet orders are still real activity on that account. |
| **Binance Production** | Real Binance Futures trading. Use only after careful testing and confirmation. |

The normal setup uses `MAWS_ENV=local`. This only controls how the server starts; it does not prevent you from attaching a configured Testnet or Production profile from the Trade screen. You do not change the environment or restart MAWS when switching profiles.

## Install MAWS

### Requirements

- Node.js 20 or newer
- npm
- Git
- A modern browser

### 1. Download and start

```bash
git clone -b master https://github.com/marsattackswins/maws.git
cd maws
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use this instead of `cp`:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). MAWS starts in Chart Only. You can use charts immediately; no Binance keys are needed for charting or Paper Trading.

Your local database is stored in `.maws/maws.db`. It is local working data and should not be committed.

### 2. Fill in the environment file only when needed

The copied `.env.local` is intentionally small. In normal use:

1. Leave `MAWS_ENV=local`.
2. Leave the Testnet and Production fields empty until you need them.
3. Leave both profile execution switches set to `false` while setting up.
4. Leave `MAWS_EXECUTION_ENABLED=false` until you deliberately decide to enable live order submission.

For Paper Trading, you do not need to add Binance keys or create an operator password.

### 3. Add the operator password for Binance profiles

Binance Testnet and Production require an operator login. MAWS does not store the plain password in the environment file. Instead:

1. Choose a strong password.
2. Run:

   ```bash
   npm run gen-operator-auth -- "your-password"
   ```

3. Copy the generated value into `MAWS_OPERATOR_AUTH` in `.env.local`.
4. Keep the original password safe; you will type it into the MAWS login dialog when attaching a Binance profile.
5. Restart MAWS after changing `.env.local`.

Keep `.env.local` private. Never place Binance keys, secrets, or the operator password in source code or in a variable beginning with `NEXT_PUBLIC_`.

### 4. Add Binance Testnet

When you are ready to practise:

1. Create Binance Futures Testnet API credentials.
2. Put the Testnet key and secret in the two Testnet fields in `.env.local`.
3. Make sure withdrawals are disabled for the key.
4. Leave `MAWS_BINANCE_TESTNET_EXECUTION_ENABLED=false` while checking the connection.
5. Restart MAWS.
6. Use **Trade** in MAWS and choose **Binance Testnet**.
7. Enter the operator password and wait for the readiness checks.

A profile can be connected while order execution remains disabled. The execution switches are safety gates, not a replacement for login, account checks, reconciliation, or risk checks.

### 5. Add Binance Production

Only do this after Testnet works as expected:

1. Create a separate Binance Production API key and secret.
2. Disable withdrawals on the key.
3. Put the values in the Production fields in `.env.local`.
4. Keep `MAWS_BINANCE_PRODUCTION_EXECUTION_ENABLED=false` and `MAWS_EXECUTION_ENABLED=false` until you are ready.
5. Restart MAWS.
6. Choose **Binance Production** from **Trade**, enter the operator password, and complete the extra Production confirmation.

MAWS will still block orders if health, reconciliation, account state, risk limits, or another safety check is not ready.

## Use MAWS

### Charting

1. Start MAWS and remain in Chart Only.
2. Choose a symbol and timeframe.
3. Add indicators, drawings, linked charts, volume, layouts, replay, news, and calendar views as needed.
4. Use the economic calendar as an information source; MAWS currently gets those events from Xoomar.
5. Open **Trade** only when you intentionally want to attach Paper Trading or a Binance profile.

### Paper Trading

1. Click **Trade**.
2. Choose **Paper Trading**.
3. Use the trading panel to create simulated orders and review positions, history, balance, journal, and metrics.
4. Remember that Paper Trading never sends an order to Binance.
5. Return to Chart Only when you want to detach the simulated trading session.

### Testnet

Testnet is the safest way to learn the connected workflow. After selecting it, wait for the connection, stream, account snapshot, and reconciliation checks to become ready. Review the trading panel before every order. Testnet orders can still create positions and balances on the Testnet account, so close or clean up test exposure when finished.

### Production

Production can send real orders. Confirm the symbol, side, amount, price, account, and protection before submitting. Keep the health and trading panels visible. If an order result is unclear, do not click again immediately; let MAWS reconcile with Binance first.

If MAWS shows a freeze, stale data, stream problem, reconciliation problem, circuit breaker, or risk rejection, stop and resolve that condition. A connected account does not mean that order submission is allowed.

### Returning to charting or Paper Trading

Use **Trade** and select Chart Only or Paper Trading. MAWS detaches the Binance profile before changing to another profile. No environment change or server restart is needed for normal profile switching.

## Checks for contributors

```bash
npm test
npx tsc --noEmit --pretty false
npm run build
npx playwright test
npm run secret-scan
```

Integration tests use Binance Testnet only and require a separate `.env.integration` file. Never use Production credentials for tests.

## More information

- [`docs/README.md`](docs/README.md) — detailed architecture and deployment notes
- [`docs/API.md`](docs/API.md) — API reference
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — operations and troubleshooting
- [`docs/SECURITY.md`](docs/SECURITY.md) — security details
- [`obsidian-vault/`](obsidian-vault/) — local Obsidian notes; ignored by Git
