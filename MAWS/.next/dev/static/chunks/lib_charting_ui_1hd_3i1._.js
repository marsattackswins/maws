(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/charting/ui/components/callout-bubble/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Callout-bubble CONTROLLER — the declarative vocabulary (and its pure projection
// rules) for a small tinted status bubble whose click deploys a panel of text and
// action buttons. No DOM: the vanilla view (or a future React one) projects these.
/** One block of a deployed callout panel — plain text, or a button running a caller action. */ __turbopack_context__.s([
    "calloutPanelRows",
    ()=>calloutPanelRows,
    "closesPanel",
    ()=>closesPanel
]);
function closesPanel(item) {
    return item.close !== false;
}
function calloutPanelRows(items) {
    const rows = [];
    for (const item of items){
        if (item.type === 'text') {
            rows.push({
                type: 'text',
                text: item.text
            });
            continue;
        }
        const last = rows[rows.length - 1];
        if (last && last.type === 'buttons') last.buttons.push(item);
        else rows.push({
            type: 'buttons',
            buttons: [
                item
            ]
        });
    }
    return rows;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/callout-bubble/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/callout-bubble/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/callout-bubble/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/callout-bubble/styles.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/callout-bubble/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CALLOUT_CSS",
    ()=>CALLOUT_CSS,
    "CALLOUT_STYLE_ID",
    ()=>CALLOUT_STYLE_ID
]);
const CALLOUT_STYLE_ID = 'vela-ui-callout-bubble';
const CALLOUT_CSS = `
.vela-callout {
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    flex: none;
    line-height: 0;
    box-sizing: border-box;
    cursor: default;
    user-select: none;
    -webkit-user-select: none;
}
.vela-callout[role='button'] { cursor: pointer; }
.vela-callout svg { display: block; }
/* The deployed panel — carries the kit's elevated-card look itself (the popover
   shell is bare positioning chrome). */
.vela-callout-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    max-width: 280px;
    box-sizing: border-box;
    background: var(--vela-surface-elev);
    border: 1px solid var(--vela-border-strong);
    border-radius: 6px;
    box-shadow: var(--vela-shadow);
    color: var(--vela-fg);
    font: var(--vela-font-size-md) var(--vela-font);
}
.vela-callout-title { font-weight: 600; color: var(--vela-fg-bright); }
.vela-callout-text { color: var(--vela-fg-muted); line-height: 1.45; white-space: pre-line; }
.vela-callout-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.vela-callout-btn {
    cursor: pointer;
    height: 26px;
    padding: 0 10px;
    border-radius: 5px;
    border: 1px solid var(--vela-border);
    background: transparent;
    color: var(--vela-fg);
    font-size: var(--vela-font-size-md);
    font-family: inherit;
    transition: background var(--vela-dur-fast) ease, color var(--vela-dur-fast) ease, opacity var(--vela-dur-fast) ease, border-color var(--vela-dur-fast) ease;
}
.vela-callout-btn:hover { background: var(--vela-hover); color: var(--vela-fg-bright); border-color: var(--vela-fg-muted); }
.vela-callout-btn-primary { border-color: var(--vela-selected-bg); background: var(--vela-selected-bg); color: var(--vela-selected-fg); }
.vela-callout-btn-primary:hover { background: var(--vela-selected-bg); color: var(--vela-selected-fg); opacity: 0.85; border-color: var(--vela-selected-bg); }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/callout-bubble/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Callout-bubble VIEW — a small tinted circle with a centered icon; when a panel is
// declared, clicking it deploys a kit Popover of text and action buttons (below the
// bubble, flipping above near the bottom edge). Content is DATA (see the controller's
// descriptors), so contribution seams can route it without ever handing over DOM.
// The bubble is a single element the caller places and decorates (tooltips stay the
// caller's: renderer chrome attaches its bare-chart tips, widget chrome the kit's).
__turbopack_context__.s([
    "CalloutBubble",
    ()=>CalloutBubble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/icons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/callout-bubble/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/callout-bubble/styles.ts [app-client] (ecmascript)");
;
;
;
;
;
class CalloutBubble {
    el;
    spec;
    size;
    host;
    theme;
    boundary;
    pop = null;
    constructor(opts){
        this.spec = {
            icon: opts.icon,
            background: opts.background,
            label: opts.label
        };
        if (opts.color !== undefined) this.spec.color = opts.color;
        if (opts.panel !== undefined) this.spec.panel = opts.panel;
        this.size = opts.size ?? 16;
        this.host = opts.host;
        this.theme = opts.theme;
        this.boundary = opts.boundary;
        const doc = (opts.host ?? document.body).ownerDocument;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CALLOUT_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CALLOUT_CSS"], doc);
        this.el = doc.createElement('span');
        this.el.className = 'vela-callout';
        this.el.style.width = `${this.size}px`;
        this.el.style.height = `${this.size}px`;
        // A click's job is the panel — never the row/chip underneath (selection,
        // settings dialogs); a dblclick on the bubble must stay the bubble's too.
        this.el.addEventListener('click', (e)=>{
            if (!this.spec.panel) return;
            e.stopPropagation();
            this.toggle();
        });
        this.el.addEventListener('dblclick', (e)=>{
            if (this.spec.panel) e.stopPropagation();
        });
        this.el.addEventListener('keydown', (e)=>{
            if (!this.spec.panel || e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            this.toggle();
        });
        this.dress();
    }
    /** Re-dress the bubble (a status change: new icon, tint, label, panel). */ set(spec) {
        this.spec = {
            ...this.spec,
            ...spec
        };
        // The open panel (if any) belongs to the previous state — retire it.
        if ('panel' in spec) this.pop?.hide();
        this.dress();
    }
    /** Whether the deployed panel is currently open. */ get open() {
        return this.pop?.open ?? false;
    }
    /** Close the deployed panel, if any. The bubble itself stays. */ hidePanel() {
        this.pop?.hide();
    }
    destroy() {
        this.pop?.destroy();
        this.pop = null;
        this.el.remove();
    }
    dress() {
        const clickable = this.spec.panel !== undefined;
        this.el.style.background = this.spec.background;
        this.el.style.color = this.spec.color ?? '';
        this.el.innerHTML = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconAt"])(this.spec.icon, this.size - 4);
        this.el.setAttribute('aria-label', this.spec.label);
        if (clickable) {
            this.el.setAttribute('role', 'button');
            this.el.tabIndex = 0;
        } else {
            this.el.removeAttribute('role');
            this.el.removeAttribute('tabindex');
        }
    }
    toggle() {
        if (this.pop?.open) {
            this.pop.hide();
            return;
        }
        const panel = this.spec.panel;
        if (!panel) return;
        // A fresh popover per deploy: the content projects the CURRENT panel data,
        // and the theme is read at open time (never a stale capture).
        this.pop?.destroy();
        this.pop = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"]({
            trigger: this.el,
            gap: 6,
            content: (body)=>this.buildPanel(body, panel),
            ...this.host ? {
                host: this.host
            } : {},
            ...this.theme ? {
                theme: this.theme()
            } : {},
            ...this.boundary ? {
                boundary: this.boundary
            } : {}
        });
        this.pop.show();
    }
    buildPanel(body, panel) {
        const doc = body.ownerDocument;
        const root = doc.createElement('div');
        root.className = 'vela-callout-panel';
        if (panel.title) {
            const title = doc.createElement('div');
            title.className = 'vela-callout-title';
            title.textContent = panel.title;
            root.appendChild(title);
        }
        for (const row of (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calloutPanelRows"])(panel.items)){
            if (row.type === 'text') {
                const text = doc.createElement('div');
                text.className = 'vela-callout-text';
                text.textContent = row.text;
                root.appendChild(text);
                continue;
            }
            const actions = doc.createElement('div');
            actions.className = 'vela-callout-actions';
            for (const item of row.buttons){
                const btn = doc.createElement('button');
                btn.type = 'button';
                btn.className = 'vela-callout-btn' + (item.primary ? ' vela-callout-btn-primary' : '');
                btn.textContent = item.label;
                btn.addEventListener('click', ()=>{
                    item.run();
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$callout$2d$bubble$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closesPanel"])(item)) this.pop?.hide();
                });
                actions.appendChild(btn);
            }
            root.appendChild(actions);
        }
        body.appendChild(root);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/color-picker/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blendOver",
    ()=>blendOver,
    "buildPalette",
    ()=>buildPalette,
    "colorPickerController",
    ()=>colorPickerController,
    "combineColor",
    ()=>combineColor,
    "hslHex",
    ()=>hslHex,
    "splitColor",
    ()=>splitColor,
    "transparencyChecker",
    ()=>transparencyChecker
]);
// Color-picker CONTROLLER — color math only. No DOM.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
;
function splitColor(color) {
    const s = String(color ?? '').trim();
    let m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(s);
    if (m) return {
        hex6: `#${m[1].toLowerCase()}`,
        alpha: m[2] ? parseInt(m[2], 16) / 255 : 1
    };
    m = /^#([0-9a-f]{3})$/i.exec(s);
    if (m) {
        const h = m[1].toLowerCase();
        return {
            hex6: `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`,
            alpha: 1
        };
    }
    const rgba = /^rgba?\(([^)]+)\)/i.exec(s);
    if (rgba) {
        const p = rgba[1].split(',').map((v)=>v.trim());
        const hx = (n)=>Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
        const a = p[3] != null ? Math.max(0, Math.min(1, parseFloat(p[3]))) : 1;
        return {
            hex6: `#${hx(parseInt(p[0] ?? '0', 10))}${hx(parseInt(p[1] ?? '0', 10))}${hx(parseInt(p[2] ?? '0', 10))}`,
            alpha: a
        };
    }
    return {
        hex6: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT_BRIGHT"],
        alpha: 1
    };
}
function combineColor(hex6, alpha) {
    const a = Math.max(0, Math.min(1, alpha));
    if (a >= 0.999) return hex6;
    return `${hex6}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
}
function blendOver(fg, bg, alpha) {
    const rgb = (c)=>{
        const n = parseInt(splitColor(c).hex6.slice(1), 16);
        return [
            n >> 16 & 255,
            n >> 8 & 255,
            n & 255
        ];
    };
    const [fr, fgc, fb] = rgb(fg);
    const [br, bgc, bb] = rgb(bg);
    const a = Math.max(0, Math.min(1, alpha));
    const h = (n)=>Math.round(n).toString(16).padStart(2, '0');
    return `#${h(fr * a + br * (1 - a))}${h(fgc * a + bgc * (1 - a))}${h(fb * a + bb * (1 - a))}`;
}
function hslHex(h, s, l) {
    const sn = s / 100;
    const ln = l / 100;
    const k = (n)=>(n + h / 30) % 12;
    const a = sn * Math.min(ln, 1 - ln);
    const f = (n)=>ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const to = (x)=>Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}
