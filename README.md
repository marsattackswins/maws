# MAWS

**Market Analysis & Workflow System**

MAWS is a local, browser-based multi-chart terminal for market analysis and operator-controlled trading workflows. It combines real-time market data, chart studies and drawings, paper trading, Binance USD-M Futures connectivity, account and position monitoring, execution safeguards, and operational observability in one Next.js application.

> **Trading safety:** MAWS can connect to real exchange accounts. Start in Paper Trading or Binance Testnet, keep withdrawal permissions disabled, and review every execution and risk setting before enabling production trading. This software is not financial advice.

## What MAWS provides

### Market analysis

- Multi-pane chart layouts powered by [Lightweight Charts](https://tradingview.github.io/lightweight-charts/).
- Symbol search and a managed market universe.
- Multiple timeframes, linked chart panes, chart range synchronization, and replay tools.
- Technical indicators and studies, including configurable chart overlays.
- Drawing tools and persisted chart objects.
- Volume visualization, price-scale controls, and a chart-level timezone selector.
- Market news, economic-calendar data, alerts, and symbol details where configured.
- Layout, theme, chart-style, label, and trading preference settings.

### Trading workflows

The application currently exposes these broker choices:

| Broker/profile | Purpose | Execution |
| --- | --- | --- |
| **Paper Trading** | Browser-local simulator for development and practice | Simulated only |
| **Binance Testnet** | Binance USD-M Futures test environment | Testnet orders after authenticated readiness |
| **Binance Production** | Binance USD-M Futures production environment | Real orders only after all gates and risk checks pass |
| **OKX** | Future broker slot | Disabled |

The trading area is the confirmed-broker-only `BottomPanel`. It contains:

- Positions
- Orders
- Order History
- Balance History
- Trading Journal
- Account metrics
- Trading date/time using the selected chart timezone
- Broker/profile readiness and stream status
- Execution state, frozen reason, and kill-switch/resume controls for live profiles
- Minimize, expand, and drag-resize controls

In chart-only mode, no trading panel or bottom-bar space is rendered. The panel appears only after Paper Trading is attached or after a Binance profile has been confirmed ready and attached. During a confirmed live-profile switch, the previously attached panel remains visible until the replacement profile is ready.

### Live trading and account state

Binance connectivity is server-mediated. The server owns the broker manager, exchange communication, execution gates, risk checks, reconciliation, and authoritative live state. The browser receives account, position, order, fill, health, and stream updates through the live API and server-sent events.

The live integration includes:

- Binance REST and WebSocket connectivity.
- Separate Testnet and Production profile credentials.
- Exchange clock synchronization and signed requests.
- Symbol metadata, decimal precision, exchange-filter, and order-intent validation.
- Order submission, cancellation, position close, and position-protection operations.
- Listen-key lease management and stream recovery.
- Reconciliation between local/server state and exchange state.
- Idempotent client order identifiers and mutation rate limiting.
- Circuit breakers for REST, WebSocket, and reconciliation paths.

## Safety model

MAWS is designed to fail closed rather than silently continue trading when configuration, authentication, broker readiness, or safety checks are unavailable.

### Authentication

- `local` mode provides anonymous charting and public market data; the browser-local Paper Trading profile can be attached without operator authentication.
- Testnet, Production, and other non-local operator pages and protected APIs require a session.
- Operator passwords are represented by a scrypt-derived credential with a salt.
- Sessions use HTTP-only cookies and CSRF tokens.
- Origin/host validation and login rate limiting protect authentication endpoints.
- Sessions can be revoked individually or globally.

### Execution gates

Production execution requires the relevant static and runtime gates to allow submissions. The live status display exposes readiness, stream health, blocked/frozen state, and the emergency kill switch. Turning on the kill switch blocks submissions; resuming trading still leaves normal authentication, readiness, risk, and broker checks in place.

### Risk checks

The server-side risk layer can enforce:

- Maximum order notional.
- Maximum gross exposure.
- Maximum open orders.
- Maximum open positions.
- Daily loss percentage.
- Price collars.
- Margin and account-state checks.
- Broker, circuit-breaker, and execution-gate health requirements.

The admin dashboard includes health, performance, metrics, and a risk/exposure cockpit. Risk and broker events are logged for operational review.

### Secrets and persistence

- API keys, API secrets, operator credentials, health tokens, and backup keys belong in environment variables or deployment secret storage.
- Binance credentials must never use a `NEXT_PUBLIC_` prefix or be committed to Git.
- Withdrawal permission should be disabled on exchange API keys.
- Persistent application state uses SQLite at `.maws/maws.db` by default.
- SQLite uses WAL mode, restrictive file permissions, migrations, and encrypted backup support.
- `.env`, `.env.local`, and integration environment files must remain untracked.

## Architecture

MAWS is a Next.js App Router application with client-side chart and workflow state, server-side broker and security services, and a SQLite persistence layer.

```text
Browser UI
  ├─ Chart grid, studies, drawings, settings, news, calendar, replay
  ├─ BottomPanel: trading tabs, metrics, clock, readiness, safety controls
  └─ Admin/status pages
        │
        ▼
Next.js route handlers
  ├─ Authentication and sessions
  ├─ Live broker/profile/order APIs
  ├─ Binance market-data APIs
  ├─ Admin, health, metrics, and risk APIs
  └─ News, calendar, logo, and status APIs
        │
        ▼
Server services
  ├─ Broker abstraction and Binance USD-M Futures adapter
  ├─ REST/WebSocket managers and SSE event bus
  ├─ Risk and execution gates
  ├─ Reconciliation and circuit breakers
  ├─ Audit logging and metrics
  └─ SQLite persistence and encrypted backups
```

### Important directories

```text
app/                    Next.js pages and API route handlers
components/             React UI, charts, trading, settings, and shell components
lib/                    Client and server libraries
  live/                 Live API, bridge, state, and profile lifecycle
  server/               Auth, broker, Binance, risk, DB, health, metrics, and resilience
  trading/              Paper trading, order dispatch, exits, and symbol settings
  maws/                 Brand, feed, and market universe modules
tests/                  Jest unit, focused, integration, and live-state tests
e2e/                    Playwright browser workflows
public/                 Static assets and brand resources
docs/                   Architecture, API, developer, operations, and security guides
deploy/                 Docker and deployment files
scripts/                Development, smoke-test, auth, and secret-scan utilities
.maws/                  Runtime SQLite data directory; do not commit local state
```

## Requirements

- Node.js 20 or newer; Node.js 22 is used by the provided Docker image.
- npm.
- Git.
- A modern browser.
- Binance credentials only when using a configured Testnet or Production profile.
- Testnet funding and credentials only when running live integration tests.

## Operating modes

MAWS separates the server startup environment from the broker/profile attached in the browser:

| Mode/profile | What it does | Authentication and credentials |
| --- | --- | --- |
| **Local/chart mode** (`MAWS_ENV=local`) | Public market data and charting. Authenticated Binance/live-trading APIs are refused. | No operator password or Binance credentials required. |
| **Paper Trading** (`paper`) | Browser-local simulated orders and positions for development and practice. It never submits exchange orders. | No Binance credentials. It can be attached from local mode without operator authentication. |
| **Binance Testnet** (`MAWS_ENV=testnet`, `binance-testnet`) | Connects to Binance USD-M Futures Testnet. Orders and positions affect the Testnet account, not Production. | Operator authentication and Testnet API credentials are required. Execution remains subject to the configured gates and risk checks. |
| **Binance Production** (`MAWS_ENV=production`, `binance-production`) | Connects to Binance USD-M Futures Production and can submit real orders. | Operator authentication, Production credentials, explicit Production confirmation, execution gates, and risk checks are required. |

`shadow` is a separate server-only mode for Production market data and read-only account monitoring; it is not a selectable browser profile and cannot submit orders.

## Quick start: local development

```bash
# Install dependencies
npm install

# Create local configuration (the file is ignored by Git)
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development helper starts Next.js using `PORT` when supplied and opens the browser after the server responds. The example already defaults to `MAWS_ENV=local`; leave that setting in place for chart-only development, then attach Paper Trading when you want to exercise simulated workflows.

On Windows PowerShell, create the local file with:

```powershell
Copy-Item .env.example .env.local
```

To use another port:

```bash
PORT=3010 npm run dev
```

On Windows PowerShell, use:

```powershell
$env:PORT = "3010"
npm run dev
```

## Environment configuration

Copy an example file to the local filename used by the relevant command, keep it outside version control, and fill in only the settings needed for that mode. The full configuration reference is in [`docs/OPERATIONS.md`](docs/OPERATIONS.md).

### Available example files

- [`.env.example`](.env.example) — the main template for local development and server configuration. It documents public market-data/debug settings, `MAWS_ENV`, authentication, persistence, separate Binance Testnet/Production credentials, execution gates, risk limits, and circuit breakers. Copy it to `.env.local` for the Next.js app; do not put real secrets in the template.
- [`.env.integration.example`](.env.integration.example) — the separate Binance Testnet integration-test template. Copy it to `.env.integration` and provide Testnet-only credentials before running `npm run test:integration`.

`.env.local`, `.env.integration`, and other `.env*` files containing values are ignored by Git. Binance keys, API secrets, operator credentials, health tokens, and backup keys must stay in server-side environment configuration and must never use a `NEXT_PUBLIC_` prefix.

### Core server modes

```env
MAWS_ENV=local
MAWS_DEFAULT_PROFILE=paper
```

`MAWS_ENV` controls the server startup environment. `MAWS_DEFAULT_PROFILE` names profile metadata; it does not switch the process environment or attach a broker by itself.

Supported server environment modes are:

- `local`: public data and charting only; Binance authenticated/live-trading integration is refused and authentication is not required.
- `testnet`: Binance USD-M Futures Testnet; operator authentication and complete Testnet credentials are required.
- `shadow`: Production market data with read-only account monitoring; it is internal server mode and cannot submit orders.
- `production`: Binance Production; operator authentication, complete Production credentials, explicit Production confirmation, execution gates, and valid risk configuration are required.

### Main configuration groups

| Group | Examples | Purpose |
| --- | --- | --- |
| Environment/profile | `MAWS_ENV`, `MAWS_DEFAULT_PROFILE` | Select the server startup mode and profile metadata |
| Authentication | `MAWS_OPERATOR_AUTH` | Configure the scrypt-based operator credential |
| Binance profiles | `MAWS_BINANCE_TESTNET_*`, `MAWS_BINANCE_PRODUCTION_*` | Keep Testnet and Production credentials isolated |
| Persistence | `MAWS_DB_PATH`, `MAWS_BACKUP_KEY` | Configure SQLite and encrypted backups |
| Network security | `MAWS_ALLOWED_ORIGIN`, `MAWS_TRUST_PROXY` | Protect browser requests behind a proxy |
| Execution | `MAWS_EXECUTION_ENABLED` | Static execution gate for live submissions |
| Monitoring | `MAWS_HEALTH_TOKEN`, `MAWS_ALERT_WEBHOOK_URL` | Health access and operational alerts |
| Risk | `MAWS_RISK_*` | Limits for notional, exposure, orders, positions, loss, and collars |
| Resilience | `MAWS_CB_*`, `MAWS_RECON_INTERVAL_MS`, `MAWS_LEASE_TTL_MS` | Circuit breakers, reconciliation, and stream leases |
| Market services | `FINNHUB_API_KEY` | Optional market-news integration |

Generate an operator credential with:

```bash
npm run gen-operator-auth
```

Never paste credentials, passwords, API keys, API secrets, session tokens, or health tokens into source files, the README, issue reports, or client-exposed environment variables.

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Create the optimized standalone production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest suite |
| `npm test -- --runInBand` | Run Jest sequentially, recommended for the full suite |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:coverage` | Generate Jest coverage output |
| `npm run test:integration:setup` | Check integration-test prerequisites |
| `npm run test:integration` | Run Binance Testnet integration tests using `.env.integration` |
| `npm run test:integration:verbose` | Run integration tests with verbose diagnostics |
| `npx playwright test` | Run browser E2E tests on the configured isolated dev server |
| `npm run smoke:live:dry` | Run the live smoke script without mutations |
| `npm run smoke:live` | Run the configured live smoke workflow; review its environment first |
| `npm run secret-scan` | Scan the repository for likely leaked secrets |
| `npm run gen-operator-auth` | Generate an operator password credential |

### Recommended validation sequence

For a normal code change:

```bash
npx tsc --noEmit --pretty false
npm run lint
npm test -- --runInBand
npm run build
npm run secret-scan

git diff --check
```

Do not run integration or live smoke commands against Production credentials as a substitute for unit tests. Integration tests use Binance Testnet credentials and should be run sequentially because exchange testnet rate limits are strict.

## GitHub Actions checks

The repository workflows run against the `master` branch:

- **CI - TypeScript & Unit Tests** (`.github/workflows/ci-unit.yml`) runs on pushes and pull requests targeting `master`. It installs with `npm ci`, runs `npx tsc --noEmit`, and runs the Jest suite with `npm test`.
- **CI - Live Smoke Test** (`.github/workflows/ci-smoke.yml`) runs nightly or manually. It type-checks the project and always runs the no-network smoke CLI dry run. The optional live smoke runs against a configured Testnet deployment only when `SMOKE_BASE_URL` and `SMOKE_SESSION` repository secrets are available; otherwise it reports that the live check was skipped.
- **Integration Tests** (`.github/workflows/integration-tests.yml`) runs for pull requests that change server or integration-test files, nightly, or manually. It checks Binance Testnet availability, runs the integration suite with Testnet credentials from GitHub Secrets, uploads failure artifacts, and validates the workflow YAML in a follow-up job.

The workflows use `actions/checkout@v5`, `actions/setup-node@v5`, and `actions/upload-artifact@v7` where applicable. The Node.js runtime configured in the workflows is Node 20.

## Integration tests

Integration tests use Binance Futures Testnet and can create real Testnet orders and positions. They require a separate `.env.integration` file with Testnet-only credentials:

```bash
cp .env.integration.example .env.integration
# Edit .env.integration with Testnet credentials only
npm run test:integration:setup
npm run test:integration
```

Before running them:

1. Create a Binance Futures Testnet account.
2. Create a Testnet API key with Futures trading permission.
3. Fund the Testnet account.
4. Confirm that the credentials are not Production credentials.
5. Run tests sequentially and allow cleanup to complete.
6. Run `npm run secret-scan` before committing.

See [`tests/integration/SETUP.md`](tests/integration/SETUP.md) for credential setup, troubleshooting, cleanup, and CI details.

## Production build and deployment

The production build uses Next.js standalone output:

```bash
npm ci
npm run build
npm start
```

The application should be placed behind a TLS-terminating reverse proxy in non-local deployments. Configure a fixed egress IP if Binance API-key IP allowlisting is used.

The provided Docker image builds and runs the standalone server:

```bash
docker build -f deploy/Dockerfile -t maws .
docker run \
  --env-file /etc/maws/maws.env \
  -p 127.0.0.1:3000:3000 \
  -v maws-data:/app/.maws \
  maws
```

Operational deployment requirements include:

- Set `MAWS_ENV` explicitly; do not rely on accidental defaults for production.
- Store secrets in the deployment environment, not in the image or repository.
- Use separate Testnet and Production credentials.
- Disable withdrawal permissions on exchange keys.
- Set `MAWS_ALLOWED_ORIGIN` and configure proxy trust only when appropriate.
- Persist `.maws` data and back it up using the encrypted backup flow.
- Monitor health, stream status, circuit breakers, risk freezes, reconciliation drift, and audit events.

## API surface

The route handlers are grouped by responsibility:

- `/api/auth/*` — login, session, logout, and emergency session revocation.
- `/api/live/*` — profile discovery/switching, connection lifecycle, live state, SSE events, orders, cancellations, position closes, protection, gates, reconciliation, and stream status.
- `/api/admin/*` — circuits, configuration, health, journal, metrics, performance, and risk views.
- `/api/health/*` and `/api/status/*` — health and trading-status checks.
- `/api/binance/*` — Binance market data and symbol/klines access.
- `/api/news/*` and `/api/calendar/*` — optional news and economic-calendar data.

See [`docs/API.md`](docs/API.md) for request authentication, response formats, error codes, payloads, and endpoint examples.

## Development conventions

- Keep server-only code under `lib/server/` and do not import it into client components.
- Treat the server/exchange state as authoritative for live trading.
- Keep Paper Trading and live broker state mutually exclusive in the UI.
- Preserve profile generation/readiness fencing during live switches.
- Keep execution, risk, authentication, and emergency controls fail closed.
- Add focused tests for state transitions, validation, safety gates, and boundary conditions.
- Never weaken, skip, or delete safety and authentication tests to make a change pass.
- Run focused tests first, then the broader suite and build before pushing.

## Documentation map

- [`docs/README.md`](docs/README.md) — detailed product and architecture overview.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — module organization, broker interfaces, Binance services, persistence, metrics, and data flow.
- [`docs/API.md`](docs/API.md) — HTTP API reference.
- [`docs/DEVELOPER.md`](docs/DEVELOPER.md) — setup, testing strategy, mocking, CI, and debugging.
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — environment variables, risk limits, circuit breakers, backups, and incident response.
- [`docs/SECURITY.md`](docs/SECURITY.md) — authentication, sessions, secrets, rate limiting, audit logging, and threat model.
- [`tests/integration/SETUP.md`](tests/integration/SETUP.md) — Binance Testnet integration setup.

## License and status

This repository is a private, actively developed trading terminal. The package is currently version `0.1.0`; interfaces, configuration names, and workflows may change as the system evolves.
