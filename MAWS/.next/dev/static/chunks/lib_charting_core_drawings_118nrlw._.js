(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Drawing",
    ()=>Drawing,
    "setByPath",
    ()=>setByPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)");
;
class Drawing {
    id;
    paneId;
    /** DATA-space anchors (time+price). The only geometry the model stores. */ anchors;
    style;
    text;
    locked = false;
    visible = true;
    zIndex = 0;
    createdAt;
    // Public so the registry can construct concrete subclasses; `abstract` still
    // prevents `new Drawing()` directly.
    constructor(init){
        this.id = init.id ?? `dw-${Drawing.seq += 1}`;
        this.paneId = init.paneId;
        this.anchors = (init.anchors ?? []).map((p)=>({
                time: p.time,
                price: p.price
            }));
        this.style = init.style ? {
            ...init.style
        } : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultStyle"])();
        this.text = init.text ? {
            ...init.text
        } : undefined;
        this.locked = init.locked ?? false;
        this.visible = init.visible ?? true;
        this.zIndex = init.zIndex ?? 0;
        this.createdAt = init.createdAt ?? Date.now();
        if (init.props) this.readProps(init.props);
    }
    /** Fallback id counter — used only when no id is supplied (store assigns real ids). */ static seq = 0;
    /** True once enough anchors exist to be a real shape. */ isComplete() {
        return this.anchors.length >= this.anchorSchema().min;
    }
    /**
     * How the tool is placed: `'click'` (click each anchor; a variable-count tool —
     * `max > min` — keeps adding until a finish gesture), `'drag'` (press at the first
     * corner, drag, release at the second — the press-drag-release idiom for boxes/ranges/positions),
     * or `'freehand'` (press, drag to capture a path, release). Drives the state machine.
     */ placementMode() {
        return 'click';
    }
    /**
     * Hook run once after interactive placement finishes, before the `create` intent —
     * lets a type finalize its anchors against the live projector (e.g. a position deriving
     * its stop/target/width in pixel space so a bare click drops a default-sized box).
     * Default: no-op.
     */ onPlaced(_proj) {
    /* base keeps its placed anchors as-is */ }
    /**
     * After a single handle (anchor `index`) is dragged, re-impose any cross-anchor invariant —
     * e.g. a position keeps its stop and target on opposite sides of the entry, flipping the
     * non-dragged side across the entry when a drag would put them on the same side. Default: no-op.
     */ constrainHandleDrag(_index) {
    /* base anchors move independently */ }
    /**
     * Apply a whole-body drag — translate the original anchors by (dt, dp) in data space.
     * Default moves every anchor together; a type can pin some (e.g. a callout keeps its
     * pointer tip fixed and moves only the box).
     */ translateBody(dt, dp, orig) {
        return orig.map((o)=>({
                time: o.time + dt,
                price: o.price + dp
            }));
    }
    /**
     * Time span (epoch ms) the drawing occupies, for visible-range culling. Default
     * is the anchor extent; a full-width drawing (e.g. a horizontal line) overrides
     * to `null` meaning "all time" so it never culls.
     */ timeExtent() {
        if (this.anchors.length === 0) return null;
        let lo = Infinity;
        let hi = -Infinity;
        for (const a of this.anchors){
            if (a.time < lo) lo = a.time;
            if (a.time > hi) hi = a.time;
        }
        return {
            min: lo,
            max: hi
        };
    }
    /**
     * Editable per-level config for a rich "gear" settings panel (Fibonacci levels):
     * each entry's `color` / `enabled` / `label` is mutated via a `levels.<i>.<field>`
     * settings path. Simple drawings return null (no gear).
     */ editableLevels() {
        return null;
    }
    /** Apply a `{ 'dot.path': value }` patch (the popup emits these). */ applySettings(patch) {
        for (const [path, value] of Object.entries(patch)){
            if (path.startsWith('text.') && !this.text) this.text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultText"])();
            setByPath(this, path, value);
        }
    }
    /** Re-read per-type extras (props) onto this instance — used by the store on an edit. */ applyProps(props) {
        this.readProps(props);
    }
    // ── serialization ──
    serialize() {
        return {
            id: this.id,
            type: this.type,
            paneId: this.paneId,
            anchors: this.anchors.map((p)=>({
                    time: p.time,
                    price: p.price
                })),
            style: {
                ...this.style
            },
            text: this.text ? {
                ...this.text
            } : undefined,
            locked: this.locked,
            visible: this.visible,
            zIndex: this.zIndex,
            createdAt: this.createdAt,
            props: this.writeProps()
        };
    }
    /** Per-type extras to serialize into `props` (override in subclasses). */ writeProps() {
        return undefined;
    }
    /** Read per-type extras from a `props` bag (override in subclasses). */ readProps(_props) {
    /* base has no extras */ }
}
function setByPath(obj, path, value) {
    const keys = path.split('.');
    let cur = obj;
    for(let i = 0; i < keys.length - 1; i += 1){
        const k = keys[i];
        let next = cur[k];
        if (next == null || typeof next !== 'object') {
            next = {};
            cur[k] = next;
        }
        cur = next;
    }
    cur[keys[keys.length - 1]] = value;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/DrawingController.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingController",
    ()=>DrawingController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$toolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/toolbar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/DrawingStore.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingHistory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/DrawingHistory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/document.ts [app-client] (ecmascript)");
;
;
;
;
;
;
class DrawingController {
    events;
    store;
    history;
    port;
    enabled;
    activeTool;
    /** Mirror of the renderer's sticky magnet mode (the renderer default is 'off'). */ snapMode;
    /** When on, finishing a drawing leaves the tool armed (instead of one-shot disarm). */ stayInDrawingMode;
    /** Mirror of the renderer-local mode (measure/eraser/none). */ mode;
    /** FAVORITE tool types (insertion-ordered) — user prefs, not document data. */ favs;
    selectedIds;
    clipboard;
    lastStyle;
    subs;
    constructor(renderer, events, option, seriesGateway){
        this.events = events;
        this.store = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DrawingStore"]();
        this.history = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingHistory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingHistory"]();
        this.activeTool = null;
        this.snapMode = 'off';
        this.stayInDrawingMode = false;
        this.mode = null;
        this.favs = new Set();
        this.selectedIds = []; // ordered; [0] is the primary (settings-popup) selection
        this.clipboard = []; // in-memory copy buffer (per chart)
        this.lastStyle = new Map(); // per-tool "last used" style
        this.subs = [];
        this.enabled = !!renderer.capabilities.userDrawings && !!renderer.userDrawingsPort;
        this.port = this.enabled ? renderer.userDrawingsPort : null;
        if (this.port) {
            const { definition, visible } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$toolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildToolbar"])(option);
            this.port.setToolbar(definition);
            this.port.showToolbar(visible);
            if (seriesGateway) this.port.setSeriesGateway?.(seriesGateway);
            this.subs.push(this.port.onDrawingIntent((i)=>this.onIntent(i)));
            this.subs.push(this.store.onChange(()=>this.sync()));
        }
    }
    /** Whether the active renderer supports interactive drawings. */ get supported() {
        return this.enabled;
    }
    // ── tool / toolbar control ──
    setTool(type) {
        if (!this.port) return;
        const changed = type !== this.activeTool;
        this.activeTool = type;
        // Seed the renderer's placement preview with the tool's last-used style so the
        // ghost matches what will be committed (the `create` intent re-applies it too).
        this.port.setActiveTool(type, type ? this.lastStyle.get(type) : undefined);
        // Announce every ACTUAL change — arm, one-shot tool-finished, or programmatic —
        // so external toolbars (a workspace's shared bar) reflect the armed tool.
        if (changed) this.events.emit('drawing:tool', {
            type
        });
    }
    getTool() {
        return this.activeTool;
    }
    // ── magnet + renderer-local modes (measure/eraser) ──
    // The renderer owns the states and their mutual exclusion; the core holds a MIRROR
    // driven from both ends: facade setters push port commands, in-chart toolbar clicks
    // arrive as intents. Equal values no-op on either path, which keeps the
    // command→intent echo loop convergent.
    getSnapMode() {
        return this.snapMode;
    }
    setSnapMode(mode) {
        if (!this.port || mode === this.snapMode) return;
        this.snapMode = mode;
        this.port.setSnapMode?.(mode);
        this.events.emit('drawing:snap', {
            mode
        });
    }
    getStayMode() {
        return this.stayInDrawingMode;
    }
    setStayMode(on) {
        if (!this.port || on === this.stayInDrawingMode) return;
        this.stayInDrawingMode = on;
        this.port.setStayMode?.(on);
        this.events.emit('drawing:stay', {
            on
        });
    }
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        if (!this.port || mode === this.mode) return;
        this.mode = mode;
        this.port.setMode?.(mode);
        this.events.emit('drawing:mode', {
            mode
        });
    }
    showToolbar(visible) {
        this.port?.showToolbar(visible);
    }
    /** The favorite tool types, in the order they were starred. */ favorites() {
        return [
            ...this.favs
        ];
    }
    isFavorite(type) {
        return this.favs.has(type);
    }
    /** Star/unstar one tool. Unknown types are ignored; no-ops don't emit. */ setFavorite(type, on) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDrawingType"])(type)) return;
        if (on === this.favs.has(type)) return;
        if (on) this.favs.add(type);
        else this.favs.delete(type);
        this.pushFavorites();
    }
    /** Replace the whole favorite set (bulk restore) — unknown types are dropped. */ setFavorites(types) {
        const next = types.filter((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDrawingType"])(t) != null);
        if (next.length === this.favs.size && next.every((t)=>this.favs.has(t))) return;
        this.favs = new Set(next);
        this.pushFavorites();
    }
    pushFavorites() {
        const list = [
            ...this.favs
        ];
        this.port?.setFavorites?.(list);
        this.events.emit('drawing:favorites', {
            favorites: list
        });
    }
    setToolbar(option) {
        this.port?.setToolbar((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$toolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildToolbar"])(option).definition);
    }
    /** Display (or clear) another chart's in-progress placement as a ghost — silently
     *  inert on a renderer without the optional `setExternalGhost` seam. */ setExternalGhost(doc) {
        this.port?.setExternalGhost?.(doc);
    }
    /** Push per-tool shortcut hints (pre-formatted display strings) to the toolbar flyouts. */ setToolShortcuts(map) {
        this.port?.setToolShortcuts?.(map);
    }
    // ── programmatic CRUD (facade-facing) ── each is one undo step
    add(type, init = {}) {
        if (!this.enabled) return null;
        const last = this.lastStyle.get(type);
        const style = {
            ...last ?? {},
            ...init.style ?? {}
        };
        const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDrawing"])(type, {
            id: this.store.nextId(),
            paneId: init.paneId ?? 'price',
            anchors: init.anchors,
            style,
            text: init.text,
            props: init.props,
            zIndex: init.zIndex ?? this.startZ(type, init.paneId ?? 'price')
        });
        if (!d) return null;
        this.history.record(this.store.serialize());
        this.store.add(d);
        this.captureStyle(d.id);
        this.events.emit('drawing:created', {
            id: d.id
        });
        return d;
    }
    remove(id) {
        this.deleteMany([
            id
        ]);
    }
    /** Apply a partial record to a drawing (headless write-back from a custom UI). */ update(id, patch) {
        const before = this.store.serialize();
        // Public callers may send a partial style; merge onto the live style so they
        // don't wipe sibling keys. Edit intents write full `serialize()` style and go
        // straight to the store (which replaces wholesale — needed for settings reset).
        const cur = patch.style ? this.store.get(id) : undefined;
        const resolved = patch.style && cur ? {
            ...patch,
            style: {
                ...cur.style,
                ...patch.style
            }
        } : patch;
        if (this.store.update(id, resolved)) {
            this.history.record(before);
            this.captureStyle(id);
            this.events.emit('drawing:edited', {
                id
            });
        }
    }
    /** Apply several partial records as ONE undo step (e.g. hiding/locking/reordering a group). */ updateMany(patches) {
        this.history.begin(this.store.serialize());
        for (const { id, patch } of patches){
            if (this.store.update(id, patch)) {
                this.history.markDirty();
                this.events.emit('drawing:edited', {
                    id
                });
            }
        }
        this.history.commit();
    }
    /** Delete several drawings as ONE undo step (the public face of {@link deleteMany}). */ removeMany(ids) {
        this.deleteMany(ids);
    }
    setLocked(id, v) {
        const before = this.store.serialize();
        this.history.record(before);
        this.store.setLocked(id, v);
        this.events.emit('drawing:edited', {
            id
        });
    }
    setVisible(id, v) {
        const before = this.store.serialize();
        this.history.record(before);
        this.store.setVisible(id, v);
        this.events.emit('drawing:edited', {
            id
        });
    }
    bringToFront(id) {
        const before = this.store.serialize();
        this.history.record(before);
        this.store.bringToFront(id, this.seriesTopZ(this.store.get(id)?.paneId));
        this.events.emit('drawing:edited', {
            id
        });
    }
    sendToBack(id) {
        const before = this.store.serialize();
        this.history.record(before);
        this.store.sendToBack(id, this.seriesBottomZ(this.store.get(id)?.paneId));
        this.events.emit('drawing:edited', {
            id
        });
    }
    /** The top of the pane's series stack — what a front drawing has to clear. 0 when the
     *  renderer keeps drawings on their own layer (no shared z space). */ seriesTopZ(paneId) {
        return paneId !== undefined ? this.port?.stackRange?.(paneId)?.front ?? 0 : 0;
    }
    /** The bottom of the pane's series stack — what a backmost drawing has to undercut. */ seriesBottomZ(paneId) {
        return paneId !== undefined ? this.port?.stackRange?.(paneId)?.back ?? 1 : 1;
    }
    /** Where a NEW drawing starts: just under the pane's price so the candles read on top of it
     *  (falling back to just under the pane's top series where there is no price — a study
     *  pane). Half a key down never ties a series; drawings tying each other paint in insertion
     *  order, so consecutive new drawings still stack newest-in-front. Undefined without a
     *  shared z space — the store then places it over the other drawings, its own layer's top.
     *  A type that COVERS the series (an opaque inset, `coversSeries`) instead starts just
     *  above the whole stack — under the candles its content would be buried. */ startZ(type, paneId) {
        const range = this.port?.stackRange?.(paneId);
        if (!range) return undefined;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDrawingType"])(type)?.coversSeries) return range.front + 0.5;
        return (range.price ?? range.front) - 0.5;
    }
    /** Programmatically select drawings (host UI → chart): shows the on-chart handles + toolbar.
     *  `additive` toggles membership (matching shift-click) instead of replacing. */ select(ids, additive = false) {
        this.setSelection(ids, additive);
    }
    /** Open a drawing's on-chart settings popup (and select it) — a click on it, driven from a host UI. */ openSettings(id) {
        this.port?.openSettings(id);
    }
    // ── undo / redo (core-owned; works even without renderer support) ──
    undo() {
        const next = this.history.undo(this.store.serialize());
        if (next) this.restoreSnapshot(next);
    }
    redo() {
        const next = this.history.redo(this.store.serialize());
        if (next) this.restoreSnapshot(next);
    }
    canUndo() {
        return this.history.canUndo();
    }
    canRedo() {
        return this.history.canRedo();
    }
    // ── clone / clipboard ──
    /** Duplicate drawings in place (clones land on the source, auto-selected → "duplicate then drag"). */ duplicate(ids) {
        if (!this.enabled) return [];
        const sources = this.resolve(ids);
        if (sources.length === 0) return [];
        return this.insertClones(sources.map((d)=>d.serialize()));
    }
    clone(id) {
        return this.duplicate([
            id
        ])[0] ?? null;
    }
    /** Copy drawings into the in-memory clipboard (no model change, no event). */ copy(ids) {
        const docs = this.resolve(ids).map((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clonePlain"])(d.serialize()));
        if (docs.length) this.clipboard = docs;
    }
    paste() {
        if (!this.enabled || this.clipboard.length === 0) return [];
        return this.insertClones(this.clipboard);
    }
    all() {
        return this.store.serialize().drawings;
    }
    // ── persistence (works regardless of renderer support) ──
    toJSON() {
        return this.store.serialize();
    }
    fromJSON(doc) {
        this.history.clear(); // a new document is a context switch — don't undo into the old one
        this.selectedIds = [];
        this.store.load(doc); // load() emits change → sync() when enabled
    }
    destroy() {
        for (const u of this.subs)u();
        this.subs.length = 0;
    }
    // ── internals ──
    /** Set/extend the selection. `additive` toggles membership (shift-click) vs replacing it. */ setSelection(ids, additive = false) {
        let next;
        if (additive) {
            next = [
                ...this.selectedIds
            ];
            for (const id of ids){
                const at = next.indexOf(id);
                if (at >= 0) next.splice(at, 1); // toggle off
                else next.push(id); // toggle on
            }
        } else {
            next = [
                ...ids
            ];
        }
        this.selectedIds = next.filter((id)=>this.store.has(id));
        this.announceSelection();
    }
    /** Push the selection to the renderer and announce it (primary + the full list). */ announceSelection() {
        this.port?.setSelection(this.selectedIds);
        this.events.emit('drawing:selected', {
            id: this.selectedIds[0] ?? null,
            ids: [
                ...this.selectedIds
            ]
        });
    }
    /** Restore a history snapshot, reconciling selection against what survived. */ restoreSnapshot(doc) {
        this.store.load(doc); // fires onChange → sync() + autoscale
        this.selectedIds = this.selectedIds.filter((id)=>this.store.has(id));
        this.announceSelection();
    }
    /** Delete drawings as one undo step; prune them from the selection. */ deleteMany(ids) {
        this.history.begin(this.store.serialize());
        const removed = [];
        for (const id of ids){
            if (this.store.remove(id)) removed.push(id);
            this.history.markDirty();
        }
        this.history.commit();
        if (removed.length === 0) return;
        const survivors = this.selectedIds.filter((id)=>this.store.has(id));
        if (survivors.length !== this.selectedIds.length) this.setSelection(survivors);
        for (const id of removed)this.events.emit('drawing:removed', {
            id
        });
    }
    /** Add clones (fresh ids, fresh mount-order z) as one undo step + select them. */ insertClones(docs) {
        this.history.begin(this.store.serialize());
        const clones = [];
        for (const doc of docs){
            // A copy keeps its source's DEPTH: the clone lands at the same z and, tying it,
            // paints just in front of it — "duplicate then drag" without a jump up the stack.
            const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deserializeDrawing"])({
                ...doc,
                id: this.store.nextId()
            });
            if (!d) continue;
            this.store.add(d);
            this.history.markDirty();
            clones.push(d);
        }
        this.history.commit();
        if (clones.length) {
            this.setSelection(clones.map((c)=>c.id));
            for (const c of clones)this.events.emit('drawing:created', {
                id: c.id
            });
        }
        return clones;
    }
    resolve(ids) {
        return ids.map((id)=>this.store.get(id)).filter((d)=>d != null);
    }
    /** Remember a drawing's style as the "last used" for its type (seeds the next one). */ captureStyle(id) {
        const d = this.store.get(id);
        if (d) this.lastStyle.set(d.type, {
            ...d.style
        });
    }
    sync() {
        this.port?.syncDrawings(this.store.serialize().drawings);
    }
    /** Renderer gesture → authoritative store mutation + event. */ onIntent(i) {
        switch(i.kind){
            case 'arm':
                this.setTool(i.type); // toolbar click → core-authoritative tool state
                break;
            case 'draft':
                // Placement progress — transient, no store mutation. Re-emitted so a
                // multi-chart host can mirror the ghost on linked charts live.
                this.events.emit('drawing:draft', {
                    doc: i.doc
                });
                break;
            case 'create':
                {
                    const before = this.store.serialize();
                    const last = this.lastStyle.get(i.doc.type); // a freshly drawn shape inherits the last-used style
                    const style = last ? {
                        ...i.doc.style,
                        ...last
                    } : i.doc.style;
                    const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deserializeDrawing"])({
                        ...i.doc,
                        id: this.store.nextId(),
                        style
                    });
                    if (!d) return;
                    if (!d.zIndex) d.zIndex = this.startZ(d.type, d.paneId) ?? 0; // a freshly placed drawing starts under the price (or over the stack when it covers the series)
                    this.history.record(before);
                    this.store.add(d);
                    this.captureStyle(d.id);
                    this.events.emit('drawing:created', {
                        id: d.id
                    });
                    break;
                }
            case 'edit':
                {
                    const before = this.store.serialize();
                    if (this.store.update(i.doc.id, i.doc)) {
                        this.history.record(before);
                        this.captureStyle(i.doc.id);
                        this.events.emit('drawing:edited', {
                            id: i.doc.id
                        });
                    }
                    break;
                }
            case 'edit-many':
                {
                    this.history.begin(this.store.serialize());
                    for (const doc of i.docs){
                        if (this.store.update(doc.id, doc)) {
                            this.history.markDirty();
                            this.events.emit('drawing:edited', {
                                id: doc.id
                            });
                        }
                    }
                    this.history.commit();
                    break;
                }
            case 'select':
                this.setSelection(i.ids, i.additive);
                break;
            case 'delete':
                this.deleteMany(i.ids);
                break;
            case 'reorder':
                if (i.to === 'front') this.bringToFront(i.id);
                else this.sendToBack(i.id);
                break;
            case 'settings':
                this.events.emit('drawing:settings', {
                    id: i.id
                });
                break;
            case 'favorite':
                this.setFavorite(i.type, i.on);
                break;
            case 'snap-mode':
                // In-chart magnet click (already applied renderer-side) — mirror + announce.
                if (i.mode !== this.snapMode) {
                    this.snapMode = i.mode;
                    this.events.emit('drawing:snap', {
                        mode: i.mode
                    });
                }
                break;
            case 'stay-mode':
                // In-chart stay-mode click (already applied renderer-side) — mirror + announce.
                if (i.on !== this.stayInDrawingMode) {
                    this.stayInDrawingMode = i.on;
                    this.events.emit('drawing:stay', {
                        on: i.on
                    });
                }
                break;
            case 'mode':
                // Measure/eraser toggled in-chart, or exited as a mutual-exclusion side effect.
                if (i.mode !== this.mode) {
                    this.mode = i.mode;
                    this.events.emit('drawing:mode', {
                        mode: i.mode
                    });
                }
                break;
            case 'tool-finished':
                // Most tools are one-shot (revert to the pointer once placed); brush-family tools
                // always stay armed, and stay-in-drawing-mode keeps every tool armed.
                if (!this.stayInDrawingMode && i.type !== 'freehand' && i.type !== 'highlighter') this.setTool(null);
                break;
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'duplicate':
                this.duplicate(i.ids);
                break;
            case 'clone':
                if (this.enabled && i.docs.length) this.insertClones(i.docs);
                break;
            case 'copy':
                this.copy(i.ids);
                break;
            case 'paste':
                this.paste();
                break;
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/DrawingHistory.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingHistory",
    ()=>DrawingHistory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/document.ts [app-client] (ecmascript)");
;
class DrawingHistory {
    cap;
    undoStack;
    redoStack;
    pending;
    dirtied;
    depth;
    constructor(cap = 100){
        this.cap = cap;
        this.undoStack = [];
        this.redoStack = [];
        this.pending = null; // pre-mutation snapshot of the open transaction
        this.dirtied = false; // promoted-once guard within a transaction
        this.depth = 0; // transaction nesting (re-entrancy)
    }
    /** Open a transaction; `snapshot` is the model state BEFORE any mutation in it. */ begin(snapshot) {
        this.depth += 1;
        if (this.depth === 1) {
            this.pending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clonePlain"])(snapshot);
            this.dirtied = false;
        }
    }
    /** The first mutation inside the open transaction → push the pre-snapshot once. */ markDirty() {
        if (this.depth === 0 || this.dirtied || !this.pending) return;
        this.push(this.pending);
        this.dirtied = true;
    }
    /** Close the transaction; if nothing mutated, the snapshot is dropped (no entry). */ commit() {
        if (this.depth === 0) return;
        this.depth -= 1;
        if (this.depth === 0) {
            this.pending = null;
            this.dirtied = false;
        }
    }
    /** Abort the open transaction (the caller rolled its mutation back); no entry. */ abort() {
        this.commit(); // same teardown — the caller is responsible for restoring state
    }
    /** Atomic step: record the pre-mutation snapshot as one undo entry (or fold into an open txn). */ record(before) {
        if (this.depth > 0) {
            this.markDirty();
            return;
        }
        this.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clonePlain"])(before));
    }
    /** Undo: returns the document to restore (push `current` onto redo), or null if empty. */ undo(current) {
        const prev = this.undoStack.pop();
        if (!prev) return null;
        this.redoStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clonePlain"])(current));
        return prev;
    }
    /** Redo: returns the document to restore (push `current` onto undo), or null if empty. */ redo(current) {
        const next = this.redoStack.pop();
        if (!next) return null;
        this.undoStack.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clonePlain"])(current));
        return next;
    }
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
    /** Drop all history (context switch — e.g. `fromJSON`). */ clear() {
        this.undoStack = [];
        this.redoStack = [];
        this.pending = null;
        this.dirtied = false;
        this.depth = 0;
    }
    push(doc) {
        this.undoStack.push(doc);
        if (this.undoStack.length > this.cap) this.undoStack.shift();
        this.redoStack = []; // a fresh mutation invalidates redo
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/DrawingStore.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingStore",
    ()=>DrawingStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/document.ts [app-client] (ecmascript)");
;
;
;
class DrawingStore {
    byId = new Map();
    seq = 0;
    zCounter = 1;
    listeners = new Set();
    /** Allocate a unique, stable drawing id. */ nextId() {
        this.seq += 1;
        return `dw-${this.seq}`;
    }
    /** Insert a drawing, assigning a mount-order z (later ⇒ painted in front) when it carries
     *  none. The counter only ever grows, so the fallback stays the front among drawings even
     *  after explicit keys landed below it. */ add(d) {
        if (!d.zIndex) d.zIndex = this.zCounter;
        this.zCounter = Math.max(this.zCounter, Math.ceil(d.zIndex)) + 1;
        this.byId.set(d.id, d);
        this.emit();
        return d;
    }
    remove(id) {
        const ok = this.byId.delete(id);
        if (ok) this.emit();
        return ok;
    }
    get(id) {
        return this.byId.get(id);
    }
    has(id) {
        return this.byId.has(id);
    }
    /** Apply a (possibly partial) record onto an existing drawing in place. */ update(id, patch) {
        const d = this.byId.get(id);
        if (!d) return null;
        if (patch.anchors) d.anchors = patch.anchors.map((p)=>({
                time: p.time,
                price: p.price
            }));
        // Replace style wholesale — edit intents write back `serialize().style`, and a settings
        // reset must be able to drop keys (e.g. fillColor) that are absent from the type default.
        // Callers that want a partial style patch merge before calling update.
        if (patch.style) d.style = {
            ...patch.style
        };
        if (patch.text !== undefined) d.text = patch.text ? {
            ...patch.text
        } : undefined;
        if (patch.paneId !== undefined) d.paneId = patch.paneId;
        if (patch.locked !== undefined) d.locked = patch.locked;
        if (patch.visible !== undefined) d.visible = patch.visible;
        if (patch.zIndex !== undefined) d.zIndex = patch.zIndex;
        if (patch.props !== undefined) d.applyProps(patch.props); // per-type extras (e.g. fib levels)
        this.emit();
        return d;
    }
    /** Every drawing in paint order (ascending z). */ all() {
        return [
            ...this.byId.values()
        ].sort((a, b)=>a.zIndex - b.zIndex);
    }
    /** Drawings on one pane, in paint order. */ byPane(paneId) {
        return this.all().filter((d)=>d.paneId === paneId);
    }
    /** Raise over every drawing — and over `floorZ`, the top of the pane's series stack when
     *  the renderer shares one z space with it, so "front" beats the candles too. */ bringToFront(id, floorZ = 0) {
        const d = this.byId.get(id);
        if (!d) return;
        d.zIndex = Math.max(this.zCounter, Math.floor(floorZ) + 1);
        this.zCounter = d.zIndex + 1;
        this.emit();
    }
    /** Drop under every drawing — and under `ceilZ`, the bottom of the pane's series stack,
     *  so "back" lands behind the candles and the indicators, not just other drawings. */ sendToBack(id, ceilZ = 1) {
        const d = this.byId.get(id);
        if (!d) return;
        const min = Math.min(...[
            ...this.byId.values()
        ].map((x)=>x.zIndex), Math.ceil(ceilZ));
        d.zIndex = min - 1;
        this.emit();
    }
    setLocked(id, v) {
        const d = this.byId.get(id);
        if (d) {
            d.locked = v;
            this.emit();
        }
    }
    setVisible(id, v) {
        const d = this.byId.get(id);
        if (d) {
            d.visible = v;
            this.emit();
        }
    }
    clear() {
        if (this.byId.size === 0) return;
        this.byId.clear();
        this.emit();
    }
    serialize() {
        return {
            version: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DRAWINGS_DOC_VERSION"],
            drawings: this.all().map((d)=>d.serialize())
        };
    }
    /** Replace all drawings from a (validated) document. Unknown types are skipped. */ load(doc) {
        const valid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["migrate"])(doc);
        this.byId.clear();
        this.seq = 0;
        this.zCounter = 1;
        for (const record of valid.drawings){
            const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deserializeDrawing"])(record);
            if (!d) continue; // unknown type → skip, don't crash
            this.byId.set(d.id, d);
            this.zCounter = Math.max(this.zCounter, d.zIndex) + 1;
            this.bumpSeqPast(d.id);
        }
        this.emit();
    }
    onChange(cb) {
        this.listeners.add(cb);
        return ()=>this.listeners.delete(cb);
    }
    /** Keep `nextId()` from colliding with a loaded `dw-N` id. */ bumpSeqPast(id) {
        const m = /^dw-(\d+)$/.exec(id);
        if (m) this.seq = Math.max(this.seq, Number(m[1]));
    }
    emit() {
        for (const cb of this.listeners)cb();
    }
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/document.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DRAWINGS_DOC_VERSION",
    ()=>DRAWINGS_DOC_VERSION,
    "clonePlain",
    ()=>clonePlain,
    "isValidSerialized",
    ()=>isValidSerialized,
    "migrate",
    ()=>migrate
]);
const DRAWINGS_DOC_VERSION = 1;
function clonePlain(value) {
    const sc = globalThis.structuredClone;
    return sc ? sc(value) : JSON.parse(JSON.stringify(value));
}
function isValidSerialized(v) {
    if (!v || typeof v !== 'object') return false;
    const d = v;
    return typeof d.id === 'string' && typeof d.type === 'string' && typeof d.paneId === 'string' && Array.isArray(d.anchors) && d.anchors.every((p)=>p && typeof p.time === 'number' && typeof p.price === 'number') && !!d.style && typeof d.style === 'object';
}
function migrate(doc) {
    const d = doc;
    if (!d || typeof d !== 'object' || d.version !== DRAWINGS_DOC_VERSION || !Array.isArray(d.drawings)) {
        return {
            version: DRAWINGS_DOC_VERSION,
            drawings: []
        };
    }
    return {
        version: DRAWINGS_DOC_VERSION,
        drawings: d.drawings.filter(isValidSerialized)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/effectiveColor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INVALID_FILL",
    ()=>INVALID_FILL,
    "VALID_FILL",
    ()=>VALID_FILL,
    "effectiveFillColor",
    ()=>effectiveFillColor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CalloutBase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
;
const VALID_FILL = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VALID"];
const INVALID_FILL = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INVALID"];
function effectiveFillColor(d, theme) {
    if (d instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternDrawing"]) {
        if (!d.fillTriangles().length) return null; // plain ABCD / Elliott / Head & Shoulders paint no body
        const valid = d.valid();
        return d.style.fillColor ?? (valid == null ? d.style.lineColor : valid ? VALID_FILL : INVALID_FILL);
    }
    if (d instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalloutBase"]) return d.style.fillColor ?? theme.background;
    return d.style.fillColor ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pure hit-test geometry for user drawings. Lives in core (not `renderers/`)
 * because {@link Drawing} hit-test methods consume it and core must not import
 * from a renderer. All inputs/outputs are media pixels; no DOM, no canvas.
 */ /** Distance from point (px,py) to the segment (ax,ay)→(bx,by). */ __turbopack_context__.s([
    "distToPolyline",
    ()=>distToPolyline,
    "distToSegment",
    ()=>distToSegment,
    "extendRay",
    ()=>extendRay,
    "handleAt",
    ()=>handleAt,
    "lineSegmentIntersection",
    ()=>lineSegmentIntersection,
    "pointInBox",
    ()=>pointInBox,
    "pointInCircle",
    ()=>pointInCircle,
    "pointInPolygon",
    ()=>pointInPolygon
]);
function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 <= 1e-9) return Math.hypot(px - ax, py - ay); // degenerate segment → point
    let t = ((px - ax) * dx + (py - ay) * dy) / len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function distToPolyline(px, py, pts) {
    let best = Infinity;
    for(let i = 1; i < pts.length; i += 1){
        const a = pts[i - 1];
        const b = pts[i];
        const d = distToSegment(px, py, a[0], a[1], b[0], b[1]);
        if (d < best) best = d;
    }
    return best;
}
function pointInBox(px, py, x1, y1, x2, y2, pad = 0) {
    const lo = Math.min(x1, x2) - pad;
    const hi = Math.max(x1, x2) + pad;
    const top = Math.min(y1, y2) - pad;
    const bot = Math.max(y1, y2) + pad;
    return px >= lo && px <= hi && py >= top && py <= bot;
}
function pointInCircle(px, py, cx, cy, r) {
    return Math.hypot(px - cx, py - cy) <= r;
}
function pointInPolygon(px, py, poly) {
    let inside = false;
    for(let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1){
        const a = poly[i];
        const b = poly[j];
        const intersect = a[1] > py !== b[1] > py && px < (b[0] - a[0]) * (py - a[1]) / (b[1] - a[1]) + a[0];
        if (intersect) inside = !inside;
    }
    return inside;
}
function lineSegmentIntersection(lx1, ly1, lx2, ly2, ax, ay, bx, by) {
    const dx = lx2 - lx1;
    const dy = ly2 - ly1;
    const ex = bx - ax;
    const ey = by - ay;
    const denom = ex * dy - ey * dx;
    if (Math.abs(denom) < 1e-9) return null; // parallel
    const s = ((ay - ly1) * dx - (ax - lx1) * dy) / denom; // segment param at the crossing
    if (s < 0 || s > 1) return null; // crossing is beyond the segment's endpoints
    return [
        ax + s * ex,
        ay + s * ey
    ];
}
function handleAt(px, py, handles, rad = 6) {
    for(let i = 0; i < handles.length; i += 1){
        const h = handles[i];
        if (Math.hypot(px - h[0], py - h[1]) <= rad) return i;
    }
    return -1;
}
function extendRay(x1, y1, x2, y2, extend, width, height) {
    if (extend === 'none') return [
        x1,
        y1,
        x2,
        y2
    ];
    const dx = x2 - x1;
    const left = extend === 'left' || extend === 'both';
    const right = extend === 'right' || extend === 'both';
    if (Math.abs(dx) < 1e-6) {
        // Vertical: extend runs along the line itself.
        if (left && right) return [
            x1,
            0,
            x2,
            height
        ];
        const downward = y2 >= y1;
        if (right) return downward ? [
            x1,
            y1,
            x2,
            height
        ] : [
            x1,
            y1,
            x2,
            0
        ];
        return downward ? [
            x1,
            0,
            x2,
            y2
        ] : [
            x1,
            height,
            x2,
            y2
        ];
    }
    const slope = (y2 - y1) / dx;
    const yAt = (x)=>y1 + slope * (x - x1);
    const lx = left ? -2 : Math.min(x1, x2);
    const rx = right ? width + 2 : Math.max(x1, x2);
    return [
        lx,
        yAt(lx),
        rx,
        yAt(rx)
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Renderer-agnostic user-drawings model. Nothing here imports from `renderers/`;
 * the renderer depends on this, never the reverse.
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$effectiveColor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/effectiveColor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TrendLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HorizontalLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HorizontalLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Ray$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Ray.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TwoPointLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TwoPointLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ExtendedLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ExtendedLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$VerticalLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/VerticalLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HorizontalRay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HorizontalRay.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CrossLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CrossLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$InfoLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/InfoLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendAngle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TrendAngle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Box$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Box.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PinnedLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PinnedLabel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TextLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TextLabel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Note$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Note.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PriceLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PriceLabel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ParallelChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ParallelChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DisjointChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/DisjointChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FlatTopBottom$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FlatTopBottom.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RegressionChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RegressionChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$AnchoredVwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/AnchoredVwap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FixedRangeVolumeProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FixedRangeVolumeProfile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Pitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Pitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PitchforkVariant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PitchforkVariant.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SchiffPitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SchiffPitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ModifiedSchiffPitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ModifiedSchiffPitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$InsidePitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/InsidePitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Arrow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Arrow.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Ellipse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Ellipse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Triangle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Triangle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PathDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PathDrawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Polyline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Polyline.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Freehand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Freehand.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Highlighter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Highlighter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Circle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Circle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RotatedRect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RotatedRect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Path.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Arc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Arc.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Curve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Curve.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ArrowMark$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ArrowMark.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GlyphStamp$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GlyphStamp.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibLevels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibLevels.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRetracement$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRetracement.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibExtension$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibExtension.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibExtensionTrend$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibExtensionTrend.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibFan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibTimeZones$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibTimeZones.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibSpeedFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibSpeedFan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendFibTime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TrendFibTime.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RadialFib$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RadialFib.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibCircles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibCircles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibArcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibArcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibWedge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibWedge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibSpiral$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibSpiral.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CalloutBase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Callout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Callout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PriceNote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PriceNote.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Comment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Comment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Signpost$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Signpost.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GannFan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannBox$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GannBox.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannSquare$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GannSquare.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DedekindTessellation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/DedekindTessellation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/MachFigure.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GoldenMach$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GoldenMach.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$XABCD$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/XABCD.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Gartley$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Gartley.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Bat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Bat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Butterfly$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Butterfly.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Crab$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Crab.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Shark$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Shark.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Cypher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Cypher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ABCDPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ABCDPattern.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ElliottImpulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ElliottImpulse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ElliottCorrection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ElliottCorrection.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HeadShoulders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HeadShoulders.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MeasureBox$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/MeasureBox.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DatePriceRange$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/DatePriceRange.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PositionTool$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PositionTool.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Magnifier$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Magnifier.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$document$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/document.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/DrawingStore.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingHistory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/DrawingHistory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$toolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/toolbar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$DrawingController$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/DrawingController.ts [app-client] (ecmascript)");
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
"[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LEVEL_AMBER",
    ()=>LEVEL_AMBER,
    "LEVEL_ANCHOR",
    ()=>LEVEL_ANCHOR,
    "LEVEL_AQUA",
    ()=>LEVEL_AQUA,
    "LEVEL_BLUE",
    ()=>LEVEL_BLUE,
    "LEVEL_CORAL",
    ()=>LEVEL_CORAL,
    "LEVEL_CYAN",
    ()=>LEVEL_CYAN,
    "LEVEL_CYCLE",
    ()=>LEVEL_CYCLE,
    "LEVEL_GREEN",
    ()=>LEVEL_GREEN,
    "LEVEL_ORANGE",
    ()=>LEVEL_ORANGE,
    "LEVEL_PINK",
    ()=>LEVEL_PINK,
    "LEVEL_PURPLE",
    ()=>LEVEL_PURPLE,
    "LEVEL_RED",
    ()=>LEVEL_RED,
    "LEVEL_TEAL",
    ()=>LEVEL_TEAL,
    "LEVEL_UNITY",
    ()=>LEVEL_UNITY,
    "LEVEL_VIOLET",
    ()=>LEVEL_VIOLET,
    "cycleColor",
    ()=>cycleColor,
    "cycleLevels",
    ()=>cycleLevels,
    "fibLevels",
    ()=>fibLevels,
    "levelColor",
    ()=>levelColor
]);
// The LEVEL PALETTE — the one color convention every subdivided tool paints its levels
// with, so the 0.618 of a retracement, a fan, an arc set and a Gann box are all the same
// color. Before this module each of the ~18 tools restated the same hex list, and they had
// already drifted (two near-identical blues, one ratio colored three different ways).
//
// Two ways to color a level, matching the two kinds of tool:
//   • BY RATIO ({@link levelColor}) — Fibonacci-style tools, where a ratio has a conventional
//     color a trader recognizes, and the anchor ratios (0, 1, 2, 3) read as neutral bounds.
//   • BY POSITION ({@link cycleColor}) — sequence tools (Gann fan angles, Mach waves), where
//     the level has no canonical ratio and only needs to be distinguishable from its
//     neighbours.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
const LEVEL_ANCHOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"];
const LEVEL_RED = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"];
const LEVEL_ORANGE = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"];
const LEVEL_GREEN = '#4caf50';
const LEVEL_TEAL = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"];
const LEVEL_BLUE = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"];
const LEVEL_PURPLE = '#9c27b0';
const LEVEL_PINK = '#e91e63';
const LEVEL_AQUA = '#26a69a';
const LEVEL_VIOLET = '#ab47bc';
const LEVEL_CORAL = '#ef5350';
const LEVEL_AMBER = '#ffb74d';
const LEVEL_CYAN = '#38c0fd';
const LEVEL_UNITY = '#b2b5be';
const LEVEL_CYCLE = [
    LEVEL_CYAN,
    LEVEL_BLUE,
    LEVEL_TEAL,
    LEVEL_GREEN,
    LEVEL_ORANGE,
    LEVEL_RED,
    LEVEL_PINK,
    LEVEL_PURPLE,
    LEVEL_ANCHOR,
    LEVEL_AQUA,
    LEVEL_VIOLET,
    LEVEL_CORAL
];
function cycleColor(index) {
    return LEVEL_CYCLE[(index % LEVEL_CYCLE.length + LEVEL_CYCLE.length) % LEVEL_CYCLE.length];
}
/** The conventional color of each Fibonacci-family ratio. */ const RATIO_COLORS = [
    [
        0,
        LEVEL_ANCHOR
    ],
    [
        0.125,
        LEVEL_RED
    ],
    [
        0.236,
        LEVEL_RED
    ],
    [
        0.25,
        LEVEL_RED
    ],
    [
        0.382,
        LEVEL_ORANGE
    ],
    [
        0.5,
        LEVEL_GREEN
    ],
    [
        0.618,
        LEVEL_TEAL
    ],
    [
        0.75,
        LEVEL_BLUE
    ],
    [
        0.786,
        LEVEL_BLUE
    ],
    [
        1,
        LEVEL_ANCHOR
    ],
    [
        1.272,
        LEVEL_BLUE
    ],
    [
        1.382,
        LEVEL_ORANGE
    ],
    [
        1.618,
        LEVEL_RED
    ],
    [
        2,
        LEVEL_ANCHOR
    ],
    [
        2.382,
        LEVEL_ORANGE
    ],
    [
        2.618,
        LEVEL_ORANGE
    ],
    [
        3,
        LEVEL_ANCHOR
    ],
    [
        4.236,
        LEVEL_GREEN
    ],
    [
        6.854,
        LEVEL_TEAL
    ],
    [
        11.09,
        LEVEL_BLUE
    ]
];
function levelColor(ratio, index = 0) {
    return RATIO_COLORS.find(([r])=>r === ratio)?.[1] ?? cycleColor(index);
}
function fibLevels(specs) {
    return specs.map((spec, i)=>{
        const s = typeof spec === 'number' ? {
            ratio: spec
        } : spec;
        return {
            ratio: s.ratio,
            color: s.color ?? levelColor(s.ratio, i),
            enabled: s.enabled !== false,
            ...s.label ? {
                label: s.label
            } : {}
        };
    });
}
function cycleLevels(count, enabledCount = count) {
    return Array.from({
        length: count
    }, (_, i)=>({
            ratio: i + 1,
            color: cycleColor(i),
            enabled: i < enabledCount,
            label: String(i + 1)
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDrawing",
    ()=>createDrawing,
    "deserializeDrawing",
    ()=>deserializeDrawing,
    "drawingTypes",
    ()=>drawingTypes,
    "getDrawingType",
    ()=>getDrawingType,
    "registerDrawingType",
    ()=>registerDrawingType,
    "resetDrawingSettings",
    ()=>resetDrawingSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/icons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TrendLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HorizontalLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HorizontalLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Ray$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Ray.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ExtendedLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ExtendedLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$VerticalLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/VerticalLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HorizontalRay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HorizontalRay.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CrossLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CrossLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$InfoLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/InfoLine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendAngle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TrendAngle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Box$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Box.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TextLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TextLabel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Note$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Note.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PriceLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PriceLabel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Callout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Callout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PriceNote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PriceNote.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Comment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Comment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Signpost$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Signpost.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ParallelChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ParallelChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DisjointChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/DisjointChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FlatTopBottom$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FlatTopBottom.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RegressionChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RegressionChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$AnchoredVwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/AnchoredVwap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FixedRangeVolumeProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FixedRangeVolumeProfile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Pitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Pitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SchiffPitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SchiffPitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ModifiedSchiffPitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ModifiedSchiffPitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$InsidePitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/InsidePitchfork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Arrow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Arrow.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Ellipse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Ellipse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Triangle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Triangle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Polyline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Polyline.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Freehand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Freehand.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Highlighter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Highlighter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Circle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Circle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RotatedRect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RotatedRect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Path.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Arc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Arc.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Curve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Curve.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ArrowMark$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ArrowMark.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GlyphStamp$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GlyphStamp.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRetracement$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRetracement.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibExtension$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibExtension.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibExtensionTrend$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibExtensionTrend.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibFan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibTimeZones$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibTimeZones.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibChannel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibSpeedFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibSpeedFan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendFibTime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TrendFibTime.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibCircles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibCircles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibArcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibArcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibWedge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibWedge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibSpiral$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibSpiral.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GannFan.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannBox$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GannBox.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannSquare$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GannSquare.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DedekindTessellation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/DedekindTessellation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/MachFigure.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GoldenMach$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/GoldenMach.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$XABCD$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/XABCD.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ABCDPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ABCDPattern.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ElliottImpulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ElliottImpulse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ElliottCorrection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/ElliottCorrection.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HeadShoulders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HeadShoulders.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Gartley$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Gartley.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Bat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Bat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Butterfly$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Butterfly.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Crab$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Crab.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Shark$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Shark.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Cypher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Cypher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DatePriceRange$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/DatePriceRange.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PositionTool$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PositionTool.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Magnifier$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Magnifier.ts [app-client] (ecmascript)");
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
const REGISTRY = new Map();
function registerDrawingType(meta) {
    REGISTRY.set(meta.type, meta);
}
function getDrawingType(type) {
    return REGISTRY.get(type);
}
function drawingTypes() {
    return [
        ...REGISTRY.values()
    ];
}
function createDrawing(type, init) {
    const meta = REGISTRY.get(type);
    if (!meta) return null;
    // Merge any caller style onto the type's default so a partial override keeps the
    // rest (e.g. a box keeps its default fill when only the line color is set), and an
    // absent/undefined style doesn't clobber the default.
    const style = {
        ...meta.defaultStyle,
        ...init.style ?? {}
    };
    return meta.create({
        ...init,
        style
    });
}
function resetDrawingSettings(drawing) {
    const fresh = createDrawing(drawing.type, {
        paneId: drawing.paneId
    });
    if (!fresh) return;
    drawing.style = {
        ...fresh.style
    };
    const keptValue = drawing.text?.value;
    if (fresh.text) {
        drawing.text = {
            ...fresh.text
        };
        if (keptValue !== undefined) drawing.text.value = keptValue;
    } else {
        // Drop lazily-created text styling (e.g. measure-box label color/size).
        drawing.text = undefined;
    }
    const props = fresh.serialize().props;
    if (props !== undefined) drawing.applyProps(props);
}
function deserializeDrawing(doc) {
    const meta = REGISTRY.get(doc.type);
    return meta ? meta.create(doc) : null;
}
// ── built-in lean-core types ──
const LINE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="4" y1="19" x2="20" y2="5"/>');
const HLINE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="12" x2="21" y2="12"/>');
registerDrawingType({
    type: 'trendline',
    group: 'lines',
    label: 'Trend Line',
    icon: LINE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendLine"](init)
});
registerDrawingType({
    type: 'hline',
    group: 'lines',
    label: 'Horizontal Line',
    icon: HLINE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'dashed'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HorizontalLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HorizontalLine"](init)
});
const RAY_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="20" x2="21" y2="6"/><circle cx="3" cy="20" r="1.6" fill="currentColor"/>');
const BOX_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<rect x="4" y="6" width="16" height="12" rx="1"/>');
const TEXT_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M5 6h14M12 6v13"/>');
registerDrawingType({
    type: 'ray',
    group: 'lines',
    label: 'Ray',
    icon: RAY_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Ray$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Ray"](init)
});
const EXTLINE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M5 19 19 5"/><path d="M5 19 8.5 19M5 19 5 15.5"/><path d="M19 5 15.5 5M19 5 19 8.5"/>');
const VLINE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="12" y1="3" x2="12" y2="21"/>');
const HRAY_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="5" y1="12" x2="21" y2="12"/><circle cx="5" cy="12" r="1.6" fill="currentColor"/>');
const CROSSLINE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/>');
const INFOLINE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 20 20 4"/><rect x="9" y="9" width="9" height="6" rx="1"/>');
const TRENDANGLE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 20 20 6"/><path d="M4 20 15 20"/><path d="M11 20a7 7 0 0 0-2-4.9"/>');
registerDrawingType({
    type: 'extendedline',
    group: 'lines',
    label: 'Extended Line',
    icon: EXTLINE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ExtendedLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtendedLine"](init)
});
registerDrawingType({
    type: 'vline',
    group: 'lines',
    label: 'Vertical Line',
    icon: VLINE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$VerticalLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerticalLine"](init)
});
registerDrawingType({
    type: 'hray',
    group: 'lines',
    label: 'Horizontal Ray',
    icon: HRAY_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HorizontalRay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HorizontalRay"](init)
});
registerDrawingType({
    type: 'crossline',
    group: 'lines',
    label: 'Cross Line',
    icon: CROSSLINE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CrossLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CrossLine"](init)
});
registerDrawingType({
    type: 'infoline',
    group: 'lines',
    label: 'Info Line',
    icon: INFOLINE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$InfoLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoLine"](init)
});
registerDrawingType({
    type: 'trendangle',
    group: 'lines',
    label: 'Trend Angle',
    icon: TRENDANGLE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendAngle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendAngle"](init)
});
registerDrawingType({
    type: 'box',
    group: 'shapes',
    label: 'Rectangle',
    icon: BOX_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}26`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Box$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box"](init)
});
registerDrawingType({
    type: 'text',
    group: 'annotations',
    label: 'Text',
    icon: TEXT_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TextLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextLabel"](init)
});
const CALLOUT_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-5 5v-5H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>');
registerDrawingType({
    type: 'callout',
    group: 'annotations',
    label: 'Callout',
    icon: CALLOUT_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}d9`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Callout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Callout"](init)
});
const NOTE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7l-4 4v-4H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M8 8.5h8M8 12h5"/>');
const PRICE_NOTE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<rect x="10" y="4.5" width="11" height="8" rx="1.5"/><path d="M10 8.5 4 16"/><circle cx="3.5" cy="16.5" r="1.6" fill="currentColor" stroke="none"/>');
const COMMENT_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M5 4.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-7l-4 4v-4H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"/>');
const PRICE_LABEL_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 12 7 8h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7Z"/><path d="M10.5 12.5h6" stroke-width="1.4"/>');
const SIGNPOST_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M12 11.5V21"/><rect x="5" y="4" width="14" height="7" rx="1"/><path d="M9 7.5h6"/>');
registerDrawingType({
    type: 'note',
    group: 'annotations',
    label: 'Note',
    icon: NOTE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}d9`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Note$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Note"](init)
});
registerDrawingType({
    type: 'pricenote',
    group: 'annotations',
    label: 'Price Note',
    icon: PRICE_NOTE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}d9`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PriceNote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriceNote"](init)
});
registerDrawingType({
    type: 'comment',
    group: 'annotations',
    label: 'Comment',
    icon: COMMENT_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}d9`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Comment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Comment"](init)
});
registerDrawingType({
    type: 'pricelabel',
    group: 'annotations',
    label: 'Price Label',
    icon: PRICE_LABEL_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}d9`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PriceLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriceLabel"](init)
});
registerDrawingType({
    type: 'signpost',
    group: 'annotations',
    label: 'Signpost',
    icon: SIGNPOST_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}d9`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Signpost$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Signpost"](init)
});
// ── lines & channels ──
const PARALLEL_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="16" x2="21" y2="8"/><line x1="3" y1="21" x2="21" y2="13"/>');
const DISJOINT_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="7" x2="21" y2="10"/><line x1="3" y1="18" x2="21" y2="14"/>');
const PITCHFORK_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="4" cy="12" r="1.6" fill="currentColor"/><line x1="4" y1="12" x2="10" y2="12"/><line x1="10" y1="6" x2="10" y2="18"/><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>');
registerDrawingType({
    type: 'parallelchannel',
    group: 'channels',
    label: 'Parallel Channel',
    icon: PARALLEL_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}1a`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ParallelChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ParallelChannel"](init)
});
registerDrawingType({
    type: 'disjointchannel',
    group: 'channels',
    label: 'Disjoint Channel',
    icon: DISJOINT_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}1a`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DisjointChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DisjointChannel"](init)
});
const FLATTOP_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="18" x2="21" y2="11"/>');
registerDrawingType({
    type: 'flattopbottom',
    group: 'channels',
    label: 'Flat Top/Bottom',
    icon: FLATTOP_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}1a`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FlatTopBottom$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlatTopBottom"](init)
});
const REGRESSION_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="8" x2="21" y2="4"/><line x1="3" y1="16" x2="21" y2="12"/><line x1="3" y1="12" x2="21" y2="8" stroke-dasharray="3 3"/>');
registerDrawingType({
    type: 'regressionchannel',
    group: 'channels',
    label: 'Linear Regression',
    icon: REGRESSION_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RegressionChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RegressionChannel"](init)
});
registerDrawingType({
    type: 'pitchfork',
    group: 'pitchforks',
    label: 'Pitchfork',
    icon: PITCHFORK_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Pitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pitchfork"](init)
});
const SCHIFF_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="4" cy="8" r="1.6" fill="currentColor"/><line x1="4" y1="8" x2="10" y2="12"/><line x1="10" y1="6" x2="10" y2="18"/><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>');
const MODSCHIFF_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="6" cy="9" r="1.6" fill="currentColor"/><line x1="6" y1="9" x2="10" y2="12"/><line x1="10" y1="6" x2="10" y2="18"/><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>');
const INSIDE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="4" y1="12" x2="10" y2="12"/><line x1="10" y1="8" x2="10" y2="16"/><line x1="10" y1="8" x2="21" y2="8"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="16" x2="21" y2="16"/>');
registerDrawingType({
    type: 'schiffpitchfork',
    group: 'pitchforks',
    label: 'Schiff Pitchfork',
    icon: SCHIFF_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SchiffPitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SchiffPitchfork"](init)
});
registerDrawingType({
    type: 'modifiedschiffpitchfork',
    group: 'pitchforks',
    label: 'Modified Schiff Pitchfork',
    icon: MODSCHIFF_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ModifiedSchiffPitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModifiedSchiffPitchfork"](init)
});
registerDrawingType({
    type: 'insidepitchfork',
    group: 'pitchforks',
    label: 'Inside Pitchfork',
    icon: INSIDE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$InsidePitchfork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InsidePitchfork"](init)
});
// ── shapes & annotations ──
const ARROW_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M7 7h10v10"/><path d="M7 17 17 7"/>');
const ELLIPSE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<ellipse cx="12" cy="12" rx="9" ry="6"/>');
const TRIANGLE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M12 4 20 19 4 19Z"/>');
registerDrawingType({
    type: 'arrow',
    group: 'shapes',
    label: 'Arrow',
    icon: ARROW_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        arrowRight: true
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Arrow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Arrow"](init)
});
registerDrawingType({
    type: 'ellipse',
    group: 'shapes',
    label: 'Ellipse',
    icon: ELLIPSE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}1a`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Ellipse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Ellipse"](init)
});
registerDrawingType({
    type: 'triangle',
    group: 'shapes',
    label: 'Triangle',
    icon: TRIANGLE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}1a`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Triangle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Triangle"](init)
});
const POLYLINE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<polyline points="3 17 9 10 13 14 21 5"/>');
const FREEHAND_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M9.5 12 17 4.5a2.12 2.12 0 0 1 3 3L12.5 15"/><path d="M7 14a3 3 0 0 0-3 3c0 1.3-1.2 1.5-1.5 2 .8.9 2 1.5 3.5 1.5a3.5 3.5 0 0 0 3.5-3.5 3 3 0 0 0-2.5-3Z"/>');
const HIGHLIGHTER_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M9 11 15 5l4 4-6 6H9Z"/><path d="M9 15l-2 2"/><path d="M4 21h6"/>');
registerDrawingType({
    type: 'polyline',
    group: 'shapes',
    label: 'Polyline',
    icon: POLYLINE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Polyline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Polyline"](init)
});
registerDrawingType({
    type: 'freehand',
    group: 'shapes',
    label: 'Brush',
    icon: FREEHAND_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Freehand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Freehand"](init)
});
registerDrawingType({
    type: 'highlighter',
    group: 'shapes',
    label: 'Highlighter',
    icon: HIGHLIGHTER_ICON,
    // A marker: wide + translucent by default (the alpha in the color is the highlight's see-through).
    defaultStyle: {
        lineColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MARKER"]}59`,
        lineWidth: 14,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Highlighter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Highlighter"](init)
});
const CIRCLE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="12" cy="12" r="8"/>');
const ROTRECT_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M5 14 9.5 5 19 10 14.5 19 Z"/>');
const PATH_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 19 9 11 13 14 17 8 20 4"/><path d="M17.2 5.5 20 4 19.4 7.1"/>');
const ARC_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 17a8 8 0 0 1 16 0"/><path d="M4 17 20 17"/>');
const CURVE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 18Q12 1 20 14"/>');
const ARROW_UP_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M12 5 12 19"/><path d="M6 11 12 5 18 11"/>');
const ARROW_DOWN_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M12 5 12 19"/><path d="M6 13 12 19 18 13"/>');
registerDrawingType({
    type: 'circle',
    group: 'shapes',
    label: 'Circle',
    icon: CIRCLE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}1a`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Circle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"](init)
});
registerDrawingType({
    type: 'rotatedrect',
    group: 'shapes',
    label: 'Rotated Rectangle',
    icon: ROTRECT_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}26`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RotatedRect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RotatedRect"](init)
});
registerDrawingType({
    type: 'path',
    group: 'shapes',
    label: 'Path',
    icon: PATH_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Path"](init)
});
registerDrawingType({
    type: 'arc',
    group: 'shapes',
    label: 'Arc',
    icon: ARC_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid',
        fillColor: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"]}26`
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Arc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Arc"](init)
});
registerDrawingType({
    type: 'curve',
    group: 'shapes',
    label: 'Curve',
    icon: CURVE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Curve$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Curve"](init)
});
registerDrawingType({
    type: 'arrowmarkup',
    group: 'shapes',
    label: 'Arrow Mark Up',
    icon: ARROW_UP_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ArrowMark$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowMarkUp"](init)
});
registerDrawingType({
    type: 'arrowmarkdown',
    group: 'shapes',
    label: 'Arrow Mark Down',
    icon: ARROW_DOWN_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ArrowMark$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowMarkDown"](init)
});
// ── stamps (single-click glyph markers) ──
const FLAG_MARK_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M6 21V4"/><path d="M6 5h11l-2.5 3.5L17 12H6" fill="currentColor" stroke="none"/>');
const ICON_STAMP_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="m12 3 2.6 5.8 6.4.6-4.8 4.2 1.4 6.2L12 16.9 6.4 19.8 7.8 13.6 3 9.4l6.4-.6Z"/>');
registerDrawingType({
    type: 'flagmark',
    group: 'stamps',
    label: 'Flag',
    icon: FLAG_MARK_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GlyphStamp$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlagMark"](init)
});
registerDrawingType({
    type: 'iconstamp',
    group: 'stamps',
    label: 'Icon',
    icon: ICON_STAMP_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GlyphStamp$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconStamp"](init)
});
// ── fibonacci ──
const FIB_RETRACE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="5" x2="21" y2="5"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="3" y1="19" x2="21" y2="19"/>');
const FIB_EXTEND_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="11" x2="21" y2="11"/><line x1="3" y1="15" x2="14" y2="15"/><line x1="3" y1="20" x2="14" y2="20"/>');
registerDrawingType({
    type: 'fibretracement',
    group: 'fibonacci',
    label: 'Fib Retracement',
    icon: FIB_RETRACE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRetracement$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRetracement"](init)
});
registerDrawingType({
    type: 'fibextension',
    group: 'fibonacci',
    label: 'Fib Extension',
    icon: FIB_EXTEND_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibExtension$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibExtension"](init)
});
const FIB_TREND_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 20 10 9l4 5"/><path d="M14 14h7M14 9h7M14 4h7"/>');
registerDrawingType({
    type: 'fibextensiontrend',
    group: 'fibonacci',
    label: 'Trend-Based Fib Extension',
    icon: FIB_TREND_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibExtensionTrend$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibExtensionTrend"](init)
});
const FIB_FAN_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 20 20 5M4 20 21 11M4 20 21 17M4 20 20 20"/>');
const FIB_TZ_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 5v14M6 5v14M11 5v14M19 5v14"/>');
registerDrawingType({
    type: 'fibfan',
    group: 'fibonacci',
    label: 'Fib Fan',
    icon: FIB_FAN_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibFan"](init)
});
registerDrawingType({
    type: 'fibtimezones',
    group: 'fibonacci',
    label: 'Fib Time Zones',
    icon: FIB_TZ_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'dashed'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibTimeZones$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibTimeZones"](init)
});
const FIB_CHANNEL_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 18 18 9M5 21 20 12M6 13 21 4"/>');
const FIB_SPEEDFAN_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 4 20 20M4 4 20 12M4 4 12 20M4 4 20 4M4 4 4 20"/>');
const FIB_TRENDTIME_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 19 9 8M9 8 12 5v14M14 5v14M18 5v14M21 5v14"/>');
registerDrawingType({
    type: 'fibchannel',
    group: 'fibonacci',
    label: 'Fib Channel',
    icon: FIB_CHANNEL_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibChannel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibChannel"](init)
});
registerDrawingType({
    type: 'fibspeedfan',
    group: 'fibonacci',
    label: 'Fib Speed Resistance Fan',
    icon: FIB_SPEEDFAN_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibSpeedFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibSpeedFan"](init)
});
registerDrawingType({
    type: 'trendfibtime',
    group: 'fibonacci',
    label: 'Trend-Based Fib Time',
    icon: FIB_TRENDTIME_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'dashed'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TrendFibTime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendFibTime"](init)
});
const FIB_CIRCLES_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="10"/>');
const FIB_ARCS_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M8 20a4 4 0 0 1 8 0"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/><circle cx="12" cy="20" r="1.4" fill="currentColor" stroke="none"/>');
const FIB_WEDGE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 20 20 16M4 20 14 4"/><path d="M11.8 18.1A8 8 0 0 0 8.2 13.2"/><path d="M16.6 16.9A13 13 0 0 0 10.9 9"/>');
const FIB_SPIRAL_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M13 12a2 2 0 1 1-2-2 4 4 0 0 1 4 4 6 6 0 0 1-9 5.2 9 9 0 0 1 .5-15"/>');
registerDrawingType({
    type: 'fibcircles',
    group: 'fibonacci',
    label: 'Fib Circles',
    icon: FIB_CIRCLES_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibCircles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibCircles"](init)
});
registerDrawingType({
    type: 'fibarcs',
    group: 'fibonacci',
    label: 'Fib Speed Resistance Arcs',
    icon: FIB_ARCS_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibArcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibArcs"](init)
});
registerDrawingType({
    type: 'fibwedge',
    group: 'fibonacci',
    label: 'Fib Wedge',
    icon: FIB_WEDGE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibWedge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibWedge"](init)
});
registerDrawingType({
    type: 'fibspiral',
    group: 'fibonacci',
    label: 'Fib Spiral',
    icon: FIB_SPIRAL_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibSpiral$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibSpiral"](init)
});
// ── gann ──
const GANN_FAN_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 20 20 20M4 20 20 13M4 20 20 6M4 20 15 4M4 20 9 4M4 20 4 4"/>');
const GANN_BOX_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h16M12 4v16M4 4 20 20" opacity="0.6"/>');
registerDrawingType({
    type: 'gannfan',
    group: 'fibonacci',
    label: 'Gann Fan',
    icon: GANN_FAN_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannFan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GannFan"](init)
});
registerDrawingType({
    type: 'gannbox',
    group: 'fibonacci',
    label: 'Gann Box',
    icon: GANN_BOX_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannBox$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GannBox"](init)
});
const GANN_SQUARE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 20 20 4M4 20 20 12M4 20 12 4" opacity="0.7"/><path d="M4 20a16 16 0 0 1 16-16" opacity="0.5"/>');
registerDrawingType({
    type: 'gannsquare',
    group: 'fibonacci',
    label: 'Gann Square',
    icon: GANN_SQUARE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GannSquare$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GannSquare"](init)
});
const DEDEKIND_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M2 20h20"/><path d="M4 20a8 8 0 0 1 16 0" opacity="0.9"/>' + '<path d="M6 20a4 4 0 0 1 8 0" opacity="0.75"/><path d="M10 20a2 2 0 0 1 4 0" opacity="0.6"/>' + '<path d="M8 20v-6M12 20v-9M16 20v-6" opacity="0.45"/>');
registerDrawingType({
    type: 'dedekind',
    group: 'geometry',
    label: 'Dedekind Tessellation',
    icon: DEDEKIND_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DedekindTessellation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DedekindTessellation"](init)
});
const SONIC_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="16" cy="12" r="5" opacity="0.55"/><circle cx="13" cy="12" r="3.5" opacity="0.75"/><circle cx="10.5" cy="12" r="2"/>' + '<path d="M8 4v16"/>');
const SUPERSONIC_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="17" cy="12" r="4.5" opacity="0.45"/><circle cx="13" cy="12" r="3" opacity="0.7"/><circle cx="10" cy="12" r="1.6"/>' + '<path d="M6 12 16 5M6 12 16 19"/>');
registerDrawingType({
    type: 'sonic',
    group: 'geometry',
    label: 'Sonic',
    icon: SONIC_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sonic"](init)
});
registerDrawingType({
    type: 'supersonic',
    group: 'geometry',
    label: 'Supersonic',
    icon: SUPERSONIC_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Supersonic"](init)
});
const GOLDEN_SONIC_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="16" cy="12" r="5" opacity="0.4"/><circle cx="13" cy="12" r="3.2" opacity="0.65"/><circle cx="10.8" cy="12" r="1.8"/>' + '<path d="M8 4v16"/><path d="M15 8.5h2M12.5 10h2" opacity="0.5"/>');
const GOLDEN_SUPERSONIC_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="17" cy="12" r="4.5" opacity="0.4"/><circle cx="12.5" cy="12" r="2.8" opacity="0.65"/><circle cx="9.8" cy="12" r="1.4"/>' + '<path d="M6 12 16 5M6 12 16 19"/>');
registerDrawingType({
    type: 'goldensonic',
    group: 'geometry',
    label: 'Golden Sonic',
    icon: GOLDEN_SONIC_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GoldenMach$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoldenSonic"](init)
});
registerDrawingType({
    type: 'goldensupersonic',
    group: 'geometry',
    label: 'Golden Supersonic',
    icon: GOLDEN_SUPERSONIC_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$GoldenMach$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoldenSupersonic"](init)
});
// ── patterns ──
const XABCD_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 18 7 8 11 14 15 6 20 16"/>');
const ABCD_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 17 9 7 14 15 20 5"/>');
const ELLIOTT_IMPULSE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 19 8 9 12 13 17 5 21 9"/>');
const ELLIOTT_CORRECTION_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 7 11 16 20 9"/>');
const HEAD_SHOULDERS_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 18 6 12 9 16 12 5 15 16 18 12 21 18"/>');
registerDrawingType({
    type: 'xabcd',
    group: 'patterns',
    label: 'XABCD Pattern',
    icon: XABCD_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$XABCD$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XABCD"](init)
});
registerDrawingType({
    type: 'abcd',
    group: 'patterns',
    label: 'ABCD Pattern',
    icon: ABCD_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ABCDPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ABCDPattern"](init)
});
registerDrawingType({
    type: 'elliottimpulse',
    group: 'patterns',
    label: 'Elliott Impulse Wave (1-5)',
    icon: ELLIOTT_IMPULSE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ElliottImpulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ElliottImpulse"](init)
});
registerDrawingType({
    type: 'elliottcorrection',
    group: 'patterns',
    label: 'Elliott Correction Wave (ABC)',
    icon: ELLIOTT_CORRECTION_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$ElliottCorrection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ElliottCorrection"](init)
});
registerDrawingType({
    type: 'headshoulders',
    group: 'patterns',
    label: 'Head & Shoulders',
    icon: HEAD_SHOULDERS_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HeadShoulders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeadShoulders"](init)
});
// Named harmonics (XABCD with validated Fibonacci bands) — share an XABCD-shaped icon; the label names them.
const HARMONIC_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M3 17 7 6 12 14 17 5 21 16"/><path d="M3 17 21 16" opacity="0.45"/>');
const harmonic = {
    group: 'patterns',
    icon: HARMONIC_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    }
};
registerDrawingType({
    type: 'gartley',
    label: 'Gartley',
    ...harmonic,
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Gartley$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Gartley"](init)
});
registerDrawingType({
    type: 'bat',
    label: 'Bat',
    ...harmonic,
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Bat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bat"](init)
});
registerDrawingType({
    type: 'butterfly',
    label: 'Butterfly',
    ...harmonic,
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Butterfly$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Butterfly"](init)
});
registerDrawingType({
    type: 'crab',
    label: 'Crab',
    ...harmonic,
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Crab$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Crab"](init)
});
registerDrawingType({
    type: 'shark',
    label: 'Shark',
    ...harmonic,
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Shark$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shark"](init)
});
registerDrawingType({
    type: 'cypher',
    label: 'Cypher',
    ...harmonic,
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Cypher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cypher"](init)
});
// ── measurement ──
const MEASURE_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<rect x="4" y="6" width="16" height="12" rx="1"/><path d="M4 18 20 6" opacity="0.5"/>');
registerDrawingType({
    type: 'datepricerange',
    group: 'measure',
    label: 'Date & Price Range',
    icon: MEASURE_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$DatePriceRange$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatePriceRange"](init)
});
// ── positions ──
// Shaded target zone above the entry edge, hollow stop zone below it.
const POSITION_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<rect x="4.5" y="4.5" width="15" height="7.5" rx="1" fill="currentColor" fill-opacity="0.25"/>' + '<rect x="4.5" y="12" width="15" height="7.5" rx="1"/>');
registerDrawingType({
    type: 'position',
    group: 'measure',
    label: 'Long/Short Position',
    icon: POSITION_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PositionTool$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PositionTool"](init)
});
// ── magnifier (lower-timeframe inset) ──
const MAGNIFIER_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.3 15.3 5.2 5.2"/><path d="M8 12.5v-3M10.5 13.5v-5.5M13 12v-2"/>');
registerDrawingType({
    type: 'magnifier',
    group: 'measure',
    label: 'Magnifier',
    icon: MAGNIFIER_ICON,
    // An empty border color means the THEME's contrast ink (white on dark, black on
    // light), resolved at paint time so it follows theme switches; a user pick wins.
    defaultStyle: {
        lineColor: '',
        lineWidth: 1,
        lineStyle: 'solid'
    },
    coversSeries: true,
    placementHint: 'Drag an area on the chart to view it at a lower timeframe',
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Magnifier$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Magnifier"](init)
});
// ── anchored VWAP ──
const VWAP_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<line x1="5" y1="3" x2="5" y2="21"/><path d="M5 16c4 0 5-9 8-9s3 5 8 3"/>');
registerDrawingType({
    type: 'anchoredvwap',
    group: 'measure',
    label: 'Anchored VWAP',
    icon: VWAP_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"],
        lineWidth: 2,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$AnchoredVwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnchoredVwap"](init)
});
// ── fixed-range volume profile ──
const FRVP_ICON = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svg24"])('<path d="M4 4v16"/><path d="M4 8h10"/><path d="M4 12h14"/><path d="M4 16h8"/><path d="M4 20h12"/>');
registerDrawingType({
    type: 'fixedrangevp',
    group: 'measure',
    label: 'Fixed Range Volume Profile',
    icon: FRVP_ICON,
    defaultStyle: {
        lineColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"],
        lineWidth: 1,
        lineStyle: 'solid'
    },
    create: (init)=>new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FixedRangeVolumeProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FixedRangeVolumeProfile"](init)
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * A data-driven settings schema. Each {@link SettingsField} names a dot-path into
 * a drawing (`'style.lineColor'`, `'text.value'`) plus a control `kind`, so the
 * renderer's settings popup builds controls generically — adding a new drawing
 * type is a schema entry, not new UI code.
 */ __turbopack_context__.s([
    "FILL_FIELDS",
    ()=>FILL_FIELDS,
    "LINE_FIELDS",
    ()=>LINE_FIELDS,
    "LINE_STYLE_OPTIONS",
    ()=>LINE_STYLE_OPTIONS,
    "TEXT_FIELDS",
    ()=>TEXT_FIELDS,
    "TEXT_SIZE_OPTIONS",
    ()=>TEXT_SIZE_OPTIONS
]);
const LINE_STYLE_OPTIONS = [
    {
        value: 'solid',
        label: 'Solid'
    },
    {
        value: 'dashed',
        label: 'Dashed'
    },
    {
        value: 'dotted',
        label: 'Dotted'
    }
];
const LINE_FIELDS = [
    {
        path: 'style.lineColor',
        label: 'Line color',
        kind: 'color',
        group: 'line'
    },
    {
        path: 'style.lineWidth',
        label: 'Line width',
        kind: 'number',
        min: 1,
        max: 10,
        step: 1,
        group: 'line'
    },
    {
        path: 'style.lineStyle',
        label: 'Line style',
        kind: 'lineStyle',
        options: LINE_STYLE_OPTIONS,
        group: 'line'
    }
];
const FILL_FIELDS = [
    {
        path: 'style.fillColor',
        label: 'Fill color',
        kind: 'color',
        group: 'fill'
    }
];
const TEXT_SIZE_OPTIONS = [
    {
        value: 'small',
        label: 'Small'
    },
    {
        value: 'normal',
        label: 'Normal'
    },
    {
        value: 'large',
        label: 'Large'
    },
    {
        value: 'huge',
        label: 'Huge'
    }
];
const TEXT_FIELDS = [
    {
        path: 'text.value',
        label: 'Text',
        kind: 'text',
        group: 'text'
    },
    {
        path: 'text.color',
        label: 'Text color',
        kind: 'color',
        group: 'text'
    },
    {
        path: 'text.size',
        label: 'Text size',
        kind: 'select',
        options: TEXT_SIZE_OPTIONS,
        group: 'text'
    },
    {
        path: 'text.bold',
        label: 'Bold',
        kind: 'boolean',
        group: 'text'
    },
    {
        path: 'text.italic',
        label: 'Italic',
        kind: 'boolean',
        group: 'text'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_DRAWING_COLOR",
    ()=>DEFAULT_DRAWING_COLOR,
    "defaultStyle",
    ()=>defaultStyle,
    "defaultText",
    ()=>defaultText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
const DEFAULT_DRAWING_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT_BRIGHT"];
function defaultStyle() {
    return {
        lineColor: DEFAULT_DRAWING_COLOR,
        lineWidth: 2,
        lineStyle: 'solid'
    };
}
function defaultText(value = '') {
    return {
        value,
        size: 'normal',
        hAlign: 'left',
        vAlign: 'top'
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/toolbar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildToolbar",
    ()=>buildToolbar,
    "defaultToolbar",
    ()=>defaultToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/registry.ts [app-client] (ecmascript)");
;
const FIBONACCI_TYPES = [
    'fibretracement',
    'fibextension',
    'fibextensiontrend',
    'fibfan',
    'fibtimezones',
    'fibchannel',
    'fibspeedfan',
    'trendfibtime',
    'fibcircles',
    'fibarcs',
    'fibwedge',
    'fibspiral'
];
const GANN_TYPES = [
    'gannfan',
    'gannbox',
    'gannsquare'
];
const GEOMETRY_TYPES = [
    'dedekind',
    'sonic',
    'supersonic',
    'goldensonic',
    'goldensupersonic'
];
const PATTERN_TYPES = [
    'xabcd',
    'abcd',
    'headshoulders'
];
const ELLIOTT_TYPES = [
    'elliottimpulse',
    'elliottcorrection'
];
const HARMONIC_TYPES = [
    'gartley',
    'bat',
    'butterfly',
    'crab',
    'shark',
    'cypher'
];
const MEASUREMENT_TYPES = [
    'position',
    'datepricerange',
    'magnifier'
];
const VOLUME_TYPES = [
    'anchoredvwap',
    'fixedrangevp'
];
const BRUSH_TYPES = [
    'freehand',
    'highlighter'
];
const ARROW_TYPES = [
    'arrow',
    'arrowmarkup',
    'arrowmarkdown'
];
const SHAPE_TYPES = [
    'box',
    'ellipse',
    'triangle',
    'polyline',
    'circle',
    'rotatedrect',
    'path',
    'arc',
    'curve'
];
const TEXT_TYPES = [
    'text',
    'callout',
    'note',
    'pricenote',
    'comment',
    'pricelabel',
    'signpost'
];
const ICON_TYPES = [
    'flagmark',
    'iconstamp'
];
/** Canonical toolbar layout — seven top-level buttons, each with labelled flyout sections. */ const TOOLBAR_LAYOUT = [
    {
        id: 'lines-channels-pitchforks',
        label: 'Lines',
        sections: [
            {
                label: 'Lines',
                registryGroup: 'lines'
            },
            {
                label: 'Channels',
                registryGroup: 'channels'
            },
            {
                label: 'Pitchforks',
                registryGroup: 'pitchforks'
            }
        ]
    },
    {
        id: 'fibonacci-gann',
        label: 'Fibonacci',
        sections: [
            {
                label: 'Fibonacci',
                types: FIBONACCI_TYPES
            },
            {
                label: 'Gann',
                types: GANN_TYPES
            },
            {
                label: 'Geometry',
                types: GEOMETRY_TYPES
            }
        ]
    },
    {
        id: 'patterns-waves-harmonics',
        label: 'Patterns',
        sections: [
            {
                label: 'Patterns',
                types: PATTERN_TYPES
            },
            {
                label: 'Elliott Waves',
                types: ELLIOTT_TYPES
            },
            {
                label: 'Harmonics',
                types: HARMONIC_TYPES
            }
        ]
    },
    {
        id: 'measurements',
        label: 'Measurements',
        sections: [
            {
                label: 'Measurements',
                types: MEASUREMENT_TYPES
            },
            {
                label: 'Volume',
                types: VOLUME_TYPES
            }
        ]
    },
    {
        id: 'brushes-arrows-shapes',
        label: 'Shapes',
        sections: [
            {
                label: 'Brushes',
                types: BRUSH_TYPES
            },
            {
                label: 'Arrows',
                types: ARROW_TYPES
            },
            {
                label: 'Shapes',
                types: SHAPE_TYPES
            }
        ]
    },
    {
        id: 'text',
        label: 'Text',
        sections: [
            {
                label: 'Text',
                types: TEXT_TYPES
            }
        ]
    },
    {
        id: 'icons',
        label: 'Icons',
        sections: [
            {
                label: 'Icons',
                types: ICON_TYPES
            }
        ]
    }
];
/** Resolve a type key to a {@link ToolDefinition}, or null if unregistered. */ function toolFor(type) {
    const meta = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDrawingType"])(type);
    return meta ? {
        type: meta.type,
        label: meta.label,
        icon: meta.icon
    } : null;
}
/** Index registered tools by their declared registry group (registration order preserved). */ function toolsByRegistryGroup(allowed) {
    const byGroup = new Map();
    for (const meta of (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["drawingTypes"])()){
        if (allowed && !allowed.has(meta.type)) continue;
        const tool = {
            type: meta.type,
            label: meta.label,
            icon: meta.icon
        };
        if (!byGroup.has(meta.group)) byGroup.set(meta.group, []);
        byGroup.get(meta.group).push(tool);
    }
    return byGroup;
}
function resolveSection(source, byGroup, toolMap) {
    if ('registryGroup' in source) return byGroup.get(source.registryGroup) ?? [];
    return source.types.map((type)=>toolMap.get(type)).filter((t)=>t != null);
}
/** Build the canonical seven-group toolbar, optionally restricted to a type subset. */ function assembleToolbar(allowed) {
    const byGroup = toolsByRegistryGroup(allowed);
    const toolMap = new Map();
    for (const tools of byGroup.values()){
        for (const tool of tools)toolMap.set(tool.type, tool);
    }
    const groups = [];
    for (const layout of TOOLBAR_LAYOUT){
        const sections = [];
        const flat = [];
        for (const source of layout.sections){
            const tools = resolveSection(source, byGroup, toolMap);
            if (tools.length === 0) continue;
            sections.push({
                label: source.label,
                tools
            });
            flat.push(...tools);
        }
        if (flat.length === 0) continue;
        groups.push({
            id: layout.id,
            label: layout.label,
            tools: flat,
            sections: sections.length > 0 ? sections : undefined
        });
    }
    return {
        groups
    };
}
/** Group a flat list of type keys into the canonical seven-group layout (drops unregistered types). */ function groupTools(tools) {
    const allowed = new Set();
    for (const type of tools){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDrawingType"])(type)) allowed.add(type);
    }
    return assembleToolbar(allowed);
}
/** Build explicit groups from developer config (drops unregistered/empty entries). */ function resolveGroups(groups) {
    const out = [];
    for (const g of groups){
        const tools = g.tools.map(toolFor).filter((t)=>t != null);
        if (tools.length > 0) out.push({
            id: g.id,
            label: g.label,
            tools
        });
    }
    return {
        groups: out
    };
}
function defaultToolbar() {
    return assembleToolbar();
}
function buildToolbar(option) {
    if (option === false) return {
        definition: defaultToolbar(),
        visible: false
    };
    if (option === undefined || option === true) return {
        definition: defaultToolbar(),
        visible: true
    };
    const visible = option.toolbar ?? true;
    if (option.groups) return {
        definition: resolveGroups(option.groups),
        visible
    };
    if (option.tools) return {
        definition: groupTools(option.tools),
        visible
    };
    return {
        definition: defaultToolbar(),
        visible
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/ABCDPattern.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ABCDPattern",
    ()=>ABCDPattern
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
;
class ABCDPattern extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternDrawing"] {
    type = 'abcd';
    vertexLabels() {
        return [
            'A',
            'B',
            'C',
            'D'
        ];
    }
    legRatios() {
        return true;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/AnchoredVwap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnchoredVwap",
    ()=>AnchoredVwap,
    "computeVwap",
    ()=>computeVwap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
;
/** Fully-transparent variant of the band hue — bumping its opacity in the picker keeps the color. */ const TRANSPARENT_BAND = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"]}00`;
function defaultVwapStyle() {
    return {
        midColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"],
        midStyle: 'solid',
        multiplier: 1,
        upperColor: TRANSPARENT_BAND,
        upperStyle: 'solid',
        lowerColor: TRANSPARENT_BAND,
        lowerStyle: 'solid',
        bandFill: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFO"]}33`
    };
}
function computeVwap(bars, mult) {
    const n = bars.length;
    if (n < 1) return null;
    let totalVol = 0;
    for (const b of bars)totalVol += b.volume > 0 ? b.volume : 0;
    const useVol = totalVol > 0; // no volume anywhere → equal-weight fallback
    let cumW = 0;
    let cumPV = 0;
    let cumP2V = 0;
    const out = [];
    for(let i = 0; i < n; i += 1){
        const b = bars[i];
        const tp = (b.high + b.low + b.close) / 3;
        const w = useVol ? Math.max(0, b.volume) : 1;
        cumW += w;
        cumPV += tp * w;
        cumP2V += tp * tp * w;
        const mid = cumW > 0 ? cumPV / cumW : tp;
        const variance = cumW > 0 ? Math.max(0, cumP2V / cumW - mid * mid) : 0;
        const dev = Math.sqrt(variance) * mult;
        out.push({
            time: b.time,
            mid,
            upper: mid + dev,
            lower: mid - dev
        });
    }
    return out;
}
class AnchoredVwap extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'anchoredvwap';
    /** Cosmetics (seeded from defaults, persisted via props). Definite-assignment: set by
     *  `readProps` during `super()` or by the constructor — never a field initializer, which
     *  would run after `super()` and clobber a restored value. */ vwap;
    /** Last computed price span (min lower … max upper), cached so autoscale's `priceRange()`
     *  — which gets no projector — folds the curve in without recomputing. */ cachedRange = null;
    /** Last computed time span (anchor bar … last bar), cached for `timeExtent()` culling. */ cachedExtent = null;
    constructor(init){
        super(init);
        if (!this.vwap) this.vwap = defaultVwapStyle();
    }
    anchorSchema() {
        // A single anchor bounds only the START time; the VWAP is data-driven and ignores
        // the anchor's price, so its handle is constrained to horizontal moves.
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'anchor',
                    free: 'x'
                }
            ]
        };
    }
    /** Compute the VWAP samples from the anchor time forward, caching the price + time spans. */ series(proj) {
        const a = this.anchors[0];
        if (!a) return null;
        const bars = proj.barsInRange?.(a.time, Number.POSITIVE_INFINITY) ?? null;
        if (!bars || bars.length < 1) return null;
        const pts = computeVwap(bars.map((b)=>({
                time: b.time,
                high: b.high,
                low: b.low,
                close: b.close,
                volume: b.volume ?? 0
            })), this.vwap.multiplier);
        if (pts && pts.length > 0) {
            let min = Infinity;
            let max = -Infinity;
            for (const p of pts){
                if (p.lower < min) min = p.lower;
                if (p.upper > max) max = p.upper;
            }
            this.cachedRange = {
                min,
                max
            };
            this.cachedExtent = {
                min: pts[0].time,
                max: pts[pts.length - 1].time
            };
        }
        return pts;
    }
    /** Resolve the samples to pixel polylines for the painter + hit-test. */ layout(proj) {
        const pts = this.series(proj);
        if (!pts) return null;
        const mid = [];
        const upper = [];
        const lower = [];
        for (const p of pts){
            const x = proj.xOf(p.time);
            const my = proj.yOf(p.mid, this.paneId);
            const uy = proj.yOf(p.upper, this.paneId);
            const ly = proj.yOf(p.lower, this.paneId);
            if (my == null || uy == null || ly == null) continue;
            mid.push([
                x,
                my
            ]);
            upper.push([
                x,
                uy
            ]);
            lower.push([
                x,
                ly
            ]);
        }
        return mid.length > 0 ? {
            mid,
            upper,
            lower
        } : null;
    }
    /** The band outline polygon (upper edge left→right, then lower edge right→left). */ bandPolygon(L) {
        return [
            ...L.upper,
            ...[
                ...L.lower
            ].reverse()
        ];
    }
    hitTest(px, py, proj, tol) {
        const L = this.layout(proj);
        if (!L) return false;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInPolygon"])(px, py, this.bandPolygon(L))) return true;
        return polylineHit(px, py, L.mid, tol) || polylineHit(px, py, L.upper, tol) || polylineHit(px, py, L.lower, tol);
    }
    handlePoints(proj) {
        const L = this.layout(proj);
        if (L && L.mid.length > 0) return [
            L.mid[0]
        ]; // the grab handle sits on the curve's anchor end
        const a = this.anchors[0];
        if (!a) return [];
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? [] : [
            [
                proj.xOf(a.time),
                y
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const L = this.layout(proj);
        if (!L) return null;
        const pts = [
            ...L.upper,
            ...L.lower
        ];
        const xs = pts.map((p)=>p[0]);
        const ys = pts.map((p)=>p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
    priceRange() {
        return this.cachedRange;
    }
    /** Spans anchor→last-bar (cached from the last compute); null before the first paint so it
     *  isn't culled from autoscale prematurely. */ timeExtent() {
        return this.cachedExtent;
    }
    schema() {
        // Custom paths the settings popup renders as dedicated VWAP controls (midline color +
        // style, the band multiplier, the two band-line colors, and the fill).
        return {
            fields: [
                {
                    path: 'vwap.midColor',
                    label: 'VWAP color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'vwap.midStyle',
                    label: 'VWAP style',
                    kind: 'lineStyle',
                    group: 'line'
                },
                {
                    path: 'vwap.multiplier',
                    label: 'Band multiplier',
                    kind: 'number',
                    min: 0.5,
                    max: 5,
                    step: 0.5,
                    group: 'behavior'
                },
                {
                    path: 'vwap.upperColor',
                    label: 'Upper band color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'vwap.lowerColor',
                    label: 'Lower band color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'vwap.bandFill',
                    label: 'Band fill',
                    kind: 'color',
                    group: 'fill'
                }
            ]
        };
    }
    writeProps() {
        return {
            ...this.vwap
        };
    }
    readProps(props) {
        this.vwap = {
            ...defaultVwapStyle(),
            ...props
        };
    }
}
/** True when the pixel is within `tol` of any segment of a polyline. */ function polylineHit(px, py, pts, tol) {
    for(let i = 1; i < pts.length; i += 1){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]) <= tol) return true;
    }
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Arc.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Arc",
    ()=>Arc
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
const ARC_SAMPLES = 40;
class Arc extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'arc';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                },
                {
                    role: 'apex',
                    free: 'both'
                }
            ]
        };
    }
    pinApex() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        const apex = this.anchors[2];
        if (a && b && apex) apex.time = (a.time + b.time) / 2;
    }
    onPlaced() {
        this.pinApex();
    }
    constrainHandleDrag() {
        this.pinApex(); // keep the apex on the chord's midpoint whichever handle moved
    }
    px(proj, i) {
        const a = this.anchors[i];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? null : [
            proj.xOf(a.time),
            y
        ];
    }
    geometry(proj) {
        const A = this.px(proj, 0);
        const B = this.px(proj, 1);
        if (!A || !B) return null;
        const apex = this.anchors[2];
        if (!apex || this.anchors.length < 3) {
            return {
                segments: [
                    [
                        A[0],
                        A[1],
                        B[0],
                        B[1]
                    ]
                ],
                fill: null
            }; // chord only (placing)
        }
        const ay = proj.yOf(apex.price, this.paneId);
        if (ay == null) return null;
        const Mx = (A[0] + B[0]) / 2;
        const My = (A[1] + B[1]) / 2;
        const hx = (B[0] - A[0]) / 2; // half-chord vector
        const hy = (B[1] - A[1]) / 2;
        const len = Math.hypot(hx, hy);
        if (len < 1e-6) return {
            segments: [
                [
                    A[0],
                    A[1],
                    B[0],
                    B[1]
                ]
            ],
            fill: null
        };
        let nx = -hy / len; // unit normal to the chord
        let ny = hx / len;
        const off = (ay - My) * ny; // apex offset along the normal (apex x is pinned to Mx, so its x term is 0)
        if (off < 0) {
            nx = -nx;
            ny = -ny;
        }
        const h = Math.abs(off); // dome height
        const pts = [];
        for(let i = 0; i <= ARC_SAMPLES; i += 1){
            const t = i / ARC_SAMPLES * Math.PI; // 0 → π sweeps B → A over the dome
            const c = Math.cos(t);
            const s = Math.sin(t);
            pts.push([
                Mx + c * hx + s * h * nx,
                My + c * hy + s * h * ny
            ]);
        }
        const segments = [];
        for(let i = 1; i < pts.length; i += 1)segments.push([
            pts[i - 1][0],
            pts[i - 1][1],
            pts[i][0],
            pts[i][1]
        ]);
        segments.push([
            pts[pts.length - 1][0],
            pts[pts.length - 1][1],
            pts[0][0],
            pts[0][1]
        ]); // close along the chord
        return {
            segments,
            fill: pts
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"].map((f)=>({
                        ...f,
                        label: f.label.replace('Line', 'Border')
                    })),
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Arrow.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Arrow",
    ()=>Arrow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class Arrow extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'arrow';
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                }
            ]
        };
    }
    pixels(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const y1 = proj.yOf(a.price, this.paneId);
        const y2 = proj.yOf(b.price, this.paneId);
        if (y1 == null || y2 == null) return null;
        return [
            proj.xOf(a.time),
            y1,
            proj.xOf(b.time),
            y2
        ];
    }
    hitTest(px, py, proj, tol) {
        const p = this.pixels(proj);
        return p != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, p[0], p[1], p[2], p[3]) <= tol;
    }
    handlePoints(proj) {
        const p = this.pixels(proj);
        return p ? [
            [
                p[0],
                p[1]
            ],
            [
                p[2],
                p[3]
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const p = this.pixels(proj);
        if (!p) return null;
        return {
            x: Math.min(p[0], p[2]),
            y: Math.min(p[1], p[3]),
            w: Math.abs(p[2] - p[0]),
            h: Math.abs(p[3] - p[1])
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                {
                    path: 'style.arrowRight',
                    label: 'Head (end)',
                    kind: 'boolean',
                    group: 'line'
                },
                {
                    path: 'style.arrowLeft',
                    label: 'Head (start)',
                    kind: 'boolean',
                    group: 'line'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/ArrowMark.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowMark",
    ()=>ArrowMark,
    "ArrowMarkDown",
    ()=>ArrowMarkDown,
    "ArrowMarkUp",
    ()=>ArrowMarkUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
/** Pixel glyph dimensions (constant on-screen size — the marker never scales with zoom). */ const GLYPH = {
    head: 11,
    headW: 9,
    stemW: 3.5,
    len: 22
};
class ArrowMark extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    anchorSchema() {
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'p',
                    free: 'both'
                }
            ]
        };
    }
    /** The filled glyph polygon in pixel space, tip at the anchor. */ glyphPoints(proj) {
        const a = this.anchors[0];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        if (y == null) return null;
        const x = proj.xOf(a.time);
        const { head, headW, stemW, len } = GLYPH;
        // base glyph points UP (tip at origin, body extends down +y); rotated per direction.
        const base = [
            [
                0,
                0
            ],
            [
                -headW,
                head
            ],
            [
                -stemW,
                head
            ],
            [
                -stemW,
                len
            ],
            [
                stemW,
                len
            ],
            [
                stemW,
                head
            ],
            [
                headW,
                head
            ]
        ];
        const dir = this.dir();
        const rot = ([bx, by])=>{
            switch(dir){
                case 'up':
                    return [
                        bx,
                        by
                    ];
                case 'down':
                    return [
                        bx,
                        -by
                    ];
                case 'left':
                    return [
                        by,
                        bx
                    ];
                default:
                    return [
                        -by,
                        bx
                    ]; // right
            }
        };
        return base.map((p)=>{
            const [rx, ry] = rot(p);
            return [
                x + rx,
                y + ry
            ];
        });
    }
    hitTest(px, py, proj, _tol) {
        const g = this.glyphPoints(proj);
        return g != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInPolygon"])(px, py, g);
    }
    handlePoints(proj) {
        const a = this.anchors[0];
        if (!a) return [];
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? [] : [
            [
                proj.xOf(a.time),
                y
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const g = this.glyphPoints(proj);
        if (!g) return null;
        const xs = g.map((p)=>p[0]);
        const ys = g.map((p)=>p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
    priceRange() {
        const a = this.anchors[0];
        return a ? {
            min: a.price,
            max: a.price
        } : null;
    }
    schema() {
        return {
            fields: [
                {
                    path: 'style.lineColor',
                    label: 'Color',
                    kind: 'color',
                    group: 'line'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
class ArrowMarkUp extends ArrowMark {
    type = 'arrowmarkup';
    dir() {
        return 'up';
    }
}
class ArrowMarkDown extends ArrowMark {
    type = 'arrowmarkdown';
    dir() {
        return 'down';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Bat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Bat",
    ()=>Bat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)");
;
class Bat extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HarmonicPattern"] {
    type = 'bat';
    patternName() {
        return 'Bat';
    }
    ranges() {
        return {
            ab: {
                min: 0.382,
                max: 0.5
            },
            bc: {
                min: 0.382,
                max: 0.886
            },
            cd: {
                min: 1.618,
                max: 2.618
            },
            ad: {
                min: 0.84,
                max: 0.92
            }
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Box.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Box",
    ()=>Box
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class Box extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'box';
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'c1',
                    free: 'both'
                },
                {
                    role: 'c2',
                    free: 'both'
                }
            ]
        };
    }
    rect(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return null;
        return {
            x1: proj.xOf(a.time),
            y1: ya,
            x2: proj.xOf(b.time),
            y2: yb
        };
    }
    hitTest(px, py, proj, tol) {
        const r = this.rect(proj);
        if (!r) return false;
        // A filled box is grabbable anywhere inside; otherwise only near its border.
        if (this.style.fillColor && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, r.x1, r.y1, r.x2, r.y2)) return true;
        const edges = [
            [
                r.x1,
                r.y1,
                r.x2,
                r.y1
            ],
            [
                r.x2,
                r.y1,
                r.x2,
                r.y2
            ],
            [
                r.x2,
                r.y2,
                r.x1,
                r.y2
            ],
            [
                r.x1,
                r.y2,
                r.x1,
                r.y1
            ]
        ];
        return edges.some((e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, e[0], e[1], e[2], e[3]) <= tol);
    }
    handlePoints(proj) {
        const r = this.rect(proj);
        return r ? [
            [
                r.x1,
                r.y1
            ],
            [
                r.x2,
                r.y2
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const r = this.rect(proj);
        if (!r) return null;
        return {
            x: Math.min(r.x1, r.x2),
            y: Math.min(r.y1, r.y2),
            w: Math.abs(r.x2 - r.x1),
            h: Math.abs(r.y2 - r.y1)
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"].map((f)=>({
                        ...f,
                        label: f.label.replace('Line', 'Border')
                    })),
                {
                    path: 'style.fillColor',
                    label: 'Fill color',
                    kind: 'color',
                    group: 'fill'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Butterfly.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Butterfly",
    ()=>Butterfly
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)");
;
class Butterfly extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HarmonicPattern"] {
    type = 'butterfly';
    patternName() {
        return 'Butterfly';
    }
    ranges() {
        return {
            ab: {
                min: 0.74,
                max: 0.83
            },
            bc: {
                min: 0.382,
                max: 0.886
            },
            cd: {
                min: 1.618,
                max: 2.618
            },
            ad: {
                min: 1.272,
                max: 1.618
            }
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Callout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Callout",
    ()=>Callout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CalloutBase.ts [app-client] (ecmascript)");
;
class Callout extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalloutBase"] {
    type = 'callout';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/CalloutBase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalloutBase",
    ()=>CalloutBase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
;
/** Approximate px font size for a named text size (the painter measures the glyphs exactly). */ const SIZE_PX = {
    tiny: 10,
    small: 12,
    normal: 14,
    large: 18,
    huge: 24,
    auto: 14
};
class CalloutBase extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    constructor(init){
        super(init);
        // `defaultLabel()` dispatches to the subclass (a prototype method, available during super()).
        // No color seed: the interactive creation path fixes a theme-contrast ink on the
        // fresh drawing; until then the painter auto-contrasts (`undefined` semantics).
        if (!this.text) this.text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultText"])(this.defaultLabel());
    }
    /** The placeholder text seeded for a fresh annotation. */ defaultLabel() {
        return 'Callout';
    }
    /** The string used to size the approximate hit box (auto-text subclasses override it). */ labelText() {
        return this.text?.value ?? this.defaultLabel();
    }
    anchorSchema() {
        // click the target (the pointer), move to position the box, click again to place it (default
        // 'click' placement) — so the box follows the cursor between the two clicks.
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'target',
                    free: 'both'
                },
                {
                    role: 'box',
                    free: 'both'
                }
            ]
        };
    }
    /** Approximate pixel box around the box anchor (the painter renders the precise glyphs). */ box(proj) {
        const c = this.anchors[1];
        if (!c) return null;
        const cy = proj.yOf(c.price, this.paneId);
        if (cy == null) return null;
        const fs = SIZE_PX[this.text?.size ?? 'normal'] ?? 14;
        const lines = this.labelText().split('\n');
        const cols = Math.max(1, ...lines.map((l)=>l.length));
        const w = Math.max(20, cols * fs * 0.6) + 16;
        const h = lines.length * fs * 1.4 + 12;
        return {
            x: proj.xOf(c.time) - w / 2,
            y: cy - h / 2,
            w,
            h
        };
    }
    /** The target tip + box-center pixels (drives the painter, hit-test, and the tip handle). */ points(proj) {
        const t = this.anchors[0];
        const c = this.anchors[1];
        if (!t || !c) return null;
        const ty = proj.yOf(t.price, this.paneId);
        const cy = proj.yOf(c.price, this.paneId);
        if (ty == null || cy == null) return null;
        return [
            [
                proj.xOf(t.time),
                ty
            ],
            [
                proj.xOf(c.time),
                cy
            ]
        ];
    }
    hitTest(px, py, proj, tol) {
        const b = this.box(proj);
        if (b && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, b.x, b.y, b.x + b.w, b.y + b.h, tol)) return true; // the box body
        const p = this.points(proj);
        return p != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, p[0][0], p[0][1], p[1][0], p[1][1]) <= tol; // the tail/leader
    }
    /** Only the pointer tip is a draggable handle — the box is moved by dragging its body, so no
     *  handle dot sits over the text. */ handlePoints(proj) {
        const p = this.points(proj);
        return p ? [
            p[0]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    /** A body drag moves only the box; the pointer tip stays pinned at its target. */ translateBody(dt, dp, orig) {
        const t = orig[0];
        const b = orig[1];
        if (!t || !b) return orig.map((o)=>({
                time: o.time + dt,
                price: o.price + dp
            }));
        return [
            {
                time: t.time,
                price: t.price
            },
            {
                time: b.time + dt,
                price: b.price + dp
            }
        ];
    }
    bounds(proj) {
        return this.box(proj); // float the settings popup beside the text box
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ],
            textIsContent: true
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Circle.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Circle",
    ()=>Circle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class Circle extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'circle';
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'center',
                    free: 'both'
                },
                {
                    role: 'edge',
                    free: 'both'
                }
            ]
        };
    }
    geom(proj) {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return null;
        const cy = proj.yOf(c.price, this.paneId);
        const ey = proj.yOf(e.price, this.paneId);
        if (cy == null || ey == null) return null;
        const cx = proj.xOf(c.time);
        const ex = proj.xOf(e.time);
        return {
            cx,
            cy,
            r: Math.hypot(ex - cx, ey - cy)
        };
    }
    hitTest(px, py, proj, tol) {
        const g = this.geom(proj);
        if (!g || g.r < 1) return false;
        const d = Math.hypot(px - g.cx, py - g.cy);
        if (this.style.fillColor && d <= g.r) return true; // inside a filled disc
        return Math.abs(d - g.r) <= tol; // near the ring
    }
    handlePoints(proj) {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return [];
        const cy = proj.yOf(c.price, this.paneId);
        const ey = proj.yOf(e.price, this.paneId);
        if (cy == null || ey == null) return [];
        return [
            [
                proj.xOf(c.time),
                cy
            ],
            [
                proj.xOf(e.time),
                ey
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const g = this.geom(proj);
        if (!g) return null;
        return {
            x: g.cx - g.r,
            y: g.cy - g.r,
            w: g.r * 2,
            h: g.r * 2
        };
    }
    priceRange() {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return null;
        return {
            min: Math.min(c.price, e.price),
            max: Math.max(c.price, e.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Comment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Comment",
    ()=>Comment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CalloutBase.ts [app-client] (ecmascript)");
;
class Comment extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalloutBase"] {
    type = 'comment';
    defaultLabel() {
        return 'Comment';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Crab.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Crab",
    ()=>Crab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)");
;
class Crab extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HarmonicPattern"] {
    type = 'crab';
    patternName() {
        return 'Crab';
    }
    ranges() {
        return {
            ab: {
                min: 0.382,
                max: 0.618
            },
            bc: {
                min: 0.382,
                max: 0.886
            },
            cd: {
                min: 2.618,
                max: 3.618
            },
            ad: {
                min: 1.55,
                max: 1.69
            }
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/CrossLine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CrossLine",
    ()=>CrossLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class CrossLine extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'crossline';
    anchorSchema() {
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'p',
                    free: 'both'
                }
            ]
        };
    }
    pt(proj) {
        const a = this.anchors[0];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? null : [
            proj.xOf(a.time),
            y
        ];
    }
    hitTest(px, py, proj, tol) {
        const p = this.pt(proj);
        return p != null && (Math.abs(py - p[1]) <= tol || Math.abs(px - p[0]) <= tol); // either arm
    }
    handlePoints(proj) {
        const p = this.pt(proj);
        return p ? [
            p
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const p = this.pt(proj);
        return p ? {
            x: p[0] - 1,
            y: p[1] - 1,
            w: 2,
            h: 2
        } : null;
    }
    priceRange() {
        const a = this.anchors[0];
        return a ? {
            min: a.price,
            max: a.price
        } : null;
    }
    // The horizontal arm spans the full width → never cull by time.
    timeExtent() {
        return null;
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Curve.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Curve",
    ()=>Curve
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
const CURVE_SAMPLES = 40;
class Curve extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'curve';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                },
                {
                    role: 'control',
                    free: 'both'
                }
            ]
        };
    }
    px(proj, i) {
        const a = this.anchors[i];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? null : [
            proj.xOf(a.time),
            y
        ];
    }
    geometry(proj) {
        const P0 = this.px(proj, 0); // start (on-curve)
        const P2 = this.px(proj, 1); // end (on-curve)
        if (!P0 || !P2) return null;
        const C = this.px(proj, 2); // control (off-curve)
        if (!C || this.anchors.length < 3) {
            return {
                segments: [
                    [
                        P0[0],
                        P0[1],
                        P2[0],
                        P2[1]
                    ]
                ],
                fill: null
            }; // straight chord (placing)
        }
        const pts = [];
        for(let i = 0; i <= CURVE_SAMPLES; i += 1){
            const t = i / CURVE_SAMPLES;
            const u = 1 - t;
            pts.push([
                u * u * P0[0] + 2 * u * t * C[0] + t * t * P2[0],
                u * u * P0[1] + 2 * u * t * C[1] + t * t * P2[1]
            ]);
        }
        const segments = [];
        for(let i = 1; i < pts.length; i += 1)segments.push([
            pts[i - 1][0],
            pts[i - 1][1],
            pts[i][0],
            pts[i][1]
        ]);
        return {
            segments,
            fill: pts
        }; // the curve↔chord lens — only painted when a fill color is set
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Cypher.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Cypher",
    ()=>Cypher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)");
;
const XC_OVER_XA = {
    min: 1.272,
    max: 1.414
}; // C extends the XA leg
const CD_OVER_XC = {
    min: 0.74,
    max: 0.83
}; // D retraces the XC line by ≈0.786
class Cypher extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HarmonicPattern"] {
    type = 'cypher';
    patternName() {
        return 'Cypher';
    }
    ranges() {
        // Only AB/XA is a standard consecutive constraint; BC/CD/AD are unused (see valid()).
        return {
            ab: {
                min: 0.382,
                max: 0.618
            },
            bc: {
                min: 0,
                max: Infinity
            },
            cd: {
                min: 0,
                max: Infinity
            },
            ad: {
                min: 0,
                max: Infinity
            }
        };
    }
    /** XC/XA — point C is a projection of the XA leg beyond A. */ xcOverXa() {
        const x = this.anchors[0];
        const a = this.anchors[1];
        const c = this.anchors[3];
        if (!x || !a || !c) return null;
        const xa = Math.abs(a.price - x.price);
        return xa < 1e-9 ? null : Math.abs(c.price - x.price) / xa;
    }
    /** CD/XC — D is a retracement of the XC line. */ cdOverXc() {
        const x = this.anchors[0];
        const c = this.anchors[3];
        const d = this.anchors[4];
        if (!x || !c || !d) return null;
        const xc = Math.abs(c.price - x.price);
        return xc < 1e-9 ? null : Math.abs(d.price - c.price) / xc;
    }
    ratioOk(i) {
        if (i === 2) return this.inBand(this.legValue('ab'), this.ranges().ab);
        return null; // BC/AB + CD/BC aren't Cypher's defining ratios
    }
    valid() {
        if (this.anchors.length < 5) return null;
        return this.inBand(this.legValue('ab'), this.ranges().ab) && this.inBand(this.xcOverXa(), XC_OVER_XA) && this.inBand(this.cdOverXc(), CD_OVER_XC);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/DatePriceRange.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatePriceRange",
    ()=>DatePriceRange
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MeasureBox$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/MeasureBox.ts [app-client] (ecmascript)");
;
class DatePriceRange extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MeasureBox$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeasureBox"] {
    type = 'datepricerange';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/DedekindTessellation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEDEKIND_CURVATURE_OPTIONS",
    ()=>DEDEKIND_CURVATURE_OPTIONS,
    "DedekindTessellation",
    ()=>DedekindTessellation,
    "dedekindCentersInUnit",
    ()=>dedekindCentersInUnit,
    "isDedekindCenter",
    ()=>isDedekindCenter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
const DEDEKIND_CURVATURE_OPTIONS = [
    4,
    8,
    12,
    16,
    24,
    32,
    48,
    64
];
const DEFAULT_MAX_CURVATURE = 24;
const MIN_ARC_PX = 0.75; // cull semicircles smaller than this
function isDedekindCenter(k, n) {
    if (!Number.isInteger(k) || !Number.isInteger(n) || n <= 0) return false;
    const k2m1 = k * k - 1;
    if (n % 2 === 1) return k2m1 % n === 0;
    if (n % 8 === 0) {
        if (k2m1 % n !== 0) return false;
        return k2m1 / n % 2 !== 0; // quotient must be odd
    }
    return false;
}
function dedekindCentersInUnit(n) {
    const out = [];
    for(let k = 0; k < n; k += 1){
        if (isDedekindCenter(k, n)) out.push(k);
    }
    return out;
}
class DedekindTessellation extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'dedekind';
    /** Max circle curvature n (denominators 1…n). Higher → denser tessellation. */ maxCurvature;
    constructor(init){
        super(init);
        if (this.maxCurvature === undefined) this.maxCurvature = DEFAULT_MAX_CURVATURE;
    }
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'c1',
                    free: 'both'
                },
                {
                    role: 'c2',
                    free: 'both'
                }
            ]
        };
    }
    /** Pixel box + isotropic hyperbolic scale (null until both corners resolve). */ box(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return null;
        const left = Math.min(proj.xOf(a.time), proj.xOf(b.time));
        const right = Math.max(proj.xOf(a.time), proj.xOf(b.time));
        const top = Math.min(ya, yb);
        const bot = Math.max(ya, yb);
        const w = right - left;
        const h = bot - top;
        if (w < 1 || h < 1) return null;
        // Unit semicircle (r = 1) reaches the top of the box; real span follows the aspect ratio.
        const unitPx = h;
        const realSpan = w / unitPx;
        return {
            left,
            right,
            top,
            bot,
            unitPx,
            x0: 0,
            realSpan
        };
    }
    /**
     * Semicircles + vertical geodesics in media pixels, already culled to the box.
     * Verticals are at every half-integer (Kocik case B); arcs use curvatures 1…maxCurvature.
     */ geodesics(proj) {
        const box = this.box(proj);
        if (!box) return null;
        const { left, top, bot, unitPx, x0, realSpan } = box;
        const maxN = Math.max(1, Math.min(64, Math.round(this.maxCurvature)));
        const xMin = x0 - 1 / maxN; // pad so edge arcs aren't clipped away early
        const xMax = x0 + realSpan + 1 / maxN;
        const right = left + realSpan * unitPx;
        const out = [];
        // Vertical geodesics at half-integers (x = k/2, k odd).
        const k0 = Math.floor(xMin * 2);
        const k1 = Math.ceil(xMax * 2);
        for(let k = k0; k <= k1; k += 1){
            if (k % 2 === 0) continue; // only odd k
            const x = left + (k / 2 - x0) * unitPx;
            if (x < left - 0.5 || x > right + 0.5) continue;
            out.push({
                kind: 'vline',
                x,
                y0: bot,
                y1: top
            });
        }
        // Dedekind semicircles: centers k/n + ℤ, radius 1/n.
        for(let n = 1; n <= maxN; n += 1){
            const r = 1 / n;
            const rPx = r * unitPx;
            if (rPx < MIN_ARC_PX) continue;
            const ks = dedekindCentersInUnit(n);
            if (ks.length === 0) continue;
            const tLo = Math.floor(xMin) - 1;
            const tHi = Math.ceil(xMax) + 1;
            for(let t = tLo; t <= tHi; t += 1){
                for (const k of ks){
                    const c = k / n + t;
                    // Skip if the semicircle's diameter misses the visible real span entirely.
                    if (c + r < xMin || c - r > xMax) continue;
                    const cx = left + (c - x0) * unitPx;
                    if (cx + rPx < left - 1 || cx - rPx > right + 1) continue;
                    out.push({
                        kind: 'arc',
                        cx,
                        cy: bot,
                        r: rPx
                    });
                }
            }
        }
        return out;
    }
    hitTest(px, py, proj, tol) {
        const b = this.box(proj);
        return b != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, b.left, b.top, b.right, b.bot, tol);
    }
    handlePoints(proj) {
        const b = this.box(proj);
        return b ? [
            [
                b.left,
                b.top
            ],
            [
                b.right,
                b.bot
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const b = this.box(proj);
        if (!b) return null;
        return {
            x: b.left,
            y: b.top,
            w: b.right - b.left,
            h: b.bot - b.top
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                {
                    path: 'maxCurvature',
                    label: 'Max curvature',
                    kind: 'number',
                    min: 4,
                    max: 64,
                    step: 4,
                    group: 'behavior'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
    writeProps() {
        return {
            maxCurvature: this.maxCurvature
        };
    }
    readProps(props) {
        if (typeof props.maxCurvature === 'number' && Number.isFinite(props.maxCurvature)) {
            this.maxCurvature = Math.max(1, Math.min(64, Math.round(props.maxCurvature)));
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/DisjointChannel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DisjointChannel",
    ()=>DisjointChannel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
class DisjointChannel extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'disjointchannel';
    anchorSchema() {
        return {
            min: 4,
            max: 4,
            slots: [
                {
                    role: 'top1',
                    free: 'both'
                },
                {
                    role: 'top2',
                    free: 'both'
                },
                {
                    role: 'bot1',
                    free: 'both'
                },
                {
                    role: 'bot2',
                    free: 'both'
                }
            ]
        };
    }
    seg(i, j, proj) {
        const a = this.anchors[i];
        const b = this.anchors[j];
        if (!a || !b) return null;
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return null;
        return [
            proj.xOf(a.time),
            ya,
            proj.xOf(b.time),
            yb
        ];
    }
    geometry(proj) {
        const top = this.seg(0, 1, proj);
        const bot = this.seg(2, 3, proj);
        const segments = [
            top,
            bot
        ].filter((s)=>s != null);
        if (segments.length === 0) return null;
        const fill = top && bot ? [
            [
                top[0],
                top[1]
            ],
            [
                top[2],
                top[3]
            ],
            [
                bot[2],
                bot[3]
            ],
            [
                bot[0],
                bot[1]
            ]
        ] : null;
        return {
            segments,
            fill
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/ElliottCorrection.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ElliottCorrection",
    ()=>ElliottCorrection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
;
class ElliottCorrection extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternDrawing"] {
    type = 'elliottcorrection';
    vertexLabels() {
        return [
            'A',
            'B',
            'C'
        ];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/ElliottImpulse.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ElliottImpulse",
    ()=>ElliottImpulse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
;
class ElliottImpulse extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternDrawing"] {
    type = 'elliottimpulse';
    vertexLabels() {
        return [
            '1',
            '2',
            '3',
            '4',
            '5'
        ];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Ellipse.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Ellipse",
    ()=>Ellipse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
const PERIM_SAMPLES = 48; // perimeter samples for outline hit-testing
class Ellipse extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'ellipse';
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'c1',
                    free: 'both'
                },
                {
                    role: 'c2',
                    free: 'both'
                }
            ]
        };
    }
    oval(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return null;
        const xa = proj.xOf(a.time);
        const xb = proj.xOf(b.time);
        return {
            cx: (xa + xb) / 2,
            cy: (ya + yb) / 2,
            rx: Math.abs(xb - xa) / 2,
            ry: Math.abs(yb - ya) / 2
        };
    }
    perimeter(o) {
        const pts = [];
        for(let i = 0; i <= PERIM_SAMPLES; i += 1){
            const t = i / PERIM_SAMPLES * Math.PI * 2;
            pts.push([
                o.cx + o.rx * Math.cos(t),
                o.cy + o.ry * Math.sin(t)
            ]);
        }
        return pts;
    }
    hitTest(px, py, proj, tol) {
        const o = this.oval(proj);
        if (!o || o.rx < 1 || o.ry < 1) return false;
        const f = ((px - o.cx) / o.rx) ** 2 + ((py - o.cy) / o.ry) ** 2;
        if (this.style.fillColor && f <= 1) return true; // inside a filled ellipse
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToPolyline"])(px, py, this.perimeter(o)) <= tol; // near the outline
    }
    handlePoints(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return [];
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return [];
        return [
            [
                proj.xOf(a.time),
                ya
            ],
            [
                proj.xOf(b.time),
                yb
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const o = this.oval(proj);
        if (!o) return null;
        return {
            x: o.cx - o.rx,
            y: o.cy - o.ry,
            w: o.rx * 2,
            h: o.ry * 2
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/ExtendedLine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtendedLine",
    ()=>ExtendedLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TwoPointLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TwoPointLine.ts [app-client] (ecmascript)");
;
;
class ExtendedLine extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TwoPointLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TwoPointLine"] {
    type = 'extendedline';
    hitTest(px, py, proj, tol) {
        const p = this.pixels(proj);
        if (!p) return false;
        const [ex1, ey1, ex2, ey2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(p[0], p[1], p[2], p[3], 'both', proj.width, proj.height);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, ex1, ey1, ex2, ey2) <= tol;
    }
    // Spans the full width in both directions → never cull by time.
    timeExtent() {
        return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibArcs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibArcs",
    ()=>FibArcs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RadialFib$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RadialFib.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
const ARC_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1,
    1.618,
    2.618
]);
class FibArcs extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RadialFib$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadialFib"] {
    type = 'fibarcs';
    defaultLevels() {
        return ARC_LEVELS;
    }
    pts(proj) {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return null;
        const cy = proj.yOf(c.price, this.paneId);
        const ey = proj.yOf(e.price, this.paneId);
        if (cy == null || ey == null) return null;
        return {
            cx: proj.xOf(c.time),
            cy,
            ex: proj.xOf(e.time),
            ey
        };
    }
    radial(proj) {
        const p = this.pts(proj);
        if (!p) return null;
        const R0 = Math.hypot(p.ex - p.cx, p.ey - p.cy);
        const phi = Math.atan2(p.ey - p.cy, p.ex - p.cx); // direction toward the far anchor
        return {
            cx: p.cx,
            cy: p.cy,
            R0,
            a0: phi - Math.PI / 2,
            a1: phi + Math.PI / 2
        };
    }
    boundingLines(proj) {
        const p = this.pts(proj);
        return p ? [
            [
                p.cx,
                p.cy,
                p.ex,
                p.ey
            ]
        ] : []; // the pivot→far baseline
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibChannel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibChannel",
    ()=>FibChannel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
const CHANNEL_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0,
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1,
    1.618,
    2.618
]);
class FibChannel extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'fibchannel';
    defaultLevels() {
        return CHANNEL_LEVELS;
    }
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                },
                {
                    role: 'offset',
                    free: 'both'
                }
            ]
        };
    }
    entryLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const y0 = proj.yOf(a.price, this.paneId);
        const y1 = proj.yOf(b.price, this.paneId);
        if (y0 == null || y1 == null) return null;
        const x0 = proj.xOf(a.time);
        const x1 = proj.xOf(b.time);
        // The offset vector p3 − p1 (zero while only the baseline is placed → levels collapse onto it).
        let dX = 0;
        let dY = 0;
        const c = this.anchors[2];
        if (c) {
            const y2 = proj.yOf(c.price, this.paneId);
            if (y2 == null) return null;
            dX = proj.xOf(c.time) - x0;
            dY = y2 - y0;
        }
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            const ox = lv.ratio * dX;
            const oy = lv.ratio * dY;
            const lx2 = x1 + ox;
            const ly2 = y1 + oy;
            out.push({
                color: lv.color,
                label: lv.label,
                x1: x0 + ox,
                y1: y0 + oy,
                x2: lx2,
                y2: ly2,
                numberText: String(lv.ratio),
                numberX: lx2 + 5,
                numberY: ly2,
                numberAlign: 'left',
                labelX: lx2 + 5,
                labelY: ly2 + 13
            });
        }
        return out;
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        const c = this.anchors[2];
        if (!a || !b) return null;
        const dPrice = c ? c.price - a.price : 0;
        let min = Infinity;
        let max = -Infinity;
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            for (const base of [
                a.price,
                b.price
            ]){
                const p = base + lv.ratio * dPrice;
                if (p < min) min = p;
                if (p > max) max = p;
            }
        }
        return min <= max ? {
            min,
            max
        } : null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibCircles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibCircles",
    ()=>FibCircles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RadialFib$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RadialFib.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
const CIRCLE_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1,
    1.618,
    2.618
]);
class FibCircles extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RadialFib$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadialFib"] {
    type = 'fibcircles';
    defaultLevels() {
        return CIRCLE_LEVELS;
    }
    radial(proj) {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return null;
        const cy = proj.yOf(c.price, this.paneId);
        const ey = proj.yOf(e.price, this.paneId);
        if (cy == null || ey == null) return null;
        const cx = proj.xOf(c.time);
        const ex = proj.xOf(e.time);
        return {
            cx,
            cy,
            R0: Math.hypot(ex - cx, ey - cy),
            a0: 0,
            a1: Math.PI * 2
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibExtension.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibExtension",
    ()=>FibExtension
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibLevels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibLevels.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
/** Extension ratios — the swing plus projections beyond it (>1) for price targets. The
 *  furthest target breaks out of the shared hues to read as the outermost projection. */ const LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0,
    0.382,
    0.618,
    1,
    1.272,
    1.618,
    {
        ratio: 2.618,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_PURPLE"]
    }
]);
class FibExtension extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibLevels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibLevels"] {
    type = 'fibextension';
    defaultLevels() {
        return LEVELS;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibExtensionTrend.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibExtensionTrend",
    ()=>FibExtensionTrend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
/** Trend-based ratios: the move plus projections for price targets. */ const LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0,
    0.382,
    0.5,
    0.618,
    1,
    1.618,
    {
        ratio: 2.618,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_PURPLE"]
    }
]);
class FibExtensionTrend extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'fibextensiontrend';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'a',
                    free: 'both'
                },
                {
                    role: 'b',
                    free: 'both'
                },
                {
                    role: 'c',
                    free: 'both'
                }
            ]
        };
    }
    defaultLevels() {
        return LEVELS;
    }
    entryLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        const c = this.anchors[2];
        if (!a || !b || !c) return null;
        const move = b.price - a.price;
        const xs = [
            proj.xOf(a.time),
            proj.xOf(b.time),
            proj.xOf(c.time)
        ];
        const x1 = Math.min(...xs);
        const x2 = Math.max(...xs);
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            const price = c.price + lv.ratio * move;
            const y = proj.yOf(price, this.paneId);
            if (y == null) continue;
            out.push({
                color: lv.color,
                label: lv.label,
                x1,
                y1: y,
                x2,
                y2: y,
                numberText: `${lv.ratio} (${price.toFixed(2)})`,
                numberX: x1 + 4,
                numberY: y - 7,
                numberAlign: 'left',
                labelX: (x1 + x2) / 2,
                labelY: y - 7
            });
        }
        return out;
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        const c = this.anchors[2];
        if (!a || !b || !c) return null;
        const move = b.price - a.price;
        const prices = this.levels.filter((l)=>l.enabled).map((l)=>c.price + l.ratio * move);
        prices.push(a.price, b.price, c.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibFan.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibFan",
    ()=>FibFan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
;
const FAN_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1
]);
class FibFan extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'fibfan';
    defaultLevels() {
        return FAN_LEVELS;
    }
    fanLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const x0 = proj.xOf(a.time);
        const y0 = proj.yOf(a.price, this.paneId);
        if (y0 == null) return null;
        const xb = proj.xOf(b.time);
        const delta = b.price - a.price;
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            const ty = proj.yOf(a.price + lv.ratio * delta, this.paneId);
            if (ty == null) continue;
            const [x1, y1, x2, y2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(x0, y0, xb, ty, 'right', proj.width, proj.height);
            out.push({
                ratio: lv.ratio,
                color: lv.color,
                label: lv.label,
                x1,
                y1,
                x2,
                y2,
                labelX: xb + 5,
                labelY: ty
            });
        }
        return out;
    }
    entryLines(proj) {
        const lines = this.fanLines(proj);
        if (!lines) return null;
        return lines.map((l)=>({
                color: l.color,
                label: l.label,
                x1: l.x1,
                y1: l.y1,
                x2: l.x2,
                y2: l.y2,
                numberText: String(l.ratio),
                numberX: l.labelX,
                numberY: l.labelY,
                numberAlign: 'left',
                labelX: l.labelX,
                labelY: l.labelY + 13
            }));
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibLevels.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibLevels",
    ()=>FibLevels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
;
class FibLevels extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    /** Per-level pixel line + price for the ENABLED levels, spanning the anchors' time range. */ levelLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const xa = proj.xOf(a.time);
        const xb = proj.xOf(b.time);
        const x1 = Math.min(xa, xb);
        const x2 = Math.max(xa, xb);
        const delta = b.price - a.price;
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            const price = a.price + lv.ratio * delta;
            const y = proj.yOf(price, this.paneId);
            if (y == null) continue;
            out.push({
                ratio: lv.ratio,
                color: lv.color,
                label: lv.label,
                price,
                x1,
                x2,
                y
            });
        }
        return out;
    }
    entryLines(proj) {
        const lines = this.levelLines(proj);
        if (!lines) return null;
        return lines.map((l)=>({
                color: l.color,
                label: l.label,
                x1: l.x1,
                y1: l.y,
                x2: l.x2,
                y2: l.y,
                numberText: `${l.ratio} (${l.price.toFixed(2)})`,
                numberX: l.x1 + 4,
                numberY: l.y - 7,
                numberAlign: 'left',
                labelX: (l.x1 + l.x2) / 2,
                labelY: l.y - 7
            }));
    }
    fillBands(proj) {
        const lines = this.levelLines(proj);
        if (!lines) return [];
        const bands = [];
        for(let i = 1; i < lines.length; i += 1){
            const a = lines[i - 1];
            const b = lines[i];
            bands.push({
                color: b.color,
                x: a.x1,
                y: Math.min(a.y, b.y),
                w: a.x2 - a.x1,
                h: Math.abs(b.y - a.y)
            });
        }
        return bands;
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const delta = b.price - a.price;
        const prices = this.levels.filter((l)=>l.enabled).map((l)=>a.price + l.ratio * delta);
        if (prices.length === 0) return null;
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibRatios",
    ()=>FibRatios
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
const isFibSize = (v)=>v === 'small' || v === 'normal' || v === 'large' || v === 'huge';
/** Coerce an untrusted value into a valid level (defensive, for persistence/round-trip). */ function sanitizeLevel(v) {
    if (!v || typeof v !== 'object') return null;
    const o = v;
    if (typeof o.ratio !== 'number' || typeof o.color !== 'string') return null;
    return {
        ratio: o.ratio,
        color: o.color,
        enabled: o.enabled !== false,
        ...typeof o.label === 'string' && o.label ? {
            label: o.label
        } : {}
    };
}
class FibRatios extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    /** Editable per-entry config (seeded from {@link defaultLevels}, persisted via props). */ levels;
    /** Font size of the auto numbers (bar button cycles it). */ numbersSize;
    /** Font size of the custom labels (bar button cycles it). */ labelsSize;
    constructor(init){
        super(init);
        if (!this.levels) this.levels = this.defaultLevels().map((l)=>({
                ...l
            }));
        if (!this.numbersSize) this.numbersSize = 'small';
        if (!this.labelsSize) this.labelsSize = 'normal';
    }
    /** Optional fill bands between entries (retracement/extension override); default none. */ fillBands(_proj) {
        return [];
    }
    editableLevels() {
        return this.levels;
    }
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                }
            ]
        };
    }
    hitTest(px, py, proj, tol) {
        const lines = this.entryLines(proj);
        return lines != null && lines.some((l)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, l.x1, l.y1, l.x2, l.y2) <= tol);
    }
    handlePoints(proj) {
        const pts = [];
        for (const a of this.anchors){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) return [];
            pts.push([
                proj.xOf(a.time),
                y
            ]);
        }
        return pts;
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const pts = this.handlePoints(proj);
        if (pts.length === 0) return null;
        const xs = pts.map((p)=>p[0]);
        const ys = pts.map((p)=>p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
    schema() {
        // Width + style apply to all entries; per-entry color/enable/label live in the gear panel.
        return {
            fields: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"].filter((f)=>f.path !== 'style.lineColor')
        };
    }
    writeProps() {
        return {
            levels: this.levels.map((l)=>({
                    ...l
                })),
            numbersSize: this.numbersSize,
            labelsSize: this.labelsSize
        };
    }
    readProps(props) {
        if (Array.isArray(props.levels)) {
            const parsed = props.levels.map(sanitizeLevel).filter((l)=>l != null);
            if (parsed.length) this.levels = parsed;
        }
        if (isFibSize(props.numbersSize)) this.numbersSize = props.numbersSize;
        if (isFibSize(props.labelsSize)) this.labelsSize = props.labelsSize;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibRetracement.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibRetracement",
    ()=>FibRetracement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibLevels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibLevels.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
/** Standard retracement ratios (0 → 1). */ const LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0,
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1
]);
class FibRetracement extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibLevels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibLevels"] {
    type = 'fibretracement';
    defaultLevels() {
        return LEVELS;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibSpeedFan.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibSpeedFan",
    ()=>FibSpeedFan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
;
const FAN_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0,
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1
]);
class FibSpeedFan extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'fibspeedfan';
    defaultLevels() {
        return FAN_LEVELS;
    }
    entryLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const y1 = proj.yOf(a.price, this.paneId);
        const y2 = proj.yOf(b.price, this.paneId);
        if (y1 == null || y2 == null) return null;
        const x1 = proj.xOf(a.time);
        const x2 = proj.xOf(b.time);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dir = dx >= 0 ? 'right' : 'left';
        const w = proj.width;
        const h = proj.height;
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            // price ray: pivot → (full width, ratio·height) — subdivides the box's right edge
            const pex = x1 + dx;
            const pey = y1 + dy * lv.ratio;
            const pr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(x1, y1, pex, pey, dir, w, h);
            out.push({
                color: lv.color,
                label: lv.label,
                x1: pr[0],
                y1: pr[1],
                x2: pr[2],
                y2: pr[3],
                numberText: String(lv.ratio),
                numberX: dir === 'right' ? pex + 5 : pex - 5,
                numberY: pey,
                numberAlign: dir === 'right' ? 'left' : 'right',
                labelX: pex,
                labelY: pey
            });
            if (lv.ratio === 1) continue; // the time ray at ratio 1 is the same diagonal as the price ray
            // time ray: pivot → (ratio·width, full height) — subdivides the box's bottom edge
            const tex = x1 + dx * lv.ratio;
            const tey = y1 + dy;
            const tr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(x1, y1, tex, tey, dir, w, h);
            out.push({
                color: lv.color,
                label: lv.label,
                x1: tr[0],
                y1: tr[1],
                x2: tr[2],
                y2: tr[3],
                numberText: String(lv.ratio),
                numberX: tex,
                numberY: tey + (dy >= 0 ? 12 : -12),
                numberAlign: 'center',
                labelX: tex,
                labelY: tey + 12
            });
        }
        return out;
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibSpiral.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibSpiral",
    ()=>FibSpiral
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
const PHI = 1.6180339887;
const GROWTH = Math.log(PHI) / (Math.PI / 2); // radius ×φ per quarter turn → r = R0·e^(GROWTH·s)
const STEP = Math.PI / 64;
const MAX_S = Math.PI; // sample a half-turn past the edge anchor
const MIN_R = 0.5; // stop winding inward once the radius is sub-pixel
class FibSpiral extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'fibspiral';
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'center',
                    free: 'both'
                },
                {
                    role: 'edge',
                    free: 'both'
                }
            ]
        };
    }
    /** The spiral sampled to pixel points (eye → through the edge anchor → a little beyond). */ spiralPoints(proj) {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return null;
        const cy = proj.yOf(c.price, this.paneId);
        const ey = proj.yOf(e.price, this.paneId);
        if (cy == null || ey == null) return null;
        const cx = proj.xOf(c.time);
        const ex = proj.xOf(e.time);
        const R0 = Math.hypot(ex - cx, ey - cy);
        if (R0 < 1) return null;
        const theta0 = Math.atan2(ey - cy, ex - cx);
        const sMin = Math.max(Math.log(MIN_R / R0) / GROWTH, -8 * Math.PI * 2); // inward until sub-pixel (capped)
        const pts = [];
        for(let s = sMin; s <= MAX_S; s += STEP){
            const r = R0 * Math.exp(GROWTH * s);
            const ang = theta0 + s; // dir = +1 → clockwise on a y-down canvas
            pts.push([
                cx + r * Math.cos(ang),
                cy + r * Math.sin(ang)
            ]);
        }
        return pts;
    }
    hitTest(px, py, proj, tol) {
        const pts = this.spiralPoints(proj);
        return pts != null && pts.length >= 2 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToPolyline"])(px, py, pts) <= tol;
    }
    handlePoints(proj) {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return [];
        const cy = proj.yOf(c.price, this.paneId);
        const ey = proj.yOf(e.price, this.paneId);
        if (cy == null || ey == null) return [];
        return [
            [
                proj.xOf(c.time),
                cy
            ],
            [
                proj.xOf(e.time),
                ey
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const pts = this.handlePoints(proj);
        if (pts.length < 2) return null;
        const xs = pts.map((p)=>p[0]);
        const ys = pts.map((p)=>p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
    priceRange() {
        const c = this.anchors[0];
        const e = this.anchors[1];
        if (!c || !e) return null;
        return {
            min: Math.min(c.price, e.price),
            max: Math.max(c.price, e.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibTimeZones.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibTimeZones",
    ()=>FibTimeZones
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
;
;
/** Fibonacci sequence (the time multiples drawn as vertical lines). */ const TZ_LEVELS = [
    0,
    1,
    2,
    3,
    5,
    8,
    13,
    21,
    34
].map(_c = (n)=>({
        ratio: n,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DRAWING_COLOR"],
        enabled: true
    }));
_c1 = TZ_LEVELS;
class FibTimeZones extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'fibtimezones';
    defaultLevels() {
        return TZ_LEVELS;
    }
    zoneLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const unit = b.time - a.time;
        if (Math.abs(unit) < 1e-9) return null;
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            out.push({
                n: lv.ratio,
                color: lv.color,
                label: lv.label,
                x: proj.xOf(a.time + lv.ratio * unit)
            });
        }
        return out;
    }
    entryLines(proj) {
        const lines = this.zoneLines(proj);
        if (!lines) return null;
        const h = proj.height;
        return lines.map((l)=>({
                color: l.color,
                label: l.label,
                x1: l.x,
                y1: 0,
                x2: l.x,
                y2: h,
                numberText: String(l.n),
                numberX: l.x,
                numberY: 9,
                numberAlign: 'center',
                labelX: l.x,
                labelY: 24
            }));
    }
    priceRange() {
        return null; // vertical lines impose no price constraint
    }
    timeExtent() {
        return null; // the zones project far forward → never time-cull
    }
}
var _c, _c1;
__turbopack_context__.k.register(_c, "TZ_LEVELS$[0, 1, 2, 3, 5, 8, 13, 21, 34].map");
__turbopack_context__.k.register(_c1, "TZ_LEVELS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FibWedge.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FibWedge",
    ()=>FibWedge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RadialFib$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/RadialFib.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
const WEDGE_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1
]);
class FibWedge extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$RadialFib$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadialFib"] {
    type = 'fibwedge';
    defaultLevels() {
        return WEDGE_LEVELS;
    }
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'apex',
                    free: 'both'
                },
                {
                    role: 'radius',
                    free: 'both'
                },
                {
                    role: 'angle',
                    free: 'both'
                }
            ]
        };
    }
    px(proj, i) {
        const a = this.anchors[i];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? null : [
            proj.xOf(a.time),
            y
        ];
    }
    radial(proj) {
        const p0 = this.px(proj, 0);
        const p1 = this.px(proj, 1);
        const p2 = this.px(proj, 2);
        if (!p0 || !p1 || !p2) return null;
        const R0 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        if (R0 < 1) return null;
        const angle1 = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
        const angle2 = Math.atan2(p2[1] - p0[1], p2[0] - p0[0]);
        let lo = Math.min(angle1, angle2);
        let hi = Math.max(angle1, angle2);
        if (hi - lo > Math.PI) [lo, hi] = [
            hi,
            lo + Math.PI * 2
        ]; // take the minor (wedge) sweep
        return {
            cx: p0[0],
            cy: p0[1],
            R0,
            a0: lo,
            a1: hi
        };
    }
    boundingLines(proj) {
        const p0 = this.px(proj, 0);
        const p1 = this.px(proj, 1);
        if (!p0 || !p1) return [];
        const out = [
            [
                p0[0],
                p0[1],
                p1[0],
                p1[1]
            ]
        ]; // apex→radius ray
        const p2 = this.px(proj, 2);
        if (p2) {
            const R0 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
            const len = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]);
            if (len > 1e-6) {
                // the second ray re-projected to the same radius R0 (only its angle matters)
                out.push([
                    p0[0],
                    p0[1],
                    p0[0] + (p2[0] - p0[0]) / len * R0,
                    p0[1] + (p2[1] - p0[1]) / len * R0
                ]);
            }
        }
        return out;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FixedRangeVolumeProfile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FixedRangeVolumeProfile",
    ()=>FixedRangeVolumeProfile,
    "buildEstimatedProfile",
    ()=>buildEstimatedProfile,
    "computeFixedRangeProfile",
    ()=>computeFixedRangeProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
