(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/charting/Vela.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Vela",
    ()=>Vela
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/options.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$EngineOrchestrator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/engine/EngineOrchestrator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$RendererControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/RendererControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$renderer$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/renderer-defaults.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$PanesControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/PanesControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$DataControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/DataControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$DrawingsControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/DrawingsControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$MarksControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/MarksControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$ReplayControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/ReplayControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$NativeRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/native/NativeRenderer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$MultiProviderFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/MultiProviderFeed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$builtins$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/chart-types/builtins.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$volume$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/volume/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$volume$2f$VolumeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/volume/VolumeIndicator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$vpvr$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/vpvr/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$vpvr$2f$VpvrIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/vpvr/VpvrIndicator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/classics/index.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const asError = (err)=>err instanceof Error ? err : new Error(String(err));
class Vela {
    orchestrator;
    rendererControl;
    panesControl;
    dataControl;
    drawingsControl;
    marksControl;
    replayControl;
    constructor(container, options = {}, deps = {}){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$builtins$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerBuiltinChartTypes"])(); // built-in chart types through the public SDK registry (idempotent)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$volume$2f$VolumeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerVolume"])(); // register the built-in native indicators (idempotent)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$vpvr$2f$VpvrIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerVpvr"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$classics$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerClassicIndicators"])();
        const element = resolveElement(container);
        const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTheme"])(options.theme);
        const display = {
            currentPriceLine: options.currentPriceLine ?? true,
            logScale: options.logScale ?? false,
            nativeBackend: options.nativeBackend ?? 'auto',
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveAnimations"])(options.animations),
            glow: options.glow ?? 0,
            upColor: options.upColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"],
            downColor: options.downColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"],
            priceStyle: options.priceStyle ?? 'candles'
        };
        const RendererClass = options.renderer ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$NativeRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NativeRenderer"];
        if (typeof RendererClass !== 'function') {
            throw new Error("[vela] options.renderer must be a renderer class, e.g. import { LwcRenderer } from " + "'vela/renderers/lwc'. The 'lwc'/'native' string options were removed.");
        }
        const renderer = deps.renderer ?? new RendererClass(display);
        const engines = deps.engines ?? [];
        // Default: a multi-provider registry feed (caches closed bars internally). No
        // provider is bundled — register one with `chart.data.registerProvider(...)`;
        // until then a symbol-backed chart parks its initial load. Inject
        // `deps.dataFeed` to source candles from your own feed (used bare, no registry).
        const feed = deps.dataFeed ?? new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$MultiProviderFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MultiProviderFeed"]();
        const config = {
            market: {
                symbol: options.symbol,
                timeframe: options.timeframe,
                bars: options.bars,
                session: options.session,
                visibleRange: options.visibleRange,
                data: options.data
            },
            live: options.live ?? false,
            theme,
            defaultLanguage: options.defaultLanguage ?? engines[0]?.language ?? 'pine',
            drawings: options.drawings,
            volume: options.volume ?? true
        };
        this.rendererControl = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$RendererControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RendererControl"](renderer);
        // The settings-dialog visibility policy is instance state, not chart config —
        // it must never ride `getConfig()`/`applyConfig()` into exported templates.
        if (options.settings) this.rendererControl.setSettingsVisibility(options.settings);
        this.dataControl = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$DataControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataControl"](feed);
        this.orchestrator = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$EngineOrchestrator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EngineOrchestrator"](element, renderer, feed, engines, config, this.dataControl);
        // Plugin-contributed renderer defaults (`registerRendererDefaults`), applied once the
        // orchestrator has mounted the renderer and before the first paint. Defaults only:
        // an explicit `renderer.set(...)` or a restored config afterwards still wins.
        const defaults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$renderer$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rendererDefaults"])();
        if (Object.keys(defaults).length > 0) this.rendererControl.set(defaults);
        this.panesControl = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$PanesControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PanesControl"](this.orchestrator);
        this.drawingsControl = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$DrawingsControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingsControl"](this.orchestrator.drawings);
        this.marksControl = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$MarksControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarksControl"](this.orchestrator.marks);
        this.replayControl = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$ReplayControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReplayControl"](this.orchestrator);
    }
    /**
     * Register a scripting engine so `addIndicator({ language })` can run that
     * language. Vela ships NO engine — install the one you need (Pine Script:
     * `@luxalgo/vela-pinets`) and register it, e.g.
     * `chart.registerEngine('pine', new PineEngine())`; without one the chart
     * displays candles, drawings and native indicators only. Re-registering a
     * language replaces it.
     */ registerEngine(language, engine) {
        this.orchestrator.registerEngine(language, engine);
        return this;
    }
    /** Run an indicator script on the chart's market data and render it. */ addIndicator(source, options) {
        return this.orchestrator.addIndicator(source, options);
    }
    /**
     * Add a built-in NATIVE indicator (core-computed, no scripting engine) by registered `type` —
     * e.g. `'vpvr'` or `'sma'`. It becomes a first-class indicator (legend row, settings, hide,
     * remove, events). Layer-backed types (`'volume'`, `'vpvr'`) are single-instance — a second
     * call returns the existing handle; the classic studies allow several instances, so each call
     * adds one more. Returns a fail-soft handle for an unregistered type. Native renderer only.
     */ addNativeIndicator(type, options) {
        return this.orchestrator.addNativeIndicator(type, options);
    }
    /**
     * The catalog of built-in native indicators with their live state on this chart — each entry's
     * `type`, `title`, whether it `supported`s the current symbol, whether it's already `present`,
     * and whether it allows several instances (`multiInstance`; otherwise a second
     * `addNativeIndicator` is a no-op). Lets a host "add indicator" UI list them, gate unsupported
     * ones, and de-duplicate the single-instance ones. Async because support may probe the
     * provider (a type may need data the symbol lacks).
     */ availableNativeIndicators() {
        return this.orchestrator.availableNativeIndicators();
    }
    /**
     * The native-indicator types PRESENT on the chart right now, one entry per instance (a
     * multi-instance type repeats) — the synchronous slice of
     * {@link availableNativeIndicators} (only support probing is async; presence never is).
     * Persistence snapshots read this: an unload-time flush must see an add/remove that
     * happened microseconds ago, which an async catalog mirror cannot guarantee.
     */ presentNativeIndicators() {
        return this.orchestrator.presentNativeIndicators();
    }
    /** Live handles of every indicator currently on the chart (script + native) — drive
     *  host panels (object trees, indicator lists) with per-id visibility/removal. */ indicators() {
        return this.orchestrator.listIndicators();
    }
    /**
     * Execute an indicator script and INJECT it only if the run succeeds — the seam for
     * host editors and consoles. Resolves `{ ok: true, handle }` after the first
     * successful evaluation, or `{ ok: false, error }` after a compile/runtime failure —
     * in which case the failed indicator is removed again (no dead legend row).
     * Never rejects.
     */ /**
     * Execute a script and resolve its FIRST computed run — the data-out door for host
     * editors, consoles and dashboards. The script is injected only if it runs (a failure
     * removes it again, leaving no dead legend row), and the result carries the run itself
     * plus the controls for what it put on the chart: `onUpdate` to follow later runs,
     * `remove` to take it off. Never rejects.
     *
     * `runScript` is `runIndicator` with the run as its payload rather than a handle to go
     * fetch from — the same relationship `script:run` has to `context:changed`.
     */ runScript(source, options) {
        let handle;
        try {
            handle = this.addIndicator(source, options);
        } catch (err) {
            // A rejected `options.id` (already live) — the "never rejects" contract turns
            // it into a structured failure, and nothing was mounted to remove.
            return Promise.resolve({
                ok: false,
                run: null,
                error: asError(err),
                onUpdate: ()=>()=>undefined,
                remove: ()=>undefined
            });
        }
        const updates = new Set();
        const drop = ()=>{
            try {
                handle.remove();
            } catch  {
            /* already torn down */ }
        };
        return new Promise((resolve)=>{
            let settled = false;
            // Resolving on the RUN, not on `ready`: the handle is announced while the model
            // mounts, whereas the run is assembled a turn later (its execution-context pull
            // may cross a worker). Waiting for the run is what makes `result.run` non-null.
            // The subscription outlives the resolution — it feeds `onUpdate` too.
            const offRun = this.on('script:run', (run)=>{
                if (run.id !== handle.id) return;
                if (settled) {
                    for (const handler of updates)handler(run);
                    return;
                }
                settled = true;
                offError();
                resolve({
                    ok: true,
                    run,
                    error: null,
                    onUpdate: (handler)=>{
                        updates.add(handler);
                        return ()=>updates.delete(handler);
                    },
                    remove: ()=>{
                        offRun();
                        updates.clear();
                        drop();
                    }
                });
            });
            const offError = handle.on('error', ({ error })=>{
                if (settled) return;
                settled = true;
                offRun();
                offError();
                drop(); // a failed script leaves no dead legend row
                resolve({
                    ok: false,
                    run: null,
                    error,
                    onUpdate: ()=>()=>undefined,
                    remove: ()=>undefined
                });
            });
        });
    }
    runIndicator(source, options) {
        let handle;
        try {
            handle = this.addIndicator(source, options);
        } catch (err) {
            return Promise.resolve({
                ok: false,
                handle: null,
                error: asError(err),
                context: null
            });
        }
        return new Promise((resolve)=>{
            const offReady = handle.on('ready', ()=>{
                offReady();
                offError();
                resolve({
                    ok: true,
                    handle,
                    error: null,
                    context: null
                });
            });
            const offError = handle.on('error', ({ error })=>{
                offReady();
                offError();
                void handle.context().catch(()=>null).then((context)=>{
                    try {
                        handle.remove();
                    } catch  {
                    /* already torn down */ }
                    resolve({
                        ok: false,
                        handle: null,
                        error,
                        context
                    });
                });
            });
        });
    }
    /**
     * Switch the chart's market IN PLACE — symbol, provider, timeframe, depth, or offline
     * data — WITHOUT destroying the chart: indicators re-execute over the new bars, native
     * indicators restart, and panes, user drawings, renderer config and event
     * subscriptions all survive. Resolves once the new market's history is painted (a
     * deep backfill continues behind it — await {@link historyComplete}); a call
     * superseded by a newer `setMarket` resolves silently. Emits `market:changed`
     * (with the previous identity) when the market identity changed.
     */ setMarket(next) {
        return this.orchestrator.setMarket(next);
    }
    /** The current market identity — the read counterpart of {@link setMarket}. A snapshot
     *  of the REQUESTED market: it reflects an in-flight switch immediately (before the
     *  new bars land). Listen to `market:changed` for committed identity changes. */ get market() {
        return this.orchestrator.marketSnapshot();
    }
    /** Resolves once the chart is painted and interactive. For a symbol-backed chart this
     *  awaits a provider being registered that resolves the symbol (the parked load). On a
     *  ranged feed the first paint is a small recent head (~200 bars) and the rest of the
     *  history keeps backfilling BEHIND this — await {@link historyComplete} for the full
     *  depth. Distinct from `chart.data.ready()`, which awaits only the provider symbol
     *  indexes. */ ready() {
        return this.orchestrator.ready();
    }
    /** Resolves once the FULL requested history has loaded (immediately for small/offline
     *  charts; after the backward backfill for deep ones — see the `history:progress` /
     *  `history:complete` events). Never rejects: on destroy or a failed backfill it
     *  resolves with whatever depth loaded. */ historyComplete() {
        return this.orchestrator.historyComplete();
    }
    /**
     * A renderer-agnostic snapshot of the graphic elements the core has generated
     * (series, fills, drawings, tables, …) — a deterministic check that a feature was
     * produced, independent of which renderer drew it.
     */ inspect() {
        return this.orchestrator.inspect();
    }
    /**
     * The active renderer's control surface. Set/read render features at runtime —
     * common ones (candle colors, `logScale`, `currentPriceLine`) and renderer-specific
     * ones (native `glow`) — with **no indicator re-run**. Unsupported keys warn and no-op:
     * `chart.renderer.set('glow', 0.6)`, `chart.renderer.set({ logScale: true })`.
     */ get renderer() {
        return this.rendererControl;
    }
    /**
     * The chart's pane control surface. List panes with the indicators each holds and
     * move/merge/reorder/collapse/maximize them: `chart.panes.list()`,
     * `chart.panes.moveIndicator(id, { newPane: true })`, `chart.panes.collapse(id)`.
     * On a renderer without pane management the mutators warn and no-op.
     */ get panes() {
        return this.panesControl;
    }
    /**
     * The chart's data control surface. Register market-data providers and query the
     * registry: `chart.data.registerProvider('binance', new BinanceProvider())`,
     * `chart.data.resolve('BTCUSDT')`, `chart.data.symbols('binance')`, and
     * `chart.data.ready()` (provider indexes settled). No provider is bundled —
     * registering the one that resolves the chart symbol fires the parked initial load
     * (await it with `chart.ready()`).
     */ get data() {
        return this.dataControl;
    }
    /**
     * The chart's user-drawings control surface. Activate tools, create/mutate
     * drawings programmatically, and persist them:
     * `chart.drawings.setTool('trendline')`, `chart.drawings.add('hline', { … })`,
     * `chart.drawings.toJSON()/fromJSON(doc)`. Always present; on a renderer without
     * the `userDrawings` capability the interactive methods warn + no-op while
     * persistence still round-trips. Enable the on-chart toolbar with
     * `new Vela(el, { drawings: true })` or `chart.drawings.showToolbar()`.
     */ get drawings() {
        return this.drawingsControl;
    }
    /**
     * The chart's timeline-marks control surface: host events pinned to a bar and shown
     * as glyphs on a lane above the time axis, each opening a popup on click —
     * `chart.marks.add({ id, time, glyph, title, content })`, `chart.marks.set(list)`,
     * `chart.marks.defineGroup({ id, label })`. Marks are data, not user state: re-supply
     * them on `market:changed`. On a renderer without the `timelineMarks` capability the
     * model still fills but nothing paints (`chart.marks.supported`).
     */ get marks() {
        return this.marksControl;
    }
    /**
     * The chart's bar-replay control surface: rewind to a past bar and reveal the
     * following ones by hand or on a timer, from the history already loaded —
     * `await chart.replay.start({ from })`, `chart.replay.play(2000)`, `chart.replay.step()`,
     * `chart.replay.stop()`. Revealed bars behave like live bars for indicators; live
     * updates pause meanwhile. Follow it with the `replay:*` events.
     */ get replay() {
        return this.replayControl;
    }
    on(event, handler) {
        return this.orchestrator.events.on(event, handler);
    }
    /** The current visible time range (`from`/`to` in epoch-ms), or null before data loads. */ getVisibleRange() {
        return this.orchestrator.getVisibleRange();
    }
    /** Set the visible time range explicitly (epoch-ms). Use for a custom date range. */ setVisibleRange(range) {
        this.orchestrator.setVisibleRange(range);
        return this;
    }
    /**
     * Pan the view by a fraction of the visible width — positive ⇒ toward the latest
     * bars, negative ⇒ into history. Behaves exactly like dragging the chart: constant
     * zoom, the same pan limits (forward stops at the newest candle plus the bounded
     * empty space), and eased on renderers that animate pans. Repeated calls stack into
     * one continuous scroll.
     */ panBy(fraction) {
        this.orchestrator.panBy(fraction);
        return this;
    }
    /**
     * Frame a named date-range preset over the loaded bars: `'1D'`, `'1W'`, `'1M'`,
     * `'3M'`, `'6M'`, `'1Y'`, `'YTD'`, or `'ALL'`. A preset deeper than the loaded
     * history simply frames everything (it doesn't fetch more bars).
     */ setVisibleRangePreset(preset) {
        this.orchestrator.setVisibleRangePreset(preset);
        return this;
    }
    resize() {
        this.orchestrator.resize();
    }
    /**
     * Swap the app theme at runtime — `'dark'`, `'light'`, or a full custom
     * {@link VelaTheme}. Re-skins the chart surface, axes, legends and in-chart chrome
     * live (no indicator re-run, no rebuild) and emits `theme:changed` with the resolved
     * theme so host chrome around the chart can follow. Explicitly customized plot
     * cosmetics (a config-set background or series color) are re-based only when they
     * were inherited from the previous theme.
     */ setTheme(theme) {
        this.orchestrator.setTheme((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTheme"])(theme));
        return this;
    }
    destroy() {
        this.orchestrator.destroy();
    }
}
function resolveElement(container) {
    if (typeof container !== 'string') return container;
    const element = document.querySelector(container);
    if (!element) throw new Error(`[vela] container not found for selector "${container}"`);
    return element;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/chart-types/builtins.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerBuiltinChartTypes",
    ()=>registerBuiltinChartTypes
]);
// Built-in chart types registered through the SAME public registry a plugin would use —
// Heikin Ashi is the reference bar-transform type. (Volume/VPVR go through the native
// indicator registry instead: they are layers over any style, not styles themselves.)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/chart-types/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$price$2d$styles$2f$heikin$2d$ashi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/price-styles/heikin-ashi.ts [app-client] (ecmascript)");
;
;
/** Singleton so the orchestrator can compare transforms by identity across style flips. */ const HEIKIN_ASHI = {
    full: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$price$2d$styles$2f$heikin$2d$ashi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heikinAshiFull"],
    next: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$price$2d$styles$2f$heikin$2d$ashi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heikinAshiNext"]
};
function registerBuiltinChartTypes() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerChartType"])({
        id: 'heikinashi',
        label: 'Heikin Ashi',
        barTransform: HEIKIN_ASHI
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/chart-types/registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// The CHART-TYPE registry — the public extension seam for price styles beyond the built-in
// five (candles, bars, line, area, baseline). A chart type may contribute:
//   - a BAR TRANSFORM: a 1:1 time-preserving view over the raw bar stream (Heikin Ashi);
//   - a DATA ENGINE: a per-chart engine that supplies the style's secondary per-bar data
//     to the renderer's native-layer channels (started/suspended as the style is
//     entered/left — the seam an order-flow style plugs into);
//   - an extended-ticker MODIFIER: `"SYM;id"` requests the transformed series from the
//     data plane (`ticker.<id>()` in scripts).
// Registration is global and idempotent-by-id (last registration wins) — plugins register
// once at import time, before or after charts are constructed.
__turbopack_context__.s([
    "chartType",
    ()=>chartType,
    "chartTypes",
    ()=>chartTypes,
    "normalizeSettingsRow",
    ()=>normalizeSettingsRow,
    "registerChartType",
    ()=>registerChartType,
    "settingsRowValueKeys",
    ()=>settingsRowValueKeys,
    "settingsRowVisible",
    ()=>settingsRowVisible,
    "tickerModifierIds",
    ()=>tickerModifierIds,
    "unregisterChartType",
    ()=>unregisterChartType
]);
function normalizeSettingsRow(r) {
    switch(r.kind){
        case 'row':
            return {
                label: r.label,
                toggle: r.toggle,
                controls: r.controls,
                when: r.when
            };
        case 'toggle':
            {
                const controls = [];
                if (r.number) controls.push({
                    kind: 'number',
                    ...r.number
                });
                for (const c of r.colors ?? [])controls.push({
                    kind: 'color',
                    ...c
                });
                if (r.width) controls.push({
                    kind: 'width',
                    ...r.width
                });
                return {
                    label: r.label,
                    toggle: {
                        key: r.key,
                        defval: r.defval
                    },
                    controls,
                    when: r.when
                };
            }
        case 'number':
            return {
                label: r.label,
                controls: [
                    {
                        kind: 'number',
                        key: r.key,
                        label: r.label,
                        defval: r.defval,
                        min: r.min,
                        max: r.max,
                        step: r.step
                    }
                ],
                when: r.when
            };
        case 'color':
            return {
                label: r.label,
                controls: [
                    {
                        kind: 'color',
                        key: r.key,
                        label: r.label,
                        defval: r.defval
                    }
                ],
                when: r.when
            };
        case 'select':
            return {
                label: r.label,
                controls: [
                    {
                        kind: 'select',
                        key: r.key,
                        label: r.label,
                        options: r.options,
                        defval: r.defval
                    }
                ],
                when: r.when
            };
        case 'range':
            return {
                label: r.label,
                controls: [
                    {
                        kind: 'number',
                        key: r.minKey,
                        label: `${r.label} — min`,
                        defval: r.defval,
                        min: r.min,
                        max: r.max,
                        step: r.step,
                        placeholder: r.placeholder
                    },
                    {
                        kind: 'hint',
                        text: '–'
                    },
                    {
                        kind: 'number',
                        key: r.maxKey,
                        label: `${r.label} — max`,
                        defval: r.defval,
                        min: r.min,
                        max: r.max,
                        step: r.step,
                        placeholder: r.placeholder
                    }
                ],
                when: r.when
            };
    }
}
function settingsRowValueKeys(r) {
    if (r.kind === 'heading' || r.kind === 'header') return [];
    const n = normalizeSettingsRow(r);
    const keys = [];
    if (n.toggle) keys.push({
        key: n.toggle.key,
        type: 'boolean',
        defval: n.toggle.defval
    });
    for (const c of n.controls){
        if (c.kind === 'hint') continue;
        if (c.kind === 'color' || c.kind === 'select') keys.push({
            key: c.key,
            type: 'string',
            defval: c.defval
        });
        else keys.push({
            key: c.key,
            type: 'number',
            defval: c.defval
        });
    }
    return keys;
}
function settingsRowVisible(when, bag) {
    if (!when) return true;
    const conds = Array.isArray(when) ? when : [
        when
    ];
    return conds.every((c)=>c.anyOf ? c.anyOf.some((x)=>x === bag[c.key]) : bag[c.key] === c.equals);
}
const registry = new Map();
function registerChartType(def) {
    registry.set(def.id, def);
}
function unregisterChartType(id) {
    registry.delete(id);
}
function chartType(id) {
    return typeof id === 'string' ? registry.get(id) : undefined;
}
function chartTypes() {
    return [
        ...registry.values()
    ];
}
function tickerModifierIds() {
    return [
        ...registry.values()
    ].filter((d)=>d.tickerModifier ?? d.barTransform != null).map((d)=>d.id);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/BarStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarStore",
    ()=>BarStore,
    "seriesKey",
    ()=>seriesKey,
    "sharedBarStore",
    ()=>sharedBarStore
]);
function seriesKey(provider, symbol, timeframe, session) {
    return `${provider}|${symbol}|${timeframe}${session && session !== 'regular' ? `|${session}` : ''}`;
}
function symbolOf(key) {
    return key.split('|')[1] ?? '';
}
class BarStore {
    series = new Map();
    /** Earliest bar-open time fetched for a series — what the cache actually covers. */ coveredFrom = new Map();
    currentSymbol;
    /** Symbols protected from the current-symbol purge (multi-chart cells) — the UNION
     *  of every owner's declaration. Empty = legacy single-chart behavior. */ retained = new Set();
    /** Per-owner declarations behind {@link retained} — several shells on one page must
     *  not clobber (or, on destroy, evict) each other's protected symbols. */ retainedByOwner = new Map();
    get(key) {
        return this.series.get(key);
    }
    /**
     * Record that the series is covered back to `from`. Tracks the EARLIEST such
     * time — what's been fetched, not what bar boundary happens to align. The
     * coverage check uses this instead of the first cached bar's time (which is
     * always at/after the requested `from`, so it can never prove coverage).
     */ markCovered(key, from) {
        this.coveredFrom.set(key, Math.min(this.coveredFrom.get(key) ?? Infinity, from));
    }
    /** The earliest time the series is covered back to, or undefined if never fetched. */ coveredFromOf(key) {
        return this.coveredFrom.get(key);
    }
    /** Merge `bars` into the series (dedup by time, incoming wins); keeps it sorted. Returns the merged set. */ merge(key, bars) {
        if (bars.length === 0) return this.series.get(key) ?? [];
        const byTime = new Map();
        for (const b of this.series.get(key) ?? [])byTime.set(b.time, b);
        for (const b of bars)byTime.set(b.time, b);
        const merged = [
            ...byTime.values()
        ].sort((a, b)=>a.time - b.time);
        this.series.set(key, merged);
        return merged;
    }
    /**
     * Scope the cache to the current chart symbol. Idempotent per symbol: only
     * purges other-symbol series when the symbol actually CHANGES — so secondary
     * series (request.security cross-symbol/HTF/LTF) fetched during a run survive
     * re-runs of the same chart, and are dropped only when the chart symbol flips.
     * Symbols declared via {@link retain} are never purged.
     */ retainSymbol(symbol) {
        if (this.currentSymbol === symbol) return;
        this.currentSymbol = symbol;
        this.purgeOutside(symbol);
    }
    /**
     * Declare the set of symbols a multi-chart workspace is displaying (CANONICAL
     * tickers, post-registry resolution — `chart.data.resolve(sym).ticker`). These
     * survive every {@link retainSymbol} purge, so cells loading different symbols
     * stop evicting each other's history. Replaces the previous set FOR THAT OWNER
     * (pass the shell instance as `owner`; several shells on one page keep separate
     * declarations, the effective set is their union) and purges anything now outside
     * the union ∪ {currentSymbol} immediately. An empty set releases the owner's
     * declaration — with no owners left, the legacy single-chart policy is back.
     * Note: SECONDARY symbols a script fetches (`request.security` cross-symbol) are
     * not in this set and still drop on cross-cell loads — correctness is unaffected
     * (they re-fetch on demand).
     */ retain(symbols, owner = 'default') {
        if (symbols.size === 0) this.retainedByOwner.delete(owner);
        else this.retainedByOwner.set(owner, new Set(symbols));
        const union = new Set();
        for (const set of this.retainedByOwner.values())for (const s of set)union.add(s);
        this.retained = union;
        this.purgeOutside(this.currentSymbol);
    }
    /** Drop every series whose symbol is neither `current` nor retained. */ purgeOutside(current) {
        for (const key of [
            ...this.series.keys()
        ]){
            const sym = symbolOf(key);
            if (sym !== current && !this.retained.has(sym)) {
                this.series.delete(key);
                this.coveredFrom.delete(key);
            }
        }
    }
    clear() {
        this.series.clear();
        this.coveredFrom.clear();
    }
}
const sharedBarStore = new BarStore();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/CachingDataFeed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CachingDataFeed",
    ()=>CachingDataFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$BarStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/BarStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/ProviderRegistry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/timeframe.ts [app-client] (ecmascript)");
