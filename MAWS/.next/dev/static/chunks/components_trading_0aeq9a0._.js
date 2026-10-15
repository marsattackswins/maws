(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/trading/AccountSettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountSettingsModal",
    ()=>AccountSettingsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/brokers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as Info>");
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
const LEVERAGE_OPTS = [
    1,
    2,
    3,
    5,
    10,
    15,
    20,
    25,
    50,
    75,
    100,
    125
];
function LeverageSelect({ label, value, disabled, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
        label: label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-full ${disabled ? "opacity-45" : ""}`,
                value: value,
                disabled: disabled,
                onChange: (e)=>onChange(Number(e.target.value)),
                children: LEVERAGE_OPTS.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: n,
                        children: [
                            n,
                            "x"
                        ]
                    }, n, true, {
                        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                        lineNumber: 45,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = LeverageSelect;
function AccountSettingsModal() {
    _s();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[open]": (s)=>s.accountSettingsOpen
    }["AccountSettingsModal.useAppStore[open]"]);
    const setOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[setOpen]": (s)=>s.setAccountSettingsOpen
    }["AccountSettingsModal.useAppStore[setOpen]"]);
    const balance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[balance]": (s)=>s.mockBalance
    }["AccountSettingsModal.useAppStore[balance]"]);
    const paper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[paper]": (s)=>s.paperAccount
    }["AccountSettingsModal.useAppStore[paper]"]);
    const setMockBalance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[setMockBalance]": (s)=>s.setMockBalance
    }["AccountSettingsModal.useAppStore[setMockBalance]"]);
    const setPaperAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[setPaperAccount]": (s)=>s.setPaperAccount
    }["AccountSettingsModal.useAppStore[setPaperAccount]"]);
    const resetPaperAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[resetPaperAccount]": (s)=>s.resetPaperAccount
    }["AccountSettingsModal.useAppStore[resetPaperAccount]"]);
    const patchChartSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[patchChartSettings]": (s)=>s.patchChartSettings
    }["AccountSettingsModal.useAppStore[patchChartSettings]"]);
    const addBalanceHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "AccountSettingsModal.useAppStore[addBalanceHistory]": (s)=>s.addBalanceHistory
    }["AccountSettingsModal.useAppStore[addBalanceHistory]"]);
    const [draftBalance, setDraftBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String(balance));
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(paper);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AccountSettingsModal.useEffect": ()=>{
            if (!open) return;
            setDraftBalance(String(balance));
            setDraft({
                ...paper,
                leverage: {
                    ...paper.leverage
                }
            });
        }
    }["AccountSettingsModal.useEffect"], [
        open,
        balance,
        paper
    ]);
    if (!open) return null;
    const setLev = (key, value)=>{
        setDraft((d)=>({
                ...d,
                leverage: {
                    ...d.leverage,
                    [key]: value
                }
            }));
    };
    const save = ()=>{
        const nextBal = Number(String(draftBalance).replace(/,/g, ""));
        if (Number.isFinite(nextBal) && nextBal >= 0) {
            const prev = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().mockBalance;
            setMockBalance(nextBal);
            if (nextBal !== prev) {
                addBalanceHistory({
                    time: Date.now(),
                    type: nextBal > prev ? "deposit" : "withdrawal",
                    amount: Math.abs(nextBal - prev),
                    balanceAfter: nextBal,
                    note: "Account settings"
                });
            }
        }
        setPaperAccount(draft);
        patchChartSettings({
            defaultLeverage: draft.leverage.crypto
        });
        setOpen(false);
    };
    const reset = ()=>{
        resetPaperAccount();
        addBalanceHistory({
            time: Date.now(),
            type: "deposit",
            amount: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"],
            balanceAfter: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"],
            note: "Account reset"
        });
        setDraftBalance(String(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$brokers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_START_BALANCE"]));
        setDraft({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"],
            leverage: {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAPER_ACCOUNT"].leverage
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsOverlay"], {
        onClose: ()=>setOpen(false),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsPanel"], {
            width: 440,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsHeader"], {
                    title: "Account settings",
                    onClose: ()=>setOpen(false)
                }, void 0, false, {
                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBody"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                            label: "Balance",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} w-full`,
                                value: draftBalance,
                                onChange: (e)=>setDraftBalance(e.target.value),
                                inputMode: "decimal"
                            }, void 0, false, {
                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                                title: "LEVERAGE",
                                hint: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                        label: "Margin control",
                                        checked: draft.marginControl,
                                        onChange: (marginControl)=>setDraft((d)=>({
                                                    ...d,
                                                    marginControl
                                                })),
                                        extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                            size: 13,
                                            className: "text-[#4c525e]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                            lineNumber: 143,
                                            columnNumber: 24
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeverageSelect, {
                                                label: "Stocks",
                                                value: draft.leverage.stocks,
                                                disabled: !draft.marginControl,
                                                onChange: (v)=>setLev("stocks", v)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeverageSelect, {
                                                label: "Futures",
                                                value: draft.leverage.futures,
                                                disabled: !draft.marginControl,
                                                onChange: (v)=>setLev("futures", v)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                lineNumber: 152,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeverageSelect, {
                                                label: "Crypto",
                                                value: draft.leverage.crypto,
                                                disabled: !draft.marginControl,
                                                onChange: (v)=>setLev("crypto", v)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                lineNumber: 158,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "col-span-2 mx-auto w-[calc(50%-6px)]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeverageSelect, {
                                                    label: "Others",
                                                    value: draft.leverage.others,
                                                    disabled: !draft.marginControl,
                                                    onChange: (v)=>setLev("others", v)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                            title: "COMMISSION",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Futures and options",
                                    checked: draft.futuresCommissionOn,
                                    onChange: (futuresCommissionOn)=>setDraft((d)=>({
                                                ...d,
                                                futuresCommissionOn
                                            }))
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pl-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                        label: "Commission per contract",
                                        hint: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} w-full`,
                                            value: draft.commissionPerContract,
                                            disabled: !draft.futuresCommissionOn,
                                            onChange: (e)=>setDraft((d)=>({
                                                        ...d,
                                                        commissionPerContract: Number(e.target.value) || 0
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Others",
                                    checked: draft.othersCommissionOn,
                                    onChange: (othersCommissionOn)=>setDraft((d)=>({
                                                ...d,
                                                othersCommissionOn
                                            }))
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 pl-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                            label: "Commission",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} w-full`,
                                                value: draft.othersCommission,
                                                disabled: !draft.othersCommissionOn,
                                                onChange: (e)=>setDraft((d)=>({
                                                            ...d,
                                                            othersCommission: Number(e.target.value) || 0
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                            label: "Commission type",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-full`,
                                                    value: draft.othersCommissionType,
                                                    disabled: !draft.othersCommissionOn,
                                                    onChange: (e)=>setDraft((d)=>({
                                                                ...d,
                                                                othersCommissionType: e.target.value
                                                            })),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "fixed",
                                                            children: "Fixed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "percent",
                                                            children: "Percent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                            lineNumber: 234,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                                lineNumber: 221,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                            lineNumber: 220,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFooter"], {
                    left: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                        variant: "ghost",
                        onClick: reset,
                        children: "Reset account"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                        lineNumber: 241,
                        columnNumber: 31
                    }, this),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                        variant: "primary",
                        onClick: save,
                        children: "Save"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/trading/AccountSettingsModal.tsx",
                    lineNumber: 241,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/trading/AccountSettingsModal.tsx",
            lineNumber: 125,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/trading/AccountSettingsModal.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(AccountSettingsModal, "Ha9V6boDnKByO0hLsfTGp1riQmc=", false, function() {
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
_c1 = AccountSettingsModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "LeverageSelect");
__turbopack_context__.k.register(_c1, "AccountSettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/trading/BrokerDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrokerDialog",
    ()=>BrokerDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/bridge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as CircleAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as LoaderCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
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
const FALLBACK_PROFILES = [
    {
        profileId: "paper",
        label: "Paper Trading",
        environment: "paper",
        configured: true,
        requiresProductionConfirmation: false,
        executionEnabled: false
    },
    {
        profileId: "binance-testnet",
        label: "Binance Testnet",
        environment: "testnet",
        configured: false,
        requiresProductionConfirmation: false,
        executionEnabled: false
    },
    {
        profileId: "binance-production",
        label: "Binance Production",
        environment: "production",
        configured: false,
        requiresProductionConfirmation: true,
        executionEnabled: false
    }
];
const PROFILE_COPY = {
    paper: {
        description: "Simulated orders and positions kept in this browser.",
        caution: "Paper state never mixes with Binance state."
    },
    "binance-testnet": {
        description: "Server-managed Binance Futures Testnet account.",
        caution: "Uses server-side testnet configuration."
    },
    "binance-production": {
        description: "Server-managed Binance Production account.",
        caution: "Real orders and positions may be affected."
    }
};
function ProfileMark({ profileId }) {
    if (profileId === "paper") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#363a45] bg-(--app-elevated) text-[18px]",
            children: "P"
        }, void 0, false, {
            fileName: "[project]/components/trading/BrokerDialog.tsx",
            lineNumber: 55,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex h-11 w-11 items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "34",
            height: "34",
            viewBox: "0 0 24 24",
            fill: "#f0b90b",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7.0679 12L5.03779 14.0301L3.00256 12L5.03268 9.96989L7.0679 12ZM12.0026 7.06534L15.485 10.5477L17.5151 8.51761L12.0026 3L6.48495 8.51761L8.51506 10.5477L12.0026 7.06534ZM18.9673 9.96989L16.9372 12L18.9673 14.0301L20.9975 12L18.9673 9.96989ZM12.0026 16.9347L8.52018 13.4523L6.49006 15.4824L12.0026 21L17.5151 15.4824L15.485 13.4523L12.0026 16.9347ZM12.0026 14.0301L14.0327 12L12.0026 9.96989L9.96734 12L12.0026 14.0301Z"
            }, void 0, false, {
                fileName: "[project]/components/trading/BrokerDialog.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/trading/BrokerDialog.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/trading/BrokerDialog.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c = ProfileMark;
function safeLoadError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) return "Authenticate when you choose a Binance profile.";
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"] && error.code === "env_local") {
        return "Binance profiles are unavailable in local mode. Paper Trading remains available.";
    }
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"]) return "Server profile status is unavailable.";
    return "Server profile status is unavailable.";
}
function safeAuthError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]) return "Invalid operator password.";
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"] && error.code === "env_local") {
        return "Set MAWS_OPERATOR_AUTH to connect a Binance profile from Chart Only.";
    }
    return "Operator authentication is unavailable. Try again.";
}
function BrokerDialog() {
    _s();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "BrokerDialog.useAppStore[open]": (s)=>s.brokerDialogOpen
    }["BrokerDialog.useAppStore[open]"]);
    const setOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "BrokerDialog.useAppStore[setOpen]": (s)=>s.setBrokerDialogOpen
    }["BrokerDialog.useAppStore[setOpen]"]);
    const connectedBroker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "BrokerDialog.useAppStore[connectedBroker]": (s)=>s.connectedBroker
    }["BrokerDialog.useAppStore[connectedBroker]"]);
    const liveProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "BrokerDialog.useLiveStore[liveProfile]": (s)=>s.profileId
    }["BrokerDialog.useLiveStore[liveProfile]"]);
    const livePhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "BrokerDialog.useLiveStore[livePhase]": (s)=>s.phase
    }["BrokerDialog.useLiveStore[livePhase]"]);
    const liveReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "BrokerDialog.useLiveStore[liveReady]": (s)=>s.ready
    }["BrokerDialog.useLiveStore[liveReady]"]);
    const liveReason = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "BrokerDialog.useLiveStore[liveReason]": (s)=>s.reasonCode
    }["BrokerDialog.useLiveStore[liveReason]"]);
    const liveManagerError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "BrokerDialog.useLiveStore[liveManagerError]": (s)=>s.managerError
    }["BrokerDialog.useLiveStore[liveManagerError]"]);
    const [profiles, setProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(FALLBACK_PROFILES);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loadError, setLoadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [switchingTarget, setSwitchingTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [productionConfirmation, setProductionConfirmation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [productionChecked, setProductionChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [authenticationRequired, setAuthenticationRequired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localUnavailable, setLocalUnavailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [authTarget, setAuthTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [authPassword, setAuthPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [authBusy, setAuthBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [authError, setAuthError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const closeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeProfile = connectedBroker === "mock" ? "paper" : connectedBroker === "binance" ? liveProfile : null;
    const switching = switchingTarget !== null || livePhase === "switching";
    const currentLabel = activeProfile ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileLabel"])(activeProfile) : "Chart only";
    const currentStatus = livePhase === "switching" ? "Switching profile…" : liveReady ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profilePhaseLabel"])(livePhase) : livePhase !== "idle" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profilePhaseLabel"])(livePhase) : "No active broker";
    const orderedProfiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BrokerDialog.useMemo[orderedProfiles]": ()=>[
                "paper",
                "binance-testnet",
                "binance-production"
            ].map({
                "BrokerDialog.useMemo[orderedProfiles]": (id)=>profiles.find({
                        "BrokerDialog.useMemo[orderedProfiles]": (profile)=>profile.profileId === id
                    }["BrokerDialog.useMemo[orderedProfiles]"]) ?? FALLBACK_PROFILES.find({
                        "BrokerDialog.useMemo[orderedProfiles]": (profile)=>profile.profileId === id
                    }["BrokerDialog.useMemo[orderedProfiles]"])
            }["BrokerDialog.useMemo[orderedProfiles]"])
    }["BrokerDialog.useMemo[orderedProfiles]"], [
        profiles
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerDialog.useEffect": ()=>{
            if (!open) {
                setProductionConfirmation(false);
                setProductionChecked(false);
                setSwitchingTarget(null);
                setAuthTarget(null);
                setAuthPassword("");
                setAuthError(null);
                return;
            }
            let cancelled = false;
            setLoading(true);
            setLoadError(null);
            setAuthenticationRequired(false);
            setLocalUnavailable(false);
            void __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].profiles().then({
                "BrokerDialog.useEffect": (response)=>{
                    if (!cancelled) {
                        setProfiles(response.profiles);
                        setAuthenticationRequired(false);
                    }
                }
            }["BrokerDialog.useEffect"]).catch({
                "BrokerDialog.useEffect": (error)=>{
                    if (!cancelled) {
                        setProfiles(FALLBACK_PROFILES);
                        setAuthenticationRequired(error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAuthError"]);
                        setLocalUnavailable(error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"] && error.code === "env_local");
                        setLoadError(safeLoadError(error));
                    }
                }
            }["BrokerDialog.useEffect"]).finally({
                "BrokerDialog.useEffect": ()=>{
                    if (!cancelled) setLoading(false);
                }
            }["BrokerDialog.useEffect"]);
            return ({
                "BrokerDialog.useEffect": ()=>{
                    cancelled = true;
                }
            })["BrokerDialog.useEffect"];
        }
    }["BrokerDialog.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerDialog.useEffect": ()=>{
            if (!open) return;
            const onKey = {
                "BrokerDialog.useEffect.onKey": (event)=>{
                    if (event.key !== "Escape") return;
                    event.preventDefault();
                    event.stopPropagation();
                    if (authTarget) {
                        setAuthTarget(null);
                        setAuthPassword("");
                        setAuthError(null);
                    } else if (productionConfirmation) {
                        setProductionConfirmation(false);
                        setProductionChecked(false);
                    } else {
                        setOpen(false);
                    }
                }
            }["BrokerDialog.useEffect.onKey"];
            window.addEventListener("keydown", onKey, true);
            return ({
                "BrokerDialog.useEffect": ()=>window.removeEventListener("keydown", onKey, true)
            })["BrokerDialog.useEffect"];
        }
    }["BrokerDialog.useEffect"], [
        authTarget,
        open,
        productionConfirmation,
        setOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BrokerDialog.useEffect": ()=>{
            if (open) return;
            window.requestAnimationFrame({
                "BrokerDialog.useEffect": ()=>{
                    document.querySelector("[data-trade-trigger]")?.focus();
                }
            }["BrokerDialog.useEffect"]);
        }
    }["BrokerDialog.useEffect"], [
        open
    ]);
    const closeDialog = ()=>{
        setOpen(false);
        closeRef.current?.blur();
    };
    const startSwitch = async (profileId, confirmProduction = false)=>{
        if (switching) return;
        setSwitchingTarget(profileId);
        setLoadError(null);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["switchLiveProfile"])(profileId, confirmProduction);
            if (result === "ready" || result === "paper") {
                closeDialog();
            } else if (result === "error") {
                const current = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"].getState();
                setLoadError(current.managerError ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileErrorMessage"])(current.reasonCode));
            }
        } catch (error) {
            setLoadError(error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveApiError"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileErrorMessage"])(error.code) : safeLoadError(error));
        } finally{
            setSwitchingTarget(null);
        }
    };
    const requestBinanceProfile = async (profileId)=>{
        if (switching) return;
        try {
            const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].session();
            if (session.authenticated) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCsrf"])(session.csrf ?? null);
                if (profileId === "binance-production") {
                    setProductionChecked(false);
                    setProductionConfirmation(true);
                } else {
                    void startSwitch(profileId);
                }
                return;
            }
        } catch (error) {
            setLoadError(safeAuthError(error));
            return;
        }
        setAuthTarget(profileId);
        setAuthPassword("");
        setAuthError(null);
    };
    const authenticateForProfile = async (event)=>{
        event.preventDefault();
        if (!authTarget || authBusy || authPassword.length === 0) return;
        const target = authTarget;
        setAuthBusy(true);
        setAuthError(null);
        try {
            const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].login(authPassword);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCsrf"])(session.csrf);
            setLoadError(null);
            setAuthenticationRequired(false);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liveApi"].profiles();
            setProfiles(response.profiles);
            const profile = response.profiles.find((item)=>item.profileId === target);
            if (!profile?.configured) {
                setAuthError("That Binance profile is not configured on the server.");
                return;
            }
            setAuthTarget(null);
            setAuthPassword("");
            if (target === "binance-production") {
                setProductionChecked(false);
                setProductionConfirmation(true);
            } else {
                void startSwitch(target);
            }
        } catch (error) {
            setAuthError(safeAuthError(error));
        } finally{
            setAuthBusy(false);
        }
    };
    const selectProfile = (profile)=>{
        const unavailable = profile.profileId !== "paper" && !profile.configured && !authenticationRequired;
        if (switching || unavailable || localUnavailable && profile.profileId !== "paper") return;
        if (profile.profileId === "paper") {
            void startSwitch(profile.profileId);
            return;
        }
        void requestBinanceProfile(profile.profileId);
    };
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[80] flex items-center justify-center bg-black/70",
        onMouseDown: closeDialog,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-[720px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[8px] border border-(--app-border) bg-[#131313] shadow-[0_16px_60px_rgba(0,0,0,0.6)]",
                onMouseDown: (event)=>event.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between px-5 pt-4 pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[18px] font-semibold text-white",
                                        children: "Choose trading profile"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-[12px] text-(--app-muted)",
                                        children: [
                                            "Current: ",
                                            currentLabel,
                                            " · ",
                                            currentStatus
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                                        lineNumber: 280,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/BrokerDialog.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: closeRef,
                                type: "button",
                                "aria-label": "Close profile chooser",
                                className: "flex h-8 w-8 items-center justify-center rounded-[4px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)",
                                onClick: closeDialog,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/BrokerDialog.tsx",
                                lineNumber: 282,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    switching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-5 mb-3 flex items-center gap-2 rounded-[6px] border border-[#2962ff]/40 bg-[#101827] px-3 py-2 text-[12px] text-(--app-text)",
                        role: "status",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__["LoaderCircle"], {
                                size: 14,
                                className: "animate-spin text-[#2962ff]"
                            }, void 0, false, {
                                fileName: "[project]/components/trading/BrokerDialog.tsx",
                                lineNumber: 289,
                                columnNumber: 13
                            }, this),
                            "Switching profile… Existing profile remains confirmed until the server reports readiness."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this) : null,
                    livePhase === "degraded" || livePhase === "failed" || livePhase === "detached" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-5 mb-3 flex items-start gap-2 rounded-[6px] border border-[#f23645]/40 bg-[#1a0b0d] px-3 py-2 text-[12px] text-[#f23645]",
                        role: "alert",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleAlert$3e$__["CircleAlert"], {
                                size: 14,
                                className: "mt-0.5 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/components/trading/BrokerDialog.tsx",
                                lineNumber: 295,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileErrorMessage"])(liveReason),
                                    liveManagerError ? ` ${liveManagerError}.` : "",
                                    " ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profilePhaseLabel"])(livePhase),
                                    ". Normal trading remains disabled until a ready profile is confirmed."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/BrokerDialog.tsx",
                                lineNumber: 296,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                        lineNumber: 294,
                        columnNumber: 11
                    }, this) : null,
                    loadError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-5 mb-3 text-[12px] text-[#f0b90b]",
                        children: loadError
                    }, void 0, false, {
                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                        lineNumber: 299,
                        columnNumber: 22
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-3 px-5 pb-5",
                        children: [
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-3 flex items-center justify-center py-14 text-[12px] text-(--app-muted)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__["LoaderCircle"], {
                                        size: 16,
                                        className: "mr-2 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                                        lineNumber: 302,
                                        columnNumber: 120
                                    }, this),
                                    "Loading server profiles…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/BrokerDialog.tsx",
                                lineNumber: 302,
                                columnNumber: 22
                            }, this) : null,
                            !loading && orderedProfiles.map((profile)=>{
                                const selected = activeProfile === profile.profileId && livePhase !== "switching";
                                const unavailable = profile.profileId !== "paper" && !profile.configured && !authenticationRequired;
                                const copy = PROFILE_COPY[profile.profileId];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: switching || unavailable,
                                    "aria-pressed": selected,
                                    onClick: ()=>selectProfile(profile),
                                    className: `relative flex min-h-[190px] flex-col items-start rounded-[6px] border px-4 py-4 text-left transition-colors focus:outline-none focus:ring-1 focus:ring-[#2962ff] ${selected ? "border-[#089981] bg-[#071512]" : "border-(--app-border) bg-[#111111] hover:border-[#2962ff]"} disabled:cursor-not-allowed disabled:opacity-55`,
                                    children: [
                                        selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute right-3 top-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#089981]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 159
                                                }, this),
                                                "Active"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                                            lineNumber: 316,
                                            columnNumber: 29
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileMark, {
                                            profileId: profile.profileId
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                                            lineNumber: 317,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-3 text-[14px] font-semibold text-(--app-text)",
                                            children: profile.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                                            lineNumber: 318,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-1 text-[12px] leading-4 text-(--app-muted)",
                                            children: copy.description
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                                            lineNumber: 319,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-auto flex items-center gap-1 pt-4 text-[11px] text-(--app-muted)",
                                            children: [
                                                unavailable ? localUnavailable && profile.profileId !== "paper" ? "Unavailable in local mode" : "Not configured" : authenticationRequired && profile.profileId !== "paper" && !selected ? "Authentication required" : selected ? profile.profileId === "paper" ? "Available · Active" : livePhase === "degraded" ? "Configured · Active · Degraded" : "Configured · Active" : profile.profileId === "paper" ? "Available · Not active" : "Configured · Not active",
                                                !unavailable && !selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    size: 13
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 48
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                                            lineNumber: 320,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, profile.profileId, true, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 308,
                                    columnNumber: 15
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-(--app-border) px-5 py-3 text-[11px] text-(--app-muted)",
                        children: "Server credentials and endpoints stay on the server. The browser receives only safe profile status."
                    }, void 0, false, {
                        fileName: "[project]/components/trading/BrokerDialog.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/BrokerDialog.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            authTarget ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60",
                onMouseDown: ()=>{
                    setAuthTarget(null);
                    setAuthPassword("");
                    setAuthError(null);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "profile-auth-title",
                    onSubmit: authenticateForProfile,
                    className: "w-[430px] max-w-[calc(100vw-32px)] rounded-[8px] border border-(--app-border) bg-[#171717] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.7)]",
                    onMouseDown: (event)=>event.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "profile-auth-title",
                            className: "text-[16px] font-semibold text-white",
                            children: [
                                "Authenticate for ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileLabel"])(authTarget)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 350,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-3 text-[13px] leading-5 text-(--app-text)",
                            children: "Enter the server operator password to connect this profile."
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 351,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "mt-4 block text-[12px] text-(--app-muted)",
                            htmlFor: "profile-operator-password",
                            children: "Operator password"
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 352,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "profile-operator-password",
                            type: "password",
                            autoComplete: "current-password",
                            autoFocus: true,
                            value: authPassword,
                            onChange: (event)=>setAuthPassword(event.target.value),
                            className: "mt-1 h-9 w-full rounded-[6px] border border-(--app-border) bg-[#111111] px-3 text-[13px] text-(--app-text) outline-none focus:border-[#2962ff]"
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this),
                        authError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "alert",
                            className: "mt-3 text-[12px] text-[#f23645]",
                            children: authError
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 362,
                            columnNumber: 26
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-5 flex justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "rounded-[4px] px-3 py-2 text-[12px] text-(--app-muted) hover:bg-[#222] hover:text-(--app-text)",
                                    onClick: ()=>{
                                        setAuthTarget(null);
                                        setAuthPassword("");
                                        setAuthError(null);
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 364,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: authBusy || authPassword.length === 0,
                                    className: "rounded-[4px] bg-[#2962ff] px-3 py-2 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40",
                                    children: authBusy ? "Authenticating…" : "Authenticate"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 365,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 363,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                    lineNumber: 349,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/trading/BrokerDialog.tsx",
                lineNumber: 348,
                columnNumber: 9
            }, this) : null,
            productionConfirmation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60",
                onMouseDown: ()=>{
                    setProductionConfirmation(false);
                    setProductionChecked(false);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "production-confirm-title",
                    className: "w-[430px] max-w-[calc(100vw-32px)] rounded-[8px] border border-[#f0b90b]/50 bg-[#17130a] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.7)]",
                    onMouseDown: (event)=>event.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "production-confirm-title",
                            className: "text-[16px] font-semibold text-[#f0b90b]",
                            children: "You are connecting to Binance Production."
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 374,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-3 text-[13px] leading-5 text-(--app-text)",
                            children: "This uses the server’s production credentials."
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 375,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13px] leading-5 text-(--app-text)",
                            children: "Existing orders and positions will not be cancelled or closed."
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 376,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13px] leading-5 text-(--app-text)",
                            children: "Switching may be blocked if exposure exists."
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 377,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "mt-4 flex cursor-pointer items-start gap-2 text-[12px] text-(--app-text)",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: productionChecked,
                                    onChange: (event)=>setProductionChecked(event.target.checked),
                                    className: "mt-0.5 accent-[#f0b90b]"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 379,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "I understand and want to continue."
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 380,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 378,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-5 flex justify-end gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "rounded-[4px] px-3 py-2 text-[12px] text-(--app-muted) hover:bg-[#241f13] hover:text-(--app-text)",
                                    onClick: ()=>{
                                        setProductionConfirmation(false);
                                        setProductionChecked(false);
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 383,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: !productionChecked || switching,
                                    className: "rounded-[4px] bg-[#f0b90b] px-3 py-2 text-[12px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40",
                                    onClick: ()=>{
                                        setProductionConfirmation(false);
                                        void startSwitch("binance-production", true);
                                    },
                                    children: "Connect Production"
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                                    lineNumber: 384,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/BrokerDialog.tsx",
                            lineNumber: 382,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/trading/BrokerDialog.tsx",
                    lineNumber: 373,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/trading/BrokerDialog.tsx",
                lineNumber: 372,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/BrokerDialog.tsx",
        lineNumber: 275,
        columnNumber: 5
    }, this);
}
_s(BrokerDialog, "Hnwh3E07qjuHBElDhD4caV+wCHo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"]
    ];
});
_c1 = BrokerDialog;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProfileMark");
__turbopack_context__.k.register(_c1, "BrokerDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/trading/BuySellContextMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BuySellContextMenu",
    ()=>BuySellContextMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.mjs [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function BuySellContextMenu() {
    _s();
    const menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "BuySellContextMenu.useAppStore[menu]": (s)=>s.buySellMenu
    }["BuySellContextMenu.useAppStore[menu]"]);
    const setBuySellMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "BuySellContextMenu.useAppStore[setBuySellMenu]": (s)=>s.setBuySellMenu
    }["BuySellContextMenu.useAppStore[setBuySellMenu]"]);
    const patchChartSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "BuySellContextMenu.useAppStore[patchChartSettings]": (s)=>s.patchChartSettings
    }["BuySellContextMenu.useAppStore[patchChartSettings]"]);
    const setTradingSettingsSymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "BuySellContextMenu.useAppStore[setTradingSettingsSymbol]": (s)=>s.setTradingSettingsSymbol
    }["BuySellContextMenu.useAppStore[setTradingSettingsSymbol]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BuySellContextMenu.useEffect": ()=>{
            if (!menu) return;
            const close = {
                "BuySellContextMenu.useEffect.close": ()=>setBuySellMenu(null)
            }["BuySellContextMenu.useEffect.close"];
            const timer = window.setTimeout({
                "BuySellContextMenu.useEffect.timer": ()=>{
                    window.addEventListener("mousedown", close);
                }
            }["BuySellContextMenu.useEffect.timer"], 0);
            return ({
                "BuySellContextMenu.useEffect": ()=>{
                    window.clearTimeout(timer);
                    window.removeEventListener("mousedown", close);
                }
            })["BuySellContextMenu.useEffect"];
        }
    }["BuySellContextMenu.useEffect"], [
        menu,
        setBuySellMenu
    ]);
    if (!menu) return null;
    const style = {
        left: Math.min(menu.x, window.innerWidth - 200),
        top: Math.min(menu.y, window.innerHeight - 100)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ctx-menu",
        style: {
            ...style,
            width: 188
        },
        onClick: (e)=>e.stopPropagation(),
        onMouseDown: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "ctx-item",
                onClick: ()=>{
                    patchChartSettings({
                        showBuySell: false
                    });
                    setBuySellMenu(null);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ctx-ico",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                            size: 15
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ctx-body",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ctx-label",
                            children: "Hide Buttons"
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "ctx-item",
                onClick: ()=>setTradingSettingsSymbol(menu.symbol),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ctx-ico",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                            size: 15
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ctx-body",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ctx-label",
                            children: "Trading Settings"
                        }, void 0, false, {
                            fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/BuySellContextMenu.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/BuySellContextMenu.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(BuySellContextMenu, "VJnquk3WGN/PXcsoaMKCZ4MpbYg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = BuySellContextMenu;
var _c;
__turbopack_context__.k.register(_c, "BuySellContextMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/trading/MockBrokerLoop.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MockBrokerLoop",
    ()=>MockBrokerLoop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__ = __turbopack_context__.i("[project]/lib/market/composite-feed.ts [app-client] (ecmascript) <export compositeMarketFeed as mawsFeed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/trading/mock.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function MockBrokerLoop() {
    _s();
    const connected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "MockBrokerLoop.useAppStore[connected]": (s)=>s.connectedBroker
    }["MockBrokerLoop.useAppStore[connected]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MockBrokerLoop.useEffect": ()=>{
            if (connected !== "mock") return;
            // Immediate channel: every accepted quote is evaluated by the engine
            // BEFORE the ~150ms UI quote batching, so a TP/SL breach that reverses
            // inside the batch window is still caught. Engine-level replay
            // protection (tickMock guards + store idempotency) absorbs duplicates.
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$market$2f$composite$2d$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__compositeMarketFeed__as__mawsFeed$3e$__["mawsFeed"].subscribeTradeQuotes({
                "MockBrokerLoop.useEffect": (map)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tickMock"])(map.values());
                }
            }["MockBrokerLoop.useEffect"]);
        }
    }["MockBrokerLoop.useEffect"], [
        connected
    ]);
    return null;
}
_s(MockBrokerLoop, "gZGqjnBoXpqSueBiR8zCPpi88xY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = MockBrokerLoop;
var _c;
__turbopack_context__.k.register(_c, "MockBrokerLoop");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/trading/PositionsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FreshnessBadge",
    ()=>FreshnessBadge,
    "PnlCell",
    ()=>PnlCell,
    "PositionsPanel",
    ()=>PositionsPanel,
    "TradingMetrics",
    ()=>TradingMetrics,
    "computePosRows",
    ()=>computePosRows,
    "useTradingMetrics",
    ()=>useTradingMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/maws/feed.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/bridge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/live/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$selectors$2f$broker$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/selectors/broker.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/dispatch.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/trading/mock.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/timezone.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-quotes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-down.mjs [app-client] (ecmascript) <export default as ChevronsDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-3.mjs [app-client] (ecmascript) <export default as Columns3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plug$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plug.mjs [app-client] (ecmascript) <export default as Plug>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
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
;
;
;
/** Re-renders once per second so relative timestamps stay current. */ function useNowTick(enabled) {
    _s();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useNowTick.useReactState": ()=>Date.now()
    }["useNowTick.useReactState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNowTick.useReactEffect": ()=>{
            if (!enabled) return;
            const id = window.setInterval({
                "useNowTick.useReactEffect.id": ()=>setNow(Date.now())
            }["useNowTick.useReactEffect.id"], 1000);
            return ({
                "useNowTick.useReactEffect": ()=>window.clearInterval(id)
            })["useNowTick.useReactEffect"];
        }
    }["useNowTick.useReactEffect"], [
        enabled
    ]);
    return now;
}
_s(useNowTick, "3HySdJzVDdE6glfehC9yQ3LiXrY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]
    ];
});
function FreshnessBadge({ live }) {
    _s1();
    const markPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "FreshnessBadge.useLiveStore[markPrice]": (s)=>s.markPrice
    }["FreshnessBadge.useLiveStore[markPrice]"]);
    const now = useNowTick(live && markPrice != null);
    if (!live || !markPrice) return null;
    const { connected, stale, lastEventAt } = markPrice;
    if (!connected && lastEventAt == null) return null;
    const ageS = lastEventAt == null ? null : Math.max(0, Math.round((now - lastEventAt) / 1000));
    const isStale = stale || ageS == null || ageS > 15;
    const label = isStale ? `Stale · last update ${ageS == null ? "—" : `${ageS}s`} ago` : `Live · updated ${ageS}s ago`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "whitespace-nowrap text-[11px] font-semibold",
        style: {
            color: isStale ? "#f0b90b" : "#089981"
        },
        children: label
    }, void 0, false, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s1(FreshnessBadge, "OirY57LEYI49Db8HoAZz2UMtiv8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        useNowTick
    ];
});
_c = FreshnessBadge;
;
;
function Metric({ label, value, tone }) {
    const color = tone === "up" ? "text-[#089981]" : tone === "down" ? "text-[#f23645]" : "text-(--app-text)";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex flex-col justify-center gap-[3px] whitespace-nowrap border-l border-[var(--maws-border)] px-4 py-[5px] first:border-l-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[9px] font-semibold uppercase leading-none tracking-[0.08em] text-(--app-muted)",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `text-[13px] font-semibold leading-none ${color}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c1 = Metric;
/** P&L values always carry an explicit sign: +0.00 / -1.23. Zero counts as positive. */ function formatSigned(value) {
    return `${value >= 0 ? "+" : ""}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(value)}`;
}
function PnlCell({ pnl, markPriceStale, markAgeMs }) {
    const ageS = markAgeMs != null ? Math.max(0, Math.round(markAgeMs / 1000)) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        title: markPriceStale && ageS != null ? `PnL from fill snapshot; mark age ${ageS}s` : undefined,
        children: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatUsd"])(pnl),
            markPriceStale ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                role: "status",
                "aria-label": ageS != null ? `Unrealized PnL is a fill-time snapshot, mark age ${ageS} seconds` : "Unrealized PnL is a fill-time snapshot",
                className: "ml-1 align-[2px] text-[9px] font-bold uppercase text-[#f0b90b]",
                children: "stale"
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_c2 = PnlCell;
function Empty({ text }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-[120px] items-center justify-center text-[13px] text-(--app-muted)",
        children: text
    }, void 0, false, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_c3 = Empty;
function formatStamp(ms, timeZone = "Africa/Casablanca") {
    const d = new Date(ms);
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).formatToParts(d);
    const get = (type)=>parts.find((p)=>p.type === type)?.value ?? "00";
    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
function StatusTone({ status }) {
    const color = status === "filled" ? "text-[#089981]" : status === "cancelled" ? "text-[#ff9800]" : status === "rejected" ? "text-[#f23645]" : "text-(--app-muted)";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `capitalize ${color}`,
        children: status
    }, void 0, false, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 149,
        columnNumber: 10
    }, this);
}
_c4 = StatusTone;
function SymbolChip({ symbol }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center rounded-[4px] bg-(--app-hover) px-1.5 py-0.5 text-[11px] text-(--app-text)",
        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(symbol)
    }, void 0, false, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c5 = SymbolChip;
