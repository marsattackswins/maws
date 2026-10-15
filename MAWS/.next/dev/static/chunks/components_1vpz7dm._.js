(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/alerts/AlertsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertsPanel",
    ()=>AlertsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ResizableColumns.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-quotes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell-plus.mjs [app-client] (ecmascript) <export default as BellPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
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
function AlertsPanel() {
    _s();
    const pane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActivePane"])();
    const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuote"])(pane.symbol);
    const alerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AlertsPanel.useAppStore[alerts]": (s)=>s.alerts
    }["AlertsPanel.useAppStore[alerts]"]);
    const addAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AlertsPanel.useAppStore[addAlert]": (s)=>s.addAlert
    }["AlertsPanel.useAppStore[addAlert]"]);
    const toggleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AlertsPanel.useAppStore[toggleAlert]": (s)=>s.toggleAlert
    }["AlertsPanel.useAppStore[toggleAlert]"]);
    const removeAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AlertsPanel.useAppStore[removeAlert]": (s)=>s.removeAlert
    }["AlertsPanel.useAppStore[removeAlert]"]);
    const [price, setPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [side, setSide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("above");
    const { template, onResize } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnWidths"])("alerts", [
        28,
        100,
        90,
        72,
        28
    ]);
    const fired = (target, s)=>{
        if (!quote) return false;
        return s === "above" ? quote.last >= target : quote.last <= target;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 flex-col",
        style: {
            color: "var(--maws-text)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-8 items-center border-b px-2 text-[13px] font-semibold",
                style: {
                    borderColor: "var(--maws-border)"
                },
                children: "Alerts"
            }, void 0, false, {
                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b px-2 py-2",
                style: {
                    borderColor: "var(--maws-border)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-1 text-[11px]",
                        style: {
                            color: "var(--maws-muted)"
                        },
                        children: [
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(pane.symbol),
                            " last ",
                            quote ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(pane.symbol, quote.last) : "—"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: side,
                                onChange: (e)=>setSide(e.target.value),
                                className: "h-7 border px-1 text-[12px]",
                                style: {
                                    borderColor: "var(--maws-border)",
                                    background: "var(--maws-bg)",
                                    color: "var(--maws-text)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "above",
                                        children: "Crossing up"
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "below",
                                        children: "Crossing down"
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: price,
                                onChange: (e)=>setPrice(e.target.value),
                                placeholder: "Price",
                                className: "h-7 w-full border px-2 text-[12px] outline-none",
                                style: {
                                    borderColor: "var(--maws-border)",
                                    background: "var(--maws-bg)",
                                    color: "var(--maws-text)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "flex h-7 items-center gap-1 bg-[#2962ff] px-2 text-[11px] text-white",
                                onClick: ()=>{
                                    const value = Number(price) || quote?.last;
                                    if (!value) return;
                                    addAlert({
                                        symbol: pane.symbol,
                                        price: value,
                                        side,
                                        enabled: true
                                    });
                                    setPrice("");
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellPlus$3e$__["BellPlus"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 74,
                                        columnNumber: 13
                                    }, this),
                                    "Add"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 flex-1 overflow-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky top-0 z-10 grid border-b px-2 py-1 text-[10px] uppercase",
                        style: {
                            gridTemplateColumns: template,
                            minWidth: "max-content",
                            borderColor: "var(--maws-border)",
                            background: "var(--maws-panel)",
                            color: "var(--maws-muted)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative pr-1",
                                children: [
                                    "On",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColResize"], {
                                        onMouseDown: onResize(0, 22)
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative truncate pr-1",
                                children: [
                                    "Symbol",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColResize"], {
                                        onMouseDown: onResize(1, 56)
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative truncate pr-1",
                                children: [
                                    "Condition",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColResize"], {
                                        onMouseDown: onResize(2, 56)
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative truncate pr-1",
                                children: [
                                    "Status",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColResize"], {
                                        onMouseDown: onResize(3, 44)
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative truncate",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColResize"], {
                                        onMouseDown: onResize(4, 22)
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    alerts.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-6 text-center text-[12px] text-(--app-muted)",
                        children: "No alerts. Add a price level for the active symbol."
                    }, void 0, false, {
                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    alerts.map((alert)=>{
                        const hit = alert.enabled && fired(alert.price, alert.side);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid items-center border-b border-[#222222] px-2 py-2",
                            style: {
                                gridTemplateColumns: template,
                                minWidth: "max-content"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: alert.enabled,
                                    onChange: ()=>toggleAlert(alert.id)
                                }, void 0, false, {
                                    fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate pr-1 text-[12px] text-(--app-text)",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(alert.symbol)
                                }, void 0, false, {
                                    fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate pr-1 text-[12px] text-(--app-text)",
                                    children: [
                                        alert.side === "above" ? "≥" : "≤",
                                        " ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(alert.symbol, alert.price)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `truncate pr-1 text-[11px] ${hit ? "text-[#089981]" : "text-(--app-muted)"}`,
                                    children: hit ? "Triggered" : "Waiting"
                                }, void 0, false, {
                                    fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "text-(--app-muted) hover:text-[#f23645]",
                                    onClick: ()=>removeAlert(alert.id),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        size: 13
                                    }, void 0, false, {
                                        fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/alerts/AlertsPanel.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, alert.id, true, {
                            fileName: "[project]/components/alerts/AlertsPanel.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/alerts/AlertsPanel.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/alerts/AlertsPanel.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(AlertsPanel, "vAz71PCalu2PXrRTDsoghcnona0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActivePane"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuote"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ResizableColumns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnWidths"]
    ];
});
_c = AlertsPanel;
var _c;
__turbopack_context__.k.register(_c, "AlertsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/brand/AssetLogo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssetLogo",
    ()=>AssetLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$asset$2d$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/asset-logo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AssetLogo({ symbol, size = 18, className = "" }) {
    _s();
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AssetLogo.useEffect": ()=>{
            setFailed(false);
        }
    }["AssetLogo.useEffect"], [
        symbol
    ]);
    const letter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$asset$2d$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assetLogoLetter"])(symbol);
    const bg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["symbolColor"])(symbol);
    if (failed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `inline-flex shrink-0 items-center justify-center rounded-full text-white ${className}`,
            style: {
                width: size,
                height: size,
                background: bg,
                fontSize: Math.max(8, Math.round(size * 0.55)),
                fontWeight: 700
            },
            "aria-hidden": true,
            children: letter
        }, void 0, false, {
            fileName: "[project]/components/brand/AssetLogo.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    return(// eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$asset$2d$logo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assetLogoSrc"])(symbol),
        alt: "",
        width: size,
        height: size,
        draggable: false,
        className: `inline-block shrink-0 rounded-full bg-(--app-hover) object-cover ${className}`,
        style: {
            width: size,
            height: size
        },
        onError: ()=>setFailed(true)
    }, symbol, false, {
        fileName: "[project]/components/brand/AssetLogo.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this));
}
_s(AssetLogo, "+E5ryvqgaYudHh8cyxuVbWcUOGQ=");
_c = AssetLogo;
var _c;
__turbopack_context__.k.register(_c, "AssetLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/brand/MawsLogo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Inline pixel-M mark — used in-app so it never drifts from a cached static asset. */ __turbopack_context__.s([
    "MawsLogo",
    ()=>MawsLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function MawsLogo({ size = 16, className = "", title = "MAWS", /** When false, glyph only (parent supplies the chip background). */ withBackground = false }) {
    const cell = 3;
    const origin = 5.5;
    const px = (col, row)=>({
            x: origin + col * cell,
            y: origin + row * cell,
            width: cell,
            height: cell
        });
    // 7×7 classic pixel M
    const cells = [
        // left stem
        [
            0,
            0
        ],
        [
            0,
            1
        ],
        [
            0,
            2
        ],
        [
            0,
            3
        ],
        [
            0,
            4
        ],
        [
            0,
            5
        ],
        [
            0,
            6
        ],
        // right stem
        [
            6,
            0
        ],
        [
            6,
            1
        ],
        [
            6,
            2
        ],
        [
            6,
            3
        ],
        [
            6,
            4
        ],
        [
            6,
            5
        ],
        [
            6,
            6
        ],
        // V
        [
            1,
            1
        ],
        [
            2,
            2
        ],
        [
            3,
            3
        ],
        [
            4,
            2
        ],
        [
            5,
            1
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        width: size,
        height: size,
        className: className,
        shapeRendering: "crispEdges",
        "aria-label": title,
        role: "img",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: title
            }, void 0, false, {
                fileName: "[project]/components/brand/MawsLogo.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            withBackground && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "32",
                height: "32",
                rx: "6",
                fill: "#0A0A0A"
            }, void 0, false, {
                fileName: "[project]/components/brand/MawsLogo.tsx",
                lineNumber: 45,
                columnNumber: 26
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "#E8EAED",
                children: cells.map(([c, r])=>{
                    const p = px(c, r);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: p.x,
                        y: p.y,
                        width: p.width,
                        height: p.height
                    }, `${c}-${r}`, false, {
                        fileName: "[project]/components/brand/MawsLogo.tsx",
                        lineNumber: 49,
                        columnNumber: 18
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/brand/MawsLogo.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/brand/MawsLogo.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = MawsLogo;
var _c;
__turbopack_context__.k.register(_c, "MawsLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/calendar/EconomicCalendar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EconomicCalendar",
    ()=>EconomicCalendar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/calendar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2d$event$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/calendar-event-guide.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const DAY_MS = 86_400_000;
/** Event is treated as live from release time through this window. */ const LIVE_WINDOW_MS = 30 * 60_000;
function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function formatEventTime(at) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(at);
}
function EventCard({ event, open, now, onToggle, onOpenSymbol }) {
    const time = formatEventTime(event.at);
    const live = now >= event.at && now < event.at + LIVE_WINDOW_MS;
    const past = !live && event.at < now;
    const guide = open ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2d$event$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEventGuide"])(event.title) : null;
    const impactBar = event.impact === "high" ? "bg-[#f23645]" : event.impact === "medium" ? "bg-[#ffa726]" : "bg-[#4c525e]";
    const impactLabel = event.impact === "high" ? "High impact" : event.impact === "medium" ? "Medium impact" : "Low impact";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onToggle,
        className: `group relative w-full overflow-hidden rounded-md border text-left transition-colors ${live ? "border-[#3a3a3a] bg-[var(--maws-elevated)]" : open ? "border-[#333333] bg-[var(--maws-elevated)]" : "border-[var(--maws-border)] bg-[var(--maws-panel)] hover:border-[#2a2a2a] hover:bg-[var(--maws-elevated)]"} ${past ? "opacity-55" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `absolute inset-y-0 left-0 w-[3px] ${impactBar}`,
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-2.5 pr-3 pb-6 pl-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline justify-between gap-3 text-[11px] leading-[16px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex min-w-0 items-baseline gap-2 text-(--app-muted)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "shrink-0 tabular-nums font-medium text-(--app-text)",
                                                children: time
                                            }, void 0, false, {
                                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                                lineNumber: 83,
                                                columnNumber: 15
                                            }, this),
                                            live && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "shrink-0 text-[9px] font-semibold uppercase tracking-wide text-(--app-text)",
                                                children: "Live"
                                            }, void 0, false, {
                                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                                lineNumber: 87,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#333333]",
                                                children: "·"
                                            }, void 0, false, {
                                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                                lineNumber: 91,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "shrink-0 uppercase tracking-wide",
                                                children: event.country
                                            }, void 0, false, {
                                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this),
                                    event.forecast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 tabular-nums text-[#5b9cf6]",
                                        children: [
                                            "Forecast: ",
                                            event.forecast
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline justify-between gap-3 text-[13px] leading-[18px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 font-medium text-(--app-text)",
                                        children: event.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this),
                                    event.previous ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 text-[11px] leading-[16px] tabular-nums text-[#ffa726]",
                                        children: [
                                            "Previous: ",
                                            event.previous
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this) : event.actual ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 text-[11px] leading-[16px] tabular-nums text-[#26a69a]",
                                        children: [
                                            "Actual: ",
                                            event.actual
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            event.actual && event.previous ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end text-[11px] leading-[16px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "tabular-nums text-[#26a69a]",
                                    children: [
                                        "Actual: ",
                                        event.actual
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    open && guide && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 space-y-2.5 border-t border-[#1c1c1c] pt-2.5 text-[11px] leading-snug",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#4c525e]",
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-(--app-muted)",
                                        children: guide.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#4c525e]",
                                        children: "Usual effect"
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-(--app-muted)",
                                        children: guide.usualEffect
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#4c525e]",
                                        children: "Why traders care"
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-(--app-muted)",
                                        children: guide.whyTradersCare
                                    }, void 0, false, {
                                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-[10px] font-semibold uppercase tracking-wide ${event.impact === "high" ? "text-[#f23645]" : event.impact === "medium" ? "text-[#ffa726]" : "text-[#4c525e]"}`,
                                children: impactLabel
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            event.category === "crypto" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-block cursor-pointer text-[#2962ff] hover:underline",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onOpenSymbol("BTCUSDT");
                                },
                                children: "Open BTCUSDT"
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 159,
                                columnNumber: 15
                            }, this) : event.category === "commodity" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-block cursor-pointer text-[#2962ff] hover:underline",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onOpenSymbol("XAUUSDT");
                                },
                                children: "Open XAUUSDT"
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 169,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `pointer-events-none absolute right-2 bottom-1.5 text-[#4c525e] transition-opacity ${open ? "opacity-70" : "opacity-0 group-hover:opacity-70"}`,
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    size: 14,
                    className: `transition-transform ${open ? "rotate-180" : ""}`
                }, void 0, false, {
                    fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c = EventCard;
function EconomicCalendar() {
    _s();
    const setSymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "EconomicCalendar.useAppStore[setSymbol]": (s)=>s.setSymbol
    }["EconomicCalendar.useAppStore[setSymbol]"]);
    const onlyFuture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "EconomicCalendar.useAppStore[onlyFuture]": (s)=>s.chartSettings.onlyFutureEvents
    }["EconomicCalendar.useAppStore[onlyFuture]"]);
    const economicEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "EconomicCalendar.useAppStore[economicEvents]": (s)=>s.chartSettings.economicEvents
    }["EconomicCalendar.useAppStore[economicEvents]"]);
    const [todayStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "EconomicCalendar.useState": ()=>startOfDay(Date.now())
    }["EconomicCalendar.useState"]);
    const [cursor, setCursor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(todayStart);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "EconomicCalendar.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMockCalendarEvents"])()
    }["EconomicCalendar.useState"]);
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("mock");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [windowStart, setWindowStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(todayStart);
    const [windowEnd, setWindowEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(todayStart + __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CALENDAR_FORWARD_DAYS"] * DAY_MS);
    const [reloadToken, setReloadToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "EconomicCalendar.useState": ()=>Date.now()
    }["EconomicCalendar.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EconomicCalendar.useEffect": ()=>{
            const id = window.setInterval({
                "EconomicCalendar.useEffect.id": ()=>setNow(Date.now())
            }["EconomicCalendar.useEffect.id"], 30_000);
            return ({
                "EconomicCalendar.useEffect": ()=>window.clearInterval(id)
            })["EconomicCalendar.useEffect"];
        }
    }["EconomicCalendar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EconomicCalendar.useEffect": ()=>{
            let cancelled = false;
            setLoading(true);
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCalendarEvents"])().then({
                "EconomicCalendar.useEffect": (result)=>{
                    if (cancelled) return;
                    setEvents(result.events);
                    setSource(result.source);
                    setStatus(result.error ?? null);
                    setWindowStart(result.windowStart);
                    setWindowEnd(result.windowEnd);
                    setLoading(false);
                }
            }["EconomicCalendar.useEffect"]);
            return ({
                "EconomicCalendar.useEffect": ()=>{
                    cancelled = true;
                }
            })["EconomicCalendar.useEffect"];
        }
    }["EconomicCalendar.useEffect"], [
        reloadToken
    ]);
    const nowMs = now;
    const maxDay = windowEnd - DAY_MS;
    const minDay = windowStart;
    const dayEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EconomicCalendar.useMemo[dayEvents]": ()=>{
            return events.filter({
                "EconomicCalendar.useMemo[dayEvents]": (e)=>startOfDay(e.at) === cursor
            }["EconomicCalendar.useMemo[dayEvents]"]).filter({
                "EconomicCalendar.useMemo[dayEvents]": (e)=>onlyFuture ? e.at >= nowMs - LIVE_WINDOW_MS : true
            }["EconomicCalendar.useMemo[dayEvents]"]).sort({
                "EconomicCalendar.useMemo[dayEvents]": (a, b)=>a.at - b.at
            }["EconomicCalendar.useMemo[dayEvents]"]);
        }
    }["EconomicCalendar.useMemo[dayEvents]"], [
        events,
        cursor,
        onlyFuture,
        nowMs
    ]);
    const label = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    }).format(cursor);
    const isToday = cursor === todayStart;
    const canPrev = cursor > minDay;
    const canNext = cursor < maxDay;
    if (!economicEvents) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center px-4 text-center text-[13px] text-(--app-muted)",
            children: "Economic events are hidden in Settings → Events"
        }, void 0, false, {
            fileName: "[project]/components/calendar/EconomicCalendar.tsx",
            lineNumber: 264,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-8 shrink-0 items-center justify-between border-b border-[#222222] px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-w-0 items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-semibold text-(--app-text)",
                                children: "Calendar"
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate text-[10px] uppercase tracking-wide text-[#4c525e]",
                                title: status ?? undefined,
                                children: loading ? "…" : source === "mock" ? "Demo" : "Live · Xoomar"
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                title: "Reload calendar",
                                className: "h-5 rounded px-1 text-[10px] text-[#4c525e] hover:bg-(--app-hover) hover:text-(--app-text)",
                                onClick: ()=>setReloadToken((n)=>n + 1),
                                children: "Reload"
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                title: "Previous day",
                                disabled: !canPrev,
                                className: "flex h-6 w-6 items-center justify-center rounded-[4px] text-(--app-muted) hover:bg-(--app-hover) disabled:opacity-30",
                                onClick: ()=>setCursor(Math.max(minDay, cursor - DAY_MS)),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                    lineNumber: 302,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "min-w-[4.5rem] px-1 text-center text-[12px] text-(--app-text) hover:text-white",
                                onClick: ()=>setCursor(todayStart),
                                children: isToday ? "Today" : label
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                title: "Next day",
                                disabled: !canNext,
                                className: "flex h-6 w-6 items-center justify-center rounded-[4px] text-(--app-muted) hover:bg-(--app-hover) disabled:opacity-30",
                                onClick: ()=>setCursor(Math.min(maxDay, cursor + DAY_MS)),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            source === "mock" && status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 border-b border-[#222222] px-2 py-1 text-[10px] text-(--app-muted)",
                children: status
            }, void 0, false, {
                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                lineNumber: 324,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2",
                children: [
                    dayEvents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-2 py-8 text-center text-[12px] text-(--app-muted)",
                        children: loading ? "Loading events…" : "No events this day"
                    }, void 0, false, {
                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1.5",
                        children: dayEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventCard, {
                                event: event,
                                open: selected === event.id,
                                now: nowMs,
                                onToggle: ()=>setSelected(selected === event.id ? null : event.id),
                                onOpenSymbol: setSymbol
                            }, event.id, false, {
                                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                                lineNumber: 338,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                        lineNumber: 336,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/calendar/EconomicCalendar.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/calendar/EconomicCalendar.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
}
_s(EconomicCalendar, "RRoF4M6+kw89109fP/SbOJFRCXA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = EconomicCalendar;
var _c, _c1;
__turbopack_context__.k.register(_c, "EventCard");
__turbopack_context__.k.register(_c1, "EconomicCalendar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/calendar/NewsCalendarPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewsCalendarPanel",
    ()=>NewsCalendarPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$calendar$2f$EconomicCalendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/calendar/EconomicCalendar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$news$2f$NewsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/news/NewsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const MIN_RATIO = 0.22;
const MAX_RATIO = 0.78;
function NewsCalendarPanel() {
    _s();
    const calendarRatio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "NewsCalendarPanel.useAppStore[calendarRatio]": (s)=>s.calendarNewsSplit
    }["NewsCalendarPanel.useAppStore[calendarRatio]"]);
    const setCalendarNewsSplit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "NewsCalendarPanel.useAppStore[setCalendarNewsSplit]": (s)=>s.setCalendarNewsSplit
    }["NewsCalendarPanel.useAppStore[setCalendarNewsSplit]"]);
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: "flex h-full min-h-0 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 overflow-hidden",
                style: {
                    flex: `${calendarRatio} 1 0%`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$calendar$2f$EconomicCalendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EconomicCalendar"], {}, void 0, false, {
                    fileName: "[project]/components/calendar/NewsCalendarPanel.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/calendar/NewsCalendarPanel.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 h-1.5 shrink-0 cursor-row-resize border-y border-[var(--maws-border)] bg-[var(--maws-panel)] hover:bg-[var(--maws-elevated)]",
                title: "Drag to resize Calendar / News",
                onMouseDown: (e)=>{
                    e.preventDefault();
                    const el = rootRef.current;
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const prev = document.body.style.userSelect;
                    document.body.style.userSelect = "none";
                    const move = (ev)=>{
                        const next = (ev.clientY - rect.top) / Math.max(1, rect.height);
                        setCalendarNewsSplit(Math.min(MAX_RATIO, Math.max(MIN_RATIO, next)));
                    };
                    const up = ()=>{
                        document.body.style.userSelect = prev;
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", up);
                    };
                    window.addEventListener("mousemove", move);
                    window.addEventListener("mouseup", up);
                }
            }, void 0, false, {
                fileName: "[project]/components/calendar/NewsCalendarPanel.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 overflow-hidden",
                style: {
                    flex: `${1 - calendarRatio} 1 0%`
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$news$2f$NewsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NewsPanel"], {}, void 0, false, {
                    fileName: "[project]/components/calendar/NewsCalendarPanel.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/calendar/NewsCalendarPanel.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/calendar/NewsCalendarPanel.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(NewsCalendarPanel, "+9w01kR92YGXHq6hb2CGOD6ruQk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = NewsCalendarPanel;
var _c;
__turbopack_context__.k.register(_c, "NewsCalendarPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/details/TechnicalsGauge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TechnicalsGauge",
    ()=>TechnicalsGauge,
    "leanFromRsi",
    ()=>leanFromRsi,
    "leanFromScreener",
    ()=>leanFromScreener
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function polar(cx, cy, deg, radius) {
    const rad = deg * Math.PI / 180;
    return {
        x: cx + Math.cos(rad) * radius,
        y: cy - Math.sin(rad) * radius
    };
}
function arcPath(cx, cy, radius, startDeg, endDeg) {
    const s = polar(cx, cy, startDeg, radius);
    const e = polar(cx, cy, endDeg, radius);
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}
const LEAN_LABEL = {
    strongShort: "Strong short",
    short: "Short",
    neutral: "Neutral",
    long: "Long",
    strongLong: "Strong long"
};
/** Needle score 0 (strong short) → 100 (strong long). */ const LEAN_SCORE = {
    strongShort: 10,
    short: 30,
    neutral: 50,
    long: 70,
    strongLong: 90
};
function leanFromScreener(bullishMet, bearishMet) {
    const longLean = bullishMet >= 5 ? "strongLong" : bullishMet >= 3 ? "long" : null;
    const shortLean = bearishMet >= 5 ? "strongShort" : bearishMet >= 3 ? "short" : null;
    if (longLean && shortLean) {
        if (bullishMet > bearishMet) return longLean;
        if (bearishMet > bullishMet) return shortLean;
        return "neutral";
    }
    return longLean ?? shortLean ?? "neutral";
}
function leanFromRsi(rsi) {
    const clamped = Math.max(0, Math.min(100, rsi));
    if (clamped >= 80) return "strongLong";
    if (clamped >= 60) return "long";
    if (clamped >= 40) return "neutral";
    if (clamped >= 20) return "short";
    return "strongShort";
}
function TechnicalsGauge({ lean }) {
    _s();
    const gid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])().replaceAll(":", "");
    const score = LEAN_SCORE[lean];
    const angle = 180 - score / 100 * 180;
    const label = LEAN_LABEL[lean];
    const cx = 150;
    const cy = 150;
    const r = 95;
    const tip = polar(cx, cy, angle, r - 16);
    const around = [
        {
            text: "Short",
            deg: 138,
            extra: 26
        },
        {
            text: "Neutral",
            deg: 90,
            extra: 28
        },
        {
            text: "Long",
            deg: 42,
            extra: 26
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-3 pb-3 pt-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-0.5 text-[13px] font-semibold text-(--app-text)",
                children: "Technicals"
            }, void 0, false, {
                fileName: "[project]/components/details/TechnicalsGauge.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 300 220",
                width: 220,
                height: 161,
                className: "mx-auto block shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: `${gid}-arc`,
                            x1: "0%",
                            y1: "0%",
                            x2: "100%",
                            y2: "0%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#f23645"
                                }, void 0, false, {
                                    fileName: "[project]/components/details/TechnicalsGauge.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "20%",
                                    stopColor: "#e04080"
                                }, void 0, false, {
                                    fileName: "[project]/components/details/TechnicalsGauge.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "50%",
                                    stopColor: "#9c27b0"
                                }, void 0, false, {
                                    fileName: "[project]/components/details/TechnicalsGauge.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "80%",
                                    stopColor: "#5c6bc0"
                                }, void 0, false, {
                                    fileName: "[project]/components/details/TechnicalsGauge.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#2962ff"
                                }, void 0, false, {
                                    fileName: "[project]/components/details/TechnicalsGauge.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/details/TechnicalsGauge.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: arcPath(cx, cy, r, 180, 0),
                        fill: "none",
                        stroke: "var(--app-border)",
                        strokeWidth: "7",
                        strokeLinecap: "butt"
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: arcPath(cx, cy, r, 174, 6),
                        fill: "none",
                        stroke: `url(#${gid}-arc)`,
                        strokeWidth: "5.5",
                        strokeLinecap: "butt"
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    around.map((item)=>{
                        const p = polar(cx, cy, item.deg, r + item.extra);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: p.x,
                            y: p.y,
                            fill: "var(--app-text)",
                            fontSize: "12",
                            fontWeight: "600",
                            fontFamily: "Trebuchet MS, sans-serif",
                            textAnchor: "middle",
                            dominantBaseline: "middle",
                            children: item.text
                        }, item.text, false, {
                            fileName: "[project]/components/details/TechnicalsGauge.tsx",
                            lineNumber: 117,
                            columnNumber: 13
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: cx - r,
                        y: cy + 22,
                        fill: "var(--app-text)",
                        fontSize: "12",
                        fontWeight: "600",
                        fontFamily: "Trebuchet MS, sans-serif",
                        textAnchor: "middle",
                        children: "Strong short"
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: cx + r,
                        y: cy + 22,
                        fill: "var(--app-text)",
                        fontSize: "12",
                        fontWeight: "600",
                        fontFamily: "Trebuchet MS, sans-serif",
                        textAnchor: "middle",
                        children: "Strong long"
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: cx,
                        y1: cy,
                        x2: tip.x,
                        y2: tip.y,
                        stroke: "var(--app-text)",
                        strokeWidth: "1.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: cx,
                        cy: cy,
                        r: "3.25",
                        fill: "var(--app-text)"
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: cx,
                        y: cy + 40,
                        fill: "var(--app-text)",
                        fontSize: "16",
                        fontWeight: "700",
                        fontFamily: "Trebuchet MS, sans-serif",
                        textAnchor: "middle",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/details/TechnicalsGauge.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/details/TechnicalsGauge.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/details/TechnicalsGauge.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(TechnicalsGauge, "xfMyHNFebGjSN1/YPqrD8z5EdLc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = TechnicalsGauge;
var _c;
__turbopack_context__.k.register(_c, "TechnicalsGauge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/drawings/DrawingOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingOverlay",
    ()=>DrawingOverlay
]);
/**
 * DrawingOverlay.tsx — Vela implementation.
 *
 * All drawing rendering/interaction is Vela's native renderer (`chart.drawings`).
 * This component only bridges state:
 *  - MAWS drawing slice → Vela drawings (add / update anchors+style / remove)
 *  - Vela drawing events → MAWS slice (create / edit / delete)
 *  - tool arming, magnet, stay-mode and visibility from the existing toolbar
 *
 * While a replay is active for the pane every drawing is hidden (replay must
 * not reveal future drawings), and restored on replay end.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// MAWS tool → Vela drawing type
const TOOL_MAP = {
    cursor: null,
    zoom: null,
    trend: "trendline",
    hray: "hray",
    fib: "fibretracement",
    path: "polyline",
    dcurve: "curve",
    long: "position",
    short: "position",
    rect: "box",
    circle: "ellipse",
    arrowUp: "arrowmarkup",
    arrowDown: "arrowmarkdown",
    text: "text"
};
// Vela drawing type → MAWS tool (for drawings created in-chart)
const REVERSE_TOOL = {
    trendline: "trend",
    hray: "hray",
    fibretracement: "fib",
    polyline: "path",
    curve: "dcurve",
    position: "long",
    box: "rect",
    ellipse: "circle",
    arrowmarkup: "arrowUp",
    arrowmarkdown: "arrowDown",
    text: "text"
};
function toVelaStyle(d) {
    const lineStyle = d.lineStyle === "dashed" ? "dashed" : d.lineStyle === "dotted" ? "dotted" : "solid";
    return {
        lineColor: d.color,
        lineWidth: d.lineWidth ?? 1,
        lineStyle,
        // Rect/circle fill migration (MAWS fillVisible defaults true for rect).
        ...d.fillColor && (d.fillVisible ?? d.tool === "rect") ? {
            fillColor: d.fillColor
        } : {}
    };
}
function mawsLineStyle(style) {
    if (style === "dashed") return "dashed";
    if (style === "dotted") return "dotted";
    return "solid";
}
function toAnchors(d) {
    return d.points.map((p)=>({
            time: p.time * 1000,
            price: p.price
        }));
}
function DrawingOverlay({ pane }) {
    _s();
    const paneDrawings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[paneDrawings]": (s)=>s.panes.find({
                "DrawingOverlay.useAppStore[paneDrawings]": (p)=>p.id === pane.id
            }["DrawingOverlay.useAppStore[paneDrawings]"])?.drawings ?? pane.drawings
    }["DrawingOverlay.useAppStore[paneDrawings]"]);
    const drawingTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[drawingTool]": (s)=>s.drawingTool
    }["DrawingOverlay.useAppStore[drawingTool]"]);
    const magnet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[magnet]": (s)=>s.magnet
    }["DrawingOverlay.useAppStore[magnet]"]);
    const stay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[stay]": (s)=>s.stayInDrawingMode
    }["DrawingOverlay.useAppStore[stay]"]);
    const drawingsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[drawingsHidden]": (s)=>s.drawingsHidden
    }["DrawingOverlay.useAppStore[drawingsHidden]"]);
    const replay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[replay]": (s)=>s.replay
    }["DrawingOverlay.useAppStore[replay]"]);
    const addDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[addDrawing]": (s)=>s.addDrawing
    }["DrawingOverlay.useAppStore[addDrawing]"]);
    const updateDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[updateDrawing]": (s)=>s.updateDrawing
    }["DrawingOverlay.useAppStore[updateDrawing]"]);
    const removeDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingOverlay.useAppStore[removeDrawing]": (s)=>s.removeDrawing
    }["DrawingOverlay.useAppStore[removeDrawing]"]);
    const replaying = replay?.paneId === pane.id;
    /** MAWS drawing id → Vela drawing id */ const idsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    /** Vela drawing ids being written by THIS component (suppress echo). */ const syncingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    /** Live event handlers re-read current state through refs. */ const drawingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(paneDrawings);
    drawingsRef.current = paneDrawings;
    const replayingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(replaying);
    replayingRef.current = replaying;
    const hiddenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(drawingsHidden);
    hiddenRef.current = drawingsHidden;
    // ── store → Vela ─────────────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingOverlay.useEffect": ()=>{
            let cancelled = false;
            let tries = 0;
            let timer = 0;
            const apply = {
                "DrawingOverlay.useEffect.apply": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(apply, 250);
                        return;
                    }
                    tries = 0;
                    const { vela } = handle;
                    const ids = idsRef.current;
                    const live = vela.drawings.all();
                    const byId = new Map(live.map({
                        "DrawingOverlay.useEffect.apply": (d)=>[
                                d.id,
                                d
                            ]
                    }["DrawingOverlay.useEffect.apply"]));
                    // Chart remounted → drop stale mappings (their drawings are gone).
                    for (const [key, id] of [
                        ...ids
                    ]){
                        if (!byId.has(id)) ids.delete(key);
                    }
                    // Remove drawings whose slice entry disappeared.
                    const wanted = new Set(paneDrawings.map({
                        "DrawingOverlay.useEffect.apply": (d)=>d.id
                    }["DrawingOverlay.useEffect.apply"]));
                    for (const [key, id] of [
                        ...ids
                    ]){
                        if (wanted.has(key)) continue;
                        ids.delete(key);
                        try {
                            vela.drawings.remove(id);
                        } catch  {
                        /* already gone */ }
                    }
                    for (const d of paneDrawings){
                        const type = TOOL_MAP[d.tool];
                        if (!type || d.points.length === 0) continue;
                        const existingId = ids.get(d.id);
                        const existing = existingId ? byId.get(existingId) : undefined;
                        if (existing) {
                            syncingRef.current.add(existing.id);
                            try {
                                vela.drawings.update(existing.id, {
                                    anchors: toAnchors(d),
                                    style: toVelaStyle(d),
                                    ...d.text != null ? {
                                        text: {
                                            value: d.text,
                                            size: "normal",
                                            hAlign: "left",
                                            vAlign: "top"
                                        }
                                    } : {}
                                });
                                const shouldShow = !replayingRef.current && !hiddenRef.current;
                                if (existing.visible !== shouldShow) vela.drawings.show(existing.id, shouldShow);
                            } catch  {
                            /* ignore */ }
                            continue;
                        }
                        try {
                            const created = vela.drawings.add(type, {
                                paneId: "price",
                                anchors: toAnchors(d),
                                style: toVelaStyle(d),
                                ...d.text != null ? {
                                    text: {
                                        value: d.text,
                                        size: "normal",
                                        hAlign: "left",
                                        vAlign: "top"
                                    }
                                } : {}
                            });
                            if (created) {
                                ids.set(d.id, created.id);
                                if (replayingRef.current || hiddenRef.current) vela.drawings.show(created.id, false);
                            }
                        } catch  {
                        /* renderer not ready — retried on the next change */ }
                    }
                    syncingRef.current.clear();
                }
            }["DrawingOverlay.useEffect.apply"];
            apply();
            return ({
                "DrawingOverlay.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                }
            })["DrawingOverlay.useEffect"];
        }
    }["DrawingOverlay.useEffect"], [
        pane.id,
        paneDrawings
    ]);
    // ── visibility toggles (hide drawings / replay) ───────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingOverlay.useEffect": ()=>{
            const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
            if (!handle) return;
            const visible = !drawingsHidden && !replaying;
            for (const id of idsRef.current.values()){
                syncingRef.current.add(id);
                try {
                    handle.vela.drawings.show(id, visible);
                } catch  {
                /* ignore */ }
            }
        }
    }["DrawingOverlay.useEffect"], [
        drawingsHidden,
        replaying,
        pane.id
    ]);
    // ── tool / magnet / stay-mode arming ─────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingOverlay.useEffect": ()=>{
            const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
            if (!handle) return;
            const velaType = TOOL_MAP[drawingTool] ?? null;
            try {
                handle.vela.drawings.setTool(velaType);
            } catch  {
            /* renderer not ready */ }
        }
    }["DrawingOverlay.useEffect"], [
        drawingTool,
        pane.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingOverlay.useEffect": ()=>{
            const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
            if (!handle) return;
            try {
                handle.vela.drawings.setSnapMode(magnet ? "strong" : "off");
            } catch  {
            /* ignore */ }
        }
    }["DrawingOverlay.useEffect"], [
        magnet,
        pane.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingOverlay.useEffect": ()=>{
            const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
            if (!handle) return;
            try {
                handle.vela.drawings.setStayMode(stay);
            } catch  {
            /* ignore */ }
        }
    }["DrawingOverlay.useEffect"], [
        stay,
        pane.id
    ]);
    // ── Vela → store: tool / magnet / stay echo ──────────────────────────────
    // Vela's native toolbar and renderer shortcuts also change tool/snap/stay;
    // mirror those into the store so the MAWS top toolbar stays in sync. The
    // store → Vela effects above are idempotent, so the echo cannot loop.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingOverlay.useEffect": ()=>{
            let cancelled = false;
            let tries = 0;
            let timer = 0;
            let offs = [];
            const attach = {
                "DrawingOverlay.useEffect.attach": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(attach, 250);
                        return;
                    }
                    const { vela } = handle;
                    const st = {
                        "DrawingOverlay.useEffect.attach.st": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState()
                    }["DrawingOverlay.useEffect.attach.st"];
                    offs = [
                        vela.on("drawing:tool", {
                            "DrawingOverlay.useEffect.attach": ({ type })=>{
                                const mapped = type == null ? "cursor" : REVERSE_TOOL[type];
                                if (mapped && st().drawingTool !== mapped) st().setDrawingTool(mapped);
                                else if (type != null && !mapped && st().drawingTool !== "cursor") {
                                    st().setDrawingTool("cursor");
                                }
                            }
                        }["DrawingOverlay.useEffect.attach"]),
                        vela.on("drawing:snap", {
                            "DrawingOverlay.useEffect.attach": ({ mode })=>{
                                const on = mode !== "off";
                                if (st().magnet !== on) st().setMagnet(on);
                            }
                        }["DrawingOverlay.useEffect.attach"]),
                        vela.on("drawing:stay", {
                            "DrawingOverlay.useEffect.attach": ({ on })=>{
                                if (st().stayInDrawingMode !== on) st().setStayInDrawingMode(on);
                            }
                        }["DrawingOverlay.useEffect.attach"])
                    ];
                }
            }["DrawingOverlay.useEffect.attach"];
            attach();
            return ({
                "DrawingOverlay.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                    for (const off of offs)off();
                }
            })["DrawingOverlay.useEffect"];
        }
    }["DrawingOverlay.useEffect"], [
        pane.id
    ]);
    // ── Vela → store ─────────────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingOverlay.useEffect": ()=>{
            let cancelled = false;
            let tries = 0;
            let timer = 0;
            let offs = [];
            const attach = {
                "DrawingOverlay.useEffect.attach": ()=>{
                    if (cancelled) return;
                    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(pane.id);
                    if (!handle) {
                        if (tries++ < 120) timer = window.setTimeout(attach, 250);
                        return;
                    }
                    const { vela } = handle;
                    const ids = idsRef.current;
                    const docById = {
                        "DrawingOverlay.useEffect.attach.docById": (id)=>vela.drawings.all().find({
                                "DrawingOverlay.useEffect.attach.docById": (d)=>d.id === id
                            }["DrawingOverlay.useEffect.attach.docById"])
                    }["DrawingOverlay.useEffect.attach.docById"];
                    const onCreated = {
                        "DrawingOverlay.useEffect.attach.onCreated": ({ id })=>{
                            if (syncingRef.current.has(id)) return;
                            // A drawing placed with Vela's own toolbar → mirror into the MAWS slice.
                            const doc = docById(id);
                            if (!doc) return;
                            const tool = REVERSE_TOOL[doc.type];
                            if (!tool) return;
                            ids.set(id, id);
                            addDrawing(pane.id, {
                                id,
                                tool: tool,
                                points: doc.anchors.map({
                                    "DrawingOverlay.useEffect.attach.onCreated": (a)=>({
                                            time: Math.round(a.time / 1000),
                                            price: a.price
                                        })
                                }["DrawingOverlay.useEffect.attach.onCreated"]),
                                color: doc.style.lineColor,
                                lineWidth: doc.style.lineWidth ?? 1,
                                lineStyle: mawsLineStyle(doc.style.lineStyle),
                                hidden: replayingRef.current
                            });
                            if (replayingRef.current || hiddenRef.current) {
                                try {
                                    vela.drawings.show(id, false);
                                } catch  {
                                /* ignore */ }
                            }
                        }
                    }["DrawingOverlay.useEffect.attach.onCreated"];
                    const onEdited = {
                        "DrawingOverlay.useEffect.attach.onEdited": ({ id })=>{
                            if (syncingRef.current.has(id)) return;
                            const doc = docById(id);
                            if (!doc) return;
                            const drawingId = findStoreId(ids, id);
                            if (!drawingId) return;
                            updateDrawing(pane.id, drawingId, {
                                points: doc.anchors.map({
                                    "DrawingOverlay.useEffect.attach.onEdited": (a)=>({
                                            time: Math.round(a.time / 1000),
                                            price: a.price
                                        })
                                }["DrawingOverlay.useEffect.attach.onEdited"]),
                                color: doc.style.lineColor,
                                lineWidth: doc.style.lineWidth ?? 1,
                                lineStyle: mawsLineStyle(doc.style.lineStyle)
                            });
                        }
                    }["DrawingOverlay.useEffect.attach.onEdited"];
                    const onRemoved = {
                        "DrawingOverlay.useEffect.attach.onRemoved": ({ id })=>{
                            const drawingId = findStoreId(ids, id);
                            if (!drawingId) return;
                            ids.delete(drawingId);
                            if (syncingRef.current.has(id)) return;
                            removeDrawing(pane.id, drawingId);
                        }
                    }["DrawingOverlay.useEffect.attach.onRemoved"];
                    offs = [
                        vela.on("drawing:created", onCreated),
                        vela.on("drawing:edited", onEdited),
                        vela.on("drawing:removed", onRemoved)
                    ];
                }
            }["DrawingOverlay.useEffect.attach"];
            attach();
            return ({
                "DrawingOverlay.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                    for (const off of offs)off();
                }
            })["DrawingOverlay.useEffect"];
        }
    }["DrawingOverlay.useEffect"], [
        pane.id,
        addDrawing,
        updateDrawing,
        removeDrawing
    ]);
    // Vela owns rendering — no DOM output.
    return null;
}
_s(DrawingOverlay, "DTpZjtwtQodED39f1N9qEQLYNGo=", false, function() {
    return [
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
_c = DrawingOverlay;
/** Reverse lookup: Vela drawing id → MAWS drawing id. */ function findStoreId(ids, velaId) {
    for (const [storeId, id] of ids){
        if (id === velaId) return storeId;
    }
    return null;
}
var _c;
__turbopack_context__.k.register(_c, "DrawingOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/drawings/VelaDrawingBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VelaDrawingBar",
    ()=>VelaDrawingBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * VelaDrawingBar.tsx — Vela's native drawing toolbar, docked HORIZONTALLY in the
 * MAWS top bar.
 *
 * One bar drives the ACTIVE pane's chart (the same seam VelaWorkspace uses for
 * its shared left rail): every arm/magnet/measure/eraser press routes through
 * `chart.drawings.*` of the active pane, and Vela's `drawing:*` events echo
 * back through the store (DrawingOverlay), so MAWS's own toolbar buttons, the
 * in-chart flyouts and this bar all share one state.
 *
 * Host-only toolbar features live next to it in the SAME flex row (MAWS top-bar
 * chrome): hide-drawings, hide-indicators and clear (the store actions they
 * call already drive Vela's per-pane layers).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/app-theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.mjs [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/charting/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$drawings$2f$DrawingToolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/renderers/native/drawings/DrawingToolbar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$toolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/charting/core/drawings/toolbar.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
/** Flip Vela's vertical (left-dock) toolbar CSS into a horizontal top-bar bar.
 *  Everything Vela's own stylesheet sizes per-cell stays intact; only the row
 *  direction, surface chrome and the flyout anchoring change. NO scrolling:
 *  every group cell and mode button must fit the row at once. */ function orientHorizontal(root, host) {
    root.style.flexDirection = "row";
    root.style.width = "auto";
    root.style.height = "30px";
    root.style.padding = "0 1px";
    root.style.overflowX = "visible";
    root.style.overflowY = "visible";
    root.style.background = "transparent";
    root.style.borderRight = "none";
    root.style.borderTop = "none";
    root.style.gap = "2px";
    root.style.flexWrap = "nowrap";
    // The in-chart bar is a 44px column with vertically-stacked cells (30px tall,
    // full-width, divider rows between). Horizontal: cells shrink to their icon,
    // dividers go vertical, the collapse toggle hides (the top bar can't collapse
    // into a column) and flyouts drop BELOW the row instead of opening to the side.
    const cssId = "maws-vela-dtb-topbar-css";
    if (!document.getElementById(cssId)) {
        const st = document.createElement("style");
        st.id = cssId;
        st.textContent = `
.vela-dtb-host{position:relative;flex:none;}
.vela-dtb-host .vela-dtb{overflow:visible !important;}
.vela-dtb-host .vela-dtb-btn,.vela-dtb-host .vela-dtb-cell{width:auto !important;height:28px !important;padding:0 1px !important;}
.vela-dtb-host .vela-dtb-icon{width:26px !important;}
.vela-dtb-host .vela-dtb-arrow{right:-2px !important;}
/* Vertical dividers between groups (the column bar's 24px horizontal hairlines). */
.vela-dtb-host .vela-dtb>div[style*="height:1px"],.vela-dtb-host .vela-dtb>div[style*="height: 1px"]{width:1px !important;height:16px !important;margin:6px 3px !important;}
/* Collapse toggle is meaningless in the top bar row — hide it. */
.vela-dtb-host .vela-dtb-collapse{display:none !important;}
/* Flyouts: hosted inside the bar root; drop below the row, right-aligned to the cell. */
.vela-dtb-host{overflow:visible;}
.vela-dtb-host .vela-dtb-flyout{top:100% !important;bottom:auto !important;left:auto !important;right:-1px !important;border-radius:8px !important;border-left:1px solid var(--vela-border) !important;border-right:1px solid var(--vela-border) !important;border-top:1px solid var(--vela-border) !important;max-height:min(60vh,420px) !important;}
`;
        document.head.appendChild(st);
    }
    void host;
}
function VelaDrawingBar() {
    _s();
    const activePaneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "VelaDrawingBar.useAppStore[activePaneId]": (s)=>s.activePaneId
    }["VelaDrawingBar.useAppStore[activePaneId]"]);
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const barRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Re-aim toolbar actions at the newly active pane (no rebuild needed — the
    // callbacks look up the chart at press time through the registry).
    const getActive = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(activePaneId)?.vela ?? null;
    // State echo: keep the bar's tints in step with the chart. Vela's renderer
    // shortcuts (Escape, one-shot disarms) and the old per-chart rail changed tool
    // / snap / stay / mode WITHOUT a top-bar click — the bar only repaints through
    // its setters, so mirror the active pane's `drawing:*` events into it.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VelaDrawingBar.useEffect": ()=>{
            const host = hostRef.current;
            if (!host) return;
            let cancelled = false;
            let tries = 0;
            let timer = 0;
            let offs = [];
            const attach = {
                "VelaDrawingBar.useEffect.attach": ()=>{
                    if (cancelled) return;
                    const bar = barRef.current;
                    const chart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(activePaneId)?.vela;
                    if (!bar || !chart) {
                        if (tries++ < 120) timer = window.setTimeout(attach, 250);
                        return;
                    }
                    offs = [
                        chart.on("drawing:tool", {
                            "VelaDrawingBar.useEffect.attach": ({ type })=>bar.setActiveTool(type)
                        }["VelaDrawingBar.useEffect.attach"]),
                        chart.on("drawing:snap", {
                            "VelaDrawingBar.useEffect.attach": ({ mode })=>bar.setMagnetMode(mode)
                        }["VelaDrawingBar.useEffect.attach"]),
                        chart.on("drawing:stay", {
                            "VelaDrawingBar.useEffect.attach": ({ on })=>bar.setStayMode(on)
                        }["VelaDrawingBar.useEffect.attach"]),
                        chart.on("drawing:mode", {
                            "VelaDrawingBar.useEffect.attach": ({ mode })=>{
                                bar.setMeasureActive(mode === "measure");
                                bar.setEraserActive(mode === "eraser");
                            }
                        }["VelaDrawingBar.useEffect.attach"])
                    ];
                    // Seed from the chart's CURRENT state (the events above only fire on change).
                    try {
                        const d = chart.drawings;
                        bar.setActiveTool(d.getTool());
                        bar.setMagnetMode(d.getSnapMode());
                        bar.setStayMode(d.getStayMode());
                        const mode = d.getMode();
                        bar.setMeasureActive(mode === "measure");
                        bar.setEraserActive(mode === "eraser");
                    } catch  {
                    /* chart not fully ready yet */ }
                }
            }["VelaDrawingBar.useEffect.attach"];
            attach();
            return ({
                "VelaDrawingBar.useEffect": ()=>{
                    cancelled = true;
                    if (timer) window.clearTimeout(timer);
                    for (const off of offs)off();
                }
            })["VelaDrawingBar.useEffect"];
        }
    }["VelaDrawingBar.useEffect"], [
        activePaneId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VelaDrawingBar.useEffect": ()=>{
            const host = hostRef.current;
            if (!host) return;
            // Follow the app theme (Vela's dialog theme row drives the whole app — the
            // shell chrome colors are the source of truth, so re-resolve from them).
            const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTheme"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["velaThemeNameFromAppSettings"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().appSettings));
            // Horizontal top bar — `dock: 'static'` keeps it a normal flex child, sizing
            // to content; plain DOM, no chart remount, no settings.
            const bar = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$renderers$2f$native$2f$drawings$2f$DrawingToolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrawingToolbar"](host, theme, {
                "VelaDrawingBar.useEffect": (type)=>{
                    getActive()?.drawings.setTool(type);
                }
            }["VelaDrawingBar.useEffect"], {
                "VelaDrawingBar.useEffect": (mode)=>{
                    getActive()?.drawings.setSnapMode(mode);
                }
            }["VelaDrawingBar.useEffect"], {
                "VelaDrawingBar.useEffect": ()=>{
                    const d = getActive()?.drawings;
                    if (d) d.setMode(d.getMode() === "measure" ? null : "measure");
                }
            }["VelaDrawingBar.useEffect"], {
                "VelaDrawingBar.useEffect": ()=>{
                    const d = getActive()?.drawings;
                    if (d) d.setMode(d.getMode() === "eraser" ? null : "eraser");
                }
            }["VelaDrawingBar.useEffect"], {
                "VelaDrawingBar.useEffect": (type, on)=>{
                    getActive()?.drawings.setFavorite(type, on);
                }
            }["VelaDrawingBar.useEffect"], {
                "VelaDrawingBar.useEffect": (on)=>{
                    getActive()?.drawings.setStayMode(on);
                }
            }["VelaDrawingBar.useEffect"], {
                dock: "static"
            });
            bar.setVisible(true);
            barRef.current = bar;
            // The definition arrives before the constructor's rebuild runs, but the bar
            // is created BEFORE any `setDefinition` — push the default groups now.
            bar.setDefinition?.((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$charting$2f$core$2f$drawings$2f$toolbar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultToolbar"])());
            const root = bar.root;
            if (root) orientHorizontal(root, host);
            return ({
                "VelaDrawingBar.useEffect": ()=>{
                    barRef.current = null;
                    try {
                        bar.destroy();
                    } catch  {
                    /* already torn down */ }
                    if (host) host.replaceChildren();
                }
            })["VelaDrawingBar.useEffect"];
        }
    }["VelaDrawingBar.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative z-[2] flex shrink-0 items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: hostRef,
                className: "vela-dtb-host flex",
                "data-vela-drawing-bar": true
            }, void 0, false, {
                fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "top-sep"
            }, void 0, false, {
                fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KeepPair, {}, void 0, false, {
                fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_s(VelaDrawingBar, "vOrywqYJ0eLbB3OCLoyJqBn7Eqg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = VelaDrawingBar;
function KeepPair() {
    _s1();
    const drawingsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeepPair.useAppStore[drawingsHidden]": (s)=>s.drawingsHidden
    }["KeepPair.useAppStore[drawingsHidden]"]);
    const setDrawingsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeepPair.useAppStore[setDrawingsHidden]": (s)=>s.setDrawingsHidden
    }["KeepPair.useAppStore[setDrawingsHidden]"]);
    const indicatorsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeepPair.useAppStore[indicatorsHidden]": (s)=>s.indicatorsHidden
    }["KeepPair.useAppStore[indicatorsHidden]"]);
    const setIndicatorsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeepPair.useAppStore[setIndicatorsHidden]": (s)=>s.setIndicatorsHidden
    }["KeepPair.useAppStore[setIndicatorsHidden]"]);
    const activePaneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeepPair.useAppStore[activePaneId]": (s)=>s.activePaneId
    }["KeepPair.useAppStore[activePaneId]"]);
    const clearDrawings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeepPair.useAppStore[clearDrawings]": (s)=>s.clearDrawings
    }["KeepPair.useAppStore[clearDrawings]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                title: drawingsHidden ? "Show drawings" : "Hide drawings",
                "aria-pressed": drawingsHidden,
                className: `flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[4px] transition-colors ${drawingsHidden ? "bg-(--app-hover) text-(--app-text)" : "text-(--app-muted) hover:text-(--app-text)"}`,
                onClick: ()=>setDrawingsHidden(!drawingsHidden),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                title: indicatorsHidden ? "Show indicators" : "Hide indicators",
                "aria-pressed": indicatorsHidden,
                className: `flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[4px] transition-colors ${indicatorsHidden ? "bg-(--app-hover) text-(--app-text)" : "text-(--app-muted) hover:text-(--app-text)"}`,
                onClick: ()=>setIndicatorsHidden(!indicatorsHidden),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                title: "Clear pane drawings",
                "aria-label": "Clear pane drawings",
                className: "flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[4px] text-[10px] font-semibold text-(--app-muted) hover:text-(--app-text)",
                onClick: ()=>clearDrawings(activePaneId),
                children: "CLR"
            }, void 0, false, {
                fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/drawings/VelaDrawingBar.tsx",
        lineNumber: 200,
        columnNumber: 5
    }, this);
}
_s1(KeepPair, "5PC6VqxKQ7BTLoTknW5UQIKlTIU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = KeepPair;
var _c, _c1;
__turbopack_context__.k.register(_c, "VelaDrawingBar");
__turbopack_context__.k.register(_c1, "KeepPair");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maws/StrategyScreener.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StrategyScreener",
    ()=>StrategyScreener
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$AssetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/brand/AssetLogo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$maws$2f$StrategySymbolPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/maws/StrategySymbolPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$strategy$2d$screener$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/strategy-screener.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const STATUS_DOT = {
    pass: "#089981",
    wait: "#787b86",
    block: "#f23645",
    info: "#4c525e"
};
/** Expand-control color from key-stoch alignment + ADX cap. */ function signalDotColor(row) {
    const fast = row.conditions.find((c)=>c.id === "stochFast")?.value;
    const mid = row.conditions.find((c)=>c.id === "stochMid")?.value;
    const slow = row.conditions.find((c)=>c.id === "stochSlow")?.value;
    const adx = row.conditions.find((c)=>c.id === "adx")?.value;
    const nums = [
        fast,
        mid,
        slow
    ];
    const allNum = nums.every((v)=>typeof v === "number");
    const adxOk = typeof adx === "number" && adx <= 40;
    if (allNum && adxOk) {
        if (nums.every((d)=>d <= 20)) return "#089981"; // long — all stochs oversold
        if (nums.every((d)=>d >= 80)) return "#f23645"; // short — all stochs overbought
    }
    // Wait: both key stochs aligned on the same side
    if (typeof fast === "number" && typeof mid === "number") {
        if (fast <= 20 && mid <= 20 || fast >= 80 && mid >= 80) return "#f0b90b";
    }
    return "#787b86";
}
function signalDotTitle(row) {
    const fast = row.conditions.find((c)=>c.id === "stochFast")?.value;
    const mid = row.conditions.find((c)=>c.id === "stochMid")?.value;
    const slow = row.conditions.find((c)=>c.id === "stochSlow")?.value;
    const adx = row.conditions.find((c)=>c.id === "adx")?.value;
    const nums = [
        fast,
        mid,
        slow
    ];
    const allNum = nums.every((v)=>typeof v === "number");
    const adxOk = typeof adx === "number" && adx <= 40;
    if (allNum && adxOk) {
        if (nums.every((d)=>d <= 20)) return "Long — all stochs aligned, ADX ≤ 40";
        if (nums.every((d)=>d >= 80)) return "Short — all stochs aligned, ADX ≤ 40";
    }
    if (typeof fast === "number" && typeof mid === "number") {
        if (fast <= 20 && mid <= 20 || fast >= 80 && mid >= 80) {
            return "Stoch 14.3 + 40.4 aligned — waiting";
        }
    }
    return "Waiting for Stoch 14.3 + 40.4";
}
const COND_LABEL = {
    htfBias: "HTF bias",
    vwap: "VWAP",
    stochFast: "Stoch 14.3",
    stochMid: "Stoch 40.4",
    stochSlow: "Stoch 60.10",
    adx: "ADX 14"
};
const COND_ORDER = [
    "htfBias",
    "stochFast",
    "vwap",
    "stochMid",
    "adx",
    "stochSlow"
];
/** TradingView-style per-digit flash: highlight from first changed character to end. */ function DigitFlashPrice({ symbol, value }) {
    _s();
    const formatted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(symbol, value);
    const prevFormatted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const flashRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevStr = prevFormatted.current;
    const prevNum = prevValue.current;
    if (prevStr != null && prevNum != null && formatted !== prevStr && value !== prevNum) {
        let from = 0;
        const len = Math.min(formatted.length, prevStr.length);
        while(from < len && formatted[from] === prevStr[from])from += 1;
        flashRef.current = from < formatted.length ? {
            text: formatted,
            from,
            color: value > prevNum ? "#089981" : "#f23645"
        } : null;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DigitFlashPrice.useEffect": ()=>{
            prevFormatted.current = formatted;
            prevValue.current = value;
        }
    }["DigitFlashPrice.useEffect"], [
        formatted,
        value
    ]);
    const flash = flashRef.current?.text === formatted ? flashRef.current : null;
    if (!flash) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-[11px] font-semibold tabular-nums text-(--app-text)",
            children: formatted
        }, void 0, false, {
            fileName: "[project]/components/maws/StrategyScreener.tsx",
            lineNumber: 120,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-[11px] font-semibold tabular-nums",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-(--app-text)",
                children: formatted.slice(0, flash.from)
            }, void 0, false, {
                fileName: "[project]/components/maws/StrategyScreener.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: flash.color
                },
                children: formatted.slice(flash.from)
            }, void 0, false, {
                fileName: "[project]/components/maws/StrategyScreener.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maws/StrategyScreener.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s(DigitFlashPrice, "X9OOS6P5lz/H9TtokcanGXEW2RM=");
_c = DigitFlashPrice;
function useStrategyRows(symbols) {
    _s1();
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    // Order-independent — reordering must not tear down work / clear cards.
    const symbolsKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useStrategyRows.useMemo[symbolsKey]": ()=>[
                ...symbols
            ].sort().join("\u0000")
    }["useStrategyRows.useMemo[symbolsKey]"], [
        symbols
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStrategyRows.useEffect": ()=>{
            let cancelled = false;
            const m1 = new Map();
            const mh = new Map();
            const unsubs = [];
            const wanted = new Set(symbols);
            let analyzeTimer = null;
            let confirmedTimer = null;
            setRows({
                "useStrategyRows.useEffect": (prev)=>{
                    const next = new Map();
                    for (const s of symbols){
                        const row = prev.get(s);
                        if (row) next.set(s, row);
                    }
                    return next;
                }
            }["useStrategyRows.useEffect"]);
            const snap = {
                "useStrategyRows.useEffect.snap": ()=>{
                    for (const symbol of symbols){
                        try {
                            m1.set(symbol, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getCandles(symbol, "1m"));
                        } catch  {
                        /* ignore */ }
                        try {
                            mh.set(symbol, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getCandles(symbol, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$strategy$2d$screener$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HTF_TIMEFRAME"]));
                        } catch  {
                        /* ignore */ }
                    }
                }
            }["useStrategyRows.useEffect.snap"];
            const analyze = {
                "useStrategyRows.useEffect.analyze": (confirmed)=>{
                    if (cancelled) return;
                    snap();
                    setRows({
                        "useStrategyRows.useEffect.analyze": (prev)=>{
                            const next = new Map();
                            let changed = false;
                            for (const symbol of symbols){
                                if (!wanted.has(symbol)) continue;
                                const row = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$strategy$2d$screener$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyzeSymbol"])(symbol, m1.get(symbol) ?? [], mh.get(symbol) ?? [], Date.now(), {
                                    confirmed
                                });
                                if (!row) {
                                    if (prev.has(symbol)) changed = true;
                                    continue;
                                }
                                if (!confirmed) {
                                    const prevRow = prev.get(symbol);
                                    if (prevRow) {
                                        row.confirmedState = prevRow.confirmedState;
                                        row.confirmedMet = prevRow.confirmedMet;
                                    }
                                }
                                const prevRow = prev.get(symbol);
                                if (!prevRow || prevRow.state !== row.state || prevRow.met !== row.met || prevRow.direction !== row.direction || prevRow.confirmedState !== row.confirmedState || prevRow.bullishMet !== row.bullishMet || prevRow.bearishMet !== row.bearishMet || prevRow.price !== row.price || prevRow.conditions.length !== row.conditions.length || prevRow.conditions.some({
                                    "useStrategyRows.useEffect.analyze": (c, i)=>c.status !== row.conditions[i]?.status || c.value !== row.conditions[i]?.value || c.detail !== row.conditions[i]?.detail
                                }["useStrategyRows.useEffect.analyze"])) {
                                    changed = true;
                                }
                                next.set(symbol, row);
                            }
                            if (!changed && next.size === prev.size) {
                                for (const s of prev.keys()){
                                    if (!next.has(s)) {
                                        changed = true;
                                        break;
                                    }
                                }
                            }
                            return changed ? next : prev;
                        }
                    }["useStrategyRows.useEffect.analyze"]);
                }
            }["useStrategyRows.useEffect.analyze"];
            snap();
            // Live 1m tip only — keeps forming bar fresh without React work per tick.
            // HTF bias is slow: REST snapshot via getCandles, no second live socket per symbol.
            for (const symbol of symbols){
                unsubs.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].subscribe(symbol, "1m", {
                    "useStrategyRows.useEffect": (c)=>{
                        m1.set(symbol, c);
                    }
                }["useStrategyRows.useEffect"]));
            }
            analyze(true);
            // Strategy cards: ~2s is enough; prices still tick via quote subscription.
            analyzeTimer = window.setInterval({
                "useStrategyRows.useEffect": ()=>analyze(false)
            }["useStrategyRows.useEffect"], 2000);
            confirmedTimer = window.setInterval({
                "useStrategyRows.useEffect": ()=>analyze(true)
            }["useStrategyRows.useEffect"], 15_000);
            return ({
                "useStrategyRows.useEffect": ()=>{
                    cancelled = true;
                    for (const u of unsubs)u();
                    if (analyzeTimer != null) window.clearInterval(analyzeTimer);
                    if (confirmedTimer != null) window.clearInterval(confirmedTimer);
                }
            })["useStrategyRows.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useStrategyRows.useEffect"], [
        symbolsKey
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useStrategyRows.useMemo": ()=>[
                ...rows.values()
            ]
    }["useStrategyRows.useMemo"], [
        rows
    ]);
}
_s1(useStrategyRows, "3k0+cH6ETUMYOR1Vcf3aitKfjaM=");
function bareSymbol(symbol) {
    return symbol.replace(/\.P$/i, "").toUpperCase();
}
/** One quote subscription for the whole screener (avoids N× useQuote listeners). */ function useScreenerQuotes() {
    _s2();
    const [map, setMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useScreenerQuotes.useState": ()=>new Map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].getQuotes().map({
                "useScreenerQuotes.useState": (q)=>[
                        q.symbol,
                        q
                    ]
            }["useScreenerQuotes.useState"]))
    }["useScreenerQuotes.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScreenerQuotes.useEffect": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].subscribeQuotes({
                "useScreenerQuotes.useEffect": (next)=>{
                    setMap({
                        "useScreenerQuotes.useEffect": (prev)=>{
                            let changed = prev.size !== next.size;
                            const out = new Map();
                            for (const [sym, q] of next){
                                const old = prev.get(sym);
                                if (old && old.last === q.last && old.changePct === q.changePct && old.volume === q.volume) {
                                    out.set(sym, old);
                                } else {
                                    out.set(sym, q);
                                    changed = true;
                                }
                            }
                            if (!changed) {
                                for (const sym of prev.keys()){
                                    if (!next.has(sym)) {
                                        changed = true;
                                        break;
                                    }
                                }
                            }
                            return changed ? out : prev;
                        }
                    }["useScreenerQuotes.useEffect"]);
                }
            }["useScreenerQuotes.useEffect"]);
        }
    }["useScreenerQuotes.useEffect"], []);
    return map;
}
_s2(useScreenerQuotes, "ebcVyNgmKtW7gcIuxoGoYNCFBfU=");
const StrategyCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s3(function StrategyCard({ row, selected, expanded, onOpen, onToggleExpand, last, changePct, dragging, onPointerDragStart }) {
    _s3();
    const price = last ?? row.price;
    const suppressClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dotColor = signalDotColor(row);
    // Strict sign coloring — never flash from tick direction.
    const chgColor = changePct == null || changePct === 0 ? "#d1d4dc" : changePct > 0 ? "#089981" : "#f23645";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-screener-card": row.symbol,
        className: `group relative select-none border-b border-(--app-border) transition-colors ${dragging ? "z-10 bg-[var(--maws-elevated)] ring-1 ring-inset ring-[#2962ff]" : selected ? "bg-[var(--maws-elevated)] ring-1 ring-inset ring-[var(--app-text)]/35" : "bg-[var(--maws-panel)] hover:bg-[var(--maws-elevated)]"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "button",
                tabIndex: 0,
                onPointerDown: (e)=>{
                    if (e.button !== 0) return;
                    const t = e.target;
                    if (t.closest("[data-expand-dot]")) return;
                    startRef.current = {
                        x: e.clientX,
                        y: e.clientY,
                        pointerId: e.pointerId
                    };
                },
                onPointerMove: (e)=>{
                    const start = startRef.current;
                    if (!start || start.pointerId !== e.pointerId) return;
                    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < 8) return;
                    startRef.current = null;
                    suppressClick.current = true;
                    onPointerDragStart(row.symbol, e.clientY, e.pointerId);
                },
                onPointerUp: ()=>{
                    startRef.current = null;
                },
                onPointerCancel: ()=>{
                    startRef.current = null;
                },
                onClick: ()=>{
                    if (suppressClick.current) {
                        suppressClick.current = false;
                        return;
                    }
                    onOpen(row.symbol);
                },
                onKeyDown: (e)=>{
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onOpen(row.symbol);
                    }
                },
                className: `flex w-full select-none items-center gap-2 px-3 py-2.5 text-left ${dragging ? "cursor-grabbing" : "cursor-default"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        "data-expand-dot": true,
                        title: signalDotTitle(row),
                        "aria-label": signalDotTitle(row),
                        "aria-expanded": expanded,
                        onClick: (e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleExpand(row.symbol);
                        },
                        onPointerDown: (e)=>e.stopPropagation(),
                        className: "flex h-5 w-5 shrink-0 cursor-default items-center justify-center rounded-full hover:bg-white/5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "block h-2 w-2 rounded-full transition-colors duration-200",
                            style: {
                                background: dotColor
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/maws/StrategyScreener.tsx",
                            lineNumber: 397,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategyScreener.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$AssetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssetLogo"], {
                        symbol: row.symbol,
                        size: 18,
                        className: "shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategyScreener.tsx",
                        lineNumber: 402,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate text-[11px] leading-[18px] font-semibold text-[var(--app-text)]",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(row.symbol)
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategyScreener.tsx",
                        lineNumber: 403,
                        columnNumber: 1
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex shrink-0 items-center gap-0.5 leading-[18px]",
                        children: [
                            price == null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-semibold tabular-nums text-[var(--app-muted)]",
                                children: "—"
                            }, void 0, false, {
                                fileName: "[project]/components/maws/StrategyScreener.tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DigitFlashPrice, {
                                symbol: row.symbol,
                                value: price
                            }, void 0, false, {
                                fileName: "[project]/components/maws/StrategyScreener.tsx",
                                lineNumber: 410,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1.5 text-right text-[11px] font-semibold tabular-nums",
                                style: {
                                    color: chgColor
                                },
                                children: changePct == null ? "—" : `${changePct > 0 ? "+" : ""}${changePct.toFixed(2)}%`
                            }, void 0, false, {
                                fileName: "[project]/components/maws/StrategyScreener.tsx",
                                lineNumber: 412,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/maws/StrategyScreener.tsx",
                        lineNumber: 406,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maws/StrategyScreener.tsx",
                lineNumber: 343,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-x-3 gap-y-1 px-3 pt-0.5 pb-2.5 pl-10",
                        children: COND_ORDER.map((id)=>{
                            const c = row.conditions.find((x)=>x.id === id);
                            if (!c) return null;
                            const isStoch = id === "stochFast" || id === "stochMid" || id === "stochSlow";
                            const color = c.id === "htfBias" ? c.value === 1 ? "#089981" : c.value === -1 ? "#f23645" : "#787b86" : c.id === "vwap" ? "#089981" : isStoch && typeof c.value === "number" ? c.value <= 20 ? "#089981" : c.value >= 80 ? "#f23645" : "#787b86" : STATUS_DOT[c.status];
                            const primary = id === "adx" ? c.value == null ? "ADX —" : `ADX ${Number(c.value).toFixed(1)}` : isStoch ? c.value == null ? `${COND_LABEL[id]} —` : `${COND_LABEL[id]} - ${Number(c.value).toFixed(1)}` : c.detail;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 py-0.5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-w-0 items-center gap-1 truncate text-[11px] text-[var(--app-text)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
                                            style: {
                                                background: color
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/maws/StrategyScreener.tsx",
                                            lineNumber: 463,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: primary
                                        }, void 0, false, {
                                            fileName: "[project]/components/maws/StrategyScreener.tsx",
                                            lineNumber: 467,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/maws/StrategyScreener.tsx",
                                    lineNumber: 462,
                                    columnNumber: 19
                                }, this)
                            }, c.id, false, {
                                fileName: "[project]/components/maws/StrategyScreener.tsx",
                                lineNumber: 461,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategyScreener.tsx",
                        lineNumber: 429,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/maws/StrategyScreener.tsx",
                    lineNumber: 428,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/maws/StrategyScreener.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maws/StrategyScreener.tsx",
        lineNumber: 333,
        columnNumber: 5
    }, this);
}, "u6X34oFNKd5exiqP3ma8ENqDLlA="));
_c1 = StrategyCard;
function StrategyScreener() {
    _s4();
    const watchlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategyScreener.useAppStore[watchlist]": (s)=>s.watchlist
    }["StrategyScreener.useAppStore[watchlist]"]);
    const setWatchlistOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategyScreener.useAppStore[setWatchlistOrder]": (s)=>s.setWatchlistOrder
    }["StrategyScreener.useAppStore[setWatchlistOrder]"]);
    const setSymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategyScreener.useAppStore[setSymbol]": (s)=>s.setSymbol
    }["StrategyScreener.useAppStore[setSymbol]"]);
    const active = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategyScreener.useAppStore[active]": (s)=>s.panes.find({
                "StrategyScreener.useAppStore[active]": (p)=>p.id === s.activePaneId
            }["StrategyScreener.useAppStore[active]"])?.symbol
    }["StrategyScreener.useAppStore[active]"]);
    const cardsHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategyScreener.useAppStore[cardsHeight]": (s)=>s.strategyCardsHeight
    }["StrategyScreener.useAppStore[cardsHeight]"]);
    const setCardsHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategyScreener.useAppStore[setCardsHeight]": (s)=>s.setStrategyCardsHeight
    }["StrategyScreener.useAppStore[setCardsHeight]"]);
    const boxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const listRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const quotes = useScreenerQuotes();
    const [dragSymbol, setDragSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewOrder, setPreviewOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "StrategyScreener.useState": ()=>new Set()
    }["StrategyScreener.useState"]);
    const dragSymbolRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const previewRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const toggleExpand = (symbol)=>{
        setExpanded((prev)=>{
            const next = new Set(prev);
            if (next.has(symbol)) next.delete(symbol);
            else next.add(symbol);
            return next;
        });
    };
    const symbols = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StrategyScreener.useMemo[symbols]": ()=>watchlist
    }["StrategyScreener.useMemo[symbols]"], [
        watchlist
    ]);
    const rows = useStrategyRows(symbols);
    const displayOrder = previewOrder ?? watchlist;
    // Follow watchlist / live preview order (not A–Z).
    const ordered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StrategyScreener.useMemo[ordered]": ()=>{
            const bySym = new Map(rows.map({
                "StrategyScreener.useMemo[ordered]": (r)=>[
                        r.symbol,
                        r
                    ]
            }["StrategyScreener.useMemo[ordered]"]));
            const out = [];
            const seen = new Set();
            for (const s of displayOrder){
                const r = bySym.get(s);
                if (!r || seen.has(s)) continue;
                out.push(r);
                seen.add(s);
            }
            for (const r of rows){
                if (seen.has(r.symbol)) continue;
                out.push(r);
                seen.add(r.symbol);
            }
            return out;
        }
    }["StrategyScreener.useMemo[ordered]"], [
        rows,
        displayOrder
    ]);
    const moveDragToClientY = (clientY)=>{
        const sym = dragSymbolRef.current;
        const list = previewRef.current;
        const root = listRef.current;
        if (!sym || !list || !root) return;
        const cards = [
            ...root.querySelectorAll("[data-screener-card]")
        ];
        if (cards.length === 0) return;
        let target = list.length - 1;
        for(let i = 0; i < cards.length; i++){
            const rect = cards[i].getBoundingClientRect();
            if (clientY < rect.top + rect.height / 2) {
                target = i;
                break;
            }
            target = i;
        }
        const from = list.indexOf(sym);
        if (from < 0 || from === target) return;
        const next = [
            ...list
        ];
        const [item] = next.splice(from, 1);
        next.splice(target, 0, item);
        previewRef.current = next;
        setPreviewOrder(next);
    };
    const endDrag = (commit)=>{
        const order = previewRef.current;
        if (commit && order) setWatchlistOrder(order);
        dragSymbolRef.current = null;
        previewRef.current = null;
        setDragSymbol(null);
        setPreviewOrder(null);
    };
    const onPointerDragStart = (symbol, clientY, pointerId)=>{
        const origin = ordered.map((r)=>r.symbol);
        dragSymbolRef.current = symbol;
        previewRef.current = origin;
        setDragSymbol(symbol);
        setPreviewOrder(origin);
        const onMove = (ev)=>{
            if (ev.pointerId !== pointerId) return;
            moveDragToClientY(ev.clientY);
        };
        const onUp = (ev)=>{
            if (ev.pointerId !== pointerId) return;
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
            endDrag(true);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
        moveDragToClientY(clientY);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: boxRef,
        className: "flex h-full min-h-0 flex-col bg-[var(--maws-panel)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative shrink-0 overflow-hidden",
                style: {
                    height: active ? cardsHeight : "100%",
                    maxHeight: active ? "calc(100% - 120px)" : "100%"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-full min-h-0 overflow-auto bg-[var(--maws-panel)] px-1",
                        children: ordered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-2 py-3 text-[11px] text-[var(--app-muted)] opacity-70",
                            children: "No symbols match. Waiting on candle history…"
                        }, void 0, false, {
                            fileName: "[project]/components/maws/StrategyScreener.tsx",
                            lineNumber: 599,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: listRef,
                            className: "flex flex-col",
                            children: ordered.map((row)=>{
                                const q = quotes.get(bareSymbol(row.symbol));
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StrategyCard, {
                                    row: row,
                                    selected: active === row.symbol,
                                    expanded: expanded.has(row.symbol),
                                    dragging: dragSymbol === row.symbol,
                                    onOpen: setSymbol,
                                    onToggleExpand: toggleExpand,
                                    onPointerDragStart: onPointerDragStart,
                                    last: q?.last ?? null,
                                    changePct: q?.changePct ?? null
                                }, row.symbol, false, {
                                    fileName: "[project]/components/maws/StrategyScreener.tsx",
                                    lineNumber: 607,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/maws/StrategyScreener.tsx",
                            lineNumber: 603,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategyScreener.tsx",
                        lineNumber: 597,
                        columnNumber: 9
                    }, this),
                    active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 left-0 z-20 h-1.5 w-full cursor-row-resize bg-transparent hover:bg-[#2962ff]",
                        title: "Drag to resize",
                        onMouseDown: (e)=>{
                            e.preventDefault();
                            const box = boxRef.current?.getBoundingClientRect();
                            const move = (ev)=>{
                                const top = box?.top ?? 0;
                                const max = (box?.height ?? 600) - 120;
                                setCardsHeight(Math.min(max, Math.max(96, ev.clientY - top)));
                            };
                            const up = ()=>{
                                window.removeEventListener("mousemove", move);
                                window.removeEventListener("mouseup", up);
                            };
                            window.addEventListener("mousemove", move);
                            window.addEventListener("mouseup", up);
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategyScreener.tsx",
                        lineNumber: 625,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/maws/StrategyScreener.tsx",
                lineNumber: 590,
                columnNumber: 7
            }, this),
            active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$maws$2f$StrategySymbolPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StrategySymbolPanel"], {
                symbol: active,
                row: ordered.find((r)=>r.symbol === active) ?? null
            }, void 0, false, {
                fileName: "[project]/components/maws/StrategyScreener.tsx",
                lineNumber: 647,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/maws/StrategyScreener.tsx",
        lineNumber: 589,
        columnNumber: 5
    }, this);
}
_s4(StrategyScreener, "PVIL2//4qTZUFnAN05GNLNxkSlo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        useScreenerQuotes,
        useStrategyRows
    ];
});
_c2 = StrategyScreener;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DigitFlashPrice");
__turbopack_context__.k.register(_c1, "StrategyCard");
__turbopack_context__.k.register(_c2, "StrategyScreener");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/maws/StrategySymbolPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StrategySymbolPanel",
    ()=>StrategySymbolPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$AssetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/brand/AssetLogo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$details$2f$TechnicalsGauge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/details/TechnicalsGauge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/news.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-quotes.ts [app-client] (ecmascript)");
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
function StrategySymbolPanel({ symbol, row }) {
    _s();
    const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuote"])(symbol);
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbol"])(symbol);
    const latestNews = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategySymbolPanel.useAppStore[latestNews]": (s)=>s.chartSettings.latestNews
    }["StrategySymbolPanel.useAppStore[latestNews]"]);
    const setRightDock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "StrategySymbolPanel.useAppStore[setRightDock]": (s)=>s.setRightDock
    }["StrategySymbolPanel.useAppStore[setRightDock]"]);
    const up = (quote?.changePct ?? 0) >= 0;
    const lean = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$details$2f$TechnicalsGauge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["leanFromScreener"])(row?.bullishMet ?? 0, row?.bearishMet ?? 0);
    const [headline, setHeadline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StrategySymbolPanel.useEffect": ()=>{
            if (!latestNews) {
                setHeadline(null);
                return;
            }
            let cancelled = false;
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchNews"])({
                symbol
            }).then({
                "StrategySymbolPanel.useEffect": (result)=>{
                    if (cancelled) return;
                    setHeadline(result.items[0] ?? null);
                }
            }["StrategySymbolPanel.useEffect"]);
            return ({
                "StrategySymbolPanel.useEffect": ()=>{
                    cancelled = true;
                }
            })["StrategySymbolPanel.useEffect"];
        }
    }["StrategySymbolPanel.useEffect"], [
        symbol,
        latestNews
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-0 flex-1 overflow-auto border-t border-(--app-border) bg-(--app-panel)",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 px-3 pt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$brand$2f$AssetLogo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssetLogo"], {
                        symbol: symbol,
                        size: 24
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate text-[15px] font-semibold text-(--app-text)",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(symbol)
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pt-0.5 text-[11px] leading-4 text-(--app-muted)",
                children: [
                    info.name,
                    " / TetherUS PERPETUAL CONTRACT",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2",
                        children: "BINANCE"
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2",
                        children: "Swap • Crypto"
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pt-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[28px] leading-none font-semibold tracking-tight text-(--app-text)",
                        children: [
                            quote ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(symbol, quote.last) : "—",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 text-[13px] font-normal text-(--app-muted)",
                                children: info.quote
                            }, void 0, false, {
                                fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `mt-1.5 text-[13px] ${up ? "text-[#089981]" : "text-[#f23645]"}`,
                        children: quote ? `${up ? "+" : ""}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(symbol, quote.change)}  ${up ? "+" : ""}${quote.changePct.toFixed(2)}%` : "—"
                    }, void 0, false, {
                        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 flex items-center gap-1.5 text-[12px] text-[#089981]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-1.5 w-1.5 rounded-full bg-[#089981]"
                            }, void 0, false, {
                                fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this),
                            "Market open"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            latestNews ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-[8px] bg-[#2a2148] px-3 py-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[11px] text-[#b39ddb]",
                            children: [
                                "News",
                                headline ? ` • ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNewsAge"])(headline.at)}` : ""
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1 text-[13px] leading-[18px] text-[#e8e0f8]",
                            children: headline?.headline ?? "No Finnhub headlines yet — open News for the full feed."
                        }, void 0, false, {
                            fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                            lineNumber: 86,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "mt-2 text-[12px] text-[#ce93d8]",
                            onClick: ()=>setRightDock("calendar"),
                            children: "More news ›"
                        }, void 0, false, {
                            fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                            lineNumber: 89,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$details$2f$TechnicalsGauge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TechnicalsGauge"], {
                lean: lean
            }, void 0, false, {
                fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/maws/StrategySymbolPanel.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(StrategySymbolPanel, "tVUJtnWClvLUVwbjU+u+eZagSUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuote"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = StrategySymbolPanel;
var _c;
__turbopack_context__.k.register(_c, "StrategySymbolPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/news/NewsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NewsPanel",
    ()=>NewsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/news.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.mjs [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const TABS = [
    {
        id: "asset",
        label: "Asset specific news"
    },
    {
        id: "all",
        label: "All news"
    }
];
function NewsRow({ item, now }) {
    const open = Boolean(item.url);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        disabled: !open,
        onClick: ()=>{
            if (!item.url) return;
            window.open(item.url, "_blank", "noopener,noreferrer");
        },
        className: `block w-full rounded-md border border-[var(--maws-border)] bg-[var(--maws-panel)] px-3 py-2.5 text-left transition-colors ${open ? "cursor-pointer hover:border-[#2a2a2a] hover:bg-[var(--maws-elevated)]" : "cursor-default opacity-80"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 text-[10px] uppercase tracking-wide text-(--app-muted)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex min-w-0 items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: [
                                    item.source,
                                    item.category ? ` · ${item.category}` : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/news/NewsPanel.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 10,
                                className: "shrink-0 text-[#5b9cf6]",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/components/news/NewsPanel.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/news/NewsPanel.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "shrink-0 normal-case tracking-normal",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNewsAge"])(item.at, now)
                    }, void 0, false, {
                        fileName: "[project]/components/news/NewsPanel.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/news/NewsPanel.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 text-[13px] leading-[18px] font-medium text-(--app-text)",
                children: item.headline
            }, void 0, false, {
                fileName: "[project]/components/news/NewsPanel.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            item.summary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 line-clamp-2 text-[11px] leading-[15px] text-(--app-muted)",
                children: item.summary
            }, void 0, false, {
                fileName: "[project]/components/news/NewsPanel.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/news/NewsPanel.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = NewsRow;
function NewsPanel() {
    _s();
    const pane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActivePane"])();
    const latestNews = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "NewsPanel.useAppStore[latestNews]": (s)=>s.chartSettings.latestNews
    }["NewsPanel.useAppStore[latestNews]"]);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("asset");
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reloadToken, setReloadToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "NewsPanel.useState": ()=>Date.now()
    }["NewsPanel.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewsPanel.useEffect": ()=>{
            const id = window.setInterval({
                "NewsPanel.useEffect.id": ()=>setNow(Date.now())
            }["NewsPanel.useEffect.id"], 60_000);
            return ({
                "NewsPanel.useEffect": ()=>window.clearInterval(id)
            })["NewsPanel.useEffect"];
        }
    }["NewsPanel.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewsPanel.useEffect": ()=>{
            if (!latestNews) return;
            const ac = new AbortController();
            setLoading(true);
            const req = tab === "asset" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchNews"])({
                symbol: pane.symbol
            }, ac.signal) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$news$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchNews"])({
                category: "all"
            }, ac.signal);
            void req.then({
                "NewsPanel.useEffect": (result)=>{
                    if (ac.signal.aborted) return;
                    setItems(result.items);
                    setError(result.error ?? null);
                    setLoading(false);
                }
            }["NewsPanel.useEffect"]);
            return ({
                "NewsPanel.useEffect": ()=>{
                    ac.abort();
                }
            })["NewsPanel.useEffect"];
        }
    }["NewsPanel.useEffect"], [
        tab,
        pane.symbol,
        latestNews,
        reloadToken
    ]);
    if (!latestNews) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center px-4 text-center text-[13px] text-(--app-muted)",
            children: "Latest news is hidden in Settings → Events"
        }, void 0, false, {
            fileName: "[project]/components/news/NewsPanel.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-8 shrink-0 items-center justify-between border-b border-[#222222] px-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[13px] font-semibold text-(--app-text)",
                            children: "News"
                        }, void 0, false, {
                            fileName: "[project]/components/news/NewsPanel.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate text-[10px] uppercase tracking-wide text-[#4c525e]",
                            children: [
                                "Finnhub",
                                tab === "asset" ? ` · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(pane.symbol)}` : ""
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/news/NewsPanel.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            title: "Reload news",
                            className: "flex h-5 items-center gap-1 rounded px-1 text-[10px] text-[#4c525e] hover:bg-(--app-hover) hover:text-(--app-text)",
                            onClick: ()=>setReloadToken((n)=>n + 1),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    size: 10
                                }, void 0, false, {
                                    fileName: "[project]/components/news/NewsPanel.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                "Reload"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/news/NewsPanel.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/news/NewsPanel.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/news/NewsPanel.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex shrink-0 gap-0.5 border-b border-[#222222] px-2 py-1.5",
                children: TABS.map((t)=>{
                    const active = tab === t.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setTab(t.id),
                        className: `h-6 rounded px-2 text-[11px] ${active ? "bg-[var(--maws-elevated)] text-(--app-text)" : "text-(--app-muted) hover:bg-[var(--maws-elevated)] hover:text-(--app-text)"}`,
                        children: t.label
                    }, t.id, false, {
                        fileName: "[project]/components/news/NewsPanel.tsx",
                        lineNumber: 123,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/news/NewsPanel.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 border-b border-[#222222] px-2 py-1.5 text-[10px] text-(--app-muted)",
                children: [
                    error,
                    error.includes("FINNHUB_API_KEY") ? " — add it to .env.local and restart the dev server." : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/news/NewsPanel.tsx",
                lineNumber: 140,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-2",
                children: [
                    loading && items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-2 py-8 text-center text-[12px] text-(--app-muted)",
                        children: "Loading headlines…"
                    }, void 0, false, {
                        fileName: "[project]/components/news/NewsPanel.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this) : null,
                    !loading && items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-2 py-8 text-center text-[12px] text-(--app-muted)",
                        children: "No headlines for this feed right now"
                    }, void 0, false, {
                        fileName: "[project]/components/news/NewsPanel.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1.5",
                        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NewsRow, {
                                item: item,
                                now: now
                            }, item.id, false, {
                                fileName: "[project]/components/news/NewsPanel.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/news/NewsPanel.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/news/NewsPanel.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/news/NewsPanel.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(NewsPanel, "1XrSnnNnJXVkg8rjrxI1MldNEag=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActivePane"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = NewsPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "NewsRow");
__turbopack_context__.k.register(_c1, "NewsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/objects/ObjectTree.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ObjectTree",
    ()=>ObjectTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/drawings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indicators.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.mjs [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
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
function ObjectTree() {
    _s();
    const panes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[panes]": (s)=>s.panes
    }["ObjectTree.useAppStore[panes]"]);
    const layoutCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[layoutCount]": (s)=>s.layoutCount
    }["ObjectTree.useAppStore[layoutCount]"]);
    const activePaneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[activePaneId]": (s)=>s.activePaneId
    }["ObjectTree.useAppStore[activePaneId]"]);
    const setActivePane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[setActivePane]": (s)=>s.setActivePane
    }["ObjectTree.useAppStore[setActivePane]"]);
    const removeIndicator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[removeIndicator]": (s)=>s.removeIndicator
    }["ObjectTree.useAppStore[removeIndicator]"]);
    const setIndicatorHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[setIndicatorHidden]": (s)=>s.setIndicatorHidden
    }["ObjectTree.useAppStore[setIndicatorHidden]"]);
    const toggleDrawingHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[toggleDrawingHidden]": (s)=>s.toggleDrawingHidden
    }["ObjectTree.useAppStore[toggleDrawingHidden]"]);
    const removeDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[removeDrawing]": (s)=>s.removeDrawing
    }["ObjectTree.useAppStore[removeDrawing]"]);
    const clearDrawings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[clearDrawings]": (s)=>s.clearDrawings
    }["ObjectTree.useAppStore[clearDrawings]"]);
    const drawingsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[drawingsHidden]": (s)=>s.drawingsHidden
    }["ObjectTree.useAppStore[drawingsHidden]"]);
    const setDrawingsHidden = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[setDrawingsHidden]": (s)=>s.setDrawingsHidden
    }["ObjectTree.useAppStore[setDrawingsHidden]"]);
    const selectedDrawingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[selectedDrawingId]": (s)=>s.selectedDrawingId
    }["ObjectTree.useAppStore[selectedDrawingId]"]);
    const setSelectedDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[setSelectedDrawing]": (s)=>s.setSelectedDrawing
    }["ObjectTree.useAppStore[setSelectedDrawing]"]);
    const setDrawingSettingsTarget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ObjectTree.useAppStore[setDrawingSettingsTarget]": (s)=>s.setDrawingSettingsTarget
    }["ObjectTree.useAppStore[setDrawingSettingsTarget]"]);
    const [closed, setClosed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const visible = panes.slice(0, layoutCount);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-8 items-center justify-between border-b border-[#222222] px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[13px] font-semibold text-(--app-text)",
                        children: "Object tree"
                    }, void 0, false, {
                        fileName: "[project]/components/objects/ObjectTree.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "text-[11px] text-(--app-muted) hover:text-(--app-text)",
                        onClick: ()=>setDrawingsHidden(!drawingsHidden),
                        children: drawingsHidden ? "Show all" : "Hide all"
                    }, void 0, false, {
                        fileName: "[project]/components/objects/ObjectTree.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/objects/ObjectTree.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 flex-1 overflow-auto py-1",
                children: visible.map((pane)=>{
                    const collapsed = closed[pane.id];
                    const active = pane.id === activePaneId;
                    const studies = pane.studies;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: `flex w-full items-center gap-1 rounded-[3px] px-1 py-1 text-left ${active ? "bg-[var(--maws-elevated)]" : "hover:bg-[var(--maws-elevated)]"}`,
                                onClick: ()=>{
                                    setActivePane(pane.id);
                                    setClosed({
                                        ...closed,
                                        [pane.id]: !collapsed
                                    });
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        size: 12,
                                        className: `text-(--app-muted) ${collapsed ? "-rotate-90" : ""}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[12px] font-semibold text-(--app-text)",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(pane.symbol)
                                    }, void 0, false, {
                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] text-[#4c525e]",
                                        children: pane.timeframe
                                    }, void 0, false, {
                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                        lineNumber: 65,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/objects/ObjectTree.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, this),
                            !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-3 border-l border-[#222222] pb-2",
                                children: [
                                    studies.map((study)=>{
                                        const hidden = Boolean(study.hidden);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1 px-2 py-0.5 text-[12px] text-(--app-text)",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `flex-1 ${hidden ? "text-[#4c525e]" : ""}`,
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indicatorTitle"])(study.type, pane.symbol)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/objects/ObjectTree.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    title: hidden ? "Show" : "Hide",
                                                    onClick: ()=>setIndicatorHidden(study.id, !hidden, pane.id),
                                                    className: "text-(--app-muted) hover:text-(--app-text)",
                                                    children: hidden ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                                        lineNumber: 85,
                                                        columnNumber: 35
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                                        lineNumber: 85,
                                                        columnNumber: 58
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/objects/ObjectTree.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    title: "Remove",
                                                    onClick: ()=>removeIndicator(study.id, pane.id),
                                                    className: "text-(--app-muted) hover:text-[#f23645]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/objects/ObjectTree.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, study.id, true, {
                                            fileName: "[project]/components/objects/ObjectTree.tsx",
                                            lineNumber: 72,
                                            columnNumber: 21
                                        }, this);
                                    }),
                                    pane.drawings.length === 0 && studies.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-2 py-1 text-[11px] text-[#4c525e]",
                                        children: "Empty"
                                    }, void 0, false, {
                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                        lineNumber: 99,
                                        columnNumber: 21
                                    }, this),
                                    pane.drawings.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex cursor-pointer items-center gap-1 px-2 py-0.5 text-[12px] ${selectedDrawingId === d.id ? "bg-[var(--maws-elevated)] text-(--app-text)" : "text-(--app-text)"}`,
                                            onClick: ()=>{
                                                setActivePane(pane.id);
                                                setSelectedDrawing(d.id);
                                            },
                                            onDoubleClick: ()=>{
                                                setActivePane(pane.id);
                                                setSelectedDrawing(d.id);
                                                setDrawingSettingsTarget({
                                                    paneId: pane.id,
                                                    drawingId: d.id
                                                });
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex-1 truncate",
                                                    children: d.text ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DRAW_LABEL"][d.tool] ?? d.tool
                                                }, void 0, false, {
                                                    fileName: "[project]/components/objects/ObjectTree.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    title: d.hidden ? "Show" : "Hide",
                                                    onClick: ()=>toggleDrawingHidden(pane.id, d.id),
                                                    className: "text-(--app-muted) hover:text-(--app-text)",
                                                    children: d.hidden ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 37
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 60
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/objects/ObjectTree.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    title: "Remove",
                                                    onClick: ()=>removeDrawing(pane.id, d.id),
                                                    className: "text-(--app-muted) hover:text-[#f23645]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/objects/ObjectTree.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, d.id, true, {
                                            fileName: "[project]/components/objects/ObjectTree.tsx",
                                            lineNumber: 102,
                                            columnNumber: 21
                                        }, this)),
                                    pane.drawings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "px-2 pt-1 text-[11px] text-(--app-muted) hover:text-[#f23645]",
                                        onClick: ()=>clearDrawings(pane.id),
                                        children: "Remove drawings"
                                    }, void 0, false, {
                                        fileName: "[project]/components/objects/ObjectTree.tsx",
                                        lineNumber: 139,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/objects/ObjectTree.tsx",
                                lineNumber: 68,
                                columnNumber: 17
                            }, this)
                        ]
                    }, pane.id, true, {
                        fileName: "[project]/components/objects/ObjectTree.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/objects/ObjectTree.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/objects/ObjectTree.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(ObjectTree, "PuBVEPkxUt3v0E/JfpbSwWHJNZY=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ObjectTree;
var _c;
__turbopack_context__.k.register(_c, "ObjectTree");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/replay/ReplayBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReplayBar",
    ()=>ReplayBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * ReplayBar.tsx — Vela-driven replay controls (UI only).
 *
 * Vela owns the replay clock (`chart.replay` on the replaying pane's chart);
 * this bar issues commands straight to it — step, play/pause, seek, speed,
 * exit — and mirrors position via the store fields Vela's `replay:*` events
 * keep updated (cursorTime + remaining). No feed-derived index math here.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chart-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.mjs [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-back.mjs [app-client] (ecmascript) <export default as SkipBack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-forward.mjs [app-client] (ecmascript) <export default as SkipForward>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const SPEEDS = [
    0.5,
    1,
    2,
    5,
    10,
    20
];
function replayIntervalMs(speed) {
    return Math.max(40, 420 / Math.max(0.5, speed));
}
function ReplayBar() {
    _s();
    const replay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ReplayBar.useAppStore[replay]": (s)=>s.replay
    }["ReplayBar.useAppStore[replay]"]);
    const patchReplay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ReplayBar.useAppStore[patchReplay]": (s)=>s.patchReplay
    }["ReplayBar.useAppStore[patchReplay]"]);
    const stopReplay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ReplayBar.useAppStore[stopReplay]": (s)=>s.stopReplay
    }["ReplayBar.useAppStore[stopReplay]"]);
    const paneId = replay?.paneId;
    const activePane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ReplayBar.useAppStore[activePane]": (s)=>s.panes.find({
                "ReplayBar.useAppStore[activePane]": (p)=>p.id === paneId
            }["ReplayBar.useAppStore[activePane]"])
    }["ReplayBar.useAppStore[activePane]"]);
    const symbol = activePane?.symbol ?? "";
    const tfMs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "ReplayBar.useAppStore[tfMs]": (s)=>{
            const p = s.panes.find({
                "ReplayBar.useAppStore[tfMs].p": (x)=>x.id === paneId
            }["ReplayBar.useAppStore[tfMs].p"]);
            if (!p) return 0;
            const map = {
                "1m": 60_000,
                "3m": 180_000,
                "5m": 300_000,
                "15m": 900_000,
                "30m": 1_800_000,
                "1h": 3_600_000,
                "2h": 7_200_000,
                "4h": 14_400_000,
                "1D": 86_400_000,
                "1W": 604_800_000,
                "1M": 2_592_000_000
            };
            return map[p.timeframe] ?? 3_600_000;
        }
    }["ReplayBar.useAppStore[tfMs]"]);
    if (!replay) return null;
    const vela = ()=>{
        const handle = paneId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chart$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChart"])(paneId) : undefined;
        return handle?.vela.replay ?? null;
    };
    const stamp = replay.cursorTime ? (()=>{
        const d = new Date(replay.cursorTime);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }) + " - " + d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    })() : "";
    const seek = (cursorTime)=>{
        patchReplay({
            cursorTime,
            playing: false
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-9 shrink-0 items-center gap-2 border-t border-[var(--maws-border)] bg-[var(--maws-panel)] px-2 text-[12px] text-[var(--maws-text)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "flex h-7 items-center gap-1 rounded-[4px] px-2 text-[var(--maws-muted)] hover:bg-[var(--maws-elevated)] hover:text-[var(--maws-text)]",
                onClick: ()=>{
                    vela()?.stop();
                    stopReplay();
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        size: 13
                    }, void 0, false, {
                        fileName: "[project]/components/replay/ReplayBar.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    "Exit"
                ]
            }, void 0, true, {
                fileName: "[project]/components/replay/ReplayBar.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[var(--maws-elevated)]",
                title: "Step back one bar",
                onClick: ()=>{
                    if (replay.cursorTime != null) seek(replay.cursorTime - tfMs);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__["SkipBack"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/components/replay/ReplayBar.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/replay/ReplayBar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--maws-elevated)] hover:bg-[var(--maws-hover)]",
                onClick: ()=>patchReplay({
                        playing: !replay.playing
                    }),
                children: replay.playing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/components/replay/ReplayBar.tsx",
                    lineNumber: 93,
                    columnNumber: 27
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/components/replay/ReplayBar.tsx",
                    lineNumber: 93,
                    columnNumber: 49
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/replay/ReplayBar.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-[var(--maws-elevated)]",
                title: "Step forward one bar",
                onClick: ()=>vela()?.step(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__["SkipForward"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/components/replay/ReplayBar.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/replay/ReplayBar.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: replay.speed,
                onChange: (e)=>patchReplay({
                        speed: Number(e.target.value)
                    }),
                className: "h-7 border border-[var(--maws-border)] bg-[var(--maws-bg)] px-1 text-[12px] text-[var(--maws-text)]",
                children: SPEEDS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: s,
                        children: [
                            s,
                            "x"
                        ]
                    }, s, true, {
                        fileName: "[project]/components/replay/ReplayBar.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/replay/ReplayBar.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "range",
                min: 0,
                max: Math.max(1, replay.total - 1),
                value: Math.max(0, replay.remaining ?? 0),
                onChange: (e)=>{
                    // Slider seeks relative to the newest loaded bar (bounds.last):
                    // N bars back from the end, matching the pre-migration semantics.
                    const r = vela();
                    if (!r?.bounds) return;
                    const back = Number(e.target.value);
                    seek(r.bounds.last - back * tfMs);
                },
                className: "mx-2 h-1 min-w-0 flex-1 accent-[#2962ff]"
            }, void 0, false, {
                fileName: "[project]/components/replay/ReplayBar.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 text-[var(--maws-muted)]",
                children: [
                    stamp,
                    " · ",
                    replay.remaining ?? 0,
                    " left"
                ]
            }, void 0, true, {
                fileName: "[project]/components/replay/ReplayBar.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/replay/ReplayBar.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(ReplayBar, "NdcnkWjCR7p9rlOeSTn+gjd344w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = ReplayBar;
var _c;
__turbopack_context__.k.register(_c, "ReplayBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/ResizableColumns.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ColResize",
    ()=>ColResize,
    "useColumnWidths",
    ()=>useColumnWidths
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function useColumnWidths(tableId, defaults) {
    _s();
    const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useColumnWidths.useAppStore[stored]": (s)=>s.columnWidths[tableId]
    }["useColumnWidths.useAppStore[stored]"]);
    const setColumnWidths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useColumnWidths.useAppStore[setColumnWidths]": (s)=>s.setColumnWidths
    }["useColumnWidths.useAppStore[setColumnWidths]"]);
    const widths = stored && stored.length === defaults.length ? stored : defaults;
    const setWidth = (index, next, min = 40)=>{
        const current = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().columnWidths[tableId] ?? defaults;
        const copy = current.length === defaults.length ? [
            ...current
        ] : [
            ...defaults
        ];
        copy[index] = Math.max(min, Math.round(next));
        setColumnWidths(tableId, copy);
    };
    const onResize = (index, min = 40, invert = false)=>(event)=>{
            event.preventDefault();
            event.stopPropagation();
            const startX = event.clientX;
            const start = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().columnWidths[tableId] ?? defaults;
            const startW = start[index] ?? defaults[index];
            const prev = document.body.style.userSelect;
            document.body.style.userSelect = "none";
            const move = (ev)=>{
                const dx = ev.clientX - startX;
                setWidth(index, startW + (invert ? -dx : dx), min);
            };
            const up = ()=>{
                document.body.style.userSelect = prev;
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
        };
    const template = widths.map((w)=>`${w}px`).join(" ");
    return {
        widths,
        template,
        onResize
    };
}
_s(useColumnWidths, "i4IHncfY+XcYWjfJWwK6mgxB4nM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
function ColResize({ onMouseDown }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "col-resizer",
        onMouseDown: onMouseDown,
        onClick: (e)=>e.stopPropagation()
    }, void 0, false, {
        fileName: "[project]/components/ui/ResizableColumns.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = ColResize;
var _c;
__turbopack_context__.k.register(_c, "ColResize");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/ToolbarBtn.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToolbarBtn",
    ()=>ToolbarBtn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function ToolbarBtn({ active, label, children, className = "", ...rest }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        title: label,
        "aria-label": label,
        className: `toolbar-btn ${active ? "is-active" : ""} ${className}`,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/ToolbarBtn.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = ToolbarBtn;
var _c;
__turbopack_context__.k.register(_c, "ToolbarBtn");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_1vpz7dm._.js.map