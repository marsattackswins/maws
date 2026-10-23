# MAWS

**Market Analysis & Workflow System**

MAWS is a browser-based market-analysis and trading-workflow terminal. It brings Binance Futures market data, multi-chart analysis, technical indicators, drawings, replay, news, an economic calendar, and paper trading into one workspace. Server-managed Binance Testnet and Production trading are available only in the corresponding non-local runtime modes and remain subject to authentication and safety checks.

> **Trading risk:** Start in Chart Only or Paper Trading. Test exchange workflows on Testnet before considering Production. Binance API keys must not have withdrawal permission. MAWS is software, not financial advice.

## What is in the workspace

- **Market analysis:** Binance USDT-M Futures candles and quotes, a watchlist, multiple chart layouts, indicators, drawing tools, and saved templates.
- **Chart tools:** The app integrates LuxAlgo's Vela charting engine from vendored source in `lib/charting/`. It includes replay, Pine indicators through `@luxalgo/vela-pinets`, timeline marks, and chart settings.
- **Market context:** News is available through the Finnhub integration when configured; economic-calendar data is supplied by Xoomar. The Sessions card shows Tokyo, London, and New York cash-market hours (08:00–17:00 local venue time, weekdays).
- **Trading workflows:** Browser-local Paper Trading plus server-managed Binance profiles in non-local modes. Orders and positions for a live profile are not browser-owned state.

The Vela workspace host is feature-flagged with `NEXT_PUBLIC_MAWS_VELA_WORKSPACE`; see `.env.example` and `components/charts/VelaWorkspaceHost.tsx` for the current integration boundary. When a saved chart template named `maws` is available, the host applies it to the initial chart cells. The vendored charting source retains its upstream Apache-2.0 `LICENSE` and `NOTICE`.

## Runtime modes

| Mode | Use | Trading behavior |
|---|---|---|
| `local` | Local development and chart analysis; this is the default | Chart Only and browser-local Paper Trading. Server live-trading routes reject requests in local mode. |
| `testnet` | Binance USD-M Futures Testnet server runtime | Uses Testnet credentials, operator authentication, and server safety checks. Testnet orders affect the Testnet account. |
| `production` | Binance USD-M Futures Production server runtime | Real orders may be submitted; authentication, confirmation, health, reconciliation, and risk checks apply. |
| `shadow` | Internal read-only production-data runtime | Not a normal selectable UI profile; order submission is not allowed. |

`MAWS_ENV=local` does **not** allow you to attach a Binance profile from the UI. Changing the active Binance runtime requires configuring the appropriate non-local environment, credentials, and operator authentication, then restarting the server. Paper Trading does not contact Binance.

## Run locally

Requirements: Node.js 20+, npm, Git, and a modern browser.

```bash
git clone https://github.com/marsattackswins/maws.git
cd maws
npm install
```

Copy the example environment file:

```powershell
Copy-Item .env.example .env.local
```

On macOS or Linux:

```bash
cp .env.example .env.local
```

Keep `MAWS_ENV=local` and leave exchange credentials empty for charting and Paper Trading. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). MAWS uses port **3000 only**: browser workspace state is saved by origin, so another port would appear as a separate, empty workspace. The development launcher refuses to use a different port if 3000 is occupied.

The browser stores workspace preferences and Paper Trading state in origin-scoped local storage. Server-side trading and audit data uses SQLite at `.maws/maws.db` by default. Keep both local working data and `.env.local` out of source control.

## Configure a server-managed Binance runtime

For an exchange-connected environment, set `MAWS_ENV=testnet` or `MAWS_ENV=production` and configure the matching profile's API key and secret in the server environment. Set `MAWS_OPERATOR_AUTH` to the generated scrypt credential; the plain password is entered at login and is not stored in the environment file.

```bash
npm run gen-operator-auth -- "choose-a-strong-password"
```

Use separate Testnet and Production keys, disable withdrawal permission, and keep all credentials server-side. Production also requires explicit confirmation. Leave execution switches disabled until the environment is intentionally configured. Never expose credentials through `NEXT_PUBLIC_*` variables or commit value-bearing environment files. Check [.env.example](.env.example) and [Security](docs/SECURITY.md) before deploying.

## Main pages

- `/` — charting and trading workspace
- `/login` — operator login for protected non-local environments
- `/admin` — operations console
- `/admin/journal` — trade journal
- `/status` — trading-health status page

## Development checks

```bash
npm test                 # Jest application/unit suite
npm run test:charting     # Vitest suite for vendored Vela charting source
npx tsc --noEmit          # TypeScript check
npm run build             # Production build and standalone preparation
npx playwright test       # Browser workflows
npm run secret-scan       # Scan tracked/project files for likely secrets
```

Integration tests in `tests/integration/` can create and modify **Binance Testnet** orders and positions. Configure a separate `.env.integration`, check the test setup, and clean up Testnet exposure after running them. Never use Production credentials for tests.

## Project map

| Path | Responsibility |
|---|---|
| `app/` | Next.js pages and API route handlers |
| `components/` | Workspace, chart overlays, settings, trading, news, and calendar UI |
| `lib/market/` | Binance market-data feed and candle normalization |
| `lib/trading/` | Client-facing trading helpers and paper-trading logic |
| `lib/server/` | Server-only authentication, profiles, broker runtime, risk, persistence, health, and audit |
| `lib/charting/` | Vendored Vela charting engine |
| `tests/`, `lib/tests/` | Jest tests |
| `lib/charting/test/` | Vela Vitest tests |
| `tests/integration/` | Testnet integration tests |
| `e2e/` | Playwright browser tests |

For API and operations references, see [docs/](docs/). For Vela-specific details, see [lib/charting/README.md](lib/charting/README.md). The Obsidian notes in `obsidian-vault/` are local and intentionally ignored by Git; they are not included in repository clones.
