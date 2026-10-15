(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/settings/ColorPicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COLOR_PICKER_POPOVER_ATTR",
    ()=>COLOR_PICKER_POPOVER_ATTR,
    "COLOR_PRESETS",
    ()=>COLOR_PRESETS,
    "SettingsColorSwatch",
    ()=>SettingsColorSwatch,
    "parseColorValue",
    ()=>parseColorValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
/** Match settings panel chrome (`settingsUi`). */ const popoverShell = "overflow-hidden rounded-[8px] border border-(--app-border) bg-(--app-elevated) shadow-[0_8px_28px_rgba(0,0,0,0.65)]";
const divider = "h-px bg-(--app-hover)";
const labelClass = "text-[12px] text-(--app-muted)";
const inputClass = "h-7 min-w-0 rounded-[4px] border border-[#363a45] bg-(--app-hover) px-2 text-[12px] text-(--app-text) outline-none focus:border-[#787b86]";
const primaryBtnClass = "h-7 shrink-0 rounded-[4px] bg-white px-2.5 text-[12px] font-semibold text-black hover:bg-[#e0e3eb]";
const CUSTOM_KEY = "maws.custom-colors.v1";
const MAX_CUSTOM = 17;
const COLOR_PICKER_POPOVER_ATTR = "data-color-picker-popover";
const COLOR_PRESETS = [
    [
        "#ffffff",
        "#e0e3eb",
        "#b2b5be",
        "#9598a1",
        "#787b86",
        "#5d606b",
        "#434651",
        "#2a2e39",
        "#131722",
        "#000000"
    ],
    [
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50"
    ],
    [
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#795548",
        "#607d8b",
        "#f48fb1",
        "#ce93d8"
    ],
    [
        "#ef5350",
        "#ec407a",
        "#ab47bc",
        "#7e57c2",
        "#5c6bc0",
        "#42a5f5",
        "#29b6f6",
        "#26c6da",
        "#26a69a",
        "#66bb6a"
    ],
    [
        "#9ccc65",
        "#d4e157",
        "#ffee58",
        "#ffca28",
        "#ffa726",
        "#ff7043",
        "#8d6e63",
        "#78909c",
        "#f06292",
        "#ba68c8"
    ],
    [
        "#e57373",
        "#f06292",
        "#ba68c8",
        "#9575cd",
        "#7986cb",
        "#64b5f6",
        "#4fc3f7",
        "#4dd0e1",
        "#4db6ac",
        "#81c784"
    ],
    [
        "#aed581",
        "#dce775",
        "#fff176",
        "#ffd54f",
        "#ffb74d",
        "#ff8a65",
        "#a1887f",
        "#90a4ae",
        "#f48fb1",
        "#ce93d8"
    ],
    [
        "#ef9a9a",
        "#f48fb1",
        "#ce93d8",
        "#b39ddb",
        "#9fa8da",
        "#90caf9",
        "#81d4fa",
        "#80deea",
        "#80cbc4",
        "#a5d6a7"
    ]
];
function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}
function normalizeHex(input) {
    let s = input.trim().replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(s)) {
        s = s.split("").map((c)=>c + c).join("");
    }
    if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
    return `#${s.toLowerCase()}`;
}
function hexToRgb(hex) {
    const n = normalizeHex(hex);
    if (!n) return null;
    return {
        r: parseInt(n.slice(1, 3), 16),
        g: parseInt(n.slice(3, 5), 16),
        b: parseInt(n.slice(5, 7), 16)
    };
}
function rgbToHex(r, g, b) {
    const to = (n)=>clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    return `#${to(r)}${to(g)}${to(b)}`;
}
function rgbToHsva(r, g, b, a) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === r) h = (g - b) / d % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    return {
        h,
        s: s * 100,
        v: max * 100,
        a
    };
}
function hsvaToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    let rp = 0;
    let gp = 0;
    let bp = 0;
    if (h < 60) [rp, gp, bp] = [
        c,
        x,
        0
    ];
    else if (h < 120) [rp, gp, bp] = [
        x,
        c,
        0
    ];
    else if (h < 180) [rp, gp, bp] = [
        0,
        c,
        x
    ];
    else if (h < 240) [rp, gp, bp] = [
        0,
        x,
        c
    ];
    else if (h < 300) [rp, gp, bp] = [
        x,
        0,
        c
    ];
    else [rp, gp, bp] = [
        c,
        0,
        x
    ];
    return {
        r: (rp + m) * 255,
        g: (gp + m) * 255,
        b: (bp + m) * 255
    };
}
function hsvaToHex(hsva) {
    const { r, g, b } = hsvaToRgb(hsva.h, hsva.s, hsva.v);
    return rgbToHex(r, g, b);
}
function parseColorValue(value, opacityFallback = 100) {
    if (!value) return {
        hex: "#787b86",
        opacity: opacityFallback
    };
    const trimmed = value.trim();
    const rgba = trimmed.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i) ?? null;
    if (rgba) {
        const r = Number(rgba[1]);
        const g = Number(rgba[2]);
        const b = Number(rgba[3]);
        const a = rgba[4] != null ? Number(rgba[4]) : 1;
        return {
            hex: rgbToHex(r, g, b),
            opacity: clamp(Math.round(a * 100), 0, 100)
        };
    }
    const hex = normalizeHex(trimmed);
    if (hex) return {
        hex,
        opacity: opacityFallback
    };
    return {
        hex: "#787b86",
        opacity: opacityFallback
    };
}
function loadCustomColors() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(CUSTOM_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.map((c)=>typeof c === "string" ? normalizeHex(c) : null).filter((c)=>Boolean(c)).slice(0, MAX_CUSTOM);
    } catch  {
        return [];
    }
}
function saveCustomColors(colors) {
    try {
        localStorage.setItem(CUSTOM_KEY, JSON.stringify(colors.slice(0, MAX_CUSTOM)));
    } catch  {
    /* ignore */ }
}
function checkerStyle(color) {
    return {
        backgroundImage: `
      linear-gradient(${color}, ${color}),
      linear-gradient(45deg, #2a2e39 25%, transparent 25%),
      linear-gradient(-45deg, #2a2e39 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #2a2e39 75%),
      linear-gradient(-45deg, transparent 75%, #2a2e39 75%)
    `,
        backgroundSize: "100% 100%, 8px 8px, 8px 8px, 8px 8px, 8px 8px",
        backgroundPosition: "0 0, 0 0, 0 4px, 4px -4px, -4px 0"
    };
}
function SwatchButton({ color, selected, onClick, title }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        title: title ?? color,
        onClick: onClick,
        className: `aspect-square w-full rounded-[2px] border ${selected ? "border-white ring-1 ring-[#2a2e39]" : "border-[#1b1b1b] hover:border-[#787b86]"}`,
        style: {
            backgroundColor: color
        }
    }, void 0, false, {
        fileName: "[project]/components/settings/ColorPicker.tsx",
        lineNumber: 200,
        columnNumber: 5
    }, this);
}
_c = SwatchButton;
function CustomColorEditor({ initialHex, onAdd, onClose }) {
    _s();
    const rgb0 = hexToRgb(initialHex) ?? {
        r: 41,
        g: 98,
        b: 255
    };
    const [hsva, setHsva] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CustomColorEditor.useState": ()=>rgbToHsva(rgb0.r, rgb0.g, rgb0.b, 1)
    }["CustomColorEditor.useState"]);
    const [hexText, setHexText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CustomColorEditor.useState": ()=>hsvaToHex(hsva).toUpperCase()
    }["CustomColorEditor.useState"]);
    const svRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hsvaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(hsva);
    hsvaRef.current = hsva;
    const syncHex = (next)=>{
        setHsva(next);
        setHexText(hsvaToHex(next).toUpperCase());
    };
    const applyHexText = (raw)=>{
        setHexText(raw);
        const n = normalizeHex(raw);
        if (!n) return;
        const rgb = hexToRgb(n);
        if (!rgb) return;
        syncHex(rgbToHsva(rgb.r, rgb.g, rgb.b, hsvaRef.current.a));
    };
    const pickSv = (clientX, clientY)=>{
        const el = svRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const s = clamp((clientX - rect.left) / rect.width * 100, 0, 100);
        const v = clamp(100 - (clientY - rect.top) / rect.height * 100, 0, 100);
        syncHex({
            ...hsvaRef.current,
            s,
            v
        });
    };
    const pickHue = (clientY)=>{
        const el = hueRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const h = clamp((clientY - rect.top) / rect.height * 360, 0, 359.99);
        syncHex({
            ...hsvaRef.current,
            h
        });
    };
    const bindDrag = (move, e)=>{
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        move(e.nativeEvent);
        const onMove = (ev)=>move(ev);
        const onUp = ()=>{
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    };
    const pure = hsvaToHex({
        ...hsva,
        s: 100,
        v: 100
    });
    const current = hsvaToHex(hsva);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `box-border w-[228px] p-2.5 ${popoverShell}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2.5 flex items-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-7 w-7 shrink-0 rounded-[4px] border border-[#363a45]",
                        style: {
                            backgroundColor: current
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/settings/ColorPicker.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: `${inputClass} flex-1 focus:border-white`,
                        value: hexText,
                        onChange: (e)=>applyHexText(e.target.value),
                        onKeyDown: (e)=>{
                            if (e.key === "Enter") {
                                const n = normalizeHex(hexText);
                                if (n) onAdd(n);
                            } else if (e.key === "Escape") onClose();
                        },
                        spellCheck: false
                    }, void 0, false, {
                        fileName: "[project]/components/settings/ColorPicker.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: primaryBtnClass,
                        onClick: ()=>onAdd(normalizeHex(hexText) ?? current),
                        children: "Add"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/ColorPicker.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/ColorPicker.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: svRef,
                        className: "relative h-[148px] min-w-0 flex-1 cursor-crosshair rounded-[4px] border border-(--app-border)",
                        style: {
                            background: `
              linear-gradient(to top, #000, transparent),
              linear-gradient(to right, #fff, ${pure})
            `
                        },
                        onPointerDown: (e)=>bindDrag((ev)=>pickSv(ev.clientX, ev.clientY), e),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.45)]",
                            style: {
                                left: `${hsva.s}%`,
                                top: `${100 - hsva.v}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/settings/ColorPicker.tsx",
                            lineNumber: 317,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/ColorPicker.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: hueRef,
                        className: "relative h-[148px] w-3.5 shrink-0 cursor-ns-resize rounded-[4px] border border-(--app-border)",
                        style: {
                            background: "linear-gradient(to bottom, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
                        },
                        onPointerDown: (e)=>bindDrag((ev)=>pickHue(ev.clientY), e),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-none absolute left-1/2 h-2.5 w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border-2 border-white bg-transparent shadow-[0_0_0_1px_rgba(0,0,0,0.45)]",
                            style: {
                                top: `${hsva.h / 360 * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/settings/ColorPicker.tsx",
                            lineNumber: 331,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/ColorPicker.tsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/ColorPicker.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/ColorPicker.tsx",
        lineNumber: 278,
        columnNumber: 5
    }, this);
}
_s(CustomColorEditor, "ztoPxg/t2/GMi8MaQbYKliYve70=");
_c1 = CustomColorEditor;
function SettingsColorSwatch({ value, onChange, opacity: opacityProp, onOpacityChange, showOpacity = true, disabled }) {
    _s1();
    const parsed = parseColorValue(value, opacityProp ?? 100);
    const hex = parsed.hex;
    const opacity = opacityProp ?? parsed.opacity;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customOpen, setCustomOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customColors, setCustomColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const btnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const popRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsColorSwatch.useEffect": ()=>{
            setCustomColors(loadCustomColors());
        }
    }["SettingsColorSwatch.useEffect"], []);
    const place = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsColorSwatch.useCallback[place]": ()=>{
            const btn = btnRef.current;
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            const pad = 8;
            const width = customOpen ? 240 : 212;
            const height = customOpen ? 220 : showOpacity ? 290 : 236;
            let left = rect.left;
            let top = rect.bottom + 6;
            if (left + width > window.innerWidth - pad) left = window.innerWidth - width - pad;
            if (left < pad) left = pad;
            if (top + height > window.innerHeight - pad) {
                top = Math.max(pad, rect.top - height - 6);
            }
            setPos({
                top,
                left
            });
        }
    }["SettingsColorSwatch.useCallback[place]"], [
        customOpen,
        showOpacity
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SettingsColorSwatch.useLayoutEffect": ()=>{
            if (!open) return;
            place();
        }
    }["SettingsColorSwatch.useLayoutEffect"], [
        open,
        place
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsColorSwatch.useEffect": ()=>{
            if (!open) return;
            const onDown = {
                "SettingsColorSwatch.useEffect.onDown": (e)=>{
                    const t = e.target;
                    if (btnRef.current?.contains(t)) return;
                    if (popRef.current?.contains(t)) return;
                    setOpen(false);
                    setCustomOpen(false);
                }
            }["SettingsColorSwatch.useEffect.onDown"];
            const onKey = {
                "SettingsColorSwatch.useEffect.onKey": (e)=>{
                    if (e.key === "Escape") {
                        if (customOpen) setCustomOpen(false);
                        else setOpen(false);
                    }
                }
            }["SettingsColorSwatch.useEffect.onKey"];
            const onScroll = {
                "SettingsColorSwatch.useEffect.onScroll": ()=>place()
            }["SettingsColorSwatch.useEffect.onScroll"];
            // Capture phase so it still fires when settings panels stopPropagation on bubble.
            window.addEventListener("mousedown", onDown, true);
            window.addEventListener("keydown", onKey);
            window.addEventListener("resize", onScroll);
            window.addEventListener("scroll", onScroll, true);
            return ({
                "SettingsColorSwatch.useEffect": ()=>{
                    window.removeEventListener("mousedown", onDown, true);
                    window.removeEventListener("keydown", onKey);
                    window.removeEventListener("resize", onScroll);
                    window.removeEventListener("scroll", onScroll, true);
                }
            })["SettingsColorSwatch.useEffect"];
        }
    }["SettingsColorSwatch.useEffect"], [
        open,
        customOpen,
        place
    ]);
    const emitColor = (nextHex)=>{
        onChange(nextHex);
    };
    const emitOpacity = (next)=>{
        const o = clamp(Math.round(next), 0, 100);
        if (onOpacityChange) {
            onOpacityChange(o);
            return;
        }
        const rgb = hexToRgb(hex);
        if (!rgb) return;
        if (o >= 100) onChange(hex);
        else onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(o / 100).toFixed(2)})`);
    };
    const addCustom = (nextHex)=>{
        const n = normalizeHex(nextHex);
        if (!n) return;
        setCustomColors((prev)=>{
            const next = [
                n,
                ...prev.filter((c)=>c !== n)
            ].slice(0, MAX_CUSTOM);
            saveCustomColors(next);
            return next;
        });
        emitColor(n);
        setCustomOpen(false);
    };
    const preview = opacity >= 100 ? hex : (()=>{
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
    })();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: btnRef,
                type: "button",
                disabled: disabled,
                title: hex,
                "aria-expanded": open,
                onClick: ()=>{
                    if (disabled) return;
                    setOpen((v)=>!v);
                    setCustomOpen(false);
                },
                className: `h-7 w-7 shrink-0 rounded-[4px] border ${open ? "border-white" : "border-[#363a45]"} ${disabled ? "pointer-events-none opacity-40" : "hover:border-[#787b86]"}`,
                style: checkerStyle(preview)
            }, void 0, false, {
                fileName: "[project]/components/settings/ColorPicker.tsx",
                lineNumber: 463,
                columnNumber: 7
            }, this),
            open && typeof document !== "undefined" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: popRef,
                "data-color-picker-popover": "",
                className: "fixed z-[200]",
                style: {
                    top: pos.top,
                    left: pos.left
                },
                onMouseDown: (e)=>e.stopPropagation(),
                onClick: (e)=>e.stopPropagation(),
                children: customOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomColorEditor, {
                    initialHex: hex,
                    onAdd: addCustom,
                    onClose: ()=>setCustomOpen(false)
                }, void 0, false, {
                    fileName: "[project]/components/settings/ColorPicker.tsx",
                    lineNumber: 491,
                    columnNumber: 17
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `box-border w-[200px] p-2.5 ${popoverShell}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-10 gap-[2px]",
                            children: COLOR_PRESETS.flatMap((row, ri)=>row.map((c, ci)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchButton, {
                                        color: c,
                                        selected: normalizeHex(hex) === normalizeHex(c),
                                        onClick: ()=>emitColor(c)
                                    }, `${ri}-${ci}-${c}`, false, {
                                        fileName: "[project]/components/settings/ColorPicker.tsx",
                                        lineNumber: 501,
                                        columnNumber: 25
                                    }, this)))
                        }, void 0, false, {
                            fileName: "[project]/components/settings/ColorPicker.tsx",
                            lineNumber: 498,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `my-2.5 ${divider}`
                        }, void 0, false, {
                            fileName: "[project]/components/settings/ColorPicker.tsx",
                            lineNumber: 511,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-10 gap-[2px]",
                            children: [
                                customColors.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchButton, {
                                        color: c,
                                        selected: normalizeHex(hex) === normalizeHex(c),
                                        onClick: ()=>emitColor(c)
                                    }, c, false, {
                                        fileName: "[project]/components/settings/ColorPicker.tsx",
                                        lineNumber: 515,
                                        columnNumber: 23
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    title: "Add custom color",
                                    onMouseDown: (e)=>{
                                        e.stopPropagation();
                                    },
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCustomOpen(true);
                                    },
                                    className: "flex aspect-square w-full items-center justify-center rounded-[2px] border border-[#363a45] bg-(--app-hover) text-[13px] leading-none text-(--app-text) hover:border-[#787b86] hover:bg-(--app-hover) hover:text-white",
                                    children: "+"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ColorPicker.tsx",
                                    lineNumber: 522,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/ColorPicker.tsx",
                            lineNumber: 513,
                            columnNumber: 19
                        }, this),
                        showOpacity ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `mb-1.5 ${labelClass}`,
                                    children: "Opacity"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ColorPicker.tsx",
                                    lineNumber: 541,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative h-2 min-w-0 flex-1 overflow-hidden rounded-full border border-(--app-border)",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 rounded-full",
                                                    style: {
                                                        backgroundImage: `
                                linear-gradient(to right, transparent, ${hex}),
                                linear-gradient(45deg, #2a2e39 25%, transparent 25%),
                                linear-gradient(-45deg, #2a2e39 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #2a2e39 75%),
                                linear-gradient(-45deg, transparent 75%, #2a2e39 75%)
                              `,
                                                        backgroundSize: "100% 100%, 6px 6px, 6px 6px, 6px 6px, 6px 6px",
                                                        backgroundPosition: "0 0, 0 0, 0 3px, 3px -3px, -3px 0"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/ColorPicker.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: 0,
                                                    max: 100,
                                                    value: opacity,
                                                    onChange: (e)=>emitOpacity(Number(e.target.value)),
                                                    className: "absolute inset-0 w-full cursor-pointer appearance-none bg-transparent accent-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-(--app-border) [&::-webkit-slider-thumb]:bg-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/ColorPicker.tsx",
                                                    lineNumber: 558,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/ColorPicker.tsx",
                                            lineNumber: 543,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: `${inputClass} w-[52px] shrink-0 px-1 text-center`,
                                            value: `${opacity}%`,
                                            onChange: (e)=>{
                                                const n = Number(e.target.value.replace(/%/g, ""));
                                                if (Number.isFinite(n)) emitOpacity(n);
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/ColorPicker.tsx",
                                            lineNumber: 567,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/ColorPicker.tsx",
                                    lineNumber: 542,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/ColorPicker.tsx",
                            lineNumber: 540,
                            columnNumber: 21
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/ColorPicker.tsx",
                    lineNumber: 497,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/ColorPicker.tsx",
                lineNumber: 482,
                columnNumber: 13
            }, this), document.body) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/ColorPicker.tsx",
        lineNumber: 462,
        columnNumber: 5
    }, this);
}
_s1(SettingsColorSwatch, "Kv1hTM2staDuNjkpCZ0pgeqyk64=");
_c2 = SettingsColorSwatch;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SwatchButton");
__turbopack_context__.k.register(_c1, "CustomColorEditor");
__turbopack_context__.k.register(_c2, "SettingsColorSwatch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/settings/DrawingSettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawingSettingsModal",
    ()=>DrawingSettingsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$VisibilitySettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/VisibilitySettingsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/ColorPicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/drawings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/maws/universe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trading/symbol-settings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visibility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.mjs [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
const inputClass = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].inputSm;
function toDraft(d, defaults) {
    return {
        color: d.color || ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositionTool"])(d.tool) ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_POSITION_LINE_COLOR"] : d.tool === "rect" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RECT_BORDER_COLOR"] : d.tool === "circle" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CIRCLE_BORDER_COLOR"] : "#2962ff"),
        lineWidth: d.lineWidth ?? 2,
        lineStyle: d.lineStyle ?? "solid",
        extend: d.extend ?? "none",
        showMiddlePoint: Boolean(d.showMiddlePoint),
        showPriceLabels: Boolean(d.showPriceLabels),
        fillColor: d.fillColor ?? (d.tool === "circle" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CIRCLE_FILL_COLOR"] : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RECT_FILL_COLOR"]),
        fillVisible: d.fillVisible ?? d.tool !== "circle",
        middleLineColor: d.middleLineColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RECT_MIDDLE_LINE_COLOR"],
        middleLineStyle: d.middleLineStyle ?? "dashed",
        text: d.text ?? "",
        textColor: d.textColor ?? "#ffffff",
        textSize: d.textSize ?? ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositionTool"])(d.tool) ? 11 : 14),
        textBold: Boolean(d.textBold),
        textItalic: Boolean(d.textItalic),
        textAlignV: d.textAlignV ?? "top",
        textAlignH: d.textAlignH ?? "left",
        points: d.points.map((p)=>({
                ...p
            })),
        visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(d.visibility),
        stopColor: d.stopColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_POSITION_STOP_COLOR"],
        targetColor: d.targetColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_POSITION_TARGET_COLOR"],
        compactStats: d.compactStats ?? true,
        alwaysShowStats: d.alwaysShowStats ?? false,
        positionStats: d.positionStats ? [
            ...d.positionStats
        ] : [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALL_POSITION_STATS"]
        ],
        positionAccountSizeMode: d.positionAccountSizeMode ?? "default",
        positionAccountSize: d.positionAccountSize ?? defaults.accountSize,
        positionLotSize: d.positionLotSize ?? defaults.lotSize,
        positionRisk: d.positionRisk ?? defaults.risk,
        positionRiskUnit: d.positionRiskUnit ?? defaults.riskUnit,
        positionLeverage: d.positionLeverage ?? defaults.leverage,
        positionQtyPrecision: d.positionQtyPrecision ?? "default",
        fibTrendVisible: d.fibTrendVisible ?? true,
        fibTrendColor: d.fibTrendColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FIB_TREND_COLOR"],
        fibTrendStyle: d.fibTrendStyle ?? "dashed",
        fibLevels: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneFibLevels"])(d.fibLevels),
        fibUseOneColor: Boolean(d.fibUseOneColor),
        fibOneColor: d.fibOneColor ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FIB_ONE_COLOR"],
        fibBackground: Boolean(d.fibBackground),
        fibBackgroundOpacity: d.fibBackgroundOpacity ?? 20,
        fibReverse: Boolean(d.fibReverse),
        fibShowPrices: Boolean(d.fibShowPrices),
        fibShowLevels: d.fibShowLevels ?? true,
        fibLevelsFormat: d.fibLevelsFormat ?? "percents",
        fibLabelH: d.fibLabelH ?? "right",
        fibLabelV: d.fibLabelV ?? "middle",
        fibShowText: Boolean(d.fibShowText),
        fibLogScale: Boolean(d.fibLogScale)
    };
}
function drawingPatchFromDraft(next) {
    return {
        color: next.color,
        lineWidth: next.lineWidth,
        lineStyle: next.lineStyle,
        extend: next.extend,
        showMiddlePoint: next.showMiddlePoint,
        showPriceLabels: next.showPriceLabels,
        fillColor: next.fillColor,
        fillVisible: next.fillVisible,
        middleLineColor: next.middleLineColor,
        middleLineStyle: next.middleLineStyle,
        text: next.text,
        textColor: next.textColor,
        textSize: next.textSize,
        textBold: next.textBold,
        textItalic: next.textItalic,
        textAlignV: next.textAlignV,
        textAlignH: next.textAlignH,
        points: next.points,
        visibility: next.visibility,
        stopColor: next.stopColor,
        targetColor: next.targetColor,
        compactStats: next.compactStats,
        alwaysShowStats: next.alwaysShowStats,
        positionStats: next.positionStats,
        positionAccountSizeMode: next.positionAccountSizeMode,
        positionAccountSize: next.positionAccountSize,
        positionLotSize: next.positionLotSize,
        positionRisk: next.positionRisk,
        positionRiskUnit: next.positionRiskUnit,
        positionLeverage: next.positionLeverage,
        positionQtyPrecision: next.positionQtyPrecision,
        fibTrendVisible: next.fibTrendVisible,
        fibTrendColor: next.fibTrendColor,
        fibTrendStyle: next.fibTrendStyle,
        fibLevels: next.fibLevels,
        fibUseOneColor: next.fibUseOneColor,
        fibOneColor: next.fibOneColor,
        fibBackground: next.fibBackground,
        fibBackgroundOpacity: next.fibBackgroundOpacity,
        fibReverse: next.fibReverse,
        fibShowPrices: next.fibShowPrices,
        fibShowLevels: next.fibShowLevels,
        fibLevelsFormat: next.fibLevelsFormat,
        fibLabelH: next.fibLabelH,
        fibLabelV: next.fibLabelV,
        fibShowText: next.fibShowText,
        fibLogScale: next.fibLogScale
    };
}
function StatsMultiSelect({ value, onChange }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const selected = new Set(value);
    const summary = value.length === 0 ? "None" : value.length === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALL_POSITION_STATS"].length ? "All" : value.map((k)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POSITION_STAT_LABELS"][k]).join(", ");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StatsMultiSelect.useEffect": ()=>{
            if (!open) return;
            const onDown = {
                "StatsMultiSelect.useEffect.onDown": (e)=>{
                    if (!rootRef.current?.contains(e.target)) setOpen(false);
                }
            }["StatsMultiSelect.useEffect.onDown"];
            window.addEventListener("mousedown", onDown);
            return ({
                "StatsMultiSelect.useEffect": ()=>window.removeEventListener("mousedown", onDown)
            })["StatsMultiSelect.useEffect"];
        }
    }["StatsMultiSelect.useEffect"], [
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: "relative min-w-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} flex w-[220px] max-w-full items-center justify-between gap-2 text-left`,
                onClick: ()=>setOpen((v)=>!v),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: summary
                    }, void 0, false, {
                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "shrink-0 text-[10px] text-(--app-muted)",
                        children: "▾"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-[calc(100%+4px)] right-0 z-20 max-h-[240px] w-[240px] overflow-y-auto rounded-[6px] border border-[#363a45] bg-(--app-elevated) py-1 shadow-[0_8px_28px_rgba(0,0,0,0.65)]",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ALL_POSITION_STATS"].map((key)=>{
                    const on = selected.has(key);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[12px] text-(--app-text) hover:bg-(--app-hover)",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                className: "accent-[#2962ff]",
                                checked: on,
                                onChange: ()=>{
                                    if (on) onChange(value.filter((k)=>k !== key));
                                    else onChange([
                                        ...value,
                                        key
                                    ]);
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                lineNumber: 285,
                                columnNumber: 17
                            }, this),
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POSITION_STAT_LABELS"][key]
                        ]
                    }, key, true, {
                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                        lineNumber: 281,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                lineNumber: 277,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
        lineNumber: 267,
        columnNumber: 5
    }, this);
}
_s(StatsMultiSelect, "G2BV1pZrz+1GzCpP8X8+Oinj/0Y=");
_c = StatsMultiSelect;
function DrawingSettingsModal() {
    _s1();
    const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingSettingsModal.useAppStore[target]": (s)=>s.drawingSettingsTarget
    }["DrawingSettingsModal.useAppStore[target]"]);
    const setTarget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingSettingsModal.useAppStore[setTarget]": (s)=>s.setDrawingSettingsTarget
    }["DrawingSettingsModal.useAppStore[setTarget]"]);
    const panes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingSettingsModal.useAppStore[panes]": (s)=>s.panes
    }["DrawingSettingsModal.useAppStore[panes]"]);
    const mockBalance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingSettingsModal.useAppStore[mockBalance]": (s)=>s.mockBalance
    }["DrawingSettingsModal.useAppStore[mockBalance]"]);
    const updateDrawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "DrawingSettingsModal.useAppStore[updateDrawing]": (s)=>s.updateDrawing
    }["DrawingSettingsModal.useAppStore[updateDrawing]"]);
    const [genericTab, setGenericTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("style");
    const [fibTab, setFibTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("style");
    const [positionTab, setPositionTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("inputs");
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const snapshotRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const boxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [dragged, setDragged] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DrawingSettingsModal.useMemo[pane]": ()=>{
            if (!target) return null;
            return panes.find({
                "DrawingSettingsModal.useMemo[pane]": (p)=>p.id === target.paneId
            }["DrawingSettingsModal.useMemo[pane]"]) ?? null;
        }
    }["DrawingSettingsModal.useMemo[pane]"], [
        target,
        panes
    ]);
    const drawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DrawingSettingsModal.useMemo[drawing]": ()=>{
            if (!target || !pane) return null;
            return pane.drawings.find({
                "DrawingSettingsModal.useMemo[drawing]": (d)=>d.id === target.drawingId
            }["DrawingSettingsModal.useMemo[drawing]"]) ?? null;
        }
    }["DrawingSettingsModal.useMemo[drawing]"], [
        target,
        pane
    ]);
    const trading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DrawingSettingsModal.useMemo[trading]": ()=>pane ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSymbolTrading"])(pane.symbol) : null
    }["DrawingSettingsModal.useMemo[trading]"], [
        pane
    ]);
    const inputDefaults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DrawingSettingsModal.useMemo[inputDefaults]": ()=>({
                accountSize: mockBalance,
                lotSize: trading?.margin ?? 100,
                risk: trading?.sizingMode === "percent" ? trading?.marginPercent ?? 1 : trading?.margin ?? 100,
                riskUnit: trading?.sizingMode === "percent" ? "percent" : "money",
                leverage: trading?.leverage ?? 10
            })
    }["DrawingSettingsModal.useMemo[inputDefaults]"], [
        mockBalance,
        trading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawingSettingsModal.useEffect": ()=>{
            if (!drawing) {
                setDraft(null);
                snapshotRef.current = null;
                return;
            }
            const t = pane ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trading$2f$symbol$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveSymbolTrading"])(pane.symbol) : null;
            const defaults = {
                accountSize: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().mockBalance,
                lotSize: t?.margin ?? 100,
                risk: t?.sizingMode === "percent" ? t?.marginPercent ?? 1 : t?.margin ?? 100,
                riskUnit: t?.sizingMode === "percent" ? "percent" : "money",
                leverage: t?.leverage ?? 10
            };
            const next = toDraft(drawing, defaults);
            setDraft(next);
            snapshotRef.current = next;
            setDragged(false);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositionTool"])(drawing.tool)) setPositionTab("inputs");
            else if (drawing.tool === "fib") setFibTab("style");
            else setGenericTab("style");
        // Only re-seed when opening a different drawing — not when live account values tick.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["DrawingSettingsModal.useEffect"], [
        drawing?.id,
        target?.paneId,
        target?.drawingId
    ]);
    if (!target || !drawing || !draft || !pane) return null;
    const title = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DRAW_LABEL"][drawing.tool] ?? drawing.tool;
    const positionSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositionTool"])(drawing.tool) ? drawing.tool : null;
    const isPosition = positionSide != null;
    const isFib = drawing.tool === "fib";
    const close = ()=>setTarget(null);
    const push = (next)=>{
        setDraft(next);
        updateDrawing(target.paneId, target.drawingId, drawingPatchFromDraft(next));
    };
    const patch = (partial)=>push({
            ...draft,
            ...partial
        });
    const cancel = ()=>{
        const snap = snapshotRef.current;
        if (snap) {
            updateDrawing(target.paneId, target.drawingId, drawingPatchFromDraft(snap));
        }
        close();
    };
    const apply = ()=>close();
    const startDrag = (event)=>{
        if (event.target.closest("button")) return;
        event.preventDefault();
        const rect = boxRef.current?.getBoundingClientRect();
        const originX = rect?.left ?? pos.x;
        const originY = rect?.top ?? pos.y;
        setDragged(true);
        setPos({
            x: originX,
            y: originY
        });
        const startX = event.clientX - originX;
        const startY = event.clientY - originY;
        const move = (ev)=>{
            const x = Math.min(window.innerWidth - 80, Math.max(8, ev.clientX - startX));
            const y = Math.min(window.innerHeight - 48, Math.max(8, ev.clientY - startY));
            setPos({
                x,
                y
            });
        };
        const up = ()=>{
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };
    const dashFor = (style)=>{
        if (style === "dashed") return "6 4";
        if (style === "dotted") return "2 3";
        return undefined;
    };
    const anchors = isPosition ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionAnchors"])(draft.points) : null;
    const tick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionTickSize"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$maws$2f$universe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSymbol"])(pane.symbol).precision);
    const entryPrice = anchors?.entry.price ?? 0;
    const targetPrice = anchors?.target.price ?? 0;
    const stopPrice = anchors?.stop.price ?? 0;
    const tpMove = Math.abs(targetPrice - entryPrice);
    const slMove = Math.abs(stopPrice - entryPrice);
    const tpTicks = tick > 0 ? Math.round(tpMove / tick) : 0;
    const slTicks = tick > 0 ? Math.round(slMove / tick) : 0;
    const setPositionPrices = (entry, target, stop)=>{
        patch({
            points: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withPositionPrices"])(draft.points, entry, target, stop)
        });
    };
    const accountDisplay = draft.positionAccountSizeMode === "default" ? inputDefaults.accountSize : draft.positionAccountSize;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsOverlay"], {
        onClose: close,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsPanel"], {
            width: isPosition ? 420 : isFib ? 480 : 460,
            panelRef: boxRef,
            style: dragged ? {
                position: "fixed",
                left: pos.x,
                top: pos.y,
                margin: 0
            } : undefined,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsHeader"], {
                    title: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            title,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                size: 13,
                                className: "text-(--app-muted)"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                lineNumber: 464,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                        lineNumber: 462,
                        columnNumber: 13
                    }, this),
                    onClose: close,
                    onMouseDown: startDrag
                }, void 0, false, {
                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                    lineNumber: 460,
                    columnNumber: 9
                }, this),
                isPosition ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsTabs"], {
                    tabs: [
                        "inputs",
                        "style",
                        "visibility"
                    ],
                    value: positionTab,
                    onChange: setPositionTab
                }, void 0, false, {
                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                    lineNumber: 471,
                    columnNumber: 11
                }, this) : isFib ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsTabs"], {
                    tabs: [
                        "style",
                        "coordinates",
                        "visibility"
                    ],
                    value: fibTab,
                    onChange: setFibTab
                }, void 0, false, {
                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                    lineNumber: 477,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsTabs"], {
                    tabs: [
                        "style",
                        "text",
                        "coordinates",
                        "visibility"
                    ],
                    value: genericTab,
                    onChange: setGenericTab
                }, void 0, false, {
                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                    lineNumber: 483,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBody"], {
                    className: "min-h-[220px] max-h-[min(60vh,420px)]",
                    children: [
                        isPosition && positionTab === "inputs" && anchors && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Account size",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                type: "number",
                                                min: 0,
                                                step: "any",
                                                disabled: draft.positionAccountSizeMode === "default",
                                                value: accountDisplay,
                                                onChange: (e)=>patch({
                                                        positionAccountSizeMode: "custom",
                                                        positionAccountSize: Math.max(0, Number(e.target.value) || 0)
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 494,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[100px]`,
                                                    value: draft.positionAccountSizeMode,
                                                    onChange: (e)=>{
                                                        const mode = e.target.value;
                                                        patch({
                                                            positionAccountSizeMode: mode,
                                                            positionAccountSize: mode === "default" ? inputDefaults.accountSize : draft.positionAccountSize
                                                        });
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "default",
                                                            children: "Default"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 523,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "custom",
                                                            children: "Custom"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 524,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 509,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 508,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 493,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 492,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Lot size",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: inputClass,
                                        type: "number",
                                        min: 0,
                                        step: "any",
                                        value: draft.positionLotSize,
                                        onChange: (e)=>patch({
                                                positionLotSize: Math.max(0, Number(e.target.value) || 0)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 531,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 530,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Risk",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                type: "number",
                                                min: 0,
                                                step: "any",
                                                value: draft.positionRisk,
                                                onChange: (e)=>patch({
                                                        positionRisk: Math.max(0, Number(e.target.value) || 0)
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 545,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[72px]`,
                                                    value: draft.positionRiskUnit,
                                                    onChange: (e)=>patch({
                                                            positionRiskUnit: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "percent",
                                                            children: "%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "money",
                                                            children: "Cash"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 564,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 555,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 544,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 543,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Entry price",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: inputClass,
                                        type: "number",
                                        step: "any",
                                        value: entryPrice,
                                        onChange: (e)=>{
                                            const entry = Number(e.target.value) || 0;
                                            setPositionPrices(entry, targetPrice, stopPrice);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 571,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 570,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Leverage",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: inputClass,
                                        type: "number",
                                        min: 1,
                                        step: "any",
                                        value: draft.positionLeverage,
                                        onChange: (e)=>patch({
                                                positionLeverage: Math.max(1, Number(e.target.value) || 1)
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 584,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 583,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].sectionTitle,
                                            children: "PROFIT LEVEL"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 599,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                            label: "Ticks",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                type: "number",
                                                min: 0,
                                                step: 1,
                                                value: tpTicks,
                                                onChange: (e)=>{
                                                    if (!positionSide) return;
                                                    const nextTicks = Math.max(0, Math.round(Number(e.target.value) || 0));
                                                    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionPricesFromTicks"])(positionSide, entryPrice, nextTicks, slTicks, tick);
                                                    setPositionPrices(entryPrice, next.target, next.stop);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 601,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 600,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                            label: "Price",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                type: "number",
                                                step: "any",
                                                value: targetPrice,
                                                onChange: (e)=>setPositionPrices(entryPrice, Number(e.target.value) || 0, stopPrice)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 622,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 621,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 598,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].sectionTitle,
                                            children: "STOP LEVEL"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 635,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                            label: "Ticks",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                type: "number",
                                                min: 0,
                                                step: 1,
                                                value: slTicks,
                                                onChange: (e)=>{
                                                    if (!positionSide) return;
                                                    const nextTicks = Math.max(0, Math.round(Number(e.target.value) || 0));
                                                    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$drawings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionPricesFromTicks"])(positionSide, entryPrice, tpTicks, nextTicks, tick);
                                                    setPositionPrices(entryPrice, next.target, next.stop);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 637,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 636,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                            label: "Price",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: inputClass,
                                                type: "number",
                                                step: "any",
                                                value: stopPrice,
                                                onChange: (e)=>setPositionPrices(entryPrice, targetPrice, Number(e.target.value) || 0)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 658,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 657,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 634,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                        label: "QTY precision",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} min-w-[120px]`,
                                                value: String(draft.positionQtyPrecision),
                                                onChange: (e)=>{
                                                    const v = e.target.value;
                                                    patch({
                                                        positionQtyPrecision: v === "default" ? "default" : Number(v)
                                                    });
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "default",
                                                        children: "Default"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 686,
                                                        columnNumber: 21
                                                    }, this),
                                                    [
                                                        0,
                                                        1,
                                                        2,
                                                        3,
                                                        4,
                                                        5,
                                                        6,
                                                        8
                                                    ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: n,
                                                            children: n
                                                        }, n, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 688,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 673,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 672,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 671,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 670,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 491,
                            columnNumber: 13
                        }, this),
                        isPosition && positionTab === "style" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Lines",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                                value: draft.color,
                                                onChange: (color)=>patch({
                                                        color
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 703,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${inputClass} w-[64px]`,
                                                value: draft.lineWidth,
                                                onChange: (e)=>patch({
                                                        lineWidth: Number(e.target.value)
                                                    }),
                                                children: [
                                                    1,
                                                    2,
                                                    3,
                                                    4
                                                ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: n,
                                                        children: n
                                                    }, n, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 715,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 707,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "36",
                                                height: "12",
                                                className: "text-(--app-text)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "0",
                                                    y1: "6",
                                                    x2: "36",
                                                    y2: "6",
                                                    stroke: draft.color,
                                                    strokeWidth: draft.lineWidth,
                                                    strokeDasharray: dashFor(draft.lineStyle)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 721,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 720,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 702,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 701,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Stop color",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                        value: draft.stopColor,
                                        onChange: (stopColor)=>patch({
                                                stopColor
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 735,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 734,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Target color",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                        value: draft.targetColor,
                                        onChange: (targetColor)=>patch({
                                                targetColor
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 742,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 741,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Text",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                                value: draft.textColor,
                                                onChange: (textColor)=>patch({
                                                        textColor
                                                    }),
                                                showOpacity: false
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 750,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${inputClass} w-[64px]`,
                                                value: draft.textSize,
                                                onChange: (e)=>patch({
                                                        textSize: Number(e.target.value) || 11
                                                    }),
                                                children: [
                                                    10,
                                                    11,
                                                    12,
                                                    13,
                                                    14,
                                                    16,
                                                    18,
                                                    20,
                                                    24
                                                ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: n,
                                                        children: n
                                                    }, n, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 761,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 755,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 749,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 748,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Price labels",
                                    checked: draft.showPriceLabels,
                                    onChange: (showPriceLabels)=>patch({
                                            showPriceLabels
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 769,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                                    title: "INFO",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                            label: "Stats",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsMultiSelect, {
                                                value: draft.positionStats,
                                                onChange: (positionStats)=>patch({
                                                        positionStats
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 777,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 776,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                            label: "Compact stats mode",
                                            checked: draft.compactStats,
                                            onChange: (compactStats)=>patch({
                                                    compactStats
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 782,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                            label: "Always show stats",
                                            checked: draft.alwaysShowStats,
                                            onChange: (alwaysShowStats)=>patch({
                                                    alwaysShowStats
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 787,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 775,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 700,
                            columnNumber: 13
                        }, this),
                        isPosition && positionTab === "visibility" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$VisibilitySettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VisibilitySettingsPanel"], {
                            value: draft.visibility,
                            onChange: (visibility)=>patch({
                                    visibility
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 797,
                            columnNumber: 13
                        }, this),
                        isFib && fibTab === "style" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.fibTrendVisible,
                                            onChange: (e)=>patch({
                                                    fibTrendVisible: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 806,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[88px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Trend line"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 812,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                            value: draft.fibTrendColor,
                                            onChange: (fibTrendColor)=>patch({
                                                    fibTrendColor
                                                }),
                                            showOpacity: false
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 813,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${inputClass} min-w-[96px]`,
                                            value: draft.fibTrendStyle,
                                            onChange: (e)=>patch({
                                                    fibTrendStyle: e.target.value
                                                }),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "solid",
                                                    children: "Solid"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 825,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "dashed",
                                                    children: "Dashed"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 826,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "dotted",
                                                    children: "Dotted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 827,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 818,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "36",
                                            height: "12",
                                            className: "shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "0",
                                                y1: "6",
                                                x2: "36",
                                                y2: "6",
                                                stroke: draft.fibTrendColor,
                                                strokeWidth: 1.5,
                                                strokeDasharray: dashFor(draft.fibTrendStyle)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 830,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 829,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 805,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Levels line",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${inputClass} w-[56px]`,
                                                value: draft.lineWidth,
                                                onChange: (e)=>patch({
                                                        lineWidth: Number(e.target.value)
                                                    }),
                                                children: [
                                                    1,
                                                    2,
                                                    3,
                                                    4
                                                ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: n,
                                                        children: n
                                                    }, n, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 852,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 844,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${inputClass} min-w-[96px]`,
                                                value: draft.lineStyle,
                                                onChange: (e)=>patch({
                                                        lineStyle: e.target.value
                                                    }),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "solid",
                                                        children: "Solid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 862,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "dashed",
                                                        children: "Dashed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 863,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "dotted",
                                                        children: "Dotted"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 864,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 857,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "36",
                                                height: "12",
                                                className: "shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "0",
                                                    y1: "6",
                                                    x2: "36",
                                                    y2: "6",
                                                    stroke: "#d1d4dc",
                                                    strokeWidth: draft.lineWidth,
                                                    strokeDasharray: dashFor(draft.lineStyle)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 867,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 866,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 843,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 842,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Extend",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} min-w-[160px]`,
                                            value: draft.extend,
                                            onChange: (e)=>patch({
                                                    extend: e.target.value
                                                }),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "none",
                                                    children: "Don't extend"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 887,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "left",
                                                    children: "Extend left"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 888,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "right",
                                                    children: "Extend right"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 889,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "both",
                                                    children: "Extend both"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 890,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 882,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 881,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 880,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-x-3 gap-y-1.5 py-1",
                                    children: draft.fibLevels.map((lvl, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "accent-[#2962ff]",
                                                    checked: lvl.visible,
                                                    onChange: (e)=>{
                                                        const fibLevels = draft.fibLevels.map((l, idx)=>idx === i ? {
                                                                ...l,
                                                                visible: e.target.checked
                                                            } : l);
                                                        patch({
                                                            fibLevels
                                                        });
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 898,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: `${inputClass} w-[64px]`,
                                                    type: "number",
                                                    step: "any",
                                                    value: lvl.level,
                                                    onChange: (e)=>{
                                                        const fibLevels = draft.fibLevels.map((l, idx)=>idx === i ? {
                                                                ...l,
                                                                level: Number(e.target.value) || 0
                                                            } : l);
                                                        patch({
                                                            fibLevels
                                                        });
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 909,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                                    value: lvl.color,
                                                    onChange: (color)=>{
                                                        const fibLevels = draft.fibLevels.map((l, idx)=>idx === i ? {
                                                                ...l,
                                                                color
                                                            } : l);
                                                        patch({
                                                            fibLevels
                                                        });
                                                    },
                                                    showOpacity: false
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 923,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `${lvl.level}-${i}`, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 897,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 895,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.fibUseOneColor,
                                            onChange: (e)=>patch({
                                                    fibUseOneColor: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 938,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[110px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Use one color"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 944,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                            value: draft.fibOneColor,
                                            onChange: (fibOneColor)=>patch({
                                                    fibOneColor
                                                }),
                                            showOpacity: false
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 945,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 937,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.fibBackground,
                                            onChange: (e)=>patch({
                                                    fibBackground: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 953,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[110px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Background"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 959,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: 0,
                                            max: 100,
                                            value: draft.fibBackgroundOpacity,
                                            className: "h-1.5 w-[140px] accent-[#2962ff]",
                                            onChange: (e)=>patch({
                                                    fibBackgroundOpacity: Number(e.target.value) || 0
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 960,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[11px] text-(--app-muted)",
                                            children: [
                                                draft.fibBackgroundOpacity,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 970,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 952,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Reverse",
                                    checked: draft.fibReverse,
                                    onChange: (fibReverse)=>patch({
                                            fibReverse
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 973,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Prices",
                                    checked: draft.fibShowPrices,
                                    onChange: (fibShowPrices)=>patch({
                                            fibShowPrices
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 978,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.fibShowLevels,
                                            onChange: (e)=>patch({
                                                    fibShowLevels: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 985,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[72px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Levels"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 991,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[120px]`,
                                                value: draft.fibLevelsFormat,
                                                onChange: (e)=>patch({
                                                        fibLevelsFormat: e.target.value
                                                    }),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "percents",
                                                        children: "Percents"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1000,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "values",
                                                        children: "Values"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1001,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 993,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 992,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 984,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Labels",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[100px]`,
                                                    value: draft.fibLabelH,
                                                    onChange: (e)=>patch({
                                                            fibLabelH: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "left",
                                                            children: "Left"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1016,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "center",
                                                            children: "Center"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1017,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "right",
                                                            children: "Right"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1018,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1009,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1008,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[100px]`,
                                                    value: draft.fibLabelV,
                                                    onChange: (e)=>patch({
                                                            fibLabelV: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "top",
                                                            children: "Top"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1029,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "middle",
                                                            children: "Middle"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1030,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "bottom",
                                                            children: "Bottom"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1031,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1022,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1021,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1006,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.fibShowText,
                                            onChange: (e)=>patch({
                                                    fibShowText: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1038,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[48px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Text"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1044,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[100px]`,
                                                disabled: !draft.fibShowText,
                                                value: draft.textAlignH,
                                                onChange: (e)=>patch({
                                                        textAlignH: e.target.value
                                                    }),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "left",
                                                        children: "Left"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1054,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "center",
                                                        children: "Center"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1055,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "right",
                                                        children: "Right"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1056,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1046,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1045,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[100px]`,
                                                disabled: !draft.fibShowText,
                                                value: draft.textAlignV,
                                                onChange: (e)=>patch({
                                                        textAlignV: e.target.value
                                                    }),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "top",
                                                        children: "Top"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1068,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "middle",
                                                        children: "Middle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1069,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "bottom",
                                                        children: "Bottom"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1070,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1060,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1059,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1037,
                                    columnNumber: 15
                                }, this),
                                draft.fibShowText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "min-h-[64px] w-full resize-y rounded-[4px] border border-[#363a45] bg-[#0b0e14] px-3 py-2 text-[13px] text-(--app-text) outline-none focus:border-[#2962ff]",
                                    placeholder: "Add text",
                                    value: draft.text,
                                    onChange: (e)=>patch({
                                            text: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1075,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Font size",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: `${inputClass} w-[72px]`,
                                        value: draft.textSize,
                                        onChange: (e)=>patch({
                                                textSize: Number(e.target.value) || 14
                                            }),
                                        children: [
                                            10,
                                            12,
                                            14,
                                            16,
                                            18,
                                            20,
                                            24
                                        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: n,
                                                children: n
                                            }, n, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1090,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 1084,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1083,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                    label: "Fib levels based on log scale",
                                    checked: draft.fibLogScale,
                                    onChange: (fibLogScale)=>patch({
                                            fibLogScale
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1097,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 804,
                            columnNumber: 13
                        }, this),
                        !isPosition && !isFib && genericTab === "style" && drawing.tool === "rect" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Extend",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} min-w-[160px]`,
                                            value: draft.extend,
                                            onChange: (e)=>patch({
                                                    extend: e.target.value
                                                }),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "none",
                                                    children: "Don't extend"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1114,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "left",
                                                    children: "Extend left"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1115,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "right",
                                                    children: "Extend right"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1116,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "both",
                                                    children: "Extend both"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1117,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1109,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 1108,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1107,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Border",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                                value: draft.color,
                                                onChange: (color)=>patch({
                                                        color
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1124,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${inputClass} w-[56px]`,
                                                value: draft.lineWidth,
                                                onChange: (e)=>patch({
                                                        lineWidth: Number(e.target.value)
                                                    }),
                                                children: [
                                                    1,
                                                    2,
                                                    3,
                                                    4
                                                ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: n,
                                                        children: n
                                                    }, n, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1136,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1128,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 1123,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1122,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.showMiddlePoint,
                                            onChange: (e)=>patch({
                                                    showMiddlePoint: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1145,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[92px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Middle line"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1151,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                            value: draft.middleLineColor,
                                            onChange: (middleLineColor)=>patch({
                                                    middleLineColor
                                                }),
                                            showOpacity: false
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1152,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${inputClass} min-w-[96px]`,
                                            value: draft.middleLineStyle,
                                            onChange: (e)=>patch({
                                                    middleLineStyle: e.target.value
                                                }),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "solid",
                                                    children: "Solid"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1164,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "dashed",
                                                    children: "Dashed"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1165,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "dotted",
                                                    children: "Dotted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1166,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1157,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "40",
                                            height: "12",
                                            className: "shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "0",
                                                y1: "6",
                                                x2: "40",
                                                y2: "6",
                                                stroke: draft.middleLineColor,
                                                strokeWidth: 1.5,
                                                strokeDasharray: dashFor(draft.middleLineStyle)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1169,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1168,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1144,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.fillVisible,
                                            onChange: (e)=>patch({
                                                    fillVisible: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1182,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[92px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Background"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1188,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                            value: draft.fillColor,
                                            onChange: (fillColor)=>patch({
                                                    fillColor
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1189,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1181,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1106,
                            columnNumber: 13
                        }, this),
                        !isPosition && !isFib && genericTab === "style" && drawing.tool === "circle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Border",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                                value: draft.color,
                                                onChange: (color)=>patch({
                                                        color
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1204,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${inputClass} w-[56px]`,
                                                value: draft.lineWidth,
                                                onChange: (e)=>patch({
                                                        lineWidth: Number(e.target.value)
                                                    }),
                                                children: [
                                                    1,
                                                    2,
                                                    3,
                                                    4
                                                ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: n,
                                                        children: n
                                                    }, n, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1216,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1208,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: `${inputClass} min-w-[96px]`,
                                                value: draft.lineStyle,
                                                onChange: (e)=>patch({
                                                        lineStyle: e.target.value
                                                    }),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "solid",
                                                        children: "Solid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1226,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "dashed",
                                                        children: "Dashed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1227,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "dotted",
                                                        children: "Dotted"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                        lineNumber: 1228,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1221,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "40",
                                                height: "12",
                                                className: "shrink-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "0",
                                                    y1: "6",
                                                    x2: "40",
                                                    y2: "6",
                                                    stroke: draft.color,
                                                    strokeWidth: draft.lineWidth,
                                                    strokeDasharray: dashFor(draft.lineStyle)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1230,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 1203,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1202,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 py-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.fillVisible,
                                            onChange: (e)=>patch({
                                                    fillVisible: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1245,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-[92px] shrink-0 text-[13px] text-(--app-text)",
                                            children: "Background"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1251,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                            value: draft.fillColor,
                                            onChange: (fillColor)=>patch({
                                                    fillColor
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1252,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1244,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1201,
                            columnNumber: 13
                        }, this),
                        !isPosition && !isFib && genericTab === "style" && drawing.tool !== "rect" && drawing.tool !== "circle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                            value: draft.color,
                                            onChange: (color)=>patch({
                                                    color
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1267,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${inputClass} w-[72px]`,
                                            value: draft.lineWidth,
                                            onChange: (e)=>patch({
                                                    lineWidth: Number(e.target.value)
                                                }),
                                            children: [
                                                1,
                                                2,
                                                3,
                                                4
                                            ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: n,
                                                    children: n
                                                }, n, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1276,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1268,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${inputClass} min-w-[100px]`,
                                            value: draft.lineStyle,
                                            onChange: (e)=>patch({
                                                    lineStyle: e.target.value
                                                }),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "solid",
                                                    children: "Solid"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1286,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "dashed",
                                                    children: "Dashed"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1287,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "dotted",
                                                    children: "Dotted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1288,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1281,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "48",
                                            height: "12",
                                            className: "text-(--app-text)",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "0",
                                                y1: "6",
                                                x2: "48",
                                                y2: "6",
                                                stroke: draft.color,
                                                strokeWidth: draft.lineWidth,
                                                strokeDasharray: dashFor(draft.lineStyle)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1291,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1290,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1266,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Extend",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: `${inputClass} min-w-[140px]`,
                                        value: draft.extend,
                                        onChange: (e)=>patch({
                                                extend: e.target.value
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "none",
                                                children: "Don't extend"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1308,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "left",
                                                children: "Extend left"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1309,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "right",
                                                children: "Extend right"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1310,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "both",
                                                children: "Extend both"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1311,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 1303,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1302,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center gap-2 py-1 text-[13px] text-(--app-text)",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.showMiddlePoint,
                                            onChange: (e)=>patch({
                                                    showMiddlePoint: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1315,
                                            columnNumber: 17
                                        }, this),
                                        "Middle point"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1314,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center gap-2 py-1 text-[13px] text-(--app-text)",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "accent-[#2962ff]",
                                            checked: draft.showPriceLabels,
                                            onChange: (e)=>patch({
                                                    showPriceLabels: e.target.checked
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1324,
                                            columnNumber: 17
                                        }, this),
                                        "Price labels"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1323,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1265,
                            columnNumber: 13
                        }, this),
                        !isPosition && !isFib && genericTab === "text" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                                            value: draft.textColor,
                                            onChange: (textColor)=>patch({
                                                    textColor
                                                }),
                                            showOpacity: false
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1338,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: `${inputClass} w-[72px]`,
                                            value: draft.textSize,
                                            onChange: (e)=>patch({
                                                    textSize: Number(e.target.value) || 14
                                                }),
                                            children: [
                                                10,
                                                12,
                                                14,
                                                16,
                                                18,
                                                20,
                                                24
                                            ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: n,
                                                    children: n
                                                }, n, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1349,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1343,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: `flex h-7 w-7 items-center justify-center rounded border border-[#363a45] text-[13px] font-bold ${draft.textBold ? "bg-(--app-hover) text-white" : "text-(--app-text)"}`,
                                            onClick: ()=>patch({
                                                    textBold: !draft.textBold
                                                }),
                                            children: "B"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1354,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: `flex h-7 w-7 items-center justify-center rounded border border-[#363a45] text-[13px] italic ${draft.textItalic ? "bg-(--app-hover) text-white" : "text-(--app-text)"}`,
                                            onClick: ()=>patch({
                                                    textItalic: !draft.textItalic
                                                }),
                                            children: "I"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1363,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1337,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    className: "min-h-[88px] w-full resize-y rounded-[4px] border border-[#2962ff] bg-[#0b0e14] px-3 py-2 text-[13px] text-(--app-text) outline-none",
                                    placeholder: "Add text",
                                    value: draft.text,
                                    onChange: (e)=>patch({
                                            text: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1373,
                                    columnNumber: 15
                                }, this),
                                drawing.tool === "rect" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                    label: "Text alignment",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[110px]`,
                                                    value: draft.textAlignV,
                                                    onChange: (e)=>patch({
                                                            textAlignV: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "top",
                                                            children: "Top"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1390,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "middle",
                                                            children: "Middle"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1391,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "bottom",
                                                            children: "Bottom"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1392,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1383,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1382,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSelectWrap"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].select} w-[110px]`,
                                                    value: draft.textAlignH,
                                                    onChange: (e)=>patch({
                                                            textAlignH: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "left",
                                                            children: "Left"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1403,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "center",
                                                            children: "Center"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1404,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "right",
                                                            children: "Right"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                            lineNumber: 1405,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1396,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                lineNumber: 1395,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                        lineNumber: 1381,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1380,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1336,
                            columnNumber: 13
                        }, this),
                        (!isPosition && !isFib && genericTab === "coordinates" || isFib && fibTab === "coordinates") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: draft.points.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-1 text-[12px] text-(--app-muted)",
                                            children: [
                                                "#",
                                                i + 1,
                                                " (price, bar time)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1419,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: `${inputClass} w-[140px]`,
                                                    type: "number",
                                                    step: "any",
                                                    value: p.price,
                                                    onChange: (e)=>{
                                                        const points = draft.points.map((pt, idx)=>idx === i ? {
                                                                ...pt,
                                                                price: Number(e.target.value) || 0
                                                            } : pt);
                                                        patch({
                                                            points
                                                        });
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1423,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: `${inputClass} w-[140px]`,
                                                    type: "number",
                                                    value: p.time,
                                                    onChange: (e)=>{
                                                        const points = draft.points.map((pt, idx)=>idx === i ? {
                                                                ...pt,
                                                                time: Math.round(Number(e.target.value) || 0)
                                                            } : pt);
                                                        patch({
                                                            points
                                                        });
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                                    lineNumber: 1435,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                            lineNumber: 1422,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                                    lineNumber: 1418,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1416,
                            columnNumber: 13
                        }, this),
                        (!isPosition && !isFib && genericTab === "visibility" || isFib && fibTab === "visibility") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$VisibilitySettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VisibilitySettingsPanel"], {
                            value: draft.visibility,
                            onChange: (visibility)=>patch({
                                    visibility
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1456,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                    lineNumber: 489,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFooter"], {
                    left: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                        disabled: true,
                        title: "Templates coming soon",
                        children: "Template"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                        lineNumber: 1465,
                        columnNumber: 13
                    }, this),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                            onClick: cancel,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1470,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                            variant: "primary",
                            onClick: apply,
                            children: "Ok"
                        }, void 0, false, {
                            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                            lineNumber: 1471,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
                    lineNumber: 1463,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
            lineNumber: 451,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/settings/DrawingSettingsModal.tsx",
        lineNumber: 450,
        columnNumber: 5
    }, this);
}
_s1(DrawingSettingsModal, "wfZpI+T0H2sqlRjtOabvyKr316c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c1 = DrawingSettingsModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "StatsMultiSelect");
__turbopack_context__.k.register(_c1, "DrawingSettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/settings/IndicatorSettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndicatorSettingsModal",
    ()=>IndicatorSettingsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$VisibilitySettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/VisibilitySettingsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/ColorPicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/indicators.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/studies.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visibility.ts [app-client] (ecmascript)");
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
;
;
;
const inputClass = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].inputSm;
function LineStyleSelect({ value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        className: inputClass,
        value: value,
        onChange: (e)=>onChange(e.target.value),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: "solid",
                children: "Solid"
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: "dashed",
                children: "Dashed"
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: "dotted",
                children: "Dotted"
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c = LineStyleSelect;
function LineWidthSelect({ value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        className: inputClass,
        value: value,
        onChange: (e)=>onChange(Number(e.target.value)),
        children: [
            1,
            2,
            3,
            4
        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: n,
                children: n
            }, n, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_c1 = LineWidthSelect;
function LineAppearanceFields({ label, value, onChange, fillOnly = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: label ? "mb-3 border-b border-(--app-border) pb-2" : undefined,
        children: [
            label ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 text-[11px] font-semibold uppercase tracking-wide text-(--app-muted)",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                label: "Color",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                    value: value.color,
                    opacity: value.opacity,
                    onChange: (color)=>onChange({
                            ...value,
                            color
                        }),
                    onOpacityChange: (opacity)=>onChange({
                            ...value,
                            opacity
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            fillOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                        label: "Line width",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineWidthSelect, {
                            value: value.lineWidth,
                            onChange: (lineWidth)=>onChange({
                                    ...value,
                                    lineWidth
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                        label: "Line style",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineStyleSelect, {
                            value: value.lineStyle,
                            onChange: (lineStyle)=>onChange({
                                    ...value,
                                    lineStyle
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_c2 = LineAppearanceFields;
function VwapForm({ value, onChange, tab }) {
    const safe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVwapSettings"])(value);
    if (tab === "inputs") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                    title: "VWAP SETTINGS",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Hide VWAP on 1D or Above",
                            checked: safe.hideOn1DOrAbove,
                            onChange: (hideOn1DOrAbove)=>onChange({
                                    ...safe,
                                    hideOn1DOrAbove
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                            label: "Anchor Period",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: inputClass,
                                value: safe.anchorPeriod,
                                onChange: (e)=>onChange({
                                        ...safe,
                                        anchorPeriod: e.target.value
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "session",
                                        children: "Session"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "week",
                                        children: "Week"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "month",
                                        children: "Month"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                            label: "Source",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: inputClass,
                                value: safe.source,
                                onChange: (e)=>onChange({
                                        ...safe,
                                        source: e.target.value
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "hlc3",
                                        children: "(H + L + C) / 3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "ohlc4",
                                        children: "(O + H + L + C) / 4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 183,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "hl2",
                                        children: "(H + L) / 2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "close",
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "open",
                                        children: "Open"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "high",
                                        children: "High"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "low",
                                        children: "Low"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                            label: "Offset",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: inputClass,
                                type: "number",
                                min: -500,
                                max: 500,
                                value: safe.offset,
                                onChange: (e)=>onChange({
                                        ...safe,
                                        offset: Math.max(-500, Math.min(500, Number(e.target.value) || 0))
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                    title: "CALCULATION",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                            label: "Timeframe",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: inputClass,
                                value: safe.timeframe,
                                disabled: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "chart",
                                    children: "Chart"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 211,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Wait for timeframe closes",
                            checked: safe.waitForTimeframeCloses,
                            onChange: (waitForTimeframeCloses)=>onChange({
                                    ...safe,
                                    waitForTimeframeCloses
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 148,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 py-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        className: "accent-white",
                        checked: safe.visible,
                        onChange: (e)=>onChange({
                                ...safe,
                                visible: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-[56px] shrink-0 text-[13px] text-(--app-text)",
                        children: "VWAP"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                        value: safe.color,
                        opacity: safe.opacity,
                        onChange: (color)=>onChange({
                                ...safe,
                                color
                            }),
                        onOpacityChange: (opacity)=>onChange({
                                ...safe,
                                opacity
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineWidthSelect, {
                        value: safe.lineWidth,
                        onChange: (lineWidth)=>onChange({
                                ...safe,
                                lineWidth
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineStyleSelect, {
                        value: safe.lineStyle,
                        onChange: (lineStyle)=>onChange({
                                ...safe,
                                lineStyle
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "OUTPUT VALUES",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                label: "Precision",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: inputClass,
                                    value: safe.precision === "default" ? "default" : String(safe.precision),
                                    onChange: (e)=>{
                                        const v = e.target.value;
                                        onChange({
                                            ...safe,
                                            precision: v === "default" ? "default" : Number(v)
                                        });
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "default",
                                            children: "Default"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, this),
                                        [
                                            0,
                                            1,
                                            2,
                                            3,
                                            4,
                                            5,
                                            6,
                                            7,
                                            8
                                        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: n,
                                                children: n
                                            }, n, false, {
                                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                                lineNumber: 266,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Labels on price scale",
                                checked: safe.showScaleValues,
                                onChange: (showScaleValues)=>onChange({
                                        ...safe,
                                        showScaleValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Values in status line",
                                checked: safe.showStatusValues,
                                onChange: (showStatusValues)=>onChange({
                                        ...safe,
                                        showStatusValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "INPUT VALUES",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Inputs in status line",
                            checked: safe.showStatusInputs,
                            onChange: (showStatusInputs)=>onChange({
                                    ...safe,
                                    showStatusInputs
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
_c3 = VwapForm;
function EmaForm({ value, onChange, tab }) {
    const safe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEmaSettings"])(value);
    const smoothingOn = safe.smoothingType !== "none";
    if (tab === "inputs") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Length",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 1,
                        max: 500,
                        value: safe.period,
                        onChange: (e)=>onChange({
                                ...safe,
                                period: Math.max(1, Math.min(500, Number(e.target.value) || 9))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 311,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 310,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Source",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: inputClass,
                        value: safe.source,
                        onChange: (e)=>onChange({
                                ...safe,
                                source: e.target.value
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "close",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 333,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "open",
                                children: "Open"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 334,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "high",
                                children: "High"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "low",
                                children: "Low"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 336,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "hl2",
                                children: "HL2"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 337,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "hlc3",
                                children: "HLC3"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 338,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "ohlc4",
                                children: "OHLC4"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 339,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 325,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Offset",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: -500,
                        max: 500,
                        value: safe.offset,
                        onChange: (e)=>onChange({
                                ...safe,
                                offset: Math.max(-500, Math.min(500, Number(e.target.value) || 0))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 343,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 342,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "SMOOTHING",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                label: "Type",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: inputClass,
                                    value: safe.smoothingType,
                                    onChange: (e)=>onChange({
                                            ...safe,
                                            smoothingType: e.target.value
                                        }),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "none",
                                            children: "None"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "sma",
                                            children: "SMA"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 372,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "ema",
                                            children: "EMA"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 373,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "smma",
                                            children: "SMMA"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 374,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "wma",
                                            children: "WMA"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 375,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 361,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                label: "Length",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: inputClass,
                                    type: "number",
                                    min: 1,
                                    max: 500,
                                    disabled: !smoothingOn,
                                    value: safe.smoothingLength,
                                    onChange: (e)=>onChange({
                                            ...safe,
                                            smoothingLength: Math.max(1, Math.min(500, Number(e.target.value) || 14))
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 379,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 378,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                label: "BB StdDev",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: inputClass,
                                    type: "number",
                                    min: 0.1,
                                    max: 10,
                                    step: 0.1,
                                    disabled: !smoothingOn,
                                    value: safe.bbStdDev,
                                    onChange: (e)=>onChange({
                                            ...safe,
                                            bbStdDev: Math.max(0.1, Math.min(10, Number(e.target.value) || 2))
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 395,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 394,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 359,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 358,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                    title: "CALCULATION",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                            label: "Timeframe",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: inputClass,
                                value: safe.timeframe,
                                disabled: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "chart",
                                    children: "Chart"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 417,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 416,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 415,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Wait for timeframe closes",
                            checked: safe.waitForTimeframeCloses,
                            onChange: (waitForTimeframeCloses)=>onChange({
                                    ...safe,
                                    waitForTimeframeCloses
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 420,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 414,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 309,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 py-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        className: "accent-white",
                        checked: safe.visible,
                        onChange: (e)=>onChange({
                                ...safe,
                                visible: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-[48px] shrink-0 text-[13px] text-(--app-text)",
                        children: "EMA"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                        value: safe.color,
                        opacity: safe.opacity,
                        onChange: (color)=>onChange({
                                ...safe,
                                color
                            }),
                        onOpacityChange: (opacity)=>onChange({
                                ...safe,
                                opacity
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 440,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineWidthSelect, {
                        value: safe.lineWidth,
                        onChange: (lineWidth)=>onChange({
                                ...safe,
                                lineWidth
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 446,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineStyleSelect, {
                        value: safe.lineStyle,
                        onChange: (lineStyle)=>onChange({
                                ...safe,
                                lineStyle
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 450,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 432,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "OUTPUT VALUES",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                label: "Precision",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: inputClass,
                                    value: safe.precision === "default" ? "default" : String(safe.precision),
                                    onChange: (e)=>{
                                        const v = e.target.value;
                                        onChange({
                                            ...safe,
                                            precision: v === "default" ? "default" : Number(v)
                                        });
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "default",
                                            children: "Default"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 470,
                                            columnNumber: 15
                                        }, this),
                                        [
                                            0,
                                            1,
                                            2,
                                            3,
                                            4,
                                            5,
                                            6,
                                            7,
                                            8
                                        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: n,
                                                children: n
                                            }, n, false, {
                                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                                lineNumber: 472,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 459,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 458,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Labels on price scale",
                                checked: safe.showScaleValues,
                                onChange: (showScaleValues)=>onChange({
                                        ...safe,
                                        showScaleValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Values in status line",
                                checked: safe.showStatusValues,
                                onChange: (showStatusValues)=>onChange({
                                        ...safe,
                                        showStatusValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 457,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "INPUT VALUES",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Inputs in status line",
                            checked: safe.showStatusInputs,
                            onChange: (showStatusInputs)=>onChange({
                                    ...safe,
                                    showStatusInputs
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 490,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 489,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 456,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 431,
        columnNumber: 5
    }, this);
}
_c4 = EmaForm;
function BbForm({ value, onChange, tab }) {
    const safe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeBbSettings"])(value);
    if (tab === "inputs") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Length",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 1,
                        max: 500,
                        value: safe.period,
                        onChange: (e)=>onChange({
                                ...safe,
                                period: Math.max(1, Math.min(500, Number(e.target.value) || 20))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 516,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 515,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Basis MA Type",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: inputClass,
                        value: safe.maType,
                        onChange: (e)=>onChange({
                                ...safe,
                                maType: e.target.value
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "sma",
                                children: "SMA"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 541,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "ema",
                                children: "EMA"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 542,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "smma",
                                children: "SMMA"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 543,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "wma",
                                children: "WMA"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 544,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 531,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 530,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Source",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: inputClass,
                        value: safe.source,
                        onChange: (e)=>onChange({
                                ...safe,
                                source: e.target.value
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "close",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 558,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "open",
                                children: "Open"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 559,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "high",
                                children: "High"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 560,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "low",
                                children: "Low"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 561,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "hl2",
                                children: "HL2"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 562,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "hlc3",
                                children: "HLC3"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 563,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "ohlc4",
                                children: "OHLC4"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 564,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 548,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 547,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "StdDev",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 0.1,
                        max: 10,
                        step: 0.1,
                        value: safe.mult,
                        onChange: (e)=>onChange({
                                ...safe,
                                mult: Math.max(0.1, Math.min(10, Number(e.target.value) || 2))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 568,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 567,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Offset",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: -500,
                        max: 500,
                        value: safe.offset,
                        onChange: (e)=>onChange({
                                ...safe,
                                offset: Math.max(-500, Math.min(500, Number(e.target.value) || 0))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 584,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 583,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                    title: "CALCULATION",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                            label: "Timeframe",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: inputClass,
                                value: safe.timeframe,
                                disabled: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "chart",
                                    children: "Chart"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 602,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 601,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 600,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Wait for timeframe closes",
                            checked: safe.waitForTimeframeCloses,
                            onChange: (waitForTimeframeCloses)=>onChange({
                                    ...safe,
                                    waitForTimeframeCloses
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 605,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 599,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 514,
            columnNumber: 7
        }, this);
    }
    const StyleLineRow = ({ label, visible, onVisible, line, onLine })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 py-1.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "checkbox",
                    className: "accent-white",
                    checked: visible,
                    onChange: (e)=>onVisible(e.target.checked)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 629,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "w-[72px] shrink-0 text-[13px] text-(--app-text)",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 635,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                    value: line.color,
                    opacity: line.opacity,
                    onChange: (color)=>onLine({
                            ...line,
                            color
                        }),
                    onOpacityChange: (opacity)=>onLine({
                            ...line,
                            opacity
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 636,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineWidthSelect, {
                    value: line.lineWidth,
                    onChange: (lineWidth)=>onLine({
                            ...line,
                            lineWidth
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 642,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineStyleSelect, {
                    value: line.lineStyle,
                    onChange: (lineStyle)=>onLine({
                            ...line,
                            lineStyle
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 646,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 628,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "Basis",
                visible: safe.basisVisible,
                onVisible: (basisVisible)=>onChange({
                        ...safe,
                        basisVisible
                    }),
                line: safe.basis,
                onLine: (basis)=>onChange({
                        ...safe,
                        basis
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 655,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "Upper",
                visible: safe.upperVisible,
                onVisible: (upperVisible)=>onChange({
                        ...safe,
                        upperVisible
                    }),
                line: safe.upper,
                onLine: (upper)=>onChange({
                        ...safe,
                        upper
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 662,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "Lower",
                visible: safe.lowerVisible,
                onVisible: (lowerVisible)=>onChange({
                        ...safe,
                        lowerVisible
                    }),
                line: safe.lower,
                onLine: (lower)=>onChange({
                        ...safe,
                        lower
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 669,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 py-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        className: "accent-white",
                        checked: safe.backgroundVisible,
                        onChange: (e)=>onChange({
                                ...safe,
                                backgroundVisible: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-[72px] shrink-0 text-[13px] text-(--app-text)",
                        children: "Background"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 683,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                        value: safe.backgroundColor,
                        opacity: safe.backgroundOpacity,
                        onChange: (backgroundColor)=>onChange({
                                ...safe,
                                backgroundColor
                            }),
                        onOpacityChange: (backgroundOpacity)=>onChange({
                                ...safe,
                                backgroundOpacity
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 684,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 676,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "OUTPUT VALUES",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                label: "Precision",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: inputClass,
                                    value: safe.precision === "default" ? "default" : String(safe.precision),
                                    onChange: (e)=>{
                                        const v = e.target.value;
                                        onChange({
                                            ...safe,
                                            precision: v === "default" ? "default" : Number(v)
                                        });
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "default",
                                            children: "Default"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 708,
                                            columnNumber: 15
                                        }, this),
                                        [
                                            0,
                                            1,
                                            2,
                                            3,
                                            4,
                                            5,
                                            6,
                                            7,
                                            8
                                        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: n,
                                                children: n
                                            }, n, false, {
                                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                                lineNumber: 710,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 697,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 696,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Labels on price scale",
                                checked: safe.showScaleValues,
                                onChange: (showScaleValues)=>onChange({
                                        ...safe,
                                        showScaleValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 716,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Values in status line",
                                checked: safe.showStatusValues,
                                onChange: (showStatusValues)=>onChange({
                                        ...safe,
                                        showStatusValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 721,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 695,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "INPUT VALUES",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Inputs in status line",
                            checked: safe.showStatusInputs,
                            onChange: (showStatusInputs)=>onChange({
                                    ...safe,
                                    showStatusInputs
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 728,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 727,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 694,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 654,
        columnNumber: 5
    }, this);
}
_c5 = BbForm;
function RsiForm({ value, onChange, tab }) {
    if (tab === "inputs") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Length",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 2,
                        max: 200,
                        value: value.period,
                        onChange: (e)=>onChange({
                                ...value,
                                period: Math.max(2, Math.min(200, Number(e.target.value) || 14))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 752,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 751,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Upper band",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 1,
                        max: 99,
                        value: value.upperLevel,
                        onChange: (e)=>onChange({
                                ...value,
                                upperLevel: Math.max(1, Math.min(99, Number(e.target.value) || 70))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 764,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 763,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "Lower band",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 1,
                        max: 99,
                        value: value.lowerLevel,
                        onChange: (e)=>onChange({
                                ...value,
                                lowerLevel: Math.max(1, Math.min(99, Number(e.target.value) || 30))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 779,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 778,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 750,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineAppearanceFields, {
        value: {
            color: value.color,
            opacity: value.opacity ?? 100,
            lineWidth: value.lineWidth,
            lineStyle: value.lineStyle ?? "solid"
        },
        onChange: (line)=>onChange({
                ...value,
                ...line
            })
    }, void 0, false, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 797,
        columnNumber: 5
    }, this);
}
_c6 = RsiForm;
function StochForm({ value, onChange, tab }) {
    const safe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeStochSettings"])(value);
    if (tab === "inputs") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "%K Length",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 1,
                        max: 200,
                        value: safe.length,
                        onChange: (e)=>onChange({
                                ...safe,
                                length: Math.max(1, Math.min(200, Number(e.target.value) || 14))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 824,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 823,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "%K Smoothing",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 1,
                        max: 50,
                        value: safe.kSmoothing,
                        onChange: (e)=>onChange({
                                ...safe,
                                kSmoothing: Math.max(1, Math.min(50, Number(e.target.value) || 1))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 839,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 838,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                    label: "%D Smoothing",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        min: 1,
                        max: 50,
                        value: safe.dSmoothing,
                        onChange: (e)=>onChange({
                                ...safe,
                                dSmoothing: Math.max(1, Math.min(50, Number(e.target.value) || 3))
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 854,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 853,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 822,
            columnNumber: 7
        }, this);
    }
    const patchBand = (key, patch)=>{
        onChange({
            ...safe,
            [key]: {
                ...safe[key],
                ...patch
            }
        });
    };
    const StyleLineRow = ({ label, visible, onVisible, line, onLine, level, onLevel })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 py-1.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "checkbox",
                    className: "accent-white",
                    checked: visible,
                    onChange: (e)=>onVisible(e.target.checked)
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 894,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "w-[88px] shrink-0 text-[13px] text-(--app-text)",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 900,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                    value: line.color,
                    opacity: line.opacity,
                    onChange: (color)=>onLine({
                            ...line,
                            color
                        }),
                    onOpacityChange: (opacity)=>onLine({
                            ...line,
                            opacity
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 901,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].inputSm} w-[96px]`,
                    value: line.lineStyle,
                    onChange: (e)=>onLine({
                            ...line,
                            lineStyle: e.target.value
                        }),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "solid",
                            children: "Solid"
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 912,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "dashed",
                            children: "Dashed"
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 913,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "dotted",
                            children: "Dotted"
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 914,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 907,
                    columnNumber: 7
                }, this),
                onLevel != null && level != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    className: `${inputClass} w-[64px]`,
                    type: "number",
                    min: 0,
                    max: 100,
                    value: level,
                    onChange: (e)=>onLevel(Math.max(0, Math.min(100, Number(e.target.value) || 0)))
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 917,
                    columnNumber: 9
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 893,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "%K",
                visible: safe.kVisible,
                onVisible: (kVisible)=>onChange({
                        ...safe,
                        kVisible
                    }),
                line: safe.k,
                onLine: (k)=>onChange({
                        ...safe,
                        k
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 933,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "%D",
                visible: safe.dVisible,
                onVisible: (dVisible)=>onChange({
                        ...safe,
                        dVisible
                    }),
                line: safe.d,
                onLine: (d)=>onChange({
                        ...safe,
                        d
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 940,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "Upper Band",
                visible: safe.upper.visible,
                onVisible: (visible)=>patchBand("upper", {
                        visible
                    }),
                line: safe.upper,
                onLine: (line)=>patchBand("upper", line),
                level: safe.upper.level,
                onLevel: (level)=>patchBand("upper", {
                        level
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 947,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "Middle Band",
                visible: safe.middle.visible,
                onVisible: (visible)=>patchBand("middle", {
                        visible
                    }),
                line: safe.middle,
                onLine: (line)=>patchBand("middle", line),
                level: safe.middle.level,
                onLevel: (level)=>patchBand("middle", {
                        level
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 956,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StyleLineRow, {
                label: "Lower Band",
                visible: safe.lower.visible,
                onVisible: (visible)=>patchBand("lower", {
                        visible
                    }),
                line: safe.lower,
                onLine: (line)=>patchBand("lower", line),
                level: safe.lower.level,
                onLevel: (level)=>patchBand("lower", {
                        level
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 965,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 py-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        className: "accent-white",
                        checked: safe.backgroundVisible,
                        onChange: (e)=>onChange({
                                ...safe,
                                backgroundVisible: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 975,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-[88px] shrink-0 text-[13px] text-(--app-text)",
                        children: "Background"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 981,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
                        value: safe.backgroundColor,
                        opacity: safe.backgroundOpacity,
                        onChange: (backgroundColor)=>onChange({
                                ...safe,
                                backgroundColor
                            }),
                        onOpacityChange: (backgroundOpacity)=>onChange({
                                ...safe,
                                backgroundOpacity
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 982,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 974,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "OUTPUT VALUES",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                                label: "Precision",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: inputClass,
                                    value: safe.precision === "default" ? "default" : String(safe.precision),
                                    onChange: (e)=>{
                                        const v = e.target.value;
                                        onChange({
                                            ...safe,
                                            precision: v === "default" ? "default" : Number(v)
                                        });
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "default",
                                            children: "Default"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                            lineNumber: 1006,
                                            columnNumber: 15
                                        }, this),
                                        [
                                            0,
                                            1,
                                            2,
                                            3,
                                            4
                                        ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: n,
                                                children: n
                                            }, n, false, {
                                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                                lineNumber: 1008,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                    lineNumber: 995,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 994,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Labels on price scale",
                                checked: safe.showScaleValues,
                                onChange: (showScaleValues)=>onChange({
                                        ...safe,
                                        showScaleValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 1014,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                                label: "Values in status line",
                                checked: safe.showStatusValues,
                                onChange: (showStatusValues)=>onChange({
                                        ...safe,
                                        showStatusValues
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                                lineNumber: 1019,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 993,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                        title: "INPUT VALUES",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
                            label: "Inputs in status line",
                            checked: safe.showStatusInputs,
                            onChange: (showStatusInputs)=>onChange({
                                    ...safe,
                                    showStatusInputs
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1026,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 1025,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 992,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 932,
        columnNumber: 5
    }, this);
}
_c7 = StochForm;
function AtrForm({ value, onChange, tab }) {
    if (tab === "inputs") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                label: "Length",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    className: inputClass,
                    type: "number",
                    min: 2,
                    max: 200,
                    value: value.period,
                    onChange: (e)=>onChange({
                            ...value,
                            period: Math.max(2, Math.min(200, Number(e.target.value) || 14))
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 1050,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1049,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 1048,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineAppearanceFields, {
        value: {
            color: value.color,
            opacity: value.opacity ?? 100,
            lineWidth: value.lineWidth,
            lineStyle: value.lineStyle ?? "solid"
        },
        onChange: (line)=>onChange({
                ...value,
                ...line
            })
    }, void 0, false, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 1065,
        columnNumber: 5
    }, this);
}
_c8 = AtrForm;
function AdxForm({ value, onChange, tab }) {
    if (tab === "inputs") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                label: "Length",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    className: inputClass,
                    type: "number",
                    min: 2,
                    max: 200,
                    value: value.period,
                    onChange: (e)=>onChange({
                            ...value,
                            period: Math.max(2, Math.min(200, Number(e.target.value) || 14))
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 1090,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1089,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
            lineNumber: 1088,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
                label: "Show values on scale",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "checkbox",
                    checked: value.showScaleValues !== false,
                    onChange: (e)=>onChange({
                            ...value,
                            showScaleValues: e.target.checked
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 1107,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineAppearanceFields, {
                value: {
                    color: value.color,
                    opacity: value.opacity,
                    lineWidth: value.lineWidth,
                    lineStyle: value.lineStyle
                },
                onChange: (line)=>onChange({
                        ...value,
                        ...line
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1113,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 1105,
        columnNumber: 5
    }, this);
}
_c9 = AdxForm;
function mergeDraft(saved) {
    return {
        vwap: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVwapSettings"])(saved.vwap),
        ema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEmaSettings"])(saved.ema),
        bb: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeBbSettings"])(saved.bb),
        rsi: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].rsi,
            ...saved.rsi,
            visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(saved.rsi?.visibility)
        },
        stoch: (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeStochSettings"])(saved.stoch),
        atr: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].atr,
            ...saved.atr,
            visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(saved.atr?.visibility)
        },
        adx: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_INDICATOR_SETTINGS"].adx,
            ...saved.adx,
            visibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(saved.adx?.visibility)
        }
    };
}
function IndicatorSettingsModal() {
    _s();
    const instanceId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorSettingsModal.useAppStore[instanceId]": (s)=>s.indicatorSettingsId
    }["IndicatorSettingsModal.useAppStore[instanceId]"]);
    const setOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorSettingsModal.useAppStore[setOpen]": (s)=>s.setIndicatorSettingsOpen
    }["IndicatorSettingsModal.useAppStore[setOpen]"]);
    const updateStudySettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorSettingsModal.useAppStore[updateStudySettings]": (s)=>s.updateStudySettings
    }["IndicatorSettingsModal.useAppStore[updateStudySettings]"]);
    const patchIndicatorSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorSettingsModal.useAppStore[patchIndicatorSettings]": (s)=>s.patchIndicatorSettings
    }["IndicatorSettingsModal.useAppStore[patchIndicatorSettings]"]);
    const hostPaneId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorSettingsModal.useAppStore[hostPaneId]": (s)=>{
            if (!s.indicatorSettingsId) return null;
            return s.panes.find({
                "IndicatorSettingsModal.useAppStore[hostPaneId]": (p)=>p.studies.some({
                        "IndicatorSettingsModal.useAppStore[hostPaneId]": (st)=>st.id === s.indicatorSettingsId
                    }["IndicatorSettingsModal.useAppStore[hostPaneId]"])
            }["IndicatorSettingsModal.useAppStore[hostPaneId]"])?.id ?? null;
        }
    }["IndicatorSettingsModal.useAppStore[hostPaneId]"]);
    const hostSymbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorSettingsModal.useAppStore[hostSymbol]": (s)=>{
            if (!hostPaneId) return null;
            return s.panes.find({
                "IndicatorSettingsModal.useAppStore[hostSymbol]": (p)=>p.id === hostPaneId
            }["IndicatorSettingsModal.useAppStore[hostSymbol]"])?.symbol ?? null;
        }
    }["IndicatorSettingsModal.useAppStore[hostSymbol]"]);
    const study = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "IndicatorSettingsModal.useAppStore[study]": (s)=>{
            if (!s.indicatorSettingsId || !hostPaneId) return null;
            return s.panes.find({
                "IndicatorSettingsModal.useAppStore[study]": (p)=>p.id === hostPaneId
            }["IndicatorSettingsModal.useAppStore[study]"])?.studies.find({
                "IndicatorSettingsModal.useAppStore[study]": (st)=>st.id === s.indicatorSettingsId
            }["IndicatorSettingsModal.useAppStore[study]"]) ?? null;
        }
    }["IndicatorSettingsModal.useAppStore[study]"]);
    const type = study?.type ?? null;
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("inputs");
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "IndicatorSettingsModal.useState": ()=>mergeDraft(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().indicatorSettings)
    }["IndicatorSettingsModal.useState"]);
    const boxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const snapshotRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [dragged, setDragged] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Hydrate once per opened instance — live commits update the store, so don't re-sync from it.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndicatorSettingsModal.useEffect": ()=>{
            if (!instanceId) {
                snapshotRef.current = null;
                return;
            }
            const state = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
            const paneHost = state.panes.find({
                "IndicatorSettingsModal.useEffect": (p)=>p.studies.some({
                        "IndicatorSettingsModal.useEffect": (s)=>s.id === instanceId
                    }["IndicatorSettingsModal.useEffect"])
            }["IndicatorSettingsModal.useEffect"]) ?? null;
            const opened = paneHost?.studies.find({
                "IndicatorSettingsModal.useEffect": (s)=>s.id === instanceId
            }["IndicatorSettingsModal.useEffect"]) ?? null;
            if (!paneHost || !opened) return;
            const initial = mergeDraft({
                ...state.indicatorSettings,
                [opened.type]: opened.settings
            });
            setDraft(initial);
            snapshotRef.current = {
                paneId: paneHost.id,
                type: opened.type,
                studySettings: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneStudySettings"])(opened.type, opened.settings),
                factorySettings: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$studies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneStudySettings"])(opened.type, state.indicatorSettings[opened.type])
            };
            setTab("inputs");
            setDragged(false);
        }
    }["IndicatorSettingsModal.useEffect"], [
        instanceId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndicatorSettingsModal.useEffect": ()=>{
            if (!instanceId) return;
            const onDown = {
                "IndicatorSettingsModal.useEffect.onDown": (e)=>{
                    const target = e.target;
                    if (!target) return;
                    if (boxRef.current?.contains(target)) return;
                    if (target.closest("[data-color-picker-popover]")) return;
                    setOpen(null);
                }
            }["IndicatorSettingsModal.useEffect.onDown"];
            const timer = window.setTimeout({
                "IndicatorSettingsModal.useEffect.timer": ()=>{
                    window.addEventListener("mousedown", onDown, true);
                }
            }["IndicatorSettingsModal.useEffect.timer"], 0);
            return ({
                "IndicatorSettingsModal.useEffect": ()=>{
                    window.clearTimeout(timer);
                    window.removeEventListener("mousedown", onDown, true);
                }
            })["IndicatorSettingsModal.useEffect"];
        }
    }["IndicatorSettingsModal.useEffect"], [
        instanceId,
        setOpen
    ]);
    if (!instanceId || !hostPaneId || !hostSymbol || !study || !type) return null;
    const title = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$indicators$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indicatorTitle"])(type, hostSymbol);
    const close = ()=>setOpen(null);
    const commit = (next)=>{
        const merged = mergeDraft(next);
        setDraft(merged);
        updateStudySettings(instanceId, merged[type], hostPaneId);
        patchIndicatorSettings(type, merged[type]);
    };
    const cancel = ()=>{
        const snap = snapshotRef.current;
        if (snap) {
            updateStudySettings(instanceId, snap.studySettings, snap.paneId);
            patchIndicatorSettings(snap.type, snap.factorySettings);
        }
        close();
    };
    const apply = ()=>close();
    const startDrag = (event)=>{
        if (event.target.closest("button")) return;
        event.preventDefault();
        const rect = boxRef.current?.getBoundingClientRect();
        const originX = rect?.left ?? pos.x;
        const originY = rect?.top ?? pos.y;
        setDragged(true);
        setPos({
            x: originX,
            y: originY
        });
        const startX = event.clientX - originX;
        const startY = event.clientY - originY;
        const move = (ev)=>{
            const x = Math.min(window.innerWidth - 80, Math.max(8, ev.clientX - startX));
            const y = Math.min(window.innerHeight - 48, Math.max(8, ev.clientY - startY));
            setPos({
                x,
                y
            });
        };
        const up = ()=>{
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: boxRef,
        "data-indicator-settings-panel": true,
        "data-dropdown-open": true,
        className: "fixed z-[70] flex w-[420px] max-h-[calc(100vh-188px)] flex-col overflow-hidden rounded-[8px] bg-(--app-elevated) shadow-[0_8px_28px_rgba(0,0,0,0.65)]",
        style: dragged ? {
            left: pos.x,
            top: pos.y
        } : {
            left: "50%",
            top: 160,
            transform: "translateX(-50%)"
        },
        onMouseDown: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsHeader"], {
                title: title,
                onClose: close,
                onMouseDown: startDrag
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1294,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsTabs"], {
                tabs: [
                    "inputs",
                    "style",
                    "visibility"
                ],
                value: tab,
                onChange: setTab
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBody"], {
                className: "min-h-0 flex-1",
                children: tab === "visibility" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$VisibilitySettingsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VisibilitySettingsPanel"], {
                    value: draft[type].visibility,
                    onChange: (visibility)=>commit({
                            ...draft,
                            [type]: {
                                ...draft[type],
                                visibility
                            }
                        })
                }, void 0, false, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 1298,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        type === "vwap" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VwapForm, {
                            value: draft.vwap,
                            onChange: (vwap)=>commit({
                                    ...draft,
                                    vwap
                                }),
                            tab: tab
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1310,
                            columnNumber: 15
                        }, this),
                        type === "ema" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmaForm, {
                            value: draft.ema,
                            onChange: (ema)=>commit({
                                    ...draft,
                                    ema
                                }),
                            tab: tab
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1317,
                            columnNumber: 15
                        }, this),
                        type === "bb" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BbForm, {
                            value: draft.bb,
                            onChange: (bb)=>commit({
                                    ...draft,
                                    bb
                                }),
                            tab: tab
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1324,
                            columnNumber: 15
                        }, this),
                        type === "rsi" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RsiForm, {
                            value: draft.rsi,
                            onChange: (rsi)=>commit({
                                    ...draft,
                                    rsi
                                }),
                            tab: tab
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1327,
                            columnNumber: 15
                        }, this),
                        type === "stoch" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StochForm, {
                            value: draft.stoch,
                            onChange: (stoch)=>commit({
                                    ...draft,
                                    stoch
                                }),
                            tab: tab
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1334,
                            columnNumber: 15
                        }, this),
                        type === "atr" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AtrForm, {
                            value: draft.atr,
                            onChange: (atr)=>commit({
                                    ...draft,
                                    atr
                                }),
                            tab: tab
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1341,
                            columnNumber: 15
                        }, this),
                        type === "adx" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AdxForm, {
                            value: draft.adx,
                            onChange: (adx)=>commit({
                                    ...draft,
                                    adx
                                }),
                            tab: tab
                        }, void 0, false, {
                            fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                            lineNumber: 1348,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                    lineNumber: 1308,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1296,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFooter"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                        onClick: cancel,
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 1358,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                        variant: "primary",
                        onClick: apply,
                        children: "Ok"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                        lineNumber: 1359,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
                lineNumber: 1357,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/IndicatorSettingsModal.tsx",
        lineNumber: 1282,
        columnNumber: 5
    }, this);
}
_s(IndicatorSettingsModal, "WzHmWdYvAvuxmdre/7IQyEvBUB8=", false, function() {
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
_c10 = IndicatorSettingsModal;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "LineStyleSelect");
__turbopack_context__.k.register(_c1, "LineWidthSelect");
__turbopack_context__.k.register(_c2, "LineAppearanceFields");
__turbopack_context__.k.register(_c3, "VwapForm");
__turbopack_context__.k.register(_c4, "EmaForm");
__turbopack_context__.k.register(_c5, "BbForm");
__turbopack_context__.k.register(_c6, "RsiForm");
__turbopack_context__.k.register(_c7, "StochForm");
__turbopack_context__.k.register(_c8, "AtrForm");
__turbopack_context__.k.register(_c9, "AdxForm");
__turbopack_context__.k.register(_c10, "IndicatorSettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/settings/KeyboardShortcutsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KeyboardShortcutsPanel",
    ()=>KeyboardShortcutsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shortcuts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function KeyboardShortcutsPanel({ active }) {
    _s();
    const shortcuts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeyboardShortcutsPanel.useAppStore[shortcuts]": (s)=>s.shortcuts
    }["KeyboardShortcutsPanel.useAppStore[shortcuts]"]);
    const setShortcut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeyboardShortcutsPanel.useAppStore[setShortcut]": (s)=>s.setShortcut
    }["KeyboardShortcutsPanel.useAppStore[setShortcut]"]);
    const resetShortcuts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "KeyboardShortcutsPanel.useAppStore[resetShortcuts]": (s)=>s.resetShortcuts
    }["KeyboardShortcutsPanel.useAppStore[resetShortcuts]"]);
    const [recording, setRecording] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [conflict, setConflict] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KeyboardShortcutsPanel.useEffect": ()=>{
            if (!active) {
                setRecording(null);
                setConflict(null);
            }
        }
    }["KeyboardShortcutsPanel.useEffect"], [
        active
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KeyboardShortcutsPanel.useEffect": ()=>{
            if (!active || !recording) return;
            const onKey = {
                "KeyboardShortcutsPanel.useEffect.onKey": (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.key === "Escape") {
                        setRecording(null);
                        setConflict(null);
                        return;
                    }
                    const chord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chordFromEvent"])(e);
                    if (!chord) return;
                    const clash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findShortcutConflict"])(shortcuts, chord, recording);
                    if (clash) {
                        const label = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHORTCUT_DEFS"].find({
                            "KeyboardShortcutsPanel.useEffect.onKey": (d)=>d.id === clash
                        }["KeyboardShortcutsPanel.useEffect.onKey"])?.label ?? clash;
                        setConflict(`Already used by “${label}”. Press another key, or Esc to cancel.`);
                        return;
                    }
                    setShortcut(recording, chord);
                    setRecording(null);
                    setConflict(null);
                }
            }["KeyboardShortcutsPanel.useEffect.onKey"];
            window.addEventListener("keydown", onKey, true);
            return ({
                "KeyboardShortcutsPanel.useEffect": ()=>window.removeEventListener("keydown", onKey, true)
            })["KeyboardShortcutsPanel.useEffect"];
        }
    }["KeyboardShortcutsPanel.useEffect"], [
        active,
        recording,
        shortcuts,
        setShortcut
    ]);
    const groups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "KeyboardShortcutsPanel.useMemo[groups]": ()=>{
            const map = new Map();
            for (const def of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHORTCUT_DEFS"]){
                const list = map.get(def.group) ?? [];
                list.push(def);
                map.set(def.group, list);
            }
            return [
                ...map.entries()
            ];
        }
    }["KeyboardShortcutsPanel.useMemo[groups]"], []);
    const assign = (id, chord)=>{
        if (chord) {
            const clash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findShortcutConflict"])(shortcuts, chord, id);
            if (clash) {
                const label = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHORTCUT_DEFS"].find((d)=>d.id === clash)?.label ?? clash;
                setConflict(`Already used by “${label}”.`);
                return;
            }
        }
        setShortcut(id, chord);
        setConflict(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].muted} mb-4`,
                children: "Click a shortcut, then press the new key combination. Esc cancels recording."
            }, void 0, false, {
                fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            conflict && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-3 rounded-[4px] bg-(--app-hover) px-3 py-2 text-[12px] text-[#f23645]",
                children: conflict
            }, void 0, false, {
                fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                lineNumber: 86,
                columnNumber: 9
            }, this),
            groups.map(([group, defs])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
                    title: group,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1",
                        children: defs.map((def)=>{
                            const chord = shortcuts[def.id];
                            const isRec = recording === def.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-3 rounded-[6px] px-1 py-1.5 hover:bg-[#222]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].text,
                                        children: def.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                                        lineNumber: 101,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex shrink-0 items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setConflict(null);
                                                    setRecording(isRec ? null : def.id);
                                                },
                                                className: `min-w-[108px] rounded-[4px] border px-2.5 py-1.5 text-[12px] font-medium tabular-nums ${isRec ? "border-white bg-(--app-hover) text-white" : "border-[#363a45] bg-(--app-hover) text-(--app-text) hover:border-[#787b86]"}`,
                                                children: isRec ? "Press keys…" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatShortcut"])(chord)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                                                lineNumber: 103,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                title: "Clear",
                                                className: "rounded-[4px] px-1.5 py-1 text-[11px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)",
                                                onClick: ()=>{
                                                    setRecording(null);
                                                    assign(def.id, null);
                                                },
                                                children: "Clear"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                                                lineNumber: 117,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                title: "Reset",
                                                className: "rounded-[4px] px-1.5 py-1 text-[11px] text-(--app-muted) hover:bg-(--app-hover) hover:text-(--app-text)",
                                                onClick: ()=>{
                                                    setRecording(null);
                                                    assign(def.id, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shortcuts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SHORTCUTS"][def.id]);
                                                },
                                                children: "Reset"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                                        lineNumber: 102,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, def.id, true, {
                                fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                                lineNumber: 97,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this)
                }, group, false, {
                    fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                    variant: "ghost",
                    onClick: ()=>resetShortcuts(),
                    children: "Reset all shortcuts"
                }, void 0, false, {
                    fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/KeyboardShortcutsPanel.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s(KeyboardShortcutsPanel, "oaE6lpgrfx55qHJG7nmfCp9bVw4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = KeyboardShortcutsPanel;
var _c;
__turbopack_context__.k.register(_c, "KeyboardShortcutsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/settings/SettingsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsModal",
    ()=>SettingsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/ColorPicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$KeyboardShortcutsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/KeyboardShortcutsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/app-theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alarm$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlarmClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alarm-clock.mjs [app-client] (ecmascript) <export default as AlarmClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left-right.mjs [app-client] (ecmascript) <export default as ArrowLeftRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/keyboard.mjs [app-client] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/palette.mjs [app-client] (ecmascript) <export default as Palette>");
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
;
const TABS = [
    {
        id: "app",
        label: "App settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"]
    },
    {
        id: "trading",
        label: "Trading",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftRight$3e$__["ArrowLeftRight"]
    },
    {
        id: "shortcuts",
        label: "Shortcuts",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"]
    },
    {
        id: "alerts",
        label: "Alerts",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alarm$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlarmClock$3e$__["AlarmClock"]
    },
    {
        id: "events",
        label: "Events",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"]
    }
];
const inputClass = `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} min-w-[140px]`;
function Section({ title, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsSection"], {
        title: title,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/settings/SettingsModal.tsx",
        lineNumber: 42,
        columnNumber: 10
    }, this);
}
_c = Section;
function Check({ label, hint, checked, onChange, disabled, extra, indent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsCheck"], {
        label: label,
        hint: hint,
        checked: checked,
        onChange: onChange,
        disabled: disabled,
        extra: extra,
        indent: indent
    }, void 0, false, {
        fileName: "[project]/components/settings/SettingsModal.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c1 = Check;
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsFieldRow"], {
        label: label,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/settings/SettingsModal.tsx",
        lineNumber: 76,
        columnNumber: 10
    }, this);
}
_c2 = Field;
function ColorSwatch({ value, onChange, disabled }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsColorSwatch"], {
        value: value,
        onChange: onChange,
        disabled: disabled
    }, void 0, false, {
        fileName: "[project]/components/settings/SettingsModal.tsx",
        lineNumber: 88,
        columnNumber: 10
    }, this);
}
_c3 = ColorSwatch;
function SettingsModal() {
    _s();
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[open]": (s)=>s.settingsOpen
    }["SettingsModal.useAppStore[open]"]);
    const setSettingsOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[setSettingsOpen]": (s)=>s.setSettingsOpen
    }["SettingsModal.useAppStore[setSettingsOpen]"]);
    const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[settings]": (s)=>s.chartSettings
    }["SettingsModal.useAppStore[settings]"]);
    const patch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[patch]": (s)=>s.patchChartSettings
    }["SettingsModal.useAppStore[patch]"]);
    const appSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[appSettings]": (s)=>s.appSettings
    }["SettingsModal.useAppStore[appSettings]"]);
    const patchApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[patchApp]": (s)=>s.patchAppSettings
    }["SettingsModal.useAppStore[patchApp]"]);
    const setAppSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[setAppSettings]": (s)=>s.setAppSettings
    }["SettingsModal.useAppStore[setAppSettings]"]);
    const templates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[templates]": (s)=>s.chartTemplates
    }["SettingsModal.useAppStore[templates]"]);
    const applyChartTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[applyChartTemplate]": (s)=>s.applyChartTemplate
    }["SettingsModal.useAppStore[applyChartTemplate]"]);
    const saveChartTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])({
        "SettingsModal.useAppStore[saveChartTemplate]": (s)=>s.saveChartTemplate
    }["SettingsModal.useAppStore[saveChartTemplate]"]);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("app");
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(settings);
    const [appDraft, setAppDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(appSettings);
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(settings);
    const appSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(appSettings);
    const boxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pos, setPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [dragged, setDragged] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tplOpen, setTplOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsModal.useEffect": ()=>{
            if (!open) return;
            const state = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState();
            const merged = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
                ...state.chartSettings
            };
            snapshot.current = merged;
            setDraft(merged);
            const appMerged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSettings"])(state.appSettings);
            appSnapshot.current = appMerged;
            setAppDraft(appMerged);
            setTplOpen(false);
            setDragged(false);
        }
    }["SettingsModal.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsModal.useEffect": ()=>{
            if (!open) return;
            const onDown = {
                "SettingsModal.useEffect.onDown": (e)=>{
                    const target = e.target;
                    // Synthetic/dispatched events can carry a non-Node target (e.g. window) —
                    // `contains`/`closest` would throw on those.
                    if (!target || !(target instanceof Node)) return;
                    if (boxRef.current?.contains(target)) return;
                    if (target.closest("[data-settings-trigger]")) return;
                    if (target.closest("[data-color-picker-popover]")) return;
                    setSettingsOpen(false);
                }
            }["SettingsModal.useEffect.onDown"];
            // Defer so the click that opened the panel doesn't immediately close it
            const id = window.setTimeout({
                "SettingsModal.useEffect.id": ()=>{
                    window.addEventListener("mousedown", onDown, true);
                }
            }["SettingsModal.useEffect.id"], 0);
            return ({
                "SettingsModal.useEffect": ()=>{
                    window.clearTimeout(id);
                    window.removeEventListener("mousedown", onDown, true);
                }
            })["SettingsModal.useEffect"];
        }
    }["SettingsModal.useEffect"], [
        open,
        setSettingsOpen
    ]);
    if (!open) return null;
    const update = (partial)=>{
        const next = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
            ...draft,
            ...partial
        };
        setDraft(next);
        patch(partial);
    };
    const updateApp = (partial)=>{
        const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAppSettings"])({
            ...appDraft,
            ...partial
        });
        setAppDraft(next);
        patchApp(partial);
    };
    const close = ()=>setSettingsOpen(false);
    const cancel = ()=>{
        patch(snapshot.current);
        setDraft(snapshot.current);
        setAppSettings(appSnapshot.current);
        setAppDraft(appSnapshot.current);
        close();
    };
    const startDrag = (event)=>{
        if (event.target.closest("button")) return;
        event.preventDefault();
        const rect = boxRef.current?.getBoundingClientRect();
        const originX = rect?.left ?? pos.x;
        const originY = rect?.top ?? pos.y;
        setDragged(true);
        setPos({
            x: originX,
            y: originY
        });
        const startX = event.clientX - originX;
        const startY = event.clientY - originY;
        const move = (ev)=>{
            const x = Math.min(window.innerWidth - 80, Math.max(8, ev.clientX - startX));
            const y = Math.min(window.innerHeight - 48, Math.max(8, ev.clientY - startY));
            setPos({
                x,
                y
            });
        };
        const up = ()=>{
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: boxRef,
        "data-settings-panel": true,
        "data-dropdown-open": true,
        className: "fixed z-[70] flex w-[560px] max-h-[calc(100vh-168px)] items-start overflow-hidden rounded-[8px] bg-[var(--app-elevated)] shadow-[0_8px_28px_rgba(0,0,0,0.65)]",
        style: dragged ? {
            left: pos.x,
            top: pos.y
        } : {
            left: "50%",
            top: 160,
            transform: "translateX(-50%)"
        },
        onMouseDown: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "w-[168px] shrink-0 border-r border-(--app-border) py-2",
                children: TABS.map((item)=>{
                    const Icon = item.icon;
                    const on = tab === item.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setTab(item.id),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].navItem(on),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 15,
                                className: "shrink-0 text-(--app-muted)"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 217,
                                columnNumber: 15
                            }, this),
                            item.label
                        ]
                    }, item.id, true, {
                        fileName: "[project]/components/settings/SettingsModal.tsx",
                        lineNumber: 211,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/settings/SettingsModal.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex max-h-[calc(100vh-168px)] min-w-0 flex-1 flex-col overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-12 shrink-0 cursor-move items-center justify-between border-b border-(--app-border) px-5",
                        onMouseDown: startDrag,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].title,
                                children: "Settings"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].closeBtn,
                                onClick: close,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/SettingsModal.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-y-auto px-5 py-4",
                        children: [
                            tab === "app" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        title: "Chrome colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-3 text-[12px] leading-[16px] text-[var(--app-muted)]",
                                                children: "Colors for panes, panels, watchlist, menus, and the rest of the app shell. Chart candles and grid stay under Canvas settings."
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 242,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Background",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: appDraft.backgroundColor,
                                                    onChange: (backgroundColor)=>updateApp({
                                                            backgroundColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 246,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Panels",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: appDraft.panelColor,
                                                    onChange: (panelColor)=>updateApp({
                                                            panelColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 252,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Elevated surfaces",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: appDraft.elevatedColor,
                                                    onChange: (elevatedColor)=>updateApp({
                                                            elevatedColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 258,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Borders",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: appDraft.borderColor,
                                                    onChange: (borderColor)=>updateApp({
                                                            borderColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Hover",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: appDraft.hoverColor,
                                                    onChange: (hoverColor)=>updateApp({
                                                            hoverColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 270,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Text",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: appDraft.textColor,
                                                    onChange: (textColor)=>updateApp({
                                                            textColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 276,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Muted text",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: appDraft.mutedColor,
                                                    onChange: (mutedColor)=>updateApp({
                                                            mutedColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        title: "Reset",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                                            onClick: ()=>{
                                                setAppSettings(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_APP_SETTINGS"]);
                                                setAppDraft(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_APP_SETTINGS"]);
                                            },
                                            children: "Reset app colors"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                            lineNumber: 290,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 240,
                                columnNumber: 13
                            }, this),
                            tab === "trading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        title: "General",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Buy/sell buttons",
                                                hint: "Displays buy and sell buttons directly on the chart",
                                                checked: draft.showBuySell,
                                                onChange: (showBuySell)=>update({
                                                        showBuySell
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 305,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "One-click trading",
                                                hint: "Instantly place, edit, cancel orders, or close positions without confirmation",
                                                checked: draft.oneClickTrading,
                                                onChange: (oneClickTrading)=>update({
                                                        oneClickTrading
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 311,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Execution sound",
                                                checked: draft.executionSound,
                                                onChange: (executionSound)=>update({
                                                        executionSound
                                                    }),
                                                extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "range",
                                                            min: 0,
                                                            max: 100,
                                                            value: draft.executionSoundVolume,
                                                            disabled: !draft.executionSound,
                                                            onChange: (e)=>update({
                                                                    executionSoundVolume: Number(e.target.value)
                                                                }),
                                                            className: "w-20 accent-[#2962ff]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 323,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: inputClass,
                                                            disabled: !draft.executionSound,
                                                            value: draft.executionSoundName,
                                                            onChange: (e)=>update({
                                                                    executionSoundName: e.target.value
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "alarm",
                                                                    children: "Alarm Clock"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                                    lineNumber: 345,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "beep",
                                                                    children: "Beep"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "chime",
                                                                    children: "Chime"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Show only rejection notifications",
                                                checked: draft.showOnlyRejectionNotifications,
                                                onChange: (showOnlyRejectionNotifications)=>update({
                                                        showOnlyRejectionNotifications
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 352,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                        title: "Appearance",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Positions and orders",
                                                checked: draft.showPositionLines && draft.showOrderLines,
                                                onChange: (on)=>update({
                                                        showPositionLines: on,
                                                        showOrderLines: on
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 361,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Reverse position button",
                                                hint: "Adds the reverse button next to the open position on the chart",
                                                indent: true,
                                                checked: draft.reversePositionButton,
                                                onChange: (reversePositionButton)=>update({
                                                        reversePositionButton
                                                    }),
                                                disabled: !draft.showPositionLines
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 368,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Take profit / stop loss",
                                                checked: draft.showTpSlLines,
                                                onChange: (showTpSlLines)=>update({
                                                        showTpSlLines
                                                    }),
                                                extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                            value: draft.tpLineColor,
                                                            onChange: (tpLineColor)=>update({
                                                                    tpLineColor
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 382,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                            value: draft.slLineColor,
                                                            onChange: (slLineColor)=>update({
                                                                    slLineColor
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 376,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Liquidation",
                                                checked: draft.showLiqLines,
                                                onChange: (showLiqLines)=>update({
                                                        showLiqLines
                                                    }),
                                                extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: draft.liqLineColor,
                                                    onChange: (liqLineColor)=>update({
                                                            liqLineColor
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 393,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Project order for market orders",
                                                hint: "Shows a project order on the chart before sending a market order",
                                                checked: draft.projectMarketOrders,
                                                onChange: (projectMarketOrders)=>update({
                                                        projectMarketOrders
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 404,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Profit and loss value",
                                                checked: draft.showPnlValue,
                                                onChange: (showPnlValue)=>update({
                                                        showPnlValue
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 410,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Positions",
                                                indent: true,
                                                checked: draft.showPnlValue,
                                                onChange: (showPnlValue)=>update({
                                                        showPnlValue
                                                    }),
                                                disabled: !draft.showPnlValue,
                                                extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: inputClass,
                                                    value: draft.pnlPositionsFormat,
                                                    disabled: !draft.showPnlValue,
                                                    onChange: (e)=>update({
                                                            pnlPositionsFormat: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "pct",
                                                            children: "%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 432,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "currency",
                                                            children: "Money"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 433,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 415,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Brackets",
                                                indent: true,
                                                checked: draft.showPnlValue,
                                                onChange: (showPnlValue)=>update({
                                                        showPnlValue
                                                    }),
                                                disabled: !draft.showPnlValue,
                                                extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: inputClass,
                                                    value: draft.pnlBracketsFormat,
                                                    disabled: !draft.showPnlValue,
                                                    onChange: (e)=>update({
                                                            pnlBracketsFormat: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "pct",
                                                            children: "%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 454,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "currency",
                                                            children: "Money"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 444,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 437,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Execution marks",
                                                checked: draft.executionMarks,
                                                onChange: (executionMarks)=>update({
                                                        executionMarks
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 459,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Execution labels",
                                                indent: true,
                                                checked: draft.executionLabels,
                                                onChange: (executionLabels)=>update({
                                                        executionLabels
                                                    }),
                                                disabled: !draft.executionMarks
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 464,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Extended price lines across the entire chart width",
                                                checked: draft.extendedPriceLines,
                                                onChange: (extendedPriceLines)=>update({
                                                        extendedPriceLines
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 471,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Order and position alignment",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: inputClass,
                                                    value: draft.orderAlignment,
                                                    onChange: (e)=>update({
                                                            orderAlignment: e.target.value
                                                        }),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "right",
                                                            children: "Right"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 486,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "left",
                                                            children: "Left"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 476,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                label: "Orders, executions, and positions in chart snapshots",
                                                hint: "Shows your trades on the chart in snapshots",
                                                checked: draft.includeTradesInSnapshots,
                                                onChange: (includeTradesInSnapshots)=>update({
                                                        includeTradesInSnapshots
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 490,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Order size",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "0.01",
                                                    min: "0.001",
                                                    className: `${inputClass} w-24`,
                                                    value: draft.defaultQty,
                                                    onChange: (e)=>update({
                                                            defaultQty: Number(e.target.value) || 0.01
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 497,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 496,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Leverage",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "1",
                                                    min: "1",
                                                    className: `${inputClass} w-24`,
                                                    value: draft.defaultLeverage,
                                                    onChange: (e)=>update({
                                                            defaultLeverage: Number(e.target.value) || 10
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 506,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this),
                            tab === "shortcuts" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$KeyboardShortcutsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardShortcutsPanel"], {
                                active: tab === "shortcuts"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 520,
                                columnNumber: 35
                            }, this),
                            tab === "alerts" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Chart line visibility",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                    label: "Alert lines",
                                    checked: draft.showAlertLines,
                                    onChange: (showAlertLines)=>update({
                                            showAlertLines
                                        }),
                                    extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                        value: draft.alertLineColor,
                                        onChange: (alertLineColor)=>update({
                                                alertLineColor
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 529,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                    lineNumber: 524,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 523,
                                columnNumber: 13
                            }, this),
                            tab === "events" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                title: "Events",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                        label: "Ideas",
                                        checked: draft.showIdeas,
                                        onChange: (showIdeas)=>update({
                                                showIdeas
                                            }),
                                        extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: inputClass,
                                            disabled: !draft.showIdeas,
                                            value: draft.ideasFilter,
                                            onChange: (e)=>update({
                                                    ideasFilter: e.target.value
                                                }),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All ideas"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "following",
                                                    children: "Following"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 554,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "mine",
                                                    children: "My ideas"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                            lineNumber: 545,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 540,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                        label: "Session breaks",
                                        checked: draft.sessionBreaks,
                                        onChange: (sessionBreaks)=>update({
                                                sessionBreaks
                                            }),
                                        extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                                    value: draft.sessionBreakColor,
                                                    onChange: (sessionBreakColor)=>update({
                                                            sessionBreakColor
                                                        }),
                                                    disabled: !draft.sessionBreaks
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 565,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} h-7 w-[64px] px-1.5 text-[12px]`,
                                                    value: draft.sessionBreakLineWidth,
                                                    disabled: !draft.sessionBreaks,
                                                    onChange: (e)=>update({
                                                            sessionBreakLineWidth: Number(e.target.value)
                                                        }),
                                                    title: "Line width",
                                                    children: [
                                                        1,
                                                        2,
                                                        3,
                                                        4
                                                    ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: n,
                                                            children: [
                                                                n,
                                                                "px"
                                                            ]
                                                        }, n, true, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 570,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} h-7 min-w-[88px] px-1.5 text-[12px]`,
                                                    value: draft.sessionBreakLineStyle,
                                                    disabled: !draft.sessionBreaks,
                                                    onChange: (e)=>update({
                                                            sessionBreakLineStyle: e.target.value
                                                        }),
                                                    title: "Line style",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "solid",
                                                            children: "Solid"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 598,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "dashed",
                                                            children: "Dashed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 599,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "dotted",
                                                            children: "Dotted"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                                            lineNumber: 600,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 587,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                            lineNumber: 564,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 559,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                        label: "Economic events",
                                        checked: draft.economicEvents,
                                        onChange: (economicEvents)=>update({
                                                economicEvents
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 605,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                        label: "Only future events",
                                        indent: true,
                                        checked: draft.onlyFutureEvents,
                                        onChange: (onlyFutureEvents)=>update({
                                                onlyFutureEvents
                                            }),
                                        disabled: !draft.economicEvents
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 610,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                        label: "Events breaks",
                                        indent: true,
                                        checked: draft.eventsBreaks,
                                        onChange: (eventsBreaks)=>update({
                                                eventsBreaks
                                            }),
                                        disabled: !draft.economicEvents,
                                        extra: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorSwatch, {
                                            value: draft.eventsBreakColor,
                                            onChange: (eventsBreakColor)=>update({
                                                    eventsBreakColor
                                                }),
                                            disabled: !draft.economicEvents || !draft.eventsBreaks
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/SettingsModal.tsx",
                                            lineNumber: 624,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 617,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                        label: "Latest news",
                                        checked: draft.latestNews,
                                        onChange: (latestNews)=>update({
                                                latestNews
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 631,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                        label: "News notification",
                                        checked: draft.newsNotification,
                                        onChange: (newsNotification)=>update({
                                                newsNotification
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 636,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 539,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/SettingsModal.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex shrink-0 items-center justify-between border-t border-(--app-border) px-5 py-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                                        onClick: ()=>setTplOpen(!tplOpen),
                                        children: "Template ▾"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 647,
                                        columnNumber: 13
                                    }, this),
                                    tplOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-10 left-0 z-10 min-w-[160px] rounded-[6px] border border-(--app-border) bg-(--app-elevated) py-1 shadow-lg",
                                        children: [
                                            templates.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: "block w-full px-3 py-1.5 text-left text-[12px] text-(--app-text) hover:bg-(--app-hover)",
                                                    onClick: ()=>{
                                                        applyChartTemplate(t.id);
                                                        setDraft({
                                                            ...__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"],
                                                            ...t.settings
                                                        });
                                                        setTplOpen(false);
                                                    },
                                                    children: t.name
                                                }, t.id, false, {
                                                    fileName: "[project]/components/settings/SettingsModal.tsx",
                                                    lineNumber: 651,
                                                    columnNumber: 19
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "block w-full px-3 py-1.5 text-left text-[12px] text-(--app-text) hover:bg-(--app-hover)",
                                                onClick: ()=>{
                                                    const name = window.prompt("Template name", "My template");
                                                    if (name) saveChartTemplate(name);
                                                    setTplOpen(false);
                                                },
                                                children: "Save current…"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 664,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "block w-full px-3 py-1.5 text-left text-[12px] text-(--app-text) hover:bg-(--app-hover)",
                                                onClick: ()=>{
                                                    patch(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"]);
                                                    setDraft(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_SETTINGS"]);
                                                    setTplOpen(false);
                                                },
                                                children: "Defaults"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                                lineNumber: 675,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 649,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 646,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                                        onClick: cancel,
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 690,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SettingsBtn"], {
                                        variant: "primary",
                                        onClick: close,
                                        children: "Ok"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/SettingsModal.tsx",
                                        lineNumber: 691,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/SettingsModal.tsx",
                                lineNumber: 689,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/SettingsModal.tsx",
                        lineNumber: 645,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/SettingsModal.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/SettingsModal.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
_s(SettingsModal, "hZXW7arrIQkVOpANq/WtBeZe9L8=", false, function() {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c4 = SettingsModal;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Section");
__turbopack_context__.k.register(_c1, "Check");
__turbopack_context__.k.register(_c2, "Field");
__turbopack_context__.k.register(_c3, "ColorSwatch");
__turbopack_context__.k.register(_c4, "SettingsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/settings/VisibilitySettingsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VisibilitySettingsPanel",
    ()=>VisibilitySettingsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visibility.ts [app-client] (ecmascript)");
"use client";
;
;
;
const inputClass = `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].input} w-[52px] px-1.5 text-center`;
function BandRow({ label, band, onChange, hasRange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-2 py-1.5 ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].text}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "flex min-w-[72px] items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        className: "accent-white",
                        checked: band.enabled,
                        onChange: (e)=>onChange({
                                ...band,
                                enabled: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            hasRange !== false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ml-auto flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        disabled: !band.enabled,
                        value: band.min,
                        onChange: (e)=>onChange({
                                ...band,
                                min: Math.max(1, Number(e.target.value) || 1)
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[2px] w-16 rounded bg-[#363a45]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded bg-[#787b86]",
                            style: {
                                width: `${Math.min(100, band.min / Math.max(band.max, 1) * 100)}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: inputClass,
                        type: "number",
                        disabled: !band.enabled,
                        value: band.max,
                        onChange: (e)=>onChange({
                                ...band,
                                max: Math.max(band.min, Number(e.target.value) || band.min)
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = BandRow;
function VisibilitySettingsPanel({ value, onChange }) {
    const vis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneVisibility"])(value);
    const set = (patch)=>onChange({
            ...vis,
            ...patch
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-0.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: `flex items-center gap-2 py-1.5 ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].text}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        className: "accent-white",
                        checked: vis.ticks,
                        onChange: (e)=>set({
                                ticks: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    "Ticks"
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BandRow, {
                label: "Seconds",
                band: vis.seconds,
                onChange: (seconds)=>set({
                        seconds
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BandRow, {
                label: "Minutes",
                band: vis.minutes,
                onChange: (minutes)=>set({
                        minutes
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BandRow, {
                label: "Hours",
                band: vis.hours,
                onChange: (hours)=>set({
                        hours
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BandRow, {
                label: "Days",
                band: vis.days,
                onChange: (days)=>set({
                        days
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BandRow, {
                label: "Weeks",
                band: vis.weeks,
                onChange: (weeks)=>set({
                        weeks
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BandRow, {
                label: "Months",
                band: vis.months,
                onChange: (months)=>set({
                        months
                    })
            }, void 0, false, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: `flex items-center gap-2 py-1.5 ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$settings$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["settingsUi"].text}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        className: "accent-white",
                        checked: vis.ranges,
                        onChange: (e)=>set({
                                ranges: e.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    "Ranges"
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/VisibilitySettingsPanel.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c1 = VisibilitySettingsPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "BandRow");
__turbopack_context__.k.register(_c1, "VisibilitySettingsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/settings/settings-ui.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsBody",
    ()=>SettingsBody,
    "SettingsBtn",
    ()=>SettingsBtn,
    "SettingsCheck",
    ()=>SettingsCheck,
    "SettingsFieldRow",
    ()=>SettingsFieldRow,
    "SettingsFieldStack",
    ()=>SettingsFieldStack,
    "SettingsFooter",
    ()=>SettingsFooter,
    "SettingsHeader",
    ()=>SettingsHeader,
    "SettingsOverlay",
    ()=>SettingsOverlay,
    "SettingsPanel",
    ()=>SettingsPanel,
    "SettingsSection",
    ()=>SettingsSection,
    "SettingsSelectWrap",
    ()=>SettingsSelectWrap,
    "SettingsTabs",
    ()=>SettingsTabs,
    "settingsUi",
    ()=>settingsUi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs [app-client] (ecmascript) <export default as CircleHelp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ColorPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/ColorPicker.tsx [app-client] (ecmascript)");
"use client";
;
;
const settingsUi = {
    overlay: "fixed inset-0 z-[80] flex items-center justify-center bg-transparent",
    panel: "flex max-h-[min(640px,calc(100vh-48px))] w-full flex-col overflow-hidden rounded-[8px] bg-[var(--app-elevated)] shadow-[0_8px_28px_rgba(0,0,0,0.65)]",
    header: "flex shrink-0 items-center justify-between border-b border-[var(--app-border)] px-5 py-3.5",
    title: "text-[16px] font-semibold text-[var(--app-text)]",
    closeBtn: "flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text)]",
    tabs: "flex shrink-0 gap-4 border-b border-[var(--app-border)] px-5",
    tab: (on)=>`h-9 border-b-2 text-[13px] capitalize ${on ? "border-[var(--app-text)] text-[var(--app-text)]" : "border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]"}`,
    body: "min-h-0 flex-1 overflow-y-auto px-5 py-4",
    footer: "flex shrink-0 items-center justify-between gap-3 border-t border-[var(--app-border)] px-5 py-3.5",
    sectionTitle: "mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[var(--app-muted)]",
    label: "text-[12px] text-[var(--app-muted)]",
    text: "text-[13px] text-[var(--app-text)]",
    muted: "text-[12px] text-[var(--app-muted)]",
    input: "h-8 rounded-[4px] border border-[#363a45] bg-[var(--app-bg)] px-2.5 text-[13px] text-[var(--app-text)] outline-none focus:border-[var(--app-muted)] disabled:opacity-45",
    inputSm: "h-8 w-[88px] rounded-[4px] border border-[#363a45] bg-[var(--app-bg)] px-2 text-[13px] text-[var(--app-text)] outline-none focus:border-[var(--app-muted)] disabled:opacity-45",
    select: "h-8 appearance-none rounded-[4px] border border-[#363a45] bg-[var(--app-bg)] px-2.5 pr-7 text-[13px] text-[var(--app-text)] outline-none focus:border-[var(--app-muted)] disabled:opacity-45",
    navItem: (on)=>`mx-2 flex w-[calc(100%-16px)] items-center gap-2 rounded-[6px] px-2 py-[7px] text-left text-[13px] ${on ? "bg-[var(--app-hover)] text-[var(--app-text)]" : "text-[var(--app-text)] hover:bg-[var(--app-border)]"}`
};
function SettingsOverlay({ onClose, children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${settingsUi.overlay} ${className}`,
        onMouseDown: onClose,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c = SettingsOverlay;
function SettingsPanel({ width = 440, children, className = "", onMouseDown, style, panelRef }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: panelRef,
        className: `${settingsUi.panel} ${className}`,
        style: {
            width: typeof width === "number" ? `${width}px` : width,
            maxWidth: "calc(100vw - 24px)",
            ...style
        },
        onMouseDown: onMouseDown ?? ((e)=>e.stopPropagation()),
        children: children
    }, void 0, false, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c1 = SettingsPanel;
function SettingsHeader({ title, onClose, trailing, onMouseDown }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${settingsUi.header}${onMouseDown ? " cursor-move select-none" : ""}`,
        onMouseDown: onMouseDown,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex min-w-0 items-center gap-2 ${settingsUi.title}`,
                children: title
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-0.5",
                children: [
                    trailing,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: settingsUi.closeBtn,
                        onClick: onClose,
                        title: "Close",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/components/settings/settings-ui.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/settings/settings-ui.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c2 = SettingsHeader;
function SettingsTabs({ tabs, value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: settingsUi.tabs,
        children: tabs.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: settingsUi.tab(value === t),
                onClick: ()=>onChange(t),
                children: t
            }, t, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_c3 = SettingsTabs;
function SettingsBody({ children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${settingsUi.body} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 158,
        columnNumber: 10
    }, this);
}
_c4 = SettingsBody;
function SettingsFooter({ left, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: settingsUi.footer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: left
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this);
}
_c5 = SettingsFooter;
function SettingsBtn({ variant = "secondary", className = "", ...rest }) {
    const base = "h-9 rounded-[4px] px-4 text-[13px] font-semibold transition-colors disabled:opacity-45";
    const styles = variant === "primary" ? "bg-white text-black hover:bg-[#e0e3eb]" : variant === "ghost" ? "border border-[#4c525e] text-(--app-text) hover:border-[#787b86] hover:bg-(--app-hover)" : "border border-[#4c525e] text-(--app-text) hover:border-[#787b86] hover:bg-(--app-hover)";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `${base} ${styles} ${className}`,
        ...rest
    }, void 0, false, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 191,
        columnNumber: 10
    }, this);
}
_c6 = SettingsBtn;
function SettingsSection({ title, hint, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: settingsUi.sectionTitle,
                children: [
                    title,
                    hint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__["CircleHelp"], {
                        size: 12,
                        className: "text-[#4c525e]"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/settings-ui.tsx",
                        lineNumber: 207,
                        columnNumber: 17
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2.5",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_c7 = SettingsSection;
function SettingsFieldStack({ label, hint, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block min-w-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `mb-1.5 flex items-center gap-1 ${settingsUi.label}`,
                children: [
                    label,
                    hint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__["CircleHelp"], {
                        size: 12,
                        className: "text-[#4c525e]"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/settings-ui.tsx",
                        lineNumber: 228,
                        columnNumber: 17
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
_c8 = SettingsFieldStack;
function SettingsFieldRow({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center justify-between gap-3 py-1 ${settingsUi.text}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
_c9 = SettingsFieldRow;
function SettingsCheck({ label, hint, checked, onChange, disabled, extra, indent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-start gap-2 py-0.5 ${indent ? "pl-5" : ""} ${disabled ? "opacity-45" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                className: "mt-[3px] accent-white",
                checked: checked,
                disabled: disabled,
                onChange: (e)=>onChange(e.target.checked)
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-center gap-2 ${settingsUi.text}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/components/settings/settings-ui.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this),
                            extra
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/settings-ui.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this),
                    hint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `mt-0.5 ${settingsUi.muted}`,
                        children: hint
                    }, void 0, false, {
                        fileName: "[project]/components/settings/settings-ui.tsx",
                        lineNumber: 286,
                        columnNumber: 17
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 281,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 269,
        columnNumber: 5
    }, this);
}
_c10 = SettingsCheck;
;
function SettingsSelectWrap({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px] text-(--app-muted)",
                children: "▾"
            }, void 0, false, {
                fileName: "[project]/components/settings/settings-ui.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/settings-ui.tsx",
        lineNumber: 296,
        columnNumber: 5
    }, this);
}
_c11 = SettingsSelectWrap;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "SettingsOverlay");
__turbopack_context__.k.register(_c1, "SettingsPanel");
__turbopack_context__.k.register(_c2, "SettingsHeader");
__turbopack_context__.k.register(_c3, "SettingsTabs");
__turbopack_context__.k.register(_c4, "SettingsBody");
__turbopack_context__.k.register(_c5, "SettingsFooter");
__turbopack_context__.k.register(_c6, "SettingsBtn");
__turbopack_context__.k.register(_c7, "SettingsSection");
__turbopack_context__.k.register(_c8, "SettingsFieldStack");
__turbopack_context__.k.register(_c9, "SettingsFieldRow");
__turbopack_context__.k.register(_c10, "SettingsCheck");
__turbopack_context__.k.register(_c11, "SettingsSelectWrap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_settings_1n_7csj._.js.map