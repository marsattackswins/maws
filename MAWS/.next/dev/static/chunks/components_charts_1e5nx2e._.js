(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/charts/ChartAutoScale.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartAutoScale",
    ()=>ChartAutoScale,
    "applyAutoFit",
    ()=>applyAutoFit,
    "clearAutoFit",
    ()=>clearAutoFit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/drawings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartScaleMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/ChartScaleMenu.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const TIME_AXIS_H = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHART_TIME_AXIS_H"];
/** Approximate right price-axis width (Vela does not expose a measured width). */ const FALLBACK_AXIS_W = 56;
function applyAutoFit(paneId) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId);
    if (!handle) return;
    // Price axis only — fit visible candles vertically; leave time zoom/scroll alone.
    try {
        handle.vela.renderer.set("autoScale", true);
    } catch  {
    /* renderer may not expose the feature */ }
}
function rightAxisWidth(_paneId) {
    return FALLBACK_AXIS_W;
}
function isAutoScaleOn(paneId) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId);
    if (!handle) return true;
    try {
        return handle.vela.renderer.get("autoScale") !== false;
    } catch  {
        return true;
    }
}
/**
 * Measure the bottom-right corner of the **main price pane** (pane index 0)
 * so the "auto" label is anchored there — not at the very bottom of the full
 * chart, which sinks below all indicator sub-panes.
 */ function measureAutoCorner(host, _paneId) {
    const hostRect = host.getBoundingClientRect();
    const axisW = rightAxisWidth(_paneId);
    // Geometry-based: the price axis column sits at the bottom-right of the host.
    return {
        left: Math.round(hostRect.width - axisW),
        top: Math.round(hostRect.height - TIME_AXIS_H),
        width: axisW,
        height: TIME_AXIS_H
    };
}
function isOnPriceOrTimeScale(host, _paneId, clientX, clientY) {
    const rect = host.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return false;
    const rightW = FALLBACK_AXIS_W;
    const onRightPrice = x >= rect.width - rightW - 1;
    const onTime = y >= rect.height - TIME_AXIS_H;
    return onRightPrice || onTime;
}
function isInAutoCorner(host, paneId, clientX, clientY) {
    const rightW = rightAxisWidth(paneId);
    const rect = host.getBoundingClientRect();
    return clientX >= rect.right - rightW && clientY >= rect.bottom - TIME_AXIS_H;
}
function clearAutoFit(paneId) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId);
    if (!handle) return;
    // The current price window is kept as-is; only auto-fitting is disabled.
    try {
        handle.vela.renderer.set("autoScale", false);
    } catch  {
    /* renderer may not expose the feature */ }
}
function ChartAutoScale({ paneId, mode, hostRef, active, onActiveChange }) {
    _s();
    const setActivePane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartAutoScale.useAppStore[setActivePane]": (s)=>s.setActivePane
    }["ChartAutoScale.useAppStore[setActivePane]"]);
    const [corner, setCorner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        left: 0,
        top: 0,
        width: FALLBACK_AXIS_W,
        height: TIME_AXIS_H
    });
    // Track the live scale-corner cell so the label fills and centers in it.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartAutoScale.useEffect": ()=>{
            if (mode === "never") return;
            const sync = {
                "ChartAutoScale.useEffect.sync": ()=>{
                    const host = hostRef.current;
                    if (!host) return;
                    const next = measureAutoCorner(host, paneId);
                    setCorner({
                        "ChartAutoScale.useEffect.sync": (prev)=>prev.left === next.left && prev.top === next.top && prev.width === next.width && prev.height === next.height ? prev : next
                    }["ChartAutoScale.useEffect.sync"]);
                }
            }["ChartAutoScale.useEffect.sync"];
            sync();
            const host = hostRef.current;
            const ro = host ? new ResizeObserver(sync) : null;
            if (host && ro) ro.observe(host);
            window.addEventListener("resize", sync);
            return ({
                "ChartAutoScale.useEffect": ()=>{
                    ro?.disconnect();
                    window.removeEventListener("resize", sync);
                }
            })["ChartAutoScale.useEffect"];
        }
    }["ChartAutoScale.useEffect"], [
        hostRef,
        mode,
        paneId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartAutoScale.useEffect": ()=>{
            const host = hostRef.current;
            if (!host || mode === "never") return;
            const deactivate = {
                "ChartAutoScale.useEffect.deactivate": ()=>{
                    clearAutoFit(paneId);
                    onActiveChange(false);
                }
            }["ChartAutoScale.useEffect.deactivate"];
            const onPointerDown = {
                "ChartAutoScale.useEffect.onPointerDown": (e)=>{
                    if (isInAutoCorner(host, paneId, e.clientX, e.clientY)) return;
                    if (!isOnPriceOrTimeScale(host, paneId, e.clientX, e.clientY)) return;
                    deactivate();
                }
            }["ChartAutoScale.useEffect.onPointerDown"];
            const onPointerUp = {
                "ChartAutoScale.useEffect.onPointerUp": ()=>{
                    if (!isAutoScaleOn(paneId) && active) onActiveChange(false);
                }
            }["ChartAutoScale.useEffect.onPointerUp"];
            const onWheel = {
                "ChartAutoScale.useEffect.onWheel": (e)=>{
                    if (isInAutoCorner(host, paneId, e.clientX, e.clientY)) return;
                    if (!isOnPriceOrTimeScale(host, paneId, e.clientX, e.clientY)) return;
                    deactivate();
                }
            }["ChartAutoScale.useEffect.onWheel"];
            host.addEventListener("pointerdown", onPointerDown);
            host.addEventListener("pointerup", onPointerUp);
            host.addEventListener("wheel", onWheel, {
                passive: true
            });
            return ({
                "ChartAutoScale.useEffect": ()=>{
                    host.removeEventListener("pointerdown", onPointerDown);
                    host.removeEventListener("pointerup", onPointerUp);
                    host.removeEventListener("wheel", onWheel);
                }
            })["ChartAutoScale.useEffect"];
        }
    }["ChartAutoScale.useEffect"], [
        active,
        hostRef,
        mode,
        onActiveChange,
        paneId
    ]);
    // Keep the auto button / engine aligned with the persisted preference.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartAutoScale.useEffect": ()=>{
            if (mode === "never") return;
            const sync = {
                "ChartAutoScale.useEffect.sync": ()=>{
                    const chartAuto = isAutoScaleOn(paneId);
                    if (chartAuto === active) return;
                    if (!chartAuto && active) {
                        onActiveChange(false);
                    } else if (chartAuto && !active) {
                        clearAutoFit(paneId);
                    }
                }
            }["ChartAutoScale.useEffect.sync"];
            sync();
            const host = hostRef.current;
            const ro = host ? new ResizeObserver(sync) : null;
            if (host && ro) ro.observe(host);
            return ({
                "ChartAutoScale.useEffect": ()=>{
                    ro?.disconnect();
                }
            })["ChartAutoScale.useEffect"];
        }
    }["ChartAutoScale.useEffect"], [
        active,
        hostRef,
        mode,
        onActiveChange,
        paneId
    ]);
    const chartBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartAutoScale.useAppStore": (s)=>s.chartSettings.backgroundColor
    }["ChartAutoScale.useAppStore"]) || "#000000";
    if (mode === "never") return null;
    const visibility = mode === "always" ? "opacity-100" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto";
    const GEAR_W = 20;
    const containerStyle = {
        position: "absolute",
        left: corner.left,
        top: corner.top,
        width: corner.width,
        height: corner.height,
        backgroundColor: chartBg,
        zIndex: 40
    };
    const autoStyle = {
        width: corner.width - GEAR_W,
        height: "100%"
    };
    const gearStyle = {
        width: GEAR_W,
        height: "100%",
        position: "relative"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: containerStyle,
        className: `flex items-center justify-between transition-opacity duration-100 ${visibility}`,
        onMouseDown: (e)=>{
            e.preventDefault();
            e.stopPropagation();
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                title: active ? "Auto on — click to turn off" : "Auto (fit visible prices)",
                "aria-label": "Auto scale",
                "aria-pressed": active,
                style: autoStyle,
                className: `flex items-center justify-center border-0 bg-transparent p-0 text-center text-[11px] leading-none transition-colors duration-100 ${active ? "font-bold text-white" : "font-medium text-(--app-muted) hover:text-(--app-text)"}`,
                onClick: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    setActivePane(paneId);
                    if (active) {
                        clearAutoFit(paneId);
                        onActiveChange(false);
                        return;
                    }
                    applyAutoFit(paneId);
                    onActiveChange(true);
                },
                children: "auto"
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartAutoScale.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartScaleMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartScaleMenu"], {
                paneId: paneId,
                style: gearStyle,
                visibility: "opacity-100",
                autoScaleOn: active,
                onAutoChangeAction: onActiveChange
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartAutoScale.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartAutoScale.tsx",
        lineNumber: 240,
        columnNumber: 5
    }, this);
}
_s(ChartAutoScale, "MQbfbBnAb9swPJ/jAmE7xIOcUvI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ChartAutoScale;
var _c;
__turbopack_context__.k.register(_c, "ChartAutoScale");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/ChartCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartCanvas",
    ()=>ChartCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * ChartCanvas.tsx — Vela implementation.
 *
 * Mounts one Vela chart per pane:
 *  - Feeds candles via Vela's native BinanceProvider (REST history + kline
 *    WebSocket) — no Next.js API routes or MAWS feed in the chart data path.
 *  - Wires PineEngine (@luxalgo/vela-pinets) for Pine Script 6 indicators.
 *  - Syncs MAWS studies → Vela indicators (Pine or native).
 *  - Keeps its NativeRenderer reference in the chart registry so overlay
 *    owners can push renderer-layer payloads (order blocks, session breaks).
 *  - Two-way bar-replay sync: Vela owns the replay clock, the Zustand slice
 *    mirrors cursorTime/remaining so overlays and the bar UI follow.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$NativeRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/native/NativeRenderer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$Vela$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/Vela.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$luxalgo$2f$vela$2d$pinets$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@luxalgo/vela-pinets/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$feed$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/vela-feed-adapter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/vela-indicators.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$native$2d$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/vela-native-indicators.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$chart$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/vela-chart-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/app-theme.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