function TableTools() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "flex justify-end gap-1.5 text-(--app-muted)",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                size: 13
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                size: 13
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_c6 = TableTools;
function useTradingMetrics() {
    _s2();
    const connected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useTradingMetrics.useAppStore[connected]": (s)=>s.connectedBroker
    }["useTradingMetrics.useAppStore[connected]"]);
    const balance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useTradingMetrics.useAppStore[balance]": (s)=>s.mockBalance
    }["useTradingMetrics.useAppStore[balance]"]);
    const realized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useTradingMetrics.useAppStore[realized]": (s)=>s.mockRealized
    }["useTradingMetrics.useAppStore[realized]"]);
    const leverage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "useTradingMetrics.useAppStore[leverage]": (s)=>s.chartSettings.defaultLeverage
    }["useTradingMetrics.useAppStore[leverage]"]);
    const liveAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "useTradingMetrics.useLiveStore[liveAccount]": (s)=>s.account
    }["useTradingMetrics.useLiveStore[liveAccount]"]);
    // Authoritative lifetime metrics from the server-side exchange income
    // ledger — NOT the capped latest-50-fill list.
    const liveMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "useTradingMetrics.useLiveStore[liveMetrics]": (s)=>s.accountMetrics
    }["useTradingMetrics.useLiveStore[liveMetrics]"]);
    const liveFills = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "useTradingMetrics.useLiveStore[liveFills]": (s)=>s.fills
    }["useTradingMetrics.useLiveStore[liveFills]"]);
    // Exactly one book (live for binance, paper otherwise) — never a mix.
    const { orders, positions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$selectors$2f$broker$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBrokerBook"])();
    const quotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuotes"])();
    const lastOf = (symbol)=>quotes.find((q)=>q.symbol === symbol)?.last ?? 0;
    const live = connected === "binance";
    const liveAcc = liveAccount ?? {
        balance: 0,
        available: 0,
        equity: 0,
        margin: 0,
        unrealized: 0,
        fetchedAt: null,
        equitySource: "fallback"
    };
    const liveMetricsSafe = liveMetrics ?? {
        realizedPnl: 0,
        commission: 0,
        fundingFee: 0,
        netRealized: 0,
        fetchedAt: null
    };
    const unrealized = live ? liveAcc.unrealized : positions.reduce((sum, p)=>sum + (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["positionPnl"])(p, lastOf(p.symbol)), 0);
    const margin = live ? liveAcc.margin : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["usedMargin"])(positions);
    const orderMargin = live ? 0 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ordersMargin"])(orders, leverage);
    const equity = live ? liveAcc.equity : balance + margin + unrealized;
    const accountBalance = live ? liveAcc.balance : balance + margin;
    const available = live ? liveAcc.available : balance;
    const realizedShown = live ? liveMetricsSafe.realizedPnl : realized;
    const buffer = margin + orderMargin <= 0 ? 100 : equity / (margin + orderMargin) * 100;
    const pnlTone = (v)=>v > 0 ? "up" : v < 0 ? "down" : "muted";
    return {
        connected,
        live,
        liveAcc,
        liveMetrics: liveMetricsSafe,
        liveFills,
        orders,
        positions,
        lastOf,
        accountBalance,
        equity,
        realizedShown,
        unrealized,
        margin,
        available,
        orderMargin,
        buffer,
        pnlTone
    };
}
_s2(useTradingMetrics, "nRXg+TzT+WKfoU3hxKahw9xGG1g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$selectors$2f$broker$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBrokerBook"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$quotes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuotes"]
    ];
});
function TradingMetrics() {
    _s3();
    const { connected, live, liveMetrics, accountBalance, equity, realizedShown, unrealized, available, buffer } = useTradingMetrics();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ml-auto flex shrink-0 items-stretch",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                label: "Balance",
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(accountBalance)
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                label: "Equity",
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(equity)
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            live ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                        label: "Realized",
                        value: formatSigned(liveMetrics.realizedPnl),
                        tone: liveMetrics.realizedPnl >= 0 ? "up" : "down"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                        label: "Commission",
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(liveMetrics.commission)
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 252,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                        label: "Funding",
                        value: formatSigned(liveMetrics.fundingFee),
                        tone: liveMetrics.fundingFee >= 0 ? "up" : "down"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                        label: "Net Realized",
                        value: formatSigned(liveMetrics.netRealized),
                        tone: liveMetrics.netRealized >= 0 ? "up" : "down"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 246,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                label: "Realized",
                value: formatSigned(realizedShown),
                tone: realizedShown >= 0 ? "up" : "down"
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 265,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                label: "Unrealized",
                value: formatSigned(unrealized),
                tone: unrealized >= 0 ? "up" : "down"
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                label: "Available",
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(available)
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Metric, {
                label: "Buffer",
                value: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(buffer, 0)}%`
            }, void 0, false, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 242,
        columnNumber: 5
    }, this);
}
_s3(TradingMetrics, "bLLFq2rB1wnjUIG2KBy9aLBH3hQ=", false, function() {
    return [
        useTradingMetrics
    ];
});
_c7 = TradingMetrics;
function computePosRows(positions, live, lastOf) {
    return live ? positions.map((p)=>{
        const last = p.mark && p.mark > 0 ? p.mark : p.entry;
        const pnl = p.mark && p.mark > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["positionPnl"])(p, last) : p.unrealized ?? 0;
        const notional = p.qty * last;
        // Use Binance isolatedWallet for isolated positions (matches Binance UI display).
        // Fallback to isolatedMargin if isolatedWallet unavailable, then estimate.
        const margin = p.marginType === "isolated" && p.isolatedWallet != null && p.isolatedWallet > 0 ? p.isolatedWallet : p.marginType === "isolated" && p.isolatedMargin != null && p.isolatedMargin > 0 ? p.isolatedMargin : notional / Math.max(1, p.leverage);
        return {
            id: p.id,
            symbol: p.symbol,
            side: p.side,
            entry: p.entry,
            qty: p.qty,
            tp: p.tp,
            sl: p.sl,
            leverage: p.leverage,
            last,
            pnl,
            notional,
            margin,
            marginType: p.marginType,
            markAgeMs: p.markAgeMs,
            markPriceStale: p.markPriceStale === true
        };
    }) : positions.map((p)=>{
        const streamPrice = lastOf(p.symbol);
        const last = streamPrice > 0 ? streamPrice : p.entry;
        const notional = p.qty * last;
        return {
            id: p.id,
            symbol: p.symbol,
            side: p.side,
            entry: p.entry,
            qty: p.qty,
            tp: p.tp,
            sl: p.sl,
            leverage: p.leverage,
            last,
            pnl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["positionPnl"])(p, last),
            notional,
            margin: notional / Math.max(1, p.leverage)
        };
    });
}
function PositionsPanel() {
    _s4();
    const tab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[tab]": (s)=>s.bottomTab
    }["PositionsPanel.useAppStore[tab]"]);
    const orderHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[orderHistory]": (s)=>s.orderHistory
    }["PositionsPanel.useAppStore[orderHistory]"]);
    const balanceHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[balanceHistory]": (s)=>s.balanceHistory
    }["PositionsPanel.useAppStore[balanceHistory]"]);
    const journal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[journal]": (s)=>s.journal
    }["PositionsPanel.useAppStore[journal]"]);
    const timezone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[timezone]": (s)=>s.chartSettings.timezone
    }["PositionsPanel.useAppStore[timezone]"]);
    const stampTz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$timezone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timezoneIana"])(timezone);
    const setBrokerDialogOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[setBrokerDialogOpen]": (s)=>s.setBrokerDialogOpen
    }["PositionsPanel.useAppStore[setBrokerDialogOpen]"]);
    const setAccountSettingsOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[setAccountSettingsOpen]": (s)=>s.setAccountSettingsOpen
    }["PositionsPanel.useAppStore[setAccountSettingsOpen]"]);
    const setBottomOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[setBottomOpen]": (s)=>s.setBottomOpen
    }["PositionsPanel.useAppStore[setBottomOpen]"]);
    const setBottomHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[setBottomHeight]": (s)=>s.setBottomHeight
    }["PositionsPanel.useAppStore[setBottomHeight]"]);
    const setConnectedBroker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "PositionsPanel.useAppStore[setConnectedBroker]": (s)=>s.setConnectedBroker
    }["PositionsPanel.useAppStore[setConnectedBroker]"]);
    const liveProfileId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "PositionsPanel.useLiveStore[liveProfileId]": (s)=>s.profileId
    }["PositionsPanel.useLiveStore[liveProfileId]"]);
    const livePhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "PositionsPanel.useLiveStore[livePhase]": (s)=>s.phase
    }["PositionsPanel.useLiveStore[livePhase]"]);
    const liveReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"])({
        "PositionsPanel.useLiveStore[liveReady]": (s)=>s.ready
    }["PositionsPanel.useLiveStore[liveReady]"]);
    const { connected, live, liveAcc, liveFills, orders, positions, lastOf } = useTradingMetrics();
    const freshness = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FreshnessBadge, {
        live: live
    }, void 0, false, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 365,
        columnNumber: 21
    }, this);
    const [brokerMenuOpen, setBrokerMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [orderFilter, setOrderFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const brokerMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PositionsPanel.useEffect": ()=>{
            if (!brokerMenuOpen) return;
            const onDown = {
                "PositionsPanel.useEffect.onDown": (e)=>{
                    if (!(e.target instanceof Node)) return;
                    if (!brokerMenuRef.current?.contains(e.target)) setBrokerMenuOpen(false);
                }
            }["PositionsPanel.useEffect.onDown"];
            const id = window.setTimeout({
                "PositionsPanel.useEffect.id": ()=>{
                    window.addEventListener("mousedown", onDown);
                }
            }["PositionsPanel.useEffect.id"], 0);
            return ({
                "PositionsPanel.useEffect": ()=>{
                    window.clearTimeout(id);
                    window.removeEventListener("mousedown", onDown);
                }
            })["PositionsPanel.useEffect"];
        }
    }["PositionsPanel.useEffect"], [
        brokerMenuOpen
    ]);
    const mutationBlocked = livePhase === "switching";
    const posRows = computePosRows(positions, live, lastOf);
    const ordRows = orders.map((o)=>({
            id: o.id,
            symbol: o.symbol,
            side: o.side,
            type: o.type,
            qty: o.qty,
            price: o.price
        }));
    const histRows = live ? liveFills.map((f)=>({
            id: `${f.ts}-${f.symbol}-${f.side}-${f.qty}-${f.price}`,
            time: f.ts,
            closingTime: f.ts,
            symbol: f.symbol,
            side: f.side,
            type: "market",
            qty: f.qty,
            price: f.price,
            limitPrice: null,
            stopPrice: null,
            fillPrice: f.price,
            status: "filled"
        })) : orderHistory;
    const filledCount = histRows.filter((o)=>o.status === "filled").length;
    const cancelledCount = histRows.filter((o)=>o.status === "cancelled").length;
    const rejectedCount = histRows.filter((o)=>o.status === "rejected").length;
    const filteredOrders = orderFilter === "all" ? histRows : histRows.filter((o)=>o.status === orderFilter);
    // Live fills are the exchange-side record of every execution, including
    // closing ones (non-zero realized P&L). Derive balance-history and journal
    // rows from them so closes are recorded in both tabs, mirroring paper mode.
    const liveBalanceRows = live ? liveFills.map((f)=>({
            id: `fill-${f.ts}-${f.symbol}-${f.side}-${f.qty}-${f.price}`,
            time: f.ts,
            type: "realized_pnl",
            amount: f.realizedPnl,
            balanceAfter: liveAcc.balance,
            note: `${f.realizedPnl !== 0 ? "Close" : "Open"} fill for symbol ${f.symbol} at price ${f.price} for ${f.qty} units${f.realizedPnl !== 0 ? `. Realized P&L ${f.realizedPnl >= 0 ? "+" : ""}${f.realizedPnl.toFixed(2)} USD` : ""}.`,
            symbol: f.symbol
        })) : [];
    const liveJournalRows = live ? liveFills.filter((f)=>f.realizedPnl !== 0).map((f)=>({
            id: `live-journal-${f.ts}-${f.symbol}-${f.side}-${f.qty}-${f.price}`,
            time: f.ts,
            text: `Close position for symbol ${f.symbol} at price ${f.price} for ${f.qty} units. Realized P&L ${f.realizedPnl >= 0 ? "+" : ""}${f.realizedPnl.toFixed(2)} USD.`
        })) : [];
    const balanceRows = live ? liveBalanceRows : balanceHistory.filter((b)=>b.type === "realized_pnl" || b.type === "deposit" || b.type === "withdrawal");
    const journalRows = live ? liveJournalRows : journal;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 flex-col bg-[var(--maws-panel)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-20 flex h-[28px] shrink-0 items-center gap-3 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative shrink-0",
                        ref: brokerMenuRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "flex items-center gap-1 text-[13px] font-semibold text-(--app-text) hover:text-white",
                                onClick: ()=>setBrokerMenuOpen((v)=>!v),
                                children: [
                                    connected === "mock" ? "Paper Trading" : connected === "binance" ? liveProfileId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profileLabel"])(liveProfileId) : "Binance Futures" : "Trade with your broker",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        size: 14,
                                        className: "text-(--app-muted)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                        lineNumber: 471,
                                        columnNumber: 13
                                    }, this),
                                    freshness,
                                    live && !liveReady ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-1 text-[10px] font-normal text-[#f0b90b]",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profilePhaseLabel"])(livePhase)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                        lineNumber: 473,
                                        columnNumber: 35
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 459,
                                columnNumber: 11
                            }, this),
                            brokerMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-full left-0 z-50 mt-1 w-[210px] rounded-[8px] border border-(--app-border) bg-(--app-elevated) py-1 shadow-[0_8px_28px_rgba(0,0,0,0.65)]",
                                role: "menu",
                                onMouseDown: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "menu-row w-full",
                                        onClick: ()=>{
                                            setBrokerMenuOpen(false);
                                            setBrokerDialogOpen(true);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plug$3e$__["Plug"], {
                                                size: 14,
                                                className: "shrink-0 text-(--app-muted)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 489,
                                                columnNumber: 17
                                            }, this),
                                            "Connect to a broker"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                        lineNumber: 481,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "menu-row w-full",
                                        onClick: ()=>{
                                            setBrokerMenuOpen(false);
                                            if (connected === "binance") {
                                                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["disconnectLiveBroker"])();
                                                setConnectedBroker(null);
                                            } else {
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["disconnectBroker"])();
                                            }
                                            setBottomOpen(false);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                size: 14,
                                                className: "shrink-0 text-(--app-muted)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 506,
                                                columnNumber: 17
                                            }, this),
                                            "Log out"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                        lineNumber: 492,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 476,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 items-center gap-1 text-[12px] text-(--app-text)",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Account"
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 514,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                title: "Account settings",
                                className: "flex h-5 w-5 items-center justify-center rounded-[3px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)",
                                onClick: ()=>setAccountSettingsOpen(true),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 521,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 515,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 513,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-auto flex shrink-0 items-center gap-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "flex h-6 w-6 items-center justify-center rounded-[3px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)",
                                title: "Collapse",
                                onClick: ()=>setBottomOpen(false),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDown$3e$__["ChevronsDown"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 532,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 526,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "flex h-6 w-6 items-center justify-center rounded-[3px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)",
                                title: "Expand to half screen",
                                onClick: (event)=>{
                                    const section = event.currentTarget.closest("section");
                                    const parentHeight = section?.parentElement?.clientHeight || window.innerHeight;
                                    const next = section?.nextElementSibling;
                                    const replayHeight = next instanceof HTMLElement ? next.offsetHeight : 0;
                                    const available = Math.max(160, parentHeight - replayHeight);
                                    const shell = section?.closest("[data-app-shell]");
                                    const applicationHeight = shell?.clientHeight || window.innerHeight;
                                    setBottomHeight(Math.min(available, Math.round(applicationHeight / 2)));
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 534,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 525,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 457,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 flex-1 overflow-auto",
                children: [
                    tab === "positions" ? posRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Empty, {
                        text: "There are no open positions in your trading account yet"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 557,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full min-w-[980px] text-left text-[12px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "sticky top-0 bg-[var(--maws-panel)] text-(--app-muted)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Symbol"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 562,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Side"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 563,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Avg fill price"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 564,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Take profit"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 565,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Stop loss"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 566,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Margin"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 567,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Leverage"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 568,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Trade value"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 569,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Unrealized P&L %"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 570,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Unrealized P&L"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 571,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Expiration date"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 572,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex justify-end gap-1 text-(--app-muted)",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        size: 13
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 575,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                                                        size: 13
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 576,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 574,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 573,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 561,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 560,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: posRows.map((p)=>{
                                    const pnl = p.pnl;
                                    const notional = p.notional;
                                    const mgn = p.margin;
                                    // Binance ROE% is PnL / initial margin (qty × entry / leverage),
                                    // not PnL / notional — otherwise the % ignores leverage and
                                    // diverges from the Futures UI by the leverage factor.
                                    const initialMargin = mgn > 0 ? mgn : notional / Math.max(1, p.leverage);
                                    const pct = initialMargin === 0 ? 0 : pnl / initialMargin * 100;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-t border-[#222222] text-(--app-text)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(p.symbol)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 593,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: `px-2 py-1.5 ${p.side === "long" ? "text-[#2962ff]" : "text-[#f23645]"}`,
                                                children: p.side === "long" ? "Buy" : "Sell"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 594,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(p.symbol, p.entry)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 597,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: p.tp == null ? "—" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(p.symbol, p.tp)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 598,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: p.sl == null ? "—" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(p.symbol, p.sl)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 599,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(mgn)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 600,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: [
                                                    p.leverage,
                                                    "x"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 601,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(notional)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 602,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: `px-2 py-1.5 ${pct >= 0 ? "text-[#089981]" : "text-[#f23645]"}`,
                                                children: [
                                                    pct >= 0 ? "+" : "",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(pct),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 603,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: `px-2 py-1.5 ${pnl >= 0 ? "text-[#089981]" : "text-[#f23645]"}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PnlCell, {
                                                    pnl: pnl,
                                                    markPriceStale: p.markPriceStale,
                                                    markAgeMs: p.markAgeMs
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 607,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5 text-(--app-muted)",
                                                children: "—"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 610,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5 text-right",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: mutationBlocked,
                                                    title: mutationBlocked ? "Switching profile…" : undefined,
                                                    className: "text-(--app-muted) hover:text-(--app-text) disabled:cursor-not-allowed disabled:opacity-40",
                                                    onClick: ()=>{
                                                        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchClosePosition"])(p.id);
                                                    },
                                                    children: "Close"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                    lineNumber: 612,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 611,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, p.id, true, {
                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                        lineNumber: 592,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 581,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 559,
                        columnNumber: 13
                    }, this) : null,
                    tab === "orders" ? ordRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Empty, {
                        text: "There are no working orders in your trading account yet"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 634,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-left text-[12px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "sticky top-0 bg-[var(--maws-panel)] text-(--app-muted)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Symbol"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 639,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Side"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 640,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Type"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 641,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Qty"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 642,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal",
                                            children: "Price"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 643,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-2 py-1.5 font-normal"
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 644,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 638,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 637,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: ordRows.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-t border-[#222222] text-(--app-text)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTicker"])(o.symbol)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 650,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: `px-2 py-1.5 ${o.side === "buy" ? "text-[#2962ff]" : "text-[#f23645]"}`,
                                                children: o.side === "buy" ? "Buy" : "Sell"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 651,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5 capitalize",
                                                children: o.type
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 654,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: o.qty
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 655,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(o.symbol, o.price)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 656,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-2 py-1.5 text-right",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: mutationBlocked,
                                                    title: mutationBlocked ? "Switching profile…" : undefined,
                                                    className: "text-(--app-muted) hover:text-(--app-text) disabled:cursor-not-allowed disabled:opacity-40",
                                                    onClick: ()=>{
                                                        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$dispatch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatchCancelOrder"])(o.id);
                                                    },
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                    lineNumber: 658,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 657,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, o.id, true, {
                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                        lineNumber: 649,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 647,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 636,
                        columnNumber: 13
                    }, this) : null,
                    tab === "orderHistory" ? histRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Empty, {
                        text: "There is no order history yet"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 679,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full min-h-0 flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex shrink-0 items-center gap-1.5 px-2 py-1.5",
                                children: [
                                    [
                                        {
                                            id: "all",
                                            label: "All",
                                            count: histRows.length
                                        },
                                        {
                                            id: "filled",
                                            label: "Filled",
                                            count: filledCount
                                        },
                                        {
                                            id: "cancelled",
                                            label: "Cancelled",
                                            count: cancelledCount
                                        },
                                        {
                                            id: "rejected",
                                            label: "Rejected",
                                            count: rejectedCount
                                        }
                                    ].map((f)=>{
                                        const on = orderFilter === f.id;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setOrderFilter(f.id),
                                            className: `h-[22px] rounded-[4px] px-2.5 text-[12px] ${on ? "bg-(--app-hover) text-(--app-text)" : "text-(--app-muted) hover:text-(--app-text)"}`,
                                            children: [
                                                f.label,
                                                f.count > 0 || f.id !== "rejected" ? ` ${f.count}` : ""
                                            ]
                                        }, f.id, true, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 693,
                                            columnNumber: 21
                                        }, this);
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableTools, {}, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 709,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                        lineNumber: 708,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 682,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-h-0 flex-1 overflow-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full min-w-[1280px] text-left text-[12px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "sticky top-0 bg-[var(--maws-panel)] text-(--app-muted)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Symbol"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 716,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Side"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 717,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 718,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Qty"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 719,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Limit price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Stop price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 721,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Fill price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 722,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 723,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Placing time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Closing time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Order ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 726,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Level ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Leverage"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 728,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Margin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 729,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 715,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 714,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: filteredOrders.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "border-t border-[#222222] text-(--app-text)",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SymbolChip, {
                                                                symbol: o.symbol
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                                lineNumber: 736,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 735,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: `px-2 py-1.5 ${o.side === "buy" ? "text-[#2962ff]" : "text-[#f23645]"}`,
                                                            children: o.side === "buy" ? "Buy" : "Sell"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 738,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 capitalize",
                                                            children: o.type
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 745,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5",
                                                            children: o.qty
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 746,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 text-(--app-muted)",
                                                            children: o.limitPrice != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(o.symbol, o.limitPrice) : ""
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 747,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 text-(--app-muted)",
                                                            children: o.stopPrice != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(o.symbol, o.stopPrice) : ""
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 752,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5",
                                                            children: o.fillPrice != null || o.status === "filled" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$feed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatPrice"])(o.symbol, o.fillPrice ?? o.price) : ""
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 757,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusTone, {
                                                                status: o.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                                lineNumber: 763,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 762,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 whitespace-nowrap text-(--app-text)",
                                                            children: formatStamp(o.time, stampTz)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 765,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 whitespace-nowrap text-(--app-text)",
                                                            children: formatStamp(o.closingTime ?? o.time, stampTz)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 768,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 font-mono text-[11px] text-(--app-muted)",
                                                            children: o.id
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 771,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 text-(--app-muted)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 774,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5",
                                                            children: o.leverage != null ? `${o.leverage}x` : "—"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 775,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 whitespace-nowrap",
                                                            children: o.margin != null ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(o.margin)} usd` : "—"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 778,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, o.id, true, {
                                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                    lineNumber: 734,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 732,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 713,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 712,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 681,
                        columnNumber: 13
                    }, this) : null,
                    tab === "balanceHistory" ? balanceRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Empty, {
                        text: "There is no balance history yet"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 794,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full min-h-0 flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex shrink-0 justify-end px-2 py-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableTools, {}, void 0, false, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 798,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 797,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-h-0 flex-1 overflow-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full min-w-[960px] text-left text-[12px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "sticky top-0 bg-[var(--maws-panel)] text-(--app-muted)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 804,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Balance before"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 805,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Realized PnL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 806,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Balance after"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Action"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 808,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 803,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 802,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: balanceRows.map((b)=>{
                                                const before = b.balanceAfter - b.amount;
                                                const isPnl = b.type === "realized_pnl";
                                                const pnlColor = b.amount > 0 ? "text-[#089981]" : b.amount < 0 ? "text-[#f23645]" : "text-(--app-text)";
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "border-t border-[#222222] text-(--app-text)",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 whitespace-nowrap",
                                                            children: formatStamp(b.time, stampTz)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 823,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(before)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 826,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: `px-2 py-1.5 whitespace-nowrap ${isPnl ? pnlColor : "text-(--app-muted)"}`,
                                                            children: isPnl ? `${b.amount < 0 ? "-" : ""}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(Math.abs(b.amount))} USD` : b.type === "deposit" || b.type === "withdrawal" ? `${b.amount < 0 ? "-" : ""}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(Math.abs(b.amount))} USD` : "—"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 827,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatNum"])(b.balanceAfter)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 834,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "max-w-[520px] px-2 py-1.5 text-[11px] leading-snug text-(--app-text)",
                                                            children: b.note
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, b.id, true, {
                                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                    lineNumber: 822,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 811,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 801,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 800,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 796,
                        columnNumber: 13
                    }, this) : null,
                    tab === "journal" ? journalRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Empty, {
                        text: "Your trading journal is empty"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 850,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full min-h-0 flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex shrink-0 justify-end px-2 py-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TableTools, {}, void 0, false, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 854,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 853,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-h-0 flex-1 overflow-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full min-w-[640px] text-left text-[12px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "sticky top-0 bg-[var(--maws-panel)] text-(--app-muted)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "w-[180px] px-2 py-1.5 font-normal",
                                                        children: "Time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 860,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-2 py-1.5 font-normal",
                                                        children: "Text"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                        lineNumber: 861,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                lineNumber: 859,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 858,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: journalRows.map((j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "border-t border-[#222222] text-(--app-text)",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 whitespace-nowrap align-top",
                                                            children: formatStamp(j.time, stampTz)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 867,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-2 py-1.5 leading-snug",
                                                            children: j.text
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                            lineNumber: 870,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, j.id, true, {
                                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                                    lineNumber: 866,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/PositionsPanel.tsx",
                                            lineNumber: 864,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/PositionsPanel.tsx",
                                    lineNumber: 857,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/trading/PositionsPanel.tsx",
                                lineNumber: 856,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/trading/PositionsPanel.tsx",
                        lineNumber: 852,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/trading/PositionsPanel.tsx",
                lineNumber: 554,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/trading/PositionsPanel.tsx",
        lineNumber: 456,
        columnNumber: 5
    }, this);
}
_s4(PositionsPanel, "r1a72QxHRkUDYUIxy22JrLebUaE=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$live$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveStore"],
        useTradingMetrics
    ];
});
_c8 = PositionsPanel;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "FreshnessBadge");
__turbopack_context__.k.register(_c1, "Metric");
__turbopack_context__.k.register(_c2, "PnlCell");
__turbopack_context__.k.register(_c3, "Empty");
__turbopack_context__.k.register(_c4, "StatusTone");
__turbopack_context__.k.register(_c5, "SymbolChip");
__turbopack_context__.k.register(_c6, "TableTools");
__turbopack_context__.k.register(_c7, "TradingMetrics");
__turbopack_context__.k.register(_c8, "PositionsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/trading/TradingSettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TradingSettingsModal",
    ()=>TradingSettingsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/symbol-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const LEVERAGE_OPTS = [
    1,
    2,
    3,
    5,
    10,
    15,
    20,
    25,
    50,
    75,
    100,
    125
];
function textsFromSettings(t) {
    return {
        margin: String(t.margin),
        marginPercent: String(t.marginPercent),
        tpPercent: String(t.tpPercent),
        slPercent: String(t.slPercent)
    };
}
/** Allow empty / partial numeric typing (e.g. "", ".", "1.", "0.5"). */ function isNumericDraft(raw) {
    return raw === "" || raw === "." || raw === "-" || /^-?\d*\.?\d*$/.test(raw);
}
function parsePositive(raw, fallback, min = 0.01) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, n);
}
function parseNonNeg(raw, fallback) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, n);
}
function TradingSettingsModal() {
    _s();
    const symbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradingSettingsModal.useAppStore[symbol]": (s)=>s.tradingSettingsSymbol
    }["TradingSettingsModal.useAppStore[symbol]"]);
    const setSymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradingSettingsModal.useAppStore[setSymbol]": (s)=>s.setTradingSettingsSymbol
    }["TradingSettingsModal.useAppStore[setSymbol]"]);
    const setSymbolTrading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "TradingSettingsModal.useAppStore[setSymbolTrading]": (s)=>s.setSymbolTrading
    }["TradingSettingsModal.useAppStore[setSymbolTrading]"]);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"]);
    const [texts, setTexts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "TradingSettingsModal.useState": ()=>textsFromSettings(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"])
    }["TradingSettingsModal.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradingSettingsModal.useEffect": ()=>{
            if (!symbol) return;
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSymbolTrading"])(symbol);
            setDraft(next);
            setTexts(textsFromSettings(next));
        }
    }["TradingSettingsModal.useEffect"], [
        symbol
    ]);
    if (!symbol) return null;
    const isPercent = draft.sizingMode === "percent";
    const marginText = isPercent ? texts.marginPercent : texts.margin;
    const setSizingMode = (sizingMode)=>{
        setDraft((d)=>({
                ...d,
                sizingMode
            }));
    };
    const setMarginUsed = (raw)=>{
        if (!isNumericDraft(raw)) return;
        setTexts((t)=>isPercent ? {
                ...t,
                marginPercent: raw
            } : {
                ...t,
                margin: raw
            });
    };
    const setTp = (raw)=>{
        if (!isNumericDraft(raw)) return;
        setTexts((t)=>({
                ...t,
                tpPercent: raw
            }));
    };
    const setSl = (raw)=>{
        if (!isNumericDraft(raw)) return;
        setTexts((t)=>({
                ...t,
                slPercent: raw
            }));
    };
    const save = ()=>{
        setSymbolTrading(symbol, {
            ...draft,
            margin: parsePositive(texts.margin, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].margin),
            marginPercent: parsePositive(texts.marginPercent, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].marginPercent),
            leverage: Math.max(1, Number(draft.leverage) || __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].leverage),
            tpPercent: parseNonNeg(texts.tpPercent, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].tpPercent),
            slPercent: parseNonNeg(texts.slPercent, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"].slPercent)
        });
        setSymbol(null);
    };
    const reset = ()=>{
        const next = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SYMBOL_TRADING"],
            leverage: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().chartSettings.defaultLeverage
        };
        setDraft(next);
        setTexts(textsFromSettings(next));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsOverlay"], {
        onClose: ()=>setSymbol(null),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsPanel"], {
            width: 420,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsHeader"], {
                    title: `Trading settings · ${symbol}`,
                    onClose: ()=>setSymbol(null)
                }, void 0, false, {
                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBody"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                            title: "POSITION SIZING",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                    label: "Default order type",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-full`,
                                            value: draft.defaultOrderType,
                                            onChange: (e)=>setDraft((d)=>({
                                                        ...d,
                                                        defaultOrderType: e.target.value
                                                    })),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "market",
                                                    children: "Market"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "limit",
                                                    children: "Limit"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                    label: "Sizing mode",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-full`,
                                            value: draft.sizingMode,
                                            onChange: (e)=>setSizingMode(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "fixed",
                                                    children: "Fixed margin"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "percent",
                                                    children: "% of equity"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                    label: "Margin used",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} w-full ${isPercent ? "pr-8" : ""}`,
                                                type: "text",
                                                inputMode: "decimal",
                                                autoComplete: "off",
                                                spellCheck: false,
                                                value: marginText,
                                                onChange: (e)=>setMarginUsed(e.target.value),
                                                onFocus: (e)=>e.currentTarget.select()
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this),
                                            isPercent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[13px] text-(--app-muted)",
                                                children: "%"
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                lineNumber: 168,
                                                columnNumber: 19
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                            title: "TRADE MANAGEMENT",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                    label: `Default leverage (${symbol})`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-full`,
                                            value: draft.leverage,
                                            onChange: (e)=>setDraft((d)=>({
                                                        ...d,
                                                        leverage: Number(e.target.value)
                                                    })),
                                            children: LEVERAGE_OPTS.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: n,
                                                    children: [
                                                        n,
                                                        "x"
                                                    ]
                                                }, n, true, {
                                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                            lineNumber: 179,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                        lineNumber: 178,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Attach take profit / stop loss",
                                    checked: draft.attachBrackets,
                                    onChange: (attachBrackets)=>setDraft((d)=>({
                                                ...d,
                                                attachBrackets
                                            }))
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 pl-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                            label: "Take profit (%)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} w-full`,
                                                type: "text",
                                                inputMode: "decimal",
                                                autoComplete: "off",
                                                spellCheck: false,
                                                disabled: !draft.attachBrackets,
                                                value: texts.tpPercent,
                                                onChange: (e)=>setTp(e.target.value),
                                                onFocus: (e)=>e.currentTarget.select()
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                            lineNumber: 200,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldStack"], {
                                            label: "Stop loss (%)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} w-full`,
                                                type: "text",
                                                inputMode: "decimal",
                                                autoComplete: "off",
                                                spellCheck: false,
                                                disabled: !draft.attachBrackets,
                                                value: texts.slPercent,
                                                onChange: (e)=>setSl(e.target.value),
                                                onFocus: (e)=>e.currentTarget.select()
                                            }, void 0, false, {
                                                fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                            lineNumber: 213,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Confirm before sending orders",
                                    checked: draft.confirmOrders,
                                    onChange: (confirmOrders)=>setDraft((d)=>({
                                                ...d,
                                                confirmOrders
                                            }))
                                }, void 0, false, {
                                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFooter"], {
                    left: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                        variant: "ghost",
                        onClick: reset,
                        children: "Reset"
                    }, void 0, false, {
                        fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                        lineNumber: 236,
                        columnNumber: 13
                    }, this),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                            onClick: ()=>setSymbol(null),
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                            variant: "primary",
                            onClick: save,
                            children: "Save"
                        }, void 0, false, {
                            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/trading/TradingSettingsModal.tsx",
                    lineNumber: 234,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/trading/TradingSettingsModal.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/trading/TradingSettingsModal.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(TradingSettingsModal, "uifBENuRAtNs57PYZLg7VAklzmI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = TradingSettingsModal;
var _c;
__turbopack_context__.k.register(_c, "TradingSettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_trading_0aeq9a0._.js.map