;
;
/** Value-area fills at 25% transparency; outside-VA fills at 60% transparency — the value
 *  area is the profile's emphasized region, the tails around it recede. */ const OUTSIDE_UP = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]}66`;
const OUTSIDE_DOWN = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]}66`;
const VA_UP = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]}BF`;
const VA_DOWN = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]}BF`;
function defaultFrvpStyle() {
    return {
        rows: 24,
        valueAreaPct: 70,
        widthPct: 35,
        anchor: 'left',
        upColor: OUTSIDE_UP,
        downColor: OUTSIDE_DOWN,
        vaUpColor: VA_UP,
        vaDownColor: VA_DOWN,
        showVah: true,
        vahColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
        vahStyle: 'solid',
        showVal: true,
        valColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
        valStyle: 'solid',
        showPoc: true,
        pocColor: undefined,
        pocStyle: 'solid',
        showDevelopingPoc: false,
        developingPocColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT"],
        developingPocStyle: 'dotted',
        showDevelopingVa: false,
        developingVaColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT"],
        developingVaStyle: 'dotted'
    };
}
function clampIndex(k, n) {
    return k < 0 ? 0 : k >= n ? n - 1 : k;
}
/**
 * Grow the value area from the POC by repeatedly absorbing the larger adjacent row until
 * accumulated volume covers `valueAreaFrac` of the total.
 */ function growValueArea(rows, poc, valueAreaFrac) {
    const n = rows.length;
    let total = 0;
    let maxTotal = 0;
    for(let k = 0; k < n; k += 1){
        const t = rows[k].up + rows[k].down;
        total += t;
        if (t > maxTotal) maxTotal = t;
    }
    const target = total * Math.min(1, Math.max(0, valueAreaFrac));
    let vaFrom = poc;
    let vaTo = poc;
    let acc = maxTotal;
    while(acc < target && (vaFrom > 0 || vaTo < n - 1)){
        const below = vaFrom > 0 ? rows[vaFrom - 1].up + rows[vaFrom - 1].down : -1;
        const above = vaTo < n - 1 ? rows[vaTo + 1].up + rows[vaTo + 1].down : -1;
        if (above > below) {
            vaTo += 1;
            acc += above;
        } else {
            vaFrom -= 1;
            acc += below;
        }
    }
    return {
        vaFrom,
        vaTo
    };
}
/** Add one bar's volume into `rows` using the estimation rule (any OHLC in a row → full volume). */ function accumulateBar(rows, min, rowH, bar) {
    const v = bar.volume;
    if (!(v > 0)) return;
    const n = rows.length;
    const side = bar.close >= bar.open ? 'up' : 'down';
    const hit = new Set();
    for (const p of [
        bar.open,
        bar.high,
        bar.low,
        bar.close
    ]){
        hit.add(clampIndex(Math.floor((p - min) / rowH), n));
    }
    for (const k of hit)rows[k][side] += v;
}
/** POC index + max row total, or null when every row is empty. */ function findPoc(rows) {
    let maxTotal = 0;
    let poc = 0;
    for(let k = 0; k < rows.length; k += 1){
        const t = rows[k].up + rows[k].down;
        if (t > maxTotal) {
            maxTotal = t;
            poc = k;
        }
    }
    return maxTotal > 0 ? {
        poc,
        maxTotal
    } : null;
}
function buildEstimatedProfile(bars, rowCount, valueAreaFrac) {
    let min = Infinity;
    let max = -Infinity;
    for (const b of bars){
        if (!(b.volume > 0)) continue;
        if (b.low < min) min = b.low;
        if (b.high > max) max = b.high;
    }
    if (!Number.isFinite(min)) return null;
    const n = max > min ? Math.max(1, Math.round(rowCount)) : 1;
    const rowH = max > min ? (max - min) / n : 1;
    const rows = Array.from({
        length: n
    }, (_, k)=>({
            price: min + k * rowH,
            up: 0,
            down: 0
        }));
    for (const b of bars)accumulateBar(rows, min, rowH, b);
    const pocInfo = findPoc(rows);
    if (!pocInfo) return null;
    const { poc, maxTotal } = pocInfo;
    const { vaFrom, vaTo } = growValueArea(rows, poc, valueAreaFrac);
    return {
        rows,
        rowH,
        min,
        maxTotal,
        poc,
        vaFrom,
        vaTo
    };
}
function computeFixedRangeProfile(bars, rowCount, valueAreaFrac, wantDeveloping) {
    const profile = buildEstimatedProfile(bars, rowCount, valueAreaFrac);
    if (!profile) return null;
    if (!wantDeveloping || bars.length < 1) {
        return {
            profile,
            developingPoc: [],
            developingVaHigh: [],
            developingVaLow: []
        };
    }
    const { min, rowH } = profile;
    const n = profile.rows.length;
    const rows = Array.from({
        length: n
    }, (_, k)=>({
            price: min + k * rowH,
            up: 0,
            down: 0
        }));
    const developingPoc = [];
    const developingVaHigh = [];
    const developingVaLow = [];
    for (const bar of bars){
        accumulateBar(rows, min, rowH, bar);
        const pocInfo = findPoc(rows);
        if (!pocInfo) continue;
        const { poc } = pocInfo;
        const { vaFrom, vaTo } = growValueArea(rows, poc, valueAreaFrac);
        developingPoc.push({
            time: bar.time,
            price: rows[poc].price + rowH / 2
        });
        developingVaHigh.push({
            time: bar.time,
            price: rows[vaTo].price + rowH
        });
        developingVaLow.push({
            time: bar.time,
            price: rows[vaFrom].price
        });
    }
    return {
        profile,
        developingPoc,
        developingVaHigh,
        developingVaLow
    };
}
class FixedRangeVolumeProfile extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'fixedrangevp';
    /** Cosmetics + behavior (seeded from defaults, persisted via props). */ frvp;
    cachedRange = null;
    constructor(init){
        super(init);
        if (!this.frvp) this.frvp = defaultFrvpStyle();
    }
    anchorSchema() {
        // Two points bound the time range; the profile ignores their price (data-driven),
        // so handles are constrained to horizontal moves — same UX as the regression channel.
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'start',
                    free: 'x'
                },
                {
                    role: 'end',
                    free: 'x'
                }
            ]
        };
    }
    /** Bars in the anchor time-range (inclusive), or null when either anchor / feed is missing. */ barsInSpan(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const from = Math.min(a.time, b.time);
        const to = Math.max(a.time, b.time);
        const raw = proj.barsInRange?.(from, to) ?? null;
        if (!raw || raw.length < 1) return null;
        return raw.map((bar)=>({
                time: bar.time,
                open: bar.open,
                high: bar.high,
                low: bar.low,
                close: bar.close,
                volume: bar.volume ?? 0
            }));
    }
    /** Compute the profile (+ developing series when enabled), caching the price span for autoscale. */ compute(proj) {
        const bars = this.barsInSpan(proj);
        if (!bars) return null;
        const s = this.frvp;
        const wantDev = s.showDevelopingPoc || s.showDevelopingVa;
        const result = computeFixedRangeProfile(bars, s.rows, s.valueAreaPct / 100, wantDev);
        if (result) {
            const { profile } = result;
            this.cachedRange = {
                min: profile.min,
                max: profile.min + profile.rowH * profile.rows.length
            };
        }
        return result;
    }
    /** Resolve the compute to pixel geometry for the painter + hit-test. */ layout(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const computed = this.compute(proj);
        if (!computed) return null;
        const { profile } = computed;
        const t0 = Math.min(a.time, b.time);
        const t1 = Math.max(a.time, b.time);
        const x0 = proj.xOf(t0);
        const x1 = proj.xOf(t1);
        const spanW = Math.abs(x1 - x0);
        const maxW = Math.max(1, Math.min(100, Math.max(0, this.frvp.widthPct)) / 100 * spanW);
        const growRight = this.frvp.anchor === 'left';
        const anchorX = growRight ? Math.min(x0, x1) : Math.max(x0, x1);
        const grow = growRight ? 1 : -1;
        const yEdges = [];
        for(let k = 0; k <= profile.rows.length; k += 1){
            const y = proj.yOf(profile.min + k * profile.rowH, this.paneId);
            if (y == null) return null;
            yEdges.push(y);
        }
        const yAt = (price)=>proj.yOf(price, this.paneId);
        const vahPrice = profile.rows[profile.vaTo].price + profile.rowH;
        const valPrice = profile.rows[profile.vaFrom].price;
        const pocPrice = profile.rows[profile.poc].price + profile.rowH / 2;
        const toPoly = (pts)=>{
            const out = [];
            for (const p of pts){
                const y = yAt(p.price);
                if (y == null) continue;
                out.push([
                    proj.xOf(p.time),
                    y
                ]);
            }
            return out;
        };
        return {
            x0: Math.min(x0, x1),
            x1: Math.max(x0, x1),
            anchorX,
            maxW,
            grow,
            profile,
            yEdges,
            vahY: yAt(vahPrice),
            valY: yAt(valPrice),
            pocY: yAt(pocPrice),
            developingPoc: toPoly(computed.developingPoc),
            developingVaHigh: toPoly(computed.developingVaHigh),
            developingVaLow: toPoly(computed.developingVaLow)
        };
    }
    hitTest(px, py, proj, tol) {
        const L = this.layout(proj);
        if (!L) return false;
        // Hit the histogram's bounding box (anchored strip covering the full price span).
        const left = L.grow === 1 ? L.anchorX : L.anchorX - L.maxW;
        const right = L.grow === 1 ? L.anchorX + L.maxW : L.anchorX;
        const yLo = Math.min(L.yEdges[0], L.yEdges[L.yEdges.length - 1]);
        const yHi = Math.max(L.yEdges[0], L.yEdges[L.yEdges.length - 1]);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInPolygon"])(px, py, [
            [
                left,
                yLo
            ],
            [
                right,
                yLo
            ],
            [
                right,
                yHi
            ],
            [
                left,
                yHi
            ]
        ])) return true;
        // Also hit the horizontal levels and developing polylines.
        const hLines = [
            [
                L.x0,
                L.vahY
            ],
            [
                L.x0,
                L.valY
            ],
            [
                L.x0,
                L.pocY
            ]
        ];
        for (const [, y] of hLines){
            if (y != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, L.x0, y, L.x1, y) <= tol) return true;
        }
        for (const poly of [
            L.developingPoc,
            L.developingVaHigh,
            L.developingVaLow
        ]){
            for(let i = 1; i < poly.length; i += 1){
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, poly[i - 1][0], poly[i - 1][1], poly[i][0], poly[i][1]) <= tol) return true;
            }
        }
        return false;
    }
    handlePoints(proj) {
        const L = this.layout(proj);
        if (L && L.pocY != null) return [
            [
                L.x0,
                L.pocY
            ],
            [
                L.x1,
                L.pocY
            ]
        ];
        const pts = [];
        for (const a of this.anchors){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) return [];
            pts.push([
                proj.xOf(a.time),
                y
            ]);
        }
        return pts;
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const L = this.layout(proj);
        if (!L) return null;
        const left = Math.min(L.x0, L.grow === 1 ? L.anchorX : L.anchorX - L.maxW);
        const right = Math.max(L.x1, L.grow === 1 ? L.anchorX + L.maxW : L.anchorX);
        const yLo = Math.min(L.yEdges[0], L.yEdges[L.yEdges.length - 1]);
        const yHi = Math.max(L.yEdges[0], L.yEdges[L.yEdges.length - 1]);
        return {
            x: left,
            y: yLo,
            w: right - left,
            h: yHi - yLo
        };
    }
    priceRange() {
        if (this.cachedRange) return this.cachedRange;
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        // All FRVP controls live in the gear panel — the schema paths gate that UI branch.
        return {
            fields: [
                {
                    path: 'frvp.rows',
                    label: 'Rows',
                    kind: 'number',
                    min: 1,
                    max: 500,
                    step: 1,
                    group: 'behavior'
                },
                {
                    path: 'frvp.valueAreaPct',
                    label: 'Value Area',
                    kind: 'number',
                    min: 0,
                    max: 100,
                    step: 1,
                    group: 'behavior'
                },
                {
                    path: 'frvp.widthPct',
                    label: 'Width %',
                    kind: 'number',
                    min: 0,
                    max: 100,
                    step: 1,
                    group: 'behavior'
                },
                {
                    path: 'frvp.anchor',
                    label: 'Anchor',
                    kind: 'select',
                    options: [
                        {
                            value: 'right',
                            label: 'Right'
                        },
                        {
                            value: 'left',
                            label: 'Left'
                        }
                    ],
                    group: 'behavior'
                },
                {
                    path: 'frvp.upColor',
                    label: 'Up Volume',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'frvp.downColor',
                    label: 'Down Volume',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'frvp.vaUpColor',
                    label: 'Value Area Up',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'frvp.vaDownColor',
                    label: 'Value Area Down',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'frvp.showVah',
                    label: 'VAH',
                    kind: 'boolean',
                    group: 'line'
                },
                {
                    path: 'frvp.vahColor',
                    label: 'VAH color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'frvp.vahStyle',
                    label: 'VAH style',
                    kind: 'lineStyle',
                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_STYLE_OPTIONS"],
                    group: 'line'
                },
                {
                    path: 'frvp.showVal',
                    label: 'VAL',
                    kind: 'boolean',
                    group: 'line'
                },
                {
                    path: 'frvp.valColor',
                    label: 'VAL color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'frvp.valStyle',
                    label: 'VAL style',
                    kind: 'lineStyle',
                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_STYLE_OPTIONS"],
                    group: 'line'
                },
                {
                    path: 'frvp.showPoc',
                    label: 'POC',
                    kind: 'boolean',
                    group: 'line'
                },
                {
                    path: 'frvp.pocColor',
                    label: 'POC color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'frvp.pocStyle',
                    label: 'POC style',
                    kind: 'lineStyle',
                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_STYLE_OPTIONS"],
                    group: 'line'
                },
                {
                    path: 'frvp.showDevelopingPoc',
                    label: 'Developing POC',
                    kind: 'boolean',
                    group: 'line'
                },
                {
                    path: 'frvp.developingPocColor',
                    label: 'Developing POC color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'frvp.developingPocStyle',
                    label: 'Developing POC style',
                    kind: 'lineStyle',
                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_STYLE_OPTIONS"],
                    group: 'line'
                },
                {
                    path: 'frvp.showDevelopingVa',
                    label: 'Developing VA',
                    kind: 'boolean',
                    group: 'line'
                },
                {
                    path: 'frvp.developingVaColor',
                    label: 'Developing VA color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'frvp.developingVaStyle',
                    label: 'Developing VA style',
                    kind: 'lineStyle',
                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_STYLE_OPTIONS"],
                    group: 'line'
                }
            ]
        };
    }
    writeProps() {
        return {
            ...this.frvp
        };
    }
    readProps(props) {
        this.frvp = {
            ...defaultFrvpStyle(),
            ...props
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/FlatTopBottom.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlatTopBottom",
    ()=>FlatTopBottom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
class FlatTopBottom extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'flattopbottom';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                },
                {
                    role: 'flat',
                    free: 'y'
                }
            ]
        };
    }
    /** Handles: the two baseline ends + the flat-side handle at the baseline midpoint. */ handlePoints(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return [];
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return [];
        const pts = [
            [
                proj.xOf(a.time),
                ya
            ],
            [
                proj.xOf(b.time),
                yb
            ]
        ];
        const c = this.anchors[2];
        if (c) {
            const yc = proj.yOf(c.price, this.paneId);
            if (yc != null) pts.push([
                proj.xOf((a.time + b.time) / 2),
                yc
            ]);
        }
        return pts;
    }
    /** The channel spans the baseline's time only (the flat anchor's time is ignored). */ timeExtent() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.time, b.time),
            max: Math.max(a.time, b.time)
        };
    }
    geometry(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const xa = proj.xOf(a.time);
        const xb = proj.xOf(b.time);
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return null;
        const c = this.anchors[2];
        if (!c) return {
            segments: [
                [
                    xa,
                    ya,
                    xb,
                    yb
                ]
            ],
            fill: null
        }; // baseline only (placing)
        const flatY = proj.yOf(c.price, this.paneId);
        if (flatY == null) return null;
        return {
            segments: [
                [
                    xa,
                    ya,
                    xb,
                    yb
                ],
                [
                    xa,
                    flatY,
                    xb,
                    flatY
                ]
            ],
            fill: [
                [
                    xa,
                    ya
                ],
                [
                    xb,
                    yb
                ],
                [
                    xb,
                    flatY
                ],
                [
                    xa,
                    flatY
                ]
            ]
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const prices = [
            a.price,
            b.price
        ];
        const c = this.anchors[2];
        if (c) prices.push(c.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Freehand.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrushStroke",
    ()=>BrushStroke,
    "Freehand",
    ()=>Freehand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PathDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PathDrawing.ts [app-client] (ecmascript)");
;
class BrushStroke extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PathDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PathDrawing"] {
    placementMode() {
        return 'freehand';
    }
    handlePoints(_proj) {
        return []; // a captured stroke is moved as a whole, not edited per-point
    }
    bounds(proj) {
        const xs = [];
        const ys = [];
        for (const a of this.anchors){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) continue;
            xs.push(proj.xOf(a.time));
            ys.push(y);
        }
        if (xs.length === 0) return null;
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
}
class Freehand extends BrushStroke {
    type = 'freehand';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/GannBox.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GannBox",
    ()=>GannBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
;
/** The Gann-box subdivisions, applied to BOTH the price (horizontal) and time (vertical) axes. */ const GANN_BOX_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])(_c1 = [
    0,
    0.25,
    0.382,
    0.5,
    0.618,
    0.75,
    1
].map(_c = (ratio)=>({
        ratio,
        label: String(ratio)
    })));
_c2 = GANN_BOX_LEVELS;
class GannBox extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'gannbox';
    defaultLevels() {
        return GANN_BOX_LEVELS;
    }
    // Placed click-move-click (the inherited 'click' mode): first click sets a corner, the second
    // sets the opposite one — matching the plain Rectangle tool.
    corners(proj) {
        const c1 = this.anchors[0];
        const c2 = this.anchors[1];
        if (!c1 || !c2) return null;
        const xa = proj.xOf(c1.time);
        const xb = proj.xOf(c2.time);
        const ya = proj.yOf(c1.price, this.paneId);
        const yb = proj.yOf(c2.price, this.paneId);
        if (ya == null || yb == null) return null;
        return {
            c1,
            c2,
            left: Math.min(xa, xb),
            right: Math.max(xa, xb),
            top: Math.min(ya, yb),
            bot: Math.max(ya, yb)
        };
    }
    entryLines(proj) {
        const g = this.corners(proj);
        if (!g) return null;
        const { c1, c2, left, right, top, bot } = g;
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            // horizontal (price) gridline — labelled at the left edge
            const py = proj.yOf(c1.price + lv.ratio * (c2.price - c1.price), this.paneId);
            if (py != null) {
                out.push({
                    color: lv.color,
                    x1: left,
                    y1: py,
                    x2: right,
                    y2: py,
                    numberText: lv.label ?? String(lv.ratio),
                    numberX: left - 5,
                    numberY: py,
                    numberAlign: 'right',
                    labelX: left,
                    labelY: py
                });
            }
            // vertical (time) gridline — unlabelled to avoid clutter
            const vx = proj.xOf(c1.time + lv.ratio * (c2.time - c1.time));
            out.push({
                color: lv.color,
                x1: vx,
                y1: top,
                x2: vx,
                y2: bot,
                numberText: '',
                numberX: vx,
                numberY: top,
                numberAlign: 'center',
                labelX: vx,
                labelY: top
            });
        }
        // the two diagonals (in the 1.0 level's color)
        const diag = this.levels.find((l)=>l.ratio === 1)?.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_ANCHOR"];
        out.push({
            color: diag,
            x1: left,
            y1: top,
            x2: right,
            y2: bot,
            numberText: '',
            numberX: 0,
            numberY: 0,
            numberAlign: 'left',
            labelX: 0,
            labelY: 0
        });
        out.push({
            color: diag,
            x1: left,
            y1: bot,
            x2: right,
            y2: top,
            numberText: '',
            numberX: 0,
            numberY: 0,
            numberAlign: 'left',
            labelX: 0,
            labelY: 0
        });
        return out;
    }
    hitTest(px, py, proj, tol) {
        const g = this.corners(proj);
        return g != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, g.left, g.top, g.right, g.bot, tol); // grabbable anywhere inside
    }
    priceRange() {
        const c1 = this.anchors[0];
        const c2 = this.anchors[1];
        if (!c1 || !c2) return null;
        return {
            min: Math.min(c1.price, c2.price),
            max: Math.max(c1.price, c2.price)
        };
    }
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "GANN_BOX_LEVELS$fibLevels$[0, 0.25, 0.382, 0.5, 0.618, 0.75, 1].map");
__turbopack_context__.k.register(_c1, "GANN_BOX_LEVELS$fibLevels");
__turbopack_context__.k.register(_c2, "GANN_BOX_LEVELS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/GannFan.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GannFan",
    ()=>GannFan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
;
/**
 * The Gann angles: price-per-time ratios relative to the 1×1 (the line through the second
 * anchor). A ratio > 1 is steeper (more price per unit time), < 1 shallower.
 */ const GANN_FAN_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    {
        ratio: 0.125,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_RED"],
        label: '1/8'
    },
    {
        ratio: 0.25,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_ORANGE"],
        label: '1/4'
    },
    {
        ratio: 0.333,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_AMBER"],
        label: '1/3'
    },
    {
        ratio: 0.5,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_GREEN"],
        label: '1/2'
    },
    {
        ratio: 1,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_UNITY"],
        label: '1/1'
    },
    {
        ratio: 2,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_TEAL"],
        label: '2/1'
    },
    {
        ratio: 3,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_BLUE"],
        label: '3/1'
    },
    {
        ratio: 4,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_AQUA"],
        label: '4/1'
    },
    {
        ratio: 8,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_PURPLE"],
        label: '8/1'
    }
]);
class GannFan extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'gannfan';
    defaultLevels() {
        return GANN_FAN_LEVELS;
    }
    entryLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const x0 = proj.xOf(a.time);
        const y0 = proj.yOf(a.price, this.paneId);
        if (y0 == null) return null;
        const xb = proj.xOf(b.time);
        const dp = b.price - a.price; // the 1×1 rise; ratio r scales it to dp·r
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            const ty = proj.yOf(a.price + dp * lv.ratio, this.paneId);
            if (ty == null) continue;
            const [x1, y1, x2, y2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(x0, y0, xb, ty, 'right', proj.width, proj.height);
            out.push({
                color: lv.color,
                x1,
                y1,
                x2,
                y2,
                numberText: lv.label ?? String(lv.ratio),
                numberX: xb + 5,
                numberY: ty,
                numberAlign: 'left',
                labelX: xb + 5,
                labelY: ty
            });
        }
        return out;
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/GannSquare.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GANN_SQUARE_ARCS",
    ()=>GANN_SQUARE_ARCS,
    "GannSquare",
    ()=>GannSquare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
