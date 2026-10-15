# MAWS ↔ Vela Integration Audit — Findings & Optimization Proposal

Date: 2026-10-12 · Branch: feat/vela-integration

## 1. Import correctness — VERIFIED CLEAN ✅

- App code imports the **vendored source** (`@/lib/charting`) everywhere; the npm
  `@luxalgo/vela` package appears only in `dependencies` to satisfy
  `@luxalgo/vela-pinets`' peer dep (per `AGENTS.md` contract). The only `@luxalgo/*`
  runtime import in app code is `PineEngine` from `@luxalgo/vela-pinets`
  ([VelaWorkspaceHost.tsx:33](../components/charts/VelaWorkspaceHost.tsx)) — correct.
- 21 app files touch Vela surfaces; all flow through the intended bridge modules:
  `lib/vela-feed-adapter`, `lib/vela-cell-wiring`, `lib/vela-chart-settings`,
  `lib/vela-indicators`, `lib/vela-layers`, `lib/vela-marks`,
  `lib/vela-native-indicators`, `lib/vela-drawing-aliases`, `lib/vela-templates`.
- No import cycles detected between the engine and the app layer (the new
  host-extensions graft registry is one-directional: app → engine).

## 2. How Vela actually works (verified against live code + official docs)

- **Core**: `new Vela(container, options, deps?)` — options for market/display/
  drawings/settings; `deps` injects the renderer/feed/scripting engines.
- **Control surfaces**: `chart.renderer` (features, `getConfig`/`applyConfig`,
  `onConfigChanged`, `onCrosshairMove`, `setExternalCrosshair`, screenshot,
  `setSettingsSections`, `setSettingsVisibility`, `listSettingsIds`),
  `chart.data` (providers), `chart.drawings`, `chart.marks`, `chart.replay`,
  `chart.indicators()` handles with `setInput(s)/setProp(s)/setVisible/remove`.
- **Events**: `ready`, `market:changed`, `load:*`, `history:progress/complete`,
  `indicator:add/removed/error`, `bar`, `replay:*`, `viewport:changed`,
  `theme:changed`, `priceStyle:change`, `mark:click`, drawing lifecycle events.
- **Workspace**: `VelaWorkspace` with durable cells, layouts, per-kind `sync`
  (viewport/symbol/timeframe/crosshair/drawings/style), `getState()/applyState()`
  persistence (~500ms debounced), shared topbar/toolbar/object tree/bottom bar,
  grid-wide `ws.replay`.
- **Settings IDs**: dot-addressable (`symbol.type`, `scales.price-scale.countdown`,
  `scales.crosshair.color`, `canvas.grid.vertical`, …). Hiding is display-only.

## 3. Order flow — reality check

Documented **library** features: Long/Short Position drawing (entry/stop/target,
R:R, sizing), `tradeMarkers` renderer feature for strategy trade fills, volume and
VPVR native indicators. Order-flow extras (trade-accurate CVD/delta, footprints,
TPO, OI) are **hosted-product claims**, not open-core APIs; the provider contract
is `{time,o,h,l,c,volume?}` — no aggressor side, bid/ask or depth fields.