;
;
;
/** Series cache key — the symbol's own grammar carries the venue: a `provider:` prefix
 *  keys per venue (the multi-provider feed hands canonical prefixed symbols down); a
 *  bare symbol keys venue-less, whatever serves it (single-feed setups). A non-default
 *  session keys its own series (regular and extended bars genuinely differ). */ function cacheKey(symbol, timeframe, session) {
    const { provider, ticker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSymbol"])(symbol);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$BarStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seriesKey"])(provider ?? '', ticker, timeframe, session);
}
/** Page size for big ranged fetches (mirrors the orchestrator's history chunks). */ const PAGE_BARS = 10_000;
/**
 * At/below this a ranged fetch stays a SINGLE request. One above {@link PAGE_BARS} so the
 * orchestrator's own backfill chunks (`CHUNK_BARS + 1` for the overlap bar) never split.
 */ const SINGLE_FETCH_BARS = PAGE_BARS + 1;
class CachingDataFeed {
    inner;
    store;
    constructor(inner, store = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$BarStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sharedBarStore"]){
        this.inner = inner;
        this.store = store;
    }
    async load(cfg) {
        // Offline data is already in memory — nothing to cache.
        if (cfg.data && cfg.data.length > 0) return this.inner.load(cfg);
        const symbol = cfg.symbol ?? 'TEST';
        const key = cacheKey(symbol, cfg.timeframe ?? '60', cfg.session);
        this.store.retainSymbol(symbol); // current-symbol-only purge
        const cached = this.store.get(key);
        const n = cfg.bars ?? 500;
        // Tail-only path: enough closed history is cached to cover the requested
        // window (`n - 1` accounts for the forming bar we always drop). Fetch just
        // the tail from the last cached bar and merge.
        const lastCached = cached?.[cached.length - 1];
        if (cached && lastCached && cached.length >= n - 1 && this.inner.loadRange) {
            const { bars: tail } = await this.fetchRange(cfg, {
                from: lastCached.time
            });
            const closed = this.store.merge(key, dropForming(tail));
            return attachForming(closed, tail[tail.length - 1]).slice(-n);
        }
        // Cold path / requested more than cached: full fetch, cache the closed bars.
        const bars = await this.inner.load(cfg);
        this.store.merge(key, dropForming(bars));
        return bars;
    }
    /**
     * Progressive twin of {@link load}: a COLD load streams through the inner feed's
     * progressive path — batches forwarded verbatim, the FINAL answer cached exactly as
     * `load` caches — while a cache-covered load answers once through `load` itself (a
     * warm chart has nothing to stream). Falls back to `load` wholesale when the inner
     * feed lacks the capability, so callers may prefer this method unconditionally.
     */ async loadProgressive(cfg, onBatch, opts) {
        if (cfg.data && cfg.data.length > 0) return this.inner.load(cfg);
        if (!this.inner.loadProgressive) return null;
        const symbol = cfg.symbol ?? 'TEST';
        const key = cacheKey(symbol, cfg.timeframe ?? '60', cfg.session);
        const cached = this.store.get(key);
        const n = cfg.bars ?? 500;
        const lastCached = cached?.[cached.length - 1];
        if (cached && lastCached && cached.length >= n - 1 && this.inner.loadRange) return this.load(cfg); // warm: the tail-merge path
        this.store.retainSymbol(symbol);
        const bars = await this.inner.loadProgressive(cfg, onBatch, opts);
        if (bars == null) return null; // the resolved provider turned out incapable
        this.store.merge(key, dropForming(bars));
        return bars;
    }
    /**
     * Cache-backed ranged fetch — the gateway engines use for secondary series
     * (`request.security` HTF/LTF/cross-symbol) and the orchestrator's backward
     * history chunks. Caches per `(provider, symbol, timeframe)` in the shared
     * store. Three cache-friendly shapes:
     * - **historical** (`to` before the cached tip): served straight from cache
     *   when it provably holds the window, else fetched whole (and cached — no
     *   forming bar can exist there);
     * - **backward extension** (`from` older than coverage): fetch ONLY the
     *   missing head, never the already-covered remainder again;
     * - **tail** (everything else covered): refresh only from the last cached bar.
     * Falls back to a full `load` when the inner feed has no ranged support.
     */ async loadRange(cfg, range) {
        if (!this.inner.loadRange) return this.inner.load(cfg);
        const key = cacheKey(cfg.symbol ?? 'TEST', cfg.timeframe ?? '60', cfg.session);
        let cached = this.store.get(key);
        let newest = cached?.[cached.length - 1];
        // Historical request — strictly older than the cached tip. The tail path can
        // never serve it (it only extends the NEWEST edge; before this branch existed,
        // a count-bounded `{to, limit}` walk would read "covered" off the bar COUNT and
        // return the whole cache unfiltered, so a backward chunk loop never progressed).
        if (range.to != null && newest && range.to < newest.time) {
            const older = cached.filter((b)=>b.time <= range.to);
            const covFrom = this.store.coveredFromOf(key) ?? Infinity;
            const covered = range.limit != null ? older.length >= range.limit && (range.from == null || covFrom <= range.from) : range.from != null && covFrom <= range.from;
            if (covered) {
                let out = range.from != null ? older.filter((b)=>b.time >= range.from) : older;
                if (range.limit != null && out.length > range.limit) out = out.slice(-range.limit);
                return out;
            }
            // Every bar at/before `to` predates the cached tip → closed → cache whole.
            // The `to` filter guards against providers that over-serve past the bound.
            const fetched = await this.fetchRange(cfg, range);
            const bars = fetched.bars.filter((b)=>b.time <= range.to);
            if (bars.length > 0) {
                this.store.merge(key, bars);
                this.store.markCovered(key, fetched.coveredDownTo ?? bars[0].time);
            }
            return bars;
        }
        // Backward extension: the request reaches OLDER than coverage — fetch only the
        // missing head `[from, coveredFrom]`, merge, and serve the rest from cache below
        // (a re-run over deepened history must never re-download the covered middle).
        if (newest && range.from != null) {
            const covFrom = this.store.coveredFromOf(key);
            if (covFrom != null && covFrom > range.from) {
                const { bars: head, coveredDownTo } = await this.fetchRange(cfg, {
                    from: range.from,
                    to: covFrom
                });
                this.store.merge(key, head.filter((b)=>b.time <= covFrom)); // capped at the covered edge → closed
                this.store.markCovered(key, coveredDownTo ?? range.from);
                cached = this.store.get(key);
                newest = cached?.[cached.length - 1];
            }
        }
        const coveredFrom = this.store.coveredFromOf(key);
        // Tail-only path: the cache was fetched from at/before the requested `from`
        // (or holds enough bars when the request is count-bounded with no `from`).
        // Uses the recorded covered-from, NOT the first cached bar's time — that's
        // always at/after `from`, so it can never prove coverage (the HTF-warmup bug).
        const covers = !!cached && cached.length > 0 && !!newest && (range.from != null ? coveredFrom != null && coveredFrom <= range.from : range.limit == null || cached.length >= range.limit);
        if (covers && newest) {
            const { bars: tail } = await this.fetchRange(cfg, {
                from: newest.time,
                to: range.to,
                limit: range.limit
            });
            const closed = this.store.merge(key, dropForming(tail));
            const full = attachForming(closed, tail[tail.length - 1]);
            let out = range.from != null ? full.filter((b)=>b.time >= range.from) : full;
            if (range.to != null) out = out.filter((b)=>b.time <= range.to);
            return out;
        }
        // Miss: fetch the requested range, cache its closed bars, and record coverage.
        const { bars, coveredDownTo } = await this.fetchRange(cfg, range);
        this.store.merge(key, dropForming(bars));
        this.store.markCovered(key, coveredDownTo ?? range.from ?? bars[0]?.time ?? 0);
        return bars;
    }
    /**
     * THE provider round-trip chokepoint for ranged fetches. Two jobs:
     * - Every request goes out with an **explicit `limit`** — some sources clip a
     *   limit-less request to a small default window and tail-slice, silently
     *   truncating wide date-bounded fetches (the `request.security` bug).
     * - A request bigger than one page walks **backward in bounded pages**, so a
     *   multi-hundred-thousand-bar series arrives as digestible responses instead
     *   of one giant clip-prone payload.
     * Returns ascending merged bars plus the oldest time the walk PROVED
     * (`coveredDownTo`) — honest coverage marking: a count-satisfied early stop
     * must never claim the requested `from`.
     */ async fetchRange(cfg, range) {
        const tfMs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeToMs"])(cfg.timeframe ?? '60');
        const estimate = estimateBars(range, tfMs);
        if (estimate <= SINGLE_FETCH_BARS) {
            const bars = await this.inner.loadRange(cfg, {
                ...range,
                limit: range.limit ?? estimate
            });
            return {
                bars,
                coveredDownTo: range.from ?? bars[0]?.time
            };
        }
        // Backward count-paged walk from the newest edge.
        const byTime = new Map();
        let cursor = range.to ?? Date.now();
        for(;;){
            if (range.from != null && cursor < range.from) break;
            const want = range.limit != null ? range.limit - byTime.size : PAGE_BARS;
            if (want <= 0) break;
            const page = await this.inner.loadRange(cfg, {
                to: cursor,
                limit: Math.min(PAGE_BARS, want)
            });
            let oldest = Infinity;
            for (const b of page){
                if (b.time < oldest) oldest = b.time;
                if (b.time <= cursor && (range.from == null || b.time >= range.from)) byTime.set(b.time, b);
            }
            if (page.length === 0) {
                // Empty-page semantics differ by source: a count-based provider spans quiet
                // gaps, so empty means nothing older exists (stop — the genesis signal). A
                // time-window source can return an empty WINDOW inside a legit gap — with a
                // `from` bound we keep stepping the window down (a genesis-aware server
                // answers pre-genesis steps locally, so this stays cheap).
                if (range.from == null) break;
                cursor -= PAGE_BARS * tfMs;
                continue;
            }
            if (oldest - 1 >= cursor) break; // defensive: no backward progress
            cursor = oldest - 1;
        }
        const bars = [
            ...byTime.values()
        ].sort((a, b)=>a.time - b.time);
        // Proven floor: a from-bounded walk that ran out the bottom covered down to `from`;
        // an early stop only proves down to the oldest bar actually seen.
        const walkedOut = range.from != null && cursor < range.from;
        return {
            bars,
            coveredDownTo: walkedOut ? range.from : bars[0]?.time
        };
    }
    subscribe(cfg, onBar) {
        return this.inner.subscribe(cfg, onBar);
    }
    symbolInfo(cfg) {
        return this.inner.symbolInfo?.(cfg);
    }
}
/**
 * Estimated bar count of a range — drives single-vs-paged and the explicit limit put on
 * date-bounded requests. The 1.1× + 2 slack absorbs variable-length periods (calendar
 * months on 'M') and the forming bar, so a computed limit can never under-serve.
 */ function estimateBars(range, tfMs) {
    if (range.limit != null) return range.limit;
    if (range.from == null) return PAGE_BARS; // unbounded and unlimited — page-sized default
    const span = Math.max(0, (range.to ?? Date.now()) - range.from);
    return Math.ceil(span / tfMs * 1.1) + 2;
}
/** Drop the last bar — treated as the forming/in-progress candle, never cached. */ function dropForming(bars) {
    return bars.length > 0 ? bars.slice(0, -1) : bars;
}
/** Re-attach the live forming bar to the closed set for display (if it's genuinely newer). */ function attachForming(closed, forming) {
    if (!forming) return closed;
    const last = closed[closed.length - 1];
    return !last || forming.time > last.time ? [
        ...closed,
        forming
    ] : closed;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/MultiProviderFeed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MultiProviderFeed",
    ()=>MultiProviderFeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/ProviderRegistry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$CachingDataFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/CachingDataFeed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$BarStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/BarStore.ts [app-client] (ecmascript)");
;
;
;
/** (Reserved) cadence of a shared secondary-data poll fallback. */ /** Retry cadence while a subscription's symbol is still unresolvable (index settling). */ const RESOLVE_RETRY_MS = 500;
/** Bar duration in ms for a timeframe (Pine resolution code or `1h`-style) — offline tick cadence. */ function intervalMs(timeframe) {
    const map = {
        '1m': 60_000,
        '3m': 180_000,
        '5m': 300_000,
        '15m': 900_000,
        '30m': 1_800_000,
        '1h': 3_600_000,
        '2h': 7_200_000,
        '4h': 14_400_000,
        '1d': 86_400_000,
        '1w': 604_800_000,
        '1M': 2_592_000_000,
        '1': 60_000,
        '5': 300_000,
        '15': 900_000,
        '30': 1_800_000,
        '60': 3_600_000,
        '240': 14_400_000,
        D: 86_400_000,
        W: 604_800_000,
        M: 2_592_000_000
    };
    return map[timeframe] ?? 3_600_000;
}
class MultiProviderFeed {
    registry = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProviderRegistry"]();
    cache;
    /** The chart symbol's resolved provider — the default for bare secondary symbols. */ primaryProvider = null;
    /** A copy of offline history, used to synthesize ticks for the `data` path. */ liveBars = [];
    /** Sync-accessible symbol metadata, warmed by load()/symbolInfoFor (the engine reads it synchronously). */ symInfoCache = new Map();
    /** Requests in flight, keyed like the cache — every concurrent asker shares one round trip. */ symInfoInflight = new Map();
    constructor(store = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$BarStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sharedBarStore"]){
        this.cache = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$CachingDataFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CachingDataFeed"](new RegistryFetchFeed(this.registry), store);
    }
    // ── Registry surface (driven by chart.data / DataControl) ──────────────
    registerProvider(name, provider) {
        return this.registry.register(name, provider);
    }
    unregisterProvider(name) {
        this.registry.unregister(name);
    }
    providers() {
        return this.registry.names().map((n)=>this.registry.infoOf(n));
    }
    resolveSymbol(raw) {
        return this.registry.resolve(raw, {
            default: this.primaryProvider
        });
    }
    /**
     * The DISPLAY prefix for `raw` — the descriptor's LISTING prefix when the data
     * declares one (`NASDAQ` for AAPL), else the resolved provider name. Null while
     * nothing resolves the symbol.
     */ displayPrefix(raw) {
        const resolved = this.resolveSymbol(raw);
        return resolved ? this.registry.displayPrefixOf(resolved) : null;
    }
    /** The canonical `PREFIX:TICKER` form of `raw`, or null while unresolvable. */ canonicalSymbol(raw) {
        const resolved = this.resolveSymbol(raw);
        return resolved ? this.registry.canonicalSymbol(resolved) : null;
    }
    /** The registered provider INSTANCE under `name` (undefined if unknown). */ providerInstance(name) {
        return this.registry.get(name);
    }
    /** The icon URL for a DESCRIPTOR — its owning provider's `resolveSymbolIcon` (picker rows). */ symbolIconOf(d) {
        return this.registry.symbolIconOf(d);
    }
    /** The icon URL for a raw SYMBOL string — resolve, then route (statusline, object tree). */ symbolIcon(raw) {
        return this.registry.symbolIcon(this.resolveSymbol(raw));
    }
    symbols(name) {
        return this.registry.symbolsOf(name);
    }
    /** Told when a symbol stays unservable by everything registered (the load is parked). */ onUnresolved(cb) {
        return this.registry.onUnresolved(cb);
    }
    /** Abandon parked waits — a destroyed chart must not keep listeners on the registry. */ destroy() {
        this.registry.cancelWaits();
    }
    /** Resolves when every registered provider's eager index has settled. */ ready() {
        return this.registry.indexReady();
    }
    /** Async per-symbol metadata (the facade's `chart.data.symbolInfo`); also warms the sync cache. */ async symbolInfoFor(raw) {
        const resolved = this.registry.resolve(raw, {
            default: this.primaryProvider
        });
        if (!resolved) return undefined;
        return this.fetchSymbolInfo(resolved);
    }
    /**
     * One round trip per symbol, shared. A market switch probes this metadata from five
     * places at once (the bar load's prefetch, the renderer's tick size, the market-status
     * badge, the session shading, the session toggle) — without the in-flight map each
     * would open its own request for the same answer, and the last one to land decided how
     * late the chrome settled.
     *
     * Cached for {@link SYMBOL_INFO_TTL_MS}: this metadata is stable within a session
     * (tick size, session vocabulary, listing prefix), but not immutable — a continuous
     * futures row rolls its current contract — so the entry expires rather than pinning the
     * session's first answer forever. A failed probe is NOT remembered: the next asker retries.
     */ fetchSymbolInfo(resolved) {
        const key = symKey(resolved);
        const hit = this.symInfoCache.get(key);
        if (hit && Date.now() - hit.at < SYMBOL_INFO_TTL_MS) return Promise.resolve(hit.info);
        const inflight = this.symInfoInflight.get(key);
        if (inflight) return inflight;
        const getSymbolInfo = this.registry.get(resolved.provider)?.getSymbolInfo;
        if (!getSymbolInfo) return Promise.resolve(undefined);
        const p = Promise.resolve(getSymbolInfo.call(this.registry.get(resolved.provider), resolved.ticker)).then((info)=>{
            if (info) this.symInfoCache.set(key, {
                info,
                at: Date.now()
            });
            return info;
        }).finally(()=>{
            this.symInfoInflight.delete(key);
        });
        this.symInfoInflight.set(key, p);
        return p;
    }
    /**
     * Per-symbol capabilities, resolved through the owning provider's `capabilitiesFor`
     * refinement (an instrument may support more than its provider-wide baseline), falling back to the
     * provider-wide `info()` capabilities. Null when nothing resolves the symbol.
     */ capabilitiesFor(raw) {
        const resolved = this.registry.resolve(raw, {
            default: this.primaryProvider
        });
        if (!resolved) return null;
        const provider = this.registry.get(resolved.provider);
        if (!provider) return null;
        return provider.capabilitiesFor?.(resolved.ticker) ?? this.registry.infoOf(resolved.provider).capabilities;
    }
    // ── MarketDataFeed ─────────────────────────────────────────────────────
    async load(cfg) {
        if (cfg.data && cfg.data.length > 0) {
            this.liveBars = cfg.data.map((b)=>({
                    ...b
                }));
            return cfg.data;
        }
        const resolved = await this.registry.whenResolvable(rawSymbol(cfg), {
            default: this.primaryProvider
        });
        // The chart's provider FOLLOWS its market: after a switch to another venue, bare
        // secondary symbols and the metadata/capability probes must default to the venue now on
        // screen — latching the first one made every later probe answer for the wrong venue.
        this.primaryProvider = resolved.provider;
        // Warm symbol metadata for the engine. Fire-and-forget: one small request that
        // typically lands before the (heavier, paginated) bar load finishes.
        this.prefetchSymbolInfo(resolved);
        return this.cache.load(canonical(cfg, resolved));
    }
    /** Progressive twin of {@link load} — same resolution, the cache streams the batches. */ async loadProgressive(cfg, onBatch, opts) {
        if (cfg.data && cfg.data.length > 0) {
            this.liveBars = cfg.data.map((b)=>({
                    ...b
                }));
            return cfg.data;
        }
        const resolved = await this.registry.whenResolvable(rawSymbol(cfg), {
            default: this.primaryProvider
        });
        this.primaryProvider = resolved.provider;
        this.prefetchSymbolInfo(resolved);
        return this.cache.loadProgressive(canonical(cfg, resolved), onBatch, opts);
    }
    /**
     * Synchronous per-symbol metadata for engines (Pine `syminfo.*`), served from the cache
     * warmed by load(). Undefined until the prefetch lands (the engine then synthesizes a
     * fallback) and real thereafter — the MarketDataFeed port is synchronous by contract.
     */ symbolInfo(cfg) {
        if (cfg.data && cfg.data.length > 0) return undefined;
        const resolved = this.registry.resolve(rawSymbol(cfg), {
            default: this.primaryProvider
        });
        // Whatever its age: this is the SYNC door (Pine `syminfo.*`, the price scale's tick
        // size), and the last known answer always beats none while a refresh is in flight.
        return resolved ? this.symInfoCache.get(symKey(resolved))?.info : undefined;
    }
    prefetchSymbolInfo(resolved) {
        void this.fetchSymbolInfo(resolved).catch(()=>{});
    }
    async loadRange(cfg, range) {
        if (cfg.data && cfg.data.length > 0) return this.cache.loadRange(cfg, range);
        // Secondary series (request.security): resolve its OWN prefix, with the chart
        // provider as the bare default. Unresolvable ⇒ empty (the engine degrades).
        const resolved = this.registry.resolve(rawSymbol(cfg), {
            default: this.primaryProvider
        });
        if (!resolved) return [];
        return this.cache.loadRange(canonical(cfg, resolved), range);
    }
    subscribe(cfg, onBar) {
        if (cfg.data && cfg.data.length > 0) return this.synthesizeTicks(cfg, onBar);
        const resolved = this.registry.resolve(rawSymbol(cfg), {
            default: this.primaryProvider
        });
        if (!resolved) return ()=>{};
        return this.cache.subscribe(canonical(cfg, resolved), onBar);
    }
    /**
     * Synthesize price-relative ticks for offline `data` runs (no network), so the
     * forming-candle path is exercised at any price scale. Mirrors the bundled
     * provider feed's offline behavior.
     */ synthesizeTicks(cfg, onBar) {
        if (this.liveBars.length === 0) return ()=>{};
        const step = intervalMs(cfg.timeframe ?? '60');
        const timer = setInterval(()=>{
            const bars = this.liveBars;
            const forming = bars[bars.length - 1];
            if (!forming) return;
            const jitter = forming.close * 0.0015 * (Math.random() - 0.5) * 2; // ±0.15% of price
            const close = Math.max(0, forming.close + jitter);
            const updated = {
                ...forming,
                close,
                high: Math.max(forming.high, close),
                low: Math.min(forming.low, close)
            };
            bars[bars.length - 1] = updated;
            onBar(updated);
            if (Math.random() < 0.12) {
                const next = {
                    time: updated.time + step,
                    open: updated.close,
                    high: updated.close,
                    low: updated.close,
                    close: updated.close,
                    volume: 0
                };
                bars.push(next);
                onBar(next);
            }
        }, 1000);
        return ()=>clearInterval(timer);
    }
}
/**
 * The raw symbol string the registry parses. Only an EXPLICIT `provider:` prefix written
 * into the symbol survives — that one is a hard requirement (the caller named a venue, so
 * the load parks until it registers). The `provider` OPTION is merely the DEFAULT and
 * travels separately, as `opts.default`: welding it in as a prefix made an unregistered
 * default POISON every symbol — the chart could then never resolve anything, not even
 * after the user switched to a symbol a registered provider serves.
 */ function rawSymbol(cfg) {
    return cfg.symbol ?? '';
}
/** Rewrite the config to the canonical PREFIXED symbol (`provider:TICKER`) — the one
 *  symbol grammar carries the resolved identity through the cache and the inner feed. */ function canonical(cfg, resolved) {
    return {
        ...cfg,
        symbol: `${resolved.provider}:${resolved.ticker}`
    };
}
/** Cache key for resolved symbol metadata. */ /** Cache key of a resolved symbol. The TICKER is case-folded because `resolve` keeps the
 *  CALLER's spelling (`btcusdt` and `BTCUSDT` both resolve, unchanged) while the registry
 *  indexes them as one symbol — without the fold each spelling would fetch its own copy. */ function symKey(resolved) {
    return `${resolved.provider}|${resolved.ticker.trim().toUpperCase()}`;
}
/** How long a symbol-metadata answer stays fresh (see {@link MultiProviderFeed.fetchSymbolInfo}). */ const SYMBOL_INFO_TTL_MS = 10 * 60_000;
/**
 * Call a provider's getBars defensively: a throwing provider yields an empty result + a
 * warning, never a rejected load. Keeps the initial fetch as fault-tolerant as the live
 * poll (which already swallows transient errors) — a bad symbol or network blip empties
 * the chart instead of rejecting the parked load.
 */ async function safeBars(provider, ticker, tf, range) {
    try {
        return await provider.getBars(ticker, tf, range);
    } catch (e) {
        console.warn(`[vela] data fetch failed for ${ticker} ${tf} — ${e instanceof Error ? e.message : String(e)}`);
        return [];
    }
}
/**
 * The cache's inner feed: given a CANONICAL config (provider name + ticker already
 * resolved), look the provider up and call its neutral `getBars` / `subscribe`.
 * Live ticks use the provider's `subscribe` if it has one, else a generic 3s poll.
 */ class RegistryFetchFeed {
    registry;
    constructor(registry){
        this.registry = registry;
    }
    load(cfg) {
        const { provider: name, ticker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSymbol"])(cfg.symbol ?? '');
        const provider = this.registry.get(name ?? '');
        if (!provider) return Promise.resolve([]);
        return safeBars(provider, ticker, cfg.timeframe ?? '60', {
            limit: cfg.bars ?? 500,
            session: cfg.session
        });
    }
    async loadProgressive(cfg, onBatch, opts) {
        const { provider: name, ticker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSymbol"])(cfg.symbol ?? '');
        const provider = this.registry.get(name ?? '');
        if (!provider) return [];
        if (!provider.getBarsProgressive) return null; // incapable — the caller keeps its own paths
        try {
            return await provider.getBarsProgressive(ticker, cfg.timeframe ?? '60', {
                limit: cfg.bars ?? 500,
                session: cfg.session
            }, onBatch, opts);
        } catch (e) {
            // Same fault posture as `safeBars`: a throwing provider empties the chart,
            // never rejects the load — batches already painted stay painted.
            console.warn(`[vela] progressive fetch failed for ${ticker} ${cfg.timeframe ?? '60'} — ${e instanceof Error ? e.message : String(e)}`);
            return [];
        }
    }
    loadRange(cfg, range) {
        const { provider: name, ticker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSymbol"])(cfg.symbol ?? '');
        const provider = this.registry.get(name ?? '');
        if (!provider) return Promise.resolve([]);
        return safeBars(provider, ticker, cfg.timeframe ?? '60', {
            ...range,
            session: cfg.session
        });
    }
    subscribe(cfg, onBar) {
        const { provider: name, ticker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSymbol"])(cfg.symbol ?? '');
        const provider = this.registry.get(name ?? '');
        if (!provider) return ()=>{};
        const tf = cfg.timeframe ?? '60';
        if (provider.subscribe) return provider.subscribe(ticker, tf, onBar, cfg.session ? {
            session: cfg.session
        } : undefined);
        let stopped = false;
        let timer = null;
        const poll = async ()=>{
            if (stopped) return;
            try {
                // Last two bars: the (possibly just-closed) previous bar and the forming
                // one. onBar dedupes by time, so the older one is harmless.
                const bars = await provider.getBars(ticker, tf, {
                    limit: 2,
                    session: cfg.session
                });
                // Re-check AFTER the await: an unsubscribe during the fetch (a market
                // switch) must not push the OLD market's bars into the new series — on the
                // same timeframe the forming bar shares its open time, so a stale bar would
                // silently REPLACE the new market's forming candle.
                if (stopped) return;
                for (const b of bars)onBar(b);
            } catch  {
            // transient error — keep polling
            }
            if (!stopped) timer = setTimeout(()=>void poll(), 3000);
        };
        timer = setTimeout(()=>void poll(), 3000);
        return ()=>{
            stopped = true;
            if (timer) clearTimeout(timer);
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/ProviderRegistry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProviderRegistry",
    ()=>ProviderRegistry,
    "parseSymbol",
    ()=>parseSymbol
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$groups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/symbol-groups.ts [app-client] (ecmascript)");
;
const normName = (n)=>n.trim().toLowerCase();
const normTicker = (t)=>t.trim().toUpperCase();
function parseSymbol(raw) {
    const s = raw.trim();
    const m = /^(?:([A-Za-z0-9_.]+):)?(.+)$/.exec(s);
    if (!m) return {
        provider: null,
        ticker: s
    };
    const provider = m[1] ? normName(m[1]) : null;
    const ticker = m[2];
    const dot = ticker.lastIndexOf('.');
    const ext = dot > 0 ? ticker.slice(dot + 1) : undefined;
    return {
        provider,
        ticker,
        ext
    };
}
class ProviderRegistry {
    /** Insertion order = registration order (relied on by bare resolution). */ entries = new Map();
    /** Listeners fired on any registry change; `settled` = an index build just finished. */ changeListeners = new Set();
    /** Cancellers for the currently parked `whenResolvable` waits. */ waits = new Set();
    /** Listeners told when a parked symbol stays unresolvable after an index settles. */ unresolvedCbs = new Set();
    /** Register (or replace) a provider; returns a promise that settles when its index is built. */ register(rawName, provider) {
        const name = normName(rawName);
        const entry = {
            name,
            provider,
            index: null,
            prefixIndex: null,
            byTicker: null,
            descriptors: [],
            settled: false,
            settle: Promise.resolve()
        };
        this.entries.set(name, entry);
        entry.settle = this.buildIndex(entry);
        // Re-check parked loads on the next microtask — batches a synchronous burst of
        // registrations so a multi-provider bare symbol isn't resolved against the first
        // one before the rest are in. Explicit `name:SYMBOL` resolves here (no index wait).
        queueMicrotask(()=>this.notify(false));
        return entry.settle;
    }
    async buildIndex(entry) {
        // Always yield once so a synchronous burst of registrations is fully in place
        // before the first index settles (keeps multi-provider resolution well-defined).
        await Promise.resolve();
        try {
            if (entry.provider.listSymbols) {
                const symbols = await entry.provider.listSymbols();
                entry.descriptors = symbols;
                entry.index = new Set(symbols.map((s)=>normTicker(s.ticker)));
                entry.byTicker = new Map(symbols.map((s)=>[
                        normTicker(s.ticker),
                        s
                    ]));
                entry.prefixIndex = new Map();
                for (const s of symbols)if (s.prefix) entry.prefixIndex.set(`${normName(s.prefix)}:${normTicker(s.ticker)}`, s);
            }
        } catch  {
            // Enumeration failed — non-fatal. Explicit-prefix routing still works;
            // bare resolution falls back to the lenient sole-provider path.
            entry.index = null;
        } finally{
            entry.settled = true;
            this.notify(true);
        }
    }
    notify(settled) {
        for (const cb of [
            ...this.changeListeners
        ])cb(settled);
    }
    /** Fires on each registry change (`settled` true after an index build finishes). */ onChange(cb) {
        this.changeListeners.add(cb);
        return ()=>this.changeListeners.delete(cb);
    }
    unregister(rawName) {
        this.entries.delete(normName(rawName));
        // Notify so any parked whenResolvable() listener re-evaluates against the new set
        // (and so resolution never depends on a stale, removed provider).
        this.notify(false);
    }
    has(rawName) {
        return this.entries.has(normName(rawName));
    }
    get(rawName) {
        return this.entries.get(normName(rawName))?.provider;
    }
    /** Registered provider names in registration order. */ names() {
        return [
            ...this.entries.keys()
        ];
    }
    parse(raw) {
        return parseSymbol(raw);
    }
    /**
     * Resolve a symbol to `{ provider, ticker }`, or null when nothing can serve it
     * yet. Explicit prefix → that provider (must be registered), else a provider whose
     * index declares that LISTING prefix for that ticker (`NASDAQ:AAPL` routes to the
     * provider serving Nasdaq-listed AAPL — TradingView-strict, so `NYSE:AAPL` resolves
     * to nothing rather than auto-correcting). Bare → first indexed provider
     * (registration order, `opts.default` first) that contains the ticker;
     * `opts.lenient` additionally allows a sole registered provider before its index
     * exists.
     */ resolve(raw, opts = {}) {
        const { provider, ticker } = this.parse(raw);
        if (provider) {
            if (this.entries.has(provider)) {
                // Even the explicit form translates a GROUP row — `cme:ES` must load
                // the root's default member, never dead-end on the unloadable listing.
                const d = this.entries.get(provider).byTicker?.get(normTicker(ticker));
                return {
                    provider,
                    ticker: d != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$groups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGroupRow"])(d) ? this.loadableTicker(provider, d) : ticker
                };
            }
            // Listing-prefix routing: matched against the DESCRIPTOR's declared prefix, so
            // the verdict comes from the data, never from string similarity. The resolved
            // ticker is the descriptor's spelling (canonical casing for `nyse:ibm` → `IBM`).
            const key = `${provider}:${normTicker(ticker)}`;
            for (const name of this.candidateOrder(opts.default)){
                const d = this.entries.get(name).prefixIndex?.get(key);
                if (d) return {
                    provider: name,
                    ticker: this.loadableTicker(name, d)
                };
            }
            return null;
        }
        const norm = normTicker(ticker);
        for (const name of this.candidateOrder(opts.default)){
            const e = this.entries.get(name);
            if (e.index?.has(norm)) {
                const d = e.byTicker?.get(norm);
                // Group rows are listed, never loadable: a bare root (`ES`) resolves to the
                // group's default member. Anything else keeps the CALLER's spelling.
                return {
                    provider: name,
                    ticker: d != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$groups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGroupRow"])(d) ? this.loadableTicker(name, d) : ticker
                };
            }
        }
        // Lenient (primary load only): a SOLE registered provider that cannot be
        // indexed (no `listSymbols`, or enumeration failed) is used optimistically —
        // there's no index to consult, so the getBars call itself confirms support. An
        // enumerable provider is NOT short-circuited: we wait for its index so an
        // unsupported symbol stays parked instead of rendering an empty chart.
        if (opts.lenient && this.entries.size === 1) {
            const only = this.names()[0];
            const e = this.entries.get(only);
            if (e.settled && e.index == null) return {
                provider: only,
                ticker
            };
        }
        return null;
    }
    /** What a resolved descriptor LOADS: itself — unless it is a GROUP row (listed, never
     *  served), which loads its default member (single `default`, else first listed). A
     *  memberless group keeps its own ticker and fails downstream like any unknown symbol. */ loadableTicker(name, d) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$groups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGroupRow"])(d)) return d.ticker;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$groups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultMemberOf"])(this.entries.get(name)?.descriptors ?? [], d)?.ticker ?? d.ticker;
    }
    /**
     * Resolve now if possible, else resolve later — re-attempting after each provider
     * settles. The promise stays pending until some registered provider can serve the
     * symbol (a dev-console warning is emitted on each unsuccessful round).
     */ whenResolvable(raw, opts = {}) {
        const immediate = this.resolve(raw, {
            ...opts,
            lenient: true
        });
        if (immediate) return Promise.resolve(immediate);
        return new Promise((resolve)=>{
            const off = this.onChange((settled)=>{
                const r = this.resolve(raw, {
                    ...opts,
                    lenient: true
                });
                if (r) {
                    stop();
                    resolve(r);
                } else if (settled && this.allSettled()) {
                    // Report only once EVERY registered provider has finished indexing. One
                    // index settling proves nothing: with several providers the first to finish
                    // is usually not the one that serves the symbol, and reporting there is a
                    // false verdict — the user sees "no provider serves X" on a symbol that
                    // resolves a moment later.
                    this.reportUnresolved(raw);
                }
            });
            // A parked wait outlives its chart unless it is cancellable: every rebuild over an
            // unservable symbol would otherwise leave its listener behind for the page's life.
            const stop = ()=>{
                off();
                this.waits.delete(stop);
            };
            this.waits.add(stop);
        });
    }
    /** Every registered provider has finished building its index (or failed trying). */ allSettled() {
        for (const e of this.entries.values())if (!e.settled) return false;
        return true;
    }
    /** Abandon every parked wait (chart/feed teardown). Their promises simply never settle. */ cancelWaits() {
        for (const stop of [
            ...this.waits
        ])stop();
    }
    /** Notified when a parked symbol is still unresolvable after an index settles. */ onUnresolved(cb) {
        this.unresolvedCbs.add(cb);
        return ()=>this.unresolvedCbs.delete(cb);
    }
    reportUnresolved(raw) {
        const names = this.names();
        console.warn(`[vela] symbol "${raw}" not yet resolvable — registered providers: ` + `[${names.join(', ') || 'none'}]. Register a provider that serves it.`);
        for (const cb of this.unresolvedCbs)cb({
            symbol: raw,
            providers: names
        });
    }
    candidateOrder(def) {
        const names = this.names();
        if (def) {
            const d = normName(def);
            if (this.entries.has(d)) return [
                d,
                ...names.filter((n)=>n !== d)
            ];
        }
        return names;
    }
    /**
     * The DISPLAY prefix for a resolved symbol — the descriptor's LISTING prefix when the
     * data declares one, else the provider name. This is the single seam every label
     * (legend chip, committed/persisted `PREFIX:TICKER` strings) derives from, which is
     * what makes a non-canonical spelling impossible to display: the form always comes
     * from the data, never from what was typed.
     */ displayPrefixOf(resolved) {
        const d = this.entries.get(resolved.provider)?.byTicker?.get(normTicker(resolved.ticker));
        return d?.prefix ?? resolved.provider;
    }
    /** The canonical `PREFIX:TICKER` string for a resolved symbol (descriptor spellings). */ canonicalSymbol(resolved) {
        const d = this.entries.get(resolved.provider)?.byTicker?.get(normTicker(resolved.ticker));
        return `${d?.prefix ?? resolved.provider}:${d?.ticker ?? resolved.ticker}`;
    }
    /** The icon URL for a DESCRIPTOR — routed to its OWNING provider's resolver (the
     *  provider owns the knowledge of where its asset class's icons live). A missing
     *  provider, an absent resolver, or a resolver that throws all mean "no icon" —
     *  the shells' initials badge takes over, never an error. */ symbolIconOf(d) {
        const name = d.provider ? normName(d.provider) : [
            ...this.entries.keys()
        ][0];
        const entry = name !== undefined ? this.entries.get(name) : undefined;
        try {
            return entry?.provider.resolveSymbolIcon?.(d) ?? undefined;
        } catch  {
            return undefined;
        }
    }
    /** The icon URL for a raw SYMBOL string (the statusline/object-tree path): resolve
     *  to the owning provider, find its descriptor, route to the resolver. Before the
     *  index settles (or for a lenient sole-provider resolution) a minimal synthetic
     *  descriptor is offered — crypto resolvers can answer from the ticker alone. */ symbolIcon(resolved) {
        if (!resolved) return undefined;
        const d = this.entries.get(resolved.provider)?.byTicker?.get(normTicker(resolved.ticker));
        // The indexed descriptor carries no owner annotation (that happens on
        // aggregation) — stamp the resolved provider so the resolver sees it.
        return this.symbolIconOf({
            ...d ?? {
                ticker: resolved.ticker
            },
            provider: d?.provider ?? resolved.provider
        });
    }
    /** Indexed symbols for one provider (or all, concatenated) — for autocomplete. */ symbolsOf(rawName) {
        if (rawName != null) return this.entries.get(normName(rawName))?.descriptors ?? [];
        return [
            ...this.entries.entries()
        ].flatMap(([name, e])=>e.descriptors.map((d)=>({
                    ...d,
                    provider: name
                })));
    }
    /** Provider metadata: the provider's own `info()` if present, else synthesized from its methods. */ infoOf(rawName) {
        const name = normName(rawName);
        const e = this.entries.get(name);
        if (!e) return {
            name,
            capabilities: {
                enumerate: false,
                stream: false,
                symbolInfo: false
            }
        };
        const p = e.provider;
        return p.info?.() ?? {
            name: e.name,
            capabilities: {
                enumerate: !!p.listSymbols,
                stream: !!p.subscribe,
                symbolInfo: !!p.getSymbolInfo
            }
        };
    }
    /** Resolves when every currently-registered provider's index has settled. */ indexReady() {
        return Promise.all([
            ...this.entries.values()
        ].map((e)=>e.settle)).then(()=>undefined);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/providers/binance/BinanceProvider.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BinanceProvider",
    ()=>BinanceProvider,
    "aggregate",
    ()=>aggregate,
    "dedupeSorted",
    ()=>dedupeSorted,
    "klineEventToOHLCV",
    ()=>klineEventToOHLCV,
    "klinesToOHLCV",
    ()=>klinesToOHLCV,
    "normalizeTf",
    ()=>normalizeTf,
    "parseTicker",
    ()=>parseTicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$base$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/symbol-base.ts [app-client] (ecmascript)");
;
const SPOT_BASE = 'https://api.binance.com/api/v3';
const SPOT_BASE_US = 'https://api.binance.us/api/v3';
const FUTURES_BASE = 'https://fapi.binance.com/fapi/v1';
const SPOT_WS = 'wss://stream.binance.com:9443';
const SPOT_WS_US = 'wss://stream.binance.us:9443';
const FUTURES_WS = 'wss://fstream.binance.com';
const FUTURES_WS_FALLBACK = 'wss://fstream.binancefuture.com';
/**
 * If a kline socket opens but delivers no candle within this window, treat it as
 * non-delivering and fall back to polling. Covers a socket that connects but stays
 * silent — e.g. Binance USD-M futures streams are geo-restricted in some regions and
 * ACK the subscription yet never push data. Generous enough not to mis-fire on an
 * illiquid symbol (which degrades to polling harmlessly anyway).
 */ const STREAM_STALL_MS = 15_000;
/** Reconnect backoff after an unexpected socket close. */ const STREAM_RECONNECT_MS = 2_000;
/** Canonical timeframe → Binance interval string (native, no aggregation). */ const TF_TO_INTERVAL = {
    '1': '1m',
    '3': '3m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    '120': '2h',
    '240': '4h',
    '360': '6h',
    '480': '8h',
    '720': '12h',
    D: '1d',
    W: '1w',
    M: '1M'
};
/** User-facing timeframe aliases → canonical keys (matches the other Vela layers). */ const TF_NORMALIZE = {
    '1m': '1',
    '3m': '3',
    '5m': '5',
    '15m': '15',
    '30m': '30',
    '45m': '45',
    '1h': '60',
    '2h': '120',
    '3h': '180',
    '4h': '240',
    '6h': '360',
    '8h': '480',
    '12h': '720',
    '1d': 'D',
    '1w': 'W',
    '1mo': 'M',
    '1D': 'D',
    '1W': 'W',
    '4H': '240',
    D: 'D',
    W: 'W',
    M: 'M'
};
/** Native intraday timeframes in minutes (the aggregation sub-candle candidates). */ const NATIVE_MINUTES = [
    1,
    3,
    5,
    15,
    30,
    60,
    120,
    240,
    360,
    480,
    720
];
const MIN_TO_INTERVAL = {
    1: '1m',
    3: '3m',
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    120: '2h',
    240: '4h',
    360: '6h',
    480: '8h',
    720: '12h'
};
const SUPPORTED_TIMEFRAMES = [
    '1',
    '3',
    '5',
    '15',
    '30',
    '45',
    '60',
    '120',
    '180',
    '240',
    'D',
    'W',
    'M'
];
function normalizeTf(tf) {
    return TF_NORMALIZE[tf] ?? TF_NORMALIZE[tf.toLowerCase()] ?? tf;
}
function parseTicker(ticker) {
    const t = ticker.trim().toUpperCase();
    if (t.endsWith('.P')) return {
        apiSymbol: t.slice(0, -2),
        isFutures: true
    };
    return {
        apiSymbol: t,
        isFutures: false
    };
}
function klinesToOHLCV(raw) {
    return raw.map((k)=>({
            time: Number(k[0]),
            open: Number(k[1]),
            high: Number(k[2]),
            low: Number(k[3]),
            close: Number(k[4]),
            volume: Number(k[5])
        }));
}
function klineEventToOHLCV(k) {
    return {
        time: Number(k.t),
        open: Number(k.o),
        high: Number(k.h),
        low: Number(k.l),
        close: Number(k.c),
        volume: Number(k.v)
    };
}
function dedupeSorted(bars) {
    const byTime = new Map();
    for (const b of bars)byTime.set(b.time, b);
    return [
        ...byTime.values()
    ].sort((a, b)=>a.time - b.time);
}
function aggregate(sub, bucketMs) {
    const buckets = new Map();
    for (const b of sub){
        const key = Math.floor(b.time / bucketMs) * bucketMs;
        const cur = buckets.get(key);
        if (!cur) {
            buckets.set(key, {
                time: key,
                open: b.open,
                high: b.high,
                low: b.low,
                close: b.close,
                volume: b.volume ?? 0
            });
        } else {
            cur.high = Math.max(cur.high, b.high);
            cur.low = Math.min(cur.low, b.low);
            cur.close = b.close;
            cur.volume = (cur.volume ?? 0) + (b.volume ?? 0);
        }
    }
    return [
        ...buckets.values()
    ].sort((a, b)=>a.time - b.time);
}
/** Largest native sub-timeframe (minutes) that evenly divides `targetMin`, or null. */ function selectSubTf(targetMin) {
    return NATIVE_MINUTES.filter((m)=>m < targetMin && targetMin % m === 0).sort((a, b)=>b - a)[0] ?? null;
}
class BinanceProvider {
    /** The spot endpoint confirmed reachable (cached after the first probe). */ spotBaseUrl = null;
    /** The in-flight endpoint probe, shared so concurrent first calls don't each ping. */ spotBaseProbe = null;
    /** Cached symbol enumeration (exchangeInfo is large; fetch once). */ symbolsPromise = null;
    info() {
        return {
            name: 'binance',
            displayName: 'Binance',
            requiresApiKey: false,
            supportedTimeframes: SUPPORTED_TIMEFRAMES,
            capabilities: {
                enumerate: true,
                stream: true,
                symbolInfo: true
            }
        };
    }
    async getBars(ticker, timeframe, range) {
        try {
            const { apiSymbol, isFutures } = parseTicker(ticker);
            const base = isFutures ? FUTURES_BASE : await this.spotBase();
            const tf = normalizeTf(timeframe);
            const nativeInterval = TF_TO_INTERVAL[tf];
            if (nativeInterval) {
                return dedupeSorted(klinesToOHLCV(await this.fetchKlines(base, apiSymbol, nativeInterval, range)));
            }
            // Aggregation path: fetch a native sub-timeframe and combine.
            const targetMin = /^\d+$/.test(tf) ? parseInt(tf, 10) : null;
            const subMin = targetMin != null ? selectSubTf(targetMin) : null;
            if (targetMin == null || subMin == null) {
                console.warn(`[vela] Binance: timeframe "${timeframe}" is not supported and cannot be aggregated.`);
                return [];
            }
            const ratio = targetMin / subMin;
            const subRange = {
                ...range,
                limit: range.limit != null ? range.limit * ratio + ratio : undefined
            };
            const sub = klinesToOHLCV(await this.fetchKlines(base, apiSymbol, MIN_TO_INTERVAL[subMin], subRange));
            const agg = aggregate(sub, targetMin * 60_000);
            return range.limit != null && agg.length > range.limit ? agg.slice(-range.limit) : agg;
        } catch (e) {
            // Fail soft (consistent with getSymbolInfo): an empty result parks/empties the
            // chart with a warning rather than rejecting the parked load.
            console.warn(`[vela] Binance: failed to fetch ${ticker} ${timeframe} — ${e instanceof Error ? e.message : String(e)}`);
            return [];
        }
    }
    async getSymbolInfo(ticker) {
        const { apiSymbol, isFutures } = parseTicker(ticker);
        const base = isFutures ? FUTURES_BASE : await this.spotBase();
        // Spot accepts ?symbol=; the futures exchangeInfo returns all symbols.
        const url = isFutures ? `${base}/exchangeInfo` : `${base}/exchangeInfo?symbol=${apiSymbol}`;
        const data = await this.json(url).catch(()=>null);
        const symbols = data?.symbols ?? [];
        const s = isFutures ? symbols.find((x)=>x.symbol === apiSymbol) : symbols[0];
        if (!s) return undefined;
        const priceFilter = s.filters?.find((f)=>f.filterType === 'PRICE_FILTER');
        const tickSize = priceFilter ? parseFloat(priceFilter.tickSize ?? '0.01') : 0.01;
        let instrumentType = isFutures ? 'futures' : 'crypto';
        if (isFutures && s.contractType === 'TRADIFI_PERPETUAL') {
            const u = (s.underlyingType ?? '').toUpperCase();
            if (u === 'COMMODITY') instrumentType = 'commodity';
            else if ([
                'SPY',
                'QQQ',
                'IWM'
            ].includes(s.baseAsset)) instrumentType = 'etf';
            else if (u.includes('EQUITY')) instrumentType = 'stock';
        }
        return {
            ticker,
            tickerid: `BINANCE:${ticker}`,
            prefix: 'BINANCE',
            description: `${s.baseAsset} / ${s.quoteAsset}${isFutures ? ' Perpetual' : ''}`,
            type: instrumentType,
            basecurrency: s.baseAsset,
            currency: s.quoteAsset,
            mintick: tickSize,
            pricescale: Math.round(1 / tickSize),
            timezone: 'Etc/UTC',
            session: '24x7'
        };
    }
    listSymbols() {
        if (!this.symbolsPromise) {
            this.symbolsPromise = Promise.all([
                this.listSpot().catch(()=>[]),
                this.listFutures().catch(()=>[])
            ]).then(([spot, futures])=>[
                    ...spot,
                    ...futures
                ]);
        }
        return this.symbolsPromise;
    }
    /** Predefined icon source for a crypto venue: the Ledger crypto-icon CDN, keyed by
     *  the BASE asset (the description's first segment, else the de-suffixed ticker). */ resolveSymbolIcon(symbol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$base$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ledgerCryptoIconUrl"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$symbol$2d$base$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["baseOf"])(symbol));
    }
    subscribe(ticker, timeframe, onBar) {
        const { apiSymbol, isFutures } = parseTicker(ticker);
        const interval = TF_TO_INTERVAL[normalizeTf(timeframe)];
        // Native interval + a WebSocket implementation ⇒ true streaming. Otherwise
        // (aggregated timeframe, or no WebSocket) fall back to polling getBars.
        if (interval && typeof WebSocket !== 'undefined') return this.streamKlines(ticker, timeframe, apiSymbol, isFutures, interval, onBar);
        return this.pollBars(ticker, timeframe, onBar);
    }
    // ── internals ────────────────────────────────────────────────────────
    /**
     * Open a Binance kline WebSocket (single-stream URL form — the stream is in the
     * path, so no subscribe frame is sent). Perpetuals use `fstream`; spot uses the
     * host matching the resolved REST endpoint (`.com`/`.us`). Reconnects on an
     * unexpected close until unsubscribed; the browser auto-answers Binance's
     * protocol-level pings, so no manual keepalive is needed.
     *
     * Futures klines ride the `/market` tier — Binance's legacy `/ws` path opens but
     * often delivers no frames. A silent socket first fails over to the alternate
     * futures host; a still-silent socket then falls back to polling, so the feed
     * always yields live updates instead of dying quietly.
     */ streamKlines(ticker, timeframe, apiSymbol, isFutures, interval, onBar) {
        let closed = false;
        let ws = null;
        let reconnect = null;
        let stall = null;
        let polling = null; // engaged when the stream is declared non-delivering
        let hostFlip = false; // futures: a silent primary sends the retry to the alternate host
        const stream = `${apiSymbol.toLowerCase()}@kline_${interval}`;
        const clearStall = ()=>{
            if (stall) {
                clearTimeout(stall);
                stall = null;
            }
        };
        // Tear down the socket and switch to polling — covers an open-but-silent stream.
        const fallToPolling = ()=>{
            if (closed || polling) return;
            clearStall();
            if (reconnect) {
                clearTimeout(reconnect);
                reconnect = null;
            }
            // Engage the poller BEFORE closing: close() fires onclose synchronously, and an
            // unset flag there schedules a reconnect that would reopen a socket over the poller.
            polling = this.pollBars(ticker, timeframe, onBar);
            try {
                ws?.close();
            } catch  {}
            ws = null;
            console.warn(`[vela] Binance: ${ticker} ${timeframe} stream delivered no data; falling back to polling.`);
        };
        const open = async ()=>{
            if (closed) return;
            const base = isFutures ? hostFlip ? FUTURES_WS_FALLBACK : FUTURES_WS : await this.spotWsBase();
            if (closed) return; // unsubscribed during the host probe
            ws = new WebSocket(`${base}${isFutures ? '/market/ws/' : '/ws/'}${stream}`);
            stall = setTimeout(()=>{
                if (isFutures && !hostFlip) {
                    // No frame on the primary host — retry once on the alternate before polling.
                    hostFlip = true;
                    try {
                        ws?.close();
                    } catch  {}
                    return;
                }
                fallToPolling();
            }, STREAM_STALL_MS); // watchdog: data must arrive
            ws.onmessage = (ev)=>{
                if (closed || polling) return; // unsubscribed, or already fell back to polling
                try {
                    const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '');
                    if (msg.k) {
                        clearStall();
                        onBar(klineEventToOHLCV(msg.k));
                    }
                } catch  {}
            };
            ws.onclose = ()=>{
                if (closed || polling) return;
                clearStall(); // a dead socket's pending watchdog must not fire over the reopened one
                reconnect = setTimeout(()=>void open(), STREAM_RECONNECT_MS);
            };
            ws.onerror = ()=>{
                try {
                    ws?.close();
                } catch  {}
            };
        };
        void open();
        return ()=>{
            closed = true;
            clearStall();
            if (reconnect) clearTimeout(reconnect);
            polling?.();
            try {
                ws?.close();
            } catch  {}
        };
    }
    /** WebSocket host matching the resolved REST spot endpoint (`.com` default, else `.us`). */ async spotWsBase() {
        const base = await this.spotBase();
        return base.includes('binance.us') ? SPOT_WS_US : SPOT_WS;
    }
    /** Poll the forming candle (for aggregated timeframes Binance has no native kline stream for). */ pollBars(ticker, timeframe, onBar) {
        let stopped = false;
        let timer = null;
        const poll = async ()=>{
            if (stopped) return;
            try {
                const bars = await this.getBars(ticker, timeframe, {
                    limit: 2
                });
                for (const b of bars)onBar(b);
            } catch  {}
            if (!stopped) timer = setTimeout(()=>void poll(), 3000);
        };
        timer = setTimeout(()=>void poll(), 3000);
        return ()=>{
            stopped = true;
            if (timer) clearTimeout(timer);
        };
    }
    async listSpot() {
        const base = await this.spotBase();
        const data = await this.json(`${base}/exchangeInfo`);
        return (data.symbols ?? []).filter((s)=>s.status === 'TRADING').map((s)=>({
                ticker: s.symbol,
                description: `${s.baseAsset} / ${s.quoteAsset}`,
                type: 'crypto'
            }));
    }
    async listFutures() {
        const data = await this.json(`${FUTURES_BASE}/exchangeInfo`);
        return (data.symbols ?? []).filter((s)=>(s.contractType === 'PERPETUAL' || s.contractType === 'TRADIFI_PERPETUAL') && s.status === 'TRADING').map((s)=>{
            let type = 'futures';
            if (s.contractType === 'TRADIFI_PERPETUAL') {
                const u = (s.underlyingType ?? '').toUpperCase();
                if (u === 'COMMODITY') type = 'commodity';
                else if ([
                    'SPY',
                    'QQQ',
                    'IWM'
                ].includes(s.baseAsset)) type = 'etf';
                else if (u.includes('EQUITY')) type = 'stock';
            }
            return {
                ticker: `${s.symbol}.P`,
                description: `${s.baseAsset} / ${s.quoteAsset} Perpetual`,
                type
            };
        });
    }
    /** Fetch klines, paginating past Binance's 1000-row cap. */ async fetchKlines(base, symbol, interval, range) {
        if (range.from != null) return this.paginateForward(base, symbol, interval, range.from, range.to ?? Date.now(), range.limit);
        const limit = range.limit ?? 500;
        if (limit > 1000) return this.paginateBackward(base, symbol, interval, limit, range.to);
        return this.klinesChunk(base, {
            symbol,
            interval,
            limit,
            endTime: range.to
        });
    }
    /** Forward pagination from `from` to `to` (used by ranged/tail fetches). */ async paginateForward(base, symbol, interval, from, to, limit) {
        const out = [];
        let cursor = from;
        while(cursor < to){
            const chunk = await this.klinesChunk(base, {
                symbol,
                interval,
                limit: 1000,
                startTime: cursor,
                endTime: to
            });
            if (chunk.length === 0) break;
            out.push(...chunk);
            cursor = Number(chunk[chunk.length - 1][6]) + 1; // last closeTime + 1ms
            if (chunk.length < 1000) break;
            if (limit && out.length >= limit) break;
        }
        return limit ? out.slice(0, limit) : out;
    }
    /** Backward pagination to assemble the most-recent `limit` bars. */ async paginateBackward(base, symbol, interval, limit, endTime) {
        let out = [];
        let remaining = limit;
        let cursor = endTime;
        let guard = Math.ceil(limit / 1000) + 5;
        while(remaining > 0 && guard-- > 0){
            const size = Math.min(remaining, 1000);
            const chunk = await this.klinesChunk(base, {
                symbol,
                interval,
                limit: size,
                endTime: cursor
            });
            if (chunk.length === 0) break;
            out = chunk.concat(out);
            remaining -= chunk.length;
            cursor = Number(chunk[0][0]) - 1; // earliest openTime - 1ms
            if (chunk.length < size) break;
        }
        return out;
    }
    async klinesChunk(base, params) {
        const url = new URL(`${base}/klines`);
        url.searchParams.set('symbol', params.symbol);
        url.searchParams.set('interval', params.interval);
        if (params.limit) url.searchParams.set('limit', String(Math.min(params.limit, 1000)));
        if (params.startTime != null) url.searchParams.set('startTime', String(params.startTime));
        if (params.endTime != null) url.searchParams.set('endTime', String(params.endTime));
        const data = await this.json(url.toString());
        if (!Array.isArray(data)) return [];
        // Binance returns an array OF arrays; guard against a malformed flat array.
        if (data.length > 0 && !Array.isArray(data[0])) return [];
        return data;
    }
    /**
     * Resolve the reachable spot endpoint (default, else the US mirror). The in-flight
     * probe is shared, so a burst of concurrent first calls issues ONE ping pair, not one
     * per call. A confirmed endpoint is cached permanently; a total failure clears the
     * probe so a later call can retry.
     */ spotBase() {
        if (this.spotBaseUrl) return Promise.resolve(this.spotBaseUrl);
        if (!this.spotBaseProbe) {
            this.spotBaseProbe = (async ()=>{
                try {
                    for (const url of [
                        SPOT_BASE,
                        SPOT_BASE_US
                    ]){
                        try {
                            const res = await fetch(`${url}/ping`, {
                                signal: AbortSignal.timeout(5000)
                            });
                            if (res.ok) return this.spotBaseUrl = url;
                        } catch  {
                        // try the next endpoint
                        }
                    }
                    return SPOT_BASE; // give up; let the actual request surface the error
                } finally{
                    this.spotBaseProbe = null; // allow a fresh probe later if no endpoint was cached
                }
            })();
        }
        return this.spotBaseProbe;
    }
    async json(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Binance HTTP ${res.status} for ${url}`);
        return res.json();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/providers/binance/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Public entry for the from-scratch Binance data provider, published as the
// `vela/providers/binance` subpath. No provider is bundled into the main
// entry — register this one explicitly:
//   import { BinanceProvider } from 'vela/providers/binance';
//   chart.data.registerProvider('binance', new BinanceProvider());
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$providers$2f$binance$2f$BinanceProvider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/providers/binance/BinanceProvider.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/symbol-base.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// The BASE-asset heuristic shared by the shells (initials badges) and the bundled
// crypto providers (icon-URL resolvers) — DOM-free on purpose, so a provider can
// import it without touching the widget layer.
__turbopack_context__.s([
    "baseOf",
    ()=>baseOf,
    "ledgerCryptoIconUrl",
    ()=>ledgerCryptoIconUrl
]);
function baseOf(d) {
    const fromDesc = d.description?.split('/')[0]?.trim();
    if (fromDesc) return fromDesc.replace(/\s+Perpetual$/i, '');
    return d.ticker.replace(/[-_/]?(USDT|USDC|USD1|USDS|BUSD|USD|EUR|PERP)$/i, '') || d.ticker;
}
function ledgerCryptoIconUrl(base) {
    const key = base.trim().toUpperCase();
    return key ? `https://crypto-icons.ledger.com/${encodeURIComponent(key)}.png` : undefined;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/symbol-groups.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Symbol GROUPS (futures roots): the pure vocabulary shared by every consumer that
// folds or resolves grouped listings — the picker (fold members under the group row,
// expand on demand) and the registry (translate a picked/typed group to the member it
// loads). DOM-free on purpose, like `symbol-base`.
__turbopack_context__.s([
    "defaultMemberOf",
    ()=>defaultMemberOf,
    "groupKeyOf",
    ()=>groupKeyOf,
    "groupMembers",
    ()=>groupMembers,
    "isGroupRow",
    ()=>isGroupRow
]);
function isGroupRow(d) {
    return d.group != null && d.ticker === d.group;
}
function groupKeyOf(d) {
    return `${(d.prefix ?? d.provider ?? '').toLowerCase()}:${(d.group ?? '').toUpperCase()}`;
}
function groupMembers(pool, groupRow) {
    const key = groupKeyOf(groupRow);
    return pool.filter((s)=>s.group != null && !isGroupRow(s) && groupKeyOf(s) === key);
}
function defaultMemberOf(pool, groupRow) {
    const members = groupMembers(pool, groupRow);
    const defaults = members.filter((m)=>m.default);
    return (defaults.length === 1 ? defaults[0] : members[0]) ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/data/timeframe.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "timeframeToMs",
    ()=>timeframeToMs
]);
/** Named non-minute resolutions → ms. `M` is treated as a 30-day month (bucketing only). */ const NAMED_TF_MS = {
    D: 86_400_000,
    W: 604_800_000,
    M: 2_592_000_000
};
function timeframeToMs(timeframe) {
    const tf = timeframe.trim();
    if (NAMED_TF_MS[tf]) return NAMED_TF_MS[tf];
    const m = /^(\d+)\s*(m|h|d|w)?$/i.exec(tf);
    if (m) {
        const n = parseInt(m[1], 10);
        const unit = (m[2] ?? 'm').toLowerCase(); // bare number ⇒ minutes
        const mult = unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : unit === 'd' ? 86_400_000 : 604_800_000;
        return n * mult;
    }
    return 3_600_000;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Public composition root + default backends
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$Vela$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/Vela.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$RendererControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/RendererControl.ts [app-client] (ecmascript)");
// The second pulse behind time displays — share one between a host clock and
// `chart.renderer.setWallClock` so the countdown chip never reads a different second.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$util$2f$wall$2d$clock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/util/wall-clock.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$NativeRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/native/NativeRenderer.ts [app-client] (ecmascript)");
// The drawing-toolbar VIEW as a standalone component — a workspace shell mounts ONE
// shared bar (dock:'static') and routes it to the active chart's `chart.drawings`.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$drawings$2f$DrawingToolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/native/drawings/DrawingToolbar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$MultiProviderFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/MultiProviderFeed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$CachingDataFeed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/CachingDataFeed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$BarStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/BarStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/timeframe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$DataControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/DataControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$DrawingsControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/DrawingsControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$MarksControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/MarksControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$ReplayControl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/ReplayControl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$replayTicks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/replayTicks.ts [app-client] (ecmascript)");
// Native indicators (core-computed, no scripting engine) — register a type, then chart.addNativeIndicator(type)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$events$2f$EventBus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/events/EventBus.ts [app-client] (ecmascript)");
// User drawings (model + registry + persistence; renderer-agnostic)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/index.ts [app-client] (ecmascript) <locals>");
// The plugin SDK surface (also available as the `vela/plugin` subpath).
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$plugin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/plugin.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/plugin.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// The Vela PLUGIN SDK — the public extension surface a plugin package (e.g. Vela-Pro)
// builds against. Everything here is framework-free and side-effect-free to import.
//
// Extension seams:
//  - CHART TYPES (`registerChartType`): a new price style contributing a bar transform
//    (view-bar stream), a per-chart data engine (secondary per-bar data pushed through the
//    renderer's native channels, incl. the `<id>-pending` loading protocol), and an
//    extended-ticker modifier (`"SYM;id"` for scripts).
//  - NATIVE INDICATORS (`registerNativeIndicator`): core-computed indicators with renderer
//    layers driven through the same native-data channels (volume and VPVR are built on it).
//  - SCRIPTING ENGINES (`chart.registerEngine`): a language runtime executing indicator
//    scripts against Vela-owned bars through the `ScriptingEngine` port — see the section
//    at the bottom for the port plus the model/identity/palette vocabulary it builds with.
//
// UI contributions (style-picker entries, settings sections, shortcuts) arrive with the
// widget SDK — contributions are DATA descriptors, never DOM.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/chart-types/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$renderer$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/renderer-defaults.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/NativeIndicator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$layers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/native/layers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$widget$2f$contributions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/widget/contributions.ts [app-client] (ecmascript)");
// A plugin panel gets the shell's own column; these bounds are what `resizable` clamps to.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$widget$2f$side$2d$panel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/widget/side-panel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
// Series ids must come from `stableSeriesId` so renderer reconciliation and persisted
// per-series settings survive re-runs identically whichever engine produced the series.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/model/index.ts [app-client] (ecmascript) <locals>");
// The semantic palette (fixed brand/meaning colors, never theme-dependent) so plugin
// output — default plot colors, layer inks — matches core affordances exactly.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/widget/contributions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Widget CONTRIBUTIONS — the descriptor-based customization seam. Plugins (and host
// apps) contribute ACTIONS as data (never DOM): the widget projects them into its own
// chrome — topbar buttons, context-menu items — so any future view layer (React) can
// project the same descriptors. Register at import time, before widgets are constructed.
__turbopack_context__.s([
    "DEFAULT_PANEL_ORDER",
    ()=>DEFAULT_PANEL_ORDER,
    "OVERRIDABLE_TOPBAR_IDS",
    ()=>OVERRIDABLE_TOPBAR_IDS,
    "legendActions",
    ()=>legendActions,
    "legendActionsProviderFor",
    ()=>legendActionsProviderFor,
    "legendCallouts",
    ()=>legendCallouts,
    "legendCalloutsProviderFor",
    ()=>legendCalloutsProviderFor,
    "mobilePlacement",
    ()=>mobilePlacement,
    "registerDefaultEngine",
    ()=>registerDefaultEngine,
    "registerLegendAction",
    ()=>registerLegendAction,
    "registerLegendCallout",
    ()=>registerLegendCallout,
    "registerSidePanel",
    ()=>registerSidePanel,
    "registerStatePersistence",
    ()=>registerStatePersistence,
    "registerSymbolFavorite",
    ()=>registerSymbolFavorite,
    "registerSymbolRanking",
    ()=>registerSymbolRanking,
    "registerWidgetAction",
    ()=>registerWidgetAction,
    "registerWidgetAttachment",
    ()=>registerWidgetAttachment,
    "resolveEngines",
    ()=>resolveEngines,
    "sidePanels",
    ()=>sidePanels,
    "statePersistenceHandlers",
    ()=>statePersistenceHandlers,
    "symbolFavorite",
    ()=>symbolFavorite,
    "symbolRanking",
    ()=>symbolRanking,
    "topbarActionOverride",
    ()=>topbarActionOverride,
    "unregisterDefaultEngine",
    ()=>unregisterDefaultEngine,
    "unregisterLegendAction",
    ()=>unregisterLegendAction,
    "unregisterLegendCallout",
    ()=>unregisterLegendCallout,
    "unregisterSidePanel",
    ()=>unregisterSidePanel,
    "unregisterStatePersistence",
    ()=>unregisterStatePersistence,
    "unregisterWidgetAction",
    ()=>unregisterWidgetAction,
    "unregisterWidgetAttachment",
    ()=>unregisterWidgetAttachment,
    "widgetActions",
    ()=>widgetActions,
    "widgetAttachments",
    ()=>widgetAttachments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$widget$2f$topbar$2d$composition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/widget/topbar-composition.ts [app-client] (ecmascript)");
;
function mobilePlacement(action) {
    return action.mobile ?? (action.align === 'left' ? 'bar' : 'menu');
}
const registry = new Map();
const attachments = new Map();
const panels = new Map();
function registerWidgetAttachment(att) {
    attachments.set(att.id, att);
    return ()=>{
        if (attachments.get(att.id) === att) attachments.delete(att.id);
    };
}
function unregisterWidgetAttachment(id) {
    attachments.delete(id);
}
function widgetAttachments() {
    return [
        ...attachments.values()
    ];
}
const DEFAULT_PANEL_ORDER = 100;
function registerSidePanel(desc) {
    panels.set(desc.id, desc);
    return ()=>{
        if (panels.get(desc.id) === desc) panels.delete(desc.id);
    };
}
function unregisterSidePanel(id) {
    panels.delete(id);
}
function sidePanels() {
    return [
        ...panels.values()
    ].sort((a, b)=>(a.order ?? DEFAULT_PANEL_ORDER) - (b.order ?? DEFAULT_PANEL_ORDER));
}
const OVERRIDABLE_TOPBAR_IDS = [
    'indicators',
    'screenshot'
];
const overridableSet = new Set(OVERRIDABLE_TOPBAR_IDS);
const builtinTopbarSet = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$widget$2f$topbar$2d$composition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOPBAR_BUILTIN_IDS"]);
function topbarActionOverride(id) {
    if (!overridableSet.has(id)) return undefined;
    return registry.get(id);
}
function registerWidgetAction(desc) {
    if (builtinTopbarSet.has(desc.id) && !overridableSet.has(desc.id)) {
        console.warn(`[vela] widget action "${desc.id}": this built-in topbar slot is a stateful control and cannot be overridden — ignored. Overridable slots: ${OVERRIDABLE_TOPBAR_IDS.join(', ')}.`);
        return ()=>undefined;
    }
    registry.set(desc.id, desc);
    return ()=>{
        if (registry.get(desc.id) === desc) registry.delete(desc.id);
    };
}
function unregisterWidgetAction(id) {
    registry.delete(id);
}
function widgetActions(target, ctx) {
    const list = [
        ...registry.values()
    ].filter((d)=>d.target === target);
    list.sort((a, b)=>(a.order ?? 0) - (b.order ?? 0));
    return ctx ? list.filter((d)=>!d.when || d.when(ctx)) : list;
}
const legendRegistry = new Map();
function registerLegendAction(desc) {
    legendRegistry.set(desc.id, desc);
    return ()=>{
        if (legendRegistry.get(desc.id) === desc) legendRegistry.delete(desc.id);
    };
}
function unregisterLegendAction(id) {
    legendRegistry.delete(id);
}
function legendActions() {
    return [
        ...legendRegistry.values()
    ].sort((a, b)=>(a.order ?? 0) - (b.order ?? 0));
}
function legendActionsProviderFor(chart, context) {
    return (indicatorId)=>{
        const handle = chart.indicators().find((h)=>h.id === indicatorId);
        if (!handle) return [];
        const info = {
            id: handle.id,
            title: handle.title,
            ...handle.source !== undefined ? {
                source: handle.source
            } : {}
        };
        return legendActions().filter((d)=>!d.when || d.when(info)).map((d)=>({
                id: d.id,
                icon: d.icon,
                tooltip: d.tooltip,
                run: ()=>d.run(context(), info)
            }));
    };
}
const calloutRegistry = new Map();
function registerLegendCallout(desc) {
    calloutRegistry.set(desc.id, desc);
    return ()=>{
        if (calloutRegistry.get(desc.id) === desc) calloutRegistry.delete(desc.id);
    };
}
function unregisterLegendCallout(id) {
    calloutRegistry.delete(id);
}
function legendCallouts() {
    return [
        ...calloutRegistry.values()
    ].sort((a, b)=>(a.order ?? 0) - (b.order ?? 0));
}
function legendCalloutsProviderFor(chart, context) {
    return (indicatorId)=>{
        const handle = chart.indicators().find((h)=>h.id === indicatorId);
        if (!handle) return [];
        const info = {
            id: handle.id,
            title: handle.title,
            ...handle.source !== undefined ? {
                source: handle.source
            } : {}
        };
        const views = [];
        for (const d of legendCallouts()){
            const spec = d.callout(info);
            if (!spec) continue;
            views.push({
                id: d.id,
                icon: spec.icon,
                background: spec.background,
                ...spec.color !== undefined ? {
                    color: spec.color
                } : {},
                tooltip: spec.tooltip,
                ...spec.content !== undefined ? {
                    content: {
                        ...spec.content.title !== undefined ? {
                            title: spec.content.title
                        } : {},
                        items: spec.content.items.map((item)=>item.type === 'text' ? item : {
                                type: 'button',
                                label: item.label,
                                ...item.primary !== undefined ? {
                                    primary: item.primary
                                } : {},
                                ...item.close !== undefined ? {
                                    close: item.close
                                } : {},
                                run: ()=>item.run(context(), info)
                            })
                    }
                } : {}
            });
        }
        return views;
    };
}
const stateHandlers = new Map();
function registerStatePersistence(handler) {
    stateHandlers.set(handler.key, handler);
    return ()=>{
        if (stateHandlers.get(handler.key) === handler) stateHandlers.delete(handler.key);
    };
}
function unregisterStatePersistence(key) {
    stateHandlers.delete(key);
}
function statePersistenceHandlers(scope) {
    return [
        ...stateHandlers.values()
    ].filter((h)=>h.scope === scope);
}
let symbolRankingHook;
function registerSymbolRanking(hook) {
    symbolRankingHook = hook;
    return ()=>{
        if (symbolRankingHook === hook) symbolRankingHook = undefined;
    };
}
let symbolFavoriteHook;
function registerSymbolFavorite(hook) {
    symbolFavoriteHook = hook;
    return ()=>{
        if (symbolFavoriteHook === hook) symbolFavoriteHook = undefined;
    };
}
function symbolFavorite() {
    return symbolFavoriteHook;
}
function symbolRanking() {
    return symbolRankingHook;
}
const defaultEngines = new Map();
function registerDefaultEngine(language, make) {
    defaultEngines.set(language, make);
    return ()=>{
        if (defaultEngines.get(language) === make) defaultEngines.delete(language);
    };
}
function unregisterDefaultEngine(language) {
    defaultEngines.delete(language);
}
function resolveEngines(overrides) {
    return {
        ...Object.fromEntries(defaultEngines),
        ...overrides
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/widget/side-panel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PANEL_MAX_WIDTH",
    ()=>DEFAULT_PANEL_MAX_WIDTH,
    "DEFAULT_PANEL_MIN_WIDTH",
    ()=>DEFAULT_PANEL_MIN_WIDTH,
    "DEFAULT_PANEL_WIDTH",
    ()=>DEFAULT_PANEL_WIDTH,
    "SidePanel",
    ()=>SidePanel,
    "clampPanelWidth",
    ()=>clampPanelWidth
]);
// The docked side-panel shell: a column on the chart's right edge with a titled header, a close
// button, and a scrolling body. Closed by default — a topbar button toggles it, and because the
// shell is a flex SIBLING of the chart (not an overlay) opening it shrinks the chart. The object
// tree and the data window are built on it, and contributed panels (`registerSidePanel`) get the
// same shell from the dock, so every panel in the column looks and behaves alike.
//
// Width is a per-panel choice: fixed by default, or `resizable` — a drag handle on the panel's
// inner edge, clamped to [minWidth, maxWidth], double-click back to the declared width.
// Placement is too: docked (the default, a column beside the chart) or `overlay` — the panel
// floats over the chart's right edge and the chart keeps its width, for panels wide enough
// that a docked column would crush the plot (an editor). A floating panel carries a PIN in
// its header: pinned, it docks as a column after all; the choice is the user's and persists
// with the dock state.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
;
;
const STYLE_ID = 'vela-widget-sidepanel';
const DEFAULT_PANEL_WIDTH = 280;
const DEFAULT_PANEL_MIN_WIDTH = 200;
const DEFAULT_PANEL_MAX_WIDTH = 640;
const CSS = `
.vela-panel[hidden] { display: none !important; }
.vela-panel {
    position: relative;
    width: var(--vela-panel-w, ${DEFAULT_PANEL_WIDTH}px);
    flex: none;
    border-left: 1px solid var(--vela-border, #262629);
    display: flex;
    flex-direction: column;
    color: var(--vela-fg);
    font-size: 13px;
    box-sizing: border-box;
    background: var(--vela-bg-panel, #121215);
}
.vela-panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 8px 10px 14px;
    border-bottom: 1px solid var(--vela-border, #262629);
    font-size: 14px;
    font-weight: 600;
    color: var(--vela-fg-bright);
}
.vela-panel-title { flex: none; }
.vela-panel-title:empty { display: none; }
/* The contributed slot claims the space between title and close; its children lay out
   inline and the close button stays pinned right. */
.vela-panel-header-slot { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 6px; }
.vela-panel-close {
    all: unset;
    cursor: pointer;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: var(--vela-fg-muted);
    font-size: 16px;
}
.vela-panel-close .vela-icon { width: 16px; height: 16px; }
.vela-panel-close:hover { background: var(--vela-hover); color: var(--vela-fg-bright); }
/* The pin: same footprint as the close button it sits beside; filled + bright once pinned. */
.vela-panel-pin {
    all: unset;
    cursor: pointer;
    width: 26px;
    height: 26px;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: var(--vela-fg-muted);
}
.vela-panel-pin .vela-icon { width: 15px; height: 15px; }
.vela-panel-pin:hover { background: var(--vela-hover); color: var(--vela-fg-bright); }
.vela-panel-pin[data-on='1'] { color: var(--vela-fg-bright); }
.vela-panel-body { flex: 1; overflow: auto; padding: 8px; }
.vela-panel-body::-webkit-scrollbar { width: 8px; }
.vela-panel-body::-webkit-scrollbar-thumb { background: var(--vela-scroll); border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
/* Straddles the panel's inner border so the whole seam is grabbable; it paints only under the
   pointer — a permanently visible bar would read as a second border. */
.vela-panel-resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -3px;
    width: 7px;
    cursor: col-resize;
    touch-action: none;
    z-index: 1;
}
.vela-panel-resizer::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 3px;
    width: 1px;
    background: transparent;
}
/* The same hover ink as the workspace grid splitters and the canvas pane separators, so
   every draggable seam in the shell reads as one family. */
.vela-panel-resizer:hover::after,
.vela-panel-resizer[data-dragging]::after { background: var(--vela-separator-hover-line); }
/* An OVERLAY panel floats over the chart's right edge instead of taking a column: the
   chart keeps its width and layout (the dock host is position:relative — the anchoring the
   mobile rule below relies on too). Same z-order as that mobile overlay, above the chart's
   own DOM overlays; the shadow separates it from the plot it covers. */
.vela-panel[data-overlay] {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: 100%;
    z-index: 25;
    box-shadow: var(--vela-shadow);
}
/* Mobile: a 280px column would crush a phone-width chart — the panel overlays the
   chart area instead (its flex parent is position:relative), full-bleed, closed by
   the same header ✕. Width dragging is a pointer affordance; off on mobile. */
[data-layout='mobile'] .vela-panel {
    position: absolute;
    inset: 0;
    width: auto;
    z-index: 25;
    border-left: none;
}
[data-layout='mobile'] .vela-panel-resizer { display: none; }
`;
function clampPanelWidth(px, min = DEFAULT_PANEL_MIN_WIDTH, max = DEFAULT_PANEL_MAX_WIDTH) {
    const lo = Number.isFinite(min) && min > 0 ? min : DEFAULT_PANEL_MIN_WIDTH;
    // An infinite max is "no upper bound" (a fixed panel); a finite one below the min is a
    // caller's mistake — the min wins rather than collapsing the range.
    const hi = Number.isFinite(max) ? Math.max(max, lo) : Number.POSITIVE_INFINITY;
    if (!Number.isFinite(px)) return lo;
    return Math.round(Math.min(Math.max(px, lo), hi));
}
class SidePanel {
    el;
    /**
     * Notified whenever the panel opens or closes, by ANY path — a topbar toggle, the header ✕,
     * or another panel taking the dock. The owning shell reflects it on its chrome, so a button's
     * pressed state can never drift from the panel it controls.
     */ onOpenChange = null;
    /** Notified when the USER settles a new width (drag release, or double-click reset) — never on
     *  a programmatic {@link setWidth}, so restoring a persisted width raises no change. */ onWidthChange = null;
    /** Notified when the USER pins or unpins a floating panel (`overlay` is the NEW placement) —
     *  never on a programmatic {@link setOverlay}, for the same reason as widths. */ onPlacementChange = null;
    body;
    heading;
    slot;
    declaredWidth;
    minWidth;
    maxWidth;
    widthPx;
    /** Declared `overlay` — the panel CAN float; {@link overlay} says whether it does right now. */ floatable;
    overlayOn;
    pin = null;
    /** `modifier` is the panel's own class, carrying its content styles (e.g. `vela-ot`). */ constructor(host, title, modifier, opts = {}){
        const doc = host.ownerDocument;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(STYLE_ID, CSS, doc);
        // A FIXED panel is its own bound — the resize bounds would otherwise silently rewrite a
        // declared width a host set from code (or restored) outside the resizable defaults.
        this.minWidth = opts.resizable ? opts.minWidth ?? DEFAULT_PANEL_MIN_WIDTH : 1;
        this.maxWidth = opts.resizable ? opts.maxWidth ?? DEFAULT_PANEL_MAX_WIDTH : Number.POSITIVE_INFINITY;
        this.declaredWidth = clampPanelWidth(opts.width ?? DEFAULT_PANEL_WIDTH, this.minWidth, this.maxWidth);
        this.widthPx = this.declaredWidth;
        this.el = doc.createElement('div');
        this.el.className = `vela-panel ${modifier}`;
        this.el.hidden = true;
        this.floatable = opts.overlay === true;
        this.overlayOn = this.floatable;
        if (this.overlayOn) this.el.dataset.overlay = '1';
        this.el.style.setProperty('--vela-panel-w', `${this.widthPx}px`);
        const header = doc.createElement('div');
        header.className = 'vela-panel-header';
        this.heading = doc.createElement('span');
        this.heading.className = 'vela-panel-title';
        this.heading.textContent = title;
        // The header SLOT — the space between the title and the close button, handed to a
        // contributed panel's `mount` so it can dock its own compact controls there
        // (script name, action icons) instead of spending a toolbar row on them.
        this.slot = doc.createElement('div');
        this.slot.className = 'vela-panel-header-slot';
        const close = doc.createElement('button');
        close.className = 'vela-panel-close';
        close.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('close', doc));
        close.title = 'Close';
        close.addEventListener('click', ()=>this.toggle(false));
        // The pin exists only on a panel that can float: pressed, it docks the panel as a
        // column (the chart makes room); released, the panel floats again.
        if (this.floatable) {
            this.pin = doc.createElement('button');
            this.pin.className = 'vela-panel-pin';
            this.pin.addEventListener('click', ()=>{
                this.setOverlay(!this.overlayOn);
                this.onPlacementChange?.(this.overlayOn);
            });
            this.refreshPin();
        }
        header.append(this.heading, this.slot, ...this.pin ? [
            this.pin
        ] : [], close);
        this.body = doc.createElement('div');
        this.body.className = 'vela-panel-body';
        this.el.append(header, this.body);
        if (opts.resizable) this.mountResizer(doc);
        host.appendChild(this.el);
    }
    get open() {
        return !this.el.hidden;
    }
    /** Open/close the panel — a bare call flips it. */ toggle(open = this.el.hidden) {
        if (open === !this.el.hidden) return;
        this.el.hidden = !open;
        this.onOpenChange?.(open);
    }
    /** The scrolling body, for a panel filled from OUTSIDE the class — a contributed panel's
     *  `mount` receives exactly this element. Subclasses use the protected `body`. */ get content() {
        return this.body;
    }
    /** The header slot between the title and the close button — a contributed panel's
     *  `mount` receives it (via {@link SidePanelHeader}) to dock compact controls. */ get headerSlot() {
        return this.slot;
    }
    /** Replace the header title. The topbar toggle keeps the DECLARED title as its
     *  tooltip — this only changes what the open column says about itself. */ setTitle(title) {
        this.heading.textContent = title;
    }
    /** Current width in px. */ get width() {
        return this.widthPx;
    }
    /** Resize the panel (clamped). Silent — {@link onWidthChange} reports user drags only. */ setWidth(px) {
        const next = clampPanelWidth(px, this.minWidth, this.maxWidth);
        if (next === this.widthPx) return;
        this.widthPx = next;
        this.el.style.setProperty('--vela-panel-w', `${next}px`);
    }
    /** Whether the panel floats over the chart right now (false for every docked panel). */ get overlay() {
        return this.overlayOn;
    }
    /** Float or dock the panel. Only a panel declared `overlay` can float — on any other this is
     *  a no-op. Silent — {@link onPlacementChange} reports the user's pin clicks only. */ setOverlay(overlay) {
        if (!this.floatable || overlay === this.overlayOn) return;
        this.overlayOn = overlay;
        if (overlay) this.el.dataset.overlay = '1';
        else delete this.el.dataset.overlay;
        this.refreshPin();
    }
    refreshPin() {
        if (!this.pin) return;
        const pinned = !this.overlayOn;
        const doc = this.pin.ownerDocument;
        this.pin.replaceChildren((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])(pinned ? 'pin-filled' : 'pin', doc));
        this.pin.dataset.on = pinned ? '1' : '0';
        this.pin.title = pinned ? 'Unpin — float over the chart' : 'Pin beside the chart';
        this.pin.setAttribute('aria-label', this.pin.title);
        this.pin.setAttribute('aria-pressed', pinned ? 'true' : 'false');
    }
    destroy() {
        this.el.remove();
    }
    /** The drag handle on the panel's inner (left) edge — the panel is docked right, so dragging
     *  AWAY from the edge widens it. Pointer capture keeps the drag alive over the chart canvas. */ mountResizer(doc) {
        const handle = doc.createElement('div');
        handle.className = 'vela-panel-resizer';
        handle.setAttribute('role', 'separator');
        handle.setAttribute('aria-orientation', 'vertical');
        let startX = 0;
        let startWidth = 0;
        let dragging = false;
        const end = (e)=>{
            if (!dragging) return;
            dragging = false;
            delete handle.dataset.dragging;
            handle.releasePointerCapture(e.pointerId);
            if (this.widthPx !== startWidth) this.onWidthChange?.(this.widthPx);
        };
        handle.addEventListener('pointerdown', (e)=>{
            if (e.button !== 0) return;
            dragging = true;
            startX = e.clientX;
            startWidth = this.widthPx;
            handle.dataset.dragging = '1';
            handle.setPointerCapture(e.pointerId);
            e.preventDefault(); // no text selection, and no drag starting on the chart underneath
        });
        handle.addEventListener('pointermove', (e)=>{
            if (!dragging) return;
            this.setWidth(startWidth + (startX - e.clientX));
            e.preventDefault();
        });
        handle.addEventListener('pointerup', end);
        handle.addEventListener('pointercancel', end);
        handle.addEventListener('dblclick', ()=>{
            const before = this.widthPx;
            this.setWidth(this.declaredWidth);
            if (this.widthPx !== before) this.onWidthChange?.(this.widthPx);
        });
        this.el.appendChild(handle);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/widget/topbar-composition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Topbar COMPOSITION — the host's declarative control of which topbar entries render,
// and in what order. The option DESCRIBES what is there (an allowlist per side), never
// what isn't: a side left undeclared keeps the shell's default composition, so the
// plug-and-play behavior survives untouched for hosts that never reach for this.
//
// Entries are IDS in one shared vocabulary: the built-in controls below, the `'actions'`
// flow slot (where unlisted contributed actions land, per their declared `align`), and
// any CONTRIBUTED action id (`registerWidgetAction`'s `id`) — naming one PINS that
// action at the list position, overriding its declared `align`/`order`. An explicit
// list is the side's complete contract: ids not listed do not render there, and hiding
// a built-in removes its other entry points too (mobile counterpart, keyboard chord —
// `mod+alt+S` for `'screenshot'`). Ctrl+Z / Ctrl+Y are NOT tied to `'undo-redo'`:
// hiding the buttons keeps the editing chords.
//
// The trade-off is deliberate and documented: an explicit list FREEZES that side — a
// built-in a future release adds will not appear for a host that curates. `hidden`-less
// hosts keep getting new chrome by default.
/** The host-facing option: visible entries per side, in render order. An undeclared
 *  side falls back to its default list. */ __turbopack_context__.s([
    "TOPBAR_BUILTIN_IDS",
    ()=>TOPBAR_BUILTIN_IDS,
    "TOPBAR_DEFAULT_LEFT",
    ()=>TOPBAR_DEFAULT_LEFT,
    "TOPBAR_DEFAULT_RIGHT",
    ()=>TOPBAR_DEFAULT_RIGHT,
    "pinnedTopbarActionIds",
    ()=>pinnedTopbarActionIds,
    "resolveTopbarComposition",
    ()=>resolveTopbarComposition,
    "topbarHas",
    ()=>topbarHas
]);
const TOPBAR_BUILTIN_IDS = [
    'symbol',
    'timeframes',
    'style',
    'layout',
    'indicators',
    'actions',
    'undo-redo',
    'alerts',
    'panels',
    'screenshot'
];
const TOPBAR_DEFAULT_LEFT = [
    'symbol',
    'timeframes',
    'style',
    'layout',
    'indicators',
    'actions',
    'undo-redo'
];
const TOPBAR_DEFAULT_RIGHT = [
    'actions',
    'alerts',
    'panels',
    'screenshot'
];
function resolveTopbarComposition(opt) {
    const seen = new Set();
    const take = (list)=>{
        const out = [];
        const local = new Set();
        for (const id of list){
            if (!id || local.has(id) || id !== 'actions' && seen.has(id)) continue;
            local.add(id);
            seen.add(id);
            out.push(id);
        }
        return out;
    };
    return {
        left: take(opt?.left ?? TOPBAR_DEFAULT_LEFT),
        right: take(opt?.right ?? TOPBAR_DEFAULT_RIGHT)
    };
}
function topbarHas(comp, id) {
    return comp.left.includes(id) || comp.right.includes(id);
}
function pinnedTopbarActionIds(comp) {
    const builtin = new Set(TOPBAR_BUILTIN_IDS);
    return [
        ...comp.left,
        ...comp.right
    ].filter((id)=>!builtin.has(id));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_charting_0jvnxiy._.js.map