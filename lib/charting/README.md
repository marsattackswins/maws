# Charting engine

Vendored source of [LuxAlgo's open-source vela](https://github.com/luxalgo/vela)
charting library (v0.8.1, Apache-2.0 — see `LICENSE` and `NOTICE`, which must be
preserved). MAWS consumes this source directly instead of the published npm
package, so local fixes land here rather than in a separate repo.

Layout is upstream's `src/` flattened into this folder (`Vela.ts`, `core/`,
`data/`, `renderers/`, `ui/`, `widget/`, ...); upstream's `test/` is in
`test/` with its `../src/` imports rewritten to `../`.

Local changes on top of upstream v0.8.1:

- **Position drawing placement and resizing.** The long/short tool now uses a
  press-drag-release placement gesture. Dragging its entry handle moves the full
  position; stop and target handles share one right edge, which stays aligned
  and at least 48 px wide while resizing. Implemented through the drawing
  handle-movement hook and covered by `test/drawings-measure.test.ts` and
  `test/drawings-interaction.test.ts`.
- **Binance perpetual futures stream at native push speed again.** The futures
  WebSocket subscribes on Binance's `/market` path (the legacy path often
  connected and then delivered no candles at all, silently dropping the chart
  back to three-second polling). A futures socket that still opens without
  data first retries on Binance's alternate futures host, and only then falls
  back to polling; a silent spot socket falls back directly. See
  `data/providers/binance/BinanceProvider.ts` and
  `test/binance-provider.test.ts`.
- **Drawing toolbar: crosshair cursor glyph.** The idle/select button in the
  drawing toolbar uses a `crosshair` icon instead of the arrow pointer
  (`core/icons.ts`, `renderers/native/drawings/DrawingToolbar.ts`). Updated
  to a TradingView-style plus-crosshair: two crossing lines (H+V) with a
  small filled dot at the intersection, replacing the previous
  circle-with-tick-marks design.
- **Drawing toolbar: dividers removed.** The two horizontal dividers Vela
  injects between the cursor button, tool groups, and mode buttons are removed
  (`renderers/native/drawings/DrawingToolbar.ts` `rebuild()`). In the MAWS
  horizontal top bar they rendered as unwanted vertical stripes.
- **Settings-dialog dropdowns: font, surface, and clamp.** The chart-settings
  dialog's selects rendered their open list with a different font family and
  surface than the dialog (the list pinned `font: 14px var(--vela-font)` while
  the dialog inherits the host page's font, and used the plot background
  instead of the overlay tone), and a viewport clamp let wide option lists
  (time zone…) cross the dialog edge. `ui/components/select/view.ts`
  (`openSelectList`) stamps the trigger's computed font family on the list,
  `ui/components/select/styles.ts` paints md lists with
  `--vela-surface-overlay` (matching the sm lists and the kit's submenu
  panel), and `renderers/native/chrome/SettingsDialog.ts` passes the
  indicator dialog's list-popover placement (`listPopover()`: dialog-panel
  boundary, 8px inset) to every select row. Covered by
  `test/ui-form-primitives.test.ts`.