**What we already have**: `SessionBreaks`, `TradeMarks` (alert/order/position/TP/SL/
liq lines from MAWS's own trading state), order-block and PMO native indicators
registered via `registerNativeIndicator` in `lib/vela-native-indicators.ts`.

**Gap to close for real order flow** (documented extension paths):
1. A `SeriesDataEngine` (Plugin SDK) consuming a trades feed (aggregated
   aggressor-side volumes per price level) → CVD, delta bubbles, footprint columns
   as layered data keyed to the viewport (`onViewport`).
2. A provider-specific interface (`chart.data.providerInstance('binance')`) to
   expose Binance aggTrades/bookTicker streams alongside candles.

## 4. Indicator panel — what Vela gives natively

Legend rows with eye/remove, **Move to pane** control, per-indicator settings split
**Settings / Style**, styleable built-ins (Bollinger, MACD color rows), drag-bar
pane controls, `seriesOrder` styling precedence, `handle.setVisible()` suspends
computation. Custom natives via `registerNativeIndicator` (multiInstance, legend
visibility), custom legend buttons via `registerLegendAction`, status callouts via
`registerLegendCallout`. **MAWS already delegates all of this** (TopBar indicator
menu mounts through `chart.addNativeIndicator`; legend/dom is Vela's own) — no
rework needed, this was the correct call.

## 5. Settings panel audit — every row, live or dead

Path: `lib/vela-chart-settings.ts mawsHostSections()` + `mawsToVelaConfig()` +
`velaToMawsPatch()`, applied at mount by `wireChartSettings` and (new) live via
`startChartSettingsEcho`. Built-in Vela tabs: Symbol/Canvas/Scales/Events-group/
Status line (cell)/Advanced (cell)/Time zone/Trading session/Watermark.

### LIVE (verified: mapped into `mawsToVelaConfig` + echo applies immediately)
- **Symbol tab (built-in)**: type, body/borders/wick + colors, spacing, animations,
  timezone — all native.
- **Canvas tab**: background/text/fontSize, grid on/off + colors (both axes),
  crosshair color/style(+width native), pane separator color, theme preset,
  advanced custom colors (shell + chart).
- **Scales (built-in)**: log/percent/indexed mode, invert, axis border color,
  countdown toggle, price scale mode — all native or mapped.
- **Margins** (host-mapped): top/bottom/right.

### LIVE host rows (store-driven with real consumers)
- `showPlusButton` → [VelaWorkspaceOverlays](../components/charts/VelaWorkspaceOverlays.tsx) `CrosshairPlus`.
- `showBuySell` → TopBar BuySell strip.
- `showPositionLines`/`showTpSlLines`/`showLiqLines`/`showAlertLines` + their
  colors → **TradeMarks** layer colors and visibility.
- `sessionBreaks`(+color/width/style) → **SessionBreaks**.
- `economicEvents`/`onlyFutureEvents`, `latestNews` → Calendar/News panels.

### FIXED TODAY (was dead — now live)
- **Everything mapped by `mawsToVelaConfig`** now applies **live** on store change
  (`startChartSettingsEcho`): previously only chart *remount* re-read the store, so
  e.g. flipping "Countdown to bar close" or margin rows did nothing until a
  symbol/timeframe change. Verified in browser: grid toggle now flips instantly,
  with restore.

### DEAD — REMOVED today
- The whole MAWS "Status line" section (12 rows: `showTitle`, `titleMode`,
  `showLogo`, `showMarketStatus`, `showChartValues`, `showBarChange`,
  `showLastDayChange`, `showIndicatorLegend/Inputs/Values/Background`) — **zero
  consumers in the codebase**, and Vela's own built-in Status line rows already
  drive the real statusline via cell state. Removed; one tab, real controls only.

### REMOVED (2026-10-12 second pass — zero consumers, rows now gone)
- Charts chrome: `watermarkColor` (no watermark-color API), `paneButtons` (no pane-button chrome).
- Scales & labels: `currencyUnit`, `scalesPlacement`, `lockPriceRatio` (renderer has no currency-unit overlay, axis placement, or lock-ratio config seam).
- Trading: `reversePositionButton`, `projectMarketOrders`, `showPnlValue`, `pnlPositionsFormat`, `pnlBracketsFormat`, `executionMarks`, `executionLabels`, `extendedPriceLines`, `orderAlignment`, `includeTradesInSnapshots` (no fills ledger, P&L labels, or snapshot compositor reads these yet).
- **Chart chrome tab (third pass)**: the MAWS `watermark` row CONFLICTED with the built-in Symbol-tab watermark toggle — the store echo re-asserted the store value on every patch,  clobbering the working per-cell toggle. Row + echo removed; the cell state (seeded
  by `ChartCell`, toggled under Symbol) is the single owner. The whole "Chart chrome" tab is dissolved: `showPlusButton` + `navigationButtons` moved into the built-in Canvas tab (placement `canvas`). `navigationButtons` later deleted entirely (2026-10-15).

### REMOVED (2026-10-15 — redundant with the context menu)
- The per-cell **nav bar** (`components/charts/ChartNavigation.tsx`: zoom −/+, scroll ‹/›, reset) and its `navigationButtons` store key + host row: view reset already lives on the chart context menu ("Reset chart view", ALT+R) and the workspace cell cluster, and wheel/drag cover zoom/pan. `showPlusButton` stays — a `CrosshairPlus` toggle was still unreachable, so it now has a **Chart chrome** group in the Canvas tab.

### LIVE — previously mis-listed as dead (verified consumers)
- Trading: `oneClickTrading` (TopBar order gate), `executionSound`+`executionSoundName` (paper engine plays on fill), `showOnlyRejectionNotifications` (live notification filter).
- Events: `eventsBreaks` + `eventsBreakColor` (EventBreaks layer), `newsNotification` (NewsPanel), `defaultQty` (falls back into `resolveOrderQty`), `defaultLeverage` (symbol settings fallback).

### KEPT as real no-op SURFACES only (none left in the dialog)
All rows that appear in the global settings dialog now have a verified consumer

## 6. Timeline marks — LIVE (2026-10-14)

`chart.marks` (Vela's event lane above the time axis) is now WIRED to the data the
app already fetches — no new provider, no new key:

- [lib/vela-marks.ts](../lib/vela-marks.ts) — pure builders: calendar releases (grouped
  `economic` → `high`/`medium`/`low`, low hidden by default) and headlines (`news` →
  `latest` ≤24 h / `all` older, older hidden). Popup buttons open the News & Calendar
  dock / the article. Trade marks (fills/orders/positions/alerts) use the same builders
  and are NOT wired yet — MAWS alerts/orders carry no creation time, so they would all
  stack on the newest bar.
- [lib/vela-event-source.ts](../lib/vela-event-source.ts) — one shared calendar cache for
  the app + one news cache per symbol, in-flight deduped, 5-minute cadence (verified: a
  4-cell layout issues 1 calendar request and 1 news request per symbol).
- [lib/vela-marks-wiring.ts](../lib/vela-marks-wiring.ts) — per-cell: define groups, seed,
  re-push on source/symbol/settings change, and hide marks after the replay cursor.
  [lib/vela-cell-wiring.ts](../lib/vela-cell-wiring.ts) calls it in `wireCell`, so cells a
  layout switch mints get the lane too.
- Settings: Vela's **Events** tab holds a checkbox per group (nesting included, persisted
  with the chart config). MAWS's host section of event toggles was retitled
  **Event sources** so the two tabs don't share a name.
- Not covered: `onlyFutureEvents` (marks keep past releases on purpose), and the popups
  use Vela's own UI — `mark:click` is available if a group ever needs MAWS-owned UI.

## 7. Performance & size optimization proposal

### Speed
1. **WebGL budget already sensible**: `maxWebglCells: 8` (docs default). Keep;
   consider exposing 4 for 2× memory headroom on low-end machines.
2. **`historyComplete()` gating**: bars past ~10k backfill progressively. MAWS's
   indicator study mirroring should avoid recomputation on `history:progress`
   storms — debounce `on('history:progress')`-triggered store writes.
3. **Replay batching**: Vela batches ticks <16ms; MAWS's replay-store relay
   (`patchReplayState`) writes on every step — throttle store writes to ~10Hz
   (cursor position is visual only).
4. **Crosshair sync**: workspace `sync.crosshair` uses `setExternalCrosshair`
   ghosts — good. `syncVisibleRangeToOthers` still double-fires with the workspace
   viewport sync when `layoutSync.dateRange` is ON (guarded in
   `wireCrosshairAndViewport`) — fine, but merge into workspace sync
   (`ws.sync.set('viewport')`) to remove one MAWS approximator.
   **FIXED (2026-10-14):** the MAWS approximators are gone — `syncCrosshairToOthers`,
   `syncVisibleRangeToOthers` and their `withChartSync` guard were deleted from
   `lib/chart-registry.ts`, along with their call sites in `lib/vela-cell-wiring.ts`
   and `components/charts/CrosshairPlus.tsx`. The guard was inverted (it mirrored
   when `dateRange` was OFF and deferred when ON), so every pan/zoom moved the whole
   grid with the switches dark; a range copied onto a different timeframe snaps to
   its own bars, which is how the window collapsed to one or two candles. Crosshair
   and viewport links are now solely the workspace's (`ws.sync`, driven from
   `layoutSync` by the host bridge).
5. **Store→renderer echo liveliness** (new today): each `patchChartSettings`
   applies to every cell. Cheap (one applyConfig per cell, values dedup'd inside
   Vela), but theme changes additionally call `applyThemeToCharts` — that double
   apply is harmless and could skip the second when only shell keys changed
   (diff `chartSettings` before/after the theme mirror).

### Size
1. **Dead ChartSettings keys** (~25 keys, mostly trading HMI): removing them
   shrinks the persisted store payload and settings type surface. Breaking
   change for persisted state → needs a `migrate` version bump in the zustand
   persist config.
2. **`MAWS/.next` dev build artifacts are in the repo** — add to `.gitignore`
   (they pollute the working tree and search).
3. `__mocks__/lightweight-charts.js` deletion already happened; nothing imports
   LWC anymore — no further dead bridging found.
4. Consider lazy-loading the Pine engine (`PineEngine` import) so the pinned
   `@luxalgo/vela-pinets` parse cost only lands when a script indicator is added.

### Correctness debts noted (not fixed today)
- `velaToMawsPatch` does not read back `margins`, `timeScale.timezone` changes
  made inside Vela's dialog when the store echo races — one `onConfigChanged`
  → patch → echo cycle can bounce once. The `syncing` guard prevents an infinite
  loop but a second apply is possible. Worth a follow-up: diff-based apply
  (only changed groups) in `applyMappedChartKeys`.
- `theme` exclusion from templates matches Vela's own persistence (verified in
  settings dialog: theme rows live under Canvas).

Generated with Codebuff — audit artifacts live in this report.