function buildPalette() {
    const grays = [
        100,
        90,
        80,
        68,
        56,
        45,
        35,
        25,
        14,
        0
    ].map((l)=>hslHex(0, 0, l));
    const hues = [
        4,
        28,
        50,
        96,
        140,
        174,
        200,
        224,
        270,
        322
    ];
    const levels = [
        [
            82,
            56
        ],
        [
            58,
            84
        ],
        [
            62,
            74
        ],
        [
            66,
            62
        ],
        [
            70,
            50
        ],
        [
            64,
            39
        ],
        [
            54,
            29
        ]
    ];
    return [
        grays,
        ...levels.map(([s, l])=>hues.map((h)=>hslHex(h, s, l)))
    ];
}
function transparencyChecker(size) {
    return `repeating-conic-gradient(#9aa0a6 0% 25%, #d3d6da 0% 50%) 0 0 / ${size}px ${size}px`; // palette-exempt: these grays stand for transparency itself
}
function colorPickerController(opts = {}) {
    const parsed = splitColor(opts.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT_BRIGHT"]);
    let hex6 = parsed.hex6;
    let alpha = parsed.alpha;
    return {
        get hex6 () {
            return hex6;
        },
        get alpha () {
            return alpha;
        },
        combined () {
            return combineColor(hex6, alpha);
        },
        setHex (hex) {
            hex6 = splitColor(hex).hex6;
        },
        setAlpha (a) {
            alpha = Math.max(0, Math.min(1, a));
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/color-picker/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/color-picker/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/color-picker/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/color-picker/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COLOR_CSS",
    ()=>COLOR_CSS,
    "COLOR_STYLE_ID",
    ()=>COLOR_STYLE_ID
]);
const COLOR_STYLE_ID = 'vela-ui-color';
const COLOR_CSS = `
.vela-color-field{width:24px;height:24px;padding:2px;border:1px solid var(--vela-border);border-radius:0;background:var(--vela-surface-sunken);cursor:pointer;display:inline-flex;flex:none;}
.vela-color-field:hover{border-color:var(--vela-fg-muted);}
.vela-color-field-swatch{display:block;width:100%;height:100%;border-radius:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,0.25);}
.vela-color-field-circle{width:26px;height:26px;padding:3px;border:1px solid var(--vela-border-strong);border-radius:4px;background:transparent;overflow:hidden;}
.vela-color-field-circle .vela-color-field-swatch{border-radius:2px;box-shadow:none;}
.vela-color-field-pop{background:var(--vela-surface-overlay);border:1px solid var(--vela-border);border-radius:var(--vela-radius-lg);box-shadow:var(--vela-shadow);padding:10px;}
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/color-picker/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Color-picker VIEW — swatch grid + recents + opacity slider, plus the field trigger.
__turbopack_context__.s([
    "ColorField",
    ()=>ColorField,
    "buildColorPicker",
    ()=>buildColorPicker,
    "closeColorPopover",
    ()=>closeColorPopover,
    "colorField",
    ()=>colorField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/palette.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/color-picker/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/color-picker/styles.ts [app-client] (ecmascript)");
;
;
;
;
;
const PALETTE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildPalette"])();
const CHECKER = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transparencyChecker"])(10);
const FIELD_CHECKER = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transparencyChecker"])(8);
/** Session-shared recently-picked colors (most-recent first). */ const recents = [
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACCENT"],
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BULLISH"],
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BEARISH"],
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARNING"],
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$palette$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEUTRAL"]
];
function addRecent(hex6) {
    const i = recents.findIndex((c)=>c.toLowerCase() === hex6.toLowerCase());
    if (i >= 0) recents.splice(i, 1);
    recents.unshift(hex6);
    if (recents.length > 10) recents.length = 10;
}
function buildColorPicker(color, theme, onChange, options = {}) {
    const commit = options.commit ?? 'live';
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitColor"])(color);
    let curHex = parsed.hex6;
    let curAlpha = parsed.alpha;
    const root = document.createElement('div');
    root.style.cssText = 'display:flex;flex-direction:column;gap:9px;width:236px;';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(10,1fr);gap:4px;';
    const swatches = [];
    for (const row of PALETTE){
        for (const c of row){
            const sw = document.createElement('button');
            sw.type = 'button';
            sw.dataset.c = c;
            sw.style.cssText = `width:100%;aspect-ratio:1;border-radius:4px;border:none;cursor:pointer;background:${c};padding:0;`;
            sw.addEventListener('click', (e)=>{
                e.stopPropagation();
                pickHex(c);
            });
            grid.appendChild(sw);
            swatches.push(sw);
        }
    }
    const paintSelection = ()=>{
        for (const sw of swatches){
            const on = (sw.dataset.c ?? '').toLowerCase() === curHex.toLowerCase();
            sw.style.outline = on ? `2px solid ${theme.textColor}` : 'none';
            sw.style.outlineOffset = '2px';
            sw.style.zIndex = on ? '1' : '';
            sw.style.position = on ? 'relative' : '';
        }
    };
    const recentRow = document.createElement('div');
    recentRow.style.cssText = 'display:flex;align-items:center;gap:5px;flex-wrap:wrap;border-top:1px solid var(--vela-border);padding-top:9px;';
    // Swatches get their own wrapper so re-rendering them never detaches the native
    // color input — the browser closes its chooser the moment its input leaves the DOM.
    const recentSwatches = document.createElement('div');
    recentSwatches.style.cssText = 'display:contents;';
    const add = document.createElement('label');
    add.style.cssText = `width:17px;height:17px;border-radius:var(--vela-radius-sm);border:1px dashed var(--vela-border-strong);cursor:pointer;display:flex;align-items:center;justify-content:center;color:${theme.textColor};font:14px ${theme.fontFamily};position:relative;`;
    add.textContent = '+';
    const customInput = document.createElement('input');
    customInput.type = 'color';
    customInput.value = curHex;
    customInput.style.cssText = 'position:absolute;inset:0;opacity:0;cursor:pointer;';
    // `input` streams while the chooser is open (preview); `change` is the committed pick.
    customInput.addEventListener('input', ()=>previewHex(customInput.value));
    customInput.addEventListener('change', ()=>pickHex(customInput.value, true));
    add.appendChild(customInput);
    recentRow.append(recentSwatches, add);
    const renderRecents = ()=>{
        recentSwatches.replaceChildren();
        for (const c of recents){
            const sw = document.createElement('button');
            sw.type = 'button';
            sw.style.cssText = `width:17px;height:17px;border-radius:var(--vela-radius-sm);border:1px solid var(--vela-border);cursor:pointer;background:${c};padding:0;`;
            sw.addEventListener('click', (e)=>{
                e.stopPropagation();
                pickHex(c);
            });
            recentSwatches.appendChild(sw);
        }
    };
    const opLabel = document.createElement('div');
    opLabel.textContent = 'Opacity';
    opLabel.style.cssText = `font:11px ${theme.fontFamily};color:var(--vela-fg-muted);`;
    const opRow = document.createElement('div');
    opRow.style.cssText = 'display:flex;align-items:center;gap:10px;';
    const track = document.createElement('div');
    track.style.cssText = 'flex:1;position:relative;height:13px;border-radius:7px;cursor:pointer;';
    const knob = document.createElement('div');
    knob.style.cssText = 'position:absolute;top:50%;width:15px;height:15px;border-radius:50%;background:var(--vela-selected-bg);box-shadow:0 1px 3px rgba(0,0,0,0.55);transform:translate(-50%,-50%);pointer-events:none;';
    track.appendChild(knob);
    const pctBox = document.createElement('input');
    pctBox.type = 'text';
    pctBox.inputMode = 'numeric';
    pctBox.title = 'Opacity (%)';
    pctBox.style.cssText = `width:46px;box-sizing:border-box;text-align:center;font:var(--vela-font-size-md) ${theme.fontFamily};color:var(--vela-fg);background:transparent;border:1px solid var(--vela-border);border-radius:5px;padding:3px 4px;outline:none;`;
    pctBox.addEventListener('focus', ()=>{
        pctBox.style.borderColor = 'var(--vela-border-strong)';
        pctBox.select();
    });
    opRow.append(track, pctBox);
    const paintOpacity = ()=>{
        track.style.background = `linear-gradient(to right, ${curHex}00, ${curHex}ff), ${CHECKER}`;
        knob.style.left = `${curAlpha * 100}%`;
        pctBox.value = `${Math.round(curAlpha * 100)}%`;
    };
    // A typed value is one discrete edit, so it commits once under either `commit` policy.
    // Unparseable input snaps back to the current opacity.
    const commitTyped = ()=>{
        pctBox.style.borderColor = 'var(--vela-border)';
        const n = parseFloat(pctBox.value.replace('%', ''));
        if (Number.isFinite(n)) {
            const next = Math.max(0, Math.min(100, n)) / 100;
            if (Math.round(next * 100) !== Math.round(curAlpha * 100)) {
                curAlpha = next;
                paintOpacity();
                emit();
                return;
            }
        }
        paintOpacity();
    };
    pctBox.addEventListener('change', commitTyped);
    pctBox.addEventListener('blur', ()=>{
        // `change` does not fire when the text is unchanged; still restore the "%" readout.
        pctBox.style.borderColor = 'var(--vela-border)';
        paintOpacity();
    });
    pctBox.addEventListener('keydown', (e)=>{
        // Typing must not reach chart/dialog shortcuts; Escape stays with the popover.
        if (e.key === 'Escape') return;
        e.stopPropagation();
        if (e.key === 'Enter') {
            e.preventDefault();
            commitTyped();
            pctBox.blur();
        }
    });
    // The drag always previews (knob, readout, gradient); whether each move also COMMITS is
    // the `commit` option — see {@link ColorCommit}.
    let dragging = false;
    const onDrag = (clientX)=>{
        const r = track.getBoundingClientRect();
        curAlpha = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        paintOpacity();
        if (commit === 'live') emit();
    };
    const endDrag = ()=>{
        if (!dragging) return;
        dragging = false;
        if (commit === 'release') emit();
    };
    track.addEventListener('pointerdown', (e)=>{
        e.stopPropagation();
        dragging = true;
        track.setPointerCapture(e.pointerId);
        onDrag(e.clientX);
    });
    track.addEventListener('pointermove', (e)=>{
        if (dragging) onDrag(e.clientX);
    });
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    function emit() {
        onChange((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["combineColor"])(curHex, curAlpha));
    }
    function previewHex(hex) {
        curHex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitColor"])(hex).hex6;
        paintSelection();
        paintOpacity();
        emit();
    }
    function pickHex(hex, custom = false) {
        previewHex(hex);
        addRecent(curHex);
        customInput.value = curHex;
        if (custom) renderRecents();
    }
    renderRecents();
    paintSelection();
    paintOpacity();
    root.append(grid, recentRow, opLabel, opRow);
    return root;
}
function colorField(theme, getVal, onVal, opts) {
    return new ColorField({
        theme,
        getVal,
        onVal,
        shape: opts?.shape,
        id: opts?.id,
        popover: opts?.popover,
        commit: opts?.commit
    }).el;
}
class ColorField {
    el;
    swatch;
    getVal;
    onVal;
    theme;
    popoverOpts;
    commit;
    constructor(opts){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLOR_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLOR_CSS"], document);
        this.theme = opts.theme;
        this.getVal = opts.getVal;
        this.onVal = opts.onVal;
        this.popoverOpts = opts.popover;
        this.commit = opts.commit;
        const trigger = document.createElement('button');
        trigger.type = 'button';
        if (opts.id) trigger.id = opts.id;
        trigger.className = opts.shape === 'circle' ? 'vela-color-field vela-color-field-circle' : 'vela-color-field';
        const swatch = document.createElement('span');
        swatch.className = 'vela-color-field-swatch';
        trigger.appendChild(swatch);
        this.el = trigger;
        this.swatch = swatch;
        this.paint();
        trigger.addEventListener('vela-sync', ()=>this.paint());
        // Suppress the default mousedown focus: when this press outside-dismisses an open
        // popover, Chrome's focus action can scroll the dialog body under the pointer.
        trigger.addEventListener('pointerdown', (e)=>{
            e.preventDefault();
            trigger.focus({
                preventScroll: true
            });
        });
        trigger.addEventListener('click', (e)=>{
            e.stopPropagation();
            this.toggle();
        });
    }
    paint() {
        const v = this.getVal();
        this.swatch.style.background = `linear-gradient(${v}, ${v}), ${FIELD_CHECKER}`;
    }
    toggle() {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openPopoverTrigger"])() === this.el) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
            return;
        }
        const pop = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"]({
            trigger: this.el,
            theme: this.theme,
            align: this.popoverOpts?.align ?? 'end',
            gap: this.popoverOpts?.gap ?? 6,
            host: this.popoverOpts?.host,
            position: this.popoverOpts?.position,
            boundary: this.popoverOpts?.boundary,
            zIndex: this.popoverOpts?.zIndex,
            className: 'vela-color-field-pop',
            content: buildColorPicker(this.getVal(), this.theme, (val)=>{
                this.onVal(val);
                this.paint();
            }, {
                commit: this.commit
            })
        });
        pop.show();
    }
}
function closeColorPopover() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/date-picker/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// DatePicker CONTROLLER — the calendar's state, no DOM. Three panels: the days of a month,
// the twelve months of a year, and a decade of years. The header month and year switch to
// their panel; picking a year leads to its months and picking a month back to its days.
// Dates travel as local `YYYY-MM-DD` strings.
__turbopack_context__.s([
    "MONTH_LABELS",
    ()=>MONTH_LABELS,
    "WEEKDAY_LABELS",
    ()=>WEEKDAY_LABELS,
    "datePickerController",
    ()=>datePickerController,
    "isoDate",
    ()=>isoDate,
    "normalizeDateInput",
    ()=>normalizeDateInput
]);
const MONTH_LABELS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const MONTH_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
const WEEKDAY_LABELS = [
    'Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa'
];
function isoDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function normalizeDateInput(raw) {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw.trim());
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return isoDate(dt);
}
function parseIsoDate(raw) {
    const iso = raw ? normalizeDateInput(raw) : null;
    if (!iso) return null;
    const [y, mo, d] = iso.split('-').map(Number);
    return new Date(y, mo - 1, d);
}
function datePickerController(opts = {}) {
    const today = opts.today ?? new Date();
    let selected = parseIsoDate(opts.value);
    let year = selected?.getFullYear() ?? today.getFullYear();
    let month = selected?.getMonth() ?? today.getMonth();
    let panel = 'date';
    const decade = ()=>Math.floor(year / 10) * 10;
    return {
        get panel () {
            return panel;
        },
        get year () {
            return year;
        },
        get month () {
            return month;
        },
        get value () {
            return selected ? isoDate(selected) : null;
        },
        header () {
            return {
                month: MONTH_LABELS[month] ?? '',
                monthVisible: panel === 'date',
                year: panel === 'year' ? `${decade()}-${decade() + 9}` : String(year),
                yearDisabled: panel === 'year'
            };
        },
        navLabels () {
            if (panel === 'date') return {
                prev: 'Previous month',
                next: 'Next month'
            };
            if (panel === 'month') return {
                prev: 'Previous year',
                next: 'Next year'
            };
            return {
                prev: 'Previous decade',
                next: 'Next decade'
            };
        },
        cells () {
            const out = [];
            if (panel === 'date') {
                const startPad = new Date(year, month, 1).getDay();
                const days = new Date(year, month + 1, 0).getDate();
                const todayIso = isoDate(today);
                const selectedIso = selected ? isoDate(selected) : '';
                for(let i = 0; i < startPad; i++)out.push({
                    label: '',
                    value: '',
                    checked: false,
                    today: false,
                    blank: true
                });
                for(let day = 1; day <= days; day++){
                    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    out.push({
                        label: String(day),
                        value: iso,
                        checked: iso === selectedIso,
                        today: iso === todayIso
                    });
                }
                return out;
            }
            if (panel === 'month') {
                for(let m = 0; m < 12; m++){
                    out.push({
                        label: MONTH_SHORT[m] ?? '',
                        value: m,
                        checked: selected?.getFullYear() === year && selected.getMonth() === m,
                        today: today.getFullYear() === year && today.getMonth() === m
                    });
                }
                return out;
            }
            // One padding year on each side, so the decade fills the same 3×4 grid as the months.
            const d = decade();
            for(let y = d - 1; y <= d + 10; y++){
                out.push({
                    label: String(y),
                    value: y,
                    checked: selected?.getFullYear() === y,
                    today: today.getFullYear() === y,
                    outside: y < d || y > d + 9
                });
            }
            return out;
        },
        step (dir) {
            if (panel === 'date') {
                month += dir;
                if (month < 0) {
                    month = 11;
                    year -= 1;
                }
                if (month > 11) {
                    month = 0;
                    year += 1;
                }
            } else {
                year += panel === 'month' ? dir : dir * 10;
            }
        },
        showMonths () {
            panel = 'month';
        },
        showYears () {
            panel = 'year';
        },
        choose (cell) {
            if (cell.blank) return null;
            if (panel === 'date') {
                selected = parseIsoDate(String(cell.value));
                return selected ? isoDate(selected) : null;
            }
            if (panel === 'month') {
                month = Number(cell.value);
                panel = 'date';
                return null;
            }
            year = Number(cell.value);
            panel = 'month';
            return null;
        },
        setValue (value) {
            selected = parseIsoDate(value);
            if (selected) {
                year = selected.getFullYear();
                month = selected.getMonth();
            }
            panel = 'date';
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/date-picker/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/date-picker/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/date-picker/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/date-picker/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// DatePicker styles — the calendar content only; the host (a popover, a panel) owns the
// surface around it (background, border, shadow, padding).
__turbopack_context__.s([
    "DATE_PICKER_CSS",
    ()=>DATE_PICKER_CSS,
    "DATE_PICKER_STYLE_ID",
    ()=>DATE_PICKER_STYLE_ID
]);
const DATE_PICKER_STYLE_ID = 'vela-date-picker-styles';
const DATE_PICKER_CSS = `
.vela-date-picker{color:var(--vela-fg);font:14px var(--vela-font);user-select:none;}
.vela-date-picker [hidden]{display:none !important;}
.vela-date-picker-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}
.vela-date-picker-title{flex:1;display:flex;align-items:center;justify-content:center;gap:2px;min-width:0;}
.vela-date-picker-switch{border:none;background:transparent;color:var(--vela-fg-bright);font:inherit;font-weight:600;font-size:14px;padding:2px 6px;border-radius:4px;cursor:pointer;}
.vela-date-picker-switch:not(:disabled):hover{background:var(--vela-hover);}
.vela-date-picker-switch:disabled{cursor:default;}
.vela-date-picker-nav{width:24px;height:24px;border:none;background:transparent;color:var(--vela-fg-muted);border-radius:4px;padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:14px;}
.vela-date-picker-nav:hover{background:var(--vela-hover);color:var(--vela-fg-bright);}
.vela-date-picker-week,.vela-date-picker-grid{display:grid;grid-template-columns:repeat(7,28px);gap:2px;}
.vela-date-picker-week{margin-bottom:4px;color:var(--vela-fg-muted);font-size:11px;text-align:center;}
.vela-date-picker-week span{line-height:20px;}
.vela-date-picker-blank{width:28px;height:28px;}
.vela-date-picker-day{width:28px;height:28px;border:none;background:transparent;color:inherit;border-radius:4px;padding:0;cursor:pointer;font:inherit;font-size:14px;}
.vela-date-picker-day:hover{background:var(--vela-hover);}
.vela-date-picker-day[data-checked]{background:var(--vela-hover-strong);color:var(--vela-fg-bright);}
.vela-date-picker-day[data-today]:not([data-checked]){box-shadow:inset 0 0 0 1px var(--vela-border-strong);}
.vela-date-picker-cells{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:calc(7 * 28px + 6 * 2px);}
.vela-date-picker-cell{height:36px;border:none;background:transparent;color:inherit;border-radius:4px;padding:0 4px;cursor:pointer;font:inherit;font-size:14px;}
.vela-date-picker-cell:hover{background:var(--vela-hover);}
.vela-date-picker-cell[data-checked]{background:var(--vela-hover-strong);color:var(--vela-fg-bright);}
.vela-date-picker-cell[data-today]:not([data-checked]){box-shadow:inset 0 0 0 1px var(--vela-border-strong);}
.vela-date-picker-cell[data-outside]{opacity:0.45;}
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/date-picker/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatePicker",
    ()=>DatePicker
]);
// DatePicker VIEW — a month calendar with month/year panel switches in its header.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/date-picker/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/date-picker/styles.ts [app-client] (ecmascript)");
;
;
;
;
class DatePicker {
    opts;
    el;
    ctrl;
    prev;
    next;
    monthBtn;
    yearBtn;
    week;
    grid;
    constructor(opts = {}){
        this.opts = opts;
        const doc = document;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DATE_PICKER_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DATE_PICKER_CSS"], doc);
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["datePickerController"])(opts);
        const button = (className)=>{
            const b = doc.createElement('button');
            b.type = 'button';
            b.className = className;
            return b;
        };
        this.prev = button('vela-date-picker-nav');
        this.prev.append((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('chevron-left', doc));
        this.next = button('vela-date-picker-nav');
        this.next.append((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('chevron-right', doc));
        this.monthBtn = button('vela-date-picker-switch');
        this.monthBtn.setAttribute('aria-label', 'Choose month');
        this.yearBtn = button('vela-date-picker-switch');
        this.yearBtn.setAttribute('aria-label', 'Choose year');
        const title = doc.createElement('div');
        title.className = 'vela-date-picker-title';
        title.append(this.monthBtn, this.yearBtn);
        const head = doc.createElement('div');
        head.className = 'vela-date-picker-head';
        head.append(this.prev, title, this.next);
        this.week = doc.createElement('div');
        this.week.className = 'vela-date-picker-week';
        for (const d of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$date$2d$picker$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WEEKDAY_LABELS"]){
            const cell = doc.createElement('span');
            cell.textContent = d;
            this.week.appendChild(cell);
        }
        this.grid = doc.createElement('div');
        // Every control stops propagation: the picker usually sits in a popover whose
        // outside-dismiss must not read a panel switch as a click elsewhere.
        const on = (el, run)=>el.addEventListener('click', (e)=>{
                e.stopPropagation();
                run();
                this.paint();
            });
        on(this.prev, ()=>this.ctrl.step(-1));
        on(this.next, ()=>this.ctrl.step(1));
        on(this.monthBtn, ()=>this.ctrl.showMonths());
        on(this.yearBtn, ()=>this.ctrl.showYears());
        this.el = doc.createElement('div');
        this.el.className = 'vela-date-picker';
        this.el.append(head, this.week, this.grid);
        this.paint();
    }
    get value() {
        return this.ctrl.value;
    }
    /** Rewrite the selection without emitting (the calendar opens on its month). */ setValue(value) {
        this.ctrl.setValue(value);
        this.paint();
    }
    paint() {
        const doc = this.el.ownerDocument;
        const h = this.ctrl.header();
        this.monthBtn.hidden = !h.monthVisible;
        this.monthBtn.textContent = h.month;
        this.yearBtn.textContent = h.year;
        this.yearBtn.disabled = h.yearDisabled;
        const nav = this.ctrl.navLabels();
        this.prev.setAttribute('aria-label', nav.prev);
        this.next.setAttribute('aria-label', nav.next);
        const dates = this.ctrl.panel === 'date';
        this.week.hidden = !dates;
        this.grid.className = dates ? 'vela-date-picker-grid' : 'vela-date-picker-cells';
        this.grid.replaceChildren(...this.ctrl.cells().map((cell)=>this.cellEl(doc, cell, dates)));
    }
    cellEl(doc, cell, dates) {
        if (cell.blank) {
            const blank = doc.createElement('span');
            blank.className = 'vela-date-picker-blank';
            return blank;
        }
        const b = doc.createElement('button');
        b.type = 'button';
        b.className = dates ? 'vela-date-picker-day' : 'vela-date-picker-cell';
        b.textContent = cell.label;
        if (cell.checked) b.dataset.checked = '1';
        if (cell.today) b.dataset.today = '1';
        if (cell.outside) b.dataset.outside = '1';
        b.addEventListener('click', (e)=>{
            e.stopPropagation();
            const picked = this.ctrl.choose(cell);
            if (picked) this.opts.onPick?.(picked);
            else this.paint();
        });
        return b;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/dialog/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dialogController",
    ()=>dialogController
]);
// Dialog CONTROLLER — Zag dialog machine (focus trap, dismiss, ARIA) + option mapping.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$dialog$2f$dist$2f$dialog$2e$machine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/dialog/dist/dialog.machine.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$dialog$2f$dist$2f$dialog$2e$connect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/dialog/dist/dialog.connect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/zag.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$normalize$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/vanilla/dist/normalize-props.mjs [app-client] (ecmascript)");
;
;
function dialogController(opts = {}) {
    return {
        machine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$dialog$2f$dist$2f$dialog$2e$machine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["machine"],
        props: {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nextUid"])('vela-dialog'),
            modal: opts.modal ?? true,
            closeOnEscape: opts.closeOnEscape ?? true,
            closeOnInteractOutside: opts.closeOnInteractOutside ?? false,
            initialFocusEl: opts.initialFocusEl,
            onOpenChange: (d)=>opts.onOpenChange?.(d.open)
        },
        connect: (service)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$dialog$2f$dist$2f$dialog$2e$connect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connect"](service, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$normalize$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeProps"])
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/dialog/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/dialog/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/dialog/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/dialog/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DIALOG_CSS",
    ()=>DIALOG_CSS,
    "DIALOG_STYLE_ID",
    ()=>DIALOG_STYLE_ID
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
;
const DIALOG_STYLE_ID = 'vela-ui-dialog-5';
const DIALOG_CSS = `
.vela-dialog-backdrop {
    position: fixed;
    inset: 0;
    background: var(--vela-backdrop);
    z-index: var(--vela-z-dialog);
}
/* Non-dimming variant: still catches outside clicks, but the page stays readable. */
.vela-dialog-backdrop--clear { background: transparent; }
.vela-dialog-positioner {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 10vh;
    z-index: var(--vela-z-dialog);
}
.vela-dialog-backdrop[data-contained],
.vela-dialog-positioner[data-contained] { position: absolute; }
.vela-dialog-positioner[data-align='center'] {
    align-items: center;
    padding-top: 0;
}
.vela-dialog {
    background: var(--vela-surface);
    color: var(--vela-fg);
    border: 1px solid var(--vela-border-strong);
    border-radius: 10px;
    box-shadow: var(--vela-shadow-dialog);
    font-size: 13px;
    min-width: 300px;
    max-width: min(92vw, 560px);
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    outline: none;
}
.vela-dialog[data-state='open'] { animation: vela-dialog-in var(--vela-dur-med) var(--vela-ease); }
@keyframes vela-dialog-in {
    from { opacity: 0; transform: translateY(6px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
.vela-dialog-header {
    display: flex;
    align-items: center;
    padding: 9px 9px 9px 16px;
    border-bottom: 1px solid var(--vela-border);
    user-select: none;
}
.vela-dialog-title { flex: 1; font-size: 17px; font-weight: 600; letter-spacing: 0.2px; color: var(--vela-fg-bright); }
.vela-dialog-close {
    all: unset;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: var(--vela-fg-muted);
    line-height: 1;
    font-size: 15px;
}
.vela-dialog-close:hover { background: var(--vela-hover); color: var(--vela-fg-bright); }
.vela-dialog-body { padding: var(--vela-space-4); overflow: auto; min-height: 0; flex: 1 1 auto; }
.vela-dialog-body[data-flush] { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
.vela-dialog-footer { flex: 0 0 auto; }
.vela-dialog--settings {
    width: fit-content;
    min-width: min(560px, 94vw);
    max-width: min(720px, 94vw);
    max-height: 70vh;
    font-size: 13px;
    cursor: default;
}
.vela-dialog--form {
    width: fit-content;
    min-width: min(380px, 90%);
    max-width: min(640px, 94%);
    max-height: 82%;
    font-size: 14px;
}
/* Form dialogs (indicator inputs, drawing settings): the tab strip / body owns the
   line under the header, and the footer carries its own top delimiter. */
.vela-dialog--form .vela-dialog-header { align-items: flex-start; padding: 16px 20px 20px; border-bottom: none; }
.vela-dialog--form .vela-dialog-title { font-size: 20px; line-height: 28px; }
.vela-dialog--form .vela-dialog-footer {
    padding: 16px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid var(--vela-border);
}
.vela-dialog-btn {
    cursor: pointer;
    height: 34px;
    padding: 0 11px;
    border-radius: 6px;
    border: 1px solid var(--vela-border-strong);
    background: transparent;
    color: var(--vela-fg);
    font-weight: 400;
    font-size: 14px;
    font-family: inherit;
    transition: background var(--vela-dur-fast) ease, color var(--vela-dur-fast) ease, opacity var(--vela-dur-fast) ease, border-color var(--vela-dur-fast) ease;
}
.vela-dialog-btn:hover { background: var(--vela-hover); color: var(--vela-fg-bright); border-color: var(--vela-fg-muted); }
.vela-dialog-btn-primary { border-color: var(--vela-selected-bg); background: var(--vela-selected-bg); color: var(--vela-selected-fg); }
.vela-dialog-btn-primary:hover { background: var(--vela-selected-bg); color: var(--vela-selected-fg); opacity: 0.85; border-color: var(--vela-selected-bg); }
${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["overlayScrollbarCss"])('.vela-dialog-body')}
/* Scrollers NESTED in a dialog (a flush body's grid, a tab pane) get the same thin
   overlay bars — the two-class selectors below stay overridable by more specific
   per-dialog sheets. */
${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["overlayScrollbarCss"])('.vela-dialog *')}
/* ── mobile chrome: dialogs fill the shell ─────────────────────────────────────────
   Inside a shell in the mobile size class ([data-layout='mobile'] on the widget root,
   which is position:relative) every kit dialog presents fullscreen: desktop cards are
   unusable at phone widths, and the shell's bounds — not the viewport — are the honest
   "screen" for an embedded chart. */
[data-layout='mobile'] .vela-dialog-backdrop { position: absolute; }
[data-layout='mobile'] .vela-dialog-positioner {
    position: absolute;
    padding: 0;
    align-items: stretch;
}
[data-layout='mobile'] .vela-dialog {
    width: 100%;
    min-width: 0;
    max-width: none;
    max-height: none;
    flex: 1 1 auto;
    border: none;
    border-radius: 0;
    transform: none !important; /* a desktop drag offset must not survive the flip */
}
[data-layout='mobile'] .vela-dialog-close { width: 40px; height: 40px; }
[data-layout='mobile'] .vela-dialog-body { padding-bottom: calc(var(--vela-space-4) + env(safe-area-inset-bottom, 0px)); }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/dialog/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog
]);
// Dialog VIEW — backdrop + centered panel with header/body, driven by the Zag dialog
// machine. The body is caller-owned: pass a Node or populate via `body` after creation.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/zag.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/vanilla/dist/spread-props.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/dialog/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/dialog/styles.ts [app-client] (ecmascript)");
;
;
;
;
;
;
class Dialog {
    /** Caller-owned content area — append your form/panel here. */ body;
    panel;
    titleEl;
    positioner;
    backdrop;
    footer;
    handle;
    ctrl;
    constructor(opts = {}){
        const doc = (opts.host ?? document.body).ownerDocument;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DIALOG_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DIALOG_CSS"], doc);
        const host = opts.host ?? doc.body;
        this.backdrop = doc.createElement('div');
        this.backdrop.className = 'vela-dialog-backdrop vela-ui-layer';
        if (opts.dimBackdrop !== true) this.backdrop.classList.add('vela-dialog-backdrop--clear');
        this.positioner = doc.createElement('div');
        this.positioner.className = 'vela-dialog-positioner vela-ui-layer';
        if (opts.contained) {
            this.backdrop.dataset.contained = '';
            this.positioner.dataset.contained = '';
        }
        this.positioner.dataset.align = opts.align ?? 'top';
        this.panel = doc.createElement('div');
        this.panel.className = 'vela-dialog';
        if (opts.className) {
            for (const cls of opts.className.split(/\s+/))if (cls) this.panel.classList.add(cls);
        }
        // Programmatically focusable — the mobile chrome routes the machine's initial
        // focus here (see the controller wiring below).
        this.panel.tabIndex = -1;
        this.panel.addEventListener('keydown', (e)=>{
            if (e.key !== 'Escape') e.stopPropagation();
        });
        const header = doc.createElement('div');
        header.className = 'vela-dialog-header';
        if (opts.draggable) {
            header.style.cursor = 'move';
            let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
            header.addEventListener('pointerdown', (e)=>{
                if (e.target.closest('.vela-dialog-close')) return;
                dragging = true;
                sx = e.clientX - ox;
                sy = e.clientY - oy;
                header.setPointerCapture(e.pointerId);
            });
            header.addEventListener('pointermove', (e)=>{
                if (!dragging) return;
                ox = e.clientX - sx;
                oy = e.clientY - sy;
                this.panel.style.transform = `translate(${ox}px, ${oy}px)`;
            });
            header.addEventListener('pointerup', ()=>dragging = false);
        }
        if (opts.headerStart) header.appendChild(opts.headerStart);
        const title = doc.createElement('div');
        title.className = 'vela-dialog-title';
        title.textContent = opts.title ?? '';
        this.titleEl = title;
        const close = doc.createElement('button');
        close.className = 'vela-dialog-close';
        close.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('close', doc));
        header.append(title, close);
        this.body = doc.createElement('div');
        this.body.className = 'vela-dialog-body';
        if (opts.flush) this.body.dataset.flush = '';
        if (opts.content instanceof Node) this.body.appendChild(opts.content);
        else if (typeof opts.content === 'function') opts.content(this.body);
        this.panel.append(header, this.body);
        if (opts.footer) {
            const foot = doc.createElement('div');
            foot.className = 'vela-dialog-footer';
            if (opts.footer instanceof Node) foot.appendChild(opts.footer);
            else opts.footer(foot);
            this.panel.appendChild(foot);
            this.footer = foot;
        } else {
            this.footer = null;
        }
        this.positioner.appendChild(this.panel);
        host.append(this.backdrop, this.positioner);
        if (opts.closeOnBackdrop) {
            const closeOn = (e)=>{
                if (e.target !== this.backdrop && e.target !== this.positioner) return;
                // A portaled popover (color picker, select list) is logically INSIDE the
                // dialog: the first outside click dismisses it, not the dialog itself.
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPopoverOpen"])() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventDismissedPopover"])(e)) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
                    return;
                }
                this.hide();
            };
            this.backdrop.addEventListener('pointerdown', closeOn);
            this.positioner.addEventListener('pointerdown', closeOn);
        }
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$dialog$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dialogController"])({
            ...opts,
            // Mobile chrome (fullscreen presentation): opening must never land focus on
            // an input — that pops the on-screen keyboard over the just-opened dialog.
            // Focus goes to the panel; a caller that WANTS the keyboard focuses its
            // input explicitly. Desktop keeps the caller's pick, else the machine's
            // first-tabbable default.
            initialFocusEl: ()=>{
                if (this.positioner.closest('[data-layout="mobile"]')) return this.panel;
                return opts.initialFocusEl?.() ?? null;
            }
        });
        const mid = String(this.ctrl.props.id);
        this.handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["runMachine"])(this.ctrl.machine, this.ctrl.props, (service)=>{
            const api = this.ctrl.connect(service);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(this.backdrop, api.getBackdropProps(), mid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(this.positioner, api.getPositionerProps(), mid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(this.panel, api.getContentProps(), mid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(title, api.getTitleProps(), mid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(close, api.getCloseTriggerProps(), mid);
            // Zag dialogs expect CONDITIONAL rendering (their props carry no `hidden`,
            // unlike tooltip/menu) — the view toggles visibility from `api.open` itself.
            this.backdrop.style.display = api.open ? '' : 'none';
            this.positioner.style.display = api.open ? '' : 'none';
        });
    }
    get open() {
        return this.ctrl.connect(this.handle.service).open;
    }
    show() {
        this.ctrl.connect(this.handle.service).setOpen(true);
    }
    hide() {
        this.ctrl.connect(this.handle.service).setOpen(false);
    }
    contains(node) {
        if (node == null) return false;
        if (this.panel.contains(node) || this.backdrop.contains(node) || this.positioner.contains(node)) return true;
        const el = node instanceof Element ? node : node.parentElement;
        // Portaled select lists / color chips / menus live on the document, not in the panel.
        return el?.closest('.vela-popover, .vela-menu') != null;
    }
    destroy() {
        // Exit the open state before stopping so the machine unwinds its open-time
        // effects (focus restore, and the body pointer-events lock of modal dialogs)
        // instead of leaving them behind.
        if (this.open) this.hide();
        this.handle.stop();
        this.backdrop.remove();
        this.positioner.remove();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/field/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Field CONTROLLER — layout math and descriptor types. No DOM.
__turbopack_context__.s([
    "FIELD_GAP_PX",
    ()=>FIELD_GAP_PX,
    "fieldGridColumns",
    ()=>fieldGridColumns
]);
const FIELD_GAP_PX = 16;
function fieldGridColumns(variant, mobile) {
    if (variant === 'inputs') return mobile ? 'minmax(0,1fr) auto' : 'max-content 1fr';
    return mobile ? 'minmax(0,1fr) max-content' : 'max-content max-content';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/field/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/field/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FIELD_CSS",
    ()=>FIELD_CSS,
    "FIELD_STYLE_ID",
    ()=>FIELD_STYLE_ID
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/controller.ts [app-client] (ecmascript)");
;
const FIELD_STYLE_ID = 'vela-ui-field';
const FIELD_CSS = `
.vela-field-grid {
    display: grid;
    align-items: center;
    align-content: start;
    column-gap: ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIELD_GAP_PX"]}px;
    row-gap: ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIELD_GAP_PX"]}px;
}
.vela-field-grid[data-variant='inputs'] { grid-template-columns: max-content 1fr; }
.vela-field-grid[data-variant='inputs'][data-mobile] { grid-template-columns: minmax(0,1fr) auto; }
.vela-field-grid[data-variant='settings'] {
    grid-template-columns: max-content max-content;
    column-gap: 12px;
}
.vela-field-grid[data-variant='settings'][data-mobile] { grid-template-columns: minmax(0,1fr) max-content; }
.vela-field-row { display: contents; }
.vela-field-span { grid-column: 1 / -1; }
.vela-field-label {
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
}
.vela-field-label[data-size='sm'] { font-size: inherit; opacity: 0.85; }
/* Titles are fully inert: spans, not label[for] — native labels propagate :hover and
   clicks onto their control, and both belong to the input alone. */
.vela-field-cell { display: flex; align-items: center; gap: 8px; justify-self: start; }
.vela-field-bool { display: flex; align-items: center; gap: 8px; min-height: 22px; }
.vela-field-stacked { display: flex; flex-direction: column; gap: 8px; }
.vela-field-stacked-head { display: flex; align-items: center; justify-content: center; gap: 8px; }
.vela-field-inline { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.vela-field-inline-item { display: flex; align-items: center; gap: 8px; }
.vela-field-toggle-label { display: flex; align-items: center; gap: 8px; }
.vela-field-section {
    grid-column: 1 / -1;
    margin: 24px 0 0;
    padding-bottom: 8px;
    font-size: var(--vela-font-size-sm);
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--vela-fg-muted);
}
.vela-field-section[data-variant='inputs'] {
    margin: 0;
    padding: 20px 0 8px;
    font-size: 11px;
    font-weight: 600;
}
.vela-field-section[data-variant='inputs'][data-first] { padding-top: 4px; }
.vela-field-sep { grid-column: 1 / -1; height: 14px; }
.vela-field-dim { opacity: 0.4 !important; pointer-events: none !important; }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/field/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Field VIEW — labeled row, section heading, and the typed-control factory.
__turbopack_context__.s([
    "buildFieldControl",
    ()=>buildFieldControl,
    "fieldGrid",
    ()=>fieldGrid,
    "fieldRow",
    ()=>fieldRow,
    "fieldSection",
    ()=>fieldSection,
    "fieldSeparator",
    ()=>fieldSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/switch/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/switch/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/number-input/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/number-input/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-field/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-field/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-area/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-area/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/color-picker/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/color-picker/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/glyph-select/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/glyph-select/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/field/styles.ts [app-client] (ecmascript)");
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
function ensureFieldStyles(doc = document) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIELD_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIELD_CSS"], doc);
}
function fieldGrid(opts = {}) {
    ensureFieldStyles();
    const el = document.createElement('div');
    el.className = 'vela-field-grid';
    const variant = opts.variant ?? 'inputs';
    el.dataset.variant = variant;
    if (opts.mobile) el.dataset.mobile = '';
    el.style.gridTemplateColumns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fieldGridColumns"])(variant, opts.mobile === true);
    return el;
}
function fieldSection(title, opts = {}) {
    ensureFieldStyles();
    const el = document.createElement('div');
    el.className = 'vela-field-section';
    if (opts.variant) el.dataset.variant = opts.variant;
    if (opts.first) el.dataset.first = '';
    el.textContent = title;
    return el;
}
function fieldSeparator() {
    ensureFieldStyles();
    const el = document.createElement('div');
    el.className = 'vela-field-sep';
    return el;
}
function labelEl(text, opts) {
    // A SPAN on purpose, never a `<label for>`: the title is fully INERT — it neither
    // reacts to hover (native labels propagate `:hover` onto their control) nor to
    // clicks. Only the input itself is interactive. The a11y association a label would
    // have given lives on the control as `aria-labelledby` instead.
    const el = document.createElement('span');
    el.className = 'vela-field-label';
    if (opts.size) el.dataset.size = opts.size;
    el.textContent = text;
    const id = opts.id;
    if (id) {
        el.id = `${id}--title`;
        // The control exists but may not be attached yet (rows are assembled before the
        // dialog mounts); after the current task it is, so the name lands reliably.
        queueMicrotask(()=>{
            el.ownerDocument.getElementById(id)?.setAttribute('aria-labelledby', el.id);
        });
    }
    return el;
}
function asList(control) {
    if (!control) return [];
    return Array.isArray(control) ? control : [
        control
    ];
}
function applyClass(el, extra) {
    if (extra) {
        for (const c of extra.split(/\s+/))if (c) el.classList.add(c);
    }
}
function dimControls(controls, on) {
    for (const c of controls){
        if (c.dataset.sdSelfGated === '1') continue;
        c.classList.toggle('vela-field-dim', !on);
    }
}
function fieldRow(opts) {
    ensureFieldStyles();
    const size = opts.labelSize;
    if (opts.inline) {
        const wrap = document.createElement('div');
        wrap.className = 'vela-field-span vela-field-inline';
        for (const item of opts.inline){
            const it = document.createElement('div');
            it.className = 'vela-field-inline-item';
            if (item.toggleFirst) it.style.flexDirection = 'row-reverse';
            if (item.label) {
                it.appendChild(labelEl(item.label, {
                    id: item.id,
                    size
                }));
            }
            if (item.fit) it.appendChild(item.control);
            else {
                const cw = document.createElement('div');
                cw.style.width = '100px';
                cw.appendChild(item.control);
                it.appendChild(cw);
            }
            wrap.appendChild(it);
        }
        if (opts.info) wrap.appendChild(opts.info);
        applyClass(wrap, opts.className);
        return wrap;
    }
    if (opts.bool) {
        const wrap = document.createElement('div');
        wrap.className = 'vela-field-span vela-field-bool';
        const sw = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"]({
            id: opts.toggle?.id ?? opts.id,
            checked: opts.toggle?.checked ?? false,
            size: 'md',
            tone: 'bright',
            onChange: (v)=>opts.toggle?.onChange(v)
        });
        wrap.append(sw.el, labelEl(opts.label, {
            id: opts.toggle?.id ?? opts.id,
            size
        }));
        if (opts.info) wrap.appendChild(opts.info);
        if (opts.toggle?.get) {
            const get = opts.toggle.get;
            wrap.addEventListener('vela-sync', ()=>{
                sw.setChecked(get());
            });
        }
        applyClass(wrap, opts.className);
        return wrap;
    }
    if (opts.stacked) {
        const wrap = document.createElement('div');
        wrap.className = 'vela-field-span vela-field-stacked';
        const head = document.createElement('div');
        head.className = 'vela-field-stacked-head';
        head.appendChild(labelEl(opts.label, {
            id: opts.id,
            size
        }));
        if (opts.info) head.appendChild(opts.info);
        wrap.appendChild(head);
        for (const c of asList(opts.control))wrap.appendChild(c);
        applyClass(wrap, opts.className);
        return wrap;
    }
    const wrap = document.createElement('div');
    wrap.className = 'vela-field-row';
    const controls = asList(opts.control);
    if (opts.toggle) {
        const left = document.createElement('div');
        left.className = 'vela-field-toggle-label';
        const sw = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"]({
            id: opts.toggle.id ?? opts.id,
            checked: opts.toggle.checked,
            size: 'md',
            tone: 'bright',
            onChange: (v)=>{
                opts.toggle.onChange(v);
                if (controls.length > 0) dimControls(controls, v);
            }
        });
        left.append(sw.el, labelEl(opts.label, {
            id: opts.toggle.id ?? opts.id,
            size
        }));
        wrap.appendChild(left);
        if (controls.length > 0) dimControls(controls, opts.toggle.checked);
        if (opts.toggle.get) {
            const get = opts.toggle.get;
            wrap.addEventListener('vela-sync', ()=>{
                const v = get();
                sw.setChecked(v);
                if (controls.length > 0) dimControls(controls, v);
            });
        }
    } else {
        wrap.appendChild(labelEl(opts.label, {
            id: opts.id,
            size
        }));
    }
    const cell = document.createElement('div');
    cell.className = 'vela-field-cell';
    if (opts.controlWidth != null && controls.length === 1 && !opts.fit) {
        const cw = document.createElement('div');
        cw.style.width = `${opts.controlWidth}px`;
        cw.appendChild(controls[0]);
        cell.appendChild(cw);
    } else {
        for (const c of controls)cell.appendChild(c);
    }
    if (opts.info) cell.appendChild(opts.info);
    wrap.appendChild(cell);
    applyClass(wrap, opts.className);
    return wrap;
}
function buildFieldControl(desc) {
    if (desc.kind === 'number') {
        const ni = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NumberInput"]({
            id: desc.id,
            value: desc.value,
            min: desc.min,
            max: desc.max,
            step: desc.step,
            integer: desc.integer,
            size: 'md',
            fill: desc.fill,
            compact: desc.compact,
            commit: desc.commit,
            steppers: desc.steppers,
            clamp: desc.clamp,
            placeholder: desc.placeholder,
            emptyValue: desc.emptyValue,
            title: desc.title,
            onChange: desc.onChange
        });
        if (desc.sync) {
            const sync = desc.sync;
            ni.el.addEventListener('vela-sync', ()=>{
                ni.setValue(sync());
            });
        }
        return {
            el: ni.el,
            setValue: (v)=>ni.setValue(Number(v))
        };
    }
    if (desc.kind === 'select') {
        const sel = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"]({
            id: desc.id,
            options: desc.options,
            value: desc.value,
            size: 'md',
            fill: desc.fill,
            theme: desc.theme,
            list: desc.list,
            onChange: desc.onChange
        });
        if (desc.title) sel.el.title = desc.title;
        if (desc.sync) {
            const sync = desc.sync;
            sel.el.addEventListener('vela-sync', ()=>{
                sel.setValue(sync());
            });
        }
        return {
            el: sel.el,
            setValue: (v)=>sel.setValue(String(v))
        };
    }
    if (desc.kind === 'switch') {
        const sw = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"]({
            id: desc.id,
            checked: desc.checked,
            size: 'md',
            tone: 'bright',
            onChange: desc.onChange
        });
        if (desc.sync) {
            const sync = desc.sync;
            sw.el.addEventListener('vela-sync', ()=>{
                sw.setChecked(sync());
            });
        }
        return {
            el: sw.el,
            setValue: (v)=>sw.setChecked(Boolean(v))
        };
    }
    if (desc.kind === 'color') {
        const el = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$color$2d$picker$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colorField"])(desc.theme, desc.get, desc.onChange, {
            shape: 'circle',
            id: desc.id,
            popover: desc.popover,
            commit: desc.commit
        });
        if (desc.title) el.title = desc.title;
        return {
            el
        };
    }
    if (desc.kind === 'text') {
        const tf = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"]({
            id: desc.id,
            value: desc.value,
            size: 'md',
            fill: desc.fill,
            onChange: desc.onChange
        });
        if (desc.placeholder) tf.input.placeholder = desc.placeholder;
        if (desc.sync) {
            const sync = desc.sync;
            tf.el.addEventListener('vela-sync', ()=>{
                tf.setValue(sync());
            });
        }
        return {
            el: tf.el,
            setValue: (v)=>tf.setValue(String(v))
        };
    }
    if (desc.kind === 'textarea') {
        const ta = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextArea"]({
            id: desc.id,
            value: desc.value,
            rows: desc.rows,
            autoGrow: desc.autoGrow,
            maxLines: desc.maxLines,
            placeholder: desc.placeholder,
            onChange: desc.onChange
        });
        if (desc.sync) {
            const sync = desc.sync;
            ta.el.addEventListener('vela-sync', ()=>{
                ta.setValue(sync());
            });
        }
        return {
            el: ta.el,
            setValue: (v)=>ta.setValue(String(v))
        };
    }
    const el = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["widthField"])(desc.theme, desc.get, desc.onChange);
    if (desc.title) el.title = desc.title;
    return {
        el
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/glyph-select/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Glyph-select CONTROLLER — option list + current value. No DOM.
__turbopack_context__.s([
    "WIDTH_FIELD_OPTIONS",
    ()=>WIDTH_FIELD_OPTIONS,
    "glyphSelectController",
    ()=>glyphSelectController,
    "lineWidthGlyph",
    ()=>lineWidthGlyph,
    "widthFieldOptions",
    ()=>widthFieldOptions
]);
function glyphSelectController(opts) {
    let value = opts.value;
    return {
        options: opts.options,
        get value () {
            return value;
        },
        setValue (v) {
            value = v;
        },
        optionOf (v) {
            return opts.options.find((o)=>o.value === v);
        },
        pick (v) {
            value = v;
            opts.onChange?.(v);
            return v;
        }
    };
}
const WIDTH_FIELD_OPTIONS = [
    1,
    2,
    3,
    4,
    5
];
function lineWidthGlyph(width) {
    return `<svg width="22" height="14" viewBox="0 0 22 14" fill="none"><line x1="2" y1="7" x2="20" y2="7" stroke="currentColor" stroke-width="${width}" stroke-linecap="round"/></svg>`;
}
function widthFieldOptions() {
    return WIDTH_FIELD_OPTIONS.map((w)=>({
            value: w,
            label: `${w}px`,
            glyph: lineWidthGlyph(w)
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/glyph-select/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/glyph-select/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/glyph-select/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/glyph-select/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GLYPH_SELECT_CSS",
    ()=>GLYPH_SELECT_CSS,
    "GLYPH_SELECT_STYLE_ID",
    ()=>GLYPH_SELECT_STYLE_ID
]);
const GLYPH_SELECT_STYLE_ID = 'vela-ui-glyph-select';
const GLYPH_SELECT_CSS = `
.vela-glyph-select {
    height: 34px;
    padding: 0 26px 0 8px;
    border: 1px solid var(--vela-border-strong);
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: none;
    justify-self: start;
    color: var(--vela-fg-bright);
    font-size: 14px;
    font-family: inherit;
    outline: none;
    position: relative;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
}
.vela-glyph-select:hover { border-color: var(--vela-fg-muted); }
.vela-glyph-select:focus { border-color: var(--vela-focus); box-shadow: 0 0 0 3px var(--vela-focus-soft); }
.vela-glyph-select-caret {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    opacity: 0.55;
    color: inherit;
    line-height: 0;
    pointer-events: none;
}
.vela-glyph-select-pop {
    background: var(--vela-bg);
    border: none;
    border-radius: 6px;
    box-shadow: var(--vela-shadow);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 1px;
    color: var(--vela-fg);
    font: 14px var(--vela-font);
}
.vela-glyph-select-item {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 96px;
    padding: 7px 10px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    text-align: left;
    font: inherit;
}
.vela-glyph-select-item:hover { background: var(--vela-hover); }
.vela-glyph-select-item[data-active='1'] { background: var(--vela-hover-strong); color: var(--vela-fg-bright); }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/glyph-select/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Glyph-select VIEW — trigger showing the current glyph, portaled option list.
__turbopack_context__.s([
    "GlyphSelect",
    ()=>GlyphSelect,
    "closeWidthPopover",
    ()=>closeWidthPopover,
    "widthField",
    ()=>widthField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/glyph-select/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/glyph-select/styles.ts [app-client] (ecmascript)");
;
;
;
;
;
class GlyphSelect {
    el;
    ctrl;
    theme;
    get;
    constructor(opts){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLYPH_SELECT_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLYPH_SELECT_CSS"], document);
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glyphSelectController"])(opts);
        this.theme = opts.theme;
        this.get = opts.get ?? (()=>this.ctrl.value);
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'vela-glyph-select';
        if (opts.title) trigger.title = opts.title;
        this.el = trigger;
        this.paint();
        trigger.addEventListener('pointerdown', (e)=>{
            e.preventDefault();
            trigger.focus({
                preventScroll: true
            });
        });
        trigger.addEventListener('click', (e)=>{
            e.stopPropagation();
            this.toggle();
        });
        trigger.addEventListener('vela-sync', ()=>{
            this.ctrl.setValue(this.get());
            this.paint();
        });
    }
    setValue(v) {
        this.ctrl.setValue(v);
        this.paint();
    }
    paint() {
        const cur = this.get();
        const opt = this.ctrl.optionOf(cur);
        const glyph = document.createElement('span');
        glyph.style.display = 'flex';
        glyph.innerHTML = opt?.glyph ?? '';
        const caret = document.createElement('span');
        caret.className = 'vela-glyph-select-caret';
        caret.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('chevron-down', this.el.ownerDocument));
        this.el.replaceChildren(glyph, caret);
    }
    toggle() {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openPopoverTrigger"])() === this.el) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
            return;
        }
        const current = this.get();
        const pop = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"]({
            trigger: this.el,
            theme: this.theme,
            align: 'end',
            gap: 6,
            className: 'vela-glyph-select-pop',
            content: (el)=>{
                el.style.font = `var(--vela-font-size-md) ${this.theme.fontFamily}`;
                for (const o of this.ctrl.options){
                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'vela-glyph-select-item';
                    item.dataset.active = o.value === current ? '1' : '0';
                    item.innerHTML = `<span style="display:flex;flex:none;">${o.glyph}</span>` + `<span style="flex:1;font-variant-numeric:tabular-nums;">${o.label}</span>`;
                    item.addEventListener('click', (ev)=>{
                        ev.stopPropagation();
                        pop.hide();
                        this.ctrl.pick(o.value);
                        this.paint();
                    });
                    el.appendChild(item);
                }
            }
        });
        pop.show();
    }
}
function widthField(theme, getVal, onVal) {
    return new GlyphSelect({
        theme,
        options: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$glyph$2d$select$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["widthFieldOptions"])(),
        value: getVal(),
        get: getVal,
        onChange: onVal
    }).el;
}
function closeWidthPopover() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/menu/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "menuController",
    ()=>menuController
]);
// Menu CONTROLLER — Zag menu machine + Vela's descriptor mapping. Items are DATA
// descriptors (the plugin contribution currency): any view layer projects them.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$menu$2f$dist$2f$menu$2e$machine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/menu/dist/menu.machine.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$menu$2f$dist$2f$menu$2e$connect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/menu/dist/menu.connect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/zag.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$normalize$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/vanilla/dist/normalize-props.mjs [app-client] (ecmascript)");
;
;
function menuController(opts) {
    return {
        machine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$menu$2f$dist$2f$menu$2e$machine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["machine"],
        props: {
            id: opts.id ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nextUid"])('vela-menu'),
            ids: opts.triggerId ? {
                trigger: opts.triggerId
            } : undefined,
            positioning: {
                placement: opts.placement ?? 'bottom-start',
                ...opts.getAnchorRect ? {
                    getAnchorRect: ()=>opts.getAnchorRect()
                } : {}
            },
            onSelect: (d)=>opts.onSelect?.(d.value),
            onOpenChange: (d)=>opts.onOpenChange?.(d.open)
        },
        connect: (service)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$menu$2f$dist$2f$menu$2e$connect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connect"](service, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$normalize$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeProps"])
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/menu/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/menu/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/menu/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/menu/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MENU_CSS",
    ()=>MENU_CSS,
    "MENU_STYLE_ID",
    ()=>MENU_STYLE_ID
]);
const MENU_STYLE_ID = 'vela-ui-menu';
const MENU_CSS = `
.vela-menu {
    /* The list is a <ul>: without this, block rows (the separator) paint a ::marker dot. */
    list-style: none;
    margin: 0;
    background: var(--vela-surface);
    color: var(--vela-fg);
    border: 1px solid var(--vela-border-strong);
    border-radius: 6px;
    box-shadow: var(--vela-shadow);
    padding: 6px;
    min-width: 180px;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 13px;
    z-index: var(--vela-z-menu);
    outline: none;
}
.vela-menu[data-state='open'] { animation: vela-menu-in var(--vela-dur-fast) var(--vela-ease); }
@keyframes vela-menu-in {
    from { opacity: 0; transform: translateY(-3px); }
    to { opacity: 1; transform: translateY(0); }
}
.vela-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}
.vela-menu-item[data-highlighted] { background: var(--vela-hover); }
.vela-menu-item[data-disabled] { opacity: 0.4; cursor: default; }
.vela-menu-item .vela-icon { width: 16px; height: 16px; font-size: 16px; justify-content: center; color: var(--vela-fg-muted); }
.vela-menu-item .vela-menu-label { flex: 1 1 auto; }
.vela-menu-item .vela-menu-hint { color: var(--vela-fg-faint); font-size: var(--vela-font-size-sm); }
/* Active entry: the row surface carries the selection — a stronger background wash
   than the hover one, plus bright ink. Declared after the hover rule so a selected
   row stays visibly selected while highlighted. */
.vela-menu-item[data-checked] {
    background: var(--vela-hover-strong);
    color: var(--vela-fg-bright);
}
/* Checkmark mode (context/action menus): every row reserves the leading mark column so
   labels align; a checked row fills it with a ✓ and brightens its ink — the row surface
   stays free for the hover wash. */
.vela-menu-item .vela-menu-mark {
    width: 14px;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.vela-menu-item .vela-menu-mark .vela-icon {
    width: 14px;
    height: 14px;
    font-size: 14px;
    color: var(--vela-fg-bright);
}
.vela-menu-item[data-checkmark] { color: var(--vela-fg-bright); }
/* Switch rows (boolean settings in a dropdown): a right-aligned toggle pill — the
   same control language as the settings dialog's toggles. */
.vela-menu-switch {
    order: 99;
    margin-left: auto;
    position: relative;
    flex: none;
    width: 34px;
    height: 18px;
    border-radius: 9px;
    background: var(--vela-surface-overlay);
    border: 1px solid var(--vela-border-soft);
    transition: background 0.16s ease, border-color 0.16s ease;
}
.vela-menu-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--vela-fg-muted);
    transition: transform 0.16s ease, background 0.16s ease;
}
.vela-menu-switch.on { background: var(--vela-accent-bright, var(--vela-accent)); border-color: var(--vela-accent-bright, var(--vela-accent)); }
.vela-menu-switch.on::after { transform: translateX(16px); background: var(--vela-bg); }
/* Favorite star (rows carrying \`favorite\`): reserved space always — it fades in on row
   hover instead of shifting the layout — and a starred row keeps its filled star visible.
   Same control language as the drawing toolbar's flyout stars. */
.vela-menu-item .vela-menu-star {
    order: 98;
    /* Pad the 16px icon slot into a bigger hit target without moving the row's layout. */
    margin: -3px -5px -3px 0;
    padding: 3px 5px;
    box-sizing: content-box;
    border-radius: var(--vela-radius-sm);
    opacity: 0;
    transition: opacity 0.1s ease, background 0.1s ease;
}
.vela-menu-item[data-highlighted] .vela-menu-star { opacity: 0.55; }
.vela-menu-item .vela-menu-star:hover { opacity: 1; background: var(--vela-hover-strong); }
.vela-menu-item .vela-menu-star.vela-fav { opacity: 0.95; color: var(--vela-highlight); }
.vela-menu-sep { height: 1px; margin: 4px 6px; background: var(--vela-border); }
/* Submenu trigger row: a right-aligned chevron, and it stays highlighted while its own
   list is open so the path you came down remains readable. */
.vela-menu-item .vela-menu-arrow {
    order: 99;
    margin-left: auto;
    width: 12px;
    flex: none;
    font-size: 11px;
    color: var(--vela-fg-faint);
}
.vela-menu-item[data-state='open'] { background: var(--vela-hover); }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/menu/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Menu",
    ()=>Menu
]);
// Menu VIEW — projects MenuItemDescriptor[] into a floating list driven by the Zag menu
// machine (keyboard nav, typeahead, dismiss handled by the machine). An item carrying
// `submenu` becomes a trigger row owning a nested machine + list, registered as this
// machine's child: Zag then drives hover intent, arrow-key traversal and the dismiss
// chain across levels instead of the view faking any of it.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/zag.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/vanilla/dist/spread-props.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/menu/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/menu/styles.ts [app-client] (ecmascript)");
;
;
;
;
;
;
/**
 * One menu level: a Zag machine plus the floating list it projects onto. The root menu is a
 * surface and every branch spawns another, so nesting is depth-agnostic. Private — `Menu`
 * is the public face.
 */ class Surface {
    list;
    handle;
    positioner;
    ctrl;
    mid;
    doc;
    host;
    onSelect;
    onFavorite;
    checkmarks;
    items = [];
    /** Branch item id → the surface it opens. */ subs = new Map();
    /** Trigger rect captured when this level opened — the list stays put if the
     *  trigger then moves (favorite chips shifting the caret). */ pinnedAnchor = null;
    constructor(doc, opts){
        this.doc = doc;
        this.host = opts.host;
        this.onSelect = opts.onSelect;
        this.onFavorite = opts.onFavorite;
        this.checkmarks = opts.checkmarks === true;
        this.positioner = doc.createElement('div');
        this.positioner.className = 'vela-ui-layer';
        this.list = doc.createElement('ul');
        this.list.className = 'vela-menu';
        if (opts.minWidth) this.list.style.minWidth = opts.minWidth;
        this.positioner.appendChild(this.list);
        this.host.appendChild(this.positioner);
        const trigger = opts.trigger;
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["menuController"])({
            items: [],
            id: opts.id,
            placement: opts.placement,
            onSelect: (id)=>this.onSelect(id),
            getAnchorRect: ()=>this.pinnedAnchor,
            onOpenChange: (open)=>{
                if (open && trigger) {
                    const r = trigger.getBoundingClientRect();
                    this.pinnedAnchor = {
                        x: r.x,
                        y: r.y,
                        width: r.width,
                        height: r.height
                    };
                } else {
                    this.pinnedAnchor = null;
                }
                opts.onOpenChange?.(open);
            },
            triggerId: opts.triggerId
        });
        this.mid = String(this.ctrl.props.id);
        if (opts.triggerId && trigger) trigger.id = opts.triggerId;
        this.handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$zag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["runMachine"])(this.ctrl.machine, this.ctrl.props, (service)=>{
            const api = this.ctrl.connect(service);
            if (trigger) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(trigger, api.getTriggerProps(), this.mid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(this.positioner, api.getPositionerProps(), this.mid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(this.list, api.getContentProps(), this.mid);
            this.project(api);
        });
    }
    get api() {
        return this.ctrl.connect(this.handle.service);
    }
    setItems(items) {
        this.items = items;
        for (const sub of this.subs.values())sub.destroy();
        this.subs.clear();
        this.build();
        const api = this.api;
        for (const sub of this.subs.values()){
            api.setChild(sub.handle.service);
            sub.api.setParent(this.handle.service);
        }
        this.handle.flush();
        // Those two are queued sends: a child only learns it IS a submenu on the next
        // microtask, and a branch row's props (hover intent, the trigger-item part) are
        // derived from that. Re-project once the queue has drained.
        if (this.subs.size > 0) queueMicrotask(()=>this.handle.flush());
    }
    destroy() {
        for (const sub of this.subs.values())sub.destroy();
        this.subs.clear();
        this.handle.stop();
        this.positioner.remove();
    }
    byId(id) {
        return this.items.find((i)=>i.id === id);
    }
    /** Push the machine's item props onto the rendered rows. A branch takes the submenu
     *  trigger props, which carry the child's ids and hover handlers; a leaf takes plain ones. */ project(api) {
        for (const li of this.list.children){
            const id = li.dataset.veiId;
            if (!id) continue;
            const sub = this.subs.get(id);
            if (sub) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(li, api.getTriggerItemProps(sub.api), this.mid);
                continue;
            }
            const item = this.byId(id);
            // Switch rows keep the menu OPEN on selection — flip, see, flip again.
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spreadProps"])(li, api.getItemProps({
                value: id,
                disabled: item?.disabled,
                closeOnSelect: item?.toggle ? false : undefined
            }), this.mid);
        }
    }
    build() {
        const doc = this.doc;
        this.list.replaceChildren();
        // Reserve the leading mark column only when THIS level actually holds checkable
        // rows — an all-action list (e.g. the chart-body context menu) keeps its natural
        // left edge instead of carrying an empty gutter.
        const markable = this.checkmarks && this.items.some((i)=>!(i.submenu && i.submenu.length > 0) && !i.toggle && i.checked !== undefined);
        for (const item of this.items){
            if (item.separatorBefore) {
                const sep = doc.createElement('li');
                sep.className = 'vela-menu-sep';
                sep.setAttribute('role', 'separator');
                this.list.appendChild(sep);
            }
            const branch = item.submenu !== undefined && item.submenu.length > 0;
            const li = doc.createElement('li');
            li.className = 'vela-menu-item';
            li.dataset.veiId = item.id;
            if (item.toggle) {
                // Switch row: the pill carries the state.
                // (Zag owns the item's ARIA props; the pill below is decorative.)
                li.dataset.toggle = '1';
            }
            if (markable) {
                // Mark mode: a leading ✓ slot on every row of this level (empty when
                // unchecked, so labels share a left edge); the row surface stays free
                // for hover.
                const mark = doc.createElement('span');
                mark.className = 'vela-menu-mark';
                if (!branch && !item.toggle && item.checked) {
                    mark.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('check', doc));
                    li.dataset.checkmark = '1';
                }
                li.appendChild(mark);
            } else if (!branch && !item.toggle && item.checked) {
                // Selection reads from the row surface: a stronger background wash
                // marks the active entry (hover stays the lighter wash).
                li.dataset.checked = '1';
            }
            if (item.icon) li.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])(item.icon, doc));
            const label = doc.createElement('span');
            label.className = 'vela-menu-label';
            label.textContent = item.label;
            li.appendChild(label);
            if (item.hint) {
                const hint = doc.createElement('span');
                hint.className = 'vela-menu-hint';
                hint.textContent = item.hint;
                li.appendChild(hint);
            }
            if (item.favorite !== undefined && this.onFavorite) {
                const on = item.favorite;
                const star = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])(on ? 'star-filled' : 'star', doc);
                star.classList.add('vela-menu-star');
                if (on) star.classList.add('vela-fav');
                star.removeAttribute('aria-hidden'); // iconEl hides decorative icons; this one is a control
                star.setAttribute('role', 'button');
                star.setAttribute('aria-label', on ? 'Remove from favorites' : 'Add to favorites');
                star.setAttribute('aria-pressed', on ? 'true' : 'false');
                // Swallow the whole pointer sequence: the machine selects rows on click,
                // and a press that starts on the star must never reach the row.
                for (const ev of [
                    'pointerdown',
                    'pointerup',
                    'mousedown',
                    'mouseup'
                ]){
                    star.addEventListener(ev, (e)=>e.stopPropagation());
                }
                star.addEventListener('click', (e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                    this.onFavorite?.(item.id, !on);
                });
                li.appendChild(star);
            }
            if (item.toggle) {
                const sw = doc.createElement('span');
                sw.className = 'vela-menu-switch' + (item.checked ? ' on' : '');
                sw.setAttribute('aria-hidden', 'true');
                li.appendChild(sw);
            }
            if (branch) {
                li.dataset.branch = '1';
                const arrow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('chevron-right', doc);
                arrow.classList.add('vela-menu-arrow');
                li.appendChild(arrow);
                const sub = new Surface(doc, {
                    host: this.host,
                    placement: 'right-start',
                    onSelect: this.onSelect,
                    onFavorite: this.onFavorite,
                    checkmarks: this.checkmarks,
                    id: `${this.mid}--${item.id}`
                });
                sub.setItems(item.submenu ?? []);
                this.subs.set(item.id, sub);
            }
            this.list.appendChild(li);
        }
    }
}
class Menu {
    root;
    constructor(opts){
        const anchor = opts.trigger ?? opts.host ?? document.body;
        const doc = anchor.ownerDocument;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MENU_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$menu$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MENU_CSS"], doc);
        const host = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatingLayerHost"])(opts.host ?? anchor, doc.body);
        this.root = new Surface(doc, {
            host,
            placement: opts.placement,
            onSelect: (id)=>opts.onSelect?.(id),
            onOpenChange: opts.onOpenChange,
            trigger: opts.trigger,
            triggerId: opts.triggerId,
            id: opts.id,
            minWidth: opts.minWidth,
            onFavorite: opts.onFavorite,
            checkmarks: opts.checkmarks
        });
        this.root.setItems(opts.items);
    }
    get api() {
        return this.root.api;
    }
    open() {
        this.api.setOpen(true);
    }
    /** Open anchored to a viewport point (context menus). */ openAt(clientX, clientY) {
        const api = this.api;
        api.setOpen(true);
        api.reposition({
            getAnchorRect: ()=>({
                    x: clientX,
                    y: clientY,
                    width: 0,
                    height: 0
                })
        });
    }
    close() {
        this.api.setOpen(false);
    }
    /** Swap the item descriptors (e.g. checked states) and re-project. */ setItems(items) {
        this.root.setItems(items);
    }
    destroy() {
        this.root.destroy();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/number-input/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Number-input CONTROLLER — clamp, integer rounding, commit helpers. No DOM.
__turbopack_context__.s([
    "clampNumber",
    ()=>clampNumber,
    "numberInputController",
    ()=>numberInputController,
    "snapToStep",
    ()=>snapToStep
]);
function clampNumber(n, opts) {
    let v = n;
    if (opts.min !== undefined) v = Math.max(opts.min, v);
    if (opts.max !== undefined) v = Math.min(opts.max, v);
    if (opts.integer) v = Math.round(v);
    return v;
}
function decimalsOf(n) {
    const s = String(n);
    const e = s.search(/[eE]/);
    if (e >= 0) {
        const frac = s.slice(0, e).split('.')[1]?.length ?? 0;
        return Math.max(0, Math.min(20, frac - Number(s.slice(e + 1))));
    }
    return s.split('.')[1]?.length ?? 0;
}
function snapToStep(n, base, step) {
    const d = Math.min(20, Math.max(decimalsOf(base), decimalsOf(step)));
    return Number(n.toFixed(d));
}
function numberInputController(opts) {
    let value = opts.value;
    const integer = opts.integer ?? false;
    const commit = opts.commit ?? 'blur';
    const clamp = opts.clamp ?? commit === 'blur';
    const step = opts.step ?? (integer ? 1 : 0.1);
    const onChange = opts.onChange;
    const normalize = (raw)=>clamp ? clampNumber(raw, {
            min: opts.min,
            max: opts.max,
            integer
        }) : raw;
    const apply = (raw)=>{
        if (!Number.isFinite(raw)) return null;
        const n = normalize(raw);
        if (n !== value) {
            value = n;
            onChange?.(n);
        }
        return n;
    };
    return {
        get value () {
            return value;
        },
        min: opts.min,
        max: opts.max,
        step,
        integer,
        size: opts.size ?? 'md',
        commit,
        steppers: opts.steppers ?? commit === 'blur',
        clamp,
        disabled: opts.disabled ?? false,
        apply,
        sync (raw) {
            const n = Number.isFinite(raw) ? normalize(raw) : value;
            value = n;
            return n;
        },
        nudge (dir) {
            return apply(snapToStep(value + dir * step, value, step));
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/number-input/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/number-input/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/number-input/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/number-input/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NUMBER_CSS",
    ()=>NUMBER_CSS,
    "NUMBER_STYLE_ID",
    ()=>NUMBER_STYLE_ID
]);
const NUMBER_STYLE_ID = 'vela-ui-number-3';
const NUMBER_CSS = `
.vela-num { position: relative; display: inline-block; min-width: 0; }
.vela-num[data-fill] { width: 100%; }
.vela-num:not([data-fill]) { width: 100px; flex: none; justify-self: start; }
.vela-num:not([data-fill])[data-compact] { width: 80px; }
.vela-num input {
    width: 100%;
    box-sizing: border-box;
    height: 34px;
    background: transparent;
    border: 1px solid var(--vela-border-strong);
    border-radius: 6px;
    color: var(--vela-fg-bright);
    padding: 0 8px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    -moz-appearance: textfield;
    appearance: textfield;
    /* Selectable even under a user-select:none host (chart wrapper, .vela-ui). */
    user-select: text;
    -webkit-user-select: text;
}
.vela-num input::-webkit-inner-spin-button, .vela-num input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.vela-num input:hover { border-color: var(--vela-fg-muted); }
.vela-num input:focus { border-color: var(--vela-focus); box-shadow: 0 0 0 3px var(--vela-focus-soft); }
/* The stepper gutter exists only while the steppers do (hover) — an idle field keeps
   its full width so long values aren't cut under an invisible arrow column. */
.vela-num[data-steppers]:hover input { padding-right: 26px; }
.vela-num[data-size='sm'] { width: 64px; flex: none; }
.vela-num[data-size='sm'][data-compact] { width: 56px; }
.vela-num[data-size='sm'] input {
    height: 28px;
    background: var(--vela-surface-elev);
    border-radius: var(--vela-radius-sm);
    color: var(--vela-fg);
    font-size: 13px;
    box-shadow: none;
}
.vela-num[data-size='sm'] input:focus { box-shadow: none; }
.vela-num-step {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 22px;
    display: none;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding: 2px 6px 2px 0;
    line-height: 0;
}
.vela-num[data-steppers]:hover .vela-num-step { display: flex; }
.vela-num-step button {
    flex: 1;
    width: 100%;
    min-height: 0;
    border: none;
    background: transparent;
    color: var(--vela-fg-muted);
    border-radius: 3px;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.vela-num-step button:hover { background: var(--vela-hover); color: var(--vela-fg-bright); }
.vela-num-step .vela-icon, .vela-num-step svg { width: 12px; height: 12px; display: block; }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/number-input/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NumberInput",
    ()=>NumberInput
]);
// Number-input VIEW — typed field with optional hover steppers (press-repeat).
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/number-input/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/number-input/styles.ts [app-client] (ecmascript)");
;
;
;
;
class NumberInput {
    el;
    input;
    ctrl;
    last;
    placeholderMode;
    emptyValue;
    constructor(opts){
        const doc = document;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NUMBER_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NUMBER_CSS"], doc);
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberInputController"])(opts);
        this.placeholderMode = opts.placeholder !== undefined;
        this.emptyValue = opts.emptyValue ?? opts.value;
        this.last = String(opts.value);
        const wrap = doc.createElement('div');
        wrap.className = 'vela-num';
        wrap.dataset.size = this.ctrl.size;
        if (opts.fill ?? this.ctrl.size !== 'sm') wrap.dataset.fill = '';
        if (opts.compact) wrap.dataset.compact = '';
        if (this.ctrl.steppers) wrap.dataset.steppers = '';
        const ni = doc.createElement('input');
        ni.type = 'number';
        if (opts.id) ni.id = opts.id;
        if (opts.title) ni.title = opts.title;
        if (opts.min !== undefined) ni.min = String(opts.min);
        if (opts.max !== undefined) ni.max = String(opts.max);
        ni.step = String(this.ctrl.step);
        if (this.ctrl.disabled) ni.disabled = true;
        if (this.placeholderMode) {
            ni.placeholder = opts.placeholder ?? '';
            ni.value = opts.value !== this.emptyValue ? String(opts.value) : '';
        } else {
            ni.value = String(opts.value);
        }
        const commitRaw = (raw)=>{
            const n = this.ctrl.apply(raw);
            if (n === null) {
                ni.value = this.placeholderMode && this.ctrl.value === this.emptyValue ? '' : this.last;
                return;
            }
            this.last = String(n);
            if (this.placeholderMode && n === this.emptyValue) ni.value = '';
            else ni.value = String(n);
        };
        if (this.placeholderMode) {
            ni.addEventListener('change', ()=>{
                const raw = ni.value.trim() === '' ? this.emptyValue : Number(ni.value);
                commitRaw(Number.isFinite(raw) ? raw : this.emptyValue);
            });
        } else if (this.ctrl.commit === 'live') {
            ni.addEventListener('input', ()=>{
                const v = Number(ni.value);
                if (Number.isFinite(v)) this.ctrl.apply(v);
            });
        } else {
            ni.addEventListener('blur', ()=>commitRaw(Number(ni.value)));
            ni.addEventListener('keydown', (e)=>{
                if (e.key === 'Enter') {
                    e.preventDefault();
                    ni.blur();
                }
            });
        }
        wrap.appendChild(ni);
        if (this.ctrl.steppers) {
            wrap.appendChild(this.buildSteppers(doc, (dir)=>{
                const cur = Number(ni.value);
                const base = Number.isFinite(cur) ? cur : this.ctrl.value;
                commitRaw((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$number$2d$input$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToStep"])(base + dir * this.ctrl.step, base, this.ctrl.step));
            }));
        }
        this.el = wrap;
        this.input = ni;
    }
    get value() {
        return this.ctrl.value;
    }
    setValue(v) {
        const n = this.ctrl.sync(v);
        this.last = String(n);
        if (this.placeholderMode && n === this.emptyValue) this.input.value = '';
        else this.input.value = String(n);
    }
    buildSteppers(doc, applyDir) {
        const steps = doc.createElement('div');
        steps.className = 'vela-num-step';
        const mk = (dir, icon, label)=>{
            const b = doc.createElement('button');
            b.type = 'button';
            b.tabIndex = -1;
            b.setAttribute('aria-label', label);
            b.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])(icon, doc));
            let timer = 0;
            const apply = ()=>applyDir(dir);
            const stop = ()=>{
                if (timer) {
                    window.clearTimeout(timer);
                    timer = 0;
                }
            };
            b.addEventListener('pointerdown', (e)=>{
                e.preventDefault();
                e.stopPropagation();
                apply();
                timer = window.setTimeout(function tick() {
                    apply();
                    timer = window.setTimeout(tick, 60);
                }, 400);
            });
            b.addEventListener('pointerup', stop);
            b.addEventListener('pointerleave', stop);
            b.addEventListener('pointercancel', stop);
            return b;
        };
        steps.append(mk(1, 'chevron-up', 'Increase'), mk(-1, 'chevron-down', 'Decrease'));
        return steps;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/popover/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Popover CONTROLLER — placement math only. No DOM: the view measures rects and
// the vanilla (or a future React) projection applies the returned coordinates.
__turbopack_context__.s([
    "insetRect",
    ()=>insetRect,
    "intersectRects",
    ()=>intersectRects,
    "placePopover",
    ()=>placePopover,
    "popoverController",
    ()=>popoverController,
    "viewportRect",
    ()=>viewportRect
]);
function insetRect(r, inset) {
    return {
        left: r.left + inset,
        top: r.top + inset,
        right: r.right - inset,
        bottom: r.bottom - inset,
        width: r.width - inset * 2,
        height: r.height - inset * 2
    };
}
function viewportRect(width, height, inset) {
    return {
        left: inset,
        top: inset,
        right: width - inset,
        bottom: height - inset,
        width: width - inset * 2,
        height: height - inset * 2
    };
}
function intersectRects(a, b) {
    const left = Math.max(a.left, b.left);
    const top = Math.max(a.top, b.top);
    const right = Math.min(a.right, b.right);
    const bottom = Math.min(a.bottom, b.bottom);
    return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top
    };
}
function placePopover(a) {
    let left = a.align === 'end' ? a.trigger.right - a.pop.width : a.align === 'center' ? a.trigger.left + a.trigger.width / 2 - a.pop.width / 2 : a.trigger.left;
    const below = a.trigger.bottom + a.gap;
    const above = a.trigger.top - a.pop.height - a.gap;
    const fitsBelow = below + a.pop.height <= a.clamp.bottom;
    const fitsAbove = above >= a.clamp.top;
    let top = below;
    if (!fitsBelow && (fitsAbove || a.trigger.top - a.clamp.top > a.clamp.bottom - a.trigger.bottom)) {
        top = Math.max(a.clamp.top, above);
    }
    if (left + a.pop.width > a.clamp.right) left = a.clamp.right - a.pop.width;
    if (left < a.clamp.left) left = a.clamp.left;
    if (top + a.pop.height > a.clamp.bottom) top = a.clamp.bottom - a.pop.height;
    if (top < a.clamp.top) top = a.clamp.top;
    return {
        left: Math.round(left - a.originX),
        top: Math.round(top - a.originY)
    };
}
function popoverController(opts = {}) {
    return {
        gap: opts.gap ?? 4,
        align: opts.align ?? 'start',
        matchWidth: opts.matchWidth ?? false,
        position: opts.position ?? 'fixed',
        boundaryInset: opts.boundaryInset ?? 0,
        viewportInset: opts.viewportInset ?? 6,
        onClose: opts.onClose
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/popover/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/popover/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POPOVER_CSS",
    ()=>POPOVER_CSS,
    "POPOVER_STYLE_ID",
    ()=>POPOVER_STYLE_ID
]);
const POPOVER_STYLE_ID = 'vela-ui-popover';
const POPOVER_CSS = `
.vela-popover {
    position: fixed;
    z-index: var(--vela-z-popover);
    box-sizing: border-box;
    /* Never serve as a scroll anchor: the shell is portaled and re-placed between
       gestures, and anchoring against it jumps the scroller underneath. */
    overflow-anchor: none;
}
.vela-popover[data-position='absolute'] { position: absolute; }
.vela-popover[hidden] { display: none !important; }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Popover VIEW — a positioned floating shell. Content is caller-owned; this class
// owns portal, placement, capture-phase outside-dismiss, and the single-open registry.
__turbopack_context__.s([
    "Popover",
    ()=>Popover,
    "closeOpenPopovers",
    ()=>closeOpenPopovers,
    "eventDismissedPopover",
    ()=>eventDismissedPopover,
    "isPopoverOpen",
    ()=>isPopoverOpen,
    "openPopoverTrigger",
    ()=>openPopoverTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/styles.ts [app-client] (ecmascript)");
;
;
;
;
let open = null;
function closeOpenPopovers() {
    open?.hide();
}
function isPopoverOpen() {
    return open !== null;
}
function openPopoverTrigger() {
    return open?.trigger ?? null;
}
/** Flag stamped on a pointer event whose only job was dismissing an open popover. */ const POPOVER_DISMISS_FLAG = '__velaPopoverDismiss';
function markPopoverDismiss(e) {
    e[POPOVER_DISMISS_FLAG] = true;
}
function eventDismissedPopover(e) {
    return e[POPOVER_DISMISS_FLAG] === true;
}
function toRect(r) {
    return {
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height
    };
}
class Popover {
    el;
    trigger;
    host;
    ctrl;
    boundary;
    theme;
    /** Hosted under a `.vela-ui` we resolved ourselves — its tokens win over `theme`. */ inheritsTokens;
    onOutside = null;
    onKey = null;
    onReflow = null;
    shown = false;
    fadeMs;
    /** The pending removal of a fading-out shell; a show() that reuses the shell cancels it. */ leaveTimer = null;
    constructor(opts){
        const doc = opts.trigger.ownerDocument;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POPOVER_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POPOVER_CSS"], doc);
        this.trigger = opts.trigger;
        // No explicit host: portal to the trigger's `.vela-ui` (app-theme tokens) rather
        // than <body>. Explicit hosts (drawing chrome, mark popups) keep their own tokens.
        this.host = opts.host ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floatingLayerHost"])(opts.trigger, doc.body);
        this.inheritsTokens = !opts.host && this.host !== doc.body;
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["popoverController"])(opts);
        this.boundary = opts.boundary ?? 'viewport';
        this.theme = opts.theme;
        this.fadeMs = Math.max(0, opts.fadeMs ?? 0);
        this.el = doc.createElement('div');
        this.el.className = 'vela-popover vela-ui-layer' + (opts.className ? ` ${opts.className}` : '');
        this.el.dataset.position = this.ctrl.position;
        if (opts.zIndex !== undefined) this.el.style.zIndex = String(opts.zIndex);
        // Clicks inside must not bubble to a dialog's outside-dismiss.
        this.el.addEventListener('pointerdown', (e)=>e.stopPropagation());
        if (opts.content instanceof Node) this.el.appendChild(opts.content);
        else if (typeof opts.content === 'function') opts.content(this.el);
    }
    get open() {
        return this.shown;
    }
    get position() {
        return this.ctrl.position;
    }
    get align() {
        return this.ctrl.align;
    }
    show() {
        if (this.shown) {
            this.place();
            return;
        }
        if (open && open !== this) open.hide();
        if (this.leaveTimer !== null) {
            clearTimeout(this.leaveTimer);
            this.leaveTimer = null;
        }
        // A caller theme is often the live plot surface (settings dialogs pass
        // `this.theme`); stamping it on a `.vela-ui`-hosted shell would recolor the
        // list to layout.background.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureUIHost"])(this.el, this.inheritsTokens ? undefined : this.theme);
        if (this.fadeMs > 0) {
            this.el.style.transition = `opacity ${this.fadeMs}ms ease`;
            this.el.style.opacity = '0';
            this.el.style.pointerEvents = '';
        }
        this.host.appendChild(this.el);
        this.shown = true;
        open = this;
        this.place();
        // place() measured the shell (a style flush at opacity 0) — flipping it now runs the transition.
        if (this.fadeMs > 0) this.el.style.opacity = '1';
        const onOutside = (ev)=>{
            const t = ev.target;
            if (this.el.contains(t) || this.trigger.contains(t)) return;
            // Mark the event: it spent itself dismissing this popover, so listeners
            // further down the path (a dialog backdrop) must not ALSO dismiss on it.
            markPopoverDismiss(ev);
            this.hide();
        };
        const onKey = (ev)=>{
            if (ev.key !== 'Escape') return;
            ev.preventDefault();
            ev.stopPropagation();
            this.hide();
        };
        const onReflow = ()=>this.place();
        // Capture phase, deferred so the opening click does not immediately dismiss.
        setTimeout(()=>document.addEventListener('pointerdown', onOutside, true), 0);
        document.addEventListener('keydown', onKey, true);
        window.addEventListener('resize', onReflow, true);
        // A scroll anywhere (dialog body, chart container) moves the trigger while the
        // popover is fixed — re-place so the shell tracks it instead of detaching.
        document.addEventListener('scroll', onReflow, true);
        this.onOutside = onOutside;
        this.onKey = onKey;
        this.onReflow = onReflow;
    }
    hide() {
        if (!this.shown) return;
        if (this.onOutside) document.removeEventListener('pointerdown', this.onOutside, true);
        if (this.onKey) document.removeEventListener('keydown', this.onKey, true);
        if (this.onReflow) {
            window.removeEventListener('resize', this.onReflow, true);
            document.removeEventListener('scroll', this.onReflow, true);
        }
        this.onOutside = null;
        this.onKey = null;
        this.onReflow = null;
        if (this.fadeMs > 0) {
            // Fade out, then leave the DOM; the shell is inert meanwhile (no listeners, not `open`, no hits).
            this.el.style.opacity = '0';
            this.el.style.pointerEvents = 'none';
            this.leaveTimer = setTimeout(()=>{
                this.leaveTimer = null;
                this.el.remove();
            }, this.fadeMs);
        } else {
            this.el.remove();
        }
        this.shown = false;
        if (open === this) open = null;
        this.ctrl.onClose?.();
    }
    /** Show if closed, hide if this instance is the open popover. */ toggle() {
        if (this.shown) this.hide();
        else this.show();
    }
    destroy() {
        this.hide();
    }
    reposition() {
        if (this.shown) this.place();
    }
    clampRect() {
        const view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["viewportRect"])(window.innerWidth, window.innerHeight, this.ctrl.viewportInset);
        const bound = this.readBoundary();
        if (!bound) return view;
        const inset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insetRect"])(bound, this.ctrl.boundaryInset);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intersectRects"])(view, inset);
    }
    readBoundary() {
        const b = this.boundary;
        if (b === 'viewport') return null;
        const raw = typeof b === 'function' ? b() : b.getBoundingClientRect();
        return raw ? toRect(raw) : null;
    }
    place() {
        const ar = this.trigger.getBoundingClientRect();
        if (this.ctrl.matchWidth) {
            this.el.style.minWidth = `${Math.round(Math.max(this.el.offsetWidth, ar.width))}px`;
        }
        const origin = this.ctrl.position === 'absolute' ? this.host.getBoundingClientRect() : {
            left: 0,
            top: 0
        };
        const pos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["placePopover"])({
            trigger: toRect(ar),
            pop: {
                width: this.el.offsetWidth,
                height: this.el.offsetHeight
            },
            gap: this.ctrl.gap,
            align: this.ctrl.align,
            clamp: this.clampRect(),
            originX: origin.left,
            originY: origin.top
        });
        this.el.style.left = `${pos.left}px`;
        this.el.style.top = `${pos.top}px`;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/select/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Select CONTROLLER — option list + current value. No DOM.
__turbopack_context__.s([
    "selectController",
    ()=>selectController
]);
function selectController(opts) {
    const options = opts.options;
    let value = opts.value ?? options[0]?.value ?? '';
    const size = opts.size ?? 'md';
    return {
        options,
        get value () {
            return value;
        },
        size,
        fill: opts.fill ?? size !== 'sm',
        disabled: opts.disabled ?? false,
        setValue (v) {
            value = v;
        },
        labelOf (v) {
            return options.find((o)=>o.value === v)?.label ?? v;
        },
        pick (v) {
            value = v;
            const label = options.find((o)=>o.value === v)?.label ?? v;
            opts.onChange?.(v, label);
            return {
                value: v,
                label
            };
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/select/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/select/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SELECT_CSS",
    ()=>SELECT_CSS,
    "SELECT_STYLE_ID",
    ()=>SELECT_STYLE_ID
]);
const SELECT_STYLE_ID = 'vela-ui-select-3';
const SELECT_CSS = `
.vela-select { position: relative; display: inline-block; min-width: 0; }
.vela-select[data-fill] { width: 100%; }
/* Closed trigger matches NumberInput / TextField (100px). Long labels ellipsis;
   the open list still sizes to the longest item. */
.vela-select:not([data-fill]) { width: 100px; flex: none; justify-self: start; }
.vela-select-trigger {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    height: 34px;
    padding: 0 26px 0 8px;
    background: transparent;
    border: 1px solid var(--vela-border-strong);
    border-radius: 6px;
    color: var(--vela-fg-bright);
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
    outline: none;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
}
.vela-select-trigger:hover { border-color: var(--vela-fg-muted); }
.vela-select-trigger:focus { border-color: var(--vela-focus); box-shadow: 0 0 0 3px var(--vela-focus-soft); }
.vela-select[data-size='sm'] .vela-select-trigger {
    height: 28px;
    background: var(--vela-surface-elev);
    border-radius: var(--vela-radius-sm);
    color: var(--vela-fg);
    font-size: 13px;
    box-shadow: none;
}
.vela-select[data-size='sm'] .vela-select-trigger:focus { box-shadow: none; border-color: var(--vela-fg-muted); }
.vela-select-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Compact toolbar selects still hug the widest option (no 100px kit column). */
.vela-select[data-size='sm']:not([data-fill]) { width: auto; max-width: 200px; }
.vela-select-sizer { visibility: hidden; height: 0; overflow: hidden; font-size: 13px; }
.vela-select-sizer span { display: block; height: 0; white-space: nowrap; padding: 0 26px 0 8px; border-inline: 1px solid transparent; }
.vela-select-chevron {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
    opacity: 0.55;
    line-height: 0;
    color: inherit;
}
.vela-select-chevron .vela-icon, .vela-select-chevron svg { width: 12px; height: 12px; display: block; }
.vela-select-list {
    width: max-content;
    background: var(--vela-bg);
    color: var(--vela-fg);
    border: none;
    border-radius: 6px;
    box-shadow: var(--vela-shadow);
    font: 14px var(--vela-font);
    padding: 4px;
    overflow: hidden;
}
.vela-select-list[data-size='sm'] { font-size: 13px; background: var(--vela-surface-overlay); }
.vela-select-items { width: max-content; min-width: 100%; max-height: none; overflow: hidden; }
.vela-select-list.is-scroll { display: flex; align-items: stretch; gap: 2px; }
.vela-select-list.is-scroll .vela-select-items {
    flex: 1 1 auto;
    min-width: min-content;
    max-height: 240px;
    overflow-y: auto;
    scrollbar-width: none;
}
.vela-select-list.is-scroll .vela-select-items::-webkit-scrollbar { display: none; width: 0; height: 0; }
.vela-select-rail { position: relative; flex: none; width: 3px; margin: 2px 1px 2px 0; pointer-events: none; }
.vela-select-thumb { width: 3px; border-radius: 2px; background: var(--vela-scroll); }
.vela-select-item {
    display: block;
    width: auto;
    min-width: 100%;
    white-space: nowrap;
    text-align: left;
    padding: 7px 10px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    font-weight: 400;
}
.vela-select-item:hover { background: var(--vela-hover); }
.vela-select-item[data-checked] { background: var(--vela-hover-strong); color: var(--vela-fg-bright); }
.vela-select-item[data-checked]:hover { background: var(--vela-hover-strong); }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/select/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Select VIEW — trigger button + portaled themed list (hand-rolled overlay scrollbar).
__turbopack_context__.s([
    "Select",
    ()=>Select,
    "decorateSelectScroll",
    ()=>decorateSelectScroll,
    "fillSelectList",
    ()=>fillSelectList,
    "openSelectList",
    ()=>openSelectList,
    "toggleSelectList",
    ()=>toggleSelectList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/popover/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/select/styles.ts [app-client] (ecmascript)");
;
;
;
;
;
function ensureSelectStyles(doc) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SELECT_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SELECT_CSS"], doc);
}
function syncThumb(list, thumb) {
    const view = list.clientHeight;
    const total = list.scrollHeight;
    if (total <= view) {
        thumb.style.height = '0';
        return;
    }
    const thumbH = Math.max(20, view / total * view);
    const top = list.scrollTop / (total - view) * (view - thumbH);
    thumb.style.height = `${Math.round(thumbH)}px`;
    thumb.style.transform = `translateY(${Math.round(top)}px`;
}
function fillSelectList(menu, options, current, onPick) {
    menu.replaceChildren();
    const list = menu.ownerDocument.createElement('div');
    list.className = 'vela-select-items';
    for (const p of options){
        const item = menu.ownerDocument.createElement('button');
        item.type = 'button';
        item.className = 'vela-select-item';
        item.textContent = p.label;
        if (p.value === current) item.dataset.checked = '1';
        item.addEventListener('click', (e)=>{
            e.stopPropagation();
            onPick(p.value, p.label);
        });
        list.appendChild(item);
    }
    menu.appendChild(list);
}
function decorateSelectScroll(menu) {
    const list = menu.querySelector('.vela-select-items');
    if (!list) return;
    if (list.scrollHeight > 240) {
        menu.classList.add('is-scroll');
        const rail = menu.ownerDocument.createElement('div');
        rail.className = 'vela-select-rail';
        const thumb = menu.ownerDocument.createElement('div');
        thumb.className = 'vela-select-thumb';
        rail.appendChild(thumb);
        menu.appendChild(rail);
        list.addEventListener('scroll', ()=>syncThumb(list, thumb));
        syncThumb(list, thumb);
    }
    menu.querySelector('.vela-select-item[data-checked]')?.scrollIntoView({
        block: 'nearest'
    });
    list.dispatchEvent(new Event('scroll'));
}
function toggleSelectList(trigger, options, current, onPick, opts = {}) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openPopoverTrigger"])() === trigger) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
        return null;
    }
    return openSelectList(trigger, options, current, onPick, opts);
}
function openSelectList(trigger, options, current, onPick, opts = {}) {
    ensureSelectStyles(trigger.ownerDocument);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeOpenPopovers"])();
    const pop = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$popover$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"]({
        trigger,
        theme: opts.theme,
        matchWidth: opts.matchWidth ?? true,
        boundary: opts.boundary,
        boundaryInset: opts.boundaryInset,
        gap: opts.gap ?? 4,
        align: opts.align ?? 'start',
        host: opts.host,
        position: opts.position,
        zIndex: opts.zIndex,
        className: 'vela-select-list',
        onClose: opts.onClose,
        content: (el)=>{
            if (opts.size) el.dataset.size = opts.size;
            fillSelectList(el, options, current, (value, label)=>{
                pop.hide();
                onPick(value, label);
            });
        }
    });
    pop.show();
    decorateSelectScroll(pop.el);
    pop.reposition();
    return pop;
}
class Select {
    el;
    trigger;
    labelEl;
    ctrl;
    listOpts;
    list = null;
    constructor(opts){
        const doc = opts.list?.host?.ownerDocument ?? document;
        ensureSelectStyles(doc);
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$select$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectController"])(opts);
        this.listOpts = {
            ...opts.list,
            theme: opts.theme ?? opts.list?.theme,
            size: this.ctrl.size
        };
        const wrap = doc.createElement('div');
        wrap.className = 'vela-select';
        wrap.dataset.size = this.ctrl.size;
        if (this.ctrl.fill) wrap.dataset.fill = '';
        const btn = doc.createElement('button');
        btn.type = 'button';
        if (opts.id) btn.id = opts.id;
        btn.className = 'vela-select-trigger';
        if (this.ctrl.disabled) btn.disabled = true;
        const label = doc.createElement('span');
        label.className = 'vela-select-label';
        label.textContent = this.ctrl.labelOf(this.ctrl.value);
        const chevron = doc.createElement('span');
        chevron.className = 'vela-select-chevron';
        chevron.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('chevron-down', doc));
        btn.append(label, chevron);
        wrap.appendChild(btn);
        // Compact toolbar selects hug the widest option. md uses a fixed 100px
        // column and ellipsizes the trigger; the open list still shows full labels.
        if (this.ctrl.size === 'sm') {
            const sizer = doc.createElement('div');
            sizer.className = 'vela-select-sizer';
            sizer.setAttribute('aria-hidden', 'true');
            for (const o of this.ctrl.options){
                const s = doc.createElement('span');
                s.textContent = o.label;
                sizer.appendChild(s);
            }
            wrap.appendChild(sizer);
        }
        // Suppress the default mousedown focus: when this press outside-dismisses an open
        // popover, Chrome's focus action can scroll the dialog body under the pointer.
        btn.addEventListener('pointerdown', (e)=>{
            e.preventDefault();
            btn.focus({
                preventScroll: true
            });
        });
        btn.addEventListener('click', (e)=>{
            e.stopPropagation();
            this.toggle();
        });
        this.el = wrap;
        this.trigger = btn;
        this.labelEl = label;
    }
    get value() {
        return this.ctrl.value;
    }
    setValue(v) {
        this.ctrl.setValue(v);
        this.labelEl.textContent = this.ctrl.labelOf(v);
    }
    toggle() {
        this.list = toggleSelectList(this.trigger, this.ctrl.options, this.ctrl.value, (value, label)=>{
            this.ctrl.pick(value);
            this.labelEl.textContent = label;
            this.list = null;
        }, {
            ...this.listOpts,
            onClose: ()=>{
                this.list = null;
                this.listOpts.onClose?.();
            }
        });
    }
    destroy() {
        this.list?.hide();
        this.list = null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/switch/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Switch CONTROLLER — checked state + option mapping. No DOM.
__turbopack_context__.s([
    "switchController",
    ()=>switchController
]);
function switchController(opts = {}) {
    let checked = opts.checked ?? false;
    const disabled = opts.disabled ?? false;
    return {
        get checked () {
            return checked;
        },
        disabled,
        size: opts.size ?? 'md',
        tone: opts.tone ?? 'bright',
        setChecked (v) {
            checked = v;
        },
        toggle () {
            if (disabled) return checked;
            checked = !checked;
            opts.onChange?.(checked);
            return checked;
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/switch/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/switch/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/switch/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/switch/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SWITCH_CSS",
    ()=>SWITCH_CSS,
    "SWITCH_STYLE_ID",
    ()=>SWITCH_STYLE_ID
]);
const SWITCH_STYLE_ID = 'vela-ui-switch';
const SWITCH_CSS = `
.vela-switch {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid var(--vela-border);
    border-radius: 5px;
    background: transparent;
    color: transparent;
    cursor: pointer;
    line-height: 0;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}
.vela-switch .vela-icon, .vela-switch svg { display: block; width: 12px; height: 12px; }
.vela-switch[data-size='sm'] .vela-icon, .vela-switch[data-size='sm'] svg { width: 11px; height: 11px; }
.vela-switch:hover { border-color: var(--vela-fg-muted); }
.vela-switch[data-checked] {
    background: var(--vela-fg-bright);
    border-color: var(--vela-fg-bright);
    color: var(--vela-bg);
}
.vela-switch[data-size='sm'] { width: 18px; height: 18px; border-color: var(--vela-border-strong); }
.vela-switch[data-size='sm']:hover { border-color: var(--vela-fg-muted); }
.vela-switch[data-size='sm'][data-checked] {
    background: var(--vela-selected-bg);
    border-color: var(--vela-selected-bg);
    color: var(--vela-selected-fg);
}
.vela-switch[data-tone='selected'][data-checked] {
    background: var(--vela-selected-bg);
    border-color: var(--vela-selected-bg);
    color: var(--vela-selected-fg);
}
.vela-switch[disabled] { opacity: 0.4; cursor: default; }
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/switch/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Switch",
    ()=>Switch
]);
// Switch VIEW — square check-toggle (filled + check when on).
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/switch/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/switch/styles.ts [app-client] (ecmascript)");
;
;
;
;
class Switch {
    el;
    ctrl;
    constructor(opts = {}){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SWITCH_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SWITCH_CSS"], document);
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$switch$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchController"])(opts);
        const b = document.createElement('button');
        b.type = 'button';
        if (opts.id) b.id = opts.id;
        b.className = 'vela-switch';
        b.dataset.size = this.ctrl.size;
        b.dataset.tone = this.ctrl.tone;
        b.setAttribute('role', 'switch');
        if (this.ctrl.disabled) b.disabled = true;
        b.appendChild((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["iconEl"])('check', b.ownerDocument));
        this.el = b;
        this.paint();
        // Suppress the default mousedown focus: when this press outside-dismisses an open
        // popover, Chrome's focus action can scroll the dialog body under the pointer.
        b.addEventListener('pointerdown', (e)=>{
            e.preventDefault();
            b.focus({
                preventScroll: true
            });
        });
        b.addEventListener('click', ()=>{
            this.ctrl.toggle();
            this.paint();
        });
    }
    get checked() {
        return this.ctrl.checked;
    }
    setChecked(v) {
        this.ctrl.setChecked(v);
        this.paint();
    }
    paint() {
        const on = this.ctrl.checked;
        this.el.setAttribute('aria-checked', on ? 'true' : 'false');
        if (on) this.el.dataset.checked = '';
        else delete this.el.dataset.checked;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-area/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Text-area CONTROLLER — last-committed string. No DOM.
__turbopack_context__.s([
    "textAreaController",
    ()=>textAreaController
]);
function textAreaController(opts = {}) {
    let value = opts.value ?? '';
    return {
        get value () {
            return value;
        },
        size: opts.size ?? 'md',
        rows: opts.rows ?? 3,
        disabled: opts.disabled ?? false,
        commit (next) {
            if (next === value) return null;
            value = next;
            opts.onChange?.(next);
            return next;
        },
        sync (next) {
            value = next;
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-area/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-area/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-area/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-area/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TEXTAREA_CSS",
    ()=>TEXTAREA_CSS,
    "TEXTAREA_STYLE_ID",
    ()=>TEXTAREA_STYLE_ID
]);
const TEXTAREA_STYLE_ID = 'vela-ui-textarea';
const TEXTAREA_CSS = `
.vela-textarea { display: block; width: 100%; min-width: 0; }
.vela-textarea-field {
    display: block;
    width: 100%;
    box-sizing: border-box;
    min-height: 64px;
    background: transparent;
    border: 1px solid var(--vela-border-strong);
    border-radius: 6px;
    color: var(--vela-fg-bright);
    padding: 8px;
    font-size: 14px;
    font-family: inherit;
    line-height: 1.4;
    resize: vertical;
    outline: none;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    /* Selectable even under a user-select:none host (chart wrapper, .vela-ui). */
    user-select: text;
    -webkit-user-select: text;
}
.vela-textarea-field:hover { border-color: var(--vela-fg-muted); }
.vela-textarea-field:focus { border-color: var(--vela-focus); box-shadow: 0 0 0 3px var(--vela-focus-soft); }
.vela-textarea-field::placeholder { color: currentColor; opacity: 0.4; }
.vela-textarea[data-autogrow] .vela-textarea-field { resize: none; overflow-y: hidden; min-height: 46px; }
.vela-textarea[data-size='sm'] .vela-textarea-field {
    font-size: 13px;
    min-height: 46px;
    padding: 6px 9px;
    line-height: 18px;
}
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-area/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextArea",
    ()=>TextArea
]);
// Text-area VIEW — multi-line field, blur commit, optional auto-grow.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-area/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-area/styles.ts [app-client] (ecmascript)");
;
;
;
class TextArea {
    el;
    input;
    ctrl;
    autoGrow;
    maxLines;
    constructor(opts = {}){
        const doc = document;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXTAREA_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXTAREA_CSS"], doc);
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$area$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["textAreaController"])(opts);
        this.autoGrow = opts.autoGrow === true;
        this.maxLines = opts.maxLines ?? 4;
        const wrap = doc.createElement('div');
        wrap.className = 'vela-textarea';
        wrap.dataset.size = this.ctrl.size;
        if (this.autoGrow) wrap.dataset.autogrow = '';
        const ta = doc.createElement('textarea');
        ta.className = 'vela-textarea-field';
        if (opts.id) ta.id = opts.id;
        if (opts.placeholder) ta.placeholder = opts.placeholder;
        ta.rows = this.ctrl.rows;
        ta.value = this.ctrl.value;
        if (this.ctrl.disabled) ta.disabled = true;
        ta.addEventListener('blur', ()=>{
            this.ctrl.commit(ta.value);
        });
        if (this.autoGrow) {
            ta.addEventListener('input', ()=>this.grow());
        }
        wrap.appendChild(ta);
        this.el = wrap;
        this.input = ta;
        if (this.autoGrow) this.grow();
    }
    get value() {
        return this.ctrl.value;
    }
    setValue(v) {
        this.ctrl.sync(v);
        this.input.value = v;
        if (this.autoGrow) this.grow();
    }
    grow() {
        const ta = this.input;
        const lh = parseFloat(getComputedStyle(ta).lineHeight) || 18;
        const pad = ta.clientHeight - (ta.offsetHeight ? lh * (ta.rows || 1) : 0);
        const max = lh * this.maxLines + (Number.isFinite(pad) && pad > 0 ? pad : 12);
        ta.style.height = 'auto';
        ta.style.height = `${Math.min(ta.scrollHeight, max)}px`;
        ta.style.overflowY = ta.scrollHeight > max ? 'auto' : 'hidden';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-field/controller.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Text-field CONTROLLER — last-committed string. No DOM.
__turbopack_context__.s([
    "textFieldController",
    ()=>textFieldController
]);
function textFieldController(opts = {}) {
    let value = opts.value ?? '';
    const size = opts.size ?? 'md';
    return {
        get value () {
            return value;
        },
        size,
        fill: opts.fill ?? size !== 'sm',
        disabled: opts.disabled ?? false,
        commit (next) {
            if (next === value) return null;
            value = next;
            opts.onChange?.(next);
            return next;
        },
        sync (next) {
            value = next;
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-field/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$view$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-field/view.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-field/controller.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-field/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TEXT_CSS",
    ()=>TEXT_CSS,
    "TEXT_STYLE_ID",
    ()=>TEXT_STYLE_ID
]);
const TEXT_STYLE_ID = 'vela-ui-text-2';
const TEXT_CSS = `
.vela-text {
    display: inline-block;
    min-width: 0;
}
.vela-text[data-fill] { width: 100%; }
.vela-text:not([data-fill]) { width: 100px; flex: none; justify-self: start; }
.vela-text-field {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    height: 34px;
    background: transparent;
    border: 1px solid var(--vela-border-strong);
    border-radius: 6px;
    color: var(--vela-fg-bright);
    padding: 0 8px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    /* Selectable even under a user-select:none host (chart wrapper, .vela-ui). */
    user-select: text;
    -webkit-user-select: text;
}
.vela-text-field:hover { border-color: var(--vela-fg-muted); }
.vela-text-field:focus { border-color: var(--vela-focus); box-shadow: 0 0 0 3px var(--vela-focus-soft); }
.vela-text[data-size='sm'] .vela-text-field {
    height: 28px;
    background: var(--vela-surface-elev);
    border-radius: var(--vela-radius-sm);
    color: var(--vela-fg);
    font-size: 13px;
}
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/components/text-field/view.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextField",
    ()=>TextField
]);
// Text-field VIEW — blur/Enter commit.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-field/controller.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/ui/components/text-field/styles.ts [app-client] (ecmascript)");
;
;
;
class TextField {
    el;
    input;
    ctrl;
    constructor(opts = {}){
        const doc = document;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_STYLE_ID"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_CSS"], doc);
        this.ctrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$components$2f$text$2d$field$2f$controller$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["textFieldController"])(opts);
        const wrap = doc.createElement('div');
        wrap.className = 'vela-text';
        wrap.dataset.size = this.ctrl.size;
        if (this.ctrl.fill) wrap.dataset.fill = '';
        const ti = doc.createElement('input');
        ti.type = 'text';
        // Kill the UA ~20ch min-width so a 100px wrap (or fill parent) actually holds.
        ti.size = 1;
        if (opts.id) ti.id = opts.id;
        ti.value = this.ctrl.value;
        ti.className = 'vela-text-field';
        if (this.ctrl.disabled) ti.disabled = true;
        ti.addEventListener('blur', ()=>{
            this.ctrl.commit(ti.value);
        });
        ti.addEventListener('keydown', (e)=>{
            if (e.key === 'Enter') {
                e.preventDefault();
                ti.blur();
            }
        });
        wrap.appendChild(ti);
        this.el = wrap;
        this.input = ti;
    }
    get value() {
        return this.ctrl.value;
    }
    setValue(v) {
        this.ctrl.sync(v);
        this.input.value = v;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/icons.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "iconEl",
    ()=>iconEl
]);
// The UI kit's view of the icon registry: the icons themselves are pure string data in
// `core/icons` (shared with the renderer's own chrome), and this module adds the one DOM
// helper the kit and the widget consume them through.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/icons.ts [app-client] (ecmascript)");
;
;
function iconEl(id, doc = document) {
    const span = doc.createElement('span');
    span.className = 'vela-icon';
    span.setAttribute('aria-hidden', 'true');
    const svg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconMarkup"])(id);
    if (svg) span.innerHTML = svg;
    return span;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/sanitize-html.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attributeAllowed",
    ()=>attributeAllowed,
    "safeUrl",
    ()=>safeUrl,
    "sanitizeHtml",
    ()=>sanitizeHtml,
    "tagDisposition",
    ()=>tagDisposition
]);
// A conservative HTML allowlist for host-supplied rich text (the timeline-mark popups).
// The policy is pure string logic (node-testable); `sanitizeHtml` applies it with the
// real DOM parser — a `<template>` parses without executing anything — and rebuilds a
// fragment from allowed elements and attributes only, so scripts, styles, frames,
// event handlers and `javascript:` URLs never reach the page. Escaping would defeat the
// point (the markup would show as source); filtering keeps the formatting and drops the
// hazards.
/** Elements kept as-is (with their allowed attributes). */ const ALLOWED_TAGS = new Set([
    'a',
    'abbr',
    'b',
    'blockquote',
    'br',
    'code',
    'dd',
    'del',
    'div',
    'dl',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'ins',
    'kbd',
    'li',
    'mark',
    'ol',
    'p',
    'pre',
    'q',
    's',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'u',
    'ul'
]);
/** Elements dropped WITH their content — anything active, embedded, or form-shaped. */ const DROPPED_TAGS = new Set([
    'script',
    'style',
    'iframe',
    'frame',
    'frameset',
    'object',
    'embed',
    'applet',
    'form',
    'input',
    'textarea',
    'button',
    'select',
    'option',
    'link',
    'meta',
    'base',
    'svg',
    'math',
    'template',
    'noscript',
    'audio',
    'video',
    'canvas',
    'dialog',
    'head',
    'title'
]);
/** Per-element attributes kept, beyond the global `title`. */ const ALLOWED_ATTRS = {
    a: new Set([
        'href'
    ]),
    img: new Set([
        'src',
        'alt',
        'width',
        'height'
    ]),
    td: new Set([
        'colspan',
        'rowspan'
    ]),
    th: new Set([
        'colspan',
        'rowspan'
    ]),
    ol: new Set([
        'start'
    ])
};
/** URL schemes that run code or smuggle content; a URL with any of these is dropped. */ const BLOCKED_SCHEMES = new Set([
    'javascript',
    'vbscript',
    'data',
    'file',
    'blob'
]);
function tagDisposition(tag) {
    const t = tag.toLowerCase();
    if (DROPPED_TAGS.has(t)) return 'drop';
    return ALLOWED_TAGS.has(t) ? 'keep' : 'unwrap';
}
function attributeAllowed(tag, name) {
    const n = name.toLowerCase();
    if (n.startsWith('on') || n === 'style') return false;
    if (n === 'title') return true;
    return ALLOWED_ATTRS[tag.toLowerCase()]?.has(n) ?? false;
}
function safeUrl(value, absoluteOnly = false) {
    // Control characters and whitespace are stripped first: a scheme split by a tab or a
    // newline (`java\tscript:`) still runs once the browser normalizes it.
    let url = '';
    for (const ch of value)if (ch.charCodeAt(0) > 32) url += ch;
    const m = /^([a-z][a-z0-9+.-]*):/i.exec(url);
    const scheme = m ? m[1].toLowerCase() : null;
    if (scheme !== null && BLOCKED_SCHEMES.has(scheme)) return null;
    if (absoluteOnly && scheme !== 'http' && scheme !== 'https') return null;
    return url;
}
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
function sanitizeHtml(html, doc) {
    const tpl = doc.createElement('template');
    tpl.innerHTML = html;
    const out = doc.createDocumentFragment();
    copyChildren(tpl.content, out, doc);
    return out;
}
function copyChildren(from, to, doc) {
    for (const child of Array.from(from.childNodes)){
        if (child.nodeType === TEXT_NODE) {
            to.appendChild(doc.createTextNode(child.textContent ?? ''));
            continue;
        }
        if (child.nodeType !== ELEMENT_NODE) continue; // comments, processing instructions
        const el = child;
        const tag = el.tagName.toLowerCase();
        const disposition = tagDisposition(tag);
        if (disposition === 'drop') continue;
        if (disposition === 'unwrap') {
            copyChildren(el, to, doc);
            continue;
        }
        const clean = doc.createElement(tag);
        for (const attr of Array.from(el.attributes)){
            const name = attr.name.toLowerCase();
            if (!attributeAllowed(tag, name)) continue;
            let value = attr.value;
            if (name === 'href' || name === 'src') {
                const safe = safeUrl(value, name === 'src');
                if (safe === null) continue;
                value = safe;
            }
            clean.setAttribute(name, value);
        }
        if (tag === 'a') {
            clean.setAttribute('target', '_blank');
            clean.setAttribute('rel', 'noopener noreferrer');
        }
        copyChildren(el, clean, doc);
        to.appendChild(clean);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FIELD_FOCUS_CSS",
    ()=>FIELD_FOCUS_CSS,
    "FIELD_FOCUS_RING",
    ()=>FIELD_FOCUS_RING,
    "injectStyles",
    ()=>injectStyles,
    "overlayScrollbarCss",
    ()=>overlayScrollbarCss
]);
// Style delivery for the UI kit — JS-injected constructed sheets, same idiom as the
// renderer chrome (id-guarded <style> tags; no bundler CSS pipeline, works in Shadow DOM).
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$color$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/color.ts [app-client] (ecmascript)");
;
function overlayScrollbarCss(selector, width = 8) {
    return `${selector}::-webkit-scrollbar{width:${width}px;height:${width}px;}` + `${selector}::-webkit-scrollbar-thumb{background:var(--vela-scroll);border-radius:4px;border:2px solid transparent;background-clip:padding-box;}` + `${selector}::-webkit-scrollbar-track{background:transparent;}` + `${selector}::-webkit-scrollbar-button{display:none;width:0;height:0;}`;
}
const FIELD_FOCUS_CSS = 'outline:none;transition:border-color .12s ease,box-shadow .12s ease;';
const FIELD_FOCUS_RING = 'border-color:var(--vela-focus);box-shadow:0 0 0 3px var(--vela-focus-soft);';
function injectStyles(id, css, root = document) {
    if (typeof document === 'undefined') return;
    const host = root instanceof Document ? root.head : root;
    if (root.getElementById?.(id) ?? host.querySelector(`#${CSS.escape(id)}`)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    host.appendChild(s);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/tokens.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Design tokens — the single visual vocabulary every kit component (and widget chrome)
// consumes. Two layers:
//   • STATIC tokens (spacing, radii, z-index, motion, type scale): one shared sheet on
//     `.vela-ui` hosts — theme-independent.
//   • THEME tokens (surfaces, text, borders, states): computed from the chart's `VelaTheme`
//     by `themeTokens` (shared with the renderer's own chrome) and written as inline custom
//     properties on the host — the chart theme stays the single source of truth.
__turbopack_context__.s([
    "applyPlotOverlayTokens",
    ()=>applyPlotOverlayTokens,
    "applyThemeTokens",
    ()=>applyThemeTokens,
    "ensureUIHost",
    ()=>ensureUIHost,
    "floatingLayerHost",
    ()=>floatingLayerHost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/tokens.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/ui/styles.ts [app-client] (ecmascript) <locals>");
;
;
const STATIC_ID = 'vela-ui-tokens';
const STATIC_DECLS = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATIC_TOKENS"]).map(([k, v])=>`    ${k}: ${v};`).join('\n');
const STATIC_CSS = `
.vela-ui, .vela-ui-layer {
${STATIC_DECLS}
    font-family: var(--vela-font, -apple-system, system-ui, sans-serif);
    box-sizing: border-box;
    /* Chrome text (titles, buttons, menus, readouts) is UI, not copy — never selectable. */
    user-select: none;
    -webkit-user-select: none;
}
.vela-ui *, .vela-ui-layer * { box-sizing: border-box; }
/* Text ENTRY is the one exception: selection is part of editing. */
.vela-ui :is(input, textarea), .vela-ui-layer :is(input, textarea) { user-select: text; -webkit-user-select: text; }
/* iOS Safari zooms the page when a focused field is under 16px, and often
   keeps that zoom after the field blurs or a dialog closes. The shell's
   mobile size class is the honest gate — not a media query — so an embedded
   chart on a wide desktop still gets the rule when it is in the phone layout.
   Scoped to the kit root so a host page's own [data-layout] is never touched. */
.vela-ui[data-layout='mobile'] :is(input, textarea, select) { font-size: 16px; }
.vela-icon { display: inline-flex; align-items: center; flex: none; }
.vela-icon svg { display: block; }
`;
function applyThemeTokens(el, t) {
    const tokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["themeTokens"])(t);
    for(const key in tokens)el.style.setProperty(key, tokens[key]);
}
function applyPlotOverlayTokens(host, base, config) {
    const layout = config?.layout;
    const t = layout?.background && layout.textColor ? {
        ...base,
        background: layout.background,
        textColor: layout.textColor
    } : base;
    applyThemeTokens(host, t);
}
function floatingLayerHost(from, fallback) {
    return from.closest('.vela-ui') ?? fallback ?? from;
}
function ensureUIHost(el, theme) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$ui$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["injectStyles"])(STATIC_ID, STATIC_CSS, el.getRootNode());
    el.classList.add('vela-ui');
    if (theme) applyThemeTokens(el, theme);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/charting/ui/zag.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "nextUid",
    ()=>nextUid,
    "runMachine",
    ()=>runMachine
]);
// The controller ↔ view bridge for Zag-machine components. HEADLESS-FIRST: a component's
// controller is a running Zag machine (framework-agnostic state/behavior/ARIA); the vanilla
// view subscribes and projects api props onto its own DOM via `spreadProps`. A future
// `vela/react` reuses the SAME machines through Zag's React adapter and swaps only the view.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$machine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/vanilla/dist/machine.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$normalize$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/vanilla/dist/normalize-props.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$spread$2d$props$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@zag-js/vanilla/dist/spread-props.mjs [app-client] (ecmascript)");
;
;
function runMachine(machine, props, render) {
    const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$zag$2d$js$2f$vanilla$2f$dist$2f$machine$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VanillaMachine"](machine, props);
    const unsub = m.subscribe(render);
    m.start();
    render(m.service);
    return {
        service: m.service,
        flush: ()=>render(m.service),
        stop: ()=>{
            unsub();
            m.stop();
        }
    };
}
let uid = 0;
function nextUid(prefix) {
    return `${prefix}-${++uid}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_charting_ui_1hd_3i1._.js.map