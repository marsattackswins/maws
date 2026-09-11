# MAWS

**Market Analysis & Workflow System**

MAWS is a browser-based market analysis terminal with multi-chart layouts, indicators, drawings, replay tools, Paper Trading, and optional Binance USD-M Futures connectivity. It is built for operator-controlled workflows: the browser provides the workspace, while the server controls live credentials, exchange communication, account state, order execution, and safety checks.

> **Safety first:** Start with Local/chart mode or Paper Trading. Use Binance Testnet before Production, disable withdrawal permissions on exchange keys, and review every execution and risk setting before enabling real trading. MAWS is not financial advice.

## How MAWS works

```text
Browser workspace
  charts, studies, drawings, settings, BottomPanel
        |
        v
Next.js route handlers
  authentication, profiles, orders, health, market data
        |
        v
Server-owned runtime
  Binance connection, execution gates, risk checks,
  reconciliation, audit history, and SQLite persistence
        |
        v
Binance REST/WebSocket or local Paper Trading state
```

The browser receives safe account, order, position, health, and stream updates. Binance credentials, operator credentials, listen keys, and execution decisions remain server-side. Live state is treated as authoritative on the server and exchange rather than trusted from browser state alone.

### Modes and profiles

| Mode/profile | Use | Requirements |
|---|---|---|
| **Local/chart mode** (`MAWS_ENV=local`) | Public market data and charting | No operator password or Binance credentials; live trading APIs are refused |
| **Paper Trading** (`paper`) | Browser-local simulated orders and positions | No Binance credentials; no exchange orders |
| **Binance Testnet** (`MAWS_ENV=testnet`) | Practice with Binance Futures Testnet | Operator authentication, Testnet credentials, and normal gates/risk checks |
| **Binance Production** (`MAWS_ENV=production`) | Real Binance Futures trading | Operator authentication, Production credentials, confirmation, execution gates, and risk checks |
| **Shadow** | Internal Production read-only monitoring | Server-only; never submits orders |

Paper Trading is separate from the server's `local` environment: local mode provides the charting/public-data context, and Paper Trading can be attached from the browser for simulation. Testnet and Production require authentication when connecting their live profiles.

### Safety model

MAWS is designed to fail closed. Normal live submissions are blocked when configuration, authentication, profile readiness, stream health, snapshot freshness, position mode, reconciliation, circuit breakers, or risk checks are not satisfactory. The server also provides execution gates, a kill switch, order/risk limits, idempotent client order IDs, and an emergency flatten action for supported live environments.

## Installation

### Requirements

- Node.js 20 or newer
- npm
- Git
- A modern browser

### Install and start locally

