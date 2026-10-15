<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Charting engine (`lib/charting`)

Vendored source of LuxAlgo's vela charting library (Apache-2.0 — keep `lib/charting/LICENSE` and `NOTICE`), consumed as source: there is no npm package or build step for it.

- App code imports it as `@/lib/charting` (and `@/lib/charting/data/providers/binance`).
- Its own vitest suite runs via `npm run test:charting`; jest ignores the folder and stubs it through `__mocks__/vela.js` + `__mocks__/vela-providers-binance.js`.
- The folder is excluded from the app's eslint rules — follow upstream's style there, keep the attribution mark intact (NOTICE obligation), and document local fixes in `lib/charting/README.md`.
- The npm package `@luxalgo/vela` in dependencies exists only to satisfy `@luxalgo/vela-pinets`' peer dependency — app code never imports the registry copy.

## App address (port 3000 only)

The app serves on port **3000, always** — `scripts/app-port.mjs` holds that constant and
dev, supervisor and standalone all import it. Never add a `PORT` / `MAWS_PORT` override
or a "next free port" fallback: the browser keys saved workspace state (layout, chart +
app settings, drawings, watchlist, paper account) by ORIGIN, so any other port opens an
empty, default workspace. `npm run dev` refuses to start when 3000 is taken instead of
letting Next walk up to 3001.

## Function design

- Prefer small, single-purpose functions; treat roughly 40 logical lines as a review prompt, not a hard limit.
- Review functions above roughly 80 logical lines for meaningful extraction, prioritizing responsibility, branching, hidden side effects, and testability over line count.
- Keep validation, state mutation, external I/O, audit logging, metrics, and response formatting distinct where practical in safety-sensitive modules.
- Do not introduce tiny abstractions solely to satisfy a line-count target.