- **Settings dialog: host-section refresh no longer blinks.** `setHostSections()`
  used `reopenIfLive()` (close + open), so a host adding/removing rows on an
  open dialog (e.g. MAWS's "Advanced" color toggle) flashed the whole panel.
  It now uses `rebuildIfLive()` → the existing in-place `refresh()` path (shell
  stays mounted, panes rebuild on the current tab) and preserves the pane's
  scroll offset across the rebuild. `renderers/native/chrome/SettingsDialog.ts`.
- **App icon resolver override (no source change).** `widget/statusline.ts`,
  `widget/symbol-picker.ts` and `widget/object-tree.ts` draw the provider-resolved
  ticker icon, and the bundled providers resolve it to Ledger's crypto-icon CDN —
  crypto only, so TradFi contracts (XAUUSDT.P, equity perps) 404 and fall back to an
  initials badge. MAWS reassigns `mawsVelaProvider.resolveSymbolIcon` in
  `lib/vela-feed-adapter.ts` to its own `/api/logo` proxy, which serves the Binance
  futures/TradFi catalog the watchlist already uses. Keep that override if the
  adapter is ever rewritten.
- **Active-cell ring in a multi-cell grid.** The selected chart's overlay ring was
  `2px solid var(--vela-fg-bright)` — a white frame heavy enough to compete with the
  chart. It is now `1px solid var(--vela-cell-active-border)`, a muted grey wash
  (26% white on dark themes, 30% ink on light) added to `core/tokens.ts`.
  `workspace/VelaWorkspace.ts` (stylesheet) + `core/tokens.ts`.
- **Layout-picker host budget (`maxCells` / `gridSize`).** `LayoutPickerOptions.maxCells`
  (default: the full 4×4 = 16) dims and disables every canvas square whose rectangle
  would exceed the host's pane budget, and `gridSize` shrinks the canvas itself
  (default 4, so a 4×4 grid). MAWS passes `maxCells: 4` and `gridSize: 2` from
  `lib/vela-layout-picker.ts` — a four-zone picker on the same interaction model,
  with no preset rows. `layoutGridCanvas` takes both arguments too. With the
  defaults the panel behaves exactly as upstream. `widget/layout-picker.ts`.
- **Layout-picker export for host chrome.** `index.ts` re-exports `LayoutPicker` (with
  its option/shape types) so a host that keeps its own topbar can mount the same panel
  the workspace topbar opens against its own trigger — MAWS wires it in
  `lib/vela-layout-picker.ts`. No behavior change inside the engine.
- **A committed config document marks the cell state dirty.** The settings
  dialog applies its patch to the RENDERER (`applyConfig`) and never touches the
  cell's own `state`, and the workspace's `onConfigChanged` wiring only mirrors
  style prefs onto sync-group peers — so a config-only edit (animation toggles,
  spacing, crosshair width, per-style cosmetics) never raised `onStateDirty`, the
  host was never told, and the persisted document kept the OLD value: the edit
  felt saved (it applied live) and reverted on the next load. `ChartCell`'s
  `onConfigChanged` handler now marks the cell dirty, which is what makes the
  host persist it. Covered by the "a config document marks the cell state dirty"
  case in `test/chart-cell-persistence.test.ts`.
- **Indicator-pane sizes survive reloads.** The native renderer includes live
  pane height weights in its chart config, restores weights for panes created
  after config application, and reports separator drags/resets as config
  changes. The workspace's last-edit unload flush also notifies host-managed
  persistence when its own storage adapter is disabled. Covered by
  `test/native-chart-config.test.ts` and `test/workspace-destroy-flush.test.ts`.
- **`renderer.setNativeData` passthrough on the control facade.** The public
  `chart.renderer` is the `RendererControl` facade, which had no `setNativeData`
  seam — so every host overlay that pushes into a registered renderer layer
  (`SessionBreaks`, `EventBreaks`, `TradeMarks`, via
  `handle.renderer.setNativeData(id, …)`) threw inside its `try/catch` and
  silently painted nothing. `RendererControl.setNativeData()` now forwards to the
  active renderer's optional method (no-op on renderers without native layers).
  `core/RendererControl.ts`.
- **Context menu: Settings pinned last.** The chart-body menu rendered
  `Settings…` from `bodyItems()` and then appended the host's contributed
  actions, so a preferences verb sat mid-list ahead of
  "Hide drawings" / "Hide indicators". The assembly in `widget/context-menu.ts`
  now emits the base items without the settings entry, then the contributed
  actions, then settings — the menu ends on Settings for every zone that
  contributes actions. The pure model (`context-menu-model.ts`) is unchanged.
- **Chart settings: explicit "Done" in the footer.** The dialog's footer had only
  "Reset defaults" on the left, leaving the header ✕ as the only dismiss in a
  long, live-edit panel. A trailing primary button (`.vela-sd-btn--primary`, the
  accent fill) now sits at the footer's right edge and closes the dialog.
  `renderers/native/chrome/SettingsDialog.ts` (`footer:` builder + stylesheet,
  which also bumped `SD_STYLE_REV` to 7 so cached style tags refresh).
- **Settings-dialog host sections: `'canvas'` placement.** `HostSettingsSection`
  accepts a fourth placement, `'canvas'`, which inlines the section's rows into
  the built-in Canvas tab (a section title, no tab marker — same semantics as
  `'symbol'`). MAWS uses it to fold its Theme group into the Canvas tab so
  canvas + theme settings share one tab (`renderers/native/chrome/SettingsDialog.ts`,
  `renderHostSections()` — appended before the next tab marker so the pane
  split files the rows under Canvas).
- **Cell view cluster: no zoom / reset buttons.** The hover pill pinned to the
  bottom-center of a cell's plot carried zoom out / zoom in / reset view next to
  its drag handle and maximize chip. Wheel, pinch and `mod+Arrow` already zoom and
  "Reset chart" is in the context menu, so the two zoom buttons and the reset
  button are gone (`widget/cell-controls.ts` `refresh()`); the cluster keeps only
  the drag handle and maximize chip. A grid with no button to show (a single,
  un-maximized cell) never reveals the pill at all, so a lone chart no longer grows
  one on hover. Covered by `test/cell-controls.test.ts`.
- **Stochastic: the reference dialog's Inputs / Style split, and a working higher
  timeframe.** The catalog's Stochastic declared every control on one Inputs tab
  under `Settings` / `Style` group headers and read none of those style rows back.
  It now declares two dialog tabs: the calculation block (defaults 14 / 1 / 3, the
  reference's fast stochastic) on Inputs, and one compact `inline=` row per drawn
  element on Style (`%K`, `%D`, `Upper` / `Middle` / `Lower Band` at editable
  levels, `Background`)
  followed by the "Labels on price scale" / "Values in status line" toggles.
  `Timeframe` and `Wait for timeframe closes` calculate on a resampled series via
  the new `classics/htf.ts` (bucket helpers + projection back onto the chart's
  bars). `core/native-indicators/classics/oscillators.ts`.
- **Indicator dialogs: size locked across tabs; per-plot price-scale labels work.**
  The indicator-inputs dialog sized itself to its content, so switching tabs (or a
  `when` gate firing) re-sized and re-centered it under the pointer. On open it now
  locks to the largest tab's natural size (measured over two frames — Zag flips
  open state asynchronously) and shorter tabs scroll instead
  (`renderers/shared/IndicatorInputsDialog.ts`). The native renderer never read a
  plot's `display.priceScale` when drawing the scale gutters, so the "Labels on
  price scale" toggle did nothing: the chrome layer now draws one colored value
  chip per line-like plot at its latest value — in the indicator's own scale
  column for merged indicators, in the pane master scale otherwise, fill anchors
  and non-pane plots exempt — and the last-price chip still draws after them.
  `renderers/native/chrome/ChromeRenderer.ts` (`drawIndicatorValueChips`).

- **"Labels on price scale": one catalog-wide toggle, OFF by default.** The chrome
  layer draws a value chip on the price scale for every plot that shows there, and
  a series that declares no `display` shows everywhere — so every indicator stamped
  its latest value onto the axis whether or not that value reads there (a bounded
  oscillator's `0.0` beside the price scale is noise). The catalog now declares one
  shared switch, `core/native-indicators/scale-labels.ts` (`SCALE_LABELS_KEY` =
  `labelsOnPriceScale`, OFF), which:
  - the classics adapter appends last to every spec's schema (`classics/define.ts`
    `classicInputs()` — on a tabbed spec it lands on that spec's trailing tab, beside
    the "Show settings in legend" switch it follows), and
  - stamps onto the plots it emits (`withScaleLabels()` in `ClassicIndicator.recompute()`),
    keeping a plot's own explicit `priceScale` and leaving pane-hidden fill anchors
    alone.

  A study that draws only markers or segments declares `scaleLabels: false` and
  gets no switch (ZigZag, Williams Fractal) — it has no latest value to label.
  Host-registered
  natives opt in by appending `scaleLabelsInput()` to their schema and stamping
  `withScaleLabels()`/`scaleLabelsOn()` onto their series — MAWS does this for PMO
  (`lib/vela-native-indicators.ts`). Layer-backed natives with no value series
  (volume, VRVP, Order Blocks) have nothing to label and declare no switch. Values
  and their chips persist with the indicator's inputs, so a per-chart toggle
  restores with the workspace. Covered by `test/scale-labels.test.ts`.
- **Legend names, live values, and price-scale labels are separate.** Every
  calculation input opts into the settings-based name with `InputSchema.legend: true` —
  set by the shared
  `lengthInput`/`intInput`/`floatInput`/`optionInput`/`sourceInput` factories
  (`classics/shared.ts`) and left off look-only inputs (widths, opacity, offsets) and
  explicitly switched off on oscillator thresholds. `legendSettingsText()`
  (`core/native-indicators/legend-settings.ts`) joins those values in declaration
  order, and every descriptor's `titleFor` turns it into the instance's name:
  `Stoch 14 1 3`, `RSI 14 Close`, `MACD 12 26 9 Close`, `PMO 35 20 10 Close`.
  - The `legendSettings` switch ("Show settings in legend", ON) rides in each
    indicator's settings dialog — the classics get it from `classicInputs()`; PMO,
    order blocks, VRVP and volume declare it themselves (volume's name carries its
    bar-height look, `Volume 20`). Off ⇒ plain `Stoch`; live-value visibility is
    controlled separately.
  - The `legendValues` switch ("Show values in legend", ON) hides or shows that
    indicator's live value independently of its name. It follows the chart-wide
    Values switch; the data window still reports every plot.
  - `titleFor` wins over `shortTitle` and is re-derived on every structural remount
    (every input edit), so the chip follows the dialog live. The settings header and
    the legend share the name. Covered by `test/status-title.test.ts` and the
    inputs-aware-title case in `test/orchestrator.test.ts`.

- **A session's first run never executes over ZERO loaded bars.** `EngineOrchestrator`
  poked every session with `'complete'` as soon as the history load *finished*, even
  when it finished with **no bars** (a provider answering empty, or a persisted script
  restored before the first snapshot). Real runtimes read `bars[0]` unguarded, so PineTS
  threw `Cannot read properties of undefined (reading 'openTime')` inside `onError`, the
  session died, and the legend row stayed on "loading" for the rest of the page's life —
  once per restore, for every persisted script. Now:
  - `executeIndicator` hands a session `historyState: 'backfill'` while `bars.length === 0`,
    so the engine's own run policy holds it (Pine's `deferred`), and
  - `notifySessionsBars` **withholds** a `'complete'` announced over zero bars and
    re-delivers it as `'complete'` on the first real bar — the release is byte-identical
    to the original, just later. Any other poke over an empty array is dropped (there is
    nothing to compute), and a new load (`resetHistoryState`) takes the release back.

  Covered by `test/orchestrator.test.ts` (`a Pine-shaped engine never runs over ZERO
  loaded bars`), which fails with the exact console error above when the guard is removed.
- **Main chart pane maximize button removed.** The renderer's main price-pane maximize
  control occupied the same top-right position as MAWS's workspace chart-maximize
  control in multi-chart view. `renderers/native/chrome/PaneControls.ts` now leaves
  that action to the workspace, while study-pane maximize controls remain available.
  Covered by `test/pane-controls.test.ts`.

Conventions:

- Run the engine's own suite with `npm run test:charting` (vitest). The app's
  jest suite ignores this folder and stubs the engine wholesale via
  `__mocks__/vela.js` and `__mocks__/vela-providers-binance.js`.
- This folder is excluded from the app's eslint config; keep changes in
  upstream's style so future upstream syncs stay diffable.
- The engine is Apache-2.0 with a NOTICE-based attribution requirement: the
  in-chart attribution mark must stay enabled (or carry an equivalent notice).
- The npm package `@luxalgo/vela` stays in dependencies only to satisfy the
  peer dependency of `@luxalgo/vela-pinets` (which imports
  `@luxalgo/vela/plugin` for `stableSeriesId` and the default plot colors).
  All app code imports the vendored source above (`@/lib/charting`), never the
  registry copy.