```bash
git clone -b master https://github.com/marsattackswins/maws.git
cd maws
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development helper starts Next.js and opens the browser after the server responds.

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Keep `MAWS_ENV=local` for normal local development. This requires no operator password, Binance credentials, or real exchange access. The default local database is `.maws/maws.db`.

To use another port:

```bash
PORT=3010 npm run dev
```

PowerShell:

```powershell
$env:PORT = "3010"
npm run dev
```

### Environment templates

Two example files are included:

- [`.env.example`](.env.example) — the main local/server configuration template. It documents local settings, authentication, persistence, optional Binance profiles, execution gates, risk limits, and resilience settings.
- [`.env.integration.example`](.env.integration.example) — Testnet-only configuration for integration tests. Copy it to `.env.integration` and use Testnet credentials only.

Keep `.env.local`, `.env.integration`, and all other value-bearing `.env*` files untracked. Binance keys, API secrets, operator credentials, health tokens, and backup keys must never use a `NEXT_PUBLIC_` prefix or appear in source code.

For non-local environments, generate the operator credential with:

```bash
npm run gen-operator-auth
```

Configure Testnet and Production with separate complete key/secret pairs. Disable withdrawal permission on both exchange keys.

## Usability guide

### 1. Analyze markets

1. Start the app in Local/chart mode.
2. Use symbol search and the chart controls to choose markets and timeframes.
3. Add indicators, studies, drawings, volume views, and linked chart panes as needed.
4. Use layout, theme, chart style, timezone, replay, news, alerts, and calendar tools where configured.
5. Keep the chart-only workspace separate from trading until a profile is intentionally attached.

### 2. Use Paper Trading

1. Start with `MAWS_ENV=local`.
2. Attach **Paper Trading** from the broker/profile controls.
3. Use the `BottomPanel` for positions, orders, order history, balance history, journal, metrics, and trading controls.
4. Paper orders and positions are simulated in the browser and never reach Binance.
5. Detach Paper Trading when returning to chart-only work.

The `BottomPanel` is the home for connection, readiness, execution, and safety controls. It appears when Paper Trading is attached or when a Binance profile has been confirmed ready; it is not restored to the top bar.

### 3. Use Binance Testnet

Testnet is the recommended next step after Paper Trading.

1. Create a Binance Futures Testnet account and API key.
2. Put Testnet credentials in server-side environment configuration only.
3. Set `MAWS_ENV=testnet` and provide `MAWS_OPERATOR_AUTH`.
4. Restart the server and sign in through the operator login.
5. Confirm the Binance Testnet profile and wait for readiness, stream health, and reconciliation.
6. Review the BottomPanel status and risk settings before submitting an order.

Testnet orders and positions are real Testnet activity. They are not Production orders, but they can create exposure on the Testnet account and should be cleaned up after testing.

### 4. Use Binance Production

Production can submit real orders and should only be enabled deliberately.

1. Verify the Testnet workflow first.
2. Configure separate Production credentials on the server and disable withdrawals.
3. Set `MAWS_ENV=production` and configure the operator credential and required risk values.
4. Sign in, select Binance Production, and complete the explicit Production confirmation.
5. Check readiness, stream health, snapshot freshness, reconciliation, position mode, execution gates, and risk limits.
6. Keep the kill switch available and monitor the BottomPanel and health surfaces while operating.

A connected broker does not automatically mean submissions are allowed. MAWS can remain connected while normal execution is frozen because of stale data, stream problems, reconciliation drift, an open circuit, a risk limit, or a disabled gate.

### 5. If something looks wrong

Do not blindly retry an order or cancellation when the result is unknown. Stop normal mutations, inspect health and exchange state, and allow reconciliation to establish the current truth. For confirmed Testnet or Production exposure, use the emergency flatten workflow and verify its results afterward.

Useful local checks:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/broker
npm run secret-scan
```

## Testing and production build

### Unit, type, and browser tests

```bash
npm test
npm test -- --runInBand
npx tsc --noEmit --pretty false
npx playwright test
```

### Binance Testnet integration tests

Integration tests can create Testnet orders and positions. Set up a separate Testnet environment first:

```bash
cp .env.integration.example .env.integration
npm run test:integration:setup
npm run test:integration
```

Do not use Production credentials for integration tests.

### Production build

```bash
npm ci
npm run build
npm start
```

The application uses Next.js standalone output. Non-local deployments should use a TLS-terminating reverse proxy and keep secrets in deployment configuration rather than in the image or repository.

## Project map

```text
app/                    Pages and API route handlers
components/             Charts, shell, settings, trading, and UI components
lib/                    Client state plus server, market, and trading libraries
tests/                  Jest unit and server tests
tests/integration/      Binance Testnet integration tests
e2e/                    Playwright browser tests
scripts/                Development, smoke-test, auth, and secret-scan tools
docs/                   Detailed architecture, API, operations, and security guides
.maws/                  Local SQLite state; do not commit
```

## GitHub Actions

The repository maintains its workflows on `master`; the unit and integration pull-request checks explicitly target `master`:

- **CI - TypeScript & Unit Tests** runs on pushes and pull requests. It installs dependencies, type-checks, and runs Jest.
- **CI - Live Smoke Test** runs nightly or manually. It type-checks the project, runs a no-network smoke check, and optionally checks a configured Testnet deployment with repository secrets.
- **Integration Tests** run for relevant server/integration pull requests, nightly, or manually. They check Testnet availability, run the Testnet suite with GitHub Secrets, upload failure artifacts, and validate the workflow file.

The workflows use `actions/checkout@v5`, `actions/setup-node@v5`, and `actions/upload-artifact@v7` where applicable.

## More documentation

- [`docs/README.md`](docs/README.md) — detailed product and architecture overview
- [`docs/API.md`](docs/API.md) — HTTP API reference
- [`docs/DEVELOPER.md`](docs/DEVELOPER.md) — development and testing details
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — configuration and operations
- [`docs/SECURITY.md`](docs/SECURITY.md) — security details
- [`tests/integration/SETUP.md`](tests/integration/SETUP.md) — Testnet integration setup
