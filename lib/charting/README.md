# Charting engine

Vendored source of [LuxAlgo's open-source vela](https://github.com/luxalgo/vela)
charting library (v0.8.1, Apache-2.0 — see `LICENSE` and `NOTICE`, which must be
preserved). MAWS consumes this source directly instead of the published npm
package, so local fixes land here rather than in a separate repo.

Layout is upstream's `src/` flattened into this folder (`Vela.ts`, `core/`,
`data/`, `renderers/`, `ui/`, `widget/`, ...); upstream's `test/` is in
`test/` with its `../src/` imports rewritten to `../`.

Local changes on top of upstream v0.8.1:

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
- **Settings-dialog host sections: `'canvas'` placement.** `HostSettingsSection`
  accepts a fourth placement, `'canvas'`, which inlines the section's rows into
  the built-in Canvas tab (a section title, no tab marker — same semantics as
  `'symbol'`). MAWS uses it to fold its Theme group into the Canvas tab so
  canvas + theme settings share one tab (`renderers/native/chrome/SettingsDialog.ts`,
  `renderHostSections()` — appended before the next tab marker so the pane
  split files the rows under Canvas).

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