;
/** The H/V grid subdivisions (editable, like GannBox), applied to both the price + time axes. */ const GRID_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])(_c1 = [
    0,
    0.25,
    0.382,
    0.5,
    0.618,
    0.75,
    1
].map(_c = (ratio)=>({
        ratio,
        label: String(ratio)
    })));
_c2 = GRID_LEVELS;
/** The Gann angle fan, all from the origin corner p1. `x` = time units, `y` = price units. */ const FAN = [
    {
        label: '3x1',
        x: 3,
        y: 1,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_RED"]
    },
    {
        label: '2x1',
        x: 2,
        y: 1,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_ORANGE"]
    },
    {
        label: '1x1',
        x: 1,
        y: 1,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_UNITY"]
    },
    {
        label: '1x2',
        x: 1,
        y: 2,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_TEAL"]
    },
    {
        label: '1x3',
        x: 1,
        y: 3,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_BLUE"]
    }
];
const GANN_SQUARE_ARCS = [
    {
        k: 0.25,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_RED"]
    },
    {
        k: 0.5,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_ORANGE"]
    },
    {
        k: 0.75,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_GREEN"]
    },
    {
        k: 1,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_TEAL"]
    }
];
class GannSquare extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'gannsquare';
    defaultLevels() {
        return GRID_LEVELS;
    }
    // Placed click-move-click (the inherited 'click' mode): first click sets a corner, the second
    // sets the opposite one — matching the plain Rectangle tool.
    box(proj) {
        const c1 = this.anchors[0];
        const c2 = this.anchors[1];
        if (!c1 || !c2) return null;
        const oy = proj.yOf(c1.price, this.paneId);
        const ey = proj.yOf(c2.price, this.paneId);
        if (oy == null || ey == null) return null;
        const ox = proj.xOf(c1.time);
        const ex = proj.xOf(c2.time);
        return {
            ox,
            oy,
            bx: ex - ox,
            py: ey - oy,
            left: Math.min(ox, ex),
            top: Math.min(oy, ey),
            right: Math.max(ox, ex),
            bot: Math.max(oy, ey)
        };
    }
    /** The origin corner + box pixel deltas, consumed by the arc painter. */ arcGeom(proj) {
        const b = this.box(proj);
        return b ? {
            ox: b.ox,
            oy: b.oy,
            bx: b.bx,
            py: b.py
        } : null;
    }
    entryLines(proj) {
        const b = this.box(proj);
        if (!b) return null;
        const c1 = this.anchors[0];
        const c2 = this.anchors[1];
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            const hy = proj.yOf(c1.price + lv.ratio * (c2.price - c1.price), this.paneId); // horizontal (price) line
            if (hy != null) {
                out.push({
                    color: lv.color,
                    x1: b.left,
                    y1: hy,
                    x2: b.right,
                    y2: hy,
                    numberText: lv.label ?? String(lv.ratio),
                    numberX: b.left - 5,
                    numberY: hy,
                    numberAlign: 'right',
                    labelX: b.left,
                    labelY: hy
                });
            }
            const vx = proj.xOf(c1.time + lv.ratio * (c2.time - c1.time)); // vertical (time) line — unlabelled
            out.push({
                color: lv.color,
                x1: vx,
                y1: b.top,
                x2: vx,
                y2: b.bot,
                numberText: '',
                numberX: vx,
                numberY: b.top,
                numberAlign: 'center',
                labelX: vx,
                labelY: b.top
            });
        }
        for (const f of FAN){
            let u;
            let v;
            if (f.x > f.y) {
                u = b.ox + b.bx; // shallow → reaches the far vertical edge at fraction y/x of the height
                v = b.oy + f.y / f.x * b.py;
            } else {
                v = b.oy + b.py; // steep → reaches the far horizontal edge at fraction x/y of the width
                u = b.ox + f.x / f.y * b.bx;
            }
            out.push({
                color: f.color,
                x1: b.ox,
                y1: b.oy,
                x2: u,
                y2: v,
                numberText: f.label,
                numberX: u + 4,
                numberY: v,
                numberAlign: 'left',
                labelX: u + 4,
                labelY: v
            });
        }
        return out;
    }
    hitTest(px, py, proj, tol) {
        const b = this.box(proj);
        return b != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, b.left, b.top, b.right, b.bot, tol); // grabbable anywhere inside
    }
    priceRange() {
        const c1 = this.anchors[0];
        const c2 = this.anchors[1];
        if (!c1 || !c2) return null;
        return {
            min: Math.min(c1.price, c2.price),
            max: Math.max(c1.price, c2.price)
        };
    }
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "GRID_LEVELS$fibLevels$[0, 0.25, 0.382, 0.5, 0.618, 0.75, 1].map");
__turbopack_context__.k.register(_c1, "GRID_LEVELS$fibLevels");
__turbopack_context__.k.register(_c2, "GRID_LEVELS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Gartley.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Gartley",
    ()=>Gartley
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)");
;
class Gartley extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HarmonicPattern"] {
    type = 'gartley';
    patternName() {
        return 'Gartley';
    }
    ranges() {
        return {
            ab: {
                min: 0.55,
                max: 0.68
            },
            bc: {
                min: 0.382,
                max: 0.886
            },
            cd: {
                min: 1.13,
                max: 1.618
            },
            ad: {
                min: 0.74,
                max: 0.83
            }
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/GlyphStamp.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlagMark",
    ()=>FlagMark,
    "GLYPH_OPTIONS",
    ()=>GLYPH_OPTIONS,
    "GlyphStamp",
    ()=>GlyphStamp,
    "IconStamp",
    ()=>IconStamp,
    "STAMP_SIZE_OPTIONS",
    ()=>STAMP_SIZE_OPTIONS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
const GLYPH_OPTIONS = [
    '★',
    '☆',
    '●',
    '◆',
    '▲',
    '▼',
    '➤',
    '⚑',
    '✚',
    '✕',
    '❤',
    '♦'
];
const STAMP_SIZE_OPTIONS = [
    'small',
    'normal',
    'large',
    'huge'
];
const STAMP_PX = {
    small: 16,
    normal: 22,
    large: 32,
    huge: 44
};
class GlyphStamp extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    // no initializers — a field initializer runs after super() and would clobber readProps()
    glyph;
    size;
    constructor(init){
        super(init);
        if (!this.glyph) this.glyph = this.defaultGlyph();
        if (!this.size) this.size = 'normal';
    }
    /** The on-screen glyph size in px for the current named size. */ sizePx() {
        return STAMP_PX[this.size] ?? STAMP_PX.normal;
    }
    anchorSchema() {
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'p',
                    free: 'both'
                }
            ]
        };
    }
    /** The anchor pixel (the glyph box is sizePx() square, centered here). */ center(proj) {
        const a = this.anchors[0];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? null : [
            proj.xOf(a.time),
            y
        ];
    }
    hitTest(px, py, proj, tol) {
        const c = this.center(proj);
        if (!c) return false;
        const r = this.sizePx() / 2 + tol;
        return Math.abs(px - c[0]) <= r && Math.abs(py - c[1]) <= r;
    }
    handlePoints(proj) {
        const c = this.center(proj);
        return c ? [
            c
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const c = this.center(proj);
        if (!c) return null;
        const s = this.sizePx();
        return {
            x: c[0] - s / 2,
            y: c[1] - s / 2,
            w: s,
            h: s
        };
    }
    priceRange() {
        const a = this.anchors[0];
        return a ? {
            min: a.price,
            max: a.price
        } : null;
    }
    schema() {
        return {
            fields: [
                {
                    path: 'glyph',
                    label: 'Icon',
                    kind: 'select',
                    options: GLYPH_OPTIONS.map((g)=>({
                            value: g,
                            label: g
                        })),
                    group: 'line'
                },
                {
                    path: 'size',
                    label: 'Size',
                    kind: 'select',
                    options: STAMP_SIZE_OPTIONS.map((s)=>({
                            value: s,
                            label: s
                        })),
                    group: 'line'
                },
                {
                    path: 'style.lineColor',
                    label: 'Color',
                    kind: 'color',
                    group: 'line'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
    writeProps() {
        return {
            glyph: this.glyph,
            size: this.size
        };
    }
    readProps(props) {
        if (typeof props.glyph === 'string') this.glyph = props.glyph;
        if (typeof props.size === 'string') this.size = props.size;
    }
}
class FlagMark extends GlyphStamp {
    type = 'flagmark';
    defaultGlyph() {
        return '⚑';
    }
}
class IconStamp extends GlyphStamp {
    type = 'iconstamp';
    defaultGlyph() {
        return '★';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/GoldenMach.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GOLDEN_MACH_LEVELS",
    ()=>GOLDEN_MACH_LEVELS,
    "GoldenSonic",
    ()=>GoldenSonic,
    "GoldenSupersonic",
    ()=>GoldenSupersonic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/MachFigure.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
;
const GOLDEN_MACH_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0.236,
    0.382,
    0.5,
    0.618,
    0.786,
    1,
    1.618,
    2.618,
    4.236,
    6.854,
    11.09
]);
const DEFAULT_MACH = 2;
class GoldenSonic extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MachFigure"] {
    type = 'goldensonic';
    shouldSyncWaveCount() {
        return false;
    }
    defaultLevels() {
        return GOLDEN_MACH_LEVELS;
    }
    machNumber() {
        return 1;
    }
    schema() {
        // No wave-count dropdown — density is the enabled fib levels in the gear panel.
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHOW_RATIOS_FIELD"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
class GoldenSupersonic extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MachFigure"] {
    type = 'goldensupersonic';
    mach;
    shouldSyncWaveCount() {
        return false;
    }
    constructor(init){
        super(init);
        if (this.mach === undefined) this.mach = DEFAULT_MACH;
    }
    defaultLevels() {
        return GOLDEN_MACH_LEVELS;
    }
    machNumber() {
        return Math.max(1.01, this.mach);
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                {
                    path: 'mach',
                    label: 'Mach number',
                    kind: 'number',
                    min: 1.5,
                    max: 5,
                    step: 0.5,
                    group: 'behavior'
                },
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$MachFigure$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHOW_RATIOS_FIELD"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
    writeProps() {
        return {
            ...super.writeProps(),
            mach: this.mach
        };
    }
    readProps(props) {
        super.readProps(props);
        if (typeof props.mach === 'number' && Number.isFinite(props.mach)) {
            this.mach = Math.max(1.01, Math.min(20, props.mach));
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HarmonicPattern",
    ()=>HarmonicPattern
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
;
class HarmonicPattern extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternDrawing"] {
    vertexLabels() {
        return [
            'X',
            'A',
            'B',
            'C',
            'D'
        ];
    }
    legRatios() {
        return true;
    }
    fillTriangles() {
        return [
            [
                0,
                1,
                2
            ],
            [
                2,
                3,
                4
            ]
        ];
    }
    /** A named leg ratio in price space (absolute), or null if a leg is degenerate. */ legValue(name) {
        const [x, a, b, c, d] = this.anchors;
        if (!x || !a || !b || !c || !d) return null;
        const leg = (p, q)=>Math.abs(q.price - p.price);
        const xa = leg(x, a);
        const ab = leg(a, b);
        const bc = leg(b, c);
        switch(name){
            case 'ab':
                return xa < 1e-9 ? null : ab / xa;
            case 'bc':
                return ab < 1e-9 ? null : bc / ab;
            case 'cd':
                return bc < 1e-9 ? null : leg(c, d) / bc;
            default:
                return xa < 1e-9 ? null : leg(a, d) / xa; // ad
        }
    }
    inBand(v, b) {
        return v != null && v >= b.min && v <= b.max;
    }
    ratioOk(i) {
        const r = this.ranges();
        if (i === 2) return this.inBand(this.legValue('ab'), r.ab);
        if (i === 3) return this.inBand(this.legValue('bc'), r.bc);
        if (i === 4) return this.inBand(this.legValue('cd'), r.cd);
        return null;
    }
    valid() {
        if (this.anchors.length < 5) return null;
        const r = this.ranges();
        return this.inBand(this.legValue('ab'), r.ab) && this.inBand(this.legValue('bc'), r.bc) && this.inBand(this.legValue('cd'), r.cd) && this.inBand(this.legValue('ad'), r.ad);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/HeadShoulders.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeadShoulders",
    ()=>HeadShoulders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
;
class HeadShoulders extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternDrawing"] {
    type = 'headshoulders';
    vertexLabels() {
        return [
            '',
            'LS',
            '',
            'H',
            '',
            'RS',
            ''
        ];
    }
    necklineIndices() {
        return [
            2,
            4
        ]; // the two troughs flanking the head
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Highlighter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Highlighter",
    ()=>Highlighter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Freehand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/Freehand.ts [app-client] (ecmascript)");
;
/**
 * The highlighter's editable cosmetics — a translucent marker, so it exposes only
 * color (its alpha is the highlight's opacity, set via the color picker) and a wide
 * stroke width. No dash/text: a marker is always a solid, wide, see-through swath.
 */ const HIGHLIGHTER_FIELDS = [
    {
        path: 'style.lineColor',
        label: 'Color',
        kind: 'color',
        group: 'line'
    },
    {
        path: 'style.lineWidth',
        label: 'Width',
        kind: 'number',
        min: 4,
        max: 60,
        step: 1,
        group: 'line'
    }
];
class Highlighter extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$Freehand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BrushStroke"] {
    type = 'highlighter';
    schema() {
        return {
            fields: HIGHLIGHTER_FIELDS
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/HorizontalLine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HorizontalLine",
    ()=>HorizontalLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class HorizontalLine extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'hline';
    anchorSchema() {
        // One anchor; only its price (y) matters — its time pins the drag handle.
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'p',
                    free: 'y'
                }
            ]
        };
    }
    y(proj) {
        const a = this.anchors[0];
        return a ? proj.yOf(a.price, this.paneId) : null;
    }
    hitTest(_px, py, proj, tol) {
        const y = this.y(proj);
        return y != null && Math.abs(py - y) <= tol; // ignores x → spans full width
    }
    handlePoints(proj) {
        const a = this.anchors[0];
        const y = this.y(proj);
        if (!a || y == null) return [];
        return [
            [
                proj.xOf(a.time),
                y
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const y = this.y(proj);
        return y == null ? null : {
            x: 0,
            y: y - 1,
            w: proj.width,
            h: 2
        };
    }
    priceRange() {
        const a = this.anchors[0];
        return a ? {
            min: a.price,
            max: a.price
        } : null;
    }
    // A horizontal line spans the full width → never cull by time.
    timeExtent() {
        return null;
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/HorizontalRay.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HorizontalRay",
    ()=>HorizontalRay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class HorizontalRay extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'hray';
    anchorSchema() {
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'p',
                    free: 'both'
                }
            ]
        };
    }
    pt(proj) {
        const a = this.anchors[0];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? null : [
            proj.xOf(a.time),
            y
        ];
    }
    hitTest(px, py, proj, tol) {
        const p = this.pt(proj);
        return p != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, p[0], p[1], proj.width, p[1]) <= tol;
    }
    handlePoints(proj) {
        const p = this.pt(proj);
        return p ? [
            p
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const p = this.pt(proj);
        return p ? {
            x: p[0],
            y: p[1] - 1,
            w: Math.max(0, proj.width - p[0]),
            h: 2
        } : null;
    }
    priceRange() {
        const a = this.anchors[0];
        return a ? {
            min: a.price,
            max: a.price
        } : null;
    }
    // Extends right to the edge → visible whenever its anchor sits at/left of the viewport.
    timeExtent() {
        const a = this.anchors[0];
        return a ? {
            min: a.time,
            max: Number.POSITIVE_INFINITY
        } : null;
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/InfoLine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InfoLine",
    ()=>InfoLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TwoPointLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TwoPointLine.ts [app-client] (ecmascript)");
;
class InfoLine extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TwoPointLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TwoPointLine"] {
    type = 'infoline';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/InsidePitchfork.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InsidePitchfork",
    ()=>InsidePitchfork
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
;
class InsidePitchfork extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'insidepitchfork';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'pivot',
                    free: 'both'
                },
                {
                    role: 'upper',
                    free: 'both'
                },
                {
                    role: 'lower',
                    free: 'both'
                }
            ]
        };
    }
    geometry(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const px = (p)=>{
            const y = proj.yOf(p.price, this.paneId);
            return y == null ? null : [
                proj.xOf(p.time),
                y
            ];
        };
        const P0 = px(a);
        const P1 = px(b);
        if (!P0 || !P1) return null;
        const c = this.anchors[2];
        if (!c) return {
            segments: [
                [
                    P0[0],
                    P0[1],
                    P1[0],
                    P1[1]
                ]
            ],
            fill: null
        }; // back trend line only (placing)
        const B = px({
            time: (a.time + b.time) / 2,
            price: (a.price + b.price) / 2
        }); // modified base
        const P2 = px(c);
        if (!B || !P2) return null;
        const mx = (P1[0] + P2[0]) / 2;
        const my = (P1[1] + P2[1]) / 2; // median target M
        const dx = P2[0] - B[0];
        const dy = P2[1] - B[1]; // median slope d = P2 − B
        const w = proj.width;
        const h = proj.height;
        return {
            segments: [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(mx, my, mx + dx, my + dy, 'right', w, h),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(P1[0], P1[1], P1[0] + dx, P1[1] + dy, 'right', w, h),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(P2[0], P2[1], P2[0] + dx, P2[1] + dy, 'right', w, h),
                [
                    P1[0],
                    P1[1],
                    P2[0],
                    P2[1]
                ],
                [
                    B[0],
                    B[1],
                    P2[0],
                    P2[1]
                ],
                [
                    P0[0],
                    P0[1],
                    P1[0],
                    P1[1]
                ]
            ],
            fill: null
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((p)=>p.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/MachFigure.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MACH_NUMBER_OPTIONS",
    ()=>MACH_NUMBER_OPTIONS,
    "MACH_WAVE_COUNT_OPTIONS",
    ()=>MACH_WAVE_COUNT_OPTIONS,
    "MachFigure",
    ()=>MachFigure,
    "SHOW_RATIOS_FIELD",
    ()=>SHOW_RATIOS_FIELD,
    "Sonic",
    ()=>Sonic,
    "Supersonic",
    ()=>Supersonic,
    "linearMachLevels",
    ()=>linearMachLevels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
;
;
const MACH_WAVE_COUNT_OPTIONS = [
    3,
    4,
    5,
    6,
    8,
    10,
    12
];
const MACH_NUMBER_OPTIONS = [
    1.5,
    2,
    2.5,
    3,
    4,
    5
];
const DEFAULT_WAVES = 6;
const DEFAULT_MACH = 2;
function linearMachLevels(enabledCount = DEFAULT_WAVES) {
    return [
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cycleLevels"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEVEL_CYCLE"].length, enabledCount)
    ];
}
function sanitizeLevel(v) {
    if (!v || typeof v !== 'object') return null;
    const o = v;
    if (typeof o.ratio !== 'number' || typeof o.color !== 'string') return null;
    return {
        ratio: o.ratio,
        color: o.color,
        enabled: o.enabled !== false,
        ...typeof o.label === 'string' && o.label ? {
            label: o.label
        } : {}
    };
}
const SHOW_RATIOS_FIELD = {
    path: 'showRatios',
    label: 'Show ratios',
    kind: 'boolean',
    group: 'behavior'
};
class MachFigure extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    /** Number of wavefront circles (linear tools); synced to `levels[].enabled`. */ waveCount;
    /** Per-circle config (ratio / color / enabled) — drives the settings gear. */ levels;
    /** When true, paint each circle's ratio beside it. */ showRatios;
    constructor(init){
        super(init);
        if (this.waveCount === undefined) this.waveCount = DEFAULT_WAVES;
        if (this.showRatios === undefined) this.showRatios = true;
        const levelsFromProps = Array.isArray(init.props?.levels);
        if (!this.levels) this.levels = this.defaultLevels().map((l)=>({
                ...l
            }));
        // Linear tools: Waves dropdown owns how many circles are enabled (unless props already set levels).
        if (!levelsFromProps && this.shouldSyncWaveCount()) this.syncLevelsToWaveCount();
    }
    /** Linear Sonic/Supersonic sync `waveCount` → enabled levels; Golden tools return false. */ shouldSyncWaveCount() {
        return true;
    }
    syncLevelsToWaveCount() {
        const n = Math.max(1, Math.min(this.levels.length, Math.round(this.waveCount)));
        this.waveCount = n;
        for(let i = 0; i < this.levels.length; i += 1)this.levels[i].enabled = i < n;
    }
    editableLevels() {
        return this.levels;
    }
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'd1',
                    free: 'both'
                },
                {
                    role: 'd2',
                    free: 'both'
                }
            ]
        };
    }
    /** Pixel geometry for the current anchors, or null until both ends resolve. */ geom(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const ay = proj.yOf(a.price, this.paneId);
        const by = proj.yOf(b.price, this.paneId);
        if (ay == null || by == null) return null;
        const ax = proj.xOf(a.time);
        const bx = proj.xOf(b.time);
        const c0x = (ax + bx) / 2;
        const c0y = (ay + by) / 2;
        const R = Math.hypot(bx - ax, by - ay) / 2;
        if (R < 1) return null;
        // Expansion follows the diameter stroke (first click → second click): circles grow toward d2.
        let fx = bx - ax;
        let fy = by - ay;
        const flen = Math.hypot(fx, fy);
        if (flen < 1e-9) {
            fx = 1;
            fy = 0;
        } else {
            fx /= flen;
            fy /= flen;
        }
        const active = this.levels.filter((l)=>l.enabled && l.ratio > 0).slice().sort((p, q)=>p.ratio - q.ratio);
        if (active.length === 0) return null;
        const M = Math.max(1, this.machNumber());
        const circles = [];
        for (const lv of active){
            const r = lv.ratio * R;
            circles.push({
                cx: c0x + M * (r - R) * fx,
                cy: c0y + M * (r - R) * fy,
                r,
                color: lv.color,
                ratio: lv.ratio
            });
        }
        // Nose / shock origin sits on the d1 side of the first circle (ratio 1 → r = R).
        const noseX = c0x - M * R * fx;
        const noseY = c0y - M * R * fy;
        const maxR = circles[circles.length - 1].r;
        const rayLen = M * maxR + 2 * R;
        const rays = [];
        if (M <= 1 + 1e-9) {
            const px = -fy;
            const py = fx;
            rays.push([
                noseX - px * rayLen,
                noseY - py * rayLen,
                noseX + px * rayLen,
                noseY + py * rayLen
            ]);
        } else {
            const mu = Math.asin(1 / M);
            const cos = Math.cos(mu);
            const sin = Math.sin(mu);
            const rot = (dx, dy, s)=>[
                    dx * cos - dy * s * sin,
                    dx * s * sin + dy * cos
                ];
            const [d1x, d1y] = rot(fx, fy, 1);
            const [d2x, d2y] = rot(fx, fy, -1);
            rays.push([
                noseX,
                noseY,
                noseX + d1x * rayLen,
                noseY + d1y * rayLen
            ]);
            rays.push([
                noseX,
                noseY,
                noseX + d2x * rayLen,
                noseY + d2y * rayLen
            ]);
        }
        return {
            c0x,
            c0y,
            R,
            fx,
            fy,
            noseX,
            noseY,
            circles,
            rays
        };
    }
    hitTest(px, py, proj, tol) {
        const g = this.geom(proj);
        if (!g) return false;
        for (const c of g.circles){
            if (Math.abs(Math.hypot(px - c.cx, py - c.cy) - c.r) <= tol) return true;
        }
        return g.rays.some((r)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, r[0], r[1], r[2], r[3]) <= tol);
    }
    handlePoints(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return [];
        const ay = proj.yOf(a.price, this.paneId);
        const by = proj.yOf(b.price, this.paneId);
        if (ay == null || by == null) return [];
        return [
            [
                proj.xOf(a.time),
                ay
            ],
            [
                proj.xOf(b.time),
                by
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const g = this.geom(proj);
        if (!g) return null;
        let loX = g.noseX;
        let hiX = g.noseX;
        let loY = g.noseY;
        let hiY = g.noseY;
        for (const c of g.circles){
            loX = Math.min(loX, c.cx - c.r);
            hiX = Math.max(hiX, c.cx + c.r);
            loY = Math.min(loY, c.cy - c.r);
            hiY = Math.max(hiY, c.cy + c.r);
        }
        for (const r of g.rays){
            loX = Math.min(loX, r[0], r[2]);
            hiX = Math.max(hiX, r[0], r[2]);
            loY = Math.min(loY, r[1], r[3]);
            hiY = Math.max(hiY, r[1], r[3]);
        }
        return {
            x: loX,
            y: loY,
            w: hiX - loX,
            h: hiY - loY
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    /** Sync the Waves dropdown onto `levels[].enabled` (first N on). */ applySettings(patch) {
        super.applySettings(patch);
        if (Object.prototype.hasOwnProperty.call(patch, 'waveCount') && typeof this.waveCount === 'number') {
            const n = Math.max(1, Math.min(this.levels.length, Math.round(this.waveCount)));
            this.waveCount = n;
            for(let i = 0; i < this.levels.length; i += 1)this.levels[i].enabled = i < n;
        }
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                {
                    path: 'waveCount',
                    label: 'Waves',
                    kind: 'number',
                    min: 3,
                    max: 12,
                    step: 1,
                    group: 'behavior'
                },
                SHOW_RATIOS_FIELD,
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
    writeProps() {
        return {
            waveCount: this.waveCount,
            showRatios: this.showRatios,
            levels: this.levels.map((l)=>({
                    ...l
                }))
        };
    }
    readProps(props) {
        if (typeof props.waveCount === 'number' && Number.isFinite(props.waveCount)) {
            this.waveCount = Math.max(2, Math.min(12, Math.round(props.waveCount)));
        }
        if (typeof props.showRatios === 'boolean') this.showRatios = props.showRatios;
        if (Array.isArray(props.levels)) {
            const parsed = props.levels.map(sanitizeLevel).filter((l)=>l != null);
            if (parsed.length) this.levels = parsed;
        }
    }
}
class Sonic extends MachFigure {
    type = 'sonic';
    defaultLevels() {
        return linearMachLevels(DEFAULT_WAVES);
    }
    machNumber() {
        return 1;
    }
}
class Supersonic extends MachFigure {
    type = 'supersonic';
    mach;
    constructor(init){
        super(init);
        if (this.mach === undefined) this.mach = DEFAULT_MACH;
    }
    defaultLevels() {
        return linearMachLevels(DEFAULT_WAVES);
    }
    machNumber() {
        return Math.max(1.01, this.mach);
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                {
                    path: 'mach',
                    label: 'Mach number',
                    kind: 'number',
                    min: 1.5,
                    max: 5,
                    step: 0.5,
                    group: 'behavior'
                },
                {
                    path: 'waveCount',
                    label: 'Waves',
                    kind: 'number',
                    min: 3,
                    max: 12,
                    step: 1,
                    group: 'behavior'
                },
                SHOW_RATIOS_FIELD,
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
    writeProps() {
        return {
            ...super.writeProps(),
            mach: this.mach
        };
    }
    readProps(props) {
        super.readProps(props);
        if (typeof props.mach === 'number' && Number.isFinite(props.mach)) {
            this.mach = Math.max(1.01, Math.min(20, props.mach));
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Magnifier.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAGNIFIER_TIMEFRAME_OPTIONS",
    ()=>MAGNIFIER_TIMEFRAME_OPTIONS,
    "Magnifier",
    ()=>Magnifier,
    "magnifierTimeframeLabel",
    ()=>magnifierTimeframeLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
const MAGNIFIER_TIMEFRAME_OPTIONS = [
    {
        value: 'auto',
        label: 'Auto',
        ms: 0
    },
    {
        value: '1',
        label: '1m',
        ms: 60_000
    },
    {
        value: '5',
        label: '5m',
        ms: 300_000
    },
    {
        value: '15',
        label: '15m',
        ms: 900_000
    },
    {
        value: '30',
        label: '30m',
        ms: 1_800_000
    },
    {
        value: '60',
        label: '1h',
        ms: 3_600_000
    },
    {
        value: '240',
        label: '4h',
        ms: 14_400_000
    },
    {
        value: 'D',
        label: '1D',
        ms: 86_400_000
    }
];
function magnifierTimeframeLabel(value) {
    const opt = MAGNIFIER_TIMEFRAME_OPTIONS.find((o)=>o.value === value);
    if (opt) return opt.label;
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) {
        if (n % 1440 === 0) return `${n / 1440}D`;
        if (n % 60 === 0) return `${n / 60}h`;
        return `${n}m`;
    }
    return value;
}
function defaultMagnifierStyle() {
    // Empty candle colors follow the CHART series' own up/down at paint time, so the inset
    // reads as a finer copy of the main series until the user explicitly recolors it.
    return {
        timeframe: 'auto',
        upColor: '',
        downColor: ''
    };
}
class Magnifier extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'magnifier';
    /** Behavior + candle cosmetics (seeded from defaults, persisted via props). */ magnifier;
    /** Pixel rect of the timeframe chip as painted last frame, caret included — the chip is
     *  an interactive dropdown trigger, so the interaction layer needs the exact rect the
     *  painter measured. Renderer-transient: never serialized, null while unpainted. */ chipRect = null;
    constructor(init){
        super(init);
        if (!this.magnifier) this.magnifier = defaultMagnifierStyle();
    }
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'c1',
                    free: 'both'
                },
                {
                    role: 'c2',
                    free: 'both'
                }
            ]
        };
    }
    placementMode() {
        return 'drag';
    }
    /** The pixel rectangle between the two corner anchors (painter + hit-test share it). */ rect(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return null;
        return {
            x1: proj.xOf(a.time),
            y1: ya,
            x2: proj.xOf(b.time),
            y2: yb
        };
    }
    hitTest(px, py, proj, tol) {
        const r = this.rect(proj);
        if (!r) return false;
        // The interior is an opaque inset — grabbable anywhere, like a filled box.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, r.x1, r.y1, r.x2, r.y2)) return true;
        const edges = [
            [
                r.x1,
                r.y1,
                r.x2,
                r.y1
            ],
            [
                r.x2,
                r.y1,
                r.x2,
                r.y2
            ],
            [
                r.x2,
                r.y2,
                r.x1,
                r.y2
            ],
            [
                r.x1,
                r.y2,
                r.x1,
                r.y1
            ]
        ];
        return edges.some((e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, e[0], e[1], e[2], e[3]) <= tol);
    }
    handlePoints(proj) {
        const r = this.rect(proj);
        return r ? [
            [
                r.x1,
                r.y1
            ],
            [
                r.x2,
                r.y2
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const r = this.rect(proj);
        if (!r) return null;
        return {
            x: Math.min(r.x1, r.x2),
            y: Math.min(r.y1, r.y2),
            w: Math.abs(r.x2 - r.x1),
            h: Math.abs(r.y2 - r.y1)
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                {
                    path: 'magnifier.timeframe',
                    label: 'Timeframe',
                    kind: 'select',
                    options: MAGNIFIER_TIMEFRAME_OPTIONS,
                    group: 'behavior'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"].map((f)=>({
                        ...f,
                        label: f.label.replace('Line', 'Border')
                    })),
                {
                    path: 'magnifier.upColor',
                    label: 'Up candles',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'magnifier.downColor',
                    label: 'Down candles',
                    kind: 'color',
                    group: 'fill'
                }
            ]
        };
    }
    writeProps() {
        return {
            ...this.magnifier
        };
    }
    readProps(props) {
        this.magnifier = {
            ...defaultMagnifierStyle(),
            ...props
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/MeasureBox.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MeasureBox",
    ()=>MeasureBox,
    "formatDuration",
    ()=>formatDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
/** Signed value with 2 decimals (e.g. "+523.45"). */ function signed(n) {
    return `${n >= 0 ? '+' : ''}${n.toFixed(2)}`;
}
function formatDuration(ms) {
    const m = Math.abs(ms);
    const DAY = 86400000;
    const HR = 3600000;
    const MIN = 60000;
    if (m >= DAY) {
        const d = Math.floor(m / DAY);
        const h = Math.round(m % DAY / HR);
        return h ? `${d}d ${h}h` : `${d}d`;
    }
    if (m >= HR) {
        const h = Math.floor(m / HR);
        const mn = Math.round(m % HR / MIN);
        return mn ? `${h}h ${mn}m` : `${h}h`;
    }
    if (m >= MIN) return `${Math.round(m / MIN)}m`;
    return `${Math.round(m / 1000)}s`;
}
class MeasureBox extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    // Declared with `!` (no initializer) so a field default never clobbers readProps, which the
    // base constructor runs before subclass fields would initialize. Defaulted below after super().
    /** Show the `Δprice (Δ%)` line. */ showPrice;
    /** Show the `N bars, duration` line. */ showDate;
    constructor(init){
        super(init);
        if (this.showPrice === undefined) this.showPrice = true;
        if (this.showDate === undefined) this.showDate = true;
    }
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'c1',
                    free: 'both'
                },
                {
                    role: 'c2',
                    free: 'both'
                }
            ]
        };
    }
    // Placed click-move-click (the inherited 'click' mode): first click sets a corner, the second
    // sets the opposite one — consistent with the box/Gann tools.
    /** The measurement lines, filtered by the enabled toggles. */ measureLabel(proj) {
        const lines = [];
        if (this.showPrice) lines.push(this.priceLabel());
        if (this.showDate) lines.push(this.timeLabel(proj));
        return lines;
    }
    /** Up (later price ≥ earlier) → green; else red. */ isUp() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        return a != null && b != null && b.price >= a.price;
    }
    /** Formatted `Δprice (Δ%)` between the two anchors. */ priceLabel() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return '';
        const delta = b.price - a.price;
        const percent = a.price !== 0 ? delta / a.price * 100 : 0;
        return `${signed(delta)} (${signed(percent)}%)`;
    }
    /** Formatted `N bars, duration` between the two anchors (bars only when the projector knows). */ timeLabel(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return '';
        const duration = formatDuration(b.time - a.time);
        const bars = proj.barsBetween ? Math.round(proj.barsBetween(a.time, b.time)) : null;
        return bars != null ? `${bars} bars, ${duration}` : duration;
    }
    rect(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return null;
        return {
            x1: proj.xOf(a.time),
            y1: ya,
            x2: proj.xOf(b.time),
            y2: yb
        };
    }
    hitTest(px, py, proj, tol) {
        const r = this.rect(proj);
        return r != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, r.x1, r.y1, r.x2, r.y2, tol); // shaded box → grabbable anywhere inside
    }
    handlePoints(proj) {
        const r = this.rect(proj);
        return r ? [
            [
                r.x1,
                r.y1
            ],
            [
                r.x2,
                r.y2
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const r = this.rect(proj);
        if (!r) return null;
        return {
            x: Math.min(r.x1, r.x2),
            y: Math.min(r.y1, r.y2),
            w: Math.abs(r.x2 - r.x1),
            h: Math.abs(r.y2 - r.y1)
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                {
                    path: 'showPrice',
                    label: 'Show price',
                    kind: 'boolean',
                    group: 'behavior'
                },
                {
                    path: 'showDate',
                    label: 'Show date',
                    kind: 'boolean',
                    group: 'behavior'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"].filter((f)=>f.path !== 'style.lineColor'),
                {
                    path: 'text.color',
                    label: 'Text color',
                    kind: 'color',
                    group: 'text'
                },
                {
                    path: 'text.size',
                    label: 'Text size',
                    kind: 'select',
                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_SIZE_OPTIONS"],
                    group: 'text'
                }
            ]
        };
    }
    writeProps() {
        return {
            showPrice: this.showPrice,
            showDate: this.showDate
        };
    }
    readProps(props) {
        if (typeof props.showPrice === 'boolean') this.showPrice = props.showPrice;
        if (typeof props.showDate === 'boolean') this.showDate = props.showDate;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/ModifiedSchiffPitchfork.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModifiedSchiffPitchfork",
    ()=>ModifiedSchiffPitchfork
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PitchforkVariant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PitchforkVariant.ts [app-client] (ecmascript)");
;
class ModifiedSchiffPitchfork extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PitchforkVariant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PitchforkVariant"] {
    type = 'modifiedschiffpitchfork';
    medianStart(p0, p1) {
        return {
            time: (p0.time + p1.time) / 2,
            price: (p0.price + p1.price) / 2
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Note.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Note",
    ()=>Note
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PinnedLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PinnedLabel.ts [app-client] (ecmascript)");
;
;
;
class Note extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PinnedLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PinnedLabel"] {
    type = 'note';
    constructor(init){
        super(init);
        // No color seed: the interactive creation path fixes a theme-contrast ink on the
        // fresh drawing; until then the painter auto-contrasts (`undefined` semantics).
        if (!this.text) this.text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultText"])('Note');
    }
    defaultLabel() {
        return 'Note';
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ],
            textIsContent: true
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/ParallelChannel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ParallelChannel",
    ()=>ParallelChannel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
class ParallelChannel extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'parallelchannel';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                },
                {
                    role: 'offset',
                    free: 'y'
                }
            ]
        };
    }
    /** Price delta of the parallel line from the baseline, measured at the midpoint. */ offset() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        const c = this.anchors[2];
        if (!a || !b || !c) return 0;
        return c.price - (a.price + b.price) / 2; // baseline price at the midpoint time
    }
    /** Handles: the two baseline ends + the offset handle ON the parallel line at the midpoint. */ handlePoints(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return [];
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        if (ya == null || yb == null) return [];
        const pts = [
            [
                proj.xOf(a.time),
                ya
            ],
            [
                proj.xOf(b.time),
                yb
            ]
        ];
        const c = this.anchors[2];
        if (c) {
            const yc = proj.yOf(c.price, this.paneId); // c.price IS the parallel-line price at the midpoint
            if (yc != null) pts.push([
                proj.xOf((a.time + b.time) / 2),
                yc
            ]);
        }
        return pts;
    }
    /** The channel spans the baseline's time only (the offset anchor's time is ignored). */ timeExtent() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.time, b.time),
            max: Math.max(a.time, b.time)
        };
    }
    geometry(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const d = this.offset();
        const xa = proj.xOf(a.time);
        const xb = proj.xOf(b.time);
        const ya = proj.yOf(a.price, this.paneId);
        const yb = proj.yOf(b.price, this.paneId);
        const ya2 = proj.yOf(a.price + d, this.paneId);
        const yb2 = proj.yOf(b.price + d, this.paneId);
        if (ya == null || yb == null || ya2 == null || yb2 == null) return null;
        return {
            segments: [
                [
                    xa,
                    ya,
                    xb,
                    yb
                ],
                [
                    xa,
                    ya2,
                    xb,
                    yb2
                ]
            ],
            fill: [
                [
                    xa,
                    ya
                ],
                [
                    xb,
                    yb
                ],
                [
                    xb,
                    yb2
                ],
                [
                    xa,
                    ya2
                ]
            ]
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const d = this.offset();
        const prices = [
            a.price,
            b.price,
            a.price + d,
            b.price + d
        ];
        const c = this.anchors[2];
        if (c) prices.push(c.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Path.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Path",
    ()=>Path
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PathDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PathDrawing.ts [app-client] (ecmascript)");
;
class Path extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PathDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PathDrawing"] {
    type = 'path';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/PathDrawing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_PATH_POINTS",
    ()=>MAX_PATH_POINTS,
    "PathDrawing",
    ()=>PathDrawing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
const MAX_PATH_POINTS = 512;
class PathDrawing extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    anchorSchema() {
        return {
            min: 2,
            max: MAX_PATH_POINTS,
            slots: []
        }; // variable count; vertices default to free 'both'
    }
    geometry(proj) {
        const pts = [];
        for (const a of this.anchors){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) return null;
            pts.push([
                proj.xOf(a.time),
                y
            ]);
        }
        if (pts.length < 2) return null;
        const segments = [];
        for(let i = 1; i < pts.length; i += 1)segments.push([
            pts[i - 1][0],
            pts[i - 1][1],
            pts[i][0],
            pts[i][1]
        ]);
        return {
            segments,
            fill: null
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PatternDrawing",
    ()=>PatternDrawing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class PatternDrawing extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    /** Show consecutive-leg retracement ratios (harmonic patterns). */ legRatios() {
        return false;
    }
    /** Vertex-index triples to tint (the harmonic body), or none. */ fillTriangles() {
        return [];
    }
    /** Two vertex indices whose line is drawn as an extended neckline (head & shoulders), or null. */ necklineIndices() {
        return null;
    }
    anchorSchema() {
        const n = this.vertexLabels().length;
        const slots = [];
        for(let i = 0; i < n; i += 1)slots.push({
            role: `p${i}`,
            free: 'both'
        });
        return {
            min: n,
            max: n,
            slots
        };
    }
    handlePoints(proj) {
        const pts = [];
        for (const a of this.anchors){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) return [];
            pts.push([
                proj.xOf(a.time),
                y
            ]);
        }
        return pts;
    }
    hitTest(px, py, proj, tol) {
        const pts = this.handlePoints(proj);
        return pts.length >= 2 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToPolyline"])(px, py, pts) <= tol;
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const pts = this.handlePoints(proj);
        if (pts.length === 0) return null;
        const xs = pts.map((p)=>p[0]);
        const ys = pts.map((p)=>p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    // ── harmonic validation hooks (overridden by HarmonicPattern; null = not a validated pattern) ──
    /** The harmonic pattern's name (drawn as a badge), or null for a plain pattern. */ patternName() {
        return null;
    }
    /** Whether the leg ratio shown at vertex `i` is within the pattern's ideal band (null = no rule). */ ratioOk(_i) {
        return null;
    }
    /** Whether ALL the pattern's defining ratios are satisfied (null = not enough points / not harmonic). */ valid() {
        return null;
    }
    /** Consecutive-leg ratio at vertex `i` (≥2): |leg(i-1,i)| / |leg(i-2,i-1)| in price. */ ratioAt(i) {
        const a = this.anchors[i - 2];
        const b = this.anchors[i - 1];
        const c = this.anchors[i];
        if (!a || !b || !c) return null;
        const prev = Math.abs(b.price - a.price);
        return prev < 1e-9 ? null : Math.abs(c.price - b.price) / prev;
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...this.fillTriangles().length ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"] : []
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/PinnedLabel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PinnedLabel",
    ()=>PinnedLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
/** Approximate px font size for a named text size (the painter measures the glyphs exactly). */ const SIZE_PX = {
    tiny: 10,
    small: 12,
    normal: 14,
    large: 18,
    huge: 24,
    auto: 14
};
class PinnedLabel extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    /** The placeholder string when no text has been entered yet. */ defaultLabel() {
        return 'Text';
    }
    /** The string used to size the approximate hit box (subclasses with computed text override it). */ labelText() {
        return this.text?.value ?? this.defaultLabel();
    }
    anchorSchema() {
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'p',
                    free: 'both'
                }
            ]
        };
    }
    /** Approximate pixel box of the label (the painter renders the precise glyphs). */ box(proj) {
        const a = this.anchors[0];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        if (y == null) return null;
        const fs = SIZE_PX[this.text?.size ?? 'normal'] ?? 14;
        const lines = this.labelText().split('\n');
        const cols = Math.max(1, ...lines.map((l)=>l.length));
        return {
            x: proj.xOf(a.time),
            y,
            w: Math.max(12, cols * fs * 0.6) + 8,
            h: lines.length * fs * 1.4 + 4
        };
    }
    hitTest(px, py, proj, _tol) {
        const b = this.box(proj);
        return b != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, b.x, b.y, b.x + b.w, b.y + b.h);
    }
    handlePoints(proj) {
        const a = this.anchors[0];
        const y = a ? proj.yOf(a.price, this.paneId) : null;
        return a && y != null ? [
            [
                proj.xOf(a.time),
                y
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        return this.box(proj);
    }
    priceRange() {
        const a = this.anchors[0];
        return a ? {
            min: a.price,
            max: a.price
        } : null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Pitchfork.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Pitchfork",
    ()=>Pitchfork
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
;
class Pitchfork extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'pitchfork';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'pivot',
                    free: 'both'
                },
                {
                    role: 'upper',
                    free: 'both'
                },
                {
                    role: 'lower',
                    free: 'both'
                }
            ]
        };
    }
    geometry(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const px = (p)=>{
            const y = proj.yOf(p.price, this.paneId);
            return y == null ? null : [
                proj.xOf(p.time),
                y
            ];
        };
        const P0 = px(a);
        const P1 = px(b);
        if (!P0 || !P1) return null;
        const c = this.anchors[2];
        if (!c) return {
            segments: [
                [
                    P0[0],
                    P0[1],
                    P1[0],
                    P1[1]
                ]
            ],
            fill: null
        }; // pivot → cursor only (placing)
        const P2 = px(c);
        if (!P2) return null;
        const mx = (P1[0] + P2[0]) / 2;
        const my = (P1[1] + P2[1]) / 2; // midpoint of the two tine anchors
        const dx = mx - P0[0];
        const dy = my - P0[1]; // median direction
        const w = proj.width;
        const h = proj.height;
        return {
            segments: [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(P0[0], P0[1], mx, my, 'right', w, h),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(P1[0], P1[1], P1[0] + dx, P1[1] + dy, 'right', w, h),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(P2[0], P2[1], P2[0] + dx, P2[1] + dy, 'right', w, h),
                [
                    P1[0],
                    P1[1],
                    P2[0],
                    P2[1]
                ]
            ],
            fill: null
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((p)=>p.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/PitchforkVariant.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PitchforkVariant",
    ()=>PitchforkVariant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
;
class PitchforkVariant extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'pivot',
                    free: 'both'
                },
                {
                    role: 'upper',
                    free: 'both'
                },
                {
                    role: 'lower',
                    free: 'both'
                }
            ]
        };
    }
    geometry(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const px = (p)=>{
            const y = proj.yOf(p.price, this.paneId);
            return y == null ? null : [
                proj.xOf(p.time),
                y
            ];
        };
        const P0 = px(a);
        const P1 = px(b);
        if (!P0 || !P1) return null;
        const c = this.anchors[2];
        if (!c) return {
            segments: [
                [
                    P0[0],
                    P0[1],
                    P1[0],
                    P1[1]
                ]
            ],
            fill: null
        }; // pivot → cursor only (placing)
        const S = px(this.medianStart(a, b, c));
        const P2 = px(c);
        if (!S || !P2) return null;
        const mx = (P1[0] + P2[0]) / 2;
        const my = (P1[1] + P2[1]) / 2; // median target = midpoint of the tine anchors
        const dx = mx - S[0];
        const dy = my - S[1]; // median direction from the shifted origin
        const w = proj.width;
        const h = proj.height;
        return {
            segments: [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(S[0], S[1], mx, my, 'right', w, h),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(P1[0], P1[1], P1[0] + dx, P1[1] + dy, 'right', w, h),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(P2[0], P2[1], P2[0] + dx, P2[1] + dy, 'right', w, h),
                [
                    P1[0],
                    P1[1],
                    P2[0],
                    P2[1]
                ],
                // The median leaves from the shifted origin, not the pivot — without this construction
                // line the pivot handle would float unattached to the shape it defines.
                [
                    P0[0],
                    P0[1],
                    P1[0],
                    P1[1]
                ]
            ],
            fill: null
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((p)=>p.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Polyline.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Polyline",
    ()=>Polyline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PathDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PathDrawing.ts [app-client] (ecmascript)");
;
class Polyline extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PathDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PathDrawing"] {
    type = 'polyline';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/PositionTool.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DIRECTION_OPTIONS",
    ()=>DIRECTION_OPTIONS,
    "PositionTool",
    ()=>PositionTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
;
;
const DIRECTION_OPTIONS = [
    {
        value: 'long',
        label: 'Long'
    },
    {
        value: 'short',
        label: 'Short'
    }
];
class PositionTool extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'position';
    /** Default reward:risk used to derive the stop from the placed (or default) target. */ static DEFAULT_RR = 2;
    /** Below this vertical drag (media px) a placement is treated as a bare click → default box. */ static MIN_DRAG_PX = 6;
    static DEFAULT_RISK_PX = 64;
    static DEFAULT_WIDTH_PX = 150;
    static MIN_WIDTH_PX = 48;
    static DEFAULT_RISK_PERCENT = 1;
    static DEFAULT_ACCOUNT_BALANCE = 10_000;
    static DEFAULT_PROFIT_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VALID"];
    static DEFAULT_LOSS_COLOR = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INVALID"];
    // Declared with `!` so a field default never clobbers readProps (base constructor runs first).
    /** Percent of account balance risked on the stop (drives dollar loss + position size). */ riskPercent;
    /** Account balance in dollars (drives dollar loss + position size). */ accountBalance;
    /** Master toggle for every painted label. */ showText;
    /** Show the `DIR · R:R` header line above the box. */ showHeader;
    /** Append the level price to the target/stop labels. */ showPrices;
    /** Show the `Loss $ · Size` line above the box. */ showLossSize;
    /** Show the `Target +%` label inside the reward zone. */ showTargetLabel;
    /** Show the `Stop −%` label inside the risk zone. */ showStopLabel;
    /** Fill + line color of the reward zone. */ profitColor;
    /** Fill + line color of the risk zone. */ lossColor;
    constructor(init){
        super(init);
        if (this.riskPercent === undefined) this.riskPercent = PositionTool.DEFAULT_RISK_PERCENT;
        if (this.accountBalance === undefined) this.accountBalance = PositionTool.DEFAULT_ACCOUNT_BALANCE;
        if (this.showText === undefined) this.showText = true;
        if (this.showHeader === undefined) this.showHeader = true;
        if (this.showPrices === undefined) this.showPrices = false;
        if (this.showLossSize === undefined) this.showLossSize = true;
        if (this.showTargetLabel === undefined) this.showTargetLabel = true;
        if (this.showStopLabel === undefined) this.showStopLabel = true;
        if (this.profitColor === undefined) this.profitColor = PositionTool.DEFAULT_PROFIT_COLOR;
        if (this.lossColor === undefined) this.lossColor = PositionTool.DEFAULT_LOSS_COLOR;
    }
    /** `'LONG'` or `'SHORT'`, computed from geometry so it flips live as the drag crosses the
     *  entry (target above entry → long; below → short). */ directionLabel() {
        const p = this.prices();
        return p && p.target >= p.entry ? 'LONG' : 'SHORT';
    }
    /** Direction as a settings path: reading reflects the geometry; writing the opposite value
     *  mirrors the stop AND the target across the entry, turning the trade around in place
     *  while preserving each side's distance (and therefore the R:R). */ get direction() {
        return this.directionLabel() === 'LONG' ? 'long' : 'short';
    }
    set direction(v) {
        const entry = this.anchors[0];
        const stop = this.anchors[1];
        const target = this.anchors[2];
        if (!entry || !stop || !target) return;
        if ((v === 'long' || v === 'short') && v !== this.direction) {
            stop.price = 2 * entry.price - stop.price;
            target.price = 2 * entry.price - target.price;
        }
    }
    /** Position size as a settings path: reading returns the computed size; writing back-solves
     *  the risk % so that `size × stop distance = balance × risk%` holds for the typed size. */ get quantity() {
        return this.positionSize();
    }
    set quantity(v) {
        const p = this.prices();
        if (!p || !Number.isFinite(v) || v < 0) return;
        const dist = Math.abs(p.entry - p.stop);
        if (dist < 1e-9 || this.accountBalance <= 0) return;
        this.riskPercent = v * dist / this.accountBalance * 100;
    }
    // ── price levels as settings paths (the gear panel patches these directly) ──
    get entryPrice() {
        return this.anchors[0]?.price ?? 0;
    }
    set entryPrice(v) {
        const a = this.anchors[0];
        if (a && Number.isFinite(v)) {
            a.price = v;
            this.constrainHandleDrag(0);
        }
    }
    get stopPrice() {
        return this.anchors[1]?.price ?? 0;
    }
    set stopPrice(v) {
        const a = this.anchors[1];
        if (a && Number.isFinite(v)) {
            a.price = v;
            this.constrainHandleDrag(1);
        }
    }
    get targetPrice() {
        return this.anchors[2]?.price ?? 0;
    }
    set targetPrice(v) {
        const a = this.anchors[2];
        if (a && Number.isFinite(v)) {
            a.price = v;
            this.constrainHandleDrag(2);
        }
    }
    anchorSchema() {
        // Click-move-click: click 1 = entry, click 2 = target (max 2 clicks finalize). onPlaced then
        // derives the stop and rewrites anchors as [entry, stop, target]. The 3 slots give all three
        // handles their free axes after placement.
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'entry',
                    free: 'both'
                },
                {
                    role: 'stop',
                    free: 'both'
                },
                {
                    role: 'target',
                    free: 'both'
                }
            ]
        };
    }
    // Placed click-move-click (the inherited 'click' mode), consistent with the box/Gann/range tools.
    /**
     * Resolve the two placed anchors (entry + target) into the final entry/stop/target box,
     * computing the stop/width in PIXEL space so the box has a consistent visual size at any
     * scale. The second click is the profit direction — a target above the entry yields a long
     * (stop below); below yields a short. A degenerate second click (≈ the entry) falls back to
     * a default-sized long-facing box.
     */ onPlaced(proj) {
        const e = this.anchors[0];
        if (!e) return;
        const ex = proj.xOf(e.time);
        const ey = proj.yOf(e.price, this.paneId);
        if (ey == null) return;
        const t = this.anchors[1];
        const ty = t ? proj.yOf(t.price, this.paneId) : null;
        let targetPx;
        let endPx;
        if (t && ty != null && Math.abs(ty - ey) >= PositionTool.MIN_DRAG_PX) {
            targetPx = ty; // a real drag: the target (profit) is where the user released
            endPx = ex + Math.max(Math.abs(proj.xOf(t.time) - ex), PositionTool.MIN_WIDTH_PX);
        } else {
            // a degenerate second click (≈ the entry): a default long-facing box (target above)
            targetPx = ey - PositionTool.DEFAULT_RISK_PX * PositionTool.DEFAULT_RR;
            endPx = ex + PositionTool.DEFAULT_WIDTH_PX;
        }
        // stop on the opposite side of the entry at 1/R:R of the reward distance
        const stopPx = ey - (targetPx - ey) / PositionTool.DEFAULT_RR;
        const endTime = proj.pxToPoint(endPx, ey, this.paneId).time;
        this.anchors = [
            {
                time: e.time,
                price: e.price
            },
            {
                time: endTime,
                price: proj.pxToPoint(ex, stopPx, this.paneId).price
            },
            {
                time: endTime,
                price: proj.pxToPoint(ex, targetPx, this.paneId).price
            }
        ];
    }
    /**
     * Keep the stop (loss) and target (reward) on OPPOSITE sides of the entry. When a handle
     * drag would put them on the same side — e.g. dragging the stop of a long up past the entry
     * (flipping it to a short) — reflect the *other* side across the entry so the two never
     * collapse onto one direction. R:R (each side's distance from entry) is preserved.
     */ constrainHandleDrag(index) {
        const entry = this.anchors[0];
        const stop = this.anchors[1];
        const target = this.anchors[2];
        if (!entry || !stop || !target) return;
        const stopSide = Math.sign(stop.price - entry.price);
        const targetSide = Math.sign(target.price - entry.price);
        if (stopSide === 0 || targetSide === 0 || stopSide !== targetSide) return; // already opposed (or on the line)
        // same side → flip whichever side was NOT the one being dragged across the entry
        if (index === 2) stop.price = 2 * entry.price - stop.price; // dragged target → flip the stop
        else target.price = 2 * entry.price - target.price; // dragged stop (or entry) → flip the target
    }
    /** The three levels — entry, stop, target — deriving the stop while only two anchors exist
     *  (the live drag preview, before onPlaced sets the precise box). During preview the second
     *  anchor is the target (profit); after placement anchors are [entry, stop, target]. */ resolved() {
        const e = this.anchors[0];
        const a1 = this.anchors[1];
        if (!e || !a1) return null;
        if (this.anchors[2]) return [
            e,
            a1,
            this.anchors[2]
        ];
        // live preview: a1 is the target; stop sits opposite at 1/R:R of the reward
        const stop = {
            time: a1.time,
            price: e.price - (a1.price - e.price) / PositionTool.DEFAULT_RR
        };
        return [
            e,
            stop,
            a1
        ];
    }
    prices() {
        const r = this.resolved();
        return r ? {
            entry: r[0].price,
            stop: r[1].price,
            target: r[2].price
        } : null;
    }
    /** Risk:reward ratio = |target − entry| / |entry − stop| (0 when risk is degenerate). */ rr() {
        const p = this.prices();
        if (!p) return 0;
        const risk = Math.abs(p.entry - p.stop);
        return risk < 1e-9 ? 0 : Math.abs(p.target - p.entry) / risk;
    }
    /** Reward % = |target − entry| / entry · 100. */ rewardPct() {
        const p = this.prices();
        return p && p.entry !== 0 ? Math.abs(p.target - p.entry) / p.entry * 100 : 0;
    }
    /** Risk % of price = |entry − stop| / entry · 100 (distinct from the account riskPercent). */ riskPct() {
        const p = this.prices();
        return p && p.entry !== 0 ? Math.abs(p.entry - p.stop) / p.entry * 100 : 0;
    }
    /** Dollar amount risked at the stop = accountBalance × riskPercent / 100. */ dollarLoss() {
        return Math.max(0, this.accountBalance) * (Math.max(0, this.riskPercent) / 100);
    }
    /** Position size in units = dollarLoss / |entry − stop| (0 when risk is degenerate). */ positionSize() {
        const p = this.prices();
        if (!p) return 0;
        const risk = Math.abs(p.entry - p.stop);
        return risk < 1e-9 ? 0 : this.dollarLoss() / risk;
    }
    // ── painted label lines (each respects its own toggle; the painter checks showText) ──
    /** `DIR · R:R x.xx` — the always-on header when text is shown. */ headerLabel() {
        return `${this.directionLabel()}  ·  R:R ${this.rr().toFixed(2)}`;
    }
    /** `Loss $… · Size …` — the painter hides it when showLossSize is off. */ lossSizeLabel() {
        return `Loss $${formatMoney(this.dollarLoss())}  ·  Size ${formatQty(this.positionSize())}`;
    }
    /** `Target +x.xx%`, with the level price appended when showPrices is on. */ targetLabel() {
        const p = this.prices();
        const at = this.showPrices && p ? `  @ ${formatPrice(p.target)}` : '';
        return `Target +${this.rewardPct().toFixed(2)}%${at}`;
    }
    /** `Stop −x.xx%`, with the level price appended when showPrices is on. */ stopLabel() {
        const p = this.prices();
        const at = this.showPrices && p ? `  @ ${formatPrice(p.stop)}` : '';
        return `Stop −${this.riskPct().toFixed(2)}%${at}`;
    }
    // ── stop/target input units (the gear panel's Price / Points dropdowns) ──
    /** The stop or target expressed in the given unit: the absolute price, or the distance from
     *  the entry in price points. */ levelDisplayValue(level, mode) {
        const p = this.prices();
        if (!p) return 0;
        const price = level === 'stop' ? p.stop : p.target;
        if (mode === 'price') return roundFloat(price);
        return roundFloat(Math.abs(price - p.entry));
    }
    /** The absolute price a typed value in the given unit resolves to. Points measure the
     *  distance from the entry; the level keeps its current side (target defaults to the profit
     *  side, stop to the loss side, when it sits exactly on the entry). */ levelPriceFromDisplay(level, mode, value) {
        const p = this.prices();
        if (!p || mode === 'price') return value;
        const current = level === 'stop' ? p.stop : p.target;
        let side = Math.sign(current - p.entry);
        if (side === 0) side = (level === 'target' ? 1 : -1) * (this.direction === 'long' ? 1 : -1);
        return p.entry + side * Math.abs(value);
    }
    box(proj) {
        const pts = this.handlePoints(proj);
        if (pts.length < 3) return null;
        const xs = pts.map((p)=>p[0]);
        return {
            x1: Math.min(...xs),
            x2: Math.max(...xs),
            ey: pts[0][1],
            sy: pts[1][1],
            ty: pts[2][1]
        };
    }
    /** Pixel layout for the painter: the box x-range + each level's y. */ layout(proj) {
        return this.box(proj);
    }
    hitTest(px, py, proj, tol) {
        const b = this.box(proj);
        if (!b) return false;
        const top = Math.min(b.ey, b.sy, b.ty);
        const bot = Math.max(b.ey, b.sy, b.ty);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInBox"])(px, py, b.x1, top, b.x2, bot, tol);
    }
    handlePoints(proj) {
        const r = this.resolved();
        if (!r) return [];
        const pts = [];
        for (const a of r){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) return [];
            pts.push([
                proj.xOf(a.time),
                y
            ]);
        }
        return pts;
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const b = this.box(proj);
        if (!b) return null;
        const y = Math.min(b.ey, b.sy, b.ty);
        return {
            x: b.x1,
            y,
            w: b.x2 - b.x1,
            h: Math.max(b.ey, b.sy, b.ty) - y
        };
    }
    priceRange() {
        const r = this.resolved();
        if (!r) return null;
        const ps = r.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                {
                    path: 'riskPercent',
                    label: 'Risk %',
                    kind: 'number',
                    min: 0,
                    max: 100,
                    step: 0.1,
                    group: 'behavior'
                },
                {
                    path: 'accountBalance',
                    label: 'Account balance',
                    kind: 'number',
                    min: 0,
                    max: 1e12,
                    step: 1,
                    group: 'behavior'
                },
                {
                    path: 'quantity',
                    label: 'Position size',
                    kind: 'number',
                    group: 'behavior'
                },
                {
                    path: 'direction',
                    label: 'Direction',
                    kind: 'select',
                    options: DIRECTION_OPTIONS,
                    group: 'behavior'
                },
                {
                    path: 'entryPrice',
                    label: 'Entry price',
                    kind: 'number',
                    group: 'behavior'
                },
                {
                    path: 'stopPrice',
                    label: 'Stop price',
                    kind: 'number',
                    group: 'behavior'
                },
                {
                    path: 'targetPrice',
                    label: 'Target price',
                    kind: 'number',
                    group: 'behavior'
                },
                {
                    path: 'showText',
                    label: 'Show text',
                    kind: 'boolean',
                    group: 'behavior'
                },
                {
                    path: 'showHeader',
                    label: 'Show direction & ratio',
                    kind: 'boolean',
                    group: 'behavior'
                },
                {
                    path: 'showLossSize',
                    label: 'Show loss & size',
                    kind: 'boolean',
                    group: 'behavior'
                },
                {
                    path: 'showTargetLabel',
                    label: 'Show target label',
                    kind: 'boolean',
                    group: 'behavior'
                },
                {
                    path: 'showStopLabel',
                    label: 'Show stop label',
                    kind: 'boolean',
                    group: 'behavior'
                },
                {
                    path: 'showPrices',
                    label: 'Show level prices',
                    kind: 'boolean',
                    group: 'behavior'
                },
                {
                    path: 'profitColor',
                    label: 'Profit zone',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'lossColor',
                    label: 'Loss zone',
                    kind: 'color',
                    group: 'fill'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"].filter((f)=>f.path !== 'style.lineColor'),
                {
                    path: 'text.color',
                    label: 'Text color',
                    kind: 'color',
                    group: 'text'
                },
                {
                    path: 'text.size',
                    label: 'Text size',
                    kind: 'select',
                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_SIZE_OPTIONS"],
                    group: 'text'
                }
            ]
        };
    }
    writeProps() {
        return {
            riskPercent: this.riskPercent,
            accountBalance: this.accountBalance,
            showText: this.showText,
            showHeader: this.showHeader,
            showPrices: this.showPrices,
            showLossSize: this.showLossSize,
            showTargetLabel: this.showTargetLabel,
            showStopLabel: this.showStopLabel,
            profitColor: this.profitColor,
            lossColor: this.lossColor
        };
    }
    readProps(props) {
        if (typeof props.riskPercent === 'number' && Number.isFinite(props.riskPercent)) {
            this.riskPercent = props.riskPercent;
        }
        if (typeof props.accountBalance === 'number' && Number.isFinite(props.accountBalance)) {
            this.accountBalance = props.accountBalance;
        }
        if (typeof props.showText === 'boolean') this.showText = props.showText;
        if (typeof props.showHeader === 'boolean') this.showHeader = props.showHeader;
        if (typeof props.showPrices === 'boolean') this.showPrices = props.showPrices;
        if (typeof props.showLossSize === 'boolean') this.showLossSize = props.showLossSize;
        if (typeof props.showTargetLabel === 'boolean') this.showTargetLabel = props.showTargetLabel;
        if (typeof props.showStopLabel === 'boolean') this.showStopLabel = props.showStopLabel;
        if (typeof props.profitColor === 'string') this.profitColor = props.profitColor;
        if (typeof props.lossColor === 'string') this.lossColor = props.lossColor;
    }
}
/** Compact money string (drops trailing .00; keeps two decimals otherwise). */ function formatMoney(n) {
    if (!Number.isFinite(n)) return '0';
    const rounded = Math.round(n * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
/** Compact quantity string for the position size readout. */ function formatQty(n) {
    if (!Number.isFinite(n) || n === 0) return '0';
    if (n >= 100) return n.toFixed(2);
    if (n >= 1) return n.toFixed(4).replace(/\.?0+$/, '');
    return n.toPrecision(4).replace(/\.?0+$/, '');
}
/** Compact price string for the level readouts (two decimals ≥1, four significant below). */ function formatPrice(n) {
    if (!Number.isFinite(n)) return '0';
    if (Math.abs(n) >= 1) return n.toFixed(2);
    return n.toPrecision(4).replace(/\.?0+$/, '');
}
/** Trim binary float noise from a converted value (points arithmetic). */ function roundFloat(n) {
    return Math.round(n * 1e8) / 1e8;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/PriceLabel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PriceLabel",
    ()=>PriceLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PinnedLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PinnedLabel.ts [app-client] (ecmascript)");
;
;
class PriceLabel extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PinnedLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PinnedLabel"] {
    type = 'pricelabel';
    /** Sized from the (approximate) price string — the painter formats it precisely. */ labelText() {
        const p = this.anchors[0]?.price;
        return p == null ? '0.00' : p.toFixed(2);
    }
    /** The label value is auto (the price), so expose only styling — not a `text.value` field. */ schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"].filter((f)=>f.path !== 'text.value')
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/PriceNote.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PriceNote",
    ()=>PriceNote
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CalloutBase.ts [app-client] (ecmascript)");
;
;
class PriceNote extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalloutBase"] {
    type = 'pricenote';
    defaultLabel() {
        return ''; // no free text — the painter renders the pinned price
    }
    /** Sized from the (approximate) pinned price string — the painter formats it precisely. */ labelText() {
        const p = this.anchors[0]?.price;
        return p == null ? '0.00' : p.toFixed(2);
    }
    /** The label is the auto price, so expose only styling — not a `text.value` field. */ schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"].filter((f)=>f.path !== 'text.value')
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/RadialFib.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RadialFib",
    ()=>RadialFib,
    "angleInSweep",
    ()=>angleInSweep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
function angleInSweep(ang, a0, a1) {
    if (a1 - a0 >= Math.PI * 2 - 1e-3) return true; // full circle
    let d = ang - a0;
    const TWO_PI = Math.PI * 2;
    while(d < 0)d += TWO_PI;
    while(d >= TWO_PI)d -= TWO_PI;
    return d <= a1 - a0 + 1e-6;
}
class RadialFib extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    /** Straight lines drawn alongside the rings (baseline / wedge rays); previewed before `radial` resolves. */ boundingLines(_proj) {
        return [];
    }
    // Ring tools hit-test by radius, not line segments → entryLines is unused (the painter dispatches
    // them to the arc branch). Satisfy the abstract with an empty set.
    entryLines(_proj) {
        return [];
    }
    hitTest(px, py, proj, tol) {
        const g = this.radial(proj);
        if (g) {
            const dist = Math.hypot(px - g.cx, py - g.cy);
            const ang = Math.atan2(py - g.cy, px - g.cx);
            if (angleInSweep(ang, g.a0, g.a1)) {
                for (const lv of this.levels){
                    if (lv.enabled && Math.abs(dist - g.R0 * lv.ratio) <= tol) return true;
                }
            }
        }
        return this.boundingLines(proj).some((b)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, b[0], b[1], b[2], b[3]) <= tol);
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Ray.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Ray",
    ()=>Ray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class Ray extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'ray';
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                }
            ]
        };
    }
    pixels(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const y1 = proj.yOf(a.price, this.paneId);
        const y2 = proj.yOf(b.price, this.paneId);
        if (y1 == null || y2 == null) return null;
        return [
            proj.xOf(a.time),
            y1,
            proj.xOf(b.time),
            y2
        ];
    }
    hitTest(px, py, proj, tol) {
        const p = this.pixels(proj);
        if (!p) return false;
        const [ex1, ey1, ex2, ey2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendRay"])(p[0], p[1], p[2], p[3], 'right', proj.width, proj.height);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, ex1, ey1, ex2, ey2) <= tol;
    }
    handlePoints(proj) {
        const p = this.pixels(proj);
        return p ? [
            [
                p[0],
                p[1]
            ],
            [
                p[2],
                p[3]
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const p = this.pixels(proj);
        if (!p) return null;
        return {
            x: Math.min(p[0], p[2]),
            y: Math.min(p[1], p[3]),
            w: Math.abs(p[2] - p[0]),
            h: Math.abs(p[3] - p[1])
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/RegressionChannel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegressionChannel",
    ()=>RegressionChannel,
    "computeRegressionFit",
    ()=>computeRegressionFit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
;
;
/** Standard-deviation multiplier for the channel half-width (a ±2σ band around the fit line). */ const DEVIATIONS = 2;
function defaultRegressionStyle() {
    return {
        midColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"],
        midStyle: 'solid',
        upperColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"],
        upperStyle: 'solid',
        lowerColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"],
        lowerStyle: 'solid',
        upperFill: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"]}26`,
        lowerFill: `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"]}26`,
        showR2: true
    };
}
function computeRegressionFit(bars) {
    const n = bars.length;
    if (n < 2) return null;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;
    for(let i = 0; i < n; i += 1){
        const y = bars[i].close;
        sumX += i;
        sumY += y;
        sumXY += i * y;
        sumXX += i * i;
        sumYY += y * y;
    }
    const denom = n * sumXX - sumX * sumX;
    const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;
    let sse = 0;
    for(let i = 0; i < n; i += 1){
        const resid = bars[i].close - (intercept + slope * i);
        sse += resid * resid;
    }
    const sigma = Math.sqrt(sse / n);
    const den = Math.sqrt(denom * (n * sumYY - sumY * sumY));
    const r = den === 0 ? 0 : (n * sumXY - sumX * sumY) / den;
    return {
        t0: bars[0].time,
        t1: bars[n - 1].time,
        mid0: intercept,
        mid1: intercept + slope * (n - 1),
        dev: DEVIATIONS * sigma,
        r2: Math.max(0, Math.min(1, r * r)),
        n
    };
}
class RegressionChannel extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'regressionchannel';
    /** Per-line + fill cosmetics (seeded from defaults, persisted via props). Definite-assignment:
     *  set either by `readProps` (during `super()`) or by the constructor below — never as a field
     *  initializer, which would run *after* `super()` and clobber a restored value. */ reg;
    /** Last computed price span (midline ± band), cached so autoscale's `priceRange()`
     *  — which gets no projector — can fold the channel in without recomputing. */ cachedRange = null;
    constructor(init){
        super(init);
        if (!this.reg) this.reg = defaultRegressionStyle();
    }
    anchorSchema() {
        // Two points bound the time range; the fit ignores their price (data-driven),
        // so handles are constrained to horizontal moves.
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'start',
                    free: 'x'
                },
                {
                    role: 'end',
                    free: 'x'
                }
            ]
        };
    }
    /** Fit against the bars in the anchor time-range, caching the price span for autoscale. */ fit(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const from = Math.min(a.time, b.time);
        const to = Math.max(a.time, b.time);
        const bars = proj.barsInRange?.(from, to) ?? null;
        const f = bars ? computeRegressionFit(bars) : null;
        if (f) {
            this.cachedRange = {
                min: Math.min(f.mid0, f.mid1) - f.dev,
                max: Math.max(f.mid0, f.mid1) + f.dev
            };
        }
        return f;
    }
    /** Resolve the fit to pixel geometry for the painter + hit-test. */ layout(proj) {
        const f = this.fit(proj);
        if (!f) return null;
        const midY0 = proj.yOf(f.mid0, this.paneId);
        const midY1 = proj.yOf(f.mid1, this.paneId);
        const upperY0 = proj.yOf(f.mid0 + f.dev, this.paneId);
        const upperY1 = proj.yOf(f.mid1 + f.dev, this.paneId);
        const lowerY0 = proj.yOf(f.mid0 - f.dev, this.paneId);
        const lowerY1 = proj.yOf(f.mid1 - f.dev, this.paneId);
        if (midY0 == null || midY1 == null || upperY0 == null || upperY1 == null || lowerY0 == null || lowerY1 == null) return null;
        return {
            x0: proj.xOf(f.t0),
            x1: proj.xOf(f.t1),
            midY0,
            midY1,
            upperY0,
            upperY1,
            lowerY0,
            lowerY1,
            r2: f.r2,
            showR2: this.reg.showR2
        };
    }
    /** The band outline polygon (upper edge left→right, then lower edge right→left). */ band(proj) {
        const L = this.layout(proj);
        if (!L) return null;
        return [
            [
                L.x0,
                L.upperY0
            ],
            [
                L.x1,
                L.upperY1
            ],
            [
                L.x1,
                L.lowerY1
            ],
            [
                L.x0,
                L.lowerY0
            ]
        ];
    }
    hitTest(px, py, proj, tol) {
        const L = this.layout(proj);
        if (!L) return false;
        const poly = [
            [
                L.x0,
                L.upperY0
            ],
            [
                L.x1,
                L.upperY1
            ],
            [
                L.x1,
                L.lowerY1
            ],
            [
                L.x0,
                L.lowerY0
            ]
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInPolygon"])(px, py, poly)) return true;
        const lines = [
            [
                L.x0,
                L.midY0,
                L.x1,
                L.midY1
            ],
            [
                L.x0,
                L.upperY0,
                L.x1,
                L.upperY1
            ],
            [
                L.x0,
                L.lowerY0,
                L.x1,
                L.lowerY1
            ]
        ];
        return lines.some((s)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, s[0], s[1], s[2], s[3]) <= tol);
    }
    handlePoints(proj) {
        const L = this.layout(proj);
        if (L) return [
            [
                L.x0,
                L.midY0
            ],
            [
                L.x1,
                L.midY1
            ]
        ];
        // no fit (e.g. no data yet) → fall back to the raw anchors so the tool stays grabbable
        const pts = [];
        for (const a of this.anchors){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) return [];
            pts.push([
                proj.xOf(a.time),
                y
            ]);
        }
        return pts;
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const poly = this.band(proj);
        if (!poly) return null;
        const xs = poly.map((p)=>p[0]);
        const ys = poly.map((p)=>p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
    priceRange() {
        if (this.cachedRange) return this.cachedRange;
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        // Custom paths the settings popup renders as dedicated regression controls
        // (per-line color + style, the two area fills, and the R² toggle).
        return {
            fields: [
                {
                    path: 'reg.midColor',
                    label: 'Midline color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'reg.midStyle',
                    label: 'Midline style',
                    kind: 'lineStyle',
                    group: 'line'
                },
                {
                    path: 'reg.upperColor',
                    label: 'Upper line color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'reg.upperStyle',
                    label: 'Upper line style',
                    kind: 'lineStyle',
                    group: 'line'
                },
                {
                    path: 'reg.lowerColor',
                    label: 'Lower line color',
                    kind: 'color',
                    group: 'line'
                },
                {
                    path: 'reg.lowerStyle',
                    label: 'Lower line style',
                    kind: 'lineStyle',
                    group: 'line'
                },
                {
                    path: 'reg.upperFill',
                    label: 'Upper fill',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'reg.lowerFill',
                    label: 'Lower fill',
                    kind: 'color',
                    group: 'fill'
                },
                {
                    path: 'reg.showR2',
                    label: 'Show R²',
                    kind: 'boolean',
                    group: 'behavior'
                }
            ]
        };
    }
    writeProps() {
        return {
            ...this.reg
        };
    }
    readProps(props) {
        this.reg = {
            ...defaultRegressionStyle(),
            ...props
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/RotatedRect.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RotatedRect",
    ()=>RotatedRect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
class RotatedRect extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'rotatedrect';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                },
                {
                    role: 'w',
                    free: 'both'
                }
            ]
        };
    }
    px(proj, i) {
        const a = this.anchors[i];
        if (!a) return null;
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? null : [
            proj.xOf(a.time),
            y
        ];
    }
    geometry(proj) {
        const A = this.px(proj, 0);
        const B = this.px(proj, 1);
        if (!A || !B) return null;
        const W = this.px(proj, 2);
        if (!W || this.anchors.length < 3) {
            return {
                segments: [
                    [
                        A[0],
                        A[1],
                        B[0],
                        B[1]
                    ]
                ],
                fill: null
            }; // baseline only (placing)
        }
        const vx = B[0] - A[0];
        const vy = B[1] - A[1];
        const len = Math.hypot(vx, vy);
        if (len < 1e-6) return {
            segments: [
                [
                    A[0],
                    A[1],
                    B[0],
                    B[1]
                ]
            ],
            fill: null
        };
        const nx = -vy / len; // unit perpendicular
        const ny = vx / len;
        const h = (W[0] - A[0]) * nx + (W[1] - A[1]) * ny; // signed perpendicular distance of the width point
        const ox = nx * h;
        const oy = ny * h;
        const C0 = A;
        const C1 = B;
        const C2 = [
            B[0] + ox,
            B[1] + oy
        ];
        const C3 = [
            A[0] + ox,
            A[1] + oy
        ];
        return {
            segments: [
                [
                    C0[0],
                    C0[1],
                    C1[0],
                    C1[1]
                ],
                [
                    C1[0],
                    C1[1],
                    C2[0],
                    C2[1]
                ],
                [
                    C2[0],
                    C2[1],
                    C3[0],
                    C3[1]
                ],
                [
                    C3[0],
                    C3[1],
                    C0[0],
                    C0[1]
                ]
            ],
            fill: [
                C0,
                C1,
                C2,
                C3
            ]
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((a)=>a.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"].map((f)=>({
                        ...f,
                        label: f.label.replace('Line', 'Border')
                    })),
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/SchiffPitchfork.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SchiffPitchfork",
    ()=>SchiffPitchfork
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PitchforkVariant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PitchforkVariant.ts [app-client] (ecmascript)");
;
class SchiffPitchfork extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PitchforkVariant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PitchforkVariant"] {
    type = 'schiffpitchfork';
    medianStart(p0, p1) {
        return {
            time: p0.time,
            price: (p0.price + p1.price) / 2
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SegmentDrawing",
    ()=>SegmentDrawing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
class SegmentDrawing extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    hitTest(px, py, proj, tol) {
        const g = this.geometry(proj);
        if (!g) return false;
        if (this.style.fillColor && g.fill && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pointInPolygon"])(px, py, g.fill)) return true;
        return g.segments.some((s)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, s[0], s[1], s[2], s[3]) <= tol);
    }
    handlePoints(proj) {
        const pts = [];
        for (const a of this.anchors){
            const y = proj.yOf(a.price, this.paneId);
            if (y == null) return [];
            pts.push([
                proj.xOf(a.time),
                y
            ]);
        }
        return pts;
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const pts = this.handlePoints(proj);
        if (pts.length === 0) return null;
        const xs = pts.map((p)=>p[0]);
        const ys = pts.map((p)=>p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        return {
            x,
            y,
            w: Math.max(...xs) - x,
            h: Math.max(...ys) - y
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Shark.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Shark",
    ()=>Shark
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/HarmonicPattern.ts [app-client] (ecmascript)");
;
class Shark extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$HarmonicPattern$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HarmonicPattern"] {
    type = 'shark';
    patternName() {
        return 'Shark';
    }
    ranges() {
        return {
            ab: {
                min: 0.382,
                max: 0.618
            },
            bc: {
                min: 1.13,
                max: 1.618
            },
            cd: {
                min: 1.618,
                max: 2.24
            },
            ad: {
                min: 0.886,
                max: 1.13
            }
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Signpost.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Signpost",
    ()=>Signpost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/CalloutBase.ts [app-client] (ecmascript)");
;
class Signpost extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$CalloutBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalloutBase"] {
    type = 'signpost';
    defaultLabel() {
        return 'Signpost';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/TextLabel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextLabel",
    ()=>TextLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/style.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PinnedLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PinnedLabel.ts [app-client] (ecmascript)");
;
;
;
class TextLabel extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PinnedLabel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PinnedLabel"] {
    type = 'text';
    constructor(init){
        super(init);
        // Starts empty on purpose: placing one opens an inline editor whose placeholder invites the
        // text, so a seeded literal would only have to be selected and deleted. Large by default —
        // a free-floating annotation is meant to be read at a glance, unlike a label hung on a shape.
        if (!this.text) this.text = {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultText"])(),
            size: 'large'
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ],
            textIsContent: true
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/TrendAngle.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrendAngle",
    ()=>TrendAngle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TwoPointLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/TwoPointLine.ts [app-client] (ecmascript)");
;
class TrendAngle extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$TwoPointLine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TwoPointLine"] {
    type = 'trendangle';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/TrendFibTime.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrendFibTime",
    ()=>TrendFibTime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/FibRatios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/levelPalette.ts [app-client] (ecmascript)");
;
;
const TIME_LEVELS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$levelPalette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fibLevels"])([
    0,
    0.382,
    {
        ratio: 0.5,
        enabled: false
    },
    0.618,
    1,
    1.382,
    1.618,
    2,
    2.382,
    2.618,
    3
]);
class TrendFibTime extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$FibRatios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FibRatios"] {
    type = 'trendfibtime';
    defaultLevels() {
        return TIME_LEVELS;
    }
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                },
                {
                    role: 'p3',
                    free: 'both'
                }
            ]
        };
    }
    entryLines(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        const c = this.anchors[2];
        if (!a || !b || !c) return null;
        const unit = b.time - a.time; // base interval (signed)
        if (Math.abs(unit) < 1e-9) return null;
        const h = proj.height;
        const out = [];
        for (const lv of this.levels){
            if (!lv.enabled) continue;
            const x = proj.xOf(c.time + lv.ratio * unit);
            out.push({
                color: lv.color,
                label: lv.label,
                x1: x,
                y1: 0,
                x2: x,
                y2: h,
                numberText: String(lv.ratio),
                numberX: x,
                numberY: 9,
                numberAlign: 'center',
                labelX: x,
                labelY: 24
            });
        }
        return out;
    }
    priceRange() {
        return null; // vertical lines impose no price constraint
    }
    timeExtent() {
        return null; // the projected lines run far forward → never time-cull
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/TrendLine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrendLine",
    ()=>TrendLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class TrendLine extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'trendline';
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                }
            ]
        };
    }
    pixels(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const y1 = proj.yOf(a.price, this.paneId);
        const y2 = proj.yOf(b.price, this.paneId);
        if (y1 == null || y2 == null) return null;
        return [
            proj.xOf(a.time),
            y1,
            proj.xOf(b.time),
            y2
        ];
    }
    hitTest(px, py, proj, tol) {
        const p = this.pixels(proj);
        return p != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, p[0], p[1], p[2], p[3]) <= tol;
    }
    handlePoints(proj) {
        const p = this.pixels(proj);
        return p ? [
            [
                p[0],
                p[1]
            ],
            [
                p[2],
                p[3]
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const p = this.pixels(proj);
        if (!p) return null;
        const x = Math.min(p[0], p[2]);
        const y = Math.min(p[1], p[3]);
        return {
            x,
            y,
            w: Math.abs(p[2] - p[0]),
            h: Math.abs(p[3] - p[1])
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                {
                    path: 'style.arrowRight',
                    label: 'Arrow',
                    kind: 'boolean',
                    group: 'line'
                },
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/Triangle.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Triangle",
    ()=>Triangle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/SegmentDrawing.ts [app-client] (ecmascript)");
;
;
class Triangle extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$SegmentDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SegmentDrawing"] {
    type = 'triangle';
    anchorSchema() {
        return {
            min: 3,
            max: 3,
            slots: [
                {
                    role: 'v1',
                    free: 'both'
                },
                {
                    role: 'v2',
                    free: 'both'
                },
                {
                    role: 'v3',
                    free: 'both'
                }
            ]
        };
    }
    geometry(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const px = (p)=>{
            const y = proj.yOf(p.price, this.paneId);
            return y == null ? null : [
                proj.xOf(p.time),
                y
            ];
        };
        const A = px(a);
        const B = px(b);
        if (!A || !B) return null;
        const c = this.anchors[2];
        if (!c) return {
            segments: [
                [
                    A[0],
                    A[1],
                    B[0],
                    B[1]
                ]
            ],
            fill: null
        }; // first edge only (placing)
        const C = px(c);
        if (!C) return null;
        return {
            segments: [
                [
                    A[0],
                    A[1],
                    B[0],
                    B[1]
                ],
                [
                    B[0],
                    B[1],
                    C[0],
                    C[1]
                ],
                [
                    C[0],
                    C[1],
                    A[0],
                    A[1]
                ]
            ],
            fill: [
                A,
                B,
                C
            ]
        };
    }
    priceRange() {
        if (this.anchors.length === 0) return null;
        const ps = this.anchors.map((p)=>p.price);
        return {
            min: Math.min(...ps),
            max: Math.max(...ps)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FILL_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/TwoPointLine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TwoPointLine",
    ()=>TwoPointLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class TwoPointLine extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    anchorSchema() {
        return {
            min: 2,
            max: 2,
            slots: [
                {
                    role: 'p1',
                    free: 'both'
                },
                {
                    role: 'p2',
                    free: 'both'
                }
            ]
        };
    }
    pixels(proj) {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        const y1 = proj.yOf(a.price, this.paneId);
        const y2 = proj.yOf(b.price, this.paneId);
        if (y1 == null || y2 == null) return null;
        return [
            proj.xOf(a.time),
            y1,
            proj.xOf(b.time),
            y2
        ];
    }
    hitTest(px, py, proj, tol) {
        const p = this.pixels(proj);
        return p != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["distToSegment"])(px, py, p[0], p[1], p[2], p[3]) <= tol;
    }
    handlePoints(proj) {
        const p = this.pixels(proj);
        return p ? [
            [
                p[0],
                p[1]
            ],
            [
                p[2],
                p[3]
            ]
        ] : [];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const p = this.pixels(proj);
        if (!p) return null;
        return {
            x: Math.min(p[0], p[2]),
            y: Math.min(p[1], p[3]),
            w: Math.abs(p[2] - p[0]),
            h: Math.abs(p[3] - p[1])
        };
    }
    priceRange() {
        const a = this.anchors[0];
        const b = this.anchors[1];
        if (!a || !b) return null;
        return {
            min: Math.min(a.price, b.price),
            max: Math.max(a.price, b.price)
        };
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/VerticalLine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VerticalLine",
    ()=>VerticalLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/Drawing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/hittest.ts [app-client] (ecmascript)");
;
;
;
class VerticalLine extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$Drawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawing"] {
    type = 'vline';
    anchorSchema() {
        // One anchor; only its time (x) matters — its price pins the drag handle.
        return {
            min: 1,
            max: 1,
            slots: [
                {
                    role: 'p',
                    free: 'x'
                }
            ]
        };
    }
    x(proj) {
        const a = this.anchors[0];
        return a ? proj.xOf(a.time) : null;
    }
    hitTest(px, _py, proj, tol) {
        const x = this.x(proj);
        return x != null && Math.abs(px - x) <= tol; // ignores y → spans full height
    }
    handlePoints(proj) {
        const a = this.anchors[0];
        const x = this.x(proj);
        if (!a || x == null) return [];
        const y = proj.yOf(a.price, this.paneId);
        return y == null ? [] : [
            [
                x,
                y
            ]
        ];
    }
    hitHandle(px, py, proj, tol) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$hittest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleAt"])(px, py, this.handlePoints(proj), tol + 3);
    }
    bounds(proj) {
        const x = this.x(proj);
        return x == null ? null : {
            x: x - 1,
            y: 0,
            w: 2,
            h: proj.height
        };
    }
    priceRange() {
        return null; // a vertical line doesn't constrain the price axis
    }
    schema() {
        return {
            fields: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LINE_FIELDS"],
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_FIELDS"]
            ]
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/core/drawings/types/XABCD.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "XABCD",
    ()=>XABCD
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/types/PatternDrawing.ts [app-client] (ecmascript)");
;
class XABCD extends __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$types$2f$PatternDrawing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PatternDrawing"] {
    type = 'xabcd';
    vertexLabels() {
        return [
            'X',
            'A',
            'B',
            'C',
            'D'
        ];
    }
    legRatios() {
        return true;
    }
    fillTriangles() {
        return [
            [
                0,
                1,
                2
            ],
            [
                2,
                3,
                4
            ]
        ];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_charting_core_drawings_118nrlw._.js.map