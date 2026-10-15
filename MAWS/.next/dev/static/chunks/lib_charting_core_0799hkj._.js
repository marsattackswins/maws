(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/charting/core/DataControl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataControl",
    ()=>DataControl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$MultiProviderFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/MultiProviderFeed.ts [app-client] (ecmascript)");
;
class DataControl {
    registry;
    constructor(feed){
        this.registry = feed instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$MultiProviderFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MultiProviderFeed"] ? feed : null;
    }
    /**
     * Register (or replace) a data provider under `name`. Any symbol prefixed `name:`
     * (case-insensitive), or a bare symbol the provider's index contains, routes to it.
     * Returns synchronously and is chainable: it kicks a background symbol-index build,
     * and if the chart symbol resolves through this provider the parked initial load
     * fires. Await `chart.ready()` for that load, or `chart.data.ready()` for the index.
     */ registerProvider(name, provider) {
        if (!this.registry) {
            console.warn(`[vela] chart.data.registerProvider("${name}") ignored — the active data feed ` + `is a custom feed (deps.dataFeed), not the default provider registry.`);
            return this;
        }
        void this.registry.registerProvider(name, provider);
        return this;
    }
    /** Remove a registered provider. */ unregisterProvider(name) {
        this.registry?.unregisterProvider(name);
        return this;
    }
    /** Metadata for every registered provider. */ providers() {
        return this.registry?.providers() ?? [];
    }
    /** Resolve a symbol string to `{ provider, ticker }`, or null if nothing serves it. */ resolve(symbol) {
        return this.registry?.resolveSymbol(symbol) ?? null;
    }
    /**
     * The DISPLAY prefix for `symbol` — the listing venue its descriptor declares
     * (`NASDAQ` for AAPL) or the resolved provider name. Null while unresolvable.
     */ displayPrefix(symbol) {
        return this.registry?.displayPrefix(symbol) ?? null;
    }
    /** The canonical `PREFIX:TICKER` form of `symbol`, or null while unresolvable. */ canonicalSymbol(symbol) {
        return this.registry?.canonicalSymbol(symbol) ?? null;
    }
    /**
     * The registered provider INSTANCE under `name` — the seam for EXTENDED provider
     * surfaces: a provider may implement interfaces beyond the `DataProvider` port
     * (extra data kinds, venue-specific APIs); consumers retrieve the instance and
     * narrow it with their own type guard. Returns undefined if the name is unknown
     * (or a custom `deps.dataFeed` bypasses the registry).
     */ providerInstance(name) {
        return this.registry?.providerInstance(name);
    }
    /** Indexed symbols for one provider (or all) — for autocomplete. */ symbols(provider) {
        return this.registry?.symbols(provider) ?? [];
    }
    /** The icon URL for `symbol` — its owning provider's `resolveSymbolIcon`, routed
     *  through resolution. Undefined while unresolvable, when the provider declares no
     *  resolver, or on a custom `deps.dataFeed` — the shells then show initials. */ symbolIcon(symbol) {
        return this.registry?.symbolIcon(symbol);
    }
    /** Per-symbol metadata (Pine `syminfo.*`), resolved through the owning provider. */ symbolInfo(symbol) {
        return this.registry?.symbolInfoFor(symbol) ?? Promise.resolve(undefined);
    }
    /**
     * The full resolved capabilities for `symbol` — per-instrument when the provider refines
     * them (`capabilitiesFor`), else its provider-wide declaration. Null while nothing
     * resolves the symbol (a provider may still be registering), so callers that can act
     * later should re-read rather than latch the first answer.
     */ capabilities(symbol) {
        return this.registry?.capabilitiesFor(symbol) ?? null;
    }
    /** Resolves when every registered provider's eager index has settled. */ ready() {
        return this.registry?.ready() ?? Promise.resolve();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/DrawingsControl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingsControl",
    ()=>DrawingsControl
]);
class DrawingsControl {
    ctrl;
    constructor(ctrl){
        this.ctrl = ctrl;
    }
    /** Whether the active renderer supports interactive drawings. */ get supported() {
        return this.ctrl.supported;
    }
    /** Arm a tool — the next click(s) place it. `null` returns to select/idle. */ setTool(type) {
        if (this.ok('setTool')) this.ctrl.setTool(type);
        return this;
    }
    /** The currently armed tool (`null` = select/idle). Mirrors in-chart toolbar clicks
     *  and one-shot tools disarming — listen on `drawing:tool` to follow changes. */ getTool() {
        return this.ctrl.getTool();
    }
    /** Set the sticky magnet snap mode (`'off' | 'weak' | 'strong'`). */ setSnapMode(mode) {
        if (this.ok('setSnapMode')) this.ctrl.setSnapMode(mode);
        return this;
    }
    /** The current magnet snap mode — follow changes on `drawing:snap`. */ getSnapMode() {
        return this.ctrl.getSnapMode();
    }
    /** Keep the armed tool after each placement (`true`) or one-shot disarm (`false`). */ setStayMode(on) {
        if (this.ok('setStayMode')) this.ctrl.setStayMode(on);
        return this;
    }
    /** Whether tools stay armed after placement — follow changes on `drawing:stay`. */ getStayMode() {
        return this.ctrl.getStayMode();
    }
    /** Enter/exit a renderer-local mode: `'measure'` (transient ruler), `'eraser'`, or
     *  `null` (none). Mutually exclusive with each other and with any armed tool — the
     *  renderer enforces the exclusion and the outcome lands on `drawing:mode`. */ setMode(mode) {
        if (this.ok('setMode')) this.ctrl.setMode(mode);
        return this;
    }
    /** The current renderer-local mode — follow changes on `drawing:mode`. */ getMode() {
        return this.ctrl.getMode();
    }
    /** Show or hide the on-chart drawing toolbar. */ showToolbar(visible = true) {
        if (this.ok('showToolbar')) this.ctrl.showToolbar(visible);
        return this;
    }
    /** Reconfigure the toolbar groups/tools live. */ setToolbar(option) {
        if (this.ok('setToolbar')) this.ctrl.setToolbar(option);
        return this;
    }
    /** Show per-tool shortcut hints in the toolbar flyouts. Values are PRE-FORMATTED
     *  display strings (e.g. `'Alt+T'`, `'⌥T'`) — the host owns the keymap and the
     *  platform formatting, so hints always match the host's actual bindings. */ setToolShortcuts(map) {
        if (this.ok('setToolShortcuts')) this.ctrl.setToolShortcuts(map);
        return this;
    }
    /** Display another chart's in-progress placement as a GHOST at reduced opacity
     *  (`null` clears it) — how a multi-chart host mirrors `drawing:draft` onto linked
     *  charts. Never a real drawing: no store entry, no selection, no persistence.
     *  Silently inert on a renderer without the optional seam. */ setExternalGhost(doc) {
        this.ctrl.setExternalGhost(doc);
        return this;
    }
    /** Create a drawing programmatically (no clicking). Returns it, or null if unsupported. */ add(type, init = {}) {
        if (!this.ok('add')) return null;
        return this.ctrl.add(type, init);
    }
    remove(id) {
        this.ctrl.remove(id);
        return this;
    }
    /** Apply a partial record to a drawing — for a custom (headless) settings UI. */ update(id, patch) {
        this.ctrl.update(id, patch);
        return this;
    }
    /** Apply several partial records as one undo step (group hide/lock/reorder from a host UI). */ updateMany(patches) {
        this.ctrl.updateMany(patches);
        return this;
    }
    /** Remove several drawings as one undo step. */ removeMany(ids) {
        this.ctrl.removeMany(ids);
        return this;
    }
    lock(id, v = true) {
        this.ctrl.setLocked(id, v);
        return this;
    }
    show(id, v = true) {
        this.ctrl.setVisible(id, v);
        return this;
    }
    /** Select drawings on the chart (highlight + open their toolbar) — for a host-side tree/list.
     *  Pass `null` or `[]` to clear the selection. */ select(ids) {
        if (this.ok('select')) this.ctrl.select(ids == null ? [] : typeof ids === 'string' ? [
            ids
        ] : ids);
        return this;
    }
    /** Open a drawing's settings popup on the chart (selecting it) — the twin of clicking it. */ openSettings(id) {
        if (this.ok('openSettings')) this.ctrl.openSettings(id);
        return this;
    }
    bringToFront(id) {
        this.ctrl.bringToFront(id);
        return this;
    }
    sendToBack(id) {
        this.ctrl.sendToBack(id);
        return this;
    }
    // ── undo / redo (core-owned — work regardless of renderer support) ──
    /** Revert the last edit. No-op when there is nothing to undo. */ undo() {
        this.ctrl.undo();
        return this;
    }
    /** Re-apply the last undone edit. No-op when there is nothing to redo. */ redo() {
        this.ctrl.redo();
        return this;
    }
    canUndo() {
        return this.ctrl.canUndo();
    }
    canRedo() {
        return this.ctrl.canRedo();
    }
    // ── clone / clipboard ──
    /** Duplicate a drawing in place; the clone is selected. Returns this (chainable). */ clone(id) {
        if (this.ok('clone')) this.ctrl.clone(id);
        return this;
    }
    /** Duplicate several drawings in place; the clones become the selection. */ duplicate(ids) {
        if (this.ok('duplicate')) this.ctrl.duplicate(ids);
        return this;
    }
    /** Copy drawings into the in-memory clipboard for a later {@link paste}. */ copyToClipboard(ids) {
        if (this.ok('copy')) this.ctrl.copy(ids);
        return this;
    }
    /** Paste the clipboard as new drawings (fresh ids), selecting them. */ paste() {
        if (this.ok('paste')) this.ctrl.paste();
        return this;
    }
    /** Every drawing as plain JSON, in paint order. */ all() {
        return this.ctrl.all();
    }
    /** Snapshot all drawings as a versioned document (persistence). */ toJSON() {
        return this.ctrl.toJSON();
    }
    /** Restore drawings from a document produced by {@link toJSON} (untrusted-safe). */ fromJSON(doc) {
        this.ctrl.fromJSON(doc);
        return this;
    }
    /** The favorite tool types (starred in the toolbar flyouts), insertion-ordered. */ favorites() {
        return this.ctrl.favorites();
    }
    isFavorite(type) {
        return this.ctrl.isFavorite(type);
    }
    /** Star/unstar one tool type. */ setFavorite(type, on) {
        if (this.ok('setFavorite')) this.ctrl.setFavorite(type, on);
        return this;
    }
    /** Replace the whole favorite set (e.g. restoring persisted prefs). */ setFavorites(types) {
        if (this.ok('setFavorites')) this.ctrl.setFavorites([
            ...types
        ]);
        return this;
    }
    /** Aliases mirroring `renderer.getConfig()/applyConfig()` for symmetry. */ getConfig() {
        return this.ctrl.toJSON();
    }
    applyConfig(doc) {
        this.ctrl.fromJSON(doc);
        return this;
    }
    ok(op) {
        if (this.ctrl.supported) return true;
        console.warn(`[vela] chart.drawings.${op}() ignored — the active renderer has no userDrawings capability.`);
        return false;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/MarksControl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarksControl",
    ()=>MarksControl
]);
class MarksControl {
    ctrl;
    constructor(ctrl){
        this.ctrl = ctrl;
    }
    /** Whether the active renderer paints timeline marks. */ get supported() {
        return this.ctrl.supported;
    }
    /** Add one mark; an existing id is replaced in place. */ add(mark) {
        this.ctrl.add(mark);
        return this;
    }
    /** Replace the whole set (a market switch). */ set(marks) {
        this.ctrl.set(marks);
        return this;
    }
    remove(id) {
        this.ctrl.remove(id);
        return this;
    }
    clear() {
        this.ctrl.clear();
        return this;
    }
    /** Every mark, in insertion order. */ all() {
        return this.ctrl.all();
    }
    /**
     * Define a visibility group's presentation: the label of its checkbox in chart
     * settings (the Events tab) and its default visibility. Marks may name a group
     * that was never defined — it then shows its capitalized id.
     */ defineGroup(group) {
        this.ctrl.defineGroup(group);
        return this;
    }
    /** The defined groups, in definition order. */ groups() {
        return this.ctrl.groupDefinitions();
    }
    /** Show or hide one group's marks — the same switch as the settings checkbox, persisted with the chart's config. */ setGroupVisible(id, visible = true) {
        this.ctrl.setGroupVisible(id, visible);
        return this;
    }
    /** A group's effective visibility (the user's choice, else the group's declared default). */ isGroupVisible(id) {
        return this.ctrl.isGroupVisible(id);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/PanesControl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PanesControl",
    ()=>PanesControl
]);
class PanesControl {
    controller;
    constructor(controller){
        this.controller = controller;
    }
    /** Whether the active renderer supports pane management (use to show/hide host UI). */ get supported() {
        return this.controller.paneManagementSupported();
    }
    /** The current panes (top-to-bottom by `order`) with the indicators each holds. */ list() {
        return this.controller.listPanes();
    }
    /** Move a pane one slot up or down in the stack (the price pane stays pinned on top). */ move(paneId, dir) {
        if (this.guard()) this.controller.movePane(paneId, dir);
        return this;
    }
    /** Remove a pane and every indicator in it (the price pane can't be removed). */ remove(paneId) {
        if (this.guard()) this.controller.removePaneAndIndicators(paneId);
        return this;
    }
    /** Collapse a pane to a thin strip, or restore it. */ collapse(paneId, collapsed = true) {
        if (this.guard()) this.controller.collapsePane(paneId, collapsed);
        return this;
    }
    /** Maximize one pane to fill the plot, or restore the split (`null`). */ maximize(paneId) {
        if (this.guard()) this.controller.maximizePane(paneId);
        return this;
    }
    /** Move/merge an indicator to a pane — sugar for `handle.moveTo(...)` by id. */ moveIndicator(id, target) {
        if (this.guard()) this.controller.moveIndicator(id, target);
        return this;
    }
    guard() {
        if (this.controller.paneManagementSupported()) return true;
        console.warn('[vela] the active renderer does not support pane management — chart.panes mutation ignored.');
        return false;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/RendererControl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RendererControl",
    ()=>RendererControl
]);
class RendererControl {
    renderer;
    constructor(renderer){
        this.renderer = renderer;
    }
    /** The active renderer's identity, e.g. `'native'` or `'lwc'`. */ get name() {
        return this.renderer.name;
    }
    /** What the active renderer can draw (drives graceful degradation). */ get capabilities() {
        return this.renderer.capabilities;
    }
    /** Whether the active renderer supports a feature — use to show/hide a UI control. */ supports(feature) {
        return this.renderer.features.includes(feature);
    }
    /** Read a feature's current value (`undefined` if unsupported). */ get(feature) {
        return this.renderer.readFeature(feature);
    }
    /**
     * Set one feature (`set('glow', 0.6)`) or several at once
     * (`set({ logScale: true, upColor: '#fff' })`). A key the active renderer does
     * not support emits a console warning and is ignored, with no effect on the UI.
     */ set(feature, value) {
        const entries = typeof feature === 'string' ? [
            [
                feature,
                value
            ]
        ] : Object.entries(feature);
        for (const [key, val] of entries){
            if (this.renderer.features.includes(key)) this.renderer.applyFeature(key, val);
            else console.warn(`[vela] renderer "${this.renderer.name}" has no feature "${key}" — set ignored.`);
        }
        return this;
    }
    /**
     * Wire the legend rows' HOST-CONTRIBUTED actions (the shells route the plugin
     * registry through this; see `registerLegendAction`). Silent on a renderer without
     * the seam — contributed legend actions simply never show there, same graceful
     * degradation as the sync ghost crosshair.
     */ setLegendActions(provider) {
        this.renderer.setLegendActions?.(provider);
    }
    /**
     * Wire the legend rows' HOST-CONTRIBUTED callout bubbles (the shells route the
     * plugin registry through this; see `registerLegendCallout`). Silent on a renderer
     * without the seam — contributed callouts simply never show there, same graceful
     * degradation as {@link setLegendActions}.
     */ setLegendCallouts(provider) {
        this.renderer.setLegendCallouts?.(provider);
    }
    /**
     * Replace the indicator legend's fold toggle with a host action (or restore it with
     * `null`) — multi-chart shells point the chip at their indicator overview instead of
     * unfolding rows in place. Silent no-op on a renderer without a foldable legend.
     */ setLegendOverviewAction(action) {
        this.renderer.setLegendOverviewAction?.(action);
        return this;
    }
    /** Whether the active renderer can open a per-indicator settings dialog. */ get supportsIndicatorSettings() {
        return typeof this.renderer.openIndicatorSettings === 'function';
    }
    /**
     * Open one indicator's settings dialog — the programmatic twin of the legend gear
     * (see {@link supportsIndicatorSettings}). Silent no-op without the seam or for an
     * unknown id.
     */ openIndicatorSettings(indicatorId) {
        this.renderer.openIndicatorSettings?.(indicatorId);
        return this;
    }
    /**
     * Export the current chart as a PNG data URL, or null if the active renderer
     * doesn't support it (warns). DOM overlays (tables, legend) are not included.
     */ screenshot() {
        if (typeof this.renderer.screenshot === 'function') return this.renderer.screenshot();
        console.warn(`[vela] renderer "${this.renderer.name}" does not support screenshot().`);
        return null;
    }
    /**
     * Raster of the current chart onto a canvas (same pixels as {@link screenshot}),
     * or null if the renderer has no canvas export. Silent — a host compositing
     * several charts skips a renderer that cannot contribute.
     */ screenshotCanvas() {
        if (typeof this.renderer.screenshotCanvas === 'function') return this.renderer.screenshotCanvas();
        return null;
    }
    /**
     * The active renderer's full cosmetic config as a serializable, versioned JSON
     * document — persist it (templates, saved settings) and feed it back to
     * `applyConfig`. Returns null if the renderer has no rich config (warns).
     */ getConfig() {
        if (typeof this.renderer.getConfig === 'function') return this.renderer.getConfig();
        console.warn(`[vela] renderer "${this.renderer.name}" does not support getConfig().`);
        return null;
    }
    /**
     * Apply a (possibly partial) config document from `getConfig()` — load a template
     * or restore saved settings. Malformed/unknown fields are ignored; no indicator
     * re-run. No-ops with a warning if the renderer has no rich config.
     */ applyConfig(config) {
        if (typeof this.renderer.applyConfig === 'function') this.renderer.applyConfig(config);
        else console.warn(`[vela] renderer "${this.renderer.name}" does not support applyConfig().`);
        return this;
    }
    /**
     * Subscribe to cosmetic-config changes (`applyConfig` — the in-chart settings dialog
     * commits through it). Host chrome that mirrors a config value (a bottom-bar timezone)
     * re-pulls {@link get}/{@link getConfig} here. Silent no-op unsubscribe on a renderer
     * without a rich config.
     */ onConfigChanged(cb) {
        return this.renderer.onConfigChanged?.(cb) ?? (()=>undefined);
    }
    /**
     * Subscribe to crosshair movement — `time`/`price` under the cursor, per-series values,
     * and the hovered bar's OHLC (null fields when the cursor leaves the chart). This is the
     * public seam host chrome (status lines, data windows) builds on.
     */ onCrosshairMove(cb) {
        return this.renderer.onCrosshairMove(cb);
    }
    /** A click — or a touch tap — on the plot, never the end of a pan: the open time of
     *  the bar under it (`null` off the bars). On touch, where a tap moves no crosshair,
     *  this is how an interaction learns which bar was chosen. */ onClick(cb) {
        return this.renderer.onClick(cb);
    }
    /** Touch long-press on a price or time axis strip — silent no-op without the seam. */ onAxisLongPress(cb) {
        return this.renderer.onAxisLongPress?.(cb) ?? (()=>undefined);
    }
    /**
     * The current data-window readout — the hovered bar's date/time and OHLCV plus every
     * indicator's value there, each already formatted on its pane's scale (the latest bar when
     * the cursor is off the plot). Pair it with {@link onCrosshairMove} to drive a data-window
     * panel. Null on a renderer that doesn't provide the readout.
     */ dataWindowReadout() {
        return this.renderer.getDataWindowReadout?.() ?? null;
    }
    /**
     * Wire (or clear with `null`) the host's symbol picker for the settings dialog's `input.symbol`
     * control — the host opens its own ticker-selection UI and reports the chosen symbol back.
     * No-ops with a warning if the active renderer doesn't support it (only the native renderer does).
     */ setSymbolPicker(picker) {
        if (typeof this.renderer.setSymbolPicker === 'function') this.renderer.setSymbolPicker(picker);
        else console.warn(`[vela] renderer "${this.renderer.name}" does not support setSymbolPicker().`);
        return this;
    }
    /**
     * Move keyboard focus back onto the chart's interactive surface — call after a host
     * control (a shared toolbar button) stole focus, so chart/drawing shortcuts keep
     * working. Silent no-op on a renderer without a focusable surface.
     */ focus() {
        this.renderer.focus?.();
        return this;
    }
    /** Whether the active renderer can display an EXTERNAL (synced) crosshair. */ get supportsExternalCrosshair() {
        return typeof this.renderer.setExternalCrosshair === 'function';
    }
    /**
     * Show (or clear, with `null`) a data-space ghost crosshair driven from OUTSIDE
     * this chart — the multi-chart crosshair-sync seam. Silent no-op on a renderer
     * without the capability (see {@link supportsExternalCrosshair}).
     */ setExternalCrosshair(time, price = null) {
        this.renderer.setExternalCrosshair?.(time, price);
        return this;
    }
    /**
     * Close any in-chart dialogs the active renderer owns (indicator settings, chart-settings
     * gear) — for keeping host dialogs mutually exclusive with the renderer's. Silent no-op if
     * the renderer has no such dialogs; safe to call speculatively.
     */ closeDialogs() {
        this.renderer.closeDialogs?.();
        return this;
    }
    /**
     * Open (or toggle) the renderer's in-chart settings dialog — silent no-op without one.
     * Pass a section title (e.g. `'Canvas'`) to land on that tab; an unknown one opens the
     * dialog on its first tab, and with a section an open dialog switches tab instead of closing.
     */ openSettings(section) {
        this.renderer.openSettingsDialog?.(section);
        return this;
    }
    /** Contribute host settings tabs (callback rows) to the renderer's settings dialog —
     *  e.g. the widget's Status line toggles. Silent no-op without a dialog. */ setSettingsSections(sections) {
        this.renderer.setSettingsSections?.(sections);
        return this;
    }
    /**
     * Set the settings-dialog visibility policy: `hidden` lists setting ids to hide —
     * a tab (`'canvas'`), a group (`'canvas.grid'`), or a single row
     * (`'canvas.grid.vertical'`); an id hides its whole subtree, and a tab with nothing
     * left disappears from the rail. Presentation-only: hidden values keep being stored
     * and applied (e.g. hide `'advanced'` while forcing the widget's `bars` option).
     * Seeded from `VelaOptions.settings`; silent no-op without a settings dialog.
     */ setSettingsVisibility(policy) {
        this.renderer.setSettingsVisibility?.(policy);
        return this;
    }
    /** Every addressable setting id of this chart (built-in tabs/groups/rows, chart-type
     *  sections, host sections) — enumerate these to build a `hidden` list instead of
     *  reading contributor source. Empty on a renderer without a settings dialog. */ listSettingsIds() {
        return this.renderer.listSettingsIds?.() ?? [];
    }
    /** Tell the renderer's own chrome which size class the host shell is in —
     *  `'mobile'` switches its dialogs/toolbars to the touch-first presentation.
     *  Silent no-op on a renderer without adaptive chrome. */ setLayoutMode(mode) {
        this.renderer.setLayoutMode?.(mode);
        return this;
    }
    /**
     * Drive the renderer's time-of-day chrome (the countdown-to-bar-close chip) from the
     * host's own second pulse, so it ticks in step with a host clock display instead of
     * on a separate timer that can read a different second. `null` hands the pulse back
     * to the renderer. Silent no-op on a renderer without time-of-day chrome.
     */ setWallClock(clock) {
        this.renderer.setWallClock?.(clock);
        return this;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/ReplayControl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReplayControl",
    ()=>ReplayControl
]);
class ReplayControl {
    ctrl;
    constructor(ctrl){
        this.ctrl = ctrl;
    }
    /**
     * Enter replay (or seek, when already replaying) at `opts.from`. Resolves once the
     * chart shows the rewound history — after any in-flight history load has finished.
     * Starts paused; call {@link play} or {@link step}.
     */ start(opts) {
        return this.ctrl.replayStart(opts);
    }
    /** Reveal the next bar — or, mid-way through a bar played tick by tick, complete it.
     *  Returns false when replay is off or nothing is left. */ step() {
        return this.ctrl.replayStep();
    }
    /** Reveal the next UPDATE: with {@link setTicks}, the next tick of the forming bar — or
     *  the next bar opened at its first tick (once its ticks are in, if still loading);
     *  otherwise the next whole bar, like {@link step}. Returns false when nothing is left. */ stepUpdate() {
        return this.ctrl.replayStepUpdate();
    }
    /** Reveal one bar (one tick, with {@link setTicks}) every `intervalMs` (default: the last
     *  interval used, else 1000). Calling it again while playing changes the pace. */ play(intervalMs) {
        this.ctrl.replayPlay(intervalMs);
        return this;
    }
    pause() {
        this.ctrl.replayPause();
        return this;
    }
    /** Leave replay: the full history comes back and live updates resume. Also cancels a
     *  `start()` still loading older history (the chart returns to its previous depth). */ stop() {
        this.ctrl.replayStop();
        return this;
    }
    get state() {
        return this.ctrl.replayState();
    }
    /** The loaded history a replay can walk — hidden bars included while replaying. Null
     *  before any bar loaded. A start older than `first` deepens the history first. */ get bounds() {
        return this.ctrl.replayBounds();
    }
    /**
     * Play each revealed bar as a series of intrabar updates instead of whole: while
     * playing, the forming candle opens at the first tick, then every tick moves its close
     * and stretches its high and low, exactly like a live tick — indicators, chart types
     * and the `bar` event follow — and the last one settles it on the stored bar. The play
     * interval is then the time between two TICKS: a bar lasts as many intervals as it
     * has ticks (below ~16 ms, ticks are batched per frame). The next bar's ticks are
     * requested while the current one plays; playback waits for them. `null` goes back to
     * whole bars. Takes effect from the next bar; a bar forming when the source changes
     * completes at once.
     */ setTicks(source) {
        this.ctrl.replaySetTicks(source);
        return this;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/color.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Color math shared by every layer (core defaults, renderer chrome, UI kit tokens, widget).
// Pure string/number work with no DOM dependency, so it is safe for the headless core.
__turbopack_context__.s([
    "isDarkColor",
    ()=>isDarkColor,
    "mix",
    ()=>mix,
    "parseRgb",
    ()=>parseRgb,
    "toHex6",
    ()=>toHex6,
    "withAlpha",
    ()=>withAlpha
]);
function parseRgb(color) {
    const s = color.trim();
    let m = /^#([0-9a-f]{3})$/i.exec(s);
    if (m) {
        const h = m[1];
        return {
            r: parseInt(h[0] + h[0], 16),
            g: parseInt(h[1] + h[1], 16),
            b: parseInt(h[2] + h[2], 16)
        };
    }
    m = /^#([0-9a-f]{6})[0-9a-f]{0,2}$/i.exec(s);
    if (m) {
        const h = m[1];
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16)
        };
    }
    const rgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(s);
    if (rgb) {
        return {
            r: parseFloat(rgb[1]),
            g: parseFloat(rgb[2]),
            b: parseFloat(rgb[3])
        };
    }
    return null;
}
function withAlpha(color, alpha) {
    const c = parseRgb(color);
    if (!c) return color;
    return `rgba(${c.r},${c.g},${c.b},${alpha})`;
}
function mix(base, top, alpha) {
    const b = parseRgb(base);
    const t = parseRgb(top);
    if (!b || !t) return base;
    const c = (x, y)=>Math.round(x + (y - x) * alpha);
    return `rgb(${c(b.r, t.r)},${c(b.g, t.g)},${c(b.b, t.b)})`;
}
function toHex6(color, fallback = '#888888') {
    const c = parseRgb(color);
    if (!c) return fallback;
    const h = (n)=>Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}
function isDarkColor(color) {
    const c = parseRgb(color);
    if (!c) return true;
    return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b < 128;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/events/EventBus.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TypedEventBus",
    ()=>TypedEventBus
]);
class TypedEventBus {
    handlers = new Map();
    on(event, handler) {
        let set = this.handlers.get(event);
        if (!set) {
            set = new Set();
            this.handlers.set(event, set);
        }
        const bucket = set;
        bucket.add(handler);
        return ()=>{
            bucket.delete(handler);
        };
    }
    off(event, handler) {
        this.handlers.get(event)?.delete(handler);
    }
    /** Whether anyone is listening — lets an emitter skip building an expensive payload. */ hasListeners(event) {
        return (this.handlers.get(event)?.size ?? 0) > 0;
    }
    emit(event, payload) {
        const set = this.handlers.get(event);
        if (!set) return;
        for (const handler of set){
            try {
                handler(payload);
            } catch (err) {
                console.error(`[vela] event handler error for "${String(event)}"`, err);
            }
        }
    }
    clear() {
        this.handlers.clear();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/icons.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "icon",
    ()=>icon,
    "iconAt",
    ()=>iconAt,
    "iconMarkup",
    ()=>iconMarkup,
    "registerIcon",
    ()=>registerIcon,
    "svg16",
    ()=>svg16,
    "svg24",
    ()=>svg24,
    "svg24Solid",
    ()=>svg24Solid
]);
// The icon registry — self-contained inline SVGs, no icon font, no CDN. It lives in core as
// PURE STRING DATA (no DOM) so the UI kit, the renderer's own chrome and the widget all draw
// from one set instead of each keeping its own inline copies. `src/ui/icons` adds the DOM
// helper on top and is the public entry point for plugins.
//
// TWO TIERS, one apparent weight:
//   tier A — 16×16 grid, stroke 1.2 ({@link svg16}): UI chrome (menus, panels, top bar).
//   tier B — 24×24 grid, stroke 1.8 ({@link svg24}): drawing tools and the toolbars around
//            them, where the glyph is a miniature of the geometry it draws.
// 1.2/16 and 1.8/24 are the same fraction of the grid, so a tier-A and a tier-B icon at the
// same rendered size read equally heavy. Every icon strokes `currentColor` and inherits its
// size from the slot (`1em`), so callers style icons by color and font-size alone.
const registry = new Map();
function registerIcon(id, svg) {
    registry.set(id, svg);
}
function iconMarkup(id) {
    return registry.get(id) ?? null;
}
function icon(id) {
    return registry.get(id) ?? '';
}
function iconAt(id, px) {
    return icon(id).replace('<svg ', `<svg width="${px}" height="${px}" `);
}
function svg16(body, extra = '') {
    return `<svg viewBox="0 0 16 16" width="1em" height="1em" ${extra ? extra + ' ' : ''}fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
function svg24(body, extra = '') {
    return `<svg viewBox="0 0 24 24" width="1em" height="1em" ${extra ? extra + ' ' : ''}fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
function svg24Solid(body) {
    return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" stroke="none">${body}</svg>`;
}
const S = svg16;
// ── chart-type icons (style-<id>) ──
registerIcon('style-candles', S('<path d="M4.5 2v2M4.5 12v2M11.5 2v1.5M11.5 11v3"/><rect x="2.8" y="4" width="3.4" height="8" rx="0.6" fill="currentColor" fill-opacity="0.25"/><rect x="9.8" y="3.5" width="3.4" height="7.5" rx="0.6" fill="currentColor"/>'));
registerIcon('style-candlestick', S('<path d="M4.5 2v2M4.5 12v2M11.5 2v1.5M11.5 11v3"/><rect x="2.8" y="4" width="3.4" height="8" rx="0.6" fill="currentColor" fill-opacity="0.25"/><rect x="9.8" y="3.5" width="3.4" height="7.5" rx="0.6" fill="currentColor"/>'));
registerIcon('style-bars', S('<path d="M4.5 2.5v11M2.5 5h2M4.5 11h2"/><path d="M11.5 2.5v11M9.5 4.5h2M11.5 10.5h2"/>'));
registerIcon('style-line', S('<path d="M1.5 11.5 5.5 7l3 2.5 5-6"/>'));
registerIcon('style-area', S('<path d="M1.5 11.5 5.5 7l3 2.5 5-6"/><path d="M1.5 11.5 5.5 7l3 2.5 5-6V13.5h-12z" fill="currentColor" fill-opacity="0.25" stroke="none"/>'));
registerIcon('style-baseline', S('<path d="M1.5 8h13" stroke-dasharray="2 2"/><path d="M2.5 8 5.25 4.5 8 8h-5.5z" fill="currentColor" fill-opacity="0.25" stroke="none"/><path d="M2.5 8 5.25 4.5 8 8"/><path d="M8 8l2.75 3.5L13.5 8h-5.5z" fill="currentColor" fill-opacity="0.25" stroke="none"/><path d="M8 8l2.75 3.5L13.5 8"/>'));
registerIcon('style-heikinashi', S('<path d="M4.5 12v2M11.5 2v2"/><rect x="2.8" y="5" width="3.4" height="7" rx="0.6" fill="currentColor" fill-opacity="0.25"/><rect x="9.8" y="4" width="3.4" height="7" rx="0.6" fill="currentColor"/>'));
// ── widget chrome icons ──
registerIcon('indicators', S('<path d="M1.5 12.5 5 7l2.5 3.5L11 4l3.5 5"/><circle cx="11" cy="4" r="1.4" fill="currentColor" stroke="none"/>'));
registerIcon('undo', S('<path d="M6.2 9.5 2.7 6l3.5-3.5"/><path d="M2.7 6h6.8a3.65 3.65 0 0 1 0 7.3H7.5"/>'));
registerIcon('redo', S('<path d="M9.8 9.5 13.3 6 9.8 2.5"/><path d="M13.3 6H6.5a3.65 3.65 0 0 0 0 7.3h2"/>'));
registerIcon('objects', S('<path d="M8 1.8 14 5 8 8.2 2 5z"/><path d="M2 8l6 3.2L14 8" opacity="0.7"/><path d="M2 11l6 3.2 6-3.2" opacity="0.4"/>'));
registerIcon('clock', S('<circle cx="8" cy="8" r="6.2"/><path d="M8 4.8V8l2.4 1.6"/>'));
registerIcon('calendar', S('<rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4"/><path d="M5.2 1.8v2.8M10.8 1.8v2.8M2.2 6.8h11.6"/>'));
registerIcon('datawindow', S('<rect x="1.8" y="2.5" width="12.4" height="11" rx="1.5"/><path d="M4.5 5.5h4M4.5 8h7M4.5 10.5h5.5"/>'));
registerIcon('camera', S('<path d="M5.5 4 6.5 2.5h3L10.5 4h3A1 1 0 0 1 14.5 5v7.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><circle cx="8" cy="8.5" r="2.6"/>'));
registerIcon('gear', S('<path d="M6.55 1.4h2.9l.32 1.72c.48.14.92.38 1.3.7l1.66-.55 1.45 2.5-1.35 1.1c.08.34.12.7.12 1.07s-.04.73-.12 1.07l1.35 1.1-1.45 2.5-1.66-.55a4.3 4.3 0 0 1-1.3.7L9.45 14.6h-2.9l-.32-1.72a4.3 4.3 0 0 1-1.3-.7l-1.66.55-1.45-2.5 1.35-1.1A4.4 4.4 0 0 1 3.05 7.94c0-.37.04-.73.12-1.07l-1.35-1.1 1.45-2.5 1.66.55c.38-.32.82-.56 1.3-.7L6.55 1.4z"/><circle cx="8" cy="8" r="2.2"/>'));
registerIcon('search', S('<circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5"/>'));
registerIcon('bell', S('<path d="M8 2a4 4 0 0 0-4 4v2.5L2.5 11v1h11v-1L12 8.5V6a4 4 0 0 0-4-4z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>'));
// ── market status (statusline badge): sun / sunrise / sunset / moon / holiday ──
// 24-grid bodies at the tier-B stroke — 1.8/24 carries the same apparent weight as the
// 16-grid chrome icons, so the badge glyph sits evenly beside them.
registerIcon('market-open', svg24('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'));
registerIcon('market-pre', svg24('<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>'));
registerIcon('market-post', svg24('<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 14-4 4-4-4"/><path d="M16 6a4 4 0 0 0-8 0"/>'));
registerIcon('market-extended', svg24('<path d="M22 22H2"/><path d="M12 3a5 5 0 0 0 7.5 7.5A7.5 7.5 0 1 1 12 3Z"/>'));
registerIcon('market-closed', svg24('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'));
registerIcon('market-holiday', svg24('<path d="m10 20-1.25-2.5L6 16"/><path d="M10 4 8.75 6.5 6 8"/><path d="m14 20 1.25-2.5L18 16"/><path d="m14 4 1.25 2.5L18 8"/><path d="m17 10-5 5-5-5"/><path d="M4 12h16"/>'));
// ── disclosure, row actions and menu verbs (side panels, nested menus) ──
registerIcon('chevron-right', S('<path d="m6 3.5 4.5 4.5L6 12.5"/>'));
registerIcon('chevron-left', S('<path d="M10 3.5 5.5 8l4.5 4.5"/>'));
registerIcon('chevron-down', S('<path d="M3.5 6 8 10.5 12.5 6"/>'));
registerIcon('chevron-up', S('<path d="M3.5 10 8 5.5 12.5 10"/>'));
registerIcon('chevrons-right', S('<path d="m4 3.5 4.5 4.5L4 12.5"/><path d="m8.5 3.5 4.5 4.5-4.5 4.5"/>'));
registerIcon('chevrons-left', S('<path d="M12 3.5 7.5 8l4.5 4.5"/><path d="M7.5 3.5 3 8l4.5 4.5"/>'));
// Bar replay: two left-pointing triangles.
registerIcon('replay', S('<path d="M14 4.2v7.6L8.6 8z"/><path d="M7.4 4.2v7.6L2 8z"/>'));
registerIcon('check', S('<path d="m2.8 8.4 3.4 3.4 7-7.6"/>'));
registerIcon('close', S('<path d="m3.8 3.8 8.4 8.4M12.2 3.8l-8.4 8.4"/>'));
// A pushpin — outline while something floats (press to pin it), filled once pinned.
registerIcon('pin', S('<path d="M5.6 2.5h4.8M6.4 2.5v3.6L4.4 8.4v.9h7.2v-.9L9.6 6.1V2.5M8 9.3v4.2"/>'));
registerIcon('pin-filled', S('<path d="M5.6 2.5h4.8M6.4 2.5v3.6L4.4 8.4v.9h7.2v-.9L9.6 6.1V2.5M8 9.3v4.2"/><path d="M6.4 2.5h3.2v3.6l2 2.3v.9H4.4v-.9l2-2.3z" fill="currentColor" stroke="none"/>'));
registerIcon('eye', S('<path d="M1.5 8s2.5-5.4 6.5-5.4S14.5 8 14.5 8 12 13.4 8 13.4 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="1.8"/>'));
registerIcon('eye-off', S('<path d="M1.5 8s2.5-5.4 6.5-5.4S14.5 8 14.5 8 12 13.4 8 13.4 1.5 8 1.5 8z" opacity="0.45"/><path d="m3 13 10-10"/>'));
registerIcon('lock', S('<rect x="3.2" y="7" width="9.6" height="6.6" rx="1.2"/><path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7"/>'));
registerIcon('unlock', S('<rect x="3.2" y="7" width="9.6" height="6.6" rx="1.2"/><path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.7-.7"/>'));
registerIcon('trash', S('<path d="M2.5 4.3h11M6.2 4.3V3.1a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1v1.2M4.2 4.3l.5 9.1a1.15 1.15 0 0 0 1.15 1.1h4.3a1.15 1.15 0 0 0 1.15-1.1l.5-9.1M6.5 7v4.5M9.5 7v4.5"/>'));
registerIcon('group', S('<path d="M1.8 4.5V2.4a.6.6 0 0 1 .6-.6h2.1M11.5 1.8h2.1a.6.6 0 0 1 .6.6v2.1M14.2 11.5v2.1a.6.6 0 0 1-.6.6h-2.1M4.5 14.2H2.4a.6.6 0 0 1-.6-.6v-2.1"/><rect x="4" y="4" width="4.2" height="4.2" rx="0.7"/><rect x="7.8" y="7.8" width="4.2" height="4.2" rx="0.7"/>'));
registerIcon('ungroup', S('<rect x="1.6" y="1.6" width="6.2" height="6.2" rx="0.9"/><rect x="8.2" y="8.2" width="6.2" height="6.2" rx="0.9" stroke-dasharray="2 1.5"/>'));
registerIcon('clone', S('<rect x="5.5" y="5.5" width="9" height="9" rx="1.2"/><path d="M11 5.5v-3a1 1 0 0 0-1-1H2.5a1 1 0 0 0-1 1V10a1 1 0 0 0 1 1h3"/>'));
registerIcon('arrow-up', S('<path d="M8 13.2V3M4.2 6.8 8 3l3.8 3.8"/>'));
registerIcon('arrow-down', S('<path d="M8 2.8V13M4.2 9.2 8 13l3.8-3.8"/>'));
registerIcon('move-vertical', S('<path d="M8 2.5v11M5 5.5 8 2.5l3 3M5 10.5l3 3 3-3"/>'));
registerIcon('move', S('<path d="M8 1.8v12.4M1.8 8h12.4M5.6 4.2 8 1.8l2.4 2.4M5.6 11.8 8 14.2l2.4-2.4M4.2 5.6 1.8 8l2.4 2.4M11.8 5.6 14.2 8l-2.4 2.4"/>'));
registerIcon('pen', S('<path d="m10.8 2.2 3 3-8 8-3.6.6.6-3.6z"/><path d="m9.2 3.8 3 3"/>'));
registerIcon('wave', S('<path d="M1.5 10.4c1.6 0 1.9-4.8 3.4-4.8s1.8 4.8 3.4 4.8 1.8-4.8 3.4-4.8 1.6 4.8 2.8 4.8"/>'));
registerIcon('folder-plus', S('<path d="M1.6 4.4a1 1 0 0 1 1-1h2.7l1.3 1.7h6.8a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-10.8a1 1 0 0 1-1-1z"/><path d="M8 7.6v3.6M6.2 9.4h3.6"/>'));
registerIcon('folder-minus', S('<path d="M1.6 4.4a1 1 0 0 1 1-1h2.7l1.3 1.7h6.8a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-10.8a1 1 0 0 1-1-1z"/><path d="M6.2 9.4h3.6"/>'));
registerIcon('collapse', S('<path d="M3 8h10"/>'));
registerIcon('expand', S('<rect x="2.2" y="2.2" width="11.6" height="11.6" rx="1.4"/><path d="M8 5.4v5.2M5.4 8h5.2"/>'));
registerIcon('plus', S('<path d="M8 2.8v10.4M2.8 8h10.4"/>'));
registerIcon('minus', S('<path d="M2.8 8h10.4"/>'));
registerIcon('maximize', S('<path d="M2.5 6V3a.5.5 0 0 1 .5-.5h3M10 2.5h3a.5.5 0 0 1 .5.5v3M13.5 10v3a.5.5 0 0 1-.5.5h-3M6 13.5H3a.5.5 0 0 1-.5-.5v-3"/>'));
registerIcon('restore', S('<path d="M6.2 2.5v3.7H2.5M9.8 13.5V9.8h3.7M13.5 6.2H9.8V2.5M2.5 9.8h3.7v3.7"/>'));
registerIcon('star', S('<path d="M8 2.2l1.75 3.55 3.9.55-2.8 2.75.65 3.9L8 11.1l-3.5 1.85.65-3.9-2.8-2.75 3.9-.55z"/>'));
registerIcon('star-filled', S('<path d="M8 2.2l1.75 3.55 3.9.55-2.8 2.75.65 3.9L8 11.1l-3.5 1.85.65-3.9-2.8-2.75 3.9-.55z"/>', 'fill="currentColor"'));
registerIcon('grip', S('<circle cx="6" cy="3.5" r="1"/><circle cx="10" cy="3.5" r="1"/><circle cx="6" cy="8" r="1"/><circle cx="10" cy="8" r="1"/><circle cx="6" cy="12.5" r="1"/><circle cx="10" cy="12.5" r="1"/>', 'fill="currentColor" stroke="none"'));
registerIcon('kebab', S('<circle cx="8" cy="3.2" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="12.8" r="1.2"/>', 'fill="currentColor" stroke="none"'));
registerIcon('burger', S('<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"/>'));
// The ⓘ hint glyph: an "i" drawn as geometry (dot + stem) so it centers exactly in its
// badge — a text "i" would sit at the font's mercy. The badge draws the circle.
registerIcon('info', S('<path d="M8 7.4v4.4"/><circle cx="8" cy="4.6" r="0.9" fill="currentColor" stroke="none"/>'));
registerIcon('reset', S('<path d="M2 8a6 6 0 1 0 6-6 6.5 6.5 0 0 0-4.5 1.83L2 5.33"/><path d="M2 2v3.33h3.33"/>'));
// ── pane chrome (stack order, collapse, maximize) ──
registerIcon('pane-collapse', S('<path d="M2.6 9.4h4v4M13.4 6.6h-4v-4"/><path d="m9.4 6.6 4.2-4.2M2.4 13.6l4.2-4.2"/>'));
registerIcon('pane-expand', S('<path d="M9.8 2.4h3.8v3.8M6.2 13.6H2.4V9.8"/><path d="m13.6 2.4-4.4 4.4M2.4 13.6l4.4-4.4"/>'));
// ── drawing tools and their toolbars (tier B) ──
registerIcon('cursor', svg24('<path d="M5 3l6 16 2-6 6-2z"/>', 'fill="currentColor" stroke="none"'));
registerIcon('ruler', svg24('<path d="M21.3 15.3 8.7 2.7a1 1 0 0 0-1.4 0L2.7 7.3a1 1 0 0 0 0 1.4l12.6 12.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>'));
registerIcon('magnet', svg24('<path d="m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15"/><path d="m5 8 4 4"/><path d="m12 15 4 4"/>'));
registerIcon('eraser', svg24('<path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4L13 5a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8L12 20"/><path d="M22 21H7"/><path d="m5 11 9 9"/>'));
registerIcon('pen-lock', svg24('<path d="M13.8 4.2a2.1 2.1 0 0 1 3 3L8.5 15.5l-3.5 1 1-3.5Z"/><rect x="13" y="14.5" width="8" height="6" rx="1.2"/><path d="M15 14.5v-1.6a2 2 0 0 1 4 0v1.6"/>'));
registerIcon('pen-sync', // Pen + two stacked panes — drawing onto every linked chart at once.
svg24('<path d="M13.8 4.2a2.1 2.1 0 0 1 3 3L8.5 15.5l-3.5 1 1-3.5Z"/><rect x="12.5" y="13.5" width="6" height="4.8" rx="1"/><path d="M15.5 18.3v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.8a1 1 0 0 0-1-1h-1"/>'));
registerIcon('brush', svg24('<path d="M9.5 12 17 4.5a2.12 2.12 0 0 1 3 3L12.5 15"/><path d="M7 14a3 3 0 0 0-3 3c0 1.3-1.2 1.5-1.5 2 .8.9 2 1.5 3.5 1.5a3.5 3.5 0 0 0 3.5-3.5 3 3 0 0 0-2.5-3Z"/>'));
registerIcon('bucket', svg24('<path d="m18.5 11.5-7-7L4 12a1.8 1.8 0 0 0 0 2.5l5 5a1.8 1.8 0 0 0 2.5 0Z"/><path d="m5 5 4 4"/><path d="M3.5 13.5h13"/><path d="M21 17.5c0 1.1-.9 2-2 2s-2-.9-2-2c0-1 1.2-1.7 2-3 .8 1.3 2 2 2 3Z"/>'));
registerIcon('type', svg24('<path d="M5 6V4.5h14V6"/><path d="M12 4.5v15"/><path d="M9.5 19.5h5"/>'));
registerIcon('bold', svg24('<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7Z"/><path d="M7 12h7a3.5 3.5 0 0 1 0 7H7Z"/>', 'stroke-width="2.4"'));
registerIcon('italic', svg24('<path d="M15 5h-5M14 19H9M14.5 5 10 19"/>', 'stroke-width="2.2"'));
registerIcon('price-delta', svg24('<path d="M12 4v16"/><path d="M8 8l4-4 4 4"/><path d="M8 16l4 4 4-4"/>'));
registerIcon('date-delta', svg24('<path d="M4 12h16"/><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/>'));
registerIcon('bring-front', svg24('<rect x="8.5" y="8.5" width="7" height="7" rx="1.5"/><path d="M4.5 10.5V6a1.5 1.5 0 0 1 1.5-1.5h4.5"/><path d="M19.5 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-4.5"/>'));
registerIcon('send-back', svg24('<rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" opacity="0.35"/><path d="M4.5 10.5V6a1.5 1.5 0 0 1 1.5-1.5h4.5"/><path d="M19.5 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-4.5"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.5"/>'));
registerIcon('r-squared', '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" stroke="none"><text x="2.5" y="17.5" font-size="14" font-family="serif">R²</text></svg>');
registerIcon('bands', svg24('<path d="M3 6h18"/><path d="M3 18h18"/><path d="M3 12h18" stroke-dasharray="3 3"/>'));
registerIcon('dedekind', svg24('<path d="M2 20h20"/><path d="M4 20a8 8 0 0 1 16 0"/><path d="M8 20a4 4 0 0 1 8 0"/><path d="M12 4v16"/>'));
registerIcon('sonic', svg24('<circle cx="15" cy="12" r="4"/><circle cx="12" cy="12" r="2.5"/><path d="M8 5v14"/>'));
registerIcon('supersonic', svg24('<circle cx="16" cy="12" r="3.5"/><path d="M6 12 15 6M6 12 15 18"/>'));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/marks/MarksController.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarksController",
    ()=>MarksController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$marks$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/marks/visibility.ts [app-client] (ecmascript)");
;
class MarksController {
    renderer;
    /** Insertion-ordered — the order a cluster falls back to for equal times. */ marks;
    groups;
    enabled;
    subs;
    constructor(renderer, events){
        this.renderer = renderer;
        this.marks = new Map();
        this.groups = new Map();
        this.subs = [];
        this.enabled = !!renderer.capabilities.timelineMarks && typeof renderer.setTimelineMarks === 'function';
        if (this.enabled && renderer.onMarkClick) this.subs.push(renderer.onMarkClick((e)=>events.emit('mark:click', e)));
    }
    /** Whether the active renderer paints timeline marks. */ get supported() {
        return this.enabled;
    }
    /** Add (or replace, by id) one mark. */ add(mark) {
        this.marks.set(mark.id, validateMark(mark));
        this.sync();
    }
    /** Replace the whole set — a market switch. */ set(marks) {
        this.marks.clear();
        for (const m of marks)this.marks.set(m.id, validateMark(m));
        this.sync();
    }
    remove(id) {
        const had = this.marks.delete(id);
        if (had) this.sync();
        return had;
    }
    clear() {
        if (this.marks.size === 0) return;
        this.marks.clear();
        this.sync();
    }
    /** Every mark, in insertion order (shallow copies — mutating one changes nothing). */ all() {
        return [
            ...this.marks.values()
        ].map((m)=>({
                ...m,
                glyph: {
                    ...m.glyph
                }
            }));
    }
    /** Define (or replace) a group's presentation — its settings label and default visibility. */ defineGroup(group) {
        if (!group || typeof group.id !== 'string' || group.id.length === 0) throw new Error('[vela] marks.defineGroup: `id` must be a non-empty string');
        if (typeof group.label !== 'string') throw new Error(`[vela] marks.defineGroup: group "${group.id}" needs a string \`label\``);
        if (group.parent !== undefined && (typeof group.parent !== 'string' || group.parent.length === 0)) throw new Error(`[vela] marks.defineGroup: group "${group.id}" has a \`parent\` that is not a group id`);
        this.groups.set(group.id, {
            ...group
        });
        this.sync();
    }
    /** The defined groups, in definition order. */ groupDefinitions() {
        return [
            ...this.groups.values()
        ].map((g)=>({
                ...g
            }));
    }
    /**
     * Show or hide one group's marks. The choice lives in the renderer's cosmetic config
     * (the `marks` feature) — what the settings dialog's Events checkboxes edit and what
     * a persisted chart restores — so it warns + no-ops on a renderer without it.
     */ setGroupVisible(id, visible) {
        if (!this.renderer.features.includes('marks')) {
            console.warn(`[vela] renderer "${this.renderer.name}" does not paint timeline marks — setGroupVisible ignored.`);
            return;
        }
        this.renderer.applyFeature('marks', {
            groups: {
                [id]: visible
            }
        });
    }
    /**
     * A group's effective visibility: its own switch — the user's (persisted) choice, else
     * the declared default, else visible — AND every ancestor's, so a child under a
     * switched-off parent reads hidden whatever its own choice says.
     */ isGroupVisible(id) {
        const state = this.renderer.readFeature('marks');
        const groups = {};
        for (const [gid, v] of Object.entries(state?.groups ?? {}))if (typeof v === 'boolean') groups[gid] = v;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$marks$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markGroupVisible"])(groups, id, [
            ...this.groups.values()
        ]);
    }
    destroy() {
        for (const unsub of this.subs)unsub();
        this.subs.length = 0;
    }
    sync() {
        if (!this.enabled) return;
        this.renderer.setTimelineMarks([
            ...this.marks.values()
        ], [
            ...this.groups.values()
        ]);
    }
}
/** Reject the malformed shapes a host can plausibly pass — a mark that cannot be placed or drawn is a programming error, not data to tolerate. */ function validateMark(mark) {
    if (!mark || typeof mark !== 'object') throw new Error('[vela] marks: a mark must be an object');
    if (typeof mark.id !== 'string' || mark.id.length === 0) throw new Error('[vela] marks: `id` must be a non-empty string');
    if (typeof mark.time !== 'number' || !Number.isFinite(mark.time)) throw new Error(`[vela] marks: mark "${mark.id}" needs a finite epoch-ms \`time\``);
    if (!mark.glyph || typeof mark.glyph !== 'object' || typeof mark.glyph.color !== 'string') throw new Error(`[vela] marks: mark "${mark.id}" needs a glyph with a \`color\``);
    return {
        ...mark,
        glyph: {
            ...mark.glyph
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/marks/visibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Group visibility for timeline marks — pure and renderer-agnostic, so both the core
// controller (`chart.marks.isGroupVisible`) and the renderers' display state read the
// same rule. Node-testable.
__turbopack_context__.s([
    "markGroupOwnVisible",
    ()=>markGroupOwnVisible,
    "markGroupRows",
    ()=>markGroupRows,
    "markGroupVisible",
    ()=>markGroupVisible
]);
function markGroupOwnVisible(choices, groupId, groups) {
    const chosen = choices[groupId];
    if (typeof chosen === 'boolean') return chosen;
    return groups.find((g)=>g.id === groupId)?.visible !== false;
}
function markGroupVisible(choices, groupId, groups) {
    if (groupId === undefined) return true;
    const seen = new Set();
    let id = groupId;
    while(id !== undefined && !seen.has(id)){
        seen.add(id);
        if (!markGroupOwnVisible(choices, id, groups)) return false;
        const parent = groups.find((g)=>g.id === id)?.parent;
        id = parent !== undefined && groups.some((g)=>g.id === parent) ? parent : undefined;
    }
    return true;
}
function markGroupRows(groups) {
    const ids = new Set(groups.map((g)=>g.id));
    const out = [];
    const placed = new Set();
    const place = (group, depth)=>{
        if (placed.has(group.id)) return;
        placed.add(group.id);
        out.push({
            group,
            depth
        });
        for (const child of groups)if (child.parent === group.id && child.id !== group.id) place(child, depth + 1);
    };
    for (const g of groups){
        const parentKnown = g.parent !== undefined && ids.has(g.parent) && g.parent !== g.id;
        if (!parentKnown) place(g, 0);
    }
    for (const g of groups)place(g, 0); // anything left (cycles) surfaces at the top level
    return out;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/model/identity.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stableSeriesId",
    ()=>stableSeriesId
]);
function stableSeriesId(parts) {
    const normTitle = parts.title.trim().toLowerCase().replace(/\s+/g, '-');
    return `${parts.instanceId}:${parts.kind}:${normTitle}#${parts.ordinal}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/model/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$inputs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/model/inputs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$series$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/model/series.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/model/identity.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/model/inputs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Renderer-neutral indicator input schema — Vela's own shape, owned here so no
 * scripting language's own input model leaks into core (each engine maps its
 * declarations onto this at its boundary). Drives the renderer's settings dialog
 * (the gear settings UI).
 */ __turbopack_context__.s([
    "inputDeltas",
    ()=>inputDeltas,
    "inputVisible",
    ()=>inputVisible
]);
function inputVisible(when, values) {
    if (!when) return true;
    const conds = Array.isArray(when) ? when : [
        when
    ];
    return conds.every((c)=>c.anyOf ? c.anyOf.some((x)=>x === values[c.key]) : values[c.key] === c.equals);
}
function inputDeltas(schema, values) {
    const out = {};
    for (const s of schema){
        const v = values[s.key];
        if (v !== undefined && JSON.stringify(v) !== JSON.stringify(s.defval)) out[s.key] = v;
    }
    return Object.keys(out).length > 0 ? out : undefined;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/model/series.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isLineLikeSeries",
    ()=>isLineLikeSeries,
    "seriesInScale",
    ()=>seriesInScale,
    "seriesShownOn",
    ()=>seriesShownOn
]);
function isLineLikeSeries(spec) {
    return spec.kind !== 'candle' && spec.kind !== 'bar' && spec.kind !== 'markers';
}
function seriesShownOn(spec, surface) {
    if (spec.display) return spec.display[surface] !== false;
    return spec.visible !== false;
}
function seriesInScale(spec) {
    return seriesShownOn(spec, 'pane') || seriesShownOn(spec, 'priceScale');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/options.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANIMATION_EASE_MAX_MS",
    ()=>ANIMATION_EASE_MAX_MS,
    "AUTOSCALE_EASE_DEFAULT_MS",
    ()=>AUTOSCALE_EASE_DEFAULT_MS,
    "INTRO_DURATION_DEFAULT_MS",
    ()=>INTRO_DURATION_DEFAULT_MS,
    "INTRO_DURATION_MAX_MS",
    ()=>INTRO_DURATION_MAX_MS,
    "LIVE_BAR_EASE_DEFAULT_MS",
    ()=>LIVE_BAR_EASE_DEFAULT_MS,
    "LIVE_BAR_EASE_MAX_MS",
    ()=>LIVE_BAR_EASE_MAX_MS,
    "PAN_INERTIA_DEFAULT_MS",
    ()=>PAN_INERTIA_DEFAULT_MS,
    "SCROLL_EASE_DEFAULT_MS",
    ()=>SCROLL_EASE_DEFAULT_MS,
    "ZOOM_EASE_DEFAULT_MS",
    ()=>ZOOM_EASE_DEFAULT_MS,
    "normalizeSession",
    ()=>normalizeSession,
    "resolveAnimations",
    ()=>resolveAnimations,
    "resolveEaseMs",
    ()=>resolveEaseMs,
    "resolveIntro",
    ()=>resolveIntro,
    "resolveLiveBarEaseMs",
    ()=>resolveLiveBarEaseMs
]);
const normalizeSession = (v)=>v === 'regular' || v === 'extended' ? v : undefined;
const ZOOM_EASE_DEFAULT_MS = 70;
const PAN_INERTIA_DEFAULT_MS = 110;
const SCROLL_EASE_DEFAULT_MS = 130;
const AUTOSCALE_EASE_DEFAULT_MS = 80;
const LIVE_BAR_EASE_DEFAULT_MS = 90;
const INTRO_DURATION_DEFAULT_MS = 650;
const ANIMATION_EASE_MAX_MS = 1000;
const LIVE_BAR_EASE_MAX_MS = ANIMATION_EASE_MAX_MS;
const INTRO_DURATION_MAX_MS = 5000;
function resolveEaseMs(value, defaultMs, maxMs = ANIMATION_EASE_MAX_MS) {
    if (value === true) return defaultMs;
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0;
    return Math.min(value, maxMs);
}
function resolveLiveBarEaseMs(value) {
    return resolveEaseMs(value, LIVE_BAR_EASE_DEFAULT_MS, LIVE_BAR_EASE_MAX_MS);
}
function resolveIntro(value) {
    const off = {
        style: false,
        duration: 0
    };
    if (value === true) return {
        style: 'settle',
        duration: INTRO_DURATION_DEFAULT_MS
    };
    if (value === 'settle' || value === 'grow') return {
        style: value,
        duration: INTRO_DURATION_DEFAULT_MS
    };
    if (value && typeof value === 'object') {
        const o = value;
        const d = o.duration;
        return {
            style: o.style === 'grow' ? 'grow' : 'settle',
            duration: typeof d === 'number' && Number.isFinite(d) && d > 0 ? Math.min(d, INTRO_DURATION_MAX_MS) : INTRO_DURATION_DEFAULT_MS
        };
    }
    return off;
}
function resolveAnimations(animations) {
    if (animations === false) return {
        animZoom: 0,
        animPan: 0,
        animScroll: 0,
        animAutoscale: 0,
        animLiveBar: 0,
        animIntro: {
            style: false,
            duration: 0
        }
    };
    const cfg = animations === true || animations == null ? {} : animations;
    const animPan = resolveEaseMs(cfg.pan ?? true, PAN_INERTIA_DEFAULT_MS);
    return {
        animZoom: resolveEaseMs(cfg.zoom ?? true, ZOOM_EASE_DEFAULT_MS),
        animPan,
        animScroll: cfg.scroll === undefined ? animPan > 0 ? SCROLL_EASE_DEFAULT_MS : 0 : resolveEaseMs(cfg.scroll, SCROLL_EASE_DEFAULT_MS),
        animAutoscale: resolveEaseMs(cfg.autoscale ?? true, AUTOSCALE_EASE_DEFAULT_MS),
        animLiveBar: resolveLiveBarEaseMs(cfg.liveBar),
        animIntro: resolveIntro(cfg.intro ?? true)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/palette.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// The semantic palette — every fixed color Vela ships that is NOT part of a swappable
// `VelaTheme`. These are brand/meaning constants (an accent stays the accent whichever
// theme is active), so they live here once instead of being retyped as literals in the
// chrome, the pickers, the defaults and the tokens.
//
// Theme-dependent colors (surfaces, text, borders, candles) belong to `VelaTheme` in
// `theme.ts` and must NOT be duplicated here.
/** Selection/menu accent — active entries, "native" badges, selected controls. */ __turbopack_context__.s([
    "ACCENT",
    ()=>ACCENT,
    "ACCENT_BRIGHT",
    ()=>ACCENT_BRIGHT,
    "BEARISH",
    ()=>BEARISH,
    "BULLISH",
    ()=>BULLISH,
    "CATEGORICAL",
    ()=>CATEGORICAL,
    "CHIP_PLATE",
    ()=>CHIP_PLATE,
    "CROSSHAIR",
    ()=>CROSSHAIR,
    "HIGHLIGHT",
    ()=>HIGHLIGHT,
    "INFO",
    ()=>INFO,
    "INVALID",
    ()=>INVALID,
    "MARKER",
    ()=>MARKER,
    "MUTED",
    ()=>MUTED,
    "NEUTRAL",
    ()=>NEUTRAL,
    "SERIES_LINE",
    ()=>SERIES_LINE,
    "SESSION_OFF",
    ()=>SESSION_OFF,
    "SESSION_POST",
    ()=>SESSION_POST,
    "SESSION_PRE",
    ()=>SESSION_PRE,
    "SLATE",
    ()=>SLATE,
    "SLATE_DEEP",
    ()=>SLATE_DEEP,
    "TRADE_EXIT",
    ()=>TRADE_EXIT,
    "TRADE_LONG",
    ()=>TRADE_LONG,
    "TRADE_SHORT",
    ()=>TRADE_SHORT,
    "VALID",
    ()=>VALID,
    "WARNING",
    ()=>WARNING,
    "categoricalColor",
    ()=>categoricalColor
]);
const ACCENT = '#2962ff';
const ACCENT_BRIGHT = '#38c0fd';
const BULLISH = '#a7be94';
const BEARISH = '#af6870';
const NEUTRAL = '#757882';
const MUTED = '#46474b';
const HIGHLIGHT = '#e0b400';
const WARNING = '#ff9800';
const INFO = '#5b9cf6';
const MARKER = '#ff5d00';
const VALID = '#0ecb81';
const INVALID = '#f6465d';
const SESSION_PRE = '#f97316';
const SESSION_POST = '#0ea5e9';
const SESSION_OFF = '#9ca3af';
const SERIES_LINE = '#3b82f6';
const CROSSHAIR = '#757882';
const SLATE_DEEP = '#1e293b';
const SLATE = '#475569';
const CHIP_PLATE = '#595959';
const TRADE_LONG = BULLISH;
const TRADE_SHORT = BEARISH;
const TRADE_EXIT = '#d500f9';
const CATEGORICAL = [
    ACCENT,
    BULLISH,
    BEARISH,
    WARNING,
    '#7e57c2',
    '#26a69a',
    INFO,
    '#e573b5'
];
function categoricalColor(key) {
    let h = 0;
    for(let i = 0; i < key.length; i++)h = h * 31 + key.charCodeAt(i) >>> 0;
    return CATEGORICAL[h % CATEGORICAL.length];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/price-styles/BarTransform.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "barTransformFor",
    ()=>barTransformFor,
    "parseExtendedTicker",
    ()=>parseExtendedTicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/chart-types/registry.ts [app-client] (ecmascript)");
;
function barTransformFor(style) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chartType"])(style)?.barTransform ?? null;
}
function parseExtendedTicker(symbol) {
    const at = symbol.lastIndexOf(';');
    if (at <= 0 || at === symbol.length - 1) return {
        symbol,
        modifier: null,
        transform: null
    };
    const modifier = symbol.slice(at + 1).toLowerCase();
    if (modifier !== 'standard' && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tickerModifierIds"])().includes(modifier)) return {
        symbol,
        modifier: null,
        transform: null
    };
    return {
        symbol: symbol.slice(0, at),
        modifier,
        transform: barTransformFor(modifier)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/price-styles/heikin-ashi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "heikinAshiFull",
    ()=>heikinAshiFull,
    "heikinAshiNext",
    ()=>heikinAshiNext
]);
function heikinAshiNext(raw, prevHa) {
    const haClose = (raw.open + raw.high + raw.low + raw.close) / 4;
    const haOpen = prevHa ? (prevHa.open + prevHa.close) / 2 : (raw.open + raw.close) / 2;
    return {
        time: raw.time,
        open: haOpen,
        high: Math.max(raw.high, haOpen, haClose),
        low: Math.min(raw.low, haOpen, haClose),
        close: haClose,
        ...raw.volume != null ? {
            volume: raw.volume
        } : {}
    };
}
function heikinAshiFull(raw) {
    const out = new Array(raw.length);
    let prev;
    for(let i = 0; i < raw.length; i += 1){
        prev = heikinAshiNext(raw[i], prev);
        out[i] = prev;
    }
    return out;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/renderer-defaults.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerRendererDefaults",
    ()=>registerRendererDefaults,
    "rendererDefaults",
    ()=>rendererDefaults,
    "unregisterRendererDefaults",
    ()=>unregisterRendererDefaults
]);
// Renderer FEATURE defaults contributed by plugins. A renderer feature
// (`chart.renderer.set(key, value)`) is per-chart state set on an instance that does not
// exist yet when an enabler runs, and no registry carried it: a plugin could contribute a
// chart type, an engine or a panel, but not "every chart should start with this feature
// set". This is that missing half — the same shape as the other contribution registries,
// and the renderer-side counterpart of `registerDefaultEngine`, except it reaches EVERY
// chart: the widget's, each workspace cell's, and a bare `new Vela()`.
const defaults = new Map();
function registerRendererDefaults(values) {
    const applied = Object.entries(values);
    for (const [key, value] of applied)defaults.set(key, value);
    return ()=>{
        for (const [key, value] of applied)if (defaults.get(key) === value) defaults.delete(key);
    };
}
function unregisterRendererDefaults(...keys) {
    if (keys.length === 0) defaults.clear();
    else for (const key of keys)defaults.delete(key);
}
function rendererDefaults() {
    return Object.fromEntries(defaults);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/replayTicks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Ready-made tick sources for `chart.replay.setTicks` — the lower-timeframe case: replay a
// bar through the finer bars that make it up, fetched from the chart's own provider.
__turbopack_context__.s([
    "barsToTicks",
    ()=>barsToTicks,
    "lowerTimeframeTicks",
    ()=>lowerTimeframeTicks
]);
function lowerTimeframeTicks(chart, timeframe) {
    return async (bar, { end, signal })=>{
        const { symbol, session } = chart.market;
        const resolved = symbol ? chart.data.resolve(symbol) : null;
        const provider = resolved ? chart.data.providerInstance(resolved.provider) : undefined;
        if (!resolved || !provider) return [];
        const bars = await provider.getBars(resolved.ticker, timeframe, {
            from: bar.time,
            to: end - 1,
            ...session ? {
                session
            } : {}
        });
        if (signal.aborted) return [];
        return barsToTicks(bars.filter((b)=>b.time >= bar.time && b.time < end));
    };
}
function barsToTicks(bars) {
    return bars.map((b)=>({
            price: b.close,
            open: b.open,
            high: b.high,
            low: b.low,
            ...b.volume === undefined ? {} : {
                volume: b.volume
            }
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLASSIC_THEME",
    ()=>CLASSIC_THEME,
    "DARK_THEME",
    ()=>DARK_THEME,
    "LIGHT_THEME",
    ()=>LIGHT_THEME,
    "resolveTheme",
    ()=>resolveTheme
]);
const DARK_THEME = {
    name: 'dark',
    background: '#202126',
    textColor: '#757882',
    gridColor: '#24252a',
    borderColor: '#262629',
    upColor: '#a7be94',
    downColor: '#af6870',
    fontFamily: 'sans-serif',
    bgPanel: '#121215',
    bgCard: '#232429',
    bgBar: '#191a1e',
    bgChip: '#292a2f',
    bgHover: '#2b2d34',
    border: '#262629',
    textPrimary: '#eeeef1',
    textSecondary: '#757882',
    textMuted: '#46474b'
};
const CLASSIC_THEME = {
    name: 'classic',
    background: '#131722',
    textColor: '#d1d4dc',
    gridColor: '#1e222d',
    borderColor: '#2a2e39',
    upColor: '#089981',
    downColor: '#f23645',
    fontFamily: 'sans-serif',
    bgPanel: '#1e222d',
    bgCard: '#2a2e39',
    bgBar: '#171b26',
    bgChip: '#2a2e39',
    bgHover: '#363a45',
    border: '#2a2e39',
    textPrimary: '#ffffff',
    textSecondary: '#d1d4dc',
    textMuted: '#787b86'
};
const LIGHT_THEME = {
    name: 'light',
    background: '#ffffff',
    textColor: '#1e293b',
    gridColor: '#e0e3eb',
    borderColor: '#d4dae3',
    upColor: '#089981',
    downColor: '#f23645',
    fontFamily: 'sans-serif',
    bgPanel: '#f8f9fa',
    bgCard: '#ffffff',
    bgBar: '#f1f3f5',
    bgChip: '#e9ecef',
    bgHover: '#dee2e6',
    border: '#d4dae3',
    textPrimary: '#000000',
    textSecondary: '#64748b',
    textMuted: '#94a3b8'
};
function resolveTheme(theme) {
    if (!theme || theme === 'dark' || theme === 'vela') return DARK_THEME;
    if (theme === 'classic' || theme === 'standard') return CLASSIC_THEME;
    if (theme === 'light') return LIGHT_THEME;
    return {
        ...DARK_THEME,
        ...theme,
        upColor: theme.upColor || DARK_THEME.upColor,
        downColor: theme.downColor || DARK_THEME.downColor
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/timezones.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// The canonical display-timezone catalog — ONE list for every zone picker (the widget's
// bottom bar, the time-axis context menu, the renderer's settings dialog), so they can
// never drift apart. Ordered by standard UTC offset (UTC first); every whole, half and
// quarter-hour offset from UTC-12 to UTC+14 is represented. Offsets are computed live
// (DST-aware), never hardcoded in labels.
__turbopack_context__.s([
    "EXCHANGE_TIMEZONE",
    ()=>EXCHANGE_TIMEZONE,
    "TIMEZONES",
    ()=>TIMEZONES,
    "isExchangeTimezone",
    ()=>isExchangeTimezone,
    "normalizeTimezone",
    ()=>normalizeTimezone,
    "resolveTimezone",
    ()=>resolveTimezone,
    "timezoneMenuRows",
    ()=>timezoneMenuRows,
    "tzButtonLabel",
    ()=>tzButtonLabel,
    "tzMenuLabel",
    ()=>tzMenuLabel,
    "tzOffset",
    ()=>tzOffset
]);
const TIMEZONES = [
    {
        value: 'Etc/UTC',
        label: 'UTC'
    },
    {
        value: 'Etc/GMT+12',
        label: 'International Date Line West'
    },
    {
        value: 'Pacific/Pago_Pago',
        label: 'Pago Pago'
    },
    {
        value: 'Pacific/Honolulu',
        label: 'Honolulu'
    },
    {
        value: 'Pacific/Marquesas',
        label: 'Marquesas Islands'
    },
    {
        value: 'America/Anchorage',
        label: 'Anchorage'
    },
    {
        value: 'America/Los_Angeles',
        label: 'Los Angeles'
    },
    {
        value: 'America/Phoenix',
        label: 'Phoenix'
    },
    {
        value: 'America/Denver',
        label: 'Denver'
    },
    {
        value: 'America/Chicago',
        label: 'Chicago'
    },
    {
        value: 'America/Mexico_City',
        label: 'Mexico City'
    },
    {
        value: 'America/New_York',
        label: 'New York'
    },
    {
        value: 'America/Bogota',
        label: 'Bogotá'
    },
    {
        value: 'America/Caracas',
        label: 'Caracas'
    },
    {
        value: 'America/Santiago',
        label: 'Santiago'
    },
    {
        value: 'America/St_Johns',
        label: "St. John's"
    },
    {
        value: 'America/Sao_Paulo',
        label: 'São Paulo'
    },
    {
        value: 'America/Argentina/Buenos_Aires',
        label: 'Buenos Aires'
    },
    {
        value: 'America/Noronha',
        label: 'Fernando de Noronha'
    },
    {
        value: 'Atlantic/Azores',
        label: 'Azores'
    },
    {
        value: 'Atlantic/Reykjavik',
        label: 'Reykjavik'
    },
    {
        value: 'Europe/London',
        label: 'London'
    },
    {
        value: 'Europe/Paris',
        label: 'Paris'
    },
    {
        value: 'Europe/Berlin',
        label: 'Berlin'
    },
    {
        value: 'Europe/Athens',
        label: 'Athens'
    },
    {
        value: 'Africa/Cairo',
        label: 'Cairo'
    },
    {
        value: 'Africa/Johannesburg',
        label: 'Johannesburg'
    },
    {
        value: 'Europe/Moscow',
        label: 'Moscow'
    },
    {
        value: 'Europe/Istanbul',
        label: 'Istanbul'
    },
    {
        value: 'Asia/Tehran',
        label: 'Tehran'
    },
    {
        value: 'Asia/Dubai',
        label: 'Dubai'
    },
    {
        value: 'Asia/Kabul',
        label: 'Kabul'
    },
    {
        value: 'Asia/Karachi',
        label: 'Karachi'
    },
    {
        value: 'Asia/Kolkata',
        label: 'Mumbai'
    },
    {
        value: 'Asia/Kathmandu',
        label: 'Kathmandu'
    },
    {
        value: 'Asia/Dhaka',
        label: 'Dhaka'
    },
    {
        value: 'Asia/Yangon',
        label: 'Yangon'
    },
    {
        value: 'Asia/Bangkok',
        label: 'Bangkok'
    },
    {
        value: 'Asia/Shanghai',
        label: 'Shanghai'
    },
    {
        value: 'Asia/Hong_Kong',
        label: 'Hong Kong'
    },
    {
        value: 'Asia/Singapore',
        label: 'Singapore'
    },
    {
        value: 'Australia/Eucla',
        label: 'Eucla'
    },
    {
        value: 'Asia/Tokyo',
        label: 'Tokyo'
    },
    {
        value: 'Asia/Seoul',
        label: 'Seoul'
    },
    {
        value: 'Australia/Adelaide',
        label: 'Adelaide'
    },
    {
        value: 'Australia/Sydney',
        label: 'Sydney'
    },
    {
        value: 'Australia/Lord_Howe',
        label: 'Lord Howe Island'
    },
    {
        value: 'Pacific/Noumea',
        label: 'Nouméa'
    },
    {
        value: 'Pacific/Auckland',
        label: 'Auckland'
    },
    {
        value: 'Pacific/Chatham',
        label: 'Chatham Islands'
    },
    {
        value: 'Pacific/Apia',
        label: 'Apia'
    },
    {
        value: 'Pacific/Kiritimati',
        label: 'Kiritimati'
    }
];
const EXCHANGE_TIMEZONE = 'exchange';
function isExchangeTimezone(zone) {
    return zone === EXCHANGE_TIMEZONE;
}
function resolveTimezone(zone, exchangeZone) {
    if (!isExchangeTimezone(zone)) return zone;
    return exchangeZone && exchangeZone !== '' ? exchangeZone : 'Etc/UTC';
}
function normalizeTimezone(zone) {
    return zone === 'UTC' || zone === 'Etc/UTC' || zone === 'Etc/GMT' ? 'Etc/UTC' : zone;
}
function timezoneMenuRows(current) {
    const active = normalizeTimezone(current);
    const [utc, ...zones] = TIMEZONES.map((t)=>({
            value: t.value,
            label: tzMenuLabel(t.value, t.label),
            checked: t.value === active
        }));
    return [
        utc,
        {
            value: EXCHANGE_TIMEZONE,
            label: 'Exchange',
            checked: isExchangeTimezone(current)
        },
        ...zones
    ];
}
function tzOffset(zone, date = new Date()) {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            timeZoneName: 'shortOffset'
        }).formatToParts(date);
        const raw = parts.find((p)=>p.type === 'timeZoneName')?.value ?? '';
        const m = raw.match(/GMT(?:(\+|-)(\d{1,2})(?::(\d{2}))?)?/);
        if (!m || !m[1]) return 'UTC';
        const sign = m[1] === '-' ? '-' : '+';
        const hrs = m[2] ?? '0';
        const mins = m[3] ?? '';
        return mins ? `UTC${sign}${hrs}:${mins}` : `UTC${sign}${hrs}`;
    } catch  {
        return 'UTC';
    }
}
function tzMenuLabel(zone, location) {
    if (normalizeTimezone(zone) === 'Etc/UTC') return location;
    return `(${tzOffset(zone)}) ${location}`;
}
function tzButtonLabel(zone) {
    // Some ICU builds format Etc/UTC as "GMT+0" — fold that back to the bare "UTC".
    if (normalizeTimezone(zone) === 'Etc/UTC') return 'UTC';
    return tzOffset(zone);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/tokens.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// The design tokens, as PURE DATA (no DOM) so every layer can share one vocabulary: the UI
// kit writes them onto its hosts, and the renderer's own chrome writes them onto the chart
// container. The chart's `VelaTheme` stays the single source of truth — there is no second
// UI palette to drift from it.
//
// STATIC tokens (spacing, radii, z-index, motion, type scale) are theme-independent;
// THEME tokens are computed per `VelaTheme`.
__turbopack_context__.s([
    "STATIC_TOKENS",
    ()=>STATIC_TOKENS,
    "themeTokens",
    ()=>themeTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/color.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
const STATIC_TOKENS = {
    '--vela-space-1': '4px',
    '--vela-space-2': '8px',
    '--vela-space-3': '12px',
    '--vela-space-4': '16px',
    '--vela-radius-sm': '4px',
    '--vela-radius-md': '6px',
    '--vela-radius-lg': '10px',
    '--vela-z-tooltip': '60',
    '--vela-z-menu': '50',
    '--vela-z-dialog': '40',
    // Form popovers portal to <body> (or a chart host) and must sit above a dialog
    // whose own stacking context may be nested inside the chart container.
    '--vela-z-popover': '6000',
    '--vela-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
    '--vela-dur-fast': '90ms',
    '--vela-dur-med': '160ms',
    '--vela-font-size-sm': '11px',
    '--vela-font-size-md': '12px',
    '--vela-font-size-lg': '14px'
};
function themeTokens(t) {
    // Elevation and hover are washes of the foreground over the chart surface, so panels
    // and menus always sit in the same color family as the chart they annotate.
    const dark = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDarkColor"])(t.background);
    const wash = (a)=>dark ? `rgba(255,255,255,${a})` : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(t.textColor, a + 0.02);
    const elevated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mix"])(t.background, dark ? '#ffffff' : t.textColor, dark ? 0.03 : 0.05);
    const bgMain = t.background;
    const bgPanel = t.bgPanel ?? (dark ? '#121215' : '#f8f9fa');
    const bgCard = t.bgCard ?? (dark ? '#232429' : '#ffffff');
    const bgBar = t.bgBar ?? (dark ? '#191a1e' : '#f1f3f5');
    const bgChip = t.bgChip ?? (dark ? '#292a2f' : '#e9ecef');
    const bgChipHover = dark ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mix"])(bgChip, '#ffffff', 0.08) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mix"])(bgChip, '#000000', 0.08);
    const bgHover = t.bgHover ?? (dark ? '#2b2d34' : wash(0.06));
    const border = t.border ?? t.borderColor;
    const textPrimary = t.textPrimary ?? (dark ? '#eeeef1' : '#000000');
    const textSecondary = t.textSecondary ?? t.textColor;
    const textMuted = t.textMuted ?? (dark ? '#46474b' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(t.textColor, 0.5));
    return {
        '--vela-font': t.fontFamily,
        '--vela-bg': t.background,
        '--vela-bg-main': bgMain,
        '--vela-bg-panel': bgPanel,
        '--vela-bg-card': bgCard,
        '--vela-bg-bar': bgBar,
        '--vela-bg-chip': bgChip,
        '--vela-bg-chip-hover': bgChipHover,
        '--vela-bg-hover': bgHover,
        '--vela-border': border,
        '--vela-border-strong': border,
        '--vela-border-soft': border,
        '--vela-border-faint': border,
        '--vela-up': t.upColor,
        '--vela-down': t.downColor,
        '--vela-danger': t.downColor,
        '--vela-up-selected-bg': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(t.upColor, 0.25),
        '--vela-volume-up': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mix"])(t.upColor, bgMain, 0.45),
        '--vela-volume-down': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mix"])(t.downColor, bgMain, 0.45),
        '--vela-text-primary': textPrimary,
        '--vela-text-secondary': textSecondary,
        '--vela-text-muted': textMuted,
        '--vela-warning': '#fde047',
        '--vela-warning-bg': '#29261a',
        '--vela-button-light-bg': textPrimary,
        '--vela-button-light-text': bgPanel,
        // Native Vela chrome bindings
        '--vela-fg': textPrimary,
        '--vela-fg-muted': textSecondary,
        '--vela-fg-faint': textMuted,
        '--vela-fg-bright': textPrimary,
        '--vela-surface': bgMain,
        '--vela-surface-elev': bgCard,
        '--vela-surface-overlay': bgCard,
        '--vela-surface-sunken': bgPanel,
        '--vela-hover': bgHover,
        '--vela-active': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(t.upColor, 0.2),
        '--vela-hover-strong': bgChipHover,
        '--vela-focus': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(textSecondary, 0.5),
        '--vela-focus-soft': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(textSecondary, 0.12),
        '--vela-separator-hover-band': dark ? 'rgba(255,255,255,0.06)' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAlpha"])(t.textColor, 0.1),
        '--vela-separator-hover-line': textSecondary,
        '--vela-scroll': bgChipHover,
        '--vela-accent': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT"],
        '--vela-accent-bright': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT_BRIGHT"],
        '--vela-highlight': __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HIGHLIGHT"],
        '--vela-selected-bg': textPrimary,
        '--vela-selected-fg': bgPanel,
        '--vela-fg-on-fill': '#ffffff',
        '--vela-shadow': '0 8px 30px rgba(0,0,0,0.5)',
        '--vela-shadow-dialog': '0 20px 60px rgba(0,0,0,0.5)',
        '--vela-backdrop': 'rgba(0,0,0,0.6)'
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/util/wall-clock.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SecondClock",
    ()=>SecondClock
]);
/** Headroom past the boundary so a timer that fires a hair early still lands in the new second. */ const BOUNDARY_SLACK_MS = 5;
class SecondClock {
    now;
    subs;
    timer;
    constructor(now = ()=>Date.now()){
        this.now = now;
        this.subs = new Set();
        this.timer = null;
    }
    onTick(cb) {
        this.subs.add(cb);
        if (this.timer == null) this.arm();
        return ()=>{
            this.subs.delete(cb);
            if (this.subs.size === 0 && this.timer != null) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        };
    }
    /** Milliseconds from `now` to just past the next second boundary. */ static delayToNextSecond(now) {
        const intoSecond = (now % 1000 + 1000) % 1000;
        return 1000 - intoSecond + BOUNDARY_SLACK_MS;
    }
    arm() {
        this.timer = setTimeout(()=>{
            this.timer = null;
            const now = this.now();
            for (const cb of this.subs)cb(now);
            if (this.subs.size > 0) this.arm();
        }, SecondClock.delayToNextSecond(this.now()));
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/visible-range.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "presetToRange",
    ()=>presetToRange
]);
const DAY_MS = 86_400_000;
const PRESET_SPAN_MS = {
    '1D': DAY_MS,
    '1W': 7 * DAY_MS,
    '1M': 30 * DAY_MS,
    '3M': 90 * DAY_MS,
    '6M': 180 * DAY_MS,
    '1Y': 365 * DAY_MS,
    '5Y': 5 * 365 * DAY_MS
};
function presetToRange(preset, bars) {
    if (bars.length === 0) return null;
    const first = bars[0].time;
    const last = bars[bars.length - 1].time;
    if (preset === 'ALL') return {
        from: first,
        to: last
    };
    let from;
    if (preset === 'YTD') {
        from = Date.UTC(new Date(last).getUTCFullYear(), 0, 1);
    } else {
        from = last - PRESET_SPAN_MS[preset];
    }
    return {
        from: Math.max(first, from),
        to: last
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_charting_core_0799hkj._.js.map