function toVelaTf(tf) {
    const map = {
        "1m": "1",
        "3m": "3",
        "5m": "5",
        "15m": "15",
        "30m": "30",
        "1h": "60",
        "2h": "120",
        "4h": "240",
        "1D": "1D",
        "1W": "1W",
        "1M": "1M"
    };
    return map[tf] ?? "60";
}
function replayIntervalMs(speed) {
    return Math.max(40, 420 / Math.max(0.5, speed));
}
const ChartCanvas = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function ChartCanvas({ pane, active: _active, onSymbolClick: _onSymbolClick, onCrosshair, onStudyLayouts }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartCanvas.ChartCanvas.useAppStore[settings]": (s)=>s.chartSettings
    }["ChartCanvas.ChartCanvas.useAppStore[settings]"]);
    const liveStudies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartCanvas.ChartCanvas.useAppStore[liveStudies]": (s)=>s.panes.find({
                "ChartCanvas.ChartCanvas.useAppStore[liveStudies]": (p)=>p.id === pane.id
            }["ChartCanvas.ChartCanvas.useAppStore[liveStudies]"])?.studies ?? pane.studies
    }["ChartCanvas.ChartCanvas.useAppStore[liveStudies]"]);
    const indicatorsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartCanvas.ChartCanvas.useAppStore[indicatorsHidden]": (s)=>s.indicatorsHidden
    }["ChartCanvas.ChartCanvas.useAppStore[indicatorsHidden]"]);
    const replay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartCanvas.ChartCanvas.useAppStore[replay]": (s)=>s.replay
    }["ChartCanvas.ChartCanvas.useAppStore[replay]"]);
    /** True while a store patch was caused BY a Vela replay event (suppress echo). */ const replayEchoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const onCrosshairRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onCrosshair);
    onCrosshairRef.current = onCrosshair;
    // Mount / re-mount when pane.id, timeframe, or symbol changes.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.ChartCanvas.useEffect": ()=>{
            const el = containerRef.current;
            if (!el) return;
            const s = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().chartSettings;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$NativeRenderer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NativeRenderer"]();
            const chart = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$Vela$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vela"](el, {
                symbol: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$feed$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toVelaTicker"])(pane.symbol),
                timeframe: toVelaTf(pane.timeframe),
                // One palette for charts + shell: the persisted app theme (Vela-driven).
                theme: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["velaThemeNameFromAppSettings"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().appSettings),
                volume: true,
                live: true,
                currentPriceLine: true,
                // The shared top-bar drawing bar (VelaDrawingBar) owns tool-picking — hide
                // the in-chart left rail.
                drawings: {
                    toolbar: false
                },
                upColor: s.bodyUpColor ?? undefined,
                downColor: s.bodyDownColor ?? undefined,
                logScale: s.logScale ?? false
            }, {
                engines: [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$luxalgo$2f$vela$2d$pinets$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PineEngine"]()
                ],
                renderer
            });
            // Vela's native BinanceProvider: chart fetches history + streams live
            // klines directly from Binance (no Next.js API routes in the data path).
            chart.data.registerProvider("binance", __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$feed$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mawsVelaProvider"]);
            // Restore the pane's persisted Vela-native indicators (catalog adds must
            // survive reloads). Vela's auto-added built-in volume is excluded.
            for (const native of pane.natives ?? []){
                try {
                    const handle = chart.addNativeIndicator(native.type, {
                        inputs: native.inputs
                    });
                    if (native.hidden) handle?.setVisible(false);
                } catch  {
                /* type unknown to this build — drop it */ }
            }
            chartRef.current = chart;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerChart"])(pane.id, {
                vela: chart,
                renderer,
                el
            });
            onStudyLayouts?.([]);
            // Crosshair: Vela's public renderer seam → MAWS hover UI + multi-chart sync.
            const offCrosshair = chart.renderer.onCrosshairMove({
                "ChartCanvas.ChartCanvas.useEffect.offCrosshair": (e)=>{
                    if (e.price != null) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLastCrosshair"])({
                            paneId: pane.id,
                            price: e.price,
                            time: e.time ?? null
                        });
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncCrosshairToOthers"])(pane.id, e.time ?? null, e.price);
                    } else {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncCrosshairToOthers"])(pane.id, null, null);
                    }
                    onCrosshairRef.current?.({
                        price: e.price ?? 0,
                        time: e.time != null ? Math.floor(e.time / 1000) : null,
                        y: 0,
                        axisWidth: 60
                    });
                }
            }["ChartCanvas.ChartCanvas.useEffect.offCrosshair"]);
            // Viewport sync across the multi-chart grid.
            const offViewport = chart.on("viewport:changed", {
                "ChartCanvas.ChartCanvas.useEffect.offViewport": (r)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncVisibleRangeToOthers"])(pane.id, r);
                }
            }["ChartCanvas.ChartCanvas.useEffect.offViewport"]);
            // ── Chart settings: Vela's native dialog is the ONLY chart settings system ──
            // 1) Seed Vela's config from the persisted MAWS chartSettings (one-way, mount).
            // 2) Contribute MAWS-only chart knobs as host tabs of the SAME dialog.
            // 3) Mirror dialog edits back into the store (diff-only → echo-free) so they
            //    persist and every MAWS consumer follows.
            try {
                chart.renderer.set({
                    settings: true
                }); // show Vela's in-chart gear
                renderer.applyConfig((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$chart$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mawsToVelaConfig"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().chartSettings));
                renderer.setSettingsSections((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$chart$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mawsHostSections"])());
            } catch  {
            /* renderer without the settings seam — chart still renders */ }
            // The dialog's Canvas → Theme row drives the WHOLE app: the picked Vela
            // theme reskins every panel (appSettings) and every chart follows because
            // all charts re-run setTheme from the same store slice.
            const offTheme = renderer.onThemeSelect({
                "ChartCanvas.ChartCanvas.useEffect.offTheme": (name)=>{
                    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyVelaThemeEverywhere"])(name);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAppSettings(next);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEachChart"])({
                        "ChartCanvas.ChartCanvas.useEffect.offTheme": (_, h)=>{
                            try {
                                h.vela.setTheme(name);
                            } catch  {
                            /* chart tearing down */ }
                        }
                    }["ChartCanvas.ChartCanvas.useEffect.offTheme"]);
                }
            }["ChartCanvas.ChartCanvas.useEffect.offTheme"]);
            const offConfig = renderer.onConfigChanged({
                "ChartCanvas.ChartCanvas.useEffect.offConfig": ()=>{
                    try {
                        const patch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$chart$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["velaToMawsPatch"])(renderer.getConfig(), __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().chartSettings);
                        if (Object.keys(patch).length > 0) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().patchChartSettings(patch);
                        }
                    } catch  {
                    /* ignore */ }
                }
            }["ChartCanvas.ChartCanvas.useEffect.offConfig"]);
            // Replay events → Zustand replay slice (single source of truth for overlays).
            // Vela owns the replay clock: cursorTime/remaining flow from Vela's replay
            // events into the store; the store never computes replay positions itself.
            const offs = [
                offConfig,
                offTheme
            ];
            const syncReplayCursor = {
                "ChartCanvas.ChartCanvas.useEffect.syncReplayCursor": (cursorTime, remaining)=>{
                    const st = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                    if (st.replay?.paneId !== pane.id) return;
                    const r = st.replay;
                    if (r.cursorTime !== cursorTime || r.remaining !== remaining) {
                        replayEchoRef.current = true;
                        st.patchReplay({
                            cursorTime,
                            remaining,
                            index: remaining,
                            total: remaining + 1
                        });
                    }
                }
            }["ChartCanvas.ChartCanvas.useEffect.syncReplayCursor"];
            offs.push(chart.on("replay:start", {
                "ChartCanvas.ChartCanvas.useEffect": (p)=>syncReplayCursor(p.cursorTime, p.remaining)
            }["ChartCanvas.ChartCanvas.useEffect"]));
            offs.push(chart.on("replay:step", {
                "ChartCanvas.ChartCanvas.useEffect": (p)=>syncReplayCursor(p.cursorTime, p.remaining)
            }["ChartCanvas.ChartCanvas.useEffect"]));
            offs.push(chart.on("replay:play", {
                "ChartCanvas.ChartCanvas.useEffect": ()=>{
                    const st = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                    if (st.replay?.paneId === pane.id && !st.replay.playing) {
                        replayEchoRef.current = true;
                        st.patchReplay({
                            playing: true
                        });
                    }
                }
            }["ChartCanvas.ChartCanvas.useEffect"]));
            offs.push(chart.on("replay:pause", {
                "ChartCanvas.ChartCanvas.useEffect": ()=>{
                    const st = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                    if (st.replay?.paneId === pane.id && st.replay.playing) {
                        replayEchoRef.current = true;
                        st.patchReplay({
                            playing: false
                        });
                    }
                }
            }["ChartCanvas.ChartCanvas.useEffect"]));
            offs.push(chart.on("replay:end", {
                "ChartCanvas.ChartCanvas.useEffect": ()=>{
                    const st = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
                    if (st.replay?.paneId === pane.id) st.stopReplay();
                }
            }["ChartCanvas.ChartCanvas.useEffect"]));
            // Native persistence: mirror every NON-managed Vela-native instance into
            // the pane state (excludes Vela's auto-added built-in volume and the
            // store studies the bridge mounts under managed ids).
            const persistNatives = {
                "ChartCanvas.ChartCanvas.useEffect.persistNatives": ()=>{
                    const natives = chart.indicators().filter({
                        "ChartCanvas.ChartCanvas.useEffect.persistNatives.natives": (h)=>h.nativeType && h.nativeType !== "volume" && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isManagedHandle"])(chart, h.id)
                    }["ChartCanvas.ChartCanvas.useEffect.persistNatives.natives"]).map({
                        "ChartCanvas.ChartCanvas.useEffect.persistNatives.natives": (h)=>({
                                type: h.nativeType,
                                inputs: {
                                    ...h.inputValues()
                                },
                                hidden: !h.visible
                            })
                    }["ChartCanvas.ChartCanvas.useEffect.persistNatives.natives"]);
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setPaneNatives(pane.id, natives);
                }
            }["ChartCanvas.ChartCanvas.useEffect.persistNatives"];
            offs.push(chart.on("indicator:added", persistNatives));
            offs.push(chart.on("indicator:removed", persistNatives));
            offs.push(chart.on("indicator:inputs", persistNatives));
            offs.push(chart.on("indicator:visibility", persistNatives));
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncVelaIndicators"])(chart, liveStudies);
            return ({
                "ChartCanvas.ChartCanvas.useEffect": ()=>{
                    chartRef.current = null;
                    offCrosshair();
                    offViewport();
                    for (const off of offs)off();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeManagedIndicators"])(chart);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unregisterChart"])(pane.id);
                    try {
                        chart.destroy();
                    } catch  {
                    /* teardown race */ }
                }
            })["ChartCanvas.ChartCanvas.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ChartCanvas.ChartCanvas.useEffect"], [
        pane.id,
        pane.symbol,
        pane.timeframe
    ]);
    // Sync indicators when studies change (without remounting the chart).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.ChartCanvas.useEffect": ()=>{
            const chart = chartRef.current;
            if (!chart) return;
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncVelaIndicators"])(chart, liveStudies);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ChartCanvas.ChartCanvas.useEffect"], [
        liveStudies
    ]);
    // "Hide indicators" toolbar toggle → every Vela indicator's visibility
    // (MAWS studies AND natives added from the catalog menu share Vela's
    // handles; the legend eye reflects the same state).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.ChartCanvas.useEffect": ()=>{
            const chart = chartRef.current;
            if (!chart) return;
            for (const handle of chart.indicators()){
                try {
                    handle.setVisible(!indicatorsHidden);
                } catch  {
                /* already torn down */ }
            }
        }
    }["ChartCanvas.ChartCanvas.useEffect"], [
        indicatorsHidden,
        liveStudies
    ]);
    // Replay: Zustand slice → Vela chart.replay (start/seek/play/pause/stop).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.ChartCanvas.useEffect": ()=>{
            const chart = chartRef.current;
            if (!chart) return;
            if (replayEchoRef.current) {
                replayEchoRef.current = false;
                return;
            }
            if (replay?.paneId !== pane.id) {
                if (chart.replay.state.active) chart.replay.stop();
                return;
            }
            // Vela is the replay clock: the store only carries the paneId + playing
            // state and Vela's own start position (bounds' latest bar) decides where
            // replay begins; the slider seeks Vela directly via cursorTime.
            const st = chart.replay.state;
            if (!st.active) {
                const bounds = chart.replay.bounds;
                const fromMs = replay.cursorTime ?? bounds?.last ?? null;
                if (fromMs == null) return;
                void chart.replay.start({
                    from: fromMs
                }).then({
                    "ChartCanvas.ChartCanvas.useEffect": ()=>{
                        const r = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().replay;
                        if (r?.paneId !== pane.id) return;
                        if (r.playing) chart.replay.play(replayIntervalMs(r.speed));
                        else chart.replay.pause();
                    }
                }["ChartCanvas.ChartCanvas.useEffect"]);
                return;
            }
            // Active: seek when the requested cursor moved, then follow play/pause.
            if (replay.cursorTime != null && (st.cursorTime == null || Math.abs(st.cursorTime - replay.cursorTime) > 1)) {
                void chart.replay.start({
                    from: replay.cursorTime
                });
            }
            if (replay.playing) chart.replay.play(replayIntervalMs(replay.speed));
            else chart.replay.pause();
        }
    }["ChartCanvas.ChartCanvas.useEffect"], [
        replay,
        pane.id,
        pane.symbol,
        pane.timeframe
    ]);
    // Chart settings → Vela renderer features (live, no indicator re-run).
    // The indicator legend rows are Vela's own (per pane, with eye/gear/✕); the
    // MAWS "Indicator titles" setting drives them through `indicatorTitles`.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.ChartCanvas.useEffect": ()=>{
            const chart = chartRef.current;
            if (!chart) return;
            try {
                chart.renderer.set({
                    upColor: settings.bodyUpColor ?? "#089981",
                    downColor: settings.bodyDownColor ?? "#f23645",
                    logScale: settings.logScale ?? false,
                    indicatorTitles: settings.showIndicatorLegend !== false,
                    indicatorValues: settings.showIndicatorValues !== false
                });
            } catch  {
            /* renderer feature missing — ignore */ }
        }
    }["ChartCanvas.ChartCanvas.useEffect"], [
        settings
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "relative z-10 h-full min-h-0 w-full",
        "data-active": _active ? "true" : "false"
    }, void 0, false, {
        fileName: "[project]/components/charts/ChartCanvas.tsx",
        lineNumber: 375,
        columnNumber: 5
    }, this);
}, "fUnzd+exSFwOIx73vQIILaCYR+Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
})), "fUnzd+exSFwOIx73vQIILaCYR+Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = ChartCanvas;
var _c, _c1;
__turbopack_context__.k.register(_c, "ChartCanvas$memo");
__turbopack_context__.k.register(_c1, "ChartCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/ChartContextMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartContextMenu",
    ()=>ChartContextMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/ui-orders.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/symbol-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alarm$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlarmClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alarm-clock.mjs [app-client] (ecmascript) <export default as AlarmClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$paste$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardPaste$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-paste.mjs [app-client] (ecmascript) <export default as ClipboardPaste>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/table-2.mjs [app-client] (ecmascript) <export default as Table2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function Item({ label, shortcut, icon, onClick, trailing }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: "ctx-item",
        onClick: onClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ctx-ico",
                children: icon ?? null
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ctx-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ctx-label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    shortcut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ctx-shortcut",
                        children: shortcut
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                        lineNumber: 39,
                        columnNumber: 21
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            trailing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ctx-trail",
                children: trailing
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 41,
                columnNumber: 19
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartContextMenu.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = Item;
function SellIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 14 14",
        fill: "none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 5.5 7 10l4-4.5",
            stroke: "currentColor",
            strokeWidth: "1.4"
        }, void 0, false, {
            fileName: "[project]/components/charts/ChartContextMenu.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/charts/ChartContextMenu.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c1 = SellIcon;
function BuyIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 14 14",
        fill: "none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 8.5 7 4l4 4.5",
            stroke: "currentColor",
            strokeWidth: "1.4"
        }, void 0, false, {
            fileName: "[project]/components/charts/ChartContextMenu.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/charts/ChartContextMenu.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c2 = BuyIcon;
function ChartContextMenu() {
    _s();
    const menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[menu]": (s)=>s.contextMenu
    }["ChartContextMenu.useAppStore[menu]"]);
    const setContextMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[setContextMenu]": (s)=>s.setContextMenu
    }["ChartContextMenu.useAppStore[setContextMenu]"]);
    const setRightDock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[setRightDock]": (s)=>s.setRightDock
    }["ChartContextMenu.useAppStore[setRightDock]"]);
    const addAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[addAlert]": (s)=>s.addAlert
    }["ChartContextMenu.useAppStore[addAlert]"]);
    const setClipboardPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[setClipboardPrice]": (s)=>s.setClipboardPrice
    }["ChartContextMenu.useAppStore[setClipboardPrice]"]);
    const clipboardPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[clipboardPrice]": (s)=>s.clipboardPrice
    }["ChartContextMenu.useAppStore[clipboardPrice]"]);
    const addDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[addDrawing]": (s)=>s.addDrawing
    }["ChartContextMenu.useAppStore[addDrawing]"]);
    const clearDrawings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[clearDrawings]": (s)=>s.clearDrawings
    }["ChartContextMenu.useAppStore[clearDrawings]"]);
    const clearIndicators = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[clearIndicators]": (s)=>s.clearIndicators
    }["ChartContextMenu.useAppStore[clearIndicators]"]);
    const setRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[setRange]": (s)=>s.setRange
    }["ChartContextMenu.useAppStore[setRange]"]);
    const vertCursorLocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[vertCursorLocked]": (s)=>s.vertCursorLocked
    }["ChartContextMenu.useAppStore[vertCursorLocked]"]);
    const setVertCursorLocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[setVertCursorLocked]": (s)=>s.setVertCursorLocked
    }["ChartContextMenu.useAppStore[setVertCursorLocked]"]);
    const setLockedCursorTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[setLockedCursorTime]": (s)=>s.setLockedCursorTime
    }["ChartContextMenu.useAppStore[setLockedCursorTime]"]);
    const templates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[templates]": (s)=>s.chartTemplates
    }["ChartContextMenu.useAppStore[templates]"]);
    const applyChartTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[applyChartTemplate]": (s)=>s.applyChartTemplate
    }["ChartContextMenu.useAppStore[applyChartTemplate]"]);
    const saveChartTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[saveChartTemplate]": (s)=>s.saveChartTemplate
    }["ChartContextMenu.useAppStore[saveChartTemplate]"]);
    const [tplOpen, setTplOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartContextMenu.useAppStore[pane]": (s)=>menu ? s.panes.find({
                "ChartContextMenu.useAppStore[pane]": (p)=>p.id === menu.paneId
            }["ChartContextMenu.useAppStore[pane]"]) : undefined
    }["ChartContextMenu.useAppStore[pane]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartContextMenu.useEffect": ()=>{
            if (!menu) return;
            const close = {
                "ChartContextMenu.useEffect.close": ()=>setContextMenu(null)
            }["ChartContextMenu.useEffect.close"];
            const timer = window.setTimeout({
                "ChartContextMenu.useEffect.timer": ()=>{
                    window.addEventListener("mousedown", close);
                }
            }["ChartContextMenu.useEffect.timer"], 0);
            return ({
                "ChartContextMenu.useEffect": ()=>{
                    window.clearTimeout(timer);
                    window.removeEventListener("mousedown", close);
                }
            })["ChartContextMenu.useEffect"];
        }
    }["ChartContextMenu.useEffect"], [
        menu,
        setContextMenu
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartContextMenu.useEffect": ()=>{
            setTplOpen(false);
        }
    }["ChartContextMenu.useEffect"], [
        menu
    ]);
    if (!menu || !pane) return null;
    const close = ()=>setContextMenu(null);
    const price = menu.price;
    const priceLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(pane.symbol, price);
    const drawings = pane.drawings.length;
    const indicators = pane.studies.length;
    const resetChart = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id)?.vela.setVisibleRangePreset("ALL");
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id)?.vela.renderer.set("autoScale", true);
        } catch  {
        /* ignore */ }
        setRange("All");
    };
    const pastePrice = async ()=>{
        let value = clipboardPrice;
        try {
            const text = await navigator.clipboard.readText();
            const n = Number(text.replace(/,/g, ""));
            if (Number.isFinite(n) && n > 0) value = n;
        } catch  {
        /* stored */ }
        if (value == null) return;
        const t = menu.time ?? Math.floor(Date.now() / 1000);
        addDrawing(pane.id, {
            id: Math.random().toString(36).slice(2, 10),
            tool: "hray",
            points: [
                {
                    time: t,
                    price: value
                }
            ],
            color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TV"].blue
        });
    };
    const addOrderAlert = (side)=>{
        addAlert({
            symbol: pane.symbol,
            price,
            side,
            enabled: true
        });
        setRightDock("alerts");
    };
    const marginLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMarginLabel"])(pane.symbol);
    const place = (side, type)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitOrderFromUi"])({
            symbol: pane.symbol,
            side,
            type,
            price,
            qty: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOrderQty"])(pane.symbol, price),
            clientOrderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newClientOrderId"])()
        });
    };
    const style = {
        left: Math.min(menu.x, window.innerWidth - 316),
        top: Math.min(menu.y, window.innerHeight - 520)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ctx-menu",
        style: style,
        onClick: (e)=>e.stopPropagation(),
        onMouseDown: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 167,
                    columnNumber: 15
                }, this),
                label: "Reset chart view",
                shortcut: "Alt + R",
                onClick: ()=>{
                    resetChart();
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ctx-sep"
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$paste$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardPaste$3e$__["ClipboardPaste"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 177,
                    columnNumber: 15
                }, this),
                label: "Paste",
                shortcut: "Ctrl + V",
                onClick: ()=>{
                    void pastePrice();
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 186,
                    columnNumber: 15
                }, this),
                label: `Copy price ${priceLabel}`,
                onClick: ()=>{
                    setClipboardPrice(price);
                    void navigator.clipboard.writeText(String(price));
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alarm$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlarmClock$3e$__["AlarmClock"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 195,
                    columnNumber: 15
                }, this),
                label: `Add alert on ${pane.symbol} at ${priceLabel}…`,
                shortcut: "Alt + A",
                onClick: ()=>{
                    addOrderAlert("above");
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SellIcon, {}, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 204,
                    columnNumber: 15
                }, this),
                label: `Sell ${marginLabel} ${pane.symbol} @ ${priceLabel} stop`,
                shortcut: "Alt + Shift + S",
                onClick: ()=>{
                    place("sell", "stop");
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BuyIcon, {}, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 213,
                    columnNumber: 15
                }, this),
                label: `Buy ${marginLabel} ${pane.symbol} @ ${priceLabel} limit`,
                onClick: ()=>{
                    place("buy", "limit");
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alarm$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlarmClock$3e$__["AlarmClock"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 221,
                    columnNumber: 15
                }, this),
                label: `Add order on ${pane.symbol} at ${priceLabel}…`,
                shortcut: "Shift + T",
                onClick: ()=>{
                    place("buy", "limit");
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ctx-sep"
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 231,
                    columnNumber: 15
                }, this),
                label: "Lock vertical cursor line by time",
                onClick: ()=>{
                    const next = !vertCursorLocked;
                    setVertCursorLocked(next);
                    setLockedCursorTime(next ? menu.time : null);
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ctx-sep"
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ctx-split",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "ctx-item ctx-item-half",
                        onClick: ()=>{
                            setRightDock("strategy");
                            close();
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ctx-ico",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$table$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table2$3e$__["Table2"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                lineNumber: 250,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ctx-body",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ctx-label",
                                    children: "Table view"
                                }, void 0, false, {
                                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "ctx-item ctx-item-half",
                        onClick: ()=>{
                            setRightDock("objects");
                            close();
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ctx-body",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ctx-label",
                                children: "Object tree"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartContextMenu.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                        label: "Chart template",
                        trailing: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartContextMenu.tsx",
                            lineNumber: 273,
                            columnNumber: 21
                        }, this),
                        onClick: ()=>setTplOpen(!tplOpen)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this),
                    tplOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ctx-sub",
                        children: [
                            templates.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "ctx-item",
                                    onClick: ()=>{
                                        applyChartTemplate(t.id);
                                        close();
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-label",
                                            children: t.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                            lineNumber: 289,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                        lineNumber: 288,
                                        columnNumber: 17
                                    }, this)
                                }, t.id, false, {
                                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    const name = window.prompt("Template name", "My template");
                                    if (name) saveChartTemplate(name);
                                    close();
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ctx-body",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-label",
                                        children: "Save current…"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                        lineNumber: 303,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                    lineNumber: 302,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/ChartContextMenu.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ctx-sep"
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                label: `Remove ${drawings} drawings`,
                onClick: ()=>{
                    clearDrawings(pane.id);
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                label: `Remove ${indicators} indicators`,
                onClick: ()=>{
                    clearIndicators(pane.id);
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 317,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ctx-sep"
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 324,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Item, {
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                    size: 15
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartContextMenu.tsx",
                    lineNumber: 326,
                    columnNumber: 15
                }, this),
                label: "Settings…",
                onClick: ()=>{
                    // One settings system: the pane's Vela chart-settings dialog.
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id)?.renderer.openSettingsDialog();
                    close();
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartContextMenu.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartContextMenu.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
_s(ChartContextMenu, "6tnAy5IgrhwnKu+g7q0cewsgo/8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c3 = ChartContextMenu;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Item");
__turbopack_context__.k.register(_c1, "SellIcon");
__turbopack_context__.k.register(_c2, "BuyIcon");
__turbopack_context__.k.register(_c3, "ChartContextMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/ChartGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartGrid",
    ()=>ChartGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/ChartPane.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$layouts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/layouts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const MIN_FR = 0.15;
function sum(xs) {
    return xs.reduce((a, b)=>a + b, 0);
}
function ChartGrid() {
    _s();
    const layoutCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartGrid.useAppStore[layoutCount]": (s)=>s.layoutCount
    }["ChartGrid.useAppStore[layoutCount]"]);
    const orientation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartGrid.useAppStore[orientation]": (s)=>s.orientation
    }["ChartGrid.useAppStore[orientation]"]);
    const panes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartGrid.useAppStore[panes]": (s)=>s.panes
    }["ChartGrid.useAppStore[panes]"]);
    const maximizedPaneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartGrid.useAppStore[maximizedPaneId]": (s)=>s.maximizedPaneId
    }["ChartGrid.useAppStore[maximizedPaneId]"]);
    const layoutTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartGrid.useAppStore[layoutTracks]": (s)=>s.layoutTracks
    }["ChartGrid.useAppStore[layoutTracks]"]);
    const setLayoutTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartGrid.useAppStore[setLayoutTracks]": (s)=>s.setLayoutTracks
    }["ChartGrid.useAppStore[setLayoutTracks]"]);
    const clearFocusedPane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartGrid.useAppStore[clearFocusedPane]": (s)=>s.clearFocusedPane
    }["ChartGrid.useAppStore[clearFocusedPane]"]);
    const template = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$layouts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["layoutTemplate"])(layoutCount, orientation);
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$layouts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["layoutKey"])(layoutCount, orientation);
    const stored = layoutTracks[key];
    const cols = stored?.cols?.length === template.colFr.length ? stored.cols : template.colFr;
    const rows = stored?.rows?.length === template.rowFr.length ? stored.rows : template.rowFr;
    const visible = panes.slice(0, layoutCount);
    const maximized = visible.find((p)=>p.id === maximizedPaneId);
    const gridRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartGrid.useEffect": ()=>{
            const onKeyDown = {
                "ChartGrid.useEffect.onKeyDown": (event)=>{
                    if (event.key !== "Escape") return;
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().focusedPane) return;
                    event.preventDefault();
                    clearFocusedPane();
                }
            }["ChartGrid.useEffect.onKeyDown"];
            window.addEventListener("keydown", onKeyDown);
            return ({
                "ChartGrid.useEffect": ()=>window.removeEventListener("keydown", onKeyDown)
            })["ChartGrid.useEffect"];
        }
    }["ChartGrid.useEffect"], [
        clearFocusedPane
    ]);
    const startResize = (event, axis, index)=>{
        event.preventDefault();
        event.stopPropagation();
        const el = gridRef.current;
        if (!el) return;
        const startPos = axis === "col" ? event.clientX : event.clientY;
        const startTracks = axis === "col" ? [
            ...cols
        ] : [
            ...rows
        ];
        const pair = startTracks[index] + startTracks[index + 1];
        const total = sum(startTracks);
        const size = axis === "col" ? el.clientWidth : el.clientHeight;
        if (size <= 0 || pair <= 0 || total <= 0) return;
        const prev = document.body.style.userSelect;
        const prevCursor = document.body.style.cursor;
        document.body.style.userSelect = "none";
        document.body.style.cursor = axis === "col" ? "col-resize" : "row-resize";
        const move = (ev)=>{
            const deltaPx = (axis === "col" ? ev.clientX : ev.clientY) - startPos;
            const deltaFr = deltaPx / size * total;
            let left = startTracks[index] + deltaFr;
            left = Math.max(MIN_FR, Math.min(pair - MIN_FR, left));
            const next = [
                ...startTracks
            ];
            next[index] = left;
            next[index + 1] = pair - left;
            setLayoutTracks(key, {
                cols: axis === "col" ? next : cols,
                rows: axis === "row" ? next : rows
            });
        };
        const up = ()=>{
            document.body.style.userSelect = prev;
            document.body.style.cursor = prevCursor;
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };
    if (maximized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full min-h-0 w-full bg-[#000000]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartPane"], {
                pane: maximized
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartGrid.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/charts/ChartGrid.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this);
    }
    const colTotal = sum(cols);
    const rowTotal = sum(rows);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: gridRef,
        className: "relative h-full min-h-0 w-full bg-[#222222]",
        style: {
            display: "grid",
            gridTemplateColumns: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$layouts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frToTemplate"])(cols),
            gridTemplateRows: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$layouts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frToTemplate"])(rows),
            gap: 1
        },
        children: [
            visible.map((pane, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 min-w-0",
                    style: {
                        gridArea: template.areas[i]
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartPane"], {
                        pane: pane
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartGrid.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                }, pane.id, false, {
                    fileName: "[project]/components/charts/ChartGrid.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this)),
            cols.length > 1 && cols.slice(0, -1).map((_, i)=>{
                const leftPct = sum(cols.slice(0, i + 1)) / colTotal * 100;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    role: "separator",
                    "aria-orientation": "vertical",
                    title: "Drag to resize",
                    className: "absolute top-0 bottom-0 z-30 w-2 -translate-x-1/2 cursor-col-resize hover:bg-[#2962ff]/35",
                    style: {
                        left: `${leftPct}%`
                    },
                    onMouseDown: (e)=>startResize(e, "col", i)
                }, `v-${i}`, false, {
                    fileName: "[project]/components/charts/ChartGrid.tsx",
                    lineNumber: 124,
                    columnNumber: 13
                }, this);
            }),
            rows.length > 1 && rows.slice(0, -1).map((_, i)=>{
                const topPct = sum(rows.slice(0, i + 1)) / rowTotal * 100;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    role: "separator",
                    "aria-orientation": "horizontal",
                    title: "Drag to resize",
                    className: "absolute right-0 left-0 z-30 h-2 -translate-y-1/2 cursor-row-resize hover:bg-[#2962ff]/35",
                    style: {
                        top: `${topPct}%`
                    },
                    onMouseDown: (e)=>startResize(e, "row", i)
                }, `h-${i}`, false, {
                    fileName: "[project]/components/charts/ChartGrid.tsx",
                    lineNumber: 140,
                    columnNumber: 13
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartGrid.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(ChartGrid, "1JTX1XstUmpPr6xWUN/iu9bXfPg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ChartGrid;
var _c;
__turbopack_context__.k.register(_c, "ChartGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/ChartNavigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartNavigation",
    ()=>ChartNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const PAN_FRAC = 0.28;
const DEFAULT_VISIBLE_BARS = 90;
/** Right-anchored zoom over Vela's visible time range (epoch-ms). */ function zoom(paneId, factor) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId);
    if (!handle) return;
    const range = handle.vela.getVisibleRange();
    if (!range) return;
    const span = Math.max(60_000, (range.to - range.from) * factor);
    handle.vela.setVisibleRange({
        from: range.to - span,
        to: range.to
    });
}
function resetChartView(paneId) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId);
    if (!handle) return;
    const pane = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().panes.find((p)=>p.id === paneId);
    if (!pane) return;
    const candles = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getCandles(pane.symbol, pane.timeframe);
    const n = candles.length;
    if (n > 0) {
        const from = candles[Math.max(0, n - DEFAULT_VISIBLE_BARS)].time * 1000;
        handle.vela.setVisibleRange({
            from,
            to: Date.now() + 60_000
        });
    } else {
        handle.vela.setVisibleRangePreset("ALL");
    }
    try {
        handle.vela.renderer.set("autoScale", true);
    } catch  {
    /* ignore */ }
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setPaneAutoScale(paneId, true);
}
function NavBtn({ label, onClick, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        title: label,
        "aria-label": label,
        className: "flex h-7 w-7 items-center justify-center rounded-[4px] bg-(--app-hover) text-(--app-text) shadow-[0_1px_3px_rgba(0,0,0,0.45)] hover:bg-(--app-hover) hover:text-white",
        onMouseDown: (e)=>{
            e.preventDefault();
            e.stopPropagation();
        },
        onClick: (e)=>{
            e.preventDefault();
            e.stopPropagation();
            onClick();
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/charts/ChartNavigation.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_c = NavBtn;
function ChartNavigation({ paneId, mode, onViewReset }) {
    _s();
    const setActivePane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartNavigation.useAppStore[setActivePane]": (s)=>s.setActivePane
    }["ChartNavigation.useAppStore[setActivePane]"]);
    const [near, setNear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (mode === "never") return null;
    const run = (fn)=>{
        setActivePane(paneId);
        fn();
    };
    const bar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1",
        onMouseDown: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavBtn, {
                label: "Zoom out",
                onClick: ()=>run(()=>zoom(paneId, 1.087)),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                    size: 14,
                    strokeWidth: 2.25
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartNavigation.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartNavigation.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavBtn, {
                label: "Zoom in",
                onClick: ()=>run(()=>zoom(paneId, 0.92)),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                    size: 14,
                    strokeWidth: 2.25
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartNavigation.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartNavigation.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavBtn, {
                label: "Scroll left",
                onClick: ()=>run(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId)?.vela.panBy(-PAN_FRAC)),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                    size: 15,
                    strokeWidth: 2.25
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartNavigation.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartNavigation.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavBtn, {
                label: "Scroll right",
                onClick: ()=>run(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId)?.vela.panBy(PAN_FRAC)),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                    size: 15,
                    strokeWidth: 2.25
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartNavigation.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartNavigation.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavBtn, {
                label: "Reset chart view",
                onClick: ()=>run(()=>{
                        resetChartView(paneId);
                        onViewReset?.();
                    }),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                    size: 13,
                    strokeWidth: 2.25
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartNavigation.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartNavigation.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartNavigation.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
    if (mode === "always") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute bottom-8 left-1/2 z-40 -translate-x-1/2",
            children: bar
        }, void 0, false, {
            fileName: "[project]/components/charts/ChartNavigation.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute bottom-7 left-1/2 z-40 flex h-14 w-[280px] -translate-x-1/2 items-end justify-center pb-1",
        onMouseEnter: ()=>setNear(true),
        onMouseLeave: ()=>setNear(false),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `transition-opacity duration-150 ${near ? "opacity-100" : "pointer-events-none opacity-0"}`,
            children: bar
        }, void 0, false, {
            fileName: "[project]/components/charts/ChartNavigation.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/charts/ChartNavigation.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_s(ChartNavigation, "o1evZjaG276dGMLuy/WiUNK/gEA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = ChartNavigation;
var _c, _c1;
__turbopack_context__.k.register(_c, "NavBtn");
__turbopack_context__.k.register(_c1, "ChartNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/ChartPane.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartPane",
    ()=>ChartPane
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/ChartAutoScale.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/ChartCanvas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartNavigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/ChartNavigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$CrosshairPlus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/CrosshairPlus.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$IndicatorPaneAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/IndicatorPaneAutoScale.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$TradeMarks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/TradeMarks.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$SessionBreaks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/SessionBreaks.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$drawings$2f$DrawingOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/drawings/DrawingOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.mjs [app-client] (ecmascript) <export default as Minimize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
function ChartPane({ pane }) {
    _s();
    const activePaneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[activePaneId]": (s)=>s.activePaneId
    }["ChartPane.useAppStore[activePaneId]"]);
    const layoutCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[layoutCount]": (s)=>s.layoutCount
    }["ChartPane.useAppStore[layoutCount]"]);
    const setActivePane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[setActivePane]": (s)=>s.setActivePane
    }["ChartPane.useAppStore[setActivePane]"]);
    const setSearchOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[setSearchOpen]": (s)=>s.setSearchOpen
    }["ChartPane.useAppStore[setSearchOpen]"]);
    const setContextMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[setContextMenu]": (s)=>s.setContextMenu
    }["ChartPane.useAppStore[setContextMenu]"]);
    const showPlusButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[showPlusButton]": (s)=>s.chartSettings.showPlusButton
    }["ChartPane.useAppStore[showPlusButton]"]);
    const navigationButtons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[navigationButtons]": (s)=>s.chartSettings.navigationButtons
    }["ChartPane.useAppStore[navigationButtons]"]);
    const scaleModes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[scaleModes]": (s)=>s.chartSettings.scaleModes
    }["ChartPane.useAppStore[scaleModes]"]);
    const chartBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[chartBg]": (s)=>s.chartSettings.backgroundColor
    }["ChartPane.useAppStore[chartBg]"]);
    const maximizedPaneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[maximizedPaneId]": (s)=>s.maximizedPaneId
    }["ChartPane.useAppStore[maximizedPaneId]"]);
    const setMaximizedPane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[setMaximizedPane]": (s)=>s.setMaximizedPane
    }["ChartPane.useAppStore[setMaximizedPane]"]);
    const [studyLayouts, setStudyLayouts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [overMaximize, setOverMaximize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const autoScaleOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[autoScaleOn]": (s)=>s.autoScaleByPane[pane.id] ?? true
    }["ChartPane.useAppStore[autoScaleOn]"]);
    const setPaneAutoScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartPane.useAppStore[setPaneAutoScale]": (s)=>s.setPaneAutoScale
    }["ChartPane.useAppStore[setPaneAutoScale]"]);
    const chartHostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const active = pane.id === activePaneId;
    const maximized = maximizedPaneId === pane.id;
    const showMaximize = layoutCount > 1 || Boolean(maximizedPaneId);
    const onSymbolClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChartPane.useCallback[onSymbolClick]": ()=>{
            setActivePane(pane.id);
            setSearchOpen(true);
        }
    }["ChartPane.useCallback[onSymbolClick]"], [
        pane.id,
        setActivePane,
        setSearchOpen
    ]);
    const onStudyLayouts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChartPane.useCallback[onStudyLayouts]": (layouts)=>{
            setStudyLayouts({
                "ChartPane.useCallback[onStudyLayouts]": (prev)=>{
                    if (prev.length === layouts.length && prev.every({
                        "ChartPane.useCallback[onStudyLayouts]": (p, i)=>p.instanceId === layouts[i]?.instanceId && p.type === layouts[i]?.type && Math.abs(p.top - layouts[i].top) < 0.5 && Math.abs(p.height - layouts[i].height) < 0.5
                    }["ChartPane.useCallback[onStudyLayouts]"])) {
                        return prev;
                    }
                    return layouts;
                }
            }["ChartPane.useCallback[onStudyLayouts]"]);
        }
    }["ChartPane.useCallback[onStudyLayouts]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        onMouseDown: ()=>setActivePane(pane.id),
        onContextMenu: (e)=>{
            e.preventDefault();
            setActivePane(pane.id);
            // The crosshair tracks the pointer, so the last crosshair position is
            // the price/time under the right-click (Vela public seam).
            const cross = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLastCrosshair"])();
            const price = cross && cross.paneId === pane.id ? cross.price : 0;
            const time = cross && cross.paneId === pane.id ? cross.time : null;
            setContextMenu({
                x: e.clientX,
                y: e.clientY,
                paneId: pane.id,
                price,
                time
            });
        },
        className: "group relative flex h-full min-h-0 min-w-0 flex-col",
        style: {
            background: chartBg || "#000000"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: chartHostRef,
            "data-chart-host": true,
            className: "relative min-h-0 flex-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$drawings$2f$DrawingOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingOverlay"], {
                    pane: pane
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartCanvas"], {
                    pane: pane,
                    active: active,
                    onSymbolClick: onSymbolClick,
                    onStudyLayouts: onStudyLayouts
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$SessionBreaks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SessionBreaks"], {
                    pane: pane
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$TradeMarks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TradeMarks"], {
                    pane: pane
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                studyLayouts.map((layout, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$IndicatorPaneAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndicatorPaneAutoScale"], {
                        chartPaneId: pane.id,
                        layout: layout,
                        paneIndex: i + 1
                    }, `${pane.id}-${layout.instanceId}-autoscale`, false, {
                        fileName: "[project]/components/charts/ChartPane.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)),
                showPlusButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$CrosshairPlus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CrosshairPlus"], {
                    pane: pane,
                    suppress: overMaximize
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 100,
                    columnNumber: 28
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartNavigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartNavigation"], {
                    paneId: pane.id,
                    mode: navigationButtons,
                    onViewReset: ()=>setPaneAutoScale(pane.id, true)
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartAutoScale"], {
                    paneId: pane.id,
                    mode: scaleModes,
                    hostRef: chartHostRef,
                    active: autoScaleOn,
                    onActiveChange: (on)=>setPaneAutoScale(pane.id, on)
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this),
                showMaximize && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-maximize-zone": true,
                    className: "absolute top-0 right-[62px] z-40 flex h-8 w-10 items-center justify-center",
                    onMouseEnter: ()=>setOverMaximize(true),
                    onMouseLeave: ()=>setOverMaximize(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: maximized ? "Restore layout (Esc)" : "Maximize chart",
                        className: "flex h-6 w-6 items-center justify-center rounded-[3px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)",
                        onClick: (e)=>{
                            e.stopPropagation();
                            setActivePane(pane.id);
                            setMaximizedPane(maximized ? null : pane.id);
                        },
                        children: maximized ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartPane.tsx",
                            lineNumber: 130,
                            columnNumber: 28
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartPane.tsx",
                            lineNumber: 130,
                            columnNumber: 54
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartPane.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartPane.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/charts/ChartPane.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/charts/ChartPane.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(ChartPane, "NDv1pGb/Vg2kt9ZC6rv5Lly/yMM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ChartPane;
var _c;
__turbopack_context__.k.register(_c, "ChartPane");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/ChartScaleMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartScaleMenu",
    ()=>ChartScaleMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/timezone.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.mjs [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/ChartAutoScale.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function ScaleModeLabel(mode) {
    if (mode === "logarithmic") return "Logarithmic";
    if (mode === "percentage") return "Percent";
    if (mode === "indexed100") return "Indexed to 100";
    return "Regular";
}
_c = ScaleModeLabel;
// ─── sub-panel: timezone picker ─────────────────────────────────────────────
function TimezonePicker({ onClose }) {
    _s();
    const timezone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TimezonePicker.useAppStore[timezone]": (s)=>s.chartSettings.timezone
    }["TimezonePicker.useAppStore[timezone]"]);
    const patchChartSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TimezonePicker.useAppStore[patchChartSettings]": (s)=>s.patchChartSettings
    }["TimezonePicker.useAppStore[patchChartSettings]"]);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const searchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const groups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TimezonePicker.useMemo[groups]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupTimezones"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterTimezones"])(query))
    }["TimezonePicker.useMemo[groups]"], [
        query
    ]);
    const current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timezoneOption"])(timezone);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimezonePicker.useEffect": ()=>{
            const id = window.setTimeout({
                "TimezonePicker.useEffect.id": ()=>{
                    searchRef.current?.focus();
                    activeRef.current?.scrollIntoView({
                        block: "nearest"
                    });
                }
            }["TimezonePicker.useEffect.id"], 0);
            return ({
                "TimezonePicker.useEffect": ()=>window.clearTimeout(id)
            })["TimezonePicker.useEffect"];
        }
    }["TimezonePicker.useEffect"], []);
    const select = (id)=>{
        patchChartSettings({
            timezone: id
        });
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "scale-menu-tz-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-tz-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "scale-menu-tz-back",
                        onClick: onClose,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            size: 13,
                            style: {
                                transform: "rotate(180deg)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "scale-menu-tz-title",
                        children: "Timezone"
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-tz-search",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "scale-menu-tz-search-label",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            size: 12,
                            className: "scale-menu-tz-search-icon"
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: searchRef,
                            value: query,
                            onChange: (e)=>setQuery(e.target.value),
                            placeholder: "Search city or UTC offset",
                            className: "scale-menu-tz-search-input"
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-tz-list",
                children: groups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scale-menu-tz-empty",
                    children: [
                        'No timezones match "',
                        query,
                        '"'
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                    lineNumber: 101,
                    columnNumber: 11
                }, this) : groups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "scale-menu-tz-region",
                                children: group.region.toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 105,
                                columnNumber: 15
                            }, this),
                            group.items.map((opt)=>{
                                const on = opt.id === current.id;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    ref: on ? activeRef : undefined,
                                    type: "button",
                                    role: "menuitemradio",
                                    "aria-checked": on,
                                    className: "scale-menu-tz-row",
                                    style: on ? {
                                        background: "var(--maws-hover)"
                                    } : undefined,
                                    onClick: ()=>select(opt.id),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "scale-menu-tz-check",
                                            children: on && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 122,
                                                columnNumber: 30
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 121,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "scale-menu-tz-name",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timezoneTitle"])(opt)
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 124,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "scale-menu-tz-offset",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveOffsetLabel"])(opt.iana)
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 125,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, opt.id, true, {
                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                    lineNumber: 111,
                                    columnNumber: 19
                                }, this);
                            })
                        ]
                    }, group.region, true, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(TimezonePicker, "zYgzsF/eoYs5YIAPTzz2HrTdyRs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = TimezonePicker;
// ─── sub-panel: labels submenu ───────────────────────────────────────────────
function LabelsSubmenu({ onClose }) {
    _s1();
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "LabelsSubmenu.useAppStore[settings]": (s)=>s.chartSettings
    }["LabelsSubmenu.useAppStore[settings]"]);
    const patch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "LabelsSubmenu.useAppStore[patch]": (s)=>s.patchChartSettings
    }["LabelsSubmenu.useAppStore[patch]"]);
    const rows = [
        {
            label: "Last price",
            key: "lastPriceDisplay",
            val: settings.lastPriceDisplay
        },
        {
            label: "Prev day close",
            key: "prevDayClose",
            val: settings.prevDayClose
        },
        {
            label: "High/Low",
            key: "highLowDisplay",
            val: settings.highLowDisplay
        },
        {
            label: "Bid/Ask",
            key: "bidAskDisplay",
            val: settings.bidAskDisplay
        }
    ];
    const displayOptions = [
        "value",
        "line",
        "value_line",
        "hidden"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "scale-menu-sub-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-tz-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "scale-menu-tz-back",
                        onClick: onClose,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            size: 13,
                            style: {
                                transform: "rotate(180deg)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "scale-menu-tz-title",
                        children: "Labels"
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-sub-body",
                children: rows.map(({ label, key })=>{
                    const current = settings[key];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scale-menu-sub-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "scale-menu-sub-label",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 167,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "scale-menu-sub-options",
                                children: displayOptions.filter((o)=>key !== "prevDayClose" && key !== "highLowDisplay" && key !== "bidAskDisplay" ? true : o !== "value_line").map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `scale-menu-sub-opt ${current === opt ? "scale-menu-sub-opt--on" : ""}`,
                                        onClick: ()=>patch({
                                                [key]: opt
                                            }),
                                        children: opt === "value_line" ? "value+line" : opt
                                    }, opt, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 172,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 168,
                                columnNumber: 15
                            }, this)
                        ]
                    }, key, true, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 166,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_s1(LabelsSubmenu, "8mAqipJNZ145wShNbS+wuX7WQPA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c2 = LabelsSubmenu;
// ─── sub-panel: lines submenu ────────────────────────────────────────────────
function LinesSubmenu({ onClose }) {
    _s2();
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "LinesSubmenu.useAppStore[settings]": (s)=>s.chartSettings
    }["LinesSubmenu.useAppStore[settings]"]);
    const patch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "LinesSubmenu.useAppStore[patch]": (s)=>s.patchChartSettings
    }["LinesSubmenu.useAppStore[patch]"]);
    const rows = [
        {
            label: "Alert lines",
            key: "showAlertLines"
        },
        {
            label: "Order lines",
            key: "showOrderLines"
        },
        {
            label: "Position lines",
            key: "showPositionLines"
        },
        {
            label: "TP / SL lines",
            key: "showTpSlLines"
        },
        {
            label: "Liquidation lines",
            key: "showLiqLines"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "scale-menu-sub-panel",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-tz-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "scale-menu-tz-back",
                        onClick: onClose,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            size: 13,
                            style: {
                                transform: "rotate(180deg)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "scale-menu-tz-title",
                        children: "Lines"
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-sub-body",
                children: rows.map(({ label, key })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "scale-menu-check-row",
                        onClick: ()=>patch({
                                [key]: !settings[key]
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "scale-menu-check-box",
                                children: settings[key] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 11
                                }, void 0, false, {
                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                    lineNumber: 221,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "scale-menu-check-label",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, this)
                        ]
                    }, key, true, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_s2(LinesSubmenu, "8mAqipJNZ145wShNbS+wuX7WQPA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c3 = LinesSubmenu;
function ChartScaleMenu({ paneId, style, visibility, autoScaleOn, onAutoChangeAction, onOpenChangeAction }) {
    _s3();
    const setActivePane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartScaleMenu.useAppStore[setActivePane]": (s)=>s.setActivePane
    }["ChartScaleMenu.useAppStore[setActivePane]"]);
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartScaleMenu.useAppStore[settings]": (s)=>s.chartSettings
    }["ChartScaleMenu.useAppStore[settings]"]);
    const patch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartScaleMenu.useAppStore[patch]": (s)=>s.patchChartSettings
    }["ChartScaleMenu.useAppStore[patch]"]);
    const setPaneAutoScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ChartScaleMenu.useAppStore[setPaneAutoScale]": (s)=>s.setPaneAutoScale
    }["ChartScaleMenu.useAppStore[setPaneAutoScale]"]);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [panel, setPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("main");
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const setOpenAndNotify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChartScaleMenu.useCallback[setOpenAndNotify]": (v)=>{
            setOpen(v);
            onOpenChangeAction?.(v);
        }
    }["ChartScaleMenu.useCallback[setOpenAndNotify]"], [
        onOpenChangeAction
    ]);
    // Derive a clock + offset for the timezone row display
    const [tzOffset, setTzOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ChartScaleMenu.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveOffsetLabel"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timezoneIana"])(settings.timezone))
    }["ChartScaleMenu.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartScaleMenu.useEffect": ()=>{
            const tick = {
                "ChartScaleMenu.useEffect.tick": ()=>setTzOffset((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveOffsetLabel"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timezoneIana"])(settings.timezone)))
            }["ChartScaleMenu.useEffect.tick"];
            tick();
            const id = window.setInterval(tick, 60_000);
            return ({
                "ChartScaleMenu.useEffect": ()=>window.clearInterval(id)
            })["ChartScaleMenu.useEffect"];
        }
    }["ChartScaleMenu.useEffect"], [
        settings.timezone
    ]);
    // Close on outside click or Escape
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartScaleMenu.useEffect": ()=>{
            if (!open) return;
            const onDown = {
                "ChartScaleMenu.useEffect.onDown": (e)=>{
                    if (!(e.target instanceof Node)) return;
                    if (!rootRef.current?.contains(e.target)) {
                        setOpenAndNotify(false);
                        setPanel("main");
                    }
                }
            }["ChartScaleMenu.useEffect.onDown"];
            const onKey = {
                "ChartScaleMenu.useEffect.onKey": (e)=>{
                    if (e.key === "Escape") {
                        setOpenAndNotify(false);
                        setPanel("main");
                    }
                }
            }["ChartScaleMenu.useEffect.onKey"];
            const id = window.setTimeout({
                "ChartScaleMenu.useEffect.id": ()=>{
                    window.addEventListener("mousedown", onDown);
                    window.addEventListener("keydown", onKey);
                }
            }["ChartScaleMenu.useEffect.id"], 0);
            return ({
                "ChartScaleMenu.useEffect": ()=>{
                    window.clearTimeout(id);
                    window.removeEventListener("mousedown", onDown);
                    window.removeEventListener("keydown", onKey);
                }
            })["ChartScaleMenu.useEffect"];
        }
    }["ChartScaleMenu.useEffect"], [
        open,
        setOpenAndNotify
    ]);
    const close = ()=>{
        setOpenAndNotify(false);
        setPanel("main");
    };
    const currentMode = settings.priceScaleMode ?? "normal";
    const tzCurrent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timezoneOption"])(settings.timezone);
    // Dropdown should open upward from the gear button, anchored to the right edge
    // of the scale corner (same parent as the auto label).
    const menuStyle = {
        position: "absolute",
        bottom: "100%",
        right: 0,
        marginBottom: 4,
        zIndex: 50,
        width: 256
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: `absolute z-41 flex items-center justify-center ${visibility}`,
        style: style,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                title: "Price scale settings",
                "aria-label": "Price scale settings",
                "aria-expanded": open,
                className: `scale-menu-gear ${open ? "scale-menu-gear--open" : ""}`,
                onMouseDown: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                },
                onPointerDownCapture: (e)=>e.stopPropagation(),
                onClick: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    setActivePane(paneId);
                    if (!open) setPanel("main");
                    setOpenAndNotify(!open);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                    size: 11
                }, void 0, false, {
                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                    lineNumber: 350,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scale-menu-dropdown",
                style: menuStyle,
                "data-dropdown-open": true,
                onPointerDownCapture: (e)=>e.stopPropagation(),
                onMouseDown: (e)=>e.stopPropagation(),
                onClick: (e)=>e.stopPropagation(),
                children: [
                    panel === "main" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyAutoFit"])(paneId);
                                    setPaneAutoScale(paneId, true);
                                    onAutoChangeAction(true);
                                    close();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 376,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 376,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-label",
                                                children: "Reset price scale"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-shortcut",
                                                children: "Alt+R"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 379,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 377,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 366,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    if (autoScaleOn) {
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAutoFit"])(paneId);
                                        onAutoChangeAction(false);
                                    } else {
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$ChartAutoScale$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyAutoFit"])(paneId);
                                        onAutoChangeAction(true);
                                    }
                                    close();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico",
                                        children: autoScaleOn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 399,
                                            columnNumber: 35
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 398,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-label",
                                            children: "Auto (fits data to screen)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 402,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 401,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 384,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    patch({
                                        lockPriceRatio: !settings.lockPriceRatio
                                    });
                                    close();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico",
                                        children: settings.lockPriceRatio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 416,
                                            columnNumber: 47
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 415,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-label",
                                            children: "Lock price to bar ratio"
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 419,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 418,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 407,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    patch({
                                        scaleModes: settings.scaleModes === "never" ? "always" : "never"
                                    });
                                    close();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico",
                                        children: settings.scaleModes === "never" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 433,
                                            columnNumber: 55
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 432,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-label",
                                            children: "Scale price chart only"
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 436,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 435,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 424,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    patch({
                                        invertScale: !settings.invertScale
                                    });
                                    close();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico",
                                        children: settings.invertScale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 450,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 449,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-label",
                                                children: "Invert scale"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 453,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-shortcut",
                                                children: "Alt+I"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 454,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 452,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 441,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ctx-sep"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 458,
                                columnNumber: 15
                            }, this),
                            [
                                "normal",
                                "percentage",
                                "indexed100",
                                "logarithmic"
                            ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "ctx-item",
                                    onClick: ()=>{
                                        patch({
                                            priceScaleMode: m,
                                            // keep legacy logScale in sync
                                            logScale: m === "logarithmic"
                                        });
                                        close();
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-ico",
                                            children: currentMode === m && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 13
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 476,
                                                columnNumber: 43
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 475,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-body",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ctx-label",
                                                    children: ScaleModeLabel(m)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                    lineNumber: 479,
                                                    columnNumber: 21
                                                }, this),
                                                m === "logarithmic" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ctx-shortcut",
                                                    children: "Alt+L"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                    lineNumber: 480,
                                                    columnNumber: 45
                                                }, this),
                                                m === "percentage" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ctx-shortcut",
                                                    children: "Alt+P"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 44
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 478,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, m, true, {
                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                    lineNumber: 462,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ctx-sep"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 486,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    const next = settings.scalesPlacement === "left" ? "right" : "left";
                                    patch({
                                        scalesPlacement: next
                                    });
                                    close();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 498,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-label",
                                            children: settings.scalesPlacement === "left" ? "Move scale to right" : "Move scale to left"
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 500,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 499,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 489,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ctx-sep"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 508,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>setPanel("labels"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 516,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-label",
                                                children: "Labels"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 518,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-trail",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                    lineNumber: 519,
                                                    columnNumber: 47
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 519,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 517,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 511,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>setPanel("lines"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 529,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-label",
                                                children: "Lines"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 531,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-trail",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                    lineNumber: 532,
                                                    columnNumber: 47
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 532,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 530,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 524,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>{
                                    patch({
                                        showPlusButton: !settings.showPlusButton
                                    });
                                    close();
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico",
                                        children: settings.showPlusButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 546,
                                            columnNumber: 47
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 545,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ctx-label",
                                            children: "Plus button"
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 549,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 548,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ctx-sep"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 553,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "ctx-item",
                                onClick: ()=>setPanel("timezone"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-ico",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                            lineNumber: 561,
                                            columnNumber: 43
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 561,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ctx-body",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-label",
                                                style: {
                                                    flex: 1
                                                },
                                                children: "Timezone"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 563,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-shortcut",
                                                style: {
                                                    maxWidth: 100,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap"
                                                },
                                                children: [
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timezoneTitle"])(tzCurrent),
                                                    " ",
                                                    tzOffset
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 566,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ctx-trail",
                                                style: {
                                                    marginLeft: 4
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                    lineNumber: 570,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                                lineNumber: 569,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                        lineNumber: 562,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                                lineNumber: 556,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 364,
                        columnNumber: 13
                    }, this),
                    panel === "timezone" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimezonePicker, {
                        onClose: ()=>setPanel("main")
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 578,
                        columnNumber: 13
                    }, this),
                    panel === "labels" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LabelsSubmenu, {
                        onClose: ()=>setPanel("main")
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 582,
                        columnNumber: 13
                    }, this),
                    panel === "lines" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinesSubmenu, {
                        onClose: ()=>setPanel("main")
                    }, void 0, false, {
                        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                        lineNumber: 586,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/ChartScaleMenu.tsx",
                lineNumber: 355,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/ChartScaleMenu.tsx",
        lineNumber: 325,
        columnNumber: 5
    }, this);
}
_s3(ChartScaleMenu, "4gPWP4QWQdzTiJKILel7jSkVcq4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c4 = ChartScaleMenu;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ScaleModeLabel");
__turbopack_context__.k.register(_c1, "TimezonePicker");
__turbopack_context__.k.register(_c2, "LabelsSubmenu");
__turbopack_context__.k.register(_c3, "LinesSubmenu");
__turbopack_context__.k.register(_c4, "ChartScaleMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/CrosshairPlus.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CrosshairPlus",
    ()=>CrosshairPlus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * CrosshairPlus.tsx — Vela implementation.
 *
 * Hover-state is driven by Vela's public crosshair seam (onCrosshairMove), and
 * Buy/Sell rows go through the existing MAWS dispatch layer — Vela never sees
 * broker credentials or executes orders.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/ui-orders.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/symbol-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alarm$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlarmClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alarm-clock.mjs [app-client] (ecmascript) <export default as AlarmClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-down.mjs [app-client] (ecmascript) <export default as ChevronsDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up.mjs [app-client] (ecmascript) <export default as ChevronsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const AXIS_W = 56;
function OrderIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 16 16",
        fill: "none",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 11.5h8M2 8h5M2 4.5h11",
                stroke: "currentColor",
                strokeWidth: "1.2"
            }, void 0, false, {
                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 3.5v6M8.5 6.5 11 3.5 13.5 6.5",
                stroke: "currentColor",
                strokeWidth: "1.2"
            }, void 0, false, {
                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/CrosshairPlus.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = OrderIcon;
function CrosshairPlus({ pane, suppress }) {
    _s();
    const setBuySellMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "CrosshairPlus.useAppStore[setBuySellMenu]": (s)=>s.setBuySellMenu
    }["CrosshairPlus.useAppStore[setBuySellMenu]"]);
    const setTradingSettingsSymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "CrosshairPlus.useAppStore[setTradingSettingsSymbol]": (s)=>s.setTradingSettingsSymbol
    }["CrosshairPlus.useAppStore[setTradingSettingsSymbol]"]);
    const addAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "CrosshairPlus.useAppStore[addAlert]": (s)=>s.addAlert
    }["CrosshairPlus.useAppStore[addAlert]"]);
    const wrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hover, setHover] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [anchor, setAnchor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const openRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const overPlusRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Live cursor Y (client coords) over the chart element — the crosshair event
    // carries no pixel position, so the plus button tracks this instead of
    // parking at the pane's vertical center.
    const pointerYRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pointerY, setPointerY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    openRef.current = open;
    // Vela crosshair → hover state (rAF-throttled by Vela itself).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrosshairPlus.useEffect": ()=>{
            let tries = 0;
            let timer = 0;
            let cancelled = false;
            let off = null;
            let offPointer = null;
            const attach = {
                "CrosshairPlus.useEffect.attach": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(attach, 250);
                        return;
                    }
                    const el = handle.el;
                    const onPointerMove = {
                        "CrosshairPlus.useEffect.attach.onPointerMove": (ev)=>{
                            // Menu open: freeze — the button (and its open menu) must not follow the cursor.
                            if (openRef.current) return;
                            if (pointerYRef.current === ev.clientY) return;
                            pointerYRef.current = ev.clientY;
                            setPointerY(ev.clientY);
                        }
                    }["CrosshairPlus.useEffect.attach.onPointerMove"];
                    const onPointerLeave = {
                        "CrosshairPlus.useEffect.attach.onPointerLeave": ()=>{
                            // Moving onto the plus button itself leaves the chart element — keep
                            // the last Y so the button (and its open menu) does not jump.
                            if (overPlusRef.current) return;
                            pointerYRef.current = null;
                            setPointerY(null);
                        }
                    }["CrosshairPlus.useEffect.attach.onPointerLeave"];
                    el.addEventListener("pointermove", onPointerMove);
                    el.addEventListener("pointerleave", onPointerLeave);
                    off = handle.vela.renderer.onCrosshairMove({
                        "CrosshairPlus.useEffect.attach": (e)=>{
                            if (openRef.current) return;
                            if (e.price == null) {
                                if (!overPlusRef.current) setHover(null);
                                return;
                            }
                            const next = {
                                price: e.price,
                                time: e.time != null ? Math.floor(e.time / 1000) : null,
                                y: 0,
                                axisWidth: AXIS_W
                            };
                            setHover({
                                "CrosshairPlus.useEffect.attach": (prev)=>prev && Math.abs(prev.price - next.price) < 1e-12 && prev.time === next.time ? prev : next
                            }["CrosshairPlus.useEffect.attach"]);
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLastCrosshair"])({
                                paneId: pane.id,
                                price: e.price,
                                time: e.time ?? null
                            });
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncCrosshairToOthers"])(pane.id, e.time ?? null, e.price);
                        }
                    }["CrosshairPlus.useEffect.attach"]);
                    offPointer = ({
                        "CrosshairPlus.useEffect.attach": ()=>{
                            el.removeEventListener("pointermove", onPointerMove);
                            el.removeEventListener("pointerleave", onPointerLeave);
                        }
                    })["CrosshairPlus.useEffect.attach"];
                }
            }["CrosshairPlus.useEffect.attach"];
            attach();
            return ({
                "CrosshairPlus.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                    off?.();
                    offPointer?.();
                }
            })["CrosshairPlus.useEffect"];
        }
    }["CrosshairPlus.useEffect"], [
        pane.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "CrosshairPlus.useLayoutEffect": ()=>{
            if (!hover) {
                setAnchor(null);
                return;
            }
            const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
            if (!handle) return;
            const rect = handle.el.getBoundingClientRect();
            setAnchor({
                left: rect.right - hover.axisWidth - 28,
                // Ride the cursor: center the 24px button on the pointer's Y (client
                // coords — the button is position:fixed). Fall back to the pane's
                // vertical center when the crosshair moved without a pointer (keyboard).
                top: pointerYRef.current ?? rect.top + rect.height / 2 - 12
            });
        }
    }["CrosshairPlus.useLayoutEffect"], [
        hover,
        pointerY,
        pane.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrosshairPlus.useEffect": ()=>{
            if (!open) return;
            const onDown = {
                "CrosshairPlus.useEffect.onDown": (e)=>{
                    if (!(e.target instanceof Node)) return;
                    if (wrapRef.current?.contains(e.target)) return;
                    const t = e.target;
                    if (t?.closest?.("[data-crosshair-plus]")) return;
                    setOpen(false);
                }
            }["CrosshairPlus.useEffect.onDown"];
            window.addEventListener("mousedown", onDown);
            return ({
                "CrosshairPlus.useEffect": ()=>window.removeEventListener("mousedown", onDown)
            })["CrosshairPlus.useEffect"];
        }
    }["CrosshairPlus.useEffect"], [
        open
    ]);
    if (!hover || !anchor || suppress) return null;
    const price = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(pane.symbol, hover.price);
    const side = "above";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "data-crosshair-plus": true,
                className: "fixed z-[35] flex h-6 w-6 items-center justify-center rounded-[4px] border border-(--app-border) bg-(--app-elevated) text-(--app-text) shadow-[0_2px_8px_rgba(0,0,0,0.45)] hover:bg-(--app-hover)",
                style: {
                    left: anchor.left,
                    top: anchor.top
                },
                onMouseEnter: ()=>{
                    overPlusRef.current = true;
                },
                onMouseLeave: ()=>{
                    overPlusRef.current = false;
                },
                onClick: (e)=>{
                    e.stopPropagation();
                    setOpen((v)=>!v);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/components/charts/CrosshairPlus.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: wrapRef,
                "data-crosshair-plus": true,
                className: "fixed z-[80] w-[220px] rounded-[8px] border border-(--app-border) bg-(--app-elevated) py-1 shadow-[0_8px_28px_rgba(0,0,0,0.65)]",
                style: {
                    left: Math.max(8, anchor.left - 200),
                    top: anchor.top + 28
                },
                onMouseDown: (e)=>e.stopPropagation(),
                onMouseEnter: ()=>{
                    overPlusRef.current = true;
                },
                onMouseLeave: ()=>{
                    overPlusRef.current = false;
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "plus-row",
                        onClick: ()=>{
                            const qty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOrderQty"])(pane.symbol, hover.price);
                            if (qty > 0) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitOrderFromUi"])({
                                    symbol: pane.symbol,
                                    side: "buy",
                                    type: "market",
                                    qty,
                                    price: hover.price,
                                    clientOrderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newClientOrderId"])()
                                });
                            }
                            setOpen(false);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUp$3e$__["ChevronsUp"], {
                                size: 14,
                                className: "text-[#089981]"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plus-row-label",
                                children: [
                                    "Buy ",
                                    price
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/CrosshairPlus.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "plus-row",
                        onClick: ()=>{
                            const qty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOrderQty"])(pane.symbol, hover.price);
                            if (qty > 0) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitOrderFromUi"])({
                                    symbol: pane.symbol,
                                    side: "sell",
                                    type: "market",
                                    qty,
                                    price: hover.price,
                                    clientOrderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$ui$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newClientOrderId"])()
                                });
                            }
                            setOpen(false);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDown$3e$__["ChevronsDown"], {
                                size: 14,
                                className: "text-[#f23645]"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plus-row-label",
                                children: [
                                    "Sell ",
                                    price
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 234,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/CrosshairPlus.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "plus-row",
                        onClick: ()=>{
                            setBuySellMenu({
                                x: anchor.left,
                                y: anchor.top,
                                symbol: pane.symbol
                            });
                            setOpen(false);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrderIcon, {}, void 0, false, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 244,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plus-row-label",
                                children: "Trade…"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 245,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/CrosshairPlus.tsx",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "plus-row",
                        onClick: ()=>{
                            addAlert({
                                symbol: pane.symbol,
                                price: hover.price,
                                side,
                                enabled: true
                            });
                            setOpen(false);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alarm$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlarmClock$3e$__["AlarmClock"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 255,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plus-row-label",
                                children: [
                                    "Add alert at ",
                                    price
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/CrosshairPlus.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "plus-row",
                        onClick: ()=>{
                            setTradingSettingsSymbol(pane.symbol);
                            setOpen(false);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plus-row-label",
                                children: "Trading settings…"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/CrosshairPlus.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/CrosshairPlus.tsx",
                lineNumber: 181,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/CrosshairPlus.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this), document.body);
}
_s(CrosshairPlus, "odz5ftmt9CanzowIWIsdfQRyqvk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = CrosshairPlus;
var _c, _c1;
__turbopack_context__.k.register(_c, "OrderIcon");
__turbopack_context__.k.register(_c1, "CrosshairPlus");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/IndicatorPaneAutoScale.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndicatorPaneAutoScale",
    ()=>IndicatorPaneAutoScale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/drawings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const FALLBACK_AXIS_W = 56;
const TIME_AXIS_H = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHART_TIME_AXIS_H"];
/** Height of the "A" button in pixels. */ const BTN_H = 20;
/** Width of the "A" button. */ const BTN_W = 36;
function getSubPaneRightAxisWidth(_chartPaneId) {
    return FALLBACK_AXIS_W;
}
function applySubPaneAutoScale(chartPaneId, _paneIndex) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(chartPaneId);
    if (!handle) return false;
    try {
        handle.vela.renderer.set("autoScale", true);
        return true;
    } catch  {
        return false;
    }
}
function clearSubPaneAutoScale(chartPaneId, _paneIndex) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(chartPaneId);
    if (!handle) return;
    try {
        handle.vela.renderer.set("autoScale", false);
    } catch  {
    /* ignore */ }
}
function IndicatorPaneAutoScale({ chartPaneId, layout, paneIndex }) {
    _s();
    const chartBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorPaneAutoScale.useAppStore": (s)=>s.chartSettings.backgroundColor
    }["IndicatorPaneAutoScale.useAppStore"]) || "#000000";
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const axisW = FALLBACK_AXIS_W;
    // Poll for external scale changes (manual price-axis drags) so we
    // can deactivate the button when the user has manually scaled.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndicatorPaneAutoScale.useEffect": ()=>{
            if (!active) return;
            const id = setInterval({
                "IndicatorPaneAutoScale.useEffect.id": ()=>{
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(chartPaneId);
                    if (!handle) return;
                    try {
                        if (handle.vela.renderer.get("autoScale") === false) setActive(false);
                    } catch  {
                    /* ignore */ }
                }
            }["IndicatorPaneAutoScale.useEffect.id"], 400);
            return ({
                "IndicatorPaneAutoScale.useEffect": ()=>clearInterval(id)
            })["IndicatorPaneAutoScale.useEffect"];
        }
    }["IndicatorPaneAutoScale.useEffect"], [
        active,
        chartPaneId,
        paneIndex
    ]);
    // Clamp button vertically within the usable pane area (exclude time-axis).
    const usableHeight = layout.height - TIME_AXIS_H;
    const btnTop = Math.round(layout.top + usableHeight / 2 - BTN_H / 2);
    const clampedTop = Math.max(layout.top + 2, Math.min(btnTop, layout.top + usableHeight - BTN_H - 2));
    // Pin the button to the right edge of the axis column.
    const btnRight = 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": true,
                className: "pointer-events-auto absolute z-30",
                style: {
                    top: layout.top,
                    right: 0,
                    width: axisW,
                    height: usableHeight
                },
                onMouseEnter: ()=>setHovered(true),
                onMouseLeave: ()=>setHovered(false)
            }, void 0, false, {
                fileName: "[project]/components/charts/IndicatorPaneAutoScale.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                title: active ? "Auto scale on — click to disable" : "Auto scale (fit visible range)",
                "aria-label": "Auto scale indicator pane",
                "aria-pressed": active,
                onMouseEnter: ()=>setHovered(true),
                onMouseLeave: ()=>setHovered(false),
                onMouseDown: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                },
                onClick: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    if (active) {
                        clearSubPaneAutoScale(chartPaneId, paneIndex);
                        setActive(false);
                    } else {
                        applySubPaneAutoScale(chartPaneId, paneIndex);
                        setActive(true);
                    }
                },
                style: {
                    position: "absolute",
                    top: clampedTop,
                    right: btnRight,
                    width: BTN_W,
                    height: BTN_H,
                    zIndex: 41,
                    opacity: hovered ? 1 : 0,
                    pointerEvents: hovered ? "auto" : "none",
                    transition: "opacity 120ms ease, color 100ms ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: chartBg,
                    borderRadius: 3,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: 11,
                    lineHeight: 1,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#d1d4dc" : "#787b86",
                    letterSpacing: "0.02em"
                },
                children: "A"
            }, void 0, false, {
                fileName: "[project]/components/charts/IndicatorPaneAutoScale.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/IndicatorPaneAutoScale.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(IndicatorPaneAutoScale, "U4OgaPlZI+Z9CLF+A4TF3r+CAwc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = IndicatorPaneAutoScale;
var _c;
__turbopack_context__.k.register(_c, "IndicatorPaneAutoScale");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/SessionBreaks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionBreaks",
    ()=>SessionBreaks
]);
/**
 * SessionBreaks.tsx — Vela implementation.
 *
 * The existing day-break computation is kept; vertical separators are painted
 * through the `maws-session-breaks` native renderer layer. Replay cutoff:
 * breaks at/beyond the replay cursor are hidden.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timeframes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/timeframes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$vela$2d$layers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/vela-layers.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const LAYER = "maws-session-breaks";
/** UTC day bucket — same key VWAP session anchor uses (`floor(unix / 86400)`). */ function utcDayKey(unixSec) {
    return Math.floor(unixSec / 86400);
}
/** First bar of each UTC calendar day (sub-daily only). Aligns with session VWAP resets. */ function sessionBreakTimes(candles, timeframe) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timeframes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeframeSeconds"])(timeframe) >= 86_400 || candles.length < 2) return [];
    const out = [];
    let prev = utcDayKey(candles[0].time);
    for(let i = 1; i < candles.length; i++){
        const key = utcDayKey(candles[i].time);
        if (key !== prev) {
            out.push(candles[i].time);
            prev = key;
        }
    }
    return out;
}
function dashFor(style) {
    if (style === "dashed") return [
        6,
        4
    ];
    if (style === "dotted") return [
        2,
        3
    ];
    return [];
}
function SessionBreaks({ pane }) {
    _s();
    const enabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SessionBreaks.useAppStore[enabled]": (s)=>s.chartSettings.sessionBreaks
    }["SessionBreaks.useAppStore[enabled]"]);
    const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SessionBreaks.useAppStore[color]": (s)=>s.chartSettings.sessionBreakColor
    }["SessionBreaks.useAppStore[color]"]);
    const lineStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SessionBreaks.useAppStore[lineStyle]": (s)=>s.chartSettings.sessionBreakLineStyle
    }["SessionBreaks.useAppStore[lineStyle]"]);
    const lineWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SessionBreaks.useAppStore[lineWidth]": (s)=>s.chartSettings.sessionBreakLineWidth
    }["SessionBreaks.useAppStore[lineWidth]"]);
    const replay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SessionBreaks.useAppStore[replay]": (s)=>s.replay
    }["SessionBreaks.useAppStore[replay]"]);
    /** Cached break unix times — rebuilt only when series tip/length changes. */ const breaksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const breaksKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    const replaying = replay?.paneId === pane.id;
    /** Vela's replay cursor (epoch-ms → sec) — Vela owns the replay clock. */ const replayCutoffSec = replaying && replay?.cursorTime != null ? Math.floor(replay.cursorTime / 1000) : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SessionBreaks.useEffect": ()=>{
            let cancelled = false;
            let tries = 0;
            let timer = 0;
            let raf = 0;
            const compute = {
                "SessionBreaks.useEffect.compute": ()=>{
                    if (!enabled) return {
                        times: [],
                        color,
                        width: lineWidth,
                        dash: dashFor(lineStyle)
                    };
                    const candles = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getCandles(pane.symbol, pane.timeframe);
                    if (candles.length < 2) return {
                        times: [],
                        color,
                        width: lineWidth,
                        dash: dashFor(lineStyle)
                    };
                    const tip = candles.at(-1);
                    const key = `${pane.symbol}|${pane.timeframe}|${candles.length}|${tip?.time ?? 0}`;
                    if (key !== breaksKeyRef.current) {
                        breaksKeyRef.current = key;
                        breaksRef.current = sessionBreakTimes(candles, pane.timeframe);
                    }
                    const cutoff = replayCutoffSec;
                    return {
                        times: breaksRef.current.filter({
                            "SessionBreaks.useEffect.compute": (t)=>cutoff == null || t <= cutoff
                        }["SessionBreaks.useEffect.compute"]).map({
                            "SessionBreaks.useEffect.compute": (t)=>t * 1000
                        }["SessionBreaks.useEffect.compute"]),
                        color,
                        width: lineWidth,
                        dash: dashFor(lineStyle)
                    };
                }
            }["SessionBreaks.useEffect.compute"];
            const push = {
                "SessionBreaks.useEffect.push": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    const payload = compute();
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(push, 250);
                        return;
                    }
                    tries = 0;
                    try {
                        handle.renderer.setNativeData(LAYER, payload);
                    } catch  {
                    /* ignore */ }
                }
            }["SessionBreaks.useEffect.push"];
            if (!enabled) {
                push();
                return ({
                    "SessionBreaks.useEffect": ()=>{
                        cancelled = true;
                        if (timer) window.clearTimeout(timer);
                    }
                })["SessionBreaks.useEffect"];
            }
            // New-bar / history only — tip ticks must not rebuild day keys.
            const unsub = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].subscribe(pane.symbol, pane.timeframe, {
                "SessionBreaks.useEffect.unsub": (_c, _q, meta)=>{
                    if (meta?.tick) return;
                    breaksKeyRef.current = "";
                    if (raf) cancelAnimationFrame(raf);
                    raf = requestAnimationFrame({
                        "SessionBreaks.useEffect.unsub": ()=>{
                            raf = 0;
                            push();
                        }
                    }["SessionBreaks.useEffect.unsub"]);
                }
            }["SessionBreaks.useEffect.unsub"]);
            push();
            return ({
                "SessionBreaks.useEffect": ()=>{
                    cancelled = true;
                    if (raf) cancelAnimationFrame(raf);
                    if (timer) window.clearTimeout(timer);
                    unsub();
                }
            })["SessionBreaks.useEffect"];
        }
    }["SessionBreaks.useEffect"], [
        pane.id,
        pane.symbol,
        pane.timeframe,
        enabled,
        color,
        lineStyle,
        lineWidth,
        replayCutoffSec
    ]);
    // Vela owns rendering — no DOM output.
    return null;
}
_s(SessionBreaks, "pO6NSOru+3Lch6Z8GjH6Kv3chzo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = SessionBreaks;
var _c;
__turbopack_context__.k.register(_c, "SessionBreaks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/SymbolSearch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SymbolSearch",
    ()=>SymbolSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$AssetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/brand/AssetLogo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-quotes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$diamond$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Diamond$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/diamond.mjs [app-client] (ecmascript) <export default as Diamond>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const CATEGORY_TABS = [
    {
        id: "crypto",
        label: "USD-M Futures"
    },
    {
        id: "tradefi",
        label: "TradFi"
    }
];
function SymbolSearch() {
    _s();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SymbolSearch.useAppStore[open]": (s)=>s.searchOpen
    }["SymbolSearch.useAppStore[open]"]);
    const setSearchOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SymbolSearch.useAppStore[setSearchOpen]": (s)=>s.setSearchOpen
    }["SymbolSearch.useAppStore[setSearchOpen]"]);
    const setSymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SymbolSearch.useAppStore[setSymbol]": (s)=>s.setSymbol
    }["SymbolSearch.useAppStore[setSymbol]"]);
    const addToWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SymbolSearch.useAppStore[addToWatchlist]": (s)=>s.addToWatchlist
    }["SymbolSearch.useAppStore[addToWatchlist]"]);
    const removeFromWatchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SymbolSearch.useAppStore[removeFromWatchlist]": (s)=>s.removeFromWatchlist
    }["SymbolSearch.useAppStore[removeFromWatchlist]"]);
    const watchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SymbolSearch.useAppStore[watchlist]": (s)=>s.watchlist
    }["SymbolSearch.useAppStore[watchlist]"]);
    const universe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUniverse"])();
    const quotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuotes"])(open);
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("crypto");
    const rows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SymbolSearch.useMemo[rows]": ()=>{
            const query = q.trim().toUpperCase().replace(/\.P$/, "");
            const bySym = new Map(quotes.map({
                "SymbolSearch.useMemo[rows]": (x)=>[
                        x.symbol,
                        x
                    ]
            }["SymbolSearch.useMemo[rows]"]));
            const out = [];
            for (const s of universe){
                if (category === "crypto" && s.contractType === "TRADIFI_PERPETUAL") continue;
                if (category === "tradefi" && s.contractType !== "TRADIFI_PERPETUAL") continue;
                if (query) {
                    if (!(s.symbol.includes(query) || s.base.includes(query) || s.name.toUpperCase().includes(query) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(s.symbol).includes(query))) {
                        continue;
                    }
                }
                out.push({
                    info: s,
                    quote: bySym.get(s.symbol)
                });
                if (!query && out.length >= 80) break;
                if (query && out.length >= 120) break;
            }
            return out;
        }
    }["SymbolSearch.useMemo[rows]"], [
        q,
        quotes,
        universe,
        category
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-symbol-search": true,
        "data-dropdown-open": true,
        className: "absolute left-2 top-[40px] z-50 w-[294px] overflow-hidden rounded-sm border border-[#222222] bg-[#111111] shadow-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 border-b border-[#222222] px-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        size: 14,
                        className: "shrink-0 text-(--app-muted)"
                    }, void 0, false, {
                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        autoFocus: true,
                        value: q,
                        onChange: (e)=>setQ(e.target.value),
                        onKeyDown: (e)=>{
                            if (e.key === "Escape") setSearchOpen(false);
                            if (e.key === "Enter" && rows[0]) setSymbol(rows[0].info.symbol);
                        },
                        placeholder: "Search symbol",
                        className: "h-9 w-full bg-transparent text-[13px] text-(--app-text) outline-none placeholder:text-[#4c525e]"
                    }, void 0, false, {
                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/SymbolSearch.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b border-[#222222]",
                children: CATEGORY_TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setCategory(tab.id),
                        className: `flex-1 py-1.5 text-[11px] font-medium transition-colors ${category === tab.id ? "border-b-2 border-[#2962ff] text-(--app-text)" : "text-(--app-muted) hover:text-(--app-text)"}`,
                        style: category === tab.id ? {
                            marginBottom: -1
                        } : undefined,
                        children: tab.label
                    }, tab.id, false, {
                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/charts/SymbolSearch.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-h-[360px] overflow-auto",
                children: rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 py-6 text-center text-[12px] text-(--app-muted)",
                    children: "No symbols found"
                }, void 0, false, {
                    fileName: "[project]/components/charts/SymbolSearch.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, this) : rows.map(({ info, quote })=>{
                    const up = (quote?.changePct ?? 0) >= 0;
                    const starred = watchlist.includes(info.symbol);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-(--app-hover)",
                        onClick: ()=>setSymbol(info.symbol),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                title: starred ? "Remove from watchlist" : "Add to watchlist",
                                className: "shrink-0 text-(--app-muted) hover:text-(--app-text)",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    if (starred) removeFromWatchlist(info.symbol);
                                    else addToWatchlist(info.symbol);
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$diamond$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Diamond$3e$__["Diamond"], {
                                    size: 12,
                                    color: "#ffffff",
                                    fill: starred ? "#ffffff" : "none",
                                    strokeWidth: 1.6
                                }, void 0, false, {
                                    fileName: "[project]/components/charts/SymbolSearch.tsx",
                                    lineNumber: 127,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/charts/SymbolSearch.tsx",
                                lineNumber: 117,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$AssetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssetLogo"], {
                                symbol: info.symbol,
                                size: 22
                            }, void 0, false, {
                                fileName: "[project]/components/charts/SymbolSearch.tsx",
                                lineNumber: 134,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[13px] font-semibold text-(--app-text)",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(info.symbol)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                                        lineNumber: 136,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "truncate text-[11px] text-(--app-muted)",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbol"])(info.symbol).name
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                                        lineNumber: 139,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/SymbolSearch.tsx",
                                lineNumber: 135,
                                columnNumber: 17
                            }, this),
                            quote && quote.last > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[12px] text-(--app-text)",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(info.symbol, quote.last)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                                        lineNumber: 145,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-[11px] ${up ? "text-[#089981]" : "text-[#f23645]"}`,
                                        children: [
                                            up ? "+" : "",
                                            quote.changePct.toFixed(2),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                                        lineNumber: 148,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/SymbolSearch.tsx",
                                lineNumber: 144,
                                columnNumber: 19
                            }, this)
                        ]
                    }, info.symbol, true, {
                        fileName: "[project]/components/charts/SymbolSearch.tsx",
                        lineNumber: 112,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/charts/SymbolSearch.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/SymbolSearch.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(SymbolSearch, "RHe+VfhwrsHRsqJYBqEmcuEIhzU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUniverse"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuotes"]
    ];
});
_c = SymbolSearch;
var _c;
__turbopack_context__.k.register(_c, "SymbolSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/TradeMarks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TradeMarks",
    ()=>TradeMarks
]);
/**
 * TradeMarks.tsx — Vela implementation.
 *
 * Position entry / TP / SL / liquidation / alert / order lines are Vela user
 * drawings (`hline`) owned by this component. Vela emits the new price on drag
 * (`drawing:edited`); the existing MAWS dispatch layer validates and executes
 * (live → /api/live/protect via dispatchProtect, paper → the paper engine), and
 * Vela is updated only from the confirmed broker state that flows back through
 * the store. Risk/reward zones paint through the `maws-trade-zones` renderer
 * layer. Vela never sees broker credentials or executes orders directly.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$selectors$2f$broker$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/selectors/broker.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/dispatch.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trade-marks.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function dashToStyle(dash) {
    if (dash === "2 3" || dash === "1 4") return "dotted";
    if (dash === "4 3" || dash === "6 4" || dash === "8 4") return "dashed";
    return "solid";
}
const TRADE_LAYER = "maws-trade-zones";
function TradeMarks({ pane }) {
    _s();
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[settings]": (s)=>s.chartSettings
    }["TradeMarks.useAppStore[settings]"]);
    const alerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[alerts]": (s)=>s.alerts
    }["TradeMarks.useAppStore[alerts]"]);
    // Exactly one book (live for binance, paper otherwise) — never a mix.
    const { orders, positions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$selectors$2f$broker$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBrokerBook"])();
    const updateAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[updateAlert]": (s)=>s.updateAlert
    }["TradeMarks.useAppStore[updateAlert]"]);
    const removeAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[removeAlert]": (s)=>s.removeAlert
    }["TradeMarks.useAppStore[removeAlert]"]);
    const updateOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[updateOrder]": (s)=>s.updateOrder
    }["TradeMarks.useAppStore[updateOrder]"]);
    const removeOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[removeOrder]": (s)=>s.removeOrder
    }["TradeMarks.useAppStore[removeOrder]"]);
    const updatePosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[updatePosition]": (s)=>s.updatePosition
    }["TradeMarks.useAppStore[updatePosition]"]);
    const removePosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[removePosition]": (s)=>s.removePosition
    }["TradeMarks.useAppStore[removePosition]"]);
    const replay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore[replay]": (s)=>s.replay
    }["TradeMarks.useAppStore[replay]"]);
    const live = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradeMarks.useAppStore": (s)=>s.connectedBroker
    }["TradeMarks.useAppStore"]) === "binance";
    const busy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const replaying = replay?.paneId === pane.id;
    const marks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TradeMarks.useMemo[marks]": ()=>{
            const list = [];
            if (settings.showAlertLines) {
                for (const a of alerts){
                    if (a.symbol !== pane.symbol || !a.enabled) continue;
                    list.push({
                        key: `alert-${a.id}`,
                        price: a.price,
                        label: `Alert ${a.side === "above" ? "≥" : "≤"} ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(a.symbol, a.price)}`,
                        color: settings.alertLineColor,
                        lineStyle: "dashed",
                        onMove: {
                            "TradeMarks.useMemo[marks]": (price)=>updateAlert(a.id, {
                                    price
                                })
                        }["TradeMarks.useMemo[marks]"],
                        onRemove: {
                            "TradeMarks.useMemo[marks]": ()=>removeAlert(a.id)
                        }["TradeMarks.useMemo[marks]"]
                    });
                }
            }
            if (settings.showOrderLines) {
                for (const o of orders){
                    if (o.symbol !== pane.symbol) continue;
                    const buy = o.side === "buy";
                    list.push({
                        key: `order-${o.id}`,
                        price: o.price,
                        label: `${buy ? "Buy" : "Sell"} ${o.type === "stop" ? "Stop" : o.type === "market" ? "Market" : "Limit"} ${o.qty}`,
                        color: buy ? settings.buyLineColor : settings.sellLineColor,
                        lineStyle: o.type === "stop" ? "dotted" : "dashed",
                        onMove: {
                            "TradeMarks.useMemo[marks]": (price)=>updateOrder(o.id, {
                                    price
                                })
                        }["TradeMarks.useMemo[marks]"],
                        onRemove: {
                            "TradeMarks.useMemo[marks]": ()=>removeOrder(o.id)
                        }["TradeMarks.useMemo[marks]"]
                    });
                }
            }
            for (const p of positions){
                if (p.symbol !== pane.symbol) continue;
                const long = p.side === "long";
                const color = long ? settings.buyLineColor : settings.sellLineColor;
                if (settings.showPositionLines) {
                    list.push({
                        key: `pos-${p.id}`,
                        price: p.entry,
                        label: `${long ? "Long" : "Short"} ${p.qty} @ ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(p.symbol, p.entry)}`,
                        color,
                        lineStyle: "solid",
                        onMove: {
                            "TradeMarks.useMemo[marks]": (price)=>updatePosition(p.id, {
                                    entry: price
                                })
                        }["TradeMarks.useMemo[marks]"],
                        onRemove: {
                            "TradeMarks.useMemo[marks]": ()=>removePosition(p.id)
                        }["TradeMarks.useMemo[marks]"]
                    });
                }
                if (settings.showTpSlLines && p.tp != null) {
                    list.push({
                        key: `tp-${p.id}`,
                        price: p.tp,
                        label: `TP ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(p.symbol, p.tp)}`,
                        color: settings.tpLineColor,
                        lineStyle: "dashed",
                        onMove: {
                            "TradeMarks.useMemo[marks]": (price)=>{
                                if (live) {
                                    if (busy.current) return;
                                    busy.current = true;
                                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchProtect"])(p.symbol, price, p.sl).finally({
                                        "TradeMarks.useMemo[marks]": ()=>{
                                            busy.current = false;
                                        }
                                    }["TradeMarks.useMemo[marks]"]);
                                } else {
                                    updatePosition(p.id, {
                                        tp: price
                                    });
                                }
                            }
                        }["TradeMarks.useMemo[marks]"],
                        onRemove: {
                            "TradeMarks.useMemo[marks]": ()=>{
                                if (live) {
                                    const orderId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findProtectiveOrderId"])(orders.map({
                                        "TradeMarks.useMemo[marks].orderId": (o)=>({
                                                id: o.id,
                                                symbol: o.symbol,
                                                closePosition: o.closePosition === true,
                                                price: o.price
                                            })
                                    }["TradeMarks.useMemo[marks].orderId"]), p.symbol, "tp", p.tp, p.sl);
                                    if (orderId) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchCancelOrder"])(orderId);
                                } else {
                                    updatePosition(p.id, {
                                        tp: null
                                    });
                                }
                            }
                        }["TradeMarks.useMemo[marks]"]
                    });
                }
                if (settings.showTpSlLines && p.sl != null) {
                    list.push({
                        key: `sl-${p.id}`,
                        price: p.sl,
                        label: `SL ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(p.symbol, p.sl)}`,
                        color: settings.slLineColor,
                        lineStyle: "dashed",
                        onMove: {
                            "TradeMarks.useMemo[marks]": (price)=>{
                                if (live) {
                                    if (busy.current) return;
                                    busy.current = true;
                                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchProtect"])(p.symbol, p.tp, price).finally({
                                        "TradeMarks.useMemo[marks]": ()=>{
                                            busy.current = false;
                                        }
                                    }["TradeMarks.useMemo[marks]"]);
                                } else {
                                    updatePosition(p.id, {
                                        sl: price
                                    });
                                }
                            }
                        }["TradeMarks.useMemo[marks]"],
                        onRemove: {
                            "TradeMarks.useMemo[marks]": ()=>{
                                if (live) {
                                    const orderId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trade$2d$marks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findProtectiveOrderId"])(orders.map({
                                        "TradeMarks.useMemo[marks].orderId": (o)=>({
                                                id: o.id,
                                                symbol: o.symbol,
                                                closePosition: o.closePosition === true,
                                                price: o.price
                                            })
                                    }["TradeMarks.useMemo[marks].orderId"]), p.symbol, "sl", p.tp, p.sl);
                                    if (orderId) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchCancelOrder"])(orderId);
                                } else {
                                    updatePosition(p.id, {
                                        sl: null
                                    });
                                }
                            }
                        }["TradeMarks.useMemo[marks]"]
                    });
                }
                if (settings.showLiqLines && p.liq != null) {
                    list.push({
                        key: `liq-${p.id}`,
                        price: p.liq,
                        label: `Liq ${p.leverage}x ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(p.symbol, p.liq)}`,
                        color: settings.liqLineColor,
                        lineStyle: "dotted",
                        onMove: {
                            "TradeMarks.useMemo[marks]": (price)=>updatePosition(p.id, {
                                    liq: price
                                })
                        }["TradeMarks.useMemo[marks]"],
                        onRemove: {
                            "TradeMarks.useMemo[marks]": ()=>updatePosition(p.id, {
                                    liq: null
                                })
                        }["TradeMarks.useMemo[marks]"]
                    });
                }
            }
            return list;
        }
    }["TradeMarks.useMemo[marks]"], [
        alerts,
        orders,
        positions,
        pane.symbol,
        settings,
        live,
        updateAlert,
        removeAlert,
        updateOrder,
        removeOrder,
        updatePosition,
        removePosition
    ]);
    const marksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(marks);
    marksRef.current = marks;
    const replayingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(replaying);
    replayingRef.current = replaying;
    /** markKey → Vela drawing id */ const idsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    /** Drawing ids being rewritten by THIS component (suppress drag echo). */ const syncingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Sync store state → Vela drawings (add / update / remove / show-hide).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradeMarks.useEffect": ()=>{
            let cancelled = false;
            let tries = 0;
            let timer = 0;
            const apply = {
                "TradeMarks.useEffect.apply": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(apply, 250);
                        return;
                    }
                    tries = 0;
                    const { vela } = handle;
                    const live = vela.drawings.all();
                    const byId = new Map(live.map({
                        "TradeMarks.useEffect.apply": (d)=>[
                                d.id,
                                d
                            ]
                    }["TradeMarks.useEffect.apply"]));
                    const ids = idsRef.current;
                    // Drop mappings whose drawing disappeared (chart remount).
                    for (const [key, id] of [
                        ...ids
                    ]){
                        if (!byId.has(id)) ids.delete(key);
                    }
                    // Remove drawings whose mark is gone.
                    const keys = new Set(marksRef.current.map({
                        "TradeMarks.useEffect.apply": (m)=>m.key
                    }["TradeMarks.useEffect.apply"]));
                    for (const [key, id] of [
                        ...ids
                    ]){
                        if (keys.has(key)) continue;
                        ids.delete(key);
                        try {
                            vela.drawings.remove(id);
                        } catch  {
                        /* already gone */ }
                    }
                    // Add / update.
                    const now = Date.now();
                    for (const m of marksRef.current){
                        const existingId = ids.get(m.key);
                        const existing = existingId ? byId.get(existingId) : undefined;
                        if (existing) {
                            const anchor = existing.anchors[0];
                            if (anchor && Math.abs(anchor.price - m.price) > 1e-12) {
                                syncingRef.current.add(existing.id);
                                try {
                                    vela.drawings.update(existing.id, {
                                        anchors: [
                                            {
                                                time: anchor.time,
                                                price: m.price
                                            }
                                        ]
                                    });
                                } catch  {
                                /* ignore */ }
                            }
                            if (existing.style.lineColor !== m.color) {
                                syncingRef.current.add(existing.id);
                                try {
                                    vela.drawings.update(existing.id, {
                                        style: {
                                            ...existing.style,
                                            lineColor: m.color,
                                            lineStyle: m.lineStyle
                                        }
                                    });
                                } catch  {
                                /* ignore */ }
                            }
                            // Replay hides every trade visual; replay end restores them.
                            if (existing.visible === replayingRef.current) {
                                syncingRef.current.add(existing.id);
                                try {
                                    vela.drawings.show(existing.id, !replayingRef.current);
                                } catch  {
                                /* ignore */ }
                            }
                            continue;
                        }
                        try {
                            const created = vela.drawings.add("hline", {
                                paneId: "price",
                                anchors: [
                                    {
                                        time: now,
                                        price: m.price
                                    }
                                ],
                                style: {
                                    lineColor: m.color,
                                    lineWidth: 1,
                                    lineStyle: m.lineStyle
                                },
                                text: {
                                    value: m.label,
                                    size: "tiny",
                                    hAlign: "right",
                                    vAlign: "center"
                                }
                            });
                            if (created) {
                                ids.set(m.key, created.id);
                                if (replayingRef.current) vela.drawings.show(created.id, false);
                            }
                        } catch  {
                        /* renderer not ready yet — retried on next marks change */ }
                    }
                }
            }["TradeMarks.useEffect.apply"];
            apply();
            return ({
                "TradeMarks.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                }
            })["TradeMarks.useEffect"];
        }
    }["TradeMarks.useEffect"], [
        pane.id,
        marks,
        replaying
    ]);
    // Vela → store: drag events on our lines.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradeMarks.useEffect": ()=>{
            let tries = 0;
            let timer = 0;
            let cancelled = false;
            let offs = [];
            const attach = {
                "TradeMarks.useEffect.attach": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(attach, 250);
                        return;
                    }
                    const { vela } = handle;
                    const onEdited = {
                        "TradeMarks.useEffect.attach.onEdited": ()=>{
                            if (replayingRef.current) return;
                            const ids = idsRef.current;
                            const all = vela.drawings.all();
                            for (const [key, id] of ids){
                                if (syncingRef.current.has(id)) continue;
                                const doc = all.find({
                                    "TradeMarks.useEffect.attach.onEdited.doc": (d)=>d.id === id
                                }["TradeMarks.useEffect.attach.onEdited.doc"]);
                                if (!doc) continue;
                                const price = doc.anchors[0]?.price;
                                if (price == null) continue;
                                const mark = marksRef.current.find({
                                    "TradeMarks.useEffect.attach.onEdited.mark": (m)=>m.key === key
                                }["TradeMarks.useEffect.attach.onEdited.mark"]);
                                if (!mark) continue;
                                if (Math.abs(mark.price - price) < 1e-12) continue;
                                // Vela emitted the new price → MAWS validates/executes; the confirmed
                                // broker state flows back through the store and re-syncs Vela.
                                mark.onMove(price);
                            }
                            syncingRef.current.clear();
                        }
                    }["TradeMarks.useEffect.attach.onEdited"];
                    const onRemoved = {
                        "TradeMarks.useEffect.attach.onRemoved": (payload)=>{
                            const id = payload.id;
                            const ids = idsRef.current;
                            for (const [key, vid] of [
                                ...ids
                            ]){
                                if (vid !== id) continue;
                                ids.delete(key);
                                if (replayingRef.current) return;
                                marksRef.current.find({
                                    "TradeMarks.useEffect.attach.onRemoved": (m)=>m.key === key
                                }["TradeMarks.useEffect.attach.onRemoved"])?.onRemove();
                            }
                        }
                    }["TradeMarks.useEffect.attach.onRemoved"];
                    offs = [
                        vela.on("drawing:edited", onEdited),
                        vela.on("drawing:removed", onRemoved)
                    ];
                }
            }["TradeMarks.useEffect.attach"];
            attach();
            return ({
                "TradeMarks.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                    for (const off of offs)off();
                }
            })["TradeMarks.useEffect"];
        }
    }["TradeMarks.useEffect"], [
        pane.id
    ]);
    // Risk/reward zones → renderer layer payload (hidden during replay).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradeMarks.useEffect": ()=>{
            let cancelled = false;
            let tries = 0;
            let timer = 0;
            const push = {
                "TradeMarks.useEffect.push": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(push, 250);
                        return;
                    }
                    const bands = !settings.showTpSlLines || replaying ? [] : positions.filter({
                        "TradeMarks.useEffect.push": (p)=>p.symbol === pane.symbol
                    }["TradeMarks.useEffect.push"]).flatMap({
                        "TradeMarks.useEffect.push": (p)=>{
                            const out = [];
                            if (p.tp != null) out.push({
                                entry: p.entry,
                                other: p.tp,
                                color: settings.tpLineColor
                            });
                            if (p.sl != null) out.push({
                                entry: p.entry,
                                other: p.sl,
                                color: settings.slLineColor
                            });
                            return out;
                        }
                    }["TradeMarks.useEffect.push"]);
                    try {
                        handle.renderer.setNativeData(TRADE_LAYER, {
                            bands
                        });
                    } catch  {
                    /* ignore */ }
                }
            }["TradeMarks.useEffect.push"];
            push();
            return ({
                "TradeMarks.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                }
            })["TradeMarks.useEffect"];
        }
    }["TradeMarks.useEffect"], [
        pane.id,
        positions,
        pane.symbol,
        settings.showTpSlLines,
        settings.tpLineColor,
        settings.slLineColor,
        replaying,
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"]
    ]);
    // Vela owns rendering — no DOM output.
    return null;
}
_s(TradeMarks, "CBF0DCIHO+Js3v88KW0JH9cdMuQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$selectors$2f$broker$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBrokerBook"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = TradeMarks;
var _c;
__turbopack_context__.k.register(_c, "TradeMarks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_charts_1e5nx2e._.js.map