(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/charting/core/engine/DrawingSeriesService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingSeriesService",
    ()=>DrawingSeriesService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/timeframe.ts [app-client] (ecmascript)");
;
/** Hard cap on the bars one request may demand — a huge area at a tiny timeframe must
 *  degrade to `too-wide`, not melt the provider. */ const MAX_BARS = 5000;
/** Fetch padding as a fraction of the requested span, each side — small anchor drags stay cache hits. */ const PAD_FRAC = 0.25;
/** Bounded memory: total cached windows across all (market, timeframe) keys. */ const MAX_ENTRIES = 16;
/** A failed fetch parks its window this long before a paint may retry it. */ const RETRY_MS = 15_000;
/** The steps `'auto'` resolves against — the largest one at least 4× finer than the chart. */ const AUTO_STEPS = [
    '240',
    '60',
    '30',
    '15',
    '5',
    '1'
];
class DrawingSeriesService {
    deps;
    /** Cached windows per `market|timeframe` key, newest-used last (LRU across keys). */ cache;
    listeners;
    constructor(deps){
        this.deps = deps;
        this.cache = new Map();
        this.listeners = new Set();
    }
    seriesInRange(timeframe, from, to) {
        if (!this.deps.canFetch()) return {
            state: 'unavailable',
            reason: 'no-source'
        };
        const resolved = this.resolveTimeframe(timeframe);
        if (typeof resolved !== 'string') return {
            state: 'unavailable',
            reason: resolved.reason
        };
        const barMs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeToMs"])(resolved);
        const lo = Math.min(from, to);
        const hi = Math.max(from, to);
        if (!(hi > lo) || !(barMs > 0)) return {
            state: 'unavailable',
            reason: 'not-lower'
        };
        if ((hi - lo) / barMs > MAX_BARS) return {
            state: 'unavailable',
            reason: 'too-wide'
        };
        const key = `${this.deps.marketKey()}|${resolved}`;
        const entries = this.cache.get(key) ?? [];
        const covering = entries.find((e)=>e.from <= lo && e.to >= hi);
        if (covering) {
            if (covering.pending) return this.loading(entries, resolved, barMs, lo, hi);
            if (covering.failedAt > 0) {
                if (Date.now() - covering.failedAt < RETRY_MS) return this.loading(entries, resolved, barMs, lo, hi);
                entries.splice(entries.indexOf(covering), 1); // parked long enough — refetch below
            } else {
                this.maybeRefresh(key, covering, resolved, barMs, hi);
                return {
                    state: 'ready',
                    bars: this.slice(covering.bars, lo, hi),
                    timeframe: resolved,
                    barMs
                };
            }
        }
        this.fetchWindow(key, entries, resolved, lo, hi);
        return this.loading(entries, resolved, barMs, lo, hi);
    }
    onUpdate(listener) {
        this.listeners.add(listener);
        return ()=>this.listeners.delete(listener);
    }
    // ── internals ──
    /** `'auto'` → the largest standard step at least 4× finer than the chart (else the finest
     *  step still below it); an explicit timeframe passes only when strictly finer. Failures
     *  distinguish "this pick isn't lower" from "NOTHING lower exists" (the chart is already
     *  at the finest offered step) so the consumer can word its notice honestly. */ resolveTimeframe(timeframe) {
        const chartMs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeToMs"])(this.deps.chartTimeframe());
        const finest = AUTO_STEPS[AUTO_STEPS.length - 1];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeToMs"])(finest) >= chartMs) return {
            reason: 'none-lower'
        };
        const tf = timeframe.trim() || 'auto';
        if (tf === 'auto') {
            for (const step of AUTO_STEPS){
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeToMs"])(step) <= chartMs / 4) return step;
            }
            return finest; // no step subdivides 4× — the finest one below the chart still magnifies
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeToMs"])(tf) < chartMs ? tf : {
            reason: 'not-lower'
        };
    }
    /** The `loading` answer, carrying best-effort PARTIAL bars from settled overlapping
     *  windows — a widened window keeps painting what it already has while it fetches. */ loading(entries, timeframe, barMs, lo, hi) {
        const partial = new Map();
        for (const e of entries){
            if (e.pending || e.failedAt > 0) continue;
            if (e.to < lo || e.from > hi) continue;
            for (const b of this.slice(e.bars, lo, hi))partial.set(b.time, b);
        }
        if (partial.size === 0) return {
            state: 'loading',
            timeframe,
            barMs
        };
        const bars = [
            ...partial.values()
        ].sort((a, b)=>a.time - b.time);
        return {
            state: 'loading',
            timeframe,
            barMs,
            bars
        };
    }
    /** Kick ONE background fetch for the padded window. Any OVERLAPPING in-flight fetch
     *  defers this one (a corner drag repaints per pointer move — kicking a window per
     *  frame would spam the provider); when it lands, the next paint re-evaluates. */ fetchWindow(key, entries, timeframe, lo, hi) {
        if (entries.some((e)=>e.pending && e.to >= lo && e.from <= hi)) return;
        const pad = (hi - lo) * PAD_FRAC;
        const entry = {
            from: lo - pad,
            to: hi + pad,
            bars: [],
            fetchedAt: 0,
            pending: true,
            failedAt: 0
        };
        entries.push(entry);
        this.cache.set(key, entries);
        this.evict();
        void this.deps.fetchBars(timeframe, {
            from: entry.from,
            to: entry.to
        }).then((bars)=>{
            entry.bars = bars;
            entry.fetchedAt = Date.now();
            entry.pending = false;
            this.absorbOverlaps(key, entry);
            this.fire();
        }).catch(()=>{
            // Environmental (network/provider) — park the window so paints don't hot-loop
            // retries; RETRY_MS later a paint drops it and tries again.
            entry.pending = false;
            entry.failedAt = Date.now();
            this.fire();
        });
    }
    /** A window whose right edge reaches the newest fetched bar refreshes at most once per
     *  bar interval — new closed bars ride the feed's cache, only the live tail re-fetches. */ maybeRefresh(key, entry, timeframe, barMs, hi) {
        if (entry.pending) return;
        const lastBar = entry.bars.length > 0 ? entry.bars[entry.bars.length - 1].time : entry.from;
        if (hi < lastBar) return; // fully historical — closed bars don't change
        if (Date.now() - entry.fetchedAt < barMs) return;
        entry.pending = true;
        void this.deps.fetchBars(timeframe, {
            from: entry.from,
            to: entry.to
        }).then((bars)=>{
            entry.bars = bars;
            entry.fetchedAt = Date.now();
            entry.pending = false;
            this.fire();
        }).catch(()=>{
            // Keep serving the stale window; the next eligible paint retries.
            entry.pending = false;
            entry.fetchedAt = Date.now();
        });
    }
    /** Merge windows that overlap `entry` into it (dedupe by bar time) so a key's list
     *  converges instead of accumulating slivers. */ absorbOverlaps(key, entry) {
        const entries = this.cache.get(key);
        if (!entries) return;
        for(let i = entries.length - 1; i >= 0; i -= 1){
            const other = entries[i];
            if (other === entry || other.pending || other.failedAt > 0) continue;
            if (other.to < entry.from || other.from > entry.to) continue;
            const byTime = new Map();
            for (const b of other.bars)byTime.set(b.time, b);
            for (const b of entry.bars)byTime.set(b.time, b); // the fresh fetch wins ties
            entry.bars = [
                ...byTime.values()
            ].sort((a, b)=>a.time - b.time);
            entry.from = Math.min(entry.from, other.from);
            entry.to = Math.max(entry.to, other.to);
            entry.fetchedAt = Math.min(entry.fetchedAt, other.fetchedAt || entry.fetchedAt);
            entries.splice(i, 1);
        }
    }
    /** Drop the oldest settled windows once the global count passes {@link MAX_ENTRIES}. */ evict() {
        let total = 0;
        for (const entries of this.cache.values())total += entries.length;
        while(total > MAX_ENTRIES){
            let oldestKey = null;
            let oldestIdx = -1;
            let oldestAt = Infinity;
            for (const [key, entries] of this.cache){
                for(let i = 0; i < entries.length; i += 1){
                    const e = entries[i];
                    if (e.pending) continue; // never drop an in-flight window
                    const at = e.fetchedAt || e.failedAt;
                    if (at < oldestAt) {
                        oldestKey = key;
                        oldestIdx = i;
                        oldestAt = at;
                    }
                }
            }
            if (oldestKey == null) return; // everything in flight — nothing evictable
            const entries = this.cache.get(oldestKey);
            entries.splice(oldestIdx, 1);
            if (entries.length === 0) this.cache.delete(oldestKey);
            total -= 1;
        }
    }
    /** Bars whose open time falls within `[lo, hi]` (ascending input → linear scan is fine). */ slice(bars, lo, hi) {
        const out = [];
        for (const b of bars){
            if (b.time < lo) continue;
            if (b.time > hi) break;
            out.push(b);
        }
        return out;
    }
    fire() {
        for (const l of [
            ...this.listeners
        ])l();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/engine/EngineOrchestrator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EngineOrchestrator",
    ()=>EngineOrchestrator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$series$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/model/series.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$events$2f$EventBus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/events/EventBus.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$IndicatorRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/engine/IndicatorRegistry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/native-indicators/NativeIndicator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$LiveSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/engine/LiveSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$IndicatorHandleImpl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/engine/IndicatorHandleImpl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$inspect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/engine/inspect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$visible$2d$range$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/visible-range.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/DrawingController.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$marks$2f$MarksController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/marks/MarksController.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$DrawingSeriesService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/engine/DrawingSeriesService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/timeframe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/data/ProviderRegistry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$price$2d$styles$2f$BarTransform$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/price-styles/BarTransform.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/chart-types/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/theme.ts [app-client] (ecmascript)");
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
/** Coalesce rapid pan/zoom viewport events into one re-run (ms). */ const VIEWPORT_DEBOUNCE_MS = 150;
/** `script:run` collapse window for FORMING-bar runs only — a stream re-executes the open
 *  candle several times a second, and a dashboard cannot use that rate. Every other cause
 *  (a new bar above all) is emitted unconditionally. */ const RUN_EMIT_THROTTLE_MS = 1_000;
/** Bars in the quick recent-window preview a RANGELESS feed paints before the deep fetch. */ const PREVIEW_BARS = 300;
/**
 * Depth a ranged feed serves in ONE request. A round trip costs far more than the extra
 * rows: splitting this range into a small head plus a stream of widening chunks paid for
 * itself only in time-to-first-candle, and nothing downstream can use those first candles
 * anyway — an indicator's first run is held until the whole depth has landed (Pine is
 * causal, so running it per chunk would repaint a different curve each time). Below this
 * line, one request wins outright. (Feeds with `loadProgressive` never reach this split:
 * their SOURCE decides what is paintable, snapshot by snapshot.)
 */ const SINGLE_LOAD_BARS = 5_000;
/**
 * Beyond {@link SINGLE_LOAD_BARS} the history loads BACKWARD in chunks of this many bars:
 * the chart is interactive after the first chunk while older ones stream in behind it
 * (each a bounded request the data source answers quickly, instead of one giant fetch that
 * stalls silently and lands as a single main-thread-freezing parse).
 */ const CHUNK_BARS = 10_000;
/**
 * A progressive source's FIRST paint waits for at least this many bars (or the full ask,
 * whichever is smaller): the first paint is the frame the renderer sizes the view against,
 * and framing onto a 2-3 bar head draws a few giant candles that later view-preserved
 * repaints never fix. The FINAL answer always paints whatever exists — a genesis-era
 * symbol may simply have fewer bars than this. The number's history: 100 starved short
 * monthly contracts for the provider's whole poll budget (~90 s measured); briefly 1
 * (no hold), which framed unusable slivers; 20 frames a readable view on every timeframe
 * now that the server converges small monthlies in seconds.
 */ const FIRST_PAINT_BARS = 20;
/**
 * A live bar more than this many intervals ahead of the last one signals MISSED bars (a throttled
 * background tab, a socket reconnect, system sleep) → backfill. 1.5 tolerates timestamp drift and
 * variable-length periods (a 31-day month on the ~30-day 'M' interval) without false positives.
 */ const GAP_FACTOR = 1.5;
/**
 * Minimum time between gap heals. A heal that comes back EMPTY (a legitimately tradeless interval
 * on an illiquid symbol — providers omit empty candles) must not re-trigger on every tick; within
 * the cooldown a discontinuous bar is accepted as a real market gap.
 */ const HEAL_COOLDOWN_MS = 5_000;
/** Floor between two intrabar updates of a replayed bar (~one frame) — at a faster pace,
 *  ticks are folded into one update rather than painted faster than the screen refreshes. */ const MIN_TICK_UPDATE_MS = 16;
class EngineOrchestrator {
    renderer;
    feed;
    config;
    dataControl;
    events;
    registry;
    /** Top-to-bottom pane display order (price always first). The routing + `chart.panes`
     *  source of truth; the renderer mirrors it via `orderPanes`. */ paneOrder;
    /** Panes currently collapsed to a strip (mirror of the renderer's visual state). */ collapsedPanes;
    /** The maximized pane (mirror), or null when the split is normal. */ maximizedPaneId;
    paneActionUnsub;
    handles;
    engines;
    defaultLanguage;
    live;
    /**
     * The chart's bar VIEW — what the renderer, engines, and natives consume. With no bar
     * transform active it IS {@link rawBars} (same reference, zero cost); under a transforming
     * price style (Heikin Ashi) it's the derived series, index-aligned 1:1 with the raw one.
     */ bars;
    /** The RAW market data, exactly as the feed served it — the source of truth. The `'bar'`
     *  event, gap-heal reconciliation, and `chart.data` stay on this plane; nothing synthetic
     *  is ever stored or emitted as data. */ rawBars;
    /** The active price style's 1:1 bar transform (null ≡ raw view). */ barTransform;
    // ── chart-type data engines (SDK): one lazily-created engine per style id ──
    typeEngines;
    /** Last-seen chart-type settings per type id (dialog edits + persisted restores) —
     *  replayed into a data engine whenever one is (re)created. */ typeSettings;
    /** The style id whose data engine is currently ACTIVE (drives suspend/resume + pokes). */ activeEngineStyle;
    /** The chart's current price style (tracked from the renderer's change events + initial read). */ priceStyle;
    readyPromise;
    unresolvedUnsub;
    /** Latest chart visible range (left/right bar times), fed to viewport-dependent scripts. */ visibleRange;
    viewportUnsub;
    viewportTimer;
    // ── live gap-heal state (missed bars while a tab was backgrounded/frozen) ──
    /** A backfill fetch is in flight; live ticks arriving meanwhile buffer + replay after it. */ healing;
    healBuffer;
    lastHealAt;
    /** The `visibilitychange` catch-up listener (removed on destroy). */ onVisible;
    // ── bar replay: `rawBars` holds the history up to the cursor, the rest waits here ──
    /** Bars still hidden right of the replay cursor, oldest first; null ≡ replay off. */ replayQueue;
    replayTimer;
    replayPlaying;
    replayIntervalMs;
    /** The depth (`market.bars`) before a replay deepened the history — restored when it ends. */ replayDepth;
    /** A start is loading older history before it can cut; `seek` = a replay was running
     *  (and left silently to deepen), so abandoning the load must announce its end. */ replayLoading;
    /** A replay carried over a timeframe/session switch, between the old series' silent end
     *  and the cut of the new one: still ACTIVE for the outside (`replayState`), resumed
     *  at `revealedEnd` once the new bars land, unless stopped (`cancelled`) meanwhile. */ replayCarrying;
    /** Intrabar prices for the bars replay reveals — null ≡ whole bars. */ replayTickSource;
    /** The bar being revealed tick by tick: its stored form (what it settles on), its ticks,
     *  the next tick to apply, the candle built so far, the volume each tick adds when the
     *  ticks carry none, and its pacing (ticks per update, ms between updates — one play
     *  interval per tick — and the clock time tick 0 is due at, so late timers catch up). */ replayForming;
    /** Tick requests by bar time, shared by prefetch and playback; `ticks` once they landed. */ replayTickFetches;
    /** Aborts the tick requests in flight — renewed whenever the replay moves on. */ replayTickAbort;
    /** What the last applied bar did: refine the open candle, or open a new one (which
     *  settles the previous). Read by the `script:run` cause attribution. */ barCause;
    // ── deep-history backfill (older chunks streaming in behind the interactive chart) ──
    /** Where the history load stands. Stamped into new sessions + every bar notification. */ historyState;
    /** Invalidates detached async work (backfill loops, in-flight loads, gap heals):
     *  bumped by init(), setMarket() and destroy(). */ generation;
    /** Aborts the in-flight PROGRESSIVE load's source polling on supersession — an
     *  abandoned stream left polling to its own budget starves the browser's per-host
     *  connection pool, and the NEXT symbol's very first fetch with it (measured). */ progressiveAbort;
    /** Awaiters racing a superseded load (setMarket callers) — released on every bump so they never hang. */ supersedeWaiters;
    /** `history:complete` fired for the CURRENT load. Each market load re-arms the cycle
     *  (see {@link resetHistoryTracking}) — `historyComplete()` is per-load, not per-chart. */ historyCompleted;
    resolveHistoryComplete;
    historyCompletePromise;
    /** A setMarket switch is in flight: bar/viewport pokes to the OLD sessions are held
     *  (they must not re-run over the incoming market's bars — re-execution follows the load). */ switchingMarket;
    /** A load is in flight with nothing painted — the state behind the renderer's loading
     *  affordance and the `load:start`/`load:end` event pair (transition-guarded). */ loadingUp;
    constructor(container, renderer, feed, engines, config, dataControl){
        this.renderer = renderer;
        this.feed = feed;
        this.config = config;
        this.dataControl = dataControl;
        this.events = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$events$2f$EventBus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypedEventBus"]();
        this.registry = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$IndicatorRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndicatorRegistry"]();
        this.paneOrder = [
            'price'
        ];
        this.collapsedPanes = new Set();
        this.maximizedPaneId = null;
        this.paneActionUnsub = null;
        this.handles = new Map();
        this.engines = new Map();
        this.live = null;
        this.bars = [];
        this.rawBars = [];
        this.barTransform = null;
        this.typeEngines = new Map();
        this.typeSettings = new Map();
        this.activeEngineStyle = null;
        this.priceStyle = 'candles';
        this.unresolvedUnsub = null;
        this.visibleRange = null;
        this.viewportUnsub = null;
        this.viewportTimer = null;
        this.healing = false;
        this.healBuffer = [];
        this.lastHealAt = 0;
        this.onVisible = null;
        this.replayQueue = null;
        this.replayTimer = null;
        this.replayPlaying = false;
        this.replayIntervalMs = 1_000;
        this.replayDepth = null;
        this.replayLoading = null;
        this.replayCarrying = null;
        this.replayTickSource = null;
        this.replayForming = null;
        this.replayTickFetches = new Map();
        this.replayTickAbort = null;
        this.barCause = 'tick';
        this.historyState = 'complete';
        this.generation = 0;
        this.progressiveAbort = null;
        this.supersedeWaiters = [];
        this.historyCompleted = false;
        this.historyCompletePromise = new Promise((resolve)=>{
            this.resolveHistoryComplete = resolve;
        });
        this.switchingMarket = false;
        this.loadingUp = false;
        /** Auto-add the built-in volume indicator. Bar volume needs no capability probe (always supported). */ /** The user removed the volume indicator — the auto-add must never override that. */ this.volumeOptedOut = false;
        /** Throttled (1/s per indicator) 'context:changed' — streamed models re-emit per tick,
     *  consumers only need a coarse re-pull signal. Fires only for context-capable sessions. */ this.contextEmitAt = new Map();
        /**
     * Build and emit `script:run`. Costs NOTHING when nobody listens — the engine-context
     * pull that fills `vars`/`strategy` only happens for an actual subscriber.
     *
     * Throttling is deliberately asymmetric: a stream re-executes the forming bar several
     * times a second and those `'tick'` runs collapse to ~1/s, but every other cause fires
     * unconditionally. Dropping a `'bar'` run would silently break the one thing a
     * recorder keys off — the moment a bar became final.
     */ this.runEmitAt = new Map();
        // Register the construction-time engines (bulk sugar for registerEngine).
        for (const engine of engines)this.registerEngine(engine.language, engine);
        this.defaultLanguage = config.defaultLanguage;
        this.renderer.mount(container, config.theme);
        // The renderer's in-chart settings dialog reports edits here → re-run that indicator.
        this.renderer.onInputChange((e)=>e.kind === 'prop' ? this.applyProps(e.indicatorId, {
                [e.key]: e.value
            }) : this.applyInputs(e.indicatorId, {
                [e.key]: e.value
            }));
        // The renderer's in-chart legend ✕ reports a removal here → tear the indicator down.
        this.renderer.onRemoveIndicator((id)=>this.removeIndicator(id));
        // The renderer's in-chart legend eye reports a hide/show here → suspend/resume the indicator.
        this.renderer.onToggleIndicatorVisible?.((id, visible)=>this.setVisible(id, visible));
        // Pane hover buttons + double-clicks report layout intents here (delete tears down the
        // pane's indicators; the rest are already applied by the renderer — this keeps the
        // `chart.panes` view + collapse/maximize mirror in sync).
        this.paneActionUnsub = this.renderer.onPaneAction?.((a)=>this.handlePaneAction(a)) ?? null;
        // Chart-type SDK settings edited in the renderer's dialog (or replayed by
        // applyConfig on a persisted restore) → remember them AND forward to the
        // type's data engine. The cache matters: the engine may not exist yet (a
        // restored config lands before the style's first activation) or may be
        // recreated later (a market switch) — `startChartTypeEngine` replays the
        // last-seen values into every fresh engine, so one never fetches on schema
        // defaults the user has edited away.
        this.renderer.onChartTypeSettingsChange?.((typeId, values)=>{
            this.typeSettings.set(typeId, values);
            this.typeEngines.get(typeId)?.onSettings?.(values);
        });
        // The renderer's legend "Move to" menu / row drag reports a move here → route it.
        this.renderer.onMoveIndicator?.((id, target)=>this.moveIndicator(id, target));
        // The renderer's in-chart theme control (settings dialog Canvas → Theme) reports a
        // request here — the core owns the canonical theme, applies it, and announces it.
        this.renderer.onThemeSelect?.((name)=>this.setTheme((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTheme"])(name)));
        // Pan/zoom → re-run ONLY visible-range-dependent scripts (e.g. visible-range
        // volume profile) with the new window. Debounced so a drag re-runs once.
        this.viewportUnsub = this.renderer.onViewportChange((range)=>this.onViewportChange(range));
        // Price-style changes (feature set / settings dialog / config template) — a chart
        // type may carry a DATA requirement beyond drawing: a bar-stream transform
        // (heikinashi) and/or a registered data engine (SDK chart types).
        this.renderer.onPriceStyleChange?.((style)=>this.syncPriceStyle(style));
        // Seed the bar transform from the CONSTRUCTED style (a chart created with
        // `priceStyle: 'heikinashi'`) so the initial load already produces the view.
        const initialStyle = this.renderer.readFeature('priceStyle');
        if (typeof initialStyle === 'string') this.priceStyle = initialStyle;
        this.barTransform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$price$2d$styles$2f$BarTransform$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["barTransformFor"])(initialStyle);
        // User drawings: owns the model + tool/selection state, drives the renderer's
        // drawings port (inert when the renderer lacks the `userDrawings` capability).
        // The series service backs data-driven drawings that read a finer timeframe:
        // it rides the feed's cache-backed ranged fetch, same path as `request.security`.
        const drawingSeries = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$DrawingSeriesService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingSeriesService"]({
            fetchBars: (tf, range)=>this.fetchSeries(this.config.market.symbol ?? '', tf, range),
            canFetch: ()=>!!this.feed.loadRange && !this.config.market.data?.length && !!this.config.market.symbol,
            chartTimeframe: ()=>this.config.market.timeframe ?? '60',
            marketKey: ()=>`${this.config.market.symbol ?? ''}|${this.config.market.session ?? ''}`
        });
        this.drawings = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingController"](this.renderer, this.events, config.drawings, drawingSeries);
        this.marks = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$marks$2f$MarksController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarksController"](this.renderer, this.events);
        // A symbol nothing can serve leaves the load PARKED; publish it so a host can say so
        // instead of showing a blank chart forever (it still resumes if a provider registers).
        // A parked load also ends the loading state — nothing is coming, and an endless
        // animation over the empty chart would promise otherwise.
        this.unresolvedUnsub = this.feed.onUnresolved?.((info)=>{
            this.endLoad();
            this.events.emit('data:unresolved', info);
        }) ?? null;
        this.readyPromise = this.init();
        // Seed a constructed chart-type DATA engine only now — `startChartTypeEngine`
        // awaits `readyPromise`, so this MUST come after the assignment above. Seeding
        // earlier awaited `undefined`: the engine started before the first load, could
        // not resolve its provider surfaces (e.g. a footprint feed), and a later
        // style re-select only RESUMED the empty engine — a restored plugin style
        // painted nothing until a market switch recreated it.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chartType"])(initialStyle)?.dataEngine) this.syncChartTypeEngine(initialStyle);
    }
    /** The user-drawings manager (backs `chart.drawings`). */ drawings;
    /** The timeline-marks manager (backs `chart.marks`). */ marks;
    /**
     * The visible range to feed a run. Prefer the latest viewport-change event, but
     * fall back to querying the renderer directly — the native renderer doesn't emit
     * a viewport-change for its initial fitContent, so on the first run the event
     * hasn't fired yet and a visible-range script (e.g. `chart.left_visible_bar_time`)
     * would otherwise see the whole dataset instead of the visible window.
     */ currentVisibleRange() {
        if (this.visibleRange) return this.visibleRange;
        const r = this.renderer.getVisibleRange();
        return r ? {
            left: r.from,
            right: r.to
        } : undefined;
    }
    /** Resolve the engine for a language, defaulting when unspecified. */ engineFor(language) {
        const lang = language ?? this.defaultLanguage;
        const engine = this.engines.get(lang);
        if (!engine) {
            throw new Error(`[vela] no scripting engine registered for language "${lang}". Vela ships none — ` + `install one (Pine Script: @luxalgo/vela-pinets) and register it before addIndicator, ` + `e.g. chart.registerEngine('pine', new PineEngine()).`);
        }
        return engine;
    }
    /** Market metadata for an execution (Vela owns the bars). */ market() {
        return {
            symbol: this.config.market.symbol ?? 'TEST',
            timeframe: this.config.market.timeframe ?? '60',
            symbolInfo: this.feed.symbolInfo?.(this.config.market),
            chartStyle: this.priceStyle
        };
    }
    /**
     * The data gateway handed to engines: fetch ANY `(symbol, timeframe)` series
     * through the feed + cache. Used for secondary series (request.security
     * HTF/LTF/cross-symbol). The symbol is passed through so the feed resolves its
     * OWN `provider:` prefix (cross-exchange) — falling back to the chart's provider
     * for a bare symbol. No aggregation; timeframes stay separate.
     *
     * Chart-type modifiers: providers only ever serve RAW market data — any transform
     * is applied here, above them, on the fetched series' OWN timeframe. The EXTENDED
     * ticker decides, explicitly: `"SYM;heikinashi"` fetches the derived series,
     * anything else (including `"SYM;standard"`) fetches raw. The engine composes the
     * modifier — on a Heikin Ashi chart `syminfo.tickerid` carries `";heikinashi"`, so
     * default same-symbol `request.security` calls inherit the chart type, while a
     * plain/`ticker.standard()` symbol explicitly opts back into standard data.
     */ async fetchSeries(symbol, timeframe, range) {
        const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$price$2d$styles$2f$BarTransform$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseExtendedTicker"])(symbol);
        const cfg = {
            symbol: parsed.symbol,
            timeframe
        };
        const bars = await (this.feed.loadRange ? this.feed.loadRange(cfg, range) : this.feed.load({
            ...cfg,
            bars: range.limit
        }));
        return parsed.transform ? parsed.transform.full(bars) : bars;
    }
    onViewportChange(range) {
        this.visibleRange = {
            left: range.from,
            right: range.to
        };
        this.events.emit('viewport:changed', {
            from: range.from,
            to: range.to
        });
        if (this.viewportTimer != null) clearTimeout(this.viewportTimer);
        this.viewportTimer = setTimeout(()=>{
            this.viewportTimer = null;
            if (this.switchingMarket) return; // old sessions must not re-run mid-switch
            const window = this.visibleRange;
            if (!window) return;
            for (const record of this.registry.all()){
                if (!record.renderHandle || record.hidden) continue;
                // range-aware indicators re-run / refetch with the new window
                if (record.session && record.prepared?.reactsToViewport) {
                    record.pendingCause = 'viewport';
                    record.session.setVisibleRange(window);
                } else if (record.native?.descriptor.reactsToViewport) record.native.instance.onViewport({
                    from: window.left,
                    to: window.right
                });
            }
            // An active chart-type data engine streams in newly-visible data as the user scrolls.
            if (this.activeEngineStyle) this.typeEngines.get(this.activeEngineStyle)?.onViewport?.({
                from: window.left,
                to: window.right
            });
        }, VIEWPORT_DEBOUNCE_MS);
    }
    async init() {
        const gen = this.bumpGeneration();
        this.beginLoad(true); // first load — nothing painted until the first batch
        await this.loadMarket(gen, {
            firstLoad: true
        });
        if (this.generation !== gen) return; // superseded mid-load (a setMarket, or destroy)
        this.startLive();
        this.events.emit('ready', undefined);
    }
    /** Bump the generation — superseding every detached continuation — and release
     *  superseded setMarket awaiters so their promises resolve instead of hanging. */ bumpGeneration() {
        const gen = ++this.generation;
        this.progressiveAbort?.abort(); // the superseded load's source stops polling promptly
        this.progressiveAbort = null;
        for (const w of this.supersedeWaiters.splice(0))w();
        return gen;
    }
    /**
     * Enter the loading state: raise the renderer's affordance and tell the plugins
     * (`load:start`) — BEFORE the series is blanked or fetched, so extensions and custom
     * indicators can hide or reset their own visuals first. Transition-guarded: a switch
     * superseding a still-loading switch re-enters silently.
     */ beginLoad(firstLoad) {
        if (this.loadingUp) return;
        this.loadingUp = true;
        this.renderer.setLoading?.(true);
        const m = this.config.market;
        this.events.emit('load:start', {
            symbol: m.symbol ?? 'TEST',
            timeframe: m.timeframe ?? '60',
            firstLoad
        });
    }
    /** Leave the loading state (first bars painted, or a load that ended with none) —
     *  drops the affordance and fires the matching `load:end`. */ endLoad() {
        if (!this.loadingUp) return;
        this.loadingUp = false;
        this.renderer.setLoading?.(false);
        const m = this.config.market;
        this.events.emit('load:end', {
            symbol: m.symbol ?? 'TEST',
            timeframe: m.timeframe ?? '60',
            bars: this.bars.length
        });
    }
    /**
     * Load the configured market's history into the chart — THE shared load pipeline
     * behind {@link init} and {@link setMarket}. Up to {@link SINGLE_LOAD_BARS} the whole
     * depth comes in ONE request: a round trip dominates the row count, and splitting the
     * range buys a faster first candle that nothing can use — an indicator's first run is
     * held until the full depth lands anyway. DEEPER than that, the load is progressive:
     * the newest {@link CHUNK_BARS} paint immediately and the rest streams in behind them
     * through the shared backfill loop, so the pipeline resolves at the first paint (await
     * {@link historyComplete} for the full depth) and sessions started meanwhile are
     * stamped 'backfill' until 'complete'. Offline data is a single fetch; a rangeless
     * feed keeps the preview-then-full shape, since it cannot fetch a range at all.
     * EVERY await is followed by a generation check so a superseded load (newer
     * setMarket, destroy) abandons without touching the chart. `firstLoad` activates the
     * bar-following layers once (volume auto-add) — a market SWITCH must not re-add what
     * the user has since removed.
     */ async loadMarket(gen, opts) {
        try {
            await this.loadMarketInner(gen, opts);
        } finally{
            // The owning load always ends the loading state — this is the belt for the paths
            // that never hand the renderer a non-empty series (a failed fetch, an empty
            // market). A superseded load leaves the state to its successor.
            if (this.generation === gen) this.endLoad();
        }
    }
    async loadMarketInner(gen, opts) {
        const market = this.config.market;
        const requested = market.bars ?? 500;
        const initialRange = market.visibleRange;
        // Only a DEEP request is worth splitting, and only when a requested initial window
        // does not pin the frame (a chunked load would paint the wrong range, then jump).
        const deep = !market.data?.length && initialRange == null && requested > SINGLE_LOAD_BARS;
        // PROGRESSIVE-CAPABLE source first: paint every snapshot it emits while it heals —
        // first candles in seconds on a cold symbol, depth growing behind them — and
        // complete when the final answer resolves. The pipeline returns at the FIRST paint
        // (exactly the deep head + backfill shape below); the remainder streams in,
        // generation-checked. Snapshots are cumulative and confirmed-from-the-newest-bar
        // by the port contract, so each paint replaces the series with a superset,
        // viewport preserved. A NULL resolution means the resolved provider lacks the
        // capability — no snapshot was emitted, and the classic paths below run untouched.
        let progressiveServed = false;
        if (!market.data?.length && initialRange == null && this.feed.loadProgressive) {
            let painted = false;
            const paint = (bars, final)=>{
                if (this.generation !== gen || !final && bars.length === 0) return;
                if (!painted && !final && bars.length < Math.min(requested, FIRST_PAINT_BARS)) return; // hold the framing paint until it can carry the view
                if (painted && this.replayQueue) {
                    this.mergeHistoryIntoReplay(bars); // a replay started before the history converged keeps its cut
                    return;
                }
                this.setBarSeries(bars, painted ? {
                    preserveView: true
                } : undefined);
                if (!painted && bars.length > 0) {
                    painted = true;
                    if (opts.firstLoad) this.activateBarLayers();
                    if (!final) this.historyState = 'backfill';
                }
            };
            const abort = new AbortController();
            this.progressiveAbort = abort;
            progressiveServed = await new Promise((firstPaint)=>{
                let signaled = false;
                const signal = (served)=>{
                    if (!signaled) {
                        signaled = true;
                        firstPaint(served);
                    }
                };
                // Supersession must release THIS wait immediately (the newer switch owns the
                // chart) — the provider's own resolution can lag its abort by one poll.
                abort.signal.addEventListener('abort', ()=>signal(true), {
                    once: true
                });
                this.feed.loadProgressive(market, (bars)=>{
                    paint(bars, false);
                    if (painted) signal(true);
                }, {
                    signal: abort.signal
                }).then((full)=>{
                    if (this.progressiveAbort === abort) this.progressiveAbort = null;
                    if (full == null) return signal(false); // incapable — classic paths take over
                    if (this.generation !== gen) return signal(true);
                    paint(full, true);
                    this.completeHistory(full.length >= requested ? 'depth' : 'genesis');
                    signal(true);
                }).catch(()=>{
                    if (this.progressiveAbort === abort) this.progressiveAbort = null;
                    if (this.generation === gen) this.completeHistory('aborted');
                    signal(true);
                });
            });
        }
        if (progressiveServed) {
        /* painted above; the final snapshot and completion stream in behind */ } else if (deep && this.feed.loadRange) {
            // Paint the newest chunk, stream the rest in behind it. The first chunk is a full
            // CHUNK_BARS, not a token head: at this depth the round trips are what cost, so
            // each one carries as much as the source answers well.
            const head = await this.feed.load({
                ...market,
                bars: Math.min(requested, CHUNK_BARS)
            });
            if (this.generation !== gen) return;
            this.setBarSeries(head);
            if (opts.firstLoad) this.activateBarLayers(); // bar-following layers ride the FIRST candles
            if (head.length > 0 && requested > head.length) {
                this.historyState = 'backfill';
                void this.backfillHistory(gen, requested);
            } else {
                this.completeHistory('depth'); // the source had no more than one chunk of history
            }
        } else if (deep) {
            // RANGELESS feed at depth: it cannot fetch a range, so chunking would re-download
            // the head every time — keep the two-fetch shape, a quick preview then everything.
            const preview = await this.feed.load({
                ...market,
                bars: PREVIEW_BARS
            });
            if (this.generation !== gen) return;
            this.setBarSeries(preview);
            if (opts.firstLoad) this.activateBarLayers(); // bar-following layers follow the FIRST candles, not the deep fetch
            const full = await this.feed.load(market);
            if (this.generation !== gen) return;
            this.setBarSeries(full, {
                preserveView: true
            });
            this.completeHistory('depth');
        } else {
            const bars = await this.feed.load(market);
            if (this.generation !== gen) return;
            this.setBarSeries(bars);
            if (opts.firstLoad) this.activateBarLayers();
            this.completeHistory('depth');
        }
        // Frame the requested window NOW: `setBarSeries` only invalidated, so this lands in the
        // very first painted frame — no wrong-window flash, no re-frame jump.
        if (initialRange != null) {
            if (typeof initialRange === 'string') this.setVisibleRangePreset(initialRange);
            else this.renderer.setVisibleRange(initialRange);
        }
        // Price-axis precision: try the (already cached) tick size now, then resolve async so the
        // axis switches from the zoom formula to the symbol's true precision as soon as it lands.
        this.refreshPriceFormat();
        void this.ensurePriceFormat();
    }
    /** Start the live tick subscription + the tab-restore catch-up listener. */ startLive() {
        if (!this.config.live) return;
        this.live = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$LiveSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveSession"](this.feed, this.config.market, (bar)=>this.onBar(bar));
        this.live.start();
        // Tab-restore catch-up: browsers throttle hidden tabs (timers → 1/min, sockets can
        // freeze), so bars close unseen while backgrounded. On return, backfill from the last
        // known bar IMMEDIATELY instead of waiting for the next tick to expose the hole (on a
        // quiet symbol that could be many seconds away).
        if (typeof document !== 'undefined') {
            this.onVisible = ()=>{
                if (document.visibilityState !== 'visible') return;
                const last = this.bars[this.bars.length - 1];
                if (!last || this.healing || !this.canHeal() || Date.now() - this.lastHealAt <= HEAL_COOLDOWN_MS) return;
                void this.healGap(last.time);
            };
            document.addEventListener('visibilitychange', this.onVisible);
        }
    }
    /** Stop live ticks + the visibility listener and clear the gap-heal state (switch/destroy). */ stopLive() {
        this.live?.stop();
        this.live = null;
        if (this.onVisible && typeof document !== 'undefined') document.removeEventListener('visibilitychange', this.onVisible);
        this.onVisible = null;
        this.healing = false;
        this.healBuffer = [];
        this.lastHealAt = 0;
    }
    /** Re-arm per-load history tracking: resolve the PREVIOUS load's promise (awaiters must
     *  never hang on a superseded load), then start a fresh completed-once cycle. */ resetHistoryTracking() {
        this.resolveHistoryComplete();
        this.historyCompleted = false;
        this.historyState = 'complete';
        this.historyCompletePromise = new Promise((resolve)=>{
            this.resolveHistoryComplete = resolve;
        });
    }
    /** The current market identity — a snapshot of the REQUESTED market, so it reflects
     *  an in-flight `setMarket` immediately (the config mutates before the load). */ marketSnapshot() {
        const m = this.config.market;
        return {
            symbol: m.symbol,
            provider: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$ProviderRegistry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSymbol"])(m.symbol ?? '').provider ?? undefined,
            timeframe: m.timeframe,
            bars: m.bars,
            session: m.session,
            offline: m.data !== undefined
        };
    }
    /**
     * Switch the chart's market IN PLACE — no destroy/recreate. The renderer stays
     * mounted (canvases, viewport policy, cosmetic config), panes and indicator records
     * survive, and user drawings are untouched (per-symbol drawing documents are a HOST
     * policy via `chart.drawings.toJSON()/fromJSON()`, keyed off `market:changed`). The
     * bars reload through the shared {@link loadMarket} pipeline, then every consumer
     * restarts over the new market: Pine sessions re-execute, native indicators restart
     * with a fresh context, the active chart-type data engine is rebuilt, and the live
     * subscription re-targets.
     *
     * Resolves once the new market's history is painted — a deep backfill continues
     * BEHIND it (await {@link historyComplete} for full depth). A call superseded by a
     * newer setMarket (or destroy) resolves silently. Emits `market:changed` (with
     * `prev`) when the market IDENTITY changed; a depth-only reload (`bars`) is silent.
     */ async setMarket(next) {
        const m = this.config.market;
        const identityChanged = next.symbol !== undefined && next.symbol !== m.symbol || next.timeframe !== undefined && next.timeframe !== m.timeframe || next.session !== undefined && next.session !== m.session || next.data !== undefined;
        const depthChanged = next.bars !== undefined && next.bars !== m.bars;
        // A switch that keeps the symbol and its clock (timeframe, session) carries a running
        // replay over: the new series is cut where the old one stood — see `carryReplay`.
        const sameClock = identityChanged && next.data === undefined && (next.symbol === undefined || next.symbol === m.symbol) && (next.timeframe !== undefined || next.session !== undefined);
        // A switch landing while an earlier carry still waits for its bars takes the carry
        // over (same clock) or ends it (another symbol); a depth-only reload — the carry's
        // own deepening among them — leaves it be.
        const pending = identityChanged ? this.replayCarrying : null;
        if (pending) {
            this.replayCarrying = null;
            if (!sameClock) {
                pending.cancelled = true;
                this.events.emit('replay:end', {
                    reason: 'market'
                });
            }
        }
        const replayCarry = this.replayQueue && sameClock && this.rawBars.length > 0 ? {
            revealedEnd: this.rawBars[this.rawBars.length - 1].time + this.barIntervalMs(),
            playing: this.replayPlaying,
            cancelled: false
        } : pending && sameClock ? {
            revealedEnd: pending.revealedEnd,
            playing: pending.playing,
            cancelled: false
        } : null;
        if (pending) pending.cancelled = true; // superseded: whatever it was waiting on is moot
        if (replayCarry) this.replayCarrying = replayCarry;
        if (replayCarry && this.replayQueue) {
            this.endReplay(null, {
                restore: false,
                resume: false
            }); // silent: the replay resumes on the new series
            const depth = this.replayDepth;
            this.replayDepth = null;
            if (depth && next.bars === undefined) {
                if (depth.bars === undefined) delete m.bars;
                else m.bars = depth.bars;
            }
        }
        // A reload replaces the history a replay walks. A depth-only change keeps the market,
        // so the full history comes back first and the new depth applies to all of it.
        if (this.replayQueue && (identityChanged || depthChanged)) this.endReplay('market', {
            restore: !identityChanged,
            resume: false
        });
        // A switch during a start's history load abandons it — and must not load the new
        // market at the depth that start borrowed.
        if (this.replayLoading && (identityChanged || depthChanged)) {
            const depth = this.replayDepth;
            this.abandonReplayLoad('market');
            if (depth && next.bars === undefined) {
                if (depth.bars === undefined) delete m.bars;
                else m.bars = depth.bars;
            }
        }
        // Same market, only deeper/shallower, with bars already on screen: handled by moving
        // the array's oldest edge instead of reloading (see `extendDepth`). An offline `data`
        // series has no source to extend from, and GROWING needs a ranged feed to fetch the
        // missing older bars — without one the reload is the only way to get them. Shrinking
        // needs no source at all: it is a trim of what is already held.
        const depthOnly = depthChanged && !identityChanged && this.rawBars.length > 0 && !m.data?.length && ((next.bars ?? 0) <= this.rawBars.length || typeof this.feed.loadRange === 'function');
        if (!identityChanged && !depthChanged) {
            // Nothing to reload — honor at most a framing request.
            if (typeof next.visibleRange === 'string') this.setVisibleRangePreset(next.visibleRange);
            else if (next.visibleRange) this.renderer.setVisibleRange(next.visibleRange);
            return;
        }
        const prev = {
            symbol: m.symbol ?? 'TEST',
            timeframe: m.timeframe ?? '60'
        };
        // A SESSION-ONLY flip (RTH↔ETH) changes WHICH bars exist but not the time axis:
        // the user's zoom/position carries over to the reload — captured here, before the
        // quiesce below discards it — unless the caller framed a window of its own. Any
        // other identity change keeps today's re-frame (a new symbol's clock is new).
        // What carries is the VIEW, not the wall clock: the sessions' bar densities
        // differ ~2.5×, so preserving the raw time window would fatten/thin every candle
        // (a perceived zoom change) — instead the BAR COUNT on screen and the time of
        // the newest visible bar anchor the reframe against the INCOMING series (see
        // the post-load refinement below). The time window still frames the first
        // paint provisionally.
        const sessionOnly = identityChanged && next.session !== undefined && next.data === undefined && (next.symbol === undefined || next.symbol === m.symbol) && (next.timeframe === undefined || next.timeframe === m.timeframe);
        const carried = sessionOnly && next.visibleRange === undefined ? this.currentVisibleRange() : undefined;
        // How many bars the user is LOOKING at — the pixel zoom, in series-neutral form.
        const carriedCount = carried ? this.rawBars.filter((b)=>b.time >= carried.left && b.time <= carried.right).length : 0;
        const gen = this.bumpGeneration();
        this.switchingMarket = true;
        try {
            // Quiesce the OLD market's inbound flow before touching the config.
            this.stopLive();
            if (this.viewportTimer != null) {
                clearTimeout(this.viewportTimer);
                this.viewportTimer = null;
            }
            this.visibleRange = null; // the old market's window means nothing on the new one
            this.resetHistoryTracking();
            // Mutate the market in place (the config object is what every reader holds).
            if (next.symbol !== undefined) m.symbol = next.symbol;
            if (next.timeframe !== undefined) m.timeframe = next.timeframe;
            if (next.bars !== undefined) m.bars = next.bars;
            if (next.session !== undefined) m.session = next.session;
            // Carrying the window is not enough — the incoming series must REACH it, or
            // the viewport clamp throws the user somewhere else (sessions cover very
            // different wall-clock spans for the same bar count: an RTH tape reaches
            // ~2.5× further back than ETH). Bar density is at most one per interval, so
            // this count always covers the window's left edge; capped so a view parked
            // years back never triggers a mega-load (the clamp is the honest fallback
            // there). Deepening only — the user's own depth is never shrunk.
            if (carried) {
                const needed = Math.min(Math.ceil((Date.now() - carried.left) / this.barIntervalMs()) + 50, 5000);
                if (needed > (m.bars ?? 500)) m.bars = needed;
            }
            if (next.data !== undefined) m.data = next.data;
            else if (next.symbol !== undefined) delete m.data; // offline → provider switch
            // Consumed by THIS load only (overwritten every switch); a session-only flip
            // re-frames the window the user was looking at.
            m.visibleRange = next.visibleRange ?? (carried ? {
                from: carried.left,
                to: carried.right
            } : undefined);
            // An identity switch blanks the chart NOW: the old market's candles must not sit
            // under the new market's name while its bars load — the loading affordance owns
            // the gap. `load:start` goes out first (with the NEW identity, hence after the
            // config mutation) so plugins hide their own visuals before the blank. A
            // depth-only reload keeps the bars (same market, more history).
            if (identityChanged) {
                this.beginLoad(false);
                this.setBarSeries([], {
                    clearing: true
                });
                // Mounted indicator models are stale the moment the identity changes, but
                // their re-runs land only AFTER the new bars paint. Index-aligned series
                // stop on their own (their anchor matches no new bar) — time-anchored
                // content (drawings, bgcolor spans) and price-anchored hlines would
                // re-project onto the incoming axis and linger. Blank them all now.
                this.blankIndicatorVisuals();
                // The active style's DATA ENGINE still rides the old market — its rebuild only
                // follows the load. Silence it for the gap (its live pushes are stale the moment
                // the identity changed) and blank its channels: per-bar payloads are keyed by
                // bucket open-time, so on a same-timeframe switch the old market's cells would
                // land exactly on the new market's first candles.
                if (this.activeEngineStyle) {
                    this.typeEngines.get(this.activeEngineStyle)?.suspend();
                    this.renderer.setNativeData?.(this.activeEngineStyle, undefined);
                    this.renderer.setNativeData?.(`${this.activeEngineStyle}-pending`, []);
                }
            }
            // A DEPTH-ONLY change is an extension, never a reload: the bars on screen are the
            // same series, so the requested history is a superset (growing) or a suffix
            // (shrinking) of what is already loaded. Re-entering the loader would hand the
            // renderer a fresh short head — a shorter, LATER-starting array — which re-frames
            // the viewport and strands every mounted model's anchor behind the new first bar.
            if (depthOnly) {
                this.extendDepth(gen, m.bars ?? 500);
            } else {
                // Reload through the shared pipeline. The race lets a superseded caller resolve
                // promptly (e.g. a parked load on an unresolvable symbol) instead of hanging.
                await Promise.race([
                    this.loadMarket(gen, {
                        firstLoad: false
                    }),
                    new Promise((resolve)=>this.supersedeWaiters.push(resolve))
                ]);
            }
            if (this.generation !== gen) return; // superseded — the newer switch owns the chart
        } finally{
            // A superseding call set its own flag — only the owning generation clears it.
            if (this.generation === gen) this.switchingMarket = false;
        }
        // The carried view's REFINEMENT: the provisional time window framed the first
        // paint, but sessions differ in bar density (~2.5×), so the same wall clock
        // would fatten/thin every candle — a perceived zoom change. Re-derive the
        // window from the bars that actually LOADED: same BAR COUNT on screen (the
        // pixel zoom), the newest visible time as the anchor. Skipped when the old
        // view held no bars (whitespace) — the time window is the only truth there.
        if (carried && carriedCount >= 2 && this.rawBars.length > 0) {
            const bars = this.rawBars;
            let idx = bars.length - 1;
            while(idx > 0 && bars[idx].time > carried.right)idx -= 1;
            const from = bars[Math.max(0, idx - (carriedCount - 1))].time;
            this.renderer.setVisibleRange({
                from,
                to: Math.max(carried.right, bars[idx].time + 1)
            });
        }
        // A carried replay whose point is inside the new bars cuts them right here (no history
        // to wait for: the cut is synchronous); its restart of every consumer over the cut
        // replaces the one below, and live updates stay off. A point OLDER than the new bars
        // has to deepen first — the switch completes as usual and the replay resumes after.
        const carry = replayCarry && !replayCarry.cancelled ? replayCarry : null; // stopped during the load ⇒ gone
        const carryFrom = carry ? carry.revealedEnd - this.barIntervalMs() : 0;
        const carryNow = carry != null && this.rawBars.length > 0 && carryFrom >= this.rawBars[0].time;
        const replayBack = carryNow && this.resumeCarriedReplay(this.replayStart({
            from: carryFrom
        }), carry);
        // Restart every consumer over the new market (records/panes/drawings survive). A
        // depth-only change is NOT a new market: the bars kept their identity and their
        // indices, so tearing the sessions down would recompute everything and flash a
        // stale plot for the whole load. The backfill pokes them per prepend instead —
        // the same path the initial progressive load already uses.
        if (!depthOnly && !replayBack) {
            this.restartNativeIndicators();
            this.restartChartTypeEngine();
            this.reexecuteIndicators();
        }
        if (!replayBack) this.startLive(); // stopped above on every path, depth-only included
        if (identityChanged) {
            this.events.emit('market:changed', {
                symbol: m.symbol ?? 'TEST',
                timeframe: m.timeframe ?? '60',
                prev
            });
        }
        if (carry && !carryNow) this.resumeCarriedReplay(this.replayStart({
            from: carryFrom
        }), carry);
    }
    /**
     * Restart every native indicator over the new market: a `NativeIndicatorContext`
     * captures symbol/timeframe at start, so the old instance is stopped and a fresh one
     * created from the descriptor — same record, same id, same legend row. Hidden natives
     * are only re-instantiated and marked STALE; showing them starts the fresh instance
     * (a resume() would revive the OLD market's compute).
     */ restartNativeIndicators() {
        for (const record of this.registry.all()){
            if (!record.native) continue;
            if (record.native.started) record.native.instance.stop();
            record.native.instance = record.native.descriptor.create();
            record.native.started = false;
            record.pendingStructural = true; // the next emitted model remounts over the old visuals
            if (record.hidden) {
                record.native.stale = true;
            } else {
                const handle = this.handles.get(record.id);
                if (handle) void this.startNativeIndicator(record.id, handle);
            }
        }
    }
    /** Chart-type data engines capture their host (symbol/timeframe) at start — stop them
     *  all on a market switch and rebuild the active style's engine against the new market. */ restartChartTypeEngine() {
        for (const engine of this.typeEngines.values())engine.stop();
        this.typeEngines.clear();
        if (this.activeEngineStyle) void this.startChartTypeEngine(this.activeEngineStyle);
    }
    /**
     * The FIRST candles just painted (the quick preview, or the only load): activate the
     * layers that need bars but NOT full history. The volume layer reads the chart's bars
     * each frame and a chart-type data engine follows later chunks/prepends through its own
     * cycle — waiting for the deep chunk (as the end of init() used to) only delayed them.
     */ activateBarLayers() {
        // Auto-add the built-in volume indicator (default on).
        this.maybeAutoAddVolume();
    // The initial price style may already carry a data requirement (a chart constructed
    // with a chart-type style) — style CHANGES arrive via onPriceStyleChange. Seed
    // ONLY from what the feature reads: a change event may already have set the state
    // (and a renderer without the feature reads undefined) — the seed must never undo it.
    }
    /**
     * A depth-only reconfigure (`setMarket({ bars })` on the same market): move the array's
     * OLDEST edge, never rebuild it. Growing re-enters the same backfill loop the initial load
     * uses, so the extra history arrives as prepends with the viewport preserved; shrinking
     * trims in place. Both keep the newest bars — the viewport is right-anchored, so what the
     * user is looking at does not move, and mounted indicators keep their alignment (the
     * renderer re-derives each model's anchor offset against the new indices, negative when
     * the head moved forward).
     *
     * Sessions are NOT restarted here: the backfill pokes them per prepend (`'backfill'`), and
     * a trim leaves every value they already computed valid.
     */ extendDepth(gen, requested) {
        if (this.rawBars.length > requested) {
            this.setBarSeries(this.rawBars.slice(this.rawBars.length - requested), {
                preserveView: true
            });
            this.completeHistory('depth');
            return;
        }
        if (this.rawBars.length === requested) {
            this.completeHistory('depth');
            return;
        }
        // Detached, exactly like the initial load: `setMarket` resolves on what is already
        // painted while the extra depth streams in behind it.
        this.historyState = 'backfill';
        void this.backfillHistory(gen, requested);
    }
    /**
     * The detached backward backfill: fetch chunks strictly older than the current oldest
     * bar until the requested depth (reason `'depth'`), the source's genesis (`'genesis'` —
     * a chunk added nothing older), or a fetch error (`'aborted'` — the chart keeps what
     * loaded). Runs BEHIND the interactive chart; every prepend keeps the viewport put and
     * pokes the sessions with `'backfill'` so run policy stays with the engines. The
     * generation check after each await abandons the loop when the chart is superseded.
     */ async backfillHistory(gen, requested) {
        try {
            while(this.generation === gen && this.rawBars.length < requested && this.rawBars.length > 0){
                const remaining = requested - this.rawBars.length;
                // A flat chunk per request: only depths past SINGLE_LOAD_BARS reach this loop,
                // so there is no small near-window to fill quickly — every remaining round trip
                // should carry as much as the source answers well.
                const step = CHUNK_BARS;
                const chunk = await this.feed.loadRange(this.config.market, {
                    to: this.rawBars[0].time,
                    limit: Math.min(step, remaining) + 1
                });
                if (this.generation !== gen) return; // superseded mid-fetch (switch/destroy)
                // Merge against the CURRENT array — live ticks appended during the fetch —
                // keeping only genuinely older bars (the existing boundary bar wins).
                const oldest = this.rawBars[0].time;
                const head = chunk.filter((b)=>b.time < oldest);
                if (head.length === 0) {
                    this.completeHistory('genesis'); // nothing older exists at the source
                    return;
                }
                for(let i = 1; i < head.length; i += 1){
                    if (head[i].time <= head[i - 1].time) {
                        console.warn('[vela] non-monotonic history chunk — stopping the backfill');
                        this.completeHistory('aborted');
                        return;
                    }
                }
                this.setBarSeries([
                    ...head,
                    ...this.rawBars
                ], {
                    preserveView: true
                });
                this.notifySessionsBars('backfill');
                this.events.emit('history:progress', {
                    loaded: this.rawBars.length,
                    target: requested
                });
            }
            if (this.generation === gen) this.completeHistory('depth');
        } catch (e) {
            console.warn(`[vela] history backfill failed — keeping ${this.rawBars.length} bars (${e instanceof Error ? e.message : String(e)})`);
            if (this.generation === gen) this.completeHistory('aborted');
        }
    }
    /**
     * Mark the history load finished (exactly once): flip the state, fire the sessions'
     * `'complete'` (their held first run executes now — during a non-chunked init no
     * session exists yet, so this is a no-op there), emit the event, resolve the promise.
     */ completeHistory(reason) {
        if (this.historyCompleted) return;
        this.historyCompleted = true;
        this.historyState = 'complete';
        this.notifySessionsBars('complete');
        this.events.emit('history:complete', {
            reason,
            oldestTime: this.rawBars[0]?.time ?? 0,
            barsLoaded: this.rawBars.length
        });
        this.resolveHistoryComplete();
    }
    /** Resolves once the full requested history has loaded (immediately for small/offline charts). */ historyComplete() {
        return this.historyCompletePromise;
    }
    // ── bar replay ──────────────────────────────────────────────
    /**
     * Enter replay — or seek, when already replaying — keeping every bar opened at or before
     * `opts.from` and queueing the rest. A `from` inside the loaded bars cuts at once, even
     * while older history is still streaming in: what lands later joins the tape's head
     * (see {@link mergeHistoryIntoReplay}) and leaves the cut alone. An older `from` waits
     * for that load, then deepens if it still has to. Consumers restart over the cut exactly
     * as on a market switch — their models describe bars that are now hidden — and the
     * active chart-type engine is rebuilt without live data.
     */ async replayStart(opts) {
        if (this.rawBars.length === 0) {
            console.warn('[vela] chart.replay.start() ignored — the chart has no bars yet');
            return;
        }
        let gen = this.generation;
        if (opts.from < this.rawBars[0].time) {
            await this.historyCompletePromise;
            if (this.generation !== gen || this.rawBars.length === 0) return; // a market switch superseded the request
        }
        const oldest = this.rawBars[0].time;
        if (opts.from < oldest && this.canHeal() && typeof this.feed.loadRange === 'function') {
            // Deepen through the depth-only path. Bars per interval overestimates on
            // session-bound markets, which only over-fetches; genesis clamps the rest.
            const held = this.rawBars.length + (this.replayQueue?.length ?? 0);
            const bars = held + Math.ceil((oldest - opts.from) / this.barIntervalMs()) + 1;
            const seek = this.replayQueue !== null;
            if (seek) this.endReplay(null, {
                restore: true,
                resume: false
            }); // a seek, not an end
            this.replayDepth ??= {
                bars: this.config.market.bars
            };
            // Flagged only once the deepening call has read its arguments: its own depth
            // change must not count as a switch abandoning the load.
            const deepened = this.setMarket({
                bars
            });
            this.replayLoading = {
                seek
            };
            await deepened;
            gen = this.generation;
            await this.historyCompletePromise;
            if (!this.replayLoading || this.generation !== gen || this.rawBars.length === 0) return; // cancelled or superseded
            this.replayLoading = null;
        }
        this.settleFormingBar();
        this.dropTickFetches();
        const tape = this.replayQueue ? [
            ...this.rawBars,
            ...this.replayQueue
        ] : this.rawBars;
        let cut = 0;
        while(cut < tape.length && tape[cut].time <= opts.from)cut += 1;
        cut = Math.max(1, cut);
        if (cut >= tape.length) {
            console.warn('[vela] chart.replay.start() ignored — no bar opens after the requested time');
            return;
        }
        const wasPlaying = this.replayPlaying;
        this.clearReplayTimer();
        if (!this.replayQueue) this.stopLive();
        this.replayQueue = tape.slice(cut);
        this.setBarSeries(tape.slice(0, cut));
        this.restartBarConsumers({
            blank: true
        });
        if (wasPlaying) this.events.emit('replay:pause', undefined);
        this.events.emit('replay:start', {
            cursorTime: tape[cut - 1].time,
            remaining: this.replayQueue.length
        });
        this.prefetchTicks();
    }
    /** Reveal the next queued bar through the live-bar path — or complete the bar forming
     *  tick by tick; the last one ends the replay. */ replayStep() {
        if (this.replayForming) {
            this.finishFormingBar();
            return true;
        }
        const queue = this.replayQueue;
        const bar = queue?.shift();
        if (!queue || !bar) return false;
        this.replayTickFetches.delete(bar.time);
        this.applyBar(bar);
        this.completeReveal(bar);
        this.prefetchTicks();
        return true;
    }
    /**
     * Follow up a replay carried onto a new series of the same symbol (another timeframe or
     * session). The cut asked for keeps the bars that CLOSED by the end of what was revealed —
     * every finer bar of the last revealed one, never a coarser bar still open at that point
     * (no look-ahead). Once it settles: playback resumes if it was on; if the replay did not
     * come back (nothing left after that point, or a later switch took over), it ends as a
     * market switch would. Returns whether the replay is back already — a start with no
     * history to wait for cuts synchronously (an async function runs up to its first await).
     */ resumeCarriedReplay(start, carry) {
        if (this.replayQueue && this.replayCarrying === carry) this.replayCarrying = null; // back already
        void start.then(()=>{
            if (this.replayCarrying === carry) this.replayCarrying = null;
            if (carry.cancelled) return; // stopped or superseded meanwhile — already announced
            if (!this.replayQueue) this.events.emit('replay:end', {
                reason: 'market'
            });
            else if (carry.playing) this.replayPlay();
        });
        return this.replayQueue !== null;
    }
    replayStepUpdate() {
        if (!this.replayQueue) return false;
        if (this.replayForming) {
            this.applyReplayTicks(1);
            return true;
        }
        const bar = this.replayQueue[0];
        if (!bar) return false;
        const entry = this.replayTickSource ? this.requestTicks(bar) : null;
        if (entry && !entry.ticks) {
            const epoch = this.replayTickAbort;
            // Timed playback, when on, opens the bar itself once the ticks land.
            void entry.done.then(()=>{
                if (!this.replayPlaying && !this.replayForming && this.replayTickAbort === epoch && this.replayQueue?.[0] === bar) this.replayStepUpdate();
            });
            return true;
        }
        if (!entry?.ticks?.length) return this.replayStep();
        this.openFormingBar(entry.ticks, 1);
        return true;
    }
    replaySetTicks(source) {
        this.finishFormingBar();
        this.dropTickFetches();
        this.replayTickSource = source;
        this.prefetchTicks();
    }
    replayPlay(intervalMs) {
        if (!this.replayQueue) return;
        if (intervalMs !== undefined) {
            if (!(Number.isFinite(intervalMs) && intervalMs > 0)) {
                console.warn(`[vela] chart.replay.play(${intervalMs}) ignored — the interval must be a positive number of ms`);
                return;
            }
            this.replayIntervalMs = intervalMs;
        }
        this.clearReplayTimer();
        this.replayPlaying = true;
        if (this.replayForming) this.paceFormingBar(this.replayForming);
        this.scheduleReplayStep(this.replayForming?.delayMs);
        this.events.emit('replay:play', {
            intervalMs: this.replayIntervalMs
        });
    }
    replayPause() {
        if (!this.replayPlaying) return;
        this.clearReplayTimer();
        this.events.emit('replay:pause', undefined);
    }
    replayStop() {
        const carrying = this.replayCarrying;
        if (carrying) {
            // Carried over a switch and not back yet: it must not resume once the bars land.
            carrying.cancelled = true;
            this.replayCarrying = null;
            this.events.emit('replay:end', {
                reason: 'stopped'
            });
        }
        if (this.replayLoading) {
            // A start still loading older history: shrinking back to the borrowed depth
            // supersedes the backfill, and that reload resumes live updates itself.
            const depth = this.replayDepth;
            this.abandonReplayLoad('stopped');
            void this.setMarket({
                bars: depth?.bars ?? 500
            });
            return;
        }
        this.endReplay('stopped', {
            restore: true,
            resume: true
        });
    }
    abandonReplayLoad(reason) {
        const loading = this.replayLoading;
        if (!loading) return;
        this.replayLoading = null;
        this.replayDepth = null;
        if (loading.seek) this.events.emit('replay:end', {
            reason
        });
    }
    replayState() {
        const active = this.replayQueue !== null;
        return {
            active: active || this.replayCarrying !== null,
            playing: this.replayCarrying?.playing ?? this.replayPlaying,
            cursorTime: active ? this.rawBars[this.rawBars.length - 1]?.time ?? null : null,
            remaining: this.replayQueue?.length ?? 0,
            nextTime: this.replayForming?.bar.time ?? this.replayQueue?.[0]?.time ?? null,
            intervalMs: this.replayIntervalMs
        };
    }
    replayBounds() {
        const first = this.rawBars[0];
        const last = this.replayQueue?.[this.replayQueue.length - 1] ?? this.rawBars[this.rawBars.length - 1];
        return first && last ? {
            first: first.time,
            last: last.time
        } : null;
    }
    scheduleReplayStep(delayMs = this.replayIntervalMs) {
        this.replayTimer = setTimeout(()=>{
            this.replayTimer = null;
            this.replayAdvance();
        }, delayMs);
    }
    /** One beat of timed playback: the forming bar's next ticks, else the next bar — whole,
     *  or opened from its ticks (waiting for them when they have not landed yet). */ replayAdvance() {
        if (!this.replayPlaying || !this.replayQueue) return;
        const forming = this.replayForming;
        if (forming) {
            // Every tick due by the clock — a timer that fired late (throttling, a busy
            // frame) catches up instead of stretching the bar past its interval.
            const due = Math.floor((now() - forming.origin) / this.replayIntervalMs) + 1;
            this.applyReplayTicks(Math.max(forming.batch, due - forming.next));
            if (this.replayPlaying) this.scheduleReplayStep(forming.delayMs);
            return;
        }
        const bar = this.replayQueue[0];
        if (!bar) return;
        const entry = this.replayTickSource ? this.requestTicks(bar) : null;
        if (entry && !entry.ticks) {
            const epoch = this.replayTickAbort;
            void entry.done.then(()=>{
                if (this.replayPlaying && this.replayTimer == null && this.replayTickAbort === epoch && this.replayQueue?.[0] === bar) this.replayAdvance();
            });
            return;
        }
        if (!entry?.ticks?.length) {
            if (this.replayStep() && this.replayPlaying) this.scheduleReplayStep();
            return;
        }
        this.openFormingBar(entry.ticks);
        if (this.replayPlaying) this.scheduleReplayStep(this.replayForming?.delayMs);
    }
    /** Take the next queued bar off the tape and open it at its first tick (the first
     *  `count` ticks — default: one timed update's worth). */ openFormingBar(ticks, count) {
        const bar = this.replayQueue.shift();
        const volumeEach = ticks.every((t)=>t.volume === undefined) ? (bar.volume ?? 0) / ticks.length : null;
        const forming = {
            bar,
            ticks,
            next: 0,
            candle: null,
            volumeEach,
            batch: 1,
            delayMs: this.replayIntervalMs,
            origin: 0
        };
        this.paceFormingBar(forming);
        this.replayForming = forming;
        this.applyReplayTicks(count ?? forming.batch);
        this.prefetchTicks();
    }
    /** One tick per interval, batched when the interval is shorter than a frame; the clock
     *  is anchored on the ticks already applied (a resume or a pace change carries on from
     *  there, never jumps). */ paceFormingBar(f) {
        f.batch = Math.max(1, Math.ceil(MIN_TICK_UPDATE_MS / this.replayIntervalMs));
        f.delayMs = this.replayIntervalMs * f.batch;
        f.origin = now() - Math.max(0, f.next - 1) * this.replayIntervalMs;
    }
    /** Fold the next `count` ticks into the forming candle; the last one settles the bar. */ applyReplayTicks(count) {
        const f = this.replayForming;
        if (!f) return;
        let c = f.candle;
        const stop = Math.min(f.ticks.length, f.next + count);
        for(; f.next < stop; f.next += 1){
            const t = f.ticks[f.next];
            const v = f.volumeEach ?? t.volume ?? 0;
            const hi = Math.max(t.high ?? t.price, t.price);
            const lo = Math.min(t.low ?? t.price, t.price);
            if (c) {
                c = {
                    ...c,
                    high: Math.max(c.high, hi),
                    low: Math.min(c.low, lo),
                    close: t.price,
                    volume: (c.volume ?? 0) + v
                };
            } else {
                const open = t.open ?? t.price;
                c = {
                    time: f.bar.time,
                    open,
                    high: Math.max(open, hi),
                    low: Math.min(open, lo),
                    close: t.price,
                    volume: v
                };
            }
        }
        f.candle = c;
        if (f.next >= f.ticks.length) {
            this.finishFormingBar();
            return;
        }
        this.applyBar(c);
        this.events.emit('replay:tick', {
            cursorTime: f.bar.time,
            index: f.next - 1,
            count: f.ticks.length
        });
    }
    /** Settle the forming bar on its stored values and announce it revealed. */ finishFormingBar() {
        const f = this.replayForming;
        if (!f) return;
        this.replayForming = null;
        this.replayTickFetches.delete(f.bar.time);
        this.applyBar(f.bar);
        this.events.emit('replay:tick', {
            cursorTime: f.bar.time,
            index: f.ticks.length - 1,
            count: f.ticks.length
        });
        this.completeReveal(f.bar);
    }
    /** Put the forming bar back in its stored form, silently — a seek or an end rebuilds
     *  from the tape, which must hold the stored bar. */ settleFormingBar() {
        const f = this.replayForming;
        if (!f) return;
        this.replayForming = null;
        this.applyBar(f.bar);
    }
    /**
     * A history answer landing mid-replay (a progressive snapshot — the whole answer so far):
     * the tape keeps its cut and its hidden queue; bars older than the tape join its head,
     * bars newer than it join the queue's end.
     */ mergeHistoryIntoReplay(bars) {
        const queue = this.replayQueue;
        const head = this.rawBars[0];
        if (!queue || !head) return;
        const tail = queue[queue.length - 1] ?? this.rawBars[this.rawBars.length - 1];
        let older = 0;
        while(older < bars.length && bars[older].time < head.time)older += 1;
        let newer = bars.length;
        while(newer > older && bars[newer - 1].time > tail.time)newer -= 1;
        if (newer < bars.length) queue.push(...bars.slice(newer));
        if (older > 0) {
            this.setBarSeries([
                ...bars.slice(0, older),
                ...this.rawBars
            ], {
                preserveView: true
            });
            this.notifySessionsBars('backfill');
        }
    }
    /** A bar is fully on screen: announce it, and end the replay if it was the last. */ completeReveal(bar) {
        const queue = this.replayQueue;
        if (!queue) return;
        this.events.emit('replay:step', {
            cursorTime: bar.time,
            remaining: queue.length
        });
        if (queue.length === 0) this.endReplay('finished', {
            restore: true,
            resume: true
        });
    }
    /** Ask for the ticks of the next hidden bar ahead of time. */ prefetchTicks() {
        const next = this.replayQueue?.[0];
        if (next && this.replayTickSource) this.requestTicks(next);
    }
    /** The (shared) tick request of a queued bar — the source runs once per bar. */ requestTicks(bar) {
        const known = this.replayTickFetches.get(bar.time);
        if (known) return known;
        const source = this.replayTickSource;
        this.replayTickAbort ??= new AbortController();
        const signal = this.replayTickAbort.signal;
        const queue = this.replayQueue ?? [];
        const end = queue[queue.indexOf(bar) + 1]?.time ?? bar.time + this.barIntervalMs();
        const entry = {
            ticks: null,
            done: Promise.resolve()
        };
        const land = (ticks)=>{
            entry.ticks = usableTicks(ticks);
        };
        const fail = (e)=>{
            if (!signal.aborted) console.warn(`[vela] replay tick source failed — revealing the bar whole (${e instanceof Error ? e.message : String(e)})`);
            land([]);
        };
        try {
            const out = source(bar, {
                end,
                signal
            });
            if (Array.isArray(out)) land(out);
            else entry.done = Promise.resolve(out).then(land, fail);
        } catch (e) {
            fail(e);
        }
        this.replayTickFetches.set(bar.time, entry);
        return entry;
    }
    /** Abort the tick requests in flight and forget the landed ones. */ dropTickFetches() {
        this.replayTickAbort?.abort();
        this.replayTickAbort = null;
        this.replayTickFetches.clear();
    }
    clearReplayTimer() {
        if (this.replayTimer != null) clearTimeout(this.replayTimer);
        this.replayTimer = null;
        this.replayPlaying = false;
    }
    /**
     * Leave replay. `restore` puts the queued bars back and restarts the consumers over the
     * full history (a market switch skips it: its load replaces everything anyway); `resume`
     * restarts live updates and heals the bars that closed while replaying. A null reason
     * leaves silently — a seek that re-enters right after.
     */ endReplay(reason, opts) {
        const queue = this.replayQueue;
        if (!queue) return;
        this.clearReplayTimer();
        if (opts.restore) this.settleFormingBar();
        else this.replayForming = null;
        this.dropTickFetches();
        this.replayQueue = null;
        // A real end hands back the depth the replay borrowed; a seek keeps it for the re-entry.
        const depth = reason ? this.replayDepth : null;
        if (reason) this.replayDepth = null;
        if (depth) {
            if (depth.bars === undefined) delete this.config.market.bars;
            else this.config.market.bars = depth.bars;
        }
        if (opts.restore) {
            const keep = depth ? depth.bars ?? 500 : Infinity;
            if (queue.length > 0 || this.rawBars.length > keep) {
                const full = [
                    ...this.rawBars,
                    ...queue
                ];
                this.setBarSeries(full.length > keep ? full.slice(full.length - keep) : full);
                this.restartBarConsumers({
                    blank: false
                });
            } else if (this.config.live) {
                // Nothing to put back, but natives and the chart-type engine run a replay-time
                // (non-live) form — rebuild them live.
                this.restartNativeIndicators();
                this.restartChartTypeEngine();
            }
        }
        if (opts.resume && this.config.live) {
            this.startLive();
            const last = this.rawBars[this.rawBars.length - 1];
            if (last && this.canHeal()) void this.healGap(last.time);
        }
        if (reason) this.events.emit('replay:end', {
            reason
        });
    }
    /**
     * The bars were replaced by a cut or a restore of the SAME market: every consumer re-runs.
     * A cut also blanks the mounted models first — they still paint the hidden bars' values,
     * which must not show until the re-runs land.
     */ restartBarConsumers(opts) {
        if (opts.blank) this.blankIndicatorVisuals();
        this.restartNativeIndicators();
        this.restartChartTypeEngine();
        this.reexecuteIndicators();
    }
    /** The primary symbol as the data layer resolves it, or null if no symbol is set. */ qualifiedSymbol() {
        const market = this.config.market;
        if (!market.symbol) return null;
        // The symbol travels BARE. The `provider` option is a preference the feed already applies
        // (it resolves with the chart's provider as first candidate), never a prefix: welding it
        // here made a hard requirement out of it, so metadata and capability probes were aimed at
        // the configured venue even for a symbol only another venue lists — a 502 on the tick-size
        // request and a capability verdict from the wrong venue after every cross-venue switch.
        return market.symbol;
    }
    /** Push the active symbol's tick size to the renderer's price axis. No-op when unknown (formula stays). */ refreshPriceFormat() {
        if (!this.renderer.setPricePrecision) return;
        const raw = this.feed.symbolInfo?.(this.config.market)?.mintick;
        this.renderer.setPricePrecision(typeof raw === 'number' && raw > 0 ? raw : undefined);
    }
    /** Resolve the symbol's tick size asynchronously (warming the sync cache) and push it once it lands. */ async ensurePriceFormat() {
        if (!this.renderer.setPricePrecision) return;
        const symbol = this.qualifiedSymbol();
        if (!symbol) return;
        try {
            await this.dataControl.symbolInfo(symbol); // warms the sync metadata cache
            this.refreshPriceFormat();
        } catch  {
        // metadata unavailable — the renderer keeps its zoom-derived decimals
        }
    }
    volumeOptedOut;
    maybeAutoAddVolume() {
        if (!this.config.volume || this.volumeOptedOut || !this.renderer.setNativeData) return; // off, opted out, or no layer
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNativeIndicator"])('volume')) this.addNativeIndicator('volume');
    }
    /**
     * React to a price-style change. Two styles carry requirements beyond drawing:
     * a plugin style may need its data engine running, `'heikinashi'` a bar-stream
     * transform. Both syncs are idempotent, so the umbrella just fans out.
     */ syncPriceStyle(style) {
        if (typeof style === 'string') this.priceStyle = style;
        this.syncBarTransform(style);
        this.syncChartTypeEngine(style);
    }
    /**
     * Drive a chart type's DATA engine from the price style: entering a style whose
     * registered definition carries `dataEngine` starts (or resumes) that engine; leaving
     * suspends it. Engines are per-chart, created lazily on first entry, and stopped only
     * at destroy — a style flip is a cheap suspend/resume, not a rebuild.
     */ syncChartTypeEngine(style) {
        const id = typeof style === 'string' ? style : null;
        const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chartType"])(id);
        const want = def?.dataEngine ? id : null;
        if (want === this.activeEngineStyle) return;
        if (this.activeEngineStyle) this.typeEngines.get(this.activeEngineStyle)?.suspend();
        this.activeEngineStyle = want;
        if (want) void this.startChartTypeEngine(want);
    }
    /** Start (or resume) the active style's data engine, once bars are loaded. */ async startChartTypeEngine(id) {
        if (!this.renderer.setNativeData) return; // a renderer without native layers — the style draws plain
        await this.readyPromise;
        if (this.activeEngineStyle !== id) return; // the style left again while loading
        const existing = this.typeEngines.get(id);
        if (existing) {
            existing.resume();
            return;
        }
        const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$chart$2d$types$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chartType"])(id);
        if (!def?.dataEngine) return;
        const engine = def.dataEngine();
        this.typeEngines.set(id, engine);
        // Seed the stored settings BEFORE start (a pre-start onSettings is pure
        // configuration by contract), so the engine's first fetch already runs on
        // the user's values — never on schema defaults they edited away.
        const stored = this.typeSettings.get(id);
        if (stored) engine.onSettings?.(stored);
        engine.start({
            symbol: this.config.market.symbol ?? 'TEST',
            timeframe: this.config.market.timeframe ?? '60',
            live: (this.config.live ?? false) && this.replayQueue === null,
            session: this.config.market.session,
            bars: ()=>this.bars,
            data: this.dataControl,
            pushData: (data)=>this.renderer.setNativeData?.(id, data),
            pushPending: (ranges)=>this.renderer.setNativeData?.(`${id}-pending`, ranges)
        });
    }
    /**
     * Apply (or drop) the style's bar transform. The transform field flips SYNCHRONOUSLY —
     * a pre-load style change is picked up by init's `setBarSeries`. With bars loaded, the
     * view is rebuilt in place (viewport preserved) and every Pine indicator re-executes:
     * its input data changed wholesale, which a streaming session's incremental context
     * cannot absorb. Native indicators need nothing — their layers read the renderer's
     * bars per frame.
     */ syncBarTransform(style) {
        const transform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$price$2d$styles$2f$BarTransform$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["barTransformFor"])(style);
        if (transform === this.barTransform) return; // singletons per style — identity is enough
        this.barTransform = transform;
        if (this.rawBars.length === 0) return;
        this.bars = transform ? transform.full(this.rawBars) : this.rawBars;
        this.renderer.setBars(this.bars, {
            preserveView: true
        });
        this.reexecuteIndicators();
    }
    /**
     * Blank every mounted indicator's painted output — series data, fills, backgrounds,
     * price lines, drawings, bar colors, trades — while keeping the mount (legend row,
     * pane, settings) intact, via the same idempotent-by-id remount an input edit uses.
     * Called on a market identity switch: the fresh models arrive only after the new
     * bars load, so nothing blanked here is ever restored — each consumer's re-run
     * remounts a full model over it.
     */ blankIndicatorVisuals() {
        for (const record of this.registry.all()){
            if (record.hidden || !record.renderHandle || !record.model) continue;
            record.model = blankedModel(record.model);
            record.renderHandle = this.renderer.mountIndicator(record.model);
            record.pendingStructural = true; // the next model remounts; never a patch over the blank
            this.setLoading(record, true);
        }
    }
    /** Stop + re-run every visible Pine indicator (its input bars changed wholesale). */ reexecuteIndicators() {
        for (const record of this.registry.all()){
            if (record.hidden || !record.session) continue;
            record.session.stop();
            record.session = undefined;
            record.pendingStructural = true; // every value changed → full remount, not a patch
            record.pendingCause = 'market';
            this.setLoading(record, true);
            const handle = this.handles.get(record.id);
            if (handle) this.executeIndicator(record.id, handle);
        }
    }
    onBar(bar) {
        if (this.healing) {
            this.healBuffer.push(bar); // replayed once the backfill lands (ordering preserved)
            return;
        }
        // Continuity check: a bar far ahead of the last one means live updates were MISSED —
        // browsers throttle timers in hidden tabs (and can freeze sockets), so bars close unseen
        // and the poll/stream only ever carries the newest one. Backfill the hole through the
        // feed's ranged fetch instead of pushing a discontinuous bar. Provider-agnostic: every
        // provider serves `getBars({ from })`. Within the cooldown a discontinuity is accepted
        // as a real market gap (an empty interval on an illiquid symbol) — no refetch loop.
        const last = this.rawBars[this.rawBars.length - 1];
        if (last && this.canHeal() && bar.time > last.time + this.barIntervalMs() * GAP_FACTOR && Date.now() - this.lastHealAt > HEAL_COOLDOWN_MS) {
            this.healBuffer.push(bar);
            void this.healGap(last.time);
            return;
        }
        this.applyBar(bar);
    }
    /**
     * THE outbound bar seam for a full series load: store the raw series, derive the view
     * (identity when no transform), and hand the view to the renderer. Everything downstream
     * (engines via `getBars`, natives, visible-range presets) reads `this.bars` — the view.
     */ setBarSeries(raw, opts) {
        this.rawBars = raw;
        this.bars = this.barTransform ? this.barTransform.full(raw) : raw;
        this.renderer.setBars(this.bars, {
            preserveView: opts?.preserveView
        });
        // The first PAINTED batch ends the loading state — on a deep history that is the quick
        // preview, well before the load pipeline completes. Only a non-empty series counts: the
        // switch-time CLEARING call says so explicitly, and an empty COMPLETED load is closed
        // by loadMarket's finally instead (a style re-derivation over empty bars mid-load must
        // not end a load still in flight).
        if (!opts?.clearing && this.bars.length > 0) this.endLoad();
    }
    /**
     * Reconcile one live bar into the canonical array + renderer (no gap detection). The raw
     * bar lands in {@link rawBars}; the VIEW bar is derived incrementally (a transform needs
     * only the previous view bar — O(1) per tick) and index-stays aligned with the raw series.
     * The `'bar'` event carries the RAW bar (a data event, not a display event). `notify`
     * signals the indicator sessions too — a heal passes false and notifies ONCE for the whole
     * batch instead (a session re-run is a full re-execution over the canonical array, so per-bar
     * notifications during a backfill are pure waste).
     */ applyBar(bar, notify = true) {
        const last = this.rawBars[this.rawBars.length - 1];
        let viewBar = bar;
        if (last && bar.time === last.time) {
            this.rawBars[this.rawBars.length - 1] = bar;
            // The forming candle refined — its values are still provisional.
            this.barCause = 'tick';
            if (this.barTransform) {
                // Replacing the FORMING bar: the previous view bar is the one BEFORE it.
                viewBar = this.barTransform.next(bar, this.bars[this.bars.length - 2]);
                this.bars[this.bars.length - 1] = viewBar;
            }
        } else if (!last || bar.time > last.time) {
            this.rawBars.push(bar);
            // A new bar opened, so the one before it is now FINAL — the distinction
            // `script:run` carries as `cause: 'bar'`.
            this.barCause = 'bar';
            if (this.barTransform) {
                viewBar = this.barTransform.next(bar, this.bars[this.bars.length - 1]);
                this.bars.push(viewBar);
            }
        } else return;
        this.renderer.updateBar(viewBar);
        this.events.emit('bar', bar);
        // During a backfill a tick is tagged 'backfill' too — policy-A sessions hold their
        // run either way, and the eventual 'complete' run reads the tick from the array.
        if (notify) this.notifySessionsBars(this.historyState === 'backfill' ? 'backfill' : undefined);
    }
    /**
     * Signal every live session that the bars changed: streamed sessions markDirty (re-execute
     * the forming bar), static-live sessions (visible-range scripts) full-re-run with the new
     * tail. Both value-patch the result. The reason travels to the ENGINE (which owns run
     * policy): no reason = live tick, `'backfill'`/`'complete'` bracket a history backfill.
     */ notifySessionsBars(reason) {
        if (this.switchingMarket) return; // old sessions must not run over the incoming market's bars
        // A backfill chunk (or the run released by its completion) is still the script's
        // FIRST look at the history, whichever bar arrived last.
        const cause = reason ? 'history' : this.barCause;
        for (const record of this.registry.all()){
            if (!record.renderHandle || record.hidden) continue;
            if (record.session) {
                record.pendingCause = cause;
                record.session.notifyBars(reason);
            } else if (record.native) record.native.instance.onBars();
        }
        if (this.activeEngineStyle) this.typeEngines.get(this.activeEngineStyle)?.onBars?.();
    }
    /** Gap healing needs a ranged feed and a provider-backed series (offline `data` has no source). */ canHeal() {
        return !!this.feed.loadRange && !this.config.market.data?.length;
    }
    /** Duration of one chart bar in ms (for live-bar continuity checks). */ barIntervalMs() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$data$2f$timeframe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeToMs"])(this.config.market.timeframe ?? '60');
    }
    /**
     * Backfill missed live bars: re-fetch from the LAST KNOWN bar's open time (so its stale
     * mid-formation close is corrected too) through "now", and replay the result — plus any live
     * ticks that arrived during the fetch — through the normal reconciler. Heals every miss cause
     * the same way: background-tab throttling, socket reconnects, system sleep, network blips.
     */ async healGap(fromMs) {
        const gen = this.generation;
        this.healing = true;
        this.lastHealAt = Date.now();
        try {
            const bars = await this.feed.loadRange(this.config.market, {
                from: fromMs
            });
            if (this.generation !== gen) return; // market switched / chart destroyed mid-heal — drop the stale bars
            if (this.replayQueue) return; // replay began mid-heal — these bars lie past its cursor
            for (const b of bars)this.applyBar(b, false);
        } catch  {
        // transient — the buffered ticks still apply; a later discontinuity re-triggers the heal
        } finally{
            // A superseded heal leaves the state alone: setMarket/destroy already reset it,
            // and replaying its buffer would push the OLD market's bars into the new array.
            if (this.generation === gen && !this.replayQueue) {
                this.healing = false;
                const pending = this.healBuffer;
                this.healBuffer = [];
                for (const b of pending)this.applyBar(b, false);
                // ONE session notification for the whole heal: bars applied per-bar above (renderer +
                // 'bar' events keep their per-bar granularity), but the engines re-execute just once.
                this.notifySessionsBars(this.historyState === 'backfill' ? 'backfill' : undefined);
            }
        }
    }
    /**
     * Register a scripting engine for a language. Last registration wins:
     * re-registering replaces the engine (with a dev-console warning). Running
     * indicators keep the engine they were started with — only later addIndicator
     * calls use the replacement, so a swap never disrupts live work.
     */ registerEngine(language, engine) {
        const existing = this.engines.get(language);
        if (existing && existing !== engine) {
            console.warn(`[vela] re-registering scripting engine for language "${language}"; ` + `replacing ${existing.constructor.name} with ${engine.constructor.name}.`);
        }
        this.engines.set(language, engine);
    }
    addIndicator(source, options = {}) {
        const id = this.claimIndicatorId(options.id);
        const title = options.title ?? 'Indicator';
        const handle = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$IndicatorHandleImpl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndicatorHandleImpl"](id, title, this, source);
        this.handles.set(id, handle);
        this.registry.add({
            id,
            title,
            source,
            options,
            inputValues: {
                ...options.inputs ?? {}
            },
            propValues: {
                ...options.props ?? {}
            }
        });
        void this.startIndicator(id, source, options, handle);
        return handle;
    }
    /**
     * Add a NATIVE (core-computed, no Pine engine) indicator by registered type — a first-class
     * indicator that shares the registry, handle, legend, settings, and lifecycle events. SINGLE
     * INSTANCE per type unless the descriptor opts into `multiInstance`: a second add of a
     * single-instance type returns the existing handle; a multi-instance type gets a fresh
     * instance every time. Unknown type ⇒ a fail-soft handle that never mounts (mirrors
     * addIndicator). Built-in single-instance types: `'volume'`, `'vpvr'`.
     */ addNativeIndicator(type, options = {}) {
        const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNativeIndicator"])(type);
        if (!descriptor?.multiInstance) {
            const existing = this.registry.all().find((r)=>r.native?.type === type);
            if (existing) return this.handles.get(existing.id) ?? new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$IndicatorHandleImpl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndicatorHandleImpl"](existing.id, existing.title, this, undefined, type);
        }
        const id = this.registry.nextId('native', (candidate)=>this.handles.has(candidate));
        const title = descriptor?.title ?? type;
        const handle = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$IndicatorHandleImpl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndicatorHandleImpl"](id, title, this, undefined, type);
        this.handles.set(id, handle);
        if (!descriptor) {
            console.warn(`[vela] addNativeIndicator("${type}") — no native indicator registered for this type.`);
            return handle;
        }
        const inputValues = {
            ...descriptor.defaultInputs(),
            ...options.inputs ?? {}
        };
        this.registry.add({
            id,
            title,
            source: type,
            inputValues,
            propValues: {},
            native: {
                type,
                instance: descriptor.create(),
                descriptor
            }
        });
        handle.setSchema(descriptor.inputsSchema());
        void this.startNativeIndicator(id, handle);
        return handle;
    }
    /** The native types present on the chart, one entry per INSTANCE in registry order (a
     *  multi-instance type repeats) — SYNC (registry state; no support probe). */ presentNativeIndicators() {
        return this.registry.all().map((r)=>r.native?.type).filter((t)=>!!t);
    }
    /**
     * The catalog of registered native-indicator types with their live state on THIS chart: each
     * entry's `supported` (applies to the current symbol) and `present` (at least one instance
     * added — a second add of a single-instance type is a no-op). Powers a host "add native
     * indicator" menu that can gate + de-duplicate. Async because a descriptor's `isSupported` may
     * probe the provider for a required capability.
     */ async availableNativeIndicators() {
        const symbol = this.qualifiedSymbol();
        const present = new Set(this.presentNativeIndicators());
        return Promise.all((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nativeIndicatorDescriptors"])().map(async (d)=>({
                type: d.type,
                title: d.title,
                supported: await this.isNativeSupported(d, symbol),
                present: present.has(d.type),
                beta: d.beta,
                ...d.multiInstance ? {
                    multiInstance: true
                } : {}
            })));
    }
    /**
     * Resolve a descriptor's support for the current symbol: no `isSupported` ⇒ always supported;
     * an `isSupported` but no symbol set ⇒ can't decide, treat as unsupported; a throw ⇒ unsupported.
     */ async isNativeSupported(descriptor, symbol) {
        if (!descriptor.isSupported) return true;
        if (!symbol) return false;
        try {
            return await descriptor.isSupported(symbol, this.dataControl);
        } catch  {
            return false;
        }
    }
    /** IndicatorController: re-run an indicator with merged input overrides (Pine session OR native instance). */ applyInputs(id, values) {
        const record = this.registry.get(id);
        if (!record || !record.session && !record.native) return;
        record.inputValues = {
            ...record.inputValues,
            ...values
        };
        // Reflect the new value in the open dialog immediately (the model arrives async).
        if (record.renderHandle) this.renderer.setIndicatorInputs(record.renderHandle, record.inputValues);
        // The next emitted model structurally remounts (input changes can restructure).
        record.pendingStructural = true;
        // Spinner during the re-compute (Pine only — native indicators drive their own status).
        if (!record.hidden && !record.native) this.setLoading(record, true);
        record.pendingCause = 'inputs';
        if (record.session) record.session.update(record.inputValues);
        else if (record.native && !record.hidden) record.native.instance.setInputs(record.inputValues);
        this.events.emit('indicator:inputs', {
            id
        });
    }
    /** IndicatorController: the CURRENT stored input values (defaults merged with edits). */ inputValuesOf(id) {
        return {
            ...this.registry.get(id)?.inputValues
        };
    }
    /** IndicatorController: the CURRENT declaration-prop overrides. */ propValuesOf(id) {
        return {
            ...this.registry.get(id)?.propValues
        };
    }
    /** IndicatorController: re-run an indicator with merged declaration-prop overrides.
     *  Same lifecycle as {@link applyInputs} — a prop change replays the whole script.
     *  Script indicators only: natives have no declaration props. */ applyProps(id, values) {
        const record = this.registry.get(id);
        if (!record?.session) return;
        record.propValues = {
            ...record.propValues,
            ...values
        };
        // Reflect the new value in the open dialog immediately (the model arrives async).
        if (record.renderHandle) this.renderer.setIndicatorInputs(record.renderHandle, record.inputValues, record.propValues);
        record.pendingStructural = true;
        if (!record.hidden) this.setLoading(record, true);
        record.pendingCause = 'inputs';
        record.session.update(record.inputValues, record.propValues);
        this.events.emit('indicator:inputs', {
            id
        });
    }
    /**
     * IndicatorController: replace a SCRIPT indicator's source in place (see
     * {@link IndicatorHandle.updateCode}). Prepare-first: the running session keeps
     * computing until the new source has compiled, so a broken edit costs the user
     * nothing but an `error` event. Natives have no script — warn and leave them alone.
     */ updateCode(id, source) {
        const record = this.registry.get(id);
        const handle = this.handles.get(id);
        if (!record || !handle) return;
        if (record.native) {
            console.warn(`[vela] updateCode("${id}") — a native indicator has no script to update.`);
            return;
        }
        if (source === record.source && record.pendingSource === undefined) return;
        record.pendingSource = source;
        void this.swapSource(id, source, handle);
    }
    async swapSource(id, source, handle) {
        const engine = this.registry.get(id)?.engine ?? this.engineFor(this.registry.get(id)?.options?.language);
        let prepared;
        try {
            prepared = await engine.prepare(source, id);
        } catch (err) {
            const record = this.registry.get(id);
            // Only the LATEST pending edit reports; a superseded one failing is noise.
            if (record?.pendingSource === source) {
                record.pendingSource = undefined;
                this.fail(id, handle, err);
            }
            return;
        }
        const record = this.registry.get(id);
        // Removed, or superseded by a later updateCode, while preparing.
        if (!record || record.pendingSource !== source) return;
        record.pendingSource = undefined;
        record.source = source;
        record.engine = engine;
        record.prepared = prepared;
        handle.setSource(source);
        // Values survive on the keys (or titles) the new schema still declares; the rest
        // fall back to the new declaration defaults — a renamed input is a new input.
        record.inputValues = valuesOnSchema(prepared.inputs, record.inputValues);
        record.propValues = valuesOnSchema(prepared.props ?? [], record.propValues);
        handle.setSchema(prepared.inputs);
        handle.setPropsSchema(prepared.props ?? []);
        record.session?.stop();
        record.session = undefined;
        record.pendingStructural = true; // the first model of the new source remounts over the old visuals
        record.pendingCause = 'code';
        if (record.hidden) return; // showing runs the (now replaced) prepared script
        if (record.renderHandle) {
            this.renderer.setIndicatorInputs(record.renderHandle, record.inputValues, record.propValues);
            this.setLoading(record, true);
        } else {
            this.mountLoadingPlaceholder(id, record); // updated before its first prepare ever landed
        }
        this.executeIndicator(id, handle);
    }
    /** IndicatorController: tear down an indicator and (if now empty) its pane. */ /** Live handles of every indicator on the chart (script + native), insertion order. */ listIndicators() {
        return [
            ...this.handles.values()
        ];
    }
    /** Read-only engine-context snapshot for one indicator (null: no capability / not run). */ getIndicatorContext(id, select) {
        const session = this.registry.get(id)?.session;
        return session?.getContext?.(select) ?? Promise.resolve(null);
    }
    removeIndicator(id) {
        const record = this.registry.remove(id);
        // Removing the auto-added volume is a USER decision — make it stick: the
        // auto-add fires on every load (first paint of every market), so without the
        // opt-out a removed volume resurrected on the next symbol/timeframe switch.
        if (record?.native?.type === 'volume') this.volumeOptedOut = true;
        record?.session?.stop();
        // A native added hidden and never started (a restored ledger entry) has nothing
        // to tear down — and its `stop()` may not expect to run without a context.
        if (record?.native?.started) record.native.instance.stop();
        this.handles.delete(id);
        if (record?.renderHandle) this.renderer.removeIndicator(record.renderHandle);
        const paneId = record?.model?.paneId;
        // A pane can now hold several indicators — only drop it when the last one leaves.
        if (paneId && paneId !== 'price' && !this.paneStillUsed(paneId)) {
            this.renderer.removePane(paneId);
            this.forgetPane(paneId);
            this.events.emit('pane:changed', undefined);
        }
        this.events.emit('indicator:removed', {
            id
        });
    }
    /**
     * IndicatorController: hide or show an indicator. Hiding **suspends** it — a Pine indicator's
     * session is stopped (and a native instance suspended), so it's never poked on bar/viewport/input
     * and consumes no resources, while the renderer drops its visuals and keeps the legend row marked
     * hidden. Showing resumes: a Pine indicator re-executes (cached prepared), a native instance
     * resumes + re-emits. Visuals were dropped on hide, so the next model re-mounts.
     */ setVisible(id, visible) {
        const record = this.registry.get(id);
        if (!record || record.hidden === !visible) return;
        record.hidden = !visible;
        this.handles.get(id)?.setVisibleState(visible);
        if (!visible) {
            record.session?.stop();
            record.session = undefined;
            // Only a RUNNING instance is suspended: a record hidden right after its add
            // (a restored hidden ledger entry) has not started yet, so there is nothing
            // to suspend — and the instance's suspend() is entitled to assume start() ran.
            if (record.native?.started) record.native.instance.suspend();
            if (record.renderHandle) this.renderer.setIndicatorVisible?.(record.renderHandle, false);
            else if (record.native) this.mountHiddenNativeRow(id, record);
        } else {
            if (record.renderHandle) this.renderer.setIndicatorVisible?.(record.renderHandle, true);
            record.pendingStructural = true; // visuals dropped on hide → next model re-mounts
            if (record.native) {
                if (record.native.stale || !record.native.started) {
                    // The instance was re-created for a NEW market while hidden (`stale`),
                    // or was ADDED hidden and never started (a restored hidden ledger entry —
                    // startNativeIndicator bails on hidden records): resume() would either
                    // revive the old market's compute or poke a context-less instance.
                    // Start the instance instead.
                    record.native.stale = false;
                    const handle = this.handles.get(id);
                    if (handle) void this.startNativeIndicator(id, handle);
                } else {
                    record.native.instance.resume();
                }
            } else {
                this.setLoading(record, true); // spinner on the kept legend row while re-executing
                const handle = this.handles.get(id);
                if (handle) this.executeIndicator(id, handle);
            }
        }
        // Announce the change so host UIs (object tree, custom legends) reflect the new
        // eye/dim state immediately — the toggle can come from the in-chart legend, so a
        // tree that only re-renders on its own actions would otherwise lag until a poll.
        this.events.emit('indicator:visibility', {
            id,
            visible
        });
    }
    ready() {
        return this.readyPromise;
    }
    /** A renderer-agnostic snapshot of the graphic elements generated so far (the deterministic oracle signal). */ inspect() {
        // Native indicators sort to the top of the list (stable otherwise). A record still
        // loading holds only its legend placeholder — it has generated nothing yet, so skip it.
        const records = [
            ...this.registry.all()
        ].filter((r)=>!r.loading).sort((a, b)=>(b.native ? 1 : 0) - (a.native ? 1 : 0));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$engine$2f$inspect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inspectModels"])(records.map((r)=>r.model).filter((m)=>m != null));
    }
    resize() {
        this.renderer.resize();
    }
    /**
     * Swap the app theme live: re-skins the renderer (surfaces, axes, legends, in-chart
     * chrome) and emits `theme:changed` so host chrome around the chart follows. No-ops
     * when the resolved theme is already active — which also breaks the echo when a host
     * reacts to `theme:changed` by calling back into `setTheme`.
     */ setTheme(theme) {
        const cur = this.config.theme;
        if (Object.keys(theme).every((k)=>theme[k] === cur[k])) return;
        this.config.theme = theme;
        this.renderer.setTheme(theme);
        this.events.emit('theme:changed', theme);
    }
    /** The current visible time range (left/right bar times), or null before data loads. */ getVisibleRange() {
        return this.renderer.getVisibleRange();
    }
    /** Set the visible time range explicitly (epoch-ms `from`/`to`). */ setVisibleRange(range) {
        this.renderer.setVisibleRange(range);
    }
    /** Pan by a fraction of the visible width (positive ⇒ toward the latest bars).
     *  Prefers the renderer's drag-equivalent pan; falls back to an instant shift of
     *  the visible range for renderers without one. */ panBy(fraction) {
        if (this.renderer.panBy) {
            this.renderer.panBy(fraction);
            return;
        }
        const r = this.renderer.getVisibleRange();
        if (!r) return;
        const delta = (r.to - r.from) * fraction;
        this.renderer.setVisibleRange({
            from: r.from + delta,
            to: r.to + delta
        });
    }
    /** Frame a named preset (e.g. `'1M'`, `'YTD'`, `'ALL'`) over the loaded bars. */ setVisibleRangePreset(preset) {
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$visible$2d$range$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["presetToRange"])(preset, this.bars);
        if (range) this.renderer.setVisibleRange(range);
    }
    destroy() {
        this.bumpGeneration(); // abandon backfill loops/loads mid-flight + release superseded setMarket awaiters
        this.resolveHistoryComplete(); // never leave historyComplete() awaiters hanging
        this.clearReplayTimer();
        this.replayQueue = null;
        this.replayForming = null;
        this.replayCarrying = null;
        this.dropTickFetches();
        this.replayDepth = null;
        this.replayLoading = null;
        this.stopLive();
        if (this.viewportTimer != null) clearTimeout(this.viewportTimer);
        this.viewportUnsub?.();
        this.paneActionUnsub?.();
        // native instances free their own caches/timers in stop()
        for (const record of this.registry.all()){
            record.session?.stop();
            if (record.native?.started) record.native.instance.stop();
        }
        for (const engine of this.typeEngines.values())engine.stop(); // chart-type data engines (SDK)
        this.typeEngines.clear();
        this.activeEngineStyle = null;
        this.unresolvedUnsub?.();
        this.unresolvedUnsub = null;
        this.feed.destroy?.(); // parked waits would otherwise outlive the chart
        this.drawings.destroy();
        this.marks.destroy();
        this.renderer.destroy();
        this.events.clear();
    }
    // ── internals ───────────────────────────────────────────────
    /**
     * The id a new script indicator runs under: the host's when supplied, else a minted
     * one. A host id is opaque but must be a non-empty string, and it must not be live
     * on this chart — a duplicate is a programming error surfaced synchronously, never
     * renamed behind the caller's back (the whole point of supplying one is that
     * `handle.id` equals what was passed). "Live" reads both the records and the handle
     * map: a fail-soft handle never enters the registry but still owns its id.
     */ claimIndicatorId(requested) {
        if (requested === undefined) return this.registry.nextId('ind', (candidate)=>this.handles.has(candidate));
        if (typeof requested !== 'string' || requested.length === 0) {
            throw new TypeError('[vela] addIndicator: `id` must be a non-empty string');
        }
        if (this.handles.has(requested) || this.registry.get(requested)) {
            throw new Error(`[vela] addIndicator: indicator id "${requested}" is already live on this chart`);
        }
        return requested;
    }
    async startIndicator(id, source, options, handle) {
        try {
            await this.readyPromise;
            if (!this.registry.get(id)) return;
            // Let the renderer paint the post-fetch frame (e.g. the "Running…" status)
            // before the engine's synchronous transpile + execution monopolizes the
            // main thread — otherwise the UI stays frozen on the pre-execution frame
            // for the whole run.
            await yieldToPaint();
            const record = this.registry.get(id);
            if (!record) return; // removed during the yield
            const engine = this.engineFor(options.language);
            record.engine = engine;
            const prepared = await engine.prepare(source, id);
            // An updateCode that landed during this prepare owns the record now — the
            // original source must not overwrite the replacement's schema and session.
            if (record.source !== source) return;
            record.prepared = prepared;
            const defaults = {};
            for (const input of prepared.inputs)defaults[input.key] = input.defval;
            record.inputValues = {
                ...defaults,
                ...record.inputValues
            };
            handle.setSchema(prepared.inputs);
            const propDefaults = {};
            for (const prop of prepared.props ?? [])propDefaults[prop.key] = prop.defval;
            record.propValues = {
                ...propDefaults,
                ...record.propValues
            };
            handle.setPropsSchema(prepared.props ?? []);
            // Mount a legend-only placeholder BEFORE the (possibly long) execution, so
            // the indicator appears immediately with a loading spinner instead of the
            // UI staying blank until the first computed model lands.
            this.mountLoadingPlaceholder(id, record);
            this.executeIndicator(id, handle);
        } catch (err) {
            this.fail(id, handle, err);
        }
    }
    /**
     * Start (or restart) the engine session for an already-prepared indicator and route its
     * models to {@link applyModel}. Used by the initial run and by {@link setVisible} on show.
     * No-op while the indicator is hidden — a hidden indicator must not hold a live session.
     */ executeIndicator(id, handle) {
        const record = this.registry.get(id);
        if (!record || !record.engine || !record.prepared || record.hidden) return;
        // Stream only when the chart is live, the script is NOT viewport-dependent, and the
        // engine can stream. Viewport scripts + non-streaming engines take the static path.
        const mode = this.config.live && !record.prepared.reactsToViewport && record.engine.capabilities.streaming ? 'live' : 'static';
        record.session = record.engine.execute({
            prepared: record.prepared,
            market: this.market(),
            bars: this.bars,
            getBars: ()=>this.bars,
            fetchSeries: (sym, tf, range)=>this.fetchSeries(sym, tf, range),
            inputs: record.inputValues,
            props: record.propValues,
            visibleRange: this.currentVisibleRange(),
            mode,
            // Mid-backfill session starts (add / re-show / price-style re-execute) let the
            // ENGINE decide whether to run now or hold for the 'complete' notification.
            historyState: this.historyState
        }, {
            onModel: (model)=>{
                // Read BEFORE applyModel: it is what announces the indicator, and the
                // consumed cause must not leak into the next model.
                const first = !record.announced;
                const cause = record.pendingCause ?? 'history';
                // A deferred (output-free while loading) model counts as no run at all:
                // the pending cause stays for the real run, and no events fire.
                if (!this.applyModel(id, model)) return;
                record.pendingCause = undefined;
                this.emitContextChanged(id); // throttled — streamed ticks collapse to ~1/s
                this.emitScriptRun(id, cause, first);
            },
            onAlert: (a)=>{
                // A replayed bar runs the live path, so a script alerts on it as on a live
                // bar — but it is history: announcing it would pass the past off as a
                // live signal (toasts, bell, host notifications).
                if (this.replayQueue || this.replayCarrying) return;
                // The chart-level event names its source — the indicator's effective
                // display title (host override, else the script's own; the same rule
                // the legend announce uses) — hosts render alerts from many
                // indicators on one surface (the shells' bell menu).
                const indicator = record.options?.title ?? record.prepared?.meta.title ?? record.title;
                this.events.emit('alert', {
                    ...a,
                    indicator
                });
                handle.emit('alert', {
                    id: a.id,
                    message: a.message,
                    title: a.title,
                    time: a.time
                });
            },
            onWarning: (w)=>this.events.emit('warning', w),
            onError: (err)=>this.fail(id, handle, err)
        });
        // A synchronous engine can emit its model DURING the execute call above — before
        // record.session exists, so the gated emit inside onModel missed. Fire once now
        // that the session (and its optional getContext) is attached; throttling dedupes.
        this.emitContextChanged(id);
    }
    /**
     * Start a native indicator's compute (after first bars are loaded). It pushes its visuals via
     * `ctx.emit`, which the orchestrator wraps into a full {@link IndicatorModel} and routes through
     * the SAME {@link applyModel} mount/patch path as a Pine indicator — so the legend, pane routing,
     * settings dialog, and events all come for free. No engine, no `prepared`, no `session`.
     */ async startNativeIndicator(id, handle) {
        try {
            await this.readyPromise;
            const record = this.registry.get(id);
            if (!record?.native || record.hidden) return; // removed/hidden during the await
            const channel = this.nativeChannel(record);
            const ctx = {
                id,
                symbol: this.config.market.symbol ?? 'TEST',
                timeframe: this.config.market.timeframe ?? '60',
                live: this.config.live && this.replayQueue === null,
                session: this.config.market.session,
                bars: ()=>this.bars,
                data: this.dataControl,
                emit: (out)=>this.applyModel(id, this.buildNativeModel(record, out)),
                pushData: (data)=>this.renderer.setNativeData?.(channel, data),
                setStatus: (status)=>{
                    if (record.renderHandle && !record.hidden) this.renderer.setIndicatorStatus?.(record.renderHandle, status);
                }
            };
            record.native.instance.start(ctx, record.inputValues);
            record.native.started = true;
        } catch (err) {
            this.fail(id, handle, err);
        }
    }
    /** The renderer-layer channel a native instance's `pushData` lands on: the type itself
     *  for a single-instance type (the layer id doubles as the channel), a per-instance
     *  channel for a `multiInstance` type — otherwise every instance would overwrite the
     *  one layer. Stamped on the model so the renderer mounts a dedicated layer for it. */ nativeChannel(record) {
        const { type, descriptor } = record.native;
        return descriptor.multiInstance ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$native$2d$indicators$2f$NativeIndicator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nativeInstanceChannel"])(type, record.id) : type;
    }
    /** Wrap a native indicator's emitted visuals into a full IndicatorModel, tagged `native`. */ buildNativeModel(record, out) {
        const d = record.native.descriptor;
        const type = record.native.type;
        const channel = this.nativeChannel(record);
        return {
            id: record.id,
            title: record.title,
            ...d.shortTitle ? {
                shorttitle: d.shortTitle
            } : {},
            overlay: d.overlay,
            paneHint: d.paneHint,
            native: {
                type,
                ...channel !== type ? {
                    channel
                } : {}
            },
            ...d.legend === false ? {
                legend: false
            } : {},
            ...out.paneAxis != null ? {
                paneAxis: out.paneAxis
            } : {},
            series: out.series ?? [],
            fills: out.fills ?? [],
            backgrounds: out.backgrounds ?? [],
            priceLines: out.priceLines ?? [],
            ...out.lines ? {
                lines: out.lines
            } : {},
            ...out.boxes ? {
                boxes: out.boxes
            } : {},
            ...out.labels ? {
                labels: out.labels
            } : {},
            ...out.polylines ? {
                polylines: out.polylines
            } : {},
            ...out.linefills ? {
                linefills: out.linefills
            } : {},
            ...out.tables ? {
                tables: out.tables
            } : {},
            inputs: d.inputsSchema(),
            inputValues: record.inputValues
        };
    }
    /**
     * Mount an EMPTY model for a just-prepared Pine indicator: the legend row (title,
     * gear, eye, ✕ — all functional) and its routed pane appear immediately with a
     * loading spinner, while the engine computes. The first computed model remounts
     * over it in place (`pendingStructural`), clears the spinner, and only THEN fires
     * `indicator:added`/`ready` — so event semantics and `inspect()` (which skips
     * loading records) still mean "the indicator produced output".
     *
     * A HIDDEN record mounts too — dimmed, no spinner (its session never starts while
     * hidden, so nothing is computing and no model will ever arrive to mount the row
     * later). Without this an indicator ADDED hidden (a restored ledger/ext entry) had
     * no legend row at all: invisible AND unreachable — the eye that unhides it never
     * existed. The hidden mount announces immediately for the same reason: the "first
     * computed model" that normally announces cannot come until the indicator is shown,
     * and host UIs (object tree, landing watchers) must know it exists NOW.
     */ mountLoadingPlaceholder(id, record) {
        if (record.renderHandle || !record.prepared) return;
        const meta = record.prepared.meta;
        const model = {
            id,
            // Deliberately the FULL title, never a shorttitle: while the script loads the
            // legend identifies it by its full name; the compact shorttitle arrives with
            // the first computed model and takes over from there.
            title: record.options?.title ?? meta.title,
            overlay: meta.overlay,
            paneHint: meta.overlay ? 'price' : 'new',
            series: [],
            fills: [],
            backgrounds: [],
            priceLines: [],
            inputs: record.prepared.inputs,
            inputValues: record.inputValues,
            ...record.prepared.props ? {
                props: record.prepared.props,
                propValues: record.propValues
            } : {}
        };
        const paneId = this.routePane(id, model, record.options ?? {});
        this.placeModel(model, id, paneId);
        record.model = model; // keeps pane routing + remove-time pane cleanup consistent
        this.ensurePaneFor(paneId);
        record.renderHandle = this.renderer.mountIndicator(model);
        record.pendingStructural = true; // the first computed model remounts over the placeholder
        if (record.hidden) {
            this.renderer.setIndicatorVisible?.(record.renderHandle, false);
            this.announce(record, this.handles.get(id));
            return;
        }
        this.setLoading(record, true);
    }
    /**
     * Mount the legend row for a NATIVE indicator that is being hidden BEFORE it ever
     * started (a restored-hidden ledger entry: `startNativeIndicator` bails on hidden
     * records, so no model — and therefore no row — would ever mount). The native
     * counterpart of {@link mountLoadingPlaceholder}'s hidden branch: an empty model
     * carries the title + inputs schema, the renderer marks the row hidden, and the
     * announce makes the indicator visible to host UIs. Showing later STARTS the
     * instance (the `started` flag path) and its first emit remounts over this row.
     */ mountHiddenNativeRow(id, record) {
        if (record.renderHandle || !record.native) return;
        const model = this.buildNativeModel(record, {});
        const paneId = this.routePane(id, model, record.options ?? {});
        this.placeModel(model, id, paneId);
        record.model = model;
        this.ensurePaneFor(paneId);
        record.renderHandle = this.renderer.mountIndicator(model);
        record.pendingStructural = true; // the first emit after show remounts over this row
        this.renderer.setIndicatorVisible?.(record.renderHandle, false);
        this.announce(record, this.handles.get(id));
    }
    /** Flip the record's loading state and reflect it in the legend row (spinner on/off). */ setLoading(record, loading) {
        record.loading = loading;
        if (record.renderHandle && !record.hidden) this.renderer.setIndicatorStatus?.(record.renderHandle, loading ? 'loading' : 'idle');
    }
    ensurePaneFor(paneId) {
        if (!this.paneOrder.includes(paneId)) this.paneOrder.push(paneId);
        this.renderer.ensurePane({
            id: paneId,
            kind: paneId === 'price' ? 'price' : 'study',
            order: this.paneOrder.indexOf(paneId)
        });
    }
    /** True when any (still-registered) indicator sits on the given pane. */ paneStillUsed(paneId) {
        for (const r of this.registry.all())if (r.model?.paneId === paneId) return true;
        return false;
    }
    /** Drop a now-empty pane from the order + collapse/maximize mirror. */ forgetPane(paneId) {
        const i = this.paneOrder.indexOf(paneId);
        if (i > 0) this.paneOrder.splice(i, 1); // never remove 'price' (index 0)
        this.collapsedPanes.delete(paneId);
        if (this.maximizedPaneId === paneId) this.maximizedPaneId = null;
    }
    // ── pane management (PaneController — backs chart.panes) ──────
    paneManagementSupported() {
        return this.renderer.capabilities.paneManagement === true && typeof this.renderer.setIndicatorPane === 'function';
    }
    listPanes() {
        const byPane = new Map();
        for (const r of this.registry.all()){
            const model = r.model;
            if (!model) continue;
            if (model.legend === false) continue; // host-owned chrome: no row anywhere, the handle is the control
            const paneId = model.paneId ?? 'price';
            if (!byPane.has(paneId)) byPane.set(paneId, []);
            byPane.get(paneId).push({
                id: r.id,
                title: model.title || r.title,
                ...model.shorttitle ? {
                    shorttitle: model.shorttitle
                } : {},
                ownScale: model.ownScale === true
            });
        }
        const panes = [];
        for (const paneId of this.paneOrder){
            // The price pane always shows; a study pane only while it holds indicators.
            if (paneId !== 'price' && !byPane.has(paneId)) continue;
            panes.push({
                id: paneId,
                kind: paneId === 'price' ? 'price' : 'study',
                order: panes.length,
                collapsed: this.collapsedPanes.has(paneId),
                maximized: this.maximizedPaneId === paneId,
                indicators: byPane.get(paneId) ?? []
            });
        }
        return panes;
    }
    movePane(paneId, dir) {
        if (paneId === 'price') return; // price stays pinned on top
        const existing = this.existingPaneIds();
        const i = existing.indexOf(paneId);
        if (i < 0) return;
        const j = dir === 'up' ? i - 1 : i + 1;
        // Never move above the price pane (index 0) or past the last pane.
        if (j <= 0 || j >= existing.length) return;
        [existing[i], existing[j]] = [
            existing[j],
            existing[i]
        ];
        this.reorderPanes(existing);
        this.events.emit('pane:moved', {
            paneId,
            dir
        });
    }
    removePaneAndIndicators(paneId) {
        if (paneId === 'price') return;
        for (const r of [
            ...this.registry.all()
        ])if (r.model?.paneId === paneId) this.removeIndicator(r.id);
    }
    collapsePane(paneId, collapsed) {
        if (collapsed) this.collapsedPanes.add(paneId);
        else this.collapsedPanes.delete(paneId);
        this.renderer.setPaneCollapsed?.(paneId, collapsed);
        this.events.emit('pane:changed', undefined);
    }
    maximizePane(paneId) {
        this.maximizedPaneId = paneId;
        this.renderer.setPaneMaximized?.(paneId);
        this.events.emit('pane:changed', undefined);
    }
    /** IndicatorController/PaneController: move (or merge) an indicator to another pane. */ moveIndicator(id, target) {
        if (!this.paneManagementSupported() || !this.renderer.setIndicatorPane) {
            console.warn('[vela] the active renderer does not support moving indicators between panes.');
            return;
        }
        const record = this.registry.get(id);
        if (!record?.renderHandle || !record.model) return;
        const model = record.model;
        const oldPaneId = model.paneId ?? 'price';
        const resolved = this.resolveMoveTarget(id, model, target);
        if (!resolved) return;
        const { paneId, ownScale, insert } = resolved;
        if (paneId === oldPaneId && model.ownScale === true === ownScale) return; // no-op
        if (insert) this.insertPaneOrder(paneId, insert);
        else if (!this.paneOrder.includes(paneId)) this.paneOrder.push(paneId);
        model.ownScale = ownScale;
        record.paneLocked = true; // recomputes must honor this placement, not re-route by default
        this.placeModel(model, id, paneId);
        this.ensurePaneFor(paneId);
        this.renderer.setIndicatorPane(record.renderHandle, paneId, {
            ownScale
        });
        if (oldPaneId !== 'price' && oldPaneId !== paneId && !this.paneStillUsed(oldPaneId)) {
            this.renderer.removePane(oldPaneId);
            this.forgetPane(oldPaneId);
        }
        this.reorderPanes(this.existingPaneIds());
        this.events.emit('indicator:moved', {
            id,
            paneId
        });
        this.events.emit('pane:changed', undefined);
    }
    /** Resolve a move target to a concrete pane id + own-scale flag + optional insertion. */ resolveMoveTarget(id, model, target) {
        if (target === 'price' || typeof target === 'object' && 'pane' in target && target.pane === 'price') {
            // Merge onto price: a price-unit overlay (declared overlay=true) keeps sharing the
            // price scale; anything else gets its own scale column.
            return {
                paneId: 'price',
                ownScale: !model.overlay
            };
        }
        if ('pane' in target) {
            if (!this.existingPaneIds().includes(target.pane)) return null;
            return {
                paneId: target.pane,
                ownScale: true
            };
        }
        // A brand-new pane: the indicator owns it (shares its scale with itself → no own-scale column).
        // The natural name `pane-${id}` collides with this indicator's OWN pane when it is the
        // master (that pane was seeded from its id), which the move's no-op guard would then reject —
        // so pick an id distinct from both the current pane and every existing pane.
        const spec = target.newPane === true ? {} : target.newPane;
        return {
            paneId: this.freshPaneId(id, model.paneId ?? 'price'),
            ownScale: false,
            insert: spec
        };
    }
    /** A study-pane id unique among existing panes and distinct from `avoid` (the indicator's current pane). */ freshPaneId(id, avoid) {
        const taken = new Set(this.existingPaneIds());
        let paneId = `pane-${id}`;
        for(let n = 2; paneId === avoid || taken.has(paneId); n += 1)paneId = `pane-${id}-${n}`;
        return paneId;
    }
    /** Splice a pane id into the order relative to a neighbor (default: bottom). */ insertPaneOrder(paneId, at) {
        const i = this.paneOrder.indexOf(paneId);
        if (i > 0) this.paneOrder.splice(i, 1);
        let idx = this.paneOrder.length;
        if (at.before && this.paneOrder.includes(at.before)) idx = this.paneOrder.indexOf(at.before);
        else if (at.after && this.paneOrder.includes(at.after)) idx = this.paneOrder.indexOf(at.after) + 1;
        if (idx < 1) idx = 1; // never above the price pane
        this.paneOrder.splice(idx, 0, paneId);
    }
    /** Pane ids that currently exist (price + study panes holding ≥1 indicator), in order. */ existingPaneIds() {
        return this.paneOrder.filter((p)=>p === 'price' || this.paneStillUsed(p));
    }
    /** Apply a new pane order to the mirror + renderer. */ reorderPanes(order) {
        this.paneOrder.length = 0;
        this.paneOrder.push(...order);
        this.renderer.orderPanes?.(order);
        this.events.emit('pane:changed', undefined);
    }
    /** React to a renderer-initiated pane action (hover buttons / double-clicks). */ handlePaneAction(a) {
        switch(a.type){
            case 'remove':
                this.removePaneAndIndicators(a.paneId);
                break;
            case 'move':
                {
                    // The renderer already reordered — mirror it (swap with the neighbor).
                    const existing = this.existingPaneIds();
                    const i = existing.indexOf(a.paneId);
                    const j = a.dir === 'up' ? i - 1 : i + 1;
                    if (i > 0 && j > 0 && j < existing.length) {
                        [existing[i], existing[j]] = [
                            existing[j],
                            existing[i]
                        ];
                        this.paneOrder.length = 0;
                        this.paneOrder.push(...existing);
                        this.events.emit('pane:changed', undefined);
                        this.events.emit('pane:moved', {
                            paneId: a.paneId,
                            dir: a.dir
                        });
                    }
                    break;
                }
            case 'collapse':
                if (a.collapsed) this.collapsedPanes.add(a.paneId);
                else this.collapsedPanes.delete(a.paneId);
                this.events.emit('pane:changed', undefined);
                break;
            case 'maximize':
                this.maximizedPaneId = a.maximized ? a.paneId : null;
                this.events.emit('pane:changed', undefined);
                break;
        }
    }
    /** Fire `indicator:added` + the handle's `ready` once, on the first computed model. */ announce(record, handle) {
        if (record.announced) return;
        record.announced = true;
        this.events.emit('indicator:added', {
            id: record.id
        });
        this.emitContextChanged(record.id);
        handle?.emit('ready', undefined);
    }
    /**
     * Apply an emitted model. First emission mounts (and routes the pane); a pending
     * structural change (after an input edit) remounts idempotently; everything else
     * (live tick / viewport re-run) value-patches.
     *
     * Returns false when the model was DEFERRED — an output-free model arriving while
     * the record is still loading and the chart has no bars (see below); every other
     * outcome, including the hidden drop, returns true so the caller's event semantics
     * stay unchanged.
     */ applyModel(id, model) {
        const record = this.registry.get(id);
        if (!record || record.hidden) return true; // a model arriving for a just-hidden indicator is dropped
        // A model arriving MID-SWITCH was computed over the outgoing market (a run already
        // in flight when setMarket quiesced — every poke is gated and the re-executions
        // only start after the load): applying it would repaint the just-blanked scene
        // with stale content. It counts as no run at all — the pending cause stays for
        // the post-load re-execution, whose model paints the new market.
        if (this.switchingMarket) return false;
        // While the CHART ITSELF has no bars, an output-free model is the signature of a
        // run over zero bars (empty initial load: auth race, unresolved symbol, transient
        // feed failure) — an engine may then fabricate default metadata (generic title,
        // overlay: false) because the script body never executed. Letting it through
        // while loading would finalize pane routing off fabricated flags and clear the
        // spinner, stranding the indicator on the wrong pane with a value patch (no
        // title, no pane, unmounted series ids) as its only future. Keep the prepared
        // placeholder up and the one-shot pane re-route unconsumed; the session re-runs
        // when bars arrive and the first REAL model still routes. The bars check keeps
        // the guard narrow on purpose: loading ends when the run completes, not when it
        // produces output — a script that ran over real bars and legitimately emitted
        // nothing visual (e.g. alerts only) still clears its spinner and announces.
        if (record.loading && this.bars.length === 0 && !EngineOrchestrator.modelHasOutput(model)) return false;
        const handle = this.handles.get(id);
        if (!record.renderHandle) {
            const paneId = this.routePane(id, model, record.options ?? {});
            this.placeModel(model, id, paneId);
            record.model = model;
            this.ensurePaneFor(paneId);
            record.renderHandle = this.renderer.mountIndicator(model);
            record.pendingStructural = false;
            this.announce(record, handle);
            return true;
        }
        let paneId = record.model?.paneId ?? 'price';
        const prevOwnScale = record.model?.ownScale === true;
        if (record.loading && !record.paneLocked) {
            // First COMPUTED model after the placeholder. The placeholder's pane came from
            // the prepare-time overlay guess — if the real model routes differently, move
            // off the placeholder pane before mounting. (A user-placed indicator is locked,
            // so its pane is never re-derived here.)
            const routed = this.routePane(id, model, record.options ?? {});
            if (routed !== paneId) {
                // A placeholder's pane is its own; after a code update the pane may also hold
                // indicators merged into it since — those keep it.
                if (paneId !== 'price' && !this.registry.all().some((r)=>r.id !== id && r.model?.paneId === paneId)) {
                    this.renderer.removePane(paneId);
                    this.forgetPane(paneId); // keep core paneOrder in sync (was left stale → desynced list()/anchors/undo)
                }
                this.ensurePaneFor(routed);
                record.pendingStructural = true;
                paneId = routed;
            }
        }
        this.placeModel(model, id, paneId);
        if (record.paneLocked) model.ownScale = prevOwnScale; // carry the merge across the recompute
        record.model = model;
        if (record.pendingStructural) {
            // Idempotent-by-id remount: refresh visuals while keeping the legend + open
            // settings dialog intact (an input change can restructure series/drawings).
            record.renderHandle = this.renderer.mountIndicator(model);
            this.renderer.setIndicatorInputs(record.renderHandle, record.inputValues, record.propValues);
            record.pendingStructural = false;
        } else {
            this.renderer.updateIndicator(record.renderHandle, modelToValuePatch(model));
        }
        if (record.loading) this.setLoading(record, false);
        this.announce(record, handle);
        return true;
    }
    /** True when the model carries ANY executed output — series, drawings, bar colors, or trades. */ static modelHasOutput(model) {
        return model.series.length > 0 || model.fills.length > 0 || model.backgrounds.length > 0 || model.priceLines.length > 0 || (model.lines?.length ?? 0) > 0 || (model.boxes?.length ?? 0) > 0 || (model.labels?.length ?? 0) > 0 || (model.polylines?.length ?? 0) > 0 || (model.linefills?.length ?? 0) > 0 || (model.tables?.length ?? 0) > 0 || (model.barColors?.length ?? 0) > 0 || (model.trades?.length ?? 0) > 0;
    }
    routePane(id, model, options) {
        if (options.pane === 'new') return `pane-${id}`;
        if (options.pane === 'price') return 'price';
        const overlay = options.overlay ?? model.overlay;
        return overlay ? 'price' : `pane-${id}`;
    }
    /** Each named value series' last plotted value — the model is the one source every
     *  engine fills, so this works without an execution context. */ static plotsAtLastBar(model) {
        const out = {};
        for (const spec of model.series){
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$series$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLineLikeSeries"])(spec)) continue;
            out[spec.title] = spec.points[spec.points.length - 1]?.value ?? null;
        }
        return out;
    }
    placeModel(model, id, paneId) {
        model.id = id;
        model.paneId = paneId;
        // A `force_overlay` item (overlay: true) renders on the price pane regardless of
        // where its indicator routed — stamp it 'price' so the model tells the truth.
        const paneOf = (item)=>item.overlay === true ? 'price' : paneId;
        for (const series of model.series)series.paneId = paneOf(series);
        for (const fill of model.fills)fill.paneId = paneOf(fill);
        for (const bg of model.backgrounds)bg.paneId = paneOf(bg);
        for (const line of model.priceLines)line.paneId = paneId;
        if (model.lines) for (const ln of model.lines)ln.paneId = paneOf(ln);
        if (model.boxes) for (const bx of model.boxes)bx.paneId = paneOf(bx);
        if (model.labels) for (const lb of model.labels)lb.paneId = paneOf(lb);
        if (model.polylines) for (const pl of model.polylines)pl.paneId = paneOf(pl);
        if (model.linefills) for (const lf of model.linefills)lf.paneId = paneOf(lf);
        if (model.tables) for (const tb of model.tables)tb.paneId = paneOf(tb);
    }
    contextEmitAt;
    emitContextChanged(id) {
        if (!this.registry.get(id)?.session?.getContext) return;
        const now = Date.now();
        if (now - (this.contextEmitAt.get(id) ?? 0) < 1000) return;
        this.contextEmitAt.set(id, now);
        this.events.emit('context:changed', {
            id
        });
    }
    runEmitAt;
    emitScriptRun(id, cause, first) {
        const record = this.registry.get(id);
        if (!record || record.native || !this.events.hasListeners('script:run')) return;
        const now = Date.now();
        if (cause === 'tick' && now - (this.runEmitAt.get(id) ?? 0) < RUN_EMIT_THROTTLE_MS) return;
        this.runEmitAt.set(id, now);
        // Deferred one microtask on purpose: a SYNCHRONOUS engine emits its first model
        // during `execute()`, before `record.session` has been assigned — pulling the
        // execution context right now would find no session and silently drop `vars` and
        // `strategy` from the first run.
        void Promise.resolve().then(()=>this.buildScriptRun(record, cause, first)).then((run)=>{
            // The indicator may have been removed while the snapshot crossed the worker.
            if (run && this.registry.get(id)) this.events.emit('script:run', run);
        });
    }
    /** The neutral run payload: the model supplies what every engine has, the execution
     *  context the rest (absent for an engine that exposes none). */ async buildScriptRun(record, cause, first) {
        const model = record.model;
        if (!model) return null;
        const snapshot = await this.pullContext(record, [
            'variables',
            'strategy',
            'warnings'
        ]);
        const lastBar = this.bars[this.bars.length - 1];
        return {
            id: record.id,
            title: model.title,
            kind: snapshot?.strategy || (model.trades?.length ?? 0) > 0 ? 'strategy' : 'indicator',
            cause,
            first,
            // The CHART's frame of reference, the only one an engine and a host share.
            bar: Math.max(0, this.bars.length - 1),
            time: lastBar?.time ?? 0,
            // A live chart's last bar is the open one, so its values are provisional
            // whatever produced this run.
            forming: this.config.live && this.bars.length > 0,
            complete: this.historyState !== 'backfill',
            plots: EngineOrchestrator.plotsAtLastBar(model),
            vars: snapshot?.variables ?? {},
            ...snapshot?.strategy ? {
                strategy: snapshot.strategy
            } : {},
            warnings: snapshot?.warnings ?? [],
            trades: async ()=>(await this.pullContext(record, [
                    'trades'
                ]))?.trades ?? [],
            series: async (key)=>{
                const points = (await this.pullContext(record, [
                    'plots'
                ]))?.plots?.[key] ?? [];
                return points.map((p)=>({
                        time: p.time,
                        value: typeof p.value === 'number' ? p.value : null
                    }));
            }
        };
    }
    /** One guarded execution-context pull; null for an engine without the capability. */ async pullContext(record, select) {
        try {
            return await record.session?.getContext?.(select) ?? null;
        } catch  {
            return null; // a torn-down session mid-pull is not an error worth surfacing
        }
    }
    fail(id, handle, err) {
        const record = this.registry.get(id);
        if (record?.loading) this.setLoading(record, false); // stop the spinner; the row stays so the user can remove it
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`[vela] indicator "${id}" failed:`, error.message);
        this.events.emit('indicator:error', {
            id,
            error
        });
        handle?.emit('error', {
            error
        });
    }
}
/**
 * Yield long enough for the renderer to paint one frame before the engine's
 * synchronous transpile + execution locks the main thread. Double-rAF guarantees a
 * paint in the browser (the first callback runs pre-paint, the second resumes the
 * frame after); falls back to a macrotask where rAF is unavailable (tests/headless).
 */ function now() {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
}
/** A tick source's answer, kept to the ticks whose price (and optional fields) are finite. */ function usableTicks(value) {
    if (!Array.isArray(value)) return [];
    const optional = (n)=>n === undefined || Number.isFinite(n);
    return value.filter((t)=>t != null && Number.isFinite(t.price) && optional(t.volume) && optional(t.high) && optional(t.low) && optional(t.open));
}
function yieldToPaint() {
    if (typeof requestAnimationFrame === 'function') {
        return new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
    }
    return new Promise((resolve)=>setTimeout(resolve, 0));
}
/**
 * Re-seat stored values on a NEW schema: every declared key takes its default, then a
 * previous value is kept where the schema still declares its key (or title — add-time
 * overrides may be title-keyed). Stale keys drop.
 */ function valuesOnSchema(schema, previous) {
    const out = {};
    const declared = new Set();
    for (const s of schema){
        out[s.key] = s.defval;
        declared.add(s.key);
        declared.add(s.title);
    }
    for (const [k, v] of Object.entries(previous))if (declared.has(k)) out[k] = v;
    return out;
}
/** Build a value-only patch from a freshly-run model (used on live ticks / re-runs). */ /**
 * A copy of a mounted model with every painted output emptied. The structure — series
 * specs (ids, titles, styles), pane routing, inputs — survives, so an idempotent
 * remount keeps the legend and settings while nothing stale paints.
 */ function blankedModel(model) {
    return {
        ...model,
        series: model.series.map((s)=>s.kind === 'candle' || s.kind === 'bar' ? {
                ...s,
                bars: []
            } : s.kind === 'markers' ? {
                ...s,
                markers: []
            } : {
                ...s,
                points: []
            }),
        fills: [],
        backgrounds: [],
        priceLines: [],
        lines: [],
        boxes: [],
        labels: [],
        polylines: [],
        linefills: [],
        tables: [],
        barColors: [],
        trades: []
    };
}
function modelToValuePatch(model) {
    const series = [];
    let from = Number.POSITIVE_INFINITY;
    let to = 0;
    for (const s of model.series){
        if (s.kind === 'candle' || s.kind === 'bar') {
            series.push({
                seriesId: s.id,
                kind: 'bars',
                bars: s.bars
            });
            for (const b of s.bars){
                if (b.time < from) from = b.time;
                if (b.time > to) to = b.time;
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$model$2f$series$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLineLikeSeries"])(s)) {
            series.push({
                seriesId: s.id,
                kind: 'points',
                points: s.points
            });
            for (const p of s.points){
                if (p.time < from) from = p.time;
                if (p.time > to) to = p.time;
            }
        }
    }
    return {
        kind: 'value',
        indicatorId: model.id,
        dirty: {
            from: Number.isFinite(from) ? from : 0,
            to
        },
        // ALWAYS stated, `null` included: an omitted key leaves the renderer on the previous
        // run's offset, so a re-run that widened to the whole chart could not clear it.
        anchorTime: model.anchorTime ?? null,
        series,
        lines: model.lines ?? [],
        boxes: model.boxes ?? [],
        labels: model.labels ?? [],
        polylines: model.polylines ?? [],
        linefills: model.linefills ?? [],
        tables: model.tables ?? [],
        trades: model.trades ?? []
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/engine/IndicatorHandleImpl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndicatorHandleImpl",
    ()=>IndicatorHandleImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$events$2f$EventBus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/events/EventBus.ts [app-client] (ecmascript)");
;
class IndicatorHandleImpl {
    controller;
    id;
    title;
    /** The script source (see {@link IndicatorHandle.source}); undefined for natives.
     *  Revised by the orchestrator when {@link updateCode} lands (never before). */ source;
    /** The native type (see {@link IndicatorHandle.nativeType}); undefined for scripts. */ nativeType;
    schema;
    propsSchema;
    visibleState;
    bus;
    constructor(id, title, controller, source, nativeType){
        this.controller = controller;
        this.schema = [];
        this.propsSchema = [];
        this.visibleState = true;
        this.bus = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$events$2f$EventBus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypedEventBus"]();
        this.id = id;
        this.title = title;
        if (source !== undefined) this.source = source;
        if (nativeType !== undefined) this.nativeType = nativeType;
    }
    get inputs() {
        return this.schema;
    }
    get props() {
        return this.propsSchema;
    }
    get visible() {
        return this.visibleState;
    }
    inputValues() {
        return this.controller.inputValuesOf(this.id);
    }
    propValues() {
        return this.controller.propValuesOf(this.id);
    }
    setInput(key, value) {
        this.controller.applyInputs(this.id, {
            [key]: value
        });
    }
    setInputs(values) {
        this.controller.applyInputs(this.id, values);
    }
    setProp(key, value) {
        this.controller.applyProps(this.id, {
            [key]: value
        });
    }
    setProps(values) {
        this.controller.applyProps(this.id, values);
    }
    updateCode(source) {
        this.controller.updateCode(this.id, source);
    }
    setVisible(visible) {
        this.controller.setVisible(this.id, visible);
    }
    moveTo(target) {
        this.controller.moveIndicator(this.id, target);
    }
    on(event, handler) {
        return this.bus.on(event, handler);
    }
    context(select) {
        return this.controller.getIndicatorContext(this.id, select);
    }
    remove() {
        this.controller.removeIndicator(this.id);
    }
    // ── internal (used by the orchestrator) ──────────────────────
    setSchema(schema) {
        this.schema = schema;
    }
    setPropsSchema(schema) {
        this.propsSchema = schema;
    }
    /** Sync the public `source` once a code update has been prepared and taken over. */ setSource(source) {
        this.source = source;
    }
    /** Sync the public `visible` getter when the orchestrator changes visibility (API or legend eye). */ setVisibleState(visible) {
        this.visibleState = visible;
    }
    emit(event, payload) {
        this.bus.emit(event, payload);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/engine/IndicatorRegistry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndicatorRegistry",
    ()=>IndicatorRegistry
]);
class IndicatorRegistry {
    records = new Map();
    counter = 0;
    /**
     * Mint a unique per-instance id. Host-supplied ids share the namespace, so a minted
     * id skips anything already recorded — and anything `taken` reports live elsewhere
     * (a handle the orchestrator holds outside the records, e.g. a fail-soft native).
     */ nextId(prefix = 'ind', taken = ()=>false) {
        let id;
        do {
            this.counter += 1;
            id = `${prefix}-${this.counter}`;
        }while (this.records.has(id) || taken(id))
        return id;
    }
    add(record) {
        this.records.set(record.id, record);
    }
    get(id) {
        return this.records.get(id);
    }
    remove(id) {
        const record = this.records.get(id);
        this.records.delete(id);
        return record;
    }
    all() {
        return [
            ...this.records.values()
        ];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/engine/LiveSession.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveSession",
    ()=>LiveSession
]);
class LiveSession {
    feed;
    market;
    onBar;
    unsubscribe;
    constructor(feed, market, onBar){
        this.feed = feed;
        this.market = market;
        this.onBar = onBar;
        this.unsubscribe = null;
    }
    start() {
        if (this.unsubscribe) return;
        this.unsubscribe = this.feed.subscribe(this.market, this.onBar);
    }
    stop() {
        this.unsubscribe?.();
        this.unsubscribe = null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/engine/inspect.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "inspectModels",
    ()=>inspectModels,
    "summarizeModel",
    ()=>summarizeModel
]);
function summarizeModel(model) {
    const series = {};
    for (const s of model.series)series[s.kind] = (series[s.kind] ?? 0) + 1;
    const countOverlay = (items)=>items?.filter((i)=>i.overlay === true).length ?? 0;
    const forcedOverlay = countOverlay(model.series) + countOverlay(model.fills) + countOverlay(model.backgrounds) + countOverlay(model.lines) + countOverlay(model.boxes) + countOverlay(model.labels) + countOverlay(model.polylines) + countOverlay(model.linefills) + countOverlay(model.tables);
    return {
        id: model.id,
        title: model.title,
        overlay: model.overlay,
        paneId: model.paneId,
        native: !!model.native,
        nativeType: model.native?.type,
        series,
        fills: model.fills.length,
        backgrounds: model.backgrounds.length,
        priceLines: model.priceLines.length,
        lines: model.lines?.length ?? 0,
        boxes: model.boxes?.length ?? 0,
        labels: model.labels?.length ?? 0,
        polylines: model.polylines?.length ?? 0,
        linefills: model.linefills?.length ?? 0,
        tables: model.tables?.length ?? 0,
        barColors: model.barColors?.length ?? 0,
        trades: model.trades?.length ?? 0,
        inputs: model.inputs.length,
        forcedOverlay
    };
}
function inspectModels(models) {
    const indicators = models.map(summarizeModel);
    const sum = (pick)=>indicators.reduce((n, s)=>n + pick(s), 0);
    return {
        indicators,
        totals: {
            panes: new Set(indicators.map((s)=>s.paneId ?? 'price')).size,
            series: sum((s)=>Object.values(s.series).reduce((a, b)=>a + b, 0)),
            fills: sum((s)=>s.fills),
            backgrounds: sum((s)=>s.backgrounds),
            priceLines: sum((s)=>s.priceLines),
            lines: sum((s)=>s.lines),
            boxes: sum((s)=>s.boxes),
            labels: sum((s)=>s.labels),
            polylines: sum((s)=>s.polylines),
            linefills: sum((s)=>s.linefills),
            tables: sum((s)=>s.tables),
            barColors: sum((s)=>s.barColors),
            trades: sum((s)=>s.trades),
            forcedOverlay: sum((s)=>s.forcedOverlay)
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_charting_core_engine_06290y9._.js.map